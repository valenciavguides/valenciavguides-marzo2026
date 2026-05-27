/**
 * generar-padre-fallas.js
 * Genera y escribe el bloque AventuraFallas en aventuras-ID-padre.js.
 * Usa coordenadas-aventuras.js (nombre, tipo, mapa) y los comentarios de
 * textos-aventuras.js (reto_id) para construir los 47×12 elementosIDpadre.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { DATOS_AVENTURAS }  from './js/coordenadas-aventuras.js';
import { TEXTOS_AVENTURAS } from './js/textos-aventuras.js';

const IDIOMAS = ['es','en','fr','it','nl','ja','de','zh','pl','pt','ru','uk'];

// ── Índice de coordenadas AvFallas ────────────────────────────────────────────

const coordArr = DATOS_AVENTURAS.AventuraFallas['coordenadas-hijo2.html'].coordenadas;
const coordIdx = new Map(coordArr.map(c => [c.id, c]));

// ── Extraer comentarios de textos-aventuras.js ────────────────────────────────

const srcTextos = readFileSync('./js/textos-aventuras.js', 'utf8');

function extraerComentarioFallas() {
  const map = new Map();
  const lineas = srcTextos.split('\n');
  let inFallas = false, comentarioPendiente = null;

  for (const linea of lineas) {
    const t = linea.trim();
    if (t.includes('AventuraFallas:')) { inFallas = true; continue; }
    if (!inFallas) continue;
    if (t.includes('Aventura34km:')) break;

    if (t.startsWith('//')) {
      comentarioPendiente = t;
    } else if (t.startsWith('{ id:')) {
      const m = t.match(/id: "([^"]+)"/);
      if (m && comentarioPendiente) {
        map.set(m[1], comentarioPendiente);
        comentarioPendiente = null;
      }
    } else if (t === '') {
      comentarioPendiente = null;
    }
  }
  return map;
}

const comentarios = extraerComentarioFallas();

// ── Extraer reto_id del comentario ────────────────────────────────────────────

function extraerRetoId(comentario, idioma) {
  if (!comentario) return null;
  // Puzzle: "(Reto8Puzzle PZ-01)" → "PZ-01"
  const pzMatch = comentario.match(/\(Reto\d+Puzzle (PZ-\d+)\)/i);
  if (pzMatch) return pzMatch[1];
  // Reto normal: "(Reto 3)" → "R3-AvFallas-{idioma}"
  const rMatch = comentario.match(/\(Reto (\d+)\)/i);
  if (rMatch) return `R${rMatch[1]}-AvFallas-${idioma}`;
  return null;
}

// ── Convertir textId a audioId ────────────────────────────────────────────────

function textIdToAudioId(textId, idioma) {
  if (textId === 'txt-intro') return `audio-intro-${idioma}`;
  // txt-AvFallas-P0  → audio-AvFallas-P-0-{idioma}
  // txt-AvFallas-TR1 → audio-AvFallas-TR-1-{idioma}
  return textId
    .replace('txt-', 'audio-')
    .replace(/-(P|TR)(\d+)$/, '-$1-$2')
    + '-' + idioma;
}

// ── Generar array de entradas para un idioma ──────────────────────────────────

function generarEntradas(idioma) {
  const entries = TEXTOS_AVENTURAS.AventuraFallas ?? [];
  const result  = [];

  for (const entrada of entries) {
    const textId = entrada.id;
    const comentario = comentarios.get(textId) ?? null;

    // ── Intro: genera 3 entradas (pre-intro1, pre-intro2, intro)
    if (textId === 'txt-intro') {
      result.push({
        padreid: 'padre-pre-intro1', tipo: 'pre-intro1', nombre: 'pre-intro1',
        parada_id: 'null', numero_mapa: null,
        texto_id: 'null', audio_id: 'null',
        reto_id: 'PZ-intro',
      });
      result.push({
        padreid: 'padre-pre-intro2', tipo: 'pre-intro1', nombre: 'pre-intro2',
        parada_id: 'null', numero_mapa: null,
        texto_id: 'null', audio_id: 'null',
        reto_id: `R1-AvFallas-${idioma}`,
      });
      result.push({
        padreid: 'padre-intro', tipo: 'intro', nombre: 'Intro',
        parada_id: 'intro', numero_mapa: null,
        texto_id: `txt-intro-${idioma}`, audio_id: `audio-intro-${idioma}`,
        reto_id: `R2-AvFallas-${idioma}`,
      });
      continue;
    }

    // ── Parada
    const pMatch = textId.match(/^txt-AvFallas-P(\d+)$/);
    if (pMatch) {
      const N      = pMatch[1];
      const coordId = `AvFallas-P-${N}`;
      const coord   = coordIdx.get(coordId);
      const tipo    = coord?.tipo ?? 'parada';
      const nombre  = coord?.nombre ?? `Parada ${N}`;
      const mapa    = coord?.mapa_numero ?? null;
      const retoId  = extraerRetoId(comentario, idioma);

      const entry = {
        padreid: `padre-P${N}`, tipo, nombre,
        parada_id: coordId, numero_mapa: mapa,
        texto_id: `txt-AvFallas-P${N}-${idioma}`,
        audio_id: textIdToAudioId(textId, idioma),
      };
      if (retoId) entry.reto_id = retoId;
      result.push(entry);
      continue;
    }

    // ── Tramo
    const tMatch = textId.match(/^txt-AvFallas-TR(\d+)$/);
    if (tMatch) {
      const N      = tMatch[1];
      const coordId = `AvFallas-TR-${N}`;
      const coord   = coordIdx.get(coordId);
      const nombre  = coord?.nombre ?? `Tramo ${N}`;
      const mapa    = coord?.mapa_numero ?? null;

      result.push({
        padreid: `padre-TR${N}`, tipo: 'tramo', nombre,
        tramo_id: coordId, numero_mapa: mapa,
        texto_id: `txt-AvFallas-TR${N}-${idioma}`,
        audio_id: textIdToAudioId(textId, idioma),
      });
      continue;
    }

    console.warn(`ID no reconocido: ${textId}`);
  }

  return result;
}

// ── Serializar una entrada ────────────────────────────────────────────────────

function serializarEntrada(e, comentario) {
  const campos = [];
  campos.push(`padreid: "${e.padreid}"`);
  campos.push(`tipo: "${e.tipo}"`);
  campos.push(`nombre: "${e.nombre}"`);
  if (e.parada_id !== undefined) campos.push(`parada_id: "${e.parada_id}"`);
  if (e.tramo_id  !== undefined) campos.push(`tramo_id: "${e.tramo_id}"`);
  campos.push(`numero_mapa: ${e.numero_mapa === null ? 'null' : (typeof e.numero_mapa === 'string' ? `"${e.numero_mapa}"` : e.numero_mapa)}`);
  campos.push(`texto_id: "${e.texto_id}"`);
  campos.push(`audio_id: "${e.audio_id}"`);
  if (e.reto_id !== undefined) campos.push(`reto_id: "${e.reto_id}"`);

  const comentarioStr = comentario ? `        ${comentario}\n` : '';
  return `${comentarioStr}        {${campos.join(', ')} }`;
}

// ── Generar bloque completo de AventuraFallas ─────────────────────────────────

function generarBloqueAventuraFallas() {
  // Comentarios en ES, reutilizados para todos los idiomas
  const entradas0 = TEXTOS_AVENTURAS.AventuraFallas ?? [];

  let out = '  AventuraFallas: {\n';

  for (const idioma of IDIOMAS) {
    const entradas = generarEntradas(idioma);
    const lineas   = [];
    let eIdx       = 0; // índice en entradas (puede ser 1 textEntry → 3 entries para intro)

    // Re-recorrer texto para mantener comentarios
    let introUsado = false;
    for (const textEntry of entradas0) {
      const textId = textEntry.id;
      const comentario = comentarios.get(textId) ?? null;

      if (textId === 'txt-intro') {
        // pre-intro1 (sin comentario), pre-intro2 (sin comentario), intro (con comentario)
        lineas.push(serializarEntrada(entradas[eIdx++], null));
        lineas.push(serializarEntrada(entradas[eIdx++], null));
        lineas.push(serializarEntrada(entradas[eIdx++], comentario ? `// INTRO (Reto 2)` : null));
      } else {
        lineas.push(serializarEntrada(entradas[eIdx++], comentario));
      }
    }

    out += `    ${idioma}: {\n      elementosIDpadre: [\n`;
    out += lineas.join(',\n');
    out += '\n      ]\n    },\n';
  }

  out += '  }';
  return out;
}

// ── Parchear aventuras-ID-padre.js ───────────────────────────────────────────

const srcPadre = readFileSync('./js/aventuras-ID-padre.js', 'utf8');

// Localizar inicio y fin del bloque AventuraFallas: {  ...  }
const marcaInicio = '  AventuraFallas: {';
const idxStart = srcPadre.indexOf(marcaInicio);
if (idxStart === -1) { console.error('No se encontró AventuraFallas en aventuras-ID-padre.js'); process.exit(1); }

let depth = 0, idxEnd = srcPadre.length;
for (let i = idxStart; i < srcPadre.length; i++) {
  if (srcPadre[i] === '{') depth++;
  else if (srcPadre[i] === '}') {
    depth--;
    if (depth === 0) { idxEnd = i + 1; break; }
  }
}

const bloqueNuevo = generarBloqueAventuraFallas();
const out = srcPadre.slice(0, idxStart) + bloqueNuevo + srcPadre.slice(idxEnd);

writeFileSync('./js/aventuras-ID-padre.js', out, 'utf8');

// ── Verificación ──────────────────────────────────────────────────────────────
console.log('Listo. Verificando...');
const lineas = out.split('\n');
const idxFallas = lineas.findIndex(l => l.includes('AventuraFallas:'));
const muestras = lineas.slice(idxFallas, idxFallas + 20);
muestras.forEach(l => console.log(l));
