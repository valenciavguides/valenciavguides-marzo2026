/**
 * 16-loading-overlay-oculta-ui.spec.js
 *
 * Mientras `<body class="loading">` está activo (desde el primer pintado en frío, o
 * durante una reanudación de sesión), #selector-tipo-mapa, #btn-chat-soporte y
 * #btn-recentrar deben quedar invisibles pase lo que pase con su `style.display` —
 * bug recurrente: al no ser <iframe> (dos son <div> creados por JS, el otro un
 * <button> del HTML estático), la regla CSS que ya oculta el resto del contenido
 * durante la carga ("body.loading iframe") nunca los cubría, así que cualquier código
 * que los revelara en cualquier momento de la carga (_mostrarUIActivada,
 * actualizarVisibilidadSelectorMapa) los dejaba viéndose por encima del overlay de
 * carga, cuyo z-index (999999) es menor que el suyo (1000000+ selector/chat,
 * 1000025 recentrar). El fix vive en la hoja de estilos (body.loading
 * #selector-tipo-mapa, body.loading #btn-chat-soporte, body.loading #btn-recentrar,
 * con !important), no en el orden de llamadas JS — por eso este test fuerza
 * display:flex/block directamente y comprueba el estilo COMPUTADO, no solo que nadie
 * los muestre por accidente durante el arranque real. #btn-recentrar se sumó a esta
 * lista después de que el mismo síntoma se reportara para el menú de modo de cámara
 * (§4.6b) — mismo patrón de creación que #selector-tipo-mapa, mismo hueco de
 * protección.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('LO — body.loading oculta el selector de mapa y el botón de chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('LO-1. Con body.loading activo, los tres permanecen invisibles aunque su display se fuerce a visible', async ({ page }) => {
    await page.waitForSelector('#selector-tipo-mapa', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('#btn-chat-soporte', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('#btn-recentrar', { state: 'attached', timeout: 15000 });

    const resultado = await page.evaluate(() => {
      document.body.classList.add('loading');

      const selector = document.getElementById('selector-tipo-mapa');
      const chat = document.getElementById('btn-chat-soporte');
      const recentrar = document.getElementById('btn-recentrar');
      // Simula exactamente lo que hace _mostrarUIActivada()/actualizarVisibilidadSelectorMapa()
      // — forzar el display inline a visible, como si se hubieran disparado durante la carga.
      selector.style.display = 'flex';
      chat.style.display = 'block';
      recentrar.style.display = 'flex';

      const csSelector = getComputedStyle(selector);
      const csChat = getComputedStyle(chat);
      const csRecentrar = getComputedStyle(recentrar);
      return {
        selectorVisible: csSelector.visibility !== 'hidden' && csSelector.opacity !== '0',
        chatVisible: csChat.visibility !== 'hidden' && csChat.opacity !== '0',
        recentrarVisible: csRecentrar.visibility !== 'hidden' && csRecentrar.opacity !== '0',
        selectorOpacity: csSelector.opacity,
        selectorVisibility: csSelector.visibility,
        chatOpacity: csChat.opacity,
        chatVisibility: csChat.visibility,
        recentrarOpacity: csRecentrar.opacity,
        recentrarVisibility: csRecentrar.visibility,
      };
    });

    expect(resultado.selectorVisible, `El selector de mapa no debe ser visible con body.loading activo (opacity=${resultado.selectorOpacity}, visibility=${resultado.selectorVisibility})`).toBe(false);
    expect(resultado.chatVisible, `El botón de chat no debe ser visible con body.loading activo (opacity=${resultado.chatOpacity}, visibility=${resultado.chatVisibility})`).toBe(false);
    expect(resultado.recentrarVisible, `El menú de modo de cámara no debe ser visible con body.loading activo (opacity=${resultado.recentrarOpacity}, visibility=${resultado.recentrarVisibility})`).toBe(false);
  });

  test('LO-2. Al quitar body.loading, los tres vuelven a ser visibles con su display ya puesto', async ({ page }) => {
    await page.waitForSelector('#selector-tipo-mapa', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('#btn-chat-soporte', { state: 'attached', timeout: 15000 });
    await page.waitForSelector('#btn-recentrar', { state: 'attached', timeout: 15000 });

    const resultado = await page.evaluate(() => {
      document.body.classList.add('loading');
      const selector = document.getElementById('selector-tipo-mapa');
      const chat = document.getElementById('btn-chat-soporte');
      const recentrar = document.getElementById('btn-recentrar');
      selector.style.display = 'flex';
      chat.style.display = 'block';
      recentrar.style.display = 'flex';

      document.body.classList.remove('loading');

      const csSelector = getComputedStyle(selector);
      const csChat = getComputedStyle(chat);
      const csRecentrar = getComputedStyle(recentrar);
      return {
        selectorVisible: csSelector.visibility !== 'hidden' && csSelector.opacity !== '0',
        chatVisible: csChat.visibility !== 'hidden' && csChat.opacity !== '0',
        recentrarVisible: csRecentrar.visibility !== 'hidden' && csRecentrar.opacity !== '0',
      };
    });

    expect(resultado.selectorVisible, 'El selector de mapa debe volver a verse al terminar la carga').toBe(true);
    expect(resultado.chatVisible, 'El botón de chat debe volver a verse al terminar la carga').toBe(true);
    expect(resultado.recentrarVisible, 'El menú de modo de cámara debe volver a verse al terminar la carga').toBe(true);
  });
});
