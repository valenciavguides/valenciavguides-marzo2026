/**
 * 161 — El cartel de los 5 km manda mientras dura el bloqueo
 *
 * POR QUE EXISTE
 *
 * A más de 5 km de toda la ruta la aventura se bloquea (§31.5) y sale su cartel. Salía una sola vez, al declararse el
 * bloqueo, y la lectura siguiente lo tapaba con la pantalla de «muy lejos» (la franja de más de 2 km del elemento): el
 * usuario lo veía un segundo. Decisión del usuario: que sea igual que las demás pantallas de distancia. Un solo sitio decide
 * cuál se ve, con un orden: el cartel del bloqueo manda mientras dura, vuelve en cada lectura y respeta el descanso de su ✗
 * (`docs/estudio-caminos.md`, K-84).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales y el bus real. Una lectura entra por los dos sitios
 * por los que entra una del GPS en el padre (`_watchPositionSuccess`): la comprobación de los 5 km (`_vv_check5km`) y el paso
 * a funciones-mapa, que la lleva a hijo2; de hijo2 vuelve la franja, o el aviso de precisión.
 *
 *   CK-1  Bloqueado, la lectura siguiente no lo tapa: sigue el cartel de los 5 km y «muy lejos» no sale.
 *   CK-2  Cerrado con su ✗, durante su descanso no sale ninguna pantalla de distancia.
 *   CK-3  Pasado el descanso, la lectura siguiente lo vuelve a enseñar.
 *   CK-4  Dice lo que es: su imagen y su texto accesible hablan de la zona de la aventura, no de la precisión.
 *   CK-5  El aviso de precisión no lo tapa; al levantarse el bloqueo con la precisión todavía mala, sale el aviso.
 *   CK-6  Control: sin bloqueo, a más de 2 km del elemento sale «muy lejos», como siempre.
 *   CK-7  Sin reintento: el único botón del cartel es su ✗. Decisión del usuario: fuera el reintento, que no puede
 *         levantar el bloqueo, y el panel «Próxima parada» que abría, sin coordenadas que enseñar.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen CK-1 a CK-5 y CK-7; CK-6 pasa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Aventura1 en inglés y su parada P-1 (la de inicio no vale: no es la que se recorre). Madrid queda a unos 300 km: fuera de
// los 5 km de toda la ruta y en la franja «muy lejos» de la parada. Valencia, dentro.
const PARADA = 'Av1-P-1';
const MADRID = { lat: 40.41678, lng: -3.70379 };
const VALENCIA = { lat: 39.47921, lng: -0.37604 };

const BLOQUEO = 'gps-out-of-range-overlay';
const MUY_LEJOS = 'foto-perdido-overlay';
const PRECISION = 'gps-precision-overlay';

/** Las pantallas de distancia que se ven ahora. */
const pantallasDeDistancia = (page) => page.evaluate(() =>
  ['gps-out-of-range-overlay', 'foto-perdido-overlay', 'foto-lejos-overlay', 'foto-desviado-overlay', 'foto-fuera-rango-overlay', 'gps-precision-overlay']
    .filter((id) => { const el = document.getElementById(id); return !!el && getComputedStyle(el).display !== 'none'; }));

const bloqueado = (page) => page.evaluate(() => globalThis.__VV_5KM_BLOCKED === true);

/** La comprobación de los 5 km de una lectura. Con `medir`, sin la espera de 3 minutos entre comprobaciones (spec 56). */
const comprobar5km = (page, p, { medir = false, precision = 20 } = {}) => page.evaluate(({ q, medir, precision }) => {
  if (medir) globalThis.__VV_5KM_LAST_CHECK = null;
  globalThis._vv_check5km(q.lat, q.lng, precision);
}, { q: p, medir, precision });

/** El paso de la lectura a funciones-mapa, que se la lleva a hijo2. */
const llevarAHijo2 = (page, p, precision = 8) => page.evaluate(({ q, precision }) =>
  globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: precision } }), { q: p, precision });

/** Una lectura entera, en el orden de `_watchPositionSuccess`: la comprobación de los 5 km y su paso a hijo2. */
async function lectura(page, p, opciones = {}) {
  await comprobar5km(page, p, opciones);
  await llevarAHijo2(page, p, opciones.precision);
}

/** Cuenta, ya atendidas, las pantallas que pide hijo2: la franja «muy lejos» y el aviso de precisión. */
const vigilarPeticiones = (page) => page.evaluate(() => {
  globalThis.__pedidas = { muyLejos: 0, precision: 0 };
  for (const [nombre, clave] of [['showFotoPerdidoOverlay', 'muyLejos'], ['showGpsPrecisionOverlay', 'precision']]) {
    const original = globalThis[nombre];
    globalThis[nombre] = function (...args) {
      try { return original.apply(this, args); } finally { globalThis.__pedidas[clave]++; }
    };
  }
});
const pedidas = (page, clave) => page.evaluate((c) => globalThis.__pedidas[c], clave);
const esperarPeticion = (page, clave, antes, mensaje) =>
  expect.poll(() => pedidas(page, clave), { timeout: 15_000, message: mensaje }).toBeGreaterThan(antes);

/** El padre real con sus hijos reales, en AVENTURA, con la geolocalización emulada en Madrid (antes del goto: Firefox). */
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
  await vigilarPeticiones(page);
}

/** Tres comprobaciones seguidas a 300 km declaran el bloqueo, y sale su cartel. */
async function bloquear(page) {
  for (let i = 0; i < 3; i++) await comprobar5km(page, MADRID, { medir: true });
  expect(await bloqueado(page), 'tres comprobaciones a 300 km bloquean la aventura').toBe(true);
  expect(await pantallasDeDistancia(page), 'al declararse el bloqueo sale su cartel, solo').toEqual([BLOQUEO]);
}

