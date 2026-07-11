#!/usr/bin/env node
/**
 * verificar-mensajeria.js — Cruza cada tipo de TIPOS_MENSAJE con quién lo emite
 * y quién lo escucha, para detectar tipos huérfanos (EJE 4 / EJE 13 de la
 * metodología de auditoría, ver docs/GUIA-COMPLETA.md §35.4 y §35.13).
 *
 * Uso:
 *   node tools/verificar-mensajeria.js            → informe completo
 *   node tools/verificar-mensajeria.js --quiet     → solo huérfanos (para CI)
 *
 * Qué hace:
 *   1. Aplana TIPOS_MENSAJE de js/constants.js (incluye categorías anidadas
 *      como NAVEGACION.GPS.*).
 *   2. Para cada tipo, busca en todo el proyecto (js/**\/*.js y *.html raíz)
 *      referencias por ruta de propiedad (.CATEGORIA.NOMBRE) y por valor
 *      literal, clasificando cada aparición como emisor o receptor según el
 *      keyword de mensajería más cercano hacia atrás en el mismo archivo.
 *   3. Reporta tipos con emisor pero sin receptor, con receptor pero sin
 *      emisor, y sin ninguno de los dos.
 *
 * Limitación conocida: la heurística de proximidad no detecta emisión/
 * recepción indirecta (p.ej. `const tipo = TIPOS_MENSAJE.X.Y; enviarMensaje({
 * tipo })` en líneas separadas, o un handler definido antes de registrarse
 * con addEventListener más abajo). Todo lo que este script marca como
 * "huérfano" debe verificarse leyendo el código antes de actuar — no borrar
 * nada solo por esta salida. Ver feedback-audit-no-agents en la memoria del
 * proyecto: los hallazgos automáticos son candidatos a revisar, no hechos.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUIET = process.argv.slice(2).includes('--quiet');

function walk(dir, exts, exclude, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const rel = path.relative(ROOT, full);
        if (exclude.some(ex => rel.startsWith(ex))) continue;
        if (entry.isDirectory()) walk(full, exts, exclude, out);
        else if (exts.includes(path.extname(entry.name))) out.push(full);
    }
    return out;
}

function readNoBom(p) {
    let t = fs.readFileSync(p, 'utf8');
    if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
    return t;
}

// ── Cargar TIPOS_MENSAJE de constants.js (transformación mínima ESM→CJS) ────
function cargarTiposMensaje() {
    let src = readNoBom(path.join(ROOT, 'js/constants.js'));
    src = src.replace(/^export\s+default\s+\{[\s\S]*?\n\};?\s*$/m, '');
    src = src.replace(/^export\s+(const|function|async function)/gm, '$1');
    src += '\nmodule.exports.TIPOS_MENSAJE = TIPOS_MENSAJE;';
    const mod = { exports: {} };
    new Function('module', 'exports', 'require', src)(mod, mod.exports, require); // eslint-disable-line no-new-func
    return mod.exports.TIPOS_MENSAJE;
}

function aplanarTipos(obj, prefijo = []) {
    const out = [];
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') out.push({ dotPath: [...prefijo, k].join('.'), value: v });
        else if (typeof v === 'object' && v !== null) out.push(...aplanarTipos(v, [...prefijo, k]));
    }
    return out;
}

const EMIT_KEYWORDS = ['enviarMensajeConConfirmacion', 'enviarMensaje', 'postMessage', 'broadcastToCapability'];
const RECV_KEYWORDS = ['registrarControladorSeguro', 'registrarControlador', "addEventListener('message'", 'addEventListener("message"'];

function nearestKeywordBefore(text, idx, keywords) {
    let best = null, bestPos = -1;
    for (const kw of keywords) {
        const pos = text.lastIndexOf(kw, idx);
        if (pos > bestPos) { bestPos = pos; best = kw; }
    }
    if (bestPos === -1 || idx - bestPos > 400) return null;
    return best;
}

function main() {
    const files = walk(ROOT, ['.js', '.html'], ['node_modules', 'tests', 'docs', '.git'], []);
    const TIPOS_MENSAJE = cargarTiposMensaje();
    const tipos = aplanarTipos(TIPOS_MENSAJE);

    const contents = files.map(f => ({ file: path.relative(ROOT, f), text: readNoBom(f) }));

    const report = new Map();
    for (const t of tipos) report.set(t.dotPath, { emitters: new Set(), receivers: new Set(), value: t.value });

    for (const { file, text } of contents) {
        for (const t of tipos) {
            const leafParts = t.dotPath.split('.');
            const propPattern = '\\.' + leafParts.join('\\.') + '\\b';
            const patterns = [
                new RegExp(propPattern, 'g'),
                new RegExp(`['"]${t.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
            ];
            for (const re of patterns) {
                let m;
                while ((m = re.exec(text))) {
                    const kwE = nearestKeywordBefore(text, m.index, EMIT_KEYWORDS);
                    const kwR = nearestKeywordBefore(text, m.index, RECV_KEYWORDS);
                    const entry = report.get(t.dotPath);
                    if (kwR && (!kwE || text.lastIndexOf(kwR, m.index) > text.lastIndexOf(kwE, m.index))) {
                        entry.receivers.add(file);
                    } else if (kwE) {
                        entry.emitters.add(file);
                    }
                }
            }
        }
    }

    const sinReceptor = [...report.entries()].filter(([, e]) => e.emitters.size > 0 && e.receivers.size === 0);
    const sinEmisor = [...report.entries()].filter(([, e]) => e.receivers.size > 0 && e.emitters.size === 0);
    const sinNinguno = [...report.entries()].filter(([, e]) => e.emitters.size === 0 && e.receivers.size === 0);
    const conAmbos = tipos.length - sinReceptor.length - sinEmisor.length - sinNinguno.length;

    if (!QUIET) {
        console.log(`Archivos analizados: ${files.length}`);
        console.log(`Tipos de mensaje totales: ${tipos.length} (${conAmbos} con emisor y receptor detectados)\n`);
    }

    console.log('=== Tipos SIN receptor detectado (se emiten pero nadie escucha) ===');
    for (const [dotPath, e] of sinReceptor) {
        console.log(`  ${dotPath} (${e.value})  emisores: ${[...e.emitters].join(', ')}`);
    }
    console.log('\n=== Tipos SIN emisor detectado (hay handler pero nadie lo emite) ===');
    for (const [dotPath, e] of sinEmisor) {
        console.log(`  ${dotPath} (${e.value})  receptores: ${[...e.receivers].join(', ')}`);
    }
    if (!QUIET) {
        console.log('\n=== Tipos SIN ninguna referencia detectada (candidatos a tipo muerto o falso positivo de la heurística) ===');
        for (const [dotPath, e] of sinNinguno) {
            console.log(`  ${dotPath} (${e.value})`);
        }
    }

    console.log(`\nIMPORTANTE: verifica cada hallazgo leyendo el código real antes de actuar.`);
    console.log(`Esta heurística tiene falsos positivos conocidos (indirección vía variable,`);
    console.log(`handler registrado en una línea posterior a su definición). Ver cabecera del script.`);
}

main();
