'use strict';
/**
 * analisis-js.js — Piezas comunes de las herramientas que leen el código con un parser real
 * (acorn) en vez de buscar por patrón.
 *
 * POR QUE EXISTE
 *
 * Un `grep` o una expresión regular devuelven lo que CASA con el patrón. Que algo no salga puede
 * querer decir que no está o que el patrón no lo vio, y la salida no distingue las dos cosas:
 * un alias (`const T = TIPOS_MENSAJE.X`), una forma con `?.`, el texto de un comentario que
 * cita el nombre, una llamada por `globalThis.nombre` o un literal partido en trozos lo esconden
 * o lo inventan. Aquí se parsea de verdad, y cada herramienta que se apoya en esto imprime su
 * RESIDUO —lo que no pudo resolver— para que "no sale nada" no se confunda con "no se miró".
 *
 * `acorn` y `eslint-scope` no son dependencias propias del proyecto: llegan con `eslint`
 * (devDependency). Si faltan, `npm install` los trae.
 *
 * QUE NO HACE
 *
 *   - No sigue accesos por clave computada (`globalThis[nombre]`) ni `eval`/`new Function`.
 *   - Un `import()` con la ruta en una plantilla (`./x.js?v=${…}`) no se resuelve: sale en el
 *     residuo de `cierreDeFrame`.
 *   - El cierre de un frame es una SOBREAPROXIMACION: incluye todo lo importable, también lo
 *     que solo se carga bajo una condición que ese frame no cumple.
 */

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..', '..');

let acorn;
try {
    acorn = require(path.join(RAIZ, 'node_modules', 'acorn'));
} catch {
    throw new Error('No encuentro `acorn` en node_modules (llega con eslint): ejecuta `npm install`.');
}

const OPCIONES_ACORN = {
    ecmaVersion: 'latest',
    locations: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowHashBang: true,
};

/** Módulos de datos: tablas enormes (miles de líneas) que no llevan lógica ni mensajería. */
const MODULOS_DE_DATOS = new Set([
    'aventuras-ID-padre.js', 'coordenadas-aventuras.js', 'retos-aventuras.js', 'textos-aventuras.js',
    'audios-aventuras.js', 'traducciones-ui.js', 'puzzles-aventuras.js', 'terminos-aventuras.js',
    'agradecimientos-aventuras.js', 'mapa-vintage-aventuras.js', 'indice-aventuras.js',
]);

/** Lee un fichero del repo (ruta relativa con `/`), sin BOM y con saltos de línea LF. */
function leer(rel) {
    let t = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
    if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
    return t.replace(/\r\n/g, '\n');
}

function existe(rel) {
    try { return fs.statSync(path.join(RAIZ, rel)).isFile(); } catch { return false; }
}

/** Las páginas `.html` de la raíz, ordenadas. Salen del disco, no de una lista escrita a mano. */
function paginas() {
    return fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html')).sort();
}

/** Los `js/*.js` de la aplicación (sin `vendor/`, sin el servidor de desarrollo). */
function modulos({ conDatos = true } = {}) {
    return fs.readdirSync(path.join(RAIZ, 'js'), { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith('.js') && e.name !== 'server.js')
        .filter((e) => conDatos || !MODULOS_DE_DATOS.has(e.name))
        .map((e) => 'js/' + e.name)
        .sort();
}

/** Sustituye por espacios todo menos los saltos de línea: conserva posiciones y números de línea. */
function blanquear(texto) {
    return texto.replace(/[^\n]/g, ' ');
}

/**
 * Los bloques de JavaScript de un fichero. En un `.js` es el fichero entero; en un `.html`, cada
 * `<script>` sin `src` (y de tipo JS), con los comentarios HTML y el contenido de `<style>`
 * blanqueados para que un `<script>` citado dentro de un comentario no cuente.
 *
 * @returns {{ code: string, lineaBase: number, inicio: number }[]}  `lineaBase` se suma a la línea
 *          del bloque; `inicio` es su posición dentro del fichero.
 */
function bloques(rel, src = leer(rel)) {
    if (!rel.endsWith('.html')) return [{ code: src, lineaBase: 0, inicio: 0 }];
    const limpio = src
        .replace(/<!--[\s\S]*?-->/g, blanquear)
        .replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, a, c, e) => a + blanquear(c) + e);
    const out = [];
    const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(limpio)) !== null) {
        const atributos = m[1] || '';
        if (/\bsrc\s*=/.test(atributos)) continue;
        const t = /type\s*=\s*["']?([^"'\s>]+)/i.exec(atributos);
        const tipo = t ? t[1].toLowerCase() : '';
        if (tipo && tipo !== 'module' && tipo !== 'text/javascript' && tipo !== 'application/javascript') continue;
        const inicio = m.index + m[0].indexOf('>') + 1;
        out.push({
            code: src.slice(inicio, inicio + m[2].length),
            lineaBase: src.slice(0, inicio).split('\n').length - 1,
            inicio,
        });
    }
    return out;
}

