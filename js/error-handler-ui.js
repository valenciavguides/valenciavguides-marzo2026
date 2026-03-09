/**
 * Error Handler UI - Sistema de visualización de errores en el frontend
 * 
 * Proporciona notificaciones toast, modales de error y logging
 * para mostrar errores del API de forma amigable al usuario.
 */

// Configuración
const ERROR_UI_CONFIG = {
    toastDuration: 5000, // 5 segundos
    maxToasts: 3,
    position: 'bottom-center', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-center'
    enableSound: false,
    logToConsole: true
};

// Estilos inyectados
const ERROR_UI_STYLES = `
<style id="error-ui-styles">
    /* Container de toasts */
    .error-toast-container {
        position: fixed;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 90vw;
    }
    
    .error-toast-container.top-left { top: 20px; left: 20px; }
    .error-toast-container.top-right { top: 20px; right: 20px; }
    .error-toast-container.bottom-left { bottom: 20px; left: 20px; }
    .error-toast-container.bottom-right { bottom: 20px; right: 20px; }
    .error-toast-container.bottom-center { 
        bottom: 20px; 
        left: 50%; 
        transform: translateX(-50%); 
    }
    
    /* Toast individual */
    .error-toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        animation: error-toast-in 0.3s ease-out;
        min-width: 280px;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .error-toast.closing {
        animation: error-toast-out 0.2s ease-in forwards;
    }
    
    .error-toast.error {
        border-left: 4px solid #e74c3c;
        background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
    }
    
    .error-toast.warning {
        border-left: 4px solid #f39c12;
        background: linear-gradient(135deg, #fffbf0 0%, #fff 100%);
    }
    
    .error-toast.info {
        border-left: 4px solid #3498db;
        background: linear-gradient(135deg, #f0f8ff 0%, #fff 100%);
    }
    
    .error-toast.success {
        border-left: 4px solid #27ae60;
        background: linear-gradient(135deg, #f0fff5 0%, #fff 100%);
    }
    
    .error-toast-icon {
        font-size: 20px;
        flex-shrink: 0;
        line-height: 1;
    }
    
    .error-toast-content {
        flex: 1;
    }
    
    .error-toast-title {
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
    }
    
    .error-toast-message {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
    }
    
    .error-toast-close {
        background: none;
        border: none;
        font-size: 18px;
        color: #999;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 0.2s;
    }
    
    .error-toast-close:hover {
        color: #333;
    }
    
    /* Modal de error */
    .error-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: error-modal-fade-in 0.2s ease-out;
    }
    
    .error-modal {
        background: #fff;
        border-radius: 16px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: error-modal-scale-in 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .error-modal-icon {
        text-align: center;
        font-size: 48px;
        margin-bottom: 16px;
    }
    
    .error-modal-title {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 12px;
    }
    
    .error-modal-message {
        text-align: center;
        font-size: 15px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    
    .error-modal-details {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 12px;
        font-size: 12px;
        color: #888;
        margin-bottom: 20px;
        max-height: 100px;
        overflow-y: auto;
    }
    
    .error-modal-details code {
        font-family: monospace;
        word-break: break-all;
    }
    
    .error-modal-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
    }
    
    .error-modal-btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
    }
    
    .error-modal-btn.primary {
        background: #3498db;
        color: #fff;
    }
    
    .error-modal-btn.primary:hover {
        background: #2980b9;
    }
    
    .error-modal-btn.secondary {
        background: #ecf0f1;
        color: #333;
    }
    
    .error-modal-btn.secondary:hover {
        background: #dde4e6;
    }
    
    /* Animaciones */
    @keyframes error-toast-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes error-toast-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    @keyframes error-modal-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes error-modal-scale-in {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
`;

// Íconos por tipo
const ICONS = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
    network: '📡',
    offline: '📵'
};

