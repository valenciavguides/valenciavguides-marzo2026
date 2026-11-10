/**
 * 173 — El «fuera de rango» es de un elemento
 *
 * POR QUE EXISTE
 *
 * hijo2 decide si el usuario está fuera de rango midiendo contra un elemento, y el padre lo apunta
 * (`estado.usuarioFueraRango`) con ese elemento (`elementoMasCercano`). Al cambiar de elemento nadie lo
 * olvidaba: el «fuera de rango» del anterior seguía apagando el audio, el botón de retos y «avanzar» del
 * nuevo, con su pantalla de distancia encima, hasta dos lecturas buenas del nuevo. Al entrar en AVENTURA
 * el elemento es el inicio, y sin gracia antes de la llegada (K-185) una sola lectura lejos del inicio
 * basta: lo medido en Firefox (specs 123 y 124) es una lectura a 100 m del inicio, en la parada 1, y la
 * parada 1 bloqueada para siempre. Además, el mapa sigue midiendo contra el elemento anterior hasta un
 * segundo después de cada cambio (K-74), y hijo2 adoptaba el elemento que traía cada lectura.
 *
 *   FR-1  Fuera de rango del inicio y la parada 1 pasa a ser la actual: el padre lo olvida, quita la
 *         pantalla de distancia y «avanzar» espera a la parada, no al rango.
 *   FR-2  Una lectura medida contra el elemento anterior, llegada después del cambio, no le cambia el
 *         elemento a hijo2 ni lo pone fuera de rango.
 *   FR-3  El padre no apunta el fuera de rango ni enseña la distancia de un elemento que ya no es el
 *         actual. Controles: los del elemento actual, sí.
 *   FR-4  Control: reactivar el mismo elemento no olvida su fuera de rango.
 *
 * ROJO ANTES QUE VERDE: con el código anterior caen FR-1, FR-2 y FR-3; FR-4 pasa, que es lo que le toca a
 * un control.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, cargarHijosDelPadre } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

// Parada real de la Aventura1 y su punto de inicio, a 99,4 m.
const INICIO = { id: 'Av1-P-0' };
const PARADA = { id: 'Av1-P-1', lat: 39.47959, lng: -0.37583 };
// Unos 100 m al sur de la parada.
const LEJOS_DE_LA_PARADA = { lat: 39.47869, lng: -0.37583 };

const padre = (page) => page.evaluate(() => ({
  fueraDeRango: globalThis.estado.usuarioFueraRango?.activo === true,
  de: globalThis.estado.usuarioFueraRango?.elementoMasCercano ?? null,
  avanzar: globalThis._decidirAvanzar().razon,
  pantallaDesviado: !!document.getElementById('foto-desviado-overlay')?.classList.contains('show'),
}));

const activar = (page, id) => page.evaluate((i) => globalThis.mensajeria.despacharLocal({ tipo: 'NAVEGACION.CAMBIO_PARADA', datos: { paradaId: i } }), id);

/** Una lectura por el mismo sitio por el que entra el GPS. */
const lectura = (page, p) => page.evaluate((x) => globalThis.funcionesMapa.procesarPosicionGPSParaAventura({ coords: { latitude: x.lat, longitude: x.lng, accuracy: 8 } }), p);

/** Un aviso de hijo2 al padre, por el bus de hijo2. */
const desdeHijo2 = (page, tipo, datos) => page.evaluate(({ tipo, datos }) =>
  document.getElementById('hijo2').contentWindow.mensajeria.enviarMensajeConConfirmacion({ tipo, destino: 'padre', datos, timeout: 15_000 }), { tipo, datos });

