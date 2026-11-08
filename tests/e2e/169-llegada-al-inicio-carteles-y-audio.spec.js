/**
 * 169-llegada-al-inicio-carteles-y-audio.spec.js
 *
 * Lo que decide la posición del usuario al llegar al punto de inicio de la aventura: dos carteles (K-182, K-183, K-184) y
 * el botón de audio con su recordatorio (K-185).
 *
 *   LL-1  «Ha llegado» sale con la llegada confirmada (dos lecturas de las últimas cuatro a 15 m o menos), no con una sola:
 *         una lectura suelta dentro del radio, estando a 30 m, no lo saca; la segunda, sí.
 *   LL-2  Sale una sola vez por parada: ir a CASA y volver a AVENTURA (el 🛰️ del modo dev manda el mismo CAMBIO_MODO) no
 *         lo vuelve a sacar.
 *   BV-1  «Ha vuelto a su aventura» no sale la primera vez que se llega a un punto, aunque la línea verde de ubicación esté
 *         puesta: no hay a qué volver.
 *   BV-2  Control: quien ya estuvo a 50 m o menos, se alejó, pidió la línea y vuelve, sí lo ve.
 *   AU-1  Si la primera lectura en AVENTURA cae a 40 m, el audio queda apagado: en una parada la gracia de la franja «fuera»
 *         corre solo después de la llegada.
 *   AU-2  Una lectura suelta dentro de 15 m no lo enciende: volver dentro de rango pide lo mismo que la llegada (dos de
 *         cuatro). Con la llegada confirmada, sí; y alejarse a 30 m ya no lo apaga, porque ahí empieza la gracia.
 *   AU-3  Con el audio apagado no sale «Recuerde pulsar play», aunque haya pasado el tiempo y esté a 50 m o menos.
 *
 * Por el camino real: la selección hasta «empezar» (P17), como el spec 131, y cada lectura moviendo la posición emulada,
 * que entra por watchPosition (se espera a verla en `_gpsHistorial`). Los carteles se cuentan al crearse, con un
 * MutationObserver: cada uno se cierra solo a los 10 s y otro puede taparlo antes.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const INICIO = { lat: 39.478760, lng: -0.376260 };
const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const hijo2 = (page) => page.frames().find((f) => f.name() === 'hijo2');

/** Un punto a `metros` del inicio de Aventura1, hacia el sur. */
function aDistancia(metros, rumboDeg = 180) {
  const R = 6371000;
  const brng = rumboDeg * Math.PI / 180;
  const lat1 = INICIO.lat * Math.PI / 180, lng1 = INICIO.lng * Math.PI / 180;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(metros / R) + Math.cos(lat1) * Math.sin(metros / R) * Math.cos(brng));
  const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(metros / R) * Math.cos(lat1), Math.cos(metros / R) - Math.sin(lat1) * Math.sin(lat2));
  return { latitude: lat2 * 180 / Math.PI, longitude: lng2 * 180 / Math.PI };
}

/** Una lectura del GPS por watchPosition: mueve la posición emulada y espera a que el padre la apunte. */
async function lectura(page, context, metros, rumbo = 180) {
  const antes = await page.evaluate(() => (globalThis._gpsHistorial || []).at(-1)?.recibidoEn ?? 0);
  await context.setGeolocation({ ...aDistancia(metros, rumbo), accuracy: 8 });
  await page.waitForFunction((a) => ((globalThis._gpsHistorial || []).at(-1)?.recibidoEn ?? 0) > a, antes, { timeout: 5_000 });
  await page.waitForTimeout(500); // VENTANA-OBSERVACION: el padre avisa a hijo2 y hijo2 contesta (RESTRINGIDO, DENTRO_DE_RANGO…)
}

/** El botón central de audio del padre, apagado. */
const audioApagado = (page) => page.evaluate(() => document.getElementById('audio-main-toggle-btn').disabled);

/** Los carteles creados desde la última llamada, por su id. */
const carteles = (page) => page.evaluate(() => globalThis.__e2eCarteles.splice(0));

