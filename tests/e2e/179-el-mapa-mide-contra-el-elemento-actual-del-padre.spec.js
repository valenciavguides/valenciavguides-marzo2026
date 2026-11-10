/**
 * 179 — El mapa mide cada lectura contra el elemento actual del padre
 *
 * POR QUE EXISTE
 *
 * El elemento actual tiene un dueño, el padre: lo cambia al principio de su cambio de parada. El mapa
 * (`js/funciones-mapa.js`) guarda además su propia copia (`estadoMapa.paradaActual`), que cambia después, cuando ha
 * dibujado el elemento nuevo: hasta un segundo más tarde. Cada lectura del GPS se mide contra el elemento actual del padre,
 * no contra esa copia, así que en ese hueco no se manda a hijo2 una lectura del elemento que se acaba de dejar.
 *
 * Contra el padre real con sus hijos reales y el bus real. El hueco se fabrica dejando la copia del mapa en el elemento
 * anterior con `funcionesMapa.limpiarPorEstado`, que es lo que la escribe; lo que llega a hijo2 se escucha en su ventana.
 *
 *   MA-1  Con la copia del mapa en el elemento anterior, la lectura que llega a hijo2 es la del elemento actual del padre.
 *   MA-2  Control: con la copia del mapa al día, la lectura es la del elemento actual.
 *
 * ROJO ANTES QUE VERDE: midiendo contra la copia del mapa, MA-1 cae (la lectura es la del elemento anterior); MA-2 pasa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const ANTERIOR = 'Av1-P-0';
const ACTUAL = 'Av1-P-1';
/** El punto de inicio de la Aventura1 (Torres de Serranos), donde está el usuario al dejarlo. */
const EN_EL_ANTERIOR = { lat: 39.47876, lng: -0.37626 };

const hijo2 = (page) => page.frames().find((f) => f.name() === 'hijo2');

/** Lo que llega a hijo2 en cada `NAVEGACION.ACTUALIZAR_ESTADO`: el elemento contra el que se ha medido. */
const escucharLecturas = (page) => hijo2(page).evaluate(() => {
  globalThis.__lecturasDelMapa = [];
  addEventListener('message', (e) => {
    if (e.data?.tipo === 'NAVEGACION.ACTUALIZAR_ESTADO') globalThis.__lecturasDelMapa.push(e.data?.datos?.idParada ?? null);
  });
});

/** Una lectura del GPS por el mapa, y el elemento con el que llega a hijo2. */
async function lectura(page, p) {
  const antes = await hijo2(page).evaluate(() => globalThis.__lecturasDelMapa.length);
  await page.evaluate((q) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: 8 } }), p);
  await expect.poll(() => hijo2(page).evaluate(() => globalThis.__lecturasDelMapa.length), { timeout: 10_000, message: 'la lectura llega a hijo2' })
    .toBeGreaterThan(antes);
  return hijo2(page).evaluate(() => globalThis.__lecturasDelMapa.at(-1));
}

/** El padre real con sus hijos, en AVENTURA y con el elemento actual en la parada 1, y el mapa ya al día con él. */
async function arrancar(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: EN_EL_ANTERIOR.lat, longitude: EN_EL_ANTERIOR.lng });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
    if (!globalThis.AVENTURA_PARADAS?.length) {
      const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
  });
  await cargarHijosDelPadre(page);
  await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4', 'hijo6-chat'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  const cambio = await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), ACTUAL);
  expect(cambio?.exito, `${ACTUAL} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
  await escucharLecturas(page);
  // El mapa al día: una lectura llega con el elemento actual (la copia del mapa cambia al acabar su cambio de parada).
  await expect.poll(() => lectura(page, EN_EL_ANTERIOR), { timeout: 20_000, message: 'el mapa se pone al día con el elemento actual' }).toBe(ACTUAL);
}

test.describe('MA — El mapa mide cada lectura contra el elemento actual del padre', () => {
  test('MA-1. En el hueco, con la copia del mapa en el elemento anterior, la lectura es la del elemento actual', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    // Con el modo de ahora: sin él, limpiarPorEstado lo toma por un cambio de modo y reinicia el mapa entero.
    await page.evaluate((a) => globalThis.funcionesMapa.limpiarPorEstado({ modo: globalThis.estadoPadre.modo.actual, paradaActual: a }), ANTERIOR);
    expect(await lectura(page, EN_EL_ANTERIOR), 'la lectura que llega a hijo2 se ha medido contra el elemento actual del padre').toBe(ACTUAL);
  });

  test('MA-2. Control: con la copia del mapa al día, la lectura es la del elemento actual', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context);
    expect(await lectura(page, EN_EL_ANTERIOR)).toBe(ACTUAL);
  });
});
