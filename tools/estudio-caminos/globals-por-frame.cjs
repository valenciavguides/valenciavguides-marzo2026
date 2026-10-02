// Segunda pasada de globals, POR FRAME y con análisis de ámbitos (eslint-scope) — corrige dos defectos del
// barrido anterior (globals-fantasma.cjs): (1) excluía los ficheros de datos del lado "asignado" (RETOS_AVENTURAS
// salía fantasma y no lo es: js/retos-aventuras.js:25017 lo asigna) y (2) daba por definido cualquier símbolo
// top-level de un MÓDULO, que NO es un global (iniciarHeartbeat sale de js/mensajeria.js como export, no como global).
//
// Para cada frame (cada .html de la raíz) se calcula el conjunto de ficheros que ejecuta (bloques inline + cierre
// transitivo de import estáticos y dinámicos con literal + <script src>) y se comprueba:
//   (A) referencias a identificadores sueltos sin resolver (lo que ESLint llama no-undef) que ningún bloque del frame
//       define, marcando si la lista `globals` de eslint.config.js los silencia;
//   (B) lecturas/typeof/llamadas de globalThis.X / window.X / self.X cuyo X ninguna escritura del frame define.
// Imprime SIEMPRE el residuo: bloques que no parsean, imports dinámicos no literales, asignaciones computadas.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const escope = require(path.join(ROOT, 'node_modules/eslint-scope'));
const cfg = require(path.join(ROOT, 'eslint.config.js'));
const lintGlobals = new Set(Object.keys(cfg.find(c => c.files && c.files.includes('*.html')).languageOptions.globals));
const CLASSIC_JS = new Set(['js/proteccion.js', 'js/suppress-warnings.js']);
const GL = new Set(['globalThis', 'window', 'self']);

// ---- builtins (ES + navegador). Lo que falte saldrá en la lista y se descarta a mano, con su nombre a la vista.
const BROWSER = new Set(`window self document location history navigator localStorage sessionStorage screen parent top frames opener
innerWidth innerHeight outerWidth outerHeight devicePixelRatio scrollX scrollY pageXOffset pageYOffset visualViewport matchMedia getComputedStyle
requestAnimationFrame cancelAnimationFrame requestIdleCallback cancelIdleCallback alert confirm prompt print open close focus blur stop
addEventListener removeEventListener dispatchEvent postMessage fetch Request Response Headers FormData Blob File FileReader URL URLSearchParams
Audio Image Option Event CustomEvent EventTarget MessageEvent ErrorEvent PromiseRejectionEvent PageTransitionEvent StorageEvent KeyboardEvent MouseEvent TouchEvent PointerEvent
DeviceOrientationEvent DeviceMotionEvent AudioContext webkitAudioContext OfflineAudioContext MediaSource IntersectionObserver ResizeObserver MutationObserver PerformanceObserver
indexedDB caches Notification speechSynthesis SpeechSynthesisUtterance Worker SharedWorker WebSocket BroadcastChannel MessageChannel XMLHttpRequest DOMParser XMLSerializer
HTMLElement HTMLAudioElement HTMLVideoElement HTMLImageElement HTMLInputElement HTMLIFrameElement HTMLCanvasElement HTMLButtonElement Element Node NodeFilter Document DocumentFragment Range Selection
CSS CSSStyleSheet crypto performance atob btoa structuredClone queueMicrotask reportError TextEncoder TextDecoder AbortController AbortSignal setTimeout clearTimeout setInterval clearInterval
console Intl Promise Map Set WeakMap WeakSet WeakRef Symbol Proxy Reflect JSON Math Date Object Array String Number Boolean Error TypeError RangeError SyntaxError ReferenceError EvalError URIError AggregateError RegExp
ArrayBuffer SharedArrayBuffer DataView Uint8Array Int8Array Uint16Array Int16Array Uint32Array Int32Array Float32Array Float64Array BigInt BigInt64Array BigUint64Array Uint8ClampedArray
parseInt parseFloat isNaN isFinite encodeURIComponent decodeURIComponent encodeURI decodeURI escape unescape eval globalThis undefined NaN Infinity Function Atomics FinalizationRegistry
Image Path2D OffscreenCanvas ImageData ImageBitmap createImageBitmap getSelection scrollTo scrollBy scroll moveTo resizeTo
Leaflet L maplibregl St module exports require process Buffer global arguments name length status closed
screen orientation ScreenOrientation Geolocation GeolocationPosition GeolocationPositionError Permissions MediaMetadata
DOMException DOMRect DOMMatrix DOMPoint getComputedStyle customElements TrustedTypes trustedTypes
clientInformation external event onload onerror ononline onoffline caches serviceWorker registration clients skipWaiting`.split(/\s+/).filter(Boolean));

