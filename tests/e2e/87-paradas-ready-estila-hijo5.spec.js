'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const ID = 'hijo5';
const ESTILO = 'vv-hijo5-paradas-fix-style';

/**
 * PR — el aviso de hijo5 "ya tengo mis botones" llega al padre y este le estila la ventana.
 *
 *   PR-1  la cadena entera: paradas -> botones -> aviso -> estilo dentro de hijo5
 *   PR-2  el estilo es el que dice ser, no un <style> cualquiera
 *
 * QUE RECORRE, Y POR QUE ASI
 *
 * No se simula ningun tramo. El test empuja por la unica puerta real —un mensaje— y deja
 * que la aplicacion haga el resto:
 *
 *   el padre manda NAVEGACION.RESPUESTA_DATOS_PARADAS a hijo5
 *     -> hijo5 valida y guarda las paradas (~L1074)
 *     -> al no estar en modo aventura llama a activarModoInicial('casa') (~L1081)
 *     -> que en modo casa llama a generarBotonesParadas() (~L480)
 *     -> que al terminar avisa al padre con PARADAS.READY (~L645)
 *     -> el padre inyecta <style id="vv-hijo5-paradas-fix-style"> DENTRO del documento
 *        de hijo5 (fondo transparente de #paradas-window)
 *
 * Lo que se comprueba es el ultimo eslabon, y se comprueba donde ocurre: dentro del
 * contentDocument del iframe. Si cualquier paso intermedio se rompe, el estilo no aparece.
 *
 * ESTE TEST ES UNA RED PARA UNA REFACTORIZACION, no la prueba de un bug: tiene que pasar
 * IGUAL antes y despues de que ese aviso deje de ser un `parent.postMessage` crudo con su
 * escucha suelta en el padre y pase por el bus. Por eso empuja con un mensaje y mira el
 * efecto, sin nombrar en ningun sitio como viaja.
 *
 * Y para que no sea decorativo, se ha medido que se pone ROJO al vaciar la inyeccion de
 * estilo. Un test de refactorizacion que pasa con el motor quitado no protege nada.
 *
 * OJO al orden: hijo5 ignora unas paradas si ya recibio otras (`estado.datosRecibidos`,
 * ~L1060). Por eso PR-1 comprueba antes que todavia no las tiene; si la aplicacion se las
 * hubiera dado por su cuenta, el mensaje del test no haria nada y el verde seria falso.
 */

async function arrancarConHijo5(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);

  // hijo5 no entra por el cargador de P14: tiene el suyo propio.
  await page.evaluate(() => globalThis.cargarHijoCasa?.());
  await page.waitForFunction(
    (id) => !!document.getElementById(id)?.contentWindow?.logger,
    ID,
    { timeout: 60_000 },
  );
}

/** Le da a hijo5 un juego de paradas minimo pero valido (id + nombre + ubicacion). */
async function mandarParadas(page) {
  return page.evaluate(async (id) => {
    const paradas = [1, 2, 3].map((n) => ({
      id: `P-${n}`,
      parada_id: `P-${n}`,
      nombre: `Parada de prueba ${n}`,
      tipo: 'parada',
      parada: n,
      ubicacion: { lat: 39.4753 + n / 1000, lng: -0.3763 },
    }));
    await globalThis.mensajeria.enviarMensaje({
      destino: id,
      origen: 'padre',
      tipo: 'NAVEGACION.RESPUESTA_DATOS_PARADAS',
      datos: { paradas, estadisticas: { paradas: paradas.length, tramos: 0 } },
    });
  }, ID);
}

/** Mira DENTRO del documento de hijo5, que es donde el efecto ocurre. */
function estiloEnHijo5(page) {
  return page.evaluate(({ id, estilo }) => {
    const doc = document.getElementById(id)?.contentDocument;
    if (!doc) return { alcanzable: false };
    const el = doc.getElementById(estilo);
    return {
      alcanzable: true,
      existe: !!el,
      etiqueta: el ? el.tagName : null,
      contenido: el ? el.textContent : null,
      botones: doc.querySelectorAll('#lista-paradas [data-punto-index]').length,
    };
  }, { id: ID, estilo: ESTILO });
}

test.describe('PR — PARADAS.READY estila la ventana de hijo5', () => {
  test.beforeEach(async ({ page, context }) => { await arrancarConHijo5(page, context); });

  test('PR-1. Darle paradas a hijo5 acaba con el padre inyectando su estilo dentro del iframe', async ({ page }) => {
    const antes = await estiloEnHijo5(page);
    expect(antes.alcanzable, 'el documento de hijo5 tiene que ser alcanzable desde el padre').toBe(true);
    expect(antes.existe, 'el estilo NO puede estar ya puesto: si lo esta, este test no demuestra nada').toBe(false);

    await mandarParadas(page);

    await expect
      .poll(() => estiloEnHijo5(page).then((r) => r.existe), { timeout: 15_000 })
      .toBe(true);

    const despues = await estiloEnHijo5(page);
    expect(despues.botones, 'hijo5 tiene que haber generado sus botones por el camino').toBeGreaterThan(0);
  });

  test('PR-2. El estilo inyectado es el que dice ser', async ({ page }) => {
    await mandarParadas(page);
    await expect
      .poll(() => estiloEnHijo5(page).then((r) => r.existe), { timeout: 15_000 })
      .toBe(true);

    const r = await estiloEnHijo5(page);
    expect(r.etiqueta).toBe('STYLE');
    expect(r.contenido, 'el estilo pone transparente el fondo de la ventana de paradas').toContain('#paradas-window');
  });
});
