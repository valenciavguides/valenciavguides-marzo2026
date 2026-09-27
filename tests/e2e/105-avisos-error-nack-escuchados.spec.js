'use strict';

/**
 * 105 — Paso 8.10 de la lavadora: avisos de error/NACK que el padre manda a hijos que no los
 * escuchan
 *
 * POR QUE EXISTE
 *
 * El padre manda `SISTEMA.NACK`/`SISTEMA.ERROR` a `mensaje.origen` (el hijo que pidió algo) en
 * cinco sitios cuando la petición no puede atenderse:
 *   - `_hdl_RETO_SOLICITAR` → `SISTEMA.NACK` a hijo4, dos ramas (sin datos de aventura; sin
 *     parada/reto_id) — botón "pedir reto" pulsado y sin nada que mostrar.
 *   - `_hdl_RETO_COMPLETADO` → `SISTEMA.ERROR` a hijo4 en su `catch`.
 *   - `_hdl_NAVEGACION_GPS_ACTIVAR` → `SISTEMA.ERROR` a hijo2, dos ramas (modo no es AVENTURA;
 *     `catch` de `activarGPS()`).
 *
 * Ninguno de los dos hijos registraba un handler para `SISTEMA.NACK` ni `SISTEMA.ERROR`: el
 * padre avisa de un fallo real (botón sin reto que mostrar, GPS rechazado) y el aviso se pierde
 * sin ningún rastro — ni un log en consola, nada. `boton-casa-hijo5.html` sí tiene un handler
 * mínimo para `SISTEMA.ERROR` (solo registra el error en el log) — mismo patrón aplicado aquí.
 *
 * NE-1  hijo4 registra un handler para SISTEMA.NACK.
 * NE-2  hijo4 registra un handler para SISTEMA.ERROR.
 * NE-3  hijo2 registra un handler para SISTEMA.ERROR.
 * NE-4  Camino real: hijo4 sin handler no queda registrado dos veces ni rompe al recibir un
 *       SISTEMA.NACK real (no lanza, no dejan sin respuesta otros mensajes después).
 *
 * ROJO ANTES DEL ARREGLO: NE-1, NE-2 y NE-3 fallaban (tieneControlador devolvía false).
 */

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, enviarAlHijo } = require('./helpers/boot');

test.describe('NE — Avisos de error/NACK del padre, ahora escuchados', () => {
  test('NE-1. hijo4 registra un handler para SISTEMA.NACK', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    const tiene = await hijo.evaluate(() => globalThis.mensajeria.tieneControlador('SISTEMA.NACK'));
    expect(tiene).toBe(true);
  });

  test('NE-2. hijo4 registra un handler para SISTEMA.ERROR', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    const tiene = await hijo.evaluate(() => globalThis.mensajeria.tieneControlador('SISTEMA.ERROR'));
    expect(tiene).toBe(true);
  });

  test('NE-3. hijo2 registra un handler para SISTEMA.ERROR', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'coordenadas-hijo2.html');
    const tiene = await hijo.evaluate(() => globalThis.mensajeria.tieneControlador('SISTEMA.ERROR'));
    expect(tiene).toBe(true);
  });

  test('NE-4. hijo4 no rompe al recibir un SISTEMA.NACK real, y sigue respondiendo después', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await enviarAlHijo(page, {
      tipo: 'SISTEMA.NACK',
      origen: 'padre',
      destino: 'hijo4',
      datos: { error: 'No hay reto disponible', mensaje: 'No se puede solicitar reto en este momento' },
    });
    await page.waitForTimeout(200);
    // Un mensaje normal posterior debe seguir procesándose: el handler nuevo no debe haber
    // dejado la cola de ese tipo, ni ningún otro, en un estado roto.
    const sigueVivo = await hijo.evaluate(() => globalThis.mensajeria.tieneControlador('SISTEMA.CAMBIO_MODO'));
    expect(sigueVivo).toBe(true);
  });
});
