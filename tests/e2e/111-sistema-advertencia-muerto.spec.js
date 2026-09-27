'use strict';

/**
 * 111 — Paso 10 de la lavadora ("estudio completo desde el inicio, para lo que se haya escapado"):
 * `SISTEMA.ADVERTENCIA` no lo emite nadie
 *
 * POR QUE EXISTE
 *
 * Barrido de los 95 tipos de `TIPOS_MENSAJE` cruzando emisores contra receptores en todo el
 * proyecto (padre, los 6 hijos, los 3 nietos y `js/`). `SISTEMA.ADVERTENCIA` tenía handler
 * (`_hdl_SISTEMA_ADVERTENCIA` en codigo-padre.html, solo hace `logger.warn(...)`) y registro
 * permanente, pero CERO emisores: ningún hijo, nieto ni módulo de `js/` lo manda nunca — grep
 * exhaustivo de "ADVERTENCIA" en todo el repo solo encuentra la propia definición, el handler,
 * el registro, y comentarios sin relación (la palabra española "advertencia" en avisos de
 * `js/app.js`/`js/server.js`, nada que ver con este tipo de mensaje). Parece haber sido pensado
 * como el hermano "no fatal" de `SISTEMA.ERROR` (que sí usan los 6 hijos), pero ningún hijo llegó
 * a adoptarlo — a diferencia de `NAVEGACION.GPS.DESACTIVAR` (paso 9), no hay ningún comentario que
 * documente una intención de futuro para conservarlo, así que se retira entero: handler, registro
 * y constante.
 *
 * De paso, GUIA-COMPLETA.md §37.3 (tabla generada por `tools/verificar-mensajeria.js --todos`)
 * tenía esta fila con un emisor fabricado (`js/funciones-mapa.js`, 0 coincidencias reales en ese
 * fichero) y estaba desactualizada en general (100 tipos declarados cuando hoy son 95, tras los
 * retiros de los pasos 8 y 9).
 *
 * SA-1  `globalThis.TIPOS_MENSAJE.SISTEMA.ADVERTENCIA` ya no existe.
 *
 * No hay ROJO/VERDE de comportamiento: nada lo emitía, así que no hay un camino real que
 * verificar antes/después — solo confirma que la limpieza no dejó rastro.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test('SA-1. SISTEMA.ADVERTENCIA ya no existe en TIPOS_MENSAJE (sin emisor real, retirado)', async ({ page }) => {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);

  const valor = await page.evaluate(() => globalThis.TIPOS_MENSAJE?.SISTEMA?.ADVERTENCIA);
  expect(valor).toBeUndefined();
});
