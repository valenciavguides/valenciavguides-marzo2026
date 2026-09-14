/**
 * 72 — La concesión del rescate: qué se da, cuándo se cobra y cuándo no se da
 *
 * POR QUE EXISTE
 *
 * Tercera pieza del rescate a petición (`docs/rescate-a-peticion.md`). El usuario dice que sí
 * dos veces y el punto queda atrás. Lo que se prueba aquí no es que funcione el camino feliz
 * —eso se ve mirando— sino las tres cosas que cuestan dinero al usuario si fallan:
 *
 *  1. EL COBRO VA DIFERIDO (hueco 23). `persistProgressState()` guarda `tramoSkipsUsados` al
 *     instante pero NO guarda `pendingCompleciones`. Cobrando al pulsar Sí, un móvil sin
 *     batería entre el cartel y el botón de avanzar dejaría al usuario con un rescate menos
 *     y delante de la misma valla: pagó y no recibió nada. Cobrando al avanzar, ese mismo
 *     fallo le devuelve el rescate.
 *
 *  2. SE VUELVE A COMPROBAR TODO (huecos 4 y 20). Entre el botón y el Sí final hay dos
 *     pantallas que el usuario lee sin prisa. En ese rato pudo llegar andando, pudo cambiar
 *     el elemento o pudo acabarse el tiempo de la aventura. Conceder sobre un punto distinto
 *     del prometido, o cuando la aventura ya ha terminado, es cobrar por nada.
 *
 *  3. DECIR QUE NO ES GRATIS. Cerrar por cualquier vía equivale a no: el gasto ocurre
 *     únicamente al pulsar Sí en la segunda pantalla.
 *
 * ROJO ANTES QUE VERDE: sin `_cobrarRescateSiProcede` el contador sube al confirmar y CR-2
 * falla; sin las comprobaciones de `_concederRescate`, CR-4 y CR-5 conceden y fallan.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Deja el padre en AVENTURA sobre un tramo, sin rescates gastados. */
async function prepararAventura(page) {
  return page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    const elementos = globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre;
    const tramo = elementos?.find((e) => e.tipo === 'tramo');
    if (!tramo) return { listo: false };

    if (!globalThis.estado.modo) globalThis.estado.modo = {};
    globalThis.estado.modo.actual = 'aventura';
    globalThis.estado.elementoActual = tramo;
    globalThis.estado.indiceProgreso = elementos.indexOf(tramo);
    globalThis.estado.pendingCompleciones = {};
    globalThis.estado.paradasCompletadas = new Map();
    globalThis.estado.tramoSkipsUsados = 0;
    globalThis.estado._rescateGastoPendiente = null;
    return {
      listo: true,
      nombre: tramo.nombre,
      clave: tramo.padreid,
      idLimpio: String(tramo.tramo_id || tramo.parada_id || tramo.padreid).replace(/^padre-/, '').trim(),
    };
  });
}

/** Abre el asistente y despliega su FAQ, dejando el botón de rescate a la vista. */
async function abrirAsistenteConBoton(page) {
  await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });
  await page.waitForFunction(
    () => [...(globalThis.mensajeria?.getIframesRegistrados?.() || new Map()).keys()].includes('hijo6-chat'),
    null, { timeout: 20_000 },
  );
  await page.waitForFunction(
    () => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.tema-btn'),
    null, { timeout: 20_000 },
  );
  await page.evaluate(async () => {
    const doc = document.getElementById('hijo6-chat').contentDocument;
    // Se abre comprobando `aria-expanded`, nunca pulsando a ciegas: son interruptores.
    for (const b of doc.querySelectorAll('.tema-btn')) if (b.getAttribute('aria-expanded') !== 'true') b.click();
    await new Promise((r) => setTimeout(r, 150));
    for (const b of doc.querySelectorAll('.pregunta-btn')) if (b.getAttribute('aria-expanded') !== 'true') b.click();
    await new Promise((r) => setTimeout(r, 150));
  });
  await page.waitForFunction(
    () => !!document.getElementById('hijo6-chat')?.contentDocument?.querySelector('.boton-rescate'),
    null, { timeout: 10_000 },
  );
}

/** La primera pantalla pone la opción segura arriba; la segunda, abajo. Así se distinguen. */
const esSegundaPantalla = () =>
  document.querySelector('#decision-rescate button[data-clave]')?.dataset.clave === 'si';

/**
 * Recorre el camino del usuario: pulsa el botón del asistente y contesta a las dos
 * pantallas. `entreConfirmaciones` corre justo antes del Sí definitivo, que es donde se
 * simula lo que puede cambiar mientras el usuario lee.
 */
async function recorrerFlujo(page, { primera = 'si', segunda = 'si', entreConfirmaciones = null } = {}) {
  await page.evaluate(() => {
    document.getElementById('hijo6-chat').contentDocument.querySelector('.boton-rescate').click();
  });
  await page.waitForSelector('#decision-rescate button[data-clave]', { timeout: 10_000 });

  await page.evaluate((c) => document.querySelector(`#decision-rescate button[data-clave="${c}"]`).click(), primera);
  if (primera !== 'si') return;

  await page.waitForFunction(esSegundaPantalla, null, { timeout: 10_000 });
  if (entreConfirmaciones) await page.evaluate(entreConfirmaciones);

  await page.evaluate((c) => document.querySelector(`#decision-rescate button[data-clave="${c}"]`).click(), segunda);
  await page.waitForTimeout(800);
}

