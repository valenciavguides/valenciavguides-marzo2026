'use strict';

/**
 * 104 — Paso 8.9 de la lavadora: respuestas dobles (por acuse y por mensaje aparte)
 *
 * POR QUE EXISTE
 *
 * El controlador de `AUDIO.REPRODUCIR_REQUEST` en `audio-hijo3.html` contestaba dos veces a la
 * misma petición: con el `return` que dispara el acuse automático de `enviarMensajeConConfirmacion`
 * (necesario — sin él, `_enviarAudioRequestConReintento()` del padre nunca sabe si el mensaje
 * llegó), y ADEMÁS con un `AUDIO.REPRODUCIR_RESPONSE` explícito a 'padre', en las dos ramas
 * (éxito y `catch`). El handler del padre para ese segundo mensaje
 * (`_hdl_AUDIO_REPRODUCIR_RESPONSE`) ya no escribe ningún estado — su propio comentario explica
 * que `estado.audioActual` lo fija únicamente `AUDIO.ESTADO_ACTUALIZADO` — así que el mensaje
 * aparte no tenía ya ningún consumidor real, solo logging.
 *
 * De los otros 4 envíos con acuse del proyecto (`solicitarCoordenadasHijo`/
 * `_solicitarParadaAHijo2` → hijo2, `CHAT.RESCATE_SOLICITADO` → padre, `NAVEGACION.GPS.ACTIVAR`
 * → padre, `RETO.COMPLETADO` → padre) ninguno tiene este patrón: cada uno contesta solo con el
 * valor de retorno.
 *
 * RR-1  Camino real: tras un AUDIO.REPRODUCIR_REQUEST con éxito, hijo3 ya no manda
 *       AUDIO.REPRODUCIR_RESPONSE — la información viaja solo por el acuse.
 * RR-2  Camino real: en el catch (audioId ausente) tampoco lo manda.
 *
 * ROJO ANTES DEL ARREGLO: RR-1 y RR-2 fallaban (el mensaje aparte sí llegaba, en las dos ramas).
 */

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

test.describe('RR — AUDIO.REPRODUCIR_REQUEST responde una sola vez', () => {
  test('RR-1. Éxito: no se manda AUDIO.REPRODUCIR_RESPONSE aparte', async ({ page }) => {
    await abrirHijoEnMarco(page, 'audio-hijo3.html');
    await enviarAlHijo(page, {
      tipo: 'AUDIO.REPRODUCIR_REQUEST',
      origen: 'padre',
      destino: 'hijo3',
      datos: { audioId: 'audio-prueba-rr1', autoplay: false, audioData: { id: 'audio-prueba-rr1', file: 'audios-aventuras/audio-de-prueba.mp3' } },
    });
    // Condicion real observable: audioPlayer.src refleja el fichero pedido en cuanto
    // cargarYReproducirAudio termina — no depende del mensaje que este spec retira.
    await expect.poll(() => page.evaluate(() =>
      document.getElementById('marco-hijo')?.contentDocument?.getElementById('audioPlayer')?.src || ''),
    { timeout: 5_000 }).toContain('audio-de-prueba.mp3');
    // VENTANA-OBSERVACION: el mensaje retirado podría llegar un instante después del audio; su ausencia no admite poll.
    await page.waitForTimeout(300);
    const recibidos = await recibidosPorElMarco(page);
    expect(recibidos.some((m) => m.tipo === 'AUDIO.REPRODUCIR_RESPONSE'), `no debe mandarse aparte: ${JSON.stringify(recibidos)}`).toBe(false);
  });

  test('RR-2. Catch (sin audioId): tampoco se manda AUDIO.REPRODUCIR_RESPONSE aparte', async ({ page }) => {
    await abrirHijoEnMarco(page, 'audio-hijo3.html');
    await enviarAlHijo(page, {
      tipo: 'AUDIO.REPRODUCIR_REQUEST',
      origen: 'padre',
      destino: 'hijo3',
      datos: {},
    });
    // VENTANA-OBSERVACION: la rama catch no produce ninguna señal observable a la que hacer poll.
    await page.waitForTimeout(500);
    const recibidos = await recibidosPorElMarco(page);
    expect(recibidos.some((m) => m.tipo === 'AUDIO.REPRODUCIR_RESPONSE'), `no debe mandarse aparte: ${JSON.stringify(recibidos)}`).toBe(false);
  });
});
