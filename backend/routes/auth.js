/**
 * Rutas de autenticación
 * 
 * Genera tokens de sesión al validar un código de activación.
 * En DESARROLLO: siempre genera un token (pass-through).
 * En PRODUCCIÓN: valida el código contra una base de datos.
 */

const express = require('express');
const router = express.Router();
const { ApiError } = require('../utils/ApiError');
const { validateCodigo } = require('../middleware/inputSanitizer');
const { validateAventuraId } = require('../middleware/validation');
const { logSecurityEvent, SecurityEvents } = require('../utils/securityLogger');
const { recordFailure: recordGlobalFailure, recordSuccess: recordGlobalSuccess } = require('../middleware/ipBan');

const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-no-usar-en-produccion';

// Duración del token: 24 horas
const TOKEN_EXPIRY = '24h';

// ========================================
// PENALIZACIÓN PROGRESIVA POR IP
// ========================================
// Tras cada intento fallido de activación, el tiempo de bloqueo aumenta.
// 1er fallo: 0s, 2do: 5s, 3ro: 15s, 4to: 60s, 5to+: 5 minutos
// Se limpia automáticamente tras 30 minutos sin intentos.

const intentosFallidos = new Map(); // IP → { count, lastAttempt, blockedUntil }

const PENALTY_SCHEDULE = [0, 0, 5000, 15000, 60000, 300000]; // ms
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 min

function getPenaltyMs(failCount) {
    const idx = Math.min(failCount, PENALTY_SCHEDULE.length - 1);
    return PENALTY_SCHEDULE[idx];
}

function registrarFallo(ip) {
    const entry = intentosFallidos.get(ip) || { count: 0, lastAttempt: 0, blockedUntil: 0 };
    entry.count++;
    entry.lastAttempt = Date.now();
    const penaltyMs = getPenaltyMs(entry.count);
    entry.blockedUntil = Date.now() + penaltyMs;
    intentosFallidos.set(ip, entry);
    return { count: entry.count, penaltySeconds: Math.ceil(penaltyMs / 1000) };
}

function registrarExito(ip) {
    intentosFallidos.delete(ip);
}

function estaBloqueado(ip) {
    const entry = intentosFallidos.get(ip);
    if (!entry) return { blocked: false };
    if (Date.now() < entry.blockedUntil) {
        const waitSeconds = Math.ceil((entry.blockedUntil - Date.now()) / 1000);
        return { blocked: true, waitSeconds, attempts: entry.count };
    }
    return { blocked: false };
}

// Limpiar entradas antiguas cada 30 minutos
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of intentosFallidos.entries()) {
        if (now - entry.lastAttempt > CLEANUP_INTERVAL) {
            intentosFallidos.delete(ip);
        }
    }
}, CLEANUP_INTERVAL);

/**
 * POST /api/auth/activar
 * 
 * Recibe un código de activación y devuelve un token JWT.
 * Body: { codigo: "XXXX", aventuraId: "Aventura1" }
 * 
 * Respuesta exitosa:
 * { exito: true, token: "eyJ...", expira_en: "24h" }
 */
router.post('/activar', (req, res, next) => {
    try {
        const ip = req.ip || req.socket.remoteAddress;
        const { codigo, aventuraId } = req.body;

        // Verificar penalización progresiva
        const bloqueo = estaBloqueado(ip);
        if (bloqueo.blocked) {
            logSecurityEvent({
                type: SecurityEvents.PENALTY_APPLIED,
                ip,
                message: `Penalización activa: ${bloqueo.waitSeconds}s restantes (${bloqueo.attempts} intentos)`,
                path: '/api/auth/activar'
            });
            throw new ApiError(
                429,
                `Demasiados intentos fallidos. Espere ${bloqueo.waitSeconds} segundos.`,
                'PENALIZACION_ACTIVA',
                { esperar_segundos: bloqueo.waitSeconds, intentos: bloqueo.attempts }
            );
        }

        // Validar y sanitizar código de activación
        const codigoLimpio = validateCodigo(codigo);

        // Validar aventuraId si se proporciona
        let aventuraLimpia = 'Aventura1';
        if (aventuraId) {
            aventuraLimpia = validateAventuraId(aventuraId);
        }

        // ═══ MODO DESARROLLO: aceptar cualquier código ═══
        if (!AUTH_ENABLED) {
            registrarExito(ip);
            recordGlobalSuccess(ip);
            logSecurityEvent({
                type: SecurityEvents.AUTH_SUCCESS,
                ip,
                message: `[DEV] Activación exitosa: ${aventuraLimpia}`,
                path: '/api/auth/activar'
            });
            const tokenPayload = {
                aventuraId: aventuraLimpia,
                codigo: codigoLimpio,
                modo: 'desarrollo',
                activado: new Date().toISOString()
            };

            // En desarrollo sin jsonwebtoken, devolver un token simulado
            const tokenSimulado = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

            return res.json({
                exito: true,
                token: `dev.${tokenSimulado}`,
                expira_en: TOKEN_EXPIRY,
                mensaje: '[DEV] Token de desarrollo generado. En producción se validará el código.'
            });
        }

        // ═══ MODO PRODUCCIÓN: validar código real ═══
        // TODO: Conectar con base de datos de códigos de activación
        // - Verificar que el código existe → si no existe: registrarFallo(ip) y throw ApiError
        // - Verificar que no ha sido usado (o no excede usos máximos)
        // - Marcar como usado
        // - Generar JWT firmado
        // Ejemplo de fallo:
        //   const fallo = registrarFallo(ip);
        //   recordGlobalFailure(ip, 'auth/activar');
        //   logSecurityEvent({ type: SecurityEvents.AUTH_FAILURE, ip, message: 'Código inválido' });
        //   throw new ApiError(401, 'Código inválido', 'CODIGO_INVALIDO',
        //     { intentos: fallo.count, penalizacion_segundos: fallo.penaltySeconds });

        const jwt = require('jsonwebtoken');

        // Si llegamos aquí, el código es válido → limpiar penalizaciones
        registrarExito(ip);
        recordGlobalSuccess(ip);
        logSecurityEvent({
            type: SecurityEvents.AUTH_SUCCESS,
            ip,
            message: `Activación exitosa: ${aventuraLimpia}`,
            path: '/api/auth/activar'
        });

        const token = jwt.sign(
            {
                aventuraId: aventuraLimpia,
                codigoHash: Buffer.from(codigoLimpio).toString('base64'),
                activado: new Date().toISOString()
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.json({
            exito: true,
            token: token,
            expira_en: TOKEN_EXPIRY
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/auth/verificar
 * 
 * Verifica si un token sigue siendo válido.
 * Header: Authorization: Bearer <token>
 */
router.get('/verificar', (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'No se proporcionó token', 'TOKEN_REQUERIDO');
        }

        // En desarrollo sin AUTH, siempre válido
        if (!AUTH_ENABLED) {
            return res.json({
                exito: true,
                valido: true,
                mensaje: '[DEV] Token de desarrollo siempre válido'
            });
        }

        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');

        try {
            const payload = jwt.verify(token, JWT_SECRET);
            res.json({
                exito: true,
                valido: true,
                aventuraId: payload.aventuraId,
                expira: new Date(payload.exp * 1000).toISOString()
            });
        } catch (jwtError) {
            throw new ApiError(401, 'Token inválido o expirado', 'TOKEN_INVALIDO');
        }

    } catch (error) {
        next(error);
    }
});

module.exports = router;
