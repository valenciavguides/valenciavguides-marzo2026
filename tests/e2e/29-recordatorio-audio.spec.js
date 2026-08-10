/**
 * 29-recordatorio-audio.spec.js
 *
 * Cartel recordatorio "pulse play" (codigo-padre.html, ver GUIA-COMPLETA §25.5c):
 * reporte de campo del usuario — caminaba sin pulsar nunca el botón de play, y como
 * nada en pantalla lo recordaba de forma insistente, la parada/tramo nunca se
 * completaba (pending.audio se queda en false para siempre) sin que la causa fuera
 * obvia. Se muestra solo cuando se cumplen DOS condiciones a la vez: han pasado 10s
 * desde que se activó el elemento actual, Y el GPS confirmó proximidad real
 * (estado.gps.visualActivo === true). Si no se ha pulsado play, se autocierra a los
 * 7s, y reaparece cada 20s (mientras ambas condiciones sigan cumplidas) hasta que el
 * usuario pulsa play o replay en #audio-control-dropdown (los botones de play viven
 * en el padre, nunca en hijo3).
 *
 * RA-1 ejercita el ciclo completo con page.clock (reloj simulado, sin esperas reales),
 * incluida la comprobación de que el tiempo solo no basta sin proximidad GPS.
 * RA-2 confirma que reiniciar el recordatorio (nuevo elemento activado) cancela
 * cualquier timer del elemento anterior en vez de acumular temporizadores.
 * RA-3 confirma el caso simétrico: la proximidad GPS sola no basta antes de los 10s.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

test.describe('RA — Recordatorio periódico de pulsar play', () => {
  test.beforeEach(async ({ page }) => {
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.clock.install();
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
  });

  test('RA-1. No aparece solo por tiempo (sin proximidad GPS); aparece cuando se cumplen ambas, se autocierra a los 7s, reaparece cada 20s, y para al pulsar play', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioAudio === 'function',
      marcar: typeof globalThis._marcarPlayPulsadoRecordatorio === 'function',
      detener: typeof globalThis._detenerRecordatorioAudio === 'function',
      estadoPadre: typeof globalThis.estadoPadre === 'object' && globalThis.estadoPadre !== null,
    }));
    test.skip(!disponible.iniciar || !disponible.marcar || !disponible.detener || !disponible.estadoPadre, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());

    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'No debe aparecer antes de los 10s').toBe(false);

    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'A los 10s sin proximidad GPS todavía NO debe aparecer — el tiempo solo no basta').toBe(false);

    await page.evaluate(() => { globalThis.estadoPadre.gps.visualActivo = true; });
    await page.clock.runFor(2000); // siguiente tick del chequeo (cada 2s) tras confirmarse la proximidad
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe aparecer en cuanto se cumplen tiempo Y proximidad a la vez').toBe(true);

    await page.clock.runFor(7000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe autocerrarse a los 7s de mostrarse').toBe(false);

    await page.clock.runFor(13000); // completa el intervalo de 20s desde que se mostró
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe reaparecer al completarse el intervalo de 20s').toBe(true);

    await page.evaluate(() => globalThis._marcarPlayPulsadoRecordatorio());
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Al pulsar play debe cerrarse de inmediato si estaba visible').toBe(false);

    await page.clock.runFor(60000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Tras pulsar play no debe reaparecer nunca más para este elemento').toBe(false);
  });

  test('RA-2. Reiniciar el recordatorio (nuevo elemento) cancela el timer anterior en vez de acumularlo', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioAudio === 'function',
      estadoPadre: typeof globalThis.estadoPadre === 'object' && globalThis.estadoPadre !== null,
    }));
    test.skip(!disponible.iniciar || !disponible.estadoPadre, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    // Proximidad GPS ya confirmada desde el principio — este test se centra en el
    // reinicio del timer de tiempo, no en la condición de proximidad (ver RA-1/RA-3).
    await page.evaluate(() => { globalThis.estadoPadre.gps.visualActivo = true; });

    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(5000);
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(6000);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'No debe aparecer todavía — el reinicio debe haber cancelado el timer del elemento anterior').toBe(false);

    await page.clock.runFor(4000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe aparecer 10s después del reinicio, no 10s después del primer inicio').toBe(true);
  });

  test('RA-3. No aparece solo por proximidad GPS (sin llegar a los 10s), caso simétrico a RA-1', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioAudio === 'function',
      estadoPadre: typeof globalThis.estadoPadre === 'object' && globalThis.estadoPadre !== null,
    }));
    test.skip(!disponible.iniciar || !disponible.estadoPadre, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    // Proximidad confirmada DESDE el inicio (antes incluso de activar el elemento) —
    // si el criterio de tiempo no se aplicara de verdad, el cartel aparecería en el
    // primer chequeo (a los 2s) en vez de esperar a los 10s.
    await page.evaluate(() => { globalThis.estadoPadre.gps.visualActivo = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());

    await page.clock.runFor(8000);
    await page.waitForTimeout(50);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'A los 8s con proximidad ya activa todavía NO debe aparecer — faltan los 10s').toBe(false);

    await page.clock.runFor(2000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'A los 10s con proximidad ya activa debe aparecer').toBe(true);
  });
});
