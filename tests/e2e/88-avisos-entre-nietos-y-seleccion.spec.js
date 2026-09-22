'use strict';

const { test, expect } = require('@playwright/test');

/**
 * VI — el aviso de fin de vídeo llega, y solo desde el mismo origen.
 *
 *   VI-1  el aviso hace avanzar la selección a P5
 *   VI-2  el mismo aviso desde otro origen NO la mueve
 *   VI-3  el aviso cierra el modal de hijo6
 *   VI-4  desde otro origen NO lo cierra
 *
 * POR QUÉ EXISTE
 *
 * `SELECCION.VIDEO_INTRO_TERMINADO` —de video-intro a la pantalla de selección, y el mismo
 * tipo escuchado por hijo6 para cerrar su modal— NO lo cubría ningún spec. Se descubrió al
 * ir a quitar el soporte de `file://`: las dos escuchas aceptaban `event.origin === 'null'`
 * y los emisores mandaban con `targetOrigin: '*'` —a cualquier origen— cuando el suyo era
 * null. Todo eso servía a un escenario imposible: los módulos ES no cargan sobre `file://`
 * (lo dice `js/mensajeria.js`, lo documenta el spec 18) y, además, `index.html` fuerza
 * HTTPS y el service worker exige contexto seguro. Pero tocarlo sin red era ir a ciegas.
 *
 * VI-2 y VI-4 son los que dan valor al conjunto: comprueban que el descarte por origen
 * existe de verdad, que es justo el código que ese cambio tocó. Sin ellos, VI-1 y VI-3
 * pasarían igual aunque la comprobación de origen desapareciera.
 *
 * LA SELECCIÓN NO SE PUEDE ABRIR SUELTA. MEDIDO: si se carga como documento principal y sin
 * `?despedida=1`, su primer script redirige a `codigo-padre.html` —"Archivo abierto
 * directamente"—, con lo que el test acababa mirando el padre y `#pantalla5` ni existía.
 * Por eso entra en `helpers/marco-vacio.html`, que le hace de padre y no le manda nada.
 * hijo6 sí corre suelto y se carga directamente.
 *
 * QUÉ SE MIRA: el efecto, no la función. Ni `mostrar()` ni `cerrarModal()` están expuestas
 * en `globalThis` —son locales a su ámbito—, así que se comprueba lo que ve el usuario:
 * `#pantalla5` con la clase `visible`, y `#chat-modal-overlay` sin ella.
 */

const MARCO = 'tests/e2e/helpers/marco-vacio.html';
const HIJO6 = 'chat-hijo6.html';
const AVISO = { tipo: 'SELECCION.VIDEO_INTRO_TERMINADO', origen: 'video-intro' };
const OTRO_ORIGEN = 'https://otro-sitio.example';

/** Mete la selección en un marco que le hace de padre, y comprueba que es ella. */
async function abrirSeleccionEnMarco(page) {
  await page.goto(MARCO);
  await page.evaluate(() => new Promise((resolve) => {
    const el = document.createElement('iframe');
    el.id = 'marco-hijo';
    el.src = '/En-busca-del-tesoro.html'; // absoluta: el marco vive en /tests/e2e/helpers/
    el.addEventListener('load', () => resolve(), { once: true });
    document.body.appendChild(el);
  }));
  const url = await page.evaluate(() => document.getElementById('marco-hijo')?.contentDocument?.location?.href || '');
  expect(url, 'el marco tenía que cargar la selección, no otra cosa').toContain('En-busca-del-tesoro.html');

  // Esperar a que la selección se asiente en su pantalla inicial ANTES de empujar nada.
  // El evento `load` del iframe no basta: su inicialización sigue corriendo después y
  // termina llamando a `mostrar(1)`. MEDIDO en iphone12: si el aviso llega en ese hueco,
  // P5 se muestra y acto seguido la inicialización la tapa con P1 — el test caía de forma
  // intermitente, y no por un fallo de la aplicación sino del arnés.
  await expect
    .poll(() => page.evaluate(() => {
      const doc = document.getElementById('marco-hijo')?.contentDocument;
      return [...(doc?.querySelectorAll('.pantalla') || [])].some((p) => p.classList.contains('visible'));
    }), { timeout: 15_000 })
    .toBe(true);

  // Y a su bus. La pantalla inicial la pone un script clasico, que corre antes que los
  // modulos: P1 se ve antes de que exista `globalThis.mensajeria`. MEDIDO en iphone12 con
  // carga: en 31 de 81 arranques el aviso salia con P1 visible y sin bus, y en uno llego antes
  // que la escucha y se perdio. `HIJO_PREPARADO` lo manda la seleccion con sus handlers ya
  // registrados, y el marco lo guarda en `__recibidos`.
  await expect
    .poll(() => page.evaluate(() => (globalThis.__recibidos || []).some((m) => m.tipo === 'SISTEMA.HIJO_PREPARADO')), { timeout: 15_000 })
    .toBe(true);
}

