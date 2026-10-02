'use strict';
// Comprueba docs/estudio-caminos.md: (1) cada tabla markdown tiene el mismo número de celdas en todas sus filas (ignora los `\|` escapados y
// los pipes dentro de backticks), (2) las entradas K y las mediciones M van consecutivas, (3) las discrepancias G van consecutivas en la
// tabla de estado de R2.5 (la primera tabla de R2.5 es la fotografía original y solo llega a G-16), y (4) ninguna referencia K-nn, M-n, G-n o En
// apunta a algo que no existe. Sale con código 1 si algo falla.
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib.cjs');

const L = fs.readFileSync(path.join(ROOT, 'docs/estudio-caminos.md'), 'utf8').split('\n');
const t = L.join('\n');
let problemas = 0;
const mal = (msg) => { problemas++; console.log('  ✗ ' + msg); };

function celdas(l) {
  let n = 0, code = false;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (c === '`') code = !code;
    else if (c === '\\' && l[i + 1] === '|') i++;
    else if (c === '|' && !code) n++;
  }
  return n - 1;
}

let i = 0, tablas = 0;
while (i < L.length) {
  if (L[i].startsWith('|')) {
    const s = i;
    while (i < L.length && L[i].startsWith('|')) i++;
    const rows = L.slice(s, i);
    const h = celdas(rows[0]);
    tablas++;
    rows.forEach((r, k) => { if (celdas(r) !== h) mal(`L${s + k + 1}: ${celdas(r)} celdas frente a ${h} | ${r.slice(0, 100)}`); });
  } else i++;
}
console.log('tablas', tablas);

const consecutivos = (xs) => xs.every((n, j) => n === j + 1);
const k = [...t.matchAll(/^##### K-(\d\d) /gm)].map((x) => +x[1]);
console.log('entradas K', k.length, consecutivos(k) ? 'consecutivas' : 'NO consecutivas');
if (!consecutivos(k)) mal('las entradas K no son consecutivas');

const m = [...t.matchAll(/^\| M-(\d+) \|/gm)].map((x) => +x[1]);
console.log('mediciones M', m.length, consecutivos(m) ? 'consecutivas' : 'NO consecutivas');
if (!consecutivos(m)) mal('las mediciones M no son consecutivas');

const iEstado = t.indexOf('**Estado tras la tanda de arreglos');
const g = iEstado < 0 ? [] : [...t.slice(iEstado).matchAll(/^\| G-(\d+) \|/gm)].map((x) => +x[1]);
console.log('discrepancias G (tabla de estado)', g.length, consecutivos(g) ? 'consecutivas' : 'NO consecutivas');
if (!g.length || !consecutivos(g)) mal('la tabla de estado de las discrepancias G no existe o no es consecutiva');

const erratas = [...t.matchAll(/^- \*\*E(\d+) —/gm)].map((x) => +x[1]);
console.log('erratas E', erratas.length, consecutivos(erratas) ? 'consecutivas' : 'NO consecutivas');
if (!consecutivos(erratas)) mal('las erratas E no son consecutivas');

const fuera = (re, max) => [...new Set([...t.matchAll(re)].map((x) => +x[1]))].filter((n) => n > max);
const refs = [
  ['K-nn', fuera(/\bK-(\d\d)\b/g, k.length)],
  ['M-n', fuera(/\bM-(\d+)\b/g, m.length)],
  ['G-n', fuera(/\bG-(\d+)\b/g, g.length)],
  ['En', fuera(/\bE(\d)\b/g, erratas.length)],
];
for (const [nombre, f] of refs) {
  console.log(`referencias ${nombre} fuera de rango:`, f.join(',') || 'ninguna');
  if (f.length) mal(`referencias ${nombre} fuera de rango: ${f.join(',')}`);
}
if (problemas) { console.log(`\n${problemas} problema(s)`); process.exitCode = 1; } else console.log('\nsin problemas');
