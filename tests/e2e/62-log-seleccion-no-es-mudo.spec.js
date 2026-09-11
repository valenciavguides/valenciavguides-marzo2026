/**
 * 62 — El `_log` de la pantalla de selección escribe de verdad y obedece al nivel
 *
 * POR QUE EXISTE
 *
 * `En-busca-del-tesoro.html` definia su wrapper de log asi:
 *
 *     const _log = { info: Function.prototype, warn: Function.prototype, ... };
 *
 * `Function.prototype` es una funcion que no hace nada. El comentario decia que era para
 * evitar el uso directo de `console` (SonarLint S106) — y lo conseguia, pero tirando los
 * mensajes: las 34 llamadas del fichero no escribian en ningun sitio. Entre ellas, todos
 * los fallos de carga de la pantalla (terminos, audio intro, retos R1/R2, puzzle, texto
 * intro, aventuras) y el error de validacion de acceso de P13.
 *
 * Es el caso mas puro del EJE 27: el instrumento miente. Ninguna auditoria del codigo lo
 * encuentra, porque el codigo esta bien — lo que esta roto es aquello con lo que se mira.
 *
 * LO QUE MIDEN ESTOS TESTS
 *
 * No que `_log` exista ni que tenga los metodos: eso era cierto tambien con la version
 * muda. Miden **salida observable en consola**, que es lo unico que distingue un logger de
 * un agujero negro. Y LS-2 comprueba lo segundo que se gana: que estas llamadas quedan
 * bajo `CONFIG.DEBUG.NIVEL_LOG`, igual que el resto del proyecto (§22.3).
 *
 * ROJO ANTES QUE VERDE: con `Function.prototype`, LS-1 y LS-2 fallan — `vistos` sale vacio.
 */
'use strict';

const { test, expect } = require('@playwright/test');

/**
 * En-busca-del-tesoro.html se redirige a codigo-padre.html si se navega a el como pagina de
 * nivel superior (guardia deliberada), asi que se inserta como <iframe> real — mismo arnes
 * que `45-texto-intro-fallback-idioma` y `61-puzzle-p10-tipos-desde-constants`.
 */
async function cargarComoIframe(page) {
  await page.goto('/audio-hijo3.html');
  await page.evaluate(() => {
    const f = document.createElement('iframe');
    f.id = 'f-seleccion-test';
    f.src = '/En-busca-del-tesoro.html';
    f.style.cssText = 'width:100vw;height:100vh;';
    document.body.appendChild(f);
  });
  let frame = null;
  for (let i = 0; i < 30 && !frame; i++) {
    frame = page.frames().find((fr) => /En-busca-del-tesoro/.test(fr.url()));
    if (!frame) await page.waitForTimeout(300);
  }
  expect(frame, 'el iframe de seleccion debe haber cargado').toBeTruthy();
  // Se espera al logger del bloque module: hasta que no esta, `_log` cae a console y la
  // medicion del nivel (LS-2) no tendria sentido.
  await frame.waitForFunction(
    () => typeof globalThis.logger?.setNivel === 'function', null, { timeout: 15_000 }
  );
  return frame;
}

test.describe('LS — El log de la pantalla de seleccion no es mudo', () => {
  test('LS-1. Las cuatro severidades de _log llegan a consola de verdad', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const vistos = await frame.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const previo = globalThis.logger.getNivel();
      globalThis.logger.setNivel(LOG_LEVELS.DEBUG);      // que nada quede fuera por nivel

      const salida = [];
      const orig = { debug: console.debug, info: console.info, warn: console.warn, error: console.error };
      console.debug = () => salida.push('debug');
      console.info = () => salida.push('info');
      console.warn = () => salida.push('warn');
      console.error = () => salida.push('error');

      _log.debug('x'); _log.info('x'); _log.warn('x'); _log.error('x');

      Object.assign(console, orig);
      globalThis.logger.setNivel(previo);
      return salida;
    });
    // Con Function.prototype esto sale [] — que es exactamente el fallo que cubre.
    expect(vistos).toEqual(['debug', 'info', 'warn', 'error']);
  });

  test('LS-2. _log obedece al nivel: con NONE no sale nada, y al restaurar vuelve', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const r = await frame.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const previo = globalThis.logger.getNivel();

      const capturar = () => {
        const salida = [];
        const orig = { info: console.info, error: console.error };
        console.info = () => salida.push('info');
        console.error = () => salida.push('error');
        _log.info('x'); _log.error('x');
        Object.assign(console, orig);
        return salida;
      };

      globalThis.logger.setNivel(LOG_LEVELS.ERROR);
      const conError = capturar();
      globalThis.logger.setNivel(LOG_LEVELS.NONE);
      const conNone = capturar();
      globalThis.logger.setNivel(LOG_LEVELS.DEBUG);
      const conDebug = capturar();
      globalThis.logger.setNivel(previo);
      return { conError, conNone, conDebug };
    });

    expect(r.conError).toEqual(['error']);        // ERROR silencia info
    expect(r.conNone).toEqual([]);                // NONE lo silencia todo
    expect(r.conDebug).toEqual(['info', 'error']); // y al abrir el nivel, vuelven las dos
  });

  test('LS-3. _log.log existe y va a info — `console` tiene .log y el logger no', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const vistos = await frame.evaluate(async () => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const previo = globalThis.logger.getNivel();
      globalThis.logger.setNivel(LOG_LEVELS.DEBUG);
      const salida = [];
      const orig = { info: console.info, log: console.log };
      console.info = () => salida.push('info');
      console.log = () => salida.push('log');
      _log.log('x');                    // sin el mapeo a .info esto lanzaria TypeError
      Object.assign(console, orig);
      globalThis.logger.setNivel(previo);
      return salida;
    });
    expect(vistos).toEqual(['info']);
  });
});
