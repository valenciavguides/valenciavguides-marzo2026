/**
 * 160 — Un elemento solo queda listo para avanzar si se completa, y la aventura solo avanza con la pulsación
 *
 * POR QUE EXISTE
 *
 * «Listo para avanzar» tiene un solo camino: `marcarParadaCompletada()`, que registra el elemento en
 * `estado.paradasCompletadas` y lo guarda. Y avanza la pulsación del usuario, nunca un error. Al resolverse la cola de
 * retos, `_retoColaCompletada()` tenía una reserva: si no encontraba el elemento del reto (un reto que no es de ningún
 * elemento, sin elemento actual), daba el punto por listo para avanzar sin completar nada; y si algo lanzaba mientras
 * completaba el elemento, avanzaba sola al siguiente. Lo mismo tenía `_audioFinalizadoSinReto()`, que además no se podía
 * alcanzar (su único llamador le pasa siempre el audio del elemento actual) (`docs/estudio-caminos.md`, K-140).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real y el botón «avanzar» de hijo2.
 *
 *   KR-1  Un reto que no es de ningún elemento, sin elemento actual, no deja nada listo para avanzar.
 *   KR-2  Si algo falla al completar el elemento por la cola de retos, la aventura no avanza sola.
 *   KR-3  Control: el reto de la parada, con el audio terminado y la llegada confirmada, la completa y enciende «avanzar».
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen KR-1 (la reserva) y KR-2 (el avance del error); KR-3 pasa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Aventura1 en inglés: la parada P-1 y su reto.
const PARADA = { id: 'Av1-P-1', clave: 'padre-P1', lat: 39.47959, lng: -0.37583, reto: 'R4-Av1-en' };

const avanzarApagado = (page) => page.evaluate(() => document.getElementById('hijo2')?.contentDocument?.getElementById('btn-avanzar')?.disabled ?? null);
const leerEn = (page, p) => page.evaluate((q) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: 8 } }), p);
const elementoActual = (page) => page.evaluate(() => globalThis.estado.elementoActual?.parada_id || globalThis.estado.elementoActual?.tramo_id || null);
const fichaDe = (page, clave) => page.evaluate((c) => {
  const f = globalThis.estado?.pendingCompleciones?.[c];
  return f ? { llegada: f.llegada, audio: f.audio, reto: f.reto } : null;
}, clave);

async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

/** El padre real con sus hijos reales, en AVENTURA, sobre la parada, con la llegada confirmada y el audio saltado. */
async function arrancarEnLaParada(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'en';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
    if (!globalThis.AVENTURA_PARADAS?.length) {
      const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
  });
  await cargarHijosDelPadre(page);
  await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  const cambio = await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), PARADA.id);
  expect(cambio?.exito, `${PARADA.id} tiene que activarse`).toBe(true);
  await expect.poll(async () => {
    await leerEn(page, PARADA);
    return (await fichaDe(page, PARADA.clave))?.llegada;
  }, { timeout: 15_000, intervals: [300], message: 'la llegada a la parada consta en la ficha' }).toBe(true);
  await page.evaluate(() => document.getElementById('audio-action-skip').click());
  await expect.poll(async () => (await fichaDe(page, PARADA.clave))?.audio, { timeout: 10_000, message: 'el audio saltado consta como terminado' }).toBe(true);
  await expect.poll(() => avanzarApagado(page), { timeout: 10_000, message: 'con el reto sin resolver, «avanzar» está apagado' }).toBe(true);
}

test.describe('KR — Sin reservas ni avances solos', () => {
  test('KR-1. Un reto que no es de ningún elemento, sin elemento actual, no deja nada listo para avanzar', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancarEnLaParada(page, context);
    // El caso que la reserva cubría: una cola de retos de nadie y ningún elemento actual.
    await page.evaluate(() => {
      const e = globalThis.estado;
      e.elementoActual = null;
      e.paradaListaParaAvanzar = false;
      e.retoActual = { id: 'R-DE-NADIE', cola: ['R-DE-NADIE'], colaCompletados: new Set() };
    });
    await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: 'R-DE-NADIE', correcto: true });
    // VENTANA-OBSERVACION: comprobar que la cola resuelta NO da nada por listo para avanzar
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => globalThis.estado.paradaListaParaAvanzar), 'sin elemento no hay nada que completar: nada queda listo para avanzar').toBe(false);
    expect(await avanzarApagado(page), 'y «avanzar» sigue apagado').toBe(true);
  });

  test('KR-2. Si algo falla al completar el elemento por la cola de retos, la aventura no avanza sola', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancarEnLaParada(page, context);
    // Algo que lanza dentro de la compleción por la cola de retos: el aviso que la cierra.
    await page.evaluate(() => { globalThis._detenerRecordatorioReto = () => { throw new Error('fallo provocado por el spec 160'); }; });
    await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: PARADA.reto, correcto: true });
    // VENTANA-OBSERVACION: comprobar que el fallo NO hace avanzar al elemento siguiente
    await page.waitForTimeout(2000);
    expect(await elementoActual(page), 'un fallo no avanza: el elemento actual sigue siendo la parada').toBe(PARADA.id);
  });

  test('KR-3. Control: el reto de la parada la completa y enciende «avanzar»', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancarEnLaParada(page, context);
    await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: PARADA.reto, correcto: true });
    await expect.poll(() => page.evaluate((id) => globalThis.estado.paradasCompletadas?.has(id) === true, PARADA.id),
      { timeout: 15_000, message: 'la parada queda completada' }).toBe(true);
    await expect.poll(() => avanzarApagado(page), { timeout: 15_000, message: 'completada, «avanzar» se enciende' }).toBe(false);
    expect(await elementoActual(page), 'y espera la pulsación: el elemento no cambia solo').toBe(PARADA.id);
  });
});
