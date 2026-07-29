/**
 * 18-boton-deshabilitado-color.spec.js
 *
 * Cobertura de dos arreglos del reporte de campo del usuario tras probar Aventura1:
 *
 *   BU-1  Causa raíz de "botón ubicación verde pero deshabilitado": código disperso
 *         ponía `btn.style.backgroundColor = '...'` (longhand, inline, máxima
 *         especificidad) para "apagar" visualmente el botón, pero la regla CSS real
 *         usa `background: linear-gradient(...)` (shorthand) sobre la clase
 *         `.disabled` — un inline `background-color` NUNCA gana a un `background-image`
 *         de hoja de estilos, porque son sub-propiedades distintas que se pintan en
 *         capas separadas (la imagen encima del color). El fix real fue dejar de tocar
 *         estilos a mano y usar siempre desactivarBoton()/activarBoton()
 *         (coordenadas-hijo2.html), que solo tocan la clase `.disabled`. Este test
 *         reproduce el bypass a propósito (fondo inline verde) y confirma que la
 *         clase `.disabled` sigue pintando el degradado rojo por encima, pase lo que
 *         pase con el inline.
 *   BU-2  Estandarización de color: los 4 sitios CSS (`.boton.disabled` en
 *         coordenadas-hijo2.html y video-intro.html, `#retosBtn:disabled` y
 *         `#hijo3 .boton.deshabilitado` en audio-hijo3.html,
 *         `#audio-main-toggle-btn:disabled`/`.audio-action-btn:disabled` en
 *         codigo-padre.html) resuelven al mismo rojo base #B22222 = rgb(178, 34, 34).
 *
 * Cada página se carga de forma standalone (no como iframe hijo dentro de
 * codigo-padre.html) — los módulos ES no cargan sobre file://, así que se navega vía
 * el servidor http local de Playwright (baseURL), igual que el resto de la suite.
 * Las aserciones leen el estilo COMPUTADO tras forzar la clase/atributo relevante,
 * no dependen de que ningún flujo real de la app dispare el estado.
 */
'use strict';

const { test, expect } = require('@playwright/test');

const ROJO_BASE = 'rgb(178, 34, 34)'; // #B22222

test.describe('BU — Botón deshabilitado: color estandarizado y mecanismo de la clase .disabled', () => {
  test('BU-1. Un background-color inline (bypass) no puede tapar el degradado de la clase .disabled', async ({ page }) => {
    await page.goto('/coordenadas-hijo2.html');
    await page.waitForSelector('#btn-ubicacion', { state: 'attached', timeout: 15000 });

    const resultado = await page.evaluate(() => {
      const btn = document.getElementById('btn-ubicacion');
      // .boton lleva `transition: all 0.3s ease` — sin anularla, leer el estilo computado
      // justo después de cambiar la clase puede capturar un valor a medio interpolar
      // (varía según motor de renderizado). Se anula para medir el estado final real, no
      // un fotograma de la animación.
      btn.style.transition = 'none';
      // Simula el bypass que causaba el bug: código antiguo apagando el botón a mano.
      btn.style.backgroundColor = 'green';
      btn.disabled = true;
      const antesDeDisabled = getComputedStyle(btn).backgroundImage;
      // Simula desactivarBoton(): el único cambio real es esta clase.
      btn.classList.add('disabled');
      const despuesDeDisabled = getComputedStyle(btn).backgroundImage;
      return { antesDeDisabled, despuesDeDisabled };
    });

    expect(resultado.despuesDeDisabled, 'Con la clase .disabled, background-image debe ser el degradado (no "none")').toContain('linear-gradient');
    expect(resultado.despuesDeDisabled, `El degradado pintado encima debe ser el rojo estándar. Computado: ${resultado.despuesDeDisabled}`).toContain(ROJO_BASE);
  });

  test('BU-2a. coordenadas-hijo2.html — .boton.disabled resuelve a rgb(178,34,34)', async ({ page }) => {
    await page.goto('/coordenadas-hijo2.html');
    const bg = await page.evaluate(() => {
      const el = document.createElement('button');
      el.className = 'boton disabled';
      document.body.appendChild(el);
      return getComputedStyle(el).backgroundImage;
    });
    expect(bg, `Computado: ${bg}`).toContain(ROJO_BASE);
  });

  test('BU-2b. audio-hijo3.html — #retosBtn:disabled resuelve a rgb(178,34,34)', async ({ page }) => {
    await page.goto('/audio-hijo3.html');
    await page.waitForSelector('#retosBtn', { state: 'attached', timeout: 15000 });
    // #retosBtn lleva `disabled` de fábrica en el HTML estático — sin necesidad de forzar nada.
    const bg = await page.evaluate(() => getComputedStyle(document.getElementById('retosBtn')).backgroundImage);
    expect(bg, `Computado: ${bg}`).toContain(ROJO_BASE);
  });

  test('BU-2c. audio-hijo3.html — #hijo3 .boton.deshabilitado resuelve a rgb(178,34,34)', async ({ page }) => {
    await page.goto('/audio-hijo3.html');
    const bg = await page.evaluate(() => {
      let hijo3 = document.getElementById('hijo3');
      if (!hijo3) {
        hijo3 = document.createElement('div');
        hijo3.id = 'hijo3';
        document.body.appendChild(hijo3);
      }
      const el = document.createElement('button');
      el.className = 'boton deshabilitado';
      hijo3.appendChild(el);
      return getComputedStyle(el).backgroundImage;
    });
    expect(bg, `Computado: ${bg}`).toContain(ROJO_BASE);
  });

  test('BU-2d. codigo-padre.html — #audio-main-toggle-btn:disabled y .audio-action-btn:disabled resuelven a rgb(178,34,34)', async ({ page }) => {
    await page.goto('/codigo-padre.html');
    const resultado = await page.evaluate(() => {
      const a = document.createElement('button');
      a.id = 'audio-main-toggle-btn';
      a.disabled = true;
      document.body.appendChild(a);

      const b = document.createElement('button');
      b.className = 'audio-action-btn';
      b.disabled = true;
      document.body.appendChild(b);

      return {
        toggle: getComputedStyle(a).backgroundImage,
        accion: getComputedStyle(b).backgroundImage,
      };
    });
    expect(resultado.toggle, `#audio-main-toggle-btn computado: ${resultado.toggle}`).toContain(ROJO_BASE);
    expect(resultado.accion, `.audio-action-btn computado: ${resultado.accion}`).toContain(ROJO_BASE);
  });

  test('BU-2e. video-intro.html — .boton.disabled resuelve a rgb(178,34,34)', async ({ page }) => {
    await page.goto('/video-intro.html');
    const bg = await page.evaluate(() => {
      const el = document.createElement('button');
      el.className = 'boton disabled';
      document.body.appendChild(el);
      return getComputedStyle(el).backgroundImage;
    });
    expect(bg, `Computado: ${bg}`).toContain(ROJO_BASE);
  });
});
