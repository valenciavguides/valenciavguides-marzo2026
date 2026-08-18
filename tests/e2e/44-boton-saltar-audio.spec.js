/**
 * 44-boton-saltar-audio.spec.js
 *
 * Botón de saltar audio no disponible (#audio-action-skip, codigo-padre.html): mismo
 * patrón que el botón de saltar reto/puzzle (43-saltar-reto-puzzle-roto.spec.js), pero
 * para el caso "esta parada/tramo tiene audio_id asignado, pero el fichero real no está
 * disponible" — hoy la norma en 11 de los 12 idiomas mientras no se termine de grabar
 * (ver aventuras-ID-padre.js / audios-aventuras.js), y también un fallo runtime real
 * confirmado por hijo3 tras agotar sus propios reintentos.
 *
 * Piezas nuevas cubiertas:
 *   - hayFicheroAudioReal(audioId): comprobación estática del campo .file (no solo si
 *     existe la referencia, que ya hacía obtenerAudioIdActivoPadre).
 *   - actualizarEstadoControlesAudioPadre(): botón central deshabilitado y botón de
 *     saltar visible cuando falla el fichero (estático o runtime vía _audioFalloId),
 *     con espera de 300ms si el desplegable estaba abierto para no solaparse con su
 *     propia transición de cierre.
 *   - _saltarAudioPulsado(): reutiliza pending.audio + _procesarFinAudioElemento — misma
 *     tubería que un fin de audio real, con idempotencia.
 *   - _hdl_AUDIO_ERROR ampliado: ahora también habilita retosBtn (antes solo rescataba
 *     pending.audio dejando los retos bloqueados) y marca estado._audioFalloId para que
 *     el botón de saltar aparezca en un fallo runtime, no solo en el caso estático.
 *   - audio-hijo3.html: reintento silencioso en stalled/waiting con escalado tras varios
 *     consecutivos sin recuperar, y reintento con backoff en error nativo antes de avisar
 *     al padre — ver el grupo BSA-E más abajo, verificado por log (mismo motivo que
 *     28-audio-control-error.spec.js: sin padre real, el mensaje de vuelta no es
 *     observable de forma fiable, pero el log del propio código sí lo es).
 *   - _enviarAudioRequestConReintento(): AUDIO.REPRODUCIR_REQUEST ahora exige confirmación
 *     real de hijo3 (enviarMensajeConConfirmacion) y reintenta hasta MAX_REINTENTOS_ENVIO_AUDIO
 *     veces antes de rendirse — sustituye al rescate ciego por TTL que existía para el
 *     audio de tramos (ver 42-ttl-tramo-saltos-seguridad.spec.js, ya no rescata audio).
 *
 * Fixture real usada (Aventura1, parada Av1-P-1): en español el fichero existe
 * (audio-Av1-P-1-es); en inglés el audio_id existe pero el campo file está vacío
 * (audio-Av1-P-1-en) — exactamente el caso estático que el botón de saltar resuelve.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

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
    () => globalThis.__vv_AUDIOS_AVENTURAS != null && typeof globalThis.hayFicheroAudioReal === 'function',
    null, { timeout: 15000 }
  ).catch(() => {});
  await page.waitForFunction(
    () => document.getElementById('audio-control-overlay')?.dataset.initOk === 'true',
    null, { timeout: 15000 }
  ).catch(() => {});
}

// Activa la parada real Av1-P-1 como elemento actual, en AVENTURA y dentro de rango,
// con el audio_id/reto_id del idioma pedido — mismo patrón que RA-5/RA-6 de
// 29-recordatorio-audio.spec.js (mutar estadoPadre directamente en vez de un
// walkthrough completo de GPS/mapa).
async function activarAv1P1(page, idioma) {
  await page.evaluate((idioma) => {
    globalThis.idiomaSeleccionado = idioma;
    globalThis.estadoPadre.modo = globalThis.estadoPadre.modo || {};
    globalThis.estadoPadre.modo.actual = globalThis.MODOS.AVENTURA;
    globalThis.estadoPadre.usuarioFueraRango = { activo: false };
    globalThis.estadoPadre.hijosInicializados = globalThis.estadoPadre.hijosInicializados || new Set();
    globalThis.estadoPadre.hijosInicializados.add('hijo4');
    globalThis.estadoPadre.elementoActual = {
      padreid: 'padre-P1', tipo: 'parada', parada_id: 'Av1-P-1',
      audio_id: `audio-Av1-P-1-${idioma}`, reto_id: `R4-Av1-${idioma}`
    };
    globalThis.estadoPadre._audioFalloId = null;
    globalThis.actualizarEstadoControlesAudioPadre();
  }, idioma);
}

test.describe('BSA-A — hayFicheroAudioReal()', () => {
  test.beforeEach(async ({ page }) => { await prepararPadreConAventura(page); });

  test('A-1. audio_id existente con file vacío devuelve false', async ({ page }) => {
    const r = await page.evaluate(() => {
      globalThis.idiomaSeleccionado = 'en';
      return globalThis.hayFicheroAudioReal('audio-Av1-P-1-en');
    });
    expect(r).toBe(false);
  });

  test('A-2. audio_id existente con file real devuelve true', async ({ page }) => {
    const r = await page.evaluate(() => {
      globalThis.idiomaSeleccionado = 'es';
      return globalThis.hayFicheroAudioReal('audio-Av1-P-1-es');
    });
    expect(r).toBe(true);
  });

  test('A-3. audioId que no existe en absoluto devuelve false sin excepción', async ({ page }) => {
    const r = await page.evaluate(() => globalThis.hayFicheroAudioReal('audio-NO-EXISTE-XYZ'));
    expect(r).toBe(false);
  });

  test('A-4. sin datos cargados (__vv_AUDIOS_AVENTURAS null) devuelve false sin excepción', async ({ page }) => {
    const r = await page.evaluate(() => {
      const respaldo = globalThis.__vv_AUDIOS_AVENTURAS;
      globalThis.__vv_AUDIOS_AVENTURAS = null;
      const resultado = globalThis.hayFicheroAudioReal('audio-Av1-P-1-es');
      globalThis.__vv_AUDIOS_AVENTURAS = respaldo;
      return resultado;
    });
    expect(r).toBe(false);
  });

  test('A-5. audioId vacío/nulo devuelve false sin excepción', async ({ page }) => {
    const r = await page.evaluate(() => globalThis.hayFicheroAudioReal(null));
    expect(r).toBe(false);
  });
});

test.describe('BSA-B — actualizarEstadoControlesAudioPadre(): central vs botón de saltar', () => {
  test.beforeEach(async ({ page }) => { await prepararPadreConAventura(page); });

  test('B-1. Fichero no disponible (estático): central deshabilitado, botón de saltar visible', async ({ page }) => {
    await activarAv1P1(page, 'en');
    const mainDisabled = await page.locator('#audio-main-toggle-btn').isDisabled();
    const mostrarSaltar = await page.evaluate(() => document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'));
    expect(mainDisabled, 'central debe quedar deshabilitado cuando el fichero no existe').toBe(true);
    expect(mostrarSaltar, 'el botón de saltar debe mostrarse').toBe(true);
  });

  test('B-2. Fichero disponible: central habilitado, botón de saltar oculto', async ({ page }) => {
    await activarAv1P1(page, 'es');
    const mainDisabled = await page.locator('#audio-main-toggle-btn').isDisabled();
    const mostrarSaltar = await page.evaluate(() => document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'));
    expect(mainDisabled, 'central debe estar habilitado cuando hay fichero real').toBe(false);
    expect(mostrarSaltar, 'el botón de saltar no debe mostrarse si el audio funciona').toBe(false);
  });

  test('B-3. Sin audio_id asignado en absoluto: central deshabilitado, botón de saltar NO se muestra', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.estadoPadre.modo = globalThis.estadoPadre.modo || {};
      globalThis.estadoPadre.modo.actual = globalThis.MODOS.AVENTURA;
      globalThis.estadoPadre.usuarioFueraRango = { activo: false };
      globalThis.estadoPadre.elementoActual = { padreid: 'padre-sin-audio', tipo: 'parada', parada_id: 'sin-audio' };
      globalThis.estadoPadre.audioActual = { id: null, estado: null };
      globalThis.estadoPadre._audioFalloId = null;
      globalThis.actualizarEstadoControlesAudioPadre();
    });
    const mainDisabled = await page.locator('#audio-main-toggle-btn').isDisabled();
    const mostrarSaltar = await page.evaluate(() => document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'));
    expect(mainDisabled, 'central debe estar deshabilitado sin audio en absoluto').toBe(true);
    expect(mostrarSaltar, 'sin audio en absoluto no es "audio roto" — no debe ofrecerse saltar').toBe(false);
  });

  test('B-4. Fuera de rango en AVENTURA (aunque el fichero exista): botón de saltar NO se muestra', async ({ page }) => {
    await activarAv1P1(page, 'es');
    await page.evaluate(() => {
      globalThis.estadoPadre.usuarioFueraRango = { activo: true };
      globalThis.actualizarEstadoControlesAudioPadre();
    });
    const mainDisabled = await page.locator('#audio-main-toggle-btn').isDisabled();
    const mostrarSaltar = await page.evaluate(() => document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'));
    expect(mainDisabled, 'central debe deshabilitarse fuera de rango').toBe(true);
    expect(mostrarSaltar, 'fuera de rango no es "audio roto" — no debe ofrecerse saltar todavía').toBe(false);
  });

  test('B-5. Si el desplegable estaba abierto, el botón de saltar espera a que termine su cierre (300ms) antes de aparecer', async ({ page }) => {
    await activarAv1P1(page, 'es');
    await page.evaluate(() => document.getElementById('audio-control-overlay').classList.add('open'));

    await activarAv1P1(page, 'en'); // mismo elemento, ahora sin fichero real

    const estadoInmediato = await page.evaluate(() => ({
      open: document.getElementById('audio-control-overlay').classList.contains('open'),
      mostrarSaltar: document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'),
    }));
    expect(estadoInmediato.open, 'el desplegable debe cerrarse al instante').toBe(false);
    expect(estadoInmediato.mostrarSaltar, 'el botón de saltar NO debe aparecer todavía (solapamiento con la transición de cierre)').toBe(false);

    await page.waitForTimeout(400);
    const mostrarSaltarDespues = await page.evaluate(() => document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'));
    expect(mostrarSaltarDespues, 'tras esperar el cierre, el botón de saltar debe aparecer').toBe(true);
  });
});

test.describe('BSA-C — click en #audio-action-skip: reutiliza la tubería real de fin de audio', () => {
  test.beforeEach(async ({ page }) => { await prepararPadreConAventura(page); });

  // .click() nativo del DOM (page.evaluate), no el puntero sintético de Playwright:
  // el overlay de selección de idioma/aventura (nunca completado en este test, que muta
  // el estado directamente) sigue tapando la página por encima con pointer-events real,
  // así que un click de puntero — incluso con force:true, que solo salta las
  // comprobaciones de Playwright, no el hit-test real del navegador — no llega al
  // elemento. La visibilidad real del botón (CSS) ya queda cubierta por B-1/B-2.
  test('C-1. Pulsar salta resuelve pending.audio y habilita retosBtn (mismo camino que un fin de audio real)', async ({ page }) => {
    await activarAv1P1(page, 'en');
    await expect(page.locator('#audio-action-skip')).toBeVisible();

    await page.evaluate(() => document.getElementById('audio-action-skip').click());

    const resultado = await page.evaluate(() => ({
      pendingAudio: globalThis.estadoPadre.pendingCompleciones?.['padre-P1']?.audio,
      retoDisponible: globalThis.estadoPadre.retoActual?.disponible,
      retoId: globalThis.estadoPadre.retoActual?.id,
    }));
    expect(resultado.pendingAudio, 'pending.audio debe quedar resuelto').toBe(true);
    expect(resultado.retoDisponible, 'el reto de la parada debe habilitarse, igual que un fin de audio real').toBe(true);
    expect(resultado.retoId).toBe('R4-Av1-en');
  });

  test('C-2. Pulsar salta dos veces es idempotente (segunda vez no reprocesa)', async ({ page }) => {
    await activarAv1P1(page, 'en');
    await page.evaluate(() => document.getElementById('audio-action-skip').click());
    const antes = await page.evaluate(() => globalThis.estadoPadre.pendingCompleciones['padre-P1'].timestamp);

    await page.waitForTimeout(50);
    // Sin acceso directo a _saltarAudioPulsado (no expuesta aparte del click), se
    // verifica la idempotencia real vía un segundo click sobre el mismo botón.
    await page.evaluate(() => document.getElementById('audio-action-skip').click());
    await page.waitForTimeout(50);

    const despues = await page.evaluate(() => globalThis.estadoPadre.pendingCompleciones['padre-P1'].timestamp);
    expect(despues, 'el timestamp de pending no debe cambiar en una segunda pulsada (guard de idempotencia)').toBe(antes);
  });
});

async function enviarAudioErrorYEsperar(page, audioId) {
  for (let intento = 0; intento < 10; intento++) {
    await page.evaluate((audioId) => {
      globalThis.postMessage({
        tipo: globalThis.TIPOS_MENSAJE.AUDIO.ERROR,
        origen: 'hijo3',
        destino: 'padre',
        datos: { audioId, error: 'reproduccion_atascada' },
      }, globalThis.location.origin);
    }, audioId);
    const resuelto = await page.evaluate((clave) => globalThis.estadoPadre.pendingCompleciones?.[clave]?.audio === true, 'padre-P1');
    if (resuelto) return;
    await page.waitForTimeout(300);
  }
}

test.describe('BSA-D — _hdl_AUDIO_ERROR: fallo runtime confirmado también ofrece saltar y habilita retos', () => {
  test.beforeEach(async ({ page }) => { await prepararPadreConAventura(page); });

  test('D-1. AUDIO.ERROR de un audio con fichero real (fallo runtime): habilita retos y muestra el botón de saltar', async ({ page }) => {
    await activarAv1P1(page, 'es'); // fichero SÍ existe — el fallo es puramente runtime

    let mostrarSaltarAntes = await page.evaluate(() => document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'));
    expect(mostrarSaltarAntes, 'antes del error no debe verse el botón de saltar (el fichero es real)').toBe(false);

    await enviarAudioErrorYEsperar(page, 'audio-Av1-P-1-es');

    const resultado = await page.evaluate(() => ({
      pendingAudio: globalThis.estadoPadre.pendingCompleciones?.['padre-P1']?.audio,
      retoDisponible: globalThis.estadoPadre.retoActual?.disponible,
      audioFalloId: globalThis.estadoPadre._audioFalloId,
      mostrarSaltar: document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'),
      mainDisabled: document.getElementById('audio-main-toggle-btn').disabled,
    }));
    expect(resultado.pendingAudio, 'pending.audio debe rescatarse (comportamiento ya existente §30.7a)').toBe(true);
    expect(resultado.retoDisponible, 'retosBtn debe habilitarse — antes de este cambio quedaba bloqueado tras un rescate automático').toBe(true);
    expect(resultado.audioFalloId).toBe('audio-Av1-P-1-es');
    expect(resultado.mostrarSaltar, 'el botón de saltar debe aparecer tras el fallo confirmado').toBe(true);
    expect(resultado.mainDisabled, 'el central debe deshabilitarse tras el fallo confirmado').toBe(true);
  });

  test('D-2. AUDIO.ERROR de un audioId que ya no es el elemento activo no afecta al botón de saltar actual', async ({ page }) => {
    await activarAv1P1(page, 'es');

    await page.evaluate(() => {
      globalThis.postMessage({
        tipo: globalThis.TIPOS_MENSAJE.AUDIO.ERROR,
        origen: 'hijo3',
        destino: 'padre',
        datos: { audioId: 'audio-de-una-parada-ya-abandonada', error: 'reproduccion_atascada' },
      }, globalThis.location.origin);
    });
    await page.waitForTimeout(500);

    const resultado = await page.evaluate(() => ({
      audioFalloId: globalThis.estadoPadre._audioFalloId,
      mostrarSaltar: document.getElementById('audio-control-overlay').classList.contains('mostrar-saltar-audio'),
      mainDisabled: document.getElementById('audio-main-toggle-btn').disabled,
    }));
    expect(resultado.audioFalloId, 'un AUDIO.ERROR de un audioId distinto al activo no debe marcar el elemento actual como fallido').not.toBe('audio-de-una-parada-ya-abandonada');
    expect(resultado.mostrarSaltar).toBe(false);
    expect(resultado.mainDisabled, 'el audio real y vigente sigue disponible').toBe(false);
  });
});

test.describe('BSA-E — audio-hijo3.html: reintentos de stalled/waiting/error', () => {
  test.beforeEach(async ({ browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit no carga audio-hijo3.html como página standalone en este entorno — misma limitación documentada en 28-audio-control-error.spec.js');
  });

  test('E-1. stalled dispara un reintento silencioso de play() tras ~300ms', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');

    const llamadas = await page.evaluate(async () => {
      const audioPlayer = document.getElementById('audioPlayer');
      let contador = 0;
      audioPlayer.play = () => { contador++; return Promise.resolve(); };
      audioPlayer.dispatchEvent(new Event('stalled'));
      await new Promise((r) => setTimeout(r, 500));
      return contador;
    });
    expect(llamadas).toBeGreaterThanOrEqual(1);
  });

  test('E-2. error nativo reintenta recargar con backoff hasta MAX_REINTENTOS_AUDIO (2) antes de dejar de reintentar', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');

    const resultado = await page.evaluate(async () => {
      const audioPlayer = document.getElementById('audioPlayer');
      let loadCount = 0;
      audioPlayer.load = () => { loadCount++; };
      audioPlayer.play = () => Promise.resolve();

      audioPlayer.dispatchEvent(new Event('error'));
      await new Promise((r) => setTimeout(r, 700));   // backoff 1er reintento: 600ms
      audioPlayer.dispatchEvent(new Event('error'));
      await new Promise((r) => setTimeout(r, 1300));  // backoff 2º reintento: 1200ms
      audioPlayer.dispatchEvent(new Event('error'));  // debe agotar: sin 3er reintento
      await new Promise((r) => setTimeout(r, 300));
      return { loadCount };
    });
    expect(resultado.loadCount, 'debe reintentar exactamente 2 veces (MAX_REINTENTOS_AUDIO)').toBe(2);
  });

  test('E-3. stalled/waiting consecutivos sin recuperar superan el límite y se registra el aviso', async ({ page }) => {
    const logs = [];
    await page.goto('audio-hijo3.html');
    page.on('console', (msg) => logs.push(msg.text()));
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate(async () => {
      const audioPlayer = document.getElementById('audioPlayer');
      audioPlayer.play = () => Promise.resolve();
      for (let i = 0; i < 6; i++) {
        audioPlayer.dispatchEvent(new Event(i % 2 === 0 ? 'stalled' : 'waiting'));
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(200);
    expect(logs.some((l) => l.includes('consecutivos sin recuperar')), 'con 6 no debe avisar todavía').toBe(false);

    await page.evaluate(async () => {
      const audioPlayer = document.getElementById('audioPlayer');
      audioPlayer.dispatchEvent(new Event('waiting')); // 7º consecutivo, supera el límite
      await new Promise((r) => setTimeout(r, 100));
    });
    expect(logs.some((l) => l.includes('consecutivos sin recuperar')), 'al 7º consecutivo debe avisar').toBe(true);
  });

  test('E-4. Un evento playing entre medias resetea el contador — nunca escala si siempre se recupera antes del límite', async ({ page }) => {
    const logs = [];
    await page.goto('audio-hijo3.html');
    page.on('console', (msg) => logs.push(msg.text()));
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate(async () => {
      const audioPlayer = document.getElementById('audioPlayer');
      audioPlayer.play = () => Promise.resolve();
      for (let tanda = 0; tanda < 3; tanda++) {
        for (let i = 0; i < 5; i++) {
          audioPlayer.dispatchEvent(new Event('stalled'));
          await new Promise((r) => setTimeout(r, 40));
        }
        audioPlayer.dispatchEvent(new Event('playing'));
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    await page.waitForTimeout(200);
    expect(logs.some((l) => l.includes('consecutivos sin recuperar')), 'playing entre tandas de 5 debe evitar siempre llegar a 7 consecutivos').toBe(false);
  });
});

test.describe('BSA-F — _enviarAudioRequestConReintento(): entrega reforzada de AUDIO.REPRODUCIR_REQUEST', () => {
  test.beforeEach(async ({ page }) => { await prepararPadreConAventura(page); });

  test('F-1. Si nunca llega confirmación, reintenta exactamente MAX_REINTENTOS_ENVIO_AUDIO veces y devuelve false', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      let llamadas = 0;
      globalThis.enviarMensajeConConfirmacion = () => { llamadas++; return Promise.reject(new Error('Timeout esperando confirmación (mock)')); };
      const entregado = await globalThis._enviarAudioRequestConReintento({ audioId: 'audio-test' }, '[TEST]');
      return { entregado, llamadas, max: globalThis.MAX_REINTENTOS_ENVIO_AUDIO };
    });
    expect(resultado.entregado, 'debe rendirse tras agotar los reintentos').toBe(false);
    expect(resultado.llamadas, 'debe haber intentado exactamente el máximo configurado').toBe(resultado.max);
  });

  test('F-2. Si confirma en el segundo intento, no sigue reintentando y devuelve true', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      let llamadas = 0;
      globalThis.enviarMensajeConConfirmacion = () => {
        llamadas++;
        if (llamadas < 2) return Promise.reject(new Error('Timeout esperando confirmación (mock)'));
        return Promise.resolve({ exito: true });
      };
      const entregado = await globalThis._enviarAudioRequestConReintento({ audioId: 'audio-test' }, '[TEST]');
      return { entregado, llamadas };
    });
    expect(resultado.entregado, 'debe confirmar la entrega en cuanto llega el ACK').toBe(true);
    expect(resultado.llamadas, 'no debe reintentar una tercera vez tras confirmar en la segunda').toBe(2);
  });
});

test.describe('BSA-G — Cartel recordatorio "pulse saltar" (audio no disponible)', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.clock.install();
    await prepararPadreConAventura(page);
    await page.waitForFunction(
      () => typeof globalThis._iniciarRecordatorioSaltarAudio === 'function' && typeof globalThis._detenerRecordatorioSaltarAudio === 'function',
      null, { timeout: 15000 }
    ).catch(() => {});
  });

  test('G-1. Aparece a los 10s con proximidad real, se autocierra a los 7s, reaparece a los 20s', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioSaltarAudio());

    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'no debe aparecer antes de los 10s').toBe(false);

    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'debe aparecer a los 10s con proximidad real ya confirmada').toBe(true);

    await page.clock.runFor(7000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'debe autocerrarse a los 7s de mostrarse').toBe(false);

    await page.clock.runFor(13000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'debe reaparecer al completarse el intervalo de 20s').toBe(true);
  });

  test('G-2. Pulsar el botón real de saltar lo apaga para siempre (no solo cierra el cartel visible)', async ({ page }) => {
    await activarAv1P1(page, 'en'); // fichero no disponible -> botón de saltar real visible
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioSaltarAudio());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'debe salir primero').toBe(true);

    await page.evaluate(() => document.getElementById('audio-action-skip').click());
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'debe cerrarse al instante al pulsar el botón real').toBe(false);

    await page.clock.runFor(60000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'no debe volver a aparecer nunca tras pulsar el botón real (a diferencia del cierre temporal del cartel)').toBe(false);
  });

  test('G-3. Reiniciar (nuevo elemento) cancela el timer anterior en vez de acumularlo', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioSaltarAudio());
    await page.clock.runFor(5000);
    await page.evaluate(() => globalThis._iniciarRecordatorioSaltarAudio());
    await page.clock.runFor(6000);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'no debe aparecer todavía — el reinicio debe haber cancelado el timer anterior').toBe(false);

    await page.clock.runFor(4000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-saltar-audio'));
    expect(existe, 'debe aparecer 10s después del reinicio, no 10s después del primer inicio').toBe(true);
  });
});

test.describe('BSA-H — _hdl_NAVEGACION_CAMBIO_PARADA: arranca el recordatorio correcto según el fichero', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await prepararPadreConAventura(page);
    await page.waitForFunction(
      () => typeof globalThis.__triggerCambioParadaInterno === 'function'
        && typeof globalThis.enviarMensajeConConfirmacion === 'function',
      null, { timeout: 15000 }
    ).catch(() => {});
    await page.evaluate(() => {
      // __triggerCambioParadaInterno no monta un hijo3 real — sin este stub, la entrega
      // reforzada de AUDIO.REPRODUCIR_REQUEST (§31.7) se agotaría de verdad en segundo
      // plano y podría interferir con lo que este grupo verifica (mismo motivo que en
      // 39-flujo-completo-parada-reto-tramo.spec.js / 40-orden-restauracion-modo-antes-parada.spec.js).
      globalThis.enviarMensajeConConfirmacion = () => Promise.resolve({ exito: true });
      // Espías en vez de page.clock + espera de 10s real: lo que este grupo verifica es
      // la DECISIÓN de la puerta (qué función arranca según hayFicheroAudioReal), no el
      // propio temporizador del cartel — ya cubierto end-to-end por el grupo BSA-G. Evita
      // además una combinación page.clock + __triggerCambioParadaInterno (más maquinaria
      // async que una llamada directa) que resultó inestable en Firefox.
      globalThis.__vv_llamadasRecordatorio = [];
      globalThis._iniciarRecordatorioAudio = () => globalThis.__vv_llamadasRecordatorio.push('play');
      globalThis._iniciarRecordatorioSaltarAudio = () => globalThis.__vv_llamadasRecordatorio.push('saltar');
      globalThis.estado.modo = { actual: 'aventura', anterior: 'casa' };
      globalThis.estado.hijosInicializados = new Set(['hijo2', 'hijo3', 'hijo4']);
    });
  });

  test('H-1. Elemento con fichero real: arranca "pulse play", nunca "pulse saltar"', async ({ page }) => {
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
    await page.evaluate(() => globalThis.__triggerCambioParadaInterno({ paradaId: 'Av1-P-1' }));

    const llamadas = await page.evaluate(() => globalThis.__vv_llamadasRecordatorio);
    expect(llamadas, 'con fichero real debe arrancar el recordatorio de play, nunca el de saltar').toEqual(['play']);
  });

  test('H-2. Elemento sin fichero (audio_id existe, file vacío): arranca "pulse saltar", nunca "pulse play"', async ({ page }) => {
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'en'; });
    await page.evaluate(() => globalThis.__triggerCambioParadaInterno({ paradaId: 'Av1-P-1' }));

    const llamadas = await page.evaluate(() => globalThis.__vv_llamadasRecordatorio);
    expect(llamadas, 'sin fichero debe arrancar el recordatorio de saltar, nunca el de play').toEqual(['saltar']);
  });
});
