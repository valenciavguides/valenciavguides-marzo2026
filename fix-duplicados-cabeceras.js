const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const lines = content.split("\n");

// ── 1. Eliminar bloque duplicado del final ─────────────────────────────────
// El bloque añadido empieza en "643 – (Av2..." (antes de 296-B y 296-C)
// Hay que conservar desde 296-B hasta el final.
// Buscamos la primera línea "296-B" que sea el nuevo bloque (línea 14110 aprox.)

const dupStart = lines.findIndex(l => /^643\s*[–-]/.test(l.replace(/\r$/, "")));
const keep296B = lines.findIndex((l, i) => i > dupStart && /^296-B/.test(l.replace(/\r$/, "")));

// El punto de corte es la línea justo antes del 643 duplicado (blank line)
// Construimos: todo hasta dupStart (exclusive, sin la línea vacía previa) + bloque 296-B/C
const beforeDup = lines.slice(0, dupStart).join("\n");
const from296B  = lines.slice(keep296B).join("\n");

content = beforeDup + "\n" + from296B;

console.log("Bloque duplicado cortado. Inicio corte: línea " + (dupStart + 1) + ", 296-B desde línea " + (keep296B + 1));

// ── 2. Corregir cabeceras con guión incorrecto ─────────────────────────────
function rep(from, to, desc) {
  const n = content.split(from).length - 1;
  if (n === 0) { console.log("NOT FOUND: " + desc); return; }
  content = content.split(from).join(to);
  console.log("OK (" + n + "x): " + desc);
}

rep("225 -(Av3, Av5, Av34km)",   "225 – (Av3, Av5, Av34km, )", "225 cabecera");
rep("256- (Av3, Av34km,)",       "256 – (Av3, Av34km, )",      "256 cabecera");
rep("303 - (Av5, Av34km, ) ",    "303 – (Av5, Av34km, )",      "303 cabecera con espacio final");
rep("303 - (Av5, Av34km, )",     "303 – (Av5, Av34km, )",      "303 cabecera sin espacio");
rep("633- (Av4, Av34km,)",       "633 – (Av4, Av34km, )",      "633 cabecera");
rep("643- (Av2, Av5, Av34km,)",  "643 – (Av2, Av5, Av34km, )", "643 cabecera");
rep("14-B. - (Av3 X2, Av5,  )", "14-B. – (Av3 X2, Av5, )",   "14-B cabecera");
rep("12-B. - (Av5, )",           "12-B. – (Av5, )",            "12-B cabecera");

// ── 3. Buscar otras cabeceras con guión simple (informe, no corrección) ────
const resultLines = content.split("\n").map(l => l.replace(/\r$/, ""));
const headerRe   = /^((?:Viv)?\d+[-\w]*\.?\s*)(-\s|\s-\s)(\((?:Av|INTRO))/i;
const badHeaders = resultLines.filter(l => headerRe.test(l));
console.log("\n=== Cabeceras con guión simple restantes: " + badHeaders.length + " ===");
badHeaders.forEach(l => console.log("  " + l.substring(0, 100)));

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("\nArchivo guardado. Total líneas: " + resultLines.length);

// ── 4. Verificación final ─────────────────────────────────────────────────
const keys = ["643", "633", "256", "296-B", "296-C", "225", "14-B", "303", "12-B"];
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
console.log("\n=== Verificación párrafos ===");
keys.forEach(k => {
  const re = new RegExp("^" + k.replace(".", "\\.").replace("-B", "[-.]?B") + "[\\.\\s–-]", "im");
  const found = re.test(fc);
  const count = (fc.match(new RegExp("^" + k.replace(".", "\\."), "gim")) || []).length;
  console.log((found ? "OK" : "FALTA") + " (x" + count + "): " + k);
});
