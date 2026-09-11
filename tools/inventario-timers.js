#!/usr/bin/env node
/**
 * inventario-timers.js — dónde está cada temporizador del código de producción
 *
 * POR QUÉ EXISTE
 *
 * `verificar-esperas.js` es el trinquete de las esperas ciegas, pero solo mira
 * `page.waitForTimeout()` y solo dentro de `tests/`. Nada cubría la otra mitad: los
 * `setTimeout`/`setInterval` del código que el usuario ejecuta. Son la materia prima del
 * EJE 23 (una espera ciega disfrazada de polling) y del EJE 26 (un mecanismo que existe
 * pero nunca se dispara), y para auditarlos hace falta verlos todos a la vez, no uno a uno
 * según aparecen.
 *
 * `.watchPosition()` entra en la lista por un motivo distinto: es la única fuente de GPS
 * de la app y debe encenderse UNA vez (§ GPS nunca se detiene). Más de una aparición viva
 * es, por sí sola, algo que mirar.
 *
 * CÓMO LEER LA SALIDA
 *
 * Es un inventario, no un veredicto: ninguna línea es un fallo por estar aquí. Lo que se
 * busca al leerlo es el patrón — un `setTimeout` sin condición asociada, un `setInterval`
 * sin su `clearInterval`, un polling cuyo `maxIntentos × intervalo` compite con el timeout
 * de un test (§36.23).
 *
 * USO
 *
 *   npm run inventory:timers            → a pantalla
 *   npm run inventory:timers > out.txt  → a fichero, si hace falta comparar dos momentos
 */
const fs = require('fs');
const path = require('path');

// tests/ y docs/ quedan fuera: aquí solo interesa el código que llega al navegador.
// tools/ también — este fichero vive ahí y no es producción.
const SALTAR = new Set(['node_modules', '.git', 'tests', 'docs', 'tools', 'report', 'test-results']);

function walk(dir, acc) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SALTAR.has(item.name) || item.name.startsWith('.')) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full, acc);
    else if (/\.(html|js)$/.test(item.name)) acc.push(full);
  }
}

const patterns = [
  { name: 'setTimeout', re: /\bsetTimeout\s*\(/ },
  { name: 'setInterval', re: /\bsetInterval\s*\(/ },
  { name: 'sleep(', re: /\bawait\s+sleep\s*\(/ },
  { name: 'watchPosition', re: /\.watchPosition\s*\(/ },
];

const files = [];
walk('.', files);

const porTipo = Object.fromEntries(patterns.map(p => [p.name, 0]));
const out = [];

for (const f of files.sort()) {
  const rel = path.relative('.', f).split(path.sep).join('/');
  fs.readFileSync(f, 'utf8').split('\n').forEach((linea, i) => {
    for (const p of patterns) {
      if (!p.re.test(linea)) continue;
      porTipo[p.name]++;
      out.push(`${rel}:${i + 1}: [${p.name}] ${linea.trim().slice(0, 140)}`);
    }
  });
}

console.log(out.join('\n'));
console.log('\n' + '─'.repeat(70));
console.log(`Ficheros de producción recorridos: ${files.length}`);
for (const p of patterns) console.log(`  ${p.name.padEnd(16)} ${porTipo[p.name]}`);
console.log(`  ${'TOTAL'.padEnd(16)} ${out.length}`);
