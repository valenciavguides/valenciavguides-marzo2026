const fs = require('fs');

const CURVY = "’";   // right single quotation mark '
const STRAIGHT = "'"; // straight apostrophe '

let content = fs.readFileSync('js/textos-aventuras.js', 'utf8');

const countBefore = (content.match(new RegExp(CURVY, 'g')) || []).length;

const lines = content.split('\n');
let changed = 0;
const result = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') && trimmed.includes(CURVY)) {
        const fixed = line.split(CURVY).join(STRAIGHT);
        if (fixed !== line) changed++;
        return fixed;
    }
    return line;
});

const newContent = result.join('\n');
const countAfter = (newContent.match(new RegExp(CURVY, 'g')) || []).length;

fs.writeFileSync('js/textos-aventuras.js', newContent, 'utf8');
console.log('Lineas de comentario modificadas: ' + changed);
console.log('Apostrofes U+2019 antes: ' + countBefore + ', despues: ' + countAfter);
