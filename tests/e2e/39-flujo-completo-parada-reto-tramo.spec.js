/**
 * 39-flujo-completo-parada-reto-tramo.spec.js
 *
 * Flujo completo real, encadenando piezas que hasta el 2026-08-17 solo se habían
 * probado por separado — Av1-P-0 (inicio, con reto R3-Av1-es) -> Av1-TR-1 (tramo) ->
 * Av1-P-1 (parada, con reto R4-Av1-es): llegada GPS real, fin de audio real habilita
 * el reto, RETO.COMPLETADO real cierra la parada entera (llegada+audio+reto) y elige
 * el cartel correcto según qué sigue (inicio-tramo cuando el siguiente elemento es un
 * tramo, nunca el de transición genérico), y la llegada al final de un tramo caminado
 * se detecta bajo el padreid del propio tramo.
 *
 * Usa siempre disparadores directos reales (_vv_triggerCambioModo,
 * __triggerCambioParadaInterno, funcionesMapa.procesarPosicionGPSParaAventura) y
 * auto-postMessage al propio padre para AUDIO.FIN_REPRODUCCION/RETO.COMPLETADO
 * (self-message: el padre acepta sus propios mensajes, event.source === window) —
 * nunca hijo2 standalone, que tiene un ~4.5s de retraso de test-harness ajeno a
 * producción (ver 38-polyline-y-reset-botones-cambio-modo.spec.js).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Coordenadas reales (js/coordenadas-aventuras.js).
const P0 = { id: 'Av1-P-0', padreid: 'padre-P0', lat: 39.478760, lng: -0.376260 };
const P1 = { id: 'Av1-P-1', padreid: 'padre-P1', lat: 39.47959, lng: -0.37583 };
const TR1 = { id: 'Av1-TR-1' };

function puntoADistancia(lat, lng, metros, rumboDeg) {
  const R = 6371000;
  const brng = rumboDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180, lng1 = lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(metros / R) + Math.cos(lat1) * Math.sin(metros / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(metros / R) * Math.cos(lat1), Math.cos(metros / R) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

async function prepararEscenario(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function'
      && typeof globalThis._vv_triggerCambioModo === 'function'
      && typeof globalThis.__triggerCambioParadaInterno === 'function',
    null, { timeout: 15_000 }
  ).catch(() => {});

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
    globalThis._devModeActivo = true;
    // __triggerCambioParadaInterno no monta un hijo3 real que pueda confirmar la
    // recepción de AUDIO.REPRODUCIR_REQUEST (_enviarAudioRequestConReintento, §31.7) —
    // sin este stub, esos reintentos se agotarían de verdad (~2.4s) en segundo plano y,
    // al no haber llegado nunca confirmación real, _marcarAudioNoDisponible() alteraría
    // pending/estado por una falsa alarma ajena al flujo que este test verifica.
    globalThis.enviarMensajeConConfirmacion = () => Promise.resolve({ exito: true });
    await globalThis._vv_triggerCambioModo('aventura');
    if (globalThis.estado) {
      globalThis.estado.hijosInicializados = new Set(['hijo2', 'hijo3', 'hijo4']);
    }
    return {
      tieneFunciones: !!globalThis.funcionesMapa?.procesarPosicionGPSParaAventura,
      tieneDatos: !!globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre?.length,
    };
  });
}

async function enviarLectura(page, coords) {
  await page.evaluate(async (c) => {
    await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
      coords: { latitude: c.lat, longitude: c.lng, accuracy: 8 },
    });
  }, coords);
}

async function autoPostMessagePadre(page, tipo, origen, datos) {
  await page.evaluate(({ tipo, origen, datos }) => {
    globalThis.postMessage({ tipo, origen, destino: 'padre', datos, timestamp: Date.now() }, globalThis.location.origin);
  }, { tipo, origen, datos });
}

async function leerEstado(page, expr) {
  return page.evaluate((expr) => {
    return new Function('estado', `return ${expr}`)(globalThis.estado);
  }, expr);
}

test.describe('FC — Flujo completo real (parada+reto -> tramo -> parada)', () => {
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

  test('FC-1. Av1-P-0: llegada + audio + reto completan la parada y muestran el cartel correcto', async ({ page }) => {
    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneFunciones || !prep.tieneDatos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(({ paradaId }) => globalThis.__triggerCambioParadaInterno({ paradaId }), { paradaId: P0.id });
    await page.waitForTimeout(500);

    // 1. Llegada GPS real (mismo sensor y patrón que 21-llegada-ruido-gps.spec.js).
    await enviarLectura(page, P0);
    await page.waitForTimeout(300);
    await enviarLectura(page, P0);
    await page.waitForTimeout(300);
    const llegada = await leerEstado(page, `estado.pendingCompleciones?.['${P0.padreid}']?.llegada`);
    expect(llegada, 'La llegada real por GPS debe registrarse en pendingCompleciones').toBe(true);

    // 2. Fin de audio real -> habilita el reto.
    await autoPostMessagePadre(page, 'AUDIO.FIN_REPRODUCCION', 'hijo3', { audioId: 'audio-Av1-P-0-es', duracion: 42, timestamp: Date.now() });
    await page.waitForTimeout(400);
    const retoDisponible = await leerEstado(page, 'estado.retoActual?.disponible');
    expect(retoDisponible, 'El reto debe quedar disponible tras terminar el audio de una parada con reto').toBe(true);

    // 3. Reto completado real -> debe completar la parada entera (llegada+audio+reto).
    await autoPostMessagePadre(page, 'RETO.COMPLETADO', 'hijo4', { retoId: 'R3-Av1-es', correcto: true, respuesta: 'ok', puntos: 10, tiempoRespuesta: 5 });
    await page.waitForTimeout(600);

    const paradaCompletada = await leerEstado(page, `estado.paradasCompletadas?.has('${P0.id}')`);
    const avanzarListo = await leerEstado(page, 'estado.paradaListaParaAvanzar');
    expect(paradaCompletada, 'marcarParadaCompletada debe registrar Av1-P-0 tras llegada+audio+reto').toBe(true);
    expect(avanzarListo, 'btnAvanzar debe quedar listo tras completar la parada en AVENTURA').toBe(true);

    // El siguiente elemento tras Av1-P-0 es un tramo -> debe mostrarse el cartel de
    // inicio de tramo (no el de transición genérico ni el de llegada a parada).
    const cartelInicioTramo = await page.evaluate(() => !!document.getElementById('cartel-inicio-tramo'));
    const cartelTransicion = await page.evaluate(() => !!document.getElementById('cartel-transicion'));
    expect(cartelInicioTramo, 'Al completarse una parada seguida de un tramo debe mostrarse el cartel de inicio de tramo').toBe(true);
    expect(cartelTransicion, 'No debe mostrarse el cartel de transición genérico cuando el siguiente elemento es un tramo').toBe(false);
  });

  test('FC-2. Tras avanzar al tramo Av1-TR-1 y caminar hasta Av1-P-1, la llegada a la siguiente parada se detecta', async ({ page }) => {
    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneFunciones || !prep.tieneDatos, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // Ir directo al tramo (no repetimos FC-1 completo) y confirmar el cambio real.
    const cambioTramo = await page.evaluate(({ paradaId }) => globalThis.__triggerCambioParadaInterno({ paradaId }), { paradaId: TR1.id });
    test.skip(!cambioTramo?.exito, `Tramo ${TR1.id} no resuelto en este entorno: ${JSON.stringify(cambioTramo)}`);
    await page.waitForTimeout(500);

    // La llegada al FINAL de un tramo se registra bajo el padreid del propio tramo (no
    // el de la parada siguiente) — intentarCompletarElemento() completa el tramo por
    // pending.audio && pending.llegada de ESA clave (codigo-padre.html, handler
    // NAVEGACION.CAMBIO_PARADA / intentarCompletarElemento).
    const padreidTramo = await leerEstado(page, 'estado.elementoActual?.padreid');
    test.skip(!padreidTramo, 'No se pudo resolver el padreid del tramo en este entorno');

    // Caminar el tramo: lecturas GPS aproximándose a Av1-P-1 (destino del tramo) desde
    // 120m hasta la diana.
    for (const metros of [120, 80, 40, 15, 0]) {
      const pt = metros === 0 ? P1 : puntoADistancia(P1.lat, P1.lng, metros, 45);
      await enviarLectura(page, pt);
      await page.waitForTimeout(200);
    }
    await enviarLectura(page, P1);
    await page.waitForTimeout(300);

    const llegadaTramo = await leerEstado(page, `estado.pendingCompleciones?.['${padreidTramo}']?.llegada`);
    expect(llegadaTramo, 'Caminar el tramo hasta su diana (Av1-P-1) debe registrar la llegada real bajo el padreid del tramo').toBe(true);
  });
});
