// Exports de js/*.js que ningún fichero de producción importa (ni por nombre, ni por namespace, ni por desestructuración de import dinámico).
// Separa: (a) los que solo usan los specs de tests/e2e, (b) los que además aparecen como clave de un objeto-API en globalThis y se piden por ahí,
// (c) los que no usa nadie. Imprime el residuo (imports que no se pudieron resolver, specs sin parsear).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const escope = require(path.join(ROOT, 'node_modules/eslint-scope'));
const GL = new Set(['globalThis', 'window', 'self']);
const prodFiles = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) prodFiles.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') prodFiles.push('js/' + f);
const testFiles = fs.readdirSync(path.join(ROOT, 'tests/e2e')).filter(f => f.endsWith('.js')).map(f => 'tests/e2e/' + f);
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
const strLit = (s) => (s && s.type === 'Literal' && typeof s.value === 'string') ? s.value : (s && s.type === 'TemplateLiteral' && s.expressions.length === 0 ? s.quasis[0].value.cooked : null);
const propName = (p) => p.type === 'Property' ? (p.key.type === 'Identifier' && !p.computed ? p.key.name : (p.key.type === 'Literal' ? String(p.key.value) : null)) : null;
function resolveSpec(from, spec) { if (/^https?:|^data:|^blob:/.test(spec)) return null; let p = spec.startsWith('/') ? spec.slice(1) : path.posix.join(path.posix.dirname(from), spec); return path.posix.normalize(p).replace(/\?.*$/, ''); }
const residuo = { specSinParsear: [], importNoResuelto: [] };
const AST = {};
for (const rel of [...prodFiles, ...testFiles]) { const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); AST[rel] = []; for (const b of blocksOf(rel, src)) { const ast = parse(b.code, b.mod); if (ast) AST[rel].push({ ast, off: b.off }); else if (rel.startsWith('tests/')) residuo.specSinParsear.push(rel); } }
// exports
const EXPORTS = {}; const reexportAll = {};
for (const rel of prodFiles.filter(f => !isHtml(f))) {
  const ex = new Map(); reexportAll[rel] = [];
  for (const { ast, off } of AST[rel]) for (const n of ast.body) {
    const ln = n.loc.start.line + off;
    if (n.type === 'ExportNamedDeclaration') {
      if (n.declaration) { const d = n.declaration; if (d.id) ex.set(d.id.name, ln); if (d.declarations) for (const x of d.declarations) { if (x.id.type === 'Identifier') ex.set(x.id.name, ln); else if (x.id.type === 'ObjectPattern') for (const p of x.id.properties) if (p.value && p.value.type === 'Identifier') ex.set(p.value.name, ln); } }
      for (const s of n.specifiers) ex.set(s.exported.name || s.exported.value, ln);
    }
    if (n.type === 'ExportDefaultDeclaration') ex.set('default', ln);
    if (n.type === 'ExportAllDeclaration') { if (n.exported) ex.set(n.exported.name || n.exported.value, ln); else reexportAll[rel].push(resolveSpec(rel, n.source.value)); }
  }
  EXPORTS[rel] = ex;
}
// referencias: mod -> name -> {prod:Set(sitios), test:Set(sitios)}
const REF = {}; const add = (mod, name, site, isTest) => { if (!EXPORTS[mod]) return; const r = ((REF[mod] ||= {})[name] ||= { prod: new Set(), test: new Set() }); r[isTest ? 'test' : 'prod'].add(site); };
const apiMember = {}; // nombre de miembro -> [sitios] pedidos como globalThis.X.nombre
for (const rel of [...prodFiles, ...testFiles]) {
  const isTest = rel.startsWith('tests/');
  for (const { ast, off } of AST[rel]) {
    const L = (n) => `${rel}:${n.loc.start.line + off}`;
    const awaitTarget = (node) => { if (node && node.type === 'AwaitExpression' && node.argument.type === 'ImportExpression') { const s = strLit(node.argument.source); if (s !== null) return resolveSpec(rel, s); } return null; };
    for (const n of ast.body) {
      if (n.type === 'ImportDeclaration') { const tgt = resolveSpec(rel, n.source.value); if (!tgt || !EXPORTS[tgt]) { if (tgt && !/^js\/vendor/.test(tgt)) residuo.importNoResuelto.push(`${rel}: ${n.source.value} -> ${tgt}`); continue; } for (const s of n.specifiers) { if (s.type === 'ImportSpecifier') add(tgt, s.imported.name || s.imported.value, L(n), isTest); else if (s.type === 'ImportDefaultSpecifier') add(tgt, 'default', L(n), isTest); } }
      if ((n.type === 'ExportNamedDeclaration' || n.type === 'ExportAllDeclaration') && n.source) { const tgt = resolveSpec(rel, n.source.value); if (tgt && EXPORTS[tgt]) { if (n.type === 'ExportNamedDeclaration') for (const s of n.specifiers) add(tgt, s.local.name || s.local.value, L(n), isTest); else for (const k of EXPORTS[tgt].keys()) add(tgt, k, L(n), isTest); } }
    }
    let sm = null; try { sm = escope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module', ignoreEval: true }); } catch (e) {}
    const memberAt = {}; walk(ast, (n) => { if (n.type === 'MemberExpression' && !n.computed && n.object.type === 'Identifier' && n.property.type === 'Identifier') memberAt[n.object.start] = { prop: n.property.name, node: n }; }, []);
    if (sm) for (const sc of sm.scopes) for (const v of sc.variables) {
      const d = v.defs[0]; if (!d) continue; let tgt = null;
      if (d.type === 'ImportBinding' && d.node.type === 'ImportNamespaceSpecifier') tgt = resolveSpec(rel, d.parent.source.value);
      else if (d.type === 'Variable' && d.node.init && d.node.id.type === 'Identifier') tgt = awaitTarget(d.node.init);
      if (!tgt || !EXPORTS[tgt]) continue;
      for (const r of v.references) { const m = memberAt[r.identifier.start]; if (m) add(tgt, m.prop, L(m.node), isTest); }
      // el namespace pasado entero a otra parte: no se puede seguir
    }
    walk(ast, (n) => {
      if (n.type === 'VariableDeclarator' && n.init) { const tgt = awaitTarget(n.init); if (tgt && EXPORTS[tgt] && n.id.type === 'ObjectPattern') for (const p of n.id.properties) { const k = p.type === 'Property' ? propName(p) : null; if (k) add(tgt, k, L(n), isTest); else add(tgt, '*', L(n), isTest); } }
      if (n.type === 'MemberExpression' && !n.computed) { const tgt = awaitTarget(n.object); if (tgt && EXPORTS[tgt]) add(tgt, n.property.name, L(n), isTest); }
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'then' && n.callee.object.type === 'ImportExpression') { const s = strLit(n.callee.object.source); const tgt = s !== null ? resolveSpec(rel, s) : null; if (tgt && EXPORTS[tgt]) { const cb = n.arguments[0]; if (cb && cb.params && cb.params[0]) { const p0 = cb.params[0]; if (p0.type === 'ObjectPattern') for (const p of p0.properties) { const k = p.type === 'Property' ? propName(p) : null; if (k) add(tgt, k, L(n), isTest); } else add(tgt, '*', L(n), isTest); } } }
      // miembros pedidos a un objeto-API global: globalThis.X.nombre
      if (n.type === 'MemberExpression' && !n.computed && n.property.type === 'Identifier' && n.object.type === 'MemberExpression' && !n.object.computed && n.object.object.type === 'Identifier' && GL.has(n.object.object.name)) (apiMember[n.property.name] ||= []).push(L(n) + (isTest ? ' [test]' : ''));
    }, []);
  }
}
const out = []; const P = (s) => out.push(s);
let tot = 0, sinUsoProd = 0; const sinNada = [], soloTest = [], viaApi = [];
for (const [mod, ex] of Object.entries(EXPORTS)) {
  const refs = REF[mod] || {}; const wild = refs['*'] && refs['*'].prod.size > 0;
  for (const [name, line] of ex) {
    tot++; const r = refs[name]; const prodN = r ? r.prod.size : 0; const testN = r ? r.test.size : 0;
    if (prodN > 0 || wild) continue; sinUsoProd++;
    const api = (apiMember[name] || []).filter(s => !s.endsWith('[test]'));
    if (api.length) viaApi.push(`${mod}:${line} ${name}  (pedido como globalThis.X.${name}: ${api.slice(0, 2).join(' ')})`);
    else if (testN > 0) soloTest.push(`${mod}:${line} ${name}  (solo specs: ${[...r.test].slice(0, 2).join(' ')})`);
    else sinNada.push(`${mod}:${line} ${name}`);
  }
}
P(`exports totales: ${tot}; sin ninguna referencia de producción por import: ${sinUsoProd}  (→ solo por objeto-API global: ${viaApi.length}; solo en specs: ${soloTest.length}; en ningún sitio: ${sinNada.length})`);
P(''); P('=== (c) SIN NINGUNA REFERENCIA (ni producción, ni specs, ni objeto-API) ==='); for (const s of sinNada) P('  ' + s);
P(''); P('=== (a) SOLO LOS USAN LOS SPECS ==='); for (const s of soloTest) P('  ' + s);
P(''); P('=== (b) SOLO POR EL OBJETO-API GLOBAL (globalThis.X.nombre) ==='); for (const s of viaApi) P('  ' + s);
P(''); P('=== RESIDUO ==='); for (const [k, v] of Object.entries(residuo)) { P(`-- ${k}: ${v.length}`); for (const x of [...new Set(v)].slice(0, 20)) P('   ' + x); }
fs.writeFileSync(salida('exports-sin-uso.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 30000));
