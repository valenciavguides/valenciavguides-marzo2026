/**
 * generar-audios-aventuras.js
 * Genera audios-aventuras.js completo:
 *   - Comentarios idénticos a textos-aventuras.js (fuente: coordenadas-aventuras)
 *   - IDs en nuevo formato: audio-Av1-P-0-es, audio-Av1-TR-1-es
 *   - Title extraído del comentario: "Parada 0: Torres de Serranos (start)"
 *   - Prefijo "Parada"/"Tramo" traducido por idioma
 *   - file: preservado del archivo actual si no está vacío
 *   - AventuraFallas: 47 entradas × 12 idiomas generadas desde textos-aventuras
 *   - Aventura34km: arrays vacíos (sin datos aún)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { TEXTOS_AVENTURAS } from './js/textos-aventuras.js';
import { AUDIOS_AVENTURAS } from './js/audios-aventuras.js';

// ── Constantes ────────────────────────────────────────────────────────────────

const IDIOMAS = ['es', 'en', 'fr', 'it', 'nl', 'ja', 'de', 'zh', 'pl', 'pt', 'ru', 'uk'];

const AVENTURAS_GENERAR = ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5', 'AventuraFallas'];
const AVENTURAS_VACIAS  = ['Aventura34km'];

// ── Traducciones de prefijo por idioma ────────────────────────────────────────

const PREFIJO_IDIOMA = {
  es: { parada: 'Parada',      tramo: 'Tramo'     },
  en: { parada: 'Stop',        tramo: 'Section'   },
  fr: { parada: 'Étape',       tramo: 'Section'   },
  it: { parada: 'Tappa',       tramo: 'Tratto'    },
  nl: { parada: 'Stop',        tramo: 'Traject'   },
  ja: { parada: '停留所',      tramo: '区間'      },
  de: { parada: 'Halt',        tramo: 'Abschnitt' },
  zh: { parada: '站',          tramo: '段'        },
  pl: { parada: 'Przystanek',  tramo: 'Odcinek'   },
  pt: { parada: 'Parada',      tramo: 'Percurso'  },
  ru: { parada: 'Остановка',   tramo: 'Участок'   },
  uk: { parada: 'Зупинка',     tramo: 'Ділянка'   },
};

// ── Extraer comentarios de textos-aventuras.js ────────────────────────────────

const srcTextos = readFileSync('./js/textos-aventuras.js', 'utf8');

function extraerComentariosTextos() {
  const map = new Map();
  const lineas = srcTextos.split('\n');
  let comentarioPendiente = null;

  for (const linea of lineas) {
    const t = linea.trim();
    if (t.startsWith('//')) {
      comentarioPendiente = t;
    } else if (t.startsWith('{ id:')) {
      const m = t.match(/\{ id: "([^"]+)"/);
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

const comentariosTextos = extraerComentariosTextos();

// ── Extraer título base (español) desde el comentario ─────────────────────────

function comentarioToTitulo(comentario) {
  if (!comentario) return '';
  let txt = comentario.replace(/^\/\/\s*/, '');
  // Eliminar desde (Reto...), (Párrafos...) o (mapa...) en adelante
  txt = txt.replace(/\s*\((Reto|Párrafos|mapa)[^)]*\).*/i, '').trim();
  // "Parada X - Nombre" → "Parada X: Nombre"
  txt = txt.replace(/\s+-\s+/, ': ');
  return txt;
}

// ── Traducir el prefijo Parada/Tramo al idioma correspondiente ────────────────

function traducirPrefijo(titulo, idioma) {
  const p = PREFIJO_IDIOMA[idioma];
  if (!p) return titulo;
  return titulo
    .replace(/^Parada\b/, p.parada)
    .replace(/^Tramo\b/, p.tramo);
}

// ── Conversión de ID de texto a ID de audio ───────────────────────────────────

function textIdToAudioId(textId, idioma) {
  if (textId === 'txt-intro') return `audio-intro-${idioma}`;
  return textId
    .replace('txt-', 'audio-')
    .replace(/-(P|TR)(\d+)$/, '-$1-$2')
    + '-' + idioma;
}

// ID en formato antiguo (fallback para buscar file en datos existentes)
function textIdToOldAudioId(textId, idioma) {
  if (textId === 'txt-intro') return `audio-intro-${idioma}`;
  return textId.replace('txt-', 'audio-') + '-' + idioma;
}

// ── Construir índice de datos existentes: id → {file} ────────────────────────

function buildAudioIndex(aventura, idioma) {
  const entries = AUDIOS_AVENTURAS[aventura]?.[idioma] ?? [];
  return new Map(entries.map(e => [e.id, { file: e.file ?? '' }]));
}

// ── Serializar entrada ────────────────────────────────────────────────────────

function serializarEntrada(comentario, audioId, title, file) {
  const titleStr = JSON.stringify(title);
  const fileStr  = JSON.stringify(file);
  return `      ${comentario}\n      {\n        id: "${audioId}",\n        title: ${titleStr},\n        file: ${fileStr}\n      },`;
}

// ── Generar bloque de un idioma para una aventura ─────────────────────────────

function generarBloqueIdioma(aventura, idioma) {
  const entradas   = TEXTOS_AVENTURAS[aventura] ?? [];
  const audioIndex = buildAudioIndex(aventura, idioma);
  const lineas     = [];

  for (const entrada of entradas) {
    const textId     = entrada.id;
    const audioId    = textIdToAudioId(textId, idioma);
    const oldId      = textIdToOldAudioId(textId, idioma);
    const comentario = comentariosTextos.get(textId) ?? `// ${textId}`;
    const baseTitle  = comentarioToTitulo(comentario);
    const title      = traducirPrefijo(baseTitle, idioma);
    const existing   = audioIndex.get(audioId) ?? audioIndex.get(oldId);
    const file       = existing?.file ?? '';

    lineas.push(serializarEntrada(comentario, audioId, title, file));
  }

  return lineas.join('\n\n');
}

// ── Generar archivo completo ──────────────────────────────────────────────────

let out = 'export const AUDIOS_AVENTURAS = {\n';

for (const aventura of AVENTURAS_GENERAR) {
  out += `  ${aventura}: {\n`;
  for (const idioma of IDIOMAS) {
    const bloque = generarBloqueIdioma(aventura, idioma);
    out += `    ${idioma}: [\n${bloque}\n    ],\n`;
  }
  out += '  },\n\n';
}

for (const aventura of AVENTURAS_VACIAS) {
  out += `  ${aventura}: {\n`;
  for (const idioma of IDIOMAS) {
    out += `    ${idioma}: [],\n`;
  }
  out += '  },\n\n';
}

out = out.trimEnd().replace(/,\n$/, '\n') + '\n};\n';

writeFileSync('./js/audios-aventuras.js', out, 'utf8');

// ── Resumen ───────────────────────────────────────────────────────────────────
console.log('Listo.');
for (const aventura of AVENTURAS_GENERAR) {
  const n = (TEXTOS_AVENTURAS[aventura] ?? []).length;
  console.log(`  ${aventura}: ${n} entradas × ${IDIOMAS.length} idiomas = ${n * IDIOMAS.length} entradas`);
}
