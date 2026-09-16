/**
 * 82 — La pantalla de selección usa la aventura elegida, no la primera
 *
 * POR QUE EXISTE
 *
 * `En-busca-del-tesoro.html` tiene dos ámbitos: un `<script>` clásico con la lógica de pantallas
 * y un `<script type="module">` con la mensajería. El módulo es quien recibe la elección del
 * usuario, y el clásico quien pinta.
 *
 * Un `let` declarado en el script clásico TAPA la propiedad del mismo nombre en `globalThis`:
 * `globalThis.aventuraSeleccionada = v` desde el módulo no cambia el `let` del clásico, y sus
 * lecturas sin prefijo siguen viendo el valor inicial. Por eso existen los puentes
 * `globalThis._setX(...)` — para el idioma había uno; para la aventura no.
 *
 * El fallo es mudo: cada consumidor del script clásico cae en su reserva (`|| 'Aventura1'`), que
 * carga bien, sin error ni hueco en pantalla. Medido antes del arreglo: eligiendo Fallas, el
 * overlay mostraba `Av1_mapa.jpg`.
 *
 * Afecta a los ocho consumidores del script clásico (audio de intro, texto de intro, retos R1 y
 * R2, aviso al padre, activación y el mapa vintage). Se comprueba el mapa porque es el único con
 * un efecto observable directo en el DOM.
 *
 *   SA-1  Control: el módulo recibe la aventura elegida. Sin esto, un SA-2 en rojo podría deberse
 *         a que la elección ni siquiera llega.
 *   SA-2  El mapa vintage que se muestra es el de la aventura elegida, no el de la primera.
 *
 * ROJO ANTES QUE VERDE: sin el puente `_setAventuraSeleccionada`, SA-2 muestra `Av1_mapa.jpg`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const ELEGIDA = 'AventuraFallas';
const MAPA_ESPERADO = 'AvFallas_Mapa.jpg';

test.describe('SA — La selección usa la aventura elegida', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => !!document.getElementById('seleccion')?.contentWindow?.logger,
      null,
      { timeout: 30_000 },
    );
  });

  const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

  test('SA-1. Control: el módulo recibe la aventura elegida', async ({ page }) => {
    const f = seleccion(page);
    expect(
      await f.evaluate(() => typeof globalThis.seleccionarAventura === 'function'),
      'la pantalla tiene que exponer seleccionarAventura',
    ).toBe(true);

    await f.evaluate((a) => globalThis.seleccionarAventura(a), ELEGIDA);
    await expect
      .poll(() => f.evaluate(() => globalThis.aventuraSeleccionada), { timeout: 5_000 })
      .toBe(ELEGIDA);
  });

  test('SA-2. El mapa vintage es el de la aventura elegida, no el de la primera', async ({ page }) => {
    const f = seleccion(page);
    await f.evaluate((a) => globalThis.seleccionarAventura(a), ELEGIDA);
    await page.waitForTimeout(500);

    const src = await f.evaluate(async () => {
      await globalThis.mostrarMapaVintage?.();
      return document.getElementById('mapa-vintage-img')?.src || '(sin src)';
    });

    expect(
      src,
      `el script clásico tiene que ver la aventura elegida; si no, cae en su reserva 'Aventura1' y `
      + `enseña el mapa de otra aventura sin ningún error. Mostrado: ${src}`,
    ).toContain(MAPA_ESPERADO);
  });
});
