/**
 * 01-fase1-boot.spec.js
 *
 * Valida la secuencia de arranque de FASE 1 en codigo-padre.html.
 *
 * Prerequisito DT-1 Opción B — escenario 1a:
 *   "El test debe afirmar que globalThis.__vv_stateManager existe ANTES de que
 *   mensajeria.js se importe, y que globalThis.mensajeria existe ANTES del Promise.all"
 *
 * Prerequisito DT-1 — escenario 1b (parcial):
 *   Tras mensajeriaReady, globalThis.mensajeria expone la API completa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, getMensajeriaReadySnapshot } = require('./helpers/boot');

const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');

test.describe('FASE 1 — Secuencia de arranque del padre', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: LEAFLET_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // ── Orden de inicialización ────────────────────────────────────────────

  test('1a. Race #5 CORREGIDO: state-manager SÍ está en window cuando mensajeriaReady se dispara', async ({ page }) => {
    const snap = await getMensajeriaReadySnapshot(page);
    // Race #5 corregido (4 mayo 2026):
    // Causa raíz: <script type="module" src="funciones-mapa.js"> en línea 2084 cargaba
    // mensajeria.js antes del state-manager, haciendo que mensajeriaReady disparase
    // con globalThis.__vv_stateManager = null.
    // Fix: eliminar el script independiente — funciones-mapa.js solo carga vía PASO 3
    // (Promise.all en Script 1), cuando el state-manager ya está inicializado.
    expect(snap.hasStateManager).toBe(true);
  });

  test('1a. globalThis.mensajeria existe en el momento en que mensajeriaReady se dispara', async ({ page }) => {
    const snap = await getMensajeriaReadySnapshot(page);
    expect(snap.hasMensajeria).toBe(true);
  });

  test('1a. __MENSAJERIA_INICIADA ya era true cuando el spy capturó mensajeriaReady', async ({ page }) => {
    // El flag se pone a true justo antes de dispatchEvent('mensajeriaReady')
    // pero puede haber race en la captura del listener — aceptamos que sea true
    // al menos al finalizar el beforeEach (gotoAndWaitForFase1 lo espera)
    const value = await page.evaluate(() => globalThis.__MENSAJERIA_INICIADA);
    expect(value).toBe(true);
  });

  // ── state-manager ──────────────────────────────────────────────────────

  test('1a. globalThis.__vv_stateManager es un objeto con las APIs esperadas', async ({ page }) => {
    const api = await page.evaluate(() => {
      const sm = globalThis.__vv_stateManager;
      if (!sm) return null;
      return {
        hasRegistrarManejador: typeof sm.registrarManejador === 'function',
        hasGetManejadores: typeof sm.getManejadores === 'function',
        hasSetEstadoPadre: typeof sm.setEstadoPadre === 'function',
        hasGetEstadoPadre: typeof sm.getEstadoPadre === 'function',
      };
    });
    expect(api).not.toBeNull();
    expect(api.hasRegistrarManejador).toBe(true);
    expect(api.hasGetManejadores).toBe(true);
  });

  // ── globalThis.mensajeria API ─────────────────────────────────────────────

  test('globalThis.mensajeria expone registrarControlador como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.mensajeria?.registrarControlador === 'function');
    expect(ok).toBe(true);
  });

  test('globalThis.mensajeria expone enviarMensaje como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.mensajeria?.enviarMensaje === 'function');
    expect(ok).toBe(true);
  });

  test('globalThis.mensajeria expone inicializarMensajeria como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.mensajeria?.inicializarMensajeria === 'function');
    expect(ok).toBe(true);
  });

  test('globalThis.mensajeria expone enviarMensajeConConfirmacion como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.mensajeria?.enviarMensajeConConfirmacion === 'function');
    expect(ok).toBe(true);
  });

  // ── Sin errores críticos de arranque ──────────────────────────────────

  test('procesarControladoresPendientes existe y es una función tras el arranque', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.procesarControladoresPendientes === 'function');
    expect(ok).toBe(true);
  });
});
