/**
 * 122 — El botón de retos de hijo3 lo decide un solo sitio
 *
 * POR QUE EXISTE
 *
 * «Audio terminado» es un dato del elemento, y da igual cómo se llegó a él: escuchado entero,
 * saltado o dado por no disponible. El padre lo guarda en un solo sitio, la ficha del elemento
 * (`estado.pendingCompleciones[clave].audio`). El botón de retos de hijo3 tiene que salir de ahí,
 * y de las otras cuatro cosas de las que depende, miradas todas a la vez: si el elemento tiene
 * reto, si hay un reto abierto, el modo y si el usuario está fuera de rango con la gracia agotada.
 *
 * No era así. Cinco funciones encendían o apagaban ese botón, cada una mirando su parte. La de
 * la activación del elemento —que corría también al volver dentro de rango y al recargarse
 * hijo3— lo apagaba «hasta que termine el audio» sin mirar si ya había terminado, y ponía a
 * cero el estado del reto. Con el audio saltado no hay fin que esperar: en los once idiomas sin
 * audio grabado el botón no volvía a encenderse y la parada quedaba bloqueada
 * (`docs/estudio-caminos.md`, K-82; medido en el recorrido real del 2026-10-12).
 *
 * Todo va contra la aplicación de verdad: el padre real, sus hijos reales, el bus real y el
 * botón real de hijo3. Lo único que se simula es quién origina cada aviso (hijo2 dice «dentro
 * de rango» porque se lo pide el test, no porque el GPS se haya movido), y se manda por el bus
 * del propio hijo.
 *
 *   BR-1  Saltar el audio enciende el botón, y volver dentro de rango NO lo apaga (K-82).
 *   BR-2  Lo mismo con el audio escuchado entero (fin de reproducción que manda hijo3).
 *   BR-3  Control: con el audio sin terminar, volver dentro de rango lo deja apagado.
 *   BR-4  hijo3 se cae y el supervisor lo recarga: con el audio terminado vuelve encendido.
 *   BR-5  Control: hijo3 se recarga con el audio sin terminar y vuelve apagado.
 *   BR-6  Con un reto abierto el botón está apagado, también al volver dentro de rango; el
 *         estado del reto no se rehace, y al cerrar el reto se enciende.
 *   BR-7  Fuera de rango con la gracia agotada se apaga; al volver, se enciende.
 *   BR-8  Cerrar un reto estando fuera de rango NO lo enciende; al volver dentro, sí.
 *   BR-9  Reactivar el mismo elemento (lo hace la recuperación de hijo2) con el audio terminado
 *         no lo apaga ni rehace el estado del reto.
 *   BR-R1 Control: con el botón encendido, el recordatorio «pulse retos» sale a los 10 s.
 *   BR-R2 Con el botón apagado por estar fuera de rango, el recordatorio no sale.
 *   BR-R3 Con un reto abierto, el recordatorio no sale.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen BR-1, BR-2, BR-4, BR-6 (el estado del reto
 * se rehace), BR-7, BR-8, BR-9, BR-R2 y BR-R3; BR-3, BR-5 y BR-R1 pasan, que es lo que les toca
 * a los controles.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Parada real de la Aventura1, con reto y con audio. En inglés ese audio no tiene fichero: es el
// caso en que saltarlo es la única forma de terminarlo.
const PARADA = { id: 'Av1-P-1', clave: 'padre-P1', lat: 39.47959, lng: -0.37583, audio: 'audio-Av1-P-1-en', reto: 'R4-Av1-en' };

/** El botón de verdad, en el hijo3 de verdad. De fábrica no lleva opacidad en línea: si la lleva, el padre ya le ha mandado un estado. */
const botonRetos = (page) => page.evaluate(() => {
  const b = document.getElementById('hijo3')?.contentDocument?.getElementById('retosBtn');
  return b ? { apagado: b.disabled, sincronizado: b.style.opacity !== '' } : null;
});

/** Espera a que el botón real quede como se dice. */
const esperarBoton = (page, apagado, mensaje) =>
  expect.poll(async () => (await botonRetos(page))?.apagado, { timeout: 10_000, message: mensaje }).toBe(apagado);

