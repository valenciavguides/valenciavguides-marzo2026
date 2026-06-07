// Simple lock implementation for browser compatibility (no async-mutex dependency)
class SimpleMutex {
  constructor() {
    this.lock = Promise.resolve(); // NOSONAR — inicialización intencional del mutex
  }

  async runExclusive(fn) {
    const prevLock = this.lock;
    let resolve;
    this.lock = new Promise(r => resolve = r);
    await prevLock;
    try {
      return await fn();
    } finally {
      resolve();
    }
  }
}

// Mutexes for each flag
const mutexes = {
  heartbeatPrewarmed: new SimpleMutex(),
  procesandoCola: new SimpleMutex(),
  script2Listo: new SimpleMutex(),
  listenerRegistrado: new SimpleMutex(),
  mensajeriaReady: new SimpleMutex(),
  coordenadasCargadas: new SimpleMutex(),
  audiosCargados: new SimpleMutex(),
  retosCargados: new SimpleMutex(),
  estadoPadre: new SimpleMutex(),
  aventuraSeleccionada: new SimpleMutex(),
  idiomaSeleccionado: new SimpleMutex(),
  uiConfirmado: new SimpleMutex(),
  estadoComponenteInicializado: new SimpleMutex(),
  estadoMenuAbierto: new SimpleMutex(),
  controladores: new SimpleMutex(),
  mensajesEnviados: new SimpleMutex(),
  heartbeat: new SimpleMutex(),
  hijosListosPromises: new SimpleMutex(),
};

// Centralized state
const state = {
  heartbeatPrewarmed: false,
  procesandoCola: false,
  script2Listo: false,
  listenerRegistrado: false,
  mensajeriaReady: false,
  coordenadasCargadas: false,
  audiosCargados: false,
  retosCargados: false,
  estadoPadre: {
    hijosInicializados: new Set(),
    modo: { actual: 'casa', anterior: null },
    paradaActual: 0,
    mensajeriaInicializada: false,
    mapaInicializado: false,
    paradas: [],
    inicializacionPromises: new Map(),
    conectado: true,
    todosHijosListos: false,
    gps: {
      activo: false,
      watchId: null,
      posicionUsuario: null,
      permisos: null,
      precision: null,
      error: null,
      ultimaUbicacion: null
    },
    monitoreo: {
      metricas: {
        mensajesEnviados: 0,
        mensajesRecibidos: 0,
        errores: 0,
        tiempoRespuestaPromedio: 0,
        usoMemoria: 0,
        usoCPU: 0
      },
      config: {
        umbralAlerta: {
          usoMemoria: 80,
          usoCPU: 90,
          tiempoRespuesta: 5000
        },
        maxItems: 100
      },
      historial: {
        eventos: [],
        metricas: [],
        errores: []
      }
    },
    sistema: {
      prewarmIniciado: false,
      prewarmPausado: false,
      cambiandoModo: false
    },
    retoActivo: false,
    audioActivo: false,
    ubicacionActiva: false,
    tramoActual: null,
    elementoActual: null,
    siguiendoRuta: false,
    hijosQueRecibieronPadreListo: new Set()
  },
  aventuraSeleccionada: null,
  idiomaSeleccionado: null,
  uiConfirmado: false,
  estadoComponenteInicializado: false,
  estadoMenuAbierto: false,
  controladores: new Map(),
  mensajesEnviados: new Set(),
  heartbeat: {
    activo: false,
    intervalo: null,
    heartbeatsFallidos: new Map(),
    ultimoHeartbeat: new Map(),
    hijosDesconectados: []
  },
  gpsPendientes: [],
  hijosListosPromises: new Map(),
};

// Getters and setters with synchronization

export async function getHeartbeatPrewarmed() {
  return await mutexes.heartbeatPrewarmed.runExclusive(() => state.heartbeatPrewarmed);
}

export async function setHeartbeatPrewarmed(value) {
  await mutexes.heartbeatPrewarmed.runExclusive(() => { state.heartbeatPrewarmed = value; });
}

export async function getProcesandoCola() {
  return await mutexes.procesandoCola.runExclusive(() => state.procesandoCola);
}

export async function setProcesandoCola(value) {
  await mutexes.procesandoCola.runExclusive(() => { state.procesandoCola = value; });
}

export async function getScript2Listo() {
  return await mutexes.script2Listo.runExclusive(() => state.script2Listo);
}

