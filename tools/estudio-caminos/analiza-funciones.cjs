// Análisis de clones y homónimos sobre funciones.json (salida de extract-functions.cjs).
const { ROOT, salida } = require('./lib.cjs');
const fs = require('fs');
const path = require('path');
const r = JSON.parse(fs.readFileSync(salida('funciones.json'), 'utf8'));
const F = r.functions;
const MIN_TOK = Number(process.argv[2] || 25);

const loc = f => `${f.file}:${f.start}-${f.end}`;
const out = [];
const log = (...a) => out.push(a.join(' '));

// ---------- 1. mismo nombre en >=2 ficheros ----------
const byName = new Map();
for (const f of F) {
  if (f.name === '<anon>') continue;
  if (!byName.has(f.name)) byName.set(f.name, []);
  byName.get(f.name).push(f);
}
log('=== 1. HOMÓNIMOS: mismo nombre en >=2 ficheros distintos (nTok>=' + MIN_TOK + ') ===');
let nIdent = 0, nDiv = 0;
const divergentNames = [];
for (const [name, arr] of [...byName.entries()].sort()) {
  const files = new Set(arr.map(x => x.file));
  if (files.size < 2) continue;
  const big = arr.filter(x => x.nTok >= MIN_TOK);
  const bigFiles = new Set(big.map(x => x.file));
  if (bigFiles.size < 2) continue;
  const texts = new Map();
  for (const x of big) { if (!texts.has(x.text)) texts.set(x.text, []); texts.get(x.text).push(x); }
  const ident = texts.size === 1;
  if (ident) nIdent++; else { nDiv++; divergentNames.push(name); }
  log(`\n[${ident ? 'IDÉNTICAS' : 'DIVERGEN'}] ${name}  (${big.length} defs en ${bigFiles.size} ficheros, ${texts.size} variante(s) de texto)`);
  let vi = 0;
  for (const [t, xs] of texts) {
    vi++;
    log(`   variante ${vi}: ${xs.map(x => loc(x) + ' [' + x.nTok + ' tok,' + x.how + ']').join(' | ')}`);
  }
}
log(`\nRESUMEN homónimos: idénticos=${nIdent} divergentes=${nDiv}`);

// ---------- 2. cuerpos idénticos con nombres distintos ----------
log('\n=== 2. TEXTO IDÉNTICO en >=2 ficheros con NOMBRES distintos (nTok>=' + Math.max(MIN_TOK, 40) + ') ===');
const byText = new Map();
for (const f of F) {
  if (f.nTok < Math.max(MIN_TOK, 40)) continue;
  if (!byText.has(f.text)) byText.set(f.text, []);
  byText.get(f.text).push(f);
}
for (const [t, xs] of byText) {
  const files = new Set(xs.map(x => x.file));
  const names = new Set(xs.map(x => x.name));
  if (files.size < 2 || names.size < 2) continue;
  log(`\n[TEXTO IDÉNTICO, nombres distintos] ${xs.map(x => loc(x) + ' ' + x.name + ' [' + x.nTok + ']').join(' | ')}`);
}

// ---------- 3. misma forma (identificadores/literales renombrados) ----------
log('\n=== 3. MISMA FORMA (type-2) en >=2 ficheros, texto distinto (nTok>=' + Math.max(MIN_TOK, 60) + ') ===');
const byShape = new Map();
for (const f of F) {
  if (f.nTok < Math.max(MIN_TOK, 60)) continue;
  if (!byShape.has(f.shape)) byShape.set(f.shape, []);
  byShape.get(f.shape).push(f);
}
for (const [s, xs] of byShape) {
  const files = new Set(xs.map(x => x.file));
  const texts = new Set(xs.map(x => x.text));
  if (files.size < 2 || texts.size < 2) continue;
  log(`\n[MISMA FORMA] ${xs.map(x => loc(x) + ' ' + x.name + ' [' + x.nTok + ']').join(' | ')}`);
}

// ---------- 4. casi-duplicados (Jaccard de 4-gramas de tokens) ----------
log('\n=== 4. CASI-DUPLICADOS entre ficheros distintos (Jaccard>=0.70, nTok>=80) ===');
const cand = F.map((f, i) => ({ f, i })).filter(x => x.f.nTok >= 80);
const sh = cand.map(({ f }) => {
  const t = f.text.split(' ');
  const set = new Set();
  for (let k = 0; k + 4 <= t.length; k++) set.add(t.slice(k, k + 4).join(' '));
  return set;
});
const inv = new Map();
sh.forEach((set, ci) => { for (const g of set) { if (!inv.has(g)) inv.set(g, []); inv.get(g).push(ci); } });
const pairCount = new Map();
for (const [g, list] of inv) {
  if (list.length > 40) continue;
  for (let a = 0; a < list.length; a++) for (let b = a + 1; b < list.length; b++) {
    const key = list[a] * 100000 + list[b];
    pairCount.set(key, (pairCount.get(key) || 0) + 1);
  }
}
const pairs = [];
for (const [key, c] of pairCount) {
  const a = Math.floor(key / 100000), b = key % 100000;
  const A = cand[a].f, B = cand[b].f;
  if (A.file === B.file) continue;
  const j = c / (sh[a].size + sh[b].size - c);
  if (j >= 0.70) pairs.push({ A, B, j });
}
pairs.sort((x, y) => y.j - x.j);
for (const p of pairs) log(`J=${p.j.toFixed(2)}  ${loc(p.A)} ${p.A.name} [${p.A.nTok}]  ~  ${loc(p.B)} ${p.B.name} [${p.B.nTok}]${p.A.text === p.B.text ? '  (TEXTO IDÉNTICO)' : ''}`);
log(`\nRESUMEN casi-duplicados: ${pairs.length} pares`);

fs.writeFileSync(salida('analisis-funciones.txt'), out.join('\n'));
console.log('escrito analisis-funciones.txt, líneas:', out.length);
