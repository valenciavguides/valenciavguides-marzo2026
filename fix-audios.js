const fs = require('fs');

let content = fs.readFileSync('js/audios-aventuras.js', 'utf8');
let changes = 0;

function replaceAll(old, nuevo) {
  const count = (content.split(old).length - 1);
  if (count === 0) { console.log('WARNING: not found: ' + old.slice(0, 80)); return; }
  content = content.split(old).join(nuevo);
  console.log(`OK (${count}x): ...${old.slice(0, 60)}...`);
  changes += count;
}

// =============================================================
// PARADA 00: fix 215,216,215 → 215-218 (Av1, Av2, Av4 — 24 occurrences)
replaceAll(
  '// Parada 00 - Intro (Reto 2) (Párrafos: 200, 201, 202, 203, 204, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 215, 219, 220, 221, 222, )',
  '// Parada 00 - Intro (Reto 2) (Párrafos: 200, 201, 202, 203, 204, 207, 208, 209, 210, 211, 212, 213, 214, 215-218, 219, 220, 221, 222, )'
);

// =============================================================
// AVENTURA1
replaceAll(
  '// Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína) (Párrafos: 83)',
  '// Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Almoína) (Párrafos: 83)'
);
replaceAll(
  '// Parada 7: Panel cerámico muro Catedral (Reto 10) (Párrafos: 8-c, 434, 440, 441, 442 )',
  '// Parada 7: Panel cerámico muro Catedral (Reto 10) (Párrafos: 8-C, 434, 440, 441, 442 )'
);
replaceAll(
  '// Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico (Párrafos: 457, 10-B)',
  '// Tramo 6: Plaza de la Almoína → Museo Arqueológico (Párrafos: 457, 10-B)'
);
replaceAll(
  '// Parada 13: Museo arqueológico La Almoína (segunda parte) (Reto15Puzzle: PZ-02) (Párrafos: 460, 461)',
  '// Parada 13: Museo arqueológico La Almoína (segunda parte) (Reto15Puzzle: PZ-02) (Párrafos: 459, 460, 461)'
);
replaceAll(
  '// Parada 14: Vista de la Catedral, Cimborrio (Reto: 16) (Párrafos: 8-C,564)',
  '// Parada 14: Vista de la Catedral, Cimborrio (Reto: 16) (Párrafos: 8-C, 464)'
);

