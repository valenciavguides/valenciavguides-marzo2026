/**
 * 80 — La red de seguridad: un hijo que deja de estar sano se recupera
 *
 * POR QUE EXISTE
 *
 * El bus supervisa a todos los iframes que hacen el apretón de manos (HIJO_PREPARADO → HIJO_LISTO) y
 * contestan al latido, y recarga al que deja de estar sano. Son todos los hijos por igual: la pantalla de
 * selección y de hijo1 a hijo6. No lo son los iframes que no hacen ese apretón (mapa completo, puzzle, vídeo):
 * no tienen nada que contestar, y supervisarlos los daría por caídos siempre.
 *
 * El contrato del bus (spec 79, BC-12) prueba el mecanismo con un arnés que pasa `supervisado` a mano.
 * Eso deja dos huecos: si la PWA real no se lo pasa a un hijo, o si un hijo no contesta al latido por el
 * camino de vuelta, BC-12 sigue verde y la red de seguridad no existe — o recarga a un hijo sano cada
 * pocos segundos. Esta spec cubre justo esos huecos, contra la aplicación de verdad.
 *
 *   RC-1  Control: tras la carga, los hijos están registrados en el bus y se puede leer si están supervisados.
 *         Sin esto, un RC-2 en verde podría deberse a que no hay nada que mirar.
 *   RC-2  Todos los hijos registrados están supervisados, y ninguno de los que no hacen el apretón lo está.
 *   RC-3  La restauración de hijo1 llega a hijo1: el snapshot se dirige al id con el que el hijo
 *         está registrado (`hijo1-opciones`), no a un `hijo1` que no existe en la mensajería.
 *   RC-4  Cada hijo contesta al latido y su respuesta llega a la cuenta del bus: un hijo con latidos sin
 *         responder vuelve a cero al contestar. Es el viaje de vuelta de cada hijo hasta el supervisor.
 *   RC-5  Arranque con la selección rota: sin apretón de manos no arranca la aplicación (la pantalla de carga sigue, sin alert),
 *         el supervisor la recarga y la aplicación arranca sola cuando la selección ya puede completarlo.
 *   RC-6  Sin red, la recarga de un hijo enseña el overlay de sin conexión aunque aún no haya modo, y se va solo con `online`.
 *   RC-7  Un hijo se muestra al estar listo, también si lo recupera el supervisor pasada la gracia: el cargador no se rinde antes.
 *   RC-8  La recuperación es una sola: no hay un segundo registro del estado de los hijos ni una señal propia de fallo.
 *   RC-9  El asistente (hijo6) se carga con los demás hijos y se ve al estar listo, como cualquier hijo: mientras no lo está no se ve, ni pulsando su botón.
 *   RC-10 hijo4 recibe el reto cuando está listo: con hijo4 recuperándose, la petición espera y hijo4 no se muestra antes.
 *
 * ROJO ANTES QUE VERDE: RC-2 falla si nadie pasa `{ supervisado: true }` al registrar, RC-3 falla si la
 * restauración se dirige a un id que la mensajería no conoce, y RC-4 falla si un hijo no contesta o su
 * respuesta no llega — en los tres casos la recarga automática queda muerta, o recarga a un hijo sano, sin
 * que ningún otro test lo note. RC-5 falla si la selección vuelve a tener su propio plazo y su propio aviso al usuario (un alert)
 * en vez de esperar al supervisor; RC-6 falla si el overlay vuelve a depender del modo para un hijo caído sin red; RC-7 falla si un
 * cargador se rinde a los 30 s y deja oculto a un hijo que el supervisor recupera después; RC-8 falla si vuelve un segundo camino.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * Los hijos que hacen el apretón de manos. hijo5 no sale en RC-1 porque en esta pantalla todavía no está registrado: lo registra
 * `cargarHijo` cuando `cargarHijoCasa` lo carga (al elegir aventura). RC-2 le exige la marca igualmente, aparezca cuando aparezca.
 */
const HIJOS = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5', 'hijo6-chat'];
/** Los que se cargan en el beforeEach. */
const HIJOS_CARGADOS = ['seleccion', 'hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo6-chat'];
/** Registrados en el bus pero sin apretón de manos: ni los vigila el reloj ni tienen nada que contestar. */
const SIN_APRETON = ['mapa-completo', 'puzzle', 'video-intro'];

