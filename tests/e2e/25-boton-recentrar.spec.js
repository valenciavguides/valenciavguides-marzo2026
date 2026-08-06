/**
 * 25-boton-recentrar.spec.js
 *
 * Prueba del botón de recentrar cámara (#btn-recentrar, codigo-padre.html), añadido
 * para retomar el seguimiento automático de cámara (ver 24-camara-sigue-usuario.spec.js)
 * tras pausarse por un arrastre manual del mapa.
 *
 *   BR-1  El botón existe, empieza oculto (display:none, sin estilo inline que lo
 *         fuerce a visible) — no debe aparecer antes de que el mapa esté en pantalla.
 *   BR-2  z-index entre #logo-aventura (3000) y #hijo5 (1000000), tal como se acordó
 *         explícitamente (por debajo de hijo5, por encima del logo).
 *   BR-3  Al pulsarlo, llama a funcionesMapa.reactivarSeguimientoCamara().
 *
 * El "se muestra junto con el resto de la UI de aventura" (_mostrarUIActivada/
 * _ocultarUIActivada, codigo-padre.html) no se reproduce aquí con el flujo completo
 * de activación — 'btn-recentrar' se añadió a las mismas 3 listas que ya usa
 * 'btn-chat-soporte' (idsAOcultar en _ocultarUIActivada, el bucle equivalente en
 * mostrarDialogoVueltaRapida, e iframesToShow en _mostrarUIActivada), así que
 * comparte exactamente el mismo mecanismo ya en uso — verificado por revisión
 * directa del código, no por un test E2E redundante.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('BR — Botón de recentrar cámara', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
  });

  test('BR-1. Existe y empieza oculto', async ({ page }) => {
    const info = await page.evaluate(() => {
      const el = document.getElementById('btn-recentrar');
      return { existe: !!el, display: el ? getComputedStyle(el).display : null };
    });
    expect(info.existe, 'El botón debe existir en el DOM').toBe(true);
    expect(info.display, 'Debe empezar oculto, sin estilo inline forzándolo a visible').toBe('none');
  });

  test('BR-2. z-index entre #logo-aventura y #hijo5', async ({ page }) => {
    const zIndices = await page.evaluate(() => {
      const zOf = (id) => Number(getComputedStyle(document.getElementById(id)).zIndex);
      return { logo: zOf('logo-aventura'), recentrar: zOf('btn-recentrar'), hijo5: zOf('hijo5') };
    });
    expect(zIndices.recentrar).toBeGreaterThan(zIndices.logo);
    expect(zIndices.recentrar).toBeLessThan(zIndices.hijo5);
  });

  test('BR-3. Al pulsarlo, llama a funcionesMapa.reactivarSeguimientoCamara()', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa?.reactivarSeguimientoCamara === 'function', null, { timeout: 15000 });

    const llamado = await page.evaluate(() => {
      const el = document.getElementById('btn-recentrar');
      el.style.display = 'block'; // se fuerza visible solo para poder hacer click en el test
      let llamado = false;
      const original = globalThis.funcionesMapa.reactivarSeguimientoCamara;
      globalThis.funcionesMapa.reactivarSeguimientoCamara = () => { llamado = true; };
      el.click();
      globalThis.funcionesMapa.reactivarSeguimientoCamara = original;
      return llamado;
    });

    expect(llamado, 'El click debe invocar reactivarSeguimientoCamara()').toBe(true);
  });
});
