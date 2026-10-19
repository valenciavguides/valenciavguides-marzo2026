/**
 * 127 — La aventura se confirma otra vez después del pago (P13), y desde ahí solo se cambia a otra del mismo precio
 *
 * POR QUE EXISTE
 *
 * Entre la pantalla de pago (P12) y la del código (P14) hay una segunda confirmación de la aventura (P13): la
 * misma tarjeta y los mismos dos botones que la primera (P9). Con ➣ se pasa al código; con ✗ se vuelve a
 * elegir aventura (P7). Son dos situaciones distintas —antes y después de pagar— y cada una tiene su pantalla:
 * ninguna de las dos hace dos cosas según el caso.
 *
 * Quien vuelve a elegir desde la P13 ya ha hecho la pantalla de pago, así que no repite nada: al elegir va
 * derecho a la P13, con la tarjeta de la aventura nueva. Pero solo puede cambiar a una aventura de la categoría
 * de precio que pagó (corta o larga): las de la otra salen apagadas. Quien todavía no ha pasado por el pago
 * sigue el recorrido de siempre (mapa de la aventura, reto 1, primera confirmación...).
 *
 * La tarjeta de las dos confirmaciones se pinta al mostrarse la pantalla, con la aventura que el recorrido
 * tiene elegida en ese momento: no puede enseñar una y que el código se pida para otra.
 *
 *   CP-1   Las pantallas son dieciocho y cada una está en su número: la P13 es la confirmación, la P14 el
 *          código, la P15 la normativa, la P16 el reto 2, la P17 los logos y la P18 los agradecimientos.
 *   CP-2   La tarjeta enseña la aventura elegida, se pinta al mostrarse la pantalla y es la misma en la P9 y
 *          en la P13; también si la aventura se cambia sin pasar por el botón.
 *   CP-3   Del pago a la confirmación y de la confirmación al código: P12 ➣ → P13 ➣ → P14.
 *   CP-4   Control: sin haber pasado por el pago se pueden elegir las siete aventuras, y elegir enseña el mapa
 *          de la aventura, no la P13. Sin esto, CP-5 podría estar verde aunque el atajo se aplicara siempre.
 *   CP-5   Con el pago hecho de una aventura corta, la ✗ de la P13 vuelve a elegir: las cortas siguen encendidas
 *          y la larga sale apagada; elegir otra corta va derecho a la P13, sin mapa, y el padre la recibe.
 *   CP-6   Con el pago hecho de la larga, las cortas salen apagadas y solo se puede volver a elegir la larga.
 *   CP-7   La P13 no se enseña sin el pago hecho: pedirla enseña la pantalla de pago y lo dice en la consola.
 *   CP-8   Empezar de cero (el «no» del reto 2 vuelve a la P1) deja de dar el pago por hecho.
 *   CP-9   En local, el código se rechaza: sale el aviso y la P14 sigue en pantalla (§16.2 de la guía).
 *   CP-10  En modo DEV la P13 no se ve: la P12, la P13 y la P14 llevan a la normativa (ver §24 de la guía).
 *   CP-11  Al mostrarse la normativa (P15) el padre carga los hijos: el aviso de la selección llega a su handler.
 *
 * ROJO ANTES QUE VERDE: sin la P13 fallan CP-1, CP-3 y de CP-5 a CP-7; si la tarjeta se pintara al elegir y no
 * al mostrarse, falla CP-2; si el atajo no mirara el pago o la categoría, fallan CP-4 y CP-6; y si el nombre del
 * aviso de la normativa no fuera el mismo en la selección, en `js/constants.js` y en el padre, CP-11 no termina.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

/** Las pantallas que la selección tiene a la vista (tiene que ser una). */
const aLaVista = (f) => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id));

/** Pulsa el botón verde (➣) o el rojo (✗) de una pantalla, como lo pulsa el usuario: por su `onclick`. */
const pulsar = (f, pantalla, color) => f.evaluate(([p, c]) => {
  document.querySelector(`#pantalla${p} .btn-mundo-${c}`).click();
}, [pantalla, color]);

