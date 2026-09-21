'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * S2 — cuando script2Listo pasa a true, los controladores de Script 1 y Script 2 ESTÁN registrados.
 *
 *   S2-1  en el instante del marcado ya están todos los del arranque del padre, y ninguno falta
 *   S2-2  SISTEMA.ERROR, en concreto, ya tiene handler
 *   S2-3  se marca una sola vez
 *   S2-4  el marcado espera a Script 1 aunque su último import tarde
 *
 * El nombre `script2Listo` se queda corto: la señal espera también a Script 1, cuyos últimos
 * controladores (DATOS.SOLICITAR_*) se registran detrás de un `await import`. MEDIDO sin esa
 * espera: en firefox faltaban esos tres al marcar en 3 de cada 4 arranques.
 *
 * POR QUÉ EXISTE
 *
 * `script2Listo` es la señal a la que espera el arnés de estos tests para empezar a actuar
 * (`gotoAndWaitForFase1`). Se marcaba en codigo-padre.html justo después del bloque que
 * registra los controladores de Script 2 — pero ese bloque es una función asíncrona que se
 * suspende en su primer `await`, así que el marcado corría ANTES de lanzar un solo registro.
 * Y aunque se hubieran lanzado, cada registro escribe en el mapa dentro de un mutex del
 * state-manager: lanzado no es registrado.
 *
 * MEDIDO: en el instante del marcado había 22 de 65 controladores y SISTEMA.ERROR no estaba.
 * Los tests pasaban casi siempre porque sus propias idas y vueltas daban tiempo a que la cola
 * se vaciara; en iphone12, al final de una tanda de 50 minutos, no siempre — y un mensaje que
 * llegaba confiando en la señal no encontraba su handler. Esa era la causa de fallos
 * intermitentes en specs sin relación entre sí (el 28, el 74).
 *
 * CÓMO MIRA: se espía `setScript2Listo` en el objeto API del state-manager EN CUANTO SE
 * PUBLICA, con un trap en la propiedad global, así que se lee el mapa de controladores en el
 * mismo instante en que la señal se pone a true. Nada se mira "un poco después".
 *
 * ROJO ANTES QUE VERDE: medido con el código anterior, S2-1 y S2-2 caen (22 de 65,
 * SISTEMA.ERROR ausente).
 */

async function arrancarEspiandoElMarcado(page, { retrasarControladoresDatosMs = 0 } = {}) {
  if (retrasarControladoresDatosMs) {
    await page.route('**/js/controladores-padre.js', async (route) => {
      await new Promise((r) => setTimeout(r, retrasarControladoresDatosMs));
      await route.continue();
    });
  }
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await page.addInitScript(() => {
    let api;
    globalThis.__marcados = [];
    Object.defineProperty(globalThis, '__vv_stateManager', {
      configurable: true,
      get() { return api; },
      set(v) {
        api = v;
        const original = v && v.setScript2Listo;
        if (typeof original !== 'function' || original.__espiado) return;
        const espia = function (valor) {
          if (valor === true) {
            const mapa = v.getManejadores ? v.getManejadores() : null;
            globalThis.__marcados.push({ tipos: mapa instanceof Map ? [...mapa.keys()] : null });
          }
          return original.apply(this, arguments);
        };
        espia.__espiado = true;
        v.setScript2Listo = espia;
      },
    });
  });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await page.goto('/codigo-padre.html');
  await page.waitForFunction(() => globalThis.__marcados.length > 0, null, { timeout: 60_000 });
}

/**
 * Cuántos controladores tiene el padre cuando termina de arrancar. Se espera a que el número
 * se ESTABILICE en vez de fijar una cifra: un número escrito aquí caducaría con el primer
 * controlador que se añada, y el test fallaría por una razón que no es la que vigila.
 */
async function controladoresFinales(page) {
  let anterior = -1;
  await expect.poll(async () => {
    const actual = await page.evaluate(() => globalThis.__vv_stateManager.getManejadores().size);
    const estable = actual === anterior;
    anterior = actual;
    return estable;
  }, { timeout: 15_000, intervals: [500] }).toBe(true);
  return page.evaluate(() => [...globalThis.__vv_stateManager.getManejadores().keys()]);
}

