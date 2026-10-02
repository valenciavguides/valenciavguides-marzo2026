// Barrido CSS/DOM: (1) variables CSS definidas vs usadas por documento (las variables NO cruzan iframes);
// (2) ids pedidos por getElementById/querySelector('#x') que el propio documento nunca define;
// (3) CustomEvent/dispatchEvent: pares emisor-receptor (segundo bus).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const html = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const jsfiles = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f);
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');

// ---- (1) variables CSS ----
const defs = {}, uses = {};
for (const f of html) {
  const s = read(f);
  const lines = s.split('\n');
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;}\n]+)/g)) (defs[m[1]] ||= []).push({ f, line: i + 1, val: m[2].trim().slice(0, 40) });
    for (const m of ln.matchAll(/setProperty\(\s*['"](--[A-Za-z0-9_-]+)['"]\s*,\s*([^)]*)\)/g)) (defs[m[1]] ||= []).push({ f, line: i + 1, val: 'JS:' + m[2].trim().slice(0, 30) });
    for (const m of ln.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) (uses[m[1]] ||= []).push({ f, line: i + 1 });
  });
}
for (const f of jsfiles) {
  const lines = read(f).split('\n');
  lines.forEach((ln, i) => {
    for (const m of ln.matchAll(/setProperty\(\s*['"](--[A-Za-z0-9_-]+)['"]\s*,\s*([^)]*)\)/g)) (defs[m[1]] ||= []).push({ f, line: i + 1, val: 'JS:' + m[2].trim().slice(0, 30) });
    for (const m of ln.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) (uses[m[1]] ||= []).push({ f, line: i + 1 });
  });
}
const out = [];
out.push('=== (1) Variables CSS: usadas en un documento que no las define (no cruzan iframes) ===');
const names = new Set([...Object.keys(defs), ...Object.keys(uses)]);
for (const n of [...names].sort()) {
  const d = defs[n] || [], u = uses[n] || [];
  const dFiles = new Set(d.map(x => x.f)), uFiles = new Set(u.map(x => x.f));
  const sinDef = [...uFiles].filter(f => !dFiles.has(f) && f.endsWith('.html'));
  const defsNoUse = d.length && !u.length;
  const valores = [...new Set(d.map(x => x.val))];
  if (sinDef.length || defsNoUse || (valores.length > 1 && dFiles.size > 1)) {
    out.push(`${n}  defs=${d.length}[${[...dFiles].join(',')}] usos=${u.length}[${[...uFiles].join(',')}]` + (sinDef.length ? `  USADA SIN DEFINIR EN: ${sinDef.join(',')}` : '') + (defsNoUse ? '  DEFINIDA SIN USO' : '') + (valores.length > 1 && dFiles.size > 1 ? `  VALORES DISTINTOS: ${valores.join(' | ')}` : ''));
  }
}
out.push('total nombres: ' + names.size);

// ---- (2) ids pedidos vs definidos, por documento HTML (con sus scripts inline) ----
out.push('\n=== (2) ids pedidos que el documento nunca define (getElementById / querySelector("#x")) ===');
for (const f of html) {
  const s = read(f);
  const defsId = new Set();
  for (const m of s.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)) defsId.add(m[1]);
  for (const m of s.matchAll(/\.id\s*=\s*['"`]([^'"`$]+)['"`]/g)) defsId.add(m[1]);
  for (const m of s.matchAll(/setAttribute\(\s*['"]id['"]\s*,\s*['"`]([^'"`$]+)['"`]/g)) defsId.add(m[1]);
  for (const m of s.matchAll(/\bid\s*:\s*['"]([^'"]+)['"]/g)) defsId.add(m[1]); // objetos de config con id
  // ids dentro de plantillas innerHTML con interpolación: ya cubiertos por id=" ... " (regex 1)
  const pedidos = new Map();
  s.split('\n').forEach((ln, i) => {
    if (/^\s*(\/\/|\*)/.test(ln)) return;
    for (const m of ln.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)) { if (!pedidos.has(m[1])) pedidos.set(m[1], i + 1); }
    for (const m of ln.matchAll(/querySelector(?:All)?\(\s*['"]#([A-Za-z0-9_-]+)[^'"]*['"]\s*\)/g)) { if (!pedidos.has(m[1])) pedidos.set(m[1], i + 1); }
  });
  const faltan = [...pedidos].filter(([id]) => !defsId.has(id));
  out.push(`${f}: ids pedidos=${pedidos.size} definidos=${defsId.size} SIN DEFINIR=${faltan.length}` + (faltan.length ? '  ' + faltan.map(([id, l]) => id + '@' + l).join(' ') : ''));
}

// ---- (3) CustomEvent / dispatchEvent ----
out.push('\n=== (3) CustomEvent / dispatchEvent ===');
const evEmit = [], evListen = [];
for (const f of [...html, ...jsfiles]) {
  read(f).split('\n').forEach((ln, i) => {
    if (/^\s*(\/\/|\*)/.test(ln)) return;
    for (const m of ln.matchAll(/new\s+(?:Custom)?Event\(\s*['"]([^'"]+)['"]/g)) evEmit.push({ f, line: i + 1, ev: m[1] });
    for (const m of ln.matchAll(/addEventListener\(\s*['"]([^'"]+)['"]/g)) evListen.push({ f, line: i + 1, ev: m[1] });
  });
}
const DOM = new Set(['click', 'load', 'error', 'resize', 'message', 'keydown', 'keyup', 'scroll', 'touchstart', 'touchend', 'touchmove', 'touchcancel', 'pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'visibilitychange', 'pagehide', 'pageshow', 'beforeunload', 'unload', 'online', 'offline', 'DOMContentLoaded', 'orientationchange', 'popstate', 'hashchange', 'contextmenu', 'dragstart', 'change', 'input', 'focus', 'blur', 'submit', 'ended', 'play', 'pause', 'timeupdate', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'seeked', 'seeking', 'stalled', 'abort', 'unhandledrejection', 'controllerchange', 'deviceorientation', 'deviceorientationabsolute', 'wheel', 'animationend', 'transitionend', 'select', 'keypress', 'dblclick', 'drag', 'drop', 'dragover', 'dragend', 'dragenter', 'dragleave', 'copy', 'cut', 'paste', 'fullscreenchange', 'statechange', 'updatefound', 'readystatechange', 'invalid', 'toggle', 'close', 'cancel', 'gotpointercapture', 'lostpointercapture', 'selectstart', 'touchforcechange', 'devicemotion', 'storage', 'languagechange', 'beforeinstallprompt', 'appinstalled', 'fetch', 'install', 'activate', 'sync', 'push', 'notificationclick', 'securitypolicyviolation']);
const custom = {};
for (const e of evEmit) (custom[e.ev] ||= { emit: [], listen: [] }).emit.push(e.f + ':' + e.line);
for (const l of evListen) if (!DOM.has(l.ev)) (custom[l.ev] ||= { emit: [], listen: [] }).listen.push(l.f + ':' + l.line);
for (const [ev, v] of Object.entries(custom).sort()) {
  if (!v.emit.length && !v.listen.length) continue;
  out.push(`${ev.padEnd(34)} emite[${v.emit.join(' ')}]  escucha[${v.listen.join(' ')}]`);
}
fs.writeFileSync(salida('barrido-css-dom.txt'), out.join('\n'));
console.log(out.join('\n'));