/** Pone en hijo3 un oído que apunta lo que el padre le manda de verdad sobre su botón de retos. */
const escucharEnHijo3 = (page) => page.evaluate(() => {
  const w = document.getElementById('hijo3').contentWindow;
  w.__retosBtn = [];
  w.addEventListener('message', (e) => {
    if (e.source === w.parent && e.data?.datos?.control === 'retosBtn') w.__retosBtn.push({ tipo: e.data.tipo, razon: e.data.datos.razon ?? e.data.datos.motivo ?? null });
  });
});

const recibidoEnHijo3 = (page) => page.evaluate(() => document.getElementById('hijo3').contentWindow.__retosBtn || []);

/** Espera a que hijo3 reciba algo más sobre su botón que lo que ya tenía, y devuelve lo último. */
async function esperarAvisoNuevo(page, cuantosHabia, mensaje) {
  await expect.poll(async () => (await recibidoEnHijo3(page)).length, { timeout: 10_000, message: mensaje }).toBeGreaterThan(cuantosHabia);
  const todos = await recibidoEnHijo3(page);
  return todos[todos.length - 1];
}

/** Un aviso al padre por el bus del propio hijo. */
async function desdeHijo(page, hijo, tipo, datos) {
  const enviado = await page.evaluate(({ hijo, tipo, datos }) =>
    document.getElementById(hijo).contentWindow.mensajeria.enviarMensaje({ tipo, destino: 'padre', datos }), { hijo, tipo, datos });
  expect(enviado, `${hijo} tiene que poder mandar ${tipo}`).toBe(true);
}

const volverDentroDeRango = (page) => desdeHijo(page, 'hijo2', 'NAVEGACION.GPS.DENTRO_DE_RANGO', { timestamp: Date.now() });
const salirDeRangoConLaGraciaAgotada = (page) =>
  desdeHijo(page, 'hijo2', 'NAVEGACION.USUARIO_FUERA_RANGO', { distancia: 30, franja: 'fuera', elementoMasCercano: PARADA.id, timestamp: Date.now() });
const terminarDeEscucharElAudio = (page) =>
  desdeHijo(page, 'hijo3', 'AUDIO.FIN_REPRODUCCION', { audioId: PARADA.audio, duracion: 1, timestamp: Date.now() });
const saltarElAudio = (page) => page.evaluate(() => document.getElementById('audio-action-skip').click());

const fichaDeLaParada = (page) => page.evaluate((clave) => {
  const f = globalThis.estado?.pendingCompleciones?.[clave];
  return f ? { audio: f.audio, reto: f.reto } : null;
}, PARADA.clave);

/** Deja el padre real, con sus hijos reales, en AVENTURA sobre la parada. */
async function prepararParada(page) {
  await page.evaluate(async () => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'en';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
  });
  // Los hijos se cargan con el ayudante común; la espera de abajo nombra los que este spec necesita.
  await cargarHijosDelPadre(page);
  await page.waitForFunction(
    () => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)),
    null, { timeout: 60_000 },
  );

  await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
  const cambio = await page.evaluate((id) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: id } }), PARADA.id);
  expect(cambio?.exito, `la parada ${PARADA.id} tiene que activarse: ${JSON.stringify(cambio)}`).toBe(true);

  // Punto de partida, comprobado: el padre ya ha hablado con hijo3, el botón está apagado y el audio sin terminar.
  await expect.poll(async () => (await botonRetos(page))?.sincronizado, { timeout: 10_000, message: 'el padre tiene que haber mandado a hijo3 el estado de su botón' }).toBe(true);
  await esperarBoton(page, true, 'recién activada la parada, con el audio sin terminar, el botón de retos está apagado');
  expect(await fichaDeLaParada(page), 'la ficha de la parada existe y su audio está sin terminar').toMatchObject({ audio: false });
  await escucharEnHijo3(page);
}

/** Abre el reto pulsando el botón de verdad, y espera a que el padre lo enseñe. */
async function abrirElReto(page) {
  await page.evaluate(() => document.getElementById('hijo3').contentDocument.getElementById('retosBtn').click());
  await page.waitForFunction(() => document.getElementById('hijo4')?.classList.contains('visible'), null, { timeout: 20_000 });
}

