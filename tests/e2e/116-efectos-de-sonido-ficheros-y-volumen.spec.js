/**
 * 116-efectos-de-sonido-ficheros-y-volumen.spec.js
 *
 * Los cuatro efectos de sonido son ficheros propios, del tamaño y el formato de la guía, y todo
 * lo que suena en la PWA suena al máximo.
 *
 *   EF-1  audios-efectos/ tiene exactamente los ficheros que nombra js/efectos-sonido.js
 *   EF-2  cada MP3 es MPEG-1 Capa III a 128 kbps (la guía, §12)
 *   EF-3  sw.js precarga el módulo y los cuatro MP3 en APP_SHELL
 *   EF-4  ninguna fuente de sonido externa, ni .ogg, y `new Audio(` solo vive en el módulo
 *   EF-5  ningún fichero de producción fija `volume` a otra cosa que 1, y `muted` solo lo toca
 *         video-intro.html (sobre su <video>)
 *   EF-6  el reproductor de narración de hijo3 arranca con volume 1 y sin silenciar
 *
 * Volumen: la PWA no tiene control de volumen ni de silencio propio; lo regula el usuario con los
 * botones de su dispositivo. Un `volume = 0.3` o un `muted` en un audio lo contradicen.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { abrirHijoEnMarco } = require('./helpers/boot');

const RAIZ = path.resolve(__dirname, '../..');
const leer = (rel) => fs.readFileSync(path.join(RAIZ, rel), 'utf8');

/** Los ficheros de producción que el navegador ejecuta: los HTML de la raíz y js/*.js (sin vendor ni el servidor). */
function ficherosDeProduccion() {
  const raiz = fs.readdirSync(RAIZ).filter((f) => f.endsWith('.html'));
  const js = fs.readdirSync(path.join(RAIZ, 'js'))
    .filter((f) => f.endsWith('.js') && f !== 'server.js')
    .map((f) => `js/${f}`);
  return [...raiz, ...js];
}

/** Kbps del primer fotograma MPEG-1 Capa III del fichero (salta la etiqueta ID3v2 si la hay). */
function kbpsDelPrimerFotograma(buf) {
  let i = 0;
  if (buf.subarray(0, 3).toString('latin1') === 'ID3') {
    i = 10 + (((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f));
  }
  const TABLA = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
  for (; i + 4 < buf.length; i++) {
    if (buf[i] === 0xff && (buf[i + 1] & 0xe0) === 0xe0) {
      const version = (buf[i + 1] >> 3) & 3; // 3 = MPEG-1
      const capa = (buf[i + 1] >> 1) & 3; // 1 = Capa III
      const indice = buf[i + 2] >> 4;
      if (version === 3 && capa === 1 && indice > 0 && indice < 15) return TABLA[indice];
    }
  }
  return null;
}

const FICHEROS_DEL_MODULO = [...leer('js/efectos-sonido.js').matchAll(/'\.\.\/audios-efectos\/([^']+\.mp3)'/g)].map((m) => m[1]).sort();

test.describe('EF — los efectos de sonido: ficheros y volumen', () => {
  test('EF-1. audios-efectos/ tiene exactamente los ficheros que nombra el módulo', () => {
    expect(FICHEROS_DEL_MODULO.length, 'el módulo nombra cuatro efectos').toBe(4);
    const enDisco = fs.readdirSync(path.join(RAIZ, 'audios-efectos')).filter((f) => f.endsWith('.mp3')).sort();
    expect(enDisco).toEqual(FICHEROS_DEL_MODULO);
  });

  test('EF-2. Cada MP3 es MPEG-1 Capa III a 128 kbps', () => {
    for (const f of FICHEROS_DEL_MODULO) {
      const kbps = kbpsDelPrimerFotograma(fs.readFileSync(path.join(RAIZ, 'audios-efectos', f)));
      expect(kbps, `${f}: kbps del primer fotograma`).toBe(128);
    }
  });

  test('EF-3. sw.js precarga el módulo y los cuatro MP3 en APP_SHELL', () => {
    const sw = leer('sw.js');
    const inicio = sw.indexOf('const APP_SHELL = [');
    const fin = sw.indexOf('];', inicio);
    expect(inicio).toBeGreaterThan(-1);
    const lista = sw.slice(inicio, fin);
    expect(lista).toContain("'/js/efectos-sonido.js'");
    for (const f of FICHEROS_DEL_MODULO) expect(lista, f).toContain(`'/audios-efectos/${f}'`);
  });

  test('EF-4. Ninguna fuente de sonido externa, ni .ogg, y `new Audio(` solo vive en el módulo', () => {
    const conAudio = [];
    for (const rel of ficherosDeProduccion()) {
      const t = leer(rel);
      expect(t, `${rel}: sin sonidos de actions.google.com`).not.toContain('actions.google.com');
      expect(/\.ogg\b/i.test(t), `${rel}: sin ficheros .ogg`).toBe(false);
      if (t.includes('new Audio(')) conAudio.push(rel);
    }
    expect(conAudio).toEqual(['js/efectos-sonido.js']);
  });

  test('EF-5. Nadie fija volume a otra cosa que 1, y muted solo lo toca video-intro.html', () => {
    for (const rel of ficherosDeProduccion()) {
      const t = leer(rel);
      for (const m of t.matchAll(/\.volume\s*=\s*([^;\n]+)/g)) {
        expect(m[1].trim(), `${rel}: .volume = ${m[1].trim()}`).toBe('1');
      }
      if (rel !== 'video-intro.html') {
        expect(/\.muted\s*=/.test(t), `${rel}: no toca .muted`).toBe(false);
        expect(/<(audio|video)\b[^>]*\bmuted\b/i.test(t), `${rel}: ninguna etiqueta <audio>/<video> con muted`).toBe(false);
      }
    }
  });

  test('EF-6. El reproductor de narración de hijo3 arranca con volume 1 y sin silenciar', async ({ page }) => {
    const hijo = await abrirHijoEnMarco(page, 'audio-hijo3.html');
    const estado = await hijo.evaluate(() => {
      const a = document.getElementById('audioPlayer');
      return { existe: !!a, volume: a?.volume, muted: a?.muted };
    });
    expect(estado).toEqual({ existe: true, volume: 1, muted: false });
  });
});
