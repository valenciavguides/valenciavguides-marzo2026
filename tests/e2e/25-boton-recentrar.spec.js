/**
 * 25-boton-recentrar.spec.js
 *
 * Prueba del menú de modo de cámara (`#btn-recentrar`, `codigo-padre.html`) —
 * reescrito de un único botón ("centrar posición") a un desplegable de 3 opciones,
 * mismo patrón que `#selector-tipo-mapa` (botón principal + desplegable que crece
 * hacia arriba): "Norte fijo", "Seguir mi rumbo" y "Centrar mapa en mi ubicación".
 * Ver `docs/GUIA-COMPLETA.md` §4.6b y `docs/brujula-y-mapa.md` §4 para el diseño
 * completo, incluida la razón de por qué "Centrar" no cambia el icono del modo
 * activo (es una acción puntual, no un modo persistente como los otros dos).
 *
 *   BR-1  El contenedor existe, empieza oculto (display:none, sin estilo inline que
 *         lo fuerce a visible) — no debe aparecer antes de que el mapa esté en
 *         pantalla.
 *   BR-2  Mismo `right` y `z-index` (justo por debajo) que `#selector-tipo-mapa`; el
 *         botón principal (hijo, sin id propio) tiene el ancho esperado.
 *   BR-3  Pulsar el botón principal despliega las 3 opciones (max-height > 0);
 *         empieza plegado (max-height 0).
 *   BR-4  Elegir "Norte fijo" llama a `funcionesMapa.desactivarSeguimientoRumbo()` y
 *         cierra el desplegable.
 *   BR-5  Elegir "Seguir mi rumbo" llama a `funcionesMapa.activarSeguimientoRumbo()`
 *         y el icono del botón principal cambia para reflejarlo.
 *   BR-6  Elegir "Centrar mapa en mi ubicación" llama a
 *         `funcionesMapa.reactivarSeguimientoCamara()` SIN cambiar el icono del modo
 *         activo (acción puntual, no un modo persistente).
 *   BR-7  Si la brújula no responde (permiso denegado/no soportada), "Seguir mi
 *         rumbo" revierte solo a "Norte fijo" ~1.5s después de elegirlo, sin dejar el
 *         icono mintiendo sobre un modo ya muerto.
 *   BR-8  globalThis._resetModoCamaraRecentrar() (llamado desde ejecutarElegirOtra()
 *         al elegir otra aventura desde el diálogo de reanudación de sesión, que no
 *         recarga la página) devuelve el menú a "Norte fijo" bajo demanda.
 *   BR-9  Corrección de una condición de carrera (auditoría): alternar rumbo→norte→
 *         rumbo dos veces en menos de 1.5s no deja que el timeout de auto-reversión
 *         de la PRIMERA elección revierta la SEGUNDA antes de que cumpla su propio
 *         plazo de gracia — el guard compara contra `_rumboActivacionId`, no solo
 *         contra el modo activo.
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
    await page.waitForSelector('#btn-recentrar', { state: 'attached', timeout: 15000 });
  });

  test('BR-1. Existe y empieza oculto', async ({ page }) => {
    const info = await page.evaluate(() => {
      const el = document.getElementById('btn-recentrar');
      return { existe: !!el, display: el ? getComputedStyle(el).display : null };
    });
    expect(info.existe, 'El contenedor debe existir en el DOM').toBe(true);
    expect(info.display, 'Debe empezar oculto, sin estilo inline forzándolo a visible').toBe('none');
  });

  test('BR-2. Mismo right/z-index que #selector-tipo-mapa; botón principal con el ancho esperado', async ({ page }) => {
    await page.waitForSelector('#selector-tipo-mapa', { state: 'attached', timeout: 15000 });
    const info = await page.evaluate(() => {
      const recentrar = getComputedStyle(document.getElementById('btn-recentrar'));
      const selector = getComputedStyle(document.getElementById('selector-tipo-mapa'));
      const btnPrincipal = document.querySelector('#btn-recentrar > div:first-child');
      return {
        rightRecentrar: recentrar.right, rightSelector: selector.right,
        zRecentrar: Number(recentrar.zIndex), zSelector: Number(selector.zIndex),
        anchoPrincipalPx: btnPrincipal ? parseFloat(getComputedStyle(btnPrincipal).width) : NaN,
      };
    });
    expect(info.rightRecentrar, 'Misma distancia al borde derecho que el selector de mapa').toBe(info.rightSelector);
    expect(info.zRecentrar).toBeLessThan(info.zSelector);
    expect(info.anchoPrincipalPx, 'Ancho del botón principal en el rango esperado (clamp 36-52px)').toBeGreaterThanOrEqual(36);
    expect(info.anchoPrincipalPx).toBeLessThanOrEqual(52);
  });

  test('BR-3. El botón principal despliega y pliega las 3 opciones', async ({ page }) => {
    // El cálculo de altura disponible usa getBoundingClientRect(), que solo da valores
    // reales con el elemento visible (display:none siempre da 0) — se fuerza aquí igual
    // que en el resto de tests de interacción de este fichero.
    await page.evaluate(() => { document.getElementById('btn-recentrar').style.display = 'flex'; });

    const antes = await page.evaluate(() => {
      const opciones = document.querySelectorAll('#btn-recentrar > div:last-child > div');
      return { numOpciones: opciones.length, maxHeight: document.querySelector('#btn-recentrar > div:last-child').style.maxHeight };
    });
    expect(antes.numOpciones, 'Debe haber exactamente 3 opciones en el desplegable').toBe(3);
    expect(antes.maxHeight, 'Empieza plegado').toBe('0px');

    await page.evaluate(() => document.querySelector('#btn-recentrar > div:first-child').click());
    const trasAbrir = await page.evaluate(() => document.querySelector('#btn-recentrar > div:last-child').style.maxHeight);
    expect(trasAbrir, 'Tras pulsar el botón principal, debe desplegarse (max-height > 0)').not.toBe('0px');

    await page.evaluate(() => document.querySelector('#btn-recentrar > div:first-child').click());
    const trasCerrar = await page.evaluate(() => document.querySelector('#btn-recentrar > div:last-child').style.maxHeight);
    expect(trasCerrar, 'Un segundo toque debe plegarlo de nuevo').toBe('0px');
  });

  test('BR-4. "Norte fijo" llama a desactivarSeguimientoRumbo() y cierra el desplegable', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('btn-recentrar').style.display = 'flex';
      let llamado = false;
      const original = globalThis.funcionesMapa.desactivarSeguimientoRumbo;
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { llamado = true; };

      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#btn-recentrar > div:last-child > div');
      opciones[0].click(); // "Norte fijo" — primera opción del array _MODOS_CAMARA

      const maxHeightTrasElegir = document.querySelector('#btn-recentrar > div:last-child').style.maxHeight;
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = original;
      return { llamado, maxHeightTrasElegir };
    });

    expect(resultado.llamado, 'Elegir "Norte fijo" debe invocar desactivarSeguimientoRumbo()').toBe(true);
    expect(resultado.maxHeightTrasElegir, 'Elegir una opción debe cerrar el desplegable').toBe('0px');
  });

  test('BR-5. "Seguir mi rumbo" llama a activarSeguimientoRumbo() y cambia el icono del botón principal', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('btn-recentrar').style.display = 'flex';
      let llamado = false;
      const original = globalThis.funcionesMapa.activarSeguimientoRumbo;
      globalThis.funcionesMapa.activarSeguimientoRumbo = () => { llamado = true; };

      const iconoAntes = document.querySelector('#btn-recentrar > div:first-child').textContent;
      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#btn-recentrar > div:last-child > div');
      opciones[1].click(); // "Seguir mi rumbo" — segunda opción del array _MODOS_CAMARA
      const iconoDespues = document.querySelector('#btn-recentrar > div:first-child').textContent;

      globalThis.funcionesMapa.activarSeguimientoRumbo = original;
      return { llamado, iconoAntes, iconoDespues };
    });

    expect(resultado.llamado, 'Elegir "Seguir mi rumbo" debe invocar activarSeguimientoRumbo()').toBe(true);
    expect(resultado.iconoDespues, `El icono del botón principal debe cambiar para reflejar el nuevo modo (antes=${resultado.iconoAntes})`).not.toBe(resultado.iconoAntes);
  });

  test('BR-6. "Centrar mapa en mi ubicación" llama a reactivarSeguimientoCamara() SIN cambiar el icono del modo activo', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('btn-recentrar').style.display = 'flex';
      let llamado = false;
      const original = globalThis.funcionesMapa.reactivarSeguimientoCamara;
      globalThis.funcionesMapa.reactivarSeguimientoCamara = () => { llamado = true; };

      const iconoAntes = document.querySelector('#btn-recentrar > div:first-child').textContent;
      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#btn-recentrar > div:last-child > div');
      opciones[2].click(); // "Centrar mapa en mi ubicación" — tercera opción
      const iconoDespues = document.querySelector('#btn-recentrar > div:first-child').textContent;

      globalThis.funcionesMapa.reactivarSeguimientoCamara = original;
      return { llamado, iconoAntes, iconoDespues };
    });

    expect(resultado.llamado, 'Elegir "Centrar mapa en mi ubicación" debe invocar reactivarSeguimientoCamara()').toBe(true);
    expect(resultado.iconoDespues, 'El icono no debe cambiar — "centrar" es una acción puntual, no un modo persistente').toBe(resultado.iconoAntes);
  });

  test('BR-7. "Seguir mi rumbo" revierte sola a "Norte fijo" si la brújula no responde en ~1.5s', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const inmediato = await page.evaluate(() => {
      document.getElementById('btn-recentrar').style.display = 'flex';
      let llamadaActivar = false, llamadaDesactivar = false;
      globalThis.funcionesMapa.activarSeguimientoRumbo = () => { llamadaActivar = true; };
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { llamadaDesactivar = true; };
      // Simula brújula caída (permiso denegado / no soportada) — nunca responde 'true'.
      globalThis.funcionesMapa.brujulaEstaActiva = () => false;
      globalThis.__llamadas = () => ({ llamadaActivar, llamadaDesactivar });

      const iconoInicial = document.querySelector('#btn-recentrar > div:first-child').textContent;
      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      const opciones = document.querySelectorAll('#btn-recentrar > div:last-child > div');
      opciones[1].click(); // "Seguir mi rumbo"
      const iconoTrasElegir = document.querySelector('#btn-recentrar > div:first-child').textContent;

      return { iconoInicial, iconoTrasElegir, ...globalThis.__llamadas() };
    });

    expect(inmediato.llamadaActivar, 'Elegir "Seguir mi rumbo" debe invocar activarSeguimientoRumbo() de inmediato').toBe(true);
    expect(inmediato.iconoTrasElegir, 'El icono debe cambiar de inmediato al elegir el modo').not.toBe(inmediato.iconoInicial);
    expect(inmediato.llamadaDesactivar, 'Antes de que pase el timeout, no debe haber revertido todavía').toBe(false);

    await page.waitForTimeout(1700); // deja pasar el timeout de auto-reversión (1500ms)

    const trasEspera = await page.evaluate(() => ({
      icono: document.querySelector('#btn-recentrar > div:first-child').textContent,
      ...globalThis.__llamadas(),
    }));

    expect(trasEspera.llamadaDesactivar, 'Tras ~1.5s sin brújula activa, debe revertir llamando a desactivarSeguimientoRumbo()').toBe(true);
    expect(trasEspera.icono, 'El icono debe volver al de "Norte fijo"').toBe(inmediato.iconoInicial);
  });

  test('BR-8. globalThis._resetModoCamaraRecentrar() devuelve el menú a "Norte fijo" bajo demanda', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    const resultado = await page.evaluate(() => {
      document.getElementById('btn-recentrar').style.display = 'flex';
      let llamadaDesactivar = false;
      const original = globalThis.funcionesMapa.desactivarSeguimientoRumbo;
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { llamadaDesactivar = true; };

      const iconoInicial = document.querySelector('#btn-recentrar > div:first-child').textContent;

      // Simula haber elegido "Seguir mi rumbo" en la aventura abandonada, sin esperar a
      // la reversión automática de BR-7 (se llama al hook de reset directamente y rápido).
      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      document.querySelectorAll('#btn-recentrar > div:last-child > div')[1].click(); // "Seguir mi rumbo"
      const iconoTrasElegir = document.querySelector('#btn-recentrar > div:first-child').textContent;

      const existe = typeof globalThis._resetModoCamaraRecentrar === 'function';
      globalThis._resetModoCamaraRecentrar?.();
      const iconoTrasReset = document.querySelector('#btn-recentrar > div:first-child').textContent;

      globalThis.funcionesMapa.desactivarSeguimientoRumbo = original;
      return { existe, iconoInicial, iconoTrasElegir, iconoTrasReset, llamadaDesactivar };
    });

    expect(resultado.existe, 'globalThis._resetModoCamaraRecentrar debe existir como función').toBe(true);
    expect(resultado.iconoTrasElegir, 'Precondición: el icono debe haber cambiado al elegir "Seguir mi rumbo"').not.toBe(resultado.iconoInicial);
    expect(resultado.llamadaDesactivar, 'El reset debe invocar desactivarSeguimientoRumbo()').toBe(true);
    expect(resultado.iconoTrasReset, 'El icono debe volver al de "Norte fijo" tras el reset').toBe(resultado.iconoInicial);
  });

  test('BR-9. Un timeout de auto-reversión viejo no revierte una elección de "rumbo" más reciente', async ({ page }) => {
    await page.waitForFunction(() => typeof globalThis.funcionesMapa === 'object', null, { timeout: 15000 }).catch(() => {});

    await page.evaluate(() => {
      document.getElementById('btn-recentrar').style.display = 'flex';
      globalThis.funcionesMapa.activarSeguimientoRumbo = () => {};
      globalThis.funcionesMapa.desactivarSeguimientoRumbo = () => { globalThis.__vv_llamadasDesactivar = (globalThis.__vv_llamadasDesactivar || 0) + 1; };
      // Brújula caída durante todo el test — sin esto, ninguna de las dos elecciones
      // de "rumbo" llegaría a armar su timeout de auto-reversión.
      globalThis.funcionesMapa.brujulaEstaActiva = () => false;
    });

    const elegirRumbo = () => page.evaluate(() => {
      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      document.querySelectorAll('#btn-recentrar > div:last-child > div')[1].click(); // "Seguir mi rumbo"
    });
    const elegirNorte = () => page.evaluate(() => {
      document.querySelector('#btn-recentrar > div:first-child').click(); // abrir
      document.querySelectorAll('#btn-recentrar > div:last-child > div')[0].click(); // "Norte fijo"
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
    const trasTimeoutViejo = await page.evaluate(() => ({
      llamadas: globalThis.__vv_llamadasDesactivar,
      icono: document.querySelector('#btn-recentrar > div:first-child').textContent,
    }));
    expect(trasTimeoutViejo.llamadas, 'El timeout viejo (de la primera elección) no debe revertir la elección nueva').toBe(0);
    expect(trasTimeoutViejo.icono, 'El modo debe seguir siendo "Seguir mi rumbo" (icono sin cambiar)').toBe('➤');

    // t≈2500: el timeout de la activación B (armado en t≈800, dispara en t≈2300) ya
    // debería haberse ejecutado — ahora sí debe revertir, con su propio plazo cumplido.
    await page.waitForTimeout(800);
    const trasTimeoutNuevo = await page.evaluate(() => ({
      llamadas: globalThis.__vv_llamadasDesactivar,
      icono: document.querySelector('#btn-recentrar > div:first-child').textContent,
    }));
    expect(trasTimeoutNuevo.llamadas, 'El timeout de la elección más reciente sí debe revertir, cumplido su propio plazo').toBe(1);
    expect(trasTimeoutNuevo.icono, 'El icono debe volver al de "Norte fijo"').toBe('N');
  });
});
