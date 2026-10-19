/**
 * 135-la-eleccion-se-sabe-siempre.spec.js
 *
 * La aventura y el idioma que elige el usuario se saben en todo momento, por un solo camino y sin reservas: la
 * selección los guarda en sus variables, el padre los recibe con acuse (y sin acuse la selección no sigue), cada
 * hijo los recibe del padre, y ningún sitio sustituye un dato que falta por la Aventura1 o por el español.
 *
 *   EL-1  Control: elegir idioma y aventura los deja en las variables de la selección y en el padre
 *         (`globalThis.idiomaSeleccionado`, `globalThis.aventuraSeleccionada` y `vv_idioma`).
 *   EL-2  El padre guarda la aventura elegida en un solo sitio: `estado.seleccion` no lleva una copia.
 *   EL-3  Si el padre no puede guardar la aventura, la selección no avanza: se queda en la lista de aventuras.
 *   EL-4  Sin aventura elegida, la selección no carga los datos de ninguna: el reto 1 no sale de la Aventura1.
 *   EL-5  El asistente no construye nada antes de que el padre le mande el idioma.
 *   EL-6  Una sesión guardada sin idioma no se ofrece para reanudar, y se dice.
 *   EL-7  video-intro dice en voz alta que quien lo abre no le ha pasado el idioma (y con `?lang=` no dice nada).
 *   EL-8  Lo que el código lee sin respaldo está completo en los doce idiomas: las tablas de `js/traducciones-ui.js`
 *         (con las mismas claves que el español, y las escenas de Jaime), los textos de términos, agradecimientos y
 *         normativa, y los datos del padre, los retos y los audios de las siete aventuras.
 *
 * ROJO ANTES QUE VERDE: con la selección, el padre, el asistente y video-intro anteriores caen EL-2 (la copia en
 * `estado.seleccion`), EL-3 (la selección seguía con el mapa de la Aventura1), EL-4 (cargaba el reto 1 de la
 * Aventura1), EL-5 (el FAQ se construía en español al cargar), EL-6 (ofrecía reanudar, en español) y EL-7 (sin aviso).
 * EL-1 y EL-8 pasan antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');
const aLaVista = (f) => f.evaluate(() => [...document.querySelectorAll('.pantalla.visible')].map((p) => p.id));
const mapaALaVista = (f) => f.evaluate(() => getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none');

async function arrancar(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  // El bus de la selección tiene que estar montado antes de elegir: elegir avisa al padre.
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 20_000 },
  );
}

/** Abre la P7 y espera a que termine de pintar sus botones (su último log). */
async function abrirEleccion(page, f) {
  const cargadas = page.waitForEvent('console', { predicate: (m) => m.text().includes('Aventuras cargadas dinámicamente'), timeout: 20_000 });
  await f.evaluate(() => mostrar(7));
  await cargadas;
}

/** Elige idioma (P2) y aventura (P7) como el usuario, y espera a que la selección siga tras la aventura. */
async function elegir(page, f, idioma, aventura) {
  await f.evaluate((i) => globalThis.seleccionarIdioma(i), idioma);
  await expect.poll(() => aLaVista(f), { timeout: 10_000 }).toEqual(['pantalla3']);
  await abrirEleccion(page, f);
  await f.evaluate((a) => globalThis.seleccionarAventura(a), aventura);
  await expect.poll(async () => (await mapaALaVista(f)) || (await aLaVista(f)).join() === 'pantalla8', { timeout: 10_000 }).toBe(true);
}

