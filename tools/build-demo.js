#!/usr/bin/env node
/**
 * build-demo.js — Hace la carpeta pública `publico/`: copias de lo que enseña la demo gratis (la selección hasta el código,
 * el vídeo de introducción y el puzzle de P6), y nada más. Los originales siguen completos en sus carpetas —son los que irán
 * al backend—; la demo pide solo a `publico/`, y el resto de la app, solo a los originales (guía, §22.0 n.º 26 y n.º 29).
 *
 * Uso:
 *   node tools/build-demo.js              → lee los originales del working tree y escribe en publico/ lo que haya cambiado
 *   node tools/build-demo.js --staged     → lee los originales del índice de git y hace `git add` de lo que escribe
 *                                            (el hook de pre-commit: refleja lo que se va a commitear)
 *   node tools/build-demo.js --comprobar  → no escribe: sale con 1 si una copia no está al día o falta, si sobra un fichero
 *                                            en publico/ o si falta una pieza en los originales
 *   node tools/build-demo.js --quiet      → sin salida por consola salvo errores
 *
 * Qué copia. Las aventuras y los idiomas salen de js/indice-aventuras.js; la carpeta de cada idioma es la de su fichero de
 * párrafos (LANG_ARCHIVO_PARRAFOS de js/data-loader.js: espanol, ingles…).
 *   publico/textos/intro.json                    la entrada `txt-intro` de cada aventura (js/textos-aventuras.js)
 *   publico/textos/<idioma>/parrafos.json         solo los párrafos que nombran esas entradas, en el orden del original
 *   publico/textos/<idioma>/terminos.json         { html }: los términos (P10)            ← js/terminos-aventuras.js
 *   publico/textos/<idioma>/normativa.json        { html }: la normativa (P15)            ← js/normativa-cumplimiento.js
 *   publico/textos/<idioma>/agradecimientos.json  { html }: los agradecimientos (P18)     ← js/agradecimientos-aventuras.js
 *   publico/textos/<idioma>/jaime.json            { escenas }: los textos de video-intro.html ← JAIME_SCENES de js/traducciones-ui.js
 *   publico/retos/<idioma>/retos.json             { aventura: { r1, r2 } }: solo los retos 1 (P8) y 2 (P16) ← js/retos-aventuras.js
 *   publico/puzzles/puzzles.json                  solo el puzzle de introducción, PZ-intro (P6) ← js/puzzles-aventuras.js
 *   publico/audios/<idioma>/audios.json           { aventura: { intro, tieneAudio } } (P9 y P11) ← js/audios-aventuras.js
 *   publico/audios/<idioma>/<mp3>                 la copia del audio de introducción, si tiene fichero
 *   publico/imagenes/mapas-vintage/<jpg>          la copia de cada mapa de js/mapa-vintage-aventuras.js (P7 y video-intro.html)
 *   publico/imagenes/<foto> y publico/videos/<mp4> la copia de cada fichero de MEDIA_DEMO, con su mismo nombre
 *
 * Una pieza que falta en los originales no se inventa: se nombra, y la carpeta no se da por buena (--comprobar sale con 1;
 * el hook lo avisa). Un fichero de publico/ que no sale de aquí se nombra como «sobra» y no se borra. Los .json cuentan
 * para CACHE_VERSION: el hook de pre-commit corre este generador ANTES que build-sw.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { leerStaged, leerWorkingTree, normalizarFinalesLinea } = require('./build-sw.js');

const ROOT = path.resolve(__dirname, '..');
const CARPETA = 'publico';
const FUENTES = {
    puzzles: 'js/puzzles-aventuras.js',
    retos: 'js/retos-aventuras.js',
    audios: 'js/audios-aventuras.js',
    textos: 'js/textos-aventuras.js',
    indice: 'js/indice-aventuras.js',
    cargador: 'js/data-loader.js',
    terminos: 'js/terminos-aventuras.js',
    normativa: 'js/normativa-cumplimiento.js',
    agradecimientos: 'js/agradecimientos-aventuras.js',
    ui: 'js/traducciones-ui.js',
    mapas: 'js/mapa-vintage-aventuras.js',
};

// La foto de cada tarjeta de aventura (P7, P9 y P13: IMAGENES_AVENTURAS de En-busca-del-tesoro.html nombra estas
// copias), la de las Torres de Serranos de video-intro.html y su clip. Lo demás que copia la demo sale de los datos: los
// mapas, de su tabla; el audio, de sus entradas.
const MEDIA_DEMO = [
    'imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg',
    'imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg',
    'imagenes/imagenes-aventuras/pano_cac.jpg',
    'imagenes/imagenes-aventuras/parque_de_cabecera_lake_side.jpg',
    'imagenes/imagenes-aventuras/antiguo_orfanato.jpg',
    'imagenes/imagenes-aventuras/fallas_castillo.jpg',
    'imagenes/imagenes-aventuras/aventura_34km.jpg',
    'imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg',
    'videos-aventuras/video_intro_ejemplo.mp4',
];
const copiaDeMedia = (original) => `${CARPETA}/${/\.(mp4|webm|mov)$/i.test(original) ? 'videos' : 'imagenes'}/${path.posix.basename(original)}`;

/** Un módulo ESM de datos a partir de su texto (sin BOM): así sirve igual el del índice de git que el del disco. */
function importarTexto(texto) {
    const limpio = texto.replace(/^﻿/, '');
    return import('data:text/javascript;base64,' + Buffer.from(limpio, 'utf8').toString('base64'));
}

