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

    registrarControladorSeguro(TIPOS_MENSAJE.DATOS.SOLICITAR_AUDIOS, async (mensaje) => {
        const logPrefix = `${CONFIG_PADRE.LOG_PREFIX}[SOLICITAR_AUDIOS][${mensaje?.origen || 'desconocido'}]`;
        try {
            logger.info(`${logPrefix} Hijo solicita audios — reenviando CARGAR_AUDIOS`);
            const aventura = globalThis.aventuraSeleccionada;
            const idioma = globalThis.idiomaSeleccionado;
            if (!aventura || !idioma) {
                logger.debug(`${logPrefix} Contexto no listo (aventura/idioma), omitiendo envío`);
                return;
            }
            const audios = globalThis.__vv_AUDIOS_AVENTURAS?.[aventura]?.[idioma] || [];
            if (audios.length === 0) {
                logger.debug(`${logPrefix} Sin audios disponibles para ${aventura}/${idioma}`);
                return;
            }
            await enviarMensaje({
                tipo: TIPOS_MENSAJE.DATOS.CARGAR_AUDIOS,
                origen: getPadreId(),
                destino: mensaje.origen,
                datos: { aventura, idioma, audios, total: audios.length, timestamp: Date.now() }
            });
            logger.info(`${logPrefix} ✅ ${audios.length} audios reenviados a ${mensaje.origen}`);
        } catch (error) {
            logger.error(`${logPrefix} Error reenviando audios:`, error);
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

    registrarControladorSeguro(TIPOS_MENSAJE.DATOS.SOLICITAR_RETOS, async (mensaje) => {
        const logPrefix = `${CONFIG_PADRE.LOG_PREFIX}[SOLICITAR_RETOS][${mensaje?.origen || 'desconocido'}]`;
        try {
            logger.info(`${logPrefix} Hijo solicita retos — reenviando CARGAR_RETOS`);
            const aventura = globalThis.aventuraSeleccionada;
            const idioma = globalThis.idiomaSeleccionado;
            if (!aventura || !idioma) {
                logger.debug(`${logPrefix} Contexto no listo (aventura/idioma), omitiendo envío`);
                return;
            }
            const retos = globalThis.__vv_RETOS_AVENTURAS?.[aventura]?.[idioma] || [];
            if (retos.length === 0) {
                logger.debug(`${logPrefix} Sin retos disponibles para ${aventura}/${idioma}`);
                return;
            }
            await enviarMensaje({
                tipo: TIPOS_MENSAJE.DATOS.CARGAR_RETOS,
                origen: getPadreId(),
                destino: mensaje.origen,
                datos: { aventura, idioma, retos, total: retos.length, timestamp: Date.now() }
            });
            logger.info(`${logPrefix} ✅ ${retos.length} retos reenviados a ${mensaje.origen}`);
        } catch (error) {
            logger.error(`${logPrefix} Error reenviando retos:`, error);
        }
    }, { permanente: true });

}
