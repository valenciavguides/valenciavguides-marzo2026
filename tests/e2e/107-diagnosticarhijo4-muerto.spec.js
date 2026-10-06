'use strict';

/**
 * 107 — Paso 9 de la lavadora ("lo muerto"): el segundo cargador de hijo4
 *
 * POR QUE EXISTE
 *
 * `globalThis.diagnosticarHijo4()` era una herramienta de consola sin ningún llamador en el
 * proyecto (`grep` global → 0 referencias fuera de su propia definición). Su paso 3 reasignaba
 * `hijo4Element.src` directamente para "arreglar" un hijo4 sin cargar — un segundo camino de
 * carga, distinto del cargador único de hijos (`cargarHijo()`),
 * que **no llamaba a `registrarIframe()`**. Medido antes del arreglo: tras invocarla, hijo4
 * cargaba de verdad (su `src` cambiaba a la URL real) pero `mensajeria.getIframesRegistrados()`
 * no lo incluía — quedaba mudo para el bus, exactamente el síntoma que
 * `project_iframes_sin_registrar.md` describe: sin `registrarIframe()` el padre no puede
 * escribirle. La propia herramienta, pensada para diagnosticar un hijo4 roto, lo dejaba en un
 * estado peor si alguna vez se usaba de verdad.
 *
 * MH-1  `globalThis.diagnosticarHijo4` ya no existe.
 * MH-2  `mostrarHijo4` solo muestra a hijo4: si no está cargado no lo carga por su cuenta (lo carga únicamente `cargarHijo`).
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

test('MH-2. mostrarHijo4 solo muestra a hijo4: si no está cargado no lo carga por su cuenta', async ({ page }) => {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);

  const estado = () => page.evaluate(() => ({
    src: document.getElementById('hijo4').getAttribute('src'),
    registrados: [...globalThis.mensajeria.getIframesRegistrados().keys()],
  }));
  const antes = await estado();
  expect(antes.src, 'precondición: hijo4 todavía sin cargar').toBeFalsy();

  await page.evaluate(() => globalThis.mostrarHijo4());

  // hijo4 lo carga solo el cargador único (`cargarHijo`), que lo registra en el bus y espera su HIJO_LISTO. Un segundo camino de carga
  // dentro de `mostrarHijo4` lo cargaría sin ninguna de las dos cosas.
  const despues = await estado();
  expect(despues.src, 'mostrarHijo4 no le asigna el src').toBeFalsy();
  expect(despues.registrados, 'ni lo registra en el bus por su cuenta').not.toContain('hijo4');
});
