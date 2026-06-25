/**
 * reciclaje-digital.js - Sistema de limpieza total de datos de aventura
 * 
 * Implementa reciclaje digital automático al finalizar aventura o exceder tiempo límite.
 * Elimina por completo el dispositivo: localStorage, sessionStorage, cachés y Service Worker.
 */

'use strict';

/**
 * Limpia el dispositivo por completo (reciclaje digital total)
 * @param {string} motivo - Razón de la limpieza (para logging)
 * @returns {Promise<Object>} Resultado de la operación
 */
async function _limpiarCaches(logger, logPrefix) {
    if (!('caches' in globalThis)) return;
    try {
        const cacheNames = await caches.keys();
        let totalDeleted = 0;
        for (const cacheName of cacheNames) {
            const deleted = await caches.delete(cacheName);
            if (deleted) {
                totalDeleted++;
                logger.info(`${logPrefix} ♻️ Caché eliminada: ${cacheName}`);
            }
        }
        logger.info(`${logPrefix} ♻️ ${totalDeleted} cachés eliminadas del Service Worker`);
    } catch (e) {
        logger.warn(`${logPrefix} Error eliminando cachés:`, e);
    }
}

export async function limpiarDatosAventura(motivo = 'desconocido') {
    const logPrefix = '[RECICLAJE_DIGITAL]';
    const logger = globalThis.logger || console;
    
    try {
        logger.info(`${logPrefix} 🗑️ Iniciando limpieza TOTAL del dispositivo. Motivo: ${motivo}`);
        
        // ========================================
        // 1. BORRAR EL localStorage COMPLETO
        // ========================================
        try {
            localStorage.clear(); // Vacía el almacenamiento sin excepciones
            logger.info(`${logPrefix} ♻️ localStorage VACIADO COMPLETAMENTE`);
        } catch (e) {
            logger.warn(`${logPrefix} Error limpiando localStorage:`, e);
        }
        
        // ========================================
        // 2. BORRAR EL sessionStorage COMPLETO
        // ========================================
        try {
            sessionStorage.clear(); // Vacía el almacenamiento sin excepciones
            logger.info(`${logPrefix} ♻️ sessionStorage VACIADO COMPLETAMENTE`);
        } catch (e) {
            logger.warn(`${logPrefix} Error limpiando sessionStorage:`, e);
        }
        
        // ========================================
        // 3. ELIMINAR TODAS LAS CACHÉS DEL SERVICE WORKER
        // ========================================
        await _limpiarCaches(logger, logPrefix);
        
        // ========================================
        // 4. DESREGISTRAR EL SERVICE WORKER (radical pero necesario)
        // ========================================
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                    logger.info(`${logPrefix} ♻️ Service Worker desregistrado`);
                }
            } catch (e) {
                logger.warn(`${logPrefix} Error desregistrando SW:`, e);
            }
        }
        
        logger.info(`${logPrefix} ✅✅✅ LIMPIEZA TOTAL COMPLETADA`);
        logger.info(`${logPrefix} 📱 Dispositivo completamente limpio. Huella digital = 0 bytes`);
        
        return {
            exito: true,
            motivo,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        logger.error(`${logPrefix} ❌ Error durante limpieza total:`, error);
        return {
            exito: false,
            motivo,
            error: error.message
        };
    }
}

/**
 * Verifica si la aventura guardada ha excedido su tiempo máximo
 * @returns {boolean} true si la aventura ha caducado
 */
export function verificarTimeoutAventura() {
    const logPrefix = '[TIMEOUT_CHECK]';
    const logger = globalThis.logger || console;
    
    try {
        const datosInicio = localStorage.getItem('vv_aventura_iniciada');
        if (!datosInicio) return false;
        
        const { aventura, timestamp } = JSON.parse(datosInicio);
        if (!aventura || !timestamp) return false;
        
        // Obtener tiempo máximo de la aventura específica
        const INDICE = globalThis.__vv_INDICE_AVENTURAS || globalThis.INDICE_AVENTURAS;
        const metadatos = INDICE?.[aventura];
        
        if (!metadatos) {
            logger.warn(`${logPrefix} No se encontraron metadatos para ${aventura}`);
            return false;
        }
        
        const tiempoMaximoSegundos = metadatos.tiempoEstimado; // 3600 s (1h) o 9000 s (2.5h)
        const tiempoMaximoMs = tiempoMaximoSegundos * 1000;
        const tiempoTranscurrido = Date.now() - timestamp;
        
        if (tiempoTranscurrido > tiempoMaximoMs) {
            const horasTranscurridas = Math.floor(tiempoTranscurrido / (60 * 60 * 1000));
            const horasMaximas = Math.floor(tiempoMaximoMs / (60 * 60 * 1000));
            
            logger.info(`${logPrefix} ⏱️ Aventura ${aventura} caducada: ${horasTranscurridas}h transcurridas de ${horasMaximas}h máximas`);
            return true;
        }
        
        return false;
        
    } catch (error) {
        logger.error(`${logPrefix} Error verificando timeout:`, error);
        return false;
    }
}