// ---- descubrimiento de ficheros
const files = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) files.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') files.push('js/' + f);
const isHtml = r => r.endsWith('.html');

function blocksOf(rel, src) {
  if (!isHtml(rel)) return [{ code: src, off: 0, type: CLASSIC_JS.has(rel) ? 'classic' : 'module', idx: 0, rel }];
  const b = [];
  const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m, idx = 0;
  while ((m = re.exec(clean)) !== null) {
    const at = m[1] || '';
    const srcM = /\bsrc\s*=\s*["']?([^"'\s>]+)/i.exec(at);
    const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : '';
    if (srcM) { b.push({ srcAttr: srcM[1], type: ty === 'module' ? 'module' : 'classic', rel, idx: idx++, code: '', off: 0 }); continue; }
    if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue;
    const cs = m.index + m[0].indexOf('>') + 1;
    b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1, type: ty === 'module' ? 'module' : 'classic', rel, idx: idx++ });
  }
  return b;
}

const residuo = { noParsea: [], importNoLiteral: [], asignComputada: [], scriptSrcExterno: [] };
const info = {}; // rel -> {blocks:[{type,mod,ast?,scope?,...}], imports:Set, assigned:Map(name->[line]), classicProps:Set, classicLex:Set, uses:[{name,kind,line}], through:[{name,kind,line}]}

