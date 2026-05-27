/**
 * fix-handler-cc.mjs
 * Extracts inline async (mensaje) => { ... } handlers from _regCtrl_* functions
 * into named async handler functions, replacing inline arrows with named references.
 *
 * Each handler: registrarControladorSeguro(TIPOS_MENSAJE.A.B.C, async (mensaje) => { BODY })
 * Becomes:
 *   async function _hdl_A_B_C(mensaje) { BODY }
 *   registrarControladorSeguro(TIPOS_MENSAJE.A.B.C, _hdl_A_B_C)
 *
 * This drops the CC of each _regCtrl_* function close to 1 (just registrations).
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');
const NL = src.includes('\r\n') ? '\r\n' : '\n';
const lines = src.split(NL);

// Find all _regCtrl_* function ranges
const REGCTRL_PATTERN = /^\s+function (_regCtrl_\w+)\(TIPOS_MENSAJE\)/;
const regCtrlFunctions = [];
for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(REGCTRL_PATTERN);
    if (!m) continue;
    // Find the end of this function by brace counting
    let braces = 0, end = -1, firstBrace = false;
    for (let j = i; j < lines.length; j++) {
        for (const ch of (lines[j] || '')) {
            if (ch === '{') { braces++; firstBrace = true; }
            else if (ch === '}') {
                braces--;
                if (firstBrace && braces === 0) { end = j; break; }
            }
        }
        if (end >= 0) break;
    }
    regCtrlFunctions.push({ name: m[1], lineStart: i, lineEnd: end });
    console.log(`Found ${m[1]} at lines ${i+1}–${end+1}`);
}

console.log(`Total _regCtrl_ functions: ${regCtrlFunctions.length}`);

// For each registrarControladorSeguro call, extract handler name from the TIPOS_MENSAJE key
// Pattern: registrarControladorSeguro(TIPOS_MENSAJE.A.B[.C], async (mensaje) =>
const HANDLER_PATTERN = /registrarControladorSeguro\((TIPOS_MENSAJE(?:\.\w+)+),\s*async\s*\((\w+)\)\s*=>/;

// Collection of all handlers to extract
const handlers = []; // { fnName, lineStart (of the registrarControladorSeguro call), arrowStart, arrowEnd, paramName, tipoPath }

for (const fn of regCtrlFunctions) {
    for (let i = fn.lineStart; i <= fn.lineEnd; i++) {
        const line = lines[i] || '';
        const m = line.match(HANDLER_PATTERN);
        if (!m) continue;

        const tipoPath = m[1]; // e.g. TIPOS_MENSAJE.NAVEGACION.GPS.ACTIVAR
        const paramName = m[2]; // e.g. 'mensaje'

        // Generate a clean function name from the TIPOS_MENSAJE path
        // TIPOS_MENSAJE.NAVEGACION.GPS.ACTIVAR → _hdl_NAVEGACION_GPS_ACTIVAR
        const parts = tipoPath.replace('TIPOS_MENSAJE.', '').split('.');
        const fnName = '_hdl_' + parts.join('_');

        // Find the opening { of the arrow function body
        // It may be on the same line as the registrarControladorSeguro call or the next
        let arrowBodyStart = -1;
        let depth = 0;
        let foundArrow = false;
        let arrowEnd = -1;
        let regCallEnd = -1; // The closing ); of the registrarControladorSeguro call

        // Scan from line i forward to find the arrow body
        outer: for (let j = i; j <= fn.lineEnd + 5; j++) {
            const l = lines[j] || '';
            for (let k = 0; k < l.length; k++) {
                const ch = l[k];
                // Detect the => followed by {
                if (!foundArrow && l.slice(k, k+2) === '=>') {
                    foundArrow = true;
                    k++; // skip >
                    continue;
                }
                if (foundArrow && ch === '{' && depth === 0) {
                    arrowBodyStart = j;
                    depth = 1;
                    continue;
                }
                if (arrowBodyStart >= 0) {
                    if (ch === '{') depth++;
                    else if (ch === '}') {
                        depth--;
                        if (depth === 0) {
                            arrowEnd = j;
                            // Now find the closing ); of the registrarControladorSeguro call
                            // It should be on the same line as the closing } or the next line
                            regCallEnd = j;
                            break outer;
                        }
                    }
                }
            }
        }

        if (arrowBodyStart < 0 || arrowEnd < 0) {
            console.warn(`WARNING: Could not find arrow body for ${tipoPath} at line ${i+1}`);
            continue;
        }

        handlers.push({
            fnName,
            tipoPath,
            paramName,
            regLineStart: i,
            arrowBodyStart,
            arrowEnd,
            regCallEnd,
            parentFn: fn.name
        });
        console.log(`  Handler ${fnName} at lines ${i+1}–${arrowEnd+1}`);
    }
}

console.log(`\nTotal handlers found: ${handlers.length}`);

// Verify no duplicate fnNames
const names = handlers.map(h => h.fnName);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
if (dupes.length > 0) {
    console.error('DUPLICATE handler names:', [...new Set(dupes)]);
    process.exit(1);
}

// Extract indent from the registrarControladorSeguro call line (usually 8 spaces)
// Handler functions will be at 8-space indent
function getBodyLines(h) {
    return lines.slice(h.arrowBodyStart, h.arrowEnd + 1);
}

// Build a handler function declaration
// Body is at the indentation level it currently is inside the arrow function
function buildHandlerFn(h) {
    const bodyLines = getBodyLines(h);
    // The body is the content BETWEEN the opening { and closing }
    // bodyLines[0] contains the opening {, bodyLines[last] contains the closing }
    // We want to keep the inner content and wrap in async function
    const innerLines = bodyLines.slice(1, bodyLines.length - 1);
    return [
        `        async function ${h.fnName}(${h.paramName}) {`,
        ...innerLines,
        `        }`,
    ].join(NL);
}

// For each _regCtrl_* function, build the new version (just registrations, no inline bodies)
// Strategy: process bottom-to-top within each regCtrl function to avoid offset shifts

// Sort all handlers in reverse order (bottom to top) for safe replacement
const sortedHandlers = [...handlers].sort((a, b) => b.regLineStart - a.regLineStart);

// Apply replacements to src directly
// For each handler: replace the inline arrow body with just the function name reference
// The registrarControladorSeguro call goes from regLineStart to arrowEnd
// Replace: "registrarControladorSeguro(TIPOS_MENSAJE.X.Y, async (mensaje) => {\n...BODY...\n        })"
// With:    "registrarControladorSeguro(TIPOS_MENSAJE.X.Y, X_Y_handler)"

for (const h of sortedHandlers) {
    const bodyLines = getBodyLines(h);
    const lastBodyLine = bodyLines[bodyLines.length - 1];
    // The closing of the handler is: }); on its own or } followed by );
    // Find the ); that closes the registrarControladorSeguro call
    const regLine = lines[h.regLineStart];

    // Build old text: from registrarControladorSeguro(..., async (mensaje) => { to });
    const oldLines = lines.slice(h.regLineStart, h.arrowEnd + 1);
    const oldText = oldLines.join(NL);

    // Build new text: registrarControladorSeguro(..., handlerFnName);
    // Extract the indent from the registrarControladorSeguro line
    const indent = regLine.match(/^(\s*)/)[1];
    const newText = `${indent}globalThis.registrarControladorSeguro(${h.tipoPath}, ${h.fnName});`;

    if (!src.includes(oldText)) {
        console.warn(`WARNING: Could not find exact text for ${h.fnName} — skipping`);
        continue;
    }

    src = src.replace(oldText, newText);
    console.log(`  Replaced inline handler ${h.fnName} with call`);
}

// Now insert all handler function declarations before their parent _regCtrl_* function
// Group by parentFn, then find the current location of each parent function in src
// Since we've done replacements, we need to re-split src to find current line numbers

const newLines = src.split(NL);

// For each regCtrl function, find its current location and insert helpers before it
// Process in reverse order to maintain line offsets
const insertionGroups = {};
for (const h of handlers) {
    if (!insertionGroups[h.parentFn]) insertionGroups[h.parentFn] = [];
    insertionGroups[h.parentFn].push(h);
}

// Sort parent functions in reverse order by original line number
const parentFnOrder = regCtrlFunctions.slice().reverse();

for (const fn of parentFnOrder) {
    const fnHandlers = insertionGroups[fn.name];
    if (!fnHandlers || fnHandlers.length === 0) continue;

    // Find current location of this function
    const fnDecl = `        function ${fn.name}(TIPOS_MENSAJE) {`;
    if (!src.includes(fnDecl)) {
        console.warn(`WARNING: Cannot find ${fn.name} in current src`);
        continue;
    }

    // Build all handler functions for this group
    const helperBlocks = fnHandlers.map(h => buildHandlerFn(h));
    const insertion = helperBlocks.join(NL + NL) + NL + NL;

    src = src.replace(fnDecl, insertion + fnDecl);
    console.log(`Inserted ${fnHandlers.length} handler functions before ${fn.name}`);
}

writeFileSync(FILE, src, 'utf8');
console.log('\n=== fix-handler-cc completado ===');
console.log(`Extracted ${handlers.length} handlers total`);

// Verification
const finalSrc = readFileSync(FILE, 'utf8');
for (const h of handlers) {
    const found = finalSrc.includes(`async function ${h.fnName}(`);
    console.log(`  ${h.fnName}: ${found ? 'OK' : 'MISSING!'}`);
}
