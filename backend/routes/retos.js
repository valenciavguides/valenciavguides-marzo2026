/**
 * Rutas de Retos
 * 
 * Endpoints para obtener y validar retos.
 */

const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { validateAventuraId, validateIdioma, requireParam } = require('../middleware/validation');
const { validateRespuesta } = require('../middleware/inputSanitizer');
const { ApiError, ErrorCodes } = require('../utils/ApiError');

/**
 * GET /api/retos/:aventuraId/:idioma
 * Lista todos los retos de una aventura (sin respuestas correctas)
 */
router.get('/:aventuraId/:idioma', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const idioma = validateIdioma(req.params.idioma);
        
        const retos = dataService.getRetos(aventuraId, idioma);
        
        // Eliminar respuestas correctas antes de enviar
        const retosSegur = retos.map(r => {
            const reto = { ...r };
            delete reto.correctas;
            return reto;
        });
        
        res.json({
            exito: true,
            aventuraId,
            idioma,
            total: retosSegur.length,
            retos: retosSegur
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/retos/:aventuraId/:idioma/:retoId
 * Obtiene un reto específico (sin respuesta correcta)
 */
router.get('/:aventuraId/:idioma/:retoId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const idioma = validateIdioma(req.params.idioma);
        const { retoId } = req.params;
        
        if (!retoId || !/^(R-\d+|PZ-\d+)$/i.test(retoId)) {
            throw new ApiError(
                400,
                `ID de reto inválido: '${retoId}'. Formato esperado: R-1, R-2, PZ-01, etc.`,
                ErrorCodes.FORMATO_INVALIDO,
                { parametro: 'retoId', valorRecibido: retoId }
            );
        }
        
        const reto = dataService.getReto(aventuraId, idioma, retoId.toUpperCase());
        
        res.json({
            exito: true,
            aventuraId,
            idioma,
            reto
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/retos/:aventuraId/:idioma/:retoId/validar
 * Valida una respuesta a un reto
 * 
 * Body: { respuesta: "valor" } o { respuesta: ["valor1", "valor2"] }
 */
router.post('/:aventuraId/:idioma/:retoId/validar', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const idioma = validateIdioma(req.params.idioma);
        const { retoId } = req.params;
        
        if (!retoId || !/^(R-\d+|PZ-\d+)$/i.test(retoId)) {
            throw new ApiError(
                400,
                `ID de reto inválido: '${retoId}'. Formato esperado: R-1, R-2, PZ-01, etc.`,
                ErrorCodes.FORMATO_INVALIDO,
                { parametro: 'retoId', valorRecibido: retoId }
            );
        }
        
        const { respuesta } = req.body;
        
        // Validar y sanitizar respuesta (strip HTML, límites de longitud)
        const respuestaLimpia = validateRespuesta(respuesta);
        
        const resultado = dataService.validarRespuestaReto(
            aventuraId, 
            idioma, 
            retoId, 
            respuestaLimpia
        );
        
        res.json({
            exito: true,
            ...resultado
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
