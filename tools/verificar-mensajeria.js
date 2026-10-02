#!/usr/bin/env node
/**
 * verificar-mensajeria.js — Cruza cada tipo de TIPOS_MENSAJE con quién lo emite y quién lo
 * escucha, y comprueba que lo emitido llega a un frame que lo atiende (EJE 4 / EJE 13 de la
 * metodología de auditoría, ver docs/GUIA-COMPLETA.md §36.4 y §36.13).
 *
 * Uso:
 *   node tools/verificar-mensajeria.js            → informe completo
 *   node tools/verificar-mensajeria.js --quiet    → solo huérfanos y envíos al vacío (para CI)
 *   node tools/verificar-mensajeria.js --todos    → tabla markdown de todos los tipos, emisor(es) → receptor(es)
 *
 * QUÉ HACE
 *
 *   1. Importa TIPOS_MENSAJE de js/constants.js y lo aplana (incluye categorías anidadas como
 *      NAVEGACION.GPS.*).
 *   2. Parsea cada página y cada js/*.js con acorn (tools/lib/analisis-js.js) y encuentra:
 *        · EMISORES — un objeto con `tipo` que se pasa a una llamada de envío (`enviar…`,
 *          `despachar…`, `postMessage`) o que lleva `destino`/`datos`.
 *        · RECEPTORES — `registrarControlador`, `registrarControladorSeguro`,
 *          `registrarSiNoExiste` y el `registrar` local de js/app.js.
 *      El tipo se resuelve por el valor, sea cual sea el camino: `TIPOS_MENSAJE.X.Y`,
 *      `globalThis.TIPOS_MENSAJE?.X?.Y`, un alias de import (`TIPOS_MENSAJE as TIPOS_MENSAJE_S1`),
 *      una constante local (`const tipo = …`, ámbito de bloque) o el literal `'X.Y'`.
 *   3. Asigna cada hallazgo a los frames que ejecutan ese fichero (el cierre de imports de cada
 *      página): un módulo compartido cuenta para todos los frames que lo cargan.
 *   4. Informa de:
 *        · tipos emitidos sin ningún receptor, y receptores sin ningún emisor;
 *        · EMISIONES AL VACÍO — destino literal cuyo frame no registra un handler de ese tipo;
 *        · HANDLERS INALCANZABLES — handler que ninguna emisión alcanza (ni destino literal, ni
 *          broadcast, ni destino dinámico, ni `despacharLocal` en el mismo frame);
 *        · el RESIDUO: sitios que parecen emisor o receptor y no se pudieron resolver a un tipo.
 *
 * QUÉ NO VE
 *
 *   - Un destino que no es un literal (`mensaje.origen`, una variable): se da por bueno, así que
 *     "al vacío" es un mínimo, no el total.
 *   - Un tipo montado a trozos o leído de una tabla.
 *   - `'padre'` significa "la ventana de arriba": para puzzle, video-intro y mapa-completo el
 *     anfitrión se toma de ANFITRION (abajo); si cambia quién los embebe hay que actualizarlo.
 *   - Lo que se registre con otro nombre de función que los cuatro de arriba.
 *
 * Todo lo que marca es un candidato: se verifica leyendo emisor y receptor antes de actuar.
 */
'use strict';

const path = require('node:path');
const { pathToFileURL } = require('node:url');
const L = require('./lib/analisis-js');

const ARGS = process.argv.slice(2);
const QUIET = ARGS.includes('--quiet');
const TODOS = ARGS.includes('--todos');

/** Nombre corto de cada frame del censo (regla 3b de CLAUDE.md). */
const ETIQUETA = {
    'codigo-padre.html': 'padre',
    'En-busca-del-tesoro.html': 'seleccion',
    'extrainfo-hijo1.html': 'hijo1',
    'coordenadas-hijo2.html': 'hijo2',
    'audio-hijo3.html': 'hijo3',
    'retos-hijo4.html': 'hijo4',
    'boton-casa-hijo5.html': 'hijo5',
    'chat-hijo6.html': 'hijo6',
    'mapa-completo.html': 'mapa-completo',
    'puzzle.html': 'puzzle',
    'video-intro.html': 'video-intro',
};

/** Dónde vive cada frame anidado: a quién llega un `destino: 'padre'` que sale de él. */
const ANFITRION = {
    puzzle: ['hijo4', 'seleccion'],
    'video-intro': ['seleccion', 'hijo6'],
    'mapa-completo': ['padre'],
};

