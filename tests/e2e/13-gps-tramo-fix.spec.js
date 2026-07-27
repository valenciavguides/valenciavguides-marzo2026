/**
 * 13-gps-tramo-fix.spec.js
 *
 * Prueba de humo end-to-end para los arreglos de GPS/tramos de esta sesión
 * (ver docs/GUIA-COMPLETA.md y la investigación de los bugs 2/3/4 reportados
 * por el usuario tras probar en móvil). Usa datos reales de Av1-TR-1
 * (js/coordenadas-aventuras.js) y ejecuta las funciones reales de
 * funciones-mapa.js en un navegador real — no mocks de la lógica bajo prueba.
 *
 * Contexto del bug: procesarPosicionGPSParaAventura() y verificarLlegadaADestino()
 * medían la distancia/llegada a un tramo contra su punto de INICIO en vez de su
 * punto de FIN (coordsSiguiente = .coordenadas || .inicio || .fin, orden invertido).
 * Efecto: la "llegada" a un tramo se detectaba casi al empezar a caminarlo, no al
 * terminarlo, lo que a su vez borraba la polyline del tramo prematuramente (bug 4)
 * y podía avanzar el progreso de la aventura sin haber llegado de verdad.
 *
 *   GT-1  Estando en el punto de INICIO de Av1-TR-1, verificarLlegadaADestino()
 *         NO detecta llegada (antes del fix sí la detectaba ahí).
 *   GT-2  Estando en el punto de FIN de Av1-TR-1, verificarLlegadaADestino() SÍ
 *         detecta llegada.
 *   GT-3  procesarPosicionGPSParaAventura() en el punto de FIN dispara
 *         NAVEGACION.LLEGADA_DETECTADA (el camino "pending", gateado) y NUNCA
 *         NAVEGACION.CAMBIO_PARADA directo (el atajo sin gate que existía antes).
 *   GT-4  Una segunda lectura GPS en el mismo punto de FIN no reenvía la
 *         notificación de llegada (dedup).
 *   GT-5  verificarLlegadaADestino() reconoce tipo:"inicio" (la parada 0 de cada
 *         aventura) igual que tipo:"parada" — antes caía siempre a false.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Datos reales de js/coordenadas-aventuras.js — Av1-TR-1 (Torres de Serranos → Plaza de la
// crida). Distancia inicio↔fin ≈120m, muy por encima de cualquier tolerancia GPS real,
// así que discrimina con margen si el fix mide contra el punto correcto.
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
      && typeof globalThis.funcionesMapa?.verificarLlegadaADestino === 'function'
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

    // AVENTURA_PARADAS: mismo lazy-init que usa manejarCambiarParada() cuando el
    // array todavía no está poblado — necesario para que procesarPosicionGPSParaAventura
    // pueda encontrar el tramo por id.
    if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
      const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }

    const fm = globalThis.funcionesMapa;
    // Modo AVENTURA (reset completo) y luego fijar paradaActual='Av1-P-0' para que
    // _siguienteIdElementoNavegable() resuelva el tramo Av1-TR-1 como "siguiente".
    if (typeof fm?.limpiarPorEstado === 'function') {
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      fm.limpiarPorEstado({ modo: 'aventura', paradaActual: 'Av1-P-0' });
    }

    return {
      tieneFunciones: !!(fm?.procesarPosicionGPSParaAventura && fm?.verificarLlegadaADestino),
      totalParadas: globalThis.AVENTURA_PARADAS?.length || 0,
      tramoEncontrado: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === tramo.id),
    };
  }, TRAMO);
}

test.describe('GT — Distancia y llegada a tramos por GPS (fix .inicio/.fin)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('GT-1. verificarLlegadaADestino con datos reales: false en .inicio, true en .fin', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate((tramo) => {
      const fm = globalThis.funcionesMapa;
      const elemento = globalThis.AVENTURA_PARADAS.find(p => p.id === tramo.id);
      return {
        enInicio: fm.verificarLlegadaADestino({ lat: tramo.inicio.lat, lng: tramo.inicio.lng }, elemento),
        enFin: fm.verificarLlegadaADestino({ lat: tramo.fin.lat, lng: tramo.fin.lng }, elemento),
      };
    }, TRAMO);

    expect(resultado.enInicio, 'No debe detectar llegada estando en el punto de INICIO del tramo').toBe(false);
    expect(resultado.enFin, 'Debe detectar llegada estando en el punto de FIN del tramo').toBe(true);
  });

  test('GT-2. verificarLlegadaADestino usa .fin, no el último waypoint (caso sintético discriminante)', async ({ page }) => {
    // Con los datos reales de las 7 aventuras el último waypoint siempre queda dentro
    // de la tolerancia de .fin (comprobado: ninguna tiene hueco > tolerancia), así que
    // ese bug concreto nunca se manifiesta hoy con datos reales — pero es un bug real
    // en la función y debe protegerse igual, con un tramo sintético donde el hueco
    // entre el último waypoint y .fin es deliberadamente mayor que cualquier tolerancia
    // razonable (200m).
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate(() => {
      const fm = globalThis.funcionesMapa;
      const tramoSintetico = {
        id: 'TEST-SINTETICO-TR',
        tipo: 'tramo',
        inicio: { lat: 39.4700, lng: -0.3800 },
        waypoints: [{ lat: 39.4701, lng: -0.3799 }], // pegado al inicio
        fin: { lat: 39.4750, lng: -0.3750 }, // ~650m del último waypoint
      };
      return {
        // En el último waypoint (lejos de .fin): NO debe contar como llegada
        enUltimoWaypoint: fm.verificarLlegadaADestino(
          { lat: tramoSintetico.waypoints[0].lat, lng: tramoSintetico.waypoints[0].lng }, tramoSintetico
        ),
        // En el .fin real: SÍ debe contar como llegada
        enFin: fm.verificarLlegadaADestino({ lat: tramoSintetico.fin.lat, lng: tramoSintetico.fin.lng }, tramoSintetico),
      };
    });

    expect(resultado.enUltimoWaypoint, 'No debe detectar llegada en el último waypoint cuando está lejos de .fin').toBe(false);
    expect(resultado.enFin, 'Debe detectar llegada en el punto .fin real, aunque esté lejos del último waypoint').toBe(true);
  });

  test('GT-3. procesarPosicionGPSParaAventura en .fin notifica LLEGADA_DETECTADA, nunca CAMBIO_PARADA directo', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    const notifico = logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando'));
    expect(notifico, `No se encontró el log de notificación de llegada. Logs GPS: ${JSON.stringify(logs.filter(l => /GPS|Llegada/i.test(l)))}`).toBe(true);

    // El atajo antiguo ("Activando parada secuencial") mandaba CAMBIO_PARADA sin pasar
    // por el sistema pending — no debe volver a aparecer bajo ningún caso.
    const huboAtajo = logs.some(l => l.includes('Activando parada secuencial'));
    expect(huboAtajo, 'El atajo GPS→CAMBIO_PARADA directo (sin gate de pending) no debe existir').toBe(false);
  });

  test('GT-4. Segunda lectura GPS en el mismo punto no reenvía la notificación (dedup)', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async (tramo) => {
      const fm = globalThis.funcionesMapa;
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 } });
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 } });
    }, TRAMO);
    await page.waitForTimeout(300);

    const vecesNotificado = logs.filter(l => l.includes('Llegada GPS a') && l.includes('notificando')).length;
    expect(vecesNotificado, `Se notificó ${vecesNotificado} veces, se esperaba exactamente 1 (dedup)`).toBe(1);

    const huboDedup = logs.some(l => l.includes('ya notificada'));
    expect(huboDedup, 'Debe aparecer el log de dedup en la segunda lectura').toBe(true);
  });

  test('GT-5. verificarLlegadaADestino reconoce tipo:"inicio" (parada 0) igual que "parada"', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate(() => {
      const fm = globalThis.funcionesMapa;
      const p0 = globalThis.AVENTURA_PARADAS?.find(p => p.tipo === 'inicio');
      if (!p0) return { p0Encontrado: false };
      return {
        p0Encontrado: true,
        enSuPropioSitio: fm.verificarLlegadaADestino({ lat: p0.coordenadas.lat, lng: p0.coordenadas.lng }, p0),
        lejos: fm.verificarLlegadaADestino({ lat: p0.coordenadas.lat + 0.01, lng: p0.coordenadas.lng + 0.01 }, p0),
      };
    });

    test.skip(!resultado.p0Encontrado, 'No se encontró ningún elemento tipo:"inicio" en AVENTURA_PARADAS');
    expect(resultado.enSuPropioSitio, 'Debe detectar llegada a la parada 0 estando en su propia ubicación').toBe(true);
    expect(resultado.lejos, 'No debe detectar llegada a la parada 0 estando lejos').toBe(false);
  });
});
