const fs = require("fs");

// ── 1. Leer TTS file y extraer los bloques de los 84 párrafos perdidos ─────
const ttsRaw = fs.readFileSync("textos-word/parrafos-ordenado-español-siglos-numero.txt", "utf8");
const ttsLines = ttsRaw.split("\n").map(l => l.replace(/\r$/, ""));

// Párrafos perdidos (identificados por comparación TTS vs display)
const missing = new Set([
  "644","645","646","646-A","647","647-B","648","648-B","649","649-B",
  "650","651","652","653","654","655","656","657","658","659",
  "660","661","662","663","664","665","666","667","667-B","668",
  "669","670","670-B","671","672","673","674","675","676","677",
  "678","679","680","681","682","682-B","683","684","685","686",
  "687","688","689","690","691","692","693","693-B","693-C","694",
  "695","696","697","698","699","700","701","702","704",
  "VIV1","VIV2","VIV3","VIV4","VIV5","VIV6","VIV7","VIV8","VIV9",
  "VIV10","VIV11","VIV11-B","VIV12","VIV14","VIV15"
]);

// Cabecera TTS → cabecera display
const headerRe = /^((?:Viv|viv)?\d+[-\w]*\.?)\s*-\s*(\([^)]*\))/i;

// Extraer bloques del TTS en orden de aparición
const blocks = []; // { key, header, paras[] }
let currentKey = null;
let currentHeader = "";
let currentParaLines = [];
let currentParas = [];

function flushPara() {
  const t = currentParaLines.join(" ").trim();
  if (t) currentParas.push(t);
  currentParaLines = [];
}
function flushBlock() {
  flushPara();
  if (currentKey && missing.has(currentKey.toUpperCase()) && currentParas.length > 0) {
    blocks.push({ key: currentKey, header: currentHeader, paras: [...currentParas] });
  }
  currentParas = [];
}

for (const line of ttsLines) {
  const hm = line.match(headerRe);
  if (hm) {
    flushBlock();
    const rawKey = hm[1].replace(/\.$/, "").trim();
    currentKey = rawKey.toUpperCase();
    const avs = hm[2].trim();
    currentHeader = rawKey + " – " + avs;
    currentParaLines = [];
    currentParas = [];
  } else if (currentKey) {
    if (line.trim() === "") {
      flushPara();
    } else {
      currentParaLines.push(line.trim());
    }
  }
}
flushBlock();

console.log("Bloques recuperados del TTS: " + blocks.length);
blocks.slice(0, 5).forEach(b => console.log("  " + b.key + ": " + b.paras.length + " párrafo(s)"));

// ── 2. Convertir a formato display (con <p> tags) ─────────────────────────
function blockToDisplay(b) {
  const lines = ["", b.header, ""];
  b.paras.forEach(p => {
    lines.push("<p>" + p + "</p>");
    lines.push("");
  });
  return lines.join("\n");
}

// ── 3. Insertar después de 643 en el display file ─────────────────────────
let display = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const dispLines = display.split("\n").map(l => l.replace(/\r$/, ""));

// Encontrar línea de 643
const idx643 = dispLines.findIndex(l => /^643\s*[–-]/.test(l));
console.log("643 en línea: " + (idx643 + 1));

// Buscar el fin del bloque 643 (hasta la siguiente cabecera o 296-B)
let endOf643 = idx643 + 1;
while (endOf643 < dispLines.length && !/^((?:Viv|viv)?\d+[-\w]*\.?\s*[–-]|296-B)/.test(dispLines[endOf643])) {
  endOf643++;
}
console.log("Siguiente cabecera después de 643 en línea: " + (endOf643 + 1) + " → " + dispLines[endOf643]);

// Separar el bloque VIV del resto (VIV va al final, después de 702)
const vivBlocks = blocks.filter(b => b.key.startsWith("VIV"));
const numBlocks = blocks.filter(b => !b.key.startsWith("VIV"));

// Construir el texto a insertar entre 643 y 296-B:
// - primero los bloques numéricos (644-702, 704)
// - luego los VIV
const insertText = numBlocks.map(blockToDisplay).join("\n") + "\n" + vivBlocks.map(blockToDisplay).join("\n");

// Insertar
const before = dispLines.slice(0, endOf643);
const after  = dispLines.slice(endOf643);
const newContent = before.join("\n") + "\n" + insertText + "\n" + after.join("\n");

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", newContent, "utf8");
console.log("Archivo guardado.");

// ── 4. Verificación ────────────────────────────────────────────────────────
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const p_count = (fc.match(/<p>/gi) || []).length;
console.log("\n<p> total: " + p_count + " (era 1925 antes de los errores)");

// Verificar que los bloques perdidos están ahora presentes
const recovered = blocks.filter(b => {
  const re = new RegExp("^" + b.key.replace("-", "[-–]?").replace("VIV","(?:Viv|VIV)") + "\\s*[–-]", "im");
  return re.test(fc);
});
console.log("Bloques recuperados verificados: " + recovered.length + "/" + blocks.length);
