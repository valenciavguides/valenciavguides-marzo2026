# Estudio "un solo camino" — auditoría de la PWA completa

**Qué es este archivo y para qué sirve.** Es el registro de una auditoría en curso de toda la
PWA buscando mecanismos con **más de un camino para la misma decisión** — p. ej. dos funciones
que responden la misma pregunta de forma distinta, o dos clientes HTTP contra el mismo backend.
No es una lista de bugs confirmados ni una guía de arquitectura: es el mapa de lo que se ha
investigado, con qué se verificó, y qué sigue abierto para decidir. Su función es evitar que un
hallazgo de "dos caminos" se arregle de pasada, al vuelo, sin registrar antes por qué uno de los
dos sobra — y servir de punto de partida para que una sesión nueva (de Claude o del usuario)
pueda retomar el trabajo sin repetir desde cero lo ya comprobado.

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

**Herramientas usadas en esta auditoría** (para que una sesión nueva sepa qué ya se hizo y
pueda repetirlo o extenderlo, en vez de adivinar el método): `Grep`/grep desnudo sobre todo el
repo para cada categoría del barrido mecánico (una afirmación de "ausencia" exige esto, no solo
mirar la lista curada de `npm run inventory`); `npm run inventory:dupes` y
`npm run inventory:timers` para las categorías 6 y 2; `git log --oneline -- <fichero>` y
`git log -S"<literal>" -- <fichero>` para distinguir una regresión reciente de andamiaje
original nunca ejercitado; `Read` completo de cada función candidata (nunca juzgar por el
nombre o por un fragmento) antes de reportar una divergencia; y, para el único caso donde la
lectura estática no bastaba (C5, restauración de sesión), una reproducción real desechable en
Playwright contra la app real (`tests/e2e/zz-repro-*-temp.spec.js`, copiada, ejecutada y
borrada sin commitear) — regla 6 de CLAUDE.md: la medición manda sobre el razonamiento estático,
por impecable que parezca encadenado.

**Ronda 2 (2026-10-01).** La metodología de arriba es la de la ronda 1 (`grep` e inventario). La
ronda 2, al final de este documento, repite el barrido con parser real (`acorn`) y con el residuo
de cada instrumento a la vista: desmiente siete afirmaciones de este texto (erratas E1-E7, con una
nota fechada en cada sección afectada), corrige dos de la propia ronda (E8 y E9) y añade 48 entradas (K-01 a K-48) para su estudio
individual. Léase junto con ella: lo que aquí se dio por cerrado o limpio puede no estarlo.

**No es fuente de verdad absoluta.** Mismo principio que la regla 8 de CLAUDE.md aplica a
`docs/GUIA-COMPLETA.md`: este documento se consulta siempre y no se cree nunca a ciegas. Una
entrada de aquí es un punto de partida para verificar, no una conclusión cerrada — el propio
documento ya tiene dos casos (C1 variante C, C5) de un hallazgo razonado con cuidado, línea a
línea, que una comprobación posterior (historial de git o reproducción real) refutó por
completo. Antes de actuar sobre cualquier hallazgo de aquí: releer la entrada entera (no solo
el título ni el veredicto), y volver a comprobar contra el código real que sigue siendo cierto
— sobre todo si ha pasado tiempo desde que se escribió.

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

**Verificado más a fondo (2026-10-01), con grep desnudo de cada nombre en todo el repo, antes
de proponer tocar nada (regla 9):**

- `validarRespuesta()` (`data-loader.js:317`) tiene **cero llamadores reales** en todo el
  proyecto — ni en HTML, ni en `js/`, ni en ningún spec. Las coincidencias de "validarRespuesta"
  en `tests/dataService.test.js` son `dataService.validarRespuestaReto()`, una función distinta
  de otro módulo — no confundir las dos.
- De los ~17 métodos de `ApiClient`, **solo `activar()` tiene un llamador real**
  (`En-busca-del-tesoro.html:1763`). El resto, incluido `validarReto()`, no los llama nadie
  todavía.
- **Consecuencia:** hoy este hallazgo es 100% andamiaje para un backend que no existe —
  arreglarlo es limpieza de diseño, no corrección de un bug que se esté ejecutando en ningún
  camino real. Riesgo de la fusión: cero, en cualquier dirección que se elija.
- **Arreglo propuesto, con las decisiones ya tomadas para que no haga falta otra ronda:** (1)
  arreglar los 2 huecos reales de `fetchWithRetry()` (el `AbortError` del timeout no reintenta;
  el filtro `.includes('fetch')` deja fuera a WebKit); (2) añadir `getTextos()` a `ApiClient`;
  (3) borrar `validarRespuesta()` de `data-loader.js` (cero llamadores, nada que redirigir),
  dejando `ApiClient.validarReto()` como único camino; (4) que `data-loader.js` llame a
  `fetchWithRetry()` en vez de su propio `fetch` sin reintento, adoptando el contrato de éxito
  `!data.error` de `api-client.js` (gana por ser el que ya generalizan los ~17 métodos de
  `ApiClient`, frente a `data.exito` que solo usa `data-loader.js` internamente — mismo criterio
  que "un solo camino": se queda el que ya funciona en más sitios).
- **Pendiente de decidir con el usuario:** únicamente el *cuándo* — ejecutar esto ahora, o
  dejarlo para cuando el backend real se construya (dado que nada lo ejecuta hoy, no hay
  urgencia). El *qué* ya está decidido arriba.

#### M2. Imports directos de Fase 2 que se saltan las funciones `cargarX()` ya escritas

- **Dónde:** `codigo-padre.html`, `__cargarDatosAventuraDiferidos` (Fase 2) importa
  `coordenadas-aventuras.js`, `audios-aventuras.js` e `indice-aventuras.js` con
  `await import()` incondicional, sin pasar por `cargarCoordenadas()`/`cargarAudios()`/
  `cargarIndice()` de `data-loader.js` — que ya existen y ya soportan modo `'api'`.
- **Ya analizado** en `docs/GUIA-COMPLETA.md` §22.12, con tabla de estado por fichero. Distinto
  de M1: aquí el problema es qué función de carga se usa, no qué cliente HTTP.
- **Estado:** catalogado, pendiente de decisión (no bloquea nada mientras `PROTECT_DATA=false`).

**Verificado más a fondo (2026-10-01), releyendo §22.12 completa contra el código real antes de
proponer el arreglo (regla 8/9):**

- La tabla de §22.12 **no está desactualizada** — ya distingue correctamente `retos-aventuras.js`
  y `textos-aventuras.js` como ✅ migrados (vía `cargarRetos()`/`cargarTextos()`, confirmado
  leyendo `distribuirDatosAventura()` en `codigo-padre.html:~9976`) de `coordenadas-aventuras.js`/
  `audios-aventuras.js`/`indice-aventuras.js` como ⚠️ pendientes. No hay error de la guía aquí.
- **Lo que la guía no dice, y cambia el plan:** `cargarCoordenadas(aventuraId)` y
  `cargarAudios(aventuraId, idioma)` en `data-loader.js` están pensadas para traer **una sola
  aventura**. Pero `__cargarDatosAventuraDiferidos()` (Fase 2, `codigo-padre.html:3858`) no
  recibe ningún parámetro — carga **todas** las aventuras de golpe en
  `globalThis.__vv_DATOS_AVENTURAS`, y `distribuirDatosAventura()` después indexa por `aventura`
  dentro de ese objeto. Sustituir el `await import()` por `cargarCoordenadas()`/`cargarAudios()`
  tal cual **no es un cambio mecánico**: cambia la forma del dato, de "todas las aventuras" a
  "una aventura".
- **Radio cruzado, confirmado con grep, no es una lista de memoria:** 33 specs de `tests/e2e/`
  llaman a `__cargarDatosAventuraDiferidos()` o leen `__vv_DATOS_AVENTURAS` directamente.
  Rediseñar Fase 2 para que cargue por aventura (que además es lo correcto de cara a
  `PROTECT_DATA=true`: descargar todas las aventuras en cada arranque es derrochador) tiene
  radio de impacto real sobre la suite de tests — no es un barrido seguro.
- **Pendiente de decidir con el usuario:** si se aborda el rediseño (pieza de trabajo propia,
  con su propio verificado contra los 33 specs) o se deja también para cuando el backend se
  acerque, igual que M1 — sin urgencia mientras `PROTECT_DATA=false`.

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

> **Corregido en la ronda 2 (2026-10-01):** (E6) el 100% no es exacto: `js/suppress-warnings.js:165`
> escribe `vv_debug_verbose` con `localStorage?.setItem(`, forma que el patrón buscado no casa. Ver
> R2.1.

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

> **Corregido en la ronda 2 (2026-10-01):** (E1) `--iframe-w`/`--iframe-h` también las fijan
> `coordenadas-hijo2.html` y `extrainfo-hijo1.html`; lo que distingue a hijo6 es solo que no las
> lee. (E2) La "variante A" son tres textos distintos, no uno. Ver R2.1.

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

  > **Corregido en la ronda 2 (2026-10-01):** (E3) sí hay divergencia, en el ruido: hijo4 ignora un
  > `mostrarUI` anticipado sin avisar y los demás hacen `warn`; el `catch` y el flag
  > `_uiConfirmado` también difieren. Ver R2.1.

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
  Promise.resolve({ exito: true })`, usado en 7 specs (`100`, `102`, `39`, `40`, `44`, `46`, `47`)
  para simplificar el acuse del bus. Verificado contra el código real (`js/mensajeria.js:829`,
  `pendiente.resolve(mensaje.datos)`): el contrato real es "lo que el handler de destino
  devolvió", que en el caso de audio incluye además `audioId` (§31.7). El stub genérico
  **coincide en el campo que casi todos los tests comprueban** (`.exito`) pero nunca en los
  demás campos reales.
- **Verificado el de mayor riesgo aparente** (`102-audio-hijo3-un-solo-camino-reforzado.spec.js`,
  el único de los 7 cuyo nombre sugiere que ejercita justo el camino de audio con confirmación):
  los tests AR-1/AR-2 usan el stub para comprobar **cuántas veces** se llamó a
  `enviarMensajeConConfirmacion` (`llamadas >= 1`), nunca lo que la promesa resuelve — el stub
  genérico es indistinguible del real para lo que esos tests miden. Patrón consistente con el
  resto de usos vistos en el barrido (comprobar efectos/flags/contadores, no el valor resuelto
  campo a campo). **No confirmado como bug en ninguno de los sitios verificados** — sin
  comprobar los 7 specs exhaustivamente uno a uno, así que se deja como observación estructural
  de baja prioridad, no como hallazgo cerrado con la misma certeza que C1/C4.
- El caso ya conocido y ya arreglado (`maplibre-stub.js` no reproducía las clases reales de
  MapLibre, EJE 24b) sigue siendo el único caso **confirmado** de esta categoría — no se ha
  encontrado un segundo caso con la misma severidad.

**Veredicto categoría 3: sin hallazgo nuevo confirmado**, un candidato de baja prioridad anotado.

> **Ampliado en la ronda 2 (2026-10-01):** (E7) son 11 asignaciones en 7 specs, más 5 nombres de
> producción sobrescritos que esta categoría no miró, y el stub del global no alcanza a los
> llamadores de Script 1. Ver K-32 (⚠️ por medir).

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

  > **Ampliado en la ronda 2 (2026-10-01):** (E4) la lectura correcta de `ZOOM_INICIAL` está en otra
  > función, unas 1000 líneas más abajo, no en la misma. K-01 a K-03 amplían este hallazgo:
  > `globalThis.Config` (nunca asignado, 9 lectores), 38 de las 46 hojas de `CONFIG` sin lector,
  > `globalThis.__vv_getConfig` también sin lector y cuatro fuentes para "dónde arranca el mapa".

**Veredicto categoría 4: 1 hallazgo confirmado** (rama muerta + bug de nombres), más el factor
estructural de `getConfig()` sin adoptar. Además de los 2 ya arreglados en la sesión anterior
(`idiomaSeleccionado`, TTL de 7 días).

### Barrido mecánico — categoría 5 (estado compartido con varios escritores)

- **`localStorage`/`sessionStorage`:** ya cubierto en categoría 1, limpio.
- **`estado.modo.actual` / `estadoMapa.modo`:** ya documentado y verificado por la propia guía
  como "arrancan distinto a propósito" (§37.5) — no reabierto aquí sin nueva evidencia (regla
  1b).
- **`estado.elementoActual`** (`codigo-padre.html`, campo central de progreso) — **los 5 sitios
  de escritura, cerrado completo:**
  1. `_restoreApplyState()` (L4535) — resuelve por **id** (`elementoActualId` guardado),
     `elementos.find(p => p.parada_id === obj.elementoActualId || ...)`.
  2. `_restaurarProgresoRest()` (L5060) — **sobrescribe** lo anterior, resolviendo por
     **índice** (`obtenerElementoActual()` → `elementosIDpadre[estado.indiceProgreso]`).
  3. `ensureDefaultParada()` (L4598) — mutuamente excluyente con 1/2 (guard `if
     (estado.paradaActual)`), arranque limpio. Limpio.
  4. `progresarSiguienteElemento()` (L10282) — avance normal: incrementa `indiceProgreso`
     y busca por índice. Correcto en este contexto — no hay ID guardado que reconciliar, se
     avanza desde un estado ya bueno.
  5. `_actualizarEstadoParada()` (L11958) — el pipeline central de `CAMBIO_PARADA` (el más
     usado de los 5): recibe el objeto `parada` ya resuelto por **id** y **deriva el índice a
     partir de él** (`findIndexByPadreIdOrId(paradaId)`) — el orden inverso al de 1→2.

  > **Corregido en la ronda 2 (2026-10-01):** (E5) son seis escritores, no cinco: `js/app.js:826`
  > (`limpiarRecursosPorModo`) lo pone a `null` en cada cambio de modo. La conclusión de C5 no
  > cambia. Ver R2.1.

#### C5. Restauración de sesión: dos resoluciones para "qué elemento estaba activo" — investigado con reproducción real, hipótesis inicial REFUTADA

**Primera lectura (solo código, sin ejecutar):** `_restaurarProgresoRest()` parecía sobrescribir
siempre, con una resolución por **índice**, el resultado por **id** que `_restoreApplyState()`
ya había calculado — y por tanto, razonando en frío, una reordenación futura de
`elementosIDpadre` (ya ha pasado una vez, ver `feedback_renumerar_av34km` en memoria) haría que
la reanudación aterrizara en un elemento distinto del guardado.

**Reproducción real, no solo lectura (regla 6 — la medición manda):** se sembró un
`vv_progreso` real con `elementoActualId: "Av1-P-1"` (índice real 5) e `indiceProgreso: 2`
(índice de otro elemento real, "intro") — un desfase deliberado que reproduce justo el
escenario temido — y se disparó la restauración real pulsando `#btn-continuar-aventura` en un
Chromium real contra la app real (sin mocks de la función bajo prueba). **Resultado medido:
`indiceProgreso` terminó en `5` y `paradaActual`/`elementoActual` en `"Av1-P-1"` — el id
guardado ganó, el índice desfasado NO sobrevivió.** La hipótesis inicial queda **refutada**.

**Por qué se autocorrige — leído después de medir, no antes:** `_restoreApplyState()` no solo
fija `estado.elementoActual` por id: al final de la misma función, `_restoreBroadcast()`
despacha un `NAVEGACION.CAMBIO_PARADA` real (`despacharLocal`, fire-and-forget, sin `await`) con
`paradaId: estado.paradaActual` (ya puesto al valor guardado). Ese mensaje llega a
`_actualizarEstadoParada()` (el sitio 5, el pipeline central de cualquier `CAMBIO_PARADA`), que
resuelve **de nuevo por id** y **recalcula el índice a partir de él**
(`findIndexByPadreIdOrId`) — dejando `indiceProgreso` correcto. La sobrescritura por índice de
`_restaurarProgresoRest()` (líneas 5057-5060) sigue ejecutándose y sigue siendo, en sí misma,
redundante y potencialmente confusa de leer — pero su efecto queda **siempre** reemplazado por
el broadcast, porque `ejecutarRestauracionAventura()` hace `await _restaurarProgresoRest(...)`
y el broadcast fire-and-forget se resuelve en un microtask posterior, antes de que se oculte el
overlay de carga y de que cualquier otro código llegue a leer `estado.elementoActual`.

**Lo que queda, con esta clasificación honesta:**

- ✅ **Confirmado por ejecución:** la restauración de sesión NO aterriza en el elemento
  equivocado tras una reordenación de `elementosIDpadre` — el id guardado prevalece siempre,
  vía el mismo pipeline central que usa cualquier cambio de parada real.
- ⚠️ **Sigue siendo cierto, y sigue siendo código confuso de mantener:** las líneas 5057-5060
  de `_restaurarProgresoRest()` calculan un valor que el broadcast que la misma función acaba
  de disparar va a pisar siempre — no es un bug de comportamiento, pero es una redundancia real
  que invita a que alguien "optimice" el broadcast pensando que es superfluo, sin saber que es
  la única razón de que el resultado final sea correcto. Candidato a limpieza de código, no a
  fix de bug — fuera del alcance de "hallazgo" de este estudio tal y como está definido.
- **Ninguna acción recomendada.** No hay bug que arreglar; hay una explicación que merece un
  comentario en el código (`_restaurarProgresoRest()` no lo tiene hoy) para que la próxima
  persona que lo lea no repita el mismo razonamiento en frío que este estudio tuvo que
  refutar con una reproducción.

**Veredicto categoría 5: sin hallazgo activo.** La sospecha inicial fue investigada a fondo,
reproducida con datos reales contra la app real, y refutada — exactamente el caso que
`feedback_verificacion_asimetrica` pide comprobar con el mismo esfuerzo que uno que confirma.
Los 5 escritores del campo central quedan todos revisados.

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

  > **Verificado de nuevo en la ronda 2 (2026-10-01):** sigue cerrado (K-06): documentado en la guía
  > (L481) y en `funciones-mapa.js:3110-3111, 3143-3145, 3223-3231`. La ronda añade solo el coste de
  > mantenimiento: el algoritmo y tres constantes están copiados en dos ficheros.
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
4. **Reproducción real contra la app, no solo lectura del código** — para el hallazgo C5
   (restauración de sesión), en vez de razonar en frío sobre lo que el código *debería* hacer,
   se sembró un `vv_progreso` real con un desfase deliberado entre id e índice, se disparó la
   restauración pulsando el botón real (`#btn-continuar-aventura`) en un Chromium real, y se leyó
   el estado final — un caso de uso directo de la regla 6 de CLAUDE.md ("cuando una lectura
   estática y una medición en ejecución se contradigan, gana la medición"). El script de la
   reproducción era desechable (`tests/e2e/zz-repro-c5-temp.spec.js`, copiado, ejecutado y
   borrado en el momento — nunca llegó a commitearse).

### Dos correcciones que demuestran por qué hace falta esta segunda pasada

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

La segunda corrección es más seria porque no venía de una redacción provisional sino de un
razonamiento completo, encadenado línea a línea: C5 (restauración de sesión) parecía, leyendo
el código con cuidado, un caso real de "el índice guardado gana y descarta el id, al revés de
como debería ser". El ángulo 4 (reproducción real, no lectura) mostró que el razonamiento tenía
un hueco — no había tenido en cuenta que `_restoreApplyState()` **también** dispara un
`CAMBIO_PARADA` real por el mismo pipeline central que corrige el índice a partir del id, y que
ese disparo, aunque fire-and-forget, se resuelve siempre antes de que nada más lea el estado.
Sin ejecutarlo de verdad, ese hallazgo se habría publicado como confirmado siendo falso — el
caso exacto que la regla 6 y la tabla de §36.0 de la guía existen para evitar: una cadena de
inferencias impecable sobre código real, y aun así equivocada, porque faltaba el dato que solo
la ejecución da.

### Estado final del barrido

| Categoría | Resultado |
|---|---|
| 1 — fetch/localStorage/geo | Sin hallazgos nuevos |
| 2 — arranque/parada de recursos | Sin hallazgos nuevos |
| 3 — arnés vs. producción | Sin hallazgo confirmado; 1 observación estructural de baja prioridad, verificada parcialmente (1 de 7 specs) |
| 4 — constantes/lecturas duplicadas | **1 hallazgo confirmado** (C4) + factor estructural (`getConfig()`) |
| 5 — estado con varios escritores | Sospecha inicial (C5) **investigada con reproducción real y refutada** — los 5 escritores de `estado.elementoActual` revisados |
| 6 — funciones mismo nombre | **1 hallazgo confirmado** (C1, variante B únicamente) + 2 cerrados limpios |
| Segunda pasada (git history + efecto observable + reproducción real) | 2 hallazgos retractados con evidencia (C1 variante C por historial, C5 por reproducción en Playwright), 2 hallazgos confirmados como no-regresión, 1 confirmación adicional limpia |

**Total de hallazgos activos de esta ronda: 2**, ambos de severidad baja: C1 variante B en
`chat-hijo6.html`; C4 en `js/funciones-mapa.js` (rama muerta con bug de nombres, inalcanzable
hoy pero relevante si alguien la reactiva) — más el hallazgo tangencial de
`validarPermisosCambioModo()`/`getConfig()` sin adoptar, fuera del alcance estricto de "un solo
camino" pero dejado por escrito por transparencia, y una nota de limpieza de código sin bug
asociado (la redundancia de `_restaurarProgresoRest()`, ver C5). **Dos sospechas razonadas se
investigaron a fondo y NO sobrevivieron a la comprobación** (C1 variante C por historial de
git; C5 por reproducción real contra la app con Playwright) — quedan documentadas como
cerradas, no como pendientes, para que nadie las reabra sin motivo nuevo (regla 1b).

**Lo que queda genuinamente pendiente, con honestidad:** categoría 3 verificó 1 de los 7 specs
que usan el stub genérico de `enviarMensajeConConfirmacion` (el de mayor riesgo aparente por
nombre) sin encontrar problema, pero no los otros 6 uno a uno — queda como observación
estructural, no como hallazgo cerrado con la misma certeza que C1/C4; y una segunda pasada más
exhaustiva podría aplicar los mismos ángulos (historial, reproducción real) a los hallazgos ya
cerrados de las categorías 1 y 2, no solo a los de las categorías 3, 4, 5 y 6 donde se aplicaron
esta vez.

---

## Ronda 2 — barrido completo de la PWA (2026-10-01)

Esta ronda existe porque el usuario sospechó que la anterior "no estaba acabada eficientemente" y
pidió completar la búsqueda y anotarla aquí **para su estudio individual posterior**. La sospecha
era correcta, y se puede cuantificar (ver R2.1). **El barrido (R2.0 a R2.7) no arregla nada ni toca
ningún fichero de código** (regla 1b): registra, y `git status --short -- '*.html' 'js/*.js' sw.js
tools tests` estuvo vacío antes y después. Los arreglos vinieron después, con el OK del usuario
("ok a todo, revisa y arregla"), en una tanda aparte y con sus pruebas (R2.8); cada entrada de R2.2
lleva al final una nota «Estado final» con lo que pasó con ella.

### R2.0 Qué cambia respecto a la ronda 1

**Por qué la ronda 1 se quedó corta.** Trabajó con `grep` y con la lista curada de
`npm run inventory`, y las dos cosas devuelven *lo que casa con un patrón* (CLAUDE.md regla 10).
Lo que no casa — un alias, una forma con `?.`, un nombre distinto para la misma cosa — queda
fuera sin que nada lo avise. Medido esta ronda:

- Homónimos entre ficheros: `npm run inventory:dupes` lista 23 nombres; el parser, 26 con ≥6
  tokens (8 que el inventario no ve: `constructor`, `debug`/`info`/`warn`/`error`/`log`,
  `img.onload`, `img.onerror`; y 5 que solo ve el inventario). La ronda 1 comparó 3 (`escalar`,
  `normalizarModo`, `mostrarUI`). Ahora están los 26 clasificados (K-29).
- Estado con varios escritores: la ronda 1 miró 1 campo (`estado.elementoActual`). El extractor
  encuentra 441 escrituras en 148 rutas de campo; 91 rutas con ≥2 funciones escritoras y 49 con
  ≥3 (K-09). Y el campo que sí se miró tiene un sexto escritor que no se vio (E5).
- Categoría 1: el patrón `localStorage.setItem` no casa `localStorage?.setItem(`, y una escritura
  de producción quedó fuera de la afirmación "el 100% está en `codigo-padre.html`" (E6).
- Constantes: 578 declaraciones numéricas, 221 comparaciones con literal y 146 plazos de
  temporizador, agrupados por valor y por nombre (K-05) — la ronda 1 encontró 2 casos.
- Arnés de tests: 111 specs parseados (no solo 66); 6 nombres de producción sobrescritos con una
  función de prueba, y 11 asignaciones solo al de `enviarMensajeConConfirmacion` (K-32).

**Instrumentos de esta ronda.** Todos parsean con `acorn` (el que ya está en `node_modules`) en
vez de buscar por patrón, extraen los `<script>` de los HTML con comentarios y `<style>`
blanqueados (para que un `<script>` citado en un comentario no cuente) y **imprimen su residuo**
(regla 10: un recuento sin su residuo no se reporta). Están versionados en `tools/estudio-caminos/`
(con un `README.md` que da el orden de ejecución y las cifras que deben dar sobre el commit base de
la ronda, `ffe9bfc`: los 47 extractores reproducen la tabla de abajo), y además cada hallazgo de abajo
lleva pegado el comando de comprobación que cualquiera puede repetir con `grep`/`Read`.

| Instrumento | Qué extrae | Resultado y residuo |
|---|---|---|
| funciones | toda función/método/asignación de función con su texto normalizado | 2009 funciones, 0 bloques sin parsear |
| homónimos y clones | mismo nombre en ≥2 ficheros; mismo texto con nombre distinto; misma forma; Jaccard ≥0.70 | 26 homónimos (25 divergentes, 1 idéntico); 15 pares casi iguales (K-28, K-29) |
| mensajes | emisores y receptores de cada tipo del bus, resolviendo alias (`globalThis.TIPOS_MENSAJE…`, `registrar(`, `despacharLocal`) | 94 tipos, 253 emisores, 144 receptores; residuo 8 explicado (K-16) |
| globals | `globalThis.X = …` por frame y sus escritores | padre: 182 globals, 32 con ≥2 escritores; el resto de frames: 3 en total (K-10); no recorría los módulos de datos (K-34) |
| storage | claves de `localStorage`/`sessionStorage`, lectores/escritores/borradores | 9 + 2 claves, 53 sitios de 54; residuo 1 (lectura por alias `ls`, K-21) |
| constantes | declaraciones, comparaciones y plazos con valor numérico | 578 / 221 / 146 (K-05) |
| estado | escritores por ruta de campo de `estado`/`estadoMapa`/`estadoComponente`/… | 441 escrituras, 148 rutas (K-08, K-09) |
| recursos | `setInterval`/`setTimeout` con id, listeners, observers, `map.on` | 517 sitios (K-30) |
| config | lectores por ruta de cada hoja de `CONFIG` + todas las apariciones de `CONFIG`/`Config`/`__vv_config` | 46 hojas, 8 con lector (K-01, K-02) |
| tests | asignaciones a `globalThis.X` en los 111 specs que coinciden con nombres de producción | 11 asignaciones a `enviarMensajeConConfirmacion`, 6 nombres de producción sobrescritos (K-32) |
| i18n | literales en español asignados a texto de usuario | 321 asignaciones de texto; 93 literales en español (K-25) |
| web/visibilidad/avisos | APIs web por fichero, mecanismos de mostrar/ocultar, `alert`/`confirm`/`console` | 43 APIs distintas, 416 usos de visibilidad, 6 ficheros con avisos directos (K-25, K-33) |
| CSS/DOM | variables CSS definidas/usadas por documento, ids pedidos vs definidos, `CustomEvent` | 34 variables, 0 ids fantasma, 3 eventos propios (K-13, K-14, K-33) |
| clases CSS | clases que el JS pone sin regla ni lectura, y reglas cuya clase nadie usa | 3 clases fantasma, ~70 reglas sin uso (con falsos positivos por nombres compuestos, K-33) |
| destinos del bus | cada emisión de `destino` literal frente a los frames que registran handler del tipo, y a la inversa | 5 tipos con emisiones al vacío (3 falsos positivos descartados), 5 handlers inalcanzables (K-35) |
| carga útil | claves que lee cada handler frente a las que mandan los emisores; valores literales comparados frente a valores mandados | 93 tipos, 31 comparaciones; 14 tipos con claves leídas sin emisor, 3 ramas muertas (K-36); sobre `HEAD`, 92 tipos, 28 comparaciones y 12 tipos (`extract-payload` y `extract-discriminadores` leían `TIPOS_MENSAJE_VALIDOS`, que K-37 retiró: con el conjunto vacío daban 0 tipos y ningún informe; corregidos, G-43) |
| constants.js | lectores por ruta de cada hoja de los 9 objetos exportados y literales crudos con su valor | 177 hojas, 75 sin lector; 140 `destino: 'padre'` crudos (K-37) |
| globals por frame | por página: los ficheros que ejecuta (inline, `import` estáticos y dinámicos con literal, `<script src>`); nombres sueltos sin resolver (`eslint-scope`), `globalThis.X` leídos sin escritura en el frame, lecturas `parent.X`/`contentWindow.X`; y el uso real de la lista `globals` de `eslint.config.js` | 17 páginas, 48 ficheros, 2195 usos de `globalThis.X`; residuo: 0 bloques sin parsear, 1 `import()` no literal, 1 asignación computada (K-38, K-39, K-34) |
| API e imports | por cada import (estático con nombre o por defecto, `import * as` con sus miembros, `await import()` desestructurado, `(await import()).X`, `.then`): que el módulo exporte el nombre pedido; por cada objeto-API publicado en `globalThis` con claves derivables: los miembros pedidos que no son clave | 97 + 8 + 68 + 3 usos de import, 0 nombres sin exportar; 20 objetos-API, 1 miembro inexistente (K-38) |
| estado solo-escritura | rutas de estado escritas frente a leídas (13 raíces; lectura = uso fuera de escritura, desestructuración o cadena más larga; sin contar la inicialización perezosa pura) | 158 rutas escritas, 30 sin lector (12 estrictas, 15 con un ancestro leído entero, 3 con clave computada); residuo: 20 accesos con clave computada (K-41) |
| exports sin uso | por cada `export` de `js/` (191): apariciones de su nombre como token identificador en los demás ficheros de producción y en los specs, descontando declaración, `export` y claves del objeto-API publicado | 55 sin mención externa: 27 muertos del todo, 3 solo en specs, 25 con uso solo interno; 5 `export default` sin importador (K-42) |
| completitud i18n | por cada tabla por idioma de `js/traducciones-ui.js`: idiomas presentes, forma del valor, marcadores `{x}`/`%s`, cadenas vacías, textos idénticos al español; integridad de `PREGUNTAS_CHAT`, `RESPUESTAS_CHAT` y `TEMAS_AGRUPADOS_CHAT` | 133 tablas por idioma (12 idiomas), 0 problemas; chat 47/47/47; control con copia mutada (➖, R2.3) |
| recursos locales | cadenas JS, atributos HTML, `url()`, `sw.js` y `manifest.json` que apuntan a ficheros locales, frente al disco | 491 referencias en 50 ficheros, 81 nombres sueltos resueltos por nombre base, 1 inexistente, 16 con `${…}` sin resolver (K-44) |
| listeners duplicados | `addEventListener` sobre `window`/`document` agrupados por (objetivo, evento) dentro del cierre de ficheros de cada frame | 12 pares con varios sitios en el padre, 1 en la selección, 2 en el puzzle; 4 deciden lo mismo dos veces (R2.3, K-04, K-11, K-40); residuo 3 eventos no literales |
| contratos menores | cadenas de respaldo con `\|\|`/`??` y varias fuentes de un mismo dato; handlers registrados dos veces en un frame; parámetros de URL leídos frente a escritos | 152 cadenas (12 con varias fuentes); 144 receptores sin duplicados; 7 parámetros leídos y 12 escritos (R2.3, K-36) |
| guía frente a código | por cada frame (padre, selección, hijo1 a hijo6): los tipos que el código registra y emite frente a las filas de las tablas de handlers y de salientes de §26.12 y de las tablas de §7 y §8, y a los tipos que mencionan las tres secciones (`guia-handlers-por-frame.cjs`, añadido al cerrar la tanda: mide contra `HEAD`) | antes de G-34 a G-42: 48 handlers de 62 en el padre, y 4 de 9, 4 de 9, 10 de 18, 8 de 10, 8 de 16, 5 de 9 y 5 de 6 en la selección y los hijos; después, tantos en la guía como en el código en los ocho frames (K-46, G-34 a G-42); con las tablas de §7 y §8, una fila falsa más (hijo1 mandaba `MONITOREO.METRICA`, G-43) |
| handlers solo-log | de cada registro de handler del bus, si su función solo escribe en el log (`handlers-solo-log.cjs`, añadido al cerrar la tanda) | 140 registros: 136 analizados, 15 solo-log, 0 que además devuelvan un valor; residuo 4 (K-46) |
| guía frente a código: fichas | la tabla de cobertura por hijo de §10.7 celda por celda frente a los handlers del código (sale con código 1 si no cuadra) y las filas «Emitido por» y «Handler en …» de las fichas de §10 junto a lo que registra y emite cada frame (`guia-fichas-mensaje.cjs`, añadido al cerrar la tanda; `ESTUDIO_GUIA` apunta a otra copia de la guía) | contra la guía anterior a G-43: 3 discrepancias en §10.7; contra la actual, 0 (G-43) |
| guía frente a código: payloads | las claves de las celdas «Payload» de §7, §8 y §10 frente a las que mandan los emisores del código (`guia-payloads.cjs`, añadido al cerrar la tanda; necesita `payload.json`) | contra la guía anterior a G-43: 38 de 222 filas con claves que ningún emisor manda; contra la actual, 7 de 221, todas leídas a mano (cinco de emisor opaco —`datos` no literal—, `UI.CLOSE_MENUS` padre → hijo1, que no tiene emisor, y `CHAT.ESTADO_PADRE`) (G-43) |

Además se han ejecutado las herramientas propias del repo que esta auditoría no había usado:
`node tools/codigo-muerto.js`, `node tools/verificar-mensajeria.js`, `node tools/verificar-frames.js`.
Las tres tienen límites medidos que conviene conocer antes de fiarse de ellas (K-34).

**Leyenda de veredictos de esta ronda** (más precisa que la de la ronda 1, porque ahora hay
muchos más candidatos y no todos están al mismo nivel de comprobación):

- ✅ **Confirmado** — leídas las líneas exactas de los dos (o más) caminos y comprobada la
  ausencia con búsqueda desnuda del identificador en todo el repo.
- ⚠️ **POR MEDIR** — la lectura estática no basta: depende de una ejecución. No se ha lanzado
  nada (no hay OK del usuario para Playwright y la regla 5 prohíbe mezclar). Cada uno dice qué
  medir.
- 📌 **Documentado / intencional** — el propio código o la guía ya lo declaran como decisión.
  No se reabre (regla 1b); se anota lo que la ronda 2 añade.
- 🧩 **Familia de copias** — mismo texto o misma forma en varios sitios, sin divergencia de
  comportamiento observada. Coste de mantenimiento, no bug.
- 🔎 **Por estudiar** — lo ha encontrado un instrumento y nadie lo ha leído uno a uno todavía.
- ➖ **Limpio** — barrido con método y sin hallazgo.

**Alcance y exclusiones (regla 3b).** Barridos con los extractores: los 17 `.html` de la raíz
(el censo de la regla 3b —padre, selección, hijo1 a hijo6, mapa-completo, puzzle,
video-intro: once nombres, aunque CLAUDE.md los llama "los diez"— más `index.html`,
`debug-brujula.html` y las cuatro páginas estáticas), los 21 módulos de código de `js/`, `sw.js`
y los 111 specs de `tests/e2e/`. **Leídos a mano** los once frames del censo,
`js/mensajeria.js`, `js/state-manager.js`, `js/config.js`, `js/funciones-mapa.js` (por tramos) y
`js/app.js` (por tramos). **No barridos, y por qué:** `docs/` (la guía es "el acusado",
se consulta, no se barre); `js/vendor/` (código ajeno); `js/proteccion.js` pasa por los
extractores, pero lo que hace como módulo de protección no se estudia ni se describe en este
documento (repo público; se trata aparte); `tools/*` salvo las tres herramientas
ejecutadas; `tests/*.js` sueltos (15 ficheros fuera de `tests/e2e/`, no los ejecuta
Playwright); los diez módulos de datos de `js/` (`*-aventuras.js`, `traducciones-ui.js`), de los
que solo se miraron las tablas indexadas por idioma y la lista de ficheros del SW. Las cinco
páginas estáticas (`consejos-valencia`, `gastronomia`, `paginas-oficiales-valencia`,
`videos-valencia-historica`, `debug-brujula`) y `index.html` pasaron por los extractores sin
dar nada. En la pasada final se leyeron enteras las cuatro de contenido (sin `<script>` y solo en
español: K-25) e `index.html` (redirige a `codigo-padre.html` por dos vías automáticas y un
enlace, que la guía documenta, L4703); `debug-brujula.html`, que ningún fichero de producción
enlaza, no se leyó entera. `node tools/verificar-frames.js` las muestra sin bus, sin escuchas y sin
envíos.

### R2.1 Erratas de la ronda 1 — lo que esta ronda desmiente de este mismo documento

Se dejan las secciones originales tal cual (para ver qué se afirmó) y se añade una nota fechada
en cada una apuntando aquí. Todas están comprobadas leyendo las líneas.

- **E1 — C1, variante B: "fija `--iframe-w`/`--iframe-h`, que ningún otro fichero hace" es
  falso.** `coordenadas-hijo2.html:14-15` y `extrainfo-hijo1.html:14-15` hacen lo mismo con
  `setProperty`, y `codigo-padre.html:1336` define `--iframe-w` en CSS. Lo que sí es cierto y más
  fino: `--iframe-w` solo lo *leen* hijo2 (`:41`) y hijo1 (`:1270-1271`, `:1287-1288`) — hijo6 la
  escribe (`chat-hijo6.html:10`) sin ninguna lectura —, y **`--iframe-h` se escribe en tres
  frames y no la lee ninguno**. Método: `grep -n "\-\-iframe-[wh]"` en los siete HTML.
- **E2 — C1: "variante A, misma fórmula en 6 ficheros" esconde tres textos distintos.** La
  fórmula numérica coincide, pero el parser da 5 textos distintos en los 8 ficheros: hijo3,
  hijo5 y hijo4 (63 tokens), hijo2 y hijo1 (97, con variables CSS), selección (59, con `const`),
  hijo6 (84) y puzzle (98). Salida del instrumento de homónimos para `escalar`.
- **E3 — C3 `mostrarUI()`: "sin divergencia real" es falso en el ruido.** Solo hijo4
  (`retos-hijo4.html:1215-1220`) ignora en silencio un `mostrarUI` anterior a la confirmación;
  hijo1, hijo2, hijo3 y hijo5 hacen `logger.warn("mostrarUI ignorado…")`. El `catch` también
  difiere: hijo3 `debug`, hijo1 y hijo2 `warn`, hijo5 sin `try`, hijo4 lo traga. El flag
  `_uiConfirmado` es `globalThis._uiConfirmado` en hijo1 y un `let` local en los demás. Es poco
  grave (la UI se muestra igual), pero el texto "cerrado sin divergencia" no se sostiene: la
  asimetría de visibilidad de errores que C2 sí anotaba aquí no se anotó.
- **E4 — C4: "en la misma función, 100 líneas más abajo (`funciones-mapa.js:2215`)".** No es la
  misma función ni 100 líneas: `:1213-1231` está en `inicializarServicioMapa` y `:2214-2215` en
  `completarCambioParada`, ~1000 líneas más abajo. La conclusión (el nombre correcto se conocía)
  sigue en pie; ver además K-03, que amplía C4.
- **E5 — Categoría 5: "los 5 sitios de escritura de `estado.elementoActual`, cerrado completo".**
  Son 6: `js/app.js:826` (`limpiarRecursosPorModo`) lo pone a `null` junto con `paradaActual` y
  `tramoActual` en cada cambio de modo. No cambia la conclusión de C5 (la reproducción real sigue
  siendo válida), pero "completo" no lo era. Método: el extractor de estado lista 6 funciones
  escritoras para esa ruta; comprobado leyendo `js/app.js:817-826`.
- **E6 — Categoría 1: "el 100% de las escrituras de producción están en `codigo-padre.html`,
  cero excepciones".** `js/suppress-warnings.js:165` escribe `vv_debug_verbose` con
  `globalThis.localStorage?.setItem(`. La búsqueda desnuda de `localStorage.setItem` no casa la
  forma con `?.` (exactamente la trampa de la regla 10). Es una clave de depuración de consola,
  no un dato de usuario, así que el matiz de fondo (la persistencia de la aventura está
  centralizada en el padre) se mantiene; la frase literal no. Método: `grep -n
  "\.\(getItem\|setItem\|removeItem\)(" *.html js/*.js sw.js` → 54 líneas (más 2 `clear()`);
  el extractor de storage vio 53: le falta la lectura por el alias `ls` (`suppress-warnings.js:80`).
- **E7 — Categoría 3: "usado en 7 specs".** Son 7 specs pero **11 asignaciones** (`102` hace
  3, `44` hace 3), y hay otros 5 nombres de producción sobrescritos por specs que esa ronda no
  miró (K-32). La observación de baja prioridad se mantiene; se amplía con una limitación
  estructural del stub.
- **E8 — R2.6, fila de `codigo-padre.html`: "lecturas `contentWindow.X`: 0 en toda la app" es falso.** El bloque
  clásico que enlaza los siete iframes (`codigo-padre.html:2842`, hoy) lee la ubicación de otro frame en el `load` de cada
  uno, `el.contentWindow?.location?.href`, para descartar la carga inicial en `about:blank` antes de llamar a
  `handleIframeLoad`. Lo ve `node tools/verificar-frames.js --detalle` (columna "ajeno": 3 en el padre, 1 en hijo2
  —`parent.aventuraSeleccionada`, K-26— y 1 en `js/logger.js` —`parent?.__vv_config`—) y la búsqueda desnuda de
  `contentWindow` en el padre: una lectura de propiedad ajena y los usos de `iframe.contentWindow` como destino de
  `postMessage` y como comprobación de existencia. Es una lectura de mismo origen dentro de un `try`; no cambia la
  conclusión (el bus es el único camino de datos), pero la frase literal no se sostiene.
- **E9 — K-37: «Dos únicos sitios usan un tipo de mensaje como literal» es falso.** Son 8, en 4 ficheros: la selección
  (`En-busca-del-tesoro.html:1256`, `:1659`, `:1793` y `:2471`: los cuatro envíos de su script clásico, que no puede importar
  `constants.js` y manda por `globalThis.mensajeria`), el padre (`codigo-padre.html:1628`, `CHAT.ESTADO_PADRE`, y `:14761`,
  `SISTEMA.HEARTBEAT`: respaldos detrás de `globalThis.TIPOS_MENSAJE…?.X ||`), `js/mensajeria.js:1224` y `js/utils.js:375`.
  Método: búsqueda desnuda de cada uno de los 94 valores entre comillas en `*.html`, `js/*.js` y `sw.js`: 11 apariciones, de las
  que 3 no son el tipo de un mensaje (dos `contexto:` de hijo5, `:1005` y `:1063`, y un comentario de `utils.js:347`). No cambia la
  conclusión de K-37 —son los mismos valores del mismo contrato y lo recomendado es dejarlos—, sí la cifra.

### R2.2 Catálogo de hallazgos

Cada entrada dice **dónde**, **cuáles son los caminos**, **con qué método se comprobó** (pegado,
repetible) y **qué queda por decidir o medir**. Los números de línea son los del árbol de
trabajo a fecha de esta ronda (aproximados en cuanto se edite cualquier fichero). Orden: por
familia, no por gravedad; el resumen por veredicto está en R2.7.

#### Familia A — Configuración, constantes y umbrales

##### K-01 — Tres objetos de configuración con nombres casi iguales; uno no existe — ✅

- **Dónde.** `js/config.js:15` (`CONFIG`, el real); `globalThis.Config` (la misma palabra con otra
  capitalización: **nadie lo asigna**); `globalThis.CONFIG_PADRE` (`codigo-padre.html:4111`).
- **`Config`: 9 lectores, 0 escritores.** `codigo-padre.html:192`, `:4112`, `:4128`
  (`ID_PADRE`), `:5584` (`GPS.HIGH_ACC_INIT_ATTEMPTS`, `INIT_ATTEMPT_TIMEOUT_MS`,
  `REJECT_ACCURACY_M`), `:5679` (`GPS.ENABLE_HIGH_ACCURACY`, `TIMEOUT_MS`, `MAXIMUM_AGE_MS`),
  `:5696` (`GPS.REINTENTOS`), `:10114` (`PENDING`), `:10164` (`PENDING.CLEANUP_INTERVAL_MS`) y
  `js/app.js:411` (`MENSAJERIA.TIMEOUTS.CONFIRMACION`). Ninguna de esas claves existe en
  `js/config.js`, salvo la última — que se pide por el global equivocado: `config.js:197` publica
  `globalThis.__vv_config`, no `Config`.
- **Efecto leído:** cada lector cae siempre a su literal. GPS inicial: 3 intentos × 8000 ms
  (×1.8 por intento) con umbral de precisión `Infinity` — por eso la rama "precisión
  insuficiente" de `_gpsIntentarPosicion` (`:5565-5567`) solo se alcanza si la precisión no es un
  número; reintento de `watchPosition` que arranca en 15000 ms y se duplica hasta 60000
  (`:5679-5683`), máximo 3 (`:5696`); `app.js:411` espera **10000 ms donde `CONFIG` dice 5000**.
  El código ya lo sabe: comentario `codigo-padre.html:5578-5580` ("globalThis.Config nunca se asigna
  en ningún archivo del proyecto").
- **`CONFIG_PADRE`**: de sus cinco claves se lee `LOG_PREFIX` (decenas de sitios) y `ID` solo
  dentro de dos stubs de `getPadreId()` que nadie llama (K-28); `COMPONENTE_ID`, `VERSION`
  (`'3.0.0'`) y `DEBUG` no tienen lector de producción (el spec `02-global-variables.spec.js:117`
  solo comprueba que existen).
- **Método:** búsqueda desnuda de `\bConfig\b` en `*.html`, `*.js`, `*.cjs`, `*.mjs` (ripgrep,
  respeta `.gitignore`): solo lecturas, cero asignaciones. Búsqueda desnuda de `CONFIG_PADRE`:
  solo `.LOG_PREFIX` y `.ID` leídos.
- **Pendiente:** elegir un único objeto y una única forma de leerlo. Pregunta para el estudio: los
  nombres del `Config` fantasma (`HIGH_ACC_INIT_ATTEMPTS`…) ¿son un diseño previo que se quiere
  materializar en `js/config.js`, o se retiran los lectores y se dejan los literales como verdad?

- **Estado final (2026-10-02).** ✅ Cerrada en `6c152ab`: las siete lecturas de `globalThis.Config` pasan a
  ser el literal que ya aplicaban —GPS inicial 3 intentos × 8000 ms y sin umbral de precisión; reintento por
  `TIMEOUT` de 15000 ms con backoff ×2 hasta 60000, `maximumAge` 0 y 3 reintentos; TTL de 10 min de
  `pending` y 5000 ms en `populatePendingCoords`; `CONFIG_PADRE.ID`; `_prewarmAventura`, 10 s— y la guía
  deja de decir que esos valores salen de `CONFIG.GPS`. Las otras dos lecturas, las de los stubs de
  `getPadreId()`, desaparecen con la función (`f6ab460`, K-28). `js/app.js` sigue esperando 10000 ms donde
  `CONFIG` dice 5000: el plazo no se toca (es de producción) y queda anotado en el comentario de
  `_prewarmAventura`. La pregunta del «Pendiente» queda respondida por los hechos: `Config` no se
  materializa (nadie lo asigna ni lo necesita) y los literales son la verdad. Sin tocar:
  `CONFIG_PADRE.COMPONENTE_ID`, `VERSION` y `DEBUG` (sin lector; el spec `02-global-variables` solo
  comprueba que existen), que entran en la decisión de K-02.

##### K-02 — `CONFIG`: 38 de 46 hojas sin ningún lector — ✅

- **Recuento por ruta (con residuo).** 46 hojas. Con lector: `DEBUG.NIVEL_LOG`
  (`js/logger.js:114,116` vía `__vv_config`), `MENSAJERIA.TIMEOUTS.CONFIRMACION`
  (`codigo-padre.html:6147, 6322, 8125, 11470`), `GPS.PRECISION_MINIMA`
  (`coordenadas-hijo2.html:1353, 1357, 1383`), `MAPA.ZOOM_INICIAL` (`funciones-mapa.js:2215,
  2654`), `MAPA.ZOOM_MAX` (`:2214`), `MONITOREO.INTERVALO_METRICAS` (`js/monitoreo.js:66`) y
  `MAPA.CENTRO_DEFECTO` leído como objeto entero (`funciones-mapa.js:2653`, cubre sus hojas
  `.lat`/`.lng`): 8 hojas. **38 sin lector**: `VERSION`, `BUILD_DATE`, `DEBUG.{HABILITADO,
  MOSTRAR_TIMESTAMPS,MOSTRAR_CONTEXTO,PERSISTIR_LOGS}`, los 9 `MENSAJERIA.TIMEOUT_*`/`MAX_*`/
  `INTERVALO_*`/`BACKOFF_*`/`TTL_*`, `MENSAJERIA.TIMEOUTS.{EXTENDIDO,RAPIDO}`, 8 de las 9 hojas de
  `GPS`, las 6 de `AUDIO`, 4 de `MAPA` (`ZOOM_MIN`, `ZOOM_CENTRADO`, `ZOOM_CONTROL`,
  `DURACION_VUELO`) y 3 de `MONITOREO`.
- **Dos representaciones del mismo valor dentro de `CONFIG`:** `MENSAJERIA.TIMEOUT_CONFIRMACION`/
  `TIMEOUT_EXTENDIDO`/`TIMEOUT_RAPIDO` (planos, sin lector) y `MENSAJERIA.TIMEOUTS.CONFIRMACION`/
  `EXTENDIDO`/`RAPIDO` (anidados, "alias para compatibilidad con codigo-padre.html",
  `config.js:64-69`; solo se lee `CONFIRMACION`).
- **Los valores reales los ponen literales, no `CONFIG`:** `GPS.TIMEOUT: 30000`,
  `GPS.MAX_EDAD_CACHE: 5000`, `GPS.INTERVALO_ACTUALIZACION: 7000`, `GPS.RADIO_PROXIMIDAD: 20`,
  `GPS.RADIO_EXTENDIDO: 50`, `AUDIO.*` no tienen lector; quien edite `CONFIG.GPS.TIMEOUT`
  esperando un efecto no lo tendrá.
- **`getConfig()` y `globalThis.__vv_getConfig`** (`config.js:180, 198`): cero lectores. Amplía
  el "factor estructural" de C4, que citaba solo la función; la exposición global tampoco la usa
  nadie. Búsqueda desnuda de `getConfig` en html/js/cjs/mjs/json: solo esas dos líneas.
- **Versiones declaradas sin lector:** `CONFIG.VERSION: '2.0.0'`, `CONFIG_PADRE.VERSION: '3.0.0'`
  y el literal `version: '1.0.0'` del mensaje `APLICACION_INICIALIZADA` (`codigo-padre.html:7429`).
- **Método:** instrumento de config (regex por ruta `A?.B` + desestructuración) **más** revisión a
  mano de todas las apariciones de `CONFIG`, `CONFIG_S1`, `__vv_config` y `getConfig` (17 líneas).
  Un primer intento por nombre genérico (`TIMEOUT`, `lat`…) daba falsos lectores y se descartó:
  sirve de ejemplo de que un recuento sin residuo no se reporta.
- **Pendiente:** decidir si `CONFIG` se vacía de lo que no se lee o se adopta (junto con K-01 y
  K-03). Decisión de producto, no mecánica.

- **Estado final (2026-10-02).** Retirados en `01eeb47`: `getConfig()` y `globalThis.__vv_getConfig`
  (búsqueda desnuda de los dos nombres en 259 ficheros: solo esas dos líneas) y el `export default CONFIG`
  (todo el código importa `{ CONFIG }`). Se queda `globalThis.__vv_config`, que `js/logger.js` lee en cada
  llamada. **Abierta, decisión de producto** (las 38 hojas sin lector y las dos representaciones de
  `MENSAJERIA.TIMEOUT_*`): *A) vaciar `CONFIG` de lo que no se lee* — **recomendada**: `config.js` conserva
  solo las 8 hojas vivas y quien edite un valor sabe que tiene efecto; si luego se quiere adoptar alguna,
  entra con su lector. *B) adoptarlo*: sustituir los literales (GPS, audio, mapa, mensajería) por lecturas
  de `CONFIG`; toca más ficheros y cada valor hay que compararlo con el literal que hoy manda (los 10 s de
  `_prewarmAventura` frente a los 5 s de `CONFIG`, por ejemplo). Mientras no se decida, `CONFIG.GPS.TIMEOUT`
  y compañía siguen siendo un interruptor que no conecta con nada.

