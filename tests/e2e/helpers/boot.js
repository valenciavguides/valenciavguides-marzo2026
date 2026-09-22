/**
 * boot.js — Helpers compartidos para los tests E2E de Valencia VGuides
 *
 * Uso estándar en cada spec:
 *
 *   const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
 *   const path = require('path');
 *
 *   test.beforeEach(async ({ page }) => {
 *     await page.addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') });
 *     await injectInitSpy(page);
 *     await stubCDNResources(page);
 *     await gotoAndWaitForFase1(page);
 *   });
 */

'use strict';

/** Tiempo máximo para que FASE 1 complete (mensajeriaReady + __MENSAJERIA_INICIADA) */
const BOOT_TIMEOUT = 45_000;

/**
 * Inyecta un spy que registra el orden de inicialización.
 * DEBE llamarse ANTES de page.goto() para capturar eventos desde el inicio.
 *
 * Expone en window:
 *   __e2e_initOrder   — array de snapshots ordenados por evento
 *   __e2e_snapshots   — mismo array, alias semántico
 */
async function injectInitSpy(page) {
  await page.addInitScript(() => {
    globalThis.__e2e_initOrder = [];

    // Capturar el momento exacto en que mensajeriaReady se dispara
    // y el estado de las variables críticas en ese instante
    globalThis.addEventListener('mensajeriaReady', function () {
      globalThis.__e2e_initOrder.push({
        event: 'mensajeriaReady',
        ts: performance.now(),
        // ¿Estaba state-manager listo ANTES de que mensajeriaReady se disparara?
        hasStateManager: typeof globalThis.__vv_stateManager === 'object' && globalThis.__vv_stateManager !== null,
        // ¿Estaba globalThis.mensajeria disponible en ese momento?
        hasMensajeria: typeof globalThis.mensajeria === 'object' && globalThis.mensajeria !== null,
        // ¿Se había marcado como iniciada?
        mensajeriaIniciada: globalThis.__MENSAJERIA_INICIADA === true,
      });
    }, { once: true });
  });
}

/**
 * Intercepta los recursos CDN (unpkg.com, cdnjs.cloudflare.com) y el motor de
 * mapas vendorizado localmente, y los reemplaza con stubs vacíos para que los
 * tests no dependan de internet ni de un contexto WebGL real.
 *
 * MapLibre GL JS real es reemplazado por el stub de maplibre-stub.js inyectado
 * con addInitScript — pero a diferencia de los recursos CDN de arriba,
 * `codigo-padre.html` carga MapLibre desde un <script> local
 * (js/vendor/maplibre-gl-csp.js), que no pasa por unpkg/cdnjs. Por eso esta
 * función intercepta también esa ruta local: si el script real llegara a
 * ejecutarse, sobrescribiría globalThis.maplibregl y anularía el stub.
 * Los CSS se retornan vacíos (no son necesarios para los tests).
 *
 * DEBE llamarse ANTES de page.goto().
 */
async function stubCDNResources(page) {
  // unpkg.com — histórico (plugins servidos por CDN)
  await page.route('**/unpkg.com/**', async route => {
    const url = route.request().url();
    if (url.match(/\.(css)(\?|$)/)) {
      await route.fulfill({ contentType: 'text/css', body: '/* stubbed by E2E */' });
    } else {
      await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed by E2E */' });
    }
  });

  // cdnjs.cloudflare.com — preconnect, posibles fuentes adicionales
  await page.route('**/cdnjs.cloudflare.com/**', async route => {
    const url = route.request().url();
    if (url.match(/\.css(\?|$)/)) {
      await route.fulfill({ contentType: 'text/css', body: '/* stubbed */' });
    } else {
      await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed */' });
    }
  });

  // js/vendor/maplibre-gl-csp.js — vendorizado localmente (no CDN). Sin esta
  // intercepción se ejecutaría de verdad y sobrescribiría globalThis.maplibregl
  // ya definido por maplibre-stub.js; nunca se solicita el worker porque el
  // stub no llega a crear un Map real que lo necesite.
  await page.route('**/js/vendor/maplibre-gl-csp.js', async route => {
    await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed by E2E */' });
  });
  await page.route('**/js/vendor/maplibre-gl.css', async route => {
    await route.fulfill({ contentType: 'text/css', body: '/* stubbed by E2E */' });
  });
}

/**
 * Navega a /codigo-padre.html y espera hasta que FASE 1 haya completado.
 *
 * Indicador: globalThis.__MENSAJERIA_INICIADA === true
 * Este flag se pone a true justo después de:
 *   1. mensajeria.inicializarMensajeria() completado
 *   2. mensajeriaReady event disparado
 *
 * @param {import('@playwright/test').Page} page
 */
