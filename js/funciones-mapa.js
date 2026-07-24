/**
 * Módulo que maneja la visualización del mapa y la interacción con las paradas
 * Se comunica con el padre a través del sistema de mensajería
 * 
 * DEPENDENCIAS CRÍTICAS (deben cargarse ANTES):
 * - constants.js
 * - logger.js  
 * - utils.js
 * - mensajeria.js (OBLIGATORIO - sin esto el módulo no puede comunicarse)
 */

// Importar mensajería y configuración
import {
    enviarMensaje,
    registrarControlador
} from './mensajeria.js';
import { CONFIG } from './config.js';
import { TIPOS_MENSAJE, MODOS } from './constants.js';
import { validarCoordenadas } from './validacion.js';
import { generarIdUnico, manejarError, ajustarTimeoutPorConexion, calcularDistancia, normalizarParadas, resolverIdsParada, resolverIdPadre, puntoMasCercanoEnLinea } from './utils.js';
import { DATOS_PADRE } from './aventuras-ID-padre.js';
import logger from './logger.js';

/**
 * Maneja errores de geolocalización
 * @param {GeolocationPositionError} err - Error de geolocalización
 */
function handleGeolocationError(err) {
    logger.error('Geolocation error', err);
    logger.error('[GPS] Geolocation error:', err.code, err.message);
}


/**
 * Extrae {lat, lng} de los distintos tipos de entrada de coordenadas-aventuras.js.
 *
 * Formatos en uso activo:
 *   { lat, lng }               — tramo.inicio, tramo.fin, cada waypoint
 *   { coordenadas: {lat, lng}} — parada.coordenadas, referencia.coordenadas
 *
 * Formato legacy (sin uso en datos actuales, mantenido por compatibilidad defensiva):
 *   { latitud, longitud }
 *
 * Para tramos: pasar .inicio o .fin directamente — los tramos no tienen .coordenadas.
 *
 * @param {object} obj
 * @returns {{lat: number, lng: number}|null}
 */
function _getLatLng(obj) {
    if (!obj || typeof obj !== 'object') return null;
    // Direct lat/lng
    if (Number.isFinite(obj.lat) && Number.isFinite(obj.lng)) return { lat: Number(obj.lat), lng: Number(obj.lng) };
    // latitud/longitud
    if (Number.isFinite(obj.latitud) && Number.isFinite(obj.longitud)) return { lat: Number(obj.latitud), lng: Number(obj.longitud) };
    // nested coordenadas
    if (obj.coordenadas && Number.isFinite(obj.coordenadas.lat) && Number.isFinite(obj.coordenadas.lng)) return { lat: Number(obj.coordenadas.lat), lng: Number(obj.coordenadas.lng) };
    // try parse strings too
    const latCandidate = obj.lat || obj.latitud || obj.coordenadas?.lat;
    const lngCandidate = obj.lng || obj.longitud || obj.coordenadas?.lng;
    const lat = Number(latCandidate);
    const lng = Number(lngCandidate);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    return null;
}

/**
 * Calcula la tolerancia GPS para un elemento (parada o tramo)
 * Paradas: 50m fijos
 * Tramos: distancia máxima entre waypoints consecutivos + 20m de buffer
 * @param {Object} elemento - Elemento actual (parada o tramo)
 * @returns {number} Tolerancia en metros
 */
function calcularToleranciaGPS(elemento) {
    if (!elemento) {
        logger.warn('⚠️ calcularToleranciaGPS: elemento no proporcionado, usando tolerancia por defecto 50m');
        return 50;
    }

    // Para paradas: tolerancia fija de 50m
    if (elemento.tipo === 'parada' || !elemento.waypoints || elemento.waypoints.length === 0) {
        logger.debug(`📏 Tolerancia GPS para parada "${elemento.id}": 50m (fija)`);
        return 50;
    }

    // Para tramos: calcular distancia máxima entre waypoints consecutivos + 20m buffer
    let distanciaMaxima = 0;
    for (let i = 0; i < elemento.waypoints.length - 1; i++) {
        const wp1 = elemento.waypoints[i];
        const wp2 = elemento.waypoints[i + 1];
        const coord1 = _getLatLng(wp1);
        const coord2 = _getLatLng(wp2);
        if (!coord1 || !coord2) {
            logger.warn(`⚠️ calcularToleranciaGPS: waypoint inválido en elemento "${elemento.id}" índice ${i}`);
            continue;
        }
        const distancia = calcularDistancia(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
        
        if (distancia > distanciaMaxima) {
            distanciaMaxima = distancia;
        }
    }

    const tolerancia = Math.ceil(distanciaMaxima + 20);
    logger.debug(`📏 Tolerancia GPS para tramo "${elemento.id}": ${tolerancia}m (max waypoint: ${Math.ceil(distanciaMaxima)}m + 20m buffer)`);
    
    return tolerancia;
}

/**
 * Verifica si el usuario ha llegado al destino (parada o tramo)
 * Usa tolerancia dinámica según el tipo de elemento
 * @param {Object} posicionUsuario - Posición del usuario {lat, lng}
 * @param {Object} elementoActual - Elemento de destino (parada o tramo)
 * @returns {boolean} true si el usuario está dentro de la tolerancia
 */
function verificarLlegadaADestino(posicionUsuario, elementoActual) {
    if (!posicionUsuario || !elementoActual) {
        logger.warn('⚠️ verificarLlegadaADestino: posicionUsuario o elementoActual no proporcionados');
        return false;
    }

    const tolerancia = calcularToleranciaGPS(elementoActual);
    
    // Determinar coordenadas del destino
    let coordenadasDestino;
    if (elementoActual.tipo === 'parada') {
        const c = _getLatLng(elementoActual.ubicacion || elementoActual);
        coordenadasDestino = c || { lat: elementoActual.lat, lng: elementoActual.lng };
    } else if (elementoActual.waypoints && elementoActual.waypoints.length > 0) {
        // Para tramos, usar el último waypoint como destino
        const ultimoWaypoint = elementoActual.waypoints[elementoActual.waypoints.length - 1];
        const c = _getLatLng(ultimoWaypoint);
        coordenadasDestino = c || { lat: ultimoWaypoint.lat, lng: ultimoWaypoint.lng };
    } else {
        logger.error('❌ verificarLlegadaADestino: elemento sin coordenadas válidas', elementoActual);
        return false;
    }

    const distancia = calcularDistancia(
        posicionUsuario.lat,
        posicionUsuario.lng,
        coordenadasDestino.lat,
        coordenadasDestino.lng
    );

    const llegada = distancia <= tolerancia;
    
    if (llegada) {
        logger.info(`🎯 Llegada detectada a "${elementoActual.id}" (${elementoActual.tipo}): ${Math.ceil(distancia)}m ≤ ${tolerancia}m`);
    } else {
        logger.debug(`🚶 Usuario a ${Math.ceil(distancia)}m de "${elementoActual.id}" (tolerancia: ${tolerancia}m)`);
    }

    return llegada;
}

import { esMovil } from './device-detection.js';

// Estado del módulo
let marcadoresParadas = new Map();
let marcadoresReferencias = new Map(); // Referencias visuales (tipo: "referencia")
let marcadorDestino = null;
let marcadorParadaActual = null; // Marcador para la parada actualmente visitada
let marcadorPosicionActual = null; // Marcador para la posición GPS actual del usuario
let rutasTramos = [];
let rutasActivas = [];
let marcadorUsuario = null;
let marcadorFlechaUsuario = null;
let marcadorHaloUsuario = null;
let deviceOrientationHeading = 0;
let _flechaGpsAnguloAcumulado = null; // ángulo continuo sin acotar a 0-360, para que rotate() siempre gire por el camino corto
let _flechaGpsUltimaEscritura = 0;
let flechaActiva = false;
let compassActiva = false;
let _mapaInstance = null; // Instancia del mapa MapLibre
let _mapaOpciones = null; // Opciones del mapa
let _pulseTimeout = null; // Timeout del efecto de llegada (cancelable)

// Array de paradas locales
let arrayParadasLocal = [];

// Flag para evitar solicitudes duplicadas de datos de paradas
let datosParadasSolicitados = false;

// Estado del mapa (ÚNICA FUENTE DE VERDAD para GPS)
// ARQUITECTURA: funciones-mapa.js mantiene estadoMapa como estado local.
// El PADRE (codigo-padre.html) mantiene globalThis.estadoPadre.gps como estado global.
// SINCRONIZACIÓN: Cuando funciones-mapa.js actualiza estadoMapa, debe sincronizar
// con globalThis.estadoPadre.gps si está disponible (cuando se ejecuta en contexto padre).
const estadoMapa = {
    modo: MODOS.CASA,
    posicionUsuario: null,
    gpsActivo: false,
    gpsPermisos: null, // null = desconocido, true = concedidos, false = denegados
    gpsPrecision: null, // Precisión actual del GPS en metros
    gpsError: null, // Último error GPS
    ultimaUbicacion: null, // { lat, lng } - última ubicación GPS recibida
    gpsVisualActivo: false, // Controla si polyline y emojis se muestran en modo AVENTURA
    siguiendoRuta: false,
    paradaActual: null,
    tramoActual: null,
    tramoWaypoints: null, // Puntos [inicio, ...waypoints, fin] del tramo activo para snap-to-route
    timestamp: Date.now(),
    // Estado para consultas de cambio de parada
    consultaParadaPendiente: null,
    esperandoCoordenadas: false,
    datosRecopilados: {},
    // Control de zoom: evitar múltiples operaciones y respetar interacción del usuario
    zoomEnCurso: false,       // true mientras una animación de zoom está en progreso
    usuarioMovioMapa: false,  // true si el usuario hizo pan/drag manualmente
    ultimoZoomAuto: 0         // timestamp del último zoom automático aplicado
};

// =====================================================
// HELPERS MAPLIBRE (usados en todo el resto de este fichero para
// marcadores HTML, polylines y círculos geográficos)
// =====================================================

/**
 * Convierte una coordenada en formato [lat,lng] o {lat,lng} al [lng,lat]
 * que espera MapLibre GL en todas sus APIs (center, LngLat, coordenadas GeoJSON...).
 * @param {Array<number>|{lat:number,lng:number}} coord
 * @returns {[number,number]}
 */
function aLngLat(coord) {
    if (Array.isArray(coord)) return [coord[1], coord[0]];
    return [coord.lng, coord.lat];
}

/**
 * Caja delimitadora [[minLng,minLat],[maxLng,maxLat]] a partir de un conjunto de
 * puntos — formato que espera map.fitBounds() en MapLibre.
 * @param {Array<Array<number>|{lat:number,lng:number}>} puntos
 * @returns {[[number,number],[number,number]]|null}
 */
function _bboxDesdePuntos(puntos) {
    if (!Array.isArray(puntos) || puntos.length === 0) return null;
    const lngLats = puntos.map(aLngLat);
    const lngs = lngLats.map(p => p[0]);
    const lats = lngLats.map(p => p[1]);
    return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}

/**
 * True si el estilo del mapa ya terminó de cargar y admite addSource/addLayer.
 * MapLibre lanza "Style is not done loading" si se llama antes de tiempo.
 * En la práctica esto solo podría ocurrir en los primeros instantes tras crear
 * el mapa; el primer dibujo real (tras seleccionar aventura) ocurre segundos
 * después, así que es una comprobación defensiva, no una espera activa.
 */
function _estiloListo() {
    try { return !!_mapaInstance && typeof _mapaInstance.isStyleLoaded === 'function' && _mapaInstance.isStyleLoaded(); } catch (_e) { return false; } // NOSONAR
}

/** Wrapper no-op seguro: mismo shape que _crearPolyline/_crearCirculoGeografico, para cuando el estilo no está listo. */
function _capaVacia(tipo) {
    return { _tipo: tipo, sourceId: null, setLatLngs() {}, setLatLng() {}, setStyle() {}, remove() {} };
}

function _normalizarDashArray(d) {
    if (!d) return null;
    if (Array.isArray(d)) return d;
    return String(d).split(/[\s,]+/).map(Number).filter(n => Number.isFinite(n));
}

/**
 * Crea un marcador MapLibre a partir de HTML, equivalente a L.marker+L.divIcon.
 * Todo icono divIcon de este proyecto usa anchor centrado (iconAnchor = mitad de
 * iconSize) — por eso el helper fija anchor:'center' siempre, sin parámetro.
 * Los Marker de MapLibre son overlays DOM puros (no dependen del estilo del
 * mapa), por lo que no necesitan la comprobación de _estiloListo().
 * @param {{lat:number,lng:number}} coords
 * @param {string} html - Contenido HTML del icono
 * @param {Object} [opciones]
 * @param {string} [opciones.className]
 * @param {string} [opciones.title] - Tooltip nativo (title attribute)
 * @param {number} [opciones.zIndex] - Orden de apilado (equivalente a zIndexOffset)
 * @returns {maplibregl.Marker}
 */
function _crearMarcadorHTML(coords, html, opciones = {}) {
    const el = document.createElement('div');
    if (opciones.className) el.className = opciones.className;
    el.innerHTML = html;
    if (opciones.title) el.title = opciones.title;
    if (Number.isFinite(opciones.zIndex)) el.style.zIndex = String(opciones.zIndex);
    return new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(aLngLat(coords))
        .addTo(_mapaInstance);
}

let _capaSeq = 0;

/**
 * Crea una polilínea MapLibre (fuente GeoJSON + capa 'line') envuelta en un objeto
 * con la pequeña API de L.Polyline que usa este fichero (setLatLngs/setStyle/remove),
 * para minimizar los cambios en el código que la consume.
 * @param {Array<{lat:number,lng:number}|[number,number]>} puntos
 * @param {Object} [estilo]
 * @param {string} [estilo.color='#3388ff']
 * @param {number} [estilo.weight=4]
 * @param {number} [estilo.opacity=0.8]
 * @param {string|Array<number>|null} [estilo.dashArray]
 */
function _crearPolyline(puntos, estilo = {}) {
    if (!_estiloListo()) {
        logger.warn('[MAPA] _crearPolyline: estilo aún no cargado, polilínea omitida');
        return _capaVacia('polyline');
    }
    const id = `vv-polyline-${_capaSeq++}`;
    const sourceId = `${id}-src`;
    const layerId = `${id}-layer`;
    const aCoords = pts => pts.map(aLngLat);
    const dash = _normalizarDashArray(estilo.dashArray);

    _mapaInstance.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: aCoords(puntos) } }
    });
    _mapaInstance.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
            'line-color': estilo.color || '#3388ff',
            'line-width': estilo.weight || 4,
            'line-opacity': estilo.opacity ?? 0.8,
            ...(dash ? { 'line-dasharray': dash } : {})
        }
    });

    return {
        _tipo: 'polyline',
        sourceId,
        layerId,
        setLatLngs(nuevosPuntos) {
            const src = _mapaInstance?.getSource(sourceId);
            if (src) src.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: aCoords(nuevosPuntos) } });
        },
        setStyle(nuevoEstilo = {}) {
            if (!_mapaInstance?.getLayer(layerId)) return;
            if (nuevoEstilo.opacity !== undefined) _mapaInstance.setPaintProperty(layerId, 'line-opacity', nuevoEstilo.opacity);
            if (nuevoEstilo.weight !== undefined) _mapaInstance.setPaintProperty(layerId, 'line-width', nuevoEstilo.weight);
            if (nuevoEstilo.color !== undefined) _mapaInstance.setPaintProperty(layerId, 'line-color', nuevoEstilo.color);
        },
        remove() {
            if (!_mapaInstance) return;
            if (_mapaInstance.getLayer(layerId)) _mapaInstance.removeLayer(layerId);
            if (_mapaInstance.getSource(sourceId)) _mapaInstance.removeSource(sourceId);
        }
    };
}

/** Punto geográfico a distancia/rumbo dado — usado para construir el polígono de un círculo geográfico real. */
function _destinoDesde(lat, lng, distanciaM, bearingDeg) {
    const R = 6371000;
    const brng = bearingDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lng1 = lng * Math.PI / 180;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanciaM / R) + Math.cos(lat1) * Math.sin(distanciaM / R) * Math.cos(brng));
    const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(distanciaM / R) * Math.cos(lat1), Math.cos(distanciaM / R) - Math.sin(lat1) * Math.sin(lat2));
    return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
}

function _poligonoCirculo(lat, lng, radioM, lados = 32) {
    const coords = [];
    for (let i = 0; i <= lados; i++) {
        const pt = _destinoDesde(lat, lng, radioM, (360 / lados) * i);
        coords.push([pt.lng, pt.lat]);
    }
    return coords;
}

/**
 * Crea un círculo geográfico (radio CONSTANTE en metros, no en píxeles) como
 * polígono MapLibre — equivalente visual de L.circle. MapLibre no tiene un tipo
 * de capa con radio en metros («circle-radius» es en píxeles de pantalla), por
 * eso el círculo se genera como polígono real que se recalcula al moverse.
 * @param {{lat:number,lng:number}} coords
 * @param {number} radioM - Radio en metros
 * @param {Object} [estilo]
 */
function _crearCirculoGeografico(coords, radioM, estilo = {}) {
    if (!_estiloListo()) {
        logger.warn('[MAPA] _crearCirculoGeografico: estilo aún no cargado, círculo omitido');
        return _capaVacia('circulo');
    }
    const id = `vv-circulo-${_capaSeq++}`;
    const sourceId = `${id}-src`;
    const fillId = `${id}-fill`;
    const lineId = `${id}-line`;

    const build = (c) => ({
        type: 'Feature', properties: {},
        geometry: { type: 'Polygon', coordinates: [_poligonoCirculo(c.lat, c.lng, radioM)] }
    });

    _mapaInstance.addSource(sourceId, { type: 'geojson', data: build(coords) });
    _mapaInstance.addLayer({
        id: fillId, type: 'fill', source: sourceId,
        paint: { 'fill-color': estilo.fillColor || estilo.color || '#000', 'fill-opacity': estilo.fillOpacity ?? 0.2 }
    });
    _mapaInstance.addLayer({
        id: lineId, type: 'line', source: sourceId,
        paint: { 'line-color': estilo.color || '#000', 'line-width': estilo.weight ?? 1 }
    });

    return {
        _tipo: 'circulo',
        sourceId,
        setLatLng(nuevasCoords) {
            const src = _mapaInstance?.getSource(sourceId);
            if (src) src.setData(build(nuevasCoords));
        },
        remove() {
            if (!_mapaInstance) return;
            if (_mapaInstance.getLayer(fillId)) _mapaInstance.removeLayer(fillId);
            if (_mapaInstance.getLayer(lineId)) _mapaInstance.removeLayer(lineId);
            if (_mapaInstance.getSource(sourceId)) _mapaInstance.removeSource(sourceId);
        }
    };
}

