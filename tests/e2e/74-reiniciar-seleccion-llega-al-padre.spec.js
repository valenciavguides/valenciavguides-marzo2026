/**
 * 74 — Responder "no" en el reto R2 tiene que llegar al padre (F1)
 *
 * POR QUE EXISTE
 *
 * Al responder que no en el reto R2 (P15), seleccion vuelve a P1 y avisa al padre con
 * `SELECCION.REINICIAR` para que baje `_codigoValidadoP13` e `_iframesPreCargadosP14`.
 * Ese aviso es un `postMessage` escrito a mano, y el bus del padre (`js/mensajeria.js`)
 * descarta en silencio todo mensaje sin `origen`: sin ese campo el handler no llega a
 * ejecutarse. Asi estuvo, sin que nada lo notara. Ver docs/mensajeria-duplicada-en-hijos.md,
 * Parte II, F1.
 *
 *   RE-1  Control: el mismo mensaje CON `origen`, enviado desde el iframe de seleccion,
 *         si baja las dos banderas. Demuestra que el handler existe y que el montaje
 *         funciona, para que RE-2 no pueda fallar por otro motivo.
 *   RE-2  Camino real: abrir P15, marcar la respuesta negativa y pulsar el boton. El padre
 *         tiene que ejecutar su handler y bajar las dos banderas.
 *
 * ROJO ANTES QUE VERDE: RE-2 falla si el mensaje de seleccion pierde el `origen`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const LOG_HANDLER = /\[SELECCION\.REINICIAR\] Flags P13\/P14 reseteados/;

const subirBanderas = (page) => page.evaluate(() => {
  globalThis._codigoValidadoP13 = true;
  globalThis._iframesPreCargadosP14 = true;
});
const leerBanderas = (page) => page.evaluate(() => ({
  p13: globalThis._codigoValidadoP13,
  p14: globalThis._iframesPreCargadosP14,
}));
const frameSeleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

test.describe('RE — "no" en R2 llega al padre', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => typeof document.getElementById('seleccion')?.contentWindow?.verificarRetoR2 === 'function',
      null, { timeout: 20_000 },
    );
  });

  test('RE-1. Control: con origen, el padre ejecuta su handler y baja las banderas', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await subirBanderas(page);

    await frameSeleccion(page).evaluate(() => {
      globalThis.parent.postMessage({ tipo: 'SELECCION.REINICIAR', origen: 'seleccion' }, globalThis.location.origin);
    });

    await expect.poll(() => leerBanderas(page), { timeout: 5_000 })
      .toEqual({ p13: false, p14: false });
    expect(logs.some((t) => LOG_HANDLER.test(t)), 'y lo hace su handler, no otra cosa').toBe(true);
  });

  test('RE-2. Camino real: marcar "no" y pulsar el boton llega al handler del padre', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await subirBanderas(page);
    const sel = frameSeleccion(page);

    // Abrir P15 como lo hace la app: su entrada carga el reto R2 real.
    const abierta = await sel.evaluate(async () => {
      if (typeof mostrar === 'function') { await mostrar(15); return 'mostrar'; }
      return null;
    });
    test.skip(!abierta, 'No se pudo abrir P15 desde el iframe de seleccion');

    await sel.waitForFunction(() => document.querySelectorAll('input[name="reto-r2"]').length >= 2, null, { timeout: 15_000 });

    // Cualquier opcion que no sea la primera es la negativa: esAfirmativa = opciones[0] === respuesta.
    await sel.evaluate(() => {
      const radios = document.querySelectorAll('input[name="reto-r2"]');
      radios[1].checked = true;
      radios[1].dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('btn-verificar-reto-r2').click();
    });

    await expect.poll(() => logs.some((t) => /respuesta negativa/i.test(t)), { timeout: 5_000 })
      .toBe(true); // precondicion: seleccion tomo de verdad la rama del "no"

    await page.waitForTimeout(2_500);
    const banderas = await leerBanderas(page);
    expect(
      logs.some((t) => LOG_HANDLER.test(t)),
      'F1: el handler SELECCION.REINICIAR del padre tiene que ejecutarse al responder "no"',
    ).toBe(true);
    expect(banderas, 'F1: y las dos banderas de P13/P14 tienen que quedar bajadas').toEqual({ p13: false, p14: false });
  });
});
