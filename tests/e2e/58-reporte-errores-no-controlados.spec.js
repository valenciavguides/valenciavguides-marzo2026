/**
 * 58-reporte-errores-no-controlados.spec.js
 *
 * Un error no capturado dentro de un iframe hijo se queda solo en su consola:
 * `js/monitoreo.js` los recoge en un array local y de ese módulo solo sale el heartbeat.
 * `instalarReporteErroresAlPadre()` (js/utils.js) los conecta al canal que ya existe,
 * `SISTEMA.ERROR`, con el código `ERROR_NO_CONTROLADO`.
 *
 * Vive en utils.js porque es el único módulo que cargan los seis hijos, y se instala solo
 * al cargarse: si dependiera de una llamada explícita en seis ficheros, bastaría un olvido
 * para dejarlo mudo — que es exactamente como murió el mecanismo anterior.
 *
 *   RE-1  En la ventana principal NO se instala (el padre no se manda errores a sí mismo).
 *   RE-2  Dentro de un iframe, un error no capturado viaja como SISTEMA.ERROR.
 *   RE-3  El mismo error no se repite; uno distinto sí pasa; una promesa rechazada también.
 *   RE-4  El tope frena la inundación y se anuncia una sola vez.
 *   RE-5  Un error anterior a la mensajería se encola y llega en cuanto el bus existe.
 */

const { test, expect } = require('@playwright/test');

/** Crea un iframe hijo real y devuelve su Frame. */
async function crearHijo(page, marca) {
  // 'load' y no 'domcontentloaded': con domcontentloaded, firefox y WebKit pueden dar
  // `document.body === null` en el evaluate siguiente y el iframe no se llega a insertar.
  await page.goto('/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => document.body != null, null, { timeout: 15000 });
  await page.evaluate(async (m) => {
    await new Promise((resolve) => {
      const f = document.createElement('iframe');
      f.name = 'hijo1';
      f.src = `/extrainfo-hijo1.html?${m}=1`;
      f.onload = resolve;
      (document.body || document.documentElement).appendChild(f);
    });
  }, marca);
  const frame = page.frames().find((f) => f.url().includes(`${marca}=1`));
  expect(frame, 'el iframe hijo debe cargar').toBeTruthy();
  return frame;
}

test.describe('RE — reporte automático de errores no controlados (hijo → padre)', () => {

  test('RE-1. En la ventana principal no se instala', async ({ page }) => {
    await page.goto('/extrainfo-hijo1.html', { waitUntil: 'domcontentloaded' });
    const r = await page.evaluate(async () => {
      // URL construida en tiempo de ejecución: este import corre en el NAVEGADOR, y si se
      // escribe literal eslint intenta resolverlo contra la carpeta del test y falla.
      const u = await import(new URL('/js/utils.js', globalThis.location.origin).href);
      return { esIframe: globalThis.parent !== globalThis.window, instala: u.instalarReporteErroresAlPadre() };
    });
    expect(r.esIframe, 'precondición: aquí NO estamos dentro de un iframe').toBe(false);
    expect(
      r.instala,
      'en el padre no debe instalarse: un enviarMensaje a sí mismo no encuentra su id en iframesRegistrados y se descarta en silencio'
    ).toBe(false);
  });

  test('RE-2/RE-3/RE-4. Dentro de un iframe: viaja, se deduplica y el tope frena', async ({ page }) => {
    const frame = await crearHijo(page, 'errores');
    // El envío es síncrono (dispatchEvent → handler → enviarMensaje), así que no hace
    // falta esperar a nada: se mide contando después de cada disparo.
    const r = await frame.evaluate(() => {
      const capturado = [];
      globalThis.mensajeria = { enviarMensaje: (m) => { capturado.push(m); return true; } };
      const lanzar = (msg, fichero, linea) => globalThis.dispatchEvent(
        new ErrorEvent('error', { message: msg, filename: fichero, lineno: linea })
      );

      lanzar('boom uno', 'hijo1.js', 42);
      const tras1 = capturado.length;
      lanzar('boom uno', 'hijo1.js', 42);          // idéntico: debe deduplicarse
      const tras2 = capturado.length;
      lanzar('boom dos', 'hijo1.js', 99);          // distinto: debe pasar
      const tras3 = capturado.length;

      globalThis.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.resolve(),
        reason: new Error('promesa rota'),
      }));
      const tras4 = capturado.length;

      for (let i = 0; i < 25; i++) lanzar('masivo ' + i, 'x.js', i);   // 29 en total, tope 20

      return {
        tras1, tras2, tras3, tras4,
        primero: capturado[0],
        tipos: [...new Set(capturado.map((m) => m.tipo))],
        codigos: [...new Set(capturado.map((m) => m.datos?.codigo))],
        total: capturado.length,
        avisosDeTope: capturado.filter((m) => /Tope de/.test(m.datos?.mensaje || '')).length,
      };
    });

    expect(r.tras1, 'un error no capturado debe viajar al padre').toBe(1);
    expect(r.tras2, 'el mismo error (mensaje+fichero+línea) no puede repetirse').toBe(1);
    expect(r.tras3, 'un error distinto sí debe viajar').toBe(2);
    expect(r.tras4, 'una promesa rechazada sin capturar también').toBe(3);
    expect(r.tipos, 'usa el canal que ya existe, sin tipo nuevo').toEqual(['SISTEMA.ERROR']);
    expect(r.codigos, 'un código más en ese canal').toEqual(['ERROR_NO_CONTROLADO']);
    expect(r.primero.datos.mensaje, 'el texto lleva la ubicación').toBe('Error no capturado: boom uno (hijo1.js:42)');
    expect(r.primero.destino, 'va dirigido al padre').toBeTruthy();
    expect(r.primero.origen, 'y dice de qué hijo viene').toBeTruthy();
    expect(r.total, '29 errores no pueden producir 29 mensajes: el tope está en 20').toBeLessThanOrEqual(22);
    expect(r.avisosDeTope, 'el tope se anuncia una vez — callarse sin avisar lo haría invisible').toBe(1);
  });

  test('RE-5. Un error anterior a la mensajería se encola y llega después', async ({ page }) => {
    const frame = await crearHijo(page, 'arranque');
    const r = await frame.evaluate(async () => {
      delete globalThis.mensajeria;                     // como en el arranque real
      globalThis.dispatchEvent(new ErrorEvent('error', { message: 'error de arranque', filename: 'boot.js', lineno: 7 }));
      const capturado = [];
      globalThis.mensajeria = { enviarMensaje: (m) => { capturado.push(m); return true; } };
      // El drenaje reintenta cada 250 ms: se espera a que ocurra, no un tiempo fijo.
      const t0 = Date.now();
      while (capturado.length === 0 && Date.now() - t0 < 8000) {
        await new Promise((res) => setTimeout(res, 50));
      }
      return { recibidos: capturado.length, mensaje: capturado[0]?.datos?.mensaje ?? null };
    });
    expect(r.recibidos, 'un error de arranque no puede perderse: se encola hasta que hay bus').toBe(1);
    expect(r.mensaje).toBe('Error no capturado: error de arranque (boot.js:7)');
  });
});
