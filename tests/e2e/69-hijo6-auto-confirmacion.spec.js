/**
 * 69 — El asistente de soporte contesta a los mensajes que le piden acuse
 *
 * POR QUE EXISTE
 *
 * De los siete frames, hijo6 era el que tenia su propia regla de acuse: confirmaba **solo si
 * el handler devolvia un valor**, y avisaba por consola cuando no lo hacia. Los otros cinco
 * hijos usaban la misma condicion y el bus usaba otra distinta. Tres reglas para una sola
 * pregunta —"¿contesto o no?"— y la respuesta cambiaba segun por donde entrara el mensaje.
 *
 * EL CONTRATO, que es lo que este fichero fija:
 *
 *   - Si alguien PROCESO el mensaje, se contesta. Da igual lo que devuelva el handler,
 *     tambien `undefined`. Un `return` olvidado deja de cambiar el resultado.
 *   - Si NADIE lo escucha, no se contesta, y el bus lo dice en el log. El emisor agota su
 *     plazo, que es la respuesta honesta: nadie ha hecho nada con su mensaje.
 *
 * POR QUE ASI, y no al reves. La regla anterior —"sin valor devuelto no hay acuse"— convertia
 * un descuido de escritura en un fallo de comunicacion silencioso, y ademas no se sostenia:
 * 67 de los 87 handlers de los hijos no devuelven nada.
 *
 * COMO MIRA: por la puerta de delante. El arnes registra su handler de prueba con
 * `mensajeria.registrarControlador`, la API publica del bus, no con la funcion privada que
 * hijo6 publicaba en su `globalThis` — esa desaparecio con su envoltorio, y un test que
 * entra por ahi se cae cuando la aplicacion no tiene nada roto.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Abre el asistente por el camino real —pulsando su boton— y espera a que su bus este vivo. */
async function abrirAsistente(page) {
  await page.waitForFunction(
    () => typeof globalThis.mensajeria?.getIframesRegistrados === 'function'
      && !!document.getElementById('btn-chat-soporte'),
    null, { timeout: 25_000 },
  );
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  await page.waitForFunction(
    () => {
      const f = document.getElementById('hijo6-chat');
      return !!f?.contentWindow?.mensajeria?.registrarControlador;
    },
    null, { timeout: 20_000 },
  );
}

/**
 * Manda a hijo6 un mensaje con acuse y devuelve si llego la confirmacion.
 *
 * `handler` dice que se registra dentro de hijo6: 'valor' devuelve un objeto, 'nada' devuelve
 * `undefined`, y 'ninguno' no registra nada — los tres casos del contrato.
 */
async function pedirAcuse(page, tipo, handler) {
  return page.evaluate(async ({ tipo, handler }) => {
    const ventana = document.getElementById('hijo6-chat').contentWindow;
    const id = 'test-' + Date.now() + '-' + Math.random().toString(36).slice(2);

    if (handler === 'valor') ventana.mensajeria.registrarControlador(tipo, () => ({ ok: true, marca: id }));
    if (handler === 'nada') ventana.mensajeria.registrarControlador(tipo, () => undefined);

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

    ventana.postMessage(
      { tipo, id, requiereConfirmacion: true, origen: 'padre', destino: 'hijo6-chat', datos: {} },
      globalThis.location.origin,
    );
    const confirmacion = await llegada;
    return { llego: !!confirmacion, datos: confirmacion?.datos ?? null };
  }, { tipo, handler });
}

test.describe('AC — el acuse del asistente sigue la regla de la casa', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('AC-1. Un handler que devuelve valor confirma, y el valor viaja dentro', async ({ page }) => {
    await abrirAsistente(page);
    const r = await pedirAcuse(page, 'TEST.ACUSE_VALOR', 'valor');

    expect(r.llego, 'el asistente tiene que confirmar como los demás').toBe(true);
    expect(r.datos, 'la confirmación viaja con lo que devolvió el handler').toMatchObject({ ok: true });
  });

  test('AC-2. Un handler que no devuelve nada TAMBIÉN confirma', async ({ page }) => {
    // Es el cambio de regla, y es el caso que más veces ha mordido: un `return` olvidado
    // dejaba al emisor esperando sin que nada dijera por qué. Procesar es lo que cuenta.
    await abrirAsistente(page);
    const r = await pedirAcuse(page, 'TEST.ACUSE_SIN_VALOR', 'nada');

    expect(r.llego, 'procesar el mensaje basta para confirmarlo, devuelva lo que devuelva').toBe(true);
  });

  test('AC-3. Sin handler no se confirma: nadie lo ha procesado', async ({ page }) => {
    // El otro lado del contrato. Contestar aquí sería mentir: le diría al emisor que su
    // mensaje se atendió cuando no lo escuchó nadie, y se quedaría sin reintentar.
    await abrirAsistente(page);
    const r = await pedirAcuse(page, 'TEST.ACUSE_SIN_HANDLER', 'ninguno');

    expect(r.llego, 'un mensaje que nadie escucha no puede volver confirmado').toBe(false);
  });
});
