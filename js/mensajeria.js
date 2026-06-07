/**
 * @fileoverview Sistema de mensajería para ValenciaVGuides
 * @version 2.0.0
 * 
 * Sistema centralizado de comunicación entre padre e hijos (iframes).
 * Todas las operaciones de registro y envío delegan al state-manager centralizado.
 */

import { TIPOS_MENSAJE, TTL_LIMPIEZA } from './constants.js';
import logger from './logger.js';
import { generarIdUnico } from './utils.js';
import { esMovil } from './device-detection.js';

// Importar configuración
let CONFIG = {};
try {
  if (globalThis.Config) {
    CONFIG = globalThis.Config;
  }
} catch (e) {
  // Config no disponible aún
}

// =====================================================
// ESTADO LOCAL (mínimo, delegamos al state-manager)
// =====================================================

/**
 * Referencia al state-manager centralizado
 * @type {Object|null}
 */
let stateManager = null;

/**
 * Indica si la mensajería está inicializada
 * @type {boolean}
 */
let inicializado = false;

/**
 * ID del componente actual (padre o hijo)
 * @type {string}
 */
let componenteId = '';

/**
 * Tipo de componente ('padre' o 'hijo')
 * @type {string}
 */
let tipoComponente = 'desconocido';

/**
 * Referencia al iframe window para hijos
 * @type {Window|null}
 */
let ventanaPadre = null;

/**
 * Mapa local de iframes registrados (solo en padre)
 * @type {Map<string, Object>}
 */
const iframesRegistrados = new Map();

/**
 * Callbacks pendientes de confirmación
 * @type {Map<string, Object>}
 */
const confirmacionesPendientes = new Map();

/**
 * Flag para marcar script2 como listo
 * @type {boolean}
 */
let script2Listo = false;

/** Guard síncrono para evitar doble inicio de heartbeat */
let _heartbeatIniciando = false;

/**
 * Cola de mensajes pendientes mientras no hay conexión
 * @type {Array}
 */
const colaMensajes = [];

/**
 * Capacidades registradas de los hijos
 * @type {Map<string, Set<string>>}
 */
const capacidadesHijos = new Map();

/**
 * Control de throttling para logs de heartbeat
 * @type {Map<string, number>}
 */
const heartbeatLogControl = new Map();
const HEARTBEAT_LOG_INTERVAL_MS = 300000;

// =====================================================
// INICIALIZACIÓN
// =====================================================

/**
 * Inicializa el sistema de mensajería
 * @param {Object} opciones - Opciones de configuración
 * @param {string} opciones.tipo - 'padre' o 'hijo'
 * @param {string} [opciones.id] - ID del componente
 * @param {Object} [opciones.stateManager] - Referencia al state-manager
 * @returns {Promise<boolean>} True si se inicializó correctamente
 */
export async function inicializarMensajeria(opciones = {}) {
    if (inicializado) {
        logger.warn('[mensajeria] Ya inicializado, ignorando llamada duplicada');
        return true;
    }
    
    const { tipo = 'padre', id = generarIdUnico('comp'), stateManager: sm } = opciones;
    
    tipoComponente = tipo;
    componenteId = id;
    stateManager = sm || (globalThis.window === undefined ? null : globalThis.__vv_stateManager);
    
    // VALIDACIÓN CRÍTICA: Verificar que state-manager esté disponible
    // Si no está disponible, esperamos brevemente o advertimos
    if (!stateManager && globalThis.window !== undefined) {
        // Intentar obtenerlo una vez más después de un pequeño delay
        await new Promise(resolve => setTimeout(resolve, 10));
        stateManager = globalThis.__vv_stateManager || globalThis.__stateManager;
        
        if (!stateManager) {
            logger.warn('[mensajeria] ⚠️ state-manager no disponible - algunas funciones centralizadas no funcionarán');
            logger.warn('[mensajeria] Asegúrate de que state-manager.js se cargue ANTES que mensajeria.js');
        }
    }
    
    logger.info(`[mensajeria] Inicializando como ${tipo} con ID: ${id}`);
    
    // Configurar listener de mensajes
    if (globalThis.window !== undefined) {
        globalThis.addEventListener('message', manejarMensajeEntrante); // NOSONAR

        // Si es hijo, guardar referencia al padre
        if (tipo === 'hijo' && globalThis.parent && globalThis.parent !== globalThis.window) {
            ventanaPadre = globalThis.parent;
        }
    }
    
    inicializado = true;
    
    // Exponer API global
    exponerAPIGlobal();
    
    logger.info(`[mensajeria] Inicialización completada`);
    return true;
}

/**
 * Expone la API de mensajería en globalThis.mensajeria
 */
