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
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('GS — Guardián anti-solape entre carteles', () => {
  test.beforeEach(async ({ page }) => {
    // Sin este stub, retryUntilAvailable() esperando MapLibre real corre sobre el mismo
    // reloj simulado que este archivo avanza a mano — cruzar los 15s reales de esa espera
    // dispara _avisarFalloCargaAppUnaVez() (alert() real) a mitad de test y desincroniza
    // los timers bajo prueba (regresión real confirmada en el espejo de este archivo, RR-3
    // de 34-recordatorio-reto.spec.js, 2026-08-19).
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

test.describe('AP — Aviso de progreso no guardado (persistProgressState → cartel-aviso-progreso, 9º miembro de la familia)', () => {
  test.beforeEach(async ({ page }) => {
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.clock.install();
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
    await page.waitForFunction(
      () => typeof globalThis.persistProgressState === 'function'
        && typeof globalThis.mostrarCartelTransicion === 'function',
      null, { timeout: 15_000 }
    ).catch(() => {});
    await page.evaluate(() => {
      globalThis.estadoPadre.modo = { actual: 'aventura' };
      globalThis.estadoPadre._avisoPersistenciaMostrado = false;
      const original = Storage.prototype.setItem;
      globalThis.__origSetItem = original;
      Storage.prototype.setItem = function (k, v) {
        if (k === 'vv_progreso') throw new Error('QuotaExceededError simulado');
        return original.call(this, k, v);
      };
    });
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => { if (globalThis.__origSetItem) Storage.prototype.setItem = globalThis.__origSetItem; });
  });

  test('AP-1. localStorage.setItem falla en AVENTURA: aparece el cartel con el mensaje correcto, una sola vez por sesión', async ({ page }) => {
    await page.evaluate(() => globalThis.persistProgressState());
    await page.waitForTimeout(100);

    const texto = await page.evaluate(() => document.getElementById('cartel-aviso-progreso')?.textContent || '');
    expect(texto).toContain('No se ha podido guardar tu progreso en este dispositivo');

    // Guard de una sola vez por sesión (estado._avisoPersistenciaMostrado): cerrado el
    // cartel, una segunda llamada de persistProgressState() no debe reabrirlo.
    await page.evaluate(() => document.getElementById('cartel-aviso-progreso')?.remove());
    await page.evaluate(() => globalThis.persistProgressState());
    await page.waitForTimeout(100);
    const reaparecio = await page.evaluate(() => !!document.getElementById('cartel-aviso-progreso'));
    expect(reaparecio, 'No debe volver a mostrarse en la misma sesión').toBe(false);
  });

  test('AP-2. Si un cartel de "algo acaba de pasar" ya está en pantalla, el aviso espera (no lo cierra) y aparece en cuanto queda libre', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida');
    });
    await page.waitForTimeout(50);

    await page.evaluate(() => globalThis.persistProgressState());
    await page.waitForTimeout(100);

    let info = await page.evaluate(() => ({
      transicion: !!document.getElementById('cartel-transicion'),
      aviso: !!document.getElementById('cartel-aviso-progreso'),
    }));
    expect(info.transicion, 'El cartel de transición sigue visible, el aviso no debe cerrarlo').toBe(true);
    expect(info.aviso, 'El aviso de progreso no debe forzar su aparición mientras el otro cartel está en pantalla').toBe(false);

    await page.evaluate(() => document.getElementById('cartel-transicion')?.remove());
    await page.clock.runFor(3000); // primer reintento del aviso (cada 3s, ver MAX_INTENTOS_AVISO_PROGRESO)
    await page.waitForTimeout(50);

    info = await page.evaluate(() => ({ aviso: !!document.getElementById('cartel-aviso-progreso') }));
    expect(info.aviso, 'El aviso debe aparecer en cuanto el hueco queda libre, sin perderse').toBe(true);
  });
});