function parseBlock(code, wantModule) {
  const o = { ecmaVersion: 'latest', locations: true, ranges: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowHashBang: true };
  try { return { ast: acorn.parse(code, { ...o, sourceType: wantModule ? 'module' : 'script' }), mod: wantModule }; } catch (e1) {
    try { return { ast: acorn.parse(code, { ...o, sourceType: wantModule ? 'script' : 'module' }), mod: !wantModule, fallback: e1.message }; } catch (e2) { return { err: e1.message }; }
  }
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const strLit = (s) => (s && s.type === 'Literal' && typeof s.value === 'string') ? s.value : (s && s.type === 'TemplateLiteral' && s.expressions.length === 0 ? s.quasis[0].value.cooked : null);
function resolveSpec(from, spec) {
  if (/^https?:|^data:|^blob:/.test(spec)) return null;
  let p = spec.startsWith('/') ? spec.slice(1) : path.posix.join(path.posix.dirname(from), spec);
  p = path.posix.normalize(p);
  return p;
}

for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  const I = info[rel] = { rel, blocks: [], imports: new Set(), assigned: new Map(), classicProps: new Set(), classicLex: new Set(), uses: [], through: [], moduleTop: new Set(), cross: [] };
  for (const b of blocksOf(rel, src)) {
    if (b.srcAttr) { const r = resolveSpec(rel, b.srcAttr); if (r && files.includes(r)) { I.imports.add(r); if (b.type === 'classic') CLASSIC_JS.add(r); } else residuo.scriptSrcExterno.push(`${rel}: <script src="${b.srcAttr}">`); continue; }
    const wantModule = b.type === 'module';
    const P = parseBlock(b.code, wantModule);
    if (!P.ast) { residuo.noParsea.push(`${rel} bloque#${b.idx} (línea ${b.off + 1}): ${P.err}`); continue; }
    if (P.fallback) residuo.noParsea.push(`${rel} bloque#${b.idx} (línea ${b.off + 1}): parseó como ${P.mod ? 'module' : 'script'} tras fallar como ${wantModule ? 'module' : 'script'} (${P.fallback})`);
    const isMod = P.mod;
    let sm; try { sm = escope.analyze(P.ast, { ecmaVersion: 2022, sourceType: isMod ? 'module' : 'script', ignoreEval: true }); } catch (e) { residuo.noParsea.push(`${rel} bloque#${b.idx}: eslint-scope falla: ${e.message}`); continue; }
    const gs = sm.globalScope;
    // declaraciones top-level
    if (isMod) { const ms = gs.childScopes.find(s => s.type === 'module'); if (ms) for (const v of ms.variables) I.moduleTop.add(v.name); }
    else for (const v of gs.variables) { const d = v.defs[0]; if (!d) continue; const kind = d.type === 'FunctionName' ? 'func' : (d.type === 'Variable' ? d.parent.kind : 'class'); if (kind === 'func' || kind === 'var') I.classicProps.add(v.name); else I.classicLex.add(v.name); }
    // referencias sin resolver (through)
    const ids = {}; // start -> kind
    const globalObjIds = new Set(); const derefStarts = new Set(); const parentIds = new Set();
    for (const r of gs.through) { const n = r.identifier; if (GL.has(n.name)) globalObjIds.add(n.start); if (n.name === 'parent' || n.name === 'top') parentIds.add(n.start); }
    walk(P.ast, (n, ps) => {
      const par = ps[ps.length - 1];
      if (n.type === 'Identifier') {
        if (par && par.type === 'UnaryExpression' && par.operator === 'typeof' && par.argument === n) ids[n.start] = 'typeof';
        else if (par && par.type === 'CallExpression' && par.callee === n) ids[n.start] = 'call';
        else if (par && par.type === 'ChainExpression') ids[n.start] = ids[n.start] || 'read';
      }
      // imports
      const addSpec = (spec, line, dyn) => { const r = resolveSpec(rel, spec); if (r && files.includes(r)) I.imports.add(r); else if (r && !/^https?:/.test(spec)) residuo.importNoLiteral.push(`${rel}:${line + b.off} import('${spec}') -> ${r} (no es fichero conocido)`); };
      if ((n.type === 'ImportDeclaration' || n.type === 'ExportAllDeclaration' || (n.type === 'ExportNamedDeclaration' && n.source)) && n.source) addSpec(n.source.value, n.loc.start.line);
      if (n.type === 'ImportExpression') { const s = strLit(n.source); if (s !== null) addSpec(s, n.loc.start.line, true); else residuo.importNoLiteral.push(`${rel}:${n.loc.start.line + b.off} import(<expresión no literal>)`); }
      // asignaciones a globalThis.X
      if (n.type === 'AssignmentExpression') {
        const L = n.left;
        if (L.type === 'MemberExpression' && L.object.type === 'Identifier' && globalObjIds.has(L.object.start)) {
          let nm = null;
          if (!L.computed && L.property.type === 'Identifier') nm = L.property.name;
          else if (L.computed) { nm = strLit(L.property); if (nm === null) residuo.asignComputada.push(`${rel}:${n.loc.start.line + b.off} ${GL.has(L.object.name) ? L.object.name : '?'}[<expr>] =`); }
          if (nm) { (I.assigned.get(nm) || I.assigned.set(nm, []).get(nm)).push(n.loc.start.line + b.off); derefStarts.add(L.start);
            const R = n.right; const vacio = (R.type === 'Literal' && (R.value === null || R.value === false || R.value === 0 || R.value === '')) || (R.type === 'Identifier' && R.name === 'undefined') || (R.type === 'ArrayExpression' && R.elements.length === 0) || (R.type === 'ObjectExpression' && R.properties.length === 0) || (R.type === 'UnaryExpression' && R.operator === 'void');
            (I.vals ||= {})[nm] = (I.vals[nm] || { vacio: 0, lleno: 0 }); I.vals[nm][vacio ? 'vacio' : 'lleno']++; }
        }
      }
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && n.callee.object.type === 'Identifier' && n.callee.object.name === 'Object' && n.arguments[0] && n.arguments[0].type === 'Identifier' && globalObjIds.has(n.arguments[0].start)) {
        const pn = n.callee.property.name;
        if (pn === 'defineProperty') { const s = strLit(n.arguments[1]); if (s) { (I.assigned.get(s) || I.assigned.set(s, []).get(s)).push(n.loc.start.line + b.off); } else residuo.asignComputada.push(`${rel}:${n.loc.start.line + b.off} Object.defineProperty(globalThis, <expr>)`); }
        else if (pn === 'assign' || pn === 'defineProperties') residuo.asignComputada.push(`${rel}:${n.loc.start.line + b.off} Object.${pn}(globalThis, …)`);
      }
      // lecturas entre frames: parent.X / top.X / globalThis.parent.X / <algo>.contentWindow.X
      if (n.type === 'MemberExpression' && n.property.type === 'Identifier' && !n.computed) {
        const o = n.object; let tag = null;
        if (o.type === 'Identifier' && parentIds.has(o.start)) tag = 'parent';
        else if (o.type === 'MemberExpression' && !o.computed && o.object.type === 'Identifier' && globalObjIds.has(o.object.start) && o.property.type === 'Identifier' && (o.property.name === 'parent' || o.property.name === 'top')) tag = 'parent';
        else if (o.type === 'MemberExpression' && !o.computed && o.property.type === 'Identifier' && o.property.name === 'contentWindow') tag = 'child';
        else if (o.type === 'ChainExpression' && o.expression.type === 'MemberExpression' && !o.expression.computed && o.expression.property.type === 'Identifier' && o.expression.property.name === 'contentWindow') tag = 'child';
        if (tag) {
          let kind = 'read';
          if (par && par.type === 'AssignmentExpression' && par.left === n) kind = 'write';
          else if (par && par.type === 'UnaryExpression' && par.operator === 'typeof') kind = 'typeof';
          else if (par && par.type === 'CallExpression' && par.callee === n) kind = 'call';
          I.cross.push({ tag, name: n.property.name, kind, line: n.loc.start.line + b.off });
        }
      }
      // usos globalThis.X
      if (n.type === 'MemberExpression' && n.object.type === 'Identifier' && globalObjIds.has(n.object.start) && !derefStarts.has(n.start)) {
        let nm = null; if (!n.computed && n.property.type === 'Identifier') nm = n.property.name; else if (n.computed) nm = strLit(n.property);
        if (nm) {
          let kind = 'read';
          if (par && par.type === 'UnaryExpression' && par.operator === 'typeof') kind = 'typeof';
          else if (par && par.type === 'UnaryExpression' && par.operator === 'delete') kind = 'delete';
          else if (par && par.type === 'CallExpression' && par.callee === n) kind = 'call';
          else if (par && par.type === 'ChainExpression') { const gp = ps[ps.length - 2]; if (gp && gp.type === 'CallExpression' && gp.callee === par) kind = 'call'; }
          I.uses.push({ name: nm, kind, line: n.loc.start.line + b.off });
        }
      }
    }, []);
    // through: nombres sueltos sin resolver
    for (const r of gs.through) {
      const n = r.identifier; if (GL.has(n.name)) continue;
      const kind = ids[n.start] || (r.isWrite() ? 'write' : 'read');
      I.through.push({ name: n.name, kind, line: n.loc.start.line + b.off, blockType: isMod ? 'module' : 'classic', blockIdx: b.idx });
    }
    // escrituras a identificadores sin declarar en script clásico = propiedad de globalThis
    if (!isMod) for (const r of gs.through) if (r.isWrite() && !GL.has(r.identifier.name)) I.classicProps.add(r.identifier.name);
    I.blocks.push({ type: isMod ? 'module' : 'classic', idx: b.idx, off: b.off });
  }
}

