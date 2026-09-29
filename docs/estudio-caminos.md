# Estudio "un solo camino" — auditoría de la PWA completa

Modelado sobre el estudio que produjo la migración de mensajería (opción A, bus único —
`docs/GUIA-COMPLETA.md` §10, §10.25, §28). Alcance: **total y absoluto, la PWA entera** —
mensajería fue una sola pieza del proyecto; esto la incluye pero va más allá. Motivo: evitar
duplicidades exige un solo camino por decisión (misma lógica que produjo la lavadora).

**Trato:** CLAUDE.md regla 1b — igual que la regla 1 trata a mensajería, y más severo. Ningún
hallazgo de "dos caminos" se arregla suelto: se investiga y se registra aquí primero, y solo
después se decide el arreglo.

**Metodología:** barrido mecánico de 6 categorías (fetch/localStorage/geolocalización fuera de
lo conocido; pares arranque-parada de recursos compartidos; divergencia arnés-de-test vs.
producción; constantes literales duplicadas; estado compartido con varios escritores; funciones
mismo-nombre-distinto-archivo de `npm run inventory:dupes`) + criterio EJE 27.1
(`docs/GUIA-COMPLETA.md` §36.27.1): contar cuántos mecanismos resuelven la misma decisión; si
hay ≥2, comprobar cuál está roto desactivando el otro; un fallback legítimo debe ser RUIDOSO.

**El radio de comprobación cruza frames, no se queda en el fichero** — para cada candidato se
traza también qué otros frames dependen de él por mensajería o por `globalThis`/estado
compartido, y qué se rompe en cadena si falla. No son piezas sueltas: todo funciona como un
engranaje.

---

## Parte I — Mapa

### Ya catalogado por `docs/GUIA-COMPLETA.md` (no redescubierto — citado y verificado contra el código)

#### M1. Dos clientes HTTP contra el mismo backend futuro — `data-loader.js` vs `api-client.js`

- **Dónde:** `js/data-loader.js` (`fetchFromAPI()`, sin reintento ni timeout) vs
  `js/api-client.js` (`fetchWithRetry()`, 4 reintentos con backoff exponencial — pero con 2
  huecos medidos que hacen que ninguno se dispare hoy: el `AbortError` del timeout se rinde
  antes de mirar el reintento, y el filtro de reintento exige `error.message.includes('fetch')`,
  que WebKit no cumple nunca).
- **La misma decisión, dos respuestas:** contrato de éxito distinto — `data.exito` (data-loader)
  vs `!data.error` (api-client). `validarRespuesta()` y `validarReto()` son la misma función
  duplicada entre los dos módulos.
- **Ya analizado y con arreglo propuesto** en `docs/GUIA-COMPLETA.md` §16.1b: `api-client.js`
  sobrevive (superconjunto — incluye los endpoints granulares por parada/tramo que pide la
  protección pasiva por parada, §16), `data-loader.js` pasa a llamarlo, falta `getTextos()` en
  `ApiClient`. Son los ítems **#17 y #18** del checklist de producción (§22.0).
- **Radio cruzado:** hoy ninguno de los dos camino se ejecuta en producción (`BACKEND_READY =
  false`, modo `'local'` siempre) — el riesgo es exclusivamente para cuando exista el backend
  real. No hay frame que dependa de esto en ejecución hoy; el riesgo es de diseño, no de bug
  activo.
- **Estado:** catalogado, sin verificar de nuevo el código en esta sesión más allá de lo ya
  hecho al leer la guía completa — pendiente de decidir con el usuario si se ejecuta la fusión
  ahora o se deja para cuando el backend se construya.

#### M2. Imports directos de Fase 2 que se saltan las funciones `cargarX()` ya escritas

- **Dónde:** `codigo-padre.html`, `__cargarDatosAventuraDiferidos` (Fase 2) importa
  `coordenadas-aventuras.js`, `audios-aventuras.js` e `indice-aventuras.js` con
  `await import()` incondicional, sin pasar por `cargarCoordenadas()`/`cargarAudios()`/
  `cargarIndice()` de `data-loader.js` — que ya existen y ya soportan modo `'api'`.
