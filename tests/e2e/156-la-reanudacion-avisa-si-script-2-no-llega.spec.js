/**
 * 156 — La reanudación espera a Script 2 con plazo y avisa si no llega (estudio, K-72)
 *
 * POR QUE EXISTE
 *
 * Al reanudar, el padre reparte los datos de la aventura con `distribuirDatosAventura`, que publica Script 2. Si Script 2 se
 * corta antes de publicarla, la reanudación tiene que acabar diciéndolo con el aviso de fallo de carga (`alert` con
 * `MSG_ERROR_CARGA_APP`), no dejar la pantalla de carga para siempre. La espera es una sola: un sondeo de 30 s, como el de
 * la distribución pendiente.
 *
 *   RE-1  Con Script 2 cortado en su primera instrucción, tras pulsar «Continuar» sale el aviso de fallo de carga, y no antes.
 *   RE-2  Control: sin corte, la reanudación termina y no sale ningún aviso.
 *
 * ROJO ANTES QUE VERDE: con la espera por la promesa que Script 2 creaba antes de su primera instrucción, RE-1 cae: la
 * promesa no se resuelve nunca y el aviso no sale.
 *
 * RE-1 es lento a propósito (más de un minuto): el arranque espera hasta 30 s a Script 2 (K-54) antes de ofrecer la
 * reanudación, y la reanudación otros 30 s antes de avisar. El corte se hace en la respuesta de `codigo-padre.html`, y por
 * eso el service worker va bloqueado: `page.route` no ve lo que pide el service worker.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** La primera línea de Script 2 después de su cabecera: el corte va justo delante. */
const ANCLA_SCRIPT_2 = '        // El almacenamiento del dispositivo pasa siempre por js/almacenamiento.js (ver Script 1).';

/** Escribe en el dispositivo una sesión de Aventura1 en español empezada hace un minuto, sin progreso. */
const guardarSesion = (page) => page.evaluate(() => {
  const hace = Date.now() - 60_000;
  localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'es', modo: 'aventura', dev: false, timestamp: hace }));
  localStorage.setItem('vv_progreso', JSON.stringify({ aventura: 'Aventura1', idioma: 'es', timestamp: hace }));
  localStorage.setItem('vv_paradas_completadas', '[]');
  localStorage.setItem('vv_idioma', 'es');
});

/** Recarga, espera el diálogo de reanudación y pulsa «Continuar». Devuelve el instante del clic. */
async function recargarYContinuar(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#btn-continuar-aventura', { timeout: 75_000 });
  const clic = Date.now();
  await page.evaluate(() => document.getElementById('btn-continuar-aventura').click());
  return clic;
}

test.describe('RE — la reanudación espera a Script 2 con plazo y avisa', () => {
  test.use({ serviceWorkers: 'block' });

  test.beforeEach(async ({ page, context }) => {
    // Antes del goto: la reanudación entra en AVENTURA y arranca el seguimiento GPS real.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47959, longitude: -0.37583 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('RE-1. Con Script 2 cortado, tras «Continuar» sale el aviso de fallo de carga', async ({ page }) => {
    test.setTimeout(180_000);
    const avisos = [];
    page.on('dialog', async (d) => { avisos.push({ t: Date.now(), texto: d.message() }); await d.dismiss(); });
    const anclas = [];
    await page.route('**/codigo-padre.html*', async (route) => {
      const original = await route.fetch();
      const texto = await original.text();
      const veces = texto.split(ANCLA_SCRIPT_2).length - 1;
      anclas.push(veces);
      const cortado = veces === 1 ? texto.replace(ANCLA_SCRIPT_2, `        throw new Error('corte de prueba (spec 156)');\n${ANCLA_SCRIPT_2}`) : texto;
      await route.fulfill({ response: original, body: cortado });
    });
    await guardarSesion(page);

    const clic = await recargarYContinuar(page);
    expect(anclas, 'el padre recargado lleva el corte: su ancla aparece una vez').toEqual([1]);
    expect(await page.evaluate(() => typeof globalThis.distribuirDatosAventura), 'Script 2 no ha publicado la función').toBe('undefined');
    expect(avisos.filter((a) => a.t < clic), 'ningún aviso antes de pulsar «Continuar» (el aviso sale una vez por sesión)').toEqual([]);
    await expect.poll(() => avisos.filter((a) => a.t >= clic).length, { timeout: 45_000, message: 'sale el aviso de fallo de carga' }).toBe(1);
  });

  test('RE-2. Control: sin corte, la reanudación termina y no sale ningún aviso', async ({ page }) => {
    const avisos = [];
    page.on('dialog', async (d) => { avisos.push(d.message()); await d.dismiss(); });
    const mensajes = [];
    page.on('console', (m) => mensajes.push(m.text()));
    await guardarSesion(page);

    await recargarYContinuar(page);
    await expect.poll(() => mensajes.some((t) => /Progreso restaurado|Sin progreso previo, usando parada por defecto/.test(t)),
      { timeout: 60_000, message: 'la reanudación termina de restaurar' }).toBe(true);
    expect(avisos).toEqual([]);
  });
});
