/**
 * 159 — El rescate deja seguir: también fuera de la zona, se cobra al concederlo y no repite el aviso
 *
 * POR QUE EXISTE
 *
 * El rescate existe para quien no puede llegar a un punto (vallado, en obras). Se concedía, la pantalla decía «pulse el
 * botón de avanzar», y el botón seguía apagado si el usuario estaba fuera de la zona con la gracia agotada: la regla de
 * «avanzar» (K-86) lo apaga fuera de rango, y solo se encendía al volver a la zona, que es justo lo que no puede hacer.
 * Decisión del usuario: un punto rescatado no mira la zona (los 5 km siguen mandando). Lo sabe por un solo registro del
 * rescate, guardado con el progreso, que nace al concederlo y se gasta al avanzar, y que decide también el cobro (al
 * concederlo) y el aviso de transición, que no sale encima de la pantalla del rescate (`docs/estudio-caminos.md`, K-86,
 * K-78 y K-91).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real, el botón del rescate del asistente
 * y el botón «avanzar» de hijo2. Las posiciones entran por el mismo sitio que las del GPS.
 *
 *   RZ-1  Rescatado fuera de rango (gracia agotada), «avanzar» se enciende.
 *   RZ-2  Control: completado sin rescate y fuera de rango, «avanzar» sigue apagado.
 *   RZ-3  El rescate se cobra al concederlo, y el cobro y el registro quedan guardados en `vv_progreso`.
 *   RZ-4  Tras el rescate no sale el cartel de transición.
 *   RZ-5  Al avanzar, el registro se gasta y el rescate no se cobra otra vez.
 *   RZ-6  Tras recargar y reanudar, el punto rescatado, fuera de rango, sigue dejando seguir, cobrado una vez.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen RZ-1, RZ-3, RZ-4 y RZ-6; RZ-2 y RZ-5 pasan.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Aventura1 en inglés: la parada P-1 (no es la de inicio, que no admite rescate) y su reto.
const PARADA = { id: 'Av1-P-1', clave: 'padre-P1', lat: 39.47959, lng: -0.37583, reto: 'R4-Av1-en' };
// Unos 330 m al norte: franja «lejos», que no tiene gracia (la restricción es inmediata).
const LEJOS = { lat: 39.48259, lng: -0.37583 };
// Unos 30 m al norte: franja «fuera», con 7 min de gracia (dentro del test, sin restringir) y sin llegada confirmada.
const A_TREINTA_METROS = { lat: 39.47986, lng: -0.37583 };

const avanzarApagado = (page) => page.evaluate(() => document.getElementById('hijo2')?.contentDocument?.getElementById('btn-avanzar')?.disabled ?? null);
const esperarAvanzar = (page, apagado, mensaje) =>
  expect.poll(() => avanzarApagado(page), { timeout: 15_000, message: mensaje }).toBe(apagado);
const leerEn = (page, p) => page.evaluate((q) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: q.lat, longitude: q.lng, accuracy: 8 } }), p);
const elementoActual = (page) => page.evaluate(() => globalThis.estado.elementoActual?.parada_id || globalThis.estado.elementoActual?.tramo_id || null);
const fichaDe = (page, clave) => page.evaluate((c) => {
  const f = globalThis.estado?.pendingCompleciones?.[c];
  return f ? { llegada: f.llegada, audio: f.audio, reto: f.reto } : null;
}, clave);
const cobroYRegistro = (page) => page.evaluate(() => {
  const guardado = JSON.parse(localStorage.getItem('vv_progreso') || 'null');
  return {
    usadas: globalThis.estado.tramoSkipsUsados,
    registro: globalThis.estado.rescateEnCurso?.elementoId ?? null,
    usadasGuardadas: guardado?.tramoSkipsUsados ?? null,
    registroGuardado: guardado?.rescateEnCurso?.elementoId ?? null,
  };
});

async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

/** El padre real con sus hijos reales, en AVENTURA, con la geolocalización emulada en un punto (antes del goto: Firefox). */
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
  await cargarHijosDelPadre(page);
  await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4', 'hijo6-chat'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
}

