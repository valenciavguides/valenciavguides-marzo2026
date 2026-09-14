/**
 * 73 — El reloj del rescate: avisa, no gasta
 *
 * POR QUE EXISTE
 *
 * Cuarta y última pieza del rescate a petición (`docs/rescate-a-peticion.md`). El barrido que
 * antes gastaba rescates él solo cambia de oficio: ahora solo recuerda que hay una salida,
 * a los 8, 10, 12 y 14 minutos parado en el mismo punto. Quien decide es el usuario.
 *
 * Sustituye a `42-ttl-tramo-saltos-seguridad.spec.js` y a `66-rescate-tramo-ruidoso.spec.js`,
 * que probaban el mecanismo retirado. De aquellos se conservan aquí las dos afirmaciones que
 * siguen valiendo, para no perder cobertura al cambiar de mecanismo:
 *
 *   - TTL-5 → RR-6: fuera de modo AVENTURA el barrido no hace nada.
 *   - RT-3  → RR-7: los topes son por aventura y nunca devuelven `undefined`.
 *
 * LO QUE HAY QUE PROBAR, y por qué cada uno:
 *
 *   - LA FICHA NACE AL ACTIVARSE EL ELEMENTO (hueco 7). Antes nacía con la llegada, con el
 *     reto resuelto o con el fin del audio. Quien se queda bloqueado sin que ninguno de los
 *     tres ocurra no tenía ficha, y sin ficha no hay reloj: el aviso no salía NUNCA. Es el
 *     hueco que dejaba el mecanismo entero sin disparar justo para el usuario que lo necesita.
 *
 *   - SOLO EL ELEMENTO ACTUAL (hueco 8). Recorrer todas las fichas ofrecería ayuda sobre
 *     puntos que el usuario dejó atrás hace rato.
 *
 *   - CUATRO AVISOS Y SILENCIO. Un aviso que se repite cada dos minutos para siempre deja de
 *     ser ayuda y pasa a ser acoso.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/** Deja el padre en AVENTURA sobre un tramo, con su ficha recién creada. */
async function prepararConFicha(page) {
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
    const clave = tramo.padreid;
    globalThis.estado.pendingCompleciones = {
      [clave]: { tipo: 'tramo', llegada: false, audio: false, reto: false, timestamp: Date.now() },
    };
    return { listo: true, clave };
  });
}

/**
 * Retrasa el reloj de la ficha los minutos pedidos y corre un barrido. Se mueve el sello de
 * tiempo en vez de esperar de verdad: son 14 minutos de espera los que hay en juego.
 * Devuelve cuántas veces ha salido el cartel en total.
 */
const correrReloj = (page, clave, minutos) => page.evaluate(({ clave, minutos }) => {
  const ficha = globalThis.estado.pendingCompleciones[clave];
  ficha.timestamp = Date.now() - minutos * 60_000;
  globalThis.__avisos = globalThis.__avisos || 0;
  if (!globalThis.__espiaPuesta) {
    globalThis.__espiaPuesta = true;
    const real = globalThis._mostrarCartelRecordatorioRescate;
    globalThis._mostrarCartelRecordatorioRescate = async (...args) => {
      globalThis.__avisos++;
      return real?.(...args);
    };
  }
  globalThis._ejecutarBarridoRecordatorioRescate();
  return globalThis.__avisos;
}, { clave, minutos });

