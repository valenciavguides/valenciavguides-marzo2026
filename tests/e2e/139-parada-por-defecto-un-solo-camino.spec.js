/**
 * 139-parada-por-defecto-un-solo-camino.spec.js
 *
 * La parada por defecto al entrar en AVENTURA la elige un solo sitio, `ensureDefaultParada()` del padre, que no hace nada si ya
 * hay un elemento en curso. Volver a AVENTURA desde CASA no activa la parada por defecto por otro camino: la única activación de
 * esa vuelta es la del elemento en el que se estaba (estudio K-61).
 *
 *   PD-1  Control: la primera entrada en AVENTURA activa la parada por defecto (la de inicio de la aventura).
 *   PD-2  AVENTURA → CASA → AVENTURA, con otro elemento en curso: cada CAMBIO_PARADA de la vuelta es de ese elemento, y hay
 *         al menos uno (el espía ve los despachos).
 *
 * ROJO ANTES QUE VERDE: con `js/app.js` anterior cae PD-2 (la vuelta despachaba antes la parada por defecto, con
 * `contexto: 'arranque_aventura'`, y después la del elemento en curso). PD-1 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const EN_CURSO = 'Av1-P-1';

/** Apunta cada CAMBIO_PARADA que el padre se despacha a sí mismo, con su elemento y su contexto. */
const espiar = (page) => page.evaluate(() => {
  const bus = globalThis.mensajeria;
  const original = bus.despacharLocal.bind(bus);
  globalThis.__cambios = [];
  bus.despacharLocal = (m) => {
    if (m?.tipo === 'NAVEGACION.CAMBIO_PARADA') globalThis.__cambios.push({ id: m.datos?.paradaId ?? null, contexto: m.datos?.contexto ?? null });
    return original(m);
  };
});
const cambios = (page) => page.evaluate(() => globalThis.__cambios.slice());
const vaciar = (page) => page.evaluate(() => { globalThis.__cambios.length = 0; });
const modo = (page, m) => page.evaluate((x) => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: x } }), m);
const enModo = (page, m) => expect.poll(() => page.evaluate(() => globalThis.estado?.modo?.actual ?? null), { timeout: 30_000 }).toBe(m);

async function prepararPadre(page) {
  // Antes del goto: el cambio de modo real a AVENTURA arranca el seguimiento GPS, y sin el permiso concedido Firefox no
  // contesta nunca a watchPosition (ni éxito ni error) y el cambio de modo no termina. La posición es la de la suite.
  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
  });
  await cargarHijosDelPadre(page);
  await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
  await espiar(page);
}

test.describe('PD — La parada por defecto, por un solo camino', () => {
  test('PD-1. Control: la primera entrada en AVENTURA activa la parada por defecto', async ({ page }) => {
    await prepararPadre(page);
    await modo(page, 'aventura');
    await enModo(page, 'aventura');
    await expect.poll(() => page.evaluate(() => globalThis.estado?.paradaActual ?? null), { timeout: 30_000 }).toBe('Av1-P-0');
    expect((await cambios(page)).some((c) => c.id === 'Av1-P-0'), 'el espía ve la activación').toBe(true);
  });

  test('PD-2. Volver a AVENTURA desde CASA solo activa el elemento en curso', async ({ page }) => {
    await prepararPadre(page);
    await modo(page, 'aventura');
    await enModo(page, 'aventura');
    await expect.poll(() => page.evaluate(() => globalThis.estado?.paradaActual ?? null), { timeout: 30_000 }).toBe('Av1-P-0');
    const r = await page.evaluate((id) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: id } }), EN_CURSO);
    expect(r?.exito, `${EN_CURSO} tiene que activarse: ${JSON.stringify(r)}`).toBe(true);
    await modo(page, 'casa');
    await enModo(page, 'casa');
    await vaciar(page);
    await modo(page, 'aventura');
    await enModo(page, 'aventura');
    // La vuelta a AVENTURA espera a los hijos y restaura el elemento en curso después del cambio de modo.
    await expect.poll(() => cambios(page), { timeout: 30_000 }).not.toEqual([]);
    // VENTANA-OBSERVACION: en 3 s no se activa ningún elemento distinto del que estaba en curso (algo que NO debe ocurrir).
    await page.waitForTimeout(3_000);
    const vistos = await cambios(page);
    expect(vistos.filter((c) => c.id !== EN_CURSO), `activaciones de la vuelta: ${JSON.stringify(vistos)}`).toEqual([]);
  });
});
