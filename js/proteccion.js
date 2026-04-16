/**
 * @fileoverview Protección anti-inspección y anti-copia para Valencia be Guides
 * @version 1.0.0
 *
 * Medidas implementadas:
 * 1. Bloqueo de teclas de DevTools (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 * 2. Bloqueo de clic derecho en contenido multimedia
 * 3. Bloqueo de arrastrar imágenes/audio/video
 * 4. Detección de DevTools abierto (anti-debugging)
 * 5. Ofuscación de acceso a datos sensibles vía consola
 * 6. Funciones de codificación/decodificación para respuestas de retos
 */

(function() {
    'use strict';

    // Permitir DevTools en localhost para desarrollo
    const ES_LOCALHOST = (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '');
    if (ES_LOCALHOST) return;

    // === 1. BLOQUEO DE ATAJOS DE TECLADO ===
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Ctrl+Shift+I (Inspector)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Ctrl+Shift+C (Element picker)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // === 2. BLOQUEO DE CLIC DERECHO EN CONTENIDO ===
    document.addEventListener('contextmenu', function(e) {
        // Bloquear en todo el documento para proteger contenido
        e.preventDefault();
        return false;
    }, true);

    // === 3. BLOQUEO DE ARRASTRAR MULTIMEDIA ===
    document.addEventListener('dragstart', function(e) {
        var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag === 'img' || tag === 'audio' || tag === 'video' || tag === 'source' || tag === 'a') {
            e.preventDefault();
            return false;
        }
    }, true);

    // === 4. ANTI-DEBUGGING (TRAMPA DEBUGGER) ===
    var _antiDebugActivo = true;
    var _deteccionesDevtools = 0;

    // Método 1: debugger trap periódico
    (function _bucleAntiDebug() {
        if (!_antiDebugActivo) return;
        var inicio = performance.now();
        // Si alguien tiene DevTools abierto con pausa en debugger, el tiempo dispara
        try {
            (function() { debugger; })();
        } catch(e) {}
        var duracion = performance.now() - inicio;
        if (duracion > 100) {
            _deteccionesDevtools++;
            if (_deteccionesDevtools > 2) {
                // Limpiar datos sensibles de memoria tras múltiples detecciones
                _limpiarDatosSensibles();
            }
        }
        setTimeout(_bucleAntiDebug, 3000 + Math.random() * 2000);
    })();

    // Método 2: Detección por tamaño de ventana vs viewport
    var _ultimoChequeo = 0;
    window.addEventListener('resize', function() {
        var ahora = Date.now();
        if (ahora - _ultimoChequeo < 1000) return;
        _ultimoChequeo = ahora;
        var umbral = 160;
        var anchoDevtools = window.outerWidth - window.innerWidth > umbral;
        var altoDevtools = window.outerHeight - window.innerHeight > umbral;
        if (anchoDevtools || altoDevtools) {
            _deteccionesDevtools++;
            if (_deteccionesDevtools > 3) {
                _limpiarDatosSensibles();
            }
        }
    });

    // === 5. LIMPIEZA DE DATOS SENSIBLES ANTE INSPECCIÓN ===
    function _limpiarDatosSensibles() {
        try {
            // Borrar referencias globales a datos de aventura
            if (window.RETOS_AVENTURAS) { Object.keys(window.RETOS_AVENTURAS).forEach(function(k) { delete window.RETOS_AVENTURAS[k]; }); }
            if (window.TEXTOS_AVENTURAS) { Object.keys(window.TEXTOS_AVENTURAS).forEach(function(k) { delete window.TEXTOS_AVENTURAS[k]; }); }
            if (window.__vv_coordenadasAventura) { window.__vv_coordenadasAventura = null; }
            if (window.AVENTURA_PARADAS) { window.AVENTURA_PARADAS = null; }
        } catch(e) { /* fail silently */ }
    }

    // === 6. PROTECCIÓN DE console.log PARA DATOS ===
    // Sobrescribir console.table y console.dir para que no expongan objetos de datos
    var _origTable = console.table;
    var _origDir = console.dir;
    console.table = function() {
        var args = Array.prototype.slice.call(arguments);
        var hayDatosSensibles = args.some(function(a) {
            return a && (a === window.RETOS_AVENTURAS || a === window.TEXTOS_AVENTURAS ||
                         a === window.DATOS_AVENTURAS || a === window.__vv_coordenadasAventura);
        });
        if (hayDatosSensibles) return;
        return _origTable.apply(console, args);
    };
    console.dir = function() {
        var args = Array.prototype.slice.call(arguments);
        var hayDatosSensibles = args.some(function(a) {
            return a && (a === window.RETOS_AVENTURAS || a === window.TEXTOS_AVENTURAS ||
                         a === window.DATOS_AVENTURAS || a === window.__vv_coordenadasAventura);
        });
        if (hayDatosSensibles) return;
        return _origDir.apply(console, args);
    };

    // === 7. BLOQUEO DE SELECCIÓN DE TEXTO EN CONTENIDO SENSIBLE ===
    var style = document.createElement('style');
    style.textContent = [
        '.protegido, .reto-contenido, .audio-container, .texto-aventura {',
        '  -webkit-user-select: none;',
        '  -moz-user-select: none;',
        '  -ms-user-select: none;',
        '  user-select: none;',
        '}'
    ].join('\n');
    document.head.appendChild(style);

})();
