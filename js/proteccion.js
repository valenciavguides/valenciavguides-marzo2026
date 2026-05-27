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

    // Permitir DevTools en entornos de desarrollo/pruebas.
    // Mantener protección activa solo en el dominio real de producción.
    const host = (location.hostname || '').toLowerCase();
    const esLocalhost = (host === 'localhost' || host === '127.0.0.1' || host === '');
    const esGitHubPages = host.endsWith('.github.io');
    const esVercelPreview = host.endsWith('.vercel.app');
    const esNetlifyPreview = host.endsWith('.netlify.app');
    const esMovil = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
    const debugPorQuery = /(?:^|[?&])vv_debug=1(?:&|$)/.test(location.search || '');
    const debugPorStorage = (() => {
        try { return localStorage.getItem('vv_debug') === '1'; } catch (_e) { return false; }
    })();
    const proteccionDuraPorQuery = /(?:^|[?&])vv_hard_protect=1(?:&|$)/.test(location.search || '');
    const proteccionDuraPorStorage = (() => {
        try { return localStorage.getItem('vv_hard_protect') === '1'; } catch (_e) { return false; }
    })();
    const LIMPIEZA_DESTRUCTIVA_ACTIVA = proteccionDuraPorQuery || proteccionDuraPorStorage;
    const PROTECCION_DEVTOOLS_ACTIVA = LIMPIEZA_DESTRUCTIVA_ACTIVA;

    const ES_ENTORNO_PRUEBAS = esLocalhost || esGitHubPages || esVercelPreview || esNetlifyPreview || debugPorQuery || debugPorStorage;
    if (ES_ENTORNO_PRUEBAS) return;

    // === 1. BLOQUEO DE ATAJOS DE TECLADO ===
    if (PROTECCION_DEVTOOLS_ACTIVA) {
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
    }

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
    var _deteccionesConsecutivas = 0;

    // Método 1: debugger trap periódico
    (function _bucleAntiDebug() {
        if (!PROTECCION_DEVTOOLS_ACTIVA) return;
        if (!_antiDebugActivo) return;
        if (document.hidden || !document.hasFocus()) {
            setTimeout(_bucleAntiDebug, 3500 + Math.random() * 2000);
            return;
        }

        var inicio = performance.now();
        // Si alguien tiene DevTools abierto con pausa en debugger, el tiempo dispara
        try {
            (function() { debugger; })();
        } catch(e) {}
        var duracion = performance.now() - inicio;
        if (duracion > 800) {
            _deteccionesDevtools++;
            _deteccionesConsecutivas++;
            if (_deteccionesConsecutivas > 2) {
                // Limpiar datos sensibles de memoria tras múltiples detecciones
                _limpiarDatosSensibles();
            }
        } else {
            _deteccionesConsecutivas = 0;
        }
        setTimeout(_bucleAntiDebug, 3000 + Math.random() * 2000);
    })();

    // Método 2: Detección por tamaño de ventana vs viewport
    var _ultimoChequeo = 0;
    globalThis.addEventListener('resize', function() {
        if (!PROTECCION_DEVTOOLS_ACTIVA) return;

        // En móvil el resize ocurre constantemente (barra URL, teclado, rotación).
        // Evitar falsos positivos que terminan rompiendo la app.
        if (esMovil) return;

        if (document.hidden || !document.hasFocus()) return;

        var ahora = Date.now();
        if (ahora - _ultimoChequeo < 1000) return;
        _ultimoChequeo = ahora;
        var umbral = 160;
        var anchoDevtools = globalThis.outerWidth - globalThis.innerWidth > umbral;
        var altoDevtools = globalThis.outerHeight - globalThis.innerHeight > umbral;
        if (anchoDevtools || altoDevtools) {
            _deteccionesDevtools++;
            if (_deteccionesDevtools > 3) {
                _limpiarDatosSensibles();
            }
        }
    });

    // === 5. LIMPIEZA DE DATOS SENSIBLES ANTE INSPECCIÓN ===
    function _limpiarDatosSensibles() {
        // Por defecto NO usar limpieza destructiva en cliente porque puede romper
        // flujos legítimos (ej. reanudación de aventura en móvil).
        if (!LIMPIEZA_DESTRUCTIVA_ACTIVA) return;

        try {
            // Borrar referencias globales a datos de aventura
            if (globalThis.RETOS_AVENTURAS) { Object.keys(globalThis.RETOS_AVENTURAS).forEach(function(k) { delete globalThis.RETOS_AVENTURAS[k]; }); }
            if (globalThis.TEXTOS_AVENTURAS) { Object.keys(globalThis.TEXTOS_AVENTURAS).forEach(function(k) { delete globalThis.TEXTOS_AVENTURAS[k]; }); }
            if (globalThis.__vv_coordenadasAventura) { globalThis.__vv_coordenadasAventura = null; }
            if (globalThis.AVENTURA_PARADAS) { globalThis.AVENTURA_PARADAS = null; }
        } catch(e) { /* fail silently */ }
    }

    // === 6. PROTECCIÓN DE console.log PARA DATOS ===
    // Sobrescribir console.table y console.dir para que no expongan objetos de datos
    var _origTable = console.table;
    var _origDir = console.dir;
    console.table = function() {
        var args = Array.prototype.slice.call(arguments);
        var hayDatosSensibles = args.some(function(a) {
            return a && (a === globalThis.RETOS_AVENTURAS || a === globalThis.TEXTOS_AVENTURAS ||
                         a === globalThis.DATOS_AVENTURAS || a === globalThis.__vv_coordenadasAventura);
        });
        if (hayDatosSensibles) return;
        return _origTable.apply(console, args);
    };
    console.dir = function() {
        var args = Array.prototype.slice.call(arguments);
        var hayDatosSensibles = args.some(function(a) {
            return a && (a === globalThis.RETOS_AVENTURAS || a === globalThis.TEXTOS_AVENTURAS ||
                         a === globalThis.DATOS_AVENTURAS || a === globalThis.__vv_coordenadasAventura);
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
