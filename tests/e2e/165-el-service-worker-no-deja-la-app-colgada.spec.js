/**
 * 165 — El service worker no deja la app colgada: la copia guardada con un plazo, y una página «sin internet» (K-60,
 * K-176)
 *
 * POR QUE EXISTE
 *
 * El Network First de `sw.js` (el shell, los módulos y los datos de `js/`) pide a la red y solo sirve la copia guardada
 * si el `fetch` rechaza. Medido con el worker en modo producción (sonda de K-176): con una respuesta de error la recarga
 * enseña «Service Unavailable» en blanco, con la red colgada no carga nunca, y un hijo que se recarga con la red colgada
 * se queda sin su página. El aviso de «sin internet» vive en el padre: si lo que no llega es el padre, no puede salir.
 * El worker corre fuera de la app, así que es él quien no puede dejarla colgada.
 *
 *   SWR-0  El instrumento: el worker controla la página y corre en modo producción (con la red cortada sirve un fichero
 *          de la precarga desde su copia), y las peticiones del worker pasan por el proxy (la regla se usa).
 *   SWR-1  Con la red cortada, la recarga del padre sale de la copia guardada. Control: ya hoy.
 *   SWR-2  Con una respuesta de error del servidor (503 y 404), la recarga del padre sale de la copia guardada.
 *   SWR-3  Con la red colgada, la recarga del padre sale de la copia guardada al vencer el plazo (5 s), y no antes.
 *   SWR-4  Con la red colgada, un hijo que se recarga (la selección, como hace el supervisor con `src = src`) sale de su
 *          copia.
 *   SWR-5  Sin copia de la página, una navegación con la red cortada, con un 503 o colgada recibe la página «sin
 *          internet»: la imagen del aviso y el botón 🌐🔄, sin ningún texto. Con la red de vuelta, el botón trae la página.
 *   SWR-6  Lo mismo dentro de un hijo: el iframe de la selección, sin copia y con la red cortada, enseña la página «sin
 *          internet».
 *   SWR-7  Sin copia, un 404 es la respuesta del servidor tal cual: una página que no existe no es «sin internet».
 *          Control: ya hoy.
 *   SWR-8  Servida la copia por el plazo, la respuesta que llega tarde de la red se guarda: la próxima vez sale la nueva.
 *          Control: ya hoy (hoy se espera a la red y se guarda).
 *   SWR-9  Un dato sin copia (un módulo de pago que aún no se ha pedido) espera a la red pasado el plazo: no hay nada que
 *          servir en su lugar, y el plazo y los reintentos son de quien lo pide. Control: ya hoy.
 *   SWR-10 La página «sin internet» y la imagen que enseña están en la precarga (`APP_SHELL`): se sirven justo cuando
 *          la red no da la página, y entonces ya no se pueden descargar.
 *
 * CÓMO MIDE: con la red controlada de helpers/red-controlada.js, un proxy en 127.0.0.2 delante del servidor real. Ese
 * origen no es de desarrollo para `sw.js`, así que el worker corre en modo producción, y como el fallo está fuera del
 * navegador, vale en los cuatro: `context.setOffline` en Firefox y WebKit corta también la caché del worker, y
 * `context.route` solo ve sus peticiones en Chromium. El hijo de SWR-4 y SWR-6 es la selección, el único que existe
 * nada más arrancar; el camino es el mismo que el de cualquier hijo (la navegación de su iframe pasa por el worker).
 *
 * ROJO ANTES QUE VERDE: con el Network First sin plazo, SWR-2, SWR-3, SWR-4, SWR-5, SWR-6 y SWR-10 caen; SWR-0, SWR-1,
 * SWR-7, SWR-8 y SWR-9 pasan, y tienen que seguir pasando después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
const { BASE_URL_RED_CONTROLADA, abrirRedControlada } = require('./helpers/red-controlada');

const RAIZ = path.join(__dirname, '../..');
const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PLAZO_SW_MS = 5000;
const TITULO_PADRE = 'Aventura 1 - Padre';
const TITULO_SELECCION = 'València be Guides';
const PADRE = /^\/codigo-padre\.html$/;
const SELECCION = /^\/En-busca-del-tesoro\.html$/;

test.use({ baseURL: BASE_URL_RED_CONTROLADA, serviceWorkers: 'allow' });

let red;
test.beforeAll(async () => { red = await abrirRedControlada(); });
test.afterEach(() => red.limpiar());
test.afterAll(() => red.cerrar());

/**
 * Arranca el padre y espera a que el worker lo controle y tenga su precarga. El permiso de geolocalización va antes de
 * navegar: concedido con la página ya cargada, Firefox deja colgada la petición de posición.
 */
