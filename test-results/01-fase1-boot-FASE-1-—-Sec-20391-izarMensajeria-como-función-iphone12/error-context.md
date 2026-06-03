# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-fase1-boot.spec.js >> FASE 1 — Secuencia de arranque del padre >> globalThis.mensajeria expone inicializarMensajeria como función
- Location: tests\e2e\01-fase1-boot.spec.js:85:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

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
  2   |  * 01-fase1-boot.spec.js
  3   |  *
  4   |  * Valida la secuencia de arranque de FASE 1 en codigo-padre.html.
  5   |  *
  6   |  * Prerequisito DT-1 Opción B — escenario 1a:
  7   |  *   "El test debe afirmar que globalThis.__vv_stateManager existe ANTES de que
  8   |  *   mensajeria.js se importe, y que globalThis.mensajeria existe ANTES del Promise.all"
  9   |  *
  10  |  * Prerequisito DT-1 — escenario 1b (parcial):
  11  |  *   Tras mensajeriaReady, globalThis.mensajeria expone la API completa.
  12  |  */
  13  | 'use strict';
  14  | 
  15  | const { test, expect } = require('@playwright/test');
  16  | const path = require('path');
  17  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1, getMensajeriaReadySnapshot } = require('./helpers/boot');
  18  | 
  19  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  20  | 
  21  | test.describe('FASE 1 — Secuencia de arranque del padre', () => {
  22  |   test.beforeEach(async ({ page }) => {
  23  |     await page.addInitScript({ path: LEAFLET_STUB });
  24  |     await injectInitSpy(page);
  25  |     await stubCDNResources(page);
  26  |     await gotoAndWaitForFase1(page);
  27  |   });
  28  | 
  29  |   // ── Orden de inicialización ────────────────────────────────────────────
  30  | 
  31  |   test('1a. Race #5 CORREGIDO: state-manager SÍ está en window cuando mensajeriaReady se dispara', async ({ page }) => {
  32  |     const snap = await getMensajeriaReadySnapshot(page);
  33  |     // Race #5 corregido (4 mayo 2026):
  34  |     // Causa raíz: <script type="module" src="funciones-mapa.js"> en línea 2084 cargaba
  35  |     // mensajeria.js antes del state-manager, haciendo que mensajeriaReady disparase
  36  |     // con globalThis.__vv_stateManager = null.
  37  |     // Fix: eliminar el script independiente — funciones-mapa.js solo carga vía PASO 3
  38  |     // (Promise.all en Script 1), cuando el state-manager ya está inicializado.
  39  |     expect(snap.hasStateManager).toBe(true);
  40  |   });
  41  | 
  42  |   test('1a. globalThis.mensajeria existe en el momento en que mensajeriaReady se dispara', async ({ page }) => {
  43  |     const snap = await getMensajeriaReadySnapshot(page);
  44  |     expect(snap.hasMensajeria).toBe(true);
  45  |   });
  46  | 
  47  |   test('1a. __MENSAJERIA_INICIADA ya era true cuando el spy capturó mensajeriaReady', async ({ page }) => {
  48  |     // El flag se pone a true justo antes de dispatchEvent('mensajeriaReady')
  49  |     // pero puede haber race en la captura del listener — aceptamos que sea true
  50  |     // al menos al finalizar el beforeEach (gotoAndWaitForFase1 lo espera)
  51  |     const value = await page.evaluate(() => globalThis.__MENSAJERIA_INICIADA);
  52  |     expect(value).toBe(true);
  53  |   });
  54  | 
  55  |   // ── state-manager ──────────────────────────────────────────────────────
  56  | 
  57  |   test('1a. globalThis.__vv_stateManager es un objeto con las APIs esperadas', async ({ page }) => {
  58  |     const api = await page.evaluate(() => {
  59  |       const sm = globalThis.__vv_stateManager;
  60  |       if (!sm) return null;
  61  |       return {
  62  |         hasRegistrarManejador: typeof sm.registrarManejador === 'function',
  63  |         hasGetManejadores: typeof sm.getManejadores === 'function',
  64  |         hasSetEstadoPadre: typeof sm.setEstadoPadre === 'function',
  65  |         hasGetEstadoPadre: typeof sm.getEstadoPadre === 'function',
  66  |       };
  67  |     });
  68  |     expect(api).not.toBeNull();
  69  |     expect(api.hasRegistrarManejador).toBe(true);
  70  |     expect(api.hasGetManejadores).toBe(true);
  71  |   });
  72  | 
  73  |   // ── globalThis.mensajeria API ─────────────────────────────────────────────
  74  | 
  75  |   test('globalThis.mensajeria expone registrarControlador como función', async ({ page }) => {
  76  |     const ok = await page.evaluate(() => typeof globalThis.mensajeria?.registrarControlador === 'function');
  77  |     expect(ok).toBe(true);
  78  |   });
  79  | 
  80  |   test('globalThis.mensajeria expone enviarMensaje como función', async ({ page }) => {
  81  |     const ok = await page.evaluate(() => typeof globalThis.mensajeria?.enviarMensaje === 'function');
  82  |     expect(ok).toBe(true);
  83  |   });
  84  | 
  85  |   test('globalThis.mensajeria expone inicializarMensajeria como función', async ({ page }) => {
  86  |     const ok = await page.evaluate(() => typeof globalThis.mensajeria?.inicializarMensajeria === 'function');
> 87  |     expect(ok).toBe(true);
      |                ^ Error: expect(received).toBe(expected) // Object.is equality
  88  |   });
  89  | 
  90  |   test('globalThis.mensajeria expone enviarMensajeConConfirmacion como función', async ({ page }) => {
  91  |     const ok = await page.evaluate(() => typeof globalThis.mensajeria?.enviarMensajeConConfirmacion === 'function');
  92  |     expect(ok).toBe(true);
  93  |   });
  94  | 
  95  |   // ── Sin errores críticos de arranque ──────────────────────────────────
  96  | 
  97  |   test('procesarControladoresPendientes existe y es una función tras el arranque', async ({ page }) => {
  98  |     const ok = await page.evaluate(() => typeof globalThis.procesarControladoresPendientes === 'function');
  99  |     expect(ok).toBe(true);
  100 |   });
  101 | });
  102 | 
```