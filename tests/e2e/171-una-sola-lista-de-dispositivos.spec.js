/**
 * 171 — Una sola lista de tipos de dispositivo: PC, tableta o móvil (estudio, K-28)
 *
 * POR QUE EXISTE
 *
 * Qué cuenta como móvil se decidía con dos listas distintas: la de `js/device-detection.js` (el bus y el aviso de «gire el
 * móvil») y la de `js/proteccion.js`, más corta. Ninguna reconocía el iPad de iPadOS 13 o posterior, que se presenta
 * como un Mac: contaba como PC. Queda una, `tipoDeDispositivo()` de `js/device-detection.js`, y `esMovil()` y
 * `esTelefonoMovil()` salen de ella.
 *
 *   DL-1  `esMovil` se define en un solo sitio, `js/device-detection.js`.
 *   DL-2  Cada dispositivo de la tabla sale con su tipo, y `esMovil()` y `esTelefonoMovil()` dicen lo mismo que el tipo.
 *
 * ROJO ANTES QUE VERDE: con las dos listas, DL-1 cae (`proteccion.js` define la suya) y DL-2 cae entero
 * (`tipoDeDispositivo` no existe; y con la lista de entonces el iPad moderno salía como PC).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

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

/** [qué es, agente de usuario, puntos táctiles, tipo esperado] */
const CASOS = [
  ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1', 5, 'movil'],
  ['Android, teléfono', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36', 5, 'movil'],
  ['Android, tableta', 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 5, 'tablet'],
  ['Firefox en una tableta Android', 'Mozilla/5.0 (Android 14; Tablet; rv:128.0) Gecko/128.0 Firefox/128.0', 5, 'tablet'],
  ['iPad de antes de iPadOS 13', 'Mozilla/5.0 (iPad; CPU OS 12_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1', 5, 'tablet'],
  ['iPad de iPadOS 13 o posterior (se presenta como Mac)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15', 5, 'tablet'],
  ['Mac', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15', 0, 'pc'],
  ['Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 0, 'pc'],
];

test.describe('DL — una sola lista de dispositivos (estático)', () => {
  test('DL-1. esMovil se define en un solo sitio: js/device-detection.js', () => {
    expect(dondeCasa(/(?:const|let|var)\s+esMovil\s*=|function\s+esMovil\b/g)).toEqual([['js/device-detection.js', 1]]);
  });
});

test.describe('DL — cada dispositivo, con su tipo', () => {
  for (const [que, agente, puntos, esperado] of CASOS) {
    test(`DL-2. ${que}: ${esperado}`, async ({ browser }) => {
      const context = await browser.newContext({ userAgent: agente });
      try {
        const page = await context.newPage();
        // Manda el agente de usuario del caso: el `userAgentData` del proyecto (en pixel5, emulado como móvil) no casaría
        // con él, cosa que un aparato real no hace (los dos dicen lo mismo).
        await page.addInitScript((n) => {
          Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => n, configurable: true });
          Object.defineProperty(Navigator.prototype, 'userAgentData', { get: () => undefined, configurable: true });
        }, puntos);
        await page.goto('/sin-conexion.html');
        const r = await page.evaluate(() => import('/js/device-detection.js').then((m) => ({
          tipo: m.tipoDeDispositivo(),
          esMovil: m.esMovil(),
          esTelefonoMovil: m.esTelefonoMovil(),
        })));
        expect(r).toEqual({ tipo: esperado, esMovil: esperado !== 'pc', esTelefonoMovil: esperado === 'movil' });
      } finally {
        await context.close();
      }
    });
  }
});
