/**
 * Middleware de autenticación
 * 
 * En DESARROLLO: modo pass-through (deja pasar todo).
 * En PRODUCCIÓN: valida JWT en el header Authorization.
 * 
 * Para activar la protección, establecer AUTH_ENABLED=true en .env
 */

const { ApiError } = require('../utils/ApiError');

// Clave secreta para firmar tokens (se establece en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-no-usar-en-produccion';
const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

/**
 * Verifica un JWT manualmente (sin dependencia externa en desarrollo).
 * En producción, se reemplaza por jsonwebtoken.verify().
 */
function verificarToken(token) {
    try {
        // En desarrollo sin AUTH_ENABLED, no se necesita verificar
        if (!AUTH_ENABLED) return { valid: true, payload: { modo: 'desarrollo' } };

        // Producción: usar jsonwebtoken
        const jwt = require('jsonwebtoken');
        const payload = jwt.verify(token, JWT_SECRET);
        return { valid: true, payload };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

/**
 * Middleware principal de autenticación
 * 
 * Uso en rutas:
 *   router.get('/ruta-protegida', requireAuth, (req, res) => { ... });
 * 
 * Uso en server.js para proteger todas las rutas API:
 *   app.use('/api/aventuras', requireAuth, aventurasRoutes);
 */
const requireAuth = (req, res, next) => {
    // ═══ MODO DESARROLLO: pass-through ═══
    if (!AUTH_ENABLED) {
        req.usuario = { modo: 'desarrollo', autenticado: false };
        return next();
    }

    // ═══ MODO PRODUCCIÓN: validar token ═══
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(
            401,
            'Acceso no autorizado. Se requiere un token de sesión válido.',
            'TOKEN_REQUERIDO'
        ));
    }

    const token = authHeader.split(' ')[1];
    const resultado = verificarToken(token);

    if (!resultado.valid) {
        return next(new ApiError(
            401,
            'Token inválido o expirado. Por favor, vuelva a activar su aventura.',
            'TOKEN_INVALIDO'
        ));
    }

    // Adjuntar datos del usuario al request
    req.usuario = {
        ...resultado.payload,
        autenticado: true
    };

    next();
};

/**
 * Middleware opcional: verifica token si existe, pero no bloquea sin él.
 * Útil para endpoints que funcionan sin auth pero ofrecen más datos con auth.
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const resultado = verificarToken(token);
        if (resultado.valid) {
            req.usuario = { ...resultado.payload, autenticado: true };
        } else {
            req.usuario = { autenticado: false };
        }
    } else {
        req.usuario = { autenticado: false };
    }

    next();
};

module.exports = { requireAuth, optionalAuth, verificarToken, AUTH_ENABLED };
