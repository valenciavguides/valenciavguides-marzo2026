const fs = require("fs");

const missing = new Set([
  "23-C","24-D","32-C",
  "703","704","704-B","705","706","707","708","709","710","711","712","713",
  "VIV11-C","VIV13"
]);

const ttsRaw = fs.readFileSync("textos-word/parrafos-ordenado-español-siglos-numero.txt", "utf8");
const ttsLines = ttsRaw.split("\n").map(l => l.replace(/\r$/, ""));

// Cabecera con guión:    '703 - (Av3, Av4, Av5)'
// Cabecera sin guión:    '703  (Av3, Av4, Av5) texto...' o 'Viv13 texto...'
// El texto puede ir en la misma línea que la cabecera o en la siguiente

const headerWithDash    = /^((?:Viv)?\d+[-\w]*\.?)\s*[-–]\s*(\([^)]*\))/i;
const headerNoDashParen = /^((?:Viv)?\d+[-\w]*\.?)\s+(\([^)]*\))\s*(.*)/i;
const headerNoDashText  = /^(Viv\d+[-\w]*)\s+([A-ZÁÉÍÓÚÑ].+)/i;

const blocks = [];
let currentKey = null;
let currentHeader = "";
let currentLines = [];
let currentParas = [];

function flushPara() {
  const t = currentLines.join(" ").trim();
  if (t) currentParas.push(t);
  currentLines = [];
}
function flushBlock() {
  flushPara();
  if (currentKey && missing.has(currentKey.toUpperCase()) && currentParas.length > 0) {
    blocks.push({ key: currentKey, header: currentHeader, paras: [...currentParas] });
  }
  currentKey = null;
  currentParas = [];
  currentLines = [];
}

for (const line of ttsLines) {
  // ── Cabecera con guión ──────────────────────────────────────────────────
  const m1 = line.match(headerWithDash);
  if (m1) {
    flushBlock();
    const rawKey = m1[1].replace(/\.$/, "").trim();
    currentKey = rawKey.toUpperCase();
    currentHeader = rawKey + " – " + m1[2].trim();
    continue;
  }

  // ── Cabecera sin guión pero con paréntesis ──────────────────────────────
  const m2 = line.match(headerNoDashParen);
  if (m2) {
    flushBlock();
    const rawKey = m2[1].replace(/\.$/, "").trim();
    currentKey = rawKey.toUpperCase();
    currentHeader = rawKey + " – " + m2[2].trim();
    if (m2[3].trim()) currentLines.push(m2[3].trim()); // texto en misma línea
    continue;
  }

  // ── Cabecera VIV sin paréntesis (Viv13 Texto...) ───────────────────────
  const m3 = line.match(headerNoDashText);
  if (m3 && missing.has(m3[1].toUpperCase())) {
    flushBlock();
    const rawKey = m3[1].trim();
    currentKey = rawKey.toUpperCase();
    currentHeader = rawKey; // sin código de aventura — no disponible
    if (m3[2].trim()) currentLines.push(m3[2].trim());
    continue;
  }

  if (currentKey) {
    if (line.trim() === "") {
      flushPara();
    } else {
      currentLines.push(line.trim());
    }
  }
}
flushBlock();

console.log("Bloques extraídos: " + blocks.length + "/" + missing.size);
blocks.forEach(b => console.log("  " + b.key + ": " + b.paras.length + " párr. | cabecera: " + b.header.substring(0, 60)));

// ── Convertir a formato display ───────────────────────────────────────────
function toDisplay(b) {
  const out = ["", b.header, ""];
  b.paras.forEach(p => { out.push("<p>" + p + "</p>"); out.push(""); });
  return out.join("\n");
}

// ── Insertar después de 643 en el display file ────────────────────────────
let disp = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const dispLines = disp.split("\n").map(l => l.replace(/\r$/, ""));

// Buscar el fin del bloque 643
const idx643 = dispLines.findIndex(l => /^643\s*[–-]/.test(l));
let endOf643 = idx643 + 1;
while (endOf643 < dispLines.length && !/^((?:Viv)?\d+[-\w]*\.?\s*[–-]|Viv\d|296-B)/.test(dispLines[endOf643])) {
  endOf643++;
}

// Los VIV van intercalados con los numéricos según orden del TTS
const insertText = blocks.map(toDisplay).join("\n");
const before = dispLines.slice(0, endOf643);
const after  = dispLines.slice(endOf643);
const newContent = before.join("\n") + "\n" + insertText + "\n" + after.join("\n");

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", newContent, "utf8");
console.log("\nArchivo guardado.");

// ── Verificación ──────────────────────────────────────────────────────────
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const p_total = (fc.match(/<p>/gi)||[]).length;
const dispCount = (fc.match(/^((?:Viv)?\d+[-\w]*\.?)\s*[–-]/gim)||[]).length;
console.log("<p> total: " + p_total);
console.log("Cabeceras de párrafo total: " + dispCount);
blocks.forEach(b => {
  const re = new RegExp("^" + b.key.replace("VIV","(?:Viv|VIV)").replace(/-/,"[-–]?") + "[\\s–-]", "im");
  console.log((re.test(fc) ? "OK" : "FALTA") + ": " + b.key);
});
