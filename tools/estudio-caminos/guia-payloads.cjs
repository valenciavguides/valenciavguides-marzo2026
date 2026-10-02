'use strict';
/**
 * guia-payloads.cjs — las claves de payload que la guía da por enviadas, frente a las que los emisores del código ponen en `datos`
 * (CLAUDE.md regla 8: la guía se consulta siempre y no se cree nunca).
 *
 * La guía da el payload de cada mensaje en tres sitios: las tablas «Mensajes que envía al padre» de §7, las tablas de mensajes enviados
 * y recibidos por cada frame de §8 y la fila «Payload» de cada ficha de §10. De cada celda toma las claves de primer nivel de `{ … }` y
 * comprueba que algún emisor del código las manda:
 *
 *   §7 y §8, mensajes ENVIADOS por el frame   → contra los emisores de ese frame (y los módulos que carga);
 *   §8, mensajes RECIBIDOS del padre          → contra los emisores del padre (`codigo-padre.html` y sus módulos);
 *   §10, fichas                                → contra todos los emisores del tipo, de cualquier frame.
 *
 * Lista las claves que la guía nombra y NINGÚN emisor manda («la guía dice… y el código manda…»). Marca «incierto: emisor opaco» cuando
 * algún emisor construye `datos` fuera del literal (variable, spread): ahí la ausencia no está demostrada y se confirma leyendo el sitio.
 * Lo contrario —claves que el código manda y la guía no nombra— no se lista: la guía da el payload «clave» o «relevante», no el entero.
 *
 * Requiere haber ejecutado antes `extract-mensajes.cjs` y `extract-payload.cjs`.
 */
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');

for (const f of ['mensajes.json', 'payload.json']) if (!fs.existsSync(salida(f))) throw new Error(`falta ${f}: ejecuta antes extract-mensajes.cjs y extract-payload.cjs`);
const M = JSON.parse(fs.readFileSync(salida('mensajes.json'), 'utf8'));
const P = JSON.parse(fs.readFileSync(salida('payload.json'), 'utf8')).emisores;
const validos = new Set(M.validos);
// ESTUDIO_GUIA apunta a otra copia de la guía (p. ej. la de un commit anterior, `git show <commit>:docs/GUIA-COMPLETA.md > copia.md`): sirve de control del instrumento.
const GUIA = process.env.ESTUDIO_GUIA ? path.resolve(process.env.ESTUDIO_GUIA) : path.join(ROOT, 'docs/GUIA-COMPLETA.md');
const g = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);

