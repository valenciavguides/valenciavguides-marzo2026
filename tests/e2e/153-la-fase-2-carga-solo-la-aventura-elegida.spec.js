/**
 * 153 — La fase 2 del padre carga solo la aventura elegida, por js/data-loader.js (§22.0, n.º 27; estudio, K-131)
 *
 * POR QUE EXISTE
 *
 * La fase 2 (`__cargarDatosAventuraDiferidos`, en P15 o al reanudar) trae los datos de pago que el padre necesita: las
 * coordenadas de la aventura y sus audios en el idioma elegido. Los pide a las funciones de `js/data-loader.js`, que en
 * modo 'local' importan los ficheros de `js/` y en modo 'api' llaman a la API: así, con la API, no pide ningún fichero
 * protegido. Trae la aventura y el idioma elegidos, nada más, y los vuelve a traer si cambian (la selección puede volver
 * atrás sin recargar la página, SELECCION.REINICIAR). El puzzle de un reto llega con `cargarPuzzle()`, al pedirse el reto.
 *
 *   F2-1  Tras la fase 2 de Aventura1 en español, los globales llevan esa aventura y ese idioma y nada más; no hay un
 *         global con todos los puzzles, y la tabla pública de los mapas antiguos está.
 *   F2-2  Si cambian la aventura y el idioma, la fase 2 vuelve a cargar: los globales llevan los nuevos.
 *   F2-3  Con la API (data-loader con BACKEND_READY, /api/health 200 y los ficheros protegidos en 403, como con
 *         PROTECT_DATA=true), la fase 2 y `cargarPuzzle()` sacan sus datos de la API y no piden ningún fichero protegido.
 *   F2-4  Control del camino real: el reto de puzzle de Av1-P-6 llega a hijo4 con la imagen de su puzzle.
 *
 * ROJO ANTES QUE VERDE: con la fase 2 que importaba enteros coordenadas-aventuras.js, audios-aventuras.js y
 * puzzles-aventuras.js, F2-1 y F2-2 caen (siete aventuras, doce idiomas y el global de los puzzles) y F2-3 cae en los
 * 403 de esos ficheros. F2-4 pasa con las dos: vigila que el puzzle siga llegando por el camino nuevo.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Lo que publica la fase 2, resumido: qué aventuras e idiomas llevan los globales. */
const cargarFase2 = (page, aventura, idioma) => page.evaluate(async ([a, i]) => {
  globalThis.aventuraSeleccionada = a;
  globalThis.idiomaSeleccionado = i;
  const ok = await globalThis.__cargarDatosAventuraDiferidos();
  const audios = globalThis.__vv_AUDIOS_AVENTURAS || {};
  return {
    ok,
    coordenadas: Object.keys(globalThis.__vv_DATOS_AVENTURAS || {}),
    entradas: globalThis.__vv_DATOS_AVENTURAS?.[a]?.['coordenadas-hijo2.html']?.coordenadas?.length ?? 0,
    audios: Object.fromEntries(Object.entries(audios).map(([av, porIdioma]) => [av, Object.keys(porIdioma)])),
    pistas: audios[a]?.[i]?.length ?? 0,
    puzzles: typeof globalThis.__vv_PUZZLES,
    mapasAntiguos: Boolean(globalThis.__vv_MAPAS_VINTAGE?.[a]),
  };
}, [aventura, idioma]);

