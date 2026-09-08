/**
 * 56-distancia-a-la-ruta.spec.js
 *
 * `_check5kmFromRoute()` corta la aventura si el GPS sitúa al usuario a más de 5 km de
 * TODA la ruta (§30.5). Estaba inerte por tres fallos, y ninguno tenía cobertura:
 *
 *  1. Buscaba las coordenadas en `elementosIDpadre`, que no las tiene. `minDistM` se
 *     quedaba en `Infinity` siempre, e `Infinity > 5000` es siempre cierto: creía que
 *     todo el mundo estaba lejos.
 *  2. Al "bloquear" ocultaba `#gps-error-action` (reintentar GPS) y solo lo restauraba
 *     en la rama de desbloqueo, que nunca se ejecutaba. En cada aventura, ese botón
 *     desaparecía a los pocos segundos y no volvía. **Este es el daño real de hoy.**
 *  3. `_gpsProcesarPosicion()` llamaba a `hideGpsOutOfRangeOverlay()` en cada posición,
 *     sin mirar el bloqueo — borrando el aviso dos líneas después de mostrarlo.
 *
 *   DR-1  Dentro de la ruta: no bloquea y el botón de reintentar GPS sigue visible.
 *   DR-2  Sin coordenadas: NO bloquea (ausencia de dato no es veredicto) y deja error.
 *   DR-3  Lejos, pero con precisión mala: se ignora la lectura, no bloquea.
 *   DR-4  Lejos con buena precisión: hacen falta 3 lecturas seguidas para bloquear.
 *   DR-5  Volver dentro desbloquea y devuelve el botón de reintentar.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Valencia (dentro) y Madrid (~300 km, muy fuera).
const DENTRO = { lat: 39.47921, lng: -0.37604 };
const LEJOS = { lat: 40.41678, lng: -3.70379 };

async function prepararAventura(page) {
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
  await page.waitForFunction(() => globalThis.__vv_DATOS_AVENTURAS != null, null, { timeout: 15000 });

  // Modo AVENTURA y estado limpio del chequeo.
  await page.evaluate(() => {
    globalThis.estadoPadre = globalThis.estadoPadre || {};
    globalThis.estadoPadre.modo = { actual: 'aventura', anterior: 'casa' };
    if (typeof globalThis.estado !== 'undefined') globalThis.estado.modo = { actual: 'aventura', anterior: 'casa' };
    globalThis.__VV_5KM_BLOCKED = false;
    globalThis.__VV_5KM_SEGUIDAS = 0;
    globalThis.__VV_5KM_LAST_CHECK = null;
  });
}

/**
 * Dispara el chequeo N veces. El throttle de 3 minutos se neutraliza reseteando su marca
 * entre llamadas: aquí se prueba la lógica de decisión, no el temporizador.
 */
async function comprobar(page, { lat, lng }, accuracy, veces = 1) {
  for (let i = 0; i < veces; i++) {
    await page.evaluate(({ la, ln, ac }) => {
      globalThis.__VV_5KM_LAST_CHECK = null;
      globalThis._vv_check5km(la, ln, ac);
    }, { la: lat, ln: lng, ac: accuracy });
  }
  return page.evaluate(() => ({
    bloqueado: globalThis.__VV_5KM_BLOCKED === true,
    seguidas: globalThis.__VV_5KM_SEGUIDAS || 0,
    botonReintentar: document.getElementById('gps-error-action')?.style.display ?? '(sin elemento)',
  }));
}

test.describe('DR — distancia a la ruta: no bloquear sin haber medido', () => {

  test('DR-1. Dentro de la ruta: no bloquea y el botón de reintentar sigue visible', async ({ page }) => {
    await prepararAventura(page);
    const r = await comprobar(page, DENTRO, 20, 3);
    expect(r.bloqueado, 'estando en Valencia no puede bloquearse').toBe(false);
    expect(r.botonReintentar, 'el botón de reintentar GPS no debe ocultarse').not.toBe('none');
  });

  test('DR-2. Sin coordenadas no bloquea: ausencia de dato no es veredicto', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararAventura(page);

    // Se vacían las coordenadas: es exactamente el estado que provocaba `Infinity`.
    await page.evaluate(() => {
      globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html'].coordenadas = [];
    });
    const r = await comprobar(page, LEJOS, 20, 3);

    expect(r.bloqueado, 'sin datos NO se puede bloquear a nadie').toBe(false);
    expect(r.botonReintentar, 'ni ocultar el botón de reintentar GPS').not.toBe('none');
    expect(
      logs.some((l) => l.includes('[5KM]') && l.includes('Sin coordenadas')),
      'y debe quejarse en voz alta, no callar'
    ).toBe(true);
  });

  test('DR-3. Lejos pero con precisión mala: la lectura se ignora', async ({ page }) => {
    await prepararAventura(page);
    // ±3 km: por encima del máximo de 100 m, así que no cuenta ni de lejos ni de cerca.
    const r = await comprobar(page, LEJOS, 3000, 5);
    expect(r.bloqueado, 'una lectura imprecisa no puede bloquear').toBe(false);
    expect(r.seguidas, 'ni siquiera debe contar como lectura fuera de rango').toBe(0);
  });

  test('DR-4. Lejos con buena precisión: hacen falta 3 lecturas seguidas', async ({ page }) => {
    await prepararAventura(page);

    const dos = await comprobar(page, LEJOS, 20, 2);
    expect(dos.bloqueado, 'con dos lecturas todavía no se bloquea').toBe(false);
    expect(dos.seguidas).toBe(2);

    const tres = await comprobar(page, LEJOS, 20, 1);
    expect(tres.bloqueado, 'a la tercera sí').toBe(true);
  });

  test('DR-5. Volver dentro desbloquea y devuelve el botón de reintentar', async ({ page }) => {
    await prepararAventura(page);
    const fuera = await comprobar(page, LEJOS, 20, 3);
    expect(fuera.bloqueado, 'precondición: debe haber bloqueado').toBe(true);

    const vuelta = await comprobar(page, DENTRO, 20, 1);
    expect(vuelta.bloqueado, 'volver dentro debe desbloquear').toBe(false);
    expect(vuelta.botonReintentar, 'y devolver el botón de reintentar GPS').not.toBe('none');
  });
});