export async function setScript2Listo(value) {
  await mutexes.script2Listo.runExclusive(() => { state.script2Listo = value; });
}

export async function getListenerRegistrado() {
  return await mutexes.listenerRegistrado.runExclusive(() => state.listenerRegistrado);
}

export async function setListenerRegistrado(value) {
  await mutexes.listenerRegistrado.runExclusive(() => { state.listenerRegistrado = value; });
}

export async function getMensajeriaReady() {
  return await mutexes.mensajeriaReady.runExclusive(() => state.mensajeriaReady);
}

export async function setMensajeriaReady(value) {
  await mutexes.mensajeriaReady.runExclusive(() => { state.mensajeriaReady = value; });
}

export async function getCoordenadasCargadas() {
  return await mutexes.coordenadasCargadas.runExclusive(() => state.coordenadasCargadas);
}

export async function setCoordenadasCargadas(value) {
  await mutexes.coordenadasCargadas.runExclusive(() => { state.coordenadasCargadas = value; });
}

export async function getAudiosCargados() {
  return await mutexes.audiosCargados.runExclusive(() => state.audiosCargados);
}

export async function setAudiosCargados(value) {
  await mutexes.audiosCargados.runExclusive(() => { state.audiosCargados = value; });
}

export async function getRetosCargados() {
  return await mutexes.retosCargados.runExclusive(() => state.retosCargados);
}

export async function setRetosCargados(value) {
  await mutexes.retosCargados.runExclusive(() => { state.retosCargados = value; });
}

export async function getHeartbeat() {
  return await mutexes.heartbeat.runExclusive(() => _deepCopy(state.heartbeat));
}

export async function setHeartbeat(value) {
  await mutexes.heartbeat.runExclusive(() => { state.heartbeat = _deepCopy(value); });
}

export async function updateHeartbeat(updates) {
  await mutexes.heartbeat.runExclusive(() => {
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && !(source[key] instanceof Set) && !(source[key] instanceof Map)) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    deepMerge(state.heartbeat, updates);
  });
}

export async function getGpsPendientes() {
  return await mutexes.heartbeat.runExclusive(() => _deepCopy(state.gpsPendientes));
}

export async function setGpsPendientes(value) {
  await mutexes.heartbeat.runExclusive(() => { state.gpsPendientes = _deepCopy(value); });
}

export async function agregarMensajeGPSAPendientes(datos) {
  return await mutexes.heartbeat.runExclusive(() => {
    state.gpsPendientes.push({
      datos: _deepCopy(datos),
      timestamp: Date.now()
    });
    // Limitar a 50 mensajes para evitar memory leak
    if (state.gpsPendientes.length > 50) {
      state.gpsPendientes = state.gpsPendientes.slice(-50);
    }
  });
}

export async function limpiarGpsPendientes() {
  return await mutexes.heartbeat.runExclusive(() => { state.gpsPendientes = []; });
}

// Sistema de eventos para HIJO_LISTO
// Sin mutex: el browser es single-threaded; Map/Set ops son atómicas en este contexto.
export function crearPromiseHijoListo(hijoId) {
  if (state.estadoPadre.hijosInicializados && state.estadoPadre.hijosInicializados.has(hijoId)) {
    return Promise.resolve();
  }
  if (state.hijosListosPromises.has(hijoId)) {
    return state.hijosListosPromises.get(hijoId).promise;
  }
  const entry = {};
  entry.promise = new Promise((resolve, reject) => {
    entry.resolve = resolve;
    entry.timeout = setTimeout(() => {
      state.hijosListosPromises.delete(hijoId);
      reject(new Error(`Timeout esperando HIJO_LISTO de ${hijoId}`));
    }, 30000);
  });
  state.hijosListosPromises.set(hijoId, entry);
  return entry.promise;
}

export function marcarHijoListo(hijoId) {
  if (!state.estadoPadre.hijosInicializados) {
    state.estadoPadre.hijosInicializados = new Set();
  }
  state.estadoPadre.hijosInicializados.add(hijoId);
  const entry = state.hijosListosPromises.get(hijoId);
  if (entry) {
    clearTimeout(entry.timeout);
    state.hijosListosPromises.delete(hijoId);
    entry.resolve();
  }
}

export function cancelarPromiseHijoListo(hijoId) {
  const entry = state.hijosListosPromises.get(hijoId);
  if (entry) {
    clearTimeout(entry.timeout);
    state.hijosListosPromises.delete(hijoId);
    entry.reject(new Error(`Promise cancelada para ${hijoId}`));
  }
}

