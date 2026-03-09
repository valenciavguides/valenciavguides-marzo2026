/**
 * Tests para el endpoint /api/health
 */

const request = require('supertest');
const { app } = require('../server');

describe('Health API', () => {
    describe('GET /api/health', () => {
        it('debe retornar estado ok y lista de endpoints', async () => {
            const res = await request(app)
                .get('/api/health')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('status', 'ok');
            expect(res.body).toHaveProperty('version');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('endpoints');
            expect(res.body.endpoints).toHaveProperty('aventuras');
            expect(res.body.endpoints).toHaveProperty('coordenadas');
            expect(res.body.endpoints).toHaveProperty('audios');
            expect(res.body.endpoints).toHaveProperty('retos');
            expect(res.body.endpoints).toHaveProperty('puzzles');
        });
    });
    
    describe('GET /api/health/ping', () => {
        it('debe retornar pong con timestamp', async () => {
            const res = await request(app)
                .get('/api/health/ping')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('pong', true);
            expect(res.body).toHaveProperty('timestamp');
            expect(typeof res.body.timestamp).toBe('number');
        });
    });
});
