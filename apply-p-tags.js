const fs = require('fs');

const content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const eol = content.includes('\r\n') ? '\r\n' : '\n';
const lines = content.split('\n').map(l => l.replace(/\r$/, ''));

const headerRegex = /^\d+[\w. ]*[-–]/;
function isHeader(l) { return headerRegex.test(l.trim()); }
function isBlank(l) { return l.trim() === ''; }

function capitalizeFirst(text) {
  // Find the first significant (non-space, non-tag) character
  let i = 0;
  while (i < text.length) {
    if (text[i] === '<') {
      const end = text.indexOf('>', i);
      if (end === -1) break;
      i = end + 1;
    } else if (text[i] === ' ' || text[i] === '\t') {
      i++;
    } else {
      // If the first visible character is a digit, don't capitalize what follows
      if (/\d/.test(text[i])) return text;
      break;
    }
  }

  // Now find and capitalize the first letter
  i = 0;
  while (i < text.length) {
    if (text[i] === '<') {
      const end = text.indexOf('>', i);
      if (end === -1) break;
      i = end + 1;
    } else if (/[a-záéíóúüñ]/i.test(text[i])) {
      return text.slice(0, i) + text[i].toUpperCase() + text.slice(i + 1);
    } else {
      i++;
    }
  }
  return text;
}

const result = [];
let i = 0;
let paras = 0, caps = 0;

while (i < lines.length) {
  const line = lines[i];

  if (isHeader(line) || isBlank(line)) {
    result.push(line);
    i++;
    continue;
  }

  // Collect all consecutive non-blank, non-header lines = one paragraph block
  const paraLines = [];
  while (i < lines.length && !isBlank(lines[i]) && !isHeader(lines[i])) {
    paraLines.push(lines[i].trimEnd());
    i++;
  }

  const joined = paraLines.map(l => l.trim()).filter(l => l).join(' ').replace(/\s{2,}/g, ' ').trim();
  if (!joined) continue;

  const capped = capitalizeFirst(joined);
  if (capped !== joined) caps++;
  result.push('<p>' + capped + '</p>');
  paras++;
}

fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', result.join(eol), 'utf8');
console.log(`Done. Paragraphs wrapped in <p>: ${paras}, first letters capitalized: ${caps}`);