function _deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Set) return new Set(obj);
  if (obj instanceof Map) return new Map(obj);
  if (Array.isArray(obj)) return obj.map(_deepCopy);
  const copy = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) copy[key] = _deepCopy(obj[key]);
  }
  return copy;
}

export async function getEstadoPadre() {
  return await mutexes.estadoPadre.runExclusive(() => _deepCopy(state.estadoPadre));
}

export async function setEstadoPadre(value) {
  await mutexes.estadoPadre.runExclusive(() => { state.estadoPadre = _deepCopy(value); });
}

export async function updateEstadoPadre(updates) {
  await mutexes.estadoPadre.runExclusive(() => {
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && !(source[key] instanceof Set) && !(source[key] instanceof Map)) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    deepMerge(state.estadoPadre, updates);
  });
}

export async function getAventuraSeleccionada() {
  return await mutexes.aventuraSeleccionada.runExclusive(() => state.aventuraSeleccionada);
}

export async function setAventuraSeleccionada(value) {
  await mutexes.aventuraSeleccionada.runExclusive(() => { state.aventuraSeleccionada = value; });
}

export async function getIdiomaSeleccionado() {
  return await mutexes.idiomaSeleccionado.runExclusive(() => state.idiomaSeleccionado);
}

export async function setIdiomaSeleccionado(value) {
  await mutexes.idiomaSeleccionado.runExclusive(() => { state.idiomaSeleccionado = value; });
}

export async function getUiConfirmado() {
  return await mutexes.uiConfirmado.runExclusive(() => state.uiConfirmado);
}

export async function setUiConfirmado(value) {
  await mutexes.uiConfirmado.runExclusive(() => { state.uiConfirmado = value; });
}

export async function getEstadoComponenteInicializado() {
  return await mutexes.estadoComponenteInicializado.runExclusive(() => state.estadoComponenteInicializado);
}

export async function setEstadoComponenteInicializado(value) {
  await mutexes.estadoComponenteInicializado.runExclusive(() => { state.estadoComponenteInicializado = value; });
}

export async function getEstadoMenuAbierto() {
  return await mutexes.estadoMenuAbierto.runExclusive(() => state.estadoMenuAbierto);
}

export async function setEstadoMenuAbierto(value) {
  await mutexes.estadoMenuAbierto.runExclusive(() => { state.estadoMenuAbierto = value; });
}

// ==================== GENERIC FLAG ACCESSORS ====================

/**
 * Valid flag names that can be accessed via getFlag/setFlag
 * @type {Set<string>}
 */
const VALID_FLAGS = new Set([
  'heartbeatPrewarmed',
  'procesandoCola',
  'script2Listo',
  'listenerRegistrado',
  'mensajeriaReady',
  'coordenadasCargadas',
  'audiosCargados',
  'retosCargados',
  'estadoComponenteInicializado',
  'estadoMenuAbierto',
  'uiConfirmado'
]);

/**
 * Generic getter for state flags
 * @param {string} flagName - Name of the flag to get
 * @returns {Promise<*>} The flag value
 * @throws {Error} If flag name is invalid
 */
export async function getFlag(flagName) {
  if (!VALID_FLAGS.has(flagName)) {
    throw new Error(`Flag inválido: '${flagName}'. Flags válidos: ${Array.from(VALID_FLAGS).join(', ')}`);
  }
  
  const mutex = mutexes[flagName];
  if (!mutex) {
    throw new Error(`No existe mutex para flag: '${flagName}'`);
  }
  
  return await mutex.runExclusive(() => state[flagName]);
}

/**
 * Generic setter for state flags
 * @param {string} flagName - Name of the flag to set
 * @param {*} value - Value to set
 * @returns {Promise<void>}
 * @throws {Error} If flag name is invalid
 */
export async function setFlag(flagName, value) {
  if (!VALID_FLAGS.has(flagName)) {
    throw new Error(`Flag inválido: '${flagName}'. Flags válidos: ${Array.from(VALID_FLAGS).join(', ')}`);
  }
  
  const mutex = mutexes[flagName];
  if (!mutex) {
    throw new Error(`No existe mutex para flag: '${flagName}'`);
  }
  
  await mutex.runExclusive(() => { state[flagName] = value; });
}

