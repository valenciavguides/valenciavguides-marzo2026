/**
 * 47-reescalado-marcador-usuario-y-chat.spec.js
 *
 * Dos contratos independientes que comparten arranque, agrupados para no repetir el boot
 * completo de la PWA en dos ficheros:
 *
 * MU — El marcador de posición propia (🛸 en CASA, flecha azul en AVENTURA) se reescala
 * con el zoom. Su tamaño se calcula al construir el HTML del marcador, y ese HTML solo se
 * construye al llegar una posición GPS nueva: sin un reescalado atado al zoom, entre dos
 * lecturas de GPS el usuario puede hacer zoom varias veces y el marcador se queda clavado
 * al tamaño anterior, mientras el círculo naranja de 15 m (geográfico, pegado al terreno)
 * sí crece — de ahí que la flecha parezca encoger dentro de su propio círculo.
 *
 * CH — El iframe del chat (hijo6-chat) queda registrado en la mensajería al abrirlo.
 * `_enviarDesdePadre` (js/mensajeria.js) resuelve el destino contra `iframesRegistrados`;
 * un iframe ausente de ese Map no es alcanzable desde el padre y todo mensaje dirigido a
 * él se descarta con un `logger.warn`, sin error. Es lo que dejaba sin entregar el
 * SISTEMA.PADRE_DATOS que lleva el idioma, con el FAQ construyéndose siempre en español
 * aunque `idiomaSeleccionado` fuera otro.
 *
 * Los dos casos se ejercitan por el camino real (posición GPS entrante, click en el botón
 * de chat) y no llamando a las funciones del arreglo: el fallo original nunca fue que esas
 * funciones no hicieran su trabajo, sino que nadie las invocaba en el momento que tocaba.
 * Un test que las llamara a mano habría pasado en verde con el bug delante.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

/**
 * El stub de MapLibre devuelve un zoom fijo, no publica las instancias de mapa que crea, y
 * su `addTo()` es un no-op: el elemento del marcador existe pero nunca llega al documento,
 * así que no se puede encontrar con un querySelector. Este init script va guardando mapas y
 * marcadores para que el test pueda (a) cambiar el zoom y emitir el evento sobre la MISMA
 * instancia que tiene guardada funciones-mapa.js y (b) leer el elemento real del marcador —
 * sin exponer nada nuevo en el código de producción solo para poder testear. Se inyecta
 * después del stub, que asigna globalThis.maplibregl de forma síncrona.
 */
async function exponerInternosDelStub(page) {
  await page.addInitScript(() => {
    globalThis.__vv_mapasStub = [];
    globalThis.__vv_marcadoresStub = [];
    const mapOriginal = globalThis.maplibregl.Map;
    globalThis.maplibregl.Map = function (opts) {
      const m = mapOriginal(opts);
      globalThis.__vv_mapasStub.push(m);
      return m;
    };
    const markerOriginal = globalThis.maplibregl.Marker;
    globalThis.maplibregl.Marker = function (opts) {
      const mk = markerOriginal(opts);
      globalThis.__vv_marcadoresStub.push(mk);
      return mk;
    };
  });
}

/**
 * Ancho en px del contenedor del marcador de posición propia. Se busca entre los marcadores
 * creados de verdad (el último con la clase del usuario), no en el documento: con el stub,
 * el elemento nunca se inserta en el DOM.
 */
async function anchoMarcadorUsuario(page) {
  return page.evaluate(() => {
    const marcadores = globalThis.__vv_marcadoresStub || [];
    for (let i = marcadores.length - 1; i >= 0; i--) {
      const el = marcadores[i].getElement?.();
      if (el && /marcador-usuario-gps-(flecha|ovni)/.test(el.className || '')) {
        const interior = el.firstElementChild;
        return interior ? parseFloat(interior.style.width) : null;
      }
    }
    return null;
  });
}


// Av1-P-1 real (js/coordenadas-aventuras.js) — mismo anclaje que usa 21-llegada-ruido-gps.
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };

