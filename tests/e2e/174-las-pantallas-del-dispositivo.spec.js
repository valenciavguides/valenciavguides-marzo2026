/**
 * 174 — Las pantallas del dispositivo: la brújula y los ajustes, al empezar una aventura y al continuarla
 *
 * POR QUE EXISTE
 *
 * Al empezar una aventura y al continuarla, el padre enseña dos pantallas seguidas (mostrarAvisosDelDispositivo):
 * «Calibración de la brújula» y «Ajustes de su dispositivo» (giro automático y ahorro de batería). Una ventana flotante
 * con el aspecto de los carteles; el botón del mundo verde pasa de la primera a la segunda, y en la segunda la cierra.
 * Textos del usuario, de usted, con el logo en línea, en los 12 idiomas (TRADUCCIONES_AVISOS_DISPOSITIVO).
 *
 *   AD-1  La primera pantalla, con su título, su texto y el logo; el botón, pulsado de verdad, pasa a la segunda; y otra
 *         vez, la cierra.
 *   AD-2  Los 12 idiomas tienen los cinco textos, con el logo una vez en cada texto; los del español, los del usuario.
 *   AD-3  Salen al empezar la aventura (el recorrido real hasta «empezar») y otra vez al continuarla tras recargar.
 *   AD-4  No tapan lo que se abre después ni se ven durante la carga o un diálogo: z-index por debajo de los retos, la
 *         imagen, el vídeo, el mapa completo, el chat y las pantallas del GPS; con body.loading, ocultas.
 *   AD-5  La función que pone el logo en línea (renderTextoConImagenes, js/utils.js) es la de la ayuda de hijo6: sus
 *         respuestas siguen con sus imágenes en línea y sin ninguna marca {{IMG:…}} a la vista.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const INICIO = { latitude: 39.47876, longitude: -0.37626 };
const IDIOMAS = ['es', 'en', 'fr', 'it', 'nl', 'ja', 'de', 'zh', 'pl', 'pt', 'ru', 'uk'];
const LOGO = '{{IMG:logo_alargado_3}}';
const ES = {
  brujulaTitulo: 'Calibración de la brújula',
  brujulaTexto: `${LOGO} le recomienda mover el dispositivo varias veces en el aire, dibujando un ocho, para calibrar correctamente su brújula y mejorar la precisión de la orientación.`,
  ajustesTitulo: 'Ajustes de su dispositivo',
  ajustesTexto: `${LOGO} recomienda desactivar el giro automático de pantalla y el modo de ahorro de batería para mantener la visualización en formato vertical y garantizar la máxima precisión posible de la señal GPS.`,
};

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

/** Lo que enseña la ventana: cuál de las dos, el título, el texto (con el logo por su texto alternativo) y si se ve. */
const ventana = (page) => page.evaluate(() => {
  const p = document.getElementById('avisos-dispositivo');
  if (!p) return null;
  const texto = p.querySelector('p');
  const logo = texto.querySelector('img');
  const cs = getComputedStyle(p);
  return {
    pantalla: p.dataset.pantalla,
    titulo: p.querySelector('h2').textContent,
    texto: [...texto.childNodes].map((n) => (n.nodeType === 3 ? n.textContent : `[${n.alt}]`)).join(''),
    logo: logo ? { src: decodeURIComponent(logo.getAttribute('src')), clase: logo.className } : null,
    seVe: cs.visibility === 'visible' && Number(cs.opacity) > 0 && cs.display !== 'none',
  };
});

async function prepararPagina(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(INICIO);
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
}

/** El padre arrancado y a la vista: sin body.loading y con la pantalla de carga desvanecida. */
async function padreALaVista(page) {
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  await page.waitForFunction(() => !document.body.classList.contains('loading'), null, { timeout: 60_000 });
  await page.waitForFunction(() => getComputedStyle(document.getElementById('loading-overlay')).display === 'none', null, { timeout: 30_000 });
}

/** El recorrido real desde elegir hasta la aventura en marcha (el de los specs 128, 131 y 164). */
async function empezarAventura(page) {
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 30_000 },
  );
  const f = seleccion(page);
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  await f.evaluate(() => mostrar(7));
  await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
  await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
  await f.evaluate(() => { if (getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none') cerrarMapaVintage(); });
  await f.evaluate(() => mostrar(15));
  await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 90_000 });
  await f.evaluate(() => mostrar(17));
  await f.evaluate(() => document.querySelector('#pantalla17 .btn-mundo-verde').click());
  await page.waitForFunction(
    () => globalThis.estadoPadre?.modo?.actual === 'aventura' && globalThis.aventuraSeleccionada === 'Aventura1'
      && getComputedStyle(document.getElementById('seleccion')).display === 'none' && !!globalThis.estadoPadre?.paradaActual,
    null, { timeout: 60_000 },
  );
  await padreALaVista(page);
}