##### K-03 — Lecturas de claves que no existen, y cuatro fuentes para "dónde arranca el mapa" — ✅

Amplía C4 (no lo sustituye).

- **El hecho de C4, verificado de nuevo:** `js/funciones-mapa.js:1213, 1229-1231` lee
  `CONFIG.MAPA?.CENTER`, `.ZOOM`, `.MIN_ZOOM`, `.MAX_ZOOM`; en `config.js` son `CENTRO_DEFECTO`,
  `ZOOM_INICIAL`, `ZOOM_MIN`, `ZOOM_MAX`. Siguen cayendo siempre al literal
  (`[39.4699,-0.3763]`/13/12/18).
- **Lo nuevo — cuatro fuentes para la misma decisión:** (1) los literales del mapa real,
  `codigo-padre.html:3355-3361` (centro `[-0.3763, 39.4699]`, `zoom: 13`, `minZoom: 12`,
  `maxZoom: _MAPA_MAX_ZOOM = 19`, `:3075`); (2) las claves inexistentes de la rama muerta; (3) las
  claves reales de `CONFIG.MAPA` leídas en otros dos puntos (`completarCambioParada`,
  `funciones-mapa.js:2214-2215`; `manejarCambioModoMapa`, `:2653-2654`); (4) `mapa-completo.html:180`
  (`zoom: 15, maxZoom: 21`) y `video-intro.html:928`. Valor efectivo del "zoom inicial": **13** al
  crear el mapa real, **15** al restaurar la vista en un cambio de modo (`ZOOM_INICIAL`, `:2654`)
  y al alejar en un cambio de parada (`:2215`, el `|| 14` nunca se usa). No es un bug demostrado
  (puede ser a propósito), pero el mismo número configurable manda en dos sitios y no en el
  tercero.
- **Forma del dato:** `CENTRO_DEFECTO` es un objeto `{lat, lng}` (`config.js:144`) y el literal de
  respaldo es un array `[lat, lng]`. `setMapView()` acepta las dos formas (`funciones-mapa.js:
  1330-1342`) y por eso `:2653` funciona; la rama muerta (`:1228`) asume array y se rompería si
  se adoptara la clave real sin más.
- **Método:** `Read` de `config.js` completo y de los cuatro tramos de `funciones-mapa.js`;
  búsqueda desnuda `maxZoom|minZoom` en padre/js/mapa-completo/video-intro.
- **Pendiente:** C4 ya propone la decisión (borrar la rama o repararla). Añadir: si se
  centraliza la lectura (K-02), el mapa real debería leer también de ahí.

- **Estado final (2026-10-02).** ✅ Cerrada en `cf1d484`: `inicializarServicioMapa` ya no tiene la rama que
  creaba otro mapa (OSM raster, `maxZoom` 18) con claves que no existen en `CONFIG.MAPA`; sin instancia
  avisa y devuelve `false`, que el padre ya trata como «reintentar». Todos los llamadores pasan una
  instancia (el padre la crea justo antes con `new maplibregl.Map(...)` y los nueve specs que lo llaman
  pasan `fakeMap`; `funciones-mapa.js` solo lo importa el padre). Quedan las otras fuentes de «dónde arranca
  el mapa» (los literales del mapa real, `CONFIG.MAPA` leído en `completarCambioParada` y
  `manejarCambioModoMapa`, `mapa-completo.html` y `video-intro.html`): se deciden con K-02.

##### K-04 — Configuración de monitoreo: tres juegos de umbrales, ninguno leído; un historial que nadie consume — ✅

- **Dónde.** `codigo-padre.html:4262-4292` (`estado.monitoreo.config`: `habilitado`, `nivelLog`,
  `rastrearRendimiento`, `rastrearErrores`, `rastrearEventos`, `maxEventos`, `maxErrores`,
  `umbralAlerta {tiempoRespuesta:1000, usoMemoria:85, tasaError:0.1}`, `historial.maxItems`
  25/100); `js/state-manager.js:68-82` (`monitoreo.config.umbralAlerta {usoMemoria:80, usoCPU:90,
  tiempoRespuesta:5000}`, `maxItems:100`); `js/config.js:159-171` (`MONITOREO.UMBRAL_MEMORIA`
  50 MB, `UMBRAL_MENSAJES_PENDIENTES` 50, `METRICAS_HABILITADAS`).
- **Lecturas reales:** `habilitado`, `rastrearEventos` y `maxEventos` (`codigo-padre.html:5347,
  5359-5360`) e `INTERVALO_METRICAS` (`js/monitoreo.js:66`). Ninguna otra clave de umbral tiene
  lector. Método: búsqueda desnuda de `umbralAlerta|UMBRAL_|tasaError|rastrearRendimiento|
  rastrearErrores|maxErrores` en el padre y `js/*.js`: solo definiciones.
- **`estado.monitoreo.historial.eventos`** se escribe (`:5357`, hasta 1000 entradas) y solo se
  vuelve a leer para recortarse a sí mismo (`:5359-5360`): no hay consumidor. `tools/
  codigo-muerto.js` no lo marca porque cuenta esa autolectura como lectura (K-34).
- **`registrarEvento` dos veces:** `globalThis.registrarEvento` (`:5329`, loguea y rellena ese
  historial) y `registrarEvento` de `js/app.js:954` (solo loguea; su docblock promete "ID del
  evento registrado" y no devuelve nada; no se expone a propósito, comentario `app.js:1020`).
- **Un cuarto juego de umbrales, local y fijo, es el único que se aplica.** `js/monitoreo.js:35-40`
  define `UMBRALES` (`MEMORIA_MB` 150, `MENSAJES_PENDIENTES` 50, `TIEMPO_RESPUESTA_MS` 1000,
  `ERRORES_POR_MINUTO` 10), que lee `verificarUmbrales` (`:194-217`; `MENSAJES_PENDIENTES` no tiene
  lector). El módulo importa `CONFIG` solo para `INTERVALO_METRICAS` (`:66`): ninguno de los tres
  juegos configurables de arriba (85 % en el padre, 80 % en el state-manager, 50 MB en `config.js`)
  llega a ese código. Lo que producen las alertas es un `logger.warn` (`generarAlerta`, `:221-238`)
  y `estadoMonitoreo.alertas`, que solo se escribe y se recorta a sí misma (`:228-232`), el mismo
  patrón que `historial.eventos`.
- **Captura de errores no controlados: dos mecanismos que se solapan.** `js/utils.js:741-766`
  (`instalarReporteErroresAlPadre`) registra `error` y `unhandledrejection` y manda cada uno al padre
  como `SISTEMA.ERROR`, con deduplicación y tope; solo se instala en frames con padre (`:744`:
  en el padre devuelve `false`). `js/monitoreo.js:82-83` registra los mismos dos eventos y los
  convierte en `registrarMetrica('error', …)` (`:239-254`), que incrementa un contador, apila el
  error en un historial de cinco minutos y emite un `debug` (`:98-138`). `monitoreo.js` se carga en
  el padre y, por `<script type="module" src>`, en hijo1 y hijo5: en esos dos un mismo error activa
  los dos caminos (el que avisa al padre y el que alimenta un contador sin lector) y en el padre solo
  el segundo; el padre cuenta además los `SISTEMA.ERROR` que recibe en su propio contador
  (`codigo-padre.html:12800`, K-41). Las dos mitades no se hablan.
- **Pendiente:** decidir si el monitoreo se queda (y entonces tiene que tener un lector y una
  sola config) o se retira. Sin urgencia: ninguno de los tres juegos hace nada hoy.

- **Estado final (2026-10-02).** Retirados: `obtenerEstadoMonitoreo` de `js/app.js`, con su publicación en
  `globalThis` y su limpieza en `pagehide` (`f6ab460`, cero lectores), y el `export default` de
  `monitoreo.js` (`01eeb47`); el docblock de `registrarEvento` ya no promete un id (G-7, `6538bba`). La guía
  de §26.4 dice lo que hay (`218c0ae`): los umbrales los fija `monitoreo.js` (memoria 150 MB, no los 50 MB
  de `config.js`), `TIEMPO_RESPUESTA_ALTO` no puede dispararse y el historial vive en `estadoMonitoreo`.
  Comprobado con búsqueda desnuda: `tiempo_respuesta`, `mensaje_enviado` y `mensaje_recibido` solo aparecen
  en el `switch` de `registrarMetrica` (`js/monitoreo.js`) y en `tests/test_registrarMetrica.js`, y el único
  emisor de `MONITOREO.METRICA` (hijo2) manda `gps_error_code`, que ese `switch` no trata. **Abierta,
  decisión:** *A) retirar el monitoreo* — **recomendada**: `js/monitoreo.js`, los tres juegos de umbrales
  configurables (`codigo-padre.html`, `js/state-manager.js` y `js/config.js`), el historial sin consumidor y
  el contador duplicado de errores (K-41) no producen nada observable. *B) conservarlo y darle un lector*
  (por ejemplo, mostrar `alertas` en el panel de logs), con una sola configuración y emisores reales para
  las tres métricas que hoy nadie emite.

##### K-05 — Constantes copiadas, con su valor en cada sitio — 🧩 (con una pregunta ⚠️)

Resultado del instrumento de constantes agrupado por nombre y por valor, leídos los sitios:

| Decisión | Sitios | Valores |
|---|---|---|
| Radio de llegada | `funciones-mapa.js:65` (`RADIO_LLEGADA_PARADA_M`), `coordenadas-hijo2.html:462` (`radioLlegada`), `:1328` (`RADIO_PARADA`) | 15 / 15 / 15 — el comentario `hijo2:462-467` reconoce que coinciden |
| Ventana de confirmación de llegada | `coordenadas-hijo2.html:1284-1285`, `funciones-mapa.js:3247-3248` (`_VENTANA_LLEGADA`, `_CONFIRMACION_LLEGADA`) | 4 / 2 en los dos |
| `maximumAge` de `getCurrentPosition` | 7 sitios con `0`; `codigo-padre.html:11470` con `30000` | ver K-17 |
| Duración de aventura de respaldo | `codigo-padre.html:13360, 13362` (`216000`) vs `js/indice-aventuras.js` (6 × `216000`, 1 × `540000`) | el respaldo vale para 6 de 7; ruidoso (`warn` en `:13365`); alcanzable solo si el índice no está cargado |
| Timeout del primer GPS / reintento / señal | `:5586` (8000 base), `:5679` (15000), `:6812` (15000 literal), `CONFIG.GPS.TIMEOUT` (30000, sin lector) | ver K-01, K-17 |
| Polling de espera | `maxIntentos`/`intervalo`: 150×200, 25×200, 150×100, 100×100, 50×100, 40×250 | todos por `retryUntilAvailable`, un solo camino con parámetros por sitio (➖) |

- **Pregunta ⚠️:** la ventana 4/2 y el radio de 15 m están duplicados *porque* son dos sensores
  (K-06). Si se decide compartir el algoritmo, estas tres constantes son lo primero que deja de
  estar duplicado.

#### Familia B — Un mismo hecho en dos sitios

##### K-06 — Dos sensores de llegada — 📌 ya cerrado; no se reabre

Catalogado en "Candidatos ya cerrados por la propia guía" (`GUIA-COMPLETA.md` L481 y §10.5/§25.5)
y declarado en el código: `funciones-mapa.js:3110-3111`, `:3143-3145`, `:3223-3231` ("dos
sensores del mismo hecho, ninguno sustituye al otro"). Se comprueba que **sigue cerrado**; lo
que esta ronda añade es solo el coste de mantenimiento, por si el estudio individual decide
compartir el algoritmo:

- **Texto copiado.** `coordenadas-hijo2.html:1273-1344` (`_registrarCandidataLlegada`,
  `_detectarLlegadaTramo`, `_detectarLlegadaParada`) y `js/funciones-mapa.js:3233-3285`: misma
  ventana "2 de las últimas 4", mismo flag de "ya notificada", misma histéresis ×1.5, e incluso
  el comentario largo de por qué no valen "2 seguidas" (`hijo2:1273-1283` / `funciones-mapa:
  3234-3246`).
- **Estado en dos raíces con los mismos nombres:** `estadoComponente._llegadaCandidataId/
  _llegadaVentana/_llegadaNotificada` (hijo2) y `estadoMapa._llegadaCandidataId/_llegadaVentana/
  _llegadaNotificada` (funciones-mapa). Dos transportes: hijo2 → bus → padre;
  funciones-mapa → `mensajeria.despacharLocal` (`:3277`).
- **El handler** (`codigo-padre.html:12343-12384`) no distingue emisor salvo en el log, y vuelve a
  centrar el mapa en cada señal (`:12368-12374`); dos señales por parada = dos centrados. Que
  `pending.llegada` sea idempotente lo dice la guía; no se ha medido.
- **Una tercera ruta de "llegada"** que no pasa por el handler: la rama `tipo === 'inicio'` de
  `funciones-mapa.js:3151-3158` dispara `mostrarCartelLlegadaParada` directamente.
- **Veredicto:** decisión de diseño documentada. El estudio individual decide si compensa
  extraer el algoritmo (los dos frames no comparten módulo hoy: hijo2 no carga `funciones-mapa.js`).

##### K-07 — `hijosInicializados` y `estadoPadre` existen dos veces, con ciclos de vida distintos — ✅ (medido: M-4)

- **Dos conjuntos.** (1) El del padre, `estado.hijosInicializados`: alta en
  `_hdl_SISTEMA_HIJO_LISTO` (`codigo-padre.html:7441`), baja en `_normalizarSetHijos`
  (`:13183-13185`). (2) El del state-manager, `state.estadoPadre.hijosInicializados`: alta en
  `marcarHijoListo` (`js/state-manager.js:222-226`, llamada desde `codigo-padre.html:7443-7444`),
  **ninguna baja en todo el repo**. Método: búsqueda desnuda de
  `hijosInicializados\.(delete|clear)|hijosInicializados\s*=` → solo el conjunto del padre
  (`:13180, :13184`), `app.js:183` y specs.
- **Quién consume cuál.** `crearPromiseHijoListo(id)` (`state-manager.js:202-205`) devuelve
  `Promise.resolve()` al instante si el id está en **su** conjunto. Consumidores:
  `_esperarHijoListo` (`:8113-8116`; usado por `_cargarSingleIframe` `:8161` y
  `_reconectarHijoIndividual` `:8239`), `_esperarHijosCriticosRest` (`:4989-4990`),
  `_gpsEsperarHijosListos` (`:5457-5461`), `_esperarHijosCargados` (`:13155-13156`) y
  `esperarHijosListos` (`mensajeria.js:1013-1020`, que usa `app.js:418-419`). El padre, en
  cambio, decide con **su** conjunto: `distribuirDatosAventura` (`:9910, :9948`) y el sondeo de
  respaldo (`:4996`, `:13162`).
- **Ruta afectada.** La "ruta fallback" de `_hdl_SELECCION_AVENTURA_ACTIVADA` (`:13262-13278`)
  vacía el conjunto del padre, recarga los cinco iframes y llama a `_esperarHijosCargados`, cuyo
  comentario (`:13123-13131`) exige esperar "un HIJO_LISTO NUEVO de cada uno". Se toma cuando
  `_iframesPreCargadosP14` es falso — y `_hdl_SELECCION_REINICIAR` lo deja falso (`:12990`). Con el
  conjunto del state-manager sin vaciar, esa espera resolvería de inmediato para todo hijo que ya
  avisó una vez. **Compensación existente:** si falta hijo2 en el conjunto del padre,
  `distribuirDatosAventura` pospone (`__pendingDistribucion`) y lo reintenta al llegar el aviso.
- **`estadoPadre` también duplicado.** `globalThis.estadoPadre` (`:4224`) y
  `state.estadoPadre`, copiado en profundo dos veces al arrancar (`:4334` y
  `createEstadoPadreProxy`, `state-manager.js:412-420`, que **no es un proxy**: vuelve a llamar a
  `setEstadoPadre`). `updateEstadoPadre` y `getEstadoPadre` no tienen ningún llamador de
  producción. Consecuencia leída: `diagnosticarStateManager()` y `getEstado()`
  (`state-manager.js:462-476, 517-527`) informan `modo`, `todosHijosListos` y
  `hijosInicializados` de la copia del arranque; solo `gps` se lee del padre (`:526`).
- **POR MEDIR:** una reactivación tras `SELECCION.REINICIAR` (ruta fallback): ¿`_esperarHijosCargados`
  espera de verdad al HIJO_LISTO nuevo o resuelve al instante? Medir el tiempo entre su llamada y
  el log "HIJO_LISTO RECIBIDO" real, y si `distribuirDatosAventura` devuelve `pospuesto`.
  Spec candidato: `74-reiniciar-seleccion-llega-al-padre.spec.js` (no lo ejecuta esta ronda).

- **Estado final (2026-10-02).** ✅ Medido (M-4): la hipótesis se confirma. En la ruta fallback de
  `SELECCION.AVENTURA_ACTIVADA` con los hijos ya cargados una vez, `_esperarHijosCargados` resuelve en 0 ms
  (los cinco `load` tardan 85 ms y los cinco `HIJO_LISTO` nuevos llegan entre +96 y +123 ms, 11–38 ms
  después de que la espera diera por buenos a todos) y `distribuirDatosAventura` devuelve `pospuesto`; lo
  compensa `__pendingDistribucion`, que reintenta al llegar el aviso de hijo2. En el código, `218c0ae`
  retira lo que ningún llamador usaba del state-manager —`updateEstadoPadre`, `getMapaControladores`,
  `removerControladorCentral`, `setHeartbeat`, `setGpsPendientes`, `cancelarPromiseHijoListo`, 8 de los 12
  mutexes y 7 banderas de estado— y `getEstado()`/`diagnosticarStateManager()` informan solo de lo que
  existe (`script2Listo`). **Abierta, decisión** (toca el ciclo de vida de un conjunto que usa el bus, regla
  1): *A) añadir al state-manager `olvidarHijoListo(id)` y llamarla donde el padre vacía el suyo
  (`_normalizarSetHijos`)* — **recomendada**: son tres líneas, `crearPromiseHijoListo` vuelve a esperar un
  `HIJO_LISTO` nuevo y desaparece la compensación implícita. *B) dejarlo*: el comportamiento observable es
  correcto gracias a `__pendingDistribucion`, y la espera de esa ruta sigue resolviendo antes de tiempo
  (solo ocurre tras `SELECCION.REINICIAR` seguido de una reactivación).

##### K-08 — El mismo campo de estado en varias raíces — 🧩 / 🔎

Instrumento: nombres de campo escritos bajo ≥2 raíces de estado distintas (17 de 123 nombres).

| Campo | Raíces (fichero) |
|---|---|
| `_llegadaCandidataId`, `_llegadaVentana`, `_llegadaNotificada` | `estadoComponente` (hijo2) / `estadoMapa` — K-06 |
| `gpsActivo` | `estado.gps.activo` (padre, 8 sitios) / `estadoMapa.gpsActivo` (`funciones-mapa.js:2557,2584,2596`) / `estadoComponente.gpsActivo` (hijo2 `:1009,1667`) / `estado.gpsActivo` (hijo5) |
| `posicionUsuario`, `ultimaUbicacion`, `proximidadReal`, `precision`, `permisos`, `error` | `estado.gps.*` (padre) / `estadoMapa.*`; `sincronizarEstadoGPSConPadre()` (`funciones-mapa.js:1115-1121`) copia de uno a otro — mecanismo previsto; **`activo` y `watchId` no se copian** |
| `modo` | `estado.modo(.actual)` en `app.js` y en hijo3/hijo4/hijo5 / `estadoMapa.modo` / `estadoComponente.modo` (hijo2) — documentado por la guía §37.5 (📌) |
| `paradaActual`, `tramoActual` | `estado.*` (padre, `app.js:824-825`) / `estadoMapa.*` |
| `tiempoRestante` | `estado.tiempoRestante` (padre) / `estadoTemporizador.tiempoRestante` (hijo1) |
| `terminosAceptados`, `ultimaInteraccion` | selección / padre / hijo1 |
| `hijoListoEnviado` (6 frames), `inicializado` (5), `datosRecibidos` (2) | banderas por frame: esperable |

- **Un instrumento que informa la copia equivocada:** `diagnosticarGPS()`
  (`funciones-mapa.js:2463-2475`) devuelve `gpsEstado.activo` desde `estadoMapa.gpsActivo`, no
  desde `estado.gps.activo` que es el que decide `activarGPS()`.
- **Veredicto:** ninguno de los 17 se ha demostrado roto; es el mapa de "mismo dato, dos dueños"
  para el estudio individual. 🔎 para todos salvo los ya documentados.

##### K-09 — Escritores múltiples del estado del padre — 🔎

49 rutas de campo con ≥3 funciones escritoras (la ronda 1 miró una). Las más repartidas:
`estado.retoActual` (8 funciones, 10 sitios), `estado.seleccion` (8, 9 sitios), `estado.estadoHijos`
(7), `estado.gps.permisos` (6), `estado.gps.posicionUsuario` (6), `estado.elementoActual` (6, E5),
`estado.modo` (6), `estado.paradaListaParaAvanzar` (5), `estado.indiceProgreso` (5),
`estado.gps.precision` (5), `estado.gps.ultimaUbicacion` (5), `estado.seleccion.iniciada` (5).
Dos formas concretas ya vistas al leer:

- `_procesarFinAudioElemento` (`codigo-padre.html:12578-12610`): tres ramas repiten la escritura de
  los mismos cinco campos de `estado.retoActual` (`id`, `disponible`, `completado`, `cola`,
  `colaCompletados`) en `:12578-12582`, `:12599-12603`, `:12606-12610`.
- `_aplicarFallbackCoordenadasGPS` (`:5511-5542`): tres ramas escriben `posicionUsuario`,
  `ultimaUbicacion` y `precision` con el mismo bloque (`:5520-5522`, `:5528-5530`, `:5536-5538`).
  Este fallback **sí es ruidoso**: `_obtenerPosicionInicialGPS` muestra el overlay de señal antes
  (`:5596-5606`).
- **Pendiente:** la lista completa está en el instrumento de estado; ninguna de las 49 rutas se
  ha leído una a una. Es el siguiente trabajo natural de "estudio individual".

##### K-10 — Globals con varios escritores — 🔎 (más ➖ para los alias de scripts)

- **Padre:** 182 globals escritos, 32 con ≥2 escritores. Los de nombre propio de lógica:
  `__HEARTBEAT_INICIADO` (K-11), `__pendingDistribucion` (5 sitios: `:3934, 4034, 4041, 8195,
  8396`), `aventuraSeleccionada` (5) e `idiomaSeleccionado` (7, entre ellos los dos caminos de
  "elegir otra", K-19), `_codigoValidadoP13` (4), `_iframesPreCargadosP14` (4: K-07),
  `rotationSuppressed` (3), `AVENTURA_PARADAS` (`:9944` y `js/funciones-mapa.js:1928`), los de
  modo desarrollo (ver §24).
- **Pares de alias entre Script 1 y Script 2** (`TIPOS_MENSAJE`, `MODOS`, `enviarMensaje`,
  `registrarControlador`, `ajustarTimeoutPorConexion`): todos con guarda `=== undefined`, el
  primero gana y los dos asignan el mismo objeto del mismo módulo (`codigo-padre.html:3976-3987` y
  `:10034-10039`). ➖. Dos más son distintos: `getPadreId` (dos bloques con guarda, `:188` y
  `:4124`; el segundo no corre nunca, y la función no tiene llamadores de producción: K-28) y
  `activarGPS` (el stub con cola de `:49-79` se sustituye a propósito en `:6076` y sus llamadas en
  espera se vacían en `:6083`; ➖).
- **Resto de frames:** 3 en total — `_uiConfirmado` en hijo1 (4 escritores: `:100, :149, :267,
  :304`), `TokenManager` (`js/api-client.js:89` y `:489`) y un global de modo desarrollo en
  selección. Hijo2 a hijo6, mapa-completo, puzzle y video-intro: 0 (`globals.txt` del
  instrumento, una línea por frame).

- **Estado final (2026-10-02).** Los dos bloques con guarda de `getPadreId` ya no existen (la función se
  retira en `f6ab460`, K-28); el resto del apartado no cambia. `activarGPS` y los pares de alias entre
  scripts siguen igual.

#### Familia C — Heartbeat y mensajería

##### K-11 — Heartbeat: cuatro rutas de arranque (dos no hacen nada), una bandera con siete escrituras y un camino de "volver a la pestaña" que no usa el previsto — ✅ (medido: M-1, M-2, M-3)

*Corregida el 2026-10-01, el mismo día de su redacción: la primera versión de esta entrada trataba
los arranques (a) y (c) como vivos y con políticas opuestas. El barrido de nombres de `globalThis`
(K-38) mostró que los dos buscan la función con un nombre que nadie define y no hacen nada.*

