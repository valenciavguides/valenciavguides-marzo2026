# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 06-race-conditions.spec.js >> Race conditions documentadas — DT-1 Opción B >> Race #4b. globalThis.mensajeria.enviarMensaje existe (necesario para Script 2)
- Location: tests\e2e\06-race-conditions.spec.js:222:3

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
  124 |   test('Race #3a. __CONTROLADOR_REGISTRADOS es un Set con entradas tras el boot', async ({ page }) => {
  125 |     const info = await page.evaluate(() => {
  126 |       const s = globalThis.__CONTROLADOR_REGISTRADOS;
  127 |       return {
  128 |         isSet: s instanceof Set,
  129 |         size: s instanceof Set ? s.size : -1,
  130 |       };
  131 |     });
  132 |     expect(info.isSet).toBe(true);
  133 |     expect(info.size).toBeGreaterThan(0);
  134 |   });
  135 | 
  136 |   test('Race #3b. registrarControladorSeguro ignora tipo ya registrado (no crece el Set)', async ({ page }) => {
  137 |     const result = await page.evaluate(() => {
  138 |       const fn = globalThis.registrarControladorSeguro;
  139 |       const s = globalThis.__CONTROLADOR_REGISTRADOS;
  140 |       if (typeof fn !== 'function' || !(s instanceof Set)) {
  141 |         return { skip: true };
  142 |       }
  143 | 
  144 |       // Usar un tipo ficticio para no interferir con handlers reales
  145 |       const tipoTest = '__E2E_RACE3_TEST__';
  146 | 
  147 |       // Primera llamada — debe registrarse
  148 |       const sizeBefore = s.size;
  149 |       fn(tipoTest, () => {});
  150 |       const sizeAfter1 = s.size;
  151 | 
  152 |       // Segunda llamada con mismo tipo — el guard debe ignorarla
  153 |       fn(tipoTest, () => {});
  154 |       const sizeAfter2 = s.size;
  155 | 
  156 |       return {
  157 |         sizeBefore,
  158 |         sizeAfter1,
  159 |         sizeAfter2,
  160 |         firstCallAdded: sizeAfter1 === sizeBefore + 1,
  161 |         secondCallIgnored: sizeAfter2 === sizeAfter1, // tamaño no creció
  162 |       };
  163 |     });
  164 | 
  165 |     if (result.skip) {
  166 |       // Si no hay registrarControladorSeguro disponible, skip no es un fallo
  167 |       console.warn('[WARN] registrarControladorSeguro no disponible — test saltado');
  168 |       return;
  169 |     }
  170 | 
  171 |     expect(result.firstCallAdded).toBe(true);
  172 |     expect(result.secondCallIgnored).toBe(true);
  173 |   });
  174 | 
  175 |   test('Race #3c. los handlers de modo CAMBIO_MODO_ENTENDIDO/EFECTUADO están en el Set (no hubo doble registro)', async ({ page }) => {
  176 |     // Si _registrarHandlersModo() se hubiera llamado dos veces, ambos tipos
  177 |     // aparecerían solo UNA vez en el Set (el guard lo garantiza).
  178 |     // Lo que podemos verificar: si el Set tiene esos tipos, fue porque el primer
  179 |     // registro tuvo éxito; no hay posibilidad de que estén dos veces.
  180 |     // (Un Set no puede tener duplicados por definición.)
  181 |     const info = await page.evaluate(() => {
  182 |       const s = globalThis.__CONTROLADOR_REGISTRADOS;
  183 |       if (!(s instanceof Set)) return { ok: false };
  184 |       const entries = [...s];
  185 |       // Buscar tipos relacionados con cambio de modo
  186 |       const modoEntries = entries.filter(t =>
  187 |         typeof t === 'string' && (
  188 |           t.includes('MODO') || t.includes('modo') || t.includes('ENTENDIDO') || t.includes('EFECTUADO')
  189 |         )
  190 |       );
  191 |       return {
  192 |         ok: true,
  193 |         totalRegistrados: entries.length,
  194 |         modoEntries,
  195 |         // Por definición de Set no puede haber duplicados — el tamaño == entradas únicas
  196 |         noDuplicados: new Set(entries).size === entries.length,
  197 |       };
  198 |     });
  199 | 
  200 |     expect(info.ok).toBe(true);
  201 |     expect(info.noDuplicados).toBe(true); // invariante de Set — documenta que no hay duplicados
  202 |   });
  203 | 
  204 |   // ── Race #4: `globalThis.mensajeria` disponible antes de Script 2 ─────────
  205 |   //
  206 |   // Script 2 (línea 7034 de codigo-padre.html) hace inmediatamente:
  207 |   //   const { registrarControlador: rC_S2, enviarMensaje: eM_S2 } = globalThis.mensajeria;
  208 |   //
  209 |   // Si Script 1 no ha ejecutado `inicializarMensajeria()` antes de que Script 2
  210 |   // arranque, esa destructuración produce TypeError.
  211 |   //
  212 |   // Evidencia de que esto NO ocurre: tras __MENSAJERIA_INICIADA = true (que
  213 |   // esperamos en gotoAndWaitForFase1), globalThis.mensajeria tiene ambas funciones.
  214 |   //
  215 |   // Verificamos la existencia de los exports específicos que Script 2 necesita.
  216 | 
  217 |   test('Race #4a. globalThis.mensajeria.registrarControlador existe (necesario para Script 2)', async ({ page }) => {
  218 |     const ok = await page.evaluate(() => typeof globalThis.mensajeria?.registrarControlador === 'function');
  219 |     expect(ok).toBe(true);
  220 |   });
  221 | 
  222 |   test('Race #4b. globalThis.mensajeria.enviarMensaje existe (necesario para Script 2)', async ({ page }) => {
  223 |     const ok = await page.evaluate(() => typeof globalThis.mensajeria?.enviarMensaje === 'function');
> 224 |     expect(ok).toBe(true);
      |                ^ Error: expect(received).toBe(expected) // Object.is equality
  225 |   });
  226 | 
  227 |   test('Race #4c. globalThis.mensajeria fue asignado ANTES de que __MENSAJERIA_INICIADA fuera true', async ({ page }) => {
  228 |     // El spy de injectInitSpy captura hasMensajeria en el momento de mensajeriaReady,
  229 |     // que ocurre ANTES de que __MENSAJERIA_INICIADA se ponga a true.
  230 |     // Si hasMensajeria era true en ese snapshot → mensajeria llegó antes.
  231 |     const order = await page.evaluate(() => globalThis.__e2e_initOrder || []);
  232 |     const snap = order.find(e => e.event === 'mensajeriaReady');
  233 | 
  234 |     // Si el spy no capturó el evento, no podemos concluir nada
  235 |     if (!snap) {
  236 |       console.warn('[WARN] Spy no capturó mensajeriaReady — ¿injectInitSpy se llamó antes de goto?');
  237 |       return;
  238 |     }
  239 | 
  240 |     // globalThis.mensajeria debe estar disponible en el momento de mensajeriaReady
  241 |     // (Script 2 lo necesita al iniciar)
  242 |     expect(snap.hasMensajeria).toBe(true);
  243 |   });
  244 | 
  245 |   test('Race #4d. las funciones de Script 2 en app.js están disponibles vía window tras boot', async ({ page }) => {
  246 |     // Script 2 también importa: manejarCambioModo, actualizarInterfazModo, enviarCambioModo de app.js
  247 |     // Estas se exponen en window o se usan internamente.
  248 |     // Verificamos que app.js se cargó correctamente verificando que TIPOS_MENSAJE y MODOS
  249 |     // (que también importa Script 2 de constants.js) están disponibles.
  250 |     const info = await page.evaluate(() => {
  251 |       return {
  252 |         hasTiposMensaje: typeof globalThis.TIPOS_MENSAJE === 'object' && globalThis.TIPOS_MENSAJE !== null,
  253 |         hasModos: typeof globalThis.MODOS === 'object' && globalThis.MODOS !== null,
  254 |       };
  255 |     });
  256 |     expect(info.hasTiposMensaje).toBe(true);
  257 |     expect(info.hasModos).toBe(true);
  258 |   });
  259 | });
  260 | 
```