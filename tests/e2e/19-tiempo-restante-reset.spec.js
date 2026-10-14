/**
 * 19-tiempo-restante-reset.spec.js
 *
 * `estado.tiempoRestante` (codigo-padre.html) se actualiza en cada tick del temporizador de la
 * aventura activa (`_hdl_AVENTURA_TIEMPO_ACTUALIZADO`). Si sobreviviera a "elegir otra aventura",
 * el tiempo que le quedaba a la aventura abandonada se colaría como override al arrancar el
 * temporizador de la aventura nueva (`_iniciarTemporizadorAventura`, parámetro
 * `tiempoRestanteOverride`). Ver docs/GUIA-COMPLETA.md §25.10.
 *
 *   TR-1  `mostrarDialogoVueltaRapida('es')` (expuesta como `globalThis._mostrarDialogoVueltaRapida`,
 *         se dispara al volver atrás o de una pestaña externa con una aventura activa) —
 *         pulsar "Elegir otra aventura" (#btn-vuelta-elegir-otra) recarga la página, y en la
 *         página recargada `estado.tiempoRestante` no es un número. El recorrido entero de ese
 *         botón, con una aventura arrancada de verdad, lo cubre el spec 128.
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

  test('TR-1. "Elegir otra aventura" desde mostrarDialogoVueltaRapida no deja el tiempo restante de la abandonada', async ({ page }) => {
    // gotoAndWaitForFase1 solo garantiza que Script 1 (mensajería) terminó — Script 2, donde
    // vive el getter globalThis.estado, puede tardar un poco más en ejecutarse.
    const estadoListo = () => page.waitForFunction(
      () => typeof globalThis._mostrarDialogoVueltaRapida === 'function' && typeof globalThis.estado === 'object' && globalThis.estado !== null,
      null,
      { timeout: 15_000 }
    );
    await estadoListo();

    // Simula una aventura que llevaba un buen rato corriendo: le quedaban ~57h de una
    // estimada en 60h (igual que dejaría un tick real de AVENTURA.TIEMPO_ACTUALIZADO).
    await page.evaluate(() => {
      globalThis.estado.tiempoRestante = 205200;
      // No se espera esta promesa aquí — solo resuelve cuando se pulsa un botón del diálogo.
      globalThis.__testDialogoPromise = globalThis._mostrarDialogoVueltaRapida('es');
    });
    // Control: el valor está puesto de verdad antes de pulsar; si no, el `null` de después no diría nada.
    expect(await page.evaluate(() => globalThis.estado.tiempoRestante)).toBe(205200);

    await page.waitForSelector('#btn-vuelta-elegir-otra', { state: 'attached', timeout: 5000 });
    const recarga = page.waitForEvent('load', { timeout: 30_000 });
    // El clic recarga la página: la llamada puede quedarse sin contexto, y eso es justo lo esperado.
    await page.evaluate(() => document.getElementById('btn-vuelta-elegir-otra').click()).catch(() => {});
    await recarga;
    await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
    await estadoListo();

    // En la página recién cargada el campo no tiene valor; lo que el temporizador mira es si es un número.
    const tipo = await page.evaluate(() => typeof globalThis.estado.tiempoRestante);
    expect(tipo, 'tras "elegir otra aventura" no puede quedar un tiempo restante — si no, la siguiente aventura heredaría el de esta').not.toBe('number');
  });
});
