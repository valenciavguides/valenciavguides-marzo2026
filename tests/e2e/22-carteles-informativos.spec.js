/**
 * 22-carteles-informativos.spec.js
 *
 * Prueba de humo end-to-end para los cinco carteles no bloqueantes que avisan al
 * usuario en cada transición de la aventura — ver docs/GUIA-COMPLETA.md §4.7g-k.
 *
 *   CI-1  Cartel de transición (parada→parada, o última parada de la aventura):
 *         "Ha terminado X[, va a empezar Y]. Pulse avanzar y play" — dos iconos
 *         (avanzar + audio), disparado desde marcarParadaCompletada().
 *   CI-2  Cartel de inicio de tramo, variante parada→tramo: antepone "Ha terminado la
 *         parada X — va a empezar el tramo Y." al mismo mensaje de línea azul —
 *         reutiliza terminaParada/empiezaTramo de TRADUCCIONES_CARTEL_TRANSICION.
 *   CI-2b Cartel de inicio de tramo, variante tramo→tramo: mismo mecanismo con
 *         terminaTramo/empiezaTramo — "Ha terminado el tramo X — va a empezar el
 *         tramo Y." + línea azul. Ambas variantes nombran siempre los dos elementos,
 *         no duplican cadenas nuevas en 12 idiomas.
 *   CI-3  Cartel de llegada (tramo→parada, o el punto de inicio de la aventura):
 *         "Ha llegado a la parada X. Pulse avanzar y play" — dos iconos.
 *   CI-4  Cartel de bienvenida de vuelta (tramo): tras alejarse de un tramo ya
 *         iniciado y volver — menciona la línea azul, sin repetir "ha terminado".
 *   CI-5  Cartel de bienvenida de vuelta (parada): tras alejarse de una parada activa
 *         y volver — sin mención a la línea azul.
 *   CI-6  Rama real de marcarParadaCompletada(): al completar una parada seguida de
 *         un tramo, dispara el cartel de inicio de tramo (CI-2), NUNCA el de
 *         transición genérico (CI-1) — la comprobación de que la bifurcación de 4
 *         vías no confunde "sigue un tramo" con "sigue una parada".
 *   CI-7  Vibración: al mostrarse cualquiera de los 5 carteles, navigator.vibrate()
 *         se llama exactamente una vez con 200ms.
 *   CI-8  Sin navigator.vibrate (Safari/escritorio), el cartel se muestra igual sin
 *         lanzar error.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function cargarHijo2Real(page) {
  return page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.id = 'hijo2';
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:10px;height:10px;';
      iframe.addEventListener('load', () => {
        try { globalThis.mensajeria.registrarIframe('hijo2', iframe); } catch (_e) { /* reportado por el propio test si falla luego */ }
        resolve(true);
      }, { once: true });
      iframe.src = 'coordenadas-hijo2.html';
      document.body.appendChild(iframe);
    });
  });
}

async function prepararComun(page) {
  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
      const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
    return { tieneFunciones: !!globalThis.funcionesMapa?.procesarPosicionGPSParaAventura };
  });
}