// Títulos por código de error
const ERROR_TITLES = {
    'NETWORK_ERROR': 'Error de Conexión',
    'TIMEOUT': 'Tiempo Agotado',
    'OFFLINE': 'Sin Conexión',
    'SERVIDOR_NO_DISPONIBLE': 'Servidor No Disponible',
    'ERROR_INTERNO': 'Error',
    'AVENTURA_NO_ENCONTRADA': 'Aventura No Encontrada',
    'AVENTURA_NO_DISPONIBLE': 'Aventura No Disponible',
    'IDIOMA_NO_DISPONIBLE': 'Idioma No Disponible',
    'RATE_LIMIT_EXCEEDED': 'Demasiadas Solicitudes'
};

/**
 * Clase principal del manejador de errores UI
 */
class ErrorUI {
    constructor() {
        this._container = null;
        this._toasts = [];
        this._initialized = false;
    }
    
    /**
     * Inicializa el sistema de errores UI
     */
    init() {
        if (this._initialized) return;
        
        // Inyectar estilos si no existen
        if (!document.getElementById('error-ui-styles')) {
            document.head.insertAdjacentHTML('beforeend', ERROR_UI_STYLES);
        }
        
        // Crear container de toasts
        this._container = document.createElement('div');
        this._container.className = `error-toast-container ${ERROR_UI_CONFIG.position}`;
        document.body.appendChild(this._container);
        
        this._initialized = true;
    }
    
    /**
     * Muestra un toast de error
     * @param {Error|ApiClientError|string} error - Error a mostrar
     * @param {object} options - Opciones adicionales
     */
    showToast(error, options = {}) {
        this.init();
        
        const {
            type = 'error',
            duration = ERROR_UI_CONFIG.toastDuration,
            title = null,
            closable = true
        } = options;
        
        // Obtener mensaje
        let mensaje = '';
        let codigo = 'ERROR';
        
        if (typeof error === 'string') {
            mensaje = error;
        } else if (error.getMensajeUsuario) {
            mensaje = error.getMensajeUsuario();
            codigo = error.codigo || 'ERROR';
        } else if (error.message) {
            mensaje = error.message;
        }
        
        // Limitar número de toasts
        while (this._toasts.length >= ERROR_UI_CONFIG.maxToasts) {
            this._removeToast(this._toasts[0]);
        }
        
        // Crear elemento
        const toastEl = document.createElement('div');
        toastEl.className = `error-toast ${type}`;
        toastEl.innerHTML = `
            <span class="error-toast-icon">${ICONS[type] || ICONS.error}</span>
            <div class="error-toast-content">
                <div class="error-toast-title">${title || ERROR_TITLES[codigo] || 'Error'}</div>
                <div class="error-toast-message">${this._escapeHtml(mensaje)}</div>
            </div>
            ${closable ? '<button class="error-toast-close">×</button>' : ''}
        `;
        
        // Agregar al DOM
        this._container.appendChild(toastEl);
        this._toasts.push(toastEl);
        
        // Cerrar al hacer click
        if (closable) {
            toastEl.querySelector('.error-toast-close').onclick = () => {
                this._removeToast(toastEl);
            };
        }
        
        // Auto-cerrar
        if (duration > 0) {
            setTimeout(() => {
                this._removeToast(toastEl);
            }, duration);
        }
        
        // Log a consola
        if (ERROR_UI_CONFIG.logToConsole) {
            console.error(`[ErrorUI] ${codigo}: ${mensaje}`, error);
        }
        
        return toastEl;
    }
    
