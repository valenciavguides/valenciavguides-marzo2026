/**
 * 175 — La galería de un tramo marca su llegada con el último número de su cadena
 *
 * POR QUE EXISTE
 *
 * En la galería de un tramo, la primera imagen lleva 📌 con el número de salida y la última 🎯 con el de llegada. El
 * número de mapa de un tramo es una cadena: «6→9», o «7→4→8» cuando pasa por un punto que no tiene parada propia (el 4),
 * y la llegada es el último (el 8). La etiqueta de llegada cogía el segundo, así que «7→4→8» decía que se llegaba al 4.
 * Con los puntos de paso de los monumentos sin fila (la regla del usuario: el número que se pasa sin mencionarse se pone en
 * verde al llegar al siguiente), más tramos llevan cadenas de tres o más.
 *
 *   GL-1  «7→4→8»: la salida, 7; la llegada, 8.
 *   GL-2  Control: «6→9», la salida, 6; la llegada, 9.
 *
 * ROJO ANTES QUE VERDE: con la llegada en el segundo número cae GL-1 (dice 4) y pasa GL-2.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const IMAGEN = 'imagenes/imagenes-aplicación/imagen-no-internet.png';

/** Abre la galería de un tramo con tres imágenes y devuelve lo que dicen sus etiquetas de salida y de llegada. */
async function etiquetas(page, mapaNumero) {
  await page.evaluate(({ img, mapaNumero }) => {
    globalThis.mostrarImagenOverlay('', 'tramo', null, null, { imagenes: [img, img, img], tipo: 'tramo', mapa_numero: mapaNumero });
  }, { img: IMAGEN, mapaNumero });
  await expect.poll(() => page.evaluate(() => document.querySelectorAll('#imagen-overlay .galeria-badge-mapa').length), { timeout: 10_000 })
    .toBeGreaterThan(0);
  // La galería pinta una imagen cada vez: la salida se lee en la primera, y para la llegada se avanza hasta la última.
  const salida = await page.evaluate(() => document.querySelector('#imagen-overlay .galeria-badge-mapa.tramo-inicio-pos')?.textContent ?? null);
  for (let i = 0; i < 5; i++) {
    const hay = await page.evaluate(() => !!document.querySelector('#imagen-overlay .galeria-badge-mapa.tramo-fin-pos'));
    if (hay) break;
    await page.evaluate(() => {
      const flechas = [...document.querySelectorAll('#imagen-overlay .galeria-flecha')].filter((f) => !f.classList.contains('disabled'));
      flechas.at(-1)?.click();
    });
    await page.waitForTimeout(300); // VENTANA-OBSERVACION: la galería cambia de imagen
  }
  const llegada = await page.evaluate(() => document.querySelector('#imagen-overlay .galeria-badge-mapa.tramo-fin-pos')?.textContent ?? null);
  return { salida, llegada };
}

test.describe('GL — La galería de un tramo marca su llegada', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('GL-1. «7→4→8»: la salida, 7; la llegada, 8', async ({ page }) => {
    const e = await etiquetas(page, '7→4→8');
    expect(e.salida, 'la salida es el primero').toBe('7');
    expect(e.llegada, 'la llegada es el último número de la cadena').toBe('8');
  });

  test('GL-2. Control: «6→9», la salida, 6; la llegada, 9', async ({ page }) => {
    const e = await etiquetas(page, '6→9');
    expect(e.salida).toBe('6');
    expect(e.llegada).toBe('9');
  });
});
