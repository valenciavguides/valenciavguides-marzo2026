/**
 * 136 — `index.html` lleva a la app por un solo camino.
 *
 * `index.html` solo se abre al entrar por la raíz del dominio (la PWA instalada arranca en
 * `/codigo-padre.html`, `start_url` de `manifest.json`). Su único trabajo es llevar al padre, y lo
 * hace con un solo `location.replace` en el `<head>`: la regla de HTTPS y el registro del service
 * worker los hace el padre en cuanto carga, y el enlace del cuerpo queda para quien no tiene
 * JavaScript (estudio K-114).
 *
 *   IX-1  En el código de `index.html` hay una sola navegación (`location.replace('codigo-padre.html')`),
 *         ningún registro del service worker y ninguna regla de HTTPS propia.
 *   IX-2  Entrar por `/` y por `/index.html` deja en `/codigo-padre.html`.
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '../..');

// Sin service worker: el padre lo registra al cargar, y aquí solo interesa adónde lleva index.html.
test.use({ serviceWorkers: 'block' });

test.describe('IX — index.html lleva a la app por un solo camino', () => {
  test('IX-1. Una sola navegación, sin registro del service worker ni regla de HTTPS propios', () => {
    const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
    // Solo el código de los <script> (sin los comentarios HTML, que pueden citar lo que no hay).
    const sinComentarios = html.replace(/<!--[\s\S]*?-->/g, '');
    const codigo = [...sinComentarios.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
    const navegaciones = codigo.match(/location\s*\.\s*(replace|assign)\s*\(|location\s*\.\s*href\s*=(?!=)|location\s*=(?!=)/g) || [];
    expect(navegaciones, `navegaciones en index.html: ${navegaciones.join(' | ')}`).toHaveLength(1);
    expect(codigo).toContain("location.replace('codigo-padre.html')");
    expect(codigo).not.toContain('serviceWorker');
    expect(codigo).not.toContain('https:');
  });

  for (const ruta of ['/', '/index.html']) {
    test(`IX-2. Entrar por ${ruta} deja en /codigo-padre.html`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: 'commit' });
      await page.waitForURL(/\/codigo-padre\.html$/, { timeout: 15000 });
      expect(new URL(page.url()).pathname).toBe('/codigo-padre.html');
    });
  }
});
