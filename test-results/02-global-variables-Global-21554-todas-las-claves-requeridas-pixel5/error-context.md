# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-global-variables.spec.js >> Globals requeridas tras FASE 1 >> 1f. globalThis.CONFIG_PADRE existe con todas las claves requeridas
- Location: tests\e2e\02-global-variables.spec.js:115:3

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
  27  |     await gotoAndWaitForFase1(page);
  28  |   });
  29  | 
  30  |   // ── Constantes de mensajería ───────────────────────────────────────────
  31  | 
  32  |   test('1f. globalThis.TIPOS_MENSAJE existe y es un objeto no vacío', async ({ page }) => {
  33  |     const info = await page.evaluate(() => {
  34  |       const tm = globalThis.TIPOS_MENSAJE;
  35  |       return {
  36  |         type: typeof tm,
  37  |         hasKeys: tm ? Object.keys(tm).length > 0 : false,
  38  |         hasSistema: tm ? typeof tm.SISTEMA === 'object' : false,
  39  |       };
  40  |     });
  41  |     expect(info.type).toBe('object');
  42  |     expect(info.hasKeys).toBe(true);
  43  |     expect(info.hasSistema).toBe(true);
  44  |   });
  45  | 
  46  |   test('1f. globalThis.MODOS existe con claves CASA y AVENTURA', async ({ page }) => {
  47  |     const modos = await page.evaluate(() => {
  48  |       const m = globalThis.MODOS;
  49  |       return { type: typeof m, hasCASA: !!m?.CASA, hasAVENTURA: !!m?.AVENTURA };
  50  |     });
  51  |     expect(modos.type).toBe('object');
  52  |     expect(modos.hasCASA).toBe(true);
  53  |     expect(modos.hasAVENTURA).toBe(true);
  54  |   });
  55  | 
  56  |   // ── Funciones de comunicación ──────────────────────────────────────────
  57  | 
  58  |   test('1f. globalThis.registrarControlador es una función', async ({ page }) => {
  59  |     const ok = await page.evaluate(() => typeof globalThis.registrarControlador === 'function');
  60  |     expect(ok).toBe(true);
  61  |   });
  62  | 
  63  |   test('1f. globalThis.enviarMensaje es una función', async ({ page }) => {
  64  |     const ok = await page.evaluate(() => typeof globalThis.enviarMensaje === 'function');
  65  |     expect(ok).toBe(true);
  66  |   });
  67  | 
  68  |   test('1f. globalThis.enviarMensajeConConfirmacion es una función', async ({ page }) => {
  69  |     const ok = await page.evaluate(() => typeof globalThis.enviarMensajeConConfirmacion === 'function');
  70  |     expect(ok).toBe(true);
  71  |   });
  72  | 
  73  |   // ── Logger ────────────────────────────────────────────────────────────
  74  | 
  75  |   test('1f. globalThis.logger existe con métodos info/warn/error/debug', async ({ page }) => {
  76  |     const api = await page.evaluate(() => {
  77  |       const l = globalThis.logger;
  78  |       return {
  79  |         type: typeof l,
  80  |         hasInfo: typeof l?.info === 'function',
  81  |         hasWarn: typeof l?.warn === 'function',
  82  |         hasError: typeof l?.error === 'function',
  83  |         hasDebug: typeof l?.debug === 'function',
  84  |       };
  85  |     });
  86  |     expect(api.type).toBe('object');
  87  |     expect(api.hasInfo).toBe(true);
  88  |     expect(api.hasWarn).toBe(true);
  89  |     expect(api.hasError).toBe(true);
  90  |     expect(api.hasDebug).toBe(true);
  91  |   });
  92  | 
  93  |   // ── Detección de dispositivo ──────────────────────────────────────────
  94  | 
  95  |   test('1f. globalThis.esTelefonoMovil existe (booleano o función)', async ({ page }) => {
  96  |     const type = await page.evaluate(() => typeof globalThis.esTelefonoMovil);
  97  |     // El script inline define esTelefonoMovil como booleano (resultado de esTelefonoMovilRobusto())
  98  |     // mientras que device-detection.js lo define como función.
  99  |     // Ambas formas son válidas; lo que importa es que exista.
  100 |     expect(['boolean', 'function']).toContain(type);
  101 |   });
  102 | 
  103 |   test('1f. globalThis.ajustarTimeoutPorConexion existe como función', async ({ page }) => {
  104 |     const ok = await page.evaluate(() => typeof globalThis.ajustarTimeoutPorConexion === 'function');
  105 |     expect(ok).toBe(true);
  106 |   });
  107 | 
  108 |   test('1f. globalThis.ajustarTimeoutPorConexionSafe existe como función (wrapper seguro)', async ({ page }) => {
  109 |     const ok = await page.evaluate(() => typeof globalThis.ajustarTimeoutPorConexionSafe === 'function');
  110 |     expect(ok).toBe(true);
  111 |   });
  112 | 
  113 |   // ── CONFIG_PADRE ───────────────────────────────────────────────────────
  114 | 
  115 |   test('1f. globalThis.CONFIG_PADRE existe con todas las claves requeridas', async ({ page }) => {
  116 |     const cfg = await page.evaluate(() => {
  117 |       const c = globalThis.CONFIG_PADRE;
  118 |       return {
  119 |         exists: !!c,
  120 |         hasID: typeof c?.ID === 'string' && c.ID.length > 0,
  121 |         hasComponenteID: typeof c?.COMPONENTE_ID === 'string',
  122 |         hasVersion: typeof c?.VERSION === 'string',
  123 |         hasDebug: typeof c?.DEBUG === 'boolean',
  124 |         hasLogPrefix: typeof c?.LOG_PREFIX === 'string',
  125 |       };
  126 |     });
> 127 |     expect(cfg.exists).toBe(true);
      |                        ^ Error: expect(received).toBe(expected) // Object.is equality
  128 |     expect(cfg.hasID).toBe(true);
  129 |     expect(cfg.hasComponenteID).toBe(true);
  130 |     expect(cfg.hasVersion).toBe(true);
  131 |     expect(cfg.hasDebug).toBe(true);
  132 |     expect(cfg.hasLogPrefix).toBe(true);
  133 |   });
  134 | 
  135 |   // ── Función de ID del padre ────────────────────────────────────────────
  136 | 
  137 |   test('1f. globalThis.getPadreId() es una función que retorna un string no vacío', async ({ page }) => {
  138 |     const result = await page.evaluate(() => {
  139 |       if (typeof globalThis.getPadreId !== 'function') return { ok: false };
  140 |       const id = globalThis.getPadreId();
  141 |       return { ok: true, type: typeof id, nonEmpty: typeof id === 'string' && id.length > 0 };
  142 |     });
  143 |     expect(result.ok).toBe(true);
  144 |     expect(result.type).toBe('string');
  145 |     expect(result.nonEmpty).toBe(true);
  146 |   });
  147 | 
  148 |   // ── Flag de estado del sistema ─────────────────────────────────────────
  149 | 
  150 |   test('globalThis.__MENSAJERIA_INICIADA es exactamente true (no truthy)', async ({ page }) => {
  151 |     const val = await page.evaluate(() => globalThis.__MENSAJERIA_INICIADA);
  152 |     expect(val).toBe(true);
  153 |   });
  154 | 
  155 |   test('globalThis.__CONTROLADOR_REGISTRADOS existe y es un Set', async ({ page }) => {
  156 |     const info = await page.evaluate(() => {
  157 |       const s = globalThis.__CONTROLADOR_REGISTRADOS;
  158 |       return {
  159 |         exists: !!s,
  160 |         isSet: s instanceof Set,
  161 |       };
  162 |     });
  163 |     expect(info.exists).toBe(true);
  164 |     expect(info.isSet).toBe(true);
  165 |   });
  166 | });
  167 | 
```