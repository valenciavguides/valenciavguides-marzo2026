/**
 * 48-precarga-video-no-pisa-abierto.spec.js
 *
 * Cobertura de `_precargarVideoParada()` (codigo-padre.html, llamada desde
 * `_hdl_NAVEGACION_CAMBIO_PARADA`), que hasta ahora no tenía ninguna — ver
 * docs/GUIA-COMPLETA.md §15.
 *
 * El `<video>` que precarga y el que reproduce son EL MISMO elemento
 * (`#video-overlay video`). Sin guard, llegar a la parada siguiente mientras el
 * usuario tiene el vídeo de un tramo abierto le asignaba `source.src` del tramo
 * siguiente y llamaba a `load()`: le cambiaba el vídeo a mitad de reproducción.
 * Es alcanzable de verdad — nada cierra el overlay al cambiar de parada (solo el
 * botón de cerrar, Escape, o un cambio de MODO vía `_limpiarRecursos()`), y la
 * llegada a la parada siguiente la dispara el GPS.
 *
 * NOTA de entorno: igual que 12-carga-por-parada.spec.js, se verifica observando
 * los logs del propio padre. `_precargarVideoParada` es local a Script 2 (no está
 * en `globalThis`), así que se ejercita a través del camino real
 * (`__triggerCambioParadaInterno` → `_hdl_NAVEGACION_CAMBIO_PARADA`).
 *
 *   PV-1  Overlay cerrado: al activar una parada cuyo siguiente elemento es un
 *         tramo con vídeo, se precarga (comportamiento normal, no regresión).
 *   PV-2  Overlay abierto (`.visible`): la precarga se pospone y lo dice en el log.
 *   PV-3  El `src` del vídeo que el usuario está viendo NO cambia — la comprobación
 *         directa del bug, sobre el DOM real y no sobre el log.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

const VIDEO_ABIERTO = 'videos-aventuras/video_intro_ejemplo.mp4';
// URL inyectada como vídeo del tramo siguiente: distinta de la que el usuario está
// viendo, para que PV-3 distinga "no ha cambiado" de "ha cambiado a otra cosa".
const VIDEO_SIGUIENTE_TRAMO = 'videos-aventuras/video_intro_ejemplo.mp4?tramo-siguiente=1';

async function prepararPadre(page) {
  await page.addInitScript({ path: MAPLIBRE_STUB });
  await injectInitSpy(page);
  await stubCDNResources(page);
  await gotoAndWaitForFase1(page);
  await page.evaluate(() => {
    globalThis.aventuraSeleccionada = 'Aventura1';
    globalThis.idiomaSeleccionado = 'es';
  });
  await page.evaluate(async () => {
    if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') {
      await globalThis.__cargarDatosAventuraDiferidos();
    }
  });
  await page.waitForFunction(
    () => typeof globalThis.__triggerCambioParadaInterno === 'function',
    null, { timeout: 15000 }
  );
}

/**
 * Prepara el único escenario en el que `_precargarVideoParada()` hace algo: una parada
 * cuyo elemento SIGUIENTE es un tramo con vídeo.
 *
 * Los 239 tramos de `js/coordenadas-aventuras.js` tienen hoy `video: ""` — aún no se ha
 * grabado ninguno. Así que el test **inyecta** una URL en la entrada de coordenadas del
 * tramo siguiente, reproduciendo exactamente el estado que habrá el día que se graben.
 * Sin esto los tres tests se saltarían y esta zona seguiría sin cobertura real.
 *
 * Ojo con de dónde se inyecta: la URL se escribe en `__vv_DATOS_AVENTURAS`
 * (coordenadas-aventuras.js), NO en `elementosIDpadre` — porque es de ahí de donde
 * `_precargarVideoParada` debe leerla, igual que hace hijo2 para `#btn-video`. Si alguien
 * revierte esa lectura a `siguiente.video`, estos tests fallan, que es justo lo que se
 * quiere: `elementosIDpadre` no tiene campo `video`.
 */