- **Arranques.** (a) Script 1, `codigo-padre.html:4075-4105`: **no hace nada.** Busca la función
  como `iniciarHeartbeat`, `iniciarHeartbeat_S1` o `globalThis.iniciarHeartbeat` (`:4079`); las
  tres son `undefined` (K-38), `typeof hbFn === 'function'` es falso y el bloque entero —con su
  política "con `modo` nulo pospone" y su intervalo `ajustarTimeoutPorConexionSafe(5000)`— se salta
  sin dejar ni un log. (b) `_activarHeartbeatAventura` (`:7535-7548`): `iniciarHeartbeat` por
  `globalThis.mensajeria`, 5000 ajustado; no mira la bandera. **Con (d), es de los dos arranques que sí arrancan.**
  (c) Script 4, `:15012-15028`: **tampoco hace nada** — sus dos llamadas son
  `globalThis.iniciarHeartbeat` y `globalThis.pausarHeartbeat`, que nadie asigna (K-38) —; lo único
  que ejecuta es poner la bandera a `true` en la rama AVENTURA (`:15019`, fuera de la guarda) y el
  log de nivel debug de la rama CASA (`:15023`). Su política "con `modo` nulo cae a CASA" y su
  intervalo de 10000 no llegan a usarse. (d) `js/app.js`: `iniciarPrewarmEnCasa` (`:745-748`:
  `preiniciarHeartbeat()` y a continuación `pausarHeartbeat()`), `_preiniciarHeartbeatSiNecesario`
  (`:382-387`) y `_reanudarSubsistemasTrasPrewarm` (`:395-396`: `reanudarHeartbeat()`, que limpia
  `userPaused`, `mensajeria.js:994-1008`).
- **Paradas.** `_transicionarAModoCasa` (`:7574-7605`) y `app.js:_pausarHeartbeatCasa`
  (`:442-446`). `_detenerHeartbeatSeguro`, que llama el `pagehide` del padre (`:14913-14924`,
  `:14952`), **no detiene el latido**: busca `globalThis.detenerHeartbeat`, que no existe (K-38), y
  solo baja la bandera (`:14919`). El helper de consola `_testHeartbeatPauseResume`
  (`:15066-15090`; nadie lo llama, `tools/codigo-muerto.js` lo marca) documenta la expectativa:
  con `userPaused`, `iniciarHeartbeat` se ignora, y un `CAMBIO_MODO` a aventura lo limpia.
- **La bandera `__HEARTBEAT_INICIADO`:** 7 escrituras en 6 sitios (`:4095, 5273, 7543, 7599, 14919,
  15019`) y 3 lecturas (`:4078, 14915, 15012`); la de `:4095` pertenece al arranque (a), que no
  corre, y la de `:15019` se ejecuta sin que nada haya arrancado (solo si el modo ya es AVENTURA
  cuando Script 4 llega ahí). El estado real vive en el state-manager (`getHeartbeat()`: `activo`,
  `userPaused`, `intervalo`). `_activarHeartbeatAventura` pone la bandera a `true` aunque
  `iniciarHeartbeat` haya devuelto `false`: se niega mientras `userPaused`
  (`mensajeria.js:964-967`), y `pausarHeartbeat()` marca `userPaused: true` **aunque el latido no
  estuviera activo** (`:1060-1066`) — cosa que hacen `_transicionarAModoCasa` y (d); (c) no llega
  a hacerla (K-38).
- **Volver a la pestaña.** El handler inline del padre (`:14891-14907`) manda un
  `SISTEMA.HEARTBEAT` en `broadcast` **sin mirar la pausa**. `adelantarLatido()`
  (`mensajeria.js:1028-1045`) está escrita justo para eso y su comentario dice: "Si el latido está
  en pausa (modo CASA) no hace nada: la pausa es una decisión, y saltársela fue exactamente el
  fallo de tener dos latidos". **No tiene ningún llamador de producción**: la describe la guía
  (L3619, L6263) y la llama solo el test `BC-12c` (`79-bus-contrato.spec.js:384-399`). Método:
  búsqueda desnuda `adelantarLatido` en `*.{html,js,cjs,mjs,md}` → definición, export (`:190`),
  guía, spec. Es decir: la función existe, está documentada y probada, y el camino real que
  debía usarla hace otra cosa.
- **POR MEDIR (necesita ejecución y el OK del usuario):** (1) arranque en frío directo a AVENTURA
  (reanudación): estado final del latido y de la bandera. Con K-38 el arranque (c) no pausa; queda
  por ver si algún otro camino —(d), en una carga que pase por CASA— deja `userPaused` a `true` y
  bloquea el `iniciarHeartbeat` de `_activarHeartbeatAventura`, y si la bandera miente por
  `:15019`. (2) intervalo efectivo: se espera el de (b), 5000 ajustado por la conexión; (3) en
  CASA, qué hacen los hijos con el `HEARTBEAT` que llega al volver a la pestaña.
- **Los demás `visibilitychange`, leídos uno a uno** (ninguno toca el latido; cada uno decide una
  cosa distinta): en el padre, `:4952` (diálogo de "vuelta rápida" tras salir por un enlace
  externo, solo si está la bandera `__vv_salidaEnlaceExterno`), `:6777` (`once`: con el GPS
  denegado en iOS, reintenta `activarGPS()` al volver), `:15344` (service worker:
  `registration.update()` al ocultar; al volver, reaviso del banner pendiente y nueva consulta de
  versiones) y `:15387` (wake lock). Fuera del padre, `js/reciclaje-digital.js:196-199`
  (`armarRedDeSeguridad`: al ocultarse la pestaña ejecuta la limpieza; solo se arma durante los
  modales de fin, etiquetas `FIN_AVENTURA`, `TIEMPO_AGOTADO` y `P17_DESPEDIDA`) y
  `boton-casa-hijo5.html:1284` (solo desarrollo: al volver manda por iniciativa propia un
  `HEARTBEAT_RESPONSE` con `razon: 'visibilitychange'` y regenera sus botones).

- **Estado final (2026-10-02).** ✅ Medido (M-1, M-2, M-3). M-1: en la reanudación directa a AVENTURA el
  latido arranca (`activo:true, userPaused:false`) y la bandera `__HEARTBEAT_INICIADO` queda a `true`; tras
  CASA, `activo:false, userPaused:true`; de vuelta a AVENTURA arranca de nuevo — ni el prewarm de CASA deja
  `userPaused` pegado ni queda bloqueado el arranque (b). M-2: intervalo efectivo **5000 ms**; los 10000 ms
  de (c) no se usaban. M-3: con el latido pausado, el `visibilitychange` manda un `SISTEMA.HEARTBEAT` en
  `broadcast` a los seis iframes registrados sin mirar la pausa; los seis contestan y `activo`/`userPaused`
  no cambian. Código (`2ed1658`): fuera los arranques (a) del Script 1 y (c) del Script 4 —buscaban
  funciones que nadie define—, la bandera `__HEARTBEAT_INICIADO` (el estado real es `getHeartbeat()`; el
  spec 46 RU-1 lo lee de ahí), `_detenerHeartbeatSeguro`, las limpiezas de `pagehide` sobre nombres
  inexistentes y los operandos `|| globalThis.iniciarHeartbeat`/`pausarHeartbeat`; el ayudante de consola
  `_testHeartbeatPauseResume` llama ya a `globalThis.mensajeria.iniciarHeartbeat`. El spec 09 MC-7a deja de
  leer tres globals que nadie asigna y mide `getHeartbeat()` (`8452f8d`, K-32). La guía dice que
  `adelantarLatido()` no tiene llamador y que el `visibilitychange` difunde por su cuenta (G-3, `6538bba`).
  **Abierta, decisión** (el camino de «volver a la pestaña»: el handler inline manda el `HEARTBEAT` sin
  mirar la pausa y `adelantarLatido()` está escrita justo para respetarla): *A) llamar a `adelantarLatido()`
  desde ese handler* — **recomendada**: respeta la pausa de CASA, es lo que la guía ya describía y lo que
  prueba BC-12c; el efecto observable es que en CASA los hijos dejan de recibir ese `HEARTBEAT` suelto al
  volver a la pestaña. *B) dejar el envío directo y retirar `adelantarLatido` con su BC-12c*: coincide con
  lo medido, pero se pierde la pausa respetada.

##### K-12 — Registro de handlers: tres almacenes, uno sin definición y un "fallback previsto" que avisa como si fuera una avería — ✅

- **Dónde.** `js/mensajeria.js:237-305`. `registrarControlador` delega en el state-manager si
  existe (`:255-269`); si no, usa `obtenerMapaManejadores()` (`:284-305`), que prueba (1)
  `sm.getManejadores()`, (2) `globalThis.__vv_getManejadores()` y (3)
  `globalThis.__vv_manejadoresLocales`.
- **El almacén (2) no existe:** búsqueda desnuda de `__vv_getManejadores` en todo el repo → solo
  `mensajeria.js:271, 291-293` (lecturas y comentario); nadie lo define. Es una capa intermedia
  muerta.
- **El almacén (3) es el camino normal de diez frames** (todos menos el padre: hijo1-6, selección,
  mapa-completo, puzzle, video-intro; solo el padre carga el state-manager) y el propio
  comentario lo llama "fallback previsto" (`mensajeria.js:116`) — pero `:119-123` emite un
  `logger.warn("state-manager no disponible en init — se usará fallback local")` en **cada**
  arranque de cada uno de esos frames. Un aviso en nivel `warn` para el camino nominal. Los
  specs `03`, `07`, `10` comprueban que `__vv_manejadoresLocales` queda **vacío en el padre**, no
  que los hijos lo usen.
- **`getMapaControladores()`** (async, `state-manager.js:365`): ningún llamador de producción; el
  que se usa es `getMapaControladoresSync` (alias `getManejadores`, `:436`).
- **Pendiente:** dos preguntas separadas — ¿se quita el almacén (2)? y ¿el aviso de (3) pasa a
  `debug` o se quita? Ninguna toca la regla 1 (la mensajería sigue cerrada): es limpieza dentro
  del contrato del bus.

- **Estado final (2026-10-02).** Retirados en `218c0ae`: el almacén (2) `__vv_getManejadores` (nadie lo
  define), `listarControladores` y `getMapaControladores()` (búsqueda desnuda en los 260 ficheros de texto:
  solo aparecían su definición, su clave en un objeto-API y menciones de los documentos). **Abierta,
  decisión:** el aviso del almacén (3),
  `logger.warn("state-manager no disponible en init — se usará fallback local")`, sigue saliendo en cada
  arranque de cada frame que no es el padre (es el camino normal de diez frames). *A) emitirlo solo en el
  padre* — **recomendada**: ahí sí significaría una avería; en los hijos es el camino previsto. *B) bajarlo
  a `debug` en todos.* Es limpieza dentro del contrato del bus.

##### K-13 — `mensajeriaReady`: dos emisores, un receptor condicional y una bandera que no se escribe — 🧩

- **Dos emisores:** `js/mensajeria.js:1323` (`new Event('mensajeriaReady')` al *cargar el
  módulo*, antes de que nadie llame a `inicializarMensajeria`) y `codigo-padre.html:3959`
  (`CustomEvent`, tras inicializar; su comentario lo llama "evento ÚNICO ... completamente lista").
- **Un receptor condicional:** `js/app.js:26-37` espera el evento solo si `globalThis.mensajeria`
  no existe aún cuando se evalúa `app.js`; con el orden actual de imports del padre
  (mensajería primero, `codigo-padre.html:3740`) la rama de espera no corre.
- **Una bandera sin escritor:** `state-manager.js:26, 42, 475, 517` declaran
  `state.mensajeriaReady` y la informan; nadie la escribe (siempre `false`). Búsqueda desnuda de
  `mensajeriaReady` en el repo: ninguna asignación a esa clave.
- **Dos nombres para el state-manager:** `globalThis.__stateManager` y `globalThis.__vv_stateManager`
  se asignan juntos (`state-manager.js:481-482`) y se leen indistintamente (`codigo-padre.html:
  4989, 5457, 8114, 8141, 14136`, `mensajeria.js:111, 117-120, 222`).
- **Guía contradictoria:** `GUIA-COMPLETA.md` L3627 dice que el módulo lo dispara "inmediatamente al
  cargarse"; L4899 (tabla) lo atribuye a "`mensajeria.js` (tras `inicializarMensajeria`)". Código
  y L3627 coinciden; L4899 no.
- **Veredicto:** inocuo hoy (el listener nunca espera), pero es una señal de "bus listo" repetida
  de cuatro formas (existencia del global, evento, `__MENSAJERIA_INICIADA`, bandera del
  state-manager).

- **Estado final (2026-10-02).** La bandera sin escritor `state.mensajeriaReady` se retira con el resto de
  banderas muertas del state-manager (`218c0ae`), y la contradicción de la guía (L3627 frente a L4899, G-2)
  se corrige en `cf4b973`. Los dos emisores del evento `mensajeriaReady` y el receptor condicional de
  `js/app.js` no se tocan: son inocuos y entran en la mensajería cerrada (regla 1).

##### K-14 — Un segundo bus dentro del padre: tres eventos DOM propios — 📌

- `vv-parada-cambiada` (emite `codigo-padre.html:12238`; escucha `js/funciones-mapa.js:2740`) y
  `vv:paradas-disponibles` (emite `:9945`; escucha `funciones-mapa.js:2810`, pasivo) además de
  `mensajeriaReady` (K-13). Mientras que `mensajeria.despacharLocal` presta el mismo servicio dentro
  del mismo frame para `LLEGADA_DETECTADA` (`funciones-mapa.js:3277`) y para el `CAMBIO_PARADA` de
  una restauración (`_restoreBroadcast`, guía L4715).
- **Documentado:** guía L2047, L4900-4901; comentario `funciones-mapa.js:2735-2738` ("escucha un
  CustomEvent disparado por padre DESPUÉS de procesar"). Es intencional.
- **Pendiente (decisión, no medición):** si `despacharLocal` sustituyera al `CustomEvent`, el orden
  cambia (el evento corre *después* del handler del padre; `despacharLocal` se encola en la fila
  del bus). Cualquier unificación pasa antes por los specs `51-mapa-id-parada-resuelto` y los de
  cambio de parada.

##### K-15 — `SISTEMA.NACK` y la validación del modo — 📌 + 🧩

- **`SISTEMA.NACK`:** `GUIA-COMPLETA.md` §10.11 ya lo documenta ("el padre no escucha
  `SISTEMA.NACK`", rama defensiva). Se confirma leyendo los 9 puntos de emisión: seis de
  hijo→padre por "modo inválido" (hijo1, hijo2, hijo3, hijo4, hijo5, selección); un séptimo,
  también de hijo4 hacia el padre, desde un `catch` genérico (`retos-hijo4.html:1462`) — ese
  **sí puede dispararse** con cualquier excepción del handler de `CAMBIO_MODO`; y dos del padre
  a hijo4 (`codigo-padre.html:10892`, `:10925`), único receptor. Un NACK al padre cae en "sin
  handler", que el bus registra a nivel **`debug`** (`mensajeria.js:784-787`); ver K-35.
- **El bloque copiado:** `!modo || !['casa','aventura'].includes(modo)` → NACK en 6 frames
  (`audio-hijo3.html:1357`, `coordenadas-hijo2.html:1709`, `extrainfo-hijo1.html:463`,
  `retos-hijo4.html:1379`, `En-busca-del-tesoro.html:2827`, hijo5 `:558` en otra forma).
- **La validación del modo existe en cuatro formas** (amplía C2): `canonicalizarModo`
  (`js/utils.js:14`, minúsculas y recorte; un llamador, `app.js:527`), `normalizarModo` (hijo3
  `:1081`, hijo4 `:1169`; sanea para una clase CSS, no valida), el `includes` estricto de arriba
  y, en el padre, `_hdl_SISTEMA_CAMBIO_MODO` (leído entero, abajo). Hoy no divergen
  (el padre solo envía `'casa'`/`'aventura'` en minúscula).
- **`_hdl_SISTEMA_CAMBIO_MODO`, leído entero (`codigo-padre.html:7638-7828`).** Un único guard de
  secuencia (`estado.sistema.cambiandoModo`, `:7653-7658`, liberado en el `finally`, `:7826`): no hay
  un segundo camino de bloqueo. La validación del modo **no está en el handler**: este compara el
  `modo` crudo con `===` contra `MODOS.CASA`/`MODOS.AVENTURA` (`:7677, 7729, 7732, 7801`) y contra los
  literales `'casa'`/`'aventura'` (`_gestionarHeartbeatSegunModo`, `:7609-7611`), y la delega en
  `manejarCambioModo` (`js/app.js:512-537`, que sí pasa por `canonicalizarModo` y responde
  `{ exito: false }` a un modo inválido, sin NACK). Los efectos previos de entrar en CASA —congelar
  el progreso real, parar los recordatorios, ocultar los carteles de distancia, `_codigoValidadoP13 =
  false`, reiniciar `estado.retoActual` (`:7677-7714`)— corren **antes** de esa validación. Con
  `modo: 'CASA'` en mayúsculas, `canonicalizarModo` lo aceptaría y esos efectos previos y la pausa del
  latido no correrían; hoy nadie lo manda así. Dos cosas menores: `_gestionarGpsSegunModo` recibe dos
  parámetros que no usa (`origen`, `mensaje`) y se le hace `await` siendo síncrona (`:7812`), y
  hijo5 se muestra/oculta en dos sitios (`:7729-7740` aquí y `_mostrarInterfazReanudacion`,
  `:4970`, con la misma condición de modo desarrollo).

##### K-16 — Mapa del bus: completo, con las precisiones de K-35 y K-36 — ➖

94 tipos, 253 puntos de emisión, 144 de recepción; un único `addEventListener('message')`
(`mensajeria.js:130`) más el canal del Service Worker (`codigo-padre.html:15253`, `sw.js:180`);
`postMessage` solo en `mensajeria.js:479, 519, 530, 853` y en el canal del SW. Todos los tipos
tienen emisor y receptor **en algún frame** salvo `NAVEGACION.GPS.DESACTIVAR` (cerrado,
placeholder); **comprobado por destino, no todo lo emitido llega a un handler** (ocho
`SISTEMA.CONFIRMACION` y siete `SISTEMA.NACK` al padre; cinco handlers que ninguna emisión alcanza,
K-35) y la carga útil tiene claves y valores que solo existen en un lado (K-36). Residuo 8
explicado: `registrarEvento` (no es mensaje), 3 del SW, 4 internos del bus.
`node tools/verificar-mensajeria.js` marca 5 tipos más como "sin emisor/receptor" y **los 5 son
falsos positivos del verificador** (K-34), comprobados con búsqueda desnuda de cada tipo.

- **Estado final (2026-10-02).** Tras `8daa6db` ya no hay ningún `SISTEMA.CONFIRMACION` al vacío y los
  handlers que ninguna emisión alcanza son dos (`AVENTURA.FINALIZADA` en el padre y `UI.CLOSE_MENUS` en
  hijo1: K-35). Quedan los 7 `SISTEMA.NACK` al padre, que son una rama defensiva documentada en §10.11. Los
  94 tipos no cambian; la tabla de §37.3 de la guía se regeneró en `8daa6db`.

#### Familia D — GPS

##### K-17 — Una posición puntual, seis maneras de pedirla y tres de reintentarla — ✅

- **Los seis sitios de `getCurrentPosition` en el padre** (más uno de diagnóstico en
  `funciones-mapa.js:2505`, descartado en la ronda 1): `:5552` (`_gpsIntentarPosicion`, `maximumAge: 0`,
  timeout 8000×1.8^i), `:5618` (`_finalizarActivacionGPS`: escribe `est.gps` **directamente** y
  pone `activo = true`), `:6127` (botón del overlay de baja precisión), `:6309`
  (`_gpsReintentarDesdeOverlayDistancia`), `:6798` (overlay de señal, timeout literal 15000) y
  `:11454` (`_obtenerUbicacionUsuario`, `maximumAge: 30000`).
- **Tres políticas de posproceso:** escribir `est.gps` a mano (5552, 5618), pasarla a
  `funcionesMapa.procesarPosicionGPSParaAventura` (6127, 6309, 6798), o devolverla al llamador
  (11454, que además cae en silencio —`warn` y luego `debug`— a `estado.gps.posicionUsuario` sin
  mirar su antigüedad, `:11475-11481`).
- **Tres implementaciones de "reintentar ubicación"** (6127-6147, 6309-6323, 6798-6812): misma
  secuencia (pedir una posición, procesarla, si falla ceder a `showGpsSignalOverlay`); distinto
  timeout (`ajustarTimeoutPorConexion(5000)` las dos primeras, 15000 literal la tercera) y distinta
  limpieza al acertar. El comentario `:6305-6306` presume de "sin duplicarla".
- **Método:** `grep -n "navigator.geolocation.getCurrentPosition(" codigo-padre.html js/*.js` →
  6 llamadas en el padre (`:5552, 5618, 6127, 6309, 6798, 11454`) y 1 en `funciones-mapa.js:2505`.
- **POR MEDIR (en campo, no en Playwright):** ¿el timeout distinto del reintento de señal importa
  con GPS en frío? Hay un hueco de decisión, no un bug demostrado.

- **Estado final (2026-10-02).** Sin cambios en los seis sitios de `getCurrentPosition` ni en las tres
  implementaciones de «reintentar ubicación»: es una decisión de diseño, no una avería. M-8 (reintento de
  15000 ms frente a 5000 ms con el GPS en frío) **no es ejecutable en Playwright**: es una prueba de campo y
  queda sin medir. Lo único que cambia alrededor: los plazos que leían el `Config` inexistente son ahora
  literales (K-01) y los 15 puntos de cuenta `incrementarContador` (el hub del GPS del padre,
  `funciones-mapa.js` y hijo2) se retiran (K-38). **Abierta, decisión:** *A) una sola función «pedir una
  posición puntual» con el plazo como parámetro* — recomendada si se quiere reducir copias: conservando cada
  plazo (5000 ajustado por conexión, 15000 literal) no cambia nada observable, y las tres políticas de
  posproceso se eligen con un argumento. *B) dejarlo*, que es lo que la lectura estática permite sostener
  hoy.

##### K-18 — Permisos de geolocalización consultados desde tres ficheros y dos frames — 🧩

`navigator.permissions.query({name:'geolocation'})`: padre `:5392` (¿hay permiso? —devuelve `true`
si la API no existe o falla—), `:5498` (solo diagnóstico, `debug`), `:6856` (vigilante del cambio
de permiso tras un error de código 1; no en Apple), selección `En-busca-del-tesoro.html:1782`
(bloquea la validación de acceso si está "denied", con una excepción de desarrollo, ver §24) y `funciones-mapa.js:2489`
(diagnóstico). Cuatro decisiones distintas con la misma API; ninguna comparte código. La memoria
del proyecto ya dice que el esfuerzo va al camino con permisos concedidos: se anota solo el mapa.

#### Familia E — Sesión, abandono y caducidad

##### K-19 — Dos implementaciones de "abandonar la aventura y volver a selección"; el reinicio de la brújula solo está en una — ✅ (efecto medido y corregido: M-5)

- **Dónde.** `ejecutarElegirOtra()` (`codigo-padre.html:4758-4820`, dentro de
  `mostrarDialogoReanudacion`) y `_elegirOtra()` (`:4879-4927`, dentro de
  `mostrarDialogoVueltaRapida`, que expone `globalThis._mostrarDialogoVueltaRapida`, `:4933`).
- **Los dos cuerpos son casi el mismo texto:** borran las mismas cinco claves, ponen a `null`
  `aventuraSeleccionada`/`idiomaSeleccionado`, vacían `estado.seleccion`, `tiempoRestante`,
  `tramoSkipsUsados`, `paradasCompletadas`, llaman a `_ocultarUIActivada()`, quitan `loading`,
  revelan el iframe de selección y mandan `NAVEGACION_PANTALLA`. Diferencias: `ejecutarElegirOtra`
  tiene guarda de reentrada (`resuelta`, `:4759-4760`), para el temporizador y loguea; y **solo
  `ejecutarElegirOtra` llama a `globalThis._resetBrujulaModo?.()` (`:4796`)**.
- **Por qué importa:** el comentario de `:4792-4796` dice que ese reinicio es necesario porque este
  camino "reutiliza el mismo module scope de funciones-mapa.js — sin esto, el modo de cámara
  ('Seguir mi rumbo'/'Norte fijo') de la aventura abandonada seguiría activo en la siguiente, con
  el icono ya desincronizado". `_elegirOtra` también reutiliza el scope (no recarga la página) y
  su comentario (`:4907-4909`) dice que en ese caso la aventura **sí estaba realmente activa**: es
  el caso en que el modo de cámara tiene más probabilidades de no ser el de por defecto.
  `_ocultarUIActivada()` (`:4635-4654`) oculta el menú `#brujula-modo` pero no toca
  `_brujulaModoActivo`. El comentario de `_resetBrujulaModo` (`:3628-3631`) menciona solo
  `ejecutarElegirOtra`.
- **Método:** búsqueda desnuda `_resetBrujulaModo` → definición (`:3632`), un único llamador
  (`:4796`) y el spec `25-brujula-modo.spec.js` (BR-8), que comprueba que la función reinicia el
  menú, no que las dos vías de abandono la llamen. Lectura de los dos cuerpos enteros.
- **POR MEDIR:** "Vuelta rápida → Elegir otra → nueva aventura": ¿sigue activo "Seguir mi rumbo" y
  el icono desincronizado? Es lectura estática firme; falta la ejecución.

- **Estado final (2026-10-02).** ✅ Medido y corregido. M-5: con «Seguir mi rumbo» elegido y la brújula
  «viva», `desactivarSeguimientoRumbo()` se llamaba **0 veces** tras «Vuelta rápida → Elegir otra aventura»
  (1 con `_resetBrujulaModo()` directo); `#brujula-modo` quedaba oculto y `estado.tiempoRestante` a `null`,
  es decir, lo demás del abandono sí corría. `c7c7b1a`: `_elegirOtra` llama al mismo `_resetBrujulaModo()`,
  con el mismo motivo escrito; el comentario de `_resetBrujulaModo` nombra las dos vías (G-6) y el spec 25
  gana BR-10 (rojo antes: 0 llamadas; verde después). La guía distingue los dos diálogos (G-23). **Abierta,
  decisión:** los dos cuerpos siguen siendo casi el mismo texto (K-20). *A) extraer una función común de
  «abandonar la aventura y volver a la selección»* — **recomendada**: este mismo fallo demuestra que una
  corrección hecha en una copia se pierde en la otra. *B) dejar las dos copias con un comentario cruzado.*

##### K-20 — Cinco formas de borrar la sesión guardada — 🧩 (con una medición: M-9)

Cada una tiene su motivo y su comentario; ninguna comparte código, así que añadir una clave a la
sesión obliga a revisar todas.

| Dónde | Claves que borra |
|---|---|
| `ejecutarElegirOtra` `:4766-4770` | `vv_aventura_iniciada`, `vv_progreso`, `vv_paradas_completadas`, `vv_idioma`, `vv_aventura` (5) |
| `_elegirOtra` `:4882-4886` | las mismas 5 |
| `_transicionarAModoCasa` `:7588-7590` | 3 (sin idioma ni aventura; solo si no es modo desarrollo —ver §24— y no es reanudación) |
| `_comprobarReanudacionAventura` `:8459-8460` | 2 (rama "sin modal disponible", con `error` en el log) |
| `_restoreCheckStale`/`_restoreCheckMismatch` `:4497, 4506, 4511` | solo `vv_progreso` |
| `limpiarDatosAventura` (`js/reciclaje-digital.js:50-81`) | todo: `localStorage.clear()`, `sessionStorage.clear()`, cachés y SW; lo llaman `codigo-padre.html:4478` (`'timeout'`), `:8785`, `:13605` y la selección (`En-busca-del-tesoro.html:1890`, `'completada'`) |

Veredicto 🧩: las diferencias parecen intencionadas (cada fila responde a un motivo distinto).
Lo que no se ha comprobado es qué pasa si una de las filas parciales deja `vv_paradas_completadas`
o `vv_aventura` viva para la siguiente sesión (la fila de `:8459-8460` es la que más claves deja).

- **Estado final (2026-10-02).** Medido (M-9): una sesión caducada (8 días) sembrada con las cinco claves y
  con `mostrarModalTiempoAgotado` ocultado, para forzar la rama «sin modal disponible» de
  `_comprobarReanudacionAventura`, borra `vv_aventura_iniciada` y `vv_progreso` y **deja vivas
  `vv_aventura`, `vv_idioma` y `vv_paradas_completadas`**; con el modal disponible no se borra nada hasta
  que el usuario lo cierra y entonces `limpiarDatosAventura('timeout')` lo vacía todo. Lectores:
  `vv_paradas_completadas` solo la lee la restauración de una sesión guardada (necesita
  `vv_aventura_iniciada`, que la siguiente aventura vuelve a escribir) y `vv_aventura` es el último respaldo
  de un nombre de aventura; el daño solo sería posible si se reabre la app antes de completar ninguna parada
  de la aventura siguiente, y la rama solo corre si `mostrarModalTiempoAgotado` no existe (en M-9 hubo que
  ocultarla para alcanzarla). Su equivalente, `_restoreCheckTimeout`, sí llama a
  `limpiarDatosAventura('timeout')`. **Abierta, decisión:** *A) que la rama «sin modal» llame también a
  `limpiarDatosAventura('timeout')`* — **recomendada**: una línea, mismo comportamiento que su gemela y sin
  claves vivas. *B) dejarla*: el riesgo medido es casi nulo. La tabla de arriba sigue siendo la fotografía
  de las cinco formas; ninguna se unifica.

##### K-21 — Caducidad de la aventura guardada — 📌

`_comprobarReanudacionAventura` (`:8403-8471`) combina un TTL de 7 días (`TTL_PROGRESO_GUARDADO_MS`)
con `verificarTimeoutAventura()` (`js/reciclaje-digital.js:130-165`). Este último **falla abierto**
(`{ excedido: false }` si falta el índice o el metadato, `:144-147, 163`) y el propio código lo
reconoce y lo mitiga cargando el índice antes de decidir (`:8423-8442`). Respaldo de duración
`216000` en `:13360-13362` (K-05). Cerrado en el código y en los comentarios; solo se anota por
completitud.

#### Familia F — Cargas y esperas

##### K-22 — La misma espera de "hijo listo" escrita cinco veces, y la espera de carga de iframe tres — 🧩

- **Esperas de `HIJO_LISTO`:** `_esperarHijoListo` (`codigo-padre.html:8113-8127`),
  `_esperarHijosCriticosRest` (`:4986-5008`), `_gpsEsperarHijosListos` (`:5453-5480`),
  `_esperarHijosCargados` (`:13148-13175`) y `esperarHijosListos` (`js/mensajeria.js:1013-1030`).
  Todas usan la promesa del state-manager si existe. El respaldo cuando no existe es un sondeo
  de 150×200 ms (30 s) en dos, de 25×200 ms en `_gpsEsperarHijosListos`, una sola comprobación
  tras `ajustarTimeoutPorConexion(5000)` en `_esperarHijoListo`, y "dar a todos por listos"
  en `esperarHijosListos` (`mensajeria.js:1015`). Esos respaldos **no son alcanzables** mientras
  `state-manager.js` se cargue (`:481-482` publica el objeto) y **no avisan al entrar** (el
  sondeo solo informa al resolver). Ver K-07: la promesa del state-manager es además la que
  resuelve de inmediato para hijos que ya avisaron.
- **Esperas de carga de iframe:** `_esperarCargaIframe` (`:8097-8111`, 10 s ajustado por conexión),
  `_cargarIframeConTimeout` (`:13103-13136`, 8 s fijo, con el comentario "NO hacer esto
  idempotente") y `cargarIframeConDatos` (`:14807-14834`, sin timeout; no registra el iframe en el
  bus; su segundo argumento a `enviarMensajeIframe(…, iframe.contentWindow)` lo ignora el bus,
  `mensajeria.js:331` recibe un solo parámetro; único llamador `mostrarHijo4`, `:14856`).
- **Pendiente:** decidir si merece un único helper `esperarHijoListo(id, {timeout})`. No hay bug
  demostrado; el coste es que cada cambio de política de espera hay que repetirlo cinco veces.

##### K-23 — `retryUntilAvailable()` tiene dos convenciones de llamada y una no la usa nadie; guía y specs describen una llamada que ya no existe — ✅

- **Dónde.** `js/utils.js:249-315`: rama "legacy" `(actionFn, readyFn, maxIntentos, intervalo,
  logFn)` (`:251-283`) y rama actual `(checkFn, {maxIntentos, intervalo, mensaje})` (`:285-314`);
  cada una con su `intentar` interno (dos de los homónimos de K-29).
- **Llamadores de producción: 8, todos con la forma actual** (segundo argumento objeto):
  `codigo-padre.html:3644, 4995, 5467, 8281, 13161, 14155`, `js/app.js:862`, `js/utils.js:687`.
  La rama legacy no tiene ninguno. Método: búsqueda desnuda `retryUntilAvailable` en
  `*.{js,cjs,mjs,html,md}` (8 ficheros: `codigo-padre.html`, `js/app.js`, `js/utils.js`, 4 specs,
  la guía) y lectura de cada llamada; en los 4 specs solo aparece en comentarios.
- **Lo que describen la guía y los tests y el código ya no hace:** `GUIA-COMPLETA.md` L13625-13640
  ("el caso vivo del proyecto es `enviarMensaje()` de los hijos … que bifurca por
  `parent !== window` … `retryUntilAvailable(..., 10, 500)` sobre `globalThis.mensajeria`") y los
  specs `38-polyline-y-reset-botones-cambio-modo.spec.js:67-74, :107-108` ("`enviarMensaje()` de los
  hijos bifurca por `parent !== window`"; el `31-…` ya lo cuenta en pasado, `:24`). En el código
  actual los hijos toman `enviarMensaje` del bus (`retos-hijo4.html:452`, `coordenadas-hijo2.html:420`);
  búsqueda desnuda de `10, 500` en producción: 0; las comprobaciones de `parent` que quedan en
  los hijos están fuera de `enviarMensaje` (`extrainfo-hijo1.html:128`, `boton-casa-hijo5.html:318`,
  `mapa-completo.html:174`, la selección) o son la lectura de K-26.
- **Pendiente (decisión del usuario, la guía no se toca sin permiso):** quitar la rama legacy de
  `retryUntilAvailable` y reescribir el ejemplo de la guía y los comentarios de los specs.

- **Estado final (2026-10-02).** ✅ `b6affee`: `retryUntilAvailable` con una sola convención de llamada
  (`checkFn`, `{ maxIntentos, intervalo, mensaje }`); la rama «legacy» se retira porque no tenía llamadores
  (los 8 de producción pasaban el objeto, comprobado leyendo cada llamada). El spec 38 deja de apoyarse en
  una rama de `enviarMensaje()` que ya no existe: abre hijo2 en el marco (`abrirHijoEnMarco`), como los
  specs 26 y 31. Medido al reescribirlo: **PB-2 no podía fallar** (con `idParadaActual` y
  `btnAvanzarCompletadoPorPadre` sin resetear, tanto el original como el reescrito pasaban, porque en CASA
  avanzar queda deshabilitado de todos modos); se añade el tramo de volver a AVENTURA sin completar nada
  (rojo con la mutación, verde sin ella) y se espera a `CAMBIO_MODO_EFECTUADO` en vez de a un tiempo. La
  guía (G-1): `retryUntilAvailable`, el ejemplo de §36 y la descripción del spec 38.

#### Familia G — Idioma y textos

##### K-24 — `__vv_idiomaActual` se lee en hijo4 y no se asigna nunca allí: sus textos salen siempre en español — ✅ (medido: M-13)

- **Dónde.** Lee: `retos-hijo4.html:739` (`MSG_RETO_NO_DISPONIBLE[globalThis.__vv_idiomaActual] ||
  .es`) y `:841` (`PLACEHOLDER_RESPUESTA_TEXTO[…] || .es`). Escribe: solo
  `coordenadas-hijo2.html:1823`, al recibir `DATOS.CARGAR_COORDENADAS`.
- **Por qué es firme sin ejecutar:** cada iframe tiene su propio `globalThis`; la asignación de hijo2
  no llega al de hijo4. Búsqueda desnuda de `__vv_idiomaActual` en `*.{html,js,cjs,mjs,json}`: 3
  líneas (la de hijo2 y las dos de hijo4), ninguna asignación en hijo4.
- **Efecto:** en una aventura que no sea la española, el marcador del campo de texto y el aviso
  "reto no disponible" de hijo4 salen en español. No lo ha medido nadie; es consecuencia directa
  de las tres líneas.
- **Pendiente:** hijo4 necesita recibir el idioma por el bus (el padre ya lo manda a hijo2 en
  `DATOS.CARGAR_COORDENADAS`). Pregunta: ¿en `PADRE_DATOS`, en `RETO.MOSTRAR` o en un mensaje de
  datos propio de hijo4? No se ha leído qué lleva hoy `RETO.MOSTRAR`.

- **Estado final (2026-10-02).** ✅ Medido (M-13): `idiomaActual` es `undefined` en hijo4
  (`__vv_idiomaActual` no se asigna nunca allí), y el marcador del campo de texto («Escriba su respuesta
  aquí...») y el aviso «Este reto no está disponible en este momento.» salen en español, igual que la
  entrada `es` de la tabla, que sí tiene los 12 idiomas. Los textos de los retos (enunciado, opciones,
  respuestas) no se ven afectados: vienen en los 12 idiomas de los datos; lo afectado son solo los dos
  textos propios de hijo4. **No se arregla** (cambia lo que ve el usuario). **Abierta, decisión — canal del
  idioma hacia hijo4:** *A) que `RETO.MOSTRAR` lleve `idioma`* — **recomendada**: ese mensaje ya viaja por
  parada y es el que pinta el reto, así que el idioma llega justo cuando se necesita y hijo4 no tiene que
  guardar ni refrescar ningún estado. *B) `SISTEMA.PADRE_DATOS` con `idioma`*: un solo envío, pero hijo4
  tendría que conservarlo y no se enteraría de un cambio de idioma. *C) que hijo4 lea
  `parent.idiomaSeleccionado`*: descartada, abre un segundo camino fuera del bus (K-26). Ninguna medición
  cubre el efecto con una aventura no española en vivo: se deduce de las tres líneas de código citadas
  arriba.

##### K-25 — Textos de usuario fuera de `traducciones-ui.js`: 93 candidatos a literal en español asignados en ejecución, 5 `alert()` y un hook de validación que nadie implementa — ✅ (alcance 🔎)

- **Instrumento:** literales en español asignados a `textContent`/`innerText`/`innerHTML`/`title`/
  `placeholder`/`alt`/`aria-label` y a `alert`/`confirm`/`prompt`. De 321 asignaciones de texto,
  73 no son literales (vienen de tabla o variable), 155 no son españolas y **93 candidatas** (al
  menos una, `codigo-padre.html:13931`, es CSS y no texto). Por fichero: padre 61, selección 19,
  hijo4 5, hijo2 3, hijo5 2, puzzle 2, mapa-completo 1; **hijo1, hijo3 y hijo6: 0**.
