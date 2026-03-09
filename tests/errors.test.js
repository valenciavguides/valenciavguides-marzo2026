/**
 * Tests para el middleware de errores y validación
 */

const request = require('supertest');
const { app } = require('../server');

describe('Error Handling', () => {
    describe('Rutas no encontradas', () => {
        it('debe retornar 404 para rutas inexistentes', async () => {
            const res = await request(app)
                .get('/api/ruta/que/no/existe')
                .expect('Content-Type', /json/)
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body).toHaveProperty('codigo', 'NOT_FOUND');
            expect(res.body).toHaveProperty('mensaje');
            expect(res.body).toHaveProperty('timestamp');
        });
    });
    
    describe('JSON malformado', () => {
        it('debe retornar 400 para JSON inválido', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-1/validar')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }')
                .expect(400);
            
            expect(res.body).toHaveProperty('error', true);
        });
    });
    
    describe('Respuesta de errores estructurada', () => {
        it('todos los errores deben tener estructura consistente', async () => {
            const res = await request(app)
                .get('/api/aventuras/AventuraInvalida')
                .expect(400);
            
            // Verificar estructura
            expect(res.body).toHaveProperty('error', true);
            expect(res.body).toHaveProperty('codigo');
            expect(res.body).toHaveProperty('mensaje');
            expect(res.body).toHaveProperty('timestamp');
            
            // Timestamp debe ser ISO 8601
            expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
        });
    });
});

describe('Validation Middleware', () => {
    describe('validateAventuraId', () => {
        it('debe aceptar formato Aventura1', async () => {
            await request(app)
                .get('/api/aventuras/Aventura1')
                .expect(200);
        });
        
        it('debe aceptar formato aventura1 (lowercase)', async () => {
            await request(app)
                .get('/api/aventuras/aventura1')
                .expect(200);
        });
        
        it('debe rechazar formato inválido', async () => {
            const res = await request(app)
                .get('/api/aventuras/MiAventura')
                .expect(400);
            
            expect(res.body.codigo).toBe('FORMATO_INVALIDO');
        });
    });
    
    describe('validateIdioma', () => {
        const idiomasValidos = ['es', 'en', 'fr', 'it', 'nl', 'ja'];
        
        for (const idioma of idiomasValidos) {
            it(`debe aceptar idioma '${idioma}'`, async () => {
                // Nota: Puede dar 404 si no hay datos para ese idioma,
                // pero no debe dar error de validación
                const res = await request(app)
                    .get(`/api/audios/Aventura1/${idioma}`);
                
                expect(res.body.codigo).not.toBe('IDIOMA_NO_SOPORTADO');
            });
        }
        
        it('debe rechazar idioma inválido', async () => {
            const res = await request(app)
                .get('/api/audios/Aventura1/xyz')
                .expect(400);
            
            expect(res.body.codigo).toBe('IDIOMA_NO_SOPORTADO');
        });
    });
    
    describe('validateStopId', () => {
        it('debe aceptar formato P-0', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/parada/P-0');
            
            expect(res.body.codigo).not.toBe('FORMATO_INVALIDO');
        });
        
        it('debe aceptar formato TR-1', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/tramo/TR-1');
            
            expect(res.body.codigo).not.toBe('FORMATO_INVALIDO');
        });
        
        it('debe rechazar formato inválido', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/parada/PARADA1')
                .expect(400);
            
            expect(res.body.codigo).toBe('FORMATO_INVALIDO');
        });
    });
});
