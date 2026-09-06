/**
 * 53-camara-no-sigue-en-casa.spec.js
 *
 * En modo CASA el GPS **no manda sobre el mapa**: es un modo de exploración libre
 * donde el usuario navega por las paradas a su aire. El marcador 🛸 se sigue
 * dibujando y moviendo —sirve para ver que el sensor está vivo— pero la cámara no
 * debe recentrarse sola en cada posición recibida.
 *
 * `actualizarMarcadorUsuario()` ya distingue el modo para sus otras dos decisiones
 * (la brújula y el círculo naranja de 15 m, ambas bajo `modo !== 'casa'`); el
 * seguimiento de cámara se había quedado fuera de esa condición.
 *
 * Efecto secundario que esto provocaba: al pulsar una parada en CASA el mapa volaba
 * hasta ella y la siguiente lectura GPS —menos de un segundo después— devolvía la
 * vista a la ubicación del usuario.
 *
 *   CC-1  En CASA, una posición nueva NO mueve la cámara.
 *   CC-2  En AVENTURA sí (control: el seguimiento normal sigue intacto).
 *   CC-3  El marcador se dibuja igual en CASA — no se ha desactivado de más.
 *   CC-4  "Centrar en mi ubicación" sigue funcionando en CASA: centra UNA vez y las
 *         posiciones siguientes no vuelven a arrastrar la vista.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('CC — la cámara no persigue al usuario en modo CASA', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => typeof globalThis.funcionesMapa?.inicializarServicioMapa === 'function',
      null, { timeout: 15000 }
    );
  });

  // Un solo evaluate con todas las mediciones, mismo patrón que
  // 24-camara-sigue-usuario.spec.js: el fakeMap vive dentro del contexto de página.
  test('CC-1/2/3/4. CASA no sigue, AVENTURA sí, el marcador se dibuja, y centrar es puntual', async ({ page }) => {
    const r = await page.evaluate(async () => {
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
      const conCentro = () => fakeMap._easeToCalls.filter(o => o && o.center).length;

      const mod = await import('/js/funciones-mapa.js');
      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);

      // CC-1 — tres posiciones en CASA
      const marcador = await mod.actualizarMarcadorUsuario(39.4795, -0.3758, 0, 8, 'casa');
      await mod.actualizarMarcadorUsuario(39.4796, -0.3759, 0, 8, 'casa');
      await mod.actualizarMarcadorUsuario(39.4797, -0.3760, 0, 8, 'casa');
      const centradosEnCasa = conCentro();
      const hayMarcador = marcador !== null && marcador !== undefined;   // CC-3

      // CC-4 — centrar a petición del usuario, y una posición después
      mod.reactivarSeguimientoCamara();
      const trasCentrar = conCentro();
      await mod.actualizarMarcadorUsuario(39.4799, -0.3765, 0, 8, 'casa');
      const trasNuevaPosicionEnCasa = conCentro();

      // CC-2 — control: en AVENTURA sí sigue
      const antesAventura = conCentro();
      await mod.actualizarMarcadorUsuario(39.4800, -0.3766, 0, 8, 'aventura');
      const trasAventura = conCentro();

      return { centradosEnCasa, hayMarcador, trasCentrar, trasNuevaPosicionEnCasa, antesAventura, trasAventura };
    });

    expect(r.centradosEnCasa, 'CC-1: en CASA el GPS no debe recentrar el mapa').toBe(0);
    expect(r.hayMarcador, 'CC-3: el 🛸 debe seguir apareciendo en CASA').toBe(true);
    expect(r.trasCentrar, 'CC-4a: centrar a petición del usuario sí mueve la vista').toBe(r.centradosEnCasa + 1);
    expect(r.trasNuevaPosicionEnCasa, 'CC-4b: pero no sigue arrastrándola después').toBe(r.trasCentrar);
    expect(r.trasAventura, 'CC-2: en AVENTURA la cámara sí sigue al usuario').toBe(r.antesAventura + 1);
  });
});
