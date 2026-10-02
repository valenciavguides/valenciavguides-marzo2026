// Inverso: handlers registrados en un frame para un tipo que ninguna emisión alcanza (destino literal = ese frame, broadcast o dinámico).
const { ROOT, salida } = require('./lib.cjs');
const fs = require('fs');
const path = require('path');
const m = JSON.parse(fs.readFileSync(salida('mensajes.json'), 'utf8'));
const FRAME = rel => {
  if (/^(codigo-padre\.html|js\/app\.js|js\/funciones-mapa\.js|js\/controladores-padre\.js|js\/state-manager\.js|js\/monitoreo\.js)$/.test(rel)) return 'padre';
  const mp = { 'coordenadas-hijo2.html': 'hijo2', 'audio-hijo3.html': 'hijo3', 'retos-hijo4.html': 'hijo4', 'boton-casa-hijo5.html': 'hijo5', 'chat-hijo6.html': 'hijo6', 'extrainfo-hijo1.html': 'hijo1', 'En-busca-del-tesoro.html': 'seleccion', 'mapa-completo.html': 'mapa', 'puzzle.html': 'puzzle', 'video-intro.html': 'video' };
  return mp[rel] || rel;
};
const DEST = d => { if (!d) return 'dyn'; const mm = /^"(.*)"$/.exec(d); if (!mm) return 'dyn'; return ({ padre: 'PARENT', 'hijo1-opciones': 'hijo1', hijo1: 'hijo1', hijo2: 'hijo2', hijo3: 'hijo3', hijo4: 'hijo4', hijo5: 'hijo5', 'hijo6-chat': 'hijo6', hijo6: 'hijo6', seleccion: 'seleccion', 'mapa-completo': 'mapa', puzzle: 'puzzle', 'video-intro': 'video', broadcast: 'broadcast' })[mm[1]] || 'otro'; };
const out = []; let n = 0;
const emByTipo = {}; for (const e of m.emit) (emByTipo[e.canon] ||= []).push({ ...e, d: DEST(e.destino) });
const seen = new Set();
for (const r of m.recv) {
  const f = FRAME(r.rel); const key = r.canon + '|' + f; if (seen.has(key)) continue; seen.add(key);
  const E = emByTipo[r.canon] || [];
  // una emisión alcanza al frame f si: destino literal == f; broadcast; dinámico; o destino 'padre' desde un hijo (PARENT) y f=='padre' / (o el anfitrión: puzzle->hijo4|seleccion, video->seleccion, mapa->padre)
  const alcanza = E.some(e => {
    if (e.d === 'dyn' || e.d === 'broadcast' || e.d === 'otro') return true;
    if (e.d === 'PARENT') { const ef = FRAME(e.rel); if (ef === 'puzzle') return f === 'hijo4' || f === 'seleccion'; if (ef === 'video') return f === 'seleccion'; if (ef === 'mapa') return f === 'padre'; return f === 'padre'; }
    return e.d === f;
  });
  if (!alcanza) { n++; out.push(`${r.canon}  handler en ${f} (${r.rel}:${r.line})  — ninguna emisión lo alcanza; emisores: ${E.map(e => FRAME(e.rel) + '→' + e.d).join(', ') || '(ninguno)'}`); }
}
out.push('\nHandlers inalcanzables por destino: ' + n);
fs.writeFileSync(salida('destinos-inverso.txt'), out.join('\n'));
console.log(out.join('\n'));
