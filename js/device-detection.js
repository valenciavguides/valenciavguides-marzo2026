/**
 * @fileoverview Detección de dispositivos para ValenciaVGuides
 * @version 3.0.0
 *
 * Solo esMovil()/esTelefonoMovil() tienen caller real hoy — usadas por mensajeria.js
 * (TTL de limpieza de mensajes) y codigo-padre.html (aviso de "gira el móvil" en
 * horizontal). El resto de detecciones que existían aquí (tablet/iOS/Android/navegador/
 * táctil/giroscopio/acelerómetro/geolocalización/notificaciones/service workers/PWA
 * instalada) se retiraron en la auditoría de 2026-08-03: 0 callers en todo el proyecto,
 * solo alcanzables manualmente vía un agregador de debug sin ningún uso en el flujo real
 * de la app. Ver docs/GUIA-COMPLETA.md §26.3 para el detalle verificado.
 */

/**
 * Cache de detecciones para evitar recálculos
 * @type {Object}
 */
const cache = {
    esMovil: null,
    esTelefonoMovil: null,
};

/**
 * Obtiene el User Agent del navegador
 * @returns {string} User Agent
 */
function getUserAgent() {
    return navigator.userAgent || navigator.vendor || globalThis.opera || '';
}

/**
 * Detecta si el dispositivo es móvil (incluye tablets)
 * @returns {boolean} True si es dispositivo móvil
 */
export function esMovil() {
    if (cache.esMovil !== null) {
        return cache.esMovil;
    }

    const ua = getUserAgent().toLowerCase();

    // Patrones comunes de dispositivos móviles
    const patronesMovil = [
        /android/i,
        /webos/i,
        /iphone/i,
        /ipad/i,
        /ipod/i,
        /blackberry/i,
        /windows phone/i,
        /opera mini/i,
        /mobile/i,
        /tablet/i
    ];

    // Verificar por User Agent (único método fiable)
    cache.esMovil = patronesMovil.some(patron => patron.test(ua));
    return cache.esMovil;
}

/**
 * Detecta si el dispositivo es específicamente un teléfono móvil (no tablet)
 * @returns {boolean} True si es teléfono móvil
 */
export function esTelefonoMovil() {
    if (cache.esTelefonoMovil !== null) {
        return cache.esTelefonoMovil;
    }

    const ua = getUserAgent().toLowerCase();

    // Patrones específicos de teléfonos
    const patronesTelefono = [
        /iphone/i,
        /android.*mobile/i,
        /windows phone/i,
        /blackberry/i,
        /opera mini/i,
        /mobile/i
    ];

    // Excluir tablets conocidas
    const esTablet = (
        /ipad/i.test(ua) ||
        (/android/i.test(ua) && !/mobile/i.test(ua)) ||
        /tablet/i.test(ua)
    );

    // Verificar por tamaño de pantalla típico de teléfonos
    const esTamanoTelefono = globalThis.innerWidth <= 768;

    // Es teléfono si coincide con patrón Y no es tablet Y tiene tamaño apropiado
    const esTelefono = patronesTelefono.some(patron => patron.test(ua)) && !esTablet;

    cache.esTelefonoMovil = esTelefono || (esMovil() && esTamanoTelefono && !esTablet);
    return cache.esTelefonoMovil;
}

// Escuchar cambios de orientación para invalidar cache
if (globalThis.window !== undefined) {
    globalThis.addEventListener('orientationchange', () => {
        cache.esMovil = null;
        cache.esTelefonoMovil = null;
    });
}
