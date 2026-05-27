/**
 * fix-cc-refactor.mjs
 * Reduces cognitive complexity of distribuirDatosAventura and ejecutarRestauracionAventura
 * by extracting helper functions.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');
const NL = src.includes('\r\n') ? '\r\n' : '\n';
const I8 = '        ';  // 8-space indent (function level)
const I12 = '            '; // 12-space indent (function body)

// ── 1. distribuirDatosAventura ─────────────────────────────────────────────────

const DISTRIBUR_OLD_START = `        async function distribuirDatosAventura(aventura, idioma) {${NL}            const logPrefix = \`\${(CONFIG_PADRE && CONFIG_PADRE.LOG_PREFIX) || '[PADRE]'}[DISTRIBUIR_DATOS]\`;`;

const DISTRIBUR_OLD_END = `            logger.info(\`\${logPrefix} Distribución completada: coordenadas=\${resultados.coordenadas}, audios=\${resultados.audios}, retos=\${resultados.retos}, textos=\${resultados.textos}\`);${NL}            return resultados;${NL}        }`;

if (!src.includes(DISTRIBUR_OLD_START) || !src.includes(DISTRIBUR_OLD_END)) {
    console.error('ERROR: No se encontró distribuirDatosAventura para refactorizar');
    process.exit(1);
}

const DISTRIBUR_NEW = `        // ── Helpers: distribuirDatosAventura ───────────────────────────────────────
        async function _distribuirCoordenadaAHijo2(aventura, idioma, datosAventuras, logPrefix) {
            try {
                if (!datosAventuras?.[aventura]) { logger.warn(\`\${logPrefix} ⚠️ Datos de aventura no encontrados: \${aventura}\`); return false; }
                const coordenadas = datosAventuras[aventura]['coordenadas-hijo2.html']?.coordenadas || [];
                if (!coordenadas.length) { logger.warn(\`\${logPrefix} ⚠️ No hay coordenadas para \${aventura}\`); return false; }
                await globalThis.enviarMensaje({ tipo: TIPOS_MENSAJE.DATOS.CARGAR_COORDENADAS, origen: getPadreId(), destino: 'hijo2', datos: { aventura, idioma, coordenadas, total: coordenadas.length, timestamp: Date.now() } });
                logger.info(\`\${logPrefix} ✅ Coordenadas enviadas a hijo2: \${coordenadas.length} paradas/tramos\`);
                return true;
            } catch (coordError) { logger.error(\`\${logPrefix} Error enviando coordenadas a hijo2:\`, coordError); return false; }
        }
        async function _distribuirAudiosAHijo3(aventura, idioma, audiosAventuras, logPrefix) {
            try {
                if (!audiosAventuras?.[aventura]) { logger.warn(\`\${logPrefix} ⚠️ Audios de aventura no encontrados: \${aventura}\`); return false; }
                const audios = audiosAventuras[aventura][idioma] || [];
                if (!audios.length) { logger.warn(\`\${logPrefix} ⚠️ No hay audios para \${aventura}/\${idioma}\`); return false; }
                await globalThis.enviarMensaje({ tipo: TIPOS_MENSAJE.DATOS.CARGAR_AUDIOS, origen: getPadreId(), destino: 'hijo3', datos: { aventura, idioma, audios, total: audios.length, timestamp: Date.now() } });
                logger.info(\`\${logPrefix} ✅ Audios enviados a hijo3: \${audios.length} pistas\`);
                return true;
            } catch (audioError) { logger.error(\`\${logPrefix} Error enviando audios a hijo3:\`, audioError); return false; }
        }
        async function _distribuirRetosAHijo4(aventura, idioma, logPrefix) {
            try {
                const { cargarRetos: _cRt } = await import('./js/data-loader.js');
                const retos = await _cRt(aventura, idioma) || [];
                if (!retos.length) { logger.warn(\`\${logPrefix} ⚠️ No hay retos para \${aventura}/\${idioma}\`); return false; }
                await globalThis.enviarMensaje({ tipo: TIPOS_MENSAJE.DATOS.CARGAR_RETOS, origen: getPadreId(), destino: 'hijo4', datos: { aventura, idioma, retos, total: retos.length, timestamp: Date.now() } });
                logger.info(\`\${logPrefix} ✅ Retos enviados a hijo4: \${retos.length} retos\`);
                return true;
            } catch (retoError) { logger.error(\`\${logPrefix} Error enviando retos a hijo4:\`, retoError); return false; }
        }
        async function _distribuirTextosAHijo2(aventura, idioma, logPrefix) {
            try {
                const { cargarTextos: _cTx } = await import('./js/data-loader.js');
                const textos = await _cTx(aventura, idioma);
                if (!textos.length) { logger.warn(\`\${logPrefix} ⚠️ No hay textos para \${aventura}/\${idioma}\`); return false; }
                await globalThis.enviarMensaje({ tipo: TIPOS_MENSAJE.DATOS.CARGAR_TEXTOS, origen: getPadreId(), destino: 'hijo2', datos: { aventura, idioma, textos, total: textos.length, timestamp: Date.now() } });
                logger.info(\`\${logPrefix} ✅ Textos enviados a hijo2: \${textos.length} textos\`);
                return true;
            } catch (textoError) { logger.error(\`\${logPrefix} Error enviando textos a hijo2:\`, textoError); return false; }
        }
        function _asignarAventuraParadas(aventura, idioma, logPrefix) {
            try {
                const elementosParadas = globalThis.DATOS_PADRE?.[aventura]?.[idioma]?.elementosIDpadre;
                if (!Array.isArray(elementosParadas) || !elementosParadas.length) { logger.warn(\`\${logPrefix} ⚠️ elementosIDpadre no disponible para \${aventura}/\${idioma}\`); return; }
                globalThis.AVENTURA_PARADAS = elementosParadas;
                globalThis.dispatchEvent(new CustomEvent('vv:paradas-disponibles', { detail: elementosParadas }));
                logger.info(\`\${logPrefix} ✅ globalThis.AVENTURA_PARADAS asignado: \${elementosParadas.length} elementos\`);
            } catch (e) { logger.error(\`\${logPrefix} Error asignando AVENTURA_PARADAS:\`, e); }
        }
        async function distribuirDatosAventura(aventura, idioma) {
            const logPrefix = \`\${(CONFIG_PADRE && CONFIG_PADRE.LOG_PREFIX) || '[PADRE]'}[DISTRIBUIR_DATOS]\`;

            if (!globalThis.sistemaInicializado) {
                logger.warn(\`\${logPrefix} Sistema no inicializado aún. Esperando carga de iframes...\`);
                return { coordenadas: false, audios: false, retos: false, textos: false, pospuesto: true, mensaje: 'Sistema no inicializado - iframes aún cargándose' };
            }
            if (!globalThis.__vv_DATOS_AVENTURAS || !globalThis.__vv_AUDIOS_AVENTURAS || !globalThis.__vv_RETOS_AVENTURAS) {
                logger.warn(\`\${logPrefix} Datos centralizados no disponibles aún. Esperando carga...\`);
                throw new Error('Datos centralizados no disponibles - los módulos aún se están cargando');
            }
            if (typeof globalThis.enviarMensaje !== 'function') {
                logger.warn(\`\${logPrefix} globalThis.enviarMensaje no disponible aún. Esperando inicialización de mensajería...\`);
                return { coordenadas: false, audios: false, retos: false, textos: false, pospuesto: true, mensaje: 'Distribución pospuesta - mensajería no disponible' };
            }

            const datosAventuras = globalThis.__vv_DATOS_AVENTURAS;
            const audiosAventuras = globalThis.__vv_AUDIOS_AVENTURAS;

            const coordenadas = await _distribuirCoordenadaAHijo2(aventura, idioma, datosAventuras, logPrefix);
            const audios = await _distribuirAudiosAHijo3(aventura, idioma, audiosAventuras, logPrefix);
            const retos = await _distribuirRetosAHijo4(aventura, idioma, logPrefix);
            const textos = await _distribuirTextosAHijo2(aventura, idioma, logPrefix);
            _asignarAventuraParadas(aventura, idioma, logPrefix);

            const resultados = { coordenadas, audios, retos, textos };
            logger.info(\`\${logPrefix} Distribución completada: coordenadas=\${coordenadas}, audios=\${audios}, retos=\${retos}, textos=\${textos}\`);
            return resultados;
        }`;

// Find the full old block from start to end
const idxStart = src.indexOf(DISTRIBUR_OLD_START);
const idxEnd = src.indexOf(DISTRIBUR_OLD_END) + DISTRIBUR_OLD_END.length;
if (idxStart < 0 || idxEnd < DISTRIBUR_OLD_END.length) {
    console.error('ERROR: No se pudo localizar distribuirDatosAventura');
    process.exit(1);
}
src = src.slice(0, idxStart) + DISTRIBUR_NEW + src.slice(idxEnd);
console.log('✅ distribuirDatosAventura refactorizado');

// ── 2. ejecutarRestauracionAventura ────────────────────────────────────────────

const REST_OLD_START = `        // Ejecuta la restauración completa de una aventura guardada${NL}        async function ejecutarRestauracionAventura(datosGuardados) {${NL}            const logPrefix = '[PADRE][RESTAURACION]';`;
const REST_OLD_END = `            } catch (err) {${NL}                logger.error(\`\${logPrefix} Error restaurando aventura:\`, err);${NL}            }${NL}        }${NL}${NL}        // === INICIALIZACIONES ADICIONALES DE SEGURIDAD Y CORRELACIÓN ===`;

if (!src.includes(REST_OLD_START) || !src.includes(REST_OLD_END)) {
    console.error('ERROR: No se encontró ejecutarRestauracionAventura para refactorizar');
    process.exit(1);
}

const REST_NEW = `        // Ejecuta la restauración completa de una aventura guardada

        // ── Helpers: ejecutarRestauracionAventura ─────────────────────────────────────
        function _mostrarInterfazReanudacion() {
            const iframeSeleccion = document.getElementById('seleccion');
            if (iframeSeleccion) iframeSeleccion.style.display = 'none';
            for (const id of ['hijo2', 'hijo3', 'hijo1-opciones', 'hijo5', 'btn-chat-soporte']) {
                const el = document.getElementById(id);
                if (el) { el.style.display = 'block'; el.style.visibility = 'visible'; }
            }
            const selMapa = document.getElementById('selector-tipo-mapa');
            if (selMapa) selMapa.style.display = 'flex';
            if (typeof globalThis.actualizarVisibilidadSelectorMapa === 'function') globalThis.actualizarVisibilidadSelectorMapa();
            const logoEl = document.getElementById('logo-aventura');
            const fondoEl = document.getElementById('fondo-blanco');
            const fondoInferiorEl = document.getElementById('fondo-blanco-inferior');
            if (logoEl) logoEl.style.display = 'block';
            if (fondoEl) fondoEl.style.display = 'block';
            if (fondoInferiorEl) fondoInferiorEl.style.display = 'block';
        }
        async function _esperarHijosCriticosRest(logPrefix) {
            const hijosCriticos = ['hijo2', 'hijo3', 'hijo4'];
            const inicio = Date.now();
            while (hijosCriticos.some(id => !estado.hijosInicializados.has(id))) {
                if (Date.now() - inicio > 8000) { logger.warn(\`\${logPrefix} ⏱ Timeout esperando hijos críticos (hijo2, hijo3). Distribuyendo datos de todos modos.\`); break; }
                await new Promise(r => setTimeout(r, 200));
            }
            logger.info(\`\${logPrefix} Hijos listos: [\${Array.from(estado.hijosInicializados).join(', ')}]\`);
        }
        async function _distribuirDatosRest(logPrefix, datosGuardados) {
            try {
                if (typeof globalThis.distribuirDatosAventura !== 'function') {
                    if (globalThis.__distribuirReadyPromise) { await globalThis.__distribuirReadyPromise; }
                    else { let _i = 0; while (typeof globalThis.distribuirDatosAventura !== 'function' && _i++ < 120) { await new Promise(r => setTimeout(r, 250)); } }
                }
                let res = await globalThis.distribuirDatosAventura(datosGuardados.aventura, datosGuardados.idioma);
                if (res?.pospuesto) {
                    const t0 = Date.now();
                    while (!globalThis.sistemaInicializado && (Date.now() - t0 < 5000)) { await new Promise(r => setTimeout(r, 200)); }
                    res = await globalThis.distribuirDatosAventura(datosGuardados.aventura, datosGuardados.idioma);
                }
                logger.success(\`\${logPrefix} ✅ Datos distribuidos a hijos tras reanudación\`);
            } catch (distErr) { logger.warn(\`\${logPrefix} Error distribuyendo datos en reanudación:\`, distErr); }
        }
        async function _enviarRespuestaParadasHijosRest(logPrefix, datosGuardados) {
            const av = datosGuardados.aventura;
            const id = datosGuardados.idioma || 'es';
            try {
                if (DATOS_PADRE[av]?.[id] && typeof enviarMensaje_S1 === 'function') {
                    const pNorm = normalizarParadas_S1(DATOS_PADRE[av][id].elementosIDpadre || []);
                    if (pNorm.length > 0) {
                        await enviarMensaje_S1({ destino: 'hijo2', tipo: TIPOS_MENSAJE_S1.NAVEGACION.RESPUESTA_DATOS_PARADAS, origen: getPadreId(), datos: { paradas: pNorm, timestamp: Date.now() } });
                        logger.info(\`\${logPrefix} ✅ RESPUESTA_DATOS_PARADAS → hijo2 (\${pNorm.length} paradas)\`);
                    }
                }
            } catch (_e2) { logger.warn(\`\${logPrefix} Error enviando RESPUESTA_DATOS_PARADAS a hijo2:\`, _e2); }
            try {
                const coords = globalThis.__vv_DATOS_AVENTURAS?.[av]?.['coordenadas-hijo2.html']?.coordenadas;
                if (Array.isArray(coords) && coords.length > 0 && typeof enviarMensaje_S1 === 'function') {
                    const pH5 = coords.map(c => ({ id: \`padre-\${c.id}\`, parada_id: c.id, tipo: c.tipo, parada: c.parada, tramo: c.tramo, nombre: c.nombre, padreid: \`padre-\${c.id}\`, coordenadas: c.coordenadas || c.inicio || null }));
                    await enviarMensaje_S1({ destino: 'hijo5', tipo: TIPOS_MENSAJE_S1.NAVEGACION.RESPUESTA_DATOS_PARADAS, origen: getPadreId(), datos: { paradas: pH5, aventura: av, timestamp: Date.now() } });
                    logger.info(\`\${logPrefix} ✅ RESPUESTA_DATOS_PARADAS → hijo5 (\${pH5.length} paradas)\`);
                }
            } catch (_e5) { logger.warn(\`\${logPrefix} Error enviando RESPUESTA_DATOS_PARADAS a hijo5:\`, _e5); }
        }
        async function _restaurarProgresoRest(logPrefix) {
            const restored = restoreProgressFromStorage();
            if (restored && typeof restored.indiceProgreso === 'number') {
                estado.indiceProgreso = restored.indiceProgreso;
                const fnObtener = globalThis.obtenerElementoActual || (typeof obtenerElementoActual === 'function' ? obtenerElementoActual : null);
                estado.elementoActual = fnObtener ? fnObtener() : null;
                logger.info(\`\${logPrefix} ✅ Progreso restaurado: índice \${restored.indiceProgreso}, parada \${restored.paradaActual}\`);
            } else {
                await ensureDefaultParada();
                logger.info(\`\${logPrefix} Sin progreso previo, usando parada por defecto\`);
            }
        }
        async function _activarModoRest(logPrefix, datosGuardados) {
            try {
                estado.modo = estado.modo || {};
                estado.modo.actual = MODOS.CASA;
                if (typeof enviarMensaje_S1 !== 'function') { logger.success(\`\${logPrefix} 🎉 AVENTURA REANUDADA: \${datosGuardados.aventura} (\${datosGuardados.idioma})\`); return; }
                let cambioModoResuelto = false;
                const cambioModoPromise = Promise.resolve(enviarMensaje_S1({ tipo: TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO, origen: CONFIG_PADRE.ID, destino: 'todos', datos: { modo: MODOS.CASA, aventura: datosGuardados.aventura, idioma: datosGuardados.idioma, restaurado: true, secuenciaCompleta: true, timestamp: Date.now() } }))
                    .then((r) => { cambioModoResuelto = true; return r; })
                    .catch((e) => { cambioModoResuelto = true; logger.warn(\`\${logPrefix} Error en envío de CAMBIO_MODO durante reanudación:\`, e); return null; });
                const carrera = await Promise.race([cambioModoPromise.then(() => 'ok'), new Promise(r => setTimeout(() => r('timeout'), 2500))]);
                if (carrera === 'timeout') {
                    const gracia = await Promise.race([cambioModoPromise.then(() => true).catch(() => true), new Promise(r => setTimeout(() => r(false), 1200))]);
                    if (!gracia && !cambioModoResuelto) { logger.warn(\`\${logPrefix} ⏱ CAMBIO_MODO sigue pendiente en reanudación; continuando sin bloquear la carga\`); }
                    else { logger.debug(\`\${logPrefix} CAMBIO_MODO confirmó justo tras timeout inicial; warning omitido\`); }
                }
                logger.success(\`\${logPrefix} 🎉 AVENTURA REANUDADA: \${datosGuardados.aventura} (\${datosGuardados.idioma})\`);
            } catch (modoErr) { logger.error(\`\${logPrefix} Error activando modo aventura:\`, modoErr); }
        }
        function _normalizarIdRest(value) {
            if (value === null || value === undefined) return null;
            const limpio = String(value).trim();
            if (!limpio) return null;
            const canon = limpio.toLowerCase();
            return (canon === 'null' || canon === 'undefined') ? null : limpio;
        }
        async function _solicitarRecursosRest(logPrefix) {
            if (!estado.elementoActual) return;
            const paradaId = _normalizarIdRest(estado.elementoActual.parada_id || estado.elementoActual.tramo_id);
            if (paradaId) {
                try {
                    await solicitarCoordenadasAHijo2({ ...estado.elementoActual, parada_id: estado.elementoActual.parada_id ? paradaId : estado.elementoActual.parada_id, tramo_id: estado.elementoActual.tramo_id ? paradaId : estado.elementoActual.tramo_id });
                    logger.info(\`\${logPrefix} ✅ Coordenadas de destino solicitadas a hijo2 (\${paradaId})\`);
                } catch (coordErr) { logger.warn(\`\${logPrefix} Error solicitando coordenadas tras reanudación:\`, coordErr); }
            } else {
                logger.warn(\`\${logPrefix} ⚠️ Reanudación sin parada/tramo válido; se omite solicitud de coordenadas\`, { parada_id: estado.elementoActual.parada_id, tramo_id: estado.elementoActual.tramo_id });
            }
            const audioId = _normalizarIdRest(estado.elementoActual.audio_id);
            if (audioId) {
                try {
                    const fnAudio = globalThis.solicitarAudioAHijo3 || (typeof solicitarAudioAHijo3 === 'function' ? solicitarAudioAHijo3 : null);
                    if (fnAudio) { await fnAudio(audioId); }
                    else if (typeof enviarMensaje_S1 === 'function') { await enviarMensaje_S1({ tipo: TIPOS_MENSAJE_S1.AUDIO.REPRODUCIR_REQUEST, origen: getPadreId(), destino: 'hijo3', datos: { audioId, contexto: 'progresion_aventura', autoplay: false } }); }
                    else { throw new Error('No hay función ni canal disponible para solicitar audio a hijo3'); }
                    const fnControles = globalThis.actualizarEstadoControlesAudioPadre || (typeof actualizarEstadoControlesAudioPadre === 'function' ? actualizarEstadoControlesAudioPadre : null);
                    if (fnControles) { fnControles(); } else { logger.debug(\`\${logPrefix} actualizarEstadoControlesAudioPadre aún no disponible en esta fase\`); }
                    logger.info(\`\${logPrefix} ✅ Audio solicitado a hijo3: \${audioId}\`);
                } catch (audioErr) { logger.warn(\`\${logPrefix} Error solicitando audio tras reanudación:\`, audioErr); }
            } else {
                logger.info(\`\${logPrefix} Reanudación sin audio válido para restaurar\`, { audio_id: estado.elementoActual.audio_id });
            }
        }

        async function ejecutarRestauracionAventura(datosGuardados) {
            const logPrefix = '[PADRE][RESTAURACION]';
            try {
                globalThis.aventuraSeleccionada = datosGuardados.aventura;
                globalThis.idiomaSeleccionado = datosGuardados.idioma || 'es';
                if (!estado.seleccion) estado.seleccion = {};
                estado.seleccion.aventura = datosGuardados.aventura;
                estado.seleccion.idioma = datosGuardados.idioma || 'es';
                estado.seleccion.iniciada = true;

                _mostrarInterfazReanudacion();

                try {
                    const paradasRaw = localStorage.getItem('vv_paradas_completadas');
                    if (paradasRaw) {
                        const paradasObj = JSON.parse(paradasRaw);
                        if (paradasObj && typeof paradasObj === 'object') {
                            estado.paradasCompletadas = new Map(Object.entries(paradasObj));
                            logger.info(\`\${logPrefix} ✅ \${estado.paradasCompletadas.size} paradas completadas restauradas\`);
                        }
                    }
                } catch (pErr) { logger.warn(\`\${logPrefix} Error restaurando paradas completadas\`, pErr); }

                if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
                    await globalThis.__cargarDatosAventuraDiferidos();
                }

                await _esperarHijosCriticosRest(logPrefix);
                await _distribuirDatosRest(logPrefix, datosGuardados);
                await _enviarRespuestaParadasHijosRest(logPrefix, datosGuardados);
                await _restaurarProgresoRest(logPrefix);
                await _activarModoRest(logPrefix, datosGuardados);
                await _solicitarRecursosRest(logPrefix);
            } catch (err) {
                logger.error(\`\${logPrefix} Error restaurando aventura:\`, err);
            }
        }

        // === INICIALIZACIONES ADICIONALES DE SEGURIDAD Y CORRELACIÓN ===`;

const idxRestStart = src.indexOf(REST_OLD_START);
const idxRestEnd = src.indexOf(REST_OLD_END) + REST_OLD_END.length;
if (idxRestStart < 0 || idxRestEnd < REST_OLD_END.length) {
    console.error('ERROR: No se pudo localizar ejecutarRestauracionAventura');
    process.exit(1);
}
src = src.slice(0, idxRestStart) + REST_NEW + src.slice(idxRestEnd);
console.log('✅ ejecutarRestauracionAventura refactorizado');

writeFileSync(FILE, src, 'utf8');
console.log('=== fix-cc-refactor completado ===');
