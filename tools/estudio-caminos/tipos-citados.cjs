// Barrido: tokens `CATEGORIA.NOMBRE` entre backticks (o en bloques de código) de GUIA-COMPLETA.md que PARECEN un tipo de mensaje del bus
// (su primer segmento es una categoría de TIPOS_MENSAJE) y que NO son un tipo real de js/constants.js. Imprime el residuo.
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const lib = require(path.join(ROOT, 'tools/lib/analisis-js.js'));

const src = lib.leer('js/constants.js');
const p = lib.parsear(src);
if (!p) throw new Error('constants.js no parsea');
const tipos = new Set();
const categorias = new Set();
lib.recorrer(p.ast, (n) => {
  if (n.type === 'VariableDeclarator' && n.id.name === 'TIPOS_MENSAJE' && n.init && n.init.type === 'ObjectExpression') {
    lib.recorrer(n.init, (m) => {
      if (m.type === 'Literal' && typeof m.value === 'string' && /^[A-Z][A-Z0-9_]*(\.[A-Z][A-Z0-9_]*)*$/.test(m.value) || (m.type === 'Literal' && typeof m.value === 'string' && /^VV:/.test(m.value))) tipos.add(m.value);
    });
    for (const prop of n.init.properties) if (prop.key) categorias.add(prop.key.name || prop.key.value);
  }
});
console.log(`TIPOS_MENSAJE: ${tipos.size} valores, ${categorias.size} categorías (${[...categorias].join(', ')})`);

const guia = fs.readFileSync(path.join(ROOT, 'docs/GUIA-COMPLETA.md'), 'utf8').split(/\r?\n/);
const re = /(?<![\w.])([A-Z][A-Z0-9_]+(?:\.[A-Z][A-Z0-9_]+)+)(?![\w(])/g;
const desconocidos = new Map(); // token -> [líneas]
const prefijos = new Set();
for (const t of tipos) { const seg = t.split('.'); for (let i = 1; i < seg.length; i++) prefijos.add(seg.slice(0, i).join('.')); }
let dentroDeCodigoDeOtroLenguaje = false;
guia.forEach((l, i) => {
  if (/^```/.test(l)) { dentroDeCodigoDeOtroLenguaje = !dentroDeCodigoDeOtroLenguaje; }
  let m;
  while ((m = re.exec(l)) !== null) {
    const tok = m[1];
    const cat = tok.split('.')[0];
    if (!categorias.has(cat)) continue;
    if (tipos.has(tok) || prefijos.has(tok)) continue;
    // `X.*`: comodín de categoría
    if (l.slice(m.index + tok.length).startsWith('.*') || l.slice(m.index + tok.length).startsWith('*')) continue;
    if (!desconocidos.has(tok)) desconocidos.set(tok, []);
    desconocidos.get(tok).push(i + 1);
  }
});
const filas = [...desconocidos.entries()].sort((a, b) => a[0].localeCompare(b[0]));
console.log(`\nTokens con forma de tipo del bus que NO son un tipo de constants.js: ${filas.length}\n`);
for (const [tok, ls] of filas) console.log(`${tok.padEnd(46)} ${ls.length}× en L${ls.slice(0, 6).join(', L')}${ls.length > 6 ? '…' : ''}`);
