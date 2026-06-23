/**
 * 07-performance-baseline.spec.js
 *
 * Establece la línea base de rendimiento del arranque de FASE 1 ANTES de la
 * extracción a js/controladores-padre.js (DT-1 Opción B).
 *
 * Criterio de aceptación del refactor (DT-1):
 *   "El tiempo de arranque medido en performance.now() no aumenta más de 50ms
 *    respecto al baseline del script inline actual."
 *
 * Qué mide este spec:
 *   - Tiempo de navegación a __MENSAJERIA_INICIADA=true (T_boot)
 *   - Número de handlers registrados en state-manager (baseline handler count)
 *   - Número de entradas en __CONTROLADOR_REGISTRADOS (baseline Set size)
 *   - Número de entradas en __vv_manejadoresLocales (debe ser 0 — DT-1 criterio #5)
 *
 * Cómo usar los resultados:
 *   1. Ejecutar ANTES del refactor → guardar los valores en un comentario
 *      o en la sección "BASELINE" de DEUDA-TECNICA-PRODUCCION.md
 *   2. Ejecutar DESPUÉS del refactor → comparar contra ese baseline
 *   3. Si T_boot aumenta más de 50ms → investigar antes de mergear
 *
 * Los thresholds de este spec son conservadores (el boot no debe superar
 * BOOT_TIMEOUT_THRESHOLD). El objetivo no es que este spec falle en producción,
 * sino que LOS VALORES REGISTRADOS en el log sirvan como referencia comparativa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { BOOT_TIMEOUT, stubCDNResources, stripCSPForTesting } = require('./helpers/boot');

const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');

// Umbral conservador: el boot no debe exceder este tiempo en total
// (incluye servidor, red local, parse de módulos). No es el delta — es el absoluto.
const BOOT_TIMEOUT_THRESHOLD_MS = BOOT_TIMEOUT; // 30 s

// El delta máximo permitido tras el refactor (criterio DT-1)
// Este valor se usa solo como documentación; la comparación real se hace manualmente.
const MAX_REFACTOR_DELTA_MS = 50;

test.describe('Performance baseline — arranque FASE 1 (pre-refactor)', () => {
  // ── Medición del tiempo de arranque ────────────────────────────────────
  //
  // Metodología:
  //   1. Inyectamos un script que registra performance.now() cuando
  //      mensajeriaReady se dispara (T_mensajeriaReady)
  //   2. Esperamos a que __MENSAJERIA_INICIADA sea true (T_boot_complete)
  //   3. Calculamos T_boot = T_boot_complete - T_navigationStart
  //
  // T_navigationStart viene de performance.timing.navigationStart (disponible
  // desde el inicio de la carga de página en el navegador).

  test('PB-1. Tiempo total de boot FASE 1 está dentro del umbral', async ({ page }) => {
    // Inyectar stub de Leaflet
    await page.addInitScript({ path: LEAFLET_STUB });

    // Inyectar spy de timing — captura performance.now() en mensajeriaReady
    await page.addInitScript(() => {
      globalThis.__e2e_timing = { navigationStart: performance.now() };

      globalThis.addEventListener('mensajeriaReady', () => {
        globalThis.__e2e_timing.mensajeriaReady = performance.now();
      }, { once: true });
    });

    await stubCDNResources(page);
    await stripCSPForTesting(page);

    // Navegar y esperar a que el boot complete
    const startTs = Date.now();
    await page.goto('/codigo-padre.html');
    await page.waitForFunction(
      () => globalThis.__MENSAJERIA_INICIADA === true,
      { timeout: BOOT_TIMEOUT_THRESHOLD_MS }
    );
    const wallClockMs = Date.now() - startTs;

    // Leer las marcas de tiempo internas de la página
    const timing = await page.evaluate(() => {
      const t = globalThis.__e2e_timing || {};
      return {
        navigationStart: t.navigationStart || 0,
        mensajeriaReady: t.mensajeriaReady || 0,
        mensajeriaIniciada: globalThis.__MENSAJERIA_INICIADA === true,
        // También capturar el valor de performance.now() ahora (post-boot)
        now: performance.now(),
      };
    });

    // Tiempo desde el inicio de la página hasta mensajeriaReady
    const tBootPage = timing.mensajeriaReady > 0
      ? timing.mensajeriaReady - timing.navigationStart
      : -1;

    // Log para referencia manual — estos valores son el BASELINE pre-refactor
    console.log(`
    ┌─────────────────────────────────────────────────────────────┐
    │  PERFORMANCE BASELINE — pre-refactor (DT-1 Opción B)        │
    ├─────────────────────────────────────────────────────────────┤
    │  T_wallClock (Playwright)    : ${wallClockMs.toFixed(0).padStart(6)} ms             │
    │  T_boot_page (performance.now): ${tBootPage >= 0 ? tBootPage.toFixed(0).padStart(6) : '  N/A '} ms             │
    │  Max delta permitido (DT-1)  : ${MAX_REFACTOR_DELTA_MS.toString().padStart(6)} ms             │
    │                                                             │
    │  GUARDAR ESTOS VALORES en DEUDA-TECNICA (sección baseline)  │
    └─────────────────────────────────────────────────────────────┘`);

    // El boot debe completar (ya lo garantiza waitForFunction arriba)
    expect(timing.mensajeriaIniciada).toBe(true);
    // Umbral absoluto: no debe tardar más de BOOT_TIMEOUT_THRESHOLD_MS en total
    expect(wallClockMs).toBeLessThan(BOOT_TIMEOUT_THRESHOLD_MS);
  });

  // ── Baseline de conteo de handlers ─────────────────────────────────────
  //
  // Estos valores son el BASELINE. Tras el refactor:
  //   - handler_count debe ser >= baseline (no se pueden perder handlers)
  //   - set_size debe ser == baseline (mismos tipos registrados, ni más ni menos)
  //   - local_leak_count debe seguir siendo 0

  test('PB-2. Baseline: conteo de handlers registrados en state-manager', async ({ page }) => {
    await page.addInitScript({ path: LEAFLET_STUB });
    await stubCDNResources(page);
    await stripCSPForTesting(page);
    await page.goto('/codigo-padre.html');
    await page.waitForFunction(() => globalThis.__MENSAJERIA_INICIADA === true, { timeout: BOOT_TIMEOUT_THRESHOLD_MS });

    const baseline = await page.evaluate(() => {
      const sm = globalThis.__vv_stateManager;
      let handlerCount = -1;
      if (sm) {
        try {
          const mapa = sm.getManejadores ? sm.getManejadores() : null;
          if (mapa instanceof Map) handlerCount = mapa.size;
          else if (mapa) handlerCount = Object.keys(mapa).length;
        } catch (e) { handlerCount = -2; }
      }

      const setSize = (globalThis.__CONTROLADOR_REGISTRADOS instanceof Set)
        ? globalThis.__CONTROLADOR_REGISTRADOS.size : -1;

      const localLeak = (() => {
        const local = globalThis.__vv_manejadoresLocales;
        if (!local) return 0;
        if (local instanceof Map) return local.size;
        return Object.keys(local).length;
      })();

      const registeredTypes = (globalThis.__CONTROLADOR_REGISTRADOS instanceof Set)
        ? [...globalThis.__CONTROLADOR_REGISTRADOS].sort()
        : [];

      const localLeakTypes = (() => {
        const local = globalThis.__vv_manejadoresLocales;
        if (!local) return [];
        if (local instanceof Map) return [...local.keys()].sort();
        return Object.keys(local).sort();
      })();

      return { handlerCount, setSize, localLeak, registeredTypes, localLeakTypes };
    });

    // Log del baseline para documentar
    console.log(`
    ┌─────────────────────────────────────────────────────────────┐
    │  HANDLER BASELINE — pre-refactor (DT-1 Opción B)            │
    ├─────────────────────────────────────────────────────────────┤
    │  state-manager handler count : ${baseline.handlerCount.toString().padStart(4)}                      │
    │  __CONTROLADOR_REGISTRADOS   : ${baseline.setSize.toString().padStart(4)} tipos                 │
    │  __vv_manejadoresLocales     : ${baseline.localLeak.toString().padStart(4)} (debe ser 0)         │
    ├─────────────────────────────────────────────────────────────┤
    │  Tipos registrados:                                         │`);
    for (const t of baseline.registeredTypes) {
      console.log(`    │    ${t.padEnd(55)}│`);
    }
    console.log(`    └─────────────────────────────────────────────────────────────┘`);
    if (baseline.localLeak > 0) {
      console.log(`    ⚠️  FUGAS en __vv_manejadoresLocales (${baseline.localLeak} tipos):`);
      for (const t of baseline.localLeakTypes) {
        console.log(`       - ${t}`);
      }
    }

    // Assertions que DEBEN pasar ahora y tras el refactor:
    expect(baseline.handlerCount).toBeGreaterThan(0); // hay handlers registrados
    expect(baseline.setSize).toBeGreaterThan(0);       // el Set tiene entradas
    expect(baseline.localLeak).toBe(0);                // DT-1 criterio #5: cero fugas al mapa local
  });

  // ── Baseline de memoria global expuesta ───────────────────────────────
  //
  // Verifica que el conjunto de variables globales que el refactor debe
  // PRESERVAR están todas presentes. Es una suma de spec 02 aplicada
  // como guardia de regresión explícita para la extracción.

  test('PB-3. Baseline: variables globales críticas presentes y con los tipos correctos', async ({ page }) => {
    await page.addInitScript({ path: LEAFLET_STUB });
    await stubCDNResources(page);
    await stripCSPForTesting(page);
    await page.goto('/codigo-padre.html');
    await page.waitForFunction(() => globalThis.__MENSAJERIA_INICIADA === true, { timeout: BOOT_TIMEOUT_THRESHOLD_MS });

    const snapshot = await page.evaluate(() => ({
      TIPOS_MENSAJE:                typeof globalThis.TIPOS_MENSAJE,
      MODOS:                        typeof globalThis.MODOS,
      registrarControlador:         typeof globalThis.registrarControlador,
      enviarMensaje:                typeof globalThis.enviarMensaje,
      enviarMensajeConConfirmacion: typeof globalThis.enviarMensajeConConfirmacion,
      logger:                       typeof globalThis.logger,
      esTelefonoMovil:              typeof globalThis.esTelefonoMovil,
      ajustarTimeoutPorConexion:    typeof globalThis.ajustarTimeoutPorConexion,
      ajustarTimeoutPorConexionSafe:typeof globalThis.ajustarTimeoutPorConexionSafe,
      CONFIG_PADRE:                 typeof globalThis.CONFIG_PADRE,
      getPadreId:                   typeof globalThis.getPadreId,
      MENSAJERIA_INICIADA:          globalThis.__MENSAJERIA_INICIADA,
      stateManager:                 typeof globalThis.__vv_stateManager,
      mensajeria:                   typeof globalThis.mensajeria,
      registrarControladorSeguro:   typeof globalThis.registrarControladorSeguro,
      procesarControladoresPendientes: typeof globalThis.procesarControladoresPendientes,
      cargarDatosAventuraDiferidos: typeof globalThis.__cargarDatosAventuraDiferidos,
    }));

    // Todas estas deben ser 'object' o 'function' tras el refactor — NUNCA 'undefined'
    expect(snapshot.TIPOS_MENSAJE).toBe('object');
    expect(snapshot.MODOS).toBe('object');
    expect(snapshot.registrarControlador).toBe('function');
    expect(snapshot.enviarMensaje).toBe('function');
    expect(snapshot.enviarMensajeConConfirmacion).toBe('function');
    expect(snapshot.logger).toBe('object');
    expect(['boolean', 'function']).toContain(snapshot.esTelefonoMovil);
    expect(snapshot.ajustarTimeoutPorConexion).toBe('function');
    expect(snapshot.ajustarTimeoutPorConexionSafe).toBe('function');
    expect(snapshot.CONFIG_PADRE).toBe('object');
    expect(snapshot.getPadreId).toBe('function');
    expect(snapshot.MENSAJERIA_INICIADA).toBe(true);
    expect(snapshot.stateManager).toBe('object');
    expect(snapshot.mensajeria).toBe('object');
    expect(snapshot.registrarControladorSeguro).toBe('function');
    expect(snapshot.procesarControladoresPendientes).toBe('function');
    expect(snapshot.cargarDatosAventuraDiferidos).toBe('function');
  });

  // ── Test de no-regresión de criterio DT-1 #5 ─────────────────────────
  //
  // Criterio: "No aparece ninguna llamada a __vv_manejadoresLocales en los
  //            logs de producción (indicaría que un handler no llegó al state-manager)"
  //
  // Lo que podemos verificar en E2E: que el Map local está vacío DESPUÉS del boot.

  test('PB-4. DT-1 criterio #5: __vv_manejadoresLocales está vacío (handlers en state-manager, no en local)', async ({ page }) => {
    await page.addInitScript({ path: LEAFLET_STUB });
    await stubCDNResources(page);
    await stripCSPForTesting(page);
    await page.goto('/codigo-padre.html');
    await page.waitForFunction(() => globalThis.__MENSAJERIA_INICIADA === true, { timeout: BOOT_TIMEOUT_THRESHOLD_MS });

    const leakCount = await page.evaluate(() => {
      const local = globalThis.__vv_manejadoresLocales;
      if (!local) return 0;
      if (local instanceof Map) return local.size;
      return Object.keys(local).length;
    });

    // Cero fugas es el criterio de aceptación del refactor
    expect(leakCount).toBe(0);
  });
});
