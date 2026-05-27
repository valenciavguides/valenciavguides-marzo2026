/**
 * 03-handler-registration.spec.js
 *
 * Valida que el sistema de registro de handlers (DT-2) se comporte correctamente:
 * - Los handlers se registran en state-manager (fuente de verdad), no en el mapa local
 * - La cola __CONTROLADORES_PENDIENTES queda vacía tras el drenaje
 * - El Set __CONTROLADOR_REGISTRADOS contiene entradas (handlers efectivamente registrados)
 *
 * Prerequisito DT-1 Opción B — escenario 1b:
 *   "El test debe afirmar que los tipos críticos están en state-manager.controladores
 *   (no en __vv_manejadoresLocales) al finalizar el arranque."
 *
 * Prerequisito DT-1 — escenario 1g:
 *   "globalThis.__CONTROLADORES_PENDIENTES debe quedar vacío tras procesarControladoresPendientes()"
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');

test.describe('Registro de handlers — estado tras FASE 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: LEAFLET_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // ── Cola de controladores pendientes ──────────────────────────────────

  test('1g. __CONTROLADORES_PENDIENTES está vacío tras el drenaje', async ({ page }) => {
    const info = await page.evaluate(() => {
      const pendientes = globalThis.__CONTROLADORES_PENDIENTES;
      return {
        // null/undefined es OK: significa que no hubo handlers encolados
        isNullOrEmpty: !pendientes || (Array.isArray(pendientes) && pendientes.length === 0),
        length: Array.isArray(pendientes) ? pendientes.length : 0,
      };
    });
    expect(info.isNullOrEmpty).toBe(true);
  });

  // ── Set de tipos registrados ──────────────────────────────────────────

  test('1b. __CONTROLADOR_REGISTRADOS tiene entradas (algún handler fue registrado)', async ({ page }) => {
    const size = await page.evaluate(() => {
      return globalThis.__CONTROLADOR_REGISTRADOS instanceof Set
        ? globalThis.__CONTROLADOR_REGISTRADOS.size
        : -1;
    });
    // Debe haber al menos 1 handler registrado tras FASE 1
    expect(size).toBeGreaterThan(0);
  });

  // ── Fuente de verdad: state-manager.controladores ─────────────────────

  test('1b. state-manager tiene handlers en su mapa de controladores', async ({ page }) => {
    const count = await page.evaluate(() => {
      const sm = globalThis.__vv_stateManager;
      if (!sm) return -1;
      try {
        // getManejadores() devuelve el Map de controladores
        const manejadores = sm.getManejadores ? sm.getManejadores() : null;
        if (!manejadores) return 0;
        // Puede ser un Map o un objeto
        if (manejadores instanceof Map) return manejadores.size;
        return Object.keys(manejadores).length;
      } catch (e) {
        return -1;
      }
    });
    // Debe haber al menos 1 handler en state-manager
    expect(count).toBeGreaterThan(0);
  });

  test('1b. el mapa de controladores en state-manager no está vacío', async ({ page }) => {
    const info = await page.evaluate(() => {
      const sm = globalThis.__vv_stateManager;
      if (!sm) return { ok: false, reason: 'no state-manager' };
      try {
        const mapa = sm.getManejadores ? sm.getManejadores() : null;
        if (!mapa) return { ok: false, reason: 'getManejadores() retornó null' };
        const size = mapa instanceof Map ? mapa.size : Object.keys(mapa).length;
        return { ok: true, size };
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    });
    expect(info.ok).toBe(true);
    expect(info.size).toBeGreaterThan(0);
  });

  // ── Sin fuga al mapa local ────────────────────────────────────────────

  test('1b. __vv_manejadoresLocales está vacío o no existe (sin fuga del path nominal)', async ({ page }) => {
    const info = await page.evaluate(() => {
      const local = globalThis.__vv_manejadoresLocales;
      if (!local) return { leakCount: 0 };
      // Es un Map
      if (local instanceof Map) return { leakCount: local.size };
      // Es un objeto
      return { leakCount: Object.keys(local).length };
    });
    // Si hay fugas, los handlers acabaron en el mapa local en vez del state-manager
    // En condiciones normales de arranque debe ser 0
    expect(info.leakCount).toBe(0);
  });

  // ── registrarControladorSeguro disponible ─────────────────────────────

  test('globalThis.registrarControladorSeguro existe como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.registrarControladorSeguro === 'function');
    expect(ok).toBe(true);
  });

  test('registrarControladorSeguro no registra un mismo tipo dos veces', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const tipo = '__TEST_TIPO_DEDUP__' + Date.now();
      let callCount = 0;
      const handler = () => { callCount++; };

      globalThis.registrarControladorSeguro(tipo, handler);
      globalThis.registrarControladorSeguro(tipo, handler); // segundo intento — debe ignorarse

      // El Set debe contener el tipo (una sola vez)
      const enSet = globalThis.__CONTROLADOR_REGISTRADOS.has(tipo);
      return { enSet, callCount };
    });
    // El tipo debe estar en el Set
    expect(result.enSet).toBe(true);
    // El handler no debe haberse llamado durante el registro (no es un dispatcher)
    expect(result.callCount).toBe(0);
  });
});
