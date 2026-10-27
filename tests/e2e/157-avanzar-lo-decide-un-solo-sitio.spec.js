/**
 * 157 — «Avanzar» lo decide un solo sitio del padre
 *
 * POR QUE EXISTE
 *
 * «Avanzar» se enciende solo si se cumplen cinco cosas a la vez, y las mira un solo sitio del
 * padre (`_decidirAvanzar`): el modo es AVENTURA; no hay un reto abierto; el usuario no está a
 * más de 5 km de la ruta; no está fuera de rango con la gracia agotada; y el elemento está
 * completado. hijo2 solo obedece lo que el padre le manda, y la pulsación pregunta al mismo sitio.
 *
 * No era así. hijo2 lo encendía también por su cuenta, por cercanía y con sus propios umbrales:
 * en un tramo, a menos de su tolerancia del final, antes de que el padre diera la llegada; y en
 * una parada a medias, al volver de los 5 km. Pulsarlo entonces no avanzaba. Y la pulsación
 * avanzaba con mirar solo si el elemento estaba completado (`docs/estudio-caminos.md`, K-86).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real y el botón
 * real de hijo2. Las posiciones entran por el mismo sitio que las del GPS
 * (`procesarPosicionGPSParaAventura`), y el bloqueo de 5 km por su comprobación real
 * (`_vv_check5km`). Lo que se mira es el atributo del botón: lo que ve el usuario, lo encienda
 * quien lo encienda.
 *
 *   AV-1  Un tramo sin completar no enciende «avanzar» al acercarse a su final; completado, sí.
 *   AV-2  Una parada a medias no enciende «avanzar» al volver de los 5 km; completada, sí.
 *   AV-3  Control: con la parada completada, salir de rango sin gracia lo apaga y volver lo enciende.
 *   AV-4  Una pulsación con el botón apagado (fuera de rango) no avanza; con el botón encendido, sí.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen AV-1, AV-2 y AV-4; AV-3 pasa, que es lo que
 * le toca al control.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Elementos reales de la Aventura1, en inglés: la parada de inicio, el tramo TR-1, que sale de ella,
// y la parada P-1, donde acaba. El último waypoint del tramo queda a unos 22 m del final: dentro de
// la tolerancia del tramo (más de 35 m) y fuera del radio de llegada (15 m).
const INICIO = { id: 'Av1-P-0', clave: 'padre-P0', lat: 39.47876, lng: -0.37626, reto: 'R3-Av1-en' };
const TRAMO = { id: 'Av1-TR-1', inicio: { lat: 39.47876, lng: -0.37626 }, ultimoWaypoint: { lat: 39.47943, lng: -0.37597 } };
const PARADA = { id: 'Av1-P-1', clave: 'padre-P1', lat: 39.47959, lng: -0.37583, reto: 'R4-Av1-en' };
// Unos 330 m al norte de la parada: franja «lejos», que no tiene gracia.
const LEJOS_DE_LA_PARADA = { lat: 39.48259, lng: -0.37583 };
// A unos 300 km de la ruta: fuera de los 5 km.
const MADRID = { lat: 40.41678, lng: -3.70379 };

/** El botón de verdad, en el hijo2 de verdad. */
const avanzarApagado = (page) => page.evaluate(() => document.getElementById('hijo2')?.contentDocument?.getElementById('btn-avanzar')?.disabled ?? null);
const esperarAvanzar = (page, apagado, mensaje) =>
  expect.poll(() => avanzarApagado(page), { timeout: 15_000, message: mensaje }).toBe(apagado);

/**
 * Pone en hijo2 un registro de cada vez que «avanzar» se enciende, y de cada lectura de posición
 * que le llega. Un registro con `oldValue === null` es un `disabled` que vuelve a ponerse: el
 * botón estuvo encendido justo antes, aunque fuera un instante.
 */