/**
 * Deja una aventura activa con un elemento en curso, que es lo que
 * procesarPosicionGPSParaAventura() necesita para llegar a actualizar el marcador del
 * usuario (sin elemento activo sale antes). Mismo procedimiento que prepararEscenario()
 * en 21-llegada-ruido-gps.spec.js.
 */
async function prepararAventura(page) {
  await page.waitForFunction(
    () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
      && typeof globalThis.__cargarDatosAventuraDiferidos === 'function',
    null, { timeout: 25000 }
  ).catch(() => {});
  return page.evaluate(async (parada) => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
    if (!globalThis.AVENTURA_PARADAS?.length && globalThis.__vv_DATOS_AVENTURAS?.Aventura1) {
      const coords = globalThis.__vv_DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html']?.coordenadas;
      if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
    }
    const fm = globalThis.funcionesMapa;
    fm.limpiarPorEstado({ modo: 'aventura', resetCompleto: true });
    fm.limpiarPorEstado({ modo: 'aventura', paradaActual: parada.id });
    const elementos = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
    const el = elementos?.find(e => e.parada_id === parada.id);
    if (el && globalThis.estado) {
      if (!globalThis.estado.modo) globalThis.estado.modo = {};
      globalThis.estado.modo.actual = 'aventura';
      globalThis.estado.elementoActual = el;
      globalThis.estado.pendingCompleciones = {};
    }
    return !!globalThis.AVENTURA_PARADAS?.find(p => p.id === parada.id);
  }, PARADA);
}

/**
 * Una lectura GPS lo bastante lejos (~200 m) como para que no se confirme ninguna llegada:
 * interesa que el marcador se dibuje, no que la aventura progrese por debajo del test.
 */
async function unaLecturaGPSLejos(page) {
  await page.evaluate(async (parada) => {
    await globalThis.funcionesMapa.procesarPosicionGPSParaAventura({
      coords: { latitude: parada.lat + 0.0018, longitude: parada.lng, accuracy: 8 },
    });
  }, PARADA);
}

async function arrancar(page, context, { conInternosExpuestos = false } = {}) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
  await page.addInitScript({ path: MAPLIBRE_STUB });
  if (conInternosExpuestos) await exponerInternosDelStub(page);
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
}

