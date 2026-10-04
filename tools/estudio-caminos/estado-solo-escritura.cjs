// Campos de estado compartido que se ESCRIBEN y que nadie LEE (ni el campo ni nada que cuelgue de él), por ruta.
// Mismo conjunto de raíces y de ficheros que extract-estado.cjs, más el lado de lectura. Imprime el residuo.
// Una ruta cuenta como "leída" si aparece en cualquier posición que no sea de escritura (rvalue, .has/.get/.size/iteración,
// argumento, desestructuración, cadena más larga que cuelga de ella). Luego, para cada candidato, se cuenta la búsqueda desnuda
// del nombre de la hoja en TODOS los ficheros de producción para ver si alguna lectura por otro camino se le escapó al análisis.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const ROOTS = new Set(['estado', 'estadoPadre', 'estadoScript1', 'est', 'estadoMapa', 'estadoComponente', 'estadoRetos', 'estadoMenu', 'estadoTemporizador', 'estadoAudio', 'estadoGPS', 'estadoCoordinacion']);
const MUT = new Set(['set', 'push', 'add', 'delete', 'clear', 'splice', 'pop', 'shift', 'unshift']);
const files = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) files.push(f);
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && f !== 'server.js') files.push('js/' + f);
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function pathOf(n) {
  const segs = []; let cur = n;
  while (cur) {
    if (cur.type === 'MemberExpression') { segs.unshift(cur.computed ? '[]' : (cur.property.name || '?')); cur = cur.object; }
    else if (cur.type === 'ChainExpression') cur = cur.expression;
    else if (cur.type === 'Identifier') { segs.unshift(cur.name); break; }
    else return null;
  }
  if (segs[0] === 'globalThis' || segs[0] === 'window') segs.shift();
  return segs;
}
const norm = (segs) => { const s = segs.slice(); if (['estadoPadre', 'estadoScript1', 'est'].includes(s[0])) s[0] = 'estado'; return s; };
const W = {}; const R = {}; const INIT = {}; // ruta normalizada (hasta 4 segmentos) -> [sitios]
const residuoComputado = [];
let total = 0;
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    walk(ast, (n, ps) => {
      if (n.type !== 'MemberExpression') return;
      const par = ps[ps.length - 1];
      // solo la cadena MAXIMAL: si el padre es otro MemberExpression que lo usa como objeto, la procesa el padre
      if (par && par.type === 'MemberExpression' && par.object === n) return;
      if (par && par.type === 'ChainExpression') { const gp = ps[ps.length - 2]; if (gp && gp.type === 'MemberExpression' && gp.object === par) return; }
      const segs = pathOf(n); if (!segs || segs.length < 2 || !ROOTS.has(segs[0])) return;
      if (segs.includes('[]')) residuoComputado.push(`${rel}:${n.loc.start.line + b.off} ${segs.join('.')}`);
      const full = norm(segs); const line = n.loc.start.line + b.off; total++;
      // ¿escritura?
      let esW = false, wPath = full;
      if (par && par.type === 'AssignmentExpression' && par.left === n && par.operator === '=') esW = true;
      else if (par && par.type === 'AssignmentExpression' && par.left === n) esW = true; // += etc.: escribe (y lee, se cuenta también como lectura abajo)
      else if (par && par.type === 'UpdateExpression') esW = true;
      // mutador: estado.x.add(...) -> el objeto del callee es la ruta (el propio n es callee.object de otro Member, ya filtrado arriba); caso: n = callee (estado.x.add)
      if (!esW && par && par.type === 'CallExpression' && par.callee === n && n.type === 'MemberExpression' && !n.computed && MUT.has(n.property.name)) { esW = true; wPath = full.slice(0, -1); if (wPath.length < 2) return; }
      if (esW) { const key = wPath.slice(0, 4).join('.'); (W[key] ||= []).push(`${rel}:${line}`); }
      const leeAlEscribir = par && par.type === 'AssignmentExpression' && par.left === n && par.operator !== '=';
      // lectura de inicialización perezosa: `x = x || new Set()`, `x ??= …`, `if (!x) x = …`: el campo se lee solo para decidir si se escribe
      let initLectura = false;
      if (!esW || leeAlEscribir) {
        const keyN = full.join('.');
        for (let i = ps.length - 1; i >= 0 && !initLectura; i--) {
          const a = ps[i];
          if (a.type === 'AssignmentExpression' && a.right && a.start <= n.start && n.end <= a.end && a.left !== n) {
            // n está dentro del lado derecho de una asignación; ¿a la misma ruta?
            if (n.start >= a.right.start) { const lp = pathOf(a.left); if (lp && norm(lp).join('.') === keyN) initLectura = true; }
          }
          if (a.type === 'IfStatement' && n.start >= a.test.start && n.end <= a.test.end) {
            const asignaMisma = (node) => { let hit = false; walk(node, (m) => { if (m.type === 'AssignmentExpression' && m.left.type === 'MemberExpression') { const lp = pathOf(m.left); if (lp && norm(lp).join('.') === keyN) hit = true; } if (m.type === 'CallExpression' && m.callee.type === 'MemberExpression') { const lp = pathOf(m.callee.object); if (lp && norm(lp).join('.') === keyN && MUT.has(m.callee.property.name)) hit = true; } }, []); return hit; };
            // inicialización perezosa PURA: el consecuente es SOLO la asignación (una sentencia). Un `if (!flag) { hacerAlgo(); flag = true; }` es una bandera de una sola vez: se lee de verdad.
            const cons = a.consequent.type === 'BlockStatement' ? a.consequent.body : [a.consequent];
            if (cons.length === 1 && cons[0].type === 'ExpressionStatement' && asignaMisma(cons[0])) initLectura = true;
          }
          if (a.type === 'FunctionDeclaration' || a.type === 'FunctionExpression' || a.type === 'ArrowFunctionExpression') break;
        }
      }
      if ((!esW || leeAlEscribir) && !initLectura) { const key = full.slice(0, 4).join('.'); (R[key] ||= []).push(`${rel}:${line}`); }
      if ((!esW || leeAlEscribir) && initLectura) { const key = full.slice(0, 4).join('.'); (INIT[key] ||= []).push(`${rel}:${line}`); }
      // Object.assign(estado.x, ...) cuenta como escritura de la ruta
    }, []);
    // desestructuración: const { a, b } = estado.x  → lecturas de estado.x.a y estado.x.b (y `...rest` / clave computada: lectura de estado.x entero)
    walk(ast, (n) => {
      if (n.type === 'VariableDeclarator' && n.id.type === 'ObjectPattern' && n.init) {
        const segs = pathOf(n.init); if (!segs || segs.length < 1 || !ROOTS.has(segs[0])) return;
        const base = norm(segs);
        for (const p of n.id.properties) {
          if (p.type === 'Property' && !p.computed && p.key.type === 'Identifier') { const key = base.concat(p.key.name).slice(0, 4).join('.'); (R[key] ||= []).push(`${rel}:${n.loc.start.line + b.off} (desestructuración)`); }
          else { const key = base.slice(0, 4).join('.'); (R[key] ||= []).push(`${rel}:${n.loc.start.line + b.off} (desestructuración entera)`); }
        }
      }
    }, []);
    // Object.assign(target, ...) como escritura; el target ya se registró como lectura arriba: se corrige abajo
    walk(ast, (n) => {
      if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && n.callee.object.type === 'Identifier' && n.callee.object.name === 'Object' && n.callee.property.name === 'assign' && n.arguments[0]) {
        const segs = pathOf(n.arguments[0]); if (segs && segs.length >= 2 && ROOTS.has(segs[0])) { const key = norm(segs).slice(0, 4).join('.'); (W[key] ||= []).push(`${rel}:${n.loc.start.line + b.off}`); const arr = R[key]; if (arr) { const i = arr.indexOf(`${rel}:${n.arguments[0].loc.start.line + b.off}`); if (i >= 0) arr.splice(i, 1); } }
      }
    }, []);
  }
}
// una ruta está leída si hay lectura de ella o de cualquier extensión suya
const leida = (p) => Object.keys(R).some(k => k === p || k.startsWith(p + '.'));
const cands = Object.keys(W).filter(p => !leida(p)).sort();
// búsqueda desnuda del nombre de la hoja en producción (fuera de los sitios de escritura detectados)
const prod = files.map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n').split('\n')]);
function ocurrencias(leaf, sitiosEscritura) {
  const re = new RegExp('(^|[^\\w$])' + leaf.replace(/[$]/g, '\\$') + '($|[^\\w$])'); const out = [];
  for (const [f, lines] of prod) lines.forEach((l, i) => { if (re.test(l)) { const tag = `${f}:${i + 1}`; if (!sitiosEscritura.includes(tag)) out.push(tag); } });
  return out;
}
const lines = [];
// ¿algún ancestro (prefijo propio de profundidad >= 2) se lee ENTERO en alguna parte? Entonces el campo pudo leerse por esa vía.
const ancestrosLeidos = (p) => { const segs = p.split('.'); const out = []; for (let d = 2; d < segs.length; d++) { const a = segs.slice(0, d).join('.'); if (R[a] && R[a].length) out.push(`${a} (${R[a].length}: ${R[a].slice(0, 2).join(' ')})`); } return out; };
const estrictas = cands.filter(p => !ancestrosLeidos(p).length); const conAncestro = cands.filter(p => ancestrosLeidos(p).length);
lines.push(`rutas escritas: ${Object.keys(W).length}  rutas con alguna lectura (exacta o de extensión): ${Object.keys(W).filter(leida).length}  candidatas solo-escritura: ${cands.length} (${estrictas.length} sin ningún ancestro leído entero, ${conAncestro.length} con alguno)  (expresiones analizadas: ${total}; con clave computada: ${residuoComputado.length})`);
lines.push('=== ESTRICTAS (ningún ancestro leído entero) ===');
for (const p of estrictas) { const leaf = p.split('.').pop(); const oc = ocurrencias(leaf, W[p]); lines.push(`${p.padEnd(52)} escrituras=${W[p].length} [${[...new Set(W[p])].slice(0, 3).join(' ')}]${INIT[p] ? ' (+' + INIT[p].length + ' lecturas de inicialización perezosa)' : ''}  otras apariciones del nombre "${leaf}": ${oc.length}${oc.length && oc.length <= 8 ? ' → ' + oc.join(' ') : ''}`); }
lines.push('=== CON ANCESTRO LEÍDO ENTERO (posible lectura por esa vía) ===');
for (const p of conAncestro) { lines.push(`${p.padEnd(52)} escrituras=${W[p].length} [${[...new Set(W[p])].slice(0, 2).join(' ')}]  ancestros leídos: ${ancestrosLeidos(p).join(' | ')}`); }
lines.push('=== (listado antiguo, para comparar) ===');
for (const p of cands) {
  const leaf = p.split('.').pop(); const oc = ocurrencias(leaf, W[p]);
  lines.push(`${p.padEnd(52)} escrituras=${W[p].length} [${[...new Set(W[p])].slice(0, 3).join(' ')}]${INIT[p] ? ' (+' + INIT[p].length + ' lecturas de inicialización perezosa)' : ''}  otras apariciones del nombre "${leaf}" en producción: ${oc.length}${oc.length && oc.length <= 12 ? ' → ' + oc.slice(0, 12).join(' ') : ''}`);
}
lines.push('');
lines.push('-- residuo: accesos con clave computada (no se resuelven): ' + residuoComputado.length);
for (const x of residuoComputado.slice(0, 25)) lines.push('   ' + x);
fs.writeFileSync(salida('estado-solo-escritura.txt'), lines.join('\n'));
console.log(lines.join('\n').slice(0, 30000));
