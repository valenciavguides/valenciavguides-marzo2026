/**
 * 183 — Los números del GPS salen de una sola tabla, CONFIG.GPS (js/config.js)
 *
 * POR QUE EXISTE
 *
 * El radio de llegada, las franjas de distancia, las gracias, la ventana de dos de cuatro, el margen de salida y los de la
 * zona de 5 km estaban escritos a mano en el mapa, en hijo2 y en el padre, algunos dos o tres veces. Ahora los tres los
 * leen de la tabla (guía, «Configuración del GPS»). El spec mide las fronteras por el camino real (lecturas por el mapa,
 * que hijo2 juzga y le cuenta al padre), a un metro de cada lado: pasa con los números de hoy, antes y después de llevarlos
 * a la tabla, y cae si la tabla se cambia (control de mutación, a mano: con LEJOS_M en 160, cae BF-1 en los 151 m).
 *
 *   BF-1  La franja que hijo2 le cuenta al padre al salir de una parada: a 49 m «fuera», a 51 «desviado», a 149 «desviado»,
 *         a 151 «lejos», a 1999 «lejos» y a 2001 «perdido» (cada distancia, una salida nueva: se cambia de parada y se vuelve).
 *   BF-2  El radio de llegada: a 16 m, cuatro lecturas no dan la llegada; a 14 m, dos de cuatro sí.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };
const OTRA = 'Av1-P-2';
const R = 6371000; // el radio de la Tierra de calcularDistancia (js/utils.js)

/** Un punto a `metros` al norte de la parada: a lo largo de un meridiano, la distancia es exacta. */
const alNorte = (metros) => ({ lat: PARADA.lat + (metros / R) * (180 / Math.PI), lng: PARADA.lng });

const lectura = (page, p) => page.evaluate((x) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: x.lat, longitude: x.lng, accuracy: 5 } }), p);
const activar = (page, id) => page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), id);
const deHijo2 = (page, tipo) => page.evaluate((t) => globalThis.__deHijo2.filter((m) => m.tipo === t), tipo);

test.describe('BF — Los números del GPS, en sus fronteras', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
      if (!globalThis.AVENTURA_PARADAS?.length) {
        const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
        if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
      }
    });
    await cargarHijosDelPadre(page);
    await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    await expect.poll(() => page.evaluate(() => globalThis.estado.modo?.actual), { timeout: 15_000 }).toBe('aventura');
    // Lo que hijo2 le dice al padre: la franja al salir y la llegada (la del mapa no pasa por aquí: no viene de hijo2).
    await page.evaluate(() => {
      globalThis.__deHijo2 = [];
      globalThis.addEventListener('message', (e) => {
        const m = e.data;
        if (m?.origen === 'hijo2' && (m.tipo === 'NAVEGACION.USUARIO_FUERA_RANGO' || m.tipo === 'NAVEGACION.LLEGADA_DETECTADA')) {
          globalThis.__deHijo2.push({ tipo: m.tipo, franja: m.datos?.franja ?? null, de: m.datos?.elementoMasCercano ?? m.datos?.paradaId ?? null, distancia: m.datos?.distancia ?? null });
        }
      });
    });
  });

  test('BF-1. La franja que cuenta hijo2 al salir de una parada, a un metro de cada frontera', async ({ page }) => {
    test.setTimeout(180_000);
    const casos = [[49, 'fuera'], [51, 'desviado'], [149, 'desviado'], [151, 'lejos'], [1999, 'lejos'], [2001, 'perdido']];
    const vistas = [];
    for (const [metros] of casos) {
      // Una salida nueva: al cambiar de elemento hijo2 olvida el fuera de rango del anterior (K-74), y al volver empieza de cero.
      expect((await activar(page, OTRA))?.exito).toBe(true);
      expect((await activar(page, PARADA.id))?.exito).toBe(true);
      const antes = (await deHijo2(page, 'NAVEGACION.USUARIO_FUERA_RANGO')).length;
      await expect.poll(async () => {
        await lectura(page, alNorte(metros));
        const nuevos = (await deHijo2(page, 'NAVEGACION.USUARIO_FUERA_RANGO')).slice(antes).filter((m) => m.de === PARADA.id);
        return nuevos.length > 0 ? nuevos[0].franja : null;
      }, { timeout: 15_000, intervals: [300], message: `hijo2 cuenta la franja a ${metros} m` }).not.toBeNull();
      const nuevos = (await deHijo2(page, 'NAVEGACION.USUARIO_FUERA_RANGO')).slice(antes).filter((m) => m.de === PARADA.id);
      vistas.push([metros, nuevos[0].franja]);
    }
    expect(vistas).toEqual(casos);
  });

  test('BF-2. El radio de llegada: a 16 m no se llega; a 14 m, con dos lecturas de cuatro, sí', async ({ page }) => {
    test.setTimeout(120_000);
    expect((await activar(page, PARADA.id))?.exito).toBe(true);
    const llegadas = async () => (await deHijo2(page, 'NAVEGACION.LLEGADA_DETECTADA')).filter((m) => m.de === PARADA.id).length;
    for (let i = 0; i < 4; i++) await lectura(page, alNorte(16));
    // VENTANA-OBSERVACION: comprobar que una llegada NO llega no admite poll; las cuatro lecturas ya están juzgadas
    await page.waitForTimeout(1_000);
    expect(await llegadas(), 'a 16 m, fuera del radio de 15, no hay llegada').toBe(0);
    await expect.poll(async () => { await lectura(page, alNorte(14)); return llegadas(); },
      { timeout: 15_000, intervals: [300], message: 'a 14 m, dentro del radio, la llegada' }).toBeGreaterThan(0);
  });
});
