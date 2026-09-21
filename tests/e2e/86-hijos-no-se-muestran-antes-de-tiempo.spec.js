'use strict';

const { test, expect } = require('@playwright/test');

/**
 * UV — ningún hijo enseña su interfaz hasta que el padre confirma.
 *
 * Por cada hijo:
 *   UV-1  al cargar, su body está oculto
 *   UV-2  PADRE_CONFIRMA_HIJO_LISTO con origen lo muestra
 *   UV-3  el mismo mensaje SIN origen no lo muestra   (los que exigen origen; ver abajo)
 *
 * POR QUÉ EXISTE ESTE FICHERO
 *
 * Los cinco hijos se ocultan enteros al arrancar (`document.body.style.display = 'none'`)
 * y su `mostrarUI()` no hace nada mientras `_uiConfirmado` sea false. Sin eso, el usuario
 * ve la interfaz del hijo —su barra, sus botones— antes de que el padre tenga puestos sus
 * controladores, y lo que pulse se va a un padre que todavía no escucha.
 *
 * Esa protección no la probaba NADIE. Lo que había eran páginas en `tests/` que decían
 * comprobarla y llevaban dentro una copia simulada de cada hijo; no podían fallar pasara lo
 * que pasara en la aplicación. Esto las sustituye abriendo los ficheros de verdad.
 *
 * LOS CINCO VIVEN EN UN MARCO, COMO EN LA APP
 *
 * En la aplicación un hijo SIEMPRE es un iframe. Aquí también: `helpers/marco-vacio.html`
 * le hace de padre sin mandarle nada, así que el test decide cuándo llega la confirmación.
 * Antes se cargaban sueltos salvo hijo5 —que se niega a arrancar fuera de un iframe— y eso
 * eran dos caminos con garantías distintas.
 *
 * EL TEST NO EMPUJA HASTA QUE EL HIJO AVISA. MEDIDO, y es la lección de este fichero:
 *
 *   `load` del iframe NO significa "listo para recibir". hijo1 y hijo5 hablan por el bus y
 *   su módulo hace `await bus.inicializarMensajeria(...)`: el `load` salta mientras esperan,
 *   y sus handlers se registran DESPUÉS. En iphone12, bajo la carga de una tanda larga, la
 *   confirmación llegaba antes que el handler, se perdía, y UV-2 caía de forma intermitente
 *   —por el arnés, no por la aplicación—.
 *
 *   La señal buena es la del propio protocolo: los cinco hijos mandan `SISTEMA.HIJO_PREPARADO`
 *   a su padre DESPUÉS de registrar su handler de PADRE_CONFIRMA_HIJO_LISTO (comprobado en
 *   el código de cada uno: en hijo1 el handler vive dentro de `registrarControladores()`, que
 *   `init()` llama antes de avisar). El marco escucha ese aviso, y solo entonces se empuja.
 *
 * UV-1 SÍ SE MIRA NADA MÁS CARGAR, y es fiable: el ocultado corre en la parte síncrona del
 * módulo, antes de cualquier `await`, y el `load` no salta hasta que esa parte termina.
 * MEDIDO con un observador dentro de cada frame, en su propio reloj: los cinco se ocultan
 * antes de su `load` en chromium y en WebKit. (En hijo1 y hijo5 no era así hasta que su
 * ocultado se subió por delante del `await` del bus: tras migrarlos, ocurría después.)
 *
 * LOS CINCO EXIGEN `origen`
 *
 * El bus descarta en voz alta cualquier mensaje que llegue sin `origen`, así que la
 * comprobación no depende de que cada hijo se acuerde de escribirla: la hace el camino común.
 *
 * ROJO ANTES QUE VERDE: medido hijo por hijo, rompiendo el ocultado de cada uno: caen
 * exactamente sus casos y ninguno más.
 */

const MARCO = 'tests/e2e/helpers/marco-vacio.html';

const HIJOS = [
  { id: 'hijo1-opciones', fichero: 'extrainfo-hijo1.html', exigeOrigen: true },
  { id: 'hijo2', fichero: 'coordenadas-hijo2.html', exigeOrigen: true },
  { id: 'hijo3', fichero: 'audio-hijo3.html', exigeOrigen: true },
  { id: 'hijo4', fichero: 'retos-hijo4.html', exigeOrigen: true },
  { id: 'hijo5', fichero: 'boton-casa-hijo5.html', exigeOrigen: true },
];

/**
 * Mete el hijo en el marco y comprueba que es él. El marco empieza a apuntar los avisos
 * `HIJO_PREPARADO` ANTES de crear el iframe, para no perder uno que llegue enseguida.
 */
