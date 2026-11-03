'use strict';
/**
 * guia-handlers-por-frame.cjs — barrido de la guía contra el código, por clase de afirmación (CLAUDE.md regla 8: la guía se consulta
 * siempre y no se cree nunca).
 *
 * La guía describe, frame por frame, qué tipos de mensaje atiende y cuáles manda cada uno, en tres sitios: la sección del frame en §7, su
 * tabla de mensajería en §8 y el catálogo de controladores de §26.12. Para cada frame, este script compara con lo que el código registra
 * (handlers) y emite en ese frame:
 *
 *   (1) filas de las tablas de §26.12 (handlers y «Mensajes salientes») que el código NO respalda: tipos que la guía da como atendidos o
 *       enviados por el frame y el código no registra ni emite en él — descripciones de algo que no existe;
 *   (1b) lo mismo con las tablas del frame en §7 («Controladores que registra», «Mensajes que envía…») y en §8 («Mensajes que X envía» y
 *       «recibe», o las que llevan una columna «Dirección»: `→ padre` = lo manda el frame, `padre →` = lo atiende);
 *   (2) tipos que el código registra o emite en el frame y que NINGUNA de las tres secciones menciona (entre backticks) — lo que la guía
 *       no cuenta. Los tipos transversales (error, NACK, latido, protocolo de modo, notificación) se separan: la guía los documenta
 *       aparte (§10.5, §10.11, §10.15, §10.16, §26.6).
 *
 * Requiere haber ejecutado antes `extract-mensajes.cjs` (deja mensajes.json en la carpeta de salida). Lo que lista es un candidato: se
 * confirma leyendo la fila y el sitio del código. Imprime su residuo (secciones que no se localizan).
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

// El bus (js/mensajeria.js) lo carga todo frame pero el latido (SISTEMA.HEARTBEAT) solo lo manda el padre: no se atribuye a los hijos.
const COMPARTIDOS_HIJOS = ['js/utils.js'];
const TRANSVERSALES = new Set(['SISTEMA.ERROR', 'SISTEMA.NACK', 'SISTEMA.HEARTBEAT', 'SISTEMA.HEARTBEAT_RESPONSE', 'SISTEMA.CAMBIO_MODO_APLICADO', 'SISTEMA.NOTIFICACION', 'SISTEMA.CONFIRMACION']);
const FRAMES = [
  { clave: 'padre', s26: /^#### 26\.12\.1 /, salientes: /^#### 26\.12\.2 /, ficheros: ['codigo-padre.html', 'js/app.js', 'js/funciones-mapa.js', 'js/controladores-padre.js', 'js/mensajeria.js', 'js/state-manager.js', 'js/utils.js'] },
  { clave: 'selección', s7: /^### 7\.1 /, s8: /^### 8\.4 /, s26: /^#### 26\.12\.3 /, ficheros: ['En-busca-del-tesoro.html', ...COMPARTIDOS_HIJOS] },
  { clave: 'hijo1', s7: /^### 7\.2 /, s8: /^### 8\.5 /, s26: /^#### 26\.12\.4 /, ficheros: ['extrainfo-hijo1.html', ...COMPARTIDOS_HIJOS] },
  { clave: 'hijo2', s7: /^### 7\.3 /, s8: /^### 8\.6 /, s26: /^#### 26\.12\.5 /, ficheros: ['coordenadas-hijo2.html', ...COMPARTIDOS_HIJOS] },
  { clave: 'hijo3', s7: /^### 7\.4 /, s8: /^### 8\.7 /, s26: /^#### 26\.12\.6 /, ficheros: ['audio-hijo3.html', ...COMPARTIDOS_HIJOS] },
  { clave: 'hijo4', s7: /^### 7\.5 /, s8: /^### 8\.8 /, s26: /^#### 26\.12\.7 /, ficheros: ['retos-hijo4.html', ...COMPARTIDOS_HIJOS] },
  { clave: 'hijo5', s7: /^### 7\.6 /, s8: /^### 8\.9 /, s26: /^#### 26\.12\.8 /, ficheros: ['boton-casa-hijo5.html', ...COMPARTIDOS_HIJOS] },
  { clave: 'hijo6', s7: /^### 7\.7 /, s8: /^### 8\.10 /, s26: /^#### 26\.12\.9 /, ficheros: ['chat-hijo6.html', ...COMPARTIDOS_HIJOS] },
];

// Un tipo es `CATEGORIA.NOMBRE` (o con `:`), salvo los que no llevan categoría: esos solo cuentan si el
// código los declara como válidos, para que cualquier palabra en mayúsculas entre comillas no pase por tipo.
const validos = new Set(Array.isArray(j.validos) ? j.validos : Object.keys(j.validos || {}));
const reTipoConCategoria = /^[A-Z][A-Z0-9_]*([.:][A-Z0-9_]+)+$/;
const reTipo = { test: (t) => reTipoConCategoria.test(t) || validos.has(t) };
// El código escribe `TIPOS_MENSAJE.PARADAS.READY` y el valor que viaja es `VV:PARADAS:READY`: la guía usa los dos nombres.
const alias = new Map();
for (const r of [...j.recv, ...j.emit]) {
  const m = /^TIPOS_MENSAJE\w*\.(.+)$/.exec(r.raw || '');
  if (m && r.canon && m[1] !== r.canon) alias.set(m[1], r.canon);
}
// `RETO.MOSTRAR/OCULTAR` y `SISTEMA.CAMBIO_MODO_ENTENDIDO/EFECTUADO` son dos tipos cada uno: el segundo sustituye lo último del primero
// (el nombre entero si no lleva `_`, el último trozo si lo lleva); vale el candidato que el código declara válido.
const expandir = (primero, resto) => {
  const punto = primero.lastIndexOf('.') + 1;
  const guion = primero.lastIndexOf('_');
  const candidatos = [primero.slice(0, punto) + resto];
  if (guion >= punto) candidatos.unshift(primero.slice(0, guion + 1) + resto);
  return candidatos.find((c) => validos.has(c)) || candidatos[0];
};
const tiposDeCelda = (celda) => [...celda.matchAll(/`([^`]+)`/g)].flatMap((m) => {
  const partes = m[1].split('/').map((p) => p.trim());
  return partes.map((p, k) => (k > 0 && !p.includes('.') ? expandir(partes[0], p) : p));
}).map((t) => alias.get(t) || t).filter((t) => reTipo.test(t));
const idx = (re) => guia.findIndex((l) => re.test(l));
const fin = (i) => { // siguiente encabezado del mismo nivel o superior
  const nivel = guia[i].match(/^#+/)[0].length;
  for (let k = i + 1; k < guia.length; k++) { const m = guia[k].match(/^(#+) /); if (m && m[1].length <= nivel) return k; }
  return guia.length;
};
function tablas(desde, hasta) {
  const out = [];
  let k = desde;
  while (k < hasta) {
    if (guia[k].startsWith('|')) {
      let etiqueta = '';
      for (let p = k - 1; p >= desde; p--) { if (guia[p].trim()) { etiqueta = guia[p].trim(); break; } }
      const filas = [];
      while (k < hasta && guia[k].startsWith('|')) {
        const celdas = guia[k].split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
        if (!celdas.every((c) => /^:?-+:?$/.test(c))) filas.push(celdas);
        k++;
      }
      out.push({ etiqueta, cab: filas[0] || [], filas: filas.slice(1) });
    } else k++;
  }
  return out;
}
// todos los tipos entre backticks de un rango de la guía
function tiposEnRango(re) {
  const i = idx(re);
  if (i < 0) return null;
  const tipos = new Set();
  for (let k = i; k < fin(i); k++) for (const m of guia[k].matchAll(/`([^`]+)`/g)) { const t = m[1].trim(); if (reTipo.test(t)) tipos.add(t); }
  return tipos;
}

let candidatos1 = 0, candidatos1b = 0, candidatos2 = 0, residuo = 0;
for (const f of FRAMES) {
  const reg = new Set(j.recv.filter((r) => f.ficheros.includes(r.rel) && r.canon).map((r) => r.canon));
  const emi = new Set(j.emit.filter((r) => f.ficheros.includes(r.rel) && r.canon).map((r) => r.canon));

  // (1) tablas de §26.12
  const i26 = idx(f.s26);
  if (i26 < 0) { console.log(`✗ no encuentro la sección §26.12 de ${f.clave}`); residuo++; continue; }
  const ts = tablas(i26 + 1, fin(i26));
  const tHandlers = ts[0];
  let tEmitidos = ts.find((t) => /salientes/i.test(t.etiqueta));
  if (f.salientes) { const s = idx(f.salientes); if (s >= 0) tEmitidos = tablas(s + 1, fin(s))[0]; }
  const docH = new Set(), docE = new Set();
  for (const fila of (tHandlers ? tHandlers.filas : [])) for (const t of tiposDeCelda(fila[0] || '')) docH.add(t);
  for (const fila of (tEmitidos ? tEmitidos.filas : [])) for (const t of tiposDeCelda(fila[0] || '')) docE.add(t);
  const sinRespaldoH = [...docH].filter((t) => !reg.has(t)).sort();
  const sinRespaldoE = [...docE].filter((t) => !emi.has(t)).sort();

  // (1b) las tablas del frame en §7 («Controladores que registra», «Mensajes que envía…») y en §8 («Mensajes que X envía/recibe…», o
  // tablas con columna «Dirección»: `→ padre` = lo manda el frame, `padre →` = lo atiende): las mismas filas sin respaldo (el padre
  // no tiene sección propia en §7/§8).
  const docH78 = new Set(), docE78 = new Set();
  for (const re of [f.s7, f.s8]) {
    const i = re ? idx(re) : -1;
    if (i < 0) continue;
    for (const t of tablas(i + 1, fin(i))) {
      const porDireccion = /^direcci/i.test(t.cab[0] || '');
      for (const fila of t.filas) {
        if (porDireccion) {
          const dir = fila[0] || '';
          if (/→\s*padre/.test(dir)) for (const x of tiposDeCelda(fila[1] || '')) docE78.add(x);
          else if (/padre\s*→/.test(dir)) for (const x of tiposDeCelda(fila[1] || '')) docH78.add(x);
        } else if (/Controladores que registra|recibe|recibid/i.test(t.etiqueta)) {
          for (const x of tiposDeCelda(fila[0] || '')) docH78.add(x);
        } else if (/env[ií]a|enviad/i.test(t.etiqueta)) {
          for (const x of tiposDeCelda(fila[0] || '')) docE78.add(x);
        }
      }
    }
  }
  const sinRespaldoH78 = [...docH78].filter((t) => !reg.has(t)).sort();
  const sinRespaldoE78 = [...docE78].filter((t) => !emi.has(t)).sort();

  // (2) lo que el código tiene y ninguna de las secciones del frame menciona (el padre no tiene sección propia en §7/§8)
  const rangos = [f.s7, f.s8, f.s26].filter(Boolean).map(tiposEnRango);
  if (rangos.some((r) => r === null)) { console.log(`✗ no encuentro alguna de las secciones de ${f.clave}`); residuo++; continue; }
  const mencionados = new Set(rangos.flatMap((r) => [...r]));
  if (f.salientes) for (const t of docE) mencionados.add(t);
  const noContados = [...new Set([...reg, ...emi])].filter((t) => !mencionados.has(t)).sort();
  const transversales = noContados.filter((t) => TRANSVERSALES.has(t));
  const propios = noContados.filter((t) => !TRANSVERSALES.has(t));

  console.log(`\n## ${f.clave}  (código: ${reg.size} handlers, ${emi.size} tipos emitidos | §26.12 de la guía: ${docH.size} handlers, ${docE.size} salientes)`);
  if (sinRespaldoH.length) { console.log(`  (1) §26.12 da como handlers y el código no registra en este frame (${sinRespaldoH.length}): ${sinRespaldoH.join(', ')}`); candidatos1 += sinRespaldoH.length; }
  if (sinRespaldoE.length) { console.log(`  (1) §26.12 da como salientes y el código no emite en este frame (${sinRespaldoE.length}): ${sinRespaldoE.join(', ')}`); candidatos1 += sinRespaldoE.length; }
  if (sinRespaldoH78.length) { console.log(`  (1b) §7/§8 dan como atendidos y el código no registra en este frame (${sinRespaldoH78.length}): ${sinRespaldoH78.join(', ')}`); candidatos1b += sinRespaldoH78.length; }
  if (sinRespaldoE78.length) { console.log(`  (1b) §7/§8 dan como enviados y el código no emite en este frame (${sinRespaldoE78.length}): ${sinRespaldoE78.join(', ')}`); candidatos1b += sinRespaldoE78.length; }
  if (propios.length) { console.log(`  (2) en el código y en ninguna de las secciones del frame (${propios.length}): ${propios.join(', ')}`); candidatos2 += propios.length; }
  if (transversales.length) console.log(`      transversales (documentados aparte): ${transversales.join(', ')}`);
}
console.log(`\n(1) filas de §26.12 sin respaldo en el código: ${candidatos1}; (1b) filas de §7/§8 sin respaldo: ${candidatos1b}; (2) tipos del código que la guía no cuenta en el frame: ${candidatos2}; secciones sin resolver (residuo): ${residuo}`);
