/**
 * 142-almacenamiento-una-sola-puerta.spec.js
 *
 * Todo lo que la app guarda en el dispositivo pasa por `js/almacenamiento.js` (`globalThis.almacen`): nunca lanza, dice cada
 * fallo una vez y solo acepta las claves registradas en `almacen.CLAVES` (estudio R2.10.7).
 *
 *   AL-1  Con el almacenamiento bloqueado (tocar localStorage o sessionStorage lanza SecurityError, como con las cookies
 *         bloqueadas), el padre arranca entero y dice el fallo; una segunda lectura de la misma clave no lo repite, y una
 *         escritura que falla sale como error.
 *   AL-2  Una aventura guardada que no es JSON válido: al arrancar, el padre la descarta y lo dice con un error.
 *   AL-3  Una clave que no está en `almacen.CLAVES` ni se escribe ni se lee, y se dice.
 *   AL-4  Las siete páginas que tocan el almacenamiento (el padre, la selección y hijo1 a hijo5) cargan
 *         `js/almacenamiento.js` antes que cualquier script que lo use, el service worker lo precarga, y las otras cuatro
 *         (hijo6, el mapa completo, el puzzle y el vídeo de introducción) no tocan el almacenamiento.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen AL-1, AL-2 y AL-3 (no había almacén: los fallos no se decían y la
 * aventura rota se quedaba guardada) y AL-4 con las páginas anteriores (no cargaban el fichero).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const RAIZ = path.resolve(__dirname, '../..');

async function arrancar(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

/** Recoge los mensajes de consola del almacén, de todos los frames: «tipo texto». */
function escucharAlmacen(page) {
  const mensajes = [];
  page.on('console', (m) => { if (m.text().includes('[ALMACEN]')) mensajes.push(`${m.type()} ${m.text()}`); });
  return mensajes;
}

test.describe('AL — El almacenamiento del dispositivo, por una sola puerta', () => {
  test('AL-1. Con el almacenamiento bloqueado, la app arranca y dice el fallo una vez', async ({ page }) => {
    const mensajes = escucharAlmacen(page);
    const erroresSinCapturar = [];
    page.on('pageerror', (e) => erroresSinCapturar.push(e.message));
    await page.addInitScript(() => {
      for (const nombre of ['localStorage', 'sessionStorage']) {
        Object.defineProperty(globalThis, nombre, {
          configurable: true,
          get() { throw new DOMException('The operation is insecure.', 'SecurityError'); },
        });
      }
    });
    await arrancar(page);

    expect(await page.evaluate(() => globalThis.sistemaInicializado === true), 'el padre arranca entero').toBe(true);
    expect(erroresSinCapturar.filter((t) => /insecure|SecurityError/i.test(t)), 'ningún fallo del almacenamiento sin capturar').toEqual([]);
    // js/proteccion.js lee vv_debug al cargarse, en el padre y en cada frame que lo carga.
    expect(mensajes.some((t) => t.startsWith('warning') && t.includes("local.leer('vv_debug')") && t.includes('SecurityError')),
      'la lectura fallida se dice').toBe(true);

    // Una vez: en el padre, otras dos lecturas de la misma clave no añaden ningún aviso.
    const antes = mensajes.length;
    await page.evaluate(() => {
      globalThis.almacen.local.leer(globalThis.almacen.CLAVES.DEBUG);
      globalThis.almacen.local.leer(globalThis.almacen.CLAVES.DEBUG);
    });
    // VENTANA-OBSERVACION: las dos lecturas no añaden ningún aviso (algo que NO debe ocurrir).
    await page.waitForTimeout(300);
    expect(mensajes.length, 'sin avisos repetidos').toBe(antes);

    // Una escritura que falla devuelve false y sale como error.
    expect(await page.evaluate(() => globalThis.almacen.local.escribir(globalThis.almacen.CLAVES.IDIOMA, 'fr'))).toBe(false);
    await expect.poll(() => mensajes.some((t) => t.startsWith('error') && t.includes("local.escribir('vv_idioma')"))).toBe(true);
  });

  test('AL-2. Una aventura guardada rota se descarta al arrancar, y se dice', async ({ page }) => {
    const mensajes = escucharAlmacen(page);
    await page.addInitScript(() => {
      // Una sola vez por pestaña: los iframes y las recargas no la vuelven a sembrar.
      if (!sessionStorage.getItem('__al2_sembrada')) {
        localStorage.setItem('vv_aventura_iniciada', '{rota');
        sessionStorage.setItem('__al2_sembrada', '1');
      }
    });
    await arrancar(page);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('vv_aventura_iniciada')), { timeout: 10_000 }).toBeNull();
    expect(mensajes.some((t) => t.startsWith('error') && t.includes("leerJSON('vv_aventura_iniciada')")), 'y lo dice con un error').toBe(true);
  });

  test('AL-3. Una clave fuera de almacen.CLAVES ni se escribe ni se lee', async ({ page }) => {
    const mensajes = escucharAlmacen(page);
    await arrancar(page);
    const r = await page.evaluate(() => ({
      escrito: globalThis.almacen.local.escribir('clave_inventada', 'x'),
      leido: globalThis.almacen.local.leer('clave_inventada'),
      enElDispositivo: localStorage.getItem('clave_inventada'),
    }));
    expect(r).toEqual({ escrito: false, leido: null, enElDispositivo: null });
    await expect.poll(() => mensajes.some((t) => t.startsWith('error') && t.includes('clave_inventada') && t.includes('CLAVES'))).toBe(true);
  });

  test('AL-4. Las páginas que tocan el almacenamiento cargan el fichero antes que nada que lo use', () => {
    const conAlmacen = ['codigo-padre.html', 'En-busca-del-tesoro.html', 'extrainfo-hijo1.html', 'coordenadas-hijo2.html',
      'audio-hijo3.html', 'retos-hijo4.html', 'boton-casa-hijo5.html'];
    const ETIQUETA = '<script src="js/almacenamiento.js"></script>';
    for (const pagina of conAlmacen) {
      const html = fs.readFileSync(path.join(RAIZ, pagina), 'utf8');
      const i = html.indexOf(ETIQUETA);
      expect(i, `${pagina} carga js/almacenamiento.js`).toBeGreaterThan(-1);
      for (const marca of ['<script src="js/proteccion.js"', '<script src="js/suppress-warnings.js"', 'globalThis.almacen']) {
        const j = html.indexOf(marca);
        if (j > -1) expect(i, `${pagina}: antes que ${marca}`).toBeLessThan(j);
      }
    }
    for (const pagina of ['chat-hijo6.html', 'mapa-completo.html', 'puzzle.html', 'video-intro.html']) {
      const html = fs.readFileSync(path.join(RAIZ, pagina), 'utf8');
      for (const marca of ['localStorage', 'sessionStorage', 'globalThis.almacen', 'js/proteccion.js', 'js/suppress-warnings.js']) {
        expect(html.includes(marca), `${pagina} no toca el almacenamiento (${marca}); si lo toca, tiene que cargar ${ETIQUETA}`).toBe(false);
      }
    }
    expect(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8').includes("'/js/almacenamiento.js'"), 'el service worker lo precarga').toBe(true);
  });
});
