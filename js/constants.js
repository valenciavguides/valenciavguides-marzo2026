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
 * TTL (Time To Live) de la limpieza automática de mensajería según el tipo de dispositivo: en móvil
 * se limpia con más frecuencia y se guarda menos historial (batería y CPU); en desktop, al revés.
 * Lo lee `js/mensajeria.js` con `esMovil()`.
 */
export const TTL_LIMPIEZA = {
    // Mensajería: limpieza de mensajes procesados y promesas pendientes
    MENSAJERIA: {
        MOVIL: 30000,      // 30 segundos (móvil necesita limpieza agresiva)
        DESKTOP: 60000     // 60 segundos (1 minuto)
    }
};

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
        HIJO_LISTO: 'SISTEMA.HIJO_LISTO',
        HIJO_PREPARADO: 'SISTEMA.HIJO_PREPARADO',
        PADRE_DATOS: 'SISTEMA.PADRE_DATOS',
        PADRE_CONFIRMA_HIJO_LISTO: 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO',
        HEARTBEAT: 'SISTEMA.HEARTBEAT',
        HEARTBEAT_RESPONSE: 'SISTEMA.HEARTBEAT_RESPONSE',
        NACK: 'SISTEMA.NACK',
        ERROR: 'SISTEMA.ERROR',
        CONFIRMACION: 'SISTEMA.CONFIRMACION',
        NOTIFICACION: 'SISTEMA.NOTIFICACION',
        APLICACION_INICIALIZADA: 'SISTEMA.APLICACION_INICIALIZADA'
    },
    NAVEGACION: {
        CAMBIO_PARADA: 'NAVEGACION.CAMBIO_PARADA',
        ACTUALIZAR_ESTADO: 'NAVEGACION.ACTUALIZAR_ESTADO',
        LLEGADA_DETECTADA: 'NAVEGACION.LLEGADA_DETECTADA',
        MOSTRAR_UBICACION_POLYLINE: 'NAVEGACION.MOSTRAR_UBICACION_POLYLINE',
        USUARIO_FUERA_RANGO: 'NAVEGACION.USUARIO_FUERA_RANGO',
        MOSTRAR_MAPA_COMPLETO: 'NAVEGACION.MOSTRAR_MAPA_COMPLETO',
        MOSTRAR_MAPA_VINTAGE: 'NAVEGACION.MOSTRAR_MAPA_VINTAGE',
        GPS: {
            ACTIVAR: 'NAVEGACION.GPS.ACTIVAR',
            DESACTIVAR: 'NAVEGACION.GPS.DESACTIVAR',
            ESTADO_ACTUALIZADO: 'NAVEGACION.GPS.ESTADO_ACTUALIZADO',
            ERROR: 'NAVEGACION.GPS.ERROR',
            RESTRINGIDO: 'NAVEGACION.GPS.RESTRINGIDO',
            DENTRO_DE_RANGO: 'NAVEGACION.GPS.DENTRO_DE_RANGO',
            PRECISION_INSUFICIENTE: 'NAVEGACION.GPS.PRECISION_INSUFICIENTE',
            PRECISION_RECUPERADA: 'NAVEGACION.GPS.PRECISION_RECUPERADA'
        },
        SOLICITAR_DATOS_PARADAS: 'NAVEGACION.SOLICITAR_DATOS_PARADAS',
        RESPUESTA_DATOS_PARADAS: 'NAVEGACION.RESPUESTA_DATOS_PARADAS',
        SOLICITAR_COORDENADAS: 'NAVEGACION.SOLICITAR_COORDENADAS',
        RESPUESTA_COORDENADAS: 'NAVEGACION.RESPUESTA_COORDENADAS',
        CAMBIO_PARADA_CONFIRMADO: 'NAVEGACION.CAMBIO_PARADA_CONFIRMADO',
        SUPRIMIR_ROTACION: 'NAVEGACION.SUPRIMIR_ROTACION'
    },
    DATOS: {
        COORDENADAS_PARADAS_REQUEST: 'DATOS.COORDENADAS_PARADAS_REQUEST',
        CARGAR_COORDENADAS: 'DATOS.CARGAR_COORDENADAS',
        COORDENADAS_CARGADAS: 'DATOS.COORDENADAS_CARGADAS',
        CARGAR_TEXTOS: 'DATOS.CARGAR_TEXTOS',
        TEXTOS_CARGADOS: 'DATOS.TEXTOS_CARGADOS',
        SOLICITAR_AUDIOS: 'DATOS.SOLICITAR_AUDIOS',
        SOLICITAR_TEXTOS: 'DATOS.SOLICITAR_TEXTOS',
        SOLICITAR_RETOS: 'DATOS.SOLICITAR_RETOS',
        SOLICITAR_COORDENADAS: 'DATOS.SOLICITAR_COORDENADAS'
    },
    AUDIO: {
        REPRODUCIR_REQUEST: 'AUDIO.REPRODUCIR_REQUEST',
        FIN_REPRODUCCION: 'AUDIO.FIN_REPRODUCCION',
        ERROR: 'AUDIO.ERROR',
        ESTADO_ACTUALIZADO: 'AUDIO.ESTADO_ACTUALIZADO'
    },
    CONTROL: {
        HABILITAR: 'CONTROL.HABILITAR',
        DESHABILITAR: 'CONTROL.DESHABILITAR',
        DEV_CINCO_TOQUES: 'CONTROL.DEV_CINCO_TOQUES'
    },
    RETO: {
        MOSTRAR: 'RETO.MOSTRAR',
        MOSTRADO: 'RETO.MOSTRADO',
        // OCULTAR es siempre hijo4→padre ("cierra la ventana del reto"). LIMPIAR_ESTADO es
        // el mensaje distinto que usa el padre para pedirle a hijo4, en la otra dirección,
        // que limpie su estado interno tras esconderla — antes ambas direcciones reusaban
        // OCULTAR con significados distintos, lo que confundía al leer el código sin avisar
        // de que el mismo tipo viaja en dos sentidos con dos efectos diferentes.
        OCULTAR: 'RETO.OCULTAR',
        LIMPIAR_ESTADO: 'RETO.LIMPIAR_ESTADO',
        COMPLETADO: 'RETO.COMPLETADO',
        SOLICITAR_RETO: 'RETO.SOLICITAR_RETO',
        HABILITAR: 'RETO.HABILITAR',
        ESTADO_CASA: 'RETO.ESTADO_CASA',
        CONFIRMADO: 'RETO.CONFIRMADO'
    },
    UI: {
        ACCION_USUARIO: 'UI.ACCION_USUARIO',
        CLOSE_MENUS: 'UI.CLOSE_MENUS',
        NAVEGACION_EXTERNA: 'UI.NAVEGACION_EXTERNA'
    },
    SELECCION: {
        IDIOMA_SELECCIONADO: 'SELECCION.IDIOMA_SELECCIONADO',
        AVENTURA_SELECCIONADA: 'SELECCION.AVENTURA_SELECCIONADA',
        AVENTURA_ACTIVADA: 'SELECCION.AVENTURA_ACTIVADA',
        TERMINOS_ACEPTADOS: 'SELECCION.TERMINOS_ACEPTADOS',
        PREPARAR_HIJOS: 'SELECCION.PREPARAR_HIJOS',
        VIDEO_INTRO_TERMINADO: 'SELECCION.VIDEO_INTRO_TERMINADO',
        CODIGO_VALIDADO: 'SELECCION.CODIGO_VALIDADO',
        DEV_MODE_TOGGLE: 'SELECCION.DEV_MODE_TOGGLE',
        P15_MOSTRADA: 'SELECCION.P15_MOSTRADA',
        REINICIAR: 'SELECCION.REINICIAR'
    },
    AVENTURA: {
        INICIADA: 'AVENTURA.INICIADA',
        FINALIZADA: 'AVENTURA.FINALIZADA',
        DETENER: 'AVENTURA.DETENER',
        TIEMPO_AGOTADO: 'AVENTURA.TIEMPO_AGOTADO',
        TIEMPO_ACTUALIZADO: 'AVENTURA.TIEMPO_ACTUALIZADO',
        ESTADISTICAS_TIEMPO: 'AVENTURA.ESTADISTICAS_TIEMPO'
    },
    TEMPORIZADOR: {
        TOGGLE: 'TEMPORIZADOR.TOGGLE'
    },
    PARADAS: {
        READY: 'VV:PARADAS:READY',
        LISTADO_TOGGLE: 'PARADAS.LISTADO_TOGGLE'
    },
    PUZZLE: {
        COMPLETADO: 'PUZZLE.COMPLETADO',
        TIMEOUT: 'PUZZLE.TIMEOUT'
    },
    CHAT: {
        CERRAR: 'CHAT.CERRAR',
        ESTADO_PADRE: 'CHAT.ESTADO_PADRE',
        /**
         * hijo6 → padre. El usuario pide un rescate desde el asistente de soporte.
         * Se envía con acuse (`enviarMensajeConConfirmacion`) porque su respuesta decide
         * lo que ve a continuación: un mensaje perdido dejaría el botón mudo.
         *
         * El padre responde SIEMPRE con un objeto —nunca `undefined`— diciendo si puede
         * concederse y por qué no, si no. Ver `docs/GUIA-COMPLETA.md` §25.19.
         */
        RESCATE_SOLICITADO: 'CHAT.RESCATE_SOLICITADO'
    },
    /**
     * El mapa completo (`mapa-completo.html`), que el padre abre en un overlay.
     *
     * No importa datos: los pide. Abrir su URL a pelo deja el mapa vacío porque no tiene a
     * quién pedírselos, sin necesidad de ningún guard. El día que los datos vengan del
     * backend, esa página no se entera: el padre los pedirá con token y le mandará lo mismo.
     */
    MAPA_COMPLETO: {
        SOLICITAR_DATOS: 'MAPA_COMPLETO.SOLICITAR_DATOS',
        DATOS: 'MAPA_COMPLETO.DATOS',
        /** El overlay ya está visible: es cuando el mapa puede medirse y encuadrar. */
        VISIBLE: 'MAPA_COMPLETO.VISIBLE'
    },
    NAVEGACION_PANTALLA: 'NAVEGAR_PANTALLA'
};

if (globalThis.window !== undefined) {
    (globalThis.logger || console).debug('✅ constants.js cargado');
}
