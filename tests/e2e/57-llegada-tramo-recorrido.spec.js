/**
 * 57-llegada-tramo-recorrido.spec.js
 *
 * Un TRAMO solo confirma su llegada si además de estar en el destino se ha recorrido el
 * 40% de su camino real (`recorridoSuficiente`, js/funciones-mapa.js). Es lo que impide
 * completar un tramo atravesando un obstáculo, o quedándose quieto en el punto final.
 *
 * EL FALLO QUE ESTOS TESTS FIJAN
 *
 * `_acumularDistanciaRecorrida()` movía su punto de referencia en CADA lectura GPS y
 * exigía que el salto respecto a él superase el ruido esperado (10 m, o 1,5× la precisión).
 * Andando, dos lecturas consecutivas distan 1-2 m: no sumaba nunca. Ningún tramo llegaba a
 * completarse por GPS — reportado en uso real ("nunca he acabado un tramo").
 *
 * Los dos sensores quedaban bloqueados a la vez porque comparten el cálculo: el padre lo
 * aplica con `&& recorridoSuficiente` y hijo2 recibe ese mismo valor en el mensaje.
 *
 * POR QUÉ NO BASTABA CON LOS TESTS QUE YA HABÍA
 *
 * TR-1/TR-2/TR-3 de `13-gps-tramo-fix.spec.js` cubren el requisito, en verde, con el camino
 * real — pero avanzan a saltos de 35-40 m entre lecturas, que superan el umbral de ruido por
 * sí solos. Andar de verdad es otro régimen: pasos de 1-2 m con ruido gaussiano encima.
 * Ver GUIA-COMPLETA §36.27.6.
 *
 *   TA-1  Recorriendo el tramo entero a paso humano, la llegada se notifica.
 *   TA-2  Quieto en el destino sin haberlo recorrido, NO se notifica (±10/±20/±30 m).
 *   TA-3  Control: una parada sí se detecta al llegar — no exige recorrido.
 *   TA-4  Un corte de GPS mayor que el salto máximo plausible no deja el contador clavado.
 *   TA-5  Un tramo más corto que el umbral de ruido se puede completar andándolo.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * Deja la app en AVENTURA con `elementoId` como elemento activo y devuelve un array vivo
 * con los ids que `procesarPosicionGPSParaAventura()` va resolviendo lectura a lectura.
 *
 * Ese array es la precondición del test, no un adorno: `estadoMapa.paradaActual` no se puede
 * leer desde fuera (el módulo no lo exporta) y la vía de producción para fijarlo
 * —CAMBIO_PARADA → respuesta de coordenadas de hijo2 → `completarCambioParada()`— no se
 * completa en el arnés, donde hijo2 no está cargado. Si el elemento activo no se fija,
 * `_siguienteIdElementoNavegable()` devuelve el PRIMER elemento navegable de la aventura
 * (Av1-P-0) y el test mide una parada creyendo medir un tramo: las paradas no exigen
 * recorrido, así que pasaría con el bug delante. Es exactamente lo que hacía la primera
 * versión de este fichero.
 */
async function prepararAventura(page, elementoId, aventura = 'Aventura1') {
  const resueltos = [];
  page.on('console', (m) => {
    const g = m.text().match(/Distancia a ([^:]+):/);
    if (g && !resueltos.includes(g[1])) resueltos.push(g[1]);
  });

  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);

  await page.evaluate((av) => {
    globalThis.aventuraSeleccionada = av;
    globalThis.idiomaSeleccionado = 'es';
  }, aventura);
  await page.evaluate(async () => { await globalThis.__cargarDatosAventuraDiferidos(); });
  await page.waitForFunction(() => globalThis.__vv_DATOS_AVENTURAS != null, null, { timeout: 20000 });

  await page.evaluate(({ id, av }) => {
    const fm = globalThis.funcionesMapa;
    globalThis.AVENTURA_PARADAS = globalThis.__vv_DATOS_AVENTURAS[av]['coordenadas-hijo2.html'].coordenadas;
    // estadoMapa.modo es una variable PROPIA del módulo del mapa, distinta de
    // estadoPadre.modo.actual. La vigilancia de llegada por GPS exige que valga 'aventura';
    // sin esto el módulo se queda en su valor de arranque ('casa') y descarta la
    // notificación con "Llegada detectada en modo casa" — el test mediría siempre 0.
    fm.sincronizarModoMapa('aventura');
    fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
    fm.limpiarPorEstado({ modo: 'aventura', paradaActual: id });
  }, { id: elementoId, av: aventura });

  return resueltos;
}

