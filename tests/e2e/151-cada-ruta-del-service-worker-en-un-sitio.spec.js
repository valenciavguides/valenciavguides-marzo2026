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
 *
 * ROJO ANTES QUE VERDE: con `/audios-aventuras/` y `/videos-aventuras/` en `esMedia()`, SW-1 cae nombrando las dos.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '../..');

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
});
