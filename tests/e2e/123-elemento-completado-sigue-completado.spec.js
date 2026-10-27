/**
 * 123 — Un elemento completado sigue completado
 *
 * POR QUE EXISTE
 *
 * «Completado» es un dato del elemento, con una sola fuente: `estado.paradasCompletadas`, que
 * además se guarda (`vv_paradas_completadas`) y sobrevive a una recarga. Quien vuelve a activar
 * ese elemento tiene que mirarla.
 *
 * No la miraba. La activación de un elemento ponía «avanzar» a la espera y creaba una ficha
 * nueva, a cero, también cuando el elemento ya estaba completado y solo faltaba pulsar
 * «avanzar». Pasa en dos situaciones corrientes: la app se recarga (el teléfono la cierra en el
 * bolsillo) y hijo2 se recupera tras una caída. El usuario rehacía la parada entera y, al
 * terminarla, `marcarParadaCompletada()` la encontraba ya marcada y salía sin encender
 * «avanzar»: bloqueo sin salida, ni con el rescate (`docs/estudio-caminos.md`, K-85; medido en
 * M-23).
 *
 * El rescate tenía el suyo. `marcarParadaCompletada()` volvía a preguntar por los retos a
 * `estado.retoActual`, una segunda fuente que el rescate no toca: con el audio terminado y el
 * reto sin resolver se concedía el rescate, se decía, y «avanzar» no se encendía (K-87; M-24).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real y el
 * botón real de hijo2.
 *
 *   EC-1  Reactivar una parada ya completada la deja lista para avanzar, sin ficha nueva.
 *   EC-2  Lo mismo tras recargar la página y reanudar por el diálogo real.
 *   EC-3  Lo mismo cuando hijo2 se cae y el supervisor lo recarga.
 *   EC-4  A un elemento ya completado no se le ofrece el rescate.
 *   EC-5  Control: reactivar una parada sin completar la deja pendiente, con su ficha intacta.
 *   EC-6 a EC-9  A una parada ya completada nada le crea una ficha nueva: ni otra llegada, ni el
 *         audio escuchado otra vez, ni el reto resuelto otra vez, ni el botón de saltar (K-73).
 *   RS-1  El rescate con el audio terminado y el reto sin resolver deja avanzar.
 *   RS-2  Control: el rescate con el audio sin terminar deja avanzar.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen EC-1, EC-2, EC-3, EC-4 y RS-1; EC-5 y RS-2
 * pasan, que es lo que les toca a los controles. EC-6 a EC-9 caen con el código anterior a K-73.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Parada real de la Aventura1, con reto y con audio. En inglés ese audio no tiene fichero y se salta.
const PARADA = { id: 'Av1-P-1', clave: 'padre-P1', lat: 39.47959, lng: -0.37583, audio: 'audio-Av1-P-1-en', reto: 'R4-Av1-en' };

const estadoDelPadre = (page) => page.evaluate((p) => {
  const e = globalThis.estado;
  const f = e?.pendingCompleciones?.[p.clave];
  return {
    elemento: e?.elementoActual?.parada_id || e?.elementoActual?.tramo_id || null,
    completada: !!e?.paradasCompletadas?.has(p.id),
    listaParaAvanzar: e?.paradaListaParaAvanzar === true,
    ficha: f ? { llegada: f.llegada, audio: f.audio, reto: f.reto } : null,
  };
}, PARADA);

/** El botón de verdad, en el hijo2 de verdad. */
const avanzarApagado = (page) => page.evaluate(() => document.getElementById('hijo2')?.contentDocument?.getElementById('btn-avanzar')?.disabled ?? null);

/** Pone en hijo2 un oído que apunta lo que el padre le manda de verdad sobre «avanzar». */
const escucharEnHijo2 = (page) => page.evaluate(() => {
  const w = document.getElementById('hijo2').contentWindow;
  w.__avanzar = [];
  w.addEventListener('message', (e) => {
    if (e.source === w.parent && e.data?.datos?.control === 'btnAvanzar') w.__avanzar.push({ tipo: e.data.tipo, razon: e.data.datos.razon });
  });
});
const recibidoEnHijo2 = (page) => page.evaluate(() => document.getElementById('hijo2').contentWindow.__avanzar || []);

/** Un aviso al padre por el bus del propio hijo. */
async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

const hijosListos = (page) => page.waitForFunction(
  () => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)),
  null, { timeout: 90_000 },
);

const activarLaParada = (page) => page.evaluate((id) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: id } }), PARADA.id);

