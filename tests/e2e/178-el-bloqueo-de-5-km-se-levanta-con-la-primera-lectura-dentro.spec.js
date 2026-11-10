/**
 * 178 — El bloqueo de los 5 km se levanta con la primera lectura dentro de la zona, y sale la pantalla de esa zona
 *
 * POR QUE EXISTE
 *
 * A más de 5 km de toda la ruta la aventura se bloquea (§31.5) y sale su cartel (spec 161). Para declarar el bloqueo, la
 * distancia se mira como mucho cada 3 minutos y hacen falta tres lecturas seguidas fuera: así no se bloquea de más. Para
 * levantarlo no hace falta esperar: con el bloqueo puesto, cada lectura precisa mira la distancia, y la primera dentro de
 * los 5 km lo levanta. En esa misma lectura sale la pantalla de la zona en la que está (decisión del usuario: «a pesar de
 * tener la x para cerrar manualmente, si se entra en otra área de distancia, la imagen debería cambiar»).
 *
 * Contra la aplicación de verdad, como el 161: el padre real con sus hijos reales y el bus real; una lectura pasa por la
 * comprobación de los 5 km (`_vv_check5km`) y por funciones-mapa, que la lleva a hijo2. La espera de 3 minutos no se toca:
 * la última comprobación es la que declaró el bloqueo.
 *
 *   BK-1  Bloqueado, una lectura en la Ciudad de las Artes (a 2,5 km de la ruta y a 3,4 km de la parada) lo levanta, y
 *         sale «muy lejos».
 *   BK-2  Lo mismo con el cartel de los 5 km cerrado con su ✗, en su descanso.
 *   BK-3  Control: una lectura que sigue a 300 km no lo levanta; sigue el cartel.
 *   BK-4  Control: una lectura dentro con ±150 m de precisión no cuenta (peor que 100 m): sigue el bloqueo.
 *
 * ROJO ANTES QUE VERDE: con el desbloqueo detrás de la espera de 3 minutos caen BK-1 y BK-2 (sigue bloqueado); BK-3 y BK-4
 * pasan.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Aventura1 en inglés y su parada P-1, como el spec 161. Madrid, fuera de los 5 km de toda la ruta; la Ciudad de las Artes,
// dentro (a 2.484 m del punto más cercano de la ruta) y a 3.410 m de la parada: la franja «muy lejos» (más de 2 km).
const PARADA = 'Av1-P-1';
const MADRID = { lat: 40.41678, lng: -3.70379 };
const CIUDAD_DE_LAS_ARTES = { lat: 39.4567, lng: -0.3494 };

const BLOQUEO = 'gps-out-of-range-overlay';
const MUY_LEJOS = 'foto-perdido-overlay';

const pantallasDeDistancia = (page) => page.evaluate(() =>
  ['gps-out-of-range-overlay', 'foto-perdido-overlay', 'foto-lejos-overlay', 'foto-desviado-overlay', 'foto-fuera-rango-overlay', 'gps-precision-overlay']
    .filter((id) => { const el = document.getElementById(id); return !!el && getComputedStyle(el).display !== 'none'; }));
const bloqueado = (page) => page.evaluate(() => globalThis.__VV_5KM_BLOCKED === true);

/** La comprobación de los 5 km de una lectura. Con `medir`, sin la espera de 3 minutos (solo para declarar el bloqueo). */
const comprobar5km = (page, p, { medir = false, precision = 20 } = {}) => page.evaluate(({ q, medir, precision }) => {
  if (medir) globalThis.__VV_5KM_LAST_CHECK = null;
  globalThis._vv_check5km(q.lat, q.lng, precision);
}, { q: p, medir, precision });
const llevarAHijo2 = (page, p, precision = 8) => page.evaluate(({ q, precision }) =>
  globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: precision } }), { q: p, precision });

