const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const lines = content.split("\n").map(l => l.replace(/\r$/, ""));

// ── 1. Insertar 643 justo antes de 296-B ───────────────────────────────────
const idx296B = lines.findIndex(l => /^296-B/.test(l));
console.log("296-B encontrado en línea: " + (idx296B + 1));

const bloque643 = [
  "643 – (Av2, Av5, Av34km, )",
  "",
  "<p>Un dato curioso es que, cuando es trasladada, la bandera debe ir con el mástil recto en todo momento.</p>",
  "",
  "<p>Recuerde que este es un punto perfecto, para hacer una magnífica foto de este monumento declarado de interés histórico artístico.</p>",
  "",
];

// Eliminar líneas vacías extra antes de 296-B (quedaremos con 1)
let insertAt = idx296B;
while (insertAt > 0 && lines[insertAt - 1].trim() === "") insertAt--;
// insertAt apunta ahora a la primera línea vacía antes de 296-B (o a 296-B si no hay ninguna)
// Eliminamos las extra y añadimos el bloque 643 + 1 línea vacía + 296-B
const before = lines.slice(0, insertAt);
const after  = lines.slice(idx296B); // desde 296-B inclusive

const newLines = [...before, "", ...bloque643, ...after];

console.log("643 insertado. Líneas antes: " + lines.length + " → después: " + newLines.length);

// ── 2. Eliminar duplicados del final (225, 14-B, 303, 12-B tras 296-C) ─────
// 296-C termina después de su último párrafo. Buscamos en newLines.
const idx296C = newLines.findIndex(l => /^296-C/.test(l));
// El bloque 296-C termina en la siguiente línea vacía doble o en el siguiente header
// Buscamos el primer header que NO sea 296-C después del bloque de 296-C
let endOf296C = idx296C + 1;
while (endOf296C < newLines.length && !(/^(\d+[-\w]*|Viv\d+[-\w]*|296-B)[\s\.\-–]/.test(newLines[endOf296C]) && !newLines[endOf296C].startsWith("296-C"))) {
  endOf296C++;
}
// endOf296C ahora apunta al primer header tras 296-C (los duplicados)
console.log("296-C bloque termina. Primer header duplicado en línea: " + (endOf296C + 1));
console.log("Línea duplicada: " + (newLines[endOf296C] || "(fin de archivo)"));

const cleanLines = newLines.slice(0, endOf296C);
console.log("Líneas finales: " + cleanLines.length);

// ── 3. Guardar ─────────────────────────────────────────────────────────────
fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", cleanLines.join("\n"), "utf8");
console.log("Archivo guardado.");

// ── 4. Verificación ────────────────────────────────────────────────────────
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const keys = ["643", "633", "256", "296-B", "296-C", "225", "14-B", "303", "12-B"];
console.log("\n=== Verificación ===");
keys.forEach(k => {
  const count = (fc.match(new RegExp("^" + k.replace(".", "\\.").replace(/[-]B/, "[-.]?B") + "\\b", "gim")) || []).length;
  console.log((count === 1 ? "OK" : count === 0 ? "FALTA" : "DUPLICADO x" + count) + ": " + k);
});
