/**
 * 126-el-ayudante-que-carga-los-hijos.spec.js
 *
 * `cargarHijosDelPadre(page)` (`helpers/boot.js`) es la única forma de cargar los hijos del padre en un spec. Existe porque
 * un `page.evaluate` que espera la carga entera queda pendiente mientras los iframes navegan, y Playwright, con una
 * frecuencia baja pero medida, invalida en ese rato su contexto principal de la página sin que el documento cambie: el
 * `evaluate` se rechaza con «Execution context was destroyed» aunque la página siga viva y cargando.
 *
 * El ayudante sobrevive a esa invalidación, y precisamente por eso tiene que seguir fallando cuando el documento cambia
 * de verdad: si cargara los hijos en el documento nuevo y diera el paso por bueno, taparía una recarga del padre.
 *
 *   AY-1  carga normal: vuelve con los siete hijos del padre con el apretón de manos completado
 *   AY-2  el padre se recarga mientras se cargan los hijos: el ayudante falla, con su mensaje
 *   AY-3  control: si la carga falla en la página, el ayudante falla con el mensaje de la página
 *
 * Lo que no se puede versionar aquí: que sobrevive a la invalidación del contexto. Se comprueba instrumentando
 * Playwright desde fuera (un inyector que la provoca a voluntad), no desde un spec.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const HIJOS = ['hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5', 'hijo6-chat', 'seleccion'];

test.use({ permissions: ['geolocation'], geolocation: { latitude: 39.47876, longitude: -0.37626 } });

test.describe('AY — el ayudante que carga los hijos del padre', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('AY-1. Carga normal: vuelve con los siete hijos listos', async ({ page }) => {
    await cargarHijosDelPadre(page, { casa: true });
    // Sin esperar nada más: al volver el ayudante, el apretón de manos de todos ya está hecho.
    const listos = await page.evaluate(() => [...(globalThis.estadoPadre?.hijosInicializados || [])].sort());
    expect(listos, 'los siete, sin ninguna espera posterior').toEqual([...HIJOS].sort());
  });

  test('AY-2. Una recarga del padre mientras se cargan los hijos hace fallar al ayudante', async ({ page }) => {
    // En el documento de partida la carga no termina nunca: así el ayudante no puede haber vuelto antes de la recarga.
    await page.evaluate(() => { globalThis.cargarRestoDeiframes = () => new Promise(() => {}); });
    const carga = cargarHijosDelPadre(page).then(() => null, (e) => e);
    await page.waitForFunction(() => !!globalThis.__cargasHijosDelPadre, null, { timeout: 15_000 });
    // Basta con que la navegación se confirme: el documento nuevo trae el cargador de verdad y el ayudante acabaría en él.
    await page.reload({ waitUntil: 'commit' });
    const error = await carga;
    expect(error, 'el ayudante no puede dar por buena una carga hecha en otro documento').not.toBeNull();
    expect(String(error.message)).toContain('el marco principal del padre navegó mientras se cargaban los hijos');
  });

  test('AY-3. Control: si la carga falla en la página, el ayudante falla con ese mensaje', async ({ page }) => {
    await page.evaluate(() => { globalThis.cargarRestoDeiframes = () => Promise.reject(new Error('fallo provocado por el test')); });
    const error = await cargarHijosDelPadre(page).then(() => null, (e) => e);
    expect(error, 'una carga rechazada no puede pasar por terminada').not.toBeNull();
    expect(String(error.message)).toContain('carga de los hijos del padre: fallo provocado por el test');
  });
});
