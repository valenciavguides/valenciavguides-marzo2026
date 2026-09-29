/**
 * 84 — El modo llega a cada frame por un solo camino
 *
 *   CM-<frame>   Un CAMBIO_MODO que el padre manda por el bus se aplica exactamente una vez: un
 *                ENTENDIDO, un EFECTUADO y ningun NACK. En los seis frames que tienen modo.
 *   CM-arranque  Al quedar listos hijo2, hijo3 y hijo4, el padre no les vuelve a mandar el modo, y
 *                cada uno queda en el modo del padre solo con el `modoInicial` del handshake.
 *
 * POR QUE EXISTE
 *
 * El modo llegaba por cuatro caminos que se tapaban entre si: el `modoInicial` de
 * PADRE_CONFIRMA_HIJO_LISTO, el envio normal, un cerrojo (`secuenciaCompleta`) con el que el
 * hijo rechazaba con NACK cualquier CAMBIO_MODO mientras el padre no tuviera a hijo2, hijo3 y
 * hijo4 listos, y la cola del padre que recordaba esos rechazos y los reenviaba
 * (`pendingModeChanges`), mas una resincronizacion que volvia a mandar el modo a los tres al
 * quedar listos. Queda uno: `modoInicial` al conectarse y el envio normal despues
 * (decisión 11 — ver GUIA-COMPLETA.md §10.11).
 *
 * El cerrojo no protegia nada: medido, cuando el padre recibe el HIJO_LISTO de un frame ese
 * frame ya tiene su handler de CAMBIO_MODO (los siete, en los cuatro navegadores). Y el padre
 * fija su modo antes de difundirlo, asi que quien se conecta tarde lo recibe ya correcto.
 *
 * El estado de CM-arranque sale de lo que ve el usuario: la clase del modo en hijo3 y hijo4, y
 * el boton de ubicacion de hijo2, que en CASA esta siempre apagado.
 *
 * ROJO ANTES QUE VERDE: con el cerrojo, cada frame contesta NACK a un CAMBIO_MODO que no lo
 * lleve; y al quedar listos los tres, el padre les manda `sincronizacion_inicial`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const FRAMES_CON_MODO = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5'];

async function arrancar(page, context) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  // Cada frame hijo apunta los CAMBIO_MODO y las NOTIFICACION que le llegan, antes que la app.
  await page.addInitScript(() => {
    if (globalThis.top === globalThis) return;
    globalThis.__recibidosModo = [];
    globalThis.addEventListener('message', (ev) => {
      const m = ev.data;
      if (m?.tipo === 'SISTEMA.CAMBIO_MODO' || m?.tipo === 'SISTEMA.NOTIFICACION') {
        globalThis.__recibidosModo.push({ tipo: m.tipo, modo: m.datos?.modo, razon: m.datos?.razon, evento: m.datos?.evento });
      }
    }, true);
  });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

const conectado = (page, id) => page.evaluate((i) => !!globalThis.estado?.hijosInicializados?.has?.(i), id);

test.describe('CM — El modo llega a cada frame por un solo camino', () => {
  for (const ID of FRAMES_CON_MODO) {
    test(`CM-${ID}. ${ID} aplica un CAMBIO_MODO del padre exactamente una vez`, async ({ page, context }) => {
      test.setTimeout(120_000);
      await arrancar(page, context);
      if (ID !== 'seleccion') await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
      if (ID === 'hijo5') await page.evaluate(() => globalThis.cargarHijoCasa?.());
      await expect.poll(() => conectado(page, ID), { timeout: 60_000 }).toBe(true);

      await page.evaluate((id) => {
        globalThis.__acks = [];
        globalThis.addEventListener('message', (e) => {
          if (e.data?.origen !== id) return;
          globalThis.__acks.push({ tipo: e.data.tipo, modo: e.data.datos?.modo });
        });
      }, ID);

      await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
        tipo: globalThis.TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
        destino: id,
        datos: { modo: 'aventura' },
      }), ID);

      const efectuados = () => page.evaluate(() => globalThis.__acks.filter(
        (m) => m.tipo === 'SISTEMA.CAMBIO_MODO_EFECTUADO' && m.modo === 'aventura',
      ).length);
      await expect.poll(efectuados, { timeout: 15_000 }).toBeGreaterThanOrEqual(1);
      // VENTANA-OBSERVACION: un segundo acuse del mismo cambio no tiene condicion a la que esperar
      await page.waitForTimeout(1500);

      const acks = await page.evaluate(() => globalThis.__acks);
      const cuenta = (tipo) => acks.filter((m) => m.tipo === tipo && (tipo === 'SISTEMA.NACK' || m.modo === 'aventura')).length;
      expect(cuenta('SISTEMA.NACK'), `ningun NACK. Acuses: ${JSON.stringify(acks)}`).toBe(0);
      expect(cuenta('SISTEMA.CAMBIO_MODO_ENTENDIDO'), `un ENTENDIDO. Acuses: ${JSON.stringify(acks)}`).toBe(1);
      expect(cuenta('SISTEMA.CAMBIO_MODO_EFECTUADO'), `un EFECTUADO. Acuses: ${JSON.stringify(acks)}`).toBe(1);
    });
  }

  test('CM-arranque. Al quedar listos hijo2, hijo3 y hijo4 no se les reenvia el modo', async ({ page, context }) => {
    test.setTimeout(120_000);
    await arrancar(page, context);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());

    const criticos = ['hijo2', 'hijo3', 'hijo4'];
    const recibidos = (id) => page.evaluate((i) => document.getElementById(i)?.contentWindow?.__recibidosModo || null, id);
    // Antes se esperaba el aviso 'aplicacion_lista' que el padre mandaba tras quedar listos los
    // tres (retirado, paso 8.5 de la lavadora: ningun hijo tenia handler para el). La condicion
    // real que ese aviso senalizaba era esta: los tres ya en hijosInicializados.
    for (const id of criticos) {
      await expect
        .poll(() => page.evaluate((i) => globalThis.estado?.hijosInicializados?.has(i) === true, id), { timeout: 60_000 })
        .toBe(true);
    }

    for (const id of criticos) {
      const r = await recibidos(id);
      const modos = r.filter((m) => m.tipo === 'SISTEMA.CAMBIO_MODO');
      expect(modos, `${id} no debe recibir CAMBIO_MODO al arrancar: el modo le llega en el handshake`).toEqual([]);
    }

    const modoPadre = await page.evaluate(() => globalThis.estado?.modo?.actual || 'casa');
    expect(modoPadre).toBe('casa');
    const clase = (id) => page.evaluate((i) => {
      const b = document.getElementById(i)?.contentDocument?.body;
      return b ? ['modo-casa', 'modo-aventura'].filter((c) => b.classList.contains(c)) : null;
    }, id);
    expect(await clase('hijo3'), 'hijo3 en el modo del padre').toEqual(['modo-casa']);
    expect(await clase('hijo4'), 'hijo4 en el modo del padre').toEqual(['modo-casa']);
    const ubicacionApagada = await page.evaluate(() => {
      const b = document.getElementById('hijo2')?.contentDocument?.getElementById('btn-ubicacion');
      return b ? b.disabled === true : null;
    });
    expect(ubicacionApagada, 'hijo2 en CASA: boton de ubicacion apagado').toBe(true);
  });
});
