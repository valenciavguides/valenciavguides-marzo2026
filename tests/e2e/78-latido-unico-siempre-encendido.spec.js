/**
 * 78 — El latido es uno solo y no se apaga (F5)
 *
 * POR QUE EXISTE
 *
 * El latido del bus es el supervisor de los hijos (spec 79, BC-12): vigila a cada uno desde que se registra, en cualquier
 * modo. El padre lo enciende una vez al arrancar y no se pausa en CASA. Hay dos cosas que se pueden romper sin que nada
 * falle a la vista:
 *  - que el reloj no esté encendido en algún modo: un hijo caído en CASA, o antes de elegir modo, no lo recargaría nadie;
 *  - que haya un SEGUNDO emisor periódico de `SISTEMA.HEARTBEAT`. Lo hubo: un módulo de monitoreo (retirado) mandaba uno a todos los
 *    iframes cada 5 s y no se paraba nunca. Los hijos contestan a ambos, se duplica el tráfico y la cuenta de latidos sin respuesta
 *    de cada hijo deja de medir lo que dice.
 *
 *   HC-1  Control: un latido enviado por el bus a hijo2 llega a la escucha. Demuestra que la escucha funciona, para que un HC-3
 *         en verde no pueda deberse a una escucha rota.
 *   HC-2  Camino real: el reloj está encendido desde el arranque, antes de que haya modo, y sigue encendido al pasar a CASA y a
 *         AVENTURA. No hay estado de pausa.
 *   HC-3  Camino real: en CASA, durante tres intervalos y medio, hijo2 recibe un latido por vuelta del reloj, todos del bus y sin
 *         dos más juntos: no hay un segundo emisor.
 *   HC-4  Volver a la pestaña no manda ningún latido suelto, pero sigue revalidando el tamaño del mapa.
 *
 * ROJO ANTES QUE VERDE: HC-2 falla si el reloj solo se enciende al entrar en AVENTURA, o si el estado del latido vuelve a tener
 * pausa. HC-3 falla si el reloj se para en CASA (ningún latido) o si hay un segundo emisor periódico (el doble de latidos y
 * huecos más cortos que el intervalo). HC-4 falla si el `visibilitychange` vuelve a difundir su propio latido.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);

const escucharLatidos = (page) => frame(page, 'hijo2').evaluate(() => {
  globalThis.__latidos = [];
  globalThis.addEventListener('message', (e) => {
    if (e.source === globalThis.parent && e.data && e.data.tipo === 'SISTEMA.HEARTBEAT') {
      globalThis.__latidos.push({ origen: e.data.origen || '(sin origen)', t: Date.now() });
    }
  });
});
const latidos = (page) => frame(page, 'hijo2').evaluate(() => globalThis.__latidos);
const estadoHeartbeat = (page) => page.evaluate(async () => {
  const hb = await globalThis.__vv_stateManager?.getHeartbeat?.();
  return hb ? { activo: !!hb.activo, tieneIntervalo: !!hb.intervalo, tienePausa: 'userPaused' in hb } : null;
});
const entrarEnModo = async (page, modo) => {
  await page.evaluate((m) => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: m } }), modo);
  await expect.poll(() => page.evaluate(() => globalThis.estadoPadre?.modo?.actual), { timeout: 10_000 }).toBe(modo);
};

test.describe('HC — El latido es uno solo y no se apaga', () => {
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

  test('HC-1. Control: un latido enviado por el bus llega a la escucha de hijo2', async ({ page }) => {
    await escucharLatidos(page);
    await page.evaluate(() => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT, destino: 'hijo2', datos: { timestamp: Date.now() },
    }));
    await expect.poll(() => latidos(page), { timeout: 5_000 }).not.toHaveLength(0);
  });

  test('HC-2. Camino real: el reloj está encendido desde el arranque, antes de que haya modo, y sigue en CASA y en AVENTURA', async ({ page }) => {
    test.setTimeout(60_000);
    const encendido = { activo: true, tieneIntervalo: true, tienePausa: false };

    expect(await page.evaluate(() => globalThis.estadoPadre?.modo?.actual ?? null), 'precondición: todavía no hay modo decidido').toBeNull();
    await expect.poll(() => estadoHeartbeat(page), {
      timeout: 5_000,
      message: 'el padre enciende el reloj al arrancar, sin esperar a ningún modo',
    }).toEqual(encendido);

    await entrarEnModo(page, 'casa');
    expect(await estadoHeartbeat(page), 'entrar en CASA no apaga el reloj').toEqual(encendido);

    await entrarEnModo(page, 'aventura');
    expect(await estadoHeartbeat(page), 'entrar en AVENTURA no lo reinicia ni lo cambia').toEqual(encendido);
  });

  test('HC-3. Camino real: en CASA hijo2 recibe un latido por vuelta del reloj, todos del bus y sin segundo emisor', async ({ page }) => {
    test.setTimeout(90_000);
    await entrarEnModo(page, 'casa');
    const intervalo = await page.evaluate(() => globalThis.ajustarTimeoutPorConexion(5000));

    await escucharLatidos(page);
    // Con un reloj de `intervalo` ms caben tres o cuatro vueltas en tres intervalos y medio; un segundo emisor periódico las dobla.
    // VENTANA-OBSERVACION: se cuenta lo que llega en un tiempo fijo, no se espera a una condición.
    await page.waitForTimeout(Math.round(intervalo * 3.5));
    const recibidos = await latidos(page);
    const huecos = recibidos.slice(1).map((l, i) => l.t - recibidos[i].t);

    expect(recibidos.length, `en CASA el reloj sigue latiendo: ${JSON.stringify(recibidos)}`).toBeGreaterThanOrEqual(3);
    expect(recibidos.length, `como mucho una vuelta por intervalo (${intervalo} ms); más es un segundo emisor: ${JSON.stringify(recibidos)}`).toBeLessThanOrEqual(4);
    expect(recibidos.every((l) => l.origen === 'padre'), `todos los latidos salen del bus del padre: ${JSON.stringify(recibidos)}`).toBe(true);
    expect(Math.min(...huecos), `ningún hueco más corto que el intervalo (${intervalo} ms): ${JSON.stringify(huecos)}`).toBeGreaterThanOrEqual(intervalo * 0.8);
  });

  test('HC-4. Volver a la pestaña no manda ningún latido suelto, pero sigue revalidando el tamaño del mapa', async ({ page }) => {
    test.setTimeout(90_000);
    const intervalo = await page.evaluate(() => globalThis.ajustarTimeoutPorConexion(5000));
    const hayMapa = await page.evaluate(() => typeof globalThis.funcionesMapa?.invalidarTamañoMapa === 'function');
    expect(hayMapa, 'precondición: el padre tiene funcionesMapa.invalidarTamañoMapa (lo que el evento sigue llamando)').toBe(true);

    await page.evaluate(() => {
      globalThis.__invalidaciones = 0;
      const original = globalThis.funcionesMapa.invalidarTamañoMapa;
      globalThis.funcionesMapa.invalidarTamañoMapa = (...args) => { globalThis.__invalidaciones += 1; return original.apply(globalThis.funcionesMapa, args); };
    });
    await escucharLatidos(page);
    // Se espera a que acabe de salir una vuelta del reloj, para que la siguiente quede a un intervalo entero de distancia y no
    // pueda confundirse con un latido que provoque el evento.
    await expect.poll(async () => (await latidos(page)).length, { timeout: intervalo + 5_000, message: 'una vuelta del reloj' }).toBeGreaterThanOrEqual(1);
    const antes = (await latidos(page)).length;

    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await expect.poll(() => page.evaluate(() => globalThis.__invalidaciones), { timeout: 3_000, message: 'al volver a la pestaña se revalida el tamaño del mapa' }).toBeGreaterThanOrEqual(1);
    // Un segundo de margen, con la siguiente vuelta del reloj a un intervalo entero de distancia.
    // VENTANA-OBSERVACION: lo que se mide es que NO sale ningún latido a raíz del evento.
    await page.waitForTimeout(1_000);
    expect((await latidos(page)).length, 'el evento no manda ningún latido: solo late el reloj').toBe(antes);
  });
});
