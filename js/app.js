/**
 * Módulo principal de la aplicación
 * @module App
 * @version 1.0.0
 *
 * IMPORTANTE — lógica dividida:
 * Este módulo exporta las funciones de orquestación (actualizarInterfazModo,
 * manejarCambioModo, coordinarAccion…).
 *
 * Los handlers que reaccionan a los mensajes reales del padre
 * (HIJO_PREPARADO, HIJO_LISTO, CAMBIO_PARADA, RETO.COMPLETADO, GPS.*, AUDIO.*…)
 * están registrados en el script type="module" de codigo-padre.html,
 * a partir de la línea ~2087 (buscar el comentario «Script 1 — controladores»).
 *
 * Ver deuda técnica DT-1 en docs/DEUDA-TECNICA-PRODUCCION.md.
 */

// Esperar a que mensajeria esté lista antes de ejecutar lógica crítica
let mensajeriaReady = false;

// Maps compartidos a nivel de módulo para el protocolo de cambio de modo.
// Los handlers de CAMBIO_MODO_ENTENDIDO/EFECTUADO se registran una sola vez
// y siempre escriben aquí. Se limpian al inicio de cada actualizarInterfazModo().
const _respuestasEntendidoActual = new Map();
const _respuestasEfectuadoActual = new Map();
let _modoHandlersRegistrados = false;

const mensajeriaReadyPromise = new Promise(resolve => {
    if (globalThis.mensajeria) {
        mensajeriaReady = true;
        resolve();
    } else {
        globalThis.addEventListener('mensajeriaReady', () => {
            mensajeriaReady = true;
            resolve();
        }, { once: true });
    }
});

// Registrar handlers ENTENDIDO/EFECTUADO lo antes posible (tras mensajería lista)
// para que estén disponibles antes del primer cambio de modo.
mensajeriaReadyPromise.then(() => {
    if (_modoHandlersRegistrados) return;
    _registrarHandlersModo();
});

import { TIPOS_MENSAJE, MODOS } from './constants.js';
import logger from './logger.js';
import { CONFIG } from './config.js';
import { generarIdUnico, resolverIdPadre, canonicalizarModo } from './utils.js';
import { promesasPendientes, registrarMetrica as registrarMetricaMonitoreo } from './monitoreo.js';
import { esMovil } from './device-detection.js';

import { DATOS_PADRE } from './aventuras-ID-padre.js';

// Access global mensajeria functions - ahora esperan a que esté lista
const enviarMensaje = (...args) => {
    if (mensajeriaReady && globalThis.mensajeria) {
        return globalThis.mensajeria.enviarMensaje(...args);
    } else {
        console.error('mensajeria not loaded', args);
        return Promise.reject(new Error('mensajeria not ready'));
    }
};
const registrarControlador = (...args) => {
    if (mensajeriaReady && globalThis.mensajeria) {
        return globalThis.mensajeria.registrarControlador(...args);
    } else {
        console.error('mensajeria not loaded', args);
        return Promise.reject(new Error('mensajeria not ready'));
    }
};
const enviarMensajeConConfirmacion = (...args) => {
    if (mensajeriaReady && globalThis.mensajeria) {
        return globalThis.mensajeria.enviarMensajeConConfirmacion(...args);
    } else {
        console.error('mensajeria not loaded', args);
        return Promise.reject(new Error('mensajeria not ready'));
    }
};
// registrarControladorSeguro is globally defined in codigo-padre.html or utils.js

/**
 * Registra los handlers para CAMBIO_MODO_ENTENDIDO y CAMBIO_MODO_EFECTUADO
 * una sola vez. Se invoca tanto desde el init temprano (mensajeriaReady)
 * como desde actualizarInterfazModo por si el init temprano aún no disparó.
 */
function _registrarHandlersModo() {
    if (_modoHandlersRegistrados) return;
    // registrarControladorSeguro se define en Script 1 de codigo-padre.html DESPUÉS de
    // que mensajeria.js se evalúa. Si aún no está listo, usamos registrarControlador
    // de mensajeria directamente (disponible desde que mensajeriaReady disparó).
    const registrar = globalThis.registrarControladorSeguro
        || (globalThis.mensajeria?.registrarControlador?.bind(globalThis.mensajeria));
    if (!registrar) return; // demasiado pronto: ni mensajería ni S1 listos aún
    _modoHandlersRegistrados = true;
    try {
        registrar(TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_ENTENDIDO, async (msg) => {
            _respuestasEntendidoActual.set(msg.origen, { timestamp: Date.now(), datos: msg.datos });
            logger.debug(`[actualizarInterfazModo] ENTENDIDO recibido de ${msg.origen}`);
            try {
                const { modo } = msg.datos || {};
                enviarMensaje({
                    tipo: TIPOS_MENSAJE.SISTEMA.ACK,
                    origen: resolverIdPadre(),
                    destino: msg.origen,
                    datos: { mensajeRecibido: 'CAMBIO_MODO_ENTENDIDO', modo, timestamp: Date.now() }
                });
            } catch (_e) { /* ACK es cosmético */ } // NOSONAR
        }, { permanente: true });
        registrar(TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_EFECTUADO, async (msg) => {
            _respuestasEfectuadoActual.set(msg.origen, { timestamp: Date.now(), datos: msg.datos });
            logger.debug(`[actualizarInterfazModo] EFECTUADO recibido de ${msg.origen}`);
            try {
                const { modo } = msg.datos || {};
                enviarMensaje({
                    tipo: TIPOS_MENSAJE.SISTEMA.ACK,
                    origen: resolverIdPadre(),
                    destino: msg.origen,
                    datos: { mensajeRecibido: 'CAMBIO_MODO_EFECTUADO', modo, timestamp: Date.now() }
                });
            } catch (_e) { /* ACK es cosmético */ } // NOSONAR
        }, { permanente: true });
        logger.debug('[APP] Handlers ENTENDIDO/EFECTUADO registrados correctamente');
    } catch (e) {
        logger.warn('[APP] Error registrando handlers de modo:', e?.message);
        // No resetear _modoHandlersRegistrados: si el primer handler ya fue registrado,
        // un reintento causaría doble registro. El guard de registrarControladorSeguro
        // evita duplicados, pero es más seguro no reintentar si algo falló a medio camino.
    }
}

/**
 * Migrar registros tempranos desde el fallback global a la mensajería.
 * Algunos módulos registran handlers antes de que `mensajeria` esté
 * completamente inicializada. Esta función re-aplica esas registraciones
 * al Map interno de `mensajeria` llamando a su `registrarControlador`.
 */
export async function registrarControladoresApp() {
    await mensajeriaReadyPromise; // Esperar a que mensajeria esté lista
    try {
        const migrarManejadoresTempranos = globalThis.mensajeria?.migrarManejadoresTempranos;
        
        if (!migrarManejadoresTempranos) {
             logger.debug('[APP][registrarControladores] migrarManejadoresTempranos no disponible (mensajeria no cargada o versión antigua)');
             return;
        }

        try {
            const migrated = migrarManejadoresTempranos();
            // Agregar verificación para evitar duplicados
            if (migrated && migrated.length > 0) {
                logger.info('[APP][registrarControladores] Controladores migrados (sin duplicados):', migrated.filter(m => !m.duplicado));
            } else {
                logger.debug('[APP][registrarControladores] No hay controladores tempranos para migrar');
            }
        } catch (e) {
            logger.warn('[APP][registrarControladores] Error migrando manejadores tempranos:', e?.message);
        }
    } catch (error) {
        logger.warn('[APP][registrarControladores] No se pudo migrar controladores (import failed):', error.message);
    }
}

// Estado global en codigo-padre.html

// Función para limpiar promesas pendientes expiradas
function limpiarPromesasPendientes() {
    const ttl = 60000; // Ajustado a 60 segundos
    const now = Date.now();
    for (const [id, promise] of promesasPendientes) {
        if (now - promise.timestamp > ttl) {
            promesasPendientes.delete(id);
        }
    }
}

// Intervalo separado para limpiar promesas pendientes cada 30s (sincronizado)
const intervaloLimpiezaPromesas = setInterval(() => {
    limpiarPromesasPendientes();
    // Limpiar mensajes trackeados en state-manager para evitar consumo RAM ilimitado
    if (globalThis.__vv_stateManager && typeof globalThis.__vv_stateManager.limpiarMensajesAntiguos === 'function') {
        globalThis.__vv_stateManager.limpiarMensajesAntiguos(1000);
    }
}, 30000);  // Sincronizado con mensajeria.js

// ==================== FUNCIONES AUXILIARES ====================

