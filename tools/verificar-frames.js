#!/usr/bin/env node
/**
 * Matriz de frames x patrones: una fila por cada pagina del proyecto, una columna por
 * cada patron que deberia ser igual en todas.
 *
 * POR QUE EXISTE
 *
 * Un `grep` de un nombre devuelve la lista de quien LO TIENE. Quien no lo tiene no
 * aparece en ninguna parte, asi que leer esa lista como si fuera el inventario deja
 * fuera justo al que falta — y es el unico que importa. Aqui las filas salen del disco
 * y la ausencia es una casilla vacia que se ve.
 *
 * QUE MIRA (y que NO ve cada columna: importa tanto como lo que ve)
 *
 * Todas las columnas leen el fichero SIN sus comentarios (tools/lib/analisis-js.js los
 * blanquea con el parser): un comentario que EXPLICA por que ya no se toca otro frame, o que
 * cita `parent.document`, no cuenta como un uso.
 *
 *   oculta-body      `display='none'` sobre el body. NO ve un ocultado por CSS, ni por
 *                    una clase, ni hecho desde otro fichero.
 *   (No hay columna para "se oculta antes del load": esa pregunta la contesta el spec 86,
 *   midiendola dentro de cada frame en un navegador de verdad. Una version estatica aqui
 *   daba falsos positivos en hijo2/3/4 —contaba como await de nivel superior los que estan
 *   dentro de una funcion— y contradecia a la medicion buena. Dos respuestas a la misma
 *   pregunta es el problema, no la solucion.)
 *   bus              importa `js/mensajeria.js` o llama a `inicializarMensajeria`.
 *                    NO distingue usarlo de solo importarlo.
 *   capa-privada     tiene `messagingAdapter` o define su propio
 *                    `registrarControladorSeguro`. NO ve otras copias con otro nombre.
 *   escuchas-crudas  cuantos `addEventListener('message')` hay. Cuenta el registrador
 *                    del propio bus si el fichero lo lleva dentro.
 *   envios-crudos    cuantos `.postMessage(` hay. NO distingue el del bus de los demas.
 *   registra-iframes llama a `registrarIframe`/`registrarIframeHijo` — el doble papel.
 *   toca-otro-frame  cualquier acceso a una propiedad de `parent` (`parent.x`, `parent?.x`,
 *                    `globalThis.parent.x`) o de `contentWindow` distinta de `postMessage`,
 *                    sea una llamada o una lectura: Opcion A los prohibe. NO ve un acceso
 *                    guardado en una variable antes (`const p = globalThis.parent; p.x`) ni
 *                    por clave computada (`parent['x']`), y una variable local que se llame
 *                    `parent` (el padre de un nodo del DOM) suma de mas. `--detalle` enseña
 *                    cada coincidencia con su linea para comprobarla a mano.
 *
 * Debajo de la matriz, la misma comprobacion sobre los `js/*.js` compartidos: un modulo que
 * se carga en un frame toca el frame de arriba como si fuera suyo, y no tiene fila.
 *
 * USO
 *
 *   npm run verificar-frames
 *   npm run verificar-frames -- --detalle
 */
'use strict';

const L = require('./lib/analisis-js');

const DETALLE = process.argv.slice(2).includes('--detalle');

/**
 * Quien nombra a quien. Buscar `src="literal"` NO basta: el padre no escribe el src de
 * sus hijos en el HTML, los crea desde una lista de configuracion
 * (`{ id: 'hijo2', src: 'coordenadas-hijo2.html' }`), asi que esa busqueda daba a
 * hijo1/2/3/5 por paginas de primer nivel. Se busca el nombre del fichero entre comillas
 * en cualquier sitio, incluidos los `js/*.js`.
 *
 * Lo que esto NO ve: un nombre construido a trozos.
 */
function nombradaPor(todas, texto) {
    const mapa = new Map(todas.map((f) => [f, []]));
    for (const [rel, t] of texto) {
        const quien = rel.split('/').pop();
        for (const otra of todas) {
            if (otra === quien) continue;
            const re = new RegExp('[\'"`][^\'"`]*' + otra.replace(/\./g, '\\.'));
            if (re.test(t)) mapa.get(otra).push(quien);
        }
    }
    return mapa;
}

function contar(texto, re) {
    return (texto.match(re) || []).length;
}

/**
 * Los accesos a otro frame: `parent` o `contentWindow` seguidos de una propiedad que no sea
 * `postMessage`, con `.` o `?.`. `parent` solo cuenta suelto o tras `globalThis`/`window`/`self`;
 * precedido de otro nombre (`el.parent.x`, `padre.parent`) es otra cosa.
 */
const ACCESO_OTRO_FRAME = /(?<![\w$.])(?:(?:globalThis|window|self)\s*\??\.\s*)?parent\s*\??\.\s*(?!postMessage\b)[A-Za-z_$][\w$]*|\.contentWindow\s*\??\.\s*(?!postMessage\b)[A-Za-z_$][\w$]*/g;

function coincidencias(texto, re) {
    const out = [];
    for (const m of texto.matchAll(re)) {
        const linea = texto.slice(0, m.index).split('\n').length;
        out.push({ linea, texto: m[0].replace(/\s+/g, ' ') });
    }
    return out;
}

