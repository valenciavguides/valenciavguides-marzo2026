'use strict';

const { test, expect } = require('@playwright/test');

/**
 * UV — ningun hijo ensena su interfaz hasta que el padre confirma.
 *
 * Por cada hijo:
 *   UV-1  al cargar, su body esta oculto
 *   UV-2  PADRE_CONFIRMA_HIJO_LISTO con origen lo muestra
 *   UV-3  el mismo mensaje SIN origen no lo muestra   (los que exigen origen; ver abajo)
 *
 * POR QUE EXISTE ESTE FICHERO
 *
 * Los cinco hijos se ocultan enteros al arrancar (`document.body.style.display = 'none'`)
 * y su `mostrarUI()` no hace nada mientras `_uiConfirmado` sea false. Sin eso, el usuario
 * ve la interfaz del hijo —su barra, sus botones— antes de que el padre tenga puestos sus
 * controladores, y lo que pulse se va a un padre que todavia no escucha.
 *
 * Esa proteccion no la probaba NADIE. Lo que habia eran cuatro paginas en `tests/`
 * —test_hijo2_coordenadas, test_hijo3_audio, test_hijo4_reto_visibility y
 * test_hijo5_navegacion— que decian comprobarla y llevaban dentro una copia simulada del
 * hijo: sus handlers estaban escritos en el propio fichero de test, ninguna cargaba el HTML
 * real, y por tanto no podian fallar pasara lo que pasara en la aplicacion. Se borraron.
 * Esto las sustituye abriendo los ficheros de verdad.
 *
 * MEDIDO, y por eso se prueba el body y no otra cosa: los cinco usan el mismo patron
 * —ocultar el body al arrancar, `mostrarUI()` con guard de `_uiConfirmado`, y el guard se
 * levanta al recibir PADRE_CONFIRMA_HIJO_LISTO—. hijo6 no tiene esta proteccion y por eso
 * no esta aqui.
 *
 * POR QUE hijo4 NO TIENE CASO UV-3
 *
 * Los otros cuatro descartan el mensaje si no trae `origen`. hijo4 no: su handler no lleva
 * ese guard, y su `messagingAdapter` tampoco lo comprueba —solo exige
 * `event.source === globalThis.parent`, que es un control fuerte, asi que no queda
 * expuesto—. La diferencia desaparece sola cuando hijo4 hable por el bus, que SI rechaza
 * en voz alta cualquier mensaje sin `origen`. Hasta entonces, aqui queda dicho en vez de
 * escondido en un `skip` silencioso.
 *
 * ROJO ANTES QUE VERDE: medido por hijo, rompiendo cada proteccion por separado.
 *
 * SOBRE EL STUB DE MENSAJERIA: cargado como pagina suelta —no dentro de un iframe— el
 * `enviarMensaje` de estos hijos cae a una rama que reintenta 10 x 500 ms sobre
 * `globalThis.mensajeria`, que standalone no existe. Son 5 s por vuelta que no prueban
 * nada y ensucian la tanda. Mismo stub y mismo motivo que en el spec 31.
 */

const MARCO = 'tests/e2e/helpers/marco-vacio.html';

/**
 * `dentroDeMarco` marca a los hijos que NO pueden cargarse sueltos y necesitan un padre.
 *
 * Solo hijo5. Su módulo arranca comprobando `globalThis.parent !== globalThis` y, si no,
 * lanza "Componente debe ejecutarse dentro de un iframe" y aborta — con lo que su propio
 * ocultado de UI, que viene despues, nunca llega a ejecutarse. MEDIDO: cargado suelto su
 * body se queda visible, no por un fallo de la proteccion sino porque el fichero entero se
 * ha detenido antes. Los otros cuatro no llevan esa guarda y corren sueltos.
 */
const HIJOS = [
  { id: 'hijo1', fichero: 'extrainfo-hijo1.html', exigeOrigen: true },
  { id: 'hijo2', fichero: 'coordenadas-hijo2.html', exigeOrigen: true },
  { id: 'hijo3', fichero: 'audio-hijo3.html', exigeOrigen: true },
  { id: 'hijo4', fichero: 'retos-hijo4.html', exigeOrigen: false },
  { id: 'hijo5', fichero: 'boton-casa-hijo5.html', exigeOrigen: true, dentroDeMarco: true },
];

async function proveerMensajeriaStub(page) {
  await page.addInitScript(() => {
    globalThis.mensajeria = globalThis.mensajeria || {
      enviarMensaje: () => Promise.resolve({ exito: true, metodo: 'stub-e2e' }),
    };
  });
}

