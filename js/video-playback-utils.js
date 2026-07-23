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
// módulo (no dentro de reproducirVideoConBuffer). Si un mismo <video> se
// reutiliza entre llamadas — es el caso de mostrarVideoOverlay() en
// codigo-padre.html, que reutiliza el overlay/elemento para cada vídeo de
// parada que el usuario abre en una misma sesión — addEventListener con la
// MISMA referencia de función es un no-op la segunda vez (deduplica según
// especificación), así que nunca se acumulan listeners duplicados aunque
// reproducirVideoConBuffer se llame muchas veces sobre el mismo elemento.
function _onStalled() { setTimeout(() => this.play().catch(() => {}), 300); }
function _onWaiting() { setTimeout(() => this.play().catch(() => {}), 500); }

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
