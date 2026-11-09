/**
 * 176 — Un número de mapa se lee igual en la galería y en el listado
 *
 * POR QUE EXISTE
 *
 * El número de mapa de una parada es uno o varios números («17», «22/23»), y el de un tramo, una cadena: de dónde sale,
 * por dónde pasa y adónde llega («7→4→8»); un «-» es un sitio sin número propio. Lo enseñan dos sitios del padre: el
 * listado de paradas (el pin 📍 de cada fila) y la galería (la etiqueta de una parada; la de debajo de 📌 en la primera
 * imagen de un tramo y la de debajo de 🎯 en la última). Los dos lo leen con la misma regla (guía §7.2 y §4.7f): un «-»
 * no es un número y no se enseña, y dos números se escriben con «/», que es como los escribe la mayoría de los datos.
 *
 *   NM-1  Galería, tramo «-→21»: 📌 sin número; 🎯 «21».
 *   NM-2  Galería, tramo «17→-»: 📌 «17»; 🎯 sin número.
 *   NM-3  Galería, dos números en un extremo: «21→22/23», 🎯 «22/23»; «v7-v8→v11», 📌 «v7/v8».
 *   NM-4  Galería, paradas: «5,7» dice «5/7»; «-», sin número; de control, «17» dice «17».
 *   NM-5  Listado, con los datos de verdad de cuatro aventuras: cada pin escribe sus números con «/» (ninguno con «,» ni
 *         «-», ni un «📍» sin número; una fila sin número no lleva pin), y salen «📍5/7» (Aventura1), «📍22/23»
 *         (Aventura3), «📍v7/v8» (Aventura4) y «📍16/17» (Aventura34km).
 *   NM-6  El Puente de Monteolivete va con los números de la parada del Museo Príncipe Felipe («19/20» en la Aventura3,
 *         «13/14» en la de 34 km): su galería y su fila del listado lo dicen, y el número se pone en verde al completar el
 *         Museo, no antes (con todo hasta la Ópera completado, no está; con el Museo, sí).
 *
 * ROJO ANTES QUE VERDE: con la galería leyendo la cadena por su cuenta (el texto tal cual de cada trozo) caen NM-1 («-»),
 * NM-2 («-»), NM-3 («v7-v8») y NM-4 («5,7» y «-»), y pasa su control; con el pin del listado unido por comas cae NM-5;
 * con el Museo en «20» y «14», NM-6.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const IMAGEN = 'imagenes/imagenes-aplicación/imagen-no-internet.png';

/**
 * Abre la galería con dos imágenes y devuelve lo que dicen sus etiquetas de número: la de una parada, o la de salida (en
 * la primera imagen) y la de llegada (en la última) de un tramo. `null` es que no hay etiqueta. Las emojis 📌 y 🎯 se
 * devuelven también, para saber que la imagen que se lee es la que toca.
 */
async function etiquetas(page, tipo, mapaNumero) {
  return page.evaluate(({ img, tipo, mapaNumero }) => {
    globalThis.mostrarImagenOverlay('', 'prueba', null, null, { imagenes: [img, img], tipo, mapa_numero: mapaNumero });
    const leer = (sel) => document.querySelector(`#imagen-overlay ${sel}`)?.textContent ?? null;
    if (tipo !== 'tramo') return { parada: leer('.galeria-badge-mapa.parada-pos') };
    const conChincheta = leer('.galeria-badge-emoji.inicio-pos') === '📌';
    const salida = leer('.galeria-badge-mapa.tramo-inicio-pos');
    document.querySelector('#imagen-overlay .galeria-flecha-der')?.click();
    const conDiana = leer('.galeria-badge-emoji.fin-pos') === '🎯';
    const llegada = leer('.galeria-badge-mapa.tramo-fin-pos');
    return { conChincheta, salida, conDiana, llegada };
  }, { img: IMAGEN, tipo, mapaNumero });
}

/** Los datos de una aventura cargados y elegida; el idioma, español. */
async function elegirAventura(page, aventura) {
  await page.evaluate(async (aventura) => {
    globalThis.aventuraSeleccionada = aventura;
    globalThis.idiomaSeleccionado = 'es';
    await globalThis.__cargarDatosAventuraDiferidos();
  }, aventura);
}

/** Los pines del listado de paradas de la aventura elegida, pintado de nuevo. */
async function pinesDelListado(page) {
  await page.evaluate(async () => {
    const ventana = document.getElementById('ventana-listado-paradas-padre');
    if (ventana) {
      // Cerrada y vacía: el siguiente toggle la abre y la pinta con la aventura elegida.
      ventana.style.display = 'none';
      const scroll = ventana.querySelector('.listado-paradas-scroll');
      if (scroll) scroll.innerHTML = '';
    }
    await globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: { timestamp: Date.now() } });
  });
  await expect.poll(() => page.evaluate(() => document.querySelectorAll('#ventana-listado-paradas-padre .listado-parada-fila').length), { timeout: 20_000 })
    .toBeGreaterThan(5);
  return page.evaluate(() => [...document.querySelectorAll('#ventana-listado-paradas-padre .listado-parada-pin')].map((p) => p.textContent));
}

