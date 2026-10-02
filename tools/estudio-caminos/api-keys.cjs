// Objetos-API publicados en globalThis (globalThis.X = {...} / = identificador resoluble) y miembros que el código les pide:
// un `globalThis.X?.metodo?.()` o `globalThis.X.metodo(...)` cuyo `metodo` no es clave del objeto es un no-op silencioso (o un TypeError).
// Además: miembros de `import * as ns` / `await import()` destructurados o con `.X` que el módulo no exporta.
// Imprime el residuo: objetos cuyas claves no se pudieron derivar, usos con clave computada, patrones de import sin analizar.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const escope = require(path.join(ROOT, 'node_modules/eslint-scope'));
const GL = new Set(['globalThis', 'window', 'self']);
const files = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) files.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') files.push('js/' + f);
const isHtml = r => r.endsWith('.html');
function blocksOf(rel, src) {
  if (!isHtml(rel)) return [{ code: src, off: 0, mod: true }];
  const b = [];
  const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1, mod: ty === 'module' }); }
  return b;
}
const o = { ecmaVersion: 'latest', locations: true, ranges: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowHashBang: true };
function parse(code, mod) { for (const st of [mod ? 'module' : 'script', mod ? 'script' : 'module']) { try { return acorn.parse(code, { ...o, sourceType: st }); } catch (e) {} } return null; }
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const strLit = (s) => (s && s.type === 'Literal' && typeof s.value === 'string') ? s.value : (s && s.type === 'TemplateLiteral' && s.expressions.length === 0 ? s.quasis[0].value.cooked : null);
const propName = (p) => p.type === 'Property' ? (p.key.type === 'Identifier' && !p.computed ? p.key.name : (p.key.type === 'Literal' ? String(p.key.value) : null)) : null;
function resolveSpec(from, spec) { if (/^https?:|^data:|^blob:/.test(spec)) return null; let p = spec.startsWith('/') ? spec.slice(1) : path.posix.join(path.posix.dirname(from), spec); p = path.posix.normalize(p).replace(/\?.*$/, ''); return p; }

// ---------- parseo de todo ----------
const AST = {}; // rel -> [{ast, off}]
for (const rel of files) { const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); AST[rel] = []; for (const b of blocksOf(rel, src)) { const ast = parse(b.code, b.mod); if (ast) AST[rel].push({ ast, off: b.off, code: b.code }); } }

// ---------- exports de cada módulo js ----------
const EXPORTS = {}; // rel -> Set(nombres) (incluye 'default')
const reexportAll = {}; // rel -> [rels]
for (const rel of files.filter(f => !isHtml(f))) {
  const ex = new Set(); reexportAll[rel] = [];
  for (const { ast } of AST[rel]) {
    for (const n of ast.body) {
      if (n.type === 'ExportNamedDeclaration') {
        if (n.declaration) { const d = n.declaration; if (d.id) ex.add(d.id.name); if (d.declarations) for (const x of d.declarations) { if (x.id.type === 'Identifier') ex.add(x.id.name); else if (x.id.type === 'ObjectPattern') for (const p of x.id.properties) { if (p.value && p.value.type === 'Identifier') ex.add(p.value.name); } } }
        for (const s of n.specifiers) ex.add(s.exported.name || s.exported.value);
        if (n.source && !n.specifiers.length) { /* export * as handled below */ }
      }
      if (n.type === 'ExportDefaultDeclaration') ex.add('default');
      if (n.type === 'ExportAllDeclaration') { if (n.exported) ex.add(n.exported.name || n.exported.value); else reexportAll[rel].push(resolveSpec(rel, n.source.value)); }
    }
  }
  EXPORTS[rel] = ex;
}
function allExports(rel, seen = new Set()) { if (seen.has(rel) || !EXPORTS[rel]) return new Set(); seen.add(rel); const s = new Set(EXPORTS[rel]); for (const r of reexportAll[rel] || []) for (const x of allExports(r, seen)) s.add(x); return s; }
// los ficheros de datos y los CommonJS con `module.exports` tambien se pueden importar: se tratan como "export dinamico" si no tienen export ES
const hasEsExport = (rel) => EXPORTS[rel] && EXPORTS[rel].size > 0;

const out = []; const P = (s) => out.push(s);
const residuo = { importSinAnalizar: [], apiClaveComputada: [], apiSinClaves: [] };
const hallImports = []; const stats = { staticNamed: 0, staticNs: 0, dynDestruct: 0, dynNsMember: 0, dynThen: 0, dynOther: 0 };

