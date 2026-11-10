/**
 * 101 — Los hijos no reciben avisos de la ficha del padre: ningún camino real les manda `SISTEMA.NOTIFICACION`.
 *
 * POR QUÉ EXISTE
 *
 * La ficha de cada elemento (`ensurePending`, la llegada, el audio y el reto) es del padre. Se les anunciaba a hijo2 e hijo4
 * con `SISTEMA.NOTIFICACION { evento: 'PENDING_INICIADO' }`, y no tenía efecto en ninguno: hijo2 lo comparaba con otro
 * identificador y no casó en ninguno de los 110 del recorrido medido, e hijo4 solo lo apuntaba (guía §10.15).
 * Antes, el paso 8.5 de la lavadora había quitado los otros dos usos de ese tipo (al terminar el arranque y a hijo3).
 * Con el aviso fuera, el tipo no lo manda nadie ni lo escucha nadie, y salió de `TIPOS_MENSAJE`.
 *
 *   NO-1  Al terminar el arranque, ningún hijo recibe `SISTEMA.NOTIFICACION`.
 *   NO-2  Al activar un elemento por su camino real (`NAVEGACION.CAMBIO_PARADA`, que le crea la ficha), ningún hijo recibe
 *         `SISTEMA.NOTIFICACION`.
 *   NO-3  Control del instrumento: el mismo escuchador de hijo2 sí ve el `NAVEGACION.CAMBIO_PARADA` de esa activación.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior cae NO-2 (hijo2 e hijo4 reciben `PENDING_INICIADO`); NO-1 y NO-3 pasan antes y
 * después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const HIJOS = ['hijo2', 'hijo3', 'hijo4'];

/** Apunta, dentro del frame de un hijo, el tipo de cada mensaje que le llega; devuelve con qué leerlos. */
async function escuchar(page, nombreFrame) {
  const frame = page.frames().find((f) => f.name() === nombreFrame);
  await frame.evaluate(() => {
    globalThis.__tiposRecibidos = [];
    globalThis.addEventListener('message', (e) => { if (typeof e.data?.tipo === 'string') globalThis.__tiposRecibidos.push(e.data.tipo); });
  });
  return () => frame.evaluate(() => globalThis.__tiposRecibidos);
}

test.describe('NO — Los hijos no reciben avisos de la ficha del padre', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijosDelPadre(page);
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo3'), null, { timeout: 60_000 });
    await page.evaluate(() => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
    });
  });

  test('NO-1. Al terminar el arranque, ningún hijo recibe SISTEMA.NOTIFICACION', async ({ page }) => {
    const lectores = await Promise.all(HIJOS.map((h) => escuchar(page, h)));
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: 'SISTEMA.APLICACION_INICIALIZADA',
      datos: { totalComponentes: 3, tiempoInicializacion: 10, version: '1.0.0' },
    }));
    // VENTANA-OBSERVACION: comprobar que un aviso NO llega no admite poll.
    await page.waitForTimeout(500);
    const recibidos = (await Promise.all(lectores.map((leer) => leer()))).flat();
    expect(recibidos.filter((t) => t === 'SISTEMA.NOTIFICACION'), 'ningún hijo recibe SISTEMA.NOTIFICACION').toEqual([]);
  });

  test('NO-2. Al activar un elemento, ningún hijo recibe SISTEMA.NOTIFICACION', async ({ page }) => {
    const lectores = await Promise.all(HIJOS.map((h) => escuchar(page, h)));
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-1' } }));
    // VENTANA-OBSERVACION: igual que NO-1, comprobar una ausencia no admite poll.
    await page.waitForTimeout(500);
    const porHijo = await Promise.all(lectores.map((leer) => leer()));
    HIJOS.forEach((h, i) => {
      expect(porHijo[i].filter((t) => t === 'SISTEMA.NOTIFICACION'), `${h} no recibe SISTEMA.NOTIFICACION`).toEqual([]);
    });
  });

  test('NO-3. Control: el escuchador de hijo2 ve el CAMBIO_PARADA de esa activación', async ({ page }) => {
    const leerHijo2 = await escuchar(page, 'hijo2');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-2' } }));
    await expect.poll(() => leerHijo2().then((r) => r.includes('NAVEGACION.CAMBIO_PARADA')), {
      message: 'el instrumento ve los mensajes que llegan a hijo2', timeout: 10_000,
    }).toBe(true);
  });
});