// ---- cierre transitivo por frame
const frames = files.filter(isHtml);
function closure(root) { const seen = new Set([root]); const st = [root]; while (st.length) { const f = st.pop(); for (const g of info[f].imports) if (!seen.has(g)) { seen.add(g); st.push(g); } } return seen; }

const out = [];
const P = (s) => out.push(s);
const lintFlag = (n) => lintGlobals.has(n) ? 'LINT-OK' : 'lint-avisa';
const porNombreA = {}; const porNombreB = {};
for (const F of frames) {
  const set = closure(F);
  const defsProp = new Set(), defsBare = new Set();
  const assignedAt = {};
  for (const f of set) {
    const I = info[f];
    for (const [n, ls] of I.assigned) { defsProp.add(n); (assignedAt[n] ||= []).push(`${f}:${ls[0]}`); }
    const classicFile = isHtml(f) ? true : CLASSIC_JS.has(f);
    // en HTML solo cuentan los bloques clásicos (classicProps/classicLex solo se rellenan para bloques clásicos)
    for (const n of I.classicProps) { defsProp.add(n); defsBare.add(n); (assignedAt[n] ||= []).push(`${f}:(top-level clásico)`); }
    for (const n of I.classicLex) defsBare.add(n);
  }
  for (const n of defsProp) defsBare.add(n);
  for (const f of set) {
    const I = info[f];
    // (A) sueltos sin resolver
    for (const t of I.through) {
      if (BROWSER.has(t.name) || defsBare.has(t.name)) continue;
      (porNombreA[t.name] ||= {})[F] = (porNombreA[t.name][F] || []); porNombreA[t.name][F].push(`${f}:${t.line} ${t.kind}`);
    }
    // (B) globalThis.X
    for (const u of I.uses) {
      if (BROWSER.has(u.name) || defsProp.has(u.name)) continue;
      (porNombreB[u.name] ||= {})[F] = (porNombreB[u.name][F] || []); porNombreB[u.name][F].push(`${f}:${u.line} ${u.kind}`);
    }
  }
}
function definidoGlobal(n){ const r=[]; for (const F of frames){ for (const f of closure(F)){ const I=info[f]; if (I.assigned.has(n)||I.classicProps.has(n)){ r.push(F); break; } } } return r; }

