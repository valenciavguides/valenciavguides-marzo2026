const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const eol = content.includes("\r\n") ? "\r\n" : "\n";

// Match: <p>VivN[-B] [-] (Av...) text</p>
// Group 1: VivN[-B]   Group 2: optional dash   Group 3: (Av...)   Group 4: text
const vivRe = /^<p>(Viv\d+[-\w]*)\s*([-–]\s*)?(\([^)]+\))\s*([\s\S]*?)<\/p>$/i;

// Also handle: <p>Viv13 text</p> without parentheses (Viv13 has no codes listed)
const vivNoCodeRe = /^<p>(Viv\d+)\s+([\s\S]+?)<\/p>$/i;

const lines = content.split("\n");
let fixed = 0;

const result = lines.map(line => {
  const raw = line.replace(/\r$/, "");

  const m = raw.match(vivRe);
  if (m) {
    const id   = m[1].trim();
    const avs  = m[3].trim();
    const text = m[4].trim();
    fixed++;
    const header = id + " – " + avs;
    return text ? header + "\n\n<p>" + text + "</p>" : header;
  }

  const m2 = raw.match(vivNoCodeRe);
  if (m2) {
    const id   = m2[1].trim();
    const text = m2[2].trim();
    fixed++;
    // No adventure codes — keep as header only with text
    return id + "\n\n<p>" + text + "</p>";
  }

  return line;
});

content = result.join("\n");
fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("Lineas VIV corregidas: " + fixed);

// Verify
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const fl = fc.split("\n");
const remaining = fl.filter(l => /^<p>Viv/i.test(l));
console.log("VIV dentro de <p> restantes: " + remaining.length);
remaining.forEach(l => console.log("  " + l.substring(0, 100)));

// Sample output
console.log("\nMuestra:");
const vivIdx = fl.findIndex(l => /^Viv1\b/i.test(l));
if (vivIdx >= 0) fl.slice(vivIdx, vivIdx + 12).forEach(l => console.log("  " + l.substring(0, 100)));