function exponerAPIGlobal() {
    if (globalThis.window === undefined) return;
    
    globalThis.mensajeria = {
        // Funciones principales
        inicializarMensajeria,
        registrarControlador,
        enviarMensaje,
        enviarMensajeConConfirmacion,
        broadcastToCapability,
        hijosConCapability,
        marcarScript2Listo,
        migrarManejadoresTempranos,

        // Funciones de heartbeat
        iniciarHeartbeat,
        pausarHeartbeat,
        procesarHeartbeatResponse,

        // Funciones de consulta
        getControladoresRegistrados,
        getControladoresPorTipo,
        estaInicializado: () => inicializado,
        getComponenteId: () => componenteId,
        getTipoComponente: () => tipoComponente,

        // Funciones de iframe (solo padre)
        registrarIframe,
        obtenerIframe,
        getIframesRegistrados: () => new Map(iframesRegistrados),

        // Funciones centralizadas (delegan a state-manager)
        registrarControladorCentral,
        enviarMensajeCentral,

        // Utilidades
        generarIdMensaje: () => generarIdUnico('msg'),

        // Diagnóstico
        getDiagnostico
    };
    
    // Alias para compatibilidad
    globalThis.__vv_mensajeria = globalThis.mensajeria;
}

// =====================================================
// REGISTRO DE CONTROLADORES
// =====================================================

/**
 * Obtiene la referencia al state-manager (dinámicamente)
 * @returns {Object|null} State manager o null
 */
function obtenerStateManager() {
    // Prioridad: variable local -> window global
    if (stateManager) return stateManager;
    if (globalThis.window !== undefined && globalThis.__vv_stateManager) {
        return globalThis.__vv_stateManager;
    }
    return null;
}

/**
 * Registra un controlador para un tipo de mensaje
 * Delega al state-manager si está disponible
 * 
 * @param {string} tipo - Tipo de mensaje a manejar
 * @param {Function} handler - Función manejadora
 * @param {Object} [opciones] - Opciones adicionales
 * @returns {Promise<boolean>} True si se registró correctamente
 */
export async function registrarControlador(tipo, handler, opciones = {}) {
    if (!tipo || typeof handler !== 'function') {
        logger.error('[mensajeria] registrarControlador: tipo y handler son requeridos');
        return false;
    }
    
    logger.debug(`[mensajeria] Registrando controlador para: ${tipo}`);
    
    // Intentar usar state-manager centralizado (buscar dinámicamente)
    const sm = obtenerStateManager();
    if (sm && typeof sm.registrarManejador === 'function') {
        try {
            // CRÍTICO: Pasar tipoMensaje en opciones para que state-manager pueda 
            // indexar el handler correctamente y getMapaControladoresSync() lo encuentre
            const opcionesCompletas = {
                ...opciones,
                tipoMensaje: tipo
            };
            const resultado = await sm.registrarManejador(tipo, handler, opcionesCompletas);
            logger.debug(`[mensajeria] Controlador delegado a state-manager: ${tipo} (con tipoMensaje en opciones)`);
            return resultado;
        } catch (error) {
            logger.error(`[mensajeria] Error delegando a state-manager: ${error.message}`);
        }
    }
    
    // Fallback: usar registro local mediante __vv_getManejadores
    const manejadores = obtenerMapaManejadores();
    manejadores.set(tipo, handler);
    logger.debug(`[mensajeria] Controlador registrado localmente: ${tipo}`);
    
    return true;
}

/**
 * Registra un controlador de forma centralizada (alias)
 * @param {string} tipo - Tipo de mensaje
 * @param {Function} handler - Manejador
 * @returns {Promise<boolean>}
 */
export async function registrarControladorCentral(tipo, handler) {
    return registrarControlador(tipo, handler, { centralizado: true });
}

/**
 * Obtiene el mapa de manejadores (local o del state-manager)
 * @returns {Map} Mapa de manejadores
 */
function obtenerMapaManejadores() {
    // Intentar obtener del state-manager (buscar dinámicamente)
    const sm = obtenerStateManager();
    if (sm && typeof sm.getManejadores === 'function') {
        return sm.getManejadores();
    }
    
    // Usar __vv_getManejadores si está definido
    if (globalThis.window !== undefined && typeof globalThis.__vv_getManejadores === 'function') {
        return globalThis.__vv_getManejadores();
    }
    
    // Crear mapa local como último recurso
    if (globalThis.window !== undefined) {
        if (!globalThis.__vv_manejadoresLocales) {
            globalThis.__vv_manejadoresLocales = new Map();
        }
        return globalThis.__vv_manejadoresLocales;
    }
    
    return new Map();
}

/**
 * Obtiene todos los controladores registrados
 * @returns {Map} Mapa de controladores
 */
export function getControladoresRegistrados() {
    return obtenerMapaManejadores();
}

/**
 * Obtiene controladores por tipo
 * @param {string} tipo - Tipo a buscar
 * @returns {Function|null} Handler o null
 */
export function getControladoresPorTipo(tipo) {
    const manejadores = obtenerMapaManejadores();
    return manejadores.get(tipo) || null;
}

// =====================================================
// ENVÍO DE MENSAJES
// =====================================================