const cerrarConSuAspa = (page, id) => page.evaluate((i) => document.querySelector(`#${i} .btn-cerrar-overlay`).click(), id);

const textosDelCartel = (page) => page.evaluate(() => ({
  alt: document.getElementById('gps-error-img')?.alt ?? null,
  aria: document.getElementById('gps-out-of-range-overlay')?.getAttribute('aria-label') ?? null,
}));

test.describe('CK — El cartel de los 5 km manda mientras dura el bloqueo', () => {
  test('CK-1. Bloqueado, la lectura siguiente no lo tapa', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await bloquear(page);

    const antes = await pedidas(page, 'muyLejos');
    await lectura(page, MADRID);
    await esperarPeticion(page, 'muyLejos', antes, 'con la lectura siguiente, hijo2 pide la franja «muy lejos»');
    expect(await pantallasDeDistancia(page), 'sigue el cartel de los 5 km, y «muy lejos» no sale').toEqual([BLOQUEO]);
  });

  test('CK-2. Cerrado con su ✗, durante su descanso no sale ninguna pantalla de distancia', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await bloquear(page);
    await cerrarConSuAspa(page, BLOQUEO);
    expect(await pantallasDeDistancia(page), 'la ✗ lo cierra').toEqual([]);

    const antes = await pedidas(page, 'muyLejos');
    await lectura(page, MADRID);
    await esperarPeticion(page, 'muyLejos', antes, 'con la lectura siguiente, hijo2 pide la franja «muy lejos»');
    expect(await pantallasDeDistancia(page), 'durante su descanso no sale ninguna: tampoco «muy lejos»').toEqual([]);
  });

  test('CK-3. Pasado el descanso, la lectura siguiente lo vuelve a enseñar', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await bloquear(page);
    await cerrarConSuAspa(page, BLOQUEO);
    // Los 150 s del descanso, pasados.
    await page.evaluate((i) => { globalThis.__VV_GPS_OVERLAY_SNOOZE[i] = Date.now() - 1; }, BLOQUEO);

    const antes = await pedidas(page, 'muyLejos');
    await lectura(page, MADRID);
    await esperarPeticion(page, 'muyLejos', antes, 'con la lectura siguiente, hijo2 pide la franja «muy lejos»');
    expect(await pantallasDeDistancia(page), 'la lectura vuelve a enseñar el cartel de los 5 km, solo').toEqual([BLOQUEO]);
  });

  test('CK-4. Dice lo que es: la zona de la aventura, no la precisión', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await bloquear(page);
    const alDeclararse = await textosDelCartel(page);
    expect(alDeclararse.alt, 'la imagen').toMatch(/zona de la aventura/);
    expect(alDeclararse.alt).not.toMatch(/precisi/i);
    expect(alDeclararse.aria, 'el texto accesible').toMatch(/zona de la aventura/);
    expect(alDeclararse.aria).not.toMatch(/precisi/i);

    // Y lo sigue diciendo cuando vuelve a salir en una lectura.
    await cerrarConSuAspa(page, BLOQUEO);
    await page.evaluate((i) => { globalThis.__VV_GPS_OVERLAY_SNOOZE[i] = Date.now() - 1; }, BLOQUEO);
    await comprobar5km(page, MADRID);
    expect(await pantallasDeDistancia(page), 'vuelve a salir').toEqual([BLOQUEO]);
    expect(await textosDelCartel(page), 'con los mismos textos').toEqual(alDeclararse);
  });

  test('CK-5. El aviso de precisión no lo tapa, y sale al levantarse el bloqueo', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await bloquear(page);

    // La precisión se estropea (±80 m, por encima de los 50 m de hijo2): hijo2 pide el aviso, una vez por episodio.
    const antes = await pedidas(page, 'precision');
    await context.setGeolocation({ latitude: MADRID.lat, longitude: MADRID.lng, accuracy: 80 });
    await llevarAHijo2(page, MADRID, 80);
    await esperarPeticion(page, 'precision', antes, 'con ±80 m, hijo2 pide el aviso de precisión');
    expect(await pantallasDeDistancia(page), 'el aviso de precisión no tapa el cartel de los 5 km').toEqual([BLOQUEO]);

    // Una comprobación con ±20 m en Valencia levanta el bloqueo; para hijo2, la precisión sigue mala.
    await comprobar5km(page, VALENCIA, { medir: true });
    expect(await bloqueado(page), 'de vuelta dentro de los 5 km, el bloqueo se levanta').toBe(false);
    expect(await pantallasDeDistancia(page), 'sin bloqueo, sale el aviso de precisión que hijo2 había pedido').toEqual([PRECISION]);
  });

  test('CK-7. Sin reintento: el único botón del cartel es su ✗', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    await bloquear(page);
    const botones = await page.evaluate(() => [...document.querySelectorAll('#gps-out-of-range-overlay button')].map((b) => b.className));
    expect(botones, 'un solo botón, el de cerrar').toEqual(['btn-cerrar-overlay']);
  });

  test('CK-6. Control: sin bloqueo, a más de 2 km sale «muy lejos»', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    expect(await bloqueado(page), 'sin tres comprobaciones fuera, no hay bloqueo').toBe(false);

    const antes = await pedidas(page, 'muyLejos');
    await lectura(page, MADRID);
    await esperarPeticion(page, 'muyLejos', antes, 'con la lectura, hijo2 pide la franja «muy lejos»');
    expect(await pantallasDeDistancia(page), 'sale «muy lejos», sola').toEqual([MUY_LEJOS]);
  });
});
