const fs = require('fs');

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const eol = content.includes('\r\n') ? '\r\n' : '\n';
let lines = content.split('\n').map(l => l.replace(/\r$/, ''));

// ── PARTE 1: Correcciones de texto ──────────────────────────────────────────

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log('NOT FOUND: ' + desc); return; }
  content = content.split(from).join(to);
  console.log('OK (' + count + 'x): ' + desc);
}

// L80: minúscula tras punto
rep('respectivamente. el número 6.', 'respectivamente. El número 6.', 'L80 minúscula tras punto');

// L1035: espacio antes de punto
rep('hombro . Calces', 'hombro. Calces', 'L1035 espacio antes de punto');

// L1145: minúscula tras punto
rep('espacio. este es un lugar', 'espacio. Este es un lugar', 'L1145 minúscula tras punto');

// L1184: ¿Hola! !¡Muy buenas! → ¡Hola! ¡Muy buenas!
rep('¿Hola! !¡Muy buenas!', '¡Hola! ¡Muy buenas!', 'L1184 signos de exclamación incorrectos');

// L4374: Arabe → árabe
rep('"Arabe"', '"árabe"', 'L4374 Arabe sin tilde');
rep('la palabra Arabe', 'la palabra árabe', 'L4374 Arabe sin tilde (variant)');

// L1477 + L1615: l´Umbracle / L´Umbracle → <strong>l'Umbracle</strong>
rep("l´Umbracle", '<strong>l\'Umbracle</strong>', 'l´Umbracle → strong + apóstrofo');
rep("L´Umbracle", '<strong>l\'Umbracle</strong>', 'L´Umbracle → strong + l minúscula');

// ── PARTE 2: <strong> para Ciudad de las Artes (variantes sin strong) ────────

// Re-split after text changes
content = content; // ensure latest
const headerRegex = /^\d+[\w. ]*[-–]/;

// Names to add strong — Ciudad variants + anything else missing
const missingNames = [
  'Ciudad de las Artes y de las Ciencias',  // variant with extra "de"
  'Ciudad de las Artes y las Ciencias',       // base form (catch remaining untagged)
].sort((a, b) => b.length - a.length);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const pattern = missingNames.map(escapeRegex).join('|');
const placeRegex = new RegExp(`(${pattern})`, 'giu');

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

const resultLines = content.split('\n').map(l => l.replace(/\r$/, '')).map(applyStrongToLine);
content = resultLines.join(eol);

fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log('\nArchivo guardado.');

// ── VERIFICACIÓN ────────────────────────────────────────────────────────────
const final = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const finalLines = final.split('\n');

const totalCAC = finalLines.filter(l => /ciudad de las artes/i.test(l)).length;
const taggedCAC = finalLines.filter(l => l.toLowerCase().includes('<strong>ciudad de las artes')).length;
console.log('\nCiudad de las Artes — total: ' + totalCAC + ', con strong: ' + taggedCAC + ', sin strong: ' + (totalCAC - taggedCAC));

const umbracles = finalLines.filter(l => /umbracle/i.test(l));
console.log('Umbracle — ' + umbracles.length + ' ocurrencias:');
umbracles.forEach(l => console.log('  ' + l.replace(/<[^>]+>/g,'').trim().substring(0, 90)));

const doublesStrong = finalLines.filter(l => /<strong>[^<]*<strong>/.test(l)).length;
const totalStrong = (final.match(/<strong>/g)||[]).length;
console.log('Total <strong>: ' + totalStrong + ' | Dobles/anidados: ' + doublesStrong);
