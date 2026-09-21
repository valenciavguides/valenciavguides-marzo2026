'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * ES — los tres avisos que el padre atendía con una escucha suelta
 *
 *   ES-1  la selección suprime el aviso de girar, y al cerrar el mapa lo devuelve
 *   ES-2  la selección enciende el modo de desarrollo
 *   ES-3  el asistente pide que se le cierre y el padre lo cierra
 *   ES-4  ninguno de los tres se atiende sin `origen`
 *
 * POR QUÉ EXISTE
 *
 * Los tres viajaban con `parent.postMessage` a pelo y el padre los recogía con un
 * `addEventListener('message')` suelto que solo comprobaba el dominio. Ninguno tenía test:
 * MV-5 (spec 55) cubre la supresión de rotación del botón que vive DENTRO de la aventura,
 * que pone la marca directamente sin pasar mensaje alguno, así que el camino desde la
 * selección no lo tocaba nadie.
 *
 * Lo que eso permitía, y es la razón de ES-4: cualquier frame del dominio podía encender el
 * modo de desarrollo, cerrarle el asistente al usuario o dejar la app sin aviso de rotación
 * para el resto de la sesión. El bus solo acepta a los iframes que el padre registra.
 *
 * ROJO ANTES QUE VERDE: los cuatro caen si se quita su `registrarControladorSeguro` de
 * `_regCtrl_UI()`; ES-4 cae además si el bus dejara de exigir `origen`.
 *
 * QUÉ SE MIRA: el efecto en el padre —`rotationSuppressed`, `_devModeActivo`, el iframe del
 * chat oculto—, no que se haya llamado a nada.
 *
 * LO QUE ESTE FICHERO NO CUBRE, Y CONVIENE SABERLO
 *
 * Estos casos mandan el aviso llamando al bus del frame emisor, así que prueban el HANDLER
 * del padre y el viaje, no al emisor. Medido en carne propia: al migrar,
 * `mostrarMapaVintage()` quedó llamando a un `enviarMensaje` que no existe en su ámbito —vive
 * en el `<script>` clásico de la selección, que no ve los bindings del módulo— y ES-1 pasó
 * igual. Quien lo cazó fue SA-2 (spec 82), que sí pulsa el camino del usuario.
 *
 * Quién cubre a cada emisor: SA-2 el del mapa vintage, y el botón de cerrar del asistente
 * está en su propio HTML. El de modo dev no tiene test de emisor (§24 de la guía).
 */

/** Arranca el padre de verdad, con el mapa apagado para no depender de la red. */
async function arrancarPadre(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  // Los handlers de estos tres viven en Script 2: esperar a que estén puestos, o el mensaje
  // llegaría a un padre que todavía no escucha y el test mediría el arranque, no el código.
  await expect
    .poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('SELECCION.DEV_MODE_TOGGLE')), { timeout: 25_000 })
    .toBe(true);
}

/** El frame de la pantalla de selección, que el padre carga al arrancar y tiene registrado. */
async function frameSeleccion(page) {
  let frame = null;
  await expect.poll(() => {
    frame = page.frames().find((f) => /En-busca-del-tesoro/.test(f.url()));
    return !!frame;
  }, { timeout: 20_000 }).toBe(true);
  await expect
    .poll(() => frame.evaluate(() => !!globalThis.mensajeria?.enviarMensaje), { timeout: 20_000 })
    .toBe(true);
  return frame;
}

/** Manda el aviso DESDE la selección, por su propio bus: el camino real. */
function avisarDesdeSeleccion(frame, mensaje) {
  return frame.evaluate((m) => globalThis.mensajeria.enviarMensaje(m), mensaje);
}

test.describe('ES — los avisos que el padre atendía con una escucha suelta', () => {
  test('ES-1. La selección suprime el aviso de girar, y luego lo devuelve', async ({ page }) => {
    await arrancarPadre(page);
    const seleccion = await frameSeleccion(page);

    expect(await page.evaluate(() => globalThis.rotationSuppressed === true),
      'de partida el aviso no está suprimido').toBe(false);

    // `value` viaja DENTRO de `datos`: el bus tira los campos de primer nivel, y este aviso
    // los llevaba fuera. Es el caso que el §16.2 del estudio marca como el que se rompería.
    await avisarDesdeSeleccion(seleccion, {
      tipo: 'NAVEGACION.SUPRIMIR_ROTACION', destino: 'padre', datos: { value: true },
    });
    await expect.poll(() => page.evaluate(() => globalThis.rotationSuppressed === true), { timeout: 8_000 })
      .toBe(true);

    await avisarDesdeSeleccion(seleccion, {
      tipo: 'NAVEGACION.SUPRIMIR_ROTACION', destino: 'padre', datos: { value: false },
    });
    await expect.poll(() => page.evaluate(() => globalThis.rotationSuppressed === true), { timeout: 8_000 })
      .toBe(false);
  });

  test('ES-2. La selección enciende el modo de desarrollo', async ({ page }) => {
    await arrancarPadre(page);
    const seleccion = await frameSeleccion(page);

    await page.evaluate(() => { globalThis._devModeActivo = false; });

    await avisarDesdeSeleccion(seleccion, { tipo: 'SELECCION.DEV_MODE_TOGGLE', destino: 'padre' });
    await expect.poll(() => page.evaluate(() => globalThis._devModeActivo === true), { timeout: 8_000 })
      .toBe(true);
  });

  test('ES-3. El asistente pide que se le cierre y el padre lo cierra', async ({ page }) => {
    await arrancarPadre(page);

    await page.evaluate(() => document.getElementById('btn-chat-soporte').click());
    await expect
      .poll(() => page.evaluate(() => !!document.getElementById('hijo6-chat')?.contentWindow?.mensajeria), { timeout: 20_000 })
      .toBe(true);

    const chat = page.frames().find((f) => /chat-hijo6/.test(f.url()));
    expect(chat, 'el asistente tiene que haberse abierto').toBeTruthy();

    await chat.evaluate(() => globalThis.mensajeria.enviarMensaje({ tipo: 'CHAT.CERRAR', destino: 'padre' }));

    await expect.poll(() => page.evaluate(() => {
      const f = document.getElementById('hijo6-chat');
      return !f || f.style.display === 'none' || !f.classList.contains('visible');
    }), { timeout: 8_000 }).toBe(true);
  });

  test('ES-4. Sin `origen` no se atiende ninguno de los tres', async ({ page }) => {
    await arrancarPadre(page);
    await page.evaluate(() => { globalThis._devModeActivo = false; globalThis.rotationSuppressed = false; });

    // A pelo y sin remite, que es como llegaban antes: la escucha suelta los aceptaba.
    await page.evaluate(() => {
      for (const tipo of ['SELECCION.DEV_MODE_TOGGLE', 'NAVEGACION.SUPRIMIR_ROTACION', 'CHAT.CERRAR']) {
        globalThis.postMessage({ tipo, datos: { value: true } }, globalThis.location.origin);
      }
    });

    // VENTANA-OBSERVACION: se comprueba que NO ocurre nada; no hay condición a la que esperar
    await page.waitForTimeout(1200);

    expect(await page.evaluate(() => globalThis._devModeActivo === true),
      'un aviso sin remite no puede encender el modo de desarrollo').toBe(false);
    expect(await page.evaluate(() => globalThis.rotationSuppressed === true),
      'ni dejar la app sin aviso de rotación').toBe(false);
  });
});
