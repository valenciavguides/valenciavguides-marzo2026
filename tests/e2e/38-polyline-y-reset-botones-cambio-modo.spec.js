/**
 * 38-polyline-y-reset-botones-cambio-modo.spec.js
 *
 * Dos limpiezas al cambiar de modo (2026-08-17), ambas parte del mismo barrido de
 * _hdl_SISTEMA_CAMBIO_MODO / _resetarEstadoParaModo:
 *   A) La polyline manual del botón ubicación (funcionesMapa.dibujarPolylineNavegacion)
 *      debe limpiarse al entrar en CASA — antes podía quedar dibujada de una sesión de
 *      AVENTURA anterior.
 *   B) coordenadas-hijo2.html: idParadaActual/btnAvanzarCompletadoPorPadre y el resto
 *      de estado de progreso deben resetear al volver a CASA, aunque avanzar hubiera
 *      quedado genuinamente habilitado en AVENTURA (parada completada) — antes
 *      _resetarEstadoParaModo() no tocaba estas propiedades, así que un cambio de modo
 *      podía dejar avanzar habilitado sin que el usuario hubiera completado nada en la
 *      nueva sesión.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, abrirHijoEnMarco, enviarAlHijo, recibidosPorElMarco } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const TRAMO = { id: 'Av1-TR-1', inicio: { lat: 39.478760, lng: -0.376260 } };

test.describe('PB-A — Polyline manual se limpia al cambiar a CASA', () => {
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

  test('PB-1. limpiarPolylineNavegacion() se llama al entrar en CASA', async ({ page }) => {
    const disponible = await page.evaluate(() => globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true);
    test.skip(!disponible, 'sin handler de SISTEMA.CAMBIO_MODO en este entorno');

    await page.evaluate(async ({ inicio }) => {
      globalThis._devModeActivo = true;
      await globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } });
      const mod = await import('/js/funciones-mapa.js');
      mod.dibujarPolylineNavegacion({ origen: { lat: inicio.lat + 0.001, lng: inicio.lng + 0.001 }, destino: inicio });
      globalThis.__e2e_limpiarPolylineLlamada = false;
      const original = globalThis.funcionesMapa.limpiarPolylineNavegacion;
      globalThis.funcionesMapa.limpiarPolylineNavegacion = function (...args) {
        globalThis.__e2e_limpiarPolylineLlamada = true;
        return original.apply(this, args);
      };
    }, { inicio: TRAMO.inicio });

    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'casa' } }));
    await page.waitForTimeout(500);

    const llamada = await page.evaluate(() => globalThis.__e2e_limpiarPolylineLlamada);
    expect(llamada, 'limpiarPolylineNavegacion() debe llamarse al entrar en CASA').toBe(true);
  });
});

// hijo2 se abre DENTRO de helpers/marco-vacio.html, que le hace de padre: un hijo suelto, sin
// padre, no envía ni recibe por el camino real (ver abrirHijoEnMarco en helpers/boot.js), y el
// pipeline real de AVENTURA del padre sustituiría el iframe #hijo2 que el test controla.
test.describe('PB-B — Reset de idParadaActual/botones en hijo2 al cambiar de modo', () => {
  const enviarAHijo2 = (page, tipo, datos) => enviarAlHijo(page, { tipo, origen: 'padre', destino: 'hijo2', datos: { ...datos, timestamp: Date.now() } });

  test('PB-2. Con avanzar realmente habilitado en AVENTURA (parada completada), CAMBIO_MODO->casa lo deshabilita y al volver a AVENTURA sin completar nada no se rehabilita solo', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'coordenadas-hijo2.html');
    const avanzarDeshabilitado = () => hijo.evaluate(() => document.getElementById('btn-avanzar')?.disabled);
    // hijo2 manda CAMBIO_MODO_EFECTUADO después de resetear su estado: esperarlo asegura que el reseteo ya corrió
    const efectuados = async () => (await recibidosPorElMarco(page)).filter((m) => m.tipo === 'SISTEMA.CAMBIO_MODO_EFECTUADO').length;
    const cambiarModo = async (modo) => {
      const antes = await efectuados();
      await enviarAHijo2(page, 'SISTEMA.CAMBIO_MODO', { modo });
      await expect.poll(efectuados, { message: `hijo2 debe aplicar el cambio a ${modo}` }).toBe(antes + 1);
    };

    // 1. Entrar en AVENTURA de verdad primero (en CASA, _actualizarBotonGps fuerza
    //    avanzar deshabilitado sin mirar nada más — hace falta AVENTURA para que el
    //    escenario "sucio" (parada completada) sea real).
    await cambiarModo('aventura');
    await enviarAHijo2(page, 'NAVEGACION.ACTUALIZAR_ESTADO', {
      idParada: 'Av1-TR-1', tipoParada: 'tramo', distanciaAlDestino: 5, toleranciaGPS: 50,
    });
    // 2. Habilitar avanzar de verdad (mismo mensaje real que envía marcarParadaCompletada()
    //    al confirmar audio+llegada+reto — btnAvanzarCompletadoPorPadre=true).
    await enviarAHijo2(page, 'CONTROL.HABILITAR', { control: 'btnAvanzar', razon: 'parada_completada' });
    await expect.poll(avanzarDeshabilitado, {
      message: 'Precondición: avanzar debe estar genuinamente habilitado antes de cambiar de modo',
    }).toBe(false);

    // 3. Cambiar a CASA sin seleccionar nada — el escenario real del bug.
    await cambiarModo('casa');
    expect(await avanzarDeshabilitado(), 'Tras volver a CASA, avanzar debe quedar deshabilitado pese a haber estado habilitado de verdad en AVENTURA').toBe(true);

    // 4. Volver a AVENTURA sin elegir ni completar nada: avanzar no hereda el "completado" de la
    //    sesión anterior. Este tramo es el que detecta un reseteo ausente (en CASA avanzar queda
    //    deshabilitado de todos modos, así que el paso 3 solo no lo prueba).
    await cambiarModo('aventura');
    expect(await avanzarDeshabilitado(), 'Al volver a AVENTURA sin completar nada, avanzar no puede rehabilitarse solo con el estado de la sesión anterior').toBe(true);
  });
});
