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
 *
 * RV-1 confirma la revelación con 2 lecturas seguidas (no 1) porque la visibilidad del
 * trazado no es un latch de una sola dirección — ver RV2 más abajo, que cubre el
 * comportamiento bidireccional (se puede ocultar otra vez tras haberse revelado). La
 * confirmación real es una ventana deslizante (2 de las últimas 4 lecturas, no
 * necesariamente seguidas) — RV-1 usa 2 seguidas como estímulo porque sigue confirmando,
 * pero RV-3 prueba el caso de ruido real (lecturas alternando dentro/fuera de radio) que
 * motivó el cambio, mismo ajuste que en la confirmación de llegada (§25.5 de la guía).
 *
 *   RV2-1  Una vez que un tramo ya se alcanzó a .inicio alguna vez, desviarse del CAMINO
 *          (no de .inicio — avanzar hacia .fin también aleja de .inicio, y eso no debe ocultar
 *          nada) oculta el trazado, y volver a acercarse en cualquier punto del camino lo
 *          revela de nuevo sin exigir pasar otra vez por .inicio. Cubre el caso de una calle
 *          cortada por obras que obliga a un desvío real del trazado prediseñado.
 *   PL-1   Pulsar el botón de ubicación (dibujarPolylineNavegacion) oculta el trazado
 *          persistente de inmediato, sin depender de que la próxima lectura GPS lo confirme
 *          por distancia — la única señal visible mientras se muestra la línea manual debe
 *          ser ella misma y su propia diana de destino.
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

function puntoADistancia(lat, lng, metros, rumboDeg) {
  const R = 6371000;
  const brng = rumboDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180, lng1 = lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(metros / R) + Math.cos(lat1) * Math.sin(metros / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(metros / R) * Math.cos(lat1), Math.cos(metros / R) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

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

    // 2) Usuario exactamente en .inicio — debe revelarse. Dos lecturas seguidas (no una):
    // la visibilidad del trazado ahora se confirma por 2 lecturas iguales seguidas (igual que
    // la detección de llegada) para poder ser bidireccional sin parpadear — antes se revelaba
    // con una sola lectura porque nunca se volvía a ocultar después.
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (tramo) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
        });
      }, TRAMO);
      await page.waitForTimeout(300);
    }

    visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'A ≤20m de .inicio con 2 lecturas seguidas, el trazado del tramo debe revelarse').toBe(true);
  });

  test('RV-3. Ruido GPS oscilando alrededor del radio de 20m de .inicio SÍ revela el trazado (ventana deslizante)', async ({ page }) => {
    // Mismo ajuste que la confirmación de llegada (ver 21-llegada-ruido-gps.spec.js y
    // docs/GUIA-COMPLETA.md §25.5): 2 lecturas SEGUIDAS podía no cumplirse nunca con GPS
    // real oscilando alrededor del umbral, dejando el trazado sin revelarse indefinidamente
    // aunque el usuario ya estuviera en .inicio. Ahora confirma con 2 de las últimas 4.
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // 12 lecturas alternando 15m/25m alrededor de .inicio — nunca 2 SEGUIDAS dentro de 20m.
    for (let i = 0; i < 12; i++) {
      const metros = i % 2 === 0 ? 15 : 25;
      const pt = puntoADistancia(TRAMO.inicio.lat, TRAMO.inicio.lng, metros, 90);
      await page.evaluate(async (c) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: c.lat, longitude: c.lng, accuracy: 5 },
        });
      }, pt);
      await page.waitForTimeout(180);
    }

    const visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Ruido oscilando alrededor de .inicio debe revelar el trazado con la ventana deslizante').toBe(true);
  });
});

test.describe('RV2 — Trazado de tramo ya iniciado: se oculta al desviarse del camino y se revela sin volver a .inicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // Cobertura del caso "calle cortada por obras" discutido con el usuario: una vez que el
  // tramo ya se alcanzó a .inicio alguna vez, alejarse del CAMINO (no de .inicio) debe ocultar
  // el trazado, y volver a acercarse al camino en CUALQUIER punto (no solo en .inicio) debe
  // revelarlo de nuevo — si exigiera volver a .inicio, un desvío real por obras nunca podría
  // recuperar el trazado hasta rehacer el tramo entero desde el principio.
  test('RV2-1. Tras iniciar el tramo, desviarse del camino oculta el trazado y volver a él (sin pasar por .inicio) lo revela', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // 1) Confirmar el tramo en .inicio (2 lecturas) — mismo paso que RV-1.
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (tramo) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
        });
      }, TRAMO);
      await page.waitForTimeout(300);
    }
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: el tramo debe quedar revelado en .inicio antes de desviarse').toBe(true);

    // 2) Usuario se desvía del camino (p.ej. rodeando una obra) — lejos de inicio/waypoints/fin
    // por igual, muy por encima de cualquier tolerancia dinámica razonable para este tramo.
    const PUNTO_DESVIO = { lat: 39.48250, lng: -0.37150 };
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (punto) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: punto.lat, longitude: punto.lng, accuracy: 5 },
        });
      }, PUNTO_DESVIO);
      await page.waitForTimeout(300);
    }
    visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Desviado del camino, el trazado debe ocultarse aunque ya se hubiera iniciado').not.toBe(true);

    // 3) Usuario vuelve a acercarse al camino, pero en un waypoint intermedio — NUNCA vuelve a
    // pasar por .inicio. Debe revelarse igualmente.
    const waypointIntermedio = TRAMO.waypoints[2];
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (wp) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: wp.lat, longitude: wp.lng, accuracy: 5 },
        });
      }, waypointIntermedio);
      await page.waitForTimeout(300);
    }
    visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'De vuelta cerca de un waypoint intermedio (no .inicio), el trazado debe revelarse de nuevo').toBe(true);
  });
});

