/**
 * Módulo principal de la aplicación
 * @module App
 * @version 1.0.0
 *
 * IMPORTANTE — lógica dividida:
 * Este módulo exporta las funciones de orquestación (actualizarInterfazModo,
 * manejarCambioModo…).
 *
 * Los handlers que reaccionan a los mensajes reales del padre
 * (HIJO_PREPARADO, HIJO_LISTO, CAMBIO_PARADA, RETO.COMPLETADO, GPS.*, AUDIO.*…)
 * están registrados en el script type="module" de codigo-padre.html
 * (buscar el comentario «Script 1 — controladores del padre»).
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
import { generarIdUnico, canonicalizarModo, retryUntilAvailable, sleep } from './utils.js';


// Access global mensajeria functions - ahora esperan a que esté lista
const enviarMensaje = (...args) => {
    if (mensajeriaReady && globalThis.mensajeria) {
        return globalThis.mensajeria.enviarMensaje(...args);
    } else {
        logger.error('mensajeria not loaded', args);
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
        }, { permanente: true });
        registrar(TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_EFECTUADO, async (msg) => {
            _respuestasEfectuadoActual.set(msg.origen, { timestamp: Date.now(), datos: msg.datos });
            logger.debug(`[actualizarInterfazModo] EFECTUADO recibido de ${msg.origen}`);
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

// ==================== FUNCIONES AUXILIARES ====================

// Helper: wrap a promise with a conservative timeout that resolves to null on timeout.
//
// El temporizador se cancela en cuanto la promesa se resuelve o se rechaza. Sin ese
// clearTimeout, `Promise.race` deja el `setTimeout` vivo aunque ya haya ganado la
// promesa real, y su callback acaba escribiendo un `[withTimeout] ... timed out`
// que es FALSO: la operación había terminado a tiempo (un cambio de modo que dura
// 113 ms deja igualmente tres avisos de "timed out after 15000ms" quince segundos
// después). No rompía nada — el valor bueno ya se había usado — pero convertía el
// log en una fuente de alarmas inventadas justo donde se va a mirar para diagnosticar
// cualquier otra cosa. `.finally()` propaga el rechazo igual que antes.
function withTimeout(promise, ms = 5000, desc = 'operation') {
    let timeoutId = null;
    const temporizador = new Promise(resolve => {
        timeoutId = setTimeout(() => {
            logger.warn(`[withTimeout] ${desc} timed out after ${ms}ms`);
            resolve(null);
        }, ms);
    });
    return Promise.race([promise, temporizador]).finally(() => clearTimeout(timeoutId));
}


// ============================================================
// Este modulo no arranca nada por su cuenta: no tiene funcion de inicializacion.
// Cada componente (el padre y cada hijo) registra sus controladores y hace su
// arranque dentro de su propio HTML — el del padre es inline en su Script 1.
// Lo que sale de aqui son utilidades que el padre importa.
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
            Promise.resolve(enviarMensaje({
                destino: hijoId,
                tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
                datos: { modo, mensajeId }
            })).catch(err => {
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
            Promise.resolve(enviarMensaje({
                destino: hijoId,
                tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_APLICADO,
                datos: { modo, timestamp: Date.now(), mensajeId }
            })).catch(err => {
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
        await sleep(intervaloChequeo);
    }

    // Timeout: reportar quiénes no respondieron
    const noRespondieron = hijosEsperados.filter(hijo => !mapaRespuestas.has(hijo));
    logger.warn(`[esperarRespuestas] Timeout esperando ${tipoRespuesta} de: ${noRespondieron.join(', ')}`);
}

// Al entrar en AVENTURA, la interfaz no se actualiza hasta que los hijos están listos (o pasa el plazo). La parada por defecto
// no se elige aquí: la elige un solo sitio, ensureDefaultParada() del padre, que no hace nada si ya hay un elemento en curso
// (estudio K-61: un segundo camino aquí activaba la parada de inicio en cada vuelta a AVENTURA desde CASA).
async function _esperarHijosAlEntrarEnAventura() {
    // 10 s de espera a los hijos antes de seguir. CONFIG.MENSAJERIA.TIMEOUTS.CONFIRMACION (5 s) no se lee aquí: ver docs/estudio-caminos.md (K-01).
    const cfgConfirmTimeout = 10000;

    const hijosPromise = globalThis.mensajeria.esperarHijosListos(cfgConfirmTimeout);

    try {
        const race = await Promise.race([
            hijosPromise,
            new Promise(resolve => setTimeout(() => resolve({ timeout: true }), cfgConfirmTimeout * 2))
        ]);

        if (race?.timeout) {
            logger.info('[APP][CAMBIO_MODO] HIJO_LISTO timed out; proceeding anyway');
        } else {
            logger.info('[APP][CAMBIO_MODO] HIJO_LISTO completed or settled');
        }
    } catch (e) {
        logger.warn('[APP][CAMBIO_MODO] Error esperando a los hijos al entrar en AVENTURA:', e);
    }
}

async function _notificarErrorCambioModo(mensaje, errorMsg, error, modo, logPrefix) {
    // Solo a otro frame. Un cambio de modo que el padre se despacha a sí mismo ya devuelve el
    // fallo a quien lo despachó (el resultado de despacharLocal), y enviárselo por el bus no
    // saldría. Sin `origen` no hay a quién contestar.
    if (!mensaje?.origen || mensaje.origen === 'padre') return;
    try {
        await enviarMensaje({
            destino: mensaje.origen,
            tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
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

    const { modo, opciones = {}, motivo = 'no especificado', restaurado = false } = mensaje.datos;

    // Normalizar modo usando helper centralizado
    const modoNormalized = canonicalizarModo(modo); // 'casa'|'aventura' or null
    const modosKeys = Object.keys(MODOS); // ['CASA','AVENTURA']

    try {
        // 2. Validar modo solicitado (ahora normalizado)
        if (!modoNormalized) {
            const errorMsg = `Modo inválido: '${modo}'. Válidos: ${modosKeys.join(', ')}`;
            logger.warn(`${logPrefix} ${errorMsg}`, { modo, mensajeId });
            return { exito: false, error: errorMsg };
        }

        // 3. ¿Ya estamos en ese modo?
        // Sin fallback a CASA: el modo arranca en null (sin decidir), y con el fallback
        // antiguo la primera transición real hacia CASA se confundía con "ya estamos ahí".
        const modoActual = estado.modo?.actual ?? null;
        if (modoNormalized === modoActual) {
            // "El padre ya cree estar en ese modo" NO significa "todos los hijos lo saben".
            // Antes se devolvía aquí sin más y el caller (_hdl_SISTEMA_CAMBIO_MODO) leía ese
            // exito:true como "todo aplicado", siguiendo con heartbeat/GPS/restauración
            // mientras los hijos nunca habían recibido CAMBIO_MODO — su UI se quedaba en el
            // modo anterior sin que nada lo delatara. Ahora se reenvía la propagación
            // (actualizarInterfazModo es la única fuente de verdad de la UI de los hijos) y
            // se omiten solo los efectos que sí sería incorrecto repetir: limpieza de
            // recursos, pre-warm y el registro de un cambio de modo que no ha ocurrido.
            logger.info(`${logPrefix} Modo ya establecido a '${modoNormalized}' — resincronizando hijos sin repetir efectos`, { mensajeId });
            let resincronizado = false;
            try {
                await withTimeout(actualizarInterfazModo(estado, modoNormalized), 15000, 'actualizarInterfazModo(resync)');
                resincronizado = true;
            } catch (errResync) { // NOSONAR
                logger.warn(`${logPrefix} Resincronización de hijos falló: ${errResync?.message}`, { mensajeId });
            }
            return { exito: true, cambiado: false, resincronizado, modoActual };
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

        // El registro de eventos es uno solo, el del padre (Script 1 de codigo-padre.html), el único sitio que carga este módulo.
        globalThis.registrarEvento('CAMBIO_MODO', eventoCambioModo);

        // 5. Notificar inicio del cambio de modo
        logger.info(`${logPrefix} Iniciando cambio de modo '${modoActual}' a '${modoNormalized}'`, {
            motivo,
            origen: mensaje.origen,
            timestamp: new Date(timestamp).toISOString()
        });

        // El bloqueo de cambios concurrentes (estado.sistema.cambiandoModo) ya lo aplica
        // _hdl_SISTEMA_CAMBIO_MODO (codigo-padre.html) ANTES de llamar a esta función, cubriendo
        // toda la secuencia (congelado→este cambio→restauración) — poner/quitar la misma
        // bandera aquí también reabriría exactamente la ventana sin proteger que ese guard
        // exterior cierra: este cuerpo terminaría y resetearía cambiandoModo=false antes de
        // que la restauración de progreso real (posterior a esta función) llegara a ejecutarse.

        // OPTIMISTIC UPDATE: actualizar estado de modo inmediatamente (normalizado)
        try {
            estado.modo = estado.modo || {};
            estado.modo.actual = modoNormalized;
        } catch (e) {
            logger.warn(`${logPrefix} No se pudo aplicar optimistic update:`, e?.message);
        }

        // **NUEVO: Limpiar recursos inmediatamente después del cambio de modo**
        try {
            await limpiarRecursosPorModo(estado, modoNormalized, opciones, restaurado);
            logger.info(`${logPrefix} Recursos limpiados inmediatamente después del cambio de modo`);
        } catch (errorLimpieza) { // NOSONAR
            logger.warn(`${logPrefix} Error limpiando recursos:`, errorLimpieza);
            // No bloquear el cambio de modo por errores de limpieza
        }

        try {
            // El cambio de modo no se anuncia a los hijos al empezar con un mensaje propio: cada uno recibe el modo por
            // SISTEMA.CAMBIO_MODO (paso 9 de la lavadora).

            // 6. Al entrar en AVENTURA, esperar a los hijos antes de actualizar la interfaz
            if (modoNormalized === MODOS.AVENTURA) await _esperarHijosAlEntrarEnAventura();

            // 7. Actualizar interfaz según el modo (no bloquear>5s por interfaz)
            const hijosInicializados = estado.hijosInicializados ? Array.from(estado.hijosInicializados) : [];
            logger.info(`${logPrefix} Iniciando actualización de interfaz para ${hijosInicializados.length} hijos: ${hijosInicializados.join(', ')}`);
            await withTimeout(actualizarInterfazModo(estado, modoNormalized), 15000, 'actualizarInterfazModo');

            // La limpieza de capas del mapa y la restauración de vista por defecto ya
            // ocurrió antes de llamar a esta función — ver _hdl_SISTEMA_CAMBIO_MODO en
            // codigo-padre.html, que llama a funcionesMapa.manejarCambioModoMapa()
            // directamente (no puede registrarse como handler CAMBIO_MODO por la carrera
            // de inserción en getMapaControladoresSync). Repetirlo aquí sería la misma
            // limpieza dos veces por cada cambio de modo.

            // Tampoco al terminar: lo mismo que al empezar (paso 9 de la lavadora).

            // 8. Registrar éxito
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
 * Limpia recursos específicos según el modo
 * @private
 * @param {Object} estado - Estado global de la aplicación
 * @param {boolean} restaurado - true si este cambio de modo es una reanudación de sesión
 */
