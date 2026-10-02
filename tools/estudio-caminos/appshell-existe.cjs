const fs = require('fs'); const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const src = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8').replace(/\r\n/g, '\n');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
let lista = null;
for (const n of ast.body) if (n.type === 'VariableDeclaration') for (const d of n.declarations) if (d.id.name === 'APP_SHELL') lista = d.init.elements.map(e => ({ v: e.value, line: e.loc.start.line }));
const faltan = []; let ok = 0;
for (const e of lista) { const rel = decodeURIComponent(e.v).replace(/^\//, ''); if (rel === '' ) { ok++; continue; } if (fs.existsSync(path.join(ROOT, rel))) ok++; else faltan.push(`sw.js:${e.line} ${e.v}`); }
console.log('APP_SHELL:', lista.length, 'entradas; existen', ok, '; faltan', faltan.length); faltan.forEach(x => console.log('  ' + x));
// duplicados dentro de la lista
const vistos = {}; for (const e of lista) (vistos[e.v] ||= []).push(e.line); const dup = Object.entries(vistos).filter(([, l]) => l.length > 1); console.log('entradas repetidas:', dup.length, dup.map(([k, l]) => k + '@' + l.join(',')).join(' '));
