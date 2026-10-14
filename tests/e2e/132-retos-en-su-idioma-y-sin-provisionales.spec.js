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
 *   RH-6  Ninguna pregunta lleva su número delante («3. ¿…?»): los retos no se numeran en pantalla. El número vive en
 *         los datos (`reto`, `id`), no en el texto que lee el usuario.
 *   RH-7  Un reto que se repite en varias aventuras —el mismo según el español: misma pregunta, tipo, opciones y
 *         respuestas— tiene una sola redacción en cada idioma: la misma pregunta, las mismas opciones y las mismas
 *         respuestas en todas las aventuras donde aparece.
 *   RH-8  Ningún texto de un reto (pregunta, opción o respuesta) empieza ni acaba en espacio.
 *   RH-9  Ningún texto de un reto lleva marcas HTML: hijo4 pinta la pregunta con `textContent`, así que un `<br>` sale
 *         tal cual en pantalla.
 *   RH-10 Cada reto (aventura y número) tiene en todos los idiomas la forma que tiene en español: el mismo tipo, el mismo
 *         número de opciones y el mismo de respuestas. Un reto con el contenido cambiado por el de otro, o con otro número
 *         en un idioma, aparece aquí.
 *
 * Son comprobaciones sobre los datos: el módulo se carga en el navegador, como lo carga la app, desde una página vacía
 * del mismo origen, y los datos se comprueban en el test. Cada una lleva su control, un dato roto a propósito en una
 * copia en memoria, que tiene que fallar.
 *
 * ROJO ANTES QUE VERDE: con los datos de `68194c1`, RH-7 a RH-10 fallan (retos repetidos con varias redacciones en los
 * doce idiomas, 63 preguntas con espacios sobrantes, el `<br>` de los «tres arcos ciegos» en los doce, y en Aventura2 en
 * inglés los retos 3 y 5 con el contenido cambiado); RH-1 a RH-6 pasan con los dos.
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

const numeradas = (RETOS) => [...todos(RETOS)]
  .filter(({ r }) => /^\s*\d{1,3}\.\s/.test(r.pregunta))
  .map(({ a, idioma, r }) => `${a}/${idioma}/${r.id}: ${r.pregunta.slice(0, 40)}`);

/** RH-7: los retos que el español dice que son el mismo, con más de una redacción en algún idioma. */
function repetidosDesiguales(RETOS) {
  const ordenadas = (x) => [...(x || [])].sort();
  const grupos = new Map();
  for (const a of Object.keys(RETOS)) for (const r of RETOS[a].es || []) {
    if (typeof r.pregunta !== 'string') continue;
    const clave = JSON.stringify([r.pregunta, r.tipo, ordenadas(r.opciones), ordenadas(r.correctas)]);
    if (!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push({ a, n: r.reto });
  }
  const fallos = [];
  for (const posiciones of grupos.values()) {
    if (posiciones.length < 2) continue;
    for (const idioma of Object.keys(RETOS[posiciones[0].a])) {
      const formas = new Set(posiciones.map(({ a, n }) => {
        const r = deReto(RETOS[a][idioma], n);
        return r ? JSON.stringify([r.pregunta, ordenadas(r.opciones), ordenadas(r.correctas)]) : '(sin reto)';
      }));
      if (formas.size > 1) fallos.push(`${idioma}: ${posiciones.map(({ a, n }) => `${a}#${n}`).join(', ')}`);
    }
  }
  return fallos;
}

const conHtml = (RETOS) => [...todos(RETOS)]
  .filter(({ r }) => [r.pregunta, ...(r.opciones || []), ...(r.correctas || [])].some((s) => typeof s === 'string' && /<[a-z/!]/i.test(s)))
  .map(({ a, idioma, r }) => `${a}/${idioma}/${r.id}`);

/** RH-10: (aventura, idioma, número) cuya forma no es la del español. */
function formasDistintasDelEspanol(RETOS) {
  const forma = (r) => (r ? `${r.tipo}/${(r.opciones || []).length}/${(r.correctas || []).length}` : '(falta)');
  const fallos = [];
  for (const a of Object.keys(RETOS)) {
    for (const e of RETOS[a].es || []) {
      for (const idioma of Object.keys(RETOS[a])) {
        const r = deReto(RETOS[a][idioma], e.reto);
        if (forma(r) !== forma(e)) fallos.push(`${a}/${idioma} #${e.reto}: ${forma(r)}, en español ${forma(e)}`);
      }
    }
  }
  return fallos;
}

const conEspacios = (RETOS) => [...todos(RETOS)]
  .filter(({ r }) => [r.pregunta, ...(r.opciones || []), ...(r.correctas || [])].some((s) => typeof s === 'string' && s !== s.trim()))
  .map(({ a, idioma, r }) => `${a}/${idioma}/${r.id}`);

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

  test('RH-6. Ninguna pregunta lleva su número delante', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(numeradas(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.Aventura3.it, 4).pregunta = `4. ${deReto(roto.Aventura3.it, 4).pregunta}`;
    expect(numeradas(roto).length, 'control').toBe(1);
  });

  test('RH-7. Un reto que se repite en varias aventuras tiene una sola redacción en cada idioma', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(repetidosDesiguales(RETOS)).toEqual([]);
    // Control: el reto 1 es el mismo en las siete aventuras; en una, otra redacción en japonés.
    const roto = copia(RETOS);
    deReto(roto.Aventura5.ja, 1).pregunta += '（別の書き方）';
    expect(repetidosDesiguales(roto).filter((f) => f.startsWith('ja: ')).length, 'control').toBe(1);
  });

  test('RH-8. Ningún texto de un reto empieza ni acaba en espacio', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(conEspacios(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.AventuraFallas.pl, 3).pregunta += ' ';
    expect(conEspacios(roto), 'control').toEqual([`AventuraFallas/pl/${deReto(roto.AventuraFallas.pl, 3).id}`]);
  });

  test('RH-9. Ningún texto de un reto lleva marcas HTML', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(conHtml(RETOS)).toEqual([]);
    const roto = copia(RETOS);
    deReto(roto.Aventura2.de, 3).pregunta = `Erste Zeile.<br>${deReto(roto.Aventura2.de, 3).pregunta}`;
    expect(conHtml(roto), 'control').toEqual([`Aventura2/de/${deReto(roto.Aventura2.de, 3).id}`]);
  });

  test('RH-10. Cada reto tiene en todos los idiomas la forma que tiene en español', async ({ page }) => {
    const RETOS = await cargarRetos(page);
    expect(formasDistintasDelEspanol(RETOS)).toEqual([]);
    // Control: el cruce que había en Aventura2 en inglés, los retos 3 y 5 con el contenido cambiado.
    const roto = copia(RETOS);
    const r3 = deReto(roto.Aventura2.en, 3);
    const r5 = deReto(roto.Aventura2.en, 5);
    [r3.opciones, r5.opciones, r3.correctas, r5.correctas] = [r5.opciones, r3.opciones, r5.correctas, r3.correctas];
    expect(formasDistintasDelEspanol(roto).length, 'control').toBe(2);
  });
});
