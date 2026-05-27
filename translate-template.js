// PLANTILLA para scripts de traducción en batch de 50 claves
// Sustituir TARGET_FILE por el archivo de idioma correspondiente
// Sustituir el contenido de batch con las traducciones del bloque

import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-IDIOMA.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

// Extraer orden de claves del español (anclado a inicio de línea para evitar falsos positivos en valores)
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

// Leer traducciones existentes (o empezar vacío)
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  // "1": "<p>Traducción aquí...</p>",
  // "2": `<p>Con logo: ${LOGO}</p>`,   ← usar backtick cuando se incluya LOGO
};

const merged = { ...existing, ...batch };

// Escribir en orden del español (preserva claves intercaladas junto a su base)
const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
