/**
 * 180-hijo4-se-ensena-solo-por-el-apreton-de-manos.spec.js
 *
 * Un hijo enseña su interfaz por un solo camino: la confirmación del padre al apretón de manos (`PADRE_CONFIRMA_HIJO_LISTO`),
 * o el último recurso tras 30 `HIJO_LISTO` sin ella (spec 172). hijo4 no la enseña por su cuenta al recibir un reto (estudio
 * K-191; el usuario: «sí, pero asegura que funcione correctamente»). hijo4 vive en `helpers/marco-vacio.html`, que hace de padre
 * y no le manda nada por su cuenta: el test decide si llega la confirmación.
 *
 *   RU-1  Sin la confirmación del padre, un reto no enseña la interfaz de hijo4: lo pinta, y la interfaz sigue oculta.
 *   RU-2  Control: con la confirmación del padre, la interfaz se ve, y el mismo reto también.
 *
 * ROJO ANTES QUE VERDE: con hijo4 enseñándose al recibir un reto, cae RU-1 (la interfaz se ve sin la confirmación); RU-2 pasa
 * antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const { abrirHijoEnMarco, enviarAlHijo, recibidosPorElMarco } = require('./helpers/boot');

const RETO = { id: 'id-texto', tipo: 'texto', pregunta: '¿Test?', correctas: ['lo que sea'] };

/** Lo que ve el usuario de hijo4: si su body está a la vista (lo oculta `ocultarInterfazHastaConfirmar` al cargar). */
const seVe = (hijo) => hijo.evaluate(() => document.body.style.display !== 'none');

/** La pregunta que hijo4 tiene pintada en su panel del reto. */
const pregunta = (hijo) => hijo.evaluate(() => document.querySelector('#reto h3')?.textContent || '');

/** Le manda el reto como el padre y espera a que hijo4 diga que lo ha pintado (`RETO.MOSTRADO`). */
async function mandarReto(page) {
  await enviarAlHijo(page, {
    tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4',
    datos: { retoId: RETO.id, retosArray: [RETO], contexto: 'manual', idioma: 'es', timestamp: Date.now() },
  });
  await expect.poll(() => recibidosPorElMarco(page).then((r) => r.some((m) => m.tipo === 'RETO.MOSTRADO')), {
    message: 'hijo4 avisa con RETO.MOSTRADO de que ha pintado el reto', timeout: 10_000,
  }).toBe(true);
}

test.describe('RU — hijo4 se enseña solo por el apretón de manos', () => {
  test('RU-1. Sin la confirmación del padre, un reto no enseña la interfaz de hijo4', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    expect(await seVe(hijo), 'al cargar, la interfaz está oculta').toBe(false);

    await mandarReto(page);
    expect(await pregunta(hijo), 'el reto se ha pintado').toBe(RETO.pregunta);
    expect(await seVe(hijo), 'y la interfaz sigue oculta: solo la enseña la confirmación del padre').toBe(false);
  });

  test('RU-2. Control: con la confirmación del padre, la interfaz se ve, y el reto también', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await enviarAlHijo(page, { tipo: 'SISTEMA.PADRE_CONFIRMA_HIJO_LISTO', origen: 'padre', destino: 'hijo4', datos: { timestamp: Date.now() } });
    await expect.poll(() => seVe(hijo), { message: 'la confirmación enseña la interfaz', timeout: 10_000 }).toBe(true);

    await mandarReto(page);
    expect(await pregunta(hijo), 'el reto se ha pintado').toBe(RETO.pregunta);
    expect(await seVe(hijo), 'y se ve').toBe(true);
  });
});
