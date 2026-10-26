/**
 * 152 — hijo2 no guarda listas: pide, y el padre resuelve con sus datos (estudio, K-130; decisión 12)
 *
 * POR QUE EXISTE
 *
 * hijo2 es el panel de los botones de la parada (imagen, vídeo, volver a la ruta y los dos mapas) y el detector de
 * llegada. Lo que enseñan sus botones lo enseña el padre, que es quien tiene los datos de la aventura; hijo2 solo sabe en
 * qué elemento está, porque se lo dice el aviso de cambio de parada. Así ningún hijo tiene más de lo que necesita para su
 * trabajo —hijo3 recibe el audio de su parada porque lo reproduce él; hijo4, el reto porque lo enseña él—, y el padre no
 * le pide a hijo2 lo que ya tiene. Los botones de los dos mapas ya funcionaban así (K-107).
 *
 *   H2-1  Al repartir los datos de la aventura y activar una parada, hijo2 no recibe ninguna lista (coordenadas, textos) ni
 *         ninguna petición de coordenadas, no pide ni confirma nada de eso y no guarda ninguna lista. Control: el espía de
 *         hijo2 ve llegar el aviso de cambio de parada.
 *   H2-2  El botón de imagen: hijo2 solo pide la acción; el padre abre su ventana con la imagen, las imágenes y el texto
 *         del elemento actual, sacados de sus datos (el texto, por el `texto_id` del elemento).
 *   H2-3  El botón de vídeo en un tramo: hijo2 solo pide la acción; el padre abre su ventana con el vídeo y el nombre de
 *         ese tramo.
 *   H2-4  «Volver a la ruta»: hijo2 solo manda su posición; ni el elemento ni su id viajan en el mensaje.
 *
 * ROJO ANTES QUE VERDE: con hijo2 guardando las listas y mandando el contenido, caen los cuatro: hijo2 recibe
 * `DATOS.CARGAR_COORDENADAS` y `DATOS.CARGAR_TEXTOS` y el padre le pide la parada (H2-1), y sus mensajes llevan
 * `urlImagen`, `urlVideo` y `proximoElemento` (H2-2 a H2-4).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const hijo2 = (page) => page.frames().find((f) => f.name() === 'hijo2');

/** Lo que recibe hijo2 y lo que hijo2 manda al padre, tal como viaja por postMessage. */
async function espiar(page) {
  await hijo2(page).evaluate(() => {
    globalThis.__recibidosHijo2 = [];
    globalThis.addEventListener('message', (e) => {
      if (e.data && e.data.tipo) globalThis.__recibidosHijo2.push({ tipo: e.data.tipo, datos: e.data.datos || null });
    });
  });
  await page.evaluate(() => {
    globalThis.__mandadosPorHijo2 = [];
    globalThis.addEventListener('message', (e) => {
      if (e.data && e.data.tipo && e.data.origen === 'hijo2') globalThis.__mandadosPorHijo2.push({ tipo: e.data.tipo, datos: e.data.datos || null });
    });
  });
}

/** Aventura1 en español, con los datos de la fase 2 cargados y repartidos, como tras el código. */
async function prepararAventura(page) {
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    await globalThis.__cargarDatosAventuraDiferidos();
    await globalThis.distribuirDatosAventura('Aventura1', 'es');
  });
}

/** Activa un elemento por el camino real y espera a que su aviso de cambio llegue a hijo2. */
async function activar(page, id) {
  await page.evaluate((elementoId) => globalThis.mensajeria.despacharLocal({
    tipo: 'NAVEGACION.CAMBIO_PARADA',
    datos: { paradaId: elementoId, parada_id: elementoId, timestamp: Date.now() },
  }), id);
  await expect.poll(
    () => hijo2(page).evaluate((elementoId) => globalThis.__recibidosHijo2
      .some((m) => m.tipo === 'NAVEGACION.CAMBIO_PARADA' && (m.datos?.parada_id === elementoId || m.datos?.paradaId === elementoId)), id),
    { timeout: 15_000, message: `el aviso de cambio de ${id} llega a hijo2` },
  ).toBe(true);
}