// ==================== CENTRALIZED CONTROLLER AND MESSAGE MANAGEMENT ====================

/**
 * Validates a message structure for required fields and types
 * @param {Object} mensaje - The message to validate
 * @returns {boolean} - True if valid, throws error if invalid
 */
export async function validarMensaje(mensaje) {
  if (!mensaje || typeof mensaje !== 'object') {
    throw new Error('Mensaje inválido: debe ser un objeto');
  }

  const requiredFields = ['tipo', 'origen', 'destino'];
  for (const field of requiredFields) {
    if (!mensaje[field]) {
      throw new Error(`Mensaje inválido: falta campo requerido '${field}'`);
    }
  }

  if (typeof mensaje.tipo !== 'string' || mensaje.tipo.trim() === '') {
    throw new Error('Mensaje inválido: tipo debe ser una cadena no vacía');
  }

  if (typeof mensaje.origen !== 'string' || mensaje.origen.trim() === '') {
    throw new Error('Mensaje inválido: origen debe ser una cadena no vacía');
  }

  if (typeof mensaje.destino !== 'string' && mensaje.destino !== 'broadcast') {
    throw new Error('Mensaje inválido: destino debe ser una cadena o "broadcast"');
  }

  const posiblesIds = new Set();
  if (mensaje.mensajeId) posiblesIds.add(mensaje.mensajeId);
  if (mensaje.id) posiblesIds.add(mensaje.id);
  if (mensaje.datos?.mensajeId) posiblesIds.add(mensaje.datos.mensajeId);
  if (mensaje.datos?.id) posiblesIds.add(mensaje.datos.id);

  if (posiblesIds.size > 0) {
    await mutexes.mensajesEnviados.runExclusive(() => {
      for (const id of posiblesIds) {
        if (state.mensajesEnviados.has(id)) {
          throw new Error(`Mensaje duplicado: ID '${id}' ya enviado`);
        }
      }
    });
  }

  return true;
}

/**
 * Registers a controller centrally to prevent duplicates
 * @param {string} controladorId - Unique ID for the controller
 * @param {Function} handler - The handler function
 * @param {Object} opciones - Options like tipoMensaje, origen, etc.
 * @returns {boolean} - True if registered, false if duplicate
 */
function _hashString(s) {
  if (!s) return '0';
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.codePointAt(i);
    h &= 0xffffffff;
  }
  return (h >>> 0).toString(36);
}

export async function registrarControladorCentral(controladorId, handler, opciones = {}) {
  return await mutexes.controladores.runExclusive(() => {
    let handlerSrc = '';
    try { handlerSrc = handler?.toString?.() ?? String(handler); } catch (_e) { handlerSrc = String(handler); } // NOSONAR
    const tipo = opciones?.tipoMensaje ?? '';
    const fingerprint = `${tipo}|${_hashString(handlerSrc)}`;

    for (const [id, c] of state.controladores) {
      try {
        if (!c?.handler) continue;
        const existingSrc = c.handler?.toString?.() ?? String(c.handler);
        const existingTipo = c.opciones?.tipoMensaje ?? '';
        const existingFingerprint = `${existingTipo}|${_hashString(existingSrc)}`;
        if (existingFingerprint === fingerprint) {
          console.debug(`[STATE-MGR] Controlador lógicamente duplicado detectado (fingerprint). Skipping registration for '${controladorId}' (matches '${id}')`);
          return false;
        }
      } catch (_e) {} // NOSONAR
    }

    if (state.controladores.has(controladorId)) {
      console.debug(`Controlador duplicado: '${controladorId}' ya registrado`);
      return false;
    }

    state.controladores.set(controladorId, {
      handler,
      opciones,
      registradoEn: Date.now(),
      activo: true,
      fingerprint
    });

    try {
      console.debug(`[STATE-MGR] Controlador registrado: '${controladorId}' tipo='${tipo || 'any'}' total=${state.controladores.size}`);
    } catch (_e) {} // NOSONAR

    return true;
  });
}

/**
 * Sends a message centrally, validating and tracking it
 * @param {Object} mensaje - The message to send
 * @returns {Promise<Object>} - Result of sending
 */
