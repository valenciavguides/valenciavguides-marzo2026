/**
 * 99 — Paso 8 de la lavadora (un solo camino donde hoy hay dos), tercer caso:
 * NAVEGACION.ACTUALIZAR_ESTADO doble por cada lectura GPS cercana.
 *
 * POR QUE EXISTE
 *
 * `procesarPosicionGPSParaAventura()` (js/funciones-mapa.js) mandaba a hijo2, para la MISMA
 * lectura GPS, dos mensajes `NAVEGACION.ACTUALIZAR_ESTADO` separados cuando la distancia al
 * destino era ≤50m: uno con la distancia/tolerancia/coordenadas, y otro aparte con solo
 * `{ ubicacionActiva: false }`. El handler de hijo2 (`_aplicarDatosEstado`) fusiona campos por
 * separado —`if (campo !== undefined) estadoComponente.campo = campo`— así que los dos mensajes
 * podían fundirse en uno sin cambiar el estado final; lo único que costaba el segundo mensaje
 * era una segunda pasada completa de `actualizarEstadoBotones()`/detección de llegada.
 *
 * AE-1  Camino real: una lectura GPS a ≤50m del destino activo produce UN SOLO
 *       NAVEGACION.ACTUALIZAR_ESTADO en hijo2, no dos.
 *
 * ROJO ANTES DEL ARREGLO: AE-1 fallaba (2 mensajes por la misma lectura).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Av1-P-0 (Torres de Serranos, start) — js/coordenadas-aventuras.js / js/aventuras-ID-padre.js.
const PARADA = { id: 'Av1-P-0', lat: 39.47876, lng: -0.37626 };

async function esperarPipelineListo(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null,
    { timeout: 15_000 },
  ).catch(() => {});
}

test.describe('AE — Un solo ACTUALIZAR_ESTADO por lectura GPS cercana', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
    await esperarPipelineListo(page);
    await page.evaluate(async (parada) => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
        await globalThis.__cargarDatosAventuraDiferidos();
      }
      if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
        const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
        if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
      }
      const fm = globalThis.funcionesMapa;
      if (typeof fm?.limpiarPorEstado === 'function') {
        fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
        fm.limpiarPorEstado({ modo: 'aventura', paradaActual: parada.id });
      }
    }, PARADA);
  });

  test('AE-1. Una lectura GPS a ≤50m produce un solo ACTUALIZAR_ESTADO en hijo2', async ({ page }) => {
    const frameHijo2 = page.frames().find((f) => f.name() === 'hijo2');
    await frameHijo2.evaluate(() => {
      globalThis.__actualizarEstadoRecibidos = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data && e.data.tipo === 'NAVEGACION.ACTUALIZAR_ESTADO') {
          globalThis.__actualizarEstadoRecibidos.push(e.data.datos);
        }
      });
    });
    await page.evaluate(async (parada) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: parada.lat, longitude: parada.lng, accuracy: 5 },
      });
    }, PARADA);
    await page.waitForTimeout(500);
    const recibidos = await frameHijo2.evaluate(() => globalThis.__actualizarEstadoRecibidos);
    expect(recibidos.length, `debe llegar un solo ACTUALIZAR_ESTADO por lectura: ${JSON.stringify(recibidos)}`).toBe(1);
    expect(recibidos[0]?.ubicacionActiva, 'el único mensaje debe traer también ubicacionActiva').toBe(false);
  });
});
