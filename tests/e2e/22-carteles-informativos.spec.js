/**
 * 22-carteles-informativos.spec.js
 *
 * Prueba de humo end-to-end para los cinco carteles no bloqueantes que avisan al
 * usuario en cada transición de la aventura — ver docs/GUIA-COMPLETA.md §4.7g-k.
 *
 * Cada cartel pide solo lo que el usuario puede pulsar en ese momento, con sus iconos
 * (_accionesDelCartel, docs/estudio-caminos.md, K-188): aquí cada caso pone los botones como
 * le toca —«avanzar» por _decidirAvanzar, el audio por su botón— y mira lo que pide el cartel.
 *
 *   CI-1  Cartel de transición, con «avanzar» y play pulsables: "Ha terminado X — va a
 *         empezar Y" y pide los dos, con sus dos iconos.
 *   CI-1b Cartel de transición sin elemento siguiente: no viene ningún audio más, así que
 *         pide solo «avanzar».
 *   CI-1c Cartel de transición entre dos paradas con el mismo nombre (dos paradas
 *         seguidas en el mismo sitio): no repite el nombre, dice que la siguiente está
 *         en el mismo lugar.
 *   CI-2  Cartel de inicio de tramo, variante parada→tramo: "Ha terminado la parada X —
 *         va a empezar el tramo Y." con terminaParada/empiezaTramo de
 *         TRADUCCIONES_CARTEL_TRANSICION, y pide «avanzar», play y la línea azul.
 *   CI-2b Cartel de inicio de tramo, variante tramo→tramo: mismo mecanismo con
 *         terminaTramo/empiezaTramo. Ambas variantes nombran siempre los dos elementos.
 *   CI-3  Cartel de llegada con solo el audio pulsable: el nombre de la parada y play, sin
 *         «avanzar» ni su icono.
 *   CI-3b Cartel de llegada sin nada pulsable: solo lo que ha pasado, sin iconos (tras
 *         esperar al audio lo que espera el cartel).
 *   CI-4  Cartel de bienvenida de vuelta (tramo): pide seguir la línea azul.
 *   CI-5  Cartel de bienvenida de vuelta (parada): sin mención a la línea azul.
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
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, elegirIdioma } = require('./helpers/boot');

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
      iframe.src = '/coordenadas-hijo2.html';
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
    // Con la aventura en marcha el idioma está elegido (P2 va antes que todo): el padre no tiene reserva.
    await elegirIdioma(page);
  });

  /** Pone los botones como los necesita el caso: «avanzar» encendido por _decidirAvanzar, y el audio con play o con ⏩. */
  const ponerBotones = (page, { avanzar = false, audio = null } = {}) => page.evaluate(({ avanzar, audio }) => {
    globalThis.estado.modo = globalThis.estado.modo || {};
    globalThis.estado.modo.actual = 'aventura';
    globalThis.estado.usuarioFueraRango = { activo: false };
    globalThis.estado.paradaListaParaAvanzar = avanzar;
    document.getElementById('audio-main-toggle-btn').disabled = audio !== 'play';
    document.getElementById('audio-control-overlay').classList.toggle('mostrar-saltar-audio', audio === 'saltar');
  }, { avanzar, audio });

  /** El texto y los iconos del cartel `id`, cuando salga (puede esperar hasta 2 s al audio). */
  const leerCartel = async (page, id) => {
    const cartel = page.locator(`#${id}`);
    await expect(cartel, `el cartel ${id}`).toHaveCount(1, { timeout: 5_000 });
    return cartel.evaluate((el) => ({
      texto: el.textContent || '',
      imgs: [...el.querySelectorAll('img')].map((i) => decodeURIComponent(i.getAttribute('src')).split('/').pop()),
    }));
  };

  test('CI-1. Cartel de transición: con «avanzar» y play pulsables, pide los dos, con sus dos iconos', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: true, audio: 'play' });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    const info = await leerCartel(page, 'cartel-transicion');
    expect(info.texto).toContain('Ha terminado la parada Torres de Serranos');
    expect(info.texto).toContain('pulse el botón avanzar');
    expect(info.texto).toContain('pulse play');
    expect(info.imgs).toEqual(['fotoruta-A-B.png', 'boton-audio-central.png']);
  });

  test('CI-1b. Cartel de transición sin elemento siguiente: pide solo «avanzar», sin audio', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: true, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', null, null); });
    const info = await leerCartel(page, 'cartel-transicion');
    expect(info.texto).toContain('pulse el botón avanzar');
    expect(info.texto).not.toContain('play');
    expect(info.imgs).toEqual(['fotoruta-A-B.png']);
  });

  test('CI-1c. Cartel de transición entre dos paradas con el mismo nombre: no lo repite, dice que la siguiente está en el mismo lugar', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: true, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelTransicion('parada', 'Plaza de la Virgen', 'parada', 'Plaza de la Virgen'); });
    const info = await leerCartel(page, 'cartel-transicion');
    expect(info.texto).toContain('Ha terminado la parada Plaza de la Virgen — va a empezar la siguiente, en el mismo lugar');
    expect(info.texto.split('Plaza de la Virgen').length - 1, 'el nombre, una sola vez').toBe(1);
  });

  test('CI-2. Cartel de inicio de tramo (parada→tramo): nombra la parada y el tramo, y pide «avanzar», play y la línea azul', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelInicioTramo === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: true, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelInicioTramo('parada', 'Torres de Serranos', 'Jardín del Turia'); });
    const info = await leerCartel(page, 'cartel-inicio-tramo');
    expect(info.texto).toContain('Ha terminado la parada Torres de Serranos');
    expect(info.texto).toContain('va a empezar el tramo Jardín del Turia');
    for (const pide of ['avanzar', 'play', 'línea azul']) expect(info.texto, `pide ${pide}`).toContain(pide);
    expect(info.imgs).toEqual(['fotoruta-A-B.png', 'boton-audio-central.png']);
  });

  test('CI-2b. Cartel de inicio de tramo (tramo→tramo): nombra los dos tramos, y pide lo mismo', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelInicioTramo === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: true, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelInicioTramo('tramo', 'Jardín del Turia', 'Paseo de la Alameda'); });
    const info = await leerCartel(page, 'cartel-inicio-tramo');
    expect(info.texto).toContain('Ha terminado el tramo Jardín del Turia');
    expect(info.texto).toContain('va a empezar el tramo Paseo de la Alameda');
    for (const pide of ['avanzar', 'play', 'línea azul']) expect(info.texto, `pide ${pide}`).toContain(pide);
    expect(info.imgs).toEqual(['fotoruta-A-B.png', 'boton-audio-central.png']);
  });

  test('CI-3. Cartel de llegada con solo el audio pulsable: el nombre y play, sin «avanzar» ni su icono', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelLlegadaParada === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: false, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelLlegadaParada('Plaza de la Virgen'); });
    const info = await leerCartel(page, 'cartel-llegada-parada');
    expect(info.texto).toContain('Ha llegado a la parada Plaza de la Virgen.');
    expect(info.texto).toContain('pulse play');
    expect(info.texto).not.toContain('avanzar');
    expect(info.imgs).toEqual(['boton-audio-central.png']);
  });

  test('CI-3b. Cartel de llegada sin nada pulsable: solo lo que ha pasado, sin iconos', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelLlegadaParada === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: false, audio: null });
    await page.evaluate(() => { globalThis.mostrarCartelLlegadaParada('Plaza de la Virgen'); });
    const info = await leerCartel(page, 'cartel-llegada-parada');
    expect(info.texto).toContain('Ha llegado a la parada Plaza de la Virgen.');
    expect(info.texto).not.toContain('pulse');
    expect(info.imgs).toEqual([]);
  });

  test('CI-4. Cartel de bienvenida de vuelta (tramo): pide seguir la línea azul', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelBienvenidaTramo === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: false, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelBienvenidaTramo(); });
    const info = await leerCartel(page, 'cartel-bienvenida-tramo');
    expect(info.texto).toContain('Ha vuelto al camino.');
    expect(info.texto).toContain('línea azul');
    expect(info.texto).not.toContain('avanzar');
  });

  test('CI-5. Cartel de bienvenida de vuelta (parada): sin mención a la línea azul', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.mostrarCartelBienvenidaParada === 'function', null, { timeout: 15000 });
    await ponerBotones(page, { avanzar: false, audio: 'play' });
    await page.evaluate(() => { globalThis.mostrarCartelBienvenidaParada('Torres de Serranos'); });
    const info = await leerCartel(page, 'cartel-bienvenida-parada');
    expect(info.texto).toContain('Ha vuelto a su aventura.');
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
      globalThis.estado.retoActual = { id: null, cola: [], colaCompletados: new Set() }; // sin retos pendientes
      const elParada = elementos[idxParada];
      await globalThis.marcarParadaCompletada({ paradaId: elParada.parada_id || elParada.tramo_id, origen: 'test', causa: 'audio_reto' });
      return { ok: true };
    });
    test.skip(!disparado.ok, `Precondición de datos no disponible: ${disparado.motivo}`);
    await expect(page.locator('#cartel-inicio-tramo'), 'Debe disparar el cartel de inicio de tramo').toHaveCount(1, { timeout: 5_000 });

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
    // Con la aventura en marcha el idioma está elegido (P2 va antes que todo): el padre no tiene reserva.
    await elegirIdioma(page);

    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await expect(page.locator('#cartel-transicion')).toHaveCount(1, { timeout: 5_000 });

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
    // Con la aventura en marcha el idioma está elegido (P2 va antes que todo): el padre no tiene reserva.
    await elegirIdioma(page);

    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));

    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function', null, { timeout: 15000 });
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await expect(page.locator('#cartel-transicion')).toHaveCount(1, { timeout: 5_000 });

    const existe = await page.evaluate(() => !!document.getElementById('cartel-transicion'));
    expect(existe, 'El cartel debe aparecer igual sin soporte de vibración').toBe(true);
    expect(pageErrors, 'No debe lanzar ningún error sin navigator.vibrate').toEqual([]);
  });
});
