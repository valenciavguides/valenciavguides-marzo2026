# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-controladores-padre.spec.js >> CP — Controladores de datos extraídos (js/controladores-padre.js) >> CP-1. Los 4 tipos extraídos están en __CONTROLADOR_REGISTRADOS
- Location: tests\e2e\10-controladores-padre.spec.js:46:3

# Error details

```
Error: Tipos no registrados: undefined

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - img "Cargando" [ref=e4]
    - generic "Progreso de carga" [ref=e5]:
      - progressbar "Carga" [ref=e6]
      - generic [ref=e7]: 8%
  - iframe [ref=e8]:
    
  - group "Controles de audio" [ref=e9]:
    - generic [ref=e10]: Controles de audio
    - button "Abrir controles de audio" [disabled] [ref=e11]:
      - img "Control audio"
  - iframe [ref=e12]:
    
```

# Test source

```ts
  1   | /**
  2   |  * 10-controladores-padre.spec.js
  3   |  *
  4   |  * Cobertura de js/controladores-padre.js (DT-1 Opción B).
  5   |  *
  6   |  * Verifica que tras FASE 1 (globalThis.__MENSAJERIA_INICIADA === true):
  7   |  *   CP-1  Los 4 tipos extraídos están en __CONTROLADOR_REGISTRADOS
  8   |  *         (confirma que el dynamic import de controladores-padre.js completó)
  9   |  *   CP-2  Los 4 tipos NO están en __vv_manejadoresLocales
  10  |  *         (confirma que llegaron al state-manager, no al fallback)
  11  |  *   CP-3  El total de tipos en __CONTROLADOR_REGISTRADOS incluye los 4 extraídos
  12  |  *         (regresión: el refactor no redujo el número total de controladores)
  13  |  *   CP-4  Enviar SOLICITAR_AUDIOS sintético: el padre devuelve CARGAR_AUDIOS
  14  |  *         (smoke test de bidireccionalidad del handler)
  15  |  *   CP-5  Enviar SOLICITAR_TEXTOS sintético: el padre devuelve CARGAR_TEXTOS
  16  |  *   CP-6  Enviar SOLICITAR_RETOS sintético: el padre devuelve CARGAR_RETOS
  17  |  *   CP-7  Enviar SOLICITAR_COORDENADAS sintético: el padre devuelve CARGAR_COORDENADAS
  18  |  *   CP-8  Enviar SOLICITAR_DATOS_PARADAS sintético: el padre devuelve
  19  |  *         RESPUESTA_DATOS_PARADAS (o maneja la ausencia de datos sin lanzar)
  20  |  */
  21  | 'use strict';
  22  | 
  23  | const { test, expect } = require('@playwright/test');
  24  | const path = require('path');
  25  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
  26  | 
  27  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  28  | 
  29  | /** Los 4 tipos extraídos a js/controladores-padre.js */
  30  | const TIPOS_EXTRAIDOS = [
  31  |   'NAVEGACION.SOLICITAR_DATOS_PARADAS',
  32  |   'DATOS.SOLICITAR_AUDIOS',
  33  |   'DATOS.SOLICITAR_TEXTOS',
  34  |   'DATOS.SOLICITAR_RETOS',
  35  | ];
  36  | 
  37  | test.describe('CP — Controladores de datos extraídos (js/controladores-padre.js)', () => {
  38  |   test.beforeEach(async ({ page }) => {
  39  |     await page.addInitScript({ path: LEAFLET_STUB });
  40  |     await injectInitSpy(page);
  41  |     await stubCDNResources(page);
  42  |     await gotoAndWaitForFase1(page);
  43  |   });
  44  | 
  45  |   // ── CP-1: Tipos extraídos en __CONTROLADOR_REGISTRADOS ──────────────────
  46  |   test('CP-1. Los 4 tipos extraídos están en __CONTROLADOR_REGISTRADOS', async ({ page }) => {
  47  |     const result = await page.evaluate((tipos) => {
  48  |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  49  |       if (!(registrados instanceof Set)) return { ok: false, razon: 'Set no existe' };
  50  |       const faltantes = tipos.filter(t => !registrados.has(t));
  51  |       return { ok: faltantes.length === 0, faltantes };
  52  |     }, TIPOS_EXTRAIDOS);
  53  | 
> 54  |     expect(result.ok, `Tipos no registrados: ${JSON.stringify(result.faltantes)}`).toBe(true);
      |                                                                                    ^ Error: Tipos no registrados: undefined
  55  |   });
  56  | 
  57  |   // ── CP-2: No están en __vv_manejadoresLocales ────────────────────────────
  58  |   test('CP-2. Los tipos extraídos NO están en __vv_manejadoresLocales', async ({ page }) => {
  59  |     const result = await page.evaluate((tipos) => {
  60  |       const local = globalThis.__vv_manejadoresLocales;
  61  |       if (!local) return { ok: true, fugas: [] }; // No hay fallback local — correcto
  62  |       const keys = local instanceof Map ? [...local.keys()] : Object.keys(local);
  63  |       const fugas = tipos.filter(t => keys.includes(t));
  64  |       return { ok: fugas.length === 0, fugas };
  65  |     }, TIPOS_EXTRAIDOS);
  66  | 
  67  |     expect(result.ok, `Fugas en manejadoresLocales: ${JSON.stringify(result.fugas)}`).toBe(true);
  68  |   });
  69  | 
  70  |   // ── CP-3: El total no se redujo respecto al baseline (≥ 11 tipos) ────────
  71  |   test('CP-3. El total de controladores registrados es >= 11 (incluye los 4 extraídos)', async ({ page }) => {
  72  |     const setSize = await page.evaluate(() => {
  73  |       const s = globalThis.__CONTROLADOR_REGISTRADOS;
  74  |       return (s instanceof Set) ? s.size : -1;
  75  |     });
  76  |     expect(setSize).toBeGreaterThanOrEqual(11);
  77  |   });
  78  | 
  79  |   // ── CP-4 a CP-7: Smoke tests de bidireccionalidad ───────────────────────
  80  |   // Enviamos un mensaje sintético de "solicitar datos" y verificamos que el
  81  |   // padre responde con el tipo de respuesta correspondiente (o maneja
  82  |   // correctamente la ausencia de datos sin lanzar excepción).
  83  | 
  84  |   async function enviarSolicitudYEsperarRespuesta(page, tipoSolicitud, tipoRespuestaEsperado) {
  85  |     return page.evaluate(
  86  |       async ({ tipoSolicitud, tipoRespuestaEsperado }) => {
  87  |         return new Promise((resolve) => {
  88  |           const timeout = setTimeout(() => {
  89  |             resolve({ ok: false, razon: 'timeout — no se recibió respuesta en 3s' });
  90  |           }, 1500);
  91  | 
  92  |           // Escuchar la respuesta del padre
  93  |           globalThis.addEventListener('message', function handler(ev) {
  94  |             if (!ev.data || !ev.data.tipo) return;
  95  |             if (ev.data.tipo === tipoRespuestaEsperado) {
  96  |               clearTimeout(timeout);
  97  |               globalThis.removeEventListener('message', handler);
  98  |               resolve({ ok: true, tipo: ev.data.tipo });
  99  |             }
  100 |           });
  101 | 
  102 |           // Enviar mensaje sintético al padre (self-dispatch para que el padre lo reciba)
  103 |           // El padre escucha 'message' en window, y nosotros estamos EN el padre.
  104 |           // Usamos postMessage a sí mismo para activar el listener de mensajería.
  105 |           globalThis.postMessage({
  106 |             tipo: tipoSolicitud,
  107 |             origen: 'hijo5',  // simulamos que viene de hijo5
  108 |             destino: 'padre',
  109 |             timestamp: Date.now(),
  110 |             datos: {}
  111 |           }, globalThis.location.origin);
  112 |         });
  113 |       },
  114 |       { tipoSolicitud, tipoRespuestaEsperado }
  115 |     );
  116 |   }
  117 | 
  118 |   test('CP-4. SOLICITAR_AUDIOS → el padre responde CARGAR_AUDIOS o maneja sin lanzar', async ({ page }) => {
  119 |     // Con datos no cargados, el handler puede responder con error o vacío — lo importante
  120 |     // es que no lance una excepción no controlada y que el tipo esté registrado (ya verificado en CP-1).
  121 |     const result = await enviarSolicitudYEsperarRespuesta(
  122 |       page,
  123 |       'DATOS.SOLICITAR_AUDIOS',
  124 |       'DATOS.CARGAR_AUDIOS'
  125 |     );
  126 |     // Respuesta o timeout sin lanzar son ambos aceptables cuando los datos no están cargados.
  127 |     expect(result.ok || result.razon.includes('timeout')).toBe(true);
  128 |   });
  129 | 
  130 |   test('CP-5. SOLICITAR_TEXTOS → handler registrado y no lanza', async ({ page }) => {
  131 |     const result = await enviarSolicitudYEsperarRespuesta(
  132 |       page,
  133 |       'DATOS.SOLICITAR_TEXTOS',
  134 |       'DATOS.CARGAR_TEXTOS'
  135 |     );
  136 |     expect(result.ok || result.razon.includes('timeout')).toBe(true);
  137 |   });
  138 | 
  139 |   test('CP-6. SOLICITAR_RETOS → handler registrado y no lanza', async ({ page }) => {
  140 |     const result = await enviarSolicitudYEsperarRespuesta(
  141 |       page,
  142 |       'DATOS.SOLICITAR_RETOS',
  143 |       'DATOS.CARGAR_RETOS'
  144 |     );
  145 |     expect(result.ok || result.razon.includes('timeout')).toBe(true);
  146 |   });
  147 | 
  148 |   test('CP-7. SOLICITAR_COORDENADAS → handler registrado y no lanza', async ({ page }) => {
  149 |     const result = await enviarSolicitudYEsperarRespuesta(
  150 |       page,
  151 |       'DATOS.SOLICITAR_COORDENADAS',
  152 |       'DATOS.CARGAR_COORDENADAS'
  153 |     );
  154 |     expect(result.ok || result.razon.includes('timeout')).toBe(true);
```