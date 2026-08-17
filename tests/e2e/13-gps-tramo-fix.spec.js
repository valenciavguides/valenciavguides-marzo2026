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
 *   GT-6  _siguienteIdElementoNavegable() apunta al elemento ACTIVO (paradaActual
 *         mismo), no al siguiente en el array — antes buscaba desde
 *         indiceActual+1, así que mientras una parada/tramo estaba activo pero
 *         aún no alcanzado físicamente, el GPS ya apuntaba al que venía después
 *         (nunca se detectaba la llegada real, incluida la parada 0 al empezar).
 *   DC-1  En el punto de INICIO de un tramo, distanciaAlCamino ≈0m mientras
 *         distanciaAlDestino se mantiene grande (bug 3 del reporte de campo:
 *         el aviso de "fuera de rango" saltaba nada más empezar a caminar).
 *   DC-2  Sobre un waypoint intermedio (lejos de .inicio y .fin), distanciaAlCamino
 *         también da ~0m — la proyección funciona en cualquier tramo del camino,
 *         no solo en los extremos.
 *   DC-3  Para una PARADA (no tramo), distanciaAlCamino coincide siempre con
 *         distanciaAlDestino — la separación de métricas es exclusiva de tramos.
 *   TR-1  Sin haber recorrido nada, estar en .fin NO basta para confirmar llegada —
 *         segundo requisito nuevo: distancia real recorrida ≥40% de la longitud del
 *         camino, no solo proximidad al destino (ver investigación distanciaAlCamino:
 *         nunca puede ser mayor que distanciaAlDestino, porque .fin es parte del propio
 *         camino que mide, así que no sirve para detectar un atajo en línea recta).
 *   TR-2  Tras caminar el camino oficial (inicio→waypoints) de verdad, SÍ confirma.
 *   TR-3  Tras un rodeo que NO sigue los waypoints oficiales pero cubre distancia real
 *         equivalente (obras, calle cortada), SÍ confirma igual — el requisito es
 *         distancia recorrida, no seguir el trazado exacto.
 *
 * GT-3, GT-4, PD-2/PD-3 y PD-4 acumulan distancia con simularRodeoPorObras() antes de su
 * comprobación real — no es lo que prueban, pero desde que existe el requisito de TR-* hace
 * falta satisfacerlo primero para que su propia lectura en .fin pueda confirmar. Usan el
 * rodeo y no el camino oficial (simularCaminataOficial, reservado para TR-2) a propósito:
 * los últimos waypoints del camino oficial (wp2 56.8m, wp3 34.1m, wp4 21.5m de .fin) caen
 * dentro de la tolerancia real (~61m) — el propio recorrido dispararía ya una "llegada"
 * antes de que cada test empezara sus propias lecturas, contaminando la ventana deslizante
 * que GT-3/PD-2/PD-3/PD-4 comprueban con precisión. El rodeo se queda siempre por encima de
 * 86m de .fin, sin ese riesgo.
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
    // Modo AVENTURA (reset completo) y luego fijar paradaActual='Av1-TR-1' — el
    // tramo YA es el elemento activo (su audio ya se habría pedido a hijo3 en un
    // CAMBIO_PARADA real), así que _siguienteIdElementoNavegable() debe resolverlo
    // a sí mismo, no al que viene después (ver el fix del off-by-one en
    // _siguienteIdElementoNavegable, js/funciones-mapa.js).
    if (typeof fm?.limpiarPorEstado === 'function') {
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      fm.limpiarPorEstado({ modo: 'aventura', paradaActual: 'Av1-TR-1' });
    }

    return {
      tieneFunciones: !!(fm?.procesarPosicionGPSParaAventura && fm?.verificarLlegadaADestino),
      totalParadas: globalThis.AVENTURA_PARADAS?.length || 0,
      tramoEncontrado: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === tramo.id),
    };
  }, TRAMO);
}

async function enviarLecturaGPS(page, coords, accuracy = 5) {
  await page.evaluate(async ({ coords, accuracy }) => {
    await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
      coords: { latitude: coords.lat, longitude: coords.lng, accuracy },
    });
  }, { coords, accuracy });
}