{ const filt = {}; for (const F of frames) { const dp = new Set(); for (const f of closure(F)) { const I = info[f]; for (const n of I.assigned.keys()) dp.add(n); for (const n of I.classicProps) dp.add(n); for (const n of I.classicLex) dp.add(n); }
  for (const f of closure(F)) for (const t of info[f].through) { if (BROWSER.has(t.name) && !dp.has(t.name)) { const k = t.name; (filt[k] ||= new Set()).add(f + ':' + t.line + ' ' + t.kind); } } }
  P('=== (A2) nombres sueltos sin declarar que el filtro de navegador deja pasar (revisar a mano): nombre -> nº sitios ===');
  P(Object.keys(filt).sort().map(n => n + '(' + filt[n].size + ')').join('  '));
  fs.writeFileSync(salida('globals-filtrados.json'), JSON.stringify(Object.fromEntries(Object.entries(filt).map(([k, v]) => [k, [...v]])), null, 1));
  P(''); }
P('=== (A) identificadores sueltos que NINGÚN bloque del frame define (lo que ESLint llamaría no-undef) ===');
for (const n of Object.keys(porNombreA).sort()) {
  const fr = Object.keys(porNombreA[n]);
  const sites = [...new Set([].concat(...Object.values(porNombreA[n])))];
  P(`${n.padEnd(30)} ${lintFlag(n)}  frames=${fr.length} [${fr.join(',')}]  sitios=${sites.length}: ${sites.slice(0, 6).join(' | ')}`);
}
P('');
P('=== (B) globalThis.X / window.X / self.X con X que ninguna escritura del frame define ===');
for (const n of Object.keys(porNombreB).sort()) {
  const fr = Object.keys(porNombreB[n]);
  const sites = [...new Set([].concat(...Object.values(porNombreB[n])))];
  P(`${n.padEnd(30)} definidoEn=[${definidoGlobal(n).join(',')}] frames=${fr.length} [${fr.join(',')}]  sitios=${sites.length}: ${sites.slice(0, 6).join(' | ')}`);
}
P('');
// (C)/(D) lecturas entre frames: nombres cuya definición no existe en NINGÚN frame (unión de todos los cierres)
{
  const defsUnion = new Set(); const definidoEn = {};
  for (const F of frames) { for (const f of closure(F)) { const I = info[f]; for (const n of I.assigned.keys()) { defsUnion.add(n); (definidoEn[n] ||= new Set()).add(F); } for (const n of I.classicProps) { defsUnion.add(n); (definidoEn[n] ||= new Set()).add(F); } } }
  const C = {};
  for (const f of files) for (const c of info[f].cross) { if (BROWSER.has(c.name) || defsUnion.has(c.name)) continue; (C[c.tag + ':' + c.name] ||= []).push(`${f}:${c.line} ${c.kind}`); }
  P('=== (C)/(D) parent.X / top.X / <iframe>.contentWindow.X cuyo X NINGÚN frame define ===');
  for (const k of Object.keys(C).sort()) P(`${k.padEnd(40)} sitios=${C[k].length}: ${[...new Set(C[k])].slice(0, 8).join(' | ')}`);
  P('');
  P('=== (C2) escrituras a parent.X / contentWindow.X (definen en OTRO frame) ===');
  for (const f of files) for (const c of info[f].cross) if (c.kind === 'write') P(`${f}:${c.line} ${c.tag}.${c.name} =`);
  P('');
  // resumen de todas las lecturas cruzadas (también las definidas), para ver el volumen
  const all = {}; for (const f of files) for (const c of info[f].cross) { if (BROWSER.has(c.name)) continue; (all[c.tag + ':' + c.name] ||= []).push(`${f}:${c.line} ${c.kind}`); }
  P('=== (C3) TODAS las lecturas cruzadas con X no-navegador, y dónde se define X ===');
  for (const k of Object.keys(all).sort()) { const n = k.split(':')[1]; P(`${k.padEnd(40)} definidoEn=[${[...(definidoEn[n] || [])].join(',')}] sitios=${all[k].length}: ${[...new Set(all[k])].slice(0, 5).join(' | ')}`); }
  P('');
}
// (E) la lista `globals` de eslint.config.js: uso real de cada nombre "propio"
{
  const propios = [...lintGlobals].filter(n => !BROWSER.has(n));
  const porFrameDefs = {};
  for (const F of frames) { const dp = new Set(), db = new Set(); for (const f of closure(F)) { const I = info[f]; for (const n of I.assigned.keys()) dp.add(n); for (const n of I.classicProps) { dp.add(n); db.add(n); } for (const n of I.classicLex) db.add(n); } for (const n of dp) db.add(n); porFrameDefs[F] = db; }
  P(`=== (E) lista globals de eslint.config.js (bloque *.html): ${lintGlobals.size} nombres, ${propios.length} no-navegador ===`);
  let sinRef = 0, conRefSinDef = 0, ok = 0;
  const lineas = [];
  for (const n of propios.sort()) {
    const refsPorFrame = {}; let refs = 0;
    for (const F of frames) for (const f of closure(F)) for (const t of info[f].through) if (t.name === n && f.endsWith('.html') && f === F) { refs++; (refsPorFrame[F] ||= []).push(`${f}:${t.line} ${t.kind}`); }
    // refs en bloques inline del propio HTML solamente (lo que ESLint ve)
    const frs = Object.keys(refsPorFrame);
    const definidoEn = frames.filter(F => porFrameDefs[F].has(n));
    const sinDef = frs.filter(F => !porFrameDefs[F].has(n));
    if (refs === 0) { sinRef++; lineas.push(`${n.padEnd(34)} SIN REFERENCIAS sueltas en ningún bloque inline   definidoEn=[${definidoEn.join(',')}]`); }
    else if (sinDef.length) { conRefSinDef++; lineas.push(`${n.padEnd(34)} refs=${refs} en [${frs.join(',')}] — NO definido en: [${sinDef.join(',')}]  sitios: ${sinDef.map(F => refsPorFrame[F].slice(0, 3).join(' ; ')).join(' | ')}`); }
    else { ok++; lineas.push(`${n.padEnd(34)} refs=${refs} en [${frs.join(',')}] — definido en cada uno`); }
  }
  P(`resumen: ${ok} con referencias y definidos en el frame que los usa; ${conRefSinDef} con referencias en algún frame donde NO están definidos; ${sinRef} sin ninguna referencia suelta en bloques inline (entradas ociosas)`);
  for (const l of lineas) P(l);
  P('');
}
{
  P('=== (F) nombres leídos como globalThis.X en el frame cuyas ÚNICAS asignaciones del cierre son valores vacíos (null/undefined/false/0/""/[]/{}) ===');
  const porNombre = {};
  for (const F of frames) { const set = closure(F); const vals = {}; for (const f of set) { const I = info[f]; for (const [n, v] of Object.entries(I.vals || {})) { const x = (vals[n] ||= { vacio: 0, lleno: 0, sitios: [] }); x.vacio += v.vacio; x.lleno += v.lleno; x.sitios.push(f + ':' + I.assigned.get(n)[0]); } }
    for (const f of set) for (const u of info[f].uses) { const v = vals[u.name]; if (v && v.lleno === 0 && v.vacio > 0 && !BROWSER.has(u.name)) ((porNombre[u.name] ||= {})[F] ||= []).push(f + ':' + u.line + ' ' + u.kind); } }
  for (const n of Object.keys(porNombre).sort()) { const fr = Object.keys(porNombre[n]); P(n.padEnd(30) + ' frames=' + fr.length + ' [' + fr.join(',') + ']  lecturas: ' + [...new Set([].concat(...Object.values(porNombre[n])))].slice(0, 5).join(' | ')); }
  if (!Object.keys(porNombre).length) P('  (ninguno)');
  P('');
}
P('=== RESIDUO ===');
for (const [k, v] of Object.entries(residuo)) { P(`-- ${k}: ${v.length}`); for (const x of v.slice(0, 60)) P('   ' + x); }
P('');
const totUses = Object.values(info).reduce((a, I) => a + I.uses.length, 0), totThrough = Object.values(info).reduce((a, I) => a + I.through.length, 0);
P(`ficheros=${files.length} frames=${frames.length} usos globalThis.X=${totUses} sueltos sin resolver (bruto)=${totThrough} lintGlobals=${lintGlobals.size} classicJs=${[...CLASSIC_JS].join(',')}`);
fs.writeFileSync(salida('globals-por-frame.txt'), out.join('\n'));
fs.writeFileSync(salida('globals-por-frame.json'), JSON.stringify({ A: porNombreA, B: porNombreB, residuo }, null, 1));
console.log(out.join('\n').slice(0, 60000));
