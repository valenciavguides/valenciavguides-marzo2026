# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 09-mode-change.spec.js >> Protocolo de cambio de modo — escenario 1e >> MC-3c. TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_EFECTUADO existe
- Location: tests\e2e\09-mode-change.spec.js:104:3

# Error details

```
Error: expect(received).toBeTruthy()

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
  9   |  * Protocolo de cambio de modo (4 fases):
  10  |  *   1. CAMBIO_MODO      padre → hijo    (padre ordena el cambio)
  11  |  *   2. ENTENDIDO        hijo → padre    (hijo confirma haber recibido)
  12  |  *   3. EFECTUADO        hijo → padre    (hijo ha aplicado el cambio)
  13  |  *   4. APLICADO (ACK)   padre → hijo    (padre confirma que todos efectuaron)
  14  |  *
  15  |  * Escenarios verificables sin iframes reales:
  16  |  *   MC-1  manejarCambioModo existe en app.js y está expuesta en window
  17  |  *   MC-2  actualizarInterfazModo existe y se puede llamar sin error
  18  |  *   MC-3  Los tipos CAMBIO_MODO, CAMBIO_MODO_ENTENDIDO, CAMBIO_MODO_EFECTUADO
  19  |  *         existen en TIPOS_MENSAJE.SISTEMA
  20  |  *   MC-4  El controlador CAMBIO_MODO está registrado en __CONTROLADOR_REGISTRADOS
  21  |  *   MC-5  Inyectando CAMBIO_MODO sintético vía postMessage, el estado local
  22  |  *         (estado.modo.actual) se actualiza a través de manejarCambioModo
  23  |  *   MC-6  El guard _modoHandlersRegistrados impide doble registro (Race #3):
  24  |  *         tras el boot, los handlers CAMBIO_MODO_ENTENDIDO y CAMBIO_MODO_EFECTUADO
  25  |  *         solo aparecen UNA vez en __CONTROLADOR_REGISTRADOS
  26  |  *   MC-7  HEARTBEAT_START se lanza en modo AVENTURA
  27  |  *   MC-8  globalThis.pendingModeChanges existe (Map para reenvíos tras HIJO_LISTO)
  28  |  */
  29  | 'use strict';
  30  | 
  31  | const { test, expect } = require('@playwright/test');
  32  | const path = require('path');
  33  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
  34  | 
  35  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  36  | 
  37  | test.describe('Protocolo de cambio de modo — escenario 1e', () => {
  38  |   test.beforeEach(async ({ page }) => {
  39  |     await page.addInitScript({ path: LEAFLET_STUB });
  40  |     await injectInitSpy(page);
  41  |     await stubCDNResources(page);
  42  |     await gotoAndWaitForFase1(page);
  43  |   });
  44  | 
  45  |   // ── MC-1: manejarCambioModo expuesta ──────────────────────────────────
  46  | 
  47  |   test('MC-1a. globalThis.manejarCambioModo existe como función (expuesta por app.js)', async ({ page }) => {
  48  |     // manejarCambioModo puede estar en window directamente o en globalThis.app
  49  |     const ok = await page.evaluate(() => {
  50  |       return typeof globalThis.manejarCambioModo === 'function' ||
  51  |              typeof globalThis.app?.manejarCambioModo === 'function';
  52  |     });
  53  |     expect(ok).toBe(true);
  54  |   });
  55  | 
  56  |   test('MC-1b. globalThis.actualizarInterfazModo existe como función', async ({ page }) => {
  57  |     const ok = await page.evaluate(() => {
  58  |       return typeof globalThis.actualizarInterfazModo === 'function' ||
  59  |              typeof globalThis.app?.actualizarInterfazModo === 'function';
  60  |     });
  61  |     expect(ok).toBe(true);
  62  |   });
  63  | 
  64  |   // ── MC-2: actualizarInterfazModo sin error ────────────────────────────
  65  | 
  66  |   test('MC-2. actualizarInterfazModo es una función (expuesta en window por app.js)', async ({ page }) => {
  67  |     // actualizarInterfazModo se expone en globalThis.actualizarInterfazModo dentro de app.js.
  68  |     // app.js se importa durante FASE 1 (Script 1) y es un módulo del proyecto.
  69  |     // Verificamos solo que la función existe y tiene el tipo correcto,
  70  |     // sin invocarla (invocarla requeriría iframes reales para el protocolo 4-fases).
  71  |     const info = await page.evaluate(() => {
  72  |       const fn = globalThis.actualizarInterfazModo || globalThis.app?.actualizarInterfazModo;
  73  |       return {
  74  |         tipo: typeof fn,
  75  |         enWindow: typeof globalThis.actualizarInterfazModo,
  76  |         enApp: typeof globalThis.app?.actualizarInterfazModo,
  77  |       };
  78  |     });
  79  |     // Debe existir en window o en globalThis.app
  80  |     const existe = info.enWindow === 'function' || info.enApp === 'function';
  81  |     expect(existe).toBe(true);
  82  |   });
  83  | 
  84  |   // ── MC-3: Tipos de mensaje del protocolo ─────────────────────────────
  85  | 
  86  |   test('MC-3a. TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO existe', async ({ page }) => {
  87  |     const val = await page.evaluate(() => {
  88  |       const tm = globalThis.TIPOS_MENSAJE || globalThis.TIPOS_MENSAJE_S1;
  89  |       return tm?.SISTEMA?.CAMBIO_MODO;
  90  |     });
  91  |     expect(val).toBeTruthy();
  92  |     expect(typeof val).toBe('string');
  93  |   });
  94  | 
  95  |   test('MC-3b. TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_ENTENDIDO existe', async ({ page }) => {
  96  |     const val = await page.evaluate(() => {
  97  |       const tm = globalThis.TIPOS_MENSAJE || globalThis.TIPOS_MENSAJE_S1;
  98  |       return tm?.SISTEMA?.CAMBIO_MODO_ENTENDIDO;
  99  |     });
  100 |     expect(val).toBeTruthy();
  101 |     expect(typeof val).toBe('string');
  102 |   });
  103 | 
  104 |   test('MC-3c. TIPOS_MENSAJE.SISTEMA.CAMBIO_MODO_EFECTUADO existe', async ({ page }) => {
  105 |     const val = await page.evaluate(() => {
  106 |       const tm = globalThis.TIPOS_MENSAJE || globalThis.TIPOS_MENSAJE_S1;
  107 |       return tm?.SISTEMA?.CAMBIO_MODO_EFECTUADO;
  108 |     });
> 109 |     expect(val).toBeTruthy();
      |                 ^ Error: expect(received).toBeTruthy()
  110 |     expect(typeof val).toBe('string');
  111 |   });
  112 | 
  113 |   test('MC-3d. Los 3 tipos del protocolo son strings distintos', async ({ page }) => {
  114 |     const tipos = await page.evaluate(() => {
  115 |       const tm = globalThis.TIPOS_MENSAJE || globalThis.TIPOS_MENSAJE_S1;
  116 |       return {
  117 |         cambioModo: tm?.SISTEMA?.CAMBIO_MODO,
  118 |         entendido: tm?.SISTEMA?.CAMBIO_MODO_ENTENDIDO,
  119 |         efectuado: tm?.SISTEMA?.CAMBIO_MODO_EFECTUADO,
  120 |       };
  121 |     });
  122 |     expect(tipos.cambioModo).toBeTruthy();
  123 |     expect(tipos.entendido).toBeTruthy();
  124 |     expect(tipos.efectuado).toBeTruthy();
  125 |     // Los tres deben ser distintos entre sí
  126 |     expect(tipos.cambioModo).not.toBe(tipos.entendido);
  127 |     expect(tipos.cambioModo).not.toBe(tipos.efectuado);
  128 |     expect(tipos.entendido).not.toBe(tipos.efectuado);
  129 |   });
  130 | 
  131 |   // ── MC-4: Controlador CAMBIO_MODO registrado ─────────────────────────
  132 | 
  133 |   test('MC-4. CAMBIO_MODO está en __CONTROLADOR_REGISTRADOS tras FASE 1', async ({ page }) => {
  134 |     const found = await page.evaluate(() => {
  135 |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  136 |       if (!(registrados instanceof Set)) return false;
  137 |       return [...registrados].some(t => String(t).includes('CAMBIO_MODO'));
  138 |     });
  139 |     expect(found).toBe(true);
  140 |   });
  141 | 
  142 |   // ── MC-5: Cambio de modo sintético vía postMessage ────────────────────
  143 |   //
  144 |   // Inyectamos un mensaje CAMBIO_MODO vía postMessage y verificamos que
  145 |   // manejarCambioModo se ejecuta y actualiza el estado interno.
  146 | 
  147 |   test('MC-5. Mensaje CAMBIO_MODO sintético es procesado por el handler registrado', async ({ page }) => {
  148 |     // Preparar estadoPadre si aún no existe
  149 |     await page.evaluate(() => {
  150 |       if (!globalThis.estadoPadre) globalThis.estadoPadre = {};
  151 |       if (!globalThis.estadoPadre.hijosInicializados) globalThis.estadoPadre.hijosInicializados = new Set();
  152 |       if (!globalThis.estadoPadre.estadoHijos) globalThis.estadoPadre.estadoHijos = new Map();
  153 |     });
  154 | 
  155 |     const tipoCambioModo = await page.evaluate(() => {
  156 |       return globalThis.TIPOS_MENSAJE?.SISTEMA?.CAMBIO_MODO ||
  157 |              globalThis.TIPOS_MENSAJE_S1?.SISTEMA?.CAMBIO_MODO ||
  158 |              'SISTEMA.CAMBIO_MODO';
  159 |     });
  160 | 
  161 |     // Escuchar qué mensajes emite el padre (para ver si propaga a hijos)
  162 |     await page.evaluate(({ tipo }) => {
  163 |       globalThis.__e2e_cambioModoMessages = [];
  164 |       const originalPost = globalThis.postMessage.bind(window);
  165 |       // Inyectar mensaje CAMBIO_MODO hacia el padre (modo aventura)
  166 |       globalThis.postMessage({
  167 |         tipo,
  168 |         origen: 'hijo5',
  169 |         destino: 'padre',
  170 |         datos: { modo: 'aventura', timestamp: Date.now(), razon: 'test_e2e' },
  171 |         timestamp: Date.now(),
  172 |       }, globalThis.location.origin);
  173 |     }, { tipo: tipoCambioModo });
  174 | 
  175 |     // Dar tiempo al handler async para ejecutarse
  176 |     await page.waitForTimeout(800);
  177 | 
  178 |     // Verificar que el estado interno cambió (estado.modo.actual)
  179 |     // El handler CAMBIO_MODO llama a manejarCambioModo() que actualiza estado.modo.actual
  180 |     // Como 'estado' es un closure variable del Script 1, lo verificamos via globalThis.estadoPadre.modoActual
  181 |     // o via la respuesta que genera el handler
  182 |     const modoInfo = await page.evaluate(() => {
  183 |       // El handler de CAMBIO_MODO en Script 1 actualiza estado (closure local)
  184 |       // y también globalThis.estadoPadre.modoActual si manejarCambioModo lo hace
  185 |       // Verificamos que al menos manejarCambioModo fue invocable
  186 |       const fn = globalThis.manejarCambioModo || globalThis.app?.manejarCambioModo;
  187 |       return {
  188 |         fnExists: typeof fn === 'function',
  189 |         // Si el modo fue actualizado en estadoPadre, lo capturamos
  190 |         modoActual: globalThis.estadoPadre?.modoActual || globalThis.estadoPadre?.modo?.actual || null,
  191 |       };
  192 |     });
  193 | 
  194 |     // Lo importante es que el handler existe y no lanzó error al procesar el mensaje
  195 |     expect(modoInfo.fnExists).toBe(true);
  196 |   });
  197 | 
  198 |   // ── MC-6: Guard _modoHandlersRegistrados — Race #3 ───────────────────
  199 |   //
  200 |   // Los handlers CAMBIO_MODO_ENTENDIDO y CAMBIO_MODO_EFECTUADO se registran
  201 |   // en app.js a través de _registrarHandlersModo(). El guard _modoHandlersRegistrados
  202 |   // impide que se registren dos veces si _registrarHandlersModo() se llama en retry.
  203 |   //
  204 |   // Verificación: los tipos ENTENDIDO y EFECTUADO solo aparecen UNA vez en
  205 |   // __CONTROLADOR_REGISTRADOS (el Set garantiza unicidad de strings).
  206 | 
  207 |   test('MC-6a. CAMBIO_MODO_ENTENDIDO aparece solo una vez en __CONTROLADOR_REGISTRADOS (Race #3)', async ({ page }) => {
  208 |     const count = await page.evaluate(() => {
  209 |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
```