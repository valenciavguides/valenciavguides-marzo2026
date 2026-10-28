/**
 * 162 — El botón de ubicación respeta el descanso de las pantallas de distancia
 *
 * POR QUE EXISTE
 *
 * Una pantalla de distancia ocupa toda la vista, por encima de hijo2: para pulsar el botón de ubicación hay que cerrarla
 * antes con su ✗, que le da su descanso (de 60 a 150 s). El botón vaciaba los descansos de las seis pantallas, y la que el
 * usuario acababa de cerrar volvía enseguida, encima de la línea que había pedido. Decisión del usuario: el botón de
 * ubicación oculta las pantallas sin tocar sus descansos (`docs/estudio-caminos.md`, K-145). Volver dentro del rango sí
 * los vacía: la próxima salida empieza de cero.
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real y el botón de ubicación de hijo2.
 * Una lectura entra por los dos sitios por los que entra una del GPS en el padre: la comprobación de los 5 km
 * (`_vv_check5km`) y el paso a funciones-mapa, que la lleva a hijo2.
 *
 *   UD-1  «Muy lejos», cerrada con su ✗: tras pulsar ubicación, su descanso sigue y la lectura siguiente no la trae.
 *   UD-2  Lo mismo con el cartel del bloqueo de 5 km.
 *   UD-3  Control: volver dentro del rango vacía los descansos, y al salir otra vez «muy lejos» sale enseguida.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen UD-1 y UD-2; UD-3 pasa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Aventura1 en inglés y su parada P-1 (spec 159). Madrid queda a unos 300 km: fuera de los 5 km de toda la ruta y en la
// franja «muy lejos» de la parada.
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };
const MADRID = { lat: 40.41678, lng: -3.70379 };

const BLOQUEO = 'gps-out-of-range-overlay';
const MUY_LEJOS = 'foto-perdido-overlay';

/** Las pantallas de distancia que se ven ahora. */
const pantallasDeDistancia = (page) => page.evaluate(() =>
  ['gps-out-of-range-overlay', 'foto-perdido-overlay', 'foto-lejos-overlay', 'foto-desviado-overlay', 'foto-fuera-rango-overlay', 'gps-precision-overlay']
    .filter((id) => { const el = document.getElementById(id); return !!el && getComputedStyle(el).display !== 'none'; }));

/** Las pantallas con su descanso en marcha. */
const descansos = (page) => page.evaluate(() =>
  Object.entries(globalThis.__VV_GPS_OVERLAY_SNOOZE || {}).filter(([, hasta]) => hasta > Date.now()).map(([id]) => id).sort());

/** La comprobación de los 5 km de una lectura. Con `medir`, sin la espera de 3 minutos entre comprobaciones (spec 56). */
const comprobar5km = (page, p, { medir = false } = {}) => page.evaluate(({ q, medir }) => {
  if (medir) globalThis.__VV_5KM_LAST_CHECK = null;
  globalThis._vv_check5km(q.lat, q.lng, 20);
}, { q: p, medir });

/** El paso de la lectura a funciones-mapa, que se la lleva a hijo2. */
const llevarAHijo2 = (page, p) => page.evaluate((q) =>
  globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: 8 } }), p);

/** Cuenta, ya atendidas, la franja «muy lejos» que pide hijo2 y las veces que el padre oculta las seis pantallas. */
const vigilar = (page) => page.evaluate(() => {
  globalThis.__vistas = { muyLejos: 0, ocultarTodas: 0 };
  for (const [nombre, clave] of [['showFotoPerdidoOverlay', 'muyLejos'], ['_ocultarTodasPantallasDistanciaGPS', 'ocultarTodas']]) {
    const original = globalThis[nombre];
    globalThis[nombre] = function (...args) {
      try { return original.apply(this, args); } finally { globalThis.__vistas[clave]++; }
    };
  }
});
const vistas = (page, clave) => page.evaluate((c) => globalThis.__vistas[c], clave);
const esperarVista = (page, clave, antes, mensaje) =>
  expect.poll(() => vistas(page, clave), { timeout: 15_000, message: mensaje }).toBeGreaterThan(antes);