/** Abre el hijo y devuelve el contexto donde mirar y desde donde empujar. */
async function abrir(page, hijo) {
  if (!hijo.dentroDeMarco) {
    await page.goto(hijo.fichero);
    await page.waitForLoadState('domcontentloaded');
    return;
  }
  await page.goto(MARCO);
  // Ruta ABSOLUTA: el marco vive en /tests/e2e/helpers/, asi que un src relativo buscaria
  // el hijo ahi dentro y se comeria un 404 en silencio —el iframe cargaria la pagina de
  // error, cuyo body esta visible, y el test fallaria culpando a la proteccion del hijo.
  await page.evaluate((src) => new Promise((resolve) => {
    const el = document.createElement('iframe');
    el.id = 'marco-hijo';
    el.src = src;
    el.addEventListener('load', () => resolve(), { once: true });
    document.body.appendChild(el);
  }), `/${hijo.fichero}`);

  // El arnes tiene que delatarse a si mismo. Un 404 tambien carga un documento con body
  // visible, asi que sin esta comprobacion el fallo del arnes parecia un fallo de la
  // proteccion del hijo (paso: el src relativo resolvia dentro de helpers/).
  const cargado = await page.evaluate(() => {
    const doc = document.getElementById('marco-hijo')?.contentDocument;
    return { url: doc?.location?.href || '', titulo: (doc?.body?.innerHTML || '').slice(0, 60) };
  });
  expect(cargado.url, `el marco tenia que cargar ${hijo.fichero}, no ${cargado.url}`).toContain(hijo.fichero);
  expect(cargado.titulo, 'el marco cargo una pagina de error, no el hijo').not.toContain('404');
}

/**
 * Lo que de verdad ve el usuario: si el body esta oculto, no hay interfaz.
 * Se mira donde vive el hijo — su propio documento, este suelto o dentro del marco.
 */
function bodyVisible(page, hijo) {
  if (!hijo.dentroDeMarco) return page.evaluate(() => document.body.style.display !== 'none');
  return page.evaluate(() => {
    const doc = document.getElementById('marco-hijo')?.contentDocument;
    if (!doc || !doc.body) return null; // null != true y != false: delata un fallo de arnes
    return doc.body.style.display !== 'none';
  });
}

async function enviarConfirmacion(page, hijo, { conOrigen }) {
  await page.evaluate(({ id, conOrigen, enMarco }) => {
    const mensaje = {
      tipo: 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO',
      destino: id,
      datos: { timestamp: Date.now() },
    };
    if (conOrigen) mensaje.origen = 'padre';
    const destino = enMarco
      ? document.getElementById('marco-hijo').contentWindow
      : globalThis;
    destino.postMessage(mensaje, globalThis.location.origin);
  }, { id: hijo.id, conOrigen, enMarco: !!hijo.dentroDeMarco });
}

for (const hijo of HIJOS) {
  test.describe(`UV — ${hijo.id} no se muestra antes de tiempo`, () => {
    test.beforeEach(async ({ page }) => { await proveerMensajeriaStub(page); });

    test(`UV-1. ${hijo.id}: al cargar, su interfaz esta oculta`, async ({ page }) => {
      await abrir(page, hijo);
      expect(await bodyVisible(page, hijo)).toBe(false);
    });

    test(`UV-2. ${hijo.id}: PADRE_CONFIRMA_HIJO_LISTO con origen la muestra`, async ({ page }) => {
      await abrir(page, hijo);
      expect(await bodyVisible(page, hijo)).toBe(false);

      await enviarConfirmacion(page, hijo, { conOrigen: true });
      await expect.poll(() => bodyVisible(page, hijo), { timeout: 10_000 }).toBe(true);
    });

    if (hijo.exigeOrigen) {
      test(`UV-3. ${hijo.id}: el mismo mensaje SIN origen no la muestra`, async ({ page }) => {
        await abrir(page, hijo);

        await enviarConfirmacion(page, hijo, { conOrigen: false });

        // Margen generoso a proposito: se trata de demostrar que NO pasa, no de correr.
        await page.waitForTimeout(1500);
        expect(await bodyVisible(page, hijo)).toBe(false);

        // Y que el frame sigue vivo: el mensaje bueno posterior si la muestra. Sin esto,
        // UV-3 pasaria tambien si el hijo se hubiera quedado colgado por otro motivo.
        await enviarConfirmacion(page, hijo, { conOrigen: true });
        await expect.poll(() => bodyVisible(page, hijo), { timeout: 10_000 }).toBe(true);
      });
    }
  });
}
