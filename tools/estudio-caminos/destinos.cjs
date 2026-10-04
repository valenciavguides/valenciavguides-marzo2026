// Destino literal de cada emisión frente a los frames que registran handler para ese tipo.
// Marca: emisión con destino literal cuyo frame NO tiene handler del tipo (mensaje que cae en "sin handler").
const { ROOT, salida } = require('./lib.cjs');
const fs = require('fs');
const path = require('path');
const m = JSON.parse(fs.readFileSync(salida('mensajes.json'), 'utf8'));
const FRAME = rel => {
  if (/^(codigo-padre\.html|js\/app\.js|js\/funciones-mapa\.js|js\/controladores-padre\.js|js\/state-manager\.js)$/.test(rel)) return 'padre';
  if (rel === 'coordenadas-hijo2.html') return 'hijo2';
  if (rel === 'audio-hijo3.html') return 'hijo3';
  if (rel === 'retos-hijo4.html') return 'hijo4';
  if (rel === 'boton-casa-hijo5.html') return 'hijo5';
  if (rel === 'chat-hijo6.html') return 'hijo6';
  if (rel === 'extrainfo-hijo1.html') return 'hijo1';
  if (rel === 'En-busca-del-tesoro.html') return 'seleccion';
  if (rel === 'mapa-completo.html') return 'mapa';
  if (rel === 'puzzle.html') return 'puzzle';
  if (rel === 'video-intro.html') return 'video';
  return rel; // modulos compartidos (mensajeria.js, utils.js): quien los cargue
};
const DEST = d => {
  if (!d) return null;
  const mm = /^"(.*)"$/.exec(d); if (!mm) return 'dyn:' + d;
  const s = mm[1];
  return ({ padre: 'padre', 'hijo1-opciones': 'hijo1', hijo1: 'hijo1', hijo2: 'hijo2', hijo3: 'hijo3', hijo4: 'hijo4', hijo5: 'hijo5', 'hijo6-chat': 'hijo6', hijo6: 'hijo6', seleccion: 'seleccion', 'mapa-completo': 'mapa', puzzle: 'puzzle', 'video-intro': 'video', broadcast: 'broadcast' })[s] || 'otro:' + s;
};
const recvFrames = {}; for (const r of m.recv) (recvFrames[r.canon] ||= new Set()).add(FRAME(r.rel));
const out = []; let malos = 0;
const porTipo = {};
for (const e of m.emit) { const d = DEST(e.destino); (porTipo[e.canon] ||= []).push({ ...e, d }); }
for (const [t, arr] of Object.entries(porTipo).sort()) {
  const R = recvFrames[t] || new Set();
  const lit = arr.filter(e => e.d && !e.d.startsWith('dyn:') && e.d !== 'broadcast');
  const sinHandler = lit.filter(e => !R.has(e.d));
  const dyn = arr.filter(e => !e.d || e.d.startsWith('dyn:')).length;
  if (sinHandler.length) { malos++; out.push(`${t}  receptores=[${[...R].join(',')}]  EMISIONES AL VACÍO (${sinHandler.length}): ` + sinHandler.map(e => `${e.rel}:${e.line}→${e.d}`).join('  ') + (dyn ? `  (+${dyn} con destino dinámico)` : '')); }
}
out.push('\nTipos con al menos una emisión de destino literal sin handler en ese frame: ' + malos);
// tipos emitidos que no tienen NINGÚN receptor
const sinNinguno = Object.keys(porTipo).filter(t => !recvFrames[t]);
out.push('Tipos emitidos sin ningún receptor registrado: ' + sinNinguno.join(', '));
fs.writeFileSync(salida('destinos.txt'), out.join('\n'));
console.log(out.join('\n'));