async function limpiarRecursosPorModo(estado, modo, opciones = {}, restaurado = false) {
    try {
        logger.info(`[APP][LIMPIAR_RECURSOS] Iniciando limpieza completa para cambio a modo '${modo}'`);
        // **NUEVO: Resetear estado de navegación para "empezar de nuevo"**
        logger.info(`[APP][LIMPIAR_RECURSOS] Reseteando estado para cambio a modo '${modo}'`);

        // Resetear selecciones previas
        estado.paradaActual = null;
        estado.elementoActual = null;

        // Resetear estado GPS — NUNCA tocar aquí estado.gps.activo ni estado.gps.watchId.
        // watchPosition() se enciende una sola vez en P15 y no se apaga al cambiar de modo
        // (ver docs/GUIA-COMPLETA.md §2.15/§2.6 y "Fuente única de verdad del estado GPS") —
        // el modo solo decide si las posiciones fuerzan avance automático (comprobación en
        // funciones-mapa.js:procesarPosicionGPSParaAventura), no si el sensor está encendido.
        // Poner watchId/activo a false aquí mentía sobre el estado real: el watch nativo
        // seguía vivo y disparando _watchPositionSuccess de fondo, pero activarGPS() usa
        // exactamente `est.gps.activo && est.gps.watchId !== null` para decidir si ya hay
        // uno corriendo — con watchId a null, la siguiente activación (reentrar en AVENTURA)
        // no reconocía el watch existente y arrancaba un SEGUNDO watchPosition en paralelo,
        // sin poder cancelar nunca el primero (su id ya se había perdido). Cada vuelta
        // CASA↔AVENTURA sin este fix sumaba un watch más, todos escribiendo sobre el mismo
        // estado.gps y mandando ACTUALIZAR_ESTADO duplicados a hijo2.
        estado.gps = estado.gps || {};
        estado.gps.posicionUsuario = null;

        logger.debug(`[APP][LIMPIAR_RECURSOS] Estado de navegación reseteado`);

        // Limpiar mapa completamente — un solo camino (paso 8.4 de la lavadora): en un
        // cambio real (no reanudación), _hdl_SISTEMA_CAMBIO_MODO ya llamó a
        // funcionesMapa.manejarCambioModoMapa() (que a su vez llama a limpiarPorEstado con
        // resetCompleto:true) justo antes de llegar aquí — repetirlo aquí vaciaba
        // marcadores/polylines/rutas dos veces por el mismo cambio (medido: el log "Reset
        // completo ejecutado" salía dos veces). Solo en una reanudación
        // (restaurado:true) el handler llama a sincronizarModoMapa() en su lugar, que
        // nunca limpia el mapa — ahí SÍ hace falta este camino, y es el único que lo cubre.
        if (restaurado && globalThis.funcionesMapa?.limpiarPorEstado) {
            // Esperar a que el mapa esté inicializado si no lo está
            if (!globalThis.funcionesMapa.isMapInitialized?.()) {
                logger.info(`[APP][LIMPIAR_RECURSOS] Mapa no inicializado, esperando...`);
                // Polling ACOTADO: 50 x 100ms = 5s. Con un setTimeout recursivo a mano, la
                // carrera contra el timeout hacia que el `await` terminase pero la cadena de
                // temporizadores siguiera reprogramandose para siempre si el mapa no llegaba
                // a inicializarse nunca (EJE 23, ver GUIA-COMPLETA.md §11).
                await retryUntilAvailable(
                    () => globalThis.funcionesMapa.isMapInitialized?.() === true,
                    { maxIntentos: 50, intervalo: 100, mensaje: '[APP][LIMPIAR_RECURSOS] mapa inicializado' }
                );
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
        } else if (!restaurado) {
            logger.debug(`[APP][LIMPIAR_RECURSOS] Mapa no limpiado aquí: cambio real, ya lo hizo manejarCambioModoMapa()`);
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
    }

    // La restauración del modo tampoco se anuncia a los hijos con un mensaje propio (paso 9 de la lavadora; ver las
    // notas gemelas en manejarCambioModo()).

    // Actualizar la interfaz
    await actualizarInterfazModo(estado, modoAnterior);

    logger.warn(`Modo restaurado a '${modoAnterior}' después de fallo al cambiar a '${modoFallido}'`, {
        motivo
    });
}

// Controladores AUDIO implementados en audio-hijo3.html (hijo3)
// Controladores NAVEGACIóN en funciones-mapa.js

// Quien avisa de que un hijo esta listo es SISTEMA.HIJO_PREPARADO; su handler vive en
// codigo-padre.html. En este fichero no hay ningun handler de inicializacion.

// ADVERTENCIA IMPORTANTE:
// No usar globalThis.addEventListener('unload', ...) ni globalThis.addEventListener('beforeunload', ...)
// en ningún archivo propio ni de terceros. Estos eventos están obsoletos y bloqueados por políticas modernas de navegador.
// Usar siempre 'pagehide' para limpieza de recursos y memoria.
// Revisar cualquier librería externa antes de integrarla para evitar estos listeners.

// Limpieza agresiva de globales al descargar la página
if (globalThis.window !== undefined) {
    globalThis.addEventListener('pagehide', (evento) => {
        // `pagehide` cubre dos viajes distintos: la pagina se cierra de verdad, o el
        // navegador la congela en su cache de atras (bfcache) y puede devolverla viva
        // (`event.persisted`). Sin esta condicion, volver atras encontraba
        // globalThis.estado borrado — mismo motivo que _limpiarPagehide en codigo-padre.html
        // (F4 — ver GUIA-COMPLETA.md §28).
        if (evento?.persisted === true) {
            logger.info('[app.js] pagehide con persisted: la pagina se guarda en la cache de atras, NO se limpia nada');
            return;
        }
        // En pagehide, evitar limpiar durante init
        if (globalThis.estado?.sistema?.cambiandoModo) {
            logger.info('Init en curso, omitiendo limpieza agresiva');
            return;
        }
        try {
            // Limpiar globales de la aplicación agresivamente
            // registrarEvento no se borra aquí: es del padre, no de este módulo.
            if (globalThis.estado) delete globalThis.estado;

            logger.info('Limpieza agresiva de globales de la aplicación completada');
        } catch (error) {
            // Logging mínimo durante pagehide para evitar errores
            logger.warn('Error en limpieza agresiva de la aplicación:', error.message);
        }
    });
}

// La coordinación entre hijos no vive en este módulo: la hacen los handlers registrados en el
// script inline de codigo-padre.html (Script 1 — controladores del padre).

// NAVEGACION.RESPUESTA_DATOS_PARADAS no se maneja aqui: lo emite codigo-padre.html y lo
// recibe hijo5 (boton-casa-hijo5.html), con su propio registrarControladorSeguro(). hijo2 no
// recibe ninguna lista (docs/estudio-caminos.md, K-130). El payload real es { paradas, aventura?, timestamp },
// y cada parada tiene la forma que le da normalizarParada() en js/utils.js.

// Hacer funciones disponibles globalmente para compatibilidad con carga como script
// Note: These are assignments to window properties, not parameter reassignments
globalThis.manejarCambioModo = globalThis.manejarCambioModo || manejarCambioModo;
globalThis.actualizarInterfazModo = globalThis.actualizarInterfazModo || actualizarInterfazModo;
