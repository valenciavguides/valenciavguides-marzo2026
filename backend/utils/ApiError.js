/**
 * ApiError - Clase personalizada para errores de la API
 * 
 * Permite crear errores estructurados con código HTTP,
 * mensaje, código de error y datos adicionales.
 */

class ApiError extends Error {
    constructor(statusCode, message, errorCode = null, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode || this._getDefaultErrorCode(statusCode);
        this.data = data;
        this.timestamp = new Date().toISOString();
        this.isOperational = true; // Distingue errores de programación
        
        Error.captureStackTrace(this, this.constructor);
    }
    
    _getDefaultErrorCode(statusCode) {
        const codes = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'UNPROCESSABLE_ENTITY',
            429: 'TOO_MANY_REQUESTS',
            500: 'INTERNAL_ERROR',
            502: 'BAD_GATEWAY',
            503: 'SERVICE_UNAVAILABLE'
        };
        return codes[statusCode] || 'UNKNOWN_ERROR';
    }
    
    toJSON() {
        return {
            error: true,
            codigo: this.errorCode,
            mensaje: this.message,
            timestamp: this.timestamp,
            ...(this.data && { datos: this.data })
        };
    }
}

/**
 * Códigos de error específicos de la aplicación
 */
const ErrorCodes = {
    // Aventuras
    AVENTURA_NO_ENCONTRADA: 'AVENTURA_NO_ENCONTRADA',
    AVENTURA_NO_DISPONIBLE: 'AVENTURA_NO_DISPONIBLE',
    
    // Idiomas
    IDIOMA_NO_SOPORTADO: 'IDIOMA_NO_SOPORTADO',
    IDIOMA_NO_DISPONIBLE: 'IDIOMA_NO_DISPONIBLE',
    
    // Coordenadas
    COORDENADAS_NO_ENCONTRADAS: 'COORDENADAS_NO_ENCONTRADAS',
    PARADA_NO_ENCONTRADA: 'PARADA_NO_ENCONTRADA',
    TRAMO_NO_ENCONTRADO: 'TRAMO_NO_ENCONTRADO',
    
    // Audios
    AUDIO_NO_ENCONTRADO: 'AUDIO_NO_ENCONTRADO',
    AUDIOS_NO_DISPONIBLES: 'AUDIOS_NO_DISPONIBLES',
    
    // Retos
    RETO_NO_ENCONTRADO: 'RETO_NO_ENCONTRADO',
    RETOS_NO_DISPONIBLES: 'RETOS_NO_DISPONIBLES',
    RESPUESTA_INVALIDA: 'RESPUESTA_INVALIDA',
    
    // Puzzles
    PUZZLE_NO_ENCONTRADO: 'PUZZLE_NO_ENCONTRADO',
    PUZZLES_NO_DISPONIBLES: 'PUZZLES_NO_DISPONIBLES',
    
    // Validación
    PARAMETRO_INVALIDO: 'PARAMETRO_INVALIDO',
    PARAMETRO_REQUERIDO: 'PARAMETRO_REQUERIDO',
    FORMATO_INVALIDO: 'FORMATO_INVALIDO',
    
    // Sistema
    ERROR_INTERNO: 'ERROR_INTERNO',
    SERVICIO_NO_DISPONIBLE: 'SERVICIO_NO_DISPONIBLE',
    DATOS_CORRUPTOS: 'DATOS_CORRUPTOS'
};

module.exports = { ApiError, ErrorCodes };
