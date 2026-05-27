const fs = require('fs');
const file = 'js/parrafos-textos/parrafos-texto-espanol.json';
let content = fs.readFileSync(file, 'utf8');

// En el JSON, "\n \n" son literalmente los caracteres: \n[espacio]\n
const OLD = '\\n \\n';
const NEW = '\\n';
const count = content.split(OLD).length - 1;
content = content.split(OLD).join(NEW);

fs.writeFileSync(file, content, 'utf8');
console.log(`Limpiadas ${count} ocurrencias de "\\n \\n" → "\\n"`);
