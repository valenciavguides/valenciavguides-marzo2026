/**
 * 70 — La petición de rescate llega al padre y su respuesta vuelve
 *
 * POR QUE EXISTE
 *
 * Primera pieza del rescate a petición (`docs/rescate-a-peticion.md`): el viaje de ida y
 * vuelta, sin gastar nada y sin enseñar nada todavía. El usuario pulsa el botón del
 * asistente, el padre contesta si puede concederse, y esa respuesta **vuelve**.
 *
 * Se hace antes que los carteles a propósito. La comunicación falla por mensajes perdidos,
 * contratos rotos y plazos agotados; los carteles fallan por z-index, solapes y autocierres.
 * Mezclarlos significa no saber de qué mitad viene un fallo.
 *
 * Y el contrato importa: hijo6 pide **con acuse**, así que el handler del padre tiene que
 * DEVOLVER un valor. Sin él, hijo6 espera hasta agotar su plazo. Ese fallo exacto —un
 * `return` que faltaba— hizo que el padre diera por escuchados TODOS los audios sin que
 * sonara ninguno (ver el comentario en `audio-hijo3.html`), así que aquí se fija por test.
 *
 * ROJO ANTES QUE VERDE: todo esto falla sin el handler, sin el tipo de mensaje o sin el
 * envoltorio con confirmación de hijo6 — las tres piezas de esta entrega.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Deja el padre en AVENTURA con un TRAMO activo y sin rescates gastados. */
async function prepararAventura(page) {
  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    const elementos = globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre;
    const tramo = elementos?.find((e) => e.tipo === 'tramo');
    const inicio = elementos?.find((e) => e.tipo === 'inicio');
    if (!tramo || !inicio) return { listo: false };

    if (!globalThis.estado.modo) globalThis.estado.modo = {};
    globalThis.estado.modo.actual = 'aventura';
    globalThis.estado.elementoActual = tramo;
    globalThis.estado.pendingCompleciones = {};
    globalThis.estado.tramoSkipsUsados = 0;
    return { listo: true, tramo: tramo.nombre, claveTramo: tramo.padreid };
  });
}

const consultar = (page) => page.evaluate(() => globalThis._estadoRescate?.());

