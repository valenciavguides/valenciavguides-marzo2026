'use strict';
/**
 * guia-fichas-mensaje.cjs — la tabla de cobertura por hijo (§10.7) y las fichas por mensaje de §10 frente al código (CLAUDE.md regla 8:
 * la guía se consulta siempre y no se cree nunca).
 *
 * §10 describe cada mensaje del bus dos veces: en una tabla resumen con una fila por mensaje y una columna por hijo (§10.7: ✅ el hijo
 * registra un handler de ese tipo, ❌ no lo registra, — no aplica) y en una ficha «Campo | Valor» por mensaje, con filas «Emitido por» y
 * «Handler en …». Este script las compara con lo que el código registra y emite (mensajes.json de `extract-mensajes.cjs`):
 *
 *   (1) §10.7, celda por celda: «la guía dice handler y el código no lo tiene» y «la guía dice ausente y el código lo tiene». Cuenta las
 *       discrepancias y sale con código 1 si hay alguna.
 *   (2) las fichas: para cada fila «Emitido por» / «Handler en …» imprime lo que dice la guía y, debajo, los frames que en el código
 *       registran handler del tipo de la ficha y los que lo emiten. No juzga: enseña los dos lados para leerlos juntos; lo que no cuadra
 *       se confirma leyendo el sitio del código.
 *
 * Requiere haber ejecutado antes `extract-mensajes.cjs`.
 */
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');

const rutaJson = salida('mensajes.json');
if (!fs.existsSync(rutaJson)) throw new Error('falta mensajes.json: ejecuta antes extract-mensajes.cjs');
const j = JSON.parse(fs.readFileSync(rutaJson, 'utf8'));
// ESTUDIO_GUIA apunta a otra copia de la guía (p. ej. la de un commit anterior, `git show <commit>:docs/GUIA-COMPLETA.md > copia.md`): sirve de control del instrumento.
const GUIA = process.env.ESTUDIO_GUIA ? path.resolve(process.env.ESTUDIO_GUIA) : path.join(ROOT, 'docs/GUIA-COMPLETA.md');
const guia = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);

const canon = (x) => x.canon || x.raw;
const validos = new Set(j.validos);
// El código escribe `TIPOS_MENSAJE.PARADAS.READY` y el valor que viaja es `VV:PARADAS:READY`: la guía usa los dos nombres.
const alias = new Map();
for (const r of [...j.recv, ...j.emit]) {
  const m = /^TIPOS_MENSAJE\w*\.(.+)$/.exec(r.raw || '');
  if (m && r.canon && m[1] !== r.canon) alias.set(m[1], r.canon);
}
const tiposTodos = [...new Set([...j.recv.map(canon), ...j.emit.map(canon)])];
const resolver = (tok) => tiposTodos.filter((t) => t === (alias.get(tok) || tok) || t.endsWith('.' + tok));
const corto = (rel) => ({
  'codigo-padre.html': 'padre', 'En-busca-del-tesoro.html': 'seleccion', 'extrainfo-hijo1.html': 'hijo1', 'coordenadas-hijo2.html': 'hijo2',
  'audio-hijo3.html': 'hijo3', 'retos-hijo4.html': 'hijo4', 'boton-casa-hijo5.html': 'hijo5', 'chat-hijo6.html': 'hijo6',
  'mapa-completo.html': 'mapa-completo', 'puzzle.html': 'puzzle', 'video-intro.html': 'video-intro',
}[rel] || rel);

