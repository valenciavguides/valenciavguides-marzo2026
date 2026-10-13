#!/usr/bin/env node
/**
 * tanda-vigilada.js — lanza Playwright con el vigía térmico al lado
 *
 *   npm run test:e2e:vigilada                          la tanda de los cuatro navegadores
 *   npm run test:e2e:vigilada -- --project=iphone12    un proyecto
 *   npm run test:e2e:vigilada -- tests/e2e/01-fase1-boot.spec.js --project=chromium
 *   npm run test:e2e:vigilada -- --corte=80 …          otra temperatura de corte (85 °C por defecto)
 *
 * Todo lo que no sea `--corte=` pasa tal cual a `playwright test`.
 *
 * POR QUÉ EXISTE
 *
 * Una tanda calienta el equipo, y si la zona térmica del sistema llega a su punto crítico Windows hiberna en mitad
 * de la tanda. Al reanudar, la tanda sigue sola, vuelve a calentar, y lo que ha medido ya no vale. El vigía
 * (`tools/vigia-termico.ps1`) lee esa zona cada segundo y, si llega a la temperatura de corte, para la tanda entera
 * —Playwright, sus workers y sus navegadores— mucho antes del punto crítico.
 *
 * CÓMO FUNCIONA
 *
 *   1. Arranca el vigía y espera a su primera muestra: Playwright no se lanza sin vigilancia, ni con el equipo ya
 *      en la temperatura de corte.
 *   2. Lanza `playwright test` con los argumentos recibidos. Mientras corre, cada muestra del vigía que esté en el
 *      corte o por encima para todo lo que cuelga de este proceso menos el propio vigía.
 *   3. Al acabar la tanda para el vigía e imprime cuántas muestras hay, la temperatura máxima y dónde está el CSV
 *      (una línea por segundo: temperatura, CPU y procesos de navegador).
 *
 * Una tanda cortada NO cuenta como tanda: este script lo dice y sale con código 3. Si no, sale con el código de
 * Playwright.
 *
 * Solo hay vigía en Windows, que es donde se desarrolla: en otro sistema avisa y lanza Playwright sin él.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const CORTE_POR_DEFECTO = 85;
const ESPERA_VIGIA_MS = 30_000;

const args = process.argv.slice(2);
const iCorte = args.findIndex((a) => a.startsWith('--corte='));
const corte = iCorte >= 0 ? Number(args.splice(iCorte, 1)[0].slice('--corte='.length)) : CORTE_POR_DEFECTO;
if (!Number.isFinite(corte) || corte < 40 || corte > 95) {
  console.error(`[tanda-vigilada] --corte tiene que ser una temperatura entre 40 y 95 °C (recibido: ${corte}).`);
  process.exit(2);
}

const sello = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const csv = path.join(os.tmpdir(), `vv-vigia-termico-${sello}.csv`);

/** Las filas de datos del CSV del vigía: [hora, grados, cpu, procesos, nota]. */
function muestras() {
  if (!fs.existsSync(csv)) return [];
  return fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter((l) => /^\d\d:\d\d:\d\d;/.test(l)).map((l) => l.split(';'));
}

function lanzarVigia() {
  if (process.platform !== 'win32') {
    console.warn('[tanda-vigilada] Sin vigía térmico: solo existe para Windows. Playwright se lanza igualmente.');
    return Promise.resolve(null);
  }
  const vigia = spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'vigia-termico.ps1'),
    '-Salida', csv, '-CorteC', String(corte), '-PidTanda', String(process.pid)], { cwd: RAIZ, stdio: 'ignore' });
  return new Promise((resolve, reject) => {
    const desde = Date.now();
    const mira = setInterval(() => {
      if (muestras().length > 0) { clearInterval(mira); resolve(vigia); return; }
      if (vigia.exitCode !== null || Date.now() - desde > ESPERA_VIGIA_MS) {
        clearInterval(mira);
        if (vigia.exitCode === null) vigia.kill();
        reject(new Error(`el vigía térmico no ha dado ninguna muestra en ${ESPERA_VIGIA_MS / 1000} s`));
      }
    }, 250);
  });
}

/** Los grados de una fila del CSV (el vigía escribe la coma decimal del sistema). */
const gradosDe = (fila) => Number(String(fila[1]).replace(',', '.'));

lanzarVigia().then((vigia) => {
  if (vigia) {
    // Con el equipo ya en el corte, lanzar la tanda solo serviría para que el vigía la parase al momento.
    const deSalida = gradosDe(muestras()[0]);
    if (deSalida >= corte) {
      vigia.kill();
      console.error(`[tanda-vigilada] ❌ El equipo ya está a ${deSalida} °C, en el corte (${corte} °C) o por encima: no se lanza Playwright. Deje enfriar el equipo.`);
      process.exit(3);
    }
    console.log(`[tanda-vigilada] Vigía térmico en marcha: ${deSalida} °C de salida, corta a ${corte} °C. CSV: ${csv}`);
  }
  const tanda = spawn(process.execPath, [path.join(RAIZ, 'node_modules', '@playwright', 'test', 'cli.js'), 'test', ...args], { cwd: RAIZ, stdio: 'inherit' });
  tanda.on('exit', (codigo) => {
    if (vigia && vigia.exitCode === null) vigia.kill();
    const filas = muestras();
    const grados = filas.map(gradosDe).filter((n) => Number.isFinite(n) && n > 0);
    const cortada = filas.some((f) => /^CORTE/.test(f[4] || ''));
    if (vigia) {
      console.log(`[tanda-vigilada] ${filas.length} muestras; temperatura máxima ${grados.length ? Math.max(...grados) + ' °C' : 'sin lectura'} (corte a ${corte} °C). CSV: ${csv}`);
    }
    if (cortada) {
      console.error('[tanda-vigilada] ❌ CORTADA por temperatura: esta tanda NO cuenta. Deje enfriar el equipo antes de repetirla.');
      process.exit(3);
    }
    process.exit(codigo === null ? 1 : codigo);
  });
}).catch((e) => {
  console.error(`[tanda-vigilada] ❌ ${e.message}. No se lanza Playwright.`);
  process.exit(2);
});