// Helper: wrap a promise with a conservative timeout that resolves to null on timeout
function withTimeout(promise, ms = 5000, desc = 'operation') {
    return Promise.race([
        promise,
        new Promise(resolve => setTimeout(() => {
            logger.warn(`[withTimeout] ${desc} timed out after ${ms}ms`);
            resolve(null);
        }, ms))
    ]);
}


// ============================================================
// NOTA: La función inicializar() ha sido movida a codigo-padre.html
// siguiendo el patrón arquitectónico donde cada componente (padre o hijo)
// tiene sus controladores y lógica de inicialización en su propio archivo HTML.
// Las siguientes funciones export se mantienen como utilidades para el padre.
// ============================================================

/**
 * Actualiza la interfaz de modo para todos los hijos inicializados
 * @param {Object} estado - Estado global de la aplicación
 * @param {string} modo - Nuevo modo ('casa' o 'aventura')
 */
export async function actualizarInterfazModo(estado, modo) {
    if (!estado) return;
    if (!estado.hijosInicializados) estado.hijosInicializados = new Set();
    if (typeof estado.hijosInicializados[Symbol.iterator] !== 'function') {
        logger.warn('[actualizarInterfazModo] estado.hijosInicializados no es iterable');
        return;
    }

    const hijosList = Array.from(estado.hijosInicializados);
    logger.info(`[actualizarInterfazModo] Protocolo bidireccional: cambio de modo '${modo}' a ${hijosList.length} hijos`);

    // Mapas para rastrear respuestas — compartidos con los handlers persistentes
    // Se limpian al inicio de cada llamada para que los handlers registrados una sola vez
    // siempre escriban en los Maps correctos.
    _respuestasEntendidoActual.clear();
    _respuestasEfectuadoActual.clear();
    const mensajeId = `modo_${Date.now()}`;

    // Asegurar que los handlers estén registrados (normalmente ya se hicieron
    // en el init temprano vía mensajeriaReadyPromise, pero por si acaso).
    _registrarHandlersModo();

    try {
        // 1. Enviar CAMBIO_MODO a todos los hijos
        logger.info(`[actualizarInterfazModo] Enviando CAMBIO_MODO a todos los hijos...`);
        const promesasEnvio = hijosList.map(hijoId => 
            enviarMensaje({
                destino: hijoId,
                tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
                origen: resolverIdPadre(),
                datos: { modo, secuenciaCompleta: !!estado?.todosHijosListos, mensajeId }
            }).catch(err => {
                logger.error(`[actualizarInterfazModo] Error enviando a ${hijoId}:`, err);
            })
        );
        await Promise.all(promesasEnvio);

        // 2. Esperar ENTENDIDO de todos (max 5s)
        logger.info(`[actualizarInterfazModo] Esperando ENTENDIDO de ${hijosList.length} hijos...`);
        await esperarRespuestas(_respuestasEntendidoActual, hijosList, 5000, 'ENTENDIDO');

        // 3. Esperar EFECTUADO de todos (max 10s)
        logger.info(`[actualizarInterfazModo] Esperando EFECTUADO de ${hijosList.length} hijos...`);
        await esperarRespuestas(_respuestasEfectuadoActual, hijosList, 10000, 'EFECTUADO');

        // 4. Enviar APLICADO a todos
        logger.info(`[actualizarInterfazModo] Enviando APLICADO a todos los hijos...`);
        const promesasAplicado = hijosList.map(hijoId =>
            enviarMensaje({
                destino: hijoId,
                tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_APLICADO,
                origen: resolverIdPadre(),
                datos: { modo, timestamp: Date.now(), mensajeId }
            }).catch(err => {
                logger.error(`[actualizarInterfazModo] Error enviando APLICADO a ${hijoId}:`, err);
            })
        );
        await Promise.all(promesasAplicado);

        logger.success(`[actualizarInterfazModo] ✅ Protocolo bidireccional completado para modo '${modo}'`);

    } finally {
        // No hay cleanup de handlers - permanecen registrados y reutilizan
        // los Maps de módulo que se limpian al inicio de cada llamada.
        _respuestasEntendidoActual.clear();
        _respuestasEfectuadoActual.clear();
    }
}

// Helper: esperar respuestas de todos los hijos con timeout
async function esperarRespuestas(mapaRespuestas, hijosEsperados, timeoutMs, tipoRespuesta) {
    const inicio = Date.now();
    const intervaloChequeo = 100; // Chequear cada 100ms
    
    while (Date.now() - inicio < timeoutMs) {
        // Verificar si todos respondieron
        const todosRespondieron = hijosEsperados.every(hijo => mapaRespuestas.has(hijo));
        if (todosRespondieron) {
            logger.info(`[esperarRespuestas] Todos los hijos respondieron ${tipoRespuesta} en ${Date.now() - inicio}ms`);
            return;
        }
        
        // Esperar un poco antes del siguiente chequeo
        await new Promise(resolve => setTimeout(resolve, intervaloChequeo));
    }
    
    // Timeout: reportar quiénes no respondieron
    const noRespondieron = hijosEsperados.filter(hijo => !mapaRespuestas.has(hijo));
    logger.warn(`[esperarRespuestas] Timeout esperando ${tipoRespuesta} de: ${noRespondieron.join(', ')}`);
}

// Añadir función auxiliar para reintentos con confirmación
async function enviarMensajeConReintento(mensaje, maxReintentos = 3) {
    for (let intento = 1; intento <= maxReintentos; intento++) {
        try {
            return await enviarMensajeConConfirmacion({
                tipo: mensaje.tipo,
                origen: mensaje.origen,
                destino: mensaje.destino,
                datos: mensaje.datos,
                timeout: 15000  // Aumentar timeout a 15 segundos
            });
        } catch (error) {
            if (intento === maxReintentos) throw error;
            logger.warn(`[APP] Reintento ${intento} para mensaje ${mensaje.tipo} a ${mensaje.destino}:`, error);
            await new Promise(resolve => setTimeout(resolve, 1000 * intento));  // Backoff exponencial
        }
    }
}

/**
 * Notifica un error al sistema.
 * @param {string} codigo - Código de error.
 * @param {Error} error - Objeto de error.
 * @param {Object} [contexto] - Contexto adicional del error.
 */
export function notificarError(codigo, error, contexto = {}) {
    logger.error('Error crítico:', error);
    try {
        const r = enviarMensaje({
            destino: resolverIdPadre(),
            tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
            origen: resolverIdPadre(),
            datos: {
                codigo,
                mensaje: error.message,
                stack: error.stack,
                contexto,
                timestamp: new Date().toISOString()
            }
        });
        if (r && typeof r.then === 'function') {
            r.catch(err => logger.error('Error al notificar error:', err));
        }
    } catch (err) {
        logger.error('Error al notificar error:', err);
    }
}

/**
 * Valida el mensaje de cambio de modo.
 * @param {Object} mensaje - Mensaje recibido.
 * @returns {boolean} - True si el mensaje es válido, lanza un error si no lo es.
 */
function validarCambioModoMensaje(mensaje) {
    if (!mensaje || typeof mensaje !== 'object') {
        throw new Error('Mensaje de cambio de modo no válido: debe ser un objeto.');
    }

    const { modo } = mensaje.datos || {};

    if (!modo) {
        throw new Error(`Modo no válido: ${modo}`);
    }
    
    // Compara con constantes para mayor compatibilidad
    const modoCanonical = canonicalizarModo(modo);
    if (!modoCanonical) {
        throw new Error(`Modo no válido: ${modo}`);
    }

    return true;
}

// Constantes para los modos de operación del sistema (diferentes a MODOS de constants.js que son 'casa'/'aventura')
const MODOS_OPERACION = {
    casa: {
        nombre: 'Casa',
        descripcion: 'Modo Casa (funcionamiento por defecto)',
        puedeCambiar: true
    },
    aventura: {
        nombre: 'Aventura',
        descripcion: 'Modo Aventura (usuario en ruta)',
        puedeCambiar: true
    },
    mantenimiento: {
        nombre: 'Mantenimiento',
        descripcion: 'Modo para realizar tareas de mantenimiento',
        puedeCambiar: true,
        requiereAutenticacion: true
    },
    depuracion: {
        nombre: 'Depuración',
        descripcion: 'Modo para depuración con logs detallados',
        puedeCambiar: true,
        requiereAutenticacion: true
    },
    emergencia: {
        nombre: 'Emergencia',
        descripcion: 'Modo para situaciones de emergencia',
        puedeCambiar: true,
        requiereAutenticacion: true
    }
};

