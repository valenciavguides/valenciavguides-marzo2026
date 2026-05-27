/**
 * fix-regCtrl-cc.mjs
 * Reduces CC of registrarControladoresScript2 by extracting handler
 * registrations into 9 named group functions.
 *
 * Outer IIFE goes from CC~58 to CC~4.
 * Each group function has CC = number of arrow handlers (2-7 each).
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');
const NL = src.includes('\r\n') ? '\r\n' : '\n';
const lines = src.split(NL);

// Map TIPOS_MENSAJE key pattern → group name
const GROUPS = [
    { name: '_regCtrl_Reto',                keys: ['RETO.'] },
    { name: '_regCtrl_GPS',                 keys: ['NAVEGACION.GPS.'] },
    { name: '_regCtrl_NavegacionMovimiento',keys: ['NAVEGACION.CENTRAR', 'NAVEGACION.ACTUALIZAR', 'NAVEGACION.MOSTRAR', 'NAVEGACION.CAMBIO_PARADA', 'NAVEGACION.LLEGADA'] },
    { name: '_regCtrl_NavegacionEventos',   keys: ['NAVEGACION.USUARIO_FUERA', 'NAVEGACION.PARADA_COMPLETADA'] },
    { name: '_regCtrl_Audio',               keys: ['AUDIO.'] },
    { name: '_regCtrl_DatosRespuestas',     keys: ['DATOS.RESPUESTA', 'DATOS.COORDENADAS_CARGADAS', 'DATOS.AUDIOS_CARGADOS', 'DATOS.RETOS_CARGADOS', 'DATOS.TEXTOS_CARGADOS'] },
    { name: '_regCtrl_DatosSolicitudes',    keys: ['DATOS.SOLICITAR', 'MONITOREO.'] },
    { name: '_regCtrl_Seleccion',           keys: ['SELECCION.'] },
    { name: '_regCtrl_AventuraYTiempo',     keys: ['AVENTURA.', 'TEMPORIZADOR.'] },
];

function matchGroup(tipoStr) {
    for (const g of GROUPS) {
        for (const k of g.keys) {
            if (tipoStr.includes(k)) return g.name;
        }
    }
    return null;
}

// Find IIFE start and end
const iifeStartLine = lines.findIndex(l => l.includes('(async function registrarControladoresScript2'));
if (iifeStartLine < 0) { console.error('ABORT: IIFE not found'); process.exit(1); }
console.log('IIFE starts at line', iifeStartLine + 1);

// Find the end of the IIFE (matching closing brace)
let braces = 0, iifeEndLine = -1;
let firstBrace = false;
for (let j = iifeStartLine; j < lines.length; j++) {
    for (const ch of (lines[j] || '')) {
        if (ch === '{') { braces++; firstBrace = true; }
        else if (ch === '}') { braces--; if (firstBrace && braces === 0) { iifeEndLine = j; break; } }
    }
    if (iifeEndLine >= 0) break;
}
console.log('IIFE ends at line', iifeEndLine + 1);

// Find each handler call: globalThis.registrarControladorSeguro(TIPOS_MENSAJE...
// Returns array of { lineStart, lineEnd, tipoStr, bodyText }
const handlers = [];
for (let i = iifeStartLine; i <= iifeEndLine; i++) {
    const line = lines[i] || '';
    if (!line.includes('globalThis.registrarControladorSeguro(TIPOS_MENSAJE')) continue;

    // Extract the tipo string from this line
    const m = line.match(/registrarControladorSeguro\((TIPOS_MENSAJE[^,]+)/);
    if (!m) continue;
    const tipoStr = m[1].trim();

    // Find the matching closing ");" for this call
    let depth = 0;
    let end = -1;
    for (let j = i; j <= iifeEndLine; j++) {
        for (const ch of (lines[j] || '')) {
            if (ch === '(') depth++;
            else if (ch === ')') {
                depth--;
                if (depth === 0) { end = j; break; }
            }
        }
        if (end >= 0) break;
    }

    if (end < 0) {
        console.warn('WARNING: Could not find end for handler at line', i + 1, tipoStr);
        continue;
    }

    handlers.push({ lineStart: i, lineEnd: end, tipoStr });
}

console.log('Found', handlers.length, 'handlers');

// Build group → [handler] map
const groupMap = {};
for (const g of GROUPS) groupMap[g.name] = [];

for (const h of handlers) {
    const g = matchGroup(h.tipoStr);
    if (!g) { console.warn('WARNING: no group for', h.tipoStr); continue; }
    groupMap[g].push(h);
}

// Report grouping
for (const g of GROUPS) {
    console.log(g.name, ':', groupMap[g.name].length, 'handlers');
}

// Find setup section: everything from IIFE opening to first handler line
const firstHandlerLine = handlers[0].lineStart;

// Find SETUP code: everything inside the IIFE before the first handler
// Setup ends at the blank line or comment just before the first handler
// Setup starts at the IIFE's opening {
const iifeBodyStart = iifeStartLine; // first line of the IIFE
const setupLines = lines.slice(iifeStartLine + 1, firstHandlerLine);

// Also find the setup comment lines just before the first handler (omit the divider comment block)
// Trim trailing comment/blank lines from setup
let setupEnd = setupLines.length;
while (setupEnd > 0) {
    const l = setupLines[setupEnd - 1].trim();
    if (l === '' || l.startsWith('//') || l.startsWith('/*') || l === '*' || l === '*/') {
        setupEnd--;
    } else break;
}
const setupCode = setupLines.slice(0, setupEnd).join(NL);

