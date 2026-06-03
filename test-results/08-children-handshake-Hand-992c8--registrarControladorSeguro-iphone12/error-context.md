# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-children-handshake.spec.js >> Handshake padre↔hijos — infraestructura (escenario 1d) >> HD-1c. Los tipos de handshake fueron registrados mediante registrarControladorSeguro
- Location: tests\e2e\08-children-handshake.spec.js:82:3

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
  2   |  * 08-children-handshake.spec.js
  3   |  *
  4   |  * Prerequisito DT-1 Opción B — escenario 1d:
  5   |  *   "El test debe afirmar que los 5 hijos completan el ciclo
  6   |  *   HIJO_PREPARADO → HIJO_LISTO antes de activar el modo AVENTURA."
  7   |  *
  8   |  * Qué se verifica:
  9   |  *   - El padre registra los handlers HIJO_PREPARADO y HIJO_LISTO antes de
  10  |  *     cargar cualquier iframe (los tipos deben estar en __CONTROLADOR_REGISTRADOS).
  11  |  *   - Tras la carga secuencial de iframes (FASE 3), todos los hijos conocidos
  12  |  *     aparecen en globalThis.estadoPadre.hijosInicializados.
  13  |  *   - El padre envía PADRE_DATOS / PADRE_CONFIRMA_HIJO_LISTO a cada hijo
  14  |  *     (se comprueba que los helpers internos existen y son funcionales).
  15  |  *   - La reconexión de un hijo fallido: el mecanismo de hijosFallidos +
  16  |  *     intentarReconectarHijosFallidos está expuesto y es invocable.
  17  |  *
  18  |  * NOTA: En el entorno de test no se cargan los iframes reales (las páginas hijas
  19  |  * no son servibles desde el servidor estático con todos sus módulos). Por eso los
  20  |  * tests de este spec verifican la INFRAESTRUCTURA del handshake (controladores
  21  |  * registrados, estructura de estadoPadre, funciones expuestas) en lugar de
  22  |  * ejecutar el ciclo completo extremo-a-extremo, que requeriría las páginas hijas
  23  |  * completamente funcionales.
  24  |  *
  25  |  * Escenarios que SÍ se pueden verificar sin páginas hijas:
  26  |  *   HD-1  Handlers HIJO_PREPARADO y HIJO_LISTO registrados antes de cargar iframes
  27  |  *   HD-2  globalThis.estadoPadre tiene la estructura esperada (Map, Set, flags)
  28  |  *   HD-3  Funciones de carga de iframes están expuestas en window
  29  |  *   HD-4  ACK: el controlador HIJO_PREPARADO envía PADRE_DATOS (lógica verificable
  30  |  *         inyectando un mensaje HIJO_PREPARADO sintético vía postMessage)
  31  |  *   HD-5  ACK: el controlador HIJO_LISTO actualiza estadoPadre.hijosInicializados
  32  |  *         (lógica verificable inyectando HIJO_LISTO sintético)
  33  |  *   HD-6  Función intentarReconectarHijosFallidos está expuesta en window
  34  |  */
  35  | 'use strict';
  36  | 
  37  | const { test, expect } = require('@playwright/test');
  38  | const path = require('path');
  39  | const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');
  40  | 
  41  | const LEAFLET_STUB = path.join(__dirname, 'helpers/leaflet-stub.js');
  42  | 
  43  | /** IDs de los 5 iframes hijos críticos */
  44  | const HIJOS_CRITICOS = ['hijo1-opciones', 'hijo2', 'hijo3', 'hijo4', 'hijo5'];
  45  | 
  46  | /** Tipos de mensaje requeridos para el handshake */
  47  | const TIPOS_HANDSHAKE = [
  48  |   'SISTEMA.HIJO_PREPARADO',
  49  |   'SISTEMA.HIJO_LISTO',
  50  | ];
  51  | 
  52  | test.describe('Handshake padre↔hijos — infraestructura (escenario 1d)', () => {
  53  |   test.beforeEach(async ({ page }) => {
  54  |     await page.addInitScript({ path: LEAFLET_STUB });
  55  |     await injectInitSpy(page);
  56  |     await stubCDNResources(page);
  57  |     await gotoAndWaitForFase1(page);
  58  |   });
  59  | 
  60  |   // ── HD-1: Handlers registrados antes de cargar iframes ────────────────
  61  | 
  62  |   test('HD-1a. HIJO_PREPARADO está en __CONTROLADOR_REGISTRADOS tras FASE 1', async ({ page }) => {
  63  |     const found = await page.evaluate((tipos) => {
  64  |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  65  |       if (!(registrados instanceof Set)) return false;
  66  |       // El tipo puede estar almacenado como string exacto o como valor resuelto de TIPOS_MENSAJE
  67  |       // Buscamos por substring para no depender del path exacto
  68  |       return [...registrados].some(t => String(t).includes('HIJO_PREPARADO'));
  69  |     }, TIPOS_HANDSHAKE);
  70  |     expect(found).toBe(true);
  71  |   });
  72  | 
  73  |   test('HD-1b. HIJO_LISTO está en __CONTROLADOR_REGISTRADOS tras FASE 1', async ({ page }) => {
  74  |     const found = await page.evaluate(() => {
  75  |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  76  |       if (!(registrados instanceof Set)) return false;
  77  |       return [...registrados].some(t => String(t).includes('HIJO_LISTO'));
  78  |     });
  79  |     expect(found).toBe(true);
  80  |   });
  81  | 
  82  |   test('HD-1c. Los tipos de handshake fueron registrados mediante registrarControladorSeguro', async ({ page }) => {
  83  |     const info = await page.evaluate(() => {
  84  |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  85  |       if (!(registrados instanceof Set)) return { ok: false, reason: 'Set no existe' };
  86  |       const tipos = [...registrados].map(String);
  87  |       return {
  88  |         ok: true,
  89  |         tieneHijoPre: tipos.some(t => t.includes('HIJO_PREPARADO')),
  90  |         tieneHijoListo: tipos.some(t => t.includes('HIJO_LISTO')),
  91  |         totalRegistrados: registrados.size,
  92  |       };
  93  |     });
> 94  |     expect(info.ok).toBe(true);
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  95  |     expect(info.tieneHijoPre).toBe(true);
  96  |     expect(info.tieneHijoListo).toBe(true);
  97  |     // Debe haber múltiples handlers registrados (no solo los 2 de handshake)
  98  |     expect(info.totalRegistrados).toBeGreaterThan(5);
  99  |   });
  100 | 
  101 |   // ── HD-2: Estructura de globalThis.estadoPadre ────────────────────────────
  102 | 
  103 |   test('HD-2a. globalThis.estadoPadre existe con estructura correcta', async ({ page }) => {
  104 |     const info = await page.evaluate(() => {
  105 |       const ep = globalThis.estadoPadre;
  106 |       if (!ep) return null;
  107 |       return {
  108 |         hasHijosInicializados: ep.hijosInicializados instanceof Set,
  109 |         hasHijosPreparados: ep.hijosPreparados instanceof Set || ep.hijosPreparados == null,
  110 |         hasEstadoHijos: ep.estadoHijos instanceof Map,
  111 |         hasModoActual: typeof ep.modoActual === 'string' || ep.modoActual == null,
  112 |         hasGps: typeof ep.gps === 'object',
  113 |       };
  114 |     });
  115 |     expect(info).not.toBeNull();
  116 |     expect(info.hasHijosInicializados).toBe(true);
  117 |     expect(info.hasEstadoHijos).toBe(true);
  118 |   });
  119 | 
  120 |   test('HD-2b. estadoPadre.hijosInicializados comienza vacío antes de cargar iframes', async ({ page }) => {
  121 |     // Inmediatamente tras FASE 1 (antes de FASE 3) el Set debe estar vacío
  122 |     // ya que los iframes no se cargan en el entorno de test (no hay páginas hijas)
  123 |     const size = await page.evaluate(() => {
  124 |       return globalThis.estadoPadre?.hijosInicializados?.size ?? -1;
  125 |     });
  126 |     // En entorno de test sin iframes reales debe ser 0
  127 |     expect(size).toBe(0);
  128 |   });
  129 | 
  130 |   test('HD-2c. estadoPadre.estadoHijos es un Map (aunque vacío inicialmente)', async ({ page }) => {
  131 |     const info = await page.evaluate(() => {
  132 |       const m = globalThis.estadoPadre?.estadoHijos;
  133 |       return {
  134 |         isMap: m instanceof Map,
  135 |         size: m instanceof Map ? m.size : -1,
  136 |       };
  137 |     });
  138 |     expect(info.isMap).toBe(true);
  139 |     expect(info.size).toBeGreaterThanOrEqual(0);
  140 |   });
  141 | 
  142 |   // ── HD-3: Funciones de carga expuestas ───────────────────────────────
  143 | 
  144 |   test('HD-3a. globalThis.cargarIframeSoloSeleccion está expuesta', async ({ page }) => {
  145 |     const ok = await page.evaluate(() => typeof globalThis.cargarIframeSoloSeleccion === 'function');
  146 |     expect(ok).toBe(true);
  147 |   });
  148 | 
  149 |   test('HD-3b. globalThis.cargarRestoDeiframes está expuesta', async ({ page }) => {
  150 |     const ok = await page.evaluate(() => typeof globalThis.cargarRestoDeiframes === 'function');
  151 |     expect(ok).toBe(true);
  152 |   });
  153 | 
  154 |   test('HD-3c. globalThis.cargarHijoCasa está expuesta', async ({ page }) => {
  155 |     const ok = await page.evaluate(() => typeof globalThis.cargarHijoCasa === 'function');
  156 |     expect(ok).toBe(true);
  157 |   });
  158 | 
  159 |   // ── HD-4: Controlador HIJO_PREPARADO — lógica de ACK ─────────────────
  160 |   //
  161 |   // Inyectamos un mensaje HIJO_PREPARADO sintético vía postMessage y verificamos
  162 |   // que el padre actualiza estadoPadre.hijosPreparados correctamente.
  163 | 
  164 |   test('HD-4. Mensaje HIJO_PREPARADO sintético actualiza estadoPadre.hijosPreparados', async ({ page }) => {
  165 |     // Asegurarnos de que hijosPreparados y estadoHijos están inicializados
  166 |     await page.evaluate(() => {
  167 |       if (!globalThis.estadoPadre) globalThis.estadoPadre = {};
  168 |       globalThis.estadoPadre.hijosPreparados = globalThis.estadoPadre.hijosPreparados || new Set();
  169 |       globalThis.estadoPadre.estadoHijos = globalThis.estadoPadre.estadoHijos || new Map();
  170 |       globalThis.estadoPadre.hijosInicializados = globalThis.estadoPadre.hijosInicializados || new Set();
  171 |     });
  172 | 
  173 |     const hijoId = 'hijo2';
  174 | 
  175 |     // Obtener el tipo exacto de HIJO_PREPARADO del contexto del padre
  176 |     const tipoHijoPre = await page.evaluate(() => {
  177 |       return globalThis.TIPOS_MENSAJE?.SISTEMA?.HIJO_PREPARADO ||
  178 |              globalThis.TIPOS_MENSAJE_S1?.SISTEMA?.HIJO_PREPARADO ||
  179 |              'SISTEMA.HIJO_PREPARADO';
  180 |     });
  181 | 
  182 |     // Inyectar el mensaje vía postMessage (el listener está en window)
  183 |     await page.evaluate(({ tipo, hijoId }) => {
  184 |       globalThis.postMessage({
  185 |         tipo,
  186 |         origen: hijoId,
  187 |         destino: 'padre',
  188 |         datos: { version: '1.0.0', capacidades: ['gps', 'mapa'] },
  189 |         timestamp: Date.now(),
  190 |       }, globalThis.location.origin);
  191 |     }, { tipo: tipoHijoPre, hijoId });
  192 | 
  193 |     // Dar tiempo al handler async para ejecutarse
  194 |     await page.waitForTimeout(500);
```