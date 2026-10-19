/**
 * 143-filtro-de-consola-una-sola-vez.spec.js
 *
 * `js/suppress-warnings.js` envuelve `console.warn`, `console.error` y `console.debug` con su filtro, y cada página lo carga
 * una vez, como script clásico de su `<head>`. Ningún módulo lo importa: en el padre, importado además como módulo, corría dos
 * veces, la segunda envolvía lo que dejó la primera y `__vv_restaurarConsola()` no devolvía la consola de verdad (estudio
 * K-123).
 *
 *   FC-1  En el padre, `__vv_restaurarConsola()` deja `console.warn`, `console.error` y `console.debug` como estaban antes de
 *         que corriera ningún script de la página.
 *   FC-2  Ninguna página ni módulo de `js/` importa `suppress-warnings.js`.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior cae FC-1 (la consola restaurada era la primera envoltura) y FC-2 (los dos import).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const RAIZ = path.resolve(__dirname, '../..');

test.describe('FC — El filtro de la consola, una sola vez', () => {
  test('FC-1. En el padre, restaurar la consola deja la de antes de la página', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    // La última de las de inicio: la consola tal como la encuentran los scripts de la página.
    await page.addInitScript(() => {
      globalThis.__consolaAntes = { warn: console.warn, error: console.error, debug: console.debug };
    });
    await gotoAndWaitForFase1(page);
    const r = await page.evaluate(() => {
      globalThis.__vv_restaurarConsola();
      const a = globalThis.__consolaAntes;
      return { warn: console.warn === a.warn, error: console.error === a.error, debug: console.debug === a.debug };
    });
    expect(r).toEqual({ warn: true, error: true, debug: true });
  });

  test('FC-2. Ninguna página ni módulo importa suppress-warnings.js', () => {
    const ficheros = [
      ...fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html')),
      ...fs.readdirSync(path.join(RAIZ, 'js')).filter((f) => f.endsWith('.js')).map((f) => `js/${f}`),
    ];
    const conImport = ficheros.filter((f) => /import\s*\(?\s*['"`][^'"`]*suppress-warnings\.js|from\s+['"`][^'"`]*suppress-warnings\.js/
      .test(fs.readFileSync(path.join(RAIZ, f), 'utf8')));
    expect(conImport, 'ficheros que lo importan').toEqual([]);
  });
});
