/**
 * Rutas de Audios
 * 
 * Endpoints para obtener información de archivos de audio.
 */

const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { validateAventuraId, validateIdioma, validateStopId } = require('../middleware/validation');

/**
 * GET /api/audios/:aventuraId/:idioma
 * Lista todos los audios de una aventura en un idioma
 */
router.get('/:aventuraId/:idioma', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const idioma = validateIdioma(req.params.idioma);
        
        const audios = dataService.getAudios(aventuraId, idioma);
        
        res.json({
            exito: true,
            aventuraId,
            idioma,
            total: audios.length,
            audios
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/audios/:aventuraId/:idioma/parada/:paradaId
 * Obtiene el audio de una parada específica
 */
router.get('/:aventuraId/:idioma/parada/:paradaId', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.aventuraId);
        const idioma = validateIdioma(req.params.idioma);
        const paradaId = validateStopId(req.params.paradaId);
        
        const audio = dataService.getAudioParada(aventuraId, idioma, paradaId);
        
        res.json({
            exito: true,
            aventuraId,
            idioma,
            paradaId,
            audio
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
