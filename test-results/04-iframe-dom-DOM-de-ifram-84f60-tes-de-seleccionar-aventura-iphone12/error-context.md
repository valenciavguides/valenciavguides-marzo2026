# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-iframe-dom.spec.js >> DOM de iframes — estructura antes de selección de aventura >> 1c. globalThis.__vv_DATOS_AVENTURAS es null antes de seleccionar aventura
- Location: tests\e2e\04-iframe-dom.spec.js:75:3

# Error details

```
Error: expect(received).toBeNull()

Received: undefined
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
  2   |  * 04-iframe-dom.spec.js
  3   |  *
  4   |  * Valida que los 5 iframes hijos existan en el DOM con los IDs correctos
  5   |  * y que arranquen con src vacío (no se cargan prematuramente antes de selección de aventura).
  6   |  *
  7   |  * Prerequisito DT-1 Opción B — escenario 1d:
  8   |  *   "El test debe afirmar que los 5 hijos completan el ciclo HIJO_PREPARADO/HIJO_LISTO"
  9   |  *   — esta spec cubre la precondición: los elementos existen en el DOM antes de que
  10  |  *     se les asigne src.
  11  |  *
  12  |  * Prerequisito — escenario 1c:
  13  |  *   "Antes de __cargarDatosAventuraDiferidos(), globalThis.__vv_DATOS_AVENTURAS === null"
  14  |  */
  15  | 'use strict';
  16  | 
  17  | const { test, expect } = require('@playwright/test');
  18  | const path = require('path');
  19  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
  20  | 
  21  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  22  | 
  23  | // IDs definidos en el HTML de codigo-padre.html
  24  | // Cada uno corresponde a un hijo con rol específico
  25  | const IFRAMES = [
  26  |   { id: 'seleccion',      desc: 'Selección de aventura e idioma' },
  27  |   { id: 'hijo1-opciones', desc: 'Opciones de usuario (extrainfo-hijo1.html)' },
  28  |   { id: 'hijo2',          desc: 'Coordenadas/navegación (coordenadas-hijo2.html)' },
  29  |   { id: 'hijo3',          desc: 'Audio (audio-hijo3.html)' },
  30  |   { id: 'hijo4',          desc: 'Retos y preguntas (retos-hijo4.html)' },
  31  |   { id: 'hijo5',          desc: 'Botón Casa (boton-casa-hijo5.html)' },
  32  | ];
  33  | 
  34  | test.describe('DOM de iframes — estructura antes de selección de aventura', () => {
  35  |   test.beforeEach(async ({ page }) => {
  36  |     await page.addInitScript({ path: LEAFLET_STUB });
  37  |     await injectInitSpy(page);
  38  |     await stubCDNResources(page);
  39  |     await gotoAndWaitForFase1(page);
  40  |   });
  41  | 
  42  |   // ── Existencia de elementos ────────────────────────────────────────────
  43  | 
  44  |   for (const iframe of IFRAMES) {
  45  |     test(`iframe #${iframe.id} existe en el DOM (${iframe.desc})`, async ({ page }) => {
  46  |       const exists = await page.evaluate(
  47  |         (id) => !!document.getElementById(id),
  48  |         iframe.id
  49  |       );
  50  |       expect(exists).toBe(true);
  51  |     });
  52  |   }
  53  | 
  54  |   // ── src vacío antes de selección ──────────────────────────────────────
  55  |   // Los iframes NO deben cargarse antes de que el usuario seleccione aventura.
  56  |   // Si tienen src asignado, cargarían sus páginas hijo prematuramente y podrían
  57  |   // enviar HIJO_PREPARADO antes de que el padre esté listo.
  58  | 
  59  |   for (const iframe of ['hijo2', 'hijo3', 'hijo4', 'hijo5', 'hijo1-opciones']) {
  60  |     test(`iframe #${iframe} tiene src vacío antes de selección de aventura`, async ({ page }) => {
  61  |       const src = await page.evaluate(
  62  |         (id) => {
  63  |           const el = document.getElementById(id);
  64  |           return el ? el.getAttribute('src') : null;
  65  |         },
  66  |         iframe
  67  |       );
  68  |       // src="" o src ausente
  69  |       expect(src == null || src === '').toBe(true);
  70  |     });
  71  |   }
  72  | 
  73  |   // ── FASE 2 — datos diferidos nulos antes de selección ─────────────────
  74  | 
  75  |   test('1c. globalThis.__vv_DATOS_AVENTURAS es null antes de seleccionar aventura', async ({ page }) => {
  76  |     const val = await page.evaluate(() => globalThis.__vv_DATOS_AVENTURAS);
> 77  |     expect(val).toBeNull();
      |                 ^ Error: expect(received).toBeNull()
  78  |   });
  79  | 
  80  |   test('1c. globalThis.__vv_AUDIOS_AVENTURAS es null antes de seleccionar aventura', async ({ page }) => {
  81  |     const val = await page.evaluate(() => globalThis.__vv_AUDIOS_AVENTURAS);
  82  |     expect(val).toBeNull();
  83  |   });
  84  | 
  85  |   test('1c. globalThis.__vv_RETOS_AVENTURAS es null antes de seleccionar aventura', async ({ page }) => {
  86  |     const val = await page.evaluate(() => globalThis.__vv_RETOS_AVENTURAS);
  87  |     expect(val).toBeNull();
  88  |   });
  89  | 
  90  |   test('1c. globalThis.__cargarDatosAventuraDiferidos existe como función', async ({ page }) => {
  91  |     const ok = await page.evaluate(() => typeof globalThis.__cargarDatosAventuraDiferidos === 'function');
  92  |     expect(ok).toBe(true);
  93  |   });
  94  | 
  95  |   // ── iframe sistema-ui (siempre visible) ───────────────────────────────
  96  | 
  97  |   test('iframe #sistema-ui existe con srcdoc (no src externo)', async ({ page }) => {
  98  |     const info = await page.evaluate(() => {
  99  |       const el = document.getElementById('sistema-ui');
  100 |       return {
  101 |         exists: !!el,
  102 |         hasSrcdoc: el ? el.hasAttribute('srcdoc') : false,
  103 |         srcAttribute: el ? el.getAttribute('src') : null,
  104 |       };
  105 |     });
  106 |     expect(info.exists).toBe(true);
  107 |     expect(info.hasSrcdoc).toBe(true);
  108 |     // sistema-ui no debe tener src externo
  109 |     expect(info.srcAttribute == null || info.srcAttribute === '').toBe(true);
  110 |   });
  111 | });
  112 | 
```