/** Lo que hay que mirar después: qué se completó, qué se cobró y qué quedó pendiente. */
const leerEstado = (page, idLimpio) => page.evaluate((id) => ({
  completado: !!globalThis.estado.paradasCompletadas?.has(id),
  usadas: globalThis.estado.tramoSkipsUsados,
  gastoPendiente: globalThis.estado._rescateGastoPendiente?.clave ?? null,
  pantalla: document.getElementById('decision-rescate')?.innerText ?? null,
}), idLimpio);

test.describe('CR — La concesión del rescate', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis._estadoRescate === 'function', null, { timeout: 15_000 });
  });

  test('CR-1. Dos síes dejan el punto atrás, y el rescate NO se ha cobrado todavía', async ({ page }) => {
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await abrirAsistenteConBoton(page);

    await recorrerFlujo(page);
    const r = await leerEstado(page, prep.idLimpio);

    expect(r.completado, 'el punto tiene que quedar dado por visitado').toBe(true);
    expect(r.usadas, 'pero el cobro todavía NO: el usuario aún no ha avanzado').toBe(0);
    expect(r.gastoPendiente, 'y queda apuntado sobre qué punto se cobrará').toBe(prep.clave);
    expect(r.pantalla, 'la pantalla le dice lo que ha gastado, contando este').toMatch(/1 de 12/);
    expect(r.pantalla, 'y jamás una llave sin rellenar').not.toMatch(/\{[a-z]+\}/i);
  });

  test('CR-2. El cobro llega al avanzar de verdad, no al confirmar', async ({ page }) => {
    // El corazón del hueco 23. Si el contador subiera al pulsar Sí, un fallo entre el
    // cartel y el botón de avanzar le costaría un rescate al usuario a cambio de nada.
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await abrirAsistenteConBoton(page);

    await recorrerFlujo(page);
    expect((await leerEstado(page, prep.idLimpio)).usadas, 'antes de avanzar, nada cobrado').toBe(0);

    await page.evaluate(async () => { await globalThis.progresarSiguienteElemento(); });
    const r = await leerEstado(page, prep.idLimpio);

    expect(r.usadas, 'al avanzar de verdad, ahora sí se cobra').toBe(1);
    expect(r.gastoPendiente, 'y la marca se consume una sola vez').toBeNull();
  });

  test('CR-3. Volver al recorrido en la primera pantalla no gasta ni completa nada', async ({ page }) => {
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await abrirAsistenteConBoton(page);

    await recorrerFlujo(page, { primera: 'no' });
    await page.waitForTimeout(500);
    const r = await leerEstado(page, prep.idLimpio);

    expect(r.completado, 'no se completa nada').toBe(false);
    expect(r.usadas, 'no se cobra nada').toBe(0);
    expect(r.gastoPendiente, 'y no queda ninguna deuda apuntada').toBeNull();
    expect(r.pantalla, 'y la pantalla se cierra').toBeNull();
  });

  test('CR-4. Si el punto cambia mientras decide, no se concede sobre otro distinto', async ({ page }) => {
    // Hueco 4: el padre resuelve el elemento de su estado, y ese estado puede cambiar entre
    // el cartel y el Sí. Conceder sobre el nuevo sería rescatar un punto que el usuario no
    // ha pedido — y cobrárselo.
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await abrirAsistenteConBoton(page);

    await recorrerFlujo(page, {
      entreConfirmaciones: () => {
        const els = globalThis.DATOS_PADRE.Aventura1.es.elementosIDpadre;
        const otro = els.filter((e) => e.tipo === 'tramo')[1];
        globalThis.estado.elementoActual = otro;
      },
    });
    const r = await leerEstado(page, prep.idLimpio);

    expect(r.completado, 'el punto prometido no se completa').toBe(false);
    expect(r.usadas, 'y no se cobra nada').toBe(0);
    expect(r.gastoPendiente, 'ni queda deuda apuntada sobre ningún punto').toBeNull();
  });

  test('CR-5. Si la aventura termina mientras decide, no hay rescate posible', async ({ page }) => {
    // Hueco 20: hijo1 lleva su propia cuenta atrás en vivo y al llegar a cero el padre monta
    // su modal a pantalla completa. Si la aventura ha terminado, no hay nada que rescatar.
    const prep = await prepararAventura(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await abrirAsistenteConBoton(page);

    await recorrerFlujo(page, {
      entreConfirmaciones: () => {
        const modal = document.createElement('div');
        modal.id = 'modal-tiempo-agotado';
        document.body.appendChild(modal);
      },
    });
    const r = await leerEstado(page, prep.idLimpio);

    expect(r.completado, 'con el tiempo agotado no se completa nada').toBe(false);
    expect(r.usadas, 'y no se cobra nada').toBe(0);
    expect(r.gastoPendiente, 'ni queda deuda apuntada').toBeNull();
  });
});