/** Lo que enseñan las dos tarjetas de confirmación. */
const tarjetas = (f) => f.evaluate(() => ({
  p9: document.querySelector('#pantalla9 .aventura-confirmacion-card')?.textContent ?? null,
  p13: document.querySelector('#pantalla13 .aventura-confirmacion-card')?.textContent ?? null,
}));

/**
 * Los botones de P7, cada uno con su aventura: van en el orden del índice. Solo se dan por pintados cuando
 * ha terminado la carga del índice que dispara la llegada a P7 (su último log).
 */
const botones = (f) => f.evaluate(() => {
  const aventuras = Object.values(INDICE_AVENTURAS_DATOS || {});
  const pintados = [...document.querySelectorAll('#aventuras-dinamicas button')];
  if (!aventuras.length || pintados.length !== aventuras.length) return null;
  return aventuras.map((a, i) => ({
    id: a.id, categoria: a.categoria, titulo: pintados[i].querySelector('.aventura-titulo').textContent, apagado: pintados[i].disabled,
  }));
});

/** Abre la P7 y espera a que termine de pintar sus botones. */
async function abrirEleccion(page, f) {
  const cargadas = page.waitForEvent('console', { predicate: (m) => m.text().includes('Aventuras cargadas dinámicamente'), timeout: 20_000 });
  await f.evaluate(() => mostrar(7));
  await cargadas;
  const lista = await botones(f);
  expect(lista, 'P7 pinta un botón por aventura del índice').not.toBeNull();
  return lista;
}

/** Elige en la P7 una aventura pulsando su botón. */
const elegir = (f, aventuraId) => f.evaluate((id) => {
  const i = Object.values(INDICE_AVENTURAS_DATOS).findIndex((a) => a.id === id);
  document.querySelectorAll('#aventuras-dinamicas button')[i].click();
}, aventuraId);

const mapaALaVista = (f) => f.evaluate(() => getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none');

/** Recorre lo justo para dejar el pago hecho con esa aventura: elegirla, llegar a la P12 y pulsar su ➣. */
async function hastaLaConfirmacionTrasElPago(page, f, aventuraId) {
  const lista = await abrirEleccion(page, f);
  await elegir(f, aventuraId);
  // Elegir termina cuando el padre ha contestado: entonces se enseña el mapa de la aventura, o el reto 1 si no tiene mapa.
  await expect.poll(async () => (await mapaALaVista(f)) || (await aLaVista(f)).join() === 'pantalla8', { timeout: 10_000 }).toBe(true);
  // El mapa se cierra con su botón, como lo cierra el usuario (lleva al reto 1).
  if (await mapaALaVista(f)) await f.evaluate(() => cerrarMapaVintage());
  await f.evaluate(() => mostrar(12));
  await expect.poll(() => aLaVista(f), { timeout: 5_000 }).toEqual(['pantalla12']);
  await pulsar(f, 12, 'verde');
  await expect.poll(() => aLaVista(f), { timeout: 5_000 }).toEqual(['pantalla13']);
  return lista.find((a) => a.id === aventuraId);
}

/** De vuelta en la P7 por la ✗ de la P13, con sus botones ya repintados. */
async function volverAElegir(page, f) {
  const cargadas = page.waitForEvent('console', { predicate: (m) => m.text().includes('Aventuras cargadas dinámicamente'), timeout: 20_000 });
  await pulsar(f, 13, 'rojo');
  expect(await aLaVista(f), 'la ✗ de la P13 lleva a elegir aventura').toEqual(['pantalla7']);
  // Los botones se repintan en el acto, antes de que llegue el índice: se leen ya, y otra vez al terminar la carga.
  const alVolver = await botones(f);
  await cargadas;
  return { alVolver, trasLaCarga: await botones(f) };
}

async function arrancar(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  // El bus de la selección tiene que estar montado antes de elegir aventura: elegir avisa al padre.
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 20_000 },
  );
  // El idioma se elige en P2, antes que todo lo que recorren estos tests.
  await seleccion(page).evaluate(() => globalThis.seleccionarIdioma('es'));
}

