/**
 * 61 — El puzzle de P10 reconoce los mensajes por constants.js, no por cadenas sueltas
 *
 * POR QUE EXISTE
 *
 * `_onPuzzleMessage()` vive en el <script> CLASICO de `En-busca-del-tesoro.html`, y un
 * script clasico no puede hacer `import`: no ve el `TIPOS_MENSAJE` que importa el
 * <script type="module"> del mismo fichero. La salida facil es comparar contra cadenas
 * escritas a mano, y entonces cambiar un valor en `js/constants.js` rompe esta pantalla
 * sin que nada avise — el boton de continuar no aparece y P10 se queda sin salida.
 *
 * La solucion es el mismo puente que ya usa `codigo-padre.html`:
 * `globalThis.TIPOS_MENSAJE = TIPOS_MENSAJE` publicado desde el bloque module.
 *
 * PZ-4 cubre el riesgo que introduce leerlo de ahi: `msg.tipo` es `undefined` en los
 * mensajes legacy (strings crudos), asi que si el puente faltara, comparar contra los
 * campos de un objeto inexistente seria comparar `undefined` con `undefined` y cualquier
 * mensaje ajeno daria el puzzle por completado.
 *
 * ROJO ANTES QUE VERDE: PZ-1, PZ-2 y PZ-3 fallan si se quita la linea
 * `globalThis.TIPOS_MENSAJE = TIPOS_MENSAJE` de `En-busca-del-tesoro.html`.
 */
'use strict';

const { test, expect } = require('@playwright/test');

/**
 * En-busca-del-tesoro.html se redirige a codigo-padre.html si se navega a el como pagina
 * de nivel superior (guardia deliberada). Para cargarlo de verdad hay que insertarlo como
 * <iframe> real, igual que hace codigo-padre.html en produccion — mismo arnes que usa
 * `45-texto-intro-fallback-idioma.spec.js`.
 */
async function cargarComoIframe(page) {
  await page.goto('/audio-hijo3.html');
  await page.evaluate(() => {
    const f = document.createElement('iframe');
    f.id = 'f-seleccion-test';
    f.src = '/En-busca-del-tesoro.html';
    f.style.cssText = 'width:100vw;height:100vh;';
    document.body.appendChild(f);
  });
  let frame = null;
  for (let i = 0; i < 30 && !frame; i++) {
    frame = page.frames().find((fr) => /En-busca-del-tesoro/.test(fr.url()));
    if (!frame) await page.waitForTimeout(300);
  }
  expect(frame, 'el iframe de seleccion debe haber cargado').toBeTruthy();
  // El puente lo publica el <script type="module">, que es diferido: se espera a la
  // funcion del script clasico Y al puente, para no medir una carrera de arranque.
  await frame.waitForFunction(
    () => typeof globalThis._onPuzzleMessage === 'function' || typeof _onPuzzleMessage === 'function',
    null, { timeout: 15_000 }
  );
  return frame;
}

/** Llama al handler con un evento sintetico del propio origen y devuelve si salio el boton. */
function probar(frame, data) {
  return frame.evaluate((d) => {
    const btn = document.getElementById('btn-continuar-puzzle');
    btn.style.display = 'none';                       // estado de partida conocido
    _onPuzzleMessage({ origin: globalThis.location.origin, data: d });
    return btn.style.display;
  }, data);
}

test.describe('PZ — P10 lee los tipos de puzzle de constants.js', () => {
  test('PZ-1. El bloque module publica TIPOS_MENSAJE.PUZZLE en el globalThis del iframe', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    const r = await frame.waitForFunction(
      () => {
        const P = globalThis.TIPOS_MENSAJE?.PUZZLE;
        return P ? { ...P } : null;
      }, null, { timeout: 15_000 }
    ).then((h) => h.jsonValue());

    // No basta con que el objeto exista: los cuatro campos son los que compara el handler.
    expect(r).toEqual({
      COMPLETADO: 'PUZZLE.COMPLETADO',
      TIMEOUT: 'PUZZLE.TIMEOUT',
      LEGACY_COMPLETADO: 'puzzle-state-completed',
      LEGACY_TIMEOUT: 'puzzle-state-timeout',
    });
  });

  test('PZ-2. Un PUZZLE.COMPLETADO tipado muestra el boton de continuar', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    await frame.waitForFunction(() => !!globalThis.TIPOS_MENSAJE?.PUZZLE, null, { timeout: 15_000 });
    expect(await probar(frame, { tipo: 'PUZZLE.COMPLETADO' })).toBe('flex');
    expect(await probar(frame, { tipo: 'PUZZLE.TIMEOUT' })).toBe('flex');
  });

  test('PZ-3. El formato legacy (string crudo) sigue funcionando', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    await frame.waitForFunction(() => !!globalThis.TIPOS_MENSAJE?.PUZZLE, null, { timeout: 15_000 });
    expect(await probar(frame, 'puzzle-state-completed')).toBe('flex');
    expect(await probar(frame, 'puzzle-state-timeout')).toBe('flex');
  });

  test('PZ-4. Un mensaje ajeno sin campo `tipo` NO da el puzzle por completado', async ({ page }) => {
    const frame = await cargarComoIframe(page);
    await frame.waitForFunction(() => !!globalThis.TIPOS_MENSAJE?.PUZZLE, null, { timeout: 15_000 });
    // Los mensajes de otros sistemas llegan al mismo listener de `message`. Si el handler
    // comparase contra campos de un objeto inexistente, estos tres darian verdadero.
    expect(await probar(frame, { algo: 'otra cosa' })).toBe('none');
    expect(await probar(frame, 'texto-cualquiera')).toBe('none');
    expect(await probar(frame, {})).toBe('none');
  });
});
