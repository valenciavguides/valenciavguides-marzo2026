const fs = require('fs');
const c = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const lines = c.split('\n');

// All apostrophe-like characters to detect
// U+0027 ', U+00B4 ´, U+2018 ', U+2019 ', U+02BC ʼ, U+0060 `
const aposRe = /[lL]['´‘’ʼ`][A-Za-zÀ-ɏ]/g;

const found = new Map();
lines.forEach((l, i) => {
  const plain = l.replace(/<[^>]+>/g, ' ');
  let m;
  while ((m = aposRe.exec(plain)) !== null) {
    const ctx = plain.substring(Math.max(0, m.index - 8), m.index + 35).trim();
    const key = m[0];
    if (!found.has(key)) found.set(key, []);
    found.get(key).push('L' + (i + 1) + ': ...' + ctx + '...');
  }
});

for (const [k, v] of found) {
  const chars = [...k].map(ch => ch + ':U+' + ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');
  const correct = k[0] === 'l' && k.charCodeAt(1) === 0x2019;
  console.log('\n=== ' + JSON.stringify(k) + ' (' + chars + ') ' + (correct ? '[CORRECTO]' : '[PROBLEMA]') + ' — ' + v.length + ' ocurrencias ===');
  v.slice(0, 8).forEach(x => console.log('  ' + x));
  if (v.length > 8) console.log('  ... y ' + (v.length - 8) + ' más');
}
if (found.size === 0) console.log('No se encontraron patrones l/L + apostrofe.');
