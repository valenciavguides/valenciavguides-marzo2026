const fs = require('fs');

const filePath = 'js/parrafos-textos/parrafos-texto-espanol.json';
let content = fs.readFileSync(filePath, 'utf8');

const beforeCount = (content.match(/<mark>\d+<\/mark>/g) || []).length;

// 1. "número X" → "número <mark>X</mark>" — excluye "Aventura número X"
content = content.replace(/(?<![Aa]ventura )número (?!<mark>)(\d+)/g, 'número <mark>$1</mark>');

// 2. "números X" → "números <mark>X</mark>" (forma plural: "los números 12 al 19")
content = content.replace(/números (?!<mark>)(\d+)/g, 'números <mark>$1</mark>');

// 3. Segundo número en pares: "<mark>X</mark> y N" y "<mark>X</mark> al N"
content = content.replace(/(<mark>\d+<\/mark> y )(\d+)(?!<\/mark>)/g, '$1<mark>$2</mark>');
content = content.replace(/(<mark>\d+<\/mark> al )(\d+)(?!<\/mark>)/g, '$1<mark>$2</mark>');

const afterCount = (content.match(/<mark>\d+<\/mark>/g) || []).length;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Marcas <mark> antes: ${beforeCount}`);
console.log(`Marcas <mark> después: ${afterCount}`);
console.log(`Añadidas: +${afterCount - beforeCount}`);
