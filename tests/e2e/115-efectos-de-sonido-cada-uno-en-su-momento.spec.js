/**
 * 115-efectos-de-sonido-cada-uno-en-su-momento.spec.js
 *
 * Los cuatro efectos de sonido (audios-efectos/, js/efectos-sonido.js) suenan cuando toca y
 * solo entonces. Nada se oye en un test: se espía `HTMLMediaElement.prototype.play`/`pause`
 * en todos los frames y se apunta, en el marco de arriba, qué fichero pidió cada uno.
 *
 *   PZ-S1  una pieza bien colocada suena pieza_colocada, una vez
 *   PZ-S2  una pieza soltada lejos de su sitio no suena
 *   PZ-S3  puzzle completado a tiempo: nueve piezas y un reto_completado, en ese orden
 *   PZ-S4  ⏩ del puzzle (válido y roto): reto_completado y ninguna pieza_colocada
 *   PZ-S5  se acaba el tiempo del puzzle: tiempo_acabado y ningún reto_completado
 *   PZ-S6  ocultar el iframe del puzzle corta el efecto en curso
 *   PZ-S6b ocultar un contenedor del documento que aloja al puzzle (la pantalla de la selección) corta el efecto
 *   PZ-S6c ocultar el iframe que aloja a ese documento (el padre con hijo4) corta el efecto
 *
 *   RT-S1  cada pulsación sobre una opción suena eleccion_respuesta_reto (opción única)
 *   RT-S2  ídem en opción múltiple, también al desmarcar
 *   RT-S3  respuesta incorrecta: tiempo_acabado (tras el sonido de la pulsación)
 *   RT-S4  respuesta correcta (opción, opción múltiple, texto): reto_completado; el texto no
 *          suena al escribir
 *   RT-S5  ⏩ del reto: reto_completado y ninguna eleccion_respuesta_reto
 *   RT-S6  «Siguiente» corta el efecto en el acto; RETO.LIMPIAR_ESTADO también
 *   RT-S7  puzzle dentro de hijo4: lo reproduce el puzzle y hijo4 no lo repite
 *
 *   TA-1   tiempo agotado por ventana de compra superada con la app cerrada: tiempo_acabado
 *   TA-2   AVENTURA.TIEMPO_AGOTADO (temporizador de hijo1): tiempo_acabado
 *   TA-3   sesión reanudable: no suena nada
 *
 * Todo suena al máximo: cada `play()` espiado lleva `volume` 1 y `muted` false.
 */
'use strict';

const { test, expect } = require('@playwright/test');
const path = require('path');
const {
  MARCO_VACIO, abrirHijoEnMarco, enviarAlHijo,
  injectInitSpy, stubCDNResources, gotoAndWaitForFase1,
} = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');
const IMAGEN = encodeURIComponent('imagenes/imagenes-aplicación/logo-luna.png');

/**
 * Espía `play`/`pause` de todos los frames. Los efectos se reconocen por el nombre del fichero
 * (`sonido_*.mp3`); cualquier otro audio de la página ni se apunta.
 *
 * `azarCero` (solo puzzle.html): `Math.random` devuelve 0 y las nueve piezas arrancan apiladas
 * en la esquina, así que el test sabe dónde está cada una sin leer el estado del módulo.
 * `relojRapido` (solo puzzle.html): el temporizador del puzzle —el único `setInterval` de 1000 ms
 * creado desde puzzle.html— corre a 1 ms, y los 180 s del puzzle pasan en un instante sin tocar
 * los intervalos del bus.
 */
