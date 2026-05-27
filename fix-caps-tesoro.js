const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const eol = content.includes("\r\n") ? "\r\n" : "\n";

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log("NOT FOUND: " + desc); return; }
  content = content.split(from).join(to);
  console.log("OK (" + count + "x): " + desc);
}

// Step 1: Normalize all wrong-caps variants to lowercase
rep("<i>EN BUSCA DEL TESORO</i>", "<i>en busca del tesoro</i>", "ALL CAPS -> lowercase");
rep("<i>En Busca del Tesoro</i>", "<i>en busca del tesoro</i>", "Title Case -> lowercase");
rep("<i>en Busca del Tesoro</i>", "<i>en busca del tesoro</i>", "mixed Caps -> lowercase");

// Step 2: Capitalize only when phrase opens a paragraph
rep("<p><i>en busca del tesoro</i>", "<p><i>En busca del tesoro</i>", "paragraph-start -> capitalize E");

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("\nArchivo guardado.");

// Verify: list all remaining non-standard forms
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const fl = fc.split("\n");
console.log("\nFormas resultantes:");
const count = {};
fl.forEach(l => {
  const ms = l.match(/<i>(en busca del tesoro)<\/i>/gi) || [];
  ms.forEach(m => {
    const inner = m.replace(/<\/?i>/g, "");
    count[inner] = (count[inner] || 0) + 1;
  });
});
Object.entries(count).forEach(([k,v]) => console.log("  " + JSON.stringify(k) + " x" + v));