const pantalla5Visible = (page) => page.evaluate(() => {
  const doc = document.getElementById('marco-hijo')?.contentDocument;
  const p = doc?.getElementById('pantalla5');
  if (!p) return null; // null delata un fallo de arnés: no se confunde con false
  return p.classList.contains('visible') && p.style.display !== 'none';
});

const modalHijo6Visible = (page) => page.evaluate(() => {
  const ov = document.getElementById('chat-modal-overlay');
  return ov ? ov.classList.contains('visible') : null;
});

/** Manda el aviso como lo mandaría el nieto: mismo origen, a la ventana que escucha. */
async function avisar(page, { enMarco }) {
  await page.evaluate(({ aviso, enMarco }) => {
    const destino = enMarco ? document.getElementById('marco-hijo').contentWindow : globalThis;
    destino.postMessage(aviso, globalThis.location.origin);
  }, { aviso: AVISO, enMarco });
}

/**
 * Manda el aviso como si viniera de fuera. No se puede montar un iframe de otro origen
 * aquí, así que se fabrica el evento con la forma exacta que tendría: es la única manera
 * de recorrer la rama del descarte.
 */
async function avisarDesdeFuera(page, { enMarco }) {
  await page.evaluate(({ aviso, enMarco, otro }) => {
    const ventana = enMarco ? document.getElementById('marco-hijo').contentWindow : globalThis;
    ventana.dispatchEvent(new (ventana.MessageEvent)('message', {
      data: aviso,
      origin: otro,
      source: ventana,
    }));
  }, { aviso: AVISO, enMarco, otro: OTRO_ORIGEN });
}

test.describe('VI — el aviso de fin de vídeo', () => {
  test('VI-1. Hace avanzar la selección a P5', async ({ page }) => {
    await abrirSeleccionEnMarco(page);
    expect(await pantalla5Visible(page), 'P5 no puede estar ya visible: el test no probaría nada').toBe(false);

    await avisar(page, { enMarco: true });
    await expect.poll(() => pantalla5Visible(page), { timeout: 8_000 }).toBe(true);
  });

  test('VI-2. Desde otro origen no la mueve', async ({ page }) => {
    await abrirSeleccionEnMarco(page);

    await avisarDesdeFuera(page, { enMarco: true });
    // VENTANA-OBSERVACION: se comprueba que un aviso de otro origen NO tiene efecto
    await page.waitForTimeout(1200);
    expect(await pantalla5Visible(page), 'un aviso de otro origen no puede mover la pantalla').toBe(false);

    // Y que el camino bueno sigue vivo: sin esto, VI-2 pasaría con el handler muerto.
    await avisar(page, { enMarco: true });
    await expect.poll(() => pantalla5Visible(page), { timeout: 8_000 }).toBe(true);
  });

  test('VI-3. Cierra el modal de hijo6', async ({ page }) => {
    await page.goto(HIJO6);
    await page.waitForLoadState('domcontentloaded');

    // Se abre el modal poniendo su clase: lo que se prueba es que el aviso la quita.
    const seAbrio = await page.evaluate(() => {
      const ov = document.getElementById('chat-modal-overlay');
      if (!ov) return false;
      ov.classList.add('visible');
      return ov.classList.contains('visible');
    });
    expect(seAbrio, 'hijo6 tiene que tener #chat-modal-overlay').toBe(true);

    await avisar(page, { enMarco: false });
    await expect.poll(() => modalHijo6Visible(page), { timeout: 8_000 }).toBe(false);
  });

  test('VI-4. Desde otro origen no lo cierra', async ({ page }) => {
    await page.goto(HIJO6);
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => document.getElementById('chat-modal-overlay')?.classList.add('visible'));
    expect(await modalHijo6Visible(page)).toBe(true);

    await avisarDesdeFuera(page, { enMarco: false });
    // VENTANA-OBSERVACION: se comprueba que un aviso de otro origen NO tiene efecto
    await page.waitForTimeout(1200);
    expect(await modalHijo6Visible(page), 'un aviso de otro origen no puede cerrar el modal').toBe(true);

    await avisar(page, { enMarco: false });
    await expect.poll(() => modalHijo6Visible(page), { timeout: 8_000 }).toBe(false);
  });
});
