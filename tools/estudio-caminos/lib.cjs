'use strict';
/**
 * lib.cjs — piezas comunes de los extractores del estudio «un solo camino» (docs/estudio-caminos.md, ronda 2).
 *
 * ROOT    raíz del repo, resuelta desde este fichero (no depende de desde dónde se lance el script).
 * SALIDA  carpeta donde los extractores dejan sus ficheros intermedios (funciones.json, mensajes.json…) y sus informes.
 *         Por defecto <tmp del sistema>/estudio-caminos; se cambia con la variable de entorno ESTUDIO_SALIDA.
 *         Nunca es una carpeta del repo: los extractores no ensucian el árbol de trabajo.
 * salida  ruta de un fichero dentro de SALIDA.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SALIDA = process.env.ESTUDIO_SALIDA ? path.resolve(process.env.ESTUDIO_SALIDA) : path.join(os.tmpdir(), 'estudio-caminos');
fs.mkdirSync(SALIDA, { recursive: true });

const salida = (nombre) => path.join(SALIDA, nombre);

module.exports = { ROOT, SALIDA, salida };