/**
 * Envía un mensaje
 * @param {string|Object} tipoOrMensaje - Tipo de mensaje o objeto mensaje completo
 * @param {*} [datos] - Datos del mensaje (si primer param es string)
 * @param {string|Window} [destino] - Destino del mensaje
 * @returns {boolean} True si se envió
 */
export function enviarMensaje(tipoOrMensaje, datos, destino) {
    // Soportar formato objeto: enviarMensaje({ tipo, datos, destino, ... })
    if (tipoOrMensaje && typeof tipoOrMensaje === 'object' && tipoOrMensaje.tipo) {
        const { tipo, datos: objDatos, destino: objDestino, origen, ...resto } = tipoOrMensaje;
        const mensaje = {
            tipo,
            datos: objDatos || resto.datos,
            id: resto.id || generarIdUnico('msg'),
            timestamp: resto.timestamp || Date.now(),
            origen: origen || componenteId,
            tipoOrigen: tipoComponente,
            destino: objDestino
        };
        logger.debug(`[mensajeria] Enviando mensaje: ${tipo}`, { destino: objDestino || 'broadcast' });
        return enviarMensajeInterno(mensaje, objDestino);
    }
    
    // Formato tradicional: enviarMensaje(tipo, datos, destino)
    if (!tipoOrMensaje) {
        logger.error('[mensajeria] enviarMensaje: tipo es requerido');
        return false;
    }
    
    const mensaje = crearMensaje(tipoOrMensaje, datos);
    
    logger.debug(`[mensajeria] Enviando mensaje: ${tipoOrMensaje}`, { destino: destino || 'broadcast' }); // NOSONAR
    
    return enviarMensajeInterno(mensaje, destino);
}

/**
 * Envía un mensaje centralizado (delega a state-manager)
 * @param {string} tipo - Tipo de mensaje
 * @param {*} datos - Datos
 * @param {string} destino - Destino
 * @returns {boolean}
 */
export function enviarMensajeCentral(tipo, datos, destino) {
    const sm = obtenerStateManager();
    if (sm && typeof sm.enviarMensajeCentral === 'function') {
        return sm.enviarMensajeCentral(tipo, datos, destino);
    }
    return enviarMensaje(tipo, datos, destino);
}

/**
 * Envía un mensaje y espera confirmación
 * Soporta DOS formatos de llamada:
 * 1. enviarMensajeConConfirmacion(tipo, datos, opciones)
 * 2. enviarMensajeConConfirmacion({tipo, datos, destino, ...}) - objeto completo
 * 
 * @param {string|Object} tipoOrMensaje - Tipo de mensaje o mensaje completo
 * @param {*} [datos] - Datos del mensaje (ignorado si primer arg es objeto)
 * @param {Object} [opciones] - Opciones
 * @param {number} [opciones.timeout=5000] - Timeout en ms
 * @param {string} [opciones.destino] - Destino específico
 * @returns {Promise<Object>} Respuesta del destinatario
 */
export function enviarMensajeConConfirmacion(tipoOrMensaje, datos, opciones = {}) {
    // Detectar formato de llamada: objeto completo vs argumentos separados
    let tipo, datosReales, destino, timeout;
    
    if (typeof tipoOrMensaje === 'object' && tipoOrMensaje?.tipo) {
        // Formato objeto completo: {tipo, datos, destino, ...}
        tipo = tipoOrMensaje.tipo;
        datosReales = tipoOrMensaje.datos;
        destino = tipoOrMensaje.destino;
        timeout = tipoOrMensaje.timeout || 5000;
    } else {
        // Formato argumentos separados: (tipo, datos, opciones)
        tipo = tipoOrMensaje;
        datosReales = datos;
        timeout = opciones.timeout || 5000;
        destino = opciones.destino;
    }
    
    return new Promise((resolve, reject) => {
        const mensaje = crearMensaje(tipo, datosReales);
        mensaje.requiereConfirmacion = true;
        
        const idConfirmacion = mensaje.id;
        
        // Registrar callback pendiente
        const timeoutId = setTimeout(() => {
            confirmacionesPendientes.delete(idConfirmacion);
            reject(new Error(`Timeout esperando confirmación para: ${tipo}`));
        }, timeout);
        
        confirmacionesPendientes.set(idConfirmacion, {
            resolve,
            reject,
            timeoutId,
            tipo,
            timestamp: Date.now()
        });
        
        // Enviar mensaje
        const enviado = enviarMensajeInterno(mensaje, destino);
        
        if (!enviado) {
            clearTimeout(timeoutId);
            confirmacionesPendientes.delete(idConfirmacion);
            reject(new Error(`No se pudo enviar mensaje: ${tipo}`));
        }
    });
}

/**
 * Crea un objeto mensaje con estructura estándar
 * @param {string} tipo - Tipo de mensaje
 * @param {*} datos - Datos del mensaje
 * @returns {Object} Mensaje formateado
 */