// =====================================================
// SISTEMA DE ESCALADO DINÁMICO PARA MAPA
// =====================================================
// Los tamaños de polylines, marcadores e iconos escalan según:
// 1. Tamaño de pantalla (vmin) - proporcional al dispositivo
// 2. Nivel de zoom del mapa - más detalle = elementos más grandes

/**
 * Valores base de referencia (para pantalla 400px y zoom 15)
 */
const ESCALA_BASE = {
    // Polylines
    POLYLINE_RUTA: 6,           // Grosor ruta principal
    POLYLINE_TRAMO: 4,          // Grosor tramo normal
    POLYLINE_DESTACADO: 6,      // Grosor tramo destacado
    POLYLINE_NAVEGACION: 7,     // Grosor línea navegación

    // Marcadores
    ICONO_PARADA: 20,           // Tamaño emoji parada 🎯
    ICONO_INICIO: 16,           // Tamaño círculo inicio
    ICONO_DESTINO: 26,          // Tamaño emoji destino 🎯
    ICONO_USUARIO_CASA: 48,     // Tamaño emoji 🛸 modo casa
    ICONO_USUARIO_AVENTURA: 44, // Tamaño flecha + punto modo aventura
    ICONO_REFERENCIA: 36,        // Tamaño base marcador referencia visual 🏛️ (pill)

    // Referencia de escala
    PANTALLA_REF: 400,          // Pantalla de referencia (vmin)
    ZOOM_REF: 15,               // Zoom de referencia
    ZOOM_FACTOR: 1.15           // Factor de escala por nivel de zoom
};

/**
 * Cache de escala actual para evitar recálculos frecuentes
 */
let _escalaCache = {
    valor: 1,
    timestamp: 0,
    zoom: 15
};

/**
 * Calcula la escala combinada según pantalla y zoom del mapa
 * @param {maplibregl.Map} [mapaInstance] - Instancia del mapa (opcional, usa _mapaInstance si no se proporciona)
 * @returns {number} Factor de escala (1.0 = tamaño base)
 */
function getEscalaMapa(mapaInstance = null) {
    const mapa = mapaInstance || _mapaInstance;
    const ahora = Date.now();
    
    // Usar cache si es reciente (< 100ms) y el zoom no cambió
    const zoomActual = mapa ? mapa.getZoom() : ESCALA_BASE.ZOOM_REF;
    if (ahora - _escalaCache.timestamp < 100 && _escalaCache.zoom === zoomActual) {
        return _escalaCache.valor;
    }
    
    // Factor 1: Tamaño de pantalla
    const vmin = Math.min(globalThis.innerWidth || 400, globalThis.innerHeight || 400);
    const escalaPantalla = vmin / ESCALA_BASE.PANTALLA_REF;
    
    // Factor 2: Nivel de zoom del mapa
    const escalaZoom = Math.pow(ESCALA_BASE.ZOOM_FACTOR, zoomActual - ESCALA_BASE.ZOOM_REF);
    
    // Combinación con límites seguros
    const escalaFinal = escalaPantalla * escalaZoom;
    const escalaLimitada = Math.max(0.5, Math.min(escalaFinal, 2.5));
    
    // Actualizar cache
    _escalaCache = {
        valor: escalaLimitada,
        timestamp: ahora,
        zoom: zoomActual
    };
    
    return escalaLimitada;
}

/**
 * Obtiene valores escalados para polylines
 * @returns {Object} Valores escalados { ruta, tramo, destacado, navegacion }
 */
function getPolylineEscalado() {
    const escala = getEscalaMapa();
    return {
        ruta: Math.round(ESCALA_BASE.POLYLINE_RUTA * escala),
        tramo: Math.round(ESCALA_BASE.POLYLINE_TRAMO * escala),
        destacado: Math.round(ESCALA_BASE.POLYLINE_DESTACADO * escala),
        navegacion: Math.round(ESCALA_BASE.POLYLINE_NAVEGACION * escala)
    };
}

/**
 * Obtiene valores escalados para iconos
 * @returns {Object} Valores escalados para cada tipo de icono
 */
function getIconoEscalado() {
    const escala = getEscalaMapa();
    return {
        parada: Math.round(ESCALA_BASE.ICONO_PARADA * escala),
        inicio: Math.round(ESCALA_BASE.ICONO_INICIO * escala),
        destino: Math.round(ESCALA_BASE.ICONO_DESTINO * escala),
        usuarioCasa: Math.round(ESCALA_BASE.ICONO_USUARIO_CASA * escala),
        usuarioAventura: Math.round(ESCALA_BASE.ICONO_USUARIO_AVENTURA * escala),
        referencia: Math.round(ESCALA_BASE.ICONO_REFERENCIA * escala)
    };
}

/**
 * Lista de elementos a re-renderizar cuando cambie el zoom
 * @private
 */
let _elementosParaReescalar = [];

/**
 * Re-escala todos los marcadores emoji visibles según zoom y pantalla.
 * Llamado desde el listener zoomend.
 */
function reescalarMarcadoresEmoji() {
    const iconos = getIconoEscalado();

    // Re-escalar marcadores en marcadoresParadas (ruta, inicio, fin, paradas)
    marcadoresParadas.forEach((marker) => {
        try {
            const el = marker.getElement?.();
            const clase = el?.className;
            if (!clase) return;

            let size, emoji, shadow;

            if (clase === 'custom-marker-emoji' || clase === 'finish-flag-icon' || clase === 'tramo-fin-icon') {
                size = iconos.parada;
                emoji = '🎯';
                shadow = 'text-shadow:0 2px 4px rgba(0,0,0,0.3);';
            } else if (clase === 'start-flag-icon' || clase === 'tramo-inicio-icon') {
                size = iconos.inicio;
                emoji = '📌';
                shadow = 'text-shadow:0 2px 4px rgba(0,0,0,0.3);';
            } else {
                return;
            }

            el.innerHTML = `<div style="font-size:${size}px;line-height:${size}px;${shadow}">${emoji}</div>`;
        } catch (_e) { /* ignore individual marker errors */ } // NOSONAR
    });

    // Re-escalar marcadores de referencias visuales (🏛️)
    marcadoresReferencias.forEach((marker) => {
        try {
            if (marker._refData) {
                marker.getElement().innerHTML = crearIconoReferencia(marker._refData);
            }
        } catch (_e) { /* ignore individual marker errors */ } // NOSONAR
    });

    // Re-escalar marcador de destino de navegación (🎯)
    if (marcadorDestinoNavegacion) {
        try {
            const size = iconos.destino;
            marcadorDestinoNavegacion.getElement().innerHTML =
                `<div style="font-size:${size}px;text-align:center;line-height:${size}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🎯</div>`;
        } catch (_e) { /* ignore */ } // NOSONAR
    }
}

// =====================================================
// REFERENCIAS VISUALES (tipo: "referencia")
// Monumentos que se mencionan en el texto pero que el usuario
// no visita. Aparecen como pin 🏛️+número en el mapa,
// sin participar en lógica GPS ni en elementosIDpadre.
// =====================================================

let _refPopupEstilosInyectados = false;

/**
 * Inyecta una vez los estilos CSS del popup de referencia visual.
 * @private
 */
function _inyectarEstilosReferencia() {
    if (_refPopupEstilosInyectados) return;
    _refPopupEstilosInyectados = true;
    const style = document.createElement('style');
    style.id = 'estilos-referencia-popup';
    style.textContent = `
        #referencia-popup {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 1000015;
            background: rgba(0,0,0,0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeInMedia 0.3s ease-out;
        }
        #referencia-popup .ref-popup-card {
            position: relative;
            background: white;
            border: 0.3125rem solid #8FE0A8;
            border-radius: 0.9375rem;
            box-shadow: 0 0.9375rem 3.125rem rgba(0,0,0,0.7);
            padding: 2.2rem 2rem 1.5rem;
            max-width: min(80vw, 22rem);
            width: max-content;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;
        }
        #referencia-popup .ref-popup-emoji {
            font-size: clamp(2rem, 8vw, 3rem);
            line-height: 1;
        }
        #referencia-popup .ref-popup-numero {
            font-size: clamp(0.7rem, 2.8vw, 0.85rem);
            color: #ff8c00;
            font-weight: bold;
            letter-spacing: 0.04em;
        }
        #referencia-popup .ref-popup-nombre {
            font-size: clamp(0.95rem, 3.5vw, 1.1rem);
            color: #222;
            font-weight: 600;
            margin: 0;
            line-height: 1.3;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Muestra el popup de información de una referencia visual.
 * Reutiliza .btn-cerrar-overlay de codigo-padre.html.
 * @param {Object} referencia - Objeto referencia con nombre y mapa_numero
 */
function mostrarPopupReferencia(referencia) {
    _inyectarEstilosReferencia();

    const existente = document.getElementById('referencia-popup');
    if (existente) existente.remove();

    const _e = s => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
    const popup = document.createElement('div');
    popup.id = 'referencia-popup';
    popup.innerHTML = `
        <div class="ref-popup-card">
            <button class="btn-cerrar-overlay"
                onclick="document.getElementById('referencia-popup').remove()"
                title="Cerrar">×</button>
            <div class="ref-popup-emoji">🏛️</div>
            <div class="ref-popup-numero">Nº ${_e(referencia.mapa_numero)} · Referencia visual</div>
            <p class="ref-popup-nombre">${_e(referencia.nombre)}</p>
        </div>
    `;
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.remove();
    });
    document.body.appendChild(popup);
}

/**
 * Genera el HTML del icono de un marcador de referencia visual.
 * Círculo/pill blanco con borde naranja, 🏛️ y número de mapa.
 * Se escala dinámicamente con el sistema de escalado del mapa.
 * @param {Object} referencia - Objeto referencia con mapa_numero
 * @returns {string} HTML del icono, listo para _crearMarcadorHTML
 */
function crearIconoReferencia(referencia) {
    const escala = getEscalaMapa();
    const h = Math.round(ESCALA_BASE.ICONO_REFERENCIA * escala);
    const borde = Math.max(2, Math.round(h * 0.08));
    const emojiPx = Math.round(h * 0.5);
    const numPx = Math.round(h * 0.34);
    const gap = Math.round(h * 0.06);
    const px = Math.round(h * 0.15);

    const numStr = String(referencia.mapa_numero);
    const w = Math.round(h + numStr.length * numPx * 0.62 + px * 2);

    return `<div style="
        width:${w}px;height:${h}px;
        background:white;
        border:${borde}px solid #ff8c00;
        border-radius:${Math.round(h / 2)}px;
        display:flex;align-items:center;justify-content:center;
        gap:${gap}px;padding:0 ${px}px;box-sizing:border-box;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
        cursor:pointer;
    "><span style="font-size:${emojiPx}px;line-height:1;">🏛️</span><span style="font-size:${numPx}px;font-weight:bold;color:#ff8c00;line-height:1;">${numStr}</span></div>`;
}

/**
 * Dibuja en el mapa todos los elementos tipo "referencia" del array de coordenadas.
 * No participa en GPS ni en la secuencia de la aventura.
 * Llamar después de dibujarRutaConMarcadores con el array completo de coordenadas.
 * @param {Array} coordenadasBrutas - Array completo de coordenadas de la aventura
 */
export function dibujarReferencias(coordenadasBrutas) {
    if (!_mapaInstance) {
        logger.warn('[MAPA] dibujarReferencias: mapa no inicializado');
        return;
    }
    limpiarReferencias();

    if (!Array.isArray(coordenadasBrutas)) return;

    const referencias = coordenadasBrutas.filter(c => c.tipo === 'referencia');

    referencias.forEach(ref => {
        const coords = _getLatLng(ref);
        if (!coords) {
            logger.warn(`[MAPA] Referencia "${ref.id}" sin coordenadas válidas`);
            return;
        }
        const icono = crearIconoReferencia(ref);
        const marcador = _crearMarcadorHTML(coords, icono, {
            className: 'referencia-visual-marker',
            title: ref.nombre || `Referencia ${ref.mapa_numero}`,
            zIndex: 400  // Por debajo de paradas (600) pero visible
        });

        marcador._refData = ref; // Guardamos para poder re-escalar
        marcador.getElement().addEventListener('click', () => mostrarPopupReferencia(ref));

        marcadoresReferencias.set(ref.id, marcador);
        logger.debug(`[MAPA] Referencia visual dibujada: ${ref.id} (${ref.nombre})`);
    });

    if (referencias.length > 0) {
        logger.info(`[MAPA] ${referencias.length} referencia(s) visual(es) dibujada(s)`);
    }
}

/**
 * Elimina del mapa todos los marcadores de referencias visuales.
 */
function limpiarReferencias() {
    marcadoresReferencias.forEach(m => {
        try { m.remove(); } catch (_e) { /* ignore */ } // NOSONAR
    });
    marcadoresReferencias.clear();
}

/**
 * Registra el listener de zoom para re-escalar elementos
 * Se llama automáticamente cuando se inicializa el mapa
 */
function registrarListenerZoom() {
    if (!_mapaInstance) return;
    
    _mapaInstance.on('zoomend', () => {
        // Invalidar cache de escala
        _escalaCache.timestamp = 0;
        logger.debug(`[MAPA] Zoom cambiado a ${_mapaInstance.getZoom()}, escala: ${getEscalaMapa().toFixed(2)}`);
        
        // Re-escalar polyline de navegación si existe
        if (polylineNavegacion) {
            const peso = getPolylineEscalado();
            polylineNavegacion.setStyle({ weight: peso.navegacion });
        }
        
        // Re-escalar rutasActivas
        rutasActivas.forEach(polyline => {
            if (polyline?.setStyle) {
                const peso = getPolylineEscalado();
                polyline.setStyle({ weight: peso.ruta });
            }
        });
        
        // Re-escalar marcadores emoji (📌🎯) según nuevo zoom y pantalla
        reescalarMarcadoresEmoji();
    });
    
    logger.debug('[MAPA] Listener de zoom registrado para escalado dinámico');
}

// NOTA: Implementación de precalentamiento GPS eliminada — el GPS principal se iniciará bajo demanda

/**
 * Sincroniza el estado GPS local (estadoMapa) con el estado global del padre
 * ARQUITECTURA: El padre es el orquestador - mantiene globalThis.estadoPadre.gps
 * Esta función asegura que ambos estados estén sincronizados
 * @private
 */
function sincronizarEstadoGPSConPadre() {
    if (globalThis.window !== undefined && globalThis.estadoPadre?.gps) {
        globalThis.estadoPadre.gps.activo = estadoMapa.gpsActivo;
        globalThis.estadoPadre.gps.permisos = estadoMapa.gpsPermisos;
        globalThis.estadoPadre.gps.precision = estadoMapa.gpsPrecision;
        globalThis.estadoPadre.gps.error = estadoMapa.gpsError;
        globalThis.estadoPadre.gps.posicionUsuario = estadoMapa.posicionUsuario;
        globalThis.estadoPadre.gps.ultimaUbicacion = estadoMapa.ultimaUbicacion;
        globalThis.estadoPadre.gps.visualActivo = estadoMapa.gpsVisualActivo;
    }
}

// Implementar limpieza automática cuando la página está oculta
let ultimaActividad = Date.now();
let intervaloLimpiezaAutomatica;

/**
 * Solicita los datos de paradas al padre si no están disponibles localmente
 * Evita solicitudes duplicadas usando la flag datosParadasSolicitados
 * @returns {Promise<void>}
 */
async function solicitarDatosParadas() {
    if (datosParadasSolicitados) {
        logger.debug('Datos de paradas ya solicitados anteriormente, omitiendo');
        return;
    }

    if (arrayParadasLocal.length > 0) {
        logger.debug('Datos de paradas ya disponibles localmente, omitiendo solicitud');
        return;
    }

    try {
        logger.info('Solicitando datos de paradas al padre...');
        datosParadasSolicitados = true;

        enviarMensaje({
            destino: resolverIdPadre(),
            tipo: TIPOS_MENSAJE.NAVEGACION.SOLICITAR_DATOS_PARADAS,
            origen: 'funciones-mapa',
            datos: {
                timestamp: Date.now(),
                razon: 'inicializacion_mapa'
            }
        });

        logger.debug('Solicitud de datos de paradas enviada exitosamente');
    } catch (error) {
        logger.error('Error al solicitar datos de paradas:', error);
        // Reset flag on error to allow retry
        datosParadasSolicitados = false;
    }
}

function actualizarUltimaActividad() {
    ultimaActividad = Date.now();
}

function limpiarRecursosInactivos() {
    const tiempoInactivo = Date.now() - ultimaActividad;

    // More aggressive timeout for mobile
    const tiempoLimite = esMovil() ? 120000 : 300000; // 2 min móvil, 5 min desktop

    if (tiempoInactivo > tiempoLimite) {
        if (esMovil()) {
            logger.debug('Aplicación móvil inactiva detectada, limpiando recursos agresivamente');
        } else {
            logger.info('Aplicación inactiva detectada, limpiando recursos del mapa');
        }

        limpiarRecursos();

        // Limpiar estado del mapa para ahorrar memoria
        estadoMapa.posicionUsuario = null;
        estadoMapa.paradaActual = null;
        estadoMapa.tramoActual = null;
        estadoMapa.tramoWaypoints = null;

        // Additional cleanup for mobile
        if (esMovil() && _mapaInstance) {
            // Clear any cached markers or routes
            marcadoresParadas.clear();
            marcadorDestino = null;
            rutasTramos = [];
            rutasActivas = [];
            marcadorUsuario = null;
        }
    }
}