async function espiarSonidos(page, opciones = {}) {
  await page.addInitScript((op) => {
    const raiz = globalThis.top;
    if (globalThis === raiz) raiz.__sonidos = [];
    const registrar = (accion, el) => {
      const fichero = (el.src || '').split('/').pop();
      if (!fichero.startsWith('sonido_')) return;
      raiz.__sonidos.push({
        accion,
        efecto: fichero.replace(/^sonido_/, '').replace(/\.mp3$/, ''),
        volume: el.volume,
        muted: el.muted,
        frame: globalThis.location.pathname.split('/').pop(),
      });
    };
    // El desbloqueo de iOS (js/efectos-sonido.js) arranca y para cada reproductor con `_desbloqueando` puesto:
    // se apunta aparte y no cuenta como sonido.
    HTMLMediaElement.prototype.play = function () { registrar(this._desbloqueando ? 'desbloqueo' : 'play', this); return Promise.resolve(); };
    HTMLMediaElement.prototype.pause = function () { if (!this._desbloqueando) registrar('pause', this); };

    // Firefox ejecuta este script en el iframe cuando todavía está en blanco (`location.href` vale ''), antes de que cargue el puzzle:
    // el filtro por URL no lo reconocería y `azarCero` y `relojRapido` no se aplicarían. En blanco, el único marco que no es la ventana
    // de arriba es el que abre `abrirHijoEnMarco`.
    const enBlanco = globalThis !== raiz && ['', 'about:blank'].includes(globalThis.location.href);
    if (enBlanco || globalThis.location.pathname.endsWith('/puzzle.html')) {
      if (op.azarCero) Math.random = () => 0;
      if (op.relojRapido) {
        const original = globalThis.setInterval.bind(globalThis);
        // El PRIMER frame de la pila con una URL real es el llamador inmediato: el envoltorio de este
        // espía no tiene URL, y el latido del bus (que también es de 1000 ms) nace en mensajeria.js.
        const esDelPuzzle = () => (new Error().stack.split('\n').find((l) => l.includes('http')) || '').includes('puzzle.html');
        globalThis.setInterval = (fn, ms, ...resto) =>
          original(fn, ms === 1000 && esDelPuzzle() ? 1 : ms, ...resto);
      }
    }
  }, opciones);
}

const registro = (page) => page.evaluate(() => globalThis.__sonidos || []);

// Todo suena al máximo, en cualquiera de los casos de este fichero.
test.afterEach(async ({ page }) => {
  const jugadas = await registro(page).catch(() => []);
  expect(jugadas.filter((s) => s.accion === 'play' && (s.volume !== 1 || s.muted !== false)), 'ningún efecto baja el volumen ni se silencia').toEqual([]);
});
const reproducidos = async (page) => (await registro(page)).filter((s) => s.accion === 'play').map((s) => s.efecto);
const pausas = async (page, efecto) => (await registro(page)).filter((s) => s.accion === 'pause' && s.efecto === efecto).length;

// ─────────────────────────────────────────────────────────────────────────────────────────
// Puzzle
// ─────────────────────────────────────────────────────────────────────────────────────────

// Listo = las piezas están dibujadas: el cronómetro ya trae un valor desde el HTML y no prueba nada.
const esperarPiezasDibujadas = (puzzle) => puzzle.waitForFunction(() => {
  const c = document.getElementById('puzzleCanvas');
  try { return c.width > 0 && c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some((v) => v !== 0); } catch (_e) { return false; }
}, null, { timeout: 15_000 });

const abrirPuzzle = async (page, query = `id=PZ-intro&imagen=${IMAGEN}`) => {
  const puzzle = await abrirHijoEnMarco(page, `puzzle.html?${query}`, { esperarPreparado: false });
  await esperarPiezasDibujadas(puzzle);
  return puzzle;
};

/**
 * El puzzle como lo aloja la aplicación, un nivel por debajo del marco (`#aloja-puzzle` es lo que se oculta):
 *   'contenedor'  dentro de un <div> del marco, como la pantalla de la selección;
 *   'iframe'      dentro de un iframe del marco, como el padre aloja a hijo4, que a su vez aloja al puzzle.
 * PZ-S6 oculta el iframe del propio puzzle; estos dos ocultan lo que lo aloja.
 */
