/**
 * 49-escalera-espera-imagen.spec.js
 *
 * Cobertura de la escalera de espera de imágenes (`_escaleraCargaImagen()` en
 * `codigo-padre.html`) y de la precarga que la hace innecesaria casi siempre
 * (`_precargarImagenParada()`). Ver docs/GUIA-COMPLETA.md §25.18.
 *
 * Los tres escalones: 4 s de gracia en silencio → spinner **mientras reintenta**
 * (uno cada 4 s, hasta 3) → rendición aplicando el placeholder transparente.
 *
 * Los cuatro tests de abajo cubren, cada uno, una trampa concreta que se detectó
 * midiendo y que dejaba la escalera inservible **sin dar ningún error**:
 *
 *   EI-1  Camino feliz: una imagen que carga rápido nunca enseña el spinner, y la
 *         escalera se retira sola (sin marca `data-vv-escalera` colgando).
 *   EI-2  Camino lento: la línea de tiempo real — silencio, spinner sostenido
 *         durante los tres reintentos, y rendición con `img-fallback`.
 *         Si alguien reintroduce el reintento dentro de `img.onerror`, la cascada
 *         consume los tres intentos en milisegundos y el spinner no llega a verse:
 *         este test lo caza porque exige spinner visible a los 8 s y a los 12 s.
 *   EI-3  El fallback global de imágenes rotas (listener de 'error' en captura sobre
 *         `document`) NO pisa una imagen gestionada por la escalera. Sin el guard de
 *         `data-vv-escalera`, sustituye el src por el SVG transparente, la imagen
 *         "carga" al instante y la escalera lo toma por éxito: cero reintentos.
 *   EI-4  `_precargarImagenParada()` calienta la caché al activar la parada.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Imagen real del proyecto: sirve para el camino feliz sin depender de la red.
const IMAGEN_RAPIDA = 'imagenes/imagenes-aplicación/logo-redondo.png';
const IMAGEN_LENTA = 'imagenes/imagenes-aventuras/__inexistente-para-test.jpg';

async function prepararPadre(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

/**
 * gotoAndWaitForFase1() vuelve cuando FASE 1 ha terminado, pero `_precargarImagenParada`
 * se expone desde Script 2, que corre después. Esperar a la función evita comprobarla
 * antes de que exista (medido: aparece a ~1,5 s).
 */
async function esperarScript2(page) {
  await page.waitForFunction(
    () => typeof globalThis._precargarImagenParada === 'function',
    null, { timeout: 15000 }
  );
}

/** Retiene indefinidamente las peticiones de imágenes de aventura. */
async function retenerImagenesDeAventura(page, contador) {
  await page.route('**/imagenes/imagenes-aventuras/**', async (route) => {
    contador.n++;
    await new Promise((r) => setTimeout(r, 60000));
    try { route.abort(); } catch { /* la página puede haberse cerrado ya */ }
  });
}

async function estadoGaleria(page) {
  return page.evaluate(() => {
    const w = document.getElementById('galeria-wrapper');
    const img = document.getElementById('galeria-img');
    return {
      spinner: w ? w.classList.contains('cargando') : null,
      fallback: img ? img.classList.contains('img-fallback') : null,
      marca: img ? img.dataset.vvEscalera === '1' : null,
      opacity: img ? img.style.opacity : null
    };
  });
}