// Configurar listeners de actividad (guardamos referencias para poder limpiarlos)
let _eventosActividadRegistrados = [];

if (typeof document !== 'undefined') {
    // Reduce event listeners for mobile (only essential ones)
    const eventosActividad = esMovil()
        ? ['touchstart', 'click'] // Only touch and click for mobile
        : ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    eventosActividad.forEach(evento => {
        document.addEventListener(evento, actualizarUltimaActividad, { passive: true });
        _eventosActividadRegistrados.push(evento);
    });

    // Configurar limpieza automática: intervalo siempre menor que el umbral de inactividad
    const intervaloLimpiezaMs = esMovil() ? 60000 : 120000; // 1 min móvil, 2 min desktop
    intervaloLimpiezaAutomatica = setInterval(limpiarRecursosInactivos, intervaloLimpiezaMs);
}

/**
 * Inicializa el servicio del mapa.
 * @param {Object} mapaInstance - Instancia del mapa de MapLibre GL.
 * @param {Object} [opciones={}] - Opciones de configuración.
 * @returns {boolean} True si la inicialización fue exitosa.
 */
export function inicializarServicioMapa(mapaInstance, opciones = {}) {
    // Si se proporciona una instancia válida, usarla directamente
    if (mapaInstance) {
        _mapaInstance = mapaInstance;
        _mapaOpciones = { ...opciones };
        arrayParadasLocal = normalizarParadas(globalThis.AVENTURA_PARADAS || []);
        registrarListenerZoom(); // Habilitar escalado dinámico según zoom
        logger.info('Servicio de mapa inicializado correctamente (instancia recibida)');
        return true;
    }

    // Intentar crear la instancia internamente si MapLibre GL ya está disponible
    if (typeof maplibregl !== 'undefined' && maplibregl.Map) {
        try {
            const containerId = opciones?.containerId || 'mapa';
            const container = document.getElementById(containerId);
            if (!container) {
                logger.warn(`[MAPA] Contenedor #${containerId} no encontrado; no se puede crear mapa internamente`);
                return false;
            }

            const centro = CONFIG.MAPA?.CENTER || [39.4699, -0.3763]; // [lat, lng]
            const mapa = new maplibregl.Map({
                container: containerId,
                style: {
                    version: 8,
                    sources: {
                        'osm-src': {
                            type: 'raster',
                            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                            tileSize: 256,
                            attribution: '© OpenStreetMap contributors',
                        },
                    },
                    layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-src' }],
                },
                center: [centro[1], centro[0]], // MapLibre usa [lng, lat]
                zoom: CONFIG.MAPA?.ZOOM || 13,
                minZoom: CONFIG.MAPA?.MIN_ZOOM || 12,
                maxZoom: CONFIG.MAPA?.MAX_ZOOM || 18,
            });

            _mapaInstance = mapa;
            _mapaOpciones = { ...opciones };
            arrayParadasLocal = normalizarParadas(globalThis.AVENTURA_PARADAS || []);
            registrarListenerZoom(); // Habilitar escalado dinámico según zoom

            logger.info('Servicio de mapa inicializado correctamente (instancia creada internamente)');
            return true;
        } catch (error) {
            logger.error('[MAPA] Error creando instancia del mapa internamente:', error);
            return false;
        }
    }

    // Si no se puede crear la instancia ahora, emitir advertencia y devolver false.
    // Esto evita lanzar un error en tiempo de inicialización externo y permite que
    // el llamador reintente cuando la API/instancia esté disponible.
    logger.warn('No se proporcionó instancia del mapa y MapLibre GL no está listo; espere a volver a llamar con la instancia');
    return false;
}

/**
 * Verifica si el mapa está inicializado
 * @returns {boolean} True si el mapa está inicializado
 */
export function estaInicializado() {
    return _mapaInstance !== null;
}

/**
 * Ejecuta una operación en el mapa
 * @param {Function} operacion - Operación a ejecutar
 * @returns {Promise<any>} Resultado de la operación
 */
export async function ejecutarOperacionMapa(operacion) {
    return new Promise((resolve, reject) => {
        if (!_mapaInstance) {
            reject(new Error('Mapa no inicializado'));
            return;
        }
        
        try {
            const resultado = operacion(_mapaInstance);
            resolve(resultado);
        } catch (error) {
            logger.error('Error al ejecutar operación en el mapa', { 
                error: error.message, 
                stack: error.stack 
            });
            reject(error);
        }
    });
}

/**
 * Invalida el tamaño del mapa
 * @returns {Promise<boolean>} True si se realizó correctamente
 */
export async function invalidarTamañoMapa() {
    try {
        if (!_mapaInstance) {
            logger.warn('No se puede invalidar el tamaño: mapa no inicializado');
            return false;
        }
        
        await ejecutarOperacionMapa(mapa => {
            mapa.resize();
            return true;
        });
        
        logger.debug('Tamaño del mapa invalidado correctamente');
        return true;
    } catch (error) {
        logger.error('Error al invalidar tamaño del mapa', {
            error: error.message,
            stack: error.stack
        });
        return false;
    }
}

/**
 * Establece la vista del mapa
 * @param {Array|Object} center - Centro del mapa [lat, lng] or {lat, lng}
 * @param {number} zoom - Nivel de zoom
 * @param {Object} [opciones={}] - Opciones adicionales
 * @returns {Promise<boolean} True si se estableció correctamente
 */
export async function setMapView(center, zoom, opciones = {}) {
    try {
        if (!_mapaInstance) {
            logger.warn('No se puede establecer vista: mapa no inicializado');
            return false;
        }
        
            // Normalizar entrada: aceptar [lat, lng] o { lat, lng | lon }
            let coordObj = null;
            if (Array.isArray(center) && center.length >= 2) {
                coordObj = { lat: Number(center[0]), lng: Number(center[1]) };
            } else if (center && typeof center === 'object') {
                // Aceptar alias 'lon' también
                const lat = center.lat === undefined ? undefined : Number(center.lat);
                const lonValue = center.lon === undefined ? undefined : Number(center.lon);
                const lng = center.lng === undefined ? lonValue : Number(center.lng);
                if (lat !== undefined && lng !== undefined) {
                    coordObj = { lat, lng };
                }
            }

            if (!coordObj) {
                logger.warn('setMapView: centro inválido recibido', { center });
                return false;
            }

            if (!validarCoordenadas(coordObj)) {
                logger.warn('setMapView: coordenadas inválidas tras normalizar', coordObj);
                return false;
            }

            // Determinar zoom válido: preferir parámetro, luego opciones.zoom, luego estado del mapa
            let finalZoom = zoom;
            if (finalZoom === undefined || finalZoom === null || !Number.isFinite(finalZoom)) {
                finalZoom = opciones?.zoom ? Number(opciones.zoom) : undefined;
            }
            if (finalZoom === undefined || finalZoom === null || !Number.isFinite(finalZoom)) {
                try { finalZoom = _mapaInstance ? _mapaInstance.getZoom() : finalZoom; } catch (_e) { /* ignore */ } // NOSONAR
            }

            // Si aún no tenemos un zoom válido, dejar que setView lo gestione (o usar 15 como fallback)
            if (finalZoom === undefined || finalZoom === null || !Number.isFinite(finalZoom)) {
                finalZoom = opciones?.zoom ? Number(opciones.zoom) : 15;
            }

            await ejecutarOperacionMapa(mapa => {
                const center = aLngLat(coordObj);
                if (opciones?.animate === false) {
                    mapa.jumpTo({ center, zoom: finalZoom });
                } else {
                    // MapLibre espera duration en milisegundos (opciones.duration llega en segundos).
                    const durationMs = Number.isFinite(opciones?.duration) ? opciones.duration * 1000 : 300;
                    mapa.easeTo({ center, zoom: finalZoom, duration: durationMs });
                }
                return true;
            });
        
        return true;
    } catch (error) {
        logger.error('Error al establecer vista del mapa:', error);
        return false;
    }
}

/**
 * Obtiene el centro actual del mapa
 * @returns {Promise<{lat: number, lng: number, zoom: number}>} Coordenadas del centro
 */
