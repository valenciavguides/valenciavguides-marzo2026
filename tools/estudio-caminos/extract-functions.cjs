// Extractor de funciones con parser real (acorn) para el barrido de "un solo camino".
// Cubre lo que tools/inventory.js NO ve: métodos de objeto-literal, flechas sin paréntesis,
// asignaciones a miembros (x.y = function), propiedades con función, clases.
// Salida: <carpeta de salida>/funciones.json  (+ resumen por consola, con control de residuo: ficheros que no parsean).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const OUT = salida('funciones.json');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));

function listFiles() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.html') || f === 'sw.js') out.push(f);
  }
  const jsDir = path.join(ROOT, 'js');
  for (const f of fs.readdirSync(jsDir)) {
    if (f.endsWith('.js')) out.push('js/' + f);
  }
  return out;
}

function extractBlocks(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, lineOffset: 0, kind: 'file' }];
  const blocks = [];
  // Los comentarios HTML pueden citar "<script>" en prosa (index.html:72): se blanquean
  // conservando los saltos de línea para no desplazar la numeración.
  const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' '));
  // idem el texto crudo de <style> (el CSS puede citar "<script>" en un comentario, index.html:72)
  const clean2 = clean.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (all, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(clean2)) !== null) {
    const attrs = m[1] || '';
    if (/\bsrc\s*=/.test(attrs)) continue;
    const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(attrs);
    const type = t ? t[1].toLowerCase() : '';
    if (type && type !== 'module' && type !== 'text/javascript' && type !== 'application/javascript') continue;
    const before = src.slice(0, m.index + m[0].indexOf('>') + 1);
    const lineOffset = before.split('\n').length - 1;
    const cs = m.index + m[0].indexOf('>') + 1;
    blocks.push({ code: src.slice(cs, cs + m[2].length), lineOffset, kind: type === 'module' ? 'module' : 'classic' });
  }
  return blocks;
}

function walk(node, visit, parent, key) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, parent, key);
  for (const k of Object.keys(node)) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, visit, node, k));
    else if (v && typeof v.type === 'string') walk(v, visit, node, k);
  }
}

function memberName(n) {
  if (!n) return null;
  if (n.type === 'Identifier') return n.name;
  if (n.type === 'MemberExpression') {
    const o = memberName(n.object);
    const p = n.computed ? '[…]' : (n.property.name || n.property.value);
    return (o ? o + '.' : '') + p;
  }
  if (n.type === 'ThisExpression') return 'this';
  return null;
}

function nameFor(fn, parent) {
  if (fn.id && fn.id.name) return { name: fn.id.name, how: 'decl' };
  if (!parent) return { name: '<anon>', how: 'anon' };
  if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') return { name: parent.id.name, how: 'var' };
  if (parent.type === 'AssignmentExpression') { const n = memberName(parent.left); if (n) return { name: n, how: 'assign' }; }
  if (parent.type === 'Property') { const k = parent.key.name || parent.key.value; if (k !== undefined) return { name: String(k), how: 'prop' }; }
  if (parent.type === 'MethodDefinition') { const k = parent.key.name || parent.key.value; return { name: String(k), how: 'method' }; }
  if (parent.type === 'PropertyDefinition') { const k = parent.key.name || parent.key.value; return { name: String(k), how: 'field' }; }
  return { name: '<anon>', how: 'anon' };
}

function normTokens(code) {
  const toks = [];
  try {
    for (const t of acorn.tokenizer(code, { ecmaVersion: 'latest', sourceType: 'module', allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true })) {
      toks.push(t);
    }
  } catch (e) { return null; }
  return toks;
}

const result = { files: {}, functions: [], unparsed: [] };
for (const rel of listFiles()) {
  const abs = path.join(ROOT, rel);
  const src = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
  const blocks = extractBlocks(rel, src);
  result.files[rel] = { lines: src.split('\n').length, blocks: blocks.length };
  blocks.forEach((b, bi) => {
    let ast = null;
    let err = null;
    for (const st of ['module', 'script']) {
      try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowHashBang: true }); err = null; break; }
      catch (e) { err = e; }
    }
    if (!ast) { result.unparsed.push({ rel, block: bi, error: String(err && err.message) }); return; }
    walk(ast, (node, parent) => {
      if (node.type !== 'FunctionDeclaration' && node.type !== 'FunctionExpression' && node.type !== 'ArrowFunctionExpression') return;
      const { name, how } = nameFor(node, parent);
      const code = b.code.slice(node.start, node.end);
      const toks = normTokens(code);
      if (!toks) return;
      const text = toks.map(t => (t.type.label === 'string' ? JSON.stringify(t.value) : (t.value !== undefined && t.value !== null ? String(t.value) : t.type.label))).join(' ');
      const shape = toks.map(t => {
        const l = t.type.label;
        if (l === 'name') return 'ID';
        if (l === 'string' || l === 'num' || l === 'regexp' || l === 'template' || l === '`') return 'LIT';
        return t.value !== undefined && t.value !== null ? String(t.value) : l;
      }).join(' ');
      result.functions.push({
        file: rel, name, how,
        start: node.loc.start.line + b.lineOffset,
        end: node.loc.end.line + b.lineOffset,
        nTok: toks.length,
        async: !!node.async,
        params: node.params.length,
        depth: 0,
        text, shape,
      });
    });
  });
}
fs.writeFileSync(OUT, JSON.stringify(result));
console.log('ficheros', Object.keys(result.files).length, 'funciones', result.functions.length, 'sin parsear', result.unparsed.length);
for (const u of result.unparsed) console.log('  SIN PARSEAR:', u.rel, 'bloque', u.block, u.error);