/** Activa la parada por el camino real: recién activada y sin completar, «avanzar» está apagado. */
async function activarLaParada(page) {
  const cambio = await page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), PARADA.id);
  expect(cambio?.exito, `${PARADA.id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);
  expect(await elementoActual(page), `${PARADA.id} es el elemento actual`).toBe(PARADA.id);
  await esperarAvanzar(page, true, 'recién activada y sin completar, «avanzar» está apagado');
}

/** Va a un sitio (GPS emulado y lecturas) y espera a que el padre anote que está fuera de rango con la gracia agotada. */
async function quedarseFueraDeRango(page, context) {
  await context.setGeolocation({ latitude: LEJOS.lat, longitude: LEJOS.lng });
  await expect.poll(async () => {
    await leerEn(page, LEJOS);
    return page.evaluate(() => globalThis.estado.usuarioFueraRango?.activo === true);
  }, { timeout: 15_000, intervals: [300], message: 'a 330 m (sin gracia), el padre anota que el usuario está fuera de rango' }).toBe(true);
}

/** Abre el asistente con su botón y despliega sus respuestas hasta que aparece el botón del rescate. */
async function abrirAsistente(page) {
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  await page.waitForFunction(() => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.tema-btn'), null, { timeout: 30_000 });
  await page.evaluate(async () => {
    const doc = document.getElementById('hijo6-chat').contentDocument;
    // Se abre comprobando `aria-expanded`, nunca pulsando a ciegas: son interruptores.
    for (const b of doc.querySelectorAll('.tema-btn')) if (b.getAttribute('aria-expanded') !== 'true') b.click();
    await new Promise((r) => setTimeout(r, 150)); // VENTANA-OBSERVACION: el acordeón despliega sus preguntas
    for (const b of doc.querySelectorAll('.pregunta-btn')) if (b.getAttribute('aria-expanded') !== 'true') b.click();
    await new Promise((r) => setTimeout(r, 150)); // VENTANA-OBSERVACION: las respuestas pintan sus botones
  });
  await page.waitForFunction(() => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.boton-rescate'), null, { timeout: 15_000 });
}

/** La primera pantalla pone la opción segura arriba; la segunda, abajo. Así se distinguen. */
const esSegundaPantalla = () => document.querySelector('#decision-rescate button[data-clave]')?.dataset.clave === 'si';

/** Pide el rescate con el botón del asistente, dice que sí dos veces y espera la pantalla de «rescate concedido». */
async function pedirElRescate(page) {
  await abrirAsistente(page);
  await page.evaluate(() => { document.getElementById('hijo6-chat').contentDocument.querySelector('.boton-rescate').click(); });
  await page.waitForSelector('#decision-rescate button[data-clave]', { timeout: 15_000 });
  await page.evaluate(() => document.querySelector('#decision-rescate button[data-clave="si"]').click());
  await page.waitForFunction(esSegundaPantalla, null, { timeout: 15_000 });
  await page.evaluate(() => document.querySelector('#decision-rescate button[data-clave="si"]').click());
  await expect.poll(() => page.evaluate((id) => globalThis.estado.paradasCompletadas?.has(id) === true, PARADA.id),
    { timeout: 15_000, message: 'el rescate deja la parada completada' }).toBe(true);
}

/** Cuenta las veces que se pide el cartel de transición (los dos que puede pedir la compleción de una parada). */
const vigilarCartelesDeTransicion = (page) => page.evaluate(() => {
  globalThis.__cartelesTransicion = 0;
  for (const nombre of ['mostrarCartelTransicion', 'mostrarCartelInicioTramo']) {
    const original = globalThis[nombre];
    globalThis[nombre] = function (...args) { globalThis.__cartelesTransicion++; return original?.apply(this, args); };
  }
});

test.describe('RZ — El rescate deja seguir', () => {
  test('RZ-1. Rescatado fuera de rango (gracia agotada), «avanzar» se enciende', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context, LEJOS);
    await activarLaParada(page);
    await quedarseFueraDeRango(page, context);

    await pedirElRescate(page);
    await esperarAvanzar(page, false, 'rescatada la parada, «avanzar» se enciende aunque el usuario siga fuera de la zona');
  });

  test('RZ-2. Control: completado sin rescate y fuera de rango, «avanzar» sigue apagado', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context, PARADA);
    await activarLaParada(page);
    // La parada completa por sus caminos: llegada (lecturas en el punto), audio saltado y reto resuelto.
    await expect.poll(async () => {
      await leerEn(page, PARADA);
      return (await fichaDe(page, PARADA.clave))?.llegada;
    }, { timeout: 15_000, intervals: [300], message: 'la llegada a la parada consta en la ficha' }).toBe(true);
    await page.evaluate(() => document.getElementById('audio-action-skip').click());
    await expect.poll(async () => (await fichaDe(page, PARADA.clave))?.audio, { timeout: 10_000, message: 'el audio saltado consta como terminado' }).toBe(true);
    await desdeHijo(page, 'hijo4', 'RETO.COMPLETADO', { retoId: PARADA.reto, correcto: true });
    await esperarAvanzar(page, false, 'completada la parada, «avanzar» está encendido');

    await quedarseFueraDeRango(page, context);
    await esperarAvanzar(page, true, 'completada sin rescate y fuera de rango con la gracia agotada, «avanzar» se apaga (regla 4)');
  });

  test('RZ-3. El rescate se cobra al concederlo, y el cobro y el registro quedan guardados', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context, LEJOS);
    await activarLaParada(page);
    await quedarseFueraDeRango(page, context);
    expect((await cobroYRegistro(page)).usadas, 'antes del rescate no hay ninguno gastado').toBe(0);

    await pedirElRescate(page);
    expect(await cobroYRegistro(page), 'al concederlo: cobrado, con su registro, y los dos guardados con el progreso').toEqual({
      usadas: 1, registro: PARADA.id, usadasGuardadas: 1, registroGuardado: PARADA.id,
    });
  });

  test('RZ-4. Tras el rescate no sale el cartel de transición', async ({ page, context }) => {
    test.setTimeout(150_000);
    await arrancar(page, context, LEJOS);
    await activarLaParada(page);
    await quedarseFueraDeRango(page, context);
    await vigilarCartelesDeTransicion(page);

    await pedirElRescate(page);
    // El cartel de transición se pide en la misma compleción que acaba de esperarse; un segundo más por si llegara tarde.
    // VENTANA-OBSERVACION: comprobar que el cartel de transición NO sale
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => globalThis.__cartelesTransicion), 'la pantalla del rescate ya lo ha contado: sin cartel de transición encima').toBe(0);
  });

  test('RZ-5. Al avanzar, el registro se gasta y el rescate no se cobra otra vez', async ({ page, context }) => {
    test.setTimeout(150_000);
    // A 30 m, dentro de la gracia: «avanzar» se enciende tras el rescate con y sin el cambio, y se puede pulsar.
    await arrancar(page, context, A_TREINTA_METROS);
    await activarLaParada(page);
    await leerEn(page, A_TREINTA_METROS);

    await pedirElRescate(page);
    await esperarAvanzar(page, false, 'rescatada la parada dentro de la gracia, «avanzar» está encendido');
    await page.evaluate(() => {
      document.getElementById('decision-rescate')?.querySelector('button[data-clave]')?.click(); // cierra la pantalla del rescate
      document.getElementById('hijo2').contentDocument.getElementById('btn-avanzar').click();
    });
    await expect.poll(() => elementoActual(page), { timeout: 15_000, message: 'la pulsación avanza al elemento siguiente' }).not.toBe(PARADA.id);
    await expect.poll(() => cobroYRegistro(page), { timeout: 10_000, message: 'tras avanzar: un solo rescate cobrado y el registro gastado, también en lo guardado' }).toEqual({
      usadas: 1, registro: null, usadasGuardadas: 1, registroGuardado: null,
    });
  });

  test('RZ-6. Tras recargar y reanudar, el punto rescatado sigue dejando seguir, cobrado una vez', async ({ page, context }) => {
    test.setTimeout(240_000);
    await arrancar(page, context, LEJOS);
    await activarLaParada(page);
    await quedarseFueraDeRango(page, context);
    await pedirElRescate(page);

    // `vv_progreso` y `vv_paradas_completadas` son los que ha escrito el padre. `vv_aventura_iniciada` lo escribe la
    // activación real al entrar en la aventura (P16), que este test no recorre: se pone aquí con esa misma forma.
    await page.evaluate(() => {
      localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'en', modo: 'aventura', dev: false, timestamp: Date.now() }));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#btn-continuar-aventura', { timeout: 60_000 });
    await page.evaluate(() => document.getElementById('btn-continuar-aventura').click());
    await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
    await expect.poll(() => elementoActual(page), { timeout: 60_000, message: 'la reanudación restaura la parada rescatada' }).toBe(PARADA.id);

    // Sigue a 330 m (el GPS emulado no se ha movido): fuera de rango otra vez, y el registro restaurado deja seguir.
    await quedarseFueraDeRango(page, context);
    await esperarAvanzar(page, false, 'tras reanudar, la parada rescatada deja seguir aunque el usuario siga fuera de la zona');
    expect((await cobroYRegistro(page)).usadas, 'el rescate sigue cobrado una sola vez tras la recarga').toBe(1);
  });
});