test.describe('EL — la elección, por un solo camino', () => {
  test('EL-1. Control: la elección queda en la selección y en el padre', async ({ page }) => {
    await arrancar(page);
    const f = seleccion(page);
    await elegir(page, f, 'fr', 'Aventura2');
    expect(await f.evaluate(() => ({ idioma: idiomaSeleccionado, aventura: aventuraSeleccionada })), 'en las variables de la selección')
      .toEqual({ idioma: 'fr', aventura: 'Aventura2' });
    expect(await page.evaluate(() => ({ idioma: globalThis.idiomaSeleccionado, aventura: globalThis.aventuraSeleccionada, guardado: localStorage.getItem('vv_idioma') })), 'y en el padre')
      .toEqual({ idioma: 'fr', aventura: 'Aventura2', guardado: 'fr' });
  });

  test('EL-2. El padre guarda la aventura elegida en un solo sitio', async ({ page }) => {
    await arrancar(page);
    const f = seleccion(page);
    await elegir(page, f, 'es', 'Aventura3');
    expect(await page.evaluate(() => globalThis.aventuraSeleccionada), 'la aventura elegida').toBe('Aventura3');
    expect(await page.evaluate(() => globalThis.estadoPadre?.seleccion?.aventura ?? null), 'sin copia en estado.seleccion').toBeNull();
  });

  test('EL-3. Si el padre no puede guardar la aventura, la selección se queda en la lista de aventuras', async ({ page }) => {
    await arrancar(page);
    const f = seleccion(page);
    await f.evaluate(() => globalThis.seleccionarIdioma('es'));
    await abrirEleccion(page, f);
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    // Una aventura sin id: el handler del padre no la guarda y falla, y el bus se lo contesta a la selección.
    await f.evaluate(() => globalThis.seleccionarAventura(''));
    // VENTANA-OBSERVACION: lo que se mide es que la selección NO sigue adelante.
    await page.waitForTimeout(1_500);
    expect(await aLaVista(f), 'sigue en la lista de aventuras').toEqual(['pantalla7']);
    expect(await mapaALaVista(f), 'sin el mapa de ninguna aventura').toBe(false);
    expect(errores.some((t) => t.includes('no ha confirmado la aventura')), 'y lo dice').toBe(true);
  });

  test('EL-4. Sin aventura elegida, la selección no carga los datos de ninguna', async ({ page }) => {
    await arrancar(page);
    const f = seleccion(page);
    const r = await f.evaluate(async () => {
      idiomaSeleccionado = 'es';
      await cargarRetoR1();
      return { reto: retoActualR1?.id ?? null, opciones: document.querySelectorAll('input[name="reto-r1"]').length };
    });
    expect(r, 'ningún reto: no hay aventura de la que sacarlo').toEqual({ reto: null, opciones: 0 });
  });

  test('EL-5. El asistente no construye nada antes de que el padre le mande el idioma', async ({ page }) => {
    await page.goto('/chat-hijo6.html');
    await page.waitForFunction(() => globalThis.mensajeria?.tieneControlador?.('CHAT.ESTADO_PADRE') === true, null, { timeout: 15_000 });
    // VENTANA-OBSERVACION: el arranque del asistente termina (se presenta al padre que no tiene) en este rato.
    await page.waitForTimeout(1_500);
    expect(await page.evaluate(() => document.querySelectorAll('#faq .tema-btn').length), 'sin el idioma del padre, el FAQ está vacío').toBe(0);
  });

  test('EL-6. Una sesión guardada sin idioma no se ofrece para reanudar, y se dice', async ({ page }) => {
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    await page.addInitScript(() => {
      if (globalThis !== globalThis.top) return;
      try {
        localStorage.setItem('vv_aventura_iniciada', JSON.stringify({ aventura: 'Aventura1', modo: 'aventura', dev: false, timestamp: Date.now() }));
      } catch (_e) { /* sin almacenamiento: el test lo dirá */ }
    });
    await arrancar(page);
    // VENTANA-OBSERVACION: la comprobación de la sesión guardada corre 300 ms después de sistemaInicializado.
    await page.waitForTimeout(1_500);
    expect(await page.evaluate(() => !!document.getElementById('dialogo-reanudacion-overlay')), 'no se ofrece reanudar').toBe(false);
    expect(errores.some((t) => t.includes('Sesión guardada incompleta')), 'y se dice').toBe(true);
  });

  test('EL-7. video-intro dice que no le han pasado el idioma; con ?lang= no dice nada', async ({ page }) => {
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    await page.goto('/video-intro.html');
    await expect.poll(() => errores.some((t) => t.includes('Sin ?lang=')), { timeout: 10_000 }).toBe(true);
    errores.length = 0;
    await page.goto('/video-intro.html?lang=es');
    // VENTANA-OBSERVACION: el aviso saldría al evaluar el módulo, en el arranque de la página.
    await page.waitForTimeout(1_000);
    expect(errores.filter((t) => t.includes('Sin ?lang=')), 'con el idioma, sin aviso').toEqual([]);
  });
});

