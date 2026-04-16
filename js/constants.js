/**
 * Constantes utilizadas en toda la aplicación
 * @module Constants
 */

/**
 * Niveles de log disponibles
 */
export const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
};

/**
 * Modos de la aplicación
 */
export const MODOS = {
    CASA: 'casa',
    AVENTURA: 'aventura'
};

/**
 * Configuración de TTL (Time To Live) para limpieza automática de memoria
 * Optimizado por tipo de dispositivo para mejorar rendimiento
 * ✅ PROBLEMA 26: Centralización de TTLs para evitar duplicación
 */
export const TTL_LIMPIEZA = {
    /* Configuración de TTL (Time To Live) para limpieza automática de memoria
     * Optimizado por tipo de dispositivo para mejorar rendimiento y consumo de recursos.
     *
     * - En MÓVIL: Se mantiene menos historial y la limpieza es menos frecuente (para ahorrar batería y CPU).
     * - En DESKTOP: Se mantiene más historial y la limpieza es más frecuente (más recursos disponibles).
     *
     * Ejemplo:
     *   LOGGER: MÓVIL = 5min (menos frecuente, menos historial), DESKTOP = 1min (más frecuente, más historial)
     *   SUPPRESS: MÓVIL = 2min, DESKTOP = 5min
     * ✅ PROBLEMA 26: Centralización de TTLs para evitar duplicación
     */
    // Mensajería: limpieza de mensajes procesados y promesas pendientes
    MENSAJERIA: {
        MOVIL: 30000,      // 30 segundos (móvil necesita limpieza agresiva)
        DESKTOP: 60000     // 60 segundos (1 minuto)
    },
    
    // Logger: limpieza de historial de logs
    LOGGER: {
        MOVIL: 60000,      // 1 minuto (móvil limpia más frecuentemente, menos memoria)
        DESKTOP: 300000    // 5 minutos (desktop conserva más historial)
    },
    
    // Suppress Warnings: limpieza de mensajes de error
    SUPPRESS: {
        MOVIL: 120000,     // 2 minutos
        DESKTOP: 300000    // 5 minutos
    }
};

// Make TTL_LIMPIEZA available to legacy scripts that expect a global variable
if (typeof window !== 'undefined') {
    try { window.TTL_LIMPIEZA = TTL_LIMPIEZA; } catch (e) { /* ignore in restricted environments */ }
}

/**
 * Tipos de mensajes para la comunicación entre iframes
 * Organizados por categorías para mejor mantenimiento
 */