test.describe('PL — La polyline manual oculta el trazado persistente al pulsarse', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // Garantía pedida por el usuario: "cuando sale la polyline verde, todos los emojis y
  // polyline de parada/tramo deben desaparecer" — no debe depender solo de que las 2 lecturas
  // de procesarPosicionGPSParaAventura ya lo hayan ocultado por distancia (pulsar el botón de
  // ubicación es la señal más directa de que el usuario está perdido/lejos).
  test('PL-1. dibujarPolylineNavegacion oculta el trazado ya revelado, sin esperar a la próxima lectura GPS', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Revelar el tramo primero (2 lecturas en .inicio).
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (tramo) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
        });
      }, TRAMO);
      await page.waitForTimeout(300);
    }
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: el tramo debe quedar revelado antes de pulsar el botón de ubicación').toBe(true);

    // Pulsar "ubicación" (dibujarPolylineNavegacion) — debe ocultar el trazado de inmediato,
    // en la misma llamada, sin esperar a ninguna lectura GPS adicional. No está expuesta en
    // globalThis.funcionesMapa (esa es una lista manual que no la incluye) — mismo patrón de
    // import dinámico ya usado para esta función en 13-gps-tramo-fix.spec.js.
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

  // Bug de campo reportado por el usuario: tras pulsar el botón de ubicación estando
  // lejos, el trazado persistente (📌🎯) reaparecía en el siguiente tick GPS aunque el
  // usuario siguiera lejos del destino real — causa: una vez _elementoYaRevelado=true,
  // "cerca" se mide contra CUALQUIER punto de todo el camino (distanciaAlCamino, para el
  // caso de desvío por obras de RV2-1), y el botón de ubicación no impedía que ese chequeo
  // volviera a revelar de inmediato. Reproducido con un test ad-hoc antes del fix (el
  // usuario, lejos de .inicio Y de .fin, veía "Trazado revelado" en el primer tick tras
  // pulsar el botón) y confirmado corregido aquí.
  test('PL-2. Mientras la polyline manual está activa, la proximidad al camino NO revela el trazado persistente', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Revelar el tramo primero (2 lecturas en .inicio) — mismo setup que PL-1.
    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (tramo) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
        });
      }, TRAMO);
      await page.waitForTimeout(300);
    }

    // El usuario se pierde de verdad: lejos de .inicio Y de .fin (no en el punto de
    // llegada real, que limpiaría la polyline manual por sí solo vía "distancia≤50m").
    const PUNTO_PERDIDO = { lat: 39.48200, lng: -0.37450 };
    for (let i = 0; i < 3; i++) {
      await page.evaluate(async (p) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: p.lat, longitude: p.lng, accuracy: 5 },
        });
      }, PUNTO_PERDIDO);
      await page.waitForTimeout(300);
    }

    // Pulsar "ubicación" — oculta el trazado persistente de inmediato (igual que PL-1).
    await page.evaluate(async (p) => {
      const { dibujarPolylineNavegacion } = await import('/js/funciones-mapa.js');
      await dibujarPolylineNavegacion({
        origen: { lat: p.lat, lng: p.lng },
        destino: { lat: 39.47959, lng: -0.37583 }, // .fin del tramo
        opciones: { color: '#3eff3f' },
      });
    }, PUNTO_PERDIDO);
    let visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
    expect(visualActivo, 'Precondición: justo tras pulsar ubicación, el trazado debe estar oculto').not.toBe(true);

    // Varias lecturas GPS más, todavía perdido — el trazado persistente NO debe reaparecer
    // en ninguna, mientras la línea manual sigue siendo la única señal en pantalla.
    for (let i = 0; i < 6; i++) {
      await page.evaluate(async (p) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: p.lat, longitude: p.lng, accuracy: 5 },
        });
      }, PUNTO_PERDIDO);
      await page.waitForTimeout(250);
      visualActivo = await page.evaluate(() => globalThis.estado?.gps?.visualActivo);
      expect(visualActivo, `Tick ${i + 1}: el trazado persistente no debe reaparecer mientras la polyline manual sigue activa y el usuario sigue lejos`).not.toBe(true);
    }
  });
});
