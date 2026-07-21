/**
 * 02-global-variables.spec.js
 *
 * Valida que las 10+ variables globales requeridas existan tras FASE 1.
 *
 * Prerequisito DT-1 Opción B — escenario 1f:
 *   "Tras el refactor, estos deben seguir existiendo con los mismos valores:
 *    globalThis.TIPOS_MENSAJE, globalThis.MODOS, globalThis.registrarControlador,
 *    globalThis.enviarMensaje, globalThis.enviarMensajeConConfirmacion, globalThis.logger,
 *    globalThis.esTelefonoMovil, globalThis.ajustarTimeoutPorConexion,
 *    globalThis.CONFIG_PADRE (ID, COMPONENTE_ID, VERSION, DEBUG, LOG_PREFIX),
 *    globalThis.getPadreId()"
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('Globals requeridas tras FASE 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // ── Constantes de mensajería ───────────────────────────────────────────

  test('1f. globalThis.TIPOS_MENSAJE existe y es un objeto no vacío', async ({ page }) => {
    const info = await page.evaluate(() => {
      const tm = globalThis.TIPOS_MENSAJE;
      return {
        type: typeof tm,
        hasKeys: tm ? Object.keys(tm).length > 0 : false,
        hasSistema: tm ? typeof tm.SISTEMA === 'object' : false,
      };
    });
    expect(info.type).toBe('object');
    expect(info.hasKeys).toBe(true);
    expect(info.hasSistema).toBe(true);
  });

  test('1f. globalThis.MODOS existe con claves CASA y AVENTURA', async ({ page }) => {
    const modos = await page.evaluate(() => {
      const m = globalThis.MODOS;
      return { type: typeof m, hasCASA: !!m?.CASA, hasAVENTURA: !!m?.AVENTURA };
    });
    expect(modos.type).toBe('object');
    expect(modos.hasCASA).toBe(true);
    expect(modos.hasAVENTURA).toBe(true);
  });

  // ── Funciones de comunicación ──────────────────────────────────────────

  test('1f. globalThis.registrarControlador es una función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.registrarControlador === 'function');
    expect(ok).toBe(true);
  });

  test('1f. globalThis.enviarMensaje es una función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.enviarMensaje === 'function');
    expect(ok).toBe(true);
  });

  test('1f. globalThis.enviarMensajeConConfirmacion es una función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.enviarMensajeConConfirmacion === 'function');
    expect(ok).toBe(true);
  });

  // ── Logger ────────────────────────────────────────────────────────────

  test('1f. globalThis.logger existe con métodos info/warn/error/debug', async ({ page }) => {
    const api = await page.evaluate(() => {
      const l = globalThis.logger;
      return {
        type: typeof l,
        hasInfo: typeof l?.info === 'function',
        hasWarn: typeof l?.warn === 'function',
        hasError: typeof l?.error === 'function',
        hasDebug: typeof l?.debug === 'function',
      };
    });
    expect(api.type).toBe('object');
    expect(api.hasInfo).toBe(true);
    expect(api.hasWarn).toBe(true);
    expect(api.hasError).toBe(true);
    expect(api.hasDebug).toBe(true);
  });

  // ── Detección de dispositivo ──────────────────────────────────────────

  test('1f. globalThis.esTelefonoMovil existe (booleano o función)', async ({ page }) => {
    const type = await page.evaluate(() => typeof globalThis.esTelefonoMovil);
    // El script inline define esTelefonoMovil como booleano (resultado de esTelefonoMovilRobusto())
    // mientras que device-detection.js lo define como función.
    // Ambas formas son válidas; lo que importa es que exista.
    expect(['boolean', 'function']).toContain(type);
  });

  test('1f. globalThis.ajustarTimeoutPorConexion existe como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.ajustarTimeoutPorConexion === 'function');
    expect(ok).toBe(true);
  });

  test('1f. globalThis.ajustarTimeoutPorConexionSafe existe como función (wrapper seguro)', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.ajustarTimeoutPorConexionSafe === 'function');
    expect(ok).toBe(true);
  });

  // ── CONFIG_PADRE ───────────────────────────────────────────────────────

  test('1f. globalThis.CONFIG_PADRE existe con todas las claves requeridas', async ({ page }) => {
    const cfg = await page.evaluate(() => {
      const c = globalThis.CONFIG_PADRE;
      return {
        exists: !!c,
        hasID: typeof c?.ID === 'string' && c.ID.length > 0,
        hasComponenteID: typeof c?.COMPONENTE_ID === 'string',
        hasVersion: typeof c?.VERSION === 'string',
        hasDebug: typeof c?.DEBUG === 'boolean',
        hasLogPrefix: typeof c?.LOG_PREFIX === 'string',
      };
    });
    expect(cfg.exists).toBe(true);
    expect(cfg.hasID).toBe(true);
    expect(cfg.hasComponenteID).toBe(true);
    expect(cfg.hasVersion).toBe(true);
    expect(cfg.hasDebug).toBe(true);
    expect(cfg.hasLogPrefix).toBe(true);
  });

  // ── Función de ID del padre ────────────────────────────────────────────

  test('1f. globalThis.getPadreId() es una función que retorna un string no vacío', async ({ page }) => {
    const result = await page.evaluate(() => {
      if (typeof globalThis.getPadreId !== 'function') return { ok: false };
      const id = globalThis.getPadreId();
      return { ok: true, type: typeof id, nonEmpty: typeof id === 'string' && id.length > 0 };
    });
    expect(result.ok).toBe(true);
    expect(result.type).toBe('string');
    expect(result.nonEmpty).toBe(true);
  });

  // ── Flag de estado del sistema ─────────────────────────────────────────

  test('globalThis.__MENSAJERIA_INICIADA es exactamente true (no truthy)', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.__MENSAJERIA_INICIADA);
    expect(val).toBe(true);
  });

  test('globalThis.__CONTROLADOR_REGISTRADOS existe y es un Set', async ({ page }) => {
    const info = await page.evaluate(() => {
      const s = globalThis.__CONTROLADOR_REGISTRADOS;
      return {
        exists: !!s,
        isSet: s instanceof Set,
      };
    });
    expect(info.exists).toBe(true);
    expect(info.isSet).toBe(true);
  });
});
