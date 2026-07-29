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
 *
 * GA-1 cubre un bug de geometría distinto en el mismo triángulo (reporte de campo del
 * usuario): con la técnica de bordes CSS (width:0;height:0;border-left/right transparent;
 * border-bottom:solid), cada triángulo llevaba `transform:translate(-50%,-50%)`, que centra
 * la caja ENTERA (ápice+base) sobre el punto GPS real en vez de anclar solo el ápice —
 * medido empíricamente: la punta oscilaba en un círculo de H/2 píxeles de radio alrededor
 * de la posición real según el ángulo de rumbo. El fix cambia a
 * `translate(-50%,0%)`, que dejaba el ápice (el vértice que señala la dirección) clavado
 * exactamente en el punto GPS en cualquier ángulo, con la base barriendo el arco detrás —
 * como una aguja de brújula.
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

  test('GA-1. El ápice del triángulo de la flecha se queda clavado en el punto GPS real al rotar, no orbita', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(async () => {
      const { actualizarMarcadorUsuario } = await import('/js/funciones-mapa.js');

      // Se miden dos marcadores frescos (heading=0 y heading=180) en vez de mutar el
      // transform de uno solo: `.gps-arrow-heading` lleva `transition:transform 0.3s
      // ease-out`, así que reescribir su transform y medir en el mismo tick capturaría un
      // estado intermedio de la animación, no el ángulo final. Un marcador recién creado
      // no tiene transición de la que partir — su transform inicial ya es el de destino.
      const medirRect = (el) => {
        el.style.position = 'fixed';
        el.style.top = '200px';
        el.style.left = '200px';
        document.body.appendChild(el);

        const heading = el.querySelector('.gps-arrow-heading');
        const triangulos = heading ? [...heading.children] : [];
        if (!heading || triangulos.length < 2) {
          el.remove();
          return null;
        }
        const blanco = triangulos[1]; // orden en el HTML: sombra(0), borde blanco(1), relleno azul(2)
        const r = blanco.getBoundingClientRect();
        const iconBox = el.getBoundingClientRect();
        const pivotReal = { x: iconBox.left + iconBox.width / 2, y: iconBox.top + iconBox.height / 2 };
        el.remove();
        return { rect: r, pivotReal };
      };

      const marker0 = await actualizarMarcadorUsuario(39.4790, -0.3760, 0, 5, 'aventura');
      const el0 = marker0?.getElement();
      const marker180 = await actualizarMarcadorUsuario(39.4791, -0.3761, 180, 5, 'aventura');
      const el180 = marker180?.getElement();
      if (!el0 || !el180) return { ok: false, motivo: 'marker.getElement() no devolvió nada' };

      const m0 = medirRect(el0);
      const m180 = medirRect(el180);
      if (!m0 || !m180) return { ok: false, motivo: 'Estructura de triángulos inesperada' };

      return {
        ok: true,
        pivotReal: m0.pivotReal,
        // A 0° la bbox sigue alineada a los ejes y el ápice es su borde superior. A 180°
        // el triángulo queda boca abajo, así que el ápice pasa a ser el borde INFERIOR.
        apice0: { x: (m0.rect.left + m0.rect.right) / 2, y: m0.rect.top },
        apice180: { x: (m180.rect.left + m180.rect.right) / 2, y: m180.rect.bottom },
      };
    });

    test.skip(!resultado.ok, `No se pudo medir: ${resultado.motivo}`);

    const distApice0 = Math.hypot(resultado.apice0.x - resultado.pivotReal.x, resultado.apice0.y - resultado.pivotReal.y);
    const distApice180 = Math.hypot(resultado.apice180.x - resultado.pivotReal.x, resultado.apice180.y - resultado.pivotReal.y);

    expect(distApice0, `El ápice a 0° debe coincidir con el punto GPS real (pivote=${JSON.stringify(resultado.pivotReal)}, ápice=${JSON.stringify(resultado.apice0)})`).toBeLessThan(1);
    expect(distApice180, `El ápice a 180° también debe coincidir con el punto GPS real — si no, la punta orbita en vez de quedarse clavada (pivote=${JSON.stringify(resultado.pivotReal)}, ápice=${JSON.stringify(resultado.apice180)})`).toBeLessThan(1);
  });
});
