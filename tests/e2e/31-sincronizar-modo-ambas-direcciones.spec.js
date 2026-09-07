/**
 * 31-sincronizar-modo-ambas-direcciones.spec.js
 *
 * Verificación de que las funciones locales renombradas en esta sesión
 * (retos-hijo4.html: actualizarInterfazModo → sincronizarEstadoModo;
 * audio-hijo3.html: actualizarInterfazModo → sincronizarSeekPorModo)
 * funcionan igual de bien en las dos direcciones del cambio de modo
 * (CASA→AVENTURA y AVENTURA→CASA), no solo en la dirección que se probó
 * a mano durante el desarrollo. Incluye también el guard `retoSigueActivo`
 * de RETO.LIMPIAR_ESTADO (fix de la misma sesión), específico de CASA.
 *
 * Igual que 26-reto-completado-boton-verde.spec.js, carga los hijos como
 * página de nivel superior (sin padre real) e inyecta los mensajes por
 * postMessage sintético — suficiente para observar el efecto en el DOM
 * propio de cada hijo, sin depender de que el padre exista.
 *
 *   MD-1  hijo4: CAMBIO_MODO→casa aplica clase modo-casa al body
 *   MD-2  hijo4: CAMBIO_MODO→aventura aplica clase modo-aventura al body
 *   MD-3  hijo4: RETO.LIMPIAR_ESTADO con retoSigueActivo:false NO reaparece
 *         botonRetos-wrapper en CASA
 *   MD-4  hijo4: RETO.LIMPIAR_ESTADO con retoSigueActivo:true SÍ reaparece
 *         botonRetos-wrapper en CASA
 *   MD-5  hijo4: RETO.LIMPIAR_ESTADO sin campo retoSigueActivo (compatibilidad
 *         hacia atrás) también reaparece botonRetos-wrapper en CASA
 *   MD-6  hijo3: CAMBIO_MODO→casa aplica clase modo-casa y deja la barra de
 *         progreso arrastrable (CASA fuerza habilitado)
 *   MD-7  hijo3: CAMBIO_MODO→aventura aplica clase modo-aventura y deja la
 *         barra de progreso NO arrastrable si el padre no la ha habilitado
 */
'use strict';

const { test, expect } = require('@playwright/test');

/**
 * Espera a que el handler de `tipo` esté registrado, en vez de dormir 400 ms a ciegas.
 *
 * `messagingAdapter._listenerRegistry` guarda, por tipo, el listener de 'message' que
 * atiende el postMessage sintético de estos tests: si la clave existe, el mensaje ya no
 * puede caer en el vacío. Está definido igual en hijo2, hijo3 y hijo4.
 *
 * MEDIDO, y conviene no equivocarse con esto: la condición **ya se cumple en
 * domcontentloaded** en los dos motores (12-18 ms, que es solo el sondeo). Los
 * <script type="module"> son diferidos y se ejecutan ANTES de domcontentloaded, así que la
 * carrera que describía el comentario anterior —"el postMessage puede llegar antes de que
 * el handler exista"— nunca ocurrió. Este cambio hace la espera explícita y ahorra 2,8 s
 * por ejecución; **no** arregla la caída intermitente de MD-2/MD-3 en tandas completas,
 * cuya causa sigue sin identificar (sospecha a comprobar: el `timeout: 5000` del
 * expect.poll se queda corto con la máquina cargada, no que el mensaje se pierda).
 *
 * (Tampoco sirve `__CONTROLADOR_REGISTRADOS`: se marca ANTES de que termine el registro real.)
 */
async function esperarHandler(page, tipo) {
  await page.waitForFunction(
    (t) => globalThis.messagingAdapter?._listenerRegistry?.has(t) === true,
    tipo,
    { timeout: 10000 }
  );
}

async function enviarCambioModo(page, destino, modo) {
  await page.evaluate(({ destino, modo }) => {
    globalThis.postMessage({
      tipo: 'SISTEMA.CAMBIO_MODO',
      origen: 'padre',
      destino,
      datos: { modo, secuenciaCompleta: true, timestamp: Date.now() },
    }, globalThis.location.origin);
  }, { destino, modo });
}

