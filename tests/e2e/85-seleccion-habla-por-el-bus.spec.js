/**
 * 85 — La pantalla de seleccion habla por el bus, no por su copia de los envoltorios
 *
 * POR QUE EXISTE
 *
 * Mismo caso que hijo1 (spec 81) y hijo5 (spec 83), con una diferencia que obliga a mirarla
 * aparte: `En-busca-del-tesoro.html` tiene DOS ambitos — un `<script>` clasico con la logica de
 * pantallas y un `<script type="module">` con la mensajeria.
 *
 * El clasico NO puede `import`, asi que no puede cargar el bus: envia con
 * `parent.postMessage` a pelo (7 sitios). El modulo, en cambio, lleva su propia copia de los
 * envoltorios (`messagingAdapter`, `safeRegistrar`, un `enviarMensaje` propio).
 *
 * Migrar esto significa: el modulo carga el bus, y el clasico envia a traves de
 * `globalThis.mensajeria`, que el bus publica. Un solo camino para los dos ambitos.
 *
 *   SB-1  Control: un SISTEMA.ERROR enviado a mano desde seleccion llega a la ventana del padre.
 *   SB-2  seleccion tiene el bus montado y se identifica con el id con el que esta registrada.
 *   SB-3  Contesta al latido Y la respuesta LLEGA al padre.
 *   SB-4  El `<script>` clasico alcanza el bus: `globalThis.mensajeria` existe en ese frame
 *         cuando el usuario puede actuar. Es lo que permite que sus 7 envios dejen de ser
 *         `postMessage` crudos sin abrir una carrera.
 *
 * F2 (los errores de un hijo llegan al padre) lo cubre el spec 75, que es el que se pondra en
 * verde al migrar esto.
 *
 * ROJO ANTES QUE VERDE: mientras seleccion no cargue el bus, SB-2, SB-3 y SB-4 fallan.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const ID = 'seleccion';
const frameSeleccion = (page) => page.frames().find((f) => f.name() === ID);

test.describe('SB — La pantalla de seleccion habla por el bus', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      (id) => !!document.getElementById(id)?.contentWindow?.logger,
      ID,
      { timeout: 30_000 },
    );
  });

  test('SB-1. Control: un SISTEMA.ERROR enviado desde seleccion llega a la ventana del padre', async ({ page }) => {
    await page.evaluate(() => {
      globalThis.__errSel = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.tipo === 'SISTEMA.ERROR' && String(e.data.datos?.mensaje || '').includes('control-SB')) {
          globalThis.__errSel.push(e.data.origen);
        }
      });
    });
    await frameSeleccion(page).evaluate((id) => {
      globalThis.parent.postMessage({
        tipo: 'SISTEMA.ERROR', origen: id,
        datos: { codigo: 'ERROR_NO_CONTROLADO', mensaje: 'control-SB' },
      }, globalThis.location.origin);
    }, ID);
    await expect.poll(() => page.evaluate(() => globalThis.__errSel.length), { timeout: 5_000 }).toBe(1);
  });

  test('SB-2. seleccion tiene el bus montado y se identifica con su id registrado', async ({ page }) => {
    const estado = await frameSeleccion(page).evaluate(() => ({
      hayBus: typeof globalThis.mensajeria?.enviarMensaje === 'function',
      inicializado: globalThis.mensajeria?.estaInicializado?.() === true,
      id: globalThis.mensajeria?.getComponenteId?.() || null,
    }));
    expect(estado.hayBus, 'seleccion tiene que cargar js/mensajeria.js, no su propia copia').toBe(true);
    expect(estado.inicializado, 'y tenerlo inicializado').toBe(true);
    expect(
      estado.id,
      'con el MISMO id con el que el padre la registro: si no coinciden, el padre le escribe a un sitio y ella se presenta como otra',
    ).toBe(ID);
  });

  test('SB-3. seleccion contesta al latido y la respuesta llega al padre', async ({ page }) => {
    await page.evaluate((id) => {
      globalThis.__latidosSel = [];
      globalThis.addEventListener('message', (e) => {
        if (e.data?.tipo === 'SISTEMA.HEARTBEAT_RESPONSE' && e.data?.origen === id) {
          globalThis.__latidosSel.push(e.data.origen);
        }
      });
    }, ID);

    await page.evaluate((id) => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
      destino: id,
      datos: { timestamp: Date.now() },
    }), ID);

    await expect
      .poll(() => page.evaluate(() => globalThis.__latidosSel.length), {
        timeout: 8_000,
        message: 'sin esta respuesta el padre da a seleccion por caida a los 3 latidos',
      })
      .toBeGreaterThan(0);
  });

  test('SB-4. El script clasico alcanza el bus cuando el usuario puede actuar', async ({ page }) => {
    // Los 7 envios del script clasico se disparan por acciones del usuario (elegir aventura,
    // validar codigo, abrir el mapa vintage...), nunca al cargar. Lo que hay que garantizar es
    // que para entonces el bus ya esta publicado en ESE frame: si no, cambiarlos de
    // `parent.postMessage` a `globalThis.mensajeria` abriria una carrera en vez de cerrarla.
    const alcanzable = await frameSeleccion(page).evaluate(() => ({
      hayBus: typeof globalThis.mensajeria?.enviarMensaje === 'function',
      // El clasico tambien necesita los tipos, que publica el modulo como puente.
      hayTipos: typeof globalThis.TIPOS_MENSAJE === 'object' && globalThis.TIPOS_MENSAJE !== null,
    }));
    expect(
      alcanzable.hayBus,
      'el <script> clasico no puede importar: alcanza el bus por globalThis, que el modulo publica',
    ).toBe(true);
    expect(alcanzable.hayTipos, 'y los tipos de mensaje, por el mismo puente').toBe(true);
  });
});
