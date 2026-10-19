/**
 * 145-cola-de-retos-un-solo-camino.spec.js
 *
 * La cola de retos del elemento la prepara un solo sitio, `_asegurarRetoActualDe` (al activarlo y al avanzar). Si al pedir un
 * reto la cola no es la del elemento, el padre lo dice con un error y la prepara por ese mismo sitio (estudio K-120).
 *
 *   RC-1  Con la cola de otro elemento, pedir un reto lo dice y deja la cola del elemento actual (antes, sin decir nada, se
 *         habría enseñado el reto del otro elemento).
 *   RC-2  Control: con la cola ya preparada, pedir un reto no lo dice.
 *   RC-3  Control: avanzar al elemento siguiente le prepara su cola.
 *
 * ROJO ANTES QUE VERDE: con el padre anterior cae RC-1 (la cola seguía siendo la del otro elemento, y nadie lo decía). RC-2 y
 * RC-3 pasan antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const AVISO = '(K-120)';

async function arrancar(page) {
  const errores = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  return errores;
}

/** Elige dos paradas con reto de la Aventura1 en español, pone la segunda como actual y la cola que se pida; pide un reto. */
function pedirRetoConCola(page, colaDeLaPrimera) {
  return page.evaluate(async (deLaPrimera) => {
    const { DATOS_PADRE } = await import('/js/aventuras-ID-padre.js');
    const elementos = DATOS_PADRE.Aventura1.es.elementosIDpadre;
    // Paradas de verdad, que la búsqueda del handler (la primera con esa parada_id) devuelve tal cual.
    const conReto = elementos.filter((e) => e.tipo === 'parada' && e.reto_id && e.parada_id
      && elementos.find((p) => p.padreid === e.parada_id || p.parada_id === e.parada_id) === e);
    const [a, b] = conReto;
    const retosDe = (e) => (Array.isArray(e.reto_id) ? e.reto_id : [e.reto_id]);
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    const est = globalThis.estadoPadre;
    est.paradaActual = b.parada_id;
    const cola = deLaPrimera ? retosDe(a) : retosDe(b);
    est.retoActual = { id: cola[0], cola: [...cola], colaCompletados: new Set() };
    // Sin esperar al despacho entero: acaba mandando el reto a hijo4, que aquí no está cargado. La cola se decide antes.
    void globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.RETO.SOLICITAR_RETO,
      datos: { contexto: 'manual' },
    }).catch(() => {});
    await new Promise((r) => setTimeout(r, 500));
    return { cola: [...est.retoActual.cola], deLaActual: retosDe(b), deLaOtra: retosDe(a) };
  }, colaDeLaPrimera);
}

test.describe('RC — La cola de retos, por un solo camino', () => {
  test('RC-1. Con la cola de otro elemento, pedir un reto lo dice y deja la del actual', async ({ page }) => {
    const errores = await arrancar(page);
    const r = await pedirRetoConCola(page, true);
    expect(r.deLaOtra, 'las dos paradas tienen retos distintos').not.toEqual(r.deLaActual);
    expect(r.cola, 'la cola es la del elemento actual').toEqual(r.deLaActual);
    await expect.poll(() => errores.some((t) => t.includes(AVISO)), { message: 'y se dice' }).toBe(true);
  });

  test('RC-2. Control: con la cola ya preparada, pedir un reto no lo dice', async ({ page }) => {
    const errores = await arrancar(page);
    const r = await pedirRetoConCola(page, false);
    expect(r.cola).toEqual(r.deLaActual);
    await page.waitForTimeout(300);
    expect(errores.filter((t) => t.includes(AVISO))).toEqual([]);
  });

  test('RC-3. Control: avanzar al elemento siguiente le prepara su cola', async ({ page }) => {
    await arrancar(page);
    const r = await page.evaluate(async () => {
      const { DATOS_PADRE } = await import('/js/aventuras-ID-padre.js');
      const elementos = DATOS_PADRE.Aventura1.es.elementosIDpadre;
      const retosDe = (e) => (!e?.reto_id ? [] : Array.isArray(e.reto_id) ? e.reto_id : [e.reto_id]);
      // Una parada con reto que no sea el último elemento: se avanza desde ella.
      const i = elementos.findIndex((e, k) => e.tipo === 'parada' && e.reto_id && k < elementos.length - 1);
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      const est = globalThis.estadoPadre;
      est.indiceProgreso = i;
      est.elementoActual = elementos[i];
      est.retoActual = { id: retosDe(elementos[i])[0], cola: retosDe(elementos[i]), colaCompletados: new Set() };
      // La cola se prepara en la parte síncrona del avance; se lee justo después, antes del CAMBIO_PARADA que viene detrás.
      const avance = globalThis.progresarSiguienteElemento();
      const r = { cola: [...est.retoActual.cola], esperada: retosDe(elementos[i + 1]), avanzo: est.elementoActual === elementos[i + 1] };
      Promise.resolve(avance).catch(() => {});
      return r;
    });
    expect(r.avanzo, 'avanza al elemento siguiente').toBe(true);
    expect(r.cola).toEqual(r.esperada);
  });
});
