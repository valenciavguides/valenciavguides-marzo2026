const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const eol = content.includes("\r\n") ? "\r\n" : "\n";

function rep(from, to, desc) {
  const count = content.split(from).length - 1;
  if (count === 0) { console.log("NOT FOUND: " + desc); return; }
  content = content.split(from).join(to);
  console.log("OK (" + count + "x): " + desc);
}

// ── Fix 1: Párrafo 201 embebido dentro del <p> de 200 ─────────────────────
// Separar en dos párrafos correctos + cabecera propia para 201
rep(
  " 201 (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km) <i>en busca del tesoro</i>,",
  "</p>\n\n201 – (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km)\n\n<p><i>En busca del tesoro</i>,",
  "201 embebido en p.200 -> cabecera propia"
);

// ── Fix 2: Párrafos 202-204 con número al inicio del <p> ──────────────────
rep(
  "<p>202 (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km) ",
  "202 – (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km)\n\n<p>",
  "202: numero al inicio del p -> cabecera"
);
rep(
  "<p>203 (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km) ",
  "203 – (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km)\n\n<p>",
  "203: numero al inicio del p -> cabecera"
);
rep(
  "<p>204 (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km) ",
  "204 – (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas, Av34km)\n\n<p>",
  "204: numero al inicio del p -> cabecera"
);

// ── Fix 3: Párrafos 205-206 con aventuras distintas ───────────────────────
rep(
  "<p>205 (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas) ",
  "205 – (INTRO Av1, Av2, Av3, Av4, Av5, AvFallas)\n\n<p>",
  "205: numero al inicio del p -> cabecera"
);
rep(
  "<p>206 (INTRO Av34km) ",
  "206 – (INTRO Av34km)\n\n<p>",
  "206: numero al inicio del p -> cabecera"
);

fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");
console.log("\nArchivo guardado.");

// Verificación
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const fl = fc.split("\n");
console.log("\nEstado párrafos 200-207:");
fl.forEach((l, i) => {
  if (i >= 3546 && i <= 3605) console.log((i + 1) + ": " + l.substring(0, 100));
});
