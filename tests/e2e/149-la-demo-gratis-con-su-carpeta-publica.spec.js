/**
 * 149 — La demo gratis lee lo suyo de la carpeta pública, y el resto de la app, de los originales (guía, §22.0 n.º 26 y
 * n.º 29; estudio, G-88 y K-126)
 *
 * POR QUE EXISTE
 *
 * Lo que enseña la demo gratis —la selección hasta el código, el vídeo de introducción y el puzzle de P6— vive dos veces:
 * el original, completo, en su carpeta (lo que irá al backend), y una copia de solo lo que enseña la demo en la carpeta
 * pública `publico/`, que hace `tools/build-demo.js`. La demo pide solo a `publico/`; el resto de la app, solo a los
 * originales. Con `PROTECT_DATA` el servidor protege los originales (`PROTECTED_FILES` de `js/server.js`).
 *
 *   DM-0  La lista de rutas protegidas del spec es la de `PROTECTED_FILES` de `js/server.js`.
 *   DM-1  En español, con todo lo protegido contestando 403: el puzzle de P6, el reto R-1 de P8, el paso a P10, los
 *         términos de P10, el audio y el texto de introducción de P11, la normativa de P15, el reto R-2 de P16 y los
 *         agradecimientos de P18 salen de `publico/`, y no se pide nada protegido.
 *   DM-2  En inglés (sin audio), igual: sale el aviso de P9, P11 enseña el texto sin reproductor y el R-2 sale.
 *   DM-3  Cada copia pública es la de su original, en las siete aventuras y los doce idiomas: los retos 1 y 2, el audio
 *         de introducción, si hay audio, el texto (el que monta `cargarTextos()` con los originales), el puzzle, los
 *         términos, la normativa, los agradecimientos y los textos de Jaime. Comparado en el navegador, sin el generador.
 *   DM-4  Con todo lo protegido en 403, las siete tarjetas de P7 y la de P9 llevan su foto de `publico/imagenes/`, el mapa
 *         que sale al elegir cada una de las siete aventuras en P7 es el de `publico/imagenes/mapas-vintage/`, y todo carga.
 *   DM-5  `video-intro.html` (P4) no nombra ninguna ruta protegida ni importa los textos de Jaime de `js/`; su foto, su
 *         mapa y su clip están en `publico/`; y su primer bocadillo es el texto público del idioma, con lo protegido en 403.
 *   DM-6  El resto de la app no apunta a `publico/`: ni los datos ni las páginas que no son de la demo. Cada mapa de la
 *         tabla está en su original (`imagenes/mapas-vintage/`) y en su copia pública.
 *   DM-7  `publico/` está al día: el generador no ve copias desfasadas, ficheros de más ni piezas que falten; y cada fichero
 *         de medios de `publico/` es idéntico, byte a byte, a su original (comparado aquí, sin el generador).
 *
 * ROJO ANTES QUE VERDE: con la demo leyendo `publico/demo-aventuras.js`, el R-2 de los retos de pago, los términos, la
 * normativa, los agradecimientos y los textos de Jaime de `js/`, y los datos de la app apuntando a `publico/`, caen todos
 * menos DM-0 (que vigila la lista) y DM-4.
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
  '/js/audios-aventuras.js', '/js/parrafos-textos/', '/audios-aventuras/', '/imagenes/imagenes-aventuras/', '/imagenes/mapas-vintage/',
  '/videos-aventuras/', '/backend/'];

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const aLaVista = (f) => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id));

/** Todo lo protegido contesta 403; devuelve la lista de lo protegido que se pidió. */
async function protegerConTodo(page) {
  const pedidos = [];
  await page.route('**/*', (route) => {
    const ruta = decodeURIComponent(new URL(route.request().url()).pathname);
    if (PROTEGIDOS.some((p) => ruta.startsWith(p))) {
      pedidos.push(ruta);
      return route.fulfill({ status: 403, contentType: 'application/json', body: '{"error":true,"codigo":"ACCESO_DENEGADO"}' });
    }
    return route.fallback();
  });
  return pedidos;
}