const vigilarHijo2 = (page) => page.evaluate(() => {
  const w = document.getElementById('hijo2').contentWindow;
  const boton = w.document.getElementById('btn-avanzar');
  w.__encendidos = 0;
  w.__lecturas = [];
  new w.MutationObserver((registros) => {
    for (const r of registros) if (r.oldValue === null || !boton.disabled) w.__encendidos++;
  }).observe(boton, { attributes: true, attributeFilter: ['disabled'], attributeOldValue: true });
  w.addEventListener('message', (e) => {
    const d = e.data?.datos;
    if (e.source === w.parent && e.data?.tipo === 'NAVEGACION.ACTUALIZAR_ESTADO' && typeof d?.distanciaAlDestino === 'number') {
      w.__lecturas.push({ id: d.idParada, distancia: d.distanciaAlDestino, tolerancia: d.toleranciaGPS });
    }
  });
});
const encendidos = (page) => page.evaluate(() => document.getElementById('hijo2').contentWindow.__encendidos);
const lecturasDe = async (page, id) => (await page.evaluate(() => document.getElementById('hijo2').contentWindow.__lecturas)).filter((l) => l.id === id);

/** Una lectura de posición, por el mismo sitio por el que entra el GPS. */
const leerEn = (page, p) => page.evaluate((q) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: 8 } }), p);

/** Un aviso al padre por el bus del propio hijo. */
async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

const elementoActual = (page) => page.evaluate(() => globalThis.estado.elementoActual?.parada_id || globalThis.estado.elementoActual?.tramo_id || null);
const fichaDe = (page, clave) => page.evaluate((c) => {
  const f = globalThis.estado?.pendingCompleciones?.[c];
  return f ? { llegada: f.llegada, audio: f.audio, reto: f.reto } : null;
}, clave);

/**
 * El padre real con sus hijos reales, en AVENTURA, con la geolocalización emulada en un punto
 * (antes del goto: sin esto, el watchPosition real que arranca al entrar en AVENTURA se queda
 * colgado en Firefox).
 */
async function arrancar(page, context, punto) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: punto.lat, longitude: punto.lng });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
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
  await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  await vigilarHijo2(page);
}

