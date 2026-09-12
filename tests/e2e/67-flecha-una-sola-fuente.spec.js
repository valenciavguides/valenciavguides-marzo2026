/**
 * 67 — El rumbo de la flecha tiene una sola fuente, y sin brujula lo dice
 *
 * POR QUE EXISTE
 *
 * La rotacion de la flecha GPS la escribian DOS caminos:
 *
 *   1. La brujula (`actualizarOrientacionFlecha` -> `actualizarRotacionFlechaGPS`), que es
 *      hacia donde MIRA el usuario. El dato correcto.
 *   2. `posicion.coords.heading` de la API de geolocalizacion, pasado a
 *      `actualizarMarcadorUsuario()` en cada lectura de GPS. Ese valor es el rumbo de
 *      DESPLAZAMIENTO (course over ground): hacia donde te MUEVES. Otra magnitud.
 *
 * Y la especificacion deja `coords.heading` en null cuando el dispositivo esta quieto, asi
 * que el `?? 0` que habia lo convertia en NORTE: parado leyendo el movil y sin brujula, la
 * flecha afirmaba que mirabas al norte — en silencio, y en cada lectura de GPS. El
 * reescalado por zoom hacia lo mismo, porque llamaba a la plantilla sin rumbo ninguno.
 *
 * Ahora la fuente es una: `_flechaGpsAnguloAcumulado`. Y cuando no hay brujula no se
 * disimula, se avisa — la regla de la casa es que un plan B vale, pero tiene que ser
 * ruidoso.
 *
 * ROJO ANTES QUE VERDE: FS-1 falla si `actualizarMarcadorUsuario` vuelve a aceptar un
 * rumbo posicional; FS-2 si alguien devuelve `coords.heading` al camino de la flecha.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

test.describe('FS — Una sola fuente para el rumbo de la flecha', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15_000 }).catch(() => {});
  });

  test('FS-1. actualizarMarcadorUsuario ya no acepta un rumbo: la firma es (lat, lng, accuracy, modo)', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const f = mod.actualizarMarcadorUsuario;
      if (typeof f !== 'function') return { error: 'no exportada' };
      return {
        // Si alguien reintroduce el parametro, `length` sube y los callers posicionales
        // que se migraron volverian a pasar la precision donde va el modo.
        aridad: f.length,
        fuente: f.toString().slice(0, 160),
      };
    });
    expect(r.error).toBeUndefined();
    expect(r.aridad, 'lat, lng, accuracy y modo — el rumbo ya no es parametro').toBe(2);
    expect(r.fuente, 'ningun parametro llamado heading').not.toMatch(/\(\s*lat\s*,\s*lng\s*,\s*heading/);
  });

  test('FS-2. Ningun camino de la flecha lee coords.heading del GPS', async ({ page }) => {
    // Es OTRA magnitud (a donde te mueves, no a donde miras) y la especificacion la deja
    // en null estando quieto. No puede alimentar la rotacion por ninguna via.
    const r = await page.evaluate(async () => {
      const txt = await (await fetch('/js/funciones-mapa.js')).text();
      const i = txt.indexOf('actualizarMarcadorUsuario(latitude, longitude');
      return {
        llamadaExiste: i >= 0,
        // 600 caracteres antes de la llamada: ahi vivia el `const heading = coords.heading`
        cerca: i >= 0 ? txt.slice(Math.max(0, i - 600), i) : '',
        // En todo el modulo, coords.heading no debe alimentar nada de la flecha. Se miran
        // solo las lineas de CODIGO: el comentario que explica por que no se usa nombra el
        // valor, y contarlo daria un fallo permanente por hablar del problema.
        usaCoordsHeading: txt.split('\n')
          .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
          .some((l) => /coords\??\.heading/.test(l)),
      };
    });
    expect(r.llamadaExiste, 'la llamada real debe seguir existiendo').toBe(true);
    expect(r.cerca, 'no se construye un heading desde el GPS antes de llamar').not.toMatch(/const heading\s*=/);
    expect(r.usaCoordsHeading, 'coords.heading no aparece en el modulo del mapa').toBe(false);
  });

  test('FS-3. Sin lecturas de brujula la flecha apunta arriba, y se avisa una sola vez', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const mod = await import('/js/funciones-mapa.js');
      const avisos = [];
      const orig = console.warn;
      console.warn = (...a) => { avisos.push(a.join(' ')); };
      try {
        // Tres marcadores seguidos, sin ninguna lectura de brujula por delante.
        await mod.actualizarMarcadorUsuario(39.4790, -0.3760, 5, 'aventura');
        await mod.actualizarMarcadorUsuario(39.4791, -0.3761, 5, 'aventura');
        const m = await mod.actualizarMarcadorUsuario(39.4792, -0.3762, 5, 'aventura');
        const h = m?.getElement()?.querySelector('.gps-arrow-heading');
        return {
          transform: h ? h.style.transform : null,
          // El aviso es UNA vez por sesion: en cada lectura de GPS seria ruido inservible.
          avisosFlecha: avisos.filter((t) => /sin rumbo real/.test(t)).length,
        };
      } finally { console.warn = orig; }
    });

    expect(r.transform, 'el marcador debe dibujarse igualmente').not.toBeNull();
    expect(r.transform, 'sin brujula la flecha apunta hacia arriba en pantalla (0 grados)').toContain('rotate(0deg)');
    // Lo que se estaba arreglando: antes esto pasaba en silencio y con el valor equivocado.
    expect(r.avisosFlecha, 'se avisa exactamente una vez, no en cada recreacion').toBe(1);
  });
});
