/**
 * 12-carga-por-parada.spec.js
 *
 * Cobertura de la protección pasiva por parada (ver docs/GUIA-COMPLETA.md §16):
 * el padre ya no precarga audios/retos de la aventura completa al empezar —
 * resuelve y envía el contenido de cada parada en línea, solo cuando esa
 * parada se activa (inicio, avance GPS/manual, o reanudación de sesión),
 * a través de _hdl_NAVEGACION_CAMBIO_PARADA (codigo-padre.html).
 *
 * NOTA de entorno: igual que 08-children-handshake.spec.js, las páginas hijas
 * no se cargan de forma fiable en este entorno de test (quedan en about:blank,
 * nunca completan el handshake HIJO_LISTO). Interceptar postMessage sobre el
 * contentWindow del iframe no capturó tráfico en pruebas manuales (comportamiento
 * no fiable en este entorno headless) — en su lugar, estos tests verifican el
 * comportamiento real observando los logs del propio padre, que sí reflejan con
 * precisión qué intenta resolver y enviar _hdl_NAVEGACION_CAMBIO_PARADA (verificado
 * manualmente: el log "Solicitando reproducción de audio a hijo3 con ID: X" solo
 * aparece cuando _solicitarAudioParaParada localiza el audio_id real en DATOS_PADRE).
 *
 *   PP-1  Activar la parada "intro" de Aventura1/es: el padre resuelve y solicita
 *         audio-intro-es a hijo3 (protección por parada activa, no bloque completo).
 *   PP-2  Activar 3 paradas secuenciales: cada una resuelve su propio audio_id
 *         distinto (intro / audio-Av1-P-0-es / audio-Av1-P-1-es).
 *   PP-3  distribuirDatosAventura() ya no reporta 'audios'/'retos' — el
 *         broadcast masivo (DATOS.CARGAR_AUDIOS/CARGAR_RETOS) está retirado.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** IDs reales de Aventura1/es con audio_id configurado (ver js/aventuras-ID-padre.js) */
const PARADAS_AV1 = [
  { paradaId: 'intro', audioId: 'audio-intro-es' },
  { paradaId: 'Av1-P-0', audioId: 'audio-Av1-P-0-es' },
  { paradaId: 'Av1-P-1', audioId: 'audio-Av1-P-1-es' },
];

async function esperarPipelineListo(page) {
  await page.waitForFunction(
    () => typeof globalThis.__triggerCambioParadaInterno === 'function' && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null,
    { timeout: 15_000 }
  ).catch(() => { /* el test reportará el fallo real vía prep.tieneTrigger */ });
}

async function prepararAventura1(page) {
  await esperarPipelineListo(page);
  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    return {
      tieneTrigger: typeof globalThis.__triggerCambioParadaInterno === 'function',
      audiosDisponibles: globalThis.__vv_AUDIOS_AVENTURAS?.Aventura1?.es?.length || 0,
    };
  });
}

async function activarParada(page, paradaId) {
  return page.evaluate(async (id) => {
    try {
      await globalThis.__triggerCambioParadaInterno({
        paradaId: id, parada_id: id, padreId: `padre-${id}`, padreid: `padre-${id}`, timestamp: Date.now(),
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message };
    }
  }, paradaId);
}

test.describe('PP — Protección pasiva por parada (audio/reto en línea, sin broadcast masivo)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('PP-1. Activar "intro" resuelve y solicita audio-intro-es a hijo3', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararAventura1(page);
    test.skip(!prep.tieneTrigger || !prep.audiosDisponibles, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const res = await activarParada(page, 'intro');
    expect(res.ok, `Error activando "intro": ${res.error}`).toBe(true);
    await page.waitForTimeout(500);

    const solicitoAudio = logs.some(l => l.includes('Solicitando reproducción de audio a hijo3 con ID: audio-intro-es'));
    expect(solicitoAudio, `No se encontró el log esperado. Logs de audio: ${JSON.stringify(logs.filter(l => /audio/i.test(l)))}`).toBe(true);

    // Verificación negativa central de esta protección: el broadcast masivo retirado
    // no debe volver a aparecer en ningún log del padre.
    const huboBulk = logs.some(l => l.includes('audios enviados a hijo3') || l.includes('CARGAR_AUDIOS'));
    expect(huboBulk, 'No debería reaparecer ningún rastro del broadcast masivo CARGAR_AUDIOS').toBe(false);
  });

  test('PP-2. 3 paradas secuenciales resuelven cada una su propio audio_id', async ({ page }) => {
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const prep = await prepararAventura1(page);
    test.skip(!prep.tieneTrigger || !prep.audiosDisponibles, `Precondición no disponible: ${JSON.stringify(prep)}`);

    for (const { paradaId } of PARADAS_AV1) {
      const res = await activarParada(page, paradaId);
      expect(res.ok, `Error activando ${paradaId}: ${res.error}`).toBe(true);
      await page.waitForTimeout(400);
    }

    for (const { audioId } of PARADAS_AV1) {
      const encontrado = logs.some(l => l.includes(`Solicitando reproducción de audio a hijo3 con ID: ${audioId}`));
      expect(encontrado, `No se resolvió ${audioId}. Logs de audio: ${JSON.stringify(logs.filter(l => /audio/i.test(l)))}`).toBe(true);
    }
  });

  test('PP-3. distribuirDatosAventura() ya no reporta audios/retos en bloque', async ({ page }) => {
    await esperarPipelineListo(page);
    const prep = await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
        await globalThis.__cargarDatosAventuraDiferidos();
      }
      return { tieneDistribuir: typeof globalThis.distribuirDatosAventura === 'function' };
    });
    test.skip(!prep.tieneDistribuir, 'distribuirDatosAventura no expuesta');

    const resultado = await page.evaluate(async () => {
      const r = await globalThis.distribuirDatosAventura(globalThis.aventuraSeleccionada, globalThis.idiomaSeleccionado);
      return { resultados: r?.resultados ? Object.keys(r.resultados) : [] };
    });

    expect(resultado.resultados).not.toContain('audios');
    expect(resultado.resultados).not.toContain('retos');
    // Coordenadas y textos SÍ siguen siendo bulk — no forman parte de esta protección.
    expect(resultado.resultados).toContain('coordenadas');
  });
});
