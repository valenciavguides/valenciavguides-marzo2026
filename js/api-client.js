/**
 * API Client - Cliente centralizado para comunicación con el backend
 * 
 * Proporciona métodos para acceder a todos los endpoints de la API
 * con manejo de errores consistente y mensajes claros en español.
 */

// Configuración del cliente (dinámica según entorno)
(function() {
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
    const protocol = window.location.protocol; // http: o https:
    const hostname = window.location.hostname;
    const port = isDevelopment ? ':3001' : ''; // No incluir puerto en producción
    
    window.API_CONFIG = {
        baseUrl: isDevelopment 
            ? `${protocol}//localhost:3001/api`
            : `${protocol}//${hostname}${port}/api`,
        timeout: 15000, // 15 segundos
        retries: 2,
        retryDelay: 1000, // 1 segundo entre reintentos
        isDevelopment: isDevelopment,
        environment: isDevelopment ? 'development' : 'production'
    };
    
    // Logging en desarrollo
    if (isDevelopment) {
        console.log('[API Client] Modo: Desarrollo');
        console.log('[API Client] Base URL:', window.API_CONFIG.baseUrl);
    }
})();

const API_CONFIG = window.API_CONFIG;

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
            'RATE_LIMIT_EXCEEDED': 'Demasiadas solicitudes. Espera un momento antes de continuar.'
        };
        
        return mensajes[this.codigo] || this.mensaje || 'Ha ocurrido un error inesperado.';
    }
}

/**
 * Realiza una petición HTTP con reintentos y manejo de errores
 */
async function fetchWithRetry(url, options = {}, retriesLeft = API_CONFIG.retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
        });
        
        clearTimeout(timeoutId);
        
        // Parsear respuesta
        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new ApiClientError(
                'PARSE_ERROR',
                'Error al procesar la respuesta del servidor',
                response.status
            );
        }
        
        // Verificar si la respuesta indica error
        if (!response.ok || data.error) {
            throw new ApiClientError(
                data.codigo || 'ERROR_SERVIDOR',
                data.mensaje || `Error HTTP ${response.status}`,
                response.status,
                data.datos || data.detalles
            );
        }
        
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
        
        // Error de red
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            // Intentar reintentar si quedan intentos
            if (retriesLeft > 0) {
                console.log(`[API] Reintentando... (${retriesLeft} intentos restantes)`);
                await new Promise(r => setTimeout(r, API_CONFIG.retryDelay));
                return fetchWithRetry(url, options, retriesLeft - 1);
            }
            
            // Sin conexión
            if (!navigator.onLine) {
                throw new ApiClientError('OFFLINE', 'No hay conexión a internet');
            }
            
            throw new ApiClientError('NETWORK_ERROR', 'Error de conexión con el servidor');
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
    module.exports = { ApiClient, ApiClientError, API_CONFIG };
}

// Exponer globalmente para uso en navegador
if (typeof window !== 'undefined') {
    window.ApiClient = ApiClient;
    window.ApiClientError = ApiClientError;
}

export { ApiClient, ApiClientError, API_CONFIG };
