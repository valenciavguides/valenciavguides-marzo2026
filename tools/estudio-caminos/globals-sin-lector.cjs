// Globals que el código PUBLICA (globalThis.X = …, window.X = …) y que ningún otro sitio de producción lee por su nombre.
// Método: AST (acorn, tools/lib/analisis-js.js) sobre js/*.js y los bloques inline de los .html de la raíz; para cada nombre publicado se
// cuentan, en TODOS los ficheros de texto del repo (búsqueda desnuda), las líneas donde aparece que NO son una asignación a ese nombre.
// Se imprime el residuo (ficheros que no parsean) y, por nombre, dónde aparece fuera de su asignación (producción / specs / docs).
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const lib = require(path.join(ROOT, 'tools/lib/analisis-js.js'));

const publicados = new Map(); // nombre -> [{fichero, linea}]
const residuo = [];

function analizar(rel, codigo, offsetLinea) {
  const p = lib.parsear(codigo);
  if (!p) { residuo.push(rel + ': bloque que no parsea'); return; }
  lib.recorrer(p.ast, (n) => {
    if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed) {
      const o = n.left.object;
      if (o.type === 'Identifier' && (o.name === 'globalThis' || o.name === 'window') && n.left.property.type === 'Identifier') {
        const nombre = n.left.property.name;
        if (!publicados.has(nombre)) publicados.set(nombre, []);
        publicados.get(nombre).push({ fichero: rel, linea: n.loc.start.line + offsetLinea });
      }
    }
  });
}

for (const rel of [...lib.modulos(), ...lib.paginas()]) {
  for (const b of lib.bloques(rel)) analizar(rel, b.code, b.lineaBase);
}

// corpus de texto del repo
const EXT = new Set(['.js', '.cjs', '.mjs', '.html', '.css', '.md', '.json', '.txt']);
const SALTAR = new Set(['.git', 'node_modules', 'playwright-report', 'test-results', 'imagenes', 'audios-aventuras', 'audios', 'videos', 'fonts', 'report']);
const corpus = [];
(function rec(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SALTAR.has(e.name)) rec(path.join(dir, e.name)); continue; }
    if (EXT.has(path.extname(e.name).toLowerCase())) corpus.push(path.join(dir, e.name));
  }
})(ROOT);
const lineas = new Map();
for (const f of corpus) { try { lineas.set(f, fs.readFileSync(f, 'utf8').split(/\r?\n/)); } catch (_) { residuo.push(`${f}: ilegible`); } }

const clase = (rel) => (/^docs\//.test(rel) ? 'doc' : /^tests\//.test(rel) ? 'spec' : /^tools\//.test(rel) ? 'tool' : 'prod');
const filas = [];
for (const [nombre, sitios] of publicados) {
  const esc = nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\w$])${esc}(?![\\w$])`);
  // No cuentan como "lector": la asignación, el `delete` de limpieza (con su guarda `if (globalThis.X)`), la definición de la función/const
  // con ese nombre y la lista de exports. Sí cuenta cualquier otra aparición (llamada, comparación, typeof, paso como valor…).
  const asign = new RegExp(
    `(globalThis|window)\\.${esc}\\s*=(?!=)` +
    `|delete\\s+(globalThis|window)\\.${esc}\\b` +
    `|\\b(async\\s+)?function\\s*\\*?\\s*${esc}\\s*\\(` +
    `|\\b(const|let|var|class)\\s+${esc}\\b` +
    `|^\\s*export\\s*\\{[^}]*\\b${esc}\\b`);
  const otros = { prod: [], spec: [], tool: [], doc: [] };
  for (const [f, L] of lineas) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    L.forEach((l, i) => { const tl = l.trim(); const esComentario = tl.startsWith('//') || tl.startsWith('*') || tl.startsWith('/*') || tl.startsWith('<!--'); if (re.test(l) && !asign.test(l) && !(esComentario && clase(rel) === 'prod')) otros[clase(rel)].push(`${rel}:${i + 1}`); });
  }
  filas.push({ nombre, sitios, otros });
}
filas.sort((a, b) => a.otros.prod.length - b.otros.prod.length || a.nombre.localeCompare(b.nombre));
const sinLectorProd = filas.filter((f) => f.otros.prod.length === 0);
console.log(`globals publicados: ${filas.length}; sin ninguna aparición de producción fuera de su asignación: ${sinLectorProd.length}\n`);
for (const f of sinLectorProd) {
  const s = f.sitios.map((x) => `${x.fichero}:${x.linea}`).join(', ');
  console.log(`${f.nombre.padEnd(34)} publicado en ${s}`);
  console.log(`   specs: ${f.otros.spec.length} ${f.otros.spec.slice(0, 3).join(' ')}   tools: ${f.otros.tool.length}   docs: ${f.otros.doc.length}`);
}
console.log('\nRESIDUO (' + residuo.length + '):'); residuo.slice(0, 20).forEach((r) => console.log('  ' + r));