- **Clasificación leída (no solo contada):** (a) padre: 44 de las 61 son `alt`/`title`/
  `aria-label` de los overlays de GPS ("Reintentar ubicación", "Cerrar overlay", "Estás lejos de tu
  objetivo"… `:6103-6666`, `:6739-6947`) y de los controles del mapa (`:3417, 3560`): texto
  accesible solo en español; el botón visible lleva solo iconos. (b) padre `:7085, 7213-7214`
  ("Próxima parada", "No hay información disponible"): overlay de "próxima entidad" cuyo alcance
  en producción no se ha comprobado. (c) selección: mensajes de fallo de carga de términos,
  agradecimientos, normativa, retos y aventuras (`:1380-1384, 1836-1840, 1922-1926, 2238, 2348`) y
  los de "Reto R-1/R-2" (`:1491-1524, 2391-2424`). (d) hijo2: tres `title` de botones
  (`:543, 1683, 2199`). (e) puzzle y mapa-completo: mensajes de error. (f) hijo5: marco de
  desarrollo. (g) padre: modales de entrada de código y panel de logs (ver §24).
- **`alert()` — 5 sitios en 2 frames.** Padre `:4016` y `:13663`: último recurso **declarado**
  ("alert() nativo, para no depender de la misma maquinaria que puede haber fallado",
  `:4001-4008`, `:13650-13652`) y **traducido** (`MSG_ERROR_CARGA_APP[idioma]`,
  `TRADUCCIONES_TIEMPO_AGOTADO[idioma]`). Hijo4 `:966, :974, :982`: bloqueantes, **con el texto en
  español fijo** ("Por favor, seleccione una opción.") en una app de 12 idiomas, y para un caso
  de uso normal (pulsar Enviar sin elegir) — si el botón puede estar activo en ese momento (⚠️
  POR MEDIR; `:849` lo habilita para los retos de texto).
- **`ejecutarValidacion`: un hook que no tiene implementación en todo el repo.** Stub siempre
  `true` en el padre (`:85-89`, sin ningún llamador) y en hijo4 (`:26-35`, con una llamada en
  `:956-957` cuya rama `=== false` solo se alcanza si el propio `console.info` lanza). Búsqueda
  desnuda `ejecutarValidacion`: solo esas líneas. El `catch` de `:963-969` (el que hace el
  `alert("Error en la validación…")`) es defensivo: inalcanzable salvo que algo lance.
- **Páginas de contenido estáticas — fuera del alcance del instrumento de i18n, que solo ve JS.**
  `gastronomia.html`, `consejos-valencia.html`, `videos-valencia-historica.html` y
  `paginas-oficiales-valencia.html` (105 a 348 líneas) son HTML y CSS sin ningún `<script>`, con
  `lang="es"` único y sin ninguna elección de idioma (búsqueda de `idioma`, `hreflang` y `:lang()`
  en ellas: 0). `extrainfo-hijo1.html:544-550` las abre desde su menú para los 12 idiomas, así que
  **su contenido sale en español cualquiera que sea el idioma elegido**; la guía las lista sin
  mencionar el idioma (L1624-1627, L2425-2428). Además, `videos-valencia-historica.html` tiene un
  único enlace de YouTube titulado "Video Valencia Histórica - Ejemplo 1" y el subtítulo
  "(créditos a los autores del video)": parece contenido provisional. Decisión de producto, no
  comprobada con el usuario.
- **Pendiente:** ¿se quieren estos textos en `traducciones-ui.js`? Es una decisión de producto
  (la memoria dice "botones en 12 idiomas"); lo mínimo defendible son los 3 `alert` de hijo4 y los
  de la selección (visibles en el flujo normal si falla una carga).

- **Estado final (2026-10-02).** M-6: pulsar «Enviar» sin elegir opción en un reto de opción muestra un
  `alert()` real, en español («Por favor, seleccione una opción.»), con el botón visible y habilitado: es un
  caso de uso normal. **No se arregla** (cambia lo que ve el usuario; se decide junto con K-24).
  `ejecutarValidacion` sigue siendo un stub sin implementación. **Abierta, decisión — textos de usuario
  fuera de `traducciones-ui.js`:** *A) mover los tres `alert()` de hijo4 y los mensajes de fallo de la
  selección a `traducciones-ui.js`, en los 12 idiomas y con el registro formal de usted* — **recomendada**
  como mínimo defendible: son los que se ven en el flujo normal (el `alert()` de hijo4) o cuando falla una
  carga (los de la selección). *B) además, los `alt`/`title`/`aria-label` del padre y de hijo2*: solo
  afectan a accesibilidad. *C) las cuatro páginas de contenido estáticas*: decisión de producto aparte
  (`videos-valencia-historica.html` parece contenido provisional).

##### K-26 — "¿Qué aventura es esta?" en hijo2: tres vías y una lectura directa de `parent` — 🧩

`coordenadas-hijo2.html:1187-1189`: `__vv_aventuraActual` (escrita solo en `:1822`, al llegar los
datos) → `globalThis.parent.aventuraSeleccionada` (**lectura directa de una variable de otro
frame, fuera del bus**) → el literal `'Aventura1'` con `logger.warn` (ruidoso). Es el único sitio
de los hijos de producción que lee el estado del padre por la ventana. Lecturas directas de
`parent` en el repo (búsqueda desnuda de `parent.X` sin `postMessage`, `.html` y `js/*.js`): ese,
el de `js/logger.js:116` (`globalThis.parent?.__vv_config…`, **documentado** a propósito,
`:105-116`, cubierto por el spec 60) y el script que el padre inyecta en hijo5, frame de
desarrollo (`parent.registrarMetrica`, `codigo-padre.html:143, 156`). `node
tools/verificar-frames.js` no ve ninguno de los tres (K-34).

##### K-27 — Tabla de imágenes de título copiada — 🧩

`codigo-padre.html:13793-13798` (`_EN_BUSCA_IMG_POR_IDIOMA`) y `En-busca-del-tesoro.html:1813`
(`EN_BUSCA_IMAGENES`): las mismas doce entradas (`es → en-busca-español.png` … `uk →
en-busca-ucraniano.png`), idénticas. El comentario del padre lo dice ("mismo mapa que usa
En-busca-del-tesoro.html"). Búsqueda desnuda `en-busca-ucraniano`: exactamente esas dos líneas.
Otras tablas indexadas por idioma (12/12): `LANG_ARCHIVO_PARRAFOS` (`data-loader.js:157`),
`MAPEO_IDIOMAS` (`indice-aventuras.js:7`), `AUDIO_WARNING_TEXTS`, `banderasIdiomas`
(`En-busca-del-tesoro.html:2047, 2914`): una sola copia cada una, ➖.

#### Familia H — Helpers copiados y homónimos

##### K-28 — Familias de copias — 🧩

| Familia | Copias | Notas |
|---|---|---|
| Escapar HTML | 8, todas en `codigo-padre.html`: `_escapar` ×6 (`:8916, 8993, 9072, 9136, 9199, 9273`), `_esc` (`:13898`), un `return` en `:14326` | texto idéntico; ninguna copia en `js/` (búsqueda desnuda del mapa `&#39;`: solo el padre) |
| `sleep` | `codigo-padre.html:2888` y `js/utils.js:355` | **texto idéntico** (el único homónimo idéntico) |
| `mostrarFraseAleatoria` | `codigo-padre.html:2940-2951`, `En-busca-del-tesoro.html:1972-1983` | misma forma (89 tokens, Jaccard 0.74), distinto elemento y estado; 400 ms/5000 ms copiados |
| Detección de móvil | `codigo-padre.html:4140` (regex propia, usada en `:4291, 4295`), `js/proteccion.js:24`, `js/device-detection.js:35` (usada por `mensajeria.js`, `funciones-mapa.js:1137-1180`, `app.js:1006`) | tres listas de patrones distintas (solo `device-detection` incluye `webos`, `windows phone`, `mobile`, `tablet`). La cabecera `device-detection.js:5-11` dice que solo la usan `mensajeria.js` y el padre: no es cierto. Además `esApple = /iPad\|iPhone\|iPod/` dos veces en el padre (`:6773, 6853`) |
| Logger | `(globalThis.logger \|\| console)` **918 veces** en `codigo-padre.html` (el padre resuelve el logger en cada llamada por el global); módulos y hijos importan `logger` y llaman `logger.x` | sin divergencia de resultado; la forma del padre cae al `console` sin filtro de nivel si el global aún no existe. La selección tiene un envoltorio `_log` documentado (`En-busca-del-tesoro.html:1059-1081`, spec 62): ➖ |
| `enviarHijoListoConReintento` | 6 (hijo1 `:247`, hijo2 `:1528`, hijo3 `:1204`, hijo4 `:1260`, hijo5 `:837`, hijo6 `:728`) | mismo algoritmo; la corrección "en `finally`" de la auditoría 2026-08-18 aparece con el mismo comentario en hijo1, hijo3 y hijo6 (hijo2, hijo4 y hijo5 tienen la misma forma según el parser): seis copias que corregir; hijo1 y hijo3 muestran la UI como último recurso, hijo6 no (no tiene `mostrarUI`, §26.13) |
| `_displayOriginalBody` | hijo1 `:52`, hijo2 `:412`, hijo3 `:497`, hijo4 `:444`, hijo5 `:332` | una línea cada una, mismo cálculo |
| `createParticle`/`loop` | `puzzle.html:512-557`, `video-intro.html:1905-1934` | misma forma; `life` 100 vs 120 |
| Orientación de la flecha | `debug-brujula.html:134-164` (`calcularHeading`) y `funciones-mapa.js:1687-1722` (`actualizarOrientacionFlecha`) | Jaccard 0.71; la página de depuración copia el algoritmo (nadie carga esa página) |
| Modales de entrada de código | `cerrar`/`confirmar` en el padre (`:13446-13486`, `:15418-15459`) y la selección (`:3114-3160`) | mismo esqueleto en tres sitios (ver §24) |
| `history.pushState({vv_en_aventura:true})` | 3 (`codigo-padre.html:4749, 4942, 13316`) | misma línea; un solo `popstate` (`:4937`) |
| Vibración | `codigo-padre.html:8879`, `En-busca-del-tesoro.html:1570`, `retos-hijo4.html:674-675` | tres frames, tres formas (`typeof … === 'function'`, `?.()`, `if (navigator.vibrate)`), 200/300/300 ms |
| Inyección de estilo en hijo5 | `codigo-padre.html:111-166` (`_handleHijo5IframeLoad`) y `:13923-13935` (`_injectParadasStyle`) | dos inyectores del padre sobre el DOM de un frame de desarrollo |
| Escalado `font-size` raíz | `escalar()` ×8 | ya en C1 + E1/E2 |

- **Estado final (2026-10-02).** Retirados `getPadreId` y `resolverIdPadre` (devolvía `?padreId=` —que nadie
  escribe—, el `vvguides_padreId` de `sessionStorage` —que solo escribía ella— o un id generado que el bus
  no enruta; sus tres usos eran código muerto o inalcanzable), los dos stubs `globalThis.getPadreId` del
  padre y el alias de `utils.js` (`f6ab460`), y `notificarError` de `js/app.js` (el reporte real de errores
  es el de `utils.js`: `SISTEMA.ERROR` con `destino: 'padre'`). La guía deja de describirlos (§33.4 fuera;
  el punto 9 del EJE 4 explica lo que hace `enviarMensaje` cuando `destino === componenteId`: avisa una vez
  por tipo y devuelve `false`, G-22). El resto de las familias de copias (escapar HTML ×8, `sleep` ×2,
  `mostrarFraseAleatoria`, detección de móvil ×3, `enviarHijoListoConReintento` ×6, `_displayOriginalBody`
  ×5, los modales de código ×3…) **no se toca**: es coste de mantenimiento, no una avería, y cada una pide
  su propia decisión (extraer a `js/` o aceptar la copia). Si se decide reducir copias, la que más rinde es
  `enviarHijoListoConReintento`: seis copias de un algoritmo con una corrección («en `finally`») que hay que
  repetir en cada una.

##### K-29 — Los 26 homónimos del parser, clasificados — ➖ / 🧩

La ronda 1 comparó 3. Aquí, los 26 (más 5 que solo ve `inventory:dupes`):

| Nombre | Ficheros | Clasificación |
|---|---|---|
| `escalar` | 8 | C1 (E1, E2) |
| `mostrarUI` | 5 | C3 (E3) |
| `normalizarModo` | 2 | C2 + K-15 |
| `enviarHijoListoConReintento` | 6 | 🧩 K-28 |
| `sleep` | 2 | 🧩 idéntico, K-28 |
| `mostrarFraseAleatoria` | 2 | 🧩 K-28 |
| `createParticle`, `loop` | puzzle/video-intro | 🧩 K-28 |
| `cerrar` (16 defs), `confirmar` (3) | padre + selección | 🧩 closures de modales; las tres `confirmar` son los modales de código (K-28) |
| `globalThis.ejecutarValidacion` | padre/hijo4 | ✅ K-25 |
| `enviarMensaje` | `js/app.js:53-60` / `js/mensajeria.js:331` | envoltorio con guarda `mensajeriaReady` (K-13) frente al bus; no es copia |
| `debug`/`info`/`warn`/`error`/`log` | selección `:1076-1080` / `js/logger.js` | ➖ envoltorio documentado (spec 62) |
| `intentar` ×3 | `js/utils.js:260, 291`, `js/funciones-mapa.js:490` | ➖ funciones internas; las dos de utils son K-23 |
| `cleanup`, `constructor`, `img.onload`/`onerror`, `init`, `limpiar`, `onError`, `registrarControladores` | varios | ➖ mismo nombre, otra cosa (se leyeron las definiciones) |
| solo `inventory:dupes`: `_displayOriginalBody` | 5 | 🧩 K-28 |
| `registrarEvento` | `codigo-padre.html:5329`, `js/app.js:954` | K-04 |
| `diagnosticarGPS` | `codigo-padre.html:15031`, `js/funciones-mapa.js:2463` | ➖ el del padre es un envoltorio que importa y llama al de funciones-mapa |
| `idx`, `modoActual` | variables locales | ➖ |

- **Estado final (2026-10-02).** `intentar` pasa de tres definiciones a dos (`js/utils.js:228` y
  `js/funciones-mapa.js:490`): la rama «legacy» de `retryUntilAvailable` se retira (K-23). El resto de la
  tabla no cambia (`npm run inventory:dupes`).

#### Familia I — Recursos, listas, arnés, CSS y herramientas

##### K-30 — Pares arranque/parada de recursos de larga duración — ➖ (con un 🔎)

Instrumento de recursos (517 sitios), cruzado con la ronda 1 (categoría 2).

- **`setInterval`: 30 sitios, 26 con parada localizable por nombre y 4 sin ella.** Los cuatro:
  `js/app.js:1007` (`__vv_intervaloMemoria`: guarda de idempotencia, nunca se limpia),
  `js/monitoreo.js:72`, `js/mensajeria.js:1285` (id no guardado; la ronda 1 ya lo dio por limpio:
  vive lo que la página; `limpiar()` de `:1266-1278` no lo detiene) y `js/mensajeria.js:975`, que
  **sí** tiene parada pero por otro camino: el id se guarda en el state-manager y lo limpia
  `pausarHeartbeat` (`:1071`). Todos viven lo que la página; ➖.
- **Listeners de vida larga sin `removeEventListener`:** decenas de combinaciones (fichero, target,
  evento), casi todas ciclo de página (`resize`, `pagehide`, `visibilitychange`,
  `DOMContentLoaded`). Las 3 `resize` y 2 `click` registradas dentro de `initializeMap`
  (`codigo-padre.html:3456, 3460, 3497, 3589, 3593`) se acumularían si se llamara más de una vez,
  pero `initializeMap` tiene un solo llamador (`:8290`) y un guarda de concurrencia (`_mapInitializing`,
  spec `06-race-conditions`): ➖.
- **`map.on`/`map.once` sin `map.off` (8):** `registrarListenerZoom`, `_registrarSeguimientoCamara` y
  `_registrarSeguimientoRumbo` se registran una vez por instancia (`inicializarServicioMapa` tiene
  un solo llamador de producción, `:3647`): ➖.
- **`requestAnimationFrame` 22 / `cancelAnimationFrame` 0:** animaciones de puzzle y video-intro y
  el `_zoomRAF` de `funciones-mapa.js:940`: no se han revisado una a una — 🔎.
- **Un observer y tres `Audio` en `puzzle.html`** sin parada explícita: viven lo que la página.

##### K-31 — Las dos listas del Service Worker difieren a propósito — 📌

`APP_SHELL` en `sw.js:26` (56 entradas) y `ficherosDelShell()` en `tools/build-sw.js:132` (53, lo
que entra en el hash de `CACHE_VERSION`). Difieren en `debug-brujula.html` (está en el hash, no en
`APP_SHELL`) y en cuatro imágenes (están en `APP_SHELL`, no en el hash). `sw.js:94-96` lo declara:
"APP_SHELL dice qué se PRECARGA para uso offline; el hash dice qué cuenta … Son cosas distintas a
propósito". Método: `ficherosDelShell()` contra el literal de `APP_SHELL`.

##### K-32 — Arnés de tests frente a producción — ✅ (medido: M-7)

- **Nombres de producción sobrescritos con una función de prueba (6):**
  `enviarMensajeConConfirmacion` (11 asignaciones en 7 specs: `100`, `102`×3, `39`, `40`, `44`×3,
  `46`, `47`), `solicitarCoordenadasHijo` (spec 20:117), `_iniciarRecordatorioAudio` y
  `_iniciarRecordatorioSaltarAudio` (44:528-529), `mostrarImagenOverlay` (55:46),
  `_mostrarCartelRecordatorioRescate` (73:73). Más 5 `page.route` (la comprobación de salud
  `**/api/health`, `parrafos-texto-japones.json`, `imagenes-aventuras/**`, `__contenedor-mc.html`
  y `controladores-padre.js`).
- **Limitación estructural del stub principal.** `globalThis.enviarMensajeConConfirmacion = …`
  solo alcanza a quien resuelve el nombre **en vivo**: el código de Script 2 (un identificador sin
  declarar se resuelve contra el global) y quien escribe `globalThis.` — no a Script 1, que usa su
  `const enviarMensajeConConfirmacion = enviarMensajeConConfirmacion_S1` (`:3970`; por ejemplo
  `solicitarCoordenadasHijo`, `:6064`). El diseño es **deliberado en un punto**
  (`_enviarAudioRequestConReintento`, `:11705-11726`: "expuesta para poder testear … mockeando
  `globalThis.enviarMensajeConConfirmacion`"); no hay nada que compruebe que, en los demás 6
  specs, el stub intercepta lo que se propone.
- **Un spec que mide un nombre que no existe (MC-7a).** Instrumento: los `globalThis.X` que leen
  los 111 specs (1511 lecturas) frente a lo que asigna producción; salen 14 nombres sin definidor,
  de los cuales casi todos son variables del propio arnés (`__arnes`, `__e2e_*`, `__recibidos`…,
  asignadas desde cadenas de `addInitScript` que el parser no sigue), la rama muerta de una cadena
  `||` (`TIPOS_MENSAJE_S1`, `app`) o una ausencia afirmada a propósito (`diagnosticarHijo4`, spec
  `107`). El que importa: `09-mode-change.spec.js:244-258`, «En modo CASA (inicial), el heartbeat no
  está activo», lee `globalThis.__heartbeatInterval`, `__heartbeatActivo` y `__vv_heartbeatActivo`,
  que **ningún fichero de producción asigna**, y afirma `toBe(false)`: **no puede fallar**. El
  indicador real sería `__HEARTBEAT_INICIADO` o `getHeartbeat()` (K-11); lo que garantiza "sin latido
  en CASA" es el spec `78`, no este. Mismo barrido sobre las claves de primer nivel de `estadoPadre`
  que leen los specs (191 lecturas): una sola sin escritor en producción, `estadoPadre.modoActual`
  (`09-mode-change.spec.js:191, 251`, siempre con `|| estadoPadre.modo.actual` detrás, que es la que
  vale).
- **POR MEDIR:** para cada uno de los 7 specs, que el stub reciba al menos una llamada (un
  contador y un `expect`). La ronda 1 verificó 1 de 7.

- **Estado final (2026-10-02).** ✅ Medido (M-7): en todos los tests que sustituyen
  `enviarMensajeConConfirmacion` por un stub, este recibe al menos una llamada (copias instrumentadas de los
  siete specs: `100` 2/2/2, `102` 1 y 2, `39` 4 y 4, `40` 2 y 2, `44` 2 en F-1, H-1 y H-2, `46` 2 y 2, `47`
  2); ninguno intercepta en el vacío. El spec `09-mode-change` MC-7a leía `__heartbeatInterval`,
  `__heartbeatActivo` y `__vv_heartbeatActivo` (nadie los asigna) y afirmaba `toBe(false)`: no podía fallar.
  Ahora lee `getHeartbeat()` del state-manager, y una copia donde el padre arranca el latido antes de leerlo
  falla con «Expected: false, Received: true» (`8452f8d`); MC-5 pierde además `estadoPadre.modoActual`, que
  nadie asigna. El spec 38 PB-2 tampoco podía fallar (K-23, `b6affee`). El spec 71 OB-3 tenía una carrera
  propia con la reconstrucción del FAQ de hijo6 (reproducida también sobre `origin/main`), corregida en
  `5c52038` con mutación como prueba (K-45).

##### K-33 — CSS, DOM y redirecciones — ➖ con restos 🔎

- **Ids pedidos y no definidos: 0** en los 17 documentos (`getElementById`/`querySelector('#x')`
  contra `id="x"`, `.id =`, `setAttribute('id')`; no ve ids construidos por plantilla con
  interpolación en el nombre).
- **Mostrar/ocultar:** el padre mezcla `display` (64 usos), `visibility` (17), clases (68) y
  `opacity` (11). Para los iframes, "mostrar" repone siempre `display` y `visibility`
  (`:4810-4811, 4917-4918, 13197, 13204`) aunque "ocultar" a veces solo ponga `display:none`
  (`:4968, 13192`): no queda ningún estado atascado ➖.
- **Variables CSS (34 nombres):** `--btn-size`, `--icon-size`, `--progress-thick`,
  `--timer-font-size`, `--trapecio-height` se definen en hijo2 **y** hijo3 con valores distintos;
  sin ningún uso: `--audio-action-scale` (padre), `--iframe-h` (3 frames, E1), `--progress-bg`,
  `--progress-color`, `--trapecio-height/-radius/-shadow` (hijo2 y hijo3). `--gap-inferior`
  se define en 6 documentos con valores distintos y se usa en 5: correcto (las variables no
  cruzan iframes). `video-intro.html:366` (`.or-badge`) usa `--tx`/`--ty`, que nadie define, y la
  clase no la usa ningún elemento (búsqueda desnuda `or-badge`: 1 línea): CSS muerto 🔎.
- **Clases CSS (instrumento de clases):** el JS pone tres clases que ninguna regla del documento
  menciona y ninguna lectura usa: `deshabilitado` (`retos-hijo4.html:1534, 1557, 1564`: el efecto
  visual lo da `button:disabled`, la clase es un segundo mecanismo sin efecto), `img-fallback`
  (`codigo-padre.html:1993, 9739`) y `activa` (hijo5: es lo único que pone su handler de `NAVEGACION.CAMBIO_PARADA`; K-48). Reglas cuya clase no aparece en el HTML ni en
  el JS del documento: padre 6 (todo el componente `#notification-container`/`.notification*`,
  `:256-330`, sin elemento ni JS que lo use), hijo2 15 (`.icon-gps`, `.icon-imagen`,
  `.icon-video`, `.gps-activo`, `.gps-inactivo`, `.ubicacion-btn`, `.boton .label-text`…), selección 6,
  hijo3 2, hijo5 2 y video-intro 37; en hijo5 y video-intro los nombres se componen en tiempo de
  ejecución, así que esos dos recuentos son un techo, no un hallazgo. Es CSS muerto, no un segundo
  camino: se anota para quien limpie. 🔎
- **`index.html`:** tres vías hacia `codigo-padre.html` en el mismo fichero — el `location.replace` del
  `<head>` (`:8`), un `setTimeout` de 100 ms (`:147-151`, "si el meta refresh no funciona": no hay
  `<meta http-equiv="refresh">`, búsqueda desnuda `refresh` → solo ese comentario) y el enlace
  manual —, más la regla "forzar HTTPS en `valenciavguides.es`" **duplicada** (`index.html:142-146`
  y `codigo-padre.html:23-27`; la del `index` no se alcanza si el `replace` del `<head>` navega
  antes). La guía lo describe como "puramente decorativo" (L4703). 📌.
- **Navegación (`location.*`):** `reload` ×3 en el padre (`:8790, 13610, 13664`) y 1 en video-intro;
  `location.href = 'En-busca-del-tesoro.html?despedida=1'` ×2 en el padre (`:8818, 13632`). Mismo
  destino, dos sitios; no examinado más allá del hecho.

##### K-34 — Instrumentos del repo que se equivocan en casos concretos — ✅ (regla 6)

La regla 6 dice que cuando una lectura estática y una medición se contradicen "se arregla o se
retira el instrumento estático". Medido en esta ronda:

- **`node tools/verificar-frames.js`** (columna "ajeno", `tools/verificar-frames.js:104`): cuenta
  como "toca otro frame" el texto `parent.document` **de un comentario** (`chat-hijo6.html:376`) —
  1 falso positivo ("Tocan otro frame (Opción A lo prohíbe): chat-hijo6.html (1)") — y no ve las
  lecturas reales de `parent` que no son una llamada (`coordenadas-hijo2.html:1188`) ni las que
  usan `?.` (`js/logger.js:116`): ≥2 falsos negativos.
- **`node tools/verificar-mensajeria.js`:** marca 5 tipos de los 94 como sin emisor o sin receptor
  y **los 5 tienen los dos**: `CAMBIO_MODO_EFECTUADO` (receptor registrado con `registrar(` en
  `js/app.js:82`), `APLICACION_INICIALIZADA` (emitido con `despacharLocal`, `codigo-padre.html:7427-
  7428`), `NAVEGACION.GPS.ERROR` (emitido con el alias `TIPOS_MENSAJE_S1`, `:5914`),
  `NAVEGACION.SUPRIMIR_ROTACION` (`En-busca-del-tesoro.html:2297`) y `SELECCION.VIDEO_INTRO_TERMINADO`
  (`video-intro.html:1957`), los dos últimos por `globalThis.TIPOS_MENSAJE?.…`.
- **`node tools/codigo-muerto.js`:** devuelve 3 funciones (`cargarCoordenadas`, `cargarIndice`,
  `limpiarCacheDatos`, de `data-loader.js`) y 6 campos solo-escritura (`_reflow`,
  `_testHeartbeatPauseResume`, `centroMapa`, `debugRegisterAllowedOrigin`, `errorCentro`,
  `mapaInteractivo`). **No ve** lo que esta ronda encontró en otras clases: una función que solo
  llama un test (`adelantarLatido`), una rama sin llamadores dentro de una función viva
  (`retryUntilAvailable` legacy), un historial que se lee solo a sí mismo
  (`estado.monitoreo.historial.eventos`, cuenta la autolectura) y lecturas de claves inexistentes.
- **`tools/codigo-muerto.js` frente a los exports muertos:** devuelve 3 funciones (`cargarCoordenadas`,
  `cargarIndice` y `limpiarCacheDatos`, de `data-loader.js`); el barrido por tokens de esta ronda
  (K-42) halla 27 exports cuyo nombre no aparece en ningún otro fichero de producción, entre ellos
  esas tres y `validarRespuesta`, que la herramienta no marca.
- **`npm run inventory:dupes`:** 23 nombres; el parser, 26 (K-29).
- **El extractor de storage de esta ronda** no vio `ls.getItem` (lectura por alias): residuo 1/54.
- **La lista `globals` de `eslint.config.js`** (`:76-221`, bloque `*.html`, con `no-undef:
  "warn"`): 120 nombres, 80 de ellos propios del proyecto. Medido con el instrumento por frame
  (K-38): de los 80, 40 se usan sueltos y están definidos en el frame que los usa; **2 se usan y no
  existen en ningún frame — `iniciarHeartbeat` e `iniciarHeartbeat_S1` (`:206-207`)**, y la lista es
  lo que impide que `no-undef` avise de `codigo-padre.html:4079`; 38 no se usan sueltos en ningún
  bloque inline de las 17 páginas, y 12 de ellos ni siquiera están definidos como global en ningún
  frame (`CONFIG`, `ajustarTimeoutPorConexion_S1`, `btnTop`, `codigo`, `coordinarAccion`,
  `enviarMensaje_S1`, `estadoMapa`, `generarIdUnico`, `idPadre`, `notifError`, `overlay`,
  `registrarIframe_S1`): silenciadores latentes, que ocultarían un uso futuro. Además, el bloque de
  `js/**/*.js` no activa `no-undef` (solo lo activa el de `*.html`; el de `tests/**/*.html` lo apaga,
  `:302`), así que los módulos no tienen esa comprobación. El análisis de ámbitos del instrumento
  por frame no usa esa lista: da 0 nombres sueltos sin resolver en los módulos y en `sw.js`
  (`eslint-scope`, builtins de service worker aparte) y 2 en el padre.
- **Los instrumentos de esta ronda.** El de globals de K-10 y la primera pasada de este barrido
  excluían los módulos de datos del lado de las escrituras; dos de ellos asignan un global
  (`DATOS_PADRE`, `RETOS_AVENTURAS`). `RETOS_AVENTURAS` salió "sin definidor" y no lo es: lo cazó la
  búsqueda desnuda (regla 10) antes de escribirlo, y el instrumento por frame ya los incluye.
  Ninguno de los dos tiene un segundo escritor, así que K-10 no cambia; sí su recuento de globals del
  padre (182), que no los incluye.

**Decisión pendiente:** corregir `verificar-frames.js` y `verificar-mensajeria.js` (ignorar
comentarios, cubrir `?.`, propiedades y alias) o retirar las dos columnas/avisos que mienten.
Mientras no se haga, citar su salida como evidencia exige comprobarla a mano, como aquí.

- **Estado final (2026-10-02).** ✅ Corregidos los instrumentos que mentían (regla 6), en `0e115d4`:
  `tools/verificar-mensajeria.js`, `tools/verificar-frames.js` y `tools/codigo-muerto.js` leen con parser
  (`acorn`, con piezas comunes en `tools/lib/analisis-js.js` y el residuo impreso por cada herramienta) y la
  guía los describe (§37.3 regenerada). `verificar-mensajeria` resuelve alias de import, `?.`, constantes
  locales y literales, asigna cada hallazgo a los frames que ejecutan el fichero y reproduce las cifras
  medidas con el extractor de la ronda (94 tipos, 253 emisores, 144 receptores, 15 envíos al vacío y 5
  handlers inalcanzables), sin los 5 falsos positivos; `verificar-frames` ignora comentarios y cuenta
  cualquier propiedad de `parent`/`contentWindow`, así que deja de marcar `chat-hijo6` y ve
  `coordenadas-hijo2.html:1188`, `js/logger.js:116` y el padre; `codigo-muerto` gana una categoría 5 con los
  exports sin uso fuera de su módulo (K-42). Después `verificar-mensajeria` reconoce lo que el propio bus
  construye (el acuse con `idOriginal`) y atiende (la comparación de `mensaje.tipo` en `js/mensajeria.js`) y
  no lo cuenta como handler de un frame, de modo que no oculta los envíos al vacío (`8daa6db`). La lista
  `globals` de `eslint.config.js` pierde 14 nombres: `iniciarHeartbeat` e `iniciarHeartbeat_S1`, que
  impedían que `no-undef` avisara (`2ed1658`); `coordinarAccion` (`218c0ae`); y los otros 11 fantasmas
  (`24ec574`); `npm run lint` sigue sin ningún aviso. La «decisión pendiente» de esta entrada se resuelve
  por la primera opción: se corrigen los dos verificadores, no se retiran sus columnas.
- **Una pasada más sobre `verificar-mensajeria` (2026-10-02, `e3a9cff`).** El instrumento daba por alcanzable en todos los frames, el
  padre incluido, cualquier envío `broadcast` o de destino dinámico que contiene `js/mensajeria.js` (lo cargan los once), y con eso
  daba por vivo un handler del padre que no lo estaba (K-35, M-16): un `broadcast` no llega nunca al frame que lo emite, y el único
  emisor de ese tipo es el padre. Ahora parte del emisor real (`EMISOR_DE_BROADCAST`) y lista 2 handlers inalcanzables, los dos de K-35
  que siguen abiertos. Dos extractores nuevos en `tools/estudio-caminos/`: `guia-handlers-por-frame.cjs` (filas de las tablas de §26.12
  sin respaldo en el código y tipos de cada frame que la guía no cuenta: de ahí salen G-34 a G-42) y `handlers-solo-log.cjs` (K-46).

#### Familia J — Contrato del bus y constantes compartidas

Tres barridos más, hechos tras redactar K-01 a K-34: el primer enunciado de K-16 ("todos los
tipos tienen emisor y receptor") solo comprobaba que *algún* frame registrara un handler, no que
fuera el frame al que se manda, y lo mismo pasaba con la carga útil y con las constantes.

##### K-35 — Mensajes enviados al vacío y handlers que ninguna emisión alcanza — ✅

- **Método.** Para cada emisión con `destino` literal se comprueba que el frame de destino
  registre un handler de ese tipo, y a la inversa (handlers que ninguna emisión alcanza: ni
  destino literal, ni `broadcast`, ni destino dinámico). 94 tipos, 253 emisiones. Cada hallazgo
  se verificó leyendo emisor y receptor.
- **Emisiones al vacío — `SISTEMA.CONFIRMACION` ×8.** Todas van al padre, que **no registra
  ningún handler** de ese tipo (búsqueda desnuda de `CONFIRMACION` en el padre,
  `js/app.js`, `js/funciones-mapa.js` y `js/controladores-padre.js`: solo timeouts de configuración):
  `audio-hijo3.html:1274` (`UI_VISIBLE`), `:1556` (`click_ejecutado`), `:1601` (`audio_control`),
  `boton-casa-hijo5.html:904`, `coordenadas-hijo2.html:1646`, `En-busca-del-tesoro.html:2764`,
  `extrainfo-hijo1.html:306`, `retos-hijo4.html:1319` (los otros cinco, `UI_VISIBLE`). Caen en "sin
  handler", que el bus anota a nivel `debug` (`mensajeria.js:784-787`). La guía §10.17 los lista
  como usos de `SISTEMA.CONFIRMACION` ("UI_VISIBLE (handshake visual)", "Respuesta a acciones de
  audio") sin decir que nadie los recibe, y hijo5 ya retiró uno por ese motivo
  (`boton-casa-hijo5.html:1062-1066`). El tipo tiene además un uso que sí funciona: el acuse del
  propio bus (`mensajeria.js:774, 845`, con `idOriginal`). Dos usos del mismo nombre: uno vivo y
  ocho mensajes sueltos.
- **`SISTEMA.NACK` ×7:** ver K-15 (documentado en §10.11).
- **Falsos positivos que el instrumento da y se descartan:** `PUZZLE.COMPLETADO`,
  `PUZZLE.TIMEOUT` (`puzzle.html:195`) y `SELECCION.VIDEO_INTRO_TERMINADO` (`video-intro.html:1964`)
  mandan a `'padre'`, que en el bus significa "la ventana de arriba": el puzzle vive en hijo4 o en
  la selección, y video-intro en la selección o en hijo6 (`chat-hijo6.html:645` registra el iframe
  `video-intro`); los receptores coinciden.
- **Handlers que ninguna emisión alcanza (5):**
  - hijo5 `SISTEMA.CONFIRMACION` (`boton-casa-hijo5.html:1151`): solo loguea, y todo lo que se emite
    va al padre.
  - hijo1 `UI.CLOSE_MENUS` (`extrainfo-hijo1.html:347`, unas 50 líneas con `ocultarTodos()`): **la
    guía lo describe como padre → hijo1** (L2498, L2532 "P->>H1: UI.CLOSE_MENUS { except }", L3907,
    L5471, L11309) pero el único emisor es hijo1 → padre (`extrainfo-hijo1.html:709`). Búsqueda
    desnuda de `CLOSE_MENUS` en el padre: solo su handler (`codigo-padre.html:12463, 12478`).
  - padre `AVENTURA.FINALIZADA` (`_hdl_AVENTURA_FINALIZADA`, registrado en `:13993`): solo loguea
    ("No limpiar aquí"); el padre emite el tipo hacia `hijo1-opciones` y nadie se lo manda a él.
  - hijo4 `CONTROL.HABILITAR` y `CONTROL.DESHABILITAR` (`retos-hijo4.html:1573-1581`): handlers
    sin cuerpo ("Implementar lógica … si es necesario"); el padre manda `CONTROL.*` solo a hijo2 y
    hijo3.
- **Pendiente:** decidir si se retiran los cinco handlers y los ocho envíos, o si se quiere un
  receptor real. Ninguna acción tocaría el contrato del bus (regla 1): son extremos sin pareja.

- **Estado final (2026-10-02).** ✅ `8daa6db` retira lo que nadie recibía: los seis avisos `UI_VISIBLE`
  (hijo1, hijo2, hijo3, hijo4, hijo5 y la selección), el handler de `SISTEMA.CONFIRMACION` de hijo5 (solo
  logueaba, y el bus no le entrega acuses), el `click_ejecutado` y el `audio_control` con acuse de hijo3 (el
  fallo sigue avisando con `SISTEMA.ERROR`) y los handlers `CONTROL.HABILITAR`/`DESHABILITAR` sin cuerpo de
  hijo4 (el padre manda `CONTROL.*` solo a hijo2 e hijo3). Comprobado con búsqueda desnuda en todo el repo,
  con el historial (`simular_click` y `reto_abierto` no tuvieron emisor desde el commit inicial) y con
  `tools/verificar-mensajeria.js` antes y después: quedan los 7 `SISTEMA.NACK` al padre (rama defensiva
  documentada en §10.11) y dos handlers sin emisión. **Abiertas, decisión:** (1) `AVENTURA.FINALIZADA` en el
  padre solo loguea («No limpiar aquí») y el padre emite el tipo hacia hijo1: *A) retirar el handler* —
  **recomendada**, y registrarlo con cuerpo cuando se construya el flujo de fin de aventura pendiente; *B)
  dejarlo hasta ese flujo.* (2) `UI.CLOSE_MENUS` padre → hijo1: hoy el padre cierra su overlay de audio al
  abrir hijo1 y no al revés. *A) retirar el handler de hijo1 y la exención `except !== 'audio-control'` del
  padre (que nunca se aplica: el único valor que se manda es `'mas-opciones'`) y mandar solo
  `{ timestamp }`* — **recomendada**: deja el único sentido que existe. *B) conectar el sentido que falta*
  (que el padre mande `CLOSE_MENUS` a hijo1 al abrir su desplegable de audio): cambia lo que ve el usuario
  (exclusión mutua de los dos menús), así que es decisión de producto.
- **Ampliación (2026-10-02, `e3a9cff`): un tercer handler sin emisor, en el padre.** `_hdl_SISTEMA_HEARTBEAT` (Script 1 de
  `codigo-padre.html`, 45 líneas con su registro) contestaba `HEARTBEAT_RESPONSE` a un `SISTEMA.HEARTBEAT` entrante. El único frame que
  manda ese tipo es el propio padre —`iniciarHeartbeat` y el aviso de `visibilitychange`—, siempre hacia sus iframes, y el bus no se
  envía a sí mismo (`enviarMensaje` rechaza `destino === componenteId`): ningún emisor lo alcanzaba. Se escapó a este documento y al
  instrumento (K-34). **M-16:** con el padre cargado, 0 `SISTEMA.HEARTBEAT` entrantes ni despachados con `despacharLocal` durante el
  arranque, la carga de los hijos, el paso a AVENTURA y a CASA y un `visibilitychange`, con 18 `HEARTBEAT_RESPONSE` de control en la
  misma ventana. Retirado, con su mención en el comentario que listaba los controladores de Script 1 (que además incluía uno, `ESTADO`,
  que no existe) y con las frases de la guía que lo describían (G-37); el MC-7b del spec 09 pasa a afirmar lo que hay: el padre atiende
  `HEARTBEAT_RESPONSE` y no registra `HEARTBEAT`.