async function gotoAndWaitForFase1(page) {
  // Los tests corren con el CSP de produccion TAL CUAL, salvo la directiva
  // upgrade-insecure-requests que js/server.js retira al servir por HTTP (ver §22).
  // Antes se borraba aqui la meta CSP entera, con esta justificacion: "'unsafe-inline'
  // no cubre <script type=module> inline, asi que WebKit bloquea los modulos del padre".
  // Es FALSA — medido: con el CSP intacto menos esa directiva, WebKit completa FASE 1
  // con 0 violaciones y 0 errores. Lo que rompia WebKit era upgrade-insecure-requests,
  // y borrar la meta entera se lo llevaba de paso. Manteniendo el CSP real, una
  // violacion de CSP si la detectan los tests; con el borrado no la detectaba nadie.

  // Suprimir errores de consola que no son relevantes para los tests
  // (p. ej. warnings de serviceworker, stub de MapLibre, etc.)
  page.on('console', msg => {
    if (msg.type() === 'error') {
      // Solo loguear errores reales, no los esperables del stub
      const text = msg.text();
      if (!text.includes('maplibre') && !text.includes('stub') && !text.includes('Service Worker')) {
        // No lanzamos excepción — dejamos que los tests fallen por sus propias aserciones
        // console.error('[PAGE ERROR]', text);
      }
    }
  });

  await page.goto('/codigo-padre.html', { waitUntil: 'domcontentloaded' });

  // Esperar a que FASE 1 complete.
  // En WebKit/iOS algunos arranques pueden tardar más de lo esperado;
  // si expira, no abortamos el beforeEach y dejamos que las aserciones del test
  // reporten el estado real de disponibilidad de la API.
  try {
    await page.waitForFunction(
      () => {
        const listo = globalThis.__MENSAJERIA_INICIADA === true || (
          typeof globalThis.mensajeria === 'object' &&
          globalThis.mensajeria !== null &&
          typeof globalThis.registrarControlador === 'function' &&
          typeof globalThis.enviarMensaje === 'function' &&
          typeof globalThis.TIPOS_MENSAJE === 'object' &&
          globalThis.TIPOS_MENSAJE !== null
        );
        if (!listo) return false;
        // Snapshot tomado en el mismo tick del navegador en que se detecta FASE 1
        // completa — un page.evaluate() posterior y separado (como hacían las
        // aserciones "1c." de 04-iframe-dom.spec.js) deja una ventana real en la
        // que FASE 2 (carga de datos de aventura, arranca justo después de FASE 1
        // en la misma secuencia de arranque) puede colarse antes de que el test
        // llegue a leer el valor — más visible en motores más lentos (WebKit).
        if (!globalThis.__e2e_datosAventuraSnapshot) {
          globalThis.__e2e_datosAventuraSnapshot = {
            datos: globalThis.__vv_DATOS_AVENTURAS ?? null,
            audios: globalThis.__vv_AUDIOS_AVENTURAS ?? null,
          };
        }
        return true;
      },
      null,
      { timeout: BOOT_TIMEOUT }
    );
  } catch (_bootError) {
    await page.evaluate(() => {
      globalThis.__e2e_bootTimedOut = true;
    });
  }

  // Y esperar a que el padre haya registrado los controladores con los que arranca.
  //
  // FASE 1 solo garantiza la mensajería, que monta Script 1. Los handlers del padre —audio,
  // paradas, retos, SISTEMA.ERROR— los registran Script 1 y Script 2 DESPUÉS, y
  // `marcarScript2Listo()` se llama cuando han terminado los de los dos (codigo-padre.html,
  // "MARCAR SCRIPT 2 LISTO"), así que es la señal fiable. Los tres de heartbeat de Script 4
  // quedan fuera: ver el spec 89.
  //
  // Sin esta espera, un test que actúe nada más volver de aquí puede mandarle un mensaje al
  // padre cuando todavía no hay nadie escuchando: el bus avisa y lo descarta, y el test falla
  // sin motivo aparente. La ventana es de milisegundos en una máquina ociosa y se abre cuando
  // va cargada — por eso salía solo en tandas completas, en el navegador más lento y cambiando
  // de spec entre tanda y tanda. Medido con el diagnóstico de 28/SE-1: `handlers: 0` en el
  // instante del envío.
  //
  // No aborta si expira: se deja que la aserción del propio test reporte lo que encuentre, con
  // su mensaje, igual que la espera de FASE 1 de arriba.
  //
  // Sondeo con page.evaluate, NO waitForFunction: getScript2Listo() es async, y waitForFunction no
  // espera la promesa de su predicado — una Promise es truthy y la espera se da por cumplida al
  // instante. MEDIDO: con un predicado async que devuelve false, waitForFunction resuelve en
  // 16-43 ms en los cuatro navegadores. Asi esta espera no esperaba nunca, y 28/SE-1 lo delataba
  // con `script2Listo: false` en el mismo documento y sin ninguna espera expirada.
  const hasta = Date.now() + BOOT_TIMEOUT;
  for (;;) {
    const listo = await page.evaluate(async () => (await globalThis.__vv_stateManager?.getScript2Listo?.()) === true);
    if (listo) break;
    if (Date.now() > hasta) {
      await page.evaluate(() => { globalThis.__e2e_script2TimedOut = true; });
      break;
    }
    await page.waitForTimeout(50); // VENTANA-OBSERVACION: sondeo de script2Listo, acotado por BOOT_TIMEOUT
  }
}