async function _enviarAControladores(mensaje, resultados) {
  // Recopilar handlers dentro del lock (solo lectura, sin await) para evitar deadlock:
  // si el handler despacha otro mensaje que intenta adquirir este mismo mutex, deadlock.
  const handlersToRun = await mutexes.controladores.runExclusive(() => {
    const matching = [];
    for (const [id, controlador] of state.controladores) {
      if (!controlador.activo) continue;
      const { opciones } = controlador;
      const matchesTipo = !opciones.tipoMensaje || mensaje.tipo === opciones.tipoMensaje;
      const matchesOrigen = !opciones.origen || mensaje.origen === opciones.origen;
      const matchesDestino = mensaje.destino === 'broadcast' || mensaje.destino === opciones.destino || !opciones.destino;
      if (matchesTipo && matchesOrigen && matchesDestino) {
        matching.push({ id, handler: controlador.handler });
      }
    }
    return matching;
  });

  // Ejecutar handlers fuera del lock
  for (const { id, handler } of handlersToRun) {
    try {
      const resultado = await handler(mensaje);
      resultados.push({ controladorId: id, exito: true, resultado });
    } catch (error) {
      console.error(`Error en controlador '${id}':`, error);
      resultados.push({ controladorId: id, exito: false, error: error.message });
    }
  }
}

function _broadcastAIframes(mensaje, resultados) {
  const origenSeguro = globalThis.location.origin || '*';
  const iframes = Array.from(document.getElementsByTagName('iframe'));
  let enviados = 0;
  for (const iframe of iframes) {
    try {
      if (iframe?.contentWindow) { iframe.contentWindow.postMessage(mensaje, origenSeguro); enviados++; }
    } catch (err) { console.warn('[STATE-MGR] Error enviando broadcast a iframe:', err?.message); }
  }
  resultados.push({ metodo: 'broadcast', exito: true, enviados });
}

function _reenviarAlPadre(mensaje, resultados) {
  try {
    if (globalThis.parent.mensajeria && typeof globalThis.parent.mensajeria.enviarMensaje === 'function') {
      globalThis.parent.mensajeria.enviarMensaje(mensaje);
      resultados.push({ metodo: 'parent_mensajeria', exito: true });
    } else {
      globalThis.parent.postMessage(mensaje, globalThis.location.origin);
      resultados.push({ metodo: 'forwardToParent', exito: true });
    }
  } catch (err) {
    console.warn('[STATE-MGR] Error forward broadcast to parent:', err?.message);
    resultados.push({ metodo: 'forwardToParent', exito: false, error: err?.message });
  }
}

function _enviarBroadcast(mensaje, resultados) {
  if (globalThis.parent === globalThis.window) {
    _broadcastAIframes(mensaje, resultados);
  } else if (globalThis.parent && typeof globalThis.parent.postMessage === 'function') {
    _reenviarAlPadre(mensaje, resultados);
  }
}

async function _enviarFallback(mensaje, resultados) {
  try {
    if (mensaje.destino === 'broadcast' && globalThis.window !== undefined) {
      _enviarBroadcast(mensaje, resultados);
    } else if (globalThis.postMessage) {
      try {
        globalThis.postMessage(mensaje, globalThis.location.origin);
        resultados.push({ metodo: 'postMessage', exito: true });
      } catch (error) {
        console.error('Error enviando mensaje via postMessage:', error);
        resultados.push({ metodo: 'postMessage', exito: false, error: error.message });
      }
    }
  } catch (error) {
    console.error('Error en fallback de envio en state-manager:', error);
    resultados.push({ metodo: 'fallback', exito: false, error: error.message });
  }
}

