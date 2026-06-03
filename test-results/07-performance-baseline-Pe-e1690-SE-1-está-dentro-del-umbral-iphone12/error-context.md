# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07-performance-baseline.spec.js >> Performance baseline — arranque FASE 1 (pre-refactor) >> PB-1. Tiempo total de boot FASE 1 está dentro del umbral
- Location: tests\e2e\07-performance-baseline.spec.js:55:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForFunction: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - img "Cargando" [ref=e4]
    - generic "Progreso de carga" [ref=e5]:
      - progressbar "Carga" [ref=e6]
      - generic [ref=e7]: 0%
  - iframe [ref=e8]:
    
  - group "Controles de audio" [ref=e9]:
    - generic [ref=e10]: Controles de audio
    - button "Abrir controles de audio" [ref=e11] [cursor=pointer]:
      - img "Control audio"
  - iframe [ref=e12]:
    
```

# Test source

```ts
  1   | /**
  2   |  * 07-performance-baseline.spec.js
  3   |  *
  4   |  * Establece la línea base de rendimiento del arranque de FASE 1 ANTES de la
  5   |  * extracción a js/controladores-padre.js (DT-1 Opción B).
  6   |  *
  7   |  * Criterio de aceptación del refactor (DT-1):
  8   |  *   "El tiempo de arranque medido en performance.now() no aumenta más de 50ms
  9   |  *    respecto al baseline del script inline actual."
  10  |  *
  11  |  * Qué mide este spec:
  12  |  *   - Tiempo de navegación a __MENSAJERIA_INICIADA=true (T_boot)
  13  |  *   - Número de handlers registrados en state-manager (baseline handler count)
  14  |  *   - Número de entradas en __CONTROLADOR_REGISTRADOS (baseline Set size)
  15  |  *   - Número de entradas en __vv_manejadoresLocales (debe ser 0 — DT-1 criterio #5)
  16  |  *
  17  |  * Cómo usar los resultados:
  18  |  *   1. Ejecutar ANTES del refactor → guardar los valores en un comentario
  19  |  *      o en la sección "BASELINE" de DEUDA-TECNICA-PRODUCCION.md
  20  |  *   2. Ejecutar DESPUÉS del refactor → comparar contra ese baseline
  21  |  *   3. Si T_boot aumenta más de 50ms → investigar antes de mergear
  22  |  *
  23  |  * Los thresholds de este spec son conservadores (el boot no debe superar
  24  |  * BOOT_TIMEOUT_THRESHOLD). El objetivo no es que este spec falle en producción,
  25  |  * sino que LOS VALORES REGISTRADOS en el log sirvan como referencia comparativa.
  26  |  */
  27  | 'use strict';
  28  | 
  29  | const { test, expect } = require('@playwright/test');
  30  | const path = require('path');
  31  | const { BOOT_TIMEOUT, stubCDNResources } = require('./helpers/boot');
  32  | 
  33  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  34  | 
  35  | // Umbral conservador: el boot no debe exceder este tiempo en total
  36  | // (incluye servidor, red local, parse de módulos). No es el delta — es el absoluto.
  37  | const BOOT_TIMEOUT_THRESHOLD_MS = BOOT_TIMEOUT; // 30 s
  38  | 
  39  | // El delta máximo permitido tras el refactor (criterio DT-1)
  40  | // Este valor se usa solo como documentación; la comparación real se hace manualmente.
  41  | const MAX_REFACTOR_DELTA_MS = 50;
  42  | 
  43  | test.describe('Performance baseline — arranque FASE 1 (pre-refactor)', () => {
  44  |   // ── Medición del tiempo de arranque ────────────────────────────────────
  45  |   //
  46  |   // Metodología:
  47  |   //   1. Inyectamos un script que registra performance.now() cuando
  48  |   //      mensajeriaReady se dispara (T_mensajeriaReady)
  49  |   //   2. Esperamos a que __MENSAJERIA_INICIADA sea true (T_boot_complete)
  50  |   //   3. Calculamos T_boot = T_boot_complete - T_navigationStart
  51  |   //
  52  |   // T_navigationStart viene de performance.timing.navigationStart (disponible
  53  |   // desde el inicio de la carga de página en el navegador).
  54  | 
  55  |   test('PB-1. Tiempo total de boot FASE 1 está dentro del umbral', async ({ page }) => {
  56  |     // Inyectar stub de Leaflet
  57  |     await page.addInitScript({ path: LEAFLET_STUB });
  58  | 
  59  |     // Inyectar spy de timing — captura performance.now() en mensajeriaReady
  60  |     await page.addInitScript(() => {
  61  |       globalThis.__e2e_timing = { navigationStart: performance.now() };
  62  | 
  63  |       globalThis.addEventListener('mensajeriaReady', () => {
  64  |         globalThis.__e2e_timing.mensajeriaReady = performance.now();
  65  |       }, { once: true });
  66  |     });
  67  | 
  68  |     await stubCDNResources(page);
  69  | 
  70  |     // Navegar y esperar a que el boot complete
  71  |     const startTs = Date.now();
  72  |     await page.goto('/codigo-padre.html');
> 73  |     await page.waitForFunction(
      |                ^ Error: page.waitForFunction: Test timeout of 60000ms exceeded.
  74  |       () => globalThis.__MENSAJERIA_INICIADA === true,
  75  |       { timeout: BOOT_TIMEOUT_THRESHOLD_MS }
  76  |     );
  77  |     const wallClockMs = Date.now() - startTs;
  78  | 
  79  |     // Leer las marcas de tiempo internas de la página
  80  |     const timing = await page.evaluate(() => {
  81  |       const t = globalThis.__e2e_timing || {};
  82  |       return {
  83  |         navigationStart: t.navigationStart || 0,
  84  |         mensajeriaReady: t.mensajeriaReady || 0,
  85  |         mensajeriaIniciada: globalThis.__MENSAJERIA_INICIADA === true,
  86  |         // También capturar el valor de performance.now() ahora (post-boot)
  87  |         now: performance.now(),
  88  |       };
  89  |     });
  90  | 
  91  |     // Tiempo desde el inicio de la página hasta mensajeriaReady
  92  |     const tBootPage = timing.mensajeriaReady > 0
  93  |       ? timing.mensajeriaReady - timing.navigationStart
  94  |       : -1;
  95  | 
  96  |     // Log para referencia manual — estos valores son el BASELINE pre-refactor
  97  |     console.log(`
  98  |     ┌─────────────────────────────────────────────────────────────┐
  99  |     │  PERFORMANCE BASELINE — pre-refactor (DT-1 Opción B)        │
  100 |     ├─────────────────────────────────────────────────────────────┤
  101 |     │  T_wallClock (Playwright)    : ${wallClockMs.toFixed(0).padStart(6)} ms             │
  102 |     │  T_boot_page (performance.now): ${tBootPage >= 0 ? tBootPage.toFixed(0).padStart(6) : '  N/A '} ms             │
  103 |     │  Max delta permitido (DT-1)  : ${MAX_REFACTOR_DELTA_MS.toString().padStart(6)} ms             │
  104 |     │                                                             │
  105 |     │  GUARDAR ESTOS VALORES en DEUDA-TECNICA (sección baseline)  │
  106 |     └─────────────────────────────────────────────────────────────┘`);
  107 | 
  108 |     // El boot debe completar (ya lo garantiza waitForFunction arriba)
  109 |     expect(timing.mensajeriaIniciada).toBe(true);
  110 |     // Umbral absoluto: no debe tardar más de BOOT_TIMEOUT_THRESHOLD_MS en total
  111 |     expect(wallClockMs).toBeLessThan(BOOT_TIMEOUT_THRESHOLD_MS);
  112 |   });
  113 | 
  114 |   // ── Baseline de conteo de handlers ─────────────────────────────────────
  115 |   //
  116 |   // Estos valores son el BASELINE. Tras el refactor:
  117 |   //   - handler_count debe ser >= baseline (no se pueden perder handlers)
  118 |   //   - set_size debe ser == baseline (mismos tipos registrados, ni más ni menos)
  119 |   //   - local_leak_count debe seguir siendo 0
  120 | 
  121 |   test('PB-2. Baseline: conteo de handlers registrados en state-manager', async ({ page }) => {
  122 |     await page.addInitScript({ path: LEAFLET_STUB });
  123 |     await stubCDNResources(page);
  124 |     await page.goto('/codigo-padre.html');
  125 |     await page.waitForFunction(() => globalThis.__MENSAJERIA_INICIADA === true, { timeout: BOOT_TIMEOUT_THRESHOLD_MS });
  126 | 
  127 |     const baseline = await page.evaluate(() => {
  128 |       const sm = globalThis.__vv_stateManager;
  129 |       let handlerCount = -1;
  130 |       if (sm) {
  131 |         try {
  132 |           const mapa = sm.getManejadores ? sm.getManejadores() : null;
  133 |           if (mapa instanceof Map) handlerCount = mapa.size;
  134 |           else if (mapa) handlerCount = Object.keys(mapa).length;
  135 |         } catch (e) { handlerCount = -2; }
  136 |       }
  137 | 
  138 |       const setSize = (globalThis.__CONTROLADOR_REGISTRADOS instanceof Set)
  139 |         ? globalThis.__CONTROLADOR_REGISTRADOS.size : -1;
  140 | 
  141 |       const localLeak = (() => {
  142 |         const local = globalThis.__vv_manejadoresLocales;
  143 |         if (!local) return 0;
  144 |         if (local instanceof Map) return local.size;
  145 |         return Object.keys(local).length;
  146 |       })();
  147 | 
  148 |       const registeredTypes = (globalThis.__CONTROLADOR_REGISTRADOS instanceof Set)
  149 |         ? [...globalThis.__CONTROLADOR_REGISTRADOS].sort()
  150 |         : [];
  151 | 
  152 |       const localLeakTypes = (() => {
  153 |         const local = globalThis.__vv_manejadoresLocales;
  154 |         if (!local) return [];
  155 |         if (local instanceof Map) return [...local.keys()].sort();
  156 |         return Object.keys(local).sort();
  157 |       })();
  158 | 
  159 |       return { handlerCount, setSize, localLeak, registeredTypes, localLeakTypes };
  160 |     });
  161 | 
  162 |     // Log del baseline para documentar
  163 |     console.log(`
  164 |     ┌─────────────────────────────────────────────────────────────┐
  165 |     │  HANDLER BASELINE — pre-refactor (DT-1 Opción B)            │
  166 |     ├─────────────────────────────────────────────────────────────┤
  167 |     │  state-manager handler count : ${baseline.handlerCount.toString().padStart(4)}                      │
  168 |     │  __CONTROLADOR_REGISTRADOS   : ${baseline.setSize.toString().padStart(4)} tipos                 │
  169 |     │  __vv_manejadoresLocales     : ${baseline.localLeak.toString().padStart(4)} (debe ser 0)         │
  170 |     ├─────────────────────────────────────────────────────────────┤
  171 |     │  Tipos registrados:                                         │`);
  172 |     for (const t of baseline.registeredTypes) {
  173 |       console.log(`    │    ${t.padEnd(55)}│`);
```