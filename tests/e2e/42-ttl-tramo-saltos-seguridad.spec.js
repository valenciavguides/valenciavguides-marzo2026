/**
 * 42-ttl-tramo-saltos-seguridad.spec.js
 *
 * El TTL de pending (10 min por defecto, §31.7b) ya no puede forzar la llegada de un
 * tramo sin más — permitiría completar la aventura entera sin haber estado nunca cerca,
 * con solo esperar (esta app es una audioguía geolocalizada). El audio se sigue rescatando
 * siempre, sin límite (protección original contra un fallo técnico real). La llegada solo
 * se rescata si queda algún salto de seguridad: máximo 5 por aventura, y cada uno exige un
 * 20% de progreso real (sobre el total de elementos) desde el último salto usado — pensado
 * para un usuario genuinamente perdido por una causa real (obras, calle cortada, un
 * evento), no como forma de avanzar sin moverse. Las paradas ya no reciben ningún rescate
 * de este TTL, ni audio — se dejó fuera a propósito (ver codigo-padre.html).
 *
 * `_ejecutarBarridoTTLPending()` (codigo-padre.html) es el cuerpo del setInterval de 60s,
 * extraído a función con nombre y expuesto en globalThis específicamente para poder
 * invocarlo directamente en estos tests sin esperar el intervalo real.
 *
 *   TTL-1  Tramo con TTL expirado, sin saltos disponibles (0% de progreso desde el
 *          último salto, el mínimo real): el audio se rescata, la llegada no.
 *   TTL-2  Mismo escenario pero con ≥20% de progreso real desde el último salto: la
 *          llegada SÍ se rescata, tramoSkipsUsados sube a 1 y progresoEnUltimoSkip se
 *          actualiza al progreso actual.
 *   TTL-3  Con tramoSkipsUsados ya en 5 (el máximo) y progreso de sobra: la llegada NO
 *          se rescata — el límite de saltos manda por encima del progreso.
 *   TTL-4  Un pending de PARADA con TTL expirado: ni audio ni llegada se tocan — el TTL
 *          quedó exclusivo de tramos.
 *   TTL-5  Fuera de modo AVENTURA, el barrido no toca ningún pending, aunque su TTL haya
 *          expirado de sobra.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function prepararConAventura(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(
    () => typeof globalThis._ejecutarBarridoTTLPending === 'function'
      && typeof globalThis._calcularProgresoFraccion === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null, { timeout: 15000 }
  ).catch(() => {});

  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    globalThis.estadoPadre.modo = { actual: 'aventura', anterior: 'casa' };
    globalThis.estadoPadre.tramoSkipsUsados = 0;
    globalThis.estadoPadre.progresoEnUltimoSkip = 0;
    globalThis.estadoPadre.pendingCompleciones = {};
    const total = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas?.length || 0;
    return {
      tieneFuncion: typeof globalThis._ejecutarBarridoTTLPending === 'function',
      totalElementos: total,
    };
  });
}

const TTL_EXPIRADO_MS = 10 * 60 * 1000; // debe coincidir con el ttlMs por defecto real
const HACE_15_MIN = TTL_EXPIRADO_MS + 5 * 60 * 1000; // sobra margen sobre el TTL

test.describe('TTL — Rescate de tramos por TTL y saltos de seguridad (§31.7b)', () => {
  test('TTL-1. Sin saltos disponibles (0% de progreso desde el último salto): audio se rescata, llegada no', async ({ page }) => {
    const prep = await prepararConAventura(page);
    test.skip(!prep.tieneFuncion || !prep.totalElementos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate((haceMs) => {
      globalThis.estadoPadre.indiceProgreso = 0; // 0% — igual que progresoEnUltimoSkip (0), diferencia 0% < 20%
      globalThis.estadoPadre.pendingCompleciones['padre-TR-test'] = {
        tipo: 'tramo', llegada: false, audio: false, reto: false,
        retosTotal: 0, retosCompletadosCount: 0, timestamp: Date.now() - haceMs, ttlMs: 600000,
      };
      globalThis._ejecutarBarridoTTLPending();
      const p = globalThis.estadoPadre.pendingCompleciones['padre-TR-test'];
      return { audio: p.audio, llegada: p.llegada, skipsUsados: globalThis.estadoPadre.tramoSkipsUsados };
    }, HACE_15_MIN);

    expect(resultado.audio, 'el audio debe rescatarse siempre, sin límite').toBe(true);
    expect(resultado.llegada, 'sin saltos disponibles (0% de progreso), la llegada no debe forzarse').toBe(false);
    expect(resultado.skipsUsados, 'no se debe haber consumido ningún salto').toBe(0);
  });

  test('TTL-2. Con ≥20% de progreso real desde el último salto: la llegada se rescata y se consume un salto', async ({ page }) => {
    const prep = await prepararConAventura(page);
    test.skip(!prep.tieneFuncion || !prep.totalElementos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate(({ haceMs, total }) => {
      // indiceProgreso a un 25% del total — por encima del 20% mínimo exigido desde
      // progresoEnUltimoSkip (0, fijado en prepararConAventura). progresoEsperado se lee
      // con la misma función que usa el barrido (_calcularProgresoFraccion), no
      // recalculado a mano en el test — evita depender de si el total de elementos que
      // usa esa función coincide exactamente con el array de coordenadas de hijo2.
      globalThis.estadoPadre.indiceProgreso = Math.ceil(total * 0.25);
      const progresoEsperado = globalThis._calcularProgresoFraccion();
      globalThis.estadoPadre.pendingCompleciones['padre-TR-test'] = {
        tipo: 'tramo', llegada: false, audio: false, reto: false,
        retosTotal: 0, retosCompletadosCount: 0, timestamp: Date.now() - haceMs, ttlMs: 600000,
      };
      globalThis._ejecutarBarridoTTLPending();
      const p = globalThis.estadoPadre.pendingCompleciones['padre-TR-test'];
      return {
        audio: p.audio,
        llegada: p.llegada,
        skipsUsados: globalThis.estadoPadre.tramoSkipsUsados,
        progresoEnUltimoSkip: globalThis.estadoPadre.progresoEnUltimoSkip,
        progresoEsperado,
      };
    }, { haceMs: HACE_15_MIN, total: prep.totalElementos });

    expect(resultado.progresoEsperado, 'el progreso fijado debe superar el 20% mínimo para que el escenario tenga sentido').toBeGreaterThanOrEqual(0.2);
    expect(resultado.audio).toBe(true);
    expect(resultado.llegada, 'con ≥20% de progreso real, la llegada sí debe forzarse').toBe(true);
    expect(resultado.skipsUsados, 'debe haberse consumido exactamente 1 salto').toBe(1);
    expect(resultado.progresoEnUltimoSkip, 'progresoEnUltimoSkip debe actualizarse al progreso actual').toBeCloseTo(resultado.progresoEsperado, 5);
  });

  test('TTL-3. Con los 5 saltos ya consumidos, la llegada no se rescata aunque sobre progreso', async ({ page }) => {
    const prep = await prepararConAventura(page);
    test.skip(!prep.tieneFuncion || !prep.totalElementos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate(({ haceMs, total }) => {
      globalThis.estadoPadre.tramoSkipsUsados = 5; // límite ya agotado
      globalThis.estadoPadre.progresoEnUltimoSkip = 0;
      globalThis.estadoPadre.indiceProgreso = total; // 100% de progreso, de sobra
      globalThis.estadoPadre.pendingCompleciones['padre-TR-test'] = {
        tipo: 'tramo', llegada: false, audio: false, reto: false,
        retosTotal: 0, retosCompletadosCount: 0, timestamp: Date.now() - haceMs, ttlMs: 600000,
      };
      globalThis._ejecutarBarridoTTLPending();
      const p = globalThis.estadoPadre.pendingCompleciones['padre-TR-test'];
      return { audio: p.audio, llegada: p.llegada, skipsUsados: globalThis.estadoPadre.tramoSkipsUsados };
    }, { haceMs: HACE_15_MIN, total: prep.totalElementos });

    expect(resultado.audio, 'el audio se sigue rescatando aunque no queden saltos').toBe(true);
    expect(resultado.llegada, 'con los 5 saltos ya consumidos, la llegada no debe forzarse pase lo que pase con el progreso').toBe(false);
    expect(resultado.skipsUsados, 'el contador no debe superar el máximo').toBe(5);
  });

  test('TTL-4. Un pending de PARADA con TTL expirado no recibe ningún rescate — ni audio ni llegada', async ({ page }) => {
    const prep = await prepararConAventura(page);
    test.skip(!prep.tieneFuncion || !prep.totalElementos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate((haceMs) => {
      globalThis.estadoPadre.pendingCompleciones['padre-P-test'] = {
        tipo: 'parada', llegada: false, audio: false, reto: false,
        retosTotal: 0, retosCompletadosCount: 0, timestamp: Date.now() - haceMs, ttlMs: 600000,
      };
      globalThis._ejecutarBarridoTTLPending();
      const p = globalThis.estadoPadre.pendingCompleciones['padre-P-test'];
      return { audio: p.audio, llegada: p.llegada };
    }, HACE_15_MIN);

    expect(resultado.audio, 'las paradas ya no reciben rescate de audio del TTL').toBe(false);
    expect(resultado.llegada).toBe(false);
  });

  test('TTL-5. Fuera de modo AVENTURA, el barrido no toca ningún pending aunque su TTL haya expirado', async ({ page }) => {
    const prep = await prepararConAventura(page);
    test.skip(!prep.tieneFuncion || !prep.totalElementos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate((haceMs) => {
      globalThis.estadoPadre.modo = { actual: 'casa', anterior: 'aventura' };
      globalThis.estadoPadre.pendingCompleciones['padre-TR-test'] = {
        tipo: 'tramo', llegada: false, audio: false, reto: false,
        retosTotal: 0, retosCompletadosCount: 0, timestamp: Date.now() - haceMs, ttlMs: 600000,
      };
      globalThis._ejecutarBarridoTTLPending();
      const p = globalThis.estadoPadre.pendingCompleciones['padre-TR-test'];
      return { audio: p.audio, llegada: p.llegada };
    }, HACE_15_MIN);

    expect(resultado.audio, 'en CASA el barrido no debe tocar nada, ni siquiera el audio').toBe(false);
    expect(resultado.llegada).toBe(false);
  });
});
