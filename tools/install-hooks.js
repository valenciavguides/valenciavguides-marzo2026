#!/usr/bin/env node
/**
 * install-hooks.js — Instala el hook de pre-commit que mantiene CACHE_VERSION
 * al día automáticamente (ver tools/build-sw.js). Se ejecuta solo desde
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
 * El hook en sí es un envoltorio mínimo: llama a build-sw.js en modo
 * `--staged` (lee del índice de git, no del disco — ver cabecera de
 * build-sw.js) y nunca bloquea el commit, ni siquiera si build-sw.js lanza
 * una excepción — es auto-fix, no un gate de validación.
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
// Actualiza CACHE_VERSION automáticamente si cambió algo del App Shell; nunca bloquea el commit.
try {
  require('../../tools/build-sw.js').main({ staged: true, hookMode: true });
} catch (e) {
  console.error('[pre-commit] build-sw falló, continuando sin bloquear el commit:', e && e.message);
}
process.exit(0);
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
            console.warn('[install-hooks] CACHE_VERSION seguirá actualizándose a mano hasta que se resuelva ese conflicto.');
            return;
        }
    }

    fs.writeFileSync(HOOK_PATH, HOOK_CONTENT, 'utf8');
    fs.chmodSync(HOOK_PATH, 0o755);
    console.log('[install-hooks] Hook de pre-commit instalado en .git/hooks/pre-commit');
}

main();
