/**
 * 149 — La demo gratis lee lo suyo de la carpeta pública (guía, §22.0 n.º 26 y n.º 29; estudio, G-88 y K-126)
 *
 * POR QUE EXISTE
 *
 * La demo gratis (de P2 a P11, antes del pago, y P13, tras el pago y antes del código) usa cinco piezas de datos de cada
 * aventura: el puzzle de introducción (P6), el reto R-1 (P8), si la aventura tiene audio en el idioma (P9) y el audio y el
 * texto de introducción (P11). Enseña además una foto por aventura en su tarjeta (P7, P9 y P13), el mapa antiguo de la
 * aventura al elegirla (P7) y, en `video-intro.html` (P4), una foto, el mapa antiguo de la Aventura 1 y un vídeo. Todo eso
 * vive en la carpeta pública `publico/`: los datos en `publico/demo-aventuras.js`, que genera `tools/build-demo.js` a partir
 * de los ficheros de datos, el audio en `publico/audios/`, las fotos en `publico/imagenes/`, los mapas antiguos en
 * `publico/imagenes/mapas-vintage/` y el vídeo en `publico/videos/`. La demo no pide nada de lo que el servidor protege con
 * `PROTECT_DATA` (`PROTECTED_FILES` de `js/server.js`).
 *
 *   DM-0  La lista de rutas protegidas de este spec es la de `PROTECTED_FILES` de `js/server.js`.
 *   DM-1  Con todo lo protegido contestando 403, la demo funciona entera en español (con audio) y no pide nada protegido:
 *         el puzzle, el reto R-1, el paso a P10 y el audio y el texto de introducción.
 *   DM-2  Lo mismo en inglés (sin audio): sale el aviso, se sigue sin audio y P11 enseña el texto sin reproductor.
 *   DM-3  Cada pieza de `publico/demo-aventuras.js` es la que dan los datos, en las siete aventuras y los doce idiomas: el
 *         reto R-1, el audio de introducción, si hay audio, el texto (el mismo que monta `cargarTextos()`) y el puzzle.
 *   DM-4  Con todo lo protegido contestando 403, las siete tarjetas de P7 y la de P9 llevan su foto de `publico/imagenes/`,
 *         y las siete fotos cargan; y el mapa antiguo que sale al elegir cada una de las siete aventuras en P7 sale de
 *         `publico/imagenes/mapas-vintage/` y carga.
 *   DM-5  `video-intro.html` (P4) no nombra ninguna ruta protegida, y su foto, su mapa antiguo y su vídeo están en la
 *         carpeta pública.
 *   DM-6  Cada mapa de la tabla `js/mapa-vintage-aventuras.js` (la misma que usa el contenido de pago) está en
 *         `publico/imagenes/mapas-vintage/` y existe.
 *
 * ROJO ANTES QUE VERDE: con los ficheros de la demo en `js/` y `audios-demo/`, y las fotos y el vídeo en las carpetas de las
 * aventuras, caen DM-1 y DM-2 (la demo, el audio), DM-3 (no encuentra el fichero), DM-4 (las fotos, protegidas) y DM-5.
 * Con los mapas antiguos en `imagenes/imagenes-mapas-vintage/` caen DM-4, DM-5 y DM-6. DM-0 vigila la lista.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const RAIZ = path.join(__dirname, '../..');
const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Las rutas protegidas de js/server.js (DM-0 lo comprueba): todas contestan 403 en los recorridos de este spec.
const PROTEGIDOS = ['/js/coordenadas-aventuras.js', '/js/textos-aventuras.js', '/js/retos-aventuras.js', '/js/puzzles-aventuras.js',
  '/js/audios-aventuras.js', '/js/parrafos-textos/', '/audios-aventuras/', '/imagenes/imagenes-aventuras/', '/videos-aventuras/', '/backend/'];

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const aLaVista = (f) => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id));

/** Arranca la app con todo lo protegido contestando 403, y devuelve la lista de lo protegido que se pidió. */
async function arrancarConProteccion(page) {
  const pedidos = [];
  await page.route('**/*', (route) => {
    const ruta = decodeURIComponent(new URL(route.request().url()).pathname);
    if (PROTEGIDOS.some((p) => ruta.startsWith(p))) {
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
    const { DEMO_AVENTURAS } = await import('/publico/demo-aventuras.js');
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

/** Las fotos de fondo de los elementos que casan con el selector: la ruta de cada una, tal como la pide el documento. */
const fotosDeFondo = (f, selector) => f.evaluate((s) => [...document.querySelectorAll(s)].map((el) => {
  const url = /url\(["']?([^"')]+)["']?\)/.exec(el.style.backgroundImage)?.[1];
  return url ? decodeURIComponent(new URL(url, location.href).pathname) : null;
}), selector);

test.describe('DM — la demo gratis con su carpeta pública', () => {
  test.use({ serviceWorkers: 'block' });

  test('DM-0. La lista de rutas protegidas es la de js/server.js', () => {
    const servidor = fs.readFileSync(path.join(RAIZ, 'js/server.js'), 'utf8');
    const bloque = /const PROTECTED_FILES = \[([\s\S]*?)\];/.exec(servidor)?.[1] ?? '';
    const lista = [...bloque.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(lista, 'PROTECTED_FILES de js/server.js').toEqual(PROTEGIDOS);
  });

  test('DM-1. En español, la demo funciona entera sin pedir nada protegido', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    const esperado = await puzzleYRetoR1(f, 'es');
    await f.evaluate(() => { void confirmarAventura(); });
    await expect.poll(() => aLaVista(f), { timeout: 10_000, message: 'P9: con audio en español se sigue a P10, sin aviso' }).toEqual(['pantalla10']);
    await f.evaluate(() => mostrar(11));
    await expect.poll(() => f.evaluate(() => document.getElementById('audio-intro-source')?.getAttribute('src') || ''), { timeout: 10_000, message: 'P11: el audio de introducción, de la carpeta pública' })
      .toBe(esperado.audio);
    expect(esperado.audio, 'el audio de la demo está en publico/audios/').toMatch(/^publico\/audios\//);
    await expect.poll(() => textoIntroEnPantalla(f, esperado.texto), { timeout: 10_000, message: 'P11: el texto de introducción' }).toBe(true);
    expect(pedidos, 'nada protegido').toEqual([]);
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
    expect(pedidos, 'nada protegido').toEqual([]);
  });

  test('DM-3. Cada pieza de la demo es la que dan los datos, en las siete aventuras y los doce idiomas', async ({ page }) => {
    await page.route('**/__spec149.html', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>spec 149</title>' }));
    await page.goto('/__spec149.html');
    const problemas = await page.evaluate(async () => {
      const imp = (f) => import(`/js/${f}`);
      const { DEMO_AVENTURAS: demo } = await import('/publico/demo-aventuras.js');
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

  test('DM-4. Las fotos de las tarjetas de P7 y P9, y los mapas antiguos de P7, salen de la carpeta pública y cargan', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
    await f.evaluate(() => mostrar(7));
    await expect.poll(() => f.evaluate(() => document.querySelectorAll('#aventuras-dinamicas button').length), { timeout: 10_000, message: 'P7: las siete aventuras' })
      .toBe(7);
    const fotosP7 = await fotosDeFondo(f, '#aventuras-dinamicas button');
    expect(fotosP7.filter((r) => !r?.startsWith('/publico/imagenes/')), 'P7: fotos fuera de publico/imagenes/').toEqual([]);
    expect(new Set(fotosP7).size, 'P7: una foto distinta por aventura').toBe(7);
    // Que carguen: una ruta protegida contesta 403 y una que no existe, 404; las dos dan error al cargar la imagen.
    const sinCargar = await f.evaluate((rutas) => Promise.all(rutas.map((r) => new Promise((ok) => {
      const img = new Image();
      img.onload = () => ok(null);
      img.onerror = () => ok(r);
      img.src = r;
    }))).then((r) => r.filter(Boolean)), fotosP7);
    expect(sinCargar, 'P7: fotos que no cargan').toEqual([]);
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; mostrar(9); });
    await expect.poll(() => fotosDeFondo(f, '#pantalla9 .aventura-confirmacion-card'), { timeout: 10_000, message: 'P9: la tarjeta lleva la foto de la aventura' })
      .toEqual([fotosP7[0]]);
    // El mapa antiguo que sale al elegir cada aventura en P7, por la función de verdad (`mostrarMapaVintage()`).
    const mapas = await f.evaluate(async () => {
      const rutas = [];
      for (const a of ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5', 'AventuraFallas', 'Aventura34km']) {
        aventuraSeleccionada = a;
        await mostrarMapaVintage();
        const src = document.getElementById('mapa-vintage-img').getAttribute('src') || '';
        rutas.push(src ? decodeURIComponent(new URL(src, location.href).pathname) : null);
      }
      return rutas;
    });
    expect(mapas.filter((r) => !r?.startsWith('/publico/imagenes/mapas-vintage/')), 'P7: mapas antiguos fuera de publico/imagenes/mapas-vintage/').toEqual([]);
    const mapasSinCargar = await f.evaluate((rutas) => Promise.all(rutas.map((r) => new Promise((ok) => {
      const img = new Image();
      img.onload = () => ok(null);
      img.onerror = () => ok(r);
      img.src = r;
    }))).then((r) => r.filter(Boolean)), mapas);
    expect(mapasSinCargar, 'P7: mapas antiguos que no cargan').toEqual([]);
    expect(pedidos, 'nada protegido').toEqual([]);
  });

  test('DM-5. video-intro.html (P4) no nombra ninguna ruta protegida, y su foto, su mapa antiguo y su vídeo están en la carpeta pública', () => {
    const html = fs.readFileSync(path.join(RAIZ, 'video-intro.html'), 'utf8');
    expect(PROTEGIDOS.filter((p) => html.includes(p.slice(1))), 'rutas protegidas que nombra video-intro.html').toEqual([]);
    const carpetaFotos = /^const IM = '([^']+)';/m.exec(html)?.[1];
    const video = /^const VIDEO_INTRO_SRC = '([^']+)';/m.exec(html)?.[1];
    const fotos = [...html.matchAll(/\$\{IM\}([^"'`]+)/g)].map((m) => carpetaFotos + m[1]);
    expect(fotos, 'la foto de las Torres de Serranos, la única').toHaveLength(1);
    const carpetaMapas = /^const MV = '([^']+)';/m.exec(html)?.[1];
    const mapas = [...html.matchAll(/\$\{MV\}([^"'`]+)/g)].map((m) => carpetaMapas + m[1]);
    expect(mapas.length, 'el mapa antiguo de la Aventura 1, en sus dos escenas').toBe(2);
    for (const r of [...fotos, ...mapas, video]) {
      expect(r, `${r}: en la carpeta pública`).toMatch(/^publico\/(imagenes|videos)\//);
      expect(fs.existsSync(path.join(RAIZ, r)), `${r}: existe`).toBe(true);
    }
  });

  test('DM-6. Cada mapa de la tabla de mapas antiguos está en la carpeta pública y existe', () => {
    const tabla = fs.readFileSync(path.join(RAIZ, 'js/mapa-vintage-aventuras.js'), 'utf8').replace(/\r\n/g, '\n');
    // Las entradas vivas de MAPAS_VINTAGE (una línea comentada, de una aventura sin mapa, no contaría).
    const lineas = tabla.split('\n').filter((l) => /^\s*\w+:\s*'/.test(l));
    const mapas = lineas.map((l) => /'([^']+)'/.exec(l)[1]);
    expect(mapas.length, 'una entrada por aventura, las siete').toBe(7);
    for (const r of mapas) {
      expect(r, `${r}: en la carpeta pública`).toMatch(/^publico\/imagenes\/mapas-vintage\//);
      expect(fs.existsSync(path.join(RAIZ, r)), `${r}: existe`).toBe(true);
    }
  });
});
