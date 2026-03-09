/**
 * Tests de cobertura adicional para rutas y ApiError
 * Cubre: catch blocks en routes, ruta entre puntos no encontrados,
 * ApiError con statusCode desconocido, route catch blocks
 */

const path = require('path');
const request = require('supertest');
const { app } = require('../server');
const { ApiError } = require(path.join(__dirname, '..', 'backend', 'utils', 'ApiError'));
const dataService = require(path.join(__dirname, '..', 'backend', 'services', 'dataService'));

describe('ApiError', () => {
    it('debe generar UNKNOWN_ERROR para statusCode no mapeado', () => {
        const err = new ApiError(418, 'Soy una tetera');
        
        expect(err.statusCode).toBe(418);
        expect(err.errorCode).toBe('UNKNOWN_ERROR');
        expect(err.message).toBe('Soy una tetera');
    });
    
    it('toJSON debe incluir datos cuando se proporcionan', () => {
        const err = new ApiError(400, 'Test', 'TEST_ERROR', { campo: 'valor' });
        const json = err.toJSON();
        
        expect(json).toHaveProperty('datos', { campo: 'valor' });
        expect(json).toHaveProperty('codigo', 'TEST_ERROR');
    });
    
    it('toJSON no debe incluir datos cuando no se proporcionan', () => {
        const err = new ApiError(404, 'No encontrado');
        const json = err.toJSON();
        
        expect(json).not.toHaveProperty('datos');
    });
    
    it('debe tener isOperational en true', () => {
        const err = new ApiError(500, 'Error');
        expect(err.isOperational).toBe(true);
    });
    
    it('debe mapear statusCode 401 a UNAUTHORIZED', () => {
        const err = new ApiError(401, 'No autorizado');
        expect(err.errorCode).toBe('UNAUTHORIZED');
    });
    
    it('debe mapear statusCode 403 a FORBIDDEN', () => {
        const err = new ApiError(403, 'Prohibido');
        expect(err.errorCode).toBe('FORBIDDEN');
    });
    
    it('debe mapear statusCode 429 a TOO_MANY_REQUESTS', () => {
        const err = new ApiError(429, 'Demasiadas peticiones');
        expect(err.errorCode).toBe('TOO_MANY_REQUESTS');
    });
    
    it('debe mapear statusCode 500 a INTERNAL_ERROR', () => {
        const err = new ApiError(500, 'Error interno');
        expect(err.errorCode).toBe('INTERNAL_ERROR');
    });
});

describe('Coordenadas - rutas adicionales', () => {
    describe('GET /api/coordenadas/:aventuraId/ruta/:desde/:hasta', () => {
        it('debe retornar 404 si punto "desde" no existe', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/ruta/P-999/P-1')
                .expect(404);
            
            expect(res.body.exito).toBe(false);
        });
        
        it('debe retornar 404 si punto "hasta" no existe', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/ruta/P-0/P-999')
                .expect(404);
            
            expect(res.body.exito).toBe(false);
        });
    });
    
    describe('GET /api/coordenadas/:aventuraId/tramo/:tramoId', () => {
        it('debe retornar 404 para tramo inexistente', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/tramo/TR-999')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
        });
    });
    
    describe('errores de aventura inexistente en coordenadas', () => {
        it('debe retornar error al buscar coordenadas de aventura inexistente', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura99')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
        });
        
        it('debe retornar error al buscar parada de aventura inexistente', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura99/parada/P-0')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
        });
        
        it('debe retornar error al buscar tramo de aventura inexistente', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura99/tramo/TR-1')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
        });
        
        it('debe retornar error al buscar ruta de aventura inexistente', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura99/ruta/P-0/P-1')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
        });
    });
});

describe('Puzzles - errores adicionales', () => {
    describe('GET /api/puzzles/intro', () => {
        it('intro debe tener estructura correcta', async () => {
            const res = await request(app)
                .get('/api/puzzles/intro')
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('puzzles');
            expect(Array.isArray(res.body.puzzles)).toBe(true);
        });
    });
    
    describe('errores de aventura inexistente en puzzles', () => {
        it('debe retornar error al listar puzzles de aventura inexistente', async () => {
            const res = await request(app)
                .get('/api/puzzles/Aventura99')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
        });
    });
});

describe('Aventuras - errores adicionales', () => {
    describe('GET /api/aventuras', () => {
        it('listado no debe fallar nunca', async () => {
            const res = await request(app)
                .get('/api/aventuras')
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('total');
        });
    });
    
    describe('GET /api/aventuras - catch block', () => {
        it('debe manejar error inesperado en listado de aventuras', async () => {
            const spy = jest.spyOn(dataService, 'getIndiceAventuras')
                .mockImplementation(() => { throw new Error('error inesperado'); });
            
            const res = await request(app)
                .get('/api/aventuras')
                .expect(500);
            
            expect(res.body).toHaveProperty('error', true);
            
            spy.mockRestore();
        });
    });
});

describe('Puzzles - catch blocks', () => {
    describe('GET /api/puzzles/intro - catch block', () => {
        it('debe manejar error inesperado en puzzles intro', async () => {
            const spy = jest.spyOn(dataService, 'getPuzzles')
                .mockImplementation(() => { throw new Error('error inesperado'); });
            
            const res = await request(app)
                .get('/api/puzzles/intro')
                .expect(500);
            
            expect(res.body).toHaveProperty('error', true);
            
            spy.mockRestore();
        });
    });
});
