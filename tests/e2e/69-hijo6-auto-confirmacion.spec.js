/**
 * 69 — El asistente de soporte sabe auto-confirmar los mensajes que se lo piden
 *
 * POR QUE EXISTE
 *
 * De los seis hijos, **hijo6 era el unico sin auto-confirmacion**. Su
 * `registrarControladorSeguro` tiene la misma forma que el adapter de los demas
 * —mismo `event.source === globalThis.parent`, mismo registro anti-duplicados— pero
 * recortada: llamaba al handler sin `await`, sin recoger el resultado y sin confirmar
 * nada.
 *
 *     handler(event.data);        // <- y ahi se acababa
 *
 * Eso lo dejaba fuera del sistema: cualquier `enviarMensajeConConfirmacion()` dirigido a
 * hijo6 **nunca recibiria su SISTEMA.CONFIRMACION**, agotaria reintentos y caeria por la
 * rama de error del emisor. Hoy no ocurre porque nadie le manda mensajes confirmados —el
 * padre le escribe con `contentWindow.postMessage` crudo— pero es una mina puesta.
 *
 * Y no es teorica: en `audio-hijo3.html` hay un comentario que documenta exactamente ese
 * fallo cuando le paso a hijo3 por otro motivo (un handler que no devolvia valor). El
 * padre daba el audio por escuchado sin que sonara un segundo, "en TODAS las paradas,
 * tambien con el fichero presente y sonando bien".
 *
 * EL CONTRATO, que es la parte que muerde: solo se confirma si el handler **devuelve un
 * valor**. Un `return` olvidado deja al emisor esperando en silencio. Por eso aqui la
 * version de hijo6 avisa por consola cuando le piden confirmacion y el handler no
 * devuelve nada — la regla de la casa es que un camino que no se toma puede existir,
 * pero no en silencio.
 *
 * ROJO ANTES QUE VERDE: AC-1 falla hoy (no llega ninguna confirmacion). AC-2 fija el
 * contrato por el otro lado, y AC-3 comprueba que el aviso existe.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Abre el asistente por el camino real —pulsando su boton— y espera a que este vivo. */
async function abrirAsistente(page) {
  await page.waitForFunction(
    () => typeof globalThis.mensajeria?.getIframesRegistrados === 'function'
      && !!document.getElementById('btn-chat-soporte'),
    null, { timeout: 25_000 },
  );
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  // Registrado en la mensajeria Y con su propio registrarControladorSeguro ya definido:
  // sin lo segundo, el test correria antes de que el iframe tuviera nada que probar.
  await page.waitForFunction(
    () => {
      const f = document.getElementById('hijo6-chat');
      return !!f?.contentWindow && typeof f.contentWindow.registrarControladorSeguro === 'function';
    },
    null, { timeout: 20_000 },
  );
}

/**
 * Registra dentro de hijo6 un controlador de prueba, le manda un mensaje pidiendo
 * confirmacion, y devuelve si llego. `devuelveValor` decide si el handler retorna algo:
 * es la unica diferencia entre AC-1 y AC-2.
 */
async function pedirConfirmacion(page, tipo, devuelveValor) {
  return page.evaluate(async ({ tipo, devuelveValor }) => {
    const iframe = document.getElementById('hijo6-chat');
    const ventana = iframe.contentWindow;
    const id = 'test-' + Date.now() + '-' + Math.random().toString(36).slice(2);

    ventana.registrarControladorSeguro(tipo, () => (devuelveValor ? { ok: true, marca: id } : undefined));

    const llegada = new Promise((resolve) => {
      const listener = (ev) => {
        if (ev.data?.tipo === 'SISTEMA.CONFIRMACION' && ev.data?.idOriginal === id) {
          globalThis.removeEventListener('message', listener);
          resolve(ev.data);
        }
      };
      globalThis.addEventListener('message', listener);
      setTimeout(() => { globalThis.removeEventListener('message', listener); resolve(null); }, 2500);
    });

    ventana.postMessage({ tipo, id, requiereConfirmacion: true, origen: 'padre', destino: 'hijo6-chat', datos: {} }, globalThis.location.origin);
    const confirmacion = await llegada;
    return { llego: !!confirmacion, datos: confirmacion?.datos ?? null, origen: confirmacion?.origen ?? null };
  }, { tipo, devuelveValor });
}

test.describe('AC — hijo6 y el sistema de confirmaciones', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('AC-1. Un handler que devuelve valor produce SISTEMA.CONFIRMACION', async ({ page }) => {
    await abrirAsistente(page);
    const r = await pedirConfirmacion(page, 'TEST.CONFIRMA_SI', true);

    expect(r.llego, 'el asistente debe confirmar como hacen los otros cinco hijos').toBe(true);
    expect(r.datos, 'y la confirmación viaja con lo que devolvió el handler').toMatchObject({ ok: true });
  });

  test('AC-2. Un handler que no devuelve nada NO confirma — es el contrato', async ({ page }) => {
    // Deliberado, no un descuido: `resultado !== undefined` es la condición que usan los
    // cinco hijos restantes. Si esto empezara a confirmar, un handler a medio escribir
    // quedaría indistinguible de uno terminado.
    await abrirAsistente(page);
    const r = await pedirConfirmacion(page, 'TEST.CONFIRMA_NO', false);

    expect(r.llego, 'sin valor devuelto no hay confirmación').toBe(false);
  });

  test('AC-3. Y cuando no confirma por eso, lo dice — nunca en silencio', async ({ page }) => {
    // El fallo que documenta audio-hijo3.html fue exactamente este, y fue invisible: el
    // emisor agotaba reintentos y caía por una rama de error sin que nada dijera por qué.
    const avisos = [];
    page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') avisos.push(m.text()); });

    await abrirAsistente(page);
    await pedirConfirmacion(page, 'TEST.CONFIRMA_MUDO', false);
    await page.waitForTimeout(300);

    expect(
      avisos.some((t) => /confirmaci[oó]n/i.test(t) && /TEST\.CONFIRMA_MUDO/.test(t)),
      `debe avisar de que no se confirmó y de qué tipo era. Avisos vistos: ${JSON.stringify(avisos.slice(-4))}`,
    ).toBe(true);
  });
});
