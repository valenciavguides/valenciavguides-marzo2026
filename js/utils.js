/**
 * @fileoverview Utilidades generales para ValenciaVGuides
 * @version 2.0.0
 *
 * Funciones de utilidad comunes usadas a lo largo de toda la aplicación.
 */

// El tipo del informe de errores (ver _mandarErrorAlPadre) sale de constants.js, igual en todos los
// frames. La copia `globalThis.TIPOS_MENSAJE` no sirve aquí: solo la publican el padre, la selección
// y video-intro, y en los seis hijos no existe.
import { TIPOS_MENSAJE } from './constants.js';

/**
 * Canonicaliza un modo a su forma estándar
 * @param {string} modo - Modo a canonicalizar
 * @returns {string|null} 'casa' | 'aventura' | null si no es válido
 */
export function canonicalizarModo(modo) {
    if (!modo) return null;
    const modoStr = String(modo).toLowerCase().trim();
    return modoStr === 'casa' || modoStr === 'aventura' ? modoStr : null;
}

/**
 * Genera un ID único
 * @param {string} [prefijo=''] - Prefijo opcional para el ID
 * @returns {string} ID único generado
 */
export function generarIdUnico(prefijo = '') {
    const timestamp = Date.now().toString(36);
    const aleatorio = Math.random().toString(36).substring(2, 9);
    return prefijo ? `${prefijo}_${timestamp}_${aleatorio}` : `${timestamp}_${aleatorio}`;
}

/**
 * Normaliza un array de paradas a un formato consistente
 * @param {Array|Object} paradas - Paradas a normalizar
 * @returns {Array} Array de paradas normalizado
 */
export function normalizarParadas(paradas) {
    if (!paradas) return [];

    // Si ya es un array, procesarlo
    if (Array.isArray(paradas)) {
        return paradas.map((parada, index) => normalizarParada(parada, index));
    }

    // Si es un objeto con propiedades numéricas o IDs
    if (typeof paradas === 'object') {
        return Object.entries(paradas).map(([key, value], index) => {
            const parada = typeof value === 'object' ? value : { id: key, valor: value };
            return normalizarParada(parada, index);
        });
    }

    return [];
}

/**
 * Normaliza una parada individual
 * @param {Object|string} parada - Parada a normalizar
 * @param {number} index - Índice de la parada
 * @returns {Object} Parada normalizada
 */
function normalizarParada(parada, index) {
    if (typeof parada === 'string') {
        return {
            id: parada,
            index,
            nombre: parada
        };
    }

    if (typeof parada === 'object' && parada !== null) {
        return {
            id: parada.id || parada.ID || parada.parada_id || `parada_${index}`,
            index: parada.index === undefined ? index : parada.index,
            nombre: parada.nombre || parada.name || parada.titulo || `Parada ${index + 1}`,
            coordenadas: parada.coordenadas || parada.coords || null,
            audio: parada.audio || null,
            reto: parada.reto || null,
            ...parada
        };
    }

    return {
        id: `parada_${index}`,
        index,
        nombre: `Parada ${index + 1}`
    };
}

/**
 * Resuelve IDs de parada a partir de diferentes formatos
 * @param {*} input - Input que puede contener IDs de parada
 * @returns {{paradaId: string|null, padreId: string|null, ids: Array<string>}} IDs resueltos en formato canónico
 */
function _stripPadrePrefix(valor) {
    return String(valor).trim().replace(/^(padre-)+/i, '');
}

function _normalizarParadaId(valor) {
    if (valor === undefined || valor === null) return null;
    const raw = String(valor).trim();
    if (!raw) return null;
    return /^padre-/i.test(raw) ? _stripPadrePrefix(raw) : raw;
}

function _normalizarPadreId(valor) {
    if (valor === undefined || valor === null) return null;
    const raw = String(valor).trim();
    if (!raw) return null;
    return 'padre-' + raw.replace(/^(padre-)+/i, '');
}

function _registrarId(idsSet, valor) {
    if (valor === undefined || valor === null) return;
    const raw = String(valor).trim();
    if (!raw) return;
    idsSet.add(raw);
}

