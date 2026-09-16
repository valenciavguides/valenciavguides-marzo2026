/**
 * 83 — hijo5 habla por el bus, no por su copia de los envoltorios
 *
 * POR QUE EXISTE
 *
 * Mismo caso que hijo1 (spec 81): hijo5 lleva su propio `enviarMensaje` que hace
 * `parent.postMessage` a pelo, su propio `registrarControlador`, un `messagingAdapter` y un
 * `safeRegistrar` encima. Cuatro capas con garantias distintas entre si y distintas del bus.
 *
 * hijo5 es herramienta de solo-desarrollo (ver project_hijo5_devonly) y por eso va el segundo:
 * el riesgo de romper algo al migrarlo es el menor de los siete.
 *
 * Lo aprendido migrando hijo1, y que aqui se comprueba desde el principio:
 *
 *   H5-1  Control: un SISTEMA.ERROR enviado a mano desde hijo5 llega a la ventana del padre.
 *   H5-2  hijo5 tiene el bus montado y se identifica con el id con el que esta registrado.
 *   H5-3  hijo5 contesta al latido Y la respuesta LLEGA al padre. Que conteste no basta: si la
 *         respuesta se pierde por el camino, el padre lo da por caido a los 3 latidos.
 *   H5-4  El auto-mensaje funciona. hijo5 se manda a si mismo un SISTEMA.CAMBIO_MODO para
 *         aplicar un cambio pendiente; `enviarMensaje` no puede entregarselo (uno no esta entre
 *         sus propios iframes registrados), y para eso existe `despacharLocal`.
 *   H5-5  Camino real de F2: un error lanzado dentro de hijo5 llega al padre por la captura
 *         automatica de utils.js. Que hijo5 importe utils.js hace DEDUCIR que la captura esta
 *         instalada; esto lo comprueba.
 *
 * ROJO ANTES QUE VERDE: mientras hijo5 no cargue el bus, H5-2, H5-3, H5-4 y H5-5 fallan.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const ID = 'hijo5';
const frameHijo5 = (page) => page.frames().find((f) => f.name() === ID);

const escucharErrores = (page, marca) => page.evaluate((m) => {
  globalThis.__errHijo5 = [];
  globalThis.addEventListener('message', (e) => {
    const d = e.data;
    if (d && d.tipo === 'SISTEMA.ERROR' && String(d.datos?.mensaje || '').includes(m)) {
      globalThis.__errHijo5.push({ origen: d.origen, codigo: d.datos?.codigo });
    }
  });
}, marca);

test.describe('H5 — hijo5 habla por el bus', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    // hijo5 no se carga en P14 como los demas: entra por su propio cargador.
    await page.evaluate(() => globalThis.cargarHijoCasa?.());
    await page.waitForFunction(
      (id) => !!document.getElementById(id)?.contentWindow?.logger,
      ID,
      { timeout: 60_000 },
    );
  });

  test('H5-1. Control: un SISTEMA.ERROR enviado desde hijo5 llega a la ventana del padre', async ({ page }) => {
    await escucharErrores(page, 'control-H5');
    await frameHijo5(page).evaluate((id) => {
      globalThis.parent.postMessage({
        tipo: 'SISTEMA.ERROR', origen: id,
        datos: { codigo: 'ERROR_NO_CONTROLADO', mensaje: 'control-H5' },
      }, globalThis.location.origin);
    }, ID);
    await expect
      .poll(() => page.evaluate(() => globalThis.__errHijo5.length), { timeout: 5_000 })
      .toBe(1);
  });

  test('H5-2. hijo5 tiene el bus montado y se identifica con su id registrado', async ({ page }) => {
    const estado = await frameHijo5(page).evaluate(() => ({
      hayBus: typeof globalThis.mensajeria?.enviarMensaje === 'function',
      inicializado: globalThis.mensajeria?.estaInicializado?.() === true,
      id: globalThis.mensajeria?.getComponenteId?.() || null,
      hayDespacharLocal: typeof globalThis.mensajeria?.despacharLocal === 'function',
    }));
    expect(estado.hayBus, 'hijo5 tiene que cargar js/mensajeria.js, no su propia copia').toBe(true);
    expect(estado.inicializado, 'y tenerlo inicializado').toBe(true);
    expect(estado.hayDespacharLocal, 'y con despacharLocal, que es como se manda algo a si mismo').toBe(true);
    expect(
      estado.id,
      'con el MISMO id con el que el padre lo registro: si no coinciden, el padre le escribe a un sitio y el se presenta como otro',
    ).toBe(ID);
  });

  test('H5-3. hijo5 contesta al latido y la respuesta llega al padre', async ({ page }) => {
    await page.evaluate((id) => {
      globalThis.__latidosH5 = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.tipo === 'SISTEMA.HEARTBEAT_RESPONSE' && e.data?.origen === id) {
          globalThis.__latidosH5.push(e.data.origen);
        }
      });
    }, ID);

    await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
      destino: id,
      datos: { timestamp: Date.now() },
    }), ID);

    await expect
      .poll(() => page.evaluate(() => globalThis.__latidosH5.length), {
        timeout: 8_000,
        message: 'sin esta respuesta el padre da a hijo5 por caido a los 3 latidos',
      })
      .toBeGreaterThan(0);
  });

  // Recorre el CAMINO REAL, no un tipo inventado: el padre manda un CAMBIO_MODO antes de que
  // hijo5 haya terminado su handshake (carrera de arranque real), hijo5 lo guarda como pendiente
  // y responde NACK, y al confirmarse su UI se lo aplica a si mismo con `despacharLocal` —
  // `enviarMensaje` no puede entregarselo, porque uno no esta entre sus propios iframes.
  //
  // LO QUE ESTE TEST NO DISTINGUE, y conviene saberlo: el modo aparcado acaba aplicandose por
  // DOS caminos independientes. El auto-mensaje de hijo5, y el reintento del padre alimentado
  // por ese mismo NACK (`pendingModeChanges`, codigo-padre.html). Comprobado rompiendo el
  // auto-mensaje: el test sigue verde porque el reintento del padre llega igual. Asi que esto
  // verifica el RESULTADO (el modo aparcado se aplica), no cual de los dos lo consiguio.
  // Dos caminos al mismo efecto es justo lo que la unificacion quiere quitar: queda anotado en
  // docs/mensajeria-duplicada-en-hijos.md para decidirlo, no se toca aqui.
  test('H5-4. Un CAMBIO_MODO llegado antes de tiempo acaba aplicandose', async ({ page }) => {
    // Se mira lo que hijo5 le MANDA al padre, no sus variables: su `estado` es local del módulo
    // y no está en globalThis — y aunque lo estuviera, el efecto que importa es el observable.
    await page.evaluate((id) => {
      globalThis.__deH5 = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.origen === id) globalThis.__deH5.push({ tipo: e.data.tipo, datos: e.data.datos });
      });
    }, ID);

    // 1) CAMBIO_MODO sin `secuenciaCompleta`: hijo5 lo aparca y contesta NACK pidiendo permiso.
    await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
      destino: id,
      datos: { modo: 'aventura' },
    }), ID);

    await expect
      .poll(() => page.evaluate(() => globalThis.__deH5.filter((m) => /NACK/.test(m.tipo)).length), {
        timeout: 8_000,
        message: 'hijo5 tiene que rechazar un CAMBIO_MODO fuera de secuencia y guardarlo como pendiente',
      })
      .toBeGreaterThan(0);

    // 2) La confirmación de la UI es lo que dispara que el pendiente se aplique, y para aplicarlo
    //    hijo5 se manda el mensaje A SÍ MISMO. Si ese auto-envío no llega a su propio handler, el
    //    cambio se queda aparcado para siempre y nadie se entera.
    await page.evaluate(() => { globalThis.__deH5.length = 0; });
    await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.PADRE_CONFIRMA_HIJO_LISTO,
      destino: id,
      datos: { modoInicial: 'casa' },
    }), ID);

    // Se exige el acuse DEL MODO APARCADO ('aventura'), no un acuse cualquiera: durante estos
    // segundos el padre propaga sus propios cambios de modo ('casa'), y hijo5 los acusa igual.
    // Sin esta distinción el test pasa aunque el auto-mensaje no llegue nunca — comprobado
    // revirtiendo el arreglo.
    await expect
      .poll(() => page.evaluate(() => globalThis.__deH5
        .filter((m) => /CAMBIO_MODO_(ENTENDIDO|EFECTUADO)/.test(m.tipo))
        .map((m) => m.datos?.modo ?? m.datos?.modoAplicado ?? '(sin modo)')), {
        timeout: 12_000,
        message: 'tras confirmar la UI, el CAMBIO_MODO aparcado (aventura) tiene que procesarse de '
          + 'verdad: eso se ve porque hijo5 acusa ESE modo al padre, no otro',
      })
      .toContain('aventura');
  });

  test('H5-5. Camino real: un error lanzado en hijo5 llega al padre', async ({ page }) => {
    test.setTimeout(60_000);
    const avisos = [];
    page.on('console', (m) => { if (/nunca estuvo disponible/i.test(m.text())) avisos.push(m.text()); });
    await escucharErrores(page, 'escenario-H5-5');

    await frameHijo5(page).evaluate(() => {
      setTimeout(() => { throw new Error('escenario-H5-5'); }, 0);
    });

    // La captura de utils.js reintenta 10 s antes de rendirse: 13 s cubre su plazo entero.
    await page.waitForTimeout(13_000);
    const r = await page.evaluate(() => globalThis.__errHijo5);
    expect(
      r.length,
      'el error de hijo5 tiene que llegar al padre como SISTEMA.ERROR ERROR_NO_CONTROLADO'
      + (avisos.length ? ` — el hijo se rindio: "${avisos[0].slice(0, 120)}"` : ''),
    ).toBeGreaterThan(0);
    expect(r[0].codigo).toBe('ERROR_NO_CONTROLADO');
    expect(r[0].origen, 'y decir de quien viene, que lo pone el bus').toBe(ID);
  });
});
