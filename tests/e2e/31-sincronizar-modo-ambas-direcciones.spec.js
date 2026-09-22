/**
 * MD — el cambio de modo se aplica igual en las dos direcciones
 *
 * `sincronizarEstadoModo` (hijo4) y `sincronizarSeekPorModo` (hijo3) tienen que funcionar
 * tanto en CASA→AVENTURA como en AVENTURA→CASA, no solo en la dirección que se probó a mano.
 * Incluye el guard `retoSigueActivo` de `RETO.LIMPIAR_ESTADO`, que es específico de CASA.
 *
 *   MD-1  hijo4: CAMBIO_MODO→casa aplica clase modo-casa al body
 *   MD-2  hijo4: CAMBIO_MODO→aventura aplica clase modo-aventura al body
 *   MD-3  hijo4: RETO.LIMPIAR_ESTADO con retoSigueActivo:false NO reaparece el wrapper
 *   MD-4  hijo4: RETO.LIMPIAR_ESTADO con retoSigueActivo:true SÍ lo reaparece
 *   MD-5  hijo4: sin el campo (compatibilidad) también lo reaparece
 *   MD-6  hijo3: CAMBIO_MODO→casa deja la barra de progreso arrastrable
 *   MD-7  hijo3: CAMBIO_MODO→aventura la deja no-arrastrable si el padre no la habilitó
 *
 * LOS DOS HIJOS VIVEN EN UN MARCO, COMO EN LA APP
 *
 * `helpers/marco-vacio.html` les hace de padre. Cargarlos como página de primer nivel dejó de
 * valer al migrarlos al bus: un frame sin padre no envía ni recibe por el camino real, y el
 * montaje anterior lo suplía inyectando un `globalThis.mensajeria` de mentira — o sea que
 * comprobaba su propio muñeco.
 *
 * Ese muñeco además tapaba una carrera real, medida en su día: el `enviarMensaje` propio de
 * cada hijo bifurcaba por `parent !== window` y, suelto, caía en un reintento de 10×500 ms
 * sobre un objeto que no existía. Eran 5.000 ms exactos, justo el plazo que esperaba el
 * `expect.poll`: empate resuelto por el planificador, y de ahí que MD-2/MD-3 pasaran sueltos
 * y cayeran en tandas completas. Dentro del marco esa rama no existe.
 *
 * LA ESPERA AL HANDLER SE LE PREGUNTA AL BUS
 *
 * `mensajeria.tieneControlador(tipo)`, que es API pública. Antes se miraba
 * `messagingAdapter._listenerRegistry`, la estructura privada del envoltorio de cada hijo: al
 * desaparecer el envoltorio, el test se caía sin que la aplicación tuviera nada roto.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, enviarAlHijo } = require('./helpers/boot');

/** Abre el hijo en el marco y espera a que su handler de cambio de modo exista. */
async function abrirConHandlerDeModo(page, fichero) {
  const hijo = await abrirHijoEnMarco(page, fichero);
  await expect
    .poll(() => hijo.evaluate(() => globalThis.mensajeria.tieneControlador('SISTEMA.CAMBIO_MODO')), { timeout: 10_000 })
    .toBe(true);
  return hijo;
}

const enviarCambioModo = (page, destino, modo) => enviarAlHijo(page, {
  tipo: 'SISTEMA.CAMBIO_MODO',
  origen: 'padre',
  destino,
  datos: { modo, timestamp: Date.now() },
});

const claseDelBody = (hijo, clase) => hijo.evaluate((c) => document.body.classList.contains(c), clase);

