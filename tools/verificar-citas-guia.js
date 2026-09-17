#!/usr/bin/env node
/**
 * verificar-citas-guia.js — Comprueba las citas por número de línea de docs/GUIA-COMPLETA.md
 * contra el código real.
 *
 * POR QUÉ EXISTE
 *
 * La guía cita cientos de posiciones con la forma `L1234`. Un número de línea caduca con
 * cada edición del fichero citado, y nada avisa: se comprobaron seis al azar y las seis
 * estaban mal, algunas con 3.000 líneas de desfase. Una cita que apunta a otro sitio es
 * peor que no tener cita, porque el que la sigue cree que ha mirado.
 *
 * QUÉ HACE
 *
 * Por cada cita intenta resolver a qué fichero se refiere (nombre explícito en la misma
 * línea, o `hijoN` / `padre` / `selección`) y qué identificador la acompaña (lo que va
 * entre backticks). Con las dos cosas puede comprobarla:
 *
 *   OK          el identificador está en esa línea o muy cerca (±MARGEN)
 *   MAL         el identificador está en el fichero, pero en otra parte
 *   FUERA        la línea citada no existe: el fichero es más corto
 *   NO EXISTE   el identificador no aparece en el fichero
 *   SIN RESOLVER no se puede saber a qué fichero o a qué identificador se refiere
 *
 * Lo que NO hace: adivinar. Una cita sin identificador al lado no se puede verificar por
 * medios mecánicos, y aquí se cuenta aparte en vez de darla por buena.
 *
 * Uso:
 *   node tools/verificar-citas-guia.js            informe completo
 *   node tools/verificar-citas-guia.js --check    sale con código 1 si hay alguna MAL o FUERA
 *   node tools/verificar-citas-guia.js --lista    solo las que fallan, una por línea
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');
const GUIA = path.join(RAIZ, 'docs', 'GUIA-COMPLETA.md');
const MARGEN = 12; // una cita sigue siendo util si apunta al vecindario

const ALIAS = {
    padre: 'codigo-padre.html',
    hijo1: 'extrainfo-hijo1.html',
    hijo2: 'coordenadas-hijo2.html',
    hijo3: 'audio-hijo3.html',
    hijo4: 'retos-hijo4.html',
    hijo5: 'boton-casa-hijo5.html',
    hijo6: 'chat-hijo6.html',
    seleccion: 'En-busca-del-tesoro.html',
};

const cacheFichero = new Map();
function lineasDe(rel) {
    if (!cacheFichero.has(rel)) {
        const abs = path.join(RAIZ, rel);
        cacheFichero.set(rel, fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').split(/\r?\n/) : null);
    }
    return cacheFichero.get(rel);
}

/** Todos los ficheros de código del proyecto, para buscar un identificador sin pista. */
let _codigo = null;
function ficherosDeCodigo() {
    if (_codigo) return _codigo;
    _codigo = fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html'));
    for (const f of fs.readdirSync(path.join(RAIZ, 'js'))) {
        if (f.endsWith('.js')) _codigo.push(path.join('js', f));
    }
    return _codigo;
}

const cacheIdent = new Map();
/** En qué ficheros aparece un identificador. Solo sirve si aparece en UNO. */
function ficherosQueContienen(id) {
    if (cacheIdent.has(id)) return cacheIdent.get(id);
    const donde = ficherosDeCodigo().filter((rel) => {
        const l = lineasDe(rel);
        return l && l.some((linea) => linea.includes(id));
    });
    cacheIdent.set(id, donde);
    return donde;
}

function aRuta(nombre) {
    for (const cand of [nombre, path.join('js', nombre)]) {
        if (fs.existsSync(path.join(RAIZ, cand))) return cand;
    }
    return null;
}

/**
 * Resuelve a qué fichero se refiere la cita que empieza en `pos` dentro de `linea`.
 *
 * Se queda con la pista MÁS CERCANA a la cita, prefiriendo las que van antes. Sin esto,
 * una fila como `hijo1 L569, hijo2 L2358, hijo3 L1658` atribuía las tres citas a hijo1
 * —la primera pista de la línea— y el informe acusaba de error a citas correctas. Un
 * verificador que se equivoca al atribuir es tan inútil como la cita que pretende revisar.
 */
function resolverFichero(linea, pos) {
    const pistas = [];
    for (const m of linea.matchAll(/([A-Za-z0-9_-]+\.(?:html|js))/g)) {
        const rel = aRuta(m[1]);
        if (rel) pistas.push({ i: m.index, rel });
    }
    for (const m of linea.matchAll(/\b(padre|hijo[1-6]|selecci[oó]n)\b/gi)) {
        const k = m[1].toLowerCase().replace('ó', 'o');
        if (ALIAS[k]) pistas.push({ i: m.index, rel: ALIAS[k] });
    }
    if (!pistas.length) return null;

    const antes = pistas.filter((p) => p.i <= pos);
    if (antes.length) return antes[antes.length - 1].rel;
    return pistas.reduce((a, b) => (Math.abs(a.i - pos) <= Math.abs(b.i - pos) ? a : b)).rel;
}