/**
 * Un `broadcast` llega a los iframes que el frame emisor tiene registrados, nunca a su propia ventana
 * (`_enviarATodos` recorre `iframesRegistrados`). Para un fichero que cargan varios frames hay que decir quién
 * lo ejecuta de verdad: el latido de js/mensajeria.js (`iniciarHeartbeat`) solo lo arranca el padre.
 */
const EMISOR_DE_BROADCAST = { 'js/mensajeria.js': ['padre'] };

/** Ids del bus que no coinciden con la etiqueta del frame. */
const ID_A_FRAME = { 'hijo1-opciones': 'hijo1', 'hijo6-chat': 'hijo6' };

/**
 * Tipos que el propio bus atiende en todo frame que lo carga, sin handler registrado: los errores
 * de un frame de abajo suben hasta el padre (js/mensajeria.js, "Los errores de un frame de abajo
 * suben hasta el padre de todos"). Un `SISTEMA.ERROR` con `destino: 'padre'` que sale de un frame
 * anidado llega al anfitrión y el bus lo reenvía: no cae "al vacío" aunque el anfitrión no
 * registre nada. `SISTEMA.CONFIRMACION` y `SISTEMA.NACK` NO están aquí: el bus solo atiende los
 * acuses con `idOriginal`, y los envíos sueltos sí caen en "sin handler".
 */
const RELEVOS_DEL_BUS = new Set(['SISTEMA.ERROR']);

const RECEPTOR = /(^|\.)(registrarControlador(Seguro)?|registrarSiNoExiste|registrar)$/;
const EMISION = /enviar|despachar|postMessage|emit|bus\./i;

function aplanar(obj, prefijo = []) {
    const out = [];
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') out.push({ ruta: [...prefijo, k].join('.'), valor: v });
        else if (v && typeof v === 'object') out.push(...aplanar(v, [...prefijo, k]));
    }
    return out;
}

async function cargarTipos() {
    // js/constants.js es un módulo ES sin "type": "module" en package.json: Node avisa de que lo
    // reinterpreta, y el módulo escribe una línea `debug` al cargarse. Ninguna de las dos cosas
    // es de interés aquí.
    process.removeAllListeners('warning');
    process.on('warning', (w) => { if (w.code !== 'MODULE_TYPELESS_PACKAGE_JSON') console.warn(w.stack || w); });
    const debug = console.debug;
    console.debug = () => {};
    try {
        const m = await import(pathToFileURL(path.join(L.RAIZ, 'js', 'constants.js')).href);
        return m.TIPOS_MENSAJE;
    } finally {
        console.debug = debug;
    }
}

/** Los frames que ejecutan cada fichero (el cierre de imports de cada página), y el residuo. */
function framesPorFichero() {
    const por = new Map();
    const residuo = [];
    for (const pagina of L.paginas()) {
        const { ficheros, residuo: r } = L.cierreDeFrame(pagina);
        residuo.push(...r);
        const usaBus = ficheros.has('js/mensajeria.js');
        if (usaBus && !ETIQUETA[pagina]) residuo.push(`${pagina}: carga el bus y no tiene etiqueta en ETIQUETA`);
        const etiqueta = ETIQUETA[pagina] || pagina;
        for (const f of ficheros) {
            if (!por.has(f)) por.set(f, new Set());
            por.get(f).add(etiqueta);
        }
    }
    return { por, residuo };
}

/**
 * Los emisores y receptores de un fichero.
 * Los alias de TIPOS_MENSAJE se resuelven por ámbito de bloque: un mismo nombre (`tipo`) puede
 * apuntar a tipos distintos en funciones distintas del mismo fichero.
 */
