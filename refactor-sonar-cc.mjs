/**
 * refactor-sonar-cc.mjs — v2
 * Uses indexOf + brace-depth tracking for large block replacements,
 * exact string matching only for small/stable chunks.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './En-busca-del-tesoro.html';
let src = readFileSync(FILE, 'utf8');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function replaceExact(oldStr, newStr, label) {
  if (!src.includes(oldStr)) {
    console.error(`[FAIL] "${label}" — old string not found`);
    process.exit(1);
  }
  src = src.replace(oldStr, newStr);
  console.log(`[OK]  ${label}`);
}

// Find end of JS block starting at `startIdx` (the '{' of the outermost block)
function findBlockEnd(text, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return text.length;
}

function replaceFunction(markerStr, newCode, label) {
  const idx = src.indexOf(markerStr);
  if (idx === -1) {
    console.error(`[FAIL] "${label}" — marker not found: ${markerStr.slice(0, 60)}`);
    process.exit(1);
  }
  // find the opening brace of the function
  const braceIdx = src.indexOf('{', idx);
  if (braceIdx === -1) { console.error(`[FAIL] "${label}" — no opening brace`); process.exit(1); }
  // find where the whole block ends
  const endIdx = findBlockEnd(src, braceIdx);
  src = src.slice(0, idx) + newCode + src.slice(endIdx);
  console.log(`[OK]  ${label}`);
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. MODULE SCRIPT — registrarControladorSeguro: add helpers + simplify
//    (was already applied in first run — re-apply only if not already done)
// ══════════════════════════════════════════════════════════════════════════════

if (src.includes('async function _registrarCentral(')) {
  console.log('[SKIP] _registrarCentral already added');
} else {
  replaceExact(
    `    // Wrapper seguro para evitar doble registro de controladores en hijos\n    if (typeof window !== 'undefined' && typeof globalThis.registrarControladorSeguro === 'undefined') {`,
    `    async function _registrarCentral(tipo, controladorId, handler) {
        if (!globalThis.messagingAdapter || typeof globalThis.messagingAdapter.registrarControladorCentral !== 'function') { return null; }
        try {
            const res = await globalThis.messagingAdapter.registrarControladorCentral(controladorId, handler, { tipoMensaje: tipo });
            if (res === true) {
                logger.info(\`[HIJO] registrarControlador registered centrally: \${controladorId} -> \${tipo}\`);
                return true;
            }
        } catch (e) {
            logger.warn(\`[HIJO] Central registrar failed for \${tipo}: \${e && e.message}\`);
        }
        return null;
    }

    async function _registrarLocal(tipo, handler, opciones) {
        if (typeof registrarControlador !== 'function') { return null; }
        try {
            const res = await safeRegistrar(tipo, handler, opciones);
            logger.info(\`[HIJO] registrarControlador delegated to mensajeria for \${tipo}\`);
            return res;
        } catch (err) {
            logger.warn(\`[HIJO] registrarControlador failed for \${tipo}: \${err && err.message}\`);
            return null;
        }
    }

    // Wrapper seguro para evitar doble registro de controladores en hijos
    if (typeof window !== 'undefined' && typeof globalThis.registrarControladorSeguro === 'undefined') {`,
    'Add _registrarCentral/_registrarLocal'
  );

  // Simplify registrarControladorSeguro: remove nested try/catch
  replaceExact(
    `                globalThis.__CONTROLADOR_REGISTRADOS.add(tipo);
                // Prefer central registration via messagingAdapter/state-manager when available
                try {
                    const iframeId = (globalThis.name || (typeof CONFIG_HIJO !== 'undefined' && CONFIG_HIJO.IFRAME_ID) || 'hijo');
                    const controladorId = \`\${iframeId}:\${tipo}\`;
                    if (globalThis.messagingAdapter && typeof globalThis.messagingAdapter.registrarControladorCentral === 'function') {
                        try {
                            const centralRes = await globalThis.messagingAdapter.registrarControladorCentral(controladorId, handler, { tipoMensaje: tipo });
                            if (centralRes === true) {
                                logger.info(\`[HIJO] registrarControlador registered centrally: \${controladorId} -> \${tipo}\`);
                                return true;
                            }
                        } catch (e) {
                            logger.warn(\`[HIJO] Central registrar failed for \${tipo}: \${e && e.message}\`);
                        }
                    }
                    if (typeof registrarControlador === 'function') {
                        try {
                            const res = await safeRegistrar(tipo, handler, opciones);
                            logger.info(\`[HIJO] registrarControlador delegated to mensajeria for \${tipo}\`);
                            return res;
                        } catch (err) {
                            logger.warn(\`[HIJO] registrarControlador failed for \${tipo}: \${err && err.message}\`);
                        }
                    }
                } catch (e) {
                    logger.warn(\`[HIJO] registrarControladorSeguro central attempt error for \${tipo}: \${e && e.message}\`);
                }
                logger.info(\`[HIJO] Handler queued for migration: \${tipo} (local queue)\`);
                return;`,
    `                globalThis.__CONTROLADOR_REGISTRADOS.add(tipo);
                const iframeId = globalThis.name || (typeof CONFIG_HIJO !== 'undefined' && CONFIG_HIJO.IFRAME_ID) || 'hijo';
                const controladorId = \`\${iframeId}:\${tipo}\`;
                const centralRes = await _registrarCentral(tipo, controladorId, handler);
                if (centralRes === true) { return true; }
                const localRes = await _registrarLocal(tipo, handler, opciones);
                if (localRes !== null) { return localRes; }
                logger.info(\`[HIJO] Handler queued for migration: \${tipo} (local queue)\`);`,
    'Simplify registrarControladorSeguro body'
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. MODULE SCRIPT — registrarControladores: extract handlers
// ══════════════════════════════════════════════════════════════════════════════

if (src.includes('async function _onPadreDatos(')) {
  console.log('[SKIP] named handlers already extracted');
} else {
  // Insert named handler functions BEFORE the registrarControladores function
  const REG_CTRL_MARKER = '    // ============================================================\n    // REGISTRO DE CONTROLADORES\n    // ============================================================\n    /**\n     * Registra todos los controladores de mensajes\n     */\n    function registrarControladores()';
  const insertIdx = src.indexOf(REG_CTRL_MARKER);
  if (insertIdx === -1) { console.error('[FAIL] registrarControladores marker not found'); process.exit(1); }

  const HANDLER_FUNCTIONS = `    // ============================================================
    // HANDLERS DE CONTROLADORES (funciones nombradas para reducir CC)
    // ============================================================

    async function _enviarHijoListo(logPrefix) {
        try {
            await enviarMensaje({
                destino: getPadreId(),
                tipo: TIPOS_MENSAJE.SISTEMA.HIJO_LISTO,
                origen: CONFIG_HIJO.IFRAME_ID,
                datos: { componenteId: CONFIG_HIJO.COMPONENTE_ID, capacidades: ['seleccion', 'idioma', 'aventura'], timestamp: Date.now() }
            });
            estadoComponente.hijoListoEnviado = true;
            logger.info(\`\${logPrefix} HIJO_LISTO enviado al padre\`);
        } catch (error) {
            logger.error(\`\${logPrefix} Error enviando HIJO_LISTO:\`, error);
        }
    }

    async function _onPadreDatos(mensaje) {
        const controladorPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[PADRE_DATOS]\`;
        try {
            if (!mensaje || !mensaje.origen) {
                logger.error(\`\${controladorPrefix} Mensaje sin origen válido\`, mensaje);
                return;
            }
            logger.info(\`\${controladorPrefix} Datos del padre recibidos desde \${mensaje.origen}\`);
            const modo = mensaje.datos?.modo;
            const paradaActual = mensaje.datos?.paradaActual;
            if (modo) { logger.debug(\`\${controladorPrefix} Modo inicial: \${modo}\`); }
            if (paradaActual) { logger.debug(\`\${controladorPrefix} Parada actual: \${paradaActual}\`); }
            if (estadoComponente.hijoListoEnviado) {
                logger.debug(\`\${controladorPrefix} HIJO_LISTO ya enviado previamente, omitiendo duplicado\`);
                return;
            }
            await _enviarHijoListo(controladorPrefix);
        } catch (error) {
            logger.error(\`\${controladorPrefix} Error procesando PADRE_DATOS:\`, error);
        }
    }

    function _activarUI(logPrefix) {
        try {
            if (typeof inicializarLogicaSeleccion === 'function') { inicializarLogicaSeleccion(); }
        } catch (e) {
            logger.warn(\`\${logPrefix} inicializarLogicaSeleccion falló:\`, e);
        }
        globalThis._uiConfirmado = true;
        mostrarUI();
        enviarMensaje({ destino: getPadreId(), tipo: TIPOS_MENSAJE.SISTEMA.CONFIRMACION, origen: CONFIG_HIJO.IFRAME_ID, datos: { tipo: 'UI_VISIBLE', timestamp: Date.now() } }).catch(() => {});
    }

    async function _notificarErrorPadre(logPrefix, controlador, error) {
        try {
            await enviarMensaje({
                destino: getPadreId(),
                tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
                origen: CONFIG_HIJO.IFRAME_ID,
                datos: { error: error.message, controlador, timestamp: Date.now() }
            });
        } catch (notifyError) {
            logger.error(\`\${logPrefix} Error notificando al padre:\`, notifyError);
        }
    }

    async function _onPadreConfirmaHijoListo(mensaje) {
        const controladorPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[PADRE_CONFIRMA_HIJO_LISTO]\`;
        try {
            logger.debug(\`\${CONFIG_HIJO.IFRAME_ID} PADRE_CONFIRMA_HIJO_LISTO recibido:\`, mensaje);
            if (!mensaje || !mensaje.origen) {
                logger.error(\`\${controladorPrefix} Mensaje sin origen válido\`, mensaje);
                throw new Error('Mensaje sin origen válido');
            }
            logger.info(\`\${controladorPrefix} Confirmación recibida del padre - controladores listos\`);
            const modoInicial = mensaje.datos?.modoInicial;
            if (modoInicial) {
                logger.debug(\`\${controladorPrefix} Modo inicial recibido: \${modoInicial} (registrado para consistencia)\`);
            }
            _activarUI(controladorPrefix);
            return { exito: true, estado: 'confirmado', timestamp: Date.now() };
        } catch (error) {
            logger.error(\`\${controladorPrefix} Error en controlador:\`, error);
            await _notificarErrorPadre(controladorPrefix, 'PADRE_CONFIRMA_HIJO_LISTO', error);
            return { exito: false, error: error.message };
        }
    }

    async function _onHeartbeat(mensaje) {
        const controladorPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[HEARTBEAT]\`;
        try {
            if (!mensaje || !mensaje.origen) {
                logger.error(\`\${controladorPrefix} Mensaje sin origen válido\`, mensaje);
                return { exito: false, error: 'Sin origen' };
            }
            const datosRespuesta = {
                timestamp: Date.now(), componente: CONFIG_HIJO.COMPONENTE_ID, estado: 'activo',
                inicializado: estadoComponente.inicializado, padreConectado: estadoComponente.padreConectado,
                idiomaSeleccionado: estadoComponente.idiomaSeleccionado, aventuraSeleccionada: estadoComponente.aventuraSeleccionada,
                terminosAceptados: estadoComponente.terminosAceptados, ultimaInteraccion: estadoComponente.ultimaInteraccion
            };
            await enviarMensaje({ destino: mensaje.origen, tipo: TIPOS_MENSAJE.SISTEMA.HEARTBEAT_RESPONSE, origen: CONFIG_HIJO.IFRAME_ID, datos: datosRespuesta });
            logger.debug(\`\${controladorPrefix} Respuesta enviada a \${mensaje.origen}\`);
            return { exito: true, timestamp: datosRespuesta.timestamp };
        } catch (error) {
            logger.error(\`\${controladorPrefix} Error en controlador:\`, error);
            return { exito: false, error: error.message };
        }
    }

    async function _onAck(mensaje) {
        const controladorPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[ACK]\`;
        try {
            if (!mensaje || !mensaje.origen) {
                logger.error(\`\${controladorPrefix} Mensaje sin origen válido\`, mensaje);
                return { exito: false, error: 'Sin origen' };
            }
            logger.debug(\`\${controladorPrefix} ACK recibido, respondiendo...\`);
            const datosRespuesta = {
                componenteId: CONFIG_HIJO.COMPONENTE_ID, timestamp: Date.now(),
                estado: 'activo', inicializado: estadoComponente.inicializado, padreConectado: estadoComponente.padreConectado
            };
            await enviarMensaje({ destino: getPadreId(), tipo: TIPOS_MENSAJE.SISTEMA.ACK, origen: CONFIG_HIJO.IFRAME_ID, datos: datosRespuesta });
            logger.debug(\`\${controladorPrefix} ACK respondido\`);
            return { exito: true, timestamp: datosRespuesta.timestamp };
        } catch (error) {
            logger.error(\`\${controladorPrefix} Error respondiendo ACK:\`, error);
            return { exito: false, error: error.message };
        }
    }

    async function _onCambioModo(mensaje) {
        const logPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[CAMBIO_MODO]\`;
        try {
            if (!mensaje.datos?.secuenciaCompleta) {
                logger.warn(\`\${logPrefix} Mensaje recibido antes de secuencia completa\`);
                await enviarMensaje({ tipo: TIPOS_MENSAJE.SISTEMA.NACK, origen: CONFIG_HIJO.IFRAME_ID, destino: mensaje.origen, datos: { error: 'Secuencia no completa', esperarPermiso: true, tipoOriginal: mensaje.tipo, modoSolicitado: mensaje.datos?.modo } });
                return;
            }
            const { modo } = mensaje.datos || {};
            if (!modo || !['casa', 'aventura'].includes(modo)) {
                logger.error(\`\${logPrefix} Modo inválido: \${modo}\`);
                await enviarMensaje({ tipo: TIPOS_MENSAJE.SISTEMA.NACK, origen: CONFIG_HIJO.IFRAME_ID, destino: mensaje.origen, datos: { error: 'Modo inválido', modoRecibido: modo } });
                return;
            }
            logger.info(\`\${logPrefix} Cambio de modo a "\${modo}" entendido (componente de selección)\`);
            await enviarMensaje({ destino: mensaje.origen, tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_ENTENDIDO, origen: CONFIG_HIJO.IFRAME_ID, datos: { modo, timestamp: Date.now(), mensajeId: mensaje.datos?.mensajeId || mensaje.id } });
            logger.info(\`\${logPrefix} Cambio de modo a "\${modo}" efectuado (componente de selección)\`);
            await enviarMensaje({ destino: mensaje.origen, tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_EFECTUADO, origen: CONFIG_HIJO.IFRAME_ID, datos: { modo, exito: true, timestamp: Date.now(), mensajeId: mensaje.datos?.mensajeId || mensaje.id } });
            return { exito: true };
        } catch (error) {
            logger.error(\`\${logPrefix} Error:\`, error);
            try {
                await enviarMensaje({ tipo: TIPOS_MENSAJE.SISTEMA.ERROR, origen: CONFIG_HIJO.IFRAME_ID, destino: mensaje.origen || 'padre', datos: { error: error.message, tipo: 'CAMBIO_MODO_FALLIDO' } });
            } catch (e) {
                logger.error(\`\${logPrefix} Error notificando fallo:\`, e);
            }
            return { exito: false, error: error.message };
        }
    }

    async function _onCambioModoAplicado(mensaje) {
        const logPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[CAMBIO_MODO_APLICADO]\`;
        try {
            const { modo } = mensaje.datos || {};
            logger.success(\`\${logPrefix} ✅ Cambio de modo a "\${modo}" aplicado globalmente\`);
        } catch (error) {
            logger.error(\`\${logPrefix} Error:\`, error);
        }
    }

`;

  src = src.slice(0, insertIdx) + HANDLER_FUNCTIONS + src.slice(insertIdx);
  console.log('[OK]  Insert named handler functions');
}

