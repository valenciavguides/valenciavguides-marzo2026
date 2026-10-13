/**
 * 125 — Un hijo recargado queda como estaba
 *
 * POR QUE EXISTE
 *
 * Cuando el supervisor del bus recarga un hijo que ha dejado de contestar, el padre le devuelve
 * su estado al recibir su `HIJO_LISTO`. Dos cosas no cuadraban (`docs/estudio-caminos.md`, K-88):
 *
 *  - La barra de progreso de hijo3. El padre le manda `CONTROL.HABILITAR`/`DESHABILITAR`
 *    (`progressBar`) solo cuando el estado cambia, y recordaba lo último mandado sin mirar si
 *    hijo3 seguía siendo el mismo: el hijo3 recargado nace con la barra apagada y el padre creía
 *    que ya se lo había dicho. Y el primer envío salía al arrancar, con hijo3 todavía sin
 *    registrar en el bus («Destino desconocido desde padre: 'hijo3'»).
 *  - El reto de hijo4. Lo que el padre guardaba para devolverle era el último reto enseñado,
 *    siguiera abierto o no: a un hijo4 recargado con el reto ya cerrado se le volvía a mandar.
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real, y la
 * caída de un hijo vista por el supervisor (su documento pasa a `about:blank`).
 *
 *   HR-1  hijo3 se cae y se recarga: su barra de progreso vuelve como estaba, encendida.
 *   HR-2  Al arrancar, el padre no le manda nada a un hijo3 que todavía no está registrado.
 *   HR-3  hijo4 se cae y se recarga con el reto ya cerrado: no se le vuelve a mandar.
 *   HR-4  Control: hijo4 se cae con el reto abierto y lo recibe otra vez.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen HR-1, HR-2 y HR-3; HR-4 pasa, que es lo que
 * le toca al control.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Parada real de la Aventura1, con reto y con audio. En español ese audio tiene fichero.
const PARADA = { id: 'Av1-P-1', clave: 'padre-P1', lat: 39.47959, lng: -0.37583, audio: 'audio-Av1-P-1-es', reto: 'R4-Av1-es' };
const DOCUMENTO = { hijo3: 'audio-hijo3.html', hijo4: 'retos-hijo4.html' };

/** Lo que el padre le ha mandado a este hijo desde que su documento actual existe (lo apunta el espía de `beforeEach`). */
const recibido = (page, hijo) => page.evaluate((h) => document.getElementById(h)?.contentWindow?.__recibido || null, hijo);

/** La barra de progreso de verdad, en el hijo3 de verdad. */
const barraApagada = (page) => page.evaluate(() => document.getElementById('hijo3')?.contentDocument?.getElementById('progressContainer')?.classList.contains('deshabilitado') ?? null);
const playDelPadreApagado = (page) => page.evaluate(() => document.getElementById('audio-main-toggle-btn')?.disabled ?? null);

/** Lo que hijo4 tiene pintado como reto. */
const retoPintado = (page) => page.evaluate(() => (document.getElementById('hijo4')?.contentDocument?.getElementById('reto')?.innerHTML || '').trim().length > 0);

async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