async function abrir(page, hijo) {
  await page.goto(MARCO);
  await page.evaluate((src) => new Promise((resolve) => {
    globalThis.__preparado = false;
    globalThis.addEventListener('message', (ev) => {
      if (ev.data?.tipo === 'SISTEMA.HIJO_PREPARADO') globalThis.__preparado = true;
    });
    const el = document.createElement('iframe');
    el.id = 'marco-hijo';
    // Ruta ABSOLUTA: el marco vive en /tests/e2e/helpers/, y un src relativo buscaría el hijo
    // ahí dentro y cargaría una página de 404 —cuyo body se ve—, culpando a la protección.
    el.src = `/${src}`;
    el.addEventListener('load', () => resolve(), { once: true });
    document.body.appendChild(el);
  }), hijo.fichero);

  // El arnés tiene que delatarse a sí mismo: un 404 también carga un documento con body.
  const cargado = await page.evaluate(() => {
    const doc = document.getElementById('marco-hijo')?.contentDocument;
    return { url: doc?.location?.href || '', inicio: (doc?.body?.innerHTML || '').slice(0, 60) };
  });
  expect(cargado.url, `el marco tenía que cargar ${hijo.fichero}, no ${cargado.url}`).toContain(hijo.fichero);
  expect(cargado.inicio, 'el marco cargó una página de error, no el hijo').not.toContain('404');
}

/** Espera al aviso del hijo: a partir de aquí su handler de confirmación ya existe. */
async function esperarPreparado(page) {
  await expect
    .poll(() => page.evaluate(() => globalThis.__preparado === true), { timeout: 15_000 })
    .toBe(true);
}

/** Lo que de verdad ve el usuario, mirado en el documento del propio hijo. */
function bodyVisible(page) {
  return page.evaluate(() => {
    const doc = document.getElementById('marco-hijo')?.contentDocument;
    if (!doc || !doc.body) return null; // null delata un fallo de arnés: no se confunde con false
    return doc.body.style.display !== 'none';
  });
}

/** Manda la confirmación como la mandaría el padre: desde el marco, a la ventana del hijo. */
async function enviarConfirmacion(page, hijo, { conOrigen }) {
  await page.evaluate(({ id, conOrigen }) => {
    const mensaje = {
      tipo: 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO',
      destino: id,
      datos: { timestamp: Date.now() },
    };
    if (conOrigen) mensaje.origen = 'padre';
    document.getElementById('marco-hijo').contentWindow.postMessage(mensaje, globalThis.location.origin);
  }, { id: hijo.id, conOrigen });
}

for (const hijo of HIJOS) {
  test.describe(`UV — ${hijo.fichero} no se muestra antes de tiempo`, () => {
    test(`UV-1. ${hijo.fichero}: al cargar, su interfaz está oculta`, async ({ page }) => {
      await abrir(page, hijo);
      expect(await bodyVisible(page)).toBe(false);
    });

    test(`UV-2. ${hijo.fichero}: PADRE_CONFIRMA_HIJO_LISTO con origen la muestra`, async ({ page }) => {
      await abrir(page, hijo);
      await esperarPreparado(page);
      expect(await bodyVisible(page), 'antes de confirmar tiene que seguir oculta').toBe(false);

      await enviarConfirmacion(page, hijo, { conOrigen: true });
      await expect.poll(() => bodyVisible(page), { timeout: 10_000 }).toBe(true);
    });

    if (hijo.exigeOrigen) {
      test(`UV-3. ${hijo.fichero}: el mismo mensaje SIN origen no la muestra`, async ({ page }) => {
        await abrir(page, hijo);
        await esperarPreparado(page);

        await enviarConfirmacion(page, hijo, { conOrigen: false });

        // Se demuestra que algo NO ocurre, así que no hay condición a la que esperar; el
        // handler ya existe (esperarPreparado) y 1,5 s es holgado.
        // VENTANA-OBSERVACION: comprobar que un aviso sin origen no muestra la interfaz
        await page.waitForTimeout(1500);
        expect(await bodyVisible(page), 'un aviso sin origen no puede mostrar la interfaz').toBe(false);

        // Y que el frame sigue vivo: el mensaje bueno posterior sí la muestra. Sin esto,
        // UV-3 pasaría también si el hijo se hubiera quedado colgado por otro motivo.
        await enviarConfirmacion(page, hijo, { conOrigen: true });
        await expect.poll(() => bodyVisible(page), { timeout: 10_000 }).toBe(true);
      });
    }
  });
}
