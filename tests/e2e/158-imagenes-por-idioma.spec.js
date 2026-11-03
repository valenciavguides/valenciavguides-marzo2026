/**
 * 158 — Las imágenes que dependen del idioma salen detrás de las fotos de la parada, de la carpeta de su idioma
 *
 * POR QUE EXISTE
 *
 * Algunas paradas llevan, además de sus fotos, imágenes con texto (los arcos, la arquitectura gótica, las partes de una
 * falla…), una por idioma. Su entrada en la tabla de coordenadas las nombra en `imagenes_idioma`, sin carpeta ni extensión,
 * y la ventana de la imagen las enseña detrás de las fotos, desde imagenes/imagenes-idiomas/<carpeta>/<nombre>.jpg, con la
 * carpeta que LANG_ARCHIVO_PARRAFOS da al idioma elegido (la de sus párrafos).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales y el botón de la imagen de hijo2. La ventana del
 * padre se sustituye por un espía que apunta lo que recibe.
 *
 *   IM-1  En español, la ventana de Av1-P-5 lleva sus fotos y, detrás, sus cinco imágenes de la carpeta `espanol`.
 *   IM-2  En inglés, las mismas cinco, de la carpeta `ingles`.
 *   IM-3  Control: la ventana de Av1-P-1, sin `imagenes_idioma`, lleva solo sus fotos.
 *
 * ROJO ANTES QUE VERDE: sin el cambio, IM-1 e IM-2 caen (la ventana lleva solo las fotos); IM-3 pasa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const CINCO = ['arquitectura-gotica', 'arquitectura-detalles', 'arquitectura-detalles-2', 'arquitectura-iglesia', 'arquitectura-iglesias'];

const hijo2 = (page) => page.frames().find((f) => f.name() === 'hijo2');

/** Aventura1 en el idioma pedido, con los datos de la fase 2 cargados y repartidos, como tras el código. */
async function prepararAventura(page, idioma) {
  await page.evaluate(async (i) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = i;
    await globalThis.__cargarDatosAventuraDiferidos();
    await globalThis.distribuirDatosAventura('Aventura1', i);
  }, idioma);
}

/** Activa una parada por el camino real y espera a que su aviso de cambio llegue a hijo2. */
async function activar(page, id) {
  await hijo2(page).evaluate(() => {
    globalThis.__cambios = [];
    globalThis.addEventListener('message', (e) => { if (e.data?.tipo === 'NAVEGACION.CAMBIO_PARADA') globalThis.__cambios.push(e.data.datos?.parada_id); });
  });
  await page.evaluate((elementoId) => globalThis.mensajeria.despacharLocal({
    tipo: 'NAVEGACION.CAMBIO_PARADA',
    datos: { paradaId: elementoId, parada_id: elementoId, timestamp: Date.now() },
  }), id);
  await expect.poll(() => hijo2(page).evaluate((elementoId) => globalThis.__cambios.includes(elementoId), id),
    { timeout: 15_000, message: `el aviso de cambio de ${id} llega a hijo2` }).toBe(true);
}

/** Lo que recibe la ventana de la imagen al pulsar el botón de hijo2 (como el usuario: su `click`). */
async function imagenesDeLaVentana(page) {
  await page.evaluate(() => {
    globalThis.__ventana = null;
    globalThis.mostrarImagenOverlay = (url, nombre, mensajeError, texto, opciones) => { globalThis.__ventana = { url, imagenes: opciones?.imagenes ?? null }; };
  });
  await hijo2(page).evaluate(() => document.getElementById('btn-imagen').click());
  await expect.poll(() => page.evaluate(() => globalThis.__ventana), { timeout: 10_000, message: 'el padre abre la ventana de la imagen' }).not.toBeNull();
  return page.evaluate(() => globalThis.__ventana.imagenes);
}

/** Las fotos de una entrada, tal como las lista la ventana. */
const fotosDe = (page, id) => page.evaluate((elementoId) => {
  const e = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html'].coordenadas.find((x) => x.id === elementoId);
  return [e.imagen, e.imagen2, e.imagen3, e.imagen4].filter((u) => typeof u === 'string' && u.trim() !== '');
}, id);

async function arrancar(page, context, idioma) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate((i) => { globalThis.idiomaSeleccionado = i; }, idioma);
  await cargarHijosDelPadre(page);
  await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
  await prepararAventura(page, idioma);
}

test.describe('IM — Las imágenes que dependen del idioma', () => {
  for (const [id, idioma, carpeta] of [['IM-1', 'es', 'espanol'], ['IM-2', 'en', 'ingles']]) {
    test(`${id}. En ${idioma}, la ventana de Av1-P-5 lleva detrás de sus fotos sus cinco imágenes de la carpeta ${carpeta}`, async ({ page, context }) => {
      test.setTimeout(120_000);
      await arrancar(page, context, idioma);
      await activar(page, 'Av1-P-5');
      const fotos = await fotosDe(page, 'Av1-P-5');
      expect(fotos.length, 'Av1-P-5 tiene fotos').toBeGreaterThan(0);
      expect(await imagenesDeLaVentana(page), 'sus fotos y, detrás, las imágenes de su idioma')
        .toEqual([...fotos, ...CINCO.map((n) => `imagenes/imagenes-idiomas/${carpeta}/${n}.jpg`)]);
    });
  }

  test('IM-3. Control: la ventana de Av1-P-1, sin imágenes por idioma, lleva solo sus fotos', async ({ page, context }) => {
    test.setTimeout(120_000);
    await arrancar(page, context, 'es');
    await activar(page, 'Av1-P-1');
    expect(await imagenesDeLaVentana(page)).toEqual(await fotosDe(page, 'Av1-P-1'));
  });
});
