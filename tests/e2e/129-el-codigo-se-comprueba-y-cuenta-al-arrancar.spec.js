/**
 * 129 — El código de compra se comprueba en su pantalla y empieza a contar cuando arranca la aventura
 *
 * POR QUE EXISTE
 *
 * La llave de una aventura es el código de compra con su email, y la comprueba el servidor. Si el código se
 * gastara al escribirlo, quien responde «no» en el reto 2, cierra la app o se queda sin batería antes de
 * empezar se quedaría con un código gastado y sin aventura. Por eso son dos pasos distintos:
 *
 *   · la pantalla del código (P14) solo COMPRUEBA (`ApiClient.comprobarCodigo` → `/api/auth/comprobar`): no gasta
 *     nada y se puede repetir;
 *   · el código EMPIEZA A CONTAR cuando arranca el reloj de la aventura (`ApiClient.activar` → `/api/auth/activar`,
 *     desde `_iniciarTemporizadorAventura` del padre), con el token de sesión que dejó la comprobación.
 *
 * Hoy no hay backend (`BACKEND_READY = false` en `js/data-loader.js`) y en local la pantalla del código rechaza
 * siempre. Para recorrer la rama con backend, este spec sirve una copia de `data-loader.js` con el backend
 * autorizado y contesta él mismo a `/api/*`. Va sin service worker para que sus rutas vean todas las peticiones.
 *
 *   CC-1  Control: sin backend, arrancar el reloj de la aventura no llama a `/api`.
 *   CC-2  Con backend, la pantalla del código llama a comprobar con el código, el email y la aventura elegida, pasa
 *         a la normativa y NO llama a activar.
 *   CC-3  Con backend, al arrancar el reloj de la aventura se llama a activar, una vez, con la aventura y con el
 *         token que dejó la comprobación.
 *   CC-4  Con backend, en modo DEV (ver §24 de la guía) o fuera del modo AVENTURA el reloj no arranca y no se
 *         llama a activar.
 *
 * ROJO ANTES QUE VERDE: con la pantalla del código llamando a activar (como estaba), CC-2 ve una llamada a
 * `/auth/activar` y ninguna a `/auth/comprobar`; sin el aviso al arrancar el reloj, CC-3 no ve ninguna.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const TOKEN = 'token-de-prueba';
const EMAIL = 'prueba@example.com';
const CODIGO = 'A3X7-K2P9';

const DATA_LOADER = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'data-loader.js'), 'utf8');
const DATA_LOADER_CON_BACKEND = DATA_LOADER.replace('const BACKEND_READY = false;', 'const BACKEND_READY = true;');
if (DATA_LOADER_CON_BACKEND === DATA_LOADER) {
  throw new Error('No se ha podido autorizar el backend en la copia de js/data-loader.js: revisar el ancla de BACKEND_READY');
}

// Sin service worker, las rutas de este spec ven todas las peticiones de la página y de sus iframes.
test.use({ serviceWorkers: 'block' });

/** Contesta a `/api/*` como lo haría el backend y apunta cada llamada. Con `conBackend`, además, lo autoriza. */
async function montarBackendDePrueba(page, { conBackend }) {
  const llamadas = [];
  if (conBackend) {
    await page.route('**/js/data-loader.js*', (route) => route.fulfill({ contentType: 'text/javascript', body: DATA_LOADER_CON_BACKEND }));
  }
  await page.route('**/api/**', (route) => {
    const peticion = route.request();
    const ruta = new URL(peticion.url()).pathname.replace(/^\/api/, '');
    let cuerpo = null;
    try { cuerpo = peticion.postDataJSON(); } catch { cuerpo = peticion.postData(); }
    llamadas.push({ ruta, metodo: peticion.method(), cuerpo, autorizacion: peticion.headers().authorization || null });
    const contesta = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (ruta === '/health') return contesta(200, { exito: true });
    if (ruta === '/auth/comprobar') return contesta(200, { exito: true, token: TOKEN });
    if (ruta === '/auth/activar') return contesta(200, { exito: true, iniciada: 1, expira: 2 });
    return contesta(404, { error: true, codigo: 'NO_ENCONTRADO', mensaje: 'el backend de prueba no sirve esta ruta' });
  });
  return llamadas;
}

const aAuth = (llamadas) => llamadas.filter((l) => l.ruta.startsWith('/auth/')).map((l) => l.ruta);

async function arrancar(page, context) {
  // La normativa enciende el GPS: el permiso y la posición se dan ANTES de abrir la página.
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 20_000 },
  );
  await page.waitForFunction(() => typeof globalThis._iniciarTemporizadorAventura === 'function', null, { timeout: 15_000 });
}

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

/** Arranca el reloj de la aventura como lo hace el padre al entrar en modo AVENTURA, y espera a que su aviso al servidor termine. */
async function arrancarElReloj(page, { dev = false, modo = 'aventura' } = {}) {
  await page.evaluate(async ([esDev, elModo]) => {
    globalThis._devModeActivo = esDev;
    await globalThis._iniciarTemporizadorAventura('Aventura1', { modo: { actual: elModo } }, '[SPEC-129]');
  }, [dev, modo]);
}