// Now replace function body of registrarControladores
if (src.includes('registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.PADRE_DATOS, async (mensaje) =>')) {
  replaceFunction(
    '    function registrarControladores() {',
    `    function registrarControladores() {
        const logPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[registrarControladores]\`;
        try {
            logger.debug(\`\${logPrefix} Registrando controladores...\`);
            registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.PADRE_DATOS, _onPadreDatos);
            registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.PADRE_CONFIRMA_HIJO_LISTO, _onPadreConfirmaHijoListo);
            registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.HEARTBEAT, _onHeartbeat);
            registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.ACK, _onAck);
            registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO, _onCambioModo);
            registrarControladorSeguro(TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_APLICADO, _onCambioModoAplicado);
            logger.info(\`\${logPrefix} Controladores registrados exitosamente\`);
        } catch (error) {
            logger.error(\`\${logPrefix} Error registrando controladores:\`, error);
            throw error;
        }
    }`,
    'registrarControladores body → named handlers'
  );
} else {
  console.log('[SKIP] registrarControladores already refactored');
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. MODULE SCRIPT — init: extract helpers
// ══════════════════════════════════════════════════════════════════════════════

if (src.includes('async function _esperarPadre(')) {
  console.log('[SKIP] init helpers already added');
} else {
  // Find init function and replace with helper extraction
  const INIT_MARKER = '    // ============================================================\n    // FUNCIÓN DE INICIALIZACIÓN PRINCIPAL\n    // ============================================================';
  const initCommentIdx = src.indexOf(INIT_MARKER);
  if (initCommentIdx === -1) { console.error('[FAIL] init section marker not found'); process.exit(1); }

  // Find the async function init() { block
  const initFnIdx = src.indexOf('    async function init() {', initCommentIdx);
  if (initFnIdx === -1) { console.error('[FAIL] async function init() { not found'); process.exit(1); }

  const initBraceIdx = src.indexOf('{', initFnIdx);
  const initEndIdx = findBlockEnd(src, initBraceIdx);

  const NEW_INIT = `    async function _esperarPadre(logPrefix) {
        if (!globalThis.parent || globalThis.parent === window) { return; }
        logger.debug(\`\${logPrefix} Esperando a que el padre esté listo...\`);
        let attempts = 0;
        const maxAttempts = CONFIG_HIJO.TIMEOUT_PARENT / 100;
        while (attempts < maxAttempts && (!globalThis.parent.postMessage || typeof globalThis.parent.postMessage !== 'function')) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        if (attempts >= maxAttempts) {
            logger.warn(\`\${logPrefix} Padre no listo después de \${CONFIG_HIJO.TIMEOUT_PARENT}ms\`);
        } else {
            estadoComponente.padreConectado = true;
            logger.info(\`\${logPrefix} Padre listo después de \${attempts * 100}ms\`);
        }
    }

    async function _enviarHijoPreparado(logPrefix) {
        try {
            await enviarMensaje({
                destino: getPadreId(),
                tipo: TIPOS_MENSAJE.SISTEMA.HIJO_PREPARADO,
                origen: CONFIG_HIJO.IFRAME_ID,
                datos: { version: CONFIG_HIJO.VERSION, capacidades: ['seleccion', 'idioma', 'aventura'], timestamp: Date.now() }
            });
            logger.info(\`\${logPrefix} HIJO_PREPARADO enviado al padre\`);
        } catch (error) {
            logger.error(\`\${logPrefix} Error enviando HIJO_PREPARADO:\`, error);
        }
    }

    async function _enviarHijoFallido(logPrefix, error) {
        try {
            await enviarMensaje({
                destino: getPadreId(),
                tipo: TIPOS_MENSAJE.SISTEMA.HIJO_FALLIDO,
                origen: CONFIG_HIJO.IFRAME_ID,
                datos: { error: error.message, stack: error.stack, timestamp: Date.now() }
            });
        } catch (notifyError) {
            logger.error(\`\${logPrefix} Error notificando fallo al padre:\`, notifyError);
        }
    }

    async function init() {
        const logPrefix = \`\${CONFIG_HIJO.LOG_PREFIX}[init]\`;
        try {
            logger.info(\`\${logPrefix} Iniciando componente...\`);
            await _esperarPadre(logPrefix);
            // NOTA: seleccion es la pantalla inicial - UI visible inmediatamente
            globalThis._uiConfirmado = true;
            _originalDisplay = (document.body && document.body.style && document.body.style.display) || '';
            registrarControladores();
            estadoComponente.inicializado = true;
            logger.info(\`\${logPrefix} Componente inicializado correctamente\`);
            await _enviarHijoPreparado(logPrefix);
        } catch (error) {
            logger.error(\`\${logPrefix} Error crítico durante inicialización:\`, error);
            await _enviarHijoFallido(logPrefix, error);
        }
    }`;

  src = src.slice(0, initFnIdx) + NEW_INIT + src.slice(initEndIdx);
  console.log('[OK]  init + _esperarPadre/_enviarHijoPreparado/_enviarHijoFallido');
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. REGULAR SCRIPT — cargarAventurasDinamicamente: extract forEach callback
// ══════════════════════════════════════════════════════════════════════════════

if (src.includes('function _crearBotonAventura(')) {
  console.log('[SKIP] _crearBotonAventura already added');
} else {
  const CARGA_MARKER = '    async function cargarAventurasDinamicamente() {';
  const cargaIdx = src.indexOf(CARGA_MARKER);
  if (cargaIdx === -1) { console.error('[FAIL] cargarAventurasDinamicamente not found'); process.exit(1); }

  const HELPER_BOTON = `    function _crearBotonAventura(aventura, idioma, contenedor) {
      const disponibleEnIdioma = aventura.idiomas[idioma]?.disponible;
      const estaDisponible = aventura.disponible && disponibleEnIdioma;
      const boton = document.createElement('button');
      boton.className = 'btn';
      boton.style.width = '100%';
      const tiempoHoras = aventura.tiempoEstimado ? Math.round(aventura.tiempoEstimado / 60) : 0;
      const vehiculo = aventura.vehiculo || '';
      const distancia = aventura.distanciaKm ? \`±\${aventura.distanciaKm}km\` : '';
      const stats = \`\${vehiculo}\${distancia} <span class="aventura-stat-emoji">🏛️</span>\${aventura.totalMonumentos || 0} <span class="aventura-stat-emoji">📍</span>\${aventura.totalParadas || 0} <span class="aventura-stat-emoji">🧩</span>\${aventura.totalRetos || 0} <span class="aventura-stat-emoji">⏳</span>max\${tiempoHoras}h\`;
      if (estaDisponible) {
        boton.onclick = () => seleccionarAventura(aventura.id);
        boton.innerHTML = \`<span class="aventura-titulo">\${aventura.nombre}</span><span class="aventura-stats">\${stats}</span>\`;
      } else {
        boton.disabled = true;
        boton.innerHTML = \`<span class="aventura-titulo" style="opacity:0.5;">\${aventura.nombre}</span><span class="aventura-stats">\${stats}</span>\`;
      }
      boton.style.flexDirection = 'column';
      boton.style.alignItems = 'center';
      boton.style.justifyContent = 'center';
      boton.style.gap = '0.2em';
      const imgFondo = IMAGENES_AVENTURAS[aventura.id];
      if (imgFondo) {
        boton.style.backgroundImage = \`linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url('\${imgFondo}')\`;
        boton.style.backgroundSize = 'cover';
        boton.style.backgroundPosition = 'center';
      }
      contenedor.appendChild(boton);
    }

`;
  src = src.slice(0, cargaIdx) + HELPER_BOTON + src.slice(cargaIdx);
  console.log('[OK]  Insert _crearBotonAventura');
}

// Replace the forEach body in cargarAventurasDinamicamente
const OLD_FOREACH_AVENTURAS = `        // Generar botones para cada aventura
        aventurasArray.forEach(aventura => {
          const disponibleEnIdioma = aventura.idiomas[idioma]?.disponible;
          const disponibleGeneral = aventura.disponible;
          const estaDisponible = disponibleGeneral && disponibleEnIdioma;

          const boton = document.createElement('button');
          boton.className = 'btn';
          boton.style.width = '100%';

          // Formatear tiempo máximo (minutos a horas)
          const tiempoHoras = aventura.tiempoEstimado ? Math.round(aventura.tiempoEstimado / 60) : 0;
          const vehiculo = aventura.vehiculo || '';
          const distancia = aventura.distanciaKm ? \`±\${aventura.distanciaKm}km\` : '';
          const stats = \`\${vehiculo}\${distancia} <span class="aventura-stat-emoji">🏛️</span>\${aventura.totalMonumentos || 0} <span class="aventura-stat-emoji">📍</span>\${aventura.totalParadas || 0} <span class="aventura-stat-emoji">🧩</span>\${aventura.totalRetos || 0} <span class="aventura-stat-emoji">⏳</span>max\${tiempoHoras}h\`;

          if (estaDisponible) {
            boton.onclick = () => seleccionarAventura(aventura.id);
            boton.innerHTML = \`<span class="aventura-titulo">\${aventura.nombre}</span><span class="aventura-stats">\${stats}</span>\`;
          } else {
            boton.disabled = true;
            boton.innerHTML = \`<span class="aventura-titulo" style="opacity:0.5;">\${aventura.nombre}</span><span class="aventura-stats">\${stats}</span>\`;
          }
          boton.style.flexDirection = 'column';
          boton.style.alignItems = 'center';
          boton.style.justifyContent = 'center';
          boton.style.gap = '0.2em';
          const imgFondo = IMAGENES_AVENTURAS[aventura.id];
          if (imgFondo) {
            boton.style.backgroundImage = \`linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url('\${imgFondo}')\`;
            boton.style.backgroundSize = 'cover';
            boton.style.backgroundPosition = 'center';
          }

          contenedor.appendChild(boton);
        });`;

if (!src.includes(OLD_FOREACH_AVENTURAS)) {
  console.log('[SKIP] forEach aventuras already replaced (whitespace mismatch — trying regex)');
  // Try to find and replace using a marker-based approach
  const forEachStart = src.indexOf("        aventurasArray.forEach(aventura => {");
  if (forEachStart !== -1) {
    const forEachBrace = src.indexOf('{', forEachStart);
    const forEachEnd = findBlockEnd(src, forEachBrace);
    // The forEach(...) call ends with );
    const callEnd = src.indexOf(');', forEachEnd) + 2;
    // Find the comment before forEach
    const commentStart = src.lastIndexOf('        // Generar botones', forEachStart);
    if (commentStart !== -1) {
      src = src.slice(0, commentStart) + '        // Generar botones para cada aventura\n        aventurasArray.forEach(a => _crearBotonAventura(a, idioma, contenedor));' + src.slice(callEnd);
      console.log('[OK]  forEach aventuras replaced (marker approach)');
    }
  }
} else {
  replaceExact(OLD_FOREACH_AVENTURAS,
    `        // Generar botones para cada aventura
        aventurasArray.forEach(a => _crearBotonAventura(a, idioma, contenedor));`,
    'cargarAventurasDinamicamente forEach → _crearBotonAventura'
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. REGULAR SCRIPT — cargarRetoR1: extract forEach callback
// ══════════════════════════════════════════════════════════════════════════════

if (src.includes('function _crearOpcionRetoR1(')) {
  console.log('[SKIP] _crearOpcionRetoR1 already added');
} else {
  const R1_MARKER = '    async function cargarRetoR1() {';
  const r1Idx = src.indexOf(R1_MARKER);
  if (r1Idx === -1) { console.error('[FAIL] cargarRetoR1 not found'); process.exit(1); }

  const HELPER_R1 = `    function _crearOpcionRetoR1(opcion, index, contenedor) {
      const div = document.createElement('div');
      div.className = 'respuesta';
      div.innerHTML = \`
        <input type="radio" name="reto-r1" value="\${opcion}" id="opcion-r1-\${index}" onchange="habilitarBotonRetoR1()">
        <label for="opcion-r1-\${index}">\${opcion}</label>
        <span class="tick" style="display:none; color:#28a745;">✓</span>
        <span class="x" style="display:none; color:#dc3545;">✗</span>
      \`;
      contenedor.appendChild(div);
    }

`;
  src = src.slice(0, r1Idx) + HELPER_R1 + src.slice(r1Idx);
  console.log('[OK]  Insert _crearOpcionRetoR1');
}

// Replace forEach in cargarRetoR1
const R1_FOREACH_MARKER = "              retoR1.opciones.forEach((opcion, index) => {";
const r1ForEachIdx = src.indexOf(R1_FOREACH_MARKER);
if (r1ForEachIdx === -1) {
  console.log('[SKIP] cargarRetoR1 forEach already replaced');
} else {
  const r1Brace = src.indexOf('{', r1ForEachIdx);
  const r1End = findBlockEnd(src, r1Brace);
  const r1CallEnd = src.indexOf(');', r1End) + 2;
  src = src.slice(0, r1ForEachIdx) + '              retoR1.opciones.forEach((opcion, index) => _crearOpcionRetoR1(opcion, index, opciones));' + src.slice(r1CallEnd);
  console.log('[OK]  cargarRetoR1 forEach → _crearOpcionRetoR1');
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. REGULAR SCRIPT — cargarRetoR2: extract forEach callback
// ══════════════════════════════════════════════════════════════════════════════

if (src.includes('function _crearOpcionRetoR2(')) {
  console.log('[SKIP] _crearOpcionRetoR2 already added');
} else {
  const R2_MARKER = '    async function cargarRetoR2() {';
  const r2Idx = src.indexOf(R2_MARKER);
  if (r2Idx === -1) { console.error('[FAIL] cargarRetoR2 not found'); process.exit(1); }

  const HELPER_R2 = `    function _crearOpcionRetoR2(opcion, index, contenedor) {
      const div = document.createElement('div');
      div.className = 'respuesta';
      div.innerHTML = \`
        <input type="radio" name="reto-r2" value="\${opcion}" id="opcion-r2-\${index}" onchange="habilitarBotonRetoR2()">
        <label for="opcion-r2-\${index}">\${opcion}</label>
        <span class="tick" style="display:none; color:#28a745;">✓</span>
        <span class="x" style="display:none; color:#dc3545;">✗</span>
      \`;
      contenedor.appendChild(div);
    }

`;
  src = src.slice(0, r2Idx) + HELPER_R2 + src.slice(r2Idx);
  console.log('[OK]  Insert _crearOpcionRetoR2');
}

// Replace forEach in cargarRetoR2
const R2_FOREACH_MARKER = "              retoR2.opciones.forEach((opcion, index) => {";
const r2ForEachIdx = src.indexOf(R2_FOREACH_MARKER);
if (r2ForEachIdx === -1) {
  console.log('[SKIP] cargarRetoR2 forEach already replaced');
} else {
  const r2Brace = src.indexOf('{', r2ForEachIdx);
  const r2End = findBlockEnd(src, r2Brace);
  const r2CallEnd = src.indexOf(');', r2End) + 2;
  src = src.slice(0, r2ForEachIdx) + '              retoR2.opciones.forEach((opcion, index) => _crearOpcionRetoR2(opcion, index, opciones));' + src.slice(r2CallEnd);
  console.log('[OK]  cargarRetoR2 forEach → _crearOpcionRetoR2');
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. CSS — Merge duplicate #pantalla15 #normativa-contenido selectors
// ══════════════════════════════════════════════════════════════════════════════

if (!src.includes('#pantalla15 #normativa-contenido {\n      background:\n')) {
  console.log('[SKIP] CSS already merged');
} else {
  // Remove #pantalla15 #normativa-contenido from group selector (keep P5 and P6)
  replaceExact(
    `    #pantalla5 #agradecimientos-contenido,
    #pantalla6 #terminos-contenido,
    #pantalla15 #normativa-contenido {`,
    `    #pantalla5 #agradecimientos-contenido,
    #pantalla6 #terminos-contenido {`,
    'CSS: remove #pantalla15 from group selector'
  );

  // Expand the standalone #pantalla15 #normativa-contenido rule with layout + background
  replaceExact(
    `    #pantalla15 #normativa-contenido {
      background:
        linear-gradient(rgba(255,248,231,0.82), rgba(255,248,231,0.82)),
        url('imagenes/imagenes-aplicación/imagen-normativa.png') center / contain no-repeat;
    }`,
    `    #pantalla15 #normativa-contenido {
      flex: 1;
      min-height: 0;
      width: 95vw;
      max-width: 95vw;
      max-height: none;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      margin-top: 0;
      background-color: rgba(255,248,231,0.82);
      background-image: linear-gradient(rgba(255,248,231,0.82), rgba(255,248,231,0.82)), url('imagenes/imagenes-aplicación/imagen-normativa.png') center / contain no-repeat;
    }`,
    'CSS: expand #pantalla15 #normativa-contenido with layout + background'
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Write output
// ══════════════════════════════════════════════════════════════════════════════
writeFileSync(FILE, src, 'utf8');
console.log('\nDone. File written successfully.');
