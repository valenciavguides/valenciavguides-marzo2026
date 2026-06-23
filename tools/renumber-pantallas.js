#!/usr/bin/env node
'use strict';
/**
 * renumber-pantallas.js
 * Aplica el renombrado completo P1-P17 + integración video-intro.html
 * en En-busca-del-Tesoro.html.
 * Ejecutar desde la raíz del proyecto: node tools/renumber-pantallas.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'En-busca-del-Tesoro.html');
let html = fs.readFileSync(FILE, 'utf8');

// Normalizar CRLF → LF para que los literales \n funcionen en cualquier plataforma
const CRLF = html.includes('\r\n');
if (CRLF) html = html.replace(/\r\n/g, '\n');

let ok = 0;
let fail = 0;

function replace(from, to, label) {
  if (!html.includes(from)) {
    console.error(`  ❌ NO ENCONTRADO: ${label}`);
    fail++;
    return false;
  }
  html = html.split(from).join(to);
  console.log(`  ✅ ${label}`);
  ok++;
  return true;
}

// ═══════════════════════════════════════════════════════════════════
// PASS 1 — Renombrar IDs de pantalla (2 pasos para evitar ciclos)
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 1: IDs ─────────────────────────────────────────');

const RENAMES = [
  { from: 'pantalla4',  temp: 'PTMP_A', to: 'pantalla5'  }, // En Busca  → P5
  { from: 'pantalla5',  temp: 'PTMP_B', to: 'pantalla10' }, // Términos  → P10
  { from: 'pantalla6',  temp: 'PTMP_C', to: 'pantalla7'  }, // Elección  → P7
  { from: 'pantalla7',  temp: 'PTMP_D', to: 'pantalla9'  }, // Confirmac → P9
  { from: 'pantalla8',  temp: 'PTMP_E', to: 'pantalla4'  }, // Video     → P4
  { from: 'pantalla9',  temp: 'PTMP_F', to: 'pantalla6'  }, // Puzzle    → P6
  { from: 'pantalla10', temp: 'PTMP_G', to: 'pantalla11' }, // Audio     → P11
  { from: 'pantalla11', temp: 'PTMP_H', to: 'pantalla8'  }, // Reto R-1  → P8
  { from: 'pantalla16', temp: 'PTMP_I', to: 'pantalla17' }, // Agradecim → P17
];

for (const { from, temp } of RENAMES) html = html.split(from).join(temp);
for (const { temp, to }   of RENAMES) html = html.split(temp).join(to);
console.log('  ✅ IDs renombrados (9 cambios, 2-step sin ciclos)');
ok++;

// ═══════════════════════════════════════════════════════════════════
// PASS 2 — Contenido de P4: stub de vídeo → contenedor iframe
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 2: P4 contenido ────────────────────────────────');

replace(
`  <div class="pantalla" id="pantalla4">
    <div class="free-demo">FREE DEMO</div>
    <div style="position:relative; width:98vw; height:calc(96vh - var(--gap-superior) - env(safe-area-inset-bottom,0px)); background:#000; border:0.3125rem solid #00ff00; border-radius:0.9375rem; box-shadow:0 0.375rem 1.25rem rgba(0,0,0,0.3); overflow:hidden; display:flex; justify-content:center; align-items:center;">
      <video id="video-intro-player" controls preload="metadata" muted style="width:100%; height:100%; object-fit:contain; display:none;">
        <source id="video-intro-source" src="" type="video/mp4">
        <track kind="descriptions" src="" default label="Descripción visual">
        Tu navegador no soporta el elemento video.
      </video>
      <div id="video-intro-placeholder" style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; gap:1rem;">
        <div style="font-size:5rem; opacity:0.3;">🎬</div>
        <p style="color:#999; font-size:1.1rem; text-align:center; margin:0; padding:0 1rem;">Video introductorio próximamente</p>
      </div>
    </div>
    <button class="btn btn-mundo-verde" onclick="void mostrar(9)" title="Siguiente" style="margin-top:1rem;">
      <div class="contenedor-flecha"><span class="flecha-v">➣</span></div>
      <div class="contenedor-flecha segunda"><span class="flecha-v">➣</span></div>
    </button>
  </div>`,
`  <!-- P4: Video intro — video-intro.html en iframe (postMessage SELECCION.VIDEO_INTRO_TERMINADO → mostrar(5)) -->
  <div class="pantalla" id="pantalla4" style="padding:0; overflow:hidden;">
    <div id="video-intro-container" style="width:100%;height:100%;"></div>
  </div>`,
  'P4: stub vídeo → contenedor iframe'
);

// ═══════════════════════════════════════════════════════════════════
// PASS 3 — Botones HTML inline
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 3: Botones HTML ────────────────────────────────');

// P5 (En Busca) → P6 (Puzzle)
replace(
  'id="en-busca-imagen" src="" alt="" style="width:min(97vw, 400px); margin-top:1rem;">\n    <button class="btn btn-mundo-verde" onclick="void mostrar(5)"',
  'id="en-busca-imagen" src="" alt="" style="width:min(97vw, 400px); margin-top:1rem;">\n    <button class="btn btn-mundo-verde" onclick="void mostrar(6)"',
  'P5 (En Busca) botón: mostrar(5) → mostrar(6)'
);

// P9 (Confirmación) NO → P7 (Elección)
replace(
  'onclick="void mostrar(6)" title="No, cambiar"',
  'onclick="void mostrar(7)" title="No, cambiar"',
  'P9 (Confirmación) NO: mostrar(6) → mostrar(7)'
);

// P11 (Audio) → P12 (Pago)
replace(
  'onclick="void mostrar(11)" title="Siguiente" style="align-self:center; flex-shrink:0; margin-right:7.5vw; margin-top:0;"',
  'onclick="void mostrar(12)" title="Siguiente" style="align-self:center; flex-shrink:0; margin-right:7.5vw; margin-top:0;"',
  'P11 (Audio) botón: mostrar(11) → mostrar(12)'
);

// ═══════════════════════════════════════════════════════════════════
// PASS 4 — Funciones JS
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 4: JS funciones ────────────────────────────────');

// 4a. _ACCION_PANTALLA completo
replace(
`    const _ACCION_PANTALLA = {
      5:  () => { if (!terminosCargados) void cargarTerminos(); },
      6:  () => void cargarAventurasDinamicamente(),
      8:  () => cargarVideoIntro(),
      9:  () => { void cargarPuzzle(); notificarPadrePreparacion(); },
      10: () => { if (!audioCargado) { void cargarAudioIntro(); } if (!textoCargado) { void cargarTextoIntro(); } },
      11: () => { if (!retoCargadoR1) void cargarRetoR1(); },
      14: () => _accionPantalla15(),
      15: () => { if (!retoCargadoR2) void cargarRetoR2(); },
      16: () => _accionPantalla5(),
    };`,
`    const _ACCION_PANTALLA = {
      4:  () => cargarVideoIntroIframe(),
      6:  () => void cargarPuzzle(),
      7:  () => void cargarAventurasDinamicamente(),
      8:  () => { if (!retoCargadoR1) void cargarRetoR1(); },
      10: () => { if (!terminosCargados) void cargarTerminos(); },
      11: () => { if (!audioCargado) { void cargarAudioIntro(); } if (!textoCargado) { void cargarTextoIntro(); } },
      14: () => _accionPantalla15(),
      15: () => { if (!retoCargadoR2) void cargarRetoR2(); },
      17: () => _accionPantalla5(),
    };`,
  '_ACCION_PANTALLA reescrito (P4 iframe, P6 puzzle, P7 elección, P8 R1, P10 terms, P11 audio, P17 agradec)'
);

// 4b. mostrar() guard: P9 → P6, sin notificarPadrePreparacion, P10 → P7
replace(
`    async function mostrar(id) {
      if (id === 9 && !await _verificarPuzzleMostrar()) {
        notificarPadrePreparacion();
        void mostrar(10);
        return;
      }`,
`    async function mostrar(id) {
      if (id === 6 && !await _verificarPuzzleMostrar()) {
        void mostrar(7);
        return;
      }`,
  'mostrar() guard: id=9→6, sin notificarPadrePreparacion, P10→P7'
);

// 4c. verificarRetoR1 SÍ: mostrar(12) → mostrar(9)
replace(
  'setTimeout(() => { void mostrar(12); }, 1500);',
  'setTimeout(() => { void mostrar(9); }, 1500);',
  'verificarRetoR1 SÍ: mostrar(12) → mostrar(9)'
);

// 4d. completarPuzzle: mostrar(10) → mostrar(7)
replace(
  'function completarPuzzle() {\n      void mostrar(10);\n    }',
  'function completarPuzzle() {\n      void mostrar(7);\n    }',
  'completarPuzzle: mostrar(10) → mostrar(7)'
);

// 4e. aceptarAgradecimientos else: mostrar(5) → mostrar(10)
replace(
  '        void mostrar(5);\n      }\n    }\n\n    async function _ejecutarDespedida()',
  '        void mostrar(10);\n      }\n    }\n\n    async function _ejecutarDespedida()',
  'aceptarAgradecimientos else: mostrar(5) → mostrar(10)'
);

// 4f. aceptarSinAudio: mostrar(8) → mostrar(10)
replace(
  "function aceptarSinAudio() {\n      document.getElementById('audio-warning-overlay').style.display = 'none';\n      void mostrar(8);\n    }",
  "function aceptarSinAudio() {\n      document.getElementById('audio-warning-overlay').style.display = 'none';\n      void mostrar(10);\n    }",
  'aceptarSinAudio: mostrar(8) → mostrar(10)'
);

// 4g. confirmarAventura: + notificarPadrePreparacion, mostrar(8) → mostrar(10)
replace(
  "    async function confirmarAventura() {\n      const idioma = idiomaSeleccionado || 'es';\n      const aventura = aventuraSeleccionada || 'Aventura1';\n      const hayAudios = await tieneAudiosDisponibles(aventura, idioma);\n      if (hayAudios) {\n        void mostrar(8);\n      } else {\n        mostrarAvisoSinAudio(idioma);\n      }\n    }",
  "    async function confirmarAventura() {\n      const idioma = idiomaSeleccionado || 'es';\n      const aventura = aventuraSeleccionada || 'Aventura1';\n      notificarPadrePreparacion();\n      const hayAudios = await tieneAudiosDisponibles(aventura, idioma);\n      if (hayAudios) {\n        void mostrar(10);\n      } else {\n        mostrarAvisoSinAudio(idioma);\n      }\n    }",
  'confirmarAventura: +notificarPadrePreparacion, mostrar(8) → mostrar(10)'
);

// 4h. cerrarMapaVintage: mostrar(7) → mostrar(8)
replace(
  '      void mostrar(7);\n    }\n\n    // ============================================================\n    // P10: CARGAR VIDEO INTRODUCTORIO\n    // ============================================================\n    function cargarVideoIntro() {\n      const video = document.getElementById(\'video-intro-player\');\n      const placeholder = document.getElementById(\'video-intro-placeholder\');\n      video.style.display = \'none\';\n      if (placeholder) placeholder.style.display = \'flex\';\n      _log.info(\'[SELECCION] Video intro: sin ruta, mostrando placeholder\');\n    }',
  '      void mostrar(8);\n    }\n\n    // ============================================================\n    // P4: CARGAR VIDEO INTRO (video-intro.html en iframe)\n    // ============================================================\n    function cargarVideoIntroIframe() {\n      const container = document.getElementById(\'video-intro-container\');\n      if (!container) return;\n      if (!container.querySelector(\'iframe\')) {\n        const iframe = document.createElement(\'iframe\');\n        iframe.src = \'video-intro.html\';\n        iframe.style.cssText = \'width:100%;height:100%;border:none;\';\n        iframe.title = \'Video intro\';\n        container.appendChild(iframe);\n      }\n    }',
  'cerrarMapaVintage: mostrar(7)→mostrar(8) + cargarVideoIntro→cargarVideoIntroIframe'
);

// 4i. verificarRetoR2 SÍ: _procesarAfirmativaR2() → mostrar(16)
replace(
  'setTimeout(() => { void _procesarAfirmativaR2(); }, 1500);',
  'setTimeout(() => { void mostrar(16); }, 1500);',
  'verificarRetoR2 SÍ: _procesarAfirmativaR2() → mostrar(16)'
);

// 4j. _checkUrlParams despedida: mostrar(16) → mostrar(17)
replace(
  'logger.info(`${logPrefix} Modo despedida activo → mostrando P16 agradecimientos (idioma: ${idiomaSeleccionado})`);\n            void mostrar(16);',
  'logger.info(`${logPrefix} Modo despedida activo → mostrando P17 agradecimientos (idioma: ${idiomaSeleccionado})`);\n            void mostrar(17);',
  '_checkUrlParams despedida: mostrar(16) → mostrar(17)'
);

// 4k. aceptarTerminos try: mostrar(6) → mostrar(11)
replace(
  '            // Navegar a selección de aventura\n            void mostrar(6);\n        } catch (error) {',
  '            // Navegar a audio intro\n            void mostrar(11);\n        } catch (error) {',
  'aceptarTerminos try: mostrar(6) → mostrar(11)'
);

// 4l. aceptarTerminos catch: mostrar(6) → mostrar(11)
replace(
  '            logger.error(`[SELECCION] Error aceptando términos:`, error);\n            void mostrar(6);',
  '            logger.error(`[SELECCION] Error aceptando términos:`, error);\n            void mostrar(11);',
  'aceptarTerminos catch: mostrar(6) → mostrar(11)'
);

// ═══════════════════════════════════════════════════════════════════
// PASS 5 — Nueva P16 (Logos) insertada después de P15
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 5: Nueva P16 Logos ─────────────────────────────');

replace(
  '  </div>\n\n  <!-- Overlay: Mapa vintage de la aventura',
  `  </div>

  <!-- P16: Logos — pantalla de transición hacia la aventura -->
  <div class="pantalla" id="pantalla16" style="background-color:orange; justify-content:center; align-items:center; gap:2rem;">
    <div class="free-demo">FREE DEMO</div>
    <img src="imagenes/imagenes-aplicación/logo-redondo.png" class="logo-redondo" alt="" style="width:min(55vw, 200px); height:min(55vw, 200px);">
    <img src="imagenes/imagenes-aplicación/logo_alargado_3.png" class="logo-alargado" alt="" style="width:min(85vw, 360px);">
    <button class="btn btn-mundo-verde" onclick="void iniciarAventura()" title="Comenzar aventura">
      <div class="contenedor-flecha"><span class="flecha-v">➣</span></div>
      <div class="contenedor-flecha segunda"><span class="flecha-v">➣</span></div>
    </button>
  </div>

  <!-- Overlay: Mapa vintage de la aventura`,
  'Insertar P16 (Logos) entre P15 y el overlay mapa vintage'
);

// ═══════════════════════════════════════════════════════════════════
// PASS 6 — Listener postMessage para VIDEO_INTRO_TERMINADO
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 6: postMessage listener ────────────────────────');

replace(
  `    globalThis.addEventListener('message', function(event) {
        if (event.origin !== globalThis.location.origin) return;
        if (event.data?.tipo === TIPOS_MENSAJE.NAVEGACION_PANTALLA && event.data?.datos?.pantalla) {
            logger.debug('📋 [SELECCION] NAVEGAR_PANTALLA recibido → pantalla', event.data.datos.pantalla);
            void mostrar(event.data.datos.pantalla);
        }
    });`,
  `    globalThis.addEventListener('message', function(event) {
        const origenOk = event.origin === globalThis.location.origin || event.origin === 'null';
        if (!origenOk) return;
        if (event.data?.tipo === 'SELECCION.VIDEO_INTRO_TERMINADO') {
            _log.info('[SELECCION][P4] video-intro terminado → mostrando P5');
            void mostrar(5);
            return;
        }
        if (event.data?.tipo === TIPOS_MENSAJE.NAVEGACION_PANTALLA && event.data?.datos?.pantalla) {
            logger.debug('📋 [SELECCION] NAVEGAR_PANTALLA recibido → pantalla', event.data.datos.pantalla);
            void mostrar(event.data.datos.pantalla);
        }
    });`,
  'Añadir handler VIDEO_INTRO_TERMINADO al listener de mensajes'
);

// ═══════════════════════════════════════════════════════════════════
// PASS 7 — Reordenado físico: P1→P2→…→P17 en el HTML
// ═══════════════════════════════════════════════════════════════════
console.log('\n── PASS 7: Reordenado físico ───────────────────────────');

function extraerBloquePantalla(html, id) {
  const idStr = `id="pantalla${id}"`;
  const markerPos = html.indexOf(idStr);
  if (markerPos === -1) return null;

  const divTagPos = html.lastIndexOf('<div', markerPos);

  // Encontrar el inicio de la línea que contiene el <div
  let lineStart = divTagPos;
  while (lineStart > 0 && html[lineStart - 1] !== '\n') lineStart--;
  // lineStart apunta al primer carácter de esa línea (los espacios de indentación)

  // Comprobar si la línea anterior es un comentario <!-- ... -->
  let blockStart = lineStart;
  if (lineStart > 1) {
    const prevLineEnd = lineStart - 1; // la \n que separa la línea anterior
    let prevLineStart = prevLineEnd;
    while (prevLineStart > 0 && html[prevLineStart - 1] !== '\n') prevLineStart--;
    const prevLine = html.substring(prevLineStart, prevLineEnd);
    if (prevLine.trimStart().startsWith('<!--')) {
      blockStart = prevLineStart; // incluir la línea del comentario
    }
  }

  // Contar <div> / </div> balanceados para encontrar el cierre
  let depth = 0;
  let i = divTagPos;
  let end = -1;
  while (i < html.length) {
    if (html.startsWith('<div', i) && (html[i + 4] === ' ' || html[i + 4] === '>')) {
      depth++;
      i += 4;
    } else if (html.startsWith('</div>', i)) {
      depth--;
      if (depth === 0) { end = i + 6; break; }
      i += 6;
    } else {
      i++;
    }
  }
  if (end === -1) { console.error(`  ❌ No se encontró </div> para pantalla${id}`); return null; }

  // Incluir newline final
  if (end < html.length && html[end] === '\n') end++;

  return { id, start: blockStart, end, content: html.substring(blockStart, end) };
}

const bloques = [];
for (let n = 1; n <= 17; n++) {
  const b = extraerBloquePantalla(html, n);
  if (!b) { console.error(`  ❌ pantalla${n} no encontrada`); fail++; continue; }
  bloques.push(b);
}

if (bloques.length === 17) {
  // Ordenar por posición original para obtener el rango de la sección
  const porPosicion = [...bloques].sort((a, b) => a.start - b.start);
  const seccionStart = porPosicion[0].start;
  const seccionEnd   = porPosicion[porPosicion.length - 1].end;

  // Reconstruir en orden numérico
  const seccionOrdenada = bloques.sort((a, b) => a.id - b.id).map(b => b.content).join('\n');
  html = html.substring(0, seccionStart) + seccionOrdenada + html.substring(seccionEnd);
  console.log('  ✅ Divs reordenados físicamente: P1→P2→…→P17');
  ok++;
} else {
  console.error(`  ❌ Solo se encontraron ${bloques.length}/17 pantallas — reordenado cancelado`);
  fail++;
}

// ═══════════════════════════════════════════════════════════════════
// Restaurar CRLF si el fichero original lo usaba
// ═══════════════════════════════════════════════════════════════════
if (CRLF) html = html.replace(/\n/g, '\r\n');

fs.writeFileSync(FILE, html, 'utf8');

// ═══════════════════════════════════════════════════════════════════
// Resumen
// ═══════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(55)}`);
console.log(`✅ OK: ${ok}   ❌ FAIL: ${fail}`);
if (fail > 0) {
  console.error('⚠️  Hay fallos — revisar manualmente los items ❌ antes de continuar.');
  process.exit(1);
} else {
  console.log('✅ Todos los cambios aplicados correctamente.');
}