export const TIPOS_MENSAJE = {
    SISTEMA: {
        CAMBIO_MODO: 'SISTEMA.CAMBIO_MODO',
        CAMBIO_MODO_ENTENDIDO: 'SISTEMA.CAMBIO_MODO_ENTENDIDO',
        CAMBIO_MODO_EFECTUADO: 'SISTEMA.CAMBIO_MODO_EFECTUADO',
        CAMBIO_MODO_APLICADO: 'SISTEMA.CAMBIO_MODO_APLICADO',
        CAMBIO_MODO_RESPONSE: 'SISTEMA.CAMBIO_MODO_RESPONSE',
        HIJO_LISTO: 'SISTEMA.HIJO_LISTO',
        HIJO_PREPARADO: 'SISTEMA.HIJO_PREPARADO',
        PADRE_DATOS: 'SISTEMA.PADRE_DATOS',
        PADRE_CONFIRMA_HIJO_LISTO: 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO',
        HIJO_MANEJADORES: 'SISTEMA.HIJO_MANEJADORES',
        HIJO_FALLIDO: 'SISTEMA.HIJO_FALLIDO',
        HEARTBEAT: 'SISTEMA.HEARTBEAT',
        HEARTBEAT_START: 'SISTEMA.HEARTBEAT_START',
        HEARTBEAT_PAUSE: 'SISTEMA.HEARTBEAT_PAUSE',
        HEARTBEAT_ESTADO: 'SISTEMA.HEARTBEAT_ESTADO',
        HEARTBEAT_RESPONSE: 'SISTEMA.HEARTBEAT_RESPONSE',
        ACK: 'SISTEMA.ACK',
        NACK: 'SISTEMA.NACK',
        ERROR: 'SISTEMA.ERROR',
        CONFIRMACION: 'SISTEMA.CONFIRMACION',
        NOTIFICACION: 'SISTEMA.NOTIFICACION',
        APLICACION_INICIALIZADA: 'SISTEMA.APLICACION_INICIALIZADA',
        ADVERTENCIA: 'SISTEMA.ADVERTENCIA'
    },
    NAVEGACION: {
        CAMBIO_PARADA: 'NAVEGACION.CAMBIO_PARADA',
        ESTABLECER_DESTINO: 'NAVEGACION.ESTABLECER_DESTINO',
        MOSTRAR_RUTA: 'NAVEGACION.MOSTRAR_RUTA',
        ACTUALIZAR_ESTADO: 'NAVEGACION.ACTUALIZAR_ESTADO',
        INICIAR: 'NAVEGACION.INICIAR',
        INICIADA: 'NAVEGACION.INICIADA',
        CANCELADA: 'NAVEGACION.CANCELADA',
        DESTINO_ESTABLECIDO: 'NAVEGACION.DESTINO_ESTABLECIDO',
        LLEGADA_DETECTADA: 'NAVEGACION.LLEGADA_DETECTADA',
        ERROR: 'NAVEGACION.ERROR',
        CENTRAR_EN_UBICACION: 'NAVEGACION.CENTRAR_EN_UBICACION',
        MOSTRAR_UBICACION_POLYLINE: 'NAVEGACION.MOSTRAR_UBICACION_POLYLINE',
        ACTUALIZAR_MARCADOR_USUARIO: 'NAVEGACION.ACTUALIZAR_MARCADOR_USUARIO',
        VALIDAR_RANGO_PARADA: 'NAVEGACION.VALIDAR_RANGO_PARADA',
        USUARIO_FUERA_RANGO: 'NAVEGACION.USUARIO_FUERA_RANGO',
        MOSTRAR_MAPA_JPG: 'NAVEGACION.MOSTRAR_MAPA_JPG',
        ENVIAR_PARADA_COMPLETADA: 'NAVEGACION.ENVIAR_PARADA_COMPLETADA',
        DIBUJAR_POLYLINE: 'NAVEGACION.DIBUJAR_POLYLINE',
        GPS: {
            ACTIVAR: 'NAVEGACION.GPS.ACTIVAR',
            DESACTIVAR: 'NAVEGACION.GPS.DESACTIVAR',
            ESTADO_GLOBAL: 'NAVEGACION.GPS.ESTADO_GLOBAL',
            ESTADO_ACTUALIZADO: 'NAVEGACION.GPS.ESTADO_ACTUALIZADO',
            UBICACION_ACTUALIZADA: 'NAVEGACION.GPS.UBICACION_ACTUALIZADA',
            ERROR: 'NAVEGACION.GPS.ERROR',
            RESTRINGIDO: 'NAVEGACION.GPS.RESTRINGIDO'
        },
        PARADA_COMPLETADA: 'NAVEGACION.PARADA_COMPLETADA',
        SOLICITAR_DATOS_PARADAS: 'NAVEGACION.SOLICITAR_DATOS_PARADAS',
        RESPUESTA_DATOS_PARADAS: 'NAVEGACION.RESPUESTA_DATOS_PARADAS',
        SOLICITAR_COORDENADAS: 'NAVEGACION.SOLICITAR_COORDENADAS',
        RESPUESTA_COORDENADAS: 'NAVEGACION.RESPUESTA_COORDENADAS',
        CAMBIO_PARADA_CONFIRMADO: 'NAVEGACION.CAMBIO_PARADA_CONFIRMADO'
    },
    DATOS: {
        SOLICITAR_PARADAS: 'DATOS.SOLICITAR_PARADAS',
        RESPUESTA_PARADAS: 'DATOS.RESPUESTA_PARADAS',
        COORDENADAS_PARADAS_REQUEST: 'DATOS.COORDENADAS_PARADAS_REQUEST',
        COORDENADAS_PARADAS_RESPONSE: 'DATOS.COORDENADAS_PARADAS_RESPONSE',
        SOLICITAR_RETO: 'DATOS.SOLICITAR_RETO',
        RESPUESTA_RETO: 'DATOS.RESPUESTA_RETO',
        CARGAR_COORDENADAS: 'DATOS.CARGAR_COORDENADAS',
        COORDENADAS_CARGADAS: 'DATOS.COORDENADAS_CARGADAS',
        CARGAR_AUDIOS: 'DATOS.CARGAR_AUDIOS',
        AUDIOS_CARGADOS: 'DATOS.AUDIOS_CARGADOS',
        CARGAR_RETOS: 'DATOS.CARGAR_RETOS',
        RETOS_CARGADOS: 'DATOS.RETOS_CARGADOS',
        CARGAR_TEXTOS: 'DATOS.CARGAR_TEXTOS',
        TEXTOS_CARGADOS: 'DATOS.TEXTOS_CARGADOS',
        SOLICITAR_AUDIOS: 'DATOS.SOLICITAR_AUDIOS',
        SOLICITAR_TEXTOS: 'DATOS.SOLICITAR_TEXTOS',
        SOLICITAR_RETOS: 'DATOS.SOLICITAR_RETOS',
        SOLICITAR_COORDENADAS: 'DATOS.SOLICITAR_COORDENADAS'
    },
    AUDIO: {
        REPRODUCIR_REQUEST: 'AUDIO.REPRODUCIR_REQUEST',
        REPRODUCIR_RESPONSE: 'AUDIO.REPRODUCIR_RESPONSE',
        FIN_REPRODUCCION: 'AUDIO.FIN_REPRODUCCION',
        ERROR: 'AUDIO.ERROR',
        ESTADO_ACTUALIZADO: 'AUDIO.ESTADO_ACTUALIZADO',
        SOLICITAR_AUDIO: 'AUDIO.SOLICITAR_AUDIO',
        RESPUESTA_AUDIO: 'AUDIO.RESPUESTA_AUDIO'
    },
    CONTROL: {
        HABILITAR: 'CONTROL.HABILITAR',
        DESHABILITAR: 'CONTROL.DESHABILITAR'
    },
    RETO: {
        MOSTRAR: 'RETO.MOSTRAR',
        MOSTRADO: 'RETO.MOSTRADO',
        OCULTAR: 'RETO.OCULTAR',
        COMPLETADO: 'RETO.COMPLETADO',
        SOLICITAR_RETO: 'RETO.SOLICITAR_RETO'
    },
    UI: {
        NOTIFICACION: 'UI.NOTIFICACION',
        ACCION_USUARIO: 'UI.ACCION_USUARIO',
        CLOSE_MENUS: 'UI.CLOSE_MENUS',
        NAVEGACION_EXTERNA: 'UI.NAVEGACION_EXTERNA'
    },
    MONITOREO: {
        METRICA: 'MONITOREO.METRICA'
    },
    COORDINACION: {
        SOLICITAR_DATOS_HIJO: 'COORDINACION.SOLICITAR_DATOS_HIJO'
    },
    MAPA: {
        INVALIDAR_TAMAÑO: 'MAPA.INVALIDAR_TAMAÑO',
        SET_VIEW: 'MAPA.SET_VIEW',
        GET_CENTER: 'MAPA.GET_CENTER',
        ADD_MARKER: 'MAPA.ADD_MARKER',
        REMOVE_MARKER: 'MAPA.REMOVE_MARKER',
        CLEAR_LAYERS: 'MAPA.CLEAR_LAYERS'
    },
    SELECCION: {
        IDIOMA_SELECCIONADO: 'SELECCION.IDIOMA_SELECCIONADO',
        AVENTURA_SELECCIONADA: 'SELECCION.AVENTURA_SELECCIONADA',
        INICIAR_AVENTURA: 'SELECCION.INICIAR_AVENTURA',
        TERMINOS_ACEPTADOS: 'SELECCION.TERMINOS_ACEPTADOS',
        PREPARAR_HIJOS: 'SELECCION.PREPARAR_HIJOS'
    },
    AVENTURA: {
        INICIADA: 'AVENTURA.INICIADA',
        FINALIZADA: 'AVENTURA.FINALIZADA',
        TIEMPO_AGOTADO: 'AVENTURA.TIEMPO_AGOTADO',
        TIEMPO_ACTUALIZADO: 'AVENTURA.TIEMPO_ACTUALIZADO',
        ESTADISTICAS_TIEMPO: 'AVENTURA.ESTADISTICAS_TIEMPO'
    },
    TEMPORIZADOR: {
        TOGGLE: 'TEMPORIZADOR.TOGGLE'
    },
    PARADAS: {
        READY: 'VV:PARADAS:READY',
        SHOWN: 'VV:PARADAS:SHOWN'
    },
    NAVEGACION_PANTALLA: 'NAVEGAR_PANTALLA'
};