export async function getMapCenter() {
    if (!_mapaInstance) {
        throw new Error('Servicio de mapa no inicializado');
    }
    
    return new Promise((resolve, reject) => {
        try {
            const center = _mapaInstance.getCenter();
            if (!validarCoordenadas({ lat: center.lat, lng: center.lng })) return reject(new Error('Coordenadas del mapa inválidas'));
            resolve({ 
                lat: center.lat, 
                lng: center.lng, 
                zoom: _mapaInstance.getZoom() 
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Verifica si el servicio del mapa está inicializado
 * @returns {boolean} - True si el servicio está inicializado
 */
export function isMapInitialized() {
    return _mapaInstance !== null;
}

/**
 * Wait for MapLibre GL (maplibregl) to be available globally
 * @returns {Promise<void>}
 */
function waitForMapLibre() {
    return new Promise((resolve, reject) => {
        const checkMapLibre = () => {
            if (typeof maplibregl !== 'undefined' && maplibregl.Map) {
                resolve();
            } else {
                setTimeout(checkMapLibre, 100);
            }
        };

        // Timeout after 10 seconds
        setTimeout(() => {
            reject(new Error('MapLibre GL no se cargó en el tiempo esperado'));
        }, 10000);

        checkMapLibre();
    });
}

/**
 * Verifica y corrige problemas comunes con el contenedor del mapa.
 * @param {string} containerId - ID del contenedor del mapa.
 * @returns {HTMLElement|null} - El contenedor corregido o null si no se puede arreglar.
 */
export function verificarContenedorMapa(containerId = 'mapa') {
    let contenedor = document.getElementById(containerId);
    if (!contenedor) {
        logger.warn(`Contenedor con ID "${containerId}" no encontrado. Creando uno nuevo.`);
        contenedor = document.createElement('div');
        contenedor.id = containerId;
        contenedor.style.cssText = 'width: 100%; height: 400px; position: relative;';
        document.body.appendChild(contenedor);
    }

    if (contenedor.offsetWidth === 0 || contenedor.offsetHeight === 0) {
        contenedor.style.width = '100%';
        contenedor.style.height = '400px';
        logger.debug('Dimensiones del contenedor corregidas');
    }

    return contenedor;
}

/**
 * Inicializa el mapa y verifica el contenedor.
 * @param {Object} config - Configuración del mapa.
 * @returns {Promise<maplibregl.Map>} - Instancia del mapa.
 */
export async function inicializarMapa(config = {}) {
    // Wait for MapLibre GL to be available
    await waitForMapLibre();

    logger.info('Inicializando mapa...');
    const containerId = config.containerId || 'mapa';

    // Verificar y corregir el contenedor del mapa
    const mapContainer = verificarContenedorMapa(containerId);
    if (!mapContainer) {
        throw new Error(`No se pudo verificar/reparar el contenedor #${containerId}`);
    }

    // Verificar si el mapa ya está inicializado a través del servicio
    if (estaInicializado()) {
        logger.info('Usando instancia existente del mapa');
        return await ejecutarOperacionMapa(mapa => mapa);
    }

    // Create new map instance
    const centro = CONFIG.MAPA.CENTRO_DEFECTO; // [lat, lng]
    const mapa = new maplibregl.Map({
        container: containerId,
        style: {
            version: 8,
            sources: {
                'osm-src': {
                    type: 'raster',
                    tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '© OpenStreetMap contributors',
                    maxzoom: 19,
                },
            },
            layers: [{ id: 'osm-layer', type: 'raster', source: 'osm-src' }],
        },
        center: aLngLat(centro),
        zoom: CONFIG.MAPA.ZOOM_INICIAL,
        minZoom: CONFIG.MAPA.ZOOM_MIN,
        maxZoom: CONFIG.MAPA.ZOOM_MAX,
    });

    // Registrar la instancia en el servicio
    inicializarServicioMapa(mapa, config);

    logger.info('Mapa inicializado correctamente');
    return mapa;
}

/**
 * Espera a que un elemento sea visible en el DOM
 * @param {string} selector - Selector del elemento a esperar
 * @param {number} [timeout=5000] - Tiempo máximo de espera en ms
 * @returns {Promise<HTMLElement>} El elemento cuando esté visible
 */
async function esperarElementoVisible(selector, timeout = 5000) {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
            // First check if element already exists
        const checkNow = document.querySelector(selector);
        if (checkNow && checkNow.offsetParent !== null) {
            logger.debug(`Elemento ${selector} ya está disponible en el DOM`);
            return resolve(checkNow);
        }
        
        logger.debug(`Esperando elemento ${selector} (timeout: ${timeout}ms)...`);
        
        // Create a more robust checking mechanism
        const checkElement = () => {
            const element = document.querySelector(selector);
            const elapsed = Date.now() - startTime;
            
            // Element exists and is visible
            if (element && element.offsetParent !== null) {
                logger.debug(`Elemento ${selector} encontrado después de ${elapsed}ms`);
                return resolve(element);
            }
            
            // Element exists but may not be visible yet - force visibility
            if (element && elapsed > timeout / 2) {
                logger.warn(`Elemento ${selector} existe pero podría no ser visible. Forzando visibilidad...`);
                element.style.display = 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.style.height = element.style.height || '400px';
                element.style.width = element.style.width || '100%';
                
                // Dar un breve retraso para aplicar estilos y luego resolver
                setTimeout(() => resolve(element), 100);
                return;
            }
            
            // Timeout reached
            if (elapsed >= timeout) {
                // Last chance: if element exists at all, force it and resolve
                const lastChance = document.querySelector(selector);
                if (lastChance) {
                    logger.warn(`Tiempo agotado pero elemento ${selector} existe. Forzando visibilidad como último recurso.`);
                    lastChance.style.display = 'block';
                    lastChance.style.visibility = 'visible';
                    lastChance.style.opacity = '1';
                    lastChance.style.height = lastChance.style.height || '400px';
                    lastChance.style.width = lastChance.style.width || '100%';
                    return resolve(lastChance);
                }
                
                // Create element as last resort if it doesn't exist at all
                if (selector === '#mapa') {
                    logger.warn(`Creando elemento ${selector} ya que no existe después de ${elapsed}ms`);
                    const newMap = document.createElement('div');
                    newMap.id = 'mapa';
                    newMap.style.width = '100%';
                    newMap.style.height = '400px';
                    newMap.style.display = 'block';
                    document.body.insertBefore(newMap, document.body.firstChild);
                    return resolve(newMap);
                }
                
                return reject(new Error(`Tiempo de espera agotado para el selector: ${selector} (${elapsed}ms)`));
            }
            
            // Continue checking
            requestAnimationFrame(checkElement);
        };
        
        checkElement();
    });
}

/**
 * Limpia los recursos del mapa.
 */
export function limpiarRecursos() {
    try {
        if (!_mapaInstance) {
            logger.warn('No se pueden limpiar los recursos: mapa no inicializado');
            return false;
        }

        logger.info('[funciones-mapa] Iniciando limpieza completa de recursos del mapa');

        // Limpiar marcadores de usuario
        if (marcadorUsuario) {
            marcadorUsuario.remove();
            marcadorUsuario = null;
        }

        // Limpiar marcador de destino
        if (marcadorDestino) {
            marcadorDestino.remove();
            marcadorDestino = null;
        }

        // Limpiar marcadores de paradas
        marcadoresParadas.forEach(marcador => marcador.remove());
        marcadoresParadas.clear();

        // Limpiar referencias visuales
        limpiarReferencias();

        // Limpiar rutas
        logger.debug(`[funciones-mapa] Eliminando ${rutasTramos.length} rutas de tramos y ${rutasActivas.length} rutas activas`);
        rutasTramos.forEach(ruta => ruta.remove());
        rutasTramos = [];

        rutasActivas.forEach(ruta => ruta.remove());
        rutasActivas = [];

        // Toda fuente/capa se crea con un id explícito a través de los helpers
        // _crearMarcadorHTML/_crearPolyline/_crearCirculoGeografico de este mismo
        // fichero, y todos quedan en los registros de arriba — no existe la
        // categoría de "capa huérfana no rastreada", ni una API eachLayer con la
        // que barrerla si hiciera falta.

        logger.debug('Recursos del mapa limpiados completamente');

        // Limpiar listeners globales de actividad para evitar memory leak
        _eventosActividadRegistrados.forEach(evento => {
            document.removeEventListener(evento, actualizarUltimaActividad);
        });
        _eventosActividadRegistrados = [];

        // Limpiar intervalo de limpieza automática
        if (intervaloLimpiezaAutomatica) {
            clearInterval(intervaloLimpiezaAutomatica);
            intervaloLimpiezaAutomatica = null;
        }

        // Resetear estado GPS de estadoMapa
        estadoMapa.gpsActivo = false;
        estadoMapa.gpsError = null;
        estadoMapa.gpsVisualActivo = false;
        estadoMapa.posicionUsuario = null;
        sincronizarEstadoGPSConPadre();

        logger.info('[funciones-mapa] Limpieza completa de recursos finalizada');
        return true;
    } catch (error) {
        logger.error('Error al limpiar recursos del mapa:', error);
        return false;
    }
}

/**
 * Muestra todas las paradas en el mapa.
 * @param {Array} paradasExternas - Paradas proporcionadas externamente (opcional).
 */
export async function mostrarTodasLasParadas(paradasExternas) {
    try {
        if (paradasExternas) {
            arrayParadasLocal = normalizarParadas(paradasExternas);
        }

        // Si el mapa no está inicializado, esperar a que se inicialice
        if (!_mapaInstance) {
            logger.info('mostrarTodasLasParadas: mapa no inicializado, esperando inicialización...');

            // Esperar hasta 5 segundos por la inicialización del mapa
            const maxWaitTime = 5000;
            const checkInterval = 100;
            let waited = 0;

            while (!_mapaInstance && waited < maxWaitTime) {
                await new Promise(resolve => setTimeout(resolve, checkInterval));
                waited += checkInterval;
            }

            // Si aún no está inicializado después de esperar, actualizar solo el array local
            if (!_mapaInstance) {
                logger.warn('mostrarTodasLasParadas: mapa no se inicializó después de esperar, solo se actualiza arrayParadasLocal');
                return false;
            }

            logger.info('mostrarTodasLasParadas: mapa inicializado, procediendo con la visualización');
        }

        marcadoresParadas.forEach(marcador => marcador.remove());
        marcadoresParadas.clear();

        arrayParadasLocal.forEach(parada => {
            if (parada.coordenadas && validarCoordenadas(parada.coordenadas)) {
                // Sin icono personalizado — usa el pin por defecto de MapLibre
                // (anchor 'bottom': la punta toca el punto).
                const marcador = new maplibregl.Marker({ anchor: 'bottom' })
                    .setLngLat(aLngLat(parada.coordenadas))
                    .addTo(_mapaInstance);
                marcador.getElement().title = parada.nombre || `Parada ${parada.id}`;
                marcador.getElement().style.zIndex = '600';

                marcadoresParadas.set(parada.id, marcador);
            }
        });

        logger.info(`Se han añadido ${marcadoresParadas.size} marcadores al mapa`);
        return true;
    } catch (error) {
        logger.error('Error al mostrar todas las paradas:', error);
        return false;
    }
}

/**
 * Dibuja un tramo específico en el mapa.
 * @param {Object} tramo - Objeto tramo con inicio, fin y waypoints.
 * @param {boolean} destacado - Si es true, se muestra con énfasis.
 * @returns {Object} La polilínea creada (wrapper de _crearPolyline).
 */
function dibujarTramo(tramo, destacado = false) {
    try {
        // TEMP DEBUG: imprimir objeto `tramo` en consola cuando se active la bandera global
        try {
            if (globalThis.window !== undefined && globalThis.__vv_debug_tramo) {
                // Clonar para evitar referencias circulares al mostrar
                let copia = null;
                try { copia = structuredClone(tramo); } catch (_e) { copia = tramo; } // NOSONAR
                logger.info('[DEBUG-TRAMO] dibujarTramo llamado con:', copia);
            }
        } catch (dbgErr) {
            logger.debug('[DEBUG-TRAMO] Error al imprimir tramo debug:', dbgErr);
        }

        if (!tramo?.inicio || !tramo?.fin) {
            throw new Error('Datos del tramo incompletos.');
        }

        validarCoordenadas(tramo.inicio);
        validarCoordenadas(tramo.fin);

        const puntos = [tramo.inicio, ...(tramo.waypoints || []), tramo.fin];

        if (!_mapaInstance) {
            throw new Error('Mapa no inicializado');
        }

        // Usar valores escalados según pantalla y zoom
        const peso = getPolylineEscalado();
        return _crearPolyline(puntos, {
            color: destacado ? '#ff4500' : '#3388ff',
            weight: destacado ? peso.destacado : peso.tramo,
            opacity: destacado ? 0.9 : 0.7
        });
    } catch (error) {
        logger.error('Error al dibujar tramo:', error);
        return null;
    }
}

/**
 * Dibuja una ruta con marcadores en el mapa.
 * @param {Array} coordenadasHijo2 - Array de coordenadas con propiedades lat, lng.
 * @param {Object} opciones - Opciones adicionales para el dibujo.
 * @param {boolean} opciones.dibujarRuta - Si debe dibujar la polyline de la ruta (default: true en AVENTURA, false en CASA).
 */
export function dibujarRutaConMarcadores(coordenadasHijo2, opciones = {}) {
    try {
        if (!Array.isArray(coordenadasHijo2) || coordenadasHijo2.length === 0) {
            throw new Error('Coordenadas inválidas para dibujar ruta');
        }

        // Determinar si dibujar ruta basado en modo y opciones
        const modoActual = estadoMapa.modo || MODOS.CASA;
        const dibujarRuta = opciones.dibujarRuta ?? (modoActual === MODOS.AVENTURA);

        logger.debug('Dibujando ruta con marcadores', {
            puntos: coordenadasHijo2.length,
            modo: modoActual,
            dibujarRuta
        });

        // Limpiar ruta anterior
        limpiarRecursos();

        const puntos = coordenadasHijo2.map(coord => [coord.lat, coord.lng]);

        // Dibujar polyline de la ruta solo si está habilitado
        if (dibujarRuta) {
            const peso = getPolylineEscalado();
            const polyline = _crearPolyline(puntos, {
                color: '#0077ff',
                weight: peso.ruta,
                opacity: 0.8
            });

            rutasActivas.push(polyline);
            logger.debug('Polyline de ruta dibujada');
        } else {
            logger.debug('Polyline omitida (modo casa o deshabilitado)');
        }

        // Crear iconos personalizados usando colores en lugar de archivos
        const crearIconoColoreado = (color) => {
            const iconos = getIconoEscalado();
            // Para marcadores verdes (paradas), usar emoji 🎯
            if (color === '#4CAF50') {
                return `<div style="font-size:${iconos.parada}px;line-height:${iconos.parada}px;">🎯</div>`;
            }
            // Para otros colores, usar círculos coloreados
            return `<div style="background-color: ${color}; width: ${iconos.inicio}px; height: ${iconos.inicio}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
        };

        // Agregar marcadores SOLO para inicio, parada y fin (omitir waypoints intermedios)
        coordenadasHijo2.forEach((coord, index) => {
            // Omitir waypoints (no queremos marcadores amarillos intermedios)
            if (coord.tipo === 'waypoint') return;

            const isFirst = index === 0;
            const isLast = index === coordenadasHijo2.length - 1;

            let markerTitle = coord.nombre || `Punto ${index + 1}`;

            // Si es el punto final, usar icono 🎯
            if (isLast) {
                markerTitle = coord.nombre || 'Fin de ruta';
                const iconos = getIconoEscalado();
                const flagHtml = `<div style="font-size:${iconos.parada}px;line-height:${iconos.parada}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🎯</div>`;
                const markerFin = _crearMarcadorHTML(coord, flagHtml, { className: 'finish-flag-icon', title: markerTitle, zIndex: 700 });
                marcadoresParadas.set(`ruta-fin`, markerFin);
                return;
            }

            // Para inicio o paradas, usar icono coloreado o emoji
            let markerColor = '#4CAF50';
            if (coord.tipo === 'inicio' || (coord.tipo === 'tramo' && isFirst)) {
                markerTitle = coord.nombre || 'Inicio';
                // Usar emoji 📌 para punto de inicio
                const iconosInicio = getIconoEscalado();
                const startHtml = `<div style="font-size:${iconosInicio.inicio}px;line-height:${iconosInicio.inicio}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">📌</div>`;
                const markerInicio = _crearMarcadorHTML(coord, startHtml, { className: 'start-flag-icon', title: markerTitle, zIndex: 700 });
                marcadoresParadas.set(`ruta-${index}`, markerInicio);
                return;
            } else if (coord.tipo === 'parada') {
                markerTitle = coord.nombre || `Parada ${coord.id}`;
            }

            const marker = _crearMarcadorHTML(coord, crearIconoColoreado(markerColor), {
                className: markerColor === '#4CAF50' ? 'custom-marker-emoji' : 'custom-marker',
                title: markerTitle,
                zIndex: 600
            });
            marcadoresParadas.set(`ruta-${index}`, marker);
        });

        // Ajustar zoom para mostrar toda la ruta (fitBounds)
        if (puntos.length > 0 && _mapaInstance && opciones.ajustarZoom !== false) {
            try {
                const bounds = _bboxDesdePuntos(puntos);
                _mapaInstance.fitBounds(bounds, {
                    padding: 50, // MapLibre acepta un número único (padding simétrico)
                    maxZoom: 16,
                    duration: 500 // milisegundos
                });
                logger.debug('Zoom ajustado para mostrar toda la ruta');
            } catch (boundsError) {
                logger.warn('Error ajustando zoom de la ruta:', boundsError);
            }
        }

        logger.info('Ruta dibujada con éxito', { puntos: coordenadasHijo2.length });
        return true;
    } catch (error) {
        logger.error('Error al dibujar ruta con marcadores:', error);
        return false;
    }
}


/**
 * Actualiza el marcador de una parada específica en el mapa.
 * @param {string} paradaId - ID de la parada a actualizar.
 * @param {Object} coordenadas - Nuevas coordenadas {lat, lng}.
 */
function actualizarMarcadorParada(paradaId, coordenadas) {
    try {
        if (!_mapaInstance) {
            throw new Error('Mapa no inicializado');
        }

        const marcador = marcadoresParadas.get(paradaId);
        if (marcador) {
            marcador.setLngLat(aLngLat(coordenadas));
            logger.info(`Marcador de parada ${paradaId} actualizado`);
        } else {
            logger.warn(`No se encontró marcador para la parada ${paradaId}`);
        }
    } catch (error) {
        logger.error('Error al actualizar marcador de parada:', error);
    }
}

/**
 * Limpia recursos del mapa basándose en el estado actual
 * @param {Object} nuevoEstado - Nuevo estado del mapa
 * @param {string} nuevoEstado.modo - Modo actual ('casa' o 'aventura')
 * @param {string|number} nuevoEstado.paradaActual - ID de la parada actual
 * @param {string|number} nuevoEstado.tramoActual - ID del tramo actual
 */
export function limpiarPorEstado(nuevoEstado) {
    try {
        if (!nuevoEstado) {
            logger.warn('limpiarPorEstado: Estado no proporcionado');
            return false;
        }

        const { modo, paradaActual, tramoActual, resetCompleto } = nuevoEstado;
        let limpiado = false;

        logger.info(`[funciones-mapa] limpiarPorEstado llamado con: modo=${modo}, resetCompleto=${resetCompleto}, paradaActual=${paradaActual}, tramoActual=${tramoActual}`);

        // **NUEVO: Reset completo al cambiar de modo**
        if (resetCompleto || modo !== estadoMapa.modo) {
            logger.info(`[funciones-mapa] Ejecutando reset completo por cambio de modo a '${modo}'`);

            // Limpiar TODOS los recursos del mapa
            limpiarRecursos();

            // Resetear estadoMapa completamente
            estadoMapa.paradaActual = null;
            estadoMapa.tramoActual = null;
            estadoMapa.tramoWaypoints = null;
            estadoMapa.posicionUsuario = null;
            estadoMapa.gpsActivo = false;
            estadoMapa.siguiendoRuta = false;
            estadoMapa.modo = modo;
            estadoMapa.timestamp = Date.now();

            limpiado = true;
            logger.debug(`[funciones-mapa] Reset completo ejecutado para modo ${modo}`);
        } else {
            // Limpieza por cambio de parada
            if (paradaActual !== estadoMapa.paradaActual && paradaActual !== null) {
                // Limpiar marcadores de rutas anteriores (mantener marcadores de paradas)
                marcadoresParadas.forEach((marcador, id) => {
                    if (id.startsWith('ruta-')) {
                        marcador.remove();
                        marcadoresParadas.delete(id);
                    }
                });
                limpiado = true;
                logger.debug(`Limpieza automática: Cambio de parada a ${paradaActual}, marcadores de ruta limpiados`);
            }

            // Limpieza por cambio de tramo
            if (tramoActual !== estadoMapa.tramoActual && tramoActual !== null) {
                // Limpiar rutas activas anteriores
                rutasActivas.forEach(ruta => ruta.remove());
                rutasActivas = [];
                limpiado = true;
                logger.debug(`Limpieza automática: Cambio de tramo a ${tramoActual}, rutas limpiadas`);
            }

            // Actualizar estado interno
            if (modo !== undefined) estadoMapa.modo = modo;
            if (paradaActual !== undefined) estadoMapa.paradaActual = paradaActual;
            if (tramoActual !== undefined) estadoMapa.tramoActual = tramoActual;
            estadoMapa.timestamp = Date.now();
        }

        // Activar/desactivar flecha de usuario
        if (tramoActual !== null) {
            activarFlechaUsuario();
        } else {
            desactivarFlechaUsuario();
        }

        return limpiado;
    } catch (error) {
        logger.error('Error en limpiarPorEstado:', error);
        return false;
    }
}

function activarFlechaUsuario() {
    if (!flechaActiva && estadoMapa.tramoActual && estadoMapa.modo === MODOS.AVENTURA) {
        flechaActiva = true;
        if (_mapaInstance) {
            _mapaInstance.on('zoomend', actualizarPosicionFlecha);
        }
        logger.info('Flecha de ruta activada');
    }
}

function desactivarFlechaUsuario() {
    if (!flechaActiva) { return; }
    flechaActiva = false;
    if (_mapaInstance) {
        _mapaInstance.off('zoomend', actualizarPosicionFlecha);
    }
    if (marcadorFlechaUsuario) {
        marcadorFlechaUsuario.remove();
        marcadorFlechaUsuario = null;
    }
    if (marcadorHaloUsuario) {
        marcadorHaloUsuario.remove();
        marcadorHaloUsuario = null;
    }
    logger.info('Flecha de ruta desactivada');
}

/**
 * Actualiza la orientación de la flecha según la brújula del dispositivo.
 * iOS devuelve webkitCompassHeading (0=N, sentido horario, ya compensado).
 * Android devuelve alpha (mismo rango, misma referencia cuando el dispositivo está plano).
 */
function actualizarOrientacionFlecha(event) {
    const heading = event.webkitCompassHeading ?? event.alpha;
    if (heading == null) return;
    deviceOrientationHeading = heading;
    // Rotar la flecha GPS en tiempo real sin recrear el marcador
    actualizarRotacionFlechaGPS(heading);
    // Actualizar también la flecha de ruta si está activa
    if (flechaActiva) actualizarPosicionFlecha();
}

/**
 * Delta angular más corto entre dos ángulos, en (-180, 180] — evita que rotate()
 * gire por el camino largo al cruzar el límite 0°/360°.
 */
function _anguloDeltaCorto(actual, objetivo) {
    let diff = (objetivo - actual) % 360;
    if (diff > 180) diff -= 360;
    if (diff <= -180) diff += 360;
    return diff;
}

/**
 * Actualiza solo el CSS transform de la flecha GPS (no recrea el marcador).
 * DeviceOrientationEvent llama a esta función indirectamente hasta 30 veces/segundo;
 * el sensor de rumbo es ruidoso (sobre todo en Android bajo techo), así que aquí se
 * aplican tres correcciones para evitar una flecha "loca": (1) suavizado exponencial,
 * solo se aplica una fracción del salto detectado en vez del valor crudo; (2) ángulo
 * acumulado sin acotar a 0-360, para que la CSS transition siempre gire por el camino
 * corto en vez de dar la vuelta larga al cruzar 359°→0°; (3) throttle a ~10Hz, ya que
 * escribir al DOM a 30Hz no aporta nada visible con una transition de 0.3s.
 */
function actualizarRotacionFlechaGPS(heading) {
    if (!marcadorUsuarioGPS) return;
    const el = marcadorUsuarioGPS.getElement();
    if (!el) return;
    const div = el.querySelector('.gps-arrow-heading');
    if (!div) return;

    const ahora = Date.now();
    if (ahora - _flechaGpsUltimaEscritura < 100) return;
    _flechaGpsUltimaEscritura = ahora;

    if (_flechaGpsAnguloAcumulado === null) {
        _flechaGpsAnguloAcumulado = heading;
    } else {
        const delta = _anguloDeltaCorto(_flechaGpsAnguloAcumulado, heading);
        _flechaGpsAnguloAcumulado += delta * 0.25;
    }

    div.style.transform = `translate(-50%,-50%) rotate(${_flechaGpsAnguloAcumulado}deg)`;
}

/**
 * Activa la brújula del dispositivo para rotar la flecha GPS en tiempo real.
 * En iOS 13+ solicita permiso explícito (requiere gesto del usuario previo).
 */
async function activarBrujula() {
    if (compassActiva) return;
    try {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            const permiso = await DeviceOrientationEvent.requestPermission();
            if (permiso !== 'granted') {
                logger.warn('[brujula] Permiso denegado — la flecha no rotará con el móvil');
                return;
            }
        }
        if (typeof DeviceOrientationEvent !== 'undefined') {
            globalThis.addEventListener('deviceorientation', actualizarOrientacionFlecha);
            compassActiva = true;
            logger.info('[brujula] Activada — flecha GPS rota en tiempo real');
        }
    } catch (e) { // NOSONAR
        logger.warn('[brujula] No disponible:', e);
    }
}

function desactivarBrujula() {
    if (!compassActiva) return;
    globalThis.removeEventListener('deviceorientation', actualizarOrientacionFlecha);
    compassActiva = false;
    logger.info('[brujula] Desactivada');
}

/**
 * Actualiza la posición y rotación de la flecha del usuario.
 */
function actualizarPosicionFlecha() {
    if (!flechaActiva || !estadoMapa.tramoActual || !estadoMapa.posicionUsuario || !_mapaInstance) return;

    // Usar waypoints del estado (guardados al activar el tramo en completarCambioParada)
    const waypointsRaw = estadoMapa.tramoWaypoints;
    if (!waypointsRaw?.length) return;

    // Calcular punto más cercano en la polilínea (sustituye a L.GeometryUtil.closest)
    const closestPoint = puntoMasCercanoEnLinea(estadoMapa.posicionUsuario, waypointsRaw);

    if (closestPoint) {
        // Calcular tamaño basado en zoom
        const zoom = _mapaInstance.getZoom();
        const baseSize = 15;
        const sizeMultiplier = Math.max(1, (zoom - 13) * 0.5 + 1); // Crece con zoom
        const size = Math.round(baseSize * sizeMultiplier);

        // Crear o actualizar marcador
        const arrowHtml = `<div style="font-size: ${size}px; color: #0066cc; text-shadow: 1px 1px 2px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.3); transform: rotate(${deviceOrientationHeading}deg); filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));">↑</div>`;

        if (marcadorFlechaUsuario) {
            marcadorFlechaUsuario.setLngLat(aLngLat(closestPoint));
            marcadorFlechaUsuario.getElement().innerHTML = arrowHtml;
        } else {
            marcadorFlechaUsuario = _crearMarcadorHTML(closestPoint, arrowHtml, { className: 'user-direction-arrow' });
        }

        // Actualizar o crear halo (círculo de 21m)
        if (marcadorHaloUsuario) {
            marcadorHaloUsuario.setLatLng(closestPoint);
        } else {
            marcadorHaloUsuario = _crearCirculoGeografico(closestPoint, 21, {
                color: 'red',
                fillColor: 'yellow',
                fillOpacity: 0.2,
                weight: 1
            });
        }
    }
}

/**
 * Maneja el cambio de parada en la navegación.
 * @param {Object} mensaje - Mensaje con datos de la nueva parada
 * @param {string} mensaje.origen - Origen del mensaje
 * @param {Object} mensaje.datos - Datos de la parada
 * @param {number} mensaje.datos.paradaId - ID de la nueva parada
 * @param {Object} [mensaje.datos.coordenadas] - Coordenadas de la parada {lat, lng}
 * @param {boolean} [mensaje.datos.centrarMapa] - Si se debe centrar el mapa en la parada
 * @returns {Object} Resultado de la operación
 */
async function manejarCambiarParada(mensaje) {
    const logPrefix = `[NAVEGACION.CAMBIAR_PARADA][${mensaje?.origen || 'desconocido'}]`;
    const mensajeId = mensaje?.mensajeId || generarIdUnico();
    
    try {
        // Extraer IDs antes de loguear para evitar ReferenceError
        const { padreId: padreFromDatos, paradaId: paradaFromDatos } = mensaje.datos || {};
        const resolved = resolverIdsParada(mensaje.datos || {});
        const padreId = padreFromDatos || resolved.padreId;
        const paradaId = paradaFromDatos || resolved.paradaId;
        
        logger.info(`${logPrefix} Procesando cambio de parada`, { mensajeId, datos: mensaje.datos });
        logger.debug(`${logPrefix} resolved IDs:`, { padreId, paradaId });
        
        if (!paradaId && !padreId) {
            throw new Error('ID de parada no especificado (paradaId o padreId)');
        }

        // Guardia: elementos sin ubicación física (pre-intro, intro...) — parada_id es el string "null"
        // o el tipo no corresponde a una parada/tramo con coordenadas reales.
        // Salir limpio para no bloquear consultaParadaPendiente.
        const TIPOS_CON_MAPA = ['inicio', 'parada', 'tramo'];
        const tipoElemento = mensaje.datos?.tipo;
        const paradaIdEsNull = paradaId === 'null' || paradaId === null;
        if (paradaIdEsNull || (tipoElemento && !TIPOS_CON_MAPA.includes(tipoElemento))) {
            logger.info(`${logPrefix} Elemento sin coordenadas de mapa (tipo="${tipoElemento}", paradaId="${paradaId}") — ignorando`);
            return { exito: false, error: 'elemento_sin_coordenadas' };
        }

        // Validar que el mapa esté inicializado
        if (!_mapaInstance) {
            throw new Error('Mapa no inicializado');
        }

        // Verificar si ya hay una consulta pendiente
        if (estadoMapa.consultaParadaPendiente) {
            logger.warn(`${logPrefix} Ya hay una consulta de parada pendiente, ignorando nueva solicitud`);
            return { exito: false, error: 'Consulta pendiente' };
        }

        // Validar que la parada existe en AVENTURA_PARADAS (soporta both padreId and paradaId)
        const idToMatch = padreId || paradaId;
        const idSinPrefijo = idToMatch?.startsWith('padre-') ? idToMatch.substring(6) : idToMatch;

        // Lazy-init: si AVENTURA_PARADAS está vacío pero los datos ya están cargados, poblarlo ahora
        if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS && globalThis.aventuraSeleccionada) {
            const _lazyCoords = globalThis.__vv_DATOS_AVENTURAS?.[globalThis.aventuraSeleccionada]?.['coordenadas-hijo2.html']?.coordenadas;
            if (_lazyCoords?.length) {
                globalThis.AVENTURA_PARADAS = _lazyCoords;
                logger.warn(`${logPrefix} AVENTURA_PARADAS lazy-init: ${_lazyCoords.length} elementos para ${globalThis.aventuraSeleccionada}`);
            }
        }

        // DEBUG: Verificar estructura del array
        logger.debug(`${logPrefix} 🔍 Buscando parada con idToMatch=${idToMatch}, idSinPrefijo=${idSinPrefijo}`);
        logger.debug(`${logPrefix} 🔍 AVENTURA_PARADAS tiene ${globalThis.AVENTURA_PARADAS?.length || 0} elementos`);
        if (globalThis.AVENTURA_PARADAS?.length > 0) {
            const firstElement = globalThis.AVENTURA_PARADAS[0];
            logger.debug(`${logPrefix} 🔍 Primer elemento estructura:`, {
                id: firstElement.id,
                padreid: firstElement.padreid,
                parada_id: firstElement.parada_id,
                tramo_id: firstElement.tramo_id,
                tipo: firstElement.tipo
            });
        }
        
        const paradaBase = globalThis.AVENTURA_PARADAS?.find(p => 
            p.padreid === idToMatch || 
            p.parada_id === idToMatch || 
            p.tramo_id === idToMatch || 
            p.id === idToMatch || 
            p.parada_id === idSinPrefijo || 
            p.tramo_id === idSinPrefijo ||
            p.id === idSinPrefijo
        );
        
        logger.debug(`${logPrefix} 🔍 Resultado búsqueda: ${paradaBase ? 'ENCONTRADA' : 'NO ENCONTRADA'}`);
        if (paradaBase) {
            logger.debug(`${logPrefix} 🔍 Parada encontrada:`, { id: paradaBase.id, tipo: paradaBase.tipo });
        }
        
        if (!paradaBase) {
            throw new Error(`Parada ${paradaId} (idToMatch=${idToMatch}, idSinPrefijo=${idSinPrefijo}) no encontrada en datos base (AVENTURA_PARADAS tiene ${globalThis.AVENTURA_PARADAS?.length || 0} elementos)`);
        }

        // Registrar consulta pendiente (usar parsed id)
        const resolvedParadaId = paradaBase.parada_id || paradaBase.tramo_id || paradaBase.id;
        const resolvedPadreId = paradaBase.padreid || `padre-${resolvedParadaId}`;
        estadoMapa.consultaParadaPendiente = {
            paradaId: resolvedParadaId,
            padreId: resolvedPadreId,
            origen: mensaje.origen,
            timestamp: Date.now(),
            mensajeId
        };
        estadoMapa.esperandoCoordenadas = true;
        estadoMapa.datosRecopilados = {};

        logger.info(`${logPrefix} Iniciando consulta de coordenadas para parada ${paradaId}`);

        // Red de seguridad: si hijo2 no responde en 8s, limpiar el lock para no bloquear zooms futuros
        const _timeoutSeguridad = setTimeout(() => {
            if (estadoMapa.consultaParadaPendiente?.paradaId === resolvedParadaId) {
                logger.warn(`${logPrefix} Timeout de seguridad: sin respuesta de hijo2 para ${resolvedParadaId} — limpiando lock`);
                estadoMapa.consultaParadaPendiente = null;
                estadoMapa.esperandoCoordenadas = false;
                estadoMapa.datosRecopilados = {};
            }
        }, 8000);

        // Ruta 1: caché local del padre (mismo window, sin postMessage, sin race condition)
        const _aventura = globalThis.aventuraSeleccionada;
        const _datosAv = globalThis.__vv_DATOS_AVENTURAS?.[_aventura];
        const _todasCoords = _datosAv?.['coordenadas-hijo2.html']?.coordenadas || [];
        const _entrada = _todasCoords.find(c => c.id === resolvedParadaId);
        if (_entrada) {
            const _lat = _entrada.lat ?? _entrada.coordenadas?.lat ?? _entrada.inicio?.lat;
            const _lng = _entrada.lng ?? _entrada.coordenadas?.lng ?? _entrada.inicio?.lng;
            if (_lat != null && _lng != null) {
                clearTimeout(_timeoutSeguridad);
                logger.info(`${logPrefix} Coordenadas del caché local (globalThis.__vv_DATOS_AVENTURAS) — zoom sin postMessage`);
                await procesarRespuestaConsulta('coordenadas', {
                    paradaId: resolvedParadaId,
                    id: _entrada.id,
                    tipo: _entrada.tipo,
                    nombre: _entrada.nombre,
                    lat: _lat,
                    lng: _lng,
                    coordenadas: _entrada.coordenadas || _entrada.inicio || { lat: _lat, lng: _lng },
                    coordenadasFin: _entrada.fin || null,
                    waypoints: _entrada.waypoints || [],
                    imagen: _entrada.imagen || null,
                    video: _entrada.video || null
                });
                return { exito: true, estado: 'coordenadas_cache_local' };
            }
        }

        // Ruta 2 (fallback): pedir coordenadas a hijo2 vía postMessage
        logger.info(`${logPrefix} Parada ${resolvedParadaId} no encontrada en caché local — solicitando a hijo2`);
        await enviarConsultaCoordenadas(resolvedParadaId, resolvedPadreId);

        logger.info(`${logPrefix} Consulta enviada a hijo2, esperando respuesta`);

        return { exito: true, estado: 'consultas_enviadas' };
        
    } catch (error) {
        logger.error(`${logPrefix} Error al procesar cambio de parada: ${error.message}`, error);
        
        // Limpiar estado en caso de error
        estadoMapa.consultaParadaPendiente = null;
        estadoMapa.esperandoCoordenadas = false;
        estadoMapa.datosRecopilados = {};
        
        enviarMensaje({
            destino: mensaje.origen,
            tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
            origen: 'funciones-mapa',
            mensajeId: generarIdUnico(),
            datos: {
                error: error.message,
                mensajeOriginalId: mensajeId,
                tipo: 'ERROR_CAMBIO_PARADA'
            }
        });
        
        return { exito: false, error: error.message };
    }
}

