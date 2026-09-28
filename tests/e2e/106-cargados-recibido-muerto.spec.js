'use strict';

/**
 * 106 — Paso 9 de la lavadora ("lo muerto"): DATOS.CARGADOS_RECIBIDO
 *
 * POR QUE EXISTE
 *
 * Fase 3 de un patrón bidireccional que ya no tiene destinatario real: hijo2 confirma que cargó
 * coordenadas/textos (`DATOS.COORDENADAS_CARGADAS`/`DATOS.TEXTOS_CARGADOS`), y el padre le
 * responde ADEMÁS con `DATOS.CARGADOS_RECIBIDO` — una confirmación de la confirmación. El
 * controlador de hijo2 para ese mensaje (docs/mensajeria-duplicada-en-hijos.md §23, "confirmaciones
 * informativas") solo hace `logger.info(...)`, comprobado leyendo su cuerpo completo: no escribe
 * ningún estado, no desbloquea nada, no lo lee nadie más en el proyecto (`grep` global antes del
 * arreglo → 6 referencias, todas en el propio emisor/receptor muertos).
 *
 * CR-1  Camino real: distribuirDatosAventura() hace que hijo2 confirme coordenadas Y textos
 *       cargados (COORDENADAS_CARGADAS + TEXTOS_CARGADOS), y el padre ya no manda
 *       DATOS.CARGADOS_RECIBIDO de vuelta en ninguno de los dos casos.
 *
 * ROJO ANTES DEL ARREGLO: CR-1 fallaba (el mensaje muerto sí llegaba, dos veces).
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('CR — DATOS.CARGADOS_RECIBIDO retirado', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => { globalThis.aventuraSeleccionada = 'Aventura1'; globalThis.idiomaSeleccionado = 'es'; });
    await page.evaluate(async () => {
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
        await globalThis.__cargarDatosAventuraDiferidos();
      }
    });
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estado?.hijosInicializados?.has('hijo2'), null, { timeout: 60_000 });
  });

  async function escucharCargadosRecibido(page) {
    const frame = page.frames().find((f) => f.name() === 'hijo2');
    await frame.evaluate(() => {
      globalThis.__vv_cr = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.tipo === 'DATOS.CARGADOS_RECIBIDO') globalThis.__vv_cr.push(e.data);
      });
    });
    return () => frame.evaluate(() => globalThis.__vv_cr);
  }

  test('CR-1/CR-2. Camino real: distribuirDatosAventura() hace que hijo2 confirme coordenadas y textos, y el padre no manda CARGADOS_RECIBIDO de vuelta', async ({ page }) => {
    const leer = await escucharCargadosRecibido(page);
    await page.evaluate(() => globalThis.distribuirDatosAventura?.('Aventura1', 'es'));
    // VENTANA-OBSERVACION: comprobar la ausencia de CARGADOS_RECIBIDO no admite poll desde este frame.
    await page.waitForTimeout(600);
    const recibidos = await leer();
    expect(recibidos, `no debe llegar CARGADOS_RECIBIDO tras la carga real: ${JSON.stringify(recibidos)}`).toEqual([]);
  });
});
