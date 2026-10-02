#!/usr/bin/env node
/**
 * codigo-muerto.js — Busca lo que `inventory.js` no ve.
 *
 * `inventory.js` cataloga funciones y detecta nombres duplicados en varios ficheros, pero no
 * dice si algo se USA. Se ha comprobado en la práctica que deja pasar código muerto real:
 * `tramoAudioPendiente` (se escribe en dos sitios y no lo lee nadie), `solicitarDatosAHijo`
 * y `getInfoDispositivo` (documentados como si existieran, sin definición en ninguna parte).
 *
 * Este script busca cinco cosas distintas:
 *
 *   1. FUNCIONES SIN LLAMADOR — definidas y nunca invocadas, ni por nombre ni por referencia
 *      (pasar la función como valor a registrarControlador, addEventListener, etc. cuenta).
 *   2. CAMPOS DE ESTADO SOLO-ESCRITURA — propiedades a las que se asigna valor pero que nunca
 *      se leen. Son el caso más silencioso: el código parece vivo porque alguien lo mantiene.
 *   3. CONSTANTES SIN USO — declaradas y nunca referenciadas fuera de su propia línea.
 *   4. CONTENEDORES QUE SOLO SE RELLENAN — `Map`/`Set` que se mutan (`.set`/`.add`) y nunca
 *      se consultan (`.get`/`.has`/`.size`/iteración). La categoría 2 no los ve: busca
 *      `objeto.campo = …` y un contenedor no se reasigna nunca, solo se muta.
 *   5. EXPORTS SIN USO FUERA DE SU MÓDULO — cada `export` de `js/*.js` cuyo nombre no aparece
 *      como identificador (con el parser: sin comentarios ni cadenas) en ningún otro fichero de
 *      producción. Es la única categoría que ve un export nunca importado: las cuatro de arriba
 *      buscan el nombre en el texto, y cualquier mención —un comentario, una cadena, el
 *      `export` del propio módulo— lo cuenta como uso. Se separan tres grupos: muertos del
 *      todo, solo nombrados por los specs y con uso solo interno (se exportan sin que nadie de
 *      fuera los pida). Sobreaproxima el uso: un identificador igual en otro sitio cuenta, así
 *      que lo que sale es ausencia casi segura. NO ve accesos por cadena (`obj['nombre']`).
 *
 * NO decide nada: imprime candidatos para revisarlos UNO A UNO. Tiene falsos positivos
 * conocidos y esperables — nombres alcanzados por string (`globalThis[nombre]`), APIs
 * pensadas para los tests, handlers registrados por tabla. Verificar antes de borrar.
 *
 * Límites medidos (las categorías 1 a 4 buscan por texto): no ven una función que solo llama
 * un test, una rama sin llamadores dentro de una función viva, ni un campo que solo se lee a sí
 * mismo (un historial cuya única lectura es la que lo cuenta). Para saber si algo se EJECUTA, no
 * basta esta lista: se lee el llamador, o se mide en la app (cobertura de Playwright).
 *
 * Uso:
 *   node tools/codigo-muerto.js              → las cinco categorías
 *   node tools/codigo-muerto.js --funciones  → solo funciones sin llamador
 *   node tools/codigo-muerto.js --campos     → solo campos solo-escritura
 *   node tools/codigo-muerto.js --constantes → solo constantes sin uso
 *   node tools/codigo-muerto.js --contenedores → solo Map/Set que nadie consulta
 *   node tools/codigo-muerto.js --exports    → solo exports sin uso fuera de su módulo
 */
const fs = require('fs');
const path = require('path');
const L = require('./lib/analisis-js');

const RAIZ = path.resolve(__dirname, '..');
const ARGS = process.argv.slice(2);
const SOLO = ARGS.find((a) => a.startsWith('--'))?.slice(2) || null;

const SALTAR_DIR = new Set(['node_modules', '.git', 'test-results', 'report', 'playwright-report', 'coverage']);
const EXT = new Set(['.js', '.html']);

