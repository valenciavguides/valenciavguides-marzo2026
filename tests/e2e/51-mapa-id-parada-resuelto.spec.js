/**
 * 51-mapa-id-parada-resuelto.spec.js
 *
 * El evento `vv-parada-cambiada` que `_hdl_NAVEGACION_CAMBIO_PARADA` dispara para
 * `js/funciones-mapa.js` debe llevar el id REAL del elemento (`Av1-P-2`), no el que
 * venía en el mensaje.
 *
 * hijo5 pide los cambios de parada con su propio formato (`padre-P2`).
 * `manejarCambiarParada()` resuelve el elemento buscándolo en `AVENTURA_PARADAS`,
 * cuyos elementos solo llevan `id` con formato `Av1-P-2`/`Av1-TR-1`; su única
 * normalización es quitar el prefijo `padre-`, que deja `P2` — que tampoco existe.
 * Sin el id resuelto lanzaba "Parada padre-P2 no encontrada en datos base" y el mapa
 * no dibujaba el marcador ni centraba la vista.
 *
 * El padre ya tiene el id resuelto (`paradaIdBase`) y lo usa para pedirle los datos a
 * hijo2: solo faltaba pasárselo también al mapa.
 *
 *   MI-1  Formato de hijo5 (`padre-P2`): el mapa ENCUENTRA la parada.
 *   MI-2  Y no registra el error de "no encontrada".
 *   MI-3  Formato de la progresión real (`Av1-P-2`): sigue funcionando igual (no-op).
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

async function prepararPadreConAventura(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(() => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
  });
  await page.evaluate(async () => {
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
  });
  // No se espera a globalThis.AVENTURA_PARADAS: manejarCambiarParada() la puebla de
  // forma lazy en su primer uso desde __vv_DATOS_AVENTURAS (js/funciones-mapa.js ~L1721).
  await page.waitForFunction(
    () => typeof globalThis.__triggerCambioParadaInterno === 'function'
      && globalThis.__vv_DATOS_AVENTURAS != null,
    null, { timeout: 15000 }
  );
}

/** Dispara el cambio de parada por el mismo camino que un click en hijo5. */
async function cambiarParada(page, paradaId, padreId) {
  await page.evaluate(async ({ p, pid }) => {
    await globalThis.__triggerCambioParadaInterno({
      paradaId: p, parada_id: p, padreId: pid, padreid: pid,
      contexto: 'test_id_resuelto', timestamp: Date.now()
    });
  }, { p: paradaId, pid: padreId });
  await page.waitForTimeout(700);
}

test.describe('MI — el mapa recibe el id de parada ya resuelto', () => {
  test('MI-1. Click de hijo5 (padre-P2): el mapa encuentra la parada', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadreConAventura(page);

    await cambiarParada(page, 'padre-P2', 'padre-P2');

    const busquedas = logs.filter((l) => l.includes('Resultado búsqueda'));
    expect(busquedas.length, 'manejarCambiarParada debe haber resuelto el elemento').toBeGreaterThan(0);
    expect(
      busquedas.some((l) => l.includes('ENCONTRADA') && !l.includes('NO ENCONTRADA')),
      `el mapa debe encontrar la parada; búsquedas: ${busquedas.join(' | ')}`
    ).toBe(true);
  });

  test('MI-2. Click de hijo5: no se registra "no encontrada en datos base"', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadreConAventura(page);

    await cambiarParada(page, 'padre-P2', 'padre-P2');

    const fallo = logs.filter((l) => l.includes('no encontrada en datos base'));
    expect(fallo.length, `no debe fallar la resolución: ${fallo.join(' | ')}`).toBe(0);
  });

  test('MI-3. Progresión real (Av1-P-2): sigue resolviendo igual', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadreConAventura(page);

    await cambiarParada(page, 'Av1-P-2', 'padre-P2');

    const fallo = logs.filter((l) => l.includes('no encontrada en datos base'));
    expect(fallo.length, 'el camino que ya funcionaba no debe romperse').toBe(0);
    const busquedas = logs.filter((l) => l.includes('Resultado búsqueda'));
    expect(
      busquedas.some((l) => l.includes('ENCONTRADA') && !l.includes('NO ENCONTRADA'))
    ).toBe(true);
  });
});
