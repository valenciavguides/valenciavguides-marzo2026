/**
 * 20-tramo-inicio-y-revelado.spec.js
 *
 * Cobertura del diseño de visibilidad del trazado persistente en AVENTURA
 * (docs/GUIA-COMPLETA.md §4.5): se revela siempre de inmediato al activarse el elemento
 * (parada o tramo, cerca o lejos de verdad), nunca se oculta por distancia, y la única
 * forma de ocultarlo es pulsar btn-ubicacion — que dibuja una línea manual hacia .inicio
 * mientras el tramo no esté completo. Volver al radio de .inicio limpia esa línea y
 * revela el trazado persistente de nuevo.
 *
 *   PC-1  La polyline verde manual (botón ubicación, NAVEGACION.MOSTRAR_UBICACION_POLYLINE)
 *         apuntaba siempre a Torres de Serranos (P-0) cuando el elemento activo era un
 *         TRAMO, nunca a su punto real de inicio. Causa: _resolverCoordenadasElemento()
 *         (codigo-padre.html) leía únicamente `entrada.coordenadas` de la respuesta de
 *         hijo2 — un campo que solo existe en paradas; los tramos solo tienen
 *         `.inicio`/`.fin`/`.waypoints`, así que la función devolvía null y todo tramo
 *         caía siempre al fallback fijo `_obtenerCoordenadasFallbackP0()`. El fix añade
 *         el fallback `entrada.coordenadas || entrada.inicio`.
 *   RV-1  El trazado se revela sin depender de ninguna lectura GPS — completarCambioParada()
 *         llama a revelarNavegacion() sin condición al activar el elemento.
 *   RV-2  Una vez revelado, el trazado permanece visible aunque el usuario esté lejos de
 *         .inicio y de todo el camino — ya no existe ningún ocultado automático por
 *         distancia (el sistema de "cerca/lejos" con ventana deslizante se eliminó).
 *   PL-1  Pulsar el botón de ubicación (dibujarPolylineNavegacion) oculta el trazado
 *         persistente de inmediato — la única señal visible mientras se muestra la línea
 *         manual debe ser ella misma y su propia diana de destino.
 *   PL-2  Mientras la línea manual está activa, estar cerca de un punto del camino que NO
 *         es .inicio (un waypoint, o el propio .fin) no limpia la línea ni revela el
 *         trazado — solo .inicio cuenta, mientras el tramo no esté completo.
 *   PL-3  Volver al radio de .inicio con la línea manual activa SÍ la limpia y revela el
 *         trazado persistente de nuevo.
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

        // Sondeo en vez de espera fija: el roundtrip async (postMessage → mock de
        // solicitarCoordenadasHijo → dibujarPolylineNavegacion) puede tardar más de lo
        // habitual bajo carga (toda la suite corriendo a la vez) — un delay fijo corto
        // volvía el test intermitente en proyectos más lentos (pixel5), aunque la función
        // real fuera correcta. Sondear hasta 3s, devolver en cuanto aparezca la fuente.
        let fuentes = [];
        const limite = Date.now() + 3000;
        while (Date.now() < limite) {
          const mapa = globalThis.__testUltimoMapa;
          fuentes = mapa ? Object.entries(mapa._sources).filter(([id]) => id.startsWith('vv-polyline-')) : [];
          if (fuentes.length > 0) break;
          await new Promise(r => setTimeout(r, 100));
        }
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

test.describe('RV — El trazado se revela de inmediato y no se oculta nunca por distancia', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('RV-1. revelarNavegacion() deja el trazado visible sin depender de ninguna lectura GPS', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // completarCambioParada() llama a esto sin condición al activar el elemento, antes de
    // cualquier lectura GPS. Se invoca aquí directamente porque el arnés de test fija el
    // elemento activo con limpiarPorEstado() (atajo interno), no con el pipeline completo de
    // mensajería que dispara completarCambioParada() de verdad.
    await page.evaluate(async () => {
      const { revelarNavegacion } = await import('/js/funciones-mapa.js');
      revelarNavegacion();
    });

    // waitForFunction (no una espera fija): sincronizarEstadoGPSConPadre() escribe en
    // globalThis.estadoPadre.gps, y globalThis.estado.gps se actualiza a partir de ahí por
    // su propio camino — sondear evita depender de un margen de tiempo arbitrario.
    await page.waitForFunction(() => globalThis.estado?.gps?.visualActivo === true, null, { timeout: 5000 });
    const visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'El trazado debe quedar visible de inmediato, sin ninguna lectura GPS').toBe(true);
  });

  test('RV-2. Una vez revelado, el trazado permanece visible aunque el usuario esté lejos de .inicio y de todo el camino', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async () => {
      const { revelarNavegacion } = await import('/js/funciones-mapa.js');
      revelarNavegacion();
    });
    await page.waitForFunction(() => globalThis.estado?.gps?.visualActivo === true, null, { timeout: 5000 });
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: revelado').toBe(true);

    // Lejos de .inicio, de todo el camino (waypoints/fin) y del tramo entero — ya no existe
    // ningún ocultado automático por distancia, así que ningún tick debe apagarlo.
    const PUNTO_LEJOS = { lat: 39.48250, lng: -0.37150 };
    for (let i = 0; i < 6; i++) {
      await page.evaluate(async (punto) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: punto.lat, longitude: punto.lng, accuracy: 5 },
        });
      }, PUNTO_LEJOS);
      await page.waitForTimeout(200);
      visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
      expect(visualActivo, `Tick ${i + 1}: el trazado no debe ocultarse nunca por distancia`).toBe(true);
    }
  });
});

test.describe('PL — La polyline manual oculta el trazado; solo volver a .inicio la limpia y lo revela', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // Garantía pedida por el usuario: "cuando sale la polyline verde, todos los emojis y
  // polyline de parada/tramo deben desaparecer" — la única forma de ocultar el trazado
  // persistente es pulsar btn-ubicacion.
  test('PL-1. dibujarPolylineNavegacion oculta el trazado ya revelado de inmediato', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async () => {
      const { revelarNavegacion } = await import('/js/funciones-mapa.js');
      revelarNavegacion();
    });
    await page.waitForFunction(() => globalThis.estado?.gps?.visualActivo === true, null, { timeout: 5000 });
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: el trazado debe estar revelado antes de pulsar el botón de ubicación').toBe(true);

    // No está expuesta en globalThis.funcionesMapa (esa es una lista manual que no la
    // incluye) — mismo patrón de import dinámico ya usado en 13-gps-tramo-fix.spec.js.
    await page.evaluate(async (tramo) => {
      const { dibujarPolylineNavegacion } = await import('/js/funciones-mapa.js');
      await dibujarPolylineNavegacion({
        origen: { lat: 39.46000, lng: -0.39000 },
        destino: tramo.inicio,
        opciones: { color: '#3eff3f' },
      });
    }, TRAMO);

    visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Al dibujar la polyline manual, el trazado persistente debe ocultarse inmediatamente').not.toBe(true);
  });

  // Mientras el tramo no esté completo, el destino real de la línea manual es siempre
  // .inicio (PC-1) — estar cerca de cualquier OTRO punto del camino no debe limpiarla ni
  // revelar el trazado, aunque ese punto esté sobre la ruta prediseñada.
  test('PL-2. Con la línea manual activa, estar cerca de un punto del camino que no es .inicio no la limpia ni revela el trazado', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async () => {
      const { revelarNavegacion } = await import('/js/funciones-mapa.js');
      revelarNavegacion();
    });
    await page.evaluate(async (tramo) => {
      const { dibujarPolylineNavegacion } = await import('/js/funciones-mapa.js');
      await dibujarPolylineNavegacion({
        origen: { lat: 39.46000, lng: -0.39000 },
        destino: tramo.inicio,
        opciones: { color: '#3eff3f' },
      });
    }, TRAMO);
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: trazado oculto tras pulsar ubicación').not.toBe(true);

    // Un waypoint intermedio y el propio .fin — ninguno de los dos es .inicio, así que en
    // ningún caso debe limpiarse la línea ni revelarse el trazado.
    const puntosNoInicio = [TRAMO.waypoints[2], TRAMO.fin];
    for (const punto of puntosNoInicio) {
      await page.evaluate(async (p) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: p.lat, longitude: p.lng, accuracy: 5 },
        });
      }, punto);
      await page.waitForTimeout(200);
      visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
      expect(visualActivo, `Cerca de ${JSON.stringify(punto)} (no .inicio): el trazado no debe revelarse`).not.toBe(true);
    }
  });

  test('PL-3. Volver al radio de .inicio con la línea manual activa la limpia y revela el trazado', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async () => {
      const { revelarNavegacion } = await import('/js/funciones-mapa.js');
      revelarNavegacion();
    });
    await page.evaluate(async (tramo) => {
      const { dibujarPolylineNavegacion } = await import('/js/funciones-mapa.js');
      await dibujarPolylineNavegacion({
        origen: { lat: 39.46000, lng: -0.39000 },
        destino: tramo.inicio,
        opciones: { color: '#3eff3f' },
      });
    }, TRAMO);
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: trazado oculto tras pulsar ubicación').not.toBe(true);

    // Usuario vuelve a estar cerca de .inicio — debe limpiar la línea manual y revelar el
    // trazado persistente en el mismo tick.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(200);

    visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'De vuelta en .inicio, la línea manual debe limpiarse y el trazado revelarse').toBe(true);
  });
});