test.describe('RR — El reloj del recordatorio de rescate', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(
      () => typeof globalThis._ejecutarBarridoRecordatorioRescate === 'function',
      null, { timeout: 15_000 },
    );
  });

  test('RR-1. Antes de los 8 minutos no dice nada', async ({ page }) => {
    const prep = await prepararConFicha(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    expect(await correrReloj(page, prep.clave, 0), 'recién llegado, ningún aviso').toBe(0);
    expect(await correrReloj(page, prep.clave, 7.9), 'a falta de seis segundos, tampoco').toBe(0);
  });

  test('RR-2. A los 8 minutos avisa una vez, y no repite hasta el minuto 10', async ({ page }) => {
    const prep = await prepararConFicha(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    expect(await correrReloj(page, prep.clave, 8), 'el primer aviso').toBe(1);
    // El barrido corre cada 60 s: entre el 8 y el 10 pasa varias veces y no debe insistir.
    expect(await correrReloj(page, prep.clave, 8.5), 'sin repetirse en cada vuelta').toBe(1);
    expect(await correrReloj(page, prep.clave, 9.9), 'ni al filo del siguiente').toBe(1);
    expect(await correrReloj(page, prep.clave, 10), 'y el segundo llega en su minuto').toBe(2);
  });

  test('RR-3. Cuatro avisos y después silencio', async ({ page }) => {
    // Un aviso que se repite para siempre deja de ser ayuda. El asistente sigue disponible.
    const prep = await prepararConFicha(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    for (const m of [8, 10, 12, 14]) await correrReloj(page, prep.clave, m);
    expect(await correrReloj(page, prep.clave, 14), 'los cuatro avisos acordados').toBe(4);
    expect(await correrReloj(page, prep.clave, 30), 'y a la media hora sigue callado').toBe(4);
    expect(await correrReloj(page, prep.clave, 120), 'ni a las dos horas insiste').toBe(4);
  });

  test('RR-4. A un punto ya resuelto no se le ofrece ayuda para salir de él', async ({ page }) => {
    // Hueco 8: el barrido no miraba si el elemento estaba completo.
    const prep = await prepararConFicha(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate((clave) => {
      globalThis.estado.pendingCompleciones[clave].llegada = true;
    }, prep.clave);

    expect(await correrReloj(page, prep.clave, 20), 'con la llegada confirmada, ni un aviso').toBe(0);
  });

  test('RR-5. Solo mira el elemento ACTUAL, no todas las fichas', async ({ page }) => {
    // Un punto que el usuario dejó atrás hace rato no puede seguir pidiendo auxilio.
    const prep = await prepararConFicha(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);

    await page.evaluate(() => {
      const els = globalThis.DATOS_PADRE.Aventura1.es.elementosIDpadre;
      const otro = els.filter((e) => e.tipo === 'tramo')[1];
      globalThis.estado.elementoActual = otro;
    });

    expect(await correrReloj(page, prep.clave, 20), 'la ficha vieja no dispara nada').toBe(0);
  });

  test('RR-6. Fuera de modo AVENTURA el barrido no hace nada', async ({ page }) => {
    // Heredado de TTL-5, que sigue valiendo con el mecanismo nuevo.
    const prep = await prepararConFicha(page);
    test.skip(!prep.listo, `Precondición no disponible: ${JSON.stringify(prep)}`);
    await page.evaluate(() => { globalThis.estado.modo.actual = 'casa'; });

    expect(await correrReloj(page, prep.clave, 20), 'en CASA no hay recorrido que recordar').toBe(0);
  });

  test('RR-7. Los topes son por aventura y nunca devuelven nada indefinido', async ({ page }) => {
    // Heredado de RT-3. La puerta del 18 % ya no existe, así que lo que queda por comprobar
    // es que cada aventura tiene su número y que una desconocida cae en el valor por defecto
    // en vez de dejar el tope en `undefined`, que dejaría pasar rescates sin límite.
    const r = await page.evaluate(() => {
      const txt = document.documentElement.outerHTML;
      return {
        porDefecto: /LIMITES_RESCATE\[aventura\] \|\| \{ max: 12 \}/.test(txt),
        largaAparte: /LIMITES_RESCATE = \{ Aventura34km: \{ max: 35 \} \}/.test(txt),
        sinPuerta: !/progresoMinimo/.test(txt.replace(/Ya no hay `progresoMinimo`[^\n]*/g, '')),
      };
    });
    expect(r.porDefecto, 'una aventura sin entrada propia usa 12, nunca undefined').toBe(true);
    expect(r.largaAparte, 'la de 34 km tiene los suyos: 35').toBe(true);
    expect(r.sinPuerta, 'y la puerta de progreso del automatismo ya no existe').toBe(true);
  });

  test('RR-8. La ficha nace al ACTIVARSE el elemento, no con su primer evento', async ({ page }) => {
    // El hueco que dejaba todo el mecanismo sin disparar. Sin ficha no hay reloj, y la ficha
    // nacía solo con la llegada, el reto resuelto o el fin del audio — ninguno de los cuales
    // ocurre si el usuario se queda bloqueado antes de llegar.
    const r = await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
        await globalThis.__cargarDatosAventuraDiferidos();
      }
      const els = globalThis.DATOS_PADRE?.Aventura1?.es?.elementosIDpadre;
      const tramo = els?.find((e) => e.tipo === 'tramo');
      if (!tramo) return { listo: false };

      if (!globalThis.estado.modo) globalThis.estado.modo = {};
      globalThis.estado.modo.actual = 'aventura';
      globalThis.estado.pendingCompleciones = {};

      // El camino real por el que un elemento pasa a ser el actual. Nada de eventos.
      await globalThis.__triggerCambioParadaInterno({ paradaId: tramo.padreid });

      const ficha = globalThis.estado.pendingCompleciones[tramo.padreid];
      return { listo: true, existe: !!ficha, conReloj: typeof ficha?.timestamp === 'number' };
    });
    test.skip(!r.listo, 'Precondición no disponible');

    expect(r.existe, 'activar el elemento tiene que crear su ficha').toBe(true);
    expect(r.conReloj, 'y con su sello de tiempo, que es el reloj').toBe(true);
  });
});
