/**
 * 168-circulo-y-lineas-con-maplibre-real.spec.js
 *
 * El círculo naranja de la llegada y las líneas del mapa existen aunque se pidan con teselas bajando (K-181).
 *
 * Es el único spec que arranca el padre con el MapLibre DE VERDAD (`js/vendor/maplibre-gl-csp.js`): todos los demás cargan
 * `helpers/maplibre-stub.js`, cuyo `isStyleLoaded()` dice siempre que sí, y con él no se ve lo que aquí se mide. En el de
 * verdad, `isStyleLoaded()` dice que no mientras a cualquier fuente le queda una tesela por llegar —el mapa casi siempre se
 * está moviendo en AVENTURA: el vuelo a cada parada, la cámara que sigue al usuario—, y el evento `load` sale una sola vez
 * en la vida del mapa. Las teselas no salen de internet: las sirve `context.route`, con el retraso que pide cada caso.
 *
 *   CR-1  Con teselas bajando, actualizarMarcadorUsuario() en AVENTURA deja el círculo en el mapa.
 *   CR-2  Con teselas bajando, dibujarPolylineNavegacion() deja la línea en el mapa.
 *   CR-3  El camino real: paso a AVENTURA por su handler y primera lectura del GPS; con el mapa ya quieto, el círculo está.
 *
 * El mapa se lee en el prototipo de MapLibre (diagnosticarMapa() llama a getCenter()), sin publicar nada en la app.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { injectInitSpy, gotoAndWaitForFase1 } = require('./helpers/boot');

const INICIO = { lat: 39.478760, lng: -0.376260 };
const PNG_1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

test.use({ serviceWorkers: 'block' });

/** Las teselas de los tres modos del mapa, servidas aquí con el retraso que diga `ctl.retrasoMs`. */
async function teselasControladas(context) {
  const ctl = { retrasoMs: 0 };
  const esperar = () => new Promise((r) => setTimeout(r, ctl.retrasoMs));
  const imagen = async (route) => { await esperar(); await route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1x1 }).catch(() => {}); };
  await context.route('https://server.arcgisonline.com/**', imagen);
  await context.route(/^https:\/\/[abc]\.tile\.openstreetmap\.org\//, imagen);
  await context.route('https://tiles.openfreemap.org/**', async (route) => {
    if (/\/planet$/.test(route.request().url())) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ tilejson: '3.0.0', tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'], minzoom: 0, maxzoom: 14 }) }).catch(() => {});
    }
    await esperar();
    return route.fulfill({ status: 404, body: '' }).catch(() => {});
  });
  return ctl;
}

/** Arranca el padre con el MapLibre de verdad y espera a tener el mapa quieto y localizado. */
async function arrancar(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: INICIO.lat, longitude: INICIO.lng, accuracy: 8 });
  const teselas = await teselasControladas(context);
  for (const patron of ['**/unpkg.com/**', '**/cdnjs.cloudflare.com/**']) {
    await page.route(patron, (r) => r.fulfill({ contentType: /\.css(\?|$)/.test(r.request().url()) ? 'text/css' : 'text/javascript', body: '/* stub */' }));
  }
  await injectInitSpy(page);
  await gotoAndWaitForFase1(page);
  expect(await page.evaluate(() => typeof globalThis.maplibregl?.Map?.prototype?.isStyleLoaded), 'el MapLibre de verdad').toBe('function');
  await page.evaluate(() => {
    const p = globalThis.maplibregl.Map.prototype;
    const getCenter = p.getCenter;
    p.getCenter = function () { globalThis.__e2eMapa = this; return getCenter.call(this); };
  });
  await page.evaluate(() => globalThis.funcionesMapa.diagnosticarMapa());
  await expect.poll(() => page.evaluate(() => globalThis.__e2eMapa?.loaded?.() === true), { timeout: 30_000 }).toBe(true);
  return teselas;
}

/** Mueve el mapa a una zona sin teselas todavía, con las nuevas tardando `ms`: queda con teselas pendientes. */
async function moverConTeselasBajando(page, teselas, ms) {
  teselas.retrasoMs = ms;
  await page.evaluate((c) => globalThis.__e2eMapa.jumpTo({ center: [c.lng + 0.004, c.lat], zoom: 17 }), INICIO);
  await expect.poll(() => page.evaluate(() => globalThis.__e2eMapa.isStyleLoaded()), { timeout: 2_000 }).toBe(false);
}

const capas = (page, prefijo) => page.evaluate((p) => globalThis.__e2eMapa.getStyle().layers.map((l) => l.id).filter((id) => id.startsWith(p)), prefijo);
const quieto = (page) => expect.poll(() => page.evaluate(() => globalThis.__e2eMapa.loaded()), { timeout: 30_000 }).toBe(true);

test.describe('CR — El círculo y las líneas del mapa existen aunque bajen teselas (MapLibre de verdad)', () => {
  test('CR-1. Con teselas bajando, el círculo naranja de AVENTURA queda en el mapa', async ({ page, context }) => {
    test.setTimeout(120_000);
    const teselas = await arrancar(page, context);
    await moverConTeselasBajando(page, teselas, 3000);
    await page.evaluate(async (c) => {
      const mod = await import('/js/funciones-mapa.js');
      mod.actualizarMarcadorUsuario(c.lat, c.lng, 8, 'aventura');
    }, INICIO);
    await quieto(page);
    expect(await capas(page, 'vv-circulo'), 'el círculo naranja, en el mapa').toHaveLength(2);
  });

  test('CR-2. Con teselas bajando, la línea de navegación queda en el mapa', async ({ page, context }) => {
    test.setTimeout(120_000);
    const teselas = await arrancar(page, context);
    await moverConTeselasBajando(page, teselas, 3000);
    await page.evaluate(async (c) => {
      const mod = await import('/js/funciones-mapa.js');
      mod.dibujarPolylineNavegacion({ origen: { lat: c.lat - 0.001, lng: c.lng }, destino: { lat: c.lat, lng: c.lng } });
    }, INICIO);
    await quieto(page);
    expect((await capas(page, 'vv-polyline')).length, 'la línea, en el mapa').toBeGreaterThan(0);
  });

  test('CR-3. Paso a AVENTURA por su handler y primera lectura del GPS: con el mapa quieto, el círculo está', async ({ page, context }) => {
    test.setTimeout(120_000);
    const teselas = await arrancar(page, context);
    teselas.retrasoMs = 1500;
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      await globalThis.__cargarDatosAventuraDiferidos();
      if (!globalThis.AVENTURA_PARADAS?.length) globalThis.AVENTURA_PARADAS = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
      await globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } });
      // Como al activar la aventura: el padre manda la parada de inicio, y el mapa vuela a ella (zoom 17, teselas nuevas).
      await globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-0' } });
    });
    await page.waitForTimeout(300); // VENTANA-OBSERVACION: el vuelo a la parada ya en marcha cuando llega la lectura
    await page.evaluate((c) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: c.lat - 0.0003, longitude: c.lng, accuracy: 8 } }), INICIO);
    await quieto(page);
    expect(await capas(page, 'vv-circulo'), 'el círculo naranja, en el mapa').toHaveLength(2);
  });
});
