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
 *   1. Descubre automáticamente los ficheros del shell (ficherosDelShell):
 *      todo lo que el navegador carga como código — HTML, JS, CSS y JSON de
 *      configuración — descubierto con `git ls-files`, no con una lista escrita
 *      a mano. Un fichero nuevo entra solo; olvidarse de añadirlo es imposible.
 *      Quedan fuera los datos que se piden en runtime (js/parrafos-textos/, cuyo
 *      destino es la API autenticada), la media, y lo que nunca llega al
 *      navegador (docs/, tests/, tools/, config de dev, js/server.js).
 *      La lista es de EXCLUSIÓN a propósito: olvidarse de excluir un fichero de
 *      herramientas solo provoca un aviso de versión de más (inofensivo),
 *      mientras que olvidarse de incluir uno de app dejaría una actualización
 *      sin llegar nunca al cliente.
 *   2. Calcula SHA-256 de: sw.js completo con la línea CACHE_VERSION
 *      sustituida por un placeholder fijo (para que el propio valor no se
 *      autorreferencie) + el contenido de cada fichero del shell, en orden
 *      alfabético estable.
 *   3. El nuevo valor es 'v-' + los 12 primeros caracteres hex del hash.
 *   4. Si difiere del valor actual, reemplaza el string exacto (no regex por
 *      contexto — el mismo mecanismo simple de "sustituir el slug viejo por
 *      el nuevo en todo el documento" ya usado a mano toda la sesión) en
 *      sw.js y en todas las apariciones dentro de docs/GUIA-COMPLETA.md.
 *   5. Escribe/corrige version.json en la raíz con { "version": nuevoValor },
 *      siempre — no solo cuando CACHE_VERSION cambia — para que exista desde
 *      el primer build:sw tras añadirse este mecanismo y se autocorrija si
 *      alguien lo edita a mano por error. codigo-padre.html lo consulta con
 *      cache-busting propio para saber la versión real del servidor incluso
 *      cuando el CDN por delante del hosting sigue sirviendo un sw.js viejo.
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
const VERSION_JSON_PATH = path.join(ROOT, 'version.json');
const PLACEHOLDER = '__CACHE_VERSION_PLACEHOLDER__';

// ─── Qué cuenta como "shell" (código que el navegador ejecuta o pinta) ───────
// Regla: si el navegador lo carga como código (<script>, import, <link rel=stylesheet>)
// es shell y cuenta para la versión. Si lo pide como datos (fetch/API) no cuenta —
// esos ya llegan frescos por Network First y su destino es el backend autenticado.
const EXT_SHELL = /\.(html|js|css|json)$/i;
const DIRS_FUERA = [
    'docs/', 'tests/', 'tools/', 'node_modules/',
    'imagenes/', 'audios-aventuras/', 'videos-aventuras/',
    'js/parrafos-textos/', // datos: fetch en runtime, su sitio futuro es la API
];
const FICHEROS_FUERA = [
    'sw.js',            // se hashea aparte, con CACHE_VERSION normalizada
    'version.json',     // lo escribe este script: incluirlo haría el hash dependiente
                        // de su propia salida y nunca convergería (reescritura infinita)
    'js/server.js',     // servidor, nunca llega al navegador
    'package.json', 'package-lock.json', 'playwright.config.js', 'eslint.config.js',
    'verify-all.js', '_inventario_timers.js',
];

function esDelShell(rel) {
    const p = rel.replace(/\\/g, '/');
    if (!EXT_SHELL.test(p)) return false;
    if (FICHEROS_FUERA.includes(p)) return false;
    // Nada que empiece por punto en ningún tramo: .github/, .claude/,
    // .markdownlint.json… son configuración del repositorio, no código servido.
    if (p.split('/').some(seg => seg.startsWith('.'))) return false;
    return !DIRS_FUERA.some(d => p.startsWith(d));
}

function listarTrackeados() {
    return execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8', maxBuffer: GIT_SHOW_MAX_BUFFER })
        .split('\n').map(s => s.trim()).filter(Boolean);
}

function recorrerDirectorio(dirRel, acc) {
    for (const entrada of fs.readdirSync(path.join(ROOT, dirRel || '.'), { withFileTypes: true })) {
        if (entrada.name.startsWith('.')) continue;
        const rel = dirRel ? `${dirRel}/${entrada.name}` : entrada.name;
        if (entrada.isDirectory()) {
            if (DIRS_FUERA.some(d => `${rel}/`.startsWith(d))) continue;
            recorrerDirectorio(rel, acc);
        } else if (esDelShell(rel)) {
            acc.push(rel);
        }
    }
    return acc;
}

/**
 * Ficheros que componen el shell, en orden alfabético estable.
 * Fuente única — la usan tanto computeCacheVersion como tools/watch-sw.js, para
 * que lo que se vigila en desarrollo y lo que entra en el hash no puedan divergir.
 * Sin git (copia del proyecto sin repositorio) recorre el disco con los mismos filtros.
 */
function ficherosDelShell() {
    let candidatos;
    try {
        candidatos = listarTrackeados().filter(esDelShell);
    } catch (_e) {
        candidatos = recorrerDirectorio('', []);
    }
    return candidatos.sort();
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

    const shell = ficherosDelShell();
    const hash = crypto.createHash('sha256');
    hash.update(normalizarSwParaHash(swRaw));

    const faltantes = [];
    for (const ruta of shell) {
        const contenido = leer(ruta);
        if (contenido == null) { faltantes.push(ruta); continue; }
        hash.update(normalizarFinalesLinea(contenido));
    }

    if (faltantes.length && !quiet) {
        console.warn(`[build-sw] Aviso: ${faltantes.length} fichero(s) del shell no se pudieron leer (${staged ? 'modo --staged' : 'working tree'}), se omiten del hash:`);
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

    const modificados = [];
    const cambioReal = actual !== nuevoValor;

    if (cambioReal) {
        fs.writeFileSync(SW_PATH, swContent.split(actual).join(nuevoValor), 'utf8');
        modificados.push('sw.js');
    }

    // La guía se comprueba SIEMPRE, no solo cuando CACHE_VERSION cambia: si sus
    // referencias quedan desfasadas por otra vía (un `git checkout` del fichero, un
    // merge, una edición a mano), comparar solo contra el valor anterior de sw.js no
    // las volvería a tocar nunca y el desfase se quedaría fijo. Se sustituye cualquier
    // slug con el formato del valor generado, que solo aparece en este documento como
    // referencia a CACHE_VERSION.
    if (fs.existsSync(GUIA_PATH)) {
        const guiaContent = fs.readFileSync(GUIA_PATH, 'utf8');
        const guiaNueva = guiaContent.replace(/v-[0-9a-f]{12}/g, nuevoValor);
        if (guiaNueva !== guiaContent) {
            fs.writeFileSync(GUIA_PATH, guiaNueva, 'utf8');
            modificados.push(path.join('docs', 'GUIA-COMPLETA.md'));
        }
    }

    // version.json se comprueba siempre, no solo cuando CACHE_VERSION cambia de
    // verdad — así el primer build:sw tras añadir este fichero lo crea, y una
    // edición manual accidental (o su ausencia) se corrige sola en el siguiente
    // commit o `npm run dev:watch`.
    const versionJsonNuevo = JSON.stringify({ version: nuevoValor }, null, 2) + '\n';
    const versionJsonActual = fs.existsSync(VERSION_JSON_PATH) ? fs.readFileSync(VERSION_JSON_PATH, 'utf8') : null;
    if (versionJsonActual !== versionJsonNuevo) {
        fs.writeFileSync(VERSION_JSON_PATH, versionJsonNuevo, 'utf8');
        modificados.push('version.json');
    }

    if (!modificados.length) {
        if (!quiet) console.log(`[build-sw] CACHE_VERSION ya está al día (${actual}) — nada que hacer.`);
        return [];
    }

    if (!quiet) {
        if (cambioReal) console.log(`[build-sw] CACHE_VERSION actualizado: ${actual} → ${nuevoValor}`);
        else console.log(`[build-sw] CACHE_VERSION sin cambios (${actual}) — sincronizando referencias`);
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

module.exports = { computeCacheVersion, aplicarCacheVersion, main, ficherosDelShell };

if (require.main === module) {
    main();
}
