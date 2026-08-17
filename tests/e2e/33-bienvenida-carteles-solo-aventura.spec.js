/**
 * 33-bienvenida-carteles-solo-aventura.spec.js
 *
 * Carteles de "bienvenida de vuelta" (tramo/parada), mostrados cuando el usuario
 * pidió ayuda (polyline manual del botón ubicación) y vuelve a acercarse al destino.
 * Antes (hasta 2026-08-16) estas dos llamadas en js/funciones-mapa.js no estaban
 * protegidas por el modo actual — podían dispararse también en CASA. Ahora ambas
 * viven dentro de `if (estadoMapa.modo === MODOS.AVENTURA) { ... }`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const TRAMO = { id: 'Av1-TR-1', inicio: { lat: 39.478760, lng: -0.376260 } };
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };

async function cargarHijo2Real(page) {
  return page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.id = 'hijo2';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:10px;height:10px;';
      iframe.addEventListener('load', () => {
        try { globalThis.mensajeria.registrarIframe('hijo2', iframe); } catch (_e) { /* reportado abajo */ }
        resolve(true);
      }, { once: true });
      iframe.addEventListener('error', () => resolve(false), { once: true });
      iframe.src = 'coordenadas-hijo2.html';
      document.body.appendChild(iframe);
    });
  });
}

async function prepararConPolylineManual(page, modo, id) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null, { timeout: 15000 }
  ).catch(() => {});

  return page.evaluate(async ({ id, modo }) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
      const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
    const fm = globalThis.funcionesMapa;
    if (typeof fm?.limpiarPorEstado === 'function') {
      fm.limpiarPorEstado({ modo, resetCompleto: true });
      fm.limpiarPorEstado({ modo, paradaActual: id });
    }
    const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
    const el = elementos?.find(e => e.parada_id === id || e.tramo_id === id || e.padreid === `padre-${id}`);
    if (globalThis.estado) {
      if (!globalThis.estado.modo) globalThis.estado.modo = {};
      globalThis.estado.modo.actual = modo;
      globalThis.estado.elementoActual = el || null;
    }
    // Dibujar la polyline manual real (misma función que usa el botón ubicación) para
    // simular "el usuario se alejó y pidió ayuda" — precondición real del cartel de
    // bienvenida (solo dispara si polylineNavegacion existe).
    const mod = await import('/js/funciones-mapa.js');
    const parada = globalThis.AVENTURA_PARADAS.find(p => p.id === id);
    const destino = parada?.inicio || parada?.coordenadas;
    mod.dibujarPolylineNavegacion({ origen: { lat: destino.lat + 0.001, lng: destino.lng + 0.001 }, destino });

    return {
      tieneFunciones: !!fm?.procesarPosicionGPSParaAventura,
      paradaEncontrada: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === id),
      elTipo: el?.tipo || null,
    };
  }, { id, modo });
}

async function enviarLectura(page, coords) {
  await page.evaluate(async (c) => {
    await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
      coords: { latitude: c.lat, longitude: c.lng, accuracy: 8 },
    });
  }, coords);
}

async function estadoCarteles(page) {
  return page.evaluate(() => ({
    tramo: !!document.getElementById('cartel-bienvenida-tramo'),
    parada: !!document.getElementById('cartel-bienvenida-parada'),
  }));
}

test.describe('BV — Carteles de bienvenida de vuelta (solo AVENTURA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijo2Real(page);
    await page.waitForTimeout(1200);
  });

  test('BV-1. TRAMO, AVENTURA, vuelve a <=50m de .inicio con polyline manual -> sale bienvenida-tramo', async ({ page }) => {
    const prep = await prepararConPolylineManual(page, 'aventura', TRAMO.id);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, TRAMO.inicio);
    await page.waitForTimeout(400);

    const info = await estadoCarteles(page);
    expect(info.tramo, 'Debe salir el cartel de bienvenida-tramo').toBe(true);
    expect(info.parada, 'No debe salir el de parada').toBe(false);
  });

  test('BV-2. TRAMO, modo CASA, mismo escenario -> NO debe salir ningún cartel de bienvenida', async ({ page }) => {
    const prep = await prepararConPolylineManual(page, 'casa', TRAMO.id);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, TRAMO.inicio);
    await page.waitForTimeout(400);

    const info = await estadoCarteles(page);
    expect(info.tramo, 'En CASA no debe salir el de tramo').toBe(false);
    expect(info.parada, 'En CASA no debe salir el de parada').toBe(false);
  });

  test('BV-3. PARADA, AVENTURA, vuelve cerca con polyline manual -> sale bienvenida-parada', async ({ page }) => {
    const prep = await prepararConPolylineManual(page, 'aventura', PARADA.id);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, PARADA);
    await page.waitForTimeout(400);

    const info = await estadoCarteles(page);
    expect(info.parada, 'Debe salir el cartel de bienvenida-parada').toBe(true);
    expect(info.tramo, 'No debe salir el de tramo').toBe(false);
  });
});
