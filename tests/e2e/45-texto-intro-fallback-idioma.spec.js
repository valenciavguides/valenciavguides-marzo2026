/**
 * 45-texto-intro-fallback-idioma.spec.js
 *
 * Grupo TI — cargarTextoIntro() (En-busca-del-tesoro.html, P11) muestra el texto
 * introductorio real ensamblado por cargarTextos()/cargarMapaParrafos()
 * (js/data-loader.js) para el idioma elegido. Si esa carga falla — fallo de red al
 * pedir el JSON de párrafos del idioma, o la entrada txt-intro-{idioma} llega
 * vacía/ausente — los 3 caminos de fallback (entrada sin content, resultado sin array
 * real, excepción) usaban texto español fijo sin mirar idiomaSeleccionado, a diferencia
 * del resto de la app, que sí traduce sus avisos de fallback a los 12 idiomas (auditoría
 * 2026-08-19). Corregido con MSG_TEXTO_INTRO_NO_DISPONIBLE (js/traducciones-ui.js, 12
 * idiomas), mismo patrón que MSG_TEXTO_PARADA_NO_DISPONIBLE.
 *
 * Grupo AI — cargarAudioIntro() (mismo P11): para 11 de los 12 idiomas, audio-intro-{idioma}
 * existe pero con file:"" (solo español tiene grabación real, mismo hueco documentado en
 * §25.5f para el audio de las paradas). Antes de este fix, #btn-siguiente-audio-intro solo
 * se habilitaba con el evento 'play' real del reproductor — sin fichero, ese evento nunca
 * llega, y el usuario se queda bloqueado en P11 para siempre, incluso tras aceptar
 * explícitamente en P9 continuar sin audio (tieneAudiosDisponibles/mostrarAvisoSinAudio,
 * que ya detectan y avisan de este caso un paso antes). Sin audio: el botón se habilita
 * directamente y el reproductor se oculta (nada que reproducir).
 *
 * Con audio real, el reproductor nativo (<audio controls>) fue sustituido por uno propio
 * (#audio-intro-toggle-btn + barra de progreso) — el control nativo se dibuja distinto en
 * cada navegador/SO, así que el guante-hint (_iniciarGuantePlayHint) no podía apuntar de
 * forma fiable a su botón play interno; con un botón propio, su posición es exacta y
 * calculable con getBoundingClientRect() en cualquier pantalla (2026-08-19).
 *
 * Arnés de test: En-busca-del-tesoro.html se redirige a codigo-padre.html si se navega a
 * él como página de nivel superior (guardia deliberada — ver comentario al inicio del
 * archivo, excepción solo para ?despedida=1). Para cargarlo de verdad hay que insertarlo
 * como <iframe> real, igual que hace codigo-padre.html en producción: navegar primero a
 * cualquier página real del origen (para que el iframe comparta el mismo servidor/red),
 * inyectar el iframe con document.createElement, y localizar el frame resultante en
 * page.frames() por URL — el iframe recién insertado no está listo en el instante de
 * page.evaluate(), así que hace falta un polling corto (300ms) hasta que aparece.
 */
'use strict';

const { test, expect } = require('@playwright/test');

async function cargarComoIframe(page) {
  await page.goto('/audio-hijo3.html');
  await page.evaluate(() => {
    const f = document.createElement('iframe');
    f.id = 'f-seleccion-test';
    f.src = '/En-busca-del-tesoro.html';
    f.style.cssText = 'width:100vw;height:100vh;';
    document.body.appendChild(f);
  });
  let frame = null;
  for (let i = 0; i < 30 && !frame; i++) {
    frame = page.frames().find((fr) => /En-busca-del-tesoro/.test(fr.url()));
    if (!frame) await page.waitForTimeout(300);
  }
  await frame.waitForFunction(
    () => typeof globalThis.cargarTextoIntro === 'function',
    null, { timeout: 15_000 }
  );
  return frame;
}

