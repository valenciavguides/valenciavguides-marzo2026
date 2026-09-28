'use strict';

/**
 * 113 — La API vive en el MISMO origen que la página, en local y en producción
 *
 * POR QUÉ EXISTE
 *
 * El CSP de los HTML declara `connect-src 'self' …` y no lista ningún `localhost:3001`.
 * Mientras el front se sirve en `:8080`, `'self'` es `localhost:8080`: una llamada a
 * `http://localhost:3001/api/...` la bloquea el navegador **en local**, mientras que en el
 * VPS la misma llamada funciona porque allí frontend y API comparten dominio (Caddy reparte).
 * Es un "funciona en producción pero no en local" que no se ve hasta que existe el backend
 * — y para entonces parece un fallo del frontend.
 *
 * Se cierra por el lado del entorno, no del CSP: `js/server.js` hace de proxy inverso para
 * `/api/*` hacia el backend, igual que Caddy en producción, y los dos clientes de red
 * (`api-client.js`, `data-loader.js`) usan una ruta RELATIVA. Un solo origen en los dos
 * entornos, sin CORS en ninguno y sin excepciones en el CSP.
 *
 * AO-1  La página llama a `/api/...` y la respuesta llega: el proxy entrega y el CSP no
 *       bloquea. Se mide desde dentro de la página (fetch real), no con curl: un curl no
 *       pasa por el CSP, que es justo lo que hay que comprobar.
 * AO-2  Sin backend detrás, el proxy contesta 502 con un código legible en vez de colgarse
 *       o de dar un error mudo que se confundiría con un bug del frontend.
 * AO-3  Los dos clientes de red apuntan a ruta relativa — si alguien vuelve a poner una URL
 *       absoluta con puerto, local y producción se separan otra vez.
 *
 * ROJO ANTES QUE VERDE: con `baseUrl`/`API_BASE` apuntando a `http://localhost:3001/api`
 * (como estaban), AO-1 cae por violación de CSP y AO-3 cae por la URL absoluta.
 */

const { test, expect } = require('@playwright/test');
const http = require('node:http');
const path = require('node:path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const PUERTO_API = Number(process.env.API_PORT) || 3001;

/** Backend de mentira, mínimo: contesta lo que contestaría el real a /api/health. */
function levantarBackendFalso() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ exito: true, ruta: req.url, metodo: req.method }));
    });
    srv.on('error', reject);
    srv.listen(PUERTO_API, '127.0.0.1', () => resolve(srv));
  });
}

async function abrirApp(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

test.describe('AO — la API comparte origen con la página', () => {
  test('AO-1. Una llamada a /api/ desde la página llega al backend, sin que el CSP la bloquee', async ({ page }) => {
    const servidor = await levantarBackendFalso();
    const violaciones = [];
    // Una violación de CSP no lanza una excepción de red normal: sale por consola. Si el
    // front volviera a una URL absoluta a :3001, esto es lo que la delataría.
    page.on('console', (m) => {
      const t = m.text();
      if (t.includes('Content Security Policy') || t.includes('Refused to connect')) violaciones.push(t);
    });

    try {
      await abrirApp(page);
      // La URL se toma de `API_CONFIG.baseUrl`, la que usa la app de verdad — no se escribe
      // '/api' a mano aquí. Escribiéndola a mano, este caso pasaría igual con los clientes
      // apuntando a `localhost:3001`, que es justo el fallo que debe detectar: el fetch del
      // test no es el fetch de la aplicación.
      const r = await page.evaluate(async () => {
        await import('/js/api-client.js');
        const base = globalThis.API_CONFIG?.baseUrl;
        try {
          const resp = await fetch(`${base}/health`);
          return { ok: resp.ok, status: resp.status, base, cuerpo: await resp.json() };
        } catch (e) {
          return { ok: false, base, error: String(e?.message || e) };
        }
      });

      expect(r.ok, `la llamada debe llegar al backend; resultado: ${JSON.stringify(r)}`).toBe(true);
      expect(r.cuerpo?.ruta, 'el proxy debe conservar la ruta original').toBe('/api/health');
      expect(violaciones, `el CSP no debe bloquear /api: ${violaciones.join(' | ')}`).toEqual([]);
    } finally {
      await new Promise((r) => servidor.close(r));
    }
  });

  test('AO-2. Sin backend detrás, el proxy contesta 502 con un código legible', async ({ page }) => {
    await abrirApp(page);
    const r = await page.evaluate(async () => {
      const resp = await fetch('/api/health');
      return { status: resp.status, cuerpo: await resp.json().catch(() => null) };
    });

    expect(r.status, 'sin backend, el proxy debe decirlo con 502').toBe(502);
    expect(r.cuerpo?.codigo, 'y con un código que se pueda diagnosticar de un vistazo').toBe('BACKEND_NO_DISPONIBLE');
  });

  test('AO-3. Los dos clientes de red apuntan a ruta relativa, no a un puerto fijo', async ({ page }) => {
    await abrirApp(page);
    // api-client.js no se carga en el arranque: la app lo importa bajo demanda en P13
    // (`En-busca-del-tesoro.html`, al activar el código). Se importa aquí igual que allí —
    // su IIFE es quien publica API_CONFIG, así que sin importarlo no hay nada que leer.
    const base = await page.evaluate(async () => {
      await import('/js/api-client.js');
      return globalThis.API_CONFIG?.baseUrl ?? null;
    });
    expect(base, 'api-client.js debe usar ruta relativa').toBe('/api');

    // data-loader.js no expone su API_BASE, así que se mira la fuente: es el único modo de
    // fijar el contrato sin inventarle un export que nadie más necesita.
    const fuente = await page.evaluate(async () => (await fetch('/js/data-loader.js')).text());
    expect(fuente, 'data-loader.js no puede volver a una URL absoluta con puerto').not.toContain('localhost:3001');
    expect(fuente).toContain("const API_BASE = '/api'");
  });
});