/**
 * Envía consulta de coordenadas a hijo2
 * @param {string} paradaId - ID de la parada
 */
async function enviarConsultaCoordenadas(paradaId, padreId) {
    const mensajeId = generarIdUnico();
    enviarMensaje({
        destino: 'hijo2',
        tipo: TIPOS_MENSAJE.NAVEGACION.SOLICITAR_COORDENADAS,
        origen: resolverIdPadre(),
        mensajeId,
        datos: { 
            paradaId,
            padreId,
            tipoConsulta: globalThis.mensajeria?.getHijoTipo('hijo2') ?? 'COORDENADAS'
        }
    });
}


/**
 * Procesa respuestas de consultas y actualiza mapa cuando todas llegan
 */
async function procesarRespuestaConsulta(tipo, datos) {
    const logPrefix = `[PROCESAR_RESPUESTA][${tipo}]`;
    
    try {
        // Validar que los datos existen
        if (!datos || typeof datos !== 'object') {
            logger.error(`${logPrefix} Datos inválidos o nulos recibidos`, datos);
            return;
        }
        
        const { paradaId } = datos;
        
        // Verificar que hay consulta pendiente
        if (!estadoMapa.consultaParadaPendiente || estadoMapa.consultaParadaPendiente.paradaId !== paradaId) {
            logger.warn(`${logPrefix} Respuesta para parada no pendiente: ${paradaId}`);
            return;
        }
        
        // Almacenar datos según tipo
        if (tipo === 'coordenadas') {
            estadoMapa.datosRecopilados.coordenadas = datos;
            estadoMapa.esperandoCoordenadas = false;

            // Distribuir imagen/video a hijo2 si están presentes
            if (datos?.imagen !== undefined && datos?.video !== undefined) {
                try {
                    enviarMensaje({
                        destino: 'hijo2',
                        tipo: TIPOS_MENSAJE.NAVEGACION.RESPUESTA_DATOS_PARADAS,
                        origen: 'funciones-mapa',
                        datos: {
                            paradas: [datos],
                            paradaActual: datos.paradaId || datos.id,
                            timestamp: Date.now()
                        }
                    });
                    logger.info(`${logPrefix} Información completa distribuida a hijo2:`, {
                        paradaId: datos.paradaId || datos.id,
                        tieneImagen: !!datos.imagen,
                        tieneVideo: !!datos.video
                    });
                } catch (error) {
                    logger.error(`${logPrefix} Error distribuyendo datos a hijo2:`, error);
                }
            }
        }

        logger.info(`${logPrefix} Datos recopilados para ${paradaId}`);

        if (!estadoMapa.esperandoCoordenadas) {
            logger.info(`${logPrefix} ✅ Respuesta de coordenadas recibida - llamando a completarCambioParada`);
            await completarCambioParada();
        }
        
    } catch (error) {
        logger.error(`${logPrefix} Error procesando respuesta:`, error);
    }
}

/**
 * Completa el cambio de parada cuando todas las consultas responden.
 * ÚNICO PUNTO de zoom en toda la app — ni padre ni hijo hacen zoom por su cuenta.
 */
