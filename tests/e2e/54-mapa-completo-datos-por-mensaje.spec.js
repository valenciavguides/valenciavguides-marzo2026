/**
 * 54-mapa-completo-datos-por-mensaje.spec.js
 *
 * `mapa-completo.html` importaba `DATOS_AVENTURAS` de coordenadas-aventuras.js. Eso
 * tenía dos consecuencias medidas:
 *
 *   · Era uno de los caminos que se saltaban `data-loader.js` (pendiente 13, §22.12).
 *   · Abriendo la URL a pelo entregaba la ruta COMPLETA de la aventura —88 paradas de
 *     Av1 con nombre y coordenadas, y las 7 aventuras accesibles— sin código de compra
 *     ni GPS.
 *
 * Ahora sigue el patrón de los demás hijos: no importa datos, los pide al padre. Sin
 * padre no hay datos y el mapa sale vacío. No hay guard que puentear: sencillamente no
 * tiene nada que pintar.
 *
 *   MC-1  Suelto por URL: ni un marcador, ni polyline, y el aviso al usuario.
 *   MC-2  Suelto por URL: NO descarga coordenadas-aventuras.js (el import se fue).
 *   MC-3  Con un padre que responde: pinta la ruta y los monumentos.
 *   MC-4  El padre solo responde al iframe del overlay, no a cualquiera del mismo origen.
 *   MC-5  La aventura del mapa la decide el padre, la elegida: aunque el mensaje de hijo2 traiga otra aventura y
 *         otra URL, se abre `mapa-completo.html` con la elegida (docs/estudio-caminos.md, K-107). Rojo antes que
 *         verde: el padre anterior abría la URL del mensaje.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('MC — mapa-completo recibe los datos por mensaje, no por import', () => {

  test('MC-1. Abierto por URL no muestra ruta ni monumentos, y avisa', async ({ page }) => {
    await page.goto('/mapa-completo.html');
    await page.waitForLoadState('networkidle');
    // VENTANA-OBSERVACION: MC-1 comprueba que sin padre NO se pinta nada; hay que dar margen a que se pintara si fuera a pintarse
    await page.waitForTimeout(1500);

    const r = await page.evaluate(() => ({
      marcadores: document.querySelectorAll('.monumento-marker').length,
      polylines: document.querySelectorAll('.leaflet-overlay-pane path').length,
      texto: (document.getElementById('map')?.textContent || '').trim(),
    }));

    expect(r.marcadores, 'sin padre no debe pintarse ni un monumento').toBe(0);
    expect(r.polylines, 'ni la polyline de la ruta').toBe(0);
    expect(r.texto, 'debe explicar por qué no hay mapa').toContain('forma parte de la aventura');
  });

  test('MC-2. Abierto por URL no descarga coordenadas-aventuras.js', async ({ page }) => {
    // Se mide con Resource Timing, no con page.route(): en WebKit la interceptación no
    // ve todas las peticiones (ver EI-4 en 49-escalera-espera-imagen.spec.js).
    await page.goto('/mapa-completo.html');
    await page.waitForLoadState('networkidle');
    // VENTANA-OBSERVACION: MC-2 comprueba que NO se descarga coordenadas-aventuras.js; una condición no puede esperar a algo que no ocurre
    await page.waitForTimeout(1000);

    const pedidos = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .map((e) => e.name)
        .filter((u) => /coordenadas-aventuras\.js/.test(u))
    );

    expect(pedidos, `no debe pedir el fichero de datos: ${pedidos.join(', ')}`).toEqual([]);
  });

  test('MC-3. Con un padre que responde, pinta la ruta y los monumentos', async ({ page }) => {
    // Padre mínimo: solo implementa el lado del protocolo que nos interesa, y lo implementa
    // como lo hace el padre real — tipos de `constants.js` y las coordenadas dentro de
    // `datos`. El bus del mapa acepta a su ventana de arriba, así que no hace falta más.
    await page.route('**/__contenedor-mc.html', (route) => route.fulfill({
      contentType: 'text/html',
      body: `<!DOCTYPE html><html><body>
        <iframe id="f" src="/mapa-completo.html" style="width:100vw;height:100vh;border:0"></iframe>
        <script type="module">
          const m = await import('/js/coordenadas-aventuras.js');
          const { TIPOS_MENSAJE } = await import('/js/constants.js');
          globalThis.addEventListener('message', (ev) => {
            if (ev.data?.tipo !== TIPOS_MENSAJE.MAPA_COMPLETO.SOLICITAR_DATOS) return;
            // Como el padre real: contesta con SU aventura elegida, el mapa no la dice (K-107).
            const c = m.DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html'].coordenadas;
            ev.source.postMessage({
              tipo: TIPOS_MENSAJE.MAPA_COMPLETO.DATOS,
              origen: 'padre',
              destino: 'mapa-completo',
              datos: { coordenadas: c },
            }, globalThis.location.origin);
          });
        <\/script></body></html>`,
    }));

    await page.goto('/__contenedor-mc.html');
    await page.waitForLoadState('networkidle');
    await expect.poll(async () => page.evaluate(() =>
      document.getElementById('f')?.contentDocument?.querySelectorAll('.monumento-marker').length || 0
    ), { timeout: 15000 }).toBeGreaterThan(0);

    const r = await page.evaluate(() => {
      const d = document.getElementById('f').contentDocument;
      return {
        marcadores: d.querySelectorAll('.monumento-marker').length,
        polylines: d.querySelectorAll('.leaflet-overlay-pane path').length,
      };
    });
    expect(r.marcadores, 'los monumentos de referencia deben aparecer').toBeGreaterThan(0);
    expect(r.polylines, 'y la polyline de la ruta').toBeGreaterThan(0);
  });

  test('MC-4. Sin mapa abierto, una petición forjada no saca coordenadas de ningún sitio', async ({ page }) => {
    // Antes el padre comprobaba a mano que la petición viniera del iframe del overlay. Ya no
    // hace falta: la respuesta va DIRIGIDA a `mapa-completo`, y ese nombre solo existe en el
    // bus mientras el overlay está abierto. Sin overlay no hay a quién mandárselas, y quien
    // forjó la petición no recibe nada — no porque se le reconozca, sino porque la respuesta
    // nunca fue para él.
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await gotoAndWaitForFase1(page);

    // Control: sin esto, MC-4 pasaría también si el handler no existiera —y entonces no
    // estaría comprobando la protección, sino la ausencia del mecanismo entero.
    await expect
      .poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('MAPA_COMPLETO.SOLICITAR_DATOS')), { timeout: 20_000 })
      .toBe(true);

    const recibidos = await page.evaluate(async () => {
      const vistos = [];
      globalThis.addEventListener('message', (ev) => {
        if (ev.data?.tipo === 'MAPA_COMPLETO.DATOS') vistos.push(ev.data);
      });
      globalThis.postMessage({
        tipo: 'MAPA_COMPLETO.SOLICITAR_DATOS',
        origen: 'intruso',
        datos: {},
      }, globalThis.location.origin);
      await new Promise((r) => setTimeout(r, 600));
      return vistos;
    });

    expect(recibidos, 'la petición forjada no puede recibir coordenadas').toEqual([]);

    const entregas = logs.filter((l) => l.includes('[MAPA_COMPLETO] Enviadas'));
    expect(entregas.length, 'y el padre no puede dar por enviadas unas coordenadas que no salieron').toBe(0);
  });

  test('MC-5. La aventura del mapa completo la decide el padre, no el mensaje', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await expect.poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('NAVEGACION.MOSTRAR_MAPA_COMPLETO')), { timeout: 20_000 }).toBe(true);
    const abierto = await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      const llamadas = [];
      const original = globalThis.mostrarIframeOverlay;
      globalThis.mostrarIframeOverlay = (url, titulo) => { llamadas.push({ url, titulo }); };
      try {
        await globalThis.mensajeria.despacharLocal({
          tipo: globalThis.TIPOS_MENSAJE.NAVEGACION.MOSTRAR_MAPA_COMPLETO,
          datos: { aventura: 'Aventura3', url: 'mapa-completo.html?aventura=Aventura3' },
        });
      } finally { globalThis.mostrarIframeOverlay = original; }
      return llamadas;
    });
    expect(abierto, 'se abre una sola vez').toHaveLength(1);
    expect(abierto[0].url, 'la página del mapa, sin aventura en la URL').toBe('mapa-completo.html');
    expect(abierto[0].titulo, 'con la aventura elegida, no la del mensaje').toContain('Aventura1');
  });
});
