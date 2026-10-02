// ids estáticos repetidos dentro de un mismo .html (getElementById devuelve el primero). Excluye <script> y <style> y comentarios.
const fs = require('fs'); const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
let total = 0; const out = [];
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  let src = fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
  const limpio = src.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, ' ')).replace(/<script\b[\s\S]*?<\/script>/gi, c => c.replace(/[^\n]/g, ' ')).replace(/<style\b[\s\S]*?<\/style>/gi, c => c.replace(/[^\n]/g, ' '));
  const ids = {}; for (const m of limpio.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)) (ids[m[1]] ||= []).push(limpio.slice(0, m.index).split('\n').length);
  total += Object.keys(ids).length;
  for (const [id, l] of Object.entries(ids)) if (l.length > 1) out.push(`${f}: id="${id}" ×${l.length} en líneas ${l.join(', ')}`);
}
console.log('ids estáticos distintos:', total, '; repetidos dentro de su documento:', out.length); out.forEach(x => console.log('  ' + x));
