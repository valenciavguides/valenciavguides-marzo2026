/**
 * controladores-padre.js — Controladores de datos del padre (DT-1 Opción B)
 *
 * Handlers extraídos desde Script 1 de codigo-padre.html para permitir
 * tests unitarios en Jest.  El estado en tiempo de ejecución (aventura
 * seleccionada, datos cargados, etc.) se lee desde globalThis.* porque
 * esos valores solo existen después de que el usuario inicia la aventura.
 *
 * Uso desde Script 1 de codigo-padre.html:
 *
 *   const { registrarControladoresDatos } = await import('./js/controladores-padre.js');
 *   registrarControladoresDatos({
 *     registrarControladorSeguro,
 *     TIPOS_MENSAJE: TIPOS_MENSAJE_S1,
 *     logger: logger_S1 || globalThis.logger || console,
 *     CONFIG_PADRE: globalThis.CONFIG_PADRE,
 *     enviarMensaje: enviarMensaje_S1,
 *     getPadreId: getPadreId_S1
 *   });
 *
 * @module controladores-padre
 */

'use strict';

/**
 * Registra los controladores de solicitud de datos del padre.
 * Todos los deps se pasan explícitamente para permitir mocking en Jest.
 *
 * @param {object} deps
 * @param {Function} deps.registrarControladorSeguro - Función de registro de handlers
 * @param {object}   deps.TIPOS_MENSAJE             - Constantes de mensajería
 * @param {object}   deps.logger                    - Logger (info/warn/error)
 * @param {object}   deps.CONFIG_PADRE              - Configuración del componente padre
 * @param {Function} deps.enviarMensaje             - Función de envío de mensajes
 * @param {Function} deps.getPadreId                - Retorna el ID del padre ('padre')
 */
