/**
 * 71 — El botón solo aparece si sirve, y la pantalla de decisión aguanta
 *
 * POR QUE EXISTE
 *
 * Segunda pieza del rescate a petición (`docs/rescate-a-peticion.md`). Cubre dos cosas que
 * la primera dejó abiertas y que no se ven desde el viaje de ida y vuelta:
 *
 *  1. EL BOTON. Se pintaba siempre, sin mirar el estado. En el punto de partida, fuera de
 *     la aventura o en un elemento ya confirmado, pulsarlo no podía hacer nada: no hay
 *     texto aprobado para esos casos y el plan condena el botón mudo. Ahora se esconde.
 *     Con una excepción que NO es capricho: con los rescates agotados sí se pinta, porque
 *     es lo único que hace llegar al usuario el cartel que se lo explica.
 *
 *  2. EL NUMERO. El texto del asistente dice "dispone de {total} rescates" en los doce
 *     idiomas, y hasta ahora no lo rellenaba nadie: el usuario leía la llave en crudo.
 *
 *  3. LA PANTALLA. No es un cartel, y toda la pieza depende de eso. Los diez carteles se
 *     autocierran y cualquier cartel de evento borra a los demás llamando a
 *     _ocultarCualquierCartel(). Una decisión irreversible no puede evaporarse a los 7
 *     segundos ni desaparecer porque el usuario acabe de llegar a un sitio.
 *
 * ROJO ANTES QUE VERDE: los cuatro fallan sin los cambios de esta pieza. OB-1 porque el
 * botón se pintaba siempre; OB-2 porque no existía la pantalla de agotados; OB-3 porque el
 * {total} no se rellenaba; OB-4 porque sin la pantalla no hay nada que sobreviva.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * Deja el padre en AVENTURA sobre el elemento pedido ('tramo' o 'inicio') y con los
 * rescates ya gastados si se piden. Todo ANTES de abrir el asistente: el padre le manda su
 * estado al abrirlo, así que lo que valga en ese instante es lo que decide el botón.
 */
async function prepararAventura(page, { tipo = 'tramo', gastados = 0 } = {}) {
  return page.evaluate(async ({ tipo, gastados }) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    const elementos = globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre;
    const elemento = elementos?.find((e) => e.tipo === tipo);
    if (!elemento) return { listo: false, tipo };

    if (!globalThis.estado.modo) globalThis.estado.modo = {};
    globalThis.estado.modo.actual = 'aventura';
    globalThis.estado.elementoActual = elemento;
    globalThis.estado.pendingCompleciones = {};
    globalThis.estado.tramoSkipsUsados = gastados;
    return { listo: true, nombre: elemento.nombre };
  }, { tipo, gastados });
}

/** Abre el asistente y espera a que su FAQ esté construido dentro del iframe. */
async function abrirAsistente(page) {
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  await page.waitForFunction(
    () => [...(globalThis.mensajeria?.getIframesRegistrados?.() || new Map()).keys()].includes('hijo6-chat'),
    null, { timeout: 20_000 },
  );
  await page.waitForFunction(
    () => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.tema-btn'),
    null, { timeout: 20_000 },
  );
}

/**
 * Despliega el acordeón comprobando `aria-expanded`, nunca pulsando a ciegas: los botones
 * son interruptores y pulsarlos en bucle los abre y los cierra alternativamente.
 */
async function desplegarFAQ(page) {
  return page.evaluate(async () => {
    const doc = document.getElementById('hijo6-chat').contentDocument;
    const abrirSiCerrado = (sel) => {
      for (const b of doc.querySelectorAll(sel)) {
        if (b.getAttribute('aria-expanded') !== 'true') b.click();
      }
    };
    abrirSiCerrado('.tema-btn');
    await new Promise((r) => setTimeout(r, 150));
    abrirSiCerrado('.pregunta-btn');
    await new Promise((r) => setTimeout(r, 150));
    return {
      botones: doc.querySelectorAll('.boton-rescate').length,
      preguntas: doc.querySelectorAll('.pregunta-btn').length,
      texto: doc.body.innerText,
    };
  });
}