function crearMensaje(tipo, datos) {
    return {
        tipo,
        datos,
        id: generarIdUnico('msg'),
        timestamp: Date.now(),
        origen: componenteId,
        tipoOrigen: tipoComponente
    };
}

/**
 * Envía un mensaje internamente
 * @param {Object} mensaje - Mensaje a enviar
 * @param {string|Window} destino - Destino
 * @returns {boolean} True si se envió
 */
function _enviarDesdePadre(mensaje, destino) {
    // Destino específico (excluir 'broadcast'/'todos' para que caigan al broadcast)
    if (typeof destino === 'string' && destino !== 'broadcast' && destino !== 'todos') {
        const iframeInfo = iframesRegistrados.get(destino);
        const targetWindow = iframeInfo?.elemento?.contentWindow || iframeInfo?.contentWindow;
        if (targetWindow) {
            targetWindow.postMessage(mensaje, globalThis.location.origin);
            return true;
        }
        logger.warn(`[mensajeria] Iframe no encontrado o sin contentWindow: ${destino}`);
        return false;
    }
    // Window específica
    if (destino && typeof destino.postMessage === 'function') {
        destino.postMessage(mensaje, globalThis.location.origin);
        return true;
    }
    // Broadcast a todos los iframes
    let enviados = 0;
    for (const [, iframeInfo] of iframesRegistrados) {
        const targetWindow = iframeInfo?.elemento?.contentWindow || iframeInfo?.contentWindow;
        if (targetWindow) {
            targetWindow.postMessage(mensaje, globalThis.location.origin);
            enviados++;
        }
    }
    return enviados > 0;
}

function enviarMensajeInterno(mensaje, destino) {
    try {
        if (tipoComponente === 'hijo' && ventanaPadre) {
            ventanaPadre.postMessage(mensaje, globalThis.location.origin);
            return true;
        }
        if (tipoComponente === 'padre') {
            return _enviarDesdePadre(mensaje, destino);
        }
        // Fallback: postMessage genérico
        if (globalThis.window !== undefined) {
            globalThis.postMessage(mensaje, globalThis.location.origin);
            return true;
        }
        return false;
    } catch (error) {
        logger.error(`[mensajeria] Error enviando mensaje: ${error.message}`);
        return false;
    }
}

// =====================================================
// MANEJO DE MENSAJES ENTRANTES
// =====================================================

/**
 * Manejador principal de mensajes entrantes
 * @param {MessageEvent} event - Evento de mensaje
 */
function manejarMensajeEntrante(event) {
    // Validar origen: solo aceptar mensajes del mismo origen (mismo dominio/protocolo/puerto)
    // event.origin es "null" (string) para file:// protocol
    const origenPermitido = event.origin === globalThis.location.origin 
        || event.origin === 'null'  // file:// protocol
        || event.source === globalThis.window; // self-messages
    if (!origenPermitido) {
        return;
    }

    const mensaje = event.data;

    // Ignorar mensajes inválidos — schema mínimo: tipo + origen obligatorios
    if (!mensaje || typeof mensaje !== 'object' || !mensaje.tipo) {
        return;
    }
    if (!mensaje.origen) {
        logger.debug(`[mensajeria] Mensaje descartado: falta campo 'origen' (tipo: ${mensaje.tipo})`);
        return;
    }

    // Ignorar mensajes propios
    if (mensaje.origen === componenteId) {
        return;
    }

    // Heartbeats: mantener visibilidad de inicialización/vida sin inundar consola.
    // Se registra como máximo 1 vez por minuto por tipo+origen.
    const _esHeartbeat = mensaje.tipo === TIPOS_MENSAJE.SISTEMA.HEARTBEAT ||
                         mensaje.tipo === TIPOS_MENSAJE.SISTEMA.HEARTBEAT_RESPONSE;
    if (_esHeartbeat) {
        const ahora = Date.now();
        const key = `${mensaje.tipo}:${mensaje.origen}`;
        const ultimo = heartbeatLogControl.get(key) || 0;
        if ((ahora - ultimo) >= HEARTBEAT_LOG_INTERVAL_MS) {
            heartbeatLogControl.set(key, ahora);
            logger.debug(`[mensajeria] Mensaje recibido (heartbeat): ${mensaje.tipo}`, { origen: mensaje.origen });
        }
    } else {
        logger.debug(`[mensajeria] Mensaje recibido: ${mensaje.tipo}`, { origen: mensaje.origen });
    }
    
    // Verificar si es una confirmación
    if (mensaje.tipo === TIPOS_MENSAJE.SISTEMA.CONFIRMACION && mensaje.idOriginal) {
        manejarConfirmacion(mensaje);
        return;
    }
    
    // Buscar handler registrado
    const manejadores = obtenerMapaManejadores();
    const handler = manejadores.get(mensaje.tipo);
    
    // DEBUG: Log disponibles para diagnóstico
    if (!handler) {
        const tiposDisponibles = Array.from(manejadores.keys()).join(', ') || '(ninguno)';
        logger.debug(`[mensajeria] Sin handler para: ${mensaje.tipo} | Disponibles: ${tiposDisponibles}`);
    }
    
    if (handler) {
        // Ejecutar handler de forma async para soportar handlers async/await
        (async () => {
            try {
                // Pass full message as first arg to match state-manager and handler signatures
                // Usar await para soportar handlers async y síncronos
                const resultado = await Promise.resolve(handler(mensaje, event));

                // Enviar confirmación si se requiere
                if (mensaje.requiereConfirmacion) {
                    enviarConfirmacion(mensaje, resultado, event.source);
                }
            } catch (error) {
                logger.error(`[mensajeria] Error en handler para ${mensaje.tipo}: ${error.message}`);

                if (mensaje.requiereConfirmacion) {
                    enviarConfirmacion(mensaje, { error: error.message }, event.source);
                }
            }
        })();
    } else if (mensaje.requiereConfirmacion) {
        // Sin handler pero el emisor espera confirmación de recepción — ACK igualmente
        enviarConfirmacion(mensaje, null, event.source);
    }
    // El log de "Sin handler" ya se hizo arriba con la lista de disponibles
}

