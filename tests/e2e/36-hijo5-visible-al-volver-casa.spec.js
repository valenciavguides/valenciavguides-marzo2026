/**
 * 36-hijo5-visible-al-volver-casa.spec.js
 *
 * hijo5 (boton-casa-hijo5.html, herramienta de solo-desarrollo — ver
 * project_hijo5_devonly) debe volver a mostrarse al pasar de AVENTURA a CASA en
 * caliente. Antes (hasta 2026-08-16) solo se reaparecía al reanudar sesión guardada
 * en modo CASA (commit 3f06717) y en el arranque con Factor-2 dev-code-entry, pero NO
 * en el cambio de modo AVENTURA->CASA en caliente durante la misma sesión — el mismo
 * gap, con causa distinta. Usa globalThis._vv_triggerCambioModo(), el disparador
 * directo real de _hdl_SISTEMA_CAMBIO_MODO (mismo que usa Script 2 para Factor 2 /
 * AVENTURA_ACTIVADA).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('HV — hijo5 visible al volver a CASA', () => {
  test.beforeEach(async ({ page, context }) => {
    // Sin esto, el activarGPS()/watchPosition() real que dispara _vv_triggerCambioModo
    // se queda colgado para siempre en Firefox — ver 30-casa-no-fuga-aventura.spec.js
    // (CM-6) y la memoria feedback_e2e_geolocation_firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('HV-1. devModeActivo=true, AVENTURA->CASA en caliente -> hijo5 vuelve a mostrarse', async ({ page }) => {
    const disponible = await page.evaluate(() => typeof globalThis._vv_triggerCambioModo === 'function');
    test.skip(!disponible, '_vv_triggerCambioModo no disponible en este entorno');

    await page.evaluate(() => { globalThis._devModeActivo = true; });

    // Primero AVENTURA (oculta hijo5 -- ya sabemos que esa parte siempre funcionó)
    await page.evaluate(() => globalThis._vv_triggerCambioModo('aventura'));
    await page.waitForTimeout(500);
    const display1 = await page.evaluate(() => document.getElementById('hijo5')?.style.display);

    // Ahora CASA en caliente -- el caso que fallaba
    await page.evaluate(() => globalThis._vv_triggerCambioModo('casa'));
    await page.waitForTimeout(500);
    const display2 = await page.evaluate(() => document.getElementById('hijo5')?.style.display);

    expect(display1, 'Al entrar en AVENTURA, hijo5 debe ocultarse').toBe('none');
    expect(display2, 'Al volver a CASA en caliente, hijo5 debe volver a mostrarse').toBe('block');
  });
});
