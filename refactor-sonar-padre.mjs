/**
 * refactor-sonar-padre.mjs
 * Corrige los problemas SonarLint mecánicos en codigo-padre.html:
 *  - S2228: console.* → logger.* (o (globalThis.logger||console).* antes de init)
 *  - S3504: var → let/const en cuerpos de funciones
 *  - S7781: .replace(/g-flag/,s) → .replaceAll(s, r)
 *  - S4325: parseFloat → Number.parseFloat
 *  - S1135: TODO comments en español que no son reales → renombrar
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');

// ── Línea en que logger queda definido (var logger = ...)  ──────────────────
// Las líneas anteriores usan la forma segura (globalThis.logger || console)
// Las posteriores usan simplemente logger
const LOGGER_INIT_LINE = 3009;

const lines = src.split('\n');

// ── 1. console.* → logger.* ──────────────────────────────────────────────────

const CONSOLE_MAP = {
  'console.log(':     'logger.info(',
  'console.info(':    'logger.info(',
  'console.warn(':    'logger.warn(',
  'console.error(':   'logger.error(',
  'console.debug(':   'logger.debug(',
  'console.success(': 'logger.success(',
};

// Patrón seguro para líneas antes de la init (no hay logger todavía)
const CONSOLE_MAP_SAFE = {
  'console.log(':     '(globalThis.logger || console).info(',
  'console.info(':    '(globalThis.logger || console).info(',
  'console.warn(':    '(globalThis.logger || console).warn(',
  'console.error(':   '(globalThis.logger || console).error(',
  'console.debug(':   '(globalThis.logger || console).debug(',
  'console.success(': '(globalThis.logger || console).info(',
};

// console.assert y console.clear no tienen equivalente en logger → los dejamos
const CONSOLE_SKIP = ['console.assert(', 'console.clear('];

let consoleFixed = 0;

const newLines = lines.map((line, idx) => {
  const lineNum = idx + 1;

  // Saltar líneas comentadas
  const trimmed = line.trimStart();
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return line;

  // Saltar strings/template literals que contienen "console." (heurística: está entre comillas)
  // Lo manejamos con un enfoque simple: si la ocurrencia de console. está precedida por ' " ` la saltamos

  let result = line;
  for (const skip of CONSOLE_SKIP) {
    if (result.includes(skip)) return result; // no tocar
  }

  const map = lineNum < LOGGER_INIT_LINE ? CONSOLE_MAP_SAFE : CONSOLE_MAP;

  for (const [from, to] of Object.entries(map)) {
    if (result.includes(from)) {
      result = result.replaceAll(from, to);
      consoleFixed++;
    }
  }
  return result;
});

src = newLines.join('\n');

// ── 2. Caso especial: handleIframeError doble log (console + logger) ────────
// Patrón: console.error(X, Y);\n    // If logger...\n    if (globalThis.logger?.error) {\n       globalThis.logger.error(X, Y);\n    }
// → simplificar a (globalThis.logger || console).error(X, Y);
// Hecho implícitamente por el paso anterior: console.error ya es (globalThis.logger||console).error

// ── 3. parseFloat → Number.parseFloat ────────────────────────────────────────
const prevLen3 = src.length;
// Solo standalone parseFloat( (no Number.parseFloat ni window.parseFloat)
src = src.replace(/(?<![.\w])parseFloat\(/g, 'Number.parseFloat(');
const parsefloatFixed = (src.match(/Number\.parseFloat\(/g) || []).length;

// ── 4. .replace(/pattern/g, ...) → .replaceAll('pattern', ...) ───────────────
// Solo casos simples con patrón de string literal dentro del regex
let replaceAllFixed = 0;

// Caso: .replace(/-/g, '') → .replaceAll('-', '')
src = src.replace(/\.replace\(\/-\/g,\s*''\)/g, () => { replaceAllFixed++; return ".replaceAll('-', '')"; });

// Caso: .replace(/^padre-/, '') → no es /g flag → dejar como está (ya es correcto)
// Caso: .replace(/\s+/g, ...) → dejar (más complejo)

// ── 5. var → let  (solo en cuerpos de función, con heurística de indentación) ─
let varFixed = 0;

// Reemplazar "var " al inicio (con sangría) cuando está claramente dentro de una función
// Heurística: líneas con indentación ≥ 8 espacios o ≥ 2 tabs que tienen "var "
// Excepciones: var logger (línea 3009), var loggerScript (dentro de async)
src = src.replace(/^([ \t]{8,})(var )(?!logger\b|_impl\b|_queue\b|args\b|r\b|res\b|reg\b|regFail\b)(\w)/gm, (match, indent, _var, firstChar) => {
  varFixed++;
  return `${indent}let ${firstChar}`;
});

// También vars con 4+ espacios que son claramente locales (no en script top level)
// Solo los que sabemos seguros por contexto (selectores, styles, etc.)
src = src.replace(/^([ \t]{4,})(var )(selector|style|chat|hijo4|backdrop|imgOverlay|attempts|maxAttempts|els|candidates|alt|st|item|req|resp)\b/gm, (match, indent, _var, name) => {
  varFixed++;
  return `${indent}let ${name}`;
});

// ── 6. Loose equality == / != → === / !== (solo casos no ambiguos) ─────────
let eqFixed = 0;

// Patrones seguros: comparaciones con null, undefined, true, false, 0, '', números
src = src.replace(/([^\!<>=])=== null/g, (m) => m); // ya es ===, skip
src = src.replace(/([^\!<>=])(?<!=|!)== (null|undefined|true|false|0|'[^']*'|"[^"]*")/g, (match, pre, val) => {
  eqFixed++;
  return `${pre}=== ${val}`;
});
src = src.replace(/([^\!<>=])!= (null|undefined|true|false|0|'[^']*'|"[^"]*")/g, (match, pre, val) => {
  // Make sure not already !==
  if (match.includes('!==')) return match;
  eqFixed++;
  return `${pre}!== ${val}`;
});

// ── 7. Limpiar doble-logging en handleIframeError (líneas 89-96) ─────────────
// Ya fue manejado en paso 1: console.error → (globalThis.logger||console).error
// Eliminar el bloque redundante "if (globalThis.logger?.error) { globalThis.logger.error... }"
src = src.replace(
  /(\(globalThis\.logger \|\| console\)\.error\([^)]+\);)\s*\/\/ If logger is available.*\n\s*if \(globalThis\.logger\?\.error\) \{\s*\n\s*globalThis\.logger\.error\([^)]+\);\s*\n\s*\}/,
  '$1'
);

// ── Verificación ──────────────────────────────────────────────────────────────
writeFileSync(FILE, src, 'utf8');

console.log('=== refactor-sonar-padre completado ===');
console.log(`  console.* reemplazados : ~${consoleFixed}`);
console.log(`  var→let fijos          : ${varFixed}`);
console.log(`  replaceAll fijados     : ${replaceAllFixed}`);
console.log(`  equality fijados       : ${eqFixed}`);

// Verificación rápida
const remaining = (src.match(/\bconsole\.(log|warn|error|debug|info|success)\(/g) || []).length;
console.log(`  console.* que quedan   : ${remaining} (assert/clear excluidos)`);

const remainingVar = (src.match(/\bvar \b/g) || []).length;
console.log(`  var que quedan         : ${remainingVar}`);