/**
 * Maneja una confirmación recibida
 * @param {Object} mensaje - Mensaje de confirmación
 */
function manejarConfirmacion(mensaje) {
    const pendiente = confirmacionesPendientes.get(mensaje.idOriginal);
    
    if (pendiente) {
        clearTimeout(pendiente.timeoutId);
        confirmacionesPendientes.delete(mensaje.idOriginal);
        
        if (mensaje.error) {
            pendiente.reject(new Error(mensaje.error));
        } else {
            pendiente.resolve(mensaje.datos);
        }
    }
}

/**
 * Envía una confirmación de mensaje
 * @param {Object} mensajeOriginal - Mensaje original
 * @param {*} resultado - Resultado del procesamiento
 * @param {Window} destino - Ventana destino
 */
function enviarConfirmacion(mensajeOriginal, resultado, destino) {
    const confirmacion = {
        tipo: TIPOS_MENSAJE.SISTEMA.CONFIRMACION,
        idOriginal: mensajeOriginal.id,
        datos: resultado,
        timestamp: Date.now(),
        origen: componenteId
    };
    
    if (destino && typeof destino.postMessage === 'function') {
        destino.postMessage(confirmacion, globalThis.location.origin);
    }
}

// =====================================================
// GESTIÓN DE IFRAMES (SOLO PADRE)
// =====================================================

/**
 * Registra un iframe
 * @param {string} id - ID del iframe
 * @param {HTMLIFrameElement} iframe - Elemento iframe
 * @param {Object} [opciones] - Opciones adicionales
 * @returns {boolean} True si se registró
 */
export function registrarIframe(id, iframe, opciones = {}) {
    if (!id || !iframe) {
        logger.error('[mensajeria] registrarIframe: id e iframe son requeridos');
        return false;
    }
    
    iframesRegistrados.set(id, {
        elemento: iframe,
        contentWindow: iframe.contentWindow,
        capacidades: new Set(opciones.capacidades || []),
        estado: 'registrado',
        timestamp: Date.now()
    });
    
    logger.info(`[mensajeria] Iframe registrado: ${id}`);
    return true;
}

/**
 * Obtiene un iframe registrado
 * @param {string} id - ID del iframe
 * @returns {Object|null} Información del iframe o null
 */
export function obtenerIframe(id) {
    const iframe = iframesRegistrados.get(id);
    return iframe ? iframe.elemento : null;
}

/**
 * Registra capacidades para un hijo
 * @param {string} hijoId - ID del hijo
 * @param {Array<string>} capacidades - Capacidades
 */
export function registrarCapacidades(hijoId, capacidades) {
    if (!capacidadesHijos.has(hijoId)) {
        capacidadesHijos.set(hijoId, new Set());
    }
    
    const caps = capacidadesHijos.get(hijoId);
    capacidades.forEach(cap => caps.add(cap));
    
    // Actualizar en iframe registrado si existe
    const iframe = iframesRegistrados.get(hijoId);
    if (iframe) {
        capacidades.forEach(cap => iframe.capacidades.add(cap));
    }
}

/**
 * Obtiene los hijos que tienen una capacidad específica
 * @param {string} capacidad - Capacidad a buscar
 * @returns {Array<string>} IDs de hijos con la capacidad
 */
export function hijosConCapability(capacidad) {
    const hijos = [];
    
    for (const [id, caps] of capacidadesHijos) {
        if (caps.has(capacidad)) {
            hijos.push(id);
        }
    }
    
    // También buscar en iframes registrados
    for (const [id, iframe] of iframesRegistrados) {
        if (iframe.capacidades?.has(capacidad) && !hijos.includes(id)) {
            hijos.push(id);
        }
    }
    
    return hijos;
}

