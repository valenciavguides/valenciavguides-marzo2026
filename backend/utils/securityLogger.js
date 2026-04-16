/**
 * Logger de eventos de seguridad
 * 
 * Registra intentos sospechosos, bloqueos y fallos de autenticación
 * en un fichero de log para su posterior análisis.
 * 
 * En desarrollo: también muestra en consola.
 * En producción: solo escribe al fichero.
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'security.log');

// Crear directorio de logs si no existe
try {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
} catch (err) {
    console.error('[SecurityLogger] No se pudo crear directorio de logs:', err.message);
}

/**
 * Tipos de evento de seguridad
 */
const SecurityEvents = {
    AUTH_FAILURE:       'AUTH_FAILURE',        // Fallo de autenticación
    AUTH_SUCCESS:       'AUTH_SUCCESS',        // Activación exitosa
    RATE_LIMIT_HIT:    'RATE_LIMIT_HIT',     // Límite de peticiones alcanzado
    IP_BANNED:         'IP_BANNED',           // IP baneada automáticamente
    IP_UNBANNED:       'IP_UNBANNED',         // Ban expirado
    BLOCKED_REQUEST:   'BLOCKED_REQUEST',     // Petición rechazada (IP baneada)
    SUSPICIOUS_INPUT:  'SUSPICIOUS_INPUT',    // Input con contenido sospechoso
    PENALTY_APPLIED:   'PENALTY_APPLIED',     // Penalización progresiva aplicada
    INVALID_TOKEN:     'INVALID_TOKEN'        // Token inválido presentado
};

/**
 * Registra un evento de seguridad
 * 
 * @param {Object} event
 * @param {string} event.type - Tipo de evento (ver SecurityEvents)
 * @param {string} event.ip - Dirección IP
 * @param {string} event.message - Descripción del evento
 * @param {string} [event.path] - Ruta de la petición
 * @param {string} [event.method] - Método HTTP
 * @param {Object} [event.details] - Detalles adicionales
 */
function logSecurityEvent(event) {
    const entry = {
        timestamp: new Date().toISOString(),
        type: event.type,
        ip: event.ip || 'unknown',
        message: event.message || '',
        path: event.path || undefined,
        method: event.method || undefined,
        details: event.details || undefined
    };

    // Eliminar campos undefined para log más limpio
    const cleanEntry = JSON.parse(JSON.stringify(entry));
    const line = JSON.stringify(cleanEntry) + '\n';

    // Escribir al fichero
    try {
        fs.appendFileSync(LOG_FILE, line);
    } catch (err) {
        console.error('[SecurityLogger] Error escribiendo log:', err.message);
    }

    // En desarrollo, también mostrar en consola
    if (process.env.NODE_ENV !== 'production') {
        const icon = event.type.includes('BANNED') || event.type.includes('BLOCKED') ? '🚫' :
                     event.type.includes('SUSPICIOUS') ? '⚠️' :
                     event.type.includes('FAILURE') ? '❌' :
                     event.type.includes('SUCCESS') ? '✅' : 'ℹ️';
        console.warn(`[SECURITY] ${icon} ${event.type}: ${event.ip} - ${event.message}`);
    }
}

/**
 * Lee los últimos N eventos del log (útil para monitoreo)
 * 
 * @param {number} count - Número de eventos a leer
 * @returns {Object[]} Array de eventos
 */
function getRecentEvents(count = 50) {
    try {
        if (!fs.existsSync(LOG_FILE)) return [];
        const content = fs.readFileSync(LOG_FILE, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);
        return lines.slice(-count).map(line => {
            try { return JSON.parse(line); } catch { return { raw: line }; }
        });
    } catch (err) {
        return [];
    }
}

module.exports = { logSecurityEvent, SecurityEvents, getRecentEvents, LOG_FILE, LOG_DIR };
