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

/** Latidos seguidos sin respuesta antes de dar a un iframe por caído. */
const MAX_LATIDOS_SIN_RESPUESTA = 3;

/**
 * Plazo tras el cual la fila de un tipo avanza aunque su handler siga sin terminar.
 *
 * Muy por encima de cualquier handler legítimo: el propio bus rechaza a los 5 s una petición
 * con acuse sin contestar, así que un handler que espere una respuesta ya está acotado ahí.
 * Si se llega a estos 20 s, no es lentitud: es que algo no va a llegar nunca.
 */
const PLAZO_MAX_HANDLER = 20_000;

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
 * Ventana de arriba, si este frame la tiene.
 *
 * El papel no se declara, se deduce: un frame es hijo si tiene ventana de arriba, y es padre de
 * los iframes que registre. Los dos papeles conviven — hijo4 es hijo del padre y padre del
 * puzzle. Declararlo a mano era una fuente de fallos: un frame declarado 'padre' manda al sitio
 * equivocado y no se entera nadie.
 * @type {Window|null}
 */
let ventanaPadre = null;

/** El aviso de "este frame no tiene padre" se da una vez, no uno por envío. */
let avisoSinPadreDado = false;

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

/** Guard síncrono para evitar doble inicio de heartbeat */
let _heartbeatIniciando = false;

/**
 * Cola de mensajes pendientes mientras no hay conexión
 * @type {Array}
 */