test.describe('S2 — script2Listo dice la verdad', () => {
  /**
   * Los TRES que registra Script 4, y que por tanto llegan después del marcado.
   *
   * `script2Listo` promete que están los controladores de Script 1 y Script 2. Los de Script 4
   * son otro bloque y corren después. Este caso comparaba contra el total final
   * —Script 2 + Script 4— y pasaba solo cuando Script 4 se adelantaba, que era lo habitual
   * hasta que Script 2 dejó de tener colas de espera y empezó a terminar antes. Estaba
   * pasando por suerte de reloj.
   *
   * Van nombrados uno a uno a propósito, no filtrados por prefijo: si mañana un CUARTO
   * controlador llega tarde, este caso lo caza. Y desaparecen de aquí solos cuando se haga el
   * paso 19 del plan, que retira los auto-mensajes de heartbeat del padre y con ellos estos
   * tres handlers.
   */
  const DE_SCRIPT_4 = ['SISTEMA.HEARTBEAT_START', 'SISTEMA.HEARTBEAT_PAUSE', 'SISTEMA.HEARTBEAT_ESTADO'];

  test('S2-1. Al marcarse, no falta ningún controlador de Script 1 ni de Script 2', async ({ page }) => {
    await arrancarEspiandoElMarcado(page);
    const alMarcar = await page.evaluate(() => globalThis.__marcados[0].tipos);
    const finales = await controladoresFinales(page);

    expect(alMarcar, 'el espía tiene que haber leído el mapa en el instante del marcado').not.toBeNull();

    // Control: los tres de Script 4 tienen que existir al final. Sin esto, la exclusión de
    // abajo taparía que alguien los hubiera borrado.
    for (const tipo of DE_SCRIPT_4) {
      expect(finales, `${tipo} tiene que seguir registrándose en Script 4`).toContain(tipo);
    }

    const deScript1y2 = finales.filter((t) => !DE_SCRIPT_4.includes(t));
    const faltaban = deScript1y2.filter((t) => !alMarcar.includes(t));
    expect(faltaban, `al marcar script2Listo faltaban ${faltaban.length} de ${deScript1y2.length} controladores de Script 1 y Script 2`).toEqual([]);
  });

  test('S2-2. Al marcarse, SISTEMA.ERROR ya tiene handler', async ({ page }) => {
    await arrancarEspiandoElMarcado(page);
    const alMarcar = await page.evaluate(() => globalThis.__marcados[0].tipos);
    expect(alMarcar).toContain('SISTEMA.ERROR');
  });

  test('S2-3. Se marca una sola vez', async ({ page }) => {
    await arrancarEspiandoElMarcado(page);
    await controladoresFinales(page);
    expect(await page.evaluate(() => globalThis.__marcados.length)).toBe(1);
  });
});

/**
 * S2-4 — el marcado espera a Script 1 aunque su último import tarde.
 *
 * Script 1 registra los tres DATOS.SOLICITAR_* detrás de `await import('./js/controladores-padre.js')`.
 * S2-1 solo lo caza cuando ese import pierde la carrera por sí solo (en firefox, 3 de cada 4
 * arranques; en chromium casi nunca). Aquí se fuerza: el fichero llega 2 s tarde, y el marcado
 * tiene que esperarlo igual.
 *
 * Sin service worker a propósito: `page.route` no ve lo que sirve un service worker, y en
 * firefox el retraso no llegaba a aplicarse (medido).
 *
 * ROJO ANTES QUE VERDE: medido sin la espera a `__vv_registroScript1`, los tres faltan al
 * marcar en 4 de 4 arranques, en chromium y en firefox.
 */
test.describe('S2-4 — el marcado espera a Script 1 aunque su último import tarde', () => {
  test.use({ serviceWorkers: 'block' });

  test('S2-4. Con controladores-padre.js retrasado 2 s, al marcarse ya están los DATOS.SOLICITAR_*', async ({ page }) => {
    await arrancarEspiandoElMarcado(page, { retrasarControladoresDatosMs: 2000 });
    const alMarcar = await page.evaluate(() => globalThis.__marcados[0].tipos);
    expect(alMarcar).toEqual(expect.arrayContaining([
      'DATOS.SOLICITAR_AUDIOS',
      'DATOS.SOLICITAR_TEXTOS',
      'DATOS.SOLICITAR_RETOS',
    ]));
  });
});
