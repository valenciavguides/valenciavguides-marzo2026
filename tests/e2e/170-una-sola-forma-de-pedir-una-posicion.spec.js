/**
 * 170 — Una sola forma de pedir una posición suelta al GPS (estudio, K-17)
 *
 * POR QUE EXISTE
 *
 * El padre pedía una posición puntual en cinco sitios, cada uno con su promesa o sus callbacks, y el diagnóstico del GPS
 * en otro: seis copias de la misma llamada. Queda una, `pedirPosicionPuntual` de `js/utils.js`; cada sitio conserva su
 * plazo y lo que hace con la lectura.
 *
 *   PP-1  `getCurrentPosition` se llama en un solo sitio de lo que ejecuta el navegador: `js/utils.js`.
 *   PP-2  El reintento de la pantalla de sin señal pide la posición con 15 s fijos (los de su cuenta atrás).
 *   PP-3  El reintento de las pantallas de distancia la pide con 5 s ajustados a la conexión.
 *
 * ROJO ANTES QUE VERDE: con las seis copias, PP-1 cae (cinco en el padre y una en js/funciones-mapa.js). PP-2 y PP-3
 * pasan con las dos: vigilan que juntar las copias no cambia los plazos.
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

test.describe('PP — una sola forma de pedir una posición (estático)', () => {
  test('PP-1. getCurrentPosition se llama en un solo sitio: js/utils.js', () => {
    expect(dondeCasa(/\.getCurrentPosition\(/g)).toEqual([['js/utils.js', 1]]);
  });
});

test.describe('PP — los plazos de los reintentos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  /** Apunta las opciones de cada petición de posición (sin contestar ninguna) y pone la aventura en marcha. */
  const apuntarPeticiones = (page) => page.evaluate(() => {
    globalThis.__opcionesPedidas = [];
    navigator.geolocation.getCurrentPosition = (_ok, _error, opciones) => { globalThis.__opcionesPedidas.push(opciones); };
    globalThis.estado.modo = globalThis.estado.modo || {};
    globalThis.estado.modo.actual = 'aventura';
    if (globalThis.estadoPadre?.modo) globalThis.estadoPadre.modo.actual = 'aventura';
  });

  test('PP-2. El reintento de la pantalla de sin señal pide la posición con 15 s fijos', async ({ page }) => {
    await apuntarPeticiones(page);
    await page.evaluate(() => globalThis.showGpsSignalOverlay(3, 'Timeout expired'));
    await page.evaluate(() => document.getElementById('gps-signal-action').click());
    const pedidas = await page.evaluate(() => globalThis.__opcionesPedidas);
    expect(pedidas).toEqual([{ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }]);
  });

  test('PP-3. El reintento de las pantallas de distancia la pide con 5 s ajustados a la conexión', async ({ page }) => {
    await apuntarPeticiones(page);
    const esperado = await page.evaluate(() => globalThis.ajustarTimeoutPorConexion(5000));
    await page.evaluate(() => globalThis.showFotoLejosOverlay(500));
    await page.evaluate(() => document.getElementById('foto-lejos-action').click());
    const pedidas = await page.evaluate(() => globalThis.__opcionesPedidas);
    expect(pedidas).toEqual([{ enableHighAccuracy: true, timeout: esperado, maximumAge: 0 }]);
  });
});