function analizar(fichero, t) {
    return {
        fichero,
        ocultaBody: /document\.body\.style\.display\s*=\s*['"]none['"]/.test(t),
        bus: /js\/mensajeria\.js|inicializarMensajeria/.test(t),
        capaPrivada: /messagingAdapter|registrarControladorSeguro\s*=\s*(?:async\s*)?function/.test(t),
        escuchasCrudas: contar(t, /addEventListener\(\s*['"]message['"]/g),
        enviosCrudos: contar(t, /\.postMessage\(/g),
        registraIframes: /registrarIframe(?:Hijo)?\s*\(/.test(t),
        // `postMessage` NO cuenta aqui: hablar con el padre es lo que hay que hacer, y ya tiene
        // su propia columna. Lo que esta columna busca es el acceso que Opcion A prohibe —leerle
        // el DOM, llamarle una funcion o leerle una variable—, y contarlos juntos daba 5 "accesos
        // prohibidos" en un fichero que solo mandaba mensajes.
        ajeno: coincidencias(t, ACCESO_OTRO_FRAME),
    };
}

function celda(v) {
    if (v === null) return '  -  ';
    if (v === true) return '  si ';
    if (v === false) return '  NO ';
    if (v === 0) return '  .  ';
    return String(v).padStart(4) + ' ';
}

function main() {
    const todas = L.paginas();
    const modulos = L.modulos({ conDatos: false });
    const texto = new Map();
    const sinParsear = [];
    for (const rel of [...todas, ...modulos]) {
        const r = L.textoSinComentarios(rel);
        texto.set(rel, r.texto);
        sinParsear.push(...r.sinParsear);
    }

    const padres = nombradaPor(todas, texto);
    const filas = todas.map((f) => analizar(f, texto.get(f)));

    const anchoN = Math.max(...todas.map((f) => f.length)) + 1;
    const cabeceras = ['oculta', 'bus', 'privada', 'escuchas', 'envios', 'reg.ifr', 'ajeno'];

    console.log('');
    console.log('  ' + 'pagina'.padEnd(anchoN) + cabeceras.map((c) => c.padStart(6).padEnd(6)).join(' '));
    console.log('  ' + '-'.repeat(anchoN + cabeceras.length * 7));

    for (const f of filas) {
        const dentroDeIframe = padres.get(f.fichero).length > 0;
        const marca = dentroDeIframe ? ' ' : '*';
        console.log('  ' + (marca + f.fichero).padEnd(anchoN)
            + [f.ocultaBody, f.bus, f.capaPrivada,
               f.escuchasCrudas, f.enviosCrudos, f.registraIframes, f.ajeno.length]
                .map(celda).join(' '));
    }

    console.log('');
    console.log('  * = nadie la nombra: no la carga ningun otro fichero del proyecto');
    console.log('  si/NO = lo tiene / no lo tiene   -  = no aplica   . = cero   nN = cuantos');
    console.log('');

    // Lo que la matriz señala sola, sin que nadie le diga donde mirar.
    //
    // "Frame del protocolo" = habla por postMessage en alguna direccion, o usa el bus.
    // Ese es el criterio, y esta escrito aqui a proposito antes de mirar la salida: una
    // pagina de contenido que alguien abre en un overlay (gastronomia, consejos...) no
    // tiene saludo ni handler, asi que no ocultarse no es un fallo suyo. Marcar filas por
    // "alguien la nombra" metia aqui hasta index.html y el propio padre.
    const hijos = filas.filter((f) => f.fichero !== 'codigo-padre.html'
        && (f.enviosCrudos > 0 || f.escuchasCrudas > 0 || f.bus));
    const sinOcultar = hijos.filter((f) => !f.ocultaBody).map((f) => f.fichero);
    const privadas = filas.filter((f) => f.capaPrivada).map((f) => f.fichero);
    const ajenos = filas.filter((f) => f.ajeno.length > 0).map((f) => `${f.fichero} (${f.ajeno.length})`);

    if (sinOcultar.length) console.log(`  Frames del protocolo que NO ocultan su interfaz: ${sinOcultar.join(', ')}`);
    if (privadas.length) console.log(`  Con capa de mensajeria propia: ${privadas.join(', ')}`);
    if (ajenos.length) console.log(`  Tocan otro frame (Opcion A lo prohibe): ${ajenos.join(', ')}`);

    // Los modulos compartidos no tienen fila, pero el acceso lo hace el frame que los carga.
    const deModulos = modulos
        .map((rel) => ({ rel, ajeno: coincidencias(texto.get(rel), ACCESO_OTRO_FRAME) }))
        .filter((m) => m.ajeno.length > 0);
    if (deModulos.length) console.log(`  Modulos compartidos que tocan otro frame: ${deModulos.map((m) => `${m.rel} (${m.ajeno.length})`).join(', ')}`);

    if (DETALLE) {
        console.log('');
        console.log('  Coincidencias de la columna "ajeno" (la comprobacion a mano):');
        for (const f of filas) for (const a of f.ajeno) console.log(`    ${f.fichero}:${a.linea}  ${a.texto}`);
        for (const m of deModulos) for (const a of m.ajeno) console.log(`    ${m.rel}:${a.linea}  ${a.texto}`);
    }

    // El residuo: lo que no se pudo parsear sigue con sus comentarios dentro del texto.
    console.log(`  Residuo: ${sinParsear.length} bloque(s) sin parsear${sinParsear.length ? ' — ' + sinParsear.join('; ') : ''}`);
    console.log('');
}

main();