/**
 * El fichero entero con los comentarios blanqueados (los del HTML y los de cada bloque de
 * JavaScript), con las mismas posiciones y líneas. Es lo que se le pasa a una expresión regular
 * cuando se quiere que un comentario que CITA un nombre no cuente como un uso.
 *
 * @returns {{ texto: string, sinParsear: string[] }}  `sinParsear`: los bloques que no se
 *          pudieron parsear (sus comentarios JS siguen dentro del texto).
 */
function textoSinComentarios(rel) {
    const src = leer(rel);
    let texto = src.replace(/<!--[\s\S]*?-->/g, rel.endsWith('.html') ? blanquear : (c) => c);
    const sinParsear = [];
    for (const b of bloques(rel, src)) {
        const p = parsear(b.code);
        if (!p) { sinParsear.push(`${rel}: bloque en la línea ${b.lineaBase + 1}`); continue; }
        for (const c of p.comentarios) {
            texto = texto.slice(0, b.inicio + c.start) + blanquear(texto.slice(b.inicio + c.start, b.inicio + c.end)) + texto.slice(b.inicio + c.end);
        }
    }
    return { texto, sinParsear };
}

/** Las rutas de los `<script src>` locales de una página. */
function scriptsConSrc(rel, src = leer(rel)) {
    const limpio = src.replace(/<!--[\s\S]*?-->/g, blanquear);
    const out = [];
    for (const m of limpio.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) out.push(m[1]);
    return out;
}

/**
 * Parsea un bloque como módulo y, si no es válido como tal, como script clásico.
 * @returns {{ ast: object, comentarios: object[] } | null}
 */
function parsear(code) {
    for (const sourceType of ['module', 'script']) {
        const comentarios = [];
        try {
            const ast = acorn.parse(code, { ...OPCIONES_ACORN, sourceType, onComment: comentarios });
            return { ast, comentarios };
        } catch { /* se prueba el otro modo */ }
    }
    return null;
}

/** El código con los comentarios blanqueados (mismas posiciones y líneas). */
function sinComentarios(code, comentarios) {
    let out = '';
    let pos = 0;
    for (const c of comentarios) {
        out += code.slice(pos, c.start) + blanquear(code.slice(c.start, c.end));
        pos = c.end;
    }
    return out + code.slice(pos);
}

/**
 * Los identificadores de un bloque (tokens `name`, sin contar comentarios ni cadenas) y cuántas
 * veces aparece cada uno. null si el bloque no tokeniza ni como módulo ni como script.
 */
function identificadores(code) {
    for (const sourceType of ['module', 'script']) {
        const cuenta = new Map();
        try {
            for (const t of acorn.tokenizer(code, { ...OPCIONES_ACORN, sourceType })) {
                if (t.type.label === 'name') cuenta.set(t.value, (cuenta.get(t.value) || 0) + 1);
            }
            return cuenta;
        } catch { /* se prueba el otro modo */ }
    }
    return null;
}

/** La suma de `identificadores` de todos los bloques de un fichero; null si alguno no tokeniza. */
function identificadoresDeFichero(rel) {
    const total = new Map();
    for (const { code } of bloques(rel)) {
        const c = identificadores(code);
        if (!c) return null;
        for (const [k, v] of c) total.set(k, (total.get(k) || 0) + v);
    }
    return total;
}

/**
 * Los exports con nombre de un módulo ES.
 * @returns {{ nombre: string, linea: number, base: number }[]}  `base` es cuántas veces aparece
 *          el nombre solo por declararlo y exportarlo (1 en `export const x`, 2 en `export { x }`).
 *          null si el módulo no parsea.
 */
function exportsDe(rel) {
    const p = parsear(leer(rel));
    if (!p) return null;
    const out = [];
    for (const n of p.ast.body) {
        if (n.type !== 'ExportNamedDeclaration') continue;
        const linea = n.loc.start.line;
        const d = n.declaration;
        if (d && d.id) out.push({ nombre: d.id.name, linea, base: 1 });
        if (d && d.declarations) for (const x of d.declarations) if (x.id.type === 'Identifier') out.push({ nombre: x.id.name, linea, base: 1 });
        for (const sp of n.specifiers) out.push({ nombre: sp.exported.name || sp.exported.value, linea, base: 2 });
    }
    return out;
}

/** Cuántas claves de objeto (`nombre:` o abreviadas) hay con cada nombre en un módulo: sirve para descontar el objeto-API que publica. */
function clavesDeObjeto(rel) {
    const p = parsear(leer(rel));
    const cuenta = {};
    if (!p) return cuenta;
    recorrer(p.ast, (n) => {
        if (n.type === 'Property' && !n.computed && n.key && n.key.type === 'Identifier') cuenta[n.key.name] = (cuenta[n.key.name] || 0) + 1;
    });
    return cuenta;
}

