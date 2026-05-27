/**
 * fix-empty-catches.mjs
 * Replaces empty catch blocks (S2486) with logger.debug calls.
 * NOSONAR is not being recognized by SonarLint in this project,
 * so we add actual content to satisfy the rule definitively.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = './codigo-padre.html';
let src = readFileSync(FILE, 'utf8');

let count = 0;

// ── Single-line empty catches (no real code in body) ──────────────────────────
// Handles all variations: empty body, /* comment */, /* multi word comment */
// Pattern: } catch (VAR) { [optional comment] } // NOSONAR
src = src.replace(
  /\} catch \((\w+)\) \{([^}]*?)\} (\/\/ NOSONAR)/g,
  (match, varName, body, nosonar) => {
    const trimmed = body.trim();
    // Only replace if body is empty or only has a block comment
    const isEmptyOrComment = !trimmed || /^\/\*[\s\S]*?\*\/$/.test(trimmed);
    if (!isEmptyOrComment) return match;
    count++;
    return `} catch (${varName}) { logger.debug('[VV]:', ${varName}?.message); } ${nosonar}`;
  }
);

// ── Compact form: }catch(e){} // NOSONAR (no spaces) ─────────────────────────
src = src.replace(/\}catch\((\w+)\)\{\} (\/\/ NOSONAR)/g, (match, varName, nosonar) => {
  count++;
  return `} catch (${varName}) { logger.debug('[VV]:', ${varName}?.message); } ${nosonar}`;
});

// ── Multiline empty catches: } catch (e) { // NOSONAR\n   // comment\n   } ──
// Three known instances (lines ~3169, ~3437, ~12475)
// Using CRLF-aware replacement
const MULTILINE_PATTERNS = [
  {
    from: '} catch (e) { // NOSONAR\r\n            // Ignore - can\'t expose in this environment\r\n        }',
    to:   '} catch (e) { // NOSONAR\r\n            logger.debug(\'[VV]:\', e?.message);\r\n        }'
  },
  {
    from: '} catch (e) { // NOSONAR\r\n            // Ignorar si no se puede exponer (por ejemplo CSP estrictos)\r\n        }',
    to:   '} catch (e) { // NOSONAR\r\n            logger.debug(\'[VV]:\', e?.message);\r\n        }'
  },
  {
    from: '} catch (e) { // NOSONAR\r\n                // Silencioso para no saturar logs\r\n            }',
    to:   '} catch (e) { // NOSONAR\r\n                logger.debug(\'[VV]:\', e?.message);\r\n            }'
  },
];

for (const { from, to } of MULTILINE_PATTERNS) {
  if (src.includes(from)) {
    src = src.replace(from, to);
    count++;
  } else {
    // Try LF-only in case endings differ
    const fromLF = from.replace(/\r\n/g, '\n');
    const toLF = to.replace(/\r\n/g, '\n');
    if (src.includes(fromLF)) {
      src = src.replace(fromLF, toLF);
      count++;
    } else {
      console.warn('WARNING: multiline pattern not found:', from.slice(0, 60));
    }
  }
}

writeFileSync(FILE, src, 'utf8');

console.log(`=== fix-empty-catches completado ===`);
console.log(`  catches fijados: ${count}`);

// Verify: count remaining empty catches
const remaining = (src.match(/\} catch \(\w+\) \{\s*\} \/\/ NOSONAR/g) || []).length;
const remainingCompact = (src.match(/\}catch\(\w+\)\{\} \/\/ NOSONAR/g) || []).length;
console.log(`  catches vacíos restantes: ${remaining + remainingCompact}`);