const frame = (page, nombre) => page.frames().find((f) => f.name() === nombre);

/** { id: supervisado } de todo lo que el bus tiene registrado ahora mismo. */
const supervision = (page) => page.evaluate(() => {
  const registrados = globalThis.mensajeria?.getIframesRegistrados?.();
  if (!registrados) return null;
  const salida = {};
  for (const [id, info] of registrados) salida[id] = info?.supervisado === true;
  return salida;
});

test.describe('RC — Un hijo caido se recupera', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(() => globalThis.cargarRestoDeiframes?.());
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosPreparados?.has('hijo2'), null, { timeout: 60_000 });
  });

  test('RC-1. Control: los hijos estan registrados en el bus y su marca es legible', async ({ page }) => {
    const marcas = await supervision(page);
    expect(marcas, 'el bus debe exponer los iframes registrados').not.toBeNull();
    for (const id of HIJOS_CARGADOS) {
      expect(
        Object.prototype.hasOwnProperty.call(marcas, id),
        `${id} tiene que estar registrado en la mensajeria; si no, el padre no puede ni escribirle ni vigilarlo. Registrados: ${Object.keys(marcas).join(', ') || '(ninguno)'}`,
      ).toBe(true);
    }
  });

  test('RC-2. Todos los hijos estan supervisados, y los que no hacen el apretón de manos no', async ({ page }) => {
    const marcas = await supervision(page);

    for (const id of HIJOS_CARGADOS) {
      expect(
        marcas[id],
        `${id} hace el apretón de manos y contesta al latido: el bus tiene que supervisarlo, como a los demás. Supervisados ahora: ${Object.keys(marcas).filter((i) => marcas[i]).join(', ') || '(ninguno)'}`,
      ).toBe(true);
    }
    // Ni uno de más: lo supervisado son los hijos. Un iframe sin apretón de manos daría un caído falso cada
    // vuelta del reloj, y el bus lo recargaría para siempre.
    expect(
      Object.keys(marcas).filter((id) => marcas[id]).sort(),
      'solo pueden estar supervisados los hijos que hacen el apretón de manos',
    ).toEqual(Object.keys(marcas).filter((id) => HIJOS.includes(id)).sort());
    for (const id of SIN_APRETON) {
      if (id in marcas) expect(marcas[id], `${id} no hace el apretón de manos: no puede estar supervisado`).toBe(false);
    }
  });

  test('RC-3. La restauracion de hijo1 llega a hijo1', async ({ page }) => {
    test.setTimeout(90_000);
    const falta = await page.evaluate(() => [
      ['SISTEMA.CAMBIO_MODO', globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true],
      ['_vv_beforeHijoReload', typeof globalThis._vv_beforeHijoReload === 'function'],
      ['_vv_afterHijoListo', typeof globalThis._vv_afterHijoListo === 'function'],
    ].filter(([, hay]) => !hay).map(([n]) => n));
    test.skip(falta.length > 0, `ganchos de recuperacion no disponibles: ${falta.join(', ')}`);

    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    // Se espera a que el modo quede APLICADO, que es la condicion real; el padre lo apunta en
    // `estadoPadre.modo.actual` —el mismo campo que lee el handler del temporizador—.
    await expect
      .poll(() => page.evaluate(() => globalThis.estadoPadre?.modo?.actual), { timeout: 10_000 })
      .toBe('aventura');

    // El tiempo restante se apunta en `estado.tiempoRestante` en cuanto llega el mensaje, sin
    // depender de que la ventana del temporizador este abierta: si dependiera, hijo1 se recargaria
    // sin temporizador que restaurar en cuanto el usuario no la hubiera tocado.
    // Auto-mensaje: uno no esta entre sus propios iframes registrados, asi que `enviarMensaje` no
    // puede entregarselo. `despacharLocal` es la via del bus para eso.
    await page.evaluate(async () => {
      await globalThis.mensajeria.despacharLocal({
        tipo: globalThis.TIPOS_MENSAJE.AVENTURA.TIEMPO_ACTUALIZADO,
        origen: globalThis.mensajeria.getComponenteId(),
        datos: { tiempoRestante: 1234, estado: 'verde', timestamp: Date.now() },
      }).catch(() => {});
    });
    await expect
      .poll(() => page.evaluate(() => globalThis.estado?.tiempoRestante), { timeout: 5_000 })
      .toBe(1234);

    // Escuchar en hijo1 lo que el padre le manda al restaurar.
    const hijo1 = frame(page, 'hijo1-opciones');
    test.skip(!hijo1, 'hijo1 no esta cargado');
    await hijo1.evaluate(() => {
      globalThis.__restauraciones = [];
      globalThis.addEventListener('message', (e) => {
        if (e.source === globalThis.parent && e.data?.tipo === 'AVENTURA.INICIADA') {
          globalThis.__restauraciones.push(e.data);
        }
      });
    });

    await page.evaluate(async () => {
      globalThis._vv_beforeHijoReload('hijo1-opciones');
      await globalThis._vv_afterHijoListo('hijo1-opciones');
    });

    await expect
      .poll(() => hijo1.evaluate(() => globalThis.__restauraciones.length), { timeout: 8_000 })
      .toBeGreaterThan(0);
  });

  test('RC-4. Cada hijo contesta al latido y su respuesta llega a la cuenta del bus', async ({ page }) => {
    test.setTimeout(90_000);
    const ids = HIJOS_CARGADOS;
    await page.waitForFunction(
      (lista) => lista.every((id) => globalThis.estadoPadre?.hijosInicializados?.has(id)),
      ids, { timeout: 30_000 },
    );

    // Cada hijo parte de «un latido sin contestar» y se le manda otro: lo único que puede dejar su cuenta a cero es que conteste
    // y que su respuesta llegue por el handler del padre hasta el bus. Se parte de 1 y se espera menos de dos vueltas del reloj
    // (que va encendido y cuenta por su cuenta): un hijo mudo no puede llegar a 3 y recargarse (y volver a 0) dentro de la espera.
    await page.evaluate((lista) => {
      for (const id of lista) {
        globalThis.mensajeria.getIframesRegistrados().get(id).latidosSinRespuesta = 1;
        globalThis.mensajeria.enviarMensaje({
          tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
          destino: id,
          datos: { timestamp: Date.now() },
        });
      }
    }, ids);

    await expect
      .poll(() => page.evaluate((lista) => Object.fromEntries(
        lista.map((id) => [id, globalThis.mensajeria.getIframesRegistrados().get(id).latidosSinRespuesta]),
      ), ids), {
        timeout: 3_000,
        message: 'un hijo que no contesta al latido, o cuya respuesta no llega, seguiría con latidos sin responder: el bus lo recargaría aunque esté sano',
      })
      .toEqual(Object.fromEntries(ids.map((id) => [id, 0])));
  });
});

