/**
 * 137-nombres-del-indice-sin-reserva-muda.spec.js
 *
 * El nombre de la aventura y el del idioma salen del índice (`js/indice-aventuras.js`) por una función cada uno, y si falta se
 * dice. El padre los enseña en el diálogo de reanudación, en el modal de fin y en los cinco carteles; si el índice no trae la
 * entrada, se enseña el id o el código y el padre lo dice con un error: la reserva existe, pero ruidosa (estudio K-112).
 *
 *   NI-1  Control: con el índice cargado, el cartel de transición enseña el nombre de la aventura, sin ese error.
 *   NI-2  Sin la entrada en el índice, el cartel enseña el id de la aventura y el padre lo dice con un error.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior, NI-2 cae (enseñaba el id sin decir nada). NI-1 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
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
});
