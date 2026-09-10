/**
 * 59 — El nivel de log se puede configurar y el logger se puede silenciar
 *
 * POR QUE EXISTE
 *
 * `LOG_LEVELS` declara cinco niveles, NONE incluido, pero la tabla interna del logger solo
 * tenia cuatro y `setNivel()` valida contra ella: pedir NONE respondia "Nivel de log
 * invalido" y no cambiaba nada. Ademas `CONFIG.DEBUG.NIVEL_LOG` estaba puesto pero
 * `logger.js` no lo leia, asi que `nivelActual` se quedaba en DEBUG para siempre y la app
 * lo logueaba todo, tambien en produccion. Es el punto 3 del checklist de despliegue
 * (§22.3): sin esto, la palanca que ese punto da por hecha no existe.
 *
 * ROJO ANTES QUE VERDE: NL-1 y NL-4 fallan con el codigo anterior.
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

test.describe('NL — Nivel de log configurable', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('NL-1. NONE es un nivel aceptado: setNivel(NONE) lo aplica de verdad', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const logger = (await import('./js/logger.js')).default;
      const previo = logger.getNivel();
      logger.setNivel(LOG_LEVELS.NONE);
      const aplicado = logger.getNivel();
      logger.setNivel(previo);
      return { aplicado, esperado: LOG_LEVELS.NONE };
    });
    expect(r.aplicado).toBe(r.esperado);
  });

  test('NL-2. Un nivel invalido se rechaza y no cambia nada', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const logger = (await import('./js/logger.js')).default;
      const previo = logger.getNivel();
      logger.setNivel('NIVEL_QUE_NO_EXISTE');
      return { antes: previo, despues: logger.getNivel() };
    });
    expect(r.despues).toBe(r.antes);
  });

  test('NL-3. Con nivel ERROR, debug/info/warn no llegan a consola y error si', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const logger = (await import('./js/logger.js')).default;
      const previo = logger.getNivel();
      const vistos = [];
      const orig = { debug: console.debug, info: console.info, warn: console.warn, error: console.error };
      console.debug = () => vistos.push('debug');
      console.info = () => vistos.push('info');
      console.warn = () => vistos.push('warn');
      console.error = () => vistos.push('error');
      logger.setNivel(LOG_LEVELS.ERROR);
      logger.debug('x'); logger.info('x'); logger.warn('x'); logger.error('x');
      Object.assign(console, orig);
      logger.setNivel(previo);
      return vistos;
    });
    expect(r).toEqual(['error']);
  });

  test('NL-4. Con nivel NONE no sale absolutamente nada, ni los errores', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const logger = (await import('./js/logger.js')).default;
      const previo = logger.getNivel();
      const vistos = [];
      const orig = { debug: console.debug, info: console.info, warn: console.warn, error: console.error };
      console.debug = () => vistos.push('debug');
      console.info = () => vistos.push('info');
      console.warn = () => vistos.push('warn');
      console.error = () => vistos.push('error');
      logger.setNivel(LOG_LEVELS.NONE);
      logger.debug('x'); logger.info('x'); logger.warn('x'); logger.error('x');
      Object.assign(console, orig);
      logger.setNivel(previo);
      return vistos;
    });
    expect(r).toEqual([]);
  });

  test('NL-5. Cambiar CONFIG.DEBUG.NIVEL_LOG cambia lo que sale de verdad', async ({ page }) => {
    // No basta con comparar getNivel() contra el valor configurado: hoy los dos valen DEBUG,
    // asi que esa comparacion pasaria igual sin ningun cableado. Se cambia el valor y se
    // comprueba el efecto observable.
    const r = await page.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const logger = (await import('./js/logger.js')).default;
      const original = globalThis.__vv_config?.DEBUG?.NIVEL_LOG;

      const capturar = () => {
        const vistos = [];
        const orig = { debug: console.debug, error: console.error };
        console.debug = () => vistos.push('debug');
        console.error = () => vistos.push('error');
        logger.debug('x'); logger.error('x');
        Object.assign(console, orig);
        return vistos;
      };

      globalThis.__vv_config.DEBUG.NIVEL_LOG = LOG_LEVELS.ERROR;
      const conError = capturar();
      const nivelLeidoConError = logger.getNivel();

      globalThis.__vv_config.DEBUG.NIVEL_LOG = LOG_LEVELS.NONE;
      const conNone = capturar();

      globalThis.__vv_config.DEBUG.NIVEL_LOG = original;
      const restaurado = capturar();

      return { original, conError, nivelLeidoConError, esperadoError: LOG_LEVELS.ERROR, conNone, restaurado };
    });

    expect(r.original).toBeDefined();                  // la ruta existe de verdad
    expect(r.nivelLeidoConError).toBe(r.esperadoError); // el logger lee del config
    expect(r.conError).toEqual(['error']);              // ERROR silencia debug
    expect(r.conNone).toEqual([]);                      // NONE lo silencia todo
    expect(r.restaurado).toEqual(['debug', 'error']);   // y al restaurar, vuelve
  });
});
