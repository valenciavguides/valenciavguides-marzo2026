/**
 * 133 — hijo4: «el reto abierto» es uno solo, y un cambio de parada no lo da por abierto
 *
 * POR QUE EXISTE
 *
 * En hijo4, `estado.retoActualId` es el reto que el usuario tiene abierto: lo fija `mostrarReto()` (por `RETO.MOSTRAR`)
 * y lo borra `RETO.LIMPIAR_ESTADO`. Lo leen el botón de saltar y el cambio de modo, que no limpia la ventana del reto si
 * hay uno abierto y lo avisa («omitiendo limpieza»). `NAVEGACION.CAMBIO_PARADA` no lo toca: el reto de una parada no
 * está abierto hasta que se muestra.
 *
 *   UR-1  Control: con un reto abierto, el cambio de modo no limpia y lo avisa.
 *   UR-2  Tras un CAMBIO_PARADA que nombra un reto, sin abrirlo, el cambio de modo limpia sin ese aviso.
 *
 * ROJO ANTES QUE VERDE: cuando CAMBIO_PARADA escribía el reto de la parada en `estado.retoActualId`, UR-2 veía el aviso.
 */
'use strict';

const { test, expect } = require('@playwright/test');

const RETO = { id: 'test-reto-abierto', tipo: 'opcion', pregunta: '¿Test?', opciones: ['A', 'B', 'C'], correctas: ['B'] };
const AVISO = 'omitiendo limpieza';

/** hijo4 va suelto: los mensajes se postean a la propia página con origen 'padre', y lo que mide el spec sale en su consola. */
const postear = (page, mensaje) => page.evaluate((m) => globalThis.postMessage(m, globalThis.location.origin), mensaje);

async function arrancar(page) {
  const consola = [];
  page.on('console', (m) => consola.push(m.text()));
  await page.goto('/retos-hijo4.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => globalThis.mensajeria?.tieneControlador?.('SISTEMA.CAMBIO_MODO') === true, null, { timeout: 15_000 });
  return consola;
}

/** Cambio de modo; espera a que hijo4 lo procese y deja una ventana para su aviso, que va justo detrás. */
async function cambiarModo(page, consola, modo) {
  const antes = consola.length;
  await postear(page, { tipo: 'SISTEMA.CAMBIO_MODO', origen: 'padre', destino: 'hijo4', datos: { modo } });
  await expect.poll(() => consola.slice(antes).some((t) => t.includes('Procesando cambio a modo')), { timeout: 5_000 }).toBe(true);
  // VENTANA-OBSERVACION: el aviso de «omitiendo limpieza» se escribe justo después; aquí se comprueba si sale o no
  await page.waitForTimeout(500);
  return consola.slice(antes).some((t) => t.includes(AVISO));
}

test.describe('UR — hijo4: el reto abierto es uno solo', () => {
  test('UR-1. Control: con un reto abierto, el cambio de modo no limpia y lo avisa', async ({ page }) => {
    const consola = await arrancar(page);
    for (let intento = 0; intento < 10; intento++) {
      await postear(page, { tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4', datos: { retoId: RETO.id, retosArray: [RETO] } });
      if (await page.locator('input[name="op"]').count()) break;
      await page.waitForSelector('input[name="op"]', { timeout: 1_000 }).catch(() => {});
    }
    await expect(page.locator('input[name="op"]').first()).toBeAttached();
    expect(await cambiarModo(page, consola, 'casa'), 'con el reto abierto, el cambio de modo lo avisa').toBe(true);
  });

  test('UR-2. Un CAMBIO_PARADA que nombra un reto no lo da por abierto: el cambio de modo limpia sin aviso', async ({ page }) => {
    const consola = await arrancar(page);
    await postear(page, {
      tipo: 'NAVEGACION.CAMBIO_PARADA', origen: 'padre', destino: 'hijo4',
      datos: { padreId: 'padre-P7', padreid: 'padre-P7', paradaId: 'Av1-P-7', parada_id: 'Av1-P-7', retoId: RETO.id },
    });
    await expect.poll(() => consola.some((t) => t.includes('NAVEGACION.CAMBIO_PARADA] recibido')), { timeout: 5_000 }).toBe(true);
    expect(await cambiarModo(page, consola, 'casa'), 'sin reto abierto no hay nada que proteger').toBe(false);
  });
});
