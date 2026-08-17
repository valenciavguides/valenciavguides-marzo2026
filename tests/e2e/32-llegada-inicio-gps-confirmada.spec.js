/**
 * 32-llegada-inicio-gps-confirmada.spec.js
 *
 * Cartel de llegada al inicio de la aventura (tipo 'inicio', p.ej. Av1-P-0),
 * confirmado por GPS real — antes (hasta 2026-08-16) se disparaba de forma
 * instantánea al activar la parada (completarCambioParada()), sin esperar a que el
 * usuario llegara de verdad; corregido el mismo día que se eliminó el mecanismo
 * paralelo dormido outOfRangeGrace/pendingCompleciones (ver GUIA-COMPLETA y memoria
 * project_gps_franjas_gracia). Ahora usa el mismo sensor de llegada por ventana
 * deslizante que el resto de paradas (js/funciones-mapa.js,
 * procesarPosicionGPSParaAventura), con guard de una sola vez
 * (estadoMapa._cartelLlegadaInicioMostrado) y gate estricto de modo AVENTURA.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const INICIO = { id: 'Av1-P-0', lat: 39.478760, lng: -0.376260, nombre: 'Torres de Serranos (start)' };

function puntoADistancia(lat, lng, metros, rumboDeg) {
  const R = 6371000;
  const brng = rumboDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180, lng1 = lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(metros / R) + Math.cos(lat1) * Math.sin(metros / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(metros / R) * Math.cos(lat1), Math.cos(metros / R) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

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

async function prepararEscenario(page, modo, id = INICIO.id) {
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
    return {
      tieneFunciones: !!fm?.procesarPosicionGPSParaAventura,
      paradaEncontrada: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === id),
      elementoPadreEncontrado: !!el,
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

async function existeCartelLlegada(page) {
  return page.evaluate(() => {
    const el = document.getElementById('cartel-llegada-parada');
    return { existe: !!el, texto: el?.textContent || '' };
  });
}

test.describe('LI — Cartel de llegada al inicio (confirmado por GPS)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijo2Real(page);
    await page.waitForTimeout(1200);
  });

  test('LI-1. Lejos del inicio en AVENTURA -> NO debe salir el cartel', async ({ page }) => {
    const prep = await prepararEscenario(page, 'aventura');
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const lejos = puntoADistancia(INICIO.lat, INICIO.lng, 500, 45);
    await enviarLectura(page, lejos);
    await page.waitForTimeout(300);

    const info = await existeCartelLlegada(page);
    expect(info.existe, 'No debe salir el cartel estando lejos').toBe(false);
  });

  test('LI-2. Cerca del inicio en AVENTURA (2 lecturas, ventana deslizante) -> SI debe salir el cartel', async ({ page }) => {
    const prep = await prepararEscenario(page, 'aventura');
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, INICIO);
    await page.waitForTimeout(200);
    await enviarLectura(page, INICIO);
    await page.waitForTimeout(300);

    const info = await existeCartelLlegada(page);
    expect(info.existe, 'Debe salir el cartel al confirmar llegada real').toBe(true);
    expect(info.texto).toContain('Torres de Serranos');
  });

  test('LI-3. Repetir lecturas cerca -> el cartel no se re-dispara (guard de una sola vez)', async ({ page }) => {
    const prep = await prepararEscenario(page, 'aventura');
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, INICIO);
    await page.waitForTimeout(200);
    await enviarLectura(page, INICIO);
    await page.waitForTimeout(300);

    // Cerrar el cartel a mano para poder distinguir si se vuelve a crear uno nuevo
    await page.evaluate(() => document.getElementById('cartel-llegada-parada')?.remove());

    await enviarLectura(page, INICIO);
    await page.waitForTimeout(300);
    await enviarLectura(page, INICIO);
    await page.waitForTimeout(300);

    const info = await existeCartelLlegada(page);
    expect(info.existe, 'El guard debe impedir que se vuelva a disparar mientras sigue dentro de rango').toBe(false);
  });

  test('LI-4. Cerca del inicio en modo CASA -> NO debe salir el cartel nunca', async ({ page }) => {
    const prep = await prepararEscenario(page, 'casa');
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, INICIO);
    await page.waitForTimeout(200);
    await enviarLectura(page, INICIO);
    await page.waitForTimeout(300);

    const info = await existeCartelLlegada(page);
    expect(info.existe, 'En CASA el cartel de llegada nunca debe dispararse').toBe(false);
  });
});
