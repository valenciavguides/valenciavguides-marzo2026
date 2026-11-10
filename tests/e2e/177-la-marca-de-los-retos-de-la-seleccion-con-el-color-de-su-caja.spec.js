/**
 * 177 — La ✓ y la ✗ de los retos de la selección, con el color de su caja
 *
 * POR QUE EXISTE
 *
 * En los dos retos de la pantalla de selección (el R-1 de la P8 y el R-2 de la P16), al contestar, la caja del reto se
 * pinta de verde (`#28a745`) si se acierta y de rojo (`#dc3545`) si se falla, y junto a la opción elegida sale una ✓ o una
 * ✗. La ✓ y la ✗ llevan el mismo verde y el mismo rojo que su caja (decisión del usuario: «deberían tener el mismo color»).
 *
 *   MR-1  R-1, una opción equivocada: la ✗ se ve, y en el rojo de su caja.
 *   MR-2  R-1, la opción correcta: la ✓ se ve, y en el verde de su caja.
 *   MR-3  R-2, la opción elegida: la ✓ se ve, y en el verde de su caja.
 *
 * Control en los tres: el borde de la caja tiene el color esperado en ese momento (el instrumento lee bien los colores).
 *
 * ROJO ANTES QUE VERDE: con las reglas de color en las clases `correcto` e `incorrecto`, que nadie pone, la ✓ y la ✗ salen
 * en el negro del texto y caen los tres; sus controles pasan.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const VERDE = 'rgb(40, 167, 69)';
const ROJO = 'rgb(220, 53, 69)';

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

/** El padre arrancado, con la selección saludada, el español y la Aventura1 elegidos. */
async function arrancar(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 20_000 },
  );
  const f = seleccion(page);
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  await f.evaluate(() => { aventuraSeleccionada = 'Aventura1'; }); // eslint-disable-line no-undef
  return f;
}

/**
 * Marca una opción del reto (`r1` o `r2`), pulsa su botón y devuelve, en ese mismo instante, qué marca se ve junto a la
 * opción (la ✓ o la ✗), su color calculado y el color del borde de la caja. `cual`: 'correcta' o 'equivocada' (R-1), o
 * 'primera' (R-2).
 */
function contestar(f, reto, cual) {
  return f.evaluate(({ reto, cual }) => {
    const inputs = [...document.querySelectorAll(`input[name="reto-${reto}"]`)];
    // eslint-disable-next-line no-undef
    const correctas = reto === 'r1' ? (retoActualR1?.correctas || []) : [];
    const elegido = cual === 'correcta' ? inputs.find((i) => correctas.includes(i.value))
      : cual === 'equivocada' ? inputs.find((i) => !correctas.includes(i.value))
        : inputs[0];
    if (!elegido) return { error: `no hay opción ${cual} entre ${inputs.length}` };
    elegido.click();
    document.getElementById(`btn-verificar-reto-${reto}`).click();
    const opcion = elegido.closest('.respuesta');
    const visible = [opcion.querySelector('.tick'), opcion.querySelector('.x')].find((m) => m && getComputedStyle(m).display !== 'none');
    return {
      marca: visible?.textContent ?? null,
      colorMarca: visible ? getComputedStyle(visible).color : null,
      colorCaja: getComputedStyle(document.getElementById(`reto-${reto}-box`)).borderTopColor,
    };
  }, { reto, cual });
}

test.describe('MR — La ✓ y la ✗ de los retos de la selección, con el color de su caja', () => {
  test('MR-1. R-1, una opción equivocada: la ✗, en el rojo de su caja', async ({ page }) => {
    const f = await arrancar(page);
    await f.evaluate(() => mostrar(8)); // eslint-disable-line no-undef
    await expect.poll(() => f.evaluate(() => document.querySelectorAll('input[name="reto-r1"]').length), { timeout: 10_000 }).toBeGreaterThan(1);
    const r = await contestar(f, 'r1', 'equivocada');
    expect(r.error, 'hay una opción equivocada').toBeUndefined();
    expect(r.colorCaja, 'control: la caja, en rojo').toBe(ROJO);
    expect(r.marca).toBe('✗');
    expect(r.colorMarca, 'la ✗, en el rojo de su caja').toBe(ROJO);
  });

  test('MR-2. R-1, la opción correcta: la ✓, en el verde de su caja', async ({ page }) => {
    const f = await arrancar(page);
    await f.evaluate(() => mostrar(8)); // eslint-disable-line no-undef
    await expect.poll(() => f.evaluate(() => document.querySelectorAll('input[name="reto-r1"]').length), { timeout: 10_000 }).toBeGreaterThan(1);
    const r = await contestar(f, 'r1', 'correcta');
    expect(r.error, 'hay una opción correcta').toBeUndefined();
    expect(r.colorCaja, 'control: la caja, en verde').toBe(VERDE);
    expect(r.marca).toBe('✓');
    expect(r.colorMarca, 'la ✓, en el verde de su caja').toBe(VERDE);
  });

  test('MR-3. R-2, la opción elegida: la ✓, en el verde de su caja', async ({ page }) => {
    const f = await arrancar(page);
    await f.evaluate(() => { void cargarRetoR2(); }); // eslint-disable-line no-undef
    await expect.poll(() => f.evaluate(() => document.querySelectorAll('input[name="reto-r2"]').length), { timeout: 10_000 }).toBeGreaterThan(1);
    const r = await contestar(f, 'r2', 'primera');
    expect(r.error).toBeUndefined();
    expect(r.colorCaja, 'control: la caja, en verde').toBe(VERDE);
    expect(r.marca).toBe('✓');
    expect(r.colorMarca, 'la ✓, en el verde de su caja').toBe(VERDE);
  });
});
