/**
 * @fileoverview Supresión de advertencias innecesarias en consola
 * @version 1.0.0
 * 
 * Este script debe cargarse lo más temprano posible para
 * filtrar mensajes de advertencia no relevantes de la consola.
 */

(function() {
    'use strict';
    
    // Guardar referencias originales
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalDebug = console.debug;
    
    /**
     * Patrones de advertencias a suprimir
     * @type {Array<RegExp>}
     */
    const patronesSuprimir = [
        // Advertencias de Mapbox que no afectan funcionalidad
        /mapbox-gl/i,
        /This page appears to be missing CSS/i,
        
        // Advertencias de deprecación menores
        /Synchronous XMLHttpRequest/i,
        
        // Advertencias de fuentes
        /downloadable font/i,
        /Font.*failed to decode/i,
        
        // Advertencias de third-party que no controlamos
        /third-party cookie/i,
        /SameSite cookie/i,
        
        // Advertencias de desarrollo
        /DevTools/i,
        /Source map/i,

        // Ruido de extensiones de navegador (no controlado por la app)
        /grammarly/i,

        // Mensajes de mensajería no críticos y esperables
        /sin handler.*SISTEMA\.(ACK|CONFIRMACION)/i,
        /SISTEMA\.(ACK|CONFIRMACION).*sin handler/i,

        // Mensajes informativos de orientación no críticos
        /SUPPRESS_ROTATION/i
    ];
    
    /**
     * Patrones de errores a suprimir (solo errores conocidos no críticos)
     * @type {Array<RegExp>}
     */
    const patronesErrorSuprimir = [
        // Errores de recursos que fallan silenciosamente
        /Failed to load resource.*favicon/i,
        
        // Errores de CORS conocidos y manejados
        /CORS.*blocked/i,

        // Ruido típico de extensiones inyectadas
        /grammarly/i
    ];

    /**
     * Patrones de debug a suprimir (solo ruido benigno)
     * @type {Array<RegExp>}
     */
    const patronesDebugSuprimir = [
        /\[mensajeria\].*sin handler/i,
        /SUPPRESS_ROTATION/i,
        /grammarly/i
    ];

    const debugVerbose = (function() {
        try {
            const ls = globalThis.localStorage;
            if (ls && (ls.getItem('vv_debug_verbose') === '1' || ls.getItem('vv_debug_verbose') === 'true')) {
                return true;
            }
        } catch {
            // ignore
        }

        try {
            return typeof globalThis.location?.search === 'string' && /[?&]debug=1\b/i.test(globalThis.location.search);
        } catch {
            return false;
        }
    })();
    
    /**
     * Verifica si un mensaje debe ser suprimido
     * @param {Array<RegExp>} patrones - Patrones a verificar
     * @param {Array} args - Argumentos del mensaje
     * @returns {boolean} True si debe suprimirse
     */
    const debeSuprimir = function(patrones, args) {
        const mensaje = args.map(arg => {
            if (typeof arg === 'string') return arg;
            if (arg instanceof Error) return arg.message;
            try {
                return JSON.stringify(arg);
            } catch {
                return String(arg);
            }
        }).join(' ');
        
        return patrones.some(patron => patron.test(mensaje));
    };
    
    /**
     * Wrapper para console.warn
     */
    console.warn = function(...args) {
        if (!debeSuprimir(patronesSuprimir, args)) {
            originalWarn.apply(console, args);
        }
    };
    
    /**
     * Wrapper para console.error (solo suprime errores conocidos no críticos)
     */
    console.error = function(...args) {
        if (!debeSuprimir(patronesErrorSuprimir, args)) {
            originalError.apply(console, args);
        }
    };

    /**
     * Wrapper para console.debug
     * - En modo normal: reduce ruido benigno
     * - En modo verbose (localStorage/query): conserva trazas completas
     */
    console.debug = function(...args) {
        if (debugVerbose) {
            originalDebug.apply(console, args);
            return;
        }

        if (!debeSuprimir(patronesDebugSuprimir, args)) {
            originalDebug.apply(console, args);
        }
    };
    
    // Log de inicialización (usando original para asegurar que se muestre)
    if (globalThis.window !== undefined && globalThis.location.hostname === 'localhost') {
        originalWarn.call(console, '[suppress-warnings] Filtro de advertencias activo');
    }
    
    // Exponer función para restaurar consola original si es necesario
    if (globalThis.window !== undefined) {
        globalThis.__vv_restaurarConsola = function() {
            console.warn = originalWarn;
            console.error = originalError;
            console.debug = originalDebug;
            console.log('[suppress-warnings] Consola restaurada');
        };

        globalThis.__vv_debugVerbose = function(enabled = true) {
            try {
                const value = enabled ? '1' : '0';
                globalThis.localStorage?.setItem('vv_debug_verbose', value);
                originalWarn.call(console, `[suppress-warnings] vv_debug_verbose=${value}. Recarga la página para aplicar totalmente.`);
            } catch (err) {
                originalWarn.call(console, '[suppress-warnings] No se pudo persistir vv_debug_verbose:', err && err.message);
            }
        };
    }
})();