- **Ya analizado** en `docs/GUIA-COMPLETA.md` §22.12, con tabla de estado por fichero. Distinto
  de M1: aquí el problema es qué función de carga se usa, no qué cliente HTTP.
- **Estado:** catalogado, pendiente de decisión (no bloquea nada mientras `PROTECT_DATA=false`).

### Barrido mecánico — categoría 1 (fetch/XMLHttpRequest/localStorage/sessionStorage/geolocalización)

Verificado con grep desnudo sobre todo el repo (`*.{js,html}`), no solo los ficheros ya
conocidos:

- **`fetch(`**: 1 sola ocurrencia en `codigo-padre.html` (el probe de `version.json` para
  detectar actualizaciones del SW, §19 — ya catalogado, propósito único). El resto de
  ocurrencias son `js/api-client.js`, `js/data-loader.js`, `js/feedback-forms.js`, `sw.js` (los
  4 ya conocidos) y ficheros de test/vendor. **Sin candidato nuevo.**
- **`XMLHttpRequest`**: cero usos reales — la única coincidencia es un patrón de regex en
  `js/suppress-warnings.js` que filtra un mensaje de consola, no una llamada real. **Confirma
  que no hay una vía legacy de red compitiendo con `fetch`.**
- **`navigator.geolocation.getCurrentPosition`**: hay una llamada en `js/funciones-mapa.js:2505`
  además de las de `codigo-padre.html` — verificada: vive dentro de `diagnosticarMapa()`, una
  función de diagnóstico expuesta en `globalThis.funcionesMapa` para consola de desarrollador,
  no alimenta ninguna decisión de la app (solo hace `logger.info` y `return`). **No es un
  segundo camino de producción** — es una sonda de diagnóstico, confirma el patrón "hub +
  adaptador" que la guía ya documenta en §11 como no-duplicación.
- **`localStorage.setItem`/`removeItem`**: verificado con grep desnudo sobre todo el repo —
  **el 100% de las escrituras de producción están en `codigo-padre.html`**, cero excepciones.
  Confirma la tabla de §10.19. **Sin candidato nuevo** — el `vv_idioma` de `En-busca-del-tesoro.
  html` es solo lectura (`localStorage.getItem`), nunca escritura; el texto de §25.2 de la guía
  da a entender que la pantalla de selección "guarda" el idioma, cuando en realidad delega en
  el padre vía `SELECCION.IDIOMA_SELECCIONADO` — imprecisión de redacción de la guía, no un
  camino duplicado (el padre sigue siendo la única fuente de escritura real). Anotado para
  corregir la guía en otro momento, fuera del alcance de este estudio.
- **`sessionStorage.setItem`/`removeItem`**: exactamente 2 claves, 2 escritores — coincide con
  §10.20 (`vvguides_padreId` en `js/utils.js`, `vbg_session_token` en `js/api-client.js`).
  **Sin candidato nuevo.**

**Veredicto categoría 1: sin hallazgos nuevos.** Los caminos de red/almacenamiento están tan
centralizados como la guía afirma.

### Barrido mecánico — categoría 6 (funciones mismo-nombre-distinto-archivo, `npm run inventory:dupes`)

Comparadas garantía por garantía las tres pendientes de la sesión anterior:

#### C1. `escalar()` — 3 variantes en 8 ficheros; 1 real, 1 descartada por el historial — ⚠️ HALLAZGO PARCIAL

Presente en `audio-hijo3.html:8`, `boton-casa-hijo5.html:8`, `chat-hijo6.html:7`,
`coordenadas-hijo2.html:8`, `En-busca-del-tesoro.html:28`, `extrainfo-hijo1.html:8`,
`puzzle.html:7`, `retos-hijo4.html:8`. Misma decisión en los 8: "¿qué `font-size` raíz le pongo
a este documento?" — leída y ejecutada de tres formas distintas:

| Variante | Ficheros | Fórmula | Fuente de `w`/`h` |
|---|---|---|---|
| **A** (mayoría, 6 ficheros) | audio-hijo3, boton-casa-hijo5, coordenadas-hijo2, En-busca-del-tesoro, extrainfo-hijo1, retos-hijo4 | `max(16, min(min(w,h)*0.025, 18))` | `globalThis.innerWidth/innerHeight` (propia ventana) |
| **B** | chat-hijo6.html | `max(14, min(min(w,h)*0.025, 18))` — suelo **14**, no 16 — y además fija `--iframe-w`/`--iframe-h` en CSS, que ningún otro fichero hace | propia ventana |
| **C** | puzzle.html | `min(w,h)*0.025` — sin suelo ni techo | `(globalThis.top \|\| globalThis.parent).innerWidth/innerHeight` — la ventana de **arriba** |

