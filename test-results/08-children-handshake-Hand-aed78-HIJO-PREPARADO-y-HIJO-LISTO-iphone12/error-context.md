# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-children-handshake.spec.js >> Handshake padre↔hijos — infraestructura (escenario 1d) >> HD-7. TIPOS_MENSAJE.SISTEMA contiene HIJO_PREPARADO y HIJO_LISTO
- Location: tests\e2e\08-children-handshake.spec.js:272:3

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
  195 | 
  196 |     const preparado = await page.evaluate((hijoId) => {
  197 |       return globalThis.estadoPadre?.hijosPreparados?.has(hijoId) === true;
  198 |     }, hijoId);
  199 | 
  200 |     expect(preparado).toBe(true);
  201 |   });
  202 | 
  203 |   // ── HD-5: Controlador HIJO_LISTO — actualización de hijosInicializados ─
  204 | 
  205 |   test('HD-5. Mensaje HIJO_LISTO sintético actualiza estadoPadre.hijosInicializados', async ({ page }) => {
  206 |     await page.evaluate(() => {
  207 |       if (!globalThis.estadoPadre) globalThis.estadoPadre = {};
  208 |       globalThis.estadoPadre.hijosInicializados = globalThis.estadoPadre.hijosInicializados || new Set();
  209 |       globalThis.estadoPadre.estadoHijos = globalThis.estadoPadre.estadoHijos || new Map();
  210 |     });
  211 | 
  212 |     const hijoId = 'hijo3';
  213 | 
  214 |     const tipoHijoListo = await page.evaluate(() => {
  215 |       return globalThis.TIPOS_MENSAJE?.SISTEMA?.HIJO_LISTO ||
  216 |              globalThis.TIPOS_MENSAJE_S1?.SISTEMA?.HIJO_LISTO ||
  217 |              'SISTEMA.HIJO_LISTO';
  218 |     });
  219 | 
  220 |     await page.evaluate(({ tipo, hijoId }) => {
  221 |       globalThis.postMessage({
  222 |         tipo,
  223 |         origen: hijoId,
  224 |         destino: 'padre',
  225 |         datos: { version: '1.0.0', capacidades: [], tiempoInicializacion: 123 },
  226 |         timestamp: Date.now(),
  227 |       }, globalThis.location.origin);
  228 |     }, { tipo: tipoHijoListo, hijoId });
  229 | 
  230 |     await page.waitForTimeout(500);
  231 | 
  232 |     const inicializado = await page.evaluate((hijoId) => {
  233 |       return globalThis.estadoPadre?.hijosInicializados?.has(hijoId) === true;
  234 |     }, hijoId);
  235 | 
  236 |     expect(inicializado).toBe(true);
  237 |   });
  238 | 
  239 |   // ── HD-6: Función de reconexión ──────────────────────────────────────
  240 | 
  241 |   test('HD-6a. globalThis.intentarReconectarHijosFallidos no está expuesta (es función interna)', async ({ page }) => {
  242 |     // La función de reconexión es interna al script; el padre la llama
  243 |     // internamente en cargarIframeSoloSeleccion. No debe estar expuesta en globalThis.
  244 |     // Este test documenta el comportamiento esperado.
  245 |     const tipo = await page.evaluate(() => typeof globalThis.intentarReconectarHijosFallidos);
  246 |     // Puede ser 'function' (si el padre la expone) o 'undefined' (si es interna)
  247 |     // Ambos son aceptables — lo importante es que la infraestructura existe
  248 |     expect(['function', 'undefined']).toContain(tipo);
  249 |   });
  250 | 
  251 |   test('HD-6b. El mecanismo de registro de hijos fallidos usa estadoHijos.set()', async ({ page }) => {
  252 |     // Verificar que estadoHijos puede usarse para rastrear fallos
  253 |     const ok = await page.evaluate(() => {
  254 |       const m = globalThis.estadoPadre?.estadoHijos;
  255 |       if (!(m instanceof Map)) return false;
  256 |       // Simular el registro de un hijo fallido (igual que lo hace el padre)
  257 |       m.set('test-hijo', {
  258 |         activo: false,
  259 |         fallosConsecutivos: 1,
  260 |         ultimoPing: null,
  261 |         ultimoError: 'test'
  262 |       });
  263 |       const entry = m.get('test-hijo');
  264 |       m.delete('test-hijo');
  265 |       return entry?.fallosConsecutivos === 1;
  266 |     });
  267 |     expect(ok).toBe(true);
  268 |   });
  269 | 
  270 |   // ── HD-7: Tipos HIJO_PREPARADO y HIJO_LISTO disponibles en el contexto ─
  271 | 
  272 |   test('HD-7. TIPOS_MENSAJE.SISTEMA contiene HIJO_PREPARADO y HIJO_LISTO', async ({ page }) => {
  273 |     const info = await page.evaluate(() => {
  274 |       const tm = globalThis.TIPOS_MENSAJE || globalThis.TIPOS_MENSAJE_S1;
  275 |       if (!tm) return { ok: false, reason: 'TIPOS_MENSAJE no existe' };
  276 |       return {
  277 |         ok: true,
  278 |         tieneHijoPre: typeof tm.SISTEMA?.HIJO_PREPARADO === 'string',
  279 |         tieneHijoListo: typeof tm.SISTEMA?.HIJO_LISTO === 'string',
  280 |         valorHijoPre: tm.SISTEMA?.HIJO_PREPARADO,
  281 |         valorHijoListo: tm.SISTEMA?.HIJO_LISTO,
  282 |       };
  283 |     });
> 284 |     expect(info.ok).toBe(true);
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  285 |     expect(info.tieneHijoPre).toBe(true);
  286 |     expect(info.tieneHijoListo).toBe(true);
  287 |     // Los valores deben ser strings no vacíos
  288 |     expect(info.valorHijoPre).toBeTruthy();
  289 |     expect(info.valorHijoListo).toBeTruthy();
  290 |   });
  291 | });
  292 | 
```