/**
 * 146-elegir-otra-aventura-desde-la-reanudacion.spec.js
 *
 * «Elegir otra aventura» es la misma salida desde los dos diálogos: borra la aventura guardada, con el idioma, y recarga la
 * página (estudio K-19). La del diálogo de vuelta, con una aventura arrancada de verdad, la cubre el spec 128; aquí, la del
 * diálogo de reanudación, al abrir la app con una aventura guardada.
 *
 *   ER-1  Sesión guardada → diálogo de reanudación → «elegir otra» y confirmar → la página se recarga, sin diálogo y sin la
 *         aventura guardada ni el idioma en el dispositivo, y el padre arranca sin ninguna aventura en memoria: la siguiente
 *         empieza de cero, como la primera de la sesión (K-50).
 *
 * ROJO ANTES QUE VERDE: con el padre anterior cae ER-1 (no recargaba: borraba la aventura guardada y reiniciaba a mano).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const CLAVES = ['vv_aventura_iniciada', 'vv_progreso', 'vv_paradas_completadas', 'vv_idioma'];

test.describe('ER — «Elegir otra aventura» desde el diálogo de reanudación', () => {
  test('ER-1. Borra la aventura guardada, recarga y arranca sin ninguna aventura', async ({ page }) => {
    // Una sesión guardada de hace un minuto, sembrada una sola vez por pestaña (la recarga no la vuelve a sembrar).
    await page.addInitScript(() => {
      if (sessionStorage.getItem('__er1_sembrada')) return;
      sessionStorage.setItem('__er1_sembrada', '1');
      const hace = Date.now() - 60_000;
      localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'es', modo: 'aventura', dev: false, timestamp: hace }));
      localStorage.setItem('vv_progreso', JSON.stringify({ indiceProgreso: 3, aventura: 'Aventura1', idioma: 'es', timestamp: hace }));
      localStorage.setItem('vv_paradas_completadas', '[]');
      localStorage.setItem('vv_idioma', 'es');
    });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);

    await expect(page.locator('#dialogo-reanudacion-overlay'), 'se ofrece reanudar').toBeVisible();
    await page.click('#btn-elegir-otra');
    const recarga = page.waitForEvent('load', { timeout: 15_000 });
    await page.click('#btn-confirmar-otra');
    await recarga;

    await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 30_000 });
    // La comprobación de la aventura guardada corre 300 ms después del arranque: con margen.
    await page.waitForTimeout(1500);
    await expect(page.locator('#dialogo-reanudacion-overlay'), 'no vuelve a ofrecer reanudar').toHaveCount(0);
    expect(await page.evaluate((claves) => claves.map((k) => localStorage.getItem(k)), CLAVES),
      'ni la aventura guardada ni el idioma quedan en el dispositivo').toEqual([null, null, null, null]);
    expect(await page.evaluate(() => ({
      aventura: globalThis.aventuraSeleccionada ?? null,
      parada: globalThis.estadoPadre?.paradaActual ?? null,
      modo: globalThis.estadoPadre?.modo?.actual ?? null,
    })), 'el padre arranca sin ninguna aventura en memoria').toEqual({ aventura: null, parada: null, modo: null });
  });
});
