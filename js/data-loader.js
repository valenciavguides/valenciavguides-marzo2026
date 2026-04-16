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
const _host = window.location.hostname;
const DATA_MODE = (_host === 'localhost' || _host === '127.0.0.1') ? 'local' : 'api';
const API_BASE = DATA_MODE === 'local'
    ? 'http://localhost:3001/api'
    : `${window.location.origin}/api`;

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
    // Obtener token del TokenManager (definido en api-client.js)
    const token = window.TokenManager ? window.TokenManager.getToken() : null;
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, { headers });
    
    if (!response.ok) {
        if (response.status === 401) {
            console.warn('[DataLoader] Token inválido o expirado. Se requiere re-activación.');
            if (window.TokenManager) window.TokenManager.clearToken();
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

/**
 * Carga los textos de una aventura en un idioma
 */
export async function cargarTextos(aventuraId, idioma) {
    const key = getCacheKey('textos', aventuraId, idioma);
    if (dataCache.has(key)) return dataCache.get(key);

    let result;
    if (DATA_MODE === 'local') {
        const { TEXTOS_AVENTURAS } = await import('./textos-aventuras.js');
        result = TEXTOS_AVENTURAS[aventuraId]?.[idioma];
    } else {
        const data = await fetchFromAPI(`/aventuras/${aventuraId}/completa?idioma=${idioma}`);
        result = data.textos;
    }

    dataCache.set(key, result);
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
            ...(window.TokenManager?.getToken() && {
                'Authorization': `Bearer ${window.TokenManager.getToken()}`
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
export function limpiarCache() {
    dataCache.clear();
}

/**
 * Devuelve el modo actual de datos
 */
export function getDataMode() {
    return DATA_MODE;
}
