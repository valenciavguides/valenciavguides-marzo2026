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

  test('PC-3. El botón verde del puzzle manda RETO.COMPLETADO CON acuse, y sigue por la rama de éxito', async ({ page }) => {
    // Lo que PC-1/PC-2 no pueden ver: que el envío pide acuse y que el acuse llega. Los dos
    // comprueban que el mensaje SALE y qué campos lleva, así que pasarían idénticos con el
    // refuerzo revertido a `enviarMensaje` liso. Aquí se mira el campo que distingue los dos
    // caminos (`requiereConfirmacion`) y el log de la rama que solo se ejecuta si la promesa
    // resuelve — con el refuerzo revertido, ese log no aparece y el caso cae.
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));

    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await mostrarReto(page, hijo, RETO_PUZZLE, '#puzzleIframe');
    await hijo.frameLocator('#puzzleIframe').locator('#skipBtn').click({ timeout: 15_000 });
    await pulsarContinuarDelPuzzle(hijo);

    const msg = await completadoRecibido(page, RETO_PUZZLE.id);
    expect(msg.requiereConfirmacion, `el envío debe pedir acuse; datos: ${JSON.stringify(msg)}`).toBe(true);

    // El marco contestó ese id en concreto, no otro cualquiera.
    await expect.poll(async () => {
      const acusados = await page.evaluate(() => (globalThis.__acusesEnviados || []).map((a) => a.idOriginal));
      return acusados.includes(msg.id);
    }, { timeout: 15_000 }).toBe(true);

    // Y hijo4 salió por la rama de éxito, no por el catch.
    await expect.poll(
      () => logs.some((l) => l.includes('Confirmación recibida del padre') && l.includes('(puzzle)')),
      { timeout: 15_000 }
    ).toBe(true);
    expect(
      logs.some((l) => l.includes('Error enviando/confirmando reto completado (puzzle)')),
      'con el acuse recibido no puede haberse ejecutado el catch'
    ).toBe(false);
  });

  // Los otros tres tipos de reto no pasan por el botón del puzzle sino por #btnNextAfterReto,
  // que ya enviaba con acuse antes de que el puzzle lo hiciera. Que el camino sea más viejo no
  // quiere decir que estuviera probado: PC-0 mira el campo `correcto`, y RC-1 del spec 26 mira
  // que no se envíe antes de tiempo — ninguno de los dos comprueba que el envío pida acuse ni
  // que el acuse llegue. Aquí se cierra ese hueco para los tres a la vez.
  const TIPOS_SIN_PUZZLE = [
    {
      nombre: 'opción única',
      reto: { id: 'pc5-opcion', tipo: 'opcion', pregunta: '¿Test?', opciones: ['A', 'B'], correctas: ['B'] },
      selector: 'input[name="op"]',
      responder: async (hijo) => hijo.check('input[name="op"][value="B"]'),
    },
    {
      nombre: 'varias respuestas',
      reto: { id: 'pc5-multiple', tipo: 'opcion-multiple', multiple: true, pregunta: '¿Test?', opciones: ['A', 'B', 'C'], correctas: ['A', 'C'] },
      selector: 'input[name="op"]',
      responder: async (hijo) => {
        await hijo.check('input[name="op"][value="A"]');
        await hijo.check('input[name="op"][value="C"]');
      },
    },
    {
      nombre: 'texto libre',
      reto: { id: 'pc5-texto', tipo: 'texto', pregunta: '¿Test?', correctas: ['lo que sea'] },
      selector: '#respuestaTexto',
      responder: async (hijo) => hijo.fill('#respuestaTexto', 'una respuesta cualquiera'),
    },
  ];

  for (const caso of TIPOS_SIN_PUZZLE) {
    test(`PC-5 (${caso.nombre}). El botón verde manda RETO.COMPLETADO CON acuse y sigue por la rama de éxito`, async ({ page }) => {
      const logs = [];
      page.on('console', (m) => logs.push(m.text()));

      const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
      await mostrarReto(page, hijo, caso.reto, caso.selector);
      await caso.responder(hijo);
      await hijo.locator('button.btn', { hasText: '🫵' }).click({ timeout: 5000 });
      await hijo.click('#btnNextAfterReto', { timeout: 5000 });

      const msg = await completadoRecibido(page, caso.reto.id);
      expect(msg.datos.correcto, `datos recibidos: ${JSON.stringify(msg.datos)}`).toBe(true);
      expect(msg.requiereConfirmacion, `el envío debe pedir acuse; mensaje: ${JSON.stringify(msg)}`).toBe(true);

      await expect.poll(async () => {
        const acusados = await page.evaluate(() => (globalThis.__acusesEnviados || []).map((a) => a.idOriginal));
        return acusados.includes(msg.id);
      }, { timeout: 15_000 }).toBe(true);

      await expect.poll(
        () => logs.some((l) => l.includes('Confirmación recibida del padre') && l.includes(caso.reto.id)),
        { timeout: 15_000 }
      ).toBe(true);
      expect(
        logs.some((l) => l.includes('Error enviando/confirmando reto completado')),
        'con el acuse recibido no puede haberse ejecutado el catch'
      ).toBe(false);
    });
  }

  test('PC-4. Si el padre no contesta, el reto se cierra igual (el catch no bloquea la ventana)', async ({ page }) => {
    // La otra mitad del contrato: esperar el acuse no puede dejar al usuario encerrado. Con el
    // marco callado, el envío agota su plazo y aun así RETO.OCULTAR tiene que salir.
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await page.evaluate(() => { globalThis.__marcoContestaAcuses = false; });
    await mostrarReto(page, hijo, RETO_PUZZLE, '#puzzleIframe');
    await hijo.frameLocator('#puzzleIframe').locator('#skipBtn').click({ timeout: 15_000 });
    await pulsarContinuarDelPuzzle(hijo);

    await expect.poll(async () => {
      const msgs = await recibidosPorElMarco(page);
      return msgs.some((m) => m.tipo === 'RETO.OCULTAR');
    }, { timeout: 30_000 }).toBe(true);
  });

  test('PC-2. Puzzle con el tiempo agotado: RETO.COMPLETADO lleva correcto: true', async ({ page }) => {
    // 185 pasos de un segundo con fastForward, no runFor(185_000): runFor ejecuta tambien cada
    // fotograma de la animacion del puzzle (draw() se reprograma con requestAnimationFrame
    // mientras el puzzle sigue en marcha), unos 11 500 dibujos del lienzo, y en firefox y WebKit
    // eso solo ya agota el plazo. fastForward dispara cada temporizador vencido una vez por salto:
    // el intervalo de un segundo del puzzle recibe sus 185 ticks, igual que con el usuario.
    test.setTimeout(120_000);
    await page.clock.install();
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await mostrarReto(page, hijo, RETO_PUZZLE, '#puzzleIframe');
    await expect(hijo.frameLocator('#puzzleIframe').locator('#skipBtn')).toBeVisible({ timeout: 15_000 });
    // 180 s es el tiempo por defecto del puzzle (puzzle.html, `puzzleConfig.tiempo || 180`).
    for (let s = 0; s < 185; s++) await page.clock.fastForward(1000);
    await pulsarContinuarDelPuzzle(hijo);
    const msg = await completadoRecibido(page, RETO_PUZZLE.id);
    expect(msg.datos.correcto, `datos recibidos: ${JSON.stringify(msg.datos)}`).toBe(true);
  });
});
