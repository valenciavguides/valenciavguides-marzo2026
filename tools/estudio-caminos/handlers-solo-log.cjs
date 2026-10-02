'use strict';
/**
 * handlers-solo-log.cjs — handlers del bus cuyo cuerpo no hace nada más que escribir en el log.
 *
 * Es la clase «registros que dicen más de lo que hacen» de K-40 aplicada a los mensajes: un tipo que sí tiene emisor y sí tiene
 * receptor, pero cuyo receptor solo loguea. Para cada registro de handler que `extract-mensajes.cjs` resolvió (mensajes.json), localiza
 * la función (en línea, o por su nombre en el mismo fichero) y analiza su cuerpo con acorn:
 *
 *   · «solo log»  — ninguna llamada que no sea de log, ninguna asignación a algo que no sea local, ningún `return` con valor;
 *   · «solo log y devuelve valor» — igual, pero devuelve algo: el valor viaja en el acuse del bus, así que puede importar.
 *
 * Lo que lista es un candidato: una llamada a una función que no hace nada cuenta como efecto (falso negativo), y un handler cuyo único
 * efecto es no estar registrado (el bus avisa «sin handler» si falta) cuenta como solo-log. Se confirma leyendo el handler.
 * Requiere haber ejecutado antes `extract-mensajes.cjs`. Imprime su residuo (handlers cuya función no se localizó).
 */
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));

const j = JSON.parse(fs.readFileSync(salida('mensajes.json'), 'utf8'));

function bloques(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const out = [];
  const limpio = src.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '));
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(limpio)) !== null) {
    if (/\bsrc\s*=/.test(m[1] || '')) continue;
    const off = limpio.slice(0, m.index + m[0].indexOf('>') + 1).split('\n').length - 1;
    out.push({ code: m[2], off });
  }
  return out;
}
function parsear(code) {
  for (const st of ['module', 'script']) {
    try { return acorn.parse(code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowHashBang: true }); } catch (_) { /* siguiente */ }
  }
  return null;
}
function recorrer(n, f, padres = []) {
  if (!n || typeof n.type !== 'string') return;
  f(n, padres);
  const np = padres.concat(n);
  for (const k of Object.keys(n)) {
    if (k === 'type' || k === 'loc' || k === 'start' || k === 'end') continue;
    const v = n[k];
    if (Array.isArray(v)) v.forEach((x) => recorrer(x, f, np)); else if (v && typeof v.type === 'string') recorrer(v, f, np);
  }
}
const nombreLlamada = (callee) => {
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression') {
    const o = nombreLlamada(callee.object);
    const p = callee.computed ? '[]' : callee.property.name;
    return o ? o + '.' + p : p;
  }
  if (callee.type === 'LogicalExpression') return nombreLlamada(callee.left);
  if (callee.type === 'ParenthesizedExpression') return nombreLlamada(callee.expression);
  return null;
};
// (globalThis.logger || console).info(...) → callee.object es un LogicalExpression con `console`
const esLog = (callee) => {
  if (callee.type !== 'MemberExpression') return false;
  const o = callee.object;
  if (o.type === 'Identifier') return ['logger', 'console', '_log', 'loggerIframe'].includes(o.name);
  if (o.type === 'LogicalExpression') return [o.left, o.right].some((x) => x.type === 'Identifier' && x.name === 'console');
  if (o.type === 'MemberExpression' && !o.computed) return o.property.name === 'logger'; // globalThis.logger.x(
  return false;
};

