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
 *   toca-otro-frame  `parent.document`, `parent.<algo>(` o `contentWindow.<algo>`, que
 *                    Opcion A prohibe. NO ve un acceso guardado en una variable antes, y
 *                    cuenta de mas lo que aparezca dentro de un comentario — un fichero que
 *                    EXPLICA por que ya no toca otro frame sigue sumando uno.
 *
 * USO
 *
 *   npm run verificar-frames
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');

/** Paginas del proyecto: salen del disco, no de una lista escrita a mano. */
function paginas() {
    return fs.readdirSync(RAIZ)
        .filter((f) => f.endsWith('.html'))
        .sort();
}

/**
 * Quien nombra a quien. Buscar `src="literal"` NO basta: el padre no escribe el src de
 * sus hijos en el HTML, los crea desde una lista de configuracion
 * (`{ id: 'hijo2', src: 'coordenadas-hijo2.html' }`), asi que esa busqueda daba a
 * hijo1/2/3/5 por paginas de primer nivel. Se busca el nombre del fichero entre comillas
 * en cualquier sitio, incluidos los `js/*.js`.
 *
 * Lo que esto NO ve: un nombre construido a trozos. Lo que cuenta de mas: una mencion
 * en un comentario.
 */
function nombradaPor(todas) {
    const fuentes = [
        ...todas.map((f) => path.join(RAIZ, f)),
        ...fs.readdirSync(path.join(RAIZ, 'js'))
            .filter((f) => f.endsWith('.js'))
            .map((f) => path.join(RAIZ, 'js', f)),
    ];
    const mapa = new Map(todas.map((f) => [f, []]));
    for (const ruta of fuentes) {
        const t = fs.readFileSync(ruta, 'utf8');
        const quien = path.basename(ruta);
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

function analizar(fichero) {
    const t = fs.readFileSync(path.join(RAIZ, fichero), 'utf8');

    const posOculta = t.search(/document\.body\.style\.display\s*=\s*['"]none['"]/);

    return {
        fichero,
        ocultaBody: posOculta !== -1,
        bus: /js\/mensajeria\.js|inicializarMensajeria/.test(t),
        capaPrivada: /messagingAdapter|registrarControladorSeguro\s*=\s*(?:async\s*)?function/.test(t),
        escuchasCrudas: contar(t, /addEventListener\(\s*['"]message['"]/g),
        enviosCrudos: contar(t, /\.postMessage\(/g),
        registraIframes: /registrarIframe(?:Hijo)?\s*\(/.test(t),
        // `postMessage` NO cuenta aqui: hablar con el padre es lo que hay que hacer, y ya tiene
        // su propia columna. Lo que esta columna busca es el acceso que Opcion A prohibe —leerle
        // el DOM o llamarle una funcion—, y contarlos juntos daba 5 "accesos prohibidos" en un
        // fichero que solo mandaba mensajes.
        tocaOtroFrame: contar(t, /parent\.document|parent\.(?!postMessage)[A-Za-z_$][\w$]*\s*\(|contentWindow\.(?!postMessage)[A-Za-z_$]/g),
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
    const todas = paginas();
    const padres = nombradaPor(todas);
    const filas = todas.map(analizar);

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
               f.escuchasCrudas, f.enviosCrudos, f.registraIframes, f.tocaOtroFrame]
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
    const ajenos = filas.filter((f) => f.tocaOtroFrame > 0).map((f) => `${f.fichero} (${f.tocaOtroFrame})`);

    if (sinOcultar.length) console.log(`  Frames del protocolo que NO ocultan su interfaz: ${sinOcultar.join(', ')}`);
    if (privadas.length) console.log(`  Con capa de mensajeria propia: ${privadas.join(', ')}`);
    if (ajenos.length) console.log(`  Tocan otro frame (Opcion A lo prohibe): ${ajenos.join(', ')}`);
    console.log('');
}

main();
