/**
 * @fileoverview Sistema de validación para ValenciaVGuides
 * @version 3.0.0
 *
 * Solo validarCoordenadas() tiene caller real hoy (funciones-mapa.js). El resto de esta
 * librería (validarDato/validarMensaje/validarParada/validarSchema/sanitizarString/
 * sanitizarObjeto/registrarValidador, con soporte de tipos, sanitización XSS y schemas)
 * se retiró en la auditoría de 2026-08-03: 0 callers en todo el proyecto, solo
 * alcanzable manualmente vía un agregador de debug sin ningún uso en el flujo real de la
 * app. `state-manager.js` tiene su propia validación de mensajes independiente
 * (`_assertMensajeValido`) y nunca reutilizó `validarMensaje()` de aquí. Ver
 * docs/GUIA-COMPLETA.md §26.3 para el detalle verificado.
 */

/**
 * Valida coordenadas geográficas
 * @param {Object} coords - Coordenadas a validar
 * @returns {Object} Resultado { valido, error, coordenadas }
 */
export function validarCoordenadas(coords) {
    if (!coords || typeof coords !== 'object') {
        return { valido: false, error: 'Coordenadas inválidas', coordenadas: null };
    }

    const lat = coords.lat === undefined ? coords.latitude : coords.lat;
    const lng = coords.lng === undefined ? coords.longitude : coords.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return { valido: false, error: 'Latitud y longitud deben ser números', coordenadas: null };
    }

    if (lat < -90 || lat > 90) {
        return { valido: false, error: 'Latitud fuera de rango (-90 a 90)', coordenadas: null };
    }

    if (lng < -180 || lng > 180) {
        return { valido: false, error: 'Longitud fuera de rango (-180 a 180)', coordenadas: null };
    }

    // Verificar que no sean coordenadas nulas (0,0)
    if (lat === 0 && lng === 0) {
        return { valido: false, error: 'Coordenadas en origen (posible error)', coordenadas: null };
    }

    return {
        valido: true,
        error: null,
        coordenadas: { lat, lng }
    };
}
