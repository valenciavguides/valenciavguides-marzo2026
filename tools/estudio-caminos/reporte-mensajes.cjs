const { ROOT, salida } = require('./lib.cjs');
const fs = require('fs');
const path = require('path');
const d = JSON.parse(fs.readFileSync(salida('mensajes.json'), 'utf8'));
const short = f => f.replace('.html', '').replace('js/', 'js/').replace('coordenadas-hijo2', 'hijo2').replace('extrainfo-hijo1', 'hijo1').replace('audio-hijo3', 'hijo3').replace('retos-hijo4', 'hijo4').replace('boton-casa-hijo5', 'hijo5').replace('chat-hijo6', 'hijo6').replace('codigo-padre', 'PADRE').replace('En-busca-del-tesoro', 'SELEC').replace('mapa-completo', 'MAPA').replace('video-intro', 'VIDEO').replace('puzzle', 'PUZZLE');
const byType = {};
for (const t of d.validos) byType[t] = { emit: [], recv: [] };
for (const e of d.emit) (byType[e.canon] ||= { emit: [], recv: [] }).emit.push(e);
for (const r of d.recv) (byType[r.canon] ||= { emit: [], recv: [] }).recv.push(r);
const lines = [];
const cnt = (arr) => { const m = {}; for (const x of arr) { const k = short(x.rel); m[k] = (m[k] || 0) + 1; } return Object.entries(m).map(([k, v]) => v > 1 ? `${k}×${v}` : k).join(','); };
for (const [t, v] of Object.entries(byType)) {
  const dest = [...new Set(v.emit.map(e => e.destino).filter(Boolean))].join('|');
  lines.push(`${t.padEnd(44)} EMITE[${cnt(v.emit)}] -> {${dest}}   RECIBE[${cnt(v.recv)}]`);
}
fs.writeFileSync(salida('tabla-mensajes.txt'), lines.join('\n'));
console.log(lines.join('\n'));
console.log('\n=== SIN RECEPTOR (hay emisor, ningún registrarControlador*) ===');
for (const [t, v] of Object.entries(byType)) if (v.emit.length && !v.recv.length) console.log(t, '<-', cnt(v.emit));
console.log('\n=== SIN EMISOR (hay receptor, ningún emisor resuelto) ===');
for (const [t, v] of Object.entries(byType)) if (!v.emit.length && v.recv.length) console.log(t, '->', cnt(v.recv));
console.log('\n=== SIN NINGUNO ===');
for (const [t, v] of Object.entries(byType)) if (!v.emit.length && !v.recv.length) console.log(t);
console.log('\n=== RECEPTOR REGISTRADO >1 VEZ EN EL MISMO FRAME ===');
for (const [t, v] of Object.entries(byType)) {
  const m = {}; for (const r of v.recv) (m[r.rel] ||= []).push(r.line);
  for (const [f, ls] of Object.entries(m)) if (ls.length > 1) console.log(t, short(f), 'líneas', ls.join(','));
}
console.log('\n=== EMISORES del mismo tipo desde >=2 frames distintos ===');
for (const [t, v] of Object.entries(byType)) {
  const fr = new Set(v.emit.map(e => short(e.rel)));
  if (fr.size >= 2) console.log(t.padEnd(44), [...fr].join(','));
}