Verificado leyendo las 8 definiciones completas, no solo el nombre.

**Variante C (puzzle.html) — corregido tras revisar el historial (`git log`), no es un
hallazgo.** La primera redacción de este documento la marcaba "pendiente de prueba de
escritorio" por sospecha de bug visual. El commit `94734b6` ("elimina tres caminos muertos y
arregla la escala de puzzle.html", con medición en los 3 motores de Playwright) **ya documenta
y prueba exactamente este comportamiento como intencional**: leer `top.innerWidth` en vez del
propio es correcto cuando `puzzle.html` vive en iframe (que es como vive siempre en la app
real — el propio commit lo dice: *"en iframe... se lee top.innerWidth, que ya es correcto"*),
y la ausencia de límites fue una decisión tomada en el mismo cambio, verificada con
`43-saltar-reto-puzzle-roto.spec.js` (PZ-2) y medición de píxeles reales de `#errorMsg` en los
dos motores. **Retractado — comprobar el historial de un fichero antes de reportar una
sospecha de bug sobre él evitó dejar en el estudio un hallazgo que ya estaba resuelto y
probado** (ver nota metodológica en la Parte VI).

**Lo único que queda de C1 es la variante B** (`chat-hijo6.html`, suelo 14 en vez de 16 + las
dos variables CSS `--iframe-w`/`--iframe-h` que ningún otro fichero fija). Severidad baja: el
chat es overlay de pantalla completa, nunca convive on-screen con otro hijo, así que no hay
choque visual simultáneo — es una inconsistencia de diseño medible pero de bajo impacto, no un
"camino roto". Sin evidencia en el historial de que esta diferencia sea intencional ni de que
se haya revisado antes.

#### C2. `normalizarModo()` — 2 ficheros — ✅ VERIFICADO SIN DIVERGENCIA, CERRADO

`audio-hijo3.html:1081` y `retos-hijo4.html:1169`. Leídas las dos funciones completas: lógica de
normalización **idéntica carácter por carácter** (misma cadena de `if`/`else if`, misma regex de
saneado `[^a-z0-9_-]`). Única diferencia: el `catch` de audio-hijo3 llama a `logger.debug` antes
de devolver `''`; el de retos-hijo4 devuelve `''` en silencio (`// NOSONAR`). No es una
divergencia de comportamiento (las dos devuelven lo mismo ante la misma entrada) — es una
asimetría menor de visibilidad de errores, no un "dos caminos" real. **Sin acción.**

#### C3. `mostrarUI()` — 5 ficheros — ✅ VERIFICADO SIN DIVERGENCIA REAL, CERRADO

`audio-hijo3.html:1139`, `boton-casa-hijo5.html:774`, `coordenadas-hijo2.html:1503`,
`extrainfo-hijo1.html:103`, `retos-hijo4.html:1217` (hijo6 no tiene esta función, a propósito —
ya documentado en §26.13). Dos diferencias reales encontradas, las dos justificadas:

- El *fallback* de `display` es `'block'` en 4 ficheros y `'flex'` en `retos-hijo4.html` —
  verificado contra §13 de la guía: el `body` de `retos-hijo4.html` usa genuinamente
  `display:flex` en su propio CSS, así que el fallback coincide con el layout real de cada
  fichero. **No es una divergencia accidental.**
- Solo `boton-casa-hijo5.html` tiene guard de idempotencia (`if (_uiMostrada) return;`); los
  otros 4 no. Rastreado el disparador real (§26.13): la confirmación cancela el temporizador de
  reintento antes de revelar la UI, así que un doble disparo solo sería posible si
  `PADRE_CONFIRMA_HIJO_LISTO` llegara duplicado — en ese caso, sin el guard, el peor efecto es
  un `logger.info` repetido, no un fallo funcional (`style.display` asignado dos veces no hace
  nada distinto de asignarlo una vez). Severidad insuficiente para el estudio — nota de mejora
  menor, no un "camino roto".