test.describe('F2 — la fase 2 carga solo la aventura elegida', () => {
  test.describe('en modo local', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript({ path: MAPLIBRE_STUB });
      await injectInitSpy(page);
      await stubCDNResources(page);
      await gotoAndWaitForFase1(page);
    });

    test('F2-1. Solo la aventura y el idioma elegidos; sin global de puzzles', async ({ page }) => {
      const r = await cargarFase2(page, 'Aventura1', 'es');
      expect(r).toMatchObject({ ok: true, coordenadas: ['Aventura1'], audios: { Aventura1: ['es'] }, puzzles: 'undefined', mapasAntiguos: true });
      expect(r.entradas, 'las coordenadas de la aventura').toBeGreaterThan(0);
      expect(r.pistas, 'sus audios en español').toBeGreaterThan(0);
    });

    test('F2-2. Si cambian la aventura y el idioma, vuelve a cargar', async ({ page }) => {
      expect((await cargarFase2(page, 'Aventura1', 'es')).ok).toBe(true);
      const r = await cargarFase2(page, 'Aventura2', 'en');
      expect(r).toMatchObject({ ok: true, coordenadas: ['Aventura2'], audios: { Aventura2: ['en'] } });
      expect(r.entradas).toBeGreaterThan(0);
      expect(r.pistas).toBeGreaterThan(0);
    });

    test('F2-4. Control: el reto de puzzle de Av1-P-6 llega a hijo4 con la imagen de su puzzle', async ({ page }) => {
      test.setTimeout(90_000);
      expect((await cargarFase2(page, 'Aventura1', 'es')).ok).toBe(true);
      await cargarHijosDelPadre(page);
      await page.waitForFunction(() => globalThis.estado?.hijosInicializados?.has('hijo4'), null, { timeout: 60_000 });
      const hijo4 = page.frames().find((f) => f.name() === 'hijo4');
      await hijo4.evaluate(() => {
        globalThis.__retosMostrados = [];
        globalThis.addEventListener('message', (e) => { if (e.data?.tipo === 'RETO.MOSTRAR') globalThis.__retosMostrados.push(e.data.datos); });
      });
      await page.evaluate(() => {
        globalThis.estadoPadre.modo = globalThis.estadoPadre.modo || {};
        globalThis.estadoPadre.modo.actual = globalThis.MODOS.AVENTURA;
        globalThis.estado.paradaActual = 'Av1-P-6';
        globalThis.estado.retoActual = { id: 'PZ-01', cola: ['PZ-01'], colaCompletados: new Set() };
      });
      await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.RETO.SOLICITAR_RETO, datos: {} }));
      const imagen = () => hijo4.evaluate(() => globalThis.__retosMostrados.find((d) => d.retoId === 'PZ-01')?.retosArray?.[0]?.imagenPuzzle ?? null);
      await expect.poll(imagen, { timeout: 15_000 }).toBe('imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg');
    });
  });

  test.describe('con la API', () => {
    // Sin service worker: con él controlando la página, las peticiones las hace él y `page.route` no las ve.
    test.use({ serviceWorkers: 'block' });

    test('F2-3. Con la API, la fase 2 y el puzzle salen de la API y no piden ningún fichero protegido', async ({ page }) => {
      // data-loader con el freno quitado: el modo se decide preguntando a /api/health, como en el VPS.
      let freno = 0;
      await page.route('**/js/data-loader.js', async (route) => {
        const original = await route.fetch();
        const texto = await original.text();
        freno = texto.split('const BACKEND_READY = false;').length - 1;
        await route.fulfill({ response: original, body: texto.replace('const BACKEND_READY = false;', 'const BACKEND_READY = true;') });
      });
      const json = (cuerpo) => (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(cuerpo) });
      await page.route('**/api/health', json({ ok: true }));
      await page.route('**/api/coordenadas/**', json({
        exito: true,
        coordenadas: { 'coordenadas-hijo2.html': { coordenadas: [{ id: 'API-P-0', tipo: 'inicio', nombre: 'Desde la API', coordenadas: { lat: 39.47876, lng: -0.37626 } }] } },
      }));
      await page.route('**/api/audios/**', json({ exito: true, audios: [{ id: 'audio-API-es', title: 'Desde la API', file: '' }] }));
      await page.route('**/api/puzzles/**', json({ exito: true, puzzle: { id: 'PZ-01', imagen: 'desde-la-api.jpg' } }));
      // Lo protegido (PROTECTED_FILES de js/server.js) da 403, como con PROTECT_DATA=true, y queda apuntado.
      const protegidos = [];
      await page.route(/\/(js\/(coordenadas|textos|retos|puzzles|audios)-aventuras\.js|js\/parrafos-textos\/|audios-aventuras\/|imagenes\/imagenes-aventuras\/|imagenes\/mapas-vintage\/|videos-aventuras\/)/i, (route) => {
        protegidos.push(route.request().url());
        return route.fulfill({ status: 403, body: 'Forbidden' });
      });

      await page.addInitScript({ path: MAPLIBRE_STUB });
      await injectInitSpy(page);
      await stubCDNResources(page);
      await gotoAndWaitForFase1(page);

      const r = await page.evaluate(async () => {
        globalThis.aventuraSeleccionada = 'Aventura1';
        globalThis.idiomaSeleccionado = 'es';
        const ok = await globalThis.__cargarDatosAventuraDiferidos();
        const { cargarPuzzle, getDataMode } = await import('./js/data-loader.js');
        const puzzle = await cargarPuzzle('Aventura1', 'PZ-01');
        return {
          ok,
          modo: getDataMode(),
          entrada: globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas?.[0]?.id ?? null,
          audio: globalThis.__vv_AUDIOS_AVENTURAS?.Aventura1?.es?.[0]?.id ?? null,
          puzzle,
        };
      });
      expect(freno, 'el data-loader servido lleva el freno quitado').toBe(1);
      expect(r).toEqual({ ok: true, modo: 'api', entrada: 'API-P-0', audio: 'audio-API-es', puzzle: { id: 'PZ-01', imagen: 'desde-la-api.jpg' } });
      expect(protegidos, 'ficheros protegidos pedidos con la API').toEqual([]);
    });
  });
});