// Generate the new IIFE content
// Setup: extract into _setupRegistrarControladores
const setupFn = `        async function _setupRegistrarControladores() {${NL}${setupLines.slice(0, setupEnd).join(NL)}${NL}        }`;

// Generate each group function
// Each handler block: lines from h.lineStart to h.lineEnd (inclusive)
function buildGroupFn(groupName, groupHandlers) {
    const handlerBlocks = groupHandlers.map(h => {
        return lines.slice(h.lineStart, h.lineEnd + 1).join(NL);
    });
    const body = handlerBlocks.join(NL + NL);
    return `        function ${groupName}(TIPOS_MENSAJE) {${NL}${body}${NL}        }`;
}

const groupFunctions = GROUPS.map(g => buildGroupFn(g.name, groupMap[g.name]));

// Build new IIFE body
const newIIFE = `        (async function registrarControladoresScript2() {${NL}            await _setupRegistrarControladores();${NL}            const TIPOS_MENSAJE = globalThis.TIPOS_MENSAJE || TIPOS_MENSAJE_S2;${NL}            logger.info('[SCRIPT2] 🚀 Registrando controladores adicionales de Script 2...');${NL}${GROUPS.map(g => `            ${g.name}(TIPOS_MENSAJE);`).join(NL)}${NL}        })();`;

// Now build the full replacement
// The section to replace: from iifeStartLine to iifeEndLine (inclusive)
const toReplace = lines.slice(iifeStartLine, iifeEndLine + 1).join(NL);

// Find the line just before the IIFE (to insert helpers before it)
// Find the existing setup comment
const commentLine = iifeStartLine > 0 ? lines[iifeStartLine - 1] : '';

// Build replacement: setup function + group functions + new IIFE
const allHelpers = `${setupFn}${NL}${NL}${groupFunctions.join(NL + NL)}${NL}${NL}`;
const replacement = allHelpers + newIIFE;

// Apply replacement
if (!src.includes(toReplace)) {
    console.error('ABORT: Could not find IIFE text to replace');
    console.error('First 200 chars:', toReplace.slice(0, 200));
    process.exit(1);
}

src = src.replace(toReplace, replacement);
writeFileSync(FILE, src, 'utf8');
console.log('\n=== fix-regCtrl-cc completado ===');

// Verification
const newSrc = readFileSync(FILE, 'utf8');
const newLines = newSrc.split(NL);
for (const g of GROUPS) {
    const idx = newLines.findIndex(l => l.includes('function ' + g.name));
    console.log(g.name, idx >= 0 ? 'at line ' + (idx + 1) : 'NOT FOUND');
}
const iifeIdx = newLines.findIndex(l => l.includes('async function registrarControladoresScript2'));
console.log('registrarControladoresScript2 at line', iifeIdx + 1);
