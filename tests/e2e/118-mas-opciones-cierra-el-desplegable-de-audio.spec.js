/**
 * 118-mas-opciones-cierra-el-desplegable-de-audio.spec.js
 *
 * Al pulsar «Más opciones» en hijo1, el padre cierra su desplegable de control de audio
 * (`#audio-control-overlay`) para que los dos menús no se solapen. Lo hace con
 * `UI.CLOSE_MENUS`, que manda hijo1 y atiende el padre (`_hdl_UI_CLOSE_MENUS_PADRE`). Ningún
 * spec lo fijaba, y el tipo llevaba un parámetro (`except`) que el padre nunca usa con otro
 * valor y un handler en hijo1 al que ningún mensaje llega.
 *
 *   CM-1  camino real: con el desplegable de audio del padre abierto, «Más opciones» lo cierra
 *   CM-2  el mensaje de hijo1 lleva solo `timestamp`: ningún `except`
 *   CM-3  el tipo tiene un solo receptor: el padre lo atiende y hijo1 no tiene handler
 *
 * ROJO ANTES QUE VERDE: con el código anterior CM-2 cae (el mensaje llevaba `except`) y CM-3
 * cae (hijo1 registraba un handler que ningún mensaje alcanzaba). CM-1 pasa antes y después:
 * fija lo que no debe cambiar, y se ve en rojo quitando la línea que cierra el desplegable.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);
const desplegableAbierto = (page) => page.evaluate(() => document.getElementById('audio-control-overlay')?.classList.contains('open') === true);

test.describe('CM — «Más opciones» cierra el desplegable de audio del padre', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    // Los `UI.CLOSE_MENUS` que llegan crudos a la ventana del padre, con su `datos` tal como los manda hijo1.
    await page.addInitScript(() => {
      globalThis.__closeMenus = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data && e.data.tipo === 'UI.CLOSE_MENUS') globalThis.__closeMenus.push(e.data);
      });
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => !!globalThis.estadoPadre?.hijosPreparados?.has('hijo1-opciones'), null, { timeout: 60_000 });
    await page.waitForFunction(() => !!document.getElementById('hijo1-opciones')?.contentDocument?.getElementById('mas-opciones'), null, { timeout: 20_000 });
    // El desplegable de audio abierto: es lo que «Más opciones» tiene que cerrar.
    await page.evaluate(() => document.getElementById('audio-control-overlay').classList.add('open'));
  });

  test('CM-1. Camino real: «Más opciones» en hijo1 cierra el desplegable de audio del padre', async ({ page }) => {
    expect(await desplegableAbierto(page), 'precondición: el desplegable empieza abierto').toBe(true);
    await frame(page, 'hijo1-opciones').evaluate(() => document.getElementById('mas-opciones').click());
    await expect.poll(() => desplegableAbierto(page), { timeout: 8_000, message: 'el desplegable de audio tiene que cerrarse' }).toBe(false);
  });

  test('CM-2. El mensaje de hijo1 lleva solo `timestamp`', async ({ page }) => {
    await frame(page, 'hijo1-opciones').evaluate(() => document.getElementById('mas-opciones').click());
    await expect.poll(() => page.evaluate(() => globalThis.__closeMenus.length), { timeout: 8_000 }).toBeGreaterThan(0);
    const datos = await page.evaluate(() => globalThis.__closeMenus[0].datos);
    expect(Object.keys(datos || {}), 'el mensaje no lleva ningún parámetro más que la hora').toEqual(['timestamp']);
    expect(typeof datos.timestamp).toBe('number');
  });

  test('CM-3. El tipo tiene un solo receptor: el padre', async ({ page }) => {
    expect(await page.evaluate(() => globalThis.mensajeria.tieneControlador('UI.CLOSE_MENUS')), 'el padre lo atiende').toBe(true);
    expect(
      await frame(page, 'hijo1-opciones').evaluate(() => globalThis.mensajeria.tieneControlador('UI.CLOSE_MENUS')),
      'hijo1 no tiene handler: nadie le manda este tipo',
    ).toBe(false);
  });
});
