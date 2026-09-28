/**
 * Data Loader - Cargador de datos con protección
 *
 * MODO 'local': importa los datos directamente desde los ficheros JS locales. Funciona sin
 *   backend ni autenticación.
 *
 * MODO 'api': obtiene los datos desde la API del backend, que requiere token. Los ficheros
 *   JS locales están bloqueados por el servidor estático. Sin token válido no hay acceso a
 *   coordenadas, textos ni respuestas.
 *
 * El modo NO se escribe a mano: lo resuelve asegurarModo() preguntando si hay backend detrás
 * de /api/health. Así el mismo código vale en los tres sitios donde corre el proyecto —local,
 * GitHub Pages y el VPS— sin tocar nada al desplegar. Ante la duda, 'local'. GitHub Pages
 * seguirá en local aunque BACKEND_READY sea true: allí /api/health responde 404 porque no hay
 * ningún proceso Node detrás (medido).
 *
 * TRANSICIÓN A PRODUCCIÓN:
 *   1. Poner BACKEND_READY = true (autoriza a preguntar; no fuerza el modo)
 *   2. Establecer PROTECT_DATA=true en el servidor estático
 *   3. Establecer AUTH_ENABLED=true en el backend
 *   4. Los ficheros JS sensibles quedan inaccesibles directamente
 */

// ═══════════════════════════════════════════════════
// CONFIGURACIÓN — El entorno se detecta solo, detrás de un interruptor explícito
// ═══════════════════════════════════════════════════
//
// BACKEND_READY es el freno de mano: mientras esté en `false` no se pregunta nada y el
// modo es 'local' siempre. Ponerlo en `true` NO fuerza el modo 'api': solo autoriza a
// comprobar si hay backend detrás. Ver `hayBackendDisponible()`.
const BACKEND_READY = false;

// ── El modo se decide por CAPACIDAD, no por el nombre del host ──────────────────────
//
// El proyecto vive en tres sitios, y dos de ellos comparten hostname:
//
//   | Dónde                  | /api/health        | Modo   |
//   |------------------------|--------------------|--------|
//   | local, backend activo  | 200                | api    |
//   | local, sin backend     | 502 (proxy avisa)  | local  |
//   | GitHub Pages           | 404 (no hay Node)  | local  |
//   | VPS con backend        | 200                | api    |
//
// Antes se decidía por hostname (`localhost` → local, cualquier otro → api). Pages y el
// VPS son el MISMO hostname, así que esa regla no podía distinguirlos: el día que
// BACKEND_READY pasara a `true`, Pages pedía los datos a un `/api` que allí no existe y
// la app se quedaba sin datos. Medido contra el sitio real: `/api/health` responde 404.
// Preguntando por la capacidad, cada entorno se identifica solo y no hay que acordarse de
// nada al desplegar. Ante cualquier duda gana 'local', que es el modo que siempre funciona.
let _modo = 'local';
let _deteccionEnCurso = null;

/**
 * ¿Hay un backend contestando detrás de /api? Exportada porque es el contrato que decide el
 * modo, y lo que decide algo tiene que poder comprobarse: un test que reimplemente este mismo
 * fetch estaría probando su propia copia y no se enteraría si esto cambiara (EJE 24, §36.24).
 */
export async function hayBackendDisponible() {
    try {
        const ctrl = new AbortController();
        const corte = setTimeout(() => ctrl.abort(), 2500);
        const resp = await fetch('/api/health', { signal: ctrl.signal, cache: 'no-store' });
        clearTimeout(corte);
        return resp.ok;
    } catch {
        // Abortado, sin red, o bloqueado: no hay backend utilizable.
        return false;
    }
}

/**
 * Resuelve el modo una sola vez por sesión y lo deja fijado. Hay que esperarla antes de
 * leer `getDataMode()`; todas las `cargarX` de este módulo lo hacen por su cuenta.
 */
export async function asegurarModo() {
    if (!BACKEND_READY) return _modo;
    if (!_deteccionEnCurso) {
        _deteccionEnCurso = hayBackendDisponible().then((hay) => {
            _modo = hay ? 'api' : 'local';
            (globalThis.logger || console).info(`[DataLoader] Modo de datos: ${_modo}`);
            return _modo;
        });
    }
    return _deteccionEnCurso;
}

// Ruta RELATIVA, igual en local (proxy /api/* de js/server.js) que en el VPS (Caddy):
// un solo origen, cubierto por el `connect-src 'self'` del CSP y sin CORS. Ver el bloque
// PROXY de js/server.js.
const API_BASE = '/api';

// ═══════════════════════════════════════════════════
// CACHE EN MEMORIA
// ═══════════════════════════════════════════════════
const dataCache = new Map();

function getCacheKey(...parts) {
    return parts.join(':');
}

