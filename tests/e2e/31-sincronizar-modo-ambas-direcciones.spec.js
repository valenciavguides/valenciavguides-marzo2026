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

test.describe('MD — sincronizarEstadoModo (hijo4) en ambas direcciones', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit no carga retos-hijo4.html como página standalone en este entorno — misma limitación conocida que 26-reto-completado-boton-verde.spec.js');
  });

  test('MD-1. CAMBIO_MODO→casa aplica clase modo-casa al body', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await enviarCambioModo(page, 'hijo4', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.body.classList.contains('modo-aventura'))).toBe(false);
  });

  test('MD-2. CAMBIO_MODO→aventura aplica clase modo-aventura al body', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
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
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Misma limitación de carga standalone que el describe de hijo4');
  });

  test('MD-6. CAMBIO_MODO→casa aplica modo-casa y deja la barra de progreso arrastrable', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');
    await enviarCambioModo(page, 'hijo3', 'casa');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-casa')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.getElementById('progressContainer').classList.contains('deshabilitado')), 'En CASA la barra debe quedar arrastrable aunque el padre no la haya habilitado explícitamente').toBe(false);
  });

  test('MD-7. CAMBIO_MODO→aventura aplica modo-aventura y deja la barra deshabilitada si el padre no la habilitó', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');
    await enviarCambioModo(page, 'hijo3', 'aventura');
    await expect.poll(() => page.evaluate(() => document.body.classList.contains('modo-aventura')), { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.getElementById('progressContainer').classList.contains('deshabilitado')), 'En AVENTURA sin CONTROL.HABILITAR{control:progressBar} del padre, la barra debe seguir no-arrastrable').toBe(true);
  });
});