async function completarCambioParada() {
    const logPrefix = '[COMPLETAR_CAMBIO_PARADA]';
    
    try {
        const { paradaId, padreId: resolvedPadreId, origen, mensajeId } = estadoMapa.consultaParadaPendiente;
        const { coordenadas, audio, reto } = estadoMapa.datosRecopilados;
        
        logger.info(`${logPrefix} ⚡ Completando cambio de parada ${paradaId}`);
        logger.debug(`${logPrefix} DEBUG coordenadas:`, coordenadas);
        
        // Resetear flag de interacción del usuario al cambiar de parada/tramo
        estadoMapa.usuarioMovioMapa = false;
        
        // Actualizar marcador si hay coordenadas
        if (coordenadas?.lat && coordenadas?.lng) {
            logger.info(`${logPrefix} ✅ Coordenadas válidas (${coordenadas.lat}, ${coordenadas.lng}) - iniciando zoom`);
            // Si el mapa no está inicializado, esperar a que se inicialice
            if (!_mapaInstance) {
                logger.info(`${logPrefix} Mapa no inicializado, esperando inicialización...`);
                const maxWaitTime = 5000;
                const checkInterval = 100;
                let waited = 0;
                while (!_mapaInstance && waited < maxWaitTime) {
                    await new Promise(resolve => setTimeout(resolve, checkInterval));
                    waited += checkInterval;
                }
                if (!_mapaInstance) {
                    logger.warn(`${logPrefix} Mapa no se inicializó, abortando para parada: ${paradaId}`);
                    return;
                }
            }

            // Limpiar marcador anterior si existía
            if (marcadorParadaActual) {
                try { marcadorParadaActual.remove(); } catch (_e) { /* ignore */ } // NOSONAR
                marcadorParadaActual = null;
            }

            // Limpiar polylines/rutas activas antes de dibujar la nueva
            rutasActivas.forEach(r => { try { r.remove(); } catch (_e){} }); // NOSONAR
            rutasActivas = [];
            rutasTramos.forEach(r => { try { r.remove(); } catch (_e){} }); // NOSONAR
            rutasTramos = [];

            // Limpiar marcadores de tramo anteriores (siempre, no solo al dibujar tramo nuevo)
            ['tramo-inicio-ruta', 'tramo-fin-ruta'].forEach(k => {
                const old = marcadoresParadas.get(k);
                if (old) { try { old.remove(); } catch (_e) {} marcadoresParadas.delete(k); } // NOSONAR
            });

            // Determinar si es tramo o parada
            const esTramo = coordenadas.tipo === 'tramo' || !!coordenadas.coordenadasFin;
            // Los emojis se añaden a continuación en cada rama (tramo/parada).

            // ============================================================
            // ZOOM: out→in si hay parada previa, solo in si es la primera
            // ============================================================

            const zoomMax = (CONFIG?.MAPA?.ZOOM_MAX ?? 19) - 1;
            const zoomOut = CONFIG?.MAPA?.ZOOM_INICIAL || 14;
            const durFase = 0.35; // segundos por fase (reducido para respuesta más ágil)
            const tieneParadaAnterior = !!estadoMapa.paradaActual;

            // Helper compartido: espera moveend del mapa con timeout de seguridad
            const esperarMoveEnd = (extraMs = 0) => new Promise(r => {
                let resuelto = false;
                const resolver = () => { if (!resuelto) { resuelto = true; r(); } };
                const fallback = setTimeout(resolver, durFase * 1000 + 600 + extraMs);
                if (_mapaInstance) {
                    _mapaInstance.once('moveend', () => { clearTimeout(fallback); resolver(); });
                }
            });

            if (esTramo && coordenadas.coordenadasFin) {
                // TRAMO: dibujar polyline azul
                const tramoData = {
                    inicio: { lat: coordenadas.lat, lng: coordenadas.lng },
                    fin: coordenadas.coordenadasFin,
                    waypoints: coordenadas.waypoints || []
                };
                const polyline = dibujarTramo(tramoData, false);
                if (polyline) {
                    rutasActivas.push(polyline);
                    logger.info(`${logPrefix} Tramo dibujado para ${paradaId}`);
                }

                // Emoji markers: 📌 inicio, 🎯 fin del tramo
                try {
                    const _ic = getIconoEscalado();
                    ['tramo-inicio-ruta', 'tramo-fin-ruta'].forEach(k => {
                        const old = marcadoresParadas.get(k);
                        if (old) { try { old.remove(); } catch (_e) {} marcadoresParadas.delete(k); } // NOSONAR
                    });
                    if (tramoData.inicio) {
                        const mI = _crearMarcadorHTML(tramoData.inicio,
                            `<div style="font-size:${_ic.inicio}px;line-height:${_ic.inicio}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">📌</div>`,
                            { className: 'tramo-inicio-icon', zIndex: 600 }
                        );
                        marcadoresParadas.set('tramo-inicio-ruta', mI);
                    }
                    if (tramoData.fin) {
                        const mF = _crearMarcadorHTML(tramoData.fin,
                            `<div style="font-size:${_ic.parada}px;line-height:${_ic.parada}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🎯</div>`,
                            { className: 'tramo-fin-icon', zIndex: 600 }
                        );
                        marcadoresParadas.set('tramo-fin-ruta', mF);
                    }
                } catch(e) { logger.warn(`${logPrefix} Error añadiendo marcadores tramo:`, e); } // NOSONAR

                const puntos = [tramoData.inicio, ...tramoData.waypoints, tramoData.fin]
                    .filter(p => p?.lat && p?.lng);

                if (puntos.length > 1) {
                    logger.info(`${logPrefix} 🎬 Iniciando zoom para TRAMO ${paradaId} (${puntos.length} puntos)`);
                    estadoMapa.zoomEnCurso = true;

                    // Si hay parada anterior: zoom-out desde posición actual primero
                    if (tieneParadaAnterior) {
                        logger.debug(`${logPrefix} 📤 Zoom-out a nivel ${zoomOut} desde parada anterior`);
                        await ejecutarOperacionMapa(mapa => {
                            mapa.flyTo({ center: mapa.getCenter(), zoom: zoomOut, duration: durFase * 1000 });
                            return true;
                        }).catch(err => logger.error(`${logPrefix} ❌ Error en zoom-out tramo:`, err));
                        await esperarMoveEnd();
                    }

                    // Zoom-in final: centrar en el inicio del tramo (donde está 📌)
                    const centroInicio = [tramoData.inicio.lat, tramoData.inicio.lng];
                    logger.debug(`${logPrefix} 📥 Zoom-in a ${centroInicio} nivel ${zoomMax}`);
                    await ejecutarOperacionMapa(mapa => {
                        mapa.flyTo({ center: aLngLat(centroInicio), zoom: zoomMax, duration: durFase * 1.5 * 1000 });
                        return true;
                    }).catch(err => logger.error(`${logPrefix} ❌ Error en flyTo inicio tramo:`, err));

                    await esperarMoveEnd(200);
                    estadoMapa.zoomEnCurso = false;
                    logger.info(`${logPrefix} ✅ Zoom TRAMO completado`);
                }
            } else {
                // PARADA: zoom-out→in si hay anterior, solo in si es la primera
                const destino = [coordenadas.lat, coordenadas.lng];
                logger.debug(`${logPrefix} Parada individual ${paradaId} — zoom ${tieneParadaAnterior ? 'out→in' : 'in'}`);

                // Emoji 🎯 en la parada actual
                try {
                    const _ic = getIconoEscalado();
                    const mP = _crearMarcadorHTML(coordenadas,
                        `<div style="font-size:${_ic.parada}px;line-height:${_ic.parada}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🎯</div>`,
                        { className: 'custom-marker-emoji', title: paradaId, zIndex: 600 }
                    );
                    marcadorParadaActual = mP;
                } catch(e) { logger.warn(`${logPrefix} Error añadiendo marcador parada:`, e); } // NOSONAR

                logger.info(`${logPrefix} 🎬 Iniciando zoom para PARADA ${paradaId} a ${destino}`);
                estadoMapa.zoomEnCurso = true;

                // Si hay parada anterior: zoom-out desde posición actual
                if (tieneParadaAnterior) {
                    logger.debug(`${logPrefix} 📤 Zoom-out a nivel ${zoomOut} desde parada anterior`);
                    await ejecutarOperacionMapa(mapa => {
                        mapa.flyTo({ center: mapa.getCenter(), zoom: zoomOut, duration: durFase * 1000 });
                        return true;
                    }).catch(err => logger.error(`${logPrefix} ❌ Error en zoom-out parada:`, err));
                    await esperarMoveEnd();
                }

                // Zoom-in al destino
                logger.debug(`${logPrefix} 📥 Zoom-in a ${destino} nivel ${zoomMax}`);
                await ejecutarOperacionMapa(mapa => {
                    mapa.flyTo({ center: aLngLat(destino), zoom: zoomMax, duration: durFase * 1.5 * 1000 });
                    return true;
                }).catch(err => logger.error(`${logPrefix} ❌ Error en flyTo parada:`, err));

                await esperarMoveEnd(200);
                estadoMapa.zoomEnCurso = false;
                logger.info(`${logPrefix} ✅ Zoom PARADA completado`);
            }
            
            estadoMapa.ultimoZoomAuto = Date.now();
            logger.info(`${logPrefix} 🎯 Zoom único aplicado para ${paradaId}`);

            // Ocultar navegación por defecto; revelar inmediatamente si btn-avanzar o modo CASA
            if (globalThis.estadoPadre?.pendingRevealNavegacion) {
                globalThis.estadoPadre.pendingRevealNavegacion = false;
                logger.info(`${logPrefix} pendingRevealNavegacion=true — navegación visible inmediatamente`);
            } else if (globalThis.estadoPadre?.modo?.actual !== 'aventura') {
                // En modo CASA (y cualquier otro no-aventura), la navegación es visible al instante
                logger.info(`${logPrefix} Modo ${globalThis.estadoPadre?.modo?.actual || 'casa'} — navegación visible inmediatamente`);
            } else {
                _ocultarNavegacion();
                logger.info(`${logPrefix} Navegación oculta hasta que el usuario pulse btn-avanzar`);
            }
        } else {
            logger.warn(`${logPrefix} ⚠️ NO SE HIZO ZOOM - coordenadas inválidas:`, { 
                lat: coordenadas?.lat, 
                lng: coordenadas?.lng,
                coordenadasCompletas: coordenadas 
            });
        }
        
        if (audio) {
            logger.info(`${logPrefix} Audio disponible: ${audio.url || 'N/A'}`);
        }
        if (reto) {
            logger.info(`${logPrefix} Reto disponible: ${reto.pregunta || 'N/A'}`);
        }
        
        // Snap-to-route: activar flecha sobre polyline en tramos, desactivar en paradas
        const esTramo = coordenadas?.tipo === 'tramo';
        if (esTramo) {
            const tramoWaypts = [
                { lat: coordenadas.lat, lng: coordenadas.lng },
                ...(coordenadas.waypoints || []),
                ...(coordenadas.coordenadasFin ? [coordenadas.coordenadasFin] : [])
            ].filter(p => p?.lat && p?.lng);
            estadoMapa.tramoActual = paradaId;
            estadoMapa.tramoWaypoints = tramoWaypts;
            activarFlechaUsuario();
        } else {
            estadoMapa.tramoActual = null;
            estadoMapa.tramoWaypoints = null;
            desactivarFlechaUsuario();
        }

        // Actualizar estado
        estadoMapa.paradaActual = paradaId;
        estadoMapa.timestamp = Date.now();
        
        // Confirmar a hijo5-casa
        enviarMensaje({
            destino: origen,
            tipo: TIPOS_MENSAJE.NAVEGACION.CAMBIO_PARADA_CONFIRMADO,
            origen: 'funciones-mapa',
            datos: {
                    paradaId,
                    parada_id: paradaId,
                    padreId: resolvedPadreId || null,
                    padreid: resolvedPadreId || null,
                    mensajeOriginalId: mensajeId,
                    coordenadas,
                    audio: !!audio,
                    reto: !!reto
                }
        });
        
        logger.info(`${logPrefix} Cambio de parada completado exitosamente`);

    } catch (error) {
        logger.error(`${logPrefix} Error completando cambio de parada:`, error);
    } finally {
        // Limpiar estado SIEMPRE, incluso si hay error
        estadoMapa.consultaParadaPendiente = null;
        estadoMapa.datosRecopilados = {};
    }
}

/** MapLibre Marker no tiene setOpacity — se ajusta el estilo CSS del elemento directamente. */
function _setOpacidadMarcador(marcador, opacidad) {
    const el = marcador?.getElement?.();
    if (el) el.style.opacity = String(opacidad);
}

function _ocultarNavegacion() {
    rutasActivas.forEach(r => { try { r.setStyle({ opacity: 0 }); } catch(e) {} }); // NOSONAR
    ['tramo-inicio-ruta', 'tramo-fin-ruta'].forEach(k => {
        const m = marcadoresParadas.get(k);
        if (m) { try { _setOpacidadMarcador(m, 0); } catch(e) {} } // NOSONAR
    });
    if (marcadorParadaActual) { try { _setOpacidadMarcador(marcadorParadaActual, 0); } catch(e) {} } // NOSONAR
    estadoMapa.gpsVisualActivo = false;
    sincronizarEstadoGPSConPadre();
}

export function revelarNavegacion() {
    rutasActivas.forEach(r => { try { r.setStyle({ opacity: 0.7 }); } catch(e) {} }); // NOSONAR
    ['tramo-inicio-ruta', 'tramo-fin-ruta'].forEach(k => {
        const m = marcadoresParadas.get(k);
        if (m) { try { _setOpacidadMarcador(m, 1); } catch(e) {} } // NOSONAR
    });
    if (marcadorParadaActual) { try { _setOpacidadMarcador(marcadorParadaActual, 1); } catch(e) {} } // NOSONAR
    estadoMapa.gpsVisualActivo = true;
    sincronizarEstadoGPSConPadre();
}



/**
 * Función de diagnóstico GPS para debugging
 * @returns {Object} Información de diagnóstico GPS
 */
export async function diagnosticarGPS() {
    const diagnostico = {
        timestamp: new Date().toISOString(),
        navegador: {
            userAgent: navigator.userAgent,
            geolocationSoportada: !!navigator.geolocation,
            permisosSoportados: !!navigator.permissions,
            protocolo: location.protocol,
            hostname: location.hostname,
            esHttps: location.protocol === 'https:',
            esLocalhost: location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        },
        gpsEstado: {
            activo: estadoMapa.gpsActivo,
            posicionUsuario: estadoMapa.posicionUsuario,
            gpsActivo: estadoMapa.gpsActivo,
            gpsPermisos: estadoMapa.gpsPermisos,
            gpsError: estadoMapa.gpsError,
            gpsPrecision: estadoMapa.gpsPrecision,
            ultimaUbicacion: estadoMapa.ultimaUbicacion
        }
    };

    // Verificar permisos actuales
    if (navigator.permissions) {
        try {
            const permiso = await navigator.permissions.query({ name: 'geolocation' });
            diagnostico.permisosActuales = {
                estado: permiso.state,
                concedido: permiso.state === 'granted',
                denegado: permiso.state === 'denied',
                prompt: permiso.state === 'prompt'
            };
        } catch (error) {
            diagnostico.permisosActuales = { error: error.message };
        }
    }

    // Intentar obtener ubicación actual para test
    if (navigator.geolocation) {
        try {
            const posicion = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: ajustarTimeoutPorConexion(15000), // Aumentado de 5s a 15s base para primera carga
                    maximumAge: 0
                });
            });
            diagnostico.testUbicacion = {
                exito: true,
                lat: posicion.coords.latitude,
                lng: posicion.coords.longitude,
                accuracy: posicion.coords.accuracy,
                timestamp: posicion.timestamp
            };
        } catch (error) {
            diagnostico.testUbicacion = {
                exito: false,
                error: error.message,
                codigo: error.code
            };
        }
    }

    logger.info('[GPS.DIAGNOSTICO]', diagnostico);
    return diagnostico;
}
async function verificarPermisosGeolocalizacion() {
    const logPrefix = '[verificarPermisosGeolocalizacion]';

    try {
        // Verificar si estamos en HTTPS (requerido para geolocalización en la mayoría de navegadores)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            const warningMsg = 'Geolocalización requiere HTTPS. Sirve la aplicación con HTTPS para funcionalidad GPS completa.';
            logger.warn(`${logPrefix} ${warningMsg}`);
            
            // Enviar advertencia al usuario
            enviarMensaje({
                tipo: TIPOS_MENSAJE.SISTEMA.ADVERTENCIA,
                origen: 'funciones-mapa',
                destino: resolverIdPadre(),
                datos: {
                    titulo: 'HTTPS Requerido',
                    mensaje: warningMsg,
                    contexto: 'gps_https'
                }
            });
        }

        // Verificar si el navegador soporta la API de permisos
        if (!navigator.permissions) {
            logger.warn(`${logPrefix} API de permisos no soportada, asumiendo permisos concedidos`);
            return true;
        }

        // Verificar estado de permisos de geolocalización
        const permiso = await navigator.permissions.query({ name: 'geolocation' });

        logger.info(`${logPrefix} Estado de permisos de geolocalización: ${permiso.state}`);

        switch (permiso.state) {
            case 'granted':
                return true;
            case 'denied':
                logger.error(`${logPrefix} Permisos de geolocalización denegados por el usuario`);
                return false;
            case 'prompt':
                logger.info(`${logPrefix} Solicitando permisos de geolocalización al usuario...`);
                // El permiso se solicitará automáticamente cuando se llame a watchPosition/getCurrentPosition
                return true; // Permitir que watchPosition maneje el prompt
            default:
                logger.warn(`${logPrefix} Estado de permisos desconocido: ${permiso.state}`);
                return true;
        }
    } catch (error) {
        logger.error(`${logPrefix} Error verificando permisos: ${error.message}`, error);
        // En caso de error, asumir que podemos proceder (para compatibilidad con navegadores antiguos)
        return true;
    }
}

/**
 * Capa adaptadora GPS para contexto iframe.
 * DISEÑO INTENCIONAL — no duplica lógica con activarGPS() en codigo-padre.html.
 * Si se ejecuta en el padre (globalThis.parent === window), delega directamente a globalThis.activarGPS().
 * Si se ejecuta en un iframe hijo, envía postMessage al padre para que él active el GPS.
 * La implementación real (navigator.geolocation.watchPosition) vive únicamente en codigo-padre.html.
 *
 * @param {Object} mensaje - Mensaje de activación GPS
 * @returns {Object} Resultado de la operación
 */
export async function manejarGPSActivar(mensaje) {
    const logPrefix = `[GPS.ACTIVAR][${mensaje?.origen || 'desconocido'}]`;

    try {
        try { typeof globalThis.incrementarContador === 'function' && globalThis.incrementarContador('gps.activaciones_intentadas'); } catch (_e) { /* ignore */ } // NOSONAR
        // Si ya estamos en el contexto del padre, delegar a la implementación centralizada
        if (globalThis.parent === globalThis.window) {
            logger.info(`${logPrefix} En contexto padre: delegando a la implementación centralizada (globalThis.activarGPS)`);
            try {
                if (typeof globalThis.activarGPS === 'function') {
                    const res = await globalThis.activarGPS();
                    // sincronizar estado local con el estado global del padre
                    sincronizarEstadoGPSConPadre();
                    try { typeof globalThis.incrementarContador === 'function' && globalThis.incrementarContador('gps.activaciones_ok'); } catch (_e) { /* ignore */ } // NOSONAR
                    return { exito: true, detalle: res };
                }
                // Fallback: mantener comportamiento previo (marcar activo) y sincronizar
                estadoMapa.gpsActivo = true;
                estadoMapa.gpsPermisos = true;
                estadoMapa.gpsError = null;
                sincronizarEstadoGPSConPadre();
                return { exito: true };
            } catch (err) {
                logger.error(`${logPrefix} Error delegando activación al padre:`, err);
                estadoMapa.gpsError = err.message || String(err);
                sincronizarEstadoGPSConPadre();
                try { typeof globalThis.incrementarContador === 'function' && globalThis.incrementarContador('gps.activaciones_fallidas'); } catch (_e) { /* ignore */ } // NOSONAR
                return { exito: false, error: err.message || String(err) };
            }
        }

        // Si estamos en un iframe, delegar al padre
        logger.info(`${logPrefix} Delegando activación GPS al padre`);

        enviarMensaje({
            destino: resolverIdPadre(),
            tipo: TIPOS_MENSAJE.NAVEGACION.GPS.ACTIVAR,
            origen: 'funciones-mapa',
            datos: {
                timestamp: Date.now(),
                razon: 'delegacion_desde_iframe'
            }
        });

        // Actualizar estado local para compatibilidad
        estadoMapa.gpsActivo = true;
        estadoMapa.gpsPermisos = true;
        estadoMapa.gpsError = null;

        logger.info(`${logPrefix} Solicitud de activación GPS enviada al padre`);
        return { exito: true };

    } catch (error) {
        logger.error(`${logPrefix} Error en activación GPS: ${error.message}`, error);

        // Actualizar estado local (estadoMapa es la única fuente de verdad)
        estadoMapa.gpsError = error.message;
        estadoMapa.gpsActivo = false;

        // Sincronizar con el estado global del padre
        sincronizarEstadoGPSConPadre();

        return { exito: false, error: error.message };
    }
}

/**
 * Maneja el cambio de modo del sistema (casa/aventura).
 * @param {Object} mensaje - Mensaje con datos del cambio de modo
 */
