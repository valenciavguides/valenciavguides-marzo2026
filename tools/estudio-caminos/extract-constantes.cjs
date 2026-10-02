// Constantes: (1) declaraciones con nombre (const NOMBRE = <literal|expr numérica>), propiedades de objeto con valor numérico,
// y (2) literales numéricos usados en comparaciones/umbrales/plazos. Agrupa por valor y por nombre entre ficheros.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') o.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f)) o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function fnName(ps) { for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; if (p.type === 'FunctionDeclaration' && p.id) return p.id.name; if (p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression') { if (p.id && p.id.name) return p.id.name; const q = ps[i - 1]; if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name; if (q && q.type === 'AssignmentExpression' && q.left.type === 'MemberExpression') return '→' + (q.left.property.name || '?'); if (q && q.type === 'Property' && q.key) return '→' + String(q.key.name || q.key.value); } } return '<top>'; }
// evalúa expresiones numéricas simples (a*b*c, a+b, -x, paréntesis)
function evalNum(n) {
  if (!n) return null;
  if (n.type === 'Literal' && typeof n.value === 'number') return n.value;
  if (n.type === 'UnaryExpression' && n.operator === '-') { const v = evalNum(n.argument); return v == null ? null : -v; }
  if (n.type === 'BinaryExpression') { const a = evalNum(n.left), b = evalNum(n.right); if (a == null || b == null) return null; switch (n.operator) { case '*': return a * b; case '+': return a + b; case '-': return a - b; case '/': return a / b; } }
  return null;
}
const decl = []; // {rel,line,name,val,ctx}
const cmp = []; // comparaciones: {rel,line,fn,left,op,val}
const timers = []; // plazos en setTimeout/setInterval/withTimeout/retry
function txt(n) { if (!n) return '?'; if (n.type === 'Identifier') return n.name; if (n.type === 'MemberExpression') return txt(n.object) + (n.computed ? '[…]' : '.' + n.property.name); if (n.type === 'CallExpression') return txt(n.callee) + '()'; if (n.type === 'ChainExpression') return txt(n.expression); if (n.type === 'Literal') return JSON.stringify(n.value); return n.type; }
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off;
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init) { const v = evalNum(n.init); if (v != null) decl.push({ rel, line, name: n.id.name, val: v, ctx: fnName(ps) }); }
      if (n.type === 'Property' && !n.computed && n.value) { const v = evalNum(n.value); if (v != null) decl.push({ rel, line, name: String(n.key.name || n.key.value), val: v, ctx: 'prop' }); }
      if (n.type === 'AssignmentExpression' && n.operator === '=') { const v = evalNum(n.right); if (v != null) decl.push({ rel, line, name: txt(n.left), val: v, ctx: fnName(ps) + ':assign' }); }
      if (n.type === 'BinaryExpression' && ['<', '<=', '>', '>=', '===', '!==', '==', '!='].includes(n.operator)) {
        const rv = evalNum(n.right), lv = evalNum(n.left);
        if (rv != null && lv == null) cmp.push({ rel, line, fn: fnName(ps), left: txt(n.left), op: n.operator, val: rv });
        else if (lv != null && rv == null) cmp.push({ rel, line, fn: fnName(ps), left: txt(n.right), op: n.operator, val: lv });
      }
      if (n.type === 'CallExpression') {
        const c = txt(n.callee);
        if (/(^|\.)(setTimeout|setInterval)$/.test(c) && n.arguments[1]) { const v = evalNum(n.arguments[1]); if (v != null) timers.push({ rel, line, fn: fnName(ps), api: c, val: v }); else timers.push({ rel, line, fn: fnName(ps), api: c, val: 'expr:' + txt(n.arguments[1]) }); }
        if (/withTimeout$/.test(c) && n.arguments[1]) { const v = evalNum(n.arguments[1]); timers.push({ rel, line, fn: fnName(ps), api: c, val: v != null ? v : 'expr:' + txt(n.arguments[1]) }); }
      }
    }, []);
  }
}
fs.writeFileSync(salida('constantes.json'), JSON.stringify({ decl, cmp, timers }));
console.log('decl', decl.length, 'cmp', cmp.length, 'timers', timers.length);
