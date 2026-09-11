/**
 * 63 — "¿esto es un tramo?" se decide en un solo sitio, y acierta
 *
 * POR QUE EXISTE
 *
 * `coordenadas-hijo2.html` decidia si un id era de tramo en OCHO puntos, con TRES tests
 * distintos: `startsWith('TR-')` (cinco veces), `startsWith('TR')` (una) e
 * `includes('-TR-')` (dos). Solo el tercero acierta: los ids reales llevan la aventura
 * delante — `Av1-TR-1`, `Av34km-TR-12` —, asi que ninguno empieza por TR. Medido sobre
 * `js/coordenadas-aventuras.js`: 0 de 846 ids empiezan por TR, 240 contienen `-TR-`.
 *
 * Un test que nunca acierta no da error: devuelve `false`, el `||` que lo rodea sigue con
 * el otro operando, y la red de seguridad parece puesta sin estarlo.
 *
 * TR-3 cubre el unico de los cinco que era un fallo ALCANZABLE, no solo peso muerto: en el
 * handler de coordenadas, `tipoDetectado` sale de `coordenadasFiltradas[0]?.tipo` y cae al
 * test por id cuando el filtro no encuentra nada. Con el test roto, un tramo se marcaba
 * como 'parada' — y el boton de video solo se habilita para tramos.
 *
 * ROJO ANTES QUE VERDE: TR-1 y TR-3 fallan con `startsWith('TR-')`; TR-2 falla ademas con
 * `startsWith('TR')`.
 */
'use strict';

const { test, expect } = require('@playwright/test');

/**
 * `esIdDeTramo` vive en `js/utils.js` y se importa como modulo. No se mide a traves del
 * globalThis de hijo2 a proposito: su bloque es <script type="module">, asi que nada de lo
 * que declara es global — comprobarlo por ahi obligaria a exponerlo solo para el test, que
 * es justo la clase de segundo camino que este proyecto evita.
 */
async function cargarPagina(page) {
  await page.goto('/coordenadas-hijo2.html');
  await page.waitForFunction(() => document.readyState === 'complete', null, { timeout: 15_000 });
  return page;
}

test.describe('TR — esIdDeTramo() es la unica autoridad sobre "esto es un tramo"', () => {
  test('TR-1. Reconoce los ids de tramo reales y rechaza los que no lo son', async ({ page }) => {
    await cargarPagina(page);
    const r = await page.evaluate(async () => {
      const { esIdDeTramo } = await import('./js/utils.js');
      return {
        // Formas reales, tal como salen de js/coordenadas-aventuras.js
        av1:    esIdDeTramo('Av1-TR-1'),
        av34:   esIdDeTramo('Av34km-TR-12'),
        fallas: esIdDeTramo('AvFallas-TR-3'),
        // Paradas y referencias: NO son tramos
        parada: esIdDeTramo('Av1-P-1'),
        ref:    esIdDeTramo('REF-7'),
        inicio: esIdDeTramo('Av1-P-0'),
        // Entradas que no son cadenas: no deben lanzar
        nulo:   esIdDeTramo(null),
        indef:  esIdDeTramo(undefined),
        numero: esIdDeTramo(42),
        vacio:  esIdDeTramo(''),
      };
    });
    expect(r).toEqual({
      av1: true, av34: true, fallas: true,
      parada: false, ref: false, inicio: false,
      nulo: false, indef: false, numero: false, vacio: false,
    });
  });

  test('TR-2. Ningun id real del proyecto empieza por TR — es lo que rompia los cinco tests', async ({ page }) => {
    await cargarPagina(page);
    const r = await page.evaluate(async () => {
      const { esIdDeTramo } = await import('./js/utils.js');
      const mod = await import('./js/coordenadas-aventuras.js');
      const raiz = mod.COORDENADAS_AVENTURAS || mod.default || mod;
      const ids = [];
      (function recorrer(o) {
        if (!o || typeof o !== 'object') return;
        if (Array.isArray(o)) { o.forEach(recorrer); return; }
        if (typeof o.id === 'string' && typeof o.tipo === 'string') ids.push({ id: o.id, tipo: o.tipo });
        for (const v of Object.values(o)) recorrer(v);
      })(raiz);
      return {
        total: ids.length,
        empiezanPorTR: ids.filter((x) => x.id.startsWith('TR')).length,
        tramos: ids.filter((x) => x.tipo === 'tramo').length,
        // La comprobacion que importa: para CADA entrada, el helper coincide con su .tipo
        desacuerdos: ids.filter((x) => esIdDeTramo(x.id) !== (x.tipo === 'tramo'))
          .slice(0, 10).map((x) => `${x.id}=${x.tipo}`),
      };
    });

    expect(r.total, 'el modulo de coordenadas debe haber cargado de verdad').toBeGreaterThan(500);
    expect(r.tramos, 'debe haber tramos que comprobar').toBeGreaterThan(100);
    // Si alguno empezara por TR, `startsWith('TR-')` no seria codigo muerto y este
    // razonamiento entero se caeria. Se mide, no se supone.
    expect(r.empiezanPorTR, 'ningun id empieza por TR: por eso startsWith no acertaba nunca').toBe(0);
    expect(r.desacuerdos, 'el helper debe coincidir con el campo .tipo en TODAS las entradas').toEqual([]);
  });

  test('TR-3. Un tramo cuyo filtro no encuentra entrada se sigue clasificando como tramo', async ({ page }) => {
    await cargarPagina(page);
    // Es el camino de `tipoDetectado` en el handler de coordenadas: cuando
    // `coordenadasFiltradas` sale vacio, `[0]?.tipo` es undefined y decide el id.
    const r = await page.evaluate(async () => {
      const { esIdDeTramo } = await import('./js/utils.js');
      const sinEntrada = [];
      const decidir = (paradaId, filtradas) => filtradas[0]?.tipo
        || (esIdDeTramo(paradaId) ? 'tramo' : 'parada');
      sinEntrada.push(decidir('Av1-TR-1', []));       // filtro vacio, id de tramo
      sinEntrada.push(decidir('Av1-P-1', []));        // filtro vacio, id de parada
      sinEntrada.push(decidir('Av1-TR-1', [{ tipo: 'tramo' }]));   // con entrada, manda .tipo
      return sinEntrada;
    });
    expect(r).toEqual(['tramo', 'parada', 'tramo']);
  });
});
