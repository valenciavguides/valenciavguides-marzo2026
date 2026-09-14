/**
 * 68 — Un fin de audio tardio no resucita la ficha de un elemento ya dejado atras
 *
 * POR QUE EXISTE
 *
 * `_hdl_AUDIO_FIN_REPRODUCCION` mapea el `audioId` que llega a su elemento y llama a
 * `ensurePending()` **sin comprobar que ese elemento siga siendo el actual**:
 *
 *     const elementoAudio = findElementoPorAudio(audioId);
 *     if (elementoAudio) {
 *         const pendingAudio = ensurePending(clave, ...);   // <-- sin guard
 *         pendingAudio.audio = true;
 *         pendingAudio.timestamp = Date.now();
 *
 * Su funcion hermana `_saltarAudioPulsado()` si lo comprueba
 * (`estado.elementoActual.audio_id !== audioId` -> return), asi que la asimetria no es
 * una decision: es un olvido.
 *
 * QUE PROVOCA
 *
 * La ficha del elemento viejo **renace, con el reloj a cero**. Y como el barrido de TTL
 * recorre TODAS las fichas —no solo la del elemento actual— esa ficha resucitada acaba
 * disparando avisos para un punto por el que el usuario ya paso.
 *
 * ES ALCANZABLE HOY, aunque cueste verlo. En AVENTURA no, porque para avanzar hay que
 * completar y para completar el audio tiene que haber terminado: el fin siempre llega
 * mientras el elemento sigue activo. Pero en **modo CASA** hijo5 manda `CAMBIO_PARADA`
 * directo, sin completar nada — se salta de parada con el audio sonando y su fin llega
 * tarde, con otro elemento ya activo. Y las fichas **no se borran al cambiar de modo**,
 * asi que la rancia sobrevive al paso a AVENTURA.
 *
 * ROJO ANTES QUE VERDE: FA-1 falla hoy (la ficha se crea) y pasa con el guard. FA-2 es el
 * control que impide que el guard se pase de celoso y rompa el camino normal.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Deja Aventura1 cargada, en AVENTURA, con `actual` como elemento activo. */
async function prepararConElementoActual(page) {
  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    const elementos = globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre;
    if (!elementos) return { listo: false };

    // Dos elementos REALES y distintos, cada uno con su audio: el activo y otro que el
    // usuario ya dejo atras. Se cogen de los datos, no inventados, para que
    // findElementoPorAudio() los encuentre de verdad.
    const conAudio = elementos.filter(e => e.audio_id && !String(e.tipo).includes('intro'));
    const actual = conAudio[6];
    const viejo = conAudio[3];
    if (!actual || !viejo || actual.audio_id === viejo.audio_id) return { listo: false };

    if (!globalThis.estado.modo) globalThis.estado.modo = {};
    globalThis.estado.modo.actual = 'aventura';
    globalThis.estado.elementoActual = actual;
    globalThis.estado.indiceProgreso = elementos.indexOf(actual);
    globalThis.estado.pendingCompleciones = {};
    globalThis.estado.paradasCompletadas = new Map();
    globalThis.estado.audioActual = { id: actual.audio_id, estado: 'reproduciendo' };

    return {
      listo: true,
      claveActual: actual.padreid,
      audioActual: actual.audio_id,
      claveVieja: viejo.padreid,
      audioViejo: viejo.audio_id,
    };
  });
}

async function enviarFinDeAudio(page, audioId) {
  await page.evaluate((id) => {
    globalThis.postMessage(
      { tipo: 'AUDIO.FIN_REPRODUCCION', origen: 'hijo3', destino: 'padre', datos: { audioId: id, duracion: 1, timestamp: Date.now() } },
      globalThis.location.origin,
    );
  }, audioId);
  // El handler es async y pasa por la mensajeria: un tick de reloj real basta y sobra.
  await page.waitForTimeout(300);
}

const fichas = (page) => page.evaluate(() => Object.keys(globalThis.estado?.pendingCompleciones || {}));

test.describe('FA — El fin de audio solo toca la ficha de su propio elemento activo', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('FA-1. El fin del audio de un elemento que ya no es el actual NO crea su ficha', async ({ page }) => {
    const prep = await prepararConElementoActual(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    expect(await fichas(page), 'se arranca sin ninguna ficha').toEqual([]);

    // Llega el fin del audio del elemento VIEJO — el que el usuario dejo atras mientras
    // sonaba. El elemento activo es otro.
    await enviarFinDeAudio(page, prep.audioViejo);

    const tras = await fichas(page);
    expect(tras, `no debe nacer ninguna ficha para ${prep.claveVieja}`).not.toContain(prep.claveVieja);
    // Y no debe nacer ninguna en absoluto: el mensaje era de un elemento que ya no toca.
    expect(tras, 'un fin de audio ajeno no crea fichas').toEqual([]);
  });

  test('FA-2. Control: el fin del audio del elemento ACTUAL sí marca su ficha', async ({ page }) => {
    // Sin este control, un guard demasiado estricto —o un `return` de mas— romperia el
    // camino normal de todas las paradas y tramos sin que nada lo delatara.
    const prep = await prepararConElementoActual(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await enviarFinDeAudio(page, prep.audioActual);

    const marcado = await page.evaluate((clave) => {
      const p = globalThis.estado?.pendingCompleciones?.[clave];
      return { existe: !!p, audio: p?.audio === true };
    }, prep.claveActual);

    expect(marcado.existe, 'la ficha del elemento activo debe existir').toBe(true);
    expect(marcado.audio, 'y su audio debe quedar marcado como terminado').toBe(true);
  });
});