function _resolverDesdeArray(input, idsSet, resultado) {
    for (const item of input) {
        const parcial = resolverIdsParada(item);
        parcial.ids.forEach(v => _registrarId(idsSet, v));
        if (!resultado.paradaId && parcial.paradaId) resultado.paradaId = parcial.paradaId;
        if (!resultado.padreId && parcial.padreId) resultado.padreId = parcial.padreId;
    }
    resultado.ids = Array.from(idsSet);
}

/**
 * ¿Este id es de un tramo? ÚNICO sitio donde eso se decide a partir de un id.
 *
 * El discriminante es el segmento `-TR-`, no el principio de la cadena: los ids reales
 * llevan delante la aventura (`Av1-TR-1`, `Av34km-TR-12`), así que ni `startsWith('TR-')`
 * ni `startsWith('TR')` aciertan jamás — medido sobre `js/coordenadas-aventuras.js`, 0 de
 * sus 846 ids empiezan por TR y 240 contienen `-TR-`.
 *
 * Un test que nunca acierta no da error: devuelve `false`, el `||` que suele rodearlo sigue
 * adelante con el otro operando, y la red de seguridad parece puesta sin estarlo. Por eso
 * esto es UNA función y no una comparación repetida: cuando la misma decisión se toma en
 * ocho sitios, lo que ocurre es que unos se arreglan y otros no.
 *
 * Esto es solo para cuando el id es lo ÚNICO que hay. Si se dispone de la entrada real de
 * `coordenadas-aventuras.js`, mandan su campo `.tipo` y esta función sobra.
 */
export function esIdDeTramo(id) {
    return typeof id === 'string' && id.includes('-TR-');
}

export function resolverIdsParada(input) {
    const resultado = { paradaId: null, padreId: null, ids: [] };
    if (!input) return resultado;
    const idsSet = new Set();

    if (typeof input === 'string' || typeof input === 'number') {
        String(input).split(',').map(id => id.trim()).filter(Boolean)
            .forEach(v => _registrarId(idsSet, v));
        const primero = Array.from(idsSet)[0] || null;
        if (primero) {
            resultado.paradaId = _normalizarParadaId(primero);
            resultado.padreId = _normalizarPadreId(primero);
        }
        resultado.ids = Array.from(idsSet);
        return resultado;
    }

    if (Array.isArray(input)) {
        _resolverDesdeArray(input, idsSet, resultado);
        return resultado;
    }

    if (typeof input === 'object' && input !== null) {
        const paradaRaw = input.paradaId ?? input.parada_id ?? input.tramo_id ?? input.id ?? input.ID ?? null;
        const padreRaw = input.padreId ?? input.padreid ?? null;
        _registrarId(idsSet, paradaRaw);
        _registrarId(idsSet, padreRaw);
        resultado.paradaId = _normalizarParadaId(paradaRaw || padreRaw);
        resultado.padreId = _normalizarPadreId(padreRaw || paradaRaw);
        resultado.ids = Array.from(idsSet);
        return resultado;
    }

    return resultado;
}

/**
 * Ajusta el timeout basado en la calidad de la conexión
 * @param {number} timeoutBase - Timeout base en ms
 * @param {number} [factor=1] - Factor multiplicador
 * @returns {number} Timeout ajustado
 */
export function ajustarTimeoutPorConexion(timeoutBase, factor = 1) {
    const connection = navigator.connection ||
                       navigator.mozConnection ||
                       navigator.webkitConnection;

    if (!connection) {
        return timeoutBase * factor;
    }

    // Ajustar según tipo de conexión
    const ajustes = {
        'slow-2g': 4,
        '2g': 3,
        '3g': 2,
        '4g': 1,
        '5g': 0.8
    };

    const ajuste = ajustes[connection.effectiveType] || 1;
    return Math.round(timeoutBase * factor * ajuste);
}

/**
 * Reintenta una operación hasta que esté disponible
 * @param {Function} checkFn - Función que retorna true cuando está listo
 * @param {Object} [options] - Opciones
 * @param {number} [options.maxIntentos=10] - Máximo de intentos
 * @param {number} [options.intervalo=100] - Intervalo entre intentos (ms)
 * @param {string} [options.mensaje=''] - Mensaje de log
 * @returns {Promise<boolean>} Promise que resuelve cuando está listo
 */
