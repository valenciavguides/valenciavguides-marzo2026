/**
 * 64 — La llegada se declara con el círculo de 15 m, también en tramos
 *
 * POR QUE EXISTE
 *
 * `calcularToleranciaGPS()` resolvia TRES decisiones con un solo numero: revelar el
 * trazado, avisar de "fuera de rango" y declarar la llegada. Las tres quieren cosas
 * opuestas — contra el ruido del GPS urbano interesa un radio GRANDE; para declarar una
 * llegada interesa PEQUENO. Con un unico valor, la llegada pagaba el radio del ruido: en
 * un tramo se daba por llegado a 35 m o mas, que en el centro historico de Valencia es al
 * otro lado de la manzana.
 *
 * 15 m no es un numero nuevo: es el radio del circulo naranja que la app YA dibuja
 * alrededor del usuario en AVENTURA y que su propio codigo llama "zona de activacion de
 * parada". Ese circulo es el contrato visible: si la diana esta dentro, ha llegado. Con
 * 35 m la app decia "ha llegado" con la diana fuera del circulo que el usuario mira.
 *
 * `calcularToleranciaGPS()` NO cambia: conserva su valor dinamico y sus otros dos trabajos.
 *
 * ROJO ANTES QUE VERDE: RL-1 y RL-2 fallan si `verificarLlegadaADestino()` vuelve a usar
 * `calcularToleranciaGPS()`; RL-3 falla si el padre deja de enviar `radioLlegada`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

/** Un tramo cuyos waypoints estan MUY separados: su toleranciaGPS sube muy por encima de 15. */
const TRAMO_ANCHO = {
  id: 'TEST-TR-ancho',
  tipo: 'tramo',
  inicio: { lat: 39.47500, lng: -0.37500 },
  waypoints: [{ lat: 39.47600, lng: -0.37500 }, { lat: 39.47800, lng: -0.37500 }],
  fin: { lat: 39.47900, lng: -0.37500 },
};

test.describe('RL — El radio de llegada es 15 m en paradas y en tramos', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('RL-1. La tolerancia de un tramo sigue siendo grande, pero su radio de llegada es 15', async ({ page }) => {
    const r = await page.evaluate(async (tramo) => {
      const fm = await import('./js/funciones-mapa.js');
      return {
        // El valor dinamico NO se toca: lo siguen usando botones y fuera-de-rango.
        tolerancia: fm.calcularToleranciaGPS(tramo),
        radio: fm.radioLlegada(),
      };
    }, TRAMO_ANCHO);

    // Si el modulo no expone estas funciones, el test no puede afirmar nada: que se vea.
    expect(r.tolerancia, 'calcularToleranciaGPS debe seguir existiendo y ser dinamica').not.toBeNull();
    expect(r.radio, 'radioLlegada debe existir').not.toBeNull();
    expect(r.tolerancia, 'un tramo ancho debe tener tolerancia muy por encima de 15').toBeGreaterThan(35);
    expect(r.radio, 'el radio de llegada es el del circulo naranja').toBe(15);
  });

  test('RL-2. A 30 m del fin de un tramo NO se ha llegado; a 10 m sí', async ({ page }) => {
    const r = await page.evaluate(async (tramo) => {
      // verificarLlegadaADestino no es un export suelto: vive en el objeto API que el
      // modulo publica (el mismo que usa el padre en produccion), asi que se mide por ahi.
      const ver = globalThis.funcionesMapa?.verificarLlegadaADestino;
      if (!ver) return null;
      // Desplazamientos norte-sur puros: 1 grado de latitud ~ 111320 m.
      const aMetros = (m) => ({ lat: tramo.fin.lat - m / 111320, lng: tramo.fin.lng });
      return {
        a30: ver(aMetros(30), tramo),   // dentro de la vieja tolerancia (>35), fuera del circulo
        a10: ver(aMetros(10), tramo),   // dentro del circulo
        a0: ver({ lat: tramo.fin.lat, lng: tramo.fin.lng }, tramo),
      };
    }, TRAMO_ANCHO);

    expect(r, 'verificarLlegadaADestino debe estar expuesta para el test').not.toBeNull();
    // Este es el caso del usuario: el trazado dice que has llegado y estas a media manzana.
    expect(r.a30, 'a 30 m la diana esta FUERA del circulo naranja: no es una llegada').toBe(false);
    expect(r.a10, 'a 10 m la diana esta dentro del circulo').toBe(true);
    expect(r.a0, 'encima del destino, obviamente').toBe(true);
  });

  test('RL-3. El padre manda los DOS numeros a hijo2, y son distintos en un tramo', async ({ page }) => {
    // hijo2 necesita `radioLlegada` para su propio sensor de llegada, y `toleranciaGPS`
    // para los botones. Si solo llegara uno, los dos sensores medirian distinto.
    // Se afirma el CONTRATO del payload leyendo el fuente servido: forzar una lectura GPS
    // real para capturar el mensaje exigiria permisos de geolocalizacion y un watch vivo
    // (ver la nota de Firefox en las memorias del proyecto), y lo que se rompe si alguien
    // quita el campo es literalmente esta linea.
    const contrato = await page.evaluate(async () => {
      const txt = await (await fetch('./js/funciones-mapa.js')).text();
      const bloque = txt.slice(txt.indexOf('NAVEGACION.ACTUALIZAR_ESTADO'));
      return {
        mandaTolerancia: /toleranciaGPS:\s*toleranciaGPS/.test(bloque),
        mandaRadio: /radioLlegada:\s*radioLlegada\(\)/.test(bloque),
      };
    });
    expect(contrato.mandaTolerancia, 'toleranciaGPS sigue viajando para los botones').toBe(true);
    expect(contrato.mandaRadio, 'radioLlegada debe viajar para el sensor de llegada de hijo2').toBe(true);
  });
});
