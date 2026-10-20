#!/usr/bin/env node
/**
 * build-demo.js — Genera js/demo-aventuras.js: lo que la demo gratis (de P2 a P11, antes del pago) usa de cada aventura,
 * y nada más. La demo lo lee de ese único fichero público y no carga los ficheros de datos de pago, que el servidor
 * protege (PROTECT_DATA, §22.4 de la guía).
 *
 * Uso:
 *   node tools/build-demo.js              → lee las fuentes del working tree y escribe el fichero si cambió
 *   node tools/build-demo.js --staged     → lee las fuentes del índice de git y hace `git add` del resultado
 *                                            (el hook de pre-commit: refleja lo que se va a commitear)
 *   node tools/build-demo.js --comprobar  → no escribe: sale con 1 si el fichero no está al día o falta una pieza
 *   node tools/build-demo.js --quiet      → sin salida por consola salvo errores
 *
 * Qué saca de cada fuente, por aventura e idioma (las aventuras y los idiomas, de js/indice-aventuras.js):
 *   - el puzzle de introducción, `PZ-intro` (js/puzzles-aventuras.js), igual para todas;
 *   - el reto R-1, el de `reto === 1` (js/retos-aventuras.js), con sus respuestas: la demo lo comprueba en el teléfono;
 *   - el audio de introducción, `audio-intro-<idioma>` (js/audios-aventuras.js), o null si no tiene fichero;
 *   - si la aventura tiene algún audio con fichero en ese idioma (el aviso «sin audio» de P9);
 *   - el texto de introducción, `txt-intro` (js/textos-aventuras.js y el JSON de párrafos del idioma), montado por
 *     ensamblarTexto() de js/data-loader.js, la misma función que usa la app. Cada texto distinto se guarda una sola vez
 *     por idioma (textosIntro), y cada aventura lo nombra por su posición: casi todas comparten el mismo.
 *
 * Si falta una pieza, no se inventa: se dice y el fichero no se da por bueno (--comprobar sale con 1; el hook lo avisa).
 * El fichero es parte del App Shell: el hook de pre-commit corre este generador ANTES que build-sw.js, para que
 * CACHE_VERSION cuente ya la demo regenerada.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { leerStaged, leerWorkingTree, normalizarFinalesLinea } = require('./build-sw.js');

const ROOT = path.resolve(__dirname, '..');
const SALIDA = 'js/demo-aventuras.js';
const FUENTES = {
    puzzles: 'js/puzzles-aventuras.js',
    retos: 'js/retos-aventuras.js',
    audios: 'js/audios-aventuras.js',
    textos: 'js/textos-aventuras.js',
    indice: 'js/indice-aventuras.js',
    cargador: 'js/data-loader.js',
};

const CABECERA = [
    '// js/demo-aventuras.js — GENERADO por tools/build-demo.js (npm run build:demo; el hook de pre-commit lo rehace). No se',
    '// edita a mano: se cambia el dato en su fichero de origen.',
    '//',
    '// Lo que la demo gratis (de P2 a P11, antes del pago) usa de cada aventura, y nada más: el puzzle de introducción, el reto',
    '// R-1, el audio y el texto de introducción, y si la aventura tiene audio en cada idioma. `textosIntro[idioma]` guarda cada',
    '// texto distinto una vez; `aventuras[aventura][idioma].textoIntro` es su posición en esa lista.',
    '',
].join('\n');

/** Un módulo ESM de datos a partir de su texto (sin BOM): así sirve igual el del índice de git que el del disco. */
function importarTexto(texto) {
    const limpio = texto.replace(/^﻿/, '');
    return import('data:text/javascript;base64,' + Buffer.from(limpio, 'utf8').toString('base64'));
}

