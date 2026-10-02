// Barrido extra (ronda 2): A) campos homónimos entre raíces de estado; B) APIs web por fichero;
// C) mecanismos de visibilidad por variable; D) avisos al usuario (alert/confirm/prompt) y console directo.
// Parser real (acorn). Imprime lo que deja sin casar (residuo) en cada pasada.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') o.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f)) o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function txt(n) { if (!n) return '?'; if (n.type === 'Identifier') return n.name; if (n.type === 'ThisExpression') return 'this'; if (n.type === 'MemberExpression') return txt(n.object) + (n.computed ? '[…]' : '.' + n.property.name); if (n.type === 'CallExpression') return txt(n.callee) + '()'; if (n.type === 'ChainExpression') return txt(n.expression); if (n.type === 'Literal') return JSON.stringify(n.value); return n.type; }
function strip(t) { return t.replace(/^(globalThis|window)\./, '').replace(/\?\./g, '.'); }

// ---------- A) campos homónimos entre raíces ----------
{
  const w = JSON.parse(fs.readFileSync(salida('estado-writes.json'), 'utf8'));
  const norm = p => p.replace(/^(estadoPadre|estadoScript1|est)\./, 'estado.');
  const by = {};
  for (const x of w) {
    const parts = norm(x.full).split('.');
    const root = parts[0]; const rest = parts.slice(1);
    if (!rest.length) continue;
    const leaf = rest[rest.length - 1];
    if (leaf === '[]') continue;
    // normalizar prefijo: estado.gps.activo -> 'activo' bajo raíz estado.gps ; estadoMapa.gpsActivo -> 'gpsActivo'
    const key = leaf.replace(/^_/, '');
    (by[key] ||= []).push({ root, full: parts.join('.'), rel: x.rel, line: x.line, fn: x.fn });
  }
  const out = [];
  for (const [k, arr] of Object.entries(by).sort()) {
    const roots = new Set(arr.map(a => a.root + '@' + a.rel));
    const rootNames = new Set(arr.map(a => a.root));
    if (rootNames.size >= 2) {
      const fulls = {}; for (const a of arr) { (fulls[a.full] ||= new Set()).add(a.rel); }
      out.push(`${k}: ` + Object.entries(fulls).map(([f, rs]) => `${f}[${[...rs].join('|')}]`).join('  ;  '));
    }
  }
  fs.writeFileSync(salida('barrido-A-campos.txt'), out.join('\n'));
  console.log('A) campos homónimos en >=2 raíces:', out.length, ' de ', Object.keys(by).length, ' nombres de campo; escritos totales:', w.length);
}