/** Recorre el árbol llamando a `visitar(nodo, padres)`; `padres` va del más lejano al más cercano. */
function recorrer(nodo, visitar, padres = []) {
    if (!nodo || typeof nodo.type !== 'string') return;
    visitar(nodo, padres);
    const siguientes = padres.concat(nodo);
    for (const k of Object.keys(nodo)) {
        if (k === 'type' || k === 'start' || k === 'end' || k === 'loc') continue;
        const v = nodo[k];
        if (Array.isArray(v)) {
            for (const c of v) if (c && typeof c.type === 'string') recorrer(c, visitar, siguientes);
        } else if (v && typeof v.type === 'string') {
            recorrer(v, visitar, siguientes);
        }
    }
}

/**
 * Ruta de un acceso por miembros: `a.b.c` → ['a','b','c'], con `?.` incluido. Un `globalThis.` o
 * `window.` inicial se descarta (`globalThis.X.Y` se lee como `X.Y`). Devuelve null si algo del
 * camino no es un nombre fijo (clave computada, llamada…).
 */
function rutaDe(n) {
    if (!n) return null;
    if (n.type === 'Identifier') return [n.name];
    if (n.type === 'ChainExpression') return rutaDe(n.expression);
    if (n.type === 'MemberExpression' && !n.computed && n.property.type === 'Identifier') {
        const o = rutaDe(n.object);
        if (!o) return null;
        if (o.length === 1 && (o[0] === 'globalThis' || o[0] === 'window' || o[0] === 'self')) return [n.property.name];
        return o.concat(n.property.name);
    }
    return null;
}

/** La ruta como texto, o el tipo de nodo si no es un nombre fijo. */
function textoDe(n) {
    const r = rutaDe(n);
    return r ? r.join('.') : (n && n.type) || '?';
}

/**
 * Resuelve una ruta local a un fichero del repo; null si apunta fuera (http…, paquete) o no existe.
 *
 * En un `import` solo cuentan las rutas que empiezan por `.` o `/` (lo demás es un paquete). En
 * un `<script src>` una ruta sin punto (`js/x.js`) es relativa a la página: `permitirSimple`.
 */
function resolverImport(desde, especificacion, { permitirSimple = false } = {}) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(especificacion) || especificacion.startsWith('//')) return null;
    if (!permitirSimple && !especificacion.startsWith('.') && !especificacion.startsWith('/')) return null;
    const limpia = especificacion.split(/[?#]/)[0];
    const base = limpia.startsWith('/') ? limpia.slice(1) : path.posix.join(path.posix.dirname(desde), limpia);
    const rel = path.posix.normalize(base);
    return existe(rel) ? rel : null;
}

/**
 * Los ficheros que ejecuta una página: ella misma, sus `<script src>` locales y, de forma
 * recursiva, todo lo que importa (estático, o dinámico con la ruta literal).
 *
 * @returns {{ ficheros: Set<string>, residuo: string[] }}
 */
function cierreDeFrame(pagina) {
    const ficheros = new Set([pagina]);
    const residuo = [];
    const pendientes = [];

    const encolar = (rel) => { if (rel && !ficheros.has(rel)) { ficheros.add(rel); pendientes.push(rel); } };

    const leerImports = (rel) => {
        if (rel.startsWith('js/vendor/')) return; // código ajeno, minificado: no se analiza
        for (const { code, lineaBase } of bloques(rel)) {
            const p = parsear(code);
            if (!p) { residuo.push(`${rel}: bloque sin parsear`); continue; }
            recorrer(p.ast, (n) => {
                if ((n.type === 'ImportDeclaration' || n.type === 'ExportAllDeclaration'
                    || (n.type === 'ExportNamedDeclaration' && n.source)) && n.source) {
                    encolar(resolverImport(rel, n.source.value));
                } else if (n.type === 'ImportExpression') {
                    const s = n.source;
                    if (s.type === 'Literal' && typeof s.value === 'string') {
                        encolar(resolverImport(rel, s.value));
                    } else if (s.type === 'TemplateLiteral' && s.expressions.length === 0) {
                        encolar(resolverImport(rel, s.quasis[0].value.cooked));
                    } else {
                        // `./js/x.js?v=${Date.now()}`: la parte fija es la ruta y la variable es la caché.
                        const fija = s.type === 'TemplateLiteral' ? resolverImport(rel, s.quasis[0].value.cooked) : null;
                        if (fija) encolar(fija);
                        else residuo.push(`${rel}:${n.loc.start.line + lineaBase} import() con ruta no literal`);
                    }
                }
            });
        }
    };

    for (const s of scriptsConSrc(pagina)) encolar(resolverImport(pagina, s, { permitirSimple: true }));
    leerImports(pagina);
    while (pendientes.length) leerImports(pendientes.pop());
    return { ficheros, residuo };
}

module.exports = {
    RAIZ,
    MODULOS_DE_DATOS,
    leer,
    existe,
    paginas,
    modulos,
    blanquear,
    bloques,
    textoSinComentarios,
    scriptsConSrc,
    parsear,
    sinComentarios,
    identificadores,
    identificadoresDeFichero,
    exportsDe,
    clavesDeObjeto,
    recorrer,
    rutaDe,
    textoDe,
    resolverImport,
    cierreDeFrame,
};
