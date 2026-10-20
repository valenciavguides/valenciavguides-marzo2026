/**
 * 144-pulsar-reto-o-audio-cierra-el-cartel.spec.js
 *
 * Quien pulsa el botón de retos (el de hijo3 o el de hijo4) o el del audio ya sabe que ha llegado: el cartel que haya a la vista
 * se cierra, para que no tape la parte alta de la ventana del reto ni se quede el primer toque (estudio K-118). Los dos botones
 * llegan al padre por sitios distintos: el de retos, como `RETO.SOLICITAR_RETO` (aquí, por el bus del propio padre, la misma
 * fila que si llegara de un hijo); el del audio es `#audio-main-toggle-btn`, del padre.
 *
 *   CA-1  Con el cartel de llegada a la vista, pedir un reto lo cierra.
 *   CA-2  Con el cartel de llegada a la vista, pulsar el botón del audio lo cierra.
 *   CA-3  Control: sin pulsar nada, el cartel sigue a la vista.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior caen CA-1 y CA-2 (el cartel seguía); CA-3 pasa antes y después. El plazo
 * de CA-1 y CA-2 es de 1 s: el cartel se cierra solo a los 10 s, y con el plazo normal de Playwright pasaban sin el botón.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function arrancarConCartel(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'en';
    await globalThis.mostrarCartelLlegadaParada('Plaza A');
  });
  await expect(page.locator('#cartel-llegada-parada'), 'el cartel de llegada está a la vista').toHaveCount(1);
}

test.describe('CA — Pulsar el reto o el audio cierra el cartel', () => {
  test('CA-1. Pedir un reto cierra el cartel de llegada', async ({ page }) => {
    await arrancarConCartel(page);
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.RETO.SOLICITAR_RETO,
      datos: { contexto: 'manual' },
    }).catch(() => {}));
    // Con un plazo corto: el cartel se cierra solo a los 10 s, y una espera larga lo daría por cerrado sin el botón.
    await expect(page.locator('#cartel-llegada-parada')).toHaveCount(0, { timeout: 1000 });
  });

  test('CA-2. Pulsar el botón del audio cierra el cartel de llegada', async ({ page }) => {
    await arrancarConCartel(page);
    await page.evaluate(() => {
      const boton = document.getElementById('audio-main-toggle-btn');
      boton.disabled = false; // sin aventura en marcha está apagado; con audio en la parada, encendido
      boton.click();
    });
    // Con un plazo corto: el cartel se cierra solo a los 10 s, y una espera larga lo daría por cerrado sin el botón.
    await expect(page.locator('#cartel-llegada-parada')).toHaveCount(0, { timeout: 1000 });
  });

  test('CA-3. Control: sin pulsar nada, el cartel sigue a la vista', async ({ page }) => {
    await arrancarConCartel(page);
    // VENTANA-OBSERVACION: sin pulsar nada, el cartel no se cierra en 1 s (algo que NO debe ocurrir).
    await page.waitForTimeout(1000);
    await expect(page.locator('#cartel-llegada-parada')).toHaveCount(1);
  });
});
