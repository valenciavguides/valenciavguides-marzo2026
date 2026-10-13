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
 * NH-4 falla si un iframe publica su propia copia de `__vv_config` (solo la ventana de arriba la publica): su logger pasa a leer la
 * copia propia y el cambio del padre no le llega (NH-2 no lo ve: toca la copia que el logger vaya a mirar).
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

/** Los que importan el logger y por tanto deben publicarlo en su propio globalThis */
const HIJOS_CON_LOGGER = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5'];

test.describe('NH — El nivel de log alcanza a los hijos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await cargarHijosDelPadre(page, { casa: true });
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

  test('NH-3. puzzle.html, video-intro.html y mapa-completo.html tambien publican el logger real', async ({ page }) => {
    // Son sub-iframes (de seleccion / hijo4), no hijos directos del padre: se cargan a mano
    // en una ventana suelta para poder medirlos. Sus `(globalThis.logger || console).x`
    // eslint NO los marca —el objeto va envuelto en el `||`— asi que sin este test nada
    // avisaria si volvieran a quedarse sin logger.
    // mapa-completo.html lo abre el padre en un overlay; aqui tambien se carga suelto, sin padre: el logger se
    // publica antes de que la pagina decida si tiene a quien hablar.
    const r = {};
    const imagenPuzzle = encodeURIComponent('imagenes/imagenes-aplicación/logo-luna.png');
    for (const url of [`puzzle.html?id=PZ-intro&imagen=${imagenPuzzle}`, 'video-intro.html', 'mapa-completo.html']) {
      const p2 = await page.context().newPage();
      try {
        await p2.goto('/' + url, { waitUntil: 'load' });
        await p2.waitForFunction(() => typeof globalThis.logger === 'object' && globalThis.logger !== null,
          null, { timeout: 15000 }).catch(() => {});
        r[url.split('?')[0]] = await p2.evaluate(() => {
          const lg = globalThis.logger;
          return (lg && typeof lg.setNivel === 'function') ? 'logger' : (lg ? 'NO es el logger' : 'undefined');
        });
      } finally { await p2.close(); }
    }
    for (const [k, v] of Object.entries(r)) expect(`${k}=${v}`).toBe(`${k}=logger`);
  });

  test('NH-4. El nivel del padre alcanza a selección, hijo1, hijo2, hijo3, hijo4 e hijo5, que no publican `__vv_config` en su ventana', async ({ page }) => {
    // Una sola fuente del nivel: estos seis leen `__vv_config` de la ventana padre porque solo la ventana de arriba la publica. hijo2
    // importa `config.js` para `CONFIG.GPS`, pero ese módulo no publica en un iframe. Con una copia propia el logger mira la suya y un
    // cambio en el padre no le llega.
    const ids = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5'];
    await page.waitForFunction(
      (lista) => lista.every((id) => document.getElementById(id)?.contentWindow?.logger),
      ids, { timeout: 30000 }
    );
    const r = await page.evaluate(async (lista) => {
      const { LOG_LEVELS } = await import('./js/constants.js');
      const cfg = globalThis.__vv_config;
      const original = cfg.DEBUG.NIVEL_LOG;
      const out = {};
      try {
        cfg.DEBUG.NIVEL_LOG = LOG_LEVELS.NONE;
        for (const id of lista) {
          const w = document.getElementById(id).contentWindow;
          const copia = typeof w.__vv_config === 'undefined' ? 'sin copia' : 'COPIA PROPIA';
          const nivel = w.logger.getNivel() === LOG_LEVELS.NONE ? 'obedece' : 'ignora';
          out[id] = `${copia}, ${nivel}`;
        }
      } finally { cfg.DEBUG.NIVEL_LOG = original; }
      return out;
    }, ids);
    expect(Object.keys(r)).toEqual(ids); // el arnes midio los cinco, no los que hubiera cargado
    for (const id of ids) expect(`${id}=${r[id]}`).toBe(`${id}=sin copia, obedece`);
  });
});