test.describe('OB — El botón del asistente y las pantallas de decisión', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis._estadoRescate === 'function', null, { timeout: 15_000 });
  });

  test('OB-1. En el punto de partida no hay botón de rescate, pero el asistente sigue entero', async ({ page }) => {
    // Llegar al punto de partida ES empezar la aventura: rescatarlo permitiría saltárselo
    // sin salir de casa. Como no hay texto aprobado para decirlo, el botón no se pinta.
    const prep = await prepararAventura(page, { tipo: 'inicio' });
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await abrirAsistente(page);
    const faq = await desplegarFAQ(page);

    expect(faq.botones, 'en el inicio el botón de rescate no debe existir').toBe(0);
    expect(faq.preguntas, 'y el resto del asistente tiene que seguir en pie').toBeGreaterThan(3);
  });

  test('OB-2. Con los rescates agotados el botón SÍ se pinta, y al pulsarlo sale la pantalla que lo explica', async ({ page }) => {
    // La excepción deliberada: si el botón se escondiera también aquí, el cartel de
    // "se le han acabado" no lo vería nadie nunca y el texto sería letra muerta.
    const prep = await prepararAventura(page, { tipo: 'tramo', gastados: 12 });
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await abrirAsistente(page);
    const faq = await desplegarFAQ(page);
    expect(faq.botones, 'con los rescates agotados el botón tiene que seguir ahí').toBe(1);

    await page.evaluate(() => {
      document.getElementById('hijo6-chat').contentDocument.querySelector('.boton-rescate').click();
    });

    const pantalla = await page.waitForSelector('#decision-rescate', { timeout: 10_000 });
    const contenido = await pantalla.innerText();
    expect(contenido, 'debe decirle que los ha gastado todos').toMatch(/12/);
    expect(contenido, 'y ofrecerle los dos mapas, no el buzón').toMatch(/mapa/i);
    expect(contenido, 'jamás una llave sin rellenar').not.toMatch(/\{[a-z]+\}/i);

    const botones = await page.evaluate(() => [...document.querySelectorAll('#decision-rescate button[data-clave]')].map((b) => b.textContent.trim()));
    expect(botones, 'una sola salida, y con texto').toEqual(['Entendido']);
  });

  test('OB-3. El número de rescates llega al texto del asistente', async ({ page }) => {
    const prep = await prepararAventura(page, { tipo: 'tramo' });
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await abrirAsistente(page);
    const faq = await desplegarFAQ(page);

    expect(faq.texto, 'ninguna llave sin rellenar puede llegar a la pantalla').not.toContain('{total}');
    expect(faq.texto, 'y el número real tiene que estar escrito').toMatch(/dispone de 12 rescates/i);
  });

  test('OB-4. La pantalla de decisión no se autocierra ni la borra un cartel de evento', async ({ page }) => {
    // Los dos fallos que la descartan como cartel. El de transición llama a
    // _ocultarCualquierCartel(), que borra los diez carteles sin preguntar; si esta pantalla
    // estuviera en esa lista, una llegada en mitad de la lectura se llevaría la decisión.
    const prep = await prepararAventura(page, { tipo: 'tramo', gastados: 12 });
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await abrirAsistente(page);
    await desplegarFAQ(page);
    await page.evaluate(() => {
      document.getElementById('hijo6-chat').contentDocument.querySelector('.boton-rescate').click();
    });
    await page.waitForSelector('#decision-rescate', { timeout: 10_000 });

    await page.evaluate(async () => {
      await globalThis.mostrarCartelTransicion?.('tramo', 'Un tramo', 'parada', 'Una parada');
    });
    await page.waitForTimeout(500);
    expect(
      await page.locator('#decision-rescate').count(),
      'un cartel de evento NO puede llevarse por delante una decisión a medias',
    ).toBe(1);

    // El cartel más corto de la app se cierra solo a los 7 s; el resto, a los 10.
    await page.waitForTimeout(11_000);
    expect(
      await page.locator('#decision-rescate').count(),
      'y tampoco puede evaporarse sola: un autocierre no significa ni que sí ni que no',
    ).toBe(1);
  });
});
