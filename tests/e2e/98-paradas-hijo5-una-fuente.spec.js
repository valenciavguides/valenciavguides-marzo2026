/**
 * 98 — Paso 8 de la lavadora (un solo camino donde hoy hay dos), segundo caso: la lista de
 * paradas de hijo5 llega desde dos fuentes distintas.
 *
 * POR QUE EXISTE
 *
 * hijo5 puede recibir su lista de paradas por dos caminos que construían el payload de forma
 * distinta:
 *   - Empuje (`distribuirDatosAventura()`, activación real; `_enviarRespuestaParadasHijosRest()`,
 *     reanudación): mapeaba a mano `__vv_DATOS_AVENTURAS[aventura]['coordenadas-hijo2.html']
 *     .coordenadas` — el fichero crudo de coordenadas, pensado para el mapa de hijo2, que incluye
 *     entradas `tipo: "referencia"` (Torres de Serranos, Palacio de los Borgia...).
 *   - Petición (`SOLICITAR_DATOS_PARADAS`, cuando hijo5 se autoconsulta): usa
 *     `normalizarParadas_S1(DATOS_PADRE[aventura][idioma].elementosIDpadre)` — la fuente que el
 *     propio comentario del handler llama "primaria" y que nunca mezcla entradas `referencia`
 *     (§9 de la guía: esa lista "está ya en secuencia real").
 *
 * hijo5 filtra `tipo` fuera de `['inicio','parada','tramo']` al generar botones, así que el
 * síntoma no era visible — pero las dos fuentes pueden divergir (campos distintos, orden
 * distinto) sin que nada lo detecte. Un solo camino: los tres sitios usan ahora
 * `normalizarParadas_S1(DATOS_PADRE...)`.
 *
 * PD-1  Camino real: el empuje de `distribuirDatosAventura()` ya no manda entradas
 *       `tipo: "referencia"` a hijo5 — viene de la misma fuente que el camino de petición.
 *
 * ROJO ANTES DEL ARREGLO: PD-1 fallaba (el empuje sí traía las 3+ referencias del fichero crudo).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('PD — Paradas de hijo5, una sola fuente', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    // hijo5 no se carga en P14 como los demas: entra por su propio cargador.
    await page.evaluate(() => globalThis.cargarHijoCasa?.());
    // distribuirDatosAventura solo empuja a hijo5 si esta en hijosInicializados (tras
    // HIJO_LISTO, no solo HIJO_PREPARADO) — hay que esperar a ese hito, no antes.
    await page.waitForFunction(
      () => globalThis.estado?.hijosInicializados?.has('hijo5'),
      null,
      { timeout: 60_000 },
    );
  });

  test('PD-1. El empuje a hijo5 (distribuirDatosAventura) no manda entradas tipo:referencia', async ({ page }) => {
    const frameHijo5 = page.frames().find((f) => f.name() === 'hijo5');
    await frameHijo5.evaluate(() => {
      globalThis.__paradasHijo5Recibidas = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data && e.data.tipo === 'NAVEGACION.RESPUESTA_DATOS_PARADAS') {
          globalThis.__paradasHijo5Recibidas.push(e.data.datos);
        }
      });
    });
    await page.waitForFunction(() => typeof globalThis.__cargarDatosAventuraDiferidos === 'function', null, { timeout: 15_000 });
    await page.evaluate(() => globalThis.__cargarDatosAventuraDiferidos());
    await page.evaluate(() => globalThis.distribuirDatosAventura('Aventura1', 'es'));
    await page.waitForTimeout(500);
    const recibidas = await frameHijo5.evaluate(() => globalThis.__paradasHijo5Recibidas);
    expect(recibidas.length, 'distribuirDatosAventura debe haber mandado RESPUESTA_DATOS_PARADAS').toBeGreaterThan(0);
    const conReferencia = recibidas.flatMap((d) => d.paradas || []).filter((p) => p.tipo === 'referencia');
    expect(conReferencia, `no deben llegar entradas tipo:referencia a hijo5: ${JSON.stringify(conReferencia).slice(0, 300)}`).toEqual([]);
  });
});