// ═══════════════════════════════════════════════════
// HELPERS PARA MODO API
// ═══════════════════════════════════════════════════

async function fetchFromAPI(endpoint) {
    // Obtener token del TokenManager (definido en js/api-client.js — pendiente de conectar cuando el backend esté desplegado)
    // En modo 'local' esta función nunca se llama; solo activa en modo 'api'
    const token = globalThis.TokenManager ? globalThis.TokenManager.getToken() : null;

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, { headers });

    if (!response.ok) {
        if (response.status === 401) {
            (globalThis.logger || console).warn('[DataLoader] Token inválido o expirado. Se requiere re-activación.');
            if (globalThis.TokenManager) globalThis.TokenManager.clearToken();
        }
        throw new Error(`API error ${response.status}: ${endpoint}`);
    }

    const data = await response.json();
    if (!data.exito) {
        throw new Error(`API response not successful: ${endpoint}`);
    }
    return data;
}

// ═══════════════════════════════════════════════════
// FUNCIONES PÚBLICAS
// ═══════════════════════════════════════════════════

/**
 * Carga las coordenadas de una aventura
 */
export async function cargarCoordenadas(aventuraId) {
    const key = getCacheKey('coords', aventuraId);
    if (dataCache.has(key)) return dataCache.get(key);

    let result;
    if (await asegurarModo() === 'local') {
        const { DATOS_AVENTURAS } = await import('./coordenadas-aventuras.js');
        result = DATOS_AVENTURAS[aventuraId];
    } else {
        const data = await fetchFromAPI(`/coordenadas/${aventuraId}`);
        result = data.coordenadas;
    }

    dataCache.set(key, result);
    return result;
}

// Mapa idioma → nombre de archivo de párrafos
const LANG_ARCHIVO_PARRAFOS = {
    es: 'espanol',        en: 'ingles',      fr: 'frances',
    it: 'italiano',       nl: 'neerlandes',  ja: 'japones',
    de: 'aleman',         zh: 'chino-simplificado',
    pl: 'polaco',         pt: 'portugues',   ru: 'ruso',  uk: 'ucraniano'
};

// Cache de mapas de párrafos por idioma (reutilizado entre aventuras)
const parrafosCache = new Map();

async function cargarMapaParrafos(idioma) {
    if (parrafosCache.has(idioma)) return parrafosCache.get(idioma);
    const archivo = LANG_ARCHIVO_PARRAFOS[idioma];
    if (!archivo) return {};
    try {
        const url = new URL(`./parrafos-textos/parrafos-texto-${archivo}.json`, import.meta.url);
        const resp = await fetch(url);
        if (!resp.ok) {
            const logger = globalThis.logger || console;
            logger.error(`[DataLoader] No se pudo cargar párrafos: ${url} (HTTP ${resp.status})`);
            // No cacheamos el fallo para que el siguiente intento reintente la red
            return {};
        }
        const mapa = await resp.json();
        (globalThis.logger || console).info(`[DataLoader] Párrafos "${idioma}": ${Object.keys(mapa).length} entradas`);
        parrafosCache.set(idioma, mapa);
        return mapa;
    } catch (err) {
        const logger = globalThis.logger || console;
        logger.error(`[DataLoader] Error cargando párrafos para "${idioma}":`, err);
        // No cacheamos el fallo para que el siguiente intento reintente la red
        return {};
    }
}

/**
 * Carga los textos de una aventura en un idioma.
 * Devuelve array [{id, title, content}] con el HTML ensamblado desde
 * el mapa de párrafos del idioma (modo local) o desde la API (producción).
 */