##### K-36 — Contrato de la carga útil: claves y valores que solo existen en un lado — ✅ (alcance 🔎)

- **Método.** Dos instrumentos: (1) claves que cada handler lee de `mensaje.datos` frente a las
  que los emisores del tipo ponen en `datos`; (2) valores literales con los que un handler
  compara una clave (`x === 'lit'`, `switch`, `[..].includes(x)`) frente a los valores literales
  que los emisores mandan para ella. Solo se concluye cuando todos los emisores del tipo tienen
  `datos` literal. **Cobertura:** 93 tipos con claves y 31 comparaciones; los tipos con emisor
  opaco (`AVENTURA.ESTADISTICAS_TIEMPO`, `CHAT.ESTADO_PADRE`, `NAVEGACION.CAMBIO_PARADA`,
  `RETO.COMPLETADO`, `SISTEMA.PADRE_DATOS`) quedan **sin concluir para el instrumento**; se leyeron a
  mano (las dos últimas viñetas de esta entrada).
- **Tres ramas muertas — leído el emisor y el receptor, búsqueda desnuda del valor:**
  1. `UI.ACCION_USUARIO` `accion === 'simular_click'` (`audio-hijo3.html:1609`, que además exige
     `elemento` y `contexto === 'boton_horizontal'`): ningún emisor manda esa acción ni esa clave
     (los emisores mandan `audio_control`, `reproducir-video`, `mostrar-imagen`: padre `:8028` y
     `:10603`, hijo2 `:910, 919, 928, 1048, 1069, 1088`, hijo1 `:859`). Búsqueda desnuda de
     `simular_click|boton_horizontal|click_ejecutado`: hijo3 (receptor) y la guía (L2813, L3798,
     L4003, L5945), que la presenta como camino vivo. Arrastra `_manejarSimularClick`
     (`audio-hijo3.html:1551-1561`), el `SISTEMA.CONFIRMACION {click_ejecutado}` (K-35) y el
     `SISTEMA.ERROR ELEMENTO_NO_ENCONTRADO`.
  2. `CONTROL.DESHABILITAR` `motivo === 'reto_abierto'` (`coordenadas-hijo2.html:1480`):
     `'reto_abierto'` no tiene emisor en todo el repo, y los emisores de `DESHABILITAR` mandan
     `razon`, no `motivo`. El flag `retoActivo` de hijo2 le llega por `NAVEGACION.ACTUALIZAR_ESTADO`
     (`:1261`). (El valor hermano `'reto_cerrado'` sí lo mandan `codigo-padre.html:11069, 11080`,
     por `CONTROL.HABILITAR`.) Dentro de la familia `CONTROL.*` el porqué viaja con dos nombres,
     `motivo` y `razon`.
  3. `UI.CLOSE_MENUS` `except !== 'audio-control'` (`codigo-padre.html:12467`): el único valor que
     se manda es `'mas-opciones'` (`extrainfo-hijo1.html:709`); la exención nunca se aplica y el
     padre cierra siempre el overlay.
- **Claves leídas que ningún emisor manda, de efecto benigno (valor por defecto, alias o solo
  log) — 12 tipos (el duodécimo, `SISTEMA.CONFIRMACION`, es el de K-35):** `AUDIO.ERROR`,
  `AUDIO.ESTADO_ACTUALIZADO` y `AUDIO.FIN_REPRODUCCION` leen
  `timestamp` y caen a `Date.now()` (`codigo-padre.html:12653-12663, 12787`); `FIN_REPRODUCCION`
  además loguea `duracion`, que el emisor no manda (`audio-hijo3.html:963` manda `{audioId,
  estado}`, y `estado` no se lee); `SISTEMA.HIJO_LISTO` lee `version` y `tiempoInicializacion`
  con valores por defecto (`'1.0.0'`, `0`, `codigo-padre.html:7446`) y **los guarda así en
  `estado.estadoHijos` para todos los hijos**; `UI.NAVEGACION_EXTERNA` lee `titulo`
  (solo para el log, `:12456-12461`) y el emisor manda `icono` y `timestamp` que nadie lee;
  `DATOS.COORDENADAS_PARADAS_REQUEST` lee `incluirMarcadores` y `actualizarMapa` como opciones
  con `!== false` (`coordenadas-hijo2.html:1933, 1979-1980`) que ningún emisor usa;
  `NAVEGACION.RESPUESTA_DATOS_PARADAS` (`estadisticas`, `paradaActual`),
  `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` (`padre`, alias en una cadena `||`),
  `NAVEGACION.GPS.ERROR` (`message`/`context` junto a `mensaje`/`contexto`),
  `SISTEMA.HIJO_FALLIDO` (`componenteId`, solo para el log) y `SISTEMA.NOTIFICACION`
  (`padreid`, `motivo` con valor por defecto, `retos-hijo4.html:1626`).
- **Una copia dentro del contrato de audio:** `_resolverAudioData` (`codigo-padre.html:11665-11682`) y
  el handler de `DATOS.SOLICITAR_AUDIOS` de `js/controladores-padre.js:54-84` hacen la misma
  búsqueda del audio por id y devuelven la misma forma `{id, title, file}`; el segundo manda
  `AUDIO.REPRODUCIR_REQUEST` sin acuse (`:75`) y el primero con acuse y reintento
  (`:11709`). 🧩.
- **Tipos que se mandan con acuse y también sin él (🔎).** Los tipos que alguien manda con
  `enviarMensajeConConfirmacion` son cinco —`AUDIO.REPRODUCIR_REQUEST`, `CHAT.RESCATE_SOLICITADO`,
  `DATOS.COORDENADAS_PARADAS_REQUEST`, `NAVEGACION.GPS.ACTIVAR`, `RETO.COMPLETADO`—, que es la
  cuenta de la guía (§10.5). Tres de ellos tienen además emisores **sin** acuse:
  `AUDIO.REPRODUCIR_REQUEST` (la rama de respaldo de `_solicitarAudioRest`, `codigo-padre.html:5159`,
  que solo corre si no existe `solicitarAudioAHijo3`; y la respuesta a `DATOS.SOLICITAR_AUDIOS`,
  `js/controladores-padre.js:75`), `DATOS.COORDENADAS_PARADAS_REQUEST` (`solicitarCoordenadasAHijo2`,
  `:10516`, que se usa en la reanudación, `:5172`; su comentario en `:6050-6059` dice lo contrario,
  G-13) y `NAVEGACION.GPS.ACTIVAR` (`js/funciones-mapa.js:2574`, la rama "estoy en un iframe" del
  adaptador `manejarGPSActivar`, que **no puede ejecutarse**: solo el padre importa
  `funciones-mapa.js`, `codigo-padre.html:3789, 9869, 15036`, y el único llamador interno es
  `:2640`). Que un mismo tipo tenga dos garantías de entrega según quién lo manda no es un fallo
  por sí mismo; se anota para decidir si cada caso es deliberado.
