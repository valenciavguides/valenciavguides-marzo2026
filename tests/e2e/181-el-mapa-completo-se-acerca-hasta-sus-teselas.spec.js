/**
 * 181-el-mapa-completo-se-acerca-hasta-sus-teselas.spec.js
 *
 * El mapa completo se acerca hasta el último nivel que tiene teselas, el 19, el mismo tope que el mapa moderno
 * (`_MAPA_MAX_ZOOM`): más allá, su capa de OpenStreetMap no se dibuja y el mapa se queda gris (estudio K-196; el usuario:
 * «hagamos que pare también en ese punto, homogeneidad»). Y no tiene botones de zoom, como el mapa moderno y el antiguo
 * (decisión del usuario): se acerca con los dedos y con la rueda del ratón. `mapa-completo.html` en
 * `helpers/marco-vacio.html`, con Leaflet de verdad y las teselas servidas con una imagen local.
 *
 * El spec acerca con la tecla «+» del teclado numérico, que Leaflet atiende con el mapa enfocado: llega igual a todos los
 * navegadores (la rueda no se puede mandar en el iPhone del arnés, ni un pellizco en ninguno). Pulsa más veces que niveles
 * hay del 15 al tope; las que sobran, o una que Leaflet no atienda a mitad de un acercamiento, dejan el mapa como estaba.
 *
 *   ZM-1  En el nivel más cercano al que se llega hay teselas, y ese nivel es el 19.
 *   ZM-2  Control: al abrirse, en el nivel 15, hay teselas.
 *   ZM-3  El mapa no tiene botones de zoom: ni «+» ni «−».
 *
 * ROJO ANTES QUE VERDE: con el mapa hasta el 21 cae ZM-1 (en el 21 no hay ninguna tesela); con los botones de Leaflet, ZM-3.
 * ZM-2 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { abrirHijoEnMarco } = require('./helpers/boot');

const TESELA = fs.readFileSync(path.join(__dirname, '../../imagenes/imagenes-aplicación/logo-splash-192.png'));

/** El fondo tal como está: sus teselas en la página, de qué niveles, y si Leaflet anima. */
const estado = (marco) => marco.evaluate(() => {
  const imgs = [...document.querySelectorAll('.leaflet-tile-pane img.leaflet-tile')];
  const niveles = [...new Set(imgs.map((i) => (i.getAttribute('src') || '').match(/\/(\d+)\/\d+\/\d+\.png/)?.[1]).filter(Boolean))];
  return {
    teselas: imgs.length,
    cargadas: imgs.filter((i) => i.classList.contains('leaflet-tile-loaded')).length,
    niveles: niveles.sort().join(','),
    animando: document.querySelector('.leaflet-zoom-anim') !== null,
  };
});

/** Quieto: sin animación, y sus teselas cargadas y de un solo nivel (o ninguna). */
const quieto = (e) => !e.animando && e.cargadas === e.teselas && !e.niveles.includes(',');

async function abrirMapa(page) {
  await page.route(/https:\/\/[abc]\.tile\.openstreetmap\.org\/\d+\//, (route) => route.fulfill({ contentType: 'image/png', body: TESELA }));
  const marco = await abrirHijoEnMarco(page, 'mapa-completo.html', { esperarPreparado: false });
  await marco.waitForFunction(() => typeof globalThis.L !== 'undefined' && document.querySelector('#map .leaflet-tile-pane'), null, { timeout: 30_000 });
  await expect.poll(async () => { const e = await estado(marco); return quieto(e) && e.teselas > 0; }, { message: 'al abrirse pone sus teselas', timeout: 15_000 }).toBe(true);
  return marco;
}

test.describe('ZM — el mapa completo se acerca hasta donde llegan sus teselas, sin botones', () => {
  test('ZM-1. En el nivel más cercano al que se llega hay teselas, y es el 19', async ({ page }) => {
    test.setTimeout(120_000);
    const marco = await abrirMapa(page);

    // Se pulsa hasta que tres pulsaciones seguidas dejan el mapa como estaba: es el tope.
    let sinCambio = 0;
    let maximo = 0;
    for (let pulsaciones = 0; pulsaciones < 12 && sinCambio < 3; pulsaciones++) {
      const previo = JSON.stringify(await estado(marco));
      await marco.locator('#map').press('NumpadAdd');
      const cambio = await expect.poll(async () => { const e = await estado(marco); return quieto(e) && JSON.stringify(e) !== previo; }, { timeout: 4_000 })
        .toBe(true).then(() => true, () => false);
      sinCambio = cambio ? 0 : sinCambio + 1;
      const e = await estado(marco);
      if (quieto(e) && e.niveles) maximo = Math.max(maximo, Number(e.niveles));
    }
    const fin = await estado(marco);
    expect(sinCambio, 'se llega al tope: tres pulsaciones seguidas no lo cambian').toBe(3);
    expect(maximo, 'nunca pasa del último nivel con teselas').toBe(19);
    expect(fin.niveles, 'el tope es el 19').toBe('19');
    expect(fin.teselas, 'y en él hay teselas: el mapa no se queda gris').toBeGreaterThan(0);
  });

  test('ZM-2. Control: al abrirse, en el nivel 15, hay teselas', async ({ page }) => {
    const marco = await abrirMapa(page);
    expect((await estado(marco)).niveles).toBe('15');
  });

  test('ZM-3. El mapa no tiene botones de zoom: ni «+» ni «−»', async ({ page }) => {
    const marco = await abrirMapa(page);
    expect(await marco.locator('.leaflet-control-zoom').count(), 'sin el control de zoom de Leaflet').toBe(0);
  });
});