/** Un fichero binario del índice de git (--staged) o del disco; null si no está. */
function leerBinario(rel, staged) {
    if (staged) {
        try {
            return execFileSync('git', ['show', `:${rel}`], { cwd: ROOT, maxBuffer: 512 * 1024 * 1024 });
        } catch (_e) {
            return null;
        }
    }
    const abs = path.join(ROOT, rel);
    return fs.existsSync(abs) ? fs.readFileSync(abs) : null;
}

/** Las claves de un JSON plano en el orden en que están escritas (JSON.parse pone primero las numéricas). */
function clavesEnOrden(textoJson) {
    const claves = [];
    const re = /^\s*"([^"]+)"\s*:/gm;
    let m;
    while ((m = re.exec(textoJson)) !== null) claves.push(m[1]);
    return claves;
}

const json = (valor) => JSON.stringify(valor, null, 2) + '\n';

/** La copia pública de los párrafos de un idioma: solo los usados, con el orden y el formato del original. */
function jsonParrafos(textoOriginal, mapa, usados) {
    const lineas = clavesEnOrden(textoOriginal)
        .filter((k) => usados.has(k))
        .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(mapa[k])}`);
    return '{\n' + lineas.join(',\n') + '\n}\n';
}

/**
 * Lo que tiene que haber en publico/. Devuelve { textos, copias, faltas }: textos, ruta → contenido; copias, ruta de la
 * copia → ruta del original; faltas, lo que no está en los originales (no se inventa nada).
 */
async function generarPublico({ staged = false } = {}) {
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
    const { LANG_ARCHIVO_PARRAFOS } = await mod(FUENTES.cargador);
    const { TERMINOS_AVENTURAS } = await mod(FUENTES.terminos);
    const { NORMATIVA_CUMPLIMIENTO } = await mod(FUENTES.normativa);
    const { AGRADECIMIENTOS_AVENTURAS } = await mod(FUENTES.agradecimientos);
    const { JAIME_SCENES } = await mod(FUENTES.ui);
    const { MAPAS_VINTAGE } = await mod(FUENTES.mapas);

    const textos = new Map();
    const copias = new Map();
    const faltas = [];
    const aventuras = Object.keys(INDICE_AVENTURAS || {});
    const idiomas = Object.keys(MAPEO_IDIOMAS || {});
    if (!aventuras.length) faltas.push('js/indice-aventuras.js no trae ninguna aventura');
    if (!idiomas.length) faltas.push('js/indice-aventuras.js no trae ningún idioma');

    const puzzle = PUZZLES_AVENTURAS?.INTRO?.['puzzle.html']?.puzzle_id?.find((p) => p.id === 'PZ-intro') ?? null;
    if (!puzzle) faltas.push('js/puzzles-aventuras.js no trae el puzzle PZ-intro');
    else textos.set(`${CARPETA}/puzzles/puzzles.json`, json({ 'PZ-intro': puzzle }));

    const intro = {};
    for (const aventura of aventuras) {
        const entrada = (TEXTOS_AVENTURAS?.[aventura] ?? []).find((e) => e.id === 'txt-intro');
        if (!entrada) faltas.push(`${aventura}: sin entrada txt-intro`);
        else intro[aventura] = entrada;
    }
    textos.set(`${CARPETA}/textos/intro.json`, json(intro));
    const usados = new Set(Object.values(intro).flatMap((e) => (Array.isArray(e.parrafos) ? e.parrafos : []).map(String)));

    for (const idioma of idiomas) {
        const carpeta = LANG_ARCHIVO_PARRAFOS?.[idioma];
        if (!carpeta) {
            faltas.push(`js/data-loader.js no sabe qué carpeta tiene el idioma ${idioma}`);
            continue;
        }

        const textoParrafos = leerObligatorio(`js/parrafos-textos/parrafos-texto-${carpeta}.json`).replace(/^﻿/, '');
        const mapa = JSON.parse(textoParrafos);
        for (const n of usados) if (!(n in mapa)) faltas.push(`${idioma}: falta el párrafo ${n}`);
        textos.set(`${CARPETA}/textos/${carpeta}/parrafos.json`, jsonParrafos(textoParrafos, mapa, usados));

        for (const [nombre, fuente, campo] of [
            ['terminos', TERMINOS_AVENTURAS, 'terminos_idiomas'],
            ['normativa', NORMATIVA_CUMPLIMIENTO, 'normativa_idiomas'],
            ['agradecimientos', AGRADECIMIENTOS_AVENTURAS, 'agradecimientos_idiomas'],
        ]) {
            const html = fuente?.[campo]?.[idioma];
            if (typeof html !== 'string' || !html.trim()) faltas.push(`${idioma}: sin ${nombre}`);
            else textos.set(`${CARPETA}/textos/${carpeta}/${nombre}.json`, json({ html }));
        }

        if (!Array.isArray(JAIME_SCENES)) {
            faltas.push('js/traducciones-ui.js no trae JAIME_SCENES');
        } else {
            JAIME_SCENES.forEach((escena, n) => {
                if (escena !== null && typeof escena?.[idioma] !== 'string') faltas.push(`${idioma}: sin el texto de Jaime de la escena ${n}`);
            });
            textos.set(`${CARPETA}/textos/${carpeta}/jaime.json`, json({ escenas: JAIME_SCENES.map((e) => (e === null ? null : e?.[idioma] ?? null)) }));
        }

        const retos = {};
        const audios = {};
        for (const aventura of aventuras) {
            const listaRetos = RETOS_AVENTURAS?.[aventura]?.[idioma] ?? [];
            const r1 = listaRetos.find((r) => r.reto === 1) ?? null;
            const r2 = listaRetos.find((r) => r.reto === 2) ?? null;
            if (!r1) faltas.push(`${aventura}/${idioma}: sin reto R-1`);
            if (!r2) faltas.push(`${aventura}/${idioma}: sin reto R-2`);
            retos[aventura] = { r1, r2 };

            const listaAudios = AUDIOS_AVENTURAS?.[aventura]?.[idioma] ?? [];
            const entrada = listaAudios.find((a) => a.id === `audio-intro-${idioma}`);
            if (!entrada) faltas.push(`${aventura}/${idioma}: sin entrada audio-intro-${idioma}`);
            let introAudio = null;
            if (entrada) {
                const original = typeof entrada.file === 'string' ? entrada.file.trim() : '';
                const copia = original ? `${CARPETA}/audios/${carpeta}/${path.posix.basename(original)}` : '';
                if (original) copias.set(copia, original);
                introAudio = { id: entrada.id, title: entrada.title, file: copia };
            }
            audios[aventura] = { intro: introAudio, tieneAudio: listaAudios.some((a) => typeof a.file === 'string' && a.file.trim() !== '') };
        }
        textos.set(`${CARPETA}/retos/${carpeta}/retos.json`, json(retos));
        textos.set(`${CARPETA}/audios/${carpeta}/audios.json`, json(audios));
    }

    for (const ruta of Object.values(MAPAS_VINTAGE ?? {})) copias.set(`${CARPETA}/imagenes/mapas-vintage/${path.posix.basename(ruta)}`, ruta);
    for (const original of MEDIA_DEMO) copias.set(copiaDeMedia(original), original);

    return { textos, copias, faltas };
}

/** Los ficheros que hay hoy en publico/, del índice de git (--staged) o del disco. */
function listarPublico(staged) {
    if (staged) {
        return execFileSync('git', ['ls-files', '-z', '--', CARPETA], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
            .split('\0').filter(Boolean);
    }
    const encontrados = [];
    (function recorrer(rel) {
        const abs = path.join(ROOT, rel);
        if (!fs.existsSync(abs)) return;
        for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
            const r = `${rel}/${e.name}`;
            if (e.isDirectory()) recorrer(r);
            else encontrados.push(r);
        }
    })(CARPETA);
    return encontrados;
}

/**
 * Compara publico/ con lo que tiene que haber. Devuelve lo de generarPublico() más: desfasados (textos que faltan o no
 * coinciden), copiasMal (copias que faltan o no son idénticas a su original) y sobran (ficheros que no salen de aquí).
 */
async function revisarPublico({ staged = false } = {}) {
    const { textos, copias, faltas } = await generarPublico({ staged });
    const leer = staged ? leerStaged : leerWorkingTree;
    const desfasados = [...textos].filter(([ruta, contenido]) => {
        const actual = leer(ruta);
        return actual == null || normalizarFinalesLinea(actual) !== contenido;
    }).map(([ruta]) => ruta);
    const copiasMal = [];
    for (const [copia, original] of copias) {
        const datos = leerBinario(original, staged);
        if (!datos) { faltas.push(`no existe el original ${original}`); continue; }
        const actual = leerBinario(copia, staged);
        if (!actual || !datos.equals(actual)) copiasMal.push(copia);
    }
    const esperados = new Set([...textos.keys(), ...copias.keys()]);
    const sobran = listarPublico(staged).filter((r) => !esperados.has(r));
    return { textos, copias, faltas, desfasados, copiasMal, sobran };
}

async function main(opts = {}) {
    const staged = opts.staged ?? process.argv.includes('--staged');
    const comprobar = opts.comprobar ?? process.argv.includes('--comprobar');
    const quiet = opts.quiet ?? process.argv.includes('--quiet');
    try {
        const r = await revisarPublico({ staged });
        if (r.faltas.length) {
            console.error(`[build-demo] Faltan ${r.faltas.length} pieza(s) de la demo en los originales; no se inventan:`);
            r.faltas.forEach((f) => console.error(`  - ${f}`));
        }
        if (r.sobran.length) {
            console.error(`[build-demo] Sobran ${r.sobran.length} fichero(s) en ${CARPETA}/ (no salen de los originales; no se borran):`);
            r.sobran.forEach((f) => console.error(`  - ${f}`));
        }
        const pendientes = [...r.desfasados, ...r.copiasMal];
        if (comprobar) {
            if (pendientes.length) {
                console.error(`[build-demo] ${pendientes.length} copia(s) de ${CARPETA}/ no están al día con sus originales: npm run build:demo`);
                pendientes.forEach((f) => console.error(`  - ${f}`));
            } else if (!quiet) {
                console.log(`[build-demo] ${CARPETA}/ está al día (${r.textos.size} textos, ${r.copias.size} copias).`);
            }
            if (pendientes.length || r.faltas.length || r.sobran.length) process.exitCode = 1;
            return r;
        }
        for (const ruta of r.desfasados) {
            fs.mkdirSync(path.dirname(path.join(ROOT, ruta)), { recursive: true });
            fs.writeFileSync(path.join(ROOT, ruta), r.textos.get(ruta), 'utf8');
        }
        for (const copia of r.copiasMal) {
            const datos = leerBinario(r.copias.get(copia), staged);
            if (!datos) continue;
            fs.mkdirSync(path.dirname(path.join(ROOT, copia)), { recursive: true });
            fs.writeFileSync(path.join(ROOT, copia), datos);
        }
        const escritos = pendientes.filter((f) => r.textos.has(f) || leerBinario(r.copias.get(f), staged));
        if (staged && escritos.length) execFileSync('git', ['add', '--', ...escritos], { cwd: ROOT });
        if (!quiet) {
            console.log(escritos.length
                ? `[build-demo] ${CARPETA}/: ${escritos.length} fichero(s) al día de nuevo.`
                : `[build-demo] ${CARPETA}/ ya está al día — nada que hacer.`);
        }
        if ((r.faltas.length || r.sobran.length) && !opts.hookMode) process.exitCode = 1;
        return r;
    } catch (e) {
        console.error(`[build-demo] Error: ${e.message}`);
        if (!opts.hookMode) process.exitCode = 1;
        return { error: e.message };
    }
}

module.exports = { generarPublico, revisarPublico, main };

if (require.main === module) {
    main();
}
