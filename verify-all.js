const fs = require("fs");
const c = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const lines = c.split("\n").map(l => l.replace(/\r$/, ""));

const rsqm = "'"; // U+2019
const sq   = "'"; // U+0027
const acute = "´"; // U+00B4

let ok = 0, warn = 0, fail = 0;
function pass(msg)  { console.log("  OK   " + msg); ok++; }
function alert(msg) { console.log("  WARN  " + msg); warn++; }
function error(msg) { console.log("  FAIL  " + msg); fail++; }

// ── 1. Estructura básica ────────────────────────────────────────────────────
console.log("\n=== 1. ESTRUCTURA ===");
const pOpen  = (c.match(/<p>/g)   || []).length;
const pClose = (c.match(/<\/p>/g) || []).length;
pOpen === pClose ? pass("<p> abiertos=cerrados: " + pOpen) : error("<p> desbalanceados: " + pOpen + " open vs " + pClose + " close");

const strongOpen  = (c.match(/<strong>/gi)   || []).length;
const strongClose = (c.match(/<\/strong>/gi) || []).length;
strongOpen === strongClose ? pass("<strong> abiertos=cerrados: " + strongOpen) : error("<strong> desbalanceados");

const markOpen  = (c.match(/<mark>/gi)   || []).length;
const markClose = (c.match(/<\/mark>/gi) || []).length;
markOpen === markClose ? pass("<mark> abiertos=cerrados: " + markOpen) : error("<mark> desbalanceados");

const iOpen  = (c.match(/<i>/gi)   || []).length;
const iClose = (c.match(/<\/i>/gi) || []).length;
iOpen === iClose ? pass("<i> abiertos=cerrados: " + iOpen) : error("<i> desbalanceados");

// ── 2. Anidamiento incorrecto ───────────────────────────────────────────────
console.log("\n=== 2. ANIDAMIENTO ===");
const doubleStrong = lines.filter(l => /<strong>[^<]*<strong>/.test(l));
doubleStrong.length === 0 ? pass("Sin <strong> anidados") : error("<strong> anidados en " + doubleStrong.length + " líneas");

const doubleMark = lines.filter(l => /<mark>[^<]*<mark>/.test(l));
doubleMark.length === 0 ? pass("Sin <mark> anidados") : error("<mark> anidados en " + doubleMark.length + " líneas");

// ── 3. Ciudad de las Artes ──────────────────────────────────────────────────
console.log("\n=== 3. CIUDAD DE LAS ARTES ===");
const cacLines = lines.filter(l => /ciudad de las artes/i.test(l));
const cacTagged = cacLines.filter(l => /<strong>ciudad de las artes/i.test(l));
const cacUntagged = cacLines.length - cacTagged.length;
cacTagged.length === cacLines.length
  ? pass("Ciudad de las Artes: " + cacLines.length + " ocurrencias, todas con <strong>")
  : error("Ciudad de las Artes: " + cacUntagged + " sin <strong>");

const wrongForm = lines.filter(l => /ciudad de las artes y las ciencias/i.test(l));
wrongForm.length === 0
  ? pass("Sin forma 'y las Ciencias' (todas dicen 'y de las Ciencias')")
  : error("Forma errónea 'y las Ciencias' en " + wrongForm.length + " líneas");