// =============================================================
// AVENTURA2 — Reto numbers (en/fr/it/nl/ja — 5 occurrences each)
replaceAll(
  '// Parada 4 - Palau de la Generalitat (Reto 4) (Párrafos: 481, 482, 482-B, 483)',
  '// Parada 4 - Palau de la Generalitat (Reto 5) (Párrafos: 481, 482, 482-B, 483)'
);
replaceAll(
  '// Parada 5 - Iglesia de San Nicolás FRONT (Reto5puzzle PZ-06) (Párrafos: 488, 489, 490)',
  '// Parada 5 - Iglesia de San Nicolás FRONT (Reto6puzzle PZ-06) (Párrafos: 488, 489, 490)'
);
replaceAll(
  '// Parada 6 - Iglesia de San Nicolás BACK (Reto 6) (Párrafos: 493, 494-B, 496)',
  '// Parada 6 - Iglesia de San Nicolás BACK (Reto 7) (Párrafos: 493, 494-B, 496)'
);
replaceAll(
  '// Parada 7 - Iglesia de San Nicolás BACK (Reto 7) (Párrafos: 497, 498)',
  '// Parada 7 - Iglesia de San Nicolás BACK (Reto 8) (Párrafos: 497, 498)'
);
replaceAll(
  '// Parada 8 - Iglesia de San Nicolás BACK (Reto 8) (Párrafos: 504, 505)',
  '// Parada 8 - Iglesia de San Nicolás BACK (Reto 9) (Párrafos: 504, 505)'
);
replaceAll(
  '// Parada 9 - Plaza del Negrito (Reto 9) (Párrafos: 382, 501)',
  '// Parada 9 - Plaza del Negrito (Reto 10) (Párrafos: 382, 501)'
);
replaceAll(
  '// Parada 10 - Plaza del Tossal (Reto 10) (Párrafos: 12-C, 508, 509)',
  '// Parada 10 - Plaza del Tossal (Reto 11) (Párrafos: 12-C, 508, 509)'
);
replaceAll(
  '// Parada 11 - Plaza del Tossal (Párrafos: 510, 511)',
  '// Parada 11 - Plaza del Tossal 2 (Párrafos: 510, 511)'
);
replaceAll(
  '// Parada 13 - Torre del Ángel (Torre árabe) (Reto 11) (Párrafos: 515, 516, 517, 518, 519)',
  '// Parada 13 - Torre del Ángel (Torre árabe) (Reto 12) (Párrafos: 515, 516, 517, 518, 519)'
);
replaceAll(
  '// Parada 14 - Plaza de la Virgen - Introducción (Reto12Puzzle PZ-01) (Párrafos: 702, 346, 143)',
  '// Parada 14 - Plaza de la Virgen - Introducción (Reto13Puzzle PZ-01) (Párrafos: 702, 346, 143)'
);
replaceAll(
  '// Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13) (Párrafos: 466, 467)',
  '// Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 14) (Párrafos: 466, 467)'
);
replaceAll(
  '// Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14) (Párrafos: 469, 472, 473, 690, 468)',
  '// Parada 16 - Plaza de la Virgen - Ofrenda (Reto 15) (Párrafos: 469, 472, 473, 690, 468)'
);
replaceAll(
  '// Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15) (Párrafos: 476, 355, 464)',
  '// Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 16) (Párrafos: 476, 355, 464)'
);
replaceAll(
  '// Parada 20 - Torre del Miguelete (Reto 16) (Párrafos: 427)',
  '// Parada 20 - Torre del Miguelete (Reto 17) (Párrafos: 427)'
);
replaceAll(
  '// Parada 21 - Torre del Miguelete 2 (Reto 17) (Párrafos: 428)',
  '// Parada 21 - Torre del Miguelete 2 (Reto 18) (Párrafos: 428)'
);
replaceAll(
  '// Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18) (Párrafos: 430, 432, 431)',
  '// Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 19) (Párrafos: 430, 432, 431)'
);
replaceAll(
  '// Parada 23 - Torre Barroca de Santa Catalina (Reto 19) (Párrafos: 425, 420, 423)',
  '// Parada 23 - Torre Barroca de Santa Catalina (Reto 20) (Párrafos: 425, 420, 423)'
);
replaceAll(
  '// Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20) (Párrafos: 421, 422)',
  '// Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 21) (Párrafos: 421, 422)'
);
replaceAll(
  '// Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21) (Párrafos: 417, 416)',
  '// Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 22) (Párrafos: 417, 416)'
);
replaceAll(
  '// Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22) (Párrafos: 408, 409, 410)',
  '// Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 23) (Párrafos: 408, 409, 410)'
);
replaceAll(
  '// Parada 28 - Plaza Redonda (Reto23Puzzle PZ-07) (Párrafos: 406)',
  '// Parada 28 - Plaza Redonda (Reto24Puzzle PZ-07) (Párrafos: 406)'
);

// Av2 Tramo 18: triple slash + extra comma
replaceAll(
  '/// Tramo 18 - Tapinería → Palau de la Generalitat (Párrafos: 6-C,)',
  '// Tramo 18 - Tapinería → Palau de la Generalitat (Párrafos: 6-C)'
);

// Av2 Tramo 19: add Parada 29 on same line (all 6 langs)
replaceAll(
  '// Tramo 19 - Palau de la Generalitat → Torres de Serranos - Final (Párrafos: 2-B)',
  '// Tramo 19 - Palau de la Generalitat → Torres de Serranos - Final (Párrafos: 2-B)               // Parada 29 - FINAL: Torres de Serranos - Final (Reto24Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)'
);

