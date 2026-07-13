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
 * Uso: reproducirVideoConBuffer(videoEl) — videoEl ya debe tener `src`
 * asignado (nunca un blob: eso obliga a descargar el archivo entero antes
 * de reproducir, lo cual no escala a vídeos largos).
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

export function reproducirVideoConBuffer(videoEl, { timeoutMs = 15000 } = {}) {
    return new Promise((resolve) => {
        if (!videoEl) { resolve(); return; }

        let resuelto = false;
        let timeoutId = null;

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
            videoEl.play().catch(() => {});
            resolve();
        };

        const onCanPlayThrough = () => arrancar();
        // Fallo real de carga (404, sin conexión, formato no soportado): no tiene
        // sentido esperar los 15s completos — resolver ya para que la escena
        // continúe y el usuario no se quede mirando el spinner.
        const onError = () => arrancar();

        videoEl.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        videoEl.addEventListener('error', onError, { once: true });
        // Fallback: si canplaythrough no llega (algunos navegadores no lo disparan
        // de forma fiable), arrancar de todos modos tras el timeout en vez de
        // dejar la escena bloqueada indefinidamente.
        timeoutId = setTimeout(arrancar, timeoutMs);

        // Recuperación de micro-cortes de red durante la reproducción — no
        // resuelve un bitrate inviable (eso se arregla en la codificación,
        // ver docs/GUIA-COMPLETA.md §15), pero sí cortes puntuales.
        videoEl.addEventListener('stalled', _onStalled);
        videoEl.addEventListener('waiting', _onWaiting);
    });
}
