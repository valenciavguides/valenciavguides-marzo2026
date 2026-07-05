/**
 * Data Loader - Cargador de datos con protección
 * 
 * En DESARROLLO (DATA_MODE = 'local'):
 *   Importa los datos directamente desde los ficheros JS locales.
 *   Funciona sin backend ni autenticación.
 * 
 * En PRODUCCIÓN (DATA_MODE = 'api'):
 *   Obtiene los datos desde la API del backend, que requiere token.
 *   Los ficheros JS locales están bloqueados por el servidor estático.
 *   Sin token válido → no hay acceso a coordenadas, textos ni respuestas.
 * 
 * TRANSICIÓN A PRODUCCIÓN:
 *   1. Cambiar DATA_MODE a 'api'
 *   2. Establecer PROTECT_DATA=true en el servidor estático
 *   3. Establecer AUTH_ENABLED=true en el backend
 *   4. Los ficheros JS sensibles quedan inaccesibles directamente
 */

// ═══════════════════════════════════════════════════
// CONFIGURACIÓN — Automático según entorno
// localhost/127.0.0.1 → 'local' (desarrollo)
// cualquier otro dominio → 'api' (producción)
// ═══════════════════════════════════════════════════

// Forzado a modo local para producción estática
const DATA_MODE = 'local';
const API_BASE = 'http://localhost:3001/api'; // No se usa en modo local

// --- Detección automática de entorno (comentar/descomentar para revertir) ---
// const _host = globalThis.location.hostname;
// const DATA_MODE = (_host === 'localhost' || _host === '127.0.0.1') ? 'local' : 'api';
// const API_BASE = DATA_MODE === 'local'
//     ? 'http://localhost:3001/api'
//     : `${globalThis.location.origin}/api`;

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
            console.warn('[DataLoader] Token inválido o expirado. Se requiere re-activación.');
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
    if (DATA_MODE === 'local') {
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
            try { globalThis.errorUI?.showToast(`No se pudieron cargar los textos (${idioma}, HTTP ${resp.status})`, { type: 'warning', duration: 8000 }); } catch (_) {}
            return {};
        }
        const mapa = await resp.json();
        (globalThis.logger || console).log(`[DataLoader] Párrafos "${idioma}": ${Object.keys(mapa).length} entradas`);
        parrafosCache.set(idioma, mapa);
        return mapa;
    } catch (err) {
        const logger = globalThis.logger || console;
        logger.error(`[DataLoader] Error cargando párrafos para "${idioma}":`, err);
        // No cacheamos el fallo para que el siguiente intento reintente la red
        try { globalThis.errorUI?.showToast(`No se pudieron cargar los textos (${idioma})`, { type: 'warning', duration: 8000 }); } catch (_) {}
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
    if (DATA_MODE === 'local') {
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
        // NOTE (PRODUCCIÓN): este endpoint devuelve el mapa crudo de párrafos,
        // no el array [{id,title,content}] que necesita la app.
        // Requiere un endpoint nuevo /api/textos/:aventuraId/:idioma que devuelva
        // los textos ya ensamblados por aventura, o bien que el servidor conozca
        // textos-aventuras.js (estructura de entradas) para poder ensamblarlos.
        // Ver GUIA-COMPLETA.md § "Textos en producción".
        const data = await fetchFromAPI(`/textos/${idioma}`);
        result = data.parrafos; // BUG: devuelve mapa crudo, no array ensamblado
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
    if (DATA_MODE === 'local') {
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
    if (DATA_MODE === 'local') {
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
 * Carga los puzzles de una aventura
 */
export async function cargarPuzzles(aventuraId) {
    const key = getCacheKey('puzzles', aventuraId);
    if (dataCache.has(key)) return dataCache.get(key);

    let result;
    if (DATA_MODE === 'local') {
        const { PUZZLES_AVENTURAS } = await import('./puzzles-aventuras.js');
        result = PUZZLES_AVENTURAS[aventuraId];
    } else {
        const data = await fetchFromAPI(`/puzzles/${aventuraId}`);
        result = data.puzzles;
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
    if (DATA_MODE === 'local') {
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
    if (DATA_MODE === 'local') {
        console.warn('[DataLoader] validarRespuesta() no disponible en modo local');
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
    return DATA_MODE;
}
