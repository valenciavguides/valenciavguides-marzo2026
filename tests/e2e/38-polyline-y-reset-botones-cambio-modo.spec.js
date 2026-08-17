/**
 * 38-polyline-y-reset-botones-cambio-modo.spec.js
 *
 * Dos limpiezas al cambiar de modo (2026-08-17), ambas parte del mismo barrido de
 * _hdl_SISTEMA_CAMBIO_MODO / _resetarEstadoParaModo:
 *   A) La polyline manual del botón ubicación (funcionesMapa.dibujarPolylineNavegacion)
 *      debe limpiarse al entrar en CASA — antes podía quedar dibujada de una sesión de
 *      AVENTURA anterior.
 *   B) coordenadas-hijo2.html: idParadaActual/btnAvanzarCompletadoPorPadre y el resto
 *      de estado de progreso deben resetear al volver a CASA, aunque avanzar hubiera
 *      quedado genuinamente habilitado en AVENTURA (parada completada) — antes
 *      _resetarEstadoParaModo() no tocaba estas propiedades, así que un cambio de modo
 *      podía dejar avanzar habilitado sin que el usuario hubiera completado nada en la
 *      nueva sesión.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const TRAMO = { id: 'Av1-TR-1', inicio: { lat: 39.478760, lng: -0.376260 } };

test.describe('PB-A — Polyline manual se limpia al cambiar a CASA', () => {
  test.beforeEach(async ({ page, context }) => {
    // Sin esto, el activarGPS()/watchPosition() real que dispara _vv_triggerCambioModo
    // se queda colgado para siempre en Firefox — ver 30-casa-no-fuga-aventura.spec.js
    // (CM-6) y la memoria feedback_e2e_geolocation_firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('PB-1. limpiarPolylineNavegacion() se llama al entrar en CASA', async ({ page }) => {
    const disponible = await page.evaluate(() => typeof globalThis._vv_triggerCambioModo === 'function');
    test.skip(!disponible, '_vv_triggerCambioModo no disponible en este entorno');

    await page.evaluate(async ({ inicio }) => {
      globalThis._devModeActivo = true;
      await globalThis._vv_triggerCambioModo('aventura');
      const mod = await import('/js/funciones-mapa.js');
      mod.dibujarPolylineNavegacion({ origen: { lat: inicio.lat + 0.001, lng: inicio.lng + 0.001 }, destino: inicio });
      globalThis.__e2e_limpiarPolylineLlamada = false;
      const original = globalThis.funcionesMapa.limpiarPolylineNavegacion;
      globalThis.funcionesMapa.limpiarPolylineNavegacion = function (...args) {
        globalThis.__e2e_limpiarPolylineLlamada = true;
        return original.apply(this, args);
      };
    }, { inicio: TRAMO.inicio });

    await page.evaluate(() => globalThis._vv_triggerCambioModo('casa'));
    await page.waitForTimeout(500);

    const llamada = await page.evaluate(() => globalThis.__e2e_limpiarPolylineLlamada);
    expect(llamada, 'limpiarPolylineNavegacion() debe llamarse al entrar en CASA').toBe(true);
  });
});

// hijo2 cargado como página de nivel superior (sin padre real), mismo patrón que
// 31-sincronizar-modo-ambas-direcciones.spec.js usa para hijo3/hijo4 — evita el
// conflicto de que el pipeline real de AVENTURA reemplace el iframe #hijo2 manual.
test.describe('PB-B — Reset de idParadaActual/botones en hijo2 al cambiar de modo', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Misma limitación conocida que 31-sincronizar-modo-ambas-direcciones.spec.js');
  });

  async function enviarMensaje(page, tipo, datos) {
    await page.evaluate(({ tipo, datos }) => {
      globalThis.postMessage({ tipo, origen: 'padre', destino: 'hijo2', datos }, globalThis.location.origin);
    }, { tipo, datos });
  }

  test('PB-2. Con avanzar realmente habilitado en AVENTURA (parada completada) y CAMBIO_MODO->casa, avanzar se deshabilita y no vuelve a habilitarse solo', async ({ page }) => {
    await page.goto('coordenadas-hijo2.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // 1. Entrar en AVENTURA de verdad primero (en CASA, _actualizarBotonGps fuerza
    //    avanzar deshabilitado sin mirar nada más — hace falta AVENTURA para que el
    //    escenario "sucio" (parada completada) sea real).
    // Espera larga (6s): en esta página standalone (sin padre real, parent===self),
    // el enviarMensaje() local de hijo2 (coordenadas-hijo2.html ~L396) cae en su rama
    // de fallback retryUntilAvailable(globalThis.mensajeria...) que agota 10 intentos
    // (~4.5s) antes de continuar — nunca ocurre en producción real, donde hijo2 vive
    // siempre dentro de un iframe (parent!==self) y usa la rama rápida de postMessage
    // directo. Confirmado leyendo los logs de esta llamada en detalle.
    await enviarMensaje(page, 'SISTEMA.CAMBIO_MODO', { modo: 'aventura', secuenciaCompleta: true });
    await page.waitForTimeout(6000);
    await enviarMensaje(page, 'NAVEGACION.ACTUALIZAR_ESTADO', {
      idParada: 'Av1-TR-1', tipoParada: 'tramo', distanciaAlDestino: 5, toleranciaGPS: 50, timestamp: Date.now(),
    });
    // 2. Habilitar avanzar de verdad (mismo mensaje real que envía marcarParadaCompletada()
    //    al confirmar audio+llegada+reto — btnAvanzarCompletadoPorPadre=true).
    await enviarMensaje(page, 'CONTROL.HABILITAR', { control: 'btnAvanzar', razon: 'parada_completada' });
    await page.waitForTimeout(300);

    const antes = await page.evaluate(() => document.getElementById('btn-avanzar')?.disabled);
    expect(antes, 'Precondición: avanzar debe estar genuinamente habilitado antes de cambiar de modo').toBe(false);

    // 3. Cambiar a CASA sin seleccionar nada — el escenario real del bug.
    await enviarMensaje(page, 'SISTEMA.CAMBIO_MODO', { modo: 'casa', secuenciaCompleta: true });
    await page.waitForTimeout(6000);

    const despues = await page.evaluate(() => document.getElementById('btn-avanzar')?.disabled);
    expect(despues, 'Tras volver a CASA, avanzar debe quedar deshabilitado pese a haber estado habilitado de verdad en AVENTURA').toBe(true);
  });
});
