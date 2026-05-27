const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const eol = content.includes("\r\n") ? "\r\n" : "\n";

// Use unicode escapes to avoid any quote conversion issues
const rsqm = "’"; // right single quotation mark (') — correct Valencian apostrophe
const sq   = "'"; // straight apostrophe (')         — wrong
const acute = "´"; // acute accent (´)               — wrong

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log("NOT FOUND: " + desc); return; }
  content = content.split(from).join(to);
  console.log("OK (" + count + "x): " + desc);
}

// 1. Fix l'Or (U+0027 straight) -> l'Or (U+2019) inside "l'Assut de l'Or"
rep("de l" + sq + "Or", "de l" + rsqm + "Or", "l+0027+Or -> l+2019+Or");

// 2. Fix L'Hemisf. (uppercase L) -> l'Hemisf. (lowercase l, keeps U+2019)
rep("L" + rsqm + "Hemisfèric", "l" + rsqm + "Hemisfèric", "L'Hemisf. uppercase -> lowercase");

// 3. Fix l-acute-<strong>Umbracle</strong> -> <strong>l'Umbracle</strong>
rep("l" + acute + "<strong>Umbracle</strong>", "<strong>l" + rsqm + "Umbracle</strong>", "l-acute-strong-Umbracle -> strong-l-rsqm-Umbracle");

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("\nArchivo guardado.");

// Verification
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const fl = fc.split("\n");

console.log("\n--- Umbracle ---");
fl.filter(l => /umbracle/i.test(l)).forEach(l => {
  const pi = l.toLowerCase().indexOf("umbracle");
  const chars = [...l.substring(Math.max(0,pi-5), pi+12)].map(c => c+":U+"+c.charCodeAt(0).toString(16).toUpperCase().padStart(4,"0")).join(" ");
  console.log("  " + l.replace(/<[^>]+>/g,"").trim().substring(0,80));
  console.log("  " + chars);
});

console.log("\n--- Hemisfèric ---");
fl.filter(l => /hemisf/i.test(l)).forEach(l => console.log("  " + l.replace(/<[^>]+>/g,"").trim().substring(0,90)));

console.log("\n--- Assut de l Or ---");
fl.filter(l => /assut/i.test(l)).forEach(l => {
  const plain = l.replace(/<[^>]+>/g,"").trim();
  const idx = plain.toLowerCase().indexOf("de l");
  const chars = idx >= 0 ? [...plain.substring(idx, idx+8)].map(c => c+":U+"+c.charCodeAt(0).toString(16).toUpperCase().padStart(4,"0")).join(" ") : "";
  console.log("  " + plain.substring(0,100));
  if (chars) console.log("  chars: " + chars);
});
