const fs = require('fs');

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const eol = content.includes('\r\n') ? '\r\n' : '\n';
const lines = content.split('\n').map(l => l.replace(/\r$/, ''));

// New place names to add <strong> around — sorted longest first
const newNames = [
  'Virgen de los Desamparados',
  'Ayuntamiento de Valencia',
  'Albufera de Valencia',
  'Les Corts Valencianes',
  'Iglesia de Santa Catalina',
  'Cotorra del Mercado',
  'Barrio de la Morería',
  'Barrio de la Catedral',
  'Barrio de la Petxina',
  'Barrio de la Xerea',
  'Barrio del Mercado',
  'Barrio del Carmen',
  'Barrio de Roteros',
  'Plaza de la Virgen',
  'Palacio de la Música',
  'Puente del Ángel',
  'Puente de Madera',
  'Corts Valencianes',
].sort((a, b) => b.length - a.length);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const pattern = newNames.map(escapeRegex).join('|');
const placeRegex = new RegExp(`(${pattern})`, 'giu');
const headerRegex = /^\d+[\w. ]*[-–]/;

function applyStrong(line) {
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

let changed = 0;
const result = lines.map(line => {
  const processed = applyStrong(line);
  if (processed !== line) changed++;
  return processed;
});

content = result.join(eol);
fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log('Líneas con nuevos <strong>: ' + changed);

// Verify each name was found
console.log('\nVerificación:');
for (const name of newNames) {
  const re = new RegExp('<strong>' + escapeRegex(name), 'i');
  const found = re.test(content);
  console.log((found ? 'OK' : 'MISSING') + ': ' + name);
}
