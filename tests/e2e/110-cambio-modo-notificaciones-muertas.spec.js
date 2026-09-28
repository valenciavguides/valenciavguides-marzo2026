'use strict';

/**
 * 110 — Paso 9 de la lavadora ("lo muerto"): los tres avisos `cambio_modo_*`/`restauracion_modo`
 * de `js/app.js`, apuntados y diferidos en el paso 8.5
 *
 * POR QUE EXISTE
 *
 * El pipeline de `manejarCambioModo()` manda tres broadcasts de `SISTEMA.NOTIFICACION` con
 * `datos.tipo` (no `datos.evento`): `'cambio_modo_iniciado'` (antes del cambio),
 * `'cambio_modo_completado'` (tras aplicarlo) y `'restauracion_modo'` (si falla y se restaura el
 * modo anterior). Los únicos handlers de `SISTEMA.NOTIFICACION` del proyecto (hijo2, hijo4) solo
 * miran `mensaje.datos?.evento` — nunca `datos.tipo` —, así que estos tres avisos no tenían
 * consumidor posible por diseño, no por casualidad: el propio código de
 * `restaurarEstadoModoAnterior()` ya lo decía en un comentario ("Nadie escucha hoy
 * datos.tipo === 'restauracion_modo'... el payload muerto es tarea del paso 9").
 *
 * Apuntado en el paso 8.5 en vez de arreglado en el momento: a diferencia de los otros
 * broadcasts muertos de esa sesión (fire-and-forget, aislados), estos tres son pasos inline,
 * `await`-eados, con guarda de timeout de 15s, dentro del mismo pipeline central de cambio de
 * modo — mayor superficie de riesgo. Medido ahora: cada llamada es un `enviarMensaje` liso (sin
 * acuse), así que el `withTimeout(...,15000,...)` que las envuelve resuelve casi al instante en
 * la práctica — el riesgo real era menor de lo que parecía.
 *
 * CI-1  Camino real: un CAMBIO_MODO real no manda `SISTEMA.NOTIFICACION{datos.tipo:
 *       'cambio_modo_iniciado'}` a ningún hijo.
 * CI-2  Camino real: el mismo cambio tampoco manda `datos.tipo:'cambio_modo_completado'`.
 *
 * ROJO ANTES DEL ARREGLO: CI-1 y CI-2 fallaban (los dos avisos sí llegaban).
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('CI — Avisos cambio_modo_* muertos, retirados', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estado?.hijosInicializados?.has('hijo2'), null, { timeout: 60_000 });
  });

  async function escucharNotificacionesDeModo(page, nombreFrame) {
    const frame = page.frames().find((f) => f.name() === nombreFrame);
    await frame.evaluate(() => {
      globalThis.__vv_cm = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.tipo === 'SISTEMA.NOTIFICACION' && typeof e.data.datos?.tipo === 'string') {
          globalThis.__vv_cm.push(e.data.datos.tipo);
        }
      });
    }, `__vv_cm_${nombreFrame}`);
    return () => frame.evaluate(() => globalThis.__vv_cm);
  }

  test('CI-1/CI-2. Un CAMBIO_MODO real no manda cambio_modo_iniciado ni cambio_modo_completado', async ({ page }) => {
    const leerHijo2 = await escucharNotificacionesDeModo(page, 'hijo2');
    const leerHijo4 = await escucharNotificacionesDeModo(page, 'hijo4');

    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
      datos: { modo: 'aventura' },
    }));
    // VENTANA-OBSERVACION: comprobar la ausencia de estos dos broadcasts fire-and-forget no admite poll.
    await page.waitForTimeout(800);

    const recibidos = [...await leerHijo2(), ...await leerHijo4()];
    expect(recibidos.includes('cambio_modo_iniciado'), `no debe llegar cambio_modo_iniciado: ${JSON.stringify(recibidos)}`).toBe(false);
    expect(recibidos.includes('cambio_modo_completado'), `no debe llegar cambio_modo_completado: ${JSON.stringify(recibidos)}`).toBe(false);
  });
});
