/**
 * 52-gps-no-se-apaga-al-cambiar-modo.spec.js
 *
 * `watchPosition()` se enciende una vez y **no se detiene al cambiar de modo**
 * (§2.6). El modo decide si las posiciones fuerzan avance, no si el sensor corre.
 *
 * `limpiarPorEstado()` (js/funciones-mapa.js) resetea el estado del mapa en cada
 * cambio de modo — parada, tramo, posición, seguimiento. `gpsActivo` NO entra ahí:
 * no es estado del mapa, es el estado del sensor.
 *
 * Ponerlo en false con el watch vivo rompía esta cadena:
 *
 *   limpiarPorEstado → estadoMapa.gpsActivo = false
 *     → la siguiente posición GPS llama a sincronizarEstadoGPSConPadre(), que copia
 *       ese false a estadoPadre.gps.activo (su trabajo: estadoMapa es el propietario
 *       de los campos de comportamiento, §11)
 *       → el guard de activarGPS() (`est.gps.activo && est.gps.watchId !== null`)
 *         deja de reconocer el watch existente
 *         → el siguiente cambio a AVENTURA hace una activación completa (~6 s de
 *           interfaz congelada, medidos en uso real) y crea un SEGUNDO
 *           watchPosition, imposible de cancelar
 *
 * Es la otra mitad del fallo corregido en 2026-07-31 quitando `watchId` de
 * `limpiarRecursosPorModo()`: el guard necesita las dos condiciones.
 *
 *   GA-1  limpiarPorEstado con resetCompleto NO toca estadoMapa.gpsActivo.
 *   GA-2  Sí sigue reseteando lo que sí es estado de mapa (control de que no se ha
 *         desactivado la limpieza entera).
 *   GA-3  Tras el ciclo completo, estadoPadre.gps.activo sigue en true: el espejo ya
 *         no recibe un false falso.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function prepararPadre(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.limpiarPorEstado === 'function',
    null, { timeout: 15000 }
  );
}

/**
 * NOTA de método: la aserción es **estricta a propósito** — el escenario parte de un GPS
 * activo (`estadoPadre.gps = { activo: true, watchId: 1 }`, el estado real tras P14) y
 * exige que siga activo después. Una versión más débil ("que no cambie") pasaba con y sin
 * el fallo, porque `estadoMapa.gpsActivo` vale `false` de partida y volver a ponerlo en
 * `false` no cambia nada: test vacuo, del tipo que documenta EJE 26.
 *
 * `limpiarRecursos()` se usa como disparador porque está en `globalThis.funcionesMapa` y
 * termina llamando a `sincronizarEstadoGPSConPadre()`, que es donde se pisa el flag.
 */
test.describe('GA — el sensor GPS sobrevive al cambio de modo', () => {
  test('GA-1. Tras limpiarRecursos, el GPS sigue marcado como activo', async ({ page }) => {
    await prepararPadre(page);

    const r = await page.evaluate(() => {
      const diag = globalThis.funcionesMapa;
      globalThis.estadoPadre = globalThis.estadoPadre || {};
      globalThis.estadoPadre.gps = { activo: true, watchId: 1 };   // estado real tras P14
      diag.limpiarRecursos();
      return { activo: globalThis.estadoPadre.gps.activo, watchId: globalThis.estadoPadre.gps.watchId };
    });

    expect(r.activo, 'la limpieza no debe apagar el sensor: rompe el guard de activarGPS()').toBe(true);
    expect(r.watchId, 'ni perder el watchId').toBe(1);
  });

  test('GA-2. Pero sí sigue reseteando el estado de mapa (la limpieza no se ha desactivado)', async ({ page }) => {
    await prepararPadre(page);

    const diagnostico = await page.evaluate(async () => {
      const diag = globalThis.funcionesMapa;
      diag.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
      return diag.diagnosticarMapa();
    });

    expect(diagnostico.marcadoresParadas, 'el reset completo sigue limpiando marcadores').toBe(0);
    expect(diagnostico.rutasActivas, 'y rutas').toBe(0);
    expect(diagnostico.modoActual, 'y aplica el modo nuevo').toBe('aventura');
  });

  test('GA-3. Ciclo casa→aventura→casa: el sensor sigue activo en cada paso', async ({ page }) => {
    await prepararPadre(page);

    const trazas = await page.evaluate(() => {
      const diag = globalThis.funcionesMapa;
      globalThis.estadoPadre = globalThis.estadoPadre || {};
      globalThis.estadoPadre.gps = { activo: true, watchId: 1 };
      const out = [];
      for (const modo of ['aventura', 'casa', 'aventura']) {
        diag.limpiarPorEstado({ modo, resetCompleto: true });
        out.push({ modo, activo: globalThis.estadoPadre.gps.activo, watchId: globalThis.estadoPadre.gps.watchId });
      }
      return out;
    });

    for (const x of trazas) {
      expect(x.activo, `tras cambiar a ${x.modo} el sensor debe seguir activo`).toBe(true);
      expect(x.watchId, `y conservar el watchId (${x.modo})`).toBe(1);
    }
  });
});
