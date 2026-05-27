const fs = require('fs');
const lines = fs.readFileSync('js/textos-aventuras.js', 'utf8').split('\n');

const adventures = ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5'];
const languages = ['es', 'en', 'fr', 'it', 'nl', 'ja'];

const sections = {};

let currentAv = null;
let currentLang = null;
let inLangArray = false;
let arrayDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Detect adventure start (only when not inside a language array)
    if (!inLangArray) {
        for (const av of adventures) {
            if (trimmed.startsWith(av + ':')) {
                currentAv = av;
                sections[currentAv] = {};
                currentLang = null;
                break;
            }
        }
    }

    // Detect language section start
    if (currentAv && !inLangArray) {
        for (const lang of languages) {
            if (trimmed === lang + ': [' || trimmed === lang + ':[' ||
                (trimmed.startsWith(lang + ':') && trimmed.includes('['))) {
                if (!sections[currentAv][lang]) {
                    currentLang = lang;
                    sections[currentAv][lang] = [];
                    inLangArray = true;
                    arrayDepth = 1;
                }
                break;
            }
        }
        continue;
    }

    if (inLangArray && currentLang && currentAv) {
        // Collect comments
        if (trimmed.startsWith('//')) {
            sections[currentAv][currentLang].push(trimmed);
        }

        // Strip string literals before counting brackets (avoids false counts inside content strings)
        const stripped = trimmed
            .replace(/"(?:[^"\\]|\\.)*"/g, '""')
            .replace(/'(?:[^'\\]|\\.)*'/g, "''");

        for (const ch of stripped) {
            if (ch === '[') arrayDepth++;
            else if (ch === ']') {
                arrayDepth--;
                if (arrayDepth === 0) {
                    inLangArray = false;
                    currentLang = null;
                    break;
                }
            }
        }
    }
}

// Compare each language against es
const diffs = [];
for (const av of adventures) {
    const avSec = sections[av] || {};
    const esComments = avSec['es'] || [];

    for (const lang of languages.filter(l => l !== 'es')) {
        const langComments = avSec[lang] || [];

        if (langComments.length === 0) {
            diffs.push(`${av}.${lang}: sección vacía o no detectada`);
            continue;
        }

        if (esComments.length !== langComments.length) {
            diffs.push(`${av}.${lang}: número de comentarios diferente (es:${esComments.length}, ${lang}:${langComments.length})`);
        }

        const minLen = Math.min(esComments.length, langComments.length);
        for (let i = 0; i < minLen; i++) {
            if (esComments[i] !== langComments[i]) {
                diffs.push(`${av}.${lang} comentario ${i + 1}:\n  ES : ${esComments[i]}\n  ${lang.toUpperCase()}: ${langComments[i]}`);
            }
        }
    }
}

if (diffs.length === 0) {
    console.log('OK: todos los idiomas son identicos en todas las aventuras.');
} else {
    console.log(`Encontradas ${diffs.length} diferencias:\n`);
    diffs.forEach(d => console.log(d + '\n'));
}

// Summary of detected comments per section
console.log('\n--- Resumen de comentarios detectados ---');
for (const av of adventures) {
    const avSec = sections[av] || {};
    const counts = languages.map(l => `${l}:${(avSec[l]||[]).length}`).join('  ');
    console.log(`${av}: ${counts}`);
}
