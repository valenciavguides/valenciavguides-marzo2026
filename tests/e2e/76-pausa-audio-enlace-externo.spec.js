/**
 * 76 — Abrir una pagina informativa tiene que pausar el audio (F3)
 *
 * POR QUE EXISTE
 *
 * Al pulsar Gastronomia, Informacion, Historia o Paginas oficiales, hijo1 intenta pausar el
 * audio mandando `UI.ACCION_USUARIO { accion: 'audio_control', comando: 'pause' }` con
 * `destino: 'hijo3'`. Pero un hijo solo puede escribir al padre, y el padre no reenvia nada
 * ni conoce esa accion. Ver docs/mensajeria-duplicada-en-hijos.md, §10 y Parte II, F3.
 *
 * Se espia `pause()` del `<audio>` de hijo3, que su handler llama sin condiciones: asi no
 * hace falta que suene nada. `window.open` de hijo1 se sustituye porque abrir la pestana no
 * es lo que se prueba y el arnes no debe quedarse con ventanas abiertas.
 *
 *   PA-1  Control: el padre manda la pausa por el bus y hijo3 pausa. Demuestra el espia.
 *   PA-2  Camino real: pulsar el icono de Gastronomia en hijo1 pausa el audio de hijo3.
 *
 * ROJO ANTES QUE VERDE: mientras hijo1 le hable a su hermano en vez de al padre, PA-2 falla.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);
const pausas = (page) => frame(page, 'hijo3').evaluate(() => globalThis.__pausas || 0);

test.describe('PA — Abrir una pagina informativa pausa el audio', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => {
      const p = globalThis.estadoPadre?.hijosPreparados;
      return !!p && p.has('hijo1-opciones') && p.has('hijo3');
    }, null, { timeout: 60_000 });
    await page.waitForFunction(
      () => typeof document.getElementById('hijo1-opciones')?.contentDocument?.getElementById('icono-gastronomia')?.onclick === 'function',
      null, { timeout: 20_000 },
    );

    await frame(page, 'hijo3').evaluate(() => {
      const audio = document.getElementById('audioPlayer');
      globalThis.__pausas = 0;
      audio.pause = function () { globalThis.__pausas += 1; return HTMLMediaElement.prototype.pause.call(this); };
    });
    await frame(page, 'hijo1-opciones').evaluate(() => {
      globalThis.__abierto = null;
      globalThis.open = (url) => { globalThis.__abierto = url; return null; };
    });
  });

  test('PA-1. Control: el padre pausa a hijo3 por el bus', async ({ page }) => {
    await page.evaluate(() => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.UI.ACCION_USUARIO,
      destino: 'hijo3',
      datos: { accion: 'audio_control', comando: 'pause' },
    }));
    await expect.poll(() => pausas(page), { timeout: 5_000 }).toBeGreaterThan(0);
  });

  test('PA-2. Camino real: pulsar Gastronomia en hijo1 pausa el audio de hijo3', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));

    await frame(page, 'hijo1-opciones').evaluate(() => {
      document.getElementById('icono-gastronomia').click();
    });

    // Precondicion: el clic recorrio el camino real hasta abrir el enlace.
    await expect.poll(() => frame(page, 'hijo1-opciones').evaluate(() => globalThis.__abierto), { timeout: 5_000 })
      .toContain('gastronomia.html');

    // Se espera a que la pausa LLEGUE a hijo3. El fallo del poll se ignora: el expect de abajo
    // es el que informa, y ahi el log de "accion no manejada" ya esta recogido.
    await expect.poll(() => pausas(page), { timeout: 8_000 }).toBeGreaterThan(0).catch(() => {});
    const n = await pausas(page);
    const noManejada = logs.find((t) => /Acción no manejada: audio_control/.test(t));
    expect(
      n,
      'F3: al abrir la pagina informativa, el audio de hijo3 tiene que pausarse'
        + (noManejada ? ` — el padre la recibio y no la trato: "${noManejada.slice(0, 100)}"` : ''),
    ).toBeGreaterThan(0);
  });
});
