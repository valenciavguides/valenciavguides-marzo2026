/**
 * 137-nombres-del-indice-sin-reserva-muda.spec.js
 *
 * El nombre de la aventura y el del idioma salen del índice (`js/indice-aventuras.js`) por una función cada uno, y si falta se
 * dice. El padre los enseña en el diálogo de reanudación, en el modal de fin y en los cinco carteles; si el índice no trae la
 * entrada, se enseña el id o el código y el padre lo dice con un error: la reserva existe, pero ruidosa (estudio K-112).
 *
 *   NI-1  Control: con el índice cargado, el cartel de transición enseña el nombre de la aventura, sin ese error.
 *   NI-2  Sin la entrada en el índice, el cartel enseña el id de la aventura y el padre lo dice con un error.
 *   NI-3  El dato no falta: el padre carga el índice en la fase 1 del arranque, antes de que nada lo lea (la comprobación de la
 *         aventura guardada, el diálogo de reanudación, los carteles, el modal de fin, el reloj): recién arrancado, sin elegir
 *         nada, ya lo tiene publicado, y es el mismo módulo que importa cualquiera.
 *   NI-4  La selección importa el índice sin parámetros en la URL: el service worker ya lo pide a la red sin caché HTTP, y un
 *         parámetro distinto en cada visita dejaba una copia más del índice en su caché, que no tiene límite.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior, NI-2 cae (enseñaba el id sin decir nada). NI-1 pasa antes y después. Con el padre
 * y la selección anteriores, NI-3 cae (el índice llegaba en la P15 o al comprobar la aventura guardada) y NI-4 también (`?v=`).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, elegirIdioma } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const AVISO = 'no tiene nombre en el índice';

async function arrancar(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await elegirIdioma(page, 'es');
}

/** Pone la Aventura1 como elegida, publica el índice real o uno vacío y enseña el cartel de transición: devuelve su cabecera. */
async function cabeceraDelCartel(page, { indiceReal }) {
  return page.evaluate(async (real) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.__vv_INDICE_AVENTURAS = real ? (await import('./js/indice-aventuras.js')).INDICE_AVENTURAS : {};
    await globalThis.mostrarCartelTransicion('parada', 'Plaza A', 'parada', 'Plaza B');
    return document.querySelector('#cartel-transicion p')?.textContent ?? null;
  }, indiceReal);
}

test.describe('NI — Los nombres del índice, sin reserva muda', () => {
  test('NI-1. Control: con el índice cargado, el cartel enseña el nombre de la aventura', async ({ page }) => {
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    await arrancar(page);
    expect(await cabeceraDelCartel(page, { indiceReal: true })).toBe('València centro histórico 1');
    expect(errores.filter((t) => t.includes(AVISO)), 'sin el aviso de nombre que falta').toEqual([]);
  });

  test('NI-2. Sin la entrada en el índice, el cartel enseña el id y el padre lo dice', async ({ page }) => {
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    await arrancar(page);
    expect(await cabeceraDelCartel(page, { indiceReal: false })).toBe('Aventura1');
    expect(errores.some((t) => t.includes(AVISO) && t.includes('Aventura1')), 'y lo dice con un error').toBe(true);
  });

  test('NI-3. El padre tiene el índice nada más arrancar, sin elegir nada', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    const r = await page.evaluate(() => ({
      indice: globalThis.__vv_INDICE_AVENTURAS,
      idiomas: globalThis.__vv_MAPEO_IDIOMAS,
      aventura: globalThis.aventuraSeleccionada ?? null,
    }));
    expect(r.aventura, 'sin aventura elegida').toBeNull();
    expect(Object.keys(r.indice || {}).length, 'las aventuras del índice').toBeGreaterThan(0);
    expect(Object.keys(r.idiomas || {}).length, 'los idiomas del índice').toBeGreaterThan(0);
    // Y es el mismo módulo que importa cualquiera (el navegador no lo evalúa dos veces).
    expect(await page.evaluate(async () => globalThis.__vv_INDICE_AVENTURAS === (await import('/js/indice-aventuras.js')).INDICE_AVENTURAS)).toBe(true);
  });

  test('NI-4. La selección importa el índice sin parámetros en la URL', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../En-busca-del-tesoro.html'), 'utf8');
    const imports = html.match(/import\(\s*[`'"][^`'"]*indice-aventuras\.js[^`'"]*[`'"]\s*\)/g) || [];
    expect(imports.length, 'la selección importa el índice').toBeGreaterThan(0);
    expect(imports.filter((i) => i.includes('?')), `imports con parámetros: ${imports.join(' | ')}`).toEqual([]);
  });
});
