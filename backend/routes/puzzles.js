/**
 * Rutas de Puzzles
 * 
 * Endpoints para obtener información de puzzles.
 */

const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { validateAventuraId } = require('../middleware/validation');

/**
 * GET /api/puzzles/intro
 * Obtiene el puzzle de introducción
 * (Definido antes de las rutas con parámetros para evitar conflicto)
 */
router.get('/intro', (req, res, next) => {
    try {
        const puzzles = dataService.getPuzzles('INTRO');
        
        res.json({
            exito: true,
            puzzles
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/puzzles/:aventuraId
 * Lista todos los puzzles de una aventura
 */
router.get('/:aventuraId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        
        const puzzles = dataService.getPuzzles(aventuraId);
        
        res.json({
            exito: true,
            aventuraId,
            total: puzzles.length,
            puzzles
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/puzzles/:aventuraId/:puzzleId
 * Obtiene un puzzle específico
 */
router.get('/:aventuraId/:puzzleId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const { puzzleId } = req.params;
        
        if (!puzzleId || !/^PZ-\d+$/i.test(puzzleId)) {
            return next(new (require('../utils/ApiError').ApiError)(
                400,
                `ID de puzzle inválido: '${puzzleId}'. Formato esperado: PZ-01, PZ-02, etc.`,
                'FORMATO_INVALIDO',
                { parametro: 'puzzleId', valorRecibido: puzzleId }
            ));
        }
        
        const puzzle = dataService.getPuzzle(aventuraId, puzzleId.toUpperCase());
        
        res.json({
            exito: true,
            aventuraId,
            puzzle
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