function analizar() {
    const lineas = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);
    const resultados = [];

    lineas.forEach((linea, idx) => {
        // Dos formas de citar, y las dos caducan igual:
        //   `L1234`             el fichero se deduce del contexto
        //   `fichero.js:1234`   el fichero va pegado
        const citas = [
            ...[...linea.matchAll(/~?L(\d{2,5})\b/g)].map((m) => ({ n: m[1], index: m.index, fichero: null })),
            ...[...linea.matchAll(/([A-Za-z0-9_-]+\.(?:html|js)):(\d{2,5})\b/g)].map((m) => ({ n: m[2], index: m.index, fichero: m[1] })),
        ];
        if (!citas.length) return;

        const idents = [...linea.matchAll(/`([A-Za-z_$#.][A-Za-z0-9_$.#-]{3,70})`/g)]
            .map((m) => m[1])
            .map((s) => s.replace(/\(.*$/, ''))
            .filter((s) => /^[A-Za-z_$]/.test(s))
            // Un identificador poco especifico da falsos OK: `modo` casa en media docena de
            // sitios de cualquier fichero, y el nombre de un fichero casa dentro de si mismo.
            // Mejor declarar "no puedo comprobarlo" que dar por buena una cita por azar.
            .filter((s) => !/\.(html|js|css|json|md)$/.test(s))
            .filter((s) => s.length >= 8 || /[_$.]/.test(s) || /[a-z][A-Z]/.test(s));

        for (const c of citas) {
            const n = parseInt(c.n, 10);

            // De donde sale el fichero: el pegado a la cita si lo hay, luego lo que diga la
            // propia linea; si no dice nada, se busca el identificador por todo el codigo.
            // Un identificador propio suele vivir en un solo fichero, y entonces la cita SI
            // se puede comprobar —sin ese ultimo intento quedaban 120 dadas por
            // incomprobables que no lo son.
            let rel = c.fichero ? aRuta(c.fichero) : resolverFichero(linea, c.index);
            if (!rel) {
                for (const id of idents) {
                    const donde = ficherosQueContienen(id);
                    if (donde.length === 1) { rel = donde[0]; break; }
                }
            }
            const base = { guia: idx + 1, cita: n, rel, linea: linea.trim().slice(0, 100) };

            if (!rel) { resultados.push({ ...base, estado: 'SIN RESOLVER', motivo: 'no se sabe de que fichero habla' }); continue; }
            const src = lineasDe(rel);
            if (!src) { resultados.push({ ...base, estado: 'SIN RESOLVER', motivo: `${rel} no existe` }); continue; }
            if (n > src.length) { resultados.push({ ...base, estado: 'FUERA', motivo: `${rel} tiene ${src.length} lineas` }); continue; }
            if (!idents.length) { resultados.push({ ...base, estado: 'SIN RESOLVER', motivo: 'sin identificador con el que comprobar' }); continue; }

            let mejor = null;
            for (const id of idents) {
                const donde = [];
                src.forEach((l, i) => { if (l.includes(id)) donde.push(i + 1); });
                if (!donde.length) continue;
                const cerca = donde.some((d) => Math.abs(d - n) <= MARGEN);
                if (cerca) { mejor = { id, estado: 'OK', donde }; break; }
                if (!mejor) mejor = { id, estado: 'MAL', donde };
            }
            if (!mejor) { resultados.push({ ...base, estado: 'NO EXISTE', motivo: `ninguno de [${idents.join(', ')}] aparece en ${rel}` }); continue; }
            resultados.push({ ...base, estado: mejor.estado, id: mejor.id, donde: mejor.donde });
        }
    });

    return resultados;
}

