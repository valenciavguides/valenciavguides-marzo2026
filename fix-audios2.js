const fs = require('fs');

let content = fs.readFileSync('js/audios-aventuras.js', 'utf8');
const eol = content.includes('\r\n') ? '\r\n' : '\n';
let changes = 0;

function rep(old, nuevo, desc) {
  const count = (content.split(old).length - 1);
  if (count === 0) { console.log('WARNING not found: ' + desc); return; }
  content = content.split(old).join(nuevo);
  console.log(`OK (${count}x): ${desc}`);
  changes += count;
}

// ============================================================
// FIX 1: Av2 ja - Tramo 18 still has trailing comma (was // not ///)
rep(
  '// Tramo 18 - Tapinería → Palau de la Generalitat (Párrafos: 6-C,)',
  '// Tramo 18 - Tapinería → Palau de la Generalitat (Párrafos: 6-C)',
  'Av2 ja Tramo 18 trailing comma'
);

// ============================================================
// FIX 2: Av4 - Remove old P14 comment that ended up before TR8 comment
// Current: [P14_old_comment]\n[TR8_comment]\n{TR8_block}
// After this fix: [TR8_comment]\n{TR8_block}
// Do for each language (different indentation: es=8sp, others=6sp)

// es (8 spaces)
rep(
  '        // Parada 14: Na Turia (Párrafos: 602)' + eol + '        // Tramo 8:',
  '        // Tramo 8:',
  'Av4 es - remove stray P14 comment before TR8'
);
// en/fr/it/nl/ja (6 spaces)
rep(
  '      // Parada 14: Na Turia (Párrafos: 602)' + eol + '      // Tramo 8:',
  '      // Tramo 8:',
  'Av4 en/fr/it/nl/ja - remove stray P14 comment before TR8'
);

// FIX 2b: Add corrected P14 comment before each language P14 block
const langIndents = {
  es: '        ',
  en: '      ',
  fr: '      ',
  it: '      ',
  nl: '      ',
  ja: '      '
};

for (const [lang, ind] of Object.entries(langIndents)) {
  const idP14 = `audio-Av4-P14-${lang}`;
  const old = `${ind}},${eol}${ind}{${eol}${ind}  id: "${idP14}"`;
  const nuevo = `${ind}},${eol}${ind}// Parada 14: Na Turia (Museo) (Párrafos: 713, 54)${eol}${ind}{${eol}${ind}  id: "${idP14}"`;
  rep(old, nuevo, `Av4 ${lang} - add corrected P14 comment before P14 block`);
}

// ============================================================
// FIX 3: Av5 - Parada 00 inserted in wrong position
// Current structure (es):
//   // Parada 0 - Torres de Serranos (start) (Reto 3) ...
//   // Parada 00 - Intro (Reto 2) ...
//   { id: "audio-intro-es", ... },
//   (blank)
//   { id: "audio-Av5-P0-es", ... }
//
// Should be:
//   // Parada 00 - Intro (Reto 2) ...
//   { id: "audio-intro-es", ... },
//   (blank)
//   // Parada 0 - Torres de Serranos (start) (Reto 3) ...
//   { id: "audio-Av5-P0-es", ... }

const p0Comment = '// Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)';
const p00Comment = '// Parada 00 - Intro (Reto 2) (Párrafos: 200, 201, 202, 203, 204, 207, 208, 209, 210, 211, 212, 213, 214, 215-218, 219, 220, 221, 222, )';

// For es (has real file path, so unique):
rep(
  '      ' + p0Comment + eol +
  '      ' + p00Comment + eol +
  '      {' + eol +
  '        id: "audio-intro-es",' + eol +
  '        title: "Intro Español",' + eol +
  '        file: "audios-aventuras/español/01-Intro-ESPAÑOL-1.mp3"' + eol +
  '      },' + eol +
  eol +
  '      {' + eol +
  '        id: "audio-Av5-P0-es"',
  '      ' + p00Comment + eol +
  '      {' + eol +
  '        id: "audio-intro-es",' + eol +
  '        title: "Intro Español",' + eol +
  '        file: "audios-aventuras/español/01-Intro-ESPAÑOL-1.mp3"' + eol +
  '      },' + eol +
  eol +
  '      ' + p0Comment + eol +
  '      {' + eol +
  '        id: "audio-Av5-P0-es"',
  'Av5 es - reorder Parada 00 before Parada 0'
);

// For en:
rep(
  '      ' + p0Comment + eol +
  '      ' + p00Comment + eol +
  '      {' + eol +
  '        id: "audio-intro-en",' + eol +
  '        title: "Intro English",' + eol +
  '        file: ""' + eol +
  '      },' + eol +
  eol +
  '      {' + eol +
  '        id: "audio-Av5-P0-en"',
  '      ' + p00Comment + eol +
  '      {' + eol +
  '        id: "audio-intro-en",' + eol +
  '        title: "Intro English",' + eol +
  '        file: ""' + eol +
  '      },' + eol +
  eol +
  '      ' + p0Comment + eol +
  '      {' + eol +
  '        id: "audio-Av5-P0-en"',
  'Av5 en - reorder Parada 00 before Parada 0'
);

// For fr/it/nl/ja (all have title "Intro Español", file ""):
for (const lang of ['fr', 'it', 'nl', 'ja']) {
  rep(
    '      ' + p0Comment + eol +
    '      ' + p00Comment + eol +
    '      {' + eol +
    `        id: "audio-intro-${lang}",` + eol +
    '        title: "Intro Español",' + eol +
    '        file: ""' + eol +
    '      },' + eol +
    eol +
    '      {' + eol +
    `        id: "audio-Av5-P0-${lang}"`,
    '      ' + p00Comment + eol +
    '      {' + eol +
    `        id: "audio-intro-${lang}",` + eol +
    '        title: "Intro Español",' + eol +
    '        file: ""' + eol +
    '      },' + eol +
    eol +
    '      ' + p0Comment + eol +
    '      {' + eol +
    `        id: "audio-Av5-P0-${lang}"`,
    `Av5 ${lang} - reorder Parada 00 before Parada 0`
  );
}

// ============================================================
// FIX 4: Av5 Parada 6 - missing comma: "237, 1 145" → "237, 1, 145"
rep(
  '// Parada 6: Puente de la Exposición (Peineta) (Reto 7) (Párrafos: 237, 1 145, 239)',
  '// Parada 6: Puente de la Exposición (Peineta) (Reto 7) (Párrafos: 237, 1, 145, 239)',
  'Av5 Parada 6 missing comma'
);

// ============================================================
fs.writeFileSync('js/audios-aventuras.js', content, 'utf8');
console.log('\nTotal changes: ' + changes);
