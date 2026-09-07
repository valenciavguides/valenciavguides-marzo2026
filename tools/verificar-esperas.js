#!/usr/bin/env node
/**
 * verificar-esperas.js — trinquete contra las esperas ciegas en los tests E2E
 *
 * POR QUÉ EXISTE
 *
 * `page.waitForTimeout(n)` espera un TIEMPO en vez de una CONDICIÓN. Funciona en la
 * máquina de quien lo escribe y falla en tandas completas con la máquina cargada, que es
 * justo cuando menos se quiere depurar. Es el EJE 23 de docs/GUIA-COMPLETA.md, y en una
 * sola sesión mordió tres veces:
 *
 *   · 31-sincronizar-modo-ambas-direcciones  400 ms  → empate exacto con el expect.poll
 *   · 55-mapa-vintage                        700 ms  → verde en local, rojo en tanda
 *   · 04-iframe-dom                          umbral  → test vacuo, pasaba con y sin el fallo
 *
 * Las tres se detectaron DESPUÉS, al ver el rojo. Esta herramienta las detecta al escribirlas.
 *
 * CÓMO FUNCIONA — trinquete, no prohibición
 *
 * Hay 165 esperas heredadas. Prohibirlas de golpe daría 165 avisos y el ruido taparía la
 * señal. Así que se fija una línea base: NO SE PUEDE SUBIR. Cuando se arregla una vieja, la
 * base baja sola con --actualizar y ya no puede volver a subir.
 *
 * EXCEPCIÓN LEGÍTIMA
 *
 * Una espera fija SÍ es correcta como ventana de observación: comprobar que algo NO ocurre
 * no se puede hacer esperando a una condición. Se marca con un comentario en la línea
 * anterior o en la misma:
 *
 *     // VENTANA-OBSERVACION: sin pulsar el botón verde, nunca debe enviarse RETO.COMPLETADO
 *     await page.waitForTimeout(8000);
 *
 * Las marcadas no cuentan. La marca exige explicar POR QUÉ — sin motivo no vale.
 *
 * USO
 *     node tools/verificar-esperas.js              comprueba contra la base
 *     node tools/verificar-esperas.js --actualizar baja la base (solo si ha bajado)
 *     node tools/verificar-esperas.js --listar     enseña dónde están
 */

const fs = require('fs');
const path = require('path');

const DIR_TESTS = path.join(__dirname, '..', 'tests', 'e2e');
const FICHERO_BASE = path.join(__dirname, 'esperas-base.json');
const MARCA = 'VENTANA-OBSERVACION';
const PATRON = /waitForTimeout\s*\(/;

function recolectar() {
  const hallazgos = [];
  let marcadas = 0;

  const ficheros = fs.readdirSync(DIR_TESTS)
    .filter((f) => f.endsWith('.spec.js'))
    .sort();

  for (const fichero of ficheros) {
    const ruta = path.join(DIR_TESTS, fichero);
    const lineas = fs.readFileSync(ruta, 'utf-8').split(/\r?\n/);

    lineas.forEach((linea, i) => {
      if (!PATRON.test(linea)) return;
      // Se acepta la marca en la propia línea o en la anterior (comentario encima).
      const anterior = i > 0 ? lineas[i - 1] : '';
      if (linea.includes(MARCA) || anterior.includes(MARCA)) { marcadas++; return; }
      hallazgos.push({ fichero, linea: i + 1, texto: linea.trim().slice(0, 90) });
    });
  }
  return { hallazgos, marcadas };
}

function leerBase() {
  try {
    return JSON.parse(fs.readFileSync(FICHERO_BASE, 'utf-8')).maximo;
  } catch {
    return null;
  }
}

const { hallazgos, marcadas } = recolectar();
const total = hallazgos.length;
const base = leerBase();
const args = process.argv.slice(2);

if (args.includes('--listar')) {
  console.log(`\nEsperas ciegas (${total}), sin contar ${marcadas} marcadas como ventana de observación:\n`);
  let ultimo = '';
  for (const h of hallazgos) {
    if (h.fichero !== ultimo) { console.log(`  ${h.fichero}`); ultimo = h.fichero; }
    console.log(`     L${String(h.linea).padEnd(5)} ${h.texto}`);
  }
  console.log('');
  process.exit(0);
}

if (base === null) {
  fs.writeFileSync(FICHERO_BASE, JSON.stringify({ maximo: total }, null, 2) + '\n');
  console.log(`[esperas] Línea base creada: ${total} esperas ciegas (${marcadas} marcadas, no cuentan).`);
  process.exit(0);
}

if (args.includes('--actualizar')) {
  if (total < base) {
    fs.writeFileSync(FICHERO_BASE, JSON.stringify({ maximo: total }, null, 2) + '\n');
    console.log(`[esperas] ✅ Línea base bajada: ${base} → ${total}. Ya no puede volver a subir.`);
  } else {
    console.log(`[esperas] La base sigue en ${base} (actual: ${total}). Solo baja, nunca sube.`);
  }
  process.exit(0);
}

if (total > base) {
  const nuevas = total - base;
  console.error(`\n[esperas] ❌ ${nuevas} espera(s) ciega(s) NUEVA(S): ${base} → ${total}\n`);
  console.error('  Una espera fija funciona en tu máquina y falla en tandas completas.');
  console.error('  Espera a una CONDICIÓN (expect.poll, waitForFunction) o reintenta hasta');
  console.error('  que el efecto ocurra. Ver EJE 23 en docs/GUIA-COMPLETA.md.\n');
  console.error(`  Si de verdad es una ventana de observación —comprobar que algo NO ocurre—,`);
  console.error(`  márcala explicando el motivo:\n`);
  console.error(`      // ${MARCA}: <por qué hace falta esperar un tiempo fijo>\n`);
  console.error('  Para ver todas:  node tools/verificar-esperas.js --listar\n');
  process.exit(1);
}

if (total < base) {
  console.log(`[esperas] ✅ ${total} esperas ciegas (base ${base}). Han bajado ${base - total}.`);
  console.log('          Fija la mejora con:  npm run verificar-esperas -- --actualizar');
} else {
  console.log(`[esperas] ✅ ${total} esperas ciegas, igual que la base. ${marcadas} marcadas como ventana de observación.`);
}
