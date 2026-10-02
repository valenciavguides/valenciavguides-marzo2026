// Completitud de las tablas de js/traducciones-ui.js: toda tabla indexada por idioma debe tener los mismos idiomas, y cada entrada
// la misma forma que la española (tipo, nº de claves/elementos, marcadores {x} y %s/%d, saltos de línea, entidades HTML).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const acorn = require(path.join(ROOT, 'node_modules/acorn'));
const src = fs.readFileSync(process.argv[2] || path.join(ROOT, 'js/traducciones-ui.js'), 'utf8').replace(/\r\n/g, '\n');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
const LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ca', 'zh', 'ja', 'ru', 'ar', 'nl', 'ko', 'pl', 'val'];
const keyName = (p) => p.type === 'Property' ? (p.key.type === 'Identifier' && !p.computed ? p.key.name : (p.key.type === 'Literal' ? String(p.key.value) : null)) : null;
// 1) todas las ObjectExpression de nivel superior (export const X = {...}) y su conjunto de claves
const tables = [];
for (const n of ast.body) {
  let decl = null, exported = false;
  if (n.type === 'ExportNamedDeclaration' && n.declaration && n.declaration.type === 'VariableDeclaration') { decl = n.declaration; exported = true; }
  else if (n.type === 'VariableDeclaration') decl = n;
  if (!decl) continue;
  for (const d of decl.declarations) if (d.id.type === 'Identifier' && d.init && d.init.type === 'ObjectExpression') tables.push({ name: d.id.name, node: d.init, line: d.loc.start.line, exported });
}
// idiomas: el conjunto de claves que más se repite entre las tablas con >= 6 claves de 2 letras
const freq = {}; for (const t of tables) { const ks = t.node.properties.map(keyName).filter(Boolean); const lk = ks.filter(k => /^[a-z]{2,3}$/.test(k)); if (lk.length >= 6) { const s = lk.slice().sort().join(','); freq[s] = (freq[s] || 0) + 1; } }
const top = Object.entries(freq).sort((a, b) => b[1] - a[1]); const IDIOMAS = top[0][0].split(',');
const out = []; const P = s => out.push(s);
P(`tablas de nivel superior con objeto literal: ${tables.length}; conjuntos de idiomas más frecuentes: ${top.slice(0, 4).map(([s, c]) => `${c}× [${s}]`).join('  |  ')}`);
P(`IDIOMAS de referencia: ${IDIOMAS.join(',')} (${IDIOMAS.length})`);
// forma de un valor
function marcadores(s) { return (s.match(/\{[A-Za-z_0-9]+\}|%[sd]|\$\{[^}]+\}/g) || []).sort().join('|'); }
function forma(node) {
  if (!node) return 'null';
  switch (node.type) {
    case 'Literal': return node.value === null ? 'null' : typeof node.value === 'string' ? 'str' : typeof node.value;
    case 'TemplateLiteral': return 'str';
    case 'ArrayExpression': return 'arr' + node.elements.length;
    case 'ObjectExpression': return 'obj{' + node.properties.map(keyName).filter(Boolean).sort().join(',') + '}';
    case 'ArrowFunctionExpression': case 'FunctionExpression': return 'fn' + node.params.length;
    default: return node.type;
  }
}
const texto = (node) => node && node.type === 'Literal' && typeof node.value === 'string' ? node.value : node && node.type === 'TemplateLiteral' ? node.quasis.map(q => q.value.cooked).join('${}') : null;
const enlaces = []; let tablasIdioma = 0; const problemas = []; const iguales = []; const vacias = []; const residuo = [];
for (const t of tables) {
  const props = t.node.properties; const ks = props.map(keyName);
  const lk = ks.filter(k => IDIOMAS.includes(k));
  if (lk.length < 3) { // no es una tabla por idioma de primer nivel; ¿tiene claves hijas por idioma?
    const hijas = props.filter(p => p.type === 'Property' && p.value && p.value.type === 'ObjectExpression' && p.value.properties.map(keyName).filter(k => IDIOMAS.includes(k)).length >= 6);
    const llamadas = props.filter(p => p.type === 'Property' && p.value && p.value.type === 'CallExpression' && p.value.arguments[0] && p.value.arguments[0].type === 'ObjectExpression');
    if (llamadas.length) { for (const h of llamadas) { check(`${t.name}.${keyName(h)}`, h.value.arguments[0], h.loc.start.line); const enl = h.value.arguments[1]; const v = enl ? (enl.type === 'Literal' ? enl.value : '<expr>') : null; enlaces.push([`${t.name}.${keyName(h)}`, v]); } continue; }
    if (!hijas.length) { residuo.push(`${t.name} (línea ${t.line}): sin idiomas de primer nivel ni claves hijas por idioma`); continue; }
    // tabla de tablas: cada clave hija es una tabla por idioma
    for (const h of hijas) check(`${t.name}.${keyName(h)}`, h.value, h.loc.start.line);
    continue;
  }
  check(t.name, t.node, t.line);
}
function check(nombre, node, line) {
  tablasIdioma++;
  const props = node.properties.filter(p => p.type === 'Property'); const byLang = {}; for (const p of props) { const k = keyName(p); if (k) byLang[k] = p.value; }
  const faltan = IDIOMAS.filter(l => !(l in byLang)); const sobran = Object.keys(byLang).filter(l => !IDIOMAS.includes(l));
  if (faltan.length) problemas.push(`${nombre} (línea ${line}): faltan idiomas ${faltan.join(',')}`);
  if (sobran.length) problemas.push(`${nombre} (línea ${line}): claves no idioma ${sobran.join(',')}`);
  const ref = byLang.es; if (!ref) return; const fr = forma(ref);
  for (const l of IDIOMAS) { if (l === 'es' || !(l in byLang)) continue; const v = byLang[l]; const f = forma(v);
    if (f !== fr) { problemas.push(`${nombre}[${l}] (línea ${v.loc.start.line}): forma ${f} frente a es ${fr}`); continue; }
    const te = texto(ref), tl = texto(v);
    if (tl !== null && te !== null) {
      if (tl.trim() === '') vacias.push(`${nombre}[${l}] (línea ${v.loc.start.line}): cadena vacía`);
      if (marcadores(te) !== marcadores(tl)) problemas.push(`${nombre}[${l}] (línea ${v.loc.start.line}): marcadores ${JSON.stringify(marcadores(tl))} frente a es ${JSON.stringify(marcadores(te))}`);
      if (tl === te && te.length > 12 && !/^[\d\s.,:;!?¡¿%+\-–—/()·•→←↑↓x×\u{1F000}-\u{1FFFF}\u2600-\u27BF]+$/u.test(te)) iguales.push(`${nombre}[${l}] (línea ${v.loc.start.line}): texto idéntico al español: ${JSON.stringify(te.slice(0, 60))}`);
    }
    // arrays/objetos: comparar elemento a elemento los literales de texto
    if (ref.type === 'ArrayExpression' && v.type === 'ArrayExpression') ref.elements.forEach((e, i) => { const a = texto(e), b = texto(v.elements[i]); if (a !== null && b !== null && marcadores(a) !== marcadores(b)) problemas.push(`${nombre}[${l}][${i}] (línea ${v.elements[i].loc.start.line}): marcadores ${JSON.stringify(marcadores(b))} frente a es ${JSON.stringify(marcadores(a))}`); else if (a !== null && b === null && v.elements[i] && v.elements[i].type === 'Literal' && v.elements[i].value === null) problemas.push(`${nombre}[${l}][${i}] (línea ${v.elements[i].loc.start.line}): null frente a texto en es`); });
    if (ref.type === 'ObjectExpression' && v.type === 'ObjectExpression') for (const rp of ref.properties) { const rk = keyName(rp); const lp = v.properties.find(p => keyName(p) === rk); if (!lp) continue; const a = texto(rp.value), b = texto(lp.value); if (a !== null && b !== null) { if (b.trim() === '') vacias.push(`${nombre}[${l}].${rk} (línea ${lp.loc.start.line}): cadena vacía`); if (marcadores(a) !== marcadores(b)) problemas.push(`${nombre}[${l}].${rk} (línea ${lp.loc.start.line}): marcadores ${JSON.stringify(marcadores(b))} frente a es ${JSON.stringify(marcadores(a))}`); if (a === b && a.length > 12 && !/^[\d\s.,:;!?¡¿%+\-–—/()·•→←↑↓x×\u{1F000}-\u{1FFFF}\u2600-\u27BF]+$/u.test(a)) iguales.push(`${nombre}[${l}].${rk} (línea ${lp.loc.start.line}): texto idéntico al español: ${JSON.stringify(a.slice(0, 60))}`); } }
  }
}
{
  const byName = Object.fromEntries(tables.map(t => [t.name, t]));
  const keysOf = (n) => byName[n] ? byName[n].node.properties.map(keyName).filter(Boolean) : null;
  const preg = keysOf('PREGUNTAS_CHAT'), resp = keysOf('RESPUESTAS_CHAT'); const temasNode = byName['TEMAS_AGRUPADOS_CHAT'];
  const temas = temasNode ? temasNode.node.properties.map(p => [keyName(p), p.value.elements.map(e => e.value)]) : null;
  P('--- integridad de referencias del chat ---');
  if (preg && resp && temas) {
    const enTemas = temas.flatMap(([, ks]) => ks); const dup = enTemas.filter((k, i) => enTemas.indexOf(k) !== i);
    const sinResp = preg.filter(k => !resp.includes(k)), sinPreg = resp.filter(k => !preg.includes(k));
    const sinTema = preg.filter(k => !enTemas.includes(k)), temaSinPreg = enTemas.filter(k => !preg.includes(k));
    P(`PREGUNTAS_CHAT ${preg.length} claves; RESPUESTAS_CHAT ${resp.length}; en temas ${enTemas.length} en ${temas.length} temas; duplicadas entre temas: [${dup.join(',')}]; pregunta sin respuesta: [${sinResp.join(',')}]; respuesta sin pregunta: [${sinPreg.join(',')}]; pregunta sin tema: [${sinTema.join(',')}]; clave de tema sin pregunta: [${temaSinPreg.join(',')}]`);
    const ordenNode = byName['ORDEN_TEMAS_CHAT']; if (ordenNode && ordenNode.node.type === 'ArrayExpression') P('ORDEN_TEMAS_CHAT es array'); 
  } else P('no se encontraron las tres tablas del chat');
}
P(`tablas por idioma analizadas: ${tablasIdioma}; sin ser tabla por idioma (residuo): ${residuo.length}`);
P('enlaces de RESPUESTAS_CHAT (valor del 2º argumento de _rChat): ' + JSON.stringify([...new Set(enlaces.map(e => String(e[1])))]) + ' sobre ' + enlaces.length + ' entradas');
P(''); P(`=== PROBLEMAS DE FORMA / IDIOMAS / MARCADORES: ${problemas.length} ===`); for (const x of problemas.slice(0, 200)) P('  ' + x);
P(''); P(`=== CADENAS VACÍAS: ${vacias.length} ==="`); for (const x of vacias.slice(0, 60)) P('  ' + x);
P(''); P(`=== TEXTO IDÉNTICO AL ESPAÑOL en otro idioma (longitud > 12, sin ser solo números/símbolos): ${iguales.length} ===`); for (const x of iguales.slice(0, 120)) P('  ' + x);
P(''); P('=== RESIDUO (objetos de nivel superior que no son tabla por idioma) ==='); for (const x of residuo.slice(0, 80)) P('  ' + x);
fs.writeFileSync(salida('i18n-completitud.txt'), out.join('\n'));
console.log(out.join('\n').slice(0, 40000));