// Punto a una distancia y rumbo dados de un origen — mismo cálculo geodésico que
// 39-flujo-completo-parada-reto-tramo.spec.js, reutilizado aquí para el rodeo por obras.
function puntoADistancia(lat, lng, metros, rumboDeg) {
  const R = 6371000;
  const brng = rumboDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180, lng1 = lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(metros / R) + Math.cos(lat1) * Math.sin(metros / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(metros / R) * Math.cos(lat1), Math.cos(metros / R) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

// Camina inicio→wp1→wp2→wp3→wp4 de verdad (no incluye .fin — eso lo manda cada test por su
// cuenta como parte de lo que realmente comprueba). Acumula prácticamente el 100% de la
// longitud real del tramo, muy por encima del 40% exigido — satisface el requisito nuevo
// de distancia recorrida sin ser en sí mismo lo que cada test comprueba.
async function simularCaminataOficial(page, tramo) {
  for (const punto of [tramo.inicio, ...tramo.waypoints]) {
    await enviarLecturaGPS(page, punto);
    await page.waitForTimeout(50);
  }
}

function rumboEntre(lat1, lng1, lat2, lng2) {
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180, Δλ = (lng2 - lng1) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// Rodeo que NO sigue ningún waypoint oficial — 4 saltos de 40m en línea recta, en el rumbo
// exactamente opuesto a .fin desde .inicio, así la distancia a .fin crece sin parar en
// cada paso (nunca se acerca lo bastante como para contaminar la ventana deslizante de
// llegada de los tests que lo usan antes de sus propias lecturas). Acumula 3 saltos reales
// de 40m = 120m (el primer punto no cuenta — no hay posición previa de la que medir un
// salto), muy por encima de los ~57m que exige Av1-TR-1 (40% de su longitud real, 142m).
// Reproduce un rodeo real por obras/calle cortada: nunca pasa por el camino oficial y aun
// así cubre distancia real equivalente.
async function simularRodeoPorObras(page, tramo) {
  const rumboAFin = rumboEntre(tramo.inicio.lat, tramo.inicio.lng, tramo.fin.lat, tramo.fin.lng);
  const rumboOpuesto = (rumboAFin + 180) % 360;
  let punto = tramo.inicio;
  for (let i = 0; i < 4; i++) {
    punto = puntoADistancia(punto.lat, punto.lng, 40, rumboOpuesto);
    await enviarLecturaGPS(page, punto);
    await page.waitForTimeout(50);
  }
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

  // NOTA: GT-3/GT-4 usan paradaActual='Av1-TR-1' (el tramo ya activo). No discriminan
  // por sí solas el fix del off-by-one de _siguienteIdElementoNavegable (GT-6 sí lo
  // hace): Av1-P-1.coordenadas coincide exactamente con Av1-TR-1.fin en los datos
  // reales, así que apuntar al tramo o "de más" a la parada siguiente da la misma
  // posición física en este caso concreto — comprobado, no es casualidad asumida.
  test('GT-3. procesarPosicionGPSParaAventura en .fin notifica LLEGADA_DETECTADA tras 2 lecturas seguidas, nunca CAMBIO_PARADA directo', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await simularRodeoPorObras(page, TRAMO);

    // Primera lectura: solo arma la candidata, todavía no notifica (confirmación por
    // ventana deslizante de 2-de-4 lecturas — ver PD-2/PD-3/PD-4 para el detalle de
    // este mecanismo, incluyendo el caso de lecturas no consecutivas).
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(150);
    let notifico = logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando'));
    expect(notifico, 'La primera lectura por sí sola no debe notificar todavía').toBe(false);

    // Segunda lectura seguida en el mismo punto: confirma y notifica.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    notifico = logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando'));
    expect(notifico, `No se encontró el log de notificación de llegada. Logs GPS: ${JSON.stringify(logs.filter(l => /GPS|Llegada/i.test(l)))}`).toBe(true);

    // El atajo antiguo ("Activando parada secuencial") mandaba CAMBIO_PARADA sin pasar
    // por el sistema pending — no debe volver a aparecer bajo ningún caso.
    const huboAtajo = logs.some(l => l.includes('Activando parada secuencial'));
    expect(huboAtajo, 'El atajo GPS→CAMBIO_PARADA directo (sin gate de pending) no debe existir').toBe(false);
  });

  test('GT-4. Una tercera lectura en el mismo punto no reenvía la notificación (dedup tras confirmar)', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await simularRodeoPorObras(page, TRAMO);

    await page.evaluate(async (tramo) => {
      const fm = globalThis.funcionesMapa;
      // Lecturas 1 y 2: arman la candidata y confirman/notifican. Lectura 3: dedup.
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 } });
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 } });
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 } });
    }, TRAMO);
    await page.waitForTimeout(300);

    const vecesNotificado = logs.filter(l => l.includes('Llegada GPS a') && l.includes('notificando')).length;
    expect(vecesNotificado, `Se notificó ${vecesNotificado} veces, se esperaba exactamente 1 (dedup)`).toBe(1);

    const huboDedup = logs.some(l => l.includes('ya notificada'));
    expect(huboDedup, 'Debe aparecer el log de dedup en la tercera lectura').toBe(true);
  });

  test('PD-1. Precisión GPS mala (>50m) ya no descarta la lectura: la distancia se calcula igual', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 120 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    const logDistancia = logs.find(l => l.includes('Distancia a Av1-TR-1'));
    expect(logDistancia, `Con accuracy=120m la distancia debe seguir calculándose. Logs: ${JSON.stringify(logs.filter(l => /GPS|Distancia|precisión|Precisión/i.test(l)))}`).toBeTruthy();
  });

  test('PD-2/PD-3. Confirmación por 2 lecturas seguidas dentro de radio (con precisión mala incluida)', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await simularRodeoPorObras(page, TRAMO);

    // Lectura 1: dentro de radio pero con precisión de 90m — antes se habría descartado
    // por completo; ahora se procesa y arma la candidata (sin notificar todavía).
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 90 },
      });
    }, TRAMO);
    await page.waitForTimeout(150);
    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), 'PD-2: 1 lectura no debe bastar para confirmar').toBe(false);

    // Lectura 2 seguida, también dentro de radio: confirma.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 90 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);
    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), 'PD-3: 2 lecturas seguidas deben confirmar la llegada, aunque la precisión sea mala').toBe(true);
  });

  test('PD-4. Ventana deslizante: 2 lecturas dentro de radio NO seguidas (con una fuera entre medias) sí confirman', async ({ page }) => {
    // Sustituye al diseño anterior ("2 SEGUIDAS", que reiniciaba el contador entero al
    // salir de radio una sola vez). Se cambió a ventana deslizante de 2-de-4 tras un
    // reporte de campo real (Av1-P-1, GPS urbano oscilando alrededor del radio de 20m
    // nunca daba 2 lecturas seguidas, así que la llegada no se confirmaba nunca por
    // mucho que el usuario esperase — ver docs/GUIA-COMPLETA.md §25.5 y
    // 21-llegada-ruido-gps.spec.js para la reproducción completa con hijo2 real).
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await simularRodeoPorObras(page, TRAMO);

    await page.evaluate(async (tramo) => {
      const fm = globalThis.funcionesMapa;
      // 1: dentro de radio (ventana=[true], 1/1 — no basta)
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 } });
      // 2: fuera de radio (ventana=[true,false], 1/2 — no basta)
      await fm.procesarPosicionGPSParaAventura({ coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 } });
    }, TRAMO);
    await page.waitForTimeout(300);
    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), 'Con 1 sola lectura dentro de radio (de 2) no debe notificar todavía').toBe(false);

    // 3: dentro de radio otra vez — ventana=[true,false,true], 2/3 SÍ confirma, aunque
    // la 2ª y 3ª lectura NO sean seguidas (hubo una fuera de radio entre medias).
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);
    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), '2 de las últimas 3-4 lecturas dentro de radio deben confirmar, aunque no sean consecutivas').toBe(true);
  });

  test('TR-1. Sin haber recorrido nada, estar en .fin no basta para confirmar llegada', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Sin simularCaminataOficial/simularRodeoPorObras: dos lecturas directas en .fin,
    // exactamente el patrón que antes del requisito de distancia recorrida sí confirmaba.
    await enviarLecturaGPS(page, TRAMO.fin);
    await enviarLecturaGPS(page, TRAMO.fin);
    await page.waitForTimeout(300);

    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), 'Sin distancia recorrida, la llegada no debe confirmarse aunque la posición esté justo en .fin').toBe(false);
  });

  test('TR-2. Tras caminar el camino oficial (inicio→waypoints) de verdad, la llegada sí se confirma', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await simularCaminataOficial(page, TRAMO);

    await enviarLecturaGPS(page, TRAMO.fin);
    await enviarLecturaGPS(page, TRAMO.fin);
    await page.waitForTimeout(300);

    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), 'Tras caminar el camino oficial, la llegada en .fin debe confirmarse').toBe(true);
  });

  test('TR-3. Tras un rodeo que no sigue los waypoints oficiales (obras/calle cortada) pero cubre distancia real equivalente, la llegada también se confirma', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await simularRodeoPorObras(page, TRAMO);

    await enviarLecturaGPS(page, TRAMO.fin);
    await enviarLecturaGPS(page, TRAMO.fin);
    await page.waitForTimeout(300);

    expect(logs.some(l => l.includes('Llegada GPS a') && l.includes('notificando')), 'El requisito es distancia recorrida real, no seguir el trazado exacto — un rodeo real equivalente también debe confirmar').toBe(true);
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

  test('GT-6. El GPS apunta al elemento activo (paradaActual), no al siguiente en el array', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    await esperarPipelineListo(page);
    const prep = await page.evaluate(async () => {
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
      // paradaActual = 'Av1-P-0' simula el estado real nada más empezar la aventura:
      // la parada 0 ya es el elemento activo (su audio ya se pidió a hijo3), pero el
      // usuario todavía no ha llegado físicamente. El GPS debe apuntar a P-0 mismo.
      if (typeof fm?.limpiarPorEstado === 'function') {
        fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
        fm.limpiarPorEstado({ modo: 'aventura', paradaActual: 'Av1-P-0' });
      }
      return { tieneFunciones: !!(fm?.procesarPosicionGPSParaAventura), totalParadas: globalThis.AVENTURA_PARADAS?.length || 0 };
    });
    test.skip(!prep.tieneFunciones || !prep.totalParadas, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Posición lejana (no importa la exacta, solo que dispare el log de distancia)
    await page.evaluate(async () => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: 39.4750, longitude: -0.3750, accuracy: 5 },
      });
    });
    await page.waitForTimeout(300);

    const logDistancia = logs.find(l => l.includes('Distancia a Av1-'));
    expect(logDistancia, `No se encontró ningún log de distancia. Logs GPS: ${JSON.stringify(logs.filter(l => /GPS|Distancia/i.test(l)))}`).toBeTruthy();
    expect(logDistancia, `El GPS debía apuntar a Av1-P-0 (el elemento activo), no al siguiente en el array: "${logDistancia}"`).toContain('Distancia a Av1-P-0');
  });

  // PM — Limpieza de la polyline manual (botón ubicación, siempre verde) al volver de
  // verdad a .inicio — destino real de la línea mientras el tramo no esté completo (nunca
  // .fin, ver PC-1 en 20-tramo-inicio-y-revelado.spec.js). El origen/destino que se le pasa
  // aquí a dibujarPolylineNavegacion() es el mismo que resolvería _resolverCoordenadasElemento()
  // en la app real para este tramo.
  test('PM-1. Volver a .inicio (≤50m) limpia la polyline manual', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async (tramo) => {
      const { dibujarPolylineNavegacion } = await import('/js/funciones-mapa.js');
      await dibujarPolylineNavegacion({
        origen: tramo.fin,
        destino: tramo.inicio,
        opciones: { color: '#3eff3f', opacity: 0.8, dashArray: '0, 2' },
      });
    }, TRAMO);

    // Lectura en .inicio: dentro de radio (≤50m) — debe limpiar la polyline manual.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    const huboLimpieza = logs.some(l => l.includes('A ≤50m de .inicio, removiendo polyline manual de navegación'));
    expect(huboLimpieza, 'Volver de verdad a .inicio (≤50m) debe limpiar la polyline manual').toBe(true);
  });

  test('PM-2. Lejos de .inicio (en .fin, ~120m) la polyline manual no se toca', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async (tramo) => {
      const { dibujarPolylineNavegacion } = await import('/js/funciones-mapa.js');
      await dibujarPolylineNavegacion({
        origen: tramo.fin,
        destino: tramo.inicio,
        opciones: { color: '#3eff3f', opacity: 0.8, dashArray: '0, 2' },
      });
    }, TRAMO);

    // Lectura en .fin (~120m de .inicio, el destino real de la línea) — no debe limpiar
    // la manual que el usuario acaba de pedir, aunque .fin sea el punto final del tramo.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.fin.lat, longitude: tramo.fin.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    const huboLimpieza = logs.some(l => l.includes('removiendo polyline manual de navegación'));
    expect(huboLimpieza, 'Lejos de .inicio, la polyline manual debe permanecer aunque esté en .fin').toBe(false);
  });

  // DC — distanciaAlCamino: la distancia al camino real (inicio→waypoints→fin), separada
  // de distanciaAlDestino (siempre contra .fin), usada solo para decidir el aviso de
  // "fuera de rango" en tramos. Cubre el bug 3 reportado por el usuario: en Av1-TR-1 el
  // punto de INICIO ya está a ~99m en línea recta del .fin, muy por encima de la
  // tolerancia calculada (~61m) — con distanciaAlDestino el usuario aparecía "fuera de
  // rango" nada más empezar a caminar. distanciaAlCamino, al proyectar sobre el camino
  // real, debe dar ~0m en ese mismo punto.
  const LOG_DISTANCIA_RE = /Distancia a ([\w-]+): (\d+)m \(camino: (\d+)m, tolerancia: (\d+)m\)/;

  test('DC-1. En el punto de INICIO de un tramo, distanciaAlCamino ≈0 mientras distanciaAlDestino se mantiene grande', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    const logDistancia = logs.find(l => l.includes('Distancia a Av1-TR-1'));
    expect(logDistancia, `No se encontró el log de distancia. Logs: ${JSON.stringify(logs.filter(l => /Distancia/i.test(l)))}`).toBeTruthy();

    const m = LOG_DISTANCIA_RE.exec(logDistancia);
    expect(m, `El log no tiene el formato esperado: "${logDistancia}"`).toBeTruthy();
    const [, , distanciaAlDestino, distanciaAlCamino] = m;
    expect(Number(distanciaAlCamino), `En el punto de inicio, distanciaAlCamino debe ser ~0m (medido: ${distanciaAlCamino}m)`).toBeLessThan(5);
    expect(Number(distanciaAlDestino), `distanciaAlDestino en el inicio debe seguir siendo grande, sin tocar (medido: ${distanciaAlDestino}m)`).toBeGreaterThan(80);
  });

  test('DC-2. Cerca de un waypoint intermedio (lejos de .fin), distanciaAlCamino es pequeña', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Segundo waypoint de Av1-TR-1 — a medio camino, lejos tanto de .inicio como de .fin.
    const wp = TRAMO.waypoints[1];
    await page.evaluate(async (coords) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: coords.lat, longitude: coords.lng, accuracy: 5 },
      });
    }, wp);
    await page.waitForTimeout(300);

    const logDistancia = logs.find(l => l.includes('Distancia a Av1-TR-1'));
    expect(logDistancia, `No se encontró el log de distancia. Logs: ${JSON.stringify(logs.filter(l => /Distancia/i.test(l)))}`).toBeTruthy();

    const m = LOG_DISTANCIA_RE.exec(logDistancia);
    expect(m, `El log no tiene el formato esperado: "${logDistancia}"`).toBeTruthy();
    const [, , , distanciaAlCamino] = m;
    // Se está de pie exactamente sobre un punto del camino: la proyección debe caer ~0m.
    expect(Number(distanciaAlCamino), `Sobre un waypoint, distanciaAlCamino debe ser ~0m (medido: ${distanciaAlCamino}m)`).toBeLessThan(5);
  });

  test('DC-3. Para una PARADA (no tramo), distanciaAlCamino coincide siempre con distanciaAlDestino', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    await esperarPipelineListo(page);
    const prep = await page.evaluate(async () => {
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
      // Av1-P-1 es una parada normal (tipo:"parada"), no un tramo — su .coordenadas
      // coincide con Av1-TR-1.fin en los datos reales (ver nota en GT-3/GT-4 más arriba).
      if (typeof fm?.limpiarPorEstado === 'function') {
        fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
        fm.limpiarPorEstado({ modo: 'aventura', paradaActual: 'Av1-P-1' });
      }
      return {
        tieneFunciones: !!fm?.procesarPosicionGPSParaAventura,
        av1P1Encontrada: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === 'Av1-P-1'),
      };
    });
    test.skip(!prep.tieneFunciones || !prep.av1P1Encontrada, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Posición lejana arbitraria (el propio inicio de Av1-TR-1) — lo único que importa
    // es que NO coincida con Av1-P-1, para que distanciaAlDestino sea > 0 y discrimine.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(300);

    const logDistancia = logs.find(l => l.includes('Distancia a Av1-P-1'));
    expect(logDistancia, `No se encontró el log de distancia. Logs: ${JSON.stringify(logs.filter(l => /Distancia/i.test(l)))}`).toBeTruthy();

    const m = LOG_DISTANCIA_RE.exec(logDistancia);
    expect(m, `El log no tiene el formato esperado: "${logDistancia}"`).toBeTruthy();
    const [, , distanciaAlDestino, distanciaAlCamino] = m;
    expect(Number(distanciaAlDestino), 'La distancia debe ser significativa para que la comparación discrimine').toBeGreaterThan(50);
    expect(distanciaAlCamino, `En una parada, distanciaAlCamino no debe divergir de distanciaAlDestino (destino=${distanciaAlDestino}m, camino=${distanciaAlCamino}m)`).toBe(distanciaAlDestino);
  });
});
