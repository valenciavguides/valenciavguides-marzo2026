/**
 * 46-reanudacion-un-solo-camino.spec.js
 *
 * La reanudación de sesión (_activarModoRest, paso 8 de ejecutarRestauracionAventura)
 * reimplementaba por su cuenta la mitad de _hdl_SISTEMA_CAMBIO_MODO: fijaba
 * estado.modo.actual a mano, difundía un CAMBIO_MODO a ciegas sin esperar
 * ENTENDIDO/EFECTUADO, y se saltaba en silencio el guard de concurrencia,
 * limpiarRecursosPorModo, el heartbeat y la persistencia del modo. Dos caminos
 * distintos hacia el mismo estado final, libres de divergir sin que nada lo avisara.
 *
 * Ahora hay UN SOLO camino: _activarModoRest delega en _hdl_SISTEMA_CAMBIO_MODO con
 * restaurado:true, y ese flag marca dentro del handler las 3 únicas diferencias reales
 * de una reanudación (mapa sin reset de vista, sin parada por defecto, sin borrar
 * localStorage).
 *
 * Este archivo fija ese contrato. RU-3 es el más importante: sin el guard de
 * "reanudar no es abandonar", delegar en el handler haría que _transicionarAModoCasa()
 * borrase vv_aventura_iniciada/vv_progreso/vv_paradas_completadas en el acto — los
 * datos que la propia restauración acaba de leer y está aplicando.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Sesión guardada mínima, con la forma real de vv_aventura_iniciada. */
function sesion({ modo, dev, timestamp }) {
  return { aventura: 'Aventura1', idioma: 'es', modo, dev, timestamp: timestamp ?? Date.now() };
}

