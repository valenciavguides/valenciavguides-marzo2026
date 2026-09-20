/**
 * 75 — Un error no controlado dentro de un hijo tiene que llegar al padre (F2)
 *
 * POR QUE EXISTE
 *
 * `js/utils.js` instala en todos los iframes una captura de `error` y `unhandledrejection`
 * que avisa al padre con `SISTEMA.ERROR { codigo: 'ERROR_NO_CONTROLADO' }`. Envia por
 * `globalThis.mensajeria.enviarMensaje` —el bus del propio frame—, asi que en un frame SIN bus
 * cada error se encola, se reintenta 10 s y se descarta. La seleccion carga el bus, y este spec
 * comprueba que en ella el aviso llega. El spec 58 prueba la captura con un
 * `globalThis.mensajeria` falso; aqui no se inventa nada.
 *
 * Se mira la LLEGADA del mensaje a la ventana del padre, no los logs: la consola la
 * comparten todos los frames, y el aviso con el que el propio hijo se rinde contiene el
 * mismo texto del error.
 *
 *   EH-1  Control: un SISTEMA.ERROR enviado desde seleccion llega a la ventana del padre.
 *   EH-2  Camino real: un error lanzado dentro de seleccion llega al padre por la captura
 *         automatica de utils.js.
 *
 * ROJO ANTES QUE VERDE: sin el bus en la seleccion EH-2 falla, y quitando del bus el sellado
 * de `origen` falla su ultima comprobacion (medido).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const frameSeleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

/** Escucha en la ventana del padre los SISTEMA.ERROR que traigan la marca. */
const escucharErrores = (page, marca) => page.evaluate((m) => {
  globalThis.__errRecibidos = [];
  globalThis.addEventListener('message', (e) => {
    const d = e.data;
    if (d && d.tipo === 'SISTEMA.ERROR' && String(d.datos?.mensaje || '').includes(m)) {
      globalThis.__errRecibidos.push({ origen: d.origen, codigo: d.datos?.codigo });
    }
  });
}, marca);
const recibidos = (page) => page.evaluate(() => globalThis.__errRecibidos);

test.describe('EH — Errores de un hijo llegan al padre', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => !!document.getElementById('seleccion')?.contentWindow?.logger, null, { timeout: 20_000 });
  });

  test('EH-1. Control: un SISTEMA.ERROR enviado desde seleccion llega a la ventana del padre', async ({ page }) => {
    await escucharErrores(page, 'control-EH1');
    await frameSeleccion(page).evaluate(() => {
      globalThis.parent.postMessage({
        tipo: 'SISTEMA.ERROR', origen: 'seleccion',
        datos: { codigo: 'ERROR_NO_CONTROLADO', mensaje: 'control-EH1' },
      }, globalThis.location.origin);
    });
    await expect.poll(() => recibidos(page), { timeout: 5_000 }).toHaveLength(1);
  });

  test('EH-2. Camino real: un error lanzado en seleccion llega al padre', async ({ page }) => {
    const avisosHijo = [];
    page.on('console', (m) => { if (/nunca estuvo disponible/i.test(m.text())) avisosHijo.push(m.text()); });
    await escucharErrores(page, 'escenario-EH2');

    await frameSeleccion(page).evaluate(() => {
      setTimeout(() => { throw new Error('escenario-EH2'); }, 0);
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
      'F2: el error tiene que llegar al padre como SISTEMA.ERROR ERROR_NO_CONTROLADO'
        + (avisosHijo.length ? ` — el hijo se rindio: "${avisosHijo[0].slice(0, 120)}"` : ''),
    ).toBeGreaterThan(0);
    expect(r[0].codigo).toBe('ERROR_NO_CONTROLADO');
    // Y dice de qué frame viene. Lo sella el bus (`origen: origen || componenteId`), no
    // utils.js, así que solo se puede comprobar aquí, con el bus real: el spec 58 lo salta
    // con un stub. El valor exacto es el id con el que la selección inicializa su bus.
    expect(r[0].origen, 'el aviso tiene que decir de qué frame viene').toBe('seleccion');
  });
});