test.describe('CP — la confirmación de la aventura tras el pago', () => {
  test.beforeEach(async ({ page }) => { await arrancar(page); });

  test('CP-1. Dieciocho pantallas, cada una en su número', async ({ page }) => {
    const f = seleccion(page);
    const info = await f.evaluate(() => {
      const de = (selector) => document.querySelector(selector)?.closest('.pantalla')?.id ?? null;
      const cuenta = (id) => {
        const p = document.getElementById(id);
        return { tarjetas: p?.querySelectorAll('.aventura-confirmacion-card').length ?? 0, rojos: p?.querySelectorAll('.btn-mundo-rojo').length ?? 0, verdes: p?.querySelectorAll('.btn-mundo-verde').length ?? 0 };
      };
      return {
        pantallas: [...document.querySelectorAll('.pantalla')].map((p) => p.id),
        confirmaciones: { p9: cuenta('pantalla9'), p13: cuenta('pantalla13') },
        donde: {
          pago: de('[onclick*="continuarTrasPago"]'),
          codigo: de('#input-codigo'),
          normativa: de('#normativa-contenido'),
          reto2: de('#reto-r2-box'),
          logos: de('[onclick*="iniciarAventura"]'),
          agradecimientos: de('#agradecimientos-contenido'),
        },
      };
    });
    expect(info.pantallas, 'las pantallas van de la 1 a la 18, en orden').toEqual(Array.from({ length: 18 }, (_, i) => `pantalla${i + 1}`));
    const unaTarjetaYDosBotones = { tarjetas: 1, rojos: 1, verdes: 1 };
    expect(info.confirmaciones, 'la P9 y la P13 son la misma pantalla: una tarjeta, una ✗ y una ➣').toEqual({ p9: unaTarjetaYDosBotones, p13: unaTarjetaYDosBotones });
    expect(info.donde).toEqual({
      pago: 'pantalla12', codigo: 'pantalla14', normativa: 'pantalla15', reto2: 'pantalla16', logos: 'pantalla17', agradecimientos: 'pantalla18',
    });
  });

  test('CP-2. La tarjeta enseña la aventura elegida y se pinta al mostrarse la pantalla', async ({ page }) => {
    const f = seleccion(page);
    await abrirEleccion(page, f);

    await f.evaluate(() => globalThis.seleccionarAventura('Aventura34km'));
    await f.evaluate(() => mostrar(9));
    const larga = await tarjetas(f);
    expect(larga.p9, 'la P9 enseña la aventura elegida, con sus horas').toContain('max 150h');
    expect(larga.p13, 'la P13 enseña lo mismo que la P9').toBe(larga.p9);

    // La aventura cambia sin pasar por el botón (escribiendo la variable, como hace seleccionarAventura): al mostrarse
    // la pantalla, la tarjeta tiene que enseñar la que hay AHORA, no la que se pintó la última vez.
    await f.evaluate(() => { aventuraSeleccionada = 'Aventura2'; });
    await f.evaluate(() => mostrar(9));
    const corta = await tarjetas(f);
    expect(corta.p9, 'la tarjeta sigue a la variable que usa el resto del recorrido').toContain('max 60h');
    expect(corta.p9).not.toBe(larga.p9);
    expect(corta.p13).toBe(corta.p9);
  });

  test('CP-3. Del pago a la confirmación, y de la confirmación al código', async ({ page }) => {
    const f = seleccion(page);
    const elegida = await hastaLaConfirmacionTrasElPago(page, f, 'Aventura1');
    expect((await tarjetas(f)).p13, 'la P13 enseña la aventura elegida').toContain(elegida.titulo);

    await pulsar(f, 13, 'verde');
    await expect.poll(() => aLaVista(f), { timeout: 5_000 }).toEqual(['pantalla14']);
    expect(await f.evaluate(() => !!document.querySelector('#pantalla14 #input-codigo')), 'la P14 es la del código').toBe(true);
  });

  test('CP-4. Control: sin haber pasado por el pago se eligen las siete, y elegir enseña el mapa y no la P13', async ({ page }) => {
    const f = seleccion(page);
    const lista = await abrirEleccion(page, f);
    expect(lista.map((a) => a.categoria).sort(), 'seis cortas y una larga').toEqual(['corta', 'corta', 'corta', 'corta', 'corta', 'corta', 'larga']);
    expect(lista.filter((a) => a.apagado).map((a) => a.id), 'sin pago hecho no hay ninguna apagada').toEqual([]);

    await elegir(f, 'Aventura2');
    await expect.poll(() => mapaALaVista(f), { timeout: 10_000 }).toBe(true);
    expect(await aLaVista(f), 'la elección sigue debajo del mapa: nadie ha saltado a la P13').toEqual(['pantalla7']);
  });

  test('CP-5. Con el pago hecho de una corta: la larga sale apagada y otra corta va derecha a la P13', async ({ page }) => {
    const f = seleccion(page);
    const primera = await hastaLaConfirmacionTrasElPago(page, f, 'Aventura1');
    const { alVolver, trasLaCarga } = await volverAElegir(page, f);

    const apagadas = (lista) => lista.filter((a) => a.apagado).map((a) => a.id);
    expect(apagadas(alVolver), 'nada más volver, la larga ya está apagada: no se quedan a la vista los botones de antes').toEqual(['Aventura34km']);
    expect(apagadas(trasLaCarga), 'y sigue así al terminar de cargar el índice').toEqual(['Aventura34km']);

    await elegir(f, 'Aventura2');
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla13']);
    expect(await mapaALaVista(f), 'con el pago hecho no se enseña el mapa').toBe(false);
    const segunda = trasLaCarga.find((a) => a.id === 'Aventura2');
    const t = await tarjetas(f);
    expect(t.p13, 'la tarjeta es la de la aventura nueva').toContain(segunda.titulo);
    expect(t.p13).not.toContain(primera.titulo);
    // El padre se entera de la aventura nueva por el mismo aviso de siempre, antes de enseñarse la P13.
    expect(await page.evaluate(() => globalThis.aventuraSeleccionada)).toBe('Aventura2');

    await pulsar(f, 13, 'verde');
    await expect.poll(() => aLaVista(f), { timeout: 5_000 }).toEqual(['pantalla14']);
  });

  test('CP-6. Con el pago hecho de la larga, las cortas salen apagadas y solo se puede volver a elegir la larga', async ({ page }) => {
    const f = seleccion(page);
    await hastaLaConfirmacionTrasElPago(page, f, 'Aventura34km');
    const { trasLaCarga } = await volverAElegir(page, f);
    expect(trasLaCarga.filter((a) => !a.apagado).map((a) => a.id), 'solo queda encendida la de la categoría pagada').toEqual(['Aventura34km']);

    // Pulsar una apagada no hace nada: sigue la elección en pantalla.
    await elegir(f, 'Aventura1');
    expect(await aLaVista(f)).toEqual(['pantalla7']);
    expect(await f.evaluate(() => aventuraSeleccionada), 'la aventura elegida no cambia').toBe('Aventura34km');

    await elegir(f, 'Aventura34km');
    await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla13']);
  });

  test('CP-7. La P13 no se enseña sin el pago hecho: pedirla enseña la pantalla de pago', async ({ page }) => {
    const f = seleccion(page);
    const consola = [];
    page.on('console', (m) => consola.push(m.text()));
    await abrirEleccion(page, f);
    await elegir(f, 'Aventura1');
    await expect.poll(() => mapaALaVista(f), { timeout: 10_000 }).toBe(true);

    await f.evaluate(() => mostrar(13));
    expect(await aLaVista(f), 'sin pago hecho, la P13 no se abre').toEqual(['pantalla12']);
    await expect.poll(() => consola.some((t) => t.includes('P13 pedida sin el pago hecho')), { timeout: 5_000 }).toBe(true);
  });

  test('CP-8. Empezar de cero deja de dar el pago por hecho', async ({ page }) => {
    const f = seleccion(page);
    await hastaLaConfirmacionTrasElPago(page, f, 'Aventura1');
    // Control: el pago está dado por hecho de verdad (la larga sale apagada). Sin esto, lo de abajo no diría nada.
    const { trasLaCarga } = await volverAElegir(page, f);
    expect(trasLaCarga.filter((a) => a.apagado).map((a) => a.id)).toEqual(['Aventura34km']);
    // Lo que hace el «no» del reto 2: reiniciar la selección y volver a la P1.
    await f.evaluate(async () => { reiniciarSeleccion(); await mostrar(1); });
    expect(await aLaVista(f)).toEqual(['pantalla1']);
    // Empezar de cero vacía también el idioma: el usuario lo vuelve a elegir en P2 antes de llegar a las aventuras.
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));

    const lista = await abrirEleccion(page, f);
    expect(lista.filter((a) => a.apagado).map((a) => a.id), 'vuelven a poder elegirse todas').toEqual([]);
    await elegir(f, 'Aventura2');
    await expect.poll(() => mapaALaVista(f), { timeout: 10_000 }).toBe(true);
    expect(await aLaVista(f), 'el recorrido vuelve a ser el entero').toEqual(['pantalla7']);
  });

  test('CP-9. En local el código se rechaza: sale el aviso y la P14 sigue en pantalla', async ({ page }) => {
    const f = seleccion(page);
    await hastaLaConfirmacionTrasElPago(page, f, 'Aventura1');
    await pulsar(f, 13, 'verde');
    await expect.poll(() => aLaVista(f), { timeout: 5_000 }).toEqual(['pantalla14']);

    await f.evaluate(() => {
      const pon = (id, valor) => { const el = document.getElementById(id); el.value = valor; el.dispatchEvent(new Event('input', { bubbles: true })); };
      pon('input-email', 'prueba@example.com');
      pon('input-codigo', 'A3X7-K2P9');
    });
    expect(await f.evaluate(() => document.getElementById('btn-iniciar-aventura').disabled), 'con formato válido el botón se habilita').toBe(false);
    await f.evaluate(() => document.getElementById('btn-iniciar-aventura').click());

    await f.waitForFunction(() => !!document.getElementById('_p14-error-overlay'), null, { timeout: 15_000 });
    expect(await aLaVista(f), 'no se pasa a la normativa').toEqual(['pantalla14']);
    await f.evaluate(() => document.getElementById('_p14-error-ok').click());
    expect(await f.evaluate(() => !!document.getElementById('_p14-error-overlay')), 'el aviso se cierra con su botón').toBe(false);
  });
});

