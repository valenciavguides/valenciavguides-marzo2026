// Tipos del bus con más de un registro de handler dentro del mismo frame: "se queda el primero y este se ignora" (mensajeria.js:247).
// Parte del extractor de mensajes (mensajes.json: recv = receptores con fichero, línea y tipo canónico).
const { ROOT, salida } = require('./lib.cjs');
const j = JSON.parse(require('fs').readFileSync(salida('mensajes.json'), 'utf8'));
const PADRE = new Set(['codigo-padre.html', 'js/app.js', 'js/funciones-mapa.js', 'js/controladores-padre.js', 'js/mensajeria.js', 'js/state-manager.js', 'js/utils.js']);
const frameDe = (rel) => PADRE.has(rel) ? 'padre' : rel;
const g = {};
for (const r of j.recv) (g[frameDe(r.rel) + '|' + r.canon] ||= []).push(r);
const dup = Object.entries(g).filter(([, v]) => v.length >= 2);
console.log('receptores:', j.recv.length, ' pares (frame, tipo):', Object.keys(g).length, ' con más de un registro:', dup.length);
for (const [k, v] of dup) console.log('  ' + k.padEnd(64) + v.map(r => `${r.rel}:${r.line}[${r.fn}](${r.callee})`).join(' | '));
const sinCanon = j.recv.filter(r => !r.canon); console.log('receptores sin tipo canónico (residuo):', sinCanon.length); sinCanon.slice(0, 15).forEach(r => console.log('  ', r.rel + ':' + r.line, r.raw));