**Veredicto categoría 6:** 1 hallazgo real (`escalar()`, con una pregunta pendiente de prueba de
escritorio sobre `puzzle.html`), 2 comparaciones cerradas sin acción.

---

### Barrido mecánico — categoría 2 (pares arranque/parada de recursos compartidos)

Cruzado con `npm run inventory:timers` (172 sitios totales — `setTimeout`:122,
`setInterval`:30, `sleep(`:17, `watchPosition`:3). La inmensa mayoría son temporizadores de un
solo disparo (autocierre de carteles, animaciones) sin par arranque/parada que auditar — la
categoría solo aplica de verdad a recursos **de larga duración**. Verificados los de mayor
riesgo:

- **Heartbeat** (`js/mensajeria.js`) — guardado por `estado?.activo` + mutex
  `_heartbeatIniciando`; ya extensamente documentado y probado (§10.14, BC-12). **Limpio.**
- **`watchPosition` GPS** — patrón hub+adaptador ya verificado limpio en categoría 1.
- **Temporizador de cuenta atrás de hijo1** (`estadoTemporizador.intervalId`,
  `extrainfo-hijo1.html`) — un único punto de entrada (`iniciarTemporizador()`, un solo
  llamador real: el handler de `AVENTURA.INICIADA`), limpia cualquier interval previo antes de
  crear uno nuevo, se auto-cancela si `enCuenta` pasa a `false`. **Limpio.**
- **Reintento de prewarm en CASA** (`js/app.js:789`) — poll acotado (máx. 10 × 500ms),
  autocancelado al éxito o al agotar intentos. **Limpio.**
- **`intervaloLimpiezaAutomatica`** (`js/funciones-mapa.js`) — dos sitios de `clearInterval`
  (`limpiarRecursos()` y el listener de `pagehide`), ambos con guard idempotente
  (`if (intervaloLimpiezaAutomatica) {...}`). Verificado que son dos momentos de ciclo de vida
  genuinamente distintos (limpieza programática vs. cierre real de página), no dos caminos
  compitiendo por la misma decisión. **Limpio.**
- **`js/mensajeria.js:1285`** (limpieza periódica por TTL de confirmaciones pendientes) — un
  único `setInterval` a nivel de módulo, se arma una sola vez al cargar, sin contraparte de
  parada (vive lo que vive la página, mismo patrón que el heartbeat de limpieza). **Limpio.**

**Veredicto categoría 2: sin hallazgos nuevos** en los recursos de larga duración revisados.

### Barrido mecánico — categoría 3 (divergencia arnés-de-test vs. producción)

Barrido de `globalThis.X = ...` en los 66 specs de `tests/e2e/`. La inmensa mayoría son
*seeds* de estado inicial (`aventuraSeleccionada`, `idiomaSeleccionado`, `_devModeActivo`) para
arrancar el test en un punto conocido — no son stubs de comportamiento y no pueden mentir sobre
un contrato.

- **Patrón más repetido y de más riesgo real:** `globalThis.enviarMensajeConConfirmacion = () =>
  Promise.resolve({ exito: true })`, usado en más de media docena de specs para simplificar el
  acuse del bus. Verificado contra el código real (`js/mensajeria.js:829`,
  `pendiente.resolve(mensaje.datos)`): el contrato real es "lo que el handler de destino
  devolvió", que en el caso de audio incluye además `audioId` (§31.7). El stub genérico
  **coincide en el campo que casi todos los tests comprueban** (`.exito`) pero nunca en los
  demás campos reales. **No confirmado como bug** — ningún camino de producción ejercitado por
  estos tests concretos parece leer un campo distinto de `.exito` de esa resolución, pero no se
  ha comprobado uno por uno los 8+ specs que lo usan. Anotado como candidato de baja prioridad,
  sin acción recomendada (regla 9: no se recomienda sin terminar de comprobar).
- El caso ya conocido y ya arreglado (`maplibre-stub.js` no reproducía las clases reales de
  MapLibre, EJE 24b) sigue siendo el único caso **confirmado** de esta categoría — no se ha
  encontrado un segundo caso con la misma severidad.

