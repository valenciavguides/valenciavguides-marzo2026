const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const eol = content.includes("\r\n") ? "\r\n" : "\n";

// Wrap all case variants of the phrase in <i> tags
// Using inI tracking to avoid double-wrapping
const phraseRe = /(en busca del tesoro)/gi;
const headerRe = /^\d+[\w. ]*[-–]/;

function applyItalic(line) {
  if (headerRe.test(line.trim())) return line;
  const parts = line.split(/(<[^>]+>)/);
  let inI = false;
  return parts.map((part, idx) => {
    if (idx % 2 !== 0) {
      if (/^<i\b/i.test(part)) inI = true;
      else if (/^<\/i>/i.test(part)) inI = false;
      return part;
    }
    if (inI) return part;
    return part.replace(phraseRe, "<i>$1</i>");
  }).join("");
}

const lines = content.split("\n");
let changed = 0;
const result = lines.map(line => {
  const processed = applyItalic(line);
  if (processed !== line) changed++;
  return processed;
});
content = result.join(eol);

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("Lineas modificadas: " + changed);

// Verify
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const fl = fc.split("\n");
const tagged = fl.filter(l => /<i>en busca del tesoro/i.test(l)).length;
const untagged = fl.filter(l => /en busca del tesoro/i.test(l) && !/<i>en busca del tesoro/i.test(l)).length;
console.log("Con <i>: " + tagged + " | Sin <i>: " + untagged);

// Show a few examples
fl.filter(l => /<i>en busca del tesoro/i.test(l)).slice(0,5).forEach((l,i) => console.log("  " + (i+1) + ": " + l.replace(/<[^>]+>/g,"").trim().substring(0,100)));