/** ¿Se ve la pantalla de carga del padre? Se oculta con `display: none` medio segundo después de dar el sistema por listo. */
const pantallaDeCargaVisible = (page) => page.evaluate(() => {
  const el = document.getElementById('loading-overlay');
  return !!el && getComputedStyle(el).display !== 'none';
});

test.describe('RC-5 — Arranque con la selección que no llega a estar lista', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    // Bandera, puesta una sola vez desde el documento de arriba: mientras esté, los iframes se tragen el PADRE_DATOS que el padre les
    // manda. Sin él un hijo no completa el apretón de manos (no manda HIJO_LISTO), pero sigue vivo y contesta al latido.
    await page.addInitScript(() => {
      if (globalThis !== globalThis.top) return;
      try { localStorage.setItem('vvtest:sin-apreton', '1'); } catch (_) { /* sin almacenamiento no hay prueba */ }
    });
    await page.addInitScript(() => {
      if (globalThis === globalThis.top) return;
      globalThis.addEventListener('message', (e) => {
        if (e.source === globalThis.parent && e.data && e.data.tipo === 'SISTEMA.PADRE_DATOS' && localStorage.getItem('vvtest:sin-apreton') === '1') {
          e.stopImmediatePropagation();
        }
      }, true);
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
  });

  test('RC-5. La selección sin apretón no deja arrancar la aplicación ni avisa con un alert; el supervisor la recarga y arranca sola', async ({ page }) => {
    test.setTimeout(120_000);
    const dialogos = [];
    page.on('dialog', async (d) => { dialogos.push(d.message()); await d.dismiss(); });
    const errores = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && /seleccion: no completó el apretón de manos/.test(m.text())) errores.push(m.text());
    });

    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => globalThis.mensajeria?.getIframesRegistrados?.().has('seleccion'), null, { timeout: 30_000 });

    // Mientras la selección no esté lista, la aplicación no se da por arrancada y la pantalla de carga sigue a la vista.
    // VENTANA-OBSERVACION: lo que se mide es que NO pasa nada en esos 8 s.
    await page.waitForTimeout(8_000);
    expect(await page.evaluate(() => globalThis.sistemaInicializado === true), 'sin la selección lista el sistema no se da por inicializado').toBe(false);
    expect(await pantallaDeCargaVisible(page), 'y la pantalla de carga sigue a la vista').toBe(true);
    // La selección ya está a la vista mientras carga, sin esperar a estar lista (es lo primero que ve el usuario): lo que la tapa es la pantalla de carga.
    expect(await page.evaluate(() => { const s = document.getElementById('seleccion'); return { display: s.style.display, visibility: s.style.visibility }; }), 'la selección no espera a estar lista para estar a la vista').toEqual({ display: 'block', visibility: 'visible' });

    // Se le deja de tragar el apretón antes de que se agote su gracia (30 s con el intervalo de 5 s): la recarga que le haga el
    // supervisor ya podrá completarlo.
    await page.evaluate(() => localStorage.removeItem('vvtest:sin-apreton'));
    await expect.poll(() => page.evaluate(() => globalThis.sistemaInicializado === true), {
      timeout: 70_000,
      message: 'el supervisor recarga la selección y la aplicación arranca sola, sin que nadie la toque',
    }).toBe(true);
    await expect.poll(() => pantallaDeCargaVisible(page), { timeout: 5_000, message: 'y la pantalla de carga se va' }).toBe(false);

    expect(errores.length, 'el supervisor lo dijo por consola, con el nombre de la selección y la fase').toBeGreaterThanOrEqual(1);
    expect(dialogos, 'sin ningún alert al usuario').toEqual([]);
  });
});

