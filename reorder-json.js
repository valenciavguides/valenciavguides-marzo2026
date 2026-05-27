import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';

// Extract ES key order from raw text (line-anchored to avoid matching keys inside values)
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

function reorder(targetFile) {
  const data = JSON.parse(readFileSync(targetFile, 'utf8'));
  const lines = esKeys
    .filter(k => data[k] !== undefined)
    .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(data[k])}`);
  const json = '{\n' + lines.join(',\n') + '\n}';
  writeFileSync(targetFile, json, 'utf8');
  console.log(`Reordenado: ${targetFile} | entradas: ${lines.length}`);
}

reorder('js/parrafos-textos/parrafos-texto-frances.json');
reorder('js/parrafos-textos/parrafos-texto-ingles.json');
