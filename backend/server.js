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

// Importar middleware
const errorHandler = require('./middleware/errorHandler');
const { ApiError } = require('./utils/ApiError');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DOMAIN = process.env.DOMAIN || 'localhost';

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
        // Permitir requests sin origin (apps móviles, Postman, etc.)
        if (!origin) return callback(null, true);
        
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

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
    legacyHeaders: false
});
app.use('/api/', limiter);

// ========================================
// MIDDLEWARE GENERAL
// ========================================

// Logging en desarrollo
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ========================================
// RUTAS API
// ========================================

// Health check
app.use('/api/health', healthRoutes);

// Rutas principales
app.use('/api/aventuras', aventurasRoutes);
app.use('/api/coordenadas', coordenadasRoutes);
app.use('/api/audios', audiosRoutes);
app.use('/api/retos', retosRoutes);
app.use('/api/puzzles', puzzlesRoutes);

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
