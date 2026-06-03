# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-fase1-boot.spec.js >> FASE 1 — Secuencia de arranque del padre >> 1a. Race #5 CORREGIDO: state-manager SÍ está en window cuando mensajeriaReady se dispara
- Location: tests\e2e\01-fase1-boot.spec.js:31:3

# Error details

```
Error: El spy no capturó el evento mensajeriaReady. ¿Se llamó injectInitSpy() antes de page.goto()?
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
  54  | 
  55  | /**
  56  |  * Intercepta los recursos CDN (unpkg.com, cdnjs.cloudflare.com) y los reemplaza
  57  |  * con stubs vacíos para que los tests no dependan de internet.
  58  |  *
  59  |  * Leaflet real es reemplazado por el stub de leaflet-stub.js inyectado con addInitScript.
  60  |  * Los CSS de CDN se retornan vacíos (no son necesarios para los tests).
  61  |  *
  62  |  * DEBE llamarse ANTES de page.goto().
  63  |  */
  64  | async function stubCDNResources(page) {
  65  |   // unpkg.com — Leaflet y plugins
  66  |   await page.route('**/unpkg.com/**', async route => {
  67  |     const url = route.request().url();
  68  |     if (url.match(/\.(css)(\?|$)/)) {
  69  |       await route.fulfill({ contentType: 'text/css', body: '/* stubbed by E2E */' });
  70  |     } else {
  71  |       // JS de Leaflet y plugins — vacío; globalThis.L ya está definido por leaflet-stub.js
  72  |       await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed by E2E */' });
  73  |     }
  74  |   });
  75  | 
  76  |   // cdnjs.cloudflare.com — preconnect, posibles fuentes adicionales
  77  |   await page.route('**/cdnjs.cloudflare.com/**', async route => {
  78  |     const url = route.request().url();
  79  |     if (url.match(/\.css(\?|$)/)) {
  80  |       await route.fulfill({ contentType: 'text/css', body: '/* stubbed */' });
  81  |     } else {
  82  |       await route.fulfill({ contentType: 'text/javascript', body: '/* stubbed */' });
  83  |     }
  84  |   });
  85  | }
  86  | 
  87  | /**
  88  |  * Navega a /codigo-padre.html y espera hasta que FASE 1 haya completado.
  89  |  *
  90  |  * Indicador: globalThis.__MENSAJERIA_INICIADA === true
  91  |  * Este flag se pone a true justo después de:
  92  |  *   1. mensajeria.inicializarMensajeria() completado
  93  |  *   2. mensajeriaReady event disparado
  94  |  *   3. procesarControladoresPendientes() ejecutado
  95  |  *
  96  |  * @param {import('@playwright/test').Page} page
  97  |  */
  98  | async function gotoAndWaitForFase1(page) {
  99  |   // Suprimir errores de consola que no son relevantes para los tests
  100 |   // (p. ej. warnings de serviceworker, Leaflet stub, etc.)
  101 |   page.on('console', msg => {
  102 |     if (msg.type() === 'error') {
  103 |       // Solo loguear errores reales, no los esperables del stub
  104 |       const text = msg.text();
  105 |       if (!text.includes('leaflet') && !text.includes('stub') && !text.includes('Service Worker')) {
  106 |         // No lanzamos excepción — dejamos que los tests fallen por sus propias aserciones
  107 |         // console.error('[PAGE ERROR]', text);
  108 |       }
  109 |     }
  110 |   });
  111 | 
  112 |   await page.goto('/codigo-padre.html', { waitUntil: 'domcontentloaded' });
  113 | 
  114 |   // Esperar a que FASE 1 complete.
  115 |   // En WebKit/iOS algunos arranques pueden tardar más de lo esperado;
  116 |   // si expira, no abortamos el beforeEach y dejamos que las aserciones del test
  117 |   // reporten el estado real de disponibilidad de la API.
  118 |   try {
  119 |     await page.waitForFunction(
  120 |       () => {
  121 |         if (globalThis.__MENSAJERIA_INICIADA === true) return true;
  122 | 
  123 |         const apiLista =
  124 |           typeof globalThis.mensajeria === 'object' &&
  125 |           globalThis.mensajeria !== null &&
  126 |           typeof globalThis.registrarControlador === 'function' &&
  127 |           typeof globalThis.enviarMensaje === 'function' &&
  128 |           typeof globalThis.TIPOS_MENSAJE === 'object' &&
  129 |           globalThis.TIPOS_MENSAJE !== null;
  130 | 
  131 |         return apiLista;
  132 |       },
  133 |       null,
  134 |       { timeout: BOOT_TIMEOUT }
  135 |     );
  136 |   } catch (_bootError) {
  137 |     await page.evaluate(() => {
  138 |       globalThis.__e2e_bootTimedOut = true;
  139 |     });
  140 |   }
  141 | }
  142 | 
  143 | /**
  144 |  * Obtiene el snapshot del evento mensajeriaReady registrado por el spy.
  145 |  * Lanza AssertionError si el spy no capturó el evento.
  146 |  *
  147 |  * @param {import('@playwright/test').Page} page
  148 |  * @returns {Promise<Object>}
  149 |  */
  150 | async function getMensajeriaReadySnapshot(page) {
  151 |   const order = await page.evaluate(() => globalThis.__e2e_initOrder);
  152 |   const snapshot = (order || []).find(e => e.event === 'mensajeriaReady');
  153 |   if (!snapshot) {
> 154 |     throw new Error(
      |           ^ Error: El spy no capturó el evento mensajeriaReady. ¿Se llamó injectInitSpy() antes de page.goto()?
  155 |       'El spy no capturó el evento mensajeriaReady. ' +
  156 |       '¿Se llamó injectInitSpy() antes de page.goto()?'
  157 |     );
  158 |   }
  159 |   return snapshot;
  160 | }
  161 | 
  162 | module.exports = {
  163 |   BOOT_TIMEOUT,
  164 |   injectInitSpy,
  165 |   stubCDNResources,
  166 |   gotoAndWaitForFase1,
  167 |   getMensajeriaReadySnapshot,
  168 | };
  169 | 
```