// ---------- B/C/D) AST por fichero ----------
const B = []; // APIs web
const C = []; // visibilidad
const D = []; // alert/confirm/prompt/console
const API_PATTERNS = [
  /^navigator\.wakeLock/, /^navigator\.vibrate/, /^Notification/, /^navigator\.permissions/, /requestFullscreen$/, /^screen\.orientation/, /^history\.(pushState|replaceState|back|forward|go)$/, /^location\.(assign|replace|reload)$/, /^window\.open$|^open$/, /^navigator\.share$/, /^navigator\.clipboard/, /^matchMedia$|\.matchMedia$/, /^navigator\.serviceWorker/, /^navigator\.onLine$/, /^navigator\.connection/, /^document\.(hidden|visibilityState)$/, /^visualViewport|\.visualViewport$/, /^screen\.(width|height|availWidth|availHeight)$/, /^devicePixelRatio$|\.devicePixelRatio$/, /^navigator\.userAgent$/, /^navigator\.maxTouchPoints$/, /^navigator\.geolocation\.(getCurrentPosition|watchPosition|clearWatch)$/, /^new (AudioContext|webkitAudioContext)$/, /^indexedDB/, /^caches\./, /^fetch$|\.fetch$/, /^XMLHttpRequest$/, /^navigator\.sendBeacon$/, /^performance\.now$/, /^Date\.now$/, /^new Date$/
];
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) { console.log('NO PARSEA', rel); continue; }
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off;
      // B: llamadas y lecturas de miembro
      let t = null;
      if (n.type === 'CallExpression') t = strip(txt(n.callee));
      else if (n.type === 'NewExpression') t = 'new ' + strip(txt(n.callee));
      else if (n.type === 'MemberExpression' && !n.computed) {
        const par = ps[ps.length - 1];
        if (!(par && par.type === 'MemberExpression' && par.object === n)) t = strip(txt(n)); // solo el nodo más largo
      }
      if (t) { for (const re of API_PATTERNS) if (re.test(t)) { B.push({ rel, line, api: t }); break; } }
      // C: visibilidad
      if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed) {
        const lt = txt(n.left);
        if (/\.style\.display$/.test(lt)) C.push({ rel, line, var: lt.replace(/\.style\.display$/, ''), mech: 'style.display=' + (n.right.type === 'Literal' ? JSON.stringify(n.right.value) : '<expr>') });
        else if (/\.style\.visibility$/.test(lt)) C.push({ rel, line, var: lt.replace(/\.style\.visibility$/, ''), mech: 'style.visibility=' + (n.right.type === 'Literal' ? JSON.stringify(n.right.value) : '<expr>') });
        else if (/\.hidden$/.test(lt)) C.push({ rel, line, var: lt.replace(/\.hidden$/, ''), mech: 'hidden=' + (n.right.type === 'Literal' ? JSON.stringify(n.right.value) : '<expr>') });
        else if (/\.style\.opacity$/.test(lt)) C.push({ rel, line, var: lt.replace(/\.style\.opacity$/, ''), mech: 'style.opacity' });
      }
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed) {
        const m = n.callee.property.name; const objTxt = txt(n.callee.object);
        if (/\.classList$/.test(objTxt) && (m === 'add' || m === 'remove' || m === 'toggle')) {
          const cls = n.arguments.map(a => a.type === 'Literal' ? String(a.value) : '<expr>').join(',');
          C.push({ rel, line, var: objTxt.replace(/\.classList$/, ''), mech: 'classList.' + m + '(' + cls + ')' });
        }
        if ((m === 'setAttribute' || m === 'removeAttribute') && n.arguments[0] && n.arguments[0].type === 'Literal' && /^(hidden|aria-hidden)$/.test(n.arguments[0].value)) C.push({ rel, line, var: objTxt, mech: m + '(' + n.arguments[0].value + ')' });
        if (m === 'setProperty' && n.arguments[0] && n.arguments[0].type === 'Literal' && /^display$/.test(n.arguments[0].value)) C.push({ rel, line, var: objTxt, mech: 'style.setProperty(display)' });
      }
      // D: avisos
      if (n.type === 'CallExpression') {
        const c = strip(txt(n.callee));
        if (/^(alert|confirm|prompt)$/.test(c)) D.push({ rel, line, kind: c });
        const mm = /^console\.(log|warn|error|info|debug)$/.exec(c);
        if (mm) D.push({ rel, line, kind: 'console.' + mm[1] });
      }
    }, []);
  }
}
fs.writeFileSync(salida('barrido-B.json'), JSON.stringify(B));
fs.writeFileSync(salida('barrido-C.json'), JSON.stringify(C));
fs.writeFileSync(salida('barrido-D.json'), JSON.stringify(D));
// resumen B por api->ficheros
{
  const m = {}; for (const x of B) { (m[x.api] ||= {})[x.rel] = (m[x.api][x.rel] || 0) + 1; }
  const lines = Object.entries(m).sort().map(([a, fs_]) => a.padEnd(48) + Object.entries(fs_).map(([f, c]) => f + '×' + c).join('  '));
  fs.writeFileSync(salida('barrido-B.txt'), lines.join('\n'));
  console.log('B) APIs web distintas:', Object.keys(m).length, ' usos:', B.length);
}
// resumen C: por fichero, variable con >=2 mecanismos distintos (familias: display/classList/hidden/visibility/attr)
{
  const fam = mech => mech.startsWith('style.display') || mech.startsWith('style.setProperty') ? 'display' : mech.startsWith('classList') ? 'class' : mech.startsWith('hidden') ? 'hidden' : mech.startsWith('style.visibility') ? 'visibility' : mech.startsWith('style.opacity') ? 'opacity' : 'attr';
  const per = {}; for (const x of C) { const k = x.rel + '::' + x.var; (per[k] ||= []).push(x); }
  const lines = [];
  for (const [k, arr] of Object.entries(per).sort()) {
    const fams = new Set(arr.map(a => fam(a.mech)));
    // ignorar clases claramente no de visibilidad: classList con nombres que no parecen ocultar
    if (fams.size >= 2) lines.push(k + '  familias=' + [...fams].join('+') + '  ' + arr.map(a => a.mech + '@' + a.line).join(' '));
  }
  fs.writeFileSync(salida('barrido-C.txt'), lines.join('\n'));
  const perFile = {}; for (const x of C) { const f = fam(x.mech); (perFile[x.rel] ||= {})[f] = ((perFile[x.rel] || {})[f] || 0) + 1; }
  fs.writeFileSync(salida('barrido-C-por-fichero.txt'), Object.entries(perFile).sort().map(([f, o]) => f.padEnd(32) + JSON.stringify(o)).join('\n'));
  console.log('C) usos de visibilidad:', C.length, ' variables con >=2 familias:', lines.length);
}
// resumen D
{
  const m = {}; for (const x of D) { (m[x.rel] ||= {})[x.kind] = ((m[x.rel] || {})[x.kind] || 0) + 1; }
  fs.writeFileSync(salida('barrido-D.txt'), Object.entries(m).sort().map(([f, o]) => f.padEnd(32) + JSON.stringify(o)).join('\n'));
  console.log('D) ficheros con alert/confirm/prompt/console:', Object.keys(m).length);
}