test.describe('MU — El marcador de posición propia sigue al zoom', () => {
  test('MU-1. Con el zoom cambiado y sin ninguna posición GPS nueva, la flecha se reescala', async ({ page, context }) => {
    await arrancar(page, context, { conInternosExpuestos: true });
    await page.waitForFunction(
      () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
        && typeof globalThis.funcionesMapa?.sincronizarModoMapa === 'function'
        && (globalThis.__vv_mapasStub || []).length > 0,
      null, { timeout: 25000 }
    );

    const listo = await prepararAventura(page);
    test.skip(!listo, 'los datos de Aventura1 no se cargaron en este entorno');
    await page.evaluate(() => globalThis.funcionesMapa.sincronizarModoMapa('aventura'));
    // Única lectura de GPS de todo el test: a partir de aquí, el marcador solo puede
    // cambiar de tamaño si algo lo reescala al cambiar el zoom.
    await unaLecturaGPSLejos(page);

    const anchoZoom15 = await anchoMarcadorUsuario(page);
    expect(anchoZoom15, 'la flecha debe existir tras la primera posición GPS en AVENTURA').toBeGreaterThan(0);

    // Subir el zoom SIN enviar ninguna posición nueva. getIconoEscalado() lee
    // mapa.getZoom() en vivo, así que basta con sustituirlo antes de emitir el evento.
    await page.evaluate(() => {
      const m = globalThis.__vv_mapasStub[globalThis.__vv_mapasStub.length - 1];
      m.getZoom = () => 18;
      m.fire('zoomend');
    });

    const anchoZoom18 = await anchoMarcadorUsuario(page);
    // La flecha es un cartel indicador, no terreno (familia PANTALLA, ver ESCALA_BASE en
    // js/funciones-mapa.js): al ACERCAR el zoom debe ENCOGER, para no tapar el detalle de
    // calle justo cuando el usuario necesita ver el portal exacto. Lo que se comprueba aquí
    // es que reacciona al zoom sin ninguna posición GPS nueva — antes se quedaba congelada
    // hasta la siguiente lectura, unos 7 s después.
    expect(
      anchoZoom18,
      'la flecha debe reaccionar al zoom sin esperar una posición GPS nueva'
    ).not.toBe(anchoZoom15);
    expect(
      anchoZoom18,
      'al acercar el zoom la flecha debe encoger: es un indicador de pantalla, no un objeto del terreno'
    ).toBeLessThan(anchoZoom15);
  });

  test('MU-2. El reescalado no borra el marcador ni pierde la flecha', async ({ page, context }) => {
    await arrancar(page, context, { conInternosExpuestos: true });
    await page.waitForFunction(
      () => typeof globalThis.funcionesMapa?.procesarPosicionGPSParaAventura === 'function'
        && (globalThis.__vv_mapasStub || []).length > 0,
      null, { timeout: 25000 }
    );
    const listo2 = await prepararAventura(page);
    test.skip(!listo2, 'los datos de Aventura1 no se cargaron en este entorno');
    await page.evaluate(() => globalThis.funcionesMapa.sincronizarModoMapa('aventura'));
    await unaLecturaGPSLejos(page);
    await page.evaluate(() => {
      const m = globalThis.__vv_mapasStub[globalThis.__vv_mapasStub.length - 1];
      m.getZoom = () => 19;
      m.fire('zoomend');
    });
    const estructura = await page.evaluate(() => {
      const marcadores = globalThis.__vv_marcadoresStub || [];
      let el = null;
      for (let i = marcadores.length - 1; i >= 0 && !el; i--) {
        const cand = marcadores[i].getElement?.();
        if (cand && /marcador-usuario-gps-flecha/.test(cand.className || '')) el = cand;
      }
      return {
        existe: !!el,
        // .gps-arrow-heading es el div que actualizarRotacionFlechaGPS() busca en cada
        // lectura de brújula; si el reescalado lo hiciera desaparecer, la flecha dejaría
        // de girar en silencio.
        tieneContenedorDeRumbo: !!el?.querySelector('.gps-arrow-heading'),
      };
    });
    expect(estructura.existe, 'el marcador debe seguir en el mapa tras reescalar').toBe(true);
    expect(estructura.tieneContenedorDeRumbo, 'el reescalado debe conservar .gps-arrow-heading, o la brújula deja de rotar la flecha').toBe(true);
  });

  test('MU-3. Iconos y polylines escalan en sentidos OPUESTOS al acercar el zoom', async ({ page, context }) => {
    // El invariante de fondo de todo el sistema de escalado, y el que más fácil sería
    // romper por accidente "unificando" curvas: una polyline es una calle pintada (debe
    // engordar al acercar, para seguir encajando en la calle) y un icono es un cartel
    // indicador (debe encoger al acercar, para no tapar el detalle justo cuando hace falta
    // ver el portal exacto). Si alguna vez las dos familias empiezan a moverse en el mismo
    // sentido, este test cae — que es justo lo que debe pasar.
    await arrancar(page, context, { conInternosExpuestos: true });
    await page.waitForFunction(() => !!globalThis.funcionesMapa?.inicializarServicioMapa, null, { timeout: 25000 });

    const medir = async (zoom) => page.evaluate(async (z) => {
      const mod = await import('/js/funciones-mapa.js');
      // Mapa de mentira con el zoom fijado, como en 23-polyline-autoreparacion: guarda las
      // capas creadas para poder leer el grosor real con el que nacieron.
      const capas = {};
      const fakeMap = {
        _l: {},
        isStyleLoaded: () => true,
        loaded: () => true,
        on() { return fakeMap; }, once() { return fakeMap; }, off() { return fakeMap; },
        addSource() { return fakeMap; },
        addLayer(layer) { capas[layer.id] = layer; return fakeMap; },
        getSource() { return { setData() {} }; },
        getLayer(id) { return capas[id] ? {} : undefined; },
        removeLayer() {}, removeSource() {}, setPaintProperty() {},
        getZoom() { return z; },
      };
      globalThis.funcionesMapa.inicializarServicioMapa(fakeMap);
      const antes = (globalThis.__vv_marcadoresStub || []).length;
      mod.dibujarPolylineNavegacion({
        origen: { lat: 39.4795, lng: -0.3758 },
        destino: { lat: 39.4799, lng: -0.3762 },
      });
      // Grosor con el que nació la polyline
      const capa = Object.values(capas).find(c => c?.paint?.['line-width'] !== undefined);
      // Tamaño con el que nació el 🎯 de destino (el marcador creado por esa misma llamada)
      const nuevos = (globalThis.__vv_marcadoresStub || []).slice(antes);
      const iconoEl = nuevos.map(m => m.getElement?.()).find(el => el && /marcador-destino-navegacion/.test(el.className || ''));
      const interior = iconoEl?.firstElementChild;
      return {
        grosorPolyline: capa ? capa.paint['line-width'] : null,
        tamanoIcono: interior ? parseFloat(interior.style.fontSize) : null,
      };
    }, zoom);

    const lejos = await medir(15);
    const cerca = await medir(18);

    expect(lejos.grosorPolyline, 'la polyline debe nacer con un grosor legible').toBeGreaterThan(0);
    expect(lejos.tamanoIcono, 'el icono de destino debe nacer con un tamaño legible').toBeGreaterThan(0);

    expect(
      cerca.grosorPolyline,
      'al acercar, la polyline debe ENGORDAR: es una calle pintada y la calle también se ensancha'
    ).toBeGreaterThan(lejos.grosorPolyline);

    expect(
      cerca.tamanoIcono,
      'al acercar, el icono debe ENCOGER: es un cartel indicador, no terreno'
    ).toBeLessThan(lejos.tamanoIcono);
  });
});