// ---------- imports: nombres que el modulo no exporta ----------
for (const rel of files) {
  for (const { ast, off } of AST[rel]) {
    const nsBind = {}; // nombre local -> modulo
    const line = (n) => n.loc.start.line + off;
    // estaticos
    for (const n of ast.body) {
      if (n.type !== 'ImportDeclaration') continue; const tgt = resolveSpec(rel, n.source.value); if (!tgt || !EXPORTS[tgt]) continue; const ex = allExports(tgt);
      for (const s of n.specifiers) {
        if (s.type === 'ImportSpecifier') { stats.staticNamed++; const nm = s.imported.name || s.imported.value; if (!ex.has(nm)) hallImports.push(`${rel}:${line(n)} import { ${nm} } from '${n.source.value}' — ${tgt} no lo exporta`); }
        else if (s.type === 'ImportDefaultSpecifier') { stats.staticNamed++; if (!ex.has('default')) hallImports.push(`${rel}:${line(n)} import ${s.local.name} (default) de '${n.source.value}' — ${tgt} no tiene default`); }
        else if (s.type === 'ImportNamespaceSpecifier') { stats.staticNs++; nsBind[s.local.name] = tgt; }
      }
    }
    // dinamicos
    const awaitImportTarget = (node) => { // AwaitExpression(ImportExpression literal) -> modulo
      if (node && node.type === 'AwaitExpression' && node.argument.type === 'ImportExpression') { const s = strLit(node.argument.source); if (s !== null) return resolveSpec(rel, s); } return null; };
    walk(ast, (n, ps) => {
      if (n.type === 'VariableDeclarator' && n.init) {
        const tgt = awaitImportTarget(n.init);
        if (tgt && EXPORTS[tgt]) {
          const ex = allExports(tgt);
          if (n.id.type === 'ObjectPattern') { for (const p of n.id.properties) { stats.dynDestruct++; const nm = p.type === 'Property' ? propName(p) : null; if (nm === null) continue; if (!ex.has(nm)) hallImports.push(`${rel}:${line(n)} const { ${nm} } = await import('…${path.basename(tgt)}') — ${tgt} no lo exporta`); } }
          else if (n.id.type === 'Identifier') nsBind[n.id.name] = tgt;
        } else if (tgt) { residuo.importSinAnalizar.push(`${rel}:${line(n)} await import('${tgt}') — módulo sin exports ES (datos/CommonJS)`); }
      }
      if (n.type === 'MemberExpression' && !n.computed) {
        const tgt = awaitImportTarget(n.object); // (await import('x')).Y
        if (tgt && EXPORTS[tgt]) { stats.dynNsMember++; const ex = allExports(tgt); if (!ex.has(n.property.name)) hallImports.push(`${rel}:${line(n)} (await import('…${path.basename(tgt)}')).${n.property.name} — no exportado`); }
      }
      // import('x').then(m => m.Y) / .then(({a}) => ...)
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'then' && n.callee.object.type === 'ImportExpression') {
        const s = strLit(n.callee.object.source); const tgt = s !== null ? resolveSpec(rel, s) : null; stats.dynThen++;
        if (tgt && EXPORTS[tgt]) { const ex = allExports(tgt); const cb = n.arguments[0];
          if (cb && (cb.type === 'ArrowFunctionExpression' || cb.type === 'FunctionExpression') && cb.params[0]) {
            const p0 = cb.params[0];
            if (p0.type === 'ObjectPattern') for (const p of p0.properties) { const nm = p.type === 'Property' ? propName(p) : null; if (nm && !ex.has(nm)) hallImports.push(`${rel}:${line(n)} import(…).then(({ ${nm} })) — ${tgt} no lo exporta`); }
            else if (p0.type === 'Identifier') walk(cb.body, (m) => { if (m.type === 'MemberExpression' && !m.computed && m.object.type === 'Identifier' && m.object.name === p0.name && !ex.has(m.property.name)) hallImports.push(`${rel}:${m.loc.start.line + off} import(…).then(${p0.name} => ${p0.name}.${m.property.name}) — no exportado`); }, []);
          } }
      }
    }, []);
    // miembros de namespaces, resueltos por ÁMBITO (un mismo nombre local puede ser otro módulo en otra función)
    {
      let sm = null; try { sm = escope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module', ignoreEval: true }); } catch (e) { residuo.importSinAnalizar.push(rel + ': eslint-scope falla (' + e.message + ')'); }
      if (sm) {
        const memberAt = {}; // start del identificador objeto -> {prop, line}
        walk(ast, (n) => { if (n.type === 'MemberExpression' && !n.computed && n.object.type === 'Identifier' && n.property.type === 'Identifier') memberAt[n.object.start] = { prop: n.property.name, line: n.loc.start.line + off }; }, []);
        for (const sc of sm.scopes) for (const v of sc.variables) {
          const d = v.defs[0]; if (!d) continue; let tgt = null;
          if (d.type === 'ImportBinding' && d.node.type === 'ImportNamespaceSpecifier') tgt = resolveSpec(rel, d.parent.source.value);
          else if (d.type === 'Variable' && d.node.init) tgt = awaitImportTarget(d.node.init);
          if (!tgt || !EXPORTS[tgt] || d.node.id && d.node.id.type === 'ObjectPattern') continue;
          const ex = allExports(tgt);
          for (const r of v.references) { const m = memberAt[r.identifier.start]; if (m && !ex.has(m.prop)) hallImports.push(rel + ':' + m.line + ' ' + v.name + '.' + m.prop + ' (de ' + tgt + ') — no exportado'); }
        }
      }
    }
  }
}
P('=== IMPORTS: nombres pedidos que el módulo no exporta ===');
for (const h of [...new Set(hallImports)]) P('  ' + h);
if (!hallImports.length) P('  (ninguno)');
P(`  analizados: ${JSON.stringify(stats)}`);
P('');