const colaMensajes = [];

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

    const { id = generarIdUnico('comp'), stateManager: sm } = opciones;

    componenteId = id;
    stateManager = sm || (globalThis.window === undefined ? null : globalThis.__vv_stateManager);

    // VALIDACIÓN CRÍTICA: Verificar que state-manager esté disponible.
    // En el padre, state-manager.js se inicializa (await) antes de que se llame aquí,
    // por lo que sm siempre se pasa como parámetro y este bloque no se ejecuta.
    // En hijos, no hay state-manager — se trabaja con __vv_manejadoresLocales (fallback previsto).
    // Si por alguna razón sm es null y globalThis.__vv_stateManager tampoco está disponible,
    // obtenerStateManager() lo encontrará dinámicamente en cada operación posterior.
    if (!stateManager && globalThis.window !== undefined) {
        stateManager = globalThis.__vv_stateManager || globalThis.__stateManager;
        if (!stateManager) {
            logger.warn('[mensajeria] ⚠️ state-manager no disponible en init — se usará fallback local. obtenerStateManager() lo buscará dinámicamente en cada operación.');
        }
    }

    logger.info(`[mensajeria] Inicializando ${id}`);

    // Configurar listener de mensajes
    if (globalThis.window !== undefined) {
        globalThis.addEventListener('message', manejarMensajeEntrante); // NOSONAR

        ventanaPadre = (globalThis.parent && globalThis.parent !== globalThis) ? globalThis.parent : null;
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
/**
 * ¿Hay un handler registrado para ese tipo en ESTE frame?
 *
 * Existe para que nadie tenga que mirar por dentro. Antes, un test que necesitaba saber si un
 * hijo ya estaba escuchando preguntaba por `messagingAdapter._listenerRegistry`, la estructura
 * privada del envoltorio de ese hijo: cuando el envoltorio desaparece, el test se cae sin que
 * nada de la aplicación se haya roto.
 * @param {string} tipo
 * @returns {boolean}
 */
export function tieneControlador(tipo) {
    if (!tipo) return false;
    return obtenerMapaManejadores().has(tipo);
}

/**
 * Los tipos con handler en este frame, para diagnóstico.
 * @returns {string[]}
 */
export function listarControladores() {
    return [...obtenerMapaManejadores().keys()];
}

function exponerAPIGlobal() {
    if (globalThis.window === undefined) return;

    globalThis.mensajeria = {
        // Funciones principales
        inicializarMensajeria,
        registrarControlador,
        tieneControlador,
        listarControladores,
        enviarMensaje,
        enviarMensajeConConfirmacion,
        despacharLocal,
        marcarScript2Listo,
        migrarManejadoresTempranos,

        // Funciones de heartbeat
        iniciarHeartbeat,
        preiniciarHeartbeat,
        reanudarHeartbeat,
        pausarHeartbeat,
        adelantarLatido,
        procesarHeartbeatResponse,
        esperarHijosListos,

        // Funciones de consulta
        estaInicializado: () => inicializado,
        getComponenteId: () => componenteId,

        // Funciones de iframe (solo padre)
        registrarIframe,
        desregistrarIframe,
        getIframesRegistrados: () => new Map(iframesRegistrados),

        // Utilidades
        generarIdMensaje: () => generarIdUnico('msg')
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

    // Dos handlers para el mismo tipo es un fallo, no una opción: uno de los dos no se ejecuta
    // y nadie se entera. Ya pasó — hay comentarios en el padre, app.js y funciones-mapa.js
    // esquivando a mano esa "carrera de inserción". Se queda el primero y se dice en voz alta.
    if (obtenerMapaManejadores().has(tipo)) {
        logger.error(`[mensajeria] ${componenteId} ya tiene un handler para ${tipo}: se queda el primero y este se ignora`);
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

// =====================================================
// ENVÍO DE MENSAJES
// =====================================================

/**
 * Envía un mensaje
 *
 * Solo acepta el formato objeto — el formato posicional histórico
 * (`enviarMensaje(tipo, datos, destino)`) se retiró el 2026-08-06: verificado que
 * ningún caller de todo el proyecto (padre, los 6 hijos, tests) lo usaba, y que no
 * tiene relación con el futuro backend/frontend (mensajeria.js es exclusivamente
 * postMessage entre iframes del mismo documento, ortogonal a de dónde vengan los
 * datos de la aventura). Mantenerlo sin ningún consumidor real violaba la regla del
 * proyecto de no diseñar para casos hipotéticos — ver GUIA-COMPLETA.md §8.1.
 *
 * @param {Object} mensaje - Mensaje a enviar
 * @param {string} mensaje.tipo - Tipo de mensaje (obligatorio)
 * @param {*} [mensaje.datos] - Datos del mensaje
 * @param {string|Window} mensaje.destino - Destino del mensaje (obligatorio: 'padre', el nombre de un iframe registrado, o 'broadcast' para todos). Sin él, no se envía.
 * El `origen` lo pone el bus, siempre el nombre de este frame: si quien llama pasa uno, se ignora.
 * Un frame que todavía no ha llamado a `inicializarMensajeria` no envía: saldría sin nombre y el
 * receptor lo descartaría.
 * @returns {Promise<boolean>} true si se envió correctamente
 */
export function enviarMensaje(mensaje) {
    if (!mensaje || typeof mensaje !== 'object' || !mensaje.tipo) {
        logger.error('[mensajeria] enviarMensaje: tipo es requerido');
        return Promise.resolve(false);
    }
    if (!inicializado) {
        _avisarDescarte(_avisadosSinInicializar, mensaje.tipo,
            `[mensajeria] No se envía ${mensaje.tipo}: el bus de este frame aún no está inicializado (falta inicializarMensajeria)`);
        return Promise.resolve(false);
    }
    // Si quien llama pasa un `origen`, se queda en `resto` y no viaja: de ahí solo salen datos, id y timestamp.
    const { tipo, datos, destino, ...resto } = mensaje;
    const mensajeCompleto = {
        tipo,
        datos: datos ?? resto.datos,
        id: resto.id || generarIdUnico('msg'),
        timestamp: resto.timestamp || Date.now(),
        origen: componenteId,
        destino
    };
    if (!String(tipo).includes('HEARTBEAT')) logger.debug(`[mensajeria] Enviando mensaje: ${tipo}`, { destino: destino || 'broadcast' });
    return enviarMensajeInterno(mensajeCompleto, destino);
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
        if (!inicializado) {
            _avisarDescarte(_avisadosSinInicializar, tipo,
                `[mensajeria] No se envía ${tipo}: el bus de este frame aún no está inicializado (falta inicializarMensajeria)`);
            reject(_errorBus('no-enviado', `No se envió ${tipo}: el bus de este frame aún no está inicializado`));
            return;
        }
        const mensaje = crearMensaje(tipo, datosReales);
        mensaje.requiereConfirmacion = true;

        const idConfirmacion = mensaje.id;

        // Registrar callback pendiente
        const timeoutId = setTimeout(() => {
            confirmacionesPendientes.delete(idConfirmacion);
            reject(_errorBus('sin-respuesta', `Nadie contestó a ${tipo} en ${timeout} ms`));
        }, timeout);

        confirmacionesPendientes.set(idConfirmacion, {
            resolve,
            reject,
            timeoutId,
            tipo,
            timestamp: Date.now()
        });

        // Enviar mensaje — enviarMensajeInterno() devuelve una Promise desde que se
        // corrigió su .catch() roto (ver comentario junto a su definición); hay que
        // esperarla para saber si el envío falló de verdad, si no este chequeo nunca
        // detecta el fallo (una Promise siempre es truthy) y el timeout de 5s de arriba
        // se convierte en el único camino de salida, incluso cuando el envío falló al
        // instante (p.ej. iframe destino inexistente).
        enviarMensajeInterno(mensaje, destino).then(enviado => {
            if (!enviado) {
                clearTimeout(timeoutId);
                confirmacionesPendientes.delete(idConfirmacion);
                reject(_errorBus('no-enviado', `No se pudo enviar ${tipo} a '${destino}'`));
            }
        });
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
        origen: componenteId
    };
}

/**
 * Error de un envío con acuse. `motivo` dice QUÉ pasó, que es lo que necesita quien envía para
 * decidir: no es lo mismo "no contestó" (reintentar puede servir) que "se rompió al procesarlo"
 * (reintentar repite el fallo) o "no se envió" (el destino no existe).
 * @param {'no-enviado'|'sin-respuesta'|'fallo-handler'} motivo
 * @param {string} texto
 */
function _errorBus(motivo, texto) {
    const error = new Error(texto);
    error.motivo = motivo;
    return error;
}

/**
 * Envía un mensaje internamente
 * @param {Object} mensaje - Mensaje a enviar
 * @param {string|Window} destino - Destino
 * @returns {boolean} True si se envió
 */
/**
 * Avisa UNA vez de que este frame no tiene ventana de arriba. Pasa de verdad: la pantalla de
 * selección se abre como página suelta en la despedida, y los tests abren hijos sin padre.
 */
function _avisarSinPadre() {
    if (avisoSinPadreDado) return;
    avisoSinPadreDado = true;
    logger.warn(`[mensajeria] ${componenteId} está sin padre: lo que se mande hacia arriba no sale de aquí. Este aviso no se repite.`);
}

/** "A todos" = a los iframes registrados de este frame. Nunca sube ni alcanza a los nietos. */
function _enviarATodos(mensaje) {
    let enviados = 0;
    for (const [, info] of iframesRegistrados) {
        const ventana = info?.elemento?.contentWindow;
        if (ventana) {
            ventana.postMessage(mensaje, globalThis.location.origin);
            enviados++;
        }
    }
    return enviados > 0;
}

function enviarMensajeInterno(mensaje, destino) {
    // Envuelto en Promise.resolve(): muchos callers encadenan .catch() sobre el
    // resultado (patrón fire-and-forget) esperando una Promise real. Devolver un
    // booleano síncrono desnudo (como hacía antes) rompe ese .catch() con un
    // TypeError inmediato — no una promesa rechazada, sino una excepción síncrona
    // en el momento de evaluar `.catch`, que aborta el resto de la función llamante
    // si ese resto vive en el mismo bloque try (ver p.ej. marcarParadaCompletada en
    // codigo-padre.html, donde cortaba el cartel de transición justo después).
    // Un frame no se manda nada a sí mismo por aquí: nadie lo recibiría —el padre no tiene ventana
    // de arriba y un hijo no está entre sus propios iframes— y el envío se perdía avisando, como
    // mucho, de "sin padre" una sola vez. Para eso está despacharLocal, que pasa por la misma fila.
    // Sin destino no se envía nada: antes, `undefined`/`null` se confundían con 'broadcast' y un
    // enviarMensaje() sin destino por descuido salía igual — a veces a nadie, si el frame no tiene
    // iframes propios, sin ningún aviso (audio-hijo3.html perdía así su 'pausado' hacia el padre;
    // ver GUIA-COMPLETA.md §10.25, BC-20). Ahora "a todos" es solo el literal
    // 'broadcast', explícito.
    if (destino === undefined || destino === null) {
        _avisarDescarte(_avisadosSinDestino, mensaje.tipo,
            `[mensajeria] ${componenteId} no envía ${mensaje.tipo}: falta destino ('padre', el nombre de un iframe registrado, o 'broadcast' para todos)`);
        return Promise.resolve(false);
    }

    if (destino === componenteId) {
        _avisarDescarte(_avisadosAutoenvio, mensaje.tipo,
            `[mensajeria] ${componenteId} no se envía ${mensaje.tipo} a sí mismo por enviarMensaje: eso se hace con despacharLocal`);
        return Promise.resolve(false);
    }
    try {
        let resultado = false;
        const aTodos = destino === 'broadcast';

        if (destino === 'padre') {
            if (ventanaPadre) {
                ventanaPadre.postMessage(mensaje, globalThis.location.origin);
                resultado = true;
            } else {
                _avisarSinPadre();
            }
        } else if (aTodos) {
            resultado = _enviarATodos(mensaje);
        } else {
            const info = iframesRegistrados.get(destino);
            const ventana = info?.elemento?.contentWindow;
            if (ventana) {
                ventana.postMessage(mensaje, globalThis.location.origin);
                resultado = true;
            } else {
                logger.warn(`[mensajeria] Destino desconocido desde ${componenteId}: '${destino}' no es la ventana de arriba ni un iframe registrado aquí`);
            }
        }
        return Promise.resolve(resultado);
    } catch (error) {
        logger.error(`[mensajeria] Error enviando mensaje: ${error.message}`);
        return Promise.resolve(false);
    }
}

// =====================================================
// MANEJO DE MENSAJES ENTRANTES
// =====================================================

/**
 * Cola de ejecución por tipo de mensaje: cada `message` event dispara su handler en
 * una tarea separada del event loop, así que sin esto dos mensajes del mismo tipo que
 * llegan con pocos milisegundos de diferencia (típico en el flujo de GPS/CAMBIO_PARADA)
 * se procesan en paralelo, sin ninguna garantía de que terminen en el orden en que
 * llegaron. Aquí se encadena cada ejecución detrás de la anterior DEL MISMO TIPO —
 * tipos distintos siguen siendo completamente concurrentes entre sí (un CAMBIO_PARADA
 * lento no bloquea un HEARTBEAT), solo se serializa lo que comparte tipo.
 * @type {Map<string, Promise>}
 */
const _colaPorTipo = new Map();

/**
 * Encola la ejecución de `handler` para que corra después de cualquier ejecución previa
 * pendiente del mismo `mensaje.tipo`, preservando el orden de llegada real.
 * @param {Object} mensaje
 * @param {MessageEvent} event
 * @param {Function} handler
 */
function _encolarEjecucionHandler(mensaje, event, handler) {
    const tipo = mensaje.tipo;
    const colaAnterior = _colaPorTipo.get(tipo) || Promise.resolve();

    const ejecucion = colaAnterior.then(() => _ejecutarYContestar(mensaje, event, handler));

    // La fila NO puede morir. Antes, un fallo dentro del propio catch (leer `.message` de algo
    // que no es un error) dejaba esta cadena rechazada, y todo mensaje posterior de ese tipo
    // se quedaba sin procesar para siempre, en silencio. El .catch de aquí corta esa herencia:
    // el eslabón que se guarda siempre resuelve.
    const terminada = ejecucion.catch(() => {});

    // Y tampoco puede quedarse parada. Un handler que no termina nunca —no que falle, que se
    // quede a medias esperando algo que no llega— tiene el mismo efecto que matarla, y un
    // try/catch no protege de eso. Como la fila es por tipo, solo ese tipo deja de procesarse
    // mientras todo lo demás sigue funcionando: es justo el fallo imposible de diagnosticar.
    // Pasado el plazo, la fila sigue adelante sin él y se dice en voz alta. El handler no se
    // corta: sigue por su cuenta, y si acaba terminando, su resultado llega igual.
    _colaPorTipo.set(tipo, Promise.race([terminada, _plazoDeFila(tipo, mensaje, terminada)]));
    return ejecucion;
}

/**
 * Promesa que resuelve si `terminada` tarda más de `PLAZO_MAX_HANDLER`, gritándolo. Si la
 * ejecución acaba antes, el temporizador se cancela y esto no dice nada ni deja nada vivo.
 * @param {string} tipo
 * @param {Object} mensaje
 * @param {Promise} terminada
 * @returns {Promise<void>}
 */
function _plazoDeFila(tipo, mensaje, terminada) {
    return new Promise((resolve) => {
        const temporizador = setTimeout(() => {
            logger.error(
                `[mensajeria] ${componenteId}: el handler de ${tipo} (mensaje ${mensaje.id}) lleva `
                + `${PLAZO_MAX_HANDLER} ms sin terminar. La fila de ese tipo sigue adelante sin él, `
                + 'pero esto es un fallo del handler: algo que espera no va a llegar nunca.'
            );
            resolve();
        }, PLAZO_MAX_HANDLER);
        terminada.finally(() => clearTimeout(temporizador));
    });
}

/** Texto de un fallo, venga como venga: nadie garantiza que sea un Error. */
function _textoDeError(error) {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error) return error;
    try { return JSON.stringify(error) ?? String(error); } catch { return String(error); }
}

/**
 * Ejecuta el handler y contesta si el mensaje venía con acuse.
 *
 * El acuse dice "alguien lo procesó", no "salió bien": el resultado va dentro. Si el handler
 * se rompe, se contesta igual, pero con el fallo en la raíz, para que quien envió pueda
 * distinguirlo de un mensaje perdido y no reintente en balde.
 */
async function _ejecutarYContestar(mensaje, event, handler) {
    const ventana = event?.source;
    try {
        const resultado = await Promise.resolve(handler(mensaje, event));
        if (mensaje.requiereConfirmacion && ventana) {
            enviarConfirmacion(mensaje, { datos: resultado }, ventana);
        }
        return resultado;
    } catch (error) {
        const texto = _textoDeError(error);
        logger.error(`[mensajeria] El handler de ${mensaje.tipo} se rompió: ${texto}`);
        if (mensaje.requiereConfirmacion && ventana) {
            enviarConfirmacion(mensaje, { error: { mensaje: texto } }, ventana);
        }
        throw error;
    }
}

/**
 * Entrega un mensaje a los handlers de ESTE frame, por la misma fila que los que llegan de
 * fuera. Es la única forma correcta de que un frame se mande algo a sí mismo: `enviarMensaje`
 * no puede, porque uno no está entre sus propios iframes registrados.
 * @param {Object} mensaje
 * @returns {Promise<*>} lo que devuelva el handler
 */
export function despacharLocal(mensaje) {
    if (!mensaje || !mensaje.tipo) {
        logger.error('[mensajeria] despacharLocal necesita un mensaje con tipo');
        return Promise.resolve(undefined);
    }
    const completo = {
        ...mensaje,
        origen: componenteId,
        id: mensaje.id || generarIdUnico('msg'),
        timestamp: mensaje.timestamp || Date.now(),
    };
    const handler = obtenerMapaManejadores().get(completo.tipo);
    if (!handler) {
        logger.warn(`[mensajeria] ${componenteId} se despachó ${completo.tipo} a sí mismo y no tiene handler para ese tipo`);
        return Promise.resolve(undefined);
    }
    return _encolarEjecucionHandler(completo, null, handler);
}

/** Tipos ya avisados, para no repetir el mismo descarte en cada mensaje. */
const _avisadosSinOrigen = new Set();
const _avisadosPorFuente = new Set();
const _avisadosSuplantacion = new Set();
const _avisadosSinInicializar = new Set();
const _avisadosAutoenvio = new Set();
const _avisadosSinDestino = new Set();

function _avisarDescarte(yaAvisados, tipo, texto) {
    if (yaAvisados.has(tipo)) return;
    yaAvisados.add(tipo);
    logger.warn(texto);
}

/**
 * Quién puede hablarle a este frame: su ventana de arriba, los iframes que él mismo ha
 * registrado, y él mismo. Cualquier otro frame del dominio queda fuera — con el listener
 * abierto, un frame que no es de la conversación podía activar el modo dev o cerrar el chat.
 * @param {MessageEvent} event
 */
function _fuenteAutorizada(event) {
    if (!event.source) return false;
    if (event.source === globalThis) return true;
    if (ventanaPadre && event.source === ventanaPadre) return true;
    return _vieneDeIframePropio(event);
}

/** ¿El mensaje viene de un iframe que este frame ha registrado? */
function _vieneDeIframePropio(event) {
    return _idDeIframePropio(event) !== false;
}

/**
 * El nombre con que este frame registró el iframe que manda el mensaje, o `false` si no es suyo.
 * Es la identidad de verdad: la da la ventana que envía, no lo que el mensaje dice de sí mismo.
 */
function _idDeIframePropio(event) {
    for (const [, info] of iframesRegistrados) {
        if (info?.elemento?.contentWindow === event.source) return info.id;
    }
    return false;
}

/**
 * Manejador principal de mensajes entrantes
 * @param {MessageEvent} event - Evento de mensaje
 */
function manejarMensajeEntrante(event) {
    // Mismo origen y nada más. El protocolo file:// no se contempla: los módulos ES no cargan
    // ahí, así que la app no puede funcionar así (lo documenta tests/e2e/18).
    if (event.origin !== globalThis.location.origin) {
        return;
    }

    const mensaje = event.data;

    // Ignorar mensajes inválidos — schema mínimo: tipo + origen obligatorios
    if (!mensaje || typeof mensaje !== 'object' || !mensaje.tipo) {
        return;
    }
    if (!_fuenteAutorizada(event)) {
        _avisarDescarte(_avisadosPorFuente, mensaje.tipo,
            `[mensajeria] ${componenteId} descarta ${mensaje.tipo}: viene de un frame que no es su padre ni un iframe registrado aquí`);
        return;
    }
    if (!mensaje.origen) {
        // En silencio, este descarte esconde el fallo entero: un mensaje que sale, no llega y no
        // deja rastro parece "no me ha llegado nada" (pasó con SELECCION.REINICIAR).
        _avisarDescarte(_avisadosSinOrigen, mensaje.tipo,
            `[mensajeria] ${componenteId} descarta ${mensaje.tipo}: el mensaje no dice de quién viene (le falta 'origen')`);
        return;
    }

    // Ignorar mensajes propios
    // Quien dice ser, lo es: un iframe registrado solo puede hablar con su nombre de registro. El
    // `origen` lo pone el bus de quien envía, así que uno distinto es un frame haciéndose pasar por
    // otro. De la ventana de arriba no hay a quién confundir (solo hay una), y los mensajes del propio
    // frame no salen de otra ventana.
    const idRegistrado = _idDeIframePropio(event);
    if (idRegistrado !== false && mensaje.origen !== idRegistrado) {
        _avisarDescarte(_avisadosSuplantacion, mensaje.tipo,
            `[mensajeria] ${componenteId} descarta ${mensaje.tipo}: dice venir de '${mensaje.origen}' pero lo envía '${idRegistrado}'`);
        return;
    }

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

    // Los errores de un frame de abajo suben hasta el padre de todos: es donde se miran. El frame
    // de en medio no escribe nada para esto — si tuviera que acordarse cada contenedor, el día que
    // aparezca uno nuevo sus errores se perderían en silencio.
    if (mensaje.tipo === TIPOS_MENSAJE.SISTEMA.ERROR && ventanaPadre && _vieneDeIframePropio(event)) {
        enviarMensaje({
            tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
            destino: 'padre',
            datos: { ...mensaje.datos, reenviadoDe: mensaje.origen },
        });
    }

    if (handler) {
        // Aquí nadie espera el resultado, y no hace falta: el rechazo ya queda atendido por el
        // `.catch` con el que `_encolarEjecucionHandler` guarda el eslabón de la fila, así que un
        // handler roto no deja una promesa suelta que `instalarReporteErroresAlPadre` (js/utils.js)
        // convertiría en un segundo aviso al padre por el mismo fallo. Lo cubre BC-13.
        _encolarEjecucionHandler(mensaje, event, handler);
    } else if (mensaje.requiereConfirmacion) {
        // Sin handler NO se contesta: nadie ha procesado nada. Contestar aquí le diría al emisor
        // "entregado" y le quitaría el reintento — que es justo lo que salva al audio cuando
        // hijo3 aún no ha terminado de cargar.
        logger.warn(`[mensajeria] ${componenteId} recibió ${mensaje.tipo} con acuse y no tiene handler para ese tipo: no se contesta, y quien lo envió agotará su plazo`);
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
            pendiente.reject(_errorBus('fallo-handler', mensaje.error.mensaje || `El handler de ${pendiente.tipo} se rompió`));
        } else {
            pendiente.resolve(mensaje.datos);
        }
    }
}

/**
 * Contesta a un mensaje que pedía acuse.
 * @param {Object} mensajeOriginal - Mensaje original
 * @param {{datos?: *, error?: {mensaje: string}}} contenido - Lo que devolvió el handler, o el
 *   fallo EN LA RAÍZ. Van separados a propósito: un handler puede devolver `{ error: ... }`
 *   como resultado legítimo (hijo3 lo hace cuando un audio no carga), y eso no es lo mismo que
 *   romperse.
 * @param {Window} destino - Ventana destino
 */
function enviarConfirmacion(mensajeOriginal, contenido, destino) {
    const confirmacion = {
        tipo: TIPOS_MENSAJE.SISTEMA.CONFIRMACION,
        idOriginal: mensajeOriginal.id,
        timestamp: Date.now(),
        origen: componenteId,
        ...contenido
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
 * @returns {boolean} True si se registró
 */
export function registrarIframe(id, iframe, opciones = {}) {
    if (!id || !iframe) {
        logger.error('[mensajeria] registrarIframe: id e iframe son requeridos');
        return false;
    }

    // Sin guardar `contentWindow`: la ventana se lee del elemento en cada envío, porque
    // recargar un iframe la sustituye y la guardada se queda vieja.
    iframesRegistrados.set(id, {
        id,
        elemento: iframe,
        recuperable: opciones.recuperable === true,
        estado: 'registrado',
        timestamp: Date.now()
    });

    logger.info(`[mensajeria] Iframe registrado: ${id}${opciones.recuperable === true ? ' (recuperable)' : ''}`);
    return true;
}

/**
 * Da de baja un iframe: deja de recibir mensajes de este frame y los suyos dejan de aceptarse.
 * Hace falta porque hay iframes que van y vienen — el puzzle se crea y se destruye en cada reto,
 * y el mapa completo cambia de página en cada apertura.
 * @param {string} id
 * @returns {boolean} true si estaba registrado
 */
export function desregistrarIframe(id) {
    const estaba = iframesRegistrados.delete(id);
    if (estaba) logger.info(`[mensajeria] Iframe dado de baja: ${id}`);
    return estaba;
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
 * Marca script2 como listo en el state-manager centralizado.
 *
 * El dato vive SOLO ahí: el bus no guarda copia propia. Tenerla era una segunda verdad que
 * nadie leía — quien consulta esto (`getScript2Listo`) lo hace contra el state-manager.
 */
export function marcarScript2Listo() {
    logger.info('[mensajeria] Script2 marcado como listo');
    const sm = obtenerStateManager();
    if (sm && typeof sm.setScript2Listo === 'function') {
        sm.setScript2Listo(true).catch(e => logger.debug('[mensajeria] Error sincronizando script2Listo:', e?.message));
    }
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
        if (estado?.userPaused) {
            logger.debug('[mensajeria] Heartbeat en pausa (modo CASA) — no se reinicia. Usar reanudarHeartbeat()/preiniciarHeartbeat() para reanudar explícitamente.');
            return false;
        }
        if (estado?.activo) {
            logger.debug('[mensajeria] Heartbeat ya está activo');
            return true;
        }

        await sm.updateHeartbeat({ activo: true });

        const intervalId = setInterval(async () => {
            await enviarHeartbeatAHijos();
        }, intervalo);

        await sm.updateHeartbeat({ intervalo: intervalId });
        logger.debug('[mensajeria] Heartbeat iniciado');
        return true;
    } catch (error) {
        logger.error('[mensajeria] Error iniciando heartbeat:', error);
        return false;
    } finally {
        _heartbeatIniciando = false;
    }
}

// Pre-warm: inicia el heartbeat antes de que empiece la aventura.
// app.js lo llama en modo CASA para tenerlo listo; pausarHeartbeat() lo pausa a continuación.
// Reanudación explícita: limpia userPaused antes de arrancar, porque es una intención
// activa de tener el heartbeat listo, no un reinicio accidental durante una pausa.
export async function preiniciarHeartbeat(intervalo) {
    const sm = obtenerStateManager();
    if (sm) await sm.updateHeartbeat({ userPaused: false });
    return iniciarHeartbeat(intervalo);
}

// Reanuda el heartbeat tras una pausa (llamado desde _reanudarSubsistemasTrasPrewarm
// al completar la transición a modo AVENTURA). Limpia userPaused por el mismo motivo
// que preiniciarHeartbeat: es una reanudación intencional, no debe quedar bloqueada
// por la guarda de userPaused en iniciarHeartbeat().
export async function reanudarHeartbeat(intervalo) {
    const sm = obtenerStateManager();
    if (sm) await sm.updateHeartbeat({ userPaused: false });
    return iniciarHeartbeat(intervalo);
}

// Espera a que todos los iframes registrados hayan completado el handshake HIJO_LISTO.
// Se usa como optimización pre-aventura; si el SM no está disponible o no hay iframes,
// resuelve inmediatamente igual que el fallback de app.js.
export async function esperarHijosListos(timeout = 5000) {
    const sm = obtenerStateManager();
    if (!sm || typeof sm.crearPromiseHijoListo !== 'function') return { ready: true };
    const ids = [...iframesRegistrados.keys()];
    if (ids.length === 0) return { ready: true };
    try {
        await Promise.race([
            Promise.all(ids.map(id => sm.crearPromiseHijoListo(id).catch(() => {}))),
            new Promise(resolve => setTimeout(resolve, timeout))
        ]);
    } catch (_) { /* timeouts individuales ignorados */ }
    return { ready: true };
}

/**
 * Adelanta un latido, sin esperar al siguiente del reloj: sirve al volver a la pestaña, para
 * saber cuanto antes si algún frame se ha quedado por el camino.
 *
 * Si el latido está en pausa (modo CASA) no hace nada: la pausa es una decisión, y saltársela
 * fue exactamente el fallo de tener dos latidos.
 * @returns {boolean} true si se ha pedido el adelanto
 */
export function adelantarLatido() {
    const sm = obtenerStateManager();
    if (!sm) return false;
    sm.getHeartbeat()
        .then((estado) => {
            if (!estado?.activo || estado?.userPaused) return;
            return enviarHeartbeatAHijos();
        })
        .catch((error) => logger.debug('[mensajeria] No se pudo adelantar el latido:', error?.message));
    return true;
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
            // Ya estaba inactivo, pero igualmente se marca userPaused=true: quien llama a
            // pausarHeartbeat() expresa la intención de que el heartbeat NO debe reiniciarse
            // solo, sin pasar por reanudarHeartbeat()/preiniciarHeartbeat().
            await sm.updateHeartbeat({ userPaused: true });
            logger.debug('[mensajeria] Heartbeat ya estaba pausado; userPaused confirmado');
            return true;
        }

        // Limpiar intervalo
        if (estado?.intervalo) {
            clearInterval(estado.intervalo);
        }

        // Marcar como inactivo y bloquear reinicios accidentales (ver iniciarHeartbeat)
        await sm.updateHeartbeat({ activo: false, intervalo: null, userPaused: true });
        logger.debug('[mensajeria] Heartbeat pausado');
        return true;
    } catch (error) {
        logger.error('[mensajeria] Error pausando heartbeat:', error);
        return false;
    }
}

/**
 * Manda un latido a cada iframe registrado.
 *
 * La lista son los iframes registrados, no una escrita a mano: con una lista fija, un frame que
 * no estuviera en ella podía colgarse sin que nadie lo notara, y uno que ya no existiera se
 * seguía vigilando.
 */
async function enviarHeartbeatAHijos() {
    const sm = obtenerStateManager();
    if (!sm) return;

    try {
        const estado = await sm.getHeartbeat();
        if (!estado?.activo) return;

        for (const hijoId of [...iframesRegistrados.keys()]) {
            try {
                enviarMensaje({
                    tipo: TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
                    destino: hijoId,
                    datos: { timestamp: Date.now() }
                });

                // Incrementar contador de fallidos de forma atómica (evita race con procesarHeartbeatResponse)
                let nuevosFailidos_count = 0;
                await sm.atomicUpdateHeartbeat(s => {
                    const fallidos = s.heartbeatsFallidos?.get(hijoId) || 0;
                    nuevosFailidos_count = fallidos + 1;
                    const nuevosFallidos = new Map(s.heartbeatsFallidos || []);
                    nuevosFallidos.set(hijoId, nuevosFailidos_count);
                    return { heartbeatsFallidos: nuevosFallidos };
                });

                if (nuevosFailidos_count >= MAX_LATIDOS_SIN_RESPUESTA) {
                    await marcarHijoDesconectado(hijoId);
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
async function marcarHijoDesconectado(hijoId) {
    const sm = obtenerStateManager();
    if (!sm) return;

    try {
        await sm.atomicUpdateHeartbeat(s => {
            const desconectados = new Set(s?.hijosDesconectados || []);
            desconectados.add(hijoId);
            // Resetear contador para evitar reloads repetidos durante la recarga
            const nuevosFallidos = new Map(s?.heartbeatsFallidos || []);
            nuevosFallidos.set(hijoId, 0);
            return { hijosDesconectados: Array.from(desconectados), heartbeatsFallidos: nuevosFallidos };
        });
        logger.warn(`[mensajeria] ${hijoId} lleva ${MAX_LATIDOS_SIN_RESPUESTA} latidos sin contestar`);

        // Solo se recarga lo que sabe retomar lo que estaba haciendo. Recargar a ciegas un frame
        // que no se restaura le hace perder el sitio al usuario, que es peor que el cuelgue.
        if (iframesRegistrados.get(hijoId)?.recuperable) {
            await intentarReconectarHijo(hijoId);
        } else {
            logger.warn(`[mensajeria] ${hijoId} no se recarga: no está marcado como recuperable`);
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
            // Notificar al padre para que tome snapshot de estado antes del reload
            if (typeof globalThis._vv_beforeHijoReload === 'function') {
                globalThis._vv_beforeHijoReload(hijoId);
            }
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

        // Resetear fallidos, actualizar último heartbeat y reconectar — todo en una sola operación atómica
        let estabaDesconectado = false;
        await sm.atomicUpdateHeartbeat(s => {
            const nuevosFallidos = new Map(s?.heartbeatsFallidos || []);
            nuevosFallidos.set(hijoId, 0);
            const nuevosUltimos = new Map(s?.ultimoHeartbeat || []);
            nuevosUltimos.set(hijoId, Date.now());
            const desconectados = new Set(s?.hijosDesconectados || []);
            estabaDesconectado = desconectados.has(hijoId);
            if (estabaDesconectado) desconectados.delete(hijoId);
            return { heartbeatsFallidos: nuevosFallidos, ultimoHeartbeat: nuevosUltimos, hijosDesconectados: Array.from(desconectados) };
        });

        if (estabaDesconectado) {
            logger.info(`[mensajeria] Hijo ${hijoId} reconectado`);
            if (hijoId === 'hijo2') {
                await reenviarMensajesGPSAPendientes(hijoId);
            }
        }
    } catch (error) {
        logger.error('[mensajeria] Error procesando heartbeat response:', error);
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
                    tipo: mensaje.tipo || 'NAVEGACION.ACTUALIZAR_ESTADO',
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
    marcarScript2Listo,
    registrarIframe,
    limpiar
};

// =====================================================
// EXPOSICIÓN INMEDIATA DE API GLOBAL
// Ejecutar exponerAPIGlobal() inmediatamente al cargar el módulo
// para que globalThis.mensajeria esté disponible antes de inicializar
// =====================================================
exponerAPIGlobal();
logger.info('[mensajeria] API expuesta globalmente (pre-inicialización)');

// Dispatch mensajeriaReady event to signal that the API is available
if (globalThis.window !== undefined) {
    globalThis.dispatchEvent(new Event('mensajeriaReady'));
    logger.info('[mensajeria] mensajeriaReady event dispatched');
}