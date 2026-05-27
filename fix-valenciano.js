const fs = require('fs');

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
let changes = 0;

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log('NOT FOUND: ' + desc); return; }
  content = content.split(from).join(to);
  console.log('OK (' + count + 'x): ' + desc);
  changes += count;
}

// Fix double-n: Exposiciónn → Exposición
// The bug: "Exposición" (already correct Spanish) got re-matched as containing "Exposició" (Valencian)
// so the last replacement added another 'n' → "Exposiciónn"
rep('Exposiciónn', 'Exposición', 'Exposiciónn → Exposición (double-n bug)');

// Fix remaining l´Assut that still have U+00B4 (acute) — catch both apostrophe forms
rep('l´Assut', 'l’Assut', 'l´Assut (U+00B4) → l’Assut (U+2019)');
rep("l'Assut", 'l’Assut', "l'Assut (straight) → l’Assut (curly)");

fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log('\nTotal cambios:', changes);
