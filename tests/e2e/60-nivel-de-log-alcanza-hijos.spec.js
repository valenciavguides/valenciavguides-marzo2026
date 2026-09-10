/**
 * 60 — El nivel de log alcanza también a los iframes hijo
 *
 * POR QUE EXISTE
 *
 * Cada iframe tiene su propio `globalThis`. `codigo-padre.html` publicaba el logger en el
 * suyo, pero ningun hijo lo hacia en el propio, asi que los ~140
 * `(globalThis.logger || console).x` repartidos por los hijos caian SIEMPRE al console
 * crudo y se saltaban el nivel: se podia poner NIVEL_LOG en NONE y los hijos seguian
 * escribiendo en consola. Medido antes del arreglo: globalThis.logger era `object` en el
 * padre y `undefined` en los seis iframes.
 *
 * ROJO ANTES QUE VERDE: NH-1 falla sin la linea `globalThis.logger = logger` de cada hijo.
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

/** Los que importan el logger y por tanto deben publicarlo en su propio globalThis */
const HIJOS_CON_LOGGER = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5'];

test.describe('NH — El nivel de log alcanza a los hijos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(async () => {
      await Promise.all([globalThis.cargarRestoDeiframes?.(), globalThis.cargarHijoCasa?.()]);
    });
    await page.waitForFunction(
      () => (globalThis.estadoPadre?.hijosPreparados?.size || 0) >= 5,
      null, { timeout: 60000 }
    ).catch(() => { /* se comprueba abajo lo que haya cargado */ });
  });

  test('NH-1. Cada hijo publica el logger real en su propio globalThis', async ({ page }) => {
    const r = await page.evaluate((ids) => {
      const out = {};
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el || !el.contentWindow) { out[id] = 'no cargado'; continue; }
        const lg = el.contentWindow.logger;
        // No basta con que exista: `console` tambien es un objeto con .debug/.warn.
        // El logger real trae setNivel/getNivel, que console no tiene.
        out[id] = (lg && typeof lg.setNivel === 'function' && typeof lg.getNivel === 'function')
          ? 'logger'
          : (lg ? 'NO es el logger' : 'undefined');
      }
      return out;
    }, HIJOS_CON_LOGGER);

    const cargados = Object.entries(r).filter(([, v]) => v !== 'no cargado');
    expect(cargados.length).toBeGreaterThan(0);          // el arnes cargo algo de verdad
    for (const [id, v] of cargados) expect(`${id}=${v}`).toBe(`${id}=logger`);
  });

  test('NH-2. El logger del hijo respeta CONFIG.DEBUG.NIVEL_LOG, no un valor propio', async ({ page }) => {
    const r = await page.evaluate(async (ids) => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const out = {};
      for (const id of ids) {
        const el = document.getElementById(id);
        const w = el && el.contentWindow;
        if (!w || !w.logger || typeof w.logger.getNivel !== 'function') continue;
        // El hijo lee de su propia ventana o, si no la tiene, de la del padre. Se toca la
        // que el logger vaya a mirar de verdad.
        const cfg = w.__vv_config || globalThis.__vv_config;
        const original = cfg?.DEBUG?.NIVEL_LOG;
        if (original === undefined) { out[id] = 'sin config'; continue; }
        cfg.DEBUG.NIVEL_LOG = LOG_LEVELS.NONE;
        const conNone = w.logger.getNivel();
        cfg.DEBUG.NIVEL_LOG = original;
        out[id] = (conNone === LOG_LEVELS.NONE) ? 'obedece' : 'ignora (' + conNone + ')';
      }
      return out;
    }, HIJOS_CON_LOGGER);

    const medidos = Object.entries(r);
    expect(medidos.length).toBeGreaterThan(0);
    for (const [id, v] of medidos) expect(`${id}=${v}`).toBe(`${id}=obedece`);
  });
});
