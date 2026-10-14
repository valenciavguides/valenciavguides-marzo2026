/**
 * 134 — Las páginas que abre hijo1 llevan la ✕ común, y la ✕ cierra su ventana
 *
 * POR QUE EXISTE
 *
 * Los iconos de «más opciones» de hijo1 abren cuatro páginas de la propia app (gastronomía, información, historia y
 * páginas oficiales) en otra ventana, con `window.open(url, '_blank')`. Sin una forma de cerrarla, quien entra en
 * una no tiene un botón para volver a la aventura. Llevan la ✕ común de la PWA (`.btn-cerrar-overlay` con
 * `.icono-x-cerrar`, de `css/boton-cerrar.css`), fija en la esquina, y la ✕ cierra la ventana.
 *
 *   PH-1  Cada página, abierta como la abre hijo1, muestra la ✕ común con su aspecto (fondo naranja y borde verde).
 *   PH-2  Pulsar la ✕ cierra esa ventana.
 *
 * ROJO ANTES QUE VERDE: sin la ✕, PH-1 no la encuentra en ninguna de las cuatro.
 */
'use strict';

const { test, expect } = require('@playwright/test');

const PAGINAS = ['gastronomia.html', 'consejos-valencia.html', 'videos-valencia-historica.html', 'paginas-oficiales-valencia.html'];

// Sin service worker: la página de partida, vacía, la sirve la ruta del test.
test.use({ serviceWorkers: 'block' });

/** Abre la página como la abre hijo1: window.open en otra ventana, desde una página del mismo origen. */
async function abrirComoHijo1(page, url) {
  await page.route('**/__spec134.html', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>spec 134</title>' }));
  await page.goto('/__spec134.html');
  const [ventana] = await Promise.all([
    page.waitForEvent('popup'),
    page.evaluate((u) => { globalThis.open(u, '_blank'); }, url),
  ]);
  await ventana.waitForLoadState('domcontentloaded');
  return ventana;
}

test.describe('PH — las páginas de hijo1 se cierran con la ✕', () => {
  for (const url of PAGINAS) {
    test(`PH-1/PH-2. ${url}: la ✕ común está y cierra la ventana`, async ({ page }) => {
      const ventana = await abrirComoHijo1(page, `/${url}`);
      const x = ventana.locator('.btn-cerrar-overlay.btn-cerrar-pagina');
      await expect(x).toHaveCount(1);
      await expect(x).toBeVisible();
      await expect(x.locator('.icono-x-cerrar')).toHaveCount(1);
      const estilo = await x.evaluate((el) => {
        const c = getComputedStyle(el);
        return { fondo: c.backgroundColor, borde: c.borderTopColor, posicion: c.position };
      });
      expect(estilo, 'la misma ✕ que el resto de la app, fija en la esquina').toEqual({
        fondo: 'rgb(242, 133, 0)', borde: 'rgb(80, 200, 120)', posicion: 'fixed',
      });
      const cerrada = ventana.waitForEvent('close', { timeout: 10_000 });
      // En firefox la ventana se cierra antes de que el clic de Playwright termine, y el clic protesta porque la
      // página ya no existe: es justo lo que se espera. Cualquier otro error del clic sí falla el test.
      await x.click({ noWaitAfter: true }).catch((e) => { if (!ventana.isClosed()) throw e; });
      await cerrada;
      expect(ventana.isClosed()).toBe(true);
    });
  }
});