async function arrancar(page) {
  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker?.controller),
    { timeout: 30_000, message: 'el service worker controla la página' }).toBe(true);
  await expect.poll(() => page.evaluate(async () => !!(await caches.match('/codigo-padre.html'))),
    { timeout: 30_000, message: 'la precarga del worker tiene el padre' }).toBe(true);
}

/** Borra de todas las cachés del worker las entradas de una ruta (con cualquier consulta). */
const olvidarCopia = (page, ruta) => page.evaluate(async (r) => {
  let borradas = 0;
  for (const nombre of await caches.keys()) {
    const cache = await caches.open(nombre);
    for (const req of await cache.keys()) {
      if (new URL(req.url).pathname === r) borradas += Number(await cache.delete(req));
    }
  }
  return borradas;
}, ruta);

/**
 * Recarga la página y dice qué documento llegó y cuánto tardó. Si no llega en `plazo`, suelta la red colgada para que la
 * página no se quede navegando, y lo dice (`llega: false`): así el test cae por su aserción, con su mensaje, y no por el
 * límite de tiempo.
 */
async function recargar(page, plazo = 20_000) {
  const t0 = Date.now();
  let llega = true;
  let estado = null;
  try {
    const respuesta = await page.reload({ waitUntil: 'domcontentloaded', timeout: plazo });
    estado = respuesta?.status() ?? null;
  } catch {
    llega = false;
    red.limpiar();
  }
  const ms = Date.now() - t0;
  return { llega, ms, estado, ...(await leerDocumento(page)) };
}

/**
 * El título y el principio del texto del documento. Soltada una red colgada, la navegación termina después: si la
 * lectura cae en medio, el contexto se destruye, y entonces se espera al documento nuevo y se vuelve a leer.
 */
async function leerDocumento(page) {
  for (let intento = 1; ; intento++) {
    try {
      return await page.evaluate(() => ({ titulo: document.title, texto: (document.body?.innerText || '').trim().slice(0, 60) }));
    } catch (error) {
      if (intento >= 5 || !/Execution context was destroyed|navigation/i.test(error.message)) throw error;
      await page.waitForLoadState('domcontentloaded', { timeout: 30_000 }).catch(() => {});
    }
  }
}

/** Lo que se ve de la página «sin internet» en un documento: su imagen cargada, sus botones y el texto que quede. */
const vistaSinConexion = (marco) => marco.evaluate(() => ({
  imagen: [...document.images].some((i) => /imagen-no-internet\.png$/.test(decodeURIComponent(i.src)) && i.complete && i.naturalWidth > 0),
  botones: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()),
  texto: (document.body?.innerText || '').replace(/🌐|🔄|\s/gu, ''),
}));

