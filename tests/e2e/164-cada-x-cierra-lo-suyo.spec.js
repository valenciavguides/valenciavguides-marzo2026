/**
 * 164 — Cada ✗ de la PWA, pulsada de verdad con ratón y con dedo, cierra lo que le toca
 *
 * POR QUE EXISTE
 *
 * Una ✗ puede estar bien escrita, con su función de cierre y su spec en verde, y no cerrar nada cuando la pulsa una
 * persona: si algo se pinta encima, si un contenedor le captura el puntero o si el spec la cierra llamando a la función
 * por dentro (o con un `click()` desde el código, que se salta lo que haya encima). Aquí cada ✗ se pulsa con un gesto
 * real del motor (`locator.click()` con ratón, `locator.tap()` con dedo), que además comprueba que lo que hay en ese
 * punto es la ✗, y se mira el efecto que tiene que tener (guía §36.29, EJE 29).
 *
 * La capa se abre por la vía más corta que ya usa la aplicación: su abridor de `globalThis`, el mensaje que la pide, o el
 * reloj simulado para los recordatorios (como los specs 29, 34 y 35). Lo que se mide es la ✗, no la apertura.
 *
 * Las 38 ✗ que el usuario puede pulsar (las ocho del tutorial de video-intro son decorativas: las «pulsa» el guante):
 *
 *   EQ-1  Capas del padre: galería, ventana sin imágenes, vídeo sin dirección, vídeo (abierto justo después de cerrar la
 *         de «sin vídeo»), error, mapa completo (se da de baja en el bus) y sin internet — la capa deja de verse.
 *   EQ-2  Los seis carteles que tienen abridor (transición, inicio de tramo, llegada, bienvenida a un tramo y a una
 *         parada, recordatorio de rescate) — el cartel desaparece.
 *   EQ-3  Los cuatro recordatorios (audio, saltar el audio, reto) y el aviso de progreso no guardado — desaparecen.
 *   EQ-4  La selección: el mapa antiguo (→ P8), el «no» de P9 y el de P13 (→ P7) y el «no» de P3 (→ P2).
 *   EQ-5  Saltar la intro de video-intro: desaparece el botón y salen los del final.
 *   EQ-6  Con la aventura en marcha: el listado de paradas, el asistente, su modal, la ficha de un monumento del mapa
 *         completo (el mapa sigue abierto), las seis pantallas de distancia (cada una deja su descanso apuntado) y la de
 *         señal GPS, que solo sale en AVENTURA — la capa deja de verse.
 *
 * Con gesto real, en otros specs: el modal de tiempo agotado (130), las cuatro páginas de hijo1 (134) y el mapa antiguo
 * también en el 163.
 *
 * Antes de cada pulsación en el padre se dejan pasar 3 s desde la anterior: siete pulsaciones en menos de 3 s en
 * cualquier parte del padre abren el aviso del panel de registros (§24; estudio, K-149), que taparía la ✗ siguiente.
 *
 * ROJO ANTES QUE VERDE: con la ✗ común sin recibir el puntero (`pointer-events: none` añadido a `css/boton-cerrar.css`)
 * caen EQ-1, EQ-2, los cuatro EQ-3, EQ-4 y EQ-6, y pasa EQ-5 (saltar la intro no es la ✗ común). Con la ventana del vídeo
 * que se reutilizaba sin reproductor, EQ-1 cae con un TypeError (estudio, K-150); con el zoom que capturaba el puntero,
 * EQ-4 cae con ratón (spec 163). Con la ✗ de la cabecera del asistente con el z-index de la esquina (sin el `z-index:
 * auto` de `.btn-cerrar-en-linea`), EQ-6 cae: se pinta encima del modal, y en iphone12 se lleva el toque de la ✗ del modal.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, abrirHijoEnMarco } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
/** Donde está el usuario: el punto de inicio de la Aventura1 (Torres de Serranos). */
const INICIO = { latitude: 39.47876, longitude: -0.37626 };
const MADRID = { lat: 40.41678, lng: -3.70379 };
const IMAGEN = 'imagenes/imagenes-aplicación/imagen-no-internet.png';
const VIDEO = 'publico/videos/video_intro_ejemplo.mp4';
const X = '.btn-cerrar-overlay';

