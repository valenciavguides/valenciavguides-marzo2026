/**
 * Middleware de validación de parámetros
 * 
 * Funciones helper para validar parámetros de request.
 */

const { ApiError, ErrorCodes } = require('../utils/ApiError');

/**
 * Valida que un parámetro requerido esté presente
 */
const requireParam = (value, paramName) => {
    if (value === undefined || value === null || value === '') {
        throw new ApiError(
            400, 
            `El parámetro '${paramName}' es requerido`,
            ErrorCodes.PARAMETRO_REQUERIDO,
            { parametro: paramName }
        );
    }
    return value;
};

/**
 * Valida formato de ID de aventura (AventuraX)
 */
const validateAventuraId = (aventuraId) => {
    if (!aventuraId || !/^Aventura\d+$/i.test(aventuraId)) {
        throw new ApiError(
            400,
            `ID de aventura inválido: '${aventuraId}'. Formato esperado: Aventura1, Aventura2, etc.`,
            ErrorCodes.FORMATO_INVALIDO,
            { parametro: 'aventuraId', valorRecibido: aventuraId }
        );
    }
    // Normalizar a PascalCase
    return 'Aventura' + aventuraId.replace(/\D/g, '');
};

/**
 * Valida código de idioma (es, en, fr, etc.)
 */
const validateIdioma = (idioma) => {
    const idiomasValidos = ['es', 'en', 'fr', 'it', 'nl', 'ja'];
    const idiomaLower = (idioma || '').toLowerCase();
    
    if (!idiomasValidos.includes(idiomaLower)) {
        throw new ApiError(
            400,
            `Idioma no soportado: '${idioma}'. Idiomas válidos: ${idiomasValidos.join(', ')}`,
            ErrorCodes.IDIOMA_NO_SOPORTADO,
            { parametro: 'idioma', valorRecibido: idioma, idiomasValidos }
        );
    }
    return idiomaLower;
};

/**
 * Valida formato de ID de parada/tramo (P-X o TR-X)
 */
const validateStopId = (stopId) => {
    if (!stopId || !/^(P-\d+|TR-\d+)$/i.test(stopId)) {
        throw new ApiError(
            400,
            `ID de parada/tramo inválido: '${stopId}'. Formato esperado: P-0, P-1, TR-1, TR-2, etc.`,
            ErrorCodes.FORMATO_INVALIDO,
            { parametro: 'stopId', valorRecibido: stopId }
        );
    }
    return stopId.toUpperCase();
};

/**
 * Middleware factory para validar query params
 */
const validateQueryParams = (requiredParams = [], optionalParams = []) => {
    return (req, res, next) => {
        try {
            for (const param of requiredParams) {
                requireParam(req.query[param], param);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    requireParam,
    validateAventuraId,
    validateIdioma,
    validateStopId,
    validateQueryParams
};
