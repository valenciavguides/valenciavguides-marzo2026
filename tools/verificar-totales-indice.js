#!/usr/bin/env node
/**
 * verificar-totales-indice.js — los totales del índice, precalculados y vigilados
 *
 * POR QUÉ EXISTE
 *
 * `cargarAventurasDinamicamente()` (En-busca-del-tesoro.html) mostraba los totales de cada
 * aventura —paradas, tramos, retos, monumentos, audios— importando los CUATRO ficheros de
 * datos en tiempo de ejecución:
 *
 *     aventuras-ID-padre.js     1,8 MB
 *     coordenadas-aventuras.js  562 KB
 *     retos-aventuras.js        946 KB
 *     audios-aventuras.js
 *
 * Es decir: ~2 MB de contenido de pago descargados en la PANTALLA DE SELECCIÓN, antes de
 * introducir ningún código, para obtener 35 números enteros (5 por aventura × 7).
 *
 * Ahora esos números viven precalculados en js/indice-aventuras.js, que son 6 KB y ya se
 * cargaba de todos modos. Los cuatro imports desaparecen (pendiente 13, §22.12).
 *
 * EL RIESGO QUE ESTA HERRAMIENTA CUBRE
 *
 * Un dato precalculado se queda obsoleto en silencio cuando cambia el contenido: añades una
 * parada y el botón sigue diciendo el número viejo. Nadie se entera. Por eso el generador
 * viene con verificador: recalcula desde la fuente y falla si difiere.
 *
 * USO
 *     node tools/verificar-totales-indice.js            comprueba (falla si hay deriva)
 *     node tools/verificar-totales-indice.js --escribir recalcula y actualiza el índice
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const RUTA_INDICE = path.join(RAIZ, 'js', 'indice-aventuras.js');
const CAMPOS = ['totalParadas', 'totalTramos', 'totalRetos', 'totalMonumentos', 'totalAudios'];

/** Carga un módulo de datos sin ESM: se le quita `export` y se evalúa. */
function cargarDatos(fichero, nombreExport) {
  const fuente = fs.readFileSync(path.join(RAIZ, 'js', fichero), 'utf-8').replace(/export\s+/g, '');
  const modulo = { exports: {} };
  new Function('module', `${fuente}\nmodule.exports = { valor: ${nombreExport} };`)(modulo);
  return modulo.exports.valor;
}

function calcularTotales() {
  const padre = cargarDatos('aventuras-ID-padre.js', 'DATOS_PADRE');
  const coord = cargarDatos('coordenadas-aventuras.js', 'DATOS_AVENTURAS');
  const retos = cargarDatos('retos-aventuras.js', 'RETOS_AVENTURAS');
  const audios = cargarDatos('audios-aventuras.js', 'AUDIOS_AVENTURAS');
  const indice = cargarDatos('indice-aventuras.js', 'INDICE_AVENTURAS');

  const resultado = {};
  for (const [id, meta] of Object.entries(indice)) {
    // Mismo cálculo que hacía _calcularTotalesAventura() en runtime, con 'es' como idioma
    // de referencia: los totales no dependen del idioma elegido.
    const elementos = padre?.[id]?.es?.elementosIDpadre || [];
    const coordenadas = coord?.[id]?.[meta.claveCoord]?.coordenadas || [];
    const retosEs = retos?.[id]?.es;
    const audiosEs = audios?.[id]?.es;

    resultado[id] = {
      totalParadas: elementos.filter((e) => e.tipo === 'parada' || e.tipo === 'inicio').length,
      totalTramos: elementos.filter((e) => e.tipo === 'tramo').length,
      totalRetos: Array.isArray(retosEs) ? retosEs.length : 0,
      totalMonumentos: coordenadas.filter((c) => c.tipo === 'referencia').length,
      // Solo cuentan los audios con fichero real grabado (campo .file no vacío).
      totalAudios: Array.isArray(audiosEs) ? audiosEs.filter((a) => a.file && a.file.trim() !== '').length : 0,
    };
  }
  return { resultado, indice };
}

/**
 * Inserta o actualiza los totales dentro de la entrada de cada aventura.
 *
 * Se recorre por LÍNEAS a propósito, sin expresiones regulares: el fichero tiene una
 * estructura fija y predecible, y una regex multilínea sobre 7 bloques anidados es
 * frágil de escribir y peor de leer.
 */
function escribirEnIndice(totales) {
  const original = fs.readFileSync(RUTA_INDICE, 'utf-8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const lineas = original.replace(/\r\n/g, '\n').split('\n');

  const salida = [];
  let aventuraActual = null;
  let escritas = 0;

  for (const linea of lineas) {
    // Cabecera de aventura: "    Aventura1: {"
    const cabecera = linea.match(/^\s{4}(\w+):\s*\{\s*$/);
    if (cabecera && totales[cabecera[1]]) aventuraActual = cabecera[1];

    // Se descartan los totales que ya hubiera: se reescriben todos.
    if (aventuraActual && CAMPOS.some((c) => linea.trim().startsWith(`${c}:`))) continue;

    salida.push(linea);

    // Se insertan justo después de `claveCoord`, que toda entrada tiene.
    if (aventuraActual && linea.trim().startsWith('claveCoord:')) {
      const t = totales[aventuraActual];
      CAMPOS.forEach((c) => salida.push(`        ${c}: ${t[c]},`));
      escritas++;
      aventuraActual = null;
    }
  }

  if (escritas !== Object.keys(totales).length) {
    throw new Error(`Solo se escribieron ${escritas} de ${Object.keys(totales).length} aventuras — revisa la estructura de ${RUTA_INDICE}`);
  }

  fs.writeFileSync(RUTA_INDICE, salida.join('\n').replace(/\n/g, eol));
  return escritas;
}

const { resultado, indice } = calcularTotales();

if (process.argv.includes('--escribir')) {
  const n = escribirEnIndice(resultado);
  console.log(`[totales] ✅ Índice actualizado (${n} aventuras):`);
  for (const [id, t] of Object.entries(resultado)) {
    const resumen = CAMPOS.map((c) => `${c.replace('total', '').toLowerCase()}=${t[c]}`).join('  ');
    console.log(`   ${id.padEnd(16)} ${resumen}`);
  }
  process.exit(0);
}

// Modo verificación: recalcular desde la fuente y comparar con lo escrito.
const derivas = [];
for (const [id, t] of Object.entries(resultado)) {
  for (const campo of CAMPOS) {
    const enIndice = indice[id]?.[campo];
    if (enIndice === undefined) {
      derivas.push(`${id}.${campo}: falta en el índice (real: ${t[campo]})`);
    } else if (enIndice !== t[campo]) {
      derivas.push(`${id}.${campo}: el índice dice ${enIndice}, la fuente dice ${t[campo]}`);
    }
  }
}

if (derivas.length > 0) {
  console.error(`\n[totales] ❌ El índice está desincronizado de los datos (${derivas.length}):\n`);
  derivas.forEach((d) => console.error(`   · ${d}`));
  console.error('\n  Estos totales se muestran en los botones de la pantalla de selección. Si el');
  console.error('  contenido cambia y no se regeneran, el usuario ve números viejos y nadie se entera.\n');
  console.error('  Arreglar con:  npm run verificar-totales -- --escribir\n');
  process.exit(1);
}

console.log(`[totales] ✅ Los ${Object.keys(resultado).length * CAMPOS.length} totales del índice coinciden con los datos.`);