test.describe('RC-6 — Sin red, un hijo recargado deja ver el overlay de sin conexión', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('RC-6. Con la recarga de un hijo y sin red el overlay sale aunque aún no haya modo, y se va solo al volver la red', async ({ page, context }) => {
    const overlayVisible = () => page.evaluate(() => document.getElementById('internet-overlay')?.classList.contains('show') === true);
    expect(await page.evaluate(() => globalThis.estadoPadre?.modo?.actual ?? null), 'precondición: todavía no hay modo decidido').toBeNull();

    // Control 1: con red, recargar un hijo no enseña nada
    await page.evaluate(() => globalThis._vv_beforeHijoReload('hijo2'));
    expect(await overlayVisible(), 'con red no se enseña el overlay').toBe(false);

    // Control 2: sin red pero sin que se recargue ningún hijo, el evento `offline` solo actúa en AVENTURA
    await context.setOffline(true);
    await expect.poll(() => page.evaluate(() => navigator.onLine), { timeout: 5_000 }).toBe(false);
    expect(await overlayVisible(), 'el evento offline por sí solo no lo enseña mientras no haya modo AVENTURA').toBe(false);

    // Sin red y con un hijo recargándose: sí
    await page.evaluate(() => globalThis._vv_beforeHijoReload('hijo2'));
    expect(await overlayVisible(), 'sin red, la recarga de un hijo enseña el overlay de sin conexión').toBe(true);

    // Vuelve la red: se oculta solo
    await context.setOffline(false);
    await expect.poll(overlayVisible, { timeout: 5_000, message: 'con el evento `online` el overlay se va' }).toBe(false);
  });
});

/**
 * ¿Qué se ve de cada iframe? Lo que dice su estilo en línea, que es lo que fija el cargador: `display: none` mientras no está
 * listo y vacío (decide la hoja de estilos) al estarlo.
 */
const estiloEnLinea = (page, ids) => page.evaluate((lista) => Object.fromEntries(lista.map((id) => {
  const el = document.getElementById(id);
  return [id, el ? { display: el.style.display, visibility: el.style.visibility } : null];
})), ids);

