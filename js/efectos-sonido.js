/**
 * efectos-sonido.js — los cuatro efectos de sonido de la PWA (carpeta audios-efectos/).
 *
 * Quién los pide y cuándo:
 *   ELECCION_RESPUESTA  retos-hijo4.html   cada pulsación sobre una opción de un reto de opción
 *                                          o de opción múltiple (también al desmarcar), y no más
 *   PIEZA_COLOCADA      puzzle.html        cada pieza que queda bien colocada
 *   RETO_COMPLETADO     puzzle.html        puzzle completado a tiempo (o saltado con ⏩)
 *                       retos-hijo4.html   reto de opción, de opción múltiple o de texto
 *                                          completado (o saltado con ⏩)
 *   TIEMPO_ACABADO      puzzle.html        se acaba el tiempo del puzzle
 *                       retos-hijo4.html   respuesta incorrecta en un reto de opciones
 *                       codigo-padre.html  se muestra el modal de tiempo agotado (temporizador
 *                                          de hijo1 de 60 h / 150 h, ventana de compra o plazo
 *                                          de 7 días superados con la app cerrada)
 *
 * VOLUMEN: siempre al máximo. La PWA no tiene control de volumen ni de silencio propio: lo
 * regula el usuario con los botones de su dispositivo, y eso vale para estos efectos igual que
 * para las narraciones. Por eso ningún fichero de producción asigna `volume` ni `muted` a un
 * audio (lo vigila el spec 116). En iOS la propiedad `volume` ni siquiera se puede cambiar
 * desde la página: el nivel de cada sonido es el del propio fichero.
 *
 * UN REPRODUCTOR POR EFECTO Y POR FRAME, reutilizado. El service worker sirve estos ficheros
 * como el resto del shell (red primero, sin caché HTTP): un `new Audio(url)` en cada pulsación
 * sería una petición de red por pulsación y el sonido llegaría tarde. Con un reproductor ya
 * cargado, `reproducirEfecto` solo rebobina y reproduce. Una segunda pulsación sobre el mismo
 * efecto lo reinicia en vez de superponerlo; efectos distintos sí suenan a la vez (la última
 * pieza dispara PIEZA_COLOCADA y RETO_COMPLETADO juntos).
 *
 * `precargarEfectos` lo llama cada frame al arrancar con los que va a necesitar, para que el
 * primer gesto del usuario los desbloquee (ver más abajo). `reproducirEfecto` sin precarga previa
 * también funciona: crea el reproductor en ese momento.
 *
 * DESBLOQUEO. La guía de Apple para Safari en iOS documenta que `play()` y `load()` solo actúan
 * dentro de un gesto del usuario y que `preload` está desactivado. Los sonidos que llegan sin
 * gesto —el fin de tiempo del puzzle, el modal de tiempo agotado, que salen de un temporizador o
 * de un mensaje— solo pueden sonar si ese reproductor ya sonó una vez por un gesto. Por eso, en el
 * primer gesto de la página (`touchend`, `pointerup`, `click` o `keydown`), cada reproductor que
 * aún no ha sonado se arranca y se para en el mismo instante: queda desbloqueado y, de paso, el
 * navegador ya ha pedido el fichero, así que el primer sonido de verdad no llega tarde. Si el
 * navegador rechaza el arranque (`NotAllowedError`), el reproductor sigue pendiente para el
 * siguiente gesto. Un arranque en frío sin ningún gesto previo no se puede desbloquear: es el
 * límite del navegador.
 *
 * Un `play()` rechazado (autoplay bloqueado, fichero ausente) o una excepción al crear el
 * reproductor se dicen en el log con `logger.warn` y no se propagan.
 */

import logger from './logger.js';

export const EFECTOS = Object.freeze({
    ELECCION_RESPUESTA: 'eleccion_respuesta',
    PIEZA_COLOCADA: 'pieza_colocada',
    RETO_COMPLETADO: 'reto_completado',
    TIEMPO_ACABADO: 'tiempo_acabado',
});

