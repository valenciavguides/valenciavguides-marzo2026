/**
 * PZ — el puzzle de P10 reconoce los mensajes por `constants.js`, y solo esos
 *
 *   PZ-1  el puente `globalThis.TIPOS_MENSAJE.PUZZLE` publica los dos tipos que existen
 *   PZ-2  un PUZZLE.COMPLETADO o un PUZZLE.TIMEOUT sacan el botón de continuar
 *   PZ-3  la cadena pelada del formato antiguo ya no hace nada
 *   PZ-4  un mensaje sin `origen` no saca el botón: el bus lo descarta
 *
 * POR QUE EXISTE
 *
 * El código de P10 vive en el `<script>` CLÁSICO de `En-busca-del-tesoro.html`, y un script
 * clásico no puede hacer `import`: no ve el `TIPOS_MENSAJE` que importa el
 * `<script type="module">` del mismo fichero. La salida fácil es comparar contra cadenas
 * escritas a mano, y entonces cambiar un valor en `js/constants.js` rompe esta pantalla sin
 * que nada avise — el botón de continuar no aparece y P10 se queda sin salida. Por eso el
 * puente `globalThis.TIPOS_MENSAJE`, y por eso el código grita si falta.
 *
 * LO QUE ESTE FICHERO YA NO PRUEBA, Y POR QUÉ
 *
 * Había un caso que exigía que el formato antiguo —el mensaje como cadena pelada, sin
 * objeto— siguiera funcionando. Ese formato no lo enviaba NADIE en ningún fichero del
 * proyecto, y lo que sí hacía era dar el puzzle por superado ante una cadena suelta de
 * cualquier frame del dominio. Se retiró con la migración al bus, y PZ-3 vigila ahora lo
 * contrario: que no vuelva.
 *
 * ROJO ANTES QUE VERDE: PZ-1 cae si se quita `globalThis.TIPOS_MENSAJE = TIPOS_MENSAJE`;
 * PZ-2 cae si se quita cualquiera de los dos `registrarControlador` de `cargarPuzzle()`.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, enviarAlHijo } = require('./helpers/boot');

const SELECCION = 'En-busca-del-tesoro.html';

/**
 * Deja la pantalla en el estado de P10: con el puzzle cargado y sus handlers puestos.
 *
 * Se llama a `cargarPuzzle()` en vez de recorrer las nueve pantallas anteriores. Es el
 * MONTAJE, no lo que se comprueba: lo que se comprueba llega después, como mensaje de
 * verdad por el bus.
 */
async function enP10(page) {
  const seleccion = await abrirHijoEnMarco(page, SELECCION);
  await seleccion.waitForFunction(() => typeof globalThis.cargarPuzzle === 'function'
    || typeof cargarPuzzle === 'function', null, { timeout: 15_000 });
  await seleccion.evaluate(async () => {
    // eslint-disable-next-line no-undef -- vive en el <script> clásico de la propia página
    await cargarPuzzle();
  });
  return seleccion;
}

/** Pone el botón en un estado de partida conocido y devuelve su `display` tras el mensaje. */
async function trasMensaje(page, seleccion, mensaje) {
  await seleccion.evaluate(() => {
    document.getElementById('btn-continuar-puzzle').style.display = 'none';
  });
  await enviarAlHijo(page, mensaje);
  // VENTANA-OBSERVACION: tres de los cuatro casos comprueban que el botón NO sale
  await page.waitForTimeout(400);
  return seleccion.evaluate(() => document.getElementById('btn-continuar-puzzle').style.display);
}

test.describe('PZ — P10 lee los tipos de puzzle de constants.js', () => {
  test('PZ-1. El bloque module publica TIPOS_MENSAJE.PUZZLE en el globalThis del iframe', async ({ page }) => {
    const seleccion = await abrirHijoEnMarco(page, SELECCION);
    const r = await seleccion.waitForFunction(
      () => {
        const P = globalThis.TIPOS_MENSAJE?.PUZZLE;
        return P ? { ...P } : null;
      }, null, { timeout: 15_000 },
    ).then((h) => h.jsonValue());

    // Exactamente estos dos: si reaparece un tercero, alguien ha vuelto a meter un formato
    // alternativo y este caso lo dice.
    expect(r).toEqual({
      COMPLETADO: 'PUZZLE.COMPLETADO',
      TIMEOUT: 'PUZZLE.TIMEOUT',
    });
  });

  test('PZ-2. PUZZLE.COMPLETADO y PUZZLE.TIMEOUT sacan el botón de continuar', async ({ page }) => {
    const seleccion = await enP10(page);

    expect(await trasMensaje(page, seleccion, { tipo: 'PUZZLE.COMPLETADO', origen: 'puzzle', datos: {} }))
      .toBe('flex');
    expect(await trasMensaje(page, seleccion, { tipo: 'PUZZLE.TIMEOUT', origen: 'puzzle', datos: {} }))
      .toBe('flex');
  });

  test('PZ-3. La cadena pelada del formato antiguo ya no hace nada', async ({ page }) => {
    const seleccion = await enP10(page);

    // El bus descarta lo que no sea un objeto con `tipo`, así que ni llega a un handler.
    expect(await trasMensaje(page, seleccion, 'puzzle-state-completed')).toBe('none');
    expect(await trasMensaje(page, seleccion, 'puzzle-state-timeout')).toBe('none');
  });

  test('PZ-4. Un mensaje sin `origen` no saca el botón', async ({ page }) => {
    const seleccion = await enP10(page);

    // Es una garantía del bus, no de esta pantalla: sin `origen` se descarta y se avisa.
    expect(await trasMensaje(page, seleccion, { tipo: 'PUZZLE.COMPLETADO', datos: {} })).toBe('none');
    expect(await trasMensaje(page, seleccion, { algo: 'otra cosa', origen: 'puzzle' })).toBe('none');
  });
});
