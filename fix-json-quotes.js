const fs = require('fs');
const archivo = process.argv[2] || 'js/parrafos-textos/parrafos-texto-aleman.json';
const text = fs.readFileSync(archivo, 'utf8');

// Walk through the file tracking JSON state.
// In 'in_value' state, when we see an unescaped '"' (U+0022),
// look ahead: if next non-space char is comma, newline, or '}' -> real end of string.
// Otherwise -> content quote that needs escaping.

let result = '';
let i = 0;
let state = 'outer'; // outer, in_key, after_key, in_value

while (i < text.length) {
  const ch = text[i];

  if (state === 'outer') {
    result += ch;
    if (ch === '"') state = 'in_key';

  } else if (state === 'in_key') {
    if (ch === '\\') {
      result += ch + text[++i];
    } else if (ch === '"') {
      result += ch;
      state = 'after_key';
    } else {
      result += ch;
    }

  } else if (state === 'after_key') {
    result += ch;
    if (ch === '"') state = 'in_value';

  } else if (state === 'in_value') {
    if (ch === '\\') {
      result += ch + text[++i]; // escape sequence, take 2 chars
    } else if (ch === '"') {
      // Look ahead: a real end-of-value " is followed by optional comma,
      // then a newline (leading to next key or closing brace).
      // A content " may be followed by comma+space+text, space, or text.
      let j = i + 1;
      // Skip one optional comma
      if (j < text.length && text[j] === ',') j++;
      // Skip spaces/tabs (but NOT newlines)
      while (j < text.length && (text[j] === ' ' || text[j] === '\t')) j++;
      const next = text[j];
      // If next is newline or } (end of object), this closes the value string
      if (next === '\n' || next === '\r' || next === '}') {
        result += ch;
        state = 'outer';
      } else {
        // Content quote - escape it
        result += '\\"';
      }
    } else {
      result += ch;
    }
  }
  i++;
}

try {
  const obj = JSON.parse(result);
  console.log('Valid JSON with', Object.keys(obj).length, 'entries');
  fs.writeFileSync(archivo, result, 'utf8');
  console.log('File saved OK');
} catch(e) {
  const match = e.message.match(/position (\d+)/);
  const pos = match ? parseInt(match[1]) : -1;
  console.log('Still broken:', e.message);
  if (pos >= 0) {
    let chars = [];
    for (let k = Math.max(0,pos-15); k < Math.min(result.length, pos+15); k++) {
      chars.push(k + ':0x' + result.charCodeAt(k).toString(16) + '(' + (result[k] === '\n' ? 'NL' : result[k]) + ')');
    }
    console.log(chars.join(' '));
  }
}
