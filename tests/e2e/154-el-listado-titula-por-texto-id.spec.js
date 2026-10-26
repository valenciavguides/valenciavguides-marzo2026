/**
 * 154 — El listado de paradas titula cada parada con el texto de su `texto_id` (estudio, K-133)
 *
 * POR QUE EXISTE
 *
 * Qué texto es el de un elemento lo dice su fila de DATOS_PADRE (`js/aventuras-ID-padre.js`), en su `texto_id`. La
 * ventana de la imagen lo busca así (`_buscarTextoDelElemento`), y el listado de paradas también: una sola manera. Con
 * los datos de hoy, buscarlo por un trozo del id de la entrada da el mismo título en las 4.224 paradas, así que comparar
 * el listado con los títulos esperados pasaría con las dos maneras; lo que las distingue es una fila cuyo `texto_id` no
 * es el de su id.
 *
 *   LT-1  Control: en el listado de Aventura1 en español, el título de Av1-P-1 y el de Av1-P-2 salen una vez cada uno.
 *   LT-2  Con el `texto_id` de la fila de Av1-P-1 apuntando al texto de Av1-P-2, el listado enseña el título de Av1-P-2
 *         dos veces y el de Av1-P-1 ninguna: el título sale del `texto_id`, no del id.
 *
 * ROJO ANTES QUE VERDE: con el listado que buscaba el texto por un trozo del id, LT-2 cae (cada título, una vez).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Los títulos de Av1-P-1 y Av1-P-2 (por su texto_id) y cuántas veces sale cada uno en el listado abierto. */
const contarEnListado = (page, { cambiarTextoDeP1 }) => page.evaluate(async (cambiar) => {
  const { DATOS_PADRE } = await import('./js/aventuras-ID-padre.js');
  const { cargarTextos } = await import('./js/data-loader.js');
  const filas = DATOS_PADRE.Aventura1.es.elementosIDpadre;
  const p1 = filas.find((f) => f.parada_id === 'Av1-P-1');
  const p2 = filas.find((f) => f.parada_id === 'Av1-P-2');
  const textos = await cargarTextos('Aventura1', 'es');
  const titulo = (id) => textos.find((t) => t.id === id)?.title || null;
  const t1 = titulo(p1.texto_id);
  const t2 = titulo(p2.texto_id);
  if (cambiar) p1.texto_id = p2.texto_id;

  const ventana = document.getElementById('ventana-listado-paradas-padre');
  if (!ventana || getComputedStyle(ventana).display === 'none') {
    await globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: {} });
  }
  const textoDeFilas = async () => [...document.querySelectorAll('#ventana-listado-paradas-padre .listado-parada-texto')].map((e) => e.textContent);
  for (let i = 0; i < 50 && (await textoDeFilas()).length === 0; i++) await new Promise((r) => setTimeout(r, 100));
  const lineas = await textoDeFilas();
  const veces = (t) => lineas.filter((l) => l.replace(/^\d+\.\s*/, '') === t).length;
  return { t1, t2, filas: lineas.length, vecesT1: veces(t1), vecesT2: veces(t2) };
}, cambiarTextoDeP1);

test.describe('LT — el listado de paradas titula por el texto_id de cada fila', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    const ok = await page.evaluate(() => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      return globalThis.__cargarDatosAventuraDiferidos();
    });
    expect(ok, 'la fase 2 de Aventura1 en español').toBe(true);
  });

  test('LT-1. Control: el título de Av1-P-1 y el de Av1-P-2 salen una vez cada uno', async ({ page }) => {
    const r = await contarEnListado(page, { cambiarTextoDeP1: false });
    expect(r.t1, 'Av1-P-1 tiene título').toBeTruthy();
    expect(r.t2, 'Av1-P-2 tiene título').toBeTruthy();
    expect(r.t1, 'los dos títulos son distintos').not.toBe(r.t2);
    expect(r.filas, 'el listado tiene filas').toBeGreaterThan(0);
    expect({ vecesT1: r.vecesT1, vecesT2: r.vecesT2 }).toEqual({ vecesT1: 1, vecesT2: 1 });
  });

  test('LT-2. Con el texto_id de Av1-P-1 apuntando al de Av1-P-2, sale el título de Av1-P-2 dos veces', async ({ page }) => {
    const r = await contarEnListado(page, { cambiarTextoDeP1: true });
    expect({ vecesT1: r.vecesT1, vecesT2: r.vecesT2 }, `títulos: «${r.t1}» y «${r.t2}»`).toEqual({ vecesT1: 0, vecesT2: 2 });
  });
});
