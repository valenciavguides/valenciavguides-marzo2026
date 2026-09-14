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

/**
 * Envía la petición REINTENTANDO hasta que el padre la procesa.
 *
 * `mensajeria.js` no reintenta: un mensaje que llega antes de que su handler esté
 * registrado se pierde en silencio. Un `waitForTimeout` fijo bastaba en local y fallaba en
 * tandas completas —medido— porque el registro tarda más con la máquina cargada. Y esperar
 * al registro tampoco sirve: los handlers del padre no aparecen en el registro central del
 * state-manager (`getControladoresPorTipo()` devuelve 0), así que no hay señal que observar.
 *
 * Se reenvía hasta que `haOcurrido()` dice que sí. Es el mismo patrón que ya usan
 * 43-saltar-reto-puzzle-roto y 50-pending-iniciado-no-borra-reto para el mismo problema.
 */
async function pedirMapaVintageHasta(page, datos, haOcurrido, descripcion) {
  const limite = Date.now() + 20000;
  while (Date.now() < limite) {
    await page.evaluate((d) => {
      globalThis.postMessage({
        tipo: 'NAVEGACION.MOSTRAR_MAPA_VINTAGE', origen: 'hijo2', destino: 'padre', datos: d,
      }, globalThis.location.origin);
    }, datos);
    await page.waitForTimeout(400);
    if (await haOcurrido()) return;
  }
  throw new Error(`No ocurrió tras 20s: ${descripcion}`);
}

/** Cuántas veces se ha abierto el overlay de imagen. */
const vecesOverlay = (page) => page.evaluate(() => globalThis.__vv_overlayLlamadas.length);

test.describe('MV — el mapa vintage lo resuelve el padre, no el hijo', () => {

  test('MV-1. hijo2 suelto no descarga mapa-vintage-aventuras.js', async ({ page }) => {
    // Resource Timing, no page.route(): en WebKit la interceptación no ve todo (ver EI-4).
    await page.goto('/coordenadas-hijo2.html');
    await page.waitForLoadState('networkidle');
    // VENTANA-OBSERVACION: MV-1 comprueba que hijo2 NO pide el fichero de datos; hay que dar tiempo a que se pidiera si fuera a pedirse
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
    await pedirMapaVintageHasta(
      page, { accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'Aventura1' },
      async () => (await vecesOverlay(page)) > 0, 'el overlay no se abrió'
    );
    const llamadas = await page.evaluate(() => globalThis.__vv_overlayLlamadas);
    expect(llamadas[0].url, `url recibida: ${llamadas[0]?.url}`).toContain('imagenes-mapas-vintage');
  });

  test('MV-3. Una aventura sin mapa vintage no muestra nada y deja aviso', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadreConDatos(page);
    // Aventura34km sigue comentada en mapa-vintage-aventuras.js: su mapa no existe aún.
    // Antes este caso usaba AventuraFallas, que ya tiene el suyo desde que se añadió
    // AvFallas_Mapa.jpg — con ella el test dejaba de probar lo que dice probar.
    // Se espera al AVISO, que es la señal de que el padre ya procesó el mensaje, y solo
    // entonces se comprueba que no abrió nada. Al revés se daría por bueno un "no pasó
    // nada" que en realidad era "aún no ha pasado".
    await pedirMapaVintageHasta(
      page, { accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'Aventura34km' },
      async () => logs.some((l) => l.includes('No hay mapa vintage')), 'no hubo aviso en consola'
    );

    const llamadas = await page.evaluate(() => globalThis.__vv_overlayLlamadas);
    expect(llamadas.length, 'sin mapa no debe abrirse ningún overlay').toBe(0);
  });

  test('MV-4. El padre ignora una url enviada en el mensaje y usa su propia fuente', async ({ page }) => {
    await prepararPadreConDatos(page);
    // Si el padre confiara en la url del mensaje, habría DOS fuentes para el mismo dato.
    await pedirMapaVintageHasta(
      page, {
        accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'Aventura1',
        url: 'imagenes/SUPLANTADA.jpg',
      },
      async () => (await vecesOverlay(page)) > 0, 'el overlay no se abrió'
    );
    const llamadas = await page.evaluate(() => globalThis.__vv_overlayLlamadas);
    expect(llamadas[0].url, 'la url del mensaje no debe usarse').not.toContain('SUPLANTADA');
    expect(llamadas[0].url).toContain('imagenes-mapas-vintage');
  });

  test('MV-5. El mapa vintage suprime el aviso de girar, y al cerrarlo lo devuelve', async ({ page }) => {
    // La app se usa en vertical y un overlay lo recuerda si giras el movil. Pero los mapas
    // vintage de Aventura3, Aventura4 y Aventura34km son HORIZONTALES: ahi girar el movil es
    // justo lo que hay que hacer. La pantalla de seleccion ya lo tenia; el boton de dentro
    // de la aventura no, y esta es esa excepcion.
    //
    // Lo que se comprueba no es el aviso en si, sino que la marca se pone Y SE QUITA. Una
    // supresion que no se deshace deja la app sin aviso para el resto de la sesion, y eso
    // no se nota hasta que alguien gira el movil mucho despues.
    await prepararPadreConDatos(page);

    expect(
      await page.evaluate(() => globalThis.rotationSuppressed === true),
      'antes de abrir nada, el aviso NO esta suprimido',
    ).toBe(false);

    await pedirMapaVintageHasta(
      page, { accion: 'mostrar-mapa-vintage', formato: 'jpg', aventura: 'Aventura1' },
      async () => (await vecesOverlay(page)) > 0, 'no se abrio el mapa vintage',
    );

    expect(
      await page.evaluate(() => globalThis.rotationSuppressed === true),
      'con el mapa abierto, el aviso queda suprimido',
    ).toBe(true);

    await page.evaluate(() => globalThis.cerrarImagenOverlay());

    expect(
      await page.evaluate(() => globalThis.rotationSuppressed === true),
      'al cerrarlo, el aviso vuelve — si no, la app se queda sin el toda la sesion',
    ).toBe(false);
  });
});
