'use strict';

const { test, expect } = require('@playwright/test');

/**
 * UV — hijo3 no ensena su interfaz hasta que el padre confirma.
 *
 *   UV-1  al cargar, el body esta oculto (display:none)
 *   UV-2  PADRE_CONFIRMA_HIJO_LISTO con origen lo muestra
 *   UV-3  el mismo mensaje SIN origen NO lo muestra
 *
 * POR QUE EXISTE ESTE FICHERO
 *
 * `audio-hijo3.html` se oculta entero al arrancar (~L1297) y `mostrarUI()` (~L1298) no
 * hace nada mientras `_uiConfirmado` sea false.
 *
 * Que hay detras de esa cortina, mirado en el DOM real: la barra de progreso
 * (#progressContainer, que nace con la clase `deshabilitado`), el tiempo (#currentTime y
 * #duration), el titulo de la parada (#titulo-parada) y el boton de retos (#retosBtn). El
 * boton de play NO esta aqui —vive en el padre, con los desplegables de control de audio—,
 * asi que lo que se evita ocultando esto no es un play prematuro: es que se vea la franja
 * con el titulo y los tiempos en blanco, y sobre todo que se pueda pulsar #retosBtn, cuyo
 * click manda RETO.SOLICITAR_RETO al padre (~L827) antes de que el padre escuche.
 *
 * Esa proteccion NO la probaba nadie. Habia una pagina —`tests/test_hijo3_audio.html`—
 * que decia comprobarla, pero llevaba dentro una copia simulada del hijo3 y comprobaba la
 * copia: sus handlers estaban escritos en el propio fichero de test, nunca cargaba
 * `audio-hijo3.html`, y por tanto no podia fallar pasara lo que pasara en la app. Ademas
 * afirmaba dos cosas falsas —que hijo3 aparca el cambio de modo (ya no: lo rechaza con
 * NACK, spec 84) y que pausa el audio al cambiar de parada (no lo hace; el audio anterior
 * se corta solo porque al llegar la parada nueva se le asigna `audioPlayer.src`, ~L745)—.
 * Se borro y se sustituyo por esto, que abre el fichero de verdad.
 *
 * UV-3 es el caso que hace que esto no sea un test laxo: el handler descarta el mensaje si
 * no trae `origen` (~L1410). Sin ese caso, UV-2 pasaria igual aunque el guard desapareciera.
 *
 * SOBRE EL STUB DE MENSAJERIA: mismo motivo y misma forma que en el spec 31. Cargado como
 * pagina suelta —no dentro de un iframe— el `enviarMensaje` de hijo3 cae a una rama que
 * reintenta 10 x 500 ms sobre `globalThis.mensajeria`, que standalone no existe. Aqui no
 * bloquea la asercion (mostrarUI corre antes del envio de UI_VISIBLE, y ese envio no se
 * espera), pero si deja al bucle de reintentos de HIJO_LISTO comiendose 5 s por vuelta y
 * ensuciando la tanda. Con el stub resuelve al instante.
 *
 * NO cubre el tercer camino por el que la UI acaba mostrandose: el fallback de ~L1387, que
 * se rinde tras 30 intentos de HIJO_LISTO (30 s) y la muestra igual, con un warn. Probarlo
 * pide reloj simulado y son 30 s de timers; queda fuera a proposito y aqui queda dicho.
 */

/** El hijo espera `globalThis.mensajeria` cuando no vive en un iframe. Ver cabecera. */
async function proveerMensajeriaStub(page) {
  await page.addInitScript(() => {
    globalThis.mensajeria = globalThis.mensajeria || {
      enviarMensaje: () => Promise.resolve({ exito: true, metodo: 'stub-e2e' }),
    };
  });
}

/** Lo que de verdad ve el usuario: si el body esta oculto, no hay interfaz. */
function bodyVisible(page) {
  return page.evaluate(() => document.body.style.display !== 'none');
}

async function enviarConfirmacion(page, { conOrigen }) {
  await page.evaluate((conOrigen) => {
    const mensaje = {
      tipo: 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO',
      destino: 'hijo3',
      datos: { timestamp: Date.now() },
    };
    if (conOrigen) mensaje.origen = 'padre';
    globalThis.postMessage(mensaje, globalThis.location.origin);
  }, conOrigen);
}

test.describe('UV — hijo3 no se muestra antes de tiempo', () => {
  test.beforeEach(async ({ page }) => { await proveerMensajeriaStub(page); });

  test('UV-1. Al cargar, la interfaz de hijo3 esta oculta', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');
    expect(await bodyVisible(page)).toBe(false);
  });

  test('UV-2. PADRE_CONFIRMA_HIJO_LISTO con origen muestra la interfaz', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');
    expect(await bodyVisible(page)).toBe(false);

    await enviarConfirmacion(page, { conOrigen: true });
    await expect.poll(() => bodyVisible(page), { timeout: 5000 }).toBe(true);
  });

  test('UV-3. El mismo mensaje SIN origen no la muestra', async ({ page }) => {
    await page.goto('audio-hijo3.html');
    await page.waitForLoadState('domcontentloaded');

    await enviarConfirmacion(page, { conOrigen: false });

    // Margen generoso a proposito: se trata de demostrar que NO pasa, no de correr.
    await page.waitForTimeout(1500);
    expect(await bodyVisible(page)).toBe(false);

    // Y que el frame sigue vivo: el mensaje bueno posterior si lo muestra. Sin esto, UV-3
    // pasaria tambien si el hijo se hubiera quedado colgado por cualquier otro motivo.
    await enviarConfirmacion(page, { conOrigen: true });
    await expect.poll(() => bodyVisible(page), { timeout: 5000 }).toBe(true);
  });
});
