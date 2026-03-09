/**
 * Rutas de Aventuras
 * 
 * Endpoints para obtener información de aventuras disponibles.
 */

const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { validateAventuraId, validateIdioma } = require('../middleware/validation');

/**
 * GET /api/aventuras
 * Lista todas las aventuras (filtra disponibles por defecto)
 */
router.get('/', (req, res, next) => {
    try {
        const { todas } = req.query;
        const incluirTodas = todas === 'true' || todas === '1';
        
        const indice = dataService.getIndiceAventuras();
        const idiomas = dataService.getMapeoIdiomas();
        
        let aventuras = Object.values(indice);
        
        if (!incluirTodas) {
            aventuras = aventuras.filter(a => a.disponible);
        }
        
        res.json({
            exito: true,
            total: aventuras.length,
            aventuras,
            idiomas
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/aventuras/:id
 * Obtiene información de una aventura específica
 */
router.get('/:id', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.id);
        const aventura = dataService.getAventura(aventuraId);
        
        res.json({
            exito: true,
            aventura
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/aventuras/:id/completa
 * Obtiene todos los datos de una aventura (coordenadas, audios, retos, puzzles)
 */
router.get('/:id/completa', (req, res, next) => {
    try {
        const aventuraId = validateAventuraId(req.params.id);
        const idioma = req.query.idioma ? validateIdioma(req.query.idioma) : 'es';
        
        const datos = dataService.getAventuraCompleta(aventuraId, idioma);
        
        res.json({
            exito: true,
            aventuraId,
            idioma,
            ...datos
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
