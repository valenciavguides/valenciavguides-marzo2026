// globalThis.X / window.X leídos en los specs (dentro o fuera de page.evaluate) que ningún fichero de producción asigna y que el propio spec no asigna.
// Un spec que lee un global inexistente pasa en vacío (undefined) salvo que lo afirme. Residuo: lecturas computadas.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const GL = new Set(['globalThis', 'window', 'self']);
const prod = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') prod.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') prod.push('js/' + f);
const specs = fs.readdirSync(path.join(ROOT, 'tests/e2e')).filter(f => f.endsWith('.js')).map(f => 'tests/e2e/' + f);
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function parse(code) { for (const st of ['module', 'script']) { try { return acorn.parse(code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); } catch (e) {} } return null; }
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const gname = (m) => (m && m.type === 'MemberExpression' && !m.computed && m.object.type === 'Identifier' && GL.has(m.object.name) && m.property.type === 'Identifier') ? m.property.name : null;
const defs = new Set(); // asignadas en producción (cualquier frame), top-level function/var de scripts clásicos
for (const rel of prod) { const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); for (const b of blocksOf(rel, src)) { const ast = parse(b.code); if (!ast) continue; for (const n of ast.body) { if (n.type === 'FunctionDeclaration' && n.id) defs.add(n.id.name); if (n.type === 'VariableDeclaration') for (const d of n.declarations) if (d.id.type === 'Identifier') defs.add(d.id.name); } walk(ast, (n) => { if (n.type === 'AssignmentExpression') { const nm = gname(n.left); if (nm) defs.add(nm); } if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && n.callee.object.name === 'Object' && (n.callee.property.name === 'defineProperty') && n.arguments[0] && GL.has(n.arguments[0].name) && n.arguments[1] && n.arguments[1].type === 'Literal') defs.add(String(n.arguments[1].value)); }, []); } }
const BROWSER = new Set('window document console setTimeout clearTimeout setInterval clearInterval fetch location navigator localStorage sessionStorage history screen parent top frames performance crypto Event CustomEvent URL URLSearchParams Promise Map Set JSON Math Date Object Array String Number Boolean Error RegExp Symbol Intl Audio Image AudioContext webkitAudioContext requestAnimationFrame cancelAnimationFrame matchMedia getComputedStyle innerWidth innerHeight outerWidth outerHeight devicePixelRatio scrollTo scrollY scrollX alert confirm prompt open close focus blur postMessage addEventListener removeEventListener dispatchEvent atob btoa structuredClone queueMicrotask indexedDB caches Notification speechSynthesis opera MutationObserver IntersectionObserver ResizeObserver DeviceOrientationEvent DeviceMotionEvent XMLHttpRequest FormData Blob File FileReader TextEncoder TextDecoder AbortController DOMParser maplibregl L St process global require module exports __dirname'.split(' '));
const hallazgos = {}; let lecturas = 0;
for (const rel of specs) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); const ast = parse(src); if (!ast) continue;
  const propias = new Set();
  walk(ast, (n) => { if (n.type === 'AssignmentExpression') { const nm = gname(n.left); if (nm) propias.add(nm); } }, []);
  walk(ast, (n, ps) => {
    const nm = gname(n); if (!nm) return; const par = ps[ps.length - 1];
    if (par && par.type === 'AssignmentExpression' && par.left === n) return; // escritura
    lecturas++;
    if (defs.has(nm) || propias.has(nm) || BROWSER.has(nm)) return;
    (hallazgos[nm] ||= []).push(`${rel}:${n.loc.start.line}`);
  }, []);
}
const out = []; out.push(`lecturas globalThis.X en ${specs.length} specs: ${lecturas}; nombres sin definidor en producción ni en el propio spec: ${Object.keys(hallazgos).length}`);
for (const [n, s] of Object.entries(hallazgos).sort()) out.push(`  ${n.padEnd(34)} ${s.length} sitios: ${[...new Set(s)].slice(0, 4).join(' | ')}`);
fs.writeFileSync(salida('specs-globals-fantasma.txt'), out.join('\n')); console.log(out.join('\n').slice(0, 20000));