// Av2 Parada 30: Reto24 → Reto25 (en/fr/it/nl/ja — es already correct)
replaceAll(
  '// Parada 30 - FINAL: Torres de Serranos - Final (Reto24Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)',
  '// Parada 30 - FINAL: Torres de Serranos - Final (Reto25Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)'
);

// =============================================================
// AVENTURA3

// Parada 00 truncated (only in Av3 — 6 occurrences, unique because next line is {)
// Use CRLF-aware approach: the line ends with \r\n or \n
const eol = content.includes('\r\n') ? '\r\n' : '\n';
const av3Parada00Old = '// Parada 00 - Intro' + eol;
const av3Parada00New = '// Parada 00 - Intro (Reto 2) (Párrafos: 200, 201, 202, 203, 204, 207, 208, 209, 210, 211, 212, 213, 214, 215-218, 219, 220, 221, 222, )' + eol;
const av3Count = (content.split(av3Parada00Old).length - 1);
if (av3Count === 0) {
  console.log('WARNING: Av3 Parada 00 truncated not found');
} else {
  content = content.split(av3Parada00Old).join(av3Parada00New);
  console.log(`OK (${av3Count}x): Av3 Parada 00 truncated → full`);
  changes += av3Count;
}

// Av3 Parada 6: missing 1,
replaceAll(
  '// Parada 6: Puente de la Exposición (Peineta) (Reto 7) (Párrafos: 237, 145, 239)',
  '// Parada 6: Puente de la Exposición (Peineta) (Reto 7) (Párrafos: 237, 1, 145, 239)'
);

// Av3 apostrophes U+2019 → U+0027 in comment lines
const CURVY = '’';
const STRAIGHT = "'";
const lines = content.split(eol);
let apostropheChanges = 0;
const fixedLines = lines.map(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('//') && trimmed.includes(CURVY)) {
    const fixed = line.split(CURVY).join(STRAIGHT);
    if (fixed !== line) apostropheChanges++;
    return fixed;
  }
  return line;
});
if (apostropheChanges > 0) {
  content = fixedLines.join(eol);
  console.log(`OK (${apostropheChanges} lines): Av3 apostrophes U+2019 → U+0027`);
  changes += apostropheChanges;
} else {
  console.log('WARNING: no apostrophes found in comment lines');
}

// Av3 Parada 17: missing prefix
replaceAll(
  '// Ágora y Oceanogràfic (Párrafos: 281, 33, 282, 283, 34-B, 284)',
  '// Parada 17: Ágora y Oceanogràfic (Párrafos: 281, 33, 282, 283, 34-B, 284)'
);

// Av3 Tramo 16: 227-B → 287-B
replaceAll(
  '// Tramo 16: Umbracle → Hemisféric (Párrafos: 227-B, 290)',
  '// Tramo 16: Umbracle → Hemisféric (Párrafos: 287-B, 290)'
);

// =============================================================
// AVENTURA4

// El Carmen: colon → quotes (3 comments, all 6 langs)
replaceAll(
  '// Tramo 3: Parroquia de la Santísima Cruz (Iglesia del Carmen) → Centro Cultural Contemporáneo: El Carmen (Párrafos: 542, 7)',
  '// Tramo 3: Parroquia de la Santísima Cruz (Iglesia del Carmen) → Centro Cultural Contemporáneo "El Carmen" (Párrafos: 542, 7)'
);
replaceAll(
  '// Parada 4 - Centro Cultural Contemporáneo: El Carmen (Reto 7) (Párrafos: 543, 544-B, 545, 546)',
  '// Parada 4 - Centro Cultural Contemporáneo "El Carmen" (Reto 7) (Párrafos: 543, 544-B, 545, 546)'
);
replaceAll(
  '// Parada 5 - Centro Cultural Contemporáneo: El Carmen 2 (Reto 8) (Párrafos: 547, 548, 549, 550)',
  '// Parada 5 - Centro Cultural Contemporáneo "El Carmen" 2 (Reto 8) (Párrafos: 547, 548, 549, 550)'
);

