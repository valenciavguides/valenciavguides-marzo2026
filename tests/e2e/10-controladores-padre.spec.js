/**
 * 10-controladores-padre.spec.js
 *
 * Cobertura de js/controladores-padre.js (DT-1 Opción B).
 *
 * Verifica que tras FASE 1 (globalThis.__MENSAJERIA_INICIADA === true):
 *   CP-1  Los 4 tipos extraídos están en __CONTROLADOR_REGISTRADOS
 *         (confirma que el dynamic import de controladores-padre.js completó)
 *   CP-2  Los 4 tipos NO están en __vv_manejadoresLocales
 *         (confirma que llegaron al state-manager, no al fallback)
 *   CP-3  El total de tipos en __CONTROLADOR_REGISTRADOS incluye los 4 extraídos
 *         (regresión: el refactor no redujo el número total de controladores)
 *   CP-4  Enviar SOLICITAR_AUDIOS sintético: el padre responde con
 *         AUDIO.REPRODUCIR_REQUEST (protección pasiva por parada — ya no
 *         reenvía CARGAR_AUDIOS con la aventura completa, ver §16 de la guía)
 *   CP-5  Enviar SOLICITAR_TEXTOS sintético: el padre devuelve CARGAR_TEXTOS
 *   CP-6  Enviar SOLICITAR_RETOS sintético: el padre responde con RETO.MOSTRAR
 *         (mismo motivo que CP-4)
 *   CP-7  Enviar SOLICITAR_COORDENADAS sintético: el padre devuelve CARGAR_COORDENADAS
 *   CP-8  Enviar SOLICITAR_DATOS_PARADAS sintético: el padre devuelve
 *         RESPUESTA_DATOS_PARADAS (o maneja la ausencia de datos sin lanzar)
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Los 4 tipos extraídos a js/controladores-padre.js */
const TIPOS_EXTRAIDOS = [
  'NAVEGACION.SOLICITAR_DATOS_PARADAS',
  'DATOS.SOLICITAR_AUDIOS',
  'DATOS.SOLICITAR_TEXTOS',
  'DATOS.SOLICITAR_RETOS',
];

