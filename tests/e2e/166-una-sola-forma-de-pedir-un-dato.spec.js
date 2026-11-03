/**
 * 166 — Una sola forma de pedir un dato: el mismo plazo y los mismos reintentos para todo lo que la app descarga (K-175, M1)
 *
 * POR QUE EXISTE
 *
 * Cada pieza de la app pedía sus datos a su manera: `fetchWithRetry` la API, `data-loader.js` sus módulos con `import()` y
 * sus párrafos y la API con su propio `fetch`, la selección los textos de la demo con `_leerPublico` y video-intro los de
 * Jaime con otro `fetch`. Solo el primero tenía plazo y reintentos, y con dos huecos medidos (guía §16.1b): el plazo
 * agotado no se reintentaba, y en WebKit tampoco el fallo de red, porque el filtro miraba el texto del error. El plazo,
 * además, solo cubría hasta las cabeceras. Y un `import()` que falla queda recordado por el navegador: el mismo `import()`
 * no se vuelve a pedir en ese documento (medido en los tres motores, sonda de K-176).
 *
 *   PD-0  Lo que la dice en el código: los `fetch(` de la app están solo donde tienen que estar (cada uno con su motivo);
 *         ningún `import()` de un módulo de datos que no pase por `importarConReintentos`, salvo el `import` estático de
 *         Script 1 del padre; `data-loader.js` sin `import` estático (build-demo lo lee como módulo `data:`, guía §21.1),
 *         sin `fetchFromAPI` ni `validarRespuesta`; `ApiClient.getTextos`; y el plazo y los reintentos en un solo sitio.
 *   PD-1  El núcleo, `pedirConReintentos` (js/utils.js): reintenta el fallo de red, el plazo vencido y un 5xx, y no un 4xx
 *         ni un error de formato; la espera crece (base, 2×, 4×…), un 429 espera lo que diga, y el intento recibe una señal
 *         que se aborta al vencer su plazo.
 *   PD-2  `fetchWithRetry` reintenta el fallo de red en los cuatro navegadores.
 *   PD-3  `fetchWithRetry` reintenta la petición que no contesta: a los 15 s, otro intento.
 *   PD-4  `fetchWithRetry`: el plazo cubre también el cuerpo (llegan las cabeceras y el cuerpo se queda a medias).
 *   PD-5  `fetchWithRetry`: un 503 se reintenta, un 404 no, y un 429 espera su `Retry-After`.
 *   PD-6  `data-loader.js` en local: el `import()` de un módulo de datos se reintenta con otra dirección (`?_v=…`), y un fallo
 *         no queda recordado para la siguiente vez que se pide.
 *   PD-7  La selección: un reto de la demo cuya descarga falla dos veces llega al tercer intento.
 *   PD-8  `data-loader.js` con servidor: va por `ApiClient` (un 503 se reintenta y la respuesta vale sin `exito`), y los textos
 *         por `getTextos`.
 *
 * ROJO ANTES QUE VERDE: con las cinco formas de pedir, cae todo salvo el control de PD-5 (el 404 no se reintenta) y PD-2 en
 * chromium y firefox (su texto de error sí contiene «fetch»); PD-2 cae en webkit.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const L = require('../../tools/lib/analisis-js');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
const { BASE_URL_RED_CONTROLADA, abrirRedControlada } = require('./helpers/red-controlada');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PAGINA = '/__spec166.html';

/** Una página en blanco del mismo origen, con el almacén del dispositivo (lo lee el `TokenManager` de api-client.js). */
async function paginaEnBlanco(page) {
  await page.route(`**${PAGINA}`, (route) => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><meta charset="utf-8"><title>spec 166</title><script src="/js/almacenamiento.js"></script>',
  }));
  await page.goto(PAGINA);
}

/** Cada petición que casa con el patrón, en orden: su URL, sus cabeceras y el instante en que llegó. */
function apuntar(page, patron, responder) {
  const pedidas = [];
  return page.route(patron, (route) => {
    const req = route.request();
    pedidas.push({ url: req.url(), cabeceras: req.headers(), t: Date.now() });
    return responder(route, pedidas.length);
  }).then(() => pedidas);
}

const json = (cuerpo, estado = 200, cabeceras = {}) => ({ status: estado, contentType: 'application/json', headers: cabeceras, body: JSON.stringify(cuerpo) });

const dataLoaderTexto = () => L.textoSinComentarios('js/data-loader.js').texto;

