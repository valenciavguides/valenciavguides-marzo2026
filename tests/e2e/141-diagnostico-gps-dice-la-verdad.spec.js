/**
 * 141-diagnostico-gps-dice-la-verdad.spec.js
 *
 * El estado del sensor GPS tiene un solo dueño en el padre, `estadoPadre.gps` (`activo`, `watchId`, `permisos` y `error`, que
 * escriben `activarGPS()` y sus callbacks), y el diagnóstico de consola (`diagnosticarGPS()`, `js/funciones-mapa.js`) lo lee
 * de ahí. El espejo del mapa (`sincronizarEstadoGPSConPadre()`) copia al padre solo lo que escribe el mapa (estudio K-116 y
 * K-122).
 *
 *   DG-1  Control: antes de activar el GPS, el diagnóstico dice que no está activo.
 *   DG-2  Con el GPS activado por `activarGPS()` (permiso concedido y una posición), el diagnóstico dice que está activo.
 *   DG-3  Los permisos son del padre: tras activar, el espejo del mapa no los pisa, y el diagnóstico dice que están concedidos.
 *
 * ROJO ANTES QUE VERDE: con el `js/funciones-mapa.js` anterior caen DG-2 (el diagnóstico leía `estadoMapa.gpsActivo`, que en el
 * padre no llegaba a `true`) y DG-3 (el espejo copiaba sobre los permisos del padre `estadoMapa.gpsPermisos`, que se quedaba en
 * `null`). DG-1 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const diagnostico = (page) => page.evaluate(async () => {
  const { diagnosticarGPS } = await import('/js/funciones-mapa.js');
  return (await diagnosticarGPS()).gpsEstado;
});

/** Activa el GPS con `activarGPS()` y espera a que el padre lo dé por activo: `activo` y un `watchId`. */
async function activarYEsperar(page) {
  await page.evaluate(() => globalThis.activarGPS());
  await expect.poll(() => page.evaluate(() => {
    const g = globalThis.estadoPadre?.gps;
    return g?.activo === true && g?.watchId !== null && g?.watchId !== undefined;
  }), { timeout: 15_000 }).toBe(true);
}

test.describe('DG — El diagnóstico del GPS dice la verdad', () => {
  test.beforeEach(async ({ context, page }) => {
    // Firefox: el permiso y la posición, ANTES de cargar la página (si no, se cuelga).
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.4747, longitude: -0.3762, accuracy: 4 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('DG-1. Control: antes de activar el GPS, no está activo', async ({ page }) => {
    expect(await page.evaluate(() => globalThis.estadoPadre?.gps?.activo === true)).toBe(false);
    expect((await diagnostico(page)).activo).toBe(false);
  });

  test('DG-2. Con el GPS activado, el diagnóstico dice que está activo', async ({ page }) => {
    await activarYEsperar(page);
    expect((await diagnostico(page)).activo).toBe(true);
  });

  test('DG-3. Los permisos son del padre: el espejo del mapa no los pisa', async ({ page }) => {
    await activarYEsperar(page);
    // limpiarRecursos() termina en sincronizarEstadoGPSConPadre(), el espejo del mapa (el mismo disparador que el spec 52).
    await page.evaluate(() => globalThis.funcionesMapa.limpiarRecursos());
    expect(await page.evaluate(() => globalThis.estadoPadre.gps.permisos), 'los concedió activarGPS()').toBe(true);
    expect((await diagnostico(page)).gpsPermisos, 'y el diagnóstico dice lo mismo').toBe(true);
  });
});
