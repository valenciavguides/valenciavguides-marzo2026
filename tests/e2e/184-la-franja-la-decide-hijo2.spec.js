/**
 * 184 — La franja de distancia la decide hijo2, y el padre enseña su pantalla
 *
 * POR QUE EXISTE
 *
 * hijo2 decidía la franja (fuera, desviado, lejos, perdido) para su gracia y su aviso, y el padre volvía a calcularla con su
 * propia cascada por distancia para elegir la pantalla: dos sitios para una decisión. Ahora hijo2 la manda en
 * `NAVEGACION.GPS.RESTRINGIDO` y el padre enseña la pantalla de esa franja (guía §31.4).
 *
 *   FR-1  Con una distancia de 100 m y la franja «lejos», el padre enseña la pantalla de «lejos»: manda la franja.
 *   FR-2  Control: con 100 m y la franja «desviado», la de «desviado».
 *   FR-3  Por el camino real, a 151 m de la parada: hijo2 dice «lejos» y sale la pantalla de «lejos».
 *
 * ROJO ANTES QUE VERDE: con la cascada del padre cae FR-1 (enseña «desviado» por los 100 m); FR-2 y FR-3 pasan antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };
const R = 6371000;
const alNorte = (metros) => ({ lat: PARADA.lat + (metros / R) * (180 / Math.PI), lng: PARADA.lng });

const PANTALLAS = { fuera: 'foto-fuera-rango-overlay', desviado: 'foto-desviado-overlay', lejos: 'foto-lejos-overlay', perdido: 'foto-perdido-overlay' };
/** La pantalla de distancia que se ve (o null). */
const pantalla = (page) => page.evaluate((p) => Object.entries(p).find(([, id]) => document.getElementById(id)?.classList.contains('show'))?.[0] ?? null, PANTALLAS);
const desdeHijo2 = (page, tipo, datos) => page.evaluate(({ tipo, datos }) =>
  document.getElementById('hijo2').contentWindow.mensajeria.enviarMensajeConConfirmacion({ tipo, destino: 'padre', datos, timeout: 15_000 }), { tipo, datos });
const lectura = (page, p) => page.evaluate((x) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: x.lat, longitude: x.lng, accuracy: 5 } }), p);

test.describe('FJ — La franja la decide hijo2', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
      if (!globalThis.AVENTURA_PARADAS?.length) {
        const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
        if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
      }
    });
    await cargarHijosDelPadre(page);
    await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    await expect.poll(() => page.evaluate(() => globalThis.estado.modo?.actual), { timeout: 15_000 }).toBe('aventura');
    expect(await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), PARADA.id)).toMatchObject({ exito: true });
  });

  test('FR-1. Con 100 m y la franja «lejos», la pantalla de «lejos»', async ({ page }) => {
    await desdeHijo2(page, 'NAVEGACION.GPS.RESTRINGIDO', { idParada: PARADA.id, distancia: 100, franja: 'lejos', rangoMaximo: 15, timestampSalioDeRango: Date.now() });
    await expect.poll(() => pantalla(page), { timeout: 10_000 }).toBe('lejos');
  });

  test('FR-2. Control: con 100 m y la franja «desviado», la de «desviado»', async ({ page }) => {
    await desdeHijo2(page, 'NAVEGACION.GPS.RESTRINGIDO', { idParada: PARADA.id, distancia: 100, franja: 'desviado', rangoMaximo: 15, timestampSalioDeRango: Date.now() });
    await expect.poll(() => pantalla(page), { timeout: 10_000 }).toBe('desviado');
  });

  test('FR-3. Por el camino real, a 151 m: «lejos», y su pantalla', async ({ page }) => {
    await expect.poll(async () => { await lectura(page, alNorte(151)); return pantalla(page); },
      { timeout: 15_000, intervals: [300], message: 'a 151 m de la parada, la pantalla de «lejos»' }).toBe('lejos');
  });
});
