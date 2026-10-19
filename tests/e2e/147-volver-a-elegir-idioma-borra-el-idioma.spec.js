/**
 * 147 — Volver a elegir idioma borra el idioma guardado (estudio, K-125)
 *
 * POR QUE EXISTE
 *
 * Hay ocho vueltas a la elección de idioma. En cinco se borra el idioma guardado (`vv_idioma`): las dos «elegir otra» y
 * las tres salidas del final, que vacían el dispositivo entero. Decisión del usuario: se borra en las ocho. Las tres que
 * faltaban vuelven sin recargar, y el padre, único escritor del idioma, lo borra al recibir `SELECCION.REINICIAR`:
 *
 *   VI-1  «No» en el reto R-2 (P16): vuelve a la P1.
 *   VI-2  «No, cambiar» en la confirmación del idioma (P3): vuelve a las banderas.
 *   VI-3  «No» en el aviso de que la aventura no tiene audio en ese idioma (P9): vuelve a las banderas.
 *
 * Cada test elige antes el idioma como la bandera (`seleccionarIdioma`, con acuse del padre) y comprueba que el padre lo
 * ha guardado: sin eso, «borrado» no demostraría nada.
 *
 * ROJO ANTES QUE VERDE: con el padre y la selección anteriores, los tres caen (el idioma sigue guardado).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const aLaVista = (f) => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id));
const idiomaGuardado = (page) => page.evaluate(() => localStorage.getItem('vv_idioma'));

/** Elige idioma como la bandera de P2, y espera a que el padre lo haya guardado y la selección esté en P3. */
async function elegirIdioma(page, f, idioma) {
  await f.evaluate((i) => globalThis.seleccionarIdioma(i), idioma);
  await expect.poll(() => idiomaGuardado(page), { timeout: 10_000 }).toBe(idioma);
  await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
}

test.describe('VI — volver a elegir idioma borra el idioma guardado', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    // El bus de la selección tiene que estar montado antes de elegir: elegir avisa al padre.
    await page.waitForFunction(
      () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
      null, { timeout: 20_000 },
    );
  });

  test('VI-1. «No» en el reto R-2: vuelve a la P1 y el idioma guardado se borra', async ({ page }) => {
    const f = seleccion(page);
    await elegirIdioma(page, f, 'es');
    // Abrir P16 como lo hace la app: su entrada carga el reto R-2 de la aventura elegida.
    await f.evaluate(async () => { aventuraSeleccionada = 'Aventura1'; await mostrar(16); });
    await f.waitForFunction(() => document.querySelectorAll('input[name="reto-r2"]').length >= 2, null, { timeout: 15_000 });
    // Cualquier opción que no sea la primera es la negativa: esAfirmativa = opciones[0] === respuesta.
    await f.evaluate(() => {
      const radios = document.querySelectorAll('input[name="reto-r2"]');
      radios[1].checked = true;
      radios[1].dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('btn-verificar-reto-r2').click();
    });
    await expect.poll(() => idiomaGuardado(page), { timeout: 8_000 }).toBeNull();
    await expect.poll(() => aLaVista(f), { timeout: 5_000 }).toEqual(['pantalla1']);
  });

  test('VI-2. «No, cambiar» en la confirmación del idioma: vuelve a las banderas y el idioma guardado se borra', async ({ page }) => {
    const f = seleccion(page);
    await elegirIdioma(page, f, 'fr');
    await f.evaluate(() => document.querySelector('#pantalla3 .btn-mundo-rojo').click());
    await expect.poll(() => idiomaGuardado(page), { timeout: 5_000 }).toBeNull();
    expect(await aLaVista(f), 'en las banderas').toEqual(['pantalla2']);
  });

  test('VI-3. «No» en el aviso sin audio: vuelve a las banderas y el idioma guardado se borra', async ({ page }) => {
    const f = seleccion(page);
    // La Aventura1 no tiene ningún audio en inglés (js/audios-aventuras.js): confirmarla saca el aviso.
    await elegirIdioma(page, f, 'en');
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; void confirmarAventura(); });
    await expect.poll(() => f.evaluate(() => getComputedStyle(document.getElementById('audio-warning-overlay')).display), { timeout: 10_000 })
      .toBe('flex');
    await f.evaluate(() => document.getElementById('audio-warning-no').closest('button').click());
    await expect.poll(() => idiomaGuardado(page), { timeout: 5_000 }).toBeNull();
    expect(await aLaVista(f), 'en las banderas').toEqual(['pantalla2']);
  });
});