- **`SISTEMA.PADRE_DATOS`: `paradas` y `paradaActual` se leen y nadie las manda.** El padre manda
  `{ modo, timestamp }` (`codigo-padre.html:7350-7364`), más el estado del chat solo a hijo6, y
  `{}` en el único uso de `cargarIframeConDatos` (`:14856`). Cinco receptores desestructuran
  `{ modo, paradas, paradaActual }` —hijo2 en `_procesarDatosPadre`, `coordenadas-hijo2.html:1555`;
  hijo3, `audio-hijo3.html:1180`; hijo4, `retos-hijo4.html:1242`; hijo5,
  `boton-casa-hijo5.html:815`— o `paradaActual` —la selección, `En-busca-del-tesoro.html:2745`— y
  con ellas solo hacen un `debug`: ramas sin efecto, copiadas en cinco frames. El comentario de
  `codigo-padre.html:14852-14856` ya lo dice de hijo4 ("hijo4 espera `{ modo, paradas,
  paradaActual }`" y el padre manda `{}`). `modo` sí se aplica en hijo2 (`estadoComponente.modo` y
  la clase del `body`), hijo3 (`sincronizarSeekPorModo`) e hijo4 (`sincronizarEstadoModo`), y solo se
  loguea en hijo1, hijo5 y la selección; el modo llega además por `SISTEMA.CAMBIO_MODO` (K-15), así
  que el modo inicial tiene dos entregas a los hijos. Es un decimotercer tipo con claves leídas sin
  emisor, que el instrumento no pudo contar por su emisor opaco (de efecto benigno, como los doce).
- **Los cinco tipos con emisor opaco, leídos uno a uno** (cierra el límite de la cobertura):
  `AVENTURA.ESTADISTICAS_TIEMPO` — sin hueco: hijo1 manda lo que devuelve `detenerTemporizador()`
  (`{ tiempoTotal, tiempoRestante, tiempoUsado, completado }`, `extrainfo-hijo1.html:1110-1128,
  1211`) y el handler del padre (`codigo-padre.html:13512-13516`) lee tres de las cuatro y solo las
  loguea. `CHAT.ESTADO_PADRE` — sin hueco: lo manda `abrirChat()` con `construirEstadoChat()`
  (definida en `:1622-1633`, enviada en `:1644`) y hijo6 lo funde en su estado y lee `idioma` (`chat-hijo6.html:784-800`); es además
  un segundo camino de entrega del mismo estado, porque `SISTEMA.PADRE_DATOS` lleva el mismo
  `construirEstadoChat()` en la primera apertura (`:7357-7358`), y el comentario de
  `chat-hijo6.html:788-798` lo reconoce ("dos caminos casi iguales con distinta garantía") — 📌.
  `RETO.COMPLETADO` — sin hueco: los dos productores de `_pendienteCompletado` mandan
  `{ retoId, correcto }` (`retos-hijo4.html:917-920, 1157`) y el handler del padre lee esas dos
  claves (`:11179-11197`). `NAVEGACION.CAMBIO_PARADA` — K-43. `SISTEMA.PADRE_DATOS` — el hallazgo de
  arriba. Sigue sin hacerse: ampliar el extractor de discriminadores (31 comparaciones). 🔎.
- **Parámetros de URL: el mismo contrato por otro canal.** Siete nombres se leen (`aventura`,
  `despedida`, `id`, `imagen`, `lang`, `padreId`, `replay`) y doce aparecen escritos en cadenas de
  URL. **`noOverlay` se escribe y nadie lo lee**: `En-busca-del-tesoro.html:1615` lo pone en la URL
  del puzzle de introducción (`…&noOverlay=1&…`) y es su única aparición en el repo. **`padreId` se
  lee y nadie lo escribe**: lo lee `resolverIdPadre` (`js/utils.js:38`), parte del `getPadreId` sin
  llamadores de producción (K-28), con su respaldo en `sessionStorage`. El resto de los escritos sin
  lector son parámetros de caché y de enlaces externos (`t` en `codigo-padre.html:15315`, `v` en
  `En-busca-del-tesoro.html:2199` y en los enlaces de YouTube de `gastronomia.html`) o del backend
  (`idioma`, `tipo`, `todas`, `js/api-client.js:342-377`). Residuo: 0 lecturas con nombre no literal.

- **Estado final (2026-10-02).** ✅ `8daa6db`: fuera la rama `simular_click` de hijo3 (con
  `_manejarSimularClick`, el `click_ejecutado` y el `SISTEMA.ERROR ELEMENTO_NO_ENCONTRADO`) y la de
  `motivo === 'reto_abierto'` de hijo2 (`retoActivo` llega por `NAVEGACION.ACTUALIZAR_ESTADO`); la guía deja
  de presentarlas como caminos vivos (G-10). `a4644e5` (**M-14**): las claves reales de cada
  `SISTEMA.PADRE_DATOS` son `["modo","timestamp"]` para la selección, hijo1, hijo2, hijo3, hijo4 y hijo5
  (hijo6 recibe además `aventura`, `idioma`, `paradaActualNombre`, `paradasRestantes`, `rescate` y
  `siguienteParadaNombre`), y los dos únicos emisores del tipo son `_hdl_SISTEMA_HIJO_PREPARADO` y
  `cargarIframeConDatos('hijo4', …, {})`; los cinco receptores dejan de leer `paradas` y `paradaActual`, que
  nadie manda, y el comentario de `mostrarHijo4()` dice ya que hijo4 solo lee `modo`. La guía corrige las
  filas de `PADRE_DATOS` de la selección, hijo1, hijo2, hijo3, hijo4 y hijo5 —decían que llevaba aventura,
  idioma, coordenadas o la lista de paradas— y el handshake, que describía un ACK del padre que no existe
  desde `141be18` (G-28; G-30 añade `rescate` a la lista de hijo6). `dae5bf2`: la URL del puzzle de P6 deja
  de llevar `aventura=INTRO` y `noOverlay=1`, que `puzzle.html` no lee (solo busca `id` e `imagen`); y el
  parámetro `padreId`, que se leía y nadie escribía, desaparece con `resolverIdPadre` (`f6ab460`). Se
  quedan, por decisión del apartado de K-35, la exención de `UI.CLOSE_MENUS` y las 12 claves de efecto
  benigno (valor por defecto, alias o solo log).

##### K-37 — `js/constants.js`: 75 de 177 hojas sin lector, un valor que no coincide con el bus y una lista de validación que nadie usa — ✅

- **Recuento por ruta con residuo.** 177 hojas en los 9 objetos que exporta
  (`LOG_LEVELS` 5, `MODOS` 2, `TTL_LIMPIEZA` 6, `TIPOS_MENSAJE` 94, `ERRORES` 48, `ESTADOS` 3,
  `CODIGOS_ERROR` 14, `DESTINOS` 2, `CSS_CLASES` 3); **75 sin lector**: `ERRORES` (48),
  `CODIGOS_ERROR` (14), `ESTADOS` (3), `DESTINOS` (2), `CSS_CLASES` (3), cuatro de las seis de
  `TTL_LIMPIEZA` (`LOGGER.*` y `SUPPRESS.*`; solo `MENSAJERIA.MOVIL/DESKTOP` se leen,
  `mensajeria.js:1283`) y `NAVEGACION.GPS.DESACTIVAR` (cerrado, K-16). Búsqueda desnuda de
  `\bERRORES\b|\bCODIGOS_ERROR\b|\bESTADOS\b|\bDESTINOS\b|\bCSS_CLASES\b` en el padre, `js/*.js`,
  los HTML, los specs y la guía: solo `js/constants.js` y L10788 de la guía.
- **`TIPOS_MENSAJE_VALIDOS`** (`constants.js:323, 345`, "lista plana para validación O(1)"): ningún
  lector en todo el repo. Nada valida un tipo contra ella.
- **`DESTINOS.TODOS = 'todos'`** no existe para el bus, que usa `'broadcast'`
  (`mensajeria.js:325, 504`): de usarse, mandaría a ninguna parte. `DESTINOS.PADRE = 'padre'` es
  correcto, no lo lee nadie y hay **140 literales** `destino: 'padre'` (selección 21, hijo1 21, hijo2
  32, hijo3 18, hijo4 16, hijo5 20, hijo6 7, mapa-completo, puzzle y video-intro 1 cada uno,
  `mensajeria.js` 1, `utils.js` 1; `grep -cE "destino:\s*['\"]padre['\"]" <fichero>`).
- **Mismas constantes sustituidas por literales:** `MODOS.CASA/AVENTURA` lo leen el padre (62
  veces), `js/funciones-mapa.js` (11) y `js/app.js` (5), y **ningún** hijo ni nieto (0 en los diez
  frames restantes), que escriben los literales `'casa'`/`'aventura'` (hijo5 18, hijo2 17, hijo4 4,
  selección 4, hijo3 3, hijo1 3, mapa-completo 1; el padre y `funciones-mapa.js` conservan
  además 9 y 10 literales);
  `CSS_CLASES.MODO_CASA/MODO_AVENTURA/HIJO3_CONTAINER` (`'modo-casa'`, `'modo-aventura'`,
  `'hijo3-container'`) sin lector y los literales en `audio-hijo3.html:388, 1114, 1129`,
  `retos-hijo4.html:1203`, `coordenadas-hijo2.html:333`; `ESTADOS.INICIALIZANDO` frente al
  literal de `chat-hijo6.html:764`. Dos únicos sitios usan un tipo de mensaje como literal en vez
  de la constante: `js/mensajeria.js:1241` (respaldo de `mensaje.tipo`) y `js/utils.js:668`
  (respaldo tras `globalThis.TIPOS_MENSAJE?.SISTEMA?.ERROR`, porque `utils.js` no importa
  `constants.js`).
- **Guía:** L10788 dice que `constants.js` es la "fuente de verdad de todas las constantes" con
  "16 categorías y 83 tipos"; hay 16 categorías y **94** tipos, y de `ERRORES`/`ESTADOS` que
  cita no lee nada ningún fichero.
- **Pendiente:** el mismo planteamiento que K-02 — ¿se vacían, o se adoptan (y se sustituyen los
  literales)? Dos ficheros de constantes (`config.js` y `constants.js`) con más de la mitad de su
  contenido sin lector es el patrón de K-01/K-02 repetido.

- **Estado final (2026-10-02).** ✅ `e3bab74`: `constants.js` pierde lo que ningún fichero lee —`ERRORES`,
  `ESTADOS`, `CODIGOS_ERROR`, `DESTINOS`, `CSS_CLASES`, `TIPOS_MENSAJE_VALIDOS` con `_flattenTipos`, el
  `export default`, `globalThis.constants` y `globalThis.TTL_LIMPIEZA`, y
  `TTL_LIMPIEZA.LOGGER`/`.SUPPRESS`—; se quedan `LOG_LEVELS`, `MODOS`, `TIPOS_MENSAJE` y
  `TTL_LIMPIEZA.MENSAJERIA`. La guía (G-12) dice 94 tipos y ya no cita las constantes retiradas; `1e5bbf3`
  corrige dos citas de línea que la limpieza dejó fuera de rango. **Sin tocar, decisión de diseño:** los
  literales `'casa'`/`'aventura'` y `destino: 'padre'` que los hijos escriben a mano en vez de usar `MODOS`
  o una constante (140 `destino: 'padre'`; ningún hijo ni nieto importa `MODOS`). *A) dejarlos* —
  **recomendada**: son los mismos dos valores y el mismo destino del contrato del bus, sin ningún fallo
  demostrado, y *B) importar `MODOS` en los siete hijos y la selección* toca once ficheros por una ganancia
  solo de legibilidad. (Errata E9: los sitios que escriben un tipo como literal son 8, no dos; la decisión no cambia.)

#### Familia K — Nombres de `globalThis` que nadie define, y un frame que no publica lo que los demás

Un barrido más, hecho tras K-35 a K-37: los tres anteriores miraban lo que viaja por el bus y por
las constantes; este mira lo que viaja por `globalThis`. Un camino que se apoya en un nombre
que no existe **no falla**: la guarda (`typeof … === 'function'`, `if (globalThis.x)`) lo salta sin
ruido, y el código parece cubrir un caso que en realidad nadie cubre. Es la versión "función o
variable al vacío" de K-35 ("mensaje al vacío").

##### K-38 — Nombres de `globalThis` que el código lee, comprueba o limpia y que ningún frame define — ✅ (confirmado en ejecución: M-10)

- **Método (instrumento nuevo, "globals por frame").** Para cada una de las 17 páginas `.html`
  calcula el conjunto de ficheros que ejecuta (bloques inline y cierre de `import` estáticos,
  `import()` con literal y `<script src>`), analiza los ámbitos de cada bloque con `eslint-scope` y
  lista (A) los nombres sueltos sin resolver que ningún bloque del frame define, (B) los
  `globalThis.X`/`window.X`/`self.X` leídos, llamados, comprobados con `typeof` o borrados cuyo `X`
  no asigna ninguna escritura del frame (con los frames donde sí se define, si hay alguno) y (C)
  las lecturas `parent.X` y `<iframe>.contentWindow.X`. **Un símbolo de nivel superior de un módulo
  no es un global**: por eso `iniciarHeartbeat`, que es un `export` de `js/mensajeria.js:948`,
  sale como inexistente cuando se pide por `globalThis`. **Residuo impreso:** 0 bloques sin
  parsear; 1 `import()` no literal (`En-busca-del-tesoro.html:2199`,
  `./js/indice-aventuras.js?v=${Date.now()}`, que no asigna nada a `globalThis`); 1 asignación
  computada (`codigo-padre.html:14950`: las tres claves de temporizadores de overlay); 4
  `<script src>` fuera del análisis (MapLibre, Leaflet ×2, page-flip). **Cobertura:** el código de
  la aplicación y los módulos de datos (dos asignan un global: `DATOS_PADRE`,
  `js/aventuras-ID-padre.js:10625`, y `RETOS_AVENTURAS`, `js/retos-aventuras.js:25017`); lo que
  `js/proteccion.js` hace como módulo de protección no se estudia aquí. **Resultado:** sobre 2195
  usos de `globalThis.X`, (A) deja solo `iniciarHeartbeat` e `iniciarHeartbeat_S1`; (B) deja los
  nombres de abajo; (C) deja dos lecturas de `parent` con nombre propio (`aventuraSeleccionada`,
  K-26, y `__vv_config`, K-01) y ninguna de `contentWindow`. Un control: el filtro que descarta
  propiedades del navegador no esconde ningún nombre sospechoso (se imprimió la lista de lo
  filtrado: solo `Array`, `Date`, `document`, `console`, `localStorage`… ).
- **Historial.** Para cada nombre de los apartados 1 a 5 (salvo `modoActual`, explicado en el 4),
  `git log --oneline
  -G"(globalThis|window|self)\.NOMBRE\s*(\|\||&&|\?\?)?=[^=]"` da **0 commits** sobre los 664 del
  repo; control positivo con la misma expresión: `logger` 7, `TIPOS_MENSAJE` 6,
  `__HEARTBEAT_INICIADO` 3, `DATOS_PADRE` 1. Las guardas de `detenerHeartbeat`,
  `iniciarHeartbeat_S1`, `typeof globalThis.pausarHeartbeat` y `registerAllowedOrigin` están desde el
  commit inicial (`2c5c2c2`): no son una regresión de la lavadora.
- **Segundo instrumento (objetos-API e imports).** Por cada `import` estático con nombre o por
  defecto (97), cada `import * as` con sus miembros (8), cada `await import()` desestructurado (68)
  y cada `(await import()).X` o `.then` (3): comprueba que el módulo exporte el nombre pedido
  (resolviendo `export *`, y los alias por ámbito: la primera versión confundió seis `modulo.X` de
  la selección porque un mismo nombre local apunta a módulos distintos en cada función). **Ningún
  nombre pedido falta.** Y por cada objeto-API publicado en `globalThis` con claves derivables (20:
  `mensajeria`, `funcionesMapa`, `__stateManager`, `estadoPadre`, `ApiClient`, `TokenManager`…):
  los miembros que el código le pide (`globalThis.X.y`, `globalThis.X?.y?.()`, `const { y } =
  globalThis.X`) y que no son clave. Resultado: **uno** (apartado 9) y dos claves de
  `estadoPadre` que se crean de forma perezosa donde se leen (`hijosFallidos`, `hijosPreparados`,
  K-41).
- **Tercer paso: nombres cuya única escritura es un valor vacío.** Un nombre que alguna escritura
  del frame "define" con `null`, `undefined`, `false`, `0`, `''`, `[]` o `{}` sale como definido en
  los apartados de arriba. El tercer paso lista los `globalThis.X` leídos cuyas únicas asignaciones
  del cierre del frame son de ese tipo: `__VV_GPS_OVERLAY_SNOOZE` (`{}` que se rellena por clave),
  `__pendingBroadcast` y `_gpsHistorial` (`[]` en los que se hace `push`) son contenedores
  legítimos y se descartan; salen **dos más**: `globalThis.modoActual` (apartado 4) y
  `__vv_coordenadasAventura` (apartado 5). El resto de lo que lista —`AVENTURA_PARADAS` en
  cinco frames y `__vv_coordenadasAventura` en otros cuatro— son lecturas de `js/proteccion.js`, que
  queda fuera de este documento.

**1. El latido del padre — dos de las cuatro rutas de arranque de K-11 no hacen nada.**

- `codigo-padre.html:4079` (arranque (a)): `hbFn = (typeof iniciarHeartbeat === 'function' &&
  iniciarHeartbeat) || (typeof iniciarHeartbeat_S1 === 'function' && iniciarHeartbeat_S1) ||
  globalThis.iniciarHeartbeat`. Búsqueda desnuda de `iniciarHeartbeat` en `{*.html,js/*.js}`: en
  el padre solo hay usos (`:4079, 7540, 15016-15017, 15078`), comentarios y un texto de log
  (`:7546`); las únicas definiciones son el `export` de `js/mensajeria.js:948` y la clave del
  objeto `globalThis.mensajeria` (`:186`). `iniciarHeartbeat_S1` no aparece más que en `:4079` y en la lista de globals de ESLint
  (`eslint.config.js:207`, K-34). Las tres alternativas son `undefined`, `typeof hbFn ===
  'function'` es falso y el bloque `:4080-4104` no se ejecuta; **ni siquiera deja un log**.
- Arranque (c), Script 4 `:15012-15028`: `typeof globalThis.iniciarHeartbeat` (`:15016`) y
  `typeof globalThis.pausarHeartbeat` (`:15022`); nadie los asigna. Lo que sí ocurre: en la rama
  AVENTURA se pone `__HEARTBEAT_INICIADO = true` (`:15019`, fuera de la guarda) sin haber arrancado
  nada, y en la rama CASA se emite el log debug "Heartbeat no iniciado por modo CASA (Script 4)"
  (`:15023`) igual que si hubiera pausado. El comentario de `:15004-15006` dice que ese arranque
  llama "ahora directo a iniciarHeartbeat/pausarHeartbeat/getHeartbeat"; la llamada directa está
  escrita contra `globalThis.`, no contra el bus (`globalThis.mensajeria.…`).
- `_detenerHeartbeatSeguro` (`:14913-14924`, llamada por `_limpiarPagehide`, `:14952`):
  `typeof globalThis.detenerHeartbeat === 'function'` — el bus expone `pausarHeartbeat`, no
  `detenerHeartbeat`. En un `pagehide` real el latido no se detiene; solo se baja la bandera
  (`:14919`). La guía (L12591) dice que ese `pagehide` "detiene el heartbeat" (G-14).
- `_testHeartbeatPauseResume` (`:15078`, helper de consola sin llamadores, ya en K-34): su paso
  "intentar iniciar mientras está en pausa" también cuelga de `typeof globalThis.iniciarHeartbeat`,
  así que no ejecuta nada y la comprobación que le sigue se cumple en vacío.
- Lo que vive: `_activarHeartbeatAventura` (`:7540`) y `_transicionarAModoCasa` (`:7596`) toman
  primero `globalThis.mensajeria?.…`, que existe. Su segundo operando (`|| globalThis.iniciarHeartbeat`,
  `|| globalThis.pausarHeartbeat`) es el respaldo muerto, y la guía lo presenta como "patrón
  correcto" (L12674, L12681; G-15).

**2. Contadores de telemetría que no cuentan — `incrementarContador`.** Ocho sitios con la guarda
`typeof globalThis.incrementarContador === 'function' && globalThis.incrementarContador(clave)`:
`codigo-padre.html:5453` (el envoltorio `_gpsInc`, que tiene ocho llamadas, `:5513-5570`), `:11299,
11321, 12306`; `js/funciones-mapa.js:2544, 2553, 2566`; `coordenadas-hijo2.html:2227` (clave
`gps_error_code_${codigo}`). Son 15 puntos de cuenta y 14 claves (`gps.solicitudes_recibidas`,
`gps.activaciones_ok`, `gps.fallback_p0`, `confirmaciones_cambio_parada`…). Nada define
`incrementarContador`; `js/monitoreo.js` exporta `registrarMetrica(nombre, valor, tags)` y
`getEstadoMonitoreo`, sin contadores. La telemetría de GPS y de cambio de parada que el código
parece recoger no se recoge. Misma familia que K-04 (monitoreo con umbrales sin lector).

**3. Ayudante de consola sobre un nombre inexistente — `registerAllowedOrigin`.**
`debugRegisterAllowedOrigin` (`codigo-padre.html:8653-8664`, publicada en `globalThis`;
`tools/codigo-muerto.js` la marca) comprueba `typeof globalThis.registerAllowedOrigin ===
'function'` (`:8656`), siempre falso, y por tanto solo puede responder "API not available in this
context" y `false`.

**4. Limpiezas de `pagehide` sobre nombres que ningún código crea.** `js/app.js:1139-1148`
(`puntosRuta`, `CoordenadasParadas`, `estadoHijos` e `intervaloReconciliacion`, cada uno con su
`if (globalThis.x)` y `delete`/`clearInterval`), `codigo-padre.html:14944`
(`globalThis.intervaloMonitoreo`) y `:14956` (`globalThis.controladores.clear()`). Dos de ellos
existen con ese nombre en otro sitio —`estadoPadre.estadoHijos`, un `Map` (`codigo-padre.html:4297`),
y el `Map` de handlers `controladores` del state-manager (`js/state-manager.js:101`, ámbito de
módulo)— pero no como globals: la limpieza apunta al nombre equivocado. Es inocuo (en un cierre
real la página se destruye, y con `persisted === true` los tres `pagehide` salen antes:
`codigo-padre.html:14937`, `js/app.js:1106`, `js/funciones-mapa.js:3328`); es código que dice
limpiar y no limpia, y la guía lo describe como si limpiara (L12591-12592; G-14).
  Una más sale del tercer paso: `codigo-padre.html:14943`, `if (globalThis.modoActual)
  globalThis.modoActual = undefined;` (la limpieza ya existía en el commit inicial como `delete
  globalThis.modoActual` y los dos commits que la reescribieron, `4436131` y `b0e255f`, solo cambian
  la forma); `globalThis.modoActual` no aparece en ningún otro sitio (búsqueda desnuda
  `globalThis\.modoActual|window\.modoActual`).

**5. Operandos muertos de una cadena `||`.**

- `codigo-padre.html:7951`: `globalThis.__vv_aventuraSeleccionada || globalThis.aventuraSeleccionada`
  — el primero no se asigna nunca.
- `codigo-padre.html:9909`: `globalThis.estadoPadre || globalThis.estadoScript2 || {}` —
  `estadoScript2` fue una `const` local de Script 2 en el commit inicial y se retiró en `9b5f4d5`;
  el `globalThis.estadoScript2` nunca tuvo asignación.
- `js/reciclaje-digital.js:141`: `globalThis.__vv_INDICE_AVENTURAS || globalThis.INDICE_AVENTURAS`
  — el segundo solo existe como `let` local del padre (`codigo-padre.html:3841`) y como export del
  módulo de datos. `verificarTimeoutAventura()` solo se llama en el padre (`:4467, 8446`), que sí
  asigna el primero (`:3847, 3908, 8437`); en la selección, que también carga el módulo, el nombre
  no existe pero la función no corre. (K-21 trata cómo falla esa función.)
- `codigo-padre.html:5425` y `:5443`: `globalThis.__vv_coordenadasAventura ||
  globalThis.AVENTURA_PARADAS` — el primer operando solo lo asigna hijo2, en su propio `globalThis`
  (`coordenadas-hijo2.html:1821`); en el padre nadie le da un valor, así que esa cadena resuelve
  siempre por el segundo.

**6. Interruptor manual de consola — 📌.** `js/funciones-mapa.js:1518`:
`globalThis.__vv_debug_tramo`, dentro de un bloque marcado "TEMP DEBUG" (`:1516`); solo se lee, y se
activa a mano desde la consola. Es intencional según su comentario; queda por decidir si el
"TEMP" se retira.

**7. Cableado pendiente del backend — 📌.** `js/data-loader.js:108, 120, 327-328` lee
`globalThis.TokenManager`. Lo asigna `js/api-client.js:89, 489`, y ese módulo solo se importa en la
selección (`En-busca-del-tesoro.html:1762`); `data-loader.js` corre también en el padre, donde el
nombre no existe. El comentario de `:106-107` lo declara "pendiente de conectar cuando el backend
esté desplegado" y dice que la ruta solo se recorre en modo `'api'`. Se anota la asimetría entre
frames para cuando se conecte.

**8. Un diagnóstico que mide el nombre equivocado.** `audio-hijo3.html:1380-1381` y
`retos-hijo4.html:1402-1403`: dentro del `if (!tipoEntendido)` que prepara el log de error de
`CAMBIO_MODO_ENTENDIDO` se informa `TIPOS_MENSAJE_exists: globalThis.TIPOS_MENSAJE !== undefined`.
Esos frames usan `TIPOS_MENSAJE` por import, no el global (que solo asignan el padre, la selección
y video-intro; K-35, K-37), así que el diagnóstico diría "no existe" aunque exista.

**9. Un método que existió, se eliminó a propósito y dejó a su llamador.** `js/app.js:399-400`
(`_reanudarSubsistemasTrasPrewarm`): `if (globalThis.funcionesMapa && typeof
globalThis.funcionesMapa.iniciarGPSAventura === 'function') { await
globalThis.funcionesMapa.iniciarGPSAventura(); … }`. `iniciarGPSAventura` no existe: búsqueda
desnuda en todo el repo (código, guía y specs) → solo esas dos líneas, y el objeto `funcionesMapa`
(`js/funciones-mapa.js:3293`) tiene 20 claves y no la incluye. **Sí existió**: su definición, su
`export` y una llamada interna se retiraron en `917af63` (2026-07-23, "activación real de GPS,
reanudación de sesión y navegación libre en CASA"; 127 líneas de `funciones-mapa.js`), y
`js/app.js` no estaba entre los ficheros de ese commit, así que su llamador con guarda quedó
(`git log -S"iniciarGPSAventura"`: `2c5c2c2`, `ac44561`, `917af63`). Hoy el GPS de la aventura lo
arranca `_gestionarGpsSegunModo` → `activarGPS()` (`codigo-padre.html:7629-7636`). Consecuencia: el
`debug` "Iniciado GPS aventura tras pre-warm" no sale nunca. Es el caso en que el historial
demuestra que el "segundo camino" lo era de verdad y fue retirado por el otro.

**Tratados en otro sitio o descartados (➖):** `Config` (K-01), `__vv_getManejadores` (K-12),
`__vv_idiomaActual` (K-24), `__stateManager` y `__vv_stateManager` (K-13: solo el padre carga el
state-manager y `mensajeria.js:111-123` lo tolera), `__vv_config` (K-01; lectura de `parent`
documentada), `TIPOS_MENSAJE` en `js/utils.js:668` (K-37), `_vv_beforeHijoReload` (asignada en el
padre, `:9793`; su lectura de `mensajeria.js:1172` está en `intentarReconectarHijo`, que solo corre
en el padre, donde existe `iframesRegistrados`) y `opera` (propiedad heredada del navegador,
`js/device-detection.js:28`).

- **Pendiente de decisión del usuario.** En cada grupo, lo mismo que en K-02: ¿se retira la rama
  muerta, o se conecta a lo que existe? (1) El latido: conectar (a) y (c) los volvería vivos con
  tres políticas distintas (K-11: "pospone", "cae a pausa" y "arranca sin mirar la bandera"), así
  que primero hay que decidir cuál se quiere. (2) Contadores: implementar `incrementarContador`
  sobre `registrarMetrica` o retirar los 15 puntos. (3) La lista `globals` de ESLint que esconde
  (1) (K-34). (4) El llamador de `iniciarGPSAventura` (apartado 9): se retira, o se decide si falta el
  arranque que prometía. No se arregla nada aquí (regla 1b). **Medición (M-10, ⚠️):** `typeof` de cada nombre
  de los apartados 1 a 5 en el padre ya cargado, y de `incrementarContador` en hijo2. La lectura
  estática y la historia de git coinciden; falta solo la ejecución (regla 10).

- **Estado final (2026-10-02).** ✅ Confirmado en ejecución (M-10): los 23 nombres del padre dan
  `typeof === 'undefined'` (más `funcionesMapa.iniciarGPSAventura`; en hijo2, `incrementarContador` y
  `__vv_idiomaActual`) y `mensajeria.iniciarHeartbeat`, `.pausarHeartbeat` y `.adelantarLatido` son
  `function`. Retirado en `2ed1658`: los arranques (a) y (c) del latido, la bandera `__HEARTBEAT_INICIADO`,
  `_detenerHeartbeatSeguro`, las limpiezas de `pagehide` sobre `modoActual`, `intervaloMonitoreo`,
  `controladores`, `puntosRuta`, `CoordenadasParadas`, `estadoHijos` e `intervaloReconciliacion`, el
  llamador de `iniciarGPSAventura` y `debugRegisterAllowedOrigin`. En `8806429`: los 15 puntos de cuenta de
  `incrementarContador` con su envoltorio `_gpsInc` y los operandos `||` sobre `__vv_aventuraSeleccionada`,
  `estadoScript2`, `__vv_coordenadasAventura` e `INDICE_AVENTURAS`. Se quedan, por documentados o leídos por
  specs, `__MENSAJERIA_INICIADA`, `_mostrarDialogoVueltaRapida`, `_vv_check5km`, `_testHeartbeatPauseResume`
  y los dos ayudantes de consola de `suppress-warnings.js`. Además, un barrido de lo que el código *publica*
  frente a quién lo *lee* (231 nombres en las 17 páginas y módulos; 9 sin lector) retira cuatro globals que
  nadie leía —`__hijo3_paradaActual`, `__vv_mensajeria`, `cargarIframeSecuencial` y `_reflow`— (`0fe5b3f`).
  La pregunta «¿se retira la rama muerta o se conecta a lo que existe?» se resuelve por la primera opción en
  todos los grupos: eran ramas sin efecto y conectarlas habría activado políticas distintas (K-11).

##### K-39 — `mapa-completo.html` es el único de los once frames que no publica el logger en su `globalThis` — ✅ (alcance 🔎)

- **Los otros diez sí.** Publican `globalThis.logger = logger;` tras importarlo, con un comentario
  que explica por qué: cada iframe tiene su propio `globalThis`, el del padre no alcanza a los
  demás y, sin esa línea, los `(globalThis.logger || console).x` de los módulos compartidos caen al
  `console` crudo y se saltan el nivel de log. Hijo1 `extrainfo-hijo1.html:69`, hijo2
  `coordenadas-hijo2.html:436`, hijo3 `audio-hijo3.html:479`, hijo4 `retos-hijo4.html:464`, hijo5
  `boton-casa-hijo5.html:315`, hijo6 `chat-hijo6.html:402`, selección
  `En-busca-del-tesoro.html:2583`, puzzle `puzzle.html:147`, video-intro `video-intro.html:601`; el
  padre, `codigo-padre.html:3982`, con guarda `=== undefined`.
- **`mapa-completo.html` no.** No importa `logger.js` ni asigna `globalThis.logger` (`:148-175`:
  importa `mensajeria.js` y `constants.js`, y la propia página no loguea). El bus sí loguea con
  nivel (`mensajeria.js` importa su `logger`), pero los módulos compartidos que ese frame arrastra
  llaman `(globalThis.logger || console)`: `js/constants.js:347` (`debug`, "✅ constants.js
  cargado"), `js/utils.js:296, 305` (`retryUntilAvailable`) y `:694, 714` (captura de errores no
  controlados). En ese frame esas líneas salen siempre por el `console` crudo y no obedecen
  `CONFIG.DEBUG.NIVEL_LOG`.
- **Por qué no lo ve nadie.** ESLint no lo detecta (la guía lo dice: el `||` esconde el patrón de
  la regla `no-console`), `tools/verificar-frames.js` no comprueba esa línea (búsqueda desnuda de
  `logger` en el script: 0 apariciones) y la guía (L10790) enumera "los siete hijos más
  `puzzle.html` y `video-intro.html`", sin `mapa-completo.html`. Lo encontró el instrumento por
  frame, apartado (B): `logger` leído y sin escritura en ese frame.
- **Alcance 🔎.** Efecto pequeño (una línea `debug` y avisos que se quieren siempre), pero es el
  patrón "el frame que se quedó fuera de una lista" (regla 3b). **Pendiente:** ¿`mapa-completo.html`
  publica el logger como los demás, o se acepta y se corrige la guía? No se toca aquí. Medición
  M-11 (⚠️).

- **Estado final (2026-10-02).** ✅ M-11 confirma el hallazgo (sin padre: `typeof globalThis.logger` es
  `undefined` y la línea «✅ constants.js cargado» sale por `console.debug` crudo). `545323b`:
  `mapa-completo.html` importa `logger.js` y asigna `globalThis.logger = logger` como los otros diez frames,
  con el mismo comentario; el spec 60 (NH-3) carga también `mapa-completo.html` (rojo antes:
  `mapa-completo.html=undefined`; verde después) y la fila de `logger.js` y la del spec 60 de la guía
  incluyen ya el frame que faltaba (G-16). Los once frames publican el logger.

#### Familia L — Estado que se escribe y no se lee, y registros que dicen más de lo que hacen

##### K-40 — Conectividad: tres reacciones a `offline`/`online`, y la que dice "pausando operaciones" solo escribe una bandera que nadie lee — ✅ (efecto medido: M-12)

- **Los caminos.** (1) El aviso al usuario: `codigo-padre.html:7003` (`offline` →
  `showInternetOverlay()`, que solo actúa en AVENTURA, `:6968-6969`) y `:6961` (`online` →
  `hideInternetOverlay()`). (2) Su red de seguridad declarada: un audio fallido con
  `!navigator.onLine` también llama a `showInternetOverlay()` (`:12808`; el comentario
  `:7000-7001` la describe como "red de seguridad para dispositivos donde 'offline' no llegue a
  dispararse"). (3) `js/app.js:1089-1090`: dos listeners `offline`/`online` en la misma ventana
  que llaman a `manejarPerdidaConexion` y `manejarReconexion` (`:1072-1086`), que ponen
  `estado.conectado` a `false`/`true` y logean "Conexión perdida, pausando operaciones" (`warn`) y
  "Conexión restablecida, reanudando operaciones" (`info`). **No pausan ni reanudan nada**: el
  cuerpo es el comentario "Pause operations, e.g., stop sending messages", y el bloque se declara
  "ejemplo simplificado" (`:1088`).
- **La bandera.** `estado.conectado` no tiene lector. Búsqueda desnuda de `conectado` en
  `{codigo-padre.html,js/*.js}`: el valor inicial (`codigo-padre.html:4245`,
  `js/state-manager.js:56`), las dos escrituras de `app.js` y `mensajeria.js:1157`, que es un
  texto de log sobre "desconectado" (otra cosa). Los únicos listeners de `online`/`offline` del
  repo son estos (`grep -n "addEventListener('(online|offline)'"` en padre, `js/*.js` y los `.html`:
  `:6961`, `:7003`, `app.js:1089-1090`). La guía no menciona `estado.conectado` ni los dos
  manejadores (búsqueda desnuda: 0).
- **Efecto.** Con la app en AVENTURA y el evento `offline`: sale el overlay (camino 1) y un `warn` que
  afirma una pausa de operaciones (camino 3) que no ocurre. Es el patrón de K-11 al revés: allí la
  acción no ocurría y no había aviso; aquí el aviso afirma una acción que no ocurre.
- **Pendiente:** ¿se retira el camino 3 y con él `estado.conectado`, o se le da el cuerpo que
  promete (y entonces ¿qué se pausa: latido, GPS, envíos?)? Medición M-12 (⚠️).

- **Estado final (2026-10-02).** ✅ Medido (M-12): en AVENTURA, `offline` muestra el overlay del padre, pone
  `estado.conectado` a `false` y escribe un `warning` «Conexión perdida, pausando operaciones», mientras el
  latido sigue `activo:true, userPaused:false`: **no se pausa nada**; `online` oculta el overlay y escribe
  «Conexión restablecida, reanudando operaciones». **Abierta, decisión:** *A) retirar el camino 3*
  (`manejarPerdidaConexion`, `manejarReconexion`, sus dos listeners y `estado.conectado`) — **recomendada**:
  el aviso afirma una pausa que no ocurre, nadie lee la bandera y el aviso real al usuario es el overlay del
  camino 1. *B) darle el cuerpo que promete*: habría que decidir qué se pausa (¿el latido, el GPS, los
  envíos?), y eso es una decisión de comportamiento, no mecánica.

##### K-41 — Campos de estado que se escriben y que ningún código lee por su nombre — 🔎 (con doce filas confirmadas)

- **Método.** Extensión del extractor de estado con el lado de lectura: 13 raíces
  (`estado`, `estadoPadre`, `estadoMapa`, `estadoComponente`, `estadoMonitoreo`…), 1097 expresiones,
  158 rutas escritas. Una ruta cuenta como leída si aparece en una posición que no es de escritura,
  si de ella cuelga una cadena más larga o si se desestructura; no cuenta la inicialización
  perezosa pura (`x = x || …`, `if (!x) x = …`). Resultado: 30 rutas sin lector por su nombre — 12
  **estrictas** (ningún ancestro se lee entero), 15 **con un ancestro leído entero** (pudieron
  leerse por esa vía) y 3 rutas con clave computada, que no son campos. **Residuo:** 20 accesos con
  clave computada (`estado.pendingCompleciones[id]`, `est.paradasConfirmaciones[…]`,
  `estado.hijosInicializados[…]`, `estadoMapa[…]`); no se resuelven los alias locales
  (`const e = estado.x`); los specs no cuentan como lectores. **Un control:** la primera versión dio
  `estadoMapa.datosRecopilados.coordenadas` como solo-escritura y no lo es (se lee por
  desestructuración, `js/funciones-mapa.js:2140`); el instrumento ya resuelve la desestructuración.
  Los de abajo se comprobaron además con **búsqueda desnuda del nombre**.
**Confirmados sin lector por nombre:**

| Campo | Escrituras | Lo que ocurre |
|---|---|---|
| `estadoPadre.hijosPreparados` | `codigo-padre.html:7328-7329`, `:8347` | Ningún código de producción lo lee; **nueve specs** lo usan como sonda de "hijo listo" (`08-…`, `60-…`, `76-…`, `78-…`, `80-…`, `96-…`, `97-…`, `99-…`, `101-…`). Tercer sitio del hecho "este hijo avisó", que K-07 describe en dos (los dos `hijosInicializados`) |
| `estadoPadre.hijosFallidos` | `:5267-5268` | Se crea y no se vuelve a usar; los hijos fallidos viajan en arrays locales (`:8178`, `:8626`) |
| `estadoHijos.get(id).preparado` y `.listo` | `:7334`, `:7449` | Búsqueda de `.preparado` y `.listo` en `{codigo-padre.html,js/*.js}`: ningún lector. Cuarto y quinto sitio del mismo hecho |
| `estadoPadre.sistemaInicializado` | `:8537` | Se escribe junto con el global `globalThis.sistemaInicializado` (`:8538`); solo se lee el global (`:5020`) |
| `estado.modo.anterior`, `estado.modo.ultimoCambio` | `js/app.js:604-606`, `:636-638`, `:930` | Escritos dos veces en `manejarCambioModo` (la actualización optimista y el "asegurar campos mínimos") y nunca leídos |
| `estado.tramoActual` | `js/app.js:825` (`= null`) | Única aparición de `estado.tramoActual` en padre y `app.js`; el que se usa es `estadoMapa.tramoActual` (K-08) |
| `estado.seleccion.idioma` (7 escrituras), `.iniciada` (5), `.coordenadasCargadas` (2), `.terminosAceptados` (2), `.timestampInicio` (1) | `codigo-padre.html` (K-09) | La única lectura de `idioma` es la propia (`:13009`). `.activada` sí se lee (`:8076`) y `.aventura` solo como respaldo de `globalThis.aventuraSeleccionada` (`:7500`, `:11625`). La selección real vive en `globalThis.aventuraSeleccionada` e `idiomaSeleccionado` (K-09, K-26) |
| `estado.retoActual.completado` | 7 escrituras (`:10937`, `:11104`, `:11154`, `:11202`, `:12580`, `:12601`, `:12608`) | El único sitio donde se lee `estado.retoActual` entero (`:10914`) pasa a `_buscarSiguienteRetoEnCola`, que mira `cola` y `colaCompletados`, no `completado`; la compleción real es la de `colaCompletados` |
| `estado.gps.visualActivo` | `js/funciones-mapa.js:1120` | Sin lector; el comentario `codigo-padre.html:9322-9331` explica por qué el recordatorio de audio deliberadamente no la usa. Es copia de `estadoMapa.gpsVisualActivo` (K-08) |
| `estadoMonitoreo.metricas.ultimaActividad`, `estadoMonitoreo.intervaloMetricas` | `js/monitoreo.js:132`, `:72` | La segunda guarda el id del intervalo que nadie limpia (K-30) |
| `estado.monitoreo.metricas.errores` (padre) | `codigo-padre.html:12800` | `js/monitoreo.js` lleva su propio contador `estadoMonitoreo.metricas.errores` (`:108`, leído en `:148`): dos contadores para el mismo hecho (K-04) |
| `estado.conectado` | `js/app.js:1073, 1083` | K-40 |

Las doce filas de la tabla se confirmaron con el nombre desnudo. Además: `estadoMapa.timestamp`
(`funciones-mapa.js:1602, 1631, 2380`), `estadoComponente.radioLlegada` y `.recorridoSuficiente`
(hijo2, `:1252, 1255`: se leen como variables locales), `estadoComponente.botonesActivos.ubicacion`
(hijo2 `:2307`) y `estado.gpsActivo` (hijo5, herramienta de desarrollo, `:761`) aparecen como
estrictas y su nombre no tiene más lectores en el fichero; no se han leído una a una.

- **Con ancestro leído entero (por leer):** `estado.audioActual.error` y `.timestamp` (el ancestro
  va entero en el payload de `codigo-padre.html:4406`, que otro frame puede leer),
  `estado.gps.permisos`, `.precision` y `.ultimaUbicacion` (K-08/K-09: `estado.gps` se copia entero
  en `:5656` y `funciones-mapa.js:1097`).
- **Pendiente:** el estudio individual decide, campo a campo, si se retira o si falta el lector. Las
  filas con varias casas para el mismo hecho (hijo listo, sistema inicializado, selección,
  contadores de error) son las que tocan "un solo camino por decisión".

- **Estudio individual (2026-10-02): solo veredictos, ningún cambio de código.** Las filas confirmadas se
  comprobaron de nuevo con el nombre desnudo en producción, specs y guía; «sonda» = la lee un spec o la
  nombra la guía, así que retirarla exige tocar ese spec o esa frase.

| Campo | Veredicto | Evidencia |
|---|---|---|
| `estadoPadre.hijosPreparados` | Se queda (sonda) | 3 líneas de producción (`codigo-padre.html:7263-7264, 8280`); 9 specs la leen como sonda de «hijo listo» (`08`, `60`, `76`, `78`, `80`, `96`, `97`, `99`, `101`) y la guía la nombra; consolidar el hecho «este hijo avisó» es K-07, no esto |
| `estadoPadre.hijosFallidos` | Candidato a retirar | solo se inicializa a `new Set()` (`:5216-5217`); los fallos viajan por arrays locales con el mismo nombre, que son los que citan la guía (§5, `cargarRestoDeiframes`) y el spec `08` |
| `estadoHijos.get(id).preparado` y `.listo` | Candidato a retirar (con K-07) | se escriben en los dos sitios del handshake y ningún código ni spec los lee; son el cuarto y el quinto sitio del hecho que K-07 describe en dos |
| `estadoPadre.sistemaInicializado` | Candidato a retirar la copia | `:8470-8471` escribe la propiedad y el global `globalThis.sistemaInicializado`; solo se lee el global (`:4969`); la guía (§5) habla de «marcar `sistemaInicializado`» sin decir cuál |
| `estado.modo.anterior`, `estado.modo.ultimoCambio` | Candidato a retirar, con la guía | `js/app.js:573-575, 605-607, 899` los escribe y nadie los lee; el bloque de «estado inicial» de la guía (L115-132) los enseña, así que se cambian juntos |
| `estado.tramoActual` | Candidato a retirar la escritura | `js/app.js` lo pone a `null` en `limpiarRecursosPorModo`; el que se usa es `estadoMapa.tramoActual` (K-08); el spec `100` lo nombra solo en un comentario |
| `estado.seleccion.{idioma, iniciada, coordenadasCargadas, terminosAceptados, timestampInicio}` | Decisión | 7+5+2+2+1 escrituras en el padre y ninguna lectura; la selección real vive en `globalThis.aventuraSeleccionada`/`idiomaSeleccionado` (`.activada` y `.aventura` sí se leen); la guía los nombra en un diagrama (§ selección) y en una lista de pasos. Recomendado: retirarlos, y con ellos esas dos frases |
| `estado.retoActual.completado` | Candidato a retirar | 7 escrituras (`codigo-padre.html:10851, 11018, 11068, 11116, 12490, 12511, 12518`); la compleción real es la de `colaCompletados`; solo lo nombra `tests/flujo_bidireccional_exhaustivo.json`, que no ejecuta Playwright |
| `estado.gps.visualActivo` | Se queda (sonda) | el spec `20` lo lee (`globalThis.estado?.gps?.visualActivo`) y la guía lo describe en tres sitios; el recordatorio de audio no lo usa a propósito (usa `proximidadReal`, comentario `:9243`) |
| `estadoMonitoreo.metricas.ultimaActividad`, `estadoMonitoreo.intervaloMetricas`, `estado.monitoreo.metricas.errores` | Se deciden con K-04 | el monitoreo entero está en cuestión; no tiene sentido retirar tres campos de algo que se puede retirar entero |
| `estado.conectado` | Se decide con K-40 | es la bandera del camino 3 |

- Las rutas «con ancestro leído entero» (`estado.audioActual.error`/`.timestamp`,
  `estado.gps.permisos`/`.precision`/`.ultimaUbicacion`) **siguen por leer**: pudieron leerse por la copia
  entera del padre y comprobarlo exige leer cada receptor del payload. Recomendación general: retirar los
  candidatos como una sola tanda con sus frases de la guía, después de decidir K-04, K-07 y K-40, que
  afectan a seis de las doce filas.

#### Familia M — Lo que se publica y nadie usa

##### K-42 — Exports de `js/` que ningún otro fichero menciona: 27 muertos del todo, 3 que solo nombran los specs y 25 que se exportan sin que nadie los pida — 🔎 (con varios grupos ya cerrados en otras entradas)

- **Método.** Para cada `export` de los módulos de `js/` (191) cuenta las apariciones de su nombre
  como **token identificador** (sin comentarios ni cadenas) en todos los demás ficheros de
  producción (los `.html` y `js/*.js`) y en los specs. Un token igual en otro sitio cuenta como
  uso, así que el instrumento sobreaproxima el uso y lo que sale es ausencia casi segura. Se
  descuentan la propia declaración, el `export` y las claves del objeto-API que publica el módulo
  (`globalThis.mensajeria = {…}`, `export default {…}`). **Residuo:** 0 ficheros sin tokenizar; no
  se ven los accesos por cadena (`obj['nombre']`). **Comprobación independiente:** `grep -w` de
  17 nombres (los 15 nuevos y dos ya tratados, `updateEstadoPadre` y `getMapaControladores`),
  sobre `*.html js/*.js sw.js tools/*.js`: solo aparecen en su propio módulo (`throttle`, además,
  en tres comentarios).
- **Resultado.** 191 exports; 55 sin mención en otro fichero de producción: **27 muertos del
  todo**, 3 que solo nombran specs y 25 con uso interno (se exportan, y solo los usa su propio
  módulo; algunos también los usan specs): `ApiClientError`, `API_CONFIG`, `actualizarInterfazModo`,
  `notificarError`, `iniciarPrewarmEnCasa`, `obtenerEstadoMonitoreo`, `getConfig`,
  `hayBackendDisponible`, `ejecutarOperacionMapa`, `getMapCenter`, `limpiarRecursos`,
  `revelarNavegacion`, `manejarGPSActivar`, `registrarManejadoresMensajes`,
  `calcularToleranciaGPS`, `actualizarMarcadorUsuario`, `reenviarMensajesGPSAPendientes`,
  `registrarControladorCentral`, `getControladoresRegistrados`, `getMapaControladoresSync`,
  `diagnosticarStateManager`, `deepClone`, `deepMerge`, `sonIguales` e
  `instalarReporteErroresAlPadre`.
- **Los 27, por grupos.** Ya tratados en otra entrada (12): `js/data-loader.js` —
  `cargarCoordenadas`, `cargarIndice`, `validarRespuesta`, `limpiarCacheDatos`, reservados al
  backend y ya catalogados (M1) —, `js/constants.js` — `ERRORES`, `ESTADOS`, `CODIGOS_ERROR`,
  `DESTINOS`, `CSS_CLASES`, `TIPOS_MENSAJE_VALIDOS` (K-37) — y, en `js/state-manager.js`,
  `getMapaControladores` (K-12) y `updateEstadoPadre` (K-07). **Nuevos (15, 🔎):**
  - `js/utils.js`: `throttle`, `formatearBytes`, `formatearTiempo`, `capitalizar`, `truncar`,
    `getByPath` y `setByPath`, publicados solo en el `export default` del módulo (`:768-789`;
    `globalThis.__vv_utils`, `:623`, no los incluye) y sin un solo llamador.
  - `js/state-manager.js`: `setHeartbeat`, `setGpsPendientes`, `agregarMensajeGPSAPendientes`,
    `cancelarPromiseHijoListo` y `removerControladorCentral`, publicados en el objeto del
    state-manager (`:481-482`).
  - `js/mensajeria.js`: `listarControladores` (clave de `globalThis.mensajeria`).
  - `js/monitoreo.js`: `getEstadoMonitoreo`; su gemela `obtenerEstadoMonitoreo` (`js/app.js:995`)
    solo la usa su propio módulo (K-04).
  - `js/app.js`: `coordinarAccion` (`:1179`), que además figura en la lista de globals de ESLint
    sin existir como tal (K-34).
- **Cinco `export default` de objeto que nadie importa:** `js/config.js:201`, `js/constants.js:325`,
  `js/mensajeria.js:1303`, `js/monitoreo.js:292` y `js/utils.js:768` repiten los exports con nombre
  en un objeto y ninguna importación por defecto los usa (el instrumento de imports no registra
  ni una); todo el código importa por nombre. El `default` de `js/logger.js`, en cambio, sí se usa.
- **Solo los nombran specs (3):** `adelantarLatido` (K-11), `getScript2Listo` y `getEstadoPadre`
  (K-07).
- **Observación — `throttle`.** El helper compartido no lo usa nadie y la app limita a mano: el
  chequeo de integridad de la ruta ("throttle 3 minutos", `codigo-padre.html:5754`) y la escritura
  de la flecha a ~10 Hz (`js/funciones-mapa.js:1760`) llevan cada uno su propia marca de tiempo.
  Familia de copias, como las de K-28.
- **Pendiente:** ¿los 15 nuevos y los cinco `default` se retiran o se declaran API pública? El instrumento no distingue
  entre "andamiaje de una API general" y "código que se quedó"; esa decisión es del estudio
  individual. `tools/codigo-muerto.js` solo ve 3 de los 27 (K-34).

- **Estado final (2026-10-02).** Barrido repetido con el mismo instrumento: 162 exports (191 antes); 28 sin
  mención en otro fichero de producción (antes 55): 6 muertos del todo, 3 que solo nombran specs y 19 con
  uso interno. Retirados 21 de los 27 muertos del todo —los 6 de `constants.js` (K-37), los 2 del
  state-manager de K-07, los 7 de `utils.js` y 4 de los 5 del state-manager nuevos (`setHeartbeat`,
  `setGpsPendientes`, `cancelarPromiseHijoListo`, `removerControladorCentral`), `listarControladores` y
  `coordinarAccion`—, 6 de los 25 con uso interno (`notificarError`, `obtenerEstadoMonitoreo`, `getConfig`,
  `deepClone`, `deepMerge` y `sonIguales`) y los cinco `export default` de objeto (`218c0ae`, `01eeb47`,
  `f6ab460`, `e3bab74`). Quedan: los cuatro de `js/data-loader.js` reservados al backend (M1),
  `getEstadoMonitoreo` (se decide con K-04), `agregarMensajeGPSAPendientes` (la cadena de abajo) y los 3 que
  solo nombran specs: `adelantarLatido` (K-11), `getScript2Listo` y `getEstadoPadre` (sondas). **Abierta,
  decisión — la cadena `gpsPendientes`:** `reenviarMensajesGPSAPendientes('hijo2')` corre cuando hijo2
  vuelve de estar desconectado y lee `state.gpsPendientes`, que ningún código llena
  (`agregarMensajeGPSAPendientes` no tiene llamador): la cola siempre está vacía y el reenvío solo escribe
  un `debug`. *A) retirar la cadena* (`gpsPendientes`, `getGpsPendientes`, `agregarMensajeGPSAPendientes`,
  `limpiarGpsPendientes`, `reenviarMensajesGPSAPendientes` y su llamada en el manejo del
  `HEARTBEAT_RESPONSE`) — **recomendada**: es un consumidor sin productor, y la recuperación real de un hijo
  caído es la recarga y el reenvío de datos (spec 80). *B) conectar un productor* (que el padre encole el
  `NAVEGACION.ACTUALIZAR_ESTADO` que no pudo entregar a hijo2 mientras estuvo desconectado): solo tiene
  sentido si se define ese escenario de pérdida. Toca el bus, así que no se aplica sin decisión (regla 1).
  **Los 19 con uso interno** (se exportan sin que nadie los pida) quedan para el estudio individual: el
  instrumento no distingue andamiaje de una API general de código que se quedó. Los números se repiten con
  `node tools/codigo-muerto.js` (categoría 5: 6, 3 y 19).

#### Familia N — Identificadores con varios nombres

##### K-43 — El id del elemento activo viaja con cuatro nombres y se resuelve de dos maneras — 🧩 (con un 🔎)

- **Un hecho, cuatro nombres.** `paradaId`, `parada_id`, `padreId` y `padreid` salen juntos en
  `NAVEGACION.CAMBIO_PARADA`. Los once emisores, leídos: `_restoreBroadcast`
  (`codigo-padre.html:4542`), la parada por defecto (`:4603`), la progresión (`:10302`), el fan-out del
  padre a hijo5, hijo2, hijo3 y hijo4 (`:11966-12048`), `js/app.js:353-358` y hijo5
  (`boton-casa-hijo5.html:408-411`) mandan los cuatro; los de `:7804` y `:9828` mandan solo
  `paradaId`. También los llevan los dos `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` (hijo3,
  `audio-hijo3.html:1540-1542`; hijo4, `retos-hijo4.html:1609-1610`); `NAVEGACION.LLEGADA_DETECTADA` lleva
  `paradaId` y `parada_id`, y `SISTEMA.NOTIFICACION` lee `padreid`, que nadie manda (K-36).
- **Dos maneras de resolverlo.** `resolverIdsParada` (`js/utils.js:176`) toma `paradaId ?? parada_id ??
  tramo_id ?? id ?? ID` y `padreId ?? padreid` y normaliza el prefijo `padre-`. La usan el padre
  (`:12056`, `:12357`), hijo3 (`audio-hijo3.html:1528`), hijo5 (`:1092`, `:1179`) y
  `js/funciones-mapa.js:1877`. **Dos receptores del mismo `CAMBIO_PARADA` no la usan** y leen a mano,
  con precedencia opuesta: hijo2, `datos.parada_id || datos.paradaId`
  (`coordenadas-hijo2.html:2243`), y hijo4, `datos.padreId || datos.padreid` y `datos.paradaId ||
  datos.parada_id` (`retos-hijo4.html:1597-1598`). El propio handler del padre combina las dos:
  `datos.paradaId || datos.parada_id || resolved.paradaId` (`codigo-padre.html:12057`). La guía no
  menciona el resolutor ni la duplicidad (búsqueda desnuda de `resolverIdsParada` en
  `docs/estudio-caminos.md`: 0 hasta esta entrada).
- **Dos significados de `paradaId`.** En los emisores del padre es el id sin prefijo (`'P-5'`); en
  hijo5 es el id con prefijo (`paradaId: idPadre`, `parada_id: idSinPrefijo`,
  `boton-casa-hijo5.html:408-411`). El handler del padre lo sabe (`codigo-padre.html:12076-12080`:
  "hijo5 envía `padre-P-5`") y recorta el prefijo solo para buscar, pero guarda
  `estado.paradaActual = paradaId` tal como llegó (`_actualizarEstadoParada`, `:11956-11958`):
  tras un clic de hijo5 puede quedar con `padre-` y por las demás vías sin él. Un bug de este
  tipo ya existió (comentario `:12216-12221`: "Parada padre-P2 no encontrada en datos base").
  hijo5 es herramienta de desarrollo y no aparece en la PWA real.
- **Efecto hoy.** Ninguno observable en producción: los emisores del padre mandan `paradaId` y
  `parada_id` iguales (o `parada_id` normalizado), así que las dos precedencias dan el mismo valor, y
  el handler de hijo4 no hace nada con él ("No-op: placeholder for actual reto prefetch logic",
  `:1602`). El coste es de mantenimiento: cada emisor nuevo debe acordarse de los cuatro nombres y
  cada receptor nuevo elegir resolutor.
- **Pendiente:** ¿un solo nombre en el contrato y un solo resolutor? Mismo planteamiento que K-28
  (familias de copias). 🔎 el efecto del prefijo en `estado.paradaActual` cuando el origen es hijo5
  (solo desarrollo).

- **Estado final (2026-10-02).** Sin cambios: es una familia de copias sin efecto observable (los emisores
  del padre mandan `paradaId` y `parada_id` iguales; hijo4 no hace nada con el id y hijo5 es solo de
  desarrollo). **Abierta, decisión:** *A) un único nombre `paradaId` (sin prefijo) en el contrato y que
  hijo2 e hijo4 usen `resolverIdsParada`* — es lo correcto a medio plazo, pero toca los once emisores, dos
  receptores y los specs del cambio de parada (`51` y siguientes): trabajo de una tanda propia. *B)
  dejarlo*, con el coste de que cada emisor nuevo tiene que recordar los cuatro nombres. **Recomendada: B
  ahora y A al tocar el contrato de `CAMBIO_PARADA`.**

#### Familia O — Recursos locales

##### K-44 — Recursos locales: 491 referencias y una ruta que nunca existió (el respaldo del puzzle de introducción) — ✅

- **Método.** Todas las cadenas de los `<script>` y de `js/*.js` (con `acorn`), los atributos
  `src`/`href`/`data-src`/`poster` y los `url(…)` de los `.html`, y las cadenas de `sw.js` y de
  `manifest.json`, que terminan en una extensión de recurso (html, js, css, json, imágenes, audio,
  vídeo, fuentes…): **491 referencias en 50 ficheros**, comprobadas contra el disco. Los nombres
  sueltos, sin carpeta, se dan por buenos si existe un fichero con ese nombre en cualquier carpeta
  del repo, porque el código antepone la carpeta en ejecución (81: la tabla de imágenes de
  `video-intro.html:630-681`, los títulos y banderas de `En-busca-del-tesoro.html:1813, 2914`, los
  de `codigo-padre.html:3520-3522, 13794-13797`…). **Residuo:** 16 literales con `${…}` que no se
  pueden resolver (`chat-hijo6.html:505`, `js/data-loader.js:172`, las variables `AI`/`MV`/`IM` de
  `video-intro.html`…) y los módulos de datos (`*-aventuras.js`), que quedan fuera porque
  referencian media de aventuras y esas ausencias ya son conocidas.
- **Resultado.** **Una** ruta que no existe: `En-busca-del-tesoro.html:1165` y `:1610`,
  `puzzleIntro?.imagen || 'fotos-botones/logo-luna.jpg'`. La carpeta `fotos-botones/` no existe y
  ningún commit de los 664 añadió ficheros bajo ella (`git log --diff-filter=ADR --
  'fotos-botones/*'`: vacío); la imagen real es `imagenes/imagenes-aplicación/logo-luna.png` (otra
  carpeta y otra extensión), que es la que declara el dato (`js/puzzles-aventuras.js:7`). El
  respaldo solo corre si el dato falta, y entonces `verificarImagenExiste` falla y la selección **se
  salta el puzzle de introducción con un `warn`** (`:1166-1169`) en vez de mostrarlo con otra
  imagen. La guía repite la ruta (`GUIA-COMPLETA.md:2338`) y un spec monta una URL con ella
  (`60-nivel-de-log-alcanza-hijos.spec.js:90`).
- **Veredicto.** Respaldo que nunca pudo funcionar (la cadena está desde el commit inicial,
  `2c5c2c2`); inocuo mientras el dato exista. **Pendiente:** ¿se corrige la ruta o se retira el
  respaldo? Con la ruta actual el respaldo no es un segundo camino, es un camino que falla en
  silencio parcial.

- **Estado final (2026-10-02).** ✅ `545323b`: el respaldo `fotos-botones/logo-luna.jpg` apunta ya a
  `imagenes/imagenes-aplicación/logo-luna.png` (la imagen que declara `js/puzzles-aventuras.js`) en los dos
  sitios de `En-busca-del-tesoro.html`, en el ejemplo de la guía y en el spec 60 (NH-3 deja de pasarle al
  puzzle la ruta inexistente). La pregunta del «Pendiente» se resuelve corrigiendo la ruta, no retirando el
  respaldo.

#### Familia P — Orden de llegada de los datos de un frame

Un barrido más, hecho al cerrar la tanda de arreglos: lo encontró un spec que fallaba a veces (la carrera de
`71`, OB-3), no un instrumento.

##### K-45 — hijo6 construye su FAQ dos veces al abrirse por primera vez, y la primera escribe un `error` en el log aunque todo vaya bien — ✅ (medido: M-15; decisión abierta)

- **Dónde.** `chat-hijo6.html`: `construirFAQ()` (`:513`) se llama al final del módulo (`:815`,
  «Construcción inicial») con `estadoPadre = {}`, y otra vez cuando llega el estado del padre:
  `SISTEMA.PADRE_DATOS` (`:718-723`) y `CHAT.ESTADO_PADRE` (`:784-800`) llaman a `actualizarIdioma()`, que
  reconstruye el acordeón entero. El iframe se carga la primera vez que el usuario abre el asistente
  (`abrirChat()`, `codigo-padre.html:1622`).
- **El `error`.** En la construcción inicial no hay `estadoPadre.rescate`, y la pregunta del atasco
  (`UBIC_ATASCADO_TRAMO`) exige ese estado para rellenar «dispone de {total} rescates» (`:538-541`): el
  código la omite y escribe
  `logger.error('[hijo6] El padre no ha mandado el estado del rescate: la pregunta del atasco no se muestra')`.
  El comentario dice que se avisa «porque que falte significa que algo se ha roto antes», lo que es cierto
  después del saludo y falso antes: en el camino normal el estado llega 34 ms más tarde.
- **Medido (M-15).** Primera apertura del asistente: dos construcciones, a los 27 ms y a los 61 ms de cargar
  el iframe; `SISTEMA.PADRE_DATOS` llega a los 61 ms con 8 claves y `rescate`; **un** `error` «estado del
  rescate» en la consola; el acordeón queda con 47 botones de pregunta. Segunda apertura (cerrar y volver a
  abrir): sin ningún `error` nuevo y **una** reconstrucción completa, a la llegada de `CHAT.ESTADO_PADRE`.
- **Consecuencias.** (1) Un `error` por carga de página en el camino nominal: ruido en el log que acaba
  escondiendo un error de verdad. (2) La reconstrucción completa en cada apertura colapsa los acordeones que
  el usuario tuviera desplegados, y fue la causa de una carrera real del spec `71` (OB-3): el test
  desplegaba un acordeón y la reconstrucción que llegaba después lo cerraba. Se corrigió en el test
  (`5c52038`, con prueba de mutación: sin el relleno de `{total}` OB-3 falla; con el botón siempre visible
  falla OB-1; el spec pasa 5/5), y la carrera se reproduce también sobre `origin/main`.
- **Pendiente: decisión de diseño** (el comportamiento visible para el usuario es correcto en los tres
  casos). *A) no construir el FAQ hasta que llegue el estado del padre* — descartada: si `PADRE_DATOS` no
  llegara, el asistente se abriría vacío, un fallo peor que un FAQ sin la pregunta del atasco. *B) mantener
  la construcción inicial y escribir ese aviso a nivel `debug` hasta que llegue el primer
  `PADRE_DATOS`/`CHAT.ESTADO_PADRE`, y a `error` a partir de entonces* — **recomendada**: sigue siendo
  ruidoso donde significa avería (después del saludo) y deja de serlo donde no; es una bandera y una
  condición. *C) actualizar solo lo que cambia* (idioma, pregunta del atasco) en vez de reconstruir el
  acordeón: evita el colapso, pero es un cambio mayor en el único frame que ya tuvo una avería por tener dos
  caminos casi iguales (el chat en español).

#### Familia Q — Handlers que existen y no hacen lo que su descripción dice

Un barrido más, hecho al contrastar las tablas de handlers de la guía (§26.12) con el código, frame por frame: dos extractores nuevos
(`guia-handlers-por-frame.cjs` y `handlers-solo-log.cjs`) y la lectura de cada handler dieron las dos primeras entradas y las discrepancias
G-34 a G-42; el barrido de las fichas de §10 y de las tablas de §7 y §8 (`guia-fichas-mensaje.cjs`, `guia-payloads.cjs`) dio la tercera, K-48,
y G-43.

##### K-46 — Handlers del bus que solo escriben en el log — ✅ (decisión abierta)

- **Método.** `node tools/estudio-caminos/handlers-solo-log.cjs` (necesita el `mensajes.json` de `extract-mensajes.cjs`): de cada uno
  de los 140 registros de handler localiza la función con `acorn` y la clasifica como «solo log» cuando no hace ninguna llamada que no
  sea de log, ninguna asignación que no sea a una variable local y ningún `return` con valor. Analiza 136; el residuo son 4 registros
  cuya función no localiza (`PUZZLE.COMPLETADO` y `PUZZLE.TIMEOUT` en la selección, `MAPA_COMPLETO.DATOS` y `MAPA_COMPLETO.VISIBLE` en
  `mapa-completo.html`), leídos a mano: ninguno es solo-log. «Solo log y devuelve valor» (el valor viaja en el acuse): 0. Los 15 que
  salen se leyeron uno a uno.
- **Los 15.**
  - `SISTEMA.CAMBIO_MODO_APLICADO` ×6 (selección `:2869`, hijo1 `:520`, hijo2 `:1780`, hijo3 `:1432`, hijo4 `:1462`, hijo5 `:951`):
    escriben «cambio de modo aplicado globalmente» y nada más. Es la 4.ª fase del protocolo de modo: el padre la manda tras esperar el
    `CAMBIO_MODO_EFECTUADO` de todos (hasta 10 s) y no espera respuesta. hijo6 no registra un handler de este tipo.
  - `RETO.CONFIRMADO` (hijo4 `:1664`): la fase 3 de `RETO.MOSTRAR → RETO.MOSTRADO → RETO.CONFIRMADO`; el padre contesta y hijo4 solo lo
    anota. `DATOS.TEXTOS_CARGADOS` (padre, registro en `:12770`): hijo2 confirma la carga de los textos y el padre solo lo anota.
    (`DATOS.COORDENADAS_CARGADAS`, su par, no sale en la lista porque asigna `estado.seleccion.coordenadasCargadas`, un campo que
    ningún código lee: K-41.)
  - `SISTEMA.ERROR` ×3 (hijo2 `:2319`, hijo4 `:1653`, hijo5 `:1106`) y `SISTEMA.NACK` (hijo4 `:1643`): lo que el padre les manda —por
    ejemplo `gps_activar_restringido` a hijo2, o el `NACK` de `_hdl_RETO_SOLICITAR` cuando faltan los datos— solo se anota. hijo3, que
    también pide retos, no registra `SISTEMA.NACK`.
  - `SISTEMA.NOTIFICACION` (hijo4 `:1599`): deliberado; su comentario lo explica (acusar recibo sin tocar el reto abierto, que antes se
    borraba).
  - En el padre: `AVENTURA.FINALIZADA` (`:13858`, sin emisor: K-35) y `SELECCION.CODIGO_VALIDADO` (`:13364`, que la guía ya daba por
    no-op: la carga real la dispara `SELECCION.P14_MOSTRADA`).
- **Estado en la guía.** Tras `c40ecd0` y `f151ca3` cada fila de §26.12 dice del handler que solo escribe en el log; antes algunas
  prometían efectos que el código no tiene (G-34, G-41).
- **Pendiente: decisión de diseño** (ninguna cambia lo que ve el usuario). *A) dejarlos, ya documentados* — **recomendada para
  `CAMBIO_MODO_APLICADO`, `SISTEMA.ERROR`, `SISTEMA.NACK`, `SISTEMA.NOTIFICACION` y `CODIGO_VALIDADO`**: son el cierre visible de un
  protocolo, un diagnóstico o un aviso que se quiere conservar, no cuestan nada y retirarlos toca el protocolo de modo de once frames
  (regla 1) o quita una traza útil. *B) retirar los dos viajes de ida y vuelta que no consumen nada* — **recomendada para
  `RETO.MOSTRADO` → `RETO.CONFIRMADO` y `DATOS.TEXTOS_CARGADOS`**: el padre no usa la respuesta, y cada uno es un mensaje, un handler y
  una fila de la guía que no sostienen ninguna decisión. *C) retirar la 4.ª fase del modo entera* (el envío del padre, los seis
  handlers, la constante y lo que cubren los specs `09`): un protocolo de tres fases; solo si se quiere ese cambio.

##### K-47 — hijo2 no cambia la clase del body al cambiar de modo, y hijo3 y hijo4 sí — ✅ (medido: M-17; decisión abierta)

- **Dónde.** `coordenadas-hijo2.html:1556`: `` document.body.className = `modo-${modoSeguro} hijo2-container` ``, dentro de
  `_procesarDatosPadre` (`:1549`), que solo llama el handler de `SISTEMA.PADRE_DATOS` (`:1571`). El cambio de modo
  (`SISTEMA.CAMBIO_MODO`, `:1696-1774`, y `_resetarEstadoParaModo`, `:1646`) actualiza `estadoComponente.modo` y los botones y no toca la
  clase; `PADRE_CONFIRMA_HIJO_LISTO` (`:1591`) tampoco (aplica `modoInicial` al estado y a los botones). El `<body>` arranca con
  `modo-casa` (`:333`). hijo3 (`sincronizarSeekPorModo`, `audio-hijo3.html:1108-1115`, llamada en `:1185`, `:1269` y `:1402`) y hijo4
  (`sincronizarEstadoModo`, `retos-hijo4.html:1193-1204`, llamada en `:1247`, `:1306` y `:1428`) reescriben la clase en el
  `PADRE_DATOS`, en el `PADRE_CONFIRMA_HIJO_LISTO` y en cada `CAMBIO_MODO`.
- **Un solo lector de la clase.** La regla `.modo-aventura #btn-avanzar.activo { animation: pulse 1.5s infinite }`
  (`coordenadas-hijo2.html:214`). Búsqueda desnuda de `modo-aventura` y `modo-casa` en el frame: el `<body>`, esa regla y la escritura de
  `:1556`, nada más.
- **Medido (M-17).** Con el padre y los hijos reales: tras el arranque, `hijo2` = `modo-casa hijo2-container`, `hijo3` =
  `hijo3-container modo-casa` y `hijo4` = `modo-casa`; tras pasar a AVENTURA, `hijo2` **sigue** en `modo-casa` y `hijo3` y `hijo4` pasan
  a `modo-aventura`; tras volver a CASA y de nuevo a AVENTURA, igual: hijo2 no se mueve de `modo-casa`.
- **Consecuencia.** La animación `pulse` del botón de avanzar activo solo se aplicaría si hijo2 recibiera un `PADRE_DATOS` con modo
  AVENTURA (por ejemplo, tras recargarse por el latido en mitad de una aventura); en el camino normal, activar la aventura desde CASA, no
  se aplica nunca. Es el mismo hecho, «en qué modo estoy», en dos sitios con ciclos de vida distintos —`estadoComponente.modo`, que sí se
  actualiza, y la clase del body— y la guía lo describía como si el cambio de modo la actualizara (G-42).
- **Pendiente: decisión** (la opción A cambia lo que ve el usuario). *A) escribir la clase también en `_resetarEstadoParaModo`* (una
  línea, igual que hijo3 y hijo4): el botón de avanzar activo pulsaría en AVENTURA, como la regla preveía. *B) retirar la regla y la
  clase de hijo2* — **recomendada**: no cambia nada de lo que se ve hoy y deja una sola fuente del modo, `estadoComponente.modo`.

##### K-48 — hijo5 marca la parada activa por tres caminos que no se ponen de acuerdo — ✅ (medido: M-18; decisión abierta)

- **Dónde.** `boton-casa-hijo5.html`. El botón de una parada o tramo se marca como el actual en tres sitios: el click del propio botón
  (`_crearOnclickHandler`, `:397-398`) y la generación de los botones, si hay `estado.paradaActualIndex` (`:645-646`), ponen la clase
  `actual`; el handler de `NAVEGACION.CAMBIO_PARADA` (`:1077-1097`, que llama a `_resaltarBotonParada`, `:564-577`) pone la clase `activa`; y
  el de `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` (`:1137-1175`) compara `btn.dataset.padreid` con la parada, pone `actual` al que coincide y se
  la quita a los demás.
- **Lo que no cuadra.** (1) Solo `.parada-tramo-btn.actual` tiene regla CSS (`:265`). Búsqueda desnuda de `activa` en los ficheros
  rastreados (salvo docs y tests): como clase aparece solo en esas dos líneas de hijo5 y, sin relación, en las flechas de la galería del
  padre (`.galeria-flecha-icono.activa`); ninguna regla estila `activa` ni ningún código la lee. Lo único que hace el handler de
  `CAMBIO_PARADA` de hijo5 es esa clase. (2) `data-padreid` no lo asigna nadie: `_crearBotonParada` (`:427-460`) pone `data-punto-index`,
  `data-punto-tipo` y `data-punto-id`. El handler de `CAMBIO_PARADA_CONFIRMADO` compara contra algo que siempre es `undefined`: no coincide
  ningún botón y solo quita `actual` a todos.
- **Medido (M-18).** Con el padre y hijo5 reales (`cargarHijoCasa`, tres paradas): tras un `NAVEGACION.CAMBIO_PARADA` el botón 2 tiene
  `parada-tramo-btn parada-btn activa` y su estilo calculado (fondo, borde, color, sombra, transformación, peso) es **idéntico** al de antes;
  tras un click real en el botón 3 lleva `actual` y su estilo cambia; tras un `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` con la forma que
  construye `completarCambioParada()` (`paradaId` con y sin el prefijo `padre-`) la clase `actual` desaparece y el estilo vuelve al de antes
  del click. Ningún botón tiene `data-padreid`.
- **Consecuencia.** En CASA, con hijo5 a la vista (modo de desarrollo, ver §24), el resalte que pone el click sobre un botón se borra
  cuando llega la confirmación del padre, y un cambio de parada que no empieza en hijo5 no se refleja en la barra. Es el mismo hecho,
  «qué parada es la actual», escrito por tres caminos: dos con clases distintas y uno que no puede marcar. La guía decía que
  `CAMBIO_PARADA` «marca el botón con `.activo`» y que `CAMBIO_PARADA_CONFIRMADO` «marca como `actual`» (G-43).
- **Pendiente: decisión** (A y B cambian lo que se ve en la herramienta de desarrollo, no en la aplicación del usuario). *A) una sola
  función que marque `actual`* (por el índice de `estado.aventuraParadas`, como ya hace `_resaltarBotonParada`) y que llamen los tres
  caminos: el resalte sobrevive a la confirmación y sigue los cambios que vienen del padre — **recomendada**. *B) dejar solo el click y la
  generación y retirar los dos handlers de marcado* (el de `CAMBIO_PARADA` de hijo5 y el bucle de `CAMBIO_PARADA_CONFIRMADO`, y con ellos
  el envío de `CAMBIO_PARADA` a hijo5 de `_notificarCambioParadaHijos`): el resalte lo pone el click y se queda. *C) dejarlo*, si hijo5
  se retira o no se usa.

### R2.3 Clases barridas sin hallazgo (➖), con su método

Para que "no sale nada" no se confunda con "no se miró":

- **Red y almacenamiento (categoría 1 de la ronda 1, repetida con parser).** `fetch`: 1 en el
  padre, `sw.js`, `js/api-client.js`, `js/data-loader.js`, `js/feedback-forms.js` — sin cambios;
  `sendBeacon` solo en `feedback-forms.js`; `XMLHttpRequest`: 0. Storage: 9 claves de
  `localStorage` y 2 de `sessionStorage`, todas con lectores y escritores acotados (E6 es la
  única excepción de escritura fuera del padre).
- **Un solo `addEventListener('message')`** (`js/mensajeria.js:130`) y un solo `postMessage` de
  aplicación (`mensajeria.js`), más el canal del SW — K-16.
- **Polling: un solo camino.** Los ocho llamadores de `retryUntilAvailable` comparten helper con
  parámetros por sitio (K-23 trata la rama muerta del helper, no un segundo helper).
- **Atributos `on*="…"` de HTML (41, fuera del alcance del parser):** 36 en la selección y 5 en
  video-intro. Los 18 nombres de función de la selección y los 4 de video-intro existen y son
  globales (el script principal de la selección es clásico, `En-busca-del-tesoro.html:1058`;
  los que hacen falta desde el módulo se exponen con `globalThis.X = X`, `:2518-2528`).
  Comprobado con `grep -nE "function +X|globalThis\.X *="` para cada nombre.
- **Ids DOM, mostrar/ocultar** — K-33.
- **Alias de scripts del padre (`_S1`/`_S2`/`_S4`)** con guarda `=== undefined` — K-10.
- **Tablas idioma → recurso** (una sola copia cada una salvo K-27) — K-27.
- **Fallback de coordenadas de GPS**: ruidoso (K-09).
- **`getCurrentPosition` de `funciones-mapa.js:2505`**: diagnóstico (ronda 1, confirmado).
- **Dos librerías de mapa (MapLibre en el padre, Leaflet en `mapa-completo.html` y
  `video-intro.html`)** — decisión documentada, `GUIA-COMPLETA.md` L6278-6282 (incluida la carga de
  Leaflet por CDN en lugar de `js/vendor/`).
- **Los dos clientes HTTP (M1) y los imports de Fase 2 (M2)** de la ronda 1: no reabiertos; las
  búsquedas de esta ronda no encontraron ninguna llamada nueva a `fetch` ni a `ApiClient`.
- **Completitud de `js/traducciones-ui.js` (12 idiomas: de, en, es, fr, it, ja, nl, pl, pt, ru, uk,
  zh).** Con `acorn`: 133 tablas por idioma (86 de primer nivel o anidadas y las 47 respuestas del
  chat, que son llamadas `_rChat({…})`) comprobadas una a una contra la entrada española: idiomas
  presentes, forma del valor (cadena, array con el mismo número de elementos, objeto con las mismas
  claves), marcadores `{x}`/`%s`/`${…}`, cadenas vacías y textos idénticos al español de más de 12
  caracteres (en valores de tipo cadena y en propiedades de objeto, no en elementos de array).
  **0 problemas** en las cinco comprobaciones. Integridad del chat: 47 preguntas, 47
  respuestas y 47 claves repartidas en 9 temas, sin duplicadas ni huérfanas; los valores de `enlace`
  son los cuatro previstos (`null`, `terminos`, `video-intro`, `agradecimientos`). **Control:** en una
  copia mutada (un idioma retirado, una cadena vaciada, un marcador cambiado) el instrumento
  detecta los tres fallos. Residuo: 1 objeto que no es tabla por idioma (`TEMAS_AGRUPADOS_CHAT`,
  array de claves, comprobado aparte).
- **Listeners de `window`/`document` registrados en dos o más sitios del mismo frame** (parser, por
  cierre de ficheros de cada frame; residuo: 3 registros con nombre de evento no literal,
  `debug-brujula.html:203` y `js/funciones-mapa.js:1175, 1818`). En el padre salen 12 pares
  (objetivo, evento) con varios sitios, 1 en la selección y 2 en el puzzle. **Leídos todos:** deciden
  lo mismo dos veces `visibilitychange` (K-11), `online`/`offline` (K-40), `error`/`unhandledrejection`
  (K-04) y `pagehide` (K-30 y la guía, L12597-12599); el resto son responsabilidades distintas:
  `DOMContentLoaded` (el aviso de navegador antiguo, `codigo-padre.html:38`, `nomodule`, frente al
  "único listener consolidado", `:1516`), `click` (cierre del desplegable de audio, controles del
  mapa, el gesto del panel de logs —ver §24—), `keydown` (Escape cierra overlays, `:2216`, y por separado el
  desplegable, `:10800`), `resize`/`orientationchange` (mapa, aviso de rotación, diámetro de los
  botones de audio, caché de `device-detection.js:101`). Un orden que importa y es el correcto:
  `toggleRotationMessage` (`:4199`) y la invalidación de la caché de `esTelefonoMovil`
  (`js/device-detection.js:101`) escuchan el mismo `orientationchange`, y la invalidación se registra
  primero porque la FASE 1 espera a `import('./js/device-detection.js')` (`:3813-3831`) antes de
  llegar al registro de `:4199`.
- **Handlers duplicados en un mismo frame.** 144 receptores del bus, 144 pares (frame, tipo)
  distintos: ningún tipo se registra dos veces en el mismo frame (el bus ignoraría el segundo,
  `mensajeria.js:247`). Residuo: 0 receptores sin tipo canónico.
- **Cadenas de respaldo `a || b || c` con varias fuentes del mismo dato.** 152 cadenas de tres o
  más operandos; solo 12 combinan dos o más fuentes (global, estado, `localStorage`, parámetro de
  URL): `__vv_INDICE_AVENTURAS`/`aventuraSeleccionada` para el nombre de la aventura (6 sitios del
  padre, `:8704-9198`), `estado.elementoActual.parada_id`/`tramo_id`/`padreid` (K-43),
  `estadoPadre.modo.actual` (`:7351`), `aventuraSeleccionada`/`estado.seleccion.aventura` (`:11623`,
  K-41), `__vv_coordenadasAventura`/`AVENTURA_PARADAS` (`:5443`, K-38) y `estadoPadre`/
  `estadoScript2` (`:9909`, K-38). Las tres últimas ya están en sus entradas.
- **`APP_SHELL` y ids.** `sw.js`: 56 entradas, las 56 existen en disco y ninguna se repite (un 404
  en esa lista haría fallar el `addAll` de la instalación del service worker). Ids estáticos de los
  17 `.html`: 193 distintos, ninguno repetido dentro de su documento. Y los 14 nombres de
  `globalThis` que leen los specs sin que producción los asigne, en K-32 (uno solo importa).

### R2.4 Las mediciones (hechas el 2026-10-02)

Las doce mediciones que la ronda 2 dejó "POR MEDIR" (M-1 a M-12) y seis más que salieron al arreglar
(M-13 a M-18) se ejecutaron el 2026-10-02, salvo M-8, que es de campo. Se hicieron con el OK del
usuario ("ok a todo, revisa y arregla"), sin nada más corriendo (regla 5) y con specs desechables en
chromium sobre la app real (el padre con el stub de MapLibre y los hijos reales). Los specs de medición
no se versionan: cada fila dice qué se hizo, que es lo que hay que repetir. Donde la medición pedía una
condición que el entorno de pruebas no da sola (una brújula "viva", la hora), se dice cómo se simuló.
La hipótesis de cada una está en su entrada de R2.2, con una nota "Estado final" que dice qué pasó
después.

| # | Entrada | Medido | Resultado |
|---|---|---|---|
| M-1 | K-11 | Reanudación directa a AVENTURA: `getHeartbeat()` y la bandera `__HEARTBEAT_INICIADO` | Antes: `activo:false, userPaused:false`. Tras activar AVENTURA: `activo:true, userPaused:false`, con intervalo y la bandera a `true`. Tras CASA: `activo:false, userPaused:true`. De vuelta a AVENTURA: `activo:true, userPaused:false`. Ni el prewarm de CASA deja `userPaused` pegado ni el arranque (b) queda bloqueado. ✅ |
| M-2 | K-11 | Retardo efectivo del `setInterval` del latido | **5000 ms**, el de (b); los 10000 ms de (c) no se usaban. ✅ |
| M-3 | K-11 | Con el latido **pausado** (`activo:false, userPaused:true`, como lo deja `_transicionarAModoCasa`), disparar el `visibilitychange` del padre | Sale **un** `SISTEMA.HEARTBEAT` en `broadcast` (`razon:'visibilitychange'`) a los 6 iframes registrados (`seleccion`, `hijo1-opciones`, `hijo2`, `hijo3`, `hijo4`, `hijo5`); los 6 contestan `HEARTBEAT_RESPONSE`; el padre anota `ultimoHeartbeat` de los 6 y `heartbeatsFallidos: 0`; `activo` y `userPaused` no cambian. El latido en pausa no impide ese envío: el handler inline no mira la pausa y `adelantarLatido()` no interviene. ✅ |
| M-4 | K-07 | Ruta fallback de `SELECCION.AVENTURA_ACTIVADA` (`_iframesPreCargadosP14 = false`, lo que deja `SELECCION.REINICIAR`) con los hijos ya cargados una vez | **Confirmada la hipótesis.** +3 ms "Cargando iframes hijos (ruta fallback)"; +85 ms los cinco `load` y **"Hijos cargados (sistema de eventos), 0ms"**: `_esperarHijosCargados` no espera; +85 ms `distribuirDatosAventura` devuelve `pospuesto` ("Datos no disponibles aún"); **+96 a +123 ms** llegan los cinco `HIJO_LISTO` nuevos, 11–38 ms después de que la espera diera por buenos a todos. El conjunto del padre se vacía en `_normalizarSetHijos` y se rellena con los `HIJO_LISTO` nuevos; el del state-manager no se vacía en ningún sitio, y `crearPromiseHijoListo` devuelve una promesa ya resuelta a quien esté en él. ✅ |
| M-5 | K-19 | Con "Seguir mi rumbo" elegido y la brújula "viva" (`brujulaEstaActiva` simulada a `true`, para que no actúe la auto-reversión de BR-7), "Vuelta rápida → Elegir otra aventura" | `desactivarSeguimientoRumbo()`: **0 llamadas** (con `_resetBrujulaModo()` directo, 1); `#brujula-modo` queda oculto y `estado.tiempoRestante` a `null`: lo demás del abandono sí corre. El botón principal usa siempre `boton-brujula.png`, así que el estado solo se observa por sus efectos. ✅ confirmada y corregida (BR-10) |
| M-6 | K-25 | Reto de opción: pulsar Enviar sin elegir | Sale un `alert()` real, en español: «Por favor, seleccione una opción.»; el botón existe, está habilitado y visible. ✅ |
| M-7 | K-32 | Cada spec que sustituye `enviarMensajeConConfirmacion` por un stub, con una copia instrumentada que cuenta las llamadas al stub | En todos los tests que lo instalan recibe al menos una: `100` (LU-1/2/3: 2, 2, 2), `102` (AR-1: 1, AR-2: 2), `39` (FC-1/2: 4, 4), `40` (OR-1/2: 2, 2), `44` (F-1, H-1, H-2: 2 cada uno; F-2 cuenta con su variable local), `46` (RU-1/2: 2, 2), `47` (MU-4: 2). Ninguno intercepta en el vacío. ✅ |
| M-8 | K-17 | Reintento de señal con timeout 15000 frente a 5000 en GPS en frío | ➖ No ejecutable en Playwright: es una prueba de campo. Queda anotada, sin medir. |
| M-9 | K-20 | Sesión **caducada** (8 días) sembrada con las cinco claves, con `mostrarModalTiempoAgotado` ocultado para forzar la rama «sin modal disponible» de `_comprobarReanudacionAventura`; control con el modal disponible | Rama forzada: se borran `vv_aventura_iniciada` y `vv_progreso` y **quedan vivas `vv_aventura`, `vv_idioma` y `vv_paradas_completadas`**. Control: con el modal disponible no se borra nada hasta que el usuario lo cierra (entonces `limpiarDatosAventura('timeout')` lo vacía todo). Lectores: `vv_paradas_completadas` solo lo lee la restauración de una sesión guardada (necesita `vv_aventura_iniciada`, que la siguiente aventura vuelve a escribir) y `vv_aventura` solo es el último respaldo de un nombre de aventura; el daño solo sería posible si se reabre la app antes de completar ninguna parada de la aventura siguiente. Rama de error; la otra rama equivalente, `_restoreCheckTimeout`, sí llama a `limpiarDatosAventura('timeout')`. ✅ |
| M-10 | K-38 | `typeof` de los nombres sin definidor, con la página cargada | Los 23 nombres del padre dan `'undefined'` (`iniciarHeartbeat`, `iniciarHeartbeat_S1`, `pausarHeartbeat`, `detenerHeartbeat`, `incrementarContador`, `registerAllowedOrigin`, `controladores`, `intervaloMonitoreo`, `puntosRuta`, `CoordenadasParadas`, `estadoHijos`, `intervaloReconciliacion`, `estadoScript2`, `__vv_aventuraSeleccionada`, `modoActual`, `INDICE_AVENTURAS`, `AVENTURA_PARADAS`, `__vv_coordenadasAventura`, `__vv_getManejadores`, `iniciarGPSAventura`, `TextosAventuras`, `TEXTOS_AVENTURAS`, `DATOS_AVENTURAS`), y `funcionesMapa.iniciarGPSAventura` también; en hijo2, `incrementarContador` y `__vv_idiomaActual` (leído como `idiomaActual`). Control: `mensajeria.iniciarHeartbeat`, `.pausarHeartbeat` y `.adelantarLatido` son `function`. ✅ |
| M-11 | K-39 | `mapa-completo.html` suelta (sin padre): `typeof globalThis.logger` y la línea `debug` de `constants.js` | `logger`: `undefined` (`mensajeria`: `object`); la línea "✅ constants.js cargado" sale por `console.debug` crudo, sin pasar por el logger. ✅ confirmada y corregida (NH-3) |
| M-12 | K-40 | En AVENTURA, `offline` y luego `online` | `offline`: overlay del padre visible, `estado.conectado:false` y un `warning` «Conexión perdida, pausando operaciones»; el latido sigue `activo:true, userPaused:false` (no se pausa nada). `online`: overlay oculto, `conectado:true` y un `info` «Conexión restablecida, reanudando operaciones». ✅ |
| M-13 | K-24 | (nueva, no estaba en las doce originales) Idioma de los textos propios de hijo4 | `idiomaActual` es `undefined` en hijo4 (`__vv_idiomaActual` no se asigna nunca allí); el placeholder sale en español («Escriba su respuesta aquí...»), igual que la entrada `es` de la tabla; la tabla tiene los 12 idiomas; el aviso «Este reto no está disponible en este momento.» también sale en español. ✅ |
| M-14 | K-36 | (nueva, salió al arreglar K-36) Claves reales de `datos` en cada `SISTEMA.PADRE_DATOS`, con cada frame escuchando en captura sus propios `message` | `["modo","timestamp"]` para la selección, hijo1, hijo2, hijo3, hijo4 y hijo5; hijo6-chat recibe además `aventura`, `idioma`, `paradaActualNombre`, `paradasRestantes`, `rescate` y `siguienteParadaNombre`. Ninguna lleva `paradas` ni `paradaActual`. ✅ |
| M-15 | K-45 | (nueva, salió al cerrar la tanda) Primera y segunda apertura del asistente: construcciones del FAQ de hijo6, llegada del estado del padre y `error` de rescate | 1.ª apertura: dos construcciones (a los 27 y a los 61 ms de cargar el iframe), `SISTEMA.PADRE_DATOS` a los 61 ms con 8 claves y `rescate`, **un** `error` «El padre no ha mandado el estado del rescate» y 47 botones de pregunta. 2.ª apertura: ningún `error` nuevo y una reconstrucción completa, al llegar `CHAT.ESTADO_PADRE`. ✅ |
| M-16 | K-35 | (nueva, salió al cerrar) ¿Recibe el padre algún `SISTEMA.HEARTBEAT`? Con el padre y los hijos reales, un `message` en captura en el padre para todo `SISTEMA.HEARTBEAT` que llegue de otra ventana y un espía de `despacharLocal`, durante el arranque, la carga de los hijos, el paso a AVENTURA y a CASA y un `visibilitychange` | `entrantes: []` y `locales: 0`; 18 `SISTEMA.HEARTBEAT_RESPONSE` en la misma ventana, como control de que el oyente ve lo que llega de los hijos. ✅ confirmada y corregida (`e3a9cff`) |
| M-17 | K-47 | (nueva, salió al cerrar) Clase del `body` de hijo2, hijo3 y hijo4 tras el arranque, tras pasar a AVENTURA, tras volver a CASA y de nuevo a AVENTURA (el padre cambia el modo con `despacharLocal`) | `hijo2`: `modo-casa hijo2-container` las cuatro veces; `hijo3` y `hijo4` siguen el modo (`modo-casa`, `modo-aventura`, `modo-casa`, `modo-aventura`). ✅ confirmada; decisión abierta |
| M-18 | K-48 | (nueva, salió al cerrar) En hijo5 con tres botones de parada: clases y estilo calculado del botón tras un `NAVEGACION.CAMBIO_PARADA` del padre, tras un click real y tras un `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` con la forma de `completarCambioParada()` (`paradaId` con y sin prefijo `padre-`) | `CAMBIO_PARADA`: el botón 2 gana la clase `activa` y su estilo calculado no cambia; click: el botón 3 gana `actual` y su estilo cambia; `CAMBIO_PARADA_CONFIRMADO`: `actual` desaparece y el estilo vuelve al anterior, con las dos formas del id; ningún botón tiene `data-padreid`. ✅ confirmada; decisión abierta |

### R2.5 Discrepancias entre la guía (o comentarios de código) y el código — para decidir

La guía "se consulta siempre y no se cree nunca" (CLAUDE.md regla 8). Estas son las contradicciones que la ronda tropezó,
cada una verificada contra el código. **Las 18 se corrigieron en la tanda de arreglos del 2026-10-02**, junto con las que la
propia tanda fue encontrando (G-19 a G-43, tabla de estado más abajo); la tabla de aquí conserva lo que decían y lo que había:

| # | Dónde | Dice | El código |
|---|---|---|---|
| G-1 | `GUIA-COMPLETA.md` L13625-13640; specs `38-…:67-74, :107-108`, `31-…:24` | `enviarMensaje()` de los hijos bifurca por `parent !== window` y cae a `retryUntilAvailable(..., 10, 500)` | Los hijos toman `enviarMensaje` del bus; `10, 500` no existe en producción (K-23) |
| G-2 | `GUIA-COMPLETA.md` L4899 frente a L3627 | L4899: `mensajeriaReady` lo emite `mensajeria.js` "tras `inicializarMensajeria`"; L3627: "inmediatamente al cargarse" | El módulo lo emite al cargarse (`:1323`); el padre lo emite además tras inicializar (`:3959`) (K-13) |
| G-3 | `GUIA-COMPLETA.md` L3619, L6263 | `adelantarLatido()`: "al volver a la pestaña" | Ningún código de producción lo llama; el handler del padre manda un `HEARTBEAT` directo (K-11) |
| G-4 | `js/device-detection.js:5-11` (cabecera) | solo `mensajeria.js` y el padre usan `esMovil()/esTelefonoMovil()` | también `js/funciones-mapa.js:1137-1180` y `js/app.js:1006` (K-28) |
| G-5 | `docs/estudio-caminos.md` (este documento) | C1 variante B, C3, C4, categorías 1, 3 y 5 | erratas E1-E7 |
| G-6 | `codigo-padre.html:3628-3631` (comentario de `_resetBrujulaModo`) | existe "para que `ejecutarElegirOtra()` pueda resetear…" | también hace falta en `_elegirOtra` (K-19) |
| G-7 | `js/app.js:954` (docblock de `registrarEvento`) | "@returns {string} ID del evento registrado" | no devuelve nada (K-04) |
| G-8 | `CLAUDE.md` regla 3b | "El censo son los diez" y enumera padre, selección, hijo1 a hijo6, mapa-completo, puzzle y video-intro | son once nombres |
| G-9 | `GUIA-COMPLETA.md` L2498, L2532, L3907, L5471, L11309 | `UI.CLOSE_MENUS { except }` también va padre → hijo1 ("Colapsa el menú si `except !== 'mas-opciones'`") | el padre no lo manda nunca; solo hijo1 → padre (`extrainfo-hijo1.html:709`); el handler de hijo1 no tiene emisor (K-35) |
| G-10 | `GUIA-COMPLETA.md` L2813, L3798, L4003, L5945 | `UI.ACCION_USUARIO` con `accion:'simular_click'` (`contexto:'boton_horizontal'`) y la respuesta `SISTEMA.CONFIRMACION {accion:'click_ejecutado'}` | ningún emisor manda esa acción; el receptor está en `audio-hijo3.html:1609` (K-36) |
| G-11 | `GUIA-COMPLETA.md` §10.17 (L5935-5950), L3987, L4081 | `SISTEMA.CONFIRMACION { tipo:'UI_VISIBLE' }` como "handshake visual" y como respuesta a acciones de audio | el padre no registra ningún handler de ese tipo (K-35) |
| G-12 | `GUIA-COMPLETA.md` L10788 | `constants.js`: "fuente de verdad de todas las constantes", "16 categorías y 83 tipos", `TIPOS_MENSAJE_VALIDOS` "para validación O(1)", cita `ERRORES` y `ESTADOS` | 94 tipos; ninguna de esas constantes tiene lector (K-37) |
| G-13 | `codigo-padre.html:6050-6059` (comentario de `solicitarCoordenadasHijo`) | `_solicitarParadaAHijo2()` y `solicitarCoordenadasAHijo2()` usan ya `enviarMensajeConConfirmacion` | `solicitarCoordenadasAHijo2` manda `DATOS.COORDENADAS_PARADAS_REQUEST` con `enviarMensaje_S2`, sin acuse (`:10516`; K-36) |
| G-14 | `GUIA-COMPLETA.md` L12591-12592 | el `pagehide` real "detiene el heartbeat" y "vacía `__CONTROLADOR_REGISTRADOS` y `globalThis.controladores`" | `detenerHeartbeat` y `globalThis.controladores` no existen; solo se vacía `__CONTROLADOR_REGISTRADOS` (K-38) |
| G-15 | `GUIA-COMPLETA.md` L12670-12686; `codigo-padre.html:15004-15006` (comentario) | "patrón correcto": `globalThis.mensajeria?.iniciarHeartbeat \|\| globalThis.iniciarHeartbeat` y la regla de usar `globalThis.mensajeria` directamente; el comentario dice que el arranque de Script 4 llama "directo a iniciarHeartbeat/pausarHeartbeat/getHeartbeat" | el segundo operando no existe; los arranques (a) y (c) llaman por nombre suelto o `globalThis.`, no por el bus (K-38, K-11) |
| G-16 | `GUIA-COMPLETA.md` L10790 | "Cada página que loguea publica su logger en su propio `globalThis` … los siete hijos más `puzzle.html` y `video-intro.html`" | `mapa-completo.html` no lo publica y arrastra `utils.js` y `constants.js`, que loguean por `(globalThis.logger \|\| console)` (K-39) |

**Estado tras la tanda de arreglos (2026-10-02).** `GUIA-COMPLETA.md` y los comentarios de código se corrigieron contra el
código leído ese día; los hashes son de los commits locales (sin pushear).

| # | Estado | Dónde se corrigió |
|---|---|---|
| G-1 | ✅ | `cf4b973` (guía), `b6affee` (los specs `31` y `38` y `retryUntilAvailable`) |
| G-2 | ✅ | `cf4b973` |
| G-3 | ✅ | `6538bba`: la guía dice que `adelantarLatido()` no tiene llamador y que el `visibilitychange` difunde por su cuenta (M-3) |
| G-4 | ✅ | `6538bba` (cabecera de `device-detection.js` y su fila en la guía) |
| G-5 | ✅ | Este documento: erratas E1–E8 |
| G-6 | ✅ | `c7c7b1a` (el comentario nombra las dos vías y `_elegirOtra` llama a `_resetBrujulaModo`: K-19) |
| G-7 | ✅ | `6538bba` (`registrarEvento` ya no promete un id; los dos docblocks de `registrarMetrica` describían una firma que no existe) |
| G-8 | ✅ | `cf4b973` (CLAUDE.md regla 3b: "los once") |
| G-9 | ✅ | `6538bba`: `UI.CLOSE_MENUS` va solo hijo1 → padre; el handler de hijo1 sigue sin emisor (decisión abierta en K-35) |
| G-10 | ✅ | `8daa6db` (código) y `cf4b973` (guía) |
| G-11 | ✅ | `8daa6db` |
| G-12 | ✅ | `e3bab74` (`constants.js`) y `1e5bbf3` |
| G-13 | ✅ | `6538bba` |
| G-14 | ✅ | `2ed1658` y `cf4b973` |
| G-15 | ✅ | `2ed1658` |
| G-16 | ✅ | `545323b`: `mapa-completo.html` publica el logger y la guía lo lista |
| G-17 | ✅ | `cf4b973`: "los diez frames" pasa a once en la guía |
| G-18 | ✅ | `6538bba`: `CONTROL.HABILITAR`/`DESHABILITAR` habilitan controles concretos de hijo2 y hijo3, no "muestran/ocultan el iframe"; se retiran las filas de hijo1, hijo4 y hijo5, que no los registran |
| G-19 | ✅ | `218c0ae`: §26.4 (monitoreo) decía 50 MB de `config.js` y el código usa **150 MB** de `UMBRALES.MEMORIA_MB`; que el tiempo de respuesta se calcula sobre los ACK del bus (nadie emite `tiempo_respuesta`); que el historial vive en `state-manager.estadoPadre.monitoreo` (vive en `estadoMonitoreo`, local del módulo) |
| G-20 | ✅ | `218c0ae`: §"El state-manager" decía 13 mutexes (eran 12, 8 sin uso), banderas de carga como vivas y `mensajesEnviados`/`limpiarMensajesAntiguos`, que no existen |
| G-21 | ✅ | `218c0ae`: la fila de `validacion.js` y su cabecera citaban `globalThis.__vv_validacion` y `_assertMensajeValido`, que no existen en ningún fichero |
| G-22 | ✅ | `f6ab460`: §33.4 y el punto 9 del EJE 4 daban a `resolverIdPadre()` el id del propio padre y decían que el bus lo buscaba en `iframesRegistrados` ("Iframe no encontrado"); devolvía un id generado, y `enviarMensaje` rechaza `destino === componenteId` con un aviso que sugiere `despacharLocal`. Dos snippets (payload de hijo5 y de `ERROR_NO_CONTROLADO`) llevaban `destino: resolverIdPadre()`; el real es `'padre'` |
| G-23 | ✅ | `c7c7b1a`: la guía atribuía `ejecutarElegirOtra()` a `mostrarDialogoVueltaRapida`; son dos diálogos (`mostrarDialogoReanudacion` y `mostrarDialogoVueltaRapida`, con `_elegirOtra`) |
| G-24 | ✅ | `c7c7b1a`: la fila del spec 25 decía que elegir "Seguir mi rumbo" cambia el icono del botón principal; usa siempre `boton-brujula.png` |
| G-25 | ✅ | `f6ab460`, `c7c7b1a`: §37.2 regenerada con `tools/inventory-conexiones.js` (sus citas de línea eran reales y se movían con cada edición) |
| G-26 | ✅ | `6538bba`: la guía decía que el padre abre una ventana flotante y manda `UI.CLOSE_MENUS` a todos los iframes al recibir `UI.NAVEGACION_EXTERNA`; hijo1 pausa el audio, abre la URL en una pestaña nueva y avisa, y el padre solo registra la URL y marca `__vv_salidaEnlaceExterno` |
| G-27 | ✅ | `218c0ae`: §30.3 citaba `state-manager.js` "línea 200 (declarada en la línea 186)" para `crearPromiseHijoListo`; ni antes ni después coincidían |
| G-28 | ✅ | `a4644e5`: la guía daba a `PADRE_DATOS` de la selección, hijo1, hijo2, hijo3, hijo4 y hijo5 un contenido que no lleva (aventura, idioma, coordenadas, lista de paradas; medido en M-14: `{ modo, timestamp }`); decía que `HIJO_LISTO` de hijo2 y de hijo5 sale tras procesar coordenadas y tras renderizar los botones (sale tras `PADRE_DATOS`); situaba `SOLICITAR_COORDENADAS` de hijo2 y `SOLICITAR_DATOS_PARADAS` de hijo5 «tras `PADRE_DATOS`» (salen tras `PADRE_CONFIRMA_HIJO_LISTO`); citaba un `confirmListener` de hijo2 y un «ACK (best-effort)» del padre al `HIJO_PREPARADO` que no existen en ningún fichero (`SISTEMA.ACK` salió en `141be18`), con otras cinco frases sobre ese ACK (la etiqueta del esquema de §10, las filas de `CAMBIO_MODO_ENTENDIDO` y `CAMBIO_MODO_EFECTUADO`, el ciclo de cuatro fases y la fila de hijo1); y contaba cinco receptores de `PADRE_DATOS` donde hay siete |
| G-29 | ✅ | `dae5bf2`: la guía llamaba «parámetros inertes» a `aventura` y `noOverlay` de la URL del puzzle de P6 (ahora no se escriben), afirmaba que los hijos «leen `padreId` de `sessionStorage`» (ningún fichero lo hace) y el diagrama de §7.8 decía P9 donde es P6 |
| G-30 | ✅ | `94007e9`: las listas de claves del `PADRE_DATOS` de hijo6 omitían `rescate` (M-14) |
| G-31 | ✅ | `94007e9`: tres sitios describían un «confirmListener» por frame que filtra por `event.data.idOriginal` y un adaptador `messagingAdapter` de hijo2 que no existen en ningún fichero; la correlación la hace el bus (`confirmacionesPendientes`), como dice §10.17; el glosario daba `messagingAdapter` como presente en hijo2, hijo3 y hijo4 |
| G-32 | ✅ | `94007e9`: el glosario de CAMBIO_MODO citaba `_listenerRegistry.clear()` (solo existe en dos comentarios) y §32.1 contaba «10 frames» donde hablan por el bus once |
| G-33 | ✅ | `3d41dd6`: el árbol del repo de la guía (§20) y `docs/README.md` no listaban `docs/estudio-caminos.md` (documento de autoridad en la regla 1b de `CLAUDE.md`), ni `tools/estudio-caminos/`, ni dos documentos de seguimiento versionados (`contraste-textos-mapa.md`, `imagenes-referencias-pendientes.md`) |
| G-34 | ✅ | `c40ecd0`: §26.12.1 (handlers del padre) daba por falsas o incompletas 25 filas —entre otras, `GPS.RESTRINGIDO` como «permiso denegado» (es el aviso de distancia fuera de rango), `SISTEMA.HIJO_LISTO`, `CAMBIO_MODO_ENTENDIDO`/`EFECTUADO` y `HEARTBEAT_RESPONSE`— y no tenía 13 handlers (`SISTEMA.CAMBIO_MODO`, `SISTEMA.ERROR`, `GPS.DENTRO_DE_RANGO`, `PRECISION_INSUFICIENTE`/`RECUPERADA`, `RESPUESTA_COORDENADAS`, `SUPRIMIR_ROTACION`, `P14_MOSTRADA`, `REINICIAR`, `VV:PARADAS:READY`, `RESCATE_SOLICITADO`, `SOLICITAR_TEXTOS`, `MAPA_COMPLETO.SOLICITAR_DATOS`); el padre tiene ahora 61 handlers en el código y 61 en la guía |
| G-35 | ✅ | `c40ecd0`: §26.12.2 (mensajes salientes del padre): 6 filas corregidas (entre ellas `CONTROL.HABILITAR`/`DESHABILITAR`, que seguían diciendo «activar el iframe» tras G-18) y 14 mensajes que no estaban |
| G-36 | ✅ | `c40ecd0`: §8.3 (catálogo de tipos): 10 filas corregidas (`SISTEMA.HIJO_FALLIDO` iba al revés, `APLICACION_INICIALIZADA` no es un broadcast, `PREPARAR_HIJOS` no precarga nada, `UI.ACCION_USUARIO` también viene de hijo1, `NAVEGAR_PANTALLA` va del padre a la selección…) y los 11 tipos que no listaba: ya están los 94 |
| G-37 | ✅ | `c40ecd0`: el handler de `SISTEMA.HEARTBEAT` del padre (retirado en `e3a9cff`, K-35 y M-16): su fila de §2.8, el «Handler en padre» y el «bidireccional» de §10.5 y las listas de handlers de Script 1 |
| G-38 | ✅ | `c40ecd0`: `SELECCION.DEV_MODE_TOGGLE` descrito como un IIFE de Script 1 «que no pasa por `registrarControladorSeguro`» (§6, §7.1, §8.3, §26.12.1, el diagrama y la tabla de §24): lo atiende `_hdl_SELECCION_DEV_MODE_TOGGLE`, registrado en Script 2. Fuera de §24 solo queda el qué, con «(ver §24)» |
| G-39 | ✅ | `c40ecd0`: números de línea que ya no cuadraban: las dos tablas de §2.8 (la columna «Línea» pasa a «Script» y «Ubicación»), §10.22, §29.1, 13 citas en prosa y los rangos de los cinco scripts del padre (§36.2 y `CLAUDE.md`) |
| G-40 | ✅ | `c40ecd0`: el recuento de handlers con `permanente: true` (57 = 52 + 2 + 3) no cuadraba con el árbol: 60 = 55 + 2 + 3; y §10 decía que `RESPUESTA_COORDENADAS` «resuelve la promesa pendiente de `enviarMensajeConConfirmacion`», cuando guarda las coordenadas en `estadoMapa.datosRecopilados` y completa el cambio de parada |
| G-41 | ✅ | `f151ca3`: §26.12.3 a §26.12.9: 33 handlers y 43 mensajes salientes que las tablas de la selección y los seis hijos no tenían, y 36 filas falsas o incompletas (hijo1 «se muestra o se oculta según el modo», hijo4 «oculta o muestra el reto», hijo5 al revés, `CONTROL.*` de hijo2 «muestra el iframe», `UI.ACCION_USUARIO` de hijo3 con un acuse que no manda, `IDIOMA_SELECCIONADO` en P3…); sección nueva §26.12.10 para los tres nietos |
| G-42 | ✅ | `f151ca3`: §7.1, §7.2, §7.3 y §2.9: la selección «no participa en el ciclo de modos»; `#icono-temporizador` «solo en AVENTURA y se oculta en CASA» (nada lo oculta); hijo2 «cambia la clase CSS del body» en `CAMBIO_MODO` (solo la fija `PADRE_DATOS`: K-47, M-17) y «carga coordenadas desde `coordenadas-aventuras.js`» (las recibe del padre); hijo5 en AVENTURA «lista de paradas actualizada» (la ventana está oculta) |
| G-43 | ✅ | `4ff98d5`: las fichas por mensaje de §10, las tablas de los siete frames de §7 y §8 y la tabla 10.7 repetían lo que §26.12 dice de cada handler y en varios puntos decían otra cosa. Modo: `CAMBIO_MODO` como `broadcast` con `aventura` e `idioma` y cinco handlers (son la orden al padre, `{ modo }`, y el aviso por hijo, `{ modo, mensajeId }`, y lo atienden siete frames); `EFECTUADO` sin la selección, hijo5 ni hijo6 y con una nota de que hijo6 no lo manda (lo manda); `APLICADO` en cuatro hijos y con efecto (seis frames, solo log). Fichas: `IDIOMA_SELECCIONADO` que «propaga a los hijos», `TERMINOS_ACEPTADOS` que «desbloquea el botón», `GPS.ACTIVAR` que llama a `revelarNavegacion`, `RETO.MOSTRADO` que toca `estado.retoActual`, `AUDIO.ERROR` que «no desbloquea flujo» (llama a `_marcarAudioNoDisponible`), `TEMPORIZADOR.TOGGLE` que pausa el temporizador, `HIJO_LISTO` que reenvía el modo, `SOLICITAR_DATOS_PARADAS` que lee `__vv_DATOS_AVENTURAS`, `MONITOREO.METRICA` mandada por cuatro hijos y guardada en un historial que no existe (la manda hijo2) y `UI.ACCION_USUARIO` mandada por hijo3 (la recibe). §8: `GPS.ERROR` y `GPS.ESTADO_ACTUALIZADO` de hijo2 que «muestran un overlay», `NOTIFICACION` de hijo4 que «limpia el reto», `SISTEMA.ERROR` de hijo5 que «reintenta», `CAMBIO_MODO` de hijo6 «sin acción» y el de hijo2 que «cambia la clase del body» (K-47). §7: hijo1 no manda `MONITOREO.METRICA`. §10.7: ❌ a hijo5 en `APLICADO`, ✅ a hijo4 en `RETO.OCULTAR` (lo manda, no lo atiende) y — a hijo2 en `RESPUESTA_DATOS_PARADAS`. Y 31 filas de payload con claves que ningún emisor manda (`HIJO_PREPARADO` y `HIJO_LISTO` con `componenteId`, `version` o `iframeId` que no llevan todos, `HEARTBEAT_RESPONSE` con `componente`, `AUDIO.*` con `parada_id` y `duracion`, `UI.ACCION_USUARIO` con `accion: 'video'`, `MOSTRAR_MAPA_VINTAGE` con `url` y `paradaActual`…). M-18 y K-48: hijo5 marca la parada con una clase sin estilo |

### R2.6 Censo de frames (regla 3b)

La tabla es el censo tal como lo dejó el barrido (los frames estaban sin modificar:
`git status --short -- '*.html' 'js/*.js' sw.js tools tests` vacío). La columna "hallazgos" es dónde
la ronda 2 encontró algo; la de "limpio" es lo que se comprobó y no dio nada, con su comprobación. Lo
que la tanda de arreglos tocó, y lo que no, está debajo de la tabla.

| Frame | Hallazgos | Clases sin hallazgo y comprobación |
|---|---|---|
| `codigo-padre.html` | K-01, K-04, K-05, K-07, K-08, K-09, K-10, K-11, K-14, K-17, K-18, K-19, K-20, K-21, K-22, K-25, K-26 (lectura de `parent` en el script inyectado), K-28, K-30, K-32, K-33, K-35 (sin handler de `SISTEMA.CONFIRMACION`; `AVENTURA.FINALIZADA` inalcanzable), K-36, K-37, K-38 (arranques (a) y (c) del latido sin efecto, contadores sin función, limpiezas de `pagehide` sobre nombres inexistentes, llamador de `iniciarGPSAventura`), K-40 (los listeners de `js/app.js:1089-1090` no hacen lo que dicen), K-41 (campos de estado sin lector), K-42 (exports de `js/` sin uso: la mayoría de los módulos cuelgan del padre) | ids DOM sin definir: 0 (instrumento CSS/DOM); `alert()`: 2 llamadas reales, traducidas (`grep -n '\balert(' codigo-padre.html` da 5 líneas, 3 son comentarios); globals por frame: (A) solo `iniciarHeartbeat`/`iniciarHeartbeat_S1`, (B) los nombres de K-38 y `Config` (K-01); lecturas `contentWindow.X`: 0 en toda la app |
| `En-busca-del-tesoro.html` (selección) | K-15, K-18, K-25 (19 literales), K-27, K-28, K-35 (emite `SISTEMA.CONFIRMACION` al vacío), K-37 (21 `destino: 'padre'`, 4 `'casa'`/`'aventura'` crudos), K-38 (`import()` no literal en `:2199`; único frame que carga `api-client.js`, `:1762`), K-36 (`paradaActual` de `PADRE_DATOS`, sin emisor), K-44 (respaldo `fotos-botones/logo-luna.jpg`, `:1165` y `:1610`) | ids DOM: 0; `alert()`: 0 (`grep -c`); `console`: 1 `warn` en `:17` antes de que exista el logger; 41 `on*=` con funciones existentes; `globalThis.logger` publicado (`:2583`) |
| `extrainfo-hijo1.html` | E1, E3, K-10 (`_uiConfirmado`), K-15, K-28, K-35 (handler de `UI.CLOSE_MENUS` sin emisor; emite `SISTEMA.CONFIRMACION` al vacío), K-36 (emisor de `UI.NAVEGACION_EXTERNA`), K-37 (21 `destino: 'padre'`), K-25 (abre las cuatro páginas de contenido solo en español, `:544-550`) | `alert()`: 0; literales en español: 0 (instrumento i18n); ids DOM: 0; globals por frame: solo lecturas de módulos compartidos que K-38 descarta o deja fuera de alcance; `globalThis.logger` publicado (`:69`) |
| `coordenadas-hijo2.html` | E1, K-02 (único lector de `GPS.PRECISION_MINIMA`), K-05, K-06, K-08, K-15, K-24 (escribe `__vv_idiomaActual`), K-25 (3 `title`), K-26, K-28, K-35 (emite `SISTEMA.CONFIRMACION` al vacío), K-36 (`motivo === 'reto_abierto'`), K-37 (32 `destino: 'padre'`, 17 modos crudos), K-38 (`incrementarContador`, `:2227`), K-41 (`estadoComponente.radioLlegada`/`.recorridoSuficiente`/`.botonesActivos.ubicacion`, por leer), K-36 (`paradas`/`paradaActual` de `PADRE_DATOS`, sin emisor), K-43 (lectura inline del id de `CAMBIO_PARADA`) | `alert()`: 0; ids DOM: 0; `globalThis.logger` publicado (`:436`) |
| `audio-hijo3.html` | E3, K-15, K-28, K-35 (emite `SISTEMA.CONFIRMACION` al vacío ×3), K-36 (`simular_click` sin emisor), K-37 (18 `destino: 'padre'`), K-38 (diagnóstico `TIPOS_MENSAJE_exists`, `:1380-1381`), K-36 (`paradas`/`paradaActual` de `PADRE_DATOS`, sin emisor) | `alert()`: 0; literales: 0; ids DOM: 0; `globalThis.logger` publicado (`:479`) |
| `retos-hijo4.html` | E3, K-15, K-24, K-25, K-28, K-35 (handlers `CONTROL.*` sin cuerpo y sin emisión; emite `SISTEMA.CONFIRMACION` al vacío), K-37 (16 `destino: 'padre'`), K-38 (diagnóstico `TIPOS_MENSAJE_exists`, `:1402-1403`), K-36 (`paradas`/`paradaActual` de `PADRE_DATOS`, sin emisor), K-43 (lectura inline del id de `CAMBIO_PARADA`) | ids DOM: 0; `globalThis.logger` publicado (`:464`) |
| `boton-casa-hijo5.html` (solo desarrollo) | K-15 (variante), K-25 (2), K-28, K-35 (handler de `SISTEMA.CONFIRMACION` inalcanzable; emite el mismo tipo al vacío), K-37 (20 `destino: 'padre'`, 18 modos crudos), K-41 (`estado.gpsActivo`, por leer), K-36 (`paradas`/`paradaActual` de `PADRE_DATOS`, sin emisor), K-43 (emite `paradaId` con prefijo `padre-`), K-48 (marca la parada activa por tres caminos: `activa` sin estilo y `data-padreid` sin asignar) | `alert()`: 0; ids DOM: 0; globals por frame: solo lecturas de módulos compartidos que K-38 descarta o deja fuera de alcance; `globalThis.logger` publicado (`:315`) |
| `chat-hijo6.html` | E1 (variante B), K-28 (`enviarHijoListoConReintento` sin respaldo de UI), K-37 (7 `destino: 'padre'`; `'inicializando'` crudo en `:764`), K-36 (estado del chat entregado por dos tipos, `CHAT.ESTADO_PADRE` y `SISTEMA.PADRE_DATOS`, 📌) | `alert()`: 0; literales en español: 0; ids DOM: 0; `verificar-frames` le atribuye 1 "ajeno" y es un comentario (`:376`, K-34); globals por frame: solo lecturas de módulos compartidos que K-38 descarta o deja fuera de alcance; `globalThis.logger` publicado (`:402`) |
| `mapa-completo.html` | K-25 (1 literal), K-37 (1 `destino: 'padre'`), K-39 (único frame que no publica `globalThis.logger`) | `alert()`: 0; Leaflet por CDN y `maxZoom` 21/19: documentado (guía L6278-6282); ids DOM: 0; globals por frame: (B) solo `logger` (K-39) |
| `puzzle.html` | K-25 (2 literales), K-28 (`createParticle`/`loop`), K-37 (1 `destino: 'padre'`) | `escalar` variante C: cerrada en la ronda 1 (historial `94734b6`); `alert()`: 0; `PUZZLE.*` a `'padre'` = la ventana anfitriona (K-35); globals por frame: solo lecturas de módulos compartidos que K-38 descarta o deja fuera de alcance; `globalThis.logger` publicado (`:147`) |
| `video-intro.html` | K-28 (`createParticle`/`loop`), K-33 (`.or-badge`), K-37 (1 `destino: 'padre'`) | `alert()`: 0; 5 `on*=` con funciones existentes; `VIDEO_INTRO_TERMINADO` a `'padre'` = la ventana anfitriona (K-35); globals por frame: solo lecturas de módulos compartidos que K-38 descarta o deja fuera de alcance; `globalThis.logger` publicado (`:601`) |

**Tras la tanda de arreglos (regla 3b).** Comprobado contra el commit base de la ronda, `ffe9bfc`, con `git diff --quiet ffe9bfc HEAD -- <fichero>` (código de salida 1: tocado; 0: no tocado) y `git log --oneline ffe9bfc..HEAD -- <fichero>`:

| Frame | ¿Tocado? | Commits | Qué se hizo |
|---|---|---|---|
| `codigo-padre.html` | sí | `2ed1658`, `8806429`, `6c152ab`, `0fe5b3f`, `f6ab460`, `c7c7b1a`, `6538bba`, `a4644e5`, `e3a9cff` | arranques del latido y limpiezas de `pagehide` sin efecto, contadores, lecturas de `Config`, globals sin lector, `getPadreId`, reinicio de la brújula en «Vuelta rápida», comentarios contrastados con el código, el handler de `SISTEMA.HEARTBEAT` sin emisor (M-16) |
| `En-busca-del-tesoro.html` | sí | `8daa6db`, `545323b`, `a4644e5`, `dae5bf2` | avisos `UI_VISIBLE`, respaldo del puzzle de introducción, lectura de `paradaActual`, parámetros de la URL del puzzle |
| `extrainfo-hijo1.html` | sí | `8daa6db`, `0fe5b3f` | avisos `UI_VISIBLE`; `_reflow` |
| `coordenadas-hijo2.html` | sí | `8806429`, `8daa6db`, `a4644e5` | contador, `UI_VISIBLE` y `reto_abierto`, lectura de `paradas`/`paradaActual` |
| `audio-hijo3.html` | sí | `8daa6db`, `0fe5b3f`, `a4644e5` | `UI_VISIBLE`, `simular_click`, `audio_control` con acuse, `__hijo3_paradaActual`, lectura de `paradas`/`paradaActual` |
| `retos-hijo4.html` | sí | `8daa6db`, `a4644e5` | `UI_VISIBLE`, handlers `CONTROL.*` sin cuerpo, lectura de `paradas`/`paradaActual` |
| `boton-casa-hijo5.html` | sí | `8daa6db`, `a4644e5` | `UI_VISIBLE`, handler de `SISTEMA.CONFIRMACION`, lectura de `paradas`/`paradaActual` |
| `mapa-completo.html` | sí | `545323b` | publica el logger |
| `chat-hijo6.html` | **no** | — | `git diff --quiet ffe9bfc HEAD -- chat-hijo6.html` = 0 y 0 commits: su hallazgo (K-45, el FAQ se construye dos veces) es una decisión abierta, no un arreglo mecánico; sí lee el `idioma` que le llega |
| `puzzle.html` | **no** | — | `git diff --quiet` = 0 y 0 commits: solo lee `id` e `imagen`; el arreglo de K-36 estaba en quien lo invoca (la selección) |
| `video-intro.html` | **no** | — | `git diff --quiet` = 0 y 0 commits: sin hallazgos que arreglar (K-28, las copias de `createParticle`/`loop`, es coste de mantenimiento) |

Los commits posteriores a `e3a9cff` (el último que toca un frame, el padre) no cambian ninguno de los once: `git diff --quiet e3a9cff HEAD -- <fichero>` da 0 y `git log --oneline e3a9cff..HEAD -- <fichero>` no da nada para cada uno de los once; tampoco cambian `js/`, `sw.js` ni `tests/`.

Módulos de `js/` tocados (11): `app.js`, `config.js`, `constants.js`, `device-detection.js`, `funciones-mapa.js`, `mensajeria.js`, `monitoreo.js`, `reciclaje-digital.js`, `state-manager.js`, `utils.js` y `validacion.js`. No tocados (21; `git diff --quiet` = 0): `api-client.js`, `controladores-padre.js`, `data-loader.js`, `feedback-forms.js`, `logger.js`, `proteccion.js`, `server.js`, `suppress-warnings.js`, `video-playback-utils.js` y los módulos de datos (`*-aventuras.js`, `indice-aventuras.js`, `normativa-cumplimiento.js`, `traducciones-ui.js`).

### R2.7 Estado final de la ronda 2

| Familia | Entradas | Resultado |
|---|---|---|
| A — Configuración, constantes, umbrales | K-01 … K-05 | 4 confirmadas (K-01 a K-04) y 1 familia de copias; la config real se lee en 8 hojas de 46 |
| B — Un mismo hecho en dos sitios | K-06 … K-10 | 1 documentada (K-06), 1 por medir (K-07), 1 familia y 2 por estudiar |
| C — Heartbeat y mensajería | K-11 … K-16 | 2 confirmadas (K-11, K-12; la primera con tres puntos por medir), 1 familia, 2 documentadas, el mapa del bus limpio |
| D — GPS | K-17, K-18 | 1 confirmada (K-17), 1 familia |
| E — Sesión, abandono, caducidad | K-19 … K-21 | 1 confirmada con efecto por medir (K-19), 1 familia, 1 documentada |
| F — Cargas y esperas | K-22, K-23 | 1 familia, 1 confirmada (K-23, con guía y specs obsoletos) |
| G — Idioma y textos | K-24 … K-27 | 2 confirmadas (K-24, K-25), 2 familias |
| H — Copias y homónimos | K-28, K-29 | familias; los 26 homónimos clasificados |
| I — Recursos, SW, arnés, CSS, instrumentos | K-30 … K-34 | limpio con restos, 1 documentada, 1 por medir (K-32), 1 confirmada (K-34: los instrumentos del repo mienten en casos concretos) |
| J — Contrato del bus y constantes | K-35 … K-37 | 3 confirmadas: 8 envíos al vacío y 5 handlers sin emisión (K-35), 3 ramas muertas y claves sin pareja en la carga útil (K-36, con alcance por estudiar), 75 de 177 constantes sin lector (K-37) |
| K — Nombres de `globalThis` sin definidor | K-38, K-39 | 2 confirmadas: 17 nombres que ningún frame define (dos de las cuatro rutas de arranque del latido sin efecto, 15 puntos de contador sin función, siete limpiezas de `pagehide` sobre nombres inexistentes), un operando que solo define otro frame (`__vv_coordenadasAventura`), una llamada a un método retirado (`iniciarGPSAventura`, con el historial que lo demuestra) y un frame, `mapa-completo.html`, que no publica el logger |
| L — Estado escrito y no leído, registros que dicen más de lo que hacen | K-40, K-41 | 1 confirmada (K-40: el listener que dice "pausando operaciones" solo escribe una bandera sin lector) y 1 por estudiar (K-41: 12 filas de campos sin lector confirmadas con nombre desnudo, 15 por leer) |
| M — Lo que se publica y nadie usa | K-42 | 1 por estudiar: 27 exports muertos (12 ya tratados en otras entradas, 15 nuevos), 3 que solo usan specs, 25 exportados sin que nadie los pida y 5 `export default` sin importador |
| N — Identificadores con varios nombres | K-43 | 1 familia de copias: `paradaId`, `parada_id`, `padreId` y `padreid` en el mismo mensaje y dos resolutores (`resolverIdsParada` y lecturas a mano) |
| O — Recursos locales | K-44 | 1 confirmada: 491 referencias comprobadas contra el disco y una ruta que nunca existió (respaldo del puzzle de introducción) |
| P — Orden de llegada de los datos de un frame | K-45 | 1 confirmada (medida: M-15), con decisión abierta: el FAQ de hijo6 se construye dos veces al abrirse y la primera escribe un `error` aunque todo vaya bien |
| Q — Handlers que no hacen lo que su descripción dice | K-46, K-47, K-48 | 3 confirmadas: 15 handlers que solo escriben en el log (K-46), la clase del `body` de hijo2, que no sigue al modo (K-47, M-17), y el resalte de la parada activa de hijo5, que marca con una clase sin estilo y borra lo que marca el click (K-48, M-18) |

**Total tal como lo dejó el barrido: 44 entradas — 19 confirmadas, 2 por medir, 5 documentadas, 10
familias de copias, 4 por estudiar y 4 limpias o mixtas; 12 mediciones pendientes repartidas entre
ellas (R2.4).** Lo que más pesaba, sin ánimo de ordenarlo por urgencia: lo que cambia lo que ve el
usuario (K-24, K-25), lo que puede dejar un estado equivocado (K-07, K-11, K-19), lo que hace que una
configuración, una constante o un contador no mande ni cuente (K-01 a K-03, K-37, K-38) y las ramas del
contrato del bus que ningún emisor alcanza, algunas descritas por la guía como caminos vivos (K-35,
K-36, G-9 a G-11). **Tras la tanda de arreglos son 48 entradas** (K-45 a K-48 se encontraron al cerrar): se
hicieron las 17 mediciones posibles (M-8 es de campo), K-07 y K-32 dejan de estar «por medir», y el
resultado por entrada y las decisiones que siguen abiertas están en R2.8.

**Límites de esta ronda — qué no garantiza:**

- Los extractores ven JavaScript dentro de `<script>` sin `src` y en los `js/*.js`; no ven código
  en atributos `on*=` (revisados a mano, R2.3), ni en `eval`/`new Function` (búsqueda desnuda:
  ninguno), ni código generado en tiempo de ejecución por plantillas con `<script>`.
- Los recuentos de "sin lector" (`CONFIG`, campos de estado) son por ruta y por nombre dentro de
  los ficheros del repo; un acceso por clave computada (`obj[nombre]`) no se ve. Cada recuento
  citado se comprobó con una búsqueda desnuda del identificador (K-01, K-02, K-04, K-12, K-13).
- La lista de 49 rutas con ≥3 escritores (K-09), las 17 de K-08 y las 93 candidatas de K-25
  están **identificadas, no examinadas una a una**: son trabajo del estudio individual.
- El instrumento de destinos solo ve destinos literales; los dinámicos (`mensaje.origen`,
  variables) se dan por buenos. Los 5 tipos con emisor opaco del instrumento de carga útil se
  leyeron a mano (K-36); el de discriminadores solo analiza 31 comparaciones (K-36).
- El instrumento por frame resuelve nombres y propiedades de `globalThis` escritos con literal: un
  acceso por clave computada no se ve (una sola asignación computada en el código de la aplicación,
  `codigo-padre.html:14950`), ni las escrituras de código externo (MapLibre, Leaflet, page-flip). Un
  nombre cuenta como definido si alguna escritura del frame lo asigna, aunque sea después de usarlo o
  solo bajo una condición: el orden no se ha comprobado (las asignaciones de valor vacío se revisan
  aparte, tercer paso de K-38). El cierre de ficheros por frame es una
  sobreaproximación (incluye todo lo importable, también bajo condición), así que puede dejar pasar
  un nombre definido solo en una rama que ese frame no ejecuta.
- Los objetos-API se resuelven solo cuando su asignación a `globalThis` es un literal o un
  identificador que apunta a un literal de nivel superior; los miembros pedidos por un alias local
  (`const fm = globalThis.funcionesMapa; fm.x`) no se ven. El extractor de estado tampoco resuelve
  alias locales ni accesos con clave computada (20), y los specs no cuentan como lectores: un campo
  "sin lector" puede tener uno en un sitio que el extractor no sigue (K-41 lo marca como
  "por leer" cuando hay un ancestro leído entero).
- El instrumento de exports no ve los accesos por cadena (`obj['nombre']`) y cuenta como uso
  cualquier token igual en otro fichero: sobreaproxima el uso, así que lo que lista es ausencia casi
  segura, pero puede dejar fuera exports que solo usa un nombre homónimo.
- El barrido de recursos locales no resuelve los literales con `${…}` (16) ni mira los módulos de
  datos; el de i18n compara forma, marcadores y vacías, no la calidad ni la corrección de cada
  traducción (eso es trabajo de revisión nativa).
- Se ejecutaron 17 de las 18 mediciones de R2.4; M-8, el reintento de señal con el GPS en frío, es una
  prueba de campo y queda sin medir.
- `handlers-solo-log.cjs` cuenta como efecto cualquier llamada a una función que no sea de log, aunque esa función no haga nada (falso
  negativo), y como solo-log un handler cuyo único efecto es no estar registrado; lo que lista se confirma leyendo el handler (K-46).
- `guia-handlers-por-frame.cjs` compara por tipo y por frame los handlers y los mensajes del código con las filas de §26.12, §7 y §8;
  `guia-fichas-mensaje.cjs` compara la tabla de §10.7 celda por celda con los handlers y enseña las fichas de §10 junto al código, y
  `guia-payloads.cjs` compara las claves de las celdas de payload con las que mandan los emisores. Ninguno juzga el resto del contenido
  de las filas («qué hace»): eso se leyó a mano contra el handler de cada una (G-34 a G-43). Fuera de esos catálogos —las narrativas
  de §2, §4, §9, §25 y §31, por ejemplo— la deriva entre el texto de la guía y el código solo se barrió en lo que tocaron las
  correcciones.
- Un extractor que lee un export de `js/` se rompe en silencio cuando el export se retira: `extract-payload` y `extract-discriminadores`
  imprimían «tipos analizados: 0» desde que K-37 retiró `TIPOS_MENSAJE_VALIDOS` y nadie los volvió a ejecutar hasta G-43. Los extractores
  se vuelven a ejecutar contra `HEAD` cuando cambia lo que leen, y lo primero que hay que mirar es su recuento.
- `_hdl_SISTEMA_CAMBIO_MODO` se leyó entero en la pasada final (K-15); de `manejarCambioModo` solo se siguió la
  validación y la actualización optimista (`js/app.js:512-640`).
- Los extractores de la ronda están versionados en `tools/estudio-caminos/`; los specs desechables de
  medición no (R2.4): cada fila de R2.4 dice qué se hizo.

**Pendiente de decisión del usuario:** las decisiones abiertas de R2.8, cada una con sus opciones y
la recomendada. Lo demás de lo que esta ronda dejó para decidir —versionar los extractores en `tools/`,
corregir `verificar-frames.js` y `verificar-mensajeria.js` (K-34) y las discrepancias de R2.5— está
hecho; el estudio individual de cada entrada, con la lectura de R2.2 como punto de partida y el comando
pegado para repetir cada comprobación, es del usuario.

### R2.8 Tanda de arreglos y cierre (2026-10-02)

**Alcance y límite.** Con el OK del usuario («ok a todo, revisa y arregla» y, después, «la idea es dejar todo el estudio acabado, revisado, contrastado, verificado y documentado») se hicieron cuatro cosas: ejecutar las mediciones (R2.4), corregir los instrumentos del repo que mentían (K-34), corregir la guía y los comentarios de código donde contradecían al código (R2.5) y **retirar el código muerto una vez confirmado que lo era**, con su referencia en la guía y en los specs. No se aplicó nada que cambie lo que ve el usuario, que toque el contrato del bus sin una decisión previa (regla 1) o que sea una decisión de producto o de diseño: eso queda como decisión abierta, con sus opciones y una recomendada (tabla de más abajo).

**Cómo se comprobó cada cosa** (CLAUDE.md). Para borrar: búsqueda desnuda del nombre en todo el repo (la guía y los specs incluidos), lectura del llamador, `typeof` o medición en la app real cuando se podía y, para los tipos de mensaje, el historial (`git log -G`). Los parches se escribieron en disco, con un ancla que tiene que aparecer exactamente una vez y comprobación del texto resultante. Después de cada tanda: `npm run lint` limpio y los specs que tocan lo cambiado en chromium; la guía en presente y sin fechas, con las tres comprobaciones a 0, `node tools/verificar-citas-guia.js --check` en verde y §37.2 regenerada; un commit por tanda coherente, añadido por nombre y sin `push`; y nada más corriendo mientras corría Playwright (regla 5). Varias veces la medición contradijo a la lectura estática y ganó la medición (regla 6): el PB-2 del spec 38 y el MC-7a del spec 09 «no podían fallar», y el OB-3 del spec 71 tenía una carrera que no era del código sino del test.

**Los commits** (locales, sin `push`; del más antiguo al más reciente):

| Commit | Qué hace | Entradas y discrepancias |
|---|---|---|
| `cf4b973` | `retryUntilAvailable`, `mensajeriaReady` y el recuento de once frames en la guía; `CLAUDE.md` regla 3b | G-1, G-2, G-8, G-17 |
| `0e115d4` | `verificar-mensajeria`, `verificar-frames` y `codigo-muerto` leen con parser; guía regenerada (§37.3) | K-34 |
| `2ed1658` | latido y `pagehide` sin las rutas que no hacían nada | K-11, K-38, G-14, G-15 |
| `8806429` | telemetría que no contaba (`incrementarContador`) y operandos `\|\|` que nadie asigna | K-38 |
| `8daa6db` | contrato del bus sin mensajes que nadie recibe ni ramas que ningún emisor alcanza | K-35, K-36, G-10, G-11 |
| `b6affee` | `retryUntilAvailable` con una sola convención; el PB-2 del spec 38 deja de ser vacuo | K-23, K-32, G-1 |
| `e3bab74` | `constants.js` sin lo que ningún fichero lee | K-37, G-12 |
| `1e5bbf3` | dos citas de línea de `constants.js` que la limpieza dejó fuera de rango | guía |
| `5c52038` | spec 71: OB-3 y OB-1 esperan el estado del padre en hijo6 | K-45 (origen) |
| `218c0ae` | state-manager, mensajería, utils y `app.js` sin código que nadie llama; guía del state-manager y de monitoreo | K-07, K-12, K-13, K-42, G-19, G-20, G-21, G-27 |
| `6c152ab` | siete lecturas de `globalThis.Config` pasan a ser el literal que ya aplicaban | K-01 |
| `cf1d484` | `inicializarServicioMapa` sin la rama que crea un mapa propio | K-03 |
| `545323b` | `mapa-completo.html` publica el logger; el respaldo del puzzle de introducción apunta a la imagen real | K-39, K-44, G-16 |
| `24ec574` | 11 globals de ESLint que no existen dejan de silenciar `no-undef` | K-34 |
| `01eeb47` | `config.js` y `monitoreo.js` sin lo que publican y nadie lee | K-02, K-42 |
| `0fe5b3f` | cuatro globals que el código publicaba y nadie leía | K-38 |
| `f6ab460` | `getPadreId`, `resolverIdPadre`, `notificarError` y `obtenerEstadoMonitoreo` fuera; la guía deja de describir un autoenvío que no existe | K-28, K-01, K-42, K-04, G-22, G-25 |
| `c7c7b1a` | «Vuelta rápida → Elegir otra aventura» reinicia el modo de cámara como «Elegir otra» | K-19, G-6, G-23, G-24 |
| `6538bba` | guía y comentarios contrastados: `CLOSE_MENUS`, `CONTROL.*`, `adelantarLatido`, `device-detection`, `registrarMetrica` | G-3, G-4, G-7, G-9, G-13, G-18, G-26 |
| `8452f8d` | spec 09: MC-7a mide el latido real | K-32 |
| `a4644e5` | `PADRE_DATOS` se lee solo por las claves que el padre manda; la guía deja de describir un ACK y unos payloads que no existen | K-36, G-28 (M-14) |
| `dae5bf2` | la URL del puzzle de P6 sin `aventura` ni `noOverlay` | K-36, G-29 |
| `94007e9` | guía: restos de la mensajería anterior al bus único y claves de `PADRE_DATOS` de hijo6 | G-30, G-31, G-32 |
| `3d41dd6` | los extractores de la ronda pasan a `tools/estudio-caminos/` (rutas relativas, salida fuera del repo, README con las cifras sobre `ffe9bfc`); la guía (§18.2 y el árbol de §20) y `docs/README.md` los listan, y también este documento | K-34, G-33 |
| `6df2800` | el cierre de la ronda en este documento: notas «Estado final» por entrada, K-45, M-14 y M-15, G-28 a G-33, el censo tras la tanda y R2.8 | todas |
| `e3a9cff` | el padre sin el handler de `SISTEMA.HEARTBEAT` que ningún emisor alcanzaba (con su spec); `verificar-mensajeria` modela el broadcast desde el emisor real; dos extractores nuevos | K-35, K-34 (M-16) |
| `c40ecd0` | guía: el catálogo del padre (§8.3, §26.12.1, §26.12.2) contrastado con el código; el padre sin `SISTEMA.HEARTBEAT`; columnas y citas de línea desfasadas; los rangos de los scripts en `CLAUDE.md` | G-34 a G-40 |
| `f151ca3` | guía: §26.12.3 a §26.12.9 contrastadas con el código y §26.12.10 para los tres nietos; correcciones de §7.1, §7.2, §7.3 y §2.9 | G-41, G-42 (M-17) |
| `9f533f9` | `guia-handlers-por-frame` reconoce los tipos sin categoría (`NAVEGAR_PANTALLA`) | G-36 (instrumento) |
| `724a4da` | este documento al día: K-46 y K-47, M-16 y M-17, E9 y G-34 a G-42 | todas |
| `70ec0a5` | guía: §37.3 regenerada tras retirar el handler de `SISTEMA.HEARTBEAT` del padre | K-35 |
| `4ff98d5` | guía: fichas de §10, tablas de §7 y §8 y tabla 10.7 contrastadas con el código | G-43 (M-18) |
| `524669d` | `guia-fichas-mensaje` y `guia-payloads`; `guia-handlers-por-frame` mira también §7 y §8; `extract-payload` y `extract-discriminadores` sin `TIPOS_MENSAJE_VALIDOS` | K-34, G-43 |

**Resultado por entrada.**

| Resultado | Entradas |
|---|---|
| Corregidas y cerradas | K-01, K-03, K-13, K-23, K-32, K-34, K-36, K-38, K-39, K-44 |
| Corregidas, con una decisión abierta al lado | K-02, K-04, K-07, K-11, K-12, K-19, K-28, K-35, K-37, K-42 |
| Medidas, con decisión abierta y sin código tocado | K-17, K-20, K-24, K-25, K-40, K-41, K-43, K-45, K-46, K-47, K-48 |
| Documentadas, sin cambios (copias, intencional, limpio) | K-05, K-06, K-08, K-09, K-10, K-14, K-15, K-16, K-18, K-21, K-22, K-26, K-27, K-29, K-30, K-31, K-33 |

**Decisiones abiertas — para el estudio individual del usuario.** Cada una tiene su nota «Estado final» en R2.2, con la comprobación pegada. «Cambia lo que ve el usuario» dice si la opción recomendada se nota en la pantalla; las que sí se notan son las que no se han tocado a propósito.

| Entrada | Pregunta | Opciones (la recomendada, en negrita) | ¿Cambia lo que ve el usuario? |
|---|---|---|---|
| K-02 | ¿Qué se hace con las 38 hojas de `CONFIG` sin lector? | **A) vaciar lo que no se lee**; B) adoptarlo y sustituir los literales | no |
| K-04 | ¿Se queda el monitoreo? | **A) retirarlo entero** (módulo, tres juegos de umbrales, historial y contador duplicado); B) conservarlo con un lector y una sola configuración | no |
| K-07 | `crearPromiseHijoListo` resuelve al instante tras `SELECCION.REINICIAR` | **A) `olvidarHijoListo(id)` en el state-manager**; B) dejarlo (lo compensa `__pendingDistribucion`) | no |
| K-11 | «Volver a la pestaña» no respeta la pausa del latido | **A) llamar a `adelantarLatido()`**; B) retirarla con su BC-12c | solo en CASA y solo en el tráfico de fondo |
| K-12 | `warn` en el arranque nominal de diez frames | **A) emitirlo solo en el padre**; B) bajarlo a `debug` | no (log) |
| K-17 | seis maneras de pedir una posición puntual | A) una función con el plazo como parámetro; **B) dejarlo hasta tener la prueba de campo M-8** | no |
| K-19 | dos cuerpos casi iguales de «abandonar la aventura» | **A) función común**; B) comentario cruzado | no |
| K-20 | la rama «sin modal» deja tres claves vivas | **A) llamar a `limpiarDatosAventura('timeout')`**; B) dejarla (riesgo medido casi nulo) | no |
| K-24 | idioma de los textos propios de hijo4 | **A) `RETO.MOSTRAR` con `idioma`**; B) `PADRE_DATOS` con `idioma`; C) leer `parent` (descartada) | **sí** (placeholder y aviso en el idioma elegido) |
| K-25 | textos de usuario fuera de `traducciones-ui.js` | **A) los tres `alert()` de hijo4 y los mensajes de fallo de la selección**; B) además la accesibilidad; C) además las páginas estáticas | **sí** |
| K-28 | familias de copias | A) extraer `enviarHijoListoConReintento`; **B) dejarlas salvo que se toque el algoritmo** | no |
| K-35 (1) | `AVENTURA.FINALIZADA` en el padre | **A) retirar el handler** y registrarlo cuando exista el flujo de fin de aventura; B) dejarlo | no |
| K-35 (2) | `UI.CLOSE_MENUS` padre → hijo1 | **A) retirar el handler de hijo1 y la exención `except`**; B) conectar el sentido que falta | A no; B sí |
| K-37 | literales `'casa'`/`'aventura'` y `destino: 'padre'` | **A) dejarlos**; B) importar `MODOS` en los hijos | no |
| K-40 | camino 3 de `offline`/`online` | **A) retirarlo**; B) darle cuerpo (¿qué se pausa?) | A no; B sí |
| K-41 | siete campos candidatos a retirar | retirarlos en una sola tanda, con sus frases de la guía, **después de decidir K-04, K-07 y K-40** | no |
| K-42 | cadena `gpsPendientes` y 19 exports de uso interno | **A) retirar la cadena**; B) conectar un productor | no |
| K-43 | cuatro nombres para el id de parada | A) un nombre y un resolutor; **B) dejarlo y hacer A al tocar el contrato de `CAMBIO_PARADA`** | no |
| K-45 | `error` en el camino normal de hijo6 | A) no construir el FAQ hasta tener el estado (descartada); **B) `debug` hasta el primer estado**; C) actualizar solo lo que cambia | no (log) |
| K-46 | handlers que solo escriben en el log | **A) dejar, documentados, `CAMBIO_MODO_APLICADO`, `SISTEMA.ERROR`, `SISTEMA.NACK`, `SISTEMA.NOTIFICACION` y `CODIGO_VALIDADO`**; **B) retirar `RETO.MOSTRADO` → `RETO.CONFIRMADO` y `DATOS.TEXTOS_CARGADOS`**; C) retirar la 4.ª fase del modo entera | no |
| K-47 | clase del `body` de hijo2 | A) escribirla también al cambiar de modo; **B) retirar la regla y la clase de hijo2** | A sí (el botón de avanzar activo pulsa en AVENTURA); B no |
| K-48 | resalte de la parada activa en hijo5 | **A) una sola función que marque `actual`, llamada por el click, la generación y los dos handlers**; B) dejar solo el click y la generación y retirar los dos handlers de marcado; C) dejarlo | A y B sí, solo en la herramienta de desarrollo (hijo5); C no |

**Límites residuales** (los de R2.7 siguen valiendo). M-8 es de campo y no se midió. M-14 a M-18 se midieron en chromium con el stub de MapLibre y recorren el arranque, la apertura del asistente y los cambios de modo, no todos los flujos de la aventura; que `PADRE_DATOS` tiene solo dos emisores lo dice la búsqueda desnuda, no la medición. El efecto de K-24 con una aventura no española en vivo no se midió: se deduce de las tres líneas de código. Cada borrado se apoya en búsqueda desnuda y lectura del llamador; un acceso por clave computada (`obj['nombre']`) no lo ve ninguna de las dos (límite del instrumento de exports, K-42). Los verificadores corregidos en K-34 imprimen su residuo, pero siguen siendo análisis estático.
