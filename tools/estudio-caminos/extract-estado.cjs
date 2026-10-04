// Escritores de campos de estado compartido: estado.* / estadoPadre.* / estadoScript1.* (padre) y estadoMapa.* (funciones-mapa),
// más variables de módulo/estadoComponente en los hijos. Agrupa por ruta de campo y lista funciones escritoras.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const ROOTS = new Set(['estado', 'estadoPadre', 'estadoScript1', 'est', 'estadoMapa', 'estadoComponente', 'estadoRetos', 'estadoMenu', 'estadoTemporizador', 'estadoAudio', 'estadoGPS']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) o.push(f); for (const f of ['funciones-mapa.js', 'app.js', 'state-manager.js', 'mensajeria.js', 'controladores-padre.js']) o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function fnName(ps) { for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; if (p.type === 'FunctionDeclaration' && p.id) return p.id.name; if (p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression') { if (p.id && p.id.name) return p.id.name; const q = ps[i - 1]; if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name; if (q && q.type === 'AssignmentExpression' && q.left.type === 'MemberExpression') return '→' + (q.left.property.name || '?'); if (q && q.type === 'Property' && q.key) return '→' + String(q.key.name || q.key.value); } } return '<top>'; }
// ruta de miembro desde la raíz: estado.gps.posicionUsuario → ['estado','gps','posicionUsuario']; devuelve null si no empieza por raíz conocida
function pathOf(n) {
  const segs = []; let cur = n;
  while (cur) {
    if (cur.type === 'MemberExpression') { segs.unshift(cur.computed ? '[]' : cur.property.name); cur = cur.object; }
    else if (cur.type === 'ChainExpression') cur = cur.expression;
    else if (cur.type === 'Identifier') { segs.unshift(cur.name); break; }
    else if (cur.type === 'CallExpression') return null;
    else return null;
  }
  // globalThis.estadoPadre.x
  if (segs[0] === 'globalThis' || segs[0] === 'window') segs.shift();
  return segs;
}
const writes = [];
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off;
      const add = (target, kind) => { const p = pathOf(target); if (p && p.length >= 2 && ROOTS.has(p[0])) writes.push({ rel, line, fn: fnName(ps), path: p.slice(0, 4).join('.'), full: p.join('.'), kind }); };
      if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression') add(n.left, n.operator);
      if (n.type === 'UpdateExpression' && n.argument.type === 'MemberExpression') add(n.argument, n.operator);
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && ['set', 'push', 'add', 'delete', 'clear', 'splice', 'pop', 'shift', 'unshift', 'assign'].includes(n.callee.property.name)) {
        if (n.callee.object.type === 'Identifier' && n.callee.object.name === 'Object' && n.callee.property.name === 'assign') { const a0 = n.arguments[0]; if (a0) add(a0, 'Object.assign'); }
        else add(n.callee.object, '.' + n.callee.property.name + '()');
      }
    }, []);
  }
}
fs.writeFileSync(salida('estado-writes.json'), JSON.stringify(writes));
// agrupar por (raíz normalizada + ruta); normalizar raíz alias estado/estadoPadre/estadoScript1/est
const norm = p => p.replace(/^(estadoPadre|estadoScript1|est)\./, 'estado.');
const groups = {};
for (const w of writes) { const k = norm(w.path); (groups[k] ||= []).push(w); }
const lines = [];
for (const [k, ws] of Object.entries(groups).sort()) {
  const fns = new Map(); for (const w of ws) { const key = w.rel + '::' + w.fn; fns.set(key, (fns.get(key) || []).concat(w.line)); }
  lines.push(`${k}  [${fns.size} función(es) escritora(s), ${ws.length} sitios]` + '\n     ' + [...fns.entries()].map(([f, ls]) => `${f}(${ls.join(',')})`).join('  '));
}
fs.writeFileSync(salida('estado-writes.txt'), lines.join('\n'));
const multi = Object.entries(groups).filter(([k, ws]) => new Set(ws.map(w => w.rel + '::' + w.fn)).size >= 3);
console.log('rutas de campo:', Object.keys(groups).length, ' con >=3 funciones escritoras:', multi.length);
