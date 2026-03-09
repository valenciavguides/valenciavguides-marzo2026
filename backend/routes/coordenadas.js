/**
 * Rutas de Coordenadas
 * 
 * Endpoints para obtener coordenadas de paradas y tramos.
 */

const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { validateAventuraId, validateStopId } = require('../middleware/validation');

/**
 * GET /api/coordenadas/:aventuraId
 * Lista todas las coordenadas de una aventura
 */
router.get('/:aventuraId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const { tipo } = req.query; // Filtrar por tipo: 'parada', 'tramo', 'inicio'
        
        let coordenadas = dataService.getCoordenadas(aventuraId);
        
        if (tipo) {
            coordenadas = coordenadas.filter(c => c.tipo === tipo);
        }
        
        res.json({
            exito: true,
            aventuraId,
            total: coordenadas.length,
            coordenadas
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/coordenadas/:aventuraId/parada/:paradaId
 * Obtiene coordenadas de una parada específica
 */
router.get('/:aventuraId/parada/:paradaId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const paradaId = validateStopId(req.params.paradaId);
        
        const parada = dataService.getParada(aventuraId, paradaId);
        
        res.json({
            exito: true,
            aventuraId,
            parada
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/coordenadas/:aventuraId/tramo/:tramoId
 * Obtiene coordenadas de un tramo específico
 */
router.get('/:aventuraId/tramo/:tramoId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const tramoId = validateStopId(req.params.tramoId);
        
        const tramo = dataService.getTramo(aventuraId, tramoId);
        
        res.json({
            exito: true,
            aventuraId,
            tramo
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/coordenadas/:aventuraId/ruta/:desde/:hasta
 * Obtiene la ruta entre dos puntos (para polyline)
 */
router.get('/:aventuraId/ruta/:desde/:hasta', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const desdeId = validateStopId(req.params.desde);
        const hastaId = validateStopId(req.params.hasta);
        
        const coordenadas = dataService.getCoordenadas(aventuraId);
        
        // Encontrar índices
        const desdeIdx = coordenadas.findIndex(c => c.id === desdeId);
        const hastaIdx = coordenadas.findIndex(c => c.id === hastaId);
        
        if (desdeIdx === -1 || hastaIdx === -1) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Puntos de ruta no encontrados'
            });
        }
        
        // Extraer segmento
        const inicio = Math.min(desdeIdx, hastaIdx);
        const fin = Math.max(desdeIdx, hastaIdx);
        const ruta = coordenadas.slice(inicio, fin + 1);
        
        res.json({
            exito: true,
            aventuraId,
            desde: desdeId,
            hasta: hastaId,
            total: ruta.length,
            ruta
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
