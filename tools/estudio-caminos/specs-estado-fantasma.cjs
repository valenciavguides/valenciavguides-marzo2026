// Claves de primer nivel de estadoPadre que leen los specs (globalThis.estadoPadre.X / globalThis.estado.X) y que producción nunca escribe
// ni declara en el literal. Producción = estado-writes.json (extractor de estado) + las claves del literal globalThis.estadoPadre = {...} y del estado del state-manager.
const fs = require('fs'); const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const writes = JSON.parse(require('fs').readFileSync(salida('estado-writes.json'), 'utf8'));
const escritas = new Set(writes.filter(w => ['estado', 'estadoPadre', 'estadoScript1', 'est'].includes(w.path.split('.')[0])).map(w => w.path.split('.')[1]).filter(Boolean));
// claves del literal estadoPadre (codigo-padre.html:4224) y del estado de state-manager.js
function parse(code) { for (const st of ['module', 'script']) { try { return acorn.parse(code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); } catch (e) {} } return null; }
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
const keyName = (p) => p.type === 'Property' ? (p.key.type === 'Identifier' && !p.computed ? p.key.name : (p.key.type === 'Literal' ? String(p.key.value) : null)) : null;
const html = fs.readFileSync(path.join(ROOT, 'codigo-padre.html'), 'utf8').replace(/\r\n/g, '\n');
for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) { if (/\bsrc\s*=/.test(m[1])) continue; const ast = parse(m[2]); if (!ast) continue; walk(ast, (n) => { if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && n.left.property.name === 'estadoPadre' && n.right.type === 'ObjectExpression') n.right.properties.forEach(p => { const k = keyName(p); if (k) escritas.add(k); }); if (n.type === 'VariableDeclarator' && n.id.name === 'estado' && n.init && n.init.type === 'ObjectExpression') n.init.properties.forEach(p => { const k = keyName(p); if (k) escritas.add(k); }); }, []); }
const sm = parse(fs.readFileSync(path.join(ROOT, 'js/state-manager.js'), 'utf8').replace(/\r\n/g, '\n')); if (sm) walk(sm, (n) => { if (n.type === 'ObjectExpression') n.properties.forEach(p => { const k = keyName(p); if (k) escritas.add(k); }); }, []);
const specs = fs.readdirSync(path.join(ROOT, 'tests/e2e')).filter(f => f.endsWith('.js')).map(f => 'tests/e2e/' + f);
const leidas = {}; let total = 0;
for (const rel of specs) { const ast = parse(fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n')); if (!ast) continue; const asignadasEnSpec = new Set();
  walk(ast, (n) => { if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed) asignadasEnSpec.add(n.left.property.name); }, []);
  walk(ast, (n, ps) => {
    if (n.type !== 'MemberExpression' || n.computed || n.property.type !== 'Identifier') return;
    const o = n.object; let esEstado = false;
    if (o.type === 'MemberExpression' && !o.computed && ['estadoPadre', 'estado'].includes(o.property.name) && o.object.type === 'Identifier' && ['globalThis', 'window'].includes(o.object.name)) esEstado = true;
    if (o.type === 'ChainExpression') return;
    if (!esEstado) return; const par = ps[ps.length - 1]; if (par && par.type === 'AssignmentExpression' && par.left === n) return; total++;
    const k = n.property.name; if (escritas.has(k) || asignadasEnSpec.has(k)) return; (leidas[k] ||= []).push(`${rel}:${n.loc.start.line}`);
  }, []);
}
console.log('claves de primer nivel escritas/declaradas en producción:', escritas.size, '; lecturas de globalThis.estadoPadre.X / estado.X en specs:', total, '; claves sin escritor:', Object.keys(leidas).length);
for (const [k, s] of Object.entries(leidas).sort()) console.log('  ' + k.padEnd(28) + s.length + ' sitios: ' + [...new Set(s)].slice(0, 4).join(' | '));
