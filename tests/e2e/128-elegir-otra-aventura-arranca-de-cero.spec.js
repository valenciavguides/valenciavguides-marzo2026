/**
 * 128 — «Elegir otra aventura» con una aventura en curso deja la app como recién abierta
 *
 * POR QUE EXISTE
 *
 * Con una aventura en curso, pulsar atrás (o volver de un enlace externo) enseña el diálogo de vuelta, y su
 * botón «Elegir otra aventura» abandona la aventura. Una aventura en curso deja estado en tres sitios: el
 * padre (parada, modo, tiempo restante, brújula), los hijos y la pantalla de selección, que al arrancar la
 * aventura sube su marca de «arrancando» y enseña su pantalla de carga, y solo las baja si el arranque falla.
 *
 * Si ese botón reinicia pieza a pieza y no recarga, la selección vuelve tapada por su pantalla de carga —la
 * P1 queda debajo— y, aunque se llegara al final, el botón de empezar no hace nada: la segunda aventura no
 * puede arrancar. Y el padre conserva la parada de la aventura abandonada.
 *
 * Por eso el botón borra la aventura guardada y recarga la página, igual que «otra aventura» en el modal de
 * fin y en el de tiempo agotado: todo nace como en un arranque normal.
 *
 *   EO-1  Recorrido real: arranca una aventura, se elige otra desde el diálogo de vuelta y la segunda arranca,
 *         con su propia primera parada. Por el camino se comprueba que la primera arrancó (control: los mismos
 *         pasos sirven para arrancar), que la página se recarga, y que tras la recarga no queda aventura
 *         guardada, el padre no tiene modo ni parada y la selección está en la P1 sin su pantalla de carga.
 *
 * ROJO ANTES QUE VERDE: sin la recarga, la selección vuelve con la pantalla de carga encima y el botón de
 * empezar de la segunda aventura no deja ningún rastro.
 *
 * El arranque del padre comprueba si hay una aventura guardada 300 ms después de darse por inicializado. Este
 * spec espera a que ese paso haya pasado antes de arrancar nada: un test que arrancara una aventura dentro de
 * ese margen recibiría la oferta de «reanudarla», cosa que a una persona no le puede pasar.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

/** El arranque entero: sistema inicializado, pantalla de carga del padre retirada y el bus de la selección montado. */
async function arranqueTerminado(page) {
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  // Al retirar su pantalla de carga, el padre ya ha mirado si había una aventura guardada (mismo paso del arranque).
  await page.waitForFunction(() => !document.body.classList.contains('loading'), null, { timeout: 30_000 });
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 30_000 },
  );
}

const estadoDeLaSeleccion = (page) => seleccion(page).evaluate(() => {
  const carga = document.getElementById('overlay-carga-aventura');
  return {
    pantalla: [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id),
    arrancando: aventuraIniciando,
    pantallaDeCargaALaVista: getComputedStyle(carga).display !== 'none',
  };
});

const estadoDelPadre = (page) => page.evaluate(() => ({
  modo: globalThis.estadoPadre?.modo?.actual ?? null,
  aventura: globalThis.aventuraSeleccionada ?? null,
  parada: globalThis.estadoPadre?.paradaActual ?? null,
  aventuraGuardada: localStorage.getItem('vv_aventura_iniciada'),
}));

/** El recorrido real desde elegir hasta la aventura en marcha: elegir, normativa (el padre carga los hijos), logos y su botón. */
async function arrancarAventura(page, aventura) {
  const f = seleccion(page);
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  await f.evaluate(() => mostrar(7));
  await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
  await f.evaluate((a) => globalThis.seleccionarAventura(a), aventura);
  await f.evaluate(() => { if (getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none') cerrarMapaVintage(); });
  await f.evaluate(() => mostrar(15));
  await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 90_000 });
  await f.evaluate(() => mostrar(17));
  await f.evaluate(() => document.querySelector('#pantalla17 .btn-mundo-verde').click());
  // En marcha: modo aventura, la selección oculta, hijo2 a la vista, la pantalla de carga del padre retirada y una parada fijada.
  await page.waitForFunction(
    (a) => globalThis.estadoPadre?.modo?.actual === 'aventura' && globalThis.aventuraSeleccionada === a
      && getComputedStyle(document.getElementById('seleccion')).display === 'none'
      && getComputedStyle(document.getElementById('hijo2')).display !== 'none'
      && !document.body.classList.contains('loading') && !!globalThis.estadoPadre?.paradaActual,
    aventura, { timeout: 60_000 },
  );
}

test.describe('EO — «Elegir otra aventura» arranca de cero', () => {
  test.beforeEach(async ({ page, context }) => {
    // La normativa enciende el GPS: el permiso y la posición se dan ANTES de abrir la página.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await arranqueTerminado(page);
  });

  test('EO-1. Tras «Elegir otra aventura» la segunda aventura arranca, con su propia primera parada', async ({ page }) => {
    test.setTimeout(180_000);

    // Control: la primera arranca con estos mismos pasos.
    await arrancarAventura(page, 'Aventura1');
    const primera = await estadoDelPadre(page);
    expect(primera.aventuraGuardada, 'la primera aventura queda guardada como iniciada').toContain('Aventura1');
    expect((await estadoDeLaSeleccion(page)).arrancando, 'y la selección la ha dado por arrancada').toBe(true);

    // El diálogo de vuelta, como al pulsar atrás con la aventura en curso, y su «Elegir otra aventura».
    await page.evaluate(() => { globalThis.__dialogoDeVuelta = globalThis._mostrarDialogoVueltaRapida('es'); });
    await page.waitForSelector('#btn-vuelta-elegir-otra', { state: 'attached', timeout: 10_000 });
    const recarga = page.waitForEvent('load', { timeout: 30_000 });
    // El clic recarga la página: la llamada puede quedarse sin contexto, y eso es justo lo esperado.
    await page.evaluate(() => document.getElementById('btn-vuelta-elegir-otra').click()).catch(() => {});
    await recarga;
    await arranqueTerminado(page);

    expect(await estadoDelPadre(page), 'tras la recarga no queda nada de la aventura abandonada')
      .toEqual({ modo: null, aventura: null, parada: null, aventuraGuardada: null });
    expect(await estadoDeLaSeleccion(page), 'y la selección está en la P1, sin su pantalla de carga')
      .toEqual({ pantalla: ['pantalla1'], arrancando: false, pantallaDeCargaALaVista: false });
    expect(await page.evaluate(() => !!document.getElementById('btn-continuar-aventura')), 'sin oferta de reanudar').toBe(false);

    await arrancarAventura(page, 'Aventura2');
    const segunda = await estadoDelPadre(page);
    expect(segunda.aventura).toBe('Aventura2');
    expect(segunda.parada, 'la parada es de la segunda aventura, no la que dejó la primera').not.toBe(primera.parada);
    const esDeLaSegunda = await page.evaluate((p) => {
      const elementos = globalThis.DATOS_PADRE?.Aventura2?.es?.elementosIDpadre || [];
      return elementos.some((e) => e.parada_id === p);
    }, segunda.parada);
    expect(esDeLaSegunda, `la parada «${segunda.parada}» está entre los elementos de la segunda aventura`).toBe(true);
  });
});
