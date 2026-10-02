// Exports de js/*.js cuyo NOMBRE (como token identificador, sin contar comentarios ni cadenas) no aparece en ningún otro fichero de producción.
// Sobre-aproxima el uso a propósito (un token igual en otro sitio cuenta como uso): lo que sale es ausencia casi segura.
// Se separa: "muerto del todo" (solo declaración + export en su módulo) y "uso solo interno" (se exporta sin que nadie de fuera lo pida).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const prodFiles = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) prodFiles.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') prodFiles.push('js/' + f);
const tests = fs.readdirSync(path.join(ROOT, 'tests/e2e')).filter(f => f.endsWith('.js')).map(f => 'tests/e2e/' + f);
const isHtml = r => r.endsWith('.html');
function blocksOf(rel, src) {
  if (!isHtml(rel)) return [src];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push(src.slice(cs, cs + m[2].length)); }
  return b;
}
function tokens(code) { const map = new Map(); for (const st of ['module', 'script']) { try { for (const t of acorn.tokenizer(code, { ecmaVersion: 'latest', sourceType: st, allowHashBang: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true })) { if (t.type.label === 'name') map.set(t.value, (map.get(t.value) || 0) + 1); } return map; } catch (e) { map.clear(); } } return null; }
const TOK = {}; const sinTokens = [];
for (const rel of [...prodFiles, ...tests]) { const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); const m = new Map(); for (const b of blocksOf(rel, src)) { const t = tokens(b); if (!t) { sinTokens.push(rel); continue; } for (const [k, v] of t) m.set(k, (m.get(k) || 0) + v); } TOK[rel] = m; }
// exports (misma extracción que exports-sin-uso)
const o = { ecmaVersion: 'latest', locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowHashBang: true };
const exportsOf = {}; const BASE = {}; const KEYS = {};
for (const rel of prodFiles.filter(f => !isHtml(f))) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); let ast = null; try { ast = acorn.parse(src, { ...o, sourceType: 'module' }); } catch (e) { continue; }
  const ex = new Map(); const base = {};
  for (const n of ast.body) {
    const ln = n.loc.start.line;
    if (n.type === 'ExportNamedDeclaration') { if (n.declaration) { const d = n.declaration; if (d.id) { ex.set(d.id.name, ln); base[d.id.name] = 1; } if (d.declarations) for (const x of d.declarations) if (x.id.type === 'Identifier') { ex.set(x.id.name, ln); base[x.id.name] = 1; } } for (const sp of n.specifiers) { const nm = sp.exported.name || sp.exported.value; ex.set(nm, ln); base[nm] = 2; } }
  }
  // claves de objeto (shorthand o `nombre:`) por nombre en todo el módulo
  const keys = {}; (function w(n){ if(!n||typeof n.type!=='string')return; if(n.type==='Property'&&!n.computed&&n.key&&n.key.type==='Identifier') keys[n.key.name]=(keys[n.key.name]||0)+1; for(const k of Object.keys(n)){ if(k==='type'||k==='loc'||k==='start'||k==='end')continue; const x=n[k]; if(Array.isArray(x)) x.forEach(c=>c&&typeof c.type==='string'&&w(c)); else if(x&&typeof x.type==='string') w(x);} })(ast);
  exportsOf[rel] = ex; BASE[rel] = base; KEYS[rel] = keys;
}
const muerto = [], interno = [], soloTest = []; let tot = 0;
for (const [mod, ex] of Object.entries(exportsOf)) for (const [name, line] of ex) {
  tot++; let ext = 0, extTest = 0; for (const f of prodFiles) if (f !== mod) ext += TOK[f].get(name) || 0; for (const f of tests) extTest += TOK[f].get(name) || 0;
  const inte = TOK[mod].get(name) || 0; const baseline = (BASE[mod][name] || 1); const pub = KEYS[mod][name] || 0; const usosReales = inte - baseline - pub;
  if (ext > 0) continue;
  const tag = `declaración${baseline === 2 ? ' + export' : ''}${pub ? ' + ' + pub + ' clave(s) de objeto publicado' : ''}${usosReales > 0 ? ' + ' + usosReales + ' uso(s) real(es)' : ''}`;
  if (usosReales > 0) interno.push(`${mod}:${line} ${name}  (${tag})`);
  else if (extTest > 0) soloTest.push(`${mod}:${line} ${name}  (${tag}; specs ${extTest})`);
  else muerto.push(`${mod}:${line} ${name}  (${tag})`);
}
const out = [];
out.push(`exports: ${tot}; sin mención en ningún otro fichero de producción: ${muerto.length + interno.length + soloTest.length} → muertos del todo ${muerto.length}; con uso interno (se exportan sin que nadie de fuera los pida) ${interno.length}; solo los nombran specs ${soloTest.length}`);
out.push(''); out.push('=== MUERTOS DEL TODO (el nombre solo aparece en su declaración y su export) ==='); out.push(...muerto.map(x => '  ' + x));
out.push(''); out.push('=== SOLO LOS NOMBRAN LOS SPECS ==='); out.push(...soloTest.map(x => '  ' + x));
out.push(''); out.push('=== USO SOLO INTERNO ==='); out.push(...interno.map(x => '  ' + x));
out.push(''); out.push('-- residuo: ficheros sin tokenizar: ' + sinTokens.length + (sinTokens.length ? ' ' + sinTokens.join(', ') : ''));
fs.writeFileSync(salida('exports-tokens.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 30000));