test.describe('EI — Escalera de espera para imágenes (§25.18)', () => {
  test('EI-1. Imagen rápida: sin spinner, sin marca, visible de inmediato', async ({ page }) => {
    await prepararPadre(page);
    await page.evaluate((src) => { globalThis.mostrarImagenOverlay(src, 'test'); }, IMAGEN_RAPIDA);

    // Más allá de la gracia de 4s: si el spinner apareciera, sería un parpadeo injustificado.
    await page.waitForTimeout(5500);
    const st = await estadoGaleria(page);

    expect(st.spinner, 'una carga normal no debe enseñar spinner').toBe(false);
    expect(st.opacity, 'la imagen debe quedar visible').toBe('1');
    expect(st.marca, 'la escalera debe retirar su marca al terminar').toBe(false);
    expect(st.fallback, 'no debe aplicarse el placeholder de imagen rota').toBe(false);
  });

  test('EI-2. Imagen lenta: gracia, spinner sostenido mientras reintenta, y rendición', async ({ page }) => {
    const contador = { n: 0 };
    await retenerImagenesDeAventura(page, contador);
    const reintentos = [];
    page.on('console', (m) => {
      const t = m.text();
      // 'Espera larga' y no 'reintento' a secas: la línea final de rendición dice
      // "Sin cargar tras N reintentos" y contaría como uno más.
      if (t.includes('[PADRE][IMAGEN]') && t.includes('Espera larga')) reintentos.push(t);
    });

    await prepararPadre(page);
    await page.evaluate((src) => { globalThis.mostrarImagenOverlay(src, 'test'); }, IMAGEN_LENTA);

    // Escalón 1 — gracia: nada visible antes de los 4s.
    await page.waitForTimeout(2500);
    expect((await estadoGaleria(page)).spinner, 'dentro de la gracia no debe haber spinner').toBe(false);

    // Escalón 2 — el spinner aparece y SE MANTIENE durante los tres reintentos.
    // Los dos muestreos tardíos son los que cazan la cascada: si los reintentos se
    // consumieran de golpe, a los 8s ya se habría rendido.
    await page.waitForTimeout(3000); // ~5.5s
    expect((await estadoGaleria(page)).spinner, 'a los ~5s debe haber spinner').toBe(true);

    await page.waitForTimeout(3000); // ~8.5s
    expect((await estadoGaleria(page)).spinner, 'a los ~8s sigue reintentando').toBe(true);

    await page.waitForTimeout(4000); // ~12.5s
    expect((await estadoGaleria(page)).spinner, 'a los ~12s sigue reintentando').toBe(true);

    // Escalón 3 — rendición.
    await page.waitForTimeout(5000); // ~17.5s
    const fin = await estadoGaleria(page);
    expect(fin.spinner, 'tras rendirse el spinner desaparece').toBe(false);
    expect(fin.fallback, 'tras rendirse se aplica el placeholder').toBe(true);
    expect(fin.marca, 'tras rendirse se retira la marca de propiedad').toBe(false);
    expect(fin.opacity, 'el hueco se revela en vez de quedarse invisible').toBe('1');

    expect(reintentos.length, 'deben registrarse los 3 reintentos, uno por escalón').toBe(3);
  });

  test('EI-3. El fallback global no pisa una imagen gestionada por la escalera', async ({ page }) => {
    const contador = { n: 0 };
    await retenerImagenesDeAventura(page, contador);
    await prepararPadre(page);
    await page.evaluate((src) => { globalThis.mostrarImagenOverlay(src, 'test'); }, IMAGEN_LENTA);

    // Durante la gracia la imagen ya está marcada como propiedad de la escalera.
    await page.waitForTimeout(1500);
    const durante = await estadoGaleria(page);
    expect(durante.marca, 'la escalera marca la imagen como suya').toBe(true);
    expect(durante.fallback, 'el fallback global no debe haber intervenido').toBe(false);

    // Y en pleno reintento sigue sin intervenir, pese a los eventos 'error' que
    // provoca cada reasignación de src.
    await page.waitForTimeout(6000);
    const enReintento = await estadoGaleria(page);
    expect(enReintento.fallback, 'el fallback global sigue sin pisar la imagen').toBe(false);
    expect(enReintento.spinner, 'la escalera sigue viva').toBe(true);
  });

  test('EI-4. _precargarImagenParada() calienta la caché con las imágenes de la parada', async ({ page }) => {
    // Se invoca la función directamente en vez de a través de _hdl_NAVEGACION_CAMBIO_PARADA:
    // en este entorno las páginas hijas no completan el handshake (misma limitación que
    // documenta 12-carga-por-parada.spec.js), así que `paradaData` llega null desde hijo2 y
    // `paradaNormalized` —el argumento real de la precarga— nunca se resuelve.
    const pedidas = [];
    await page.route('**/imagenes/imagenes-aventuras/**', async (route) => {
      pedidas.push(route.request().url().split('/').pop());
      await route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from([]) });
    });
    await prepararPadre(page);
    await esperarScript2(page);

    await page.evaluate(() => {
      globalThis._precargarImagenParada({
        id: 'Av1-P-0',
        imagen: 'imagenes/imagenes-aventuras/uno.jpg',
        imagen2: 'imagenes/imagenes-aventuras/dos.jpg',
        imagenes: ['imagenes/imagenes-aventuras/uno.jpg', 'imagenes/imagenes-aventuras/tres.jpg']
      }, '[TEST]');
    });
    await page.waitForTimeout(800);

    expect(pedidas.sort(), 'precarga las 3 únicas, sin repetir la duplicada').toEqual(
      ['dos.jpg', 'tres.jpg', 'uno.jpg']
    );
  });

  test('EI-5. _precargarImagenParada() no falla con datos ausentes o vacíos', async ({ page }) => {
    await prepararPadre(page);
    await esperarScript2(page);
    const ok = await page.evaluate(() => {
      try {
        globalThis._precargarImagenParada(null, '[TEST]');
        globalThis._precargarImagenParada({}, '[TEST]');
        globalThis._precargarImagenParada({ imagen: '', imagen2: null, imagenes: 'no-es-array' }, '[TEST]');
        return true;
      } catch { return false; }
    });
    expect(ok, 'debe tolerar parada sin imágenes sin lanzar').toBe(true);
  });
});
