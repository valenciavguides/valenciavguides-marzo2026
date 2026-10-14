/**
 * 131 — El botón atrás, con una aventura en marcha, se porta como en una app nativa
 *
 * POR QUE EXISTE
 *
 * Con una aventura en marcha, «atrás» no puede sacar al usuario de la aplicación. Cada pulsación cierra primero lo
 * que tiene delante (la capa del padre con la ✕ común, el asistente o un desplegable abierto) y, si no hay nada que
 * cerrar, enseña el diálogo de vuelta («Continuar mi aventura» / «Elegir otra aventura»). Con el diálogo abierto,
 * «atrás» es su «Continuar». Lo que no tiene ✕ a propósito, como la ventana del reto, se queda: sale el diálogo
 * encima, y al continuar todo sigue como estaba. «¿Hay una aventura en marcha?» lo contesta el modo, no la aventura y
 * el idioma elegidos en la selección.
 *
 * Aquí «atrás» es `history.back()` en el padre, el mismo `popstate` que da el botón del móvil. Ningún otro spec lo
 * pulsa: los que abren el diálogo de vuelta lo hacen llamando a su función.
 *
 *   BA-1  Sesión recién abierta: el primer «atrás» enseña el diálogo; el segundo lo cierra («Continuar») y la
 *         aventura sigue; el tercero lo vuelve a enseñar. La aplicación no se abandona en ningún momento.
 *   BA-2  Primero lo que hay delante: la ventana del listado de paradas (✕ común) y el asistente se cierran con
 *         «atrás», uno por pulsación, sin diálogo; cuando ya no queda nada, el diálogo.
 *   BA-3  Un desplegable abierto (el del tipo de mapa) se cierra con «atrás», sin diálogo.
 *   BA-4  La ventana del reto (sin ✕) no se cierra: el diálogo sale encima y se puede pulsar; al continuar, la
 *         ventana sigue a la vista.
 *   BA-5  Con el modal de fin de aventura (sin ✕) «atrás» no hace nada: ni diálogo ni salida.
 *   BA-6  Sin aventura en marcha —tras «Elegir otra aventura», con otra aventura elegida en la selección y sin
 *         arrancar— «atrás» no enseña el diálogo.
 *
 * ROJO ANTES QUE VERDE: con el escucha anterior (miraba el estado de la entrada a la que se llega, y la aventura y
 * el idioma elegidos), BA-1 a BA-4 y BA-6 fallan: el primer «atrás» no enseña el diálogo ni cierra nada (BA-6 cae ya
 * en ese primer paso). BA-5 pasa con los dos, porque el anterior no hacía nada con ningún «atrás».
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

async function arranqueTerminado(page) {
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  await page.waitForFunction(() => !document.body.classList.contains('loading'), null, { timeout: 30_000 });
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 30_000 },
  );
}

/** El recorrido real desde elegir hasta la aventura en marcha (el mismo que el spec 128). */
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
  // En marcha y a la vista: la pantalla de carga del padre se desvanece en 0,5 s después de quitar `body.loading`,
  // y mientras tanto sigue encima de todo (spinner incluido); hasta que desaparece, el usuario no puede tocar nada.
  await page.waitForFunction(
    (a) => globalThis.estadoPadre?.modo?.actual === 'aventura' && globalThis.aventuraSeleccionada === a
      && getComputedStyle(document.getElementById('seleccion')).display === 'none'
      && !document.body.classList.contains('loading') && !!globalThis.estadoPadre?.paradaActual
      && getComputedStyle(document.getElementById('loading-overlay')).display === 'none',
    aventura, { timeout: 60_000 },
  );
}

const hayDialogo = (page) => page.evaluate(() => !!document.getElementById('btn-vuelta-continuar'));
const sigueEnLaAventura = (page) => page.evaluate(() => globalThis.estadoPadre?.modo?.actual === 'aventura');

/** «Atrás» de verdad: el popstate que da el botón del móvil. */
const atras = (page) => page.evaluate(() => history.back());

