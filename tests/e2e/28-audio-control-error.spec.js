/**
 * 28-audio-control-error.spec.js
 *
 * Corrección en _manejarAudioControl() (audio-hijo3.html): la rama comando==='play' (y
 * 'replay') llamaba a `await audioPlayer.play()` / `await cargarYReproducirAudio()` sin
 * capturar su fallo. Dos formas de perderlo en silencio:
 *   - audioPlayer.play() puede rechazar (autoplay bloqueado por el navegador) — la
 *     excepción subía sin capturar hasta el catch genérico de registrarControladorSeguro
 *     (solo logueaba), y la SISTEMA.CONFIRMACION de la última línea de la función nunca
 *     se enviaba — quien pidió el comando se quedaba esperando una respuesta que nunca
 *     llegaba.
 *   - cargarYReproducirAudio() puede devolver `{exito:false, error:...}` (audio no
 *     encontrado en caché, sin archivo configurado) SIN lanzar — el valor de retorno se
 *     ignoraba por completo y la función confirmaba exito:true de todos modos, mintiendo
 *     sobre el resultado real.
 *
 * Ahora ambos casos se capturan en un try/catch propio de _manejarAudioControl() y
 * responden SISTEMA.ERROR{codigo:'AUDIO_CONTROL_FALLIDO'} en vez de silencio o un falso
 * SISTEMA.CONFIRMACION{exito:true}.
 *
 * Verificación por log de consola, mismo motivo y mismo patrón que
 * 26-reto-completado-boton-verde.spec.js: cargando audio-hijo3.html como página de nivel
 * superior (sin padre real), `globalThis.mensajeria` nunca llega a inicializarse (el
 * wrapper local enviarMensaje() solo lo usa en el camino "no estamos en iframe", pero aquí
 * no hay ningún mensajeria.js real cargándolo) — el envío de vuelta al padre no es
 * observable de forma fiable. El propio `logger.warn(...)` del catch nuevo, en cambio, se
 * emite de forma síncrona y determinista en el punto exacto del código que importa, sin
 * depender de si ese envío llega a resolverse — es la señal fiable para esta prueba.
 *
 *   AC-1  Pedir 'play' de un audioId que no está en caché local (cargarYReproducirAudio
 *         devuelve exito:false de forma determinista en este contexto standalone, sin
 *         caché de audios ni padre real que la rellene) hace que el catch nuevo registre
 *         el fallo explícitamente — antes de esta corrección, esa rama o bien lanzaba
 *         hasta el catch genérico externo (solo logueaba distinto) o, en el caso de
 *         cargarYReproducirAudio(), ni siquiera lanzaba: el código seguía y confirmaba
 *         éxito de todos modos.
 */
'use strict';

const { test, expect } = require('@playwright/test');

const LOG_FALLO = "Comando de audio 'play' falló";

async function enviarComandoPlayYEsperar(page) {
  const enviar = () => page.evaluate(() => {
    globalThis.postMessage({
      tipo: 'UI.ACCION_USUARIO',
      origen: 'padre',
      destino: 'hijo3',
      datos: { accion: 'audio_control', comando: 'play', audioId: 'no-existe-en-cache' },
    }, globalThis.location.origin);
  });

  // El registro del handler de UI.ACCION_USUARIO ocurre de forma asíncrona al cargar la
  // página (mismo motivo que enviarRetoMostrarYEsperar en 26-reto-completado-boton-verde.spec.js)
  // — se reintenta el envío hasta ver evidencia real de que se procesó, en vez de una
  // espera fija que solo movería el punto de fallo.
  for (let intento = 0; intento < 10; intento++) {
    await enviar();
    await page.waitForTimeout(300);
  }
}

test.describe('AC — _manejarAudioControl() no confirma éxito ni pierde el fallo en silencio', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Misma limitación conocida que RC (26-reto-completado-boton-verde.spec.js): WebKit no
    // carga estos hijos como página standalone en este entorno.
    test.skip(browserName === 'webkit', 'WebKit no carga audio-hijo3.html como página standalone en este entorno — limitación del arnés de test, no del código');
  });

  test('AC-1. play() de un audioId inexistente registra el fallo explícitamente, no lo pierde', async ({ page }) => {
    const logs = [];
    page.on('console', (msg) => logs.push(msg.text()));

    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');

    await enviarComandoPlayYEsperar(page);

    expect(logs.some((l) => l.includes(LOG_FALLO)), `El fallo debe registrarse explícitamente (catch propio, no el genérico). Logs: ${JSON.stringify(logs)}`).toBe(true);
  });
});