/**
 * Provee el `globalThis.mensajeria` que el hijo espera cuando NO vive en un iframe.
 *
 * CAUSA RAIZ de la caida intermitente de MD-2/MD-3, medida:
 *
 *   `enviarMensaje()` (retos-hijo4.html ~L429) bifurca por `parent !== window`. En
 *   produccion el hijo SIEMPRE es un iframe, asi que toma la rama rapida de postMessage.
 *   Cargado como pagina suelta —que es lo que hacen estos tests— cae al `else`, que hace
 *   `retryUntilAvailable(..., 10, 500)` sobre `globalThis.mensajeria`, y ese objeto no
 *   existe standalone porque el hijo no carga mensajeria.js: agota los 10 intentos.
 *
 *   10 x 500 ms = 5.000 ms EXACTOS. Y el handler de CAMBIO_MODO hace `await` de ese envio
 *   (el CAMBIO_MODO_ENTENDIDO, ~L1676) ANTES de llamar a sincronizarEstadoModo (~L1701),
 *   que es quien pone la clase en el body. El `expect.poll` esperaba 5.000 ms: empate
 *   exacto, resuelto por el planificador. De ahi que pasara suelto y cayera en tandas
 *   completas con la maquina cargada.
 *
 * Con el stub, la rama lenta resuelve al instante: desaparece la carrera y se ahorran ~5 s
 * por caso. No debilita lo que se prueba —estos tests verifican que sincronizarEstadoModo
 * aplica las clases, no la entrega del ENTENDIDO— y de hecho se parece mas a produccion,
 * donde ese envio tampoco bloquea.
 */
async function proveerMensajeriaStub(page) {
  await page.addInitScript(() => {
    globalThis.mensajeria = globalThis.mensajeria || {
      enviarMensaje: () => Promise.resolve({ exito: true, metodo: 'stub-e2e' }),
    };
  });
}

test.describe('MD — sincronizarEstadoModo (hijo4) en ambas direcciones', () => {
  test.beforeEach(async ({ page }) => { await proveerMensajeriaStub(page); });

  test('MD-1. CAMBIO_MODO→casa aplica clase modo-casa al body', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo4', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.body.classList.contains('modo-aventura'))).toBe(false);
  });

  test('MD-2. CAMBIO_MODO→aventura aplica clase modo-aventura al body', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo4', 'aventura');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-aventura')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.body.classList.contains('modo-casa'))).toBe(false);
  });

  async function enviarLimpiarEstado(page, datos) {
    await page.evaluate((datos) => {
      globalThis.postMessage({
        tipo: 'RETO.LIMPIAR_ESTADO',
        origen: 'padre',
        destino: 'hijo4',
        datos,
      }, globalThis.location.origin);
    }, datos);
  }

  test('MD-3. RETO.LIMPIAR_ESTADO con retoSigueActivo:false NO reaparece botonRetos-wrapper en CASA', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo4', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);

    // Punto de partida conocido: oculto (el HTML estático ya arranca así).
    expect(await page.evaluate(() => document.getElementById('botonRetos-wrapper').style.display)).toBe('none');

    await enviarLimpiarEstado(page, { retoId: 'reto-viejo', retoSigueActivo: false });
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.getElementById('botonRetos-wrapper').style.display), 'retoSigueActivo:false debe dejar el wrapper oculto').toBe('none');
  });

  test('MD-4. RETO.LIMPIAR_ESTADO con retoSigueActivo:true SÍ reaparece botonRetos-wrapper en CASA', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo4', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);

    await enviarLimpiarEstado(page, { retoId: 'reto-actual', retoSigueActivo: true });
    await expect.poll(() => page.evaluate(() => document.getElementById('botonRetos-wrapper').style.display), {
      timeout: 5000,
      message: 'retoSigueActivo:true debe volver a mostrar el wrapper',
    }).toBe('');
  });

  test('MD-5. RETO.LIMPIAR_ESTADO sin campo retoSigueActivo (compatibilidad) también reaparece el wrapper en CASA', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo4', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);

    await enviarLimpiarEstado(page, { retoId: 'reto-sin-campo' });
    await expect.poll(() => page.evaluate(() => document.getElementById('botonRetos-wrapper').style.display), {
      timeout: 5000,
      message: 'Sin el campo retoSigueActivo, el valor por defecto (!== false) debe mostrar el wrapper — no romper el caso normal',
    }).toBe('');
  });
});

test.describe('MD — sincronizarSeekPorModo (hijo3) en ambas direcciones', () => {
  test.beforeEach(async ({ page }) => { await proveerMensajeriaStub(page); });

  test('MD-6. CAMBIO_MODO→casa aplica modo-casa y deja la barra de progreso arrastrable', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo3', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.getElementById('progressContainer').classList.contains('deshabilitado')), 'En CASA la barra debe quedar arrastrable aunque el padre no la haya habilitado explícitamente').toBe(false);
  });

  test('MD-7. CAMBIO_MODO→aventura aplica modo-aventura y deja la barra deshabilitada si el padre no la habilitó', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');
    await esperarHandler(page, 'SISTEMA.CAMBIO_MODO');
    await enviarCambioModo(page, 'hijo3', 'aventura');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-aventura')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.getElementById('progressContainer').classList.contains('deshabilitado')), 'En AVENTURA sin CONTROL.HABILITAR{control:progressBar} del padre, la barra debe seguir no-arrastrable').toBe(true);
  });
});
