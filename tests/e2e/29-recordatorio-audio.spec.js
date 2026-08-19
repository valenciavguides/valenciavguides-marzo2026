/**
 * 29-recordatorio-audio.spec.js
 *
 * Cartel recordatorio "pulse play" (codigo-padre.html, ver GUIA-COMPLETA §25.5c):
 * reporte de campo del usuario — caminaba sin pulsar nunca el botón de play, y como
 * nada en pantalla lo recordaba de forma insistente, la parada/tramo nunca se
 * completaba (pending.audio se queda en false para siempre) sin que la causa fuera
 * obvia. Se muestra solo cuando se cumplen DOS condiciones a la vez: han pasado 10s
 * desde que se activó el elemento actual, Y el GPS confirmó proximidad real
 * (estado.gps.proximidadReal === true, ver §25.5c — antes era gps.visualActivo,
 * cambiado 2026-08-17 porque visualActivo reflejaba el círculo dibujado en el mapa,
 * no la confirmación real de distancia). Si no se ha pulsado play, se autocierra a
 * los 7s, y reaparece cada 20s (mientras ambas condiciones sigan cumplidas) hasta
 * que el usuario pulsa play/replay en #audio-control-dropdown (los botones de play
 * viven en el padre, nunca en hijo3), O hasta que el audio termina de verdad
 * (AUDIO.FIN_REPRODUCCION real).
 *
 * Comportamiento del botón play — cambiado 2026-08-17: pulsar play solo cierra el
 * cartel visible en ese instante (`_marcarPlayPulsadoRecordatorio`); YA NO apaga el
 * recordatorio para siempre. Si el audio se interrumpe/nunca termina de verdad, el
 * aviso puede volver a aparecer. El apagado PERMANENTE solo ocurre en el punto real
 * de fin de audio (`_detenerRecordatorioAudio`, llamado desde el handler real de
 * AUDIO.FIN_REPRODUCCION) — antes ambos casos apagaban para siempre, lo cual ocultaba
 * el aviso incluso cuando el audio se había interrumpido sin terminar.
 *
 * RA-1 ejercita el ciclo completo con page.clock (reloj simulado, sin esperas reales),
 * incluida la comprobación de que el tiempo solo no basta sin proximidad GPS real, y
 * que pulsar play cierra el cartel sin apagarlo para siempre.
 * RA-2 confirma que reiniciar el recordatorio (nuevo elemento activado) cancela
 * cualquier timer del elemento anterior en vez de acumular temporizadores.
 * RA-3 confirma el caso simétrico: la proximidad GPS real sola no basta antes de los 10s.
 * RA-4 confirma que el fin de audio genuino (_detenerRecordatorioAudio) sí apaga el
 * recordatorio para siempre, a diferencia de pulsar play.
 * RA-5/RA-6 confirman que la comparación usa el id de audio del elemento ACTIVO real
 * (estado.elementoActual.audio_id vía obtenerAudioIdActivoPadre()), no un id de
 * audioActual que pueda haber quedado de otro elemento (p.ej. reproducido en CASA sin
 * pausar antes de volver a AVENTURA).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('RA — Recordatorio periódico de pulsar play', () => {
  test.beforeEach(async ({ page, context }) => {
    // Sin esto, el activarGPS()/watchPosition() real que dispara el arranque de FASE 3
    // se queda colgado para siempre en Firefox (nunca invoca ni éxito ni error) — ver
    // el fix idéntico y su diagnóstico completo en 30-casa-no-fuga-aventura.spec.js
    // (CM-6) y la memoria feedback_e2e_geolocation_firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    // Sin este stub, retryUntilAvailable() esperando MapLibre real corre sobre el mismo
    // reloj simulado que este archivo avanza a mano (algunos tests hasta 60s) — cruzar
    // los 15s reales de esa espera dispara _avisarFalloCargaAppUnaVez() (alert() real) a
    // mitad de test. No rompía ninguna aserción de este archivo en la práctica (regresión
    // real confirmada en el espejo de este test, RR-3 de 34-recordatorio-reto.spec.js,
    // 2026-08-19), pero es el mismo riesgo latente — se cierra aquí también.
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
        && typeof globalThis._marcarPlayPulsadoRecordatorio === 'function'
        && typeof globalThis._detenerRecordatorioAudio === 'function',
      null, { timeout: 15_000 }
    ).catch(() => {});
  });

  test('RA-1. No aparece solo por tiempo (sin proximidad GPS real); aparece cuando se cumplen ambas, se autocierra a los 7s, reaparece cada 20s, y pulsar play solo lo cierra (no lo apaga para siempre)', async ({ page }) => {
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
    expect(existe, 'A los 10s sin proximidad GPS real todavía NO debe aparecer — el tiempo solo no basta').toBe(false);

    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.clock.runFor(2000); // siguiente tick del chequeo (cada 2s) tras confirmarse la proximidad
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe aparecer en cuanto se cumplen tiempo Y proximidad real a la vez').toBe(true);

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

    await page.clock.runFor(20000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Pulsar play NO apaga el recordatorio para siempre — si el audio no ha terminado de verdad, debe poder reaparecer').toBe(true);
  });

  test('RA-2. Reiniciar el recordatorio (nuevo elemento) cancela el timer anterior en vez de acumularlo', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioAudio === 'function',
      estadoPadre: typeof globalThis.estadoPadre === 'object' && globalThis.estadoPadre !== null,
    }));
    test.skip(!disponible.iniciar || !disponible.estadoPadre, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    // Proximidad GPS real ya confirmada desde el principio — este test se centra en el
    // reinicio del timer de tiempo, no en la condición de proximidad (ver RA-1/RA-3).
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });

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

  test('RA-3. No aparece solo por proximidad GPS real (sin llegar a los 10s), caso simétrico a RA-1', async ({ page }) => {
    const disponible = await page.evaluate(() => ({
      iniciar: typeof globalThis._iniciarRecordatorioAudio === 'function',
      estadoPadre: typeof globalThis.estadoPadre === 'object' && globalThis.estadoPadre !== null,
    }));
    test.skip(!disponible.iniciar || !disponible.estadoPadre, `Precondición no disponible: ${JSON.stringify(disponible)}`);

    // Proximidad real confirmada DESDE el inicio (antes incluso de activar el elemento)
    // — si el criterio de tiempo no se aplicara de verdad, el cartel aparecería en el
    // primer chequeo (a los 2s) en vez de esperar a los 10s.
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());

    await page.clock.runFor(8000);
    await page.waitForTimeout(50);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'A los 8s con proximidad real ya activa todavía NO debe aparecer — faltan los 10s').toBe(false);

    await page.clock.runFor(2000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'A los 10s con proximidad real ya activa debe aparecer').toBe(true);
  });

  test('RA-4. Fin de audio genuino (_detenerRecordatorioAudio) sí apaga el recordatorio para siempre, a diferencia de pulsar play', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    let existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe salir primero').toBe(true);

    // _detenerRecordatorioAudio() es exactamente lo que llama el handler real de fin de
    // audio genuino (AUDIO.FIN_REPRODUCCION) — lo llamamos directamente para simular ese
    // punto exacto sin tener que montar todo el pipeline de mensajería de audio.
    await page.evaluate(() => globalThis._detenerRecordatorioAudio());
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Debe cerrarse al instante').toBe(false);

    await page.clock.runFor(60000);
    await page.waitForTimeout(50);
    existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Tras el fin de audio genuino NO debe volver a aparecer nunca').toBe(false);
  });

  test('RA-5. El id de audio de OTRO elemento (colgado de audioActual) no bloquea el recordatorio del elemento activo real', async ({ page }) => {
    // obtenerAudioIdActivoPadre() prioriza estado.elementoActual.audio_id — lo fijamos a
    // un id real distinto del que trae audioActual (que quedaría "colgado" de un audio de
    // otro elemento, p.ej. reproducido en CASA sin pausar antes de volver a AVENTURA).
    await page.evaluate(() => {
      globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {};
      globalThis.estadoPadre.gps.proximidadReal = true;
      globalThis.estadoPadre.elementoActual = { audio_id: 'audio-ELEMENTO-REAL' };
      globalThis.estadoPadre.audioActual = { id: 'audio-OTRO-ELEMENTO-VIEJO', estado: 'reproduciendo' };
    });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    const existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'El id de audio de OTRO elemento no debe bloquear el recordatorio del elemento activo real').toBe(true);
  });

  test('RA-6. El id de audio del MISMO elemento activo, reproduciendo de verdad, sí bloquea el recordatorio', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {};
      globalThis.estadoPadre.gps.proximidadReal = true;
      globalThis.estadoPadre.elementoActual = { audio_id: 'audio-ELEMENTO-REAL' };
      globalThis.estadoPadre.audioActual = { id: 'audio-ELEMENTO-REAL', estado: 'reproduciendo' };
    });
    await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
    await page.clock.runFor(10000);
    await page.waitForTimeout(50);
    const existe = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(existe, 'Si el mismo elemento está reproduciendo de verdad, no debe salir el recordatorio').toBe(false);
  });
});