    /**
     * Muestra un modal de error
     * @param {Error|ApiClientError|string} error - Error a mostrar
     * @param {object} options - Opciones adicionales
     */
    showModal(error, options = {}) {
        this.init();
        
        const {
            title = null,
            showDetails = false,
            onRetry = null,
            onClose = null,
            retryText = 'Reintentar',
            closeText = 'Cerrar'
        } = options;
        
        // Obtener mensaje
        let mensaje = '';
        let codigo = 'ERROR';
        let detalles = null;
        
        if (typeof error === 'string') {
            mensaje = error;
        } else if (error.getMensajeUsuario) {
            mensaje = error.getMensajeUsuario();
            codigo = error.codigo || 'ERROR';
            detalles = error.detalles ? JSON.stringify(error.detalles, null, 2) : null;
        } else if (error.message) {
            mensaje = error.message;
            detalles = error.stack;
        }
        
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'error-modal-overlay';
        overlay.innerHTML = `
            <div class="error-modal">
                <div class="error-modal-icon">${ICONS.error}</div>
                <div class="error-modal-title">${title || ERROR_TITLES[codigo] || 'Ha ocurrido un error'}</div>
                <div class="error-modal-message">${this._escapeHtml(mensaje)}</div>
                ${showDetails && detalles ? `
                    <div class="error-modal-details">
                        <code>${this._escapeHtml(detalles)}</code>
                    </div>
                ` : ''}
                <div class="error-modal-buttons">
                    ${onRetry ? `<button class="error-modal-btn primary">${retryText}</button>` : ''}
                    <button class="error-modal-btn ${onRetry ? 'secondary' : 'primary'}">${closeText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Event handlers
        const buttons = overlay.querySelectorAll('.error-modal-btn');
        const closeModal = () => {
            overlay.remove();
            if (onClose) onClose();
        };
        
        if (onRetry) {
            buttons[0].onclick = () => {
                overlay.remove();
                onRetry();
            };
            buttons[1].onclick = closeModal;
        } else {
            buttons[0].onclick = closeModal;
        }
        
        // Cerrar con ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Cerrar al click fuera
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };
        
        // Log a consola
        if (ERROR_UI_CONFIG.logToConsole) {
            console.error(`[ErrorUI Modal] ${codigo}: ${mensaje}`, error);
        }
        
        return overlay;
    }
    
    /**
     * Muestra error de red/offline
     */
    showNetworkError(onRetry = null) {
        const isOffline = !navigator.onLine;
        
        return this.showModal(
            isOffline 
                ? 'No hay conexión a internet. Verifica tu conexión y vuelve a intentarlo.'
                : 'No se puede conectar con el servidor. Verifica que el servidor esté activo.',
            {
                title: isOffline ? 'Sin Conexión' : 'Error de Conexión',
                onRetry,
                retryText: 'Reintentar'
            }
        );
    }
    
    /**
     * Wrapper para manejar promesas con UI de error
     * @param {Promise} promise - Promesa a ejecutar
     * @param {object} options - Opciones para mostrar errores
     */
    async handle(promise, options = {}) {
        const { showError = true, useToast = true, ...errorOptions } = options;
        
        try {
            return await promise;
        } catch (error) {
            if (showError) {
                if (useToast) {
                    this.showToast(error, errorOptions);
                } else {
                    this.showModal(error, errorOptions);
                }
            }
            throw error;
        }
    }
    
    /**
     * Escapa HTML para prevenir XSS
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Remueve un toast
     */
    _removeToast(toastEl) {
        if (!toastEl || !toastEl.parentNode) return;
        
        toastEl.classList.add('closing');
        setTimeout(() => {
            toastEl.remove();
            const idx = this._toasts.indexOf(toastEl);
            if (idx > -1) this._toasts.splice(idx, 1);
        }, 200);
    }
    
    /**
     * Limpia todos los toasts
     */
    clearAll() {
        [...this._toasts].forEach(t => this._removeToast(t));
    }
}

// Instancia singleton
const errorUI = new ErrorUI();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { errorUI, ErrorUI, ERROR_UI_CONFIG };
}

// Exponer globalmente para uso en navegador
if (typeof window !== 'undefined') {
    window.errorUI = errorUI;
    window.ErrorUI = ErrorUI;
}

export { errorUI, ErrorUI, ERROR_UI_CONFIG };
