// Globals que el código llama o comprueba con typeof (globalThis.X(...), globalThis.X?.(...), typeof globalThis.X === 'function')
// y que ningún fichero del repo asigna (globalThis.X =, window.X =, Object.defineProperty(globalThis,'X'), top-level function/var/const/let en script clásico o módulo).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js','js/indice-aventuras.js']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') o.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f)) o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const GL = new Set(['globalThis', 'window', 'self']);
const gname = (m) => { // MemberExpression globalThis.X  -> 'X'
  if (!m || m.type !== 'MemberExpression' || m.computed) return null;
  const o = m.object; if (o.type === 'Identifier' && GL.has(o.name)) return m.property.name;
  if (o.type === 'MemberExpression' && !o.computed && o.object.type === 'Identifier' && GL.has(o.object.name) && (o.property.name === 'parent' || o.property.name === 'top')) return null; // parent.X: otro frame
  return null;
};
// funciones/clases/propiedades del navegador y del lenguaje más comunes, para no ruido
const BROWSER = new Set('addEventListener removeEventListener dispatchEvent setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame fetch open close matchMedia getComputedStyle scrollTo scrollBy postMessage alert confirm prompt print focus blur atob btoa structuredClone queueMicrotask requestIdleCallback cancelIdleCallback createImageBitmap reportError getSelection Event CustomEvent URL URLSearchParams Audio Image Promise Map Set WeakMap JSON Math Date Object Array String Number Boolean Error TypeError RegExp Symbol Intl AudioContext webkitAudioContext IntersectionObserver ResizeObserver MutationObserver BroadcastChannel Worker XMLHttpRequest FormData Blob File FileReader AbortController TextEncoder TextDecoder performance localStorage sessionStorage navigator location history document screen parent top self frames crypto indexedDB caches console DeviceOrientationEvent DeviceMotionEvent maplibregl L St Notification'.split(' '));
const asignados = new Set(); const usados = {}; // nombre -> [{rel,line,kind}]
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    // top-level declaraciones (globales en script clásico; en módulo no, pero se consideran "definidas" para no dar falsos fantasmas)
    for (const n of ast.body) {
      if (n.type === 'FunctionDeclaration' && n.id) asignados.add(n.id.name);
      if (n.type === 'ClassDeclaration' && n.id) asignados.add(n.id.name);
      if (n.type === 'VariableDeclaration') for (const d of n.declarations) { if (d.id.type === 'Identifier') asignados.add(d.id.name); else if (d.id.type === 'ObjectPattern') for (const p of d.id.properties) if (p.value && p.value.type === 'Identifier') asignados.add(p.value.name); }
      if (n.type === 'ExportNamedDeclaration' && n.declaration) { const dd = n.declaration; if (dd.id) asignados.add(dd.id.name); if (dd.declarations) for (const d of dd.declarations) if (d.id.type === 'Identifier') asignados.add(d.id.name); }
    }
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off;
      if (n.type === 'AssignmentExpression') { const nm = gname(n.left); if (nm) asignados.add(nm); }
      if (n.type === 'CallExpression') {
        // Object.assign(globalThis, {...}) / Object.defineProperty(globalThis,'X',...)
        const c = n.callee;
        if (c.type === 'MemberExpression' && c.object.type === 'Identifier' && c.object.name === 'Object') {
          const a0 = n.arguments[0];
          if (a0 && a0.type === 'Identifier' && GL.has(a0.name)) {
            if (c.property.name === 'defineProperty' && n.arguments[1] && n.arguments[1].type === 'Literal') asignados.add(String(n.arguments[1].value));
            if (c.property.name === 'assign' && n.arguments[1] && n.arguments[1].type === 'ObjectExpression') for (const p of n.arguments[1].properties) if (p.type === 'Property' && !p.computed) asignados.add(String(p.key.name || p.key.value));
          }
        }
        const callee = c.type === 'ChainExpression' ? c.expression : c;
        const nm = gname(callee); if (nm) (usados[nm] ||= []).push({ rel, line, kind: 'llamada' });
      }
      if (n.type === 'ChainExpression' && n.expression.type === 'CallExpression') { const nm = gname(n.expression.callee); if (nm) (usados[nm] ||= []).push({ rel, line, kind: 'llamada?.' }); }
      if (n.type === 'UnaryExpression' && n.operator === 'typeof') { const nm = gname(n.argument); if (nm) (usados[nm] ||= []).push({ rel, line, kind: 'typeof' }); }
    }, []);
  }
}
const out = []; let n = 0;
for (const [nm, arr] of Object.entries(usados).sort()) {
  if (asignados.has(nm) || BROWSER.has(nm)) continue;
  n++; const files = [...new Set(arr.map(a => a.rel))];
  out.push(`${nm.padEnd(34)} usos=${arr.length} [${arr.slice(0, 4).map(a => a.rel + ':' + a.line + ' ' + a.kind).join(' | ')}]`);
}
fs.writeFileSync(salida('globals-fantasma.txt'), out.join('\n'));
console.log('nombres usados:', Object.keys(usados).length, ' asignados:', asignados.size, ' sin asignar y no-navegador:', n);
console.log(out.join('\n'));
