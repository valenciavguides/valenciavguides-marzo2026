/**
 * 35-guardian-anti-solape-carteles.spec.js
 *
 * Guardián anti-solape entre los 7 carteles de codigo-padre.html (transición,
 * inicio-tramo, llegada-parada, bienvenida-tramo, bienvenida-parada,
 * recordatorio-audio, recordatorio-reto) — añadido 2026-08-17. Los 5 carteles de
 * "algo acaba de pasar" (uso único) siempre ganan: se muestran quitando cualquier
 * otro cartel que hubiera en pantalla. Los 2 recordatorios (periódicos) respetan a
 * cualquier otro cartel: si hay uno en pantalla, esperan al siguiente chequeo antes
 * de mostrarse.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

test.describe('GS — Guardián anti-solape entre carteles', () => {
  test.beforeEach(async ({ page }) => {
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.clock.install();
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
    // WebKit puede tardar más que gotoAndWaitForFase1 en exponer las funciones de
    // Script 2 en globalThis — esperar explícitamente evita un TypeError de carrera
    // ("... is not a function") en vez de asumir que ya están listas.
    await page.waitForFunction(
      () => typeof globalThis._iniciarRecordatorioAudio === 'function'
        && typeof globalThis.mostrarCartelTransicion === 'function'
        && typeof globalThis.mostrarCartelLlegadaParada === 'function',
      null, { timeout: 15_000 }
    ).catch(() => {});
  });

  // NOTA: el cartel de transición se muestra a los 9s (no en t=0) para que su propio
  // autocierre (10s desde que se muestra = t=19s) no coincida con el umbral de tiempo
  // del recordatorio (t=10s) — coincidir ambos temporizadores crea una carrera ambigua
  // ajena al guardián que se quiere probar aquí.
  test('GS-1. Con un cartel de "algo acaba de pasar" en pantalla, el recordatorio espera y no aparece a la vez', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {};
      globalThis.estadoPadre.gps.proximidadReal = true;
    });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(9000);
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await page.waitForTimeout(50);

    await page.clock.runFor(1000); // llega a t=10s: el recordatorio ya cumple tiempo+proximidad
    await page.waitForTimeout(50);

    const info = await page.evaluate(() => ({
      transicion: !!document.getElementById('cartel-transicion'),
      recordatorio: !!document.getElementById('cartel-recordatorio-audio'),
    }));
    expect(info.transicion, 'El cartel de transición debe seguir visible (autocierra en t=19s)').toBe(true);
    expect(info.recordatorio, 'El recordatorio NO debe aparecer mientras el otro cartel sigue en pantalla').toBe(false);
  });

  test('GS-2. En cuanto el cartel de transición se cierra, el recordatorio aparece en <=2s', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {};
      globalThis.estadoPadre.gps.proximidadReal = true;
    });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(9000);
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await page.clock.runFor(1000); // t=10s
    await page.waitForTimeout(50);
    let existeRecordatorio = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existeRecordatorio, 'Todavía no debe aparecer, el de transición sigue ahí').toBe(false);

    // Cerrar el cartel de transición a mano (en vez de esperar 9s más a su autocierre real)
    await page.evaluate(() => document.getElementById('cartel-transicion')?.remove());
    await page.clock.runFor(2000); // siguiente tick del recordatorio (cada 2s)
    await page.waitForTimeout(50);

    existeRecordatorio = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existeRecordatorio, 'El recordatorio debe aparecer en cuanto el hueco queda libre').toBe(true);
  });

  test('GS-3. Si el recordatorio ya está en pantalla, un cartel de "algo acaba de pasar" lo cierra y se muestra él (gana siempre)', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {};
      globalThis.estadoPadre.gps.proximidadReal = true;
    });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    let existeRecordatorio = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existeRecordatorio, 'El recordatorio debe estar visible primero').toBe(true);

    await page.evaluate(() => {
      globalThis.mostrarCartelLlegadaParada('Plaza de la Virgen');
    });
    await page.waitForTimeout(100);

    const info = await page.evaluate(() => ({
      recordatorio: !!document.getElementById('cartel-recordatorio-audio'),
      llegada: !!document.getElementById('cartel-llegada-parada'),
    }));
    expect(info.recordatorio, 'El de "algo acaba de pasar" debe cerrar el recordatorio').toBe(false);
    expect(info.llegada, 'Y mostrarse él mismo').toBe(true);
  });
});