export async function cargarTextos(aventuraId, idioma) {
    const key = getCacheKey('textos', aventuraId, idioma);
    if (dataCache.has(key)) {
        return dataCache.get(key);
    }

    let result;
    let _mapaParrafosCargado = true; // false → fetch falló → no cachear
    if (await asegurarModo() === 'local') {
        const { TEXTOS_AVENTURAS } = await import('./textos-aventuras.js');
        const { AUDIOS_AVENTURAS } = await import('./audios-aventuras.js');
        const entradas = TEXTOS_AVENTURAS[aventuraId] ?? [];
        const audios = AUDIOS_AVENTURAS[aventuraId]?.[idioma] ?? [];
        const audioMap = new Map(audios.map(a => [a.id, a]));
        const mapa = await cargarMapaParrafos(idioma);
        const nParrafos = Object.keys(mapa).length;

        // Si el mapa vino vacío y hay entradas que necesitan párrafos, la carga falló.
        // Marcamos como no cacheable para que el próximo intento reintente la red.
        if (nParrafos === 0 && entradas.some(e => e.parrafos?.length > 0)) {
            _mapaParrafosCargado = false;
            (globalThis.logger || console).warn(`[DataLoader][cargarTextos] ⚠️ Mapa de párrafos vacío para idioma="${idioma}" — contenido de paradas no disponible. Se reintentará en la próxima llamada.`);
        }

        result = entradas.map(entrada => {
            const idLang = entrada.id + '-' + idioma;
            const audioId = idLang
                .replace('txt-', 'audio-')
                .replace(/-(P|TR)(\d+)-/, '-$1-$2-');
            const title = audioMap.get(audioId)?.title ?? '';
            // Entrada con content fijo (ej. puzzle)
            if (typeof entrada.content === 'string') return { ...entrada, id: idLang, title };
            // Ensamblar HTML desde los números de párrafo
            const content = (entrada.parrafos ?? [])
                .map(n => mapa[String(n)] ?? '')
                .join('');
            return { id: idLang, title, content };
        });
    } else {
        // PRODUCCIÓN: el endpoint debe devolver los textos YA ensamblados por
        // aventura+idioma ({ textos: [{id,title,content}] }, mismo contrato que
        // /audios/:aventuraId/:idioma → data.audios y /retos/:aventuraId/:idioma →
        // data.retos) — el servidor es quien debe conocer textos-aventuras.js y
        // el mapa de párrafos para ensamblarlos, no el cliente (evita reexponer
        // el contenido de pago sin ensamblar). Endpoint aún no implementado
        // (no hay backend real todavía, ver GUIA-COMPLETA.md §16).
        const data = await fetchFromAPI(`/textos/${aventuraId}/${idioma}`);
        result = data.textos;
    }

    if (_mapaParrafosCargado) {
        dataCache.set(key, result);
    }
    return result;
}

/**
 * Carga los retos de una aventura en un idioma (sin respuestas correctas)
 */
export async function cargarRetos(aventuraId, idioma) {
    const key = getCacheKey('retos', aventuraId, idioma);
    if (dataCache.has(key)) return dataCache.get(key);

    let result;
    if (await asegurarModo() === 'local') {
        const { RETOS_AVENTURAS } = await import('./retos-aventuras.js');
        result = RETOS_AVENTURAS[aventuraId]?.[idioma];
    } else {
        const data = await fetchFromAPI(`/retos/${aventuraId}/${idioma}`);
        result = data.retos; // ya vienen sin respuestas correctas
    }

    dataCache.set(key, result);
    return result;
}

/**
 * Carga los audios de una aventura en un idioma
 */
export async function cargarAudios(aventuraId, idioma) {
    const key = getCacheKey('audios', aventuraId, idioma);
    if (dataCache.has(key)) return dataCache.get(key);

    let result;
    if (await asegurarModo() === 'local') {
        const { AUDIOS_AVENTURAS } = await import('./audios-aventuras.js');
        result = AUDIOS_AVENTURAS[aventuraId]?.[idioma];
    } else {
        const data = await fetchFromAPI(`/audios/${aventuraId}/${idioma}`);
        result = data.audios;
    }

    dataCache.set(key, result);
    return result;
}

/**
 * Carga el índice de aventuras disponibles
 */
export async function cargarIndice() {
    const key = 'indice';
    if (dataCache.has(key)) return dataCache.get(key);

    let result;
    if (await asegurarModo() === 'local') {
        const { INDICE_AVENTURAS } = await import('./indice-aventuras.js');
        result = INDICE_AVENTURAS;
    } else {
        const data = await fetchFromAPI('/aventuras');
        result = data.aventuras;
    }

    dataCache.set(key, result);
    return result;
}

/**
 * Valida una respuesta de reto contra el backend
 * (Solo disponible en modo API — en local, la validación es en el frontend)
 */
export async function validarRespuesta(aventuraId, idioma, retoId, respuesta) {
    if (await asegurarModo() === 'local') {
        (globalThis.logger || console).warn('[DataLoader] validarRespuesta() no disponible en modo local');
        return null;
    }

    const response = await fetch(`${API_BASE}/retos/${aventuraId}/${idioma}/${retoId}/validar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(globalThis.TokenManager?.getToken() && {
                'Authorization': `Bearer ${globalThis.TokenManager.getToken()}`
            })
        },
        body: JSON.stringify({ respuesta })
    });

    if (!response.ok) throw new Error(`Validación falló: ${response.status}`);
    return response.json();
}

/**
 * Limpia la caché de datos (útil al cambiar de aventura/idioma)
 */
export function limpiarCacheDatos() {
    dataCache.clear();
}

/**
 * Devuelve el modo actual de datos
 */
export function getDataMode() {
    // Síncrona a propósito (sus llamadores lo son). Devuelve lo último resuelto por
    // `asegurarModo()`; si nadie la ha esperado todavía, devuelve el seguro: 'local'.
    return _modo;
}