/** El recorrido de la selección hasta pulsar el botón de la pantalla del código, con el pago hecho. */
async function hastaPulsarElCodigo(page) {
  const f = seleccion(page);
  // El idioma se elige en P2, antes que la aventura.
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  const cargadas = page.waitForEvent('console', { predicate: (m) => m.text().includes('Aventuras cargadas dinámicamente'), timeout: 20_000 });
  await f.evaluate(() => mostrar(7));
  await cargadas;
  await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
  await f.evaluate(() => mostrar(12));
  await f.evaluate(() => document.querySelector('#pantalla12 .btn-mundo-verde').click());
  await f.evaluate(() => document.querySelector('#pantalla13 .btn-mundo-verde').click());
  expect(await f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id))).toEqual(['pantalla14']);
  await f.evaluate(([email, codigo]) => {
    const pon = (id, valor) => { const el = document.getElementById(id); el.value = valor; el.dispatchEvent(new Event('input', { bubbles: true })); };
    pon('input-email', email);
    pon('input-codigo', codigo);
    document.getElementById('btn-iniciar-aventura').click();
  }, [EMAIL, CODIGO]);
  return f;
}

test.describe('CC — el código se comprueba y cuenta al arrancar', () => {
  test('CC-1. Control: sin backend, arrancar el reloj de la aventura no llama a /api', async ({ page, context }) => {
    const llamadas = await montarBackendDePrueba(page, { conBackend: false });
    await arrancar(page, context);
    await arrancarElReloj(page);
    // El aviso al servidor no se espera dentro del arranque del reloj: se le da su propio final.
    await page.evaluate(() => import('./js/data-loader.js').then((m) => m.asegurarModo()));
    expect(await page.evaluate(() => import('./js/data-loader.js').then((m) => m.getDataMode()))).toBe('local');
    expect(llamadas.map((l) => l.ruta), 'en local no se pregunta nada al servidor').toEqual([]);
  });

  test('CC-2. Con backend, la pantalla del código comprueba y no gasta', async ({ page, context }) => {
    test.setTimeout(120_000);
    const llamadas = await montarBackendDePrueba(page, { conBackend: true });
    await arrancar(page, context);
    const f = await hastaPulsarElCodigo(page);

    await expect.poll(() => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id)), { timeout: 20_000 }).toEqual(['pantalla15']);
    expect(aAuth(llamadas), 'la pantalla del código llama a comprobar, y solo a comprobar').toEqual(['/auth/comprobar']);
    const comprobar = llamadas.find((l) => l.ruta === '/auth/comprobar');
    expect(comprobar.metodo).toBe('POST');
    expect(comprobar.cuerpo, 'con el código tal cual, el email y la aventura elegida').toEqual({ codigo: CODIGO, email: EMAIL, aventuraId: 'Aventura1' });
    // La normativa hace que el padre cargue los hijos: se espera a que termine antes de cerrar la página.
    await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 60_000 });
    expect(aAuth(llamadas), 'cargar los hijos tampoco gasta el código').toEqual(['/auth/comprobar']);
  });

  test('CC-3. Con backend, el código empieza a contar al arrancar el reloj de la aventura', async ({ page, context }) => {
    test.setTimeout(120_000);
    const llamadas = await montarBackendDePrueba(page, { conBackend: true });
    await arrancar(page, context);
    const f = await hastaPulsarElCodigo(page);
    await expect.poll(() => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id)), { timeout: 20_000 }).toEqual(['pantalla15']);
    await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 60_000 });
    expect(aAuth(llamadas)).toEqual(['/auth/comprobar']);

    await arrancarElReloj(page);
    await expect.poll(() => aAuth(llamadas), { timeout: 15_000 }).toEqual(['/auth/comprobar', '/auth/activar']);
    const activar = llamadas.find((l) => l.ruta === '/auth/activar');
    expect(activar.metodo).toBe('POST');
    expect(activar.cuerpo, 'con la aventura que arranca').toEqual({ aventuraId: 'Aventura1' });
    expect(activar.autorizacion, 'y con el token de sesión que dejó la comprobación').toBe(`Bearer ${TOKEN}`);
  });

  test('CC-4. Con backend, en modo DEV o fuera del modo AVENTURA el reloj no arranca y no se llama a activar', async ({ page, context }) => {
    const llamadas = await montarBackendDePrueba(page, { conBackend: true });
    await arrancar(page, context);
    await arrancarElReloj(page, { dev: true });
    await arrancarElReloj(page, { dev: false, modo: 'casa' });
    // Control dentro del mismo test: con el reloj arrancando de verdad, la llamada sí sale.
    expect(aAuth(llamadas), 'ni en DEV ni en CASA').toEqual([]);
    await arrancarElReloj(page);
    await expect.poll(() => aAuth(llamadas), { timeout: 15_000 }).toEqual(['/auth/activar']);
  });
});
