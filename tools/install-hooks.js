#!/usr/bin/env node
/**
 * install-hooks.js — Instala el hook de pre-commit que mantiene al día, solos,
 * js/demo-aventuras.js y CACHE_VERSION (ver tools/build-demo.js y tools/build-sw.js). Se ejecuta solo desde
 * `postinstall` en package.json, tras cada `npm install`.
 *
 * Qué hace:
 *   1. Si no hay `.git` (código instalado fuera de un repo git — p.ej. copiado
 *      sin clonar), se omite en silencio con código 0. No debe romper
 *      `npm install` en ese contexto.
 *   2. Crea `.git/hooks/` si no existe — este repositorio no lo trae por
 *      defecto (confirmado: no hay ni siquiera los `.sample` que `git init`
 *      suele dejar).
 *   3. Si ya hay un `.git/hooks/pre-commit` de otra herramienta (sin la marca
 *      `vvguides-managed-hook`), avisa y no lo toca — para no pisar un hook
 *      de Husky o similar si se añade más adelante.
 *   4. Escribe el hook (marcado, para poder reinstalarlo de forma idempotente
 *      en el siguiente `npm install`) y le da permisos de ejecución.
 *
 * El hook en sí es un envoltorio mínimo: llama a build-demo.js y después a
 * build-sw.js, los dos en modo `--staged` (leen del índice de git, no del
 * disco — ver cabecera de build-sw.js), y nunca bloquea el commit, ni siquiera
 * si uno de los dos lanza una excepción — es auto-fix, no un gate de validación.
 * El orden importa: la demo es parte del App Shell, y CACHE_VERSION tiene que
 * contar ya la demo regenerada.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GIT_DIR = path.join(ROOT, '.git');
const HOOKS_DIR = path.join(GIT_DIR, 'hooks');
const HOOK_PATH = path.join(HOOKS_DIR, 'pre-commit');
const MARKER = 'vvguides-managed-hook';

const HOOK_CONTENT = `#!/usr/bin/env node
// ${MARKER} — instalado por tools/install-hooks.js (se reinstala en cada npm install, no editar a mano)
// Regenera js/demo-aventuras.js si cambiaron sus fuentes y después actualiza CACHE_VERSION si cambió algo del App Shell
// (la demo es parte del shell: por eso va primero); nunca bloquea el commit.
(async () => {
  try {
    await require('../../tools/build-demo.js').main({ staged: true, hookMode: true });
  } catch (e) {
    console.error('[pre-commit] build-demo falló, continuando sin bloquear el commit:', e && e.message);
  }
  try {
    require('../../tools/build-sw.js').main({ staged: true, hookMode: true });
  } catch (e) {
    console.error('[pre-commit] build-sw falló, continuando sin bloquear el commit:', e && e.message);
  }
  process.exit(0);
})();
`;

function main() {
    if (!fs.existsSync(GIT_DIR)) {
        console.log('[install-hooks] No hay .git — se omite (no es un repositorio git).');
        return;
    }

    if (!fs.existsSync(HOOKS_DIR)) {
        fs.mkdirSync(HOOKS_DIR, { recursive: true });
    }

    if (fs.existsSync(HOOK_PATH)) {
        const existente = fs.readFileSync(HOOK_PATH, 'utf8');
        if (!existente.includes(MARKER)) {
            console.warn('[install-hooks] Ya existe .git/hooks/pre-commit de otra herramienta — no se sobreescribe.');
            console.warn('[install-hooks] La demo y CACHE_VERSION seguirán actualizándose a mano (npm run build:demo y npm run build:sw) hasta que se resuelva ese conflicto.');
            return;
        }
    }

    fs.writeFileSync(HOOK_PATH, HOOK_CONTENT, 'utf8');
    fs.chmodSync(HOOK_PATH, 0o755);
    console.log('[install-hooks] Hook de pre-commit instalado en .git/hooks/pre-commit');
}

main();
