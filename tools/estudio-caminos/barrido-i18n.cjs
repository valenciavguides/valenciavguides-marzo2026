// Barrido i18n: literales en español asignados en tiempo de ejecución a texto de usuario (textContent/innerText/innerHTML/title/
// placeholder/alt/aria-label, alert/confirm/prompt) en los frames y módulos. Imprime residuo: nº de asignaciones de texto cuyo valor
// NO es literal (viene de tabla/variable) para distinguir "mirado y es dinámico" de "no detectado".
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const DATOS = new Set(['js/aventuras-ID-padre.js','js/coordenadas-aventuras.js','js/retos-aventuras.js','js/textos-aventuras.js','js/audios-aventuras.js','js/traducciones-ui.js','js/puzzles-aventuras.js','js/terminos-aventuras.js','js/agradecimientos-aventuras.js','js/mapa-vintage-aventuras.js']);
function listFiles() { const o = []; for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) o.push(f); for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !DATOS.has('js/' + f) && f !== 'server.js') o.push('js/' + f); return o; }
function blocksOf(rel, src) {
  if (!rel.endsWith('.html')) return [{ code: src, off: 0 }];
  const b = []; const clean = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (a, o, c, e) => o + c.replace(/[^\n]/g, ' ') + e);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(clean)) !== null) { const at = m[1] || ''; if (/\bsrc\s*=/.test(at)) continue; const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(at); const ty = t ? t[1].toLowerCase() : ''; if (ty && ty !== 'module' && ty !== 'text/javascript' && ty !== 'application/javascript') continue; const cs = m.index + m[0].indexOf('>') + 1; b.push({ code: src.slice(cs, cs + m[2].length), off: src.slice(0, cs).split('\n').length - 1 }); }
  return b;
}
function walk(n, v, ps) { if (!n || typeof n.type !== 'string') return; v(n, ps); const np = ps.concat(n); for (const k of Object.keys(n)) { if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue; const x = n[k]; if (Array.isArray(x)) x.forEach(c => c && typeof c.type === 'string' && walk(c, v, np)); else if (x && typeof x.type === 'string') walk(x, v, np); } }
function txt(n) { if (!n) return '?'; if (n.type === 'Identifier') return n.name; if (n.type === 'ThisExpression') return 'this'; if (n.type === 'MemberExpression') return txt(n.object) + (n.computed ? '[…]' : '.' + n.property.name); if (n.type === 'CallExpression') return txt(n.callee) + '()'; if (n.type === 'ChainExpression') return txt(n.expression); if (n.type === 'Literal') return JSON.stringify(n.value); return n.type; }
function fnName(ps) { for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; if (p.type === 'FunctionDeclaration' && p.id) return p.id.name; if (p.type === 'FunctionExpression' || p.type === 'ArrowFunctionExpression') { if (p.id && p.id.name) return p.id.name; const q = ps[i - 1]; if (q && q.type === 'VariableDeclarator' && q.id.type === 'Identifier') return q.id.name; if (q && q.type === 'AssignmentExpression' && q.left.type === 'MemberExpression') return '→' + (q.left.property.name || '?'); if (q && q.type === 'Property' && q.key) return '→' + String(q.key.name || q.key.value); } } return '<top>'; }
const TEXT_PROPS = new Set(['textContent', 'innerText', 'innerHTML', 'title', 'placeholder', 'alt', 'ariaLabel', 'label']);
const ATTRS = new Set(['title', 'aria-label', 'placeholder', 'alt']);
// español: acentos/ñ/¿¡ o palabras vacías españolas
const ES = /[ñ¿¡áéíóúü]|\b(el|la|los|las|del|por|para|que|con|una|sin|seleccione|favor|cargando|cerrar|aceptar|cancelar|enviar|volver|siguiente|anterior|continuar|reintentar|guardar|ayuda|mapa|parada|tramo|aventura|ubicación|reto|respuesta|audio)\b/i;
const out = []; let dinamicas = 0, literalesNoEs = 0, total = 0;
function strOf(n) {
  if (!n) return null;
  if (n.type === 'Literal' && typeof n.value === 'string') return n.value;
  if (n.type === 'TemplateLiteral') return n.quasis.map(q => q.value.cooked).join('${}');
  if (n.type === 'BinaryExpression' && n.operator === '+') { const a = strOf(n.left), b = strOf(n.right); if (a !== null && b !== null) return a + b; if (a !== null) return a + '${}'; if (b !== null) return '${}' + b; }
  return null;
}
for (const rel of listFiles()) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
  for (const b of blocksOf(rel, src)) {
    let ast = null; for (const st of ['module', 'script']) { try { ast = acorn.parse(b.code, { ecmaVersion: 'latest', sourceType: st, locations: true, allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true }); break; } catch (e) {} }
    if (!ast) continue;
    walk(ast, (n, ps) => {
      const line = n.loc.start.line + b.off; let kind = null, val = null, node = null;
      if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && !n.left.computed && TEXT_PROPS.has(n.left.property.name)) { kind = n.left.property.name; node = n.right; }
      else if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && /^(alert|confirm|prompt)$/.test(n.callee.name)) { kind = n.callee.name; node = n.arguments[0]; }
      else if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed && n.callee.property.name === 'setAttribute' && n.arguments[0] && n.arguments[0].type === 'Literal' && ATTRS.has(n.arguments[0].value)) { kind = 'attr:' + n.arguments[0].value; node = n.arguments[1]; }
      if (!kind) return;
      total++;
      val = strOf(node);
      if (val === null) { dinamicas++; return; }
      if (ES.test(val) && /[A-Za-zÁÉÍÓÚáéíóúñ]{3,}/.test(val.replace(/<[^>]*>/g, ''))) out.push({ rel, line, fn: fnName(ps), kind, val: val.length > 110 ? val.slice(0, 110) + '…' : val });
      else literalesNoEs++;
    }, []);
  }
}
const per = {}; for (const o of out) per[o.rel] = (per[o.rel] || 0) + 1;
fs.writeFileSync(salida('barrido-i18n.txt'), out.map(o => `${o.rel}:${o.line} [${o.fn}] ${o.kind} = ${JSON.stringify(o.val)}`).join('\n'));
console.log('asignaciones de texto totales:', total, ' dinámicas (no literal):', dinamicas, ' literales no-ES o sin letras:', literalesNoEs, ' literales ES:', out.length);
console.log(JSON.stringify(per));
