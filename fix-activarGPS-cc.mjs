/**
 * fix-activarGPS-cc.mjs
 * Reduces the cognitive complexity of activarGPS (S3776) by extracting 4 helper
 * functions. Uses bottom-to-top replacement so character positions remain valid.
 *
 * Helpers extracted:
 *  1. _gpsInicializarPreActivacion  – pre-activation checks (3 try/catch blocks, ~38 lines)
 *  2. _obtenerPosicionInicialGPS    – initial getCurrentPosition attempts loop (~83 lines)
 *  3. _finalizarActivacionGPS       – post-watchPosition steps (immediate fix + notify, ~63 lines)
 *  4. _configurarDiagnosticoGPS     – globalThis.diagnosticarGPS assignment (~107 lines)
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');
const NL = src.includes('\r\n') ? '\r\n' : '\n';

// Remove `delta` leading spaces from every line in `code`
function deIndent(code, delta) {
    const prefix = ' '.repeat(delta);
    return code.split(NL).map(l => (l.startsWith(prefix) ? l.slice(delta) : l)).join(NL);
}

// Wrap extracted body into a function declaration at 8-space indent
// body is at 16-space; de-indent by 4 → 12-space inside the helper
function wrapHelper(decl, body) {
    const inner = deIndent(body, 4);
    return `        ${decl} {${NL}${inner}${NL}        }${NL}`;
}

let fixes = 0;

// ──────────────────────────────────────────────────────────────────────────────
// Anchors – must all be unique in the file
// ──────────────────────────────────────────────────────────────────────────────

// Section D — diagnosticarGPS assignment (BOTTOM – replace first to avoid shifts)
const D_S = `                // ✅ FUNCIÓN DE DIAGNÓSTICO GPS: Exponer en window para uso desde consola`;
const D_E = `                    logger.info('%cLlama diagnosticarGPS() de nuevo para actualizar el estado', 'color: #888888; font-style: italic');${NL}                };`;

// Section C — finalization (immediate getCurrentPosition + notify + sync global)
const C_S = `                // Intentar obtener ubicación inmediata${NL}                try {`;
const C_E = `                globalThis.estadoPadre.gps = est.gps;`;

// Section B — initial position attempts loop
const B_S = `                // Try several quick high-accuracy getCurrentPosition attempts (with backoff) to obtain an immediate usable fix`;
const B_E = `                } catch (e) {${NL}                    logger.debug(\`\${logPrefix} getCurrentPosition iniciales fallaron:\`, e);${NL}                }`;

// Section A — pre-activation checks (3 try/catch blocks) + est.gps reset
const A_S = `                // Antes de intentar fallback a hijo2, esperar brevemente a que los hijos estén listos`;
const A_E = `                // Runtime-safe estado + gps subobj (re-using 'est' definido arriba)${NL}                est.gps = est.gps || {};`;

// Marker for helper insertion point (just before activarGPS)
const GPS_FN = `        async function activarGPS() {`;

// ──────────────────────────────────────────────────────────────────────────────
// Validate anchors
// ──────────────────────────────────────────────────────────────────────────────
for (const [label, anchor] of [['D_S', D_S], ['D_E', D_E], ['C_S', C_S], ['C_E', C_E],
    ['B_S', B_S], ['B_E', B_E], ['A_S', A_S], ['A_E', A_E], ['GPS_FN', GPS_FN]]) {
    if (!src.includes(anchor)) {
        console.error(`ABORT: anchor "${label}" not found:\n  ${anchor.slice(0, 100)}`);
        process.exit(1);
    }
}
console.log('All anchors found ✓');

// ──────────────────────────────────────────────────────────────────────────────
// Extract sections (find by anchor positions, BEFORE any replacements)
// ──────────────────────────────────────────────────────────────────────────────

function extractSection(startAnchor, endAnchor) {
    const s = src.indexOf(startAnchor);
    const e = src.indexOf(endAnchor, s) + endAnchor.length;
    return { text: src.slice(s, e), s, e };
}

const secA = extractSection(A_S, A_E);
const secB = extractSection(B_S, B_E);
const secC = extractSection(C_S, C_E);
const secD = extractSection(D_S, D_E);

console.log(`Sections extracted: A=${secA.text.split(NL).length}L, B=${secB.text.split(NL).length}L, C=${secC.text.split(NL).length}L, D=${secD.text.split(NL).length}L`);

// ──────────────────────────────────────────────────────────────────────────────
// Build helper functions (wrapped + de-indented by 4)
// ──────────────────────────────────────────────────────────────────────────────

const helperA = wrapHelper('async function _gpsInicializarPreActivacion(est, logPrefix)', secA.text);
const helperB = wrapHelper('async function _obtenerPosicionInicialGPS(est, logPrefix)', secB.text);
const helperC = wrapHelper('async function _finalizarActivacionGPS(est, logPrefix, resolveActivacion)', secC.text);
const helperD = wrapHelper('function _configurarDiagnosticoGPS(est)', secD.text);

// ──────────────────────────────────────────────────────────────────────────────
// Apply replacements BOTTOM → TOP (D, C, B, A) to keep offsets valid
// ──────────────────────────────────────────────────────────────────────────────

// D → replace diagnosticarGPS block with helper call
if (src.includes(secD.text)) {
    src = src.replace(secD.text, `                _configurarDiagnosticoGPS(est);`);
    fixes++;
    console.log('Section D replaced ✓');
} else {
    console.error('WARN: Section D text changed after extraction — check CRLF handling');
}

// C → replace finalization block with helper call
if (src.includes(secC.text)) {
    src = src.replace(secC.text, `                await _finalizarActivacionGPS(est, logPrefix, resolveActivacion);`);
    fixes++;
    console.log('Section C replaced ✓');
} else {
    console.error('WARN: Section C text changed — cannot replace');
}

// B → replace initial position block with helper call
if (src.includes(secB.text)) {
    src = src.replace(secB.text, `                await _obtenerPosicionInicialGPS(est, logPrefix);`);
    fixes++;
    console.log('Section B replaced ✓');
} else {
    console.error('WARN: Section B text changed — cannot replace');
}

// A → replace pre-activation checks with helper call
if (src.includes(secA.text)) {
    src = src.replace(secA.text, `                await _gpsInicializarPreActivacion(est, logPrefix);`);
    fixes++;
    console.log('Section A replaced ✓');
} else {
    console.error('WARN: Section A text changed — cannot replace');
}

// Insert all helpers before activarGPS
const allHelpers = `${helperA}${NL}${helperB}${NL}${helperC}${NL}${helperD}${NL}`;
src = src.replace(GPS_FN, `${allHelpers}${GPS_FN}`);
console.log('Helpers inserted before activarGPS ✓');

// ──────────────────────────────────────────────────────────────────────────────
// Write result
// ──────────────────────────────────────────────────────────────────────────────
writeFileSync(FILE, src, 'utf8');

console.log(`\n=== fix-activarGPS-cc completado ===`);
console.log(`  Secciones reemplazadas: ${fixes}/4`);

// Quick sanity check
const lines = src.split(NL);
const fnLine = lines.findIndex(l => l.includes('async function activarGPS()'));
console.log(`  activarGPS ahora en línea ~${fnLine + 1}`);
const helperLines = [
    '_gpsInicializarPreActivacion',
    '_obtenerPosicionInicialGPS',
    '_finalizarActivacionGPS',
    '_configurarDiagnosticoGPS',
].map(name => {
    const idx = lines.findIndex(l => l.includes(`function ${name}`));
    return `  ${name}: línea ~${idx + 1}`;
});
helperLines.forEach(l => console.log(l));
