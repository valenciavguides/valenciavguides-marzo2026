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
 *   (H5-4 probaba que hijo5 aparcaba un CAMBIO_MODO temprano y se lo aplicaba a sí mismo. Ya no
 *   aparca nada: el modo le llega por un solo camino, y lo cubre 84, CM-hijo5.)
 *   H5-5  Camino real de F2: un error lanzado dentro de hijo5 llega al padre por la captura
 *         automatica de utils.js. Que hijo5 importe utils.js hace DEDUCIR que la captura esta
 *         instalada; esto lo comprueba.
 *
 * ROJO ANTES QUE VERDE: mientras hijo5 no cargue el bus, H5-2, H5-3 y H5-5 fallan.
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

  test('H5-5. Camino real: un error lanzado en hijo5 llega al padre', async ({ page }) => {
    test.setTimeout(60_000);
    const avisos = [];
    page.on('console', (m) => { if (/nunca estuvo disponible/i.test(m.text())) avisos.push(m.text()); });
    await escucharErrores(page, 'escenario-H5-5');

    await frameHijo5(page).evaluate(() => {
      setTimeout(() => { throw new Error('escenario-H5-5'); }, 0);
    });

    // Se espera a la LLEGADA, no un tiempo fijo: con el bus cargado el aviso llega enseguida.
    // Los 13 s son solo el techo, para no dar por perdido uno que tarde: cubren entero el plazo
    // de la captura, que reintenta 10 s antes de rendirse. El fallo del poll se ignora a
    // proposito: el expect de abajo es el que informa, con los avisos del hijo tal como esten
    // en ese momento (el `message` de un poll se evalua al crearlo y saldria vacio).
    await expect.poll(() => page.evaluate(() => globalThis.__errHijo5.length), { timeout: 13_000 }).toBeGreaterThan(0).catch(() => {});
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