const COMPARTIDOS = ['js/utils.js'];
const FRAMES = [
  ['selección', /^### 7\.1 /, /^### 8\.4 /, ['En-busca-del-tesoro.html', ...COMPARTIDOS]],
  ['hijo1', /^### 7\.2 /, /^### 8\.5 /, ['extrainfo-hijo1.html', ...COMPARTIDOS, 'js/monitoreo.js']],
  ['hijo2', /^### 7\.3 /, /^### 8\.6 /, ['coordenadas-hijo2.html', ...COMPARTIDOS]],
  ['hijo3', /^### 7\.4 /, /^### 8\.7 /, ['audio-hijo3.html', ...COMPARTIDOS]],
  ['hijo4', /^### 7\.5 /, /^### 8\.8 /, ['retos-hijo4.html', ...COMPARTIDOS]],
  ['hijo5', /^### 7\.6 /, /^### 8\.9 /, ['boton-casa-hijo5.html', ...COMPARTIDOS, 'js/monitoreo.js']],
  ['hijo6', /^### 7\.7 /, /^### 8\.10 /, ['chat-hijo6.html', ...COMPARTIDOS]],
];
const FICHEROS_PADRE = ['codigo-padre.html', 'js/app.js', 'js/funciones-mapa.js', 'js/controladores-padre.js', 'js/mensajeria.js', 'js/state-manager.js', 'js/utils.js'];

// El código escribe `TIPOS_MENSAJE.PARADAS.READY` y el valor que viaja es `VV:PARADAS:READY`: la guía usa los dos nombres.
const alias = new Map();
for (const r of [...M.recv, ...M.emit]) {
  const m = /^TIPOS_MENSAJE\w*\.(.+)$/.exec(r.raw || '');
  if (m && r.canon && m[1] !== r.canon) alias.set(m[1], r.canon);
}
const idx = (re) => g.findIndex((l) => re.test(l));
const fin = (i) => { const n = g[i].match(/^#+/)[0].length; for (let k = i + 1; k < g.length; k++) { const m = g[k].match(/^(#+) /); if (m && m[1].length <= n) return k; } return g.length; };
const celdas = (l) => l.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
function tablas(d, h) {
  const out = [];
  let k = d;
  while (k < h) {
    if (g[k].startsWith('|')) {
      let et = '';
      for (let p = k - 1; p >= d; p--) if (g[p].trim()) { et = g[p].trim(); break; }
      const filas = [];
      const lineas = [];
      while (k < h && g[k].startsWith('|')) {
        const c = celdas(g[k]);
        if (!c.every((x) => /^:?-+:?$/.test(x))) { filas.push(c); lineas.push(k + 1); }
        k++;
      }
      out.push({ et, cab: filas[0] || [], filas: filas.slice(1), lineas: lineas.slice(1) });
    } else k++;
  }
  return out;
}
// `SISTEMA.CAMBIO_MODO_ENTENDIDO/EFECTUADO` y `RETO.MOSTRAR/OCULTAR` son dos tipos: el segundo sustituye lo último del primero.
const expandir = (primero, resto) => {
  const punto = primero.lastIndexOf('.') + 1;
  const guion = primero.lastIndexOf('_');
  const cands = [primero.slice(0, punto) + resto];
  if (guion >= punto) cands.unshift(primero.slice(0, guion + 1) + resto);
  return cands.find((c) => validos.has(c)) || cands[0];
};
const tiposDe = (celda) => [...celda.matchAll(/`([^`]+)`/g)].flatMap((m) => {
  const p = m[1].split('/').map((x) => x.trim());
  return p.map((x, k) => (k > 0 && !x.includes('.') ? expandir(p[0], x) : x));
}).map((t) => alias.get(t) || t).filter((t) => validos.has(t));
// claves de primer nivel del primer `{ … }` de una celda (`{ a, b: x, c? }`); null si la celda no lleva ninguno
function clavesDe(celda) {
  const a = celda.indexOf('{');
  if (a < 0) return null;
  let d = 0;
  let b = -1;
  for (let i = a; i < celda.length; i++) {
    const c = celda[i];
    if (c === '{' || c === '[' || c === '(') d++;
    else if (c === '}' || c === ']' || c === ')') { d--; if (d === 0) { b = i; break; } }
  }
  if (b < 0) return null;
  const partes = [];
  let cur = '';
  let q = null;
  d = 0;
  for (const c of celda.slice(a + 1, b)) {
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; cur += c; continue; }
    if (c === '{' || c === '[' || c === '(') d++;
    else if (c === '}' || c === ']' || c === ')') d--;
    if (c === ',' && d === 0) { partes.push(cur); cur = ''; } else cur += c;
  }
  if (cur.trim()) partes.push(cur);
  const keys = [];
  for (const p of partes) {
    const t = p.trim().replace(/^`/, '');
    if (t.startsWith('...') || t === '') continue;
    const m = /^([A-Za-z_$][\w$]*)\s*\??\s*(:|$)/.exec(t);
    if (m) keys.push(m[1]);
  }
  return keys;
}

let avisos = 0;
let filasMiradas = 0;
function comprobar(ctx, linea, tipos, keys, emisoresDe) {
  if (!keys || !keys.length) return;
  for (const t of tipos) {
    const E = emisoresDe(t);
    filasMiradas++;
    if (!E.length) { console.log(`L${linea} ${ctx} ${t}: ningún emisor en el código (claves de la guía: ${keys.join(', ')})`); avisos++; continue; }
    const opaco = E.some((e) => e.opaque || e.spread);
    const enviadas = new Set(E.flatMap((e) => e.keys));
    const sobran = keys.filter((k) => !enviadas.has(k));
    if (sobran.length) {
      console.log(`L${linea} ${ctx} ${t}: la guía nombra [${sobran.join(', ')}] y ningún emisor las manda${opaco ? ' (incierto: emisor opaco)' : ''} | el código manda: [${[...enviadas].join(', ')}]`);
      avisos++;
    }
  }
}

console.log('## §7 y §8 — mensajes ENVIADOS por cada frame');
for (const [nombre, re7, re8, ficheros] of FRAMES) {
  const emisoresDe = (t) => (P[t] || []).filter((e) => ficheros.includes(e.rel));
  for (const re of [re7, re8]) {
    const i = idx(re);
    if (i < 0) { console.log(`✗ no encuentro la sección de ${nombre}`); avisos++; continue; }
    for (const t of tablas(i + 1, fin(i))) {
      const porDireccion = /^direcci/i.test(t.cab[0] || '');
      if (!porDireccion && !/env[ií]a|enviad/i.test(t.et)) continue;
      const colPayload = t.cab.findIndex((c) => /payload/i.test(c));
      if (colPayload < 0) continue;
      t.filas.forEach((f, k) => {
        if (porDireccion && !/→\s*padre/.test(f[0] || '')) return;
        comprobar(`[${nombre}]`, t.lineas[k], tiposDe(f[porDireccion ? 1 : 0] || ''), clavesDe(f[colPayload] || ''), emisoresDe);
      });
    }
  }
}
console.log('\n## §8 — mensajes RECIBIDOS del padre');
const emisoresPadre = (t) => (P[t] || []).filter((e) => FICHEROS_PADRE.includes(e.rel));
for (const [nombre, , re8] of FRAMES) {
  const i = idx(re8);
  if (i < 0) continue;
  for (const t of tablas(i + 1, fin(i))) {
    const porDireccion = /^direcci/i.test(t.cab[0] || '');
    if (!porDireccion && !/recibe|recibid/i.test(t.et)) continue;
    const colPayload = t.cab.findIndex((c) => /payload/i.test(c));
    if (colPayload < 0) continue;
    t.filas.forEach((f, k) => {
      if (porDireccion && !/padre\s*→/.test(f[0] || '')) return;
      comprobar(`[${nombre} recibe]`, t.lineas[k], tiposDe(f[porDireccion ? 1 : 0] || ''), clavesDe(f[colPayload] || ''), emisoresPadre);
    });
  }
}
console.log('\n## §10 — filas «Payload» de las fichas');
const i10 = idx(/^## 10\. /);
const f10 = idx(/^## 11\. /);
let tiposFicha = [];
for (let i = i10; i < f10; i++) {
  const l = g[i];
  if ((/^#{4,6} /.test(l) && !/^#{4,6} FASE/.test(l) && !/^#{4,6} \d/.test(l)) || /^\*\*[A-Z]/.test(l)) {
    tiposFicha = [...l.matchAll(/\b[A-Z][A-Z0-9_]+(?:\.[A-Z][A-Z0-9_]+)+\b/g)].map((m) => alias.get(m[0]) || m[0]).filter((t) => validos.has(t));
    continue;
  }
  const m = l.match(/^\| (Payload(?: [^|]*)?) \| (.*) \|$/);
  if (m) comprobar('[§10 ficha]', i + 1, tiposFicha, clavesDe(m[2]), (t) => P[t] || []);
}
console.log(`\nfilas comprobadas: ${filasMiradas}; con claves de la guía que ningún emisor manda: ${avisos}`);
