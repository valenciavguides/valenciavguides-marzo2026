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
        // Todos los números con los que se decide algo por la distancia o por la lectura del GPS. Los leen el mapa
        // (js/funciones-mapa.js), hijo2 (coordenadas-hijo2.html) y el padre (codigo-padre.html), de aquí y solo de aquí
        // (docs/estudio-caminos.md, K-197, paso 2; spec 183).
        /** Precisión mínima aceptable (metros): con un círculo de error mayor, ninguna conclusión de distancia es fiable. */
        PRECISION_MINIMA: 50,
        /** Radio de llegada (metros) a una parada, al punto de salida y al final de un tramo: el del círculo naranja. */
        RADIO_LLEGADA_M: 15,
        /** Tolerancia de un tramo para sus botones y su fuera de rango: la mayor distancia entre dos waypoints seguidos más
         *  TOLERANCIA_TRAMO_MARGEN_M, y nunca menos de TOLERANCIA_TRAMO_MINIMA_M (metros). */
        TOLERANCIA_TRAMO_MINIMA_M: 35,
        TOLERANCIA_TRAMO_MARGEN_M: 20,
        /** «Cerca» (metros): la proximidad real de los recordatorios, la distancia que quita la línea verde de ubicación y
         *  marca la visita de «Ha vuelto»; y, fuera del radio, el final de la franja «fuera». */
        CERCA_M: 50,
        /** Fuera del radio, las franjas (metros): hasta CERCA_M, «fuera»; hasta LEJOS_M, «desviado»; hasta PERDIDO_M, «lejos»;
         *  más allá, «perdido». */
        LEJOS_M: 150,
        PERDIDO_M: 2000,
        /** La gracia de cada franja antes de restringir (milisegundos). */
        GRACIA_MS: { fuera: 7 * 60 * 1000, desviado: 15 * 60 * 1000, lejos: 0, perdido: 0 },
        /** Una llegada, o una vuelta a rango, se confirma con CONFIRMACION_LLEGADA lecturas dentro entre las últimas
         *  VENTANA_LLEGADA. */
        VENTANA_LLEGADA: 4,
        CONFIRMACION_LLEGADA: 2,
        /** Quien ya llegó se da por salido cuando se aleja más que el radio por este factor. */
        MARGEN_SALIDA: 1.5,
        /** Parte de la longitud real de un tramo que hay que recorrer antes de poder llegar a su final. */
        RECORRIDO_MINIMO_TRAMO: 0.4,
        /** El bloqueo por lejanía: a más de ZONA_M de toda la ruta, con ZONA_LECTURAS_PARA_BLOQUEAR lecturas seguidas de
         *  precisión no peor que ZONA_PRECISION_MAXIMA_M, comprobadas cada ZONA_ESPERA_MS mientras no hay bloqueo. */
        ZONA_M: 5000,
        ZONA_PRECISION_MAXIMA_M: 100,
        ZONA_LECTURAS_PARA_BLOQUEAR: 3,
        ZONA_ESPERA_MS: 3 * 60 * 1000
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

// Hacer CONFIG disponible globalmente: lo lee js/logger.js (CONFIG.DEBUG.NIVEL_LOG) en cada llamada. Solo la ventana de arriba la
// publica: un iframe que importe este módulo (hijo2, para CONFIG.GPS) tendría una copia propia, el logger la preferiría a la del padre y
// el nivel de log dejaría de tener una única fuente; los iframes miran hacia arriba (js/logger.js).
if (globalThis.window !== undefined && globalThis.parent === globalThis) {
    globalThis.__vv_config = CONFIG;
}
