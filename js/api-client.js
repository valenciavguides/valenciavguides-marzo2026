/**
 * API Client - Cliente centralizado para comunicación con el backend
 *
 * Proporciona métodos para acceder a todos los endpoints de la API
 * con manejo de errores consistente y mensajes claros en español.
 */

import { pedirConReintentos, msDeRetryAfter } from './utils.js';

// Configuración del cliente (dinámica según entorno)
(function() {
    const { location } = globalThis;
    const { hostname } = location;
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';

    globalThis.API_CONFIG = {
        // Ruta RELATIVA, igual en los tres entornos: en local la sirve el proxy /api/* de
        // js/server.js por el mismo :8080 que la página; en el VPS la sirve Caddy por el
        // mismo dominio. Un solo origen en los dos casos, así que el `connect-src 'self'`
        // del CSP la cubre y no hace falta CORS en ninguno. Una URL absoluta con puerto
        // fijo aquí volvería a separar los dos entornos (ver js/server.js, bloque PROXY).
        baseUrl: '/api',
        // El plazo y los reintentos no van aquí: son los de pedirConReintentos (js/utils.js), los mismos para todo lo que
        // la app descarga.
        isDevelopment: isDevelopment,
        environment: isDevelopment ? 'development' : 'production'
    };

    // Logging en desarrollo
    if (isDevelopment) {
        (globalThis.logger || console).info('[API Client] Modo: Desarrollo');
        (globalThis.logger || console).info('[API Client] Base URL:', globalThis.API_CONFIG.baseUrl);
    }
})();

const { API_CONFIG } = globalThis;

// ========================================
// GESTIÓN DE TOKEN DE SESIÓN
// ========================================

/**
 * Almacena y recupera el token de sesión.
 * El token se obtiene al comprobar un código de compra y se envía en cada petición API.
 * En desarrollo (AUTH_ENABLED=false en backend), las peticiones pasan sin token.
 */
const TokenManager = {
    _token: null,

    /** Guarda el token en memoria y sessionStorage */
    setToken(token) {
        this._token = token;
        globalThis.almacen.sesion.escribir(globalThis.almacen.CLAVES.TOKEN_SESION, token);
    },

    /** Recupera el token (memoria > sessionStorage) */
    getToken() {
        if (this._token) return this._token;
        this._token = globalThis.almacen.sesion.leer(globalThis.almacen.CLAVES.TOKEN_SESION);
        return this._token;
    },

    /** Elimina el token (logout / expiración) */
    clearToken() {
        this._token = null;
        globalThis.almacen.sesion.borrar(globalThis.almacen.CLAVES.TOKEN_SESION);
    },

    /** ¿Hay token almacenado? */
    hasToken() {
        return !!this.getToken();
    }
};

// Exponer globalmente
if (typeof globalThis !== 'undefined') {
    globalThis.TokenManager = TokenManager;
}

/**
 * Clase para errores de la API
 */
class ApiClientError extends Error {
    constructor(codigo, mensaje, statusCode = 0, detalles = null) {
        super(mensaje);
        this.name = 'ApiClientError';
        this.codigo = codigo;
        this.statusCode = statusCode;
        this.detalles = detalles;
        this.timestamp = new Date().toISOString();
    }

    /**
     * Obtiene un mensaje amigable para mostrar al usuario
     */
    getMensajeUsuario() {
        const mensajes = {
            // Errores de red
            'NETWORK_ERROR': 'No se puede conectar con el servidor. Verifique su conexión a internet.',
            'TIMEOUT': 'La solicitud tardó demasiado. Inténtelo de nuevo.',
            'OFFLINE': 'No hay conexión a internet. Active sus datos o el WiFi.',

            // Errores del servidor
            'SERVIDOR_NO_DISPONIBLE': 'El servidor no está disponible en este momento. Inténtelo más tarde.',
            'ERROR_INTERNO': 'Ha ocurrido un error. Por favor, inténtelo de nuevo.',

            // Errores de datos
            'AVENTURA_NO_ENCONTRADA': 'La aventura solicitada no existe.',
            'AVENTURA_NO_DISPONIBLE': 'Esta aventura no está disponible todavía.',
            'IDIOMA_NO_DISPONIBLE': 'El idioma seleccionado no está disponible para esta aventura.',
            'COORDENADAS_NO_ENCONTRADAS': 'No se encontraron las coordenadas de esta aventura.',
            'PARADA_NO_ENCONTRADA': 'La parada solicitada no existe.',
            'AUDIO_NO_ENCONTRADO': 'El audio solicitado no está disponible.',
            'RETO_NO_ENCONTRADO': 'El reto solicitado no existe.',
            'PUZZLE_NO_ENCONTRADO': 'El puzzle solicitado no existe.',

            // Errores de validación
            'PARAMETRO_INVALIDO': 'Parámetro inválido en la solicitud.',
            'RESPUESTA_INVALIDA': 'La respuesta enviada no es válida.',

            // Rate limiting
            'RATE_LIMIT_EXCEEDED': 'Demasiadas solicitudes. Espere un momento antes de continuar.',

            // Autenticación
            'TOKEN_REQUERIDO': 'Se requiere activar la aventura antes de continuar.',
            'TOKEN_INVALIDO': 'Su sesión ha expirado. Por favor, vuelva a activar su aventura.',
            'CODIGO_REQUERIDO': 'Se requiere un código de activación.',
            'CODIGO_INVALIDO': 'El código de activación no es válido.'
        };

        return mensajes[this.codigo] || this.mensaje || 'Ha ocurrido un error inesperado.';
    }
}

