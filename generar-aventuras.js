const fs = require("fs");
const path = require("path");

// ── 1. Construir mapa de párrafos desde parrafos-ordenado-español.txt ─────────
const parrafosRaw = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const parrafosLines = parrafosRaw.split("\n").map(l => l.replace(/\r$/, ""));

// Map: paragraphKey (e.g. "2", "682-B") → { header, lines[] }
const parrafoMap = new Map();

// Header pattern: digit or Viv identifier, optional suffix, then " -" / " –" / " (INTRO" / " (Av" / end-of-line
const headerRe = /^((?:Viv)?\d+[-\w]*(?:\.\s*)?)\s*(?:[-–]|\((?:INTRO|Av)|$)/i;

let currentKey = null;
let currentLines = [];
let currentHeader = "";

function saveCurrentBlock() {
  if (currentKey !== null && currentLines.length > 0) {
    const text = currentLines.join("\n").trim();
    if (text) parrafoMap.set(currentKey, { header: currentHeader, text });
  }
}

for (const line of parrafosLines) {
  // Strip <p>...</p> wrapper to detect sub-headers like <p>201 (INTRO...)</p>
  const stripped = line.replace(/^<p>/, "").replace(/<\/p>\s*$/, "");
  const m = stripped.match(headerRe);
  if (m) {
    saveCurrentBlock();
    currentKey = m[1].replace(/\.\s*$/, "").trim().toUpperCase();
    currentHeader = stripped.trim();
    currentLines = [];
  } else {
    if (currentKey !== null) currentLines.push(line);
  }
}
saveCurrentBlock();

console.log("Párrafos cargados en mapa: " + parrafoMap.size);

// ── 2. Parsear textos-aventuras.js — sección ES de cada Aventura ─────────────
const jsRaw = fs.readFileSync("js/textos-aventuras.js", "utf8");
const jsLines = jsRaw.split("\n");

// State machine: collect Aventura → es blocks → comments
const aventuras = {}; // { "Aventura1": [ { type, label, reto, parrafos[] } ] }

let currentAv = null;
let inEs = false;
let inOtherLang = false;
let depth = 0; // bracket depth within es: [ ... ]
let esDepth = -1;

const avStartRe = /^\s*(Aventura\d+[A-Z]?):\s*\{/;
const esStartRe = /^\s+es:\s*\[/;
const otherLangRe = /^\s+(en|fr|it|ja|de|ca|pt):\s*\[/;
const commentRe = /^\s*\/\/\s*((Parada|Tramo|INTRO).+)/i;
const parrafosRe = /\(P[áa]rrafos?:\s*([^)]+)\)/i;
const retoRe = /\(Reto\s*([\w\-]+(?:Puzzle)?(?:\s*[A-Z]{2}-\d+)?)\)/i;

for (let i = 0; i < jsLines.length; i++) {
  const line = jsLines[i];

  const avM = line.match(avStartRe);
  if (avM) {
    currentAv = avM[1];
    aventuras[currentAv] = [];
    inEs = false;
    inOtherLang = false;
    continue;
  }

  if (!currentAv) continue;

  if (esStartRe.test(line)) {
    inEs = true;
    inOtherLang = false;
    esDepth = 0;
    continue;
  }

  if (inEs && otherLangRe.test(line)) {
    inEs = false;
    inOtherLang = true;
    continue;
  }

  if (!inEs) continue;

  // Track bracket depth to know when es: [ ] ends
  for (const ch of line) {
    if (ch === "[") esDepth++;
    else if (ch === "]") esDepth--;
  }
  if (esDepth < 0) { inEs = false; continue; }

  // Capture Parada/Tramo/INTRO comments
  const cm = line.match(commentRe);
  if (cm) {
    const full = cm[1].trim();
    const parM = full.match(parrafosRe);
    const retM = full.match(retoRe);
    const parrafosStr = parM ? parM[1].trim() : "";
    const reto = retM ? retM[1].trim() : null;
    // Parse paragraph numbers (handles ranges like "215-218" only if both are pure numbers)
    const rawNums = parrafosStr.split(",").map(s => s.trim()).filter(Boolean);
    const parrafos = []; // each item: { key, compiledIn? }
    for (const r of rawNums) {
      // Compound key like "225-14-B" or "303-12-B": number + dash + number + dash + letter
      const compoundM = r.match(/^(\d+)-(\d+-[A-Z]+)$/i);
      if (compoundM) {
        parrafos.push({ key: compoundM[1].toUpperCase() });
        parrafos.push({ key: compoundM[2].toUpperCase() });
        continue;
      }
      // Range like "215-218" (two pure numbers with dash)
      const rangeM = r.match(/^(\d+)-(\d+)$/);
      if (rangeM) {
        const rangeStart = String(parseInt(rangeM[1]));
        parrafos.push({ key: rangeStart });
        for (let n = parseInt(rangeM[1]) + 1; n <= parseInt(rangeM[2]); n++) parrafos.push({ key: String(n), compiledIn: rangeStart });
      } else {
        parrafos.push({ key: r.toUpperCase() });
      }
    }
    // Remove "(Párrafos: ...)" and "(Reto ...)" to get clean label
    let label = full
      .replace(parrafosRe, "")
      .replace(retoRe, "")
      .replace(/\(\s*\)/g, "")
      .trim()
      .replace(/:\s*$/, "")
      .trim();
    aventuras[currentAv].push({ label, reto, parrafos });
  }
}

console.log("Aventuras parseadas:", Object.keys(aventuras).join(", "));

// ── 3. Generar archivos por aventura ─────────────────────────────────────────
const outDir = "textos-word/textos-aventuras-español";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const avNums = { Aventura1:"Av1", Aventura2:"Av2", Aventura3:"Av3", Aventura4:"Av4", Aventura5:"Av5" };

for (const [avName, blocks] of Object.entries(aventuras)) {
  const avCode = avNums[avName];
  const lines = [];
  const sep = "─".repeat(70);

  lines.push("=".repeat(70));
  lines.push("  " + avName.toUpperCase().replace("AVENTURA", "AVENTURA ") + " (" + avCode + ")");
  lines.push("  Generado: " + new Date().toLocaleDateString("es-ES"));
  lines.push("=".repeat(70));

  let missing = 0, found = 0;

  for (const block of blocks) {
    lines.push("");
    lines.push(sep);
    const retoLabel = block.reto ? "  [Reto " + block.reto + "]" : "";
    lines.push(block.label + retoLabel);
    if (block.parrafos.length > 0) {
      lines.push("   Párrafos: " + block.parrafos.map(p => p.key).join(", "));
    }
    lines.push(sep);

    if (block.parrafos.length === 0) {
      lines.push("   (sin párrafos de texto — reto o puzzle puro)");
      continue;
    }

    for (const item of block.parrafos) {
      const pNum = item.key;
      const entry = parrafoMap.get(pNum);
      if (entry) {
        found++;
        lines.push("");
        lines.push("  [" + pNum + "]");
        const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
        const clean = entry.text
          .replace(/Valencia\s*[Vv][ií]?\s*[Gg][aiu]id[se]*|Valenciguides|Valenciabeguides|València\s+bu\s+guides|València\s+beguides/gi, LOGO)
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        lines.push("  " + clean);
      } else if (item.compiledIn) {
        lines.push("  [" + pNum + "] → compilado en [" + item.compiledIn + "]");
      } else {
        missing++;
        lines.push("");
        lines.push("  [" + pNum + "]  ⚠ Párrafo pendiente de añadir al archivo");
      }
    }
  }

  lines.push("");
  lines.push("=".repeat(70));
  lines.push("  Párrafos encontrados: " + found + " | No encontrados: " + missing);
  lines.push("=".repeat(70));

  const outPath = path.join(outDir, avCode + "-texto-documentado.txt");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log("Generado: " + outPath + " (" + blocks.length + " bloques, " + found + " párrafos, " + missing + " no encontrados)");
}