export function retryUntilAvailable(checkFn, options) {
    const { maxIntentos = 10, intervalo = 100, mensaje = '' } = options ?? {};

    return new Promise((resolve) => {
        let intentos = 0;

        const intentar = function() {
            intentos++;

            try {
                if (checkFn()) {
                    if (mensaje) (globalThis.logger || console).info(`[utils] ${mensaje} - disponible después de ${intentos} intentos`);
                    resolve(true);
                    return;
                }
            } catch {
                // Ignorar errores en checkFn
            }

            if (intentos >= maxIntentos) {
                if (mensaje) (globalThis.logger || console).warn(`[utils] ${mensaje} - no disponible después de ${maxIntentos} intentos`);
                resolve(false);
                return;
            }

            setTimeout(intentar, intervalo);
        };

        intentar();
    });
}

/**
 * Debounce de una función
 * @param {Function} fn - Función a ejecutar
 * @param {number} espera - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export function debounce(fn, espera) {
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), espera);
    };
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Pedir un dato: una sola forma, con plazo y reintentos (estudio K-175, guía §25.18) ─────────────────────────────
//
// Todo lo que la app descarga a demanda pasa por pedirConReintentos(): la API (fetchWithRetry, js/api-client.js), los
// JSON que se piden sin token (pedirJson: los párrafos, la demo de la selección, los textos de Jaime) y los módulos de
// datos (importarConReintentos). Antes cada pieza pedía a su manera y solo la API tenía plazo y reintentos, con dos
// huecos medidos: el plazo agotado no se reintentaba, y en WebKit tampoco el corte de red, porque el filtro buscaba la
// palabra «fetch» en un mensaje que allí es «Load failed». Y el plazo solo llegaba hasta las cabeceras: un cuerpo que se
// atascaba no tenía límite.

/** Plazo de cada intento: hasta la respuesta ENTERA (cabeceras y cuerpo). */
const PLAZO_PETICION_MS = 15000;
/** Reintentos después del primer intento. */
const REINTENTOS_PETICION = 4;
/** Espera antes del primer reintento; se dobla en cada uno: 1 s, 2 s, 4 s y 8 s. */
const ESPERA_BASE_REINTENTO_MS = 1000;

/**
 * Lo que dice una cabecera `Retry-After` (segundos o una fecha), en milisegundos desde ahora; undefined si no dice nada.
 * @param {string|null} valor
 * @returns {number|undefined}
 */
export function msDeRetryAfter(valor) {
    if (!valor) return undefined;
    const segundos = Number(valor);
    if (Number.isFinite(segundos)) return Math.max(0, segundos * 1000);
    const fecha = Date.parse(valor);
    return Number.isFinite(fecha) ? Math.max(0, fecha - Date.now()) : undefined;
}

/**
 * Si un fallo merece otro intento: el plazo vencido, un 5xx, un 429 y el corte de red. El corte de red es un `TypeError`
 * en los tres motores (su mensaje cambia: «Failed to fetch», «NetworkError…», «Load failed»), y también lo es el de un
 * `import()` que no llega, que además no dice su estado HTTP. Un 4xx es la respuesta del servidor y no se reintenta; un
 * error de formato (`SyntaxError`) tampoco.
 */
function _esReintentable(error) {
    if (error?.plazoVencido) return true;
    const estado = error?.status ?? error?.statusCode;
    if (Number.isInteger(estado) && estado > 0) return estado >= 500 || estado === 429;
    return error?.name === 'TypeError';
}

function _motivoDelFallo(error) {
    if (error?.plazoVencido) return 'sin respuesta en el plazo';
    const estado = error?.status ?? error?.statusCode;
    if (Number.isInteger(estado) && estado > 0) return `HTTP ${estado}`;
    return error?.message || String(error);
}