test.describe('MD — sincronizarEstadoModo (hijo4) en ambas direcciones', () => {
  const abrirHijo4 = (page) => abrirConHandlerDeModo(page, 'retos-hijo4.html');

  const enviarLimpiarEstado = (page, datos) => enviarAlHijo(page, {
    tipo: 'RETO.LIMPIAR_ESTADO',
    origen: 'padre',
    destino: 'hijo4',
    datos,
  });

  const displayDelWrapper = (hijo) => hijo.evaluate(() => document.getElementById('botonRetos-wrapper').style.display);

  async function ponerEnCasa(page, hijo) {
    await enviarCambioModo(page, 'hijo4', 'casa');
    await expect.poll(() => claseDelBody(hijo, 'modo-casa'), { timeout: 5000 }).toBe(true);
  }

  test('MD-1. CAMBIO_MODO→casa aplica clase modo-casa al body', async ({ page }) => {
    const hijo = await abrirHijo4(page);
    await ponerEnCasa(page, hijo);
    expect(await claseDelBody(hijo, 'modo-aventura')).toBe(false);
  });

  test('MD-2. CAMBIO_MODO→aventura aplica clase modo-aventura al body', async ({ page }) => {
    const hijo = await abrirHijo4(page);
    await enviarCambioModo(page, 'hijo4', 'aventura');
    await expect.poll(() => claseDelBody(hijo, 'modo-aventura'), { timeout: 5000 }).toBe(true);
    expect(await claseDelBody(hijo, 'modo-casa')).toBe(false);
  });

  test('MD-3. RETO.LIMPIAR_ESTADO con retoSigueActivo:false NO reaparece botonRetos-wrapper en CASA', async ({ page }) => {
    const hijo = await abrirHijo4(page);
    await ponerEnCasa(page, hijo);

    // Punto de partida conocido: oculto (el HTML estático ya arranca así).
    expect(await displayDelWrapper(hijo)).toBe('none');

    await enviarLimpiarEstado(page, { retoId: 'reto-viejo', retoSigueActivo: false });
    // VENTANA-OBSERVACION: MD-3 demuestra que el wrapper NO reaparece; no hay condición que esperar
    await page.waitForTimeout(300);
    expect(await displayDelWrapper(hijo), 'retoSigueActivo:false debe dejar el wrapper oculto').toBe('none');
  });

  test('MD-4. RETO.LIMPIAR_ESTADO con retoSigueActivo:true SÍ reaparece botonRetos-wrapper en CASA', async ({ page }) => {
    const hijo = await abrirHijo4(page);
    await ponerEnCasa(page, hijo);

    await enviarLimpiarEstado(page, { retoId: 'reto-actual', retoSigueActivo: true });
    await expect.poll(() => displayDelWrapper(hijo), {
      timeout: 5000,
      message: 'retoSigueActivo:true debe volver a mostrar el wrapper',
    }).toBe('');
  });

  test('MD-5. RETO.LIMPIAR_ESTADO sin campo retoSigueActivo (compatibilidad) también reaparece el wrapper en CASA', async ({ page }) => {
    const hijo = await abrirHijo4(page);
    await ponerEnCasa(page, hijo);

    await enviarLimpiarEstado(page, { retoId: 'reto-sin-campo' });
    await expect.poll(() => displayDelWrapper(hijo), {
      timeout: 5000,
      message: 'Sin el campo retoSigueActivo, el valor por defecto (!== false) debe mostrar el wrapper — no romper el caso normal',
    }).toBe('');
  });
});

test.describe('MD — sincronizarSeekPorModo (hijo3) en ambas direcciones', () => {
  const abrirHijo3 = (page) => abrirConHandlerDeModo(page, 'audio-hijo3.html');
  const barraDeshabilitada = (hijo) =>
    hijo.evaluate(() => document.getElementById('progressContainer').classList.contains('deshabilitado'));

  test('MD-6. CAMBIO_MODO→casa aplica modo-casa y deja la barra de progreso arrastrable', async ({ page }) => {
    const hijo = await abrirHijo3(page);
    await enviarCambioModo(page, 'hijo3', 'casa');
    await expect.poll(() => claseDelBody(hijo, 'modo-casa'), { timeout: 5000 }).toBe(true);
    expect(
      await barraDeshabilitada(hijo),
      'En CASA la barra debe quedar arrastrable aunque el padre no la haya habilitado explícitamente',
    ).toBe(false);
  });

  test('MD-7. CAMBIO_MODO→aventura aplica modo-aventura y deja la barra deshabilitada si el padre no la habilitó', async ({ page }) => {
    const hijo = await abrirHijo3(page);
    await enviarCambioModo(page, 'hijo3', 'aventura');
    await expect.poll(() => claseDelBody(hijo, 'modo-aventura'), { timeout: 5000 }).toBe(true);
    expect(
      await barraDeshabilitada(hijo),
      'En AVENTURA sin CONTROL.HABILITAR{control:progressBar} del padre, la barra debe seguir no-arrastrable',
    ).toBe(true);
  });
});
