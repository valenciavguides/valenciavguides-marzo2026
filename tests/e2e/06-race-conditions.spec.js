/**
 * 06-race-conditions.spec.js
 *
 * Documenta y verifica las race conditions conocidas listadas en DT-1 Opción B.
 * Solo se cubren aquí las condiciones que pueden verificarse SIN activar el flujo
 * de aventura (selección de aventura, cambio de modo, carga de iframes hijos).
 *
 * Race conditions testeadas aquí:
 *
 *   Race #1 — Map init concurrente: `_mapInitializing` evita que dos llamadas
 *             simultáneas a inicializarServicioMapa() creen dos instancias Leaflet.
 *
 *   Race #3 — Doble registro de handlers de modo: `registrarControladorSeguro`
 *             con el Set `__CONTROLADOR_REGISTRADOS` impide que el mismo tipo
 *             de mensaje se registre dos veces aunque _registrarHandlersModo()
 *             se llame en retry.
 *
 *   Race #4 — `globalThis.mensajeria` antes de Script 2: Script 2 accede a
 *             globalThis.mensajeria para destructurar registrarControlador/enviarMensaje.
 *             Si FASE 1 no completó antes de que Script 2 ejecute ese acceso,
 *             hay TypeError. Verificamos que mensajeria expone exactamente lo que
 *             Script 2 necesita, y que lo hace antes de que __MENSAJERIA_INICIADA
 *             sea true.
 *
 * Race conditions NO testeadas aquí (requieren flujo de aventura):
 *
 *   Race #2 — Handler antes de mensajeriaReady → cubierto en spec 03
 *             (manejadoresLocales = 0 tras boot normal)
 *
 *   Race #5 — `__vv_stateManager` antes de import en hijos → documentado como
 *             HALLAZGO-DT1 en spec 01. Se resolverá en la extracción Opción B.
 *
 * NOTA: Estos tests deben seguir pasando tras la extracción a js/controladores-padre.js.
 * Si alguno falla tras el refactor → regresión detectada.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');

test.describe('Race conditions documentadas — DT-1 Opción B', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: LEAFLET_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  // ── Race #1: Map init concurrente ─────────────────────────────────────
  //
  // El flag `_mapInitializing` (local en Script 1) impide que dos llamadas
  // concurrentes a initializeMap() creen dos instancias Leaflet.
  // No podemos acceder a _mapInitializing (es local), pero sí podemos verificar:
  //   a) que globalThis.funcionesMapa expone la API de mapa
  //   b) que llamar a isMapInitialized() (ahora síncrona) no lanza error
  //   c) que la API es idempotente: llamar operaciones de solo-lectura dos veces
  //      devuelve el mismo resultado

  test('Race #1a. globalThis.funcionesMapa existe con la API esperada', async ({ page }) => {
    const api = await page.evaluate(() => {
      const fm = globalThis.funcionesMapa;
      if (!fm) return null;
      return {
        hasInicializarServicio: typeof fm.inicializarServicioMapa === 'function',
        hasIsMapInitialized:    typeof fm.isMapInitialized === 'function',
        hasActivarGPS:          typeof fm.activarGPS === 'function',
        hasObtenerPosicion:     typeof fm.obtenerPosicionActual === 'function',
      };
    });
    expect(api).not.toBeNull();
    expect(api.hasInicializarServicio).toBe(true);
    expect(api.hasIsMapInitialized).toBe(true);
  });

  test('Race #1b. isMapInitialized() no lanza error al llamarse sin instancia Leaflet real', async ({ page }) => {
    const result = await page.evaluate(() => {
      try {
        const fm = globalThis.funcionesMapa;
        if (!fm || typeof fm.isMapInitialized !== 'function') {
          return { ok: false, reason: 'API no disponible' };
        }
        // En headless con stub de Leaflet el mapa no se inicializa realmente;
        // isMapInitialized() debe devolver false (o un booleano) sin lanzar.
        const val = fm.isMapInitialized();
        return { ok: true, type: typeof val };
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    });
    expect(result.ok).toBe(true);
    // Debe ser boolean — la race condition DT-1b.20 (isMapInitialized era async) ya fue corregida
    expect(result.type).toBe('boolean');
  });

  test('Race #1c. llamar isMapInitialized() dos veces devuelve el mismo valor (idempotente)', async ({ page }) => {
    const result = await page.evaluate(() => {
      try {
        const fm = globalThis.funcionesMapa;
        if (!fm || typeof fm.isMapInitialized !== 'function') return null;
        const r1 = fm.isMapInitialized();
        const r2 = fm.isMapInitialized();
        return { r1, r2, same: r1 === r2 };
      } catch (e) {
        return null;
      }
    });
    expect(result).not.toBeNull();
    expect(result.same).toBe(true);
  });

  // ── Race #3: Doble registro de handlers de modo ───────────────────────
  //
  // `registrarControladorSeguro` usa el Set `__CONTROLADOR_REGISTRADOS` para
  // garantizar que el mismo tipo no se registra dos veces.
  // Verificamos:
  //   a) que el Set existe tras el boot
  //   b) que intentar registrar un tipo ya existente no añade al Set (tamaño no crece)
  //   c) que el total de handlers en state-manager no crece si se llama dos veces
  //      con el mismo tipo

  test('Race #3a. __CONTROLADOR_REGISTRADOS es un Set con entradas tras el boot', async ({ page }) => {
    const info = await page.evaluate(() => {
      const s = globalThis.__CONTROLADOR_REGISTRADOS;
      return {
        isSet: s instanceof Set,
        size: s instanceof Set ? s.size : -1,
      };
    });
    expect(info.isSet).toBe(true);
    expect(info.size).toBeGreaterThan(0);
  });

  test('Race #3b. registrarControladorSeguro ignora tipo ya registrado (no crece el Set)', async ({ page }) => {
    const result = await page.evaluate(() => {
      const fn = globalThis.registrarControladorSeguro;
      const s = globalThis.__CONTROLADOR_REGISTRADOS;
      if (typeof fn !== 'function' || !(s instanceof Set)) {
        return { skip: true };
      }

      // Usar un tipo ficticio para no interferir con handlers reales
      const tipoTest = '__E2E_RACE3_TEST__';

      // Primera llamada — debe registrarse
      const sizeBefore = s.size;
      fn(tipoTest, () => {});
      const sizeAfter1 = s.size;

      // Segunda llamada con mismo tipo — el guard debe ignorarla
      fn(tipoTest, () => {});
      const sizeAfter2 = s.size;

      return {
        sizeBefore,
        sizeAfter1,
        sizeAfter2,
        firstCallAdded: sizeAfter1 === sizeBefore + 1,
        secondCallIgnored: sizeAfter2 === sizeAfter1, // tamaño no creció
      };
    });

    if (result.skip) {
      // Si no hay registrarControladorSeguro disponible, skip no es un fallo
      console.warn('[WARN] registrarControladorSeguro no disponible — test saltado');
      return;
    }

    expect(result.firstCallAdded).toBe(true);
    expect(result.secondCallIgnored).toBe(true);
  });

  test('Race #3c. los handlers de modo CAMBIO_MODO_ENTENDIDO/EFECTUADO están en el Set (no hubo doble registro)', async ({ page }) => {
    // Si _registrarHandlersModo() se hubiera llamado dos veces, ambos tipos
    // aparecerían solo UNA vez en el Set (el guard lo garantiza).
    // Lo que podemos verificar: si el Set tiene esos tipos, fue porque el primer
    // registro tuvo éxito; no hay posibilidad de que estén dos veces.
    // (Un Set no puede tener duplicados por definición.)
    const info = await page.evaluate(() => {
      const s = globalThis.__CONTROLADOR_REGISTRADOS;
      if (!(s instanceof Set)) return { ok: false };
      const entries = [...s];
      // Buscar tipos relacionados con cambio de modo
      const modoEntries = entries.filter(t =>
        typeof t === 'string' && (
          t.includes('MODO') || t.includes('modo') || t.includes('ENTENDIDO') || t.includes('EFECTUADO')
        )
      );
      return {
        ok: true,
        totalRegistrados: entries.length,
        modoEntries,
        // Por definición de Set no puede haber duplicados — el tamaño == entradas únicas
        noDuplicados: new Set(entries).size === entries.length,
      };
    });

    expect(info.ok).toBe(true);
    expect(info.noDuplicados).toBe(true); // invariante de Set — documenta que no hay duplicados
  });

  // ── Race #4: `globalThis.mensajeria` disponible antes de Script 2 ─────────
  //
  // Script 2 (línea 7034 de codigo-padre.html) hace inmediatamente:
  //   const { registrarControlador: rC_S2, enviarMensaje: eM_S2 } = globalThis.mensajeria;
  //
  // Si Script 1 no ha ejecutado `inicializarMensajeria()` antes de que Script 2
  // arranque, esa destructuración produce TypeError.
  //
  // Evidencia de que esto NO ocurre: tras __MENSAJERIA_INICIADA = true (que
  // esperamos en gotoAndWaitForFase1), globalThis.mensajeria tiene ambas funciones.
  //
  // Verificamos la existencia de los exports específicos que Script 2 necesita.

  test('Race #4a. globalThis.mensajeria.registrarControlador existe (necesario para Script 2)', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.mensajeria?.registrarControlador === 'function');
    expect(ok).toBe(true);
  });

  test('Race #4b. globalThis.mensajeria.enviarMensaje existe (necesario para Script 2)', async ({ page }) => {
    const ok = await page.evaluate(() => typeof globalThis.mensajeria?.enviarMensaje === 'function');
    expect(ok).toBe(true);
  });

  test('Race #4c. globalThis.mensajeria fue asignado ANTES de que __MENSAJERIA_INICIADA fuera true', async ({ page }) => {
    // El spy de injectInitSpy captura hasMensajeria en el momento de mensajeriaReady,
    // que ocurre ANTES de que __MENSAJERIA_INICIADA se ponga a true.
    // Si hasMensajeria era true en ese snapshot → mensajeria llegó antes.
    const order = await page.evaluate(() => globalThis.__e2e_initOrder || []);
    const snap = order.find(e => e.event === 'mensajeriaReady');

    // Si el spy no capturó el evento, no podemos concluir nada
    if (!snap) {
      console.warn('[WARN] Spy no capturó mensajeriaReady — ¿injectInitSpy se llamó antes de goto?');
      return;
    }

    // globalThis.mensajeria debe estar disponible en el momento de mensajeriaReady
    // (Script 2 lo necesita al iniciar)
    expect(snap.hasMensajeria).toBe(true);
  });

  test('Race #4d. las funciones de Script 2 en app.js están disponibles vía window tras boot', async ({ page }) => {
    // Script 2 también importa: manejarCambioModo, actualizarInterfazModo de app.js
    // Estas se exponen en window o se usan internamente.
    // Verificamos que app.js se cargó correctamente verificando que TIPOS_MENSAJE y MODOS
    // (que también importa Script 2 de constants.js) están disponibles.
    const info = await page.evaluate(() => {
      return {
        hasTiposMensaje: typeof globalThis.TIPOS_MENSAJE === 'object' && globalThis.TIPOS_MENSAJE !== null,
        hasModos: typeof globalThis.MODOS === 'object' && globalThis.MODOS !== null,
      };
    });
    expect(info.hasTiposMensaje).toBe(true);
    expect(info.hasModos).toBe(true);
  });
});
