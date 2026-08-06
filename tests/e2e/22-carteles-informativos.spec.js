/**
 * 22-carteles-informativos.spec.js
 *
 * Prueba de humo end-to-end para los tres carteles no bloqueantes que avisan al
 * usuario en los momentos que antes eran silenciosos (solo cambios de opacidad/color
 * de botones, sin ningún mensaje) — ver docs/GUIA-COMPLETA.md §4.7g/§4.7h/§4.7i.
 *
 *   CI-1  Cartel de transición (§4.7g, ya existente): al completar una parada/tramo,
 *         incluye ahora el icono de #btn-avanzar (fotoruta-A-B.png) y la frase
 *         "Pulse el botón avanzar, por favor." (TRADUCCIONES_CARTEL_TRANSICION.pulseAvanzar).
 *   CI-2  Cartel de inicio de tramo (§4.7h, nuevo): al confirmar por GPS (ventana
 *         deslizante) que el usuario está a ≤20m de .inicio de un tramo, aparece
 *         #cartel-inicio-tramo con el icono de audio y menciona la línea azul —
 *         nunca el de avanzar (el botón no tiene nada nuevo que hacer en ese momento).
 *   CI-3  Cartel de llegada a parada (§4.7i, nuevo): al registrarse pending.llegada=true
 *         por primera vez para una PARADA, aparece #cartel-llegada-parada con el icono
 *         de audio — nunca para un tramo (su aviso de audio vive en CI-2, al principio).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };
const TRAMO = { id: 'Av1-TR-1', inicio: { lat: 39.47876, lng: -0.37626 } };

async function cargarHijo2Real(page) {
  return page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.id = 'hijo2';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:10px;height:10px;';
      iframe.addEventListener('load', () => {
        try { globalThis.mensajeria.registrarIframe('hijo2', iframe); } catch (_e) { /* reportado por el propio test si falla luego */ }
        resolve(true);
      }, { once: true });
      iframe.src = 'coordenadas-hijo2.html';
      document.body.appendChild(iframe);
    });
  });
}

async function prepararComun(page) {
  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
      const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
    return { tieneFunciones: !!globalThis.funcionesMapa?.procesarPosicionGPSParaAventura };
  });
}

test.describe('CI — Carteles informativos no bloqueantes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
  });

  test('CI-1. Cartel de transición incluye icono avanzar + "Pulse el botón avanzar"', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'tramo', 'Plaza de la Crida');
    });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-transicion');
      const img = el?.querySelector('img');
      return { existe: !!el, texto: el?.textContent || '', imgSrc: img?.getAttribute('src') || null, imgLoaded: img ? img.complete && img.naturalWidth > 0 : false };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).toContain('Pulse el botón avanzar');
    expect(info.imgSrc).toContain('fotoruta-A-B.png');
    expect(info.imgLoaded, 'El icono de avanzar debe cargar').toBe(true);
  });

  test('CI-2. Cartel de inicio de tramo aparece con GPS real (ventana deslizante) y menciona la línea azul', async ({ page }) => {
    await cargarHijo2Real(page);
    await page.waitForTimeout(1200);
    const prep = await prepararComun(page);
    test.skip(!prep.tieneFunciones, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(() => {
      const fm = globalThis.funcionesMapa;
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      fm.limpiarPorEstado({ modo: 'aventura', paradaActual: 'Av1-TR-1' });
    });

    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (c) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: c.lat, longitude: c.lng, accuracy: 8 } });
      }, TRAMO.inicio);
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-inicio-tramo');
      const img = el?.querySelector('img');
      return { existe: !!el, texto: el?.textContent || '', imgSrc: img?.getAttribute('src') || null };
    });
    expect(info.existe, 'Debe aparecer al confirmar GPS en .inicio del tramo').toBe(true);
    expect(info.texto).toContain('línea azul');
    expect(info.texto).not.toContain('avanzar');
    expect(info.imgSrc).toContain('boton-audio-central.png');
  });

  test('CI-3. Cartel de llegada a parada aparece con GPS real, nunca para un tramo', async ({ page }) => {
    await cargarHijo2Real(page);
    await page.waitForTimeout(1200);
    const prep = await prepararComun(page);
    test.skip(!prep.tieneFunciones, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate((parada) => {
      const fm = globalThis.funcionesMapa;
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      fm.limpiarPorEstado({ modo: 'aventura', paradaActual: parada.id });
      const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
      const el = elementos?.find(e => e.parada_id === parada.id);
      if (el && globalThis.estado) {
        if (!globalThis.estado.modo) globalThis.estado.modo = {};
        globalThis.estado.modo.actual = 'aventura';
        globalThis.estado.elementoActual = el;
        globalThis.estado.pendingCompleciones = {};
      }
    }, PARADA);

    for (let i = 0; i < 2; i++) {
      await page.evaluate(async (c) => {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: c.lat, longitude: c.lng, accuracy: 8 } });
      }, PARADA);
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-llegada-parada');
      const img = el?.querySelector('img');
      const tramoCartel = document.getElementById('cartel-inicio-tramo');
      return { existe: !!el, texto: el?.textContent || '', imgSrc: img?.getAttribute('src') || null, tramoCartelExiste: !!tramoCartel };
    });
    expect(info.existe, 'Debe aparecer al confirmar GPS de llegada a la parada').toBe(true);
    expect(info.texto).toContain('pulse play');
    expect(info.imgSrc).toContain('boton-audio-central.png');
    expect(info.tramoCartelExiste, 'El cartel de inicio de tramo no debe dispararse para una parada').toBe(false);
  });
});
