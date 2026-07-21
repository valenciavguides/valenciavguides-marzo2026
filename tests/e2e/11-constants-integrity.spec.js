/**
 * 11-constants-integrity.spec.js
 *
 * Tests de regresión sobre la integridad de TIPOS_MENSAJE y las funciones
 * globales clave. Detecta:
 *
 *   CI-1/2  GPS.VISUAL_ACTIVAR y GPS.VISUAL_DESACTIVAR eliminados
 *           (eran handlers huérfanos — ningún hijo emitía esos mensajes;
 *           la visibilidad de polylines la gestiona funciones-mapa.js internamente)
 *
 *   CI-3    GPS funcionales conservados (ACTIVAR, DESACTIVAR, RESTRINGIDO)
 *
 *   CI-4    TIPOS_MENSAJE.CHAT.ESTADO_PADRE existe (usado por construirEstadoChat)
 *
 *   CI-5    limpiarDatosAventura y verificarTimeoutAventura expuestas (reciclaje-digital.js)
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('CI — Integridad de constantes y funciones globales', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // ── GPS — código muerto eliminado ────────────────────────────────────────

  test('CI-1. GPS.VISUAL_ACTIVAR NO existe en TIPOS_MENSAJE (handler huérfano eliminado)', async ({ page }) => {
    const exists = await page.evaluate(() =>
      'VISUAL_ACTIVAR' in (globalThis.TIPOS_MENSAJE?.NAVEGACION?.GPS ?? {})
    );
    expect(exists).toBe(false);
  });

  test('CI-2. GPS.VISUAL_DESACTIVAR NO existe en TIPOS_MENSAJE (handler huérfano eliminado)', async ({ page }) => {
    const exists = await page.evaluate(() =>
      'VISUAL_DESACTIVAR' in (globalThis.TIPOS_MENSAJE?.NAVEGACION?.GPS ?? {})
    );
    expect(exists).toBe(false);
  });

  // ── GPS — constantes funcionales conservadas ─────────────────────────────

  test('CI-3a. GPS.ACTIVAR existe en TIPOS_MENSAJE', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.TIPOS_MENSAJE?.NAVEGACION?.GPS?.ACTIVAR);
    expect(typeof val).toBe('string');
    expect(val).toBe('NAVEGACION.GPS.ACTIVAR');
  });

  test('CI-3b. GPS.DESACTIVAR existe en TIPOS_MENSAJE', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.TIPOS_MENSAJE?.NAVEGACION?.GPS?.DESACTIVAR);
    expect(typeof val).toBe('string');
    expect(val).toBe('NAVEGACION.GPS.DESACTIVAR');
  });

  test('CI-3c. GPS.RESTRINGIDO existe en TIPOS_MENSAJE', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.TIPOS_MENSAJE?.NAVEGACION?.GPS?.RESTRINGIDO);
    expect(typeof val).toBe('string');
    expect(val).toBe('NAVEGACION.GPS.RESTRINGIDO');
  });

  // ── Chat — ESTADO_PADRE y construirEstadoChat ────────────────────────────

  test('CI-4. TIPOS_MENSAJE.CHAT.ESTADO_PADRE existe', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.TIPOS_MENSAJE?.CHAT?.ESTADO_PADRE);
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });

  // ── Reciclaje digital ────────────────────────────────────────────────────

  test('CI-5a. limpiarDatosAventura está expuesta como función global', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.limpiarDatosAventura === 'function');
    expect(ok).toBe(true);
  });

  test('CI-5b. verificarTimeoutAventura está expuesta como función global', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.verificarTimeoutAventura === 'function');
    expect(ok).toBe(true);
  });
});
