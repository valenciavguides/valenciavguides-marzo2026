const fs = require('fs');

const coordLines = fs.readFileSync('js/coordenadas-aventuras.js', 'utf8').split('\n');
const textosLines = fs.readFileSync('js/textos-aventuras.js', 'utf8').split('\n');

// Find the specific lines for Av3 Tramo 13, Parada 16, Tramo 14
const targets = [
    'Tramo 13', 'Parada 16', 'Tramo 14'
];

function findLine(lines, keyword) {
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t.startsWith('//') && t.includes(keyword)) return { line: i+1, text: t };
    }
    return null;
}

// Restrict to Av3 area
function findLineInRange(lines, keyword, fromLine, toLine) {
    for (let i = fromLine; i < toLine; i++) {
        const t = lines[i].trim();
        if (t.startsWith('//') && t.includes(keyword)) return { line: i+1, text: t };
    }
    return null;
}

// Find Av3 range in coordenadas
let av3Start = -1, av3End = lines => lines.length;
for (let i = 0; i < coordLines.length; i++) {
    if (coordLines[i].trim().startsWith('Aventura3:')) av3Start = i;
    if (av3Start > 0 && coordLines[i].trim().startsWith('Aventura4:')) { av3End = i; break; }
}

const keywords = ['Tramo 13:', 'Parada 16:', 'Tramo 14:'];
for (const kw of keywords) {
    const coord = findLineInRange(coordLines, kw, av3Start, av3End);
    // For textos, find in es section - roughly lines 4702-7236
    const texto = findLineInRange(textosLines, kw, 4700, 7236);
    if (coord && texto) {
        console.log(`\n--- ${kw} ---`);
        const diff = [];
        const len = Math.max(coord.text.length, texto.text.length);
        for (let i = 0; i < len; i++) {
            if (coord.text[i] !== texto.text[i]) {
                diff.push(`pos ${i}: COORD=U+${(coord.text.charCodeAt(i)||0).toString(16).padStart(4,'0')} '${coord.text[i]||''}' | TEXTO=U+${(texto.text.charCodeAt(i)||0).toString(16).padStart(4,'0')} '${texto.text[i]||''}'`);
            }
        }
        if (diff.length === 0) {
            console.log('Idénticos — mismo texto y mismo largo');
        } else {
            console.log(`COORD (L${coord.line}): ${coord.text}`);
            console.log(`TEXTO (L${texto.line}): ${texto.text}`);
            console.log('Diferencias char:');
            diff.forEach(d => console.log(' ', d));
        }
    }
}
