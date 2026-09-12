/**
 * 65 — Al terminar un tramo, el cartel nombra lo que se cierra y lo que se abre
 *
 * POR QUE EXISTE
 *
 * Al completarse un tramo cuyo siguiente elemento es una parada, el cartel decia
 * "Ha llegado a la parada Y". Describia como HECHO algo que todavia no lo era: dentro de
 * la app el usuario sigue en el tramo hasta que pulsa avanzar, asi que el cartel anunciaba
 * la llegada y acto seguido le pedia pulsar para llegar. Reportado en uso real como "se
 * siente raro, como si tuvieras que pulsar avanzar dos veces".
 *
 * La asimetria estaba solo ahi: parada→tramo ya decia "Ha terminado la parada X — va a
 * empezar el tramo Y", que describe un transito que el usuario VA a hacer. Ahora
 * tramo→parada usa ese mismo cartel, con las frases `terminaTramo` + `empiezaParada` que
 * ya existian traducidas a los 12 idiomas y que no las producia nadie.
 *
 * `mostrarCartelLlegadaParada` NO se elimina: sigue siendo el cartel del unico sitio donde
 * "ha llegado" es literal — la llegada al punto de inicio de la aventura, donde no hay
 * nada anterior que cerrar ni boton que pulsar (CT-3).
 *
 * ROJO ANTES QUE VERDE: CT-1 y CT-2 fallan si vuelve la rama que enrutaba tramo→parada a
 * mostrarCartelLlegadaParada.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

test.describe('CT — Cartel al completar un tramo seguido de parada', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('CT-1. El cartel de transicion sabe combinar tramo terminado + parada que empieza', async ({ page }) => {
    // La funcion la publica el Script 1 del padre en globalThis, y en una tanda completa
    // puede no estar todavia cuando termina FASE 1: sin esta espera, el `?.()` de abajo no
    // llamaba a nada y el test fallaba con el cartel a null — verde en solitario, rojo en
    // tanda, que es el patron de flake que este proyecto persigue (EJE 23).
    await page.waitForFunction(() => typeof globalThis.mostrarCartelTransicion === 'function',
      null, { timeout: 15_000 });

    // Se llama a la funcion real con la combinacion que antes no producia nadie, y se lee
    // el texto que acaba en pantalla — no el objeto de traducciones.
    const texto = await page.evaluate(async () => {
      document.getElementById('cartel-transicion')?.remove();
      globalThis.idiomaSeleccionado = 'es';
      await globalThis.mostrarCartelTransicion?.('tramo', 'Torres de Serranos → Plaza de la crida', 'parada', 'Plaza de la crida');
      const el = document.getElementById('cartel-transicion');
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : null;
    });

    expect(texto, 'el cartel debe existir en el DOM').not.toBeNull();
    expect(texto, 'debe cerrar el tramo por su nombre').toContain('Ha terminado el tramo Torres de Serranos');
    expect(texto, 'debe abrir la parada por su nombre').toContain('va a empezar la parada Plaza de la crida');
    // Lo que se estaba arreglando: no puede afirmar una llegada que aun no ha pasado.
    expect(texto, 'no debe decir que ya ha llegado').not.toContain('Ha llegado');
  });

  test('CT-2. Ninguna rama enruta ya tramo→parada al cartel de llegada', async ({ page }) => {
    // El reparto vive en marcarParadaCompletada. Se comprueba sobre el fuente servido
    // porque llegar ahi de verdad exige completar un tramo entero con GPS real.
    const r = await page.evaluate(async () => {
      const txt = await (await fetch('./codigo-padre.html')).text();
      const i = txt.indexOf('const elementoCompletado = findElementoPorPadreId(idLimpio);');
      if (i < 0) return { error: 'no se encontro el reparto de carteles' };
      const bloque = txt.slice(i, i + 1800);
      return {
        // La rama que sobraba: "si es tramo y hay siguiente, cartel de llegada".
        tieneRamaVieja: /esTramo\s*&&\s*elementoSiguiente\?\.nombre[\s\S]{0,120}mostrarCartelLlegadaParada/.test(bloque),
        usaTransicion: /mostrarCartelTransicion\?\./.test(bloque),
        usaInicioTramo: /mostrarCartelInicioTramo\?\./.test(bloque),
      };
    });

    expect(r.error).toBeUndefined();
    expect(r.tieneRamaVieja, 'tramo→parada ya no va al cartel de llegada').toBe(false);
    expect(r.usaTransicion, 'sigue existiendo el reparto al cartel de transicion').toBe(true);
    expect(r.usaInicioTramo, 'parada→tramo no se toca').toBe(true);
  });

  test('CT-3. mostrarCartelLlegadaParada sigue viva para la llegada al inicio', async ({ page }) => {
    // Su unico llamador legitimo esta en funciones-mapa.js, para el punto de inicio de la
    // aventura: ahi "ha llegado" SI es literal. Borrarla habria dejado ese aviso mudo.
    const r = await page.evaluate(async () => {
      const txt = await (await fetch('./js/funciones-mapa.js')).text();
      return {
        tieneLlamador: /mostrarCartelLlegadaParada\(siguienteParada\.nombre\)/.test(txt),
        soloParaInicio: /tipo === 'inicio'[\s\S]{0,400}mostrarCartelLlegadaParada/.test(txt),
        expuesta: typeof globalThis.mostrarCartelLlegadaParada === 'function',
      };
    });
    expect(r.tieneLlamador, 'sigue teniendo su llamador real').toBe(true);
    expect(r.soloParaInicio, 'y ese llamador es el del punto de inicio').toBe(true);
    expect(r.expuesta, 'la funcion sigue publicada en globalThis').toBe(true);
  });
});