async function _activarParadaDefectoAventura() {
    try {
        const { elementosIDpadre } = DATOS_PADRE[globalThis.aventuraSeleccionada][globalThis.idiomaSeleccionado];
        if (elementosIDpadre && elementosIDpadre.length > 0) {
            const paradaDefecto = elementosIDpadre.find(p => p.padreid === 'padre-P-0') || elementosIDpadre[0];
            const paradaId = paradaDefecto.parada_id || paradaDefecto.tramo_id || paradaDefecto.id || 'P-0';
            const padreId = paradaDefecto.padreid || `padre-${paradaId}`;
            const payloadCambioParada = {
                tipo: TIPOS_MENSAJE.NAVEGACION.CAMBIO_PARADA,
                origen: resolverIdPadre(),
                destino: resolverIdPadre(),
                datos: {
                    paradaId,
                    parada_id: paradaId,
                    padreId,
                    padreid: padreId,
                    contexto: 'arranque_aventura',
                    timestamp: Date.now()
                }
            };

            logger.info(`[APP][CAMBIO_MODO] Activando flujo principal de CAMBIO_PARADA para ${padreId}`);

            if (globalThis.__vv_stateManager && typeof globalThis.__vv_stateManager.enviarMensajeCentral === 'function') {
                await globalThis.__vv_stateManager.enviarMensajeCentral(payloadCambioParada);
                logger.debug(`[APP][CAMBIO_MODO] CAMBIO_PARADA inicial enviado al controlador central para ${padreId}`);
            } else {
                const targetOrigin = globalThis.location.origin === 'null'
                    ? '*'
                    : globalThis.location.origin;
                globalThis.postMessage({
                    ...payloadCambioParada,
                    origen: 'app-bootstrap'
                }, targetOrigin);
                logger.warn(`[APP][CAMBIO_MODO] State manager no disponible; fallback via postMessage para ${padreId}`);
            }
        }
    } catch (e) {
        logger.warn('[APP][CAMBIO_MODO] Error estableciendo parada por defecto:', e);
    }
}

function _preiniciarHeartbeatSiNecesario(estado, promises) {
    if (estado.sistema?.prewarmIniciado && estado.sistema?.prewarmPausado) {
        logger.debug('[APP][CAMBIO_MODO] Pre-warm detectado (iniciado en CASA), se reanudará en lugar de reiniciarse');
    } else {
        if (globalThis.mensajeria && typeof globalThis.mensajeria.preiniciarHeartbeat === 'function') {
            promises.push(globalThis.mensajeria.preiniciarHeartbeat());
            logger.debug('[APP][CAMBIO_MODO] Pre-iniciando heartbeat en background (no estaba pre-iniciado)');
        }
        logger.debug('[APP][CAMBIO_MODO] GPS warmup disabled; skipping GPS prewarm');
    }
}

async function _reanudarSubsistemasTrasPrewarm(estado) {
    if (globalThis.mensajeria && typeof globalThis.mensajeria.reanudarHeartbeat === 'function') {
        globalThis.mensajeria.reanudarHeartbeat();
        logger.debug('[APP][CAMBIO_MODO] Heartbeat reanudado tras pre-warm');
    }
    if (globalThis.funcionesMapa && typeof globalThis.funcionesMapa.iniciarGPSAventura === 'function') {
        await globalThis.funcionesMapa.iniciarGPSAventura();
        logger.debug('[APP][CAMBIO_MODO] Iniciado GPS aventura tras pre-warm');
    }
    if (!(estado.sistema?.prewarmIniciado && estado.sistema?.prewarmPausado)) {
        await _activarParadaDefectoAventura();
        estado.sistema.prewarmIniciado = true;
    }
    estado.sistema.prewarmPausado = false;
}

async function _prewarmAventura(estado) {
    const cfgConfirmTimeout = globalThis.Config?.MENSAJERIA?.TIMEOUTS?.CONFIRMACION || 10000;
    const promises = [];

    try {
        _preiniciarHeartbeatSiNecesario(estado, promises);
    } catch (prewarmError) { logger.warn('[APP][CAMBIO_MODO] Error lanzando prewarm inicial:', prewarmError); }

    const hijosPromise = (globalThis.mensajeria && typeof globalThis.mensajeria.esperarHijosListos === 'function')
        ? globalThis.mensajeria.esperarHijosListos(cfgConfirmTimeout)
        : Promise.resolve({ ready: true });

    try {
        const race = await Promise.race([
            (async () => { await Promise.allSettled(promises); return hijosPromise; })(),
            new Promise(resolve => setTimeout(() => resolve({ timeout: true }), cfgConfirmTimeout * 2))
        ]);

        if (race?.timeout) {
            logger.info('[APP][CAMBIO_MODO] Pre-warm / HIJO_LISTO timed out; proceeding anyway');
        } else {
            logger.info('[APP][CAMBIO_MODO] Pre-warm and/or HIJO_LISTO completed or settled');
        }

        try {
            await _reanudarSubsistemasTrasPrewarm(estado);
        } catch (e) { logger.warn('[APP][CAMBIO_MODO] Error reanudando/iniciando subsistemas tras pre-warm:', e); }
    } catch (e) {
        logger.warn('[APP][CAMBIO_MODO] Error esperando prewarm/hijosListos:', e);
    }
}

function _pausarHeartbeatCasa(estado) {
    try {
        if (globalThis.mensajeria && typeof globalThis.mensajeria.pausarHeartbeat === 'function') {
            globalThis.mensajeria.pausarHeartbeat();
            logger.debug('[APP][CAMBIO_MODO] Heartbeat pausado al cambiar a CASA');
        }
    } catch (e) { logger.warn('[APP][CAMBIO_MODO] Error pausando heartbeat al cambiar a CASA:', e); }

    estado.sistema.prewarmPausado = estado.sistema.prewarmPausado || false;
}

async function _flujoPrewarmModo(estado, modoKey, modoNormalized) {
    const esAventura = (modoKey === 'AVENTURA') || (modoNormalized === MODOS.AVENTURA);
    const esCasa = (modoKey === 'CASA') || (modoNormalized === MODOS.CASA);

    try {
        if (esAventura) {
            await _prewarmAventura(estado);
        } else if (esCasa) {
            _pausarHeartbeatCasa(estado);
        }
    } catch (e) {
        logger.warn('[APP][CAMBIO_MODO] Error en flujo de pre-warm:', e);
    }
}

async function _limpiarMapaTrasMode(modoNormalized, logPrefix) {
    try {
        if (globalThis.funcionesMapa) {
            if (typeof globalThis.funcionesMapa.limpiarPorEstado === 'function') {
                await globalThis.funcionesMapa.limpiarPorEstado({ modo: modoNormalized });
                logger.debug(`${logPrefix} Capas del mapa limpiadas para modo ${modoNormalized}`);
            }
            if (typeof globalThis.funcionesMapa.setMapView === 'function') {
                const defaultCenter = CONFIG?.MAPA?.CENTRO_DEFECTO || [39.4699, -0.3763];
                const defaultZoom = (typeof CONFIG?.MAPA?.ZOOM_INICIAL === 'number') ? CONFIG.MAPA.ZOOM_INICIAL : 13;
                await globalThis.funcionesMapa.setMapView(defaultCenter, defaultZoom, { animate: true, duration: 0.6 });
                logger.debug(`${logPrefix} Vista del mapa restaurada a zoom ${defaultZoom}`);
            }
        }
    } catch (mapaErr) {
        logger.warn(`${logPrefix} Error limpiando mapa tras cambio de modo:`, mapaErr?.message);
    }
}

async function _notificarErrorCambioModo(mensaje, errorMsg, error, modo, logPrefix) {
    try {
        await enviarMensaje({
            destino: mensaje?.origen || 'sistema',
            tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
            origen: resolverIdPadre(),
            mensajeId: generarIdUnico(),
            timestamp: Date.now(),
            datos: {
                codigo: 'ERROR_CAMBIO_MODO',
                mensaje: errorMsg,
                detalles: error.message,
                modoSolicitado: modo,
                mensajeOriginal: mensaje
            }
        });
    } catch (errorNotificacion) { // NOSONAR
        logger.error(`${logPrefix} Error al notificar fallo: ${errorNotificacion.message}`, {
            error: errorNotificacion
        });
    }
}

