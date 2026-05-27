const fs = require('fs');

const textosLines = fs.readFileSync('js/textos-aventuras.js', 'utf8').split('\n');
const audiosLines = fs.readFileSync('js/audios-aventuras.js', 'utf8').split('\n');

const adventures = ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5'];
const languages = ['es', 'en', 'fr', 'it', 'nl', 'ja'];

function extractComments(lines) {
    const result = {};
    let currentAv = null;
    let currentLang = null;
    let inLangArray = false;
    let arrayDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        if (!inLangArray) {
            for (const av of adventures) {
                if (trimmed.startsWith(av + ':')) {
                    currentAv = av;
                    if (!result[av]) result[av] = {};
                    currentLang = null;
                    break;
                }
            }
        }

        if (currentAv && !inLangArray) {
            for (const lang of languages) {
                if (trimmed === lang + ': [' || trimmed === lang + ':[' ||
                    (trimmed.startsWith(lang + ':') && trimmed.includes('['))) {
                    if (!result[currentAv][lang]) {
                        currentLang = lang;
                        result[currentAv][lang] = [];
                        inLangArray = true;
                        arrayDepth = 1;
                    }
                    break;
                }
            }
            continue;
        }

        if (inLangArray && currentLang && currentAv) {
            if (trimmed.startsWith('//')) {
                result[currentAv][currentLang].push(trimmed);
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
                        currentLang = null;
                        break;
                    }
                }
            }
        }
    }
    return result;
}

const textos = extractComments(textosLines);
const audios = extractComments(audiosLines);

let totalDiffs = 0;

for (const av of adventures) {
    const avTextos = textos[av] || {};
    const avAudios = audios[av] || {};

    for (const lang of languages) {
        const ref = avTextos[lang] || [];
        const cmp = avAudios[lang] || [];

        if (cmp.length === 0) {
            console.log(`${av}.${lang}: sección no detectada en audios`);
            totalDiffs++;
            continue;
        }

        const diffs = [];
        if (ref.length !== cmp.length) {
            diffs.push(`  CUENTA: textos:${ref.length}  audios:${cmp.length}`);
        }

        const minLen = Math.min(ref.length, cmp.length);
        for (let i = 0; i < minLen; i++) {
            if (ref[i] !== cmp[i]) {
                diffs.push(`  comentario ${i + 1}:\n    TEXTOS: ${ref[i]}\n    AUDIOS: ${cmp[i]}`);
            }
        }

        if (diffs.length > 0) {
            console.log(`\n=== ${av}.${lang} (${diffs.length} diferencia(s)) ===`);
            diffs.forEach(d => console.log(d));
            totalDiffs += diffs.length;
        }
    }
}

if (totalDiffs === 0) {
    console.log('OK: textos-aventuras y audios-aventuras tienen comentarios identicos.');
} else {
    console.log(`\nTotal diferencias: ${totalDiffs}`);
}

// Resumen
console.log('\n--- Resumen ---');
for (const av of adventures) {
    const avA = audios[av] || {};
    const counts = languages.map(l => `${l}:${(avA[l]||[]).length}`).join('  ');
    console.log(`${av}: ${counts}`);
}
