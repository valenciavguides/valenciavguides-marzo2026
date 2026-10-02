// Barrido de js/constants.js: (A) claves de cada export con/sin lector (por ruta), (B) valores string usados como literal crudo fuera de constants.js.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js','js/constants.js']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') o.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f)) o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function memberPath(n) { const segs = []; let cur = n; while (cur) { if (cur.type === 'MemberExpression') { segs.unshift(cur.computed ? (cur.property.type === 'Literal' ? String(cur.property.value) : '[]') : cur.property.name); cur = cur.object; } else if (cur.type === 'ChainExpression') cur = cur.expression; else if (cur.type === 'Identifier') { segs.unshift(cur.name); break; } else return null; } return segs; }
(async () => {
  const C = await import(pathToFileURL(path.join(ROOT, 'js/constants.js')).href);
  // Los nueve objetos que exportaba el commit base de la ronda (ffe9bfc); se miden los que existan en el árbol que se analiza.
  const EXPORTS = ['LOG_LEVELS', 'MODOS', 'TTL_LIMPIEZA', 'TIPOS_MENSAJE', 'ERRORES', 'ESTADOS', 'CODIGOS_ERROR', 'DESTINOS', 'CSS_CLASES']
    .filter((e) => C[e] && typeof C[e] === 'object');
  // hojas por export
  const leaves = []; // {exp, path:[...], val}
  for (const e of EXPORTS) { (function rec(o, p) { for (const [k, v] of Object.entries(o)) { const np = p.concat(k); if (v && typeof v === 'object' && !Array.isArray(v)) rec(v, np); else leaves.push({ exp: e, path: np, val: v }); } })(C[e], []); }
  // lecturas por ruta: cualquier MemberExpression que empiece por un alias del export (X, X_S1, X_S2, X_S4, globalThis.X)
  const reads = {}; // 'EXP.a.b' -> Set(files)
  const stringLits = {}; // value -> [{rel,line}]
  const valSet = new Set(leaves.filter(l => typeof l.val === 'string' && l.val.length >= 4).map(l => l.val));
  const MODVALS = new Set(['casa', 'aventura']);
  const modLits = {}; // rel -> count
  for (const rel of listFiles()) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
    for (const b of blocksOf(rel, src)) {
      let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
      if (!ast) continue;
      walk(ast, (n, ps) => {
        const line = n.loc.start.line + b.off;
        if (n.type === 'MemberExpression') {
          const par = ps[ps.length - 1]; if (par && par.type === 'MemberExpression' && par.object === n) return; // solo el más largo
          const p = memberPath(n); if (!p) return;
          let i = 0; if (p[0] === 'globalThis' || p[0] === 'window') i = 1;
          const base = (p[i] || '').replace(/_(S1|S2|S3|S4|IFRAME|SAFE)$/, '');
          if (EXPORTS.includes(base)) { const key = base + '.' + p.slice(i + 1).join('.'); (reads[key] ||= new Set()).add(rel); }
        }
        if (n.type === 'Literal' && typeof n.value === 'string') {
          if (valSet.has(n.value)) (stringLits[n.value] ||= []).push({ rel, line });
          if (MODVALS.has(n.value)) modLits[rel] = (modLits[rel] || 0) + 1;
        }
      }, []);
    }
  }
  // (A) claves sin lector: una hoja tiene lector si alguna lectura empieza por su ruta completa o es prefijo de ella (lectura del subobjeto)
  const out = [];
  out.push('=== (A) hojas de constants.js sin lector por ruta (excluye valores usados solo como objeto entero) ===');
  const keysRead = Object.keys(reads);
  const sinLector = {}; const total = {};
  for (const l of leaves) {
    const full = l.exp + '.' + l.path.join('.');
    total[l.exp] = (total[l.exp] || 0) + 1;
    const leido = keysRead.some(k => k === full || full.startsWith(k + '.') || k.startsWith(full + '.'));
    if (!leido) (sinLector[l.exp] ||= []).push(l.path.join('.'));
  }
  for (const e of EXPORTS) out.push(`${e}: ${total[e] || 0} hojas, sin lector: ${(sinLector[e] || []).length}` + ((sinLector[e] || []).length && (sinLector[e] || []).length <= 40 ? '  → ' + sinLector[e].join(', ') : ''));
  // lecturas del objeto entero (p.ej. Object.values(MODOS), spreads) no se ven: listar exports usados "enteros"
  out.push('\n=== (B) literales crudos con el mismo valor que una constante de TIPOS_MENSAJE/otras (longitud>=4), fuera de constants.js ===');
  const byFile = {}; for (const [v, arr] of Object.entries(stringLits)) for (const a of arr) (byFile[a.rel] ||= []).push(`${a.line}:${JSON.stringify(v)}`);
  for (const [f, arr] of Object.entries(byFile).sort()) out.push(f.padEnd(34) + arr.length + '  ' + arr.slice(0, 12).join(' '));
  out.push('\n=== (C) literales crudos "casa"/"aventura" por fichero ===');
  for (const [f, n] of Object.entries(modLits).sort()) out.push(f.padEnd(34) + n);
  fs.writeFileSync(salida('barrido-constants.txt'), out.join('\n'));
  console.log(out.join('\n'));
})();
