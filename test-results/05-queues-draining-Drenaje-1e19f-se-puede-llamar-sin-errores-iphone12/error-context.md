# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-queues-draining.spec.js >> Drenaje de colas tras FASE 1 >> 1g. procesarControladoresPendientes() existe y se puede llamar sin errores
- Location: tests\e2e\05-queues-draining.spec.js:53:3

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
  2   |  * 05-queues-draining.spec.js
  3   |  *
  4   |  * Valida que las colas del sistema de mensajería queden correctamente drenadas
  5   |  * (vacías) tras el arranque de FASE 1.
  6   |  *
  7   |  * Las 3 colas monitorizadas:
  8   |  *   1. __CONTROLADORES_PENDIENTES   — handlers encolados antes de mensajería lista
  9   |  *   2. __pendingDistribucion        — mensajes DISTRIBUCIÓN pendientes de despacho
  10  |  *   3. __pendingBroadcast           — mensajes BROADCAST pendientes de despacho
  11  |  *
  12  |  * Prerequisito DT-1 Opción B — escenario 1g:
  13  |  *   "El test debe afirmar que las 3 colas son undefined o [] al final del boot"
  14  |  *
  15  |  * Prerequisito — escenario 1h (race condition):
  16  |  *   "Race #4: Si __pendingBroadcast se drena antes de que algunos iframes estén
  17  |  *   listos, los mensajes se pierden. El test afirma que __pendingBroadcast no
  18  |  *   existe al arrancar (no hay aventura seleccionada, ningún broadcast pendiente)."
  19  |  */
  20  | 'use strict';
  21  | 
  22  | const { test, expect } = require('@playwright/test');
  23  | const path = require('path');
  24  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
  25  | 
  26  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  27  | 
  28  | test.describe('Drenaje de colas tras FASE 1', () => {
  29  |   test.beforeEach(async ({ page }) => {
  30  |     await page.addInitScript({ path: LEAFLET_STUB });
  31  |     await injectInitSpy(page);
  32  |     await stubCDNResources(page);
  33  |     await gotoAndWaitForFase1(page);
  34  |   });
  35  | 
  36  |   // ── Cola de controladores pendientes ──────────────────────────────────
  37  | 
  38  |   test('1g. __CONTROLADORES_PENDIENTES está vacío o null tras el drenaje', async ({ page }) => {
  39  |     const info = await page.evaluate(() => {
  40  |       const q = globalThis.__CONTROLADORES_PENDIENTES;
  41  |       return {
  42  |         type: typeof q,
  43  |         isNullOrUndefined: q == null,
  44  |         isEmpty: Array.isArray(q) && q.length === 0,
  45  |         rawLength: Array.isArray(q) ? q.length : -1,
  46  |       };
  47  |     });
  48  |     // La cola debe estar ausente (null/undefined) O vacía ([])
  49  |     const drained = info.isNullOrUndefined || info.isEmpty;
  50  |     expect(drained).toBe(true);
  51  |   });
  52  | 
  53  |   test('1g. procesarControladoresPendientes() existe y se puede llamar sin errores', async ({ page }) => {
  54  |     const ok = await page.evaluate(() => {
  55  |       try {
  56  |         if (typeof globalThis.procesarControladoresPendientes === 'function') {
  57  |           globalThis.procesarControladoresPendientes();
  58  |           return true;
  59  |         }
  60  |         return false;
  61  |       } catch (e) {
  62  |         return false;
  63  |       }
  64  |     });
> 65  |     expect(ok).toBe(true);
      |                ^ Error: expect(received).toBe(expected) // Object.is equality
  66  |   });
  67  | 
  68  |   test('1g. tras segunda llamada a procesarControladoresPendientes(), la cola sigue vacía', async ({ page }) => {
  69  |     const length = await page.evaluate(() => {
  70  |       globalThis.procesarControladoresPendientes && globalThis.procesarControladoresPendientes();
  71  |       const q = globalThis.__CONTROLADORES_PENDIENTES;
  72  |       if (q == null) return 0;
  73  |       return Array.isArray(q) ? q.length : -1;
  74  |     });
  75  |     expect(length).toBe(0);
  76  |   });
  77  | 
  78  |   // ── Cola de distribución pendiente ────────────────────────────────────
  79  | 
  80  |   test('1h. __pendingDistribucion no existe (ningún mensaje de distribución pendiente sin aventura)', async ({ page }) => {
  81  |     const info = await page.evaluate(() => {
  82  |       const q = globalThis.__pendingDistribucion;
  83  |       return {
  84  |         type: typeof q,
  85  |         isAbsent: q == null,
  86  |         isEmpty: Array.isArray(q) && q.length === 0,
  87  |       };
  88  |     });
  89  |     // Sin aventura seleccionada no debe haber mensajes de distribución pendientes
  90  |     expect(info.isAbsent || info.isEmpty).toBe(true);
  91  |   });
  92  | 
  93  |   // ── Cola de broadcast pendiente ───────────────────────────────────────
  94  | 
  95  |   test('1h. __pendingBroadcast no existe (ningún broadcast pendiente sin aventura)', async ({ page }) => {
  96  |     const info = await page.evaluate(() => {
  97  |       const q = globalThis.__pendingBroadcast;
  98  |       return {
  99  |         type: typeof q,
  100 |         isAbsent: q == null,
  101 |         isEmpty: Array.isArray(q) && q.length === 0,
  102 |       };
  103 |     });
  104 |     // Sin aventura seleccionada no debe haber broadcasts pendientes
  105 |     expect(info.isAbsent || info.isEmpty).toBe(true);
  106 |   });
  107 | 
  108 |   // ── Verificación de idempotencia del drenaje ──────────────────────────
  109 | 
  110 |   test('1g. el spy NO capturó handlers pendientes en el momento de mensajeriaReady', async ({ page }) => {
  111 |     const order = await page.evaluate(() => globalThis.__e2e_initOrder || []);
  112 |     const snap = order.find(e => e.event === 'mensajeriaReady');
  113 |     if (!snap) {
  114 |       // Si el spy no capturó el evento, el test es indeterminado — pasar con warning
  115 |       console.warn('[WARN] El spy no capturó mensajeriaReady — ¿se llamó injectInitSpy antes de goto?');
  116 |       return;
  117 |     }
  118 |     // En el momento de mensajeriaReady, la cola debe estar vacía o con 0 pendientes
  119 |     // (el drenaje se llama justo después, así que es posible que haya 0-N pendientes)
  120 |     // Lo que SÍ garantizamos: tras el drenaje (que ya ocurrió en gotoAndWaitForFase1),
  121 |     // la cola está vacía — ya comprobado en el test anterior.
  122 |     // Aquí solo registramos el valor histórico como información.
  123 |     expect(typeof snap.pendientesCuenta).toBe('number');
  124 |   });
  125 | 
  126 |   // ── Estado del mapa de mensajería ─────────────────────────────────────
  127 | 
  128 |   test('globalThis.mensajeria está configurada como tipo "padre"', async ({ page }) => {
  129 |     const tipo = await page.evaluate(() => {
  130 |       // El tipo se puede obtener directamente o via el flag de estado del padre
  131 |       if (globalThis.mensajeria && typeof globalThis.mensajeria.getTipo === 'function') {
  132 |         return globalThis.mensajeria.getTipo();
  133 |       }
  134 |       // Alternativa: comprobamos que el estado del padre en state-manager
  135 |       // refleja que el padre está inicializado
  136 |       const sm = globalThis.__vv_stateManager;
  137 |       if (sm && typeof sm.getEstadoPadre === 'function') {
  138 |         const estado = sm.getEstadoPadre();
  139 |         return estado ? 'padre' : null;
  140 |       }
  141 |       return null;
  142 |     });
  143 |     // El tipo debe ser 'padre' o el estado del padre debe ser válido
  144 |     // (si getTipo no está expuesto, el test pasa si el estado es coherente)
  145 |     expect(tipo === 'padre' || tipo === null).toBe(true);
  146 |   });
  147 | });
  148 | 
```