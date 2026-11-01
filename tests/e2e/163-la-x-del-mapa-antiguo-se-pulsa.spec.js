/**
 * 163 — La ✗ del mapa antiguo de la selección se pulsa, y queda por encima de los carteles FREE DEMO y MODO DEV/CASA
 *
 * POR QUE EXISTE
 *
 * Al elegir aventura (P7), la selección enseña el mapa antiguo, y su ✗ lo cierra y lleva a P8. El mapa tiene zoom
 * (`js/mapa-vintage-zoom.js`): al pulsar dentro, el contenedor se queda el puntero para arrastrar la imagen. La ✗ está
 * dentro de ese contenedor, y un botón de dentro tiene que llevarse su clic: si el zoom le captura el puntero, el clic
 * llega al contenedor y la ✗ no cierra nada. Y la capa del mapa va por encima de los dos carteles de la selección (decisión
 * del usuario): con ellos encima, el de MODO DEV/CASA tapaba la esquina de la ✗ en las pantallas sin muesca, y FREE DEMO
 * la mitad de arriba de los botones del zoom.
 *
 * Todo con pulsaciones de verdad (ratón y dedo), nunca llamando a `cerrarMapaVintage()`: los specs que llaman a la
 * función no ven lo que se come el clic. El cartel MODO DEV/CASA es del modo de desarrollo (guía §24): aquí se enseña
 * poniéndole `display: block`, como hace la selección al activarlo, y solo se mira dónde se pinta.
 *
 *   MX-1  Ratón, 1920×1080: un clic en la ✗ cierra el mapa y la selección pasa a P8.
 *   MX-2  Dedo, 390×844: un toque en la ✗ hace lo mismo.
 *   MX-3  Con FREE DEMO y MODO DEV/CASA a la vista, la ✗ y los botones del zoom se pintan encima de ellos: donde un cartel
 *         se cruza con uno de esos botones, lo que hay arriba es el botón. Los dos casos existen: MODO DEV/CASA se cruza con
 *         la ✗, y FREE DEMO con los botones del zoom.
 *   MX-4  Control: al cerrar el mapa, los dos carteles se siguen viendo en P8.
 *   MX-5  Control: el zoom sigue: «+» acerca el mapa y arrastrar la imagen ampliada la mueve.
 *
 * ROJO ANTES QUE VERDE: con el zoom que capturaba el puntero en cualquier punto del mapa cae MX-1 (el clic llega al
 * contenedor y la ✗ no cierra); con la capa por debajo de los carteles cae MX-3. MX-2 pasa también con el zoom que
 * capturaba (medido en Chromium: con el dedo, la ✗ cerraba igual); vigila que el toque siga cerrando. MX-4 y MX-5 pasan
 * con los dos.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const EQUIS = '#mapa-vintage-wrapper > button[title="Cerrar mapa"]';

/** Arranca la app, elige idioma y aventura como en la selección, y espera al mapa antiguo a la vista. */
async function abrirMapaAntiguo(page, { dev = false } = {}) {
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  await page.waitForFunction(() => !document.body.classList.contains('loading'), null, { timeout: 30_000 });
  // La pantalla de carga del padre se desvanece en 0,5 s después de quitar `body.loading`, y mientras tanto sigue encima
  // de todo: un toque en ese medio segundo es suyo.
  await page.waitForFunction(() => getComputedStyle(document.getElementById('loading-overlay')).display === 'none', null, { timeout: 30_000 });
  const f = seleccion(page);
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  if (dev) await f.evaluate(() => { document.getElementById('_dev-badge').style.display = 'block'; });
  await f.evaluate(() => mostrar(7));
  await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
  await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
  await f.waitForFunction(() => getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none', null, { timeout: 15_000 });
  return f;
}

const mapaAbierto = (f) => f.evaluate(() => getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none');
const pantallaVisible = (f) => f.evaluate(() => document.querySelector('.pantalla.visible')?.id || null);

test.describe('MX — la ✗ del mapa antiguo de la selección', () => {
  test.beforeEach(async ({ page, context }) => {
    // La selección no enciende el GPS hasta la normativa; el permiso se da antes de abrir, por si acaso (Firefox).
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
  });

  test('MX-1. Ratón, 1920×1080: un clic en la ✗ cierra el mapa y lleva a P8', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    const f = await abrirMapaAntiguo(page);
    await page.frameLocator('#seleccion').locator(EQUIS).click();
    await expect.poll(() => mapaAbierto(f), { timeout: 5_000, message: 'el mapa antiguo sigue abierto tras el clic en su ✗' }).toBe(false);
    await expect.poll(() => pantallaVisible(f), { timeout: 5_000 }).toBe('pantalla8');
  });

  test.describe('con pantalla táctil', () => {
    test.use({ hasTouch: true });

    test('MX-2. Dedo, 390×844: un toque en la ✗ cierra el mapa y lleva a P8', async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width: 390, height: 844 });
      const f = await abrirMapaAntiguo(page);
      await page.frameLocator('#seleccion').locator(EQUIS).tap();
      await expect.poll(() => mapaAbierto(f), { timeout: 5_000, message: 'el mapa antiguo sigue abierto tras el toque en su ✗' }).toBe(false);
      await expect.poll(() => pantallaVisible(f), { timeout: 5_000 }).toBe('pantalla8');
    });
  });

  test('MX-3. Con los dos carteles a la vista, la ✗ y los botones del zoom se pintan encima de ellos', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    const f = await abrirMapaAntiguo(page, { dev: true });
    const cruces = await f.evaluate((equis) => {
      const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none'; };
      const carteles = [...document.querySelectorAll('.free-demo, #_dev-badge')].filter(visible);
      const botones = [document.querySelector(equis), ...document.querySelectorAll('.mapa-zoom-controles button')];
      const res = [];
      for (const b of botones) {
        const rb = b.getBoundingClientRect();
        for (const c of carteles) {
          const rc = c.getBoundingClientRect();
          const x1 = Math.max(rb.left, rc.left), y1 = Math.max(rb.top, rc.top);
          const x2 = Math.min(rb.right, rc.right), y2 = Math.min(rb.bottom, rc.bottom);
          if (x2 <= x1 || y2 <= y1) continue;
          // Con `pointer-events: none` (el de los carteles) `elementFromPoint` no los ve: se les quita un instante para
          // preguntar quién se pinta arriba.
          const antes = c.style.pointerEvents;
          c.style.setProperty('pointer-events', 'auto', 'important');
          const arriba = document.elementFromPoint((x1 + x2) / 2, (y1 + y2) / 2);
          c.style.pointerEvents = antes;
          res.push({ boton: b.getAttribute('title') || b.textContent.trim(), cartel: c.id || c.className, botonArriba: !!arriba && b.contains(arriba) });
        }
      }
      return { carteles: carteles.map((c) => c.id || c.className), res };
    }, EQUIS);
    expect(cruces.carteles, 'los dos carteles a la vista').toEqual(expect.arrayContaining(['free-demo', '_dev-badge']));
    expect(cruces.res.some((r) => r.boton === 'Cerrar mapa' && r.cartel === '_dev-badge'), 'el cartel MODO DEV/CASA se cruza con la ✗').toBe(true);
    expect(cruces.res.some((r) => r.cartel === 'free-demo'), 'FREE DEMO se cruza con los botones del zoom').toBe(true);
    for (const r of cruces.res) expect(r.botonArriba, `«${r.boton}» bajo «${r.cartel}»`).toBe(true);
  });

  test('MX-4. Control: al cerrar el mapa, los dos carteles se siguen viendo en P8', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    const f = await abrirMapaAntiguo(page, { dev: true });
    await f.evaluate((equis) => document.querySelector(equis).click(), EQUIS);
    await expect.poll(() => pantallaVisible(f), { timeout: 5_000 }).toBe('pantalla8');
    const vistos = await f.evaluate(() => ({
      freeDemo: getComputedStyle(document.querySelector('#pantalla8 .free-demo')).display !== 'none',
      dev: getComputedStyle(document.getElementById('_dev-badge')).display !== 'none',
    }));
    expect(vistos).toEqual({ freeDemo: true, dev: true });
  });

  test('MX-5. Control: «+» acerca el mapa y arrastrar la imagen ampliada la mueve', async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    const f = await abrirMapaAntiguo(page);
    const marco = page.frameLocator('#seleccion');
    await marco.locator('.mapa-zoom-controles button[data-zoom="mas"]').click();
    await expect.poll(() => f.evaluate(() => document.getElementById('mapa-vintage-wrapper').dataset.zoom), { timeout: 5_000 }).toBe('150%');
    const transformada = () => f.evaluate(() => document.getElementById('mapa-vintage-img').style.transform);
    const antes = await transformada();
    const caja = await marco.locator('#mapa-vintage-img').boundingBox();
    const cx = caja.x + caja.width / 2, cy = caja.y + caja.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 120, cy + 60, { steps: 6 });
    await page.mouse.up();
    await expect.poll(transformada, { timeout: 5_000, message: 'arrastrar la imagen ampliada no la ha movido' }).not.toBe(antes);
  });
});
