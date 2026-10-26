/**
 * 131 — El botón atrás, con una aventura en marcha, se porta como en una app nativa
 *
 * POR QUE EXISTE
 *
 * Con una aventura en marcha, «atrás» no puede sacar al usuario de la aplicación. Cada pulsación cierra primero lo
 * que tiene delante (la capa del padre con la ✕ común, el asistente, la ventana del temporizador, una capa de dentro
 * de un hijo o un desplegable abierto) y, si no hay nada que cerrar, enseña el diálogo de vuelta («Continuar mi
 * aventura» / «Elegir otra aventura»). Con el diálogo abierto, «atrás» es su «Continuar». Lo que no tiene ✕ a
 * propósito, como la ventana del reto, se queda: sale el diálogo encima, y al continuar todo sigue como estaba.
 * «¿Hay una aventura en marcha?» lo contesta el modo, no la aventura y el idioma elegidos en la selección.
 *
 * Las capas de dentro de un hijo (el menú de hijo1, el modal interno del asistente, la ficha de un monumento del
 * mapa completo) las ve el padre porque el hijo le avisa al abrirlas y al cerrarlas (js/capa-con-atras.js); «atrás»
 * le pide al hijo que la cierre. Antes de pulsar «atrás», cada caso espera a que el padre lo sepa
 * (`_hijosConCapaAbierta`): el aviso tarda lo que un mensaje, y un dedo no pulsa tan rápido.
 *
 * Aquí «atrás» es `history.back()` en el padre, el mismo `popstate` que da el botón del móvil. Ningún otro spec lo
 * pulsa: los que abren el diálogo de vuelta lo hacen llamando a su función. Cada caso arranca en el punto de inicio, y
 * antes de empezar cierra el cartel de llegada que sale allí (`arrancarAventura`).
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
 *   BA-7  El menú de hijo1 abierto y, encima, el listado de paradas: el primer «atrás» cierra el listado, el segundo
 *         el menú (lo de dentro del hijo, que el padre no dibuja), y solo el tercero enseña el diálogo.
 *   BA-8  El modal interno del asistente (los términos) se cierra antes que el asistente: un «atrás» para cada uno.
 *   BA-9  La ficha de un monumento del mapa completo se cierra antes que el mapa: un «atrás» para cada uno.
 *   BA-10 La ventana del temporizador (sin ✕: la abre y la cierra el icono de hijo1) se cierra con «atrás».
 *   BA-11 La ventana del reto encima del menú abierto de hijo1: «atrás» enseña el diálogo y el menú de debajo no se
 *         toca. Al continuar, siguen los dos.
 *
 * ROJO ANTES QUE VERDE: con el escucha anterior (miraba el estado de la entrada a la que se llega, y la aventura y
 * el idioma elegidos), BA-1 a BA-4 y BA-6 fallan: el primer «atrás» no enseña el diálogo ni cierra nada (BA-6 cae ya
 * en ese primer paso). BA-5 pasa con los dos, porque el anterior no hacía nada con ningún «atrás». Con el padre que
 * solo veía sus propias capas, BA-7 a BA-10 fallan: el menú de hijo1, el modal del asistente, la ficha del monumento y
 * la ventana del temporizador siguen abiertos tras su «atrás», que enseña el diálogo o cierra lo de detrás (el
 * asistente, el mapa). BA-11 vigila el otro lado: sin la ventana del reto en la cuenta, su «atrás» cerraba el menú de
 * debajo en vez de enseñar el diálogo.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
/** Donde está el usuario: el punto de inicio de la Aventura1 (Torres de Serranos). */
const INICIO = { latitude: 39.47876, longitude: -0.37626 };

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
  // En el punto de inicio sale el cartel de llegada, con la ✕ común: una capa más, y «atrás» la cierra antes que nada.
  // Sale cuando una lectura del GPS se procesa ya en AVENTURA. El GPS real da una cada poco; el emulado da una sola, al
  // encenderse en P15, y llegar antes o después del paso a AVENTURA es una carrera de milisegundos: con el cartel a la
  // vista, el «atrás» del caso lo cerraba a él, y el caso fallaba unas veces sí y otras no. Aquí se da la lectura
  // siguiente, la que daría el GPS real (como el spec 32), y el cartel se cierra con su ✕, como lo cerraría el usuario:
  // cada caso empieza sin nada delante.
  await page.evaluate((c) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { ...c, accuracy: 8 } }), INICIO);
  const cartel = page.locator('#cartel-llegada-parada');
  await expect(cartel, 'el cartel de llegada al inicio').toHaveCount(1);
  await cartel.locator('.btn-cerrar-overlay').click();
  await expect(cartel).toHaveCount(0);
}