const abrirPuzzleAlojado = async (page, aloja) => {
  await page.goto(MARCO_VACIO);
  const src = `/puzzle.html?id=PZ-intro&imagen=${IMAGEN}`;
  await page.evaluate(({ src, aloja }) => {
    const caja = 'width:100vw;height:100vh;border:0;display:block;';
    const html = `<iframe id="marco-puzzle" src="${src}" style="${caja}"></iframe>`;
    if (aloja === 'contenedor') {
      document.body.insertAdjacentHTML('beforeend', `<div id="aloja-puzzle" style="${caja}">${html}</div>`);
    } else {
      const iframe = document.createElement('iframe');
      iframe.id = 'aloja-puzzle';
      iframe.style.cssText = caja;
      iframe.srcdoc = `<body style="margin:0">${html}</body>`;
      document.body.appendChild(iframe);
    }
  }, { src, aloja });
  await expect.poll(() => page.frames().some((f) => f.url().includes('puzzle.html')), { timeout: 15_000 }).toBe(true);
  const puzzle = page.frames().find((f) => f.url().includes('puzzle.html'));
  await esperarPiezasDibujadas(puzzle);
  return puzzle;
};

/**
 * Arrastra la pieza `i` (0..8, en filas de 3) a su sitio. Con `azarCero` todas arrancan en la
 * esquina (0,0) y `onPointerDown` coge la última sin colocar, así que las piezas salen por
 * orden descendente: 8, 7, … 0.
 */
async function arrastrarPieza(page, puzzle, i, { aSuSitio = true } = {}) {
  const { w, h } = await puzzle.evaluate(() => {
    const c = document.getElementById('puzzleCanvas');
    return { w: c.width, h: c.height };
  });
  const caja = await puzzle.locator('#puzzleCanvas').boundingBox();
  expect(Math.abs(caja.width - w), 'el canvas se mide 1:1 con su tamaño CSS').toBeLessThan(1.5);
  const pw = w / 3;
  const ph = h / 3;
  const fila = Math.floor(i / 3);
  const col = i % 3;
  // Lejos de su sitio: el centro del tablero, a más de un cuarto de pieza de cualquier casilla de las esquinas.
  const destinoX = aSuSitio ? col * pw : pw;
  const destinoY = aSuSitio ? fila * ph : ph;
  await page.mouse.move(caja.x + 1, caja.y + 1);
  await page.mouse.down();
  await page.mouse.move(caja.x + destinoX + 1, caja.y + destinoY + 1, { steps: 4 });
  await page.mouse.up();
}