/** Arranca la app con todo lo protegido contestando 403, y devuelve la lista de lo protegido que se pidió. */
async function arrancarConProteccion(page) {
  const pedidos = await protegerConTodo(page);
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

/** Lo que la demo tiene que enseñar de una aventura en un idioma, leído de las copias públicas (en el frame de la selección). */
const esperadoPublico = (f, idioma, aventura) => f.evaluate(async ({ idioma, aventura }) => {
  const { LANG_ARCHIVO_PARRAFOS, ensamblarTexto } = await import('/js/data-loader.js');
  const carpeta = LANG_ARCHIVO_PARRAFOS[idioma];
  const leer = async (r) => { const x = await fetch(`/publico/${r}`); if (!x.ok) throw new Error(`${r}: ${x.status}`); return x.json(); };
  const [retos, audios, parrafos, intro, terminos, normativa, agradecimientos] = await Promise.all([
    leer(`retos/${carpeta}/retos.json`), leer(`audios/${carpeta}/audios.json`), leer(`textos/${carpeta}/parrafos.json`),
    leer('textos/intro.json'), leer(`textos/${carpeta}/terminos.json`), leer(`textos/${carpeta}/normativa.json`),
    leer(`textos/${carpeta}/agradecimientos.json`),
  ]);
  const audio = audios[aventura];
  const texto = ensamblarTexto(intro[aventura], idioma, new Map([[audio.intro.id, audio.intro]]), parrafos);
  return {
    carpeta, r1: retos[aventura].r1, r2: retos[aventura].r2, audio: audio.intro.file, texto: texto.content,
    terminos: terminos.html, normativa: normativa.html, agradecimientos: agradecimientos.html,
  };
}, { idioma, aventura });

/** Si el texto visible de un elemento es el de un HTML (el que deja el navegador al pintarlo). */
const textoIgual = (f, selector, html) => f.evaluate(({ selector, html }) => {
  const referencia = document.createElement('div');
  referencia.innerHTML = html;
  const visible = (document.querySelector(selector)?.textContent || '').trim();
  return visible.length > 0 && visible === referencia.textContent.trim();
}, { selector, html });

const textoDe = (f, selector) => f.evaluate((s) => document.querySelector(s)?.textContent || '', selector);

/** Las fotos de fondo de los elementos que casan con el selector: la ruta de cada una, tal como la pide el documento. */
const fotosDeFondo = (f, selector) => f.evaluate((s) => [...document.querySelectorAll(s)].map((el) => {
  const url = /url\(["']?([^"')]+)["']?\)/.exec(el.style.backgroundImage)?.[1];
  return url ? decodeURIComponent(new URL(url, location.href).pathname) : null;
}), selector);

/** Las rutas que no cargan como imagen (un 403 o un 404 dan error al cargar). */
const queNoCargan = (f, rutas) => f.evaluate((rs) => Promise.all(rs.map((r) => new Promise((ok) => {
  const img = new Image();
  img.onload = () => ok(null);
  img.onerror = () => ok(r);
  img.src = r;
}))).then((r) => r.filter(Boolean)), rutas);

test.describe('DM — la demo gratis con su carpeta pública', () => {
  test.use({ serviceWorkers: 'block' });

  test('DM-0. La lista de rutas protegidas es la de js/server.js', () => {
    const servidor = fs.readFileSync(path.join(RAIZ, 'js/server.js'), 'utf8');
    const bloque = /const PROTECTED_FILES = \[([\s\S]*?)\];/.exec(servidor)?.[1] ?? '';
    const lista = [...bloque.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(lista, 'PROTECTED_FILES de js/server.js').toEqual(PROTEGIDOS);
  });

  test('DM-1. En español, la demo saca de publico/ cada pieza, de P6 a P18, y no pide nada protegido', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; });
    const esperado = await esperadoPublico(f, 'es', 'Aventura1');
    expect(esperado.carpeta, 'la carpeta del español').toBe('espanol');
    expect(esperado.audio, 'el audio de la demo es la copia de publico/audios/espanol/').toMatch(/^publico\/audios\/espanol\/.+\.mp3$/);

    await f.evaluate(() => mostrar(6));
    await expect.poll(() => f.evaluate(() => document.getElementById('puzzle-iframe')?.getAttribute('src') || ''), { timeout: 10_000, message: 'P6: el puzzle de introducción' })
      .toContain('id=PZ-intro');
    await f.evaluate(() => mostrar(8));
    await expect.poll(() => textoDe(f, '#reto-r1-pregunta'), { timeout: 10_000, message: 'P8: el reto R-1' }).toBe(esperado.r1.pregunta);
    await f.evaluate(() => { void confirmarAventura(); });
    await expect.poll(() => aLaVista(f), { timeout: 10_000, message: 'P9: con audio en español se sigue a P10, sin aviso' }).toEqual(['pantalla10']);
    await expect.poll(() => textoIgual(f, '#terminos-contenido', esperado.terminos), { timeout: 10_000, message: 'P10: los términos' }).toBe(true);
    await f.evaluate(() => mostrar(11));
    await expect.poll(() => f.evaluate(() => document.getElementById('audio-intro-source')?.getAttribute('src') || ''), { timeout: 10_000, message: 'P11: el audio de introducción' })
      .toBe(esperado.audio);
    await expect.poll(() => textoIgual(f, '#texto-intro-contenido', esperado.texto), { timeout: 10_000, message: 'P11: el texto de introducción' }).toBe(true);
    await f.evaluate(() => { void cargarNormativaOverlay(); });
    await expect.poll(() => textoIgual(f, '#normativa-contenido', esperado.normativa), { timeout: 10_000, message: 'P15: la normativa' }).toBe(true);
    await f.evaluate(() => { void cargarRetoR2(); });
    await expect.poll(() => textoDe(f, '#reto-r2-pregunta'), { timeout: 10_000, message: 'P16: el reto R-2' }).toBe(esperado.r2.pregunta);
    await f.evaluate(() => { void cargarAgradecimientosOverlay(); });
    await expect.poll(() => textoIgual(f, '#agradecimientos-contenido', esperado.agradecimientos), { timeout: 10_000, message: 'P18: los agradecimientos' }).toBe(true);
    expect(pedidos, 'nada protegido').toEqual([]);
  });

  test('DM-2. En inglés (sin audio), el aviso sale, P11 enseña el texto sin reproductor y el R-2 sale de publico/', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    await f.evaluate(() => globalThis.seleccionarIdioma('en'));
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; });
    const esperado = await esperadoPublico(f, 'en', 'Aventura1');
    expect(esperado.audio, 'en inglés no hay audio de introducción').toBe('');
    await f.evaluate(() => mostrar(8));
    await expect.poll(() => textoDe(f, '#reto-r1-pregunta'), { timeout: 10_000, message: 'P8: el reto R-1' }).toBe(esperado.r1.pregunta);
    await f.evaluate(() => { void confirmarAventura(); });
    await expect.poll(() => f.evaluate(() => getComputedStyle(document.getElementById('audio-warning-overlay')).display), { timeout: 10_000, message: 'P9: sale el aviso sin audio' })
      .toBe('flex');
    await f.evaluate(() => document.getElementById('audio-warning-yes').closest('button').click());
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla10']);
    await f.evaluate(() => mostrar(11));
    await expect.poll(() => textoIgual(f, '#texto-intro-contenido', esperado.texto), { timeout: 10_000, message: 'P11: el texto de introducción' }).toBe(true);
    expect(await f.evaluate(() => getComputedStyle(document.getElementById('audio-player-container')).display), 'sin reproductor').toBe('none');
    await f.evaluate(() => { void cargarRetoR2(); });
    await expect.poll(() => textoDe(f, '#reto-r2-pregunta'), { timeout: 10_000, message: 'P16: el reto R-2' }).toBe(esperado.r2.pregunta);
    expect(pedidos, 'nada protegido').toEqual([]);
  });

  test('DM-3. Cada copia pública es la de su original, en las siete aventuras y los doce idiomas', async ({ page }) => {
    await page.route('**/__spec149.html', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>spec 149</title>' }));
    await page.goto('/__spec149.html');
    const problemas = await page.evaluate(async () => {
      const imp = (f) => import(`/js/${f}`);
      const { RETOS_AVENTURAS } = await imp('retos-aventuras.js');
      const { AUDIOS_AVENTURAS } = await imp('audios-aventuras.js');
      const { PUZZLES_AVENTURAS } = await imp('puzzles-aventuras.js');
      const { INDICE_AVENTURAS, MAPEO_IDIOMAS } = await imp('indice-aventuras.js');
      const { cargarTextos, ensamblarTexto, LANG_ARCHIVO_PARRAFOS } = await imp('data-loader.js');
      const { TERMINOS_AVENTURAS } = await imp('terminos-aventuras.js');
      const { NORMATIVA_CUMPLIMIENTO } = await imp('normativa-cumplimiento.js');
      const { AGRADECIMIENTOS_AVENTURAS } = await imp('agradecimientos-aventuras.js');
      const { JAIME_SCENES } = await imp('traducciones-ui.js');
      const leer = async (r) => { const x = await fetch(`/publico/${r}`); if (!x.ok) throw new Error(`${r}: ${x.status}`); return x.json(); };
      const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      const fallos = [];
      const puzzles = await leer('puzzles/puzzles.json');
      if (!igual(puzzles, { 'PZ-intro': PUZZLES_AVENTURAS.INTRO['puzzle.html'].puzzle_id.find((p) => p.id === 'PZ-intro') })) fallos.push('el puzzle');
      const intro = await leer('textos/intro.json');
      let vistas = 0;
      for (const i of Object.keys(MAPEO_IDIOMAS)) {
        const c = LANG_ARCHIVO_PARRAFOS[i];
        const [retos, audios, parrafos, terminos, normativa, agradecimientos, jaime] = await Promise.all(
          ['retos/' + c + '/retos.json', 'audios/' + c + '/audios.json', 'textos/' + c + '/parrafos.json', 'textos/' + c + '/terminos.json',
            'textos/' + c + '/normativa.json', 'textos/' + c + '/agradecimientos.json', 'textos/' + c + '/jaime.json'].map(leer));
        if (terminos.html !== TERMINOS_AVENTURAS.terminos_idiomas[i]) fallos.push(`${i}: los términos`);
        if (normativa.html !== NORMATIVA_CUMPLIMIENTO.normativa_idiomas[i]) fallos.push(`${i}: la normativa`);
        if (agradecimientos.html !== AGRADECIMIENTOS_AVENTURAS.agradecimientos_idiomas[i]) fallos.push(`${i}: los agradecimientos`);
        if (!igual(jaime.escenas, JAIME_SCENES.map((e) => (e === null ? null : e[i])))) fallos.push(`${i}: los textos de Jaime`);
        for (const a of Object.keys(INDICE_AVENTURAS)) {
          const originales = RETOS_AVENTURAS[a][i];
          if (!igual(retos[a].r1, originales.find((r) => r.reto === 1))) fallos.push(`${a}/${i}: el reto R-1`);
          if (!igual(retos[a].r2, originales.find((r) => r.reto === 2))) fallos.push(`${a}/${i}: el reto R-2`);
          const lista = AUDIOS_AVENTURAS[a][i];
          const e = lista.find((x) => x.id === `audio-intro-${i}`);
          const original = (e.file || '').trim();
          const copia = original ? `publico/audios/${c}/${original.split('/').pop()}` : '';
          if (!igual(audios[a].intro, { id: e.id, title: e.title, file: copia })) fallos.push(`${a}/${i}: el audio de introducción`);
          if (audios[a].tieneAudio !== lista.some((x) => x.file && x.file.trim() !== '')) fallos.push(`${a}/${i}: si tiene audio`);
          const publico = ensamblarTexto(intro[a], i, new Map([[audios[a].intro.id, audios[a].intro]]), parrafos);
          const delOriginal = (await cargarTextos(a, i)).find((t) => t.id === `txt-intro-${i}`);
          if (!igual(publico, delOriginal)) fallos.push(`${a}/${i}: el texto de introducción`);
          vistas++;
        }
      }
      if (vistas !== 84) fallos.push(`se han mirado ${vistas} combinaciones y son 84`);
      return fallos;
    });
    expect(problemas).toEqual([]);
  });

  test('DM-4. Las fotos de las tarjetas (P7 y P9) y el mapa de cada aventura (P7) salen de publico/ y cargan', async ({ page }) => {
    const pedidos = await arrancarConProteccion(page);
    const f = seleccion(page);
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
    await f.evaluate(() => mostrar(7));
    await expect.poll(() => f.evaluate(() => document.querySelectorAll('#aventuras-dinamicas button').length), { timeout: 10_000, message: 'P7: las siete aventuras' })
      .toBe(7);
    const fotos = await fotosDeFondo(f, '#aventuras-dinamicas button');
    expect(fotos.filter((r) => !r?.startsWith('/publico/imagenes/')), 'P7: fotos fuera de publico/imagenes/').toEqual([]);
    expect(new Set(fotos).size, 'P7: una foto distinta por aventura').toBe(7);
    expect(await queNoCargan(f, fotos), 'P7: fotos que no cargan').toEqual([]);
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; mostrar(9); });
    await expect.poll(() => fotosDeFondo(f, '#pantalla9 .aventura-confirmacion-card'), { timeout: 10_000, message: 'P9: la tarjeta lleva la foto de la aventura' })
      .toEqual([fotos[0]]);
    // El mapa que sale al elegir cada aventura en P7, por la función de verdad (`mostrarMapaVintage()`).
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
    expect(mapas.filter((r) => !r?.startsWith('/publico/imagenes/mapas-vintage/')), 'P7: mapas fuera de publico/imagenes/mapas-vintage/').toEqual([]);
    expect(await queNoCargan(f, mapas), 'P7: mapas que no cargan').toEqual([]);
    expect(pedidos, 'nada protegido').toEqual([]);
  });

  test('DM-5. video-intro.html (P4) lo saca todo de publico/, también el texto de Jaime', async ({ page }) => {
    const html = fs.readFileSync(path.join(RAIZ, 'video-intro.html'), 'utf8');
    // Una ruta es una cadena entre comillas que empieza por ella (`'publico/imagenes/mapas-vintage/'` no es la protegida).
    const pideRuta = (texto, ruta) => new RegExp(`['"\`]/?${ruta.replace(/^\//, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(texto);
    expect(PROTEGIDOS.filter((p) => pideRuta(html, p)), 'rutas protegidas que pide video-intro.html').toEqual([]);
    expect(/import\s*\{[^}]*\bJAIME_SCENES\b/.test(html), 'los textos de Jaime no se importan de js/').toBe(false);
    const carpeta = (nombre) => new RegExp(`^const ${nombre} = '([^']+)';`, 'm').exec(html)?.[1];
    const video = carpeta('VIDEO_INTRO_SRC');
    const fotos = [...html.matchAll(/\$\{IM\}([^"'`]+)/g)].map((m) => carpeta('IM') + m[1]);
    const mapas = [...html.matchAll(/\$\{MV\}([^"'`]+)/g)].map((m) => carpeta('MV') + m[1]);
    expect(fotos, 'la foto de las Torres de Serranos, la única').toHaveLength(1);
    expect(mapas.length, 'el mapa de la Aventura 1, en sus dos escenas').toBe(2);
    for (const r of [...fotos, ...mapas, video]) {
      expect(r, `${r}: en la carpeta pública`).toMatch(/^publico\/(imagenes|videos)\//);
      expect(fs.existsSync(path.join(RAIZ, r)), `${r}: existe`).toBe(true);
    }

    // Y en marcha: el primer bocadillo, en inglés, es el texto público del idioma, sin pedir nada protegido.
    const pedidos = await protegerConTodo(page);
    await stubCDNResources(page);
    await page.goto('/video-intro.html?lang=en');
    const esperado = JSON.parse(fs.readFileSync(path.join(RAIZ, 'publico/textos/ingles/jaime.json'), 'utf8')).escenas[0];
    expect(typeof esperado === 'string' && esperado.length > 0, 'el texto público del primer bocadillo').toBe(true);
    const bocadillo = await page.evaluate(async () => {
      await _textosJaimeListos;
      showBubble(0);
      return document.getElementById('jaime-band-text').textContent;
    });
    expect(bocadillo, 'el primer bocadillo, del texto público').toBe(esperado);
    expect(pedidos, 'nada protegido').toEqual([]);
  });

  test('DM-6. El resto de la app no apunta a publico/, y cada mapa está en su original y en su copia', () => {
    const datos = ['js/coordenadas-aventuras.js', 'js/textos-aventuras.js', 'js/retos-aventuras.js', 'js/puzzles-aventuras.js',
      'js/audios-aventuras.js', 'js/mapa-vintage-aventuras.js', 'js/terminos-aventuras.js', 'js/normativa-cumplimiento.js',
      'js/agradecimientos-aventuras.js', 'js/traducciones-ui.js'];
    const paginas = ['codigo-padre.html', 'extrainfo-hijo1.html', 'coordenadas-hijo2.html', 'audio-hijo3.html', 'retos-hijo4.html',
      'boton-casa-hijo5.html', 'chat-hijo6.html', 'mapa-completo.html', 'index.html', 'consejos-valencia.html', 'gastronomia.html',
      'paginas-oficiales-valencia.html', 'videos-valencia-historica.html'];
    // Una ruta es una cadena entre comillas que empieza por publico/ (un comentario que la nombra no la pide).
    const apuntanAPublico = [...datos, ...paginas].filter((r) => /['"`]\/?publico\//.test(fs.readFileSync(path.join(RAIZ, r), 'utf8')));
    expect(apuntanAPublico, 'fuera de la demo, nadie apunta a publico/').toEqual([]);

    const tabla = fs.readFileSync(path.join(RAIZ, 'js/mapa-vintage-aventuras.js'), 'utf8').replace(/\r\n/g, '\n');
    const mapas = tabla.split('\n').filter((l) => /^\s*\w+:\s*'/.test(l)).map((l) => /'([^']+)'/.exec(l)[1]);
    expect(mapas.length, 'un mapa por aventura, las siete').toBe(7);
    for (const r of mapas) {
      expect(r, `${r}: el original`).toMatch(/^imagenes\/mapas-vintage\//);
      expect(fs.existsSync(path.join(RAIZ, r)), `${r}: existe`).toBe(true);
      expect(fs.existsSync(path.join(RAIZ, 'publico/imagenes/mapas-vintage', path.basename(r))), `${r}: su copia pública existe`).toBe(true);
    }
  });

  test('DM-7. publico/ está al día con sus originales, sin ficheros de más', async () => {
    const { revisarPublico } = require('../../tools/build-demo.js');
    const r = await revisarPublico();
    expect({ faltas: r.faltas, desfasados: r.desfasados, copiasMal: r.copiasMal, sobran: r.sobran }, 'lo que dice el generador')
      .toEqual({ faltas: [], desfasados: [], copiasMal: [], sobran: [] });

    // Y sin el generador: cada fichero de medios de publico/ es idéntico a su original, que está en la carpeta de su tipo.
    const ORIGEN = [
      [/^publico\/imagenes\/mapas-vintage\/([^/]+)$/, 'imagenes/mapas-vintage/'],
      [/^publico\/imagenes\/([^/]+)$/, 'imagenes/imagenes-aventuras/'],
      [/^publico\/videos\/([^/]+)$/, 'videos-aventuras/'],
      [/^publico\/audios\/[^/]+\/([^/]+\.mp3)$/, 'audios-aventuras/español/'],
    ];
    const medios = [];
    (function recorrer(rel) {
      for (const e of fs.readdirSync(path.join(RAIZ, rel), { withFileTypes: true })) {
        const r = `${rel}/${e.name}`;
        if (e.isDirectory()) recorrer(r);
        else if (!r.endsWith('.json')) medios.push(r);
      }
    })('publico');
    expect(medios.length, 'hay ficheros de medios en publico/').toBeGreaterThan(0);
    const distintos = medios.filter((r) => {
      const regla = ORIGEN.find(([re]) => re.test(r));
      if (!regla) return true;
      const original = path.join(RAIZ, regla[1], regla[0].exec(r)[1]);
      return !fs.existsSync(original) || !fs.readFileSync(original).equals(fs.readFileSync(path.join(RAIZ, r)));
    });
    expect(distintos, 'ficheros de medios de publico/ sin original idéntico').toEqual([]);
  });
});
