/**
 * reciclaje-digital.js - Limpieza total de datos de aventura y red de seguridad automática
 *
 * Dos responsabilidades relacionadas que siempre se usan juntas:
 *
 *  limpiarDatosAventura()   — EJECUTA la limpieza: borra localStorage, sessionStorage,
 *                             cachés del Service Worker y desregistra el SW. Se llama
 *                             cuando el usuario pulsa un botón de final de aventura O
 *                             cuando la red de seguridad se dispara automáticamente.
 *
 *  verificarTimeoutAventura() — Comprueba al arrancar si la aventura guardada en
 *                             localStorage ya superó su tiempo máximo (60h / 150h).
 *                             Se usa en el arranque de En-busca-del-tesoro.html.
 *
 *  armarRedDeSeguridad()    — DETECTA el abandono: arma tres triggers (timeout 10 min +
 *                             visibilitychange + pagehide) para llamar a limpiarDatosAventura
 *                             automáticamente si el usuario deja el modal sin pulsar nada.
 *                             Importante: el "timeout de la aventura" (60h/150h) ya ocurrió
 *                             ANTES de llamar a esta función; el timeout interno de 10 min es
 *                             únicamente la ventana de gracia para que el usuario interactúe
 *                             con el modal de fin de aventura. Devuelve desarmar() para
 *                             cancelar la red en cuanto el usuario pulsa un botón real.
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

    // Bandera interna, sin efecto visual: avisa al bloque de actualización del SW
    // (codigo-padre.html) de que esta página se está reciclando, para que se calle.
    // Sin ella, el paso 4 —desregistrar el Service Worker— dispara controllerchange,
    // que ese bloque lee como "hay versión nueva": le sacaría al cliente el banner de
    // actualización justo al terminar su aventura y volvería a escribir
    // vv_sw_update_pendiente en el localStorage que el paso 1 acaba de vaciar,
    // rompiendo la huella de 0 bytes que promete esta función. Se levanta antes de
    // tocar nada y no se vuelve a bajar: la página termina recargándose.
    globalThis.__VV_RECICLANDO = true;

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
        if (!datosInicio) return { excedido: false };

        const { aventura, timestamp } = JSON.parse(datosInicio);
        if (!aventura || !timestamp) return { excedido: false };

        const INDICE = globalThis.__vv_INDICE_AVENTURAS || globalThis.INDICE_AVENTURAS;
        const metadatos = INDICE?.[aventura];

        if (!metadatos) {
            logger.warn(`${logPrefix} No se encontraron metadatos para ${aventura}`);
            return { excedido: false };
        }

        const tiempoMaximoMs = metadatos.tiempoEstimado * 1000; // tiempoEstimado en segundos (216000 = 60h, 540000 = 150h)
        const tiempoTranscurrido = Date.now() - timestamp;
        const tiempoTranscurridoMinutos = Math.floor(tiempoTranscurrido / 60000);
        const tiempoEstimadoMinutos = Math.floor(tiempoMaximoMs / 60000);

        if (tiempoTranscurrido > tiempoMaximoMs) {
            logger.info(`${logPrefix} ⏱️ Aventura ${aventura} caducada: ${tiempoTranscurridoMinutos}min de ${tiempoEstimadoMinutos}min máximos`);
            return { excedido: true, tiempoTranscurridoMinutos, tiempoEstimadoMinutos };
        }

        return { excedido: false };

    } catch (error) {
        logger.error(`${logPrefix} Error verificando timeout:`, error);
        return { excedido: false };
    }
}

const TIMEOUT_ABANDONO_MS = 10 * 60 * 1000; // gracia de 10 min tras mostrar el modal de fin

/**
 * Arma una red de seguridad que llama a accionLimpieza con lo primero que ocurra:
 * - 10 minutos de inactividad (pantalla bloqueada, usuario distraído)
 * - la pestaña pasa a segundo plano (visibilitychange → 'hidden')
 * - la pestaña se cierra (pagehide)
 *
 * Nota: el timeout de la aventura (60h/150h) ya se agotó ANTES de llamar aquí.
 * Los 10 min internos son solo la ventana de gracia para el modal de fin de aventura.
 *
 * @param {() => void|Promise<void>} accionLimpieza - misma acción que pulsar "otra aventura"
 * @param {string} etiqueta - identifica el origen en los logs ('FIN_AVENTURA', 'TIEMPO_AGOTADO', 'P17_DESPEDIDA')
 * @returns {() => void} desarmar - cancela la red; llamarla cuando el usuario pulse un botón real
 */
export function armarRedDeSeguridad(accionLimpieza, etiqueta) {
    const logPrefix = `[RED_SEGURIDAD][${etiqueta}]`;
    const logger = globalThis.logger || console;
    let activado = false;

    function ejecutar(origen) {
        if (activado) return;
        activado = true;
        desarmar();
        logger.info(`${logPrefix} Disparada por ${origen} — limpiando y reiniciando`);
        accionLimpieza();
    }

    const timerId = setTimeout(() => ejecutar('timeout-10min'), TIMEOUT_ABANDONO_MS);
    const onVisibility = () => { if (document.visibilityState === 'hidden') ejecutar('visibilitychange'); };
    const onPagehide = () => ejecutar('pagehide');

    document.addEventListener('visibilitychange', onVisibility);
    globalThis.addEventListener('pagehide', onPagehide);

    function desarmar() {
        clearTimeout(timerId);
        document.removeEventListener('visibilitychange', onVisibility);
        globalThis.removeEventListener('pagehide', onPagehide);
    }

    return desarmar;
}
