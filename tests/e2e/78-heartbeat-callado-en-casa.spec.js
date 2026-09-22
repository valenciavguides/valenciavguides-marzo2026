/**
 * 78 — En modo CASA, con el heartbeat pausado, los hijos no deben recibir latidos (F5)
 *
 * POR QUE EXISTE
 *
 * En CASA el bus pausa su heartbeat a proposito (`pausarHeartbeat`), y es el unico latido
 * periodico que debe haber. `js/monitoreo.js` tenia otro que mandaba `SISTEMA.HEARTBEAT` a todos
 * los iframes cada 5 s, no se paraba nunca y anulaba esa pausa: los hijos contestaban cada vez.
 * Ver docs/mensajeria-duplicada-en-hijos.md, §13 y Parte II, F5.
 *
 *   HC-1  Control: un latido enviado por el bus a hijo2 llega a la escucha. Demuestra que la
 *         escucha funciona, para que un HC-2 en verde no pueda deberse a una escucha rota.
 *   HC-2  Camino real: tras entrar en CASA (heartbeat del bus pausado), durante 12 s hijo2 no
 *         recibe ningun latido del padre.
 *
 * ROJO ANTES QUE VERDE: HC-2 falla si vuelve a haber un latido que no respete la pausa de
 * CASA, y el mensaje dice quien late (`origen`).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);

const escucharLatidos = (page) => frame(page, 'hijo2').evaluate(() => {
  globalThis.__latidos = [];
  globalThis.addEventListener('message', (e) => {
    if (e.source === globalThis.parent && e.data && e.data.tipo === 'SISTEMA.HEARTBEAT') {
      globalThis.__latidos.push(e.data.origen || '(sin origen)');
    }
  });
});
const latidos = (page) => frame(page, 'hijo2').evaluate(() => globalThis.__latidos);
const estadoHeartbeat = (page) => page.evaluate(async () => {
  const hb = await globalThis.__vv_stateManager?.getHeartbeat?.();
  return hb ? { activo: !!hb.activo, userPaused: !!hb.userPaused } : null;
});

test.describe('HC — En CASA el heartbeat se calla', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
  });

  test('HC-1. Control: un latido enviado por el bus llega a la escucha de hijo2', async ({ page }) => {
    await escucharLatidos(page);
    await page.evaluate(() => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT, destino: 'hijo2', datos: { timestamp: Date.now() },
    }));
    await expect.poll(() => latidos(page), { timeout: 5_000 }).not.toHaveLength(0);
  });

  test('HC-2. Camino real: en CASA, con el heartbeat pausado, hijo2 no recibe latidos', async ({ page }) => {
    test.setTimeout(90_000);
    const disponible = await page.evaluate(() => globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true);
    test.skip(!disponible, 'sin handler de SISTEMA.CAMBIO_MODO');

    // Entrar en CASA por el camino real. Si desde el arranque no pausa, se hace el recorrido
    // completo AVENTURA -> CASA, que es cuando la app lo pausa.
    // Se espera a la CONDICION —que el latido quede pausado—, no a un tiempo. Los `catch` son a
    // proposito: que no se cumpla no es un fallo aqui, es lo que decide si hace falta el
    // recorrido completo AVENTURA -> CASA; el `test.skip` de abajo es quien juzga.
    const latidoPausado = async () => (await estadoHeartbeat(page))?.userPaused === true;
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'casa' } }));
    await expect.poll(latidoPausado, { timeout: 4_000 }).toBe(true).catch(() => {});
    let hb = await estadoHeartbeat(page);
    if (!hb || !hb.userPaused) {
      await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
      await expect
        .poll(() => page.evaluate(() => globalThis.estadoPadre?.modo?.actual), { timeout: 6_000 })
        .toBe('aventura').catch(() => {});
      await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'casa' } }));
      await expect.poll(latidoPausado, { timeout: 6_000 }).toBe(true).catch(() => {});
      hb = await estadoHeartbeat(page);
    }
    test.skip(!hb || !hb.userPaused || hb.activo,
      `Precondicion no alcanzada: el heartbeat del bus no quedo pausado en CASA (${JSON.stringify(hb)})`);

    await escucharLatidos(page);
    // VENTANA-OBSERVACION: se demuestra que NO llega ningun latido; 12 s cubre dos intervalos
    await page.waitForTimeout(12_000);
    const recibidos = await latidos(page);
    const porOrigen = recibidos.reduce((acc, o) => { acc[o] = (acc[o] || 0) + 1; return acc; }, {});
    expect(
      recibidos.length,
      `F5: con el heartbeat del bus pausado en CASA, hijo2 no debe recibir latidos. Recibidos en 12 s: ${JSON.stringify(porOrigen)}`,
    ).toBe(0);
  });
});
