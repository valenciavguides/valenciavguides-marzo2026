// Escrituras a globalThis/window y grafo de módulos por frame.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS_FICHEROS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js','js/indice-aventuras.js']);
function listFiles() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) out.push(f);
  for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js')) out.push('js/' + f);
  return out;
}
function extractBlocks(rel, src) {
  if (!rel.endsWith('.html')) return { blocks: [{ code: src, lineOffset: 0 }], srcs: [] };
  const blocks = [], srcs = [];
  const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' '));
  const clean2 = clean.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(clean2)) !== null) {
    const attrs = m[1] || '';
    const sm = /\bsrc\s*=\s*["']([^"']+)["']/.exec(attrs);
    if (sm) { srcs.push(sm[1]); continue; }
    const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(attrs);
    const type = t ? t[1].toLowerCase() : '';
    if (type && type !== 'module' && type !== 'text/javascript' && type !== 'application/javascript') continue;
    const cs = m.index + m[0].indexOf('>') + 1;
    blocks.push({ code: src.slice(cs, cs + m[2].length), lineOffset: src.slice(0, cs).split('\n').length - 1 });
  }
  return { blocks, srcs };
}
function walk(node, visit, parents) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, parents);
  const np = parents.concat(node);
  for (const k of Object.keys(node)) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, visit, np));
    else if (v && typeof v.type === 'string') walk(v, visit, np);
  }
}
const GL = new Set(['globalThis', 'window', 'self']);
const REMOTE = new Set(['parent', 'top', 'opener']);
function normImport(from, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) return null;
  const base = from.includes('/') ? path.posix.dirname(from) : '';
  let p = spec.startsWith('/') ? spec.slice(1) : path.posix.normalize(path.posix.join(base, spec));
  return p;
}
const info = {};
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  const { blocks, srcs } = extractBlocks(rel, src);
  const rec = { imports: new Set(), writes: [], remoteWrites: [] };
  for (const s of srcs) { const n = normImport(rel, s); if (n) rec.imports.add(n); }
  for (const b of blocks) {
    let ast = null;
    for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) { console.log('NO PARSEA', rel); continue; }
    const enclosing = (parents) => {
      for (let i = parents.length - 1; i >= 0; i--) {
        const p = parents[i];
        if (p.type === 'FunctionDeclaration' && p.id) return p.id.name;
        if (p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression') {
          const q = parents[i - 1];
          if (p.id && p.id.name) return p.id.name;
          if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name;
          if (q && q.type === 'AssignmentExpression' && q.left.type === 'MemberExpression') return '→' + (q.left.property.name || '?');
        }
      }
      return '<top>';
    };
    walk(ast, (n, parents) => {
      const line = n.loc.start.line + b.lineOffset;
      if (n.type === 'ImportDeclaration' && typeof n.source.value === 'string') { const x = normImport(rel, n.source.value); if (x) rec.imports.add(x); }
      if (n.type === 'ExportNamedDeclaration' && n.source) { const x = normImport(rel, n.source.value); if (x) rec.imports.add(x); }
      if (n.type === 'ImportExpression' && n.source.type === 'Literal') { const x = normImport(rel, n.source.value); if (x) rec.imports.add(x); }
      if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed) {
        const o = n.left.object;
        const prop = n.left.property.name;
        if (o.type === 'Identifier' && GL.has(o.name)) rec.writes.push({ name: prop, line, fn: enclosing(parents), op: n.operator });
        else if (o.type === 'MemberExpression' && o.object.type === 'Identifier' && GL.has(o.object.name) && !o.computed && REMOTE.has(o.property.name)) rec.remoteWrites.push({ via: o.property.name, name: prop, line, fn: enclosing(parents) });
        else if (o.type === 'Identifier' && REMOTE.has(o.name)) rec.remoteWrites.push({ via: o.name, name: prop, line, fn: enclosing(parents) });
      }
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && n.callee.object.type === 'Identifier' && n.callee.object.name === 'Object' && n.callee.property.name === 'defineProperty') {
        const a = n.arguments[0], b2 = n.arguments[1];
        if (a && a.type === 'Identifier' && GL.has(a.name) && b2 && b2.type === 'Literal') rec.writes.push({ name: String(b2.value), line, fn: enclosing(parents), op: 'defineProperty' });
      }
    }, []);
  }
  info[rel] = rec;
}
// grafo transitivo por frame
function reach(frame) {
  const seen = new Set(); const st = [frame];
  while (st.length) { const f = st.pop(); if (seen.has(f)) continue; seen.add(f); const r = info[f]; if (!r) continue; for (const i of r.imports) st.push(i); }
  return [...seen];
}
const frames = Object.keys(info).filter(f => f.endsWith('.html'));
const outLines = [];
const out = { frames: {} };
for (const fr of frames) {
  const files = reach(fr).filter(f => info[f] && !DATOS_FICHEROS.has(f));
  const byName = {};
  for (const f of files) for (const w of info[f].writes) (byName[w.name] ||= []).push({ file: f, line: w.line, fn: w.fn, op: w.op });
  out.frames[fr] = { files, byName };
  outLines.push(`\n##### ${fr}  (módulos alcanzables: ${files.filter(f => f.startsWith('js/')).join(', ') || '—'})`);
  const multi = Object.entries(byName).filter(([, v]) => v.length >= 2).sort();
  outLines.push(`  globals escritos en total: ${Object.keys(byName).length}; con >=2 escritores: ${multi.length}`);
  for (const [name, v] of multi) outLines.push(`  ${name}: ` + v.map(x => `${x.file}:${x.line}[${x.fn}]`).join('  |  '));
  const rem = [];
  for (const f of files) for (const w of info[f].remoteWrites) rem.push(`${f}:${w.line} ${w.via}.${w.name} [${w.fn}]`);
  if (rem.length) outLines.push(`  ESCRITURAS A GLOBALS DE OTRO FRAME (${rem.length}): ` + rem.join(' | '));
}
fs.writeFileSync(salida('globals.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(salida('globals.txt'), outLines.join('\n'));
console.log(outLines.join('\n'));
