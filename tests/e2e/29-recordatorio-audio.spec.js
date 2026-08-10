/**
 * 29-recordatorio-audio.spec.js
 *
 * Cartel recordatorio "pulse play" (codigo-padre.html, ver GUIA-COMPLETA §25.5b):
 * reporte de campo del usuario — caminaba sin pulsar nunca el botón de play, y como
 * nada en pantalla lo recordaba de forma insistente, la parada/tramo nunca se
 * completaba (pending.audio se queda en false para siempre) sin que la causa fuera
 * obvia. Se muestra 10s después de activarse un elemento nuevo (parada o tramo, mismo
 * criterio de tiempo — decidido con el usuario) si no se ha pulsado play, se autocierra
 * a los 7s, y reaparece cada 20s hasta que el usuario pulsa play o replay en
 * #audio-control-dropdown (los botones de play viven en el padre, nunca en hijo3).
 *
 * RA-1 ejercita el ciclo completo con page.clock (reloj simulado, sin esperas reales).
 * RA-2 confirma que reiniciar el recordatorio (nuevo elemento activado) cancela
 * cualquier timer del elemento anterior en vez de acumular temporizadores.
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

  test('RA-1. Aparece a los 10s, se autocierra a los 7s, reaparece cada 20s, y para al pulsar play', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioAudio === 'function',
      marcar: typeof globalThis._marcarPlayPulsadoRecordatorio === 'function',
      detener: typeof globalThis._detenerRecordatorioAudio === 'function',
    }));
    test.skip(!disponible.iniciar || !disponible.marcar || !disponible.detener, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());

    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'No debe aparecer antes de los 10s').toBe(false);

    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe aparecer a los 10s si no se pulsó play').toBe(true);

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
    const disponible = await page.evaluate(() => typeof globalThis._iniciarRecordatorioAudio === 'function');
    test.skip(!disponible, 'Función no disponible');

    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(5000);
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(6000);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'No debe aparecer todavía — el reinicio debe haber cancelado el timer del elemento anterior').toBe(false);

    await page.clock.runFor(4000);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe aparecer 10s después del reinicio, no 10s después del primer inicio').toBe(true);
  });
});
