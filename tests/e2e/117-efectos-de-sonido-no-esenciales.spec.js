/**
 * 117-efectos-de-sonido-no-esenciales.spec.js
 *
 * Los efectos de sonido (js/efectos-sonido.js) no son esenciales: si el módulo no se carga, el
 * padre, hijo4 y el puzzle arrancan igual, sin sonidos, y el fallo se dice en el log. El propio
 * módulo ya trata así a un sonido que falla (`_sinRomper`: un `play()` rechazado no rompe a quien
 * lo pide); este spec fija lo mismo para el fallo de CARGA del módulo.
 *
 *   EN-P  padre: Script 2 termina (registra sus handlers y marca `script2Listo`)
 *   EN-H  hijo4: registra su handler de cambio de modo
 *   EN-Z  puzzle: inicializa su bus
 *
 * Cada frame se prueba dos veces: con el módulo sirviéndose normalmente (control: la señal existe
 * y no hay aviso) y con la petición de `js/efectos-sonido.js` abortada (el frame llega a la misma
 * señal y el log lleva el aviso «No se pudo cargar js/efectos-sonido.js»).
 *
 * POR QUÉ EXISTE
 *
 * Un `import` estático, o un `await import()` de nivel superior fuera de un `try`, detiene el
 * script entero si el módulo no llega. En el padre, eso dejaba a Script 2 sin registrar los
 * handlers de reto, audio y parada; en hijo4 y en el puzzle, sin handshake ni botones.
 *
 * ROJO ANTES QUE VERDE: con el código anterior, las tres variantes con el módulo bloqueado caen
 * (Script 2 no marca `script2Listo`; hijo4 no registra su handler; el puzzle no inicializa el bus).
 *
 * Los service workers se bloquean: con uno activo, la petición podría servirse desde su caché y
 * `page.route` no la vería.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { abrirHijoEnMarco, injectInitSpy, stubCDNResources } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const IMAGEN = encodeURIComponent('imagenes/imagenes-aplicación/logo-luna.png');
const AVISO = /No se pudo cargar js\/efectos-sonido\.js/;

test.use({ serviceWorkers: 'block' });

/** Los avisos `warn` sobre el módulo que se hayan escrito en cualquier frame de la página. */
function vigilarAvisos(page) {
  const avisos = [];
  const consola = [];
  page.on('console', (m) => {
    const texto = m.text();
    consola.push(texto);
    if (m.type() === 'warning' && AVISO.test(texto)) avisos.push(texto);
  });
  return { avisos, consola };
}

const bloquearModulo = (page) => page.route('**/js/efectos-sonido.js*', (route) => route.abort('failed'));

for (const bloqueado of [false, true]) {
  const modo = bloqueado ? 'con el módulo bloqueado' : 'control, con el módulo normal';

  test.describe(`EN — efectos de sonido no esenciales (${modo})`, () => {
    test(`EN-P. El padre termina de arrancar (${modo})`, async ({ page }) => {
      const { avisos } = vigilarAvisos(page);
      if (bloqueado) await bloquearModulo(page);
      await page.addInitScript({ path: MAPLIBRE_STUB });
      await injectInitSpy(page);
      await stubCDNResources(page);
      await page.goto('/codigo-padre.html', { waitUntil: 'domcontentloaded' });

      await expect.poll(
        () => page.evaluate(() => globalThis.__vv_stateManager?.getScript2Listo?.() ?? false),
        { timeout: 25_000, message: 'Script 2 tiene que terminar y marcar script2Listo' },
      ).toBe(true);
      if (bloqueado) await expect.poll(() => avisos.length, { timeout: 10_000, message: 'el fallo de carga se dice en el log' }).toBeGreaterThan(0);
      else expect(avisos, 'con el módulo normal no hay aviso').toEqual([]);
    });

    test(`EN-H. hijo4 registra sus handlers (${modo})`, async ({ page }) => {
      const { avisos } = vigilarAvisos(page);
      if (bloqueado) await bloquearModulo(page);
      const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html', { esperarPreparado: false });

      await expect.poll(
        () => hijo.evaluate(() => globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') ?? false),
        { timeout: 15_000, message: 'hijo4 tiene que registrar su handler de cambio de modo' },
      ).toBe(true);
      if (bloqueado) await expect.poll(() => avisos.length, { timeout: 10_000, message: 'el fallo de carga se dice en el log' }).toBeGreaterThan(0);
      else expect(avisos, 'con el módulo normal no hay aviso').toEqual([]);
    });

    test(`EN-Z. El puzzle inicializa su bus (${modo})`, async ({ page }) => {
      const { avisos, consola } = vigilarAvisos(page);
      if (bloqueado) await bloquearModulo(page);
      await abrirHijoEnMarco(page, `puzzle.html?id=P-prueba&imagen=${IMAGEN}`, { esperarPreparado: false });

      await expect.poll(
        () => consola.some((t) => /\[mensajeria\] Inicializando puzzle/.test(t)),
        { timeout: 15_000, message: 'el puzzle tiene que inicializar su bus' },
      ).toBe(true);
      if (bloqueado) await expect.poll(() => avisos.length, { timeout: 10_000, message: 'el fallo de carga se dice en el log' }).toBeGreaterThan(0);
      else expect(avisos, 'con el módulo normal no hay aviso').toEqual([]);
    });
  });
}
