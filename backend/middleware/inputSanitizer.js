/**
 * Middleware de sanitización de entrada
 * 
 * Protege contra:
 * - XSS (Cross-Site Scripting): etiquetas <script>, event handlers
 * - SQL Injection: patrones SELECT/FROM, UNION, DROP TABLE
 * - Template Injection: ${}, {{}}
 * - Inputs excesivamente largos
 * 
 * Se aplica como middleware global ANTES de las rutas.
 */

const { ApiError } = require('../utils/ApiError');
const { logSecurityEvent, SecurityEvents } = require('../utils/securityLogger');

// ========================================
// PATRONES SOSPECHOSOS
// ========================================
// Contenido que nunca debería aparecer en inputs legítimos de esta app
const SUSPICIOUS_PATTERNS = [
    /<script[\s>]/i,              // Etiquetas script
    /javascript\s*:/i,            // URLs javascript:
    /on(?:click|error|load|mouseover|focus|blur)\s*=/i,  // Event handlers HTML
    /\bSELECT\b.{0,40}\bFROM\b/i,    // SQL SELECT...FROM
    /\bUNION\b.{0,20}\bSELECT\b/i,   // SQL UNION SELECT
    /\bDROP\b.{0,20}\bTABLE\b/i,      // SQL DROP TABLE
    /\bINSERT\b.{0,20}\bINTO\b/i,     // SQL INSERT INTO
    /\bDELETE\b.{0,20}\bFROM\b/i,     // SQL DELETE FROM
    /--\s/,                            // SQL comment
    /\$\{.*\}/,                        // Template literal injection ${...}
    /\{\{.*\}\}/,                      // Template injection {{...}}
    /<iframe/i,                        // Iframe injection
    /<object/i,                        // Object injection
    /<embed/i,                         // Embed injection
    /\beval\s*\(/i,                    // eval() calls
    /\bFunction\s*\(/i                 // Function() constructor
];

/**
 * Comprueba si un string contiene patrones sospechosos
 */
function containsSuspiciousContent(str) {
    if (typeof str !== 'string') return false;
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Elimina etiquetas HTML de un string
 */
function stripHtmlTags(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitiza un string: trim + truncar a longitud máxima
 */
function sanitizeString(str, maxLength = 500) {
    if (typeof str !== 'string') return str;
    return str.trim().substring(0, maxLength);
}

/**
 * Sanitiza recursivamente un objeto (body, query, params)
 */
function sanitizeObject(obj, maxDepth = 3, currentDepth = 0) {
    if (currentDepth > maxDepth) return {};
    if (typeof obj === 'string') return sanitizeString(obj);
    if (Array.isArray(obj)) {
        return obj.slice(0, 50).map(item =>
            sanitizeObject(item, maxDepth, currentDepth + 1)
        );
    }
    if (typeof obj === 'object' && obj !== null) {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            const cleanKey = sanitizeString(key, 100);
            cleaned[cleanKey] = sanitizeObject(value, maxDepth, currentDepth + 1);
        }
        return cleaned;
    }
    return obj;
}

// ========================================
// MIDDLEWARE GLOBAL
// ========================================

/**
 * Middleware que inspecciona TODOS los inputs de cada petición.
 * Si detecta contenido sospechoso, rechaza la petición con 400.
 * Además, sanitiza (trim + truncar) todos los strings del body.
 * 
 * Uso en server.js:
 *   app.use(express.json());
 *   app.use(sanitizeInputMiddleware);  // después de json parser
 */
const sanitizeInputMiddleware = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;

    // Recoger todos los valores string de params, query y body
    const allInputs = [];

    if (req.params) {
        allInputs.push(...Object.values(req.params).filter(v => typeof v === 'string'));
    }
    if (req.query) {
        allInputs.push(...Object.values(req.query).filter(v => typeof v === 'string'));
    }
    if (req.body && typeof req.body === 'object') {
        const extractStrings = (obj, depth = 0) => {
            if (depth > 3) return;
            for (const val of Object.values(obj)) {
                if (typeof val === 'string') allInputs.push(val);
                else if (Array.isArray(val)) val.forEach(v => {
                    if (typeof v === 'string') allInputs.push(v);
                });
                else if (typeof val === 'object' && val !== null) extractStrings(val, depth + 1);
            }
        };
        extractStrings(req.body);
    }

    // Comprobar patrones sospechosos
    for (const input of allInputs) {
        if (containsSuspiciousContent(input)) {
            logSecurityEvent({
                type: SecurityEvents.SUSPICIOUS_INPUT,
                ip,
                message: 'Input sospechoso detectado y rechazado',
                path: req.path,
                method: req.method,
                details: { inputLength: input.length }
            });

            return res.status(400).json({
                error: true,
                codigo: 'INPUT_SOSPECHOSO',
                mensaje: 'La solicitud contiene contenido no permitido.'
            });
        }
    }

    // Sanitizar body (trim + truncar strings)
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }

    next();
};

// ========================================
// VALIDADORES ESPECÍFICOS
// ========================================

/**
 * Valida y sanitiza un código de activación.
 * Solo permite: letras, números, guiones y guiones bajos. Máximo 50 chars.
 */
function validateCodigo(codigo) {
    if (typeof codigo !== 'string') {
        throw new ApiError(400, 'El código debe ser texto', 'CODIGO_REQUERIDO');
    }
    const cleaned = codigo.trim();
    if (cleaned.length === 0) {
        throw new ApiError(400, 'Se requiere un código de activación', 'CODIGO_REQUERIDO');
    }
    if (cleaned.length > 50) {
        throw new ApiError(400, 'Código demasiado largo (máximo 50 caracteres)', 'FORMATO_INVALIDO');
    }
    if (!/^[a-zA-Z0-9\-_]+$/.test(cleaned)) {
        throw new ApiError(
            400,
            'El código solo puede contener letras, números, guiones y guiones bajos',
            'FORMATO_INVALIDO'
        );
    }
    return cleaned;
}

/**
 * Valida y sanitiza una respuesta de reto.
 * Puede ser string (máx 500 chars) o array de strings (máx 20 items).
 * Elimina etiquetas HTML.
 */
function validateRespuesta(respuesta) {
    if (respuesta === undefined || respuesta === null) {
        throw new ApiError(400, 'La respuesta es requerida', 'PARAMETRO_REQUERIDO');
    }

    if (typeof respuesta === 'string') {
        const cleaned = stripHtmlTags(respuesta.trim());
        if (cleaned.length === 0) {
            throw new ApiError(400, 'La respuesta no puede estar vacía', 'PARAMETRO_REQUERIDO');
        }
        if (cleaned.length > 500) {
            throw new ApiError(400, 'Respuesta demasiado larga (máximo 500 caracteres)', 'FORMATO_INVALIDO');
        }
        return cleaned;
    }

    if (Array.isArray(respuesta)) {
        if (respuesta.length === 0) {
            throw new ApiError(400, 'La respuesta no puede estar vacía', 'PARAMETRO_REQUERIDO');
        }
        if (respuesta.length > 20) {
            throw new ApiError(400, 'Demasiadas respuestas (máximo 20)', 'FORMATO_INVALIDO');
        }
        return respuesta.map(r => {
            if (typeof r !== 'string') return String(r).substring(0, 500);
            return stripHtmlTags(r.trim()).substring(0, 500);
        });
    }

    throw new ApiError(400, 'La respuesta debe ser texto o una lista de textos', 'FORMATO_INVALIDO');
}

module.exports = {
    sanitizeInputMiddleware,
    validateCodigo,
    validateRespuesta,
    containsSuspiciousContent,
    stripHtmlTags,
    sanitizeString,
    sanitizeObject
};
