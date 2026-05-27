/**
 * Tests para el endpoint /api/audios
 */

const request = require('supertest');
const { app } = require('../server');

describe('Audios API', () => {
    describe('GET /api/audios/:aventuraId/:idioma', () => {
        it('debe retornar lista de audios', async () => {
            const res = await request(app)
                .get('/api/audios/Aventura1/es')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('aventuraId', 'Aventura1');
            expect(res.body).toHaveProperty('idioma', 'es');
            expect(res.body).toHaveProperty('audios');
            expect(Array.isArray(res.body.audios)).toBe(true);
        });
        
        it('cada audio debe tener estructura correcta', async () => {
            const res = await request(app)
                .get('/api/audios/Aventura1/es')
                .expect(200);
            
            for (const audio of res.body.audios) {
                expect(audio).toHaveProperty('id');
                expect(audio).toHaveProperty('title');
                expect(audio).toHaveProperty('file');
            }
        });
        
        it('debe retornar 400 para idioma inválido', async () => {
            const res = await request(app)
                .get('/api/audios/Aventura1/invalid')
                .expect(400);
            
            expect(res.body.codigo).toBe('IDIOMA_NO_SOPORTADO');
        });
    });
    
    describe('GET /api/audios/:aventuraId/:idioma/parada/:paradaId', () => {
        it('debe retornar audio de una parada', async () => {
            const res = await request(app)
                .get('/api/audios/Aventura1/es/parada/P-0')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('audio');
            expect(res.body.audio).toHaveProperty('id', 'audio-P-0');
            expect(res.body.audio).toHaveProperty('file');
        });
        
        it('debe retornar 404 para parada sin audio', async () => {
            const res = await request(app)
                .get('/api/audios/Aventura1/es/parada/P-999')
                .expect(404);
            
            expect(res.body.codigo).toBe('AUDIO_NO_ENCONTRADO');
        });
    });
});
