const fs = require("fs");
const path = require("path");

// ── 1. Parsear parrafos-ordenado-español.txt ──────────────────────────────────
const parrafosRaw = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const parrafosLines = parrafosRaw.split("\n").map(l => l.replace(/\r$/, ""));

const parrafoMap = new Map();

// Mismo patrón que generar-aventuras.js — no modificar
const headerRe = /^((?:Viv)?\d+[-\w]*(?:\.\s*)?)\s*(?:[-–]|\((?:INTRO|Av)|$)/i;

let currentKey = null;
let currentLines = [];

function saveCurrentBlock() {
    if (currentKey !== null && currentLines.length > 0) {
        const text = currentLines.join("\n").trim();
        if (text) parrafoMap.set(currentKey, text);
    }
}

for (const line of parrafosLines) {
    const stripped = line.replace(/^<p>/, "").replace(/<\/p>\s*$/, "");
    const m = stripped.match(headerRe);
    if (m) {
        saveCurrentBlock();
        currentKey = m[1].replace(/\.\s*$/, "").trim().toUpperCase();
        currentLines = [];
    } else {
        if (currentKey !== null) currentLines.push(line);
    }
}
saveCurrentBlock();

console.log(`Párrafos parseados del archivo fuente: ${parrafoMap.size}`);

// ── 2. Construir JSON con sustitución de logo ─────────────────────────────────
// Se serializa directamente desde la Map para preservar el orden de inserción
// (1, 2, 2-B, 2-C … 500, 500-A, 500-B …). Un plain object reordenaría las
// claves numéricas antes que las alfanuméricas, rompiendo el orden correlativo.
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const entries = [];
for (const [key, text] of parrafoMap) {
    const clean = text
        .replace(/Valencia\s*[Vv][ií]?\s*[Gg][aiu]id[se]*|Valenciguides|Valenciabeguides|València\s+bu\s+guides|València\s+beguides/gi, LOGO)
        .replace(/\n{3,}/g, "\n")
        .trim();
    entries.push(`  ${JSON.stringify(key)}: ${JSON.stringify(clean)}`);
}
const jsonOutput = "{\n" + entries.join(",\n") + "\n}";

// ── 3. Guardar en js/parrafos-textos/ (ubicación de desarrollo) ───────────────
// En producción estos archivos van a backend/data/parrafos-textos/ y se sirven
// únicamente a través de GET /api/textos/:idioma con autenticación JWT.
// Al desplegar: copiar esta carpeta a backend/data/ y bloquear /js/parrafos-textos/
// con PROTECT_DATA=true en js/server.js.

const outDir = "js/parrafos-textos";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "parrafos-texto-espanol.json");
fs.writeFileSync(outPath, jsonOutput, "utf8");

console.log(`Generado: ${outPath}`);
console.log(`Total párrafos en JSON: ${entries.length}`);
console.log("");
console.log("NOTA: Los otros 11 idiomas se generarán cuando haya traducciones.");
console.log("NOTA: Al desplegar, copiar js/parrafos-textos/ → backend/data/parrafos-textos/");
