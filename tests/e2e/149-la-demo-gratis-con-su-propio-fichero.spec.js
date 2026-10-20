/**
 * 149 — La demo gratis lee lo suyo de su propio fichero público (guía, §22.0 n.º 26; estudio, G-88)
 *
 * POR QUE EXISTE
 *
 * La demo gratis (de P2 a P11, antes del pago) usa cinco piezas de cada aventura: el puzzle de introducción (P6), el reto
 * R-1 (P8), si la aventura tiene audio en el idioma (P9) y el audio y el texto de introducción (P11). Las lee de
 * `js/demo-aventuras.js`, que genera `tools/build-demo.js` a partir de los ficheros de datos, y no carga los ficheros de pago,
 * que el servidor protege con `PROTECT_DATA` (`PROTECTED_FILES` de `js/server.js`). El audio de introducción vive en la
 * carpeta pública `audios-demo/`.
 *
 *   DM-0  La lista de rutas protegidas de este spec es la de `PROTECTED_FILES` de `js/server.js`.
 *   DM-1  Con los ficheros de datos de pago contestando 403, la demo funciona entera en español (con audio) y no pide
 *         ninguno: el puzzle, el reto R-1, el paso a P10 y el audio y el texto de introducción.
 *   DM-2  Lo mismo en inglés (sin audio): sale el aviso, se sigue sin audio y P11 enseña el texto sin reproductor.
 *   DM-3  Cada pieza de `js/demo-aventuras.js` es la que dan los datos, en las siete aventuras y los doce idiomas: el reto
 *         R-1, el audio de introducción, si hay audio, el texto (el mismo que monta `cargarTextos()`) y el puzzle.
 *
 * Las fotos que la demo enseña de la carpeta de imágenes de las aventuras (las tarjetas de P7 y P9 y una del vídeo de
 * introducción) quedan fuera de este spec: su sitio está pendiente de decidir.
 *
 * ROJO ANTES QUE VERDE: con la selección anterior caen DM-1 y DM-2 (pedía los ficheros de pago: el reto R-1 y el texto no
 * llegaban). DM-0 vigila la lista; DM-3 no tiene «antes», porque el fichero de la demo es nuevo.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Las rutas protegidas de js/server.js (DM-0 lo comprueba). Las imágenes de las aventuras se dejan pasar: ver la cabecera.
const PROTEGIDOS = ['/js/coordenadas-aventuras.js', '/js/textos-aventuras.js', '/js/retos-aventuras.js', '/js/puzzles-aventuras.js',
  '/js/audios-aventuras.js', '/js/parrafos-textos/', '/audios-aventuras/', '/imagenes/imagenes-aventuras/', '/videos-aventuras/', '/backend/'];
const BLOQUEADOS = PROTEGIDOS.filter((p) => p !== '/imagenes/imagenes-aventuras/');

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const aLaVista = (f) => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id));

/** Arranca la app con los ficheros de datos de pago contestando 403, y devuelve la lista de los que se pidieron. */
async function arrancarConProteccion(page) {
  const pedidos = [];
  await page.route('**/*', (route) => {
    const ruta = decodeURIComponent(new URL(route.request().url()).pathname);
    if (BLOQUEADOS.some((p) => ruta.startsWith(p))) {
      pedidos.push(ruta);
      return route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":true,"codigo":"ACCESO_DENEGADO"}' });
    }
    return route.fallback();
  });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 20_000 },
  );
  return pedidos;
}

/** Elige idioma (P2) y aventura como el usuario, y recorre P6 y P8; devuelve lo esperado de la demo para comprobarlo. */
async function puzzleYRetoR1(f, idioma) {
  await f.evaluate((i) => globalThis.seleccionarIdioma(i), idioma);
  await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
  const esperado = await f.evaluate(async (i) => {
    aventuraSeleccionada = 'Aventura1';
    const { DEMO_AVENTURAS } = await import('/js/demo-aventuras.js');
    const p = DEMO_AVENTURAS.aventuras.Aventura1[i];
    return { pregunta: p.retoR1.pregunta, audio: p.audioIntro?.file ?? null, texto: DEMO_AVENTURAS.textosIntro[i][p.textoIntro].content };
  }, idioma);
  await f.evaluate(() => mostrar(6));
  await expect.poll(() => f.evaluate(() => document.getElementById('puzzle-iframe')?.getAttribute('src') || ''), { timeout: 10_000, message: 'P6: el puzzle de introducción carga' })
    .toContain('id=PZ-intro');
  await f.evaluate(() => mostrar(8));
  await expect.poll(() => f.evaluate(() => document.getElementById('reto-r1-pregunta')?.textContent || ''), { timeout: 10_000, message: 'P8: el reto R-1 sale' })
    .toBe(esperado.pregunta);
  expect(await f.evaluate(() => document.querySelectorAll('input[name="reto-r1"]').length), 'P8: con sus opciones').toBeGreaterThanOrEqual(2);
  return esperado;
}

/** P11: si el texto de introducción en pantalla es el de la demo (su texto visible, el que deja el HTML en el navegador). */
const textoIntroEnPantalla = (f, html) => f.evaluate((h) => {
  const referencia = document.createElement('div');
  referencia.innerHTML = h;
  const visible = (document.getElementById('texto-intro-contenido')?.textContent || '').trim();
  return visible.length > 0 && visible === referencia.textContent.trim();
}, html);

