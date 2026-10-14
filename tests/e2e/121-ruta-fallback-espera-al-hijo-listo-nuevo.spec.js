/**
 * 121-ruta-fallback-espera-al-hijo-listo-nuevo.spec.js
 *
 * La ruta fallback de `SELECCION.AVENTURA_ACTIVADA` (la que deja `SELECCION.REINICIAR`: `_iframesPreCargadosP15` falso)
 * recarga a los seis hijos con el cargador único (`cargarHijo`), que borra a cada uno del conjunto del padre y espera «un
 * HIJO_LISTO nuevo» suyo. Esa espera la hace `crearPromiseHijoListo` del state-manager, que resuelve al instante para
 * un id que ya está en SU conjunto. Si el padre vacía el suyo y el state-manager no, la espera no espera.
 *
 *   HL-1  las seis esperas de la ruta resuelven cuando llega el HIJO_LISTO nuevo de su hijo, no antes
 *   HL-2  control: en esa ruta llega de verdad un HIJO_LISTO nuevo de cada uno de los seis (HL-1 no es vacío)
 *   HL-3  state-manager: tras `olvidarHijoListo(id)`, `crearPromiseHijoListo(id)` espera a `marcarHijoListo(id)`
 *   HL-4  state-manager: esa espera no tiene plazo propio (no arma ningún temporizador): el que no llega lo recupera el supervisor
 *
 * ROJO ANTES QUE VERDE: con el código anterior HL-1 cae (las esperas resuelven en el mismo instante en que se
 * piden, cientos de milisegundos antes de que llegue ningún HIJO_LISTO nuevo) y HL-3 cae (no hay `olvidarHijoListo`).
 * HL-2 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const HIJOS = ['hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5', 'hijo6-chat'];

test.use({ permissions: ['geolocation'], geolocation: { latitude: 39.47876, longitude: -0.37626 } });

/** El padre con los hijos ya cargados una vez, listo para activar una aventura por la ruta fallback. */
async function prepararPadreConHijosCargados(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await cargarHijosDelPadre(page, { casa: true });
  await page.waitForFunction(
    (ids) => ids.every((id) => globalThis.estadoPadre?.hijosInicializados?.has(id)),
    HIJOS, { timeout: 60_000 }
  );
}

