/**
 * API Client - Cliente centralizado para comunicación con el backend
 * 
 * Proporciona métodos para acceder a todos los endpoints de la API
 * con manejo de errores consistente y mensajes claros en español.
 */

import { sleep } from './utils.js';

// Configuración del cliente (dinámica según entorno)
(function() {
    const { location } = globalThis;
    const { protocol, hostname } = location; // http: o https:
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
    const port = isDevelopment ? ':3001' : ''; // No incluir puerto en producción
    
    globalThis.API_CONFIG = {
        baseUrl: isDevelopment 
            ? `${protocol}//localhost:3001/api`
            : `${protocol}//${hostname}${port}/api`,
        timeout: 15000, // 15 segundos
        retries: 4, // Aumentado de 2 a 4 para conexiones pobres
        retryDelay: 1000, // Base: 1s (backoff exponencial: 1s → 2s → 4s → 8s)
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

function safeSessionStorage(action, fallback = null) {
    try {
        return action();
    } catch (error) {
        if (API_CONFIG.isDevelopment) {
            (globalThis.logger || console).warn('[API Client] sessionStorage no disponible:', error.message);
        }
        return fallback;
    }
}

// ========================================
// GESTIÓN DE TOKEN DE SESIÓN
// ========================================

/**
 * Almacena y recupera el token de sesión.
 * El token se obtiene al activar un código y se envía en cada petición API.
 * En desarrollo (AUTH_ENABLED=false en backend), las peticiones pasan sin token.
 */
const TokenManager = {
    _token: null,

    /** Guarda el token en memoria y sessionStorage */
    setToken(token) {
        this._token = token;
        safeSessionStorage(() => sessionStorage.setItem('vbg_session_token', token));
    },

    /** Recupera el token (memoria > sessionStorage) */
    getToken() {
        if (this._token) return this._token;
        this._token = safeSessionStorage(() => sessionStorage.getItem('vbg_session_token'));
        return this._token;
    },

    /** Elimina el token (logout / expiración) */
    clearToken() {
        this._token = null;
        safeSessionStorage(() => sessionStorage.removeItem('vbg_session_token'));
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
            'NETWORK_ERROR': 'No se puede conectar con el servidor. Verifica tu conexión a internet.',
            'TIMEOUT': 'La solicitud tardó demasiado. Intenta de nuevo.',
            'OFFLINE': 'No hay conexión a internet. Activa tus datos o WiFi.',
            
            // Errores del servidor
            'SERVIDOR_NO_DISPONIBLE': 'El servidor no está disponible en este momento. Intenta más tarde.',
            'ERROR_INTERNO': 'Ha ocurrido un error. Por favor, intenta de nuevo.',
            
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
            'RATE_LIMIT_EXCEEDED': 'Demasiadas solicitudes. Espera un momento antes de continuar.',

            // Autenticación
            'TOKEN_REQUERIDO': 'Se requiere activar la aventura antes de continuar.',
            'TOKEN_INVALIDO': 'Tu sesión ha expirado. Por favor, vuelve a activar tu aventura.',
            'CODIGO_REQUERIDO': 'Se requiere un código de activación.',
            'CODIGO_INVALIDO': 'El código de activación no es válido.'
        };
        
        return mensajes[this.codigo] || this.mensaje || 'Ha ocurrido un error inesperado.';
    }
}

/**
 * Realiza una petición HTTP con reintentos y manejo de errores
 */
async function fetchWithRetry(url, options = {}, retriesLeft = API_CONFIG.retries) {
    const parseResponseJson = async (response) => {
        try {
            return await response.json();
        } catch (error) {
            if (API_CONFIG.isDevelopment) {
                (globalThis.logger || console).warn('[API] Respuesta no parseable como JSON:', error.message);
            }
            throw new ApiClientError(
                'PARSE_ERROR',
                'Error al procesar la respuesta del servidor',
                response.status
            );
        }
    };

    const assertApiSuccess = (response, data) => {
        if (response.ok && !data.error) return;

        if (response.status === 401) {
            TokenManager.clearToken();
        }

        throw new ApiClientError(
            data.codigo || 'ERROR_SERVIDOR',
            data.mensaje || `Error HTTP ${response.status}`,
            response.status,
            data.datos || data.detalles
        );
    };

    const maybeRetryOrThrowNetworkError = async (error) => {
        if (error.name !== 'TypeError' || !error.message.includes('fetch')) {
            return false;
        }

        if (retriesLeft > 0) {
            // Backoff exponencial: 1s → 2s → 4s → 8s
            const attemptNumber = API_CONFIG.retries - retriesLeft + 1;
            const delay = API_CONFIG.retryDelay * Math.pow(2, attemptNumber - 1);
            (globalThis.logger || console).info(`[API] Reintentando en ${delay}ms... (${retriesLeft} intentos restantes)`);
            await sleep(delay);
            return fetchWithRetry(url, options, retriesLeft - 1);
        }

        if (globalThis.navigator && !globalThis.navigator.onLine) {
            throw new ApiClientError('OFFLINE', 'No hay conexión a internet');
        }

        throw new ApiClientError('NETWORK_ERROR', 'Error de conexión con el servidor');
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
        // Construir headers con token de autenticación si existe
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };
        const token = TokenManager.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers
        });
        
        clearTimeout(timeoutId);
        
        const data = await parseResponseJson(response);
        assertApiSuccess(response, data);
        
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Si es un ApiClientError, propagarlo
        if (error instanceof ApiClientError) {
            throw error;
        }
        
        // Error de abort (timeout)
        if (error.name === 'AbortError') {
            throw new ApiClientError('TIMEOUT', 'La solicitud tardó demasiado tiempo');
        }
        
        const retryResult = await maybeRetryOrThrowNetworkError(error);
        if (retryResult !== false) {
            return retryResult;
        }
        
        // Error genérico
        throw new ApiClientError('ERROR_INTERNO', error.message || 'Error desconocido');
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
     * Verifica si el servidor está disponible
     */
    async ping() {
        try {
            const data = await fetchWithRetry(`${API_CONFIG.baseUrl}/health/ping`);
            return { disponible: true, latencia: Date.now() - data.timestamp };
        } catch (error) {
            return { disponible: false, error: error.getMensajeUsuario() };
        }
    },
    
    // ========================================
    // AUTENTICACIÓN
    // ========================================

    /**
     * Activa una aventura con un código y email, y obtiene un token de sesión.
     * El código distingue mayúsculas/minúsculas — nunca transformar antes de enviarlo.
     * @param {string} codigo - Código de activación
     * @param {string} email - Email del comprador (debe coincidir con el asociado al código)
     * @param {string} aventuraId - ID de la aventura
     * @returns {Promise<{exito: boolean, token: string}>}
     */
    async activar(codigo, email, aventuraId = 'Aventura1') {
        const url = `${API_CONFIG.baseUrl}/auth/activar`;
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
    async getAventuraCompleta(aventuraId, idioma = 'es') {
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
    async getAudios(aventuraId, idioma = 'es') {
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
    // RETOS
    // ========================================
    
    /**
     * Obtiene todos los retos de una aventura (sin respuestas correctas)
     */
    async getRetos(aventuraId, idioma = 'es') {
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