test.describe('DM — la demo gratis con su propio fichero', () => {
  test.use({ serviceWorkers: 'block' });

  test('DM-0. La lista de rutas protegidas es la de js/server.js', () => {
    const servidor = fs.readFileSync(path.join(__dirname, '../../js/server.js'), 'utf8');
    const bloque = /const PROTECTED_FILES = \[([\s\S]*?)\];/.exec(servidor)?.[1] ?? '';
    const lista = [...bloque.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(lista, 'PROTECTED_FILES de js/server.js').toEqual(PROTEGIDOS);
  });

  test('DM-1. En español, la demo funciona entera sin pedir ningún fichero de pago', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    const esperado = await puzzleYRetoR1(f, 'es');
    await f.evaluate(() => { void confirmarAventura(); });
    await expect.poll(() => aLaVista(f), { timeout: 10_000, message: 'P9: con audio en español se sigue a P10, sin aviso' }).toEqual(['pantalla10']);
    await f.evaluate(() => mostrar(11));
    await expect.poll(() => f.evaluate(() => document.getElementById('audio-intro-source')?.getAttribute('src') || ''), { timeout: 10_000, message: 'P11: el audio de introducción, de la carpeta pública' })
      .toBe(esperado.audio);
    expect(esperado.audio, 'el audio de la demo está en audios-demo/').toMatch(/^audios-demo\//);
    await expect.poll(() => textoIntroEnPantalla(f, esperado.texto), { timeout: 10_000, message: 'P11: el texto de introducción' }).toBe(true);
    expect(pedidos, 'ningún fichero de datos de pago').toEqual([]);
  });

  test('DM-2. En inglés (sin audio), el aviso sale, se sigue sin audio y P11 enseña el texto', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    const esperado = await puzzleYRetoR1(f, 'en');
    expect(esperado.audio, 'en inglés no hay audio de introducción').toBeNull();
    await f.evaluate(() => { void confirmarAventura(); });
    await expect.poll(() => f.evaluate(() => getComputedStyle(document.getElementById('audio-warning-overlay')).display), { timeout: 10_000, message: 'P9: sale el aviso sin audio' })
      .toBe('flex');
    await f.evaluate(() => document.getElementById('audio-warning-yes').closest('button').click());
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla10']);
    await f.evaluate(() => mostrar(11));
    await expect.poll(() => textoIntroEnPantalla(f, esperado.texto), { timeout: 10_000, message: 'P11: el texto de introducción' }).toBe(true);
    expect(await f.evaluate(() => getComputedStyle(document.getElementById('audio-player-container')).display), 'sin reproductor').toBe('none');
    expect(pedidos, 'ningún fichero de datos de pago').toEqual([]);
  });

  test('DM-3. Cada pieza de la demo es la que dan los datos, en las siete aventuras y los doce idiomas', async ({ page }) => {
    await page.route('**/__spec149.html', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>spec 149</title>' }));
    await page.goto('/__spec149.html');
    const problemas = await page.evaluate(async () => {
      const imp = (f) => import(`/js/${f}`);
      const { DEMO_AVENTURAS: demo } = await imp('demo-aventuras.js');
      const { RETOS_AVENTURAS } = await imp('retos-aventuras.js');
      const { AUDIOS_AVENTURAS } = await imp('audios-aventuras.js');
      const { PUZZLES_AVENTURAS } = await imp('puzzles-aventuras.js');
      const { INDICE_AVENTURAS, MAPEO_IDIOMAS } = await imp('indice-aventuras.js');
      const { cargarTextos } = await imp('data-loader.js');
      const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      const fallos = [];
      if (!igual(demo.puzzleIntro, PUZZLES_AVENTURAS.INTRO['puzzle.html'].puzzle_id.find((p) => p.id === 'PZ-intro'))) fallos.push('puzzleIntro');
      let vistas = 0;
      for (const a of Object.keys(INDICE_AVENTURAS)) {
        for (const i of Object.keys(MAPEO_IDIOMAS)) {
          const p = demo.aventuras?.[a]?.[i];
          if (!p) { fallos.push(`${a}/${i}: no está en la demo`); continue; }
          const audios = AUDIOS_AVENTURAS[a][i];
          if (!igual(p.retoR1, RETOS_AVENTURAS[a][i].find((r) => r.reto === 1))) fallos.push(`${a}/${i}: retoR1`);
          const intro = audios.find((x) => x.id === `audio-intro-${i}`);
          const audioEsperado = intro && intro.file && intro.file.trim() ? { id: intro.id, title: intro.title, file: intro.file } : null;
          if (!igual(p.audioIntro, audioEsperado)) fallos.push(`${a}/${i}: audioIntro`);
          if (p.tieneAudio !== audios.some((x) => x.file && x.file.trim() !== '')) fallos.push(`${a}/${i}: tieneAudio`);
          const texto = (await cargarTextos(a, i)).find((t) => t.id === `txt-intro-${i}`);
          if (!igual(demo.textosIntro[i]?.[p.textoIntro], texto)) fallos.push(`${a}/${i}: textoIntro`);
          vistas++;
        }
      }
      if (vistas !== 84) fallos.push(`se han mirado ${vistas} combinaciones y son 84`);
      return fallos;
    });
    expect(problemas).toEqual([]);
  });
});
