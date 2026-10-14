/**
 * 132 — Los retos están en su idioma y sin textos provisionales, y los de la selección son iguales en todas las aventuras
 *
 * POR QUE EXISTE
 *
 * Las preguntas de los retos viven en `js/retos-aventuras.js`, una copia por aventura y por idioma (7 × 12). Al repasar
 * los retos 1 y 2 de la selección salieron redacciones distintas entre aventuras, dos sin traducir («[PENDING] …» en
 * japonés, y uno en español dentro de la versión alemana) y unos botones «Yes/No» en inglés en otro idioma. La voz
 * (de usted, impersonal) no la puede comprobar una máquina; lo que sigue, sí:
 *
 *   RH-1  Retos 1 y 2 (los de la selección): una sola redacción por idioma, igual en las siete aventuras —pregunta y
 *         opciones—.
 *   RH-2  Ningún reto lleva un texto provisional ([PENDING], TODO, TBD, lorem ipsum, PENDIENTE).
 *   RH-3  Ningún reto de otro idioma copia la pregunta en español del mismo reto (sin traducir).
 *   RH-4  Las opciones del reto 2 (sí / no) están en su idioma: fuera del inglés, nunca son las del inglés.
 *   RH-5  En español, una pregunta que acaba en «?» abre con «¿».
 *
 * Son comprobaciones sobre los datos: el módulo se carga en el navegador, como lo carga la app, desde una página vacía
 * del mismo origen, y los datos se comprueban en el test. Cada una lleva su control, un dato roto a propósito en una
 * copia en memoria, que tiene que fallar.
 */
'use strict';

const { test, expect } = require('@playwright/test');

// Sin service worker: la página vacía la sirve la ruta del test, y el worker no la dejaría ver.
test.use({ serviceWorkers: 'block' });

/** Carga `js/retos-aventuras.js` en el navegador, desde una página vacía del mismo origen. */
async function cargarRetos(page) {
  await page.route('**/__spec132.html', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>spec 132</title>' }));
  await page.goto('/__spec132.html');
  return page.evaluate(async () => (await import('/js/retos-aventuras.js')).RETOS_AVENTURAS);
}
const copia = (x) => JSON.parse(JSON.stringify(x));
const deReto = (lista, n) => (lista || []).find((r) => r.reto === n);

/** RH-1: idioma → redacciones distintas de los retos 1 y 2 entre aventuras. */
function retosDeSeleccionDesiguales(RETOS) {
  const fallos = [];
  const aventuras = Object.keys(RETOS);
  for (const idioma of Object.keys(RETOS[aventuras[0]])) {
    for (const n of [1, 2]) {
      const formas = new Set(aventuras.map((a) => {
        const r = deReto(RETOS[a][idioma], n);
        return r ? JSON.stringify([r.pregunta, r.opciones]) : '(sin reto)';
      }));
      if (formas.size !== 1) fallos.push(`${idioma} reto ${n}: ${formas.size} redacciones`);
    }
  }
  return fallos;
}

/** Recorre todos los retos con pregunta: (aventura, idioma, reto). */
function* todos(RETOS) {
  for (const a of Object.keys(RETOS)) for (const idioma of Object.keys(RETOS[a])) {
    for (const r of RETOS[a][idioma] || []) if (typeof r.pregunta === 'string') yield { a, idioma, r };
  }
}

const PROVISIONAL = /\[PENDING\]|\bTODO\b|\bTBD\b|lorem ipsum|PENDIENTE/i;
const provisionales = (RETOS) => [...todos(RETOS)]
  .filter(({ r }) => PROVISIONAL.test([r.pregunta, ...(r.opciones || [])].join(' | ')))
  .map(({ a, idioma, r }) => `${a}/${idioma}/${r.id}`);

const copiasDelEspanol = (RETOS) => [...todos(RETOS)]
  .filter(({ a, idioma, r }) => idioma !== 'es'
    && (RETOS[a].es || []).some((e) => e.reto === r.reto && e.tipo === r.tipo && e.pregunta === r.pregunta))
  .map(({ a, idioma, r }) => `${a}/${idioma}/${r.id}`);

function opcionesDelReto2EnIngles(RETOS) {
  const fallos = [];
  for (const a of Object.keys(RETOS)) {
    const en = deReto(RETOS[a].en, 2);
    for (const idioma of Object.keys(RETOS[a])) {
      if (idioma === 'en') continue;
      const r = deReto(RETOS[a][idioma], 2);
      if (en && r && JSON.stringify(r.opciones) === JSON.stringify(en.opciones)) fallos.push(`${a}/${idioma}`);
    }
  }
  return fallos;
}

const sinAbrirInterrogacion = (RETOS) => [...todos(RETOS)]
  .filter(({ idioma, r }) => idioma === 'es' && /\?\s*$/.test(r.pregunta) && !r.pregunta.includes('¿'))
  .map(({ a, r }) => `${a}/${r.id}: ${r.pregunta.slice(0, 60)}`);

test.describe('RH — los retos, en su idioma y sin provisionales', () => {
  test('RH-1. Retos 1 y 2: una sola redacción por idioma en las siete aventuras', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(retosDeSeleccionDesiguales(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.Aventura4.ja, 1).pregunta = '1. [PENDING] Valencia be Guides intro question';
    expect(retosDeSeleccionDesiguales(roto), 'control').toEqual(['ja reto 1: 2 redacciones']);
  });

  test('RH-2. Ningún reto lleva un texto provisional', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(provisionales(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.Aventura2.fr, 3).pregunta = '[PENDING] question';
    expect(provisionales(roto).length, 'control').toBe(1);
  });

  test('RH-3. Ningún reto de otro idioma copia la pregunta en español', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(copiasDelEspanol(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.AventuraFallas.de, 1).pregunta = deReto(roto.AventuraFallas.es, 1).pregunta;
    expect(copiasDelEspanol(roto).length, 'control').toBe(1);
  });

  test('RH-4. Las opciones del reto 2 están en su idioma', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(opcionesDelReto2EnIngles(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.Aventura4.ja, 2).opciones = [...deReto(roto.Aventura4.en, 2).opciones];
    expect(opcionesDelReto2EnIngles(roto), 'control').toEqual(['Aventura4/ja']);
  });

  test('RH-5. En español, una pregunta que acaba en «?» abre con «¿»', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(sinAbrirInterrogacion(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.Aventura1.es, 1).pregunta = '1. Cuántas aventuras pueden hacerse con Valencia be Guides?';
    expect(sinAbrirInterrogacion(roto).length, 'control').toBe(1);
  });
});
