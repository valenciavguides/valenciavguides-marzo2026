const fs = require("fs");

const raw = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const lines = raw.split("\n").map(l => l.replace(/\r$/, ""));

// ── Detectar líneas de cabecera ─────────────────────────────────────────────
// Formato: NNN – (Av...) | NNN - (Av...) | VivN – (Av...) | NNN --- (separador)
const headerRe = /^((?:Viv)?\d+[-\w]*\.?)\s*[-–]/i;

// ── Parsear bloques ─────────────────────────────────────────────────────────
// Cada bloque: { key, headerLine, bodyLines[] }
const blocks = [];
let cur = null;

for (let i = 0; i < lines.length; i++) {
  if (headerRe.test(lines[i])) {
    if (cur) blocks.push(cur);
    const rawKey = lines[i].match(/^((?:Viv)?\d+[-\w]*\.?)/i)[1]
      .replace(/\.\s*$/, "").trim().toUpperCase();
    cur = { key: rawKey, headerLine: lines[i], bodyLines: [] };
  } else if (cur) {
    cur.bodyLines.push(lines[i]);
  }
  // Líneas antes del primer bloque se descartan (no debería haber ninguna)
}
if (cur) blocks.push(cur);

console.log("Bloques parseados: " + blocks.length);

// ── Función de clave de ordenación ─────────────────────────────────────────
function sortKey(keyStr) {
  // VIV: Viv1, Viv11-B, Viv11-C...
  const vivM = keyStr.match(/^VIV(\d+)(-([A-Z]))?$/i);
  if (vivM) {
    const n = parseInt(vivM[1]);
    const s = vivM[3] ? vivM[3].charCodeAt(0) - 64 : 0;
    return [900000 + n, s, 0];
  }

  // Numérico: 23, 23-B, 236-A, 15-D, 24-D, 296-B, 704-B, 11-B...
  const m = keyStr.match(/^(\d+)(?:-([A-Z])(-?(\d+))?)?$/i);
  if (m) {
    const base = parseInt(m[1]);
    const letter = m[2] ? m[2].toUpperCase().charCodeAt(0) - 64 : 0; // sin sufijo=0, B=2, C=3...
    const sub = m[4] ? parseInt(m[4]) : 0;
    return [base, letter, sub];
  }

  // Casos especiales como "592-B" sin letra parseada por la regex anterior
  return [parseInt(keyStr) || 999998, 0, 0];
}

function compareKeys(a, b) {
  const ka = sortKey(a.key);
  const kb = sortKey(b.key);
  for (let i = 0; i < 3; i++) {
    if (ka[i] !== kb[i]) return ka[i] - kb[i];
  }
  return 0;
}

// ── Ordenar ─────────────────────────────────────────────────────────────────
blocks.sort(compareKeys);

// ── Reconstruir archivo ─────────────────────────────────────────────────────
// Cada bloque: headerLine + bodyLines, trimEnd para quitar líneas vacías finales sobrantes
// Separación entre bloques: 2 líneas vacías (como en el original)
const SEP = "\n\n";

const output = blocks.map(b => {
  // Limpiar bodyLines: quitar líneas vacías al final
  let body = b.bodyLines;
  while (body.length > 0 && body[body.length - 1].trim() === "") body = body.slice(0, -1);
  // Asegurar que hay exactamente una línea vacía antes del primer <p>
  const result = [b.headerLine];
  if (body.length > 0) {
    result.push(""); // línea vacía tras cabecera
    result.push(...body);
  }
  return result.join("\n");
}).join(SEP);

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", output, "utf8");
console.log("Archivo reordenado y guardado.");

// ── Verificación ─────────────────────────────────────────────────────────────
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const p = (fc.match(/<p>/gi) || []).length;
const pc = (fc.match(/<\/p>/gi) || []).length;
const fcLines = fc.split("\n");

// Comprobar orden
const numericSeq = [];
fcLines.forEach(l => {
  const m = l.match(/^(\d+)\s*[-–]/);
  if (m) numericSeq.push(parseInt(m[1]));
});
let jumps = 0;
for (let i = 1; i < numericSeq.length; i++) {
  if (numericSeq[i] < numericSeq[i-1]) jumps++;
}

// Comprobar duplicados
const keyCount = new Map();
fcLines.forEach(l => {
  const m = l.match(/^((?:Viv)?\d+[-\w]*\.?)\s*[-–]/i);
  if (m) {
    const k = m[1].replace(/\.\s*$/, "").trim().toUpperCase();
    keyCount.set(k, (keyCount.get(k) || 0) + 1);
  }
});
const dupes = [...keyCount.entries()].filter(([, v]) => v > 1);

console.log("\n=== Verificación ===");
console.log("<p>: " + p + " / " + pc + (p === pc ? " OK" : " ERROR"));
console.log("Cabeceras: " + blocks.length);
console.log("Líneas totales: " + fcLines.length);
console.log("Saltos de orden: " + jumps + (jumps === 0 ? " ✓" : " (revisar)"));
console.log("Duplicados: " + dupes.length + (dupes.length === 0 ? " ✓" : ""));
dupes.forEach(([k, v]) => console.log("  x" + v + ": " + k));

// Muestra primeros y últimos
console.log("\nPrimeros 5 bloques: " + blocks.slice(0, 5).map(b => b.key).join(", "));
console.log("Últimos 5 bloques: " + blocks.slice(-5).map(b => b.key).join(", "));
