/**
 * 43-saltar-reto-puzzle-roto.spec.js
 *
 * Botón de saltar (⏩) en retos-hijo4.html y puzzle.html: dos rescates visibles y
 * decididos por el usuario, no un temporizador ciego. Motivación real (2026-08-18): el
 * usuario puede no ver el reto o no querer hacerlo, y — más importante — un reto o puzzle
 * puede fallar al cargar por un error nuestro (dato roto/no encontrado), sin que eso deba
 * dejarle bloqueado sin salida.
 *
 * Paso 1 (robustez), verificado contra el código real antes de tocar nada: un reto/puzzle
 * roto dejaba dos callejones sin salida distintos.
 *   - puzzle.html lanzaba un `throw` cuando el puzzle no se encontraba, abortando el resto
 *     del script ANTES de registrar los listeners de los botones — visibles en pantalla
 *     pero completamente muertos al pulsarlos.
 *   - retos-hijo4.html, al no encontrar el reto, dejaba en pantalla el contenido del reto
 *     ANTERIOR sin avisar de nada, y si el reintento del padre (js/controladores-padre.js)
 *     también fallaba, este no respondía nada — silencio total en ambos lados de la cadena.
 *
 * Paso 2 (los botones): ⏩ en puzzle.html llama a endPuzzle(true) — reutiliza el mismo
 * camino que resolver el puzzle de verdad — y, si el puzzle sí cargó, coloca todas las
 * piezas en su posición correcta antes de terminar (se ve montado, no solo "completado").
 * ⏩ en retos-hijo4.html (entre 🆘 y el mundo verde) llama a la misma función que usa una
 * respuesta correcta real (_marcarRetoComoCompletado, extraída de verificar() — cero
 * lógica duplicada) y, si el reto sigue cargado, pinta la respuesta correcta en el propio
 * selector (radio/checkbox) o la rellena en el campo de texto.
 *
 * El caso roto (sin retoActual local) resuelve el id a usar vía estado.retoActualId,
 * fijado ahora ANTES de llamar a mostrarReto() — no después: un bug real que este mismo
 * test descubrió durante su desarrollo (mostrarReto() puede tardar esperando la respuesta
 * del padre antes de devolver el control, dejando el id sin fijar justo cuando el botón de
 * saltar más falta hace).
 *
 *   PZ-1  Puzzle válido: saltar monta las piezas (borde verde) y avisa al padre con
 *         PUZZLE.COMPLETADO.
 *   PZ-2  Puzzle roto/no encontrado: sin excepciones, saltar avisa al padre igualmente.
 *   RT-1  Reto de opción válido: saltar marca la respuesta correcta en el selector y
 *         habilita el mundo verde; al pulsarlo, se intenta el envío de RETO.COMPLETADO.
 *   RT-2  Reto roto/no encontrado: el botón de saltar sigue habilitado (a diferencia del
 *         resto de controles) y, al pulsarlo, también habilita el mundo verde.
 */
'use strict';
const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

