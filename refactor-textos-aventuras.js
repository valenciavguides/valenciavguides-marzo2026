/**
 * refactor-textos-aventuras.js
 * Genera textos-aventuras.js con comentarios tomados de coordenadas-aventuras.js
 * (incluyendo info de retos y puzzles que está en los comentarios del archivo).
 * Transforma [aventura][idioma][] → [aventura][].
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { DATOS_AVENTURAS } from './js/coordenadas-aventuras.js';

const srcTextos    = readFileSync('./js/textos-aventuras.js.bak', 'utf8');
const srcCoordenas = readFileSync('./js/coordenadas-aventuras.js', 'utf8');

// ── Sufijos de idioma ─────────────────────────────────────────────────────────

const SUFIJOS_IDIOMA = ['-es', '-en', '-fr', '-it', '-nl', '-ja', '-de', '-zh', '-pl', '-pt', '-ru', '-uk'];

function quitarSufijo(id) {
  for (const s of SUFIJOS_IDIOMA) {
    if (id.endsWith(s)) return id.slice(0, -s.length);
  }
  return id;
}

// ── Mapeo aventura → prefijo en el id de texto ───────────────────────────────

const PREFIJO_AVENTURA = {
  Aventura1:     'Av1',
  Aventura2:     'Av2',
  Aventura3:     'Av3',
  Aventura4:     'Av4',
  Aventura5:     'Av5',
  AventuraFallas:'AvFallas',
  Aventura34km:  'Av34km',
};

// ── Mapa coordId → mapa_numero desde los datos importados ────────────────────

function buildMapaNumeroMap(aventura) {
  const map = new Map();
  const coords = DATOS_AVENTURAS[aventura]?.['coordenadas-hijo2.html']?.coordenadas ?? [];
  for (const c of coords) {
    if (!c.id || c.id.startsWith('REF-')) continue;
    if (c.mapa_numero !== null && c.mapa_numero !== undefined) {
      map.set(c.id, c.mapa_numero);
    }
  }
  return map;
}

// ── Extraer comentarios de coordenadas-aventuras.js ──────────────────────────
// Devuelve Map<coordId, comentario> para cada aventura.
// Solo procesa entradas con id "P-X" o "TR-X" (no "REF-X").

function extraerComentariosCoord(aventura) {
  const map = new Map();

  // Localizar el bloque de la aventura en coordenadas-aventuras.js
  const marcaAv = `  ${aventura}: {`;
  const idxAv = srcCoordenas.indexOf(marcaAv);
  if (idxAv === -1) return map;

  // Encontrar el cierre del objeto de aventura (profundidad de llaves)
  let depth = 0, finAv = srcCoordenas.length;
  for (let i = idxAv; i < srcCoordenas.length; i++) {
    if (srcCoordenas[i] === '{') depth++;
    else if (srcCoordenas[i] === '}') { depth--; if (depth === 0) { finAv = i; break; } }
  }

  const bloqueAv = srcCoordenas.slice(idxAv, finAv);
  const lineas   = bloqueAv.split('\n');

  let comentariosPendientes = [];

  for (const linea of lineas) {
    const t = linea.trim();

    if (t.startsWith('//')) {
      comentariosPendientes.push(t);
    } else if (t === '{') {
      // inicio de entrada — los comentarios se asignarán cuando veamos el id
    } else if (t.startsWith('id:')) {
      const m = t.match(/^id:\s*"([^"]+)"/);
      if (m) {
        const id = m[1];
        // Solo P-X y TR-X (no REF-)
        if (!id.startsWith('REF-') && comentariosPendientes.length > 0) {
          // Usar el último comentario (el más cercano a la entrada)
          map.set(id, comentariosPendientes[comentariosPendientes.length - 1]);
        }
      }
      comentariosPendientes = [];
    } else if (t === '' || t === '},') {
      // línea vacía o cierre de entrada → limpiar si no se usaron aún
      if (t === '' ) comentariosPendientes = [];
    }
  }

  return map;
}

// ── Extraer bloque ES de textos-aventuras.js.bak ─────────────────────────────

function extraerBloqueES(aventura) {
  const marcaAventura = `  ${aventura}: {`;
  const idxAv = srcTextos.indexOf(marcaAventura);
  if (idxAv === -1) return '';
  const marcaES = `    es: [`;
  const idxES = srcTextos.indexOf(marcaES, idxAv);
  if (idxES === -1) return '';
  let depth = 0, inicio = -1;
  for (let i = idxES + marcaES.length - 1; i < srcTextos.length; i++) {
    if (srcTextos[i] === '[') { depth++; if (depth === 1) inicio = i + 1; }
    else if (srcTextos[i] === ']') { depth--; if (depth === 0) return srcTextos.slice(inicio, i); }
  }
  return '';
}

function extraerEntradas(bloqueES) {
  const entradas = [];
  const lineas = bloqueES.split('\n');
  let inEntry = false;
  let campoId = null, campoParrafos = null, campoContent = null;
  let bufferParrafos = '', leyendoParrafos = false;

  for (const linea of lineas) {
    const t = linea.trim();
    if (leyendoParrafos) {
      bufferParrafos += ' ' + t;
      const m = bufferParrafos.match(/(\[.*?\]),?/s);
      if (m) { campoParrafos = m[1]; leyendoParrafos = false; }
      continue;
    }
    if (!inEntry) {
      if (t === '{') inEntry = true;
    } else {
      if (t === '},' || t === '}') {
        if (campoId !== null) entradas.push({ id: quitarSufijo(campoId), parrafos: campoParrafos, content: campoContent });
        campoId = null; campoParrafos = null; campoContent = null; bufferParrafos = ''; leyendoParrafos = false;
        inEntry = false;
      } else if (t.startsWith('id:')) {
        const m = t.match(/^id:\s*"([^"]+)"/);
        if (m) campoId = m[1];
      } else if (t.startsWith('title:')) {
        // descartar
      } else if (t.startsWith('parrafos:')) {
        const m = t.match(/^parrafos:\s*(\[.*?\]),?$/s);
        if (m) campoParrafos = m[1];
        else { bufferParrafos = t.replace(/^parrafos:\s*/, ''); leyendoParrafos = true; }
      } else if (t.startsWith('content:')) {
        const m = t.match(/^content:\s*(".*?"),?$/);
        if (m) campoContent = m[1];
      }
    }
  }
  return entradas;
}

