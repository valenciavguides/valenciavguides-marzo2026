#!/usr/bin/env node
/**
 * verificar-docs.js — Señala qué secciones de docs/GUIA-COMPLETA.md podrían
 * necesitar revisión tras los cambios de la sesión/rama actual, para no
 * depender de acordarse de mirar. No reescribe nada y no verifica que el
 * contenido sea correcto — eso requiere leer y entender el cambio, sigue
 * siendo tarea humana/de Claude. Solo evita el fallo de "nadie se paró a
 * mirar" (ver memoria feedback-pre-push-doc-checklist).
 *
 * Uso:
 *   node tools/verificar-docs.js              → ficheros cambiados sin
 *                                                empujar (working tree +
 *                                                commits por delante de
 *                                                la rama remota, si hay)
 *   node tools/verificar-docs.js --since=REF   → compara contra un ref
 *                                                concreto (rama/commit/tag)
 *   node tools/verificar-docs.js --quiet       → solo la lista, sin avisos
 *
 * Qué hace:
 *   1. Calcula qué ficheros HTML/JS/CSS cambiaron (working tree sin
 *      commitear + commits no empujados si hay upstream configurado, o el
 *      rango que indique --since).
 *   2. Para cada uno, busca su nombre de fichero (con y sin extensión, la
 *      segunda variante solo si es lo bastante distintiva) dentro de
 *      docs/GUIA-COMPLETA.md.
 *   3. Imprime, agrupado por fichero, la sección (encabezado ##/###/####
 *      más cercano hacia atrás) de cada aparición — un fichero borrado que
 *      sigue mencionado en la guía aparece igual, que es exactamente el
 *      caso real que motivó esta herramienta (js/vendor/leaflet.js).
 *
 * Limitación conocida: busca por nombre de fichero, no por función/mensaje
 * específico — un fichero grande con una sola mención lejana genera el
 * mismo aviso que uno con muchas menciones relevantes. Es un punto de
 * partida para revisar, no un veredicto.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GUIA_PATH = path.join(ROOT, 'docs', 'GUIA-COMPLETA.md');
const QUIET = process.argv.includes('--quiet');
const RELEVANT_EXT = ['.html', '.js', '.css'];
const EXCLUDE_SUBSTRINGS = ['node_modules/', 'tests/e2e/report/', 'tests/e2e/playwright-report.json', 'docs/GUIA-COMPLETA.md'];

function git(args) {
    try {
        return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
    } catch (_e) {
        return '';
    }
}

function obtenerFicherosCambiados() {
    const sinceArg = process.argv.find(a => a.startsWith('--since='));
    const set = new Set();

    if (sinceArg) {
        const ref = sinceArg.slice('--since='.length);
        git(['diff', '--name-only', ref]).split('\n').filter(Boolean).forEach(f => set.add(f));
        return [...set];
    }

    git(['diff', '--name-only', 'HEAD']).split('\n').filter(Boolean).forEach(f => set.add(f));

    const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
    if (upstream) {
        git(['diff', '--name-only', `${upstream}..HEAD`]).split('\n').filter(Boolean).forEach(f => set.add(f));
    }

    return [...set];
}

function esRelevante(ruta) {
    if (EXCLUDE_SUBSTRINGS.some(p => ruta.includes(p))) return false;
    return RELEVANT_EXT.includes(path.extname(ruta));
}

function encontrarSeccion(lineas, idx) {
    for (let i = idx; i >= 0; i--) {
        const m = lineas[i].match(/^(#{2,4})\s+(.+)/);
        if (m) return `${m[1]} ${m[2]}`;
    }
    return '(antes del primer encabezado)';
}

function patronesPara(fichero) {
    const base = path.basename(fichero);
    const sinExt = base.replace(/\.[^.]+$/, '');
    const patrones = [base];
    if (sinExt.length >= 6) patrones.push(sinExt);
    return patrones;
}

function main() {
    if (!fs.existsSync(GUIA_PATH)) {
        console.error('[verificar-docs] No se encontró docs/GUIA-COMPLETA.md');
        process.exitCode = 1;
        return;
    }

    const cambiados = obtenerFicherosCambiados().filter(esRelevante);
    if (!cambiados.length) {
        if (!QUIET) console.log('[verificar-docs] No hay ficheros HTML/JS/CSS cambiados en el rango detectado (usa --since=REF para comparar contra otro punto).');
        return;
    }

    const guiaLineas = fs.readFileSync(GUIA_PATH, 'utf8').split('\n');
    let totalConHallazgos = 0;

    for (const fichero of cambiados) {
        const patrones = patronesPara(fichero);
        const secciones = new Map();

        guiaLineas.forEach((linea, idx) => {
            if (patrones.some(p => linea.includes(p))) {
                const seccion = encontrarSeccion(guiaLineas, idx);
                if (!secciones.has(seccion)) secciones.set(seccion, idx + 1);
            }
        });

        if (secciones.size) {
            totalConHallazgos++;
            console.log(`\n📄 ${fichero}`);
            for (const [seccion, linea] of secciones) {
                console.log(`   L${linea}: ${seccion}`);
            }
        }
    }

    if (!totalConHallazgos) {
        if (!QUIET) console.log('[verificar-docs] Ninguno de los ficheros cambiados aparece mencionado en GUIA-COMPLETA.md.');
    } else if (!QUIET) {
        console.log(`\n[verificar-docs] ${totalConHallazgos} fichero(s) cambiado(s) con menciones en la guía — revisar que el texto siga siendo exacto.`);
        console.log('[verificar-docs] Esto solo señala dónde mirar, no verifica que el contenido sea correcto.');
    }
}

main();