// Av4 Parada 8: remove extra 559
replaceAll(
  '// Parada 8 - Casa de los Gatos 3 (Reto 10) (Párrafos: 557, 558, 559)',
  '// Parada 8 - Casa de los Gatos 3 (Reto 10) (Párrafos: 557, 558)'
);

// Av4 Tramo 7: add (Plataforma elevada)
replaceAll(
  '// Tramo 7: Estadio de Atletismo → Na Turia (Párrafos: 604-B)',
  '// Tramo 7: Estadio de Atletismo → Na Turia (Plataforma elevada) (Párrafos: 604-B)'
);

// Av4 Parada 13: wrong text (double space + missing 602)
replaceAll(
  '// Parada 13: Na Turia  (Reto 13) (Párrafos: 606, 231, 608, 609, 610)',
  '// Parada 13: Na Turia (Plataforma elevada) (Reto 13) (Párrafos: 606, 231, 608, 609, 602, 610)'
);

// Av4 comments 23/24 swap + fix Parada 14:
// Current in audios (all 6 langs): Parada 14 block (wrong) then Tramo 8 block
// Should be: Tramo 8 block then Parada 14 block (with corrected comment)
// We do this per-language since IDs differ

const langs = ['es', 'en', 'fr', 'it', 'nl', 'ja'];
for (const lang of langs) {
  // Parada 14 block (wrong) + Tramo 8 block pattern
  const idP14 = `audio-Av4-P14-${lang}`;
  const idTR8 = `audio-Av4-TR8-${lang}`;

  // Find and extract the two blocks by searching for their unique IDs
  // Pattern: from "// Parada 14:" comment to the closing "," after Tramo 8 block
  const p14Comment = '// Parada 14: Na Turia (Párrafos: 602)';
  const tr8Comment = '// Tramo 8: Na Turia (Plataforma elevada) → Na Turia (Museo) (Párrafos: 711, 21)';

  // Find the Av4 Parada 14 block specific to this lang
  const p14Start = content.indexOf(p14Comment + eol + '        {' + eol + '          id: "' + idP14 + '"');
  if (p14Start === -1) {
    // Try with different indentation
    const p14Start2 = content.indexOf(p14Comment + eol + '      {' + eol + '        id: "' + idP14 + '"');
    if (p14Start2 === -1) {
      console.log(`WARNING: Av4 Parada 14 block for ${lang} not found`);
      continue;
    }
  }

  // Build old string (Parada 14 block + Tramo 8 block)
  // Since we know the exact structure, search for the unique ID pair
  const searchOld = `id: "${idP14}"`;
  const searchNew = `id: "${idTR8}"`;
  const posP14 = content.indexOf(searchOld);
  const posTR8 = content.indexOf(searchNew);

  if (posP14 === -1 || posTR8 === -1) {
    console.log(`WARNING: IDs not found for Av4 ${lang}`);
    continue;
  }
  if (posTR8 < posP14) {
    console.log(`INFO: Av4 ${lang} already in correct order (Tramo 8 before Parada 14)`);
    continue;
  }

  // Extract full blocks by finding start and end
  // Find start of Parada 14 comment (line before the block opening {)
  const commentP14Pos = content.lastIndexOf(eol, posP14) + eol.length; // start of the { line
  // Go back one more EOL to get the // comment line
  const commentP14LineStart = content.lastIndexOf(eol, commentP14Pos - eol.length - 1) + eol.length;

  // Find end of TR8 block (the closing },)
  let closeTR8 = content.indexOf('},' + eol, posTR8);
  if (closeTR8 === -1) closeTR8 = content.indexOf('},' + '\n', posTR8);
  const endTR8 = closeTR8 + 2 + eol.length; // include the eol after },

  const oldBlock = content.substring(commentP14LineStart, endTR8);

  // Build what comes after the end of TR8 block
  const afterTR8 = content.substring(endTR8);

  // Now find Tramo 8 comment line in oldBlock
  const tr8InOld = oldBlock.indexOf(tr8Comment);
  if (tr8InOld === -1) {
    console.log(`WARNING: Tramo 8 not found in block for Av4 ${lang}`);
    continue;
  }

  // Split: part1 = from start to end of P14 block, part2 = TR8 block
  const part1End = oldBlock.indexOf(eol, 0);

  // Find the boundary between P14 block and TR8 block
  const tr8BlockStart = oldBlock.lastIndexOf(eol, tr8InOld) + eol.length;
  // tr8BlockStart is the start of TR8 comment line within oldBlock

  const p14Block = oldBlock.substring(0, tr8BlockStart);
  const tr8Block = oldBlock.substring(tr8BlockStart);

  // Now build the new block with TR8 first, then Parada 14 (with corrected comment)
  // Fix the P14 comment in p14Block
  const fixedP14Block = p14Block.replace(
    '// Parada 14: Na Turia (Párrafos: 602)',
    '// Parada 14: Na Turia (Museo) (Párrafos: 713, 54)'
  );

  const newBlock = tr8Block + fixedP14Block;

  if (newBlock === oldBlock) {
    console.log(`INFO: Av4 ${lang} - no change needed (already correct?)`);
    continue;
  }

  content = content.substring(0, commentP14LineStart) + newBlock + content.substring(endTR8);
  console.log(`OK: Av4 ${lang} - swapped Tramo 8 before Parada 14, fixed P14 comment`);
  changes++;
}