export async function enviarMensajeCentral(mensaje) {
  if (!mensaje.mensajeId) {
    mensaje.mensajeId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
  await validarMensaje(mensaje); // NOSONAR
  await mutexes.mensajesEnviados.runExclusive(() => {
    state.mensajesEnviados.add(mensaje.mensajeId);
    try { console.debug(`[STATE-MGR] Mensaje registrado: ${mensaje.mensajeId} (tipo=${mensaje.tipo}) totalMensajes=${state.mensajesEnviados.size}`); } catch (_e) {} // NOSONAR
  });
  const resultados = [];
  await _enviarAControladores(mensaje, resultados);
  if (resultados.length === 0) await _enviarFallback(mensaje, resultados);
  return { mensajeId: mensaje.mensajeId, resultados, timestamp: Date.now() };
}

/**
 * Gets the list of registered controllers (for debugging)
 * @returns {Array} - List of controller IDs
 */
export async function getControladoresRegistrados() {
  return await mutexes.controladores.runExclusive(() => 
    Array.from(state.controladores.keys())
  );
}

/**
 * Returns controller entries that match a given tipo (tipoMensaje) or that have no tipo filter
 * @param {string} tipo
 * @returns {Array<Object>} - [{ id, handler, opciones }]
 */
export async function getControladoresPorTipo(tipo) {
  return await mutexes.controladores.runExclusive(() => {
    const results = [];
    for (const [id, c] of state.controladores) {
      if (!c?.activo) continue;
      const tipoCfg = c.opciones?.tipoMensaje;
      if (!tipoCfg || tipoCfg === tipo) {
        results.push({ id, handler: c.handler, opciones: c.opciones });
      }
    }
    return results;
  });
}

/**
 * Returns a Map of type -> handler for compatibility with mensajeria.js
 * This transforms the internal controladores structure into a Map<tipo, handler>
 * @returns {Promise<Map>} - Map of tipo -> handler
 */
export async function getMapaControladores() {
  return await mutexes.controladores.runExclusive(() => {
    const mapa = new Map();
    for (const [, c] of state.controladores) {
      if (!c?.activo) continue;
      const tipo = c.opciones?.tipoMensaje;
      if (tipo && !mapa.has(tipo)) {
        mapa.set(tipo, c.handler);
      }
    }
    return mapa;
  });
}

/**
 * Versión SÍNCRONA de getMapaControladores para compatibilidad con mensajeria.js
 * NOTA: Esta versión no usa mutex, es para uso en handlers síncronos
 * @returns {Map} - Map of tipo -> handler
 */
export function getMapaControladoresSync() {
  const mapa = new Map();
  for (const [, c] of state.controladores) {
    if (!c?.activo) continue;
    const tipo = c.opciones?.tipoMensaje;
    if (tipo && !mapa.has(tipo)) {
      mapa.set(tipo, c.handler);
    }
  }
  return mapa;
}

/**
 * Removes a controller from the registry
 * @param {string} controladorId - ID to remove
 * @returns {boolean} - True if removed
 */
export async function removerControladorCentral(controladorId) {
  return await mutexes.controladores.runExclusive(() => {
    const removed = state.controladores.delete(controladorId);
    if (removed) {
      console.log(`Controlador removido: '${controladorId}'`);
    }
    return removed;
  });
}

// Proxy for globalThis.estadoPadre to synchronize access
export function createEstadoPadreProxy() {
  if (globalThis.window === undefined || !globalThis.estadoPadre) {
    console.warn('globalThis.estadoPadre not available for proxy');
    return;
  }

  setEstadoPadre(globalThis.estadoPadre).catch(err => console.error('Error setting initial estadoPadre:', err));
  console.log('estadoPadre proxy setup completed (minimal intervention)');
}

// Initialize the state manager
export async function inicializarStateManager() {
  console.log('✅ [STATE-MANAGER] Inicializado correctamente');
  
  if (globalThis.window !== undefined) {
    // Objeto API completo del state-manager
    const stateManagerAPI = {
      // Funciones de controladores
      registrarControladorCentral,
      registrarManejador: registrarControladorCentral, // Alias para compatibilidad con mensajeria.js
      getControladoresRegistrados,
      getControladoresPorTipo,
      getMapaControladores,
      getMapaControladoresSync,
      getManejadores: getMapaControladoresSync, // Alias SÍNCRONO para compatibilidad con mensajeria.js
      removerControladorCentral,
      limpiarControladoresAntiguos,
      
      // Funciones de mensajes
      enviarMensajeCentral,
      validarMensaje,
      limpiarMensajesAntiguos,
      
      // Funciones de estado
      getEstadoPadre,
      setEstadoPadre,
      updateEstadoPadre,
      getFlag,
      setFlag,
      getHeartbeat,
      setHeartbeat,
      updateHeartbeat,
      getGpsPendientes,
      setGpsPendientes,
      agregarMensajeGPSAPendientes,
      limpiarGpsPendientes,

      // Sistema de eventos para HIJO_LISTO
      crearPromiseHijoListo,
      marcarHijoListo,
      cancelarPromiseHijoListo,

      // Diagnóstico
      diagnosticar: diagnosticarStateManager,
      diagnosticarStateManager,
      
      // Utilidad
      getEstado: () => ({
        controladores: state.controladores.size,
        mensajesEnviados: state.mensajesEnviados.size,
        estadoPadre: state.estadoPadre,
        flags: {
          heartbeatPrewarmed: state.heartbeatPrewarmed,
          procesandoCola: state.procesandoCola,
          script2Listo: state.script2Listo,
          listenerRegistrado: state.listenerRegistrado,
          mensajeriaReady: state.mensajeriaReady
        }
      })
    };
    
    // Exponer en ambos nombres para compatibilidad
    globalThis.__stateManager = stateManagerAPI;
    globalThis.__vv_stateManager = stateManagerAPI; // Nombre esperado por mensajeria.js
    
    console.log('[STATE-MANAGER] API expuesta en globalThis.__stateManager y globalThis.__vv_stateManager');
  }

  setInterval(() => limpiarMensajesAntiguos(500), 60000);
}

/**
 * Función de diagnóstico para verificar el estado del state-manager
 * @returns {Object} Información de diagnóstico
 */
export async function diagnosticarStateManager() {
  const controladores = await getControladoresRegistrados(); // NOSONAR
  const controladoresPorTipo = new Map();
  
  await mutexes.controladores.runExclusive(() => {
    for (const [id, c] of state.controladores) {
      const tipo = c.opciones?.tipoMensaje || 'sin-tipo';
      if (!controladoresPorTipo.has(tipo)) {
        controladoresPorTipo.set(tipo, []);
      }
      controladoresPorTipo.get(tipo).push({ id, activo: c.activo, registradoEn: c.registradoEn });
    }
  });

  const diagnostico = {
    timestamp: new Date().toISOString(),
    totalControladores: controladores.length,
    totalMensajesTrackeados: state.mensajesEnviados.size,
    controladoresRegistrados: controladores,
    controladoresPorTipo: Object.fromEntries(controladoresPorTipo),
    flags: {
      heartbeatPrewarmed: state.heartbeatPrewarmed,
      procesandoCola: state.procesandoCola,
      script2Listo: state.script2Listo,
      listenerRegistrado: state.listenerRegistrado,
      mensajeriaReady: state.mensajeriaReady,
      coordenadasCargadas: state.coordenadasCargadas,
      audiosCargados: state.audiosCargados,
      retosCargados: state.retosCargados
    },
    estadoPadre: {
      modo: state.estadoPadre.modo,
      hijosInicializados: Array.from(state.estadoPadre.hijosInicializados || []),
      todosHijosListos: state.estadoPadre.todosHijosListos,
      gps: (globalThis.window !== undefined && globalThis.estadoPadre?.gps) || state.estadoPadre.gps
    }
  };

  console.info('[STATE-MANAGER] Diagnóstico:', diagnostico);
  return diagnostico;
}

/**
 * Limpia controladores inactivos o antiguos
 * @param {number} maxAgeMs - Edad máxima en ms (default: 30 minutos)
 * @returns {number} - Cantidad de controladores limpiados
 */
export async function limpiarControladoresAntiguos(maxAgeMs = 30 * 60 * 1000) {
  const ahora = Date.now();
  let limpiados = 0;

  await mutexes.controladores.runExclusive(() => {
    const aEliminar = [];
    for (const [id, c] of state.controladores) {
      if (!c.activo || (ahora - c.registradoEn > maxAgeMs && !c.opciones?.permanente)) {
        aEliminar.push(id);
      }
    }
    for (const id of aEliminar) {
      state.controladores.delete(id);
      limpiados++;
    }
  });

  if (limpiados > 0) {
    console.log(`[STATE-MANAGER] Limpiados ${limpiados} controladores antiguos/inactivos`);
  }
  return limpiados;
}

/**
 * Limpia mensajes trackeados antiguos para liberar memoria
 * @param {number} maxItems - Máximo de mensajes a mantener
 * @returns {number} - Cantidad de mensajes limpiados
 */
export async function limpiarMensajesAntiguos(maxItems = 1000) {
  let limpiados = 0;

  await mutexes.mensajesEnviados.runExclusive(() => {
    if (state.mensajesEnviados.size > maxItems) {
      const exceso = state.mensajesEnviados.size - maxItems;
      const items = Array.from(state.mensajesEnviados);
      for (let i = 0; i < exceso; i++) {
        state.mensajesEnviados.delete(items[i]);
        limpiados++;
      }
    }
  });

  if (limpiados > 0) {
    console.log(`[STATE-MANAGER] Limpiados ${limpiados} mensajes antiguos`);
  }
  return limpiados;
}