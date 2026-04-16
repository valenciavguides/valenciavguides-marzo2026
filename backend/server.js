/**
 * Valencia VGuides - Backend API Server
 * 
 * Servidor Express con API REST para gestionar aventuras turísticas.
 * Separa la lógica de datos del frontend para mayor seguridad.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Importar rutas
const aventurasRoutes = require('./routes/aventuras');
const coordenadasRoutes = require('./routes/coordenadas');
const audiosRoutes = require('./routes/audios');
const retosRoutes = require('./routes/retos');
const puzzlesRoutes = require('./routes/puzzles');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');

// Importar middleware
const errorHandler = require('./middleware/errorHandler');
const { requireAuth } = require('./middleware/auth');
const { ipBanMiddleware } = require('./middleware/ipBan');
const { sanitizeInputMiddleware } = require('./middleware/inputSanitizer');
const { ApiError } = require('./utils/ApiError');
const { logSecurityEvent, SecurityEvents } = require('./utils/securityLogger');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DOMAIN = process.env.DOMAIN || 'localhost';

// ========================================
// VALIDACIÓN DE ARRANQUE (producción)
// ========================================
if (NODE_ENV === 'production') {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'dev-secret-no-usar-en-produccion') {
        console.error('CRITICAL: JWT_SECRET no está configurado para producción. Establece una clave segura en .env');
        process.exit(1);
    }
    if (process.env.AUTH_ENABLED !== 'true') {
        console.error('CRITICAL: AUTH_ENABLED debe ser true en producción. El servidor no arrancará sin autenticación activa.');
        process.exit(1);
    }
}

// ========================================
// MIDDLEWARE DE SEGURIDAD
// ========================================

// Helmet - Headers de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:*", "https://*"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS - Configuración de orígenes permitidos (dinámica según entorno)
const corsOptions = {
    origin: function (origin, callback) {
        // Requests sin origin: permitir solo en desarrollo (Postman, curl, etc.)
        if (!origin) {
            if (NODE_ENV !== 'production') return callback(null, true);
            return callback(new ApiError(403, 'Origin header requerido'));
        }
        
        const allowedOrigins = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:3001',
            // Dominios de producción
            `https://${DOMAIN}`,
            `https://www.${DOMAIN}`,
            `https://api.${DOMAIN}`
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS rechazado para origen: ${origin}`);
            callback(new ApiError(403, 'Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Bloqueo de IPs baneadas (ANTES de cualquier otra lógica)
app.use(ipBanMiddleware);

// Rate limiting - Protección contra ataques de fuerza bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requests por ventana por IP
    message: {
        error: true,
        codigo: 'RATE_LIMIT_EXCEEDED',
        mensaje: 'Demasiadas solicitudes. Por favor, intente de nuevo más tarde.',
        reintentar_en: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const ip = req.ip || req.socket.remoteAddress;
        logSecurityEvent({
            type: SecurityEvents.RATE_LIMIT_HIT,
            ip,
            message: 'Límite global de peticiones alcanzado (100/15min)',
            path: req.path,
            method: req.method
        });
        res.status(options.statusCode).json(options.message);
    }
});
app.use('/api/', limiter);

// Rate limiting estricto para activación de códigos (anti fuerza bruta)
const activarLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 intentos de activación por IP cada 15 min
    message: {
        error: true,
        codigo: 'ACTIVACION_RATE_LIMIT',
        mensaje: 'Demasiados intentos de activación. Espere 15 minutos antes de intentar de nuevo.',
        reintentar_en: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/auth/activar', activarLimiter);

// Rate limiting para validación de retos (anti fuerza bruta de respuestas)
const retosLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 30, // Máximo 30 validaciones por IP cada 5 min
    message: {
        error: true,
        codigo: 'RATE_LIMIT_EXCEEDED',
        mensaje: 'Demasiados intentos. Espere unos minutos antes de continuar.',
        reintentar_en: '5 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/retos/', retosLimiter);

// ========================================
// MIDDLEWARE GENERAL
// ========================================

// Logging en desarrollo
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Parseo de JSON (100KB suficiente para códigos de activación y respuestas de retos)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Sanitización de inputs (después de parsear JSON, antes de rutas)
app.use(sanitizeInputMiddleware);

// ========================================
// RUTAS API
// ========================================

// Rutas públicas (sin autenticación)
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Rutas protegidas (requireAuth es pass-through en desarrollo)
app.use('/api/aventuras', requireAuth, aventurasRoutes);
app.use('/api/coordenadas', requireAuth, coordenadasRoutes);
app.use('/api/audios', requireAuth, audiosRoutes);
app.use('/api/retos', requireAuth, retosRoutes);
app.use('/api/puzzles', requireAuth, puzzlesRoutes);

// ========================================
// MANEJO DE ERRORES
// ========================================

// Ruta no encontrada
app.use((req, res, next) => {
    next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.path}`));
});

// Middleware de errores centralizado
app.use(errorHandler);

// ========================================
// INICIO DEL SERVIDOR
// ========================================

let server;

const startServer = () => {
    // En producción, usar HTTPS; en desarrollo, usar HTTP
    const isProduction = NODE_ENV === 'production';
    const protocol = isProduction ? 'https' : 'http';
    const serverUrl = isProduction 
        ? `${protocol}://${DOMAIN}:${PORT}`
        : `${protocol}://localhost:${PORT}`;
    
    if (isProduction) {
        // Intentar cargar certificados SSL
        const certPath = process.env.CERT_PATH || path.join(__dirname, '../certs/cert.pem');
        const keyPath = process.env.KEY_PATH || path.join(__dirname, '../certs/key.pem');
        
        if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
            const options = {
                cert: fs.readFileSync(certPath),
                key: fs.readFileSync(keyPath)
            };
            server = https.createServer(options, app).listen(PORT, () => {
                console.log('╔═══════════════════════════════════════════════════════════╗');
                console.log('║     Valencia VGuides - Backend API (HTTPS)                 ║');
                console.log('╠═══════════════════════════════════════════════════════════╣');
                console.log(`║  🚀 Servidor HTTPS en: ${serverUrl.padEnd(43)} ║`);
                console.log(`║  📊 Entorno: Producción (HTTPS Seguro)                    ║`);
                console.log('║  🔒 Certificado SSL: Activo                              ║');
                console.log('║  📚 Documentación: /api/health                            ║');
                console.log('╚═══════════════════════════════════════════════════════════╝');
            });
        } else {
            console.warn('⚠️  Certificados SSL no encontrados. Usando HTTP en producción.');
            console.warn(`   Buscado en: ${certPath}`);
            server = app.listen(PORT, () => {
                console.log('╔═══════════════════════════════════════════════════════════╗');
                console.log('║     Valencia VGuides - Backend API (HTTP)                  ║');
                console.log('╠═══════════════════════════════════════════════════════════╣');
                console.log(`║  🚀 Servidor HTTP en: ${serverUrl.padEnd(43)} ║`);
                console.log('║  ⚠️  Certificados SSL no disponibles                      ║');
                console.log('║  📚 Documentación: /api/health                            ║');
                console.log('╚═══════════════════════════════════════════════════════════╝');
            });
        }
    } else {
        // Desarrollo: HTTP seguro en localhost
        server = app.listen(PORT, () => {
            console.log('╔═══════════════════════════════════════════════════════════╗');
            console.log('║     Valencia VGuides - Backend API (Desarrollo)           ║');
            console.log('╠═══════════════════════════════════════════════════════════╣');
            console.log(`║  🚀 Servidor corriendo en: ${serverUrl.padEnd(36)} ║`);
            console.log(`║  📊 Entorno: Desarrollo                                  ║`);
            console.log('║  📚 Documentación API: /api/health                        ║');
            console.log('╚═══════════════════════════════════════════════════════════╝');
        });
    }
    return server;
};

const stopServer = () => {
    if (server) {
        server.close();
    }
};

// Solo iniciar si no es test
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = { app, startServer, stopServer };
