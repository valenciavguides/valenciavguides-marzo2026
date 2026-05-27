const fs = require('fs');

// All place names extracted from textos-aventuras.js comments
const allNames = [
  "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe",
  "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe",
  "Palacio Arzobispal, Puerta Románica de la Catedral y Torre del Miguelete",
  "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias",
  "Ruinas del Palacio real de Valencia y Montículo del General Javier Elio",
  "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía",
  "Palacio del Marqués de Dos Aguas \"Museo Nacional de Cerámica\"",
  "Plaza de la Virgen - Historia de la Catedral de Valencia",
  "Iglesia de los Santos Juanes o San Juan del Mercado 1",
  "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
  "Plaza de la Virgen - Cimborrio Catedral de Valencia",
  "Antigua Puerta Judía de la Muralla en Calle Colón",
  "Plaza Lope de Vega - Iglesia de Santa Catalina 2",
  "Alquería de Canet y Museo de Ciencias Naturales",
  "Plaza Lope de Vega - Iglesia de Santa Catalina",
  "Torre Barroca de la Iglesia de Santa Catalina",
  "Iglesia Santo Tomás Apostol y San Felipe Neri",
  "Torre del Miguelete y Puerta de los Hierros",
  "Centro Cultural Contemporáneo \"El Carmen\" 2",
  "Museo y Colegio del Arte Mayor de la Seda 2",
  "Arco Novo Catedral y Puerta Negra Basílica",
  "Centro Cultural Contemporáneo \"El Carmen\"",
  "Museo y Colegio del Arte Mayor de la Seda",
  "Puerta Gótica de la Catedral de Valencia",
  "Centro Cultural Contemporáneo: El Carmen",
  "Plaza Lope de Vega - Edificio estrecho",
  "Edificio del Ayuntamiento de València",
  "Instituto Valenciano de Arte Moderno",
  "Calle Caballeros → Plaza del Tossal",
  "Plaza de la Virgen - Fuente Neptuno",
  "Ciudad de las Artes y las Ciencias",
  "Calle Colón → Casa de los Dragones",
  "Plaza de la Virgen - Introducción",
  "Torre Barroca de Santa Catalina 2",
  "FINAL: Torres de Serranos - Final",
  "Circuito urbano de educación vial",
  "Portón del Convento de San Julián",
  "Museo de Prehistoria y Etnología",
  "Museo de prehistoria y Etnología",
  "Vista de la Catedral, Cimborrio",
  "FINAL: Torres de Serranos Final",
  "Torre Barroca de Santa Catalina",
  "Puerta Románica de la Catedral",
  "Iglesia de los Santos Juanes 2",
  "Plaza del Doctor López Collado",
  "Parroquia de la Santísima Cruz",
  "Museo arqueológico La Almoína",
  "Edificio Suay - La Equitativa",
  "Plaza de la Virgen - Basílica",
  "Iglesia San Juan del Hospital",
  "Panel cerámico muro Catedral",
  "Iglesia de los Santos Juanes",
  "Iglesia de San Nicolás FRONT",
  "Plaza de la Virgen - Ofrenda",
  "Iglesia de San Nicolás BACK",
  "Centro Puente de Serranos 1",
  "Centro Puente de Serranos 2",
  "Ruinas del Jardín del Turia",
  "Museo de Ciencias Naturales",
  "Plaza de Toros de València",
  "Plaza Doctor López Collado",
  "Plaza Milagro del Mocaoret",
  "Torres de Serranos - Final",
  "Capilla exterior catedral",
  "Edificio del Ayuntamiento",
  "Estación del Norte - Tren",
  "Palacio de Comunicaciones",
  "Palacio de la Generalitat",
  "Centro Puente de Serranos",
  "Entrada Jardínes del Real",
  "Biblioteca del Hospital 2",
  "Plaza Décimo Junio Bruto",
  "Lonja entrada visitantes",
  "Centro Puente Serranos 1",
  "Centro Puente Serranos 2",
  "Torres de Serranos Front",
  "Torres de Serranos Final",
  "Calle Muro de Santa Ana",
  "Casa del Punt de Gantxo",
  "Palau de la Generalitat",
  "Puente de la Exposición",
  "Museo de Corpus Christi",
  "Mercado de Colón Back 2",
  "Biblioteca del Hospital",
  "Iglesia de la Milagrosa",
  "Iglesia de San Lorenzo",
  "Plaza del Ayuntamiento",
  "Iglesia de San Nicolás",
  "Portal de la Valldigna",
  "Puente l'Assut de l'Or",
  "Centro Puente Serranos",
  "Mercado de Colón Front",
  "Palacio de los Borgia",
  "Iglesia Santos Juanes",
  "Calle de los Serranos",
  "Torre del Miguelete 2",
  "Puerta de los Hierros",
  "Paseo de las Palmeras",
  "Jardín de la Rosaleda",
  "Estanque de los patos",
  "Mercado de Colón Back",
  "calle Muro Santa Ana",
  "Refugio Guerra Civil",
  "Puente de las Flores",
  "Ágora y Oceanogràfic",
  "Catedral de Valencia",
  "Estadio de Atletismo",
  "Casa de los Dragones",
  "calle del Hospital 2",
  "calle del Hospital 3",
  "Plaza de la Almoína",
  "Torre del Miguelete",
  "Palacio de Justicia",
  "Fundación Bancaja 1",
  "Fundación Bancaja 2",
  "Casa de los Gatos 2",
  "Casa de los Gatos 3",
  "Casa de los Gatos 4",
  "Puente 9 de Octubre",
  "Pechina en el Turia",
  "Torres de Serranos",
  "Plaza de la Virgen",
  "Museo Arqueológico",
  "Palacio Arzobispal",
  "Fuente del Negrito",
  "Plaza del Tossal 2",
  "Plaza Lope de Vega",
  "Puente de Aragón 1",
  "Puente de Aragón 2",
  "Palau de la música",
  "Palau de la Música",
  "Parque de Cabecera",
  "Puente de San José",
  "Mercado de Colón 1",
  "Mercado de Colón 2",
  "Mercado de Colón 3",
  "Estación del Norte",
  "Calle del Hospital",
  "calle del Hospital",
  "Plaza de la crida",
  "Plaza de la crída",
  "Casa estilo Árabe",
  "Banco de Valencia",
  "Lonja de Valencia",
  "Rodeando la Lonja",
  "Plaza del Negrito",
  "Plaza de la Crída",
  "Jardines del Real",
  "Casa de los Gatos",
  "Museo de Historia",
  "Mercado central 2",
  "Torres de Quart 1",
  "Torres de Quart 2",
  "Calle Caballeros",
  "Plaza del Tossal",
  "Puente de Aragón",
  "Puente de la Mar",
  "Puerta de la Mar",
  "Mercado de Colón",
  "Mercado Central",
  "Mercado central",
  "Torre del Ángel",
  "Puente Amarillo",
  "Puente del Real",
  "Torres de Quart",
  "Plaza de Toros",
  "Molino del Sol",
  "Plaza Redonda",
  "Molino de Sol",
  "Hemisféric",
  "Tapinería",
  "Gulliver",
  "Umbracle",
  "Na Turia",
  "Bioparc",
  "Lonja",
];

