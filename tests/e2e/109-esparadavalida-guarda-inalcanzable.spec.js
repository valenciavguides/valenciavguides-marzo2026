'use strict';

/**
 * 109 — Paso 9 de la lavadora ("lo muerto"): dos guardas inalcanzables en `_esParadaValida()`
 *
 * POR QUE EXISTE
 *
 * `_esParadaValida()` (boton-casa-hijo5.html) comprobaba `p.ubicacion.lat`/`lng` (¿tiene
 * coordenadas reales?) y `!p.nombre` (¿tiene nombre?). Pero `_transformarParadaPadre()`, que
 * construye `p` justo antes de esta llamada, rellena SIEMPRE ambos campos con un valor por
 * defecto cuando el original no los trae: `ubicacion: {lat:0, lng:0}` (nunca hay
 * `paradaPadre.coordenadas` — `DATOS_PADRE`/`elementosIDpadre`, paso 8.2 de la lavadora, no trae
 * coordenadas) y `` nombre: `Parada ${parada_id}` `` (siempre una cadena no vacía). `typeof 0
 * === 'number'` y una cadena no vacía nunca es falsy, así que ninguna de las dos comprobaciones
 * era alcanzable jamás, para ninguna parada real. Medido con un spec desechable antes del
 * arreglo (una parada sin `nombre` SÍ se contaba como válida). Retiradas las dos ramas sin
 * cambiar el resultado — solo queda la comprobación real: sin `id`/`padreid` NI `parada_id`, que
 * `_transformarParadaPadre()` no rellena con ningún valor por defecto.
 *
 * Camino real: `NAVEGACION.RESPUESTA_DATOS_PARADAS` con una mezcla de paradas —
 * `generarBotonesParadas()` avisa al padre con `PARADAS.READY` (tipo real: `VV:PARADAS:READY`)
 * en cuanto termina, con `{count}` de botones generados; esa cuenta es la señal observable de
 * cuántas paradas pasaron el filtro completo (incluye el propio filtro de `tipo` de
 * `generarBotonesParadas()`, aparte de `_esParadaValida()` — por eso las paradas de prueba
 * llevan `tipo: 'parada'`, igual que las reales).
 *
 *   EP-1  De 3 paradas (una sin nombre, una sin id ni parada_id), llegan exactamente 2 al
 *         `count` de `PARADAS.READY` — la que falta id/parada_id se descarta; la que falta
 *         nombre NO se descarta (rama inalcanzable, comportamiento sin cambios).
 *
 * No hay ROJO/VERDE aquí: es una limpieza de código muerto sin cambio de comportamiento — este
 * spec fija el comportamiento real (antes y después es el mismo) para que quede cubierto.
 */

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, recibidosPorElMarco, enviarAlHijo } = require('./helpers/boot');

test.describe('EP — _esParadaValida(): solo la comprobación alcanzable (id/parada_id)', () => {
  test('EP-1. Sin id ni parada_id se descarta; sin nombre no (rama inalcanzable)', async ({ page }) => {
    await abrirHijoEnMarco(page, 'boton-casa-hijo5.html');
    await enviarAlHijo(page, {
      tipo: 'NAVEGACION.RESPUESTA_DATOS_PARADAS',
      origen: 'padre',
      destino: 'hijo5',
      datos: {
        paradas: [
          { padreid: 'padre-P1', parada_id: 'Av1-P-1', tipo: 'parada', nombre: 'Parada 1' },
          { padreid: 'padre-P2', parada_id: 'Av1-P-2', tipo: 'parada' }, // sin nombre — sigue siendo válida
          { tipo: 'parada', nombre: 'Sin id ni parada_id' }, // sin id ni parada_id — se descarta
        ],
      },
    });
    await expect
      .poll(() => recibidosPorElMarco(page).then((r) => r.find((m) => m.tipo === 'VV:PARADAS:READY')?.datos?.count), { timeout: 10_000 })
      .toBe(2);
  });
});
