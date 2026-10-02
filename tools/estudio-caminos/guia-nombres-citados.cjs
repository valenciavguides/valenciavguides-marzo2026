'use strict';
/**
 * guia-nombres-citados.cjs — identificadores que la guía cita entre backticks como si existieran y que no están en ningún fichero del
 * código (CLAUDE.md regla 8: la guía se consulta siempre y no se cree nunca; regla 10: una ausencia se comprueba con el nombre pelado).
 *
 * Toma de docs/GUIA-COMPLETA.md, fuera de los bloques de código, lo que va entre backticks con la forma de una función (`nombre()` o
 * `objeto.metodo()`, se comprueba el último segmento), de un handler o un global propio (`_hdl_x`, `_regCtrl_x`, `__vv_x`) o de un nombre
 * suelto en camelCase o con `_` delante, y lo busca como token identificador en todos los ficheros rastreados con código (html, js, cjs,
 * mjs, json y css, salvo `docs/`, `tools/`, `imagenes/` y los módulos de datos de aventuras y traducciones). Lo que no aparece sale en la
 * lista, con la primera frase donde la guía lo cita; los que solo aparecen en `tests/` van marcados.
 *
 * Lo que lista es un candidato, no una errata: se confirma leyendo la frase. Hay tres clases de falso positivo: la frase dice justo que
 * el nombre NO existe («no existe ninguna función `_propagarCambioModoAHijos`»), el nombre es del arnés de tests o de `tools/`, y el
 * nombre es un patrón («`mostrarCartelXXX`»). El resto —un nombre que se retiró, que se renombró o que nunca existió— es lo que busca.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { ROOT } = require('./lib.cjs');

const GUIA = process.env.ESTUDIO_GUIA ? path.resolve(process.env.ESTUDIO_GUIA) : path.join(ROOT, 'docs/GUIA-COMPLETA.md');
const rastreados = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split(/\r?\n/).filter(Boolean);
const esCodigo = (f) => /\.(html|js|cjs|mjs|json|css)$/.test(f)
  && !/^(docs|tools|imagenes|node_modules)\//.test(f)
  && !/^js\/(\w+-)?aventuras?|^js\/traducciones/.test(f);
const tokensDe = (f) => {
  try { return fs.readFileSync(path.join(ROOT, f), 'utf8').match(/[A-Za-z_$][\w$]*/g) || []; } catch { return []; }
};
const enCodigo = new Set();
const enTests = new Set();
for (const f of rastreados) {
  if (/^tests\//.test(f)) {
    if (/\.(js|cjs|mjs)$/.test(f)) for (const t of tokensDe(f)) enTests.add(t);
    continue;
  }
  if (esCodigo(f)) for (const t of tokensDe(f)) enCodigo.add(t);
}

const guia = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);
const falta = new Map(); // nombre -> [{ linea, soloTests, ctx }]
const reFn = /(?<![\w$.])((?:[A-Za-z_$][\w$]*\.)*)([A-Za-z_$][\w$]*)\(\)/g;
const reMarcado = /(?<![\w$])(_hdl_\w+|__vv_\w+|_regCtrl_\w+)(?![\w$])/g;
let dentroBloque = false;
guia.forEach((l, i) => {
  if (/^```/.test(l)) { dentroBloque = !dentroBloque; return; }
  if (dentroBloque) return; // los bloques de código mezclan pseudocódigo y otros lenguajes
  for (const m of l.matchAll(/`([^`\n]+)`/g)) {
    const span = m[1];
    const nombres = [];
    for (const f of span.matchAll(reFn)) nombres.push(f[2]);
    for (const f of span.matchAll(reMarcado)) nombres.push(f[1]);
    if (/^[A-Za-z_$][\w$]*$/.test(span) && (/^[a-z]+[A-Z]/.test(span) || /^_/.test(span))) nombres.push(span);
    for (const n of nombres) {
      if (n.length < 4 || enCodigo.has(n)) continue;
      if (!falta.has(n)) falta.set(n, []);
      falta.get(n).push({ linea: i + 1, soloTests: enTests.has(n), ctx: l.trim().slice(0, 150) });
    }
  }
});
for (const [n, usos] of [...falta.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`${n}${usos.some((u) => u.soloTests) ? ' [solo en tests]' : ''}  (${usos.length} cita${usos.length > 1 ? 's' : ''}) L${usos.slice(0, 4).map((u) => u.linea).join(', L')}`);
  console.log(`     ${usos[0].ctx}`);
}
console.log(`\nnombres citados que no existen en el código: ${falta.size}`);
