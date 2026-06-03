# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 09-mode-change.spec.js >> Protocolo de cambio de modo — escenario 1e >> MC-10. Los 4 tipos del protocolo completo existen: CAMBIO_MODO + ENTENDIDO + EFECTUADO + RESPONSE
- Location: tests\e2e\09-mode-change.spec.js:312:3

# Error details

```
Error: expect(received).not.toBeNull()

Received: null
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
  223 |     const count = await page.evaluate(() => {
  224 |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  225 |       if (!(registrados instanceof Set)) return -1;
  226 |       const matches = [...registrados].filter(t => String(t).includes('CAMBIO_MODO_EFECTUADO'));
  227 |       return matches.length;
  228 |     });
  229 |     expect(count).toBeLessThanOrEqual(1);
  230 |   });
  231 | 
  232 |   test('MC-6c. __CONTROLADOR_REGISTRADOS es un Set (garantía de unicidad)', async ({ page }) => {
  233 |     const ok = await page.evaluate(() => globalThis.__CONTROLADOR_REGISTRADOS instanceof Set);
  234 |     expect(ok).toBe(true);
  235 |   });
  236 | 
  237 |   // ── MC-7: HEARTBEAT — no arranca en modo CASA ─────────────────────────
  238 |   //
  239 |   // Escenario 1h (partial): verificar que en modo CASA (estado inicial tras FASE 1)
  240 |   // el heartbeat no se ha iniciado. El heartbeat solo debe iniciarse tras cambiar
  241 |   // el modo a AVENTURA.
  242 | 
  243 |   test('MC-7a. En modo CASA (inicial), el heartbeat no está activo', async ({ page }) => {
  244 |     const info = await page.evaluate(() => {
  245 |       // Indicadores de heartbeat activo
  246 |       const tieneInterval = typeof globalThis.__heartbeatInterval !== 'undefined' &&
  247 |                             globalThis.__heartbeatInterval !== null;
  248 |       const tieneFlag = globalThis.__heartbeatActivo === true ||
  249 |                         globalThis.__vv_heartbeatActivo === true;
  250 |       const modoActual = globalThis.estadoPadre?.modoActual ||
  251 |                          globalThis.estadoPadre?.modo?.actual ||
  252 |                          null;
  253 |       return { tieneInterval, tieneFlag, modoActual };
  254 |     });
  255 |     // En modo CASA (estado inicial) el heartbeat no debe estar corriendo
  256 |     expect(info.tieneInterval || info.tieneFlag).toBe(false);
  257 |   });
  258 | 
  259 |   test('MC-7b. HEARTBEAT y HEARTBEAT_RESPONSE están en __CONTROLADOR_REGISTRADOS', async ({ page }) => {
  260 |     const info = await page.evaluate(() => {
  261 |       const registrados = globalThis.__CONTROLADOR_REGISTRADOS;
  262 |       if (!(registrados instanceof Set)) return { ok: false };
  263 |       const tipos = [...registrados].map(String);
  264 |       return {
  265 |         ok: true,
  266 |         tieneHeartbeat: tipos.some(t => t.includes('HEARTBEAT') && !t.includes('RESPONSE') && !t.includes('START') && !t.includes('PAUSE')),
  267 |         tieneHeartbeatResponse: tipos.some(t => t.includes('HEARTBEAT_RESPONSE')),
  268 |       };
  269 |     });
  270 |     expect(info.ok).toBe(true);
  271 |     expect(info.tieneHeartbeat).toBe(true);
  272 |     expect(info.tieneHeartbeatResponse).toBe(true);
  273 |   });
  274 | 
  275 |   // ── MC-8: pendingModeChanges Map ─────────────────────────────────────
  276 | 
  277 |   test('MC-8. globalThis.pendingModeChanges existe como Map (reenvíos tras HIJO_LISTO)', async ({ page }) => {
  278 |     const info = await page.evaluate(() => {
  279 |       const pmc = globalThis.pendingModeChanges;
  280 |       return {
  281 |         existe: pmc != null,
  282 |         esMap: pmc instanceof Map,
  283 |         estaVacio: pmc instanceof Map ? pmc.size === 0 : null,
  284 |       };
  285 |     });
  286 |     // pendingModeChanges puede no existir si ningún cambio de modo ha fallado aún
  287 |     // En ese caso es undefined, lo que también es correcto (se crea on-demand)
  288 |     if (info.existe) {
  289 |       expect(info.esMap).toBe(true);
  290 |       expect(info.estaVacio).toBe(true);
  291 |     }
  292 |     // Si no existe, el test pasa silenciosamente (comportamiento correcto en cold start)
  293 |   });
  294 | 
  295 |   // ── MC-9: MODOS disponibles ───────────────────────────────────────────
  296 | 
  297 |   test('MC-9. MODOS.CASA y MODOS.AVENTURA están definidos en window', async ({ page }) => {
  298 |     const modos = await page.evaluate(() => {
  299 |       const m = globalThis.MODOS;
  300 |       if (!m) return null;
  301 |       return { casa: m.CASA, aventura: m.AVENTURA };
  302 |     });
  303 |     expect(modos).not.toBeNull();
  304 |     expect(modos.casa).toBeTruthy();
  305 |     expect(modos.aventura).toBeTruthy();
  306 |     // Deben ser strings distintos
  307 |     expect(modos.casa).not.toBe(modos.aventura);
  308 |   });
  309 | 
  310 |   // ── MC-10: Tipos de control del protocolo completo ────────────────────
  311 | 
  312 |   test('MC-10. Los 4 tipos del protocolo completo existen: CAMBIO_MODO + ENTENDIDO + EFECTUADO + RESPONSE', async ({ page }) => {
  313 |     const tipos = await page.evaluate(() => {
  314 |       const tm = globalThis.TIPOS_MENSAJE || globalThis.TIPOS_MENSAJE_S1;
  315 |       if (!tm?.SISTEMA) return null;
  316 |       return {
  317 |         cambioModo: !!tm.SISTEMA.CAMBIO_MODO,
  318 |         entendido: !!tm.SISTEMA.CAMBIO_MODO_ENTENDIDO,
  319 |         efectuado: !!tm.SISTEMA.CAMBIO_MODO_EFECTUADO,
  320 |         response: !!tm.SISTEMA.CAMBIO_MODO_RESPONSE,
  321 |       };
  322 |     });
> 323 |     expect(tipos).not.toBeNull();
      |                       ^ Error: expect(received).not.toBeNull()
  324 |     expect(tipos.cambioModo).toBe(true);
  325 |     expect(tipos.entendido).toBe(true);
  326 |     expect(tipos.efectuado).toBe(true);
  327 |     expect(tipos.response).toBe(true);
  328 |   });
  329 | });
  330 | 
```