/** El primer elemento del tipo pedido (con imagen, si se pide), de los datos del padre; con su fila del itinerario. */
const elementoDe = (page, tipo, { conImagen = false } = {}) => page.evaluate(async ({ tipo, conImagen }) => {
  const entradas = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html'].coordenadas;
  const { DATOS_PADRE } = await import('/js/aventuras-ID-padre.js');
  const filas = DATOS_PADRE.Aventura1.es.elementosIDpadre;
  for (const entrada of entradas) {
    if (entrada.tipo !== tipo || (conImagen && !entrada.imagen)) continue;
    const fila = filas.find((f) => f.parada_id === entrada.id || f.tramo_id === entrada.id);
    if (fila) return { entrada, fila };
  }
  return null;
}, { tipo, conImagen });

/**
 * Pulsa un botón de hijo2 como lo hace el usuario (su `click`), aunque la selección del arnés siga encima del marco. Con
 * `encender`, lo enciende antes: el de ubicación solo se enciende en AVENTURA y fuera de ruta, y aquí no se mide eso
 * (lo miden los specs de los botones), sino lo que hijo2 manda al pulsarlo.
 */
const pulsar = (page, id, { encender = false } = {}) => hijo2(page).evaluate(({ botonId, encender }) => {
  const boton = document.getElementById(botonId);
  if (encender) { boton.disabled = false; boton.classList.remove('disabled'); }
  boton.click();
}, { botonId: id, encender });

const mensajesDeHijo2 = (page, tipo, accion) => page.evaluate(({ tipo, accion }) => globalThis.__mandadosPorHijo2
  .filter((m) => m.tipo === tipo && (!accion || m.datos?.accion === accion)), { tipo, accion });