async function arrancar(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ ...aDistancia(300), accuracy: 8 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  const f = seleccion(page);
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  await f.evaluate(() => mostrar(7));  await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
  await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
  await f.evaluate(() => { if (getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none') cerrarMapaVintage(); });  await f.evaluate(() => mostrar(15));  await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 90_000 });
  await f.evaluate(() => mostrar(17));  await f.evaluate(() => document.querySelector('#pantalla17 .btn-mundo-verde').click());
  await page.waitForFunction(
    () => globalThis.estadoPadre?.modo?.actual === 'aventura' && !!globalThis.estadoPadre?.paradaActual
      && !document.body.classList.contains('loading')
      && getComputedStyle(document.getElementById('loading-overlay')).display === 'none',
    null, { timeout: 60_000 },
  );
  await page.evaluate(() => {
    globalThis.__e2eCarteles = [];
    new MutationObserver((cambios) => {
      for (const c of cambios) for (const n of c.addedNodes) if (n.id && n.id.startsWith('cartel-')) globalThis.__e2eCarteles.push(n.id);
    }).observe(document.body, { childList: true });
  });
}

async function pulsarUbicacion(page) {
  const h2 = hijo2(page);
  await expect.poll(() => h2.evaluate(() => document.getElementById('btn-ubicacion').disabled), { timeout: 5_000 }).toBe(false);
  await h2.evaluate(() => document.getElementById('btn-ubicacion').click());
  await page.waitForTimeout(1_000); // VENTANA-OBSERVACION: el padre dibuja la línea verde
}

async function cambiarModo(page, modo) {
  await page.evaluate((m) => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: m } }), modo);
  await page.waitForFunction((m) => globalThis.estadoPadre?.modo?.actual === m, modo, { timeout: 20_000 });
  await page.waitForTimeout(1_500); // VENTANA-OBSERVACION: el cambio de modo termina (CAMBIO_PARADA del elemento, hijos)
}

test.describe('LL/BV/AU — En el punto de inicio: «Ha llegado», «Ha vuelto a su aventura» y el audio', () => {
  test.beforeEach(async ({ page, context }) => { test.setTimeout(150_000); await arrancar(page, context); });

  test('LL-1. Una lectura suelta dentro del radio no saca «Ha llegado»; la llegada confirmada, sí', async ({ page, context }) => {
    await lectura(page, context, 30);
    await lectura(page, context, 9, 175);
    expect(await carteles(page), 'una sola lectura dentro de 15 m, estando a 30').not.toContain('cartel-llegada-parada');
    await lectura(page, context, 30);
    await lectura(page, context, 8);
    expect(await carteles(page), 'dos de las últimas cuatro dentro de 15 m').toContain('cartel-llegada-parada');
  });

  test('LL-2. Ir a CASA y volver a AVENTURA no saca «Ha llegado» otra vez', async ({ page, context }) => {
    await lectura(page, context, 9);
    await lectura(page, context, 8);
    expect(await carteles(page), 'la llegada confirmada').toContain('cartel-llegada-parada');
    await cambiarModo(page, 'casa');
    await cambiarModo(page, 'aventura');
    await lectura(page, context, 7);
    await lectura(page, context, 6);
    await lectura(page, context, 5);
    expect(await carteles(page), 'tras ir a CASA y volver').not.toContain('cartel-llegada-parada');
  });

  test('BV-1. La primera vez que se llega, con la línea verde puesta, no sale «Ha vuelto a su aventura»', async ({ page, context }) => {
    await lectura(page, context, 300);
    await lectura(page, context, 120);
    await pulsarUbicacion(page);
    await lectura(page, context, 60);
    await lectura(page, context, 45);
    await lectura(page, context, 40);
    expect(await carteles(page)).not.toContain('cartel-bienvenida-parada');
  });

  test('BV-2. Control: quien ya estuvo cerca, se alejó y vuelve con la línea verde, sí ve «Ha vuelto a su aventura»', async ({ page, context }) => {
    await lectura(page, context, 40);
    await lectura(page, context, 120);
    await pulsarUbicacion(page);
    await lectura(page, context, 60);
    await lectura(page, context, 45);
    expect(await carteles(page)).toContain('cartel-bienvenida-parada');
  });

  test('AU-1. Con la primera lectura en AVENTURA a 40 m, el audio queda apagado', async ({ page, context }) => {
    await lectura(page, context, 40);
    await lectura(page, context, 38);
    expect(await audioApagado(page), 'a 40 m, sin haber llegado').toBe(true);
  });

  test('AU-2. Una lectura suelta dentro de 15 m no enciende el audio; la llegada confirmada sí, y a 30 m sigue encendido', async ({ page, context }) => {
    await lectura(page, context, 30);
    await lectura(page, context, 9, 175);
    expect(await audioApagado(page), 'tras una sola lectura dentro de 15 m').toBe(true);
    await lectura(page, context, 8);
    expect(await audioApagado(page), 'con la llegada confirmada').toBe(false);
    await lectura(page, context, 30);
    expect(await audioApagado(page), 'a 30 m tras haber llegado: la gracia de la franja «fuera»').toBe(false);
  });

  test('AU-3. Con el audio apagado no sale «Recuerde pulsar play»', async ({ page, context }) => {
    await lectura(page, context, 300);
    await lectura(page, context, 25);
    expect(await audioApagado(page), 'a 25 m, sin haber llegado').toBe(true);
    await page.waitForTimeout(13_000); // VENTANA-OBSERVACION: el recordatorio pide 10 s desde la activación y mira cada 2 s
    await lectura(page, context, 24);
    expect(await carteles(page)).not.toContain('cartel-recordatorio-audio');
  });
});
