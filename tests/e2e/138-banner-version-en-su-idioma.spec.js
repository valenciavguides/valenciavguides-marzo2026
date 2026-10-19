/**
 * 138-banner-version-en-su-idioma.spec.js
 *
 * El banner de versión nueva sale en el idioma del usuario también al arrancar. Si una sesión anterior dejó el aviso pendiente
 * (`vv_sw_update_pendiente`), el padre lo enseña en cuanto carga, desde un bloque clásico que corre antes que Script 1. Los
 * textos los pide ese mismo bloque (`import('./js/traducciones-ui.js')`), así que no dependen de que Script 1 haya
 * publicado nada (estudio K-113).
 *
 *   SB-1  Con el aviso pendiente y el último idioma elegido en inglés (`vv_idioma`), el banner sale en inglés, con la versión.
 *   SB-2  Control: en español, en español.
 *   SB-3  Sale un solo banner.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior, SB-1 cae (salía el texto en español escrito a mano, porque la tabla la publicaba
 * Script 1 después). SB-2 y SB-3 pasan antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function arrancarConAvisoPendiente(page, idioma) {
  await page.addInitScript((i) => {
    if (globalThis !== globalThis.top) return;
    try {
      localStorage.setItem('vv_idioma', i);
      localStorage.setItem('vv_sw_update_pendiente', 'v-prueba');
    } catch (_e) { /* sin almacenamiento: el test lo dirá */ }
  }, idioma);
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

const textoDelBanner = (page) => page.evaluate(() => {
  const b = document.getElementById('sw-update-banner');
  return b ? { label: b.querySelector('span')?.textContent ?? null, boton: b.querySelector('button')?.textContent ?? null } : null;
});

test.describe('SB — El banner de versión nueva, en su idioma', () => {
  test('SB-1. Con el aviso pendiente y el idioma en inglés, el banner sale en inglés', async ({ page }) => {
    await arrancarConAvisoPendiente(page, 'en');
    await expect.poll(() => textoDelBanner(page), { timeout: 10_000 })
      .toEqual({ label: '🔄 New version available (v-prueba)', boton: 'Update' });
  });

  test('SB-2. Control: en español, en español', async ({ page }) => {
    await arrancarConAvisoPendiente(page, 'es');
    await expect.poll(() => textoDelBanner(page), { timeout: 10_000 })
      .toEqual({ label: '🔄 Nueva versión disponible (v-prueba)', boton: 'Actualizar' });
  });

  test('SB-3. Sale un solo banner', async ({ page }) => {
    await arrancarConAvisoPendiente(page, 'fr');
    await expect.poll(() => textoDelBanner(page), { timeout: 10_000 }).not.toBeNull();
    // VENTANA-OBSERVACION: un segundo aviso (el de version.json o el del SW) llega después del primero.
    await page.waitForTimeout(1_500);
    expect(await page.evaluate(() => document.querySelectorAll('#sw-update-banner').length)).toBe(1);
  });
});
