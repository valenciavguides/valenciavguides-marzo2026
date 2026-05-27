/**
 * boot.js — Helpers compartidos para los tests E2E de Valencia VGuides
 *
 * Uso estándar en cada spec:
 *
 *   const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
 *   const path = require('path');
 *
 *   test.beforeEach(async ({ page }) => {
 *     await page.addInitScript({ path: path.join(__dirname, 'helpers/leaflet-stub.js') });
 *     await injectInitSpy(page);
 *     await stubCDNResources(page);
 *     await gotoAndWaitForFase1(page);
 *   });
 */

'use strict';

/** Tiempo máximo para que FASE 1 complete (mensajeriaReady + __MENSAJERIA_INICIADA) */
const BOOT_TIMEOUT = 45_000;

/**
 * Inyecta un spy que registra el orden de inicialización.
 * DEBE llamarse ANTES de page.goto() para capturar eventos desde el inicio.
 *
 * Expone en window:
 *   __e2e_initOrder   — array de snapshots ordenados por evento
 *   __e2e_snapshots   — mismo array, alias semántico
 */
async function injectInitSpy(page) {
  await page.addInitScript(() => {
    globalThis.__e2e_initOrder = [];

    // Capturar el momento exacto en que mensajeriaReady se dispara
    // y el estado de las variables críticas en ese instante
    globalThis.addEventListener('mensajeriaReady', function () {
      globalThis.__e2e_initOrder.push({
        event: 'mensajeriaReady',
        ts: performance.now(),
        // ¿Estaba state-manager listo ANTES de que mensajeriaReady se disparara?
        hasStateManager: typeof globalThis.__vv_stateManager === 'object' && globalThis.__vv_stateManager !== null,
        // ¿Estaba globalThis.mensajeria disponible en ese momento?
        hasMensajeria: typeof globalThis.mensajeria === 'object' && globalThis.mensajeria !== null,
        // ¿Se había marcado como iniciada?
        mensajeriaIniciada: globalThis.__MENSAJERIA_INICIADA === true,
        // Cola de controladores pendientes en ese momento
        pendientesCuenta: Array.isArray(globalThis.__CONTROLADORES_PENDIENTES)
          ? globalThis.__CONTROLADORES_PENDIENTES.length
          : 0,
      });
    }, { once: true });
  });
}

/**
 * Intercepta los recursos CDN (unpkg.com, cdnjs.cloudflare.com) y los reemplaza
 * con stubs vacíos para que los tests no dependan de internet.
 *
 * Leaflet real es reemplazado por el stub de leaflet-stub.js inyectado con addInitScript.
 * Los CSS de CDN se retornan vacíos (no son necesarios para los tests).
 *
 * DEBE llamarse ANTES de page.goto().
 */
async function stubCDNResources(page) {
  // unpkg.com — Leaflet y plugins
  await page.route('**/unpkg.com/**', async route => {
    const url = route.request().url();
    if (url.match(/\.(css)(\?|$)/)) {
      await route.fulfill({ contentType: 'text/css', body: '/* stubbed by E2E */' });
    } else {
      // JS de Leaflet y plugins — vacío; globalThis.L ya está definido por leaflet-stub.js
      await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed by E2E */' });
    }
  });

  // cdnjs.cloudflare.com — preconnect, posibles fuentes adicionales
  await page.route('**/cdnjs.cloudflare.com/**', async route => {
    const url = route.request().url();
    if (url.match(/\.css(\?|$)/)) {
      await route.fulfill({ contentType: 'text/css', body: '/* stubbed */' });
    } else {
      await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed */' });
    }
  });
}

/**
 * Navega a /codigo-padre.html y espera hasta que FASE 1 haya completado.
 *
 * Indicador: globalThis.__MENSAJERIA_INICIADA === true
 * Este flag se pone a true justo después de:
 *   1. mensajeria.inicializarMensajeria() completado
 *   2. mensajeriaReady event disparado
 *   3. procesarControladoresPendientes() ejecutado
 *
 * @param {import('@playwright/test').Page} page
 */
async function gotoAndWaitForFase1(page) {
  // Suprimir errores de consola que no son relevantes para los tests
  // (p. ej. warnings de serviceworker, Leaflet stub, etc.)
  page.on('console', msg => {
    if (msg.type() === 'error') {
      // Solo loguear errores reales, no los esperables del stub
      const text = msg.text();
      if (!text.includes('leaflet') && !text.includes('stub') && !text.includes('Service Worker')) {
        // No lanzamos excepción — dejamos que los tests fallen por sus propias aserciones
        // console.error('[PAGE ERROR]', text);
      }
    }
  });

  await page.goto('/codigo-padre.html', { waitUntil: 'domcontentloaded' });

  // Esperar a que FASE 1 complete.
  // En WebKit/iOS algunos arranques pueden tardar más de lo esperado;
  // si expira, no abortamos el beforeEach y dejamos que las aserciones del test
  // reporten el estado real de disponibilidad de la API.
  try {
    await page.waitForFunction(
      () => {
        if (globalThis.__MENSAJERIA_INICIADA === true) return true;

        const apiLista =
          typeof globalThis.mensajeria === 'object' &&
          globalThis.mensajeria !== null &&
          typeof globalThis.registrarControlador === 'function' &&
          typeof globalThis.enviarMensaje === 'function' &&
          typeof globalThis.TIPOS_MENSAJE === 'object' &&
          globalThis.TIPOS_MENSAJE !== null;

        return apiLista;
      },
      null,
      { timeout: BOOT_TIMEOUT }
    );
  } catch (_bootError) {
    await page.evaluate(() => {
      globalThis.__e2e_bootTimedOut = true;
    });
  }
}

/**
 * Obtiene el snapshot del evento mensajeriaReady registrado por el spy.
 * Lanza AssertionError si el spy no capturó el evento.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Object>}
 */
async function getMensajeriaReadySnapshot(page) {
  const order = await page.evaluate(() => globalThis.__e2e_initOrder);
  const snapshot = (order || []).find(e => e.event === 'mensajeriaReady');
  if (!snapshot) {
    throw new Error(
      'El spy no capturó el evento mensajeriaReady. ' +
      '¿Se llamó injectInitSpy() antes de page.goto()?'
    );
  }
  return snapshot;
}

module.exports = {
  BOOT_TIMEOUT,
  injectInitSpy,
  stubCDNResources,
  gotoAndWaitForFase1,
  getMensajeriaReadySnapshot,
};