/**
 * Obtiene el snapshot del evento mensajeriaReady registrado por el spy.
 * Lanza AssertionError si el spy no capturó el evento.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Object>}
 */
async function getMensajeriaReadySnapshot(page) {
  const order = await page.evaluate(() => globalThis.__e2e_initOrder);
  const snapshot = (order || []).find(e => e.event === 'mensajeriaReady');
  if (!snapshot) {
    throw new Error(
      'El spy no capturó el evento mensajeriaReady. ' +
      '¿Se llamó injectInitSpy() antes de page.goto()?'
    );
  }
  return snapshot;
}

const MARCO_VACIO = 'tests/e2e/helpers/marco-vacio.html';

/**
 * Abre un hijo dentro de `marco-vacio.html`, que le hace de padre sin mandarle nada.
 *
 * Un hijo cargado como pagina de primer nivel NO puede enviar: su bus se queda sin padre y
 * corta el envio en voz alta. Los tests que lo hacian asi tenian que inventarse un
 * `globalThis.mensajeria`, y entonces comprobaban su propio muñeco en vez de la aplicacion.
 * Dentro del marco el camino es el de verdad, y lo que el hijo manda queda en
 * `globalThis.__recibidos` del marco.
 *
 * Espera al `SISTEMA.HIJO_PREPARADO` del propio hijo: el `load` del iframe no significa
 * "listo para recibir", porque su modulo tiene awaits de nivel superior.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} fichero  p.ej. 'retos-hijo4.html'
 * @param {{esperarPreparado?: boolean}} [opciones]  `false` para los nietos (puzzle, vídeo),
 *        que no hacen el saludo de los hijos: no mandan `HIJO_PREPARADO` ni lo tienen que
 *        mandar, porque no participan del arranque de la aplicación.
 */
async function abrirHijoEnMarco(page, fichero, { esperarPreparado = true } = {}) {
  await page.goto(MARCO_VACIO);
  await page.evaluate((src) => new Promise((resolve) => {
    const el = document.createElement('iframe');
    el.id = 'marco-hijo';
    // Con el tamaño por defecto de un iframe (300x150) la maquetacion de las paginas que
    // miden en `em` se desborda y un elemento acaba tapando a otro: el clic se queda sin
    // llegar y parece un fallo del codigo. En la aplicacion el hijo ocupa su area entera.
    el.style.cssText = 'width:100vw;height:100vh;border:0;display:block;';
    // Ruta ABSOLUTA: el marco vive en /tests/e2e/helpers/, y una relativa cargaria un 404
    // —cuyo body tambien existe— culpando al codigo de un fallo del arnes.
    el.src = `/${src}`;
    el.addEventListener('load', () => resolve(), { once: true });
    document.body.appendChild(el);
  }), fichero);

  const url = await page.evaluate(() =>
    document.getElementById('marco-hijo')?.contentDocument?.location?.href || '');
  if (!url.includes(fichero)) {
    throw new Error(`El marco tenia que cargar ${fichero} y cargo ${url || '(nada)'}`);
  }

  const marco = page.frames().find((f) => f.url().includes(fichero));
  if (!marco) throw new Error(`No encuentro el frame de ${fichero}`);

  if (!esperarPreparado) return marco;

  // `load` no significa "listo para recibir": el modulo del hijo tiene awaits de nivel
  // superior y sus handlers se registran despues. La señal buena es la del propio protocolo.
  const hasta = Date.now() + BOOT_TIMEOUT;
  for (;;) {
    const listo = await page.evaluate(() =>
      (globalThis.__recibidos || []).some((m) => m.tipo === 'SISTEMA.HIJO_PREPARADO'));
    if (listo) break;
    if (Date.now() > hasta) throw new Error(`${fichero} no mando HIJO_PREPARADO en ${BOOT_TIMEOUT} ms`);
    await page.waitForTimeout(100); // VENTANA-OBSERVACION: sondeo del aviso del hijo, acotado arriba
  }

  return marco;
}

/** Los mensajes que el hijo ha mandado a su padre, en orden. */
function recibidosPorElMarco(page) {
  return page.evaluate(() => globalThis.__recibidos || []);
}

/** Hace llegar al hijo un mensaje, como lo mandaria el padre. */
function enviarAlHijo(page, mensaje) {
  return page.evaluate((m) => {
    document.getElementById('marco-hijo').contentWindow.postMessage(m, globalThis.location.origin);
  }, mensaje);
}

module.exports = {
  BOOT_TIMEOUT,
  injectInitSpy,
  stubCDNResources,
  gotoAndWaitForFase1,
  getMensajeriaReadySnapshot,
  MARCO_VACIO,
  abrirHijoEnMarco,
  recibidosPorElMarco,
  enviarAlHijo,
};
