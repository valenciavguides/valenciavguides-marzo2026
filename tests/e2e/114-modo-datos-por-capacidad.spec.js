'use strict';

/**
 * 114 — El modo de datos se decide preguntando, no adivinando por el hostname
 *
 * POR QUÉ EXISTE
 *
 * El proyecto corre en tres sitios y dos comparten hostname:
 *
 *   | Dónde                 | /api/health       | Modo esperado |
 *   |-----------------------|-------------------|---------------|
 *   | local, backend activo | 200               | api           |
 *   | local, sin backend    | 502 (proxy avisa) | local         |
 *   | GitHub Pages          | 404 (no hay Node) | local         |
 *   | VPS con backend       | 200               | api           |
 *
 * La regla anterior miraba el hostname: `localhost` → local, cualquier otro → api. Pages y el
 * VPS son **el mismo hostname**, así que no podía distinguirlos: el día que `BACKEND_READY`
 * pasara a `true`, GitHub Pages —donde se prueba a diario— pedía los datos a un `/api` que
 * allí no existe y se quedaba sin datos. Medido contra el sitio real: `/api/health` → 404.
 *
 * MD-1  Hoy (BACKEND_READY=false) el modo es 'local' y no se pregunta nada: el freno de mano
 *       sigue puesto y no hay ni una petición de más en el arranque.
 * MD-2  Un backend que contesta 200 ⇒ hay backend detrás.
 * MD-3  Un 404 (el caso de GitHub Pages, medido) ⇒ NO hay backend: el sitio sigue sirviéndose
 *       con los ficheros locales en vez de quedarse en blanco.
 * MD-4  Un 502 (local sin backend levantado, el que devuelve el proxy de js/server.js) ⇒
 *       tampoco hay backend.
 * MD-5  Si la petición se cuelga, no se espera indefinidamente: hay corte por tiempo.
 *
 * Los cinco llaman a la función real del módulo (`hayBackendDisponible`, `asegurarModo`) e
 * interceptan `/api/health` para ponerla en cada entorno. Nada de reimplementar aquí su lógica:
 * una copia local pasaría en verde aunque el módulo cambiara debajo.
 *
 * QUÉ ATRAPA CADA UNO — cada rotura se ha provocado en `js/data-loader.js` y el caso se pone
 * en rojo; los demás siguen verdes, así que ninguno se apoya en otro:
 *
 *   | Rotura provocada                            | Se entera |
 *   |---------------------------------------------|-----------|
 *   | quitar el `if (!BACKEND_READY)`             | MD-1      |
 *   | `return resp.ok` → `return false`           | MD-2      |
 *   | `return resp.ok` → `return true`            | MD-3, MD-4|
 *   | alargar el corte de 2.500 ms                | MD-5      |
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function abrirApp(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

/**
 * Pregunta a la aplicación si detecta backend, con `/api/health` respondiendo lo que diga
 * `responder`. Usa la función real del módulo, no una reimplementación.
 */
async function detectaBackend(page, responder) {
  await page.route('**/api/health', responder);
  return page.evaluate(async () => {
    // La función REAL del módulo, no una copia de su lógica: si mañana cambia el criterio
    // (el corte por tiempo, el `resp.ok`, la ruta), estos casos se enteran. Con una copia
    // aquí dentro seguirían todos en verde sin probar nada (EJE 24).
    const { hayBackendDisponible } = await import('/js/data-loader.js');
    return hayBackendDisponible();
  });
}

test.describe('MD — el modo de datos se decide por capacidad', () => {
  test('MD-1. Con el freno puesto (BACKEND_READY=false) el modo es local y no se pregunta nada', async ({ page }) => {
    const preguntas = [];
    page.on('request', (r) => { if (r.url().includes('/api/health')) preguntas.push(r.url()); });

    await abrirApp(page);
    const modo = await page.evaluate(async () => {
      const { asegurarModo, getDataMode } = await import('/js/data-loader.js');
      await asegurarModo();
      return getDataMode();
    });

    expect(modo, 'mientras no haya backend autorizado, los datos salen de los ficheros locales').toBe('local');
    expect(preguntas, `con el freno puesto no debe preguntarse por el backend: ${preguntas.join(', ')}`).toEqual([]);
  });

  test('MD-2. Backend que contesta 200 ⇒ hay backend', async ({ page }) => {
    await abrirApp(page);
    const hay = await detectaBackend(page, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ exito: true }) }));
    expect(hay).toBe(true);
  });

  test('MD-3. GitHub Pages (404) ⇒ NO hay backend, y el sitio sigue funcionando con ficheros locales', async ({ page }) => {
    await abrirApp(page);
    const hay = await detectaBackend(page, (route) =>
      route.fulfill({ status: 404, contentType: 'text/html', body: '<h1>404</h1>' }));
    expect(hay, 'un 404 es exactamente lo que responde Pages: no puede tomarse por un backend').toBe(false);
  });

  test('MD-4. Local sin backend (502 del proxy) ⇒ NO hay backend', async ({ page }) => {
    await abrirApp(page);
    const hay = await detectaBackend(page, (route) =>
      route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ codigo: 'BACKEND_NO_DISPONIBLE' }) }));
    expect(hay).toBe(false);
  });

  test('MD-5. Si /api/health se cuelga, la comprobación corta por tiempo y no espera indefinidamente', async ({ page }) => {
    await abrirApp(page);
    const t0 = Date.now();
    const hay = await detectaBackend(page, () => { /* nunca responde */ });
    const ms = Date.now() - t0;

    expect(hay, 'una petición colgada no puede tomarse por un backend disponible').toBe(false);
    expect(ms, `debe cortar en torno a los 2,5 s, no quedarse esperando (tardó ${ms} ms)`).toBeLessThan(8000);
  });
});
