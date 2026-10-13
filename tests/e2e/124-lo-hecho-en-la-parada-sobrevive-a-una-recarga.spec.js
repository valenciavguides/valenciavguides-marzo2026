/**
 * 124 — Lo hecho en la parada sobrevive a una recarga
 *
 * POR QUE EXISTE
 *
 * La ficha del elemento (`estado.pendingCompleciones[clave]`) dice qué lleva hecho el usuario
 * dentro de él: la llegada, el audio y el reto. No se guardaba. Al recargarse la app con la
 * parada a medias —el teléfono la cierra en el bolsillo—, la reanudación le creaba una ficha
 * nueva, a cero, y había que repetir lo hecho: en español, escuchar el audio entero otra vez;
 * en los otros once idiomas, saltarlo otra vez; y el reto, si ya estaba resuelto
 * (`docs/estudio-caminos.md`, K-89; medido en M-23).
 *
 * La escribían, además, siete funciones por separado y ninguna guardaba después. Ahora la
 * escribe un solo sitio (`_anotarEnFicha`), que guarda al momento, y `vv_progreso` lleva la
 * ficha del elemento actual; al reanudar, la activación de ese elemento se la devuelve.
 *
 * Y lo que la activación decide lo decide mirando lo que el elemento ya tiene hecho: la cola
 * de retos nace con los retos hechos, y el recordatorio «pulse retos» sigue corriendo si el
 * audio está terminado y queda reto (K-90: la activación lo paraba siempre).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real, los
 * botones reales y una recarga real de la página con su diálogo de reanudación.
 *
 *   FG-1  Lo que se hace en la parada se guarda al momento, sin esperar a nada más.
 *   FG-2  El audio terminado sigue terminado tras recargar: el botón de retos vuelve encendido.
 *   FG-3  Llegada y audio se conservan, y el reto resuelto después completa la parada.
 *   FG-4  Control: un progreso guardado sin ficha (anterior a ella) reanuda con la ficha a cero.
 *   FG-5  Control: la ficha guardada de otro elemento no se le aplica a este.
 *   FG-6  El reto resuelto sigue resuelto tras recargar, y la llegada después completa la parada.
 *   FG-7  Tras recargar con el audio terminado y el reto sin resolver, el recordatorio de retos vuelve.
 *   FG-8  Reactivar el mismo elemento con el audio terminado no apaga el recordatorio de retos.
 *   FG-9  Una ficha que vuelve completa sobre un elemento sin marcar como completado lo completa.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen FG-1, FG-2, FG-3, FG-6, FG-7, FG-8 y FG-9;
 * FG-4 y FG-5 pasan, que es lo que les toca a los controles.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

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
    retoHechoEnLaCola: e?.retoActual?.colaCompletados?.has(p.reto) === true,
    fichaEnEspera: e?._fichaGuardada ?? null,
  };
}, PARADA);

/** Lo que hay guardado de la ficha en `vv_progreso`, tal cual. */
const fichaGuardada = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('vv_progreso') || 'null')?.ficha ?? null; } catch { return 'ILEGIBLE'; }
});

/** Los botones de verdad, en los hijos de verdad. */
const retosApagado = (page) => page.evaluate(() => {
  const b = document.getElementById('hijo3')?.contentDocument?.getElementById('retosBtn');
  // De fábrica no lleva opacidad en línea: sin ella, el padre todavía no le ha mandado su estado.
  return b && b.style.opacity !== '' ? b.disabled : null;
});
const avanzarApagado = (page) => page.evaluate(() => document.getElementById('hijo2')?.contentDocument?.getElementById('btn-avanzar')?.disabled ?? null);

async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