/** Activa un elemento por el camino real. Recién activado y sin completar, «avanzar» está apagado. */
async function activar(page, id) {
  const cambio = await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), id);
  expect(cambio?.exito, `${id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
  expect(await elementoActual(page), `${id} es el elemento actual`).toBe(id);
  await esperarAvanzar(page, true, `recién activado ${id}, sin completar, «avanzar» está apagado`);
}

/** Una parada completa, por sus caminos: llegada (lecturas en el punto), audio saltado y reto resuelto. */
async function completarLaParada(page, parada) {
  await expect.poll(async () => {
    await leerEn(page, parada);
    return (await fichaDe(page, parada.clave))?.llegada;
  }, { timeout: 15_000, intervals: [300], message: `la llegada a ${parada.id} consta en la ficha` }).toBe(true);
  await page.evaluate(() => document.getElementById('audio-action-skip').click());
  await expect.poll(async () => (await fichaDe(page, parada.clave))?.audio, { timeout: 10_000, message: `el audio saltado de ${parada.id} consta como terminado` }).toBe(true);
  await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: parada.reto, correcto: true });
  await expect.poll(() => page.evaluate(() => globalThis.estado.paradaListaParaAvanzar === true), { timeout: 15_000, message: `${parada.id} queda completada y lista para avanzar` }).toBe(true);
  await esperarAvanzar(page, false, `completada ${parada.id}, «avanzar» está encendido`);
}

/** Sale de rango sin gracia (a unos 330 m) y espera a que hijo2 lo diga y el botón se apague. El GPS emulado se mueve con las lecturas. */
async function salirDeRango(page, context) {
  await context.setGeolocation({ latitude: LEJOS_DE_LA_PARADA.lat, longitude: LEJOS_DE_LA_PARADA.lng });
  await expect.poll(async () => {
    await leerEn(page, LEJOS_DE_LA_PARADA);
    return avanzarApagado(page);
  }, { timeout: 15_000, intervals: [300], message: 'fuera de rango con la gracia agotada, «avanzar» se apaga' }).toBe(true);
  await expect.poll(() => page.evaluate(() => globalThis.estado.usuarioFueraRango?.activo === true), { timeout: 10_000, message: 'el padre anota que el usuario está fuera de rango' }).toBe(true);
}

/** Vuelve a la parada y espera a que el botón se vuelva a encender. */
async function volverALaParada(page, context) {
  await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
  await expect.poll(async () => {
    await leerEn(page, PARADA);
    return avanzarApagado(page);
  }, { timeout: 15_000, intervals: [300], message: 'de vuelta en la parada completada, «avanzar» se vuelve a encender' }).toBe(false);
}

test.describe('AV — «Avanzar» lo decide un solo sitio del padre', () => {
  test('AV-1. Un tramo sin completar no enciende «avanzar» al acercarse a su final; completado, sí', async ({ page, context }) => {
    test.setTimeout(120_000);
    // Como en la aventura: al entrar en AVENTURA el padre activa la parada de inicio; se completa, se pulsa «avanzar» y se
    // llega al tramo por la progresión real. Saltar directamente al tramo no sirve: la activación de la parada de inicio
    // deja a hijo2 un «apagado» que nadie levanta hasta que la parada se completa.
    await arrancar(page, context, TRAMO.inicio);
    await expect.poll(() => elementoActual(page), { timeout: 15_000, message: 'al entrar en AVENTURA, el elemento actual es la parada de inicio' }).toBe(INICIO.id);
    await completarLaParada(page, INICIO);
    await page.evaluate(() => document.getElementById('hijo2').contentDocument.getElementById('btn-avanzar').click());
    await expect.poll(() => elementoActual(page), { timeout: 15_000, message: 'pulsar «avanzar» lleva al tramo' }).toBe(TRAMO.id);
    await esperarAvanzar(page, true, 'recién activado el tramo, sin completar, «avanzar» está apagado');
    const antes = await encendidos(page);

    // Lecturas en el último waypoint, hasta que hijo2 tenga varias entre el radio de llegada y la tolerancia del tramo.
    await expect.poll(async () => {
      await leerEn(page, TRAMO.ultimoWaypoint);
      return (await lecturasDe(page, TRAMO.id)).filter((l) => l.distancia > 15 && l.distancia <= l.tolerancia).length;
    }, { timeout: 15_000, intervals: [300], message: 'hijo2 recibe lecturas del tramo entre el radio de llegada y su tolerancia' }).toBeGreaterThanOrEqual(3);
    // VENTANA-OBSERVACION: con esas lecturas ya en hijo2, «avanzar» no se enciende; el tramo no está completado.
    await page.waitForTimeout(1000);
    expect(await encendidos(page), 'el tramo no está completado: «avanzar» no se enciende por cercanía').toBe(antes);
    expect(await page.evaluate(() => globalThis.estado.paradaListaParaAvanzar === true), 'y el padre no lo tiene listo para avanzar').toBe(false);

    // Control: completado el tramo (llegada y audio terminado), el mismo registro ve encenderse «avanzar».
    const audio = await page.evaluate((id) => globalThis.DATOS_PADRE?.Aventura1?.en?.elementosIDpadre?.find((e) => e.tramo_id === id)?.audio_id ?? null, TRAMO.id);
    expect(typeof audio, `el tramo ${TRAMO.id} tiene audio en inglés`).toBe('string');
    await desdeHijo(page, 'hijo2', 'NAVEGACION.LLEGADA_DETECTADA', { paradaId: TRAMO.id, parada_id: TRAMO.id, tipoParada: 'tramo', distancia: 3, timestamp: Date.now() });
    await desdeHijo(page, 'hijo3', 'AUDIO.FIN_REPRODUCCION', { audioId: audio, duracion: 1, timestamp: Date.now() });
    await expect.poll(() => encendidos(page), { timeout: 15_000, message: 'completado el tramo, «avanzar» se enciende' }).toBeGreaterThan(antes);
    await esperarAvanzar(page, false, 'y queda encendido');
  });

  test('AV-2. Una parada a medias no enciende «avanzar» al volver de los 5 km; completada, sí', async ({ page, context }) => {
    test.setTimeout(120_000);
    await arrancar(page, context, PARADA);
    await activar(page, PARADA.id);

    // Tres comprobaciones seguidas fuera de los 5 km bloquean; una dentro desbloquea. La marca del
    // intervalo se pone a cero antes de cada una: aquí se prueba lo que decide el bloqueo, no su reloj.
    const comprobar5km = (p) => page.evaluate((q) => {
      globalThis.__VV_5KM_LAST_CHECK = null;
      globalThis._vv_check5km(q.lat, q.lng, 20);
      return globalThis.__VV_5KM_BLOCKED === true;
    }, p);
    for (let i = 0; i < 3; i++) await comprobar5km(MADRID);
    expect(await page.evaluate(() => globalThis.__VV_5KM_BLOCKED === true), 'tres lecturas a 300 km bloquean la aventura').toBe(true);
    expect(await comprobar5km(PARADA), 'una lectura en la parada la desbloquea').toBe(false);

    // Lecturas en la parada, hasta que hijo2 tenga varias a menos de 15 m. La parada sigue sin audio ni reto.
    await expect.poll(async () => {
      await leerEn(page, PARADA);
      return (await lecturasDe(page, PARADA.id)).filter((l) => l.distancia <= 15).length;
    }, { timeout: 15_000, intervals: [300], message: 'hijo2 recibe lecturas a menos de 15 m de la parada' }).toBeGreaterThanOrEqual(3);
    // VENTANA-OBSERVACION: de vuelta en la zona y junto a la parada, «avanzar» no se enciende; la parada está a medias.
    await page.waitForTimeout(1000);
    expect(await encendidos(page), 'la parada no está completada: volver a la zona no enciende «avanzar»').toBe(0);

    // Control: completada la parada (audio saltado y reto resuelto), el mismo registro ve encenderse «avanzar».
    await page.evaluate(() => document.getElementById('audio-action-skip').click());
    await expect.poll(async () => (await fichaDe(page, PARADA.clave))?.audio, { timeout: 10_000, message: 'el audio saltado consta como terminado' }).toBe(true);
    await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: PARADA.reto, correcto: true });
    await expect.poll(() => encendidos(page), { timeout: 15_000, message: 'completada la parada, «avanzar» se enciende' }).toBeGreaterThan(0);
    await esperarAvanzar(page, false, 'y queda encendido');
  });

  test('AV-3. Control: con la parada completada, salir de rango sin gracia apaga «avanzar» y volver lo enciende', async ({ page, context }) => {
    test.setTimeout(120_000);
    await arrancar(page, context, PARADA);
    await activar(page, PARADA.id);
    await completarLaParada(page, PARADA);

    await salirDeRango(page, context);
    await volverALaParada(page, context);
  });

  test('AV-4. Una pulsación con el botón apagado no avanza; con el botón encendido, sí', async ({ page, context }) => {
    test.setTimeout(120_000);
    await arrancar(page, context, PARADA);
    await activar(page, PARADA.id);
    await completarLaParada(page, PARADA);
    await salirDeRango(page, context);

    // Una pulsación que ya iba de camino cuando el botón se apagó: el mismo mensaje que manda el
    // botón, con su acuse, que vuelve cuando el padre ha terminado de atenderla.
    await page.evaluate(() => document.getElementById('hijo2').contentWindow.mensajeria.enviarMensajeConConfirmacion({
      tipo: 'NAVEGACION.GPS.ACTIVAR', destino: 'padre', datos: { activar: true }, timeout: 15_000,
    }));
    expect(await elementoActual(page), 'con «avanzar» apagado, la pulsación no avanza').toBe(PARADA.id);
    expect(await page.evaluate(() => globalThis.estado.paradaListaParaAvanzar === true), 'y la parada sigue lista para cuando se pueda').toBe(true);

    // De vuelta en la parada el botón se enciende, y pulsarlo —el botón de verdad— avanza.
    await volverALaParada(page, context);
    await page.evaluate(() => document.getElementById('hijo2').contentDocument.getElementById('btn-avanzar').click());
    await expect.poll(() => elementoActual(page), { timeout: 15_000, message: 'con «avanzar» encendido, pulsarlo avanza al elemento siguiente' }).not.toBe(PARADA.id);
  });
});