test.describe('FR — El fuera de rango es de un elemento', () => {
  test.beforeEach(async ({ page, context }) => {
    // Como el spec 123: antes del goto, para que el watchPosition real no se quede colgado en Firefox.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: PARADA.lat, longitude: PARADA.lng });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'en';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
      if (!globalThis.AVENTURA_PARADAS?.length) {
        const coords = globalThis.__vv_DATOS_AVENTURAS?.Aventura1?.['coordenadas-hijo2.html']?.coordenadas;
        if (coords?.length) globalThis.AVENTURA_PARADAS = coords;
      }
    });
    await cargarHijosDelPadre(page);
    await page.waitForFunction(() => ['hijo2', 'hijo3', 'hijo4'].every((h) => globalThis.estado?.hijosInicializados?.has(h)), null, { timeout: 90_000 });
    // AVENTURA: el elemento actual es el punto de inicio.
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'SISTEMA.CAMBIO_MODO', datos: { modo: 'aventura' } }));
    await expect.poll(() => page.evaluate(() => globalThis.estado.elementoActual?.parada_id), { timeout: 15_000 }).toBe(INICIO.id);
  });

  test('FR-1. Fuera de rango del inicio y la parada 1 pasa a ser la actual: el padre lo olvida y quita la pantalla', async ({ page }) => {
    // En la parada 1, a 100 m del inicio, sin haber llegado a él: fuera de rango del inicio, sin gracia (K-185).
    await expect.poll(async () => { await lectura(page, PARADA); return (await padre(page)).fueraDeRango; },
      { timeout: 15_000, intervals: [300], message: 'precondición: fuera de rango del inicio' }).toBe(true);
    expect((await padre(page)).de, 'precondición: el fuera de rango es del inicio').toBe(INICIO.id);

    const cambio = await activar(page, PARADA.id);
    expect(cambio?.exito).toBe(true);
    expect(await padre(page), 'la parada 1 empieza sin el fuera de rango del inicio: «avanzar» espera a la parada')
      .toEqual({ fueraDeRango: false, de: null, avanzar: 'elemento_sin_completar', pantallaDesviado: false });
  });

  test('FR-2. Una lectura medida contra el elemento anterior, llegada después del cambio, no pone a hijo2 fuera de rango', async ({ page }) => {
    expect((await activar(page, PARADA.id))?.exito).toBe(true);
    // Lo que manda el mapa mientras sigue midiendo el inicio (K-74): el usuario, en la parada 1, a 100 m del inicio.
    await page.evaluate((p) => globalThis.mensajeria.enviarMensaje({
      tipo: 'NAVEGACION.ACTUALIZAR_ESTADO', destino: 'hijo2',
      datos: { distanciaAlDestino: 100, distanciaAlCamino: 100, recorridoSuficiente: true, idParada: 'Av1-P-0', tipoParada: 'inicio', toleranciaGPS: 50, radioLlegada: 15, lat: p.lat, lng: p.lng, accuracy: 8 },
    }), PARADA);
    await page.waitForTimeout(1_500); // VENTANA-OBSERVACION: lo que hijo2 contestaría (GPS.RESTRINGIDO, USUARIO_FUERA_RANGO) y el padre aplicaría
    expect(await padre(page), 'la lectura del inicio no habla de la parada 1').toEqual({ fueraDeRango: false, de: null, avanzar: 'elemento_sin_completar', pantallaDesviado: false });

    // Control: la misma distancia medida contra la parada 1 sí la pone fuera de rango.
    await expect.poll(async () => { await lectura(page, LEJOS_DE_LA_PARADA); return (await padre(page)).fueraDeRango; },
      { timeout: 15_000, intervals: [300], message: 'control: a 100 m de la parada 1, fuera de rango' }).toBe(true);
    expect((await padre(page)).de).toBe(PARADA.id);
  });

  test('FR-3. El padre no apunta el fuera de rango ni enseña la distancia de un elemento que ya no es el actual', async ({ page }) => {
    expect((await activar(page, PARADA.id))?.exito).toBe(true);
    await desdeHijo2(page, 'NAVEGACION.GPS.RESTRINGIDO', { idParada: INICIO.id, distancia: 100, franja: 'desviado', rangoMaximo: 15, timestampSalioDeRango: Date.now() });
    await desdeHijo2(page, 'NAVEGACION.USUARIO_FUERA_RANGO', { distancia: 100, franja: 'desviado', elementoMasCercano: INICIO.id, timestamp: Date.now() });
    expect(await padre(page), 'los avisos del inicio no valen para la parada 1').toEqual({ fueraDeRango: false, de: null, avanzar: 'elemento_sin_completar', pantallaDesviado: false });

    // Controles: los mismos avisos del elemento actual sí se aplican.
    await desdeHijo2(page, 'NAVEGACION.GPS.RESTRINGIDO', { idParada: PARADA.id, distancia: 100, franja: 'desviado', rangoMaximo: 15, timestampSalioDeRango: Date.now() });
    await desdeHijo2(page, 'NAVEGACION.USUARIO_FUERA_RANGO', { distancia: 100, franja: 'desviado', elementoMasCercano: PARADA.id, timestamp: Date.now() });
    expect(await padre(page)).toEqual({ fueraDeRango: true, de: PARADA.id, avanzar: 'fuera_de_rango', pantallaDesviado: true });
  });

  test('FR-4. Control: reactivar el mismo elemento no olvida su fuera de rango', async ({ page }) => {
    expect((await activar(page, PARADA.id))?.exito).toBe(true);
    await expect.poll(async () => { await lectura(page, LEJOS_DE_LA_PARADA); return (await padre(page)).fueraDeRango; },
      { timeout: 15_000, intervals: [300], message: 'precondición: a 100 m de la parada 1, fuera de rango' }).toBe(true);

    expect((await activar(page, PARADA.id))?.exito).toBe(true);
    expect(await padre(page), 'sigue a 100 m de la misma parada').toEqual({ fueraDeRango: true, de: PARADA.id, avanzar: 'fuera_de_rango', pantallaDesviado: true });
  });
});
