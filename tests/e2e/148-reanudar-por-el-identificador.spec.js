/**
 * 148 — Al reanudar, el elemento lo decide su identificador guardado (estudio, K-117)
 *
 * POR QUE EXISTE
 *
 * El progreso guardado (`vv_progreso`) lleva el elemento en curso de tres formas: su identificador (`elementoActualId`), su
 * índice en la lista (`indiceProgreso`) y la parada (`paradaActual`). La reanudación decide con uno solo, el identificador; el
 * índice y la parada salen de él. Si el identificador no está en los datos de la aventura, lo dice con un error y sigue desde
 * la parada por defecto; los rescates usados, que son de la aventura y no del elemento, se reponen igual.
 *
 *   KR-1  Con el índice y la parada guardados de OTRO elemento, la reanudación activa el del identificador.
 *   KR-2  Con un identificador que no está en los datos: un error que lo dice, la parada por defecto y los rescates repuestos.
 *   KR-3  Control: con los tres datos de acuerdo, reanuda en ese elemento.
 *
 * Todo va por el camino real: la sesión guardada se escribe en el dispositivo, la página se recarga y se pulsa «Continuar» en
 * el diálogo de reanudación, que carga los hijos reales y restaura.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior caen KR-1 (gana el índice) y KR-2 (gana el índice, sin error); KR-3 pasa.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** El elemento en curso del padre, con sus tres datos. */
const enCurso = (page) => page.evaluate(() => {
  const e = globalThis.estado;
  return {
    elemento: e?.elementoActual?.parada_id || e?.elementoActual?.tramo_id || null,
    indice: typeof e?.indiceProgreso === 'number' ? e.indiceProgreso : null,
    parada: e?.paradaActual ?? null,
  };
});

/** Los índices reales de la Aventura1 en español, del mismo módulo que usa el padre. */
const indices = (page) => page.evaluate(async () => {
  const { DATOS_PADRE } = await import('/js/aventuras-ID-padre.js');
  const els = DATOS_PADRE.Aventura1.es.elementosIDpadre;
  const de = (id) => els.findIndex((x) => x.parada_id === id || x.tramo_id === id || x.padreid === id);
  return { inicio: els.findIndex((x) => x.tipo === 'inicio'), idInicio: els.find((x) => x.tipo === 'inicio')?.parada_id ?? null, p1: de('Av1-P-1'), p3: de('Av1-P-3'), p5: de('Av1-P-5') };
});

/**
 * Escribe en el dispositivo una sesión guardada de hace un minuto con el progreso dado, recarga y pulsa «Continuar».
 * Devuelve los mensajes de la consola a partir de la recarga.
 */
async function reanudarCon(page, progreso) {
  await page.evaluate((p) => {
    const hace = Date.now() - 60_000;
    localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'es', modo: 'aventura', dev: false, timestamp: hace }));
    localStorage.setItem('vv_progreso', JSON.stringify({ ...p, aventura: 'Aventura1', idioma: 'es', timestamp: hace }));
    localStorage.setItem('vv_paradas_completadas', '[]');
    localStorage.setItem('vv_idioma', 'es');
  }, progreso);
  const mensajes = [];
  page.on('console', (m) => mensajes.push(`${m.type()}: ${m.text()}`));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#btn-continuar-aventura', { timeout: 60_000 });
  await page.evaluate(() => document.getElementById('btn-continuar-aventura').click());
  await expect.poll(() => mensajes.some((t) => /Progreso restaurado|Sin progreso previo, usando parada por defecto/.test(t)),
    { timeout: 90_000, message: 'la reanudación termina de restaurar' }).toBe(true);
  return mensajes;
}

/** Lo esperado, primero en cuanto llega y después ya asentado (el cambio de parada restaurado corre por el bus). */
async function esperarEnCurso(page, esperado, mensaje) {
  await expect.poll(() => enCurso(page), { timeout: 20_000, message: mensaje }).toEqual(esperado);
  // VENTANA-OBSERVACION: el CAMBIO_PARADA restaurado se despacha por el bus después de restaurar; se le deja terminar.
  await page.waitForTimeout(1_500);
  expect(await enCurso(page), `${mensaje} (y sigue así)`).toEqual(esperado);
}

test.describe('KR — al reanudar decide el identificador', () => {
  test.beforeEach(async ({ page, context }) => {
    // Antes del goto: el seguimiento GPS real arranca al entrar en AVENTURA.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47959, longitude: -0.37583 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('KR-1. Con el índice y la parada de otro elemento, reanuda en el del identificador', async ({ page }) => {
    const i = await indices(page);
    expect(Math.min(i.p1, i.p5), 'los dos elementos existen en los datos').toBeGreaterThanOrEqual(0);
    await reanudarCon(page, { elementoActualId: 'Av1-P-1', indiceProgreso: i.p5, paradaActual: 'Av1-P-5', tramoSkipsUsados: 0 });
    await esperarEnCurso(page, { elemento: 'Av1-P-1', indice: i.p1, parada: 'Av1-P-1' }, 'el elemento, el índice y la parada salen del identificador');
  });

  test('KR-2. Con un identificador que no está en los datos: error, parada por defecto y rescates repuestos', async ({ page }) => {
    const i = await indices(page);
    const mensajes = await reanudarCon(page, { elementoActualId: 'Av1-P-999', indiceProgreso: i.p5, paradaActual: 'Av1-P-5', tramoSkipsUsados: 2 });
    expect(mensajes.some((t) => t.startsWith('error') && t.includes('Av1-P-999') && t.includes('K-117')), 'lo dice con un error').toBe(true);
    await esperarEnCurso(page, { elemento: i.idInicio, indice: i.inicio, parada: i.idInicio }, 'sigue desde la parada por defecto');
    expect(await page.evaluate(() => globalThis.estado?.tramoSkipsUsados), 'los rescates usados son de la aventura: se reponen').toBe(2);
  });

  test('KR-3. Control: con los tres datos de acuerdo, reanuda en ese elemento', async ({ page }) => {
    const i = await indices(page);
    await reanudarCon(page, { elementoActualId: 'Av1-P-3', indiceProgreso: i.p3, paradaActual: 'Av1-P-3', tramoSkipsUsados: 0 });
    await esperarEnCurso(page, { elemento: 'Av1-P-3', indice: i.p3, parada: 'Av1-P-3' }, 'reanuda en el elemento guardado');
  });
});