test.describe('TI — cargarTextoIntro(): fallback traducido cuando falla la carga del texto (P11)', () => {
  test('TI-1. Fallo de red cargando párrafos en un idioma no español: el fallback sale en ese idioma, no en español fijo', async ({ page }) => {
    // Español real de párrafos siempre disponible localmente — solo se intercepta la
    // petición del idioma bajo prueba, para simular un fallo real de red/servidor
    // específico de ese idioma (el escenario real que dispara el bug).
    await page.route('**/parrafos-texto-japones.json', (route) => route.fulfill({ status: 500, body: 'error' }));
    const frame = await cargarComoIframe(page);

    const resultado = await frame.evaluate(async () => {
      idiomaSeleccionado = 'ja'; // ligadura léxica real (let de script clásico) — no globalThis
      const contenedor = document.getElementById('texto-intro-contenido');
      await cargarTextoIntro();
      return contenedor.textContent;
    });

    expect(resultado).toContain('紹介文は現在読み込めませんでした。');
    expect(resultado, 'No debe caer al español fijo cuando el idioma elegido es otro').not.toContain('Texto introductorio no disponible');
    expect(resultado, 'No debe caer al español fijo cuando el idioma elegido es otro').not.toContain('No hay textos para este idioma');
    expect(resultado, 'No debe caer al español fijo cuando el idioma elegido es otro').not.toContain('Error cargando texto');
  });

  test('TI-2. Carga correcta (sin fallo) sigue mostrando el texto real, no el fallback', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const resultado = await frame.evaluate(async () => {
      idiomaSeleccionado = 'es';
      const contenedor = document.getElementById('texto-intro-contenido');
      await cargarTextoIntro();
      return contenedor.textContent;
    });

    expect(resultado, 'Con carga real correcta debe mostrar el texto de la aventura, no un aviso de fallback').toContain('Calle de los Serranos');
  });
});

