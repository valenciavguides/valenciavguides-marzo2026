/**
 * 37-guard-concurrencia-cambio-modo.spec.js
 *
 * Dos SISTEMA.CAMBIO_MODO solapados no pueden corromper el progreso congelado: el handler
 * congela `paradaRealCongelada` antes de llamar a manejarCambioModo() y lo restaura después
 * (despachando un CAMBIO_PARADA), y un segundo cambio que empezara en medio congelaría un
 * `paradaActual` todavía sin restaurar — origen real del bug de campo "parada 4 de 68" al
 * reanudar con un cambio de modo solapado.
 *
 * Lo impide la fila por tipo del bus: todo CAMBIO_MODO del padre, venga de un hijo o se lo
 * despache él mismo, se ejecuta cuando ha terminado el anterior. Por eso dos peticiones
 * solapadas se aplican las dos, en orden, y gana la última. El guard `estado.sistema.cambiandoModo`
 * del handler sigue ahí para el único caso en que la fila deja pasar a otro con uno en curso:
 * un handler que supera el plazo de la fila (PLAZO_MAX_HANDLER, js/mensajeria.js).
 *
 *   GC-1  Dos cambios solapados: los dos se aplican, en orden; gana el último; ninguno se
 *         rechaza; el guard queda libre.
 *   GC-2  Un tercer cambio, ya sin solape, funciona con normalidad.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('GC — Cambios de modo solapados', () => {
  test.beforeEach(async ({ page, context }) => {
    // Sin esto, el activarGPS()/watchPosition() real que dispara un CAMBIO_MODO a AVENTURA
    // se queda colgado para siempre en Firefox — ver 30-casa-no-fuga-aventura.spec.js
    // (CM-6) y la memoria feedback_e2e_geolocation_firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('GC-1. Dos cambios de modo solapados se aplican en orden y gana el último', async ({ page }) => {
    test.setTimeout(120_000);
    const disponible = await page.evaluate(() => globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true);
    test.skip(!disponible, 'sin handler de SISTEMA.CAMBIO_MODO en este entorno');

    const resultado = await page.evaluate(async () => {
      globalThis._devModeActivo = true;
      // Dos peticiones SIN esperar la primera -- exactamente la carrera real
      const p1 = globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } });
      const p2 = globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'casa' } });
      const [r1, r2] = await Promise.all([p1, p2]);
      return {
        r1: { exito: r1?.exito, error: r1?.error },
        r2: { exito: r2?.exito, error: r2?.error },
        modoFinal: globalThis.estado?.modo?.actual,
        guardTrasAmbas: globalThis.estado?.sistema?.cambiandoModo,
      };
    });

    expect(resultado.r1, 'el primero se aplica').toMatchObject({ exito: true });
    expect(resultado.r2, 'el segundo también: espera su turno, no se rechaza').toMatchObject({ exito: true });
    expect(resultado.modoFinal, 'gana el último pedido').toBe('casa');
    expect(resultado.guardTrasAmbas, 'el guard queda liberado (false), nunca atascado en true').toBe(false);
  });

  test('GC-2. Tras dos solapados, un tercer cambio de modo (ya sin solape) funciona con normalidad', async ({ page }) => {
    // En WebKit, sin iframes hijo reales presentes, la tercera llamada puede encontrar
    // la activación de GPS de la llamada anterior "ya en progreso" (de-dup pre-existente
    // en activarGPS()) y esperar en cadena varios timeouts internos de 15s
    // (notificarCambioModoInminente, actualizarInterfazModo, notificarCambioModoCompletado)
    // antes de resolver — diagnosticado con logs en vivo, resuelve correctamente pero puede
    // superar el timeout por defecto de 60s en este motor.
    test.setTimeout(180_000);
    const disponible = await page.evaluate(() => globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true);
    test.skip(!disponible, 'sin handler de SISTEMA.CAMBIO_MODO en este entorno');

    await page.evaluate(async () => {
      globalThis._devModeActivo = true;
      const p1 = globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } });
      const p2 = globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'casa' } });
      await Promise.all([p1, p2]);
    });

    const r3 = await page.evaluate(async () => {
      return globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } });
    });
    expect(r3.exito, 'sin solape, el guard no debe bloquear un cambio de modo normal').toBe(true);
  });
});