/**
 * Envía un mensaje broadcast a todos los hijos con una capacidad
 * @param {string} capacidad - Capacidad requerida
 * @param {string} tipo - Tipo de mensaje
 * @param {*} datos - Datos del mensaje
 * @returns {number} Número de mensajes enviados
 */
export function broadcastToCapability(capacidad, tipo, datos) {
    const hijos = hijosConCapability(capacidad);
    let enviados = 0;
    
    for (const hijoId of hijos) {
        if (enviarMensaje(tipo, datos, hijoId)) {
            enviados++;
        }
    }
    
    logger.debug(`[mensajeria] Broadcast a ${enviados}/${hijos.length} hijos con capacidad: ${capacidad}`);
    return enviados;
}

// =====================================================
// UTILIDADES
// =====================================================

/**
 * Migra manejadores registrados tempranamente al sistema de mensajería.
 * Los módulos que registran handlers antes de que mensajería esté lista
 * los habrán registrado directamente en registrarControlador(), que ya
 * delega al state-manager. Esta función devuelve la lista de tipos
 * actualmente registrados para diagnóstico.
 * @returns {Array<{tipo: string, duplicado: boolean}>}
 */
export function migrarManejadoresTempranos() {
    const sm = obtenerStateManager();
    if (!sm) return [];
    try {
        const mapa = sm.getManejadores ? sm.getManejadores() : null;
        if (!mapa) return [];
        return Array.from(mapa.keys()).map(tipo => ({ tipo, duplicado: false }));
    } catch (e) {
        logger.warn('[mensajeria] Error en migrarManejadoresTempranos:', e?.message); // NOSONAR
        return [];
    }
}

/**
 * Marca script2 como listo y sincroniza con el state-manager centralizado
 */
export function marcarScript2Listo() {
    script2Listo = true;
    logger.info('[mensajeria] Script2 marcado como listo');
    const sm = obtenerStateManager();
    if (sm && typeof sm.setFlag === 'function') {
        sm.setFlag('script2Listo', true).catch(e => logger.debug('[mensajeria] Error sincronizando script2Listo:', e?.message));
    }
}

/**
 * Obtiene información de diagnóstico
 * @returns {Object} Información de diagnóstico
 */
export function getDiagnostico() {
    return {
        inicializado,
        componenteId,
        tipoComponente,
        script2Listo,
        iframesRegistrados: Array.from(iframesRegistrados.keys()),
        controladoresRegistrados: Array.from(obtenerMapaManejadores().keys()),
        confirmacionesPendientes: confirmacionesPendientes.size,
        colaMensajes: colaMensajes.length,
        capacidadesHijos: Object.fromEntries(
            Array.from(capacidadesHijos.entries()).map(([k, v]) => [k, Array.from(v)])
        ),
        stateManagerDisponible: !!stateManager
    };
}

// =====================================================
// HEARTBEAT - DETECCIÓN DE HIJOS CAÍDOS
// =====================================================

/**
 * Inicia el heartbeat para detectar hijos caídos
 * @param {number} intervalo - Intervalo en ms (default: 5000)
 * @returns {Promise<boolean>} True si se inició correctamente
 */
export async function iniciarHeartbeat(intervalo = 5000) {
    if (_heartbeatIniciando) {
        logger.debug('[mensajeria] Heartbeat ya está iniciando');
        return true;
    }
    _heartbeatIniciando = true;

    const sm = obtenerStateManager();
    if (!sm) {
        _heartbeatIniciando = false;
        logger.warn('[mensajeria] State-manager no disponible para iniciar heartbeat');
        return false;
    }

    try {
        const estado = await sm.getHeartbeat();
        if (estado?.activo) {
            logger.debug('[mensajeria] Heartbeat ya está activo');
            return true;
        }

        await sm.updateHeartbeat({ activo: true });

        const intervalId = setInterval(async () => {
            await enviarHeartbeatAHijos();
        }, intervalo);

        await sm.updateHeartbeat({ intervalo: intervalId });
        logger.info('[mensajeria] Heartbeat iniciado');
        return true;
    } catch (error) {
        logger.error('[mensajeria] Error iniciando heartbeat:', error);
        return false;
    } finally {
        _heartbeatIniciando = false;
    }
}

/**
 * Pausa el heartbeat
 * @returns {Promise<boolean>} True si se pausó correctamente
 */
export async function pausarHeartbeat() {
    const sm = obtenerStateManager();
    if (!sm) {
        logger.warn('[mensajeria] State-manager no disponible para pausar heartbeat');
        return false;
    }

    try {
        const estado = await sm.getHeartbeat();
        if (!estado?.activo) {
            logger.debug('[mensajeria] Heartbeat ya está pausado');
            return true;
        }

        // Limpiar intervalo
        if (estado?.intervalo) {
            clearInterval(estado.intervalo);
        }

        // Marcar como inactivo
        await sm.updateHeartbeat({ activo: false, intervalo: null });
        logger.info('[mensajeria] Heartbeat pausado');
        return true;
    } catch (error) {
        logger.error('[mensajeria] Error pausando heartbeat:', error);
        return false;
    }
}

