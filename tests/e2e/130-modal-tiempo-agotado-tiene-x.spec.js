/**
 * 130 — El modal de tiempo agotado lleva la ✕ común de la PWA, y hace lo mismo que «Hacer otra aventura»
 *
 * POR QUE EXISTE
 *
 * Toda capa que el usuario puede cerrar lleva la misma ✕ (`.btn-cerrar-overlay` con `.icono-x-cerrar`), y el botón
 * atrás del móvil la va a pulsar por él. El modal de tiempo agotado no la tenía. Cerrarlo sin más dejaría debajo la
 * aventura con los controles bloqueados y sin salida, así que su ✕ hace lo mismo que «Hacer otra aventura»: limpia lo
 * guardado (`limpiarDatosAventura`, que vacía el localStorage) y recarga la página.
 *
 *   TX-1  El modal muestra la ✕ común, visible y dentro del modal.
 *   TX-2  La ✕ vacía lo guardado y recarga la página, sin modal al volver.
 *   TX-3  Control: «Hacer otra aventura», medido igual, hace lo mismo.
 *
 * ROJO ANTES QUE VERDE: sin la ✕, TX-1 y TX-2 no la encuentran.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MARCA = 'vv_marca_spec130';

/** El padre arrancado del todo, con una marca en el localStorage y el aviso de tiempo agotado del temporizador de hijo1. */
async function conElTiempoAgotado(page) {
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(
    () => typeof globalThis.mostrarModalTiempoAgotado === 'function' && !!globalThis.estado
      && !document.body.classList.contains('loading'),
    null, { timeout: 30_000 },
  );
  await page.evaluate((m) => localStorage.setItem(m, '1'), MARCA);
  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'AVENTURA.TIEMPO_AGOTADO', datos: {} }));
  await expect(page.locator('#modal-tiempo-agotado')).toBeVisible();
}

/** Pulsa `selector` y espera a la recarga; devuelve lo que queda después. */
async function pulsarYRecargar(page, selector) {
  const recarga = page.waitForEvent('load', { timeout: 30_000 });
  await page.locator(selector).click();
  await recarga;
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  return page.evaluate((m) => ({
    marca: localStorage.getItem(m),
    modal: !!document.getElementById('modal-tiempo-agotado'),
  }), MARCA);
}

test.describe('TX — el modal de tiempo agotado tiene la ✕ común', () => {
  test('TX-1. El modal muestra la ✕ común, visible y dentro del modal', async ({ page }) => {
    await conElTiempoAgotado(page);
    const x = page.locator('#modal-tiempo-agotado .btn-cerrar-overlay');
    await expect(x).toHaveCount(1);
    await expect(x).toBeVisible();
    await expect(x.locator('.icono-x-cerrar')).toHaveCount(1);
  });

  test('TX-2. La ✕ vacía lo guardado y recarga la página, sin modal al volver', async ({ page }) => {
    test.setTimeout(120_000);
    await conElTiempoAgotado(page);
    expect(await pulsarYRecargar(page, '#modal-tiempo-agotado .btn-cerrar-overlay')).toEqual({ marca: null, modal: false });
  });

  test('TX-3. Control: «Hacer otra aventura» hace lo mismo', async ({ page }) => {
    test.setTimeout(120_000);
    await conElTiempoAgotado(page);
    expect(await pulsarYRecargar(page, '#btn-tiempo-agotado-otra')).toEqual({ marca: null, modal: false });
  });
});
