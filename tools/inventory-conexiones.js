#!/usr/bin/env node
/**
 * inventory-conexiones.js — Conexiones compartidas del proyecto
 *
 * A diferencia de inventory.js (catálogo de funciones), esto responde a
 * "¿qué otros scripts/archivos se ven afectados si toco este identificador?"
 * — el hueco que ha causado varios bugs reales (ver docs/GUIA-COMPLETA.md
 * §37, "Mapa de conexiones compartidas").
 *
 * Modo por defecto: para CADA archivo .html con 2+ bloques <script> inline
 * (cualquier variante — clásico o type="module", nunca <script src="...">,
 * que no tiene cuerpo que analizar), detecta esos bloques dinámicamente
 * (sus rangos de línea se desplazan con cada edición) y, para cada
 * `globalThis.X = ...`, comprueba en qué otros bloques del MISMO archivo se
 * lee/escribe `X` — si aparece en más de uno, es una conexión cruzada real.
 * codigo-padre.html es el caso con más bloques (5 module + varios clásicos),
 * pero no el único — En-busca-del-tesoro.html, video-intro.html,
 * retos-hijo4.html y chat-hijo6.html también tienen 2+.
 *
 * Uso:
 *   node tools/inventory-conexiones.js              → tabla markdown por archivo, solo cruzadas
 *   node tools/inventory-conexiones.js --assets      → imágenes/iconos usados en 2+ archivos,
 *                                                       barriendo .html, .js, .json y sw.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARGS = process.argv.slice(2);
const ASSETS_MODE = ARGS.includes('--assets');

function lineOf(src, index) {
    return src.slice(0, index).split('\n').length;
}

function walk(dir, exts, exclude, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const rel = path.relative(ROOT, full).replace(/\\/g, '/');
        if (exclude.some(ex => rel.startsWith(ex))) continue;
        if (entry.isDirectory()) walk(full, exts, exclude, out);
        else if (exts.includes(path.extname(entry.name))) out.push(full);
    }
    return out;
}

// ── Modo --assets: imágenes usadas en 2+ archivos, en todo el proyecto ─────
function modoAssets() {
    const EXCLUDE = ['node_modules', 'test-results', 'tests', '.git', 'playwright-report'];
    const files = [
        ...walk(ROOT, ['.html'], EXCLUDE.concat(['docs'])), // docs/ tiene sus propias referencias de ejemplo, no reales
        ...walk(path.join(ROOT, 'js'), ['.js'], EXCLUDE, []),
        ...walk(path.join(ROOT, 'tools'), ['.js', '.mjs'], EXCLUDE, []),
        path.join(ROOT, 'sw.js'),
        path.join(ROOT, 'manifest.json'),
    ].filter(f => fs.existsSync(f));

    // Captura tanto rutas literales ("imagenes/x.png") como el nombre de fichero
    // suelto tras una plantilla/variable ("${AI}x.png") — el prefijo real no
    // siempre es un literal, así que se agrupa por nombre de fichero, no por
    // ruta completa.
    const refPattern = /(?:[\w./áéíóúñÁÉÍÓÚÑ -]*\/)?([\w-]+\.(?:png|jpg|jpeg|gif|svg))/g;
    const map = new Map(); // filename -> Set(files)

    for (const f of files) {
        const rel = path.relative(ROOT, f).replace(/\\/g, '/');
        const src = fs.readFileSync(f, 'utf8');
        let m;
        refPattern.lastIndex = 0;
        while ((m = refPattern.exec(src)) !== null) {
            const asset = m[1];
            if (!map.has(asset)) map.set(asset, new Set());
            map.get(asset).add(rel);
        }
    }

    const compartidos = [...map.entries()]
        .filter(([, fs_]) => fs_.size >= 2)
        .sort((a, b) => b[1].size - a[1].size);

    console.log(`| Asset | Usado en (${compartidos.length} compartidos de ${map.size} totales, ${files.length} archivos escaneados: *.html raíz, js/**, tools/**, sw.js, manifest.json) |`);
    console.log('|---|---|');
    for (const [asset, fs_] of compartidos) {
        console.log(`| \`${asset}\` | ${[...fs_].sort().map(f => `\`${f}\``).join(', ')} |`);
    }
}

if (ASSETS_MODE) {
    modoAssets();
    process.exit(0);
}

// ── Modo por defecto: globalThis cruzado entre bloques <script>, por archivo ─
// <script(?![^>]*\bsrc=)[^>]*> — cualquier <script ...> SIN atributo src (que
// no tendría cuerpo inline que analizar), clásico o type="module" por igual.
const SCRIPT_OPEN_RE = /<script(?![^>]*\bsrc=)([^>]*)>/g;

// Etiqueta cada bloque como "módulo N" o "clásico N" (numerados dentro de su
// propio tipo) en vez de un índice global secuencial — así "módulo 1" de
// codigo-padre.html coincide siempre con el "Script 1" que usa el resto de
// esta guía y CLAUDE.md, tenga o no clásicos intercalados entre medias.
function detectarBloques(src) {
    const blocks = [];
    let m, nModulo = 0, nClasico = 0;
    SCRIPT_OPEN_RE.lastIndex = 0;
    while ((m = SCRIPT_OPEN_RE.exec(src)) !== null) {
        const closeIdx = src.indexOf('</script>', m.index);
        if (closeIdx === -1) continue;
        const esModulo = /type\s*=\s*["']module["']/.test(m[1]);
        const label = esModulo ? `módulo ${++nModulo}` : `clásico ${++nClasico}`;
        blocks.push({ start: lineOf(src, m.index), end: lineOf(src, closeIdx), label });
    }
    return blocks;
}

function analizarArchivo(rel, src) {
    const blocks = detectarBloques(src);
    if (blocks.length < 2) return null; // nada que cruzar con un único bloque

    const labelDeLinea = (line) => {
        const b = blocks.find(bl => line >= bl.start && line <= bl.end);
        return b ? b.label : null; // fuera de cualquier <script> (HTML/texto)
    };

    const asignRe = /globalThis\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=(?![=>])\s*([^;]*)/g;
    const asignaciones = new Map();
    let m;
    while ((m = asignRe.exec(src)) !== null) {
        const name = m[1];
        if (name === 'logger' || name === 'console') continue;
        const line = lineOf(src, m.index);
        const label = labelDeLinea(line);
        if (label === null) continue;
        const rhs = m[2].trim();
        const esFuncion = /^(async\s+)?(function|\(.*\)\s*=>|\{)/.test(rhs) || /^[a-zA-Z_$][\w$]*$/.test(rhs);
        if (!asignaciones.has(name)) asignaciones.set(name, { line, label, esFuncion });
    }

    const resultado = [];
    for (const [name, info] of asignaciones) {
        const labelsConUso = new Set();
        const usoRe = new RegExp(`\\b${name}\\b`, 'g');
        let u;
        usoRe.lastIndex = 0;
        while ((u = usoRe.exec(src)) !== null) {
            const l = labelDeLinea(lineOf(src, u.index));
            if (l !== null) labelsConUso.add(l);
        }
        resultado.push({ name, ...info, labels: [...labelsConUso] });
    }

    const cruzados = resultado.filter(r => r.labels.length >= 2);
    return { totalBloques: blocks.length, totalExpuestos: resultado.length, cruzados };
}

const EXCLUDE = ['node_modules', 'test-results', 'tests', '.git', 'playwright-report'];
const htmlFiles = walk(ROOT, ['.html'], EXCLUDE.concat(['docs']));

let totalCruzadosGlobal = 0;
for (const filePath of htmlFiles) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const src = fs.readFileSync(filePath, 'utf8');
    const analisis = analizarArchivo(rel, src);
    if (!analisis || analisis.cruzados.length === 0) continue;

    totalCruzadosGlobal += analisis.cruzados.length;
    console.log(`## ${rel} (${analisis.totalBloques} bloques <script> inline)\n`);
    console.log(`${analisis.cruzados.length} identificadores cruzan entre bloques (de ${analisis.totalExpuestos} totales expuestos vía globalThis).\n`);
    console.log('| Identificador | Definido en | Usado también en | Tipo |');
    console.log('|---|---|---|---|');
    for (const r of analisis.cruzados.sort((a, b) => a.label.localeCompare(b.label) || a.name.localeCompare(b.name))) {
        const otros = r.labels.filter(l => l !== r.label);
        console.log(`| \`${r.name}\` | ${r.label} (L${r.line}) | ${otros.join(', ')} | ${r.esFuncion ? 'función/objeto' : 'estado'} |`);
    }
    console.log('');
}

console.log(`(${totalCruzadosGlobal} identificadores cruzados en total, en los ${htmlFiles.filter(f => detectarBloques(fs.readFileSync(f, 'utf8')).length >= 2).length} archivos con 2+ bloques <script> inline)`);