/** ¿Se ve? Caja con tamaño y ni él ni ningún antepasado oculto. */
const seVe = (frame, sel) => frame.evaluate((s) => {
  const el = document.querySelector(s);
  if (!el) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return false;
  for (let e = el; e; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
  }
  return true;
}, sel);

const seleccion = (page) => page.frames().find((f) => f.name() === 'seleccion');

async function prepararPagina(page, context, posicion = INICIO) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(posicion);
  // Cada pulsación en el documento del padre, para no caer en el gesto de siete toques en menos de 3 s (guía §24),
  // que cuenta las del usuario en cualquier parte, también las de las ✗.
  await page.addInitScript(() => {
    if (globalThis.top === globalThis) document.addEventListener('click', () => { globalThis.__vvUltimoClic = performance.now(); }, true);
  });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
}

/** El padre arrancado y a la vista: la pantalla de carga se desvanece medio segundo después de quitar `body.loading`. */
async function arrancarPadre(page) {
  await gotoAndWaitForFase1(page);
  await page.waitForFunction(() => globalThis.sistemaInicializado === true, null, { timeout: 45_000 });
  await page.waitForFunction(() => !document.body.classList.contains('loading'), null, { timeout: 30_000 });
  await page.waitForFunction(() => getComputedStyle(document.getElementById('loading-overlay')).display === 'none', null, { timeout: 30_000 });
}

/** El recorrido real desde elegir hasta la aventura en marcha (el mismo que los specs 128 y 131). */
async function arrancarAventura(page) {
  await page.waitForFunction(
    () => document.getElementById('seleccion')?.contentWindow?.mensajeria?.tieneControlador?.('SISTEMA.PADRE_CONFIRMA_HIJO_LISTO') === true,
    null, { timeout: 30_000 },
  );
  const f = seleccion(page);
  await f.evaluate(() => globalThis.seleccionarIdioma('es'));
  await f.evaluate(() => mostrar(7));
  await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
  await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
  await f.evaluate(() => { if (getComputedStyle(document.getElementById('mapa-vintage-overlay')).display !== 'none') cerrarMapaVintage(); });
  await f.evaluate(() => mostrar(15));
  await page.waitForFunction(() => globalThis._iframesPreCargadosP15 === true, null, { timeout: 90_000 });
  await f.evaluate(() => mostrar(17));
  await f.evaluate(() => document.querySelector('#pantalla17 .btn-mundo-verde').click());
  await page.waitForFunction(
    () => globalThis.estadoPadre?.modo?.actual === 'aventura' && globalThis.aventuraSeleccionada === 'Aventura1'
      && getComputedStyle(document.getElementById('seleccion')).display === 'none'
      && !document.body.classList.contains('loading') && !!globalThis.estadoPadre?.paradaActual
      && getComputedStyle(document.getElementById('loading-overlay')).display === 'none',
    null, { timeout: 60_000 },
  );
  // Las dos lecturas siguientes del GPS confirman la llegada y sacan el cartel de llegada al inicio (spec 131): se cierra
  // antes de empezar.
  for (let i = 0; i < 2; i++) {
    await page.evaluate((c) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { ...c, accuracy: 8 } }), INICIO);
  }
  const cartel = page.locator('#cartel-llegada-parada');
  await expect(cartel).toHaveCount(1);
  await cartel.locator(X).click();
  await expect(cartel).toHaveCount(0);
}