/** El cuerpo de una respuesta de la API. Solo un JSON mal formado es PARSE_ERROR; un corte a mitad del cuerpo o el plazo
 * vencido se dejan pasar tal cual, para que pedirConReintentos los reintente. */
async function parseResponseJson(response) {
    try {
        return await response.json();
    } catch (error) {
        if (error?.name !== 'SyntaxError') throw error;
        if (API_CONFIG.isDevelopment) {
            (globalThis.logger || console).warn('[API] Respuesta no parseable como JSON:', error.message);
        }
        throw new ApiClientError(
            'PARSE_ERROR',
            'Error al procesar la respuesta del servidor',
            response.status
        );
    }
}

/** Una respuesta buena es `ok` y sin `error`. Si no, un ApiClientError con su estado; un 401 borra el token, y un 429
 * lleva lo que diga su `Retry-After` para que el reintento lo espere. */
function assertApiSuccess(response, data) {
    if (response.ok && !data.error) return;

    if (response.status === 401) {
        TokenManager.clearToken();
    }

    const error = new ApiClientError(
        data.codigo || 'ERROR_SERVIDOR',
        data.mensaje || `Error HTTP ${response.status}`,
        response.status,
        data.datos || data.detalles
    );
    if (response.status === 429) error.reintentarTrasMs = msDeRetryAfter(response.headers.get('Retry-After'));
    throw error;
}

/**
 * Una petición a la API, por la forma única de pedir un dato (pedirConReintentos, js/utils.js): plazo de 15 s por intento,
 * hasta la respuesta entera, y 4 reintentos a 1, 2, 4 y 8 s. Se reintentan el corte de red (en los tres motores), el plazo
 * vencido, un 5xx y un 429 (este, después de su `Retry-After`); un 4xx es la respuesta del servidor y no se reintenta. Al
 * rendirse lanza un ApiClientError: el del servidor o, si no contestó, TIMEOUT, OFFLINE o NETWORK_ERROR.
 */
async function fetchWithRetry(url, options = {}) {
    try {
        return await pedirConReintentos(async (_intento, senal) => {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            };
            const token = TokenManager.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(url, { ...options, signal: senal, headers });
            const data = await parseResponseJson(response);
            assertApiSuccess(response, data);
            return data;
        }, { descripcion: `[API] ${options.method || 'GET'} ${url}` });
    } catch (error) {
        if (error instanceof ApiClientError) throw error;
        if (error?.plazoVencido) throw new ApiClientError('TIMEOUT', 'La solicitud tardó demasiado tiempo');
        if (error?.name === 'TypeError') {
            if (globalThis.navigator && !globalThis.navigator.onLine) {
                throw new ApiClientError('OFFLINE', 'No hay conexión a internet');
            }
            throw new ApiClientError('NETWORK_ERROR', 'Error de conexión con el servidor');
        }
        throw new ApiClientError('ERROR_INTERNO', error?.message || 'Error desconocido');
    }
}

/**
 * Cliente API
 */
