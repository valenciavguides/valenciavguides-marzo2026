/**
 * maplibre-stub.js — Stub de MapLibre GL JS para tests E2E en modo headless
 *
 * Este archivo se inyecta en el browser context con:
 *   page.addInitScript({ path: 'tests/e2e/helpers/maplibre-stub.js' })
 *
 * Se ejecuta ANTES que cualquier <script> del HTML. `codigo-padre.html` carga
 * MapLibre real desde un <script src="js/vendor/maplibre-gl-csp.js"> local (no
 * CDN) — por eso, además de este stub, boot.js#stubCDNResources intercepta esa
 * ruta con page.route y la sirve vacía, para que el script real nunca se
 * ejecute y sobrescriba este globalThis.maplibregl falso.
 *
 * El stub implementa suficiente API para que:
 *   - funciones-mapa.js se importe y ejecute sin errores (accede a
 *     globalThis.maplibregl solo dentro de funciones, no a nivel de módulo)
 *   - initializeMap() en codigo-padre.html no lance excepciones ni intente
 *     crear un contexto WebGL real (evita depender de soporte WebGL en
 *     Chromium headless, que puede variar entre entornos/CI)
 *   - Las operaciones de mapa (marcadores, capas, cámara) no crashen si se
 *     llaman durante un test
 *
 * Estos tests e2e prueban la orquestación de la app (arranque, handlers,
 * colas, cambios de modo) — no el motor de mapas — por eso el stub no simula
 * renderizado real, solo evita que falte algo que el código llama.
 */
(function () {
  'use strict';

  // ── Utilidades internas ────────────────────────────────────────────────
  function ee() {
    var _l = {};
    var self = {
      // MapLibre admite on(evento, fn) y on(evento, layerId, fn) — se detecta
      // la forma según si el 2º argumento es función o string (layerId).
      on: function (t, layerOrFn, maybeFn) {
        var isLayerForm = typeof layerOrFn !== 'function';
        var handler = isLayerForm ? maybeFn : layerOrFn;
        var key = isLayerForm ? (t + '::' + layerOrFn) : t;
        (_l[key] = _l[key] || []).push(handler);
        return self;
      },
      once: function (t, layerOrFn, maybeFn) {
        var isLayerForm = typeof layerOrFn !== 'function';
        var handler = isLayerForm ? maybeFn : layerOrFn;
        function w(e) {
          isLayerForm ? self.off(t, layerOrFn, w) : self.off(t, w);
          handler(e);
        }
        return isLayerForm ? self.on(t, layerOrFn, w) : self.on(t, w);
      },
      off: function (t, layerOrFn, maybeFn) {
        var isLayerForm = typeof layerOrFn !== 'function';
        var handler = isLayerForm ? maybeFn : layerOrFn;
        var key = isLayerForm ? (t + '::' + layerOrFn) : t;
        if (_l[key]) _l[key] = _l[key].filter(function (f) { return f !== handler; });
        return self;
      },
      fire: function (t, d) {
        (_l[t] || []).slice().forEach(function (fn) { try { fn(d); } catch (e) {} });
        return self;
      },
    };
    return self;
  }

  function fakeMarker(opts) {
    var el = (opts && opts.element) || document.createElement('div');
    var lngLat = { lng: 0, lat: 0 };
    var marker = {
      setLngLat: function (ll) {
        lngLat = Array.isArray(ll) ? { lng: ll[0], lat: ll[1] } : (ll || lngLat);
        return marker;
      },
      getLngLat: function () { return lngLat; },
      addTo: function () { return marker; },
      remove: function () { return marker; },
      getElement: function () { return el; },
      setPopup: function () { return marker; },
      getPopup: function () { return null; },
      togglePopup: function () { return marker; },
      setOffset: function () { return marker; },
      setRotation: function () { return marker; },
      getRotation: function () { return 0; },
      setDraggable: function () { return marker; },
    };
    return marker;
  }

  function fakePopup() {
    var popup = {
      setLngLat: function () { return popup; },
      setHTML: function () { return popup; },
      setText: function () { return popup; },
      setDOMContent: function () { return popup; },
      addTo: function () { return popup; },
      remove: function () { return popup; },
      isOpen: function () { return false; },
    };
    return popup;
  }

  function fakeMap(opts) {
    var e = ee();
    var container = opts && opts.container;
    var containerEl = typeof container === 'string' ? document.getElementById(container) : container;
    var m = Object.assign({}, e, {
      _container: containerEl || document.createElement('div'),
      _sources: {},
      _layers: {},

      isStyleLoaded: function () { return true; },
      loaded: function () { return true; },

      addSource: function (id, src) {
        // setData() replica GeoJSONSource real — algunas funciones del mapa (p.ej. el
        // círculo de activación de 20m) reposicionan una fuente existente en vez de
        // recrearla en cada tick de GPS.
        src.setData = function (data) { src.data = data; return src; };
        m._sources[id] = src;
        return m;
      },
      removeSource: function (id) { delete m._sources[id]; return m; },
      getSource: function (id) { return m._sources[id] || undefined; },

      addLayer: function (layer) { if (layer && layer.id) m._layers[layer.id] = layer; return m; },
      removeLayer: function (id) { delete m._layers[id]; return m; },
      getLayer: function (id) { return m._layers[id]; },

      setLayoutProperty: function () { return m; },
      getLayoutProperty: function () { return undefined; },
      setPaintProperty: function () { return m; },
      getPaintProperty: function () { return undefined; },

      getZoom: function () { return 15; },
      setZoom: function () { return m; },
      getCenter: function () { return { lng: -0.3763, lat: 39.4699 }; },
      setCenter: function () { return m; },
      getBearing: function () { return 0; },
      setBearing: function () { return m; },
      getPitch: function () { return 0; },
      setPitch: function () { return m; },

      jumpTo: function () { return m; },
      easeTo: function () { setTimeout(function () { m.fire('moveend'); }, 0); return m; },
      flyTo: function () { setTimeout(function () { m.fire('moveend'); }, 0); return m; },
      fitBounds: function () { return m; },
      panTo: function () { return m; },

      resize: function () { return m; },
      remove: function () { return m; },

      project: function () { return { x: 0, y: 0 }; },
      unproject: function () { return { lng: -0.3763, lat: 39.4699 }; },

      getContainer: function () { return m._container; },
      getCanvas: function () { return document.createElement('canvas'); },
      getCanvasContainer: function () { return document.createElement('div'); },

      addControl: function () { return m; },
      removeControl: function () { return m; },

      touchZoomRotate: { disableRotation: function () {}, enableRotation: function () {} },
      dragRotate: { disable: function () {}, enable: function () {} },
    });
    // Simula estilo listo tras un tick, como haría el evento 'load' real.
    setTimeout(function () { m.fire('load'); }, 0);
    return m;
  }

  // ── API pública de maplibregl ───────────────────────────────────────────
  globalThis.maplibregl = {
    version: 'stub',
    Map: function (opts) { return fakeMap(opts); },
    Marker: function (opts) { return fakeMarker(opts); },
    Popup: function () { return fakePopup(); },
    setWorkerUrl: function () {},
    supported: function () { return true; },
    LngLat: function (lng, lat) { return { lng: lng, lat: lat }; },
    LngLatBounds: function (sw, ne) {
      return {
        extend: function () { return this; },
        getSouthWest: function () { return sw || { lng: 0, lat: 0 }; },
        getNorthEast: function () { return ne || { lng: 0, lat: 0 }; },
      };
    },
  };
}());