test.describe('EL — los datos que se leen sin respaldo', () => {
  // Sin service worker: la página vacía la sirve la ruta del test, y el worker no la dejaría ver.
  test.use({ serviceWorkers: 'block' });

  test('EL-8. Están completos en los doce idiomas', async ({ page }) => {
    await page.route('**/__spec135.html', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>spec 135</title>' }));
    await page.goto('/__spec135.html');
    const problemas = await page.evaluate(async () => {
      const imp = (f) => import(`/js/${f}`);
      const { MAPEO_IDIOMAS, INDICE_AVENTURAS } = await imp('indice-aventuras.js');
      const IDIOMAS = Object.keys(MAPEO_IDIOMAS);
      const AVENTURAS = Object.keys(INDICE_AVENTURAS);
      const vacio = (v) => v === '' || v === null || v === undefined || (Array.isArray(v) && v.length === 0);
      const esTabla = (o) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).length > 0 && Object.keys(o).every((k) => IDIOMAS.includes(k));
      const fallos = [];
      if (IDIOMAS.length !== 12) fallos.push(`MAPEO_IDIOMAS tiene ${IDIOMAS.length} idiomas`);
      // Una tabla por idioma: los doce, sin vacíos; si los valores son objetos, cada campo que el español tiene con
      // contenido lo tiene también cada idioma (un `enlace: null` que también es null en español no es un hueco).
      const revisarTabla = (nombre, t) => {
        for (const i of IDIOMAS) {
          if (vacio(t[i])) { fallos.push(`${nombre}.${i} falta`); continue; }
          if (t.es && typeof t.es === 'object' && !Array.isArray(t.es)) {
            for (const k of Object.keys(t.es)) if (!vacio(t.es[k]) && vacio(t[i][k])) fallos.push(`${nombre}.${i}.${k} falta`);
          }
        }
      };
      const ui = await imp('traducciones-ui.js');
      let tablas = 0;
      for (const [nombre, valor] of Object.entries(ui)) {
        if (esTabla(valor)) { revisarTabla(nombre, valor); tablas++; continue; }
        if (valor && typeof valor === 'object' && !Array.isArray(valor) && Object.values(valor).length && Object.values(valor).every(esTabla)) {
          for (const [k, v] of Object.entries(valor)) revisarTabla(`${nombre}.${k}`, v);
          tablas++;
        }
      }
      if (tablas < 30) fallos.push(`solo ${tablas} tablas por idioma en traducciones-ui.js: el recorrido no las está viendo`);
      // Las escenas de Jaime: una entrada por idioma en cada escena (la 15 no tiene texto: está fuera del guion).
      ui.JAIME_SCENES.forEach((e, n) => { if (e !== null) revisarTabla(`JAIME_SCENES[${n}]`, e); });
      // Los textos largos que abren la selección y el asistente.
      for (const [f, exp, campo] of [['terminos-aventuras.js', 'TERMINOS_AVENTURAS', 'terminos_idiomas'],
        ['agradecimientos-aventuras.js', 'AGRADECIMIENTOS_AVENTURAS', 'agradecimientos_idiomas'],
        ['normativa-cumplimiento.js', 'NORMATIVA_CUMPLIMIENTO', 'normativa_idiomas']]) {
        revisarTabla(`${exp}.${campo}`, (await imp(f))[exp][campo]);
      }
      // Los datos de las siete aventuras, en los doce idiomas.
      const { DATOS_PADRE } = await imp('aventuras-ID-padre.js');
      const { RETOS_AVENTURAS } = await imp('retos-aventuras.js');
      const { AUDIOS_AVENTURAS } = await imp('audios-aventuras.js');
      for (const a of AVENTURAS) {
        for (const i of IDIOMAS) {
          if (!(DATOS_PADRE[a]?.[i]?.elementosIDpadre?.length > 0)) fallos.push(`DATOS_PADRE.${a}.${i}`);
          if (!(RETOS_AVENTURAS[a]?.[i]?.length > 0)) fallos.push(`RETOS_AVENTURAS.${a}.${i}`);
          if (!(AUDIOS_AVENTURAS[a]?.[i]?.length > 0)) fallos.push(`AUDIOS_AVENTURAS.${a}.${i}`);
        }
      }
      return fallos;
    });
    expect(problemas).toEqual([]);
  });
});