/** Cierra el reto por el cierre normal, el mismo que usa el padre cuando lo cierra él. */
async function cerrarElReto(page) {
  await page.evaluate((retoId) => globalThis.mensajeria.despacharLocal({ tipo: 'RETO.OCULTAR', datos: { retoId } }), PARADA.reto);
  await page.waitForFunction(() => !document.getElementById('hijo4')?.classList.contains('visible'), null, { timeout: 10_000 });
}

test.describe('BR — El botón de retos de hijo3 sale de un solo sitio', () => {
  test.beforeEach(async ({ page, context }) => {
    // Antes del goto: sin esto, el watchPosition real que arranca al entrar en AVENTURA se queda colgado en Firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await prepararParada(page);
  });

  test('BR-1. Saltar el audio enciende el botón, y volver dentro de rango no lo apaga', async ({ page }) => {
    await saltarElAudio(page);
    await esperarBoton(page, false, 'audio saltado es audio terminado: el botón de retos se enciende');
    expect(await fichaDeLaParada(page)).toMatchObject({ audio: true });

    const habia = (await recibidoEnHijo3(page)).length;
    await volverDentroDeRango(page);
    const aviso = await esperarAvisoNuevo(page, habia, 'al volver dentro de rango el padre le dice a hijo3 cómo queda su botón');

    expect(aviso, 'con el audio ya terminado, lo que le dice es que siga encendido').toMatchObject({ tipo: 'CONTROL.HABILITAR', razon: 'audio_finalizado' });
    await esperarBoton(page, false, 'el botón de retos sigue encendido: el audio ya había terminado');
  });

  test('BR-2. Lo mismo con el audio escuchado entero', async ({ page }) => {
    await terminarDeEscucharElAudio(page);
    await esperarBoton(page, false, 'audio escuchado entero: el botón de retos se enciende');

    const habia = (await recibidoEnHijo3(page)).length;
    await volverDentroDeRango(page);
    const aviso = await esperarAvisoNuevo(page, habia, 'al volver dentro de rango el padre le dice a hijo3 cómo queda su botón');

    expect(aviso).toMatchObject({ tipo: 'CONTROL.HABILITAR', razon: 'audio_finalizado' });
    await esperarBoton(page, false, 'el botón de retos sigue encendido');
  });

  test('BR-3. Control: con el audio sin terminar, volver dentro de rango lo deja apagado', async ({ page }) => {
    const habia = (await recibidoEnHijo3(page)).length;
    await volverDentroDeRango(page);
    const aviso = await esperarAvisoNuevo(page, habia, 'el padre contesta también con el audio sin terminar');

    expect(aviso, 'y lo que dice es que espere al audio').toMatchObject({ tipo: 'CONTROL.DESHABILITAR', razon: 'esperar_fin_audio_aventura' });
    await esperarBoton(page, true, 'sin audio terminado no hay reto');
  });

  /** Tumba hijo3 y espera a que el supervisor del bus lo recargue y el padre le mande el estado de su botón. */
  const caerYRecuperarHijo3 = async (page) => {
    await page.evaluate(() => { document.getElementById('hijo3').contentWindow.location.replace('about:blank'); });
    // Tres latidos sin respuesta (15 s) y la recarga: el hijo deja de constar como listo y vuelve a constar.
    await page.waitForFunction(() => {
      const listo = globalThis.__vv_stateManager.hijoEstaListo('hijo3');
      if (!listo) globalThis.__e2e_hijo3Cayo = true;
      return globalThis.__e2e_hijo3Cayo === true && listo
        && /audio-hijo3\.html/.test(document.getElementById('hijo3').contentWindow.location.href);
    }, null, { timeout: 60_000 });
    await expect.poll(async () => (await botonRetos(page))?.sincronizado, { timeout: 15_000, message: 'el padre le manda al hijo3 nuevo el estado de su botón' }).toBe(true);
  };

  test('BR-4. hijo3 se cae y se recarga: con el audio terminado vuelve encendido', async ({ page }) => {
    test.setTimeout(120_000);
    await saltarElAudio(page);
    await esperarBoton(page, false, 'precondición: el botón está encendido antes de la caída');

    await caerYRecuperarHijo3(page);
    await esperarBoton(page, false, 'el hijo3 recargado recibe su botón encendido: el audio ya había terminado');
  });

  test('BR-5. Control: hijo3 se recarga con el audio sin terminar y vuelve apagado', async ({ page }) => {
    test.setTimeout(120_000);
    await caerYRecuperarHijo3(page);
    await esperarBoton(page, true, 'sin audio terminado, el hijo3 recargado recibe su botón apagado');
    expect(await fichaDeLaParada(page)).toMatchObject({ audio: false });
  });

  test('BR-6. Con un reto abierto está apagado, también al volver dentro de rango; el estado del reto no se rehace', async ({ page }) => {
    await saltarElAudio(page);
    await esperarBoton(page, false, 'precondición: el botón está encendido');
    await abrirElReto(page);
    await esperarBoton(page, true, 'con el reto abierto, el botón se apaga');

    await page.evaluate(() => { globalThis.__e2e_retoActual = globalThis.estado.retoActual; });
    const habia = (await recibidoEnHijo3(page)).length;
    await volverDentroDeRango(page);
    const aviso = await esperarAvisoNuevo(page, habia, 'el padre contesta a la vuelta dentro de rango');

    expect(aviso, 'el reto sigue abierto: apagado, y por eso').toMatchObject({ tipo: 'CONTROL.DESHABILITAR', razon: 'reto_solicitado' });
    const elMismo = await page.evaluate(() => globalThis.estado.retoActual === globalThis.__e2e_retoActual);
    expect(elMismo, 'el estado del reto es el mismo objeto: no se rehace con el elemento a medias').toBe(true);

    await cerrarElReto(page);
    await esperarBoton(page, false, 'al cerrar el reto sin resolver, el botón vuelve a encenderse');
  });

  test('BR-7. Fuera de rango con la gracia agotada se apaga; al volver, se enciende', async ({ page }) => {
    await saltarElAudio(page);
    await esperarBoton(page, false, 'precondición: el botón está encendido');

    let habia = (await recibidoEnHijo3(page)).length;
    await salirDeRangoConLaGraciaAgotada(page);
    let aviso = await esperarAvisoNuevo(page, habia, 'el padre apaga el botón al salir de rango');
    expect(aviso).toMatchObject({ tipo: 'CONTROL.DESHABILITAR', razon: 'fuera_de_rango' });
    await esperarBoton(page, true, 'fuera de rango, apagado');

    habia = (await recibidoEnHijo3(page)).length;
    await volverDentroDeRango(page);
    aviso = await esperarAvisoNuevo(page, habia, 'el padre contesta a la vuelta');
    expect(aviso, 'el audio ya había terminado antes de salir').toMatchObject({ tipo: 'CONTROL.HABILITAR', razon: 'audio_finalizado' });
    await esperarBoton(page, false, 'de vuelta dentro de rango, encendido');
  });

  test('BR-8. Cerrar un reto estando fuera de rango no lo enciende; al volver dentro, sí', async ({ page }) => {
    await saltarElAudio(page);
    await esperarBoton(page, false, 'precondición: el botón está encendido');
    await abrirElReto(page);
    await esperarBoton(page, true, 'con el reto abierto, apagado');

    await salirDeRangoConLaGraciaAgotada(page);
    await expect.poll(() => page.evaluate(() => globalThis.estado.usuarioFueraRango?.activo), { timeout: 10_000, message: 'el padre anota que el usuario está fuera de rango' }).toBe(true);

    const habia = (await recibidoEnHijo3(page)).length;
    await cerrarElReto(page);
    const aviso = await esperarAvisoNuevo(page, habia, 'al cerrar el reto el padre le dice a hijo3 cómo queda su botón');
    expect(aviso, 'cerrado el reto, lo que manda es estar fuera de rango').toMatchObject({ tipo: 'CONTROL.DESHABILITAR', razon: 'fuera_de_rango' });
    await esperarBoton(page, true, 'fuera de rango, el botón no se enciende por cerrar el reto');

    await volverDentroDeRango(page);
    await esperarBoton(page, false, 'de vuelta dentro de rango, encendido');
  });

  test('BR-9. Reactivar el mismo elemento con el audio terminado no lo apaga ni rehace el estado del reto', async ({ page }) => {
    await saltarElAudio(page);
    await esperarBoton(page, false, 'precondición: el botón está encendido');
    await page.evaluate(() => { globalThis.__e2e_retoActual = globalThis.estado.retoActual; });

    const habia = (await recibidoEnHijo3(page)).length;
    const cambio = await page.evaluate((id) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: id } }), PARADA.id);
    expect(cambio?.exito).toBe(true);
    const aviso = await esperarAvisoNuevo(page, habia, 'la reactivación le dice a hijo3 cómo queda su botón');

    expect(aviso, 'el elemento es el mismo y su audio ya terminó').toMatchObject({ tipo: 'CONTROL.HABILITAR', razon: 'audio_finalizado' });
    await esperarBoton(page, false, 'el botón de retos sigue encendido');
    expect(await fichaDeLaParada(page), 'la ficha sigue siendo la misma').toMatchObject({ audio: true });
    const elMismo = await page.evaluate(() => globalThis.estado.retoActual === globalThis.__e2e_retoActual);
    expect(elMismo, 'el estado del reto no se rehace al reactivar el mismo elemento').toBe(true);
  });
});

