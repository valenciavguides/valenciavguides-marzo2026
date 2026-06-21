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
    // CONTROLADOR: NAVEGACION.SOLICITAR_DATOS_PARADAS
    // ============================================================
    // Movido a Script 1 para evitar warning "Mensaje no reconocido"
    // cuando hijo5 envía el mensaje antes de que Script 2 cargue
    registrarControladorSeguro(TIPOS_MENSAJE.NAVEGACION.SOLICITAR_DATOS_PARADAS, async (mensaje) => {
        const logPrefix = `${CONFIG_PADRE.LOG_PREFIX}[NAVEGACION.SOLICITAR_DATOS_PARADAS][${mensaje?.origen || 'desconocido'}]`;

        try {
            logger.info(`${logPrefix} Solicitud de datos de paradas recibida`);

            // Fuente centralizada: coordenadas-aventuras.js (globalThis.__vv_DATOS_AVENTURAS)
            const aventura = globalThis.aventuraSeleccionada;
            if (!aventura) {
                logger.debug(`${logPrefix} Contexto aún no listo (sin aventura seleccionada), enviando lista vacía`);
                await enviarMensaje({
                    destino: mensaje.origen,
                    tipo: TIPOS_MENSAJE.NAVEGACION.RESPUESTA_DATOS_PARADAS,
                    origen: getPadreId(),
                    datos: {
                        paradas: [],
                        aventura: null,
                        timestamp: Date.now()
                    }
                });
                return;
            }
            const DATOS_AVENTURAS = globalThis.__vv_DATOS_AVENTURAS;
            const coordenadas = DATOS_AVENTURAS?.[aventura]?.['coordenadas-hijo2.html']?.coordenadas;

            if (!coordenadas || !Array.isArray(coordenadas) || coordenadas.length === 0) {
                logger.debug(`${logPrefix} Sin coordenadas disponibles para ${aventura}, enviando lista vacía`);
                await enviarMensaje({
                    destino: mensaje.origen,
                    tipo: TIPOS_MENSAJE.NAVEGACION.RESPUESTA_DATOS_PARADAS,
                    origen: getPadreId(),
                    datos: {
                        paradas: [],
                        aventura,
                        timestamp: Date.now()
                    }
                });
                return;
            }

            // Transformar coordenadas al formato que hijo5 necesita para generar botones
            const paradasParaHijo5 = coordenadas.map(coord => ({
                id: `padre-${coord.id}`,
                parada_id: coord.id,
                tipo: coord.tipo,
                parada: coord.parada,
                tramo: coord.tramo,
                nombre: coord.nombre,
                padreid: `padre-${coord.id}`,
                coordenadas: coord.coordenadas || coord.inicio || null
            }));

            // Enviar respuesta con datos de coordenadas transformados
            await enviarMensaje({
                destino: mensaje.origen,
                tipo: TIPOS_MENSAJE.NAVEGACION.RESPUESTA_DATOS_PARADAS,
                origen: getPadreId(),
                datos: {
                    paradas: paradasParaHijo5,
                    aventura: aventura,
                    timestamp: Date.now()
                }
            });

            logger.info(`${logPrefix} ${paradasParaHijo5.length} paradas (de coordenadas-aventuras.js) enviadas a ${mensaje.origen}`);

        } catch (error) {
            logger.error(`${logPrefix} Error enviando datos de paradas:`, error);
        }
    }, { permanente: true });

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
            logger.info(`${logPrefix} Hijo solicita textos — reenviando CARGAR_TEXTOS`);
            const aventura = globalThis.aventuraSeleccionada;
            const idioma = globalThis.idiomaSeleccionado;
            if (!aventura || !idioma) {
                logger.debug(`${logPrefix} Contexto no listo (aventura/idioma), omitiendo envío`);
                return;
            }
            const textos = globalThis.__vv_TEXTOS_AVENTURAS?.[aventura]?.[idioma] || [];
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