/**
 * Códigos de error estandarizados
 */
export const ERRORES = {
    VALIDACION: {
        DATOS_INVALIDOS: { codigo: 1000, mensaje: 'Los datos proporcionados no son válidos', nivel: 'error' },
        PARAMETROS_FALTANTES: { codigo: 1001, mensaje: 'Faltan parámetros requeridos', nivel: 'error' },
        TIPO_MENSAJE_INVALIDO: { codigo: 1002, mensaje: 'Tipo de mensaje no válido', nivel: 'warning' },
        MENSAJE_INVALIDO: { codigo: 1003, mensaje: 'El formato del mensaje no es válido', nivel: 'error' },
        DESTINO_INVALIDO: { codigo: 1004, mensaje: 'El destino especificado no es válido', nivel: 'error' },
        IMPORTACION_FALLIDA: { codigo: 1005, mensaje: 'Fallo en la importación de módulo', nivel: 'error' }
    },
    INICIALIZACION: {
        MENSAJERIA: { codigo: 1100, mensaje: 'Error al inicializar el sistema de mensajería', nivel: 'error' },
        MAPA: { codigo: 1101, mensaje: 'Error al inicializar el mapa', nivel: 'error' },
        COMPONENTE: { codigo: 1102, mensaje: 'Error al inicializar el componente', nivel: 'error' }
    },
    COMUNICACION: {
        TIEMPO_ESPERA: { codigo: 1200, mensaje: 'Tiempo de espera agotado', nivel: 'error' },
        DESTINO_NO_DISPONIBLE: { codigo: 1201, mensaje: 'El destino no está disponible', nivel: 'warning' },
        MENSAJE_NO_ENTREGADO: { codigo: 1202, mensaje: 'No se pudo entregar el mensaje', nivel: 'error' }
    },
    AUTENTICACION: {
        NO_AUTORIZADO: { codigo: 201, mensaje: 'No autorizado para realizar esta acción' }
    },
    RECURSO: {
        NO_ENCONTRADO: { codigo: 301, mensaje: 'Recurso no encontrado' },
        YA_EXISTE: { codigo: 302, mensaje: 'El recurso ya existe' }
    },
    SISTEMA: {
        ERROR_INTERNO: { codigo: 500, mensaje: 'Error interno del servidor' },
        NO_IMPLEMENTADO: { codigo: 501, mensaje: 'Funcionalidad no implementada' },
        SERVICIO_NO_DISPONIBLE: { codigo: 503, mensaje: 'Servicio no disponible temporalmente' }
    }
};