test.describe('CI — Carteles informativos no bloqueantes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
  });

  test('CI-1. Cartel de transición: dos iconos (avanzar + audio) y texto en minúscula tras "Por favor,"', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-transicion');
      const imgs = el ? [...el.querySelectorAll('img')].map(i => i.getAttribute('src')) : [];
      return { existe: !!el, texto: el?.textContent || '', imgs };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).toContain('pulse el botón avanzar');
    expect(info.texto).toContain('pulse play');
    expect(info.imgs.some(s => s.includes('fotoruta-A-B.png'))).toBe(true);
    expect(info.imgs.some(s => s.includes('boton-audio-central.png'))).toBe(true);
  });

  test('CI-2. Cartel de inicio de tramo (parada→tramo): nombra la parada y el tramo, menciona la línea azul, dos iconos', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelInicioTramo === 'function', null, { timeout: 15000 });
    await page.evaluate(() => { globalThis.mostrarCartelInicioTramo('parada', 'Torres de Serranos', 'Jardín del Turia'); });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-inicio-tramo');
      const imgs = el ? [...el.querySelectorAll('img')].map(i => i.getAttribute('src')) : [];
      return { existe: !!el, texto: el?.textContent || '', imgs };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).toContain('Ha terminado la parada Torres de Serranos');
    expect(info.texto).toContain('va a empezar el tramo Jardín del Turia');
    expect(info.texto).toContain('línea azul');
    expect(info.texto).toContain('avanzar');
    expect(info.imgs.some(s => s.includes('fotoruta-A-B.png'))).toBe(true);
    expect(info.imgs.some(s => s.includes('boton-audio-central.png'))).toBe(true);
  });

  test('CI-2b. Cartel de inicio de tramo (tramo→tramo): nombra los dos tramos, mismo aviso de línea azul', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelInicioTramo === 'function', null, { timeout: 15000 });
    await page.evaluate(() => { globalThis.mostrarCartelInicioTramo('tramo', 'Jardín del Turia', 'Paseo de la Alameda'); });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-inicio-tramo');
      const imgs = el ? [...el.querySelectorAll('img')].map(i => i.getAttribute('src')) : [];
      return { existe: !!el, texto: el?.textContent || '', imgs };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).toContain('Ha terminado el tramo Jardín del Turia');
    expect(info.texto).toContain('va a empezar el tramo Paseo de la Alameda');
    expect(info.texto).toContain('línea azul');
    expect(info.texto).toContain('avanzar');
    expect(info.imgs.some(s => s.includes('fotoruta-A-B.png'))).toBe(true);
    expect(info.imgs.some(s => s.includes('boton-audio-central.png'))).toBe(true);
  });

  test('CI-3. Cartel de llegada: incluye el nombre de la parada, avanzar y play, dos iconos', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelLlegadaParada === 'function', null, { timeout: 15000 });
    await page.evaluate(() => { globalThis.mostrarCartelLlegadaParada('Plaza de la Virgen'); });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-llegada-parada');
      const imgs = el ? [...el.querySelectorAll('img')].map(i => i.getAttribute('src')) : [];
      return { existe: !!el, texto: el?.textContent || '', imgs };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).toContain('Plaza de la Virgen');
    expect(info.texto).toContain('avanzar');
    expect(info.texto).toContain('play');
    expect(info.imgs.some(s => s.includes('fotoruta-A-B.png'))).toBe(true);
    expect(info.imgs.some(s => s.includes('boton-audio-central.png'))).toBe(true);
  });

  test('CI-4. Cartel de bienvenida de vuelta (tramo): menciona la línea azul', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelBienvenidaTramo === 'function', null, { timeout: 15000 });
    await page.evaluate(() => { globalThis.mostrarCartelBienvenidaTramo(); });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-bienvenida-tramo');
      return { existe: !!el, texto: el?.textContent || '' };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).toContain('línea azul');
  });

  test('CI-5. Cartel de bienvenida de vuelta (parada): sin mención a la línea azul', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelBienvenidaParada === 'function', null, { timeout: 15000 });
    await page.evaluate(() => { globalThis.mostrarCartelBienvenidaParada('Torres de Serranos'); });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-bienvenida-parada');
      return { existe: !!el, texto: el?.textContent || '' };
    });
    expect(info.existe).toBe(true);
    expect(info.texto).not.toContain('línea azul');
  });

  test('CI-6. marcarParadaCompletada(): parada→tramo dispara el cartel de inicio de tramo, nunca el de transición genérico', async ({ page }) => {
    await cargarHijo2Real(page);
    await page.waitForTimeout(1200);
    const prep = await prepararComun(page);
    test.skip(!prep.tieneFunciones, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.waitForFunction(() => typeof globalThis.marcarParadaCompletada === 'function', null, { timeout: 15000 }).catch(() => {});
    const disponible = await page.evaluate(() => typeof globalThis.marcarParadaCompletada === 'function');
    test.skip(!disponible, 'marcarParadaCompletada no expuesta en globalThis en este entorno de test');

    const disparado = await page.evaluate(async () => {
      const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre || [];
      const idxParada = elementos.findIndex(e => e.tipo === 'parada' || e.tipo === 'inicio');
      const idxTramoDespues = elementos.findIndex((e, i) => i > idxParada && e.tipo === 'tramo');
      if (idxParada === -1 || idxTramoDespues === -1) return { ok: false, motivo: 'no hay pareja parada→tramo en los datos de Aventura1' };
      if (!globalThis.estado) return { ok: false, motivo: 'globalThis.estado no existe' };
      if (!globalThis.estado.modo) globalThis.estado.modo = {};
      globalThis.estado.modo.actual = 'aventura'; // marcarParadaCompletada solo dispara carteles fuera de modo CASA
      globalThis.estado.indiceProgreso = idxParada;
      globalThis.estado.retoActual = { id: null, disponible: false, cola: [], colaCompletados: new Set() }; // sin retos pendientes
      const elParada = elementos[idxParada];
      await globalThis.marcarParadaCompletada({ paradaId: elParada.parada_id || elParada.tramo_id, origen: 'test', causa: 'audio_reto' });
      return { ok: true };
    });
    test.skip(!disparado.ok, `Precondición de datos no disponible: ${disparado.motivo}`);
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => ({
      inicioTramo: !!document.getElementById('cartel-inicio-tramo'),
      transicion: !!document.getElementById('cartel-transicion'),
    }));

    expect(info.inicioTramo, 'Debe disparar el cartel de inicio de tramo').toBe(true);
    expect(info.transicion, 'No debe disparar el cartel de transición genérico').toBe(false);
  });
});

// Describe aparte: el mock de navigator.vibrate debe inyectarse ANTES de que cargue
// cualquier script del padre, así que no reutiliza el beforeEach general de arriba.
test.describe('CI — Vibración al mostrar un cartel', () => {
  test('CI-7. navigator.vibrate se llama exactamente una vez con 200ms', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await page.addInitScript(() => {
      window.__vibrateCalls = [];
      Object.defineProperty(navigator, 'vibrate', {
        value: (ms) => { window.__vibrateCalls.push(ms); return true; },
        configurable: true,
      });
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);

    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await page.waitForTimeout(400);

    const calls = await page.evaluate(() => window.__vibrateCalls);
    expect(calls.length, 'navigator.vibrate debe llamarse exactamente una vez por cartel').toBe(1);
    expect(calls[0]).toBe(200);
  });

  test('CI-8. Sin navigator.vibrate (escritorio/Safari), el cartel se muestra igual sin lanzar error', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await page.addInitScript(() => { delete navigator.vibrate; });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);

    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));

    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await page.waitForTimeout(400);

    const existe = await page.evaluate(() => !!document.getElementById('cartel-transicion'));
    expect(existe, 'El cartel debe aparecer igual sin soporte de vibración').toBe(true);
    expect(pageErrors, 'No debe lanzar ningún error sin navigator.vibrate').toEqual([]);
  });
});
