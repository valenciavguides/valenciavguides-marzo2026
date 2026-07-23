#!/usr/bin/env node
/**
 * build-sw.js — Calcula CACHE_VERSION a partir de un SHA-256 real del App
 * Shell, en vez de depender de que alguien recuerde actualizar el string a
 * mano en sw.js y en sus 4 referencias de docs/GUIA-COMPLETA.md.
 *
 * Uso:
 *   node tools/build-sw.js              → lee del working tree, aplica si cambió
 *   node tools/build-sw.js --staged     → lee del índice de git (contenido
 *                                          staged), pensado para el hook de
 *                                          pre-commit — vuelve a hacer `git add`
 *                                          de lo que reescribe
 *   node tools/build-sw.js --quiet      → sin salida por consola salvo errores
 *
 * Qué hace:
 *   1. Localiza el array APP_SHELL dentro de sw.js (regex sobre el propio
 *      fichero, no un JSON separado — APP_SHELL vive solo en sw.js).
 *   2. Calcula SHA-256 de: sw.js completo con la línea CACHE_VERSION
 *      sustituida por un placeholder fijo (para que el propio valor no se
 *      autorreferencie) + el contenido de cada fichero de APP_SHELL, en el
 *      orden en que aparecen en el array.
 *   3. El nuevo valor es 'v-' + los 12 primeros caracteres hex del hash.
 *   4. Si difiere del valor actual, reemplaza el string exacto (no regex por
 *      contexto — el mismo mecanismo simple de "sustituir el slug viejo por
 *      el nuevo en todo el documento" ya usado a mano toda la sesión) en
 *      sw.js y en todas las apariciones dentro de docs/GUIA-COMPLETA.md.
 *
 * Por qué --staged lee con `git show :ruta` y no con fs.readFileSync:
 *   este proyecto no tiene .gitattributes y core.autocrlf=true — el working
 *   tree en Windows tiene CRLF, pero el blob que git realmente guarda (y el
 *   working tree en Linux/Mac) tiene LF. Hashear bytes del disco daría un
 *   resultado distinto en cada sistema operativo. `git show :ruta` lee el
 *   contenido tal como lo ve git (normalizado), estable entre plataformas —
 *   es el modo correcto para el hook de pre-commit, que debe reflejar
 *   exactamente lo que se va a commitear, no el disco.
 *
 * Por qué se normaliza CRLF→LF antes de hashear en los DOS modos (no solo en
 * --staged): sin esto, el modo working tree (CRLF en Windows) y el modo
 * --staged (siempre LF) calculan hashes distintos para el mismo contenido
 * lógico — no por una condición de carrera puntual, sino siempre. Eso
 * provocaría que `npm run dev:watch` reescribiera CACHE_VERSION nada más
 * arrancar después de cualquier commit, sin que hubiera ningún cambio real,
 * y que el hook lo revirtiera en el siguiente commit — un vaivén perpetuo
 * entre dos valores "correctos" para el mismo contenido. Normalizando ambos
 * modos a LF antes de hashear, dan el mismo resultado siempre que el
 * contenido lógico no cambie, sin importar qué modo se ejecutó último.
 *
 * Si APP_SHELL referencia un fichero que no se puede leer (no existe, o
 * `git show` falla porque no está trackeado/staged), se avisa y se continúa
 * con el resto — no aborta con un stack trace críptico.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SW_PATH = path.join(ROOT, 'sw.js');
const GUIA_PATH = path.join(ROOT, 'docs', 'GUIA-COMPLETA.md');
const PLACEHOLDER = '__CACHE_VERSION_PLACEHOLDER__';

function parsearAppShell(swContent) {
    const m = swContent.match(/const APP_SHELL = \[([\s\S]*?)\];/);
    if (!m) throw new Error('No se pudo localizar el array APP_SHELL en sw.js');
    const rutas = [];
    const re = /'([^']+)'/g;
    let mm;
    while ((mm = re.exec(m[1]))) rutas.push(mm[1]);
    return rutas;
}

function normalizarSwParaHash(swContent) {
    return swContent.replace(/const CACHE_VERSION = '[^']*';/, `const CACHE_VERSION = '${PLACEHOLDER}';`);
}

function normalizarFinalesLinea(contenido) {
    return contenido.replace(/\r\n/g, '\n');
}

function leerWorkingTree(rutaRelativa) {
    const abs = path.join(ROOT, rutaRelativa.replace(/^\//, ''));
    if (!fs.existsSync(abs)) return null;
    return fs.readFileSync(abs, 'utf8');
}

// maxBuffer generoso: el límite por defecto de execFileSync (1MB) lo superan
// sin problema ficheros reales de APP_SHELL como audios-aventuras.js o
// aventuras-ID-padre.js (~1.8MB cada uno) — confirmado con ENOBUFS en pruebas.
const GIT_SHOW_MAX_BUFFER = 64 * 1024 * 1024; // 64MB

function leerStaged(rutaRelativa) {
    const rel = rutaRelativa.replace(/^\//, '');
    try {
        return execFileSync('git', ['show', `:${rel}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: GIT_SHOW_MAX_BUFFER });
    } catch (_e) {
        return null;
    }
}

function computeCacheVersion({ staged = false, quiet = false } = {}) {
    const leer = staged ? leerStaged : leerWorkingTree;
    const swRawSinNormalizar = leer('sw.js');
    if (swRawSinNormalizar == null) throw new Error('No se pudo leer sw.js para calcular el hash');
    const swRaw = normalizarFinalesLinea(swRawSinNormalizar);

    const appShell = parsearAppShell(swRaw);
    const hash = crypto.createHash('sha256');
    hash.update(normalizarSwParaHash(swRaw));

    const faltantes = [];
    for (const ruta of appShell) {
        const contenido = leer(ruta);
        if (contenido == null) { faltantes.push(ruta); continue; }
        hash.update(normalizarFinalesLinea(contenido));
    }

    if (faltantes.length && !quiet) {
        console.warn(`[build-sw] Aviso: ${faltantes.length} fichero(s) de APP_SHELL no se pudieron leer (${staged ? 'modo --staged' : 'working tree'}), se omiten del hash:`);
        faltantes.forEach(f => console.warn(`  - ${f}`));
    }

    return 'v-' + hash.digest('hex').slice(0, 12);
}

function valorActualCacheVersion(swContent) {
    const m = swContent.match(/const CACHE_VERSION = '([^']*)';/);
    return m ? m[1] : null;
}

function aplicarCacheVersion(nuevoValor, { quiet = false } = {}) {
    const swContent = fs.readFileSync(SW_PATH, 'utf8');
    const actual = valorActualCacheVersion(swContent);
    if (actual == null) throw new Error('No se pudo localizar la línea CACHE_VERSION en sw.js');

    if (actual === nuevoValor) {
        if (!quiet) console.log(`[build-sw] CACHE_VERSION ya está al día (${actual}) — nada que hacer.`);
        return [];
    }

    const modificados = [];

    fs.writeFileSync(SW_PATH, swContent.split(actual).join(nuevoValor), 'utf8');
    modificados.push('sw.js');

    if (fs.existsSync(GUIA_PATH)) {
        const guiaContent = fs.readFileSync(GUIA_PATH, 'utf8');
        if (guiaContent.includes(actual)) {
            fs.writeFileSync(GUIA_PATH, guiaContent.split(actual).join(nuevoValor), 'utf8');
            modificados.push(path.join('docs', 'GUIA-COMPLETA.md'));
        }
    }

    if (!quiet) {
        console.log(`[build-sw] CACHE_VERSION actualizado: ${actual} → ${nuevoValor}`);
        modificados.forEach(f => console.log(`  - ${f}`));
    }

    return modificados;
}

function main(opts = {}) {
    const staged = opts.staged ?? process.argv.includes('--staged');
    const quiet = opts.quiet ?? process.argv.includes('--quiet');
    try {
        const nuevoValor = computeCacheVersion({ staged, quiet });
        const modificados = aplicarCacheVersion(nuevoValor, { quiet });
        if (staged && modificados.length) {
            execFileSync('git', ['add', ...modificados], { cwd: ROOT });
        }
        return { version: nuevoValor, modificados };
    } catch (e) {
        console.error(`[build-sw] Error: ${e.message}`);
        if (!opts.hookMode) process.exitCode = 1;
        return { error: e.message };
    }
}

module.exports = { computeCacheVersion, aplicarCacheVersion, main, parsearAppShell };

if (require.main === module) {
    main();
}