const hijosListos = (page) => page.waitForFunction(
  () => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)),
  null, { timeout: 90_000 },
);

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
  // La carga dura lo que tarden los hijos: se lanza sin esperarla dentro del evaluate y se espera fuera, a su apretón de manos.
  await page.evaluate(() => { globalThis.cargarRestoDeiframes(); });
  await hijosListos(page);
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  await activarLaParada(page);
  await expect.poll(async () => (await estadoDelPadre(page)).ficha, { timeout: 10_000, message: 'la parada recién activada tiene su ficha, a cero' })
    .toEqual({ llegada: false, audio: false, reto: false });
}

/** La activación de la parada, por la misma fila del bus por la que llega cualquier cambio de parada. */
async function activarLaParada(page) {
  const cambio = await page.evaluate((id) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: id } }), PARADA.id);
  expect(cambio?.exito, `la parada ${PARADA.id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
}

async function saltarElAudio(page) {
  await page.evaluate(() => document.getElementById('audio-action-skip').click());
  await expect.poll(async () => (await estadoDelPadre(page)).ficha?.audio, { timeout: 10_000, message: 'el audio saltado consta como terminado' }).toBe(true);
}

async function resolverElReto(page) {
  await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: PARADA.reto, correcto: true });
}

/** Una lectura en el punto, por el mismo sitio por el que entra el GPS. */
const lecturaEnLaParada = (page) => page.evaluate((p) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: p.lat, longitude: p.lng, accuracy: 8 } }), PARADA);

/** Una lectura por vuelta hasta que el sensor da la llegada por buena. */
async function llegarALaParada(page) {
  await expect.poll(async () => {
    await lecturaEnLaParada(page);
    return (await estadoDelPadre(page)).ficha?.llegada;
  }, { timeout: 15_000, intervals: [300], message: 'la llegada consta en la ficha' }).toBe(true);
}

/**
 * El recordatorio «pulse retos» sale con proximidad real, con el botón de retos encendido y sin otro cartel en pantalla,
 * diez segundos después de arrancar. Se le da la proximidad en cada vuelta y se espera a verlo.
 */
async function esperarRecordatorioDeRetos(page, mensaje) {
  await expect.poll(() => page.evaluate(() => {
    const e = globalThis.estado;
    e.gps = e.gps || {};
    e.gps.proximidadReal = true;
    return !!document.getElementById('cartel-recordatorio-reto');
  }), { timeout: 45_000, intervals: [500], message: mensaje }).toBe(true);
}

/**
 * Recarga la página y reanuda por el diálogo real. `vv_progreso` y `vv_paradas_completadas` son los que ha escrito el padre;
 * `vv_aventura_iniciada` lo escribe la activación real al entrar en la aventura (P15), que estos tests no recorren: se pone
 * aquí con esa misma forma. `antes` permite tocar lo guardado justo antes de recargar. Con `conFicha: false` no se espera a
 * que el elemento tenga ficha tras reanudar (un elemento que se completa en la misma activación ya no la tiene).
 */
async function recargarYReanudar(page, { antes = null, conFicha = true } = {}) {
  await page.evaluate(() => {
    localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'en', modo: 'aventura', dev: false, timestamp: Date.now() }));
  });
  if (antes) await page.evaluate(antes);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#btn-continuar-aventura', { timeout: 60_000 });
  await page.evaluate(() => document.getElementById('btn-continuar-aventura').click());
  await hijosListos(page);
  await expect.poll(async () => (await estadoDelPadre(page)).elemento, { timeout: 60_000, message: 'la reanudación restaura el elemento' }).toBe(PARADA.id);
  if (conFicha) await expect.poll(async () => (await estadoDelPadre(page)).ficha !== null, { timeout: 30_000, message: 'la reanudación activa el elemento: su ficha existe' }).toBe(true);
  await expect.poll(() => retosApagado(page), { timeout: 30_000, message: 'el padre le ha mandado a hijo3 el estado de su botón de retos' }).not.toBeNull();
}

test.describe('FG — Lo hecho en la parada sobrevive a una recarga', () => {
  test.beforeEach(async ({ page, context }) => {
    // Antes del goto: sin esto, el watchPosition real que arranca al entrar en AVENTURA se queda colgado en Firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await prepararParada(page);
  });

  test('FG-1. Lo que se hace en la parada se guarda al momento', async ({ page }) => {
    await saltarElAudio(page);
    await expect.poll(() => fichaGuardada(page), { timeout: 10_000, message: 'el audio terminado queda guardado sin esperar a nada más' })
      .toEqual({ clave: PARADA.clave, llegada: false, audio: true, reto: false, retosCompletadosCount: 0 });

    await llegarALaParada(page);
    await expect.poll(() => fichaGuardada(page), { timeout: 10_000, message: 'y la llegada, cuando llega' })
      .toMatchObject({ clave: PARADA.clave, llegada: true, audio: true, reto: false });
  });

  test('FG-2. El audio terminado sigue terminado tras recargar: el botón de retos vuelve encendido', async ({ page }) => {
    test.setTimeout(180_000);
    await saltarElAudio(page);
    await expect.poll(() => retosApagado(page), { timeout: 10_000, message: 'precondición: el botón de retos está encendido' }).toBe(false);

    await recargarYReanudar(page);

    expect((await estadoDelPadre(page)).ficha, 'la ficha vuelve con el audio terminado').toEqual({ llegada: false, audio: true, reto: false });
    await expect.poll(() => retosApagado(page), { timeout: 15_000, message: 'audio terminado es audio terminado: el botón de retos está encendido sin volver a saltarlo' }).toBe(false);
    await expect.poll(async () => (await estadoDelPadre(page)).fichaEnEspera, { timeout: 15_000, message: 'lo guardado no queda esperando a otra activación' }).toBeNull();
  });

  test('FG-3. Llegada y audio se conservan, y el reto resuelto después completa la parada', async ({ page }) => {
    test.setTimeout(180_000);
    await llegarALaParada(page);
    await saltarElAudio(page);

    await recargarYReanudar(page);

    expect((await estadoDelPadre(page)).ficha, 'la ficha vuelve con la llegada y el audio').toEqual({ llegada: true, audio: true, reto: false });
    await resolverElReto(page);
    await expect.poll(async () => (await estadoDelPadre(page)).listaParaAvanzar, { timeout: 15_000, message: 'con el reto, la parada se completa sin repetir la llegada ni el audio' }).toBe(true);
    await expect.poll(() => avanzarApagado(page), { timeout: 10_000, message: '«avanzar» encendido en hijo2' }).toBe(false);
  });

  test('FG-4. Control: un progreso guardado sin ficha reanuda con la ficha a cero', async ({ page }) => {
    test.setTimeout(180_000);
    await saltarElAudio(page);

    await recargarYReanudar(page, { antes: () => {
      const progreso = JSON.parse(localStorage.getItem('vv_progreso'));
      delete progreso.ficha;
      localStorage.setItem('vv_progreso', JSON.stringify(progreso));
    } });

    expect((await estadoDelPadre(page)).ficha, 'sin ficha guardada, la del elemento nace a cero').toEqual({ llegada: false, audio: false, reto: false });
    expect(await retosApagado(page), 'y el botón de retos espera al audio').toBe(true);
  });

  test('FG-5. Control: la ficha guardada de otro elemento no se le aplica a este', async ({ page }) => {
    test.setTimeout(180_000);
    await saltarElAudio(page);

    await recargarYReanudar(page, { antes: () => {
      const progreso = JSON.parse(localStorage.getItem('vv_progreso'));
      progreso.ficha = { clave: 'padre-OTRO', llegada: true, audio: true, reto: true, retosCompletadosCount: 1 };
      localStorage.setItem('vv_progreso', JSON.stringify(progreso));
    } });

    const padre = await estadoDelPadre(page);
    expect(padre.ficha, 'la ficha de otro elemento no vale para este').toEqual({ llegada: false, audio: false, reto: false });
    expect(padre.completada, 'ni lo da por completado').toBe(false);
    await expect.poll(async () => (await estadoDelPadre(page)).fichaEnEspera, { timeout: 15_000, message: 'ni queda esperando a que ese otro elemento se active' }).toBeNull();
  });

  test('FG-6. El reto resuelto sigue resuelto tras recargar, y la llegada después completa la parada', async ({ page }) => {
    test.setTimeout(180_000);
    await saltarElAudio(page);
    await resolverElReto(page);
    await expect.poll(async () => (await estadoDelPadre(page)).ficha?.reto, { timeout: 10_000, message: 'precondición: el reto consta como hecho' }).toBe(true);

    await recargarYReanudar(page);

    expect((await estadoDelPadre(page)).ficha, 'la ficha vuelve con el audio y el reto').toEqual({ llegada: false, audio: true, reto: true });
    await expect.poll(async () => (await estadoDelPadre(page)).retoHechoEnLaCola, { timeout: 15_000, message: 'y la cola de retos lo da por hecho, como la ficha' }).toBe(true);

    await expect.poll(async () => {
      await lecturaEnLaParada(page);
      return (await estadoDelPadre(page)).listaParaAvanzar;
    }, { timeout: 15_000, intervals: [300], message: 'con la llegada, la parada se completa sin repetir el audio ni el reto' }).toBe(true);
    await expect.poll(() => avanzarApagado(page), { timeout: 10_000, message: '«avanzar» encendido en hijo2' }).toBe(false);
  });

  test('FG-7. Tras recargar con el audio terminado y el reto sin resolver, el recordatorio de retos vuelve', async ({ page }) => {
    test.setTimeout(300_000);
    await saltarElAudio(page);
    // Control del instrumento: antes de recargar, el recordatorio que arrancó el fin del audio se ve con esta misma espera.
    await esperarRecordatorioDeRetos(page, 'control: el recordatorio sale tras terminar el audio');

    await recargarYReanudar(page);

    await esperarRecordatorioDeRetos(page, 'al reanudar con el audio terminado y el reto pendiente, el recordatorio de retos corre otra vez');
  });

  test('FG-8. Reactivar el mismo elemento con el audio terminado no apaga el recordatorio de retos', async ({ page }) => {
    test.setTimeout(180_000);
    await saltarElAudio(page);

    // Lo que hace la recuperación de hijo2: volver a activar el elemento actual.
    await activarLaParada(page);

    await esperarRecordatorioDeRetos(page, 'el elemento se reactiva con el audio terminado y el reto pendiente: el recordatorio sigue');
  });

  test('FG-9. Una ficha que vuelve completa sobre un elemento sin marcar como completado lo completa al reanudar', async ({ page }) => {
    test.setTimeout(180_000);
    await llegarALaParada(page);
    await saltarElAudio(page);
    await resolverElReto(page);
    await expect.poll(async () => (await estadoDelPadre(page)).listaParaAvanzar, { timeout: 15_000, message: 'precondición: la parada se completa' }).toBe(true);
    expect(await fichaGuardada(page), 'precondición: la ficha completa quedó guardada').toMatchObject({ clave: PARADA.clave, llegada: true, audio: true, reto: true });

    // Lo guardado discrepa: la ficha dice que está todo hecho y la marca de completado no está (su clave no llegó a escribirse).
    await recargarYReanudar(page, { antes: () => localStorage.removeItem('vv_paradas_completadas'), conFicha: false });

    await expect.poll(async () => (await estadoDelPadre(page)).listaParaAvanzar, { timeout: 15_000, message: 'la activación cierra el elemento con la ficha que vuelve completa' }).toBe(true);
    expect((await estadoDelPadre(page)).completada, 'y lo deja marcado como completado').toBe(true);
    await expect.poll(() => avanzarApagado(page), { timeout: 10_000, message: '«avanzar» encendido en hijo2' }).toBe(false);
  });
});
