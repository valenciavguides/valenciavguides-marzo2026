/**
 * 119-hijo5-marca-la-parada-actual.spec.js
 *
 * hijo5 (herramienta de desarrollo: ver §24 de la guía) pinta como actual el botón de la parada
 * en la que está la aventura. La marca la pone UNA sola función, que llaman los cuatro caminos
 * por los que llega «esta es la parada actual»: el click sobre un botón, la generación de la
 * lista, el `NAVEGACION.CAMBIO_PARADA` del padre y su `NAVEGACION.CAMBIO_PARADA_CONFIRMADO`.
 *
 *   PA-1  click sobre un botón: queda marcado él solo
 *   PA-2  NAVEGACION.CAMBIO_PARADA del padre: queda marcado el botón de esa parada
 *   PA-3  NAVEGACION.CAMBIO_PARADA_CONFIRMADO: la marca no se pierde (con y sin el prefijo `padre-`)
 *   PA-4  un cambio de parada que no empieza en hijo5 sustituye a la marca del click
 *
 * ROJO ANTES QUE VERDE: con el código anterior, PA-2 cae (el handler de `CAMBIO_PARADA` ponía una
 * clase `activa` sin estilo) y PA-3 cae (el de `CAMBIO_PARADA_CONFIRMADO` quitaba `actual` a todos
 * los botones, porque comparaba contra un `data-padreid` que nadie asigna). PA-1 pasa antes y
 * después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, enviarAlHijo } = require('./helpers/boot');

const PARADAS = [
  { padreid: 'padre-Av1-P-1', parada_id: 'Av1-P-1', tipo: 'parada', nombre: 'Primera' },
  { padreid: 'padre-Av1-P-2', parada_id: 'Av1-P-2', tipo: 'parada', nombre: 'Segunda' },
  { padreid: 'padre-Av1-P-3', parada_id: 'Av1-P-3', tipo: 'parada', nombre: 'Tercera' },
];

/** hijo5 con la lista ya pintada: tres botones. */
async function abrirConParadas(page) {
  const hijo = await abrirHijoEnMarco(page, 'boton-casa-hijo5.html');
  await enviarAlHijo(page, {
    tipo: 'NAVEGACION.RESPUESTA_DATOS_PARADAS',
    origen: 'padre',
    destino: 'hijo5',
    datos: { paradas: PARADAS },
  });
  await expect
    .poll(() => hijo.evaluate(() => document.querySelectorAll('.parada-tramo-btn').length), { timeout: 10_000 })
    .toBe(3);
  return hijo;
}

/** Los índices de los botones que llevan la clase `actual`. */
const marcados = (hijo) => hijo.evaluate(() =>
  [...document.querySelectorAll('.parada-tramo-btn')].flatMap((b, i) => (b.classList.contains('actual') ? [i] : [])));

const cambioParada = (page, idPadre) => enviarAlHijo(page, {
  tipo: 'NAVEGACION.CAMBIO_PARADA',
  origen: 'padre',
  destino: 'hijo5',
  datos: { paradaId: idPadre, parada_id: idPadre.replace('padre-', ''), padreId: idPadre, padreid: idPadre, timestamp: Date.now() },
});

const cambioConfirmado = (page, paradaId) => enviarAlHijo(page, {
  tipo: 'NAVEGACION.CAMBIO_PARADA_CONFIRMADO',
  origen: 'padre',
  destino: 'hijo5',
  datos: { paradaId, timestamp: Date.now() },
});

test.describe('PA — hijo5 marca la parada actual', () => {
  test('PA-1. Un click sobre un botón lo deja marcado, y solo a él', async ({ page }) => {
    const hijo = await abrirConParadas(page);
    expect(await marcados(hijo), 'precondición: al empezar no hay ninguno marcado').toEqual([]);
    await hijo.evaluate(() => document.querySelectorAll('.parada-tramo-btn')[2].click());
    await expect.poll(() => marcados(hijo), { timeout: 5_000 }).toEqual([2]);
  });

  test('PA-2. NAVEGACION.CAMBIO_PARADA del padre marca el botón de esa parada', async ({ page }) => {
    const hijo = await abrirConParadas(page);
    await cambioParada(page, 'padre-Av1-P-2');
    await expect.poll(() => marcados(hijo), { timeout: 5_000, message: 'tiene que quedar marcado el botón de la segunda parada' }).toEqual([1]);
  });

  test('PA-3. NAVEGACION.CAMBIO_PARADA_CONFIRMADO no quita la marca', async ({ page }) => {
    const hijo = await abrirConParadas(page);
    // La marca se pone con un click (el camino que no depende de lo que se pruebe aquí).
    await hijo.evaluate(() => document.querySelectorAll('.parada-tramo-btn')[1].click());
    await expect.poll(() => marcados(hijo), { timeout: 5_000 }).toEqual([1]);

    await cambioConfirmado(page, 'Av1-P-2');
    await cambioConfirmado(page, 'padre-Av1-P-2');
    // Los dos mensajes ya se han tratado cuando el bus contesta a uno posterior: se sondea la marca, no se espera a ciegas.
    await expect.poll(() => marcados(hijo), { timeout: 5_000, message: 'la confirmación no puede dejar la lista sin marca' }).toEqual([1]);
  });

  test('PA-4. Un cambio de parada que no empieza en hijo5 sustituye a la marca del click', async ({ page }) => {
    const hijo = await abrirConParadas(page);
    await hijo.evaluate(() => document.querySelectorAll('.parada-tramo-btn')[2].click());
    await expect.poll(() => marcados(hijo), { timeout: 5_000 }).toEqual([2]);
    await cambioParada(page, 'padre-Av1-P-1');
    await expect.poll(() => marcados(hijo), { timeout: 5_000, message: 'solo puede haber una parada marcada' }).toEqual([0]);
  });
});
