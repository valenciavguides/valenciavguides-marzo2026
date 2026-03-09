/**
 * Tests para DataService - cobertura completa
 * Cubre: _initializeEmptyData, _loadJsonFile (archivo no encontrado), 
 * reloadData, getAventurasDisponibles, validación tipo puzzle,
 * _loadData error catch, BOM handling, idioma no disponible, etc.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

// Paths relativas al backend/ dir (Jest rootDir)
const backendDir = path.join(__dirname, '..', 'backend');
const { ApiError } = require(path.join(backendDir, 'utils', 'ApiError'));
const dataService = require(path.join(backendDir, 'services', 'dataService'));

describe('DataService', () => {
    describe('reloadData', () => {
        it('debe recargar datos y retornar timestamp', () => {
            const result = dataService.reloadData();
            
            expect(result).toHaveProperty('reloaded', true);
            expect(result).toHaveProperty('timestamp');
            expect(result.timestamp instanceof Date).toBe(true);
        });
    });
    
    describe('getAventurasDisponibles', () => {
        it('debe retornar solo aventuras con disponible=true', () => {
            const disponibles = dataService.getAventurasDisponibles();
            
            expect(Array.isArray(disponibles)).toBe(true);
            for (const aventura of disponibles) {
                expect(aventura.disponible).toBe(true);
            }
        });
    });
    
    describe('getMapeoIdiomas', () => {
        it('debe retornar el mapeo de idiomas', () => {
            const idiomas = dataService.getMapeoIdiomas();
            
            expect(idiomas).toBeDefined();
            expect(typeof idiomas).toBe('object');
        });
    });
    
    describe('_loadJsonFile - archivo inexistente', () => {
        it('debe retornar null y hacer warn para archivo no encontrado', () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            
            const result = dataService._loadJsonFile('archivo_que_no_existe.json');
            
            expect(result).toBeNull();
            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Archivo no encontrado')
            );
            
            warnSpy.mockRestore();
        });
    });
    
    describe('_initializeEmptyData', () => {
        it('debe inicializar todos los caches vacíos', () => {
            // Guardar estado original
            const originalCache = { ...dataService._cache };
            
            dataService._initializeEmptyData();
            
            expect(dataService._cache.indice).toEqual({ INDICE_AVENTURAS: {}, MAPEO_IDIOMAS: {} });
            expect(dataService._cache.coordenadas).toEqual({ DATOS_AVENTURAS: {} });
            expect(dataService._cache.audios).toEqual({ AUDIOS_AVENTURAS: {} });
            expect(dataService._cache.retos).toEqual({ RETOS_AVENTURAS: {} });
            expect(dataService._cache.puzzles).toEqual({ PUZZLES_AVENTURAS: {} });
            
            // Restaurar datos originales
            dataService._loadData();
        });
    });
    
    describe('validarRespuestaReto - tipo puzzle', () => {
        it('debe validar reto tipo puzzle con "completado"', () => {
            const result = dataService.validarRespuestaReto('Aventura1', 'es', 'PZ-8', 'completado');
            
            expect(result).toHaveProperty('correcto', true);
            expect(result).toHaveProperty('retoId', 'PZ-8');
        });
        
        it('debe rechazar reto tipo puzzle con respuesta incorrecta', () => {
            const result = dataService.validarRespuestaReto('Aventura1', 'es', 'PZ-8', 'otra_cosa');
            
            expect(result).toHaveProperty('correcto', false);
        });
    });
    
    describe('validarRespuestaReto - respuesta múltiple no-array', () => {
        it('debe retornar false si respuesta múltiple no es array', () => {
            // R-10 es opcion-multiple, necesita array
            const result = dataService.validarRespuestaReto('Aventura1', 'es', 'R-10', 'solo texto');
            
            expect(result).toHaveProperty('correcto', false);
        });
    });
    
    describe('validarRespuestaReto - reto inexistente', () => {
        it('debe lanzar error para reto inexistente', () => {
            expect(() => {
                dataService.validarRespuestaReto('Aventura1', 'es', 'R-999', 'test');
            }).toThrow();
        });
    });
    
    describe('getCoordenadas - aventura inexistente', () => {
        it('debe lanzar error para aventura sin coordenadas', () => {
            expect(() => {
                dataService.getCoordenadas('Aventura99');
            }).toThrow();
        });
    });
    
    describe('getAudios - aventura inexistente', () => {
        it('debe lanzar error para aventura sin audios', () => {
            expect(() => {
                dataService.getAudios('Aventura99', 'es');
            }).toThrow();
        });
    });
    
    describe('getRetos - aventura inexistente', () => {
        it('debe lanzar error para aventura sin retos', () => {
            expect(() => {
                dataService.getRetos('Aventura99', 'es');
            }).toThrow();
        });
    });
    
    describe('getPuzzles - aventura inexistente', () => {
        it('debe lanzar error para aventura sin puzzles', () => {
            expect(() => {
                dataService.getPuzzles('Aventura99');
            }).toThrow();
        });
    });
    
    describe('getTramo - tramo inexistente', () => {
        it('debe lanzar error para tramo no encontrado', () => {
            expect(() => {
                dataService.getTramo('Aventura1', 'TR-999');
            }).toThrow();
        });
    });
    
    describe('getAventuraCompleta - aventura no disponible', () => {
        it('debe lanzar error 403 para aventura no disponible', () => {
            try {
                dataService.getAventuraCompleta('Aventura2', 'es');
            } catch (e) {
                expect(e).toBeInstanceOf(ApiError);
                expect(e.statusCode).toBe(403);
            }
        });
    });
    
    describe('_loadData - error catch block', () => {
        it('debe llamar _initializeEmptyData si _loadJsonFile lanza error', () => {
            const originalLoadJsonFile = dataService._loadJsonFile.bind(dataService);
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Forzar que _loadJsonFile lance un error
            dataService._loadJsonFile = () => { throw new Error('JSON corrupto'); };
            
            dataService._loadData();
            
            // Verificar que se inicializaron datos vacíos
            expect(dataService._cache.indice).toEqual({ INDICE_AVENTURAS: {}, MAPEO_IDIOMAS: {} });
            
            errorSpy.mockRestore();
            dataService._loadJsonFile = originalLoadJsonFile;
            
            // Restaurar datos reales
            dataService._loadData();
        });
    });
    
    describe('_loadJsonFile - BOM handling', () => {
        it('debe eliminar BOM de archivos UTF-8', () => {
            const tmpDir = os.tmpdir();
            const tmpFile = path.join(tmpDir, 'test-bom.json');
            const bomContent = '\uFEFF{"clave": "valor"}';
            
            fs.writeFileSync(tmpFile, bomContent, 'utf8');
            
            // Guardar y cambiar _dataPath temporalmente
            const originalPath = dataService._dataPath;
            dataService._dataPath = tmpDir;
            
            const result = dataService._loadJsonFile('test-bom.json');
            
            expect(result).toEqual({ clave: 'valor' });
            
            // Restaurar
            dataService._dataPath = originalPath;
            fs.unlinkSync(tmpFile);
        });
    });
    
    describe('getAudios - idioma no disponible', () => {
        it('debe lanzar error si idioma no existe para aventura válida', () => {
            expect(() => {
                dataService.getAudios('Aventura1', 'xx');
            }).toThrow();
            
            try {
                dataService.getAudios('Aventura1', 'xx');
            } catch (e) {
                expect(e).toBeInstanceOf(ApiError);
                expect(e.statusCode).toBe(404);
                expect(e.data).toHaveProperty('idiomasDisponibles');
            }
        });
    });
    
    describe('getRetos - idioma no disponible', () => {
        it('debe lanzar error si idioma no existe para aventura válida', () => {
            expect(() => {
                dataService.getRetos('Aventura1', 'xx');
            }).toThrow();
            
            try {
                dataService.getRetos('Aventura1', 'xx');
            } catch (e) {
                expect(e).toBeInstanceOf(ApiError);
                expect(e.statusCode).toBe(404);
                expect(e.data).toHaveProperty('idiomasDisponibles');
            }
        });
    });
    
    describe('validarRespuestaReto - producción oculta pista', () => {
        it('no debe incluir pista en producción', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            
            const result = dataService.validarRespuestaReto('Aventura1', 'es', 'R-1', 'respuesta_incorrecta');
            
            expect(result.correcto).toBe(false);
            expect(result).not.toHaveProperty('pista');
            
            process.env.NODE_ENV = originalEnv;
        });
        
        it('debe incluir pista fuera de producción', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            
            const result = dataService.validarRespuestaReto('Aventura1', 'es', 'R-1', 'respuesta_incorrecta');
            
            expect(result.correcto).toBe(false);
            expect(result).toHaveProperty('pista');
            
            process.env.NODE_ENV = originalEnv;
        });
    });
    
    describe('cache null branches - optional chaining fallbacks', () => {
        let originalCache;
        
        beforeEach(() => {
            originalCache = { ...dataService._cache };
        });
        
        afterEach(() => {
            Object.assign(dataService._cache, originalCache);
        });
        
        it('getIndiceAventuras debe retornar {} si cache.indice es null', () => {
            dataService._cache.indice = null;
            expect(dataService.getIndiceAventuras()).toEqual({});
        });
        
        it('getMapeoIdiomas debe retornar {} si cache.indice es null', () => {
            dataService._cache.indice = null;
            expect(dataService.getMapeoIdiomas()).toEqual({});
        });
        
        it('getCoordenadas debe lanzar error si cache.coordenadas es null', () => {
            dataService._cache.coordenadas = null;
            expect(() => dataService.getCoordenadas('Aventura1')).toThrow();
        });
        
        it('getAudios debe lanzar error si cache.audios es null', () => {
            dataService._cache.audios = null;
            expect(() => dataService.getAudios('Aventura1', 'es')).toThrow();
        });
        
        it('getRetos debe lanzar error si cache.retos es null', () => {
            dataService._cache.retos = null;
            expect(() => dataService.getRetos('Aventura1', 'es')).toThrow();
        });
        
        it('getPuzzles debe lanzar error si cache.puzzles es null', () => {
            dataService._cache.puzzles = null;
            expect(() => dataService.getPuzzles('Aventura1')).toThrow();
        });
    });
    
    describe('nested optional chaining fallbacks', () => {
        let originalCache;
        
        beforeEach(() => {
            originalCache = JSON.parse(JSON.stringify(dataService._cache));
        });
        
        afterEach(() => {
            dataService._loadData();
        });
        
        it('getCoordenadas debe retornar [] si nested object no tiene .coordenadas', () => {
            dataService._cache.coordenadas = {
                DATOS_AVENTURAS: {
                    AventuraTest: { 'test.html': {} }
                }
            };
            expect(dataService.getCoordenadas('AventuraTest')).toEqual([]);
        });
        
        it('getPuzzles debe retornar [] si nested object no tiene .puzzle_id', () => {
            dataService._cache.puzzles = {
                PUZZLES_AVENTURAS: {
                    AventuraTest: { 'test.html': {} }
                }
            };
            expect(dataService.getPuzzles('AventuraTest')).toEqual([]);
        });
    });
    
    describe('getAventuraCompleta - default idioma parameter', () => {
        it('debe usar idioma es por defecto si no se proporciona', () => {
            const result = dataService.getAventuraCompleta('Aventura1');
            
            expect(result).toHaveProperty('info');
            expect(result).toHaveProperty('coordenadas');
            expect(result).toHaveProperty('audios');
            expect(result).toHaveProperty('retos');
            expect(result).toHaveProperty('puzzles');
        });
    });
});