// ---------- objetos-API de globalThis ----------
const API = {}; // nombre -> {keys:Set, fuente:[...]}
for (const rel of files) {
  for (const { ast, off } of AST[rel]) {
    const topObj = {}; // const NAME = {…} a nivel superior
    walk(ast, (n) => { if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init && n.init.type === 'ObjectExpression') topObj[n.id.name] = n.init; }, []);
    walk(ast, (n) => {
      if (n.type === 'AssignmentExpression' && n.operator === '=' && n.left.type === 'MemberExpression' && !n.left.computed && n.left.object.type === 'Identifier' && GL.has(n.left.object.name)) {
        const name = n.left.property.name; let obj = null, how = '';
        if (n.right.type === 'ObjectExpression') { obj = n.right; how = 'literal'; }
        else if (n.right.type === 'Identifier' && topObj[n.right.name]) { obj = topObj[n.right.name]; how = 'const ' + n.right.name; }
        if (obj) { const keys = new Set(); let hasSpread = false; for (const p of obj.properties) { if (p.type === 'SpreadElement') { hasSpread = true; continue; } const k = propName(p); if (k) keys.add(k); else if (p.type === 'Property' && p.computed) hasSpread = true; } (API[name] ||= { keys: new Set(), fuente: [], spread: false }); for (const k of keys) API[name].keys.add(k); API[name].fuente.push(`${rel}:${n.loc.start.line + off} ${how}`); if (hasSpread) API[name].spread = true; }
      }
    }, []);
  }
}
// miembros pedidos por globalThis.X.Y / globalThis.X?.Y
const acc = {}; // X -> Map(Y -> [sitios])
for (const rel of files) {
  for (const { ast, off } of AST[rel]) {
    walk(ast, (n, ps) => {
      if (n.type === 'MemberExpression' && n.object.type === 'MemberExpression' && !n.object.computed && n.object.object.type === 'Identifier' && GL.has(n.object.object.name) && n.object.property.type === 'Identifier') {
        const X = n.object.property.name; if (!API[X]) return;
        if (n.computed) { residuo.apiClaveComputada.push(`${rel}:${n.loc.start.line + off} globalThis.${X}[…]`); return; }
        const par = ps[ps.length - 1]; let kind = 'read'; if (par && par.type === 'AssignmentExpression' && par.left === n) kind = 'write'; else if (par && par.type === 'CallExpression' && par.callee === n) kind = 'call'; else if (par && par.type === 'ChainExpression') kind = 'chain';
        if (kind === 'write') return;
        ((acc[X] ||= new Map()).get(n.property.name) || (acc[X].set(n.property.name, []), acc[X].get(n.property.name))).push(`${rel}:${n.loc.start.line + off} ${kind}`);
      }
    }, []);
  }
}
// desestructuración de un objeto-API: const { a, b } = globalThis.mensajeria
for (const rel of files) for (const { ast, off } of AST[rel]) walk(ast, (n) => {
  if (n.type === 'VariableDeclarator' && n.id.type === 'ObjectPattern' && n.init) {
    let init = n.init; if (init.type === 'AwaitExpression') init = init.argument;
    if (init.type === 'MemberExpression' && !init.computed && init.object.type === 'Identifier' && GL.has(init.object.name) && init.property.type === 'Identifier' && API[init.property.name]) {
      const X = init.property.name; for (const p of n.id.properties) { const k = p.type === 'Property' ? propName(p) : null; if (k) ((acc[X] ||= new Map()).get(k) || (acc[X].set(k, []), acc[X].get(k))).push(rel + ':' + (n.loc.start.line + off) + ' desestructuración'); }
    }
  }
}, []);
P('=== OBJETOS-API de globalThis con claves derivables ===');
for (const [X, a] of Object.entries(API).sort()) P(`  ${X}: ${a.keys.size} claves${a.spread ? ' (+spread/computadas: lista incompleta)' : ''}; fuente: ${a.fuente.join(' | ')}`);
P('');
P('=== (API) miembros pedidos por globalThis.X.Y que no son clave de X ===');
for (const [X, m] of Object.entries(acc).sort()) {
  const ks = API[X].keys; const miss = [...m.entries()].filter(([y]) => !ks.has(y));
  for (const [y, sites] of miss) P(`  globalThis.${X}.${y}${API[X].spread ? '  [lista incompleta]' : ''}  sitios=${sites.length}: ${sites.slice(0, 4).join(' | ')}`);
}
P('');
P('=== RESIDUO ===');
for (const [k, v] of Object.entries(residuo)) { P(`-- ${k}: ${v.length}`); for (const x of v.slice(0, 40)) P('   ' + x); }
fs.writeFileSync(salida('api-keys.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 40000));
