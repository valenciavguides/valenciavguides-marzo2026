const fs = require('fs');

const coordLines = fs.readFileSync('js/coordenadas-aventuras.js', 'utf8').split('\n');
const textosLines = fs.readFileSync('js/textos-aventuras.js', 'utf8').split('\n');

const adventures = ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5'];

// ── Extract comments from coordenadas-aventuras.js ────────────────────────────
const coordComments = {};
let currentAv = null;

for (let i = 0; i < coordLines.length; i++) {
    const trimmed = coordLines[i].trim();

    for (const av of adventures) {
        if (trimmed.startsWith(av + ':')) {
            currentAv = av;
            coordComments[av] = [];
            break;
        }
    }

    if (currentAv && (trimmed.startsWith('// Parada') || trimmed.startsWith('// Tramo'))) {
        coordComments[currentAv].push(trimmed);
    }
}

// ── Extract comments from textos-aventuras.js (es section only) ───────────────
const textosComments = {};
let inLangArray = false;
let arrayDepth = 0;
let textosAv = null;

for (let i = 0; i < textosLines.length; i++) {
    const trimmed = textosLines[i].trim();

    if (!inLangArray) {
        for (const av of adventures) {
            if (trimmed.startsWith(av + ':')) {
                textosAv = av;
                textosComments[av] = [];
                break;
            }
        }
    }

    if (textosAv && !inLangArray) {
        if (trimmed === 'es: [' || trimmed === 'es:[') {
            if (!textosComments[textosAv]._done) {
                inLangArray = true;
                arrayDepth = 1;
            }
        }
        continue;
    }

    if (inLangArray) {
        if (trimmed.startsWith('//')) {
            // Skip Parada 00 — only exists in textos, not coordenadas
            if (!trimmed.includes('Parada 00')) {
                textosComments[textosAv].push(trimmed);
            }
        }

        const stripped = trimmed
            .replace(/"(?:[^"\\]|\\.)*"/g, '""')
            .replace(/'(?:[^'\\]|\\.)*'/g, "''");

        for (const ch of stripped) {
            if (ch === '[') arrayDepth++;
            else if (ch === ']') {
                arrayDepth--;
                if (arrayDepth === 0) {
                    inLangArray = false;
                    textosComments[textosAv]._done = true;
                    break;
                }
            }
        }
    }
}

// ── Compare ───────────────────────────────────────────────────────────────────
let totalDiffs = 0;

for (const av of adventures) {
    const coord = coordComments[av] || [];
    const texto = textosComments[av] || [];

    const diffs = [];

    if (coord.length !== texto.length) {
        diffs.push(`  CUENTA DIFERENTE: coordenadas:${coord.length}  textos:${texto.length}`);
    }

    const minLen = Math.min(coord.length, texto.length);
    for (let i = 0; i < minLen; i++) {
        if (coord[i] !== texto[i]) {
            diffs.push(`  comentario ${i + 1}:\n    COORD : ${coord[i]}\n    TEXTO : ${texto[i]}`);
        }
    }

    if (diffs.length > 0) {
        console.log(`\n=== ${av} (${diffs.length} diferencia(s)) ===`);
        diffs.forEach(d => console.log(d));
        totalDiffs += diffs.length;
    } else {
        console.log(`${av}: OK (${coord.length} comentarios)`);
    }
}

console.log(`\nTotal diferencias: ${totalDiffs}`);
