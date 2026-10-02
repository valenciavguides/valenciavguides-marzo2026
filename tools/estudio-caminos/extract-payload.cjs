// Contrato de carga útil por tipo de mensaje: claves que los emisores ponen en `datos` frente a claves que los handlers leen de `mensaje.datos`.
// Marca como INCIERTO todo lo que no se puede resolver de forma estática (emisor con `datos` no literal / spread, handler que pasa `datos` entero a otra función).
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS_FICHEROS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js','js/indice-aventuras.js']);
function listFiles() { const out = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') out.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS_FICHEROS.has('js/' + f)) out.push('js/' + f); return out; }
function extractBlocks(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, lineOffset: 0 }];
  const blocks = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const attrs = m[1] || ''; if (/\bsrc\s*=/.test(attrs)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(attrs); const type = t ? t[1].toLowerCase() : ''; if (type && type !== 'module' && type !== 'text/javascript' && type !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; blocks.push({ code: src.slice(cs, cs + m[2].length), lineOffset: src.slice(0, cs).split('\n').length - 1 }); }
  return blocks;
}
function walk(node, visit, parents) { if (!node || typeof node.type !== 'string') return; visit(node, parents); const np = parents.concat(node); for (const k of Object.keys(node)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const v = node[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, visit, np)); else if (v && typeof v.type === 'string') walk(v, visit, np); } }
function pathOf(n) { if (!n) return null; if (n.type === 'Identifier') return [n.name]; if (n.type === 'MemberExpression' && !n.computed) { const o = pathOf(n.object); if (!o) return null; if (o.length === 1 && (o[0] === 'globalThis' || o[0] === 'window')) return [n.property.name]; return o.concat(n.property.name); } if (n.type === 'ChainExpression') return pathOf(n.expression); return null; }
function calleeText(c) { const p = pathOf(c); return p ? p.join('.') : (c.type === 'ChainExpression' ? calleeText(c.expression) : '<expr>'); }
const unwrap = n => { while (n && (n.type === 'ChainExpression' || n.type === 'ParenthesizedExpression' || n.type === 'AwaitExpression')) n = n.expression || n.argument; return n; };
// claves de un ObjectExpression (devuelve {keys:Set, spread:bool})
function keysOfObject(o) { const keys = new Set(); let spread = false; for (const p of o.properties) { if (p.type === 'SpreadElement') spread = true; else if (p.type === 'Property') { if (p.computed) spread = true; else keys.add(String(p.key.name !== undefined ? p.key.name : p.key.value)); } } return { keys, spread }; }
// resuelve valor a uno o más ObjectExpression si es literal / condicional / || {} ; null si opaco
function objectsOf(n, localDecl) {
  n = unwrap(n); if (!n) return null;
  if (n.type === 'ObjectExpression') return [n];
  if (n.type === 'ConditionalExpression') { const a = objectsOf(n.consequent, localDecl), b = objectsOf(n.alternate, localDecl); return a && b ? a.concat(b) : null; }
  if (n.type === 'LogicalExpression') { const a = objectsOf(n.left, localDecl), b = objectsOf(n.right, localDecl); return a && b ? a.concat(b) : (a || b); }
  if (n.type === 'Identifier' && localDecl && localDecl.has(n.name)) return objectsOf(localDecl.get(n.name), null);
  return null;
}