function analizarFuncion(fn) {
  const locales = new Set();
  const efectos = [];
  let devuelveValor = false;
  recorrer(fn.params ? { type: 'Program', body: [], params: fn.params } : fn, () => {});
  const marcarLocales = (p) => { recorrer(p, (n) => { if (n.type === 'Identifier') locales.add(n.name); }); };
  (fn.params || []).forEach(marcarLocales);
  recorrer(fn.body, (n) => {
    if (n.type === 'VariableDeclarator') marcarLocales(n.id);
    if (n.type === 'CatchClause' && n.param) marcarLocales(n.param);
  });
  recorrer(fn.body, (n, padres) => {
    // no se entra en funciones anidadas: sus efectos no son del cuerpo del handler... salvo que se llamen; se tratan como efecto si se pasan a algo
    const dentroDeAnidada = padres.some((p) => p !== fn && /Function/.test(p.type));
    if (dentroDeAnidada) return;
    if (n.type === 'CallExpression') {
      if (!esLog(n.callee)) efectos.push(`llama a ${nombreLlamada(n.callee) || '<expresión>'}()`);
    } else if (n.type === 'NewExpression') {
      efectos.push('new ' + (n.callee.name || '<expresión>'));
    } else if (n.type === 'AssignmentExpression' || n.type === 'UpdateExpression') {
      const t = n.type === 'AssignmentExpression' ? n.left : n.argument;
      const raiz = (x) => (x.type === 'MemberExpression' ? raiz(x.object) : x);
      const r = raiz(t);
      if (!(t.type === 'Identifier' && locales.has(t.name)) && !(r.type === 'Identifier' && locales.has(r.name) && t.type !== 'Identifier')) efectos.push('asigna ' + (nombreLlamada(t) || '<destino>'));
    } else if (n.type === 'ReturnStatement' && n.argument) {
      const a = n.argument;
      if (!(a.type === 'Literal' && (a.value === undefined || a.value === null))) devuelveValor = true;
    } else if (n.type === 'ThrowStatement') {
      efectos.push('lanza');
    } else if (n.type === 'AwaitExpression' && n.argument.type !== 'CallExpression') {
      /* await de un valor: sin efecto */
    }
  });
  return { efectos, devuelveValor };
}

const cache = new Map(); // rel -> { ast por bloque, funciones por nombre }
function cargar(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  const info = { asts: [], funciones: new Map() };
  for (const b of bloques(rel, src)) {
    const ast = parsear(b.code);
    if (!ast) continue;
    info.asts.push({ ast, off: b.off });
    recorrer(ast, (n) => {
      if (n.type === 'FunctionDeclaration' && n.id) info.funciones.set(n.id.name, n);
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init && /Function/.test(n.init.type)) info.funciones.set(n.id.name, n.init);
    });
  }
  cache.set(rel, info);
  return info;
}

const soloLog = [], soloLogValor = [], residuo = [];
let analizados = 0;
for (const r of j.recv) {
  if (!r.canon) continue;
  const info = cargar(r.rel);
  let llamada = null;
  for (const { ast, off } of info.asts) {
    recorrer(ast, (n) => {
      if (llamada || n.type !== 'CallExpression') return;
      if (n.loc.start.line + off !== r.line) return;
      if (nombreLlamada(n.callee) && nombreLlamada(n.callee).split('.').pop() === r.callee) llamada = n;
    });
    if (llamada) break;
  }
  if (!llamada) { residuo.push(`${r.rel}:${r.line} ${r.canon} (llamada no localizada)`); continue; }
  const arg = llamada.arguments[1];
  let fn = null;
  if (arg && /Function/.test(arg.type)) fn = arg;
  else if (arg && arg.type === 'Identifier') fn = info.funciones.get(arg.name) || null;
  if (!fn) { residuo.push(`${r.rel}:${r.line} ${r.canon} (función no localizada: ${arg ? arg.type + (arg.name ? ' ' + arg.name : '') : 'sin argumento'})`); continue; }
  analizados++;
  const { efectos, devuelveValor } = analizarFuncion(fn);
  if (efectos.length === 0) (devuelveValor ? soloLogValor : soloLog).push(`${r.canon.padEnd(44)} ${r.rel}:${r.line}`);
}
console.log(`handlers analizados: ${analizados} de ${j.recv.filter((r) => r.canon).length}; residuo: ${residuo.length}`);
console.log(`\n=== SOLO LOG (${soloLog.length}) ===`);
soloLog.sort().forEach((x) => console.log('  ' + x));
console.log(`\n=== SOLO LOG, PERO DEVUELVE UN VALOR (viaja en el acuse) (${soloLogValor.length}) ===`);
soloLogValor.sort().forEach((x) => console.log('  ' + x));
console.log(`\n=== RESIDUO (${residuo.length}) ===`);
residuo.forEach((x) => console.log('  ' + x));
