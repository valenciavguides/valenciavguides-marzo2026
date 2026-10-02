// Barrido de clases CSS: clases que el JS pone (classList.add/toggle, className=) y que ningún selector CSS del documento
// menciona, ni ninguna lectura JS (contains/querySelector/matches/closest) usa; y reglas CSS cuyo selector de clase nadie usa.
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const html = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const vendorCss = fs.readFileSync(path.join(ROOT, 'js/vendor/maplibre-gl.css'), 'utf8');
const out = [];
for (const f of html) {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
  const styles = [...s.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const cssText = styles + (f === 'codigo-padre.html' ? vendorCss : '');
  // selectores de clase en el CSS (también dentro de @media)
  const cssClasses = new Set([...cssText.matchAll(/\.([A-Za-z_][A-Za-z0-9_-]*)/g)].map(m => m[1]));
  // scripts
  const scripts = [...s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
  const body = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const added = new Map(); // clase -> n
  const addRe = /classList\.(?:add|toggle|replace)\(([^)]*)\)/g; let m;
  while ((m = addRe.exec(scripts)) !== null) for (const q of m[1].matchAll(/['"`]([A-Za-z_][A-Za-z0-9_ -]*)['"`]/g)) for (const c of q[1].split(/\s+/)) if (c) added.set(c, (added.get(c) || 0) + 1);
  const cnRe = /className\s*=\s*['"`]([^'"`$]*)['"`]/g; while ((m = cnRe.exec(scripts)) !== null) for (const c of m[1].split(/\s+/)) if (c) added.set(c, (added.get(c) || 0) + 1);
  const readRe = new Set();
  for (const m2 of scripts.matchAll(/(?:contains|matches|closest|querySelector(?:All)?|getElementsByClassName)\(\s*['"`]([^'"`]*)['"`]/g)) for (const c of m2[1].matchAll(/\.?([A-Za-z_][A-Za-z0-9_-]*)/g)) readRe.add(c[1]);
  const inHtml = new Set([...body.matchAll(/class\s*=\s*"([^"]*)"/g)].flatMap(x => x[1].split(/\s+/)));
  const phantom = [...added.keys()].filter(c => !cssClasses.has(c) && !readRe.has(c));
  const phantomRead = [...added.keys()].filter(c => !cssClasses.has(c) && readRe.has(c));
  // reglas CSS con clase que ni el HTML ni el JS mencionan (por nombre literal)
  const textoUso = body + '\n' + scripts;
  const deadCss = [...cssClasses].filter(c => !new RegExp('(^|[^A-Za-z0-9_-])' + c.replace(/[-]/g, '\\-') + '($|[^A-Za-z0-9_-])').test(textoUso) && !/^(maplibregl|mapboxgl|leaflet|gm-|pac-)/.test(c));
  out.push(`${f}: clases JS=${added.size} CSS=${cssClasses.size}  puestas por JS sin regla CSS ni lectura: ${phantom.length}${phantom.length ? ' → ' + phantom.slice(0, 15).join(', ') : ''}  | puestas sin regla pero leídas: ${phantomRead.length}${phantomRead.length ? ' → ' + phantomRead.slice(0, 10).join(', ') : ''}  | reglas CSS cuya clase no aparece en HTML ni JS: ${deadCss.length}${deadCss.length ? ' → ' + deadCss.slice(0, 18).join(', ') : ''}`);
}
fs.writeFileSync(salida('barrido-clases.txt'), out.join('\n'));
console.log(out.join('\n'));
