const fs = require('fs');

let content = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const eol = content.includes('\r\n') ? '\r\n' : '\n';

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log('NOT FOUND: ' + desc); return; }
  content = content.split(from).join(to);
  console.log('OK (' + count + 'x): ' + desc);
}

// L189: 12 al 19 — añadir mark al 19
rep('<mark>12</mark> al 19 son', '<mark>12</mark> al <mark>19</mark> son', 'L189: al 19 → <mark>19</mark>');

// L192: 18 al 25 — añadir mark al 25
rep('<mark>18</mark> al 25 son', '<mark>18</mark> al <mark>25</mark> son', 'L192: al 25 → <mark>25</mark>');

// L333: 18, 19 y 20 — añadir mark a 19 y 20
rep('<mark>18</mark>, 19 y 20 consecutivamente', '<mark>18</mark>, <mark>19</mark> y <mark>20</mark> consecutivamente', 'L333: 19 y 20 → <mark>');

// L600: 58, 59 y 60 — añadir mark a 59 y 60
rep('<mark>58</mark>, 59 y 60', '<mark>58</mark>, <mark>59</mark> y <mark>60</mark>', 'L600: 59 y 60 → <mark>');

fs.writeFileSync('textos-word/parrafos-ordenado-español.txt', content, 'utf8');
console.log('\nArchivo guardado.');

// Verificar que no quedan listas con mark + número suelto
const final = fs.readFileSync('textos-word/parrafos-ordenado-español.txt', 'utf8');
const finalLines = final.split('\n');
const remaining = finalLines.filter(l => l.startsWith('<p>') && (/<\/mark>,\s*\d+/.test(l) || /<\/mark>\s+al\s+\d+/.test(l) || /<\/mark>\s+y\s+\d+/.test(l)));
console.log('Listas con numbers sin mark restantes: ' + remaining.length);
remaining.forEach(l => console.log('  ' + l.replace(/<[^>]+>/g,'').substring(0,120)));

const totalMark = (final.match(/<mark>/g)||[]).length;
console.log('Total <mark>: ' + totalMark);
