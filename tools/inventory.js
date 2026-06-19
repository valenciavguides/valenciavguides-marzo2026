#!/usr/bin/env node
/**
 * inventory.js — Catálogo de funciones del proyecto
 *
 * Uso:
 *   node tools/inventory.js              → lista completa, orden alfabético
 *   node tools/inventory.js | grep foo   → buscar función por nombre
 *   node tools/inventory.js --by-file    → agrupado por archivo
 *   node tools/inventory.js --duplicates → solo nombres que aparecen en >1 archivo
 */

const fs   = require('fs');
const path = require('path');

const ROOT  = path.resolve(__dirname, '..');
const ARGS  = process.argv.slice(2);
const BY_FILE    = ARGS.includes('--by-file');
const DUPES_ONLY = ARGS.includes('--duplicates');

// ── Patrones de extracción ──────────────────────────────────────────────────
const PATTERNS = [
    // export async function foo / export function foo
    { re: /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g,         tag: 'export fn' },
    // export const foo = (async) (function | arrow)
    { re: /export\s+const\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\()/g, tag: 'export const' },
    // globalThis.foo = (async) (function | arrow)
    { re: /globalThis\.(\w+)\s*=\s*(?:async\s+)?(?:function|\()/g, tag: 'globalThis' },
    // function foo(
    { re: /^[ \t]*(?:async\s+)?function\s+(\w+)\s*\(/gm,           tag: 'function' },
    // const/let/var foo = (async) (function | arrow)
    { re: /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\()/g, tag: 'const' },
];

// Nombres a ignorar: son genéricos o son palabras reservadas de los patrones
const IGNORE = new Set([
    'e', 'err', 'error', 'res', 'req', 'msg', 'cb', 'fn', 'handler',
    'resolve', 'reject', 'then', 'catch', 'next', 'event', 'ev',
    'ok', 'f', 'r', 'v', 'p', 'n', 'm', 'i', 'j', 'k',
    'module', 'exports',
]);

// ── Archivos a escanear ─────────────────────────────────────────────────────
function collectFiles() {
    const files = [];

    // js/*.js
    const jsDir = path.join(ROOT, 'js');
    if (fs.existsSync(jsDir)) {
        fs.readdirSync(jsDir)
            .filter(f => f.endsWith('.js'))
            .forEach(f => files.push(path.join(jsDir, f)));
    }

    // *.html en raíz
    fs.readdirSync(ROOT)
        .filter(f => f.endsWith('.html'))
        .forEach(f => files.push(path.join(ROOT, f)));

    return files;
}

// ── Extractor de línea ──────────────────────────────────────────────────────
function lineOf(src, index) {
    return src.slice(0, index).split('\n').length;
}

// ── Extraer funciones de un bloque de texto ─────────────────────────────────
function extractFromText(src, filePath) {
    const found = [];
    for (const { re, tag } of PATTERNS) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(src)) !== null) {
            const name = m[1];
            if (IGNORE.has(name)) continue;
            if (name.length < 3) continue;
            found.push({ name, file: filePath, line: lineOf(src, m.index), tag });
        }
    }
    return found;
}

// ── Para HTML: extraer solo contenido de <script> ──────────────────────────
function extractScriptBlocks(html) {
    const blocks = [];
    const scriptRe = /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi;
    let m;
    while ((m = scriptRe.exec(html)) !== null) {
        const startLine = html.slice(0, m.index).split('\n').length - 1;
        blocks.push({ src: m[1], startLine });
    }
    return blocks;
}

// ── Main ────────────────────────────────────────────────────────────────────
const entries = []; // { name, file, line, tag }

for (const filePath of collectFiles()) {
    const rel  = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const src  = fs.readFileSync(filePath, 'utf8');

    if (filePath.endsWith('.html')) {
        for (const { src: block, startLine } of extractScriptBlocks(src)) {
            const found = extractFromText(block, rel);
            for (const e of found) {
                entries.push({ ...e, line: e.line + startLine });
            }
        }
    } else {
        const found = extractFromText(src, rel);
        entries.push(...found);
    }
}

// Deduplicar por (name + file + line) — un mismo match puede activar varios patrones
const seen  = new Set();
const dedup = entries.filter(e => {
    const key = `${e.name}|${e.file}|${e.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});

// Ordenar alfabéticamente por nombre
dedup.sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file));

// ── Modo --duplicates ───────────────────────────────────────────────────────
if (DUPES_ONLY) {
    const byName = {};
    for (const e of dedup) {
        (byName[e.name] = byName[e.name] || []).push(e);
    }
    let found = false;
    for (const [name, entries] of Object.entries(byName)) {
        const files = [...new Set(entries.map(e => e.file))];
        if (files.length > 1) {
            found = true;
            console.log(`\n⚠  ${name}  (${files.length} archivos)`);
            for (const e of entries) {
                console.log(`   ${e.file}:${e.line}  [${e.tag}]`);
            }
        }
    }
    if (!found) console.log('✅ No se encontraron nombres duplicados entre archivos distintos.');
    process.exit(0);
}

// ── Modo --by-file ──────────────────────────────────────────────────────────
if (BY_FILE) {
    const byFile = {};
    for (const e of dedup) {
        (byFile[e.file] = byFile[e.file] || []).push(e);
    }
    for (const [file, entries] of Object.entries(byFile).sort()) {
        console.log(`\n── ${file} ──`);
        for (const e of entries) {
            console.log(`  ${String(e.line).padStart(5)}  ${e.name}`);
        }
    }
    process.exit(0);
}

// ── Modo por defecto: lista plana ordenada por nombre ───────────────────────
const COL = 42;
for (const e of dedup) {
    const loc = `${e.file}:${e.line}`;
    console.log(`${e.name.padEnd(COL)} ${loc}`);
}