**Veredicto categoría 3: sin hallazgo nuevo confirmado**, un candidato de baja prioridad anotado.

### Barrido mecánico — categoría 4 (constantes/lecturas duplicadas) — ❌ HALLAZGO CONFIRMADO

#### C4. `inicializarServicioMapa()` tiene una rama muerta con su propio bug de nombres

- **Verificado contra el historial:** `git log -S"CONFIG.MAPA?.CENTER"` — esta rama existe
  desde el primer commit del repositorio (`2c5c2c2`, "estado inicial del proyecto") y no se ha
  tocado desde entonces. No es una regresión reciente; es código de andamiaje original que
  nunca se ha ejercitado, consistente con estar 100% inalcanzable desde el día uno.
- **Dónde:** `js/funciones-mapa.js:1190-1234`. La función recibe `mapaInstance` como parámetro;
  si es *truthy* (rama real), registra la instancia que ya construyó `codigo-padre.html`. Si es
  *falsy*, entra en una segunda rama que **construye su propio mapa desde cero** — un
  `maplibregl.Map` distinto, con un único tile OSM raster plano (sin los 3 modos
  satélite/callejero/nocturno que sí tiene el mapa real, §11).
- **La rama muerta está confirmada muerta, no solo sospechada:** grep desnudo de
  `inicializarServicioMapa(` en **todo** el repo — el único llamador de producción
  (`codigo-padre.html:3647`) y los 8 tests que la usan (`17-flecha-brujula-continuidad`,
  `23-polyline-autoreparacion` ×3, `24-camara-sigue-usuario`, `27-seguimiento-rumbo`,
  `53-camara-no-sigue-en-casa`, `47-reescalado-marcador-usuario-y-chat`) **siempre** pasan una
  instancia. La rama de auto-construcción no se ejecuta en ningún camino real ni en ningún test.
- **Y si algún día se alcanzara, tiene su propio bug:** lee `CONFIG.MAPA?.CENTER`,
  `CONFIG.MAPA?.ZOOM`, `CONFIG.MAPA?.MIN_ZOOM`, `CONFIG.MAPA?.MAX_ZOOM` — nombres que **no
  existen** en `js/config.js`. Los reales son `CENTRO_DEFECTO`, `ZOOM_INICIAL`, `ZOOM_MIN`,
  `ZOOM_MAX` (verificado leyendo `js/config.js` completo). Las 4 lecturas siempre caen a su
  valor por defecto hardcodeado (`[39.4699,-0.3763]`/`13`/`12`/`18`), nunca al real configurado
  (`{39.4699,-0.3763}`/`15`/`12`/`19` — solo `MIN_ZOOM` coincide por coincidencia). En la misma
  función, 100 líneas más abajo (`js/funciones-mapa.js:2215`), otro punto **sí** lee el nombre
  correcto: `CONFIG?.MAPA?.ZOOM_INICIAL || 14` — confirma que el nombre correcto se conocía y se
  usaba en otro sitio del mismo fichero.
- **Radio cruzado:** cero — al ser inalcanzable, no hay frame ni handler que dependa de esta
  rama hoy. El riesgo es que alguien reactive esta rama en el futuro (p. ej., un nuevo caller
  que olvide pasar la instancia) confiando en que es un "fallback razonable", sin saber que
  además está mal configurada.
- **Factor estructural relacionado, encontrado en la misma verificación:** `js/config.js`
  exporta `getConfig(ruta, defecto)`, una función explícitamente diseñada para ser el acceso
  canónico a la config con ruta de texto (`getConfig('MAPA.ZOOM_INICIAL', 14)`) — expuesta
  incluso en `globalThis.__vv_getConfig` para consola. **Cero llamadores reales en todo el
  proyecto.** En su lugar, cada fichero lee `CONFIG.X?.Y || default` a mano, sin ningún punto
  central. Esto no es un bug en sí, pero es plausible que sea la razón estructural de que el
  bug de arriba pasara desapercibido: con un único punto de lectura, un nombre mal escrito
  falla una vez y se ve; con decenas de lecturas ad-hoc, cada una es una oportunidad de errar
  el nombre en silencio.

