import { readFileSync, writeFileSync } from 'fs';

const FILE = 'js/retos-aventuras.js';
let content = readFileSync(FILE, 'utf8');

// Task 1: Remove skeleton comment lines
const commentPattern = /^[ \t]*\/\/ Reto \d+ \(esqueleto inferido desde comentarios\)\n/gm;
const commentMatches = content.match(commentPattern) || [];
console.log(`Found ${commentMatches.length} skeleton comment lines to remove`);
content = content.replace(commentPattern, '');

// Task 2: Fix tipo: "opcion" -> "opcion-multiple" where multiple: true
const lines = content.split('\n');
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('tipo: "opcion"') && !lines[i].includes('opcion-multiple')) {
    // Look ahead up to 20 lines for multiple: true, stop at next reto
    for (let j = i + 1; j < Math.min(i + 21, lines.length); j++) {
      if (lines[j].match(/\bmultiple:\s*true/)) {
        console.log(`  Fix at line ${i + 1}: ${lines[i].trim()}`);
        lines[i] = lines[i].replace('tipo: "opcion"', 'tipo: "opcion-multiple"');
        fixCount++;
        break;
      }
      // Stop if we reach a new reto object marker
      if (lines[j].match(/\breto:\s*\d+/) && j > i + 1) break;
    }
  }
}

console.log(`Fixed ${fixCount} tipo mismatches`);
content = lines.join('\n');
writeFileSync(FILE, content, 'utf8');
console.log('Done writing file.');
