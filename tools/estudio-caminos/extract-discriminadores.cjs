// Valores "discriminadores" que un handler compara contra una clave de `mensaje.datos` (x === 'lit', switch, ['a','b'].includes(x))
// y que ningún emisor del tipo manda para esa clave. Solo concluye cuando todos los emisores del tipo tienen `datos` literal y la clave es siempre literal.
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
const keyName = p => String(p.key.name !== undefined ? p.key.name : p.key.value);
function litStrings(n) { // todas las ramas string literal de una expresión (condicional/lógica); null si alguna rama no es literal string
  n = unwrap(n); if (!n) return null;
  if (n.type === 'Literal') return typeof n.value === 'string' ? [n.value] : null;
  if (n.type === 'TemplateLiteral' && n.expressions.length === 0) return [n.quasis.map(q => q.value.cooked).join('')];
  if (n.type === 'ConditionalExpression') { const a = litStrings(n.consequent), b = litStrings(n.alternate); return a && b ? a.concat(b) : null; }
  if (n.type === 'LogicalExpression') { const a = litStrings(n.left), b = litStrings(n.right); return a && b ? a.concat(b) : null; }
  return null;
}
(async () => {
  const mod = await import(pathToFileURL(path.join(ROOT, 'js/constants.js')).href);
  const T = mod.TIPOS_MENSAJE;
  // `TIPOS_MENSAJE_VALIDOS` (la lista plana que exportaba el commit base de la ronda) ya no existe: los valores válidos salen de las hojas de TIPOS_MENSAJE.
  const hojas = (o) => Object.values(o).flatMap((v) => (v && typeof v === 'object' ? hojas(v) : [v]));
  const validos = new Set(mod.TIPOS_MENSAJE_VALIDOS || hojas(T));
  function resolvePath(p, aliases) { if (!p) return null; let head = p[0], rest = p.slice(1); if (aliases[head]) { rest = aliases[head].concat(rest); head = 'TIPOS_MENSAJE'; } if (!/^TIPOS_MENSAJE/.test(head) && head !== 'TIPOS') return null; let cur = T; for (const k of rest) { if (cur && typeof cur === 'object' && k in cur) cur = cur[k]; else return null; } return typeof cur === 'string' ? cur : null; }
  const enviados = {}; // tipo -> { key -> {vals:Set, dyn:bool} } ; opaque:bool
  const opacos = {};   // tipo -> true si algún emisor tiene datos no literal/spread
  const comparados = []; // {tipo, key, vals:[], rel, line, handler}
  for (const rel of listFiles()) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
    const asts = [];
    for (const b of extractBlocks(rel, src)) { let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} } if (ast) asts.push({ ast, off: b.lineOffset }); }
    const funcs = {}; const aliases = {}; const localDecl = new Map();
    for (const { ast } of asts) walk(ast, (n) => {
      if (n.type === 'FunctionDeclaration' && n.id) funcs[n.id.name] = n;
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init && /Function/.test(n.init.type)) funcs[n.id.name] = n.init;
      if (n.type === 'AssignmentExpression' && /Function/.test(n.right.type)) { const p = pathOf(n.left); if (p) funcs[p[p.length - 1]] = n.right; }
      if (n.type === 'VariableDeclarator' && n.init) { const p = pathOf(n.init); if (p && /^TIPOS_MENSAJE/.test(p[0]) && p.length > 1 && n.id.type === 'Identifier') aliases[n.id.name] = p.slice(1); if (p && /^TIPOS_MENSAJE/.test(p[0]) && n.id.type === 'ObjectPattern') for (const pr of n.id.properties) if (pr.type === 'Property' && pr.value.type === 'Identifier' && pr.key.name) aliases[pr.value.name] = p.slice(1).concat(pr.key.name); }
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.init) { const u = unwrap(n.init); if (u && (u.type === 'ObjectExpression' || u.type === 'ConditionalExpression' || u.type === 'LogicalExpression') && !localDecl.has(n.id.name)) localDecl.set(n.id.name, n.init); }
    }, []);
    function objectsOf(n) { n = unwrap(n); if (!n) return null; if (n.type === 'ObjectExpression') return [n]; if (n.type === 'ConditionalExpression') { const a = objectsOf(n.consequent), b = objectsOf(n.alternate); return a && b ? a.concat(b) : null; } if (n.type === 'LogicalExpression') { const a = objectsOf(n.left), b = objectsOf(n.right); return a && b ? a.concat(b) : (a || b); } if (n.type === 'Identifier' && localDecl.has(n.name)) { const r = localDecl.get(n.name); return r === n ? null : objectsOf(r); } return null; }
    function compararEnHandler(fnNode, tipo, rel, hline, hname) {
      const param = fnNode.params[0]; if (!param) return;
      const msgNames = new Set(); const datosNames = new Set(); const varKey = new Map(); // var -> key
      if (param.type === 'Identifier') msgNames.add(param.name);
      else if (param.type === 'ObjectPattern') { for (const pr of param.properties) if (pr.type === 'Property' && pr.key.name === 'datos') { if (pr.value.type === 'Identifier') datosNames.add(pr.value.name); else if (pr.value.type === 'ObjectPattern') for (const q of pr.value.properties) if (q.type === 'Property' && !q.computed && q.value.type === 'Identifier') varKey.set(q.value.name, keyName(q)); } } else return;
      const isDatos = (e) => { e = unwrap(e); if (!e) return false; if (e.type === 'LogicalExpression') return isDatos(e.left) || isDatos(e.right); if (e.type === 'MemberExpression' && !e.computed && e.property.name === 'datos') { const o = unwrap(e.object); return o && o.type === 'Identifier' && msgNames.has(o.name); } if (e.type === 'Identifier') return datosNames.has(e.name); return false; };
      walk(fnNode.body, (n) => {
        if (n.type !== 'VariableDeclarator' || !n.init) return;
        if (n.id.type === 'Identifier' && isDatos(n.init)) datosNames.add(n.id.name);
        if (n.id.type === 'ObjectPattern') {
          const init = unwrap(n.init);
          const fromMsg = init && init.type === 'Identifier' && msgNames.has(init.name);
          if (fromMsg) { for (const pr of n.id.properties) if (pr.type === 'Property' && pr.key.name === 'datos') { if (pr.value.type === 'Identifier') datosNames.add(pr.value.name); else if (pr.value.type === 'ObjectPattern') for (const q of pr.value.properties) if (q.type === 'Property' && !q.computed) { const v = q.value.type === 'AssignmentPattern' ? q.value.left : q.value; if (v.type === 'Identifier') varKey.set(v.name, keyName(q)); } } }
          else if (isDatos(n.init)) { for (const pr of n.id.properties) if (pr.type === 'Property' && !pr.computed) { const v = pr.value.type === 'AssignmentPattern' ? pr.value.left : pr.value; if (v.type === 'Identifier') varKey.set(v.name, keyName(pr)); } }
        }
        if (n.id.type === 'Identifier') { const u = unwrap(n.init); if (u && u.type === 'MemberExpression' && !u.computed) { const o = unwrap(u.object); if (o && ((o.type === 'Identifier' && datosNames.has(o.name)) || isDatos(o))) varKey.set(n.id.name, u.property.name); } else if (u && u.type === 'LogicalExpression') { const l = unwrap(u.left); if (l && l.type === 'MemberExpression' && !l.computed) { const o = unwrap(l.object); if (o && ((o.type === 'Identifier' && datosNames.has(o.name)) || isDatos(o))) varKey.set(n.id.name, l.property.name); } } }
      }, []);
      const keyOf = (e) => { e = unwrap(e); if (!e) return null; if (e.type === 'LogicalExpression') return keyOf(e.left) || keyOf(e.right); if (e.type === 'Identifier') return varKey.get(e.name) || null; if (e.type === 'MemberExpression' && !e.computed) { const o = unwrap(e.object); if (o && ((o.type === 'Identifier' && datosNames.has(o.name)) || isDatos(o))) return e.property.name; } return null; };
      walk(fnNode.body, (n) => {
        const line = n.loc.start.line;
        if (n.type === 'BinaryExpression' && ['===', '==', '!==', '!='].includes(n.operator)) {
          const L = unwrap(n.left), R = unwrap(n.right);
          let k = null, lit = null;
          if (R && R.type === 'Literal' && typeof R.value === 'string') { k = keyOf(L); lit = R.value; } else if (L && L.type === 'Literal' && typeof L.value === 'string') { k = keyOf(R); lit = L.value; }
          if (k && lit !== null) comparados.push({ tipo, key: k, vals: [lit], rel, line: line + fnNode.__off, handler: hname });
        }
        if (n.type === 'SwitchStatement') { const k = keyOf(n.discriminant); if (k) { const vals = n.cases.filter(c => c.test && c.test.type === 'Literal' && typeof c.test.value === 'string').map(c => c.test.value); if (vals.length) comparados.push({ tipo, key: k, vals, rel, line: line + fnNode.__off, handler: hname }); } }
        if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'includes') {
          const arr = unwrap(n.callee.object); if (arr && arr.type === 'ArrayExpression' && arr.elements.every(e => e && e.type === 'Literal' && typeof e.value === 'string')) { const k = keyOf(n.arguments[0]); if (k) comparados.push({ tipo, key: k, vals: arr.elements.map(e => e.value), rel, line: line + fnNode.__off, handler: hname }); }
        }
      }, []);
    }
    for (const { ast, off } of asts) {
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
          for (const c of cands) {
            if (!c) continue;
            const E = (enviados[c] ||= {});
            if (!datosProp) continue;
            const objs = objectsOf(datosProp.value);
            if (!objs) { opacos[c] = true; continue; }
            for (const o of objs) for (const p of o.properties) {
              if (p.type === 'SpreadElement') { opacos[c] = true; continue; }
              if (p.type !== 'Property' || p.computed) { opacos[c] = true; continue; }
              const k = keyName(p); const slot = (E[k] ||= { vals: new Set(), dyn: false });
              const ls = litStrings(p.value); if (ls) ls.forEach(v => slot.vals.add(v)); else slot.dyn = true;
            }
          }
        }
        if (n.type === 'CallExpression') {
          const ct = calleeText(n.callee);
          if (/(^|\.)registrarControlador(Seguro)?$/.test(ct) || /(^|\.)registrarSiNoExiste$/.test(ct) || /^registrar$/.test(ct)) {
            const a0 = n.arguments[0], a1 = n.arguments[1]; if (!a0 || !a1) return;
            let canon = null;
            if (a0.type === 'Literal' && typeof a0.value === 'string') canon = validos.has(a0.value) ? a0.value : null; else { const p = pathOf(a0); canon = p ? resolvePath(p, aliases) : null; }
            if (!canon) return;
            const u = unwrap(a1); let fn = null, hname = '<inline>';
            if (u.type === 'Identifier') { hname = u.name; fn = funcs[u.name] || null; } else if (/Function/.test(u.type)) fn = u;
            if (!fn) return;
            fn.__off = off;
            compararEnHandler(fn, canon, rel, line, hname);
          }
        }
      }, []);
    }
  }
  const out = []; let nSospechosos = 0;
  const vistos = new Set();
  for (const c of comparados) {
    const id = c.tipo + '|' + c.key + '|' + c.vals.join(',') + '|' + c.rel + ':' + c.line; if (vistos.has(id)) continue; vistos.add(id);
    const E = enviados[c.tipo] || {}; const slot = E[c.key];
    const opaco = !!opacos[c.tipo];
    const enviadas = slot ? [...slot.vals] : [];
    const noEnviados = c.vals.filter(v => !enviadas.includes(v));
    if (!noEnviados.length) continue;
    let veredicto;
    if (opaco) veredicto = 'incierto (algún emisor con datos opaco)';
    else if (slot && slot.dyn) veredicto = 'incierto (la clave se manda también con valor no literal)';
    else if (!slot) veredicto = 'la clave no la manda ningún emisor';
    else veredicto = 'CIERTO: valor nunca enviado';
    if (veredicto.startsWith('CIERTO') || veredicto.startsWith('la clave')) nSospechosos++;
    out.push(`${c.tipo}  .${c.key}  compara con ${JSON.stringify(c.vals)}  → no enviados ${JSON.stringify(noEnviados)}  [envía ${JSON.stringify(enviadas)}${slot && slot.dyn ? '+dinámico' : ''}]  ${veredicto}  @ ${c.rel}:${c.line} (${c.handler})`);
  }
  fs.writeFileSync(salida('discriminadores.txt'), out.join('\n'));
  console.log('comparaciones analizadas:', comparados.length, ' con valor nunca enviado (CIERTO o clave sin emisor):', nSospechosos, ' líneas:', out.length);
  console.log(out.filter(l => /CIERTO|la clave no/.test(l)).join('\n'));
})();
