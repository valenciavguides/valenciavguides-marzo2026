# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-handler-registration.spec.js >> Registro de handlers — estado tras FASE 1 >> registrarControladorSeguro no registra un mismo tipo dos veces
- Location: tests\e2e\03-handler-registration.spec.js:119:3

# Error details

```
Error: page.evaluate: TypeError: globalThis.registrarControladorSeguro is not a function. (In 'globalThis.registrarControladorSeguro(tipo, handler)', 'globalThis.registrarControladorSeguro' is undefined)
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
  20  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
  21  | 
  22  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  23  | 
  24  | test.describe('Registro de handlers — estado tras FASE 1', () => {
  25  |   test.beforeEach(async ({ page }) => {
  26  |     await page.addInitScript({ path: LEAFLET_STUB });
  27  |     await injectInitSpy(page);
  28  |     await stubCDNResources(page);
  29  |     await gotoAndWaitForFase1(page);
  30  |   });
  31  | 
  32  |   // ── Cola de controladores pendientes ──────────────────────────────────
  33  | 
  34  |   test('1g. __CONTROLADORES_PENDIENTES está vacío tras el drenaje', async ({ page }) => {
  35  |     const info = await page.evaluate(() => {
  36  |       const pendientes = globalThis.__CONTROLADORES_PENDIENTES;
  37  |       return {
  38  |         // null/undefined es OK: significa que no hubo handlers encolados
  39  |         isNullOrEmpty: !pendientes || (Array.isArray(pendientes) && pendientes.length === 0),
  40  |         length: Array.isArray(pendientes) ? pendientes.length : 0,
  41  |       };
  42  |     });
  43  |     expect(info.isNullOrEmpty).toBe(true);
  44  |   });
  45  | 
  46  |   // ── Set de tipos registrados ──────────────────────────────────────────
  47  | 
  48  |   test('1b. __CONTROLADOR_REGISTRADOS tiene entradas (algún handler fue registrado)', async ({ page }) => {
  49  |     const size = await page.evaluate(() => {
  50  |       return globalThis.__CONTROLADOR_REGISTRADOS instanceof Set
  51  |         ? globalThis.__CONTROLADOR_REGISTRADOS.size
  52  |         : -1;
  53  |     });
  54  |     // Debe haber al menos 1 handler registrado tras FASE 1
  55  |     expect(size).toBeGreaterThan(0);
  56  |   });
  57  | 
  58  |   // ── Fuente de verdad: state-manager.controladores ─────────────────────
  59  | 
  60  |   test('1b. state-manager tiene handlers en su mapa de controladores', async ({ page }) => {
  61  |     const count = await page.evaluate(() => {
  62  |       const sm = globalThis.__vv_stateManager;
  63  |       if (!sm) return -1;
  64  |       try {
  65  |         // getManejadores() devuelve el Map de controladores
  66  |         const manejadores = sm.getManejadores ? sm.getManejadores() : null;
  67  |         if (!manejadores) return 0;
  68  |         // Puede ser un Map o un objeto
  69  |         if (manejadores instanceof Map) return manejadores.size;
  70  |         return Object.keys(manejadores).length;
  71  |       } catch (e) {
  72  |         return -1;
  73  |       }
  74  |     });
  75  |     // Debe haber al menos 1 handler en state-manager
  76  |     expect(count).toBeGreaterThan(0);
  77  |   });
  78  | 
  79  |   test('1b. el mapa de controladores en state-manager no está vacío', async ({ page }) => {
  80  |     const info = await page.evaluate(() => {
  81  |       const sm = globalThis.__vv_stateManager;
  82  |       if (!sm) return { ok: false, reason: 'no state-manager' };
  83  |       try {
  84  |         const mapa = sm.getManejadores ? sm.getManejadores() : null;
  85  |         if (!mapa) return { ok: false, reason: 'getManejadores() retornó null' };
  86  |         const size = mapa instanceof Map ? mapa.size : Object.keys(mapa).length;
  87  |         return { ok: true, size };
  88  |       } catch (e) {
  89  |         return { ok: false, reason: e.message };
  90  |       }
  91  |     });
  92  |     expect(info.ok).toBe(true);
  93  |     expect(info.size).toBeGreaterThan(0);
  94  |   });
  95  | 
  96  |   // ── Sin fuga al mapa local ────────────────────────────────────────────
  97  | 
  98  |   test('1b. __vv_manejadoresLocales está vacío o no existe (sin fuga del path nominal)', async ({ page }) => {
  99  |     const info = await page.evaluate(() => {
  100 |       const local = globalThis.__vv_manejadoresLocales;
  101 |       if (!local) return { leakCount: 0 };
  102 |       // Es un Map
  103 |       if (local instanceof Map) return { leakCount: local.size };
  104 |       // Es un objeto
  105 |       return { leakCount: Object.keys(local).length };
  106 |     });
  107 |     // Si hay fugas, los handlers acabaron en el mapa local en vez del state-manager
  108 |     // En condiciones normales de arranque debe ser 0
  109 |     expect(info.leakCount).toBe(0);
  110 |   });
  111 | 
  112 |   // ── registrarControladorSeguro disponible ─────────────────────────────
  113 | 
  114 |   test('globalThis.registrarControladorSeguro existe como función', async ({ page }) => {
  115 |     const ok = await page.evaluate(() => typeof globalThis.registrarControladorSeguro === 'function');
  116 |     expect(ok).toBe(true);
  117 |   });
  118 | 
  119 |   test('registrarControladorSeguro no registra un mismo tipo dos veces', async ({ page }) => {
> 120 |     const result = await page.evaluate(async () => {
      |                               ^ Error: page.evaluate: TypeError: globalThis.registrarControladorSeguro is not a function. (In 'globalThis.registrarControladorSeguro(tipo, handler)', 'globalThis.registrarControladorSeguro' is undefined)
  121 |       const tipo = '__TEST_TIPO_DEDUP__' + Date.now();
  122 |       let callCount = 0;
  123 |       const handler = () => { callCount++; };
  124 | 
  125 |       globalThis.registrarControladorSeguro(tipo, handler);
  126 |       globalThis.registrarControladorSeguro(tipo, handler); // segundo intento — debe ignorarse
  127 | 
  128 |       // El Set debe contener el tipo (una sola vez)
  129 |       const enSet = globalThis.__CONTROLADOR_REGISTRADOS.has(tipo);
  130 |       return { enSet, callCount };
  131 |     });
  132 |     // El tipo debe estar en el Set
  133 |     expect(result.enSet).toBe(true);
  134 |     // El handler no debe haberse llamado durante el registro (no es un dispatcher)
  135 |     expect(result.callCount).toBe(0);
  136 |   });
  137 | });
  138 | 
```