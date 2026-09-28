/**
 * 101 — Paso 8.5 de la lavadora (un solo camino donde hoy hay dos): `SISTEMA.NOTIFICACION`
 * llevaba dos eventos, y solo uno tenía consumidor real.
 *
 * POR QUE EXISTE
 *
 * `_hdl_APLICACION_INICIALIZADA` (codigo-padre.html) manda `SISTEMA.NOTIFICACION
 * {evento:'aplicacion_lista'}` a TODOS los `hijosInicializados` al terminar el arranque. En todo
 * el proyecto, solo hijo2 y hijo4 registran un handler para `SISTEMA.NOTIFICACION` — y ese
 * handler solo actúa si `evento === 'PENDING_INICIADO'` (comprobado leyendo el cuerpo completo:
 * cualquier otro valor de `evento`, incluido `'aplicacion_lista'`, entra, se comprueba y se
 * descarta sin hacer nada). `ensurePending()` manda además `PENDING_INICIADO` a hijo3, que no
 * tiene NINGÚN handler de `SISTEMA.NOTIFICACION` — ese envío tampoco tiene consumidor.
 *
 * NO-1  Camino real: al terminar el arranque, ningún hijo recibe ya
 *       `SISTEMA.NOTIFICACION {evento:'aplicacion_lista'}` — nadie lo consumía.
 * NO-2  Camino real: `ensurePending()` ya no manda `SISTEMA.NOTIFICACION` a hijo3 — no tiene
 *       handler para procesarlo.
 * NO-3  Control: hijo2 sigue recibiendo `PENDING_INICIADO` de `ensurePending()` — el único
 *       evento con consumidor real no se toca.
 *
 * ROJO ANTES DEL ARREGLO: NO-1 y NO-2 fallaban (los mensajes muertos sí llegaban).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function escucharNotificacion(page, nombreFrame) {
  const frame = page.frames().find((f) => f.name() === nombreFrame);
  await frame.evaluate((key) => {
    globalThis[key] = [];
    globalThis.addEventListener('message', (e) => {
      if (e.data && e.data.tipo === 'SISTEMA.NOTIFICACION') {
        globalThis[key].push(e.data.datos);
      }
    });
  }, `__notif_${nombreFrame}`);
  return () => frame.evaluate((key) => globalThis[key], `__notif_${nombreFrame}`);
}

test.describe('NO — SISTEMA.NOTIFICACION, un solo evento con consumidor real', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo3'), null, { timeout: 60_000 });
    await page.evaluate(() => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
    });
  });

  test('NO-1. Ningún hijo recibe ya SISTEMA.NOTIFICACION{evento:aplicacion_lista}', async ({ page }) => {
    const leerHijo2 = await escucharNotificacion(page, 'hijo2');
    const leerHijo3 = await escucharNotificacion(page, 'hijo3');
    const leerHijo4 = await escucharNotificacion(page, 'hijo4');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: 'SISTEMA.APLICACION_INICIALIZADA',
      datos: { totalComponentes: 3, tiempoInicializacion: 10, version: '1.0.0' },
    }));
    // VENTANA-OBSERVACION: comprobar la ausencia de aplicacion_lista no admite poll.
    await page.waitForTimeout(500);
    const recibidos = [...await leerHijo2(), ...await leerHijo3(), ...await leerHijo4()];
    const conAplicacionLista = recibidos.filter((d) => d?.evento === 'aplicacion_lista');
    expect(conAplicacionLista, `no debe llegar aplicacion_lista a ningún hijo: ${JSON.stringify(conAplicacionLista)}`).toEqual([]);
  });

  test('NO-2. ensurePending() (vía CAMBIO_PARADA real) ya no manda SISTEMA.NOTIFICACION a hijo3', async ({ page }) => {
    const leerHijo3 = await escucharNotificacion(page, 'hijo3');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-1' } }));
    // VENTANA-OBSERVACION: igual que NO-1, comprobar una ausencia no admite poll.
    await page.waitForTimeout(500);
    const recibidos = await leerHijo3();
    expect(recibidos, `hijo3 no debe recibir SISTEMA.NOTIFICACION: ${JSON.stringify(recibidos)}`).toEqual([]);
  });

  test('NO-3. Control: hijo2 sigue recibiendo PENDING_INICIADO (vía CAMBIO_PARADA real)', async ({ page }) => {
    const leerHijo2 = await escucharNotificacion(page, 'hijo2');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-2' } }));
    // VENTANA-OBSERVACION: PENDING_INICIADO es fire-and-forget sin acuse, sin condición que pollear.
    await page.waitForTimeout(500);
    const recibidos = await leerHijo2();
    const conPending = recibidos.filter((d) => d?.evento === 'PENDING_INICIADO');
    expect(conPending.length, `hijo2 debe seguir recibiendo PENDING_INICIADO: ${JSON.stringify(recibidos)}`).toBeGreaterThan(0);
  });
});