/**
 * Envía heartbeat a los hijos críticos
 */
async function enviarHeartbeatAHijos() {
    const sm = obtenerStateManager();
    if (!sm) return;

    try {
        const estado = await sm.getHeartbeat();
        if (!estado?.activo) return;

        // Obtener configuración
        const maxFallidos = CONFIG?.HEARTBEAT?.MAX_HEARTBEATS_FALLIDOS || 3;
        const autoReconectar = CONFIG?.HEARTBEAT?.AUTO_RECONECTAR !== false;

        // Obtener hijos críticos
        const hijosCriticos = ['hijo2', 'hijo3', 'hijo4', 'hijo5'];

        for (const hijoId of hijosCriticos) {
            try {
                enviarMensaje({
                    tipo: TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
                    destino: hijoId,
                    datos: { timestamp: Date.now() }
                });

                // Incrementar contador de fallidos (se resetea al recibir respuesta)
                const fallidos = estado.heartbeatsFallidos?.get(hijoId) || 0;
                const nuevosFallidos = new Map(estado.heartbeatsFallidos || []);
                nuevosFallidos.set(hijoId, fallidos + 1);
                await sm.updateHeartbeat({ heartbeatsFallidos: nuevosFallidos });

                // Verificar si excede MAX_HEARTBEATS_FALLIDOS
                if (fallidos + 1 >= maxFallidos) {
                    await marcarHijoDesconectado(hijoId, autoReconectar);
                }
            } catch (error) {
                logger.warn(`[mensajeria] Error enviando heartbeat a ${hijoId}:`, error);
            }
        }
    } catch (error) {
        logger.error('[mensajeria] Error en enviarHeartbeatAHijos:', error);
    }
}

/**
 * Marca un hijo como desconectado
 * @param {string} hijoId - ID del hijo
 * @param {boolean} autoReconectar - Si debe intentar reconectar automáticamente
 */
async function marcarHijoDesconectado(hijoId, autoReconectar = true) {
    const sm = obtenerStateManager();
    if (!sm) return;

    try {
        const estado = await sm.getHeartbeat();
        const desconectados = new Set(estado?.hijosDesconectados || []);
        desconectados.add(hijoId);

        await sm.updateHeartbeat({ hijosDesconectados: Array.from(desconectados) });
        logger.warn(`[mensajeria] Hijo ${hijoId} marcado como desconectado`);

        // Intentar reconectar si AUTO_RECONECTAR está activo
        if (autoReconectar) {
            await intentarReconectarHijo(hijoId);
        }
    } catch (error) {
        logger.error('[mensajeria] Error marcando hijo como desconectado:', error);
    }
}

/**
 * Intenta reconectar un hijo recargando su iframe
 * @param {string} hijoId - ID del hijo
 */
async function intentarReconectarHijo(hijoId) {
    try {
        logger.info(`[mensajeria] Intentando reconectar ${hijoId}`);

        const iframe = iframesRegistrados.get(hijoId);
        if (iframe?.elemento) {
            iframe.elemento.src = iframe.elemento.src; // NOSONAR — self-assign fuerza reload del iframe
            logger.info(`[mensajeria] Iframe ${hijoId} recargado`);
        } else {
            logger.warn(`[mensajeria] Iframe ${hijoId} no encontrado para reconectar`);
        }
    } catch (error) {
        logger.error(`[mensajeria] Error reconectando ${hijoId}:`, error);
    }
}

/**
 * Procesa una respuesta de heartbeat de un hijo
 * @param {Object} mensaje - Mensaje HEARTBEAT_RESPONSE
 */
export async function procesarHeartbeatResponse(mensaje) {
    const sm = obtenerStateManager();
    if (!sm) return;

    try {
        const hijoId = mensaje.origen;

        // Resetear contador de fallidos
        const estado = await sm.getHeartbeat();
        const nuevosFallidos = new Map(estado?.heartbeatsFallidos || []);
        nuevosFallidos.set(hijoId, 0);
        await sm.updateHeartbeat({ heartbeatsFallidos: nuevosFallidos });

        // Actualizar último heartbeat
        const nuevosUltimos = new Map(estado?.ultimoHeartbeat || []);
        nuevosUltimos.set(hijoId, Date.now());
        await sm.updateHeartbeat({ ultimoHeartbeat: nuevosUltimos });

        // Si estaba desconectado, marcar como reconectado
        const desconectados = new Set(estado?.hijosDesconectados || []);
        if (desconectados.has(hijoId)) {
            desconectados.delete(hijoId);
            await sm.updateHeartbeat({ hijosDesconectados: Array.from(desconectados) });
            logger.info(`[mensajeria] Hijo ${hijoId} reconectado`);

            // Reenviar mensajes pendientes (si hay cola)
            await reenviarMensajesPendientes(hijoId);

            // Reenviar mensajes GPS pendientes específicamente para hijo2
            if (hijoId === 'hijo2') {
                await reenviarMensajesGPSAPendientes(hijoId);
            }
        }
    } catch (error) {
        logger.error('[mensajeria] Error procesando heartbeat response:', error);
    }
}

