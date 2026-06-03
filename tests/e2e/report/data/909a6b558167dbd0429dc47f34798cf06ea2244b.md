# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07-performance-baseline.spec.js >> Performance baseline — arranque FASE 1 (pre-refactor) >> PB-4. DT-1 criterio #5: __vv_manejadoresLocales está vacío (handlers en state-manager, no en local)
- Location: tests\e2e\07-performance-baseline.spec.js:248:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForFunction: Test timeout of 60000ms exceeded.
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
  152 |       const localLeakTypes = (() => {
  153 |         const local = globalThis.__vv_manejadoresLocales;
  154 |         if (!local) return [];
  155 |         if (local instanceof Map) return [...local.keys()].sort();
  156 |         return Object.keys(local).sort();
  157 |       })();
  158 | 
  159 |       return { handlerCount, setSize, localLeak, registeredTypes, localLeakTypes };
  160 |     });
  161 | 
  162 |     // Log del baseline para documentar
  163 |     console.log(`
  164 |     ┌─────────────────────────────────────────────────────────────┐
  165 |     │  HANDLER BASELINE — pre-refactor (DT-1 Opción B)            │
  166 |     ├─────────────────────────────────────────────────────────────┤
  167 |     │  state-manager handler count : ${baseline.handlerCount.toString().padStart(4)}                      │
  168 |     │  __CONTROLADOR_REGISTRADOS   : ${baseline.setSize.toString().padStart(4)} tipos                 │
  169 |     │  __vv_manejadoresLocales     : ${baseline.localLeak.toString().padStart(4)} (debe ser 0)         │
  170 |     ├─────────────────────────────────────────────────────────────┤
  171 |     │  Tipos registrados:                                         │`);
  172 |     for (const t of baseline.registeredTypes) {
  173 |       console.log(`    │    ${t.padEnd(55)}│`);
  174 |     }
  175 |     console.log(`    └─────────────────────────────────────────────────────────────┘`);
  176 |     if (baseline.localLeak > 0) {
  177 |       console.log(`    ⚠️  FUGAS en __vv_manejadoresLocales (${baseline.localLeak} tipos):`);
  178 |       for (const t of baseline.localLeakTypes) {
  179 |         console.log(`       - ${t}`);
  180 |       }
  181 |     }
  182 | 
  183 |     // Assertions que DEBEN pasar ahora y tras el refactor:
  184 |     expect(baseline.handlerCount).toBeGreaterThan(0); // hay handlers registrados
  185 |     expect(baseline.setSize).toBeGreaterThan(0);       // el Set tiene entradas
  186 |     expect(baseline.localLeak).toBe(0);                // DT-1 criterio #5: cero fugas al mapa local
  187 |   });
  188 | 
  189 |   // ── Baseline de memoria global expuesta ───────────────────────────────
  190 |   //
  191 |   // Verifica que el conjunto de variables globales que el refactor debe
  192 |   // PRESERVAR están todas presentes. Es una suma de spec 02 aplicada
  193 |   // como guardia de regresión explícita para la extracción.
  194 | 
  195 |   test('PB-3. Baseline: variables globales críticas presentes y con los tipos correctos', async ({ page }) => {
  196 |     await page.addInitScript({ path: LEAFLET_STUB });
  197 |     await stubCDNResources(page);
  198 |     await page.goto('/codigo-padre.html');
  199 |     await page.waitForFunction(() => globalThis.__MENSAJERIA_INICIADA === true, { timeout: BOOT_TIMEOUT_THRESHOLD_MS });
  200 | 
  201 |     const snapshot = await page.evaluate(() => ({
  202 |       TIPOS_MENSAJE:                typeof globalThis.TIPOS_MENSAJE,
  203 |       MODOS:                        typeof globalThis.MODOS,
  204 |       registrarControlador:         typeof globalThis.registrarControlador,
  205 |       enviarMensaje:                typeof globalThis.enviarMensaje,
  206 |       enviarMensajeConConfirmacion: typeof globalThis.enviarMensajeConConfirmacion,
  207 |       logger:                       typeof globalThis.logger,
  208 |       esTelefonoMovil:              typeof globalThis.esTelefonoMovil,
  209 |       ajustarTimeoutPorConexion:    typeof globalThis.ajustarTimeoutPorConexion,
  210 |       ajustarTimeoutPorConexionSafe:typeof globalThis.ajustarTimeoutPorConexionSafe,
  211 |       CONFIG_PADRE:                 typeof globalThis.CONFIG_PADRE,
  212 |       getPadreId:                   typeof globalThis.getPadreId,
  213 |       MENSAJERIA_INICIADA:          globalThis.__MENSAJERIA_INICIADA,
  214 |       stateManager:                 typeof globalThis.__vv_stateManager,
  215 |       mensajeria:                   typeof globalThis.mensajeria,
  216 |       registrarControladorSeguro:   typeof globalThis.registrarControladorSeguro,
  217 |       procesarControladoresPendientes: typeof globalThis.procesarControladoresPendientes,
  218 |       cargarDatosAventuraDiferidos: typeof globalThis.__cargarDatosAventuraDiferidos,
  219 |     }));
  220 | 
  221 |     // Todas estas deben ser 'object' o 'function' tras el refactor — NUNCA 'undefined'
  222 |     expect(snapshot.TIPOS_MENSAJE).toBe('object');
  223 |     expect(snapshot.MODOS).toBe('object');
  224 |     expect(snapshot.registrarControlador).toBe('function');
  225 |     expect(snapshot.enviarMensaje).toBe('function');
  226 |     expect(snapshot.enviarMensajeConConfirmacion).toBe('function');
  227 |     expect(snapshot.logger).toBe('object');
  228 |     expect(['boolean', 'function']).toContain(snapshot.esTelefonoMovil);
  229 |     expect(snapshot.ajustarTimeoutPorConexion).toBe('function');
  230 |     expect(snapshot.ajustarTimeoutPorConexionSafe).toBe('function');
  231 |     expect(snapshot.CONFIG_PADRE).toBe('object');
  232 |     expect(snapshot.getPadreId).toBe('function');
  233 |     expect(snapshot.MENSAJERIA_INICIADA).toBe(true);
  234 |     expect(snapshot.stateManager).toBe('object');
  235 |     expect(snapshot.mensajeria).toBe('object');
  236 |     expect(snapshot.registrarControladorSeguro).toBe('function');
  237 |     expect(snapshot.procesarControladoresPendientes).toBe('function');
  238 |     expect(snapshot.cargarDatosAventuraDiferidos).toBe('function');
  239 |   });
  240 | 
  241 |   // ── Test de no-regresión de criterio DT-1 #5 ─────────────────────────
  242 |   //
  243 |   // Criterio: "No aparece ninguna llamada a __vv_manejadoresLocales en los
  244 |   //            logs de producción (indicaría que un handler no llegó al state-manager)"
  245 |   //
  246 |   // Lo que podemos verificar en E2E: que el Map local está vacío DESPUÉS del boot.
  247 | 
  248 |   test('PB-4. DT-1 criterio #5: __vv_manejadoresLocales está vacío (handlers en state-manager, no en local)', async ({ page }) => {
  249 |     await page.addInitScript({ path: LEAFLET_STUB });
  250 |     await stubCDNResources(page);
  251 |     await page.goto('/codigo-padre.html');
> 252 |     await page.waitForFunction(() => globalThis.__MENSAJERIA_INICIADA === true, { timeout: BOOT_TIMEOUT_THRESHOLD_MS });
      |                ^ Error: page.waitForFunction: Test timeout of 60000ms exceeded.
  253 | 
  254 |     const leakCount = await page.evaluate(() => {
  255 |       const local = globalThis.__vv_manejadoresLocales;
  256 |       if (!local) return 0;
  257 |       if (local instanceof Map) return local.size;
  258 |       return Object.keys(local).length;
  259 |     });
  260 | 
  261 |     // Cero fugas es el criterio de aceptación del refactor
  262 |     expect(leakCount).toBe(0);
  263 |   });
  264 | });
  265 | 
```