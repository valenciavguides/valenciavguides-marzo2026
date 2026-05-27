const fs = require('fs');
const lines = fs.readFileSync('js/textos-aventuras.js', 'utf8').split('\n');

// Check lines 9592-9620 for ] characters after string stripping
for (let i = 9591; i <= 9615; i++) {
    const t = lines[i].trim();
    const stripped = t
        .replace(/"(?:[^"\\]|\\.)*"/g, '""')
        .replace(/'(?:[^'\\]|\\.)*'/g, "''");
    const hasClose = stripped.includes(']');
    if (hasClose || t.startsWith('//')) {
        console.log('L' + (i+1) + (hasClose ? ' [HAS ]] ' : '         ') + t.substring(0, 100));
    }
}
