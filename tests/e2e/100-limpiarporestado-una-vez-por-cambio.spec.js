/**
 * 100 — Paso 8.4 de la lavadora (un solo camino donde hoy hay dos): un CAMBIO_MODO real
 * ejecutaba `funcionesMapa.limpiarPorEstado({resetCompleto:true})` dos veces.
 *
 * POR QUE EXISTE
 *
 * `_hdl_SISTEMA_CAMBIO_MODO` (padre) llama primero a `funcionesMapa.manejarCambioModoMapa()`
 * (fija `estadoMapa.modo`, llama a `limpiarPorEstado`, resetea la vista del mapa) y justo
 * después a `manejarCambioModo()` (js/app.js), que internamente llama a
 * `limpiarRecursosPorModo()` — esta resetea `estado.paradaActual/tramoActual/elementoActual` y
 * `estado.gps.posicionUsuario` (trabajo real, no duplicado) **y además** vuelve a llamar a
 * `funcionesMapa.limpiarPorEstado({resetCompleto:true})`, el mismo vaciado de
 * marcadores/polylines/rutas que `manejarCambioModoMapa()` ya había hecho.
 *
 * Medido que NO es tan simple como quitar una de las dos llamadas: en una resincronización
 * (mismo modo) solo corre la de `manejarCambioModoMapa()`; en una reanudación
 * (`restaurado:true`) solo corre la de `limpiarRecursosPorModo()` (el handler llama a
 * `sincronizarModoMapa()`, que nunca limpia). Solo en un cambio real corren las dos.
 *
 * LU-1  Camino real: un CAMBIO_MODO real limpia el mapa una sola vez, no dos.
 * LU-2  Control: una reanudación (restaurado:true) sigue limpiando el mapa (no se pierde
 *       el único camino que la cubre).
 * LU-3  Control: una resincronización (mismo modo) no dispara NINGÚN reset completo del mapa
 *       (toma la rama resetCompleto:false de limpiarPorEstado, que no loguea "Reset completo
 *       ejecutado" — no se toca esa rama, que nunca llegaba a la llamada duplicada).
 *
 * ROJO ANTES DEL ARREGLO: LU-1 fallaba (2 limpiezas por el mismo cambio real).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

function sesion({ modo, dev, timestamp }) {
  return { aventura: 'Aventura1', idioma: 'es', modo, dev, timestamp: timestamp ?? Date.now() };
}

async function contarLimpiezas(page, accion) {
  const logs = [];
  const onConsole = (m) => {
    if (/Reset completo ejecutado/.test(m.text())) logs.push(m.text());
  };
  page.on('console', onConsole);
  await accion();
  // VENTANA-OBSERVACION: se cuentan apariciones de un log en una ventana, sin condición que pollear.
  await page.waitForTimeout(600);
  page.off('console', onConsole);
  return logs.length;
}

test.describe('LU — limpiarPorEstado una sola vez por cambio de modo real', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => typeof globalThis._activarModoRest === 'function' && !!globalThis.estado,
      null, { timeout: 15000 },
    );
    await page.evaluate(() => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      globalThis.estado.hijosInicializados = new Set();
      globalThis.enviarMensajeConConfirmacion = () => Promise.resolve({ exito: true });
    });
  });

  test('LU-1. Camino real: un CAMBIO_MODO real limpia el mapa una sola vez', async ({ page }) => {
    const veces = await contarLimpiezas(page, () => page.evaluate(() =>
      globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } })));
    expect(veces, `limpiarPorEstado debe ejecutarse una sola vez por cambio real, se vieron ${veces}`).toBe(1);
  });

  test('LU-2. Control: una reanudación sigue limpiando el mapa (no se pierde el único camino)', async ({ page }) => {
    const veces = await contarLimpiezas(page, () => page.evaluate((datos) =>
      globalThis._activarModoRest('[TEST]', datos), sesion({ modo: 'aventura', dev: false })));
    expect(veces, 'una reanudación debe seguir limpiando el mapa una vez').toBe(1);
  });

  test('LU-3. Control: una resincronización (mismo modo) no dispara ningún reset completo', async ({ page }) => {
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    await expect.poll(() => page.evaluate(() => globalThis.estado?.modo?.actual), { timeout: 5_000 }).toBe('aventura');
    const veces = await contarLimpiezas(page, () => page.evaluate(() =>
      globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } })));
    expect(veces, 'una resincronización (mismo modo) toma la rama resetCompleto:false, sin este log').toBe(0);
  });
});
