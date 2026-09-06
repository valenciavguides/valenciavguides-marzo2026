/**
 * 50-pending-iniciado-no-borra-reto.spec.js
 *
 * `SISTEMA.NOTIFICACION { evento: 'PENDING_INICIADO' }` significa "el padre ha
 * empezado a seguir la compleción de esta parada" (§13). NO significa que el
 * usuario haya salido del reto, así que no debe tocar la UI del reto abierto.
 *
 * El handler de hijo4 hacía `estado.retoActualId = null` + `ocultarControles()`, y
 * eso rompía tres botones de golpe unos segundos después de abrir el reto:
 *
 *   · #btnEnviar          → display:none (desaparecía)
 *   · #btnMostrarRespuesta → disabled (visible pero inerte, "el SOS no da la respuesta")
 *   · #btnSaltarReto      → intacto, pero su listener abre con
 *                            `if (!estado.retoActualId) return`, así que no hacía nada
 *
 * `ensurePending()` (codigo-padre.html) emite el aviso al CREAR el pending, y eso
 * puede pasar con el reto ya abierto. En modo CASA es lo normal: el botón de retos
 * se habilita nada más cambiar de parada (§29.8), así que el reto se abre antes de
 * que exista pending alguno. En AVENTURA el reto solo se abre tras acabar el audio
 * (§29.7) y para entonces el pending ya está creado — protegido por el orden de los
 * eventos, no por diseño, que es justo lo que estos tests fijan.
 *
 *   PI-1  Reto de texto libre: los cuatro botones siguen usables tras PENDING_INICIADO.
 *   PI-2  Reto de opción: idem (el handler no distingue tipo, y no debe empezar a hacerlo).
 *   PI-3  El botón de saltar SIGUE FUNCIONANDO tras el aviso — la prueba de que
 *         `estado.retoActualId` no se ha puesto a null.
 *   PI-4  Un PENDING_INICIADO de OTRA parada tampoco toca nada.
 */

const { test, expect } = require('@playwright/test');

const RETO_TEXTO = {
  id: 'test-pending-texto',
  tipo: 'texto',
  pregunta: '¿Qué te ha parecido?',
  correctas: ['cualquier cosa']
};

const RETO_OPCION = {
  id: 'test-pending-opcion',
  tipo: 'opcion',
  pregunta: '¿Test?',
  opciones: ['A', 'B', 'C'],
  correctas: ['B']
};

const PADRE_ID = 'padre-P7';

