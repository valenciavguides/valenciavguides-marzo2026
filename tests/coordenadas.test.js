/**
 * Tests para el endpoint /api/coordenadas
 */

const request = require('supertest');
const { app } = require('../server');

describe('Coordenadas API', () => {
    describe('GET /api/coordenadas/:aventuraId', () => {
        it('debe retornar todas las coordenadas de una aventura', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('aventuraId', 'Aventura1');
            expect(res.body).toHaveProperty('coordenadas');
            expect(Array.isArray(res.body.coordenadas)).toBe(true);
            expect(res.body.coordenadas.length).toBeGreaterThan(0);
        });
        
        it('debe filtrar por tipo=parada', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1?tipo=parada')
                .expect(200);
            
            expect(res.body.exito).toBe(true);
            // Todas deben ser paradas
            for (const coord of res.body.coordenadas) {
                expect(coord.tipo).toBe('parada');
            }
        });
        
        it('debe filtrar por tipo=tramo', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1?tipo=tramo')
                .expect(200);
            
            expect(res.body.exito).toBe(true);
            for (const coord of res.body.coordenadas) {
                expect(coord.tipo).toBe('tramo');
            }
        });
        
        it('cada coordenada debe tener estructura correcta', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1')
                .expect(200);
            
            for (const coord of res.body.coordenadas) {
                expect(coord).toHaveProperty('id');
                expect(coord).toHaveProperty('tipo');
                expect(coord).toHaveProperty('nombre');
                
                // Paradas tienen 'coordenadas', tramos tienen 'inicio' y 'fin'
                if (coord.tipo === 'parada' || coord.tipo === 'inicio') {
                    expect(coord).toHaveProperty('coordenadas');
                    expect(coord.coordenadas).toHaveProperty('lat');
                    expect(coord.coordenadas).toHaveProperty('lng');
                } else if (coord.tipo === 'tramo') {
                    expect(coord).toHaveProperty('inicio');
                    expect(coord).toHaveProperty('fin');
                }
            }
        });
    });
    
    describe('GET /api/coordenadas/:aventuraId/parada/:paradaId', () => {
        it('debe retornar una parada específica', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/parada/P-0')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('parada');
            expect(res.body.parada).toHaveProperty('id', 'P-0');
            expect(res.body.parada).toHaveProperty('coordenadas');
        });
        
        it('debe retornar 404 para parada inexistente', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/parada/P-999')
                .expect(404);
            
            expect(res.body).toHaveProperty('error', true);
            expect(res.body.codigo).toBe('PARADA_NO_ENCONTRADA');
        });
        
        it('debe validar formato de ID de parada', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/parada/INVALID')
                .expect(400);
            
            expect(res.body.codigo).toBe('FORMATO_INVALIDO');
        });
    });
    
    describe('GET /api/coordenadas/:aventuraId/tramo/:tramoId', () => {
        it('debe retornar un tramo específico', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/tramo/TR-1')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('tramo');
            expect(res.body.tramo).toHaveProperty('id', 'TR-1');
            expect(res.body.tramo).toHaveProperty('inicio');
            expect(res.body.tramo).toHaveProperty('fin');
        });
        
        it('tramo debe tener waypoints', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/tramo/TR-1')
                .expect(200);
            
            expect(res.body.tramo).toHaveProperty('waypoints');
            expect(Array.isArray(res.body.tramo.waypoints)).toBe(true);
        });
    });
    
    describe('GET /api/coordenadas/:aventuraId/ruta/:desde/:hasta', () => {
        it('debe retornar la ruta entre dos puntos', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1/ruta/P-0/P-1')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(res.body).toHaveProperty('exito', true);
            expect(res.body).toHaveProperty('desde', 'P-0');
            expect(res.body).toHaveProperty('hasta', 'P-1');
            expect(res.body).toHaveProperty('ruta');
            expect(Array.isArray(res.body.ruta)).toBe(true);
        });
    });

    describe('Video paths en coordenadas', () => {
        it('entradas con video en Aventura1 deben usar la carpeta videos-aventuras/av1/', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1')
                .expect(200);

            const conVideo = res.body.coordenadas.filter(c => c.video);
            expect(conVideo.length).toBeGreaterThan(0);

            for (const entrada of conVideo) {
                expect(entrada.video).toMatch(/^videos-aventuras\/av1\//);
                expect(entrada.video).not.toMatch(/^videos\//);
            }
        });

        it('las rutas de video de Aventura1 deben terminar en .mp4', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1')
                .expect(200);

            const conVideo = res.body.coordenadas.filter(c => c.video);
            for (const entrada of conVideo) {
                expect(entrada.video).toMatch(/\.mp4$/);
            }
        });

        it('no deben existir rutas de video con el prefijo antiguo videos/', async () => {
            const res = await request(app)
                .get('/api/coordenadas/Aventura1')
                .expect(200);

            const conPrefijoCorrecto = res.body.coordenadas.filter(c => c.video && c.video.startsWith('videos/'));
            expect(conPrefijoCorrecto).toHaveLength(0);
        });
    });
});
