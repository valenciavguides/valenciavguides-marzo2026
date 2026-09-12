/**
 * 66 — El rescate de un tramo por TTL deja de ser silencioso
 *
 * POR QUE EXISTE
 *
 * Si un tramo lleva 10 min sin poder confirmar su llegada, el barrido de TTL lo desbloquea
 * para que un usuario genuinamente atascado —obras, calle cortada, un evento— no se quede
 * sin salida. El mecanismo esta acotado (tope por aventura y un minimo de progreso entre
 * rescates), pero mostraba el cartel NORMAL de complecion: el usuario recibia exactamente
 * el mismo mensaje que si hubiera llegado andando y no tenia forma de distinguirlos.
 *
 * Eso es un segundo camino silencioso. La regla del proyecto no es "prohibido el plan B":
 * es que un plan B mudo convierte un fallo en invisible. Ahora tiene su propio cartel, que
 * NUNCA dice "ha llegado" y que dice cuantas excepciones van de cuantas.
 *
 * Con el radio de llegada bajando a 15 m (§64) esto importa mas que antes, no menos: se
 * confirmaran menos llegadas por GPS y el rescate saltara con mas frecuencia.
 *
 * ROJO ANTES QUE VERDE: RT-1 falla si el cartel vuelve a no existir; RT-2 si el reparto
 * deja de consultar la marca; RT-3 si los topes vuelven a ser una constante unica.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

test.describe('RT — El rescate de un tramo se anuncia como lo que es', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    // Espera explicita a lo que estos tests invocan. El `?.()` de abajo NO falla si la
    // funcion no esta: simplemente no hace nada, y el test cae con el cartel a null solo
    // en tanda completa — verde en solitario, rojo en tanda. Es el flake del EJE 23, y
    // aqui lo introducia el propio test.
    await page.waitForFunction(
      () => typeof globalThis._mostrarCartelRescateTramo === 'function'
        && typeof globalThis._ejecutarBarridoTTLPending === 'function',
      null, { timeout: 15_000 }
    );
  });

  test('RT-1. El cartel dice que no se pudo confirmar, y NO que ha llegado', async ({ page }) => {
    const r = await page.evaluate(async () => {
      globalThis.idiomaSeleccionado = 'es';
      document.getElementById('cartel-rescate-tramo')?.remove();
      await globalThis._mostrarCartelRescateTramo?.('Plaza Redonda → Plaza Milagro del Mocaoret', 2, 5);
      const el = document.getElementById('cartel-rescate-tramo');
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : null;
    });

    expect(r, 'el cartel debe existir en el DOM').not.toBeNull();
    expect(r, 'debe admitir que no pudo confirmar la llegada').toContain('No hemos podido confirmar su llegada');
    expect(r, 'debe nombrar el tramo').toContain('Plaza Redonda');
    expect(r, 'debe decir cuantas excepciones van de cuantas').toContain('2 de 5');
    expect(r, 'debe pedir avanzar').toContain('pulse el botón avanzar');
    // Lo que se estaba arreglando: el rescate no puede disfrazarse de llegada real.
    expect(r, 'NUNCA debe afirmar una llegada').not.toContain('Ha llegado');
  });

  test('RT-2. Esta en la lista anti-solape y el reparto consulta la marca de rescate', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const txt = await (await fetch('./codigo-padre.html')).text();
      return {
        // Un cartel fuera de esta lista puede solaparse con cualquiera de los otros (§37.5).
        registrado: /_TODOS_LOS_CARTELES_IDS\s*=\s*\[[^\]]*'cartel-rescate-tramo'/.test(txt),
        // El TTL deja la marca al gastar un rescate...
        ttlMarca: /est\._rescateTramoPendiente\s*=\s*\{\s*clave:/.test(txt),
        // ...con la clave NORMALIZADA. Guardarla como la del pending ("padre-TR5") no
        // coincide nunca con la que calcula marcarParadaCompletada ("Av1-TR-5"), y el
        // cartel se quedaba sin disparar en silencio. Lo cazo RT-4, no esta comprobacion.
        claveNormalizada: /_claveRescate\s*=[\s\S]{0,160}replace\(\/\^padre-\//.test(txt),
        // ...y el reparto de carteles la consume ANTES de elegir el cartel normal.
        repartoConsume: /const _rescate = estado\._rescateTramoPendiente;[\s\S]{0,300}_mostrarCartelRescateTramo/.test(txt),
      };
    });
    expect(r.registrado, "'cartel-rescate-tramo' debe estar en _TODOS_LOS_CARTELES_IDS").toBe(true);
    expect(r.ttlMarca, 'el barrido TTL deja la marca al gastar un rescate').toBe(true);
    expect(r.claveNormalizada, 'la marca guarda la clave sin el prefijo padre-').toBe(true);
    expect(r.repartoConsume, 'el reparto muestra el cartel de rescate en vez del normal').toBe(true);
  });

  test('RT-3. Los topes son por aventura: 5 por defecto, 12 en Av34km con 5% de progreso', async ({ page }) => {
    // Av34km son 34 km y 239 elementos: mas recorrido, mas probabilidad de topar con algo.
    // Y el minimo de progreso TIENE que bajar con el tope: con el 20% por defecto solo caben
    // cinco rescates en toda la aventura (0/20/40/60/80), asi que 12 serian inalcanzables.
    const r = await page.evaluate(async () => {
      const txt = await (await fetch('./codigo-padre.html')).text();
      const m = txt.match(/const LIMITES_RESCATE = \{([^}]*\}[^}]*)\};/);
      const def = txt.match(/LIMITES_RESCATE\[globalThis\.aventuraSeleccionada\] \|\| \{ max: (\d+), progresoMinimo: ([\d.]+) \}/);
      return {
        bloque: m ? m[1].replace(/\s+/g, ' ').trim() : null,
        defMax: def ? Number(def[1]) : null,
        defProgreso: def ? Number(def[2]) : null,
      };
    });

    expect(r.bloque, 'debe existir un mapa de limites por aventura').not.toBeNull();
    expect(r.bloque, 'Av34km tiene su propio tope').toContain('Aventura34km');
    expect(r.bloque, 'de 12 rescates').toContain('max: 12');
    expect(r.bloque, 'y 5% de progreso entre ellos, o los 12 no caben').toContain('progresoMinimo: 0.05');
    expect(r.defMax, 'el resto de aventuras se quedan en 5').toBe(5);
    expect(r.defProgreso, 'con el 20% de progreso de siempre').toBe(0.2);

    // Comprobacion aritmetica de que los 12 CABEN: con 5% entre rescates, el techo teorico
    // es 1/0.05 = 20 > 12. Con el 20% seria 5, y los 12 serian nominales.
    expect(Math.floor(1 / 0.05), 'con 5% caben mas de 12').toBeGreaterThanOrEqual(12);
    expect(Math.floor(1 / r.defProgreso), 'con 20% solo caben 5').toBe(5);
  });
  test('RT-4. El barrido de TTL real gasta un rescate y saca ESE cartel, no el normal', async ({ page }) => {
    // La cadena entera, sin simular ninguna pieza: se siembra un tramo con su pending
    // caducado y sin llegada, se ejecuta el barrido de verdad (`_ejecutarBarridoTTLPending`,
    // extraido a funcion con nombre justamente para poder invocarlo sin esperar sus 60 s), y
    // se mira que cartel acaba en el DOM. Es lo unico que prueba que la marca del TTL llega
    // hasta el reparto: RT-2 solo comprueba que el codigo esta escrito.
    // Los datos de aventura no estan cargados al terminar FASE 1: se piden a proposito
    // (§"Proteccion pasiva por parada"). Sin esto el test se autosaltaba, y un test que se
    // salta no prueba nada. Mismo arranque que usa 15-arribo-y-progresion.
    await page.waitForFunction(
      () => typeof globalThis.__cargarDatosAventuraDiferidos === 'function'
        && typeof globalThis.estado === 'object' && globalThis.estado !== null,
      null, { timeout: 15_000 }
    ).catch(() => {});

    const r = await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
        await globalThis.__cargarDatosAventuraDiferidos();
      }

      const est = globalThis.estado;
      const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
      // Un tramo PASADO el 20 % de la aventura, no el primero: el rescate exige ese
      // progreso minimo desde el salto anterior (y `progresoEnUltimoSkip` arranca en 0), asi
      // que en los primeros elementos no se concede ninguno. Es la puerta funcionando, no un
      // fallo — pero un escenario que empiece en el primer tramo no llega a ejercitar nada.
      const desde = Math.ceil((elementos?.length || 0) * 0.3);
      const tramo = elementos?.slice(desde).find(e => e.tipo === 'tramo');
      if (!est || !tramo) return { error: 'sin datos de aventura en este entorno' };

      if (!est.modo) est.modo = {};
      est.modo.actual = 'aventura';
      est.elementoActual = tramo;
      est.indiceProgreso = elementos.indexOf(tramo);
      est.paradasCompletadas = new Map();
      est.tramoSkipsUsados = 0;
      est.progresoEnUltimoSkip = 0;
      est._rescateTramoPendiente = null;

      const clave = tramo.padreid;
      est.pendingCompleciones = {
        [clave]: {
          tipo: 'tramo',
          llegada: false,          // lo que el rescate va a desbloquear
          audio: true,             // ya resuelto: el TTL no rescata audio
          reto: false, retosTotal: 0, retosCompletadosCount: 0,
          ttlMs: 1,                // caducado
          timestamp: Date.now() - 60_000,
        },
      };

      document.getElementById('cartel-rescate-tramo')?.remove();
      document.getElementById('cartel-transicion')?.remove();
      document.getElementById('cartel-inicio-tramo')?.remove();

      globalThis._ejecutarBarridoTTLPending?.();
      await new Promise((res) => setTimeout(res, 400));   // el cartel importa sus traducciones

      const rescate = document.getElementById('cartel-rescate-tramo');
      return {
        progreso: (typeof globalThis._calcularProgresoFraccion === 'function') ? globalThis._calcularProgresoFraccion() : 0,
        saltosUsados: est.tramoSkipsUsados,
        llegadaDesbloqueada: est.pendingCompleciones?.[clave]?.llegada ?? 'pending ya consumido',
        hayCartelRescate: !!rescate,
        textoRescate: rescate ? rescate.textContent.replace(/\s+/g, ' ').trim() : null,
        hayCartelNormal: !!document.getElementById('cartel-transicion') || !!document.getElementById('cartel-inicio-tramo'),
        marcaConsumida: est._rescateTramoPendiente === null,
      };
    });

    test.skip(!!r.error, `Precondicion no disponible: ${r.error}`);
    expect(r.progreso, 'el escenario debe estar pasado el 20% o la puerta de progreso lo frena').toBeGreaterThanOrEqual(0.2);
    expect(r.saltosUsados, 'el barrido debe haber gastado un rescate').toBe(1);
    expect(r.hayCartelRescate, 'debe salir el cartel de rescate').toBe(true);
    expect(r.textoRescate, 'y debe ser el primero de los 5').toContain('1 de 5');
    expect(r.textoRescate, 'sin afirmar una llegada').not.toContain('Ha llegado');
    // Lo que estaba mal: salia el cartel normal, indistinguible de una llegada real.
    expect(r.hayCartelNormal, 'el cartel normal NO debe salir tambien').toBe(false);
    expect(r.marcaConsumida, 'la marca se consume, para no repetir el cartel').toBe(true);
  });
});