/**
 * Reenvía mensajes pendientes a un hijo reconectado
 * @param {string} hijoId - ID del hijo
 */
async function reenviarMensajesPendientes(hijoId) {
    try {
        logger.info(`[mensajeria] Reenviando mensajes pendientes a ${hijoId}`);
        // Implementación futura: reenviar mensajes que fallaron mientras el hijo estaba desconectado
    } catch (error) {
        logger.error(`[mensajeria] Error reenviando mensajes pendientes a ${hijoId}:`, error);
    }
}

/**
 * Reenvía mensajes GPS pendientes a un hijo reconectado
 * @param {string} hijoId - ID del hijo
 */
export async function reenviarMensajesGPSAPendientes(hijoId) {
    const sm = obtenerStateManager();
    if (!sm) return;

    try {
        const pendientes = await sm.getGpsPendientes();
        if (pendientes.length === 0) {
            logger.debug(`[mensajeria] No hay mensajes GPS pendientes para ${hijoId}`);
            return;
        }

        logger.info(`[mensajeria] Reenviando ${pendientes.length} mensajes GPS pendientes a ${hijoId}`);

        let reenviados = 0;
        for (const mensaje of pendientes) {
            try {
                await enviarMensaje({
                    tipo: mensaje.tipo || TIPOS_MENSAJE.NAVEGACION.GPS.UBICACION_ACTUALIZADA,
                    destino: hijoId,
                    datos: mensaje.datos
                });
                reenviados++;
            } catch (error) {
                logger.warn(`[mensajeria] Error reenviando mensaje GPS pendiente a ${hijoId}:`, error);
            }
        }

        // Limpiar cola después de reenviar
        await sm.limpiarGpsPendientes();
        logger.info(`[mensajeria] Reenviados ${reenviados}/${pendientes.length} mensajes GPS pendientes a ${hijoId}`);
    } catch (error) {
        logger.error(`[mensajeria] Error reenviando mensajes GPS pendientes a ${hijoId}:`, error);
    }
}

// =====================================================
// LIMPIEZA
// =====================================================

/**
 * Limpia recursos de la mensajería
 */
export function limpiar() {
    // Limpiar confirmaciones pendientes
    for (const [, pendiente] of confirmacionesPendientes) {
        clearTimeout(pendiente.timeoutId);
        pendiente.reject(new Error('Mensajería limpiada'));
    }
    confirmacionesPendientes.clear();
    
    // Limpiar cola
    colaMensajes.length = 0;
    
    logger.info('[mensajeria] Recursos limpiados');
}

// Configurar limpieza periódica
if (globalThis.window !== undefined) {
    // Determinar TTL según dispositivo
    const ttlMensajeria = esMovil() ? TTL_LIMPIEZA.MENSAJERIA.MOVIL : TTL_LIMPIEZA.MENSAJERIA.DESKTOP;
    
    setInterval(() => {
        const ahora = Date.now();

        // Limpiar confirmaciones expiradas — colectar keys antes de borrar para no mutar durante iteración
        const keysAEliminar = [];
        for (const [key, pendiente] of confirmacionesPendientes) {
            if (ahora - pendiente.timestamp > ttlMensajeria) {
                clearTimeout(pendiente.timeoutId);
                pendiente.reject(new Error('Confirmación expirada'));
                keysAEliminar.push(key);
            }
        }
        for (const key of keysAEliminar) {
            confirmacionesPendientes.delete(key);
        }
    }, ttlMensajeria / 2);
}

export default {
    inicializarMensajeria,
    registrarControlador,
    enviarMensaje,
    enviarMensajeConConfirmacion,
    broadcastToCapability,
    hijosConCapability,
    marcarScript2Listo,
    getControladoresRegistrados,
    getControladoresPorTipo,
    registrarControladorCentral,
    enviarMensajeCentral,
    registrarIframe,
    obtenerIframe,
    registrarCapacidades,
    getDiagnostico,
    limpiar
};

// =====================================================
// EXPOSICIÓN INMEDIATA DE API GLOBAL
// Ejecutar exponerAPIGlobal() inmediatamente al cargar el módulo
// para que globalThis.mensajeria esté disponible antes de inicializar
// =====================================================
exponerAPIGlobal();
console.log('[mensajeria] API expuesta globalmente (pre-inicialización)');

// Dispatch mensajeriaReady event to signal that the API is available
if (globalThis.window !== undefined) {
    globalThis.dispatchEvent(new Event('mensajeriaReady'));
    console.log('[mensajeria] mensajeriaReady event dispatched');
}