// Relativas a ESTE módulo, no al documento que lo importa: padre, hijos y puzzle están en la
// raíz, pero así la ruta no depende de quién importe.
const FICHEROS = Object.freeze({
    [EFECTOS.ELECCION_RESPUESTA]: '../audios-efectos/sonido_eleccion_respuesta_reto.mp3',
    [EFECTOS.PIEZA_COLOCADA]: '../audios-efectos/sonido_pieza_colocada.mp3',
    [EFECTOS.RETO_COMPLETADO]: '../audios-efectos/sonido_reto_completado.mp3',
    [EFECTOS.TIEMPO_ACABADO]: '../audios-efectos/sonido_tiempo_acabado.mp3',
});

const _reproductores = new Map();

function _reproductorDe(efecto) {
    const fichero = FICHEROS[efecto];
    if (!fichero) {
        logger.error(`[efectos-sonido] Efecto desconocido: ${String(efecto)}`);
        return null;
    }
    let audio = _reproductores.get(efecto);
    if (!audio) {
        audio = new Audio(new URL(fichero, import.meta.url).href);
        audio.preload = 'auto';
        audio.volume = 1;
        _reproductores.set(efecto, audio);
    }
    return audio;
}

// Un sonido que falla no puede romper a quien lo pide: el cierre de un puzzle, un `click` de
// opción o el modal de tiempo agotado (cuya rama de último recurso recarga la app) siguen su
// camino. El fallo se dice en el log, no se calla.
function _sinRomper(accion, fn) {
    try {
        fn();
    } catch (e) {
        logger.warn(`[efectos-sonido] ${accion} falló: ${e?.name || ''} ${e?.message || e}`);
    }
}

// Los reproductores que ya han sonado por un gesto del usuario: no hace falta desbloquearlos.
const _desbloqueados = new WeakSet();
const GESTOS = ['touchend', 'pointerup', 'click', 'keydown'];

// `audio._desbloqueando` marca el arranque y la parada de este desbloqueo mientras dura, para que
// quien observe `play()`/`pause()` (los specs) lo distinga de un sonido de verdad.
function _desbloquearPendientes() {
    _sinRomper('desbloqueo', () => {
        for (const audio of _reproductores.values()) {
            if (_desbloqueados.has(audio) || !audio.paused) continue;
            _desbloqueados.add(audio);
            audio._desbloqueando = true;
            try {
                const promesa = audio.play();
                audio.pause();
                audio.currentTime = 0;
                if (promesa && typeof promesa.catch === 'function') {
                    // Parar enseguida rechaza siempre esta promesa con AbortError: no es un fallo.
                    // Solo `NotAllowedError` dice que el navegador no ha aceptado el gesto.
                    promesa.catch((e) => {
                        if (e?.name === 'NotAllowedError') _desbloqueados.delete(audio);
                    });
                }
            } finally {
                audio._desbloqueando = false;
            }
        }
    });
}

if (typeof document !== 'undefined') {
    for (const gesto of GESTOS) document.addEventListener(gesto, _desbloquearPendientes, { capture: true, passive: true });
}

export function precargarEfectos(efectos) {
    _sinRomper('precargarEfectos', () => {
        for (const efecto of efectos) _reproductorDe(efecto);
    });
}

export function reproducirEfecto(efecto) {
    _sinRomper(`reproducirEfecto("${efecto}")`, () => {
        const audio = _reproductorDe(efecto);
        if (!audio) return;
        audio.currentTime = 0;
        const promesa = audio.play();
        if (promesa && typeof promesa.then === 'function') {
            promesa.then(() => _desbloqueados.add(audio), (e) => {
                logger.warn(`[efectos-sonido] No se pudo reproducir "${efecto}": ${e?.name || ''} ${e?.message || e}`);
            });
        }
    });
}

export function detenerEfectos() {
    _sinRomper('detenerEfectos', () => {
        for (const audio of _reproductores.values()) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}
