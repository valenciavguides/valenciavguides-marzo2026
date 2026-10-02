// Contrato de parámetros de URL: nombres leídos (URLSearchParams.get/has, location.search con regex) frente a nombres escritos en cadenas
// que construyen una URL (?x= / &x=). Lo leído y nunca escrito, y lo escrito y nunca leído. Residuo: lecturas con nombre no literal.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const files = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) files.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js' && !/-aventuras\.js$|traducciones-ui|aventuras-ID-padre/.test(f)) files.push('js/' + f);
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const leidos = {}; const escritos = {}; const residuo = [];
const add = (m, k, s) => (m[k] ||= []).push(s);
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  // escrituras en el HTML (href/src con ?x=)
  if (rel.endsWith('.html')) for (const m of src.matchAll(/(?:href|src)\s*=\s*["'][^"']*[?&]([A-Za-z_][\w]*)=/g)) add(escritos, m[1], `${rel}:${src.slice(0, m.index).split('\n').length} (atributo)`);
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    walk(ast, (n) => {
      const line = n.loc.start.line + b.off;
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && (n.callee.property.name === 'get' || n.callee.property.name === 'has' || n.callee.property.name === 'getAll')) {
        const o = n.callee.object; const nombre = o.type === 'Identifier' ? o.name : (o.type === 'MemberExpression' && o.property.name ? o.property.name : (o.type === 'NewExpression' && o.callee.name === 'URLSearchParams' ? 'new URLSearchParams' : ''));
        if (/params|search|query|^qs$|^sp$|URLSearchParams/i.test(nombre)) { const a = n.arguments[0]; if (a && a.type === 'Literal' && typeof a.value === 'string') add(leidos, a.value, `${rel}:${line}`); else residuo.push(`${rel}:${line} ${nombre}.${n.callee.property.name}(<no literal>)`); }
      }
      if (n.type === 'Literal' && typeof n.value === 'string') for (const m of n.value.matchAll(/[?&]([A-Za-z_][\w]*)=/g)) add(escritos, m[1], `${rel}:${line}`);
      if (n.type === 'TemplateLiteral') { const t = n.quasis.map(q => q.value.cooked).join('${}'); for (const m of t.matchAll(/[?&]([A-Za-z_][\w]*)=/g)) add(escritos, m[1], `${rel}:${line}`); }
      if (n.type === 'Property' && n.key && (n.key.name || n.key.value) && false) {}
    }, []);
  }
}
const out = []; const P = s => out.push(s);
const L = Object.keys(leidos).sort(), E = Object.keys(escritos).sort();
P(`parámetros leídos: ${L.length} [${L.join(', ')}]`); P(`parámetros escritos en cadenas de URL: ${E.length} [${E.join(', ')}]`);
P(''); P('=== LEÍDOS Y NUNCA ESCRITOS EN UNA CADENA DE URL ==='); for (const k of L.filter(k => !escritos[k])) P(`  ${k.padEnd(18)} leído en ${leidos[k].slice(0, 4).join(' | ')}`);
P(''); P('=== ESCRITOS Y NUNCA LEÍDOS ==='); for (const k of E.filter(k => !leidos[k])) P(`  ${k.padEnd(18)} escrito en ${escritos[k].slice(0, 4).join(' | ')}`);
P(''); P('-- residuo: lecturas con nombre no literal: ' + residuo.length); for (const x of residuo.slice(0, 15)) P('   ' + x);
fs.writeFileSync(salida('query-params.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 20000));
