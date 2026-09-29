'use strict';

/**
 * 94 — Lo que el padre se dice a sí mismo pasa por el bus
 *
 *   AE-1  No quedan atajos globales hacia los handlers del padre (`__triggerCambioParadaInterno`,
 *         `__triggerLlegadaDetectadaInterno`, `_vv_triggerCambioModo`): quien necesita que el padre
 *         haga algo se lo despacha con `despacharLocal`.
 *   AE-2  El padre no se hace `postMessage` a sí mismo en todo el arranque, hasta que avisa a los
 *         hijos de que la aplicación está lista.
 *
 * POR QUÉ EXISTE
 *
 * Un script del padre no ve las funciones de otro, y para pedirle algo a un handler de otro script
 * había tres atajos globales, cinco llamadas directas al handler con un mensaje fabricado a mano
 * —cada una con su `origen` inventado— y un `postMessage` a la propia ventana. Todos se saltaban
 * la fila por tipo del bus: un cambio de parada anidado se ejecutaba en medio del que lo había
 * provocado. `despacharLocal` entrega el mensaje por la misma fila que los que llegan de fuera, con
 * el nombre del frame.
 *
 * AE-2 mira lo que le llega al padre con él mismo como fuente: un envío suyo por el bus va a la
 * ventana de un hijo, nunca a la suya.
 *
 * ROJO ANTES QUE VERDE: con los atajos, AE-1 los encuentra; y el padre se manda a sí mismo
 * APLICACION_INICIALIZADA al quedar listos hijo2, hijo3 y hijo4.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('AE — Lo que el padre se dice a sí mismo pasa por el bus', () => {
  test('AE-1. No quedan atajos globales hacia los handlers del padre', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    const atajos = await page.evaluate(() => ['__triggerCambioParadaInterno', '__triggerLlegadaDetectadaInterno', '_vv_triggerCambioModo']
      .filter((n) => typeof globalThis[n] !== 'undefined'));
    expect(atajos, 'ninguno de los tres existe').toEqual([]);
  });

  test('AE-2. El padre no se hace postMessage a sí mismo', async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await page.addInitScript(() => {
      if (globalThis.top !== globalThis) return;
      // Se mide al recibir, no sustituyendo postMessage: los hijos llaman al postMessage de esta
      // misma ventana para escribirle, y contarían como si fueran del padre. Aquí, un mensaje
      // cuya fuente es la propia ventana solo puede habérselo mandado el padre a sí mismo.
      globalThis.__autoenvios = [];
      globalThis.addEventListener('message', (ev) => {
        if (ev.source === globalThis) globalThis.__autoenvios.push(ev.data?.tipo || '(sin tipo)');
      }, true);
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());

    // Fin del arranque = la condición real que dispara despacharLocal(APLICACION_INICIALIZADA)
    // (paso 8.5 de la lavadora: el aviso 'aplicacion_lista' que antes marcaba este instante para
    // los hijos se retiró — ningún hijo tenía handler que reaccionara a él).
    for (const id of ['hijo2', 'hijo3', 'hijo4']) {
      await expect
        .poll(() => page.evaluate((i) => globalThis.estado?.hijosInicializados?.has(i) === true, id), { timeout: 60_000 })
        .toBe(true);
    }
    expect(await page.evaluate(() => globalThis.__autoenvios), 'ningún postMessage a la propia ventana').toEqual([]);
  });
});