test.describe('RC-7 — Un hijo se muestra al estar listo, también si lo recupera el supervisor', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    // El mismo cebo que RC-5: mientras la bandera esté puesta, los iframes se tragan el PADRE_DATOS del padre y no completan el
    // apretón de manos, pero siguen vivos. Aquí la bandera la pone el test, no el arranque.
    await page.addInitScript(() => {
      if (globalThis === globalThis.top) return;
      globalThis.addEventListener('message', (e) => {
        if (e.source === globalThis.parent && e.data && e.data.tipo === 'SISTEMA.PADRE_DATOS' && localStorage.getItem('vvtest:sin-apreton') === '1') {
          e.stopImmediatePropagation();
        }
      }, true);
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 60_000 });
  });

  test('RC-7. Sin apretón de manos no se ve ninguno; los recarga el supervisor y se ven al estar listos, pasada la gracia de 30 s', async ({ page }) => {
    test.setTimeout(150_000);
    const CINCO = ['hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5'];
    const DE_LA_AVENTURA = CINCO.filter((id) => id !== 'hijo5');
    const errores = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && /no completó el apretón de manos/.test(m.text())) errores.push(m.text());
    });

    await page.evaluate(() => localStorage.setItem('vvtest:sin-apreton', '1'));
    // hijo5 ya a la vista, como lo deja la interfaz de la reanudación en desarrollo: el cargador ni lo oculta al cargarlo ni lo
    // muestra al darlo por listo.
    await page.evaluate(() => {
      const h5 = document.getElementById('hijo5');
      h5.style.display = 'block';
      h5.style.visibility = 'visible';
      globalThis.__carga = { terminada: false };
      Promise.all([globalThis.cargarRestoDeiframes(), globalThis.cargarHijoCasa()]).then(() => { globalThis.__carga.terminada = true; });
    });

    // Mientras no completan el apretón de manos la carga no termina y ninguno de los cuatro hijos de la aventura se ve.
    // VENTANA-OBSERVACION: lo que se mide es que NO pasa nada en esos 8 s.
    await page.waitForTimeout(8_000);
    expect(await page.evaluate(() => globalThis.__carga.terminada), 'sin apretón de manos la carga no termina').toBe(false);
    const durante = await estiloEnLinea(page, CINCO);
    for (const id of DE_LA_AVENTURA) expect(durante[id].display, `${id} no se ve mientras no está listo`).toBe('none');
    expect(durante.hijo5, 'hijo5 queda como estaba').toEqual({ display: 'block', visibility: 'visible' });

    // Se les deja de tragar el apretón antes de que se agote la gracia (30 s con el intervalo de 5 s): la recarga que les haga el
    // supervisor ya podrá completarlo. El cargador no se ha rendido a los 30 s: espera hasta entonces y más allá.
    await page.evaluate(() => localStorage.removeItem('vvtest:sin-apreton'));
    await expect.poll(() => page.evaluate(() => globalThis.__carga.terminada), {
      timeout: 100_000,
      intervals: [1_000],
      message: 'el supervisor recarga a los cinco y la carga termina sola',
    }).toBe(true);
    await page.waitForFunction((ids) => ids.every((id) => globalThis.estadoPadre?.hijosInicializados?.has(id)), CINCO, { timeout: 30_000 });

    // Cada uno se ve en cuanto está listo, aunque haya sido por la recarga del supervisor.
    await expect.poll(() => estiloEnLinea(page, DE_LA_AVENTURA), {
      timeout: 5_000,
      message: 'los hijos ya listos se ven; un cargador que se hubiera rendido antes los dejaría ocultos para siempre',
    }).toEqual(Object.fromEntries(DE_LA_AVENTURA.map((id) => [id, { display: '', visibility: 'visible' }])));
    expect((await estiloEnLinea(page, ['hijo5'])).hijo5, 'hijo5 sigue como estaba').toEqual({ display: 'block', visibility: 'visible' });
    expect(errores.length, 'el supervisor lo dijo por consola, con el hijo y la fase').toBeGreaterThanOrEqual(1);
  });
});

