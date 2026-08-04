/**
 * feedback-forms.js — envío de sugerencias y valoraciones a Google Forms.
 *
 * Sin backend propio: cada función hace un POST directo al endpoint
 * "formResponse" de un Google Form ya creado (mismo mecanismo que usaría el
 * propio formulario al enviarse, sin pasar por su interfaz visual). Fire-and
 * forget con mode:'no-cors' — el navegador no permite leer la respuesta de
 * un origen distinto, así que no hay confirmación de éxito en el cliente;
 * las respuestas se comprueban en la Google Sheet vinculada a cada Form.
 */

const FORM_SUGERENCIAS = {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSf2knzJxPVJK9DBM7CQA9ZYEaUS_3Xu_nrULEUqYo6saW8YJg/formResponse',
    entryMensaje: 'entry.1238853498',
};

const FORM_VALORACIONES = {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdWVKkBg4XdeEocX-v0mqw_yaL2vMAnEDvDkIIjEIhGbIx0Fg/formResponse',
    entryEstrellas: 'entry.604639939',
    entryComentario: 'entry.1958435837',
    entryMomento: 'entry.1393335280',
};

async function _postFormulario(url, body) {
    // navigator.sendBeacon es la API pensada exactamente para esto: estas llamadas
    // casi siempre van seguidas de un location.reload()/location.href= inmediato
    // (fin de aventura, "otra aventura"), y a diferencia de fetch (incluso con
    // keepalive:true, que en la práctica se ha visto abortado a medias con
    // ERR_ABORTED cuando la navegación ocurre justo después), sendBeacon está
    // diseñado por el navegador para sobrevivir a la descarga del documento.
    try {
        if (navigator.sendBeacon && navigator.sendBeacon(url, body)) {
            return true;
        }
    } catch (e) {
        (globalThis.logger || console).warn('[feedback-forms] sendBeacon falló, probando fetch:', e?.message);
    }
    // Fallback (sendBeacon no disponible o cola llena): fetch con keepalive.
    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            keepalive: true,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        });
        return true;
    } catch (e) {
        (globalThis.logger || console).warn('[feedback-forms] Envío falló (se descarta, no bloquea la UI):', e?.message);
        return false;
    }
}

/**
 * @param {string} mensaje - Texto libre de la sugerencia (obligatorio, no vacío).
 * @param {{idioma?:string, aventura?:string, parada?:string}} contexto - Se concatena al mensaje para dar contexto sin añadir más columnas al Form.
 */
export async function enviarSugerencia(mensaje, contexto = {}) {
    const texto = String(mensaje || '').trim();
    if (!texto) return false;
    const partes = [];
    if (contexto.idioma) partes.push(`idioma:${contexto.idioma}`);
    if (contexto.aventura) partes.push(`aventura:${contexto.aventura}`);
    if (contexto.parada) partes.push(`parada:${contexto.parada}`);
    const contextoTxt = partes.length ? ` [${partes.join(' · ')}]` : '';
    const body = new URLSearchParams({ [FORM_SUGERENCIAS.entryMensaje]: texto + contextoTxt });
    return _postFormulario(FORM_SUGERENCIAS.url, body);
}

/**
 * @param {{estrellas:number, comentario?:string, momento:string}} datos - `momento` identifica el punto del recorrido ('P12', '33%', '66%', 'fin').
 */
export async function enviarValoracion({ estrellas, comentario = '', momento }) {
    if (!estrellas || estrellas < 1 || estrellas > 5) return false;
    const body = new URLSearchParams({
        [FORM_VALORACIONES.entryEstrellas]: String(estrellas),
        [FORM_VALORACIONES.entryComentario]: String(comentario || '').trim(),
        [FORM_VALORACIONES.entryMomento]: String(momento || ''),
    });
    return _postFormulario(FORM_VALORACIONES.url, body);
}
