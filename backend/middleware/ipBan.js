/**
 * Middleware de bloqueo permanente de IPs
 * 
 * Si una IP acumula demasiados fallos en una ventana de tiempo,
 * queda baneada automáticamente durante 24 horas.
 * 
 * Se aplica como middleware global ANTES de cualquier ruta.
 * Trabaja en conjunto con el sistema de penalización progresiva de auth.js.
 */

const { logSecurityEvent, SecurityEvents } = require('../utils/securityLogger');

// ========================================
// CONFIGURACIÓN
// ========================================
const BAN_THRESHOLD = 20;                      // Fallos para ban automático
const BAN_DURATION = 24 * 60 * 60 * 1000;     // 24 horas
const COUNTER_WINDOW = 60 * 60 * 1000;         // Ventana de 1 hora para contar fallos
const CLEANUP_INTERVAL = 60 * 60 * 1000;       // Limpieza cada hora

// ========================================
// ESTADO
// ========================================
const bannedIPs = new Map();       // IP → { bannedAt, expiresAt, reason }
const failureCounters = new Map(); // IP → { count, firstFailure }

// ========================================
// FUNCIONES DE GESTIÓN
// ========================================

/**
 * Banea una IP por la duración configurada
 */
function banIP(ip, reason) {
    const entry = {
        bannedAt: Date.now(),
        expiresAt: Date.now() + BAN_DURATION,
        reason
    };
    bannedIPs.set(ip, entry);

    logSecurityEvent({
        type: SecurityEvents.IP_BANNED,
        ip,
        message: `IP baneada por ${Math.round(BAN_DURATION / 3600000)}h: ${reason}`,
        details: { expiresAt: new Date(entry.expiresAt).toISOString() }
    });
}

/**
 * Comprueba si una IP está baneada
 */
function isIPBanned(ip) {
    const entry = bannedIPs.get(ip);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
        bannedIPs.delete(ip);
        logSecurityEvent({
            type: SecurityEvents.IP_UNBANNED,
            ip,
            message: 'Ban expirado, IP desbloqueada'
        });
        return false;
    }
    return true;
}

/**
 * Obtiene tiempo restante de ban en minutos
 */
function getBanTimeRemaining(ip) {
    const entry = bannedIPs.get(ip);
    if (!entry) return 0;
    return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 60000));
}

/**
 * Registra un fallo desde cualquier parte del sistema.
 * Si se supera el umbral, la IP queda baneada automáticamente.
 * 
 * @param {string} ip - Dirección IP
 * @param {string} context - Contexto del fallo (ej: 'auth/activar', 'retos/validar')
 * @returns {{ count: number, banned: boolean }}
 */
function recordFailure(ip, context) {
    const counter = failureCounters.get(ip) || { count: 0, firstFailure: Date.now() };

    // Reiniciar si la ventana expiró
    if (Date.now() - counter.firstFailure > COUNTER_WINDOW) {
        counter.count = 0;
        counter.firstFailure = Date.now();
    }

    counter.count++;
    failureCounters.set(ip, counter);

    const banned = counter.count >= BAN_THRESHOLD;
    if (banned) {
        banIP(ip, `${counter.count} fallos en ${Math.round(COUNTER_WINDOW / 60000)} min (${context})`);
        failureCounters.delete(ip);
    }

    return { count: counter.count, banned };
}

/**
 * Registra un éxito — limpia el contador de fallos de esa IP
 */
function recordSuccess(ip) {
    failureCounters.delete(ip);
}

/**
 * Obtiene estadísticas del sistema de ban
 */
function getStats() {
    return {
        bannedIPs: bannedIPs.size,
        trackedIPs: failureCounters.size,
        bans: Array.from(bannedIPs.entries()).map(([ip, entry]) => ({
            ip,
            reason: entry.reason,
            remainingMinutes: Math.ceil((entry.expiresAt - Date.now()) / 60000)
        }))
    };
}

// ========================================
// LIMPIEZA PERIÓDICA
// ========================================
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of bannedIPs.entries()) {
        if (now > entry.expiresAt) bannedIPs.delete(ip);
    }
    for (const [ip, counter] of failureCounters.entries()) {
        if (now - counter.firstFailure > COUNTER_WINDOW) failureCounters.delete(ip);
    }
}, CLEANUP_INTERVAL);

// ========================================
// MIDDLEWARE
// ========================================

/**
 * Middleware Express que bloquea peticiones de IPs baneadas.
 * Debe añadirse ANTES de todas las rutas en server.js:
 * 
 *   app.use(ipBanMiddleware);
 */
const ipBanMiddleware = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;

    if (isIPBanned(ip)) {
        const remainingMin = getBanTimeRemaining(ip);

        logSecurityEvent({
            type: SecurityEvents.BLOCKED_REQUEST,
            ip,
            message: `Petición bloqueada (ban activo, ${remainingMin} min restantes)`,
            path: req.path,
            method: req.method
        });

        return res.status(403).json({
            error: true,
            codigo: 'IP_BANEADA',
            mensaje: `Acceso temporalmente bloqueado. Inténtelo de nuevo en ${remainingMin} minutos.`
        });
    }
    next();
};

module.exports = {
    ipBanMiddleware,
    banIP,
    isIPBanned,
    getBanTimeRemaining,
    recordFailure,
    recordSuccess,
    getStats,
    BAN_THRESHOLD,
    BAN_DURATION
};
