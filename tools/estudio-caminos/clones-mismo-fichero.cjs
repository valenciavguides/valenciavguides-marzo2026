const { ROOT, salida } = require('./lib.cjs');
const fs = require('fs'); const path = require('path');
const r = JSON.parse(fs.readFileSync(salida('funciones.json'), 'utf8'));
const MIN = Number(process.argv[2] || 60), JMIN = Number(process.argv[3] || 0.6);
const F = r.functions.map((f, i) => ({ f, i })).filter(x => x.f.nTok >= MIN);
const sh = F.map(({ f }) => { const t = f.text.split(' '); const s = new Set(); for (let k = 0; k + 4 <= t.length; k++) s.add(t.slice(k, k + 4).join(' ')); return s; });
const inv = new Map(); sh.forEach((s, ci) => { for (const g of s) { if (!inv.has(g)) inv.set(g, []); inv.get(g).push(ci); } });
const pc = new Map();
for (const [g, l] of inv) { if (l.length > 60) continue; for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++) { const k = l[a] * 100000 + l[b]; pc.set(k, (pc.get(k) || 0) + 1); } }
const out = [];
for (const [k, c] of pc) {
  const a = Math.floor(k / 100000), b = k % 100000; const A = F[a].f, B = F[b].f;
  const j = c / (sh[a].size + sh[b].size - c);
  if (j < JMIN) continue;
  // anidada (una contiene a la otra por rango de líneas en el mismo fichero) -> descartar
  if (A.file === B.file && ((A.start <= B.start && A.end >= B.end) || (B.start <= A.start && B.end >= A.end))) continue;
  out.push({ j, A, B });
}
out.sort((x, y) => y.j - x.j);
for (const p of out) console.log(`J=${p.j.toFixed(2)} ${p.A.file}:${p.A.start}-${p.A.end} ${p.A.name}[${p.A.nTok}]  ~  ${p.B.file}:${p.B.start}-${p.B.end} ${p.B.name}[${p.B.nTok}]${p.A.text === p.B.text ? ' (IDÉNTICO)' : ''}`);
console.log('pares', out.length);
