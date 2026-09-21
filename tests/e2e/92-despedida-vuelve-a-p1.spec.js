'use strict';

const { test, expect } = require('@playwright/test');

/**
 * DP — tras la despedida (P17 con ?despedida=1), el usuario vuelve a P1.
 *
 *   DP-1  al pulsar el botón final de los agradecimientos, la página sale de ?despedida=1 y
 *         carga codigo-padre.html
 *
 * POR QUÉ EXISTE
 *
 * `_ejecutarDespedida()` muestra la despedida, limpia los datos y vuelve a P1. Volvía con
 * `location.reload()`: recargaba la misma dirección, que sigue llevando `?despedida=1`, así que
 * `_checkUrlParams()` entraba otra vez en modo despedida, enseñaba P17 de nuevo y rearmaba la red
 * de seguridad. Un bucle del que el usuario solo salía cerrando la pestaña, y en la segunda
 * vuelta en español (la limpieza ya había borrado el idioma). MEDIDO en un recorrido real de la
 * Aventura 1: seis segundos después del botón final, la dirección seguía siendo ?despedida=1 y
 * lo visible era P17.
 *
 * ROJO ANTES QUE VERDE: con el código anterior, DP-1 cae — la URL no sale de ?despedida=1.
 */

test.describe('DP — la despedida devuelve a P1', () => {
  test('DP-1. El botón final de P17 lleva a codigo-padre.html, no de vuelta a la despedida', async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem('vv_idioma', 'en'); } catch (_) { /* */ }
    });
    await page.goto('/En-busca-del-tesoro.html?despedida=1');

    const contenido = page.locator('#agradecimientos-contenido');
    await expect(page.locator('#pantalla17')).toBeVisible({ timeout: 20_000 });
    await expect(contenido).not.toBeEmpty({ timeout: 20_000 });

    // Como un usuario: leer hasta el final para habilitar el botón
    const boton = page.locator('#btn-siguiente-agradecimientos');
    await expect.poll(async () => {
      await contenido.evaluate((el) => { el.scrollTop = el.scrollHeight; el.dispatchEvent(new Event('scroll')); });
      return boton.isEnabled();
    }, { timeout: 15_000 }).toBe(true);

    await boton.click();

    // Despedida (2 s), limpieza y salida hacia P1
    await page.waitForURL((u) => !u.search.includes('despedida'), { timeout: 20_000 });
    expect(new URL(page.url()).pathname).toBe('/codigo-padre.html');
  });
});