test.describe('BR-R — El recordatorio «pulse retos» pregunta al mismo sitio', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    // Con el reloj simulado, la espera de MapLibre real no transcurre sola: sin el stub cruzaría su plazo a mitad del test.
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await page.clock.install();
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => typeof globalThis._iniciarRecordatorioReto === 'function', null, { timeout: 15_000 });
    // El estado en que el botón de retos está encendido: AVENTURA, parada con reto, audio terminado, cerca del punto.
    await page.evaluate((p) => {
      const e = globalThis.estadoPadre;
      e.modo = e.modo || {};
      e.modo.actual = globalThis.MODOS.AVENTURA;
      e.usuarioFueraRango = { activo: false };
      e.elementoActual = { padreid: p.clave, tipo: 'parada', parada_id: p.id, audio_id: p.audio, reto_id: p.reto };
      e.pendingCompleciones = { [p.clave]: { tipo: 'parada', llegada: true, audio: true, reto: false, retosTotal: 1, retosCompletadosCount: 0, timestamp: Date.now() } };
      e.gps = e.gps || {};
      e.gps.proximidadReal = true;
    }, PARADA);
  });

  const haySalido = (page) => page.evaluate(() => !!document.getElementById('cartel-recordatorio-reto'));

  test('BR-R1. Control: con el botón encendido, el recordatorio sale a los 10 s', async ({ page }) => {
    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    await page.clock.runFor(10_000);
    await expect.poll(() => haySalido(page), { timeout: 5_000, message: 'con el botón encendido y cerca del punto, el recordatorio sale' }).toBe(true);
  });

  test('BR-R2. Con el botón apagado por estar fuera de rango, no sale', async ({ page }) => {
    await page.evaluate(() => { globalThis.estadoPadre.usuarioFueraRango = { activo: true }; });
    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    // 12 s: el primer aviso sale a los 10 s y se cierra solo a los 17 s; a los 12 s, si ha salido, está en pantalla.
    await page.clock.runFor(12_000);
    // VENTANA-OBSERVACION: que el cartel NO salga no se puede esperar con una condición; el reloj simulado ya ha corrido 12 s.
    await page.waitForTimeout(200);
    expect(await haySalido(page), 'no se recuerda pulsar un botón apagado').toBe(false);
  });

  test('BR-R3. Con un reto abierto, no sale', async ({ page }) => {
    await page.evaluate(() => { document.getElementById('hijo4').classList.add('visible'); });
    await page.evaluate(() => globalThis._iniciarRecordatorioReto());
    await page.clock.runFor(12_000);
    // VENTANA-OBSERVACION: que el cartel NO salga no se puede esperar con una condición; el reloj simulado ya ha corrido 12 s.
    await page.waitForTimeout(200);
    expect(await haySalido(page), 'con el reto abierto no se recuerda pulsar su botón').toBe(false);
  });
});