// ───────────────────────── (1) §10.7
const HIJOS = ['extrainfo-hijo1.html', 'coordenadas-hijo2.html', 'audio-hijo3.html', 'retos-hijo4.html', 'boton-casa-hijo5.html', 'chat-hijo6.html'];
const ini107 = guia.findIndex((l) => l.startsWith('### 10.7 '));
if (ini107 < 0) throw new Error('no encuentro la sección 10.7');
const filas = [];
for (let i = ini107; i < guia.length && !guia[i].startsWith('**Leyenda**'); i++) {
  if (!guia[i].startsWith('|') || /^\|[-| ]+\|$/.test(guia[i]) || guia[i].startsWith('| Mensaje')) continue;
  const c = guia[i].split('|').slice(1, -1).map((s) => s.trim());
  filas.push({ nombre: c[0], celdas: c.slice(1), linea: i + 1 });
}
// «RETO.MOSTRAR/OCULTAR» son dos tipos: RETO.MOSTRAR y RETO.OCULTAR
const tiposDeFila = (nombre) => {
  const m = nombre.match(/^(.*\.)?([A-Z_]+)\/([A-Z_]+)$/);
  return m ? [(m[1] || '') + m[2], (m[1] || '') + m[3]] : [nombre];
};
let difs = 0;
console.log('## §10.7 — tabla de cobertura por hijo frente a los handlers del código');
for (const f of filas) {
  const casan = tiposTodos.filter((c) => tiposDeFila(f.nombre).some((b) => c === b || c.endsWith('.' + b)));
  // ✅ exige un handler de CADA tipo de la fila; ❌ y — exigen que no haya ninguno (— es «no aplica al rol de ese hijo»)
  const buscados = tiposDeFila(f.nombre);
  HIJOS.forEach((fr, k) => {
    const guiaDice = (f.celdas[k] || '?');
    const dice = guiaDice.startsWith('✅') ? 'SI' : guiaDice.startsWith('❌') ? 'NO' : guiaDice.startsWith('—') ? 'n/a' : '?';
    const tiene = (b) => j.recv.some((r) => r.rel === fr && (canon(r) === b || canon(r).endsWith('.' + b)));
    const todos = buscados.every(tiene);
    const alguno = buscados.some(tiene);
    let motivo = null;
    if (dice === 'SI' && !todos) motivo = alguno ? 'el código solo registra el handler de parte de los tipos de la fila' : 'el código NO registra el handler';
    else if ((dice === 'NO' || dice === 'n/a') && alguno) motivo = 'el código SÍ registra el handler';
    if (motivo) {
      difs++;
      console.log(`  L${f.linea} ${f.nombre}  hijo${k + 1}: la guía dice ${guiaDice}; ${motivo}`);
    }
  });
}
console.log(`  discrepancias: ${difs}`);

// ───────────────────────── (2) fichas
const ini10 = guia.findIndex((l) => /^## 10\. /.test(l));
const fin10 = guia.findIndex((l, i) => i > ini10 && /^## 11\. /.test(l));
if (ini10 < 0 || fin10 < 0) throw new Error('no encuentro los límites de la sección 10');
const reTok = /\b[A-Z][A-Z0-9_]+(?:\.[A-Z][A-Z0-9_]+)+\b|\b(?:HIJO|PADRE|CAMBIO|HEARTBEAT)[A-Z_]*\b/g;
let tipos = [];
let cabecera = '';
let nFilas = 0;
console.log('\n## Fichas de §10 — lo que dice cada fila «Emitido por» / «Handler en …» y lo que hace el código');
for (let i = ini10; i < fin10; i++) {
  const l = guia[i];
  if ((/^#{4,6} /.test(l) && !/^#{4,6} FASE/.test(l) && !/^#{4,6} \d/.test(l)) || /^\*\*[A-Z]/.test(l)) { tipos = l.match(reTok) || []; cabecera = l; continue; }
  const m = l.match(/^\| (Handler en [^|]+|Handler|Emitido por[^|]*) \| (.*) \|$/);
  if (!m) continue;
  nFilas++;
  const canones = [...new Set(tipos.flatMap(resolver))];
  const rec = [...new Set(j.recv.filter((r) => canones.includes(canon(r))).map((r) => corto(r.rel)))].sort();
  const emi = [...new Set(j.emit.filter((r) => canones.includes(canon(r))).map((r) => corto(r.rel)))].sort();
  console.log(`L${i + 1} ${cabecera.replace(/\*\*/g, '').slice(0, 70)}`);
  console.log(`    guía   [${m[1].trim()}]: ${m[2].slice(0, 170)}`);
  console.log(`    código → tipos: ${canones.join(', ') || '(ninguno resuelto)'}`);
  console.log(`             handlers en: ${rec.join(', ') || '-'}   |   emisores: ${emi.join(', ') || '-'}`);
}
console.log(`\n${nFilas} filas de fichas mostradas; §10.7: ${difs} discrepancias`);
process.exit(difs ? 1 : 0);
