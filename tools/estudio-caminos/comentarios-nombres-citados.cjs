'use strict';
/**
 * comentarios-nombres-citados.cjs — identificadores que un COMENTARIO del código cita como si existieran y que no están en ningún fichero como código
 * (CLAUDE.md regla 8: lo que se escribe sobre el código se consulta contra el código; regla 10: una ausencia se comprueba con el nombre pelado).
 *
 * Es la pareja de `guia-nombres-citados.cjs` para los comentarios: lo que se retira de producción deja a veces un comentario que sigue citándolo
 * como vivo («lo emite `_manejarX`»). Los ficheros de producción son las páginas `.html` de la raíz, los `js/*.js` (sin `vendor/`, sin
 * `server.js`, sin los módulos de datos) y `sw.js`. De cada comentario de JavaScript se toman los identificadores con forma de nombre propio
 * —camelCase con minúscula inicial, `_nombre`, `nombre()` con paréntesis vacíos, y las constantes con puntos de `TIPOS_MENSAJE` (se mira su
 * último segmento)— y se buscan como token en el TEXTO SIN COMENTARIOS de todos esos ficheros y de los specs (`tests/`): un nombre que solo
 * aparece en comentarios no cuenta como existente. Lo que no aparece sale en la lista con el sitio de cada cita; los que solo aparecen en
 * specs van marcados.
 *
 * Lo que lista es un candidato, no una errata. Hay cuatro clases de falso positivo: el comentario cuenta justo el historial de algo que ya no
 * existe (el «porqué» vive en los comentarios, y ahí la historia es legítima), el nombre es de una API externa que el código no escribe
 * (MapLibre, el navegador), el nombre es un ejemplo o un patrón, y el nombre es un identificador local de un fragmento de código que el
 * comentario copia. El resto —un nombre que se retiró o que se renombró y que el comentario sigue dando por vivo— es lo que busca.
 *
 * Residuo: los bloques de script que no parsean (sus comentarios no se leen y su texto entra con los comentarios dentro) y los comentarios de
 * HTML y de CSS, que no se miran.
 */
const { execSync } = require('child_process');
const { RAIZ, paginas, modulos, bloques, parsear, blanquear, leer } = require('../lib/analisis-js.js');

const produccion = [...paginas(), ...modulos({ conDatos: false }), 'sw.js'];
const tokensDe = (t) => t.match(/[A-Za-z_$][\w$]*/g) || [];

// Texto sin comentarios y comentarios de cada fichero de producción
const enCodigo = new Set();
const enTests = new Set();
const comentarios = []; // { fichero, linea, texto }
const sinParsear = [];
for (const rel of produccion) {
  const src = leer(rel);
  let texto = rel.endsWith('.html') ? src.replace(/<!--[\s\S]*?-->/g, blanquear) : src;
  for (const b of bloques(rel, src)) {
    const p = parsear(b.code);
    if (!p) { sinParsear.push(`${rel}: bloque en la línea ${b.lineaBase + 1}`); continue; }
    for (const c of p.comentarios) {
      texto = texto.slice(0, b.inicio + c.start) + blanquear(texto.slice(b.inicio + c.start, b.inicio + c.end)) + texto.slice(b.inicio + c.end);
      comentarios.push({ fichero: rel, linea: b.lineaBase + c.loc.start.line, texto: c.value });
    }
  }
  for (const t of tokensDe(texto)) enCodigo.add(t);
}
// Los specs y sus ayudas: su código cuenta como existencia, marcada aparte
const rastreados = execSync('git ls-files', { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split(/\r?\n/).filter(Boolean);
for (const f of rastreados) {
  if (!/^tests\/e2e\/.*\.(js|cjs|mjs)$/.test(f)) continue;
  const src = leer(f);
  const p = parsear(src);
  let texto = src;
  if (p) { let out = ''; let pos = 0; for (const c of p.comentarios) { out += src.slice(pos, c.start) + blanquear(src.slice(c.start, c.end)); pos = c.end; } texto = out + src.slice(pos); }
  for (const t of tokensDe(texto)) enTests.add(t);
}

// Nombres con forma de identificador propio dentro de un comentario
const reCamel = /(?<![\w$.'"`])([a-z_$][a-z0-9_$]*[A-Z][A-Za-z0-9_$]*)(?![\w$'"`])/g;
const reFuncion = /(?<![\w$.'"`])([a-z_$][\w$]{4,})\(\)/g;
const reConstante = /(?<![\w$])((?:[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*)(?:\.[A-Z][A-Z0-9_]*)+)(?![\w$])/g;
const falta = new Map(); // nombre -> [{ fichero, linea, ctx }]
for (const c of comentarios) {
  const lineas = c.texto.split('\n');
  lineas.forEach((l, i) => {
    const nombres = new Set();
    for (const m of l.matchAll(reCamel)) nombres.add(m[1]);
    for (const m of l.matchAll(reFuncion)) nombres.add(m[1]);
    for (const m of l.matchAll(reConstante)) nombres.add(m[1].split('.').pop());
    for (const n of nombres) {
      if (n.length < 5 || enCodigo.has(n)) continue;
      if (!falta.has(n)) falta.set(n, []);
      falta.get(n).push({ fichero: c.fichero, linea: c.linea + i, ctx: l.trim().slice(0, 150) });
    }
  });
}

const orden = [...falta.entries()].sort((a, b) => a[0].localeCompare(b[0]));
for (const [n, usos] of orden) {
  const marca = enTests.has(n) ? ' [solo en tests]' : '';
  console.log(`${n}${marca}  (${usos.length} cita${usos.length > 1 ? 's' : ''}) ${usos.slice(0, 3).map((u) => `${u.fichero}:${u.linea}`).join(', ')}`);
  console.log(`     ${usos[0].ctx}`);
}
console.log(`\nficheros de producción: ${produccion.length}; comentarios de JavaScript leídos: ${comentarios.length}`);
console.log(`nombres citados en comentarios que no existen como código: ${falta.size}`);
console.log(`Residuo: ${sinParsear.length} bloque(s) sin parsear${sinParsear.length ? ' — ' + sinParsear.join('; ') : ''}`);
