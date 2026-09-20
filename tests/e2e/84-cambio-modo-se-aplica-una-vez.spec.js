/**
 * 84 — Un CAMBIO_MODO llegado fuera de secuencia se aplica UNA vez, no dos
 *
 * POR QUE EXISTE
 *
 * Cuando un CAMBIO_MODO llega a un hijo antes de que haya terminado su handshake, el hijo
 * responde `NACK { esperarPermiso: true, modoSolicitado }`. A partir de ahi habia DOS
 * mecanismos independientes resolviendo lo mismo, cada uno inventado por su lado:
 *
 *   - EL PADRE lo guarda en `pendingModeChanges` (js/app.js) y lo reenvia por dos disparadores:
 *     un bucle cada 5 s con backoff, y el HIJO_LISTO de ese hijo (codigo-padre.html).
 *   - EL HIJO lo aparcaba ademas en `pendingCambioModo` y lo aplicaba por su cuenta al estar
 *     listo — hijo2 en `_procesarDatosPadre`, hijo3 y hijo5 en `mostrarUI`, hijo4 en
 *     `sincronizarEstadoModo`.
 *
 * Medido antes del arreglo, con la misma receta para los cuatro: los cuatro lo aplicaban DOS
 * veces. hijo2/3/4 acusaban `CONFIRMACION {tipo:'inicializacion'}` por su via local y ademas
 * `ENTENDIDO`+`EFECTUADO` por la del padre. hijo5, que lo aplicaba mandandose un mensaje a si
 * mismo, reentraba al handler entero: 2 ENTENDIDO, 2 EFECTUADO y 3 SOLICITAR_DATOS_PARADAS.
 *
 * hijo1 nunca aparco nada: ya seguia el patron de un solo camino. Es el que se generaliza.
 *
 * Ver docs/mensajeria-duplicada-en-hijos.md.
 *
 * ROJO ANTES QUE VERDE: con el aparcado local puesto, cada hijo acusa la aplicacion dos veces.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const HIJOS = ['hijo2', 'hijo3', 'hijo4', 'hijo5'];

test.describe('CM — El cambio de modo aparcado se aplica una sola vez', () => {
  for (const ID of HIJOS) {
    test(`CM-${ID}. ${ID} aplica el modo aparcado exactamente una vez`, async ({ page, context }) => {
      test.setTimeout(120_000);
      await context.grantPermissions(['geolocation']);
      await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
      await page.addInitScript({ path: MAPLIBRE_STUB });
      await injectInitSpy(page);
      await stubCDNResources(page);
      await gotoAndWaitForFase1(page);
      await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
      if (ID === 'hijo5') await page.evaluate(() => globalThis.cargarHijoCasa?.());
      await page.waitForFunction((id) => !!document.getElementById(id)?.contentWindow?.logger, ID, { timeout: 60_000 });

      await page.evaluate((id) => {
        globalThis.__acks = [];
        globalThis.addEventListener('message', (e) => {
          if (e.data?.origen !== id) return;
          globalThis.__acks.push({ tipo: e.data.tipo, sub: e.data.datos?.tipo, modo: e.data.datos?.modo });
        });
      }, ID);

      // 1) CAMBIO_MODO fuera de secuencia: el hijo tiene que rechazarlo pidiendo permiso.
      await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
        tipo: globalThis.TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO,
        destino: id,
        datos: { modo: 'aventura' },
      }), ID);
      // Se espera a que lo RECHACE de verdad, no un tiempo: el NACK es lo que deja al padre
      // recordando el cambio para reenviarlo.
      await expect
        .poll(() => page.evaluate(() => globalThis.__acks.some((m) => m.tipo === 'SISTEMA.NACK')), { timeout: 10_000 })
        .toBe(true);

      // 2) Su UI se reconfirma: es el instante en que la via local se disparaba.
      await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
        tipo: globalThis.TIPOS_MENSAJE.SISTEMA.PADRE_CONFIRMA_HIJO_LISTO,
        destino: id,
        datos: { modoInicial: 'casa' },
      }), ID);

      // Primero, que el reenvio del padre LLEGUE y se aplique: eso si ocurre, y se espera a ello.
      const aparcadosAplicados = () => page.evaluate(() => globalThis.__acks.filter(
        (m) => /CAMBIO_MODO_EFECTUADO/.test(m.tipo || '') && m.modo === 'aventura',
      ).length);
      await expect.poll(aparcadosAplicados, { timeout: 20_000 }).toBeGreaterThanOrEqual(1);

      // Despues, que NO llegue un segundo. Eso no tiene condicion a la que esperar, asi que se
      // observa un rato. El rato sale del codigo, no de a ojo: el reenvio sigue un backoff de
      // 2 s, 4 s, 8 s... con +/-10 % (js/app.js, _computeBackoff), y tras un EFECTUADO el padre
      // borra la entrada. Si no la borrara, el siguiente reenvio llegaria como mucho a los 4,4 s.
      // VENTANA-OBSERVACION: un segundo reenvio del padre llegaria en <= 4,4 s; 5 s lo cubre
      await page.waitForTimeout(5000);

      const acks = await page.evaluate(() => globalThis.__acks);
      // Solo los acuses DEL MODO APARCADO ('aventura'). El propio test provoca ademas un cambio
      // a 'casa' con el `modoInicial` de PADRE_CONFIRMA_HIJO_LISTO, y el hijo lo acusa con
      // razon: contarlo tambien hacia fallar el test en el navegador mas lento, donde ese acuse
      // cae dentro de la ventana de captura. Medido: en iphone12 llegaban un EFECTUADO 'casa' y
      // otro 'aventura', y el test los sumaba como si fueran dos aplicaciones del aparcado.
      const efectuados = acks.filter(
        (m) => /CAMBIO_MODO_EFECTUADO/.test(m.tipo || '') && m.modo === 'aventura',
      );
      const localesInicializacion = acks.filter(
        (m) => /CONFIRMACION/.test(m.tipo || '') && m.sub === 'inicializacion',
      );

      expect(
        efectuados.length,
        `el modo aparcado tiene que aplicarse una sola vez. Acuses: ${JSON.stringify(acks)}`,
      ).toBe(1);

      expect(
        localesInicializacion.length,
        'la via local del hijo ya no existe: el padre es quien recuerda y reenvia (un solo camino)',
      ).toBe(0);
    });
  }
});
