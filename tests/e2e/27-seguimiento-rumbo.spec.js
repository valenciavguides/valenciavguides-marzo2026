/**
 * 27-seguimiento-rumbo.spec.js
 *
 * Prueba del seguimiento de rumbo (js/funciones-mapa.js): el "modo Seguir mi rumbo"
 * del menú de #brujula-modo (ver 25-brujula-modo.spec.js para el propio botón)
 * hace que el mapa rote para mantener siempre el rumbo del usuario "hacia arriba" en
 * pantalla, como la navegación de coche — construido sobre la corrección de bearing
 * de RB-1 (17-flecha-brujula-continuidad.spec.js). activarSeguimientoRumbo() y
 * desactivarSeguimientoRumbo() son las dos funciones exportadas que activan/desactivan
 * el modo; el propio giro del mapa ocurre dentro de actualizarRotacionFlechaGPS()
 * (misma función que ya escribe el CSS transform de la flecha, a ~10Hz con throttle),
 * vía map.setBearing() sin animación — no easeTo(), para no añadir una segunda capa de
 * suavizado encima del ya existente en el ángulo acumulado.
 *
 *   SR-1  Con el modo desactivado (estado por defecto), una lectura de brújula NO
 *         mueve el bearing del mapa.
 *   SR-2  activarSeguimientoRumbo() gira el mapa de inmediato al último rumbo
 *         conocido (easeTo), y a partir de ahí cada lectura de brújula sí mueve el
 *         bearing (setBearing).
 *   SR-3  desactivarSeguimientoRumbo() fija el mapa a norte (bearing 0) de inmediato
 *         (easeTo), y a partir de ahí las lecturas de brújula dejan de mover el
 *         bearing otra vez.
 *
 * El pausado del modo por gesto manual de rotación (evento 'rotatestart' con
 * originalEvent, _registrarSeguimientoRumbo()) no tiene test aislado aquí — es el
 * mismo mecanismo, campo por campo, que 'dragstart'/_registrarSeguimientoCamara() ya
 * cubierto por CAM-2/CAM-3 en 24-camara-sigue-usuario.spec.js; se verifica por
 * revisión directa del código en vez de duplicar ese mismo test para un segundo evento.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('SR — Seguimiento de rumbo (el mapa rota con la brújula)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis.funcionesMapa?.activarSeguimientoRumbo === 'function', null, { timeout: 15000 });
  });

  test('SR-1/2/3. Activar/desactivar el modo controla si la brújula mueve el bearing del mapa', async ({ page }) => {
    await page.evaluate(async () => {
      const fakeMap = {
        _bearing: 0,
        _setBearingCalls: [],
        _easeToCalls: [],
        isStyleLoaded() { return true; },
        once() {}, on() {}, off() {}, fire() {},
        addSource() { return fakeMap; },
        addLayer() { return fakeMap; },
        getSource() { return { setData() {} }; },
        getLayer() { return {}; },
        removeLayer() {}, removeSource() {}, setPaintProperty() {},
        getZoom() { return 15; },
        getBearing() { return fakeMap._bearing; },
        setBearing(b) { fakeMap._bearing = b; fakeMap._setBearingCalls.push(b); },
        easeTo(opts) { fakeMap._easeToCalls.push(opts); if (typeof opts.bearing === 'number') fakeMap._bearing = opts.bearing; },
      };
      globalThis.__testFakeMap = fakeMap;

      const mod = await import('/js/funciones-mapa.js');
      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);
      // Crea el marcador — esto activa la brújula internamente, igual que en producción
      // la primera vez que el modo no es 'casa' (ver FB-1 en 17-flecha-brujula-continuidad).
      globalThis.__testMarker = await mod.actualizarMarcadorUsuario(39.4790, -0.3760, 0, 5, 'aventura');
    });

    // SR-1: modo desactivado por defecto — una lectura de brújula (rumbo=90, primera
    // lectura, sin suavizar) no debe llamar a setBearing().
    await page.evaluate(() => {
      const nombreEvento = ('ondeviceorientationabsolute' in globalThis) ? 'deviceorientationabsolute' : 'deviceorientation';
      const ev = document.createEvent('Event');
      ev.initEvent(nombreEvento, true, true);
      ev.alpha = 270; // rumbo = 360-alpha = 90
      globalThis.dispatchEvent(ev);
    });
    const trasPrimeraLectura = await page.evaluate(() => globalThis.__testFakeMap._setBearingCalls.length);
    expect(trasPrimeraLectura, 'SR-1: con el modo desactivado, la brújula no debe mover el bearing del mapa').toBe(0);

    // SR-2: activarSeguimientoRumbo() gira de inmediato (easeTo) al último rumbo conocido (90)...
    await page.waitForTimeout(150); // deja pasar el throttle de ~10Hz antes del siguiente evento
    const trasActivar = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const easeToAntes = globalThis.__testFakeMap._easeToCalls.length;
      mod.activarSeguimientoRumbo();
      const easeToCall = globalThis.__testFakeMap._easeToCalls[globalThis.__testFakeMap._easeToCalls.length - 1];
      return { huboEaseTo: globalThis.__testFakeMap._easeToCalls.length > easeToAntes, bearingInmediato: easeToCall?.bearing };
    });
    expect(trasActivar.huboEaseTo, 'SR-2: activarSeguimientoRumbo() debe girar el mapa de inmediato').toBe(true);
    expect(trasActivar.bearingInmediato, 'SR-2: el giro inmediato debe usar el último rumbo conocido de la brújula (90)').toBe(90);

    // ... y a partir de ahora, las lecturas de brújula sí mueven el bearing (setBearing).
    await page.evaluate(() => {
      const nombreEvento = ('ondeviceorientationabsolute' in globalThis) ? 'deviceorientationabsolute' : 'deviceorientation';
      const ev = document.createEvent('Event');
      ev.initEvent(nombreEvento, true, true);
      ev.alpha = 260; // rumbo = 100
      globalThis.dispatchEvent(ev);
    });
    const trasActivarYLectura = await page.evaluate(() => globalThis.__testFakeMap._setBearingCalls.length);
    expect(trasActivarYLectura, 'SR-2: con el modo activo, la brújula debe mover el bearing del mapa').toBeGreaterThan(0);

    // SR-3: desactivarSeguimientoRumbo() fija el mapa a norte de inmediato (easeTo bearing:0)...
    await page.waitForTimeout(150);
    const trasDesactivar = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const easeToAntes = globalThis.__testFakeMap._easeToCalls.length;
      mod.desactivarSeguimientoRumbo();
      const easeToCall = globalThis.__testFakeMap._easeToCalls[globalThis.__testFakeMap._easeToCalls.length - 1];
      return { huboEaseTo: globalThis.__testFakeMap._easeToCalls.length > easeToAntes, bearingInmediato: easeToCall?.bearing };
    });
    expect(trasDesactivar.huboEaseTo, 'SR-3: desactivarSeguimientoRumbo() debe fijar el mapa de inmediato').toBe(true);
    expect(trasDesactivar.bearingInmediato, 'SR-3: debe fijar a norte (bearing 0)').toBe(0);

    // ... y a partir de ahora, las lecturas de brújula dejan de mover el bearing otra vez.
    const setBearingCallsAntes = await page.evaluate(() => globalThis.__testFakeMap._setBearingCalls.length);
    await page.evaluate(() => {
      const nombreEvento = ('ondeviceorientationabsolute' in globalThis) ? 'deviceorientationabsolute' : 'deviceorientation';
      const ev = document.createEvent('Event');
      ev.initEvent(nombreEvento, true, true);
      ev.alpha = 200; // rumbo = 160
      globalThis.dispatchEvent(ev);
    });
    const setBearingCallsDespues = await page.evaluate(() => globalThis.__testFakeMap._setBearingCalls.length);
    expect(setBearingCallsDespues, 'SR-3: tras desactivar, la brújula no debe volver a mover el bearing').toBe(setBearingCallsAntes);
  });
});