**Veredicto categoría 4: 1 hallazgo confirmado** (rama muerta + bug de nombres), más el factor
estructural de `getConfig()` sin adoptar. Además de los 2 ya arreglados en la sesión anterior
(`idiomaSeleccionado`, TTL de 7 días).

### Barrido mecánico — categoría 5 (estado compartido con varios escritores)

- **`localStorage`/`sessionStorage`:** ya cubierto en categoría 1, limpio.
- **`estado.elementoActual`** (`codigo-padre.html`, campo central de progreso): 5 sitios de
  escritura. Verificados los dos más próximos entre sí (`_restoreApplyState()` y
  `ensureDefaultParada()`) — son mutuamente excluyentes por guard explícito
  (`ensureDefaultParada()` retorna de inmediato `if (estado.paradaActual)` ya existe), cada uno
  cubre un momento de arranque distinto (sesión restaurada vs. arranque limpio), y los dos
  terminan despachando `NAVEGACION.CAMBIO_PARADA` por el mismo `despacharLocal()` — un solo
  pipeline de salida aunque haya varias entradas. **Limpio** en los dos sitios verificados; los
  otros 3 sitios de escritura no se han verificado individualmente (anotado como cobertura
  parcial, no cierre total de este campo).
- **`estado.modo.actual` / `estadoMapa.modo`:** ya documentado y verificado por la propia guía
  como "arrancan distinto a propósito" (§37.5) — no reabierto aquí sin nueva evidencia (regla
  1b).

**Veredicto categoría 5: sin hallazgo nuevo** en lo verificado; cobertura parcial, no
exhaustiva — campo de progreso central con 3 de 5 escritores aún sin revisar uno a uno.

### Hallazgo tangencial, fuera de alcance de "un solo camino" pero encontrado en el barrido

**`validarPermisosCambioModo()` (`js/app.js:806`) es un stub que siempre devuelve `true`.** Se
llama desde `manejarCambioModo()` (línea 579) solo si `MODOS_OPERACION[modo].requiereAutenticacion`
es verdadero. De los 5 modos definidos en `MODOS_OPERACION` (línea 299), 3 (`mantenimiento`,
`depuracion`, `emergencia`) llevan `requiereAutenticacion: true` — pero **ninguno de los tres es
un modo real de la aplicación**: los únicos modos que existen de verdad son `MODOS.CASA`/
`MODOS.AVENTURA` (`js/constants.js`, verificado en toda la guía). La rama de validación de
permisos es alcanzable en teoría (a diferencia del hallazgo C4) pero no la dispara ningún modo
real hoy, y aunque se disparara, el validador no valida nada. No es un "dos caminos" — es un
mecanismo de permisos completo, sin usar, que nunca se dispara (EJE 26). **Verificado contra el
historial** (`git log -S"MODOS_OPERACION" -- js/app.js`): un único commit, el inicial — código
de andamiaje original, nunca modificado desde entonces, mismo patrón que C4. Anotado aquí por
transparencia (no se descarta un hallazgo real solo por no encajar en la plantilla), pero no
forma parte de la Parte II de este estudio.

## Candidatos ya cerrados por la propia guía (no reabrir sin decir qué cambió — regla 1b)

- `NAVEGACION.LLEGADA_DETECTADA` — dos sensores redundantes (`funciones-mapa.js` +
  `coordenadas-hijo2.html`), ambos solo marcan `pending.llegada`, idempotente, ninguno avanza la
  aventura por sí solo. Benigno por diseño, ver `docs/GUIA-COMPLETA.md` §10.5/§25.5.
- `NAVEGACION.GPS.DESACTIVAR` — placeholder sin emisor ni handler, dejado a propósito por si un
  hijo necesita pedir la desactivación en el futuro. No hay dos caminos porque no hay ninguno.

---

## Segunda pasada — mismo terreno, otros ángulos

Instrucción explícita del usuario tras terminar el barrido de las 6 categorías: volver a buscar
por caminos distintos, para que nada dependa de un solo método de búsqueda (regla 10 de
CLAUDE.md, aplicada al propio estudio). Tres ángulos nuevos, ninguno de ellos parte de las 6
categorías mecánicas originales:

