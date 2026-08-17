/**
 * 04-iframe-dom.spec.js
 *
 * Valida que los 5 iframes hijos existan en el DOM con los IDs correctos
 * y que arranquen con src vacío (no se cargan prematuramente antes de selección de aventura).
 *
 * Prerequisito DT-1 Opción B — escenario 1d:
 *   "El test debe afirmar que los 5 hijos completan el ciclo HIJO_PREPARADO/HIJO_LISTO"
 *   — esta spec cubre la precondición: los elementos existen en el DOM antes de que
 *     se les asigne src.
 *
 * Prerequisito — escenario 1c:
 *   "Antes de __cargarDatosAventuraDiferidos(), globalThis.__vv_DATOS_AVENTURAS === null"
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// IDs definidos en el HTML de codigo-padre.html
// Cada uno corresponde a un hijo con rol específico
const IFRAMES = [
  { id: 'seleccion',      desc: 'Selección de aventura e idioma (En-busca-del-tesoro.html)' },
  { id: 'hijo1-opciones', desc: 'Información extra y temporizador (extrainfo-hijo1.html)' },
  { id: 'hijo2',          desc: 'Barra de controles GPS (coordenadas-hijo2.html)' },
  { id: 'hijo3',          desc: 'Reproductor de audio (audio-hijo3.html)' },
  { id: 'hijo4',          desc: 'Retos y preguntas (retos-hijo4.html)' },
  { id: 'hijo5',          desc: 'Herramienta de desarrollo (boton-casa-hijo5.html)' },
  { id: 'hijo6-chat',     desc: 'Asistente de chat (chat-hijo6.html)' },
];

test.describe('DOM de iframes — estructura antes de selección de aventura', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // ── Existencia de elementos ────────────────────────────────────────────

  for (const iframe of IFRAMES) {
    test(`iframe #${iframe.id} existe en el DOM (${iframe.desc})`, async ({ page }) => {
      const exists = await page.evaluate(
        (id) => !!document.getElementById(id),
        iframe.id
      );
      expect(exists).toBe(true);
    });
  }

  // ── src vacío antes de selección ──────────────────────────────────────
  // Los iframes NO deben cargarse antes de que el usuario seleccione aventura.
  // Si tienen src asignado, cargarían sus páginas hijo prematuramente y podrían
  // enviar HIJO_PREPARADO antes de que el padre esté listo.

  for (const iframe of ['hijo2', 'hijo3', 'hijo4', 'hijo5', 'hijo1-opciones', 'hijo6-chat']) {
    test(`iframe #${iframe} tiene src vacío antes de selección de aventura`, async ({ page }) => {
      const src = await page.evaluate(
        (id) => {
          const el = document.getElementById(id);
          return el ? el.getAttribute('src') : null;
        },
        iframe
      );
      // src="" o src ausente
      expect(src == null || src === '').toBe(true);
    });
  }

  // ── FASE 2 — datos diferidos nulos antes de selección ─────────────────

  // Las 3 aserciones leen un snapshot tomado por gotoAndWaitForFase1() en el mismo
  // tick del navegador en que detecta FASE 1 completa, no un page.evaluate() nuevo
  // y posterior — FASE 2 (carga de datos de aventura) arranca justo después de FASE
  // 1 en la secuencia de arranque real, así que una lectura separada más tarde deja
  // una ventana real donde ya podría haber terminado, sobre todo en motores más
  // lentos (WebKit). El snapshot aísla exactamente el instante que este test quiere
  // comprobar: el estado justo al completarse FASE 1, antes de que FASE 2 empiece.

  test('1c. globalThis.__vv_DATOS_AVENTURAS es null antes de seleccionar aventura', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.__e2e_datosAventuraSnapshot?.datos);
    expect(val).toBeNull();
  });

  test('1c. globalThis.__vv_AUDIOS_AVENTURAS es null antes de seleccionar aventura', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.__e2e_datosAventuraSnapshot?.audios);
    expect(val).toBeNull();
  });

  test('1c. globalThis.__vv_RETOS_AVENTURAS es null antes de seleccionar aventura', async ({ page }) => {
    const val = await page.evaluate(() => globalThis.__e2e_datosAventuraSnapshot?.retos);
    expect(val).toBeNull();
  });

  test('1c. globalThis.__cargarDatosAventuraDiferidos existe como función', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.__cargarDatosAventuraDiferidos === 'function');
    expect(ok).toBe(true);
  });
});
