const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const eol = content.includes("\r\n") ? "\r\n" : "\n";

// Match lines of the form: <p>NNN (Av... or INTRO...) optional-text</p>
// Group 1: paragraph number  Group 2: adventure codes  Group 3: text content
const lineRe = /^<p>(\d+[-\w]*)\s+(\([^)]+\))\s*([\s\S]*?)<\/p>$/;

const lines = content.split("\n");
let fixed = 0;

const result = lines.map(line => {
  const raw = line.replace(/\r$/, "");
  const m = raw.match(lineRe);
  if (!m) return line;

  const num  = m[1].trim();
  const avs  = m[2].trim();
  const text = m[3].trim();

  fixed++;
  const header = num + " – " + avs; // num – (Av...)
  if (text) {
    return header + "\n\n<p>" + text + "</p>";
  } else {
    return header;
  }
});

content = result.join("\n");
fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("Lineas corregidas: " + fixed);

// Verify: none remaining
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const remaining = fc.split("\n").filter(l => /^<p>\d+[-\w]*\s+\([^)]*(?:INTRO|Av)/i.test(l));
console.log("Restantes con numero en <p>: " + remaining.length);
remaining.forEach(l => console.log("  " + l.substring(0, 100)));

// Quick sample of fixed blocks
console.log("\nMuestra de bloques corregidos:");
const fl = fc.split("\n");
[211, 213, 703, 32, 389].forEach(n => {
  const idx = fl.findIndex(l => new RegExp("^" + n + "\\s").test(l));
  if (idx >= 0) {
    console.log("--- parrafo " + n + " (L" + (idx+1) + ") ---");
    fl.slice(idx, idx + 4).forEach(l => console.log("  " + l.substring(0, 100)));
  }
});
