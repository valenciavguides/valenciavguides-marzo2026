/**
 * 25-boton-recentrar.spec.js
 *
 * Prueba del botón de recentrar cámara (#btn-recentrar, codigo-padre.html), añadido
 * para retomar el seguimiento automático de cámara (ver 24-camara-sigue-usuario.spec.js)
 * tras pausarse por un arrastre manual del mapa.
 *
 *   BR-1  El botón existe, empieza oculto (display:none, sin estilo inline que lo
 *         fuerce a visible) — no debe aparecer antes de que el mapa esté en pantalla.
 *   BR-2  Mismo tamaño y right que #selector-tipo-mapa, con z-index justo por debajo
 *         del suyo (1000030) — su desplegable, al abrirse, tapa este botón a
 *         propósito (acordado explícitamente, no es un descuido).
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

  test('BR-2. Mismo right que #selector-tipo-mapa, z-index justo por debajo', async ({ page }) => {
    await page.waitForSelector('#selector-tipo-mapa', { state: 'attached', timeout: 15000 });
    const info = await page.evaluate(() => {
      // Ambos empiezan display:none (BR-1) — getComputedStyle().width no es fiable
      // sobre un elemento sin caja renderizada (el contenedor del selector, además,
      // no fija su propio ancho: se ajusta al hijo más ancho). "right" y z-index sí
      // se resuelven igual con o sin renderizar, al fijarse directamente por CSS.
      const recentrar = getComputedStyle(document.getElementById('btn-recentrar'));
      const selector = getComputedStyle(document.getElementById('selector-tipo-mapa'));
      return {
        rightRecentrar: recentrar.right, rightSelector: selector.right,
        zRecentrar: Number(recentrar.zIndex), zSelector: Number(selector.zIndex),
        anchoRecentrarPx: parseFloat(recentrar.width),
      };
    });
    expect(info.rightRecentrar, 'Misma distancia al borde derecho que el selector de mapa').toBe(info.rightSelector);
    expect(info.zRecentrar).toBeLessThan(info.zSelector);
    expect(info.anchoRecentrarPx, 'Ancho en el rango esperado (clamp 36-52px)').toBeGreaterThanOrEqual(36);
    expect(info.anchoRecentrarPx).toBeLessThanOrEqual(52);
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
