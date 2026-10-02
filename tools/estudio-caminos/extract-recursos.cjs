// Cat.2 — pares arranque/parada de recursos de larga duración, con parser real y control de residuo.
// Recursos: setInterval/setTimeout con id guardado, addEventListener sobre targets globales, observers, rAF, audio/video, mapa (on/off, Marker.remove).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') o.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f)) o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function fnName(ps) { for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; if (p.type === 'FunctionDeclaration' && p.id) return p.id.name; if (p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression') { if (p.id && p.id.name) return p.id.name; const q = ps[i - 1]; if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name; if (q && q.type === 'AssignmentExpression' && q.left.type === 'MemberExpression') return '→' + (q.left.property.name || '?'); if (q && q.type === 'Property' && q.key) return '→' + String(q.key.name || q.key.value); } } return '<top>'; }
function txt(n) { if (!n) return '?'; if (n.type === 'Identifier') return n.name; if (n.type === 'ThisExpression') return 'this'; if (n.type === 'MemberExpression') return txt(n.object) + (n.computed ? '[…]' : '.' + n.property.name); if (n.type === 'CallExpression') return txt(n.callee) + '()'; if (n.type === 'ChainExpression') return txt(n.expression); if (n.type === 'Literal') return JSON.stringify(n.value); if (n.type === 'ArrowFunctionExpression' || n.type === 'FunctionExpression') return 'ƒ'; return n.type; }
const items = []; // {rel,line,fn,kind,target,ev,idvar,handler}
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) { console.log('NO PARSEA', rel); continue; }
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off; const fn = fnName(ps);
      if (n.type === 'CallExpression') {
        const c = txt(n.callee);
        const par = ps[ps.length - 1];
        // timers
        if (/(^|\.)setInterval$/.test(c)) { let id = null; if (par && par.type === 'AssignmentExpression') id = txt(par.left); else if (par && par.type === 'VariableDeclarator') id = txt(par.id); items.push({ rel, line, fn, kind: 'setInterval', idvar: id }); }
        if (/(^|\.)setTimeout$/.test(c)) { let id = null; if (par && par.type === 'AssignmentExpression') id = txt(par.left); else if (par && par.type === 'VariableDeclarator') id = txt(par.id); items.push({ rel, line, fn, kind: 'setTimeout', idvar: id }); }
        if (/(^|\.)clearInterval$/.test(c)) items.push({ rel, line, fn, kind: 'clearInterval', idvar: txt(n.arguments[0]) });
        if (/(^|\.)clearTimeout$/.test(c)) items.push({ rel, line, fn, kind: 'clearTimeout', idvar: txt(n.arguments[0]) });
        // listeners
        const m = n.callee.type === 'MemberExpression' && !n.callee.computed ? n.callee.property.name : null;
        if (m === 'addEventListener' || m === 'removeEventListener') items.push({ rel, line, fn, kind: m, target: txt(n.callee.object), ev: n.arguments[0] && n.arguments[0].type === 'Literal' ? String(n.arguments[0].value) : txt(n.arguments[0]), handler: txt(n.arguments[1]), once: !!(n.arguments[2] && n.arguments[2].type === 'ObjectExpression' && n.arguments[2].properties.some(p => p.key && p.key.name === 'once')) });
        if (m === 'on' || m === 'once' || m === 'off') { const tg = txt(n.callee.object); if (/map|mapa|_mapaInstance/i.test(tg)) items.push({ rel, line, fn, kind: 'map.' + m, target: tg, ev: n.arguments[0] && n.arguments[0].type === 'Literal' ? String(n.arguments[0].value) : txt(n.arguments[0]), handler: txt(n.arguments[1]) }); }
        if (m === 'disconnect' || m === 'observe') items.push({ rel, line, fn, kind: 'observer.' + m, target: txt(n.callee.object) });
        if (/(^|\.)requestAnimationFrame$/.test(c)) items.push({ rel, line, fn, kind: 'raf' });
        if (/(^|\.)cancelAnimationFrame$/.test(c)) items.push({ rel, line, fn, kind: 'caf' });
      }
      if (n.type === 'NewExpression') {
        const c = txt(n.callee);
        if (/^(MutationObserver|ResizeObserver|IntersectionObserver|AudioContext|Audio|BroadcastChannel|Worker)$/.test(c)) items.push({ rel, line, fn, kind: 'new ' + c });
        if (/(^|\.)Marker$/.test(c)) items.push({ rel, line, fn, kind: 'new Marker' });
      }
    }, []);
  }
}
fs.writeFileSync(salida('recursos.json'), JSON.stringify(items));
const cnt = {}; for (const i of items) cnt[i.kind] = (cnt[i.kind] || 0) + 1;
console.log(JSON.stringify(cnt));