test.describe('HL — la ruta fallback espera al HIJO_LISTO nuevo', () => {
  test.describe('en la ruta real', () => {
    /**
     * Activa la aventura por la ruta fallback y devuelve, por hijo, cuándo se pidió la espera, cuándo resolvió y cuándo
     * llegaron sus HIJO_LISTO (todo con el reloj del padre).
     */
    async function activarPorRutaFallback(page) {
      await prepararPadreConHijosCargados(page);
      await page.evaluate(() => {
        const sm = globalThis.__stateManager;
        globalThis.__hl = { esperas: [], marcados: [], inicio: performance.now() };
        const crear = sm.crearPromiseHijoListo;
        sm.crearPromiseHijoListo = (id) => {
          const p = crear(id);
          const e = { id, pedida: performance.now(), resuelta: null };
          globalThis.__hl.esperas.push(e);
          p.then(() => { e.resuelta = performance.now(); }, () => { e.resuelta = 'rechazada'; });
          return p;
        };
        const marcar = sm.marcarHijoListo;
        sm.marcarHijoListo = (id) => { globalThis.__hl.marcados.push({ id, t: performance.now() }); return marcar(id); };
        // Lo que deja SELECCION.REINICIAR: la ruta fallback en la próxima activación
        globalThis._iframesPreCargadosP15 = false;
        globalThis._codigoValidadoP14 = false;
        document.getElementById('seleccion').contentWindow.parent.postMessage(
          { tipo: 'SELECCION.AVENTURA_ACTIVADA', origen: 'seleccion', datos: { aventura: 'Aventura1', idioma: 'es', terminosAceptados: true, timestamp: Date.now() } },
          globalThis.location.origin
        );
      });
      // Los seis HIJO_LISTO nuevos y las seis esperas resueltas
      await page.waitForFunction(
        (ids) => ids.every((id) => globalThis.__hl.marcados.some((m) => m.id === id) && globalThis.__hl.esperas.some((e) => e.id === id && e.resuelta !== null)),
        HIJOS, { timeout: 30_000 }
      );
      return page.evaluate(() => globalThis.__hl);
    }

    test('HL-1. Las seis esperas de la ruta resuelven cuando llega el HIJO_LISTO nuevo de su hijo, no antes', async ({ page }) => {
      const hl = await activarPorRutaFallback(page);
      for (const id of HIJOS) {
        const espera = hl.esperas.find((e) => e.id === id); // la primera que se pide en la ruta
        const nuevo = hl.marcados.find((m) => m.id === id); // el primer HIJO_LISTO tras recargar
        expect(espera, `se pidió la espera de ${id}`).toBeTruthy();
        expect(typeof espera.resuelta, `la espera de ${id} resolvió`).toBe('number');
        expect(
          espera.resuelta >= nuevo.t,
          `${id}: la espera resolvió a los ${Math.round(espera.resuelta - hl.inicio)} ms y su HIJO_LISTO nuevo llegó a los ${Math.round(nuevo.t - hl.inicio)} ms`
        ).toBe(true);
      }
    });

    test('HL-2. Control: en la ruta llega un HIJO_LISTO nuevo de cada uno de los seis hijos', async ({ page }) => {
      const hl = await activarPorRutaFallback(page);
      for (const id of HIJOS) {
        expect(hl.marcados.filter((m) => m.id === id).length, `HIJO_LISTO nuevo de ${id}`).toBeGreaterThanOrEqual(1);
      }
    });
  });

  test('HL-3. Tras olvidarHijoListo(id), crearPromiseHijoListo(id) espera a marcarHijoListo(id)', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    const r = await page.evaluate(async () => {
      const sm = globalThis.__stateManager;
      const PENDIENTE = Symbol('pendiente');
      const estado = (p) => Promise.race([p.then(() => 'resuelta', () => 'rechazada'), new Promise((res) => setTimeout(() => res(PENDIENTE), 100))]); // VENTANA-OBSERVACION: lo que tarda una promesa ya resuelta en dejarse ver
      const out = { tieneOlvidar: typeof sm.olvidarHijoListo };
      sm.marcarHijoListo('hijo-hl3');
      out.trasMarcar = String(await estado(sm.crearPromiseHijoListo('hijo-hl3')));
      if (typeof sm.olvidarHijoListo === 'function') {
        sm.olvidarHijoListo('hijo-hl3');
        const espera = sm.crearPromiseHijoListo('hijo-hl3');
        out.trasOlvidar = (await estado(espera)) === PENDIENTE ? 'pendiente' : 'resuelta';
        sm.marcarHijoListo('hijo-hl3');
        out.trasMarcarDeNuevo = String(await estado(espera));
        try { sm.olvidarHijoListo('hijo-que-nunca-existio'); out.idDesconocido = 'sin error'; } catch (e) { out.idDesconocido = 'lanza: ' + e.message; }
      }
      return out;
    });
    expect(r.tieneOlvidar, 'el state-manager expone olvidarHijoListo').toBe('function');
    expect(r.trasMarcar, 'un id marcado resuelve al instante').toBe('resuelta');
    expect(r.trasOlvidar, 'un id olvidado vuelve a esperar').toBe('pendiente');
    expect(r.trasMarcarDeNuevo, 'y se resuelve al llegar su HIJO_LISTO').toBe('resuelta');
    expect(r.idDesconocido, 'olvidar un id que no estaba no es un error').toBe('sin error');
  });

  test('HL-4. La espera de HIJO_LISTO no tiene plazo propio: crearla no arma ningún temporizador', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    const pedidos = await page.evaluate(() => {
      const sm = globalThis.__stateManager;
      const plazos = [];
      const original = globalThis.setTimeout;
      globalThis.setTimeout = function (fn, ms, ...resto) { plazos.push(Number(ms) || 0); return original.call(this, fn, ms, ...resto); };
      try { sm.crearPromiseHijoListo('hijo-hl4'); } finally { globalThis.setTimeout = original; }
      return plazos;
    });
    // Quien espera a un hijo lo espera hasta que esté listo: si no llega, lo recupera el supervisor del bus, y un plazo aquí
    // dejaría a quien espera sin su hijo mientras el supervisor aún lo está recuperando.
    expect(pedidos, 'una espera sin plazo no arma ningún temporizador').toEqual([]);
  });
});