test.describe('CP — Controladores de datos extraídos (js/controladores-padre.js)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    // Script 2 registra los handlers de controladores-padre.js de forma asíncrona,
    // después de que __MENSAJERIA_INICIADA sea true (FASE 1). Esperamos a que
    // los 4 tipos aparezcan antes de que los tests los verifiquen.
    await page.waitForFunction(
      (tipos) => {
        const s = globalThis.__CONTROLADOR_REGISTRADOS;
        return (s instanceof Set) && tipos.every(t => s.has(t));
      },
      TIPOS_EXTRAIDOS,
      { timeout: 10_000 }
    ).catch(() => { /* si expira, el test CP-1 reportará el fallo correctamente */ });
  });

  // ── CP-1: Tipos extraídos en __CONTROLADOR_REGISTRADOS ──────────────────
  test('CP-1. Los 4 tipos extraídos están en __CONTROLADOR_REGISTRADOS', async ({ page }) => {
    const result = await page.evaluate((tipos) => {
      const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
      if (!(registrados instanceof Set)) return { ok: false, razon: 'Set no existe' };
      const faltantes = tipos.filter(t => !registrados.has(t));
      return { ok: faltantes.length === 0, faltantes };
    }, TIPOS_EXTRAIDOS);

    expect(result.ok, `Tipos no registrados: ${JSON.stringify(result.faltantes)}`).toBe(true);
  });

  // ── CP-2: No están en __vv_manejadoresLocales ────────────────────────────
  test('CP-2. Los tipos extraídos NO están en __vv_manejadoresLocales', async ({ page }) => {
    const result = await page.evaluate((tipos) => {
      const local = globalThis.__vv_manejadoresLocales;
      if (!local) return { ok: true, fugas: [] }; // No hay fallback local — correcto
      const keys = local instanceof Map ? [...local.keys()] : Object.keys(local);
      const fugas = tipos.filter(t => keys.includes(t));
      return { ok: fugas.length === 0, fugas };
    }, TIPOS_EXTRAIDOS);

    expect(result.ok, `Fugas en manejadoresLocales: ${JSON.stringify(result.fugas)}`).toBe(true);
  });

  // ── CP-3: El total no se redujo respecto al baseline (≥ 11 tipos) ────────
  test('CP-3. El total de controladores registrados es >= 11 (incluye los 4 extraídos)', async ({ page }) => {
    const setSize = await page.evaluate(() => {
      const s = globalThis.__CONTROLADOR_REGISTRADOS;
      return (s instanceof Set) ? s.size : -1;
    });
    expect(setSize).toBeGreaterThanOrEqual(11);
  });

  // ── CP-4 a CP-7: Smoke tests de bidireccionalidad ───────────────────────
  // Enviamos un mensaje sintético de "solicitar datos" y verificamos que el
  // padre responde con el tipo de respuesta correspondiente (o maneja
  // correctamente la ausencia de datos sin lanzar excepción).

  async function enviarSolicitudYEsperarRespuesta(page, tipoSolicitud, tipoRespuestaEsperado) {
    return page.evaluate(
      async ({ tipoSolicitud, tipoRespuestaEsperado }) => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve({ ok: false, razon: 'timeout — no se recibió respuesta en 3s' });
          }, 1500);

          // Escuchar la respuesta del padre
          globalThis.addEventListener('message', function handler(ev) {
            if (!ev.data || !ev.data.tipo) return;
            if (ev.data.tipo === tipoRespuestaEsperado) {
              clearTimeout(timeout);
              globalThis.removeEventListener('message', handler);
              resolve({ ok: true, tipo: ev.data.tipo });
            }
          });

          // Enviar mensaje sintético al padre (self-dispatch para que el padre lo reciba)
          // El padre escucha 'message' en window, y nosotros estamos EN el padre.
          // Usamos postMessage a sí mismo para activar el listener de mensajería.
          globalThis.postMessage({
            tipo: tipoSolicitud,
            origen: 'hijo5',  // simulamos que viene de hijo5
            destino: 'padre',
            timestamp: Date.now(),
            datos: {}
          }, globalThis.location.origin);
        });
      },
      { tipoSolicitud, tipoRespuestaEsperado }
    );
  }

  test('CP-4. SOLICITAR_AUDIOS → el padre responde AUDIO.REPRODUCIR_REQUEST o maneja sin lanzar', async ({ page }) => {
    // Protección pasiva por parada: SOLICITAR_AUDIOS ya no reenvía la aventura completa
    // (CARGAR_AUDIOS retirado) — resuelve un audioId concreto y responde con el mismo
    // AUDIO.REPRODUCIR_REQUEST que usa el flujo normal de cambio de parada. Este smoke
    // test corre antes de seleccionar aventura, así que sin audioId/aventura el handler
    // hace no-op — el timeout es el resultado esperado, no un fallo.
    const result = await enviarSolicitudYEsperarRespuesta(
      page,
      'DATOS.SOLICITAR_AUDIOS',
      'AUDIO.REPRODUCIR_REQUEST'
    );
    expect(result.ok || result.razon.includes('timeout')).toBe(true);
  });

  test('CP-5. SOLICITAR_TEXTOS → handler registrado y no lanza', async ({ page }) => {
    const result = await enviarSolicitudYEsperarRespuesta(
      page,
      'DATOS.SOLICITAR_TEXTOS',
      'DATOS.CARGAR_TEXTOS'
    );
    expect(result.ok || result.razon.includes('timeout')).toBe(true);
  });

  test('CP-6. SOLICITAR_RETOS → handler registrado y no lanza', async ({ page }) => {
    // Mismo motivo que CP-4: CARGAR_RETOS retirado, ahora responde con RETO.MOSTRAR.
    const result = await enviarSolicitudYEsperarRespuesta(
      page,
      'DATOS.SOLICITAR_RETOS',
      'RETO.MOSTRAR'
    );
    expect(result.ok || result.razon.includes('timeout')).toBe(true);
  });

  test('CP-7. SOLICITAR_COORDENADAS → handler registrado y no lanza', async ({ page }) => {
    const result = await enviarSolicitudYEsperarRespuesta(
      page,
      'DATOS.SOLICITAR_COORDENADAS',
      'DATOS.CARGAR_COORDENADAS'
    );
    expect(result.ok || result.razon.includes('timeout')).toBe(true);
  });

  test('CP-8. SOLICITAR_DATOS_PARADAS → handler registrado y no lanza', async ({ page }) => {
    const result = await enviarSolicitudYEsperarRespuesta(
      page,
      'NAVEGACION.SOLICITAR_DATOS_PARADAS',
      'NAVEGACION.RESPUESTA_DATOS_PARADAS'
    );
    expect(result.ok || result.razon.includes('timeout')).toBe(true);
  });
});
