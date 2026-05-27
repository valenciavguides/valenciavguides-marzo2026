/**
 * Tests para el endpoint /api/retos
 */

const request = require('supertest');
const { app } = require('../server');

describe('Retos API', () => {
    describe('GET /api/retos/:aventuraId/:idioma', () => {
        it('debe retornar lista de retos', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/es')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('aventuraId', 'Aventura1');
            expect(res.body).toHaveProperty('idioma', 'es');
            expect(res.body).toHaveProperty('retos');
            expect(Array.isArray(res.body.retos)).toBe(true);
            expect(res.body.retos.length).toBeGreaterThan(0);
        });
        
        it('retos NO deben incluir respuestas correctas', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/es')
                .expect(200);
            
            // CRÍTICO: Verificar que ningún reto expone las respuestas
            for (const reto of res.body.retos) {
                expect(reto).not.toHaveProperty('correctas');
            }
        });
        
        it('cada reto debe tener estructura correcta', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/es')
                .expect(200);
            
            for (const reto of res.body.retos) {
                expect(reto).toHaveProperty('id');
                expect(reto).toHaveProperty('tipo');
                expect(reto).toHaveProperty('pregunta');
                
                // Los retos de opción deben tener opciones
                if (reto.tipo === 'opcion' || reto.tipo === 'opcion-multiple') {
                    expect(reto).toHaveProperty('opciones');
                    expect(Array.isArray(reto.opciones)).toBe(true);
                }
            }
        });
        
        it('debe retornar 404 para idioma no disponible', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/xx')
                .expect(400);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body.codigo).toBe('IDIOMA_NO_SOPORTADO');
        });
    });
    
    describe('GET /api/retos/:aventuraId/:idioma/:retoId', () => {
        it('debe retornar un reto específico', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/es/R-1')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('reto');
            expect(res.body.reto).toHaveProperty('id', 'R-1');
            expect(res.body.reto).not.toHaveProperty('correctas');
        });
        
        it('debe retornar 404 para reto inexistente', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/es/R-999')
                .expect(404);
            
            expect(res.body.codigo).toBe('RETO_NO_ENCONTRADO');
        });
        
        it('debe rechazar formato de retoId inválido', async () => {
            const res = await request(app)
                .get('/api/retos/Aventura1/es/INVALID')
                .expect(400);
            
            expect(res.body.codigo).toBe('FORMATO_INVALIDO');
        });
    });
    
    describe('POST /api/retos/:aventuraId/:idioma/:retoId/validar', () => {
        it('debe validar respuesta correcta', async () => {
            // R-1: ¿Cuántas Aventuras pueden hacerse? Respuesta: "7"
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-1/validar')
                .send({ respuesta: '7' })
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('correcto', true);
            expect(res.body).toHaveProperty('retoId', 'R-1');
        });
        
        it('debe validar respuesta incorrecta', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-1/validar')
                .send({ respuesta: '5' })
                .expect(200);
            
            expect(res.body.exito).toBe(true);
            expect(res.body.correcto).toBe(false);
        });
        
        it('debe validar respuesta de opción correcta', async () => {
            // R-2: Torres de Serranos
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-2/validar')
                .send({ respuesta: 'Torres de Serranos' })
                .expect(200);
            
            expect(res.body.correcto).toBe(true);
        });
        
        it('debe ser case-insensitive en la validación', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-2/validar')
                .send({ respuesta: 'torres de serranos' })
                .expect(200);
            
            expect(res.body.correcto).toBe(true);
        });
        
        it('debe validar respuestas múltiples', async () => {
            // R-10: Respuestas múltiples ["Un Altar", "Una bandera"]
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-10/validar')
                .send({ respuesta: ['Un Altar', 'Una bandera'] })
                .expect(200);
            
            expect(res.body.correcto).toBe(true);
        });
        
        it('debe rechazar respuesta múltiple incompleta', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-10/validar')
                .send({ respuesta: ['Un Altar'] }) // Falta "Una bandera"
                .expect(200);
            
            expect(res.body.correcto).toBe(false);
        });
        
        it('debe retornar 400 si no se envía respuesta', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-1/validar')
                .send({})
                .expect(400);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body.codigo).toBe('PARAMETRO_REQUERIDO');
        });
        
        it('debe retornar 404 para reto inexistente', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/R-999/validar')
                .send({ respuesta: 'test' })
                .expect(404);
            
            expect(res.body.codigo).toBe('RETO_NO_ENCONTRADO');
        });
        
        it('debe rechazar formato de retoId inválido en validación', async () => {
            const res = await request(app)
                .post('/api/retos/Aventura1/es/INVALID/validar')
                .send({ respuesta: 'test' })
                .expect(400);
            
            expect(res.body.codigo).toBe('FORMATO_INVALIDO');
        });
    });
});