/** Deja el padre real, con sus hijos reales, en AVENTURA sobre la parada. */
async function prepararParada(page) {
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'en';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
    if (!globalThis.AVENTURA_PARADAS?.length) {
      const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
  });
  // Los hijos se cargan con el ayudante común; la espera de abajo nombra los que este spec necesita.
  await cargarHijosDelPadre(page);
  await hijosListos(page);
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  const cambio = await activarLaParada(page);
  expect(cambio?.exito, `la parada ${PARADA.id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
  await expect.poll(async () => (await estadoDelPadre(page)).ficha, { timeout: 10_000, message: 'la parada recién activada tiene su ficha, a cero' })
    .toEqual({ llegada: false, audio: false, reto: false });
}

const saltarElAudio = (page) => page.evaluate(() => document.getElementById('audio-action-skip').click());

/** La parada completa, por sus caminos: llegada (dos lecturas en el punto), audio saltado y reto resuelto. */
async function completarLaParada(page) {
  // Una lectura en el punto por vuelta, por el mismo sitio por el que entra el GPS, hasta que el sensor da la llegada por buena.
  await expect.poll(async () => {
    await page.evaluate((p) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: p.lat, longitude: p.lng, accuracy: 8 } }), PARADA);
    return (await estadoDelPadre(page)).ficha?.llegada;
  }, { timeout: 15_000, intervals: [300], message: 'la llegada consta en la ficha' }).toBe(true);
  await saltarElAudio(page);
  await expect.poll(async () => (await estadoDelPadre(page)).ficha?.audio, { timeout: 10_000, message: 'el audio saltado consta como terminado' }).toBe(true);
  await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: PARADA.reto, correcto: true });
  await expect.poll(async () => (await estadoDelPadre(page)).listaParaAvanzar, { timeout: 15_000, message: 'la parada queda completada y lista para avanzar' }).toBe(true);
  await expect.poll(() => avanzarApagado(page), { timeout: 10_000, message: '«avanzar» encendido en hijo2' }).toBe(false);
}

/** Lo que tiene que cumplir una parada ya completada después de volver a activarse. */
async function sigueListaParaAvanzar(page, cuando) {
  await expect.poll(async () => (await estadoDelPadre(page)).listaParaAvanzar, { timeout: 20_000, message: `${cuando}, la parada ya completada sigue lista para avanzar` }).toBe(true);
  await expect.poll(() => avanzarApagado(page), { timeout: 10_000, message: `${cuando}, «avanzar» está encendido en hijo2` }).toBe(false);
  const padre = await estadoDelPadre(page);
  expect(padre, `${cuando}, sigue completada y no nace una ficha nueva que pida otra vez el audio y el reto`).toMatchObject({ elemento: PARADA.id, completada: true, ficha: null });
}

function antesDeCadaTest(conGeolocalizacion) {
  return async ({ page, context }) => {
    if (conGeolocalizacion) {
      // Antes del goto: sin esto, el watchPosition real que arranca al entrar en AVENTURA se queda colgado en Firefox.
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    }
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  };
}

test.describe('EC — Un elemento completado sigue completado', () => {
  test.beforeEach(antesDeCadaTest(true));

  test('EC-1. Reactivar una parada ya completada la deja lista para avanzar, sin ficha nueva', async ({ page }) => {
    await prepararParada(page);
    await completarLaParada(page);
    await escucharEnHijo2(page);

    const cambio = await activarLaParada(page);
    expect(cambio?.exito).toBe(true);
    await expect.poll(async () => (await recibidoEnHijo2(page)).length, { timeout: 10_000, message: 'la reactivación le dice a hijo2 cómo queda «avanzar»' }).toBeGreaterThan(0);

    const avisos = await recibidoEnHijo2(page);
    expect(avisos[avisos.length - 1], 'el elemento ya está completado: «avanzar» encendido').toEqual({ tipo: 'CONTROL.HABILITAR', razon: 'elemento_completado' });
    await sigueListaParaAvanzar(page, 'tras reactivarse');
  });

  test('EC-2. Recargar la página y reanudar deja la parada ya completada lista para avanzar', async ({ page }) => {
    test.setTimeout(180_000);
    await prepararParada(page);
    await completarLaParada(page);
    // `vv_progreso` y `vv_paradas_completadas` son los que ha escrito el padre. `vv_aventura_iniciada` lo escribe la activación
    // real al entrar en la aventura (P16), que este test no recorre: se pone aquí con esa misma forma.
    await page.evaluate(() => {
      localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'en', modo: 'aventura', dev: false, timestamp: Date.now() }));
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#btn-continuar-aventura', { timeout: 60_000 });
    await page.evaluate(() => document.getElementById('btn-continuar-aventura').click());
    await hijosListos(page);
    await expect.poll(async () => (await estadoDelPadre(page)).elemento, { timeout: 60_000, message: 'la reanudación restaura el elemento' }).toBe(PARADA.id);

    await sigueListaParaAvanzar(page, 'tras reanudar');
  });

  test('EC-3. hijo2 se cae y se recarga: la parada ya completada sigue lista para avanzar', async ({ page }) => {
    test.setTimeout(180_000);
    await prepararParada(page);
    await completarLaParada(page);

    await page.evaluate(() => { document.getElementById('hijo2').contentWindow.location.replace('about:blank'); });
    // Tres latidos sin respuesta (15 s) y la recarga: el hijo deja de constar como listo y vuelve a constar.
    await page.waitForFunction(() => {
      const listo = globalThis.__vv_stateManager.hijoEstaListo('hijo2');
      if (!listo) globalThis.__e2e_hijo2Cayo = true;
      return globalThis.__e2e_hijo2Cayo === true && listo
        && /coordenadas-hijo2\.html/.test(document.getElementById('hijo2').contentWindow.location.href);
    }, null, { timeout: 90_000 });

    await sigueListaParaAvanzar(page, 'tras recuperarse hijo2');
  });

  test('EC-4. A un elemento ya completado no se le ofrece el rescate', async ({ page }) => {
    await prepararParada(page);
    await completarLaParada(page);
    const rescate = await page.evaluate(() => { const r = globalThis._estadoRescate(); return { puede: r.puede, motivo: r.motivo }; });
    expect(rescate, 'ofrecérselo sería cobrarle por algo que ya tiene').toEqual({ puede: false, motivo: 'ya-completado' });
  });

  test('EC-5. Control: reactivar una parada sin completar la deja pendiente, con su ficha intacta', async ({ page }) => {
    await prepararParada(page);
    await saltarElAudio(page);
    await expect.poll(async () => (await estadoDelPadre(page)).ficha?.audio, { timeout: 10_000, message: 'precondición: el audio consta como terminado' }).toBe(true);
    await escucharEnHijo2(page);

    const cambio = await activarLaParada(page);
    expect(cambio?.exito).toBe(true);
    await expect.poll(async () => (await recibidoEnHijo2(page)).length, { timeout: 10_000, message: 'la reactivación le dice a hijo2 cómo queda «avanzar»' }).toBeGreaterThan(0);

    const avisos = await recibidoEnHijo2(page);
    expect(avisos[avisos.length - 1], 'la parada no está completada: «avanzar» sigue a la espera').toEqual({ tipo: 'CONTROL.DESHABILITAR', razon: 'elemento_sin_completar' });
    const padre = await estadoDelPadre(page);
    expect(padre, 'ni completada ni lista, y la ficha conserva lo que ya estaba hecho').toMatchObject({ completada: false, listaParaAvanzar: false, ficha: { audio: true, reto: false } });
  });

  // Un elemento ya completado no tiene nada pendiente: nada le vuelve a crear ficha mientras espera la pulsación de «avanzar»
  // (K-73). Cada aviso se manda con acuse: cuando vuelve, el handler del padre ha terminado.
  for (const caso of [
    { id: 'EC-6', que: 'otra llegada (el segundo sensor)', hijo: 'hijo2', tipo: 'NAVEGACION.LLEGADA_DETECTADA', datos: { paradaId: PARADA.id, coordenadas: { lat: PARADA.lat, lng: PARADA.lng }, distancia: 3 } },
    { id: 'EC-7', que: 'el audio escuchado otra vez', hijo: 'hijo3', tipo: 'AUDIO.FIN_REPRODUCCION', datos: { audioId: PARADA.audio, duracion: 10 } },
    { id: 'EC-8', que: 'el reto resuelto otra vez', hijo: 'hijo4', tipo: 'RETO.COMPLETADO', datos: { retoId: PARADA.reto, correcto: true } },
  ]) {
    test(`${caso.id}. A una parada ya completada, ${caso.que} no le crea una ficha nueva`, async ({ page }) => {
      await prepararParada(page);
      await completarLaParada(page);
      expect((await estadoDelPadre(page)).ficha, 'precondición: completada y sin ficha').toBeNull();

      await page.evaluate(async ({ hijo, tipo, datos }) => {
        await document.getElementById(hijo).contentWindow.mensajeria.enviarMensajeConConfirmacion({ tipo, destino: 'padre', datos, timeout: 15_000 });
      }, caso);

      expect(await estadoDelPadre(page), 'sigue completada, lista para avanzar y sin ficha').toMatchObject({ completada: true, listaParaAvanzar: true, ficha: null });
    });
  }

  test('EC-9. En una parada ya completada, el botón de saltar el audio no le crea una ficha nueva', async ({ page }) => {
    await prepararParada(page);
    await completarLaParada(page);

    await saltarElAudio(page);

    expect(await estadoDelPadre(page), 'sigue completada, lista para avanzar y sin ficha').toMatchObject({ completada: true, listaParaAvanzar: true, ficha: null });
  });
});

// ── El rescate, por su camino real: el asistente, su botón y las dos confirmaciones (como 72-rescate-concesion.spec.js) ──

async function abrirAsistenteConBoton(page) {
  await cargarHijosDelPadre(page);
  await page.waitForFunction(
    () => [...(globalThis.mensajeria?.getIframesRegistrados?.() || new Map()).keys()].includes('hijo6-chat')
      && ['hijo2', 'hijo6-chat'].every((h) => globalThis.estado?.hijosInicializados?.has(h)),
    null, { timeout: 90_000 },
  );
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  await page.waitForFunction(
    () => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.tema-btn'),
    null, { timeout: 30_000 },
  );
  await page.evaluate(async () => {
    const doc = document.getElementById('hijo6-chat').contentDocument;
    // Se abre comprobando `aria-expanded`, nunca pulsando a ciegas: son interruptores.
    for (const b of doc.querySelectorAll('.tema-btn')) if (b.getAttribute('aria-expanded') !== 'true') b.click();
    await new Promise((r) => setTimeout(r, 150));
    for (const b of doc.querySelectorAll('.pregunta-btn')) if (b.getAttribute('aria-expanded') !== 'true') b.click();
    await new Promise((r) => setTimeout(r, 150));
  });
  await page.waitForFunction(
    () => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.boton-rescate'),
    null, { timeout: 15_000 },
  );
}

/** La primera pantalla pone la opción segura arriba; la segunda, abajo. Así se distinguen. */
const esSegundaPantalla = () => document.querySelector('#decision-rescate button[data-clave]')?.dataset.clave === 'si';

async function pedirRescateYDecirQueSiDosVeces(page) {
  await page.evaluate(() => { document.getElementById('hijo6-chat').contentDocument.querySelector('.boton-rescate').click(); });
  await page.waitForSelector('#decision-rescate button[data-clave]', { timeout: 15_000 });
  await page.evaluate(() => document.querySelector('#decision-rescate button[data-clave="si"]').click());
  await page.waitForFunction(esSegundaPantalla, null, { timeout: 15_000 });
  await page.evaluate(() => document.querySelector('#decision-rescate button[data-clave="si"]').click());
}

/** El padre en AVENTURA sobre la parada, sin llegada confirmada y con el reto sin resolver. */
async function ponerParadaParaRescate(page, audioTerminado) {
  return page.evaluate(async ({ audioTerminado }) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
    const elementos = globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre;
    const parada = elementos?.find((e) => e.parada_id === 'Av1-P-1');
    if (!parada) return { listo: false };
    const retos = Array.isArray(parada.reto_id) ? parada.reto_id : [parada.reto_id];
    const e = globalThis.estado;
    if (!e.modo) e.modo = {};
    e.modo.actual = 'aventura';
    e.elementoActual = parada;
    e.paradaActual = 'Av1-P-1';
    e.indiceProgreso = elementos.indexOf(parada);
    e.paradasCompletadas = new Map();
    e.tramoSkipsUsados = 0;
    e.rescateEnCurso = null;
    e.paradaListaParaAvanzar = false;
    e.pendingCompleciones = { [parada.padreid]: { tipo: 'parada', llegada: false, audio: audioTerminado, reto: false, retosTotal: retos.length, retosCompletadosCount: 0, timestamp: Date.now(), ttlMs: 600000 } };
    e.retoActual = { id: retos[0], cola: retos, colaCompletados: new Set() };
    return { listo: true };
  }, { audioTerminado });
}

test.describe('RS — El rescate deja avanzar', () => {
  test.beforeEach(antesDeCadaTest(false));

  for (const [id, audioTerminado] of [['RS-1', true], ['RS-2. Control', false]]) {
    test(`${id}. El rescate con el audio ${audioTerminado ? 'terminado' : 'sin terminar'} y el reto sin resolver deja avanzar`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.waitForFunction(() => typeof globalThis._estadoRescate === 'function', null, { timeout: 15_000 });
      const prep = await ponerParadaParaRescate(page, audioTerminado);
      test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
      await abrirAsistenteConBoton(page);
      await escucharEnHijo2(page);

      await pedirRescateYDecirQueSiDosVeces(page);

      await expect.poll(() => page.evaluate(() => !!globalThis.estado.paradasCompletadas?.has('Av1-P-1')), { timeout: 15_000, message: 'el rescate da el punto por visitado' }).toBe(true);
      await expect.poll(() => page.evaluate(() => globalThis.estado.paradaListaParaAvanzar === true), { timeout: 10_000, message: 'tras el rescate se puede avanzar' }).toBe(true);
      // El aviso a hijo2 viaja aparte, por postMessage, y llega después de que el padre anote que se puede avanzar: se espera.
      await expect.poll(async () => (await recibidoEnHijo2(page)).at(-1), { timeout: 10_000, message: 'y el padre le enciende «avanzar» a hijo2' })
        .toEqual({ tipo: 'CONTROL.HABILITAR', razon: 'elemento_completado' });
    });
  }
});
