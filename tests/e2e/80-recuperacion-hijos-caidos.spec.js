/**
 * 80 — La red de seguridad: un hijo que deja de contestar se recupera
 *
 * POR QUE EXISTE
 *
 * El bus vigila a todos los iframes registrados y, tras `MAX_LATIDOS_SIN_RESPUESTA` latidos sin
 * respuesta, recarga **solo** los marcados como `recuperable`. Recargar a ciegas un frame que no
 * sabe retomar lo que estaba haciendo le hace perder el sitio al usuario, que es peor que el
 * cuelgue; por eso la marca existe.
 *
 * Quien puede llevar la marca no es una opinion: son exactamente los cuatro que
 * `_vv_afterHijoListo` (codigo-padre.html) sabe restaurar tras la recarga — hijo1 su temporizador,
 * hijo2 su parada, hijo3 su audio, hijo4 su reto. La pantalla de seleccion, hijo5 y el chat no
 * tienen restauracion, asi que no se recargan.
 *
 * El contrato del bus (spec 79, BC-12b) prueba el mecanismo con un arnes que pasa la marca a mano.
 * Eso deja un hueco: si la PWA real no se la pasa a nadie, BC-12b sigue verde y la red de
 * seguridad no existe. Esta spec cubre justo ese hueco, contra la aplicacion de verdad.
 *
 *   RC-1  Control: tras la carga, los hijos estan registrados en el bus y se puede leer su marca.
 *         Sin esto, un RC-2 en verde podria deberse a que no hay nada que mirar.
 *   RC-2  Los cuatro que saben restaurarse estan marcados, y los que no, no lo estan.
 *   RC-3  La restauracion de hijo1 llega a hijo1: el snapshot se dirige al id con el que el hijo
 *         esta registrado (`hijo1-opciones`), no a un `hijo1` que no existe en la mensajeria.
 *
 * ROJO ANTES QUE VERDE: RC-2 falla si nadie pasa `{ recuperable: true }` al registrar, y RC-3 falla
 * si la restauracion se dirige a un id que la mensajeria no conoce — en ambos casos la recarga
 * automatica queda muerta sin que ningun otro test lo note.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Los que `_vv_afterHijoListo` sabe restaurar. Cualquier cambio aqui exige cambiarlo alli. */
const RECUPERABLES = ['hijo1-opciones', 'hijo2', 'hijo3', 'hijo4'];
/**
 * Registrado a proposito SIN marca: no tiene restauracion que aplicar tras una recarga.
 * hijo5 y hijo6-chat no salen aqui porque en esta pantalla todavia no estan registrados — cada uno
 * entra en la mensajeria en su propio cargador (hijo5 al elegir aventura, el chat al abrirlo). La
 * comprobacion de que tampoco ellos llevan marca la hace RC-2 exigiendo que el conjunto marcado sea
 * EXACTAMENTE el de arriba, aparezca quien aparezca.
 */
const NO_RECUPERABLES = ['seleccion'];

const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);

/** { id: recuperable } de todo lo que el bus tiene registrado ahora mismo. */
const marcasDeRecuperacion = (page) => page.evaluate(() => {
  const registrados = globalThis.mensajeria?.getIframesRegistrados?.();
  if (!registrados) return null;
  const salida = {};
  for (const [id, info] of registrados) salida[id] = info?.recuperable === true;
  return salida;
});