/** Genera el texto del fichero. Devuelve { texto, faltas }: faltas, lo que no se encontró (no se inventa nada). */
async function generarDemo({ staged = false } = {}) {
    const leer = staged ? leerStaged : leerWorkingTree;
    const leerObligatorio = (rel) => {
        const t = leer(rel);
        if (t == null) throw new Error(`no se pudo leer ${rel} (${staged ? 'índice de git' : 'working tree'})`);
        return t;
    };
    const mod = (rel) => importarTexto(leerObligatorio(rel));

    const { PUZZLES_AVENTURAS } = await mod(FUENTES.puzzles);
    const { RETOS_AVENTURAS } = await mod(FUENTES.retos);
    const { AUDIOS_AVENTURAS } = await mod(FUENTES.audios);
    const { TEXTOS_AVENTURAS } = await mod(FUENTES.textos);
    const { INDICE_AVENTURAS, MAPEO_IDIOMAS } = await mod(FUENTES.indice);
    const { ensamblarTexto, LANG_ARCHIVO_PARRAFOS } = await mod(FUENTES.cargador);

    const faltas = [];
    const aventurasIds = Object.keys(INDICE_AVENTURAS || {});
    const idiomas = Object.keys(MAPEO_IDIOMAS || {});
    if (!aventurasIds.length) faltas.push('js/indice-aventuras.js no trae ninguna aventura');
    if (!idiomas.length) faltas.push('js/indice-aventuras.js no trae ningún idioma');

    const puzzleIntro = PUZZLES_AVENTURAS?.INTRO?.['puzzle.html']?.puzzle_id?.find((p) => p.id === 'PZ-intro') ?? null;
    if (!puzzleIntro) faltas.push('js/puzzles-aventuras.js no trae el puzzle PZ-intro');

    const textosIntro = {};
    const aventuras = {};
    for (const aventura of aventurasIds) aventuras[aventura] = {};
    for (const idioma of idiomas) {
        const archivo = LANG_ARCHIVO_PARRAFOS?.[idioma];
        let mapa = null;
        if (!archivo) faltas.push(`js/data-loader.js no sabe qué fichero de párrafos tiene el idioma ${idioma}`);
        else mapa = JSON.parse(leerObligatorio(`js/parrafos-textos/parrafos-texto-${archivo}.json`).replace(/^﻿/, ''));
        textosIntro[idioma] = [];
        const posicionPorTexto = new Map();
        for (const aventura of aventurasIds) {
            const audios = AUDIOS_AVENTURAS?.[aventura]?.[idioma] ?? [];
            const retoR1 = RETOS_AVENTURAS?.[aventura]?.[idioma]?.find((r) => r.reto === 1) ?? null;
            if (!retoR1) faltas.push(`${aventura}/${idioma}: sin reto R-1`);
            const intro = audios.find((a) => a.id === `audio-intro-${idioma}`);
            if (!intro) faltas.push(`${aventura}/${idioma}: sin entrada audio-intro-${idioma}`);
            const audioIntro = intro && typeof intro.file === 'string' && intro.file.trim() ? { id: intro.id, title: intro.title, file: intro.file } : null;
            const tieneAudio = audios.some((a) => typeof a.file === 'string' && a.file.trim() !== '');
            let textoIntro = null;
            const entrada = (TEXTOS_AVENTURAS?.[aventura] ?? []).find((e) => e.id === 'txt-intro');
            if (!entrada) faltas.push(`${aventura}: sin entrada txt-intro`);
            else if (mapa) {
                const texto = ensamblarTexto(entrada, idioma, new Map(audios.map((a) => [a.id, a])), mapa);
                if (!texto?.content) faltas.push(`${aventura}/${idioma}: el texto de introducción sale vacío`);
                else {
                    const huella = JSON.stringify(texto);
                    if (!posicionPorTexto.has(huella)) { posicionPorTexto.set(huella, textosIntro[idioma].length); textosIntro[idioma].push(texto); }
                    textoIntro = posicionPorTexto.get(huella);
                }
            }
            aventuras[aventura][idioma] = { retoR1, audioIntro, tieneAudio, textoIntro };
        }
    }
    const texto = CABECERA + 'export const DEMO_AVENTURAS = ' + JSON.stringify({ puzzleIntro, textosIntro, aventuras }, null, 2) + ';\n';
    return { texto, faltas };
}

async function main(opts = {}) {
    const staged = opts.staged ?? process.argv.includes('--staged');
    const comprobar = opts.comprobar ?? process.argv.includes('--comprobar');
    const quiet = opts.quiet ?? process.argv.includes('--quiet');
    try {
        const { texto, faltas } = await generarDemo({ staged });
        if (faltas.length) {
            console.error(`[build-demo] Faltan ${faltas.length} pieza(s) de la demo; no se inventan:`);
            faltas.forEach((f) => console.error(`  - ${f}`));
        }
        const actual = (staged ? leerStaged : leerWorkingTree)(SALIDA);
        const alDia = actual != null && normalizarFinalesLinea(actual) === texto;
        if (comprobar) {
            if (!alDia) console.error(`[build-demo] ${SALIDA} no está al día con sus fuentes: npm run build:demo`);
            else if (!quiet) console.log(`[build-demo] ${SALIDA} está al día.`);
            if (!alDia || faltas.length) process.exitCode = 1;
            return { alDia, faltas };
        }
        if (alDia) {
            if (!quiet) console.log(`[build-demo] ${SALIDA} ya está al día — nada que hacer.`);
            return { escrito: false, faltas };
        }
        fs.writeFileSync(path.join(ROOT, SALIDA), texto, 'utf8');
        if (staged) execFileSync('git', ['add', SALIDA], { cwd: ROOT });
        if (!quiet) console.log(`[build-demo] ${SALIDA} regenerado (${Math.round(Buffer.byteLength(texto) / 1024)} KB).`);
        if (faltas.length && !opts.hookMode) process.exitCode = 1;
        return { escrito: true, faltas };
    } catch (e) {
        console.error(`[build-demo] Error: ${e.message}`);
        if (!opts.hookMode) process.exitCode = 1;
        return { error: e.message };
    }
}

module.exports = { generarDemo, main };

if (require.main === module) {
    main();
}