test.describe('H2 — hijo2 pide, y el padre resuelve con sus datos', () => {
  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijosDelPadre(page);
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
    await espiar(page);
    await prepararAventura(page);
  });

  test('H2-1. hijo2 no recibe listas ni peticiones de coordenadas, ni pide ni confirma nada de eso', async ({ page }) => {
    await activar(page, 'Av1-P-1');
    const recibidos = await hijo2(page).evaluate(() => globalThis.__recibidosHijo2.map((m) => m.tipo));
    const mandados = await page.evaluate(() => globalThis.__mandadosPorHijo2.map((m) => m.tipo));
    expect(recibidos.filter((t) => ['DATOS.CARGAR_COORDENADAS', 'DATOS.CARGAR_TEXTOS', 'DATOS.COORDENADAS_PARADAS_REQUEST',
      'NAVEGACION.SOLICITAR_COORDENADAS'].includes(t)), 'hijo2 recibe listas o peticiones de coordenadas').toEqual([]);
    expect(mandados.filter((t) => ['DATOS.COORDENADAS_CARGADAS', 'DATOS.TEXTOS_CARGADOS', 'DATOS.SOLICITAR_COORDENADAS',
      'DATOS.SOLICITAR_TEXTOS', 'NAVEGACION.RESPUESTA_COORDENADAS'].includes(t)), 'hijo2 pide o confirma listas').toEqual([]);
    expect(await hijo2(page).evaluate(() => [typeof globalThis.__vv_coordenadasAventura, typeof globalThis.__vv_textosAventura]),
      'hijo2 no guarda ninguna lista').toEqual(['undefined', 'undefined']);
  });

  test('H2-2. Imagen: hijo2 solo pide la acción; el padre enseña la imagen y el texto del elemento actual', async ({ page }) => {
    const elegido = await elementoDe(page, 'parada', { conImagen: true });
    expect(elegido, 'una parada de Aventura1 con imagen y fila en el itinerario').not.toBeNull();
    const { entrada, fila } = elegido;
    const textoEsperado = await page.evaluate(async (textoId) => {
      const { cargarTextos } = await import('/js/data-loader.js');
      return (await cargarTextos('Aventura1', 'es')).find((t) => t.id === textoId)?.content ?? null;
    }, fila.texto_id);
    expect(textoEsperado, `el texto ${fila.texto_id} existe`).toBeTruthy();

    await page.evaluate(() => {
      globalThis.mostrarImagenOverlay = (url, nombre, mensajeError, texto, opciones) => {
        globalThis.__imagenPedida = { url, nombre, texto: texto?.content ?? null, imagenes: opciones?.imagenes ?? null };
      };
    });
    await activar(page, entrada.id);
    await pulsar(page, 'btn-imagen');

    await expect.poll(() => page.evaluate(() => globalThis.__imagenPedida ?? null), { timeout: 10_000, message: 'el padre abre la ventana de la imagen' })
      .not.toBeNull();
    const pedida = await page.evaluate(() => globalThis.__imagenPedida);
    const imagenes = [entrada.imagen, entrada.imagen2, entrada.imagen3, entrada.imagen4].filter((u) => typeof u === 'string' && u.trim() !== '');
    expect(pedida.url, 'la imagen del elemento, de los datos del padre').toBe(imagenes[0]);
    expect(pedida.imagenes, 'todas sus imágenes').toEqual(imagenes);
    expect(pedida.nombre, 'su nombre').toBe(entrada.nombre);
    expect(pedida.texto, `el texto de su texto_id (${fila.texto_id})`).toBe(textoEsperado);

    const mensajes = await mensajesDeHijo2(page, 'UI.ACCION_USUARIO', 'mostrar-imagen');
    expect(mensajes.length, 'hijo2 pide la imagen una vez').toBe(1);
    expect(Object.keys(mensajes[0].datos), 'hijo2 solo pide la acción: no lleva contenido').toEqual(['accion']);
  });

  test('H2-3. Vídeo en un tramo: hijo2 solo pide la acción; el padre abre la ventana con el vídeo del tramo', async ({ page }) => {
    const elegido = await elementoDe(page, 'tramo');
    expect(elegido, 'un tramo de Aventura1 con fila en el itinerario').not.toBeNull();
    const { entrada } = elegido;
    await page.evaluate(() => {
      globalThis.mostrarVideoOverlay = (url, nombre, mensajeError) => { globalThis.__videoPedido = { url, nombre, mensajeError }; };
    });
    await activar(page, entrada.id);
    await pulsar(page, 'btn-video');

    await expect.poll(() => page.evaluate(() => globalThis.__videoPedido ?? null), { timeout: 10_000, message: 'el padre abre la ventana del vídeo' })
      .not.toBeNull();
    const pedido = await page.evaluate(() => globalThis.__videoPedido);
    const video = typeof entrada.video === 'string' && entrada.video.trim() !== '' ? entrada.video : null;
    expect(pedido.url, 'el vídeo del tramo, de los datos del padre (o ninguno)').toBe(video);
    expect(pedido.nombre, 'su nombre').toBe(entrada.nombre);
    if (!video) expect(pedido.mensajeError, 'sin vídeo, la ventana lo dice').toBeTruthy();

    const mensajes = await mensajesDeHijo2(page, 'UI.ACCION_USUARIO', 'reproducir-video');
    expect(mensajes.length, 'hijo2 pide el vídeo una vez').toBe(1);
    expect(Object.keys(mensajes[0].datos), 'hijo2 solo pide la acción: no lleva contenido').toEqual(['accion']);
  });

  test('H2-4. «Volver a la ruta»: hijo2 solo manda su posición, sin el elemento ni su id', async ({ page }) => {
    const elegido = await elementoDe(page, 'tramo');
    expect(elegido, 'un tramo de Aventura1 con fila en el itinerario').not.toBeNull();
    await activar(page, elegido.entrada.id);
    await pulsar(page, 'btn-ubicacion', { encender: true });

    await expect.poll(() => mensajesDeHijo2(page, 'NAVEGACION.MOSTRAR_UBICACION_POLYLINE').then((m) => m.length), { timeout: 10_000,
      message: 'hijo2 pide el camino' }).toBe(1);
    const [mensaje] = await mensajesDeHijo2(page, 'NAVEGACION.MOSTRAR_UBICACION_POLYLINE');
    expect(Object.keys(mensaje.datos).filter((k) => ['proximoElemento', 'elementoId'].includes(k)), 'ni el elemento ni su id viajan').toEqual([]);
  });
});
