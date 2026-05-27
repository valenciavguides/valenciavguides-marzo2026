/**
 * fix-cc-gps-resto.mjs
 * Extracts activarGPS watchPosition callbacks to named helpers.
 * Uses anchor-based extraction, NL-aware.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');
const NL = src.includes('\r\n') ? '\r\n' : '\n';

// ─────────────────────────────────────────────────────────────────────────────
// Find the watchPosition block by line scanning
// ─────────────────────────────────────────────────────────────────────────────
const lines = src.split(NL);

// Find "// Iniciar watchPosition" line
const wpCommentIdx = lines.findIndex(l => l.includes('// Iniciar watchPosition'));
if (wpCommentIdx < 0) { console.error('ABORT: watchPosition comment not found'); process.exit(1); }
console.log('watchPosition block starts at line', wpCommentIdx + 1);

// Find the "est.gps.watchId = navigator.geolocation.watchPosition(" line
const wpCallIdx = lines.findIndex((l, i) => i > wpCommentIdx && l.includes('est.gps.watchId = navigator.geolocation.watchPosition('));
if (wpCallIdx < 0) { console.error('ABORT: watchPosition call not found'); process.exit(1); }
console.log('watchPosition call at line', wpCallIdx + 1);

// Find "// Success callback" line just after
const successCommentIdx = lines.findIndex((l, i) => i > wpCallIdx && l.trim() === '// Success callback');
if (successCommentIdx < 0) { console.error('ABORT: success comment not found'); process.exit(1); }

// Find "// Error callback" line
const errorCommentIdx = lines.findIndex((l, i) => i > successCommentIdx && l.trim() === '// Error callback');
if (errorCommentIdx < 0) { console.error('ABORT: error comment not found'); process.exit(1); }

// Find "// Options" line
const optionsCommentIdx = lines.findIndex((l, i) => i > errorCommentIdx && l.trim() === '// Options');
if (optionsCommentIdx < 0) { console.error('ABORT: options comment not found'); process.exit(1); }

// Find closing ");" of the watchPosition call — first line after optionsCommentIdx containing only ");"
const wpEndIdx = lines.findIndex((l, i) => i > optionsCommentIdx && l.trim() === ');');
if (wpEndIdx < 0) { console.error('ABORT: watchPosition closing ); not found'); process.exit(1); }
console.log('watchPosition block ends at line', wpEndIdx + 1);

// Success body: lines from (successCommentIdx+2) to (errorCommentIdx-2)
// The arrow (position) => { is on successCommentIdx+1, body starts successCommentIdx+2
// Closing "    }," of success is on errorCommentIdx-1 or -2
// Find the closing "    }," line just before errorCommentIdx
let successEndIdx = errorCommentIdx - 1;
while (successEndIdx > successCommentIdx && lines[successEndIdx].trim() === '') successEndIdx--;
// successEndIdx should be on the line "                    }," closing the success arrow
const successBodyLines = lines.slice(successCommentIdx + 2, successEndIdx);
console.log('Success body:', successBodyLines.length, 'lines');

// Error body: lines from (errorCommentIdx+2) to (optionsCommentIdx-2)
let errorEndIdx = optionsCommentIdx - 1;
while (errorEndIdx > errorCommentIdx && lines[errorEndIdx].trim() === '') errorEndIdx--;
const errorBodyLines = lines.slice(errorCommentIdx + 2, errorEndIdx);
console.log('Error body:', errorBodyLines.length, 'lines');

// De-indent: body is at 24 spaces; helper body should be at 12 spaces → remove 12 spaces
function deIndentLines(bodyLines, delta) {
    const prefix = ' '.repeat(delta);
    return bodyLines.map(l => (l.startsWith(prefix) ? l.slice(delta) : l));
}

const successBodyDe = deIndentLines(successBodyLines, 12);
const errorBodyDe   = deIndentLines(errorBodyLines,   12);

// Build helper functions at 8-space indent with body at 12-space (standard function indent)
const helperSuccessLines = [
    '        function _watchPositionSuccess(position, est, logPrefix) {',
    ...successBodyDe,
    '        }'
];

const helperErrorLines = [
    '        function _watchPositionError(error, est, logPrefix) {',
    ...errorBodyDe,
    '        }'
];

// New watchPosition call lines (replace lines wpCommentIdx..wpEndIdx inclusive)
const indent = lines[wpCallIdx].match(/^(\s*)/)[1]; // should be 16 spaces
const newWpLines = [
    `${indent}// Iniciar watchPosition`,
    `${indent}est.gps.watchId = navigator.geolocation.watchPosition(`,
    `${indent}    (position) => _watchPositionSuccess(position, est, logPrefix),`,
    `${indent}    (error) => _watchPositionError(error, est, logPrefix),`,
    `${indent}    { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }`,
    `${indent});`
];

// Find activarGPS function line to insert helpers before it
const activarGPSIdx = lines.findIndex(l => l.trim().startsWith('async function activarGPS()'));
if (activarGPSIdx < 0) { console.error('ABORT: activarGPS not found'); process.exit(1); }
console.log('activarGPS at line', activarGPSIdx + 1);

// Build new lines array
const newLines = [
    ...lines.slice(0, activarGPSIdx),
    ...helperSuccessLines,
    '',
    ...helperErrorLines,
    '',
    ...lines.slice(activarGPSIdx, wpCommentIdx),
    ...newWpLines,
    ...lines.slice(wpEndIdx + 1)
];

const newSrc = newLines.join(NL);
writeFileSync(FILE, newSrc, 'utf8');

console.log('\n=== fix-cc-gps-resto completado ===');
console.log('_watchPositionSuccess:', newSrc.includes('function _watchPositionSuccess'));
console.log('_watchPositionError:', newSrc.includes('function _watchPositionError'));
console.log('Inline callback gone:', !newSrc.includes('// Success callback'));
