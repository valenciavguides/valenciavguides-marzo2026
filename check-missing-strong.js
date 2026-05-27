const fs = require('fs');

const content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const plainContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

// Known place names that should be <strong> — check if any appear without it
const candidates = [
  // Barrios / neighbourhoods
  'Barrio del Carmen', 'Barrio de la Catedral', 'Barrio de la Seu',
  'Barrio del Mercado', 'barrio del Turia',
  // Bridges not yet in list
  'Puente de Madera', 'Puente Romano', 'Puente del Ángel',
  // Other monuments not caught
  'Les Corts Valencianes', 'Corts Valencianes',
  'Palacio Real', 'Jardín del Real',
  'Ayuntamiento de Valencia', 'Ayuntamiento de València',
  'Iglesia de Santa Catalina',
  'Basílica de Nuestra Señora',
  'Virgen de los Desamparados',
  'Albufera de Valencia',
  'Portal de la Valldigna',
  'Casa del Punt de Gantxo',
  'Cotorra del Mercado',
  // Possible missing references from text
  'Miguelete',
  'Torres de Serranos', 'Torres de Quart',
  'Mercado Central', 'Mercado de Colón',
  'Catedral de Valencia',
  'Plaza de la Virgen', 'Plaza del Ayuntamiento',
  'Estación del Norte',
  'Palau de la Música', 'Palacio de la Música',
];

console.log('Nombres SIN <strong> en el texto:\n');
let found = 0;
for (const name of candidates) {
  const re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  // Count in plain text (without tags)
  const plainMatches = (plainContent.match(re) || []).length;
  // Count in full content including strong tags
  const strongMatches = (content.match(new RegExp('<strong>' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;

  const untagged = plainMatches - strongMatches;
  if (untagged > 0) {
    console.log('  "' + name + '" — ' + untagged + 'x sin <strong> (total en texto: ' + plainMatches + ')');
    found++;
  }
}
if (found === 0) console.log('  Ninguno — todos los candidatos ya tienen <strong>');

// Also scan for patterns that look like proper nouns but have no strong
console.log('\n--- También busco patrones tipo "Barrio de/del..." sin <strong> ---');
const barrios = content.match(/(?<!<strong>)[Bb]arrio (?:de |del |de la )\w+(?:\s+\w+)*/g) || [];
const uniqueBarrios = [...new Set(barrios.map(b => b.trim()))];
uniqueBarrios.forEach(b => {
  if (!b.includes('<')) console.log('  ' + b);
});