1. **Historial de git** (`git log --grep`, `git log -S`) — en vez de leer el código estático,
   preguntarle al historial qué ya se investigó y por qué. Encontró que este mismo proyecto ya
   tiene una lista larga de commits `un solo camino`/`camino roto`/`caminos muertos` (la
   lavadora de mensajería es la mitad de esa lista) — un patrón de bug que ya se ha resuelto
   muchas veces y vale la pena seguir buscando. Y, más importante: **corrigió un hallazgo
   propio de este mismo documento antes de que llegara a publicarse como definitivo** (ver
   abajo).
2. **`git log -S` sobre los hallazgos de código muerto** (C4 y el hallazgo tangencial de
   `MODOS_OPERACION`) — para distinguir "esto se rompió hace poco" de "esto nunca funcionó,
   desde el primer commit". Los dos resultaron ser lo segundo, lo que baja su urgencia (no hay
   nada que esté fallando ahora mismo que antes funcionaba) sin bajar su validez como hallazgo.
3. **Rastreo de efecto observable, no de categoría** (EJE 15, `docs/GUIA-COMPLETA.md` §36.15) —
   en vez de preguntar "¿qué categoría mecánica encaja aquí?", preguntar "¿cuántos caminos de
   código pueden producir este efecto visible?" para un efecto concreto
   (`actualizarMarcadorUsuario()`, el marcador GPS del usuario en el mapa). Un solo llamador de
   producción confirmado — limpio, pero por un método que las 6 categorías no cubrían.

### La corrección que demuestra por qué hace falta esta segunda pasada

La primera redacción de C1 (`escalar()`) marcaba la variante de `puzzle.html` como "candidato a
bug visual, pendiente de prueba de escritorio" — una sospecha razonada pero no comprobada del
todo, exactamente lo que la regla 9 permite dejar apuntado. El ángulo 1 de esta segunda pasada
(`git log`) encontró el commit `94734b6`, que **ya había investigado, medido en los 3 motores de
Playwright y dejado documentado con detalle de píxeles** ese mismo comportamiento como
intencional y correcto. Sin esta segunda pasada, ese "pendiente de comprobar" se habría quedado
en el documento indefinidamente — o alguien lo habría "arreglado" más adelante, deshaciendo un
fix real ya verificado. **La lección, ya anotada en memoria persistente
(`feedback_verificacion_asimetrica`/EJE 27.2): antes de marcar algo como "pendiente de prueba",
mirar primero si el historial ya hizo esa prueba.**

### Estado final del barrido

| Categoría | Resultado |
|---|---|
| 1 — fetch/localStorage/geo | Sin hallazgos nuevos |
| 2 — arranque/parada de recursos | Sin hallazgos nuevos |
| 3 — arnés vs. producción | Sin hallazgo confirmado; 1 candidato de baja prioridad sin cerrar |
| 4 — constantes/lecturas duplicadas | **1 hallazgo confirmado** (C4) + factor estructural (`getConfig()`) |
| 5 — estado con varios escritores | Sin hallazgo nuevo; cobertura parcial (2 de 5 escritores de `estado.elementoActual`) |
| 6 — funciones mismo nombre | **1 hallazgo confirmado** (C1, variante B únicamente) + 2 cerrados limpios |
| Segunda pasada (git history + efecto observable) | 1 hallazgo retractado con evidencia (C1 variante C), 2 hallazgos confirmados como no-regresión, 1 confirmación adicional limpia |

**Total de hallazgos activos de esta ronda: 2** (C1 variante B en `chat-hijo6.html`, severidad
baja; C4 en `js/funciones-mapa.js`, rama muerta con bug de nombres, severidad baja porque es
inalcanzable hoy pero relevante si alguien la reactiva) — más el hallazgo tangencial de
`validarPermisosCambioModo()`/`getConfig()` sin adoptar, fuera del alcance estricto de "un solo
camino" pero dejado por escrito por transparencia.

**Lo que queda genuinamente pendiente, con honestidad:** categoría 3 tiene un candidato sin
cerrar (el stub `enviarMensajeConConfirmacion` en los tests); categoría 5 solo cubrió 2 de 5
escritores de `estado.elementoActual`; y una segunda pasada más exhaustiva podría aplicar los
mismos 3 ángulos nuevos a los hallazgos ya cerrados de las categorías 1 y 2, no solo a los de
las categorías 4 y 6 donde se aplicaron esta vez.