test.describe('SWR — el service worker no deja la app colgada', () => {
  test('SWR-0. El instrumento: el worker corre en modo producción y sus peticiones pasan por el proxy', async ({ page }) => {
    await arrancar(page);
    const regla = red.regla(/^\/js\/constants\.js$/, { modo: 'cortada' });
    const estado = await page.evaluate(async () => { try { return (await fetch('/js/constants.js')).status; } catch (e) { return `rechaza: ${e.message}`; } });
    expect(regla.peticiones, 'la petición del worker ha llegado al proxy').toBeGreaterThan(0);
    expect(estado, 'con la red cortada, el worker sirve el fichero de la precarga desde su copia (en desarrollo iría a la red y fallaría)').toBe(200);
  });

  test('SWR-1. Con la red cortada, la recarga del padre sale de la copia guardada', async ({ page }) => {
    await arrancar(page);
    const regla = red.regla(PADRE, { modo: 'cortada' });
    const r = await recargar(page);
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
    expect(r, 'el padre, de la copia').toMatchObject({ llega: true, titulo: TITULO_PADRE });
  });

  for (const estado of [503, 404]) {
    test(`SWR-2. Con un ${estado} del servidor, la recarga del padre sale de la copia guardada`, async ({ page }) => {
      await arrancar(page);
      const regla = red.regla(PADRE, { modo: 'error', estado, cuerpo: `Error ${estado}` });
      const r = await recargar(page);
      expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
      expect(r, `el padre, de la copia (no el texto del ${estado})`).toMatchObject({ llega: true, titulo: TITULO_PADRE });
    });
  }

  test('SWR-3. Con la red colgada, la recarga del padre sale de la copia al vencer el plazo, y no antes', async ({ page }) => {
    await arrancar(page);
    const regla = red.regla(PADRE, { modo: 'colgada' });
    const r = await recargar(page);
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
    expect(r, 'el padre, de la copia').toMatchObject({ llega: true, titulo: TITULO_PADRE });
    expect(r.ms, 'ha esperado el plazo de la red antes de usar la copia').toBeGreaterThanOrEqual(PLAZO_SW_MS - 500);
    expect(r.ms, 'y no mucho más').toBeLessThan(PLAZO_SW_MS + 10_000);
  });

  test('SWR-4. Con la red colgada, un hijo que se recarga sale de su copia', async ({ page }) => {
    await arrancar(page);
    const marco = () => page.frame({ name: 'seleccion' });
    await expect.poll(async () => (await marco()?.evaluate(() => document.title).catch(() => null)), { timeout: 30_000 }).toBe(TITULO_SELECCION);
    await page.evaluate(() => { document.getElementById('seleccion').contentWindow.__vvDocumentoViejo = true; });
    const regla = red.regla(SELECCION, { modo: 'colgada' });
    await page.evaluate(() => { const f = document.getElementById('seleccion'); f.src = f.src; }); // NOSONAR — lo que hace el supervisor
    await expect.poll(() => page.evaluate(() => {
      const w = document.getElementById('seleccion').contentWindow;
      return w.__vvDocumentoViejo === undefined && w.document.title;
    }), { timeout: PLAZO_SW_MS + 10_000, message: 'el iframe tiene un documento nuevo, el de la selección' }).toBe(TITULO_SELECCION);
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
  });

  for (const modo of ['cortada', 'error', 'colgada']) {
    test(`SWR-5. Sin copia del padre y con la red ${modo === 'error' ? 'dando un 503' : modo}, la navegación recibe la página «sin internet», y su botón trae la página`, async ({ page }) => {
      await arrancar(page);
      expect(await olvidarCopia(page, '/codigo-padre.html'), 'se ha borrado la copia del padre').toBeGreaterThan(0);
      const regla = red.regla(PADRE, { modo });
      const r = await recargar(page);
      expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
      expect(r.llega, 'llega un documento').toBe(true);
      await expect.poll(() => vistaSinConexion(page), { timeout: 15_000, message: 'la página «sin internet»' })
        .toEqual({ imagen: true, botones: ['🌐🔄'], texto: '' });

      regla.quitar();
      await page.locator('button').click();
      await expect.poll(() => page.evaluate(() => document.title).catch(() => null), { timeout: 30_000, message: 'con la red de vuelta, el botón trae el padre' }).toBe(TITULO_PADRE);
    });
  }

  test('SWR-6. Dentro de un hijo: sin copia y con la red cortada, el iframe enseña la página «sin internet»', async ({ page }) => {
    await arrancar(page);
    const marco = () => page.frame({ name: 'seleccion' });
    await expect.poll(async () => (await marco()?.evaluate(() => document.title).catch(() => null)), { timeout: 30_000 }).toBe(TITULO_SELECCION);
    expect(await olvidarCopia(page, '/En-busca-del-tesoro.html'), 'se ha borrado la copia de la selección').toBeGreaterThan(0);
    await page.evaluate(() => { document.getElementById('seleccion').contentWindow.__vvDocumentoViejo = true; });
    const regla = red.regla(SELECCION, { modo: 'cortada' });
    await page.evaluate(() => { const f = document.getElementById('seleccion'); f.src = f.src; }); // NOSONAR — lo que hace el supervisor
    // Por la marca y no por el título: la página «sin internet» lleva el mismo título que la selección.
    await expect.poll(() => page.evaluate(() => document.getElementById('seleccion').contentWindow.__vvDocumentoViejo === undefined),
      { timeout: 15_000, message: 'el iframe tiene un documento nuevo' }).toBe(true);
    await expect.poll(async () => vistaSinConexion(marco()), { timeout: 15_000, message: 'la página «sin internet» dentro del iframe' })
      .toEqual({ imagen: true, botones: ['🌐🔄'], texto: '' });
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
  });

  test('SWR-7. Sin copia, un 404 es la respuesta del servidor tal cual', async ({ page }) => {
    await arrancar(page);
    expect(await olvidarCopia(page, '/codigo-padre.html'), 'se ha borrado la copia del padre').toBeGreaterThan(0);
    const regla = red.regla(PADRE, { modo: 'error', estado: 404, cuerpo: 'Not Found' });
    const r = await recargar(page);
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
    expect(r, 'el 404 del servidor, no la página «sin internet»').toMatchObject({ llega: true, estado: 404, texto: 'Not Found' });
  });

  test('SWR-8. Servida la copia por el plazo, la respuesta que llega tarde se guarda', async ({ page }) => {
    await arrancar(page);
    const regla = red.regla(PADRE, { modo: 'retraso', ms: PLAZO_SW_MS + 3000, cabeceras: { 'x-red-controlada': 'tardia' } });
    const r = await recargar(page);
    expect(r, 'el padre').toMatchObject({ llega: true, titulo: TITULO_PADRE });
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(async () => (await caches.match('/codigo-padre.html'))?.headers.get('x-red-controlada') ?? null),
      { timeout: 20_000, message: 'la copia guardada es la respuesta que llegó tarde' }).toBe('tardia');
  });

  test('SWR-9. Un dato sin copia espera a la red pasado el plazo', async ({ page }) => {
    await arrancar(page);
    await olvidarCopia(page, '/js/retos-aventuras.js');
    const regla = red.regla(/^\/js\/retos-aventuras\.js$/, { modo: 'retraso', ms: PLAZO_SW_MS + 2000 });
    const r = await page.evaluate(async () => {
      const t0 = performance.now();
      try {
        const m = await import(`/js/retos-aventuras.js?sonda=${Date.now()}`);
        return { carga: typeof m.RETOS_AVENTURAS === 'object', ms: Math.round(performance.now() - t0) };
      } catch (e) {
        return { carga: false, error: e.message, ms: Math.round(performance.now() - t0) };
      }
    });
    expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
    expect(r.carga, `el módulo llega de la red aunque tarde más que el plazo (${JSON.stringify(r)})`).toBe(true);
    expect(r.ms, 'ha esperado a la red').toBeGreaterThanOrEqual(PLAZO_SW_MS + 1500);
  });

  test('SWR-10. La página «sin internet» y su imagen están en la precarga', () => {
    const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8').replace(/\r\n/g, '\n');
    const lista = /const APP_SHELL = \[([\s\S]*?)\];/.exec(sw)?.[1] ?? '';
    const precarga = [...lista.matchAll(/^\s*'([^']+)',/gm)].map((m) => m[1]);
    expect(precarga.length, 'cada entrada de APP_SHELL se ha leído').toBe((lista.match(/^\s*'/gm) || []).length);
    expect(precarga, 'la página «sin internet» está en la precarga').toContain('/sin-conexion.html');

    const pagina = fs.readFileSync(path.join(RAIZ, 'sin-conexion.html'), 'utf8');
    const imagenes = [...pagina.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    expect(imagenes, 'la página enseña una sola imagen').toHaveLength(1);
    expect(precarga, `${imagenes[0]}: en la precarga`).toContain(`/${imagenes[0]}`);
  });
});