const hayDialogo = (page) => page.evaluate(() => !!document.getElementById('btn-vuelta-continuar'));
const sigueEnLaAventura = (page) => page.evaluate(() => globalThis.estadoPadre?.modo?.actual === 'aventura');

/** Los hijos que, según el padre, tienen ahora una capa abierta (js/capa-con-atras.js). */
const capasQueVeElPadre = (page) => page.evaluate(() => globalThis._hijosConCapaAbierta().map((c) => c.id).sort());

const hijo1 = (page) => page.frames().find((f) => f.name() === 'hijo1-opciones');
const menuDeHijo1Abierto = (page) => hijo1(page).evaluate(() => getComputedStyle(document.getElementById('icono-gastronomia')).display !== 'none');

/** El menú de «más opciones», abierto como lo abre el usuario, y con el padre ya enterado. */
async function abrirMenuDeHijo1(page) {
  await hijo1(page).evaluate(() => document.getElementById('mas-opciones').click());
  await expect.poll(() => menuDeHijo1Abierto(page), { timeout: 5_000 }).toBe(true);
  await expect.poll(() => capasQueVeElPadre(page), { timeout: 5_000 }).toEqual(['hijo1-opciones']);
}

/** «Atrás» de verdad: el popstate que da el botón del móvil. */
const atras = (page) => page.evaluate(() => history.back());