/** Cuenta, ya atendidas, las veces que hijo2 pide la franja «muy lejos». */
const vigilarMuyLejos = (page) => page.evaluate(() => {
  globalThis.__pedidasMuyLejos = 0;
  const original = globalThis.showFotoPerdidoOverlay;
  globalThis.showFotoPerdidoOverlay = function (...args) {
    try { return original.apply(this, args); } finally { globalThis.__pedidasMuyLejos++; }
  };
});
const pedidasMuyLejos = (page) => page.evaluate(() => globalThis.__pedidasMuyLejos);

/** Una lectura entera, en el orden de `_watchPositionSuccess`, y espera a que hijo2 haya pedido su franja. */
async function lectura(page, p, { precision = 20 } = {}) {
  const antes = await pedidasMuyLejos(page);
  await comprobar5km(page, p, { precision });
  await llevarAHijo2(page, p, Math.min(precision, 8));
  await expect.poll(() => pedidasMuyLejos(page), { timeout: 15_000, message: 'hijo2 pide la franja «muy lejos» con la lectura' }).toBeGreaterThan(antes);
}

async function arrancar(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: MADRID.lat, longitude: MADRID.lng });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'en';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
    if (!globalThis.AVENTURA_PARADAS?.length) {
      const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
  });
  await cargarHijosDelPadre(page);
  await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4', 'hijo6-chat'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  const cambio = await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), PARADA);
  expect(cambio?.exito, `${PARADA} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
  await vigilarMuyLejos(page);
  // Tres comprobaciones seguidas a 300 km declaran el bloqueo; la última deja corriendo la espera de 3 minutos.
  for (let i = 0; i < 3; i++) await comprobar5km(page, MADRID, { medir: true });
  expect(await bloqueado(page), 'tres comprobaciones a 300 km bloquean la aventura').toBe(true);
  expect(await pantallasDeDistancia(page), 'sale el cartel de los 5 km').toEqual([BLOQUEO]);
}

test.describe('BK — El bloqueo de los 5 km se levanta con la primera lectura dentro', () => {
  test('BK-1. Una lectura dentro de la zona lo levanta, y sale la pantalla de esa zona', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await lectura(page, CIUDAD_DE_LAS_ARTES);
    expect(await bloqueado(page), 'dentro de los 5 km, el bloqueo se levanta en esta lectura').toBe(false);
    expect(await pantallasDeDistancia(page), 'sale «muy lejos», la pantalla de la zona en la que está').toEqual([MUY_LEJOS]);
  });

  test('BK-2. Con el cartel cerrado con su ✗, también', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await page.evaluate((i) => document.querySelector(`#${i} .btn-cerrar-overlay`).click(), BLOQUEO);
    expect(await pantallasDeDistancia(page), 'la ✗ lo cierra').toEqual([]);
    await lectura(page, CIUDAD_DE_LAS_ARTES);
    expect(await bloqueado(page), 'dentro de los 5 km, el bloqueo se levanta').toBe(false);
    expect(await pantallasDeDistancia(page), 'sale «muy lejos»: la ✗ del cartel de los 5 km no la para').toEqual([MUY_LEJOS]);
  });

  test('BK-3. Control: una lectura que sigue fuera no lo levanta', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await lectura(page, MADRID);
    expect(await bloqueado(page), 'a 300 km, sigue bloqueado').toBe(true);
    expect(await pantallasDeDistancia(page), 'sigue el cartel de los 5 km').toEqual([BLOQUEO]);
  });

  test('BK-4. Control: una lectura dentro con ±150 m no cuenta', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await comprobar5km(page, CIUDAD_DE_LAS_ARTES, { precision: 150 });
    expect(await bloqueado(page), 'con una precisión peor que 100 m, la lectura no cuenta: sigue bloqueado').toBe(true);
    expect(await pantallasDeDistancia(page), 'sigue el cartel de los 5 km').toEqual([BLOQUEO]);
  });
});
