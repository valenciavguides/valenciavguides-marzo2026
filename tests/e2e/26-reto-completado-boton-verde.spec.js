'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

/**
 * RC — `RETO.COMPLETADO` sale al pulsar el botón verde, y no antes.
 *
 *   RC-1  responder bien deja la compleción pendiente; el envío sale al pulsar el verde
 *   RC-2  sin pulsar el verde no sale nunca
 *
 * POR QUÉ EXISTE
 *
 * Responder correctamente y avanzar de parada son dos cosas distintas. Si hijo4 avisara al
 * padre nada más acertar, el padre daría la parada por completada mientras el usuario sigue
 * leyendo la enhorabuena, y el mapa avanzaría solo. La compleción se guarda en
 * `_pendienteCompletado` y se manda cuando el usuario pulsa el botón verde.
 *
 * CÓMO MIRA, Y POR QUÉ ASÍ
 *
 * hijo4 se abre DENTRO de `helpers/marco-vacio.html`, que le hace de padre, y se comprueba
 * lo que de verdad le llega a ese padre.
 *
 * Antes se cargaba `retos-hijo4.html` como página de primer nivel y se le inyectaba un
 * `globalThis.mensajeria` de mentira. Eso ya no vale, y no por estilo: desde que hijo4 habla
 * por el bus, un hijo sin padre no envía a ninguna parte —el bus lo corta y lo dice en el
 * log—, así que el muñeco no estaba evitando una espera, estaba sustituyendo al sujeto. Un
 * test que se inventa el canal comprueba su propio montaje.
 *
 * Y se mira el mensaje que llega, no una línea de log. El log era un rastro indirecto de la
 * misma acción; el mensaje ES la acción.
 */

const HIJO4 = 'retos-hijo4.html';
const RETO = { id: 'test-reto-1', tipo: 'texto', pregunta: '¿Test?', correctas: [] };

/** El padre le manda el reto, como en la aplicación. */
function mandarRetoMostrar(page) {
  return enviarAlHijo(page, {
    tipo: 'RETO.MOSTRAR',
    origen: 'padre',
    destino: 'hijo4',
    datos: { retoId: RETO.id, retosArray: [RETO] },
  });
}

/**
 * Manda el reto hasta que la pantalla del reto aparece de verdad. El handler se registra
 * dentro de un callback asíncrono, así que un envío temprano puede caer en el hueco.
 */
async function mostrarReto(page, hijo) {
  for (let intento = 0; intento < 10; intento++) {
    await mandarRetoMostrar(page);
    try {
      await hijo.waitForSelector('#respuestaTexto', { timeout: 1000 });
      return;
    } catch (_e) { /* reintentar */ }
  }
  await hijo.waitForSelector('#respuestaTexto', { timeout: 5000 });
}

async function seEnvioCompletado(page) {
  const recibidos = await recibidosPorElMarco(page);
  return recibidos.some((m) => m.tipo === 'RETO.COMPLETADO');
}

test.describe('RC — RETO.COMPLETADO se confirma al pulsar el botón verde, no antes', () => {
  test('RC-1. Responder bien no lo envía; pulsar el botón verde sí', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, HIJO4);
    await mostrarReto(page, hijo);

    await hijo.locator('.btn', { hasText: '🫵' }).click({ timeout: 5000 });

    // Demuestra que algo NO ocurre todavía: no hay condición a la que esperar.
    // VENTANA-OBSERVACION: margen para que un envío indebido llegara al marco
    await page.waitForTimeout(400);
    expect(await seEnvioCompletado(page), 'acertar no puede mandar RETO.COMPLETADO por sí solo').toBe(false);

    await hijo.locator('#btnNextAfterReto').click({ timeout: 5000 });

    await expect.poll(() => seEnvioCompletado(page), { timeout: 20_000 }).toBe(true);
  });

  test('RC-2. Si nunca se pulsa el botón verde, nunca se envía', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, HIJO4);
    await mostrarReto(page, hijo);

    await hijo.locator('.btn', { hasText: '🫵' }).click({ timeout: 5000 });

    // VENTANA-OBSERVACION: RC-2 comprueba que sin pulsar el botón verde NUNCA se envía
    await page.waitForTimeout(8000);
    expect(await seEnvioCompletado(page), 'sin el botón verde no puede salir RETO.COMPLETADO').toBe(false);
  });
});
