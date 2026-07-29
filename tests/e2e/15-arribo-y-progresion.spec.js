/**
 * 15-arribo-y-progresion.spec.js
 *
 * Prueba de humo end-to-end para el pipeline llegada→pending→progresión descrito en
 * docs/GUIA-COMPLETA.md: NAVEGACION.LLEGADA_DETECTADA (de hijo2 o de funciones-mapa.js,
 * confirmada por 2 lecturas GPS seguidas dentro de radio — ver 13-gps-tramo-fix.spec.js)
 * marca `pending.llegada = true` en el padre; AUDIO.FIN_REPRODUCCION marca `pending.audio
 * = true`. Con ambos resueltos, intentarCompletarElemento() llama a
 * marcarParadaCompletada(), que — para un tramo — dispara progresarSiguienteElemento(),
 * y este limpia el pending del elemento anterior ANTES de reenviar CAMBIO_PARADA a los
 * hijos (audio incluido). Todo el pipeline se ejercita aquí vía los mensajes reales que
 * envían hijo2/hijo3 en producción, no llamando a funciones internas directamente.
 *
 *   AP-1  NAVEGACION.LLEGADA_DETECTADA sintético marca pending.llegada=true para el
 *         elemento activo (estado.elementoActual).
 *   AP-2  Con llegada (AP-1) y AUDIO.FIN_REPRODUCCION del audio del tramo, la parada se
 *         marca completada y progresarSiguienteElemento() avanza indiceProgreso.
 *   AP-3  El pending del elemento anterior queda limpio y estado.elementoActual ya
 *         apunta al siguiente antes de que termine la progresión — no hay solape.
 *   AP-4  manejarCambiarParada() (funciones-mapa.js) encuentra el nuevo elemento en
 *         AVENTURA_PARADAS por paradaId, no por padreId — antes fallaba siempre en la
 *         progresión automática y dejaba el marcador/diana del elemento anterior sin
 *         actualizar en el mapa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Av1-TR-1: mismo tramo real usado en 13-gps-tramo-fix.spec.js.
const TRAMO_ID = 'Av1-TR-1';
const TRAMO_PADREID = 'padre-TR1';
const TRAMO_AUDIO_ID = 'audio-Av1-TR-1-es';

async function prepararEscenario(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.limpiarPorEstado === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function'
      && typeof globalThis.estado === 'object'
      && globalThis.estado !== null
      && typeof globalThis.DATOS_PADRE === 'object',
    null,
    { timeout: 15_000 }
  ).catch(() => {});

  return page.evaluate(async ({ tramoId, tramoPadreid }) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }

    const fm = globalThis.funcionesMapa;
    if (typeof fm?.limpiarPorEstado === 'function') {
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
    }

    // estado.elementoActual (padre) es una copia de estado independiente de
    // estadoMapa.paradaActual (funciones-mapa.js) — hay que fijarla aparte para que
    // el guard de _hdl_NAVEGACION_LLEGADA_DETECTADA la reconozca.
    const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
    const tramo = elementos?.find(e => e.tramo_id === tramoId || e.padreid === tramoPadreid);
    if (tramo) {
      // estado.modo.actual (padre) es, otra vez, una copia de estado independiente de
      // estadoMapa.modo (funciones-mapa.js) — marcarParadaCompletada() solo progresa
      // automáticamente un tramo en modo AVENTURA, así que hay que fijarlo aparte.
      if (!globalThis.estado.modo) globalThis.estado.modo = {};
      globalThis.estado.modo.actual = 'aventura';
      globalThis.estado.elementoActual = tramo;
      globalThis.estado.pendingCompleciones = {};
      globalThis.estado.paradasCompletadas = new Map();
      globalThis.estado.indiceProgreso = elementos.indexOf(tramo);
      globalThis.estado.audioActual = { id: tramo.audio_id, estado: 'reproduciendo' };
    }

    return {
      tieneEstado: !!globalThis.estado,
      tramoEncontrado: !!tramo,
      indiceProgreso: globalThis.estado?.indiceProgreso,
      totalElementos: elementos?.length || 0,
    };
  }, { tramoId: TRAMO_ID, tramoPadreid: TRAMO_PADREID });
}

async function enviarMensajeSintetico(page, tipo, datos) {
  await page.evaluate(({ tipo, datos }) => {
    globalThis.postMessage({ tipo, origen: 'hijo2', destino: 'padre', datos }, globalThis.location.origin);
  }, { tipo, datos });
}

test.describe('AP — Llegada confirmada → pending → progresión (CAMBIO_PARADA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('AP-1. NAVEGACION.LLEGADA_DETECTADA sintético marca pending.llegada=true', async ({ page }) => {
    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneEstado || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarMensajeSintetico(page, 'NAVEGACION.LLEGADA_DETECTADA', {
      paradaId: TRAMO_ID, parada_id: TRAMO_ID, tipoParada: 'tramo', distancia: 3, timestamp: Date.now(),
    });
    await page.waitForTimeout(400);

    const pendingLlegada = await page.evaluate(({ tramoPadreid }) => {
      return globalThis.estado?.pendingCompleciones?.[tramoPadreid]?.llegada;
    }, { tramoPadreid: TRAMO_PADREID });

    expect(pendingLlegada, 'pending.llegada debe ser true tras el mensaje sintético de llegada').toBe(true);
  });

  test('AP-2/AP-3. Llegada + fin de audio completan el tramo y progresan, limpiando el pending anterior', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararEscenario(page);
    test.skip(!prep.tieneEstado || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // 1) Llegada confirmada (mismo mensaje real que envía hijo2 o funciones-mapa.js).
    await enviarMensajeSintetico(page, 'NAVEGACION.LLEGADA_DETECTADA', {
      paradaId: TRAMO_ID, parada_id: TRAMO_ID, tipoParada: 'tramo', distancia: 3, timestamp: Date.now(),
    });
    await page.waitForTimeout(300);

    const antesDeAudio = await page.evaluate(({ tramoPadreid }) => ({
      indiceProgreso: globalThis.estado.indiceProgreso,
      pendingLlegada: globalThis.estado?.pendingCompleciones?.[tramoPadreid]?.llegada,
    }), { tramoPadreid: TRAMO_PADREID });
    expect(antesDeAudio.pendingLlegada, 'Precondición: llegada debe estar confirmada antes de enviar el audio').toBe(true);

    // 2) Fin de audio (mismo mensaje real que envía hijo3) — con llegada ya true, esto
    // debe completar el tramo y disparar progresarSiguienteElemento() automáticamente
    // (causa='audio_llegada_tramo' avanza sin esperar confirmación del usuario).
    await enviarMensajeSintetico(page, 'AUDIO.FIN_REPRODUCCION', {
      audioId: TRAMO_AUDIO_ID, duracion: 42, timestamp: Date.now(),
    });
    await page.waitForTimeout(500);

    const despues = await page.evaluate(({ tramoPadreid }) => ({
      indiceProgreso: globalThis.estado.indiceProgreso,
      pendingAnteriorLimpio: !globalThis.estado.pendingCompleciones?.[tramoPadreid],
      completada: [...(globalThis.estado.paradasCompletadas?.keys() || [])],
      nuevoElementoActual: globalThis.estado.elementoActual?.padreid || null,
    }), { tramoPadreid: TRAMO_PADREID });

    expect(despues.indiceProgreso, `indiceProgreso debe avanzar (era ${antesDeAudio.indiceProgreso}, quedó ${despues.indiceProgreso})`).toBeGreaterThan(antesDeAudio.indiceProgreso);
    expect(despues.pendingAnteriorLimpio, 'El pending del tramo completado debe quedar limpio tras progresar').toBe(true);
    expect(despues.completada, `El tramo debe quedar registrado como completado: ${JSON.stringify(despues.completada)}`).toContain(TRAMO_ID);
    expect(despues.nuevoElementoActual, 'estado.elementoActual debe apuntar ya al siguiente elemento, no seguir en el tramo completado').not.toBe(TRAMO_PADREID);

    // AP-4: manejarCambiarParada() (funciones-mapa.js) debe encontrar el nuevo elemento en
    // AVENTURA_PARADAS y dibujar su marcador/polyline — antes fallaba siempre en este punto
    // porque priorizaba padreId ("padre-XXX") sobre paradaId ("AvN-XX-N") para buscar en un
    // array que solo tiene .id en formato paradaId, dejando el mapa con el marcador del
    // elemento anterior sin actualizar (dos "dianas" visibles a la vez).
    const errorMapaNoEncontrada = logs.find(l => l.includes('no encontrada en datos base'));
    expect(errorMapaNoEncontrada, `manejarCambiarParada no debe fallar al buscar el nuevo elemento en AVENTURA_PARADAS: ${errorMapaNoEncontrada}`).toBeFalsy();
    const huboDibujado = logs.some(l => l.includes('Completando cambio de parada'));
    expect(huboDibujado, 'El mapa debe procesar el cambio de parada del nuevo elemento activo').toBe(true);
  });
});
