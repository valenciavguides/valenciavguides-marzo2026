/**
 * 140-puzzle-un-solo-bucle-de-dibujo.spec.js
 *
 * El puzzle dibuja con un solo bucle de `requestAnimationFrame`. `draw()` pinta en el acto cuando la llaman directamente (al
 * empezar, al redimensionar, al hacerse visible, al reiniciar) y solo programa el siguiente fotograma si no hay ya uno
 * pendiente: ninguna de esas llamadas deja un segundo bucle encima del primero (estudio K-115).
 *
 * La medida no depende de la velocidad de la máquina: cada bucle vivo tiene en todo momento un fotograma pendiente, así que
 * los fotogramas pendientes del frame del puzzle dicen cuántos bucles hay.
 *
 *   UB-1  Con el puzzle en marcha y a la vista, hay un solo bucle.
 *   UB-2  Tras tres `resize` seguidos (girar el móvil, las barras del navegador), sigue habiendo uno.
 *   UB-3  Reiniciar con el puzzle en marcha no deja un segundo bucle.
 *
 * ROJO ANTES QUE VERDE: con el `puzzle.html` anterior caen UB-1 (dos bucles desde el principio: el de empezar y el de hacerse
 * visible), UB-2 y UB-3.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco } = require('./helpers/boot');

const IMAGEN = encodeURIComponent('imagenes/imagenes-aplicación/logo-luna.png');

/** En cada frame que no es el de arriba (aquí, solo el del puzzle), apunta los fotogramas pendientes. Firefox ejecuta el
 *  script de inicio con el iframe aún en blanco y conserva la ventana al cargar el puzzle, así que no se filtra por la URL. */
async function contarFotogramas(page) {
  await page.addInitScript(() => {
    if (globalThis === globalThis.top) return;
    const pedir = globalThis.requestAnimationFrame.bind(globalThis);
    const cancelar = globalThis.cancelAnimationFrame.bind(globalThis);
    const pendientes = new Set();
    globalThis.__fotogramasPendientes = pendientes;
    globalThis.requestAnimationFrame = (cb) => {
      const id = pedir((t) => { pendientes.delete(id); cb(t); });
      pendientes.add(id);
      return id;
    };
    globalThis.cancelAnimationFrame = (id) => { pendientes.delete(id); cancelar(id); };
  });
}

const bucles = (puzzle) => puzzle.evaluate(() => globalThis.__fotogramasPendientes?.size ?? -1);

async function abrirPuzzleEnMarcha(page) {
  await contarFotogramas(page);
  const puzzle = await abrirHijoEnMarco(page, `puzzle.html?id=PZ-intro&imagen=${IMAGEN}`, { esperarPreparado: false });
  // En marcha: la imagen cargada, las piezas repartidas y el bucle dibujando.
  await expect.poll(() => bucles(puzzle), { timeout: 15_000 }).toBeGreaterThan(0);
  // VENTANA-OBSERVACION: el IntersectionObserver redimensiona 100 ms después de hacerse visible.
  await puzzle.waitForTimeout(600);
  return puzzle;
}

test.describe('UB — El puzzle dibuja con un solo bucle', () => {
  test('UB-1. Con el puzzle en marcha y a la vista, hay un solo bucle', async ({ page }) => {
    const puzzle = await abrirPuzzleEnMarcha(page);
    expect(await bucles(puzzle)).toBe(1);
  });

  test('UB-2. Tras tres resize seguidos, sigue habiendo uno', async ({ page }) => {
    const puzzle = await abrirPuzzleEnMarcha(page);
    await puzzle.evaluate(() => { for (let i = 0; i < 3; i++) globalThis.dispatchEvent(new Event('resize')); });
    // VENTANA-OBSERVACION: los tres resize no dejan un segundo bucle (algo que NO debe ocurrir).
    await puzzle.waitForTimeout(300);
    expect(await bucles(puzzle)).toBe(1);
  });

  test('UB-3. Reiniciar con el puzzle en marcha no deja un segundo bucle', async ({ page }) => {
    const puzzle = await abrirPuzzleEnMarcha(page);
    await puzzle.click('#restartBtn');
    // VENTANA-OBSERVACION: reiniciar no deja un segundo bucle (algo que NO debe ocurrir).
    await puzzle.waitForTimeout(300);
    expect(await bucles(puzzle)).toBe(1);
  });
});
