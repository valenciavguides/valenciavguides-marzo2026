/**
 * 17-flecha-brujula-continuidad.spec.js
 *
 * actualizarMarcadorUsuario() (js/funciones-mapa.js) destruye y recrea el marcador GPS
 * completo en cada posición recibida (~cada 7s, un tick de watchPosition) — hace falta
 * para reposicionarlo, pero de paso reinicia el transform CSS de `.gps-arrow-heading`.
 * El ángulo inicial de ese transform se calculaba con `heading` (coords.heading, el
 * rumbo de desplazamiento que da el GPS) — un valor poco fiable en cuanto el usuario no
 * camina a buena velocidad (parado leyendo el móvil, andando despacio), casi siempre 0.
 * Mientras tanto, la brújula del dispositivo (deviceorientation → actualizarRotacionFlechaGPS)
 * suaviza el rumbo real en un ángulo acumulado (_flechaGpsAnguloAcumulado) y lo escribe
 * directamente en el elemento — pero ese elemento vive y muere con cada recreación. El
 * resultado real, en el móvil: la flecha, ya orientada por la brújula, saltaba de golpe
 * cada ~7s al rumbo GPS (0° la mayoría de las veces) y luego volvía a corregirse — un giro
 * brusco periódico superpuesto al ruido normal de la brújula, percibido como "flecha loca".
 *
 *   FB-1  Con brújula activa y un ángulo ya acumulado, una recreación del marcador (nueva
 *         posición GPS) usa ese ángulo acumulado como rotación inicial, no el heading GPS.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('FB — Continuidad de la flecha GPS entre recreaciones del marcador', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('FB-1. La recreación del marcador reutiliza el ángulo acumulado de la brújula, no el heading GPS', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(async () => {
      const { actualizarMarcadorUsuario } = await import('/js/funciones-mapa.js');

      // 1) Primera posición GPS: crea el marcador (modo aventura) y, de paso, activa la
      // brújula internamente (activarBrujula() se llama dentro de actualizarMarcadorUsuario
      // la primera vez que modo !== 'casa'). heading=0 aquí es irrelevante para este paso.
      // El elemento del marcador (stub de MapLibre) no se adjunta al document real, así
      // que se consulta vía marker.getElement(), no document.querySelector.
      const marker1 = await actualizarMarcadorUsuario(39.4790, -0.3760, 0, 5, 'aventura');

      // 2) Simula una lectura de brújula real: 130° de rumbo del dispositivo. Esto suaviza
      // (primera lectura: se toma directa, sin promediar) y escribe el transform del
      // elemento YA CREADO. Las propiedades de DeviceOrientationEvent no son escribibles
      // tras construir con el constructor estándar `Event`, así que se usa
      // document.createEvent + initEvent para poder añadir `alpha` manualmente.
      const ev = document.createEvent('Event');
      ev.initEvent('deviceorientation', true, true);
      ev.alpha = 130;
      globalThis.dispatchEvent(ev);

      const anguloTrasCompas = marker1?.getElement()?.querySelector('.gps-arrow-heading')?.style.transform || null;

      // 3) Segunda posición GPS (el marcador se destruye y se recrea) — heading=0 (GPS poco
      // fiable, el caso típico parado o caminando despacio). Sin el fix, el nuevo elemento
      // arrancaría en rotate(0deg); con el fix, debe arrancar en el ángulo de la brújula.
      const marker2 = await actualizarMarcadorUsuario(39.4791, -0.3761, 0, 5, 'aventura');
      const anguloTrasRecrear = marker2?.getElement()?.querySelector('.gps-arrow-heading')?.style.transform || null;

      return { anguloTrasCompas, anguloTrasRecrear, mismoMarker: marker1 === marker2 };
    });

    expect(resultado.mismoMarker, 'La segunda posición GPS debe recrear el marcador (objeto distinto), no reutilizar el mismo').toBe(false);
    expect(resultado.anguloTrasCompas, 'La brújula debe escribir un transform con 130deg tras la primera lectura').toContain('130');
    expect(resultado.anguloTrasRecrear, `Tras recrear el marcador, el ángulo debe seguir siendo el de la brújula (130deg), no reiniciarse a 0: ${resultado.anguloTrasRecrear}`).toContain('130');
  });
});
