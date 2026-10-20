/**
 * 150 — Los dos desplegables del mapa se abren enteros (estudio, R2.22)
 *
 * POR QUE EXISTE
 *
 * El selector del tipo de mapa y el del modo de la brújula crecen hacia arriba desde su botón y no tienen desplazamiento
 * interno (decisión del usuario). Su alto lo da `_alturaDisponibleParaDesplegable()` del padre: el hueco hasta la banda
 * blanca del logo (`#fondo-blanco`) menos la separación entre sus opciones, que es relativa a la pantalla. Tienen que
 * caber enteros en un iPhone con las barras de Safari (390×664), en un Android corriente (393×727) y con la app instalada
 * en el iPhone (390×844). El ordenador no es el destino de la app y no se comprueba aquí.
 *
 *   DE-1  En cada pantalla, cada desplegable abierto enseña todo su contenido: su alto visible es el de su contenido.
 *   DE-2  Y no tapa la banda del logo: su borde de arriba queda por debajo del borde de abajo de la banda.
 *
 * La banda del logo se enseña como al activarse la aventura (`_mostrarUIActivada`): es la que limita el hueco.
 *
 * ROJO ANTES QUE VERDE: con el margen fijo de 8 px, en 390×664 los dos se cortaban (127 de 130 px).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PANTALLAS = [
  { nombre: 'iPhone con las barras de Safari', width: 390, height: 664 },
  { nombre: 'Android corriente', width: 393, height: 727 },
  { nombre: 'iPhone con la app instalada', width: 390, height: 844 },
];
const DESPLEGABLES = [['selector-tipo-mapa', 'tipo de mapa'], ['brujula-modo', 'modo de la brújula']];

test.describe('DE — los desplegables del mapa caben enteros', () => {
  test.use({ serviceWorkers: 'block' });

  for (const pantalla of PANTALLAS) {
    test(`DE-1 y DE-2. ${pantalla.nombre} (${pantalla.width}×${pantalla.height})`, async ({ page }) => {
      await page.setViewportSize({ width: pantalla.width, height: pantalla.height });
      await page.addInitScript({ path: MAPLIBRE_STUB });
      await injectInitSpy(page);
      await stubCDNResources(page);
      await gotoAndWaitForFase1(page);
      await page.waitForFunction(() => !!document.getElementById('selector-tipo-mapa') && !!document.getElementById('brujula-modo'), null, { timeout: 30_000 });
      // La interfaz como al activarse la aventura: sin la pantalla de carga y con la banda del logo a la vista.
      await page.evaluate(() => {
        document.body.classList.remove('loading');
        document.getElementById('fondo-blanco').style.display = 'block';
      });

      for (const [id, nombre] of DESPLEGABLES) {
        await page.evaluate((i) => {
          const contenedor = document.getElementById(i);
          contenedor.style.display = 'flex';
          contenedor.children[0].click();
        }, id);
        const medir = () => page.evaluate((i) => {
          const desplegable = document.getElementById(i).children[1];
          return { visible: desplegable.clientHeight, contenido: desplegable.scrollHeight };
        }, id);
        // DE-1: el alto visible llega al del contenido (la transición de max-height dura 0,35 s).
        await expect.poll(async () => { const m = await medir(); return m.visible >= m.contenido; },
          { timeout: 5_000, message: `${nombre}: abierto, enseña todo su contenido` }).toBe(true);
        // DE-2: no tapa la banda del logo.
        const bordes = await page.evaluate((i) => ({
          arriba: document.getElementById(i).children[1].getBoundingClientRect().top,
          banda: document.getElementById('fondo-blanco').getBoundingClientRect().bottom,
        }), id);
        expect(bordes.arriba, `${nombre}: por debajo de la banda del logo`).toBeGreaterThanOrEqual(bordes.banda);
        await page.evaluate((i) => document.getElementById(i).children[0].click(), id);
      }
    });
  }
});
