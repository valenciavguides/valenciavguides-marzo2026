/**
 * 97 — Paso 8 de la lavadora (un solo camino donde hoy hay dos), primer caso: coordenadas
 * pedidas dos veces por elemento.
 *
 * POR QUE EXISTE
 *
 * `DATOS.COORDENADAS_PARADAS_REQUEST` es uno de los 5 envíos con acuse del proyecto (docs/
 * mensajeria-duplicada-en-hijos.md §3.2): el `return` del handler de hijo2 ya entrega el
 * resultado a quien pidió, vía `enviarMensajeConConfirmacion`. Pero `solicitarCoordenadasHijo`
 * (el helper del fallback de btn-ubicacion y de otros dos sitios) no usaba ese camino: montaba
 * su propio `pedidoId` + `Map` de espera + handler correlador, y hijo2 respondía ADEMÁS con un
 * `enviarMensaje` explícito "para compatibilidad" — dos caminos para la misma respuesta.
 *
 * CO-1  Control: `solicitarCoordenadasHijo` sigue resolviendo con los datos reales de hijo2
 *       (por el camino que sea) — sin esto, un CO-2 en verde no probaría nada.
 * CO-2  Camino real: hijo2 ya NO manda `DATOS.COORDENADAS_PARADAS_RESPONSE` explícito al
 *       resolver una `COORDENADAS_PARADAS_REQUEST` — todo pasa por el acuse.
 *
 * ROJO ANTES DEL ARREGLO: CO-2 fallaba (hijo2 mandaba la respuesta explícita en cada solicitud).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('CO — Coordenadas pedidas dos veces por elemento, un solo camino', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
  });

  test('CO-1. Control: solicitarCoordenadasHijo resuelve (no se queda colgado) con la respuesta de hijo2', async ({ page }) => {
    const respuesta = await page.evaluate(() => globalThis.solicitarCoordenadasHijo('hijo2', { paradaId: 'Av1-P-0', incluirMetadatos: false }, 4000));
    expect(typeof respuesta?.exito, `respuesta inesperada: ${JSON.stringify(respuesta)}`).toBe('boolean');
    expect(Array.isArray(respuesta?.coordenadas)).toBe(true);
  });

  test('CO-2. Camino real: hijo2 no manda COORDENADAS_PARADAS_RESPONSE explícito', async ({ page }) => {
    // No se registra un segundo controlador para el tipo (el padre ya tiene el suyo, y
    // state-manager solo admite uno por tipo) — se espía a nivel de postMessage entrante.
    await page.evaluate(() => {
      globalThis.__coordRespuestasExplicitas = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data && e.data.tipo === 'DATOS.COORDENADAS_PARADAS_RESPONSE') {
          globalThis.__coordRespuestasExplicitas.push(e.data);
        }
      });
    });
    await page.evaluate(() => globalThis.solicitarCoordenadasHijo('hijo2', { paradaId: 'Av1-P-0', incluirMetadatos: false }, 4000).catch(() => null));
    await page.waitForTimeout(500);
    const recibidas = await page.evaluate(() => globalThis.__coordRespuestasExplicitas.length);
    expect(recibidas, 'hijo2 no debe mandar DATOS.COORDENADAS_PARADAS_RESPONSE explícito: el return (acuse) ya lo entrega').toBe(0);
  });
});
