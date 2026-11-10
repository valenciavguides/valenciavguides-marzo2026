/**
 * 182 — El cambio de parada va a quien lo usa: hijo4 no lo recibe.
 *
 * POR QUE EXISTE
 *
 * hijo4 recibía `NAVEGACION.CAMBIO_PARADA` en cada activación de un elemento, y solo lo anotaba en el log y contestaba
 * `CAMBIO_PARADA_CONFIRMADO`, que el padre solo anota: lo único que guardaba de él, `estado.padreIdActual`, lo leía el aviso
 * de la ficha, que ya no existe (guía §10.15). El reto le llega con `RETO.MOSTRAR`, y su botón,
 * con `RETO.HABILITAR` y `RETO.ESTADO_CASA`. Decisión del usuario: «sí».
 *
 *   CP-1  Al activar un elemento por su camino real (`NAVEGACION.CAMBIO_PARADA` despachado en el padre), hijo4 no recibe
 *         `NAVEGACION.CAMBIO_PARADA`.
 *   CP-2  Control del instrumento: en esa misma activación, hijo2 e hijo3 sí lo reciben.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior cae CP-1 (hijo4 recibe el cambio); CP-2 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Apunta, dentro del frame de un hijo, el tipo de cada mensaje que le llega; devuelve con qué leerlos. */
async function escuchar(page, nombreFrame) {
  const frame = page.frames().find((f) => f.name() === nombreFrame);
  await frame.evaluate(() => {
    globalThis.__tiposRecibidos = [];
    globalThis.addEventListener('message', (e) => { if (typeof e.data?.tipo === 'string') globalThis.__tiposRecibidos.push(e.data.tipo); });
  });
  return () => frame.evaluate(() => globalThis.__tiposRecibidos);
}

const cuantos = (tipos) => tipos.filter((t) => t === 'NAVEGACION.CAMBIO_PARADA').length;

test.describe('CP — El cambio de parada va a quien lo usa: hijo4 no lo recibe', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijosDelPadre(page);
    // El padre solo le mandaba el cambio a hijo4 con hijo4 ya inicializado: sin esperarlo, CP-1 pasaría sin probar nada.
    await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 60_000 });
    await page.evaluate(() => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
    });
  });

  test('CP-1. Al activar un elemento, hijo4 no recibe NAVEGACION.CAMBIO_PARADA', async ({ page }) => {
    const leerHijo3 = await escuchar(page, 'hijo3');
    const leerHijo4 = await escuchar(page, 'hijo4');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-1' } }));
    // Los hijos lo reciben a la vez (Promise.all): con el de hijo3 llegado, el de hijo4 habría llegado también.
    await expect.poll(async () => cuantos(await leerHijo3()), { message: 'hijo3 recibe el cambio de esa activación', timeout: 10_000 }).toBe(1);
    // VENTANA-OBSERVACION: comprobar que un mensaje NO llega no admite poll.
    await page.waitForTimeout(500);
    expect(cuantos(await leerHijo4()), 'hijo4 no recibe NAVEGACION.CAMBIO_PARADA').toBe(0);
  });

  test('CP-2. Control: en la misma activación, hijo2 e hijo3 sí lo reciben', async ({ page }) => {
    const leerHijo2 = await escuchar(page, 'hijo2');
    const leerHijo3 = await escuchar(page, 'hijo3');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-2' } }));
    await expect.poll(async () => cuantos(await leerHijo2()), { message: 'hijo2 recibe el cambio', timeout: 10_000 }).toBe(1);
    await expect.poll(async () => cuantos(await leerHijo3()), { message: 'hijo3 recibe el cambio', timeout: 10_000 }).toBe(1);
  });
});
