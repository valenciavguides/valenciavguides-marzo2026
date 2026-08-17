/**
 * 37-guard-concurrencia-cambio-modo.spec.js
 *
 * Guard de secuencia completa en _hdl_SISTEMA_CAMBIO_MODO (estado.sistema.cambiandoModo,
 * 2026-08-17): un segundo SISTEMA.CAMBIO_MODO que llega mientras el primero sigue
 * resolviendo debe rechazarse limpio, sin corromper el progreso congelado. Antes el
 * guard vivía solo DENTRO de manejarCambioModo() (js/app.js), dejando sin proteger el
 * freeze de paradaRealCongelada (que ocurre ANTES de llamar a manejarCambioModo) ni la
 * restauración posterior (__triggerCambioParadaInterno, que ocurre DESPUÉS) — origen
 * real del bug de campo "parada 4 de 68" al reanudar sesión con un cambio de modo
 * solapado. Ahora el guard cubre el handler completo de principio a fin.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('GC — Guard de concurrencia en cambio de modo', () => {
  test.beforeEach(async ({ page, context }) => {
    // Sin esto, el activarGPS()/watchPosition() real que dispara _vv_triggerCambioModo
    // se queda colgado para siempre en Firefox — ver 30-casa-no-fuga-aventura.spec.js
    // (CM-6) y la memoria feedback_e2e_geolocation_firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('GC-1. Dos cambios de modo solapados: uno se rechaza, el guard nunca se queda atascado', async ({ page }) => {
    const disponible = await page.evaluate(() => typeof globalThis._vv_triggerCambioModo === 'function');
    test.skip(!disponible, '_vv_triggerCambioModo no disponible en este entorno');

    const resultado = await page.evaluate(async () => {
      globalThis._devModeActivo = true;
      // Dos llamadas SIN esperar la primera -- exactamente la carrera real
      const p1 = globalThis._vv_triggerCambioModo('aventura');
      const p2 = globalThis._vv_triggerCambioModo('casa');
      const [r1, r2] = await Promise.all([p1, p2]);
      return {
        r1: { exito: r1?.exito, error: r1?.error },
        r2: { exito: r2?.exito, error: r2?.error },
        guardTrasAmbas: globalThis.estado?.sistema?.cambiandoModo,
      };
    });

    const exitosos = [resultado.r1.exito, resultado.r2.exito].filter(Boolean).length;
    expect(exitosos, 'Exactamente una de las dos peticiones solapadas debe tener éxito').toBe(1);
    expect(resultado.guardTrasAmbas, 'El guard debe quedar liberado (false) tras terminar ambas, nunca atascado en true').toBe(false);
  });

  test('GC-2. Tras el rechazo, un tercer cambio de modo (ya sin solape) funciona con normalidad', async ({ page }) => {
    // En WebKit, sin iframes hijo reales presentes, la tercera llamada puede encontrar
    // la activación de GPS de la llamada anterior "ya en progreso" (de-dup pre-existente
    // en activarGPS(), no relacionado con el guard de esta sesión) y esperar en cadena
    // varios timeouts internos de 15s (notificarCambioModoInminente, actualizarInterfazModo,
    // notificarCambioModoCompletado) antes de resolver — diagnosticado con logs en vivo,
    // resuelve correctamente pero puede superar el timeout por defecto de 60s en este motor.
    test.setTimeout(120_000);
    const disponible = await page.evaluate(() => typeof globalThis._vv_triggerCambioModo === 'function');
    test.skip(!disponible, '_vv_triggerCambioModo no disponible en este entorno');

    await page.evaluate(async () => {
      globalThis._devModeActivo = true;
      const p1 = globalThis._vv_triggerCambioModo('aventura');
      const p2 = globalThis._vv_triggerCambioModo('casa');
      await Promise.all([p1, p2]);
    });

    const r3 = await page.evaluate(async () => {
      return globalThis._vv_triggerCambioModo('aventura');
    });
    expect(r3.exito, 'Sin solape, el guard no debe bloquear un cambio de modo normal').toBe(true);
  });
});
