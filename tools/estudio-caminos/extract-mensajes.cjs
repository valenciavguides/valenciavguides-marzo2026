// Emisores y receptores de mensajes del bus por tipo, con parser real (acorn).
// Control de residuo: se imprimen TODOS los sitios que parecen emisor/receptor y no se pudieron resolver a un tipo canónico.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));

const DATOS_FICHEROS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js','js/indice-aventuras.js']);
function listFiles() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') out.push(f);
  for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS_FICHEROS.has('js/' + f)) out.push('js/' + f);
  return out;
}
function extractBlocks(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, lineOffset: 0 }];
  const blocks = [];
  const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' '));
  const clean2 = clean.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(clean2)) !== null) {
    const attrs = m[1] || '';
    if (/\bsrc\s*=/.test(attrs)) continue;
    const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(attrs);
    const type = t ? t[1].toLowerCase() : '';
    if (type && type !== 'module' && type !== 'text/javascript' && type !== 'application/javascript') continue;
    const cs = m.index + m[0].indexOf('>') + 1;
    const lineOffset = src.slice(0, cs).split('\n').length - 1;
    blocks.push({ code: src.slice(cs, cs + m[2].length), lineOffset });
  }
  return blocks;
}
function walk(node, visit, parents) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, parents);
  const np = parents.concat(node);
  for (const k of Object.keys(node)) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, visit, np));
    else if (v && typeof v.type === 'string') walk(v, visit, np);
  }
}
function pathOf(n) {
  if (!n) return null;
  if (n.type === 'Identifier') return [n.name];
  if (n.type === 'MemberExpression' && !n.computed) {
    const o = pathOf(n.object);
    if (!o) return null;
    // globalThis.X.Y / window.X.Y se leen como X.Y
    if (o.length === 1 && (o[0] === 'globalThis' || o[0] === 'window')) return [n.property.name];
    return o.concat(n.property.name);
  }
  if (n.type === 'ChainExpression') return pathOf(n.expression);
  return null;
}
function calleeText(c) {
  const p = pathOf(c);
  return p ? p.join('.') : (c.type === 'ChainExpression' ? calleeText(c.expression) : '<expr>');
}

