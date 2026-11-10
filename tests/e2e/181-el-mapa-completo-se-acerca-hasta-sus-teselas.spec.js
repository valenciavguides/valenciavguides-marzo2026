/**
 * 181-el-mapa-completo-se-acerca-hasta-sus-teselas.spec.js
 *
 * El mapa completo se acerca hasta el último nivel que tiene teselas, el 19, el mismo tope que el mapa moderno
 * (`_MAPA_MAX_ZOOM`): más allá, su capa de OpenStreetMap no se dibuja y el mapa se queda gris (estudio K-196; el usuario:
 * «hagamos que pare también en ese punto, homogeneidad»). `mapa-completo.html` en `helpers/marco-vacio.html`, con Leaflet de
 * verdad y las teselas servidas con una imagen local; se pulsa su «+» hasta que se desactiva, esperando en cada nivel a que
 * Leaflet acabe de acercar y de poner sus teselas.
 *
 *   ZM-1  En el nivel más cercano al que se llega hay teselas, y ese nivel es el 19.
 *   ZM-2  Control: al abrirse, en el nivel 15, hay teselas.
 *
 * ROJO ANTES QUE VERDE: con el mapa hasta el 21 cae ZM-1 (en el 21 no hay ninguna tesela); ZM-2 pasa antes y después.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { abrirHijoEnMarco } = require('./helpers/boot');

const TESELA = fs.readFileSync(path.join(__dirname, '../../imagenes/imagenes-aplicación/logo-splash-192.png'));

/** El fondo tal como está: sus teselas en la página, de qué niveles, si el «+» está desactivado y si Leaflet anima. */
const estado = (marco) => marco.evaluate(() => {
  const imgs = [...document.querySelectorAll('.leaflet-tile-pane img.leaflet-tile')];
  const niveles = [...new Set(imgs.map((i) => (i.getAttribute('src') || '').match(/\/(\d+)\/\d+\/\d+\.png/)?.[1]).filter(Boolean))];
  return {
    teselas: imgs.length,
    cargadas: imgs.filter((i) => i.classList.contains('leaflet-tile-loaded')).length,
    niveles: niveles.sort().join(','),
    masDesactivado: document.querySelector('.leaflet-control-zoom-in')?.classList.contains('leaflet-disabled') === true,
    animando: document.querySelector('.leaflet-zoom-anim') !== null,
  };
});

/** Quieto: sin animación, y sus teselas cargadas y de un solo nivel (o ninguna). */
const quieto = (e) => !e.animando && e.cargadas === e.teselas && !e.niveles.includes(',');

async function abrirMapa(page) {
  await page.route(/https:\/\/[abc]\.tile\.openstreetmap\.org\/\d+\//, (route) => route.fulfill({ contentType: 'image/png', body: TESELA }));
  const marco = await abrirHijoEnMarco(page, 'mapa-completo.html', { esperarPreparado: false });
  await marco.waitForFunction(() => typeof globalThis.L !== 'undefined' && document.querySelector('.leaflet-control-zoom-in'), null, { timeout: 30_000 });
  return marco;
}

test.describe('ZM — el mapa completo se acerca hasta donde llegan sus teselas', () => {
  test('ZM-1. En el nivel más cercano al que se llega hay teselas, y es el 19', async ({ page }) => {
    const marco = await abrirMapa(page);
    await expect.poll(async () => { const e = await estado(marco); return quieto(e) && e.teselas > 0; }, { message: 'al abrirse pone sus teselas', timeout: 15_000 }).toBe(true);

    // Un clic durante la animación de Leaflet no acerca: se espera a que cada acercamiento acabe antes del siguiente.
    let antes = await estado(marco);
    for (let clics = 0; clics < 10 && !antes.masDesactivado; clics++) {
      await marco.locator('.leaflet-control-zoom-in').click();
      const previo = JSON.stringify(antes);
      await expect.poll(async () => { const e = await estado(marco); return quieto(e) && JSON.stringify(e) !== previo; }, {
        message: 'Leaflet acaba de acercar y de poner las teselas del nivel nuevo', timeout: 15_000,
      }).toBe(true);
      antes = await estado(marco);
    }
    expect(antes.masDesactivado, 'se llega al tope: el «+» queda desactivado').toBe(true);
    expect(antes.niveles, 'el tope es el último nivel con teselas, el 19').toBe('19');
    expect(antes.teselas, 'y en él hay teselas: el mapa no se queda gris').toBeGreaterThan(0);
  });

  test('ZM-2. Control: al abrirse, en el nivel 15, hay teselas', async ({ page }) => {
    const marco = await abrirMapa(page);
    await expect.poll(async () => { const e = await estado(marco); return quieto(e) && e.teselas > 0 ? e.niveles : null; }, { timeout: 15_000 }).toBe('15');
  });
});
