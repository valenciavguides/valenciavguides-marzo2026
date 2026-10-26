/**
 * 151 — Cada ruta de media la decide un solo sitio del service worker (estudio, K-127)
 *
 * POR QUE EXISTE
 *
 * El manejador `fetch` de `sw.js` deja ir directos a red, sin interceptar, los audios y los vídeos (las peticiones Range
 * no se cachean), y solo después pregunta a `esMedia()` qué imágenes se guardan con Cache First. Una carpeta que estuviera
 * en las dos listas sería una rama que no corre nunca: dos sitios diciendo cosas distintas de la misma ruta, y el que se lee
 * después no es el que manda.
 *
 *   SW-1  Ninguna carpeta de `esMedia()` es de las que el manejador ya ha dejado ir a red. Las dos listas se leen enteras:
 *         cada `startsWith(` de `esMedia()` y cada vuelta temprana del manejador tiene que haber casado.
 *   SW-2  La imagen del aviso de sin conexión del padre (`_ensureInternetOverlay`) está en la precarga (`APP_SHELL`): el
 *         aviso sale justo cuando no hay red, y una imagen que no se guardó antes no se puede descargar entonces.
 *   SW-3  La precarga no trae nada de lo que el servidor protege (`PROTECTED_FILES` de `js/server.js`, la misma lista): los
 *         datos de pago se descargan cuando la app los importa, tras el pago, nunca al instalarse el service worker.
 *   SW-4  Lo que cargan las páginas de la precarga también está en ella: sus `<script src>`, sus hojas de estilo y los
 *         imports estáticos de sus páginas y de sus módulos. Lo que falte no llega al arrancar sin red. Cada etiqueta se
 *         tiene que haber leído; los imports dinámicos (los datos de pago, entre ellos) no cuentan.
 *
 * ROJO ANTES QUE VERDE: con `/audios-aventuras/` y `/videos-aventuras/` en `esMedia()`, SW-1 cae nombrando las dos; sin la
 * imagen en `APP_SHELL`, SW-2 cae nombrándola; con los ficheros de datos de pago en `APP_SHELL`, SW-3 cae nombrándolos; sin
 * el zoom de los mapas antiguos en `APP_SHELL` (los cargan el padre y la selección), SW-4 cae nombrando sus dos ficheros.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '../..');

/** Las entradas de `APP_SHELL` de sw.js, todas: si alguna no se lee, falla aquí y no en el test que la usa. */
function precargaDelServiceWorker() {
  const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8').replace(/\r\n/g, '\n');
  const lista = /const APP_SHELL = \[([\s\S]*?)\];/.exec(sw)?.[1] ?? '';
  const precarga = [...lista.matchAll(/^\s*'([^']+)',/gm)].map((m) => m[1]);
  expect(precarga.length, 'APP_SHELL se ha leído').toBeGreaterThan(0);
  expect(precarga.length, 'cada entrada de APP_SHELL se ha leído').toBe((lista.match(/^\s*'/gm) || []).length);
  return precarga;
}

test.describe('SW — cada ruta de media en un solo sitio del service worker', () => {
  test('SW-1. Ninguna carpeta de esMedia() es de las que el manejador deja ir antes a red', () => {
    const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8').replace(/\r\n/g, '\n');
    const cuerpo = /function esMedia\(url\) \{([\s\S]*?)\n\}/.exec(sw)?.[1] ?? '';
    const enMedia = [...cuerpo.matchAll(/p\.startsWith\('([^']+)'\)/g)].map((m) => m[1]);
    expect(enMedia.length, 'esMedia() nombra alguna carpeta').toBeGreaterThan(0);
    expect(enMedia.length, 'cada startsWith( de esMedia() se ha leído').toBe((cuerpo.match(/startsWith\(/g) || []).length);

    const manejador = /self\.addEventListener\('fetch'[\s\S]*$/.exec(sw)?.[0] ?? '';
    const directos = [...manejador.matchAll(/if \(url\.pathname\.startsWith\('([^']+)'\)\) return;/g)].map((m) => m[1]);
    expect(directos.length, 'el manejador deja ir alguna carpeta directa a red').toBeGreaterThan(0);
    expect(directos.length, 'cada vuelta temprana del manejador se ha leído').toBe((manejador.match(/startsWith\([^)]*\)\) return;/g) || []).length);

    const muertas = enMedia.filter((p) => directos.some((d) => p.startsWith(d)));
    expect(muertas, 'carpetas de esMedia() que el manejador ya ha dejado ir a red: esa rama no corre nunca').toEqual([]);
  });
  test('SW-2. La imagen del aviso de sin conexión está en la precarga: el aviso sale justo cuando no hay red', () => {
    const padre = fs.readFileSync(path.join(RAIZ, 'codigo-padre.html'), 'utf8').replace(/\r\n/g, '\n');
    const aviso = /function _ensureInternetOverlay\(\) \{([\s\S]*?)\n {8}\}/.exec(padre)?.[1] ?? '';
    const imagenes = [...aviso.matchAll(/\.src = '([^']+)'/g)].map((m) => m[1]);
    expect(imagenes, 'el aviso de sin conexión enseña una imagen').toHaveLength(1);

    expect(precargaDelServiceWorker(), `${imagenes[0]}: en APP_SHELL`).toContain(`/${imagenes[0]}`);
  });
  test('SW-3. La precarga no trae nada de lo protegido: los datos de pago se descargan al importarlos, tras el pago', () => {
    const servidor = fs.readFileSync(path.join(RAIZ, 'js/server.js'), 'utf8').replace(/\r\n/g, '\n');
    const lista = /const PROTECTED_FILES = \[([\s\S]*?)\];/.exec(servidor)?.[1] ?? '';
    const protegidos = [...lista.matchAll(/^\s*'([^']+)'/gm)].map((m) => m[1]);
    expect(protegidos.length, 'PROTECTED_FILES se ha leído').toBeGreaterThan(0);
    expect(protegidos.length, 'cada entrada de PROTECTED_FILES se ha leído').toBe((lista.match(/^\s*'/gm) || []).length);

    const enPrecarga = precargaDelServiceWorker().filter((u) => protegidos.some((p) => u.toLowerCase().startsWith(p.toLowerCase())));
    expect(enPrecarga, 'ficheros protegidos en APP_SHELL: se descargarían al instalar la app, antes de pagar').toEqual([]);
  });
  test('SW-4. Lo que cargan las páginas de la precarga está en la precarga: sus scripts, sus hojas de estilo y sus imports estáticos', () => {
    const precarga = precargaDelServiceWorker();
    const leer = (u) => fs.readFileSync(path.join(RAIZ, decodeURIComponent(u)), 'utf8');
    const resolver = (ref, desde) => decodeURIComponent(new URL(ref, `http://x${desde}`).pathname);
    const externa = (ref) => /^(https?:)?\/\//i.test(ref) || ref.startsWith('data:');
    const faltan = new Set();
    for (const pagina of precarga.filter((u) => u.endsWith('.html'))) {
      const html = leer(pagina);
      const scripts = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
      expect(scripts.length, `${pagina}: cada <script src> se ha leído`).toBe((html.match(/<script\b[^>]*\bsrc\s*=/gi) || []).length);
      const hojas = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).filter((t) => /\brel\s*=\s*["']?stylesheet\b/i.test(t));
      const estilos = hojas.map((t) => /\bhref\s*=\s*["']([^"']+)["']/i.exec(t)?.[1]);
      expect(estilos.filter((h) => !h), `${pagina}: cada hoja de estilo se ha leído`).toEqual([]);
      for (const ref of [...scripts, ...estilos]) if (!externa(ref) && !precarga.includes(resolver(ref, pagina))) faltan.add(resolver(ref, pagina));
    }
    for (const fichero of precarga.filter((u) => u.endsWith('.html') || u.endsWith('.js'))) {
      for (const m of leer(fichero).matchAll(/^\s*(?:import\s[^'"();]*?from\s*|import\s*)['"]([^'"]+)['"]/gm)) {
        if (!externa(m[1]) && !precarga.includes(resolver(m[1], fichero))) faltan.add(resolver(m[1], fichero));
      }
    }
    expect([...faltan], 'lo carga una página de la precarga y no está en ella: al arrancar sin red no llega').toEqual([]);
  });
});