test.describe('BA — el botón atrás, como en una app nativa', () => {
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

  test('BA-1. Sesión recién abierta: atrás enseña el diálogo, el siguiente lo cierra y el otro lo vuelve a enseñar', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(false);
    expect(await sigueEnLaAventura(page), 'tras «Continuar», la aventura sigue').toBe(true);
    expect(await page.evaluate(() => document.body.classList.contains('loading')), 'y no queda nada tapado').toBe(false);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
    expect(await sigueEnLaAventura(page), 'la aplicación no se ha abandonado').toBe(true);
  });

  test('BA-2. Primero lo que hay delante: el listado de paradas y el asistente, uno por pulsación', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');

    // El listado de paradas (✕ común) y, encima o al lado, el asistente.
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: {} }));
    await expect(page.locator('#ventana-listado-paradas-padre')).toBeVisible();
    await page.evaluate(() => document.getElementById('btn-chat-soporte').click());
    await expect(page.locator('#hijo6-chat')).toBeVisible();

    const abiertos = () => page.evaluate(() => ({
      listado: getComputedStyle(document.getElementById('ventana-listado-paradas-padre')).display !== 'none',
      chat: getComputedStyle(document.getElementById('hijo6-chat')).display !== 'none',
      dialogo: !!document.getElementById('btn-vuelta-continuar'),
    }));
    expect(await abiertos()).toEqual({ listado: true, chat: true, dialogo: false });

    await atras(page);
    await expect.poll(() => abiertos().then((a) => Number(a.listado) + Number(a.chat)), { timeout: 5_000 }).toBe(1);
    expect((await abiertos()).dialogo, 'cerrar lo de delante no enseña el diálogo').toBe(false);

    await atras(page);
    await expect.poll(() => abiertos(), { timeout: 5_000 }).toEqual({ listado: false, chat: false, dialogo: false });

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
  });

  test('BA-3. Un desplegable abierto se cierra con atrás, sin diálogo', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    // El desplegable del tipo de mapa, abierto como lo abre el usuario: su botón principal.
    const abierto = () => page.evaluate(() => {
      const d = document.querySelector('#selector-tipo-mapa > div:nth-child(2)');
      return !!d && d.style.maxHeight !== '0' && d.style.maxHeight !== '0px' && d.style.maxHeight !== '';
    });
    await page.evaluate(() => document.querySelector('#selector-tipo-mapa > div:first-child').click());
    await expect.poll(abierto, { timeout: 5_000 }).toBe(true);

    await atras(page);
    await expect.poll(abierto, { timeout: 5_000 }).toBe(false);
    expect(await hayDialogo(page), 'cerrar el desplegable no enseña el diálogo').toBe(false);
  });

  test('BA-4. La ventana del reto no se cierra: el diálogo sale encima y al continuar sigue a la vista', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    // La ventana del reto a la vista, como la deja el padre al mostrar un reto (z-index por encima del diálogo).
    await page.evaluate(() => document.getElementById('hijo4').classList.add('visible'));
    await expect(page.locator('#hijo4')).toBeVisible();

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
    const encima = await page.evaluate(() => {
      const b = document.getElementById('btn-vuelta-continuar').getBoundingClientRect();
      const el = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return !!el && !!el.closest('#btn-vuelta-continuar');
    });
    expect(encima, 'el botón «Continuar» es lo que hay arriba, no la ventana del reto').toBe(true);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(false);
    await expect(page.locator('#hijo4')).toBeVisible();
    expect(await page.evaluate(() => document.getElementById('hijo4').classList.contains('visible')), 'la ventana del reto sigue abierta').toBe(true);
  });

  test('BA-5. Con el modal de fin de aventura, atrás no hace nada', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    // Basta su presencia, como en el spec 72 (CR-6): el escucha mira si está.
    await page.evaluate(() => {
      const modal = document.createElement('div');
      modal.id = 'modal-finalizacion-aventura';
      document.body.appendChild(modal);
    });
    await atras(page);
    // VENTANA-OBSERVACION: con el modal de fin, «atrás» no debe enseñar el diálogo ni sacar de la aplicación
    await page.waitForTimeout(1500);
    expect(await hayDialogo(page)).toBe(false);
    expect(await sigueEnLaAventura(page)).toBe(true);
  });

  test('BA-6. Sin aventura en marcha, con otra aventura elegida en la selección, atrás no enseña el diálogo', async ({ page }) => {
    test.setTimeout(240_000);
    await arrancarAventura(page, 'Aventura1');
    // «Elegir otra aventura» del diálogo de vuelta: recarga la página.
    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
    const recarga = page.waitForEvent('load', { timeout: 30_000 });
    await page.evaluate(() => document.getElementById('btn-vuelta-elegir-otra').click()).catch(() => {});
    await recarga;
    await arranqueTerminado(page);

    const f = seleccion(page);
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));
    await f.evaluate(() => mostrar(7));
    await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
    await f.evaluate(() => globalThis.seleccionarAventura('Aventura2'));
    await page.waitForFunction(() => globalThis.aventuraSeleccionada === 'Aventura2', null, { timeout: 15_000 });
    expect(await page.evaluate(() => globalThis.estadoPadre?.modo?.actual ?? null), 'sin aventura en marcha').toBeNull();

    await atras(page).catch(() => {});
    // VENTANA-OBSERVACION: sin aventura en marcha el diálogo de vuelta no debe salir
    await page.waitForTimeout(1500);
    expect(await hayDialogo(page).catch(() => false)).toBe(false);
  });
});