const ApiClient = {
    /**
     * Configura la URL base del API
     */
    setBaseUrl(url) {
        API_CONFIG.baseUrl = url.replace(/\/$/, ''); // Remover trailing slash
    },

    /**
     * Verifica si el servidor está disponible. Usa /health — la misma ruta que
     * asegurarModo() (js/data-loader.js) para decidir el modo de datos — en vez de una
     * ruta de "ping" aparte: un solo camino para la misma pregunta (¿hay backend?).
     * La latencia se mide con reloj propio, sin depender de que el backend devuelva
     * ningún campo concreto en el cuerpo — un health check no debería tener más
     * contrato que "responde 2xx".
     */
    async ping() {
        try {
            const inicio = performance.now();
            await fetchWithRetry(`${API_CONFIG.baseUrl}/health`);
            return { disponible: true, latencia: Math.round(performance.now() - inicio) };
        } catch (error) {
            return { disponible: false, error: error.getMensajeUsuario() };
        }
    },

    // ========================================
    // AUTENTICACIÓN
    // ========================================

    /**
     * Comprueba un código de compra con su email para una aventura, y obtiene un token de sesión.
     *
     * Solo comprueba: no gasta el código ni pone en marcha su tiempo, y se puede repetir cuantas veces
     * haga falta. Lo que pone el tiempo en marcha es `activar()`, al arrancar la aventura. Si aquí se
     * gastara, quien dijera «no» en el reto 2, cerrara la app o se quedara sin batería antes de empezar
     * se quedaría con un código gastado y sin aventura (docs/GUIA-COMPLETA.md §16.2).
     *
     * El código distingue mayúsculas/minúsculas — nunca transformar antes de enviarlo.
     * @param {string} codigo - Código de compra
     * @param {string} email - Email del comprador (debe coincidir con el asociado al código)
     * @param {string} aventuraId - ID de la aventura para la que se quiere usar
     * @returns {Promise<{exito: boolean, token: string}>}
     */
    async comprobarCodigo(codigo, email, aventuraId) {
        const url = `${API_CONFIG.baseUrl}/auth/comprobar`;
        const data = await fetchWithRetry(url, {
            method: 'POST',
            body: JSON.stringify({ codigo, email, aventuraId })
        });
        if (data.token) {
            TokenManager.setToken(data.token);
        }
        return data;
    },

    /**
     * Avisa al servidor de que la aventura arranca: desde ese instante cuenta el tiempo del código.
     *
     * Va con el token de sesión que dejó `comprobarCodigo()`. El servidor guarda la primera fecha y
     * contesta siempre la misma, así que repetir la llamada —al volver a la aventura o al reanudarla—
     * no cambia nada (docs/GUIA-COMPLETA.md §16.2).
     * @param {string} aventuraId - ID de la aventura que arranca
     * @returns {Promise<{exito: boolean, iniciada: number, expira: number}>}
     */
    async activar(aventuraId) {
        return fetchWithRetry(`${API_CONFIG.baseUrl}/auth/activar`, {
            method: 'POST',
            body: JSON.stringify({ aventuraId })
        });
    },

    /**
     * Verifica si el token actual sigue siendo válido
     * @returns {Promise<{valido: boolean}>}
     */
    async verificarSesion() {
        if (!TokenManager.hasToken()) {
            return { valido: false };
        }
        try {
            const data = await fetchWithRetry(`${API_CONFIG.baseUrl}/auth/verificar`);
            return { valido: data.valido };
        } catch (error) {
            if (API_CONFIG.isDevelopment) {
                (globalThis.logger || console).warn('[API] Error verificando sesion, limpiando token:', error.message);
            }
            TokenManager.clearToken();
            return { valido: false };
        }
    },

    /**
     * Cierra la sesión eliminando el token
     */
    cerrarSesion() {
        TokenManager.clearToken();
    },

    // ========================================
    // AVENTURAS
    // ========================================

    /**
     * Obtiene lista de aventuras
     * @param {boolean} incluirTodas - Si true, incluye aventuras no disponibles
     */
    async getAventuras(incluirTodas = false) {
        const url = `${API_CONFIG.baseUrl}/aventuras${incluirTodas ? '?todas=true' : ''}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene información de una aventura específica
     * @param {string} aventuraId - ID de la aventura (ej: "Aventura1")
     */
    async getAventura(aventuraId) {
        const url = `${API_CONFIG.baseUrl}/aventuras/${encodeURIComponent(aventuraId)}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene todos los datos de una aventura
     * @param {string} aventuraId - ID de la aventura
     * @param {string} idioma - Código de idioma (es, en, fr, etc.)
     */
    async getAventuraCompleta(aventuraId, idioma) {
        const url = `${API_CONFIG.baseUrl}/aventuras/${encodeURIComponent(aventuraId)}/completa?idioma=${idioma}`;
        return fetchWithRetry(url);
    },

    // ========================================
    // COORDENADAS
    // ========================================

    /**
     * Obtiene todas las coordenadas de una aventura
     * @param {string} aventuraId - ID de la aventura
     * @param {string} tipo - Filtrar por tipo: 'parada', 'tramo', 'inicio'
     */
    async getCoordenadas(aventuraId, tipo = null) {
        let url = `${API_CONFIG.baseUrl}/coordenadas/${encodeURIComponent(aventuraId)}`;
        if (tipo) {
            url += `?tipo=${tipo}`;
        }
        return fetchWithRetry(url);
    },

    /**
     * Obtiene coordenadas de una parada específica
     */
    async getParada(aventuraId, paradaId) {
        const url = `${API_CONFIG.baseUrl}/coordenadas/${encodeURIComponent(aventuraId)}/parada/${encodeURIComponent(paradaId)}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene coordenadas de un tramo específico
     */
    async getTramo(aventuraId, tramoId) {
        const url = `${API_CONFIG.baseUrl}/coordenadas/${encodeURIComponent(aventuraId)}/tramo/${encodeURIComponent(tramoId)}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene la ruta entre dos puntos
     */
    async getRuta(aventuraId, desdeId, hastaId) {
        const url = `${API_CONFIG.baseUrl}/coordenadas/${encodeURIComponent(aventuraId)}/ruta/${encodeURIComponent(desdeId)}/${encodeURIComponent(hastaId)}`;
        return fetchWithRetry(url);
    },

    // ========================================
    // AUDIOS
    // ========================================

    /**
     * Obtiene todos los audios de una aventura
     */
    async getAudios(aventuraId, idioma) {
        const url = `${API_CONFIG.baseUrl}/audios/${encodeURIComponent(aventuraId)}/${idioma}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene audio de una parada específica
     */
    async getAudioParada(aventuraId, idioma, paradaId) {
        const url = `${API_CONFIG.baseUrl}/audios/${encodeURIComponent(aventuraId)}/${idioma}/parada/${encodeURIComponent(paradaId)}`;
        return fetchWithRetry(url);
    },

    // ========================================
    // TEXTOS
    // ========================================

    /**
     * Obtiene los textos de una aventura en un idioma, ya ensamblados por el servidor: `{ exito, textos }`, con
     * `textos` de la misma forma que monta cargarTextos() en modo 'local' (js/data-loader.js): `[{ id, title, content }]`.
     */
    async getTextos(aventuraId, idioma) {
        const url = `${API_CONFIG.baseUrl}/textos/${encodeURIComponent(aventuraId)}/${idioma}`;
        return fetchWithRetry(url);
    },

    // ========================================
    // RETOS
    // ========================================

    /**
     * Obtiene todos los retos de una aventura (sin respuestas correctas)
     */
    async getRetos(aventuraId, idioma) {
        const url = `${API_CONFIG.baseUrl}/retos/${encodeURIComponent(aventuraId)}/${idioma}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene un reto específico
     */
    async getReto(aventuraId, idioma, retoId) {
        const url = `${API_CONFIG.baseUrl}/retos/${encodeURIComponent(aventuraId)}/${idioma}/${encodeURIComponent(retoId)}`;
        return fetchWithRetry(url);
    },

    /**
     * Valida la respuesta a un reto
     * @param {string|array} respuesta - Respuesta del usuario
     * @returns {Promise<{correcto: boolean, pista?: string}>}
     */
    async validarReto(aventuraId, idioma, retoId, respuesta) {
        const url = `${API_CONFIG.baseUrl}/retos/${encodeURIComponent(aventuraId)}/${idioma}/${encodeURIComponent(retoId)}/validar`;
        return fetchWithRetry(url, {
            method: 'POST',
            body: JSON.stringify({ respuesta })
        });
    },

    // ========================================
    // PUZZLES
    // ========================================

    /**
     * Obtiene los puzzles de una aventura
     */
    async getPuzzles(aventuraId) {
        const url = `${API_CONFIG.baseUrl}/puzzles/${encodeURIComponent(aventuraId)}`;
        return fetchWithRetry(url);
    },

    /**
     * Obtiene un puzzle específico
     */
    async getPuzzle(aventuraId, puzzleId) {
        const url = `${API_CONFIG.baseUrl}/puzzles/${encodeURIComponent(aventuraId)}/${encodeURIComponent(puzzleId)}`;
        return fetchWithRetry(url);
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, ApiClientError, API_CONFIG, TokenManager };
}

// Exponer globalmente para uso en navegador
if (typeof globalThis !== 'undefined') {
    globalThis.ApiClient = ApiClient;
    globalThis.ApiClientError = ApiClientError;
    globalThis.TokenManager = TokenManager;
}

export { ApiClient, ApiClientError, API_CONFIG, TokenManager };
