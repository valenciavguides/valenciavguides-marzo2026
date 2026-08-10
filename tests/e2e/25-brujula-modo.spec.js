/**
 * 25-brujula-modo.spec.js
 *
 * Prueba del menú de modo de cámara (`#brujula-modo`, `codigo-padre.html`) —
 * reescrito de un único botón ("centrar posición") a un desplegable de 3 opciones,
 * mismo patrón que `#selector-tipo-mapa` (botón principal + desplegable que crece
 * hacia arriba): "Norte fijo", "Seguir mi rumbo" y "Centrar mapa en mi ubicación".
 * Posicionado en espejo respecto a `#selector-tipo-mapa`: misma altura (`bottom`),
 * pero en el borde IZQUIERDO de la pantalla con el mismo margen que el selector
 * tiene respecto al derecho — los dos quedan a la misma altura, uno a cada lado.
 * Ver `docs/GUIA-COMPLETA.md` §4.6b y `docs/brujula-y-mapa.md` §4/§11 para el diseño
 * completo. El botón principal muestra siempre `boton-brujula.png` (imagen fija,
 * mismo criterio que `#selector-tipo-mapa` — ver §11) — ya NO refleja el modo activo
 * con un icono/glifo que cambia; el estado real (`_brujulaModoActivo`) es interno y
 * solo observable por sus efectos (qué función invoca, qué revierte solo con el
 * tiempo), no por nada visible en el botón. Por eso estos tests verifican llamadas a
 * `funcionesMapa.*`, no un `textContent` que ya no existe.
 *
 *   BR-1  El contenedor existe, empieza oculto (display:none, sin estilo inline que
 *         lo fuerce a visible) — no debe aparecer antes de que el mapa esté en
 *         pantalla.
 *   BR-2  Misma altura (`bottom`) que `#selector-tipo-mapa`, y el mismo margen desde
 *         el borde izquierdo que el selector tiene desde el derecho (espejado); el
 *         botón principal (hijo, sin id propio) tiene el ancho esperado.
 *   BR-3  Pulsar el botón principal despliega las 3 opciones (max-height > 0);
 *         empieza plegado (max-height 0).
 *   BR-4  Elegir "Norte fijo" llama a `funcionesMapa.desactivarSeguimientoRumbo()` y
 *         cierra el desplegable.
 *   BR-5  Elegir "Seguir mi rumbo" llama a `funcionesMapa.activarSeguimientoRumbo()`.
 *   BR-6  Elegir "Centrar mapa en mi ubicación" llama a
 *         `funcionesMapa.reactivarSeguimientoCamara()`.
 *   BR-7  Si la brújula no responde (permiso denegado/no soportada), "Seguir mi
 *         rumbo" revierte sola a "Norte fijo" ~1.5s después de elegirlo —
 *         `desactivarSeguimientoRumbo()` se invoca sin que el usuario haga nada más.
 *   BR-8  globalThis._resetBrujulaModo() (llamado desde ejecutarElegirOtra()
 *         al elegir otra aventura desde el diálogo de reanudación de sesión, que no
 *         recarga la página) fuerza el reset a "Norte fijo" bajo demanda —
 *         invoca `desactivarSeguimientoRumbo()`.
 *   BR-9  Corrección de una condición de carrera (auditoría): alternar rumbo→norte→
 *         rumbo dos veces en menos de 1.5s no deja que el timeout de auto-reversión
 *         de la PRIMERA elección revierta la SEGUNDA antes de que cumpla su propio
 *         plazo de gracia — el guard compara contra `_brujulaModoSeguimientoActivacionId`, no solo
 *         contra el modo activo. Verificado contando cuántas veces se invoca
 *         `desactivarSeguimientoRumbo()`, no por ningún icono.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('BR — Menú de modo de cámara', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndWaitForFase1(page);
    await page.waitForSelector('#brujula-modo', { state: 'attached', timeout: 15000 });
  });

  test('BR-1. Existe y empieza oculto', async ({ page }) => {
    const info = await page.evaluate(() => {
      const el = document.getElementById('brujula-modo');
      return { existe: !!el, display: el ? getComputedStyle(el).display : null };
    });
    expect(info.existe, 'El contenedor debe existir en el DOM').toBe(true);
    expect(info.display, 'Debe empezar oculto, sin estilo inline forzándolo a visible').toBe('none');
  });

  test('BR-2. Misma altura que #selector-tipo-mapa, espejado (por fórmula) al lado izquierdo; botón principal con el ancho esperado', async ({ page }) => {
    await page.waitForSelector('#selector-tipo-mapa', { state: 'attached', timeout: 15000 });
    const info = await page.evaluate(() => {
      const brujulaModo = getComputedStyle(document.getElementById('brujula-modo'));
      const selector = getComputedStyle(document.getElementById('selector-tipo-mapa'));
      const btnPrincipalBrujula = document.querySelector('#brujula-modo > div:first-child');
      const btnPrincipalSelector = document.querySelector('#selector-tipo-mapa > div:first-child');
      // getComputedStyle().getPropertyValue('--franja-lateral') devuelve el texto crudo
      // ("clamp(62px, 7.2vh, 80px)"), no un píxel resuelto — un custom property con
      // calc()/clamp() no se resuelve así. Sonda temporal: un div con
      // width:var(--franja-lateral) sí resuelve a píxeles reales en su computed style.
      const _sonda = document.createElement('div');
      _sonda.style.cssText = 'position:absolute;visibility:hidden;width:var(--franja-lateral);';
      document.body.appendChild(_sonda);
      const franjaLateral = parseFloat(getComputedStyle(_sonda).width);
      _sonda.remove();
      return {
        bottomBrujulaModo: brujulaModo.bottom, bottomSelector: selector.bottom,
        leftBrujulaModo: parseFloat(brujulaModo.left), rightSelector: parseFloat(selector.right),
        anchoPrincipalBrujula: btnPrincipalBrujula ? parseFloat(getComputedStyle(btnPrincipalBrujula).width) : NaN,
        anchoPrincipalSelector: btnPrincipalSelector ? parseFloat(getComputedStyle(btnPrincipalSelector).width) : NaN,
        franjaLateral,
      };
    });
    expect(info.bottomBrujulaModo, 'Misma altura (bottom) que el selector de mapa').toBe(info.bottomSelector);
    // El botón principal de la brújula es un 1% más grande que el del selector (a
    // propósito) — ya no son el mismo tamaño, así que "espejado" ya no significa
    // "mismo left que right", sino que cada uno sigue su propia fórmula
    // (4px + mitad de franja - mitad de SU PROPIO ancho), con el corner point de
    // referencia compartido pero el resultado final ligeramente distinto.
    expect(info.leftBrujulaModo, 'left de la brújula sigue su propia fórmula (4px + franja/2 - su propio ancho/2)')
      .toBeCloseTo(4 + info.franjaLateral / 2 - info.anchoPrincipalBrujula / 2, 1);
    expect(info.rightSelector, 'right del selector sigue su propia fórmula (4px + franja/2 - su propio ancho/2)')
      .toBeCloseTo(4 + info.franjaLateral / 2 - info.anchoPrincipalSelector / 2, 1);
    expect(info.anchoPrincipalBrujula, 'Botón principal de la brújula es un 1% más grande que el del selector')
      .toBeGreaterThan(info.anchoPrincipalSelector);
    expect(info.anchoPrincipalBrujula, 'Ancho del botón principal en el rango esperado (clamp ~36-52px, +1%)').toBeGreaterThanOrEqual(36);
    expect(info.anchoPrincipalBrujula).toBeLessThanOrEqual(53);
  });

  test('BR-3. El botón principal despliega y pliega las 3 opciones', async ({ page }) => {
    // El cálculo de altura disponible usa getBoundingClientRect(), que solo da valores
    // reales con el elemento visible (display:none siempre da 0) — se fuerza aquí igual
    // que en el resto de tests de interacción de este fichero.
    await page.evaluate(() => { document.getElementById('brujula-modo').style.display = 'flex'; });

    const antes = await page.evaluate(() => {
      const opciones = document.querySelectorAll('#brujula-modo > div:last-child > div');
      return { numOpciones: opciones.length, maxHeight: document.querySelector('#brujula-modo > div:last-child').style.maxHeight };
    });
    expect(antes.numOpciones, 'Debe haber exactamente 3 opciones en el desplegable').toBe(3);
    expect(antes.maxHeight, 'Empieza plegado').toBe('0px');

    await page.evaluate(() => document.querySelector('#brujula-modo > div:first-child').click());
    const trasAbrir = await page.evaluate(() => document.querySelector('#brujula-modo > div:last-child').style.maxHeight);
    expect(trasAbrir, 'Tras pulsar el botón principal, debe desplegarse (max-height > 0)').not.toBe('0px');

    await page.evaluate(() => document.querySelector('#brujula-modo > div:first-child').click());
    const trasCerrar = await page.evaluate(() => document.querySelector('#brujula-modo > div:last-child').style.maxHeight);
    expect(trasCerrar, 'Un segundo toque debe plegarlo de nuevo').toBe('0px');
  });

  test('BR-4. "Norte fijo" llama a desactivarSeguimientoRumbo() y cierra el desplegable', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('brujula-modo').style.display = 'flex';
      let llamado = false;
      const original = globalThis.funcionesMapa.desactivarSeguimientoRumbo;
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { llamado = true; };

      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#brujula-modo > div:last-child > div');
      opciones[0].click(); // "Norte fijo" — primera opción del array _MODOS_BRUJULA

      const maxHeightTrasElegir = document.querySelector('#brujula-modo > div:last-child').style.maxHeight;
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = original;
      return { llamado, maxHeightTrasElegir };
    });

    expect(resultado.llamado, 'Elegir "Norte fijo" debe invocar desactivarSeguimientoRumbo()').toBe(true);
    expect(resultado.maxHeightTrasElegir, 'Elegir una opción debe cerrar el desplegable').toBe('0px');
  });

  test('BR-5. "Seguir mi rumbo" llama a activarSeguimientoRumbo()', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('brujula-modo').style.display = 'flex';
      let llamado = false;
      const original = globalThis.funcionesMapa.activarSeguimientoRumbo;
      globalThis.funcionesMapa.activarSeguimientoRumbo = () => { llamado = true; };

      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#brujula-modo > div:last-child > div');
      opciones[1].click(); // "Seguir mi rumbo" — segunda opción del array _MODOS_BRUJULA

      globalThis.funcionesMapa.activarSeguimientoRumbo = original;
      return { llamado };
    });

    expect(resultado.llamado, 'Elegir "Seguir mi rumbo" debe invocar activarSeguimientoRumbo()').toBe(true);
  });

  test('BR-6. "Centrar mapa en mi ubicación" llama a reactivarSeguimientoCamara()', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('brujula-modo').style.display = 'flex';
      let llamado = false;
      const original = globalThis.funcionesMapa.reactivarSeguimientoCamara;
      globalThis.funcionesMapa.reactivarSeguimientoCamara = () => { llamado = true; };

      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#brujula-modo > div:last-child > div');
      opciones[2].click(); // "Centrar mapa en mi ubicación" — tercera opción

      globalThis.funcionesMapa.reactivarSeguimientoCamara = original;
      return { llamado };
    });

    expect(resultado.llamado, 'Elegir "Centrar mapa en mi ubicación" debe invocar reactivarSeguimientoCamara()').toBe(true);
  });

  test('BR-7. "Seguir mi rumbo" revierte sola a "Norte fijo" si la brújula no responde en ~1.5s', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const inmediato = await page.evaluate(() => {
      document.getElementById('brujula-modo').style.display = 'flex';
      let llamadaActivar = false, llamadaDesactivar = false;
      globalThis.funcionesMapa.activarSeguimientoRumbo = () => { llamadaActivar = true; };
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { llamadaDesactivar = true; };
      // Simula brújula caída (permiso denegado / no soportada) — nunca responde 'true'.
      globalThis.funcionesMapa.brujulaEstaActiva = () => false;
      globalThis.__llamadas = () => ({ llamadaActivar, llamadaDesactivar });

      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#brujula-modo > div:last-child > div');
      opciones[1].click(); // "Seguir mi rumbo"

      return globalThis.__llamadas();
    });

    expect(inmediato.llamadaActivar, 'Elegir "Seguir mi rumbo" debe invocar activarSeguimientoRumbo() de inmediato').toBe(true);
    expect(inmediato.llamadaDesactivar, 'Antes de que pase el timeout, no debe haber revertido todavía').toBe(false);

    await page.waitForTimeout(1700); // deja pasar el timeout de auto-reversión (1500ms)

    const trasEspera = await page.evaluate(() => globalThis.__llamadas());

    expect(trasEspera.llamadaDesactivar, 'Tras ~1.5s sin brújula activa, debe revertir llamando a desactivarSeguimientoRumbo()').toBe(true);
  });

  test('BR-8. globalThis._resetBrujulaModo() devuelve el menú a "Norte fijo" bajo demanda', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('brujula-modo').style.display = 'flex';
      let llamadaDesactivar = false;
      const original = globalThis.funcionesMapa.desactivarSeguimientoRumbo;
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { llamadaDesactivar = true; };

      // Simula haber elegido "Seguir mi rumbo" en la aventura abandonada, sin esperar a
      // la reversión automática de BR-7 (se llama al hook de reset directamente y rápido).
      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      document.querySelectorAll('#brujula-modo > div:last-child > div')[1].click(); // "Seguir mi rumbo"

      const existe = typeof globalThis._resetBrujulaModo === 'function';
      globalThis._resetBrujulaModo?.();

      globalThis.funcionesMapa.desactivarSeguimientoRumbo = original;
      return { existe, llamadaDesactivar };
    });

    expect(resultado.existe, 'globalThis._resetBrujulaModo debe existir como función').toBe(true);
    expect(resultado.llamadaDesactivar, 'El reset debe invocar desactivarSeguimientoRumbo()').toBe(true);
  });

  test('BR-9. Un timeout de auto-reversión viejo no revierte una elección de "rumbo" más reciente', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    await page.evaluate(() => {
      document.getElementById('brujula-modo').style.display = 'flex';
      globalThis.funcionesMapa.activarSeguimientoRumbo = () => {};
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { globalThis.__vv_llamadasDesactivar = (globalThis.__vv_llamadasDesactivar || 0) + 1; };
      // Brújula caída durante todo el test — sin esto, ninguna de las dos elecciones
      // de "rumbo" llegaría a armar su timeout de auto-reversión.
      globalThis.funcionesMapa.brujulaEstaActiva = () => false;
    });

    const elegirRumbo = () => page.evaluate(() => {
      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      document.querySelectorAll('#brujula-modo > div:last-child > div')[1].click(); // "Seguir mi rumbo"
    });
    const elegirNorte = () => page.evaluate(() => {
      document.querySelector('#brujula-modo > div:first-child').click(); // abrir
      document.querySelectorAll('#brujula-modo > div:last-child > div')[0].click(); // "Norte fijo"
    });

    // t=0: elige "rumbo" (activación A, arma un timeout para t≈1500).
    await elegirRumbo();

    await page.waitForTimeout(800);
    // t=800: "Norte fijo" explícito (llama a desactivarSeguimientoRumbo — se descuenta
    // del contador antes de continuar, para medir solo lo que pasa DESPUÉS de esto).
    await elegirNorte();
    await page.evaluate(() => { globalThis.__vv_llamadasDesactivar = 0; });
    // t≈800: elige "rumbo" otra vez (activación B, arma un SEGUNDO timeout para t≈2300).
    await elegirRumbo();

    // t≈1700: el timeout de la activación A (armado en t=0, dispara en t≈1500) ya debería
    // haber intentado ejecutarse. Con el bug, revertiría aquí — antes de que B cumpla su
    // propio plazo de 1.5s (que termina en t≈2300).
    await page.waitForTimeout(900);
    const trasTimeoutViejo = await page.evaluate(() => globalThis.__vv_llamadasDesactivar);
    expect(trasTimeoutViejo, 'El timeout viejo (de la primera elección) no debe revertir la elección nueva').toBe(0);

    // t≈2500: el timeout de la activación B (armado en t≈800, dispara en t≈2300) ya
    // debería haberse ejecutado — ahora sí debe revertir, con su propio plazo cumplido.
    await page.waitForTimeout(800);
    const trasTimeoutNuevo = await page.evaluate(() => globalThis.__vv_llamadasDesactivar);
    expect(trasTimeoutNuevo, 'El timeout de la elección más reciente sí debe revertir, cumplido su propio plazo').toBe(1);
  });
});
