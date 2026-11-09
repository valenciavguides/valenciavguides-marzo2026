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
 *   UC-6  La vibración: una sola llamada a `navigator.vibrate`, la de `vibrar()` de `js/utils.js` (300 ms), para el
 *         padre, hijo4 y la selección.
 *   UC-7  Las frases que rotan en las pantallas de carga: un solo algoritmo, `rotarFrasesDeCarga` de `js/utils.js`.
 *   UC-8  La del padre (`#loading-frase-carga`): rota con las frases del idioma y, al parar, no vuelve ninguna.
 *   UC-9  La de arrancar una aventura en la selección (`#carga-progreso-frase`): lo mismo.
 *   UC-10 Los fuegos artificiales en canvas (el puzzle al resolverse, la escena final del vídeo de introducción): un solo
 *         motor, `lanzarFuegosArtificiales` de `js/utils.js`, cada uno con sus números.
 *   UC-11 El código de desarrollador: una sola ventana y un solo hash, `pedirCodigoDev` y `esCodigoDev` de `js/utils.js`.
 *   UC-12 a UC-14 Las tres ventanas (el modo desarrollador del padre, el panel de registros y el modo desarrollador de la
 *         selección), abiertas por su camino real: su título, su capa y su fondo; un código malo dice «Código
 *         incorrecto» y vacía el campo; Escape la cierra.
 *
 * ROJO ANTES QUE VERDE: con las copias del padre, UC-2 cae; con la galería escapando por `textContent`/`innerHTML`, que no
 * escapa las comillas, UC-3 cae (el `alt` se corta en la primera comilla). UC-4 pasa con las dos. Con el apilado del
 * «atrás» escrito en sus tres sitios (la activación, la reanudación y el propio escucha de `popstate`), UC-5 cae; con las
 * tres vibraciones (el padre a 200 ms, hijo4 y la selección a 300), UC-6; con las dos copias de las frases de carga, UC-7, y
 * UC-8 y UC-9: las dos dejaban pendiente el fundido al parar, y la frase volvía a pintarse. Con los dos motores de fuegos
 * artificiales (el puzzle y video-intro), UC-10; con las tres ventanas del código y las dos copias del hash, UC-11.
 * UC-12 a UC-14 pasan con las dos: vigilan que juntarlas no cambia nada.
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

  test('UC-6. La vibración tiene un solo sitio: vibrar() de js/utils.js', () => {
    expect(dondeCasa(/\.vibrate\s*(?:\?\.)?\(/g)).toEqual([['js/utils.js', 1]]);
  });

  test('UC-7. Las frases que rotan en las pantallas de carga: un solo algoritmo, rotarFrasesDeCarga de js/utils.js', () => {
    expect(dondeCasa(/\(idx \+ 1\) % \w+\.length/g)).toEqual([['js/utils.js', 1]]);
  });

  test('UC-10. Los fuegos artificiales en canvas: un solo motor, lanzarFuegosArtificiales de js/utils.js', () => {
    expect(dondeCasa(/\.shadowBlur\s*=/g)).toEqual([['js/utils.js', 1]]);
  });

  test('UC-11. El código de desarrollador: una sola ventana y un solo hash, en js/utils.js', () => {
    expect(dondeCasa(/type="password"/g)).toEqual([['js/utils.js', 1]]);
    expect(dondeCasa(/CODIGO_DEV_HASH\s*=/g)).toEqual([['js/utils.js', 1]]);
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

test.describe('UC — las frases de carga, en las dos pantallas', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  /** El banco de frases de carga en español. */
  const banco = (page) => page.evaluate(async () => (await import('/js/traducciones-ui.js')).TRADUCCIONES_REANUDACION.es.frasesCarga);

  test('UC-8. La del padre: rota con las frases del idioma y, al parar, no vuelve ninguna', async ({ page }) => {
    const frases = await banco(page);
    const frase = page.locator('#loading-frase-carga');
    await page.evaluate(() => globalThis.showParentLoadingOverlay('', '', 8, 'es'));
    await expect.poll(() => frase.textContent()).not.toBe('');
    expect(frases).toContain(await frase.textContent());
    // Parar justo después de pedir otra: el fundido pendiente (400 ms) no puede volver a pintarla.
    await page.evaluate(() => { globalThis.showParentLoadingOverlay('', '', 8, 'es'); globalThis.hideParentLoadingOverlay(); });
    // VENTANA-OBSERVACION: comprobar que ninguna frase vuelve a pintarse después de parar no admite poll.
    await page.waitForTimeout(700);
    expect(await frase.textContent()).toBe('');
  });

  test('UC-9. La de arrancar una aventura (la selección): rota con las frases del idioma y, al parar, no vuelve ninguna', async ({ page }) => {
    const frases = await banco(page);
    const sel = page.frame({ name: 'seleccion' });
    expect(sel, 'el iframe de la selección').toBeTruthy();
    await sel.waitForFunction(() => typeof mostrarOverlayCargaAventura === 'function' && !!globalThis.TRADUCCIONES_REANUDACION);
    const frase = sel.locator('#carga-progreso-frase');
    await sel.evaluate(() => { idiomaSeleccionado = 'es'; mostrarOverlayCargaAventura(); });
    await expect.poll(() => frase.textContent()).not.toBe('');
    expect(frases).toContain(await frase.textContent());
    await sel.evaluate(() => { mostrarOverlayCargaAventura(); ocultarOverlayCargaAventura(); });
    // VENTANA-OBSERVACION: comprobar que ninguna frase vuelve a pintarse después de parar no admite poll.
    await page.waitForTimeout(700);
    expect(await frase.textContent()).toBe('');
  });
});

test.describe('UC — las tres ventanas del código de desarrollador', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  /**
   * Abre una ventana por su camino real y la prueba sin mirar sus ids: el título, la capa y el fondo; un código malo
   * dice «Código incorrecto» y vacía el campo; Escape la cierra.
   */
  const probarVentana = async (frame, abrir, esperado) => {
    await abrir();
    const campo = frame.locator('input[type="password"]');
    await expect(campo).toHaveCount(1);
    const datos = await campo.evaluate((el) => {
      let o = el; while (o && getComputedStyle(o).position !== 'fixed') o = o.parentElement;
      const cs = getComputedStyle(o);
      return { titulo: o.querySelector('p')?.textContent, capa: cs.zIndex, fondo: cs.backgroundColor };
    });
    expect(datos).toEqual(esperado);
    await campo.fill('no-es-el-codigo');
    await campo.evaluate((el) => {
      let o = el; while (o && getComputedStyle(o).position !== 'fixed') o = o.parentElement;
      [...o.querySelectorAll('button')].find((b) => b.textContent.trim() === 'OK').click();
    });
    await expect(frame.getByText('Código incorrecto')).toBeVisible();
    expect(await campo.inputValue()).toBe('');
    await campo.press('Escape');
    await expect(campo).toHaveCount(0);
  };

  test('UC-12. La del modo desarrollador del padre', async ({ page }) => {
    await probarVentana(page, () => page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'CONTROL.DEV_CINCO_TOQUES', datos: {} })),
      { titulo: '🔧 Modo desarrollador', capa: '9999999', fondo: 'rgba(0, 0, 0, 0.8)' });
  });

  test('UC-13. La del panel de registros del padre (siete toques)', async ({ page }) => {
    await probarVentana(page, () => page.evaluate(() => { for (let i = 0; i < 7; i++) document.dispatchEvent(new MouseEvent('click', { bubbles: true })); }),
      { titulo: '🔧 Panel de logs (código dev)', capa: '2000010', fondo: 'rgba(0, 0, 0, 0.8)' });
  });

  test('UC-14. La del modo desarrollador de la selección (Ctrl+Alt+clic en el logo de P1)', async ({ page }) => {
    const sel = page.frame({ name: 'seleccion' });
    expect(sel, 'el iframe de la selección').toBeTruthy();
    await probarVentana(sel, () => sel.evaluate(() => document.querySelector('#pantalla1 .logo-circular-bg')
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true, ctrlKey: true, altKey: true, button: 0 }))),
      { titulo: '🔧 Modo desarrollador', capa: '9999999', fondo: 'rgba(0, 0, 0, 0.85)' });
  });
});
