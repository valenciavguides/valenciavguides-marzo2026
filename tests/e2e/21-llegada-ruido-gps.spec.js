/**
 * 21-llegada-ruido-gps.spec.js
 *
 * Prueba de humo end-to-end para el arreglo de confirmación de llegada por ventana
 * deslizante (ver docs/GUIA-COMPLETA.md), a raíz de un reporte de campo: en Av1-P-1,
 * con GPS real de móvil, la aproximación de 200m se seguía con distancia decreciente
 * correcta (polyline verde incluida), pero al llegar a la diana física la llegada nunca
 * se detectaba, ni esperando un buen rato parado en el sitio.
 *
 * Causa raíz confirmada: _registrarCandidataLlegada() (coordenadas-hijo2.html y su
 * equivalente en js/funciones-mapa.js) exigía 2 lecturas GPS SEGUIDAS dentro del radio
 * de 20m. El ruido real de GPS urbano (calles estrechas, edificios altos) hace que la
 * distancia oscile alrededor de un umbral fijo — basta con que una lectura de cada dos
 * caiga fuera del radio para que el contador de "seguidas" nunca llegue a 2, sin importar
 * cuánto tiempo pase. El arreglo confirma con 2 de las últimas 4 lecturas (no
 * necesariamente seguidas), tolerando ese patrón sin perder la protección original
 * contra una única lectura ruidosa aislada.
 *
 * De camino se encontró y arregló un segundo bug, independiente: el sensor "redundante"
 * de funciones-mapa.js (pensado como respaldo del de hijo2) se autoenviaba
 * NAVEGACION.LLEGADA_DETECTADA con destino: resolverIdPadre() — el ID del propio padre.
 * _enviarDesdePadre() (mensajeria.js) busca ese destino en iframesRegistrados, que nunca
 * contiene al padre mismo, así que el mensaje se descartaba en silencio en TODAS las
 * llamadas (código muerto desde que se escribió). Ahora usa
 * globalThis.__triggerLlegadaDetectadaInterno(), que llama al handler del padre
 * directamente — mismo patrón que __triggerCambioParadaInterno.
 *
 *   RG-1  Caso limpio (sin ruido): 2 lecturas exactas en la diana SÍ confirman la
 *         llegada — control de que el arreglo no rompió el caso normal.
 *   RG-2  Una única lectura ruidosa aislada (1 de 4) NO confirma la llegada — la
 *         ventana deslizante conserva la protección original contra falsos positivos.
 *   RG-3  Ruido oscilando 15m/25m alrededor del radio de 20m (nunca 2 lecturas SEGUIDAS
 *         dentro), reproduciendo el reporte de campo con datos reales de Av1-P-1 y un
 *         hijo2 real cargado como iframe (no un mensaje sintético): SÍ confirma la
 *         llegada tras el arreglo — antes del arreglo, esto nunca confirmaba.
 *   RG-4  El sensor redundante de funciones-mapa.js ya no genera el warning "Iframe no
 *         encontrado o sin contentWindow" con el ID del propio padre como destino.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Av1-P-1 real (js/coordenadas-aventuras.js).
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };

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

async function prepararEscenario(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null, { timeout: 15_000 }
  ).catch(() => {});

  return page.evaluate(async (parada) => {
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
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      fm.limpiarPorEstado({ modo: 'aventura', paradaActual: parada.id });
    }
    const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
    const el = elementos?.find(e => e.parada_id === parada.id);
    if (el && globalThis.estado) {
      if (!globalThis.estado.modo) globalThis.estado.modo = {};
      globalThis.estado.modo.actual = 'aventura';
      globalThis.estado.elementoActual = el;
      globalThis.estado.pendingCompleciones = {};
    }
    return {
      tieneFunciones: !!fm?.procesarPosicionGPSParaAventura,
      paradaEncontrada: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === parada.id),
      padreid: el?.padreid || null,
    };
  }, PARADA);
}

async function leerPendingLlegada(page, padreid) {
  return page.evaluate((padreid) => globalThis.estado?.pendingCompleciones?.[padreid]?.llegada, padreid);
}

async function enviarLectura(page, coords) {
  await page.evaluate(async (c) => {
    await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
      coords: { latitude: c.lat, longitude: c.lng, accuracy: 8 },
    });
  }, coords);
}

test.describe('RG — Llegada por ventana deslizante, tolerante a ruido GPS real', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijo2Real(page);
    await page.waitForTimeout(1200);
  });

  test('RG-1. Caso limpio: 2 lecturas exactas en la diana confirman la llegada', async ({ page }) => {
    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, PARADA);
    await page.waitForTimeout(300);
    await enviarLectura(page, PARADA);
    await page.waitForTimeout(300);

    const pending = await leerPendingLlegada(page, prep.padreid);
    expect(pending, 'Caso limpio debe confirmar llegada').toBe(true);
  });

  test('RG-2. Una única lectura ruidosa aislada (1 de 4) NO confirma la llegada', async ({ page }) => {
    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // 1 lectura dentro de radio (10m) rodeada de lecturas lejos (80m) — nunca debe
    // acumular 2 de 4 dentro del radio.
    const lejos = puntoADistancia(PARADA.lat, PARADA.lng, 80, 0);
    const cerca = puntoADistancia(PARADA.lat, PARADA.lng, 10, 0);
    for (const pt of [lejos, cerca, lejos, lejos]) {
      await enviarLectura(page, pt);
      await page.waitForTimeout(150);
    }

    const pending = await leerPendingLlegada(page, prep.padreid);
    expect(pending, 'Una única lectura dentro de radio (aislada) no debe confirmar llegada').not.toBe(true);
  });

  test('RG-3. Ruido 15m/25m alrededor del radio de 20m SÍ confirma llegada (reporte de campo)', async ({ page }) => {
    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Nunca 2 lecturas SEGUIDAS dentro del radio de 20m por construcción — antes del
    // arreglo esto no confirmaba llegada nunca, por muchas lecturas que pasaran.
    for (let i = 0; i < 12; i++) {
      const metros = i % 2 === 0 ? 15 : 25;
      const pt = puntoADistancia(PARADA.lat, PARADA.lng, metros, 90);
      await enviarLectura(page, pt);
      await page.waitForTimeout(180);
    }

    const pending = await leerPendingLlegada(page, prep.padreid);
    expect(pending, 'Ruido oscilando alrededor del radio debe confirmar llegada con la ventana deslizante').toBe(true);
  });

  test('RG-4. El sensor redundante de funciones-mapa.js ya no descarta su propio envío', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneFunciones || !prep.paradaEncontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarLectura(page, PARADA);
    await page.waitForTimeout(200);
    await enviarLectura(page, PARADA);
    await page.waitForTimeout(300);

    const huboDescartePorAutoenvio = logs.some(l => /Iframe no encontrado o sin contentWindow: padre/i.test(l));
    expect(huboDescartePorAutoenvio, 'El autoenvío de funciones-mapa.js no debe volver a descartarse por falta de destino').toBe(false);
  });
});