// ── Obtener id de coordenadas a partir del id de texto ───────────────────────

function coordId(textId, aventura) {
  const prefijo = PREFIJO_AVENTURA[aventura];
  if (!prefijo) return null;
  const base = `txt-${prefijo}-`;
  if (textId.startsWith(base)) {
    const raw = textId.slice(base.length);                      // P0, TR1, P10…
    const cid = raw.replace(/([A-Za-z]+)(\d+)$/, '$1-$2');     // → P-0, TR-1
    return `${prefijo}-${cid}`;                                 // → Av1-P-0, Av1-TR-1
  }
  return null; // txt-intro u otros sin coordenada directa
}

// ── Generar comentario para una entrada ──────────────────────────────────────

function generarComentario(textId, aventura, coordComments, mapaNumeroMap) {
  const cid = coordId(textId, aventura);
  if (!cid) return '    // Intro';
  const comentario = coordComments.get(cid);
  const mapa = mapaNumeroMap.get(cid);
  const sufMapa = mapa !== undefined ? ` (mapa ${mapa})` : '';
  if (!comentario) return `    // ${cid}${sufMapa}`;
  return '    ' + comentario + sufMapa;
}

// ── Generar nuevo textos-aventuras.js ────────────────────────────────────────

const aventuras = [...srcTextos.matchAll(/^  (\w+): \{/gm)].map(m => m[1]);

let out = 'export const TEXTOS_AVENTURAS = {\n';

for (const aventura of aventuras) {
  const coordComments  = extraerComentariosCoord(aventura);
  const mapaNumeroMap  = buildMapaNumeroMap(aventura);
  const entradas       = extraerEntradas(extraerBloqueES(aventura));

  out += `  ${aventura}: [\n`;
  for (const e of entradas) {
    const comentario = generarComentario(e.id, aventura, coordComments, mapaNumeroMap);
    out += comentario + '\n';
    if (e.content !== null) {
      out += `    { id: "${e.id}", content: ${e.content} },\n`;
    } else {
      out += `    { id: "${e.id}", parrafos: ${e.parrafos} },\n`;
    }
    out += '\n';
  }
  out += '  ],\n\n';
}

out = out.trimEnd().replace(/,\n$/, '\n') + '\n};\n';

writeFileSync('./js/textos-aventuras.js', out, 'utf8');

console.log(`Listo. ${aventuras.length} aventuras procesadas:`);
aventuras.forEach(av => {
  const n = extraerEntradas(extraerBloqueES(av)).length;
  console.log(`  ${av}: ${n} entradas`);
});