/** Mismo patrón que 43-saltar-reto-puzzle-roto.spec.js: el mensaje se postea a la propia página. */
async function enviarRetoMostrarYEsperar(page, datos, selectorEspera) {
  for (let intento = 0; intento < 10; intento++) {
    await page.evaluate((d) => {
      globalThis.postMessage({ tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4', datos: d }, globalThis.location.origin);
    }, datos);
    try {
      await page.waitForSelector(selectorEspera, { timeout: 1000 });
      return;
    } catch (_e) { /* reintentar */ } // NOSONAR
  }
  await page.waitForSelector(selectorEspera, { timeout: 5000 });
}

/** Fija estado.padreIdActual, que es lo que el handler compara. */
async function fijarParadaActual(page, padreId, retoId) {
  await page.evaluate(({ p, r }) => {
    globalThis.postMessage({
      tipo: 'NAVEGACION.CAMBIO_PARADA', origen: 'padre', destino: 'hijo4',
      datos: { padreId: p, padreid: p, paradaId: 'Av1-P-7', parada_id: 'Av1-P-7', retoId: r }
    }, globalThis.location.origin);
  }, { p: padreId, r: retoId });
  await page.waitForTimeout(300);
}

async function enviarPendingIniciado(page, padreId) {
  await page.evaluate((p) => {
    globalThis.postMessage({
      tipo: 'SISTEMA.NOTIFICACION', origen: 'padre', destino: 'hijo4',
      datos: { evento: 'PENDING_INICIADO', padreId: p, ttlMs: 600000 }
    }, globalThis.location.origin);
  }, padreId);
  await page.waitForTimeout(500);
}

async function estadoBotones(page) {
  return page.evaluate(() => {
    const inspeccionar = (el) => {
      if (!el) return null;
      return { visible: getComputedStyle(el).display !== 'none', disabled: !!el.disabled };
    };
    const g = (id) => inspeccionar(document.getElementById(id));
    // btnEnviar se crea con document.createElement() y NO tiene id (retos-hijo4.html
    // ~L886): solo className "btn". Se localiza por eso, dentro del contenedor donde
    // mostrarReto() lo inserta.
    const enviar = document.querySelector('#button-container button.btn');
    return {
      enviar: inspeccionar(enviar),
      sos: g('btnMostrarRespuesta'),
      saltar: g('btnSaltarReto'),
      avanzar: g('btnNextAfterReto')
    };
  });
}

test.describe('PI — PENDING_INICIADO no debe borrar el reto abierto', () => {
  test.beforeEach(async ({ browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit no carga retos-hijo4.html standalone (misma limitación que RT-1/RT-2 en 43-saltar-reto-puzzle-roto)');
  });

  test('PI-1. Reto de texto libre: los botones siguen usables tras PENDING_INICIADO', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await fijarParadaActual(page, PADRE_ID, RETO_TEXTO.id);
    await enviarRetoMostrarYEsperar(page, { retoId: RETO_TEXTO.id, retosArray: [RETO_TEXTO] }, '#respuestaTexto');

    const antes = await estadoBotones(page);
    expect(antes.enviar.visible, 'el botón de confirmar debe estar visible al abrir el reto').toBe(true);
    expect(antes.enviar.disabled, 'y habilitado').toBe(false);
    expect(antes.sos.disabled, 'el SOS debe estar habilitado').toBe(false);

    await enviarPendingIniciado(page, PADRE_ID);

    const despues = await estadoBotones(page);
    expect(despues.enviar.visible, 'el botón de confirmar NO debe desaparecer').toBe(true);
    expect(despues.enviar.disabled, 'ni quedarse deshabilitado').toBe(false);
    expect(despues.sos.disabled, 'el SOS debe seguir respondiendo').toBe(false);
    expect(despues.saltar.disabled, 'el botón de saltar debe seguir habilitado').toBe(false);
  });

  test('PI-2. Reto de opción: mismo comportamiento (el handler no distingue tipo)', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await fijarParadaActual(page, PADRE_ID, RETO_OPCION.id);
    await enviarRetoMostrarYEsperar(page, { retoId: RETO_OPCION.id, retosArray: [RETO_OPCION] }, 'input[name="op"]');

    await enviarPendingIniciado(page, PADRE_ID);

    const st = await estadoBotones(page);
    expect(st.enviar.visible).toBe(true);
    expect(st.enviar.disabled).toBe(false);
    expect(st.sos.disabled).toBe(false);
  });

  test('PI-3. Saltar sigue funcionando tras PENDING_INICIADO (retoActualId intacto)', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await fijarParadaActual(page, PADRE_ID, RETO_OPCION.id);
    await enviarRetoMostrarYEsperar(page, { retoId: RETO_OPCION.id, retosArray: [RETO_OPCION] }, 'input[name="op"]');

    await enviarPendingIniciado(page, PADRE_ID);

    // Si el handler hubiera puesto retoActualId = null, este click no haría nada.
    await page.click('#btnSaltarReto');
    await expect(page.locator('input[name="op"][value="B"]')).toBeChecked();
  });

  test('PI-4. PENDING_INICIADO de otra parada tampoco toca la UI', async ({ page }) => {
    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await fijarParadaActual(page, PADRE_ID, RETO_TEXTO.id);
    await enviarRetoMostrarYEsperar(page, { retoId: RETO_TEXTO.id, retosArray: [RETO_TEXTO] }, '#respuestaTexto');

    await enviarPendingIniciado(page, 'padre-P99');

    const st = await estadoBotones(page);
    expect(st.enviar.visible).toBe(true);
    expect(st.enviar.disabled).toBe(false);
    expect(st.sos.disabled).toBe(false);
  });
});
