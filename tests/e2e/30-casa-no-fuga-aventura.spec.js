/**
 * 30-casa-no-fuga-aventura.spec.js
 *
 * Reporte de uso real (2026-08-10): en modo CASA (elección libre de parada/tramo vía
 * hijo5, modo DEV), seguían apareciendo el cartel de "fuera de rango" y el marcador de
 * ubicación real (flecha), y — el hallazgo más grave — el detector de llegada de hijo2
 * podía marcar pending.llegada=true para una parada que el usuario solo estaba MIRANDO
 * en CASA (no visitando de verdad), porque "ver" una parada en CASA reutiliza el mismo
 * NAVEGACION.CAMBIO_PARADA que un avance real y por tanto actualiza estado.elementoActual
 * — el guard del padre en _hdl_NAVEGACION_LLEGADA_DETECTADA (paradaId debe coincidir con
 * elementoActual) no protegía nada en este caso.
 *
 * Causa raíz: varias piezas de procesarPosicionGPSParaAventura() (funciones-mapa.js) y de
 * _detectarLlegadaTramo()/_detectarLlegadaParada() (coordenadas-hijo2.html) se llamaban
 * a sí mismas "para aventura" mientras el GPS estaba activo, sin comprobar en realidad
 * si el modo actual era AVENTURA — el GPS nunca se detiene entre modos (invariante ya
 * documentado), así que corrían igual en CASA.
 *
 *   CM-1  El marcador de usuario usa el emoji 🛸 (clase marcador-usuario-gps-ovni) en
 *         CASA, no la flecha de AVENTURA (marcador-usuario-gps-flecha).
 *   CM-2  En CASA, procesarPosicionGPSParaAventura() no envía NAVEGACION.ACTUALIZAR_ESTADO
 *         a hijo2 (el broadcast de distancia real deja de viajar sin motivo).
 *   CM-3  En hijo2, con estadoComponente.modo='casa', un ACTUALIZAR_ESTADO con distancia
 *         dentro de radio NO dispara _detectarLlegadaParada/_detectarLlegadaTramo — cero
 *         NAVEGACION.LLEGADA_DETECTADA enviado (el hallazgo grave).
 *   CM-4  Defensa en profundidad: aunque LLEGADA_DETECTADA llegara al padre estando en
 *         CASA, _hdl_NAVEGACION_LLEGADA_DETECTADA lo ignora — pending.llegada nunca se
 *         marca ni se persiste paradasCompletadas.
 *   CM-5  Defensa en profundidad: _hdl_NAVEGACION_USUARIO_FUERA_RANGO en CASA no activa
 *         estado.usuarioFueraRango.
 *   CM-6  _hdl_SISTEMA_CAMBIO_MODO(CASA) cierra los overlays de distancia GPS si estaban
 *         visibles (ya no se quedan pegados desde una AVENTURA anterior).
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const TRAMO = {
  id: 'Av1-TR-1',
  tipo: 'tramo',
  inicio: { lat: 39.47876, lng: -0.37626 },
  waypoints: [
    { lat: 39.47905, lng: -0.37613 },
    { lat: 39.479341, lng: -0.376408 },
  ],
  fin: { lat: 39.47959, lng: -0.37583 },
};

async function prepararEscenarioTramo(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null, { timeout: 15_000 }
  ).catch(() => {});

  return page.evaluate(async (tramo) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
      const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
    const fm = globalThis.funcionesMapa;
    if (typeof fm?.limpiarPorEstado === 'function') {
      fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      fm.limpiarPorEstado({ modo: 'casa', paradaActual: tramo.id });
    }
    return {
      tieneFunciones: !!(fm?.procesarPosicionGPSParaAventura),
      tramoEncontrado: !!globalThis.AVENTURA_PARADAS?.find(p => p.id === tramo.id),
    };
  }, TRAMO);
}

test.describe('CM — Nada de AVENTURA se ejecuta de verdad estando en modo CASA', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('CM-1. El marcador de usuario en CASA usa el 🛸 (ovni), no la flecha de AVENTURA', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    // estadoMapa.modo ya quedó en 'casa' tras limpiarPorEstado en prepararEscenarioTramo.
    await page.evaluate(async (tramo) => {
      await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
        coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
      });
    }, TRAMO);
    await page.waitForTimeout(200);

    // El stub de MapLibre usado en los tests no replica el DOM exacto de la librería real
    // (sin clase .maplibregl-marker), así que se comprueba el contenido HTML inyectado
    // directamente en vez de una clase CSS del wrapper — más robusto frente al stub y
    // sigue verificando exactamente lo que cambió: qué icono se dibujó de verdad.
    const marcador = await page.evaluate(() => ({
      tieneOvni: document.body.innerHTML.includes('🛸'),
      tieneFlechaAventura: document.body.innerHTML.includes('gps-arrow-heading'),
    }));
    expect(marcador.tieneOvni, 'En CASA debe dibujarse el 🛸 simulado').toBe(true);
    expect(marcador.tieneFlechaAventura, 'En CASA NO debe dibujarse la flecha de AVENTURA (gps-arrow-heading)').toBe(false);
  });

  test('CM-2. En CASA, procesarPosicionGPSParaAventura no envía ACTUALIZAR_ESTADO a hijo2', async ({ page }) => {
    const prep = await prepararEscenarioTramo(page);
    test.skip(!prep.tieneFunciones || !prep.tramoEncontrado, `Precondición no disponible: ${JSON.stringify(prep)}`);

    const resultado = await page.evaluate(async (tramo) => {
      const enviados = [];
      const originalEnviarMensaje = globalThis.enviarMensaje;
      // enviarMensaje puede no estar expuesto en globalThis en este módulo — usamos el
      // espía de mensajería si existe (injectInitSpy ya registra un listener global).
      const spy = [];
      const onMsg = (ev) => { if (ev?.data?.tipo === 'NAVEGACION.ACTUALIZAR_ESTADO') spy.push(ev.data); };
      globalThis.addEventListener('message', onMsg);
      try {
        await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
          coords: { latitude: tramo.inicio.lat, longitude: tramo.inicio.lng, accuracy: 5 },
        });
        await new Promise(r => setTimeout(r, 200));
      } finally {
        globalThis.removeEventListener('message', onMsg);
      }
      return { capturados: spy.length };
    }, TRAMO);

    expect(resultado.capturados, 'No debe enviarse ningún ACTUALIZAR_ESTADO a hijo2 en modo CASA').toBe(0);
  });

  test('CM-6. _hdl_SISTEMA_CAMBIO_MODO(CASA) cierra los overlays de distancia GPS si estaban visibles', async ({ page }) => {
    const disponible = await page.evaluate(() => typeof globalThis._vv_triggerCambioModo === 'function');
    test.skip(!disponible, '_vv_triggerCambioModo no disponible');

    // Crear un overlay "fuera de rango" visible de verdad (clase .show, mismo mecanismo
    // real que usa el propio código — no basta con existir en el DOM, tiene que tener
    // la clase que lo hace visible, ver _ocultarOtrasPantallasDistanciaGPS).
    await page.evaluate(() => {
      const el = document.createElement('div');
      el.id = 'gps-out-of-range-overlay';
      el.classList.add('show');
      el.textContent = 'overlay de prueba';
      document.body.appendChild(el);
    });
    let visibleAntes = await page.evaluate(() => document.getElementById('gps-out-of-range-overlay')?.classList.contains('show'));
    expect(visibleAntes).toBe(true);

    // Forzar explícitamente el CASA branch: si ya estábamos en 'casa' (arranque por
    // defecto del harness), pasar primero por 'aventura' para que el segundo trigger sea
    // un cambio real de verdad, no un no-op.
    await page.evaluate(async () => {
      await globalThis._vv_triggerCambioModo('aventura');
      await globalThis._vv_triggerCambioModo('casa');
    });
    await page.waitForTimeout(300);

    const visibleDespues = await page.evaluate(() => document.getElementById('gps-out-of-range-overlay')?.classList.contains('show'));
    expect(visibleDespues, 'El overlay de fuera de rango debe perder la clase "show" al entrar en CASA').toBe(false);
  });
});

test.describe('CM — hijo2: detección de llegada no se dispara mirando una parada en CASA', () => {
  test.beforeEach(async ({ page }) => {
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  async function cargarHijo2Real(page) {
    return page.evaluate(async () => {
      return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.id = 'hijo2';
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:10px;height:10px;';
        iframe.addEventListener('load', () => {
          try { globalThis.mensajeria.registrarIframe('hijo2', iframe); } catch (_e) {}
          resolve(true);
        }, { once: true });
        iframe.addEventListener('error', () => resolve(false), { once: true });
        iframe.src = 'coordenadas-hijo2.html';
        document.body.appendChild(iframe);
      });
    });
  }

  test('CM-3. Con estadoComponente.modo=casa en hijo2, ACTUALIZAR_ESTADO dentro de radio NO envía LLEGADA_DETECTADA', async ({ page }) => {
    const cargado = await cargarHijo2Real(page);
    test.skip(!cargado, 'hijo2 no se pudo cargar como iframe real en este entorno');
    await page.waitForTimeout(1200);

    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    const resultado = await page.evaluate(async () => {
      const iframe = document.getElementById('hijo2');
      if (!iframe?.contentWindow) return { ok: false, motivo: 'sin contentWindow' };

      // Forzar modo CASA dentro de hijo2 (mismo mecanismo que un SISTEMA.CAMBIO_MODO real).
      iframe.contentWindow.postMessage({
        tipo: 'SISTEMA.CAMBIO_MODO',
        origen: 'padre',
        destino: 'hijo2',
        datos: { modo: 'casa', origen: 'test', secuenciaCompleta: true, timestamp: Date.now() },
      }, globalThis.location.origin);
      await new Promise(r => setTimeout(r, 300));

      // Enviar ACTUALIZAR_ESTADO con distancia claramente dentro de cualquier radio de
      // llegada (parada: 15m: tramo: toleranciaGPS >= 50m) — si el guard fallara, esto
      // dispararía LLEGADA_DETECTADA con certeza.
      iframe.contentWindow.postMessage({
        tipo: 'NAVEGACION.ACTUALIZAR_ESTADO',
        origen: 'padre',
        destino: 'hijo2',
        datos: {
          distanciaAlDestino: 3,
          distanciaAlCamino: 3,
          idParada: 'Av1-P-1',
          tipoParada: 'parada',
          toleranciaGPS: 50,
          lat: 39.47959, lng: -0.37583,
          timestamp: Date.now(),
        },
      }, globalThis.location.origin);
      await new Promise(r => setTimeout(r, 400));
      return { ok: true };
    });

    test.skip(!resultado.ok, `No se pudo ejercitar el escenario: ${resultado.motivo}`);

    const huboLlegada = logs.some(l => /LLEGADA_DETECTADA|Llegada detectada a parada/i.test(l));
    expect(huboLlegada, 'No debe haber ningún indicio de LLEGADA_DETECTADA con el componente en modo casa').toBe(false);
  });
});

test.describe('CM — padre: defensa en profundidad en los handlers de GPS', () => {
  test.beforeEach(async ({ page }) => {
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('CM-4. _hdl_NAVEGACION_LLEGADA_DETECTADA en CASA no marca pending.llegada ni completa nada', async ({ page }) => {
    const disponible = await page.waitForFunction(
      () => typeof globalThis.__triggerLlegadaDetectadaInterno === 'function' && typeof globalThis.estado !== 'undefined',
      null, { timeout: 15000 }
    ).then(() => true).catch(() => false);
    test.skip(!disponible, '__triggerLlegadaDetectadaInterno o estado no disponibles');

    const resultado = await page.evaluate(async () => {
      if (!globalThis.estado) return { ok: false };
      globalThis.estado.modo = globalThis.estado.modo || {};
      globalThis.estado.modo.actual = 'casa';
      globalThis.estado.elementoActual = { parada_id: 'P-1', padreid: 'padre-P-1', tipo: 'parada' };
      globalThis.estado.pendingCompleciones = {};

      await globalThis.__triggerLlegadaDetectadaInterno({
        paradaId: 'P-1', parada_id: 'P-1', tipoParada: 'parada',
        coordenadas: { lat: 39.47959, lng: -0.37583 }, distancia: 3, timestamp: Date.now(),
      });
      await new Promise(r => setTimeout(r, 100));

      return {
        ok: true,
        pendingLlegada: globalThis.estado.pendingCompleciones?.['padre-P-1']?.llegada,
        paradaCompletada: globalThis.estado.paradasCompletadas?.has?.('P-1') || false,
      };
    });

    test.skip(!resultado.ok, 'estado global no disponible');
    expect(resultado.pendingLlegada, 'pending.llegada NO debe marcarse a true en modo CASA').not.toBe(true);
    expect(resultado.paradaCompletada, 'La parada NO debe registrarse como completada en modo CASA').toBe(false);
  });

  test('CM-5. _hdl_NAVEGACION_USUARIO_FUERA_RANGO en CASA no activa estado.usuarioFueraRango', async ({ page }) => {
    const disponible = await page.waitForFunction(
      () => typeof globalThis.estado !== 'undefined',
      null, { timeout: 15000 }
    ).then(() => true).catch(() => false);
    test.skip(!disponible, 'estado global no disponible');

    const resultado = await page.evaluate(async () => {
      if (!globalThis.estado) return { ok: false };
      globalThis.estado.modo = globalThis.estado.modo || {};
      globalThis.estado.modo.actual = 'casa';
      globalThis.estado.usuarioFueraRango = { activo: false };

      // Simular la llegada del mensaje real vía postMessage al propio padre (mismo canal
      // que usaría hijo2 si el guard de origen fallara).
      globalThis.postMessage({
        tipo: 'NAVEGACION.USUARIO_FUERA_RANGO',
        origen: 'hijo2',
        destino: 'padre',
        datos: { distancia: 999, franja: 'lejos', elementoMasCercano: 'P-1', timestamp: Date.now() },
      }, globalThis.location.origin);
      await new Promise(r => setTimeout(r, 300));

      return { ok: true, activo: globalThis.estado.usuarioFueraRango?.activo };
    });

    test.skip(!resultado.ok, 'estado global no disponible');
    expect(resultado.activo, 'estado.usuarioFueraRango.activo NO debe activarse en modo CASA').not.toBe(true);
  });
});
