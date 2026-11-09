'use strict';

const { test, expect } = require('@playwright/test');

/**
 * HL — el último paso del apretón de manos, HIJO_LISTO con reintentos, es uno solo para los seis hijos.
 *
 * Cada hijo, al recibir PADRE_DATOS, llama a `enviarHijoListoConReintento` del bus (js/mensajeria.js): HIJO_LISTO al
 * padre cada segundo hasta que llega PADRE_CONFIRMA_HIJO_LISTO, 30 veces como mucho, y al agotarse su último recurso
 * (hijo1 a hijo5 enseñan su interfaz; hijo6 no tiene nada que enseñar: su iframe lo enseña el padre). Por cada hijo:
 *
 *   HL-1  sin confirmación repite HIJO_LISTO; con ella, para: ningún HIJO_LISTO sale después de confirmar
 *   HL-2  sin confirmación nunca: exactamente 30 intentos, el último recurso, y ni uno más
 *
 * El hijo vive en `helpers/marco-vacio.html`, un padre que no manda nada por su cuenta y apunta todo lo que le llega:
 * el test decide cuándo llega PADRE_DATOS y si llega la confirmación. Como en el spec 86, no se empuja nada hasta que
 * el hijo avisa con HIJO_PREPARADO (su handler de PADRE_DATOS ya existe).
 *
 * La función estaba copiada en los seis hijos (docs/estudio-caminos.md, K-28). Estos casos describen lo que hacían
 * las seis copias y lo que hace la función única; los valida que caigan con la función rota (sin reprogramar el
 * siguiente intento, o sin parar al confirmar).
 */

const MARCO = '/tests/e2e/helpers/marco-vacio.html';

// Lo que el padre manda en PADRE_DATOS: { modo }, y a hijo6 además su estado (construirEstadoChat), con el idioma, sin
// el cual su controlador no llega a mandar HIJO_LISTO.
const HIJOS = [
  { id: 'hijo1-opciones', fichero: 'extrainfo-hijo1.html', ocultaSuInterfaz: true, padreDatos: { modo: 'casa' } },
  { id: 'hijo2', fichero: 'coordenadas-hijo2.html', ocultaSuInterfaz: true, padreDatos: { modo: 'casa' } },
  { id: 'hijo3', fichero: 'audio-hijo3.html', ocultaSuInterfaz: true, padreDatos: { modo: 'casa' } },
  { id: 'hijo4', fichero: 'retos-hijo4.html', ocultaSuInterfaz: true, padreDatos: { modo: 'casa' } },
  { id: 'hijo5', fichero: 'boton-casa-hijo5.html', ocultaSuInterfaz: true, padreDatos: { modo: 'casa' } },
  { id: 'hijo6-chat', fichero: 'chat-hijo6.html', ocultaSuInterfaz: false, padreDatos: { modo: 'casa', idioma: 'es' } },
];

/** Mete el hijo en el marco; el marco apunta HIJO_PREPARADO desde antes de crear el iframe. */
async function abrir(page, hijo) {
  await page.goto(MARCO);
  await page.evaluate((src) => new Promise((resolve) => {
    globalThis.__preparado = false;
    globalThis.addEventListener('message', (ev) => {
      if (ev.data?.tipo === 'SISTEMA.HIJO_PREPARADO') globalThis.__preparado = true;
    });
    const el = document.createElement('iframe');
    el.id = 'marco-hijo';
    el.src = `/${src}`;
    el.addEventListener('load', () => resolve(), { once: true });
    document.body.appendChild(el);
  }), hijo.fichero);
  const url = await page.evaluate(() => document.getElementById('marco-hijo')?.contentDocument?.location?.href || '');
  expect(url, `el marco tenía que cargar ${hijo.fichero}`).toContain(hijo.fichero);
  await expect.poll(() => page.evaluate(() => globalThis.__preparado === true), { timeout: 15_000 }).toBe(true);
}

/** Un mensaje del padre al hijo, como lo manda el padre: con su origen y a su nombre. Devuelve la hora del envío. */
function mandar(page, hijo, tipo, datos) {
  return page.evaluate(({ id, tipo, datos }) => {
    const t = Date.now();
    document.getElementById('marco-hijo').contentWindow.postMessage(
      { tipo, origen: 'padre', destino: id, datos: { ...datos, timestamp: t } }, globalThis.location.origin);
    return t;
  }, { id: hijo.id, tipo, datos });
}

/** Las horas (`datos.timestamp`) de los HIJO_LISTO que el hijo ha mandado al marco. */
const hijoListos = (page) => page.evaluate(() => globalThis.__recibidos
  .filter((m) => m.tipo === 'SISTEMA.HIJO_LISTO').map((m) => m.datos?.timestamp));

/** Lo que ve el usuario: el display del body del hijo. */
const bodyVisible = (page) => page.evaluate(() => {
  const doc = document.getElementById('marco-hijo')?.contentDocument;
  return doc?.body ? doc.body.style.display !== 'none' : null;
});

for (const hijo of HIJOS) {
  test.describe(`HL — ${hijo.fichero}: HIJO_LISTO con reintentos, del bus`, () => {
    test(`HL-1. ${hijo.fichero}: repite HIJO_LISTO hasta la confirmación, y entonces para`, async ({ page }) => {
      await abrir(page, hijo);
      await mandar(page, hijo, 'SISTEMA.PADRE_DATOS', hijo.padreDatos);
      await expect.poll(async () => (await hijoListos(page)).length, { timeout: 10_000 }).toBeGreaterThanOrEqual(2);
      const tConfirmacion = await mandar(page, hijo, 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO', {});
      if (hijo.ocultaSuInterfaz) await expect.poll(() => bodyVisible(page), { timeout: 10_000 }).toBe(true);
      // VENTANA-OBSERVACION: HL-1 comprueba que NO sale ningún HIJO_LISTO tras la confirmación; dos intervalos y medio
      await page.waitForTimeout(2500);
      const horas = await hijoListos(page);
      const despues = horas.filter((h) => h > tConfirmacion + 50);
      expect(despues, `ningún HIJO_LISTO después de confirmar (salieron ${horas.length} en total)`).toEqual([]);
    });

    test(`HL-2. ${hijo.fichero}: sin confirmación, 30 intentos, el último recurso y ni uno más`, async ({ page }) => {
      await page.clock.install();
      await abrir(page, hijo);
      await mandar(page, hijo, 'SISTEMA.PADRE_DATOS', hijo.padreDatos);
      await expect.poll(async () => (await hijoListos(page)).length, { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
      expect(await bodyVisible(page), 'antes del último recurso la interfaz sigue como al cargar')
        .toBe(!hijo.ocultaSuInterfaz);
      await page.clock.runFor(31_000);
      await expect.poll(async () => (await hijoListos(page)).length, { timeout: 10_000 }).toBe(30);
      if (hijo.ocultaSuInterfaz) {
        await expect.poll(() => bodyVisible(page), { timeout: 10_000 }).toBe(true);
      }
      await page.clock.runFor(5_000);
      // Los mensajes llegan al marco en tareas propias: se espera a que se asiente antes de contar.
      await expect.poll(async () => (await hijoListos(page)).length, { timeout: 5_000 }).toBe(30);
    });
  });
}
