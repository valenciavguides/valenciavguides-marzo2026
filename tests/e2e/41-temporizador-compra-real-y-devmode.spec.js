/**
 * 41-temporizador-compra-real-y-devmode.spec.js
 *
 * _iniciarTemporizadorAventura() (codigo-padre.html) es la única función que envía
 * AVENTURA.INICIADA a hijo1-opciones (extrainfo-hijo1.html), el mensaje que arranca su
 * reloj interno y, con él, el reloj visible del padre (#tiempo-display-padre). Dos reglas
 * gobiernan cuánto tiempo se le envía:
 *
 *  - Reanudación tras cerrar/reabrir la PWA (timestampInicioRest, el 6º parámetro): el
 *    tiempo comprado corre en tiempo real desde la compra (datosGuardados.timestamp de
 *    vv_aventura_iniciada), esté la app abierta o cerrada — igual que verificarTimeoutAventura()
 *    (js/reciclaje-digital.js), que ya corta el acceso con esa misma cuenta real. Sin este
 *    parámetro, reenviar el último tiempoRestante conocido pausaría el reloj visible durante
 *    todo el tiempo que la PWA estuvo cerrada, mostrando más tiempo del que realmente queda.
 *
 *  - Modo dev (globalThis._devModeActivo): el temporizador de compra no debe arrancar en
 *    absoluto, sea cual sea el modo — no hay compra real que cronometrar mientras se prueba
 *    la app con el atajo de desarrollo (Ctrl+Alt+clic / 5 toques en el logo P1).
 *
 * Verificado llamando a _iniciarTemporizadorAventura() directamente (expuesta en
 * globalThis) e interceptando el postMessage real hacia #hijo1-opciones, sin pasar por el
 * flujo completo de reanudación — aísla la variable exacta sin la fricción de temporización
 * del arranque en frío completo de la PWA.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('TW — Temporizador de compra: reloj real al reanudar y bloqueo en modo dev', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => typeof globalThis._iniciarTemporizadorAventura === 'function'
        && !!globalThis.__vv_INDICE_AVENTURAS?.Aventura1,
      null, { timeout: 15000 }
    ).catch(() => {});
  });

  test('TW-1. Reanudación: el tiempo enviado a hijo1 descuenta el tiempo real transcurrido desde la compra, no desde que se cerró la app', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      globalThis._devModeActivo = false;
      globalThis.estado.modo = { actual: 'aventura', anterior: 'casa' };
      const capturados = [];
      const iframe = document.getElementById('hijo1-opciones');
      const originalPostMessage = iframe.contentWindow.postMessage.bind(iframe.contentWindow);
      iframe.contentWindow.postMessage = function (data, origin) {
        capturados.push(data);
        return originalPostMessage(data, origin);
      };
      const UNA_HORA_MS = 60 * 60 * 1000;
      const timestampInicio = Date.now() - UNA_HORA_MS;
      await globalThis._iniciarTemporizadorAventura('Aventura1', 'es', globalThis.estado, '[TEST]', null, timestampInicio);
      const msg = capturados.find((m) => m.tipo === globalThis.TIPOS_MENSAJE.AVENTURA.INICIADA);
      return { tiempoEstimado: msg?.datos?.tiempoEstimado };
    });
    // Aventura1: 216000s (60h) totales. Con 1h real transcurrida desde la compra, deben
    // quedar ~212400s — nunca los 216000s completos (eso sería "pausar" el reloj al cerrar).
    expect(resultado.tiempoEstimado).toBeGreaterThan(212390);
    expect(resultado.tiempoEstimado).toBeLessThanOrEqual(212400);
  });

  test('TW-2. Modo dev: el temporizador de compra no arranca aunque el modo sea AVENTURA y haya reanudación', async ({ page }) => {
    const capturoMensaje = await page.evaluate(async () => {
      globalThis._devModeActivo = true;
      globalThis.estado.modo = { actual: 'aventura', anterior: 'casa' };
      const capturados = [];
      const iframe = document.getElementById('hijo1-opciones');
      const originalPostMessage = iframe.contentWindow.postMessage.bind(iframe.contentWindow);
      iframe.contentWindow.postMessage = function (data, origin) {
        capturados.push(data);
        return originalPostMessage(data, origin);
      };
      await globalThis._iniciarTemporizadorAventura('Aventura1', 'es', globalThis.estado, '[TEST]', null, Date.now() - 3600000);
      return capturados.some((m) => m.tipo === globalThis.TIPOS_MENSAJE.AVENTURA.INICIADA);
    });
    expect(capturoMensaje, 'en modo dev no debe enviarse AVENTURA.INICIADA en absoluto').toBe(false);
  });

  test('TW-3. Producción sin reanudación (arranque normal): se envía el tiempo máximo completo, sin descontar nada', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      globalThis._devModeActivo = false;
      globalThis.estado.modo = { actual: 'aventura', anterior: 'casa' };
      globalThis.estado.tiempoRestante = null;
      const capturados = [];
      const iframe = document.getElementById('hijo1-opciones');
      const originalPostMessage = iframe.contentWindow.postMessage.bind(iframe.contentWindow);
      iframe.contentWindow.postMessage = function (data, origin) {
        capturados.push(data);
        return originalPostMessage(data, origin);
      };
      await globalThis._iniciarTemporizadorAventura('Aventura1', 'es', globalThis.estado, '[TEST]');
      const msg = capturados.find((m) => m.tipo === globalThis.TIPOS_MENSAJE.AVENTURA.INICIADA);
      return { tiempoEstimado: msg?.datos?.tiempoEstimado };
    });
    expect(resultado.tiempoEstimado).toBe(216000);
  });
});