test.describe('CH — El chat es alcanzable desde el padre', () => {
  test('CH-1. Al abrir el chat, hijo6-chat queda registrado en la mensajería', async ({ page, context }) => {
    await arrancar(page, context);
    await page.waitForFunction(
      () => typeof globalThis.mensajeria?.getIframesRegistrados === 'function'
        && !!document.getElementById('btn-chat-soporte'),
      null, { timeout: 25000 }
    );

    const antes = await page.evaluate(() => [...globalThis.mensajeria.getIframesRegistrados().keys()]);
    expect(antes, 'antes de abrirlo el chat no está cargado, así que tampoco registrado').not.toContain('hijo6-chat');

    // Camino real del usuario: pulsar el botón de chat.
    await page.evaluate(() => { document.getElementById('btn-chat-soporte').click(); });

    await page.waitForFunction(
      () => [...globalThis.mensajeria.getIframesRegistrados().keys()].includes('hijo6-chat'),
      null, { timeout: 10000 }
    );
    const despues = await page.evaluate(() => [...globalThis.mensajeria.getIframesRegistrados().keys()]);
    expect(
      despues,
      'sin este registro el padre no puede escribirle: ACK y PADRE_DATOS (que lleva el idioma) se descartan'
    ).toContain('hijo6-chat');
  });

  test('CH-2. Un envío del padre a hijo6-chat ya no se descarta por destino desconocido', async ({ page, context }) => {
    await arrancar(page, context);
    await page.waitForFunction(() => !!document.getElementById('btn-chat-soporte') && !!globalThis.mensajeria, null, { timeout: 25000 });

    await page.evaluate(() => {
      globalThis.idiomaSeleccionado = 'fr';
      document.getElementById('btn-chat-soporte').click();
    });
    await page.waitForFunction(
      () => [...(globalThis.mensajeria?.getIframesRegistrados?.() || new Map()).keys()].includes('hijo6-chat'),
      null, { timeout: 10000 }
    );

    // enviarMensaje resuelve false cuando _enviarDesdePadre no encuentra el iframe destino.
    const entregado = await page.evaluate(async () => globalThis.mensajeria.enviarMensaje({
      tipo: globalThis.TIPOS_MENSAJE.SISTEMA.HEARTBEAT,
      origen: 'padre',
      destino: 'hijo6-chat',
      datos: { timestamp: Date.now() }
    }));
    expect(entregado, 'un envío a hijo6-chat ya no puede caer en "Iframe no encontrado o sin contentWindow"').not.toBe(false);
  });
});
