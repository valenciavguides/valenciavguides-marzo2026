'use strict';
/**
 * guia-narracion.cjs — frases de docs/GUIA-COMPLETA.md que cuentan un cambio en vez de describir lo que hay.
 *
 * La guía describe lo que existe, en presente: «la pared es azul», nunca «la pared era roja pero se cambió a azul». Este instrumento busca, fuera
 * de los bloques de código, las formas con que esa regla se rompe. Dos familias:
 *
 *   DURAS (casi siempre son narración): «ya no …», «antes hacía X / ahora hace Y», «se retiró / se sustituyó / se arregló», «añadido tras …»,
 *   «(fix de …)», verbos en imperfecto que cuentan un incidente («se quedaba», «se veía», «este era»), procedencia («reporte de campo», «se notó en
 *   campo»), referencias a decisiones o pasos del proceso («decisión 11», «paso 9 de la lavadora»), fechas («24-jul», «2026-08») y enlaces a notas
 *   de la memoria privada (`[[nota]]`, `project_…`, `feedback_…`), que no existen en el repositorio.
 *
 *   BLANDAS (se leen, y casi siempre son flujo legítimo): cualquier verbo en imperfecto («si el hijo estaba en `hijosDesconectados`, se quita»),
 *   «se …ó» en pretérito, «antes» sin «de», «ahora», y la continuidad («sigue siendo», «sigue sin»). Es donde se esconde la narración que las duras
 *   no ven: «antes sí lo hacía», «saltaban de golpe», «la causa real detrás del bug donde … apuntaba». La diferencia entre un imperfecto de flujo
 *   (describe el estado previo dentro de un escenario) y uno de incidente (cuenta lo que fallaba) se decide leyendo la frase.
 *
 * Lo que lista es un candidato: se lee cada línea. Los falsos positivos legítimos son abundantes —«antes de enviar», «hasta que el usuario pulsa»,
 * un «ya no» que describe el orden dentro de un flujo («la pantalla ya no hace falta cuando …»)—. Lo que no es falso positivo se reescribe con el
 * estado actual, sin contraste y sin decir que se arregló: el condicional sirve para el contrafactual («sin este guard, X pasaría»), el presente
 * para el mecanismo; el porqué vigente puede quedarse en presente, la historia va a los comentarios del código, al commit o a docs/estudio-caminos.md.
 *
 * Qué NO demuestra: que una frase no salga no prueba que no cuente un cambio. Es un patrón sobre palabras; la narración sin ninguna de estas
 * palabras («la imagen se actualizó» dicha como «imagen actualizada») pasa. Cada barrido nuevo que encuentre una forma que este instrumento
 * no veía tiene que añadirle esa forma y su caso en la autoprueba.
 *
 * Una trampa de JavaScript que ya se llevó por delante una versión de este instrumento: `\b` no es frontera después de una vocal acentuada seguida de
 * un espacio («se retiró y» no casa con `…ó\b`: «ó» y « » son ambos no-palabra), así que las formas «se retiró / se eliminó / se añadió / se arregló»
 * no salían nunca. Las fronteras de todas las reglas se reescriben a lookarounds de letras españolas (`fronteras()`), y `--autoprueba` comprueba
 * que cada regla dura casa con sus casos positivos y no con sus negativos.
 *
 * Uso:
 *   node tools/estudio-caminos/guia-narracion.cjs                  toda la guía, duras y blandas
 *   node tools/estudio-caminos/guia-narracion.cjs --solo-duras     toda la guía, solo la familia dura
 *   node tools/estudio-caminos/guia-narracion.cjs --desde=HEAD     solo las líneas añadidas o cambiadas desde ese commit (lo que se acaba de escribir)
 *   node tools/estudio-caminos/guia-narracion.cjs --autoprueba     comprueba las reglas contra casos positivos y negativos; sale con 1 si alguno falla
 * `ESTUDIO_GUIA` apunta a otra copia de la guía. Fuera de `--autoprueba` sale siempre con código 0: es una lista para leer, no un veredicto.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./lib.cjs');

const GUIA = process.env.ESTUDIO_GUIA ? path.resolve(process.env.ESTUDIO_GUIA) : path.join(ROOT, 'docs/GUIA-COMPLETA.md');
const desde = (process.argv.find((a) => a.startsWith('--desde=')) || '').slice('--desde='.length);
const soloDuras = process.argv.includes('--solo-duras');

const LETRA = 'a-záéíóúñ';
// `\b` de JavaScript solo conoce [A-Za-z0-9_]: tras «ó» seguida de espacio no hay frontera. Se cambia cada `\b` por un lookaround de letras españolas:
// a la izquierda si lo precede el inicio, «(», «|» o «^»; a la derecha en cualquier otro caso.
const fronteras = (re) => new RegExp(re.source.replace(/\\b/g, (m, off, s) => (off === 0 || '(|^'.includes(s[off - 1]) ? `(?<![${LETRA}])` : `(?![${LETRA}])`)), re.flags);

// Palabras en -ía/-aba que no son imperfecto: sustantivos en -ía y presentes de verbos en -iar/-abar que aparecen en la guía.
const NO_IMPERFECTO = new Set(['día', 'días', 'guía', 'guías', 'vía', 'vías', 'tía', 'tías', 'todavía', 'envía', 'envían', 'reenvía', 'reenvían', 'vacía', 'vacían', 'confía', 'confían',
  'desvía', 'espía', 'varía', 'amplía', 'enfría', 'acaba', 'audioguía', 'policía', 'compañía', 'cofradía', 'alcaldía', 'lejanía', 'melodía', 'energía', 'batería', 'baterías',
  'galería', 'galerías', 'mayoría', 'minoría', 'categoría', 'categorías', 'auditoría', 'auditorías', 'garantía', 'garantías', 'jerarquía', 'gastronomía', 'iconografía', 'economía',
  'autonomía', 'geometría', 'teoría', 'alegría', 'simetría', 'telemetría', 'cartografía', 'geografía', 'fotografía', 'biografía', 'tipografía', 'bibliografía', 'orografía',
  'topografía', 'tecnología', 'metodología', 'cronología', 'geología', 'ecología', 'ideología', 'psicología', 'biología', 'tipología', 'topología', 'analogía', 'sociología']);
const esImperfecto = (w) => !NO_IMPERFECTO.has(w.toLowerCase()) && !/r(?:ía|ías|ían|íamos)$/i.test(w); // «sería», «podría», «tendría» son condicional

// Raíces de los verbos con que se cuenta un cambio: «se retiró», «se sustituyó» (raíz «sustituy»), «se movió», «se corrigió», «se añadió», …
const RAICES_CAMBIO = '(?:retir|elimin|quit|borr|suprim|descart|sustituy|reemplaz|renombr|mov|unific|fusion|arregl|corrig|repar|solucion|resolv|a[ñn]ad|incorpor|cambi|modific|separ|dividi|migr|simplific|reescrib|reorganiz|ajust|ampli|aument)';

// [nombre, expresión, blanda?, filtro opcional sobre la palabra que casó (solo reglas globales)]
const REGLAS = [
  ['ya no', /\bya no\b/i, false],
  ['antes/ahora', /\b(antes (hac[ií]a|era|se|sol[ií]a|mandaba|enviaba|ten[ií]a|hab[ií]a|estaba|usaba|devolv[ií]a|llamaba|le[ií]a|escrib[ií]a|aceptaba|permit[ií]a|dejaba|pon[ií]a|sal[ií]a|exist[ií]a|s[ií]|no)|que antes(?! de\b)|como antes|igual que antes|de antes|desde antes|hasta entonces|en su d[ií]a|ahora (hace|es|se|lleva|usa|tiene|va|pasa|llega|manda|env[ií]a|devuelve|solo|ya|s[ií]|tambi[eé]n|cada)|pero ahora|y ahora)\b/i, false],
  ['se + cambio', new RegExp(`\\bse (han )?${RAICES_CAMBIO}(ó|aron|ió|ieron|ad[oa]s?|id[oa]s?)\\b`, 'i'), false],
  ['participio de cambio', /\b(retirad|eliminad|suprimid|sustituid|reemplazad|renombrad)[oa]s?\b/i, false],
  ['arreglado', /\b(arreglad|corregid|reparad|solucionad)[oa]s?\b|\(fix\b|\bfix de\b|\bhotfix\b|\bparche\b|bug de campo|✅ corregido/i, false],
  ['añadido/nuevo', /\b(a[ñn]adid[oa]s? (tras|despu[eé]s|con posterioridad|por)|nuev[oa]s? (sistema|mecanismo|camino|handler|flujo|estructura|funci[oó]n)|primera implementaci[oó]n|revisi[oó]n posterior|— (imagen|texto|icono|valor|color|fichero) (actualizad|nuev|cambiad)[oa])\b/i, false],
  ['proceso', /\b(lavadora|paso \d+ de la (lavadora|migraci[oó]n|ronda|tanda)|decisi[oó]n \d+|decisiones D\d|esta ronda|la ronda|la tanda|tanda de arreglos|plan de la noche)\b/i, false],
  ['memoria privada', /(\[\[[a-z_-]+\]\]|\b(project|feedback)_[a-z]|memoria (del )?proyecto|en la memoria `)/i, false],
  ['fecha', /(\b\d{1,2}[- ](ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)\b|\b20[2-3]\d-\d{2}(-\d{2})?\b)/i, false],
  ['procedencia', /\b(reporte de (campo|uso real)|se not[oó] en campo|la sesi[oó]n que motiv[oó]|como ocurri[oó] en la sesi[oó]n|informe de campo)\b/i, false],
  ['imperfecto de incidente', /\b(se manifestaba|se quedaba|se perd[ií]a|se romp[ií]a|se descartaba|se ignoraba|se tragaba|se ve[ií]an?|este era|esto era|eso era|esas eran|ten[ií]a el mismo problema|hac[ií]a que|se consum[ií]an|fallaba|no funcionaba|saltaban de golpe|la causa real detr[aá]s)\b/i, false],
  ['antiguo/anterior', /\b(antiguo (par|bypass|comportamiento|formato|sistema|camino|handler|c[oó]digo)|comportamiento (antiguo|anterior)|versi[oó]n anterior|el anterior)\b/i, false],
  ['imperfecto (blando)', new RegExp(`(?<![${LETRA}])([${LETRA}]{2,}(?:aba|abas|aban|ábamos|ía|ías|ían|íamos))(?![${LETRA}])`, 'gi'), true, esImperfecto],
  ['se + pretérito (blando)', /\bse [a-záéíóúñ]+(?:ó|aron|ió|ieron)\b/gi, true],
  ['antes sin «de» (blando)', /\bantes\b(?! de\b| del\b| que\b| a\b| incluso\b| y después\b)/i, true],
  ['ahora (blando)', /\bahora\b/i, true],
  ['continuidad (blanda)', /\b(sigue (siendo|sin|existiendo)|siguen (siendo|sin))\b/i, true],
].map(([nombre, re, blanda, filtro]) => [nombre, fronteras(re), blanda, filtro]);

// Autoprueba: cada línea es [texto, reglas que DEBEN casar] ; con [] el texto no debe casar con ninguna regla DURA.
const CASOS = [
  ['Ya no reenvía el modo a hijo2.', ['ya no']],
  ['Antes hacía X y ahora hace Y.', ['antes/ahora']],
  ['Antes sí lo hacía (los ponía a `null`).', ['antes/ahora']],
  ['Se retiró con el resto.', ['se + cambio']],
  ['Se eliminó el import y se quitó el guard.', ['se + cambio']],
  ['Se sustituyó la comparación por otra.', ['se + cambio']],
  ['Se movió el botón al padre.', ['se + cambio']],
  ['El handler se unificó con el anterior.', ['se + cambio']],
  ['Se retiraron los dos alias.', ['se + cambio']],
  ['Se han retirado los dos alias.', ['se + cambio']],
  ['Fue retirado en esta ronda.', ['participio de cambio', 'proceso']],
  ['El fallo se arregló en hijo4.', ['se + cambio']],
  ['Se corrigió el orden.', ['se + cambio']],
  ['Se añadió tras la revisión.', ['se + cambio']],
  ['Es un parche para el caso de campo.', ['arreglado']],
  ['El botón (fix de la ronda 3) aparece.', ['arreglado', 'proceso']],
  ['Esto lo decide la decisión 11.', ['proceso']],
  ['Paso 9 de la lavadora.', ['proceso']],
  ['Ver [[project-estudio]] y feedback_guia_detalle.', ['memoria privada']],
  ['Cambiado el 24-jul por otro valor.', ['fecha']],
  ['Pasó en 2026-08 y en 2026-09-14.', ['fecha']],
  ['Reporte de campo real: el usuario caminaba.', ['procedencia']],
  ['Se notó en campo que se quedaba parado.', ['procedencia', 'imperfecto de incidente']],
  ['Antes saltaban de golpe al cambiar el valor.', ['imperfecto de incidente']],
  ['La causa real detrás del bug apuntaba a la parada 0.', ['imperfecto de incidente']],
  ['Se romperían igual que el comportamiento antiguo.', ['antiguo/anterior']],
  // negativos: flujo legítimo que NO debe disparar una regla dura
  ['`js/feedback-forms.js` envía el formulario.', []],
  ['Mismo reset que en el paso 6 de la rama CASA.', []],
  ['Pasa por sus propios guards que antes de aplicar nada comprueban el tiempo.', []],
  ['Este audita aquello con lo que se comprueba el código.', []],
  ['Se retira del Map al limpiarse y se añade una fila por pin.', []],
  ['El spinner se elimina al terminar y el botón se quita del DOM.', []],
  ['Aparece el cartel cuando el usuario pulsa el botón.', []],
  // blandas: deben casar con su regla blanda y no con una dura
  ['La búsqueda fallaba para todos los tramos.', ['imperfecto de incidente']],
  ['Si el hijo estaba en `hijosDesconectados`, se quita del set.', ['imperfecto (blando)']],
  ['Se resolvió luego por el otro camino.', ['se + cambio']],
];
if (process.argv.includes('--autoprueba')) {
  let fallos = 0;
  const duras = REGLAS.filter(([, , blanda]) => !blanda);
  const todas = REGLAS;
  const casa = (re, filtro, texto) => { re.lastIndex = 0; let m; while ((m = re.exec(texto))) { if (!filtro || filtro(m[1] || m[0])) return true; if (m[0].length === 0) re.lastIndex++; } return false; };
  for (const [texto, deben] of CASOS) {
    const dispara = (conjunto) => conjunto.filter(([, re, , filtro]) => casa(re, filtro, texto)).map(([n]) => n);
    const reales = dispara(todas);
    const faltan = deben.filter((n) => !reales.includes(n));
    const sobranDuras = deben.length === 0 ? dispara(duras) : [];
    if (faltan.length || sobranDuras.length) { fallos++; console.log(`FALLA: «${texto}»  faltan: [${faltan.join(', ')}]  sobran duras: [${sobranDuras.join(', ')}]  (casó con: ${reales.join(', ') || 'nada'})`); }
  }
  console.log(`autoprueba: ${CASOS.length} casos, ${fallos} fallos`);
  process.exit(fallos ? 1 : 0);
}

const lineas = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);
let soloEstas = null;
if (desde) {
  soloEstas = new Set();
  const d = execFileSync('git', ['diff', '-U0', desde, '--', path.relative(ROOT, GUIA).replace(/\\/g, '/')], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let n = 0;
  for (const l of d.split('\n')) {
    const h = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(l);
    if (h) { n = +h[1]; continue; }
    if (l.startsWith('+') && !l.startsWith('+++')) { soloEstas.add(n); n++; }
    else if (!l.startsWith('-') && !l.startsWith('\\')) n++;
  }
}

const hs = [];
lineas.forEach((l, i) => { const m = /^#{2,4} ([\d.]+)/.exec(l); if (m) hs.push([i, m[1]]); });
const seccion = (i) => { let s = ''; for (const [j, n] of hs) { if (j <= i) s = n; else break; } return s; };

// Primer casamiento de una regla en una línea (las globales recorren todos hasta dar con uno que pase el filtro).
const casar = (re, filtro, l) => {
  if (!re.global) { const m = re.exec(l); return m ? { index: m.index, texto: m[0] } : null; }
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(l))) {
    if (!filtro || filtro(m[1] || m[0])) return { index: m.index, texto: m[0] };
    if (m[0].length === 0) re.lastIndex++;
  }
  return null;
};

const porRegla = new Map();
const hits = [];
let dentro = false;
lineas.forEach((l, i) => {
  if (/^```/.test(l)) { dentro = !dentro; return; }
  if (dentro) return;
  if (soloEstas && !soloEstas.has(i + 1)) return;
  const casadas = [];
  let primero = -1;
  for (const [nombre, re, blanda, filtro] of REGLAS) {
    if (soloDuras && blanda) continue;
    const m = casar(re, filtro, l);
    if (m) { casadas.push(nombre); if (primero < 0 || m.index < primero) primero = m.index; porRegla.set(nombre, (porRegla.get(nombre) || 0) + 1); }
  }
  if (casadas.length) hits.push({ linea: i + 1, sec: seccion(i), casadas, ctx: l.slice(Math.max(0, primero - 90), primero + 150).replace(/\s+/g, ' ') });
});

for (const h of hits) console.log(`L${h.linea} §${h.sec || '?'} [${h.casadas.join(', ')}] …${h.ctx}`);
console.log(`\nlíneas con algún patrón${desde ? ` (solo las añadidas o cambiadas desde ${desde})` : ''}${soloDuras ? ' (solo duras)' : ''}: ${hits.length}`);
for (const [n, c] of [...porRegla.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${n.padEnd(28)}${c}`);