function main() {
    const r = analizar();
    const porEstado = {};
    r.forEach((x) => { porEstado[x.estado] = (porEstado[x.estado] || 0) + 1; });

    // NO EXISTE tambien es una cita rota: dice que algo esta en un fichero donde no esta.
    const fallan = r.filter((x) => x.estado === 'MAL' || x.estado === 'FUERA' || x.estado === 'NO EXISTE');

    if (process.argv.includes('--sin-resolver')) {
        // Las que no se pueden comprobar por medios mecanicos, agrupadas por que les falta.
        const lineas = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);
        const grupos = new Map();
        const ejemplos = new Map();
        for (const x of r.filter((y) => y.estado === 'SIN RESOLVER')) {
            const linea = lineas[x.guia - 1];
            const celdaEntera = new RegExp(`\\|\\s*~?L${x.cita}\\s*\\|`).test(linea);
            const clave = celdaEntera ? 'columna "Linea" de una tabla' : (x.motivo || 'otro');
            grupos.set(clave, (grupos.get(clave) || 0) + 1);
            if (!ejemplos.has(clave)) ejemplos.set(clave, `guia:${x.guia}  ${linea.trim().slice(0, 108)}`);
        }
        console.log(`\nDE LAS ${r.filter((y) => y.estado === 'SIN RESOLVER').length} SIN RESOLVER:`);
        for (const [k, v] of [...grupos].sort((a, b) => b[1] - a[1])) {
            console.log(`  ${String(v).padStart(4)}  ${k}`);
            console.log(`        ej: ${ejemplos.get(k)}`);
        }
        return;
    }

    if (process.argv.includes('--ok')) {
        // Para validar el propio verificador: lo que da por bueno tambien hay que mirarlo.
        r.filter((x) => x.estado === 'OK').forEach((x) => console.log(`guia:${x.guia}  L${x.cita} de ${x.rel}  \`${x.id}\` esta en ${x.donde.slice(0, 4).join(', ')}`));
    } else if (process.argv.includes('--lista')) {
        fallan.forEach((x) => console.log(`guia:${x.guia}  L${x.cita} de ${x.rel}  ${x.estado}  ${x.id ? `${x.id} esta en ${x.donde.slice(0, 3).join(', ')}` : x.motivo}`));
    } else {
        console.log(`CITAS POR NUMERO DE LINEA EN LA GUIA: ${r.length}\n`);
        for (const [k, v] of Object.entries(porEstado).sort((a, b) => b[1] - a[1])) {
            console.log(`  ${String(v).padStart(4)}  ${k}`);
        }
        if (fallan.length) {
            console.log(`\nLAS ${fallan.length} QUE APUNTAN A OTRO SITIO (primeras 20):`);
            fallan.slice(0, 20).forEach((x) => {
                console.log(`  guia:${x.guia}  cita L${x.cita} de ${x.rel}`);
                console.log(`      ${x.id ? `\`${x.id}\` esta de verdad en ${x.donde.slice(0, 4).join(', ')}` : x.motivo}`);
            });
        }
    }

    if (process.argv.includes('--limpiar') || process.argv.includes('--limpiar-seco')) {
        limpiar(fallan, process.argv.includes('--limpiar-seco'));
        return;
    }

    if (process.argv.includes('--check') && fallan.length) {
        console.error(`\n[verificar-citas-guia] ${fallan.length} citas apuntan a otro sitio.`);
        process.exit(1);
    }
}

/**
 * Quita el numero de las citas que apuntan a otro sitio Y llevan al lado un identificador.
 *
 * No las "corrige" poniendo el numero bueno: volveria a caducar en la siguiente edicion del
 * fichero citado. El identificador ya localiza la cosa, y no caduca. El numero solo sobra.
 *
 * NO toca las citas que ocupan una celda entera de tabla —las columnas "Línea"—, porque
 * quitarlas dejaria la celda vacia y eso es una decision de estructura, no de limpieza.
 */
function limpiar(fallan, enSeco) {
    const lineas = fs.readFileSync(GUIA, 'utf8').split(/\r?\n/);
    const original = fs.readFileSync(GUIA, 'utf8');
    const nl = original.includes('\r\n') ? '\r\n' : '\n';

    const porLinea = new Map();
    for (const f of fallan) {
        if (!f.id) continue; // sin identificador el numero es lo unico que hay: no se toca
        if (!porLinea.has(f.guia)) porLinea.set(f.guia, new Set());
        porLinea.get(f.guia).add(f.cita);
    }

    let tocadas = 0; let saltadasPorTabla = 0;
    const muestra = [];

    for (const [nLinea, numeros] of porLinea) {
        const antes = lineas[nLinea - 1];

        // ¿La cita es el contenido completo de una celda? Entonces es una columna "Línea".
        const esCeldaEntera = [...numeros].some((n) => new RegExp(`\\|\\s*~?L${n}\\s*\\|`).test(antes));
        if (esCeldaEntera) { saltadasPorTabla++; continue; }

        let despues = antes;
        for (const n of numeros) {
            despues = despues
                .replace(new RegExp(`\\s*\\(~?L${n}\\s+([^)]*)\\)`, 'g'), ' ($1)')
                .replace(new RegExp(`\\s*\\(~?L${n}\\)`, 'g'), '')
                .replace(new RegExp(`\\s+~?L${n}\\b`, 'g'), '');
        }
        if (despues === antes) continue;
        lineas[nLinea - 1] = despues;
        tocadas++;
        if (muestra.length < 8) muestra.push(`  guia:${nLinea}\n    - ${antes.trim().slice(0, 112)}\n    + ${despues.trim().slice(0, 112)}`);
    }

    console.log(`${enSeco ? 'EN SECO — no se escribe nada' : 'APLICADO'}`);
    console.log(`  lineas de la guia tocadas: ${tocadas}`);
    console.log(`  saltadas por ser columna de tabla: ${saltadasPorTabla}`);
    console.log('\nMUESTRA:');
    muestra.forEach((m) => console.log(m));
    if (!enSeco) fs.writeFileSync(GUIA, lineas.join(nl), 'utf8');
}

main();