// Ficheros que no forman parte de la app en producción: sus definiciones no cuentan como
// código de la app, pero sus USOS sí (un test que llama a algo lo mantiene vivo a efectos
// de no borrarlo a ciegas).
const NO_ES_APP = (rel) => rel.startsWith('tests/') || rel.startsWith('tools/') || rel.includes('vendor/');

const ficheros = [];
(function recorrer(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SALTAR_DIR.has(e.name)) continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) recorrer(full);
        else if (EXT.has(path.extname(e.name))) ficheros.push(full);
    }
})(RAIZ);

const contenido = new Map();
// Este fichero queda FUERA del corpus: sus comentarios citan por nombre los casos de
// ejemplo, y esas menciones se contaban como usos reales — `tramoAudioPendiente` dejaba
// de detectarse justo por aparecer en la cabecera que lo pone de ejemplo.
const YO_MISMO = 'tools/codigo-muerto.js';
for (const f of ficheros) {
    const rel = path.relative(RAIZ, f).split(path.sep).join('/');
    if (rel === YO_MISMO) continue;
    contenido.set(rel, fs.readFileSync(f, 'utf8'));
}

/** Cuenta apariciones de `nombre` como palabra completa en todo el proyecto. */
function apariciones(nombre) {
    const re = new RegExp(`\\b${nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const porFichero = [];
    let total = 0;
    for (const [rel, txt] of contenido) {
        const n = (txt.match(re) || []).length;
        if (n) { porFichero.push([rel, n]); total += n; }
    }
    return { total, porFichero };
}

// Escrituras que el navegador consume, no el código: no son código muerto.
const OBJETOS_DOM = new Set(['style', 'dataset', 'classList', 'document', 'location', 'history', 'navigator']);
const PROPS_DOM = new Set([
    'innerHTML', 'outerHTML', 'textContent', 'innerText', 'className', 'title', 'href', 'src',
    'srcdoc', 'alt', 'disabled', 'checked', 'hidden', 'value', 'placeholder', 'width', 'height',
    'volume', 'currentTime', 'playbackRate', 'muted', 'loop', 'autoplay', 'controls', 'poster',
    'onclick', 'onload', 'onerror', 'onchange', 'oninput', 'onkeydown', 'onended', 'onmessage',
    'allowFullscreen', 'crossOrigin', 'referrerPolicy', 'loading', 'decoding', 'fetchPriority',
    'scrollTop', 'scrollLeft', 'tabIndex', 'draggable', 'contentEditable', 'lang', 'dir',
    'fillStyle', 'strokeStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline', 'globalAlpha',
    'frameBorder', 'htmlFor', 'lastIndex', 'onmouseover', 'onmouseout', 'ontouchstart',
    'playsInline', 'readOnly', 'spellcheck', 'shadowBlur', 'shadowColor', 'autocomplete',
    'multiple', 'required', 'maxLength', 'minLength', 'step', 'min', 'max', 'rows', 'cols',
]);

const IGNORAR = new Set([
    'constructor', 'default', 'function', 'return', 'if', 'for', 'while', 'switch', 'catch',
    'then', 'value', 'name', 'length', 'type', 'data', 'id', 'key', 'index', 'error',
]);

// ── 1. Funciones sin llamador ──────────────────────────────────────────────
function funcionesSinLlamador() {
    const defs = new Map();   // nombre -> [ficheros donde se define]
    for (const [rel, txt] of contenido) {
        if (NO_ES_APP(rel)) continue;
        for (const m of txt.matchAll(/^[ \t]*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/gm)) {
            if (IGNORAR.has(m[1])) continue;
            if (!defs.has(m[1])) defs.set(m[1], []);
            defs.get(m[1]).push(rel);
        }
    }
    const muertas = [];
    for (const [nombre, donde] of defs) {
        const { total } = apariciones(nombre);
        // 1 aparición = solo su propia definición. 2 con una sola definición suele ser
        // definición + export/globalThis, que tampoco es un uso real: se marca como dudosa.
        if (total <= donde.length) muertas.push({ nombre, donde, total, nivel: 'sin uso' });
    }
    return muertas;
}

// ── 2. Campos de estado solo-escritura ─────────────────────────────────────
function camposSoloEscritura() {
    const candidatos = new Map();   // campo -> ficheros donde se asigna
    for (const [rel, txt] of contenido) {
        if (NO_ES_APP(rel)) continue;
        // objeto.campo = ...   (no ==, no ===, no =>). Se captura también el objeto para
        // poder descartar el DOM: `el.style.color = …` o `img.src = …` son escrituras por
        // naturaleza —las lee el navegador, no el código— y llenarían la lista de ruido.
        for (const m of txt.matchAll(/(\w+)\.(_?[a-zA-Z][a-zA-Z0-9_]{3,})\s*=(?![=>])/g)) {
            const objeto = m[1];
            const c = m[2];
            if (IGNORAR.has(c) || OBJETOS_DOM.has(objeto) || PROPS_DOM.has(c)) continue;
            if (!candidatos.has(c)) candidatos.set(c, new Set());
            candidatos.get(c).add(rel);
        }
    }
    const muertos = [];
    for (const [campo, donde] of candidatos) {
        let escrituras = 0, declaraciones = 0, total = 0;
        const reEscritura = new RegExp('\\.' + campo + '\\s*=(?![=>])', 'g');
        // `campo: valor` dentro de un objeto literal es la DECLARACION del campo, no una
        // lectura. Contarla como lectura hacia que un campo escrito y nunca leido pareciera
        // tener un consumidor, y a la vez marcaba como muertos campos con una lectura real.
        const reDeclaracion = new RegExp('(^|[,{(\\s])' + campo + '\\s*:', 'gm');
        const reTotal = new RegExp('\\b' + campo + '\\b', 'g');
        for (const [, txt] of contenido) {
            escrituras += (txt.match(reEscritura) || []).length;
            declaraciones += (txt.match(reDeclaracion) || []).length;
            total += (txt.match(reTotal) || []).length;
        }
        const lecturas = total - escrituras - declaraciones;
        if (lecturas <= 0) muertos.push({ campo, donde: [...donde], escrituras, lecturas });
    }
    return muertos;
}

// ── 3. Constantes sin uso ──────────────────────────────────────────────────
function constantesSinUso() {
    const defs = new Map();
    for (const [rel, txt] of contenido) {
        if (NO_ES_APP(rel)) continue;
        for (const m of txt.matchAll(/^[ \t]*(?:export\s+)?const\s+([A-Z][A-Z0-9_]{3,})\s*=/gm)) {
            if (!defs.has(m[1])) defs.set(m[1], []);
            defs.get(m[1]).push(rel);
        }
    }
    const muertas = [];
    for (const [nombre, donde] of defs) {
        const { total } = apariciones(nombre);
        if (total <= donde.length) muertas.push({ nombre, donde, total });
    }
    return muertas;
}

// ── 4. Contenedores que solo se rellenan ───────────────────────────────────
//
// Un `Map`/`Set` nunca se REASIGNA: se declara una vez y se muta con `.set()`/`.add()`.
// La categoría 2 busca `objeto.campo = …`, así que un contenedor así ni siquiera entra en
// su lista de candidatos — es un punto ciego de clase entera, no un caso suelto.
// (`audioEscuchadoPorParada` vivió así: un `.set()`, cero lecturas, invisible para la
// categoría 2 porque nadie le asignó nunca nada con `=`.)
//
// Aquí se cuentan las MUTACIONES contra las CONSULTAS. Un contenedor que solo crece y
// nunca se pregunta no responde a nadie: es una anotación que nadie lee.
const MUTAN = ['set', 'add', 'push', 'unshift', 'delete', 'clear'];
const CONSULTAN = ['get', 'has', 'size', 'length', 'keys', 'values', 'entries', 'forEach',
    'find', 'filter', 'map', 'some', 'every', 'includes', 'indexOf', 'join', 'reduce', 'slice'];

function contenedoresSoloEscritura() {
    const decl = new Map();   // nombre -> { fichero, tipo }
    for (const [rel, txt] of contenido) {
        if (NO_ES_APP(rel)) continue;
        // `campo: new Map()` en un literal, o `const x = new Set()`
        for (const m of txt.matchAll(/(?:^[ \t]*(?:const|let|var)\s+|[,{]\s*)(_?[a-zA-Z][\w$]{3,})\s*[:=]\s*new\s+(Map|Set|WeakMap|WeakSet)\s*\(/gm)) {
            if (!decl.has(m[1])) decl.set(m[1], { donde: rel, tipo: m[2] });
        }
    }
    const muertos = [];
    for (const [nombre, info] of decl) {
        let total = 0, declara = 0, muta = 0, consulta = 0;
        for (const [, txt] of contenido) {
            total += (txt.match(new RegExp('\\b' + nombre + '\\b', 'g')) || []).length;
            declara += (txt.match(new RegExp('\\b' + nombre + '\\s*[:=]\\s*new\\s+(?:Weak)?(?:Map|Set)\\b', 'g')) || []).length;
            for (const met of MUTAN) muta += (txt.match(new RegExp('\\b' + nombre + '\\.' + met + '\\s*\\(', 'g')) || []).length;
            for (const met of CONSULTAN) consulta += (txt.match(new RegExp('\\b' + nombre + '\\.' + met + '\\b', 'g')) || []).length;
        }
        // Todo lo que no sea su declaración, una mutación o una consulta es el contenedor
        // ESCAPANDO del scope: `return mapa`, `return { k: mapa }`, `f(mapa)`. Quien lo
        // recibe es su consumidor, y desde aquí no se ve qué hace con él.
        //
        // Esto no es prudencia genérica: sin ello la categoría daba 6 falsos positivos por
        // cada acierto —`deepClone` devolviendo su clon, `mensajeria` devolviendo el Map
        // nuevo dentro de un literal, `esperarRespuestas(_respuestasEntendidoActual, …)`—
        // y una lista así no la mira nadie. Solo queda lo que se rellena y se queda quieto.
        const escapa = total - declara - muta - consulta;
        if (muta > 0 && consulta === 0 && escapa <= 0) muertos.push({ nombre, ...info, muta });
    }
    return muertos;
}

// ── 5. Exports sin uso fuera de su módulo ──────────────────────────────────
//
// Para cada `export` con nombre de `js/*.js`: cuántas veces aparece su nombre como identificador
// en los demás ficheros de producción (páginas y módulos) y en los specs.
function exportsSinUso() {
    const produccion = [...L.paginas(), ...L.modulos()];
    const specs = fs.readdirSync(path.join(RAIZ, 'tests', 'e2e'))
        .filter((f) => f.endsWith('.js'))
        .map((f) => 'tests/e2e/' + f);
    const ident = new Map();
    const sinTokens = [];
    for (const rel of [...produccion, ...specs]) {
        const c = L.identificadoresDeFichero(rel);
        if (c) ident.set(rel, c); else sinTokens.push(rel);
    }
    const muertos = [], soloSpecs = [], internos = [];
    let total = 0;
    for (const mod of L.modulos()) {
        const exps = L.exportsDe(mod);
        if (!exps) { sinTokens.push(mod); continue; }
        const claves = L.clavesDeObjeto(mod);
        for (const { nombre, linea, base } of exps) {
            total++;
            let fuera = 0, enSpecs = 0;
            for (const f of produccion) if (f !== mod) fuera += ident.get(f)?.get(nombre) || 0;
            for (const f of specs) enSpecs += ident.get(f)?.get(nombre) || 0;
            if (fuera > 0) continue;
            const propios = (ident.get(mod)?.get(nombre) || 0) - base - (claves[nombre] || 0);
            const fila = { nombre, donde: `${mod}:${linea}` };
            if (propios > 0) internos.push({ ...fila, nota: `${propios} uso(s) en su propio módulo` });
            else if (enSpecs > 0) soloSpecs.push({ ...fila, nota: `${enSpecs} mención(es) en specs` });
            else muertos.push(fila);
        }
    }
    return { total, muertos, soloSpecs, internos, sinTokens };
}

function imprimir(titulo, filas, formato) {
    console.log(`\n${'─'.repeat(78)}\n${titulo}\n${'─'.repeat(78)}`);
    if (!filas.length) { console.log('  (ninguno)'); return; }
    filas.forEach((f) => console.log('  ' + formato(f)));
    console.log(`\n  ${filas.length} candidato(s) — verificar uno a uno antes de tocar nada.`);
}

if (!SOLO || SOLO === 'funciones') {
    const f = funcionesSinLlamador().sort((a, b) => a.nombre.localeCompare(b.nombre));
    imprimir('1. FUNCIONES SIN LLAMADOR', f, (x) => `${x.nombre.padEnd(42)} ${x.donde.join(', ')}`);
}
if (!SOLO || SOLO === 'campos') {
    const c = camposSoloEscritura().sort((a, b) => a.campo.localeCompare(b.campo));
    imprimir('2. CAMPOS DE ESTADO SOLO-ESCRITURA (se asignan, nadie los lee)', c,
        (x) => `${x.campo.padEnd(42)} ${String(x.escrituras).padStart(2)} escrituras, ${String(x.lecturas).padStart(2)} lecturas   ${x.donde.join(', ')}`);
}
if (!SOLO || SOLO === 'contenedores') {
    const m = contenedoresSoloEscritura().sort((a, b) => a.nombre.localeCompare(b.nombre));
    imprimir('4. CONTENEDORES QUE SOLO SE RELLENAN (Map/Set mutados, nunca consultados)', m,
        (x) => `${x.nombre.padEnd(42)} ${x.tipo.padEnd(8)} ${String(x.muta).padStart(2)} mutaciones, 0 consultas   ${x.donde}`);
}
if (!SOLO || SOLO === 'constantes') {
    const k = constantesSinUso().sort((a, b) => a.nombre.localeCompare(b.nombre));
    imprimir('3. CONSTANTES SIN USO', k, (x) => `${x.nombre.padEnd(42)} ${x.donde.join(', ')}`);
}
if (!SOLO || SOLO === 'exports') {
    const e = exportsSinUso();
    const porNombre = (a, b) => a.nombre.localeCompare(b.nombre);
    const formato = (x) => `${x.nombre.padEnd(34)} ${x.donde}${x.nota ? '  (' + x.nota + ')' : ''}`;
    console.log(`\n${'─'.repeat(78)}\n5. EXPORTS SIN USO FUERA DE SU MÓDULO (${e.total} exports analizados)\n${'─'.repeat(78)}`);
    imprimir('5a. MUERTOS DEL TODO (el nombre solo aparece en su declaración y su export)', e.muertos.sort(porNombre), formato);
    imprimir('5b. SOLO LOS NOMBRAN LOS SPECS', e.soloSpecs.sort(porNombre), formato);
    imprimir('5c. USO SOLO INTERNO (se exportan sin que nadie de fuera los pida)', e.internos.sort(porNombre), formato);
    console.log(`\n  Residuo: ${e.sinTokens.length} fichero(s) sin tokenizar${e.sinTokens.length ? ' — ' + e.sinTokens.join(', ') : ''}`);
}
console.log('\nEste script NO decide: son candidatos. Falsos positivos esperables — nombres');
console.log('alcanzados por string, APIs para tests, handlers registrados por tabla.\n');