for (const gesto of ['ratón', 'dedo']) {
  test.describe(`EQ — cada ✗ cierra lo suyo, con ${gesto}`, () => {
    test.use({ hasTouch: gesto === 'dedo' });
    /**
     * La pulsación de verdad: ratón o dedo, según el bloque. Antes deja pasar los 3 s del gesto de siete toques desde la
     * última pulsación en el padre: aquí el tiempo es la propia condición de la aplicación, no una espera a ciegas.
     */
    const pulsar = async (locator) => {
      const page = locator.page();
      await page.waitForFunction(() => !globalThis.__vvUltimoClic || performance.now() - globalThis.__vvUltimoClic > 3100, null, { timeout: 10_000 });
      await (gesto === 'dedo' ? locator.tap() : locator.click());
    };

    test.describe('sin aventura', () => {
      test.beforeEach(async ({ page, context }) => {
        await prepararPagina(page, context);
        await arrancarPadre(page);
        await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
      });

      test(`EQ-1 (${gesto}). Las capas del padre`, async ({ page }) => {
        test.setTimeout(120_000);
        const casos = [
          ['galería', '#imagen-overlay', (u) => globalThis.mostrarImagenOverlay(u.IMAGEN, 'galería')],
          ['sin imágenes', '#imagen-overlay', () => globalThis.mostrarImagenOverlay('', '', 'sin imagen')],
          ['vídeo sin dirección', '#video-overlay', () => globalThis.mostrarVideoOverlay('', '', 'sin vídeo')],
          ['vídeo', '#video-overlay', (u) => globalThis.mostrarVideoOverlay(u.VIDEO)],
          ['error', '#error-overlay', () => globalThis.mostrarErrorOverlay('error de prueba')],
          ['mapa completo', '#iframe-overlay', () => globalThis.mostrarIframeOverlay('mapa-completo.html')],
          ['sin internet', '#internet-overlay', () => globalThis.showInternetOverlay({ forzar: true })],
        ];
        for (const [nombre, capa, abrir] of casos) {
          await page.evaluate(abrir, { IMAGEN, VIDEO });
          await expect.poll(() => seVe(page.mainFrame(), capa), { timeout: 10_000, message: `${nombre}: la capa no se abre` }).toBe(true);
          await pulsar(page.locator(`${capa} ${X}`).first());
          await expect.poll(() => seVe(page.mainFrame(), capa), { timeout: 5_000, message: `${nombre}: la ✗ no la cierra` }).toBe(false);
          if (nombre === 'mapa completo') {
            expect(await page.evaluate(() => globalThis.mensajeria.getIframesRegistrados().has('mapa-completo')), 'el mapa completo se da de baja en el bus').toBe(false);
          }
        }
      });

      test(`EQ-2 (${gesto}). Los seis carteles con abridor`, async ({ page }) => {
        test.setTimeout(120_000);
        const casos = [
          ['cartel-transicion', () => globalThis.mostrarCartelTransicion('parada', 'Torres de Serranos', 'parada', 'Plaza de la Crida')],
          ['cartel-inicio-tramo', () => globalThis.mostrarCartelInicioTramo('parada', 'Torres de Serranos', 'Hacia la Plaza de la Virgen')],
          ['cartel-llegada-parada', () => globalThis.mostrarCartelLlegadaParada('Plaza de la Virgen')],
          ['cartel-bienvenida-tramo', () => globalThis.mostrarCartelBienvenidaTramo()],
          ['cartel-bienvenida-parada', () => globalThis.mostrarCartelBienvenidaParada('Plaza de la Virgen')],
          ['cartel-recordatorio-rescate', () => globalThis._mostrarCartelRecordatorioRescate()],
        ];
        for (const [id, abrir] of casos) {
          await page.evaluate(abrir);
          await expect(page.locator(`#${id}`), `${id}: el cartel no sale`).toHaveCount(1, { timeout: 10_000 });
          await pulsar(page.locator(`#${id} ${X}`));
          await expect(page.locator(`#${id}`), `${id}: la ✗ no lo cierra`).toHaveCount(0, { timeout: 5_000 });
        }
      });

      test(`EQ-4 (${gesto}). La selección: el mapa antiguo y los «no» de P9, P13 y P3`, async ({ page }) => {
        test.setTimeout(120_000);
        const f = seleccion(page);
        const marco = page.frameLocator('#seleccion');
        const pantalla = () => f.evaluate(() => document.querySelector('.pantalla.visible')?.id || null);
        await f.evaluate(() => globalThis.seleccionarIdioma('es'));
        await f.evaluate(() => mostrar(7));
        await f.waitForFunction(() => document.querySelectorAll('#aventuras-dinamicas button:not([disabled])').length >= 2, null, { timeout: 20_000 });
        await f.evaluate(() => globalThis.seleccionarAventura('Aventura1'));
        await expect.poll(() => seVe(f, '#mapa-vintage-overlay'), { timeout: 15_000 }).toBe(true);
        await pulsar(marco.locator('#mapa-vintage-wrapper > button[title="Cerrar mapa"]'));
        await expect.poll(() => seVe(f, '#mapa-vintage-overlay'), { timeout: 5_000, message: 'la ✗ del mapa antiguo no lo cierra' }).toBe(false);
        await expect.poll(pantalla, { timeout: 5_000 }).toBe('pantalla8');
        await f.evaluate(() => mostrar(9));
        await expect.poll(pantalla, { timeout: 5_000 }).toBe('pantalla9');
        await pulsar(marco.locator('#pantalla9 .btn-mundo-rojo'));
        await expect.poll(pantalla, { timeout: 5_000, message: 'el «no» de P9 no vuelve a P7' }).toBe('pantalla7');
        // P13 solo se alcanza con el pago hecho: la ➣ de P12 (spec 127).
        await f.evaluate(() => mostrar(12));
        await expect.poll(pantalla, { timeout: 5_000 }).toBe('pantalla12');
        await f.evaluate(() => document.querySelector('#pantalla12 .btn-mundo-verde').click());
        await expect.poll(pantalla, { timeout: 5_000 }).toBe('pantalla13');
        await pulsar(marco.locator('#pantalla13 .btn-mundo-rojo'));
        await expect.poll(pantalla, { timeout: 5_000, message: 'el «no» de P13 no vuelve a P7' }).toBe('pantalla7');
        await f.evaluate(() => mostrar(3));
        await expect.poll(pantalla, { timeout: 5_000 }).toBe('pantalla3');
        await pulsar(marco.locator('#pantalla3 .btn-mundo-rojo'));
        await expect.poll(pantalla, { timeout: 5_000, message: 'el «no» de P3 no vuelve a P2' }).toBe('pantalla2');
      });
    });

    test.describe('los recordatorios, con el reloj simulado', () => {
      test.beforeEach(async ({ page, context }) => {
        await prepararPagina(page, context);
        await page.clock.install();
        await gotoAndWaitForFase1(page);
        await page.evaluate(() => { globalThis.idiomaSeleccionado = 'es'; });
        await page.waitForFunction(
          () => ['_iniciarRecordatorioAudio', '_iniciarRecordatorioSaltarAudio', '_iniciarRecordatorioReto', 'persistProgressState']
            .every((n) => typeof globalThis[n] === 'function'),
          null, { timeout: 15_000 },
        );
        // La selección se aparta: sin aventura arrancada sigue a la vista, y los carteles van encima del padre.
        await page.evaluate(() => { document.getElementById('seleccion').style.display = 'none'; });
      });

      const proximidad = (page) => page.evaluate(() => {
        globalThis.estadoPadre.gps = globalThis.estadoPadre.gps || {};
        globalThis.estadoPadre.gps.proximidadReal = true;
        // Los recordatorios de audio y de saltar no salen con su botón apagado u oculto (K-185): sin un elemento con audio,
        // a mano.
        document.getElementById('audio-main-toggle-btn').disabled = false;
        document.getElementById('audio-control-overlay').classList.add('mostrar-saltar-audio');
      });

      test(`EQ-3a (${gesto}). Recordatorio de pulsar el audio`, async ({ page }) => {
        await proximidad(page);
        await page.evaluate(() => globalThis._iniciarRecordatorioAudio());
        await page.clock.runFor(10_000);
        await expect(page.locator('#cartel-recordatorio-audio')).toHaveCount(1, { timeout: 5_000 });
        await pulsar(page.locator(`#cartel-recordatorio-audio ${X}`));
        await expect(page.locator('#cartel-recordatorio-audio')).toHaveCount(0, { timeout: 5_000 });
      });

      test(`EQ-3b (${gesto}). Recordatorio de saltar el audio`, async ({ page }) => {
        await proximidad(page);
        await page.evaluate(() => globalThis._iniciarRecordatorioSaltarAudio());
        await page.clock.runFor(10_000);
        await expect(page.locator('#cartel-recordatorio-saltar-audio')).toHaveCount(1, { timeout: 5_000 });
        await pulsar(page.locator(`#cartel-recordatorio-saltar-audio ${X}`));
        await expect(page.locator('#cartel-recordatorio-saltar-audio')).toHaveCount(0, { timeout: 5_000 });
      });

      test(`EQ-3c (${gesto}). Recordatorio del reto`, async ({ page }) => {
        // El botón de retos encendido (spec 34): AVENTURA, parada con reto, audio terminado, sin reto abierto, en rango.
        await page.evaluate(() => {
          const e = globalThis.estadoPadre;
          e.modo = e.modo || {};
          e.modo.actual = globalThis.MODOS.AVENTURA;
          e.usuarioFueraRango = { activo: false };
          e.elementoActual = { padreid: 'padre-P1', tipo: 'parada', parada_id: 'Av1-P-1', audio_id: 'audio-Av1-P-1-es', reto_id: 'R4-Av1-es' };
          e.pendingCompleciones = { 'padre-P1': { tipo: 'parada', llegada: true, audio: true, reto: false, retosTotal: 1, retosCompletadosCount: 0, timestamp: Date.now() } };
        });
        await proximidad(page);
        await page.evaluate(() => globalThis._iniciarRecordatorioReto());
        await page.clock.runFor(10_000);
        await expect(page.locator('#cartel-recordatorio-reto')).toHaveCount(1, { timeout: 5_000 });
        await pulsar(page.locator(`#cartel-recordatorio-reto ${X}`));
        await expect(page.locator('#cartel-recordatorio-reto')).toHaveCount(0, { timeout: 5_000 });
      });

      test(`EQ-3d (${gesto}). Aviso de progreso no guardado`, async ({ page }) => {
        // Lo que lo dispara: el almacenamiento no deja guardar el progreso en AVENTURA (spec 35, AP).
        await page.evaluate(() => {
          globalThis.estadoPadre.modo = { actual: 'aventura' };
          globalThis.estadoPadre._avisoPersistenciaMostrado = false;
          const original = Storage.prototype.setItem;
          Storage.prototype.setItem = function (k, v) {
            if (k === 'vv_progreso') throw new Error('sin espacio (prueba)');
            return original.call(this, k, v);
          };
          globalThis.persistProgressState();
        });
        await expect(page.locator('#cartel-aviso-progreso')).toHaveCount(1, { timeout: 5_000 });
        await pulsar(page.locator(`#cartel-aviso-progreso ${X}`));
        await expect(page.locator('#cartel-aviso-progreso')).toHaveCount(0, { timeout: 5_000 });
      });
    });

    test(`EQ-5 (${gesto}). Saltar la intro`, async ({ page, context }) => {
      test.setTimeout(60_000);
      await prepararPagina(page, context);
      // La intro pinta su mapa con Leaflet, que el arnés sustituye por un fichero vacío: sin él, `run()` se corta al
      // empezar y el botón no llega a activarse. Se deja pasar el de verdad (la ruta registrada después es la que vale).
      await page.route('**/unpkg.com/leaflet@1.9.4/**', (route) => route.continue());
      // Con `replay=1` (como la abre el asistente) el botón está activo desde el principio.
      const vi = await abrirHijoEnMarco(page, 'video-intro.html?lang=es&replay=1', { esperarPreparado: false });
      await vi.waitForFunction(() => document.getElementById('btn-skip').classList.contains('on'), null, { timeout: 15_000 });
      await pulsar(page.frameLocator('#marco-hijo').locator('#btn-skip'));
      await expect.poll(() => vi.evaluate(() => ({
        saltar: document.getElementById('btn-skip').classList.contains('on'),
        final: document.getElementById('end-btns').classList.contains('on'),
      })), { timeout: 5_000 }).toEqual({ saltar: false, final: true });
    });

    test(`EQ-6 (${gesto}). Con la aventura en marcha`, async ({ page, context }) => {
      test.setTimeout(300_000);
      // El mapa completo pinta con Leaflet, que el arnés sustituye por un fichero vacío: aquí se deja pasar el de verdad
      // (spec 54, MC-3). La ruta registrada después es la que se aplica.
      await prepararPagina(page, context);
      await page.route('**/cdnjs.cloudflare.com/ajax/libs/leaflet/**', (route) => route.continue());
      await arrancarPadre(page);
      await arrancarAventura(page);
      // Los recordatorios salen solos por tiempo real (§4.7: diez segundos en la parada y cada veinte después) y se pintan
      // encima de lo que haya; en un navegador lento, el de «pulse play» tapaba el marcador del mapa completo y se llevaba
      // su clic. Se apagan con lo que llama la propia aplicación al terminar el audio o el reto (specs 29 y 34); sus ✗ las
      // mide EQ-3.
      await page.evaluate(() => {
        globalThis._detenerRecordatorioAudio();
        globalThis._detenerRecordatorioSaltarAudio();
        globalThis._detenerRecordatorioReto();
      });

      // El listado de paradas.
      await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: {} }));
      await expect.poll(() => seVe(page.mainFrame(), '#ventana-listado-paradas-padre'), { timeout: 10_000 }).toBe(true);
      await pulsar(page.locator(`#ventana-listado-paradas-padre ${X}`));
      await expect.poll(() => seVe(page.mainFrame(), '#ventana-listado-paradas-padre'), { timeout: 5_000, message: 'la ✗ del listado no lo cierra' }).toBe(false);

      // El asistente y su modal.
      await pulsar(page.locator('#btn-chat-soporte'));
      await expect.poll(() => seVe(page.mainFrame(), '#hijo6-chat'), { timeout: 10_000 }).toBe(true);
      const chat = page.frames().find((fr) => fr.name() === 'hijo6-chat');
      const chatLoc = page.frameLocator('#hijo6-chat');
      await chat.waitForFunction(() => !!document.querySelector('.respuesta-enlace-flecha'), null, { timeout: 15_000 });
      await chat.evaluate(() => document.querySelector('.respuesta-enlace-flecha').click());
      const modalAbierto = () => chat.evaluate(() => document.getElementById('chat-modal-overlay').classList.contains('visible'));
      await expect.poll(modalAbierto, { timeout: 10_000 }).toBe(true);
      // Con el modal abierto, la ✗ de la cabecera queda debajo de su fondo: ni se ve encima ni se lleva el toque.
      expect(await chat.evaluate(() => {
        const x = document.getElementById('btn-cerrar');
        const r = x.getBoundingClientRect();
        return !x.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
      }), 'la ✗ de la cabecera del asistente se pinta encima del modal').toBe(true);
      await pulsar(chatLoc.locator('#chat-modal-cerrar'));
      await expect.poll(modalAbierto, { timeout: 5_000, message: 'la ✗ del modal del asistente no lo cierra' }).toBe(false);
      expect(await seVe(page.mainFrame(), '#hijo6-chat'), 'el asistente sigue abierto').toBe(true);
      await pulsar(chatLoc.locator('#btn-cerrar'));
      await expect.poll(() => seVe(page.mainFrame(), '#hijo6-chat'), { timeout: 5_000, message: 'la ✗ del asistente no lo cierra' }).toBe(false);

      // El mapa completo y la ficha de un monumento.
      await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.NAVEGACION.MOSTRAR_MAPA_COMPLETO, datos: {} }));
      await expect.poll(() => seVe(page.mainFrame(), '#iframe-overlay'), { timeout: 10_000 }).toBe(true);
      await expect.poll(() => page.frames().some((fr) => fr.url().includes('mapa-completo.html')), { timeout: 10_000 }).toBe(true);
      const mapa = page.frames().find((fr) => fr.url().includes('mapa-completo.html'));
      await mapa.waitForFunction(() => document.querySelectorAll('.monumento-marker').length > 0, null, { timeout: 30_000 });
      await mapa.locator('.monumento-marker').first().click();
      const fichaAbierta = () => mapa.evaluate(() => document.getElementById('monumento-overlay').classList.contains('visible'));
      await expect.poll(fichaAbierta, { timeout: 5_000 }).toBe(true);
      await pulsar(page.frameLocator('#iframe-overlay iframe').locator('#monumento-cerrar'));
      await expect.poll(fichaAbierta, { timeout: 5_000, message: 'la ✗ de la ficha no la cierra' }).toBe(false);
      expect(await seVe(page.mainFrame(), '#iframe-overlay'), 'el mapa completo sigue abierto').toBe(true);
      await pulsar(page.locator(`#iframe-overlay ${X}`));
      await expect.poll(() => seVe(page.mainFrame(), '#iframe-overlay'), { timeout: 5_000, message: 'la ✗ del mapa completo no lo cierra' }).toBe(false);

      // Las cinco pantallas de distancia con abridor; cada ✗ deja su descanso apuntado.
      const descansoDe = (id) => page.evaluate((i) => (globalThis.__VV_GPS_OVERLAY_SNOOZE?.[i] || 0) > Date.now(), id);
      for (const [id, abrir] of [
        ['foto-fuera-rango-overlay', () => globalThis.showFotoFueraRangoOverlay(30, 15)],
        ['foto-desviado-overlay', () => globalThis.showFotoDesviadoOverlay(100)],
        ['foto-lejos-overlay', () => globalThis.showFotoLejosOverlay(500)],
        ['foto-perdido-overlay', () => globalThis.showFotoPerdidoOverlay(3000)],
        ['gps-precision-overlay', () => globalThis.showGpsPrecisionOverlay()],
      ]) {
        await page.evaluate(abrir);
        await expect.poll(() => seVe(page.mainFrame(), `#${id}`), { timeout: 5_000, message: `${id}: no sale` }).toBe(true);
        await pulsar(page.locator(`#${id} ${X}`));
        await expect.poll(() => seVe(page.mainFrame(), `#${id}`), { timeout: 5_000, message: `${id}: la ✗ no la cierra` }).toBe(false);
        expect(await descansoDe(id), `${id}: la ✗ deja su descanso`).toBe(true);
      }
      // La pantalla de señal GPS: solo sale en AVENTURA (o con el código validado en P14). Una lectura buena del GPS la
      // quita sola (§30.2). Con la posición emulada, que no cambia, el vigilante no da ninguna lectura hasta que vence su
      // plazo, a los ~34 s de empezar la aventura: ese «tiempo agotado» la enseña y la lectura de su reintento la quita
      // medio segundo después (medido en chromium y en iphone12; después, nada en 56 s). Se abre cuando el vigilante ya ha
      // dado su primera lectura, con la ventana del gesto ya pasada, se pulsa enseguida y se comprueba que la pulsación
      // llega a la ✗: el cierre es suyo, no de una lectura.
      await page.waitForFunction(
        () => (globalThis._gpsHistorial?.length || 0) > 0
          && (!globalThis.__vvUltimoClic || performance.now() - globalThis.__vvUltimoClic > 3100),
        null, { timeout: 60_000 },
      );
      await page.evaluate((x) => {
        globalThis.showGpsSignalOverlay(1);
        globalThis.__vvXSenalPulsada = false;
        document.querySelector(`#gps-signal-overlay ${x}`).addEventListener('click', () => { globalThis.__vvXSenalPulsada = true; }, { once: true });
      }, X);
      await expect.poll(() => seVe(page.mainFrame(), '#gps-signal-overlay'), { timeout: 5_000, message: 'la pantalla de señal GPS no sale' }).toBe(true);
      await pulsar(page.locator(`#gps-signal-overlay ${X}`));
      await expect.poll(() => seVe(page.mainFrame(), '#gps-signal-overlay'), { timeout: 5_000, message: 'la ✗ de la señal GPS no la cierra' }).toBe(false);
      expect(await page.evaluate(() => globalThis.__vvXSenalPulsada), 'la pulsación llega a la ✗ de la señal GPS').toBe(true);
      // El cartel del bloqueo de 5 km: tres lecturas seguidas en Madrid (bloquea a la tercera), sin la espera de 3 minutos
      // entre comprobaciones (spec 56).
      await page.evaluate((q) => {
        for (let i = 0; i < 3; i++) { globalThis.__VV_5KM_LAST_CHECK = null; globalThis._vv_check5km(q.lat, q.lng, 20); }
      }, MADRID);
      await expect.poll(() => seVe(page.mainFrame(), '#gps-out-of-range-overlay'), { timeout: 5_000, message: 'el cartel de los 5 km no sale' }).toBe(true);
      await pulsar(page.locator(`#gps-out-of-range-overlay ${X}`));
      await expect.poll(() => seVe(page.mainFrame(), '#gps-out-of-range-overlay'), { timeout: 5_000, message: 'la ✗ del cartel de los 5 km no lo cierra' }).toBe(false);
      expect(await descansoDe('gps-out-of-range-overlay'), 'la ✗ del cartel de los 5 km deja su descanso').toBe(true);
    });
  });
}