/**
 * Le da lecturas GPS al elemento activo y devuelve las llegadas notificadas.
 * `modo` decide el recorrido: 'andando' recorre el camino real a 1,4 m/s con lecturas a
 * 1 Hz (pasos de 1-2 m); 'quieto' se planta en el destino sin haberlo recorrido.
 */
async function recorrer(page, { id, modo, precision, corteMetros = 0 }) {
  return page.evaluate(async ({ id: objetivo, modo: m, precision: prec, corteMetros: corte }) => {
    const fm = globalThis.funcionesMapa;
    const el = globalThis.AVENTURA_PARADAS.find((c) => c.id === objetivo);

    const D = (a, b) => {
      const R = 6371000, t = (x) => x * Math.PI / 180;
      const dLat = t(b.lat - a.lat), dLng = t(b.lng - a.lng);
      const s = Math.sin(dLat / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(s));
    };
    const M = 111320;
    const destino = el.coordenadas || el.fin;
    const posiciones = [];

    if (m === 'andando') {
      const pts = el.inicio ? [el.inicio, ...(el.waypoints || []), el.fin]
        : [{ lat: destino.lat - 0.0009, lng: destino.lng - 0.0009 }, destino];
      for (let i = 0; i < pts.length - 1; i++) {
        const n = Math.max(1, Math.round(D(pts[i], pts[i + 1]) / 1.4));   // 1,4 m/s a 1 Hz
        for (let k = 0; k < n; k++) {
          const f = k / n;
          posiciones.push({ lat: pts[i].lat + (pts[i + 1].lat - pts[i].lat) * f, lng: pts[i].lng + (pts[i + 1].lng - pts[i].lng) * f });
        }
      }
      for (let i = 0; i < 10; i++) posiciones.push(destino);   // parado al llegar
      if (corte > 0) {
        // Corte de GPS: se pierden las lecturas de un trecho contiguo de `corte` metros a
        // partir de los 100 m de camino. Al recuperar señal el usuario reaparece mucho más
        // allá, que es lo que un móvil en el bolsillo o un callejón sin cobertura producen.
        const desde = Math.round(100 / 1.4);
        posiciones.splice(desde, Math.round(corte / 1.4));
      }
    } else {
      for (let i = 0; i < 150; i++) posiciones.push(destino);  // aparece en el destino sin recorrer
    }

    // Ruido DETERMINISTA (mulberry32 sembrado con la precisión): un test de la suite no
    // puede depender de Math.random(), sería intermitente por construcción.
    let semilla = (0x9e3779b9 ^ (prec * 2654435761)) >>> 0;
    const aleatorio = () => {
      semilla = (semilla + 0x6d2b79f5) >>> 0;
      let t = semilla;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const notificadas = [];
    const orig = globalThis.__triggerLlegadaDetectadaInterno;
    globalThis.__triggerLlegadaDetectadaInterno = function (d) {
      notificadas.push(d?.paradaId ?? d?.parada_id ?? d?.id ?? '(sin id)');
      return orig?.(d);
    };
    for (const p0 of posiciones) {
      // Ruido gaussiano (suma de 3 uniformes) dentro del círculo de precisión, como en la calle.
      const rl = (aleatorio() + aleatorio() + aleatorio() - 1.5) * prec / 1.5;
      const rg = (aleatorio() + aleatorio() + aleatorio() - 1.5) * prec / 1.5;
      await fm.procesarPosicionGPSParaAventura({
        coords: { latitude: p0.lat + rl / M, longitude: p0.lng + rg / (M * Math.cos(p0.lat * Math.PI / 180)), accuracy: prec },
        timestamp: Date.now(),
      });
    }
    globalThis.__triggerLlegadaDetectadaInterno = orig;
    return { notificadas, lecturas: posiciones.length };
  }, { id, modo, precision, corteMetros });
}

test.describe('TA — llegada a un tramo: exige recorrido real, y el recorrido debe contarse', () => {

  test('TA-1. Recorriendo el tramo entero a paso humano, la llegada se notifica', async ({ page }) => {
    const resueltos = await prepararAventura(page, 'Av1-TR-1');
    const r = await recorrer(page, { id: 'Av1-TR-1', modo: 'andando', precision: 5 });
    expect(resueltos, 'precondición: el elemento medido debe ser el tramo, no otro').toEqual(['Av1-TR-1']);
    expect(
      r.notificadas.length,
      `tras recorrer los 142 m del tramo en ${r.lecturas} lecturas de 1-2 m, la llegada debe notificarse`
    ).toBeGreaterThan(0);
  });

  // Una prueba por precisión, cada una en su propia página: el contador solo se reinicia
  // cuando `procesarPosicionGPSParaAventura()` ve un tramo distinto del anotado, así que
  // repetir el mismo tramo en la misma página encadenaría las tres tandas de lecturas.
  for (const precision of [10, 20, 30]) {
    test(`TA-2.${precision}. Quieto en el destino con ±${precision} m, NO se notifica`, async ({ page }) => {
      const resueltos = await prepararAventura(page, 'Av1-TR-1');
      const r = await recorrer(page, { id: 'Av1-TR-1', modo: 'quieto', precision });
      expect(resueltos, 'precondición: el elemento medido debe ser el tramo, no otro').toEqual(['Av1-TR-1']);
      expect(
        r.notificadas,
        `con ±${precision} m y ${r.lecturas} lecturas quieto, un tramo NO puede completarse sin haberlo andado`
      ).toEqual([]);
    });
  }

  test('TA-3. Control: una parada sí se detecta al llegar a ella', async ({ page }) => {
    // Las paradas no exigen recorrido: `recorridoSuficiente` es `!esTramoActivo || …`.
    const resueltos = await prepararAventura(page, 'Av1-P-1');
    const r = await recorrer(page, { id: 'Av1-P-1', modo: 'andando', precision: 5 });
    expect(resueltos, 'precondición: el elemento medido debe ser la parada, no otro').toEqual(['Av1-P-1']);
    expect(r.notificadas.length, 'una parada debe detectarse al llegar a ella').toBeGreaterThan(0);
  });

  // Un corte de GPS más largo que SALTO_MAXIMO_PLAUSIBLE (150 m) no puede inutilizar el
  // tramo: si la referencia del acumulador solo se moviera al contar, quedaría atrás para
  // siempre y ninguna lectura posterior volvería a sumar. Av4-TR-15 es el tramo más largo
  // del proyecto (1917 m, exige 767 m); los 70 tramos de más de 375 m admiten un corte así
  // dentro del 40 % exigido.
  for (const corteMetros of [200, 400]) {
    test(`TA-4.${corteMetros}. Un corte de GPS de ${corteMetros} m no deja el contador clavado`, async ({ page }) => {
      const resueltos = await prepararAventura(page, 'Av4-TR-15', 'Aventura4');
      const r = await recorrer(page, { id: 'Av4-TR-15', modo: 'andando', precision: 5, corteMetros });
      expect(resueltos, 'precondición: el elemento medido debe ser el tramo largo').toEqual(['Av4-TR-15']);
      expect(
        r.notificadas.length,
        `con un hueco de ${corteMetros} m sin señal a mitad del tramo, el resto del recorrido debe seguir contando`
      ).toBeGreaterThan(0);
    });
  }

  // El umbral de conteo del acumulador es absoluto —max(10, precisión × 1,5)— y el requisito
  // es relativo a la longitud del tramo. En un tramo de 12 m con ±15 m de precisión el umbral
  // pedía un paso de 22,5 m: más largo que el tramo entero, así que no se contaba nunca nada
  // y el tramo era IMPOSIBLE de acabar por GPS. Medido sobre los 239 tramos reales: 6
  // bloqueados con ±15 m y 24 (el 10 %) con ±30 m. Por eso el umbral se acota por la distancia
  // que el propio tramo exige.
  for (const precision of [15, 30]) {
    test(`TA-5.${precision}. Un tramo de 12 m (Av1-TR-18) se completa andándolo con ±${precision} m`, async ({ page }) => {
      const resueltos = await prepararAventura(page, 'Av1-TR-18');
      const r = await recorrer(page, { id: 'Av1-TR-18', modo: 'andando', precision });
      expect(resueltos, 'precondición: el elemento medido debe ser el tramo corto').toEqual(['Av1-TR-18']);
      expect(
        r.notificadas.length,
        `un tramo de 12 m no puede exigir un paso de ${Math.max(10, precision * 1.5)} m para contar: seria imposible de acabar`
      ).toBeGreaterThan(0);
    });
  }
});
