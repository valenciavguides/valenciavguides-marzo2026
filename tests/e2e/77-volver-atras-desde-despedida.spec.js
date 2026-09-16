/**
 * 77 — Restaurada desde la cache de atras, la app no puede quedarse vacia (F4)
 *
 * POR QUE EXISTE
 *
 * Al terminar la aventura el padre navega a `En-busca-del-tesoro.html?despedida=1`. Si el
 * usuario pulsa atras y el navegador restaura el padre desde la cache de atras (bfcache) en
 * vez de recargarlo, ocurre esto: al salir, `_limpiarPagehide` (script clasico de
 * codigo-padre.html) borra TODOS los iframes sin mirar `event.persisted`, y al volver no hay
 * ningun `pageshow` que los reconstruya. Ver docs/mensajeria-duplicada-en-hijos.md, §14 y
 * Parte II, F4.
 *
 * POR QUE NO SE NAVEGA DE VERDAD
 *
 * Medido: los cuatro navegadores de Playwright NUNCA restauran desde la cache de atras. Ni
 * con dos paginas estaticas sin iframes, ni quitando `--disable-back-forward-cache` y
 * `--enable-automation`: Chromium responde con el motivo `masked` y Firefox y WebKit
 * recargan sin decir nada. Una navegacion real solo probaria la recarga, que funciona.
 *
 * Asi que se prueba lo unico que depende de la app: su reaccion al viaje. Se disparan los
 * dos eventos que lanza el navegador al guardar y restaurar la pagina, `pagehide` y
 * `pageshow`, con `persisted: true`. `_limpiarPagehide` no mira ese campo, asi que se
 * ejecuta igual que en una navegacion real.
 *
 * LO QUE ESTE TEST NO DICE: si un navegador concreto guardara esta pagina en la cache. Eso lo
 * decide el navegador, y aqui no se puede medir.
 *
 *   VA-1  Tras pagehide(persisted) + pageshow(persisted), la app conserva sus iframes.
 *
 * ROJO ANTES QUE VERDE: mientras pagehide borre los iframes y nadie los reconstruya, VA-1
 * falla.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('VA — La app sobrevive al viaje por la cache de atras', () => {
  test('VA-1. Tras guardarse y restaurarse de la cache, la app conserva sus iframes', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => document.getElementById('seleccion')?.contentDocument?.readyState === 'complete', null, { timeout: 20_000 });

    const antes = await page.evaluate(() => ({
      iframes: document.querySelectorAll('iframe').length,
      seleccion: !!document.getElementById('seleccion'),
      limpiezaExiste: typeof globalThis._limpiarPagehide === 'function',
    }));
    expect(antes.iframes, 'precondicion: la app arranco con iframes').toBeGreaterThan(0);
    expect(antes.limpiezaExiste, 'precondicion: la limpieza de pagehide del padre existe').toBe(true);

    const despues = await page.evaluate(async () => {
      globalThis.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
      globalThis.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
      await new Promise((r) => setTimeout(r, 1_500));
      return {
        iframes: document.querySelectorAll('iframe').length,
        seleccion: !!document.getElementById('seleccion'),
      };
    });

    expect(
      despues.iframes,
      'F4: restaurada de la cache de atras, la app tiene que conservar sus iframes (o reconstruirlos)',
    ).toBe(antes.iframes);
    expect(despues.seleccion, 'F4: y en particular el de seleccion, que es la pantalla visible').toBe(true);
  });

  // Que los iframes sigan EN EL DOM no significa que la app funcione: podrian estar ahi y con la
  // mensajeria muerta. No hay ningun `pageshow` que re-sincronice nada, asi que lo que vuelve
  // tiene que venir ya funcionando por si solo.
  test('VA-2. Tras restaurarse, la app sigue hablando con sus hijos', async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => !!document.getElementById('hijo2')?.contentWindow?.logger, null, { timeout: 60_000 });

    // Control: antes del viaje, hijo2 contesta al latido. Sin esto, un VA-2 en rojo podria
    // deberse a que la escucha nunca funciono.
    const latidos = async () => {
      await page.evaluate(() => {
        globalThis.__latidosVA = [];
        globalThis.addEventListener('message', (e) => {
          if (e.data?.tipo === 'SISTEMA.HEARTBEAT_RESPONSE' && e.data?.origen === 'hijo2') {
            globalThis.__latidosVA.push(e.data.origen);
          }
        });
      });
      await page.evaluate(() => globalThis.mensajeria.enviarMensaje({
        tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
        destino: 'hijo2',
        datos: { timestamp: Date.now() },
      }));
      return page.waitForFunction(() => globalThis.__latidosVA.length > 0, null, { timeout: 8_000 })
        .then(() => true).catch(() => false);
    };

    expect(await latidos(), 'precondicion: antes del viaje, hijo2 contesta al latido').toBe(true);

    await page.evaluate(async () => {
      globalThis.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
      globalThis.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
      await new Promise((r) => setTimeout(r, 1_500));
    });

    expect(
      await latidos(),
      'F4: no basta con que los iframes sigan en el DOM — al volver, el padre tiene que poder '
      + 'seguir hablando con ellos y ellos contestar. Si la limpieza vacio los registros de '
      + 'handlers, esto falla aunque el iframe siga ahi.',
    ).toBe(true);
  });
});
