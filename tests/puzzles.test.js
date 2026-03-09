/**
 * Tests para el endpoint /api/puzzles
 */

const request = require('supertest');
const { app } = require('../server');

describe('Puzzles API', () => {
    describe('GET /api/puzzles/intro', () => {
        it('debe retornar puzzles de introducción', async () => {
            const res = await request(app)
                .get('/api/puzzles/intro')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('puzzles');
        });
    });
    
    describe('GET /api/puzzles/:aventuraId', () => {
        it('debe retornar lista de puzzles', async () => {
            const res = await request(app)
                .get('/api/puzzles/Aventura1')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('aventuraId', 'Aventura1');
            expect(res.body).toHaveProperty('puzzles');
            expect(Array.isArray(res.body.puzzles)).toBe(true);
        });
        
        it('cada puzzle debe tener id e imagen', async () => {
            const res = await request(app)
                .get('/api/puzzles/Aventura1')
                .expect(200);
            
            for (const puzzle of res.body.puzzles) {
                expect(puzzle).toHaveProperty('id');
                expect(puzzle).toHaveProperty('imagen');
            }
        });
    });
    
    describe('GET /api/puzzles/:aventuraId/:puzzleId', () => {
        it('debe retornar un puzzle específico', async () => {
            const res = await request(app)
                .get('/api/puzzles/Aventura1/PZ-01')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('puzzle');
            expect(res.body.puzzle).toHaveProperty('id', 'PZ-01');
        });
        
        it('debe retornar 404 para puzzle inexistente', async () => {
            const res = await request(app)
                .get('/api/puzzles/Aventura1/PZ-999')
                .expect(404);
            
            expect(res.body.codigo).toBe('PUZZLE_NO_ENCONTRADO');
        });
        
        it('debe rechazar formato de puzzleId inválido', async () => {
            const res = await request(app)
                .get('/api/puzzles/Aventura1/INVALID')
                .expect(400);
            
            expect(res.body.codigo).toBe('FORMATO_INVALIDO');
        });
    });
});