test.describe('RC-8 — La recuperación de un hijo es una sola', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  });

  test('RC-8. No hay un segundo registro del estado de los hijos ni una señal propia de fallo: la recuperación es la del supervisor', async ({ page }) => {
    const r = await page.evaluate(() => ({
      estadoHijos: globalThis.estadoPadre?.estadoHijos,
      tipo: globalThis.TIPOS_MENSAJE?.SISTEMA?.HIJO_FALLIDO,
      handler: globalThis.mensajeria?.tieneControlador?.('SISTEMA.HIJO_FALLIDO') === true,
    }));
    expect(r.estadoHijos, 'quién está listo lo dicen hijosInicializados y el registro de iframes del bus, no un segundo Map').toBeUndefined();
    expect(r.tipo, 'un hijo roto no avisa: lo detecta el supervisor').toBeUndefined();
    expect(r.handler, 'el padre no escucha ninguna señal de fallo de un hijo').toBe(false);
  });
});

test.describe('RC-9 — El asistente (hijo6) se carga con los demás y se ve al estar listo, como cualquier hijo', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    // El mismo cebo que RC-5 y RC-7: mientras la bandera esté puesta, los iframes se tragan el PADRE_DATOS y no completan el apretón de manos.
    await page.addInitScript(() => {
      if (globalThis === globalThis.top) return;
      globalThis.addEventListener('message', (e) => {
        if (e.source === globalThis.parent && e.data && e.data.tipo === 'SISTEMA.PADRE_DATOS' && localStorage.getItem('vvtest:sin-apreton') === '1') {
          e.stopImmediatePropagation();
        }
      }, true);
    });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => globalThis.sistemaInicializado === true && !!document.getElementById('btn-chat-soporte'), null, { timeout: 60_000 });
  });

  test('RC-9. hijo6 se carga con los demás hijos, sin tocar su botón, y no se ve mientras no está listo: el botón no hace nada hasta que lo está', async ({ page }) => {
    test.setTimeout(90_000);
    const estiloChat = () => page.evaluate(() => {
      const c = document.getElementById('hijo6-chat');
      return { display: c.style.display, visibility: c.style.visibility };
    });
    const tocarBoton = () => page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });

    // Los hijos se cargan juntos (P14, la reanudación y la ruta fallback llaman a esta función) y hijo6 va entre ellos, sin que nadie pulse su botón.
    await page.evaluate(() => localStorage.setItem('vvtest:sin-apreton', '1'));
    await page.evaluate(() => { void globalThis.cargarRestoDeiframes(); });
    await page.waitForFunction(() => globalThis.mensajeria.getIframesRegistrados().has('hijo6-chat'), null, { timeout: 15_000 });

    // Cargado, pero sin apretón de manos: pulsar el botón no lo enseña.
    await tocarBoton();
    // VENTANA-OBSERVACION: lo que se mide es que NO pasa nada tras el toque.
    await page.waitForTimeout(1_500);
    expect(await estiloChat(), 'el asistente cargado pero sin apretón de manos no se ve, ni pulsando su botón').toEqual({ display: 'none', visibility: 'hidden' });

    // Se le entrega el PADRE_DATOS que se había tragado: completa el apretón de manos y, ya listo, su botón lo enseña.
    await page.evaluate(() => {
      localStorage.removeItem('vvtest:sin-apreton');
      globalThis.mensajeria.enviarMensaje({
        tipo: globalThis.TIPOS_MENSAJE.SISTEMA.PADRE_DATOS,
        destino: 'hijo6-chat',
        datos: { modo: globalThis.estadoPadre?.modo?.actual || 'casa', ...globalThis.construirEstadoChat() },
      });
    });
    await page.waitForFunction(() => globalThis.estadoPadre?.hijosInicializados?.has('hijo6-chat'), null, { timeout: 15_000 });
    // Listo, pero el cargador no lo enseña: lo enseña su botón.
    // VENTANA-OBSERVACION: lo que se mide es que NO pasa nada tras quedar listo.
    await page.waitForTimeout(300);
    expect(await estiloChat(), 'el cargador no enseña al asistente aunque esté listo').toEqual({ display: 'none', visibility: 'hidden' });
    await page.evaluate(() => {
      globalThis.__estadosChat = [];
      const bus = globalThis.mensajeria;
      const original = bus.enviarMensaje;
      bus.enviarMensaje = function (m) {
        if (m && m.tipo === 'CHAT.ESTADO_PADRE') globalThis.__estadosChat.push(m.destino);
        return original.apply(this, arguments);
      };
    });
    await tocarBoton();
    await expect.poll(estiloChat, { timeout: 10_000, message: 'listo el asistente, su botón lo enseña' }).toEqual({ display: 'block', visibility: 'visible' });
    expect(await page.evaluate(() => globalThis.__estadosChat), 'al abrirlo se le entrega el estado de ahora: el que recibió al cargarse es el de P14').toEqual(['hijo6-chat']);

    // Si después lo recarga el supervisor (deja de estar listo), el botón no lo abre.
    await page.evaluate(() => { globalThis.cerrarChatSoporte(); globalThis.__stateManager.olvidarHijoListo('hijo6-chat'); });
    await tocarBoton();
    await page.waitForTimeout(500); // VENTANA-OBSERVACION: lo que se mide es que NO pasa nada tras ese toque
    expect(await estiloChat(), 'un asistente que se está recuperando no se abre').toEqual({ display: 'none', visibility: 'hidden' });
  });
});