// =============================================================
// AVENTURA5 — Insert Parada 00 block in each language section

const av5Intro = {
  es: {
    id: 'audio-intro-es',
    title: 'Intro Español',
    file: 'audios-aventuras/español/01-Intro-ESPAÑOL-1.mp3',
    indent: '      '
  },
  en: {
    id: 'audio-intro-en',
    title: 'Intro English',
    file: '',
    indent: '      '
  },
  fr: {
    id: 'audio-intro-fr',
    title: 'Intro Español',
    file: '',
    indent: '      '
  },
  it: {
    id: 'audio-intro-it',
    title: 'Intro Español',
    file: '',
    indent: '      '
  },
  nl: {
    id: 'audio-intro-nl',
    title: 'Intro Español',
    file: '',
    indent: '      '
  },
  ja: {
    id: 'audio-intro-ja',
    title: 'Intro Español',
    file: '',
    indent: '      '
  }
};

for (const lang of langs) {
  const info = av5Intro[lang];
  const ind = info.indent;
  const p0Marker = `audio-Av5-P0-${lang}`;

  const p0Pos = content.indexOf(p0Marker);
  if (p0Pos === -1) {
    console.log(`WARNING: Av5 P0 marker not found for ${lang}`);
    continue;
  }

  // Find the start of the // Parada 0 comment line (before the {)
  const blockStart = content.lastIndexOf(eol, p0Pos) + eol.length; // start of { line
  const commentStart = content.lastIndexOf(eol, blockStart - eol.length - 1) + eol.length; // start of // comment

  const insertBlock =
    ind + '// Parada 00 - Intro (Reto 2) (Párrafos: 200, 201, 202, 203, 204, 207, 208, 209, 210, 211, 212, 213, 214, 215-218, 219, 220, 221, 222, )' + eol +
    ind + '{' + eol +
    ind + '  id: "' + info.id + '",' + eol +
    ind + '  title: "' + info.title + '",' + eol +
    ind + '  file: "' + info.file + '"' + eol +
    ind + '},' + eol +
    eol;

  content = content.substring(0, commentStart) + insertBlock + content.substring(commentStart);
  console.log(`OK: Av5 ${lang} - inserted Parada 00 block`);
  changes++;
}

// =============================================================
fs.writeFileSync('js/audios-aventuras.js', content, 'utf8');
console.log('\nTotal changes: ' + changes);
