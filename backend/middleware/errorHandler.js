/**
 * Middleware centralizado de manejo de errores
 * 
 * Captura todos los errores y los formatea de manera consistente.
 * En desarrollo muestra stack traces, en producción los oculta.
 */

const { ApiError } = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
    // Log del error (en producción iría a un servicio de logs)
    console.error('═══════════════════════════════════════════════════════');
    console.error(`[ERROR] ${new Date().toISOString()}`);
    console.error(`[PATH] ${req.method} ${req.path}`);
    console.error(`[MESSAGE] ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(`[STACK] ${err.stack}`);
    }
    console.error('═══════════════════════════════════════════════════════');
    
    // Si es un ApiError, usar sus propiedades
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }
    
    // Errores de validación de Express
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: true,
            codigo: 'VALIDATION_ERROR',
            mensaje: 'Error de validación',
            detalles: err.errors || err.message,
            timestamp: new Date().toISOString()
        });
    }
    
    // Errores de JSON malformado
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: true,
            codigo: 'JSON_PARSE_ERROR',
            mensaje: 'El JSON enviado es inválido',
            timestamp: new Date().toISOString()
        });
    }
    
    // Error genérico (no exponer detalles en producción)
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;
    
    res.status(statusCode).json({
        error: true,
        codigo: 'INTERNAL_ERROR',
        mensaje: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
