/**
 * Tests para middleware de validación y manejo de errores
 * Cubre líneas sin cobertura en validation.js y errorHandler.js
 */

const path = require('path');
const request = require('supertest');
const { app } = require('../server');

const backendDir = path.join(__dirname, '..', 'backend');
const { requireParam, validateQueryParams, validateIdioma } = require(path.join(backendDir, 'middleware', 'validation'));
const errorHandler = require(path.join(backendDir, 'middleware', 'errorHandler'));

describe('Validation Middleware - funciones directas', () => {
    describe('requireParam', () => {
        it('debe lanzar error si valor es undefined', () => {
            expect(() => requireParam(undefined, 'test')).toThrow();
        });
        
        it('debe lanzar error si valor es null', () => {
            expect(() => requireParam(null, 'campo')).toThrow();
        });
        
        it('debe lanzar error si valor es string vacío', () => {
            expect(() => requireParam('', 'campo')).toThrow();
        });
        
        it('debe retornar el valor si es válido', () => {
            expect(requireParam('valor', 'campo')).toBe('valor');
        });
        
        it('error debe tener código PARAMETRO_REQUERIDO', () => {
            try {
                requireParam(undefined, 'miCampo');
            } catch (e) {
                expect(e.errorCode).toBe('PARAMETRO_REQUERIDO');
                expect(e.statusCode).toBe(400);
            }
        });
    });
    
    describe('validateQueryParams middleware', () => {
        it('debe llamar next() si params requeridos están presentes', () => {
            const middleware = validateQueryParams(['tipo']);
            const req = { query: { tipo: 'parada' } };
            const res = {};
            const next = jest.fn();
            
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
        
        it('debe pasar error a next si falta param requerido', () => {
            const middleware = validateQueryParams(['tipo']);
            const req = { query: {} };
            const res = {};
            const next = jest.fn();
            
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
        
        it('debe funcionar sin argumentos (defaults vacíos)', () => {
            const middleware = validateQueryParams();
            const req = { query: {} };
            const res = {};
            const next = jest.fn();
            
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
        
        it('debe aceptar segundo argumento optionalParams', () => {
            const middleware = validateQueryParams(['tipo'], ['formato']);
            const req = { query: { tipo: 'parada' } };
            const res = {};
            const next = jest.fn();
            
            middleware(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });
    });
    
    describe('validateIdioma - branch idioma falsy', () => {
        it('debe lanzar error si idioma es null', () => {
            expect(() => validateIdioma(null)).toThrow();
        });
        
        it('debe lanzar error si idioma es undefined', () => {
            expect(() => validateIdioma(undefined)).toThrow();
        });
    });
});

describe('Error Handler - test directo', () => {
    let mockReq, mockRes, mockNext;
    
    beforeEach(() => {
        mockReq = { method: 'GET', path: '/test' };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    
    afterEach(() => {
        console.error.mockRestore();
    });
    
    describe('ValidationError', () => {
        it('debe manejar errores con name ValidationError', () => {
            const err = new Error('Campo inválido');
            err.name = 'ValidationError';
            err.errors = [{ field: 'nombre', message: 'requerido' }];
            
            errorHandler(err, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: true,
                    codigo: 'VALIDATION_ERROR',
                    mensaje: 'Error de validación',
                    detalles: err.errors
                })
            );
        });
        
        it('debe usar err.message si no hay err.errors', () => {
            const err = new Error('validación fallida');
            err.name = 'ValidationError';
            
            errorHandler(err, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    detalles: 'validación fallida'
                })
            );
        });
    });
    
    describe('Error genérico (no ApiError, no ValidationError, no SyntaxError)', () => {
        it('debe retornar 500 para error genérico', () => {
            const err = new Error('algo se rompió');
            
            errorHandler(err, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: true,
                    codigo: 'INTERNAL_ERROR'
                })
            );
        });
        
        it('debe usar statusCode del error si existe', () => {
            const err = new Error('servicio no disponible');
            err.statusCode = 503;
            
            errorHandler(err, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(503);
        });
        
        it('debe ocultar mensaje en producción', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            
            const err = new Error('detalle interno sensible');
            
            errorHandler(err, mockReq, mockRes, mockNext);
            
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    mensaje: 'Error interno del servidor'
                })
            );
            // No debe incluir stack en producción
            const jsonArg = mockRes.json.mock.calls[0][0];
            expect(jsonArg).not.toHaveProperty('stack');
            
            process.env.NODE_ENV = originalEnv;
        });
        
        it('debe incluir stack en desarrollo', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            
            const err = new Error('error de desarrollo');
            
            errorHandler(err, mockReq, mockRes, mockNext);
            
            const jsonArg = mockRes.json.mock.calls[0][0];
            expect(jsonArg).toHaveProperty('stack');
            expect(jsonArg.mensaje).toBe('error de desarrollo');
            
            process.env.NODE_ENV = originalEnv;
        });
    });
});
