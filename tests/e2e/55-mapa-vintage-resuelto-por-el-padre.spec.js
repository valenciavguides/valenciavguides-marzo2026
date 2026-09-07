/**
 * 55-mapa-vintage-resuelto-por-el-padre.spec.js
 *
 * `coordenadas-hijo2.html` era el ÚNICO hijo que se traía datos por su cuenta:
 * importaba `mapa-vintage-aventuras.js`, resolvía la URL del mapa y se la mandaba al
 * padre en `NAVEGACION.MOSTRAR_MAPA_VINTAGE`. Sus cinco hermanos (hijo1, hijo3, hijo4,
 * hijo5, hijo6) nunca importan datos: los reciben.
 *
 * Ahora hijo2 solo pide, y el padre resuelve la URL desde `__vv_MAPAS_VINTAGE`, que se
 * carga en Fase 2 con el resto de datos. Un solo camino (§22.12, pendiente 13).
 *
 * Ojo con el reparto: la URL la decide el PADRE. Si el hijo la mandara igualmente,
 * volveríamos a tener dos fuentes para el mismo dato.
 *
 *   MV-1  hijo2 cargado suelto NO descarga mapa-vintage-aventuras.js.
 *   MV-2  El padre resuelve la URL de una aventura que sí tiene mapa.
 *   MV-3  Una aventura sin mapa (Fallas) no muestra nada y deja aviso — no revienta.
 *   MV-4  El padre ignora la URL que venga en el mensaje: manda su propia fuente.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Deja el padre en Fase 2 con los datos cargados y espía mostrarImagenOverlay. */
async function prepararPadreConDatos(page) {
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
  await page.waitForFunction(() => globalThis.__vv_MAPAS_VINTAGE != null, null, { timeout: 15000 });
  await page.evaluate(() => {
    globalThis.__vv_overlayLlamadas = [];
    const original = globalThis.mostrarImagenOverlay;
    globalThis.mostrarImagenOverlay = function (url, titulo, ...resto) {
      globalThis.__vv_overlayLlamadas.push({ url, titulo });
      return original ? original.call(this, url, titulo, ...resto) : undefined;
    };
  });
}

async function pedirMapaVintage(page, datos) {
  await page.evaluate((d) => {
    globalThis.postMessage({
      tipo: 'NAVEGACION.MOSTRAR_MAPA_VINTAGE', origen: 'hijo2', destino: 'padre', datos: d,
    }, globalThis.location.origin);
  }, datos);
  await page.waitForTimeout(700);
}

test.describe('MV — el mapa vintage lo resuelve el padre, no el hijo', () => {

  test('MV-1. hijo2 suelto no descarga mapa-vintage-aventuras.js', async ({ page }) => {
    // Resource Timing, no page.route(): en WebKit la interceptación no ve todo (ver EI-4).
    await page.goto('/coordenadas-hijo2.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1200);

    const pedidos = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .map((e) => e.name)
        .filter((u) => /mapa-vintage-aventuras\.js/.test(u))
    );
    expect(pedidos, `hijo2 ya no debe importar datos: ${pedidos.join(', ')}`).toEqual([]);
  });

  test('MV-2. El padre resuelve la URL de una aventura con mapa', async ({ page }) => {
    await prepararPadreConDatos(page);
    await pedirMapaVintage(page, { accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'Aventura1' });

    const llamadas = await page.evaluate(() => globalThis.__vv_overlayLlamadas);
    expect(llamadas.length, 'debe abrirse el overlay con la imagen').toBeGreaterThan(0);
    expect(llamadas[0].url, `url recibida: ${llamadas[0]?.url}`).toContain('imagenes-mapas-vintage');
  });

  test('MV-3. Una aventura sin mapa vintage no muestra nada y deja aviso', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadreConDatos(page);
    // AventuraFallas está comentada en mapa-vintage-aventuras.js: su mapa no existe aún.
    await pedirMapaVintage(page, { accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'AventuraFallas' });

    const llamadas = await page.evaluate(() => globalThis.__vv_overlayLlamadas);
    expect(llamadas.length, 'sin mapa no debe abrirse ningún overlay').toBe(0);
    expect(
      logs.some((l) => l.includes('No hay mapa vintage')),
      'y debe quedar constancia en consola'
    ).toBe(true);
  });

  test('MV-4. El padre ignora una url enviada en el mensaje y usa su propia fuente', async ({ page }) => {
    await prepararPadreConDatos(page);
    // Si el padre confiara en la url del mensaje, habría DOS fuentes para el mismo dato.
    await pedirMapaVintage(page, {
      accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'Aventura1',
      url: 'imagenes/SUPLANTADA.jpg',
    });

    const llamadas = await page.evaluate(() => globalThis.__vv_overlayLlamadas);
    expect(llamadas.length).toBeGreaterThan(0);
    expect(llamadas[0].url, 'la url del mensaje no debe usarse').not.toContain('SUPLANTADA');
    expect(llamadas[0].url).toContain('imagenes-mapas-vintage');
  });
});