async function prepararParadaConVideoDetras(page, urlVideo) {
  return page.evaluate((url) => {
    const els = globalThis.DATOS_PADRE?.[globalThis.aventuraSeleccionada]?.[globalThis.idiomaSeleccionado]?.elementosIDpadre;
    const coords = globalThis.__vv_DATOS_AVENTURAS?.[globalThis.aventuraSeleccionada]?.['coordenadas-hijo2.html']?.coordenadas;
    if (!Array.isArray(els) || !Array.isArray(coords)) return null;
    for (let i = 0; i < els.length - 1; i++) {
      const act = els[i];
      const sig = els[i + 1];
      if (act?.tipo !== 'parada' || sig?.tipo !== 'tramo') continue;
      const idSig = sig.tramo_id || sig.id;
      const entrada = coords.find((c) => c && c.id === idSig);
      if (!entrada) continue;
      entrada.video = url; // el estado que habrá cuando se graben los vídeos
      return { paradaId: act.parada_id || act.id, padreId: act.padreid, videoSiguiente: url, idSiguiente: idSig };
    }
    return null;
  }, urlVideo);
}

async function activarParada(page, objetivo) {
  await page.evaluate(async (o) => {
    await globalThis.__triggerCambioParadaInterno({
      paradaId: o.paradaId,
      parada_id: o.paradaId,
      padreId: o.padreId,
      padreid: o.padreId,
      contexto: 'test_precarga_video'
    });
  }, objetivo);
}

test.describe('PV — _precargarVideoParada() no pisa un vídeo que el usuario está viendo', () => {
  test('PV-1. Overlay cerrado: precarga el vídeo del siguiente tramo (sin regresión)', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadre(page);

    const objetivo = await prepararParadaConVideoDetras(page, VIDEO_SIGUIENTE_TRAMO);
    test.skip(!objetivo, 'La aventura no tiene ninguna parada seguida de un tramo');

    await activarParada(page, objetivo);
    await page.waitForTimeout(400);

    expect(
      logs.some((l) => l.includes('Precargando vídeo del siguiente tramo')),
      'con el overlay cerrado debe precargar'
    ).toBe(true);
    expect(
      logs.some((l) => l.includes('Precarga de video pospuesta')),
      'no debe posponerse si nadie está viendo nada'
    ).toBe(false);
  });

  test('PV-2. Overlay abierto: pospone la precarga y lo registra', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await prepararPadre(page);

    const objetivo = await prepararParadaConVideoDetras(page, VIDEO_SIGUIENTE_TRAMO);
    test.skip(!objetivo, 'La aventura no tiene ninguna parada seguida de un tramo');

    // El usuario está viendo el vídeo de un tramo: overlay creado y visible.
    await page.evaluate((src) => {
      globalThis.mostrarVideoOverlay(src);
    }, VIDEO_ABIERTO);
    await page.waitForFunction(
      () => document.getElementById('video-overlay')?.classList.contains('visible') === true,
      null, { timeout: 5000 }
    );

    await activarParada(page, objetivo);
    await page.waitForTimeout(400);

    expect(
      logs.some((l) => l.includes('Precarga de video pospuesta')),
      'con el overlay abierto debe posponerse'
    ).toBe(true);
    expect(
      logs.some((l) => l.includes('Precargando vídeo del siguiente tramo')),
      'no debe precargar encima del vídeo abierto'
    ).toBe(false);
  });

  test('PV-3. El src del vídeo abierto no cambia al llegar a la parada siguiente', async ({ page }) => {
    await prepararPadre(page);

    const objetivo = await prepararParadaConVideoDetras(page, VIDEO_SIGUIENTE_TRAMO);
    test.skip(!objetivo, 'La aventura no tiene ninguna parada seguida de un tramo');

    await page.evaluate((src) => { globalThis.mostrarVideoOverlay(src); }, VIDEO_ABIERTO);
    await page.waitForFunction(
      () => document.getElementById('video-overlay')?.classList.contains('visible') === true,
      null, { timeout: 5000 }
    );

    const srcAntes = await page.evaluate(
      () => document.querySelector('#video-overlay video source')?.getAttribute('src')
    );

    await activarParada(page, objetivo);
    await page.waitForTimeout(400);

    const srcDespues = await page.evaluate(
      () => document.querySelector('#video-overlay video source')?.getAttribute('src')
    );

    expect(srcDespues, 'el vídeo que el usuario está viendo no debe cambiar de fuente').toBe(srcAntes);
    expect(srcDespues).not.toBe(objetivo.videoSiguiente);
  });
});
