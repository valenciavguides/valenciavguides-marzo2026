/**
 * 96 — Paso 7 de la lavadora de mensajería (F19 y F20 de docs/mensajeria-duplicada-en-hijos.md,
 * §22): el latido no manda auto-mensajes a hijos cuyo handler no hace nada, y la recuperación
 * de un hijo caído repite la entrega normal de su elemento en vez de un camino propio.
 *
 * POR QUE EXISTE
 *
 * LH — Cada CAMBIO_MODO mandaba HEARTBEAT_START/HEARTBEAT_PAUSE a hijo2/hijo3/hijo4/hijo5.
 * Sus 5 handlers (audio-hijo3, boton-casa-hijo5, chat-hijo6, coordenadas-hijo2, retos-hijo4)
 * solo loguean o escriben __HEARTBEAT_ACTIVO, un flag que nadie lee (grep confirmado: 0
 * lecturas en todo el repo) — el mensaje viaja para no hacer nada al llegar.
 *
 * RC2 — Tras un reload de hijo2 por heartbeat perdido, `_vv_afterHijoListo('hijo2')` mandaba
 * NAVEGACION.CAMBIO_PARADA en crudo directo al iframe de hijo2, saltándose por completo
 * `_hdl_NAVEGACION_CAMBIO_PARADA` — el único otro sitio que cambia de parada en toda la app
 * (comentario propio en codigo-padre.html L~7773). Eso deja fuera _actualizarEstadoParada
 * (estado.paradaActual del PADRE, marcadores del mapa), _solicitarAudioParaParada,
 * _precargarVideoParada y _precargarImagenParada: hijo2 muestra la parada recuperada, pero el
 * padre se queda con su propio estado desincronizado y sin las precargas de esa parada.
 *
 * ROJO ANTES QUE VERDE: LH-1 falla si un CAMBIO_MODO real vuelve a mandar HEARTBEAT_START a
 * hijo2. RC2-1 falla si la recuperación de hijo2 no pasa por despacharLocal(CAMBIO_PARADA) —
 * comprobado espiando la llamada, no leyendo el mensaje que llega a hijo2 (ese seguía saliendo
 * igual antes del arreglo; lo que faltaba era todo lo que solo dispara el handler real).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);

test.describe('LH/RC2 — Latido sin auto-mensajes muertos; recuperación por el camino normal', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
  });

  test('LH-1. Un CAMBIO_MODO real no manda HEARTBEAT_START/PAUSE a hijo2', async ({ page }) => {
    await frame(page, 'hijo2').evaluate(() => {
      globalThis.__hb = [];
      globalThis.addEventListener('message', (e) => {
        if (e.source === globalThis.parent && e.data && /^SISTEMA\.HEARTBEAT_(START|PAUSE)$/.test(e.data.tipo)) {
          globalThis.__hb.push(e.data.tipo);
        }
      });
    });
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'casa' } }));
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    // VENTANA-OBSERVACION: comprobar la ausencia de HEARTBEAT_START/PAUSE no admite poll.
    await page.waitForTimeout(1000);
    const recibidos = await frame(page, 'hijo2').evaluate(() => globalThis.__hb);
    expect(recibidos, `hijo2 no debe recibir HEARTBEAT_START/PAUSE: ${JSON.stringify(recibidos)}`).toEqual([]);
  });

  test('LH-2. El heartbeat del padre arranca igual en AVENTURA (control: el auto-mensaje muerto no era lo que lo encendía)', async ({ page }) => {
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    await expect.poll(() => page.evaluate(async () => {
      const hb = await globalThis.__vv_stateManager?.getHeartbeat?.();
      return hb ? { activo: !!hb.activo, userPaused: !!hb.userPaused } : null;
    }), { timeout: 5_000 }).toMatchObject({ activo: true, userPaused: false });
  });

  test('RC2-1. La recuperación de hijo2 pasa por despacharLocal(NAVEGACION.CAMBIO_PARADA), no por un envío directo', async ({ page }) => {
    // Poner al padre en una parada conocida por el camino real, para que el snapshot tenga algo que restaurar.
    const disponible = await page.evaluate(() => typeof globalThis._vv_beforeHijoReload === 'function' && typeof globalThis._vv_afterHijoListo === 'function');
    test.skip(!disponible, 'snapshot de recuperación no disponible');

    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: 'Av1-P-0' } }));
    const paradaActual = await page.evaluate(() => globalThis.estado?.paradaActual || null);
    test.skip(!paradaActual, 'sin paradaActual tras entrar en AVENTURA — no se puede montar el snapshot');

    await page.evaluate(() => globalThis._vv_beforeHijoReload('hijo2'));

    const espiado = await page.evaluate(async () => {
      const original = globalThis.mensajeria.despacharLocal;
      const llamadas = [];
      globalThis.mensajeria.despacharLocal = (msg) => { llamadas.push(msg); return original(msg); };
      try {
        await globalThis._vv_afterHijoListo('hijo2');
      } finally {
        globalThis.mensajeria.despacharLocal = original;
      }
      return llamadas;
    });
    const llamadaCambioParada = espiado.find((m) => m.tipo === 'NAVEGACION.CAMBIO_PARADA');
    expect(llamadaCambioParada, `la recuperación de hijo2 debe pasar por despacharLocal(NAVEGACION.CAMBIO_PARADA); despacharLocal recibió: ${JSON.stringify(espiado)}`).toBeTruthy();
  });
});