/**
 * Maneja los cambios de modo en la aplicación.
 * Este controlador se encarga de:
 * - Procesar solicitudes de cambio de modo
 * - Validar la transición de modos
 * - Actualizar el estado global
 * - Notificar a los componentes afectados
 *
 * @param {Object} mensaje - El mensaje de cambio de modo
 * @param {string} mensaje.origen - Origen del mensaje
 * @param {Object} estado - Estado global de la aplicación
 * @param {string} mensaje.mensajeId - ID único del mensaje
 * @param {Object} mensaje.datos - Datos del cambio de modo
 * @param {string} mensaje.datos.modo - Nuevo modo a establecer
 * @param {Object} [mensaje.datos.opciones] - Opciones adicionales para el cambio de modo
 * @param {string} [mensaje.datos.motivo] - Razón del cambio de modo
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function manejarCambioModo(estado, mensaje) {
    const logPrefix = `[SISTEMA.CAMBIO_MODO][${mensaje?.origen || 'desconocido'}]`;
    const timestamp = Date.now();
    const mensajeId = mensaje?.mensajeId || generarIdUnico();
    
    // 1. Validación inicial del mensaje
    if (!mensaje?.datos) {
        const errorMsg = 'Mensaje de cambio de modo inválido: datos faltantes';
        logger.error(`${logPrefix} ${errorMsg}`, { mensajeId });
        return { exito: false, error: errorMsg };
    }

    const { modo, opciones = {}, motivo = 'no especificado' } = mensaje.datos;

    // Normalizar modo usando helper centralizado
    const modoNormalized = canonicalizarModo(modo); // 'casa'|'aventura' or null
    const modosKeys = Object.keys(MODOS); // ['CASA','AVENTURA']
    const modoKey = modosKeys.find(k => MODOS[k] === modoNormalized) || null;

    try {
        // 2. Validar modo solicitado (ahora normalizado)
        if (!modoNormalized) {
            const errorMsg = `Modo inválido: '${modo}'. Válidos: ${modosKeys.join(', ')}`;
            logger.warn(`${logPrefix} ${errorMsg}`, { modo, mensajeId });
            return { exito: false, error: errorMsg };
        }

        // 3. Validar transición de modos
        const modoActual = estado.modo?.actual || MODOS.CASA;
        if (modoNormalized === modoActual) {
            logger.info(`${logPrefix} El modo ya está establecido a '${modoNormalized}'`, { mensajeId });
            return { exito: true, cambiado: false, modoActual };
        }

        // 4. Registrar evento de cambio de modo
        const eventoCambioModo = {
            modoAnterior: modoActual,
            modoNuevo: modoNormalized,
            timestamp,
            origen: mensaje.origen,
            motivo,
            opciones
        };

        registrarEvento('CAMBIO_MODO', eventoCambioModo);

        // 5. Validar permisos (si es necesario) - comprobar en MODOS_OPERACION de forma segura
        // Buscar configuración de permisos en MODOS_OPERACION usando varias formas de key
        const permisoCfg = MODOS_OPERACION?.[modoNormalized] || MODOS_OPERACION?.[modoKey?.toLowerCase?.()] || MODOS_OPERACION?.[modoKey];
        if (permisoCfg?.requiereAutenticacion) {
            const tienePermisos = await validarPermisosCambioModo(mensaje.origen, modoNormalized);
            if (!tienePermisos) {
                const errorMsg = 'No tiene permisos para cambiar a este modo';
                logger.warn(`${logPrefix} ${errorMsg}`, { origen: mensaje.origen, modo: modoNormalized });
                return { exito: false, error: errorMsg };
            }
        }

        // 6. Notificar inicio del cambio de modo
        logger.info(`${logPrefix} Iniciando cambio de modo '${modoActual}' a '${modoNormalized}'`, {
            motivo,
            origen: mensaje.origen,
            timestamp: new Date(timestamp).toISOString()
        });

        // 7. Bloquear cambios concurrentes
        if (estado.sistema?.cambiandoModo) {
            const errorMsg = 'Ya hay un cambio de modo en curso';
            logger.warn(`${logPrefix} ${errorMsg}`, { mensajeId });
            return { exito: false, error: errorMsg };
        }

        // Marcar que estamos cambiando de modo
        estado.sistema = estado.sistema || {};
        estado.sistema.cambiandoModo = true;

        // OPTIMISTIC UPDATE: actualizar estado de modo inmediatamente (normalizado)
        try {
            estado.modo = estado.modo || {};
            estado.modo.anterior = modoActual;
            estado.modo.actual = modoNormalized;
            estado.modo.ultimoCambio = {
                timestamp,
                origen: mensaje.origen,
                motivo,
                opciones
            };
        } catch (e) {
            logger.warn(`${logPrefix} No se pudo aplicar optimistic update:`, e?.message);
        }

        // **NUEVO: Limpiar recursos inmediatamente después del cambio de modo**
        try {
            await limpiarRecursosPorModo(estado, modoNormalized, opciones);
            logger.info(`${logPrefix} Recursos limpiados inmediatamente después del cambio de modo`);
        } catch (errorLimpieza) { // NOSONAR
            logger.warn(`${logPrefix} Error limpiando recursos:`, errorLimpieza);
            // No bloquear el cambio de modo por errores de limpieza
        }

        try {
            // 8. Notificar a los componentes del cambio inminente (no bloquear>5s)
            await withTimeout(notificarCambioModoInminente(modoActual, modoNormalized, motivo), 15000, 'notificarCambioModoInminente');

            // 8.1 Preparar pre-warm / pausar según el modo (usar valores normalizados)
            await _flujoPrewarmModo(estado, modoKey, modoNormalized);

            // (Estado ya actualizado de forma optimista antes) - asegurar campos mínimos
            estado.modo = estado.modo || {};
            estado.modo.anterior = estado.modo.anterior || modoActual;
            estado.modo.actual = estado.modo.actual || modoNormalized;
            estado.modo.ultimoCambio = estado.modo.ultimoCambio || {
                timestamp,
                origen: mensaje.origen,
                motivo,
                opciones
            };

            // 10. Actualizar interfaz según el modo (no bloquear>5s por interfaz)
            const hijosInicializados = estado.hijosInicializados ? Array.from(estado.hijosInicializados) : [];
            logger.info(`${logPrefix} Iniciando actualización de interfaz para ${hijosInicializados.length} hijos: ${hijosInicializados.join(', ')}`);
            await withTimeout(actualizarInterfazModo(estado, modoNormalized), 15000, 'actualizarInterfazModo');

            // 10b. Limpiar capas del mapa y restaurar vista por defecto según modo
            // (funciones-mapa no recibe CAMBIO_MODO por conflicto de handler, así que lo hacemos directamente)
            await _limpiarMapaTrasMode(modoNormalized, logPrefix);

            // 11. Notificar a los componentes del cambio completado (no bloquear>5s)
            await withTimeout(notificarCambioModoCompletado(modoActual, modoNormalized, motivo), 15000, 'notificarCambioModoCompletado');

            // 12. Registrar éxito
            logger.info(`${logPrefix} Cambio de modo completado exitosamente`, {
                modoAnterior: modoActual,
                modoNuevo: modoNormalized,
                duracion: `${Date.now() - timestamp}ms`
            });

            return { 
                exito: true, 
                cambiado: true,
                modoAnterior: modoActual, 
                modoActual: modoNormalized,
                timestamp
            };

        } catch (errorCambio) { // NOSONAR
            const errorMsg = `Error durante el cambio de modo: ${errorCambio.message}`;
            logger.error(`${logPrefix} ${errorMsg}`, {
                error: errorCambio,
                stack: errorCambio.stack,
                modoActual,
                modoSolicitado: modoNormalized
            });

            // Intentar restaurar el estado anterior
            try {
                await restaurarEstadoModoAnterior(estado, modoActual, modo, errorMsg);
            } catch (errorRestauracion) { // NOSONAR
                logger.error(`${logPrefix} Error al restaurar el modo anterior: ${errorRestauracion.message}`, {
                    error: errorRestauracion,
                    modoActual,
                    modoFallido: modo
                });
            }

            return { 
                exito: false, 
                error: errorMsg,
                modoActual: estado.modo?.actual,
                modoAnterior: modoActual
            };
        } finally {
            // Asegurarse de desbloquear el cambio de modo
            if (estado.sistema) {
                estado.sistema.cambiandoModo = false;
            }
        }

    } catch (error) {
        const errorMsg = `Error al procesar el cambio de modo: ${error.message}`;
        logger.error(`${logPrefix} ${errorMsg}`, {
            error: error.message,
            stack: error.stack,
            modoSolicitado: modo,
            mensajeOriginal: mensaje
        });

        // Notificar error sin causar bucle
        await _notificarErrorCambioModo(mensaje, errorMsg, error, modo, logPrefix);

        return { 
            exito: false, 
            error: errorMsg,
            modoActual: estado.modo?.actual
        };
    }
}

/**
 * Inicia (idempotente) el pre-warm de subsistemas cuando la app está en modo CASA.
 * Pre-inicia (inicializa en background) GPS y Heartbeat pero los deja en estado pausado.
 * Esto permite reanudar rápidamente al cambiar a AVENTURA.
 */
