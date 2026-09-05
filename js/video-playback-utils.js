/**
 * Reproducción robusta de <video> servido progresivamente desde red — funciona
 * igual de bien para un clip de 17s que para uno de 5 minutos, porque nunca
 * depende del tamaño total del archivo: solo espera a que el navegador
 * confirme que tiene buffer suficiente para reproducir sin cortes (evento
 * `canplaythrough`), con un timeout de seguridad para no bloquear la escena
 * si ese evento no llega. Una vez arrancada la reproducción, listeners de
 * `stalled`/`waiting` reintentan `play()` para recuperar de micro-cortes de
 * red puntuales.
 *
 * Si la carga falla del todo (evento `error` — corte de cobertura móvil,
 * timeout de red), reintenta recargar el mismo `src` hasta `maxReintentos`
 * veces con backoff simple, en vez de dejar el vídeo roto para siempre. Cada
 * intento de recuperación (rechazo de `.play()`, error final tras agotar
 * reintentos) se registra vía `logger` para poder diagnosticar fallos reales
 * sin necesidad de depuración remota en el dispositivo.
 *
 * Uso: reproducirVideoConBuffer(videoEl, { timeoutMs, maxReintentos }) —
 * videoEl ya debe tener `src` asignado (nunca un blob: eso obliga a
 * descargar el archivo entero antes de reproducir, lo cual no escala a
 * vídeos largos).
 */
// Handlers de recuperación de micro-cortes, definidos una sola vez a nivel de
// módulo (no dentro de reproducirVideoConBuffer): addEventListener con la MISMA
// referencia de función es un no-op la segunda vez (deduplica según
// especificación), así que nunca se acumulan duplicados aunque
// reproducirVideoConBuffer se llame varias veces sobre el mismo elemento.
//
// Ojo con el ciclo de vida real del <video> de #video-overlay, porque es fácil
// razonar mal sobre él: NO es persistente entre visionados. cerrarVideoOverlay()
// (codigo-padre.html) hace overlay.remove() 400 ms después de cerrar, y
// _crearVideoOverlayEl() lo reconstruye cuando vuelve a hacer falta. El elemento
// vive desde que lo crea la primera precarga o el primer visionado hasta el
// siguiente cierre, y los listeners de abajo mueren con él.
// El guard de `paused` no es una precaucion: cubre una ventana concreta. Estos dos
// listeners no se retiran en limpiar() (a proposito, para seguir cubriendo micro-cortes
// durante toda la reproduccion), asi que estan armados desde que el usuario abre un video
// hasta que ese elemento muere. Y en esa ventana _precargarVideoParada()
// (codigo-padre.html) puede reutilizar ese mismo elemento para descargar el video del
// siguiente tramo en segundo plano: un hipo de red durante esa precarga disparaba play() y
// el video se reproducia sin que nadie pulsara #btn-video, el unico camino legitimo.
// Los videos no llevan pista de audio, asi que no se oia nada — el usuario se lo
// encontraba empezado o terminado al abrirlo, mas el gasto de datos y bateria.
//
// _precargarVideoParada() lleva ademas su propio guard (no toca el elemento si el overlay
// esta visible). Los dos son necesarios y cubren cosas distintas: aquel protege el video
// que el usuario esta viendo AHORA; este protege los ~400 ms entre cerrar el overlay y su
// remove(), en los que `visible` ya es false pero el elemento sigue vivo y armado.
//
// `paused` sigue siendo false durante un stalled/waiting real (la especificacion no pausa
// el elemento por falta de datos: solo refleja si se pidio reproducir), asi que el
// micro-corte legitimo a mitad de reproduccion se recupera igual que antes. Mismo criterio
// que audio-hijo3.html aplica a sus tres listeners de red, y que el seek de ese fichero ya
// usaba en wasPlayingDuringSeek.
function _sonando(el) { return !el.paused && !el.ended; }
function _onStalled() { if (!_sonando(this)) return; setTimeout(() => this.play().catch(() => {}), 300); }
function _onWaiting() { if (!_sonando(this)) return; setTimeout(() => this.play().catch(() => {}), 500); }

export function reproducirVideoConBuffer(videoEl, { timeoutMs = 15000, maxReintentos = 2 } = {}) {
    return new Promise((resolve) => {
        if (!videoEl) { resolve(); return; }

        let resuelto = false;
        let timeoutId = null;
        let reintentos = 0;

        const limpiar = () => {
            videoEl.removeEventListener('canplaythrough', onCanPlayThrough);
            videoEl.removeEventListener('error', onError);
            if (timeoutId) clearTimeout(timeoutId);
        };

        const arrancar = () => {
            if (resuelto) return;
            resuelto = true;
            limpiar();
            // Si el usuario ya cerró el overlay (p.ej. mostrarVideoOverlay/
            // cerrarVideoOverlay en codigo-padre.html quita el elemento del DOM
            // ~400ms después de cerrar), no reanudar la reproducción de un
            // <video> pausado y desconectado solo porque canplaythrough llegó tarde.
            if (videoEl.isConnected === false) { resolve(); return; }
            videoEl.play().catch(err => {
                (globalThis.logger || console).warn(`[video-playback-utils] .play() rechazado (${videoEl.currentSrc || videoEl.src}): ${err.name} — ${err.message}`);
            });
            resolve();
        };

        // Cada reintento reinicia el timeout de seguridad — un corte de red que
        // se recupera a la primera o segunda no debe perder su ventana de espera
        // solo porque el timeout original ya estaba corriendo desde antes del corte.
        const rearmarTimeout = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(arrancar, timeoutMs);
        };

        const onCanPlayThrough = () => arrancar();

        // Fallo real de carga (404, corte de red, formato no soportado): un corte
        // momentáneo de cobertura en móvil es habitual y no debe dejar el vídeo
        // roto para siempre — reintentar recargando el mismo src (con backoff)
        // antes de rendirse. Tras agotar los reintentos, arrancar igualmente
        // (mismo comportamiento de antes) para no bloquear la escena indefinidamente.
        const onError = () => {
            if (resuelto) return;
            if (reintentos >= maxReintentos) {
                (globalThis.logger || console).warn(`[video-playback-utils] error de carga tras ${maxReintentos} reintentos, se arranca con lo que haya: ${videoEl.currentSrc || videoEl.src}`);
                arrancar();
                return;
            }
            reintentos++;
            (globalThis.logger || console).warn(`[video-playback-utils] error de carga, reintento ${reintentos}/${maxReintentos}: ${videoEl.currentSrc || videoEl.src}`);
            setTimeout(() => {
                if (resuelto) return;
                videoEl.load(); // reinicia la descarga desde el mismo src
                rearmarTimeout();
            }, 600 * reintentos);
        };

        videoEl.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        // NOT { once: true }: tras cada video.load() de reintento puede volver a
        // dispararse 'error', y hace falta seguir escuchándolo para reintentar de nuevo.
        videoEl.addEventListener('error', onError);
        rearmarTimeout();

        // Recuperación de micro-cortes de red durante la reproducción — no
        // resuelve un bitrate inviable (eso se arregla en la codificación,
        // ver docs/GUIA-COMPLETA.md §15), pero sí cortes puntuales.
        videoEl.addEventListener('stalled', _onStalled);
        videoEl.addEventListener('waiting', _onWaiting);
    });
}
