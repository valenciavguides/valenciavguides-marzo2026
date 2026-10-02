// localStorage / sessionStorage / caches / indexedDB / cookie: claves, escritores, lectores. Con residuo (claves no literales).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js']);
function listFiles() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') out.push(f);
  for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f)) out.push('js/' + f);
  return out;
}
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = [];
  const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) {
    const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue;
    const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : '';
    if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue;
    const cs = m.index + m[0].indexOf('>') + 1;
    b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 });
  }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function fnName(ps) {
  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    if (p.type === 'FunctionDeclaration' && p.id) return p.id.name;
    if (p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression') {
      if (p.id && p.id.name) return p.id.name; const q = ps[i - 1];
      if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name;
      if (q && q.type === 'AssignmentExpression' && q.left.type === 'MemberExpression') return '→' + (q.left.property.name || '?');
      if (q && q.type === 'Property' && q.key) return '→' + String(q.key.name || q.key.value);
    }
  }
  return '<top>';
}
const STORES = new Set(['localStorage', 'sessionStorage']);
const rows = []; const residuo = [];
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null;
    for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) { residuo.push({ rel, why: 'NO PARSEA' }); continue; }
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off;
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed) {
        let o = n.callee.object; let store = null;
        // localStorage.getItem / globalThis.localStorage.getItem / window.localStorage...
        if (o.type === 'Identifier' && STORES.has(o.name)) store = o.name;
        else if (o.type === 'MemberExpression' && !o.computed && STORES.has(o.property.name)) store = o.property.name;
        if (store) {
          const meth = n.callee.property.name;
          const a0 = n.arguments[0];
          let key = null;
          if (a0 && a0.type === 'Literal') key = String(a0.value);
          else if (a0 && a0.type === 'TemplateLiteral' && a0.expressions.length === 0) key = a0.quasis[0].value.cooked;
          else if (a0) key = '<' + a0.type + (a0.type === 'Identifier' ? ':' + a0.name : '') + '>';
          rows.push({ rel, line, fn: fnName(ps), store, meth, key });
          if (key && key.startsWith('<')) residuo.push({ rel, line, why: 'clave no literal', key });
        }
      }
      // acceso por índice o propiedad: localStorage.vv_x / localStorage['x']
      if (n.type === 'MemberExpression') {
        const o = n.object;
        if ((o.type === 'Identifier' && STORES.has(o.name)) || (o.type === 'MemberExpression' && !o.computed && STORES.has(o.property.name))) {
          const par = ps[ps.length - 1];
          if (par && par.type === 'CallExpression' && par.callee === n) return; // es .getItem etc.
          const name = o.type === 'Identifier' ? o.name : o.property.name;
          const pn = n.computed ? (n.property.type === 'Literal' ? n.property.value : '<expr>') : n.property.name;
          if (!['getItem', 'setItem', 'removeItem', 'clear', 'key', 'length'].includes(pn)) residuo.push({ rel, line, why: 'acceso por propiedad', key: name + '.' + pn });
        }
      }
      if (n.type === 'MemberExpression' && !n.computed && ((n.object.type === 'Identifier' && n.object.name === 'document' && n.property.name === 'cookie'))) rows.push({ rel, line, fn: fnName(ps), store: 'cookie', meth: 'access', key: 'document.cookie' });
      if (n.type === 'MemberExpression' && !n.computed && (n.property.name === 'indexedDB' || n.property.name === 'caches')) rows.push({ rel, line, fn: fnName(ps), store: n.property.name, meth: 'access', key: '' });
      if (n.type === 'Identifier' && (n.name === 'indexedDB' || n.name === 'caches')) { const par = ps[ps.length - 1]; if (par && par.type !== 'MemberExpression') rows.push({ rel, line, fn: fnName(ps), store: n.name, meth: 'ident', key: '' }); }
    }, []);
  }
}
fs.writeFileSync(salida('storage.json'), JSON.stringify({ rows, residuo }, null, 1));
const byKey = {};
for (const r of rows) { const k = r.store + ':' + r.key; (byKey[k] ||= []).push(r); }
const out = [];
for (const [k, rs] of Object.entries(byKey).sort()) {
  const w = rs.filter(r => r.meth === 'setItem'), rd = rs.filter(r => r.meth === 'getItem'), rm = rs.filter(r => r.meth === 'removeItem'), ot = rs.filter(r => !['setItem', 'getItem', 'removeItem'].includes(r.meth));
  const f = (a) => a.map(r => `${r.rel}:${r.line}[${r.fn}]`).join(', ');
  out.push(`${k}\n   ESCRIBE(${w.length}): ${f(w)}\n   LEE(${rd.length}): ${f(rd)}\n   BORRA(${rm.length}): ${f(rm)}${ot.length ? '\n   OTROS: ' + f(ot) : ''}`);
}
fs.writeFileSync(salida('storage.txt'), out.join('\n'));
console.log(out.join('\n'));
console.log('\nRESIDUO:', residuo.length); for (const r of residuo) console.log('  ', JSON.stringify(r));
