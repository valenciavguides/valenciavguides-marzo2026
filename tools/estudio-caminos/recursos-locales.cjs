// Referencias a recursos locales (html/js/css/json/media/fuentes) que no existen en disco. Excluye, contando cuántas, las rutas bajo
// imagenes/ y audios-aventuras/ (las imágenes/audios de aventuras que faltan son conocidos y no se reportan). Imprime el residuo:
// literales con plantilla (${}) y rutas que no se pudieron resolver.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const EXT = /\.(html|js|mjs|css|json|png|jpe?g|webp|gif|svg|ico|mp3|mp4|webm|ogg|wav|m4a|woff2?|ttf|otf|txt|xml|pdf|webmanifest)$/i;
const DATOS = new Set(['aventuras-ID-padre', 'coordenadas-aventuras', 'retos-aventuras', 'textos-aventuras', 'audios-aventuras', 'traducciones-ui', 'puzzles-aventuras', 'terminos-aventuras', 'agradecimientos-aventuras', 'mapa-vintage-aventuras', 'indice-aventuras']);
const files = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js' || f === 'manifest.json') files.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') files.push('js/' + f);
for (const f of fs.readdirSync(path.join(ROOT, 'publico'))) if (f.endsWith('.js')) files.push('publico/' + f);
const exists = (p) => { try { return fs.existsSync(path.join(ROOT, p)); } catch (e) { return false; } };
// índice de nombres base de TODO el repo (sin node_modules/.git/test-results): un nombre suelto (sin carpeta) cuenta como existente si hay un fichero con ese nombre en cualquier carpeta
const BASE = new Set(); const BASEPATH = {};
(function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { if (['node_modules', '.git', 'test-results', 'playwright-report', '.claude'].includes(e.name)) continue; const p = path.join(dir, e.name); if (e.isDirectory()) walk(p); else { BASE.add(e.name); (BASEPATH[e.name] ||= []).push(path.relative(ROOT, p).split(path.sep).join('/')); } } })(ROOT);
const existeSuelto = (s) => !s.includes('/') && BASE.has(s);

let sueltosOk = 0; const faltan = []; const excluidos = {}; const plantilla = []; const vistos = new Set(); let total = 0;
function consider(rel, line, raw, kind) {
  let s = raw.trim(); if (!s || s.length > 220) return;
  if (/^(https?:|\/\/|data:|blob:|mailto:|tel:|sms:|javascript:|#)/i.test(s)) return;
  if (/[\s{}`<>|*]/.test(s) && !/\.(png|jpe?g|webp|gif|svg|mp3|mp4)['"]?\)?$/i.test(s)) return;
  s = s.replace(/[?#].*$/, ''); if (!EXT.test(s)) return;
  if (s.includes('${')) { plantilla.push(`${rel}:${line} ${raw.slice(0, 80)}`); return; }
  let p = s.startsWith('/') ? s.slice(1) : (s.startsWith('./') || s.startsWith('../') || !s.includes(':')) ? path.posix.normalize(path.posix.join(rel.includes('/') ? path.posix.dirname(rel) : '', s)) : null;
  if (!p) return; total++;
  const key = rel + '|' + p; if (vistos.has(key)) return; vistos.add(key);
  // los HTML de la raíz resuelven relativo a la raíz; los js/ importados desde un HTML de la raíz resuelven relativo al HTML (no al .js) para src/href/fetch
  const candidatos = [p, s.startsWith('/') ? s.slice(1) : s.replace(/^\.\//, '')];
  if (candidatos.some(exists)) return;
  if (existeSuelto(s)) { sueltosOk++; return; }
  if (/^(imagenes|audios-aventuras|videos|video)\//i.test(candidatos[1]) || /^(imagenes|audios-aventuras)\//i.test(p)) { const d = candidatos[1].split('/')[0]; excluidos[d] = (excluidos[d] || 0) + 1; return; }
  faltan.push(`${rel}:${line} (${kind}) ${raw}  → no existe ${candidatos[0]}${candidatos[1] !== candidatos[0] ? ' ni ' + candidatos[1] : ''}`);
}
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  if (rel.endsWith('.json')) { for (const m of src.matchAll(/"([^"]+\.[a-z0-9]{2,5})"/gi)) consider(rel, src.slice(0, m.index).split('\n').length, m[1], 'json'); continue; }
  // atributos HTML y url(...) de CSS
  if (rel.endsWith('.html')) {
    const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' '));
    for (const m of clean.matchAll(/\b(?:src|href|data-src|poster)\s*=\s*["']([^"']+)["']/gi)) consider(rel, clean.slice(0, m.index).split('\n').length, m[1], 'atributo');
    for (const m of clean.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) consider(rel, clean.slice(0, m.index).split('\n').length, m[1], 'url()');
  }
  if (DATOS.has(path.basename(rel, '.js')) && rel.startsWith('js/')) continue; // los módulos de datos referencian media de aventuras: fuera de alcance
  // literales de cadena del JS (acorn) — también los de los <script> de los HTML
  const blocks = [];
  if (rel.endsWith('.html')) { const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e); const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m; while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; blocks.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); } }
  else blocks.push({ code: src, off: 0 });
  for (const b of blocks) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) { faltan.push(`${rel}: bloque sin parsear`); continue; }
    (function w(n) { if (!n || typeof n.type !== 'string') return; if (n.type === 'Literal' && typeof n.value === 'string') consider(rel, n.loc.start.line + b.off, n.value, 'cadena'); if (n.type === 'TemplateLiteral') { const t = n.quasis.map(q => q.value.cooked).join('${}'); if (EXT.test(t.replace(/[?#].*$/, '')) && !/\s/.test(t)) { if (n.expressions.length) plantilla.push(`${rel}:${n.loc.start.line + b.off} \`${t.slice(0, 80)}\``); else consider(rel, n.loc.start.line + b.off, t, 'plantilla'); } } for (const k of Object.keys(n)) { if (k === 'type' || k === 'loc' || k === 'start' || k === 'end') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && w(c)); else if (x && typeof x.type === 'string') w(x); } })(ast);
  }
}
const out = [];
out.push(`referencias locales con extensión conocida examinadas: ${total}; ficheros: ${files.length}; no existen: ${faltan.length}; nombres sueltos que existen en alguna carpeta (se construye la ruta en ejecución): ${sueltosOk}; excluidas por ser media de aventuras (${JSON.stringify(excluidos)}); con plantilla (no resolubles): ${plantilla.length}`);
out.push(''); out.push('=== NO EXISTEN ==='); out.push(...faltan.map(x => '  ' + x));
out.push(''); out.push('=== RESIDUO: literales con ${…} ==='); out.push(...[...new Set(plantilla)].slice(0, 60).map(x => '  ' + x));
fs.writeFileSync(salida('recursos-locales.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 30000));
