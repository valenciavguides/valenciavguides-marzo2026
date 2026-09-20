#!/usr/bin/env node
/**
 * Regenera el catalogo de `tests/master-test.html` leyendolo del disco.
 *
 * POR QUE EXISTE
 *
 * El catalogo era una lista escrita a mano dentro del HTML. Cada spec nuevo habia que
 * anadirlo ahi tambien, y nadie lo hacia: llego a listar 46 de 84 specs, con 38 invisibles
 * en el panel sin que nada avisara. Una lista a mano que describe un directorio siempre
 * acaba mintiendo; esta la escribe el directorio.
 *
 * QUE HACE
 *
 * Sustituye el contenido del array TESTS entre las dos marcas, conservando todo lo demas
 * del fichero. Cada entrada sale de:
 *
 *   tests/*.html        -> { type: 'browser' }     se ejecutan en un iframe oculto
 *   tests/e2e/*.spec.js -> { type: 'playwright' }  no se ejecutan aqui: se importan sus
 *                                                  resultados con "Load E2E Results"
 *
 * USO
 *
 *   npm run sync:master-test          comprueba y reescribe si hace falta
 *   npm run sync:master-test -- --check   solo comprueba; sale con codigo 1 si esta desfasado
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');
const MASTER = path.join(RAIZ, 'tests', 'master-test.html');
const INI = '// <<< CATALOGO GENERADO — no editar a mano; lo escribe tools/sync-master-test.js';
const FIN = '// >>> FIN DEL CATALOGO GENERADO';

/** Convierte '89-script2-listo-dice-la-verdad.spec.js' en 'Script2 listo dice la verdad'. */
function titulo(fichero) {
    return fichero
        .replace(/\.(html|spec\.js)$/, '')
        .replace(/^test[-_]/, '')
        .replace(/^\d+-/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, (c) => c.toUpperCase());
}

function construirCatalogo() {
    const paginas = fs.readdirSync(path.join(RAIZ, 'tests'))
        .filter((f) => f.endsWith('.html') && f !== 'master-test.html')
        .sort();
    const specs = fs.readdirSync(path.join(RAIZ, 'tests', 'e2e'))
        .filter((f) => f.endsWith('.spec.js'))
        .sort((a, b) => {
            const na = parseInt(a, 10); const nb = parseInt(b, 10);
            if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
            return na - nb;
        });

    const filas = [];
    for (const f of paginas) {
        filas.push(`            { name: ${JSON.stringify(titulo(f))}, file: ${JSON.stringify(f)}, type: 'browser', category: 'Pagina' },`);
    }
    for (const f of specs) {
        filas.push(`            { name: ${JSON.stringify('E2E: ' + titulo(f))}, file: ${JSON.stringify('e2e/' + f)}, type: 'playwright', category: 'E2E' },`);
    }
    return { texto: filas.join('\n'), paginas: paginas.length, specs: specs.length };
}

function main() {
    const soloComprobar = process.argv.includes('--check');
    const original = fs.readFileSync(MASTER, 'utf8');
    const nl = original.includes('\r\n') ? '\r\n' : '\n';

    const i = original.indexOf(INI);
    const j = original.indexOf(FIN);
    if (i === -1 || j === -1 || j <= i) {
        console.error(`[sync-master-test] No encuentro las marcas del catalogo en ${MASTER}.`);
        console.error(`  Tienen que estar, en este orden:\n    ${INI}\n    ${FIN}`);
        process.exit(1);
    }

    const { texto, paginas, specs } = construirCatalogo();
    const nuevo = original.slice(0, i + INI.length)
        + nl + texto.replace(/\n/g, nl) + nl + '            '
        + original.slice(j);

    if (nuevo === original) {
        console.log(`[sync-master-test] Al dia: ${paginas} paginas + ${specs} specs.`);
        return;
    }
    if (soloComprobar) {
        console.error(`[sync-master-test] DESFASADO. Ejecuta: npm run sync:master-test`);
        process.exit(1);
    }
    fs.writeFileSync(MASTER, nuevo, 'utf8');
    console.log(`[sync-master-test] Catalogo reescrito: ${paginas} paginas + ${specs} specs.`);
}

main();
