// Identificadores sueltos sin resolver en sw.js (contexto de service worker) y en js/vendor? no: solo sw.js.
const fs = require('fs'); const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn')); const escope = require(path.join(ROOT, 'node_modules/eslint-scope'));
const src = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8').replace(/\r\n/g, '\n');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script', locations: true, ranges: true });
const sm = escope.analyze(ast, { ecmaVersion: 2022, sourceType: 'script' });
const SW = new Set('self caches clients fetch skipWaiting registration Response Request Headers URL URLSearchParams Promise console setTimeout clearTimeout setInterval clearInterval importScripts location indexedDB addEventListener removeEventListener postMessage Cache CacheStorage Client Clients ExtendableEvent FetchEvent Event MessageEvent AbortController TextEncoder TextDecoder Blob FormData BroadcastChannel navigator performance crypto atob btoa structuredClone queueMicrotask Object Array String Number Boolean Math Date JSON Error TypeError Map Set WeakMap Symbol RegExp Intl parseInt parseFloat isNaN encodeURIComponent decodeURIComponent undefined NaN Infinity globalThis'.split(' '));
const out = {};
for (const r of sm.globalScope.through) { const n = r.identifier.name; if (SW.has(n)) continue; (out[n] ||= []).push(r.identifier.loc.start.line); }
console.log('sueltos sin resolver en sw.js (excluidos los builtins de SW):', JSON.stringify(out));
console.log('declarados top-level:', sm.globalScope.variables.map(v => v.name).join(', '));