// ── 4. l'Umbracle ──────────────────────────────────────────────────────────
console.log("\n=== 4. UMBRACLE ===");
const umLines = lines.filter(l => /umbracle/i.test(l));
umLines.forEach(l => {
  const raw = l;
  // Check: should have <strong>l'Umbracle</strong> with U+2019
  if (/L[´'].*umbracle/i.test(raw.replace(/<[^>]+>/g," "))) {
    error("L mayúscula o acento agudo en: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80));
  } else if (/l[´´]/.test(raw)) {
    error("Acento agudo (U+00B4) en línea Umbracle: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80));
  } else {
    pass("Umbracle OK: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80));
  }
});

// ── 5. l'Hemisfèric ────────────────────────────────────────────────────────
console.log("\n=== 5. HEMISFÈRIC ===");
const hemLines = lines.filter(l => /hemisf/i.test(l));
hemLines.forEach(l => {
  const plain = l.replace(/<[^>]+>/g," ");
  if (/L[´'’]hemisf/i.test(plain)) {
    error("L mayúscula: " + plain.trim().substring(0,80));
  } else {
    pass("Hemisfèric OK: " + plain.trim().substring(0,80));
  }
});

// ── 6. l'Assut de l'Or ─────────────────────────────────────────────────────
console.log("\n=== 6. L'ASSUT DE L'OR ===");
const assutLines = lines.filter(l => /assut/i.test(l));
assutLines.forEach(l => {
  const plain = l.replace(/<[^>]+>/g," ");
  // Check for wrong apostrophes: straight (U+0027) or acute (U+00B4)
  const orIdx = plain.toLowerCase().indexOf("de l");
  if (orIdx >= 0) {
    const aposChar = plain.charCodeAt(orIdx + 4);
    if (aposChar !== 0x2019) {
      error("Apóstrofe incorrecto (U+" + aposChar.toString(16).toUpperCase() + ") en 'l+Or': " + plain.trim().substring(0,80));
    } else {
      pass("l'Or OK (U+2019): " + plain.trim().substring(0,80));
    }
  }
});

// ── 7. En busca del tesoro ─────────────────────────────────────────────────
console.log("\n=== 7. EN BUSCA DEL TESORO ===");
const tesoroLines = lines.filter(l => /en busca del tesoro/i.test(l));
let tesoroOk=0, tesoroFail=0;
tesoroLines.forEach(l => {
  const ms = l.match(/<i>(en busca del tesoro)<\/i>/gi) || [];
  const bare = l.replace(/<[^>]+>/g," ").match(/en busca del tesoro/gi) || [];
  if (bare.length > ms.length) { tesoroFail++; error("Sin <i>: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80)); }
  ms.forEach(m => {
    const inner = m.replace(/<\/?i>/g,"");
    if (inner !== "en busca del tesoro" && inner !== "En busca del tesoro") {
      error("Caps incorrectas [" + inner + "]: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80));
    } else { tesoroOk++; }
  });
});
if (tesoroFail === 0 && tesoroOk > 0) pass("'en busca del tesoro': " + tesoroOk + " ocurrencias, todas en <i> con caps correctas");

// ── 8. Apóstrofes Valencianos generales ────────────────────────────────────
console.log("\n=== 8. APÓSTROFES VALENCIANOS ===");
// Wrong: L + any char + uppercase (L'X instead of l'X)
const wrongL = lines.filter(l => {
  const p = l.replace(/<[^>]+>/g," ");
  return /L['’'´][A-ZÀ-Ý]/.test(p);
});
wrongL.length === 0
  ? pass("Sin 'L mayúscula + apóstrofe' (todos son l minúscula)")
  : wrongL.forEach(l => error("L mayúscula: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80)));

// Wrong: acute accent U+00B4 used as apostrophe before a word
const wrongAcute = lines.filter(l => /[lL]´[A-Za-zÀ-ɏ]/.test(l.replace(/<[^>]+>/g," ")));
wrongAcute.length === 0
  ? pass("Sin acento agudo (U+00B4) como apóstrofe")
  : wrongAcute.forEach(l => error("Acento agudo: " + l.replace(/<[^>]+>/g,"").trim().substring(0,80)));

// ── 9. Numeración de mapa ──────────────────────────────────────────────────
console.log("\n=== 9. MARK EN LISTAS DE NÚMEROS ===");
const markListIssues = lines.filter(l =>
  l.startsWith("<p>") && (/<\/mark>,\s*\d+/.test(l) || /<\/mark>\s+al\s+\d+/.test(l) || /<\/mark>\s+y\s+\d+/.test(l))
);
markListIssues.length === 0
  ? pass("Sin números sueltos tras <mark> en listas")
  : markListIssues.forEach(l => error("Número sin mark: " + l.replace(/<[^>]+>/g,"").trim().substring(0,100)));

// ── 10. Ortografía básica ──────────────────────────────────────────────────
console.log("\n=== 10. ORTOGRAFÍA ===");
const doubleSpace = lines.filter(l => /  /.test(l.replace(/<[^>]+>/g," ")));
doubleSpace.length === 0 ? pass("Sin dobles espacios") : alert("Dobles espacios en " + doubleSpace.length + " líneas");

const spaceBeforePunct = lines.filter(l => / [,;.!?]/.test(l.replace(/<[^>]+>/g," ").replace(/\s[¿¡]/g,"")));
spaceBeforePunct.length === 0 ? pass("Sin espacio antes de puntuación") : alert("Espacio antes de puntuación en " + spaceBeforePunct.length + " líneas");

const wrongExcl = lines.filter(l => /¿[^?]+!/.test(l.replace(/<[^>]+>/g,"")));
wrongExcl.length === 0 ? pass("Sin '¿...!' mezclados") : alert("Signos mezclados en " + wrongExcl.length + " líneas");

const acuteAsApos = lines.filter(l => /[a-záéíóúüñ]´[a-záéíóúüñ]/i.test(l.replace(/<[^>]+>/g,"")));
acuteAsApos.length === 0 ? pass("Sin acento agudo como apóstrofe en texto") : alert("Acento agudo como apóstrofe en " + acuteAsApos.length + " líneas");

// ── Resumen ────────────────────────────────────────────────────────────────
console.log("\n=== RESUMEN ===");
console.log("  OK:   " + ok);
console.log("  WARN: " + warn);
console.log("  FAIL: " + fail);
console.log("\nContadores de etiquetas: <p>=" + pOpen + " <strong>=" + strongOpen + " <mark>=" + markOpen + " <i>=" + iOpen);