test.describe('RU — La reanudación usa el mismo camino que cualquier cambio de modo', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    // _activarModoRest vive en Script 1, pero globalThis.estado (getter) lo define
    // Script 2 — hay que esperar a los dos, o `estado` todavía es undefined aquí.
    await page.waitForFunction(
      () => typeof globalThis._activarModoRest === 'function' && !!globalThis.estado,
      null, { timeout: 15000 }
    );
    await page.evaluate(() => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      // Sin hijos registrados, actualizarInterfazModo() resuelve de inmediato: aquí se
      // verifica el enrutado del modo, no el protocolo bidireccional (cubierto por 09).
      globalThis.estado.hijosInicializados = new Set();
      globalThis.enviarMensajeConConfirmacion = () => Promise.resolve({ exito: true });
    });
  });

  test('RU-0. El modo arranca sin decidir (null), no en CASA', async ({ page }) => {
    // Se devuelve un descriptor y no el valor suelto: con `?? 'AUSENTE'` el propio null
    // que se quiere comprobar quedaría enmascarado y el test no probaría nada.
    const r = await page.evaluate(() => {
      const m = globalThis.estadoPadre?.modo;
      return { tieneObjetoModo: !!m, actual: m ? m.actual : 'SIN-OBJETO-MODO' };
    });
    expect(r.tieneObjetoModo, 'estadoPadre.modo debe existir desde el arranque').toBe(true);
    expect(
      r.actual,
      'arrancar en CASA hacía que la primera transición real a CASA se confundiera con "ya estamos ahí"'
    ).toBeNull();
  });

  test('RU-1. Reanudar aplica el modo persistido pasando por el handler, no fijándolo a mano', async ({ page }) => {
    const r = await page.evaluate(async (datos) => {
      const vistos = [];
      const real = globalThis.funcionesMapa?.sincronizarModoMapa;
      // sincronizarModoMapa solo lo llama la rama restaurado:true del handler — si se
      // invoca, el mensaje pasó de verdad por _hdl_SISTEMA_CAMBIO_MODO con ese flag.
      if (globalThis.funcionesMapa) {
        globalThis.funcionesMapa.sincronizarModoMapa = (m) => { vistos.push(m); return real?.call(globalThis.funcionesMapa, m); };
      }
      globalThis.__HEARTBEAT_INICIADO = false;
      await globalThis._activarModoRest('[TEST]', datos);
      return { modo: globalThis.estado.modo?.actual, vistos, heartbeat: globalThis.__HEARTBEAT_INICIADO };
    }, sesion({ modo: 'aventura', dev: false }));

    expect(r.modo, 'el modo restaurado debe quedar aplicado en el estado').toBe('aventura');
    expect(r.vistos, 'la rama restaurado:true del handler único debe haber sincronizado el mapa').toContain('aventura');
    // El heartbeat es la prueba fuerte de que se pasó por el handler: la reanudación
    // antigua fijaba el modo por su cuenta y NUNCA lo arrancaba, así que una sesión
    // restaurada en AVENTURA se quedaba sin supervisión de hijos toda la sesión.
    expect(r.heartbeat, 'restaurar en AVENTURA debe arrancar el heartbeat, como cualquier otra entrada en AVENTURA').toBe(true);
  });

  test('RU-2. El flag dev se restaura del campo persistido, no se deduce del modo (dev + AVENTURA es representable)', async ({ page }) => {
    const r = await page.evaluate(async (datos) => {
      globalThis._devModeActivo = false;
      await globalThis._activarModoRest('[TEST]', datos);
      const hijo5 = document.getElementById('hijo5');
      return { dev: globalThis._devModeActivo, modo: globalThis.estado.modo?.actual, display: hijo5 ? hijo5.style.display : null };
    }, sesion({ modo: 'aventura', dev: true }));

    expect(r.modo).toBe('aventura');
    expect(
      r.dev,
      'una sesión dev guardada en AVENTURA debe reabrirse como dev — deducirlo de modo===CASA hacía esa combinación irrepresentable'
    ).toBe(true);
    // hijo5 sí queda oculto: entrar en AVENTURA lo oculta SIEMPRE, también en dev (§24) —
    // se vuelve a CASA con Factor 2, no con hijo5 en pantalla. Lo que el flag dev
    // persistido cambia aquí no es la visibilidad, sino que una vuelta posterior a CASA
    // no se trate como abandono real y que el reloj de compra no corra (RU-2b/RU-3).
    expect(r.display, 'AVENTURA oculta hijo5 en cualquier caso, dev incluido').toBe('none');
  });

  test('RU-2b. Reanudar en dev + CASA sí deja hijo5 visible', async ({ page }) => {
    const r = await page.evaluate(async (datos) => {
      globalThis._devModeActivo = false;
      await globalThis._activarModoRest('[TEST]', datos);
      const hijo5 = document.getElementById('hijo5');
      return { dev: globalThis._devModeActivo, modo: globalThis.estado.modo?.actual, display: hijo5 ? hijo5.style.display : null };
    }, sesion({ modo: 'casa', dev: true }));

    expect(r.modo).toBe('casa');
    expect(r.dev).toBe(true);
    expect(r.display, 'en dev + CASA hijo5 es la herramienta de navegación: debe verse').toBe('block');
  });

  test('RU-3. Reanudar en CASA sin dev NO borra la sesión que está restaurando', async ({ page }) => {
    const r = await page.evaluate(async (datos) => {
      globalThis._devModeActivo = false;
      localStorage.setItem('vv_aventura_iniciada', JSON.stringify(datos));
      localStorage.setItem('vv_progreso', JSON.stringify({ indiceProgreso: 7 }));
      localStorage.setItem('vv_paradas_completadas', JSON.stringify([['Av1-P-0', {}]]));
      await globalThis._activarModoRest('[TEST]', datos);
      return {
        iniciada: localStorage.getItem('vv_aventura_iniciada'),
        progreso: localStorage.getItem('vv_progreso'),
        completadas: localStorage.getItem('vv_paradas_completadas'),
        modo: globalThis.estado.modo?.actual
      };
    }, sesion({ modo: 'casa', dev: false }));

    expect(r.modo).toBe('casa');
    expect(r.iniciada, 'reanudar NUNCA es abandonar: la sesión restaurada no puede borrarse a sí misma').not.toBeNull();
    expect(r.progreso, 'vv_progreso debe sobrevivir a la reanudación en CASA').not.toBeNull();
    expect(r.completadas, 'vv_paradas_completadas debe sobrevivir a la reanudación en CASA').not.toBeNull();
  });

  test('RU-4. Un cambio a CASA que NO es reanudación sí limpia el progreso (el guard no desactiva el abandono real)', async ({ page }) => {
    const r = await page.evaluate(async () => {
      globalThis._devModeActivo = false;
      globalThis.estado.modo = { actual: 'aventura', anterior: null };
      localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', idioma: 'es', modo: 'aventura', dev: false, timestamp: Date.now() }));
      localStorage.setItem('vv_progreso', JSON.stringify({ indiceProgreso: 7 }));
      await globalThis._vv_triggerCambioModo('casa');
      return { iniciada: localStorage.getItem('vv_aventura_iniciada'), progreso: localStorage.getItem('vv_progreso') };
    });

    expect(r.iniciada, 'un abandono real (sin restaurado:true y sin dev) sí debe limpiar la sesión').toBeNull();
    expect(r.progreso).toBeNull();
  });

  test('RU-5. "Ya estoy en ese modo" resincroniza a los hijos en vez de devolver éxito sin hacer nada', async ({ page }) => {
    const r = await page.evaluate(async () => {
      globalThis.estado.modo = { actual: 'aventura', anterior: null };
      globalThis.estado.hijosInicializados = new Set();
      const { manejarCambioModo } = await import('/js/app.js');
      return manejarCambioModo(globalThis.estado, {
        origen: 'test', datos: { modo: 'aventura', motivo: 'redundante' }
      });
    });

    expect(r.exito).toBe(true);
    expect(r.cambiado, 'no hay transición real: el modo ya era ese').toBe(false);
    expect(
      r.resincronizado,
      'aun sin transición, la propagación a los hijos debe reenviarse — antes se devolvía exito:true sin que ningún hijo se enterara'
    ).toBe(true);
  });
});
