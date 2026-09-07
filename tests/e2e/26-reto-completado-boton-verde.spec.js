/**
 * 26-reto-completado-boton-verde.spec.js
 *
 * Prueba de la corrección de un fallo real reportado por el usuario: RETO.COMPLETADO
 * se enviaba al padre en el instante en que la respuesta era correcta (reto normal,
 * dentro de verificar()) o en el instante en que el iframe del puzzle avisaba que había
 * terminado — en ambos casos, ANTES de que el usuario pulsara el botón verde
 * (btnNext/btn-puzzle-continuar) que cierra la ventana del reto. Como el padre puede
 * completar la parada y disparar su cartel de transición en cuanto recibe
 * RETO.COMPLETADO, el aviso podía aparecer con la ventana del reto todavía tapando la
 * pantalla.
 *
 * La corrección (retos-hijo4.html): la compleción se guarda en _pendienteCompletado en
 * el momento de verificarse, y el envío real de RETO.COMPLETADO se retrasa hasta el
 * click del botón verde correspondiente — justo antes de RETO.OCULTAR.
 *
 * Verificación por log de consola, no por el mensaje postMessage en sí: cargando
 * retos-hijo4.html como página de nivel superior (sin un padre real que registre
 * handlers ni responda confirmaciones), el envío real pasa por un bucle interno de
 * auto-confirmación (mensajeria.js: un mensaje que pide confirmación y no encuentra
 * handler registrado se autoconfirma) cuyo delivery via postMessage no es observable
 * de forma fiable en este arnés de test — pero cada rama del código bajo prueba emite
 * su propio log (verificar(), y las dos ramas de éxito del click del botón verde), y
 * esos logs sí son deterministas: se emiten de forma síncrona en el punto exacto del
 * código que importa, sin depender de si la ronda de mensajería llega a resolverse.
 * Es la señal fiable para lo que esta prueba necesita confirmar: SI se llegó a
 * intentar el envío y CUÁNDO, no si un padre inexistente llegó a recibirlo.
 *
 *   RC-1  Reto normal (tipo 'texto'): tras responder, ningún log de envío de
 *         RETO.COMPLETADO aparece todavía — solo el de "pendiente". Al pulsar el botón
 *         verde, sí aparece (confirmado o sin confirmación, cualquiera de los dos
 *         cuenta como "se intentó enviar").
 *   RC-2  Si el usuario nunca pulsa el botón verde, ese log de envío nunca aparece.
 */
'use strict';

const { test, expect } = require('@playwright/test');

const LOG_PENDIENTE = 'Pendiente de confirmación con el botón verde';
const LOG_ENVIADO_CONFIRMADO = 'Confirmación recibida del padre para reto';
const LOG_ENVIADO_SIN_CONFIRMACION = 'Enviado sin confirmación';

function huboIntentoDeEnvio(logs) {
  return logs.some(l => l.includes(LOG_ENVIADO_CONFIRMADO) || l.includes(LOG_ENVIADO_SIN_CONFIRMACION));
}

async function _enviarRetoMostrar(page) {
  await page.evaluate(async () => {
    const reto = { id: 'test-reto-1', tipo: 'texto', pregunta: '¿Test?', correctas: [] };
    globalThis.postMessage({
      tipo: 'RETO.MOSTRAR',
      origen: 'padre',
      destino: 'hijo4',
      datos: { retoId: reto.id, retosArray: [reto] },
    }, globalThis.location.origin);
  });
}

// El registro del handler de RETO.MOSTRAR ocurre dentro del propio callback (async) de
// DOMContentLoaded de retos-hijo4.html — 'domcontentloaded' en Playwright solo espera a que
// el EVENTO se dispare, no a que ese callback asíncrono termine de ejecutarse. En un perfil
// más lento (iPhone 12 emulado, con CPU limitada) el primer envío puede llegar antes de que
// el handler exista todavía. En vez de una espera fija adicional (que solo movería el punto
// de fallo, no lo eliminaría), se reintenta el envío hasta que el reto aparece de verdad.
async function enviarRetoMostrarYEsperar(page) {
  for (let intento = 0; intento < 10; intento++) {
    await _enviarRetoMostrar(page);
    try {
      await page.waitForSelector('#respuestaTexto', { timeout: 1000 });
      return;
    } catch (_e) { /* reintentar */ }
  }
  // Último intento: si sigue sin aparecer tras 10 reintentos (~10s), que falle con un
  // mensaje de timeout claro en vez de silenciarse.
  await page.waitForSelector('#respuestaTexto', { timeout: 5000 });
}

/**
 * Provee el `globalThis.mensajeria` que el hijo espera cuando NO vive en un iframe.
 *
 * `enviarMensaje()` de los hijos bifurca por `parent !== window`. En produccion el hijo
 * SIEMPRE es un iframe y toma la rama rapida de postMessage. Cargado como pagina suelta
 * —lo que hacen estos tests— cae al `else`, que hace `retryUntilAvailable(..., 10, 500)`
 * sobre `globalThis.mensajeria`, objeto que no existe standalone porque el hijo no carga
 * mensajeria.js: agota los 10 intentos, **5.000 ms exactos**, y el handler hace `await`
 * de eso antes de seguir.
 *
 * Con el stub la rama lenta resuelve al instante. No debilita lo que se prueba y se
 * parece mas a produccion, donde ese envio tampoco bloquea. Mismo arreglo que en
 * 31-sincronizar-modo-ambas-direcciones.spec.js, donde se diagnostico el problema.
 */
async function proveerMensajeriaStub(page) {
  await page.addInitScript(() => {
    globalThis.mensajeria = globalThis.mensajeria || {
      enviarMensaje: () => Promise.resolve({ exito: true, metodo: 'stub-e2e' }),
    };
  });
}

test.describe('RC — RETO.COMPLETADO se confirma al pulsar el botón verde, no antes', () => {
  test.beforeEach(async ({ page }) => { await proveerMensajeriaStub(page); });

  test('RC-1. Tras responder correcto, no se intenta enviar hasta pulsar el botón verde', async ({ page }) => {
    const logs = [];
    page.on('console', (msg) => logs.push(msg.text()));

    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await enviarRetoMostrarYEsperar(page);

    await page.locator('.btn', { hasText: '🫵' }).click({ timeout: 5000 });
    await page.waitForTimeout(400);

    expect(logs.some(l => l.includes(LOG_PENDIENTE)), 'Debe registrar la compleción como pendiente al responder correcto').toBe(true);
    expect(huboIntentoDeEnvio(logs), 'No debe intentar enviar RETO.COMPLETADO solo por responder correcto').toBe(false);

    await page.locator('#btnNextAfterReto').click({ timeout: 5000 });

    await expect.poll(() => huboIntentoDeEnvio(logs), {
      timeout: 20000,
      message: 'Tras pulsar el botón verde, debe intentarse el envío de RETO.COMPLETADO (confirmado o no)',
    }).toBe(true);
  });

  test('RC-2. Si nunca se pulsa el botón verde, nunca se intenta enviar RETO.COMPLETADO', async ({ page }) => {
    const logs = [];
    page.on('console', (msg) => logs.push(msg.text()));

    await page.goto('retos-hijo4.html');
    await page.waitForLoadState('domcontentloaded');
    await enviarRetoMostrarYEsperar(page);

    await page.locator('.btn', { hasText: '🫵' }).click({ timeout: 5000 });
    await page.waitForTimeout(8000);

    expect(huboIntentoDeEnvio(logs), 'Sin pulsar el botón verde, nunca debe intentarse el envío de RETO.COMPLETADO').toBe(false);
  });
});
