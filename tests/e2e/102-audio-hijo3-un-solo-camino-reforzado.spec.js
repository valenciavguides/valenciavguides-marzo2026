'use strict';

/**
 * 102 — Paso 8.7 de la lavadora: audio a hijo3 por cuatro caminos, solo uno reforzado
 *
 * POR QUE EXISTE
 *
 * AUDIO.REPRODUCIR_REQUEST llega a hijo3 desde cuatro sitios de codigo-padre.html:
 *   1. `_solicitarAudioParaParada()` (progresión normal, NAVEGACION.CAMBIO_PARADA) — pasa por
 *      `_enviarAudioRequestConReintento()`: exige confirmación real de hijo3
 *      (`enviarMensajeConConfirmacion`) y reintenta hasta MAX_REINTENTOS_ENVIO_AUDIO veces.
 *   2. `solicitarAudioAHijo3()` (reanudación de sesión, vía `_solicitarAudioRest`) — un
 *      `enviarMensaje` liso, sin confirmación ni reintento.
 *   3. `_vv_afterHijoListo('hijo3', ...)` (recuperación tras recarga de hijo3) — el mismo
 *      `enviarMensaje` liso.
 *   4. `SOLICITAR_AUDIOS` (`js/controladores-padre.js`) — hijo3 pide un audioId concreto tras un
 *      cache-miss local; dirección inversa (pull), no compite con los otros tres.
 *
 * El comentario del propio camino 1 (codigo-padre.html, junto a `_enviarAudioRequestConReintento`)
 * explica por qué la confirmación es necesaria: "sin confirmación, un mensaje perdido (iframe
 * momentáneamente no listo, postMessage descartado) dejaba pending.audio en false para siempre,
 * sin ninguna señal". Los caminos 2 y 3 entregan audio al mismo hijo3, por el mismo postMessage,
 * con el mismo riesgo — pero sin esa protección.
 *
 * AR-1  solicitarAudioAHijo3() no usa enviarMensajeConConfirmacion (usa un enviarMensaje liso).
 * AR-2  _vv_afterHijoListo('hijo3', ...) tampoco lo usa al restaurar audio tras una recarga.
 *
 * ROJO ANTES DEL ARREGLO: AR-1 y AR-2 fallan (el envío liso nunca llama a
 * enviarMensajeConConfirmacion).
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const AUDIO_ID_REAL = 'audio-Av1-P-1-es';

async function prepararPadreConAventura(page) {
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
  await page.waitForFunction(
    () => globalThis.__vv_AUDIOS_AVENTURAS != null,
    null, { timeout: 15000 },
  ).catch(() => {});
}

test.describe('AR — Audio a hijo3, un solo camino reforzado', () => {
  test.beforeEach(async ({ page }) => { await prepararPadreConAventura(page); });

  test('AR-1. solicitarAudioAHijo3() (reanudación) usa enviarMensajeConConfirmacion', async ({ page }) => {
    const resultado = await page.evaluate(async (audioId) => {
      let llamadas = 0;
      const original = globalThis.enviarMensajeConConfirmacion;
      globalThis.enviarMensajeConConfirmacion = (...args) => { llamadas++; return Promise.resolve({ exito: true }); };
      try {
        await globalThis.solicitarAudioAHijo3(audioId);
      } finally {
        globalThis.enviarMensajeConConfirmacion = original;
      }
      return { llamadas };
    }, AUDIO_ID_REAL);
    expect(resultado.llamadas, 'solicitarAudioAHijo3 debe entregar por el camino con confirmación').toBeGreaterThanOrEqual(1);
  });

  test('AR-2. _vv_afterHijoListo(\'hijo3\') (recuperación tras recarga) usa enviarMensajeConConfirmacion', async ({ page }) => {
    const resultado = await page.evaluate(async (audioId) => {
      globalThis.estadoPadre.modo = globalThis.estadoPadre.modo || {};
      globalThis.estadoPadre.modo.actual = globalThis.MODOS.AVENTURA;
      // Deja un audioActual real en el snapshot de recuperación: solicitarAudioAHijo3 lo rellena
      // como efecto secundario, con el mismo audioData que resolvería la vía normal.
      let llamadasPrevias = 0;
      const original = globalThis.enviarMensajeConConfirmacion;
      globalThis.enviarMensajeConConfirmacion = () => { llamadasPrevias++; return Promise.resolve({ exito: true }); };
      await globalThis.solicitarAudioAHijo3(audioId);
      globalThis.enviarMensajeConConfirmacion = original;

      globalThis._vv_beforeHijoReload('hijo3');

      let llamadas = 0;
      globalThis.enviarMensajeConConfirmacion = () => { llamadas++; return Promise.resolve({ exito: true }); };
      try {
        await globalThis._vv_afterHijoListo('hijo3');
      } finally {
        globalThis.enviarMensajeConConfirmacion = original;
      }
      return { llamadas };
    }, AUDIO_ID_REAL);
    expect(resultado.llamadas, '_vv_afterHijoListo debe restaurar el audio de hijo3 por el camino con confirmación').toBeGreaterThanOrEqual(1);
  });
});
