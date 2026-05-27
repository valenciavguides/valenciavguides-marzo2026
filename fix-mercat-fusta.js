const fs = require('fs');

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
let changes = 0;

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log('NOT FOUND: ' + desc); return; }
  content = content.split(from).join(to);
  console.log('OK (' + count + 'x): ' + desc);
  changes += count;
}

// 1. Pont de Fusta → Puente de Madera (remove parenthetical too)
rep('el Pont de Fusta (Puente de madera)', 'el <strong>Puente de Madera</strong>', 'Pont de Fusta con paréntesis');
rep('Pont de Fusta', '<strong>Puente de Madera</strong>', 'Pont de Fusta suelto');

// 2. la Cotorra del Mercat → la Cotorra del Mercado
rep('la Cotorra del Mercat', 'la Cotorra del Mercado', 'Cotorra del Mercat');

// 3. Barrio del Mercat → Barrio del Mercado + <strong>
rep('Barrio del Mercat', '<strong>Barrio del Mercado</strong>', 'Barrio del Mercat');
rep('barrio del Mercat', '<strong>Barrio del Mercado</strong>', 'barrio del Mercat (lowercase)');

// 4. Also ensure Barrio del Mercado (if already there without strong) gets wrapped
// (only text nodes — avoid double-wrapping already-done ones)
const lines = content.split('\n');
let lineChanges = 0;
const result = lines.map(line => {
  // Skip if line has <strong>Barrio del Mercado</strong> already
  if (line.includes('<strong>Barrio del Mercado</strong>')) return line;
  // Also wrap plain "Barrio del Carmen" and other barrio names if missing <strong>
  // We'll handle that in the broader check script
  return line;
});
content = result.join('\n');

fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log('\nTotal cambios:', changes);
