/**
 * 34-recordatorio-reto.spec.js
 *
 * Cartel recordatorio "pulse retos" (codigo-padre.html, ver GUIA-COMPLETA §25.5c) —
 * sistema nuevo, añadido 2026-08-17 como espejo exacto del recordatorio de audio
 * (29-recordatorio-audio.spec.js): mismos umbrales (10s + proximidad real, autocierre
 * a los 7s, reaparición cada 20s), mismo icono H4-fotoretos.png. Se muestra solo
 * cuando el botón de retos acaba de habilitarse de verdad tras terminar el audio de
 * un elemento con reto (_procesarFinAudioElemento, rama hijo4Listo). Abrir el reto
 * solo retrasa el próximo aviso (_marcarRetoPulsadoRecordatorio); el apagado
 * PERMANENTE ocurre únicamente en _retoColaCompletada(), cuando toda la cola de
 * retos de la parada se resuelve de verdad.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('RR — Recordatorio periódico de resolver el reto', () => {
  test.beforeEach(async ({ page, context }) => {
    // Sin esto, el activarGPS()/watchPosition() real que dispara el arranque de FASE 3
    // se queda colgado para siempre en Firefox — ver 30-casa-no-fuga-aventura.spec.js
    // (CM-6) y la memoria feedback_e2e_geolocation_firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    // Sin este stub, retryUntilAvailable() esperando MapLibre real corre sobre el MISMO
    // reloj simulado que el test avanza a mano — con page.clock.install() los 15s reales
    // de esa espera nunca transcurren solos, así que un test que avanza el reloj más de
    // 15s cruza ese umbral y dispara _avisarFalloCargaAppUnaVez() (alert() real) a mitad
    // del test, desincronizando los timers que sí está probando (regresión real detectada
    // 2026-08-19 en RR-3 tras añadir el alert() a esa rama — ver GUIA-COMPLETA.md).
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.clock.install();
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
    // WebKit puede tardar más que gotoAndWaitForFase1 en exponer las funciones de
    // Script 2 en globalThis — esperar explícitamente evita un TypeError de carrera
    // ("... is not a function") en vez de asumir que ya están listas.
    await page.waitForFunction(
      () => typeof globalThis._iniciarRecordatorioReto === 'function'
        && typeof globalThis._marcarRetoPulsadoRecordatorio === 'function'
        && typeof globalThis._detenerRecordatorioReto === 'function',
      null, { timeout: 15_000 }
    ).catch(() => {});
  });

  test('RR-1. proximidadReal=false + 10s -> NO sale', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioReto === 'function',
      estadoPadre: typeof globalThis.estadoPadre === 'object' && globalThis.estadoPadre !== null,
    }));
    test.skip(!disponible.iniciar || !disponible.estadoPadre, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    const existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Sin proximidadReal no debe salir').toBe(false);
  });

  test('RR-2. proximidadReal=true + 10s -> SI sale, con icono de retos', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    const info = await page.evaluate(() => {
      const el = document.getElementById('cartel-recordatorio-reto');
      const img = el?.querySelector('img')?.getAttribute('src') || null;
      return { existe: !!el, img, texto: el?.textContent || '' };
    });
    expect(info.existe, 'Con proximidadReal debe salir a los 10s').toBe(true);
    expect(info.img).toContain('H4-fotoretos.png');
  });

  test('RR-3. Abrir el reto (marcarRetoPulsado) cierra el cartel, pero solo retrasa — reaparece si no se resuelve', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Debe salir primero').toBe(true);

    await page.evaluate(() => globalThis._marcarRetoPulsadoRecordatorio());
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Abrir el reto debe cerrar el cartel visible al instante').toBe(false);

    // Retrasa el próximo aviso un intervalo completo (20s) — no lo mata para siempre.
    // Margen de +2s sobre el intervalo exacto para no depender de un límite justo entre
    // ticks del setInterval (cada 2s) — solo se busca confirmar que SÍ vuelve, no medir
    // el segundo exacto en que lo hace.
    await page.clock.runFor(22000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Si el reto queda sin resolver, el aviso debe poder volver a aparecer').toBe(true);
  });

  test('RR-4. Resolver el reto de verdad (_detenerRecordatorioReto) lo apaga para siempre', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Debe salir primero').toBe(true);

    // _detenerRecordatorioReto() es exactamente lo que llama _retoColaCompletada() en el
    // punto real de resolución genuina de toda la cola de retos.
    await page.evaluate(() => globalThis._detenerRecordatorioReto());
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Debe cerrarse al instante').toBe(false);

    await page.clock.runFor(60000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));
    expect(existe, 'Tras resolver el reto de verdad NO debe volver a aparecer nunca').toBe(false);
  });
});
