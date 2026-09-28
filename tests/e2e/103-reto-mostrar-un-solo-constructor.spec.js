'use strict';

/**
 * 103 — Paso 8.8 de la lavadora: dos constructores de RETO.MOSTRAR
 *
 * POR QUE EXISTE
 *
 * RETO.MOSTRAR se construye y envía a hijo4 desde dos sitios de codigo-padre.html:
 *   1. `_enviarRetoMostrar()` (llamado desde `_hdl_RETO_SOLICITAR`) — resuelve el reto, actualiza
 *      `_snapshotRecuperacion.retoActual` (para que `_vv_afterHijoListo('hijo4', ...)` pueda
 *      restaurarlo si hijo4 se recarga), muestra hijo4 y espera a que esté listo antes de enviar.
 *   2. `_procesarResultadoReto()` (parte de `_hdl_RETO_COMPLETADO`, rama "siguiente reto en cola",
 *      para paradas con más de un reto — ver docs/mensajeria-duplicada-en-hijos.md, feature
 *      planeada, sin datos reales todavía) — construye el mismo mensaje a mano, con su propia
 *      resolución de datos, pero SIN tocar `_snapshotRecuperacion.retoActual`.
 *
 * El propio `_hdl_RETO_COMPLETADO` limpia `_snapshotRecuperacion.retoActual = null`
 * incondicionalmente nada más entrar (comentario: "ya no debe restaurarse si hijo4 se recarga
 * después"), asumiendo que un reto completado siempre cierra la parada. Cuando queda un
 * siguiente reto en la cola, esa asunción es falsa: hay un reto nuevo activo, y el camino 2 no
 * lo registra en el snapshot — un reload de hijo4 en ese instante no restaura nada.
 *
 * RM-1  Camino real: tras completar un reto con otro en cola, hijo4 recibe RETO.MOSTRAR con el
 *       siguiente retoId (esto ya funciona hoy).
 * RM-2  El snapshot de recuperación queda actualizado con ese mismo retoId — probado por su
 *       efecto observable: una recarga de hijo4 justo después SÍ reenvía RETO.MOSTRAR con el
 *       reto correcto, no se queda callada.
 *
 * ROJO ANTES DEL ARREGLO: RM-1 ya pasaba; RM-2 fallaba (ninguna restauración tras recarga).
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function prepararPadreConAventura(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(() => { globalThis.aventuraSeleccionada = 'Aventura1'; globalThis.idiomaSeleccionado = 'es'; });
  await page.evaluate(async () => {
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
  });
}

async function escucharRetoMostrar(page, nombreFrame) {
  const frame = page.frames().find((f) => f.name() === nombreFrame);
  await frame.evaluate((key) => {
    globalThis[key] = [];
    globalThis.addEventListener('message', (e) => {
      if (e.data?.tipo === 'RETO.MOSTRAR') globalThis[key].push(e.data.datos);
    });
  }, `__reto_${nombreFrame}`);
  return () => frame.evaluate((key) => globalThis[key], `__reto_${nombreFrame}`);
}

test.describe('RM — RETO.MOSTRAR, un solo constructor', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await prepararPadreConAventura(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estado?.hijosInicializados?.has('hijo4'), null, { timeout: 60_000 });
    // Cola sintetica de dos retos: hoy ninguna parada real tiene mas de uno (ver
    // project_varios_retos_por_parada.md), asi que se fabrica el escenario a mano,
    // igual que otros specs de esta sesion sintetizan paradas de borde.
    await page.evaluate(() => {
      globalThis.estadoPadre.modo = globalThis.estadoPadre.modo || {};
      globalThis.estadoPadre.modo.actual = globalThis.MODOS.AVENTURA;
      globalThis.estado.retoActual = {
        id: 'reto-A', disponible: true, completado: false,
        cola: ['reto-A', 'reto-B'], colaCompletados: new Set(),
      };
    });
  });

  test('RM-1. Camino real: siguiente reto en cola llega a hijo4 con el retoId correcto', async ({ page }) => {
    const leer = await escucharRetoMostrar(page, 'hijo4');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.RETO.COMPLETADO,
      datos: { retoId: 'reto-A', correcto: true },
    }));
    await expect.poll(() => leer().then((r) => r.some((d) => d.retoId === 'reto-B')), { timeout: 5_000 }).toBe(true);
    const recibidos = await leer();
    expect(recibidos.some((d) => d.retoId === 'reto-B'), `hijo4 debe recibir el siguiente reto: ${JSON.stringify(recibidos)}`).toBe(true);
  });

  test('RM-2. Una recarga de hijo4 justo después SÍ restaura el reto en curso (snapshot actualizado)', async ({ page }) => {
    const leerAntes = await escucharRetoMostrar(page, 'hijo4');
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.RETO.COMPLETADO,
      datos: { retoId: 'reto-A', correcto: true },
    }));
    // Condición real: el snapshot que se está probando no está expuesto en globalThis (const de
    // módulo, codigo-padre.html:9781), así que se usa el efecto observable ya probado en RM-1 —
    // RETO.MOSTRAR con reto-B — como señal de que el estado previo al reload ya se asentó.
    await expect.poll(() => leerAntes().then((r) => r.some((d) => d.retoId === 'reto-B')), { timeout: 5_000 }).toBe(true);

    await page.evaluate(() => globalThis._vv_beforeHijoReload('hijo4'));

    const leer = await escucharRetoMostrar(page, 'hijo4');
    await page.evaluate(() => globalThis._vv_afterHijoListo('hijo4'));
    await expect.poll(() => leer().then((r) => r.some((d) => d.retoId === 'reto-B')), { timeout: 5_000 }).toBe(true);

    const recibidos = await leer();
    expect(recibidos.some((d) => d.retoId === 'reto-B'), `una recarga de hijo4 debe restaurar el reto en curso (reto-B), no quedarse callada: ${JSON.stringify(recibidos)}`).toBe(true);
  });
});
