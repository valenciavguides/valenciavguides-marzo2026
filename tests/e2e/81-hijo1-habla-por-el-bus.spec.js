/**
 * 81 — hijo1 habla por el bus, no por su copia de los envoltorios
 *
 * POR QUE EXISTE
 *
 * hijo1 llevaba unas 130 lineas de envoltorios propios: un `enviarMensaje` que hacia
 * `parent.postMessage` a pelo, un `registrarControlador` que ponia su propio listener, y un
 * `messagingAdapter` con otro par de funciones mas. Tres copias de lo mismo, con garantias
 * distintas entre si y distintas de las del bus.
 *
 * La consecuencia visible es que `js/utils.js` instala en todo iframe una captura de `error` y
 * `unhandledrejection` que avisa al padre, pero envia por `globalThis.mensajeria.enviarMensaje`
 * —el bus del propio frame— que en hijo1 no existia: cada error se encolaba, se reintentaba 10 s
 * y se descartaba.
 *
 * Se mira la LLEGADA del mensaje a la ventana del padre, no los logs: la consola la comparten
 * todos los frames, y el aviso con el que el propio hijo se rinde contiene el mismo texto.
 *
 *   H1-1  Control: un SISTEMA.ERROR enviado a mano desde hijo1 llega a la ventana del padre.
 *         Sin esto, un H1-2 en rojo podria deberse a que la escucha no funciona.
 *   H1-2  hijo1 tiene el bus montado y se identifica con el id con el que esta registrado.
 *   H1-3  Camino real: un error lanzado dentro de hijo1 llega al padre por la captura
 *         automatica de utils.js, sin que nadie lo reenvie a mano.
 *   H1-4  hijo1 contesta al latido Y la respuesta LLEGA al padre. No basta con que conteste:
 *         un hijo marcado `recuperable` cuya respuesta no llega al padre se da por caido a los
 *         tres latidos y el bus le recarga el iframe — cada 15 s, indefinidamente, sin error.
 *         Ningun otro spec cubria el viaje de vuelta.
 *
 * ROJO ANTES QUE VERDE: mientras hijo1 no cargue el bus, H1-2 y H1-3 fallan. H1-4 falla si la
 * respuesta deja de salir o va dirigida a algo que el bus no sabe enrutar — verificado dirigiendo
 * la respuesta a un destino inexistente.
 *
 * OJO al migrar los demas hijos: que un hijo conteste no basta, la respuesta tiene que LLEGAR.
 * Este viaje de vuelta no lo cubria ningun spec, y su fallo es mudo: el padre da al hijo por
 * caido a los 3 latidos y, si esta marcado `recuperable`, le recarga el iframe cada 15 s.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const ID = 'hijo1-opciones';
const frameHijo1 = (page) => page.frames().find((f) => f.name() === ID);

/** Escucha en la ventana del padre los SISTEMA.ERROR que traigan la marca. */
const escucharErrores = (page, marca) => page.evaluate((m) => {
  globalThis.__errHijo1 = [];
  globalThis.addEventListener('message', (e) => {
    const d = e.data;
    if (d && d.tipo === 'SISTEMA.ERROR' && String(d.datos?.mensaje || '').includes(m)) {
      globalThis.__errHijo1.push({ origen: d.origen, codigo: d.datos?.codigo });
    }
  });
}, marca);
const recibidos = (page) => page.evaluate(() => globalThis.__errHijo1);

test.describe('H1 — hijo1 habla por el bus', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(
      (id) => !!document.getElementById(id)?.contentWindow?.logger,
      ID,
      { timeout: 60_000 },
    );
  });

  test('H1-1. Control: un SISTEMA.ERROR enviado desde hijo1 llega a la ventana del padre', async ({ page }) => {
    await escucharErrores(page, 'control-H1');
    await frameHijo1(page).evaluate((id) => {
      globalThis.parent.postMessage({
        tipo: 'SISTEMA.ERROR', origen: id,
        datos: { codigo: 'ERROR_NO_CONTROLADO', mensaje: 'control-H1' },
      }, globalThis.location.origin);
    }, ID);
    await expect.poll(() => recibidos(page), { timeout: 5_000 }).toHaveLength(1);
  });

  test('H1-2. hijo1 tiene el bus montado y se identifica con su id registrado', async ({ page }) => {
    const estado = await frameHijo1(page).evaluate(() => ({
      hayBus: typeof globalThis.mensajeria?.enviarMensaje === 'function',
      inicializado: globalThis.mensajeria?.estaInicializado?.() === true,
      id: globalThis.mensajeria?.getComponenteId?.() || null,
    }));
    expect(estado.hayBus, 'hijo1 tiene que cargar js/mensajeria.js, no su propia copia').toBe(true);
    expect(estado.inicializado, 'y tenerlo inicializado').toBe(true);
    expect(
      estado.id,
      'con el MISMO id con el que el padre lo registro: si no coinciden, el padre le escribe a un sitio y el se presenta como otro',
    ).toBe(ID);
  });

  test('H1-3. Camino real: un error lanzado en hijo1 llega al padre', async ({ page }) => {
    test.setTimeout(60_000);
    const avisosHijo = [];
    page.on('console', (m) => { if (/nunca estuvo disponible/i.test(m.text())) avisosHijo.push(m.text()); });
    await escucharErrores(page, 'escenario-H1-3');

    await frameHijo1(page).evaluate(() => {
      setTimeout(() => { throw new Error('escenario-H1-3'); }, 0);
    });

    // Se espera a la LLEGADA, no un tiempo fijo: con el bus cargado el aviso llega enseguida.
    // Los 13 s son solo el techo, para no dar por perdido uno que tarde: cubren entero el plazo
    // de la captura, que reintenta 10 s antes de rendirse. El fallo del poll se ignora a
    // proposito: el expect de abajo es el que informa, con los avisos del hijo tal como esten
    // en ese momento (el `message` de un poll se evalua al crearlo y saldria vacio).
    await expect.poll(async () => (await recibidos(page)).length, { timeout: 13_000 }).toBeGreaterThan(0).catch(() => {});
    const r = await recibidos(page);
    expect(
      r.length,
      'el error de hijo1 tiene que llegar al padre como SISTEMA.ERROR ERROR_NO_CONTROLADO'
        + (avisosHijo.length ? ` — el hijo se rindio: "${avisosHijo[0].slice(0, 120)}"` : ''),
    ).toBeGreaterThan(0);
    expect(r[0].codigo).toBe('ERROR_NO_CONTROLADO');
    expect(r[0].origen, 'y decir de quien viene, que lo pone el bus').toBe(ID);
  });

  test('H1-4. hijo1 contesta al latido y la respuesta llega al padre', async ({ page }) => {
    // Escuchar en la VENTANA DEL PADRE, que es quien tiene que recibirla. Mirar solo el log del
    // hijo diria "he contestado" aunque la respuesta se descarte por el camino.
    await page.evaluate((id) => {
      globalThis.__latidosDeVuelta = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.tipo === 'SISTEMA.HEARTBEAT_RESPONSE' && e.data?.origen === id) {
          globalThis.__latidosDeVuelta.push(e.data.origen);
        }
      });
    }, ID);

    await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
      destino: id,
      datos: { timestamp: Date.now() },
    }), ID);

    await expect
      .poll(() => page.evaluate(() => globalThis.__latidosDeVuelta.length), {
        timeout: 8_000,
        message: 'sin esta respuesta el padre da a hijo1 por caido a los 3 latidos y, al estar '
          + 'marcado recuperable, le recarga el iframe cada 15 s sin que nada lo denuncie',
      })
      .toBeGreaterThan(0);
  });
});
