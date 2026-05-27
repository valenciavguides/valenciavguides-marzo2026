const fs = require('fs');

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const eol = content.includes('\r\n') ? '\r\n' : '\n';

// U+2019 = right single quotation mark (')
const rsqm = '’';

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log('NOT FOUND: ' + desc); return; }
  content = content.split(from).join(to);
  console.log('OK (' + count + 'x): ' + desc);
}

// ── 1. Fix L´<strong>Umbracle</strong> → <strong>l'Umbracle</strong>
// File has: L + U+00B4 (acute accent) + <strong>Umbracle</strong>
const umbrFrom = 'L´<strong>Umbracle</strong>';
const umbrTo = '<strong>l' + rsqm + 'Umbracle</strong>';
rep(umbrFrom, umbrTo, 'L-acute-<strong>Umbracle</strong> → <strong>l\'Umbracle</strong>');

// ── 2. Normalize "Ciudad de las Artes y las Ciencias" → "y de las Ciencias"
rep('Ciudad de las Artes y las Ciencias', 'Ciudad de las Artes y de las Ciencias', 'y las → y de las Ciencias');
rep('Ciudad de las artes y las ciencias', 'Ciudad de las Artes y de las Ciencias', 'minusculas → normalizar forma');

// ── 3. Fix the typo "y la Ciencias" → correct form + strong
rep('Ciudad de las Artes y la Ciencias', '<strong>Ciudad de las Artes y de las Ciencias</strong>', 'typo: y la Ciencias → y de las Ciencias + strong');

// ── 4. Wrap any remaining untagged "Ciudad de las Artes y de las Ciencias"
const headerRegex = /^\d+[\w. ]*[-–]/;
const placeRegex = /(Ciudad de las Artes y de las Ciencias)/gi;

function applyStrongToLine(line) {
  if (headerRegex.test(line.trim())) return line;
  const parts = line.split(/(<[^>]+>)/);
  let inStrong = false;
  return parts.map((part, i) => {
    if (i % 2 !== 0) {
      if (/^<strong\b/i.test(part)) inStrong = true;
      else if (/^<\/strong>/i.test(part)) inStrong = false;
      return part;
    }
    if (inStrong) return part;
    return part.replace(placeRegex, '<strong>$1</strong>');
  }).join('');
}

const lines = content.split('\n');
let strongAdded = 0;
const result = lines.map(line => {
  const processed = applyStrongToLine(line);
  if (processed !== line) strongAdded++;
  return processed;
});
content = result.join(eol);
console.log('Lineas con strong anadido (Ciudad de las Artes): ' + strongAdded);

fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log('\nArchivo guardado.');

// ── Verificacion ──────────────────────────────────────────────────────────────
const final = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const finalLines = final.split('\n');

const totalCAC = finalLines.filter(l => /ciudad de las artes/i.test(l)).length;
const taggedCAC = finalLines.filter(l => /<strong>ciudad de las artes/i.test(l)).length;
const withDe = finalLines.filter(l => /ciudad de las artes y de las ciencias/i.test(l)).length;
const withoutDe = finalLines.filter(l => /ciudad de las artes y las ciencias/i.test(l)).length;
console.log('\nCiudad de las Artes — total: ' + totalCAC + ', con strong: ' + taggedCAC + ', sin strong: ' + (totalCAC - taggedCAC));
console.log('Con "y de las Ciencias": ' + withDe + ' | Con "y las Ciencias" (restos): ' + withoutDe);

const umbracles = finalLines.filter(l => /umbracle/i.test(l));
console.log('\nUmbracle — ' + umbracles.length + ' ocurrencias:');
umbracles.forEach(l => console.log('  ' + l.replace(/<[^>]+>/g, '').trim().substring(0, 100)));

const doublesStrong = finalLines.filter(l => /<strong>[^<]*<strong>/.test(l)).length;
const totalStrong = (final.match(/<strong>/g) || []).length;
console.log('\nTotal <strong>: ' + totalStrong + ' | Dobles/anidados: ' + doublesStrong);