test.describe('BA — el botón atrás, como en una app nativa', () => {
  test.beforeEach(async ({ page, context }) => {
    // La normativa enciende el GPS: el permiso y la posición se dan ANTES de abrir la página.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation(INICIO);
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

  test('BA-7. El menú de hijo1 se cierra con atrás, después de lo que tiene encima', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    await abrirMenuDeHijo1(page);
    // Encima del menú, el listado de paradas, que es del padre y lleva la ✕ común.
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: {} }));
    await expect(page.locator('#ventana-listado-paradas-padre')).toBeVisible();

    await atras(page);
    await expect(page.locator('#ventana-listado-paradas-padre')).toBeHidden();
    expect(await menuDeHijo1Abierto(page), 'lo de debajo espera a su turno').toBe(true);

    await atras(page);
    await expect.poll(() => menuDeHijo1Abierto(page), { timeout: 5_000 }).toBe(false);
    expect(await hayDialogo(page), 'cerrar el menú no enseña el diálogo').toBe(false);
    await expect.poll(() => capasQueVeElPadre(page), { timeout: 5_000 }).toEqual([]);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
  });

  test('BA-8. El modal interno del asistente se cierra antes que el asistente', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    await page.evaluate(() => document.getElementById('btn-chat-soporte').click());
    await expect(page.locator('#hijo6-chat')).toBeVisible();
    const chat = page.frames().find((f) => f.name() === 'hijo6-chat');
    // La flecha de la primera respuesta con enlace abre los términos (la de los datos de terceros).
    await chat.evaluate(() => document.querySelector('.respuesta-enlace-flecha').click());
    const modalAbierto = () => chat.evaluate(() => document.getElementById('chat-modal-overlay').classList.contains('visible'));
    await expect.poll(modalAbierto, { timeout: 10_000 }).toBe(true);
    expect(await chat.evaluate(() => document.getElementById('chat-modal-contenido').textContent.trim().length), 'con los términos dentro').toBeGreaterThan(0);
    await expect.poll(() => capasQueVeElPadre(page), { timeout: 5_000 }).toEqual(['hijo6-chat']);

    await atras(page);
    await expect.poll(modalAbierto, { timeout: 5_000 }).toBe(false);
    await expect(page.locator('#hijo6-chat'), 'el asistente sigue abierto').toBeVisible();
    expect(await hayDialogo(page)).toBe(false);

    await atras(page);
    await expect(page.locator('#hijo6-chat')).toBeHidden();
    expect(await hayDialogo(page)).toBe(false);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
  });

  test('BA-9. La ficha de un monumento se cierra antes que el mapa completo', async ({ page }) => {
    test.setTimeout(180_000);
    // El mapa completo pinta con Leaflet, que el arnés sustituye por un fichero vacío: aquí se deja pasar el de
    // verdad, como en el spec 54 (MC-3). La ruta registrada después es la que se aplica.
    await page.route('**/cdnjs.cloudflare.com/ajax/libs/leaflet/**', (route) => route.continue());
    await arrancarAventura(page, 'Aventura1');
    // El mismo mensaje que manda el botón del mapa completo de hijo2.
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({
      tipo: globalThis.TIPOS_MENSAJE.NAVEGACION.MOSTRAR_MAPA_COMPLETO,
      datos: {},
    }));
    await expect(page.locator('#iframe-overlay')).toBeVisible();
    await expect.poll(() => page.frames().some((f) => f.url().includes('mapa-completo.html')), { timeout: 10_000 }).toBe(true);
    const mapa = page.frames().find((f) => f.url().includes('mapa-completo.html'));
    await mapa.waitForFunction(() => document.querySelectorAll('.monumento-marker').length > 0, null, { timeout: 30_000 });
    await mapa.locator('.monumento-marker').first().click();
    const fichaAbierta = () => mapa.evaluate(() => document.getElementById('monumento-overlay').classList.contains('visible'));
    await expect.poll(fichaAbierta, { timeout: 5_000 }).toBe(true);
    await expect.poll(() => capasQueVeElPadre(page), { timeout: 5_000 }).toEqual(['mapa-completo']);

    await atras(page);
    await expect.poll(fichaAbierta, { timeout: 5_000 }).toBe(false);
    await expect(page.locator('#iframe-overlay'), 'el mapa sigue abierto').toBeVisible();
    expect(await hayDialogo(page)).toBe(false);

    await atras(page);
    await expect(page.locator('#iframe-overlay')).toBeHidden();
    expect(await hayDialogo(page)).toBe(false);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
  });

  test('BA-10. La ventana del temporizador se cierra con atrás, sin diálogo', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    // El mismo mensaje que manda el icono del temporizador de hijo1.
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.TEMPORIZADOR.TOGGLE, datos: {} }));
    await expect(page.locator('#ventana-temporizador-padre')).toBeVisible();

    await atras(page);
    await expect(page.locator('#ventana-temporizador-padre')).toBeHidden();
    expect(await hayDialogo(page), 'cerrar el temporizador no enseña el diálogo').toBe(false);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
  });

  test('BA-11. Con la ventana del reto encima del menú de hijo1, atrás enseña el diálogo y no toca el menú', async ({ page }) => {
    test.setTimeout(180_000);
    await arrancarAventura(page, 'Aventura1');
    await abrirMenuDeHijo1(page);
    // La ventana del reto a la vista, como en BA-4.
    await page.evaluate(() => document.getElementById('hijo4').classList.add('visible'));
    await expect(page.locator('#hijo4')).toBeVisible();

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(true);
    expect(await menuDeHijo1Abierto(page), 'el menú de debajo no se toca').toBe(true);

    await atras(page);
    await expect.poll(() => hayDialogo(page), { timeout: 5_000 }).toBe(false);
    expect(await menuDeHijo1Abierto(page), 'al continuar sigue el menú').toBe(true);
    expect(await page.evaluate(() => document.getElementById('hijo4').classList.contains('visible')), 'y la ventana del reto').toBe(true);
  });
});
