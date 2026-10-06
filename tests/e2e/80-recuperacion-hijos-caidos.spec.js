/**
 * 80 — La red de seguridad: un hijo que deja de estar sano se recupera
 *
 * POR QUE EXISTE
 *
 * El bus supervisa a todos los iframes que hacen el apretón de manos (HIJO_PREPARADO → HIJO_LISTO) y
 * contestan al latido, y recarga al que deja de estar sano. Son todos los hijos por igual: la pantalla de
 * selección y de hijo1 a hijo6. No lo son los iframes que no hacen ese apretón (mapa completo, puzzle, vídeo):
 * no tienen nada que contestar, y supervisarlos los daría por caídos siempre.
 *
 * El contrato del bus (spec 79, BC-12) prueba el mecanismo con un arnés que pasa `supervisado` a mano.
 * Eso deja dos huecos: si la PWA real no se lo pasa a un hijo, o si un hijo no contesta al latido por el
 * camino de vuelta, BC-12 sigue verde y la red de seguridad no existe — o recarga a un hijo sano cada
 * pocos segundos. Esta spec cubre justo esos huecos, contra la aplicación de verdad.
 *
 *   RC-1  Control: tras la carga, los hijos están registrados en el bus y se puede leer si están supervisados.
 *         Sin esto, un RC-2 en verde podría deberse a que no hay nada que mirar.
 *   RC-2  Todos los hijos registrados están supervisados, y ninguno de los que no hacen el apretón lo está.
 *   RC-3  La restauración de hijo1 llega a hijo1: el snapshot se dirige al id con el que el hijo
 *         está registrado (`hijo1-opciones`), no a un `hijo1` que no existe en la mensajería.
 *   RC-4  Cada hijo contesta al latido y su respuesta llega a la cuenta del bus: un hijo con latidos sin
 *         responder vuelve a cero al contestar. Es el viaje de vuelta de cada hijo hasta el supervisor.
 *
 * ROJO ANTES QUE VERDE: RC-2 falla si nadie pasa `{ supervisado: true }` al registrar, RC-3 falla si la
 * restauración se dirige a un id que la mensajería no conoce, y RC-4 falla si un hijo no contesta o su
 * respuesta no llega — en los tres casos la recarga automática queda muerta, o recarga a un hijo sano, sin
 * que ningún otro test lo note.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * Los hijos que hacen el apretón de manos. hijo5 y hijo6-chat no salen en RC-1 porque en esta pantalla todavía
 * no están registrados — cada uno entra en la mensajería en su propio cargador (hijo5 al elegir aventura, el chat
 * al abrirlo). RC-2 les exige la marca igualmente, aparezcan cuando aparezcan.
 */
const HIJOS = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5', 'hijo6-chat'];
/** Los que se cargan en el beforeEach. */
const HIJOS_CARGADOS = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4'];
/** Registrados en el bus pero sin apretón de manos: ni los vigila el reloj ni tienen nada que contestar. */
const SIN_APRETON = ['mapa-completo', 'puzzle', 'video-intro'];

const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);

/** { id: supervisado } de todo lo que el bus tiene registrado ahora mismo. */
const supervision = (page) => page.evaluate(() => {
  const registrados = globalThis.mensajeria?.getIframesRegistrados?.();
  if (!registrados) return null;
  const salida = {};
  for (const [id, info] of registrados) salida[id] = info?.supervisado === true;
  return salida;
});

/** Abre el asistente por el camino real —pulsando su botón— y espera a que su bus esté vivo. */
async function abrirAsistente(page) {
  await page.waitForFunction(() => !!document.getElementById('btn-chat-soporte'), null, { timeout: 25_000 });
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  await page.waitForFunction(
    () => globalThis.estadoPadre?.hijosInicializados?.has('hijo6-chat'),
    null, { timeout: 30_000 },
  );
}

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
    const marcas = await supervision(page);
    expect(marcas, 'el bus debe exponer los iframes registrados').not.toBeNull();
    for (const id of HIJOS_CARGADOS) {
      expect(
        Object.prototype.hasOwnProperty.call(marcas, id),
        `${id} tiene que estar registrado en la mensajeria; si no, el padre no puede ni escribirle ni vigilarlo. Registrados: ${Object.keys(marcas).join(', ') || '(ninguno)'}`,
      ).toBe(true);
    }
  });

  test('RC-2. Todos los hijos estan supervisados, y los que no hacen el apretón de manos no', async ({ page }) => {
    const marcas = await supervision(page);

    for (const id of HIJOS_CARGADOS) {
      expect(
        marcas[id],
        `${id} hace el apretón de manos y contesta al latido: el bus tiene que supervisarlo, como a los demás. Supervisados ahora: ${Object.keys(marcas).filter((i) => marcas[i]).join(', ') || '(ninguno)'}`,
      ).toBe(true);
    }
    // Ni uno de más: lo supervisado son los hijos. Un iframe sin apretón de manos daría un caído falso cada
    // vuelta del reloj, y el bus lo recargaría para siempre.
    expect(
      Object.keys(marcas).filter((id) => marcas[id]).sort(),
      'solo pueden estar supervisados los hijos que hacen el apretón de manos',
    ).toEqual(Object.keys(marcas).filter((id) => HIJOS.includes(id)).sort());
    for (const id of SIN_APRETON) {
      if (id in marcas) expect(marcas[id], `${id} no hace el apretón de manos: no puede estar supervisado`).toBe(false);
    }
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

  test('RC-4. Cada hijo contesta al latido y su respuesta llega a la cuenta del bus', async ({ page }) => {
    test.setTimeout(90_000);
    await abrirAsistente(page);
    const ids = [...HIJOS_CARGADOS, 'hijo6-chat'];
    await page.waitForFunction(
      (lista) => lista.every((id) => globalThis.estadoPadre?.hijosInicializados?.has(id)),
      ids, { timeout: 30_000 },
    );

    // Cada hijo parte de «dos latidos sin contestar» y se le manda uno: lo único que puede dejar su cuenta
    // a cero es que conteste y que su respuesta llegue por el handler del padre hasta el bus.
    await page.evaluate((lista) => {
      for (const id of lista) {
        globalThis.mensajeria.getIframesRegistrados().get(id).latidosSinRespuesta = 2;
        globalThis.mensajeria.enviarMensaje({
          tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
          destino: id,
          datos: { timestamp: Date.now() },
        });
      }
    }, ids);

    await expect
      .poll(() => page.evaluate((lista) => Object.fromEntries(
        lista.map((id) => [id, globalThis.mensajeria.getIframesRegistrados().get(id).latidosSinRespuesta]),
      ), ids), {
        timeout: 8_000,
        message: 'un hijo que no contesta al latido, o cuya respuesta no llega, seguiría con latidos sin responder: el bus lo recargaría aunque esté sano',
      })
      .toEqual(Object.fromEntries(ids.map((id) => [id, 0])));
  });
});
