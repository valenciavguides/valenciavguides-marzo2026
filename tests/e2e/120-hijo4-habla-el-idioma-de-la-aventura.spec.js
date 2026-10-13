/**
 * 120-hijo4-habla-el-idioma-de-la-aventura.spec.js
 *
 * Los dos textos propios de hijo4 —el marcador del campo de texto y el aviso «Este reto no está
 * disponible»— salen en el idioma de la aventura. El idioma llega en `RETO.MOSTRAR` (`datos.idioma`),
 * el mensaje que ya viaja por parada y pinta el reto: lo mandan los tres sitios que lo emiten
 * y hijo4 lo aplica antes de pintar.
 *
 *   ID-1  hijo4 pinta el marcador del campo de texto en el idioma del mensaje
 *   ID-2  sin `idioma` en el mensaje, el marcador sale en español (el respaldo)
 *   ID-3  el padre manda `idioma` en el RETO.MOSTRAR de la progresión y en la reposición que sigue a una recarga de hijo4
 *   ID-4  el padre manda `idioma` al contestar a `DATOS.SOLICITAR_RETOS` (la petición de hijo4 tras un fallo de caché)
 *
 * ROJO ANTES QUE VERDE: con el código anterior, ID-1 cae (hijo4 leía un `globalThis.__vv_idiomaActual`
 * que solo escribía hijo2, en su propio `globalThis`, así que siempre salía en español), e ID-3 e ID-4
 * caen (el mensaje no llevaba `idioma`). ID-2 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const {
  abrirHijoEnMarco, enviarAlHijo,
  injectInitSpy, stubCDNResources, gotoAndWaitForFase1,
} = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const RETO_TEXTO = { id: 'id-texto', tipo: 'texto', pregunta: '¿Test?', correctas: ['lo que sea'] };
const PLACEHOLDER = { es: 'Escriba su respuesta aquí...', fr: 'Écrivez votre réponse ici...' };

/** El placeholder del campo de texto que pinta hijo4 al recibir un RETO.MOSTRAR con (o sin) `idioma`. */
async function placeholderTrasMostrar(page, idioma) {
  const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
  const datos = { retoId: RETO_TEXTO.id, retosArray: [RETO_TEXTO], contexto: 'manual', timestamp: Date.now() };
  if (idioma) datos.idioma = idioma;
  await enviarAlHijo(page, { tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4', datos });
  await hijo.waitForSelector('#respuestaTexto', { timeout: 10_000 });
  return hijo.evaluate(() => document.getElementById('respuestaTexto').placeholder);
}

test.describe('ID — hijo4 recibe el idioma de la aventura', () => {
  test('ID-1. hijo4 pinta el marcador del campo de texto en el idioma del mensaje', async ({ page }) => {
    expect(await placeholderTrasMostrar(page, 'fr')).toBe(PLACEHOLDER.fr);
  });

  test('ID-2. Sin `idioma` en el mensaje, el marcador sale en español', async ({ page }) => {
    expect(await placeholderTrasMostrar(page, null)).toBe(PLACEHOLDER.es);
  });
});

test.describe('ID — el padre manda el idioma en cada RETO.MOSTRAR', () => {
  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(90_000);
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'fr';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
    });
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estado?.hijosInicializados?.has('hijo4'), null, { timeout: 60_000 });
  });

  /** Apunta, dentro del iframe de hijo4, los `datos` de cada RETO.MOSTRAR que le llegan. */
  async function escuchar(page) {
    const hijo = page.frames().find((f) => f.name() === 'hijo4');
    await hijo.evaluate(() => {
      globalThis.__retoMostrar = [];
      globalThis.addEventListener('message', (e) => { if (e.data?.tipo === 'RETO.MOSTRAR') globalThis.__retoMostrar.push(e.data.datos); });
    });
    return { hijo, leer: () => hijo.evaluate(() => globalThis.__retoMostrar) };
  }

  test('ID-3. La progresión y la reposición tras recargar hijo4 llevan `idioma`', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.estadoPadre.modo = globalThis.estadoPadre.modo || {};
      globalThis.estadoPadre.modo.actual = globalThis.MODOS.AVENTURA;
      globalThis.estado.retoActual = { id: 'reto-A', cola: ['reto-A', 'reto-B'], colaCompletados: new Set() };
    });
    const { leer } = await escuchar(page);
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.RETO.COMPLETADO,
      datos: { retoId: 'reto-A', correcto: true },
    }));
    await expect.poll(() => leer().then((r) => r.some((d) => d.retoId === 'reto-B')), { timeout: 8_000 }).toBe(true);
    const progresion = (await leer()).find((d) => d.retoId === 'reto-B');
    expect(progresion.idioma, 'el RETO.MOSTRAR de la progresión lleva el idioma de la aventura').toBe('fr');

    // La reposición que manda el padre cuando hijo4 se recarga: sale del mismo snapshot.
    await page.evaluate(() => globalThis._vv_beforeHijoReload('hijo4'));
    const despues = await escuchar(page);
    await page.evaluate(() => globalThis._vv_afterHijoListo('hijo4'));
    await expect.poll(() => despues.leer().then((r) => r.some((d) => d.retoId === 'reto-B')), { timeout: 8_000 }).toBe(true);
    const reposicion = (await despues.leer()).find((d) => d.retoId === 'reto-B');
    expect(reposicion.idioma, 'la reposición tras recargar hijo4 lleva el mismo idioma').toBe('fr');
  });

  test('ID-4. La respuesta a DATOS.SOLICITAR_RETOS lleva `idioma`', async ({ page }) => {
    const retoId = await page.evaluate(async () => {
      const { cargarRetos } = await import('/js/data-loader.js');
      const retos = await cargarRetos('Aventura1', 'fr');
      return retos.find((r) => r && r.id)?.id || null;
    });
    expect(retoId, 'precondición: la aventura tiene retos en francés').toBeTruthy();

    const { hijo, leer } = await escuchar(page);
    await hijo.evaluate((id) => globalThis.mensajeria.enviarMensaje({ tipo: 'DATOS.SOLICITAR_RETOS', destino: 'padre', datos: { retoId: id } }), retoId);
    await expect.poll(() => leer().then((r) => r.some((d) => d.contexto === 'solicitud_hijo')), { timeout: 8_000 }).toBe(true);
    const respuesta = (await leer()).find((d) => d.contexto === 'solicitud_hijo');
    expect(respuesta.idioma, 'la respuesta a la petición de hijo4 lleva el idioma de la aventura').toBe('fr');
  });
});