async function manejarCambioModoMapa(mensaje) {
    const logPrefix = `[SISTEMA.CAMBIO_MODO][${mensaje?.origen || 'desconocido'}]`;
    const mensajeId = mensaje?.mensajeId || generarIdUnico();
    
    try {
        logger.info(`${logPrefix} Procesando cambio de modo`, { mensajeId, datos: mensaje.datos });
        
        if (!mensaje?.datos?.modo) {
            throw new Error('Modo no especificado en el mensaje');
        }

        const { modo } = mensaje.datos;
        
        // Validar modo
        if (modo !== MODOS.CASA && modo !== MODOS.AVENTURA) {
            throw new Error(`Modo inválido: ${modo}. Debe ser '${MODOS.CASA}' o '${MODOS.AVENTURA}'`);
        }

        // Actualizar estado local
        const modoAnterior = estadoMapa.modo;
        estadoMapa.modo = modo;
        estadoMapa.timestamp = Date.now();

        logger.info(`${logPrefix} Cambiando modo: ${modoAnterior} → ${modo}`);

        // Si cambia a AVENTURA, asegurar que el GPS esté activo (normalmente ya lo
        // está desde P14 — ver codigo-padre.html:_hdl_SELECCION_P14_MOSTRADA — esto
        // es red de seguridad si se desactivó por algún motivo). manejarGPSActivar()
        // es el adaptador real: delega a activarGPS() (el hub, en codigo-padre.html),
        // nunca finge el estado.
        if (modo === MODOS.AVENTURA) {
            await manejarGPSActivar({ origen: 'cambio-modo-aventura' });
        }
        // En modo CASA, el GPS permanece activo pero sin validaciones de distancia

        // Aplicar cambios según el modo usando la lógica existente de limpiarPorEstado
        // resetCompleto=true cuando hay cambio real de modo, porque estadoMapa.modo ya
        // fue actualizado arriba y la comparación interna de limpiarPorEstado no lo detectaría
        const limpiado = limpiarPorEstado({ modo, resetCompleto: modoAnterior !== modo });
        
        logger.info(`${logPrefix} DEBUG: Cambio de modo ${modoAnterior} -> ${modo}, limpiado=${limpiado}`);
        
        // Restaurar la vista del mapa al centro/zoom por defecto (CONFIG.MAPA)
        try {
            const defaultCenter = CONFIG?.MAPA?.CENTRO_DEFECTO ?? [39.4699, -0.3763];
            const defaultZoom = (typeof CONFIG?.MAPA?.ZOOM_INICIAL === 'number') ? CONFIG.MAPA.ZOOM_INICIAL : 13;
            logger.debug(`${logPrefix} Restaurando vista por defecto: center=${JSON.stringify(defaultCenter)}, zoom=${defaultZoom}`);
            // Usar setMapView para garantizar normalización/validación
            await setMapView(defaultCenter, defaultZoom, { animate: true, duration: 0.6 });
            logger.info(`${logPrefix} Vista del mapa restaurada al zoom por defecto: ${defaultZoom}`);
        } catch (e) { // NOSONAR
            logger.warn(`${logPrefix} No se pudo restaurar la vista del mapa al valor por defecto:`, e);
        }

        // Aquí se podrían agregar cambios específicos de estilos/interacción del mapa
        // Por ahora, delegamos a limpiarPorEstado que ya maneja la lógica básica

        logger.success(`${logPrefix} Cambio de modo completado exitosamente: ${modo}`);
        
        return { 
            exito: true, 
            modo: modo,
            modoAnterior: modoAnterior,
            limpiado: limpiado,
            mensajeId: mensajeId
        };

    } catch (error) {
        logger.error(`${logPrefix} Error procesando cambio de modo:`, error);
        
        // Enviar mensaje de error si es posible
        try {
            enviarMensaje({
                tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
                origen: 'funciones-mapa',
                destino: mensaje?.origen || resolverIdPadre(),
                mensajeId: generarIdUnico(),
                datos: {
                    error: error.message,
                    mensajeOriginalId: mensajeId,
                    tipo: 'ERROR_CAMBIO_MODO_MAPA'
                }
            });
        } catch (sendError) {
            logger.error(`${logPrefix} Error enviando mensaje de error:`, sendError);
        }
        
        return { exito: false, error: error.message };
    }
}


/**
 * Registra los manejadores de mensajes para el mapa.
 */
export function registrarManejadoresMensajes() {
    try {
        // Validar que la función registrarControlador está disponible
        if (typeof registrarControlador !== 'function') {
            throw new TypeError('La función registrarControlador no está disponible');
        }
        
        // Controladores de navegación adicionales
        // NOTA: SISTEMA.CAMBIO_MODO lo registra _hdl_SISTEMA_CAMBIO_MODO en codigo-padre.html Script 1
        // (permanente: true). Ese handler llama a globalThis.funcionesMapa.manejarCambioModoMapa()
        // para las actualizaciones de mapa. No registrar aquí para evitar que funciones-mapa
        // gane la carrera de inserción en getMapaControladoresSync() (primer-wins).
        // CAMBIO_PARADA: el handler de mensajería lo gestiona padre (codigo-padre.html)
        // que coordina hijo2/hijo3/hijo4/hijo5. Funciones-mapa escucha un CustomEvent
        // disparado por padre DESPUÉS de procesar, para dibujar marcadores/polylines/zoom.
        globalThis.addEventListener('vv-parada-cambiada', async (e) => {
            try {
                const mensajeOriginal = e.detail;
                logger.info('[funciones-mapa] ⚡ Evento vv-parada-cambiada recibido:', mensajeOriginal?.datos);
                if (mensajeOriginal?.datos) {
                    logger.info('[funciones-mapa] Iniciando manejarCambiarParada para visualización');
                    await manejarCambiarParada(mensajeOriginal); // NOSONAR
                    logger.info('[funciones-mapa] ✅ manejarCambiarParada completado');
                } else {
                    logger.warn('[funciones-mapa] Evento vv-parada-cambiada sin datos');
                }
            } catch (err) {
                logger.error('[funciones-mapa] ❌ Error procesando vv-parada-cambiada:', err);
            }
        });
        // GPS handlers NO se registran aquí — los registra Script 2 de codigo-padre.html
        // con _hdl_NAVEGACION_GPS_ACTIVAR/_DESACTIVAR (verifican modo AVENTURA,
        // gestionan paradaListaParaAvanzar y revelarNavegacion).
        // Si se registrasen aquí primero, state-manager bloquearía el registro de Script 2
        // por "Controlador duplicado" y el handler incompleto de funciones-mapa ganaría.


        // Controlador para solicitar paradas con proximidad avanzada
        // ...existing code...
        

        // Controladores para respuestas de consultas de cambio de parada
        registrarControlador(TIPOS_MENSAJE.NAVEGACION.RESPUESTA_COORDENADAS, async (mensaje) => {
            await procesarRespuestaConsulta('coordenadas', mensaje.datos);
        });
        
        logger.debug('[funciones-mapa] Manejadores de mensajes del mapa registrados correctamente');
        return true;
    } catch (error) {
        logger.error('Error al registrar manejadores de mensajes:', error);
        throw error; // Propagar el error para que se pueda manejar en la inicialización
    }
}

// Exportar calcularToleranciaGPS para pruebas unitarias (no rompe runtime en navegador)
export { calcularToleranciaGPS };

// Registrar manejadores al cargar el módulo.
// NOTA: funciones-mapa.js se carga vía await import() dinámico dentro de
// <script type="module">, por lo que DOMContentLoaded ya habrá disparado
// cuando este código se ejecuta. Usar readyState para decidir si llamar
// inmediatamente o esperar el evento.
try {
    if (globalThis.window !== undefined) {
        if (document.readyState === 'loading') {
            // Raro: DOM todavía parseando — esperar evento
            globalThis.addEventListener('DOMContentLoaded', registrarManejadoresMensajes, { once: true });
        } else {
            // Caso habitual: DOMContentLoaded ya disparó, llamar directamente
            registrarManejadoresMensajes();
        }
    }
} catch (error) {
    logger.error('Error al registrar manejadores de mensajes del mapa:', error);
}

// Bug H fix: actualizar arrayParadasLocal cuando el padre asigna globalThis.AVENTURA_PARADAS
// tras seleccionar aventura (puede ocurrir después de que inicializarServicioMapa ya corrió)
if (globalThis.window !== undefined) {
    globalThis.addEventListener('vv:paradas-disponibles', (e) => {
        const paradas = e.detail;
        if (Array.isArray(paradas) && paradas.length > 0) {
            arrayParadasLocal = normalizarParadas(paradas);
            if (_mapaInstance && estadoMapa.modo === MODOS.AVENTURA) mostrarTodasLasParadas(arrayParadasLocal);
        }
    }, { passive: true });
}

// Integration tests removed from production code (was: probarFlujosError)

// Llamar pruebas en inicialización si está en entorno de prueba

/**
 * Clean unused markers and routes after state reconciliation
 * (Assuming cleanup in limpiarRecursos or similar)
 */

/**
 * Función de diagnóstico del mapa para verificar estado y configuración
 * @returns {Promise<Object>} Resultado del diagnóstico con información del estado del mapa
 */