/**
 * Pide algo a la red con plazo y reintentos. `pedir(intento, señal)` hace UN intento (el primero es el 0) y recibe una
 * señal que se aborta al vencer su plazo: quien hace un `fetch` se la pasa, y así el plazo corta también el cuerpo. Un
 * intento que no termina en el plazo se da por perdido aunque no se pueda abortar (un `import()`). Entre intentos espera
 * la base doblada en cada uno, o lo que diga un 429 (`error.reintentarTrasMs`) si es más. Al rendirse lanza el error del
 * último intento, y cada llamador lo trata como siempre; el plazo vencido llega con `name === 'TimeoutError'` y
 * `plazoVencido: true`. Cada reintento y cada rendición se dicen en la consola.
 * @template T
 * @param {(intento: number, señal: AbortSignal) => Promise<T>} pedir
 * @param {{plazoMs?: number, reintentos?: number, esperaBaseMs?: number, descripcion?: string}} [opciones]
 * @returns {Promise<T>}
 */
export async function pedirConReintentos(pedir, opciones = {}) {
    const {
        plazoMs = PLAZO_PETICION_MS,
        reintentos = REINTENTOS_PETICION,
        esperaBaseMs = ESPERA_BASE_REINTENTO_MS,
        descripcion = 'petición',
    } = opciones;
    const logger = globalThis.logger || console;
    for (let intento = 0; ; intento++) {
        const control = new AbortController();
        let temporizador;
        const plazo = new Promise((_resuelve, rechaza) => {
            temporizador = setTimeout(() => {
                const vencido = new Error(`${descripcion}: sin respuesta en ${plazoMs} ms`);
                vencido.name = 'TimeoutError';
                vencido.plazoVencido = true;
                rechaza(vencido);
                control.abort(vencido);
            }, plazoMs);
        });
        try {
            return await Promise.race([pedir(intento, control.signal), plazo]);
        } catch (error) {
            const reintentable = _esReintentable(error);
            if (intento >= reintentos || !reintentable) {
                if (reintentable) logger.warn(`[pedir] ${descripcion}: se rinde tras ${intento + 1} intentos (${_motivoDelFallo(error)})`);
                throw error;
            }
            const espera = Math.max(error?.reintentarTrasMs ?? 0, esperaBaseMs * 2 ** intento);
            logger.info(`[pedir] ${descripcion}: intento ${intento + 1} fallido (${_motivoDelFallo(error)}); otro en ${espera} ms`);
            await sleep(espera);
        } finally {
            clearTimeout(temporizador);
        }
    }
}

/**
 * Un JSON que se pide sin token: los párrafos (js/data-loader.js), la demo de la selección y los textos de Jaime. Por
 * pedirConReintentos; una respuesta que no es 2xx falla con su `status`.
 * @param {string|URL} url - Relativa a la página que llama, como cualquier fetch
 * @param {object} [opciones] - Las de pedirConReintentos
 * @returns {Promise<any>}
 */
export function pedirJson(url, opciones = {}) {
    return pedirConReintentos(async (_intento, senal) => {
        const respuesta = await fetch(url, { signal: senal });
        if (!respuesta.ok) {
            const error = new Error(`${url}: HTTP ${respuesta.status}`);
            error.status = respuesta.status;
            error.reintentarTrasMs = msDeRetryAfter(respuesta.headers.get('Retry-After'));
            throw error;
        }
        return respuesta.json();
    }, { descripcion: String(url), ...opciones });
}

let _reimportaciones = 0;

/**
 * Un módulo de datos con `import()`, por pedirConReintentos. El navegador recuerda un `import()` que falla: la misma
 * dirección no se vuelve a pedir en ese documento (medido en los tres motores). Por eso cada reintento cambia la dirección
 * con un `_v` que no se repite nunca, el mismo parámetro que el service worker quita de la clave de su caché (sw.js), así
 * que no deja copias de más.
 * @param {string|URL} url - Una dirección relativa se resuelve contra la PÁGINA, no contra el módulo que llama: un módulo
 *   de js/ pasa `new URL('./x.js', import.meta.url)`
 * @param {object} [opciones] - Las de pedirConReintentos
 * @returns {Promise<object>} El espacio de nombres del módulo
 */
export function importarConReintentos(url, opciones = {}) {
    const direccion = new URL(url, globalThis.location?.href);
    return pedirConReintentos((intento) => {
        if (intento === 0) return import(direccion.href);
        const otra = new URL(direccion.href);
        _reimportaciones += 1;
        otra.searchParams.set('_v', `${Date.now().toString(36)}${_reimportaciones}`);
        return import(otra.href);
    }, { descripcion: `import ${direccion.pathname}`, ...opciones });
}