export async function iniciarPrewarmEnCasa(estado = globalThis.estadoPadre) {
    try {
        if (!estado) return { iniciado: false, motivo: 'estado no disponible' };
        const modoActual = estado.modo?.actual || MODOS.CASA;
        if (modoActual !== MODOS.CASA) return { iniciado: false, motivo: 'modo no es CASA' };

        estado.sistema = estado.sistema || {};
        if (estado.sistema.prewarmIniciado) {
            logger.debug('[APP][PREWARM] Ya iniciado previamente, omitiendo re-inicio');
            return { iniciado: true, motivo: 'ya_iniciado' };
        }

        // GPS warmup removed: only pre-initialize heartbeat here

        // Pre-iniciar heartbeat (preparado pero pausado)
        try {
            if (globalThis.mensajeria && typeof globalThis.mensajeria.preiniciarHeartbeat === 'function') {
                await withTimeout(globalThis.mensajeria.preiniciarHeartbeat(), 5000, 'preiniciarHeartbeat');
                if (typeof globalThis.mensajeria.pausarHeartbeat === 'function') {
                    globalThis.mensajeria.pausarHeartbeat();
                }
                logger.info('[APP][PREWARM] Heartbeat pre-iniciado y pausado');
            }
        } catch (e) {
            logger.warn('[APP][PREWARM] Fallback: preiniciarHeartbeat falló, continuando sin prewarm', e?.message);
        }

        estado.sistema.prewarmIniciado = true;
        estado.sistema.prewarmPausado = true;

        return { iniciado: true };
    } catch (err) {
        logger.warn('[APP][PREWARM] Error iniciando prewarm en CASA:', err);
        return { iniciado: false, motivo: err.message };
    }
}

// Auto-run seguro: si el estado del padre ya existe y está en CASA, iniciar pre-warm.
// Si no está disponible aún, comprobar periódicamente durante unos segundos.
if (globalThis.window !== undefined) {
    (async () => {
        try {
            const tryStart = async () => {
                if (globalThis.estadoPadre && (globalThis.estadoPadre.modo?.actual === MODOS.CASA || !globalThis.estadoPadre.modo)) {
                    await iniciarPrewarmEnCasa(globalThis.estadoPadre);
                    return true;
                }
                return false;
            };

            if (!(await tryStart())) {
                // Reintentar a intervalos cortos hasta 5s
                const maxRetries = 10;
                let attempts = 0;
                const iv = setInterval(async () => {
                    attempts++;
                    if (await tryStart() || attempts >= maxRetries) {
                        clearInterval(iv);
                    }
                }, 500);
            }
        } catch (e) {
            logger.warn('[APP][PREWARM] Auto-run prewarm falló:', e);
        }
    })();
}

/**
 * Valida los permisos para cambiar a un modo específico
 * @private
 */
async function validarPermisosCambioModo(origen, modo) {
    // Implementar lógica de validación de permisos
    return true;
}

/**
 * Notifica a los componentes sobre un cambio de modo inminente
 * @private
 */
async function notificarCambioModoInminente(modoAnterior, modoNuevo, motivo) {
    logger.info(`[notificarCambioModoInminente] Notificando cambio inminente: ${modoAnterior} → ${modoNuevo} (motivo: ${motivo})`);
    // Notificar a los componentes
    await enviarMensaje({
        tipo: TIPOS_MENSAJE.SISTEMA.NOTIFICACION,
        origen: 'sistema',
        destino: 'broadcast',
        mensajeId: generarIdUnico(),
        timestamp: Date.now(),
        datos: {
            tipo: 'cambio_modo_iniciado',
            modoAnterior,
            modoNuevo,
            motivo,
            timestamp: Date.now()
        }
    });
    logger.debug(`[notificarCambioModoInminente] Notificación broadcast enviada`);
}

/**
 * Notifica a los componentes que el cambio de modo se completó
 * @private
 */
async function notificarCambioModoCompletado(modoAnterior, modoNuevo, motivo) {
    logger.info(`[notificarCambioModoCompletado] Notificando cambio completado: ${modoAnterior} → ${modoNuevo} (motivo: ${motivo})`);
    // Notificar a los componentes
    await enviarMensaje({
        tipo: TIPOS_MENSAJE.SISTEMA.NOTIFICACION,
        origen: 'sistema',
        destino: 'broadcast',
        mensajeId: generarIdUnico(),
        timestamp: Date.now(),
        datos: {
            tipo: 'cambio_modo_completado',
            modoAnterior,
            modoActual: modoNuevo,
            motivo,
            timestamp: Date.now()
        }
    });
    logger.debug(`[notificarCambioModoCompletado] Notificación broadcast enviada`);
}

/**
 * Limpia recursos específicos según el modo
 * @private
 * @param {Object} estado - Estado global de la aplicación
 */
async function limpiarRecursosPorModo(estado, modo, opciones = {}) {
    try {
        logger.info(`[APP][LIMPIAR_RECURSOS] Iniciando limpieza completa para cambio a modo '${modo}'`);
        // **NUEVO: Resetear estado de navegación para "empezar de nuevo"**
        logger.info(`[APP][LIMPIAR_RECURSOS] Reseteando estado para cambio a modo '${modo}'`);

        // Resetear selecciones previas
        estado.paradaActual = null;
        estado.tramoActual = null;
        estado.elementoActual = null;
        estado.siguiendoRuta = false;

        // Resetear estado GPS
        estado.gps = estado.gps || {};
        estado.gps.activo = false;
        estado.gps.posicionUsuario = null;
        estado.gps.watchId = null;

        // Resetear otros estados relacionados
        estado.retoActivo = false;
        estado.audioActivo = false;
        estado.ubicacionActiva = false;

        logger.debug(`[APP][LIMPIAR_RECURSOS] Estado de navegación reseteado`);

        // Limpiar mapa completamente
        if (globalThis.funcionesMapa?.limpiarPorEstado) {
            // Esperar a que el mapa esté inicializado si no lo está
            if (!globalThis.funcionesMapa.isMapInitialized?.()) {
                logger.info(`[APP][LIMPIAR_RECURSOS] Mapa no inicializado, esperando...`);
                // Esperar hasta 5 segundos a que el mapa se inicialice
                await new Promise(resolve => {
                    const checkMap = () => {
                        if (globalThis.funcionesMapa.isMapInitialized?.()) {
                            resolve();
                        } else {
                            setTimeout(checkMap, 100);
                        }
                    };
                    setTimeout(() => resolve(), 5000); // Timeout de 5 segundos
                    checkMap();
                });
            }

            const estadoLimpieza = {
                modo: modo,
                paradaActual: null,
                tramoActual: null,
                resetCompleto: true, // Flag para indicar reset completo
                ...opciones
            };

            logger.info(`[APP][LIMPIAR_RECURSOS] Llamando a limpiarPorEstado con resetCompleto: true`);
            const limpiado = await globalThis.funcionesMapa.limpiarPorEstado(estadoLimpieza);

            if (limpiado) {
                logger.debug(`[APP][LIMPIAR_RECURSOS] Mapa limpiado completamente para modo ${modo}`);
            } else {
                logger.warn(`[APP][LIMPIAR_RECURSOS] limpiarPorEstado devolvió false`);
            }
        } else {
            logger.error(`[APP][LIMPIAR_RECURSOS] globalThis.funcionesMapa.limpiarPorEstado no disponible`);
        }

        // Limpiar overlays activos (imágenes, videos)
        if (globalThis.cerrarImagenOverlay) {
            try {
                globalThis.cerrarImagenOverlay();
                logger.debug(`[APP][LIMPIAR_RECURSOS] Overlay de imagen cerrado`);
            } catch (e) {
                logger.warn(`[APP][LIMPIAR_RECURSOS] Error cerrando overlay de imagen:`, e);
            }
        }

        if (globalThis.cerrarVideoOverlay) {
            try {
                globalThis.cerrarVideoOverlay();
                logger.debug(`[APP][LIMPIAR_RECURSOS] Overlay de video cerrado`);
            } catch (e) {
                logger.warn(`[APP][LIMPIAR_RECURSOS] Error cerrando overlay de video:`, e);
            }
        }

        logger.info(`[APP][LIMPIAR_RECURSOS] Limpieza completa para modo ${modo} finalizada`);

    } catch (error) {
        logger.error('Error en limpieza de recursos por modo:', {
            error: error.message,
            stack: error.stack,
            modo
        });
        throw error; // Relanzar para manejarlo en el flujo principal
    }
}