test.describe('PD — una sola forma de pedir un dato', () => {
  test.use({ serviceWorkers: 'block' });

  test('PD-0. Lo dice el código: un solo camino para pedir, sin fetch ni import() de datos sueltos', () => {
    const ficheros = [...L.paginas(), ...L.modulos()];
    const fetchs = {};
    const importsDirectos = [];
    const conReintentos = {};
    const sinParsear = [];
    for (const rel of ficheros) {
      const { texto, sinParsear: s } = L.textoSinComentarios(rel);
      sinParsear.push(...s);
      const nFetch = (texto.match(/\bfetch\(/g) || []).length;
      if (nFetch) fetchs[rel] = nFetch;
      for (const m of texto.matchAll(/\bimport\(\s*['"`][^'"`]*\b([a-z]+(?:-[a-z]+)*-aventuras|aventuras-ID-padre)\.js/g)) importsDirectos.push(`${rel}: ${m[1]}`);
      const nCon = (texto.match(/\bimportarConReintentos\(/g) || []).length;
      if (nCon) conReintentos[rel] = nCon;
    }
    expect(sinParsear, 'cada bloque de script se ha leído').toEqual([]);
    // Cada fetch que queda, con su motivo: el núcleo (pedirJson), el de la API (fetchWithRetry), la pregunta de si hay
    // servidor (K-179, por decidir con el backend), la versión desplegada (el aviso de versión nueva, §19) y el envío a
    // Google Forms (otro origen; se queda hasta que haya backend).
    expect(fetchs, 'los fetch( del código de la app').toEqual({
      'codigo-padre.html': 1, 'js/api-client.js': 1, 'js/data-loader.js': 1, 'js/feedback-forms.js': 1, 'js/utils.js': 1,
    });
    expect(importsDirectos, 'import() de un módulo de datos que no pasa por importarConReintentos').toEqual([]);
    // data-loader.js la llama desde un solo sitio, su importarDatos(), por el que pasan sus siete módulos de datos.
    expect(conReintentos, 'importarConReintentos( por fichero').toEqual({
      'En-busca-del-tesoro.html': 2, 'chat-hijo6.html': 2, 'codigo-padre.html': 3, 'js/data-loader.js': 1, 'js/utils.js': 1,
    });
    expect((dataLoaderTexto().match(/\bimportarDatos\('[a-z-]+-aventuras\.js'\)/g) || []).length, 'los siete módulos de datos de data-loader.js, por importarDatos()').toBe(7);
    expect(L.leer('codigo-padre.html').split("import { DATOS_PADRE } from './js/aventuras-ID-padre.js';").length - 1,
      'el import estático de Script 1 sigue siendo el único estático de un módulo de datos').toBe(1);

    const dataLoader = L.textoSinComentarios('js/data-loader.js').texto;
    expect((dataLoader.match(/^\s*import\s[^(]/gm) || []).length, 'data-loader.js sin import estático: build-demo lo lee como data:').toBe(0);
    expect(dataLoader, 'data-loader.js sin su propio cliente de la API').not.toMatch(/\bfetchFromAPI\b/);
    expect(dataLoader, 'data-loader.js sin validarRespuesta: la validación en el servidor es ApiClient.validarReto').not.toMatch(/\bvalidarRespuesta\b/);
    const apiClient = L.textoSinComentarios('js/api-client.js').texto;
    expect(apiClient, 'ApiClient.getTextos').toMatch(/\bgetTextos\(aventuraId, idioma\)/);
    expect(apiClient, 'el plazo y los reintentos viven en js/utils.js, no en API_CONFIG').not.toMatch(/\b(timeout|retries|retryDelay)\s*:/);
    const utils = L.textoSinComentarios('js/utils.js').texto;
    for (const nombre of ['pedirConReintentos', 'pedirJson', 'importarConReintentos']) {
      expect(utils, `js/utils.js exporta ${nombre}`).toMatch(new RegExp(`export (async )?function ${nombre}\\(`));
    }
  });

  test('PD-1. El núcleo: qué reintenta, cuánto espera y cuándo se rinde', async ({ page }) => {
    await paginaEnBlanco(page);
    const r = await page.evaluate(async () => {
      const utils = await import('/js/utils.js');
      if (typeof utils.pedirConReintentos !== 'function') return { falta: true };
      const { pedirConReintentos } = utils;
      const opciones = { plazoMs: 300, reintentos: 4, esperaBaseMs: 60, descripcion: 'PD-1' };
      const con = (props) => Object.assign(new Error(props.mensaje || 'fallo'), props);
      const correr = async (fallos) => {
        const marcas = [];
        let senales = [];
        const valor = await pedirConReintentos(async (intento, senal) => {
          marcas.push(performance.now());
          senales.push(senal);
          const f = fallos[intento];
          if (f === 'cuelga') return new Promise(() => {});
          if (f) throw f;
          return 'ok';
        }, opciones).then((v) => v, (e) => ({ rechaza: e.name, plazoVencido: e.plazoVencido === true, status: e.status ?? null }));
        const esperas = marcas.slice(1).map((m, i) => Math.round(m - marcas[i]));
        return { valor, intentos: marcas.length, esperas, abortadas: senales.filter((s) => s.aborted).length };
      };
      return {
        red: await correr([new TypeError('Failed to fetch'), new TypeError('Load failed')]),
        cuelga: await correr(['cuelga', 'cuelga', 'cuelga', 'cuelga', 'cuelga']),
        cincoCientos: await correr([con({ status: 503 })]),
        cuatroCientos: await correr([con({ status: 404 })]),
        formato: await correr([new SyntaxError('Unexpected token')]),
        demasiadas: await correr([con({ status: 429, reintentarTrasMs: 400 })]),
      };
    });
    expect(r.falta, 'js/utils.js exporta pedirConReintentos').toBeUndefined();
    expect(r.red, 'un fallo de red (el TypeError de los tres motores) se reintenta').toMatchObject({ valor: 'ok', intentos: 3 });
    expect(r.red.esperas[0], 'la primera espera es la base').toBeGreaterThanOrEqual(55);
    expect(r.red.esperas[1], 'la segunda, el doble').toBeGreaterThanOrEqual(115);
    expect(r.cuelga.valor, 'un intento que no contesta se da por perdido a su plazo, y al final se rinde').toMatchObject({ plazoVencido: true });
    expect(r.cuelga.intentos, 'con 4 reintentos, 5 intentos').toBe(5);
    expect(r.cuelga.abortadas, 'cada intento vencido recibe su señal abortada').toBe(5);
    expect(r.cincoCientos, 'un 5xx se reintenta').toMatchObject({ valor: 'ok', intentos: 2 });
    expect(r.cuatroCientos, 'un 4xx no se reintenta').toMatchObject({ valor: { status: 404 }, intentos: 1 });
    expect(r.formato, 'un error de formato no se reintenta').toMatchObject({ valor: { rechaza: 'SyntaxError' }, intentos: 1 });
    expect(r.demasiadas.valor, 'un 429 se reintenta').toBe('ok');
    expect(r.demasiadas.esperas[0], 'y espera lo que dice su Retry-After, no la base').toBeGreaterThanOrEqual(390);
  });

  test('PD-2. fetchWithRetry reintenta el fallo de red, también en WebKit', async ({ page }) => {
    await paginaEnBlanco(page);
    const pedidas = await apuntar(page, '**/api/auth/comprobar', (route, n) => (n <= 2 ? route.abort('failed') : route.fulfill(json({ exito: true, token: 'T-PD2' }))));
    const r = await page.evaluate(async () => {
      const { ApiClient } = await import('/js/api-client.js');
      return ApiClient.comprobarCodigo('CODIGO', 'quien@ejemplo.es', 'Aventura1').then((d) => ({ token: d.token }), (e) => ({ error: `${e.codigo}: ${e.message}` }));
    });
    expect(r, 'llega al tercer intento').toEqual({ token: 'T-PD2' });
    expect(pedidas.length, 'tres peticiones').toBe(3);
  });

  test('PD-3. fetchWithRetry reintenta la petición que no contesta', async ({ page }) => {
    test.setTimeout(60_000);
    await paginaEnBlanco(page);
    const pedidas = await apuntar(page, '**/api/auth/comprobar', (route, n) => (n === 1 ? undefined : route.fulfill(json({ exito: true, token: 'T-PD3' }))));
    const t0 = Date.now();
    const r = await page.evaluate(async () => {
      const { ApiClient } = await import('/js/api-client.js');
      return ApiClient.comprobarCodigo('CODIGO', 'quien@ejemplo.es', 'Aventura1').then((d) => ({ token: d.token }), (e) => ({ error: e.codigo || e.message }));
    });
    expect(r, 'la primera no contesta; la segunda, sí').toEqual({ token: 'T-PD3' });
    expect(pedidas.length, 'dos peticiones').toBe(2);
    expect(Date.now() - t0, 'el segundo intento sale al vencer el plazo de 15 s').toBeGreaterThanOrEqual(15_000);
  });

  test('PD-5. fetchWithRetry: un 503 se reintenta, un 404 no, y un 429 espera su Retry-After', async ({ page }) => {
    test.setTimeout(60_000);
    await paginaEnBlanco(page);
    const p503 = await apuntar(page, '**/api/aventuras/A503', (route, n) => route.fulfill(n === 1 ? json({ error: true, codigo: 'SERVIDOR_NO_DISPONIBLE' }, 503) : json({ exito: true, aventura: 'A503' })));
    const p404 = await apuntar(page, '**/api/aventuras/A404', (route) => route.fulfill(json({ error: true, codigo: 'AVENTURA_NO_ENCONTRADA' }, 404)));
    const p429 = await apuntar(page, '**/api/aventuras/A429', (route, n) => route.fulfill(n === 1 ? json({ error: true, codigo: 'RATE_LIMIT_EXCEEDED' }, 429, { 'Retry-After': '2' }) : json({ exito: true, aventura: 'A429' })));
    const r = await page.evaluate(async () => {
      const { ApiClient } = await import('/js/api-client.js');
      const pedir = (id) => ApiClient.getAventura(id).then((d) => d.aventura, (e) => `rechaza ${e.statusCode} ${e.codigo}`);
      return { a503: await pedir('A503'), a404: await pedir('A404'), a429: await pedir('A429') };
    });
    expect(r.a503, 'un 503 se reintenta y llega').toBe('A503');
    expect(p503.length, 'dos peticiones').toBe(2);
    expect(r.a404, 'un 404 no se reintenta').toBe('rechaza 404 AVENTURA_NO_ENCONTRADA');
    expect(p404.length, 'una petición').toBe(1);
    expect(r.a429, 'un 429 se reintenta').toBe('A429');
    expect(p429[1].t - p429[0].t, 'tras el 429 espera lo que dice su Retry-After (2 s), no la base (1 s)').toBeGreaterThanOrEqual(1900);
  });

  test('PD-6. data-loader en local: el import() de un módulo de datos se reintenta con otra dirección', async ({ page }) => {
    await paginaEnBlanco(page);
    const pedidas = await apuntar(page, '**/js/retos-aventuras.js*', (route, n) => (n <= 2 ? route.abort('failed') : route.continue()));
    const r = await page.evaluate(async () => {
      const { cargarRetos } = await import('/js/data-loader.js');
      return cargarRetos('Aventura1', 'es').then((retos) => ({ retos: Array.isArray(retos) ? retos.length : null }), (e) => ({ error: e.message }));
    });
    expect(r.error, 'cargarRetos no se rinde').toBeUndefined();
    expect(r.retos, 'los retos llegan al tercer intento').toBeGreaterThan(0);
    const direcciones = pedidas.map((p) => new URL(p.url).search);
    expect(direcciones.length, 'tres peticiones').toBe(3);
    expect(direcciones[0], 'la primera, con su dirección').toBe('');
    expect(new Set(direcciones.slice(1)).size, 'cada reintento con una dirección distinta').toBe(2);
    for (const d of direcciones.slice(1)) expect(d, 'el reintento cambia la dirección con _v').toMatch(/^\?_v=/);
  });

  test('PD-6b. Un import() que se rindió no queda recordado: la siguiente vez que se pide, llega', async ({ page }) => {
    test.setTimeout(90_000);
    await paginaEnBlanco(page);
    let cortar = true;
    await page.route('**/js/retos-aventuras.js*', (route) => (cortar ? route.abort('failed') : route.continue()));
    const primera = await page.evaluate(async () => {
      const { cargarRetos } = await import('/js/data-loader.js');
      return cargarRetos('Aventura1', 'es').then(() => 'llega', () => 'se rinde');
    });
    expect(primera, 'con la red cortada todo el rato, se rinde').toBe('se rinde');
    cortar = false;
    const segunda = await page.evaluate(async () => {
      const { cargarRetos } = await import('/js/data-loader.js');
      return cargarRetos('Aventura1', 'es').then((retos) => (Array.isArray(retos) && retos.length ? 'llega' : 'vacío'), (e) => `se rinde: ${e.message}`);
    });
    expect(segunda, 'con la red de vuelta, la siguiente vez llega').toBe('llega');
  });

  test('PD-7. La selección: un reto de la demo que falla dos veces llega al tercer intento', async ({ page }) => {
    const pedidas = await apuntar(page, '**/publico/retos/**', (route, n) => (n <= 2 ? route.abort('failed') : route.continue()));
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
      null, { timeout: 20_000 });
    const f = page.frames().find((fr) => fr.name() === 'seleccion');
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; mostrar(8); });
    await expect.poll(() => f.evaluate(() => document.querySelectorAll('#reto-r1-opciones input').length), { timeout: 15_000, message: 'P8 enseña las opciones del reto' })
      .toBeGreaterThan(0);
    expect(pedidas.length, 'tres peticiones del reto').toBe(3);
  });

  test('PD-8. data-loader con servidor: va por ApiClient, y los textos por getTextos', async ({ page }) => {
    await page.route('**/js/data-loader.js', async (route) => {
      const original = await route.fetch();
      const texto = await original.text();
      if (!texto.includes('const BACKEND_READY = false;')) throw new Error('No se ha podido autorizar el backend en la copia de js/data-loader.js');
      await route.fulfill({ response: original, body: texto.replace('const BACKEND_READY = false;', 'const BACKEND_READY = true;') });
    });
    await page.route('**/api/health', (route) => route.fulfill(json({ ok: true })));
    const pRetos = await apuntar(page, '**/api/retos/Aventura1/es', (route, n) => route.fulfill(n === 1 ? json({ error: true, codigo: 'SERVIDOR_NO_DISPONIBLE' }, 503) : json({ retos: [{ id: 'R-API' }] })));
    const pTextos = await apuntar(page, '**/api/textos/Aventura1/es', (route) => route.fulfill(json({ textos: [{ id: 'txt-API-es', title: 'Desde la API', content: '<p>API</p>' }] })));
    await paginaEnBlanco(page);
    const r = await page.evaluate(async () => {
      const { cargarRetos, cargarTextos, getDataMode } = await import('/js/data-loader.js');
      const retos = await cargarRetos('Aventura1', 'es').then((x) => x?.map((y) => y.id) ?? null, (e) => `rechaza: ${e.message}`);
      const textos = await cargarTextos('Aventura1', 'es').then((x) => x?.map((y) => y.id) ?? null, (e) => `rechaza: ${e.message}`);
      return { modo: getDataMode(), retos, textos };
    });
    expect(r.modo, 'con /api/health en 200, el modo es api').toBe('api');
    expect(r.retos, 'los retos llegan aunque la respuesta no lleve exito, y tras un 503').toEqual(['R-API']);
    expect(pRetos.length, 'el 503 se reintenta').toBe(2);
    expect(pRetos[0].cabeceras.accept, 'la petición la hace fetchWithRetry (ApiClient)').toBe('application/json');
    expect(r.textos, 'los textos, por getTextos').toEqual(['txt-API-es']);
    expect(pTextos.length, 'una petición de textos').toBe(1);
  });
});

test.describe('PD — el plazo cubre el cuerpo de la respuesta', () => {
  test.use({ baseURL: BASE_URL_RED_CONTROLADA, serviceWorkers: 'block' });
  let red;
  test.beforeAll(async () => { red = await abrirRedControlada(); });
  test.afterEach(() => red.limpiar());
  test.afterAll(() => red.cerrar());

  test('PD-4. fetchWithRetry: si el cuerpo se queda a medias, a los 15 s se reintenta', async ({ page }) => {
    test.setTimeout(60_000);
    const segunda = red.regla(/^\/api\/auth\/comprobar$/, { modo: 'responde', cuerpo: JSON.stringify({ exito: true, token: 'T-PD4' }) });
    const primera = red.regla(/^\/api\/auth\/comprobar$/, { modo: 'cuerpo-colgado', cuerpo: '{"exito":tr', veces: 1 });
    await paginaEnBlanco(page);
    const t0 = Date.now();
    const r = await page.evaluate(async () => {
      const { ApiClient } = await import('/js/api-client.js');
      const tope = new Promise((resolve) => setTimeout(() => resolve({ sigueColgada: true }), 30_000));
      return Promise.race([tope, ApiClient.comprobarCodigo('CODIGO', 'quien@ejemplo.es', 'Aventura1').then((d) => ({ token: d.token }), (e) => ({ error: e.codigo || e.message }))]);
    });
    expect(primera.peticiones, 'la primera respuesta se quedó con el cuerpo a medias').toBe(1);
    expect(r, 'el plazo cubre el cuerpo: a los 15 s, otro intento, que llega').toEqual({ token: 'T-PD4' });
    expect(segunda.peticiones, 'la segunda petición').toBe(1);
    expect(Date.now() - t0, 'al vencer el plazo de 15 s').toBeGreaterThanOrEqual(15_000);
  });
});
