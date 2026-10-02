// addEventListener sobre globalThis/window/document: eventos registrados en ≥2 sitios dentro del cierre de un mismo frame.
// Para cada frame (cierre de ficheros por imports) agrupa por (objetivo, evento) y lista los sitios. Residuo: eventos de nombre no literal.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const escope = require(path.join(ROOT, 'node_modules/eslint-scope'));
const GL = new Set(['globalThis', 'window', 'self']);
const files = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) files.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js' && !/-aventuras\.js$|traducciones-ui|aventuras-ID-padre/.test(f)) files.push('js/' + f);
const isHtml = r => r.endsWith('.html');
function blocksOf(rel, src) {
  if (!isHtml(rel)) return [{ code: src, off: 0, mod: true }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1, mod: ty === 'module' }); }
  return b;
}
const o = { ecmaVersion: 'latest', locations: true, ranges: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowHashBang: true };
function parse(code, mod) { for (const st of [mod ? 'module' : 'script', mod ? 'script' : 'module']) { try { return acorn.parse(code, { ...o, sourceType: st }); } catch (e) {} } return null; }
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const strLit = (s) => (s && s.type === 'Literal' && typeof s.value === 'string') ? s.value : null;
function resolveSpec(from, spec) { if (/^https?:|^data:|^blob:/.test(spec)) return null; let p = spec.startsWith('/') ? spec.slice(1) : path.posix.join(path.posix.dirname(from), spec); return path.posix.normalize(p).replace(/\?.*$/, ''); }
const info = {}; const residuo = [];
for (const rel of files) {
  const I = info[rel] = { imports: new Set(), regs: [] };
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    const ast = parse(b.code, b.mod); if (!ast) continue;
    let sm = null; try { sm = escope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module', ignoreEval: true }); } catch (e) {}
    const glob = new Set(); if (sm) for (const r of sm.globalScope.through) glob.add(r.identifier.start);
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off;
      if ((n.type === 'ImportDeclaration' || n.type === 'ExportAllDeclaration' || (n.type === 'ExportNamedDeclaration' && n.source)) && n.source) { const r = resolveSpec(rel, n.source.value); if (r) I.imports.add(r); }
      if (n.type === 'ImportExpression') { const s = strLit(n.source); if (s !== null) { const r = resolveSpec(rel, s); if (r) I.imports.add(r); } }
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'addEventListener') {
        const ob = n.callee.object; let target = null;
        if (ob.type === 'Identifier' && (GL.has(ob.name) || ob.name === 'document') && glob.has(ob.start)) target = ob.name === 'document' ? 'document' : 'window';
        else if (ob.type === 'MemberExpression' && !ob.computed && ob.object.type === 'Identifier' && ob.object.name === 'document' && glob.has(ob.object.start) && ob.property.name === 'body') target = 'document.body';
        if (!target) return;
        const ev = strLit(n.arguments[0]); if (ev === null) { residuo.push(`${rel}:${line} evento no literal`); return; }
        const opt = n.arguments[2]; const once = !!(opt && opt.type === 'ObjectExpression' && opt.properties.some(p => p.key && p.key.name === 'once' && p.value && p.value.value === true));
        let fn = '<top>'; for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; if (p.type === 'FunctionDeclaration' && p.id) { fn = p.id.name; break; } if ((p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression')) { const q = ps[i - 1]; if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') { fn = q.id.name; break; } } }
        I.regs.push({ target, ev, line, once, fn });
      }
    }, []);
  }
}
function closure(root) { const seen = new Set([root]); const st = [root]; while (st.length) { const f = st.pop(); for (const g of (info[f] ? info[f].imports : [])) if (info[g] && !seen.has(g)) { seen.add(g); st.push(g); } } return seen; }
const out = []; const P = s => out.push(s);
for (const F of files.filter(isHtml)) {
  const groups = {}; for (const f of closure(F)) for (const r of info[f].regs) (groups[`${r.target}:${r.ev}`] ||= []).push({ f, ...r });
  const multi = Object.entries(groups).filter(([, v]) => v.length >= 2).sort();
  if (!multi.length) continue;
  P(`## ${F}`);
  for (const [k, v] of multi) P(`  ${k.padEnd(34)} ${v.length} sitios: ${v.map(r => `${r.f}:${r.line}${r.once ? '(once)' : ''}[${r.fn}]`).join(' | ')}`);
}
P(''); P('-- residuo: eventos no literales: ' + residuo.length); for (const x of residuo.slice(0, 20)) P('   ' + x);
fs.writeFileSync(salida('listeners-duplicados.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 30000));