test.describe('AI — cargarAudioIntro(): #btn-siguiente-audio-intro no se queda bloqueado sin audio real', () => {
  test('AI-1. Sin fichero real de audio (inglés): el botón se habilita directamente y el reproductor se oculta', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const resultado = await frame.evaluate(async () => {
      idiomaSeleccionado = 'en'; // audio-intro-en existe pero con file:""
      const btn = document.getElementById('btn-siguiente-audio-intro');
      const disabledAntes = btn.disabled;
      await cargarAudioIntro();
      const container = document.getElementById('audio-player-container');
      return { disabledAntes, disabledDespues: btn.disabled, containerDisplay: container.style.display };
    });

    expect(resultado.disabledAntes, 'Empieza deshabilitado, como siempre').toBe(true);
    expect(resultado.disabledDespues, 'Sin audio real, debe habilitarse directamente, sin esperar el evento play').toBe(false);
    expect(resultado.containerDisplay, 'Sin nada que reproducir, el reproductor no debe mostrarse').toBe('none');
  });

  test('AI-2. Con fichero real de audio (español): el botón NO se habilita solo — sigue exigiendo el evento play real', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const resultado = await frame.evaluate(async () => {
      idiomaSeleccionado = 'es'; // único idioma con fichero real grabado
      const btn = document.getElementById('btn-siguiente-audio-intro');
      await cargarAudioIntro();
      const audioSource = document.getElementById('audio-intro-source');
      const container = document.getElementById('audio-player-container');
      return { disabledTrasCargar: btn.disabled, src: audioSource.src, containerDisplay: container.style.display };
    });

    expect(resultado.disabledTrasCargar, 'Con audio real disponible, el botón sigue bloqueado hasta que el usuario pulse play de verdad — el fix no debe tocar este camino').toBe(true);
    expect(resultado.src, 'El fichero real de audio debe asignarse igual que siempre').toMatch(/\.mp3$/);
    expect(resultado.containerDisplay, 'Con audio real, el reproductor debe mostrarse').not.toBe('none');
  });

  test('AI-3. Pulsar el botón propio reproduce el audio real, cambia el icono a pausa, y habilita "siguiente"', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    await frame.evaluate(async () => {
      idiomaSeleccionado = 'es';
      await cargarAudioIntro();
      // btn-siguiente-audio-intro se habilita desde el listener 'play' que engancha
      // _iniciarGuantePlayHint() (no cargarAudioIntro()) — en la app real, el dispatcher
      // de P11 llama a las dos siempre juntas; aquí hay que replicarlo explícitamente.
      _iniciarGuantePlayHint();
    });

    // .click() de Playwright exige actionability real (layout/visibilidad) — #pantalla11
    // usa height:100dvh, que en este arnés (iframe anidado dentro de otra página, sin
    // pasar por el ciclo real de arranque de la app) resuelve a 0, así que no hay layout
    // real que pulsar. Lo que de verdad importa aquí es el cableado del evento (el
    // onclick llama a audioPlayer.play(), y el 'play' real dispara el resto) — se
    // ejercita con un click programático (igual de real para la lógica bajo prueba, solo
    // distinto en no depender de layout/visibilidad de este arnés).
    await frame.evaluate(() => document.getElementById('audio-intro-toggle-btn').click());
    // Esperar a que el evento 'play' real del <audio> se dispare y propague (icono +
    // btn-siguiente-audio-intro), no una espera ciega — ver EJE 23 (esperas ciegas).
    await frame.waitForFunction(
      () => document.getElementById('audio-intro-toggle-icon').src.includes('boton-audio-pausa.png'),
      null, { timeout: 5000 }
    );

    const resultado = await frame.evaluate(() => ({
      paused: document.getElementById('audio-intro-player').paused,
      iconoSrc: document.getElementById('audio-intro-toggle-icon').src,
      btnSiguienteDisabled: document.getElementById('btn-siguiente-audio-intro').disabled,
    }));

    expect(resultado.paused, 'Pulsar el botón debe reproducir de verdad el <audio> subyacente').toBe(false);
    expect(resultado.iconoSrc, 'El icono debe cambiar a pausa mientras suena').toContain('boton-audio-pausa.png');
    expect(resultado.btnSiguienteDisabled, 'El evento play real debe habilitar "siguiente", igual que con el reproductor nativo antes').toBe(false);
  });

  test('AI-4. _posicionarGuanteSobreBoton() calcula left/top a partir de la posición real del botón, no una coordenada fija adivinada', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    await frame.evaluate(async () => {
      idiomaSeleccionado = 'es';
      await cargarAudioIntro();
    });

    // Mismo motivo que en AI-3 (100dvh → 0 en este arnés): en vez de depender del layout
    // real para producir rects no-nulos, se sustituye getBoundingClientRect() por valores
    // sintéticos conocidos en los 3 elementos que usa _posicionarGuanteSobreBoton(), y se
    // comprueba que el cálculo (no adivinado, real) coloca el guante centrado sobre el
    // botón y apoyado justo encima — la fórmula es la misma que correría con rects reales.
    const resultado = await frame.evaluate(() => {
      const pantalla = document.getElementById('pantalla11');
      const boton = document.getElementById('audio-intro-toggle-btn');
      const guante = document.getElementById('guante-play-hint');

      pantalla.getBoundingClientRect = () => ({ left: 0, top: 0, right: 400, bottom: 800, width: 400, height: 800 });
      boton.getBoundingClientRect = () => ({ left: 120, top: 300, right: 180, bottom: 360, width: 60, height: 60 });
      guante.getBoundingClientRect = () => ({ left: 0, top: 0, right: 90, bottom: 90, width: 90, height: 90 });

      _posicionarGuanteSobreBoton(guante, boton);
      return { left: guante.style.left, top: guante.style.top };
    });

    // Botón sintético: left=120..180 (ancho 60, centro en 150), top=300. Guante: ancho 90.
    // left esperado = centro del botón (150) - mitad del guante (45) = 105.
    // top esperado = top del botón (300) - 70% de la altura del guante (0.7*90=63) = 237.
    expect(resultado.left, 'El guante debe centrarse horizontalmente sobre el centro real del botón').toBe('105px');
    expect(resultado.top, 'El guante debe apoyarse justo encima del botón real').toBe('237px');
  });
});