/** Una lectura en Madrid, en el orden de `_watchPositionSuccess`, hasta que el padre atiende la franja que pide hijo2. */
async function lecturaEnMadrid(page) {
  const antes = await vistas(page, 'muyLejos');
  await comprobar5km(page, MADRID);
  await llevarAHijo2(page, MADRID);
  await esperarVista(page, 'muyLejos', antes, 'con la lectura, hijo2 pide la franja «muy lejos»');
}

/** El padre real con sus hijos reales, en AVENTURA, la parada activa y la geolocalización emulada en Madrid (antes del goto: Firefox). */
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
  const cambio = await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), PARADA.id);
  expect(cambio?.exito, `${PARADA.id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
  await vigilar(page);
}

const cerrarConSuAspa = (page, id) => page.evaluate((i) => document.querySelector(`#${i} .btn-cerrar-overlay`).click(), id);

/** Pulsa el botón de ubicación de hijo2 y espera a que el padre atienda la petición de la línea. */
async function pulsarUbicacion(page) {
  const antes = await vistas(page, 'ocultarTodas');
  await expect.poll(() => page.evaluate(() => document.getElementById('hijo2').contentDocument.getElementById('btn-ubicacion').disabled),
    { timeout: 15_000, message: 'fuera de rango, el botón de ubicación está encendido' }).toBe(false);
  await page.evaluate(() => document.getElementById('hijo2').contentDocument.getElementById('btn-ubicacion').click());
  await esperarVista(page, 'ocultarTodas', antes, 'el padre atiende la petición de la línea y oculta las pantallas');
}

test.describe('UD — El botón de ubicación respeta el descanso de las pantallas de distancia', () => {
  test('UD-1. «Muy lejos», cerrada con su ✗, no vuelve tras pulsar ubicación', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await lecturaEnMadrid(page);
    expect(await pantallasDeDistancia(page), 'a 300 km de la parada sale «muy lejos»').toEqual([MUY_LEJOS]);
    await cerrarConSuAspa(page, MUY_LEJOS);
    expect(await descansos(page), 'su ✗ le da su descanso').toEqual([MUY_LEJOS]);

    await pulsarUbicacion(page);
    expect(await descansos(page), 'el botón de ubicación no toca el descanso').toEqual([MUY_LEJOS]);
    await lecturaEnMadrid(page);
    expect(await pantallasDeDistancia(page), 'la lectura siguiente no la trae: se ve la línea').toEqual([]);
  });

  test('UD-2. El cartel del bloqueo de 5 km, cerrado con su ✗, no vuelve tras pulsar ubicación', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    for (let i = 0; i < 3; i++) await comprobar5km(page, MADRID, { medir: true });
    expect(await page.evaluate(() => globalThis.__VV_5KM_BLOCKED === true), 'tres comprobaciones a 300 km bloquean la aventura').toBe(true);
    expect(await pantallasDeDistancia(page), 'sale el cartel del bloqueo').toEqual([BLOQUEO]);
    // Una lectura para que hijo2 sepa que el usuario está fuera de rango y encienda su ayuda (la ubicación).
    await lecturaEnMadrid(page);
    await cerrarConSuAspa(page, BLOQUEO);
    expect(await descansos(page), 'su ✗ le da su descanso').toEqual([BLOQUEO]);

    await pulsarUbicacion(page);
    expect(await descansos(page), 'el botón de ubicación no toca el descanso').toEqual([BLOQUEO]);
    await lecturaEnMadrid(page);
    expect(await pantallasDeDistancia(page), 'la lectura siguiente no lo trae').toEqual([]);
  });

  test('UD-3. Control: volver dentro del rango vacía los descansos', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await lecturaEnMadrid(page);
    await cerrarConSuAspa(page, MUY_LEJOS);
    expect(await descansos(page), 'su ✗ le da su descanso').toEqual([MUY_LEJOS]);

    // En la parada: hijo2 avisa de que el usuario ha vuelto dentro del rango, y el padre oculta y empieza de cero.
    const antes = await vistas(page, 'ocultarTodas');
    await llevarAHijo2(page, PARADA);
    await esperarVista(page, 'ocultarTodas', antes, 'de vuelta en la parada, el padre recibe GPS.DENTRO_DE_RANGO');
    expect(await descansos(page), 'volver dentro del rango vacía los descansos').toEqual([]);

    await lecturaEnMadrid(page);
    expect(await pantallasDeDistancia(page), 'al salir otra vez, «muy lejos» sale enseguida').toEqual([MUY_LEJOS]);
  });
});
