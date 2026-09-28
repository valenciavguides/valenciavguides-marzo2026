'use strict';

/**
 * 112 — Restos de la identidad vieja en los hijos
 *
 * POR QUE EXISTE
 *
 * Antes, cada hijo escribia a mano el `origen` de su `CAMBIO_MODO_ENTENDIDO`, sacandolo de
 * `CONFIG_HIJO.IFRAME_ID`. Como sin ese campo el mensaje salia sin firma, el hijo se protegia
 * comprobandolo antes de enviar, y si faltaba lanzaba `Error('Campos undefined en
 * CAMBIO_MODO_ENTENDIDO')`.
 *
 * Hoy el `origen` lo pone el bus, siempre con el nombre que el frame le dio en
 * `inicializarMensajeria` (GUIA-COMPLETA.md §26.8, segunda capa): lo que el hijo escriba no
 * viaja. `IFRAME_ID` dejo de tener nada que ver con la firma del mensaje — pero la guarda
 * seguia ahi, y con ella un hijo al que le faltara ese campo se negaba a contestar un cambio
 * de modo que puede atender perfectamente. El padre se quedaba esperando su ENTENDIDO hasta
 * agotar el plazo.
 *
 *   RI-1  Quitado `CONFIG_HIJO.IFRAME_ID`, hijo3 sigue contestando el ENTENDIDO, y lo hace
 *         firmado como 'hijo3' — la firma la pone el bus, no el campo que falta.
 *   RI-2  Control con hijo4, el otro hijo que publica su `CONFIG_HIJO`: mismo comportamiento.
 *   RI-3  Control de la via normal, sin tocar nada: hijo3 contesta ENTENDIDO firmado 'hijo3'.
 *
 * ROJO ANTES DEL ARREGLO: RI-1 y RI-2 fallan — el hijo lanza y no contesta nada.
 *
 * Por que solo hijo3 y hijo4: son los dos unicos que publican `globalThis.CONFIG_HIJO`, asi que
 * son los dos unicos a los que un test puede quitarle el campo desde fuera. hijo2 y hijo5
 * tienen la misma guarda sobre el mismo `CONFIG_HIJO` de su modulo, sin publicar; se limpian
 * igual, y su comportamiento normal lo cubre RI-3 aqui y las specs 84 y 96 del cambio de modo.
 */

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

const ENTENDIDO = 'SISTEMA.CAMBIO_MODO_ENTENDIDO';

/** El ENTENDIDO que el hijo haya mandado hacia arriba, o undefined. */
function entendidoRecibido(page) {
  return recibidosPorElMarco(page).then((r) => r.find((m) => m.tipo === ENTENDIDO));
}

/** Le quita a un hijo el `IFRAME_ID` de su CONFIG_HIJO publicado. */
function quitarIframeId(page) {
  return page.evaluate(() => {
    const cfg = document.getElementById('marco-hijo').contentWindow.CONFIG_HIJO;
    if (!cfg || !cfg.IFRAME_ID) throw new Error('El hijo no publica CONFIG_HIJO.IFRAME_ID: el test no mide lo que cree');
    delete cfg.IFRAME_ID;
  });
}

const CAMBIO_MODO = (destino) => ({
  tipo: 'SISTEMA.CAMBIO_MODO',
  origen: 'padre',
  destino,
  datos: { modo: 'aventura', mensajeId: 'ri-1' },
});

test.describe('RI — La firma del ENTENDIDO la pone el bus, no el hijo', () => {
  test('RI-1. hijo3 sin IFRAME_ID sigue contestando el ENTENDIDO, firmado como hijo3', async ({ page }) => {
    await abrirHijoEnMarco(page, 'audio-hijo3.html');
    await quitarIframeId(page);
    await enviarAlHijo(page, CAMBIO_MODO('hijo3'));

    await expect.poll(() => entendidoRecibido(page).then((m) => m?.origen), { timeout: 10_000 })
      .toBe('hijo3');
  });

  test('RI-2. hijo4 sin IFRAME_ID sigue contestando el ENTENDIDO, firmado como hijo4', async ({ page }) => {
    await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await quitarIframeId(page);
    await enviarAlHijo(page, CAMBIO_MODO('hijo4'));

    await expect.poll(() => entendidoRecibido(page).then((m) => m?.origen), { timeout: 10_000 })
      .toBe('hijo4');
  });

  test('RI-3. Control: por la via normal, hijo3 contesta ENTENDIDO firmado como hijo3', async ({ page }) => {
    await abrirHijoEnMarco(page, 'audio-hijo3.html');
    await enviarAlHijo(page, CAMBIO_MODO('hijo3'));

    await expect.poll(() => entendidoRecibido(page).then((m) => m?.origen), { timeout: 10_000 })
      .toBe('hijo3');
  });
});