export async function diagnosticarMapa() {
    try {
        const diagnostico = {
            mapaInicializado: estaInicializado(),
            servicioInicializado: _mapaInstance !== null,
            marcadoresParadas: marcadoresParadas.size,
            marcadoresActivos: marcadoresParadas.size + (marcadorUsuario ? 1 : 0) + (marcadorDestino ? 1 : 0),
            rutasActivas: rutasActivas.length,
            tramosRuta: rutasTramos.length,
            posicionUsuario: estadoMapa.posicionUsuario,
            modoActual: estadoMapa.modo,
            timestamp: new Date().toISOString()
        };

        // Verificar si el mapa está realmente disponible
        if (_mapaInstance) {
            try {
                const center = await getMapCenter();
                diagnostico.centroMapa = center;
                diagnostico.mapaInteractivo = true;
            } catch (error) {
                diagnostico.mapaInteractivo = false;
                diagnostico.errorCentro = error.message;
            }
        }

        logger.info('Diagnóstico del mapa completado:', diagnostico);
        return diagnostico;
    } catch (error) {
        logger.error('Error en diagnóstico del mapa:', error);
        return {
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Inicia un watchPosition de bajo coste para 'precalentar' el GPS (no marca gpsActivo)
 * @returns {Promise<{started:boolean, watchId:number|null}>}
 */
// Precalentamiento GPS eliminado: implementación omitida intencionalmente

/**
 * Pausa (sin destruir) el warmup GPS: detiene el watch pero marca el warmup
 * como inicializado para permitir un reinicio rápido cuando se reanude.
 */
// pausarPrecalentarGPS removed

/**
 * Detiene cualquier warmup GPS activo
 */
// detenerPrecalentarGPS removed

/**
 * Detiene GPS
 */
function detenerGPS() {
    const logPrefix = '[funciones-mapa][GPS]';

    try {
        logger.info(`${logPrefix} Desactivando GPS centralizado del padre`);

        // Actualizar estado GPS directamente (estadoMapa es la única fuente de verdad)
        estadoMapa.gpsActivo = false;
        estadoMapa.gpsPermisos = null;
        estadoMapa.gpsError = null;
        estadoMapa.ultimaUbicacion = null;
        
        // Sincronizar con el estado global del padre
        sincronizarEstadoGPSConPadre();

        logger.info(`${logPrefix} GPS desactivado`);

    } catch (error) {
        logger.error(`${logPrefix} Error al detener GPS:`, error);
    }
}

const _TIPOS_ELEMENTO_NAVEGABLE = ['inicio', 'parada', 'tramo'];

/**
 * Determina el id (parada_id o tramo_id, formato "Av1-P-0"/"Av1-TR-1") del siguiente
 * elemento navegable de la aventura tras `paradaActualId`.
 *
 * Camina `DATOS_PADRE[aventura][idioma].elementosIDpadre` — la secuencia oficial,
 * ya ordenada y sin las entradas `tipo:"referencia"` que sí mezcla el array de
 * coordenadas (`AVENTURA_PARADAS`). Ahí es donde vive el orden real; las coordenadas
 * de destino se resuelven aparte, en `AVENTURA_PARADAS`, buscando por `.id`.
 *
 * `paradaActualId` llega en formato "Av1-P-0" (el mismo que usa `estadoMapa.paradaActual`),
 * así que compara contra `parada_id`/`tramo_id` — nunca contra `padreid`, que en
 * `elementosIDpadre` tiene otro formato ("padre-P0") y en `AVENTURA_PARADAS` no existe.
 */
function _siguienteIdElementoNavegable(aventura, idioma, paradaActualId) {
    const elementos = DATOS_PADRE?.[aventura]?.[idioma]?.elementosIDpadre;
    if (!Array.isArray(elementos) || elementos.length === 0) return null;

    const indiceActual = paradaActualId
        ? elementos.findIndex(e => e.parada_id === paradaActualId || e.tramo_id === paradaActualId)
        : -1;

    for (let i = indiceActual + 1; i < elementos.length; i++) {
        if (_TIPOS_ELEMENTO_NAVEGABLE.includes(elementos[i].tipo)) {
            return elementos[i].parada_id || elementos[i].tramo_id || null;
        }
    }
    return null;
}

/**
 * Procesa posición GPS para detección secuencial en modo aventura
 */
async function procesarPosicionGPSParaAventura(posicion) {
    const logPrefix = '[funciones-mapa][GPS-POSICION]';

    try {
        // Aceptar dos tipos de entrada:
        //  - objeto normalizado: { lat, lng, accuracy }
        //  - objeto Position del API Geolocation: { coords: { latitude, longitude, accuracy }, timestamp }
        let latitude, longitude, accuracy;

        if (posicion?.coords) {
            latitude = posicion.coords.latitude;
            longitude = posicion.coords.longitude;
            accuracy = posicion.coords.accuracy;
        } else {
            latitude = posicion?.lat ?? posicion?.latitude;
            longitude = posicion?.lng ?? posicion?.longitude;
            accuracy = posicion?.accuracy ?? posicion?.precision ?? null;
        }

        logger.debug(`${logPrefix} Posición GPS: lat=${latitude}, lng=${longitude}, accuracy=${accuracy ?? 'N/A'}m`);

        // Actualizar estado (estadoMapa es la única fuente de verdad)
        estadoMapa.gpsPrecision = accuracy;
        estadoMapa.ultimaUbicacion = { lat: latitude, lng: longitude };

        // Sincronizar con el estado global del padre
        sincronizarEstadoGPSConPadre();

        // Solo procesar si precisión disponible y es buena
        if (typeof accuracy === 'number' && accuracy > CONFIG.GPS.PRECISION_MINIMA) {
            logger.debug(`${logPrefix} Precisión insuficiente: ${accuracy}m > ${CONFIG.GPS.PRECISION_MINIMA}m`);
            return;
        }

        // Obtener paradas del array global (asumiendo que está disponible)
        if (globalThis.AVENTURA_PARADAS === undefined) {
            logger.warn(`${logPrefix} Array AVENTURA_PARADAS no disponible`);
            return;
        }

        const paradas = globalThis.AVENTURA_PARADAS;
        const siguienteId = _siguienteIdElementoNavegable(globalThis.aventuraSeleccionada, globalThis.idiomaSeleccionado, estadoMapa.paradaActual);
        if (!siguienteId) {
            logger.info(`${logPrefix} Ruta completada o secuencia de la aventura no disponible`);
            return;
        }

        const siguienteParada = paradas.find(p => p.id === siguienteId);
        // Obtener coordenadas: paradas usan .coordenadas, tramos usan .inicio/.fin
        const coordsSiguiente = siguienteParada 
            ? (siguienteParada.coordenadas || siguienteParada.inicio || siguienteParada.fin || null)
            : null;
        if (!siguienteParada || !coordsSiguiente?.lat || !coordsSiguiente?.lng) {
            logger.info(`${logPrefix} Siguiente parada no válida o sin coordenadas`);
            return;
        }

        // Calcular distancia a siguiente parada
        const distancia = calcularDistancia(latitude, longitude,
            coordsSiguiente.lat, coordsSiguiente.lng);

        // Calcular tolerancia GPS dinámica para el elemento actual
        const toleranciaGPS = calcularToleranciaGPS(siguienteParada);

        logger.debug(`${logPrefix} Distancia a ${siguienteParada.id}: ${Math.ceil(distancia)}m (tolerancia: ${toleranciaGPS}m)`);

        // ✅ CRÍTICO: Actualizar marcador visual del usuario en el mapa (flecha azul)
        // DEBE llamarse ANTES de enviar mensajes para que el usuario vea su posición en tiempo real
        try {
            const heading = posicion?.coords?.heading ?? posicion?.heading ?? 0;
            await actualizarMarcadorUsuario(latitude, longitude, heading, accuracy, 'aventura');
            logger.debug(`${logPrefix} 🗺️ Marcador de usuario actualizado en mapa: [${latitude.toFixed(6)}, ${longitude.toFixed(6)}]`);
        } catch (error_) {
            logger.warn(`${logPrefix} Error actualizando marcador de usuario:`, error_);
        }

        // 📤 Enviar actualización de distancia a hijo2 (botones) periódicamente
        // CRÍTICO: Incluir toleranciaGPS para que hijo2 ajuste lógica de botones dinámicamente
        try {
            enviarMensaje({
                destino: 'hijo2',
                tipo: TIPOS_MENSAJE.NAVEGACION.ACTUALIZAR_ESTADO,
                origen: 'funciones-mapa',
                datos: {
                    distanciaAlDestino: Math.ceil(distancia),
                    idParada: siguienteParada.id,
                    tipoParada: siguienteParada.tipo || 'parada',
                    toleranciaGPS: toleranciaGPS,
                    lat: latitude,
                    lng: longitude,
                    timestamp: Date.now()
                }
            });
            logger.debug(`${logPrefix} 📤 Actualización enviada a hijo2: distancia=${Math.ceil(distancia)}m, tolerancia=${toleranciaGPS}m`);
        } catch (error_) {
            logger.warn(`${logPrefix} Error al enviar actualización de distancia a hijo2:`, error_);
        }

        // 📍 RESET ubicacionActiva: SIEMPRE a 50m fijos (no usar tolerancia dinámica)
        // Razón: Usuario debe estar CERCA (50m) para desactivar ubicación y activar botones
        if (distancia <= 50) {
            try {
                enviarMensaje({
                    destino: 'hijo2',
                    tipo: TIPOS_MENSAJE.NAVEGACION.ACTUALIZAR_ESTADO,
                    origen: 'funciones-mapa',
                    datos: {
                        ubicacionActiva: false, // Usuario a ≤50m, resetear ubicación
                        timestamp: Date.now()
                    }
                });
                logger.info(`${logPrefix} 📍 Estado ubicacionActiva reseteado a FALSE (distancia ${Math.ceil(distancia)}m ≤ 50m)`);
            } catch (error_) {
                logger.warn(`${logPrefix} Error enviando reset de ubicacionActiva:`, error_);
            }
        }

        // Verificar llegada usando tolerancia dinámica
        const llegadaDetectada = verificarLlegadaADestino(
            { lat: latitude, lng: longitude },
            siguienteParada
        );

        // 🗺️ Gestión automática de polylines: remover si distancia ≤50m
        if (distancia <= 50 && (rutasActivas.length > 0 || polylineNavegacion)) {
            logger.info(`${logPrefix} 🗺️ Distancia ≤50m, removiendo polylines automáticamente`);
            try {
                // Limpiar todas las rutas activas
                rutasActivas.forEach(ruta => ruta?.remove());
                rutasActivas = [];

                // Limpiar polylineNavegacion
                if (polylineNavegacion) {
                    polylineNavegacion.remove();
                    polylineNavegacion = null;
                }
                
                logger.debug(`${logPrefix} ✅ Polylines removidas automáticamente`);
            } catch (error_) {
                logger.warn(`${logPrefix} Error removiendo polylines:`, error_);
            }
        } else if (distancia > 50 && !polylineNavegacion) {
            // ✅ DIBUJAR POLYLINE AUTOMÁTICAMENTE cuando usuario está lejos (>50m)
            logger.info(`${logPrefix} 🗺️ Distancia >50m, dibujando polyline automáticamente desde usuario hasta siguiente parada`);
            try {
                // Usar valores escalados según pantalla y zoom
                const peso = getPolylineEscalado();
                
                // Construir array de puntos: usuario → [waypoints si es tramo] → destino
                const puntosPolyline = [[latitude, longitude]];
                if (siguienteParada.tipo === 'tramo' && siguienteParada.waypoints && Array.isArray(siguienteParada.waypoints)) {
                    // Para tramos: usuario → inicio → waypoints → fin
                    if (siguienteParada.inicio) {
                        puntosPolyline.push([siguienteParada.inicio.lat, siguienteParada.inicio.lng]);
                    }
                    siguienteParada.waypoints.forEach(wp => {
                        if (wp?.lat && wp?.lng) {
                            puntosPolyline.push([wp.lat, wp.lng]);
                        }
                    });
                    if (siguienteParada.fin) {
                        puntosPolyline.push([siguienteParada.fin.lat, siguienteParada.fin.lng]);
                    }
                } else {
                    // Para paradas: línea directa
                    puntosPolyline.push([coordsSiguiente.lat, coordsSiguiente.lng]);
                }
                
                polylineNavegacion = _crearPolyline(puntosPolyline, {
                    color: '#3388ff',
                    weight: peso.tramo,
                    opacity: 0.7,
                    dashArray: '10, 10'
                });
                
                logger.debug(`${logPrefix} ✅ Polyline automática dibujada (${puntosPolyline.length} puntos) hasta ${siguienteParada.id}`);
            } catch (error_) {
                logger.warn(`${logPrefix} Error dibujando polyline automática:`, error_);
            }
        }

        // Si está dentro de tolerancia, activar la parada — SOLO en modo AVENTURA
        // En CASA el usuario elige libremente tramo/parada; el GPS nunca fuerza el avance
        if (llegadaDetectada) {
            if (estadoMapa.modo !== MODOS.AVENTURA) {
                logger.debug(`${logPrefix} Llegada detectada en modo ${estadoMapa.modo} — sin avance automático por GPS`);
            } else {
                logger.info(`${logPrefix} 🎯 Activando parada secuencial: ${siguienteParada.id}`);

                // Derivar ids para compatibilidad (padreId vs paradaId)
                const derivedParadaId = siguienteParada.parada_id || siguienteParada.tramo_id || (typeof siguienteParada.padreid === 'string' ? siguienteParada.padreid.replace(/^padre-/, '') : siguienteParada.id || null);
                const derivedPadreId = siguienteParada.padreid || (derivedParadaId ? `padre-${derivedParadaId}` : null);
                enviarMensaje({
                    destino: resolverIdPadre(),
                    tipo: TIPOS_MENSAJE.NAVEGACION.CAMBIO_PARADA,
                    origen: 'funciones-mapa',
                    datos: {
                        paradaId: derivedParadaId,
                        parada_id: derivedParadaId,
                        padreId: derivedPadreId,
                        padreid: derivedPadreId,
                        origen: 'gps-automatico',
                        distancia: distancia,
                        timestamp: Date.now()
                    }
                });
            }
        }

    } catch (error) {
        logger.error(`${logPrefix} Error procesando posición GPS:`, error);
    }
}

// Asignar funciones al objeto global para compatibilidad con código existente
globalThis.funcionesMapa = {
    inicializarServicioMapa,
    estaInicializado,
    invalidarTamañoMapa,
    diagnosticarMapa,
    isMapInitialized,
    mostrarTodasLasParadas,
    limpiarRecursos,
    dibujarRutaConMarcadores,
    dibujarReferencias,
    limpiarReferencias,
    registrarManejadoresMensajes,
    limpiarPorEstado,
    calcularToleranciaGPS,
    verificarLlegadaADestino,
    procesarPosicionGPSParaAventura,
    manejarCambioModoMapa,
    // Exponer la API pública centralizada para cambiar la vista
    setMapView,
    // API para ajustar vista a un rectángulo de coordenadas
    fitMapBounds: async function(puntosLatLng, opciones = {}) {
        return ejecutarOperacionMapa(mapa => {
            const bounds = _bboxDesdePuntos(puntosLatLng);
            // padding: MapLibre acepta un número único o {top,bottom,left,right}
            const padding = Array.isArray(opciones.padding) ? Math.max(...opciones.padding) : (opciones.padding || 80);
            mapa.fitBounds(bounds, {
                padding,
                maxZoom: opciones.maxZoom || 18,
                animate: opciones.animate !== false,
                duration: (opciones.duration || 0.8) * 1000
            });
            return true;
        });
    }
    // Note: GPS warmup helpers removed
};

logger.info('[FUNCIONES-MAPA] ✅ Funciones GPS expuestas globalmente');

// Limpieza agresiva de globales al descargar la página
if (globalThis.window !== undefined) {
    globalThis.addEventListener('pagehide', () => {
        try {
            // Limpiar globales del mapa agresivamente
            if (globalThis.funcionesMapa) {
                delete globalThis.funcionesMapa;
            }
            
            // Limpiar instancia del mapa si existe
            if (_mapaInstance) {
                _mapaInstance.remove();
                _mapaInstance = null;
            }
            
            // Limpiar arrays y mapas
            marcadoresParadas.clear();
            rutasTramos.length = 0;
            rutasActivas.length = 0;
            marcadorUsuario = null;
            marcadorDestino = null;
            _mapaOpciones = null;
            arrayParadasLocal.length = 0;
            
            // Limpiar estado del mapa
            Object.keys(estadoMapa).forEach(key => {
                estadoMapa[key] = null;
            });
            
            // Limpiar listeners de actividad
            if (intervaloLimpiezaAutomatica) {
                clearInterval(intervaloLimpiezaAutomatica);
                intervaloLimpiezaAutomatica = null;
            }
            
            logger.info('Limpieza agresiva de globales del mapa completada');
        } catch (error) {
            // Logging mínimo durante pagehide para evitar errores
            logger.warn('Error en limpieza agresiva del mapa:', error.message);
        }
    });
}

// ==================== CONTROLADORES DE NAVEGACIÓN ====================

/**
 * Dibuja una polyline desde la ubicación del usuario hasta la siguiente parada en modo aventura
 * @param {Object} opciones - Opciones para el dibujo
 * @param {Object} opciones.origen - Coordenadas de origen {lat, lng}
 * @param {Object} opciones.destino - Coordenadas de destino {lat, lng}
 * @param {string} opciones.color - Color de la polyline (default: 'blue')
 * @param {number} opciones.weight - Grosor de la polyline (default: 3)
 */
export function dibujarPolylineNavegacion(opciones = {}) {
    const { origen, destino, opciones: opcionesEstilo = {} } = opciones;
    const color = opcionesEstilo.color || opciones.color || 'blue';
    const weight = opcionesEstilo.weight || opciones.weight;
    const waypoints = opciones.waypoints || [];
    
    if (!_mapaInstance) {
        logger.warn('dibujarPolylineNavegacion: Mapa no inicializado');
        return null;
    }
    
    if (!origen || !destino || !origen.lat || !origen.lng || !destino.lat || !destino.lng) {
        logger.warn('dibujarPolylineNavegacion: Origen o destino inválidos');
        return null;
    }
    
    try {
        // Limpiar polyline anterior si existe
        if (polylineNavegacion) {
            polylineNavegacion.remove();
            polylineNavegacion = null;
        }

        // Limpiar marcador de destino anterior si existe
        if (marcadorDestinoNavegacion) {
            marcadorDestinoNavegacion.remove();
            marcadorDestinoNavegacion = null;
        }

        // Usar valores escalados según pantalla y zoom
        const peso = getPolylineEscalado();
        const iconos = getIconoEscalado();

        // Construir puntos: origen → [waypoints] → destino
        const puntosNav = [[origen.lat, origen.lng]];
        if (Array.isArray(waypoints)) {
            waypoints.forEach(wp => {
                if (wp?.lat && wp?.lng) puntosNav.push([wp.lat, wp.lng]);
            });
        }
        puntosNav.push([destino.lat, destino.lng]);

        // Crear nueva polyline
        polylineNavegacion = _crearPolyline(puntosNav, {
            color: color,
            weight: weight || peso.navegacion,
            opacity: opcionesEstilo.opacity || 0.7,
            dashArray: opcionesEstilo.dashArray || null
        });

        // Crear marcador de destino con emoji 🎯
        marcadorDestinoNavegacion = _crearMarcadorHTML(destino,
            `<div style="font-size:${iconos.destino}px;text-align:center;line-height:${iconos.destino}px;text-shadow:0 2px 4px rgba(0,0,0,0.3);">🎯</div>`,
            { className: 'marcador-destino-navegacion', title: 'Tu destino', zIndex: 500 }
        );
        
        logger.debug(`Polyline de navegación dibujada desde [${origen.lat}, ${origen.lng}] hasta [${destino.lat}, ${destino.lng}] con marcador 🎯`);
        return polylineNavegacion;
    } catch (error) {
        logger.error('Error dibujando polyline de navegación:', error);
        return null;
    }
}

// Variables para la polyline y marcador de navegación
let polylineNavegacion = null;
let marcadorDestinoNavegacion = null;
let marcadorUsuarioGPS = null; // Marcador del usuario con flecha azul
let circuloActivacion = null;  // Círculo naranja 20m — zona de activación de parada

/**
 * Actualiza o crea el marcador del usuario en el mapa
 * @param {number} lat - Latitud del usuario
 * @param {number} lng - Longitud del usuario
 * @param {number} heading - Dirección en grados (0-360, donde 0=Norte)
 * @param {number} accuracy - Precisión del GPS en metros
 * @param {string} modo - 'aventura' (flecha azul) o 'casa' (emoji 🛸)
 */
export function actualizarMarcadorUsuario(lat, lng, heading = 0, accuracy = 0, modo = 'aventura') {
    if (!_mapaInstance) {
        logger.warn('actualizarMarcadorUsuario: Mapa no inicializado');
        return null;
    }
    
    try {
        // ── CRÍTICO: Actualizar estadoMapa.posicionUsuario ──────────────
        // Esta es la ÚNICA ruta viva que recibe posiciones GPS — NAVEGACION.ACTUALIZAR_ESTADO
        // llega directo desde padre. Actualizamos el estado interno aquí para que
        // actualizarPosicionFlecha() funcione.
        estadoMapa.posicionUsuario = {
            lat,
            lng,
            precision: accuracy,
            timestamp: Date.now()
        };

        // Limpiar marcador anterior si existe
        if (marcadorUsuarioGPS) {
            marcadorUsuarioGPS.remove();
            marcadorUsuarioGPS = null;
        }
        
        // Obtener valores escalados según pantalla y zoom
        const iconos = getIconoEscalado();
        const tamCasa = iconos.usuarioCasa;
        const tamAventura = iconos.usuarioAventura;
        
        // Crear icono según el modo
        let iconHtml;
        if (modo === 'casa') {
            // Modo CASA: Emoji 🛸 escalado
            const emojiSize = Math.round(tamCasa * 0.9);
            iconHtml = `<div style="width:${tamCasa}px;height:${tamCasa}px;position:relative;display:flex;align-items:center;justify-content:center;">
                <!-- Emoji ovni grande -->
                <div style="font-size:${emojiSize}px;line-height:1;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
                    🛸
                </div>
                <!-- Pulso sutil alrededor -->
                <div style="position:absolute;top:50%;left:50%;width:100%;height:100%;border-radius:50%;background:rgba(100,200,255,0.2);transform:translate(-50%,-50%);animation:gpsPulse 2s infinite;"></div>
            </div>`;
        } else {
            // Modo AVENTURA: Flecha azul estilo Google Maps escalada
            const rotation = heading || 0;
            const flechaBorde = Math.round(tamAventura * 0.325);  // ~13px a 40px
            const flechaInterior = Math.round(tamAventura * 0.275); // ~11px a 40px
            const flechaAltura = Math.round(tamAventura * 0.8);    // ~32px a 40px
            const puntoSize = Math.round(tamAventura * 0.35);      // ~14px a 40px
            
            iconHtml = `<div style="width:${tamAventura}px;height:${tamAventura}px;position:relative;">
                <!-- Flecha principal estilo Google Maps — clase gps-arrow-heading para rotación en tiempo real -->
                <div class="gps-arrow-heading" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(${rotation}deg);transition:transform 0.3s ease-out;">
                    <!-- Sombra de la flecha -->
                    <div style="position:absolute;width:0;height:0;border-left:${flechaInterior}px solid transparent;border-right:${flechaInterior}px solid transparent;border-bottom:${Math.round(flechaAltura * 0.94)}px solid rgba(0,0,0,0.2);filter:blur(3px);transform:translate(2px,2px);"></div>
                    <!-- Borde blanco de la flecha -->
                    <div style="position:absolute;width:0;height:0;border-left:${flechaBorde}px solid transparent;border-right:${flechaBorde}px solid transparent;border-bottom:${flechaAltura}px solid white;"></div>
                    <!-- Flecha azul principal (Google Maps style) -->
                    <div style="position:absolute;width:0;height:0;border-left:${flechaInterior}px solid transparent;border-right:${flechaInterior}px solid transparent;border-bottom:${Math.round(flechaAltura * 0.875)}px solid #4285F4;transform:translate(1px,2px);"></div>
                </div>
                <!-- Punto central azul con pulso -->
                <div style="position:absolute;top:50%;left:50%;width:${puntoSize}px;height:${puntoSize}px;background:#4285F4;border:3px solid white;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 12px rgba(66,133,244,0.8), 0 0 0 0 rgba(66,133,244,0.4);animation:gpsPulse 2s infinite;"></div>
            </div>`;
        }
        
        const htmlCompleto = iconHtml + `
                <style>
                    @keyframes gpsPulse {
                        0%, 100% { box-shadow: 0 0 12px rgba(66,133,244,0.8), 0 0 0 0 rgba(66,133,244,0.4); }
                        50% { box-shadow: 0 0 12px rgba(66,133,244,0.8), 0 0 0 8px rgba(66,133,244,0); }
                    }
                </style>`;
        marcadorUsuarioGPS = _crearMarcadorHTML({ lat, lng }, htmlCompleto, {
            className: modo === 'casa' ? 'marcador-usuario-gps-ovni' : 'marcador-usuario-gps-flecha',
            title: modo === 'casa'
                ? `🛸 Tu ubicación ±${Math.round(accuracy)}m`
                : `Tu ubicación ±${Math.round(accuracy)}m (${Math.round(heading || 0)}°)`,
            zIndex: 400  // ✅ CORREGIDO: 400 en lugar de 1000 para NO tapar iframes (z-index final: 900 < 1500)
        });

        const iconoLog = modo === 'casa' ? '🛸' : '➤';
        logger.debug(`Marcador ${iconoLog} actualizado en [${lat}, ${lng}] (modo: ${modo}, heading: ${Math.round(heading || 0)}°)`);

        // Actualizar posición de la flecha snap-to-route si hay tramo activo
        if (flechaActiva) actualizarPosicionFlecha();

        // Círculo naranja 20m — zona de activación de parada.
        // Brújula activada en el mismo branch para evitar condición duplicada.
        if (modo !== 'casa') {
            if (circuloActivacion) {
                circuloActivacion.setLatLng({ lat, lng });
            } else {
                circuloActivacion = _crearCirculoGeografico({ lat, lng }, 20, {
                    color: '#ff8c00',
                    weight: 2,
                    fillColor: '#ff8c00',
                    fillOpacity: 0.12
                });
            }
            // Activar brújula para rotación en tiempo real (si no está ya activa)
            activarBrujula();
        } else if (circuloActivacion) {
            circuloActivacion.remove();
            circuloActivacion = null;
        }

        // Actualizar flecha de dirección sobre tramo (si hay tramo activo)
        actualizarPosicionFlecha();

        return marcadorUsuarioGPS;
    } catch (error) {
        logger.error('Error actualizando marcador de usuario:', error);
        return null;
    }
}

/**
 * Elimina el marcador del usuario del mapa
 */
export function limpiarMarcadorUsuario() {
    if (!_mapaInstance || !marcadorUsuarioGPS) return;
    try {
        marcadorUsuarioGPS.remove();
        marcadorUsuarioGPS = null;
        if (circuloActivacion) {
            circuloActivacion.remove();
            circuloActivacion = null;
        }
        desactivarBrujula();
        logger.debug('Marcador de usuario eliminado');
    } catch (error) {
        logger.error('Error eliminando marcador de usuario:', error);
    }
}

/**
 * Elimina la polyline y marcador de destino del mapa
 */
export function limpiarPolylineNavegacion() {
    if (!_mapaInstance) return;
    try {
        if (polylineNavegacion) {
            polylineNavegacion.remove();
            polylineNavegacion = null;
        }
        if (marcadorDestinoNavegacion) {
            marcadorDestinoNavegacion.remove();
            marcadorDestinoNavegacion = null;
        }
        logger.debug('Polyline y marcador de destino eliminados');
    } catch (error) {
        logger.error('Error limpiando polyline de navegación:', error);
    }
}