test.describe('RC — Un hijo caido se recupera', () => {
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

  test('RC-1. Control: los hijos estan registrados en el bus y su marca es legible', async ({ page }) => {
    const marcas = await marcasDeRecuperacion(page);
    expect(marcas, 'el bus debe exponer los iframes registrados').not.toBeNull();
    for (const id of [...RECUPERABLES, ...NO_RECUPERABLES]) {
      expect(
        Object.prototype.hasOwnProperty.call(marcas, id),
        `${id} tiene que estar registrado en la mensajeria; si no, el padre no puede ni escribirle ni vigilarlo. Registrados: ${Object.keys(marcas).join(', ') || '(ninguno)'}`,
      ).toBe(true);
    }
  });

  test('RC-2. Solo los que saben restaurarse estan marcados como recuperables', async ({ page }) => {
    const marcas = await marcasDeRecuperacion(page);
    const marcados = Object.keys(marcas).filter((id) => marcas[id]).sort();

    for (const id of RECUPERABLES) {
      expect(
        marcas[id],
        `${id} sabe restaurar su estado tras una recarga (_vv_afterHijoListo lo contempla), asi que el bus debe poder recargarlo cuando deje de contestar. Marcados ahora: ${marcados.join(', ') || '(ninguno)'}`,
      ).toBe(true);
    }
    for (const id of NO_RECUPERABLES) {
      expect(
        marcas[id],
        `${id} no tiene restauracion: recargarlo a ciegas le haria perder el sitio al usuario`,
      ).toBe(false);
    }
    // Ni uno de mas: si manana alguien marca hijo5 o el chat, el bus los recargaria sin que nadie
    // sepa devolverles su estado.
    expect(
      marcados,
      'solo pueden llevar marca los que _vv_afterHijoListo sabe restaurar',
    ).toEqual(RECUPERABLES.filter((id) => id in marcas).sort());
  });

  test('RC-3. La restauracion de hijo1 llega a hijo1', async ({ page }) => {
    test.setTimeout(90_000);
    const falta = await page.evaluate(() => [
      ['SISTEMA.CAMBIO_MODO', globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true],
      ['_vv_beforeHijoReload', typeof globalThis._vv_beforeHijoReload === 'function'],
      ['_vv_afterHijoListo', typeof globalThis._vv_afterHijoListo === 'function'],
    ].filter(([, hay]) => !hay).map(([n]) => n));
    test.skip(falta.length > 0, `ganchos de recuperacion no disponibles: ${falta.join(', ')}`);

    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    // Se espera a que el modo quede APLICADO, que es la condicion real; el padre lo apunta en
    // `estadoPadre.modo.actual` —el mismo campo que lee el handler del temporizador—.
    await expect
      .poll(() => page.evaluate(() => globalThis.estadoPadre?.modo?.actual), { timeout: 10_000 })
      .toBe('aventura');

    // El tiempo restante se apunta en `estado.tiempoRestante` en cuanto llega el mensaje, sin
    // depender de que la ventana del temporizador este abierta: si dependiera, hijo1 se recargaria
    // sin temporizador que restaurar en cuanto el usuario no la hubiera tocado.
    // Auto-mensaje: uno no esta entre sus propios iframes registrados, asi que `enviarMensaje` no
    // puede entregarselo. `despacharLocal` es la via del bus para eso.
    await page.evaluate(async () => {
      await globalThis.mensajeria.despacharLocal({
        tipo: globalThis.TIPOS_MENSAJE.AVENTURA.TIEMPO_ACTUALIZADO,
        origen: globalThis.mensajeria.getComponenteId(),
        datos: { tiempoRestante: 1234, estado: 'verde', timestamp: Date.now() },
      }).catch(() => {});
    });
    await expect
      .poll(() => page.evaluate(() => globalThis.estado?.tiempoRestante), { timeout: 5_000 })
      .toBe(1234);

    // Escuchar en hijo1 lo que el padre le manda al restaurar.
    const hijo1 = frame(page, 'hijo1-opciones');
    test.skip(!hijo1, 'hijo1 no esta cargado');
    await hijo1.evaluate(() => {
      globalThis.__restauraciones = [];
      globalThis.addEventListener('message', (e) => {
        if (e.source === globalThis.parent && e.data?.tipo === 'AVENTURA.INICIADA') {
          globalThis.__restauraciones.push(e.data);
        }
      });
    });

    await page.evaluate(async () => {
      globalThis._vv_beforeHijoReload('hijo1-opciones');
      await globalThis._vv_afterHijoListo('hijo1-opciones');
    });

    await expect
      .poll(() => hijo1.evaluate(() => globalThis.__restauraciones.length), { timeout: 8_000 })
      .toBeGreaterThan(0);
  });
});
