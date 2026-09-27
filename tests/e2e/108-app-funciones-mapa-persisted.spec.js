'use strict';

/**
 * 108 — Paso 9 de la lavadora ("el resto de F4"): js/app.js y js/funciones-mapa.js también
 * necesitan mirar `event.persisted`
 *
 * POR QUE EXISTE
 *
 * El padre ya separa los dos viajes de `pagehide` en su propio `_limpiarPagehide` (cierre real
 * vs. guardado en la cache de atrás, `event.persisted`) — spec 77, F4. Pero en la MISMA ventana
 * del padre, `js/app.js` y `js/funciones-mapa.js` registran su PROPIO listener de `pagehide`,
 * cada uno con su propia "limpieza agresiva de globales", y ninguno de los dos mira
 * `persisted`: borran `globalThis.estado` (app.js) y `globalThis.funcionesMapa` + destruyen la
 * instancia del mapa (funciones-mapa.js) igual si la página se cierra de verdad que si el
 * navegador solo la congela para la cache de atrás. El spec 77 no lo detecta porque solo cuenta
 * iframes, no estos dos globales.
 *
 * Mismo motivo que el spec 77 para no navegar de verdad: los cuatro navegadores de Playwright
 * nunca restauran desde bfcache (medido). Se disparan los dos eventos sintéticos que el
 * navegador lanza en el viaje real, con `persisted: true`.
 *
 *   AJ-1  Tras pagehide(persisted) + pageshow(persisted), `globalThis.estado` sigue existiendo.
 *   AJ-2  Tras el mismo viaje, `globalThis.funcionesMapa` sigue existiendo.
 *   AJ-3  Control: un pagehide SIN persisted (cierre real) sigue limpiando los dos globales —
 *         la guarda nueva no debe apagar la limpieza real, solo la del viaje a la cache.
 *
 * ROJO ANTES DEL ARREGLO: AJ-1 y AJ-2 fallaban (ambos globales quedaban borrados). AJ-3 ya
 * pasaba antes del arreglo y sigue pasando después — control de que no se rompió el cierre real.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function viajarPorLaCacheDeAtras(page) {
  await page.evaluate(async () => {
    globalThis.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    globalThis.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    await new Promise((r) => setTimeout(r, 500));
  });
}

test.describe('AJ — app.js y funciones-mapa.js respetan persisted en pagehide', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('AJ-1. globalThis.estado sobrevive a un pagehide(persisted) — no lo borra app.js', async ({ page }) => {
    const antes = await page.evaluate(() => typeof globalThis.estado !== 'undefined');
    expect(antes, 'precondicion: estado existe antes del viaje').toBe(true);

    await viajarPorLaCacheDeAtras(page);

    const despues = await page.evaluate(() => typeof globalThis.estado !== 'undefined');
    expect(despues, 'F4: restaurada de la cache de atrás, globalThis.estado no debe desaparecer').toBe(true);
  });

  test('AJ-2. globalThis.funcionesMapa sobrevive a un pagehide(persisted) — no lo borra funciones-mapa.js', async ({ page }) => {
    const antes = await page.evaluate(() => typeof globalThis.funcionesMapa !== 'undefined');
    expect(antes, 'precondicion: funcionesMapa existe antes del viaje').toBe(true);

    await viajarPorLaCacheDeAtras(page);

    const despues = await page.evaluate(() => typeof globalThis.funcionesMapa !== 'undefined');
    expect(despues, 'F4: restaurada de la cache de atrás, globalThis.funcionesMapa no debe desaparecer').toBe(true);
  });

  test('AJ-3. Control: un pagehide sin persisted (cierre real) sigue limpiando estado y funcionesMapa', async ({ page }) => {
    const antes = await page.evaluate(() => ({
      estado: typeof globalThis.estado !== 'undefined',
      funcionesMapa: typeof globalThis.funcionesMapa !== 'undefined',
    }));
    expect(antes.estado, 'precondicion: estado existe').toBe(true);
    expect(antes.funcionesMapa, 'precondicion: funcionesMapa existe').toBe(true);

    await page.evaluate(async () => {
      globalThis.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
      await new Promise((r) => setTimeout(r, 500));
    });

    const despues = await page.evaluate(() => ({
      estado: typeof globalThis.estado !== 'undefined',
      funcionesMapa: typeof globalThis.funcionesMapa !== 'undefined',
    }));
    expect(despues.estado, 'un cierre real SÍ debe seguir borrando estado').toBe(false);
    expect(despues.funcionesMapa, 'un cierre real SÍ debe seguir borrando funcionesMapa').toBe(false);
  });
});
