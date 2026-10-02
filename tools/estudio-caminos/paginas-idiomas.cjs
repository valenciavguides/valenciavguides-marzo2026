// Mide si las cuatro paginas de contenido llevan texto en algun otro idioma que el espanol:
// caracteres CJK / cirilicos / kana, y palabras de control por idioma (solo en el texto visible, sin etiquetas).
const fs = require('fs');
const path = require('path');
const { ROOT, salida } = require('./lib.cjs');
const paginas = ['gastronomia.html', 'consejos-valencia.html', 'videos-valencia-historica.html', 'paginas-oficiales-valencia.html'];
const control = {
  en: /\b(the|and|restaurant|tips|official|history|welcome)\b/gi,
  fr: /\b(le|la|les|et|des|pour|bienvenue|conseils)\b/gi,
  de: /\b(der|die|das|und|für|willkommen|tipps)\b/gi,
  it: /\b(il|gli|per|benvenuti|consigli)\b/gi,
  pt: /\b(os|as|para|bem-vindo|dicas)\b/gi,
  nl: /\b(het|een|voor|welkom|tips)\b/gi,
  pl: /\b(oraz|jest|witamy|porady)\b/gi,
};
for (const f of paginas) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const visible = src
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const cjk = (visible.match(/[\u3040-\u30ff\u4e00-\u9fff]/g) || []).length;
  const cir = (visible.match(/[\u0400-\u04ff]/g) || []).length;
  const otros = Object.entries(control).map(([l, re]) => [l, (visible.match(re) || []).length]).filter(([, n]) => n > 0);
  const tit = (/<title>([\s\S]*?)<\/title>/i.exec(src) || [, ''])[1].trim();
  console.log(f.padEnd(34), 'texto visible:', String(visible.replace(/\s+/g, ' ').trim().length).padStart(6), 'car.',
    '| CJK/kana:', cjk, '| cirílico:', cir, '| palabras de control no-es:', otros.length ? otros.map(([l, n]) => l + '=' + n).join(',') : 'ninguna',
    '| <title>:', tit.slice(0, 60));
}