test.describe('RP — Petición de rescate: ida y vuelta', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis._estadoRescate === 'function', null, { timeout: 15_000 });
  });

  test('RP-1. En un tramo, con rescates libres, la respuesta es que sí y trae la cuenta', async ({ page }) => {
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const r = await consultar(page);
    expect(r, 'la consulta debe devolver SIEMPRE un objeto, nunca undefined').toBeTruthy();
    expect(r.puede, 'en un tramo y con rescates libres, se puede').toBe(true);
    expect(r.motivo, 'y no hay motivo de negativa').toBeNull();
    expect(r, 'la cuenta viaja siempre').toMatchObject({ usadas: 0, total: 12, restantes: 12 });
    expect(r.nombre, 'y dice de qué elemento habla').toBe(prep.tramo);
  });

  test('RP-2. Fuera de AVENTURA no se puede, y lo dice con un motivo', async ({ page }) => {
    await prepararAventura(page);
    await page.evaluate(() => { globalThis.estado.modo.actual = 'casa'; });

    const r = await consultar(page);
    expect(r.puede, 'en CASA no hay rescate que valga').toBe(false);
    expect(r.motivo, 'con su motivo, para poder explicárselo al usuario').toBe('no-aventura');
    expect(r.total, 'y aun negando, la cuenta va dentro').toBe(12);
  });

  test('RP-3. El punto de inicio queda fuera: llegar hasta él ES empezar la aventura', async ({ page }) => {
    // Sin esta exclusión el usuario podría saltarse el punto de partida sin salir de casa.
    await prepararAventura(page);
    await page.evaluate(() => {
      const els = globalThis.DATOS_PADRE.Aventura1.es.elementosIDpadre;
      globalThis.estado.elementoActual = els.find((e) => e.tipo === 'inicio');
    });

    const r = await consultar(page);
    expect(r.puede, 'el inicio no se rescata').toBe(false);
    expect(r.motivo).toBe('es-inicio');
  });

  test('RP-4. Con los rescates agotados dice que no, y por qué', async ({ page }) => {
    await prepararAventura(page);
    await page.evaluate(() => { globalThis.estado.tramoSkipsUsados = 12; });

    const r = await consultar(page);
    expect(r.puede).toBe(false);
    expect(r.motivo, 'el usuario tiene que poder saber que se le acabaron').toBe('agotados');
    expect(r.restantes, 'y que no queda ninguno').toBe(0);
  });

  test('RP-5. Si el elemento ya tiene la llegada confirmada, no hay nada que rescatar', async ({ page }) => {
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await page.evaluate((clave) => {
      globalThis.estado.pendingCompleciones[clave] = { tipo: 'tramo', llegada: true, audio: false };
    }, prep.claveTramo);

    const r = await consultar(page);
    expect(r.puede, 'cobrarle un rescate por algo que ya tiene sería robarle').toBe(false);
    expect(r.motivo).toBe('ya-llegado');
  });

  test('RP-6. Camino real: el usuario pulsa el botón del asistente y la respuesta vuelve', async ({ page }) => {
    // Lo que de verdad prueba esta entrega. Se ejercita pulsando el botón —no llamando a
    // la función— porque lo que puede romperse está en medio: el tipo de mensaje, el
    // enrutado del padre, el valor de retorno del handler y el acuse de vuelta.
    const respuestas = [];
    page.on('console', (m) => { if (/petición de rescate|peticion de rescate/i.test(m.text())) respuestas.push(m.text()); });

    await prepararAventura(page);
    await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
    await page.waitForFunction(
      () => [...(globalThis.mensajeria?.getIframesRegistrados?.() || new Map()).keys()].includes('hijo6-chat'),
      null, { timeout: 20_000 },
    );

    // Abrir la pregunta que lleva el botón y pulsarlo, dentro del iframe.
    // El FAQ se construye cuando llega el idioma del padre, asi que primero hay que
    // esperar a que exista. Y se abre comprobando `aria-expanded`, NUNCA pulsando a
    // ciegas: los botones son interruptores, asi que pulsarlos en bucle los abre y los
    // cierra alternativamente. Una primera version hacia eso y pasaba en Chromium por
    // suerte —caia en una vuelta "abierto"— y fallaba en Firefox y WebKit. Un test que
    // pasa por azar es peor que uno que falla.
    await page.waitForFunction(
      () => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.tema-btn'),
      null, { timeout: 20_000 },
    );

    const pulsado = await page.evaluate(async () => {
      const doc = document.getElementById('hijo6-chat').contentDocument;
      const abrirSiCerrado = (sel) => {
        for (const b of doc.querySelectorAll(sel)) {
          if (b.getAttribute('aria-expanded') !== 'true') b.click();
        }
      };
      abrirSiCerrado('.tema-btn');
      await new Promise((r) => setTimeout(r, 150));
      abrirSiCerrado('.pregunta-btn');
      await new Promise((r) => setTimeout(r, 150));

      const btn = doc.querySelector('.boton-rescate');
      if (!btn) {
        return {
          ok: false,
          razon: `no aparece el boton (temas: ${doc.querySelectorAll('.tema-btn').length}, preguntas: ${doc.querySelectorAll('.pregunta-btn').length})`,
        };
      }
      btn.click();
      return { ok: true, rotulo: btn.textContent };
    });

    expect(pulsado.ok, `debe existir el botón en la pregunta de atasco: ${pulsado.razon || ''}`).toBe(true);
    expect(pulsado.rotulo, 'con su texto traducido, no un placeholder').toBeTruthy();

    await page.waitForTimeout(1500);
    expect(
      respuestas.some((t) => /Respuesta del padre/i.test(t)),
      `la respuesta del padre debe volver al asistente. Visto: ${JSON.stringify(respuestas.slice(-3))}`,
    ).toBe(true);
    expect(
      respuestas.some((t) => /no obtuvo respuesta/i.test(t)),
      'y no debe agotarse el plazo esperándola',
    ).toBe(false);
  });
});