/** Deja el padre real, con sus hijos reales, en AVENTURA sobre la parada. */
async function prepararParada(page) {
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
  });
  // Los hijos se cargan con el ayudante común; la espera de abajo nombra los que este spec necesita.
  await cargarHijosDelPadre(page);
  await page.waitForFunction(
    () => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)),
    null, { timeout: 60_000 },
  );
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  const cambio = await page.evaluate((id) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: id } }), PARADA.id);
  expect(cambio?.exito, `la parada ${PARADA.id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
}

/** El hijo deja de contestar (su documento pasa a `about:blank`), el supervisor lo recarga y completa otra vez su apretón de manos. */
async function caerYRecuperar(page, hijo) {
  await page.evaluate((h) => { document.getElementById(h).contentWindow.location.replace('about:blank'); }, hijo);
  // Tres latidos sin respuesta (15 s) y la recarga: el hijo deja de constar como listo y vuelve a constar.
  await page.waitForFunction(({ h, doc }) => {
    globalThis.__e2e_cayo = globalThis.__e2e_cayo || {};
    const listo = globalThis.__vv_stateManager.hijoEstaListo(h);
    if (!listo) globalThis.__e2e_cayo[h] = true;
    return globalThis.__e2e_cayo[h] === true && listo && document.getElementById(h).contentWindow.location.href.includes(doc);
  }, { h: hijo, doc: DOCUMENTO[hijo] }, { timeout: 90_000 });
  // El documento nuevo ya ha recibido la confirmación del padre: lo que el padre le devuelve llega justo después.
  await expect.poll(async () => (await recibido(page, hijo))?.some((m) => m.tipo === 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO'),
    { timeout: 30_000, message: `el ${hijo} recargado recibe la confirmación del padre` }).toBe(true);
}

/** Espera a un latido posterior a la confirmación: para entonces el padre ya le ha devuelto al hijo todo lo que le iba a devolver. */
async function esperarUnLatidoTrasLaConfirmacion(page, hijo) {
  await expect.poll(async () => {
    const m = (await recibido(page, hijo)) || [];
    const confirmado = m.findIndex((x) => x.tipo === 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO');
    return confirmado >= 0 && m.slice(confirmado + 1).some((x) => x.tipo === 'SISTEMA.HEARTBEAT');
  }, { timeout: 30_000, message: `el ${hijo} recargado recibe un latido después de su confirmación` }).toBe(true);
}

test.describe('HR — Un hijo recargado queda como estaba', () => {
  /**
   * Avisos del bus del padre por mandarle algo a hijo3 sin tenerlo registrado, vistos en la consola desde antes de cargar la
   * página. Solo los de hijo3: este arnés no carga hijo5, y lo que el padre le manda sí da ese aviso.
   */
  let avisosDestinoDesconocido;

  test.beforeEach(async ({ page, context }) => {
    // Antes del goto: sin esto, el watchPosition real que arranca al entrar en AVENTURA se queda colgado en Firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    avisosDestinoDesconocido = [];
    page.on('console', (m) => { if (/Destino desconocido desde padre: 'hijo3'/.test(m.text())) avisosDestinoDesconocido.push(m.text()); });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    // Un oído en hijo3 y en hijo4, puesto antes que su propio código en CADA documento que carguen: también en el recargado.
    await page.addInitScript(() => {
      if (!/audio-hijo3\.html|retos-hijo4\.html/.test(location.pathname)) return;
      window.__recibido = [];
      window.addEventListener('message', (e) => {
        if (e.source !== window.parent || !e.data?.tipo) return;
        window.__recibido.push({ tipo: e.data.tipo, control: e.data.datos?.control ?? null, razon: e.data.datos?.razon ?? null, retoId: e.data.datos?.retoId ?? null });
      });
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await prepararParada(page);
  });

  test('HR-1. hijo3 se cae y se recarga: su barra de progreso vuelve encendida', async ({ page }) => {
    test.setTimeout(180_000);
    await expect.poll(() => playDelPadreApagado(page), { timeout: 15_000, message: 'precondición: el audio de la parada se puede reproducir' }).toBe(false);
    await expect.poll(() => barraApagada(page), { timeout: 15_000, message: 'precondición: con audio que controlar, la barra de hijo3 está encendida' }).toBe(false);

    await caerYRecuperar(page, 'hijo3');
    await esperarUnLatidoTrasLaConfirmacion(page, 'hijo3');

    expect(await playDelPadreApagado(page), 'el audio sigue pudiéndose reproducir').toBe(false);
    const avisos = (await recibido(page, 'hijo3')).filter((m) => m.control === 'progressBar');
    expect(avisos[avisos.length - 1], 'el padre le dice al hijo3 nuevo cómo queda su barra').toMatchObject({ tipo: 'CONTROL.HABILITAR', control: 'progressBar' });
    expect(await barraApagada(page), 'la barra del hijo3 recargado está encendida, como antes de la caída').toBe(false);
  });

  test('HR-2. Al arrancar, el padre no le manda nada a un hijo3 que todavía no está registrado', async ({ page }) => {
    // Todo el arranque y la carga de los hijos ya han pasado en beforeEach, con la consola escuchada desde antes del goto.
    await expect.poll(() => barraApagada(page), { timeout: 15_000, message: 'el estado de la barra sí llega, cuando hijo3 ya está listo' }).toBe(false);
    expect(avisosDestinoDesconocido, 'ningún envío a un hijo sin registrar').toEqual([]);
  });

  test('HR-3. hijo4 se cae y se recarga con el reto ya cerrado: no se le vuelve a mandar', async ({ page }) => {
    test.setTimeout(180_000);
    await desdeHijo(page, 'hijo3', 'AUDIO.FIN_REPRODUCCION', { audioId: PARADA.audio, duracion: 1, timestamp: Date.now() });
    await expect.poll(() => page.evaluate(() => document.getElementById('hijo3').contentDocument.getElementById('retosBtn').disabled), { timeout: 15_000, message: 'con el audio terminado, el botón de retos se enciende' }).toBe(false);
    await page.evaluate(() => document.getElementById('hijo3').contentDocument.getElementById('retosBtn').click());
    await page.waitForFunction(() => document.getElementById('hijo4')?.classList.contains('visible'), null, { timeout: 20_000 });
    await expect.poll(() => retoPintado(page), { timeout: 15_000, message: 'precondición: hijo4 pinta el reto' }).toBe(true);
    // Se cierra sin resolver, por el cierre normal.
    await page.evaluate((retoId) => globalThis.mensajeria.despacharLocal({ tipo: 'RETO.OCULTAR', datos: { retoId } }), PARADA.reto);
    await page.waitForFunction(() => !document.getElementById('hijo4')?.classList.contains('visible'), null, { timeout: 10_000 });

    await caerYRecuperar(page, 'hijo4');
    await esperarUnLatidoTrasLaConfirmacion(page, 'hijo4');

    const mostrados = (await recibido(page, 'hijo4')).filter((m) => m.tipo === 'RETO.MOSTRAR');
    expect(mostrados, 'el reto estaba cerrado: al hijo4 nuevo no se le manda').toEqual([]);
    expect(await retoPintado(page), 'y no tiene ningún reto pintado').toBe(false);
  });

  test('HR-4. Control: hijo4 se cae con el reto abierto y lo recibe otra vez', async ({ page }) => {
    test.setTimeout(180_000);
    await desdeHijo(page, 'hijo3', 'AUDIO.FIN_REPRODUCCION', { audioId: PARADA.audio, duracion: 1, timestamp: Date.now() });
    await expect.poll(() => page.evaluate(() => document.getElementById('hijo3').contentDocument.getElementById('retosBtn').disabled), { timeout: 15_000, message: 'con el audio terminado, el botón de retos se enciende' }).toBe(false);
    await page.evaluate(() => document.getElementById('hijo3').contentDocument.getElementById('retosBtn').click());
    await page.waitForFunction(() => document.getElementById('hijo4')?.classList.contains('visible'), null, { timeout: 20_000 });
    await expect.poll(() => retoPintado(page), { timeout: 15_000, message: 'precondición: hijo4 pinta el reto' }).toBe(true);

    await caerYRecuperar(page, 'hijo4');
    await esperarUnLatidoTrasLaConfirmacion(page, 'hijo4');

    const mostrados = (await recibido(page, 'hijo4')).filter((m) => m.tipo === 'RETO.MOSTRAR');
    expect(mostrados, 'el reto seguía abierto: el hijo4 nuevo lo recibe').toEqual([expect.objectContaining({ tipo: 'RETO.MOSTRAR', retoId: PARADA.reto })]);
    await expect.poll(() => retoPintado(page), { timeout: 15_000, message: 'y lo pinta' }).toBe(true);
  });
});
