'use strict';

/**
 * 107 — Paso 9 de la lavadora ("lo muerto"): el segundo cargador de hijo4
 *
 * POR QUE EXISTE
 *
 * `globalThis.diagnosticarHijo4()` era una herramienta de consola sin ningún llamador en el
 * proyecto (`grep` global → 0 referencias fuera de su propia definición). Su paso 3 reasignaba
 * `hijo4Element.src` directamente para "arreglar" un hijo4 sin cargar — un segundo camino de
 * carga, distinto de `_cargarSingleIframe()`/`_cargarUnIframeHijo()`/`_cargarSoloIframeActivacion()`,
 * que **no llamaba a `registrarIframe()`**. Medido antes del arreglo: tras invocarla, hijo4
 * cargaba de verdad (su `src` cambiaba a la URL real) pero `mensajeria.getIframesRegistrados()`
 * no lo incluía — quedaba mudo para el bus, exactamente el síntoma que
 * `project_iframes_sin_registrar.md` describe: sin `registrarIframe()` el padre no puede
 * escribirle. La propia herramienta, pensada para diagnosticar un hijo4 roto, lo dejaba en un
 * estado peor si alguna vez se usaba de verdad.
 *
 * MH-1  `globalThis.diagnosticarHijo4` ya no existe.
 *
 * ROJO ANTES DEL ARREGLO: medido con un spec desechable (no committeado) que invocaba la función
 * y confirmaba `getIframesRegistrados().has('hijo4') === false` tras la carga.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test('MH-1. diagnosticarHijo4 ya no existe (segundo cargador sin registrar, retirado)', async ({ page }) => {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);

  const existe = await page.evaluate(() => typeof globalThis.diagnosticarHijo4);
  expect(existe).toBe('undefined');
});
