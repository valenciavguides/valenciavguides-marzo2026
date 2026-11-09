/**
 * 155 — Una sola copia de cada ayudante (estudio, K-28)
 *
 * POR QUE EXISTE
 *
 * Un mismo algoritmo copiado en varios sitios da dos respuestas a la misma pregunta en cuanto una copia cambia y la otra
 * no. K-28 reduce esas familias, una a una, a una sola definición en `js/`; este spec vigila que no vuelvan y, donde las
 * copias no hacían lo mismo, que la diferencia se ve.
 *
 *   UC-1  `sleep`: la define solo `js/utils.js` entre los ficheros que ejecuta el navegador, y nadie la publica en
 *         `globalThis`.
 *   UC-2  Escapar HTML: el mapa de escape está una sola vez, en `escaparHTML` de `js/utils.js`.
 *   UC-3  La galería de imágenes escapa como el resto: un nombre con comillas dobles llega entero al `alt` de la imagen.
 *   UC-4  Control: el título del texto de la galería con etiquetas sale como texto (lo escapaban ya las dos maneras).
 *   UC-5  El historial: la entrada que intercepta «atrás» la apila una sola función del padre (`history.pushState` en
 *         un solo sitio).
 *
 * ROJO ANTES QUE VERDE: con las copias del padre, UC-2 cae; con la galería escapando por `textContent`/`innerHTML`, que no
 * escapa las comillas, UC-3 cae (el `alt` se corta en la primera comilla). UC-4 pasa con las dos. Con el apilado del
 * «atrás» escrito en sus tres sitios (la activación, la reanudación y el propio escucha de `popstate`), UC-5 cae.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const RAIZ = path.resolve(__dirname, '../..');

/** Los ficheros que ejecuta el navegador: los HTML de la raíz y js/*.js (sin el servidor de desarrollo). */
const ficherosDeProduccion = () => [
  ...fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html')),
  ...fs.readdirSync(path.join(RAIZ, 'js')).filter((f) => f.endsWith('.js') && f !== 'server.js').map((f) => `js/${f}`),
];

/** Los ficheros en los que `patron` (global) casa, con cuántas veces. */
const dondeCasa = (patron) => ficherosDeProduccion()
  .map((rel) => [rel, (fs.readFileSync(path.join(RAIZ, rel), 'utf8').match(patron) || []).length])
  .filter(([, n]) => n > 0);

test.describe('UC — una sola copia de cada ayudante (estático)', () => {
  test('UC-1. sleep se define solo en js/utils.js y no se publica en globalThis', () => {
    expect(dondeCasa(/function\s+sleep\s*\(|(?:const|let|var)\s+sleep\s*=/g)).toEqual([['js/utils.js', 1]]);
    expect(dondeCasa(/globalThis\.sleep\s*=(?!=)/g)).toEqual([]);
  });

  test('UC-2. El mapa de escape de HTML está una sola vez, en js/utils.js', () => {
    expect(dondeCasa(/'&#39;'/g)).toEqual([['js/utils.js', 1]]);
  });

  test('UC-5. La entrada del historial que intercepta «atrás» la apila una sola función del padre', () => {
    expect(dondeCasa(/history\.pushState\(/g)).toEqual([['codigo-padre.html', 1]]);
  });
});

test.describe('UC — la galería escapa como el resto', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  /** Abre la galería con un nombre y un texto, y lee en el acto lo que ha pintado. */
  const abrirGaleria = (page, nombre, tituloTexto) => page.evaluate(({ n, t }) => {
    globalThis.mostrarImagenOverlay('imagenes-aplicacion-inexistente.jpg', n, null, { title: t, content: '<p>texto</p>' });
    return {
      alt: document.getElementById('galeria-img')?.getAttribute('alt') ?? null,
      titulo: document.querySelector('#imagen-overlay .texto-parada-titulo')?.textContent ?? null,
    };
  }, { n: nombre, t: tituloTexto });

  test('UC-3. Un nombre con comillas dobles llega entero al alt de la imagen', async ({ page }) => {
    const r = await abrirGaleria(page, 'Puerta "del" Mar', 'Puerta del Mar');
    expect(r.alt).toBe('Puerta "del" Mar');
  });

  test('UC-4. Control: el título del texto con etiquetas sale como texto', async ({ page }) => {
    const r = await abrirGaleria(page, 'Plaza', '<b>Plaza</b> & Lonja');
    expect(r.titulo).toBe('<b>Plaza</b> & Lonja');
  });
});
