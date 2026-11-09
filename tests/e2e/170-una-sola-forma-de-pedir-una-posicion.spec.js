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

  test('PP-8. La vigilancia continua se abre en un solo sitio y se cierra en otro: watchPosition y clearWatch, una vez', () => {
    expect(dondeCasa(/\.watchPosition\(/g)).toEqual([['codigo-padre.html', 1]]);
    expect(dondeCasa(/\.clearWatch\(/g)).toEqual([['codigo-padre.html', 1]]);
  });

  test('PP-11. El permiso de geolocalización se consulta en un solo sitio: js/utils.js (K-18)', () => {
    expect(dondeCasa(/\.query\(\s*\{\s*name:\s*['"]geolocation['"]/g)).toEqual([['js/utils.js', 1]]);
  });
});

test.describe('PP — lo que decide cada sitio con el permiso (K-18)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  /** Hace que la consulta del permiso conteste un estado falso, con su evento `change` apuntado para poder dispararlo. */
  const permisoFalso = (page, estado) => page.evaluate((e) => {
    globalThis.__permiso = { state: e, oyentes: [], addEventListener(_t, f) { this.oyentes.push(f); }, removeEventListener(_t, f) { this.oyentes = this.oyentes.filter((x) => x !== f); } };
    navigator.permissions.query = async () => globalThis.__permiso;
    globalThis.__vigilancias = [];
    navigator.geolocation.watchPosition = (ok, error, opciones) => { globalThis.__vigilancias.push(opciones); return 80 + globalThis.__vigilancias.length; };
    navigator.geolocation.getCurrentPosition = (ok) => {
      setTimeout(() => ok({ coords: { latitude: 39.47876, longitude: -0.37626, accuracy: 5 }, timestamp: Date.now() }), 0);
    };
  }, estado);

  test('PP-12. Con el permiso denegado, el GPS no se activa: ninguna vigilancia, y el estado lo dice', async ({ page }) => {
    await permisoFalso(page, 'denied');
    const r = await page.evaluate(async () => {
      let error = null;
      try { await globalThis.activarGPS(); } catch (e) { error = e.message; }
      return { error, vigilancias: globalThis.__vigilancias.length, permisos: (globalThis.estadoPadre || globalThis.estado).gps.permisos };
    });
    expect(r).toEqual({ error: 'Permisos de geolocalización denegados', vigilancias: 0, permisos: false });
  });

  test('PP-13. Tras un «denegado», cuando el permiso vuelve, el GPS se activa solo (fuera de Apple)', async ({ page }) => {
    await permisoFalso(page, 'denied');
    await page.evaluate(() => {
      globalThis.estado.modo = globalThis.estado.modo || {};
      globalThis.estado.modo.actual = 'aventura';
      if (globalThis.estadoPadre?.modo) globalThis.estadoPadre.modo.actual = 'aventura';
      globalThis.showGpsSignalOverlay(1, 'User denied Geolocation');
    });
    await expect.poll(() => page.evaluate(() => globalThis.__permiso.oyentes.length)).toBe(1);
    await page.evaluate(() => { globalThis.__permiso.state = 'granted'; globalThis.__permiso.oyentes.forEach((f) => f()); });
    await expect.poll(() => page.evaluate(() => globalThis.__vigilancias.length)).toBe(1);
    expect(await page.evaluate(() => ({ oyentes: globalThis.__permiso.oyentes.length, vigilante: globalThis.__vv_gps_perm_watcher }))).toEqual({ oyentes: 0, vigilante: false });
  });

  test('PP-14. El diagnóstico del GPS cuenta el estado del permiso', async ({ page }) => {
    await permisoFalso(page, 'granted');
    const permisos = await page.evaluate(async () => (await globalThis.diagnosticarGPS()).permisosActuales);
    expect(permisos).toEqual({ estado: 'granted', concedido: true, denegado: false, prompt: false });
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

test.describe('PP — lo que hace cada reintento con la respuesta', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  /**
   * Pone la aventura en marcha, apunta las posiciones que entran en el pipeline (un objeto con el espía en lugar de
   * `globalThis.funcionesMapa`, que es lo que lee el reintento) y deja que el GPS conteste `respuesta`: una posición o un
   * error del navegador.
   */
  const prepararRespuesta = (page, respuesta) => page.evaluate((r) => {
    globalThis.estado.modo = globalThis.estado.modo || {};
    globalThis.estado.modo.actual = 'aventura';
    if (globalThis.estadoPadre?.modo) globalThis.estadoPadre.modo.actual = 'aventura';
    globalThis.__procesadas = [];
    globalThis.funcionesMapa = Object.assign({}, globalThis.funcionesMapa, {
      procesarPosicionGPSParaAventura: (pos) => { globalThis.__procesadas.push(pos.coords.latitude); },
    });
    navigator.geolocation.getCurrentPosition = (ok, error) => {
      setTimeout(() => (r.error ? error(r.error) : ok({ coords: r.coords, timestamp: Date.now() })), 0);
    };
  }, respuesta);
  /**
   * Activa el GPS de verdad (activarGPS) con la vigilancia observada: cada watchPosition apunta sus funciones y opciones
   * y devuelve un id (71, 72…); clearWatch apunta el id que cierra; la posición puntual contesta en el acto.
   */
  const vigilarActivacion = async (page) => {
    await page.evaluate(async () => {
      globalThis.__vigilancias = [];
      globalThis.__cerradas = [];
      navigator.geolocation.watchPosition = (ok, error, opciones) => {
        globalThis.__vigilancias.push({ ok, error, opciones });
        return 70 + globalThis.__vigilancias.length;
      };
      navigator.geolocation.clearWatch = (id) => { globalThis.__cerradas.push(id); };
      navigator.geolocation.getCurrentPosition = (ok) => {
        setTimeout(() => ok({ coords: { latitude: 39.47876, longitude: -0.37626, accuracy: 5 }, timestamp: Date.now() }), 0);
      };
      await globalThis.activarGPS();
    });
    expect(await page.evaluate(() => globalThis.__vigilancias.length)).toBe(1);
  };
  const POSICION = { coords: { latitude: 39.47, longitude: -0.37, accuracy: 8 } };
  const FALLO = { error: { code: 2, message: 'Position unavailable (sonda)' } };
  const senal = (page) => page.locator('#gps-signal-overlay');

  test('PP-4. Sin señal, al acertar: la posición entra en el pipeline y la pantalla se quita', async ({ page }) => {
    await prepararRespuesta(page, POSICION);
    await page.evaluate(() => globalThis.showGpsSignalOverlay(3, 'Timeout expired'));
    await expect(senal(page)).toHaveClass(/\bshow\b/);
    await page.evaluate(() => document.getElementById('gps-signal-action').click());
    await expect.poll(() => page.evaluate(() => globalThis.__procesadas)).toEqual([39.47]);
    await expect(senal(page)).not.toHaveClass(/\bshow\b/);
  });

  test('PP-5. Sin señal, al fallar: la pantalla sigue, con el mensaje real del navegador', async ({ page }) => {
    await prepararRespuesta(page, FALLO);
    await page.evaluate(() => globalThis.showGpsSignalOverlay(3, 'Timeout expired'));
    await page.evaluate(() => document.getElementById('gps-signal-action').click());
    await expect(page.locator('#gps-signal-detalle')).toHaveText('Position unavailable (sonda)');
    await expect(senal(page)).toHaveClass(/\bshow\b/);
    expect(await page.evaluate(() => globalThis.__procesadas)).toEqual([]);
  });

  test('PP-6. Pantalla de distancia, al acertar: la posición entra en el pipeline y no sale la de sin señal', async ({ page }) => {
    await prepararRespuesta(page, POSICION);
    await page.evaluate(() => globalThis.showFotoLejosOverlay(500));
    await page.evaluate(() => document.getElementById('foto-lejos-action').click());
    await expect.poll(() => page.evaluate(() => globalThis.__procesadas)).toEqual([39.47]);
    // La pantalla de sin señal se crea la primera vez que se enseña: aquí no tiene que haber ninguna enseñándose.
    await expect(page.locator('#gps-signal-overlay.show')).toHaveCount(0);
  });

  test('PP-9. La vigilancia continua, con permiso denegado: se cierra y queda sin referencia', async ({ page }) => {
    await vigilarActivacion(page);
    await page.evaluate(() => globalThis.__vigilancias[0].error({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3, message: 'denegado (sonda)' }));
    const r = await page.evaluate(() => ({ cerradas: globalThis.__cerradas, gps: (globalThis.estadoPadre || globalThis.estado).gps }));
    expect(r.cerradas).toEqual([71]);
    expect(r.gps.watchId).toBeNull();
    expect(r.gps.activo).toBe(false);
  });

  test('PP-10. La vigilancia continua, con el plazo vencido: se cierra y se abre otra sin alta precisión y con 15 s', async ({ page }) => {
    await vigilarActivacion(page);
    await page.evaluate(() => globalThis.__vigilancias[0].error({ code: 3, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3, message: 'Timeout (sonda)' }));
    await expect.poll(() => page.evaluate(() => globalThis.__vigilancias.length), { timeout: 5_000 }).toBe(2);
    const r = await page.evaluate(() => ({ cerradas: globalThis.__cerradas, opciones: globalThis.__vigilancias.map((v) => v.opciones) }));
    expect(r.cerradas).toEqual([71]);
    expect(r.opciones).toEqual([
      { enableHighAccuracy: true, timeout: 35000, maximumAge: 0 },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 },
    ]);
  });

  test('PP-7. Pantalla de distancia, al fallar: sale la de sin señal con el mensaje real del navegador', async ({ page }) => {
    await prepararRespuesta(page, FALLO);
    await page.evaluate(() => globalThis.showFotoLejosOverlay(500));
    await page.evaluate(() => document.getElementById('foto-lejos-action').click());
    await expect(senal(page)).toHaveClass(/\bshow\b/);
    await expect(page.locator('#gps-signal-detalle')).toHaveText('Position unavailable (sonda)');
    expect(await page.evaluate(() => globalThis.__procesadas)).toEqual([]);
  });
});