(async () => {
  const mod = await import(pathToFileURL(path.join(ROOT, 'js/constants.js')).href);
  const T = mod.TIPOS_MENSAJE;
  // `TIPOS_MENSAJE_VALIDOS` (la lista plana que exportaba el commit base de la ronda) ya no existe: los valores válidos salen de las hojas de TIPOS_MENSAJE.
  const hojas = (o) => Object.values(o).flatMap((v) => (v && typeof v === 'object' ? hojas(v) : [v]));
  const validos = new Set(mod.TIPOS_MENSAJE_VALIDOS || hojas(T));
  function resolvePath(p, aliases) {
    // p = ['TIPOS_MENSAJE_S1','SISTEMA','CAMBIO_MODO']  → valor canónico
    if (!p) return null;
    let head = p[0];
    let rest = p.slice(1);
    if (aliases[head]) { rest = aliases[head].concat(rest); head = 'TIPOS_MENSAJE'; }
    if (!/^TIPOS_MENSAJE/.test(head) && head !== 'TIPOS') return null;
    let cur = T;
    for (const k of rest) { if (cur && typeof cur === 'object' && k in cur) cur = cur[k]; else return null; }
    return typeof cur === 'string' ? cur : null;
  }

  const emit = [], recv = [], unresolved = [];
  for (const rel of listFiles()) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
    for (const b of extractBlocks(rel, src)) {
      let ast = null;
      for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
      if (!ast) { unresolved.push({ rel, why: 'NO PARSEA' }); continue; }
      // aliases:  const P = TIPOS_MENSAJE.PUZZLE  /  const { X } = TIPOS_MENSAJE.A
      const aliases = {};
      walk(ast, (n) => {
        if (n.type === 'VariableDeclarator' && n.init) {
          const p = pathOf(n.init);
          if (p && /^TIPOS_MENSAJE/.test(p[0]) && p.length > 1 && n.id.type === 'Identifier') aliases[n.id.name] = p.slice(1);
          if (p && /^TIPOS_MENSAJE/.test(p[0]) && n.id.type === 'ObjectPattern') {
            for (const pr of n.id.properties) if (pr.type === 'Property' && pr.value.type === 'Identifier' && pr.key.name) aliases[pr.value.name] = p.slice(1).concat(pr.key.name);
          }
        }
      }, []);
      const enclosing = (parents) => {
        for (let i = parents.length - 1; i >= 0; i--) {
          const p = parents[i];
          if ((p.type === 'FunctionDeclaration' || p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression')) {
            if (p.id && p.id.name) return p.id.name;
            const q = parents[i - 1];
            if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name;
            if (q && q.type === 'AssignmentExpression') { const pp = pathOf(q.left); if (pp) return pp.join('.'); }
            if (q && q.type === 'Property' && q.key) return String(q.key.name || q.key.value);
          }
        }
        return '<top>';
      };
      walk(ast, (n, parents) => {
        const line = n.loc.start.line + b.lineOffset;
        // ---- emisores: ObjectExpression con propiedad `tipo`
        if (n.type === 'ObjectExpression') {
          const tipoProp = n.properties.find(p => p.type === 'Property' && !p.computed && ((p.key.name === 'tipo') || (p.key.value === 'tipo')));
          if (tipoProp) {
            const parent = parents[parents.length - 1];
            let callee = null;
            if (parent && (parent.type === 'CallExpression' || parent.type === 'NewExpression') && parent.arguments.includes(n)) callee = calleeText(parent.callee);
            const destProp = n.properties.find(p => p.type === 'Property' && !p.computed && ((p.key.name === 'destino') || (p.key.value === 'destino')));
            const datosProp = n.properties.find(p => p.type === 'Property' && !p.computed && ((p.key.name === 'datos') || (p.key.value === 'datos')));
            // solo objetos con pinta de mensaje del bus: llamada a un emisor, o con destino/datos
            const esEmisorCall = callee && /enviar|despachar|postMessage|emit|bus\./i.test(callee);
            if (!esEmisorCall && !destProp && !datosProp) return;
            const v = tipoProp.value;
            // resolver todas las ramas posibles (condicional / lógico)
            const cands = [];
            (function collect(x) {
              if (!x) return;
              if (x.type === 'ConditionalExpression') { collect(x.consequent); collect(x.alternate); return; }
              if (x.type === 'LogicalExpression') { collect(x.left); collect(x.right); return; }
              if (x.type === 'ChainExpression') { collect(x.expression); return; }
              if (x.type === 'Literal' && typeof x.value === 'string') { cands.push({ raw: JSON.stringify(x.value), canon: validos.has(x.value) ? x.value : null }); return; }
              const p = pathOf(x);
              cands.push({ raw: p ? p.join('.') : x.type, canon: p ? resolvePath(p, aliases) : null });
            })(v);
            let destino = null;
            if (destProp) { const dv = destProp.value; destino = dv.type === 'Literal' ? JSON.stringify(dv.value) : (pathOf(dv) ? pathOf(dv).join('.') : dv.type === 'CallExpression' ? calleeText(dv.callee) + '()' : dv.type); }
            for (const c of cands) {
              const rec = { rel, line, fn: enclosing(parents), callee, raw: c.raw, canon: c.canon, destino, multi: cands.length > 1 };
              if (c.canon) emit.push(rec); else unresolved.push(Object.assign({ kind: 'emisor' }, rec));
            }
          }
        }
        // ---- receptores: registrarControlador*(TIPO, handler)
        if (n.type === 'CallExpression') {
          const ct = calleeText(n.callee);
          if (/(^|\.)registrarControlador(Seguro)?$/.test(ct) || /(^|\.)registrarSiNoExiste$/.test(ct) || /^registrar$/.test(ct)) {
            const a0 = n.arguments[0];
            if (!a0) return;
            let canon = null, raw = null;
            if (a0.type === 'Literal' && typeof a0.value === 'string') { raw = JSON.stringify(a0.value); canon = validos.has(a0.value) ? a0.value : null; }
            else { const p = pathOf(a0); raw = p ? p.join('.') : a0.type; canon = p ? resolvePath(p, aliases) : null; }
            const rec = { rel, line, fn: enclosing(parents), callee: ct, raw, canon };
            if (canon) recv.push(rec); else unresolved.push(Object.assign({ kind: 'receptor' }, rec));
          }
        }
      }, []);
    }
  }
  fs.writeFileSync(salida('mensajes.json'), JSON.stringify({ emit, recv, unresolved, validos: [...validos] }, null, 1));
  console.log('emisores resueltos', emit.length, 'receptores resueltos', recv.length, 'sin resolver', unresolved.length, 'tipos válidos', validos.size);
  for (const u of unresolved) console.log('  SIN RESOLVER', u.kind || '', u.rel + ':' + u.line, u.fn || '', u.callee || '', u.raw || u.why || '');
})();