/**
 * Restaura el estado anterior después de un fallo en el cambio de modo
 * @private
 * @param {Object} estado - Estado global de la aplicación
 */
async function restaurarEstadoModoAnterior(estado, modoAnterior, modoFallido, motivo) {
    // Restaurar el modo anterior
    if (estado.modo) {
        estado.modo.actual = modoAnterior;
        estado.modo.anterior = modoFallido;
    }
    
    // Notificar a los componentes
    await enviarMensaje({
        tipo: TIPOS_MENSAJE.SISTEMA.NOTIFICACION,
        origen: 'sistema',
        mensajeId: generarIdUnico(),
        timestamp: Date.now(),
        datos: {
            tipo: 'restauracion_modo',
            modoRestaurado: modoAnterior,
            modoFallido,
            motivo,
            timestamp: Date.now()
        }
    });
    
    // Actualizar la interfaz
    await actualizarInterfazModo(estado, modoAnterior);
    
    logger.warn(`Modo restaurado a '${modoAnterior}' después de fallo al cambiar a '${modoFallido}'`, {
        motivo
    });
}

/**
 * Función para registrar un evento personalizado en el sistema de monitoreo
 * @param {string} tipo - Tipo de evento
 * @param {Object} datos - Datos del evento
 * @param {string} [nivel='info'] - Nivel de severidad ('debug', 'info', 'warn', 'error')
 * @returns {string} ID del evento registrado
 */
export function registrarEvento(tipo, datos = {}, nivel = 'info') {
    const mensaje = `Evento: ${tipo}, Nivel: ${nivel}, Datos: ${JSON.stringify(datos)}`;
    switch (nivel) {
        case 'debug':
            logger.debug(mensaje);
            break;
        case 'info':
            logger.info(mensaje);
            break;
        case 'warn':
            logger.warn(mensaje);
            break;
        case 'error':
            logger.error(mensaje);
            break;
    }
}

/**
 * Registra una métrica de rendimiento
 * @param {Object} estado - Estado global de la aplicación
 * @param {string} nombre - Nombre de la métrica
 * @param {number} valor - Valor de la métrica
 * @param {string} [unidad='ms'] - Unidad de medida
 */
/**
 * Registra una métrica utilizando una firma simple y consistente.
 * Nueva firma pública: `registrarMetrica(nombre, valor, metadatos = {})`
 * - `metadatos.unidad` : unidad legible (opcional)
 * - `metadatos.estado` : permitir pasar un `estado` explícito (útil en tests)
 * Compatibilidad: si se llama con la firma antigua (estado, nombre, valor, unidad)
 * se detecta y se comporta como antes.
 */
// Reexportar registrarMetrica desde el módulo central `monitoreo` para una implementación canónica única
export const registrarMetrica = registrarMetricaMonitoreo;

/**
 * Obtiene el estado actual del sistema de monitoreo
 * @param {Object} estado - Estado global de la aplicación
 * @returns {Object} Estado actual del monitoreo
 */
export function obtenerEstadoMonitoreo(estado) {
    return {
        metricas: estado?.monitoreo?.metricas || {},
        config: { ...(estado?.monitoreo?.config) },
        totalEventos: estado?.monitoreo?.historial?.eventos?.length || 0,
        totalErrores: estado?.monitoreo?.historial?.errores?.length || 0,
    };
}

// Inicializar monitoreo de memoria si está disponible (optimized for mobile)
if (globalThis.performance?.memory && !globalThis.__vv_intervaloMemoria) {
    const intervaloMemoria = esMovil() ? 300000 : 60000; // 5 min móvil, 1 min desktop
    globalThis.__vv_intervaloMemoria = setInterval(() => {
        const { memory } = globalThis.performance;
        const usoMemoria = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
        // Preferir `globalThis.registrarMetrica` cuando esté disponible (scripts globales)
        (globalThis.registrarMetrica ?? registrarMetrica)(
            'uso_memoria', usoMemoria, { unidad: '%' }
        );
    }, intervaloMemoria);
}

// Exponer funciones de monitoreo globalmente
if (globalThis.window !== undefined) {
    globalThis.registrarEvento = registrarEvento;
    globalThis.registrarMetrica = registrarMetrica;
    globalThis.notificarError = notificarError;
    globalThis.obtenerEstadoMonitoreo = obtenerEstadoMonitoreo;
    
    // Evento de inicialización app se registra en el DOMContentLoaded unificado del padre
    // (eliminado listener duplicado - ver codigo-padre.html línea ~1185)
}

// Inicializar monitoreo de eventos de navegación usando solo la API moderna
function obtenerTiempoCargaPagina() {
    if (performance.getEntriesByType) {
        const [nav] = performance.getEntriesByType('navigation');
        if (nav && typeof nav.loadEventEnd === 'number') {
            return nav.loadEventEnd - nav.startTime;
        }
    }
    return null;
}

globalThis.addEventListener('load', () => {
    if (globalThis.performance?.memory) {
        const { memory } = globalThis.performance;
        const usoMemoria = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
        (globalThis.registrarMetrica ?? registrarMetrica)('uso_memoria', usoMemoria, { unidad: '%' });
    }
    const tiempoCarga = obtenerTiempoCargaPagina();
    if (typeof tiempoCarga === 'number' && !Number.isNaN(tiempoCarga)) {
        (globalThis.registrarMetrica ?? registrarMetrica)('tiempo_carga_pagina', tiempoCarga);
    }
    registrarEvento('pagina_cargada', {
        tiempoCarga,
        url: globalThis.location.href,
        userAgent: navigator.userAgent
    });
});

/**
 * Envía una confirmación a un hijo específico.
 * @param {string} hijoId - ID del hijo al que se enviará la confirmación.
 * @returns {Promise<void>}
 */