test.describe('PZ — puzzle.html: botón de saltar (⏩)', () => {
  /**
   * El puzzle vive DENTRO del marco, que le hace de contenedor.
   *
   * Suelto ya no sirve: desde que habla por el bus, un frame sin padre no manda a ninguna
   * parte —el bus lo corta y lo dice en el log—, asi que "avisa al padre" seria imposible de
   * observar. Y es lo que pasa en la aplicacion: el puzzle SIEMPRE está incrustado, en hijo4
   * o en la pantalla de selección.
   *
   * No espera `HIJO_PREPARADO`: el puzzle es un nieto y no hace el saludo de los hijos.
   */
  const abrirPuzzle = (page, query) =>
    abrirHijoEnMarco(page, `puzzle.html?${query}`, { esperarPreparado: false });

  const avisosDelPuzzle = async (page) =>
    (await recibidosPorElMarco(page)).filter((m) => m.origen === 'puzzle');

  test('PZ-1. Puzzle válido: saltar monta las piezas y avisa al padre', async ({ page }) => {
    // La imagen va en la URL: puzzle.html ya no importa puzzles-aventuras.js. Quien abre el
    // puzzle la pone — hijo4 desde reto.imagenPuzzle, o P9 en En-busca-del-tesoro.html
    // (§22.12). Aquí se reproduce esa invocación real.
    const imagen = encodeURIComponent('imagenes/imagenes-aplicación/logo-luna.png');
    const puzzle = await abrirPuzzle(page, `id=PZ-intro&aventura=Aventura1&imagen=${imagen}`);

    await puzzle.click('#skipBtn');
    await expect.poll(async () => (await avisosDelPuzzle(page)).length).toBeGreaterThan(0);

    const [aviso] = await avisosDelPuzzle(page);
    expect(aviso.tipo).toBe('PUZZLE.COMPLETADO');
    expect(aviso.datos.exito).toBe(true);
    expect(aviso.datos.puzzleId).toBe('PZ-intro');

    const borderColor = await puzzle.locator('#puzzleWrapper').evaluate((el) => getComputedStyle(el).borderColor);
    expect(borderColor).toBe('rgb(0, 128, 0)');
  });

  // Este test corre en los CUATRO motores desde que puzzle.html recalcula la escala en
  // `load`. Antes fallaba solo en WebKit por un fallo real del fichero, no del arnés: el
  // <script> de cabecera fija la fuente raíz ANTES del <meta name="viewport">, cuando
  // innerWidth aún vale 980, y WebKit no dispara `resize` para corregirlo (Chromium sí).
  // Se quedaba en 980*0.025 = 24.5px —2,5x de más— y como el fichero mide todo en `em`,
  // #errorMsg se inflaba de y 288-439 a y 77-588, sepultaba la barra de botones y
  // elementFromPoint sobre #skipBtn devolvía #errorMsg: el clic nunca llegaba.
  //
  // Medido tras el arreglo: #errorMsg queda en y 257-407 y el clic entra en #skipBtn.
  test('PZ-2. Puzzle roto/no encontrado: saltar no explota y avisa al padre igualmente', async ({ page }) => {
    const errores = [];
    page.on('pageerror', (e) => errores.push(e.message));

    // Sin parámetro `imagen`: es el caso "puzzle roto" — quien lo abre no supo resolverlo,
    // así que la página no recibe configuración.
    const puzzle = await abrirPuzzle(page, 'id=PZ-NO-EXISTE&aventura=Aventura1');
    await expect(puzzle.locator('#errorMsg')).toBeVisible();

    await puzzle.click('#skipBtn');
    await expect.poll(async () => (await avisosDelPuzzle(page)).length).toBeGreaterThan(0);

    const [aviso] = await avisosDelPuzzle(page);
    expect(aviso.tipo).toBe('PUZZLE.COMPLETADO');
    expect(aviso.datos.puzzleId).toBe('PZ-NO-EXISTE');
    expect(errores.length, `no debe haber excepciones no capturadas: ${errores.join(' | ')}`).toBe(0);
  });
});

/**
 * hijo4 tambien vive dentro del marco, por el mismo motivo que el puzzle: suelto no envia.
 *
 * Manda el reto hasta que su pantalla aparece de verdad. El handler se registra dentro de un
 * callback asincrono, asi que un envio temprano puede caer en el hueco.
 */
async function mostrarReto(page, hijo, datos, selectorEspera) {
  for (let intento = 0; intento < 10; intento++) {
    await enviarAlHijo(page, { tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4', datos });
    try {
      await hijo.waitForSelector(selectorEspera, { timeout: 1000 });
      return;
    } catch (_e) { /* reintentar */ } // NOSONAR
  }
  await hijo.waitForSelector(selectorEspera, { timeout: 5000 });
}

test.describe('RT — retos-hijo4.html: botón de saltar (⏩)', () => {
  test('RT-1. Reto de opción válido: saltar marca la respuesta correcta y habilita el mundo verde', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');

    const reto = { id: 'test-skip-opcion', tipo: 'opcion', pregunta: '¿Test?', opciones: ['A', 'B', 'C'], correctas: ['B'] };
    await mostrarReto(page, hijo, { retoId: reto.id, retosArray: [reto] }, 'input[name="op"]');

    await hijo.click('#btnSaltarReto');

    await expect(hijo.locator('input[name="op"][value="B"]')).toBeChecked();
    await expect(hijo.locator('#btnNextAfterReto')).toBeEnabled();

    await hijo.click('#btnNextAfterReto');

    // El efecto, no su rastro en el log: el padre recibe la compleción.
    await expect.poll(async () => {
      const recibidos = await recibidosPorElMarco(page);
      return recibidos.some((m) => m.tipo === 'RETO.COMPLETADO');
    }, { timeout: 20_000 }).toBe(true);
  });

  test('RT-2. Reto roto/no encontrado: saltar sigue habilitado y habilita el mundo verde', async ({ page }) => {
    const errores = [];
    page.on('pageerror', (e) => errores.push(e.message));
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');

    for (let intento = 0; intento < 10; intento++) {
      await enviarAlHijo(page, {
        tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4',
        datos: { retoId: 'test-skip-roto', retosArray: [] },
      });
      const texto = await hijo.locator('#reto').textContent();
      if (texto && texto.includes('no está disponible')) break;
      // VENTANA-OBSERVACION: reintento del aviso hasta que la pantalla del reto responde
      await page.waitForTimeout(300);
    }
    await expect(hijo.locator('#reto')).toContainText('no está disponible');
    await expect(hijo.locator('#btnSaltarReto')).toBeEnabled();

    await hijo.click('#btnSaltarReto');
    await expect(hijo.locator('#btnNextAfterReto')).toBeEnabled();
    expect(errores.length, `no debe haber excepciones no capturadas: ${errores.join(' | ')}`).toBe(0);
  });
});
