/**
 * js/almacenamiento.js — el único acceso de la app a localStorage y sessionStorage.
 *
 * Es un script clásico, no un módulo: lo necesitan también scripts clásicos (js/proteccion.js, js/suppress-warnings.js y dos
 * bloques clásicos del padre) que corren antes que cualquier módulo. Cada página que toca el almacenamiento lo carga en su
 * <head> antes que cualquier script que lo use (el padre, la selección y hijo1 a hijo5) y lo encuentra en
 * globalThis.almacen. ESLint prohíbe
 * localStorage y sessionStorage fuera de este fichero (eslint.config.js).
 *
 * - Nunca lanza. leer() devuelve null si no hay valor o si falla; escribir(), borrar() y vaciar() devuelven false si
 *   fallan. leerJSON() devuelve null también si lo guardado no es JSON válido, y lo borra: lo que no se puede leer no se
 *   podrá leer nunca.
 * - Siempre lo dice, una vez: el primer fallo de cada operación sobre cada clave sale en el log, como error si es una
 *   escritura (se pueden perder datos) y como aviso si es una lectura o un borrado. En un móvil falla de verdad: con las
 *   cookies bloqueadas, tocar localStorage lanza; con el almacenamiento lleno, escribir lanza; y un valor guardado puede
 *   llegar roto.
 * - Solo acepta las claves de CLAVES: lo que la app guarda en el dispositivo está escrito aquí y en ningún otro sitio. Todo
 *   ello lo puede leer y cambiar el dueño del dispositivo.
 */
(function () {
    'use strict';

    /** Lo que la app guarda en el dispositivo. */
    const CLAVES = Object.freeze({
        // ── localStorage ──
        IDIOMA: 'vv_idioma',                                    // el idioma elegido; la interfaz habla en él antes de elegir
        AVENTURA_INICIADA: 'vv_aventura_iniciada',              // la aventura arrancada: { aventura, idioma, modo, dev, timestamp }
        PROGRESO: 'vv_progreso',                                // por dónde va la aventura (persistProgressState)
        PARADAS_COMPLETADAS: 'vv_paradas_completadas',          // las paradas completadas de la aventura
        SW_ACTUALIZACION_PENDIENTE: 'vv_sw_update_pendiente',   // hay una versión nueva por aplicar (bloque del service worker del padre)
        DEBUG: 'vv_debug',                                      // depuración: sin la protección de la consola (js/proteccion.js)
        PROTECCION_DURA: 'vv_hard_protect',                     // depuración: la protección dura (js/proteccion.js)
        DEBUG_VERBOSE: 'vv_debug_verbose',                      // depuración: la consola sin filtrar (js/suppress-warnings.js)
        // ── sessionStorage ──
        TOKEN_SESION: 'vbg_session_token',                      // el token de sesión del backend (js/api-client.js)
    });

    /** Las claves de una aventura guardada: lo que se borra al abandonarla. */
    const AVENTURA_GUARDADA = Object.freeze([CLAVES.AVENTURA_INICIADA, CLAVES.PROGRESO, CLAVES.PARADAS_COMPLETADAS]);

    const registradas = new Set(Object.values(CLAVES));
    const avisados = new Set();

    function avisar(nivel, almacen, operacion, clave, error) {
        const huella = `${almacen}|${operacion}|${clave}|${error?.name || ''}`;
        if (avisados.has(huella)) return;
        avisados.add(huella);
        (globalThis.logger || console)[nivel](`[ALMACEN] ${almacen}.${operacion}('${clave}') ha fallado: ${error?.name || 'Error'}: ${error?.message || error}`);
    }

    function crear(nombre) {
        const corto = nombre === 'localStorage' ? 'local' : 'sesion';
        const registrada = (operacion, clave) => {
            if (registradas.has(clave)) return true;
            avisar('error', corto, operacion, clave, new Error('la clave no está en CLAVES (js/almacenamiento.js)'));
            return false;
        };
        // El acceso a globalThis.localStorage (o sessionStorage) va siempre dentro del try: con el almacenamiento
        // bloqueado, ya leer la propiedad lanza.
        const api = {
            leer(clave) {
                if (!registrada('leer', clave)) return null;
                try { return globalThis[nombre].getItem(clave); } catch (e) { avisar('warn', corto, 'leer', clave, e); return null; }
            },
            escribir(clave, valor) {
                if (!registrada('escribir', clave)) return false;
                if (typeof valor !== 'string') {
                    avisar('error', corto, 'escribir', clave, new TypeError('el valor no es texto (para un objeto, escribirJSON)'));
                    return false;
                }
                try { globalThis[nombre].setItem(clave, valor); return true; } catch (e) { avisar('error', corto, 'escribir', clave, e); return false; }
            },
            borrar(clave) {
                if (!registrada('borrar', clave)) return false;
                try { globalThis[nombre].removeItem(clave); return true; } catch (e) { avisar('warn', corto, 'borrar', clave, e); return false; }
            },
            vaciar() {
                try { globalThis[nombre].clear(); return true; } catch (e) { avisar('warn', corto, 'vaciar', '*', e); return false; }
            },
            leerJSON(clave) {
                const texto = api.leer(clave);
                if (texto === null) return null;
                try { return JSON.parse(texto); } catch (e) {
                    avisar('error', corto, 'leerJSON', clave, e);
                    api.borrar(clave);
                    return null;
                }
            },
            escribirJSON(clave, valor) {
                let texto;
                try { texto = JSON.stringify(valor); } catch (e) { avisar('error', corto, 'escribirJSON', clave, e); return false; }
                return api.escribir(clave, texto);
            },
        };
        return Object.freeze(api);
    }

    globalThis.almacen = Object.freeze({
        CLAVES,
        AVENTURA_GUARDADA,
        local: crear('localStorage'),
        sesion: crear('sessionStorage'),
    });
})();
