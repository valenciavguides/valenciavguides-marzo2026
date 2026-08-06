/**
 * 24-camara-sigue-usuario.spec.js
 *
 * Prueba del seguimiento automático de cámara añadido a js/funciones-mapa.js: antes,
 * la cámara del mapa de aventura solo se movía con los flyTo puntuales de cambio de
 * parada/tramo — nunca seguía al usuario mientras caminaba entre esos puntos. Ahora
 * actualizarMarcadorUsuario() centra la cámara (easeTo) en cada posición GPS real,
 * salvo que el usuario haya arrastrado el mapa a mano (_registrarSeguimientoCamara)
 * o que un flyTo de cambio de parada/tramo esté en curso (estadoMapa.zoomEnCurso).
 *
 *   CAM-1  Con el seguimiento activo (estado por defecto), cada posición GPS centra
 *          la cámara.
 *   CAM-2  Un 'dragstart' CON originalEvent (gesto real del usuario) pausa el
 *          seguimiento — las siguientes posiciones GPS ya no mueven la cámara.
 *   CAM-3  Un 'dragstart' SIN originalEvent (movimiento programático, p.ej. el propio
 *          easeTo de seguimiento) no pausa nada — sigue moviéndose con el usuario.
 *   CAM-4  reactivarSeguimientoCamara() retoma el seguimiento y centra de inmediato
 *          sobre la última posición conocida, y las posiciones siguientes vuelven a
 *          mover la cámara.
 *
 * El guard de estadoMapa.zoomEnCurso (saltar el seguimiento mientras un flyTo de
 * cambio de parada/tramo está en curso) no tiene test aislado aquí — estadoMapa no
 * se expone fuera del módulo y forzar ese flag exigiría disparar el flujo completo
 * de CAMBIO_PARADA (ver 22-carteles-informativos.spec.js) solo para una comprobación
 * de una línea; queda cubierto por revisión directa del código, no por un test E2E.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('CAM — Cámara siguiendo al usuario', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis.funcionesMapa?.inicializarServicioMapa === 'function', null, { timeout: 15000 });
  });

  test('CAM-1/2/3/4. Ciclo completo: sigue, se pausa por arrastre real, ignora arrastre programático, y se reactiva', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      const listeners = {};
      const fakeMap = {
        _easeToCalls: [],
        isStyleLoaded() { return true; },
        once(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
        on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
        off(evt, fn) { if (listeners[evt]) listeners[evt] = listeners[evt].filter(f => f !== fn); },
        fire(evt, payload) { (listeners[evt] || []).slice().forEach(fn => fn(payload)); },
        addSource() { return fakeMap; },
        addLayer() { return fakeMap; },
        getSource() { return { setData() {} }; },
        getLayer() { return {}; },
        removeLayer() {}, removeSource() {}, setPaintProperty() {},
        getZoom() { return 15; },
        easeTo(opts) { fakeMap._easeToCalls.push(opts); },
      };

      const mod = await import('/js/funciones-mapa.js');
      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);

      // CAM-1: seguimiento activo por defecto
      mod.actualizarMarcadorUsuario(39.4795, -0.3758, 90, 8, 'aventura');
      const trasPrimeraPosicion = fakeMap._easeToCalls.length;

      // CAM-3: dragstart SIN originalEvent (programático) no debe pausar nada
      fakeMap.fire('dragstart', {});
      mod.actualizarMarcadorUsuario(39.4796, -0.3759, 90, 8, 'aventura');
      const trasDragstartProgramatico = fakeMap._easeToCalls.length;

      // CAM-2: dragstart CON originalEvent (gesto real) pausa el seguimiento
      fakeMap.fire('dragstart', { originalEvent: { type: 'touchstart' } });
      mod.actualizarMarcadorUsuario(39.4797, -0.3760, 90, 8, 'aventura');
      const trasDragstartReal = fakeMap._easeToCalls.length;

      // CAM-4: reactivarSeguimientoCamara() retoma Y centra de inmediato
      const antesDeReactivar = fakeMap._easeToCalls.length;
      mod.reactivarSeguimientoCamara();
      const trasReactivar = fakeMap._easeToCalls.length;
      mod.actualizarMarcadorUsuario(39.4798, -0.3761, 90, 8, 'aventura');
      const trasReactivarYNuevaPosicion = fakeMap._easeToCalls.length;

      return {
        trasPrimeraPosicion, trasDragstartProgramatico, trasDragstartReal,
        antesDeReactivar, trasReactivar, trasReactivarYNuevaPosicion,
      };
    });

    expect(resultado.trasPrimeraPosicion, 'CAM-1: la primera posición debe centrar la cámara').toBeGreaterThan(0);
    expect(resultado.trasDragstartProgramatico, 'CAM-3: dragstart sin originalEvent no debe pausar el seguimiento').toBeGreaterThan(resultado.trasPrimeraPosicion);
    expect(resultado.trasDragstartReal, 'CAM-2: tras un arrastre real, la siguiente posición NO debe mover la cámara').toBe(resultado.trasDragstartProgramatico);
    expect(resultado.trasReactivar, 'CAM-4: reactivarSeguimientoCamara() debe centrar de inmediato').toBeGreaterThan(resultado.antesDeReactivar);
    expect(resultado.trasReactivarYNuevaPosicion, 'CAM-4: tras reactivar, las siguientes posiciones vuelven a mover la cámara').toBeGreaterThan(resultado.trasReactivar);
  });
});