test.describe('PZ-S — puzzle.html: cada efecto en su momento', () => {
  test('PZ-S1. Una pieza bien colocada suena pieza_colocada, una vez', async ({ page }) => {
    await espiarSonidos(page, { azarCero: true });
    const puzzle = await abrirPuzzle(page);
    await arrastrarPieza(page, puzzle, 8);
    await expect.poll(() => reproducidos(page)).toEqual(['pieza_colocada']);
    const [jugada] = (await registro(page)).filter((s) => s.accion === 'play');
    expect(jugada.frame).toBe('puzzle.html');
    expect(jugada.volume, 'siempre al máximo').toBe(1);
    expect(jugada.muted).toBe(false);
  });

  test('PZ-S2. Una pieza soltada lejos de su sitio no suena', async ({ page }) => {
    await espiarSonidos(page, { azarCero: true });
    const puzzle = await abrirPuzzle(page);
    await arrastrarPieza(page, puzzle, 8, { aSuSitio: false });
    // La pieza 8 es la del rincón inferior derecho: soltarla en el centro la deja sin colocar.
    // Control del mismo gesto: la siguiente que se coge en la esquina es la 7, y bien puesta sí suena.
    // Que suene UNA sola vez prueba que el arrastre anterior no sonó.
    await arrastrarPieza(page, puzzle, 7);
    await expect.poll(() => reproducidos(page)).toEqual(['pieza_colocada']);
  });

  test('PZ-S3. Puzzle completado a tiempo: nueve piezas y un reto_completado, en ese orden', async ({ page }) => {
    await espiarSonidos(page, { azarCero: true });
    const puzzle = await abrirPuzzle(page);
    for (let i = 8; i >= 0; i--) await arrastrarPieza(page, puzzle, i);
    await expect.poll(async () => (await reproducidos(page)).length).toBe(10);
    expect(await reproducidos(page)).toEqual([...Array(9).fill('pieza_colocada'), 'reto_completado']);
    expect((await registro(page)).every((s) => s.volume === 1 && s.muted === false), 'siempre al máximo').toBe(true);
  });

  test('PZ-S4a. ⏩ del puzzle: reto_completado y ninguna pieza_colocada', async ({ page }) => {
    await espiarSonidos(page);
    const puzzle = await abrirPuzzle(page);
    await puzzle.click('#skipBtn');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
  });

  test('PZ-S4b. ⏩ de un puzzle roto: también reto_completado', async ({ page }) => {
    await espiarSonidos(page);
    const puzzle = await abrirHijoEnMarco(page, 'puzzle.html?id=PZ-NO-EXISTE', { esperarPreparado: false });
    await expect(puzzle.locator('#errorMsg')).toBeVisible();
    await puzzle.click('#skipBtn');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
  });

  test('PZ-S5. Se acaba el tiempo: tiempo_acabado y ningún reto_completado', async ({ page }) => {
    await espiarSonidos(page, { relojRapido: true });
    // Sin esperar a las piezas: el puzzle puede terminar antes de que se mire.
    await abrirHijoEnMarco(page, `puzzle.html?id=PZ-intro&imagen=${IMAGEN}`, { esperarPreparado: false });
    await expect.poll(() => reproducidos(page), { timeout: 20_000 }).toEqual(['tiempo_acabado']);
    // Un rato más: el reloj sigue corriendo a 1 ms y nada más debe sonar.
    await page.waitForTimeout(500); // VENTANA-OBSERVACION: comprobar que NO llega nada más
    expect(await reproducidos(page)).toEqual(['tiempo_acabado']);
  });

  test('PZ-S6. Ocultar el iframe del puzzle corta el efecto en curso', async ({ page }) => {
    await espiarSonidos(page);
    const puzzle = await abrirPuzzle(page);
    await puzzle.click('#skipBtn');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
    const antes = await pausas(page, 'reto_completado');
    await page.evaluate(() => { document.getElementById('marco-hijo').style.display = 'none'; });
    await expect.poll(() => pausas(page, 'reto_completado'), { timeout: 10_000 }).toBeGreaterThan(antes);
  });

  test('PZ-S6b. Ocultar un contenedor del documento que aloja al puzzle corta el efecto en curso', async ({ page }) => {
    await espiarSonidos(page);
    const puzzle = await abrirPuzzleAlojado(page, 'contenedor');
    await puzzle.click('#skipBtn');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
    const antes = await pausas(page, 'reto_completado');
    await page.evaluate(() => { document.getElementById('aloja-puzzle').style.display = 'none'; });
    await expect.poll(() => pausas(page, 'reto_completado'), { timeout: 10_000 }).toBeGreaterThan(antes);
  });

  test('PZ-S6c. Ocultar el iframe que aloja al puzzle corta el efecto en curso', async ({ page }) => {
    await espiarSonidos(page);
    const puzzle = await abrirPuzzleAlojado(page, 'iframe');
    await puzzle.click('#skipBtn');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
    const antes = await pausas(page, 'reto_completado');
    await page.evaluate(() => { document.getElementById('aloja-puzzle').style.display = 'none'; });
    await expect.poll(() => pausas(page, 'reto_completado'), { timeout: 10_000 }).toBeGreaterThan(antes);
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────
// Retos (hijo4)
// ─────────────────────────────────────────────────────────────────────────────────────────

async function mostrarReto(page, hijo, reto, selectorEspera) {
  for (let intento = 0; intento < 10; intento++) {
    await enviarAlHijo(page, { tipo: 'RETO.MOSTRAR', origen: 'padre', destino: 'hijo4', datos: { retoId: reto.id, retosArray: [reto] } });
    try {
      await hijo.waitForSelector(selectorEspera, { timeout: 1000 });
      return;
    } catch (_e) { /* reintentar */ } // NOSONAR
  }
  await hijo.waitForSelector(selectorEspera, { timeout: 5000 });
}

const RETO_OPCION = { id: 'rt-s-opcion', tipo: 'opcion', pregunta: '¿Test?', opciones: ['A', 'B', 'C'], correctas: ['B'] };
const RETO_MULTIPLE = { id: 'rt-s-multiple', tipo: 'opcion-multiple', multiple: true, pregunta: '¿Test?', opciones: ['A', 'B', 'C'], correctas: ['A', 'C'] };
const RETO_TEXTO = { id: 'rt-s-texto', tipo: 'texto', pregunta: '¿Test?', correctas: ['lo que sea'] };
const RETO_PUZZLE = { id: 'PZ-01', tipo: 'puzzle', src: 'puzzle.html?id=PZ-01', imagenPuzzle: 'imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg' };

const enviar = (hijo) => hijo.locator('button.btn', { hasText: '🫵' });

async function abrirReto(page, reto, selector) {
  await espiarSonidos(page);
  const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
  await mostrarReto(page, hijo, reto, selector);
  return hijo;
}

test.describe('RT-S — retos-hijo4.html: cada efecto en su momento', () => {
  test('RT-S1. Cada pulsación sobre una opción suena eleccion_respuesta_reto (opción única)', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#opcion0');
    await hijo.click('#opcion1');
    await hijo.click('#opcion1'); // repetir la opción ya elegida también es una pulsación
    await expect.poll(() => reproducidos(page)).toEqual(['eleccion_respuesta_reto', 'eleccion_respuesta_reto', 'eleccion_respuesta_reto']);
    expect((await registro(page)).every((s) => s.frame === 'retos-hijo4.html' && s.volume === 1 && s.muted === false)).toBe(true);
  });

  test('RT-S2. Opción múltiple: suena en cada pulsación, también al desmarcar', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_MULTIPLE, 'input[name="op"]');
    await hijo.click('#opcion0');
    await hijo.click('#opcion0'); // desmarcar
    await hijo.click('#opcion2');
    await expect.poll(() => reproducidos(page)).toEqual(['eleccion_respuesta_reto', 'eleccion_respuesta_reto', 'eleccion_respuesta_reto']);
  });

  test('RT-S3. Respuesta incorrecta: tiempo_acabado, tras el sonido de la pulsación', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#opcion0'); // A: incorrecta
    await enviar(hijo).click();
    await expect.poll(() => reproducidos(page)).toEqual(['eleccion_respuesta_reto', 'tiempo_acabado']);
  });

  test('RT-S4a. Opción única correcta: reto_completado', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#opcion1');
    await enviar(hijo).click();
    await expect.poll(() => reproducidos(page)).toEqual(['eleccion_respuesta_reto', 'reto_completado']);
  });

  test('RT-S4b. Opción múltiple correcta: reto_completado', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_MULTIPLE, 'input[name="op"]');
    await hijo.click('#opcion0');
    await hijo.click('#opcion2');
    await enviar(hijo).click();
    await expect.poll(() => reproducidos(page)).toEqual(['eleccion_respuesta_reto', 'eleccion_respuesta_reto', 'reto_completado']);
  });

  test('RT-S4c. Texto: no suena al escribir y reto_completado al enviar', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_TEXTO, '#respuestaTexto');
    await hijo.fill('#respuestaTexto', 'una respuesta cualquiera');
    expect(await reproducidos(page), 'escribir no es elegir una opción').toEqual([]);
    await enviar(hijo).click();
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
  });

  test('RT-S5. ⏩ del reto: reto_completado y ninguna eleccion_respuesta_reto', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#btnSaltarReto');
    await expect(hijo.locator('input[name="op"][value="B"]')).toBeChecked();
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
  });

  test('RT-S6a. «Siguiente» corta el efecto en el acto', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#btnSaltarReto');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
    const antes = await pausas(page, 'reto_completado');
    await hijo.click('#btnNextAfterReto');
    // El marco no contesta con RETO.LIMPIAR_ESTADO: el corte sale del propio clic.
    await expect.poll(() => pausas(page, 'reto_completado')).toBeGreaterThan(antes);
  });

  test('RT-S6b. RETO.LIMPIAR_ESTADO (cualquier otro cierre de la ventana) también lo corta', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#btnSaltarReto');
    await expect.poll(() => reproducidos(page)).toEqual(['reto_completado']);
    const antes = await pausas(page, 'reto_completado');
    await enviarAlHijo(page, { tipo: 'RETO.LIMPIAR_ESTADO', origen: 'padre', destino: 'hijo4', datos: { retoId: RETO_OPCION.id, retoSigueActivo: true } });
    await expect.poll(() => pausas(page, 'reto_completado')).toBeGreaterThan(antes);
  });

  test('RT-S7. Puzzle dentro de hijo4: lo reproduce el puzzle y hijo4 no lo repite', async ({ page }) => {
    await espiarSonidos(page);
    const hijo = await abrirHijoEnMarco(page, 'retos-hijo4.html');
    await mostrarReto(page, hijo, RETO_PUZZLE, '#puzzleIframe');
    await hijo.frameLocator('#puzzleIframe').locator('#skipBtn').click({ timeout: 15_000 });
    await expect(hijo.locator('#btn-puzzle-continuar')).toBeVisible({ timeout: 15_000 });
    const jugadas = (await registro(page)).filter((s) => s.accion === 'play');
    expect(jugadas.map((s) => `${s.frame}:${s.efecto}`)).toEqual(['puzzle.html:reto_completado']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────
// Desbloqueo de iOS: el primer gesto desbloquea los reproductores, una vez
// ─────────────────────────────────────────────────────────────────────────────────────────

const desbloqueados = async (page) => (await registro(page)).filter((s) => s.accion === 'desbloqueo').map((s) => s.efecto).sort();

test.describe('DB — el primer gesto desbloquea los reproductores (iOS)', () => {
  test('DB-1. Puzzle: nada antes del gesto; al primer gesto sus tres efectos, una vez, y antes del sonido que provoca', async ({ page }) => {
    await espiarSonidos(page, { azarCero: true });
    const puzzle = await abrirPuzzle(page);
    expect(await desbloqueados(page), 'sin gesto no se desbloquea nada').toEqual([]);
    await arrastrarPieza(page, puzzle, 8);
    await expect.poll(() => reproducidos(page)).toEqual(['pieza_colocada']);
    expect(await desbloqueados(page)).toEqual(['pieza_colocada', 'reto_completado', 'tiempo_acabado']);
    const orden = (await registro(page)).filter((s) => s.efecto === 'pieza_colocada').map((s) => s.accion);
    expect(orden, 'el desbloqueo de la pieza va antes de su sonido').toEqual(['desbloqueo', 'play']);
    await arrastrarPieza(page, puzzle, 7);
    await expect.poll(() => reproducidos(page)).toEqual(['pieza_colocada', 'pieza_colocada']);
    expect((await desbloqueados(page)).length, 'un segundo gesto no vuelve a desbloquear').toBe(3);
  });

  test('DB-2. hijo4: el primer clic desbloquea sus tres efectos, una vez', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    expect(await desbloqueados(page)).toEqual([]);
    await hijo.click('#opcion0');
    await expect.poll(() => reproducidos(page)).toEqual(['eleccion_respuesta_reto']);
    expect(await desbloqueados(page)).toEqual(['eleccion_respuesta_reto', 'reto_completado', 'tiempo_acabado']);
    await hijo.click('#opcion1');
    expect((await desbloqueados(page)).length).toBe(3);
  });

  test('DB-3. El desbloqueo no suena: ni un play ni un pause de los que cuenta el espía', async ({ page }) => {
    const hijo = await abrirReto(page, RETO_OPCION, 'input[name="op"]');
    await hijo.click('#opcion0');
    await expect.poll(async () => (await desbloqueados(page)).length).toBe(3);
    expect(await reproducidos(page), 'solo suena la pulsación').toEqual(['eleccion_respuesta_reto']);
    expect(await pausas(page, 'reto_completado') + await pausas(page, 'tiempo_acabado') + await pausas(page, 'eleccion_respuesta_reto'), 'el desbloqueo no cuenta como corte').toBe(0);
  });

  test('DB-4. Padre: su reproductor de tiempo_acabado existe desde el arranque y el primer gesto lo desbloquea', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await espiarSonidos(page);
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    expect(await desbloqueados(page), 'sin gesto no se desbloquea nada').toEqual([]);
    await page.mouse.click(5, 5);
    await expect.poll(() => desbloqueados(page)).toEqual(['tiempo_acabado']);
    await page.mouse.click(6, 6);
    expect(await desbloqueados(page), 'un segundo gesto no vuelve a desbloquear').toEqual(['tiempo_acabado']);
    expect(await reproducidos(page), 'desbloquear no suena').toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────
// Padre: tiempo agotado
// ─────────────────────────────────────────────────────────────────────────────────────────

const HORA_MS = 60 * 60 * 1000;

test.describe('TA — codigo-padre.html: el modal de tiempo agotado suena tiempo_acabado', () => {
  async function arrancar(page, context, edadHoras) {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 39.47876, longitude: -0.37626 });
    await page.addInitScript({ path: MAPLIBRE_STUB });
    if (edadHoras !== null) {
      await page.addInitScript(([edad, hora]) => {
        try {
          localStorage.setItem('vv_aventura_iniciada', JSON.stringify({
            aventura: 'Aventura1', idioma: 'es', modo: 'aventura', dev: false,
            timestamp: Date.now() - (edad * hora),
          }));
        } catch (_e) { /* almacenamiento no disponible: el test lo detectará */ }
      }, [edadHoras, HORA_MS]);
    }
    await espiarSonidos(page);
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
  }

  const salioAlgunDialogo = (page) => page.waitForFunction(
    () => !!document.getElementById('modal-tiempo-agotado') || !!document.getElementById('dialogo-reanudacion-overlay'),
    null, { timeout: 45_000 },
  );

  test('TA-1. Ventana de compra superada con la app cerrada (61 h de 60 h): suena tiempo_acabado', async ({ page, context }) => {
    await arrancar(page, context, 61);
    await salioAlgunDialogo(page);
    await expect(page.locator('#modal-tiempo-agotado')).toBeVisible();
    await expect.poll(() => reproducidos(page)).toEqual(['tiempo_acabado']);
    const [jugada] = (await registro(page)).filter((s) => s.accion === 'play');
    expect(jugada.frame).toBe('codigo-padre.html');
    expect(jugada.volume, 'siempre al máximo').toBe(1);
  });

  test('TA-2. AVENTURA.TIEMPO_AGOTADO (el temporizador de hijo1): suena tiempo_acabado', async ({ page, context }) => {
    await arrancar(page, context, null);
    await page.waitForFunction(
      () => typeof globalThis.mostrarModalTiempoAgotado === 'function' && !!globalThis.estado,
      null, { timeout: 30_000 },
    );
    expect(await reproducidos(page), 'antes del aviso no suena nada').toEqual([]);
    await page.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'AVENTURA.TIEMPO_AGOTADO', datos: {} }));
    await expect(page.locator('#modal-tiempo-agotado')).toBeVisible();
    await expect.poll(() => reproducidos(page)).toEqual(['tiempo_acabado']);
  });

  test('TA-3. Una sesión reanudable (2 h) no suena nada', async ({ page, context }) => {
    await arrancar(page, context, 2);
    await salioAlgunDialogo(page);
    await expect(page.locator('#dialogo-reanudacion-overlay')).toBeVisible();
    await page.waitForTimeout(500); // VENTANA-OBSERVACION: comprobar que NO llega nada
    expect(await reproducidos(page)).toEqual([]);
  });
});