test.describe('NM — Un número de mapa se lee igual en la galería y en el listado', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('NM-1. Galería, tramo «-→21»: 📌 sin número; 🎯 «21»', async ({ page }) => {
    const e = await etiquetas(page, 'tramo', '-→21');
    expect(e.conChincheta, 'la primera imagen lleva 📌').toBe(true);
    expect(e.salida, 'un «-» no es un número: sin etiqueta').toBeNull();
    expect(e.conDiana, 'la última imagen lleva 🎯').toBe(true);
    expect(e.llegada).toBe('21');
  });

  test('NM-2. Galería, tramo «17→-»: 📌 «17»; 🎯 sin número', async ({ page }) => {
    const e = await etiquetas(page, 'tramo', '17→-');
    expect(e.salida).toBe('17');
    expect(e.conDiana, 'la última imagen lleva 🎯').toBe(true);
    expect(e.llegada, 'un «-» no es un número: sin etiqueta').toBeNull();
  });

  test('NM-3. Galería, dos números en un extremo: con «/»', async ({ page }) => {
    expect((await etiquetas(page, 'tramo', '21→22/23')).llegada).toBe('22/23');
    expect((await etiquetas(page, 'tramo', 'v7-v8→v11')).salida, 'los dos números, con «/»').toBe('v7/v8');
  });

  test('NM-4. Galería, paradas: «5,7» dice «5/7»; «-», sin número; de control, «17»', async ({ page }) => {
    expect((await etiquetas(page, 'parada', 17)).parada, 'control').toBe('17');
    expect((await etiquetas(page, 'parada', '5,7')).parada, 'los dos números, con «/»').toBe('5/7');
    expect((await etiquetas(page, 'parada', '-')).parada, 'un «-» no es un número: sin etiqueta').toBeNull();
  });

  test('NM-5. Listado, cuatro aventuras: cada pin con «/», y los de dos números como en la galería', async ({ page }) => {
    test.setTimeout(120_000);
    const esperados = { Aventura1: ['📍5/7'], Aventura3: ['📍22/23'], Aventura4: ['📍v7/v8'], Aventura34km: ['📍16/17'] };
    for (const [aventura, deDos] of Object.entries(esperados)) {
      await elegirAventura(page, aventura);
      const pines = await pinesDelListado(page);
      const malos = pines.filter((p) => p !== '' && !/^📍v?\d+(\/v?\d+)*$/.test(p));
      expect(malos, `${aventura}: pines que no son números separados por «/»`).toEqual([]);
      for (const pin of deDos) expect(pines, `${aventura}: falta ${pin}`).toContain(pin);
    }
  });

  test('NM-6. El Puente de Monteolivete va con el Museo y se pone en verde al completarlo', async ({ page }) => {
    test.setTimeout(120_000);
    for (const [aventura, opera, museo, puente, delMuseo] of [
      ['Aventura3', 'Av3-P-14', 'Av3-P-15', '19', '19/20'],
      ['Aventura34km', 'Av34km-P-10', 'Av34km-P-11', '13', '13/14'],
    ]) {
      await elegirAventura(page, aventura);
      const valor = await page.evaluate(({ aventura, museo }) => globalThis.__vv_DATOS_AVENTURAS[aventura]['coordenadas-hijo2.html'].coordenadas
        .find((e) => e.id === museo)?.mapa_numero, { aventura, museo });
      expect((await etiquetas(page, 'parada', valor)).parada, `${aventura}: la galería del Museo`).toBe(delMuseo);
      expect(await pinesDelListado(page), `${aventura}: la fila del Museo en el listado`).toContain(`📍${delMuseo}`);
      const verdes = (hastaMuseo) => page.evaluate(({ aventura, ultima }) => {
        const puntos = globalThis.__vv_DATOS_AVENTURAS[aventura]['coordenadas-hijo2.html'].coordenadas
          .filter((e) => e.tipo === 'inicio' || e.tipo === 'parada').map((e) => e.id);
        const hechos = puntos.slice(0, puntos.indexOf(ultima) + 1);
        globalThis.estado.paradasCompletadas = new Map(hechos.map((id) => [id, { completada: true }]));
        return globalThis._numerosDeMapaCompletados();
      }, { aventura, ultima: hastaMuseo });
      const conLaOpera = await verdes(opera);
      expect(conLaOpera.length, `${aventura}: con todo hasta la Ópera, hay números en verde (control)`).toBeGreaterThan(3);
      expect(conLaOpera, `${aventura}: el ${puente}, todavía no`).not.toContain(puente);
      expect(await verdes(museo), `${aventura}: el ${puente}, al completar el Museo`).toContain(puente);
    }
  });
});
