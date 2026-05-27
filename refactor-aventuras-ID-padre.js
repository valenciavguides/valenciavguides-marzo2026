/**
 * refactor-aventuras-ID-padre.js
 * Actualiza aventuras-ID-padre.js con los nuevos formatos de ID:
 *   - parada_id: "P-0"  → "Av1-P-0"   (prefijo de aventura)
 *   - tramo_id:  "TR-1" → "Av1-TR-1"  (prefijo de aventura)
 *   - audio_id: "audio-Av1-P0-es" → "audio-Av1-P-0-es" (guión antes del número)
 * Solo procesa Aventura1-5 (AventuraFallas está vacía, se aborda por separado).
 */

import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('./js/aventuras-ID-padre.js', 'utf8');

// ── Prefijos por aventura ─────────────────────────────────────────────────────

const PREFIJOS = {
  Aventura1: 'Av1',
  Aventura2: 'Av2',
  Aventura3: 'Av3',
  Aventura4: 'Av4',
  Aventura5: 'Av5',
};

// ── Localizar bloque de una aventura en el texto ──────────────────────────────

function extraerBloque(texto, aventura) {
  const marca = `  ${aventura}: {`;
  const idxStart = texto.indexOf(marca);
  if (idxStart === -1) return null;

  let depth = 0, idxEnd = texto.length;
  for (let i = idxStart; i < texto.length; i++) {
    if (texto[i] === '{') depth++;
    else if (texto[i] === '}') {
      depth--;
      if (depth === 0) { idxEnd = i + 1; break; }
    }
  }
  return { start: idxStart, end: idxEnd };
}

// ── Aplicar cambios ───────────────────────────────────────────────────────────

let out = src;

// 1. audio_id: insertar guión entre P/TR y el número (global, todas las aventuras)
//    "audio-Av1-P0-es" → "audio-Av1-P-0-es"
//    "audio-Av1-TR10-es" → "audio-Av1-TR-10-es"
out = out.replace(/(audio-Av\w+-)(P|TR)(\d+)(-\w+)/g, '$1$2-$3$4');

// 2. parada_id y tramo_id: añadir prefijo de aventura (por bloque)
for (const [aventura, prefijo] of Object.entries(PREFIJOS)) {
  const pos = extraerBloque(out, aventura);
  if (!pos) { console.warn(`Bloque no encontrado: ${aventura}`); continue; }

  const before = out.slice(0, pos.start);
  let   block  = out.slice(pos.start, pos.end);
  const after  = out.slice(pos.end);

  block = block.replace(/parada_id: "P-/g,  `parada_id: "${prefijo}-P-`);
  block = block.replace(/tramo_id: "TR-/g,  `tramo_id: "${prefijo}-TR-`);

  out = before + block + after;
}

writeFileSync('./js/aventuras-ID-padre.js', out, 'utf8');

// ── Verificación rápida ───────────────────────────────────────────────────────
console.log('Listo. Verificando muestra...');
const lineas = out.split('\n');
const muestras = lineas.filter(l =>
  l.includes('parada_id') || l.includes('tramo_id') || l.includes('audio_id')
).slice(0, 12);
muestras.forEach(l => console.log(l.trim()));