test.describe('CP — la normativa y lo que carga', () => {
  test.beforeEach(async ({ page, context }) => {
    // La normativa enciende el GPS: el permiso y la posición se dan ANTES de abrir la página.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await arrancar(page);
    await page.evaluate(() => { globalThis.aventuraSeleccionada = 'Aventura1'; globalThis.idiomaSeleccionado = 'es'; });
  });

  test('CP-10. En modo DEV la P12, la P13 y la P14 llevan a la normativa', async ({ page }) => {
    test.setTimeout(90_000);
    const f = seleccion(page);
    await f.evaluate(() => { globalThis._devCasaMode = true; });
    for (const pedida of [12, 13, 14]) {
      await f.evaluate((id) => mostrar(id), pedida);
      expect(await aLaVista(f), `pedir la P${pedida} en modo DEV enseña la normativa`).toEqual(['pantalla15']);
    }
    // La normativa hace que el padre cargue los hijos: se espera a que termine antes de cerrar la página.
    await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 60_000 });
  });

  test('CP-11. Al mostrarse la normativa (P15) el padre carga los hijos', async ({ page }) => {
    test.setTimeout(90_000);
    const f = seleccion(page);
    expect(await page.evaluate(() => globalThis._iframesPreCargadosP15 === true), 'antes de la normativa los hijos no están cargados').toBe(false);
    await f.evaluate(() => mostrar(15));
    expect(await aLaVista(f)).toEqual(['pantalla15']);
    await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 60_000 });
    const listos = await page.evaluate(() => ['hijo2', 'hijo3', 'hijo4'].map((h) => globalThis.estadoPadre?.hijosInicializados?.has(h) === true));
    expect(listos, 'hijo2, hijo3 y hijo4 han completado su apretón de manos').toEqual([true, true, true]);
  });
});