/**
 * Escapa un valor para pintarlo en HTML, como texto o como valor de un atributo entre comillas
 * @param {*} valor - Lo que se va a pintar (se convierte a cadena)
 * @returns {string}
 */
export function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * Distancia entre dos coordenadas geográficas (fórmula Haversine)
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lon1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lon2 - Longitud del segundo punto
 * @returns {number} Distancia en metros
 */
export function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Punto más cercano sobre una polilínea a un punto dado (sustituye a L.GeometryUtil.closest).
 * Proyección plana local (aplanando la longitud por cos(latitud)) — precisión suficiente
 * para las distancias de un tramo de aventura (decenas/cientos de metros); no válida para
 * líneas de muchos kilómetros.
 * @param {{lat:number,lng:number}} punto - Punto de referencia (ej. posición GPS del usuario)
 * @param {Array<{lat:number,lng:number}>} puntosLinea - Vértices consecutivos de la polilínea
 * @returns {{lat:number,lng:number}|null} Punto más cercano sobre algún segmento de la línea
 */
export function puntoMasCercanoEnLinea(punto, puntosLinea) {
    if (!punto || !Number.isFinite(punto.lat) || !Number.isFinite(punto.lng)) return null;
    if (!Array.isArray(puntosLinea) || puntosLinea.length < 2) return null;

    const cosLat = Math.cos(punto.lat * Math.PI / 180);
    const toXY = p => ({ x: p.lng * cosLat, y: p.lat });
    const p = toXY(punto);

    let mejor = null;
    let mejorDistSq = Infinity;

    for (let i = 0; i < puntosLinea.length - 1; i++) {
        const a = toXY(puntosLinea[i]);
        const b = toXY(puntosLinea[i + 1]);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const lenSq = dx * dx + dy * dy;

        let t = lenSq > 0 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq : 0;
        t = Math.max(0, Math.min(1, t));

        const cx = a.x + t * dx;
        const cy = a.y + t * dy;
        const distSq = (p.x - cx) ** 2 + (p.y - cy) ** 2;

        if (distSq < mejorDistSq) {
            mejorDistSq = distSq;
            mejor = { lat: cy, lng: cx / cosLat };
        }
    }

    return mejor;
}

/* ─── Reporte automático de errores no controlados (hijo → padre) ─────────────
 *
 * Un error no capturado dentro de un iframe hijo se quedaba solo en su propia consola:
 * el padre no se enteraba de que a un hijo le había explotado algo.
 *
 * Esto lo conecta al canal que YA existe y funciona, `SISTEMA.ERROR`, con un código
 * más — no un tipo de mensaje nuevo ni un handler nuevo. `_hdl_SISTEMA_ERROR` en
 * codigo-padre.html es un despachador por `codigo`: registra siempre, y actúa solo en
 * los códigos que tienen acción asociada. `ERROR_NO_CONTROLADO` no la tiene a
 * propósito: un fallo interno no es accionable por el usuario, no se le saca cartel.
 *
 * Vive aquí, en utils.js, porque es el único módulo que cargan los SEIS hijos:
 * ponerlo en uno que solo cargan dos cubriría 2 de 6 pareciendo que cubre todo.
 *
 * Se instala solo al cargarse el módulo. No hace falta llamar a nada: si dependiera de
 * que alguien se acuerde en seis ficheros, bastaría un olvido para dejarlo mudo.
 */

const _ERRORES_MAX_DISTINTOS = 20;
const _ERRORES_COLA_MAX = 10;
const _erroresEnviados = new Set();
const _erroresEnCola = [];
let _topeYaAvisado = false;
let _capturaInstalada = false;
let _drenajePedido = false;

/** Manda un SISTEMA.ERROR ya formado. Devuelve false si la mensajería aún no existe. */
function _mandarErrorAlPadre(mensajeTexto) {
    const enviar = globalThis.mensajeria?.enviarMensaje;
    if (typeof enviar !== 'function') return false;
    try {
        enviar({
            tipo: TIPOS_MENSAJE.SISTEMA.ERROR,
            destino: 'padre',
            datos: { codigo: 'ERROR_NO_CONTROLADO', mensaje: mensajeTexto }
        });
        return true;
    } catch {
        return false;
    }
}

