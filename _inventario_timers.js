const fs = require('fs');
const path = require('path');

function walk(dir, acc) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === 'node_modules' || item.name === '.git' || item.name === 'tests' || item.name === 'docs') continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full, acc);
    else if (/\.(html|js)$/.test(item.name)) acc.push(full);
  }
}
const files = [];
walk('.', files);

const patterns = [
  { name: 'setTimeout', re: /\bsetTimeout\s*\(/g },
  { name: 'setInterval', re: /\bsetInterval\s*\(/g },
  { name: 'sleep(', re: /\bawait\s+sleep\s*\(/g },
  { name: 'watchPosition', re: /\.watchPosition\s*\(/g },
];

let total = 0;
const out = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (const p of patterns) {
      p.re.lastIndex = 0;
      if (p.re.test(line)) {
        out.push(`${f}:${i + 1}: [${p.name}] ${line.trim().slice(0, 140)}`);
        total++;
      }
    }
  });
}
console.log(`Total ocurrencias: ${total}`);
console.log(out.join('\n'));
fs.writeFileSync('_inventario_timers_out.txt', out.join('\n'));