function analizar(rel, T, valoresValidos) {
    const emisores = [];
    const receptores = [];
    const sinResolver = [];

    for (const { code, lineaBase } of L.bloques(rel)) {
        const p = L.parsear(code);
        if (!p) { sinResolver.push({ rel, linea: 0, que: 'bloque sin parsear' }); continue; }

        // --- 1. raíces y alias (con ámbito)
        const raices = new Set(['TIPOS_MENSAJE']);
        const esRaiz = (nombre) => raices.has(nombre) || /^TIPOS_MENSAJE/.test(nombre);
        const declaraciones = []; // { nombre, ruta, bloque, inicio }
        const ambito = (padres) => {
            for (let i = padres.length - 1; i >= 0; i--) {
                const t = padres[i].type;
                if (t === 'BlockStatement' || t === 'Program' || t === 'StaticBlock') return padres[i];
            }
            return null;
        };
        L.recorrer(p.ast, (n, padres) => {
            if (n.type === 'ImportSpecifier' && n.imported.name === 'TIPOS_MENSAJE') raices.add(n.local.name);
            if (n.type !== 'VariableDeclarator' || !n.init) return;
            let init = n.init;
            if (init.type === 'AwaitExpression') init = init.argument;
            // const { TIPOS_MENSAJE: X } = await import('./js/constants.js')
            if (n.id.type === 'ObjectPattern' && init.type === 'ImportExpression') {
                for (const pr of n.id.properties) {
                    if (pr.type === 'Property' && pr.key.name === 'TIPOS_MENSAJE' && pr.value.type === 'Identifier') raices.add(pr.value.name);
                }
                return;
            }
            const ruta = L.rutaDe(init);
            if (!ruta || !esRaiz(ruta[0])) return;
            const blk = ambito(padres);
            if (ruta.length === 1 && n.id.type === 'Identifier') { raices.add(n.id.name); return; }
            if (n.id.type === 'Identifier') {
                declaraciones.push({ nombre: n.id.name, ruta: ruta.slice(1), bloque: blk, inicio: n.start });
            } else if (n.id.type === 'ObjectPattern') {
                for (const pr of n.id.properties) {
                    if (pr.type === 'Property' && pr.value.type === 'Identifier' && pr.key.name) {
                        declaraciones.push({ nombre: pr.value.name, ruta: ruta.slice(1).concat(pr.key.name), bloque: blk, inicio: n.start });
                    }
                }
            }
        });

        const resolver = (ruta, padres, uso) => {
            if (!ruta) return null;
            let resto = null;
            if (esRaiz(ruta[0])) {
                resto = ruta.slice(1);
            } else {
                // el alias declarado en el bloque más cercano que contiene el uso, el último antes de él
                const bloques = padres.filter((x) => x.type === 'BlockStatement' || x.type === 'Program' || x.type === 'StaticBlock').reverse();
                for (const b of bloques) {
                    const d = declaraciones.filter((x) => x.nombre === ruta[0] && x.bloque === b && x.inicio <= uso).pop();
                    if (d) { resto = d.ruta.concat(ruta.slice(1)); break; }
                }
            }
            if (!resto) return null;
            let cur = T;
            for (const k of resto) {
                if (cur && typeof cur === 'object' && k in cur) cur = cur[k]; else return null;
            }
            return typeof cur === 'string' ? cur : null;
        };

        const candidatos = (valor, padres, uso) => {
            const out = [];
            (function recoger(x) {
                if (!x) return;
                if (x.type === 'ConditionalExpression') { recoger(x.consequent); recoger(x.alternate); return; }
                if (x.type === 'LogicalExpression') { recoger(x.left); recoger(x.right); return; }
                if (x.type === 'ChainExpression') { recoger(x.expression); return; }
                if (x.type === 'Literal' && typeof x.value === 'string') {
                    out.push({ crudo: JSON.stringify(x.value), tipo: valoresValidos.has(x.value) ? x.value : null });
                    return;
                }
                const ruta = L.rutaDe(x);
                out.push({ crudo: ruta ? ruta.join('.') : x.type, tipo: ruta ? resolver(ruta, padres, uso) : null });
            })(valor);
            return out;
        };

        // --- 2. emisores y receptores
        L.recorrer(p.ast, (n, padres) => {
            const linea = n.loc.start.line + lineaBase;
            if (n.type === 'ObjectExpression') {
                const prop = (nombre) => n.properties.find((q) => q.type === 'Property' && !q.computed && (q.key.name === nombre || q.key.value === nombre));
                const tipoProp = prop('tipo');
                if (!tipoProp) return;
                const padre = padres[padres.length - 1];
                const llamada = padre && (padre.type === 'CallExpression' || padre.type === 'NewExpression') && padre.arguments.includes(n)
                    ? L.textoDe(padre.callee.type === 'ChainExpression' ? padre.callee.expression : padre.callee) : null;
                const destProp = prop('destino');
                // `idOriginal` marca el acuse que construye el propio bus (`enviarConfirmacion`).
                if (!(llamada && EMISION.test(llamada)) && !destProp && !prop('datos') && !prop('idOriginal')) return;
                let destino = null; // null = sin destino (envío local o dinámico)
                let destinoLiteral = false;
                if (destProp) {
                    const dv = destProp.value;
                    if (dv.type === 'Literal' && typeof dv.value === 'string') { destino = dv.value; destinoLiteral = true; }
                    else destino = '<dinámico>';
                }
                // Solo `despacharLocal` sin destino se queda en el propio frame. Un literal sin
                // `destino` que se pasa a otra función (`enviarMensajeIframe('hijo2', payload)`)
                // lleva el destino fuera del objeto: se da por dinámico.
                const local = destino === null && /despacharLocal/.test(llamada || '');
                for (const c of candidatos(tipoProp.value, padres, n.start)) {
                    const reg = { rel, linea, llamada, crudo: c.crudo, tipo: c.tipo, destino, destinoLiteral, local };
                    if (c.tipo) emisores.push(reg); else sinResolver.push({ rel, linea, que: `emisor ${c.crudo}` });
                }
            }
            // Lo que el propio bus atiende sin registrar un handler: compara `mensaje.tipo` con el tipo
            // (acuses, latido, reenvío de errores). Cuenta como receptor del tipo en la tabla y en las
            // listas de huérfanos, pero NO como handler de un frame: no oculta los envíos al vacío.
            if (rel === 'js/mensajeria.js' && n.type === 'BinaryExpression' && ['===', '==', '!==', '!='].includes(n.operator)) {
                const esTipo = (x) => x.type === 'MemberExpression' && !x.computed && x.property.name === 'tipo';
                const otro = esTipo(n.left) ? n.right : (esTipo(n.right) ? n.left : null);
                if (otro) {
                    for (const c of candidatos(otro, padres, n.start)) {
                        if (c.tipo) receptores.push({ rel, linea, llamada: 'comparación con .tipo', crudo: c.crudo, tipo: c.tipo, interno: true });
                    }
                }
            }
            if (n.type === 'CallExpression') {
                const nombre = L.textoDe(n.callee.type === 'ChainExpression' ? n.callee.expression : n.callee);
                if (!RECEPTOR.test(nombre) || !n.arguments[0]) return;
                for (const c of candidatos(n.arguments[0], padres, n.start)) {
                    if (c.tipo) receptores.push({ rel, linea, llamada: nombre, crudo: c.crudo, tipo: c.tipo });
                    else sinResolver.push({ rel, linea, que: `receptor ${nombre}(${c.crudo})` });
                }
            }
        });
    }
    return { emisores, receptores, sinResolver };
}