// Extra names known to appear in text but not extracted from comments
const extraNames = [
  "Jardín del Turia",
  "Jardines del Turia",
  "río Turia",
  "Parque de Gulliver",
  "Oceanogràfic",
  "Palacio de las Artes Reina Sofía",
  "Palau de les Arts",
  "Barrio del Carmen",
  "Barrio de la Catedral",
  "Barrio de la Seu",
  "Puerta de Serranos",
  "Puente de Serranos",
  "Convento de San Julián",
  "Iglesia de Santa Catalina",
  "Basílica de la Virgen de los Desamparados",
  "Real Basílica de la Virgen",
  "Basílica de la Mare de Deu",
  "Basílica de la Virgen",
  "Basílica de Valencia",
  "Lonja de la Seda",
  "Miguelete",
  "Cimborrio",
  "Pont de l´Exposició",
  "Pont de l'Assut de l'Or",
  "Museo de Bellas Artes",
  "Albufera",
];

function isRealPlaceName(name) {
  if (name.includes('(Reto:')) return false;
  if (name === 'Intro') return false;
  if (name.match(/ [1-9]$/)) return false;          // trailing number
  if (name.match(/\b(FRONT|BACK|FINAL|Front|Back)\b/)) return false;
  if (name.startsWith('Centro Puente')) return false;
  if (name.startsWith('Rodeando')) return false;
  if (name.startsWith('Lonja entrada')) return false;
  if (name.startsWith('Vista de')) return false;
  if (name.startsWith('Capilla exterior')) return false;
  if (name.startsWith('Panel cerámico')) return false;
  if (name.startsWith('Arco Novo')) return false;
  if (name.startsWith('Pistas de Patinaje:')) return false;
  if (name.startsWith('Circuito urbano')) return false;
  if (name.includes(' - ')) return false;            // "X - Description" internal labels
  if (name.includes('→')) return false;             // tramo arrows
  if (name.includes(':')) return false;              // "X: Description" labels
  if (name.length <= 4) return false;
  return true;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build clean name list: filter, combine, deduplicate (case-insensitive), sort by length desc
const combined = [...allNames, ...extraNames];
const filtered = combined.filter(isRealPlaceName);

// Deduplicate case-insensitively (keep first occurrence = already longest from sort below)
// Sort by length desc first so longest variants survive dedup
const sorted = filtered.sort((a, b) => b.length - a.length);
const seen = new Set();
const names = sorted.filter(name => {
  const key = name.toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`Using ${names.length} place names`);
console.log('Sample:', names.slice(0, 5));

// Build combined alternation regex (longest first = tried first by engine)
const pattern = names.map(escapeRegex).join('|');
const placeRegex = new RegExp(`(${pattern})`, 'giu');

// Header line pattern: lines starting with "1 - (", "2-B. - (", "9 ---", etc.
const headerRegex = /^\d+[\w. ]*[-–]/;

function applyStrongToLine(line) {
  if (headerRegex.test(line)) return line;

  // Process text nodes only, skip existing HTML tags.
  // Track inStrong state so re-runs don't double-wrap already-bolded text.
  const parts = line.split(/(<[^>]+>)/);
  let inStrong = false;
  const result = parts.map((part, i) => {
    if (i % 2 !== 0) {
      // It's an HTML tag — update strong-tracking state
      if (/^<strong\b/i.test(part)) inStrong = true;
      else if (/^<\/strong>/i.test(part)) inStrong = false;
      return part;
    }
    // Text node — only replace if not already inside a <strong>
    if (inStrong) return part;
    return part.replace(placeRegex, '<strong>$1</strong>');
  });
  return result.join('');
}

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const lines = content.split('\n');
let changedLines = 0;

const resultLines = lines.map(line => {
  const processed = applyStrongToLine(line);
  if (processed !== line) changedLines++;
  return processed;
});

content = resultLines.join('\n');
fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log(`\nDone. Lines with changes: ${changedLines}`);
