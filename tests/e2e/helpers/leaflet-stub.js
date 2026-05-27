/**
 * leaflet-stub.js — Stub de Leaflet para tests E2E en modo headless
 *
 * Este archivo se inyecta en el browser context con:
 *   page.addInitScript({ path: 'tests/e2e/helpers/leaflet-stub.js' })
 *
 * Se ejecuta ANTES que cualquier <script> del HTML, incluyendo los CDN
 * (que se reemplazan con strings vacíos vía page.route en stubCDNResources).
 * Así globalThis.L es nuestro stub y no lo sobrescribe Leaflet real.
 *
 * El stub implementa suficiente API para que:
 *   - funciones-mapa.js se importe sin errores (accede a globalThis.L solo en funciones,
 *     no a nivel de módulo)
 *   - initializeMap() en codigo-padre.html no lance excepciones
 *   - Las operaciones de mapa (marcadores, GPS) no crashen si se llaman en tests
 */
(function () {
  'use strict';

  // ── Utilidades internas ────────────────────────────────────────────────
  function ee() {
    var _l = {};
    var self = {
      on: function (t, fn) { (_l[t] = _l[t] || []).push(fn); return self; },
      once: function (t, fn) {
        function w(e) { self.off(t, w); fn(e); }
        return self.on(t, w);
      },
      off: function (t, fn) {
        if (_l[t]) _l[t] = _l[t].filter(function (f) { return f !== fn; });
        return self;
      },
      fire: function (t, d) {
        (_l[t] || []).slice().forEach(function (fn) { try { fn(d); } catch (e) {} });
        return self;
      },
      addEventListener: function (t, fn) { return self.on(t, fn); },
      removeEventListener: function (t, fn) { return self.off(t, fn); },
      hasEventListeners: function (t) { return !!(_l[t] && _l[t].length); },
      listens: function (t) { return self.hasEventListeners(t); },
      clearAllEventListeners: function () { _l = {}; return self; },
    };
    return self;
  }

  function layer() {
    var e = ee();
    var base = Object.assign(e, {
      addTo: function (map) {
        if (map && map._layers) map._layers.push(base);
        return base;
      },
      remove: function () { return base; },
      removeFrom: function () { return base; },
      setOpacity: function () { return base; },
      bringToFront: function () { return base; },
      bringToBack: function () { return base; },
      getPane: function () { return document.createElement('div'); },
      options: {},
    });
    return base;
  }

  function fakeMap(containerId) {
    var e = ee();
    var m = Object.assign(e, {
      _container: null,
      _layers: [],
      _loaded: true,
      options: { rotate: false },
      addLayer: function (l) { m._layers.push(l); return m; },
      removeLayer: function (l) { m._layers = m._layers.filter(function (x) { return x !== l; }); return m; },
      hasLayer: function (l) { return m._layers.indexOf(l) !== -1; },
      setView: function () { return m; },
      getCenter: function () { return { lat: 39.4699, lng: -0.3763 }; },
      getZoom: function () { return 13; },
      setZoom: function () { return m; },
      zoomIn: function () { return m; },
      zoomOut: function () { return m; },
      panTo: function () { return m; },
      flyTo: function () { return m; },
      fitBounds: function () { return m; },
      addControl: function () { return m; },
      removeControl: function () { return m; },
      locate: function () { return m; },
      stopLocate: function () { return m; },
      invalidateSize: function () { return m; },
      getBearing: function () { return 0; },
      setBearing: function () { return m; },
      rotateTo: function () { return m; },
      getContainer: function () {
        if (!m._container) {
          m._container = document.getElementById(containerId) || document.createElement('div');
        }
        return m._container;
      },
      getPane: function () { return document.createElement('div'); },
      createPane: function () { return document.createElement('div'); },
      getPanes: function () { return {}; },
      getSize: function () { return { x: 400, y: 600 }; },
      getBounds: function () {
        return {
          getSouth: function () { return 39.0; },
          getNorth: function () { return 39.9; },
          getWest: function () { return -0.8; },
          getEast: function () { return 0.1; },
          contains: function () { return false; },
          isValid: function () { return true; },
        };
      },
      project: function () { return { x: 0, y: 0 }; },
      unproject: function () { return { lat: 39.4699, lng: -0.3763 }; },
      latLngToLayerPoint: function () { return { x: 0, y: 0 }; },
      layerPointToLatLng: function () { return { lat: 39.4699, lng: -0.3763 }; },
      containerPointToLatLng: function () { return { lat: 39.4699, lng: -0.3763 }; },
      latLngToContainerPoint: function () { return { x: 0, y: 0 }; },
      distance: function () { return 0; },
      wrapLatLng: function (ll) { return ll; },
      whenReady: function (fn) { setTimeout(fn, 0); return m; },
    });
    return m;
  }

  // ── API pública de L ───────────────────────────────────────────────────
  globalThis.L = {
    version: '1.9.4-stub',

    map: function (id) { return fakeMap(id); },

    tileLayer: function () { return layer(); },

    marker: function (latlng, opts) {
      return Object.assign(layer(), {
        setLatLng: function () { return this; },
        getLatLng: function () { return latlng || { lat: 0, lng: 0 }; },
        setIcon: function () { return this; },
        setZIndexOffset: function () { return this; },
        bindPopup: function () { return this; },
        unbindPopup: function () { return this; },
        bindTooltip: function () { return this; },
        unbindTooltip: function () { return this; },
        openPopup: function () { return this; },
        closePopup: function () { return this; },
      });
    },

    circle: function (latlng, opts) {
      return Object.assign(layer(), {
        setLatLng: function () { return this; },
        getLatLng: function () { return latlng || { lat: 0, lng: 0 }; },
        setRadius: function () { return this; },
        getRadius: function () { return (opts && opts.radius) || 20; },
        setStyle: function () { return this; },
      });
    },

    circleMarker: function (latlng) {
      return Object.assign(layer(), {
        setLatLng: function () { return this; },
        getLatLng: function () { return latlng; },
      });
    },

    polyline: function (pts, opts) {
      return Object.assign(layer(), {
        setLatLngs: function () { return this; },
        getLatLngs: function () { return pts || []; },
        setStyle: function () { return this; },
      });
    },

    polygon: function (pts) {
      return Object.assign(layer(), {
        setLatLngs: function () { return this; },
        getLatLngs: function () { return pts || []; },
      });
    },

    layerGroup: function (layers) {
      return Object.assign(layer(), {
        addLayer: function () { return this; },
        removeLayer: function () { return this; },
        clearLayers: function () { return this; },
        getLayers: function () { return layers || []; },
        hasLayer: function () { return false; },
      });
    },

    featureGroup: function (layers) {
      return Object.assign(layer(), {
        addLayer: function () { return this; },
        removeLayer: function () { return this; },
        clearLayers: function () { return this; },
        getLayers: function () { return layers || []; },
        getBounds: function () { return {}; },
      });
    },

    icon: function (opts) { return { options: opts || {}, createIcon: function () { return document.createElement('div'); } }; },
    divIcon: function (opts) { return { options: opts || {}, createIcon: function () { return document.createElement('div'); } }; },

    latLng: function (lat, lng) {
      if (Array.isArray(lat)) return { lat: lat[0], lng: lat[1] };
      if (lat && typeof lat === 'object') return lat;
      return { lat: lat || 0, lng: lng || 0 };
    },

    latLngBounds: function (sw, ne) {
      return {
        getSouth: function () { return sw && sw.lat || 0; },
        getNorth: function () { return ne && ne.lat || 0; },
        getWest: function () { return sw && sw.lng || 0; },
        getEast: function () { return ne && ne.lng || 0; },
        isValid: function () { return true; },
        contains: function () { return false; },
        extend: function () { return this; },
        pad: function () { return this; },
        getCenter: function () { return { lat: 39.4699, lng: -0.3763 }; },
      };
    },

    point: function (x, y) { return { x: x || 0, y: y || 0 }; },

    bounds: function (min, max) {
      return {
        min: min || { x: 0, y: 0 },
        max: max || { x: 0, y: 0 },
        contains: function () { return false; },
        intersects: function () { return false; },
        isValid: function () { return true; },
      };
    },

    control: {
      zoom: function () { return { addTo: function () { return this; }, remove: function () { return this; } }; },
      attribution: function () { return { addTo: function () { return this; }, remove: function () { return this; } }; },
      layers: function () { return { addTo: function () { return this; }, remove: function () { return this; } }; },
      scale: function () { return { addTo: function () { return this; } }; },
    },

    Control: {
      extend: function (props) {
        function Ctrl(opts) { this.options = Object.assign({}, props && props.options || {}, opts || {}); }
        Ctrl.prototype = Object.assign({
          addTo: function () { return this; },
          remove: function () { return this; },
          onAdd: function () { return document.createElement('div'); },
          onRemove: function () {},
          getContainer: function () { return document.createElement('div'); },
          initialize: function () {},
        }, props || {});
        Ctrl.extend = globalThis.L.Control.extend;
        return Ctrl;
      },
    },

    Layer: {
      extend: function (props) {
        function CustomLayer(opts) {
          this.options = Object.assign({}, props && props.options || {}, opts || {});
          if (props && props.initialize) props.initialize.call(this, opts);
        }
        var base = layer();
        CustomLayer.prototype = Object.assign({}, base, {
          initialize: function () {},
          onAdd: function () { return document.createElement('div'); },
          onRemove: function () {},
        }, props || {});
        CustomLayer.extend = globalThis.L.Layer.extend;
        return CustomLayer;
      },
    },

    Evented: {
      extend: function (props) {
        function Ev() { Object.assign(this, ee()); }
        Ev.prototype = Object.assign({}, props || {});
        return Ev;
      },
    },

    Class: {
      extend: function (props) {
        function C() {}
        C.prototype = props || {};
        C.extend = globalThis.L.Class.extend;
        return C;
      },
    },

    Util: {
      extend: Object.assign,
      create: Object.create,
      bind: function (fn, ctx) { return fn.bind(ctx); },
      stamp: function (o) { o._leaflet_id = o._leaflet_id || (++globalThis.L.Util._uid); return o._leaflet_id; },
      _uid: 0,
      throttle: function (fn) { return fn; },
      wrapNum: function (x) { return x; },
      formatNum: function (n, d) { return parseFloat((n).toFixed(d == null ? 6 : d)); },
      trim: function (s) { return s.trim(); },
      splitWords: function (s) { return s.trim().split(/\s+/); },
      setOptions: function (obj, opts) { obj.options = Object.assign({}, obj.options || {}, opts); return obj.options; },
      getParamString: function (obj) { return Object.keys(obj).map(function (k) { return k + '=' + obj[k]; }).join('&'); },
      template: function (s) { return s; },
      isArray: Array.isArray,
      indexOf: function (a, el) { return a.indexOf(el); },
      requestAnimFrame: function (fn) { return requestAnimationFrame(fn); },
      cancelAnimFrame: function (id) { cancelAnimationFrame(id); },
      falseFn: function () { return false; },
    },

    DomUtil: {
      create: function (tag, cls, container) {
        var el = document.createElement(tag || 'div');
        if (cls) el.className = cls;
        if (container) container.appendChild(el);
        return el;
      },
      remove: function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); },
      addClass: function (el, c) { if (el) el.classList.add(c); },
      removeClass: function (el, c) { if (el) el.classList.remove(c); },
      hasClass: function (el, c) { return el ? el.classList.contains(c) : false; },
      toggleClass: function (el, c, v) { if (el) el.classList.toggle(c, v); },
      setPosition: function (el, p) { if (el) { el.style.left = p.x + 'px'; el.style.top = p.y + 'px'; } },
      getPosition: function (el) { return { x: parseInt(el && el.style.left) || 0, y: parseInt(el && el.style.top) || 0 }; },
      getStyle: function (el, s) { return globalThis.getComputedStyle(el)[s]; },
      testProp: function (props) { return props[0] || false; },
      setTransform: function () {},
      setOpacity: function (el, v) { if (el) el.style.opacity = v; },
      preventOutline: function () {},
      restoreOutline: function () {},
      disableTextSelection: function () {},
      enableTextSelection: function () {},
      TRANSFORM: 'transform',
      TRANSITION: 'transition',
      TRANSITION_END: 'transitionend',
    },

    DomEvent: {
      on: function () { return globalThis.L.DomEvent; },
      off: function () { return globalThis.L.DomEvent; },
      addListener: function () { return globalThis.L.DomEvent; },
      removeListener: function () { return globalThis.L.DomEvent; },
      stopPropagation: function (e) { if (e) e.stopPropagation(); return globalThis.L.DomEvent; },
      preventDefault: function (e) { if (e) e.preventDefault(); return globalThis.L.DomEvent; },
      stop: function (e) { if (e) { e.stopPropagation(); e.preventDefault(); } return globalThis.L.DomEvent; },
      disableClickPropagation: function () { return globalThis.L.DomEvent; },
      disableScrollPropagation: function () { return globalThis.L.DomEvent; },
      getMousePosition: function () { return { x: 0, y: 0 }; },
      getWheelDelta: function () { return 0; },
    },

    CRS: {
      EPSG3857: {
        code: 'EPSG:3857',
        infinite: false,
        wrapLatLng: function (ll) { return ll; },
        wrapLatLngBounds: function (b) { return b; },
        distance: function () { return 0; },
        latLngToPoint: function () { return { x: 0, y: 0 }; },
        pointToLatLng: function () { return { lat: 39.4699, lng: -0.3763 }; },
        scale: function (zoom) { return 256 * Math.pow(2, zoom); },
        zoom: function () { return 13; },
        projection: {
          project: function () { return { x: 0, y: 0 }; },
          unproject: function () { return { lat: 39.4699, lng: -0.3763 }; },
          bounds: null,
        },
        transformation: {
          transform: function (p) { return p; },
          untransform: function (p) { return p; },
        },
      },
      Simple: {
        infinite: true,
        wrapLatLng: function (ll) { return ll; },
        distance: function () { return 0; },
        latLngToPoint: function () { return { x: 0, y: 0 }; },
        pointToLatLng: function () { return { lat: 0, lng: 0 }; },
        scale: function () { return 1; },
        zoom: function () { return 0; },
      },
    },

    Browser: {
      ie: false, ielt9: false, edge: false, webkit: true, gecko: false,
      android: false, android23: false, androidStock: false,
      opera: false, chrome: true, safari: false, win: false,
      ie3d: false, webkit3d: true, gecko3d: false, any3d: true,
      mobile: false, mobileWebkit: false, mobileWebkit3d: false,
      touch: false, msPointer: false, pointer: false, retina: false,
      passiveEvents: true, svg: true, vml: false, canvas: true, inlineSvg: true,
    },

    // Plugin leaflet-geometryutil stub
    GeometryUtil: {
      bearing: function () { return 0; },
      destination: function (ll) { return ll; },
      distance: function () { return 0; },
      readableDistance: function () { return '0 m'; },
      computeAngle: function () { return 0; },
      interpolateOnLine: function () { return null; },
      closestLayerSnap: function () { return null; },
      closest: function () { return null; },
    },

    noConflict: function () { return globalThis.L; },
  };

  // Alias que algunos plugins de Leaflet esperan
  globalThis.L.Class = globalThis.L.Class || {
    extend: function (props) {
      function C() {}
      C.prototype = props || {};
      C.extend = globalThis.L.Class.extend;
      return C;
    },
  };

}());
