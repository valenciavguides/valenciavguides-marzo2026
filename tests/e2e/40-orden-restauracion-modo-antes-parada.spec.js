/**
 * 40-orden-restauracion-modo-antes-parada.spec.js
 *
 * ejecutarRestauracionAventura() (reanudar sesión al cerrar y reabrir la PWA) aplica su
 * modo a través de _activarModoRest(), que desde la unificación de caminos delega en el
 * mismo _hdl_SISTEMA_CAMBIO_MODO que cualquier otro cambio de modo, marcando el mensaje
 * con restaurado:true (ver tests/e2e/46-reanudacion-un-solo-camino.spec.js). Lo que este
 * archivo fija es independiente de ese enrutado: el ORDEN de llamadas dentro de
 * ejecutarRestauracionAventura() importa porque _restaurarProgresoRest()
 * dispara el NAVEGACION.CAMBIO_PARADA real del elemento restaurado (_restoreBroadcast()
 * -> __triggerCambioParadaInterno() -> _hdl_NAVEGACION_CAMBIO_PARADA), y esa función
 * decide varias cosas según estado.modo?.actual === MODOS.AVENTURA: si arranca el
 * recordatorio de audio, la lógica de botón GPS en tramos, y si deshabilita btnAvanzar
 * hasta completar audio+reto.
 *
 * estado.modo.actual se aplica en un único punto de la reanudación: dentro de
 * _activarModoRest() (hoy, vía el handler único).
 *
 * _activarModoRest() ahora se llama ANTES que _restaurarProgresoRest() — con el modo
 * ya aplicado cuando se procesa el CAMBIO_PARADA restaurado, en vez de con el modo
 * aún en su valor de arranque (CASA). Como efecto secundario, el CAMBIO_MODO que
 * _activarModoRest() difunde a los hijos también llega antes que el CAMBIO_PARADA:
 * en hijo2 esto significa que _resetarEstadoParaModo() limpia el estado antes de que
 * lleguen los datos reales de la parada restaurada, en vez de después (lo que
 * borraría esos datos justo después de fijarlos).
 *
 * Verificado aislando la variable exacta que importa (estado.modo.actual en el
 * instante del CAMBIO_PARADA), sin pasar por el arranque en frío completo de la PWA
 * — más preciso y sin la fricción de temporización del arnés de test para ese
 * camino, que solo replicaría lo mismo con mucho más ruido.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const P0 = { id: 'Av1-P-0' };

test.describe('OR — Orden modo/parada en la restauración de sesión', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => typeof globalThis.__cargarDatosAventuraDiferidos === 'function' && typeof globalThis.__triggerCambioParadaInterno === 'function',
      null, { timeout: 15000 }
    ).catch(() => {});
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
      globalThis._devModeActivo = true;
      globalThis.estado.hijosInicializados = new Set(['hijo2', 'hijo3', 'hijo4']);
      // __triggerCambioParadaInterno no monta un hijo3 real que pueda confirmar la
      // recepción de AUDIO.REPRODUCIR_REQUEST (_enviarAudioRequestConReintento, §31.7) —
      // sin este stub, esos reintentos se agotarían de verdad (~2.4s) y, al no haber
      // llegado nunca ninguna confirmación real, _marcarAudioNoDisponible() apagaría el
      // recordatorio que este test está verificando, por una falsa alarma ajena a lo que
      // se prueba aquí.
      globalThis.enviarMensajeConConfirmacion = () => Promise.resolve({ exito: true });
    });
  });

  test('OR-1. Con el modo aún en CASA (valor de arranque) en el momento del CAMBIO_PARADA, el recordatorio de audio NO arranca solo', async ({ page }) => {
    const modoEnElMomento = await page.evaluate(async ({ p0 }) => {
      globalThis.estado.modo = { actual: 'casa', anterior: null };
      await globalThis.__triggerCambioParadaInterno({ paradaId: p0.id });
      return globalThis.estado.modo.actual;
    }, { p0: P0 });
    expect(modoEnElMomento).toBe('casa');

    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.waitForTimeout(11000);
    const cartel = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(cartel, 'con el modo todavía en casa cuando se procesa la parada, el recordatorio no debe arrancar solo').toBe(false);
  });

  test('OR-2. Con el modo ya en AVENTURA antes del CAMBIO_PARADA, el recordatorio de audio SÍ arranca solo — el orden correcto que aplica ejecutarRestauracionAventura() tras el arreglo', async ({ page }) => {
    const modoEnElMomento = await page.evaluate(async ({ p0 }) => {
      globalThis.estado.modo = { actual: 'aventura', anterior: 'casa' };
      await globalThis.__triggerCambioParadaInterno({ paradaId: p0.id });
      return globalThis.estado.modo.actual;
    }, { p0: P0 });
    expect(modoEnElMomento).toBe('aventura');

    await page.evaluate(() => { globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {}; globalThis.estadoPadre.gps.proximidadReal = true; });
    await page.waitForTimeout(11000);
    const cartel = await page.evaluate(() => !!document.getElementById('cartel-recordatorio-audio'));
    expect(cartel, 'con el modo ya en aventura cuando se procesa la parada, el recordatorio debe arrancar solo').toBe(true);
  });
});