/** El botón del mundo verde de la ventana, pulsado como lo pulsa una persona. */
const pulsarSiguiente = (page) => page.locator('#avisos-dispositivo .btn-mundo-verde').click();

test.describe('AD — Las pantallas del dispositivo', () => {
  test('AD-1. La brújula, el botón la pasa a los ajustes, y otra vez la cierra', async ({ page, context }) => {
    await prepararPagina(page, context);
    await gotoAndWaitForFase1(page);
    await padreALaVista(page);
    await page.evaluate(() => {
      globalThis.idiomaSeleccionado = 'es';
      globalThis.__avisosCerrados = null;
      globalThis.mostrarAvisosDelDispositivo().then((r) => { globalThis.__avisosCerrados = r; });
    });
    await expect.poll(() => ventana(page), { timeout: 10_000 }).not.toBeNull();
    const logo = { src: 'imagenes/imagenes-aplicación/logo_alargado_3.png', clase: 'texto-imagen-inline' };
    expect(await ventana(page)).toEqual({
      pantalla: 'brujula', titulo: ES.brujulaTitulo, texto: ES.brujulaTexto.replace(LOGO, '[València be Guides]'), logo, seVe: true,
    });
    expect(await page.evaluate(() => document.querySelector('#avisos-dispositivo .btn-mundo-verde').getAttribute('aria-label'))).toBe('Siguiente');

    await pulsarSiguiente(page);
    expect(await ventana(page)).toEqual({
      pantalla: 'ajustes', titulo: ES.ajustesTitulo, texto: ES.ajustesTexto.replace(LOGO, '[València be Guides]'), logo, seVe: true,
    });

    await pulsarSiguiente(page);
    expect(await ventana(page), 'la segunda pulsación la cierra').toBeNull();
    await expect.poll(() => page.evaluate(() => globalThis.__avisosCerrados)).toBe(true);
  });

  test('AD-2. Los 12 idiomas tienen sus cinco textos, con el logo una vez en cada texto; el español, el del usuario', async ({ page }) => {
    await page.goto('/tests/e2e/helpers/marco-vacio.html');
    const textos = await page.evaluate(async () => (await import('/js/traducciones-ui.js')).TRADUCCIONES_AVISOS_DISPOSITIVO);
    expect(Object.keys(textos).sort()).toEqual([...IDIOMAS].sort());
    for (const idioma of IDIOMAS) {
      const t = textos[idioma];
      for (const campo of ['brujulaTitulo', 'brujulaTexto', 'ajustesTitulo', 'ajustesTexto', 'siguiente']) {
        expect(typeof t[campo] === 'string' && t[campo].trim().length > 0, `${idioma}.${campo}`).toBe(true);
      }
      for (const campo of ['brujulaTexto', 'ajustesTexto']) {
        expect(t[campo].split(LOGO).length - 1, `${idioma}.${campo}: el logo, una vez`).toBe(1);
        expect(t[campo].replace(LOGO, ''), `${idioma}.${campo}: ninguna otra marca`).not.toContain('{{');
      }
    }
    expect({ ...textos.es, siguiente: undefined }).toEqual({ ...ES, siguiente: undefined });
  });

  test('AD-3. Salen al empezar la aventura y otra vez al continuarla tras recargar', async ({ page, context }) => {
    test.setTimeout(240_000);
    await prepararPagina(page, context);
    await gotoAndWaitForFase1(page);
    await padreALaVista(page);
    await empezarAventura(page);
    await expect.poll(async () => (await ventana(page))?.pantalla, { timeout: 15_000, message: 'al empezar, la brújula' }).toBe('brujula');
    expect((await ventana(page)).seVe).toBe(true);
    await pulsarSiguiente(page);
    await pulsarSiguiente(page);
    expect(await ventana(page)).toBeNull();

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#btn-continuar-aventura', { timeout: 60_000 });
    expect(await ventana(page), 'el diálogo de continuar va antes que las pantallas').toBeNull();
    await page.evaluate(() => document.getElementById('btn-continuar-aventura').click());
    await expect.poll(async () => (await ventana(page))?.pantalla, { timeout: 90_000, message: 'al continuar, la brújula' }).toBe('brujula');
    await padreALaVista(page);
    expect((await ventana(page)).seVe).toBe(true);
  });

  test('AD-4. Por debajo de lo que se abre después, y oculta durante la carga o un diálogo', async ({ page, context }) => {
    await prepararPagina(page, context);
    await gotoAndWaitForFase1(page);
    await padreALaVista(page);
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; void globalThis.mostrarAvisosDelDispositivo(); });
    await expect.poll(() => ventana(page), { timeout: 10_000 }).not.toBeNull();

    const capas = await page.evaluate(() => {
      const z = (el) => Number(getComputedStyle(el).zIndex);
      const deClase = (clase) => { const el = document.createElement('div'); el.className = clase; document.body.appendChild(el); const v = z(el); el.remove(); return v; };
      const ids = ['hijo4', 'hijo6-chat', 'gps-signal-overlay', 'foto-fuera-rango-overlay', 'foto-desviado-overlay', 'foto-lejos-overlay', 'foto-perdido-overlay', 'gps-precision-overlay'];
      const porId = {};
      for (const id of ids) {
        let el = document.getElementById(id);
        let creado = false;
        if (!el) { el = document.createElement('div'); el.id = id; document.body.appendChild(el); creado = true; }
        porId[id] = z(el);
        if (creado) el.remove();
      }
      return { ventana: z(document.getElementById('avisos-dispositivo')), media: deClase('media-overlay'), ...porId };
    });
    expect(capas.ventana).toBe(1000008);
    for (const [capa, valor] of Object.entries(capas)) {
      if (capa !== 'ventana') expect(valor, `${capa} por encima de la ventana`).toBeGreaterThan(capas.ventana);
    }

    await page.evaluate(() => document.body.classList.add('loading'));
    expect((await ventana(page)).seVe, 'con body.loading no se ve').toBe(false);
    await page.evaluate(() => document.body.classList.remove('loading'));
    expect((await ventana(page)).seVe, 'sin body.loading vuelve a verse').toBe(true);
  });

  test('AD-5. La ayuda de hijo6 pinta sus imágenes en línea con la misma función, sin marcas a la vista', async ({ page }) => {
    // hijo6 en el marco vacío, como en el spec 172: el marco hace de padre y le manda PADRE_DATOS, con el que construye su ayuda.
    await page.goto('/tests/e2e/helpers/marco-vacio.html');
    await page.evaluate(() => new Promise((resolve) => {
      globalThis.__preparado = false;
      globalThis.addEventListener('message', (ev) => { if (ev.data?.tipo === 'SISTEMA.HIJO_PREPARADO') globalThis.__preparado = true; });
      const el = document.createElement('iframe');
      el.id = 'marco-hijo';
      el.src = '/chat-hijo6.html';
      el.addEventListener('load', () => resolve(), { once: true });
      document.body.appendChild(el);
    }));
    await expect.poll(() => page.evaluate(() => globalThis.__preparado === true), { timeout: 15_000 }).toBe(true);
    await page.evaluate(() => document.getElementById('marco-hijo').contentWindow.postMessage(
      { tipo: 'SISTEMA.PADRE_DATOS', origen: 'padre', destino: 'hijo6-chat', datos: { modo: 'casa', idioma: 'es', timestamp: Date.now() } },
      globalThis.location.origin));
    const ayuda = () => page.evaluate(() => {
      const doc = document.getElementById('marco-hijo').contentDocument;
      const imgs = [...doc.querySelectorAll('img.respuesta-imagen-inline')];
      return {
        imagenes: imgs.length,
        rutas: imgs.every((i) => /^imagenes\/imagenes-aplicación\/[^/]+\.png$/.test(decodeURIComponent(i.getAttribute('src')))),
        decorativas: imgs.every((i) => i.alt === ''),
        // Solo el texto que se pinta: el de los <script> y los <style> del body no se ve.
        marcasALaVista: (() => {
          let n = 0;
          const w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
          for (let t = w.nextNode(); t; t = w.nextNode()) {
            if (!t.parentElement.closest('script, style') && t.textContent.includes('{{IMG:')) n++;
          }
          return n;
        })(),
      };
    });
    await expect.poll(async () => (await ayuda()).imagenes, { timeout: 15_000, message: 'la ayuda tiene imágenes en línea' }).toBeGreaterThan(0);
    expect(await ayuda()).toMatchObject({ rutas: true, decorativas: true, marcasALaVista: 0 });
  });
});
