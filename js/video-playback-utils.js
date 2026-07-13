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
        videoEl.addEventListener('stalled', function () { setTimeout(() => this.play().catch(() => {}), 300); });
        videoEl.addEventListener('waiting', function () { setTimeout(() => this.play().catch(() => {}), 500); });
    });
}