/**
 * Vuelca los errores ocurridos antes de que existiera la mensajería. Si nunca llega a
 * existir, se queja en consola con la cola entera: no se pierde en silencio.
 */
function _drenarColaErrores() {
    if (_drenajePedido || _erroresEnCola.length === 0) return;
    _drenajePedido = true;
    // retryUntilAvailable devuelve una Promise<boolean>: resuelve true en cuanto checkFn
    // da true, y false al agotar los intentos. No admite callbacks.
    retryUntilAvailable(
        () => typeof globalThis.mensajeria?.enviarMensaje === 'function',
        { maxIntentos: 40, intervalo: 250 }
    ).then((listo) => {
        if (listo) {
            while (_erroresEnCola.length) _mandarErrorAlPadre(_erroresEnCola.shift());
        } else {
            (globalThis.logger || console).error(
                `[utils][ERROR_NO_CONTROLADO] La mensajería nunca estuvo disponible: ${_erroresEnCola.length} error(es) de arranque no llegaron al padre`,
                _erroresEnCola.slice()
            );
            _erroresEnCola.length = 0;
        }
        _drenajePedido = false;
    });
}

/** Encola o manda un error, aplicando deduplicación y tope. */
function _reportarErrorNoControlado(clase, texto, fichero, linea) {
    const ubicacion = fichero ? ` (${fichero}${linea ? ':' + linea : ''})` : '';
    const firma = `${clase}|${texto}|${fichero}|${linea}`;

    // Deduplicación: la misma firma se manda UNA vez por sesión. Un error dentro de un
    // bucle, o en un render que se repite, inundaría el bus del padre.
    if (_erroresEnviados.has(firma)) return;

    if (_erroresEnviados.size >= _ERRORES_MAX_DISTINTOS) {
        (globalThis.logger || console).warn(`[utils][ERROR_NO_CONTROLADO] suprimido (tope alcanzado): ${texto}${ubicacion}`);
        // El tope se anuncia UNA vez: callarse sin avisar haría el silencio
        // indistinguible de "no ha vuelto a pasar nada".
        if (!_topeYaAvisado) {
            _topeYaAvisado = true;
            _mandarErrorAlPadre(`Tope de ${_ERRORES_MAX_DISTINTOS} errores distintos alcanzado; los siguientes solo se registran en la consola del hijo`);
        }
        return;
    }

    _erroresEnviados.add(firma);
    const mensajeTexto = `${clase}: ${texto}${ubicacion}`;
    if (_mandarErrorAlPadre(mensajeTexto)) return;

    // Todavía no hay mensajería (error durante el arranque): a la cola.
    if (_erroresEnCola.length < _ERRORES_COLA_MAX) _erroresEnCola.push(mensajeTexto);
    _drenarColaErrores();
}

/**
 * Instala la captura. Solo dentro de un iframe: en el padre, un `enviarMensaje` con
 * destino a sí mismo no encuentra su id en `iframesRegistrados` y se descarta en
 * silencio — y sus errores ya están en su propia consola.
 *
 * @returns {boolean} true si quedó instalada en esta llamada
 */
export function instalarReporteErroresAlPadre() {
    if (_capturaInstalada) return false;
    if (typeof globalThis.addEventListener !== 'function') return false;
    if (!globalThis.parent || globalThis.parent === globalThis.window) return false;
    _capturaInstalada = true;

    globalThis.addEventListener('error', (evento) => {
        _reportarErrorNoControlado(
            'Error no capturado',
            evento?.message || String(evento?.error || 'desconocido'),
            evento?.filename || null,
            evento?.lineno || null
        );
    });
    globalThis.addEventListener('unhandledrejection', (evento) => {
        const motivo = evento?.reason;
        _reportarErrorNoControlado(
            'Promesa rechazada sin capturar',
            motivo?.message || String(motivo ?? 'desconocido'),
            null,
            null
        );
    });
    return true;
}

instalarReporteErroresAlPadre();
