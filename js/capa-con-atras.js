/**
 * capa-con-atras.js — una capa de dentro de un hijo que el botón atrás del dispositivo cierra antes que nada.
 *
 * Quién la usa:
 *   extrainfo-hijo1.html   el menú de «más opciones» (los iconos desplegados)
 *   chat-hijo6.html        el modal interno del asistente (términos, agradecimientos, vídeo de introducción)
 *   mapa-completo.html     la ficha de un monumento
 *
 * El botón atrás lo atiende el padre (`_atrasConAventuraEnMarcha`, codigo-padre.html), y el padre no ve lo que pasa
 * dentro de un hijo. Por eso el hijo le avisa al abrir y al cerrar su capa (`UI.CAPA_ABIERTA`, con `{ abierta }`), y
 * el padre, cuando esa capa es la de más arriba, le pide que la cierre (`UI.CERRAR_CAPA`). El hijo la cierra con la
 * misma función que su propia ✕ o su propio botón: no hay un segundo cierre.
 *
 * Solo sale el cambio: avisar dos veces seguidas de lo mismo no envía nada la segunda. Y al crearse avisa de que está
 * cerrada, que es como nace: un hijo que se recarga, o un mapa completo que se vuelve a abrir en el mismo iframe,
 * borra así lo que el padre supiera de su documento anterior.
 *
 * Una capa por frame: el handler de `UI.CERRAR_CAPA` es uno, y el bus rechaza en voz alta un segundo.
 * Se crea con el bus del frame ya inicializado (`inicializarMensajeria`): sin él, ni el aviso sale ni el handler escucha.
 */
import { enviarMensaje, registrarControlador } from './mensajeria.js';
import { TIPOS_MENSAJE } from './constants.js';

/**
 * @param {() => void} cerrar - cierra la capa, igual que su propia ✕ o su propio botón
 * @returns {(abierta: boolean) => void} avisa al padre de que la capa se ha abierto (`true`) o cerrado (`false`)
 */
export function capaQueSeCierraConAtras(cerrar) {
    let avisada = null;
    const avisar = (abierta) => {
        if (abierta === avisada) return;
        avisada = abierta;
        void enviarMensaje({ tipo: TIPOS_MENSAJE.UI.CAPA_ABIERTA, destino: 'padre', datos: { abierta } });
    };
    void registrarControlador(TIPOS_MENSAJE.UI.CERRAR_CAPA, () => {
        cerrar();
        return true;
    });
    avisar(false);
    return avisar;
}
