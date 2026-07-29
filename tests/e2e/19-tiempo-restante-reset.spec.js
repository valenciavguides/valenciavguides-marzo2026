/**
 * 19-tiempo-restante-reset.spec.js
 *
 * Cobertura de un bug encontrado en el barrido de "información vieja no limpiada"
 * (reporte de campo del usuario, ver docs/GUIA-COMPLETA.md §25.10): `estado.tiempoRestante`
 * (codigo-padre.html) se actualiza en cada tick del temporizador de la aventura activa
 * (`_hdl_AVENTURA_TIEMPO_ACTUALIZADO`), pero ninguno de los dos flujos de "elegir otra
 * aventura" lo reseteaba — así que el tiempo que le quedaba a la aventura abandonada se
 * colaba como override al arrancar el temporizador de la aventura nueva
 * (`_iniciarTemporizadorAventura`, parámetro `tiempoRestanteOverride`).
 *
 *   TR-1  `mostrarDialogoVueltaRapida('es')` (expuesta como `globalThis._mostrarDialogoVueltaRapida`,
 *         se dispara al volver atrás o de una pestaña externa con una aventura activa) —
 *         pulsar "Elegir otra aventura" (#btn-vuelta-elegir-otra) resetea
 *         `estado.tiempoRestante` a `null`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('TR — estado.tiempoRestante no sobrevive a "elegir otra aventura"', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('TR-1. "Elegir otra aventura" desde mostrarDialogoVueltaRapida resetea estado.tiempoRestante', async ({ page }) => {
    // gotoAndWaitForFase1 solo garantiza que Script 1 (mensajería) terminó — Script 2, donde
    // vive el getter globalThis.estado, puede tardar un poco más en ejecutarse.
    await page.waitForFunction(
      () => typeof globalThis._mostrarDialogoVueltaRapida === 'function' && typeof globalThis.estado === 'object' && globalThis.estado !== null,
      null,
      { timeout: 15_000 }
    ).catch(() => {});

    const prep = await page.evaluate(() => ({
      tieneDialogo: typeof globalThis._mostrarDialogoVueltaRapida === 'function',
      tieneEstado: typeof globalThis.estado === 'object' && globalThis.estado !== null,
    }));
    test.skip(!prep.tieneDialogo || !prep.tieneEstado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Simula una aventura que llevaba un buen rato corriendo: le quedaban ~57h de una
    // estimada en 60h (igual que dejaría un tick real de AVENTURA.TIEMPO_ACTUALIZADO).
    await page.evaluate(() => {
      // El overlay de carga (§16) no se oculta solo en este entorno de test — los hijos
      // no completan su handshake real (ver nota en 12-carga-por-parada.spec.js) — y su
      // z-index intercepta el click al botón del diálogo. No es lo que este test cubre,
      // así que se oculta explícitamente en vez de esperar un boot que nunca termina.
      if (typeof globalThis.hideParentLoadingOverlay === 'function') globalThis.hideParentLoadingOverlay();
      globalThis.estado.tiempoRestante = 205200;
      // No se espera esta promesa aquí — solo resuelve cuando se pulsa un botón del diálogo.
      globalThis.__testDialogoPromise = globalThis._mostrarDialogoVueltaRapida('es');
    });

    await page.waitForSelector('#btn-vuelta-elegir-otra', { state: 'visible', timeout: 5000 });
    await page.click('#btn-vuelta-elegir-otra');

    await page.waitForFunction(() => globalThis.__testDialogoPromise !== undefined, null, { timeout: 3000 }).catch(() => {});
    const resultado = await page.evaluate(async () => {
      await globalThis.__testDialogoPromise;
      return { tiempoRestante: globalThis.estado.tiempoRestante };
    });

    expect(resultado.tiempoRestante, 'estado.tiempoRestante debe quedar en null tras "elegir otra aventura" — si no, la siguiente aventura heredaría el tiempo restante de esta').toBeNull();
  });
});
