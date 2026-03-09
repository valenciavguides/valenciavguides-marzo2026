/**
 * Ruta de Health Check
 * 
 * Endpoint para verificar el estado del servidor.
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Retorna estado del servidor y endpoints disponibles
 */
router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        endpoints: {
            aventuras: {
                lista: 'GET /api/aventuras',
                detalle: 'GET /api/aventuras/:id',
                completa: 'GET /api/aventuras/:id/completa'
            },
            coordenadas: {
                por_aventura: 'GET /api/coordenadas/:aventuraId',
                por_parada: 'GET /api/coordenadas/:aventuraId/parada/:paradaId',
                por_tramo: 'GET /api/coordenadas/:aventuraId/tramo/:tramoId'
            },
            audios: {
                por_aventura: 'GET /api/audios/:aventuraId/:idioma',
                por_parada: 'GET /api/audios/:aventuraId/:idioma/parada/:paradaId'
            },
            retos: {
                por_aventura: 'GET /api/retos/:aventuraId/:idioma',
                por_id: 'GET /api/retos/:aventuraId/:idioma/:retoId',
                validar: 'POST /api/retos/:aventuraId/:idioma/:retoId/validar'
            },
            puzzles: {
                por_aventura: 'GET /api/puzzles/:aventuraId'
            }
        }
    });
});

/**
 * GET /api/health/ping
 * Simple ping para verificar conectividad
 */
router.get('/ping', (req, res) => {
    res.json({ pong: true, timestamp: Date.now() });
});

module.exports = router;
