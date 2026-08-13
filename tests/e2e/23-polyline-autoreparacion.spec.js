/**
 * 23-polyline-autoreparacion.spec.js
 *
 * Prueba de la corrección del fallo silencioso descubierto por reporte de campo real:
 * si _crearPolyline()/_crearCirculoGeografico() (js/funciones-mapa.js) se llaman antes
 * de que el estilo de MapLibre termine de cargar (map.isStyleLoaded() === false), antes
 * devolvían un stub inerte para siempre (_capaVacia()) — la polyline de un tramo o el
 * círculo de activación quedaban invisibles el resto de la sesión, sin ningún aviso,
 * mientras que los marcadores 📌/🎯 (overlays DOM, no dependen del estilo) sí aparecían
 * — la asimetría exacta que el usuario reportó en capturas de pantalla reales.
 *
 * La corrección (_crearCapaDiferida()) sustituye el stub inerte por un proxy que se
 * engancha al evento 'load' del mapa y crea la capa real en cuanto el estilo está listo,
 * aplicando cualquier setLatLngs/setLatLng/setStyle que se hubiera llamado mientras tanto.
 *
 * Los 3 tests llaman a dibujarPolylineNavegacion() (js/funciones-mapa.js) — la función
 * real que usa el botón de ubicación en producción (codigo-padre.html, `await import(...)`,
 * mismo patrón que aquí) — para ejercitar _crearPolyline()/_crearCapaDiferida() con un
 * caller real de la app en vez de invocar esas funciones internas directamente.
 *
 *   PR-1  Con el estilo aún no cargado, dibujarPolylineNavegacion({origen,destino}) NO
 *         llama a addLayer/addSource todavía — pero en cuanto el mapa dispara 'load',
 *         la capa real se crea sola, sin ninguna acción adicional del código que llama.
 *   PR-2  Una llamada a .setStyle() hecha SOBRE el objeto devuelto (el proxy, mientras la
 *         capa real no existe) no se pierde — se aplica en cuanto la capa real se crea.
 *   PR-3  Si el estilo YA está cargado en el momento de crear la polyline, se comporta
 *         exactamente igual que antes (sin cambios) — la capa real se crea al instante,
 *         sin esperar a ningún evento.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('PR — Auto-reparación de polyline/círculo cuando el estilo no está listo', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis.funcionesMapa?.inicializarServicioMapa === 'function', null, { timeout: 15000 });
  });

  test('PR-1. Estilo no listo: la capa real se crea sola en cuanto el mapa dispara \'load\'', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const listeners = {};
      const fakeMap = {
        _styleLoaded: false,
        _addLayerCalls: [],
        _addSourceCalls: [],
        isStyleLoaded() { return fakeMap._styleLoaded; },
        once(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
        on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
        off(evt, fn) { if (listeners[evt]) listeners[evt] = listeners[evt].filter(f => f !== fn); },
        fire(evt) { (listeners[evt] || []).slice().forEach(fn => fn()); },
        addSource(id, src) { fakeMap._addSourceCalls.push(id); return fakeMap; },
        addLayer(layer) { fakeMap._addLayerCalls.push(layer.id); return fakeMap; },
        getSource() { return { setData() {} }; },
        getLayer(id) { return fakeMap._addLayerCalls.includes(id) ? {} : undefined; },
        removeLayer() {}, removeSource() {}, setPaintProperty() {},
        getZoom() { return 15; },
      };

      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);
      // dibujarPolylineNavegacion() es la función real que usa el botón de ubicación en
      // producción (codigo-padre.html) — crea la polyline vía _crearPolyline() por debajo.
      mod.dibujarPolylineNavegacion({
        origen: { lat: 39.4795, lng: -0.3758 },
        destino: { lat: 39.4799, lng: -0.3762 }
      });

      const antesDeLoad = { addLayer: fakeMap._addLayerCalls.length, addSource: fakeMap._addSourceCalls.length };

      fakeMap._styleLoaded = true;
      fakeMap.fire('load');

      const despuesDeLoad = { addLayer: fakeMap._addLayerCalls.length, addSource: fakeMap._addSourceCalls.length };

      return { antesDeLoad, despuesDeLoad };
    });

    expect(resultado.antesDeLoad.addLayer, 'Antes de \'load\' no debe existir ninguna capa real todavía').toBe(0);
    expect(resultado.antesDeLoad.addSource, 'Antes de \'load\' no debe existir ninguna fuente real todavía').toBe(0);
    expect(resultado.despuesDeLoad.addLayer, 'Al disparar \'load\', la capa real debe crearse sola').toBeGreaterThan(0);
    expect(resultado.despuesDeLoad.addSource, 'Al disparar \'load\', la fuente real debe crearse sola').toBeGreaterThan(0);
  });

  test('PR-2. dibujarPolylineNavegacion() llamado antes de \'load\' (setStyle sobre el proxy) no se pierde — se aplica sobre la capa real', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const listeners = {};
      const paintCalls = [];
      const fakeMap = {
        _styleLoaded: false,
        _addLayerCalls: [],
        isStyleLoaded() { return fakeMap._styleLoaded; },
        once(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
        on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
        off(evt, fn) { if (listeners[evt]) listeners[evt] = listeners[evt].filter(f => f !== fn); },
        fire(evt) { (listeners[evt] || []).slice().forEach(fn => fn()); },
        addSource() { return fakeMap; },
        addLayer(layer) { fakeMap._addLayerCalls.push(layer.id); return fakeMap; },
        getSource() { return { setData() {} }; },
        getLayer(id) { return fakeMap._addLayerCalls.includes(id) ? {} : undefined; },
        removeLayer() {}, removeSource() {},
        setPaintProperty(id, prop, val) { paintCalls.push({ id, prop, val }); },
        getZoom() { return 15; },
      };

      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);

      // dibujarPolylineNavegacion() crea la polyline (opacidad de creación 0.7 por defecto)
      // y devuelve el objeto — con el estilo aún sin cargar, es el proxy diferido de
      // _crearCapaDiferida(), con su propio setStyle() que encola la llamada.
      const linea = mod.dibujarPolylineNavegacion({
        origen: { lat: 39.4795, lng: -0.3758 },
        destino: { lat: 39.4799, lng: -0.3762 }
      });

      // .setStyle() sobre el proxy, exactamente como haría cualquier caller real que
      // quisiera cambiar su opacidad más tarde — aquí se dispara ANTES de que exista la
      // capa real, así que debe quedar encolado en vez de perderse.
      linea.setStyle({ opacity: 0.7 });

      const paintAntesDeLoad = paintCalls.length;

      fakeMap._styleLoaded = true;
      fakeMap.fire('load');

      const ultimaOpacidadAplicada = paintCalls.filter(c => c.prop === 'line-opacity').pop()?.val;

      return { paintAntesDeLoad, layerCreada: fakeMap._addLayerCalls.length > 0, ultimaOpacidadAplicada };
    });

    expect(resultado.paintAntesDeLoad, 'setPaintProperty no puede llamarse sobre una capa que no existe todavía').toBe(0);
    expect(resultado.layerCreada, 'La capa real debe haberse creado tras \'load\'').toBe(true);
    expect(resultado.ultimaOpacidadAplicada, 'La opacidad 0.7 pedida sobre el proxy antes de \'load\' debe aplicarse sobre la capa real en cuanto existe, no perderse').toBe(0.7);
  });

  test('PR-3. Estilo ya cargado: la capa real se crea al instante, sin esperar a \'load\'', async ({ page }) => {
    const resultado = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const fakeMap = {
        _addLayerCalls: [],
        isStyleLoaded() { return true; },
        once() {}, on() {}, off() {}, fire() {},
        addSource() { return fakeMap; },
        addLayer(layer) { fakeMap._addLayerCalls.push(layer.id); return fakeMap; },
        getSource() { return { setData() {} }; },
        getLayer(id) { return fakeMap._addLayerCalls.includes(id) ? {} : undefined; },
        removeLayer() {}, removeSource() {}, setPaintProperty() {},
        getZoom() { return 15; },
      };

      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);
      mod.dibujarPolylineNavegacion({
        origen: { lat: 39.4795, lng: -0.3758 },
        destino: { lat: 39.4799, lng: -0.3762 }
      });

      return { addLayer: fakeMap._addLayerCalls.length };
    });

    expect(resultado.addLayer, 'Con el estilo ya listo, la capa real se crea de inmediato').toBeGreaterThan(0);
  });
});
