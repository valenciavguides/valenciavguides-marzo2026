/**
 * 167 — El mapa antiguo, sin botones de zoom y con su ✗ entera, en los dos sitios donde sale
 *
 * POR QUE EXISTE
 *
 * Probado en un Android de verdad (usuario): los tres botones de arriba a la izquierda del mapa antiguo (−, + y ↺, este
 * último «restablecer el zoom») sobran, porque el mapa se acerca con los dedos, y la ✗ de arriba a la derecha sale
 * demasiado arriba, cortada por el borde. El mapa antiguo sale en dos sitios y los dos usan el mismo zoom
 * (`js/mapa-vintage-zoom.js`): el del padre, a pantalla completa, que pide hijo2 (`NAVEGACION.MOSTRAR_MAPA_VINTAGE`), y el
 * de la selección al elegir aventura (`#mapa-vintage-overlay`).
 *
 *   MA-1  En los dos sitios no hay controles de zoom (`.mapa-zoom-controles`).
 *   MA-2  En los dos sitios la ✗ cabe entera, con margen: al menos 8 px por debajo del borde de arriba de su capa (en el
 *         padre, por debajo de la muesca, `--gap-superior`) y 8 px antes del borde derecho. En vertical de móvil (390×844)
 *         y en 1920×1080.
 *   MA-3  Control: el zoom sigue (la rueda acerca el mapa).
 *   MA-4  El mapa no gira: su transformación solo desplaza y escala.
 *
 * ROJO ANTES QUE VERDE: con los botones de zoom y la ✗ pegada al borde (`top: var(--gap-superior)` en el padre; `top: 0`
 * en la selección), caen MA-1 y MA-2; MA-3 y MA-4 pasan antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const MARGEN_MINIMO = 8;

/** El mapa antiguo del padre, como lo pide hijo2: con los datos de la aventura cargados (Fase 2). */
async function abrirEnElPadre(page) {
  await gotoAndWaitForFase1(page);
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    await globalThis.__cargarDatosAventuraDiferidos();
    return globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.MOSTRAR_MAPA_VINTAGE', datos: {} });
  });
  await page.waitForFunction(() => {
    const o = document.getElementById('imagen-overlay');
    return !!o && getComputedStyle(o).display !== 'none' && !!o.querySelector('.mapa-a-pantalla-completa');
  }, null, { timeout: 15_000 });
  return {
    marco: page.mainFrame(),
    capa: '#imagen-overlay .mapa-a-pantalla-completa',
    equis: '#imagen-overlay .mapa-a-pantalla-completa .btn-cerrar-overlay',
    zoomable: '#galeria-wrapper',
    imagen: '#galeria-img',
  };
}

/** El mapa antiguo de la selección, al elegir aventura (el mismo camino que el spec 163). */
async function abrirEnLaSeleccion(page) {
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  await page.waitForFunction(() => getComputedStyle(document.getElementById('loading-overlay')).display === 'none', null, { timeout: 30_000 });
  const f = page.frames().find((x) => x.name() === 'seleccion');
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  await f.evaluate(() => mostrar(7));
  await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
  await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
  await f.waitForFunction(() => getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none', null, { timeout: 15_000 });
  return { marco: f, capa: '#mapa-vintage-wrapper', equis: '#mapa-vintage-wrapper > .btn-cerrar-overlay', zoomable: '#mapa-vintage-wrapper', imagen: '#mapa-vintage-img' };
}

/** Dónde queda la ✗ respecto de su capa y de la ventana de su documento, y cuántos controles de zoom hay en la capa. */
const medir = (sitio) => sitio.marco.evaluate(({ capa, equis }) => {
  const c = document.querySelector(capa).getBoundingClientRect();
  const x = document.querySelector(equis).getBoundingClientRect();
  const gapSuperior = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap-superior')) || 0;
  return {
    controles: document.querySelector(capa).closest('#imagen-overlay, #mapa-vintage-overlay').querySelectorAll('.mapa-zoom-controles').length,
    margenArriba: Math.round(x.top - Math.max(c.top, gapSuperior)),
    margenDerecha: Math.round(Math.min(c.right, innerWidth) - x.right),
    dentro: x.top >= 0 && x.left >= 0 && x.right <= innerWidth && x.bottom <= innerHeight,
  };
}, { capa: sitio.capa, equis: sitio.equis });

test.describe('MA — el mapa antiguo, sin botones de zoom y con su ✗ entera', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
  });

  for (const [donde, abrir] of [['el padre', abrirEnElPadre], ['la selección', abrirEnLaSeleccion]]) {
    for (const [ancho, alto] of [[390, 844], [1920, 1080]]) {
      test(`MA-1 y MA-2. En ${donde}, ${ancho}×${alto}: sin controles de zoom, y la ✗ entera y con margen`, async ({ page }) => {
        test.setTimeout(120_000);
        await page.setViewportSize({ width: ancho, height: alto });
        const sitio = await abrir(page);
        const m = await medir(sitio);
        expect.soft(m.controles, 'MA-1: ningún control de zoom').toBe(0);
        expect(m.dentro, `MA-2: la ✗ cabe entera en la pantalla (${JSON.stringify(m)})`).toBe(true);
        expect(m.margenArriba, 'MA-2: margen por arriba').toBeGreaterThanOrEqual(MARGEN_MINIMO);
        expect(m.margenDerecha, 'MA-2: margen por la derecha').toBeGreaterThanOrEqual(MARGEN_MINIMO);
      });
    }

    test(`MA-3 y MA-4. En ${donde}: la rueda acerca el mapa, y el mapa no gira`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const sitio = await abrir(page);
      // La rueda, con un WheelEvent en la propia página: Playwright no mueve la rueda en WebKit móvil (iphone12), y el zoom
      // solo lee del evento `deltaY` y el punto.
      await sitio.marco.evaluate((s) => {
        const img = document.querySelector(s);
        const r = img.getBoundingClientRect();
        img.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true, cancelable: true }));
      }, sitio.imagen);
      await expect.poll(() => sitio.marco.evaluate((s) => document.querySelector(s).dataset.zoom, sitio.zoomable), { timeout: 5_000, message: 'MA-3: la rueda acerca el mapa' })
        .toBe('120%');
      const transformacion = await sitio.marco.evaluate((s) => document.querySelector(s).style.transform, sitio.imagen);
      expect(transformacion, 'MA-4: solo desplaza y escala, sin girar').toMatch(/^translate3d\([^)]*\) scale\([^)]*\)$/);
    });
  }
});
