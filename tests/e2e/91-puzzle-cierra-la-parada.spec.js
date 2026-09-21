'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

/**
 * PC — el reto de puzzle cierra la parada igual que los demás retos.
 *
 *   PC-0  control: un reto de opción acertado llega al padre con `correcto: true`
 *   PC-1  puzzle resuelto: RETO.COMPLETADO lleva `correcto: true`
 *   PC-2  puzzle con el tiempo agotado: RETO.COMPLETADO lleva `correcto: true`
 *
 * POR QUÉ EXISTE
 *
 * El padre da una parada por completada leyendo `correcto` de RETO.COMPLETADO
 * (`_hdl_RETO_COMPLETADO`, codigo-padre.html). Los retos de opción, de varias respuestas, de
 * texto libre y el botón de saltar lo envían. El puzzle enviaba `completado` en su lugar, así
 * que en AVENTURA una parada con puzzle no se completaba nunca: avanzar no se habilitaba, el
 * botón de saltar reto no se ve en modo puzzle, y reabrir el reto volvía al mismo puzzle. El
 * usuario se quedaba atascado sin salida. MEDIDO en un recorrido real de la Aventura 1, en
 * Av1-P-6 (Plaza de la Virgen), el primer puzzle de la aventura.
 *
 * El tiempo agotado cuenta como reto cumplido, igual que resolverlo: sin eso el usuario
 * volvería a quedarse sin salida.
 *
 * Mira el CAMPO que lee el padre, no solo que el mensaje llegue: comprobar solo la llegada
 * era lo que dejaba pasar este fallo.
 *
 * ROJO ANTES QUE VERDE: con el código anterior, PC-1 y PC-2 caen (llega `completado`, no
 * `correcto`); PC-0 pasa, y es lo que demuestra que el contrato es `correcto`.
 */

const RETO_PUZZLE = {
  id: 'PZ-01',
  tipo: 'puzzle',
  src: 'puzzle.html?id=PZ-01',
  imagenPuzzle: 'imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg',
};

async function mostrarReto(page, hijo, reto, selectorEspera) {
  for (let intento = 0; intento < 10; intento++) {
    await enviarAlHijo(page, { tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4', datos: { retoId: reto.id, retosArray: [reto] } });
    try {
      await hijo.waitForSelector(selectorEspera, { timeout: 1000 });
      return;
    } catch (_e) { /* reintentar */ } // NOSONAR
  }
  await hijo.waitForSelector(selectorEspera, { timeout: 5000 });
}

async function completadoRecibido(page, retoId) {
  let msg = null;
  await expect.poll(async () => {
    msg = (await recibidosPorElMarco(page)).find((m) => m.tipo === 'RETO.COMPLETADO' && m.datos?.retoId === retoId) || null;
    return !!msg;
  }, { timeout: 20_000 }).toBe(true);
  return msg;
}

async function pulsarContinuarDelPuzzle(hijo) {
  const boton = hijo.locator('#btn-puzzle-continuar');
  await expect(boton).toBeVisible({ timeout: 15_000 });
  await boton.click();
}

test.describe('PC — el reto de puzzle cierra la parada igual que los demás retos', () => {
  test('PC-0. Control: un reto de opción acertado llega con correcto: true', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    const reto = { id: 'test-pc-opcion', tipo: 'opcion', pregunta: '¿Test?', opciones: ['A', 'B'], correctas: ['B'] };
    await mostrarReto(page, hijo, reto, 'input[name="op"]');
    await hijo.check('input[name="op"][value="B"]');
    await hijo.locator('button.btn', { hasText: '🫵' }).click();
    await hijo.click('#btnNextAfterReto');
    const msg = await completadoRecibido(page, reto.id);
    expect(msg.datos.correcto).toBe(true);
  });

  test('PC-1. Puzzle resuelto: RETO.COMPLETADO lleva correcto: true', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await mostrarReto(page, hijo, RETO_PUZZLE, '#puzzleIframe');
    // El ⏩ del puzzle es el mismo camino que resolverlo de verdad (endPuzzle(true)).
    await hijo.frameLocator('#puzzleIframe').locator('#skipBtn').click({ timeout: 15_000 });
    await pulsarContinuarDelPuzzle(hijo);
    const msg = await completadoRecibido(page, RETO_PUZZLE.id);
    expect(msg.datos.correcto, `datos recibidos: ${JSON.stringify(msg.datos)}`).toBe(true);
  });

  test('PC-2. Puzzle con el tiempo agotado: RETO.COMPLETADO lleva correcto: true', async ({ page }) => {
    // Adelantar 185 s de reloj ejecuta todos los temporizadores de ese tramo: no cabe en los
    // 60 s por defecto de un test.
    test.setTimeout(180_000);
    await page.clock.install();
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await mostrarReto(page, hijo, RETO_PUZZLE, '#puzzleIframe');
    await expect(hijo.frameLocator('#puzzleIframe').locator('#skipBtn')).toBeVisible({ timeout: 15_000 });
    // 180 s es el tiempo por defecto del puzzle (puzzle.html, `puzzleConfig.tiempo || 180`).
    await page.clock.runFor(185_000);
    await pulsarContinuarDelPuzzle(hijo);
    const msg = await completadoRecibido(page, RETO_PUZZLE.id);
    expect(msg.datos.correcto, `datos recibidos: ${JSON.stringify(msg.datos)}`).toBe(true);
  });
});
