const fs = require('fs');

const content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
// Work on plain text (no HTML tags) for most checks
const lines = content.split('\n').map(l => l.replace(/\r$/, ''));

function plain(line) {
  return line.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

const issues = [];

function report(category, lineNum, text) {
  issues.push({ category, lineNum, text: text.substring(0, 110) });
}

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const n = i + 1;
  const p = plain(raw);
  if (!p) continue;

  // 1. Double spaces
  if (/  /.test(p)) report('DOBLE ESPACIO', n, p);

  // 2. Space before punctuation
  if (/ [,;:.!?]/.test(p) && !/\s[¿¡]/.test(p)) {
    const m = p.match(/ [,;:.!?]/g);
    if (m) report('ESPACIO ANTES DE PUNT.', n, p);
  }

  // 3. Missing space after punctuation (before letter/digit)
  if (/[,;:][^\s\d"'»\)0-9]/.test(p)) {
    const m = p.match(/[,;:][^\s\d"'»\)]/g);
    if (m) report('FALTA ESPACIO TRAS PUNT.', n, p);
  }

  // 4. Repeated consecutive words (case insensitive)
  const repeated = p.match(/\b([a-záéíóúüñ]{2,})\s+\1\b/i);
  if (repeated) report('PALABRA REPETIDA: "' + repeated[1] + '"', n, p);

  // 5. Lowercase after ". " mid-sentence (possible missing capital)
  const afterDot = p.match(/\.\s+[a-záéíóúüñ]/);
  if (afterDot) report('MINÚSCULA TRAS PUNTO: "' + afterDot[0].trim() + '"', n, p);

  // 6. Encoding artifacts
  if (/[ÃÂ€™œ]/.test(raw)) report('POSIBLE ARTIFACT ENCODING', n, p);

  // 7. Broken apostrophe / weird characters
  if (/´[a-záéíóúüñ]/i.test(p)) report('ACENTO AGUDO COMO APÓSTROFO (´)', n, p);

  // 8. Double punctuation
  if (/[.]{2,}/.test(p) && !/\.{3}/.test(p)) report('PUNTOS DOBLES', n, p);
  if (/[,]{2,}/.test(p)) report('COMAS DOBLES', n, p);

  // 9. Common misspelled/missing accent patterns
  // "tambien" sin tilde → "también"
  if (/\btambien\b/i.test(p)) report('FALTA TILDE: "tambien" → "también"', n, p);
  if (/\btambien\b/i.test(p)) report('FALTA TILDE: "tambien"', n, p);
  // "ademas" → "además"
  if (/\bademas\b/i.test(p)) report('FALTA TILDE: "ademas" → "además"', n, p);
  // "asi" → "así" (standalone)
  if (/\basi\b/i.test(p) && !/\bchasis\b|\bbase\b/i.test(p)) report('POSIBLE FALTA TILDE: "asi" → "así"', n, p);
  // "mas" → "más" (when used as "more", hard to detect but common error)
  // "numero" → "número"
  if (/\bnumero\b/i.test(p)) report('FALTA TILDE: "numero" → "número"', n, p);
  // "pagina" → "página"
  if (/\bpagina\b/i.test(p)) report('FALTA TILDE: "pagina" → "página"', n, p);
  // "siglo" related — just to spot check
  // "epoche" — unlikely but check "epoca" → "época"
  if (/\bepoca\b/i.test(p)) report('FALTA TILDE: "epoca" → "época"', n, p);
  // "unico/a" → "único/a"
  if (/\bunic[oa]\b/i.test(p)) report('FALTA TILDE: "unico/a" → "único/a"', n, p);
  // "publico" → "público"
  if (/\bpublic[oa]\b/i.test(p)) report('FALTA TILDE: "publico" → "público"', n, p);
  // "historico" → "histórico"
  if (/\bhistoric[oa]\b/i.test(p)) report('FALTA TILDE: "historico" → "histórico"', n, p);
  // "artistico" → "artístico"
  if (/\bartistic[oa]\b/i.test(p)) report('FALTA TILDE: "artistico" → "artístico"', n, p);
  // "practicam" → "prácticamente"
  // "caracter" → "carácter"
  if (/\bcaracter\b/i.test(p)) report('FALTA TILDE: "caracter" → "carácter"', n, p);
  // "trafico" → "tráfico"
  if (/\btrafico\b/i.test(p)) report('FALTA TILDE: "trafico" → "tráfico"', n, p);
  // "musica" → "música"
  if (/\bmusica\b/i.test(p)) report('FALTA TILDE: "musica" → "música"', n, p);
  // "util" → "útil"
  if (/\butil\b/i.test(p)) report('FALTA TILDE: "util" → "útil"', n, p);
  // "camara" → "cámara"
  if (/\bcamara\b/i.test(p)) report('FALTA TILDE: "camara" → "cámara"', n, p);
  // "calido" → "cálido"
  if (/\bcalid[oa]\b/i.test(p)) report('FALTA TILDE: "calido" → "cálido"', n, p);
  // "arabe" → "árabe"
  if (/\barabe\b/i.test(p)) report('FALTA TILDE: "arabe" → "árabe"', n, p);
  // "gotico" → "gótico"
  if (/\bgotico[a]?\b/i.test(p)) report('FALTA TILDE: "gotico" → "gótico"', n, p);
  // "barroco" → should be correct, no tilde needed
  // "clasico" → "clásico"
  if (/\bclasic[oa]\b/i.test(p)) report('FALTA TILDE: "clasico" → "clásico"', n, p);
  // "ceramica" → "cerámica"
  if (/\bceramica\b/i.test(p)) report('FALTA TILDE: "ceramica" → "cerámica"', n, p);
  // "critica" → "crítica"
  if (/\bcritica\b/i.test(p)) report('FALTA TILDE: "critica" → "crítica"', n, p);
}

// Group by category and show counts
const byCategory = {};
for (const issue of issues) {
  if (!byCategory[issue.category]) byCategory[issue.category] = [];
  byCategory[issue.category].push(issue);
}

const cats = Object.keys(byCategory).sort();
let total = 0;
for (const cat of cats) {
  const list = byCategory[cat];
  console.log('\n=== ' + cat + ' (' + list.length + 'x) ===');
  list.slice(0, 5).forEach(i => console.log('  L' + i.lineNum + ': ' + i.text));
  if (list.length > 5) console.log('  ... y ' + (list.length - 5) + ' más');
  total += list.length;
}
console.log('\nTotal issues encontrados: ' + total);
