'use strict';

/**
 * 95 — El estado de pausa del audio de hijo3 llega al padre
 *
 *   AP-1  Control: el evento nativo `play` del reproductor manda `AUDIO.ESTADO_ACTUALIZADO`
 *         con `destino: 'padre'` y `estado: 'reproduciendo'`.
 *   AP-2  El evento nativo `pause` manda el mismo tipo con `estado: 'pausado'`, también con
 *         `destino: 'padre'`.
 *
 * POR QUÉ EXISTE
 *
 * El envío de `pause` no llevaba `destino`. Antes de que el destino se hiciera obligatorio,
 * "sin destino" se confundía con "a todos los
 * iframes registrados" — y hijo3 no registra ninguno, así que el mensaje no llegaba a nadie,
 * en silencio. El padre nunca se enteraba de la pausa: `estado.audioActual.estado` se quedaba
 * en `'reproduciendo'` desde el último `play` real, y con eso el recordatorio "pulse play"
 * (§25.5c, `tests/e2e/29-recordatorio-audio.spec.js`) creía que el audio seguía sonando y no
 * volvía a avisar nunca, aunque el usuario llevara rato sin escucharlo.
 *
 * Se activa el audio por el camino real (`AUDIO.REPRODUCIR_REQUEST`, el mismo mensaje que
 * envía el padre) y se ejercitan los eventos nativos del `<audio>` con `dispatchEvent`, no una
 * llamada directa a la función que envía — es la única forma de que este test hubiera fallado
 * con el bug real (que estaba en el propio listener de `pause`, no en una función aparte). El
 * fichero de audio no necesita existir de verdad: currentAudioId se fija en cuanto
 * `cargarYReproducirAudio` valida que `audioData.file` no está vacío, antes de que el
 * navegador intente cargarlo — mismo criterio que 44-boton-saltar-audio.spec.js.
 *
 * ROJO ANTES QUE VERDE: con el `destino` que tenía el `pause` original (ninguno) y el bus de
 * antes del paso 3 (sin destino = broadcast a nadie), AP-2 no encuentra el mensaje.
 */

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

async function prepararAudioActivo(page, audioId) {
  await enviarAlHijo(page, {
    tipo: 'AUDIO.REPRODUCIR_REQUEST',
    origen: 'padre',
    destino: 'hijo3',
    datos: { audioId, autoplay: false, audioData: { id: audioId, file: 'audios-aventuras/audio-de-prueba.mp3' } },
  });
  // Antes se esperaba AUDIO.REPRODUCIR_RESPONSE, retirado en el paso 8.9 de la lavadora (un
  // segundo camino de respuesta sin consumidor real — la confirmación real viaja por el acuse).
  // La condición real que esa espera señalizaba: audioPlayer.src ya refleja el fichero pedido.
  await expect
    .poll(() => page.evaluate(() => document.getElementById('marco-hijo')?.contentDocument?.getElementById('audioPlayer')?.src || ''), { timeout: 5_000 })
    .toContain('audio-de-prueba.mp3');
}

test.describe('AP — El estado del audio de hijo3 llega al padre', () => {
  test('AP-1. Control: el evento play manda AUDIO.ESTADO_ACTUALIZADO(reproduciendo) a destino padre', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'audio-hijo3.html');
    await prepararAudioActivo(page, 'audio-prueba-ap1');
    await hijo.evaluate(() => document.getElementById('audioPlayer').dispatchEvent(new Event('play')));

    await expect.poll(() => recibidosPorElMarco(page), { timeout: 5_000 }).toEqual(
      expect.arrayContaining([expect.objectContaining({
        tipo: 'AUDIO.ESTADO_ACTUALIZADO',
        destino: 'padre',
        datos: expect.objectContaining({ audioId: 'audio-prueba-ap1', estado: 'reproduciendo' }),
      })]),
    );
  });

  test('AP-2. El evento pause manda AUDIO.ESTADO_ACTUALIZADO(pausado) a destino padre', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'audio-hijo3.html');
    await prepararAudioActivo(page, 'audio-prueba-ap2');
    await hijo.evaluate(() => document.getElementById('audioPlayer').dispatchEvent(new Event('pause')));

    await expect.poll(() => recibidosPorElMarco(page), { timeout: 5_000 }).toEqual(
      expect.arrayContaining([expect.objectContaining({
        tipo: 'AUDIO.ESTADO_ACTUALIZADO',
        destino: 'padre',
        datos: expect.objectContaining({ audioId: 'audio-prueba-ap2', estado: 'pausado' }),
      })]),
    );
  });
});
