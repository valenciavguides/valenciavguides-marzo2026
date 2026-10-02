// Cadenas `a || b || c` / `a ?? b ?? c` de ≥3 operandos donde al menos 2 son FUENTES de un dato (globalThis.X, estado.X, estadoPadre.X,
// localStorage/sessionStorage.getItem, URLSearchParams.get, parent.X): "el mismo hecho leído por varios caminos". Agrupa por hecho (nombre de la
// primera fuente normalizado) para ver cuántos sitios resuelven cada dato y con qué cadena. Residuo: cadenas con llamadas opacas.
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
const ROOTS = new Set(['globalThis', 'window', 'estado', 'estadoPadre', 'estadoMapa', 'estadoComponente', 'estadoScript1', 'est', 'parent']);
function flat(n, out) { if (n.type === 'LogicalExpression' && (n.operator === '||' || n.operator === '??')) { flat(n.left, out); flat(n.right, out); } else out.push(n); return out; }
function fuente(n) { // descripción de la fuente de un operando, o null si no es una fuente de dato
  let c = n; if (c.type === 'ChainExpression') c = c.expression;
  if (c.type === 'MemberExpression') { const segs = []; let cur = c; while (cur && (cur.type === 'MemberExpression' || cur.type === 'ChainExpression')) { if (cur.type === 'ChainExpression') { cur = cur.expression; continue; } segs.unshift(cur.computed ? '[]' : cur.property.name); cur = cur.object; } if (cur && cur.type === 'Identifier' && ROOTS.has(cur.name)) { const s = segs.slice(); if (cur.name === 'globalThis' || cur.name === 'window') return 'G.' + s.join('.'); return cur.name + '.' + s.join('.'); } return null; }
  if (c.type === 'CallExpression' && c.callee.type === 'MemberExpression' && !c.callee.computed) { const m = c.callee.property.name; const o = c.callee.object; if ((m === 'getItem') && o.type === 'Identifier' && /^(localStorage|sessionStorage|ls)$/.test(o.name)) return o.name + '.getItem(' + (c.arguments[0] && c.arguments[0].type === 'Literal' ? c.arguments[0].value : '?') + ')'; if (m === 'get' && o.type === 'Identifier' && /^(params|urlParams|searchParams|sp|qs)$/i.test(o.name)) return 'URL.get(' + (c.arguments[0] && c.arguments[0].type === 'Literal' ? c.arguments[0].value : '?') + ')'; }
  return null;
}
const hallazgos = []; let cadenas = 0;
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    walk(ast, (n, ps) => {
      if (n.type !== 'LogicalExpression' || (n.operator !== '||' && n.operator !== '??')) return;
      const par = ps[ps.length - 1]; if (par && par.type === 'LogicalExpression' && par.operator === n.operator) return; // solo la cadena maximal
      const ops = flat(n, []); if (ops.length < 3) return; cadenas++;
      const fs_ = ops.map(fuente).filter(Boolean); if (fs_.length < 2) return;
      hallazgos.push({ rel, line: n.loc.start.line + b.off, fuentes: fs_, n: ops.length });
    }, []);
  }
}
// hecho = último segmento significativo de la primera fuente
const hecho = (s) => { const t = s.replace(/\(.*\)/, '').split('.').filter(x => x && x !== '[]'); return (t[t.length - 1] || s).toLowerCase().replace(/^__vv_/, ''); };
const grupos = {}; for (const h of hallazgos) (grupos[hecho(h.fuentes[0])] ||= []).push(h);
const out = [];
out.push(`cadenas ||/?? de ≥3 operandos: ${cadenas}; con ≥2 fuentes de dato: ${hallazgos.length}`);
const orden = Object.entries(grupos).sort((a, b) => b[1].length - a[1].length);
for (const [k, v] of orden.slice(0, 40)) out.push(`${k.padEnd(26)} ${String(v.length).padStart(2)} sitios — ` + v.slice(0, 4).map(h => `${h.rel}:${h.line} {${h.fuentes.join(' | ')}}`).join('  '));
fs.writeFileSync(salida('cadenas-respaldo.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 20000));