export function registrarControladoresDatos({
    registrarControladorSeguro,
    TIPOS_MENSAJE,
    logger,
    CONFIG_PADRE,
    enviarMensaje,
    getPadreId
}) {

    // ============================================================
    // CONTROLADORES: SOLICITAR_AUDIOS / SOLICITAR_TEXTOS / SOLICITAR_RETOS / SOLICITAR_COORDENADAS
    // Patrón request-response: si un hijo no recibió CARGAR_*, puede solicitarlo
    // El padre responde reenviando el mismo CARGAR_* con los datos de la aventura actual
    // ============================================================

    // Protección pasiva por parada (ver docs/GUIA-COMPLETA.md §16): SOLICITAR_AUDIOS ya no
    // reenvía la aventura completa. El hijo pide un audioId concreto (cache-miss local) y el
    // padre resuelve solo ese audio, respondiendo con el mismo AUDIO.REPRODUCIR_REQUEST que usa
    // el flujo normal de cambio de parada — un único camino para entregar audio, no dos.
    registrarControladorSeguro(TIPOS_MENSAJE.DATOS.SOLICITAR_AUDIOS, async (mensaje) => {
        const logPrefix = `${CONFIG_PADRE.LOG_PREFIX}[SOLICITAR_AUDIOS][${mensaje?.origen || 'desconocido'}]`;
        try {
            const { audioId } = mensaje.datos || {};
            if (!audioId) {
                logger.debug(`${logPrefix} Solicitud sin audioId, omitiendo`);
                return;
            }
            const aventura = globalThis.aventuraSeleccionada;
            const idioma = globalThis.idiomaSeleccionado;
            if (!aventura || !idioma) {
                logger.debug(`${logPrefix} Contexto no listo (aventura/idioma), omitiendo envío`);
                return;
            }
            const { cargarAudios } = await import('./data-loader.js');
            const audios = await cargarAudios(aventura, idioma) || [];
            const encontrado = audios.find(a => a && a.id === audioId) || null;
            if (!encontrado) {
                logger.warn(`${logPrefix} Audio ${audioId} no encontrado en ${aventura}/${idioma}`);
                return;
            }
            await enviarMensaje({
                tipo: TIPOS_MENSAJE.AUDIO.REPRODUCIR_REQUEST,
                origen: getPadreId(),
                destino: mensaje.origen,
                datos: { audioId, audioData: { id: encontrado.id, title: encontrado.title || null, file: encontrado.file || null }, autoplay: false, contexto: { motivo: 'solicitud_hijo' } }
            });
            logger.info(`${logPrefix} ✅ Audio ${audioId} reenviado a ${mensaje.origen}`);
        } catch (error) {
            logger.error(`${logPrefix} Error reenviando audio:`, error);
        }
    }, { permanente: true });

    registrarControladorSeguro(TIPOS_MENSAJE.DATOS.SOLICITAR_TEXTOS, async (mensaje) => {
        const logPrefix = `${CONFIG_PADRE.LOG_PREFIX}[SOLICITAR_TEXTOS][${mensaje?.origen || 'desconocido'}]`;
        try {
            logger.info(`${logPrefix} Hijo solicita textos — cargando con cargarTextos()`);
            const aventura = globalThis.aventuraSeleccionada;
            const idioma = globalThis.idiomaSeleccionado;
            if (!aventura || !idioma) {
                logger.debug(`${logPrefix} Contexto no listo (aventura/idioma), omitiendo envío`);
                return;
            }
            // __vv_TEXTOS_AVENTURAS tiene arrays planos sin clave de idioma.
            // cargarTextos() ensambla {id, title, content} correctamente.
            const { cargarTextos } = await import('./data-loader.js');
            const textos = await cargarTextos(aventura, idioma) || [];
            if (textos.length === 0) {
                logger.debug(`${logPrefix} Sin textos disponibles para ${aventura}/${idioma}`);
                return;
            }
            await enviarMensaje({
                tipo: TIPOS_MENSAJE.DATOS.CARGAR_TEXTOS,
                origen: getPadreId(),
                destino: mensaje.origen,
                datos: { aventura, idioma, textos, total: textos.length, timestamp: Date.now() }
            });
            logger.info(`${logPrefix} ✅ ${textos.length} textos reenviados a ${mensaje.origen}`);
        } catch (error) {
            logger.error(`${logPrefix} Error reenviando textos:`, error);
        }
    }, { permanente: true });

    // Protección pasiva por parada (ver docs/GUIA-COMPLETA.md §16): SOLICITAR_RETOS ya no
    // reenvía la aventura completa. El hijo pide un retoId concreto (cache-miss local) y el
    // padre resuelve solo ese reto, respondiendo con el mismo RETO.MOSTRAR que usa el flujo
    // normal — un único camino para entregar retos, no dos.
    registrarControladorSeguro(TIPOS_MENSAJE.DATOS.SOLICITAR_RETOS, async (mensaje) => {
        const logPrefix = `${CONFIG_PADRE.LOG_PREFIX}[SOLICITAR_RETOS][${mensaje?.origen || 'desconocido'}]`;
        try {
            const { retoId } = mensaje.datos || {};
            if (!retoId) {
                logger.debug(`${logPrefix} Solicitud sin retoId, omitiendo`);
                return;
            }
            const aventura = globalThis.aventuraSeleccionada;
            const idioma = globalThis.idiomaSeleccionado;
            if (!aventura || !idioma) {
                logger.debug(`${logPrefix} Contexto no listo (aventura/idioma), omitiendo envío`);
                return;
            }
            const { cargarRetos } = await import('./data-loader.js');
            const retos = await cargarRetos(aventura, idioma) || [];
            const encontrado = retos.find(r => r && r.id === retoId) || null;
            if (!encontrado) {
                logger.warn(`${logPrefix} Reto ${retoId} no encontrado en ${aventura}/${idioma}`);
                return;
            }
            await enviarMensaje({
                tipo: TIPOS_MENSAJE.RETO.MOSTRAR,
                origen: getPadreId(),
                destino: mensaje.origen,
                datos: { retoId, retosArray: [encontrado], contexto: 'solicitud_hijo' }
            });
            logger.info(`${logPrefix} ✅ Reto ${retoId} reenviado a ${mensaje.origen}`);
        } catch (error) {
            logger.error(`${logPrefix} Error reenviando reto:`, error);
        }
    }, { permanente: true });

}
