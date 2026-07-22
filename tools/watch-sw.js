#!/usr/bin/env node
/**
 * watch-sw.js — Vigila sw.js y todos los ficheros de APP_SHELL durante
 * desarrollo local (`npm run dev:watch`) y recalcula CACHE_VERSION en cuanto
 * algo cambia, sin esperar a un commit. Reusa el mismo núcleo que el hook de
 * pre-commit y la invocación manual (`npm run build:sw`) — ver tools/build-sw.js,
 * ninguna lógica de hash duplicada aquí.
 *
 * A diferencia del hook de pre-commit, lee siempre del working tree (modo
 * dev, sin commit en curso — no tiene sentido leer del índice de git aquí) y
 * no hace `git add` — el usuario decide cuándo commitear.
 *
 * Uso:
 *   npm run dev:watch
 *   Ctrl+C para salir.
 */

const fs = require('fs');
const path = require('path');
const { computeCacheVersion, aplicarCacheVersion, parsearAppShell } = require('./build-sw.js');

const ROOT = path.resolve(__dirname, '..');
const SW_PATH = path.join(ROOT, 'sw.js');
const DEBOUNCE_MS = 300;

let timer = null;

function recalcular() {
    try {
        const nuevoValor = computeCacheVersion({ staged: false, quiet: true });
        const modificados = aplicarCacheVersion(nuevoValor, { quiet: true });
        if (modificados.length) {
            console.log(`[watch-sw] ${new Date().toLocaleTimeString()} — CACHE_VERSION → ${nuevoValor} (${modificados.join(', ')})`);
        }
    } catch (e) {
        console.error(`[watch-sw] Error recalculando: ${e.message}`);
    }
}

function programarRecalculo() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(recalcular, DEBOUNCE_MS);
}

function main() {
    const swContent = fs.readFileSync(SW_PATH, 'utf8');
    const appShell = parsearAppShell(swContent);
    const rutasAVigilar = ['sw.js', ...appShell.map(r => r.replace(/^\//, ''))];

    const watchers = [];
    for (const rel of rutasAVigilar) {
        const abs = path.join(ROOT, rel);
        if (!fs.existsSync(abs)) {
            console.warn(`[watch-sw] Aviso: ${rel} no existe, no se vigila.`);
            continue;
        }
        try {
            watchers.push(fs.watch(abs, () => programarRecalculo()));
        } catch (e) {
            console.warn(`[watch-sw] No se pudo vigilar ${rel}: ${e.message}`);
        }
    }

    console.log(`[watch-sw] Vigilando ${watchers.length} ficheros del App Shell. Ctrl+C para salir.`);
    recalcular();

    process.on('SIGINT', () => {
        console.log('\n[watch-sw] Cerrando...');
        watchers.forEach(w => w.close());
        process.exit(0);
    });
}

if (require.main === module) {
    main();
}