/**
 * Estados de la aplicación
 */
export const ESTADOS = {
    INICIALIZANDO: 'inicializando',
    LISTO: 'listo',
    ERROR: 'error'
};

/**
 * Códigos de error
 */
export const CODIGOS_ERROR = {
    INICIALIZACION: 'ERROR_INICIALIZACION',
    MENSAJERIA: 'ERROR_MENSAJERIA',
    MAPA: 'ERROR_MAPA',
    AUDIO: 'ERROR_AUDIO',
    MONITOREO: {
        INICIALIZACION: 'ERROR_MONITOREO_INICIALIZACION',
        EVENTO_INVALIDO: 'ERROR_EVENTO_INVALIDO',
        METRICA_INVALIDA: 'ERROR_METRICA_INVALIDA',
        INFORME_FALLIDO: 'ERROR_INFORME_FALLIDO',
        DIAGNOSTICO_FALLIDO: 'ERROR_DIAGNOSTICO_FALLIDO',
        ALTA_LATENCIA: 'ADVERTENCIA_ALTA_LATENCIA',
        ALTA_MEMORIA: 'ADVERTENCIA_ALTA_MEMORIA',
        TASA_ERROR_ELEVADA: 'ADVERTENCIA_TASA_ERROR_ELEVADA'
    },
    RETO: 'ERROR_RETO',
    NAVEGACION: 'ERROR_NAVEGACION'
};

/**
 * Destinos para mensajería
 */
export const DESTINOS = {
    PADRE: 'padre',
    TODOS: 'todos'
};

/**
 * Clases CSS para los diferentes modos
 */
export const CSS_CLASES = {
    MODO_CASA: 'modo-casa',
    MODO_AVENTURA: 'modo-aventura',
    HIJO3_CONTAINER: 'hijo3-container'
};

/**
 * Construcción programática de la lista de tipos válidos.
 */
function _flattenTipos(obj) {
    const out = [];
    const seen = new Set();
    const recurse = (v) => {
        if (!v && v !== 0) return;
        if (typeof v === 'string') {
            if (!seen.has(v)) { seen.add(v); out.push(v); }
            return;
        }
        if (Array.isArray(v)) return v.forEach(recurse);
        if (typeof v === 'object') return Object.values(v).forEach(recurse);
    }
    recurse(obj);
    return out;
}

export const TIPOS_MENSAJE_VALIDOS = _flattenTipos(TIPOS_MENSAJE);

export default {
    LOG_LEVELS,
    MODOS,
    TIPOS_MENSAJE,
    ESTADOS,
    CODIGOS_ERROR,
    DESTINOS,
    CSS_CLASES
};

// Exponer globalmente para compatibilidad con código que espera window.constants
if (typeof window !== 'undefined') {
    window.constants = {
        LOG_LEVELS,
        MODOS,
        TIPOS_MENSAJE,
        ESTADOS,
        CODIGOS_ERROR,
        DESTINOS,
        CSS_CLASES,
        TIPOS_MENSAJE_VALIDOS
    };
    console.log('✅ constants.js loaded, window.constants assigned');
}