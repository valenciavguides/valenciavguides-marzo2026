'use strict';

/**
 * 93 — Ningún frame puede hacerse pasar por otro ante el padre
 *
 *   SU-<frame>  El frame le manda al padre un mensaje firmado como 'hijo5' (el de las herramientas
 *               de desarrollo): el padre no lo procesa y avisa. Control: el mismo mensaje, por el mismo
 *               camino, firmado con el nombre de registro del frame, sí llega.
 *
 * POR QUE EXISTE
 *
 * El padre decide cosas según quién le escribe: a quién contesta, qué estado guarda de cada hijo,
 * a quién no le reenvía un cambio de parada. Todas se apoyan en el campo `origen`, que el mensaje
 * trae escrito por quien lo manda. El bus comprobaba que el mensaje viniera de una ventana suya
 * (su padre, un iframe registrado o él mismo), pero no que esa ventana fuera quien decía ser:
 * cualquier hijo podía firmar como otro. Cada hijo sirve a un propósito, y ninguno puede pasar
 * por otro (docs/mensajeria-duplicada-en-hijos.md, decisión 10).
 *
 * Se prueba con TODOS los frames que el padre registra, menos hijo5: la comprobación es la misma
 * para todos, así que el spec tiene que demostrar que ninguno se libra. El chat y el mapa completo
 * solo se cargan al abrirlos, y el spec los abre.
 *
 * El tipo es uno propio del test, registrado en el padre solo aquí: así ningún handler de la app
 * hace nada con el mensaje, y lo único que se mide es si llega.
 *
 * ROJO ANTES QUE VERDE: sin la comprobación de identidad, el padre acepta la firma falsa.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const TIPO = 'PRUEBA.SUPLANTACION';

// Nombre de registro de cada frame en el padre, y cómo hacer que exista.
const FRAMES = [
  { id: 'seleccion' },
  { id: 'hijo1-opciones', cargar: 'resto' },
  { id: 'hijo2', cargar: 'resto' },
  { id: 'hijo3', cargar: 'resto' },
  { id: 'hijo4', cargar: 'resto' },
  { id: 'hijo6-chat', cargar: 'chat' },
  { id: 'mapa-completo', cargar: 'mapa' },
];

// Selector CSS del iframe de cada frame. El del mapa completo vive en #iframe-overlay y no tiene id propio.
// Sin eval ni new Function: la CSP de la app los prohíbe.
const selectorDe = (id) => (id === 'mapa-completo' ? '#iframe-overlay iframe' : `#${id}`);

test.describe('SU — Ningún frame puede hacerse pasar por otro ante el padre', () => {
  for (const { id, cargar } of FRAMES) {
    test(`SU-${id}. ${id} firmando como 'hijo5' no llega al padre; con su nombre, sí`, async ({ page, context }) => {
      test.setTimeout(120_000);
      const logs = [];
      page.on('console', (m) => logs.push({ tipo: m.type(), texto: m.text() }));
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
      await page.addInitScript({ path: MAPLIBRE_STUB });
      await injectInitSpy(page);
      await stubCDNResources(page);
      await gotoAndWaitForFase1(page);

      if (cargar === 'resto') await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
      if (cargar === 'chat') await page.evaluate(() => document.getElementById('btn-chat-soporte').click());
      if (cargar === 'mapa') await page.evaluate(() => globalThis.mostrarIframeOverlay('mapa-completo.html?aventura=Aventura1'));

      // El frame tiene que tener su bus inicializado: si no, el control no probaría nada.
      await page.waitForFunction(
        (sel) => !!document.querySelector(sel)?.contentWindow?.mensajeria?.estaInicializado?.(),
        selectorDe(id), { timeout: 60_000 },
      );

      await page.evaluate((tipo) => {
        globalThis.__supl = [];
        return globalThis.mensajeria.registrarControlador(tipo, (m) => { globalThis.__supl.push({ origen: m.origen, datos: m.datos }); });
      }, TIPO);

      const marco = await (await page.locator(selectorDe(id)).elementHandle()).contentFrame();
      // Desde la ventana del propio frame, como lo haría su código: el padre ve de verdad esa ventana.
      const publicar = (origen, n) => marco.evaluate(([tipo, o, marca]) => {
        globalThis.parent.postMessage({ tipo, origen: o, datos: { n: marca }, id: 'supl-' + marca, timestamp: 0 }, globalThis.location.origin);
      }, [TIPO, origen, n]);

      // Control: con su nombre de registro llega.
      await publicar(id, 'control');
      await expect.poll(() => page.evaluate(() => globalThis.__supl), { timeout: 5_000 })
        .toEqual([{ origen: id, datos: { n: 'control' } }]);

      await publicar('hijo5', 'falso');
      // VENTANA-OBSERVACION: un frame que se hace pasar por otro no puede llegar al handler del padre
      await page.waitForTimeout(500);
      expect(await page.evaluate(() => globalThis.__supl), `${id} firmando como 'hijo5' no puede llegar`)
        .toEqual([{ origen: id, datos: { n: 'control' } }]);
      const aviso = logs.filter((l) => (l.tipo === 'warning' || l.tipo === 'error')
        && l.texto.includes(`descarta ${TIPO}: dice venir de 'hijo5' pero lo envía '${id}'`));
      expect(aviso, 'y el padre avisa de quién lo envió de verdad').toHaveLength(1);
    });
  }
});
