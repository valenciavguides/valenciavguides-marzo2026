/**
 * Setup file for Jest tests
 */

// Silenciar logs durante tests
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    jest.restoreAllMocks();
    // Cerrar servidor Express para que Jest no tenga que matar el worker forzosamente
    try {
        const { stopServer } = require('../server');
        if (typeof stopServer === 'function') stopServer();
    } catch (e) { /* ignorar si el módulo no existe o el servidor ya está cerrado */ }
});
