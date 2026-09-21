/**
 * 05-queues-draining.spec.js
 *
 * Valida que las colas del sistema de mensajería queden correctamente drenadas
 * (vacías) tras el arranque de FASE 1.
 *
 * Las 2 colas monitorizadas:
 *   1. __pendingDistribucion        — mensajes DISTRIBUCIÓN pendientes de despacho
 *   2. __pendingBroadcast           — mensajes BROADCAST pendientes de despacho
 *
 * Prerequisito DT-1 Opción B — escenario 1g:
 *   "El test debe afirmar que las 3 colas son undefined o [] al final del boot"
 *
 * Prerequisito — escenario 1h (race condition):
 *   "Race #4: Si __pendingBroadcast se drena antes de que algunos iframes estén
 *   listos, los mensajes se pierden. El test afirma que __pendingBroadcast no
 *   existe al arrancar (no hay aventura seleccionada, ningún broadcast pendiente)."
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('Drenaje de colas tras FASE 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // Aqui habia tres casos sobre la cola de controladores pendientes: que estuviera vacia,
  // que su funcion de drenaje existiera, y que llamarla dos veces la dejara vacia. La
  // cola la alimentaba una rama inalcanzable del registro del padre, asi que los tres
  // describian maquinaria que no podia dispararse — dos de ellos habrian pasado igual
  // con el mecanismo entero borrado. Lo que de verdad hay que garantizar es que al
  // marcarse `script2Listo` esten TODOS los controladores, y eso lo fija el spec 89.

  // ── Cola de distribución pendiente ────────────────────────────────────

  test('1h. __pendingDistribucion no existe (ningún mensaje de distribución pendiente sin aventura)', async ({ page }) => {
    const info = await page.evaluate(() => {
      const q = globalThis.__pendingDistribucion;
      return {
        type: typeof q,
        isAbsent: q == null,
        isEmpty: Array.isArray(q) && q.length === 0,
      };
    });
    // Sin aventura seleccionada no debe haber mensajes de distribución pendientes
    expect(info.isAbsent || info.isEmpty).toBe(true);
  });

  // ── Cola de broadcast pendiente ───────────────────────────────────────

  test('1h. __pendingBroadcast no existe (ningún broadcast pendiente sin aventura)', async ({ page }) => {
    const info = await page.evaluate(() => {
      const q = globalThis.__pendingBroadcast;
      return {
        type: typeof q,
        isAbsent: q == null,
        isEmpty: Array.isArray(q) && q.length === 0,
      };
    });
    // Sin aventura seleccionada no debe haber broadcasts pendientes
    expect(info.isAbsent || info.isEmpty).toBe(true);
  });

  // Aquí había un cuarto caso sobre la misma cola. Su única aserción era que un campo de
  // diagnóstico del espía fuese un número —"solo registramos el valor histórico como
  // información", decía él mismo—, así que no comprobaba ningún comportamiento: habría pasado
  // con cualquier valor y con la cola llena.

  // ── Estado del mapa de mensajería ─────────────────────────────────────

  // El papel no se declara, se deduce: un frame es hijo si tiene ventana encima, y padre de los
  // iframes que registre. Por eso aquí no se pregunta "de qué tipo eres", que era una pregunta que
  // el bus respondía con undefined y dejaba la comprobación sin poder fallar nunca.
  test('el bus del padre está inicializado, se identifica y es el frame de arriba', async ({ page }) => {
    const estado = await page.evaluate(() => ({
      inicializado: globalThis.mensajeria?.estaInicializado?.() === true,
      id: globalThis.mensajeria?.getComponenteId?.() || null,
      esRaiz: globalThis.parent === globalThis,
    }));
    expect(estado.inicializado, 'la mensajería del padre tiene que estar inicializada').toBe(true);
    expect(estado.id, 'y tiene que identificarse: el bus descarta todo mensaje sin origen').toBeTruthy();
    expect(estado.esRaiz, 'el padre es el frame de arriba: no tiene a quién mandar hacia arriba').toBe(true);
  });
});
