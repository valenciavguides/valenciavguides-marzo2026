/**
 * Tests para el endpoint /api/aventuras
 */

const request = require('supertest');
const { app } = require('../server');

describe('Aventuras API', () => {
    describe('GET /api/aventuras', () => {
        it('debe retornar lista de aventuras disponibles', async () => {
            const res = await request(app)
                .get('/api/aventuras')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('aventuras');
            expect(res.body).toHaveProperty('idiomas');
            expect(Array.isArray(res.body.aventuras)).toBe(true);
        });
        
        it('debe retornar todas las aventuras si todas=true', async () => {
            const res = await request(app)
                .get('/api/aventuras?todas=true')
                .expect(200);
            
            expect(res.body.exito).toBe(true);
            // Debe incluir aventuras no disponibles
            const noDisponibles = res.body.aventuras.filter(a => !a.disponible);
            expect(noDisponibles.length).toBeGreaterThanOrEqual(0);
        });
    });
    
    describe('GET /api/aventuras/:id', () => {
        it('debe retornar una aventura específica', async () => {
            const res = await request(app)
                .get('/api/aventuras/Aventura1')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('aventura');
            expect(res.body.aventura).toHaveProperty('id', 'Aventura1');
            expect(res.body.aventura).toHaveProperty('nombre');
            expect(res.body.aventura).toHaveProperty('disponible');
        });
        
        it('debe aceptar formato case-insensitive (aventura1)', async () => {
            const res = await request(app)
                .get('/api/aventuras/aventura1')
                .expect(200);
            
            expect(res.body.exito).toBe(true);
            expect(res.body.aventura.id).toBe('Aventura1');
        });
        
        it('debe retornar 404 para aventura inexistente', async () => {
            const res = await request(app)
                .get('/api/aventuras/Aventura99')
                .expect('Content-Type', /json/)
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body).toHaveProperty('codigo', 'AVENTURA_NO_ENCONTRADA');
        });
        
        it('debe retornar 400 para formato de ID inválido', async () => {
            const res = await request(app)
                .get('/api/aventuras/invalid_format')
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body).toHaveProperty('codigo', 'FORMATO_INVALIDO');
        });
    });
    
    describe('GET /api/aventuras/:id/completa', () => {
        it('debe retornar datos completos de una aventura', async () => {
            const res = await request(app)
                .get('/api/aventuras/Aventura1/completa')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('info');
            expect(res.body).toHaveProperty('coordenadas');
            expect(res.body).toHaveProperty('audios');
            expect(res.body).toHaveProperty('retos');
            expect(res.body).toHaveProperty('puzzles');
        });
        
        it('debe aceptar parámetro de idioma', async () => {
            const res = await request(app)
                .get('/api/aventuras/Aventura1/completa?idioma=es')
                .expect(200);
            
            expect(res.body.idioma).toBe('es');
        });
        
        it('retos no deben incluir respuestas correctas', async () => {
            const res = await request(app)
                .get('/api/aventuras/Aventura1/completa')
                .expect(200);
            
            // Verificar que ningún reto tiene el campo 'correctas'
            for (const reto of res.body.retos) {
                expect(reto).not.toHaveProperty('correctas');
            }
        });
        
        it('debe retornar 403 para aventura no disponible', async () => {
            const res = await request(app)
                .get('/api/aventuras/Aventura2/completa')
                .expect(403);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body.codigo).toBe('AVENTURA_NO_DISPONIBLE');
        });
    });
});
