/**
 * imagenes-referencias.js — Qué referencias se han quedado sin foto, y qué ficheros de
 * `imagenes/imagenes-aventuras/` podrían ser la suya.
 *
 * POR QUE EXISTE
 *
 * Cada referencia de `js/coordenadas-aventuras.js` lleva un campo `imagen`. Cuando una
 * apunta a un fichero que no existe —o no tiene el campo— el mapa completo enseña un
 * icono genérico en vez de la foto del monumento, y el fallo es mudo: nada casca.
 *
 * Emparejar 89 referencias con ~300 ficheros a ojo es justo el tipo de tarea donde se
 * cuelan errores. Esto lo hace por parecido de nombre y **propone**, no decide: la última
 * palabra es de quien conoce las fotos.
 *
 * USO
 *   node tools/imagenes-referencias.js                 -> todas las aventuras
 *   node tools/imagenes-referencias.js Aventura34km    -> solo una
 *
 * Volver a lanzarlo despues de tocar los datos: el informe de
 * `docs/imagenes-referencias-pendientes.md` sale de aqui y envejece solo.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR_IMAGENES = 'imagenes/imagenes-aventuras/';

// Palabras que aparecen en casi todos los nombres y no distinguen nada.
const VACIAS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'plaza', 'calle',
  'puerta', 'the', 'of', 'a', 'san', 'santa', 'valencia']);

const normalizar = (s) => String(s)
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const palabrasDe = (s) => normalizar(s).split(' ').filter((w) => w.length > 2 && !VACIAS.has(w));

function candidatas(nombre, ficheros) {
  const buscadas = palabrasDe(nombre);
  return ficheros
    .map((f) => {
      const suyas = palabrasDe(f.replace(/\.[a-z]+$/i, ''));
      const comunes = buscadas.filter((p) => suyas.some((t) => t.includes(p) || p.includes(t)));
      return { fichero: f, aciertos: comunes.length };
    })
    .filter((x) => x.aciertos > 0)
    .sort((a, b) => b.aciertos - a.aciertos)
    .slice(0, 3);
}

(async () => {
  const soloEsta = process.argv[2] || null;
  const ficheros = fs.readdirSync(DIR_IMAGENES);
  const { DATOS_AVENTURAS } = await import('../js/coordenadas-aventuras.js');

  // Ficheros con truco: doble extension, o mayusculas sueltas. En Windows dan igual; en
  // GitHub Pages, que SI distingue mayusculas, una ruta que no coincida exactamente es
  // un 404 silencioso.
  const dobleExt = ficheros.filter((f) => /\.(jpe?g|png)\.(jpe?g|png)$/i.test(f));
  const conMayusculas = ficheros.filter((f) => /[A-Z]/.test(f));

  const aventuras = soloEsta ? [soloEsta] : Object.keys(DATOS_AVENTURAS);
  for (const av of aventuras) {
    const coords = DATOS_AVENTURAS[av]?.['coordenadas-hijo2.html']?.coordenadas || [];
    const refs = coords.filter((e) => e.tipo === 'referencia' && typeof e.mapa_numero === 'number');
    if (!refs.length) continue;

    const sinFoto = refs.filter((r) => !r.imagen || !fs.existsSync(r.imagen));
    console.log(`\n=== ${av} — ${refs.length} referencias, ${refs.length - sinFoto.length} con foto, ${sinFoto.length} sin ella ===`);

    for (const r of sinFoto) {
      const cand = candidatas(r.nombre, ficheros);
      const seguro = cand.length === 1 || (cand.length > 1 && cand[0].aciertos > cand[1].aciertos);
      console.log(`${String(r.mapa_numero).padStart(3)}  ${r.nombre}`);
      console.log(`     apunta a: ${r.imagen ? path.basename(r.imagen) + ' (NO existe)' : '(sin campo imagen)'}`);
      console.log(`     ${seguro ? 'PROBABLE' : 'dudosa '}: ${cand.length ? cand.map((x) => x.fichero).join('  |  ') : 'ninguna parecida'}`);
    }
  }

  if (dobleExt.length) console.log(`\nFicheros con doble extension: ${dobleExt.join(', ')}`);
  if (conMayusculas.length) console.log(`\nFicheros con mayusculas (${conMayusculas.length}): ${conMayusculas.slice(0, 12).join(', ')}${conMayusculas.length > 12 ? '…' : ''}`);
})();
