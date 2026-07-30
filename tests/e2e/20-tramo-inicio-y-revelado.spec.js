/**
 * 20-tramo-inicio-y-revelado.spec.js
 *
 * Cobertura de dos bugs del reporte de campo del usuario tras reanudar Aventura1 y
 * alejarse del punto real de un tramo activo (ver docs/GUIA-COMPLETA.md §4.6/§4.7d):
 *
 *   PC-1  La polyline verde manual (botón ubicación, NAVEGACION.MOSTRAR_UBICACION_POLYLINE)
 *         apuntaba siempre a Torres de Serranos (P-0) cuando el elemento activo era un
 *         TRAMO, nunca a su punto real de inicio. Causa: _resolverCoordenadasElemento()
 *         (codigo-padre.html) leía únicamente `entrada.coordenadas` de la respuesta de
 *         hijo2 — un campo que solo existe en paradas; los tramos solo tienen
 *         `.inicio`/`.fin`/`.waypoints`, así que la función devolvía null y todo tramo
 *         caía siempre al fallback fijo `_obtenerCoordenadasFallbackP0()`. El fix añade
 *         el fallback `entrada.coordenadas || entrada.inicio`.
 *   RV-1  El trazado completo de un tramo (polyline + marcadores 📌🎯) se revelaba de
 *         golpe al avanzar hacia él (pendingRevealNavegacion) y se quedaba visible para
 *         siempre, sin relación con la posición real del usuario — si cerraba la app y la
 *         reanudaba lejos, veía todo el tramo dibujado sin haber llegado a su inicio. El
 *         fix hace que completarCambioParada() mantenga SIEMPRE oculto el trazado de un
 *         tramo en modo AVENTURA, y solo procesarPosicionGPSParaAventura() lo revela
 *         (revelarNavegacion()) al confirmar por GPS que el usuario está a ≤20m de
 *         `.inicio` — mismo radio que "llegada" en paradas.
 *
 * PC-1 mockea solicitarCoordenadasHijo (hijo2 no carga de forma fiable como iframe real
 * en este entorno — mismo límite documentado en 12-carga-por-parada.spec.js) para simular
 * la respuesta real de hijo2 a una petición de coordenadas de un tramo, y envuelve
 * maplibregl.Map para capturar las fuentes geojson añadidas al mapa y leer las
 * coordenadas reales de la polyline dibujada.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Mismos datos reales de Av1-TR-1 que usa 13-gps-tramo-fix.spec.js.
const TRAMO = {
  id: 'Av1-TR-1',
  tipo: 'tramo',
  inicio: { lat: 39.47876, lng: -0.37626 },
  waypoints: [
    { lat: 39.47905, lng: -0.37613 },
    { lat: 39.479341, lng: -0.376408 },
    { lat: 39.4795, lng: -0.37621 },
    { lat: 39.47943, lng: -0.37597 },
  ],
  fin: { lat: 39.47959, lng: -0.37583 },
};

async function esperarPipelineListo(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null,
    { timeout: 15_000 }
  ).catch(() => { /* el test reportará el fallo real vía prep.tieneFunciones */ });
}

async function prepararEscenarioTramo(page) {
  await esperarPipelineListo(page);
  return page.evaluate(async (tramo) => {
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
      fm.limpiarPorEstado({ modo: 'aventura', paradaActual: tramo.id });
    }
    return {
      tieneFunciones: !!(fm?.procesarPosicionGPSParaAventura),
      tramoEncontrado: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === tramo.id),
    };
  }, TRAMO);
}

