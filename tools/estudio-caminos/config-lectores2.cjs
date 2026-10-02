const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { ROOT, salida } = require('./lib.cjs');
(async () => {
  const mod = await import(pathToFileURL(path.join(ROOT, 'js/config.js')).href);
  const CONFIG = mod.CONFIG;
  const leaves = [];
  (function rec(o, p) { for (const [k, v] of Object.entries(o)) { const np = p.concat(k); if (v && typeof v === 'object' && !Array.isArray(v)) rec(v, np); else leaves.push(np); } })(CONFIG, []);
  const files = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html') || f === 'sw.js') files.push(f);
  for (const f of fs.readdirSync(path.join(ROOT, 'js'))) if (f.endsWith('.js') && !/^(audios|retos|textos|coordenadas|aventuras-ID|traducciones-ui|config)/.test(f)) files.push('js/' + f);
  const corp = files.map(f => ({ f, L: fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n') }));
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let dead = 0, live = 0; const rows = [];
  for (const p of leaves) {
    const tail = p.slice(-2);
    const re = p.length >= 2 ? new RegExp('(?<![A-Za-z0-9_$])' + esc(tail[0]) + '\\??\\.' + esc(tail[1]) + '(?![A-Za-z0-9_$])') : null;
    const re1 = p.length === 1 ? new RegExp('(CONFIG|Config|__vv_config|cfg)\\??\\.' + esc(p[0]) + '(?![A-Za-z0-9_$])') : null;
    const hits = [];
    for (const { f, L } of corp) L.forEach((ln, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(ln)) return;
      if ((re1 ? re1.test(ln) : re.test(ln))) hits.push(f + ':' + (i + 1));
    });
    if (p.length >= 2) {
      const reD = new RegExp('\\{[^}]*\\b' + esc(p[p.length - 1]) + '\\b[^}]*\\}\\s*=\\s*[^;]*\\b' + esc(p[p.length - 2]) + '\\b');
      for (const { f, L } of corp) L.forEach((ln, i) => { if (reD.test(ln)) hits.push(f + ':' + (i + 1) + '(destr)'); });
    }
    rows.push({ p: p.join('.'), n: hits.length, hits: hits.slice(0, 5) });
    if (hits.length) live++; else dead++;
  }
  for (const r of rows) console.log(r.n === 0 ? 'SIN LECTOR ' : '  lee      ', r.p.padEnd(40), r.n, r.hits.join(' '));
  console.log('\nhojas:', leaves.length, ' con lectura de ruta:', live, ' sin lectura de ruta:', dead);
})();