export async function enviarConfirmacionAHijo(hijoId, mensajeId) {
    try {
        await enviarMensaje({
            destino: hijoId,
            tipo: TIPOS_MENSAJE.SISTEMA.CONFIRMACION,
            origen: resolverIdPadre(),
            datos: {
                mensajeId,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error('Error enviando confirmación', error);
    }
}

// Controladores AUDIO implementados en audio-hijo3.html (hijo3)
// Controladores NAVEGACIóN en funciones-mapa.js

/**
 * Maneja la confirmación de inicialización de componentes.
 * Este controlador procesa las notificaciones de finalización de inicialización
 * de componentes, actualizando su estado y coordinando las acciones posteriores.
 * 
 * @param {Object} mensaje - Mensaje de confirmación
 * @param {string} mensaje.origen - ID del componente que envía la confirmación
 * @param {Object} mensaje.datos - Datos de confirmación
 * @param {string} mensaje.datos.componenteId - ID del componente inicializado
 * @param {string} mensaje.datos.estado - Estado de la inicialización ('inicializado', 'error', etc.)
 * @param {number} [mensaje.datos.timestamp] - Marca de tiempo de la inicialización
 * @param {string} [mensaje.datos.mensajeId] - ID del mensaje original (opcional)
 * @param {Object} [mensaje.datos.metricas] - Métricas de rendimiento de la inicialización
 * @param {Object} [mensaje.datos.detalles] - Detalles adicionales de la inicialización
 */
// Los tipos SISTEMA.INICIALIZACION_COMPLETADA, SISTEMA.COMPONENTE_INICIALIZADO y
// SISTEMA.INICIALIZACION_FINALIZADA no tienen handler activo en ningún archivo.
// Son tipos definidos en constants.js pero no se usan en la codebase actual.

// ❌ CONTROLADOR RESPUESTA_PARADA (singular) ELIMINADO - OBSOLETO
// El sistema actual usa RESPUESTA_PARADAS (plural) para recibir arrays completos
// y COORDENADAS_PARADAS_REQUEST/RESPONSE para solicitudes específicas

// Confirmado: No hay dependencias de generarHashContenido, configurarUtils, registrarListener, removerListener o removerTodosLosListeners.

// ============================================================
// NOTA: La inicialización de la aplicación se realiza en codigo-padre.html
// La función inicializar() fue eliminada - la inicialización ahora es inline en Script 1
// ============================================================

// Add: Logic to handle connection loss
/**
 * Maneja la pérdida de conexión
 * @param {Object} estado - Estado global de la aplicación
 */
function manejarPerdidaConexion(estado) {
    estado.conectado = false;
    logger.warn('Conexión perdida, pausando operaciones');
    // Pause operations, e.g., stop sending messages
}

/**
 * Maneja la reconexión
 * @param {Object} estado - Estado global de la aplicación
 */
function manejarReconexion(estado) {
    estado.conectado = true;
    logger.info('Conexión restablecida, reanudando operaciones');
    // Resume operations
}

// Detectar pérdida de conexión (ejemplo simplificado)
globalThis.addEventListener('offline', () => manejarPerdidaConexion(globalThis.estadoPadre));
globalThis.addEventListener('online', () => manejarReconexion(globalThis.estadoPadre));

// ADVERTENCIA IMPORTANTE:
// No usar globalThis.addEventListener('unload', ...) ni globalThis.addEventListener('beforeunload', ...)
// en ningún archivo propio ni de terceros. Estos eventos están obsoletos y bloqueados por políticas modernas de navegador.
// Usar siempre 'pagehide' para limpieza de recursos y memoria.
// Revisar cualquier librería externa antes de integrarla para evitar estos listeners.

// Limpieza agresiva de globales al descargar la página
if (globalThis.window !== undefined) {
    globalThis.addEventListener('pagehide', () => {
        // En pagehide, evitar limpiar durante init
        if (globalThis.estado?.sistema?.cambiandoModo) {
            logger.info('Init en curso, omitiendo limpieza agresiva');
            return;
        }
        try {
            // Verificar promesas pendientes antes de limpiar
            if (promesasPendientes.size > 0) {
                logger.warn(`Hay ${promesasPendientes.size} promesas pendientes al descargar la página`);
                // Limpiar promesas pendientes
                promesasPendientes.clear();
            }
            // Limpiar globales de la aplicación agresivamente
            if (globalThis.registrarEvento) delete globalThis.registrarEvento;
            if (globalThis.registrarMetrica) delete globalThis.registrarMetrica;
            if (globalThis.notificarError) delete globalThis.notificarError;
            if (globalThis.obtenerEstadoMonitoreo) delete globalThis.obtenerEstadoMonitoreo;
            
            // Limpiar estado global de la aplicación
            if (globalThis.estado) delete globalThis.estado;
            
            // Limpiar promesas pendientes
            promesasPendientes.clear();
            
            // Limpiar estado de coordinación
            estadoCoordinacion.coordinacionesActivas.clear();
            
            // Limpiar arrays globales
            if (globalThis.puntosRuta) delete globalThis.puntosRuta;
            if (globalThis.CoordenadasParadas) delete globalThis.CoordenadasParadas;
            
            // Limpiar estado de hijos
            if (globalThis.estadoHijos) delete globalThis.estadoHijos;
            
            // Limpiar intervalos
            if (globalThis.intervaloReconciliacion) {
                clearInterval(globalThis.intervaloReconciliacion);
                delete globalThis.intervaloReconciliacion;
            }
            clearInterval(intervaloLimpiezaPromesas);
            clearInterval(intervaloReintentoModo);
            
            logger.info('Limpieza agresiva de globales de la aplicación completada');
        } catch (error) {
            // Logging mínimo durante pagehide para evitar errores
            logger.warn('Error en limpieza agresiva de la aplicación:', error.message);
        }
    });
}

/**
 * SISTEMA DE COORDINACIÓN CENTRALIZADA
 * Funciones para orquestar la comunicación entre componentes hijos
 */

/**
 * Estado de coordinación entre componentes
 */
const estadoCoordinacion = {
    coordinacionesActivas: new Set() // ids de coordinaciones en progreso
};

/**
 * Coordina una acción entre múltiples componentes
 * @param {string} idCoordinacion - ID único de la coordinación
 * @param {Array<Object>} acciones - Array de acciones a coordinar
 * @param {Object} opciones - Opciones de coordinación
 * @returns {Promise<Object>} Resultado de la coordinación
 */
export async function coordinarAccion(idCoordinacion, acciones, opciones = {}) {
    if (estadoCoordinacion.coordinacionesActivas.has(idCoordinacion)) {
        throw new Error(`Coordinación ${idCoordinacion} ya está activa`);
    }

    estadoCoordinacion.coordinacionesActivas.add(idCoordinacion);

    try {
        logger.info(`Iniciando coordinación ${idCoordinacion} con ${acciones.length} acciones`);

        const resultados = [];
        const errores = [];

        // Ejecutar acciones en secuencia o paralelo según opciones
        const modoEjecucion = opciones.modo || 'paralelo';

        if (modoEjecucion === 'secuencial') {
            for (const accion of acciones) {
                try {
                    const resultado = await ejecutarAccionCoordinada(accion);
                    resultados.push(resultado);
                } catch (error) {
                    errores.push({ accion, error: error.message });
                    if (opciones.detenerEnError !== false) break;
                }
            }
        } else {
            // Paralelo por defecto
            const promesas = acciones.map(accion => ejecutarAccionCoordinada(accion));
            const resultadosParalelos = await Promise.allSettled(promesas);

            resultadosParalelos.forEach((resultado, index) => {
                if (resultado.status === 'fulfilled') {
                    resultados.push(resultado.value);
                } else {
                    errores.push({
                        accion: acciones[index],
                        error: resultado.reason.message
                    });
                }
            });
        }

        const resultadoFinal = {
            idCoordinacion,
            exito: errores.length === 0,
            resultados,
            errores,
            timestamp: new Date().toISOString()
        };

        logger.info(`Coordinación ${idCoordinacion} completada: ${resultados.length} exitosos, ${errores.length} errores`);
        return resultadoFinal;

    } finally {
        estadoCoordinacion.coordinacionesActivas.delete(idCoordinacion);
    }
}

/**
 * Ejecuta una acción coordinada individual
 * @param {Object} accion - Acción a ejecutar
 * @returns {Promise<Object>} Resultado de la ejecución
 */
async function ejecutarAccionCoordinada(accion) {
    const { componente, tipo, datos } = accion;

    try {
        logger.debug(`Ejecutando acción coordinada para ${componente}: ${tipo}`);

        // Enviar mensaje al componente especificado
        const resultado = await enviarMensaje({
            tipo: tipo,
            destino: componente,
            origen: resolverIdPadre(),
            datos: datos
        });

        logger.debug(`Acción coordinada completada para ${componente}`);
        return {
            componente,
            tipo,
            exito: true,
            resultado,
            timestamp: Date.now()
        };

    } catch (error) {
        logger.error(`Error ejecutando acción coordinada para ${componente}:`, error);
        throw Object.assign(new Error(error.message), { componente, tipo, exito: false, timestamp: Date.now() });
    }
}

// La lógica de coordinación entre hijos está implementada en la función
// exportada coordinarAccion() y en los handlers registrados en el script
// inline de codigo-padre.html (~línea 2087).

/**
 * Maneja las respuestas de datos de múltiples paradas (PUSH NOTIFICATION).
 * Este controlador procesa la información de varias paradas recibidas
 * de un componente del sistema, como el módulo de datos o un servicio externo.
 * 
 * ?? IMPORTANTE: Este es un controlador de PUSH (no request/response).
 * Se usa cuando el padre o un servicio ENVÍA actualizaciones de paradas de forma
 * asíncrona (no solicitadas), como notificaciones de cambios.
 * 
 * ?? DIFERENCIA con SOLICITAR_PARADAS:
 * - SOLICITAR_PARADAS: Request/Response síncrono (hijo pide ? padre responde con return)
 * - RESPUESTA_PARADAS: Push notification (padre envía update ? hijos reciben y procesan)
 * 
 * @param {Object} mensaje - Mensaje con los datos de las paradas
 * @param {string} mensaje.origen - ID del componente que envía la respuesta
 * @param {Object} mensaje.datos - Datos de las paradas
 * @param {Array<Object>} mensaje.datos.paradas - Lista de objetos de paradas
 * @param {string} mensaje.datos.paradas[].paradaId - Identificador único de la parada
 * @param {string} [mensaje.datos.paradas[].nombre] - Nombre de la parada
 * @param {Object} mensaje.datos.paradas[].ubicacion - Coordenadas de ubicación {lat: number, lng: number}
 * @param {Array<Object>} [mensaje.datos.paradas[].rutas] - Rutas que pasan por esta parada
 * @param {Object} [mensaje.datos.paradas[].metadatos] - Metadatos adicionales de la parada
 * @param {string} [mensaje.datos.paradas[].estado] - Estado de la parada
 * @param {Object} [mensaje.datos.metadatos] - Metadatos adicionales del conjunto de paradas
 * @param {string} [mensaje.datos.estado] - Estado general del conjunto de paradas
 * @param {string} [mensaje.datos.mensajeId] - ID del mensaje original que solicitó los datos
 * @param {boolean} [mensaje.datos.actualizacionParcial=false] - Indica si es una actualización parcial
 * @param {boolean} [mensaje.datos.notificarSistema=true] - Si se debe notificar a otros componentes
 * @param {boolean} [mensaje.datos.requiereConfirmacion=true] - Si se requiere confirmación de recepción
 * 
 * @example
 * // USO: Enviar actualización desde el padre
 * enviarMensaje({
 *     tipo: TIPOS_MENSAJE.DATOS.RESPUESTA_PARADAS,
 *     destino: 'broadcast', // O un hijo específico
 *     datos: {
 *         paradas: [...],
 *         actualizacionParcial: false,
 *         notificarSistema: true
 *     }
 * });
 */
// El handler de DATOS.RESPUESTA_PARADAS está registrado en codigo-padre.html (~línea 8019).

/**
 * Maneja las solicitudes de datos de paradas.
 * Este controlador procesa las solicitudes de datos de paradas y devuelve la información solicitada
 * según los criterios de filtrado proporcionados.
 * 
 * ?? IMPORTANTE: Este controlador usa patrón Request/Response DIRECTO (return).
 * La respuesta NO viene en .datos, viene directamente en el objeto de respuesta.
 * 
 * @param {Object} mensaje - Mensaje de solicitud de paradas
 * @param {string} mensaje.origen - ID del componente que realiza la solicitud
 * @param {Object} mensaje.datos - Parámetros de la solicitud
 * @param {string} [mensaje.datos.filtro] - Filtro opcional para buscar paradas por nombre o ID
 * @param {Object} [mensaje.datos.rango] - Rango geográfico opcional para filtrar paradas
 * @param {number} mensaje.datos.rango.lat - Latitud central
 * @param {number} mensaje.datos.rango.lng - Longitud central
 * @param {number} [mensaje.datos.rango.radio=1000] - Radio en metros (por defecto 1km)
 * @param {Array<string>} [mensaje.datos.campos] - Campos específicos a devolver (por defecto todos)
 * @param {number} [mensaje.datos.limite=100] - Número máximo de resultados a devolver
 * @param {boolean} [mensaje.datos.soloActivas=true] - Si es true, solo devuelve paradas activas
 * @param {string} [mensaje.datos.ordenPor='nombre'] - Campo por el que ordenar los resultados
 * @param {string} [mensaje.datos.orden='asc'] - Orden de clasificación ('asc' o 'desc')
 * @param {boolean} [mensaje.datos.incluirEstadisticas=false] - Si incluir estadísticas de los resultados
 * 
 * @returns {Promise<Object>} Objeto con los resultados (DIRECTO, sin .datos)
 * @returns {number} return.total - Total de paradas encontradas
 * @returns {Array<Object>} return.paradas - Array de objetos de paradas
 * @returns {Object} [return.estadisticas] - Estadísticas si se solicitaron
 * @returns {Object} return.metadatos - Metadatos de la respuesta
 * 
 * @example
 * // USO CORRECTO:
 * const respuesta = await enviarMensaje({
 *     tipo: TIPOS_MENSAJE.DATOS.SOLICITAR_PARADAS,
 *     datos: {}
 * });
 * // CORRECTO: respuesta.paradas
 * if (respuesta && respuesta.paradas) {
 *     logger.debug(respuesta.paradas);
 * }
 * // INCORRECTO: respuesta.datos.paradas (NO existe)
 */
// El handler de DATOS.SOLICITAR_PARADAS está registrado en codigo-padre.html (~línea 7873).

// --- Automatic resend logic for CAMBIO_MODO on NACK with esperarPermiso ---
// pendingModeChanges: hijoId -> { modo, datos, intentos, nextAttemptAt }
const pendingModeChanges = new Map();

// Backoff configuration
const MODE_RETRY_BASE_MS = 2000; // base backoff (2s)
const MODE_RETRY_MAX_MS = 60 * 1000; // max backoff (60s)
const MODE_RETRY_MAX_INTENTOS = 6; // max attempts before giving up

// Exponer variables globalmente para acceso desde codigo-padre.html
globalThis.pendingModeChanges = pendingModeChanges;
globalThis.MODE_RETRY_MAX_INTENTOS = MODE_RETRY_MAX_INTENTOS;
globalThis._computeBackoff = _computeBackoff;

function _computeBackoff(attempt) {
    // exponential backoff with jitter
    const exp = Math.pow(2, Math.max(0, attempt - 1));
    const base = Math.min(MODE_RETRY_BASE_MS * exp, MODE_RETRY_MAX_MS);
    // Add small jitter +/-20%
    const jitter = base * (0.2 * (Math.random() - 0.5));
    return Math.round(base + jitter);
}

mensajeriaReadyPromise.then(() => {
    registrarControlador(TIPOS_MENSAJE.SISTEMA.NACK, async (mensaje) => {
        if (mensaje?.tipo !== TIPOS_MENSAJE.SISTEMA.NACK) return;
        if (!mensaje?.datos?.esperarPermiso) return;
        if (!mensaje?.origen) return;

        try {
            const hijoId = mensaje.origen;
            const modoRaw = mensaje.datos?.modoSolicitado || (mensaje.datos?.modo || null);
            const modo = canonicalizarModo(modoRaw);

            const existing = pendingModeChanges.get(hijoId) || { intentos: 0 };
            const intentos = Math.min((existing.intentos || 0) + 1, MODE_RETRY_MAX_INTENTOS);
            const nextAttemptAt = Date.now() + _computeBackoff(intentos);

            pendingModeChanges.set(hijoId, {
                modo,
                datos: mensaje.datos,
                intentos,
                nextAttemptAt
            });

            logger.info(`[APP][CAMBIO_MODO][RESEND] NACK con esperarPermiso de ${hijoId}, guardado intento=${intentos} nextAt=${new Date(nextAttemptAt).toISOString()}`);
        } catch (e) {
            logger.warn('[APP][CAMBIO_MODO][RESEND] Error procesando NACK esperarPermiso:', e);
        }
    }).catch(e => logger.warn('[APP][NACK] Error registrando handler NACK:', e?.message));
});

// Background retry loop: periodically attempt to resend pending CAMBIO_MODO
const intervaloReintentoModo = setInterval(async () => {
    try {
        if (pendingModeChanges.size === 0) return;
        const now = Date.now();
        for (const [hijoId, pending] of Array.from(pendingModeChanges.entries())) {
            if (!pending || typeof pending.nextAttemptAt !== 'number') continue;
            if (now < pending.nextAttemptAt) continue; // not yet

            if ((pending.intentos || 0) >= MODE_RETRY_MAX_INTENTOS) continue;

            logger.info(`[APP][CAMBIO_MODO][RESEND] Intentando reenvío programado a ${hijoId} (intento ${pending.intentos + 1})`);
            try {
                await enviarMensaje({
                    destino: hijoId,
                    tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
                    origen: resolverIdPadre(),
                    datos: {
                        modo: pending.modo,
                        ...pending.datos,
                        secuenciaCompleta: true
                    }
                });
                pendingModeChanges.delete(hijoId);
                registrarEvento && typeof registrarEvento === 'function' && registrarEvento('CAMBIO_MODO_REENVIADO', { hijoId, timestamp: Date.now() });
                logger.info(`[APP][CAMBIO_MODO][RESEND] Reenvío exitoso a ${hijoId}`);
            } catch (sendErr) {
                // increment attempts and schedule next
                const intentos = Math.min((pending.intentos || 0) + 1, MODE_RETRY_MAX_INTENTOS);
                const nextAttemptAt = Date.now() + _computeBackoff(intentos);
                pendingModeChanges.set(hijoId, {
                    ...pending,
                    intentos,
                    nextAttemptAt
                });
                logger.warn(`[APP][CAMBIO_MODO][RESEND] Reintento fallido para ${hijoId}, programado nextAt=${new Date(nextAttemptAt).toISOString()}`, sendErr);
            }
        }
    } catch (err) {
        logger.warn('[APP][CAMBIO_MODO][RESEND] Error en loop de reintentos:', err);
    }
}, 5000);

// Hacer funciones disponibles globalmente para compatibilidad con carga como script
// Note: These are assignments to window properties, not parameter reassignments
globalThis.manejarCambioModo = globalThis.manejarCambioModo || manejarCambioModo;
globalThis.actualizarInterfazModo = globalThis.actualizarInterfazModo || actualizarInterfazModo;
globalThis.notificarCambioModoInminente = globalThis.notificarCambioModoInminente || notificarCambioModoInminente;
globalThis.notificarCambioModoCompletado = globalThis.notificarCambioModoCompletado || notificarCambioModoCompletado;

// Exportar variables para acceso desde otros módulos
export { pendingModeChanges, MODE_RETRY_MAX_INTENTOS, _computeBackoff };
