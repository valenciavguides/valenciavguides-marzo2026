/**
 * @fileoverview Configuración centralizada para ValenciaVGuides
 * @version 2.0.0
 *
 * Solo lleva los parámetros que algún código lee: el nivel de log, el timeout de
 * confirmación del bus, la precisión mínima del GPS y la vista por defecto del mapa.
 * Un valor que no esté aquí no se configura desde este fichero.
 */

import { LOG_LEVELS } from './constants.js';

/**
 * Configuración principal del sistema
 * @type {Object}
 */
export const CONFIG = {
    /**
     * Configuración de debugging
     */
    DEBUG: {
        /** Nivel de log mínimo: lo lee js/logger.js en cada llamada, a través de globalThis.__vv_config */
        NIVEL_LOG: LOG_LEVELS.DEBUG
    },

    /**
     * Configuración del sistema de mensajería
     */
    MENSAJERIA: {
        TIMEOUTS: {
            /** Timeout por defecto para mensajes con confirmación (ms): lo lee codigo-padre.html */
            CONFIRMACION: 5000
        }
    },

    /**
     * Configuración del GPS y localización
     */
    GPS: {
        /** Precisión mínima aceptable (metros): la lee coordenadas-hijo2.html */
        PRECISION_MINIMA: 50
    },

    /**
     * Configuración de mapa
     */
    MAPA: {
        /** Zoom inicial */
        ZOOM_INICIAL: 15,

        /** Zoom máximo permitido */
        ZOOM_MAX: 19,

        /** Centro por defecto (Valencia) */
        CENTRO_DEFECTO: {
            lat: 39.4699,
            lng: -0.3763
        }
    }
};

// Hacer CONFIG disponible globalmente: lo lee js/logger.js (CONFIG.DEBUG.NIVEL_LOG) en cada llamada, en cada ventana
if (globalThis.window !== undefined) {
    globalThis.__vv_config = CONFIG;
}