(async () => {
  const mod = await import(pathToFileURL(path.join(ROOT, 'js/constants.js')).href);
  const T = mod.TIPOS_MENSAJE; const validos = new Set(mod.TIPOS_MENSAJE_VALIDOS);
  function resolvePath(p, aliases) { if (!p) return null; let head = p[0], rest = p.slice(1); if (aliases[head]) { rest = aliases[head].concat(rest); head = 'TIPOS_MENSAJE'; } if (!/^TIPOS_MENSAJE/.test(head) && head !== 'TIPOS') return null; let cur = T; for (const k of rest) { if (cur && typeof cur === 'object' && k in cur) cur = cur[k]; else return null; } return typeof cur === 'string' ? cur : null; }
  const emisores = {}; // tipo -> [{rel,line,keys,spread,opaque}]
  const lectores = {}; // tipo -> [{rel,line,keys,dyn,handler}]
  const noResueltos = [];
  for (const rel of listFiles()) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
    const asts = [];
    for (const b of extractBlocks(rel, src)) { let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} } if (ast) asts.push({ ast, off: b.lineOffset }); }
    // tabla de funciones por nombre (todo el fichero) y aliases de TIPOS_MENSAJE
    const funcs = {}; const aliases = {};
    for (const { ast } of asts) walk(ast, (n) => {
      if (n.type === 'FunctionDeclaration' && n.id) funcs[n.id.name] = n;
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init && /Function/.test(n.init.type)) funcs[n.id.name] = n.init;
      if (n.type === 'AssignmentExpression' && /Function/.test(n.right.type)) { const p = pathOf(n.left); if (p) funcs[p[p.length - 1]] = n.right; }
      if (n.type === 'VariableDeclarator' && n.init) { const p = pathOf(n.init); if (p && /^TIPOS_MENSAJE/.test(p[0]) && p.length > 1 && n.id.type === 'Identifier') aliases[n.id.name] = p.slice(1); if (p && /^TIPOS_MENSAJE/.test(p[0]) && n.id.type === 'ObjectPattern') for (const pr of n.id.properties) if (pr.type === 'Property' && pr.value.type === 'Identifier' && pr.key.name) aliases[pr.value.name] = p.slice(1).concat(pr.key.name); }
    }, []);
    // lectura de claves en un handler
    function leerClaves(fnNode) {
      const keys = new Set(); let dyn = false;
      const param = fnNode.params[0];
      if (!param) return { keys, dyn: false, sinParam: true };
      let msgNames = new Set(); let datosNames = new Set();
      if (param.type === 'Identifier') msgNames.add(param.name);
      else if (param.type === 'ObjectPattern') { for (const pr of param.properties) if (pr.type === 'Property' && (pr.key.name === 'datos')) { if (pr.value.type === 'Identifier') datosNames.add(pr.value.name); else if (pr.value.type === 'ObjectPattern') for (const q of pr.value.properties) if (q.type === 'Property' && !q.computed) keys.add(String(q.key.name !== undefined ? q.key.name : q.key.value)); else dyn = true; else if (pr.value.type === 'AssignmentPattern' && pr.value.left.type === 'Identifier') datosNames.add(pr.value.left.name); } else if (pr.type === 'RestElement') dyn = true; }
      else return { keys, dyn: true };
      // 1ª pasada: alias de datos (const d = m.datos || {}; const { datos } = m)
      const isDatosExpr = (e) => { e = unwrap(e); if (!e) return false; if (e.type === 'LogicalExpression') return isDatosExpr(e.left) || isDatosExpr(e.right); if (e.type === 'MemberExpression' && !e.computed && e.property.name === 'datos') { const o = unwrap(e.object); return o && o.type === 'Identifier' && msgNames.has(o.name); } if (e.type === 'Identifier') return datosNames.has(e.name); return false; };
      walk(fnNode.body, (n) => {
        if (n.type === 'VariableDeclarator' && n.init) {
          if (n.id.type === 'Identifier' && isDatosExpr(n.init)) datosNames.add(n.id.name);
          if (n.id.type === 'ObjectPattern') {
            const init = unwrap(n.init);
            if (init && init.type === 'Identifier' && msgNames.has(init.name)) { for (const pr of n.id.properties) if (pr.type === 'Property' && pr.key.name === 'datos') { if (pr.value.type === 'Identifier') datosNames.add(pr.value.name); else if (pr.value.type === 'ObjectPattern') for (const q of pr.value.properties) { if (q.type === 'Property' && !q.computed) keys.add(String(q.key.name !== undefined ? q.key.name : q.key.value)); else dyn = true; } } }
            else if (isDatosExpr(n.init)) { for (const pr of n.id.properties) { if (pr.type === 'Property' && !pr.computed) keys.add(String(pr.key.name !== undefined ? pr.key.name : pr.key.value)); else dyn = true; } }
          }
        }
      }, []);
      // 2ª pasada: lecturas de miembro y usos "enteros"
      walk(fnNode.body, (n, parents) => {
        if (n.type === 'MemberExpression') {
          const par = parents[parents.length - 1];
          // m.datos.X  /  d.X
          const o = unwrap(n.object);
          if (o && o.type === 'Identifier' && datosNames.has(o.name)) { if (!n.computed) keys.add(n.property.name); else dyn = true; }
          if (o && o.type === 'MemberExpression' && !o.computed && o.property.name === 'datos') { const oo = unwrap(o.object); if (oo && oo.type === 'Identifier' && msgNames.has(oo.name)) { if (!n.computed) keys.add(n.property.name); else dyn = true; } }
        }
        // uso entero de datos: pasado como argumento, spread, return, asignado a algo
        const marcaEntero = (e) => { if (isDatosExpr(e)) dyn = true; };
        if (n.type === 'CallExpression') n.arguments.forEach(a => { const u = unwrap(a); if (u && (isDatosExpr(u))) dyn = true; if (u && u.type === 'Identifier' && msgNames.has(u.name)) dyn = true; });
        if (n.type === 'SpreadElement') marcaEntero(n.argument);
        if (n.type === 'ReturnStatement' && n.argument) marcaEntero(n.argument);
        if (n.type === 'Property' && n.value) marcaEntero(n.value);
        if (n.type === 'AssignmentExpression') marcaEntero(n.right);
      }, []);
      return { keys, dyn };
    }
    for (const { ast, off } of asts) {
      // locales: const x = {...} por función envolvente (aprox. por fichero entero)
      const localDecl = new Map();
      walk(ast, (n) => { if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init) { const u = unwrap(n.init); if (u && (u.type === 'ObjectExpression' || u.type === 'ConditionalExpression' || u.type === 'LogicalExpression')) { if (!localDecl.has(n.id.name)) localDecl.set(n.id.name, n.init); } } }, []);
      walk(ast, (n, parents) => {
        const line = n.loc.start.line + off;
        if (n.type === 'ObjectExpression') {
          const tipoProp = n.properties.find(p => p.type === 'Property' && !p.computed && (p.key.name === 'tipo' || p.key.value === 'tipo'));
          if (!tipoProp) return;
          const parent = parents[parents.length - 1]; let callee = null;
          if (parent && (parent.type === 'CallExpression' || parent.type === 'NewExpression') && parent.arguments.includes(n)) callee = calleeText(parent.callee);
          const destProp = n.properties.find(p => p.type === 'Property' && !p.computed && (p.key.name === 'destino' || p.key.value === 'destino'));
          const datosProp = n.properties.find(p => p.type === 'Property' && !p.computed && (p.key.name === 'datos' || p.key.value === 'datos'));
          const esEmisorCall = callee && /enviar|despachar|postMessage|emit|bus\./i.test(callee);
          if (!esEmisorCall && !destProp && !datosProp) return;
          const cands = [];
          (function collect(x) { if (!x) return; if (x.type === 'ConditionalExpression') { collect(x.consequent); collect(x.alternate); return; } if (x.type === 'LogicalExpression') { collect(x.left); collect(x.right); return; } if (x.type === 'ChainExpression') { collect(x.expression); return; } if (x.type === 'Literal' && typeof x.value === 'string') { cands.push(validos.has(x.value) ? x.value : null); return; } const p = pathOf(x); cands.push(p ? resolvePath(p, aliases) : null); })(tipoProp.value);
          let keys = new Set(), spread = false, opaque = false;
          if (!datosProp) { /* sin datos: no emite claves */ }
          else { const objs = objectsOf(datosProp.value, localDecl); if (!objs) opaque = true; else for (const o of objs) { const r = keysOfObject(o); r.keys.forEach(k => keys.add(k)); if (r.spread) spread = true; } }
          for (const c of cands) { if (!c) { noResueltos.push({ rel, line }); continue; } (emisores[c] ||= []).push({ rel, line, keys: [...keys], spread, opaque, sinDatos: !datosProp }); }
        }
        if (n.type === 'CallExpression') {
          const ct = calleeText(n.callee);
          if (/(^|\.)registrarControlador(Seguro)?$/.test(ct) || /(^|\.)registrarSiNoExiste$/.test(ct) || /^registrar$/.test(ct)) {
            const a0 = n.arguments[0], a1 = n.arguments[1]; if (!a0 || !a1) return;
            let canon = null;
            if (a0.type === 'Literal' && typeof a0.value === 'string') canon = validos.has(a0.value) ? a0.value : null; else { const p = pathOf(a0); canon = p ? resolvePath(p, aliases) : null; }
            if (!canon) return;
            let fn = null, hname = '<inline>';
            const u = unwrap(a1);
            if (u.type === 'Identifier') { hname = u.name; fn = funcs[u.name] || null; }
            else if (/Function/.test(u.type)) fn = u;
            if (!fn) { (lectores[canon] ||= []).push({ rel, line, keys: [], dyn: true, handler: hname, noResuelto: true }); return; }
            const r = leerClaves(fn);
            (lectores[canon] ||= []).push({ rel, line, keys: [...r.keys], dyn: r.dyn, handler: hname, sinParam: !!r.sinParam });
          }
        }
      }, []);
    }
  }
  fs.writeFileSync(salida('payload.json'), JSON.stringify({ emisores, lectores }, null, 1));
  const lineas = [];
  const tipos = [...validos].sort();
  let nLeidasSinEmitir = 0, nCierto = 0;
  for (const t of tipos) {
    const E = emisores[t] || [], L = lectores[t] || [];
    const opacoE = E.some(e => e.opaque || e.spread);
    const dynL = L.some(l => l.dyn);
    const sent = new Set(E.flatMap(e => e.keys)); const read = new Set(L.flatMap(l => l.keys));
    const leidasSinEmitir = [...read].filter(k => !sent.has(k));
    const emitidasSinLeer = [...sent].filter(k => !read.has(k));
    if (!E.length && !L.length) continue;
    const tag = leidasSinEmitir.length ? (opacoE ? 'LEIDAS-SIN-EMITIR(incierto: emisor opaco)' : 'LEIDAS-SIN-EMITIR(CIERTO)') : '';
    if (leidasSinEmitir.length && !opacoE) { nLeidasSinEmitir++; }
    lineas.push(`${t}  E=${E.length}${opacoE ? '(opaco)' : ''} L=${L.length}${dynL ? '(dinámico)' : ''}  envía[${[...sent].join(',')}]  lee[${[...read].join(',')}]  ${tag}${leidasSinEmitir.length ? ' → ' + leidasSinEmitir.join(',') : ''}${!dynL && emitidasSinLeer.length && L.length ? '  EMITIDAS-SIN-LEER: ' + emitidasSinLeer.join(',') : ''}`);
  }
  fs.writeFileSync(salida('payload.txt'), lineas.join('\n'));
  console.log('tipos analizados:', lineas.length, ' con claves leídas y nunca emitidas (emisores literales):', nLeidasSinEmitir, ' emisores sin tipo resuelto:', noResueltos.length);
})();