test.describe('RC-10 — hijo4 recibe el reto cuando está listo, como cualquier hijo', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 60_000 });
  });

  test('RC-10. Pedir un reto con hijo4 recuperándose espera a que esté listo, sin mostrarlo antes, y entonces lo muestra', async ({ page }) => {
    test.setTimeout(90_000);
    const post = (tipo, datos) => page.evaluate(([t, d]) => document.getElementById('seleccion').contentWindow.parent.postMessage(
      { tipo: t, origen: 'seleccion', datos: d }, globalThis.location.origin), [tipo, datos]);
    await page.evaluate(() => { globalThis.aventuraSeleccionada = 'Aventura1'; globalThis.idiomaSeleccionado = 'es'; });
    await post('SELECCION.P14_MOSTRADA', { timestamp: Date.now() });
    await page.waitForFunction(() => globalThis._iframesPreCargadosP14 === true, null, { timeout: 60_000 });
    await post('SELECCION.AVENTURA_ACTIVADA', { aventura: 'Aventura1', idioma: 'es', terminosAceptados: true, timestamp: Date.now() });
    await page.waitForFunction(() => globalThis.estadoPadre?.modo?.actual === 'aventura', null, { timeout: 60_000 });

    // Una parada con reto, como la activa el progreso real.
    const parada = await page.evaluate(() => {
      const els = globalThis.DATOS_PADRE.Aventura1.es.elementosIDpadre;
      const conReto = els.find((p) => p.reto_id);
      return conReto ? { padreId: conReto.padreid } : null;
    });
    expect(parada, 'la aventura de prueba tiene una parada con reto').not.toBeNull();
    await page.evaluate((p) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: p.padreId, padreId: p.padreId } }), parada);
    await expect.poll(() => page.evaluate(() => globalThis.estadoPadre?.paradaActual), { timeout: 10_000 }).not.toBeNull();

    // hijo4 «se está recuperando»: para el state-manager (que es de quien se fía el bus) ya no está listo.
    await page.evaluate(() => {
      globalThis.__stateManager.olvidarHijoListo('hijo4');
      globalThis.__reto = { terminado: false, resultado: null };
      globalThis.mensajeria.despacharLocal({ tipo: 'RETO.SOLICITAR_RETO', origen: 'hijo3', datos: {} })
        .then((r) => { globalThis.__reto = { terminado: true, resultado: r }; });
    });
    const hijo4Visible = () => page.evaluate(() => document.getElementById('hijo4').classList.contains('visible'));
    // VENTANA-OBSERVACION: lo que se mide es que NO pasa nada en esos 2 s.
    await page.waitForTimeout(2_000);
    expect(await hijo4Visible(), 'mientras hijo4 no está listo no se muestra').toBe(false);
    expect(await page.evaluate(() => globalThis.__reto.terminado), 'y la petición del reto espera').toBe(false);

    // Vuelve a estar listo.
    await page.evaluate(() => globalThis.__stateManager.marcarHijoListo('hijo4'));
    await expect.poll(hijo4Visible, { timeout: 10_000, message: 'listo hijo4, se muestra' }).toBe(true);
    await expect.poll(() => page.evaluate(() => globalThis.__reto.terminado), { timeout: 10_000, message: 'y la petición del reto sigue adelante' }).toBe(true);
    expect((await page.evaluate(() => globalThis.__reto.resultado))?.exito, 'con el reto servido').toBe(true);
  });
});