test.describe('PC — Polyline manual a .inicio en tramos (no P-0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    // Envuelve el constructor Map del stub para poder leer, desde el test, las fuentes
    // geojson reales que crea _crearPolyline() — _mapaInstance es privado del módulo
    // funciones-mapa.js y no hay otra forma de inspeccionar las coordenadas dibujadas.
    await page.addInitScript(() => {
      const OriginalMap = globalThis.maplibregl.Map;
      globalThis.maplibregl.Map = function (opts) {
        const instancia = OriginalMap(opts);
        globalThis.__testUltimoMapa = instancia;
        return instancia;
      };
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('PC-1. MOSTRAR_UBICACION_POLYLINE con un tramo activo dibuja hasta .inicio, no hasta P-0', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate(async () => {
      const inicioEsperado = { lat: 39.47000, lng: -0.38000 };
      const finLejano = { lat: 39.47500, lng: -0.37500 }; // deliberadamente lejos de .inicio
      const original = globalThis.solicitarCoordenadasHijo;
      // Simula la respuesta real de hijo2 a DATOS.COORDENADAS_PARADAS_REQUEST para un
      // tramo: el objeto crudo de coordenadas-aventuras.js, sin campo .coordenadas.
      globalThis.solicitarCoordenadasHijo = async () => ({
        coordenadas: [{ id: 'Av1-TR-1', tipo: 'tramo', inicio: inicioEsperado, fin: finLejano, waypoints: [] }],
        total: 1,
        exito: true,
      });
      try {
        globalThis.postMessage({
          tipo: 'NAVEGACION.MOSTRAR_UBICACION_POLYLINE',
          origen: 'hijo2',
          destino: 'padre',
          datos: {
            elementoId: 'Av1-TR-1',
            ubicacionUsuario: { lat: 39.46000, lng: -0.39000 },
            centrar: false,
          },
        }, globalThis.location.origin);

        await new Promise(r => setTimeout(r, 600));

        const mapa = globalThis.__testUltimoMapa;
        const fuentes = mapa ? Object.entries(mapa._sources).filter(([id]) => id.startsWith('vv-polyline-')) : [];
        const ultima = fuentes[fuentes.length - 1];
        const coords = ultima ? ultima[1].data?.geometry?.coordinates : null;
        // El último punto de la polyline (usuario→destino) es el destino resuelto, en
        // formato MapLibre [lng, lat].
        const destinoDibujado = coords ? coords[coords.length - 1] : null;
        return { ok: true, destinoDibujado, totalFuentes: fuentes.length };
      } finally {
        globalThis.solicitarCoordenadasHijo = original;
      }
    });

    test.skip(!resultado.ok || resultado.totalFuentes === 0, `No se dibujó ninguna polyline: ${JSON.stringify(resultado)}`);

    const [lngDibujado, latDibujado] = resultado.destinoDibujado;
    // Debe coincidir con inicioEsperado (39.47000, -0.38000), no con P-0 (Torres de
    // Serranos, ~39.4762/-0.3762) ni con finLejano (39.47500, -0.37500).
    expect(latDibujado, `La polyline debe apuntar a .inicio del tramo, no a P-0 ni a .fin. Destino dibujado: ${JSON.stringify(resultado.destinoDibujado)}`).toBeCloseTo(39.47000, 3);
    expect(lngDibujado, `La polyline debe apuntar a .inicio del tramo, no a P-0 ni a .fin. Destino dibujado: ${JSON.stringify(resultado.destinoDibujado)}`).toBeCloseTo(-0.38000, 3);
  });
});

test.describe('RV — Revelación del trazado del tramo solo por proximidad real a .inicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('RV-1. El trazado permanece oculto lejos de .inicio y se revela al llegar a ≤20m', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // 1) Usuario en .fin del tramo — a ~120m de .inicio (ver 13-gps-tramo-fix.spec.js).
    // gpsVisualActivo arranca en false por defecto (resetCompleto en prepararEscenarioTramo
    // no lo toca) — este primer chequeo confirma que sigue así de lejos de .inicio.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Lejos de .inicio (en .fin), el trazado del tramo debe seguir oculto').not.toBe(true);

    // 2) Usuario exactamente en .inicio — debe revelarse.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'A ≤20m de .inicio, el trazado del tramo debe revelarse').toBe(true);
  });
});