async function main() {
    const T = await cargarTipos();
    const tipos = aplanar(T);
    const validos = new Set(tipos.map((t) => t.valor));
    const { por: frames, residuo: residuoFrames } = framesPorFichero();

    const ficheros = [...L.paginas(), ...L.modulos({ conDatos: false })];
    const emisores = [];
    const receptores = [];
    const sinResolver = [];
    for (const rel of ficheros) {
        const r = analizar(rel, T, validos);
        emisores.push(...r.emisores);
        receptores.push(...r.receptores);
        sinResolver.push(...r.sinResolver);
    }

    const framesDe = (rel) => [...(frames.get(rel) || [rel])];
    const porTipo = new Map(tipos.map((t) => [t.valor, { ruta: t.ruta, emisores: [], receptores: [] }]));
    for (const e of emisores) porTipo.get(e.tipo).emisores.push(e);
    for (const r of receptores) porTipo.get(r.tipo).receptores.push(r);

    const lista = (arr) => [...new Set(arr.map((x) => `${x.rel}:${x.linea}`))].join(', ');
    const sinReceptor = [...porTipo].filter(([, e]) => e.emisores.length && !e.receptores.length);
    const sinEmisor = [...porTipo].filter(([, e]) => e.receptores.length && !e.emisores.length);
    const sinNinguno = [...porTipo].filter(([, e]) => !e.emisores.length && !e.receptores.length);
    const conAmbos = tipos.length - sinReceptor.length - sinEmisor.length - sinNinguno.length;

    if (TODOS) {
        console.log('| Tipo | Emisor(es) | Receptor(es) |');
        console.log('|---|---|---|');
        for (const [valor, e] of [...porTipo].sort((a, b) => a[0].localeCompare(b[0]))) {
            const em = [...new Set(e.emisores.map((x) => x.rel))].sort().join(', ') || '*(ninguno detectado)*';
            const re = [...new Set(e.receptores.map((x) => x.rel))].sort().join(', ') || '*(ninguno detectado)*';
            console.log(`| \`${valor}\` | ${em} | ${re} |`);
        }
        return;
    }

    // --- emisiones al vacío y handlers inalcanzables
    const framesConHandler = new Map(); // tipo -> Set(frames)
    for (const r of receptores) {
        if (r.interno) continue;
        if (!framesConHandler.has(r.tipo)) framesConHandler.set(r.tipo, new Set());
        for (const f of framesDe(r.rel)) framesConHandler.get(r.tipo).add(f);
    }
    for (const tipo of RELEVOS_DEL_BUS) {
        if (!framesConHandler.has(tipo)) framesConHandler.set(tipo, new Set());
        for (const f of framesDe('js/mensajeria.js')) framesConHandler.get(tipo).add(f);
    }
    const destinosDe = (e, frame) => {
        if (e.destino === 'padre') return ANFITRION[frame] || (frame === 'padre' ? [] : ['padre']);
        return [ID_A_FRAME[e.destino] || e.destino];
    };
    const alVacio = [];
    for (const e of emisores) {
        if (!e.destinoLiteral || e.destino === 'broadcast') continue;
        const tiene = framesConHandler.get(e.tipo) || new Set();
        const malos = new Set();
        for (const f of framesDe(e.rel)) {
            const objetivos = destinosDe(e, f);
            if (objetivos.length && !objetivos.some((o) => tiene.has(o))) malos.add(`${f}→${objetivos.join('|')}`);
        }
        if (malos.size) alVacio.push({ ...e, malos: [...malos] });
    }
    const inalcanzables = [];
    const vistos = new Set();
    for (const r of receptores) {
        if (r.interno) continue;
        const emisoresDelTipo = porTipo.get(r.tipo).emisores;
        for (const f of framesDe(r.rel)) {
            const clave = `${r.tipo}|${f}|${r.rel}:${r.linea}`;
            if (vistos.has(clave)) continue;
            vistos.add(clave);
            const alcanza = emisoresDelTipo.some((e) => {
                if (e.local) return framesDe(e.rel).includes(f); // despacharLocal: solo el propio frame
                if (!e.destinoLiteral) return (EMISOR_DE_BROADCAST[e.rel] || framesDe(e.rel)).some((origen) => origen !== f); // dinámico: a cualquiera menos al propio emisor (el bus no se envía a sí mismo)
                if (e.destino === 'broadcast') return (EMISOR_DE_BROADCAST[e.rel] || framesDe(e.rel)).some((origen) => origen !== f);
                return framesDe(e.rel).some((origen) => destinosDe(e, origen).includes(f));
            });
            if (!alcanza) inalcanzables.push({ ...r, frame: f, emisores: emisoresDelTipo });
        }
    }

    if (!QUIET) {
        console.log(`Páginas y módulos analizados: ${ficheros.length}`);
        console.log(`Tipos de mensaje totales: ${tipos.length} (${conAmbos} con emisor y receptor)`);
        console.log(`Emisores resueltos: ${emisores.length}; receptores resueltos: ${receptores.length}; sin resolver: ${sinResolver.length}\n`);
    }

    console.log('=== Tipos SIN receptor (se emiten pero ningún frame registra handler) ===');
    for (const [valor, e] of sinReceptor) console.log(`  ${valor}  emisores: ${lista(e.emisores)}`);
    console.log('\n=== Tipos SIN emisor (hay handler pero nadie lo emite) ===');
    for (const [valor, e] of sinEmisor) console.log(`  ${valor}  receptores: ${lista(e.receptores)}`);
    console.log('\n=== Tipos SIN ninguna referencia (candidatos a tipo muerto) ===');
    for (const [valor] of sinNinguno) console.log(`  ${valor}`);

    console.log(`\n=== EMISIONES AL VACÍO — destino literal cuyo frame no registra handler de ese tipo (${alVacio.length}) ===`);
    for (const e of alVacio) console.log(`  ${e.tipo}  ${e.rel}:${e.linea}  (${e.malos.join(', ')})`);

    console.log(`\n=== HANDLERS INALCANZABLES — ninguna emisión los alcanza (${inalcanzables.length}) ===`);
    for (const r of inalcanzables) {
        const quien = [...new Set(r.emisores.map((e) => `${framesDe(e.rel).join('+')}→${e.local ? 'local' : (e.destino ?? 'sin destino en el literal')}`))].join(', ') || '(ningún emisor)';
        console.log(`  ${r.tipo}  handler en ${r.frame} (${r.rel}:${r.linea})  emisores: ${quien}`);
    }

    console.log(`\n=== RESIDUO — lo que parece emisor/receptor y no se resolvió a un tipo (${sinResolver.length + residuoFrames.length}) ===`);
    for (const s of sinResolver) console.log(`  ${s.rel}:${s.linea}  ${s.que}`);
    for (const s of residuoFrames) console.log(`  ${s}`);

    if (!QUIET) {
        console.log('\nIMPORTANTE: cada hallazgo es un candidato. Se verifica leyendo emisor y receptor');
        console.log('antes de actuar; los destinos dinámicos se dan por buenos (ver cabecera del script).');
    }
}

main().catch((e) => { console.error(e); process.exit(2); });
