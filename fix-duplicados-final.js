const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");

function rep(from, to, desc) {
  const n = content.split(from).length - 1;
  if (n === 0) { console.log("NOT FOUND: " + desc); return; }
  content = content.split(from).join(to);
  console.log("OK (" + n + "x): " + desc);
}

// ── 1. Corregir cabeceras con formato incorrecto ───────────────────────────

// Cabeceras sin guión (solo tienen paréntesis, sin dash)
rep("23-C. (Av4)\n",      "23-C – (Av4)\n",      "23-C: falta –");
rep("24-D. (Av1, Av3, Av4, AvFallas, Av34km, )\n", "24-D – (Av1, Av3, Av4, AvFallas, Av34km, )\n", "24-D: falta –");
rep("32-C. (Av1) \n",     "32-C – (Av1)\n",       "32-C: falta –");
rep("32-C. (Av1)\n",      "32-C – (Av1)\n",       "32-C alt");

// Cabeceras con espacio incorrecto en el sufijo
rep("15 -D. - (Av4, )",   "15-D – (Av4, )",       "15-D: espacio incorrecto");
rep("126 -B. ------------","126-B – (ver texto)",  "126-B: espacio incorrecto");

// Cabeceras 296 con espacio mal puesto (las viejas, se eliminarán)
// Se mantienen para ser eliminadas junto con el bloque completo más adelante

// ── 2. Eliminar bloques duplicados de TTS recovery (23-C, 24-D, 32-C) ─────
// Estos fueron añadidos al final por recuperar-parrafos-2.js
// Los originales ya tienen mejor contenido

const lines = content.split("\n");

// Encontrar y eliminar el bloque de 23-C recovery (viene después de línea de 643)
// Estrategia: buscar los bloques con "– (Av4)" para 23-C, "– (Av1, Av3" para 24-D, "– (Av1)" para 32-C
// que aparecen en la segunda mitad del archivo (después de 643)

function removeBlockAfterIndex(linesArr, searchStart, headerPattern) {
  const idx = linesArr.findIndex((l, i) => i >= searchStart && headerPattern.test(l));
  if (idx === -1) { console.log("Block not found: " + headerPattern); return linesArr; }

  // Encontrar el fin del bloque: próxima cabecera o fin de archivo
  let endIdx = idx + 1;
  while (endIdx < linesArr.length && !/^((?:Viv)?\d+[-\w]*\.?\s*[–-]|296-B)/.test(linesArr[endIdx])) {
    endIdx++;
  }

  // Eliminar las líneas del bloque (incluyendo la línea vacía antes del header)
  const startRemove = idx > 0 && linesArr[idx - 1].trim() === "" ? idx - 1 : idx;
  console.log("Eliminando bloque: '" + linesArr[idx] + "' (líneas " + startRemove + "-" + endIdx + ")");
  return [...linesArr.slice(0, startRemove), ...linesArr.slice(endIdx)];
}

// Buscar el índice de 643 para saber desde dónde buscar los duplicados
const idx643 = lines.findIndex(l => /^643\s*[–-]/.test(l));
console.log("\n643 en línea: " + (idx643 + 1));

let newLines = [...lines];
// Eliminar recovery de 23-C (segunda aparición, después de 643)
newLines = removeBlockAfterIndex(newLines, idx643 + 1, /^23-C\s*[–-]/);
// Eliminar recovery de 24-D (segunda aparición)
const idx643b = newLines.findIndex(l => /^643\s*[–-]/.test(l));
newLines = removeBlockAfterIndex(newLines, idx643b + 1, /^24-D\s*[–-]/);
// Eliminar recovery de 32-C (segunda aparición)
const idx643c = newLines.findIndex(l => /^643\s*[–-]/.test(l));
newLines = removeBlockAfterIndex(newLines, idx643c + 1, /^32-C\s*[–-]/);

content = newLines.join("\n");

// ── 3. Eliminar los viejos 296-B y 296-C (formato incorrecto, texto antiguo) ─
// Los nuevos con contenido correcto están al final del archivo

// Eliminar "296- B." completo con su contenido (hasta 296- C.)
// Primero encontrar la posición de 296- B.
const newLines2 = content.split("\n");
const idx296OldB = newLines2.findIndex(l => /^296-\s*B\.\s*-/.test(l));
const idx296OldC = newLines2.findIndex(l => /^296-\s*C\.\s*-/.test(l));

if (idx296OldB >= 0 && idx296OldC >= 0) {
  // Encontrar fin de bloque 296-C (hasta siguiente cabecera)
  let endOf296OldC = idx296OldC + 1;
  while (endOf296OldC < newLines2.length && !/^((?:Viv)?\d+[-\w]*\.?\s*[–-])/.test(newLines2[endOf296OldC])) {
    endOf296OldC++;
  }
  const before296B = idx296OldB > 0 && newLines2[idx296OldB - 1].trim() === "" ? idx296OldB - 1 : idx296OldB;
  console.log("Eliminando viejos 296-B y 296-C: líneas " + before296B + "-" + endOf296OldC);
  const cleaned = [...newLines2.slice(0, before296B), ...newLines2.slice(endOf296OldC)];
  content = cleaned.join("\n");
} else {
  console.log("Viejos 296-B/C no encontrados (idx: " + idx296OldB + ", " + idx296OldC + ")");
}

// ── 4. Guardar ─────────────────────────────────────────────────────────────
fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("\nArchivo guardado.");

// ── 5. Verificación de duplicados ─────────────────────────────────────────
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const fcLines = fc.split("\n");
const keyCount = new Map();
fcLines.forEach(l => {
  const m = l.match(/^((?:Viv)?\d+[-\w]*\.?)\s*[-–]/i);
  if (m) {
    const k = m[1].replace(/\.\s*$/, "").trim().toUpperCase();
    keyCount.set(k, (keyCount.get(k) || 0) + 1);
  }
});
const dupes = [...keyCount.entries()].filter(([k, v]) => v > 1);
console.log("\n=== Duplicados restantes: " + dupes.length + " ===");
dupes.forEach(([k, v]) => {
  const positions = [];
  fcLines.forEach((l, i) => {
    const m = l.match(/^((?:Viv)?\d+[-\w]*\.?)\s*[-–]/i);
    if (m && m[1].replace(/\.\s*$/, "").trim().toUpperCase() === k) positions.push(i + 1);
  });
  console.log("  x" + v + ": " + k + " (líneas: " + positions.join(", ") + ")");
});

// ── 6. Estado final ─────────────────────────────────────────────────────────
const p = (fc.match(/<p>/gi) || []).length;
const headers = (fc.match(/^((?:Viv)?\d+[-\w]*\.?)\s*[–-]/gim) || []).length;
console.log("\n=== Estado ===");
console.log("<p>: " + p + " (abrir=cerrar: " + (p === (fc.match(/<\/p>/gi)||[]).length ? "OK" : "ERROR") + ")");
console.log("Cabeceras: " + headers);
console.log("Líneas totales: " + fcLines.length);
