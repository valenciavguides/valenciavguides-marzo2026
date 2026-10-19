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
nota fechada en cada sección afectada), corrige dos de la propia ronda (E8 y E9) y añade 49 entradas (K-01 a K-49) para su estudio
individual. Léase junto con ella: lo que aquí se dio por cerrado o limpio puede no estarlo. R2.9 (2026-10-03) revisa las decisiones abiertas de R2.8 con otro método y otros ángulos, corrige varias entradas con una nota fechada en ellas y añade cinco más (K-50 a K-54, familia S).
R2.12 (2026-10-07) vuelve a contrastar el estudio entero con el código: corrige una frase de R2.3 (E10) y tres entradas (K-57, K-54 y el cierre de K-01 y K-02) y añade once (K-62 a K-72, familia T).
R2.13 (2026-10-12) registra el recorrido real con espía (EJE 28) del 2026-10-07 y del 2026-10-12 y su relectura contra el código: corrige el cierre del candidato `LLEGADA_DETECTADA` (K-06), añade diez entradas (K-73 a K-82, familia U) y, al contrastar con el código las últimas frases de la guía, otras dos (K-83 y K-84, familia V); el arreglo de K-82, el 2026-10-13, deja cuatro entradas más al mirar el mismo error en los otros hijos (K-85 a K-89, familia W; K-85 y K-87 medidas, M-23 y M-24), y mide lo que K-61 y la revisión de K-07 dejaban sin medir.
R2.20 (2026-10-14) recoge la tarde de ese día y **la lista de lo que queda para poder retirar este documento**. R2.19 (2026-10-14) recoge las decisiones del usuario de esa mañana. R2.18 (2026-10-14) recoge lo aplicado y lo medido esa misma madrugada al seguir con lo pendiente (K-69, K-99, K-104; K-100, K-101 y K-105 medidas). R2.17 (2026-10-14) recoge la segunda confirmación de aventura de la selección, con K-95 a K-103 (familia AA). **Ojo con los números de pantalla:** desde ese día la selección tiene 18 pantallas, y lo que las entradas anteriores llaman P13 a P17 (código, normativa, reto 2, logos y agradecimientos) son hoy P14 a P18; `SELECCION.P14_MOSTRADA`, `_iframesPreCargadosP14` y `_codigoValidadoP13` se llaman hoy `SELECCION.P15_MOSTRADA`, `_iframesPreCargadosP15` y `_codigoValidadoP14`. Las entradas viejas no se han reescrito. R2.14, R2.15 y R2.16 (2026-10-13) resumen las tres tandas de ese día —la noche, el día y la tarde—: lo aplicado, lo medido, lo preparado sin aplicar y lo que queda por decidir, con cinco entradas más (K-90 y K-91, familia W; K-92, familia X; K-93, familia Y; K-94, familia Z: el calor de iphone12, que encontró el usuario).

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
  >
  > **Reabierto en R2.13, por medición:** lo de «idempotente» no se sostiene. Al cerrar un tramo, el segundo
  > aviso de llegada (el de hijo2) vuelve a crear la ficha del tramo ya cerrado (K-73), y los dos sensores no son
  > independientes: hijo2 decide sobre la distancia y el id que le manda `funciones-mapa.js`, y avisa siempre después (K-74).
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
| guía frente a código: nombres citados | las funciones, handlers y globals propios que la guía cita entre backticks, buscados como token en los ficheros rastreados con código (`guia-nombres-citados.cjs`, añadido al cerrar la tanda; `ESTUDIO_GUIA` apunta a otra copia de la guía) | contra la guía anterior a G-44: 40 candidatos, 7 referencias a algo que no existe; contra la actual, 33, todos explicados (frases que dicen que el nombre no existe, nombres del arnés de tests o de `tools/`, patrones como `mostrarCartelXXX`) (G-44) |
| comentarios frente a código: nombres citados | los identificadores que citan los comentarios de JavaScript de las páginas, de `js/*.js` y de `sw.js` (camelCase, `_nombre`, `nombre()` y las constantes con puntos de `TIPOS_MENSAJE`, por su último segmento), buscados como token en el código sin comentarios de esos ficheros y de los specs (`comentarios-nombres-citados.cjs`, añadido al cerrar la tanda; validado con un comentario inyectado que cita dos nombres inventados y uno que existe: lista los dos primeros y no el tercero) | 6781 comentarios de 38 ficheros, 0 bloques sin parsear; 44 candidatos, triados uno a uno: 5 daban por vivo algo que no existe (G-45) y 39 no son erratas —cuentan lo que se retiró, que es el «porqué» que vive en los comentarios, o son nombres de APIs externas, patrones o ejemplos—; tras G-45, 39 |
| guía: narración de cambios | las frases de la guía que cuentan un cambio en vez de describir lo que hay: «ya no», «antes … ahora», «se retiró», «se arregló», imperfectos de incidente, «reporte de campo», fechas y enlaces a la memoria privada (`guia-narracion.cjs`, añadido al cerrar la tanda; **busca por patrón, no con `acorn`**: lista candidatos de una familia dura y una blanda, y que una frase no salga no prueba que no cuente un cambio). `--autoprueba` son 36 casos, unos que deben casar y otros que no (con el `\b` crudo de JavaScript falla 10: no es frontera tras una vocal acentuada seguida de espacio, y «se retiró», «se eliminó», «se añadió» y «se arregló» no salían nunca); `--solo-duras` y `--desde=REF` | contra la guía anterior a G-47: 122 líneas de la familia dura y 385 con la blanda; contra la actual, 28 y 220. Las 28 duras, leídas una a una, son mecanismo, flujo o metodología (la «retirada» de la CSP del servidor de desarrollo, el campo `{ suprimido }`, «hasta entonces»…); de las blandas se leyeron los 65 imperfectos, los 62 pretéritos «se …ó», los 54 «antes» sin «de», los 15 «ahora» y las 12 continuidades (G-47) |

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
- **E10 — R2.3: «Polling: un solo camino» solo vale para el helper.** Los llamadores de `retryUntilAvailable` (seis hoy) comparten
  helper, pero el código tiene además doce bucles `while` que sondean hasta que algo exista o llegue (K-62), una promesa sin plazo
  para la misma espera que dos de ellos (K-72) y dos esperas de «padre listo» que no esperaban nada (K-63, retiradas). R2.10 cuenta
  seis de esos bucles entre las formas de «esperas y plazos». Método: censo de `while (` en el código de producción y lectura de
  cada línea (R2.12).

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

- **Revisión (2026-10-03, R2.9).** Recuento repetido con búsqueda desnuda de `CONFIG`, `CONFIG_S1` y `__vv_config`, incluidas las formas `CONFIG?.` y `__vv_config?.` que el patrón `CONFIG\.` no ve: las mismas 8 hojas con lector; las líneas que cita la entrada han derivado (unas 65 en el padre). Tres cosas que la entrada no dice. (1) `MONITOREO.INTERVALO_METRICAS` solo tiene lector mientras exista `js/monitoreo.js`: con K-04 = A quedan 7 hojas y el bloque `MONITOREO` entero sobra; K-04 antes que K-02 evita tocar `config.js` dos veces. (2) `AUDIO.VOLUMEN_DEFECTO: 0.8` (sin lector) contradice la política de volumen de la app, que entrega siempre el máximo: la opción A lo retira y la B tendría que cablearlo a 1. (3) La tabla «Configuración del GPS» de la guía presenta seis parámetros (`ALTA_PRECISION`, `TIMEOUT`, `MAX_EDAD_CACHE`, `INTERVALO_ACTUALIZACION`, `DISTANCIA_MINIMA`, `MUESTRAS_PROMEDIO`) sin decir que ningún código los lee; solo marca `RADIO_PROXIMIDAD`, `RADIO_EXTENDIDO` y `PRECISION_MINIMA`, y otras secciones sí lo dicen de `DISTANCIA_MINIMA` (L9792, L10504). Los specs que leen `__vv_config` (59 NL-5, 60 NH-2 y 20) usan solo `DEBUG.NIVEL_LOG` y `MENSAJERIA.TIMEOUTS.CONFIRMACION`, que se conservan.

- **K-04 A retiró `CONFIG.MONITOREO` (2026-10-04).** El grupo entero (`METRICAS_HABILITADAS`, `INTERVALO_METRICAS`, `UMBRAL_MEMORIA`, `UMBRAL_MENSAJES_PENDIENTES`) ya no existe en `js/config.js`: de las 8 hojas con lector desaparece la que lo era por `monitoreo.js` (`INTERVALO_METRICAS`), así que quedan 7, como esta entrada preveía.

- **Aplicada la opción A (2026-10-04).** `js/config.js` pasa de 161 a 65 líneas y conserva las 7 hojas con lector: `DEBUG.NIVEL_LOG`, `MENSAJERIA.TIMEOUTS.CONFIRMACION`, `GPS.PRECISION_MINIMA`, `MAPA.ZOOM_INICIAL`, `MAPA.ZOOM_MAX` y `MAPA.CENTRO_DEFECTO` (`.lat` y `.lng`). Se retiran `VERSION`, `BUILD_DATE`, el resto de `DEBUG`, los nueve parámetros planos de `MENSAJERIA` y sus alias `TIMEOUTS.EXTENDIDO` y `RAPIDO`, ocho de las nueve hojas de `GPS`, el grupo `AUDIO` entero (con el `VOLUMEN_DEFECTO: 0.8` que contradecía la política de volumen) y cuatro de `MAPA`. La publicación `globalThis.__vv_config` no se toca.
  **Comprobado.** *Estático:* todas las apariciones de `CONFIG`, `CONFIG_S1` y `__vv_config` en HTML y JS fuera de `config.js` (la lista entera, no un patrón por ruta; ninguna usa `CONFIG[…]`, desestructuración ni propagación) y la búsqueda desnuda de cada nombre retirado en todo el repositorio: ninguno se lee (`MAX_REINTENTOS` e `INTERVALO_REINTENTO` aparecen solo como constantes locales de otros ficheros). *En ejecución:* se sirvió `js/config.js` envuelto en un `Proxy` que anota cada lectura y se pasaron 12 specs de GPS, cambio de modo y mapa (80 tests, todos en verde), antes y después: las lecturas son las mismas en los dos y todas caen dentro de las 7 hojas (`NIVEL_LOG`, `TIMEOUTS.CONFIRMACION`, `ZOOM_INICIAL`, `ZOOM_MAX` y `CENTRO_DEFECTO`, que se lee como objeto y se enumera; las lecturas de `lon` y `toJSON` sobre él no son claves). `PRECISION_MINIMA` la lee hijo2 solo ante una lectura GPS, que esos 12 specs no provocan; los de regresión que sí la provocan (17 specs, 90 tests) pasan.
  **La guía** deja de atribuir al GPS valores que `config.js` no gobierna: la tabla de `CONFIG.GPS` queda con `PRECISION_MINIMA` y una frase que dice dónde viven los demás; salen las filas de `RADIO_EXTENDIDO`, `RADIO_PROXIMIDAD`, `DISTANCIA_MINIMA`, «Frecuencia actualización GPS 7 s» y «Timeout GPS 30 s» (en el código no hay ningún intervalo de 7 s ni nadie lee el timeout de `CONFIG`), y el timeout del reintento del watch pasa a lo que el código hace de verdad —15 s × 2^(intento−1) con techo de 60 s, literales de `_gpsDoRetrySetup()`—, no `CONFIG.GPS.TIMEOUT` × 2^(intento−1) (30 s de base), que era falso. Recuento de §29.1 y árbol de ficheros al día.
  Sin spec nuevo: no cambia ningún comportamiento (las hojas retiradas no se leían) y el instrumento que lo demuestra es el de lectura por `Proxy`. **K-03** queda como estaba: de «dónde arranca el mapa» siguen vivas las tres hojas que lee `funciones-mapa.js`; la decisión de centralizar o no esas lecturas sigue abierta.

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

- **Corrección (2026-10-03, R2.9).** El radio de la opción A es mayor que el que dice esta entrada, y una afirmación suya es falsa. Leído en el código y comprobado con búsqueda desnuda y con la clausura de imports de cada frame:
  1. *Falsa:* «`monitoreo.js` se carga … en hijo1 y hijo5: en esos dos un mismo error activa los dos caminos». `inicializarMonitoreo` solo la llama el padre (`codigo-padre.html:4057`) y los listeners de `error` y `unhandledrejection` se registran dentro de ella: en hijo1 (`extrainfo-hijo1.html:26`) e hijo5 (`boton-casa-hijo5.html:25`) el módulo se carga y queda inerte, sin intervalo ni listeners. Ahí solo actúa el camino de `utils.js`.
  2. `registrarEvento` (`codigo-padre.html:5277`) no es solo monitoreo: es el log de 13 puntos de llamada (11 en el padre, 6 de ellos sin guarda —`:7349`, `:7944` y las cuatro de `registrarEventoScript2`— y 2 en `app.js`). Una de esas cuatro, `AUDIO_ERROR` (`:12660`), va antes de `_marcarAudioNoDisponible` y del overlay de no-internet: si la función desapareciera, el `catch` de `_hdl_AUDIO_ERROR` (`:12681`) se tragaría el `TypeError` y se perdería la vía de rescate «saltar audio» (spec 44 BSA-D). La opción A solo es segura leída como «retirar el historial y las métricas y dejar `registrarEvento` como logger».
  3. El `Promise.all` de la Fase 1 del padre (`:3777-3809`) se destructura por posición, con siete huecos: quitar el `import('./js/monitoreo.js')` exige quitar su hueco a la vez.
  4. Quitar el módulo quita también `js/config.js` de hijo1 e hijo5, que solo lo cargan a través de él (el padre solo pierde `monitoreo.js`): `__vv_config` pasa a leerse del padre con el mismo valor (`NIVEL_LOG = debug`), sin efecto observable, y el comentario de `js/logger.js:108-113` («solo `coordenadas-hijo2.html` importa `config.js`») pasa de falso a cierto. Los specs 59 y 60 siguen en verde: el NH-2 cae al `__vv_config` del padre.
  5. Superficie que la entrada no nombra: `js/app.js` (el import de `promesasPendientes` y `registrarMetrica`; `limpiarPromesasPendientes` y su intervalo de 30 s sobre un `Map` que nadie llena —búsqueda desnuda de `promesasPendientes`: solo `app.js` y `monitoreo.js`—; el re-export, `globalThis.registrarMetrica`, el intervalo de memoria y las métricas de `load`; el `pagehide`), el tipo del bus `MONITOREO.METRICA` (`js/constants.js:129`, regla 1) con su handler del padre (`:12786-12807`) y su único emisor, hijo2 (`coordenadas-hijo2.html:2219`, dentro del handler de `NAVEGACION.GPS.ERROR`), `sw.js:54` (`APP_SHELL`, de 61 a 60 entradas), seis herramientas de `tools/estudio-caminos/` que listan `js/monitoreo.js`, `eslint.config.js:148`, `tests/test_registrarMetrica.js` (nada lo ejecuta ni lo referencia) y las secciones de la guía que citan el módulo (§26.4 y otras).
  6. `estado.monitoreo.metricas.errores` se inicializa como `[]` (`:4216`) y `_hdl_AUDIO_ERROR` lo incrementa como número (`:12669`): tipo incoherente, sin lector.
  Orden: K-04 antes que K-02 (`CONFIG.MONITOREO`) y que K-41 (`estado.monitoreo.metricas` y `.errores`).

- **Aplicada la opción A (2026-10-04).** Retirados: `js/monitoreo.js` (con `__vv_monitoreo`, el intervalo de 30 s y los listeners de `error` y `unhandledrejection` que el padre registraba a través de él), `tests/test_registrarMetrica.js` (nada lo ejecutaba ni lo citaba), el tipo `MONITOREO.METRICA` de `js/constants.js` (regla 1: lo cubre el «arreglemos de menos a mayor complejidad» del usuario) con su handler del padre y su único emisor, el de hijo2 en `NAVEGACION.GPS.ERROR` (que sigue dejando el error en el log), los tres juegos de umbrales (`estado.monitoreo` del padre, `monitoreo` del state-manager y `CONFIG.MONITOREO`), el historial de eventos de `registrarEvento` (el del padre y el de `app.js` quedan como logger y solo escriben la línea), el contador `estado.monitoreo.metricas.errores++` de `_hdl_AUDIO_ERROR`, las dos métricas `hijo5.applyStyling` del padre y, en `js/app.js`, el import, `limpiarPromesasPendientes` con su intervalo, el re-export y el global `registrarMetrica`, el intervalo de memoria (`__vv_intervaloMemoria`), las dos métricas del listener de `load` y las limpiezas de promesas y de `registrarMetrica` del `pagehide`. `sw.js` pasa de 61 a 60 entradas de `APP_SHELL`; hijo1 e hijo5 dejan de cargar `monitoreo.js` y con él `config.js`; seis herramientas de `tools/estudio-caminos/` dejan de listar el módulo; se corrigen los comentarios que lo citaban (`js/utils.js`, `js/device-detection.js`, el docblock del `HEARTBEAT` de hijo1 y de hijo2, los specs 58 y 78) y la guía (§26.4 pasa a describir `registrarEvento`; recuento de tipos 94 a 93; filas, fichas y tablas del tipo retirado).
  **Medido, antes y después, con la misma sonda** (padre real con sus hijos y hijo2 en marco vacío; el «antes» sobre el código sin tocar): el conjunto de avisos de consola es idéntico (los mismos 20 avisos, por fichero y por texto), sin `pageerror` ni respuestas ≥ 400, y `registrarEvento` sigue escribiendo su línea en el nivel pedido. Desaparecen las siete líneas de `[monitoreo]` y de `MONITOREO.METRICA` (incluida `Métricas recolectadas`, la del intervalo de 30 s, medida tras una espera real de 32 s), el mensaje `MONITOREO.METRICA` que hijo2 mandaba al recibir `GPS.ERROR`, `registrarMetrica`, `__vv_monitoreo`, `__vv_intervaloMemoria`, `estado.monitoreo`, el controlador y el tipo; hijo1 e hijo5 ya no cargan `monitoreo.js` ni `config.js`.
  **Cambia, sin que el usuario lo vea:** hijo1 e hijo5 pasan a obedecer el nivel de log del padre. Antes cada uno tenía su propio `__vv_config` y, con el padre en `NONE`, seguían en `debug`; ahora devuelven `NONE`, como selección, hijo3 y hijo4. **Spec nuevo:** NH-4 en el spec 60 (4 tests). **Rojo antes de verde:** sirviendo hijo1 e hijo5 con `config.js` cargado —lo que hacía el módulo—, NH-4 cae por hijo1 («COPIA PROPIA, ignora»); con el código actual pasa.
  **El riesgo que R2.9 (punto 2) nombraba, comprobado:** sirviendo el padre sin `globalThis.registrarEvento`, el BSA-D del spec 44 cae; con el padre intacto pasan los dos. El spec protege la vía de rescate de `AUDIO_ERROR` y el cambio la conserva.
  **Herramientas contra HEAD:** `verificar-mensajeria` pasa de 94 a 93 tipos, de 242 a 241 emisores y de 142 a 141 receptores, y el residuo de 4 a 3, sin ninguna sección nueva; `codigo-muerto` solo pierde `getEstadoMonitoreo`; `verificar-frames` baja de 3 a 1 los sitios del padre que tocan otro frame (las dos métricas que leían `globalThis.parent.registrarMetrica`); la guía contra el código da 59 handlers del padre en los dos lados y 23 tipos emitidos por hijo2 en los dos. `npm run lint` sale con 0; 365 tests de 61 specs (los que citan los conceptos tocados) en verde en chromium.
  **Fuera del plan, sin tocar:** K-55 (dos eventos de arranque que nunca se registran: `app_inicializada` y `pagina_cargada`), K-56 (el nivel de log llega por dos caminos: hijo2 tiene su propia copia de `CONFIG`), la fila de Script 4 de la guía (decía que registra `monitoreo.js` y `utils.js` y que arranca el heartbeat; ninguna de las tres cosas es cierta, y ahora dice lo que hace: registra los controladores de `app.js` y define `diagnosticarGPS`), un U+FFFD que ya había en `codigo-padre.html:3769` (el emoji de «Cargando 9 módulos en paralelo»; la Fase 1 carga 10 módulos y el texto dice 9) y el comentario de Script 2 (`codigo-padre.html:9694`) que dice que `app.js` asigna `globalThis.registrarEvento`, cosa que `app.js` no hace.

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
- **Medido en R2.13.** La idempotencia no se sostiene al cerrar un tramo: la segunda llegada vuelve a crear la
  ficha del tramo ya cerrado (K-73). Y el sensor de `funciones-mapa.js` es el que llega primero; el de hijo2 decide sobre lo
  que ese le manda (K-74).

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

- **Revisión (2026-10-03, R2.9).** Orden real de la ruta fallback (`codigo-padre.html:13132-13146`): `_normalizarSetHijos`, después `Promise.all(_cargarSoloIframeActivacion)` y después `_esperarHijosCargados`, cuyo `catch` solo escribe el error y no aborta la activación. Con A la espera pasa de 0 ms a lo que tarden los cinco `HIJO_LISTO` nuevos (unos 100 ms en M-4). Si un hijo no avisara, la promesa del state-manager rechazaría a los 30 s; los cinco que se recargan (hijo1-opciones, hijo2, hijo3, hijo4 e hijo5) mandan `HIJO_PREPARADO` y `HIJO_LISTO` sin condición de modo (leído en los cinco ficheros), así que ese caso no se da. Si el `HIJO_LISTO` llega antes que `crearPromiseHijoListo`, `marcarHijoListo` lo anota y la promesa resuelve al instante: no hay interbloqueo por orden. De los otros consumidores de `crearPromiseHijoListo`, `_esperarHijosCriticosRest` es de la restauración y no pasa por esta ruta, `_gpsEsperarHijosListos` y `esperarHijosListos` llevan su propia carrera con plazo, y `_esperarHijoListo` espera un `HIJO_LISTO` tras una recarga, que es lo correcto. **Ningún spec recorre esa ruta de punta a punta** (los 04, 05, 106, 12, 36, 74 y 98 la rozan; M-4 fue una medición): para A hace falta un spec previo, rojo hoy porque resuelve en 0 ms.

- **Aplicada la opción A (2026-10-05).** `js/state-manager.js` exporta `olvidarHijoListo(hijoId)` —el inverso de `marcarHijoListo`: quita al id del conjunto del state-manager— y la expone en `__stateManager` y `__vv_stateManager`; `_normalizarSetHijos` (`codigo-padre.html`) la llama con cada id que vacía de su propio conjunto, con la misma guarda `typeof` que los demás llamadores de ese objeto. **Radio comprobado con búsqueda desnuda:** `_normalizarSetHijos` solo se llama en la ruta fallback (`:13076`, dentro del `else` de `_iframesPreCargadosP14`) y es el único sitio donde el padre vacía su conjunto; `_reconectarHijoIndividual` solo se llama desde `intentarReconectarHijosFallidos`, que solo se llama desde `cargarIframeSoloSeleccion` (la carga de la selección), y no pasa por `_normalizarSetHijos`, así que no cambia; el único lector de `state.estadoPadre.hijosInicializados` en producción es `crearPromiseHijoListo` (`getEstadoPadre` no tiene llamadores y `getEstado()` solo lo devuelve en el diagnóstico). La guía describe la función, la ruta y el spec; en §9.5 la frase «solo se llama en la ruta normal» pasa a decir la ruta fallback, que es la única que llama a `_normalizarSetHijos` y a `_esperarHijosCargados`.
  **Spec nuevo 121** (3 tests; la ficha decía que ningún spec recorría esa ruta de punta a punta). HL-1 envuelve `crearPromiseHijoListo` y `marcarHijoListo` en el padre real, activa la aventura por la ruta fallback (lo que deja `SELECCION.REINICIAR`) y exige que cada una de las cinco esperas resuelva cuando llega el `HIJO_LISTO` nuevo de su hijo y no antes; HL-2 es el control (llega de verdad uno nuevo de cada uno de los cinco, así que HL-1 no es vacío); HL-3 prueba la función en el state-manager. **Rojo antes de verde:** con el código anterior HL-1 cae («hijo1-opciones: la espera resolvió a los 76 ms y su HIJO_LISTO nuevo llegó a los 87 ms»), HL-3 cae (no existe la función) y HL-2 pasa; con el cambio pasan los tres.
  **Medido, ruta entera, antes y después sobre el mismo árbol** (el «antes» se sirve con `page.route` quitando solo la llamada nueva; datos de la aventura cargados como los deja P14; cuatro ejecuciones de cada variante, con un registrador servido en `js/mensajeria.js` que anota todo lo que el padre postea a los iframes): **el tráfico del padre a los iframes es idéntico** (40 pares tipo-destino, mismos recuentos en las ocho ejecuciones), el estado final es el mismo (modo aventura, `vv_aventura_iniciada`, los dos conjuntos iguales, `__pendingDistribucion` sin definir, hijo2 con las 88 coordenadas) y la distribución se completa en las dos variantes. Cambian dos cosas: la espera de `_esperarHijosCargados` pasa de 0 ms a 11-21 ms, y el aviso de hijo2 «No hay coordenadas cargadas todavía» sale en 3 de 4 ejecuciones del antes y en 0 de 4 del después. La ficha decía que en el antes la distribución quedaba pospuesta y la reintentaba `__pendingDistribucion`: medido, no es así —se completa en las dos—, porque el `HIJO_LISTO` de hijo2 llega mientras `distribuirDatosAventura` espera sus propias importaciones, antes de la comprobación `hijosInicializados.has('hijo2')` (`:9777`); con A deja de ser cuestión de suerte, y la rama «hijo2 no listo aún — usará SOLICITAR_COORDENADAS» (`:9786`) queda para los casos que de verdad lo necesitan.
  **La única diferencia con coste, medida:** si un hijo **no llega a cargar** en la ruta fallback (se aborta la petición de `audio-hijo3.html` en la recarga), antes la activación seguía a los 95 ms y ahora la espera dura los 30 s del plazo de `crearPromiseHijoListo` y sigue con un error explícito («Error esperando hijos: … Timeout esperando HIJO_LISTO de hijo3»); en los dos casos la app queda en el mismo estado degradado (aventura iniciada, modo aventura, sin hijo3: el padre avisa de que `AUDIO.REPRODUCIR_REQUEST` no llega). Es el mismo plazo que ya tiene la carga inicial de cada hijo (`_cargarSingleIframe`); la ficha daba este caso por imposible porque los cinco hijos mandan `HIJO_LISTO` sin condición de modo, pero sí se da si el iframe no carga. Si se prefiere la activación inmediata ante un hijo caído, la salida es acotar esa espera en `_esperarHijosCargados`, no volver al conjunto sin vaciar.
  **Los casos de un hijo que no avisa (el iframe que no carga, mensajes perdidos, red lenta) se estudian en K-57 a K-60.**
  **K-41 ya no espera a K-07:** `olvidarHijoListo` está; el resto de K-07 (la duplicidad de `estadoPadre` entre el padre y el state-manager, que `createEstadoPadreProxy` no es un proxy) no cambia.

- **Revisión desde K-57 (2026-10-06): el supervisor del bus vacía solo uno de los dos conjuntos.** `recargarIframe` (`js/mensajeria.js:1093`) llama a `olvidarHijoListo` del state-manager; el conjunto del padre (`estadoPadre.hijosInicializados`) solo lo vacía `_olvidarHijoListo` (`codigo-padre.html:7796-7800`), que llama `cargarHijo` al cargar un iframe. **Medido** con una sonda de Playwright sobre el padre real (`probe-conjuntos.cjs`, chromium, hijos cargados con `cargarRestoDeiframes`): los dos conjuntos no son el mismo objeto (`===` falso) y llevan los mismos seis ids; tras `__stateManager.olvidarHijoListo('hijo2')` —lo que hace el supervisor al recargar— el del state-manager ya no tiene `hijo2` y el del padre sí. **Quién lee el del padre** (búsqueda desnuda de `hijosInicializados` en `codigo-padre.html` y `js/*.js`): la comprobación de «todos los críticos listos» (`:7281`), `distribuirDatosAventura` para hijo2 y hijo5 (`:9451`, `:9485`, `:9506`), `_configurarRetoBtn` (hijo3, `:11353`), la notificación de `NAVEGACION.CAMBIO_PARADA` a hijo4 (`:11504`), el fin de un audio con retos (hijo4, `:12048`), un sondeo de espera de hijo2 (`:5281`) y `js/app.js` (`:171`, `:548`). En la ventana entre la recarga del supervisor y el `HIJO_LISTO` nuevo, esos lectores siguen viendo al hijo recargado como listo. **No medido ni leído hasta el final:** qué se pierde en esa ventana en cada lector, y si el `HIJO_LISTO` nuevo vuelve a entregar lo que se envió mientras tanto (el handler `_hdl_SISTEMA_HIJO_LISTO`, que da el alta en `:7245`, corre entero en cada `HIJO_LISTO`: falta comprobar qué re-envía). **Pendiente: decisión, sin recomendar todavía.** *A)* que el supervisor avise al padre —como ya hace con `_vv_beforeHijoReload`— para que vacíe el suyo; *B)* un solo conjunto, que es la ficha de «hijo listo» con varias casas de K-41; *C)* dejarlo.

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
- **Revisado uno a uno (2026-10-19), con el código de hoy.** `_llegada*`: K-06, cerrada. `gpsActivo`: en el padre hay dos dueños; `estadoMapa.gpsActivo` solo lo lee `diagnosticarGPS()`, que por eso informa mal (K-116); en hijo2 y en hijo5 son copias por frame. `posicionUsuario` y los demás campos del GPS: el espejo de `sincronizarEstadoGPSConPadre`, descrito como diseño (K-41 lo dejó fuera por eso). `modo`: por frame, documentado (§37.5 de la guía). `paradaActual` y `tramoActual`: los dos dueños del elemento actual en el padre son K-74, pendiente del usuario. `tiempoRestante`: el padre y la cuenta atrás de hijo1, por frame. `terminosAceptados` y `ultimaInteraccion`: ya solo viven en la selección y en hijo1 (K-41 los quitó del padre) y solo viajan en la respuesta al latido, que nadie lee (K-70). Las banderas por frame (`hijoListoEnviado`, `inicializado`, `datosRecibidos`): lo esperable. **Método:** búsqueda desnuda de cada campo y lectura de sus escritores y lectores.

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
- **Revisado (2026-10-19), con el código de hoy.** `extract-estado.cjs` da 40 rutas con tres o más funciones escritoras (eran 49: K-41 y K-57 se llevaron varias). Clasificadas por sus funciones escritoras, y leídas las que no son de una máquina de estados: la mayoría son transiciones de un mismo dueño (la máquina del GPS del padre, los pares de activar y reiniciar de hijo2, las limpiezas del mapa) o banderas de frames distintos que el instrumento junta porque se llaman `estado` en cada uno. Con entrada propia: `estado.paradaListaParaAvanzar` (K-86), `estado.hijosInicializados` (K-07, revisión), `estadoMapa.paradaActual` y `tramoActual` (K-74), `_llegadaNotificada` (K-06) y `ultimaInteraccion` (K-70). **Nuevo:** K-117 (el elemento actual se fija dos veces al restaurar). **Quedan para una lectura de una en una** (sin hallazgo todavía, no se han ejecutado): `estado.retoActual`, ocho escritoras (la cola de retos; K-87 y K-90 ya pusieron un sitio para parte de ella); las tres limpiezas de `js/funciones-mapa.js` (`limpiarRecursosInactivos`, `limpiarRecursos`, `limpiarPorEstado`), que escriben los mismos campos de `estadoMapa`; y `limpiarRecursosPorModo` de `js/app.js`, que también escribe `estado.gps` y el elemento actual (el spec 52 vigila que no apague el GPS).

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

- **Revisión (2026-10-03, R2.9).** `adelantarLatido()` no envía «un latido suelto» como el handler actual: llama a `enviarHeartbeatAHijos()` (`js/mensajeria.js:1074`), que por cada iframe registrado manda el `HEARTBEAT` y suma 1 a su contador de fallos, que solo se pone a 0 al llegar la respuesta; con `MAX_LATIDOS_SIN_RESPUESTA = 3` marca el hijo como desconectado y, si el iframe es `recuperable`, lo recarga. El envío directo de hoy no cuenta fallos. Un hijo con el contador a 2 al volver de segundo plano pasaría a 3 en el acto y se recargaría aunque fuera a contestar en milisegundos; con el reloj periódico solo se llega a 3 tras tres latidos seguidos sin respuesta. **No medido**: es el riesgo que A añade y la entrada no lo recoge. Otros efectos de A: antes de activar la aventura (`activo:false`) ya no sale ningún latido al volver a la pestaña (hoy sí, a `seleccion` y demás; `ultimoHeartbeat` solo lo lee `consultarHeartbeat`, un diagnóstico) y nada lee `datos.razon` de un `HEARTBEAT`. Ningún spec fija el handler del `visibilitychange` (M-3 fue una medición y BC-12c prueba `adelantarLatido` aislada): hace falta uno, rojo hoy porque con el latido en pausa sí sale el `HEARTBEAT`, y medir el contador antes de decidir.

- **Resuelta por K-57: la decisión queda sin objeto (2026-10-06, `1bb2af0`).** El latido es uno solo y no se pausa en ningún modo: el padre lo enciende una vez en el Script 1, tras `__MENSAJERIA_INICIADA`, y no hay pausa que «volver a la pestaña» tenga que respetar. Se borran `pausarHeartbeat`, `reanudarHeartbeat`, `preiniciarHeartbeat`, `adelantarLatido` y `userPaused`, y la rama del `visibilitychange` que difundía el `HEARTBEAT` (el listener solo revalida el tamaño del mapa). Búsqueda desnuda de los cinco nombres en `*.{html,js,cjs,mjs}` fuera de `docs/`: solo aparecen en los specs 78 y 79, que afirman su ausencia (BC-12c: «no hay pausa»; HC-1..4). El riesgo que anotaba la «Revisión» (un hijo con el contador a 2 se recargaría en el acto al volver de segundo plano) no existe: un hijo listo solo se declara caído tras tres latidos periódicos sin respuesta, y a un hijo que no está listo no se le manda latido (tiene una gracia de arranque). Qué ve el usuario: nada nuevo; en CASA los hijos contestan al latido igual que en AVENTURA.

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
- **Aplicada la opción A (2026-10-04).** `js/mensajeria.js`: el aviso solo sale si `id === 'padre'`; la guía lo dice en el apartado del state-manager. **Medido** con una sonda de chromium fuera del repo, sobre el módulo real sin state-manager (el arnés `sin-init.html`, un `id` por página) y sobre el padre real abriendo el asistente. Cada aviso se atribuye al «Inicializando» que le sigue, porque el arnés lleva dentro un `nieto` que escribe el suyo. Antes: `padre`, `hijo2`, `seleccion` y `hijo6-chat` escribían un `warn` cada uno, y en la ejecución integrada `seleccion` y `hijo6-chat`. Después: solo `padre` en la aislada y ninguno en la integrada. La mutación que quita la condición, servida por la red, devuelve el `warn` a los cuatro. Specs 03, 07 y 10 (18 tests), 79 y 80 (26 tests) en chromium, todos en verde; `npm run lint` sale con 0. Un filtro con el nombre de un spec mal escrito ejecutó 18 tests en lugar de 44 sin avisar y la sonda atribuyó mal sus primeros avisos: se corrigieron con el listado de tests seleccionados y con la atribución por «Inicializando».

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

- **Revisión (2026-10-03, R2.9).** Los dos cuerpos, leídos enteros, difieren hoy solo en la guarda de reentrada `resuelta`, el `clearInterval` del temporizador y un log de `ejecutarElegirOtra`; la brújula ya está en las dos. Son cierres anidados que capturan `overlay`, `resolve` y `logPrefix`: la función común no puede llevarse el `overlay.remove()` ni el `resolve`. **`ejecutarElegirOtra` (`#btn-confirmar-otra`) no tiene ningún spec**: el 19 TR-1 y el 25 BR-10 pulsan `#btn-vuelta-elegir-otra`, y BR-8 llama a `_resetBrujulaModo()` directo. Antes de fundir las copias hace falta uno de caracterización. Ninguna de las dos reinicia `estado.modo`, `paradaActual`, `elementoActual`, `indiceProgreso` ni `retoActual`: ver K-50, que se decide en la misma función. Escriben además `estado.seleccion.idioma` e `.iniciada`, candidatos de K-41: K-19 antes que K-41 deja un sitio menos que editar.
- **Revisión (2026-10-19, tarde): preparada, sin aplicar; decide el usuario.** Desde K-95 (`c9c90fb`) las dos copias ya no son el mismo texto: la de vuelta rápida borra y recarga; la de reanudación borra (K-20, `54b4e9b`) y reinicia a mano unas diez cosas que en ese momento ya están vacías (el diálogo solo sale en el arranque: ver K-50). Propuesta: una sola salida, `_elegirOtraAventura()` (borrar la aventura guardada, con el idioma, y recargar), para los dos diálogos, como el modal de fin y el de tiempo agotado. Visible: en la reanudación, «elegir otra» pasa por la pantalla de carga unos segundos antes de la P1. El idioma no cuenta ahí: la P1 y las banderas (P2) no llevan texto, y es en las banderas donde el usuario lo elige (corregido el 2026-10-19 noche: ponía «la P1 sale en el idioma del dispositivo»). **Arrastra (búsqueda desnuda):** `_ocultarUIActivada()` y `_resetBrujulaModo()` se quedan sin llamador de producción (el segundo, con el BR-8 del spec 25, que lo llama a mano), y `ejecutarElegirOtra` es el único emisor de `NAVEGACION_PANTALLA` (`codigo-padre.html:4611`): el tipo (`js/constants.js`) y su handler de la selección (`En-busca-del-tesoro.html`) se quedarían sin emisor. Eso toca el bus (regla 1).
- **Aplicada (2026-10-19 noche), con K-125, sin pasar todavía por los navegadores (el usuario: «aplica pero no pases los navegadores»; su «aplica» es el OK de la regla 1).** `_elegirOtraAventura()` (borrar la aventura guardada con el idioma y recargar) es la salida de los dos diálogos. Fuera `_ocultarUIActivada()`, `globalThis._resetBrujulaModo()` (con el BR-8 del spec 25) y el tipo `NAVEGACION_PANTALLA` con su handler en la selección; al día el comentario de `_ACCION_PANTALLA[1]` y el de `tools/estudio-caminos/guia-handlers-por-frame.cjs`. Spec nuevo 146 (ER-1). Sin navegador: ESLint limpio, `sync:master-test` (144 specs) y `verificar-mensajeria` sin tipos huérfanos. Guía: §4.6b, §7, §8 (catálogo y ficha), §10.19, §18.3, §25.10, §25.19, §26, §34 y §37; la §37.3, regenerada con su herramienta, pierde además dos emisores que el código ya no tenía (`js/app.js` en `NAVEGACION.CAMBIO_PARADA` y `js/funciones-mapa.js` en `NAVEGACION.GPS.ACTIVAR`, de K-61 y K-122).
- **Comprobada y en commit (2026-10-20, `de801ba`).** Rojo contra HEAD: ER-1 cae, porque la página no se recarga (el «load» no llega en 15 s). Verde en chromium, con un solo proceso: 67 de 67 en los specs 146, 147, 19, 25, 74, 79, 121, 127, 128 y 135.

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
- **K-20 A aplicada (2026-10-19, `26e156d`), con K-54.** La rama «sin modal» de `_comprobarReanudacionAventura` limpia la sesión con `limpiarDatosAventura('timeout')`, como su gemela `_restoreCheckTimeout`, sin dejar claves vivas. Con la espera de K-54, esa rama solo se alcanza si Script 2 no llega a cargar en 30 s. Las otras formas de la tabla no cambian.
- **El resto, aplicado (2026-10-19, `54b4e9b`), con R2.10.7.** Las claves de una aventura guardada están escritas una vez, en `almacen.AVENTURA_GUARDADA`, y las borra `_borrarAventuraGuardada({ conIdioma })`: «elegir otra» (con el idioma) y la vuelta a CASA (sin él). Quedan aparte, cada una por su motivo: el progreso caducado, de otra aventura o roto (solo `vv_progreso`) y la limpieza total (`limpiarDatosAventura`).

- **Corrección (2026-10-03, R2.9).** La entrada da la rama «sin modal» por alcanzable solo ocultando la función (M-9). `mostrarModalTiempoAgotado` se asigna en Script 2 (`codigo-padre.html:13545`) y `_comprobarReanudacionAventura` corre en Script 1, desde `_finalizarInicializacion` (`:8367`), tras esperar al mapa, a `validarMensajeriaFase1` y 300 ms (`:8434`). `validarMensajeriaFase1` (`:8205`) espera al bus y a `estadoPadre`, no a Script 2 (el padre no llama a `getScript2Listo`). Es una carrera por tiempo y no un hueco inalcanzable (K-54). Con A, en un dispositivo en que Script 2 aún no haya llegado a esa línea, la carrera vaciaría `localStorage`, `sessionStorage`, las cachés del service worker y el propio service worker (`limpiarDatosAventura`, `js/reciclaje-digital.js:50-124`) sin avisar ni recargar, como hace ya su gemela `_restoreCheckTimeout`, donde hoy deja tres claves vivas. `limpiarDatosAventura` solo recarga la página en los llamadores que lo hacen después (`_finalizarYLimpiar`, `:8660`); estas dos ramas no. La alternativa que la entrada no plantea es esperar a que `mostrarModalTiempoAgotado` exista, con `retryUntilAvailable`, en vez de decidir qué hace el degradado: es otra decisión y toca el arranque (K-54). No hay spec de la rama.

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
- **Resuelta por K-57, paso 3 (2026-10-06, `343126a`).** La espera del `HIJO_LISTO` es una sola, `crearPromiseHijoListo` del state-manager, y ya no tiene plazo propio (se borra el de 30 s con rechazo): quien necesita acotarla la acota por fuera con `Promise.race` (`esperarHijosListos(timeout)` del bus; `_gpsEsperarHijosListos`, 5 s). La espera de carga de iframe también es una: el cargador único `cargarHijo` registra el iframe, le asigna el `src` y espera el `HIJO_LISTO`; se borran `_esperarCargaIframe`, `_esperarHijoListo`, `_esperarHijoListoSinPlazo`, `_cargarIframeConTimeout`, `_cargarSoloIframeActivacion`, `_esperarHijosCargados` y `_esperarHijosCriticosRest`. `cargarIframeConDatos` (la rama de `mostrarHijo4` cuando hijo4 no tiene `src`) no registraba el iframe en el bus ni esperaba el `HIJO_LISTO`: lo retira el paso 4 (apartado siguiente).
- **`cargarIframeConDatos` y `_esperarHijo4` retirados por K-57, paso 4 (2026-10-06, `2a88a77`).** hijo4 pasa por lo mismo que los demás: `mostrarHijo4` solo muestra, y el handler de `RETO.SOLICITAR_RETO` espera sin plazo a `crearPromiseHijoListo('hijo4')` y entonces lo muestra (la espera de 5 s con «enviar de todos modos» se va, y con ella el segundo emisor de `PADRE_DATOS`). **Medido antes de aplicar:** ningún test de los 593 de chromium entraba en `mostrarHijo4` (cobertura por avisos, con control positivo del instrumento); el recorrido real (P14 → activación → reto) entra con hijo4 ya cargado y listo, sin tocar la rama sin `src` ni `_esperarHijo4`. Lo que sí podía darse era pedir un reto con hijo4 recuperándose: el código anterior lo mostraba al instante y seguía adelante porque el conjunto del padre aún lo daba por listo (el supervisor solo vacía el del state-manager); RC-10 lo mide y cae con el código anterior. No hay razón escrita de por qué hijo4 iba aparte: `cargarIframeConDatos` está desde el primer commit y su comentario («FASE 3 lo carga al inicio») es del diseño en que hijo4 se cargaba en el arranque.

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

- **Corrección (2026-10-03, R2.9).** `RETO.MOSTRAR` lo emiten **tres** sitios y no uno: `_enviarRetoMostrar` (`codigo-padre.html:10726`), la reposición tras recargar hijo4 (`:9716`, `{...snap.retoActual, timestamp}`) y el responder de `DATOS.SOLICITAR_RETOS` (`js/controladores-padre.js:141`, que ya tiene `idioma` a mano en `:129`). El snapshot `_snapshotRecuperacion.retoActual` se guarda a mano como `{retoId, contexto, retosArray}` (`:10728`): un `idioma` añadido en `_enviarRetoMostrar` no viaja en la reposición salvo que el snapshot también lo guarde. El spec 103 fija «un solo constructor» entre los dos primeros y no ve el tercero. Sin `idioma`, hijo4 cae al español (`|| .es`): falla suave. `js/validacion.js` no define esquemas por tipo, así que un campo más no rompe nada, y ningún spec fija las claves de `datos` (el 103 RM-1 y RM-2 y el 10 CP-6 recogen el mensaje sin compararlas): hace falta uno, rojo hoy porque hijo4 con idioma `fr` pinta el marcador en `es`. La única escritura de `__vv_idiomaActual` (`coordenadas-hijo2.html:1815`, en su propio `globalThis` y sin lector) pasa a ser código muerto con A. K-25, en la parte de hijo4, necesita este canal.

- **K-24 A aplicada (2026-10-04).** `RETO.MOSTRAR` lleva `idioma` (`globalThis.idiomaSeleccionado`) en sus tres emisores: `_enviarRetoMostrar` (que lo guarda también en `_snapshotRecuperacion.retoActual`, de donde sale la reposición tras recargar hijo4) y el responder de `DATOS.SOLICITAR_RETOS` (`js/controladores-padre.js`). hijo4 lo toma antes de pintar y lo guarda en su `globalThis.__vv_idiomaActual`, que es lo que ya leían sus dos textos propios. Se retira la escritura de `__vv_idiomaActual` de hijo2 (sin lector). La guía añade `idioma` a las descripciones del payload y lista el spec 120 (117 specs; catálogo regenerado). **Cambia lo que ve el usuario:** en una aventura que no sea la española, el marcador del campo de texto y el aviso de reto no disponible de hijo4 salen en su idioma, en lugar de en español. **Spec nuevo 120** (4 tests). **Rojo antes de verde:** con el código anterior caen ID-1 (hijo4 con `idioma: fr` pintaba el marcador en español), ID-3 e ID-4 (el mensaje no llevaba `idioma`); ID-2 pasa antes y después. La reposición, que ID-3 afirma en su segunda mitad y que la primera impedía ver, se vio en rojo sirviendo por la red el padre con el snapshot sin `idioma`. 160 tests de 21 specs, todos en verde en chromium; `npm run lint` sale con 0. Con esto K-25, en la parte de hijo4, ya tiene el canal del idioma.

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

- **Revisión (2026-10-03, R2.9).** hijo4 ya importa `traducciones-ui.js` (`retos-hijo4.html:434`: `PLACEHOLDER_RESPUESTA_TEXTO` y `MSG_RETO_NO_DISPONIBLE`), así que añadir entradas no suma carga. La opción A nombra los tres `alert()`, pero hijo4 tiene otros textos visibles en español en el flujo normal que ella no cubre: el botón 🆘❓ (`btnMostrarRespuesta`: «Respuesta correcta: …» en `:1056` y «No hay respuesta correcta disponible para este tipo de reto.» en `:1058`) y la etiqueta estática «🧩 Iniciar reto» (`:1725`). Tras A, el usuario vería el `alert` de elección en su idioma y esos textos en español. El tercer `alert` (`:976`) es inalcanzable; los dos normales (`:984`, `:992`) se alcanzan pulsando Enviar sin elegir (M-6). El registro de las 12 lenguas sigue la regla de voz de los textos de usuario (impersonal, sin género, de usted). La parte de hijo4 necesita el canal de idioma de K-24; la de la selección no depende de él.

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
  el `_zoomRAF` de `funciones-mapa.js:940`: no se han revisado una a una — 🔎. **Revisados uno a uno (2026-10-19):** sale K-115
  (el bucle de dibujo del puzzle se multiplica); el resto termina solo o es de un fotograma.
- **Un observer en `puzzle.html` y los reproductores de `js/efectos-sonido.js`** (uno por efecto y por
  frame): viven lo que la página. `detenerEfectos()` los pausa, y el observer del puzzle lo llama cuando
  su contenedor deja de verse.

##### K-31 — Las dos listas del Service Worker difieren a propósito — 📌

`APP_SHELL` en `sw.js:26` (61 entradas) y `ficherosDelShell()` en `tools/build-sw.js:132` (54, lo
que entra en el hash de `CACHE_VERSION`). Difieren en `debug-brujula.html` (está en el hash, no en
`APP_SHELL`) y en cuatro imágenes y cuatro MP3 de `audios-efectos/` (están en `APP_SHELL`, no en el hash). `sw.js:94-96` lo declara:
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
  El spec `114` (modo de datos por capacidad, el `page.route` de `**/api/health` de la lista de arriba) era rojo en firefox y en
  webkit y ciego en ellos (M-19): en local `sw.js` contesta cada GET con un `fetch` propio y `page.route` no ve lo que pide un service
  worker fuera de chromium, así que el `/api/health` interceptado no llegaba a la página y contestaba el servidor real (502 del proxy):
  MD-2 recibía `false` y MD-5 seguía verde con el corte de 2,5 s cambiado a 20 s. Con `test.use({ serviceWorkers: 'block' })`, como
  ya hacía el spec `89`, pasa 20 de 20 en los cuatro proyectos y cada rotura de `js/data-loader.js` pone en rojo su caso en los
  cuatro (`03408b7`; la guía lo anota en §36.26).
  El spec `30` CM-6 era rojo a ratos en firefox (M-21): concedía el permiso de geolocalización con la página ya cargada y, en 10 de 27 ejecuciones
  intercaladas, la página seguía viendo `prompt` justo después de `grantPermissions()`, con lo que el cambio de modo a AVENTURA se quedaba esperando. Con el permiso en
  las opciones del contexto (`test.use`), 0 de 27; concediéndolo antes de navegar, 0 de 12, que es el orden de los otros 29 puntos de la suite que conceden el permiso
  (clasificados con un script: en los 29 la concesión precede a `gotoAndWaitForFase1` dentro de la misma función; en los dos de `44`, a través de
  `prepararPadreConAventura`, que lo llama en su línea 49). La misma comprobación en rojo mostró que CM-6 no veía la rotura de lo que dice vigilar (M-20, K-49).
  Los dos arreglos, en `066833e`.

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
- **El generador de §37.2 cuenta como uso un nombre citado en un comentario (registrado el 2026-10-19).** `tools/inventory-conexiones.js` busca cada nombre con `\b…\b` en el texto crudo de cada bloque: un comentario que lo cita cuenta como uso de ese bloque, y una asignación escrita en un comentario cuenta como definición. (La de un comentario que se tragaba la asignación real de la línea siguiente quedó acotada a su línea con K-52, `cf47a3a`.) Arreglo: buscar sobre `textoSinComentarios()` de `tools/lib/analisis-js.js` (mismas posiciones y líneas, con los comentarios del HTML y del JavaScript blanqueados) e imprimir los bloques que no pueda parsear. Cambia la tabla de la guía en las filas cuyo cruce solo existía en un comentario.
- **Aplicado (2026-10-19, `0312bd2`).** El generador lee cada fichero con `textoSinComentarios()`; ningún bloque sin parsear. Comprobada cada aparición que deja de contar, con su línea y su bloque (`apariciones.cjs`, scratchpad): todas estaban en comentarios, en comentarios HTML o en la directiva `/* global */` de Script 2. En el padre cruzan 98 identificadores (eran 105 contando comentarios); en total, 116. Dejan de cruzar `cerrarImagenOverlay`, `_obtenerCoordenadasP0Fallback`, `cargarIframeSoloSeleccion`, `mostrarCartelLlegadaParada`, `verificarTimeoutAventura`, `waitForMapLibreAndInitialize` y `marcarParadaCompletada`, y otras cinco filas pierden algún bloque. Guía: §37.2 (cifras y siete filas a mano, celdas con `regenera-s37.cjs`) y una frase sobre cómo se cuenta. **Lo que destapó:** el censo de K-93 tenía el mismo punto ciego (ver K-93).

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

- **Revisión (2026-10-03, R2.9).** (1) `AVENTURA.FINALIZADA`: única emisión en `codigo-padre.html:10112`, hacia `hijo1-opciones` (receptor real: `extrainfo-hijo1.html:1199`); búsqueda desnuda en todo el repo, specs y herramientas incluidos: ninguna emisión hacia el padre, ni por `despacharLocal`. Retirar el handler del padre (`:13547`, registro `:13866`) no toca emisor ni receptor; ningún spec fija el número de controladores (el 89 compara contra el total medido y avisa de no fijar cifras; el 03 exige `> 0`), pero la guía y `verificar-mensajeria` cambian en uno. (2) `UI.CLOSE_MENUS`: el sentido real es hijo1 → padre (`extrainfo-hijo1.html:708`, handler del padre en `:12332`); `except !== 'audio-control'` es siempre cierto porque solo llega `'mas-opciones'`. Ningún spec lo nombra: antes de tocar el handler del padre hace falta uno que fije «abrir más opciones cierra el desplegable de audio del padre».

- **K-35 (1) A aplicada (2026-10-04).** Retirados `_hdl_AVENTURA_FINALIZADA` y su registro en el padre; el tipo se sigue emitiendo hacia `hijo1-opciones`, que lo recibe. La guía quita su fila del catálogo de handlers del padre, ajusta la cifra de handlers `permanente: true` (59: 54 en el padre, 2 y 3, recontados con `grep -c`) y deja a hijo1 como único receptor en la tabla de emisor y receptor. **Medido** con una sonda de chromium (padre real, AVENTURA): antes, el handler está registrado y un `AVENTURA.FINALIZADA` despachado al padre solo escribe «recibido»; después, no está registrado y ese mismo despacho, que en la aplicación no ocurre nunca, lo avisa el bus con un `warn` («no tiene handler para ese tipo»); en los dos casos `AVENTURA.ESTADISTICAS_TIEMPO` muestra el modal de fin igual. `verificar-mensajeria` pasa de dos handlers inalcanzables a uno (queda `UI.CLOSE_MENUS`). Specs 03, 07, 10, 19, 79, 80, 89, 90 y 115 (77 tests) en verde en chromium; `npm run lint` sale con 0. Queda abierta la mitad (2).

- **K-35 (2) A aplicada (2026-10-04).** `UI.CLOSE_MENUS` queda con un solo sentido, hijo1 → padre: se retira el handler de hijo1 (68 líneas, al que ningún mensaje llegaba) y el parámetro `except`; hijo1 manda `{ timestamp }` y el padre cierra siempre su desplegable de audio (`_hdl_UI_CLOSE_MENUS_PADRE`, sin la exención `except !== 'audio-control'`, que nunca se aplicaba). La guía pierde sus menciones del sentido inverso y del parámetro (tablas de handlers y de payloads, las fichas y el código de §34.1) y lista el spec 118; el recuento de specs pasa a 115 (catálogo regenerado). **Spec nuevo 118** (3 tests): CM-1 fija el comportamiento que nadie vigilaba (con el desplegable abierto, «Más opciones» lo cierra), CM-2 que el mensaje lleva solo `timestamp` y CM-3 que el padre es el único receptor. **Rojo antes de verde:** con el código anterior CM-2 y CM-3 caen (el mensaje llevaba `except`; hijo1 tenía handler) y CM-1 pasa; y CM-1 cae contra su línea: sirviendo por la red el padre con el handler vaciado, el desplegable sigue abierto. `verificar-mensajeria` pasa a 0 handlers inalcanzables (eran 2 antes de K-35). 122 tests de 16 specs de hijo1, handlers y bus, todos en verde en chromium; `npm run lint` sale con 0.

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
- **Claves que solo existen en el lado que envía, dos más (registrado el 2026-10-19).** `NAVEGACION.SOLICITAR_DATOS_PARADAS` (hijo5 → padre) lleva `{ incluirTramos, incluirInicio, incluirMetadatos, ubicacionUsuario }`, y el handler del padre (`codigo-padre.html:7257-7288`) no lee ninguna: contesta con la lista de la aventura elegida. Y el padre manda `incluirMetadatos: false` a hijo2 en dos peticiones de coordenadas (`:5301` y `:10954`) que hijo2 no lee. Búsqueda desnuda de `incluirTramos`, `incluirInicio` e `incluirMetadatos` en todo el repositorio: los emisores, el spec 97 (que repite la llamada del padre) y la guía. Va con lo que queda de K-41 (la `ubicacionUsuario` que hijo5 nunca escribe).
- **Aplicado (2026-10-19, `177e731`), con dos claves más.** `SOLICITAR_DATOS_PARADAS` va con `datos: {}`, y las peticiones de coordenadas del padre a hijo2 van sin `incluirMetadatos` y sin `padreId`: leído entero el handler de `DATOS.COORDENADAS_PARADAS_REQUEST` de hijo2 (`coordenadas-hijo2.html:1767`), lee `paradaId`, `incluirRutas`, `incluirMarcadores`, `actualizarMapa` y `contexto`, y el `padreId` que le mandaban `populatePendingCoords` y `_hdl_NAVEGACION_MOSTRAR_UBICACION_POLYLINE` tampoco lo lee. El spec 97 deja de mandar `incluirMetadatos`. Guía: §10.12, las dos tablas de hijo5 y el diagrama del cambio de parada (G-85).

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

- **Aplicada la opción A (2026-10-04).** Retirados `manejarPerdidaConexion`, `manejarReconexion` y sus dos listeners de `js/app.js`, y la clave `conectado` del estado del padre (`codigo-padre.html`) y de la copia del state-manager; la guía deja de listarla en la estructura del estado. Una búsqueda desnuda de `conectado` en todo el repo no deja ningún resto (solo un `conectado` local de un spec, sin relación). **Corrección a la ficha:** la guía sí nombraba la bandera (la lista de campos de `estadoPadre` en el apartado del state-manager); la comprobación de entonces buscaba `estado.conectado` con ancla y no la veía. **Medido** con una sonda de chromium (padre real, AVENTURA, eventos `offline` y `online`): antes, `offline` muestra el overlay, pone `conectado` a `false` y escribe el `warn` «Conexión perdida, pausando operaciones», y `online` lo deshace; después, el overlay (camino 1) sale y se oculta igual, no hay clave `conectado` y no se escribe ningún aviso de pausa; la mutación que repone el camino 3, servida por la red, devuelve el aviso y la bandera. Ningún spec cubre `offline` (la búsqueda de `offline`, `internet-overlay` y `setOffline` en los specs no encuentra ninguno): la sonda es la única medición. 101 tests de los specs de arranque, handshake, cambio de modo y controladores, todos en verde en chromium; `npm run lint` sale con 0. Con esto K-41 pierde un campo, `estado.conectado`.

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

- **Revisión (2026-10-03, R2.9).** El instrumento de esta entrada y el grafo de la revisión tratan `estado` y `estadoPadre` como raíces distintas aunque en el padre son el mismo objeto (getter, `codigo-padre.html:4289` y `:9760`), y no ven los usos del objeto entero (argumento, alias, copia, `console`). Se repitió cada fila con búsqueda desnuda del nombre y se escaneó con `acorn` el uso del objeto entero en los ocho ficheros del padre (0 bloques sin parsear): `estado` va entero a 22 funciones y todas lo llaman `estado` por dentro; el único alias con otro nombre es `ep` en `construirEstadoChat` (lee `ep.indiceProgreso` y `ep.idioma`, que no son candidatos); los volcados enteros son `logger.debug` y `logger.error` de diagnóstico; y `setEstadoPadre(globalThis.estadoPadre)` copia todo al state-manager, cuyo `getEstadoPadre` solo leen sondas de spec. Ningún frame distinto del padre lee `estadoPadre` (el de hijo6 es local y viene del payload de `CHAT.ESTADO_PADRE`). Resultado: las filas se mantienen; `hijosPreparados` se queda (9 specs); al retirar `estado.retoActual.completado` hay que quitar también la clave de los literales del objeto (`completado: false` o `true`), no solo las 7 asignaciones; y quitar `seleccion.idioma` deja la línea `:12878` en `idioma || undefined`. Dependencias duras: K-04 (monitoreo), K-40 (`conectado`) y K-07 (`hijosPreparados` y `estadoHijos.*.listo`), como decía la entrada; blanda: K-19, que escribe `seleccion.idioma` e `.iniciada` en dos copias. Con K-46: `DATOS.COORDENADAS_CARGADAS` solo deja de ser «un handler que asigna algo» cuando se retire `seleccion.coordenadasCargadas`.

- **Actualización (2026-10-04).** `estado.conectado` ya está retirado por K-40 A: la tanda de K-41 no lo incluye.
- **Análisis previo a la tanda (2026-10-05) y reparto en cinco pasos.** Con el código de hoy (las líneas de esta ficha ya no valen), contra tres instrumentos: el de estado de este estudio, un censo por nombre de propiedad con **cualquier raíz** (`campos.cjs`, del scratchpad de la sesión y sin versionar: no depende de que el estado se llame `estado`) y dos escáneres de los usos del objeto entero (`enteros.cjs` y `estado-entero.cjs`, también sin versionar). Resultado: ninguno de los siete campos tiene una lectura real, ni en código ni en specs; las únicas «lecturas» son sus propias inicializaciones perezosas. **Correcciones a la ficha:** `estado.retoActual.completado` son 7 escrituras más 11 literales con `completado:` (18 sitios, uno el literal inicial); `estadoHijos.get(id).preparado` y `.listo` no son escrituras de campo, son claves de dos literales (`:7201` y `:7316`); `modo.anterior` y `tramoActual` también están declarados en los literales iniciales del padre y del `state-manager`; el `retoActual` entero que sale en `_snapshotRecuperacion` es otro objeto (`{ retoId, contexto, … }`), no `estado.retoActual`; `diagnosticarStateManager` solo vuelca `modo` entero a la consola. **Candidata nueva, fuera de los siete:** `estado.paradasConfirmaciones`, que solo se escribe. **Efectos cruzados:** al retirar `seleccion.terminosAceptados` y `seleccion.timestampInicio`, esas dos claves del payload de `SELECCION.AVENTURA_ACTIVADA` dejan de leerse en el padre (el emisor las sigue mandando: decisión de contrato del bus), y el handler de aceptación de términos puede quedar sin efecto; K-19 escribe `seleccion.idioma` e `.iniciada` en sus dos copias de «abandonar» (blanda). **Reparto, de menor a mayor conflicto, un commit y una verificación por paso:** (1) `hijosFallidos` y la copia `sistemaInicializado`; (2) `modo.anterior`, `modo.ultimoCambio` y `tramoActual`; (3) `estadoHijos.preparado` y `.listo`; (4) `retoActual.completado`; (5) `seleccion.*`. **Técnica nueva, la trampa de lectura:** en la copia, el campo retirado se sustituye por una propiedad no enumerable que lanza error al leerse; si en toda la selección de specs no salta, nadie lo lee en tiempo de ejecución; su control positivo es la misma trampa sobre un campo que sí se lee (`hijosPreparados`: caen 22 de 34 tests).
- **Paso 1 de 5 aplicado (2026-10-05, `bc6f8fe`).** Quitadas 7 líneas de `codigo-padre.html`: la inicialización de `estadoPadre.hijosFallidos` con sus dos comentarios y la línea `estadoPadre.sistemaInicializado = true` (el global `globalThis.sistemaInicializado` se queda: lo lee la espera de `:4921`). Verificado antes de aplicar, en una copia fuera del repo: 0 lecturas por nombre; el instrumento de estado baja de 12 a 10 candidatas estrictas, justo esas dos; parseo, lint y `verificar-mensajeria`, `verificar-frames`, `codigo-muerto` y `verificar-esperas` sin diferencias; 298 tests en chromium idénticos; la trampa de lectura no saltó en ninguno; controles con un `throw` en cada sitio: caen 69 de 69 (el de `hijosFallidos`, que se ejecuta en cada arranque) y 2 de 69 (el de `sistemaInicializado`, que solo corta los pasos posteriores). Tras aplicar: los mismos 298 tests y la copia coincide byte a byte. La guía no cambia: sus menciones son la variable local `hijosFallidos` de `cargarRestoDeiframes` y el global. La tabla generada de §37.2 envejece con cada edición del padre (hoy unas 6 líneas): se regenera con `npm run inventory:conexiones` al cerrar la tanda. No se lanzaron firefox, webkit ni los dos móviles.
- **Paso 2 de 5 aplicado (2026-10-05, `e0f019b`).** Retirados `estadoPadre.modo.anterior`, `estadoPadre.modo.ultimoCambio` y `estado.tramoActual`: 16 líneas de `js/app.js` (la actualización optimista y el bloque de «campos mínimos» de `manejarCambioModo()`, la escritura de `anterior` en `restaurarEstadoModoAnterior()` y `estado.tramoActual = null`), el `anterior` y el `tramoActual` de los literales iniciales de `js/state-manager.js` y el `anterior` del literal del padre; la guía (§2 y el listado del estado del `state-manager`) describe `modo` con solo `actual`. Los demás `tramoActual` del código son otros objetos: el argumento `estadoLimpieza` que `limpiarRecursosPorModo()` pasa a `limpiarPorEstado()` y el estado propio de `funciones-mapa`. Verificado antes de aplicar, en una copia fuera del repo: 0 lecturas por nombre con cualquier raíz; el instrumento de estado baja de 24 a 21 candidatas (de 10 a 9 estrictas), justo esos tres campos; parseo, lint, `verificar-mensajeria`, `verificar-frames` y `verificar-esperas` sin diferencias (`codigo-muerto` solo cambia números de línea); 379 tests en chromium (66 specs: los 45 del paso 1 más los que mencionan el cambio de modo) idénticos a la línea base; la trampa de lectura sobre los tres campos no saltó en ninguno ni dejó una sola petición en el registro del servidor de la copia, y su control positivo sobre `modo.actual` deja 4418 peticiones y hace caer 16 de 41 tests. Tras aplicar: los mismos 379 tests en el árbol real, los tres ficheros coinciden byte a byte con la copia verificada y las comprobaciones estáticas del árbol real son idénticas a las de HEAD. **Dos correcciones a la técnica, medidas en este paso:** (a) un control que lanza un `throw` dentro de una función que su llamador envuelve en `try/catch` no se ve: `restaurarEstadoModoAnterior()` se llama dentro de un `catch` que se traga cualquier error (`js/app.js:623-631` tras el paso), y el primer control de la rama de fallo (un `throw` en la línea quitada) dio «41 de 41 en verde» sin probar nada; un control vale si avisa por un canal que el `catch` no alcanza, y el canal es una petición a una URL única al servidor de la copia, que deja su registro de peticiones en un fichero (la misma petición va ahora en la trampa de lectura, para ver también las lecturas que un `catch` se traga). (b) `_deepCopy` del `state-manager` solo copia propiedades enumerables, así que una trampa no enumerable en el objeto del padre no se vería en una lectura vía `getEstadoPadre()`: esa vía la cubre el censo por nombre (`getEstadoPadre` no tiene más usos que su exportación en el objeto API; `tests/e2e/01-fase1-boot.spec.js` solo comprueba que es una función), no la trampa. **Rama de fallo:** no se ha medido si algún spec la ejecuta sin ayuda; con un fallo inyectado en la copia antes del pre-warm (un `throw` antes de `await _flujoPrewarmModo(…)`) se ejecuta 7 veces en los 41 tests de cambio de modo, sin ninguna lectura de los campos retirados y con los mismos tres tests rojos que el código anterior con la misma inyección (`LU-3`, `GC-1` y `GC-2`). No se lanzaron firefox, webkit ni los dos móviles.
- **Paso 3 de 5 aplicado (2026-10-05, `44f8d84`).** Quitadas dos claves de literal de `codigo-padre.html`: `preparado: true` en el handler de `SISTEMA.HIJO_PREPARADO` y `listo: true` en el de `SISTEMA.HIJO_LISTO`; el resto de cada entrada de `estadoHijos` no se toca. La guía (fila de `SISTEMA.HIJO_LISTO` del catálogo de tipos) dice que el handler marca el hijo `activo`. Verificado antes de aplicar, en una copia fuera del repo: ambos nombres solo aparecen como claves de literal (censo por nombre con cualquier raíz y búsqueda del nombre desnudo en todo el repo; los `.listo` de los specs son objetos locales suyos, `{ listo: … }` devuelto por `page.evaluate`); 379 tests en chromium idénticos a la línea base; **trampa de lectura nueva, en `estadoHijos.get()`:** toda entrada que devuelve lleva `preparado` y `listo` como propiedades no enumerables que lanzan y piden una URL al servidor de la copia (las entradas nacen en tres sitios y se copian con spread, que no copia lo no enumerable, así que la trampa va en el `get` y no en los literales); no salta en ninguno de los 379 tests. Control positivo extremo a extremo: 66 peticiones para `preparado` y 72 para `listo` (la lectura de `.listo` va sola, porque con las dos a la vez el handshake se corta antes de que llegue ningún `HIJO_LISTO` y `listo` solo da 1). Controles con un `throw` en la posición exacta de cada clave: `preparado` hace caer 9 de 31 tests de los 5 specs de handshake; `listo` hace caer 0 de 31 en esos 5 (**selección ciega ahí**: ninguno espera la confirmación al hijo ni lo que viene después en el handler) y 2 de 379 en la selección completa (spec 76, PA-1 y PA-2: son los únicos que vigilan el camino de `HIJO_LISTO` tras esa línea). Tras aplicar: los mismos 379 tests en el árbol real, el fichero coincide byte a byte con la copia verificada, parseo, lint, `verificar-frames`, `codigo-muerto` y `verificar-esperas` idénticos a HEAD y `verificar-mensajeria` solo cambia el número de línea de un emisor. `hijosPreparados` se queda (sonda de 9 specs, decidido en la tabla de R2.9). No se lanzaron firefox, webkit ni los dos móviles.
- **Candidata nueva, fuera de los siete y SIN TOCAR (decide el usuario): `estadoPadre.estadoHijos` entero.** Medido con código de hoy. Nombre desnudo en todo el repo (sin `docs/`): `codigo-padre.html` solo hace `get`, `has`, `set` y `new Map()`; ningún código de producción lee un campo de una entrada. Por campo (censo por nombre, cualquier raíz): `activo` se escribe en 4 sitios del Map (`:7709`, `:7746`, `:8057`, `:8069`) y sus lecturas del censo son de otros objetos (el estado del latido en `js/mensajeria.js`, los controladores del `state-manager`, `estadoPadre.gps`, la prueba de `consultarHeartbeat()`); `fallido` (1 escritura, `:7747`), `ultimoError` (2, `:7945` y `:8059`), `fallosConsecutivos` (4 escrituras y una lectura, `:7945`, que solo alimenta su propia suma; el `++` de `:8029` tampoco tiene lector), `version` y `tiempoInicializacion` (solo claves de literal). Los specs 08 (HD-2c comprueba que es un `Map`; HD-4 y HD-5 lo inicializan si falta; HD-6b hace `set` y `get` de una entrada de prueba y lee su `fallosConsecutivos`, es decir, prueba el `Map` y no el código del padre) y 09 (`:153`, lo inicializa si falta) lo mencionan. La guía lo documenta en seis sitios (reintento de hijos, `HIJO_FALLIDO` dos veces, `HIJO_LISTO`, `HEARTBEAT_RESPONSE`). Ninguna ficha de este estudio lo cubre (K-11 es de las rutas de arranque del latido). Opciones: paso 6 de K-41, ficha propia, o dejarlo como sonda de los specs; junto con `estado.paradasConfirmaciones`, que está en el mismo caso. Los flujos que hoy escriben en él (respuesta de latido, `HIJO_FALLIDO`, reconexión de hijos) conservarían sus logs y sus reintentos: lo que desaparece es la escritura al `Map`.
- **`estadoPadre.estadoHijos` retirado por K-57, paso 3 (2026-10-06, `343126a`).** Se borra el `Map` y sus escrituras en los handlers de `HIJO_PREPARADO`, `HIJO_LISTO` y `HEARTBEAT_RESPONSE`, el handler de `HIJO_FALLIDO` (que también se retira) y las tres inicializaciones (`estadoPadre`, `validarMensajeriaFase1` y los cargadores); los specs 08 y 09 dejan de tocarlo (HD-2c, HD-6a y HD-6b se borran) y RC-8 vigila que no vuelva. `estado.paradasConfirmaciones`, la otra candidata de esta ficha, sigue en pie.
- **Paso 4 de 5 aplicado (2026-10-05, `ee4795f`).** Quitados 18 sitios de `codigo-padre.html`: las 7 asignaciones `estado.retoActual.completado = …` (la de `_hdl_RETO_COMPLETADO` con el comentario que solo la introducía), la clave `completado:` de los 11 literales de `retoActual` (el inicial de `estadoPadre`, el del cambio de modo, el fallback junto a los de `hijosPreparados` y `estadoHijos`, los de las rutas de reto y de audio y los tres de CASA) y el nombre del campo en el comentario que enumera los campos de `retoActual`; la guía (diagrama del cambio de modo) describe `estado.retoActual` como `{ id, disponible, cola, colaCompletados }`. Verificado antes de aplicar, en una copia fuera del repo: ninguna lectura del nombre en ningún frame (censo por nombre con cualquier raíz y búsqueda del nombre desnudo; el `completado` desestructurado de `ESTADISTICAS_TIEMPO` y el de `extrainfo-hijo1.html` son del payload de otro mensaje); los usos del objeto entero no lo leen (`_buscarSiguienteRetoEnCola` solo lee `cola` y `colaCompletados`; el `retoActual` de `_snapshotRecuperacion` es otro objeto); los 583 tests del proyecto chromium entero idénticos a la base con el paso aplicado, con la copia de cobertura y con la trampa de lectura (`estadoPadre.retoActual` devuelve siempre un objeto con `completado` no enumerable que lanza y avisa al servidor de la copia): cero lecturas; control positivo con una lectura deliberada en un sitio que sí se ejecuta: 10 avisos. Tras aplicar: los mismos 583 tests en el árbol real, el fichero coincide byte a byte con la copia verificada, parseo, lint, `verificar-frames`, `codigo-muerto` y `verificar-esperas` idénticos a HEAD y `verificar-mensajeria` solo cambia números de línea. **Técnica nueva, cobertura por avisos:** una copia que NO quita nada y sustituye cada sitio editado por un aviso al servidor de la copia (una sentencia en las escrituras, una clave calculada `[(fetch(…), '_k41_x')]: 0` en los literales) dice cuáles de los sitios ejecuta de verdad la selección: con los 583 tests, 11 de los 18 (`l1` 434 veces, `l2` 10, `l5` 2, `l9` 8, `l11` 4, `w2` 1, `w3` 3, `w4` 4, `w5` 6, `w6` 3, `w7` 10). Los otros 7 no los ejecuta ningún spec, y entre ellos está el camino principal de mostrar un reto. **Hallazgo, sin tocar:** ningún spec ejecuta `_hdl_RETO_SOLICITAR` más allá de su primer `return` (la escritura `w1`, el guard de `retoActual` —que está antes del segundo NACK— y `_buscarSiguienteRetoEnCola` solo se ejecutan ahí, y los tres miden 0 ejecuciones en los 583 tests); el spec 105 lo nombra en su cabecera pero ninguna otra línea suya lo toca. Una **sonda de dos tests, solo en la copia** (`RETO.SOLICITAR_RETO` con una parada con reto y `retoActual` sin crear; `RETO.COMPLETADO` en CASA con el último reto de la cola y sin clave de elemento) ejecuta `w1`, `l4` y `l7` y la lectura de `_buscarSiguienteRetoEnCola`, y con la lectura deliberada de control cae `ZZ-1` y queda 1 aviso; con ella son 14 de 18 los sitios medidos. Los 4 que nadie ejecuta (el fallback de `retoActual` de `estadoPadre`, el literal de CASA «Modo casa: limpiar estado del reto, no avanzar», el «Sin clave: fallback directo, respetar modo» del fin de audio y la rama `else if (tieneReto)` de la configuración del botón de retos) son borrados de una clave sin lector: su argumento es el censo, no la ejecución. **Decide el usuario:** convertir la sonda en un spec del repo (cubriría el camino principal del reto, que hoy no vigila nada). **Registros menores, sin tocar:** los specs 103 (`:75`) y 120 (`:83`) siguen creando literales de `retoActual` con `completado: false`, sin que nadie lo lea; `tests/flujo_bidireccional_exhaustivo.json:350` (fichero descriptivo que nada referencia) todavía dice `estado.retoActual.completado = true`. **Trampa de la técnica:** la petición con `keepalive` de un aviso puede aparecer en el registro del servidor después de que su test termine, así que el recuento por fase puede arrastrar un aviso de la fase anterior (un `cov-l7` suelto en la variante simple, cuyo fichero tenía 0 avisos); ante un recuento que no cuadra, mirar el fichero antes que el registro. No se lanzaron firefox, webkit ni los dos móviles.
- **Paso 5 de 5 aplicado — K-41 HECHA (2026-10-05, `c2aaf46`; la tabla generada de §37.2 regenerada en `f30c908`).** Quitadas las 17 escrituras de `idioma` (7), `iniciada` (5), `coordenadasCargadas` (2), `terminosAceptados` (2) y `timestampInicio` (1) de `codigo-padre.html`, y los bloques que solo existían para ellas: el `if (!estado.seleccion) estado.seleccion = {}` con su comentario (handlers de `IDIOMA_SELECCIONADO` y `TERMINOS_ACEPTADOS`, y las dos ramas de `COORDENADAS_CARGADAS`), el `if (estado.seleccion)` del tiempo agotado con su comentario numerado y, en el handler de `AVENTURA_ACTIVADA`, la desestructuración de `terminosAceptados` y `timestamp`; `estado.seleccion.aventura` y `.activada` se leen (`:7359`, `:7888`, `:11424` antes del paso) y se quedan. Cada escritura tenía su propio guard, así que `estado.seleccion` puede no existir y los tres lectores lo encadenan con `?.`. La guía describe en 18 sitios lo que guarda cada handler de selección (`aventura` en `estado.seleccion`; el idioma en `globalThis.idiomaSeleccionado` y `localStorage`) y que del payload de `AVENTURA_ACTIVADA` el padre solo lee `aventura` e `idioma`. Verificado antes de aplicar, en una copia fuera del repo: ninguna lectura de los cinco nombres (el único «lector» era `idioma || estado.seleccion.idioma`, que se va con su escritura), ningún uso del objeto `seleccion` entero y ningún spec que toque `estado.seleccion`; los 583 tests del proyecto chromium idénticos a la base con el paso aplicado, con la copia de cobertura (las 17 escrituras sustituidas por avisos) y con la trampa de lectura (`estadoPadre.seleccion` devuelve siempre un objeto con los cinco campos no enumerables que lanzan y avisan): cero lecturas. **Cobertura:** los 583 tests ejecutan 6 de las 17 escrituras (la activación —`i7`, `t1`, `n4`, `m1`—, la aventura seleccionada —`i5`— y las coordenadas cargadas con éxito —`c1`—, 2 veces cada una); las otras 11 no las ejecuta ningún spec. Una **sonda de 5 tests, solo en la copia** (handlers de idioma, preparar hijos, términos y coordenadas con error; el diálogo de vuelta rápida; el modal de tiempo agotado; y los dos caminos del diálogo de reanudación) las ejecuta, así que las 17 quedan medidas; con la sonda la trampa tampoco salta y su control positivo (una lectura deliberada en el handler de idioma y otra en el de términos) deja un aviso en cada una. Detalle de la sonda: `ejecutarElegirOtra` solo toca `estado.seleccion` si ya existe, así que el test crea el objeto antes de confirmar (sin eso las dos escrituras no se ejecutaban y el test pasaba igual). `codigo-muerto` baja de 5 a 4 candidatas (`coordenadasCargadas`), justo lo esperado; las 4 que quedan no son de este estudio: `_testHeartbeatPauseResume` (`codigo-padre.html`) y `centroMapa`, `errorCentro` y `mapaInteractivo` (`js/funciones-mapa.js`). Tras aplicar: los mismos 583 tests en el árbol real, el fichero coincide byte a byte con la copia verificada, parseo, lint, `verificar-frames` y `verificar-esperas` idénticos a HEAD y `verificar-mensajeria` solo cambia números de línea. La regeneración de §37.2 cambia 63 de sus 127 filas (números de línea del padre) y deja `verificar-citas` en 86 OK y 46 SIN RESOLVER sobre 132 citas por número de línea (antes 47 MAL y 46 SIN RESOLVER). **Efectos cruzados medidos, SIN TOCAR (decide el usuario):** (a) el emisor `En-busca-del-tesoro.html` sigue mandando `terminosAceptados` y `timestamp` en `SELECCION.AVENTURA_ACTIVADA` y `terminosAceptados` lo usa su propio `estadoComponente` (el latido de la selección también lo manda); si el emisor deja de mandarlas es un cambio de contrato del bus; (b) `_hdl_SELECCION_TERMINOS_ACEPTADOS` queda solo con un `info` y un `debug` (recibe `{ aceptados }` y lo escribe en el log): retirar handler y emisor es una decisión aparte, y encaja con K-46 («handlers que solo escriben en el log»), que ya no puede tratarlo como el que guarda un campo; (c) `_hdl_SELECCION_PREPARAR_HIJOS` solo anota `aventura`: el `idioma` del payload solo llega al log; (d) K-19: las dos copias de «abandonar» (`ejecutarElegirOtra` en el diálogo de reanudación y `_elegirOtra` en el de vuelta rápida) pierden `idioma` e `iniciada` y quedan casi idénticas, así que la función común de K-19 A es ahora más corta; (e) `_hdl_DATOS_COORDENADAS_CARGADAS` solo escribe en el log: la condición de K-46 B («`seleccion.coordenadasCargadas` ya no existe») se cumple. **Pendiente de decidir, resumen de K-41:** `estadoPadre.estadoHijos` entero (el `Map` que solo se escribe, ver el paso 3), `estado.paradasConfirmaciones`, y convertir las dos sondas (`RETO.SOLICITAR_RETO` y los handlers de selección, ambas en el scratchpad de la sesión y sin versionar, como `campos.cjs`, `enteros.cjs`, `estado-entero.cjs` y los `aplica-k41*.cjs`) en specs del repo o versionar los instrumentos en `tools/estudio-caminos/`. No se lanzaron firefox, webkit ni los dos móviles.
- **Revisión (2026-10-13): lo que el instrumento no ve, y lo que quedó «por leer».** El instrumento de esta entrada parte de las rutas *escritas*: un campo que solo figura en el literal inicial y que nadie vuelve a tocar no es para él una escritura, y un interruptor que nace con un valor y nadie cambia le sale como leído. Censo nuevo, frame a frame, con dos scripts del scratchpad de la sesión, sin versionar: `campos-estado.cjs` (por cada campo del objeto de estado de un fichero: si está en el literal, sus escrituras, sus lecturas —también por desestructuración— y, como residuo impreso, cada uso del objeto entero) y `claves-literal.cjs` (para el padre, cuyo estado está en `globalThis`: el nombre desnudo de cada clave del literal en `*.html`, `js/*.js`, `tests/` y la guía, fuera del propio literal; 34 claves, 0 líneas del literal sin casar). Cada nombre de la tabla se repitió con búsqueda desnuda en todo el repositorio. Ninguno de los objetos de estado de los hijos está publicado en `globalThis` (la única publicación `globalThis.estado… =` del repositorio es `estadoPadre`, en el padre), así que un spec no puede leerlos.

| Dónde | Campo | Qué hay |
|---|---|---|
| hijo2, `estadoComponente` | `watchId`, `ultimaActualizacionGPS`, `intervaloMinimo`, `posicionUsuario`, `ultimoHeading` | solo la línea del literal (`coordenadas-hijo2.html:448-451, 488`) |
| hijo2, `estadoComponente` | `radioLlegada`, `recorridoSuficiente` | el literal (el primero, con seis líneas de comentario) y una escritura cada uno en `_aplicarDatosEstado` (`:1246`, `:1249`); la llegada al tramo usa los valores que trae el mensaje (`:1370`, `:1398`), no los guardados |
| hijo2, `estadoComponente` | `botonesActivos` | literal de seis claves (`:472-479`) y una escritura de `.ubicacion` (`:2280`); nadie lo lee |
| hijo2, `estadoComponente` | `controlesHabilitados` | nace en `true` (`:462`) y nadie lo cambia: la rama `if (!controlesHabilitados)` de `actualizarEstadoBotones` (`:684-687`) no corre nunca |
| hijo3, `estado` | `inicializado` | solo el literal (`audio-hijo3.html:542`) |
| hijo4, `estado` | `inicializado` | el literal y una escritura (`retos-hijo4.html:503`, `:1724`) |
| hijo5, `estado` | `gpsActivo`; `gpsPermisos`, `gpsPrecision`, `gpsError`, `ultimaUbicacion` | el primero, literal y una escritura (`boton-casa-hijo5.html:597`, `:757`); los otros cuatro, solo el literal (`:598-601`) |
| `js/funciones-mapa.js`, `estadoMapa` | `timestamp` | el literal (`:418`) y cinco escrituras (`:1544`, `:1573`, `:2322`, `:2569`, `:2657`); `estadoMapa` no sale entero del módulo (residuo: comentarios y el bucle que lo pone todo a `null` al destruir el mapa) |
| padre, `estadoPadre` | `coordinacion` (`{ cacheTTL }`) | solo el literal (`codigo-padre.html:4163-4165`); la constante `esMovil` del padre (`:4042`) existe solo para él |
| padre y literal de `state.estadoPadre` del state-manager | `mapaInicializado`, `inicializacionPromises` | solo los dos literales (`codigo-padre.html:4144, 4146`; `js/state-manager.js:39, 41`); la guía los enumera en el listado del estado del state-manager |
| padre, `estado.audioActual` | `timestamp`, `origen`, `error` | tres, una y una escrituras (`:12116-12117`, `:12260`, `:12376-12377`) más la clave `timestamp` del literal; nadie los lee. El objeto entero solo va al payload de `vv_progreso` (`:4290`), y de ese payload nadie lee `audioActual`: `_restoreApplyState` y sus filtros leen nueve claves (`timestamp`, `aventura`, `idioma`, `indiceProgreso`, `paradaActual`, `tiempoRestante`, `tramoSkipsUsados`, `ficha`, `elementoActualId`) y el diálogo de reanudar, dos (`indiceProgreso`, `totalParadas`). En el mismo handler, el `if (!estado.audioActual) estado.audioActual = {}` va justo delante de la asignación del objeto entero |

  Sin campos sin lector: la selección (seis campos, todos leídos), hijo1 (`estadoMenu` y `estadoTemporizador`), hijo6 (su `estadoPadre` es el payload de `CHAT.ESTADO_PADRE`). Sin objeto de estado con ese nombre: `mapa-completo.html`, `puzzle.html` y `video-intro.html` (0 literales `estado… = {`). **Fuera de esta tanda, con motivo:** `estado.gps.permisos`, `.precision` y `.ultimaUbicacion` (son el espejo que escribe `sincronizarEstadoGPSConPadre`, y la guía lo describe como diseño: K-08); el resto del literal de `state.estadoPadre` (K-07); `estado.paradasConfirmaciones` (decide el usuario); `hijosPreparados` y `gps.visualActivo` (sondas de spec). **Hallazgo aparte, sin tocar:** hijo5 lee `estado.ubicacionUsuario` (`boton-casa-hijo5.html:702`, `:715`) y nadie lo escribe (búsqueda desnuda: solo esas dos líneas en el fichero), así que en AVENTURA `solicitarParadasDelPadre()` sin `forzar` (`:879`, `:1255`) sale siempre por el aviso «No hay ubicación de usuario disponible»; hijo5 es la herramienta de desarrollo.
- **Aplicada la tabla entera (2026-10-13, `c9463f8`).** 68 líneas menos en siete ficheros (72 quitadas, 4 de ellas reescritas; `codigo-padre.html`, `coordenadas-hijo2.html`, `audio-hijo3.html`, `retos-hijo4.html`, `boton-casa-hijo5.html`, `js/funciones-mapa.js` y `js/state-manager.js`), todas por script con el texto de cada línea comprobado. Con los campos se van lo que solo existía para ellos: la constante `esMovil` del padre y su cabecera (más un comentario suelto, «Detección estricta de móvil», que no introducía nada), el `if (!estado.audioActual) estado.audioActual = {}`, la rama `if (!controlesHabilitados)` de hijo2, y `recorridoSuficiente` y `radioLlegada` de la desestructuración de `_aplicarDatosEstado` (los lee, del mismo mensaje, el handler que decide la llegada). `estado.audioActual` queda en `{ id, estado }` y `vv_progreso` en diez claves. **Comprobación:** tras aplicar, búsqueda desnuda de cada nombre retirado en `*.html` y `js/*.js`: 0, salvo `mapaInicializado` (la clave del objeto que devuelve `diagnosticarMapa()`, otro objeto) y `gpsPermisos` (el de `estadoMapa`, que se lee); lint limpio; `verificar-frames` y `verificar-esperas` sin diferencias; el spec 124 gana FG-10 (el progreso guardado lleva exactamente las claves que la reanudación lee), en rojo antes por `audioActual` y en verde después; chromium entero, 635 de 635. No se lanzaron firefox ni los dos móviles en este paso. **Frames no tocados:** selección, hijo1, hijo6, `mapa-completo.html`, `puzzle.html` y `video-intro.html`, por lo que dice el párrafo de arriba (sin campos sin lector, o sin objeto de estado); `git show c9463f8 --stat` lista los siete ficheros tocados.
- **Dos restos, registrados el 2026-10-19 con el principio del usuario (sin código muerto).** (1) `estado.paradasConfirmaciones` solo se escribe, en `_hdl_NAVEGACION_CAMBIO_PARADA_CONFIRMADO` (`codigo-padre.html:11864-11866`); búsqueda desnuda: esas tres líneas y ningún spec. Sin él, ese handler se queda en un log (K-46). (2) hijo5 lee `estado.ubicacionUsuario` (`boton-casa-hijo5.html:697` y `:710`) y nadie lo escribe (búsqueda desnuda: los demás `ubicacionUsuario` del repositorio son claves de otros mensajes). La condición `!forzar && estado.modo === 'aventura' && !estado.ubicacionUsuario` se queda, en la práctica, en `!forzar && estado.modo === 'aventura'`: en AVENTURA las dos peticiones sin forzar (al confirmar el padre que hijo5 está listo y al reconectarse) no salen nunca, y la forzada tras `CAMBIO_MODO` sí. Arreglo sin cambio de comportamiento: la condición sin el campo, con un log que diga lo que pasa, y la petición sin las claves que el padre no lee (K-36).
- **Aplicado (2026-10-19, `177e731`).** Los dos restos, como se registraron: fuera `estado.paradasConfirmaciones` (el handler queda en su log), y hijo5 con la condición sin el campo (`!forzar && estado.modo === 'aventura'`, lo que ya hacía) y la petición sin claves (K-36). Chromium, los doce specs que tocan hijo5 y las peticiones de paradas y coordenadas: 54 de 54. Guía: la fila del handler en §26.12.1.
- **Otro campo sin lector, en hijo2 (registrado el 2026-10-19).** El handler de `NAVEGACION.RESPUESTA_DATOS_PARADAS` de hijo2 guarda `estadoComponente.arrayParadasLocal` (`coordenadas-hijo2.html:1901`) y solo lo lee el log de ese mismo handler (`:1920` y `:1923`); el resto del handler sí sirve (la parada actual, `datosRecibidos` y el estado de los botones). No es el `arrayParadasLocal` de `js/funciones-mapa.js` (`:389`), que es otra variable. Por aplicar: fuera el campo y su parte del log.

#### Familia M — Lo que se publica y nadie usa

- **K-04 A retiró tres de los campos (2026-10-04).** `estadoMonitoreo.metricas.ultimaActividad` y `estadoMonitoreo.intervaloMetricas` desaparecieron con `js/monitoreo.js`, y `estado.monitoreo.metricas.errores` con el bloque `estado.monitoreo` entero del padre y del state-manager. Salen de la lista de esta entrada; el resto no cambia.

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

- **Revisión (2026-10-03, R2.9).** La cadena completa, por nombre desnudo en todo el repo: state-manager (`gpsPendientes`, `getGpsPendientes`, `agregarMensajeGPSAPendientes`, `limpiarGpsPendientes` y sus tres claves del objeto-API) y `js/mensajeria.js` (`reenviarMensajesGPSAPendientes`, con una sola llamada, en la rama `estabaDesconectado && hijoId === 'hijo2'` de `procesarHeartbeatResponse`, `:1195`); ni un spec ni una herramienta nombra ninguna. Retirarla quita un `debug` y una toma del mutex `heartbeat` en la reconexión de hijo2; la llamada va después del `atomicUpdateHeartbeat` y la función lleva su propio `try`. Es el bus (regla 1) pero no cambia su contrato: nunca envía nada, porque la cola está siempre vacía. La guía la cita en L2093, L2098, L2141, L3626, L3678-3681 y L6435-6436. Comparte `procesarHeartbeatResponse` con K-11, en líneas distintas.

- **K-42 A aplicada (2026-10-04).** Retirados `reenviarMensajesGPSAPendientes` y su llamada en `procesarHeartbeatResponse` (`js/mensajeria.js`), y `gpsPendientes`, `getGpsPendientes`, `agregarMensajeGPSAPendientes`, `limpiarGpsPendientes` y sus tres claves del objeto-API (`js/state-manager.js`). La guía deja de describir la cola (el campo, su nota, los accesores, el diagrama del latido, la fila de `procesarHeartbeatResponse` y el resumen del módulo) y la sección «Infraestructura GPS pendiente» pasa a «Envío del estado GPS a hijo2», con el flujo real. **Corrección a la revisión:** la guía nombraba la cadena en tres sitios más de los listados (L504, L2102 y L10907). Una búsqueda desnuda, insensible a mayúsculas, de `gpsPendientes` y `GPSAPendientes` en todo el repo no deja restos. **Medido** con una sonda de chromium (el módulo real y el padre): antes, al reconectar hijo2 el bus escribe el `debug` «No hay mensajes GPS pendientes para hijo2» y con hijo3 no escribe nada; después, la reconexión de hijo2 y la de hijo3 marcan igual su estado (`hijosDesconectados`, fallidos a 0) y solo desaparece ese `debug`; las cuatro funciones ya no existen. La librería de `tools/codigo-muerto.js` ya no lista las cuatro entre los exports, y su categoría 5 da muertos del todo 5 (antes 6), solo specs 3 y uso interno 18 (antes 19). 126 tests de 19 specs de latido, bus y state-manager, todos en verde en chromium; `npm run lint` sale con 0.

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
- **Aplicada la opción B (2026-10-04).** `chat-hijo6.html`: la bandera `estadoPadreRecibido` pasa a `true` cuando llega `SISTEMA.PADRE_DATOS` o `CHAT.ESTADO_PADRE` con `datos`; si falta `rescate`, el aviso va a `debug` antes de la bandera y a `error` después. La guía lo dice en §27, junto a `construirFAQ()`. **Medido** con una sonda de chromium fuera del repo (service workers bloqueados, el escenario de OB-3): antes del cambio, dos ejecuciones con un `error` antes del `PADRE_DATOS`, dos construcciones y 47 preguntas; después, dos ejecuciones con 0 `error`, el `debug` nuevo, las mismas dos construcciones y 47 preguntas. La segunda apertura no escribe ningún `error` y hace una construcción, antes y después. Dos mutaciones servidas por la red validan la sonda: con la bandera siempre `true` vuelve el `error` de la construcción inicial; con un saludo sin `rescate` el `error` sale tras el `PADRE_DATOS` y la pregunta del atasco falta hasta la segunda apertura (46 preguntas, luego 47). Specs 71 y 47: 20 de 20 en chromium (dos repeticiones). `npm run lint` sale con 0, y eslint marca como `no-undef` una variable mal escrita en una copia mutada del fichero. La sonda tuvo tres defectos propios, hallados al contrastarla con el código y no con su salida (un contador que miraba el nodo equivocado, un `textContent` que incluía el texto del `<script>` y un directorio de resultados que Playwright vacía en cada ejecución); ninguno afecta a lo medido al final.

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

- **Revisión (2026-10-03, R2.9).** `RETO.MOSTRADO`: emisor único hijo4 (`retos-hijo4.html:1368`, después de pintar el reto y de fijar `estado.retoActualId`) y handler único del padre (`codigo-padre.html:11128`, que escribe un log y responde `RETO.CONFIRMADO`); `RETO.CONFIRMADO`: handler único hijo4 (`:1681`). Búsqueda desnuda en todo el repo: nadie más, y ningún spec los nombra, de modo que el viaje es autocontenido. `DATOS.TEXTOS_CARGADOS`: emite hijo2 (`coordenadas-hijo2.html:1876` y `:1892`, la de error) y atiende el padre (`:12756`, solo log); su rama de error es el único aviso que recibe el padre si hijo2 no pudo cargar los textos (queda un `error` en el log, sin recuperación). El spec 106 las cita en la cabecera, pero sus aserciones miden que no llega `DATOS.CARGADOS_RECIBIDO`. **Asimetría con K-41:** `DATOS.COORDENADAS_CARGADAS` solo asigna `estado.seleccion.coordenadasCargadas`, un candidato de K-41; retirado ese campo queda solo-log como `TEXTOS_CARGADOS`, y retirar uno y no el otro sería arbitrario, así que K-41 va antes. Retirar los tres tipos mueve cifras que la guía y las herramientas fijan: `TIPOS_MENSAJE` de 94 a 91 (guía L10904, L14281 y la sección generada por `verificar-mensajeria --todos`), los handlers permanentes del padre (L13039) y las filas de §26.12.
- **Uno más al quitar `estado.paradasConfirmaciones` (K-41, 2026-10-19).** El handler de `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` del padre se queda en un log. Entra en la decisión de esta entrada: el contrato del bus lo decide el usuario (regla 1).

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
- **Aplicada la opción B (2026-10-04).** `coordenadas-hijo2.html`: retirados la regla `.modo-aventura #btn-avanzar.activo`, la clase `modo-casa` del `<body>` (queda `hijo2-container`) y la línea que reescribía `className` en `_procesarDatosPadre`; la guía deja de nombrar una clase de modo en hijo2 (inicialización, `PADRE_DATOS`, `CAMBIO_MODO` y el handshake). **Medido** con el marco de los specs (`marco-vacio.html` hace de padre, mensajes reales del bus) y la secuencia arranque, `PADRE_DATOS` casa, `CAMBIO_MODO` aventura, `PADRE_DATOS` aventura y `CAMBIO_MODO` casa. Antes: la clase de hijo2 pasa de `modo-casa hijo2-container` a `modo-aventura hijo2-container` solo con el `PADRE_DATOS` de aventura y ahí se queda aunque después llegue `CAMBIO_MODO` casa; `#btn-avanzar` con la clase `activo` pasa de no animarse a `pulse` solo con ese mismo mensaje y sigue pulsando en CASA. Después: la clase es `hijo2-container` en los cinco pasos y la animación es `none` en todos; hijo3 e hijo4, sin tocar, dan una salida idéntica. Una mutación servida por la red que repone la línea devuelve la clase `modo-*` a hijo2 pero no el `pulse`, porque la regla ya no está, de modo que la sonda distingue las dos mitades. **Único cambio visible, en un camino estrecho:** un `#btn-avanzar` con la clase `activo` que, tras un `PADRE_DATOS` de aventura (hijo2 recargado a mitad de aventura), pulsaba, ya no pulsa; por el camino normal (CASA a AVENTURA con `CAMBIO_MODO`) no pulsaba nunca. 173 tests de 28 specs que cargan hijo2 o ejercitan el modo, todos en verde en chromium; `npm run lint` sale con 0. La regla `.hijo2-container body, .hijo2-container html` (`:56`), que no puede casar nunca, se deja: está fuera de esta decisión.

- **Revisión (2026-10-03, R2.9).** Búsqueda desnuda de `modo-aventura`, `modo-casa`, `hijo2-container` y `hijo3-container` en html, js, css y specs: hijo2 escribe la clase en `coordenadas-hijo2.html:332` y `:1555` y solo la lee la regla de `:213`; la regla `.hijo2-container body, .hijo2-container html` (`:56`) no puede casar nunca, porque el `body` es el `.hijo2-container` y no su descendiente. Ningún spec fija la clase de hijo2 (31 MD-* y 84 miran hijo3 e hijo4): B no rompe ninguno; A necesitaría uno.

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

- **Revisión (2026-10-03, R2.9).** Leído línea a línea contra el código vigente (`boton-casa-hijo5.html:390-409`, `:563-575`, `:640-646` y `:1137-1175`): coincide con la entrada. Ningún spec cubre el resalte de hijo5 (búsqueda desnuda de `parada-tramo-btn`, `'actual'` y `'activa'` en `tests/`): A necesita uno, rojo hoy porque tras `CAMBIO_PARADA_CONFIRMADO` el botón pierde `actual`.
- **K-48 A aplicada (2026-10-04).** `boton-casa-hijo5.html` marca la parada actual con una sola función, `_marcarBotonActual(index)`, que llaman los cuatro caminos: el click (que además guarda el índice), la generación de la lista, `NAVEGACION.CAMBIO_PARADA` y `NAVEGACION.CAMBIO_PARADA_CONFIRMADO`; estos dos por `_resaltarBotonParada`, que resuelve el índice en `estado.aventuraParadas` y lo guarda en `estado.paradaActualIndex`. El botón se busca por `data-punto-index`, no por su posición entre los botones. Desaparecen la clase `activa` (sin estilo), el bucle de `data-padreid` (que nadie asigna) y el parámetro `btn` del manejador del click. La guía corrige sus descripciones del resalte (seis frases) y lista el spec 119 (116 specs; catálogo regenerado). **Spec nuevo 119** (4 tests): un click marca solo el botón pulsado (PA-1), `CAMBIO_PARADA` del padre marca el de esa parada (PA-2), `CAMBIO_PARADA_CONFIRMADO`, con y sin el prefijo `padre-`, no quita la marca (PA-3) y un cambio de parada que no empieza en hijo5 sustituye a la marca del click (PA-4). **Rojo antes de verde:** con el código anterior caen PA-2 (el cambio de parada no marcaba nada visible), PA-3 (la confirmación quitaba la marca) y PA-4 (la marca del click no cedía), y PA-1 pasa. Cambia lo que ve la herramienta (ver §24): la marca sigue los cambios de parada del padre y sobrevive a su confirmación. 142 tests de 24 specs de hijo5, mapa, modo y bus, todos en verde en chromium; `npm run lint` sale con 0.

##### K-49 — Al entrar en CASA, los carteles de distancia GPS se cierran por dos caminos, cada uno con una parte, y el test que lo vigilaba no veía ninguno — ✅ (medido: M-20; decisión abierta)

- **Dónde.** `codigo-padre.html` (líneas de `066833e`), `_hdl_SISTEMA_CAMBIO_MODO` (`:7571`). Al pasar a CASA el handler cierra los carteles de distancia y precisión GPS
  por dos sitios. (a) La rama CASA (`:7610-7647`) llama a `globalThis._ocultarTodasPantallasDistanciaGPS?.()` (`:7628`), que es
  `_ocultarOtrasPantallasDistanciaGPS(null)` —quita la clase `show` a `gps-out-of-range-overlay`, `foto-perdido-overlay`, `foto-lejos-overlay`,
  `foto-desviado-overlay`, `foto-fuera-rango-overlay` y `gps-precision-overlay`, `:6219-6227`— más `_limpiarSnoozeOverlaysDistancia()` (`:6229-6232`).
  (b) Al final de la secuencia, y solo si el cambio de modo tuvo éxito, `_gestionarGpsSegunModo` (`:7745`; definida en `:7562-7569`) llama a
  `_gestionarGpsOverlays` (`:7552-7560`), que en CASA ejecuta `hideNextEntityOverlay()` (`:7175-7183`, que a su vez llama a `hideGpsOutOfRangeOverlay()` si existe
  `#gps-next-entity-overlay`) y `hideGpsOutOfRangeOverlay()` (`:6145-6160`): para el temporizador `__VV_GPS_OVERLAY_TIMER` —la cuenta atrás de 15 s
  del botón de reintento, `:6059-6060`—, vacía la cuenta atrás, rehabilita `#gps-error-action`, quita `show` al cartel de bloqueo y oculta
  `#gps-next-entity-overlay`.
- **Lo que no cuadra.** Los dos caminos se solapan en un solo cartel, `gps-out-of-range-overlay`, y cada uno hace algo que el otro no. (a) cierra los
  otros cinco y borra el snooze, pero del cartel de bloqueo solo quita `show` (lo único que hace `_ocultarOtrasPantallasDistanciaGPS`): la cuenta atrás de su
  botón, si estaba en marcha, sigue y termina sola en 15 s como máximo (`_startOverlayCountdown`, `:6641-6655`, que rehabilita el botón al llegar a cero). (b) para
  esa cuenta atrás y rehabilita el botón al instante, y oculta el cartel de siguiente entidad, pero no toca los otros cinco. Es el mismo hecho, «qué se cierra
  al entrar en CASA», repartido en dos mecanismos parciales: quien retire uno creyendo que el otro basta deja algo sin cerrar según cuál. La guía describe los
  dos pasos (§2.5, el diagrama de AVENTURA → CASA, y la fila de CASA de la tabla de modos); en la tabla de modos de §2 y en §11 nombraba solo tres de los seis carteles, y se corrige (G-47).
- **El test que lo vigilaba era ciego.** `tests/e2e/30-casa-no-fuga-aventura.spec.js` CM-6 comprobaba un solo cartel, `gps-out-of-range-overlay` —justo el que
  cierran los dos caminos—, y seguía en verde con la llamada (a) quitada de `codigo-padre.html`: 4 passed en los cuatro proyectos. «El segundo camino esconde
  que el primero está roto», aplicado a un test.
- **Medido (M-20).** (1) Sonda desechable en chromium: con el cartel de bloqueo visible, AVENTURA → CASA llama dos veces a `classList.remove('show')` sobre él, una
  desde `_ocultarOtrasPantallasDistanciaGPS` (la llamada explícita) y otra desde `hideGpsOutOfRangeOverlay` (`_gestionarGpsOverlays`); con la llamada explícita
  neutralizada lo cierra igualmente la segunda. Con los seis carteles visibles tras entrar en AVENTURA, y ambos caminos activos, no queda ninguno visible
  (los otros cinco se cierran una vez, por (a)); con (a) neutralizada quedan abiertos cinco: `foto-perdido`, `foto-lejos`, `foto-desviado`, `foto-fuera-rango` y
  `gps-precision`. Entrar en AVENTURA no cierra el cartel de bloqueo. (2) Con CM-6 de seis carteles (`066833e`) y roturas de `codigo-padre.html` provocadas una a una, en
  los cuatro proyectos: sin rotura 4 passed; sin la llamada (a) 4 failed; sin `_gestionarGpsOverlays` en CASA (un `return;` tras su log) 4 passed —el otro camino
  cubre los seis y nada ve esa pérdida—.
- **Consecuencia.** Hoy no hay efecto visible: los dos caminos se ejecutan y todo se cierra. El riesgo está en el mantenimiento: cada camino es parcial, la pérdida
  del segundo no la detecta ningún test y, si alguien deja solo uno, queda algo sin cerrar según cuál (cinco de los seis carteles si se deja solo (b); si se deja
  solo (a), la cuenta atrás del botón del cartel de bloqueo seguiría hasta 15 s con el cartel ya oculto). El test sí está corregido: CM-6 comprueba los seis
  carteles, mostrados después de entrar en AVENTURA, y se pone en rojo si falta (a).
- **Pendiente: decisión** (código del padre; si se hace bien no cambia lo que ve el usuario, y la guía §2.5 cambiaría). *A) una sola función que cierre
  los seis carteles, borre el snooze, pare la cuenta atrás, rehabilite el botón del cartel de bloqueo y oculte el de siguiente entidad*, llamada desde un solo
  sitio —la rama CASA del handler, que corre al empezar y no depende de que la propagación a los hijos tenga éxito—; `_gestionarGpsOverlays` se queda con el
  log — **recomendada**: un camino, y el test de seis carteles pasa a vigilarlo entero. *B) dejar los dos*,
  como describe la guía. *C) dejar solo `_gestionarGpsOverlays` y ampliarlo a los seis carteles y al snooze*: el cierre pasaría a ocurrir al final de la secuencia
  y solo si el cambio tiene éxito.

- **Corrección (2026-10-03, R2.9).** `_ocultarTodasPantallasDistanciaGPS` (`codigo-padre.html:6229`) tiene **tres** llamantes y no solo la rama CASA: `_hdl_SISTEMA_CAMBIO_MODO` (`:7628`) y dos flujos de AVENTURA, `_hdl_NAVEGACION_GPS_DENTRO_DE_RANGO` (`:11250`; hijo2 lo manda una sola vez al volver a rango, en `_procesarDentroDeRango`) y `_hdl_NAVEGACION_MOSTRAR_UBICACION_POLYLINE` (`:11408`). Los dos últimos están en Script 2 y la llaman por nombre desnudo gracias a `globalThis._ocultarTodasPantallasDistanciaGPS` (`:6233`); las dos llamadas van en `try`, así que una errata dejaría solo un log. La opción A tiene por tanto dos lecturas: **A1**, una función nueva solo para CASA, que deja dos funciones casi iguales; y **A2**, ampliar `_ocultarTodasPantallasDistanciaGPS` con parar la cuenta atrás, rehabilitar `#gps-error-action` y ocultar el panel de siguiente entidad, lo que cambia también esos dos flujos de AVENTURA: al volver a rango o pulsar ubicación se cortaría además la cuenta atrás y se ocultaría el panel que el usuario abrió desde el botón del cartel de bloqueo. Los specs en el radio son el 30 (CM-6), el 56 (`#gps-error-action`) y el 20 (PC-1, `MOSTRAR_UBICACION_POLYLINE`); ninguno ejercita `DENTRO_DE_RANGO` con un cartel abierto. K-17 comparte código con esta entrada: sus reintentos «desde overlay» acaban en las funciones `show*` y en este cierre.

#### Familia S — Estado que sobrevive entre aventuras, lo guardado sin versión, reservas mudas y orden de arranque

Un barrido más (R2.9, 2026-10-03), hecho con ángulos que los 28 ejes y las familias A a Q no cubrían: qué ve una segunda aventura en la misma carga de la página, qué pasa con lo guardado cuando cambian los datos, qué reservas literales sustituyen a un dato que falta, qué import puede matar un script entero y qué usa Script 1 de lo que define Script 2.

##### K-50 — «Elegir otra aventura» en producción deja la parada de la anterior: la nueva aventura arranca sin primera parada — ✅ (medido: M-22; decisión abierta)

- **Dónde.** `ejecutarElegirOtra` y `_elegirOtra` (`codigo-padre.html:4703`, `:4824`) reinician `aventuraSeleccionada`, `idiomaSeleccionado`, `estado.seleccion`, `tiempoRestante`, `tramoSkipsUsados`, `paradasCompletadas` y la brújula. No tocan `estado.modo`, `estado.paradaActual`, `elementoActual`, `indiceProgreso` ni `retoActual`. La página no se recarga y los hijos tampoco.
- **La cadena (leída).** (1) `estado.paradaActual` solo se pone a `null` en `limpiarRecursosPorModo` (`js/app.js:793`; búsqueda desnuda de todas sus asignaciones: `codigo-padre.html:4469`, `:4541`, `:11828` y `app.js:793`). (2) Esa función solo corre en un cambio real de modo: `manejarCambioModo` (`app.js:508-530`) con el modo pedido igual al actual resincroniza los hijos y omite la limpieza y el prewarm, y `estado.modo.actual` solo cambia en `app.js:574` y `:898`. (3) La activación en producción manda `AVENTURA` directamente (`_modoInicio`, `codigo-padre.html:13150`); el otro camino de activación entra por `CASA` (ver §24). (4) La primera parada la fija `ensureDefaultParada` (`:4521`), que sale en su primera línea si hay `paradaActual` y solo se llama desde `_activarHeartbeatAventura` (`:7491`) y desde `_restaurarProgresoRest` (`:5012`).
- **Medido (M-22).** Con el padre y los cinco hijos reales, por el camino de activación de producción: tras activar A, `paradaActual` es `Av1-P-0`; «Elegir otra aventura» no la cambia; al activar B el log dice «Modo ya establecido a 'aventura' — resincronizando hijos sin repetir efectos» y «Ya existe paradaActual: Av1-P-0», y la parada sigue siendo `Av1-P-0`, que no está en las 67 paradas de B (la primera es `REF-1`). hijo2 no recibe ningún `NAVEGACION.CAMBIO_PARADA` nuevo. En el control (`casa` y después `aventura`, el recorrido del otro camino de activación, ver §24) sí corre la limpieza, la parada pasa a `Av2-P-0` y hijo2 la recibe.
- **Por qué no se veía.** El otro camino de activación (ver §24) entra por `CASA` y pasa a `AVENTURA` con un cambio real de modo, que sí limpia. La equivalencia entre los dos caminos se cumple desde la primera activación, no en esta. Los specs 19 (TR-1) y 25 (BR-10) pulsan «Elegir otra aventura» y solo comprueban `tiempoRestante` y la brújula.
- **Efecto añadido del control.** Al entrar en CASA se congela la parada de A en `estado.paradaRealCongelada` y al volver a AVENTURA se despacha contra los datos de B: aviso «Parada con ID Av1-P-0 no encontrada en DATOS_PADRE». El otro camino de activación acaba bien, pero también arrastra una parada de A.
- **Lo que la medición no cubre.** Reproduce la activación con los mensajes que manda (`SELECCION.AVENTURA_SELECCIONADA` con `distribuirDatosAventura`, y el `SISTEMA.CAMBIO_MODO` a aventura), no con la pantalla de selección real ni con `AVENTURA_ACTIVADA` entero; solo chromium. Mientras se elige, `aventuraSeleccionada` es `null` y `procesarPosicionGPSParaAventura` sale en «Ruta completada o secuencia de la aventura no disponible» (`js/funciones-mapa.js:2913-2917`): no hay fuga del GPS en esa fase. El efecto visible exacto en el mapa y en hijo2 se deduce de que no reciben ninguna parada; no se midió con la pantalla.
- **Pendiente: decisión** (código del padre; cambia lo que ve el usuario en producción). Dos caminos hacia el mismo arreglo: *A) reiniciar de forma explícita `paradaActual`, `elementoActual`, `indiceProgreso` y `retoActual` en la función común de «abandonar» (K-19, opción A)*; *B) dejar `estado.modo` sin decidir al abandonar*, para que la activación siguiente sea un cambio real y corra la limpieza que ya existe, lo que arrastra lo demás que esa limpieza reinicia (posición GPS, overlays de imagen y vídeo, mapa) y `estadoMapa.modo`. No se recomienda ninguna mientras no se lea qué más depende de que `estado.modo` valga `null` entre aventuras. Con cualquiera hace falta un spec del camino de producción de principio a fin, rojo hoy.
- **Revisión (2026-10-19, tarde).** En la vuelta rápida la cerró K-95 (`_elegirOtra` recarga, `c9c90fb`). `ejecutarElegirOtra` solo corre en el arranque: el diálogo de reanudación lo abre la comprobación de la aventura guardada (`codigo-padre.html:7992`), y el padre no escucha `pageshow`; en ese momento la memoria no tiene ninguna aventura, así que no hay parada que arrastrar (leído). Lo que queda es K-19.

##### K-51 — El progreso guardado no lleva versión de los datos — 🔎

- **Dónde.** `persistProgressState` (`codigo-padre.html:4321-4380`) guarda `indiceProgreso`, `paradaActual`, `elementoActualId`, `audioActual`, `totalParadas`, `tiempoRestante`, `tramoSkipsUsados`, `aventura`, `idioma` y `timestamp`, sin versión ni huella de los datos de la aventura. `_restoreApplyState` (`:4462-4481`) asigna `paradaActual` e `indiceProgreso` sin comprobar que existan en los datos vigentes; solo `elementoActual` se fija si se encuentra.
- **Qué pasa si los ids cambian.** `_restoreBroadcast` despacha `NAVEGACION.CAMBIO_PARADA` con la parada restaurada y el handler devuelve `exito:false` con un `warn` (`:11967-11974`) si no la encuentra; no hay recuperación y la sesión queda sin parada activa. La condición es que los datos cambien dentro de la ventana de la sesión (60 o 150 h): renumerar paradas es mantenimiento que ya se hace (Av34km).
- **Método.** Lectura de las tres funciones y del handler; sin medir.
- **Pendiente: decisión de diseño.** *A) guardar una versión o huella de los datos de la aventura y descartar o recolocar el progreso si no coincide*; *B) validar los ids al restaurar y caer a la parada por defecto con un aviso ruidoso*; *C) dejarlo*, si no se piensa renumerar contenido mientras haya sesiones vivas. Depende de una decisión de producto, así que no se recomienda ninguna.
- **Decisión del usuario (2026-10-19 noche): C.** Con la app publicada, las paradas de una aventura no se cambian mientras haya gente haciéndola, así que el progreso guardado no necesita versión de los datos. La reanudación la decide un solo dato, el identificador del elemento (K-117).

##### K-52 — Reservas mudas a `'Aventura1'` cuando falta la aventura — ✅ (aplicada entera: el sitio del padre en `99006df`; el resto, con el idioma y en los once frames, en `cf47a3a`)

- **Dónde.** Búsqueda desnuda de los literales `Aventura1`, `Aventura2`… en código de producción (fuera de las tablas de datos), 12 sitios que sustituyen una aventura ausente por `Aventura1`: `codigo-padre.html:11954` (`_hdl_NAVEGACION_CAMBIO_PARADA`: `aventuraSeleccionada`, después `vv_aventura` y por último el literal), `coordenadas-hijo2.html:1188` (**sí avisa** con `warn`), `En-busca-del-tesoro.html:1443`, `:1509`, `:1663`, `:2150`, `:2250`, `:2352`, `:2409` y `:3009`, `mapa-completo.html:186` (`params.get('aventura')`) y `js/api-client.js:294` (parámetro por defecto de `activar`). La guía (L14258) ya reconoce que, cuando falla un puente de la selección, el fallo «es mudo: … carga bien y no da ningún error».
- **Por qué importa.** Es el segundo camino silencioso que el estudio busca (EJE 27.1): si el dato falta, la app sigue con una aventura inventada y nada lo delata. El del padre es alcanzable en el estado que deja `_elegirOtra` (K-50), porque `aventuraSeleccionada` queda `null` y `vv_aventura` se borra: cualquier `CAMBIO_PARADA` que llegue mientras se elige se resolvería contra Aventura1. No se midió.
- **Pendiente: decisión.** Para el sitio del padre, que sí se leyó: *A) no resolver contra una aventura inventada y devolver un error visible en el log*; *B) dejarlo*. Los ocho sitios de la selección, el de `mapa-completo.html` y el de `api-client.js` no se han leído uno a uno: no se recomienda nada para ellos hasta hacerlo.
- **Estado (2026-10-18).** De los 12 sitios quedan 8, todos en la selección (`En-busca-del-tesoro.html`, `aventuraSeleccionada || 'Aventura1'`): el de hijo2 y el de `mapa-completo.html` salieron con K-107 (`c01007d`) y el parámetro por defecto de `activar()` en `js/api-client.js`, con `4c0895a`. **El del padre, aplicado (opción A, `99006df`):** `_hdl_NAVEGACION_CAMBIO_PARADA` usa solo `aventuraSeleccionada`; sin ella no toca el estado, contesta `{ exito: false, error: 'sin_aventura_elegida' }` y lo dice con `logger.error`. El respaldo de `localStorage` (`vv_aventura`) era el otro camino silencioso de la misma cadena: la clave tenía un solo escritor (`_hdl_SELECCION_AVENTURA_SELECCIONADA`, junto a `aventuraSeleccionada` y con su mismo valor) y un solo lector (este respaldo), así que salió con su escritura y sus dos borrados (búsqueda desnuda de `vv_aventura` en todo el repositorio: esos cuatro sitios). Spec 12, PP-4 (sin aventura elegida, con otra guardada en el navegador y sin ninguna): en rojo los dos casos con el código anterior (procesaba `Av2-P-1` y `Av1-P-1`), en verde después. El RC2-1 del spec 96 cambiaba de parada sin elegir aventura y se apoyaba en la reserva: ahora la elige antes, como la app, y sus dos precondiciones son aserciones; con `test.skip` se omitía en silencio, y así salió en la primera pasada. Chromium: 188 en verde en los 31 specs que cambian de parada o tocan la selección. Guía: §7, §9.4, §10.19 (fuera también la fila de una clave `idioma` que no existe en el código), §25, §25.10, §26.12, §18.3 y §37.2. **Censo de frames (regla 3b):** tocado el padre; la selección conserva sus ocho reservas (fuera del alcance de este paso) y ningún otro frame tiene ninguna (búsqueda desnuda de `'Aventura1'`). **Al pasar, sin tocar:** el idioma sigue la misma forma en ese handler (`idiomaSeleccionado`, después `vv_idioma` y por último `'es'`; y `'es'` si la aventura no tiene ese idioma).
- **Aplicada entera (2026-10-19, `cf47a3a`), con el alcance que pidió el usuario:** «buscar absolutamente todos esos sitios y asegurar que saben qué aventura se eligió en todo momento [...] el padre no puede llegar a rechazar, es obligación saber en qué aventura e idioma ha elegido el usuario. no puede haber error». Es decir, la aventura Y el idioma, en los once frames, y no solo las ocho reservas de la selección.
  - **Inventario** (scratchpad `k52/inventario.cjs`, con residuo; búsqueda desnuda del literal `'es'` en todo el código de producción como segunda pasada, porque la primera no veía `let idioma = 'es'` ni el ternario de hijo6): selección, 8 reservas `'Aventura1'`, ~20 `|| 'es'`, 3 lecturas de `vv_idioma` como respaldo y 9 tablas con respaldo a español; padre, ~40 `|| 'es'`, `vv_idioma` como segunda fuente del idioma (respaldo en el cambio de parada y en el banner de versión), la copia `estado.seleccion.aventura` (K-109) y 28 tablas con respaldo; hijo6, `let idioma = 'es'`, un ternario a `'es'` y 9 tablas; hijo4, 2 tablas; video-intro, `?lang=` o `'es'` y una tabla; `js/api-client.js`, tres parámetros `idioma = 'es'` sin llamadores. hijo1, hijo2, hijo3, hijo5, mapa-completo y puzzle no guardan idioma (búsqueda de asignaciones de `idioma`/`lang` en cada uno: ninguna).
  - **Antes / después de elegir.** Todas las reservas de la selección corren en P4 o después (el idioma se elige en P2); las del padre, con la aventura en marcha o con la sesión guardada (que guarda el idioma), salvo tres sitios que pueden salir antes de elegir: el overlay de carga, el aviso de fallo de carga y el banner de versión nueva. Esos tres tenían DOS implementaciones de la misma regla (Script 1 y el bloque clásico del banner).
  - **Datos completos, medido con control** (scratchpad `k52/completitud*.mjs`, `datos-idiomas.mjs`): las 33 tablas por idioma de `js/traducciones-ui.js` (20 con valores-objeto, con las mismas claves que el español en los 12), las 20 escenas de `JAIME_SCENES` (la 15 es `null`), los textos de términos, agradecimientos y normativa, y `DATOS_PADRE`, los retos y los audios de las 7 aventuras en los 12 idiomas. Con eso, los respaldos a español de las tablas no actuaban nunca.
  - **Lo que encontró el camino, además de las reservas.** (1) `enviarMensaje` del bus NUNCA rechaza: si no puede enviar devuelve `false` (`js/mensajeria.js:319-341`), y la selección no lo miraba; con `IDIOMA_SELECCIONADO` o `AVENTURA_SELECCIONADA` perdidos, la selección seguía y el padre se quedaba sin saberlo, en silencio. (2) `_hdl_SELECCION_AVENTURA_SELECCIONADA` empezaba con «si hay una activación en curso, ignorar» (`warn` y `return`): con acuse, el bus confirmaba y el padre la había descartado; y los dos handlers de la elección se tragaban cualquier error. (3) Los puentes `_setIdiomaSeleccionado`/`_setAventuraSeleccionada`/`_setAventuraIniciando`/`_setTimerProgresoCarga` de la selección eran un segundo mecanismo: el módulo escribe los `let` del script clásico por su nombre (medido con una sonda en chromium, firefox e iphone12: `idiomaSeleccionado = 'en'` desde el módulo cambia el `let`; `globalThis.idiomaSeleccionado` sigue sin existir), como ya hacía `_checkUrlParams`. Su comentario, y §37.2 de la guía, afirmaban lo contrario. (4) `AVENTURA.INICIADA` llevaba `aventuraId` e `idioma`, que hijo1 no lee (búsqueda desnuda en el fichero: 0), y el parámetro `idioma` de `_iniciarTemporizadorAventura` solo servía para eso. (5) `estado.seleccion` lo creaba también `_hdl_AVENTURA_ESTADISTICAS_TIEMPO` sin usarlo.
  - **Cambios.** Selección: fuera las 8 reservas de aventura, todas las de idioma y los respaldos de tabla; la elección se escribe por su nombre (fuera los cuatro puentes; queda `_resetearFlagsContenido`, que es una función); `seleccionarIdioma` y `seleccionarAventura` avisan con `enviarMensajeConConfirmacion` y, sin acuse, no avanzan (lo dicen con `logger.error`); `AVENTURA_SELECCIONADA` ya no lleva el idioma; la despedida lee el idioma de `vv_idioma` una vez, en `_checkUrlParams`, y si falta lo dice. Padre: `globalThis.idiomaDeLaInterfaz()` (bloque clásico temprano) es la única regla del idioma de lo que puede salir antes de elegir (el elegido; si no, `vv_idioma`; si no, español) y sustituye a `_resolverIdiomaLoadingOverlay` y a la copia del banner; el resto lee `globalThis.idiomaSeleccionado` sin reserva; `IDIOMA_SELECCIONADO` es el único escritor del idioma (y de `vv_idioma`) y `AVENTURA_SELECCIONADA` el de la aventura mientras se elige, y los dos lanzan si no pueden guardar (el bus contesta `fallo-handler` y la selección no sigue); la sesión guardada necesita aventura E idioma (si no, no se ofrece reanudar y se dice); K-109 (fuera `estado.seleccion.aventura` y su respaldo del handler de hijo5); fuera la cadena `idioma → vv_idioma → 'es'` y la comprobación «la aventura no tiene ese idioma» del cambio de parada; `AVENTURA.INICIADA` lleva solo el tiempo (y el temporizador ya no recibe el idioma; sus comentarios citan los parámetros por nombre). hijo6: sin idioma por defecto; el FAQ y el buzón se construyen al llegar el estado del padre (PADRE_DATOS y CHAT.ESTADO_PADRE), nunca antes; fuera `estadoPadreRecibido` y la rama `debug` de la construcción inicial; un idioma que no tiene lo dice. hijo4: el idioma de cada `RETO.MOSTRAR`, sin guarda; fuera un bloque de cuatro líneas comentadas que hablaba de un «array esencial» inexistente. video-intro: `?lang=` obligatorio (si falta, `error`). `js/api-client.js`: sin parámetros por defecto.
  - **Specs.** Nuevo **135** (EL-1..EL-8): en rojo con el código de HEAD servido por `page.route` (EL-2..EL-7) y en verde después; EL-1 y EL-8 pasan antes y después (EL-8 vigila la completitud que hace innecesarios los respaldos, y su instrumento se vio fallar con un idioma quitado en memoria). En el arnés, `elegirIdioma()` elige el idioma por el handler real del padre, y `cargarHijosDelPadre` lo usa si el padre aún no lo tiene (en la app los hijos se cargan en P15, con el idioma elegido). La primera pasada de chromium con el código nuevo dio 79 fallos en 27 specs, todos de specs que arrancaban la app sin elegir idioma (estado que la app no produce; los tapaba la reserva): 54 en la carga de hijos (hijo6 rompía su apretón de manos con `idioma: undefined`, medido con sonda), y el resto en carteles, el modal de tiempo agotado y recorridos de la selección que saltaban P2. Ajustados para elegir como la app: 18, 22, 41, 43, 45, 60, 74, 80, 82, 115, 120 (ID-2 vigila el camino único), 122, 127, 129, 130.
  - **Al pasar, registrado y sin tocar:** `PREPARAR_HIJOS` queda con un handler que solo escribe en el log (familia K-46: bus); `AVENTURA_ACTIVADA` sigue escribiendo aventura e idioma desde su mensaje (va con el contrato pendiente de K-41); el banner de versión conserva un texto en español escrito a mano para cuando sale antes de que Script 1 publique su tabla; los textos de fallo de la selección («No hay retos para este idioma», «Agradecimientos no disponibles…») están en español fijo (familia K-25); la espera de arranque del arnés (K-102) copia la condición del padre, que hubo que actualizar al cambiar aquí (la decisión de que el padre publique una señal sigue abierta); y el generador de §37.2 (`tools/inventory-conexiones.js`) cuenta como uso cualquier aparición del nombre, también en comentarios y cadenas (lo que se ha arreglado es solo que una asignación escrita en un comentario se tragaba la real de la línea siguiente).
  - **Hash.** Código, specs, arnés, generador y guía en `cf47a3a`. Chromium entero: 700/700 (21,5 min, 68,1 °C de máxima).

##### K-53 — Imports no esenciales en posición fatal: un fallo de carga aborta el script entero — 🔎

- **Método.** Para cada página, los `import` estáticos (siempre abortan el módulo si fallan) y los `await import()` de nivel superior fuera de `try` (`acorn`, bloques `<script type="module">`; 0 sin parsear).
- **Los que no son esenciales para arrancar y están en posición fatal.**

| Módulo | Sitios |
|---|---|
| `feedback-forms.js` | `codigo-padre.html:3004` (Script 1), `En-busca-del-tesoro.html:2546`, `chat-hijo6.html:415` |
| `video-playback-utils.js` | `codigo-padre.html:3006` (Script 1), `video-intro.html:592` |
| `reciclaje-digital.js` | `codigo-padre.html:3000` (Script 1) y `:9640` (Script 2) |
| `suppress-warnings.js` | `codigo-padre.html:4051` y `:9633` |
| `monitoreo.js` | `codigo-padre.html:3805` (se va con K-04) |
| `efectos-sonido.js` | `codigo-padre.html:9641` (Script 2), `retos-hijo4.html:460`, `puzzle.html:143` |

  `traducciones-ui.js` (378 KB) está en seis sitios (selección, hijo6, padre en Script 1 y 2, hijo4 y video-intro) y sí es esencial para los textos; se anota por completitud.
- **Qué pasa.** Si uno de esos módulos no se carga, el script que lo importa se detiene sin error visible y lo que viene después (handlers, handshake, `marcarScript2Listo`) no se registra; en el padre, Script 2 abortado deja sin handlers de reto, audio y parada. Lo mitiga que el `APP_SHELL` precachea todos (cobertura comprobada: R2.9) y que el shell se sirve con red primero y caché de respaldo; no se midió ningún fallo de carga de ninguno.
- **El caso propio.** `efectos-sonido.js` (módulo de 2026-10-03) contradice el principio que aplica internamente, que un sonido que falla no rompe a quien lo pide: un fallo de carga rompería el padre, hijo4 y el puzzle.
- **Pendiente: decisión.** *A) cargar los módulos no esenciales con `import()` dentro de `try` y un respaldo inerte con aviso `warn`* — **recomendada** para `efectos-sonido.js`, que es el caso propio y está leído por completo; para los demás es la misma pregunta, no comprobada módulo a módulo; *B) dejarlos*, apoyándose en el precacheo.

- **K-53, `efectos-sonido.js`: aplicada (2026-10-04).** El fallo de carga del módulo ya no detiene al frame: el padre (Script 2) y el puzzle lo cargan con `await import()` dentro de un `try`, y hijo4 con `import().then().catch()` **sin `await`**; en los tres hay un respaldo inerte (`EFECTOS` vacío y las tres funciones sin efecto) y un `warn` «No se pudo cargar js/efectos-sonido.js». Spec nuevo **117** (6 tests: cada frame con la petición del módulo abortada y, de control, con el módulo normal); la guía lo describe en §12, lo lista en §18.3 y el recuento de specs pasa de 113 a 114, igual que el catálogo `tests/master-test.html` (regenerado con `npm run sync:master-test`). **Rojo antes de verde:** con el código anterior los tres bloqueados caen (el navegador dice `Failed to fetch dynamically imported module` en el padre y `Failed to load resource` en hijo4 y el puzzle) y los tres controles pasan. **Una regresión propia que el spec cazó:** la primera versión de hijo4 esperaba la carga con un `await` de nivel superior; hijo4 registra todos sus handlers dentro de un `DOMContentLoaded` (`retos-hijo4.html:695`) y una espera a la red deja pasar el evento antes de que se añada el listener, así que no registraba ninguno, sin error y también con el módulo normal (el control y el bloqueado caían, con 0 handlers). Por eso hijo4 carga el módulo sin esperarlo, y el código lo explica. El padre y el puzzle no registran bajo `DOMContentLoaded` y pasan los controles con `await`. 118 tests de 16 specs de hijo4, puzzle, efectos y arranque, todos en verde en chromium; `npm run lint` sale con 0. **Para la fila 28:** `coordenadas-hijo2.html`, `codigo-padre.html` y `En-busca-del-tesoro.html` usan `DOMContentLoaded` (3, 10 y 2 apariciones): antes de poner en ellos un `await` de nivel superior que espere a la red hay que comprobar que ningún registro depende de ese evento. Los demás módulos no esenciales de la tabla de K-53 quedan como estaban.

##### K-54 — Script 1 usa funciones que define Script 2 sin esperar a que existan — ✅ (carrera medida; aplicada de raíz, `26e156d`)

- **Método.** Los 18 bloques `<script>` de `codigo-padre.html` con `acorn` (0 sin parsear; Script 1 es el bloque de la línea 2859 y Script 2 el de la 9621): 22 nombres de `globalThis` que un bloque usa antes de que lo defina otro posterior, con 75 usos. El EJE 2 cubría el sentido contrario (Script 2 hacia Script 1, cada dependencia con su propio `while`); este es el inverso.
- **Resultado.** El único uso automático, sin un paso del usuario por medio, es `mostrarModalTiempoAgotado` (definida en `:13545`; usos en `:4419-4420` y `:8343-8344`): es la carrera de K-20. `distribuirDatosAventura` (`:9900`) lleva en los usos de `:4014-4022` y `:4960-4971` una espera acotada (40 y 120 iteraciones): sin hallazgo; los de `:8081` y `:8279` (la distribución pendiente) no se leyeron enteros. `_vv_afterHijoListo`, `_buscarParadaEnDatos`, `obtenerRetosIds` y `_configurarRetoBtn` (en `_hdl_SISTEMA_HIJO_LISTO`, `:7388-7407`), `_iniciarTemporizadorAventura` (en `_activarHeartbeatAventura`, `:7494-7499`, **sin `else`**: si no existiera no arrancaría el temporizador y no dejaría ni un log) y `obtenerElementoActual`, `solicitarAudioAHijo3` y `actualizarEstadoControlesAudioPadre` (restauración) solo se alcanzan tras un paso del usuario (clic en el diálogo, selección, carga de los hijos); el margen no se midió.
- **Un evento probablemente muerto.** El `DOMContentLoaded` del bloque de la línea 1500 comprueba `typeof globalThis.registrarEvento` (`:1527`) para registrar `app_inicializada`, pero `registrarEvento` se define en Script 1 (`:5277`) tras varios `await`: lo normal es que el evento no se registre nunca. Orden estático; medido en K-04 A (2026-10-04): `registrarEvento` se asigna a los 162,6 ms, el `DOMContentLoaded` salta a los 125,2 ms y el evento no sale en consola. Se retira en K-55 A (`44e603f`), junto con `pagina_cargada`.
- **Pendiente: decisión, junto con K-20.** *A) que `_comprobarReanudacionAventura` espere con `retryUntilAvailable` a que exista `mostrarModalTiempoAgotado` antes de decidir qué hace*; *B) dejarlo*, porque la carrera es de milisegundos en una máquina ociosa y no se ha medido. Medible retrasando Script 2 con `page.route`, como el spec 89 (S2-4).
- **Medida (2026-10-19) y aplicada de raíz (`26e156d`).** Sonda desechable con una sesión caducada guardada y `js/efectos-sonido.js` (que solo importa Script 2: 0 apariciones en Script 1) retrasado 6 s, en chromium y firefox: sin retraso, `mostrarModalTiempoAgotado` existe a los 229/928 ms y sale el modal; con el retraso, el padre da el arranque por terminado (`sistemaInicializado`) a los 445/1219 ms, el modal no existe y una sesión caducada se borra por la rama «sin modal», sin avisar. **La carrera es real** con un módulo de Script 2 lento, no de milisegundos. Y K-52 la agravaba: los handlers de la elección son de Script 2, así que en ese caso la pantalla de carga se iba antes de que existieran y un toque en P2 se quedaba sin acuse. **Arreglo de raíz (orden de inicialización), en vez de la opción A (esperar solo a esa función):** Script 1 espera a `script2Listo` antes de `sistemaInicializado` (con `retryUntilAvailable` sobre `getEstado().flags.script2Listo`, que es síncrona, hasta 30 s; si no llega, lo dice y sigue). Comprobado antes: Script 2 no menciona `sistemaInicializado`, así que la espera no puede interbloquearse. Spec 89, S2-5: con el mismo retraso, al darse el arranque por terminado Script 2 está listo y la sesión caducada enseña su modal; en rojo con el padre de HEAD en chromium y firefox, en verde después; el 89, 10/10. Guía: los diagramas del arranque, la fila de `script2Listo` y la del spec 89.

##### K-55 — Dos eventos de arranque que nunca se registran: `app_inicializada` (padre) y `pagina_cargada` (`app.js`) — ✅ (medido)

- **Método.** Dos sondas de Playwright sobre el padre real (chromium, sin service worker, MapLibre sustituido). La primera envuelve `window.addEventListener` antes de que cargue nada, apunta cada registro de `load` con su `readyState` y si su manejador llega a ejecutarse. La segunda define `globalThis.registrarEvento` con un `Object.defineProperty` que anota cuándo se asigna y lo compara con el `DOMContentLoaded`. En las dos se vigilan las líneas de consola con el nombre de cada evento.
- **Resultado.** *`pagina_cargada` (`js/app.js`, listener de `load`):* se registra con `readyState: 'complete'` (el `load` fue a los 125 ms y `app.js` acabó de descargarse a los 158; en la medición de después, a los 163 y 205 ms) y su manejador no se ejecuta, ni antes ni después de K-04 A. *`app_inicializada` (`codigo-padre.html:1525-1535`, dentro del `DOMContentLoaded`):* el evento salta a los 125,2 ms y en ese instante `typeof globalThis.registrarEvento` es `undefined`; la función se asigna a los 162,6 ms, en Script 1, tras sus `await`. La rama se salta. Ninguno de los dos sale en la consola. Búsqueda desnuda de los dos nombres en todo el repositorio: un solo sitio de código cada uno, y nadie los lee. Es el «evento probablemente muerto» de K-54, ahora medido.
- **Qué hacen hoy.** Nada observable: son dos líneas de log que no se escriben. Con K-04 A `registrarEvento` solo escribe el log, así que lo que se decide es si merecen existir.
- **Pendiente: decisión.** *A) retirar los dos* (el listener de `load` de `app.js` junto con `obtenerTiempoCargaPagina`, y el bloque de `app_inicializada` del `DOMContentLoaded` del padre): no producen nada y nadie los lee — **recomendada**; *B) hacer que se registren* (ejecutar el cuerpo al momento si `document.readyState === 'complete'`, y esperar a `registrarEvento` con `retryUntilAvailable`), con lo que aparecerían dos líneas de log que nadie lee; *C) dejarlo*. Con A o B se cierra un segundo camino («un evento que solo se registra si la carga va en cierto orden»); con C no.
- **Aplicada la opción A (2026-10-05, `44e603f`).** Quitadas 15 líneas de `codigo-padre.html` (el paso 2 del `DOMContentLoaded`) y 20 de `js/app.js` (`obtenerTiempoCargaPagina` y el listener de `load`); el `registrarEvento` local de `app.js` se queda porque `CAMBIO_MODO` (`:524`) lo llama. **Verificado antes de aplicar, sobre una copia fuera del repo:** los únicos consumidores del fuente son los specs 46 (importa `app.js`) y 65 (lee el padre, anclado en otra zona); parseo, lint (con controles de `no-console` y `no-undef`) y `verificar-mensajeria`, `verificar-frames` y `codigo-muerto` sin diferencias; 284 tests en chromium idénticos entre el árbol real y la copia. **Controles:** un `throw` en el sitio del bloque hace caer 58 de 58 tests en `app.js`; en el del padre, la primera selección de 34 specs no hacía caer ninguno (**era ciega ahí**) y solo los specs 47, 69, 71, 72 y 90 vigilan los pasos que vienen después del bloque en el `DOMContentLoaded` (15 de 55 tests en rojo con un `throw`). Tras aplicar: 60 tests de esos 10 specs idénticos a la referencia. **Guía:** §26.4 ya listaba solo los eventos vivos y no cambia; cambia la tabla generada de §37.2 (`registrarEvento` deja de usarse en el bloque clásico 6) y, con ella, 103 filas por el desplazamiento de líneas; `verificar-citas` pasa de 62 mal a 0 (las 47 que ya estaban mal y las 15 de este cambio estaban todas en esa tabla). No se lanzaron firefox, webkit ni los dos móviles.

##### K-56 — El nivel de log llega por dos caminos: la ventana de arriba y la copia propia de `CONFIG` de hijo2 — ✅ (medido)

- **Método.** Sonda de Playwright con los seis ids del spec 60 en el padre real: con `__vv_config.DEBUG.NIVEL_LOG = NONE` en el padre, `logger.getNivel()` de cada frame y si tiene `__vv_config` propio. Búsqueda desnuda de `__vv_config`: lectores solo `js/logger.js` (`:114` y `:116`) y los specs 59 y 60; escritor solo `js/config.js:176`.
- **Resultado.** Selección, hijo1, hijo3, hijo4 e hijo5 devuelven `NONE` (sin copia propia). hijo2 devuelve `DEBUG`: importa `config.js` (`coordenadas-hijo2.html:431`, para `CONFIG.GPS.PRECISION_MINIMA`), `config.js` publica su copia como `__vv_config` y el logger prefiere la de su propia ventana a la del padre (`logger.js:114`). Antes de K-04 A eran también hijo1 e hijo5, que cargaban `config.js` a través de `monitoreo.js`. Hoy el valor es el mismo en todas las copias (`DEBUG`): la diferencia solo se ve si se cambia el nivel a mano, en runtime, en la consola del padre. `setNivel()` de cada logger es otro camino, igual en todos los frames. El comentario de `js/logger.js:108-113` («solo `coordenadas-hijo2.html` importa `config.js`») es cierto desde K-04 A.
- **Pendiente: decisión.** *A) que `logger.js` mire primero el `__vv_config` de la ventana de arriba y solo después el propio*; *B) que `config.js` publique `__vv_config` únicamente en la ventana de arriba (`globalThis.parent === globalThis`)* — **recomendada**: es una línea, hijo2 sigue importando `CONFIG` para sus lecturas y el único lector de `__vv_config` es el logger; *C) dejarlo*, porque el valor es el mismo y solo cambia con la consola. Con A o B, el NH-4 del spec 60 pasa a cubrir también a hijo2 (hoy lo excluye citando este número).
- **Aplicada la opción B (2026-10-05, `1d8aaef`).** `js/config.js` publica `__vv_config` solo si `globalThis.parent === globalThis` (su comentario decía «en cada ventana»); el NH-4 del spec 60 cubre también a hijo2, y la guía describe que `config.js` solo publica en la ventana de arriba (fila del spec 60 de §18.3 y fila de `logger.js` de §26.3). **Verificado antes de aplicar, en una copia fuera del repo (28 specs, 174 tests en chromium):** con B pasan los 174 y los 170 tests de los otros 27 specs son idénticos al real; rojo antes de verde: el NH-4 nuevo sobre la config anterior falla con `hijo2=sin copia, obedece` esperado; con la publicación rota caen el 59 (NL-5) y el 60 (NH-2 y NH-4), así que vigilan la copia del padre; parseo, lint con control (`no-trailing-spaces` en `js/` y `tests/`) y `verificar-mensajeria`, `verificar-frames`, `codigo-muerto` y `verificar-esperas` sin diferencias. Tras aplicar: los mismos 174 tests y la copia coincide byte a byte. **Correcciones a esta ficha:** (1) el logger no es el único lector de `__vv_config`: `codigo-padre.html:11285` lee `MENSAJERIA.TIMEOUTS.CONFIRMACION` con `?? 5000`, y ese valor coincide con el de `CONFIG`, así que si la publicación falla nadie lo ve (el spec 20 no cae con la publicación rota); no se toca. (2) Un padre incrustado en un iframe dejaría de publicar; no es un caso de la app (`manifest.json` declara `display: standalone`, `index.html` redirige con `location.replace` en la misma ventana y ningún fichero rastreado incrusta `codigo-padre.html`), y no se ha medido. No se lanzaron firefox, webkit ni los dos móviles.

##### K-57 — Un hijo que no completa el apretón de manos no tiene una recuperación común: cada cargador responde distinto, y un hijo mudo parece vivo — ✅ (medido)

- **Método.** Lectura de los dos lados (los seis hijos y los handlers del padre) y sondas de Playwright sobre el padre real (chromium, sin service worker, MapLibre sustituido), desde el arranque real (`cargarRestoDeiframes` + `cargarHijoCasa`) y con el modo AVENTURA a los 10 s para que arranque el latido. Cuatro fallos en `hijo3`, servidos con `page.route`: **red cortada** (se aborta `audio-hijo3.html`), **se pierde su `HIJO_PREPARADO`** (el tipo del mensaje se cambia por uno que el padre no conoce), **se pierde su `HIJO_LISTO`** y **no recibe `PADRE_CONFIRMA_HIJO_LISTO`**; más un control sin fallo. Cada caso se observó 58 s con instantáneas del estado del padre y del iframe, y el tráfico del padre a los iframes se registró en el único `postMessage` de `js/mensajeria.js`.
- **El apretón, leído.** El hijo registra sus handlers y manda `HIJO_PREPARADO` **una sola vez, sin reintento** (`audio-hijo3.html:1588-1605`; igual en los otros; hijo1 espera antes hasta 5 s a que el padre esté listo, `extrainfo-hijo1.html:82`). El padre contesta `PADRE_DATOS` (`codigo-padre.html:7185`). El hijo contesta `HIJO_LISTO` con hasta 30 reenvíos de 1 s que no paran cuando el padre lo recibe sino cuando llega `PADRE_CONFIRMA_HIJO_LISTO`; al agotarlos muestra su pantalla (`audio-hijo3.html:1150-1226`). El padre ejecuta su handler entero en cada `HIJO_LISTO` (`:7315`).
- **Resultado, caso por caso (`hijo3`).**
  - *Red cortada.* El padre anota «Error cargando hijo3: Timeout esperando HIJO_LISTO» a los 30,0 s y **no reintenta**. La recarga llega a los 35,0 s por el latido («hijo3 lleva 3 latidos sin contestar» → «Iframe hijo3 recargado»), solo porque la app ya estaba en AVENTURA (15 s de latidos), y se repite (peticiones a `audio-hijo3.html`: 1 hasta los 32 s, 2 a los 45 s, 3 a los 58 s).
  - *Se pierde su `HIJO_PREPARADO`.* La pantalla de `hijo3` queda **oculta los 58 s enteros** (`body` en `display:none`), el padre da el error a los 30,1 s y **no hay ninguna recarga**: `hijo3` sigue contestando a los latidos, así que el latido lo da por vivo (1 petición en 58 s). Mientras tanto el botón central de audio del padre aparece **habilitado** y el cartel dice «pulse play».
  - *Se pierde su `HIJO_LISTO`.* `hijo3` lo reenvía 30 veces y a los 32 s muestra su pantalla, pero el padre no lo da nunca por listo (`hijo3` fuera de `hijosInicializados`, `todosHijosListos` en falso hasta los 58 s) y tampoco se recarga.
  - *No recibe la confirmación.* El padre procesa 30 `HIJO_LISTO` seguidos. Con `hijo3`: 30 confirmaciones, resto del tráfico igual al control, y su pantalla aparece a los ~30 s. Con la misma mutación en `hijo2` (36 s): 70 mensajes del padre a los iframes frente a 14 del control, entre ellos 30 `NAVEGACION.RESPUESTA_DATOS_PARADAS` y 30 confirmaciones a `hijo2`, y **0** `DATOS.CARGAR_COORDENADAS` y `CARGAR_TEXTOS` frente a 1 y 1: a los 3 s de recibir la confirmación `hijo2` pide lo que no tiene (`coordenadas-hijo2.html:1609-1625`); sin ella no pide nada (en el flujo real las empuja `distribuirDatosAventura` al activar, así que se compensa).
  - *Qué ve el usuario* (móvil 412×800, aventura activada por la ruta rápida): control → reproductor de audio visible; red cortada → hueco vacío, botón central de audio **deshabilitado** (opacidad 0,6) y el botón de saltar audio resaltado; `HIJO_PREPARADO` perdido → hueco vacío y botón central **habilitado**. **No medido:** si el audio llega a sonar en ese último caso (mi instrumento no lo distingue: ni el control suena con ese botón, que abre un desplegable).
- **Los otros caminos, leídos.** (1) `cargarRestoDeiframes` (`codigo-padre.html:8445`) anota `hijosFallidos` y solo escribe un `warn` (`:8473-8474`); `cargarHijoCasa` (`:8393`) se traga el error con un `catch`; solo `cargarIframeSoloSeleccion` (`:8009`) llama a `intentarReconectarHijosFallidos` (`:8037`, único llamador; la llamada ya estaba así en el primer commit del repositorio, `2c5c2c2`, y no hay historial anterior que diga si fue intención), y por ahí es el único acceso a `_reconectarHijoIndividual`. La guía (sección «Reconexión de hijos fallidos») dice que esa reconexión se activa cuando un hijo no completa el handshake en la carga inicial: en el código vale solo para el iframe de la selección. (2) El latido manda a todos los iframes registrados, pero solo recarga a `HIJOS_RECUPERABLES` (`:3746`: `hijo1-opciones`, `hijo2`, `hijo3`, `hijo4`; `hijo5` y `hijo6` nunca), solo con el latido activo (en CASA el bus lo pausa) y solo a quien **no contesta**. (3) `SISTEMA.HIJO_FALLIDO`: solo lo envían `extrainfo-hijo1.html:184` y `En-busca-del-tesoro.html:2662`; el padre lo registra y pone `fallido = true` (`:7760`), y **nadie lee `fallido`** (búsqueda desnuda: una sola aparición).
- **No medido ni explicado.** `hijo5` y `hijo6` ante estos cuatro fallos (solo lo leído arriba); el efecto dentro de `hijo2` de recibir 30 veces la lista de paradas; el cambio de modo, que en los cuatro casos de fallo empieza a los 20 s y en el control a los 10 s (dato sin explicar); qué se ve con la página de error real de un navegador, que en mi arnés no se pinta.
- **Pendiente: decisión, sin recomendar todavía** (queda por decidir si la recuperación es de cada cargador o única). *A)* que `cargarRestoDeiframes` y `cargarHijoCasa` usen la misma reconexión que la selección; *B)* que el padre trate como fallo a un hijo «cargado y registrado pero no listo» pasado un plazo, en vez de fiarlo al latido; *C)* un reenvío de `HIJO_PREPARADO` en el hijo hasta recibir `PADRE_DATOS`, igual que ya tiene `HIJO_LISTO`; *D)* que `HIJO_FALLIDO` lo mande cada hijo y que el padre actúe sobre él. No son excluyentes, y todas tocan el bus o su arranque (regla 1).
- **Aplicada: un solo supervisor en el bus (2026-10-06, pasos 1 y 2 del plan K-57/K-58/K-59: `1cd71c5` y `1bb2af0`; sin push).** Decisión del usuario: la recuperación es única y está en `js/mensajeria.js`, igual para todos los iframes que hacen el apretón de manos (selección, hijo1 a hijo6 y el chat); `mapa-completo`, `puzzle` y `video-intro` no lo hacen y no se supervisan. *Hijo sano* = apretón hecho (`HIJO_PREPARADO` → `PADRE_DATOS` → `HIJO_LISTO` → `PADRE_CONFIRMA_HIJO_LISTO`) y contesta al latido. *Dos reglas:* listo → tres latidos sin respuesta = caído; no listo → no se le manda latido y tiene una gracia de arranque desde que empezó a cargar. *Una acción:* `recuperarHijo` recarga el iframe, **indefinidamente y sin aviso al usuario**; lo que sale es un `logger.error` por consola con el hijo, la fase (apretón o latido), el tiempo desde que cargó y el número de recarga seguida. `registrarIframeHijo` pasa `{ supervisado: true }` y `state-manager.hijoEstaListo(id)` dice si el padre lo da por listo. Medido en una copia con la PWA entera: un hijo que no completa el apretón (`hijo3` sin `PADRE_DATOS`, en CASA) se recarga y queda listo al quitar el bloqueo; la selección sin red se recarga hasta que vuelve la red. Specs: 79 (BC-12, el mecanismo con un arnés) y 80 (RC-1..6, la aplicación real). **De las opciones:** *A* y *B* las cumple el supervisor para todos los cargadores; *C* (reenvío de `HIJO_PREPARADO`) no se hace, la recuperación es la recarga; *D* queda para el paso 3, donde se retira `HIJO_FALLIDO`. **El cuarto caso medido (el hijo no recibe `PADRE_CONFIRMA_HIJO_LISTO`) no lo trata el supervisor**: el padre lo da por listo y el hijo sigue contestando al latido. **Se borran:** `HIJOS_RECUPERABLES` y la marca `recuperable`, `intentarReconectarHijosFallidos` y `_reconectarHijoIndividual` (la selección espera su `HIJO_LISTO` sin plazo, con `_esperarHijoListoSinPlazo`). **Falta (paso 3):** un cargador único con cada hijo visible al estar listo, y fuera `estadoHijos`, `HIJO_FALLIDO` y los cargadores que siguen con su espera de 30 s y solo avisan (`cargarRestoDeiframes`/`_cargarUnIframeHijo`, `cargarHijoCasa`, `_cargarSoloIframeActivacion` con `_cargarIframeConTimeout`).
- **Paso 3 aplicado (2026-10-06, `343126a`; sin push).** Cierra lo que el apartado anterior dejaba para este paso. Un solo cargador de hijos, `cargarHijo` (`codigo-padre.html`, Script 1): olvida al hijo (padre y state-manager), lo registra en el bus como supervisado, le asigna el `src` y espera su `HIJO_LISTO` **sin plazo**; lo muestra en cuanto está listo, sin esperar a los demás (tres modos de visibilidad: `al-estar-listo`, `desde-el-principio` para la selección y `no-tocar` para hijo5). `cargarIframeSoloSeleccion`, `cargarHijoCasa` y `cargarRestoDeiframes` lo usan, y las tres rutas que cargan hijos (P14, la reanudación de sesión y la ruta fallback de `SELECCION.AVENTURA_ACTIVADA`) llaman a la misma pareja `cargarRestoDeiframes` + `cargarHijoCasa`. Se borran `estadoPadre.estadoHijos` (ninguna lectura: ficha de K-41), el tipo `SISTEMA.HIJO_FALLIDO` con su handler y sus dos emisores (la opción *D* queda resuelta quitándolo: un hijo que no arranca no avisa, lo detecta el supervisor) y los cargadores y esperas viejos (K-22). **Antes de aplicar, en una copia fuera del repo:** rojo antes de verde (RC-7, RC-8 y HL-4 caen con el código anterior; en RC-7 el hijo queda oculto para siempre tras recuperarlo el supervisor, porque el cargador viejo se rendía a los 30 s), 9 mutaciones (cada una rompe una pieza del cargador o reintroduce lo retirado, y cae en su test), tanda completa de chromium 593/593, y un recorrido real de P14 y de `AVENTURA_ACTIVADA` con los iframes ya precargados idéntico entre el código anterior y el nuevo (estilos en línea, hijos supervisados y hijos listos). Tras aplicar: los 12 ficheros idénticos a la copia, 593/593 en el repo, y lint, `verificar-frames`, `verificar-esperas` y `codigo-muerto` sin diferencias salvo los números esperados (`verificar-mensajeria`: 93 → 92 tipos). **Cambio de comportamiento: la carga de los hijos ya no sigue adelante a los 30 s con un hijo roto.** Mientras un hijo no completa su apretón, `cargarRestoDeiframes` no termina: P14 no activa el GPS ni marca `_iframesPreCargadosP14`, y la reanudación y la ruta fallback esperan igual; el supervisor lo recarga indefinidamente (decisión del usuario). **No medido:** la reanudación ni la ruta fallback con un hijo roto (comparten `cargarHijo`); P14 sí, en el apartado siguiente.
- **Medido después: P14 con un hijo que no completa el apretón (2026-10-06).** Sonda de Playwright sobre el padre real (chromium, sin service worker, MapLibre sustituido): `hijo3` se traga el `PADRE_DATOS` durante 45 s y después deja de hacerlo, y la selección manda `SELECCION.P14_MOSTRADA`. *Código anterior* (`9bfb249`): a los 30 s la carga sigue adelante (`_iframesPreCargadosP14` y `_codigoValidadoP13` a `true`: pasa a la línea que activa el GPS) con `hijo3` fuera de los listos, y `hijo3` queda `display:none` para siempre: el supervisor lo recarga a los 35 s, pero nadie lo vuelve a mostrar. *Código nuevo* (`343126a`): `_iframesPreCargadosP14` sigue en `false` mientras `hijo3` no está listo, sin paso de la carga; el supervisor lo recarga a los 35 s y, ya sin bloqueo, la segunda recarga llega a los 100 s (la gracia se dobla: 65 s desde la primera); entonces `hijo3` completa el apretón, se ve, `_iframesPreCargadosP14` pasa a `true` y los cinco están listos. Sin `alert` en ninguno de los dos; el error por consola sale en cada recarga con el hijo, la fase, el tiempo y el número de recarga seguida. **Lo que se ve de esto:** con un hijo roto de forma permanente el GPS no se activa en P14 y la carga queda a la espera; recuperar un hijo que ya se ha recargado una vez tarda la gracia doblada (60 s con el intervalo de 5 s), no 30 s.
- **Paso 4 aplicado (2026-10-06, `2a88a77`; sin push).** hijo4 y hijo6 pasan por lo mismo que los demás (apartados de K-22 y K-59). Detalle que sale de cargar a hijo6 con `cargarHijo`: `_olvidarHijoListo` ponía `todosHijosListos` a `false` para cualquier hijo, y al cargarse hijo6 con los tres críticos ya listos se habría vuelto a despachar `SISTEMA.APLICACION_INICIALIZADA`; ahora solo lo rearma recargar a un crítico (`HIJOS_CRITICOS`, una sola lista para el handler de `HIJO_LISTO` y para `_olvidarHijoListo`), y RC-11 lo vigila. Verificado antes de aplicar, en una copia: rojo antes de verde (RC-9, RC-10 y MH-2 caen con el código del paso 3), 7 mutaciones (la que reiniciaba la carga con el segundo toque no caía con RC-9 hasta añadirle el toque tras una recarga del supervisor) y la tanda de chromium 596/596; en el repo, tras el commit, 597/597.
- **Medido después: reanudación de sesión y ruta fallback con `hijo3` que no completa el apretón (2026-10-06).** Sonda de Playwright sobre el padre real (chromium, sin service worker, MapLibre sustituido, 412×800; `probe-roto-reanud-fallback.cjs`): `hijo3` se traga el `PADRE_DATOS` (un oráculo en su ventana lo detiene mientras una marca de `localStorage` está puesta) y se observa el padre cada 2,5 s. *Reanudación:* `localStorage` con una aventura iniciada hace 2 h y `indiceProgreso: 4`, y se pulsa «continuar» en el diálogo. *Ruta fallback:* los hijos ya cargados, `_iframesPreCargadosP14 = false` y un `SELECCION.AVENTURA_ACTIVADA` (lo que deja `SELECCION.REINICIAR`). Con 45 s de bloqueo y observación hasta 120 s: *código anterior al paso 3* (árbol rojo, cargadores sueltos): la reanudación termina (`modo = aventura`) a los 60 s con `hijo3` oculto (`display:none`) y fuera de los listos, y el supervisor lo recarga a los 35 s sin que nadie lo vuelva a mostrar; la ruta fallback termina a los 30 s con `hijo3` visible pero fuera de los listos, sin recargas ni error por consola. *Código nuevo* (cargador único): las dos esperan y terminan a los 100 s, tras soltar el bloqueo a los 45 s, con todos los hijos de esa ruta listos y `hijo3` visible; dos recargas (a los 35 s y a los 100 s: la gracia se dobla, 65 s desde la primera) y dos errores por consola («en 35 s…» y «en 65 s desde que empezó a cargar»); ningún `alert`. *Bloqueo permanente* (150 s sin soltarlo, con el código tras el paso 5 y actuando 15 s después del arranque): ni la reanudación ni la ruta fallback terminan (`modo` sigue en `null` a los 150 s), el supervisor recarga a `hijo3` a los 35 s y a los 100 s con un error por consola cada vez, el resto de hijos queda listo (hijo1-opciones, hijo2, hijo4, hijo5 y hijo6-chat), el overlay de carga está visible en todas las muestras y no sale ningún `alert`; la tercera recarga no se observó. Dato sin explicar: la reanudación anterior al paso 3 termina a los 60 s y no a los 30 s como la ruta fallback. Dato sin explicar: actuando nada más estar el sistema inicializado (sin esperar), el overlay de carga se ve **oculto** desde los 10 s mientras dura la espera, y con 15 s de espera antes de actuar se ve durante toda ella; no se ha medido por qué. Lo que el usuario ve en el caso permanente es la pantalla de carga sin otro aviso: es lo decidido (error solo por consola, recarga indefinida).
- **Paso 5 aplicado (2026-10-06, `36236aa`; sin push).** hijo6 se carga en P14 con los demás hijos (decisión del usuario, por la regla de homogeneidad). `cargarRestoDeiframes` lo incluye con `visibilidad: 'no-tocar'` (lo abre su botón, no el cargador) y esa lista es la que usan P14, la reanudación y la ruta fallback: las tres lo cargan. Era el único hijo diferido —la selección en el arranque, hijo1 a hijo4 y hijo5 en P14, y hijo6 al primer toque del botón— sin razón de diseño anotada. `abrirChat` ya no carga nada: si `hijoEstaListo('hijo6-chat')` le entrega el estado de ahora (`CHAT.ESTADO_PADRE`; el que recibió al cargarse es el de P14) y lo muestra, y si no, no hace nada. Se retiran `_chatCargando`, la exposición de `cargarHijo` en `globalThis` (solo la usaba el botón) y `HIJOS_CRITICOS` (el paso 4 lo introdujo para que cargar a hijo6 suelto no rearmara «todos listos»; con hijo6 en la lista de los demás todos se olvidan a la vez y no hay carga suelta), y con ellos RC-11. Specs: RC-9 nuevo (se carga con los demás sin tocar su botón; cargado pero sin apretón no se ve ni pulsando su botón; el cargador no lo enseña aunque esté listo; al abrirlo recibe el estado de ahora; un asistente que se está recuperando no se abre), CH-1 y CH-2 parten de la carga conjunta, y los specs 69, 70, 71, 72, 90 y 93 cargan los hijos antes de usar el asistente. Verificado antes de aplicar, en una copia: 4 mutaciones, cada una cae en su test (hijo6 fuera de la lista, el botón sin comprobar que está listo, el cargador que lo enseña, el botón sin entregar el estado) y la tanda de chromium 596/596; en el repo, 51/51 en los specs del asistente y de la recuperación.

##### K-58 — Un iframe que falla al cargar dispara igualmente `load`: el único detector de fallo es el plazo de 30 s, y ese plazo no se escala con la conexión — ✅ (medido)

- **Método.** Sondas de Playwright: la selección con `En-busca-del-tesoro.html` abortado (K07g, tres variantes: control, sin red, red que vuelve a la 3.ª petición), y los hijos cargados con CPU y red limitadas por CDP justo antes de cargarlos (K07h).
- **Resultado.** *Selección sin red:* el evento `load` salta a los 158-168 ms (tres veces, una por intento) con la página de error del navegador, así que «iframe cargado» no distingue éxito de fallo; el error sale a los 30,2 s («Timeout esperando HIJO_LISTO de seleccion»), la reconexión hace 3 intentos de ~30 s (fallan a los 60,2, 92,2 y 126,2 s) y a los 126,2 s sale el `alert` «Ha habido un problema al cargar la aplicación. Por favor, recarga la página.»; el aviso de «cargando» está visible hasta pasados los 100 s y a los 140 s queda la pantalla en blanco (el iframe en `display:none`). Con la red que vuelve a la 3.ª petición reconecta en el intento 2, a los 62,3 s. *Hijos con red lenta* (300 ms de latencia y 400 kbit/s, CPU 6×): salta el plazo de carga de los cinco a los 20,0 s (es `ajustarTimeoutPorConexion(10000)`, que sí se escala), el padre da por fallido a `hijo4` y a `hijo5` a los 50,1 s (los 30 s de `crearPromiseHijoListo` **no** se escalan) y los avisos llegan a los 52,6 y 60,8 s: se aceptan tarde, pero queda el error en el log. Con 600 ms y 150 kbit/s (CPU 12×) fallan cuatro a los 50,1 s y a los 100 s solo habían llegado `hijo1`, `hijo2` e `hijo3` (59-62 s). La CPU sola (6×) no rompe nada: todo listo en 0,9 s.
- **Medido sobre cómo se ve un iframe roto:** en todos los casos de carga fallida el `contentDocument` del iframe es ilegible (página de error de otro origen), a diferencia del de un iframe sano.
- **Pendiente: decisión, sin recomendar todavía.** *A)* detectar el fallo sin esperar 30 s (la ilegibilidad anterior es una señal inmediata, aún sin probar como detector); *B)* escalar con la conexión el plazo de `HIJO_LISTO`, como ya se escala el de carga; *C)* dejarlo. Cambia el tiempo que tarda el usuario en ver el aviso (hoy más de dos minutos en la selección).
- **Aplicada en parte, con el supervisor de K-57 (2026-10-06, `1cd71c5` y `1bb2af0`).** El plazo de arranque se escala con la conexión (opción B): la gracia es 6 intervalos de latido, y el intervalo es 5000 ms por `ajustarTimeoutPorConexion_S1(5000)` (30 s con la conexión normal), y se duplica por cada recarga seguida hasta 4 veces la base (`MULTIPLO_MAX_GRACIA`); vuelve a la base al estar sano. La señal inmediata de la opción A (el `contentDocument` ilegible) **no** se usa. En la selección no hay plazo ni reconectador propios: espera su `HIJO_LISTO` sin límite con la pantalla de carga puesta, sin `alert` por ella, y si la red está caída el supervisor enseña el overlay de «sin conexión» (`showInternetOverlay({ forzar: true })`, aunque aún no haya modo) y reintenta al llegar el evento `online`, con lo que la aplicación arranca 1,0 s después de volver la red (medido en una copia con la PWA entera; RC-6 cubre el overlay). **Falta (paso 3):** los plazos de 30 s de `crearPromiseHijoListo` en los cargadores del padre, que no se escalan.
- **Paso 3 aplicado (2026-10-06, `343126a`).** Los plazos de 30 s de los cargadores del padre desaparecen: ninguna espera de `HIJO_LISTO` tiene plazo propio (K-57, paso 3). La opción *A* (la señal del `contentDocument` ilegible) sigue sin usarse.

##### K-59 — El chat (hijo6) que no llega a cargar cubre la pantalla entera sin salida desde la propia app — ✅ (medido)

- **Método.** Lectura de `abrirChat` en `codigo-padre.html` y sonda de Playwright (K07f): se activa la aventura, se pulsa `#btn-chat-soporte` y se mide, con `chat-hijo6.html` abortado, con su `HIJO_PREPARADO` perdido y sin fallo, el iframe, quién recibe un clic en cinco puntos de la pantalla y si se cierra con un segundo clic, con Escape y con `history.back()`.
- **Resultado.** El chat se carga al primer clic: `chatCargado = true` en ese instante, el iframe se muestra sin esperar a que cargue y no hay plazo ni reintento. Abierto —sano o roto— ocupa toda la pantalla (0,0,412×800, `z-index` 1000020) y recibe los clics de los cinco puntos medidos (los cuatro rincones y el centro). Sano, se cierra con su ✗ interno (`CHAT.CERRAR`, `_hdl_CHAT_CERRAR`, `:13842`); ni el segundo clic, ni Escape, ni el botón «atrás» lo cierran en ningún caso. Con `chat-hijo6.html` abortado no existe ese ✗: dentro de la app no hay salida. Con su `HIJO_PREPARADO` perdido el chat se muestra igual, pero nunca recibe `PADRE_DATOS` (queda sin idioma ni estado del rescate).
- **No medido:** qué pinta un navegador real con la página de error (en el arnés el iframe roto aparece sin pintar y deja ver la app detrás, aunque se lleva los clics); si recargar la página es la única salida.
- **Pendiente: decisión.** *A)* que el padre cierre el chat si no hay `HIJO_LISTO` pasado un plazo; *B)* que el botón del chat, o Escape, cierren el iframe desde el padre; *C)* dejarlo. Es el mismo hueco de K-57 en un cargador más (el del chat).
- **Estado tras K-57 (2026-10-06).** `abrirChat` registra `hijo6-chat` con `registrarIframeHijo`, que lo marca `supervisado`: si no llega a estar listo, el supervisor lo recarga indefinidamente. **La salida deja de ser una decisión** (el apartado siguiente): hijo6 es un FAQ estático, no un chat, y se trata como cualquier hijo.
- **Resuelta por K-57, paso 4 (2026-10-06, `2a88a77`).** `abrirChat` carga el asistente con el cargador único `cargarHijo` en el primer toque del botón y lo muestra cuando está listo: un hijo6 que no ha llegado a cargar no se ve nunca, así que no hace falta ninguna salida (las opciones A, B y C del «Pendiente» quedan sin objeto). Mientras carga o lo recupera el supervisor, el botón no hace nada; ya listo, le entrega el estado de ahora (`CHAT.ESTADO_PADRE`) y lo muestra. La carga diferida que conservaba este paso (primer toque, no P14) la retira el paso 5. **Medido:** RC-9 con el código del paso 3 deja el asistente a la vista nada más pulsar el botón, sin haber completado el apretón de manos; con el nuevo no se ve hasta que está listo, un segundo toque no reinicia la carga y tampoco la reinicia un toque tras una recarga del supervisor.
- **Paso 5 (2026-10-06, `36236aa`).** hijo6 se carga en P14 con los demás hijos, no al primer toque: `abrirChat` ya no carga, solo entrega el estado de ahora y lo muestra si el asistente está listo (apartado «Paso 5 aplicado» de K-57). Con la carga conjunta, un hijo6 que no completa el apretón de manos lo recupera el supervisor como a los demás, y el botón no hace nada hasta que lo está.

##### K-60 — El shell del service worker es «Network First» sin plazo y sin caída a la caché ante una respuesta de error — ✅ (medido con el SW en modo producción; la conexión colgada, con una salvedad)

- **Método.** Lectura del bloque «Shell y módulos JS: Network First» de `sw.js` y sonda de Playwright con el SW real (K07j). En `localhost` el SW salta su caché por diseño (`IS_DEV`, `sw.js:108`); para medir producción se sirve `sw.js` con `IS_DEV` en falso y **se comprueba desde dentro del worker** que vale `false`. Con 60 entradas en la caché del shell y el SW controlando la página, se recarga el iframe de `hijo3` (`src = src`, lo que hace el latido) y se mira si llega un `HIJO_PREPARADO` **nuevo**. (La primera señal que usé, «el iframe es legible», era el documento viejo y no valía.)
- **Resultado.** *Corte limpio de red:* `hijo3` se recarga desde la caché y completa el apretón (llega en ~55 ms): **contemplado**. *Respuesta 503:* el SW devuelve el 503 en vez de la copia en caché (el iframe muestra «Service Unavailable») y no hay apretón nuevo. *Conexión colgada* (la petición nunca contesta): no hay apretón nuevo en 22 s; el código no tiene ningún plazo en ese camino (`fetch(...)` y solo `.catch` ante un rechazo; una respuesta que llega, buena o mala, se devuelve tal cual). Salvedad: la petición colgada se emuló con `context.route`, y la medición solo prueba que no hay caída a caché en 22 s.
- **Pendiente: decisión, sin recomendar todavía.** *A)* un plazo en el camino de red tras el cual se sirve la caché; *B)* servir la caché también ante una respuesta que no sea 2xx; *C)* dejarlo. Toca `sw.js` (y con él el `CACHE_VERSION` y la lista del shell).

##### K-61 — El pre-warm de `js/app.js` ya no precalienta nada, y desde la segunda entrada en AVENTURA activa primero la parada por defecto aunque el progreso real sea otra — ✅ (medido)

- **Método.** Lectura de `js/app.js` (`iniciarPrewarmEnCasa` y su auto-run, `_prewarmAventura`, `_reanudarSubsistemasTrasPrewarm`, `_activarParadaDefectoAventura`) y de `codigo-padre.html` (`_activarAventura`, `ensureDefaultParada`), y sonda de Playwright sobre el padre real (chromium, sin service worker, MapLibre sustituido; hijos cargados con `cargarRestoDeiframes` y `cargarHijoCasa`) con un envoltorio sobre `mensajeria.despacharLocal` que anota cada `NAVEGACION.CAMBIO_PARADA`. Se entra en AVENTURA con un `SISTEMA.CAMBIO_MODO` (`modo: 'aventura'`), luego a CASA y otra vez a AVENTURA, con `Aventura1` e idioma `es`; la entrada se hace a los 8 s del arranque, con el auto-run ya ejecutado, y como control a los 0,4 s, antes de que corra. Búsqueda desnuda de `prewarmIniciado`, `prewarmPausado`, `iniciarPrewarmEnCasa`, `_prewarmAventura`, `_flujoPrewarmModo` y `_reanudarSubsistemasTrasPrewarm` en `*.{html,js}` fuera de `docs/`: fuera de `js/app.js` solo `js/state-manager.js:53-54` (la declaración de las dos banderas).
- **Lo leído.** `iniciarPrewarmEnCasa` solo pone `estado.sistema.prewarmIniciado = true` y `prewarmPausado = true` (el latido lo enciende el padre una vez al arrancar y el GPS no se precalienta); su auto-run, al cargar `app.js`, lo llama cuando el modo es `null` o CASA, y reintenta cada 500 ms hasta 10 veces. Al entrar en AVENTURA, `_prewarmAventura` espera a los hijos listos (`esperarHijosListos(10000)`, con un tope de 20 s) y `_reanudarSubsistemasTrasPrewarm` llama a `_activarParadaDefectoAventura()` **solo si no se cumple** `prewarmIniciado && prewarmPausado`; después deja `prewarmPausado = false`. `_activarAventura` del padre llama a `ensureDefaultParada()` salvo en una reanudación (`restaurado: true`), y esa función sale si `estado.paradaActual` ya está puesta. Son dos sitios que deciden la misma cosa con reglas distintas: `ensureDefaultParada` elige el primer elemento con `tipo === 'inicio'` (si no, el primero con `tipo === 'parada'`, si no el índice 0), fija `indiceProgreso` y `elementoActual` y persiste el progreso; `_activarParadaDefectoAventura` elige el elemento con `padreid === 'padre-P0'` (si no, el primero) y solo despacha el `CAMBIO_PARADA` (`contexto: 'arranque_aventura'`).
- **Resultado.** (a) *Primera entrada en AVENTURA, a los 8 s* (`prewarmIniciado` y `prewarmPausado` en `true`, puestos por el auto-run): un solo `CAMBIO_PARADA` (`razon: 'default_parada'`, parada `Av1-P-0`, índice 3), el de `ensureDefaultParada`; `_activarParadaDefectoAventura` no se ejecuta. (b) *Segunda entrada* (AVENTURA → CASA → AVENTURA; las banderas quedan en `true` y `false`): `_activarParadaDefectoAventura` despacha primero (`contexto: 'arranque_aventura'`, la misma parada), `ensureDefaultParada` encuentra `paradaActual` puesta y sale («Ya existe paradaActual»), y 109 ms después llega el `CAMBIO_PARADA` de la restauración del progreso real (`_hdl_SISTEMA_CAMBIO_MODO`, `codigo-padre.html:7599`, con `paradaId: estado.paradaRealCongelada`), que aquí era también la parada por defecto. (c) *Entrada a los 0,4 s*, antes de que corra el auto-run (banderas sin definir): despacha `_activarParadaDefectoAventura` y `ensureDefaultParada` sale. (d) *Con el progreso real en OTRA parada* (`Av1-TR-1`, avanzado con un `CAMBIO_PARADA`; después CASA → AVENTURA, el camino del modo desarrollo, ver §24) la segunda entrada despacha **dos activaciones seguidas**, cada una con su pila: `Av1-P-0` (`_activarParadaDefectoAventura`, `js/app.js:328`, `contexto: 'arranque_aventura'`) y 117 ms después `Av1-TR-1` (la restauración de `_hdl_SISTEMA_CAMBIO_MODO`, `codigo-padre.html:7599`). La parada queda bien al final, pero entre medias se activó la de por defecto. La primera entrada, con el progreso todavía sin fijar, solo despacha la de `ensureDefaultParada`, y en la segunda `ensureDefaultParada` sale sin despachar nada porque la restauración ya fijó `paradaActual`. Las dos reglas de elección de la parada por defecto dan la misma en las 84 combinaciones aventura × idioma (7 × 12): lo que cambia no es qué parada sino cuándo corre cada camino. La causa es que `prewarmPausado` se pone a `true` una sola vez (`iniciarPrewarmEnCasa` sale si `prewarmIniciado` ya está) y `_reanudarSubsistemasTrasPrewarm` lo deja en `false`: desde la segunda entrada, siempre, la condición `!(prewarmIniciado && prewarmPausado)` se cumple.
- **No medido.** Qué reciben los hijos (audio, retos) con esa activación de más (mi intento de medirlo envolviendo `enviarMensaje` no vio nada: los envíos no pasan por esa propiedad del bus); la reanudación (`restaurado: true`), donde `_activarAventura` se salta `ensureDefaultParada` y sí puede ejecutarse `_activarParadaDefectoAventura` según las banderas; cuánto retrasa el cambio de modo la espera de `_prewarmAventura` con hijos que no están listos.
- **Pendiente: decisión, sin recomendar todavía** (regla 1b: se registra antes de tocar código). *A)* un solo camino, `ensureDefaultParada`, y retirar de `js/app.js` `_activarParadaDefectoAventura`, `_reanudarSubsistemasTrasPrewarm`, `_prewarmAventura`, `_flujoPrewarmModo`, `iniciarPrewarmEnCasa` con su auto-run y las dos banderas (en `estado.sistema` y en el state-manager); *B)* un solo camino, `_activarParadaDefectoAventura`, y quitar la llamada de `_activarAventura`; *C)* dejarlo. Lo medido apunta a la opción *A*: `ensureDefaultParada` cubre las dos entradas (en la primera activa la parada por defecto, en la segunda sale porque la restauración ya fijó `paradaActual`), y el camino de `app.js` solo añade una activación de más. Falta medir la reanudación antes de recomendarla.
- **Por aplicar con el principio del usuario (2026-10-19): un solo camino.** Lo que faltaba medir antes de recomendar A ya está medido (R2.13: en la reanudación no hay activación de más). Desde aquella medición la activación ha cambiado (K-73, K-85, K-89, K-90), así que antes de tocar nada se vuelve a medir la activación de más con un spec, en rojo con el código de hoy; solo si sigue, se aplica A.
- **Aplicada (2026-10-19, `8cf40ab`), A sin la parte que no era de esta entrada.** Medido antes con el spec 139: la vuelta a AVENTURA desde CASA despachaba `Av1-P-0` con `contexto: 'arranque_aventura'` y después el elemento en curso (PD-2 en rojo). Al leer `js/app.js` entero, el pre-warm hacía dos cosas: activar la parada por defecto y, al entrar en AVENTURA, esperar a los hijos (`esperarHijosListos`, 10 s con tope de 20 s) antes de `actualizarInterfazModo`. Se quita solo lo primero: `_activarParadaDefectoAventura`, `_reanudarSubsistemasTrasPrewarm`, `iniciarPrewarmEnCasa` con su arranque automático (nadie la importa por su nombre; el padre importa `js/app.js` por su efecto y por `registrarControladoresApp`) y las dos banderas del state-manager. La espera se queda igual, en `_esperarHijosAlEntrarEnAventura()`: quitarla cambiaría cuándo reciben los hijos el modo, y eso no está medido. Spec 139 nuevo: PD-2 en verde; PD-1 (la primera entrada activa la de inicio), el control, en verde antes y después. Chromium, los diecisiete specs de cambio de modo y reanudación: 100 de 100. Guía: §2.5 (describía los dos caminos como diseño y llamaba «invisible» a la activación de más), fuera la ficha del autodespacho de `js/app.js` (decía que era un respaldo para cuando el state-manager no está listo; el código no lo comprobaba), la fila de la función, el estado del state-manager, las exportaciones de `app.js` y un ejemplo de §2.2. **Censo (regla 3b):** tocados `js/app.js` y `js/state-manager.js` (los carga el padre); ningún frame cambia su código: los hijos solo dejan de recibir esa activación de más.

#### Familia T — Lo que encontró la re-verificación del 2026-10-07 (R2.12)

##### K-62 — Esperas escritas a mano: doce bucles que sondean hasta que algo exista o llegue, además del helper `retryUntilAvailable` — ✅ (leído; decisión abierta)

- **Dónde** (líneas de `4bea83e`). En el padre, nueve: el bloque de nivel superior del Script 1 que procesa `__pendingDistribucion` espera `distribuirDatosAventura` (40 × 250 ms, `:3967`; al agotarse escribe un `error`, avisa al usuario con `_avisarFalloCargaAppUnaVez` y cancela la distribución); `_distribuirDatosRest` espera la misma función —por la promesa `__distribuirReadyPromise` si existe (K-72) y, si no, con un sondeo de 120 × 250 ms (`:4867-4868`)— y reintenta la distribución esperando `sistemaInicializado` (`:4875`: tres intentos con plazo creciente y un `warn` al final); `validarMensajeriaFase1` espera `mensajeria.enviarMensaje` (20 × 200 ms, `:7910`, y lanza); el Script 2 espera `mensajeria` y `estadoPadre` (200 × 50 ms, `:9355`; al agotarse escribe un `error` y lanza si falta `mensajeria`); `_setupRegistrarControladores` espera `registrarControladorSeguro` (200 × 50 ms, `:10514`, y sigue con un `error`); el Script 4 espera `mensajeria` y `registrarControladorSeguro` (dos bucles de 200 × 50 ms, `:14210` y `:14219`; lanza si falta `mensajeria`); el Script 5 espera `__vv_logger` (200 × 50 ms, `:14590`, y sale). Fuera del padre, tres: `esperarRespuestas` de `js/app.js` sondea cada 100 ms los `ENTENDIDO` y `EFECTUADO` del cambio de modo hasta su plazo y, al agotarlo, escribe un `warn` con quién no contestó (`:235`); el botón de imagen de hijo2 espera las coordenadas (20 × 100 ms, `coordenadas-hijo2.html:1051`, y avisa con `warn`); y `completarCambioParada` espera la instancia del mapa (5000 ms en pasos de 100 ms, `js/funciones-mapa.js:2122`, y aborta con `warn`).
- **La otra forma de lo mismo.** `retryUntilAvailable` (`js/utils.js:222`) tiene seis llamadores (`codigo-padre.html:3593`, `:5280`, `:7865`, `:13473`, `js/app.js:750` y `js/utils.js:392`); al agotarse resuelve `false` y escribe un `warn` si se le pasa `mensaje`. Los doce bucles también están acotados, por contador o por tiempo, y al agotarse lanzan, avisan o siguen con un aviso: son dos formas de escribir «espera acotada a que se cumpla X». Para `distribuirDatosAventura` hay una tercera, la promesa, que no tiene plazo (K-72).
- **Método.** Censo de `while (` en el código de producción (`*.html` de la raíz, `js/*.js` y `sw.js`, sobre `4bea83e`): 20 líneas, de las que 6 no son esperas (dos recortes de caché, dos colas que se vacían, un recorrido del DOM y un desenvolver de nodos) y 2 son las de K-63; las otras 14 líneas con `while` son comentarios y textos en inglés. Lectura de cada bucle y de lo que hace al agotarse.
- **Lo que este documento ya decía.** R2.10 cuenta seis de estos bucles, los que llevan un `setTimeout` dentro del `while` (cuatro de los doce y los dos de K-63), entre las formas de la familia «esperas y plazos», cuya decisión sigue abierta; K-54 leyó las dos esperas de `distribuirDatosAventura` como «espera acotada» (K-72 lo corrige); el EJE 2 pide una espera acotada para cada dependencia de Script 2 hacia Script 1. Ninguna entrada los trata como un segundo camino frente al helper, y R2.3 decía «Polling: un solo camino» (E10).
- **Pendiente: decisión.** *A)* llevar los doce bucles a `retryUntilAvailable`, conservando el plazo, el mensaje y la salida de cada sitio (lanzar, seguir o abortar); *B)* dejarlos. Sin recomendar: el helper solo resuelve `false`, así que lo que cada sitio hace al agotarse habría que mantenerlo sitio a sitio. `distribuirDatosAventura` se decide en K-72.

##### K-63 — La espera de «padre listo» de la selección y de hijo1 no esperaba nada — ✅ (medido; aplicada la opción A)

- **Dónde** (`4bea83e`). La selección, en `_esperarPadre` (`En-busca-del-tesoro.html:2628-2643`, llamada desde `init`), e hijo1, en el paso 1 de `init` (`extrainfo-hijo1.html:126-144`): mientras `parent.postMessage` no sea una función, esperan en pasos de 100 ms hasta `CONFIG_HIJO.TIMEOUT_PARENT` (5000 ms); después anotan `estadoComponente.padreConectado = true` (selección) o `estadoMenu.parentReady = true` (hijo1) y escriben «Padre listo después de Nms».
- **Por qué no espera nada.** En un navegador `parent.postMessage` es siempre una función (también con el padre en otro origen), así que el bucle no da ninguna vuelta. **Medido** (chromium, padre real con sus hijos, sonda en una copia): las dos escriben «Padre listo después de 0ms». Y lo que anotan no lo lee nadie: `padreConectado` solo viaja en la respuesta al latido de la selección y en un log de depuración de `iniciarAventura`, y `parentReady` en la respuesta al latido de hijo1; el handler de `SISTEMA.HEARTBEAT_RESPONSE` del padre pasa el mensaje a `procesarHeartbeatResponse` (`js/mensajeria.js`), que solo mira el `origen` (K-70). Búsqueda desnuda de `TIMEOUT_PARENT`, `padreConectado`, `parentReady` y `_esperarPadre` en todo el repositorio: solo esos sitios y dos filas de la guía; ningún spec ni herramienta los cita.
- **Cómo lo sabe el resto.** Los siete frames que hablan con el padre (la selección e hijo1 a hijo6) saben que el padre está listo por el apretón de manos del bus (`HIJO_PREPARADO` → `PADRE_DATOS` → `HIJO_LISTO` → `PADRE_CONFIRMA_HIJO_LISTO`; recuento por fichero de los tres en los siete). hijo2 a hijo5 no tienen esta espera (`parent.postMessage` solo sale en un comentario que advierte de no usarlo) e hijo6, el padre, `mapa-completo`, el puzzle y `video-intro` tampoco (0 apariciones). Era una forma de más, solo en dos frames, para algo que los siete resuelven con el apretón.
- **Corrección a K-57.** El apartado «El apretón, leído» dice que hijo1 «espera antes hasta 5 s a que el padre esté listo»: el bucle no daba ninguna vuelta.
- **Decisión del usuario (2026-10-07): A**, quitar la espera de los dos frames con `TIMEOUT_PARENT`, `padreConectado`, `parentReady` y esas dos claves de la respuesta al latido. Las otras eran *B)* ponerla en todos los frames y *C)* dejarla.
- **Aplicada la opción A (`fd367da`).** Salen de la selección `_esperarPadre` con su llamada en `init` (el JSDoc que tenía encima pasa a `init`), `CONFIG_HIJO.TIMEOUT_PARENT` y `estadoComponente.padreConectado`, también del log de depuración de `iniciarAventura`; de hijo1, el paso 1 de `init` (los dos siguientes se renumeran), `CONFIG_HIJO.TIMEOUT_PARENT` y `estadoMenu.parentReady`. Las dos respuestas al latido pierden esa clave. La guía describe las dos respuestas sin ella (§26.12.3 y §26.12.4), y §37.2 cita en su línea nueva las tres definiciones del módulo 7 de la selección que el cambio desplaza (`verificar-citas`: 83 bien, 44 sin resolver, como antes, y 0 mal). **Medido con la misma sonda antes y después** (chromium, padre real con sus hijos): desaparecen las dos líneas «Padre listo después de 0ms», los siete frames completan el apretón y las respuestas al latido llevan las claves que recoge K-70. Búsqueda desnuda de los cuatro nombres en todo el repositorio después del cambio: solo este documento. `npm run lint` sale con 0, y chromium entero, en verde: 598 tests en dos tandas (397 y los 205 de los specs 55 a 99).

##### K-64 — Tres variables de `js/funciones-mapa.js` que nadie lee, y una frase de la guía sobre un efecto que no existe — ✅ (búsqueda desnuda)

- **Dónde** (`4bea83e`). `_mapaOpciones` (`:385`): se escribe en `inicializarServicioMapa` (`:1195`) y se pone a `null` en `:3299`; nadie la lee. `_pulseTimeout` (`:386`, «Timeout del efecto de llegada (cancelable)»): ni se asigna ni se lee. `_elementosParaReescalar` (`:862`, «Lista de elementos a re-renderizar cuando cambie el zoom»): no se usa.
- **Método.** `no-unused-vars` de ESLint con `vars: 'all'` y sin ignorar el prefijo `_` (el lint del proyecto no aplica la regla a `js/*.js`, y en los HTML ignora lo que empieza por `_`) y búsqueda desnuda de los tres nombres en todo el repositorio: 3, 1 y 1 apariciones en el código, las de arriba. Los dos únicos `clearTimeout` de `funciones-mapa.js` son de otros temporizadores (`:1953` y `:2177`), y el único pulso del marcador es el halo decorativo del 🛸 en CASA (`@keyframes gpsPulse`, `:3449` y `:3513`), que no es de llegada ni usa la variable.
- **La guía** (fila de `funciones-mapa.js` del inventario de módulos) decía que el efecto de pulso de llegada usa `_pulseTimeout` con `clearTimeout` para no acumular confirmaciones seguidas (G-48).
- **Pendiente: decisión.** *A)* retirar las tres; *B)* dejarlas.
- **Aplicada (2026-10-13, `18cfe1f`): A**, con el encargo del usuario de quitar el código muerto. Fuera las tres variables; con `_mapaOpciones` se va el parámetro `opciones` de `inicializarServicioMapa`, que solo la alimentaba (sus llamadores, el padre y los specs 17, 23, 24, 27, 47 y 53, pasan solo la instancia del mapa). Búsqueda desnuda de los tres nombres en `*.html`, `*.js`, `*.cjs` y `*.mjs` antes de quitarlas: las cinco líneas de `js/funciones-mapa.js`.

##### K-65 — `limpiar()` del bus no tiene ningún llamador — ✅ (búsqueda desnuda)

- **Dónde.** `js/mensajeria.js:1150-1162`: exportada y fuera del objeto `globalThis.mensajeria`; rechaza las confirmaciones pendientes («Mensajería limpiada»), vacía la cola y escribe un log.
- **Método.** Búsqueda del identificador `limpiar` en `*.html`, `js/*.js` y `tests/`, fuera de comentarios y cadenas: solo su definición y una función local homónima de `js/video-playback-utils.js:67`, sin relación. Por esa homónima `tools/codigo-muerto.js` no la marca (cuenta como uso un token igual en otro fichero, límite ya descrito en R2.7); `exports-tokens.cjs` y `exports-sin-uso.cjs` sí la listan.
- **Pendiente: decisión** (toca el bus, regla 1). *A)* retirarla; *B)* dejarla.
- **Nota (2026-10-12).** `colaMensajes` (`js/mensajeria.js:95`) va con ella: su único uso es el vaciado de `limpiar()` (`:1159`); nadie la llena ni la lee (búsqueda desnuda en `*.html` y `*.js`: esas dos líneas). La guía (§26.5) describía con ese nombre una cola de envíos pendientes que `marcarScript2Listo()` vaciaba; ninguna de las dos cosas existe (G-64).
- **Aplicada (2026-10-13, `93cb6dc`): A**, con el encargo del usuario de quitar el código muerto. Fuera `limpiar()` y `colaMensajes`; el barrido periódico de confirmaciones caducadas, que está debajo, sigue como estaba. Antes de quitarla: el identificador `limpiar` en `*.html`, `*.js`, `*.cjs` y `*.mjs` (su definición, la homónima local de `js/video-playback-utils.js` y otra de `tools/verificar-citas-guia.js`), y que ningún frame recorre las claves del módulo del bus (los once lo importan entero, como `bus` o `mensajeriaModule`, y lo usan por nombre). La guía no la nombra.

##### K-66 — `CONFIG_PADRE.COMPONENTE_ID`, `.VERSION` y `.DEBUG` siguen sin lector — ✅ (búsqueda desnuda)

- **Dónde.** `codigo-padre.html:4034-4036` (`'PADRE-PRINCIPAL'`, `'3.0.0'` y `true`).
- **Método.** Lecturas `CONFIG_PADRE.X` distintas de `LOG_PREFIX` e `ID` en `*.html` y `js/*.js`: ninguna; ninguna desestructuración ni clave computada de `CONFIG_PADRE`; el literal `PADRE-PRINCIPAL` solo aparece en su definición. Lo único que las toca es el test «1f. globalThis.CONFIG_PADRE existe con todas las claves requeridas» del spec `02-global-variables` (`:116`), que comprueba que existen y su tipo.
- **Por qué siguen.** K-01 las dejó «para la decisión de K-02», y K-02 A vació `js/config.js` y no `CONFIG_PADRE`.
- **Pendiente: decisión.** *A)* retirarlas y ajustar ese test del spec 02; *B)* dejarlas.
- **Aplicada (2026-10-13, `2ddb79f`): A, y una clave más.** Al listar todas las apariciones de `CONFIG_PADRE` (143 en `*.html`, `*.js`, `*.cjs` y `*.mjs`, clasificadas por lo que les sigue) sale que `ID` tampoco tiene lector: las 72 lecturas con punto son de `LOG_PREFIX`, y el objeto entero solo viaja a `js/controladores-padre.js`, que lee `LOG_PREFIX`. Las últimas lecturas de `CONFIG_PADRE.ID` se fueron con `getPadreId` (`f6ab460`, K-28); esta entrada daba `ID` por leída. `CONFIG_PADRE` queda en `{ LOG_PREFIX }`, y la reserva de Script 2 pierde su `ID`. El test 1f del spec 02 comprueba el objeto, su `LOG_PREFIX` y que no lleva otra clave (en rojo antes del cambio: sobraban las cuatro). Guía: G-71.

##### K-67 — El objeto API del state-manager: tres funciones con dos nombres y cinco que solo usan los specs o nadie — ✅ (búsqueda desnuda)

- **Dónde.** El objeto `stateManagerAPI` de `inicializarStateManager` (`js/state-manager.js`), publicado como `__stateManager` y `__vv_stateManager`. Dos nombres para la misma función: `registrarControladorCentral` y `registrarManejador`, `getMapaControladoresSync` y `getManejadores`, `diagnosticarStateManager` y `diagnosticar`. El bus usa los alias (`registrarManejador` en `js/mensajeria.js:254` y `:262`; `getManejadores` en `:286` y `:920`); de los otros tres nombres, solo el spec 20 usa `getMapaControladoresSync`.
- **Sin llamador de producción.** `getEstadoPadre` (solo un `typeof` del spec 01, `:65`); `getScript2Listo` y `getControladoresPorTipo` (los usan specs como sonda: 117, 28 y `helpers/boot.js`; 28 y un comentario del 55); `getControladoresRegistrados` (solo la llama `diagnosticarStateManager`) y `diagnosticarStateManager` con su alias (nadie: herramienta de consola).
- **Relacionado.** K-42 trató estos nombres como exports de uso interno o solo de specs, no como nombres duplicados del objeto API.
- **Pendiente: decisión.** *A)* un nombre por función en el objeto API y retirar lo que no usa nadie (con el `typeof` del spec 01); *B)* dejarlo.

##### K-68 — Guardas `!mensaje?.origen` que el bus hace inalcanzables: veintitrés en seis frames — ✅ (leídas una a una)

- **Dónde** (`4bea83e`). Veintitrés guardas de la forma `!mensaje?.origen` o `!mensaje || !mensaje.origen` al principio de un handler, que escriben en el log y salen si el mensaje no trae `origen`: la selección 3 (`_onPadreDatos`, `_onPadreConfirmaHijoListo` y `_onHeartbeat`), hijo1 3 (los handlers de `PADRE_DATOS`, `PADRE_CONFIRMA_HIJO_LISTO` y `HEARTBEAT`), hijo2 2 e hijo3 2 (los dos handlers del apretón), hijo5 6 (los de `PADRE_DATOS`, `HEARTBEAT`, `NAVEGACION.CAMBIO_PARADA` y `SISTEMA.ERROR`, y los dos validadores que solo llaman sus handlers: `_validarCambioModo`, desde el de `CAMBIO_MODO`, y `_validarMensajeParadas`, desde el de `RESPUESTA_DATOS_PARADAS`) y el padre 7 (`HIJO_PREPARADO`, `HIJO_LISTO`, la respuesta al latido, `RETO.COMPLETADO` y tres de audio: `ESTADO_ACTUALIZADO`, `FIN_REPRODUCCION` y `ERROR`).
- **Por qué no se alcanzan.** Un handler solo se ejecuta a través de `_encolarEjecucionHandler` (`js/mensajeria.js:560`), y a ella llegan dos caminos: `despacharLocal` (`:643`), que sella el `origen` con el del propio frame (`:650`), y el listener de `message`, que descarta antes todo mensaje sin `origen` (`:727`). Las funciones con nombre (las `_on*` de la selección y las `_hdl_*` del padre) solo aparecen en su registro, y los validadores de hijo5, en la llamada desde su handler.
- **Método.** Búsqueda de las dos formas en los `.html` de la raíz y `js/*.js`: 25 líneas, las 23, la de `js/app.js:388` (decide si se contesta; no es una guarda de entrada) y la del propio bus; para cada una, el handler que la contiene; búsqueda desnuda de cada función con nombre en todo el repositorio; lectura de los dos caminos del bus hasta `_encolarEjecucionHandler`. Otras formas de escribir la misma guarda no se buscaron.
- **Pendiente: decisión.** *A)* retirarlas; *B)* dejarlas como defensa redundante.
- **Aplicada (2026-10-13, `1e1a660`): A**, con el encargo del usuario de quitar el código muerto. Recontadas sobre el código de ese día: las mismas 23, en los mismos seis frames; para cada una, su bloque, la función que la contiene y todas las apariciones del nombre de esa función (las `_on*` de la selección y las `_hdl_*` del padre, solo en su registro; los dos validadores de hijo5, solo en la llamada de su handler). El único listener de `message` de la aplicación es el del bus (búsqueda de `addEventListener('message'` y de `onmessage =` en `*.html` y `*.js`: el del bus, el del service worker y los de MapLibre), y los handlers solo se ejecutan en `js/mensajeria.js`, desde `_encolarEjecucionHandler`. Con las guardas se van sus comentarios («Validación de origen») y el parámetro `mensaje` de los dos handlers de latido que ya no lo usan (selección e hijo1). Censo (regla 3b): hijo4, hijo6, mapa-completo, puzzle y video-intro no tenían ninguna (0 apariciones de las dos formas en cada uno). Chromium entero, 626 de 626, con este cambio y los de K-64, K-65, K-66, K-81 y la fila 66. Guía: G-72.

##### K-69 — Variables y reglas CSS sin uso — 🔎

- **Variables definidas que nadie usa** (`barrido-css-dom.cjs`): `--audio-action-scale` (padre), `--iframe-h` (hijo1, hijo2 e hijo6), `--progress-bg`, `--progress-color`, `--trapecio-height`, `--trapecio-radius` y `--trapecio-shadow` (hijo2 e hijo3). `--tx` y `--ty` se usan en `video-intro.html` sin definirse en ninguna regla (no comprobado si las pone el JavaScript en línea).
- **Reglas cuya clase no aparece en el HTML ni en el JavaScript** (`barrido-clases.cjs`): unas 72 (`video-intro.html` 37, hijo2 14, el padre 6 —las `notification*`—, la selección 6, hijo3 3 e hijo5 2), y dos clases que el JavaScript pone sin regla ni lectura (`img-fallback` en el padre y `deshabilitado` en hijo4). K-33 ya avisaba de falsos positivos por nombres compuestos.
- **Pendiente:** leerlas una a una antes de proponer nada.
- **Leídas una a una y retirado lo muerto (2026-10-13, `7f415a8`); lo que corrige de esta ficha.** Una variable CSS no cruza la frontera de un iframe, así que la pregunta es por documento: definida (en CSS o con `setProperty`) y sin `var()` ni `getPropertyValue()` en ese mismo documento (`css-vars-por-doc.cjs`, scratchpad, sin versionar; 10 apariciones sin clasificar, todas comentarios o texto de log). El barrido de arriba las sumaba entre documentos y no veía la lectura desde JavaScript. Resultado: `--audio-action-scale` **sí se usa** (la lee `getPropertyValue`, `codigo-padre.html:10264`) y se queda; sin uso en su documento hay más de las listadas — hijo3: `--trapecio-width`, `--trapecio-height`, `--trapecio-bg`, `--trapecio-shadow`, `--trapecio-radius`, `--progress-color` y `--progress-bg`; hijo2: `--iframe-h`, `--progress-thick`, `--trapecio-height`, `--trapecio-shadow`, `--trapecio-radius`, `--progress-color`, `--progress-bg`, `--timer-font-size`, `--timer-color` y `--gap-inferior` (la que coloca los hijos es la del padre); hijo1: `--iframe-h`; hijo6: `--iframe-w` e `--iframe-h`; el padre: `--iframe-w`, en `#audio-control-overlay`. `--tx` y `--ty` de `video-intro.html` no las define nadie, ni el CSS ni el JavaScript (búsqueda desnuda): la única regla que las usa, `.or-badge`, no la lleva ningún elemento (búsqueda desnuda: solo su propia línea). Las reglas, por documento, cada clase con búsqueda desnuda en `*.html` y `js/*.js` y con el marcado y todos los `classList`/`className` del documento leídos: en hijo2 las 14 y, con ellas, `@keyframes pulse`, que solo usaban dos de ellas (el marcado son seis `<button class="boton">` con una imagen, y el JavaScript solo pone `activo`, `disabled` y `spinning`); en hijo3, `#retosBtn .icon-puzzle` y `.time-display` (el reloj es `.time-overlay`), y al irse la segunda quedan sin uso `--timer-font-size` y `--timer-color`; en el padre, el bloque «Notification system styles» entero (`#notification-container` y dieciséis reglas `.notification…`, 89 líneas): ni el id ni las clases aparecen en ningún otro sitio del repositorio; en la selección, `.arrow-right`, `.checkmark`, `.cross`, `.en-desarrollo` y `.audio-controls`; en hijo5, los selectores `.boton-parada` y `.boton-tramo` de una regla agrupada (las clases que pone el JavaScript salen de `_TIPO_BTN`: `parada-btn`, `tramo-btn`, `inicio-btn`, `default-btn`); en hijo4, la clase `deshabilitado` que tres líneas ponen y quitan en `#botonRetos` sin regla ni lector (lo que lo apaga es `disabled`).
- **Medido antes de retirar (sonda desechable, chromium).** Con el padre y sus hijos reales, en cuatro momentos (hijos cargados; AVENTURA con la parada activada; audio saltado y llegada confirmada; tras pulsar el botón de retos), `querySelectorAll` de cada selector que se retira, en su documento: 0 en todos — 7 selectores del padre, 14 de hijo2, 2 de hijo3 y 5 de la selección —, con un selector de control por documento que sí casa (1, 6, 1 y 17). En hijo4, 0 elementos con la clase `deshabilitado` y 0 reglas que la nombren. **En hijo5 la medición no vale:** su control dio 0 (el arnés no le genera botones); ahí la base es la lectura.
- **Se quedan, con motivo.** (1) `video-intro.html`, las 37 reglas y `--tx`/`--ty`: no se han leído una a una. (2) `#hijo3 .boton`, `.boton.habilitado` y `.boton.deshabilitado` de hijo3: no pueden casar (en ese documento no hay ningún elemento con id `hijo3` ni con clase `boton`), pero un comentario del propio fichero dice que se mantienen «por si se retoma»: decide el usuario. (3) `img-fallback`, que el padre pone sin regla: la lee el spec 49. (4) `.tick.correcto` y `.x.incorrecto` de la selección, que son un hallazgo y no código muerto: ver abajo.
- **Hallazgo: el ✓ y la ✗ de los retos de la selección no reciben su color.** Tiene entrada propia, K-92, con su medición (M-27).
- **Comprobación y censo (regla 3b).** Tras aplicar: lint limpio, `verificar-frames` y `verificar-esperas` sin diferencias, chromium entero 635 de 635; no se lanzaron firefox ni los dos móviles en este paso. La guía no nombra ninguna de las clases ni de las variables retiradas (búsqueda de cada nombre: 0; lo que dice de `--iframe-w` en hijo1 e hijo2 sigue siendo cierto); solo cambia su tabla generada de §37.2, por los números de línea del padre. Tocados: padre, selección, hijo1, hijo2, hijo3, hijo4, hijo5 e hijo6. No tocados: `mapa-completo.html` y `puzzle.html` (ninguna regla sin elemento en el barrido de clases y ninguna variable sin uso: «1 definidas, todas usadas» y «0 definidas») y `video-intro.html` (lo dicho arriba: sin leer).
- **`video-intro.html`, leído (2026-10-13, por la tarde); sin aplicar.** La lista entera de las 37 clases con regla y sin elemento (el barrido la corta en 18; `clases-video-intro.cjs`, scratchpad): `knight-right`, `s2-grid`, `s2-flag`, `hl`, `s2-big`, `s2-ok`, `btn-grid`, `btn-group`, `bg-label`, `btn-sub-ico`, `err-stack`, `err-img`, `adv-item`, `tapped`, `adv-blur`, `s3-ov`, `s3-vimg`, `s3-ok`, `s4-bar`, `s4-fill`, `s4-pct`, `drone-frame`, `drone-bar`, `drone-prog`, `m-out`, `ch-icon-row`, `ch-btns`, `ch-hint`, `ch-next`, `extra-wrap`, `x-btn`, `net-ov`, `net-img`, `net-line`, `or-title`, `or-badge` y `end-label`. Leída cada regla y buscado cada nombre: ninguno aparece fuera de su propia regla, ni en el marcado ni en el JavaScript del fichero (que monta las escenas con cadenas de HTML, así que el nombre tendría que estar escrito), ni compuesto por trozos (búsqueda de `'raíz-' +`, de plantillas con `raíz-${` y de sufijos del tipo `}-ok`: nada), ni en otro `html` o `js` del repositorio (salen dos coincidencias que son otra cosa: una variable `hl` del spec 121 y la palabra inglesa «tapped» de una traducción). Ningún otro documento escribe en el de `video-intro.html` (`contentDocument` solo aparece en el padre, y las dos veces sobre hijo5). Con ellas quedarían sin uso `@keyframes dP` (solo lo usa `.drone-prog`) y las variables `--tx` y `--ty` (solo `.or-badge`); `@keyframes pulseDot` no lo usa hoy ninguna regla. En la línea de `.m-out` conviven `.m-green` y `.m-red`, que sí llevan dos botones. **Pendiente:** retirarlas con la misma comprobación que el resto de esta entrada (medir en la página real que ningún elemento casa, y la suite); no se hizo en esta pasada porque no se lanzó Playwright.
- **`video-intro.html`, aplicado (2026-10-14, `9ee6c05`).** Medido antes en la página real (sonda desechable, chromium): la intro recorrida entera —20 pulsaciones de «siguiente» hasta `#end-btns.on`—, contando cada 300 ms los elementos que llevan cada una de las 37 clases: 0 en todas, con cuatro clases de control que sí casan (`btn-mundo-verde` 2, `m-green` 1, `btn-main-ico` 40, `ch-send` 1) y 13 animaciones en marcha, ninguna `dP` ni `pulseDot`. El control del contador de página de esa sonda no casó nada (su patrón no encuentra el contador en el texto), así que el test salió en rojo por esa guarda: lo que valida el recorrido es la llegada al final y los cuatro controles. Búsqueda desnuda de los 35 nombres raíz, de `pulseDot`, `--tx` y `--ty` en los 324 ficheros de texto versionados y en `video-intro.html` fuera de las líneas retiradas: nada que sea una clase (salen `internet-overlay`, que contiene «net-ov», y «zoom-out», que contiene «m-out»; `dP`, solo dentro de `_vidPreload`). Retiradas 57 líneas con un script en disco que aborta si una sola no empieza por lo esperado: las 43 de regla, `@keyframes dP` y `@keyframes pulseDot`, y seis cabeceras de comentario que se quedaban sin contenido, cada una con su línea en blanco; de la línea que comparten `.m-green`, `.m-red` y `.m-out` solo sale la tercera. Después: el instrumento da 115 clases con regla y 0 sin elemento; en el CSSOM de la página (segunda sonda desechable) siguen las 21 reglas vecinas de los bloques retirados, no queda ninguna de las retiradas y los 13 `@keyframes` que hay son los 13 que se ven animando; el mismo recorrido da las mismas 20 pulsaciones, los mismos controles y las mismas animaciones, sin errores de página. Lint limpio. Los cinco specs que nombran `video-intro` (116, 18, 60, 80 y 88) en los cuatro navegadores, con el vigía: 128 de 128 (32 por navegador), 75,1 °C de máxima. La guía nombraba tres de las clases en dos frases y citaba tres líneas del fichero en §37.2 (G-81). **Censo (regla 3b):** tocado solo `video-intro.html`; el padre, la selección, hijo1 a hijo6, mapa-completo y puzzle, sin cambios (`git show --stat 9ee6c05`: `video-intro.html`, la guía y los tres ficheros que reescribe el hook).
- **Las tres reglas de hijo3, por aplicar (2026-10-19).** La nota «se mantiene el color al día por si se retoma» llegó con el cambio a los dos verdes y el rojo (`e645ea4`), sin una decisión del usuario registrada en la memoria ni en este documento; con su principio (sin código muerto) se quitan. Búsqueda desnuda de `boton` y de `hijo3` en `audio-hijo3.html`: solo esas reglas y sus comentarios.
- **Aplicado (2026-10-19, `3b2eefa`).** Fuera las tres reglas, y el comentario de al lado deja de citar `.boton.disabled`, que no está en ese fichero. El spec 18 las probaba creando a mano un `<div id="hijo3">` para que la regla casara (BU-2c): fuera ese test, y BU-2d y BU-2e pasan a ser BU-2c y BU-2d; 7 de 7 en chromium. Guía: la tabla de rojos y la fila del spec 18.

##### K-70 — La respuesta al latido tiene una forma distinta en cada frame y el padre no lee ninguna — ✅ (medido)

- **Medido** (chromium, padre real con sus hijos, sonda en una copia: las claves de `datos` de cada `SISTEMA.HEARTBEAT_RESPONSE` que procesa el padre, por origen, con K-63 aplicada): la selección manda `{ aventuraSeleccionada, componente, estado, idiomaSeleccionado, inicializado, terminosAceptados, timestamp, ultimaInteraccion }`; hijo1 `{ componente, estado, inicializado, timestamp, ultimaInteraccion }`; hijo2 `{ coordenadasCargadas, estado, gpsActivo, paradaActual, timestamp }`; hijo3 e hijo4 `{ timestamp }`; hijo5 `{ componenteId, estado, timestamp }`; hijo6 `{ estado, timestamp }`. Y `estado` no tiene ni el mismo tipo (leído en cada emisor): es una cadena en la selección (`'activo'`), en hijo1 (`'abierto'` o `'cerrado'`) y en hijo2 e hijo6 (`'activo'` o `'inicializando'`), y un objeto en hijo5 (`{ inicializado, modo, paradasCargadas }`).
- **hijo5 la manda también sin latido.** Al volver la página a primer plano (`visibilitychange`, `boton-casa-hijo5.html:1245`) manda por su cuenta un `SISTEMA.HEARTBEAT_RESPONSE` con `razon: 'visibilitychange'` (`:1259`) y después regenera sus botones o vuelve a pedir las paradas. Es el único frame que manda ese tipo sin haber recibido un `SISTEMA.HEARTBEAT`; la guía lo describe (la fase 3 del latido y los mensajes salientes de hijo5).
- **Quién lo lee.** El handler del padre (`codigo-padre.html:7613`) pasa el mensaje a `procesarHeartbeatResponse` (`js/mensajeria.js:1134`), que del mensaje solo usa `origen`: pone a cero los latidos sin respuesta de ese hijo y, si ya completó el apretón de manos, también sus recargas. Ninguna clave de `datos` tiene lector en producción, y la respuesta de hijo5 al volver a primer plano cuenta para el supervisor como una respuesta más.
- **Los specs.** Los que escuchan la respuesta al latido (77, 81, 83 y 85) solo miran `tipo` y `origen`; el 09 comprueba que el padre tiene el handler, y el arnés del bus (`tests/e2e/fixtures/bus/hijo.html`) contesta con `datos: {}`. Ninguno lee una clave de `datos` ni cubre la respuesta de hijo5 al volver a primer plano. Método: búsqueda de `HEARTBEAT_RESPONSE`, de cada clave y de `visibilitychange` en `tests/`.
- **Pendiente: decisión** (regla 1: contrato del bus). *A)* una sola forma para todos (`{ timestamp }`, o sin `datos`); *B)* dejarlo. Aparte, la respuesta de hijo5 sin latido: *a)* quitarla; *b)* dejarla.

##### K-71 — El círculo naranja lleva el radio de llegada escrito a mano — ✅ (leído; decisión abierta)

- **Dónde** (`4bea83e`). `actualizarMarcadorUsuario` (`js/funciones-mapa.js:3551`) crea fuera de CASA el círculo naranja con `_crearCirculoGeografico({ lat, lng }, 15, …)` (`:3598`, la única llamada a esa función). El radio con el que se declara la llegada es `RADIO_LLEGADA_PARADA_M` (`:65`, 15), que devuelve `radioLlegada()` (`:87`) y que `funciones-mapa.js` manda a hijo2 en `NAVEGACION.ACTUALIZAR_ESTADO` (`:3062`). El comentario de ese envío (`:3055-3056`) y el de hijo2 (`coordenadas-hijo2.html:456`) dicen que es el radio del círculo naranja, y la guía también (§4.5 y la fila de `funciones-mapa.js`).
- **Por qué es un segundo camino.** El valor coincide hoy (15 y 15), pero el círculo no lee la constante: cambiar `RADIO_LLEGADA_PARADA_M` dejaría al usuario viendo un círculo de 15 m que ya no sería la zona de llegada. La tabla de K-05 («Radio de llegada») cita los otros tres sitios del radio y no este.
- **Método.** Búsqueda de `_crearCirculoGeografico` (una llamada) y lectura de su contexto; búsqueda en este documento de `circuloActivacion`, `_crearCirculoGeografico` y «círculo naranja»: ninguna aparición.
- **Pendiente: decisión.** *A)* que el círculo tome su radio de `radioLlegada()`; *B)* dejarlo.
- **Aplicada (2026-10-13, `8f36e78`): A.** `actualizarMarcadorUsuario` dibuja el círculo con `_crearCirculoGeografico({ lat, lng }, radioLlegada(), …)`. El valor es el mismo (15 m): no cambia nada a la vista. Specs del mapa en chromium (13, 17, 21, 24, 25, 27, 47, 53 y 57), 54 de 54. Guía: G-75.

##### K-72 — La reanudación espera `distribuirDatosAventura` por una promesa sin plazo — ✅ (medido; decisión abierta)

- **Dónde** (`4bea83e`). `_distribuirDatosRest` (`codigo-padre.html:4864`), la distribución de la reanudación, a la que `ejecutarRestauracionAventura` llama (`:5079`) antes de mandar las paradas, activar el modo y restaurar el progreso, espera la función así: si existe `__distribuirReadyPromise`, la espera (`:4867`); si no, con un sondeo de 120 × 250 ms (`:4868`). Script 2 crea la promesa antes de su primer `await` (`:9244`; no tiene `import` estáticos, así que siempre llega ahí) y solo la resuelve después de publicar la función (`:9533`); entre las dos hay diez `await import(...)` fuera de `try` (`:9248-9256`, `:9371` y `:9372`) y el `throw` de `:9364`.
- **Lo que dice el código.** Si Script 2 se corta en ese tramo, la promesa no se resuelve nunca y `_distribuirDatosRest` la espera sin plazo, con el resto de la reanudación detrás y sin escribir nada. El sondeo, en cambio, acaba a los 30 s llamando a una función que no existe, y su `catch` (`:4882-4884`) escribe un `warn` y llama a `_avisarFalloCargaAppUnaVez`, que muestra un `alert` con `MSG_ERROR_CARGA_APP` (`:3949-3957`). La rama del sondeo solo se toma si Script 2 no ha llegado a crear la promesa (por ejemplo, un error de sintaxis que le impide arrancar).
- **Medido** (chromium, padre real con sus hijos, sonda en una copia: el padre se sirve con un `throw` en Script 2 y se reanuda una sesión guardada pulsando «Continuar»). Con el corte **después** de crear la promesa, la reanudación llega a esa espera a los 1,7 s de cargar la página y, 35 s después, no ha salido ningún diálogo, la pantalla de carga sigue visible y la restauración no ha escrito ni una línea más. Con el corte **antes** (el control), sale el `alert` de `MSG_ERROR_CARGA_APP` a los 31 s del clic y la reanudación sigue: reparte las paradas, termina y quita la pantalla de carga. El control demuestra que la sonda ve el aviso cuando sale.
- **La guía** (§11, tabla del aviso de último recurso) dice que ese aviso cubre `_distribuirDatosRest()` cuando `distribuirDatosAventura` «no está disponible tras 10-30s de espera (fallo de módulos de Script 2)». Corregida en `db51b2d` (G-50): la fila separa los dos casos.
- **Corrección a K-54.** K-54 da las dos esperas de `distribuirDatosAventura` (hoy `:3967` y `:4864-4868`) por «espera acotada (40 y 120 iteraciones): sin hallazgo»; la segunda tiene la rama de la promesa, sin plazo.
- **Relacionado.** K-62 (las otras formas de esperar), K-53 (los imports en posición fatal, que son los que cortan Script 2) y K-54.
- **Pendiente: decisión.** *A)* una sola forma de esperar la función, con plazo y con el aviso: el sondeo, o la promesa con un plazo; *B)* dejarlo.

#### Familia U — Lo que encontró el recorrido real con espía del 2026-10-07 (R2.13)

##### K-73 — El aviso de llegada de hijo2, siempre el segundo, vuelve a crear la ficha de un tramo ya cerrado — ✅ (medido; corrige a K-06)

- **Medido** (recorrido EJE 28, R2.13: pasadas `corto`, `variantes` y `aventura-terminar`, treinta tramos cerrados). En veintiocho, siempre el mismo orden; los otros dos lo confirman: TR-2 de `aventura-terminar` se cerró con un rescate, sin ninguna llegada, y en TR-18 el aviso de hijo2 llegó después de pulsar avanzar y el padre lo descartó como de un elemento anterior (K-74). El sensor de `js/funciones-mapa.js` se despacha `NAVEGACION.LLEGADA_DETECTADA` en el propio padre; el padre cierra el tramo y manda a hijo2 `CONTROL.HABILITAR` (`btnAvanzar`, `razon: 'tramo_completado'`) entre 5 y 36 ms después; la `LLEGADA_DETECTADA` de hijo2 llega entre 2 y 35 ms más tarde; y el padre, entre 7 y 75 ms después del cierre, manda `SISTEMA.NOTIFICACION` (`PENDING_INICIADO`) a hijo2 y a hijo4 para ese mismo tramo (y, como con toda ficha nueva, le pide a hijo2 sus coordenadas: `populatePendingCoords`, `codigo-padre.html:9620-9622`). Desde ahí, y hasta que el usuario pulsa avanzar, el padre tiene otra vez la ficha del tramo, con `llegada: true` y `audio: false`.
- **Por qué** (leído). Al cerrar el elemento, `intentarCompletarElemento` borra su ficha (`codigo-padre.html:9724` y `:9728`; `_notificarParadaCompletada`, `:9814-9822`, no borra nada: K-81). El handler de `LLEGADA_DETECTADA` solo comprueba el modo y que el id sea el del elemento actual (`:11828-11842`), y el tramo sigue siendo el actual hasta pulsar avanzar; `_marcarPendingPorLlegada` llama a `ensurePending`, que crea la ficha si no existe (`:9615`) y se lo dice a hijo2 y a hijo4 (`:9627-9629`).
- **En las paradas no pasa**: una parada se cierra con el audio y los retos, después de las dos llegadas (medido en P-0, P-1, P-2 y P-3).
- **Efecto hoy: ninguno a la vista** (leído en cada consumidor). hijo2 no entra en la rama que apaga `btn-ubicacion` (`coordenadas-hijo2.html:2287-2290`), porque el `padreId` del aviso no casa nunca con su id (K-80), y el botón ya estaba apagado por `btnAvanzarCompletadoPorPadre` (`:713-723`); hijo4 solo lo anota (`retos-hijo4.html:1635-1660`); el barrido del recordatorio de rescate se salta una ficha con `llegada` (`codigo-padre.html:14046`); `_estadoRescate` contesta «ya-llegado» (`:13604`); la ficha se borra al pulsar avanzar (`:9762-9767`); y `persistProgressState` no guarda las fichas (`:4273-4290`).
- **Lo que no se sostiene de K-06.** «Ambos solo marcan `pending.llegada`, idempotente»: el segundo crea estado nuevo sobre un elemento ya cerrado, y no hace daño porque ninguno de los consumidores de hoy mira esa ficha de otra forma. Tampoco son independientes: hijo2 decide sobre la distancia y el id que le manda `funciones-mapa.js` en `NAVEGACION.ACTUALIZAR_ESTADO` (`coordenadas-hijo2.html:1366-1402`), y llega siempre después (K-74; la guía, G-51).
- **Pendiente: decisión.** *A)* que una llegada de un elemento ya completado no cree ficha; *B)* un solo sensor (con K-06); *C)* dejarlo, documentado.
- **Aplicada (2026-10-13, `479b06a`): A, en el sitio que crea las fichas.** Con K-85 (la activación no le crea ficha a un elemento ya completado) y K-89 (`_anotarEnFicha` es el único que escribe en ella, y la guarda), lo que esta entrada midió en los tramos resultó ser un caso de cuatro: mientras un elemento completado espera la pulsación de «avanzar», le volvían a crear la ficha la llegada del segundo sensor, el audio escuchado otra vez, el reto resuelto otra vez y el botón de saltar. Medido en el spec 123 (EC-6 a EC-9, cada aviso con acuse para saber que el handler del padre ha terminado): las cuatro en rojo, con su ficha recreada, y EC-5 de control en verde. Desde K-89 esa ficha se guardaba además en `vv_progreso`, así que el «efecto hoy: ninguno» de arriba ya no se sostenía por `persistProgressState`. El cambio: `ensurePending`, el único sitio que crea fichas, no se la crea a un elemento ya completado en AVENTURA y devuelve `null`; `_saltarAudioPulsado` y `_marcarAudioNoDisponible`, que leen la ficha que les devuelve, salen sin hacer nada en ese caso. En CASA no cambia nada. Con el cambio, 160 de 160 en chromium (specs 13, 15, 21, 22, 26, 30, 34, 39, 43, 44, 50, 57, 68, 70, 71, 72, 73, 91, 101, 122, 123 y 124). Guía: G-73.

##### K-74 — Tras cada cambio de elemento, el mapa sigue midiendo el anterior hasta un segundo: hijo2 adopta ese elemento, el cartel de inicio vuelve a salir y el botón de vídeo se apaga — ✅ (medido)

- **Medido** (pasadas `corto`, `variantes` y `aventura-terminar`: 76 avances con el botón de avanzar). Tras el `NAVEGACION.CAMBIO_PARADA` que el padre se despacha al avanzar, el siguiente `NAVEGACION.ACTUALIZAR_ESTADO` que `funciones-mapa.js` manda a hijo2 lleva todavía el `idParada` y el `tipoParada` del elemento anterior (en `corto` y `variantes`, de 100 a 983 ms después del cambio), y hijo2 contesta con una `LLEGADA_DETECTADA` de ese elemento. El padre la descarta con un aviso («Llegada detectada para Av1-P-0 pero elemento actual es Av1-TR-1»). En 73 de los 76; en los otros tres no hubo llegada rancia: al salir de TR-2 tras el rescate (el usuario no había llegado al final del tramo), al pasar de P-16 a TR-8, y en el último avance de `corto`, con el que acaba la pasada.
- **Lo que ve el usuario.** *a)* Al avanzar desde el punto de inicio, el cartel «Ha llegado a la parada Torres de Serranos (start)…» vuelve a salir, ya con TR-1 activo: en `variantes` a los 501 ms del cambio (en el mismo milisegundo que la llegada rancia de P-0) y en `aventura-terminar` a los 250 ms; dos de dos (las pasadas `corto` se hicieron con un espía que no veía un segundo cartel del mismo id). *b)* Al entrar en un tramo, `btn-video` de hijo2 está apagado hasta la siguiente lectura buena: a los 220 ms del cambio a TR-2 seguía apagado (la lectura rancia de P-1, tipo `parada`, llegó a los 81 ms) y se encendió con la de TR-2, a los 1005 ms.
- **Por qué** (leído). El padre cambia `estado.paradaActual` al principio de su handler de `CAMBIO_PARADA` (`codigo-padre.html:11587`) y avisa al mapa con `vv-parada-cambiada` al final (`:11716`), después de esperar la respuesta de hijo2. `funciones-mapa.js` mide contra su propia copia, `estadoMapa.paradaActual` (`js/funciones-mapa.js:2913`), y la cambia en `completarCambioParada` (`:2331`) después de las esperas del mapa; antes de ellas ya ha vuelto a permitir el cartel de inicio (`_cartelLlegadaInicioMostrado = false`, `:2111`). Una lectura GPS en ese hueco, estando aún dentro de los 15 m del punto de inicio, cumple la condición del cartel (`:3100`). hijo2 toma como elemento actual el `idParada` y el `tipoParada` de cada `ACTUALIZAR_ESTADO` (`coordenadas-hijo2.html:1247-1248`) —el mismo campo lo escriben también `:1646`, `:1948` (al contestar una petición de coordenadas), `:2057` y `:2228`—, y su `CAMBIO_PARADA` borra la llegada notificada (`:2231`) pero no la ventana de confirmación (`_llegadaCandidataId`, `_llegadaVentana`, `:1280-1288`): la lectura rancia encuentra la ventana del elemento anterior llena de aciertos y confirma al instante. `_actualizarBotonVideo` apaga el vídeo cuando el tipo no es tramo (`:563-576`).
- **Relacionado.** K-14 (`vv-parada-cambiada` como segundo bus, y el orden que impone), K-73, K-77 (el texto de ese cartel).
- **Pendiente: decisión.** *A)* un solo dueño del elemento actual para el mapa y para hijo2 (que el mapa no mida contra un elemento que el padre ya dejó, o que el `idParada` de `ACTUALIZAR_ESTADO` no pise el de `CAMBIO_PARADA`); *B)* dejarlo, documentado.

##### K-75 — La ficha que se crea en CASA llega a AVENTURA con su reloj — ✅ (medido en parte; leído)

- **Medido** (pasadas `corto` ×2 y `variantes`). El paso CASA visita tres elementos con la lista de hijo5 (ver §24) y el padre crea su ficha (`PENDING_INICIADO`). Al activarse esos mismos tres en AVENTURA, el padre no manda `PENDING_INICIADO`: la ficha ya existía. A los demás les crea una nueva.
- **Por qué** (leído). La ficha nace al activarse el elemento (`codigo-padre.html:11589-11596`, cuyo comentario dice que «este es el sitio donde el reloj tiene que arrancar»), pero `ensurePending` no toca una ficha que ya existe (`:9615`), y ninguna se borra al cambiar de modo: los `delete` de `pendingCompleciones` que corren son al completar (`:9724`, `:9728`) y al avanzar (`:9765`); el cuarto (`:9818`) no corre nunca (K-81).
- **Consecuencia** (leída, no medida). El recordatorio de rescate cuenta desde `ficha.timestamp` (`:14043-14050`): un tramo visitado en CASA que se alcanza en AVENTURA más de 8 minutos después saca el recordatorio en el primer barrido, si ese barrido llega antes que el fin de su audio (que pone el reloj a cero). En `variantes` TR-2 se alcanzó a los cinco minutos y no salió. Solo con la herramienta de desarrollo (ver §24).
- **Comentarios que no se sostienen.** `codigo-padre.html:12157` y la cabecera del spec 68 (`:21-23`) dicen que el barrido «recorre TODAS las fichas»; el de hoy mira solo la del elemento actual (`:14020`, `:14036-14043`). `:11826` dice que `pending.llegada` «persiste en localStorage»; `persistProgressState` no guarda las fichas (`:4273-4290`), como dice `:13846-13848`. `:4280-4284` habla de «saltos de seguridad del TTL de tramos» y de «5 por aventura»: el tope es el del rescate a petición, 12 en la Aventura1 (`:13559-13562`).
- **Pendiente: decisión.** *A)* que el cambio de modo, o la activación en AVENTURA, empiece el reloj de la ficha; *B)* dejarlo (solo desarrollo), corrigiendo los comentarios.
- **Los comentarios, corregidos (2026-10-13, `583b3aa`); la decisión sigue abierta.** Los dos del barrido «que recorre todas las fichas» (el del handler de fin de audio y la cabecera del spec 68) y el de los «saltos de seguridad del TTL, 5 por aventura» (son los rescates a petición: tope 12, y 35 en la de 34 km, `LIMITES_RESCATE`). El de `pending.llegada` que «persiste en localStorage» se deja: desde K-89 la ficha del elemento actual se guarda en `vv_progreso`.

##### K-76 — `estado.retoActualId` de hijo4 significa dos cosas, y la limpieza del cambio de modo lee la que no es — ✅ (medido el aviso; leído)

- **Aplicada (2026-10-14, `6f1eaf5`).** Con los principios que el usuario repite (un solo camino, sin código muerto) no hacía falta decidir entre A y B: el reto de la parada que escribía `CAMBIO_PARADA` no lo leía nadie con ese significado, así que no merece un campo propio. Fuera la escritura (y su comentario «placeholder») y dos asignaciones a `null` que ya lo eran. Spec 133: UR-2 fallaba con el código anterior.

- **Medido** (pasadas `corto` ×2 y `variantes`). Al cambiar de modo con una parada con reto como elemento actual y sin ningún reto abierto, hijo4 escribe «CAMBIO_MODO recibido con reto activo (R3-Av1-es) — omitiendo limpieza» (cinco veces en las tres pasadas).
- **Leído.** El `CAMBIO_PARADA` de hijo4 fija `estado.retoActualId` al reto de la parada (`retos-hijo4.html:1614`, con el comentario «No-op: placeholder for actual reto prefetch logic»); `RETO.MOSTRAR` y `mostrarReto` lo fijan al reto que se abre (`:1378`, `:777`); `RETO.LIMPIAR_ESTADO` lo borra (`:1511`). La guarda del cambio de modo (`:1444-1445`) lo lee como «hay un reto abierto»: en una parada con reto no limpia nunca, haya reto abierto o no. Su rama de limpieza vuelve a poner a `null` dos variables que en esa rama ya son `null` (`:1447-1448`) y vacía el reto de la pantalla.
- **Efecto hoy.** Un aviso que dice algo que no pasa. El DOM del reto ya lo vacía `RETO.LIMPIAR_ESTADO` al cerrar cada reto, así que en el recorrido normal no queda nada que limpiar.
- **Pendiente: decisión.** *A)* dos campos (el reto de la parada y el reto abierto); *B)* dejarlo, documentado.

##### K-77 — El cartel de llegada al punto de inicio pide pulsar «avanzar», que está apagado — ✅ (medido; leído)

- **Medido** (las tres pasadas). Al llegar al punto de inicio sale «Ha llegado a la parada Torres de Serranos (start). Por favor, pulse el botón avanzar y pulse play para escuchar el audio relacionado con su aventura.», con los iconos de avanzar y de audio; `btn-avanzar` está apagado desde la activación del elemento (`CONTROL.DESHABILITAR`, `razon: 'parada_pendiente_completar'`) y se enciende al completarlo. Y sale otra vez después de pulsarlo (K-74).
- **Leído.** El único llamador de `mostrarCartelLlegadaParada` es la llegada al elemento de tipo `inicio` (`js/funciones-mapa.js:3100-3103`). El comentario del padre (`codigo-padre.html:9957-9960`) y la guía (L1374) dicen que es «el único sitio donde "ha llegado" es literal, porque no hay ningún elemento anterior que cerrar ni botón que pulsar»; el texto (`TRADUCCIONES_LLEGADA_PARADA`, `js/traducciones-ui.js:448`, doce idiomas) y los iconos (`codigo-padre.html:8586-8587`) son los del cartel que se usaba antes al terminar un tramo. La guía (L1376) cita el texto con el nombre de una parada que no es un punto de inicio (Plaza de la Crida).
- **Pendiente: decisión de texto** (doce idiomas): qué debe pedir el cartel del punto de inicio.

##### K-78 — Tras un rescate pedido sale también el cartel de transición: la marca que lo evita no casa nunca — ✅ (medido; leído; comprobado en los datos)

- **Medido** (pasada `aventura-terminar`, TR-2 de la Aventura1). Con la pantalla «rescate concedido» a la vista, el padre saca además `cartel-transicion` («Ha terminado el tramo … — va a empezar la parada …»).
- **Por qué** (leído). `_concederRescate` deja la marca `estado._rescatePeticionPendiente` con la clave del `padreid` sin el prefijo (`codigo-padre.html:13928`: `padre-TR2` → `TR2`); `marcarParadaCompletada` la compara con su `idLimpio`, que sale del `tramo_id` o del `parada_id` (`:9838`, `:9976-9977`: `Av1-TR-2`). No casan, así que el cartel sale y la marca se queda puesta hasta el siguiente rescate. El cobro del rescate sí casa: compara dos claves con el mismo formato (`:13858-13861` con `:13927`).
- **En los datos** (las siete aventuras, en sus doce idiomas: 7008 paradas y tramos): la clave de la marca no coincide con la de la compleción en ninguno.
- **La guía** (L10634) dice que la marca evita el cartel (G-54). Ningún spec lo comprueba: los de rescate (70 a 73) no miran el cartel, y ninguno nombra la marca.
- **Relacionado.** El comentario de `:14015-14017` cuenta un fallo del mismo tipo (una clave con prefijo comparada con el id limpio) en la pieza que esta marca sustituyó.
- **Pendiente: decisión.** *A)* que la marca y la compleción usen la misma clave; *B)* dejarlo (el usuario ve dos avisos de lo mismo), corrigiendo la guía.
- **Preparada, sin aplicar (2026-10-13): A.** No se aplica sin la decisión porque cambia lo que ve el usuario (un cartel menos). El cambio son dos líneas de `codigo-padre.html`: `_concederRescate` deja la marca con la clave de la ficha (`estado._rescatePeticionPendiente = { clave }`, el `padreid`, como `_rescateGastoPendiente`), y `marcarParadaCompletada` la compara con la del elemento completado (`elementoCompletado?.padreid`, o `padre-` más `idLimpio` si no lo tiene). El test, RS-3 en el spec 123: el rescate por su camino real, un observador que apunta cada `cartel-*` que entra en el documento, y al llegar la pantalla de «rescate utilizado» no ha entrado ni `cartel-transicion` ni `cartel-inicio-tramo`, y la marca está gastada. Medido en chromium: con el código de `583b3aa`, RS-3 en rojo (entra `cartel-inicio-tramo`) y RS-1 y RS-2 en verde; con el parche puesto, 44 de 44 con los specs 22, 70, 71, 72 y 73; después se retiró el parche y el test. La guía tendría que cambiar el paso 8 de §25.19, que hoy describe el cartel de más.

##### K-79 — Al cerrar el último elemento, el cartel pide pulsar play para un audio que no existe — ✅ (medido; leído)

- **Medido** (pasada `aventura-terminar`). Al completar P-40, el último elemento de la Aventura1, sale `cartel-transicion` con «Ha terminado la parada Torres de Serranos Final» y, debajo, «Por favor, pulse el botón avanzar y pulse play para escuchar el audio relacionado con su aventura.», con los iconos de avanzar y de audio. Al pulsar avanzar sale el modal de fin de aventura; no hay más audio.
- **Leído.** Cuando no hay elemento siguiente, `marcarParadaCompletada` llama a `mostrarCartelTransicion` sin segundo elemento (`codigo-padre.html:9985-9990`), y la función quita la mitad «va a empezar…» pero añade siempre la misma instrucción y los dos iconos (`:8405-8442`; `TRADUCCIONES_CARTEL_TRANSICION.instrucciones`, `js/traducciones-ui.js:419`, doce idiomas). Su comentario (`:8384-8386`) contempla el caso del último elemento solo para el nombre.
- **Pendiente: decisión de texto** (doce idiomas): qué dice el cartel del último elemento, o si sale.

##### K-80 — hijo2 no reconoce nunca el `PENDING_INICIADO` de su elemento: compara la clave de la ficha con su id de coordenadas — ✅ (medido; leído; comprobado en los datos)

- **Medido** (pasadas `corto`, `variantes` y `aventura-terminar`: 110 `SISTEMA.NOTIFICACION` con `PENDING_INICIADO` recibidos por hijo2, con handler). En ninguno coincide el `padreId` del aviso con el id que hijo2 tiene en ese momento, reconstruido con los cuatro mensajes que lo escriben; sin residuo (ningún aviso sin `padreId` y ninguno con hijo2 sin id). Ejemplo: aviso `padre-TR2`, hijo2 tiene `Av1-TR-2`.
- **Por qué** (leído). `ensurePending` manda como `padreId` la clave de la ficha, que es el `padreid` (`codigo-padre.html:9627`: `padre-TR2`). hijo2 la compara con su `idParadaActual`, o con ese id con `padre-` delante (`coordenadas-hijo2.html:2279-2281`), y `idParadaActual` es siempre un id de coordenadas (`Av1-TR-2`): lo escriben `ACTUALIZAR_ESTADO` (`:1247`), la petición de coordenadas (`:1948`), `RESPUESTA_DATOS_PARADAS` (`:2057`) y `CAMBIO_PARADA`, con su `parada_id` (`:2228`). hijo4 sí casa, porque guarda el `padreId` de su `CAMBIO_PARADA` (`retos-hijo4.html:1615` y `:1639`), y solo lo anota.
- **En los datos** (las siete aventuras en sus doce idiomas, 84 combinaciones; sin residuo: todos los elementos llevan `padreid` y `parada_id` o `tramo_id`). De los 7092 elementos de tipo `inicio`, `parada` y `tramo`, ninguno tiene un `padreid` igual a su id de coordenadas ni a ese id con `padre-` delante. Los únicos que casan son los 84 de tipo `intro` (`padre-intro` e `intro`), que en las tres pasadas no reciben ficha.
- **Efecto hoy.** La rama de hijo2 (`coordenadas-hijo2.html:2287-2290`) no corre: no apaga `btn-ubicacion` al crearse la ficha, y su otra línea llama a `actualizarEstado()`, que está vacía (`:519-521`). El comentario del padre dice que «solo hijo2 y hijo4 actúan sobre `PENDING_INICIADO`» (`codigo-padre.html:9624-9626`): hijo2 no llega a actuar y hijo4 solo escribe en el log. La guía (L5876 y L11490) da el apagado por hecho (G-55). Ningún spec lo comprueba: el 50 manda el aviso a hijo4 (`tests/e2e/50-pending-iniciado-no-borra-reto.spec.js:77`) y el 101 (NO-3) mira que hijo2 lo recibe, no lo que hace con él.
- **Ya anotado fuera de este documento.** Las notas del proyecto recogían una medición anterior con el mismo resultado (0 de 65); no tenía entrada aquí.
- **Relacionado.** K-78 y K-81 (la misma forma: una clave con el formato del `padreid` comparada con un id de coordenadas) y K-73 (el aviso que se repite al recrearse la ficha).
- **Pendiente: decisión.** *A)* retirar la rama de hijo2 y decidir si el aviso a hijo2 conserva destinatario; *B)* que el aviso lleve el id que hijo2 conoce, con lo que el apagado de `btn-ubicacion` correría por primera vez en cada activación (cambia lo que ocurre: medir antes); *C)* dejarlo, corrigiendo la guía y el comentario.

##### K-81 — `_notificarParadaCompletada` no borra nunca la ficha: la busca con `padre-` delante del id de coordenadas — ✅ (leído; comprobado en los datos y en las trazas)

- **Leído.** `marcarParadaCompletada` tiene dos llamadores (`codigo-padre.html:9723` y `:9727`; búsqueda desnuda del nombre en `codigo-padre.html` y en `js/`), y los dos le pasan el `parada_id` o el `tramo_id`. De ahí sale `idLimpio` (`:9838`: `Av1-TR-2`), y `_notificarParadaCompletada` busca la ficha `padre-` más `idLimpio` (`:9816`: `padre-Av1-TR-2`). Las fichas se guardan por `padreid` (`padre-TR2`).
- **En los datos:** ninguno de los 7092 elementos de tipo `inicio`, `parada` y `tramo` tiene un `padreid` igual a `padre-` más su id de coordenadas (la misma cuenta de K-80). **En las trazas:** las 110 claves de ficha vistas tienen la forma `padre-P…` o `padre-TR…`.
- **Efecto hoy: ninguno.** La ficha la borra `intentarCompletarElemento` justo después, con la clave buena (`:9724` y `:9728`), y el avance (`:9765`). La función entera (`:9814-9822`) no hace nada.
- **Relacionado.** K-78 y K-80.
- **Pendiente: decisión.** *A)* retirar `_notificarParadaCompletada` y su llamada (`:9903`); *B)* dejarlo.
- **Aplicada (2026-10-13, `53bcac4`): A**, con el encargo del usuario de quitar el código muerto. Era el único `await` de `marcarParadaCompletada`: lo que sigue (listo para avanzar, `CONTROL.HABILITAR` de «avanzar», cartel) corre ahora en la misma vuelta que la llamada. Specs de compleción y de rescate en chromium (13, 15, 21, 22, 26, 39, 57, 68, 70, 71, 72, 73, 91, 122, 123 y 124), 108 de 108.

##### K-82 — Volver dentro del radio de la parada apaga el botón de retos aunque el audio ya esté resuelto; sin audio grabado, la parada queda bloqueada — ✅ (medido en tres pasadas; leído)

- **Medido, sonda en inglés** (2026-10-12; idioma sin audio grabado; P-1 de la Aventura1, sin ningún hijo caído). El usuario salta el audio y el padre enciende el botón de retos de hijo3 (`CONTROL.HABILITAR`, `retosBtn`, `razon: 'audio_finalizado'`). Diez segundos después empieza a alejarse: la primera lectura a más de 15 m (18 m) manda `GPS.RESTRINGIDO`, la siguiente vuelve a caer dentro, hijo2 manda `GPS.DENTRO_DE_RANGO` y el padre contesta a hijo3 con `CONTROL.DESHABILITAR` (`retosBtn`, `razon: 'esperar_fin_audio_aventura'`), un segundo después de la primera salida. Al volver de los 25 m, lo mismo otra vez. Desde ahí el botón de retos está apagado: lo sigue estando tras pulsar otra vez «saltar», 20 s después y en las dos esperas de 30 s del instrumento. La ficha del elemento dice `llegada: true`, `audio: true`, `reto: false`, y el padre saca «Recuerde pulsar el botón de retos…» cada 22 s (seis veces en 110 s). La pasada se paró ahí: la parada no se puede completar.
- **Medido, sonda en español** (misma parada, con audio). El botón se apaga igual. Vuelve a encenderse solo después de escuchar otra vez el audio entero («volver a escuchar» y esperar a su fin).
- **Medido, con hijo3 caído** (pasada `aventura` con caídas, P-7). El mismo apagado llega por otro llamador: al recargarse hijo3 y, 16 s después, al entrar en el radio de la parada (ver «K-07, revisión: medido», en R2.13).
- **Por qué** (leído). `_configurarRetoBtn` (`codigo-padre.html:11352-11373`), en AVENTURA y con reto y audio, pone siempre `estado.retoActual` a «no disponible» (con la cola y sus completados de cero) y manda el `DESHABILITAR`; no mira si el audio del elemento ya está resuelto (`pending.audio`). Tiene tres llamadores: la activación del elemento (`:11650`), donde el audio aún no puede estar resuelto; el `HIJO_LISTO` de hijo3 (`:7274`); y `GPS.DENTRO_DE_RANGO` (`:10878`), cuyo comentario dice que «reto sigue dependiendo de si el audio ya terminó, igual que siempre» (`:10862-10864`). hijo2 manda `DENTRO_DE_RANGO` cada vez que una lectura cae dentro del rango después de una fuera, sin gracia (`coordenadas-hijo2.html:752-767`). Lo único que vuelve a encender el botón es `_procesarFinAudioElemento` (`codigo-padre.html:12043-12068`), y a él solo se llega con un fin de audio real: `_saltarAudioPulsado` sale antes si la ficha ya tiene `audio` (`:12100`) y `_marcarAudioNoDisponible` solo lo llama si no lo tiene (`:12223`).
- **Lo que ve el usuario.** En español, el botón de retos se apaga solo y hay que oír el audio entero otra vez. En los once idiomas sin audio grabado no hay salida desde la pantalla: «saltar» no hace nada, «avanzar» sigue apagado, el rescate no se ofrece con la llegada ya confirmada (`:13604`) y el padre insiste en que se pulse un botón apagado. Con el GPS real, que cruza el radio de 15 m con su propio ruido, basta estar cerca del borde.
- **No medido.** Si recargar la página lo desbloquea (la ficha no se guarda, así que la reanudación crearía una nueva con `audio: false`). Qué pasa si el `DENTRO_DE_RANGO` llega con un reto abierto o entre dos retos de la misma parada (`estado.retoActual.colaCompletados` vuelve a empezar).
- **Relacionado.** K-07 (la ventana del hijo caído, que llega a lo mismo por el `HIJO_LISTO` de hijo3), K-06 (el radio de 15 m y su ruido).
- **Pendiente: decisión.** *A)* que `_configurarRetoBtn` respete un audio ya resuelto cuando no es la activación del elemento (mirando la ficha), sin reiniciar `estado.retoActual`; *B)* que volver dentro de rango y la recuperación de hijo3 no pasen por `_configurarRetoBtn`; *C)* dejarlo.
- **Aplicada (2026-10-13, `5318ef7`).** Decisión del usuario: «audio saltado o audio escuchado es audio terminado», y que se miren todas las variables por un solo camino. Es la opción A sin su excepción («cuando no es la activación»): la recuperación de hijo2 reactiva el elemento actual entero (`_vv_afterHijoListo`, `codigo-padre.html:9327`) y entraba justo por la activación. `_configurarRetoBtn` desaparece. Un solo sitio decide el botón de retos de hijo3: `_decidirRetoBtn(elemento)` mira si el elemento tiene reto, si hay un reto abierto (hijo4 con la clase `visible`), el modo, si el usuario está fuera de rango con la gracia agotada, si el elemento tiene audio y si ese audio ha terminado (`_audioTerminadoEn`, que lee la ficha sin crearla y da por terminado el de un elemento ya completado); `_sincronizarRetoBtn()` manda el resultado, siempre con la misma forma (`{ control, razon, retoId }`). La llaman los siete sitios en que cambia una de esas variables (activación, fin de audio, abrir un reto, cerrarlo, salir de rango, volver y el `HIJO_LISTO` de hijo3); había nueve envíos repartidos en cinco funciones. `estado.retoActual` no se rehace con el elemento a medias (`_asegurarRetoActualDe`). Por ser la misma decisión: el recordatorio «pulse retos» pregunta a ese sitio y no sale con el botón apagado; la activación no arranca el recordatorio de un audio ya terminado; y se retiran las dos publicaciones en `globalThis` que solo usaba el llamador de Script 1 (`obtenerRetosIds` y `_buscarParadaEnDatos`). «hijo4 listo» deja de ser condición para encender el botón: quien lo pulsa con hijo4 recuperándose espera en `_hdl_RETO_SOLICITAR`. **Spec nuevo 122** (12 tests, con el padre, los hijos y el botón reales). **Rojo antes de verde** (chromium): con el código anterior, 9 rojos (BR-1, BR-2, BR-4, BR-6, BR-7, BR-8, BR-9, BR-R2 y BR-R3) y los 3 controles en verde; con el cambio, 12 de 12. `npm run lint`, limpio. El spec 34 se adapta (pone el estado en que el botón está encendido); los specs 22, 30, 34, 39, 43, 44, 50, 103 y 120 pasan en chromium (62 de 62). La tanda de los cuatro navegadores no se ha lanzado. Guía: G-65.
- **Lo que no cubre.** La recarga de la página: la ficha no se guarda (`persistProgressState`, `:4273-4289`), así que la reanudación crea una nueva con el audio sin terminar (leído, sin medir); guardarla toca K-51 y es una decisión aparte (ver también K-85). El botón de saltar sigue a la vista después de saltar, sin hacer nada. Con el elemento completado el botón de retos queda encendido, igual que antes del cambio, y repetir el reto vuelve a crear una ficha.

#### Familia V — Lo que salió al contrastar con el código las últimas frases de la guía (2026-10-12, R2.13)

##### K-83 — Dos funciones dan «las coordenadas del punto de inicio», cada una con su fuente y su último recurso — ✅ (leído)

- **Dónde.** `codigo-padre.html`. (a) `_obtenerCoordenadasP0Fallback()` (`:5244-5255`, Script 1, publicada en `globalThis`, `:5259`): busca la entrada `tipo === 'inicio'` en `globalThis.AVENTURA_PARADAS` y, si no la encuentra, devuelve una coordenada fija (`39.47876, -0.37626`). La llama `_aplicarFallbackCoordenadasGPS` (`:5338` y `:5345`), cuando la activación del GPS no consigue una posición inicial y hijo2 no contesta con las coordenadas del inicio. (b) `_obtenerCoordenadasFallbackP0(logPrefix)` (`:10995-11006`, Script 2): busca la misma entrada en `globalThis.__vv_DATOS_AVENTURAS[aventura]['coordenadas-hijo2.html'].coordenadas` y, si no la encuentra, devuelve `null`. La llama `_hdl_NAVEGACION_MOSTRAR_UBICACION_POLYLINE` (`:11029`), que sin destino contesta con error. Los dos comentarios de cabecera se avisan el uno al otro («No confundir con…», `:5241` y `:10991`).
- **Lo que no cuadra.** Es la misma pregunta con dos respuestas. Las dos fuentes son el mismo array: `AVENTURA_PARADAS` se asigna desde esa misma ruta de `__vv_DATOS_AVENTURAS` (`codigo-padre.html:9443-9447` y `js/funciones-mapa.js:1877-1880`), así que solo cambian el momento en que ese nombre está puesto y el último recurso: (a) da una posición fija; (b) dice que no hay. Al lado, `_idParadaInicioAventura()` (`codigo-padre.html:5263-5266`) y `_idParadaInicio()` de hijo2 (`coordenadas-hijo2.html:747`) resuelven el id de esa misma entrada, cada una en su frame.
- **Método.** Búsqueda desnuda de los dos nombres en el repositorio: las dos definiciones, los tres llamadores citados, la publicación en `globalThis`, `eslint.config.js:178`, la guía y un comentario del spec 20. Leídas enteras las dos funciones y sus llamadores. Sin ejecutar.
- **Lo que ve el usuario.** Nada distinto mientras los datos estén cargados. Sin ellos, (a) coloca al usuario en la coordenada fija con `accuracy: 1000` (`:5339`) y (b) deja sin dibujar la línea de «ir a ubicación».
- **Relacionado.** K-38 (donde ya aparece `AVENTURA_PARADAS`).
- **Pendiente: decisión.** *A)* una sola función con una sola fuente, y decidir qué devuelve cuando no hay entrada de inicio (la coordenada fija o nada); *B)* dejar las dos.

##### K-84 — El cartel del bloqueo de 5 km se pide una sola vez y cualquier otra pantalla de distancia lo tapa; su botón de reintento no se oculta en el primer bloqueo — ✅ (medido: M-25)

- **Dónde.** `codigo-padre.html`, `_check5kmFromRoute` (`:5597-5676`) y la familia de pantallas de distancia (`:5896-6106`).
- **Leído.** (1) *Se pide una vez.* `showGpsOutOfRangeOverlay` tiene un solo llamador (`:5655`), dentro de `if (!wasBlocked)`: se llama al declarar el bloqueo y no otra vez mientras dura. (2) *Las otras pantallas lo ocultan.* Cada una de las seis funciones que muestran una pantalla de esta familia quita `show` a las otras cinco (`_ocultarOtrasPantallasDistanciaGPS`, `:6092-6100`; sus seis llamadas, en `:6011`, `:6193`, `:6266`, `:6341`, `:6421` y `:6497`). Quien está a más de 5 km de toda la ruta está también a más de 2.000 m de su elemento, y hijo2 manda `GPS.RESTRINGIDO` en cada lectura fuera de rango (`coordenadas-hijo2.html:854-862`), a lo que el padre contesta con `showFotoPerdidoOverlay` (`codigo-padre.html:10840-10841`). (3) *El botón de reintento.* Al declarar el bloqueo se busca `#gps-error-action` para ocultarlo (`:5653-5654`) antes de llamar a `showGpsOutOfRangeOverlay` (`:5655`), que es quien crea el cartel la primera vez (`_ensureGpsOverlay`, `:6002`; su otro llamador, `showNextEntityOverlay`, `:7009`, solo corre desde ese mismo botón). En el primer bloqueo de la sesión el botón no existe todavía y queda a la vista; pulsarlo cierra el cartel cuando llega la lectura (`:5944`). (4) *El tiempo de espera tras cerrar.* `_SNOOZE_DURACION_MS` (`:6067-6074`) da 150 s a este cartel y 90 s al de precisión, pero ninguno de los dos se vuelve a pedir: este, por (1); el de precisión, porque hijo2 manda `GPS.PRECISION_INSUFICIENTE` una vez por episodio (`coordenadas-hijo2.html:1345-1346`). Cerrados con ✗, no reaparecen.
- **Lo que se deduce, sin medir.** Con el GPS dando una lectura por segundo, el cartel del bloqueo duraría en pantalla hasta la siguiente y quedaría la pantalla de «muy lejos de tu objetivo» (salvo que el usuario la tenga cerrada con ✗ en ese momento). El bloqueo de `btnAvanzar` no depende del cartel: se reafirma en cada comprobación (`:5657-5662`).
- **Medido (M-25, 2026-10-13).** Las tres cosas. (1) El cartel del bloqueo se muestra al declararse el bloqueo y no vuelve: ni con diez lecturas más, ni con otra comprobación con el bloqueo ya declarado. (2) La primera lectura real que llega después lo tapa con la pantalla de «muy lejos» (`foto-perdido-overlay`), que es la que queda a la vista mientras dura el bloqueo; sin lecturas nuevas, el cartel del bloqueo sigue a la vista (tres segundos medidos). (3) En el primer bloqueo de la sesión su botón de reintento (`#gps-error-action`) se crea a la vista, sin `display: none`. Lo deducido se sostiene.
- **Método.** Búsqueda desnuda de `showGpsOutOfRangeOverlay`, `_ensureGpsOverlay`, `gps-error-action`, `showNextEntityOverlay` y `showGpsPrecisionOverlay` en `*.html` y `*.js`, y lectura entera de las funciones citadas. El spec 56 mide la decisión de bloquear (lecturas seguidas, precisión, desbloqueo); no comprueba que el botón quede oculto al bloquear ni qué cartel queda a la vista. No se ha ejecutado: medirlo pide una pasada con el usuario a más de 5 km (con el OK del usuario en ese momento).
- **Textos del cartel que hablan de otra cosa.** El `alt` de la imagen es «Error GPS - baja precisión» (`:5911`) y el `aria-label` por defecto, «Ubicación descartada por baja precisión…» (`:6008`); la fila de distancia lleva un máximo de 2000 (`:5917`) y no se muestra, porque su único llamador no pasa distancia.
- **Censo (regla 3b), para K-83 y K-84.** Leídos el padre y hijo2. Los demás (selección, hijo1, hijo3, hijo4, hijo5, hijo6, mapa-completo, puzzle y video-intro) no se han abierto por esto: la búsqueda desnuda de esos nombres en `*.html` y `*.js` solo los da en `codigo-padre.html`, `eslint.config.js` y los specs 20, 30 y 56.
- **Relacionado.** K-49 (los dos caminos que cierran este mismo cartel al entrar en CASA).
- **Pendiente: decisión.** Antes, medirlo. *A)* que el cartel del bloqueo mande sobre las otras pantallas mientras dura el bloqueo y se vuelva a pedir en cada comprobación, con el botón de reintento oculto desde el primero; *B)* que el bloqueo no tenga cartel propio y lo diga la pantalla de «muy lejos»; *C)* dejarlo.

#### Familia W — El mismo error de K-82, mirado en los otros hijos (2026-10-13)

El error de K-82 tiene dos caras: un control que se enciende y se apaga desde varios sitios, cada uno mirando su parte; y un paso que vuelve a configurar (reactivar un elemento, recargarse un hijo) sin mirar lo que ya estaba hecho. Las cuatro primeras entradas salen de buscar esas dos caras en lo que el padre manda a los demás hijos; K-89 es lo que K-85 dejó a la vista, y K-90 y K-91 salieron al aplicarla. K-85 y K-87 están medidas (M-23 y M-24), y K-90 en el spec 124; K-86, K-88 y K-91, leídas.

##### K-85 — Reactivar un elemento ya completado deja «avanzar» apagado y sin salida — ✅ (medido: M-23)

- **Dónde.** `codigo-padre.html`. La activación de un elemento (`_hdl_NAVEGACION_CAMBIO_PARADA`) pone `estado.paradaListaParaAvanzar` a `false` (`:11567`) y, si es una parada en AVENTURA, manda a hijo2 `CONTROL.DESHABILITAR` (`btnAvanzar`, `parada_pendiente_completar`, `:11688`), que en hijo2 levanta `btnAvanzarDeshabilitadoExternamente` (`coordenadas-hijo2.html:1467`). No mira si ese elemento ya está en `estado.paradasCompletadas`.
- **Cuándo se reactiva el mismo elemento.** (a) Al recargar la página: la reanudación restaura `paradasCompletadas` (`:5054-5063`) y despacha el `CAMBIO_PARADA` del elemento guardado (`_restoreBroadcast`). (b) Al recuperarse hijo2: `_vv_afterHijoListo` despacha el `CAMBIO_PARADA` de la parada actual (`:9327-9335`).
- **Por qué no hay salida** (leído). Si el elemento ya estaba completado y el usuario no había pulsado «avanzar», la ficha nueva nace a cero. Al rehacer el audio y el reto, `intentarCompletarElemento` llama a `marcarParadaCompletada`, que sale en su primera comprobación por «parada ya marcada» (`:9844-9847`), antes de poner `paradaListaParaAvanzar` y de mandar el `HABILITAR` (`:9930-9932`). `_hdl_NAVEGACION_GPS_ACTIVAR` solo avanza con ese flag (`:10775`). El rescate pasa por el mismo `intentarCompletarElemento` (`:13953`). `paradaListaParaAvanzar = true` solo se escribe en `:9930`, `:10599` y `:12055`.
- **Medido (M-23, 2026-10-13).** Por las dos vías, la recarga de la página con reanudación real y la recuperación de hijo2 por el supervisor: tras reactivarse, la parada ya completada queda con `paradaListaParaAvanzar: false`, ficha nueva a cero y «avanzar» apagado; rehecha entera (llegada, audio y reto), la ficha se borra y «avanzar» sigue apagado, sin ningún mensaje de `btnAvanzar` hacia hijo2. `_estadoRescate()` no mira `paradasCompletadas` (`:13604`; solo la `llegada` de la ficha), así que ofrecería el rescate sobre ese elemento, y el rescate tampoco lo saca (leído: pasa por el mismo `intentarCompletarElemento`; esa parte no se midió).
- **Lo que ve el usuario.** Completa la parada, se le cierra la app antes de pulsar «avanzar» (el teléfono en el bolsillo), la reabre y continúa: la parada le pide otra vez el audio y el reto y, al terminarlos, «avanzar» sigue apagado. En un tramo, «avanzar» se enciende por distancia y pulsarlo no avanza.
- **Método.** Lectura entera de la cadena, y búsqueda desnuda en `*.html` y `*.js` de `paradaListaParaAvanzar` (las tres escrituras a `true` citadas, dos a `false` y la lectura) y de `paradasCompletadas` (`.has` solo en el guard, en el listado de paradas y en `_audioTerminadoEn`). Medido después: M-23.
- **Es el mismo error que K-82, en el otro botón:** la activación decide «avanzar» sin mirar lo que el elemento ya tiene hecho.
- **Relacionado.** K-82, K-07 (la recuperación de un hijo), K-51 (lo que se guarda), K-86, K-87.
- **Pendiente: decisión.** *A)* que la activación mire si el elemento ya está completado y lo deje listo para avanzar; *B)* guardar y restaurar la ficha del elemento actual, que cubre también el audio terminado tras una recarga (K-82, «lo que no cubre»); *C)* dejarlo.
- **Aplicada (2026-10-13, `f78d521`; el usuario vio antes el cambio exacto).** Spec 123 (`tests/e2e/123-elemento-completado-sigue-completado.spec.js`, 7 tests, con el padre y los hijos reales), en rojo en chromium con el código anterior: caen EC-1 (reactivar la parada completada manda `CONTROL.DESHABILITAR`, `parada_pendiente_completar`), EC-2 (recarga y reanudación real), EC-3 (recuperación de hijo2), EC-4 y RS-1 (K-87); pasan los dos controles (EC-5 y RS-2). EC-4 mide algo que solo estaba leído: sobre una parada completada, `_estadoRescate()` devuelve `puede: true`, así que el rescate se le ofrece. El cambio: `_elementoCompletado(elemento)` como única pregunta por «completado» (`estado.paradasCompletadas`); la activación, con el elemento ya completado en AVENTURA, no le crea ficha, pone `paradaListaParaAvanzar` y manda a hijo2 `CONTROL.HABILITAR` (`parada_completada` o `tramo_completado`); `_estadoRescate()` devuelve `puede: false`, `motivo: 'ya-completado'`. Con el cambio, el spec 123 pasa entero (7 de 7) y, con los specs 15, 22, 39, 40, 70, 71, 72, 73 y 122, son 58 de 58 en chromium; la tanda de los cuatro navegadores no se ha lanzado. Guía: G-67.

##### K-86 — «Avanzar» de hijo2 se enciende y se apaga desde seis sitios del padre, y un solo flag de hijo2 sirve a dos motivos — 🔎 (leído)

- **Dónde.** El padre manda `CONTROL.HABILITAR` o `CONTROL.DESHABILITAR` con `control: 'btnAvanzar'` desde seis sitios: el bloqueo de 5 km (`codigo-padre.html:5661` y `:5670`), `marcarParadaCompletada` (`:9932`), dos reservas «sin clave» (`:10601` y `:12057`) y la activación de una parada (`:11688`). En hijo2, cualquier `DESHABILITAR` de ese control levanta `btnAvanzarDeshabilitadoExternamente` (`coordenadas-hijo2.html:1467`) y cualquier `HABILITAR` lo baja (`:1426`).
- **Lo que no cuadra.** El flag no sabe por qué se levantó. Lo levantan dos motivos distintos —la parada pendiente de completar y el bloqueo de 5 km— y el fin de uno lo baja aunque el otro siga. Al volver a la zona con la parada a medias (`de_vuelta_en_zona`), «avanzar» pasa a decidirse por distancia y se enciende a menos de 15 m sin audio ni reto hechos (pulsarlo no avanza: falta `paradaListaParaAvanzar`). Y al completarse un elemento durante el bloqueo, el `HABILITAR` de la compleción lo baja hasta la siguiente comprobación, tres minutos como mucho.
- **En la guía.** §31.5 decía que ese flag es exclusivo del bloqueo de 5 km; corregido (G-65).
- **Método.** Búsqueda de `control: '` en `codigo-padre.html` y `js/*.js` (ocho envíos: seis de `btnAvanzar`, uno de `progressBar` y uno de `retosBtn`) y lectura de los dos handlers de hijo2. Sin ejecutar.
- **Relacionado.** K-85 (la activación), K-84 (el bloqueo de 5 km), K-82 (el mismo arreglo, en el botón de retos).
- **Pendiente: decisión.** *A)* un solo sitio del padre decide «avanzar» mirando todas sus variables (elemento completado, bloqueo de 5 km, reto abierto), como el del botón de retos; *B)* dos flags en hijo2, uno por motivo; *C)* dejarlo.

##### K-87 — El rescate en una parada con el reto disponible y sin resolver se queda a medias — ✅ (medido: M-24)

- **Dónde.** `_concederRescate` (`codigo-padre.html:13907`) completa la ficha y llama a `intentarCompletarElemento` (`:13953`), y este a `marcarParadaCompletada`, que anota el elemento en `paradasCompletadas` y lo guarda (`:9859-9872`) y después, si queda algún reto de la cola sin hacer y `estado.retoActual.disponible` es `true`, sale «esperando RETO.COMPLETADO» (`:9914-9920`) sin encender «avanzar». El rescate no apunta el reto en `colaCompletados`.
- **Cuándo.** Con el audio terminado (el reto queda disponible), el reto sin resolver y la llegada sin confirmar, que es cuando el rescate se ofrece.
- **Lo que ve el usuario** (medido: M-24). El rescate se concede y se le dice, pero «avanzar» no se enciende; y como el elemento ya consta como completado, tampoco se enciende después (K-85).
- **Método.** Lectura de las dos funciones. El spec 72 concede sobre un tramo, que no tiene retos. Medido después: M-24, con su control.
- **Relacionado.** K-85, K-78 (la marca del rescate).
- **Pendiente: decisión.** *A)* que el rescate deje también como hecho el estado del reto; *B)* que `marcarParadaCompletada` no espere al reto cuando la ficha ya lo trae hecho; *C)* dejarlo.
- **Aplicada (2026-10-13, `f78d521`).** Con K-85, en el spec 123 (RS-1, en rojo antes y en verde después; RS-2, de control, en verde las dos veces). El cambio es B: `marcarParadaCompletada` deja de preguntar por los retos a `estado.retoActual` (`:9914-9920`). Su única llamadora, `intentarCompletarElemento`, ya lo ha decidido con la ficha (`_paradaConditionsMet`), así que esa segunda pregunta solo podía discrepar de la primera, y solo lo hacía en el rescate. Al quitarla, `estado.retoActual.disponible` se queda sin ningún lector (búsqueda desnuda: esa era su única lectura); se escribe en once sitios de `codigo-padre.html` y lo comprueban los specs 39, 44 y 122.
- **El campo que quedó sin lector, retirado (2026-10-13, `489f14d`).** `estado.retoActual.disponible` ya no existe: `estado.retoActual` es `{ id, cola, colaCompletados }`. Antes de quitarlo se listaron todas las apariciones de `retoActual` en `*.html`, `*.js`, `*.cjs` y `*.mjs` (89 en 278 ficheros), clasificadas por lo que les sigue: del campo, dos escrituras con punto y nueve dentro de un literal en `codigo-padre.html`, y cuatro lecturas, todas en specs (39, 44 y 122); el objeto entero solo lo recibe `_buscarSiguienteRetoEnCola`, que lee `cola` y `colaCompletados`. Los specs 39, 44 y 122 preguntan ahora si el reto se puede abrir al sitio que lo decide (`_retoBtnEncendido()`), con su antes y su después; con el campo todavía puesto pasan (63 de 63, con los specs 22, 103, 120 y 123, de cuyos estados de partida se quita), y sin él, con los relacionados, 93 de 93 en chromium. Guía: G-70.

##### K-88 — Lo que el padre no devuelve a un hijo recargado: la barra de progreso de hijo3 y el reto ya cerrado de hijo4 — 🔎 (leído; sin medir)

- **hijo3, la barra de progreso.** El padre le manda `CONTROL.HABILITAR` o `DESHABILITAR` (`progressBar`) «solo si cambia» (`_ultimoHayAudioNotificadoAHijo3`, `codigo-padre.html:10119` y `:10176-10183`), y nada pone esa memoria a cero cuando hijo3 se recarga (búsqueda desnuda: sus tres líneas). El hijo3 nuevo nace con `_seekHabilitadoPorPadre = false` (`audio-hijo3.html:1124`) y el padre cree que ya se lo dijo: la barra queda sin poder arrastrarse en AVENTURA hasta que el valor cambie.
- **hijo4, el reto.** `_snapshotRecuperacion.retoActual` se apunta al mostrar un reto (`:10345`) y solo se borra con `RETO.COMPLETADO` (`:10654`), no al cerrarlo sin resolver ni al cambiar de elemento. Si hijo4 se recarga después, `_vv_afterHijoListo` le reenvía ese `RETO.MOSTRAR` (`:9348-9351`) con hijo4 oculto; tras un rescate, que cierra el reto sin completarlo, el reto reenviado es el de un elemento anterior.
- **Sin hallazgo.** hijo1: el temporizador se le devuelve desde `estado.tiempoRestante`, su única fuente (`:9324`); el campo `pausado` de ese mensaje no lo lee nadie (búsqueda desnuda en `extrainfo-hijo1.html`: ninguna línea).
- **Censo (regla 3b).** Mirados para esto: padre, hijo1, hijo2 (K-85 y K-86), hijo3 y hijo4. No abiertos: hijo5 (solo desarrollo; K-48 A aplicada), hijo6, selección, mapa-completo, puzzle y video-intro. El padre no les manda ningún `CONTROL.*` (los ocho envíos de `control: '` van a hijo2 y a hijo3), pero no se ha leído qué otro estado suyo depende del padre.
- **Método.** Lectura; sin ejecutar. El otro caso de hijo3 tras su recarga (`estado._audioFalloId` sigue puesto) está medido en R2.13 («K-07, revisión»).
- **Pendiente: decisión.** *A)* que el `HIJO_LISTO` de cada hijo le devuelva su estado por el mismo sitio que lo decide (a hijo3, además del botón de retos, la barra; a hijo4, el reto solo si sigue abierto); *B)* dejarlo.
- **Medido (2026-10-13), antes de tocar nada.** Spec 125 (`tests/e2e/125-un-hijo-recargado-queda-como-estaba.spec.js`, padre e hijos reales; el hijo cae pasando su documento a `about:blank` y lo recarga el supervisor; un oído puesto antes que el código de cada documento de hijo3 y de hijo4 apunta lo que el padre les manda), en chromium con el código de `479b06a`: HR-1, el hijo3 recargado no recibe ningún `CONTROL.*` de `progressBar` y su barra queda apagada con el audio disponible; HR-3, al hijo4 recargado con el reto cerrado sin resolver le llega `RETO.MOSTRAR` de ese reto; HR-2, en el arranque sale «Destino desconocido desde padre: 'hijo3'» (el aviso que R2.13 anota como conocido: el primer estado de la barra se manda con hijo3 sin registrar). HR-4, de control, en verde: con el reto abierto, el hijo4 recargado lo recibe.
- **Aplicada (2026-10-13, `acfebb1`): A.** El `HIJO_LISTO` de hijo3 llama, además de a `_sincronizarRetoBtn`, a `_reenviarProgressBarAHijo3()`, que olvida lo último mandado y llama a `actualizarEstadoControlesAudioPadre()`; esta no manda ni apunta nada mientras hijo3 no figura en `estado.hijosInicializados` (así el aviso del arranque no sale: el estado le llega con su `HIJO_LISTO`). `_hdl_RETO_OCULTAR` borra `_snapshotRecuperacion.retoActual`: se guarda solo un reto que está a la vista. Spec 125, 4 de 4; con los relacionados (29, 34, 43, 44, 50, 68, 80, 96, 102, 103, 104, 120, 122, 123 y 124), 106 de 106 en chromium. El arnés del spec no carga hijo5, y lo que el padre le manda da ese mismo aviso con `'hijo5'`: es del arnés, no se mira. Guía: G-74.

##### K-89 — Lo hecho dentro del elemento actual no sobrevive a una recarga: la ficha no se guarda, y la escriben siete funciones — ✅ (medido: M-23; leído)

- **Dónde.** `persistProgressState` (`codigo-padre.html:4247-4306`) guarda en `vv_progreso` el índice, el elemento, el tiempo y los rescates gastados; no guarda `estado.pendingCompleciones`. Al reanudar, la activación del elemento guardado crea su ficha de nuevo (`ensurePending`, `:11611`), a cero.
- **Medido (M-23).** Tras recargar la página y reanudar, la ficha del elemento tiene la llegada, el audio y el reto a `false`.
- **Lo que ve el usuario.** Si la app se recarga con la parada a medias, le pide otra vez lo que ya había hecho en ella: en español, escuchar el audio entero; en los otros once idiomas, saltarlo otra vez; y el reto, si ya lo había resuelto. La guía decía que «continúa exactamente donde lo dejó» (§25.10; G-66).
- **Lo que hace falta para guardarla** (leído). La ficha se escribe directamente desde siete funciones: `_retoColaCompletada` (`:10585`), `_marcarPendingPorLlegada` (`:11836`), `_audioFinalizadoSinReto` (`:12044`), `_saltarAudioPulsado` (`:12126`), `_hdl_AUDIO_FIN_REPRODUCCION` (`:12200`), `_marcarAudioNoDisponible` (`:12247`) y `_concederRescate` (`:13944-13947`). `persistProgressState()` se llama al activarse un elemento (`:11456`), al completarse (`:9872`), al cobrar un rescate (`:13895`) y al fijar la parada por defecto (`:4479`): ninguna de esas siete escrituras la llama. Guardar la ficha pide, o llamarla tras cada escritura (siete sitios), o un solo sitio que escriba en la ficha y guarde.
- **Lo que no hace falta** (leído). Los hijos no necesitan nada nuevo al reanudar con el audio ya terminado: el botón de retos sale de la ficha (K-82), la activación no arranca el recordatorio de un audio terminado, y hijo3 recibe el audio igual, sin reproducirlo solo. K-51 no lo bloquea: un campo nuevo en `vv_progreso` que falte en un progreso antiguo equivale a lo de hoy (ficha nueva), y la ficha guardada solo valdría para el mismo `elementoActualId`.
- **Método.** Lectura, y búsqueda de las escrituras `.llegada`, `.audio`, `.reto` y `.retosCompletadosCount` en `codigo-padre.html` (las once líneas citadas) y de las llamadas a `persistProgressState()`. Con varios retos por parada, que hoy no hay en los datos, habría que guardar también `colaCompletados`.
- **Relacionado.** K-85 (el elemento ya completado: se arregla aparte y antes), K-82, K-51, K-73 (quién crea fichas).
- **Pendiente: decisión.** Qué se guarda: *A)* la ficha entera del elemento actual (llegada, audio, reto y su cuenta), por un solo sitio que escribe en la ficha y guarda; *B)* solo el audio terminado; *C)* nada: tras una recarga se repite lo del elemento actual. Si se guarda, dos detalles más: si el reloj del recordatorio de rescate sigue donde iba o empieza de nuevo, y si la llegada se guarda o se le vuelve a pedir al GPS.
- **Decidido (2026-10-13): A**, la ficha entera.
- **Aplicada (2026-10-13, `e249843`), con el encargo del usuario de avanzar el estudio en su ausencia.** El cambio es el que se le enseñó, con cuatro añadidos. `_anotarEnFicha(clave, tipo, hecho)` es el único sitio que escribe en la ficha, y guarda al momento: `persistProgressState` lleva en `vv_progreso` la `ficha` del elemento actual (`clave`, `llegada`, `audio`, `reto` y `retosCompletadosCount`). Sustituye las siete escrituras directas. Al reanudar, `_restoreApplyState` deja lo guardado en `estado._fichaGuardada` y la activación del elemento restaurado lo vuelca en su ficha. **Los añadidos.** (1) Lo guardado se recoge solo si la clave casa y el modo es AVENTURA, y `_restoreBroadcast` lo suelta cuando esa activación termina. En lo enseñado se gastaba en la primera activación que llegara, fuera del elemento que fuera; las activaciones van en fila por tipo de mensaje (`_encolarEjecucionHandler`, `js/mensajeria.js`), así que una de otro elemento que estuviera en la fila (como la de K-61) lo habría gastado. (2) Una ficha que vuelve completa sobre un elemento que no figura como completado lo completa en esa misma activación. (3) y (4), la cola de retos y el recordatorio «pulse retos»: son K-90. **Los dos detalles que la decisión dejaba abiertos** quedan como se le propusieron: la llegada se guarda, y el reloj de la ficha empieza de nuevo al reanudar. **Un efecto que cambia y que no se pidió:** `_anotarEnFicha` pone siempre el reloj de la ficha a la hora de la anotación; dos de las siete escrituras no lo tocaban (la de `_marcarAudioNoDisponible` y la reserva de `_audioFinalizadoSinReto`), así que el recordatorio de rescate cuenta ahora desde que el audio se da por no disponible, y no desde que el elemento se activa. **No se guarda:** la distancia andada de un tramo (es estado del mapa) ni, en un elemento con varios retos, los retos sueltos de una cola a medias (hoy ninguno en los datos). En una reanudación en CASA (solo desarrollo, ver §24) lo guardado no se aplica.
- **Comprobación.** Spec 124 (`tests/e2e/124-lo-hecho-en-la-parada-sobrevive-a-una-recarga.spec.js`, 9 tests, con el padre y los hijos reales y una recarga real). En chromium, con el código de `aadd16d`: caen FG-1, FG-2, FG-3, FG-6, FG-7 y FG-8 y pasan los controles FG-4 y FG-5; con el cambio pasan los nueve. Cinco líneas del cambio se vieron en rojo por su test sirviendo el padre con esa línea mutada (guardar al momento, FG-1; soltar lo guardado, FG-5; la cola de retos, FG-6; el recordatorio, FG-7 y FG-8; el cierre de la ficha completa, FG-9), con el control sin mutar en verde (9 de 9). Chromium entero, 625 de 625, lanzado antes de añadir FG-9, que pasa aparte. La tanda de los cuatro navegadores no se ha lanzado. Guía: G-69.
- **Trampa del instrumento.** Con el service worker activo, la navegación de `page.reload()` la sirve el worker y `page.route` no la ve: las tres mutaciones cuyo efecto está después de la recarga salieron en verde sin haberse aplicado. La sonda va con `serviceWorkers: 'block'` y con una marca en el HTML servido que el test comprueba después de recargar.

##### K-90 — La activación para siempre el recordatorio de retos y prepara la cola de retos vacía, aunque el elemento vuelva con el audio terminado o con los retos hechos — ✅ (medido)

- **Dónde.** `codigo-padre.html`, en `_hdl_NAVEGACION_CAMBIO_PARADA`: toda activación llamaba a `_detenerRecordatorioReto()`, con el comentario «nunca arranca aquí (el reto de este elemento, si existe, todavía no está disponible)» (`:11801-11805` en `aadd16d`). Y `_asegurarRetoActualDe` (`:11400-11411`), cuando prepara el estado del reto de un elemento, creaba `colaCompletados` vacío.
- **Lo que no cuadra.** Es la segunda cara de K-82: un paso que vuelve a configurar sin mirar lo que ya está hecho. El mismo elemento se reactiva al recuperarse hijo2 (`_vv_afterHijoListo`) y al reanudar tras una recarga. Si su audio ya está terminado y el reto sigue pendiente, el recordatorio «pulse retos» que arrancó el fin del audio (`_procesarFinAudioElemento`, su único arranque) se para y nada lo vuelve a arrancar. Con K-89 aparece el otro lado: la ficha vuelve con «reto hecho» y la cola, recién creada, dice que queda; `_procesarFinAudioElemento` pregunta a la cola (`quedaReto`), así que volver a escuchar el audio arrancaría el recordatorio de un reto ya resuelto. Lo mismo en un elemento ya completado (K-85), que no tiene ficha.
- **Medido (2026-10-13).** Spec 124 en chromium, con el código de `aadd16d`: FG-8 (audio saltado, se reactiva la misma parada por el bus, y el recordatorio no sale en 45 s con proximidad real y el botón de retos encendido) y FG-7 (lo mismo tras una recarga real con reanudación), en rojo. El control va dentro de FG-7: antes de recargar, con esa misma espera, el recordatorio sí se ve. La cola vacía frente a una ficha con el reto hecho no se puede ver sin K-89 (antes la ficha no volvía): leído, y medido después con la línea mutada (FG-6).
- **Lo que ve el usuario.** Tras recuperarse el mapa (hijo2), o al reabrir la app con el audio ya terminado y el reto sin hacer, el botón de retos está encendido pero el aviso que le recuerda pulsarlo no vuelve.
- **Método.** Lectura de la activación y de las funciones del recordatorio; búsqueda desnuda de `_iniciarRecordatorioReto` en `*.html`, `*.js`, `*.cjs` y `*.mjs` fuera de `tests/` (su definición, su publicación en `globalThis` y la llamada de `_procesarFinAudioElemento`, las tres en `codigo-padre.html`) y de `colaCompletados` en `codigo-padre.html`, `js/*.js` y los demás `*.html` (solo el padre).
- **Relacionado.** K-82, K-85, K-89.
- **Pendiente: decisión.** *A)* la activación decide el recordatorio mirando lo hecho (audio terminado y reto pendiente: corre; si no, se para), y la cola de retos nace con los retos hechos cuando el elemento los trae hechos, con una sola pregunta por «retos hechos» (la ficha, o el elemento completado), como la de «audio terminado»; *B)* dejarlo.
- **Aplicada (2026-10-13, `e249843`), con K-89: A.** `_retosHechosEn(elemento)` es la única pregunta por «retos hechos» (la ficha con `reto` a `true` o, sin ficha, el elemento en `estado.paradasCompletadas`); `_asegurarRetoActualDe` crea `colaCompletados` con toda la cola cuando la respuesta es sí; y la activación arranca el recordatorio si el modo es AVENTURA, el elemento tiene reto y audio, el audio está terminado y los retos no están hechos, y lo para en cualquier otro caso. Se aplica sin esperar la decisión porque es lo que hace que K-89 A cumpla lo decidido (que lo hecho siga hecho al reanudar); cambia lo que ve el usuario en un punto: el aviso «pulse retos» vuelve a salir tras una reanudación o tras recuperarse hijo2, donde antes dejaba de salir. Spec 124: FG-6, FG-7 y FG-8.

##### K-91 — Si la app se recarga entre el «Sí» del rescate y «avanzar», el rescate no se cobra — ✅ (medido: M-26)

- **Dónde.** `_concederRescate` (`codigo-padre.html`) deja el elemento completado y guardado en el acto (`marcarParadaCompletada` escribe `vv_paradas_completadas`) y apunta el gasto solo en memoria (`estado._rescateGastoPendiente`); el cobro lo hace `_cobrarRescateSiProcede`, que `progresarSiguienteElemento` llama al avanzar. `persistProgressState` no guarda ese apunte.
- **Qué pasa.** Desde K-85, un elemento completado sigue completado tras una recarga y se activa listo para avanzar. Si la recarga cae entre el «Sí» y «avanzar», al reanudar el elemento está completado, el apunte no existe y `_cobrarRescateSiProcede` sale sin cobrar: `tramoSkipsUsados` no sube. Antes de K-85 esa misma recarga dejaba el elemento sin poder avanzar (M-23), así que no había rescate sin cobrar; lo hay desde que K-85 lo desbloqueó.
- **Lo que no cuadra.** El cobro se difirió porque el gasto y su efecto no eran atómicos (lo decía el comentario de `_cobrarRescateSiProcede`, y §25.19 de la guía: «el fallo solo puede caer a favor del usuario»). Hoy el efecto sí se guarda en el acto y el gasto no. El número de rescates por aventura es un límite antiabuso (guía, «Distancia recorrida»), y una recarga en esa ventana lo deja sin efecto.
- **En la guía.** §25.19 lo describe tal cual es («ese rescate no se cobra»; G-68). El comentario del código se puso al día en `e249843`.
- **Método.** Lectura de `_concederRescate`, `_cobrarRescateSiProcede`, `progresarSiguienteElemento`, `persistProgressState` y `_restoreApplyState`, y búsqueda desnuda de `_rescateGastoPendiente` en `*.html`, `*.js`, `*.cjs` y `*.mjs`: en la aplicación, cuatro líneas de código y un comentario, todas en `codigo-padre.html` (en las dos primeras funciones); fuera de ella, los specs 72 y 123. Sin ejecutar: el spec 72 mide el cobro al avanzar, no la recarga en la ventana.
- **Medido (M-26, 2026-10-13), con su control.** El rescate por su camino real y después «avanzar» con el botón de hijo2. Sin recargar: tras avanzar, `tramoSkipsUsados` vale 1, en memoria y en `vv_progreso`. Recargando la página y reanudando entre el «Sí» y «avanzar»: al reanudar el punto sigue completado y listo para avanzar, el apunte del cobro no existe, y tras avanzar `tramoSkipsUsados` vale 0 en los dos sitios.
- **Relacionado.** K-85, K-87, K-78 (la otra marca del rescate, `_rescatePeticionPendiente`).
- **Pendiente: decisión (es una regla del juego).** *A)* cobrar al conceder: el gasto y el elemento completado se guardan en el mismo paso, y sobran `_rescateGastoPendiente` y `_cobrarRescateSiProcede`; *B)* seguir cobrando al avanzar y guardar el apunte del cobro pendiente con el progreso, para que una recarga no lo pierda; *C)* dejarlo: un fallo en esa ventana, o una recarga hecha a propósito, da el rescate sin gastarlo.

#### Familia X — Lo que salió al leer el CSS sin uso (2026-10-13)

##### K-92 — El ✓ y la ✗ de los retos de la selección salen en negro: las reglas que les dan color piden una clase que nadie pone — ✅ (medido: M-27)

- **Dónde.** `En-busca-del-tesoro.html`. El estilo: `.tick, .x { display: none; … }` sin color, `.tick.correcto { display: inline; color: #1a5c2e; }` y `.x.incorrecto { display: inline; color: #9b1c1c; }`. El marcado de cada opción de los dos retos (`_crearOpcionRetoR1`, `_crearOpcionRetoR2`) lleva `<span class="tick" style="display:none;">✓</span>` y `<span class="x" style="display:none;">✗</span>`. `verificarRetoR1()` (pantalla 8) enseña uno u otro con `style.display = 'inline'`; `verificarRetoR2()` (pantalla 15, una pregunta de sí o no) enseña siempre el ✓ de la opción elegida, de la misma manera.
- **Qué pasa.** Nadie pone las clases `correcto` ni `incorrecto` (búsqueda desnuda de `classList` y `className` con esos nombres en el fichero: 0), así que las dos reglas con color no casan nunca y el ✓ y la ✗ heredan el color del texto de la caja del reto.
- **Medido (M-27, 2026-10-13), con su control.** En la pantalla de selección real, dentro del padre, en el reto de la pantalla 8, contestando opción por opción con el botón real: en los tres fallos la ✗ se enseña con color calculado `rgb(0, 0, 0)`, y en el acierto el ✓ también `rgb(0, 0, 0)`; sus clases son `x` y `tick`, sin más. Control: con las clases puestas a mano desde la sonda, el ✓ pasa a `rgb(26, 92, 46)` y la ✗ a `rgb(155, 28, 28)`: las reglas funcionan, lo que falta es la clase.
- **Lo que la medición no cubre.** El segundo reto (pantalla 15) no se midió; se leyó, y enseña el ✓ de la misma manera. Solo chromium. La guía no describe el color del ✓ ni de la ✗ (búsqueda de `tick` y de los dos colores: 0).
- **Pendiente: decisión**, porque cambia lo que se ve. *A) que `verificarRetoR1()` y `verificarRetoR2()` pongan y quiten las clases*, y que las dos reglas hagan el trabajo que hoy hace el `style.display`; *B) pasar el color a la regla base* (`.tick` en verde, `.x` en rojo) y retirar las dos reglas que no casan; *C) dejarlo en negro* y retirar las dos reglas. Con A o B hace falta un spec que mire el color calculado. No se recomienda ninguna: qué color quiere el usuario ahí es suyo.
- **Relacionado.** K-69 (de donde salió, al leer las reglas sin elemento).

#### Familia Y — Lo que el padre publica en `globalThis` y solo usa su propio bloque (2026-10-13)

##### K-93 — Una función sin llamador, una importación que solo se publica y diez publicaciones en `globalThis` que nadie lee fuera de su bloque — ✅ (búsqueda desnuda)

- **Método.** `globals-sin-lector.cjs` da por leído un global si su nombre aparece en el fichero, también como identificador suelto dentro del mismo bloque `<script>` que lo publica; ahí el nombre ya es visible sin pasar por `globalThis`. Censo nuevo (`exposiciones-sin-lector.cjs`, scratchpad, sin versionar): los 18 bloques `<script>` del padre delimitados por sus etiquetas, las 153 asignaciones `globalThis.X = …` o `window.X = …`, y por cada nombre sus apariciones en otro bloque o en el marcado del padre y en cualquier otro fichero `html`, `js`, `cjs` o `mjs` del repositorio, specs incluidos. Residuo: una asignación con clave computada (`globalThis[key] = undefined`, la limpieza de intervalos). Salen 24 nombres sin aparición fuera de su bloque; leídos uno a uno, 11 son otra cosa y se quedan: los que **se definen** en el global (`mostrarErrorOverlay`, `cerrarErrorOverlay`, `cerrarIframeOverlay`), los que son una casilla de estado que su bloque lee por `globalThis` (`__vv_MAPEO_IDIOMAS`, `__vv_salidaEnlaceExterno`, `_gpsHistorial`, `__VV_GPS_OVERLAY_SNOOZE`, `__vv_gps_perm_watcher`, `_gpsOverlayButtonCallback`, `__desarmarAbandonoFinAventura`, `_resetSpinAudioMainPadre`, `__VV_PENDING_CLEANUP`) y `consultarHeartbeat`, la herramienta de consola que la guía documenta.
- **Lo que no tiene lector.** (1) `_calcularProgresoFraccion()` (`codigo-padre.html:4230-4248`): una función que nadie llama; su comentario dice que la usa «el TTL de saltos de seguridad» desde otro script, y ese consumidor no existe (nombre desnudo en todo el repositorio: su definición, su publicación y una cita en `docs/contraste-textos-mapa.md`). La guía no nombra ni la función ni esa regla. (2) `TIPOS_MENSAJE_IFRAME` (`:14113-14118`, Script 3): se importa de `js/constants.js` y se publica para un handler de `visibilitychange` que no la usa (el nombre no aparece en ningún otro sitio). (3) `globalThis.__vv_applyStylingOnce` (`:159`): se publica y nadie la lee. (4) Publicaciones de funciones que su propio bloque llama por su nombre y nadie más: `_cancelarEscaleraImagen` (`:1833`, en un `<script>` clásico, donde la declaración ya es global), `showGpsOutOfRangeOverlay` y `hideGpsOutOfRangeOverlay` (`:5959`; anotadas sin entrada en R2.14), `hideFotoLejosOverlay` (`:6128`), `hideFotoFueraRangoOverlay` (`:6201`), `hideFotoDesviadoOverlay` (`:6276`), `hideFotoPerdidoOverlay` (`:6356`), `hideInternetOverlay` (`:6727`) y `hideGpsSignalOverlay` (`:6728`); sus parejas `show…` de esas dos últimas líneas sí las lee Script 2. Cinco de esos nombres figuran además como globals en `eslint.config.js` (`hideFoto…Overlay` y `showGpsOutOfRangeOverlay`).
- **Pendiente.** Retirar (1) a (4) y las cinco entradas de `eslint.config.js`: no cambia ningún comportamiento, y con las entradas de ESLint fuera, `no-undef` delata cualquier uso que este censo no haya visto.
- **La misma pregunta en los otros diez documentos** (`exposiciones-otros-frames.cjs`, scratchpad: nombres publicados que no aparecen en ningún otro fichero, con sus apariciones en el propio fichero separadas en «por `globalThis`», «en un manejador en línea» —que necesita el global— y «sueltas»). Solo dos son publicaciones sin lector: `obtenerCoordenadasParadas` en hijo2 y `obtenerRetos` en hijo4, cada una definida y usada dentro de un único `<script type="module">`. Las demás se leen por `globalThis` o desde un `onclick` del marcado (la selección, 14; hijo2, 2; hijo3, 2; hijo4, 2; `video-intro.html`, 4); hijo1, hijo5, hijo6, `mapa-completo.html` y `puzzle.html` no publican ningún nombre que no use otro fichero.
- **Aplicada (2026-10-13, `1f26741`).** Retirados (1) a (4), las dos publicaciones de hijo2 y de hijo4 y las cinco entradas de `eslint.config.js`: 47 líneas menos en cuatro ficheros (49 quitadas, 2 de ellas reescritas), por script y con el texto de cada línea comprobado; `showInternetOverlay` y `showGpsSignalOverlay` siguen publicadas. **Sobre el registro (corregido el mismo día: este punto decía que `no-undef` está apagado para los `.html`, y lo está solo para `tests/**/*.html`):** en los HTML de producción `no-undef` está en `warn` y el plugin analiza cada bloque por separado; comprobado por ejecución, con un `.html` de prueba pasado a ESLint por la entrada estándar: una llamada a un nombre inexistente da el aviso. Así que el lint limpio tras quitar las cinco entradas confirma que ningún otro bloque usa esos nombres sueltos. Lo que el lint no ve es el acceso por `globalThis.X`, y eso lo sostiene la búsqueda del nombre desnudo (tras aplicar, 0 apariciones de `_calcularProgresoFraccion`, `TIPOS_MENSAJE_IFRAME` y `__vv_applyStylingOnce` en `*.html` y `js/*.js`, y 0 de `globalThis.` o `window.` seguido de cada uno de los otros nueve), la búsqueda de accesos con clave computada a `globalThis` (uno solo en producción, la limpieza de tres intervalos con sus nombres en una lista) y de nombres compuestos por trozos (ninguno), y chromium entero: 635 de 635. La guía nombra esas funciones por lo que hacen, no su publicación: no cambia más que en §37.2 (abajo). **Frames no tocados:** selección, hijo1, hijo3, hijo5, hijo6, `mapa-completo.html`, `puzzle.html` y `video-intro.html`, por lo que dice el punto anterior.
- **El instrumento de §37.2 contaba mal los bloques, y se corrige en el mismo commit.** Al regenerar la tabla, la cabecera del padre no cuadraba: `tools/inventory-conexiones.js` abría un bloque por cada `<script>` que encontraba en el texto, también los escritos dentro del cuerpo de otro bloque (un comentario, una cadena con marcado). El padre salía con 20 bloques (dos eran comentarios; uno se fue con el punto (2) y por eso bajó a 19) y tiene 18: 5 de módulo y 13 clásicos, contadas las etiquetas a principio de línea; la selección salía con 18 y tiene 4; `video-intro.html`, con 7 y tiene 2. Los bloques fantasma no partían el análisis (cada línea se atribuye al primer bloque que la contiene, y el de verdad va antes), así que el número de identificadores cruzados no cambia (101, 16, 3; 124 en total), pero cada uno gastaba un número de «clásico» y los clásicos de detrás salían mal numerados en las celdas. Arreglo: tras cada bloque, la búsqueda sigue después de su `</script>`. Las cabeceras de la guía decían «20 bloques: 5 módulo + 15 clásicos» y «18 bloques» (G-77).
- **Tres más que el censo no vio porque contaba los comentarios (registrado el 2026-10-19).** El censo de `exposiciones-sin-lector.cjs` daba por leída una publicación si su nombre salía en otro bloque o fichero, también en un comentario. Repetido con los comentarios blanqueados (`exposiciones-v2.cjs`, scratchpad; mismo criterio para los specs, que cuentan como lectores; residuo: la clave computada de siempre y ningún bloque sin parsear) salen 18 nombres en vez de 15. Los tres nuevos son publicaciones de funciones que su bloque llama por su nombre y nadie más: `_avisarFalloCargaAppUnaVez` (`codigo-padre.html:3885`), `_obtenerCoordenadasP0Fallback` (`:5232`, con su entrada en `eslint.config.js`) y `waitForMapLibreAndInitialize` (`:8125`); solo los citaban comentarios de Script 2. Los otros dos que el censo viejo ya daba y K-93 no lista, `_cerrarDesplegableTipoMapaSiAbierto` y `_cerrarDesplegableBrujulaSiAbierto` (posteriores, `e5cac2d`), se definen solo en `globalThis` y su bloque los lee por ahí: se quedan, como los once de arriba. Por aplicar, igual que (4): fuera las tres publicaciones y la entrada de ESLint.
- **Aplicado (2026-10-19, `e57a4e8`).** Fuera las tres publicaciones (con el comentario «por consistencia» de `_obtenerCoordenadasP0Fallback`) y su entrada de `eslint.config.js`. Tras quitarlas: 0 accesos por `globalThis` o `window` a los tres nombres en `*.html`, `*.js` y `*.cjs`; lint limpio; specs 02, 08 y 11 en chromium, 32 de 32. Guía: §37.2 (143 expuestos en el padre y filas regeneradas).

#### Familia Z — Lo que encontró el usuario al ver que el equipo se paraba siempre en iphone12 (2026-10-13)

##### K-94 — En WebKit, los procesos de una página del padre cerrada a medio arrancar gastan medio núcleo durante diez segundos, y con tests cortos calientan el equipo hasta hibernar — ✅ (medido: M-28)

- **De dónde sale.** La tanda de los cuatro navegadores hibernó por temperatura a las 22:21:58 (Kernel-Power 88, zona `\_TZ.HPTZ`, `_HOT` = 371 K), ya en iphone12. Repetido solo iphone12, con el equipo en reposo, hibernó a los 30 segundos. Se había atribuido a encadenar tandas; el usuario observó que siempre era en iphone y en el mismo punto, y pidió comprobar ese punto. Tenía razón.
- **Qué pasa.** Cada test abre su contexto y su página y Playwright los cierra al acabar. WebKit (lanzado por Playwright con `--disable-accelerated-compositing --headless`: todo es CPU; la gráfica estuvo al 0 %) mantiene los `WebKitWebProcess` de una página cerrada unos diez segundos. Si la página se cerró entre el final de la FASE 1 y el final del arranque del padre (`globalThis.sistemaInicializado`, unas 0,1-0,15 s después), cada proceso rezagado gasta cerca de medio núcleo hasta que WebKit lo retira; si se cerró con el arranque terminado, no gasta nada. Los primeros specs (01, 02, 04) son tests de medio segundo, todos cerrados en esa ventana: es el punto de la suite donde más procesos rezagados conviven.
- **Medido (M-28), con controles.** Zona térmica leída cada segundo sin permisos de administrador (`Get-Counter`, juego «Información sobre la zona térmica»), con un corte que paraba la pasada a 85 °C. (1) Los specs 01, 02 y 04 (37 tests) en chromium: CPU plana al 30-40 %, de 57 a 76 °C en 16 s, 37 de 37. (2) Los mismos en iphone12: los `WebKitWebProcess` suben 2, 4, 6, 7, 9, 11, 13, 14, 16, 17 en 12 s y gastan de 1 a 8 núcleos; CPU del 28 % al 75-86 %; de 57 a 85 °C en 13 s; el corte saltó en el test 20, dos veces de dos. (3) Una sola página del padre abierta y quieta 15 s: 2 procesos, 0,1 núcleos. (4) Cinco páginas cerradas nada más pasar la FASE 1: 6 procesos rezagados a 2,0 núcleos constantes durante 9 s, de 57 a 77 °C. (5) Las mismas cinco cerradas con `sistemaInicializado` ya a `true` (86-157 ms de espera): 0,0 núcleos. (6) Sin el stub de MapLibre que usan los specs, las cinco cerradas nada más pasar la FASE 1 tampoco gastan: sin él el arranque se queda esperando el motor del mapa y no hay cargas en curso al cerrar.
- **Lo que no sirve.** Llevar cada página a `about:blank` antes de cerrar (medido con un `test` común de prueba en los tres specs): los procesos rezagados dejan de gastar, pero el cierre del contexto se queda colgado en 3 de 37 tests, 60 s cada uno y con un proceso a un núcleo entero. Se retiró sin versionar.
- **Arreglo aplicado (2026-10-13, `88db770`).** `gotoAndWaitForFase1` espera también a `globalThis.sistemaInicializado === true` (no aborta si expira: marca `__e2e_arranqueTimedOut`). Los tres specs en iphone12: 37 de 37, hasta 13 procesos rezagados que gastan menos de un núcleo entre todos, CPU al 21-29 % y 68-70 °C estables. iphone12 entero: 637 de 638 en 22,2 min, máxima 80 °C, media 67 °C, sin cortes. El que cayó, HD-2b del spec 08, comprobaba que `hijosInicializados` estaba vacío nada más volver del arranque, es decir, ganaba una carrera contra la carga de la selección; ahora comprueba que, sin cargar los hijos, solo la selección ha completado el apretón de manos (44 de 44 en los cuatro navegadores).
- **El vigía térmico, versionado en el mismo commit.** `npm run test:e2e:vigilada` (`tools/tanda-vigilada.js` y `tools/vigia-termico.ps1`): lanza Playwright con un vigía que lee la zona cada segundo y, en cada muestra que esté en el corte (85 °C) o por encima, apunta el corte y para todo lo que cuelga del lanzador menos él mismo. Tres controles, en chromium: pasada normal (resumen y código de Playwright); con `--corte=40`, no lanza y sale con 3; con `--corte=70`, corta a media pasada a 70,1 °C, no queda ningún proceso y sale con 3. Dos defectos propios hallados con esos controles y corregidos antes de versionar: el corte de una sola vez (uno que llegaba antes de existir Playwright no paraba nada) y el corte apuntado después de matar (el lanzador leía el CSV sin él).
- **Pendiente.** (a) Chromium, firefox y pixel5 enteros con la espera nueva: no se lanzaron esa noche; antes de la espera pasaron enteros. (b) Qué gira en una página cerrada a medio arrancar: resuelto abajo. (c) Por qué las tandas de la madrugada y de la mañana pasaron iphone12 enteras sin la espera: no medido.
- **En la guía.** Sección 38, nueva: qué mediciones hay, las reglas para que valgan, de dónde sale el calor y el vigía (G-78).
- **(b) resuelto (2026-10-14; medido: M-29): no es la aplicación.** El usuario pidió mirarlo a fondo y arreglarlo si hacía falta. Cuatro sondas en iphone12, todas con el vigía. *En una página viva no gira nada:* con la carga de la selección retenida, o abortada, el proceso del padre gasta de 0,0 a 0,3 núcleos, y en diez segundos la ventana del padre pide entre 2 y 6 `setTimeout`, ningún `requestAnimationFrame` y ningún intervalo nuevo (los que hay son de 500 ms, 5 s, 15 s, 60 s y 15 min); al dispararle `pagehide` a mano, lo mismo. No hay, pues, una espera del arranque que sondee sin pausa, y K-62 no es la causa. *Cerrando la página:* cinco padres cerrados nada más pasar la FASE 1 dejan procesos rezagados a 1-3 núcleos durante unos 9 s (cada proceso que gira ocupa un núcleo entero; giran entre uno y tres de cinco); con los service workers bloqueados, 0 y ni siquiera quedan procesos rezagados; con la selección sustituida por un documento vacío, 0; con un `sw.js` sin precarga (`APP_SHELL` vacío), 3; con un `sw.js` que no escucha `fetch`, 3; cerrados con el arranque terminado, 0. Cinco páginas mínimas que no son de la app, cerradas con cargas retenidas, 0 (prueba débil: el cierre tardó cinco segundos por página). **Conclusión:** hacen falta a la vez el service worker activo, la selección a medio cargar y el cierre; no dependen ni de la precarga ni del `fetch` de `sw.js`, ni de ningún bucle del padre. Lo que gira es el WebKit que usa Playwright al retirar una página con el registro del service worker y cargas de marcos en curso; no se ha podido mirar dentro del proceso. **Arreglo en la aplicación: ninguno hace falta.** Un usuario real cierra una página, no diecisiete en doce segundos, y con conexión lenta el padre espera sin gastar. La solución es la del arnés, ya aplicada (no cerrar a medio arrancar), con el vigía de red de seguridad. **Opción no aplicada, por si se quiere además:** registrar el service worker cuando el arranque termina y no durante él; cambia el ciclo de vida del worker y lo decide el usuario. Guía: §38.3 (la tabla de variantes) y un aviso en §19, anotados en G-78.
- **Relacionado.** La fila 58 (el mismo commit), K-62, y el fallo intermitente de pixel5 que motivó la fila 58: los dos son contabilidad de procesos y contextos de Playwright con la máquina cargada.

#### Familia AA — Lo que salió al preparar la segunda confirmación de aventura (2026-10-14)

##### K-95 — «Elegir otra aventura» con una aventura en curso deja la selección tapada por su pantalla de carga, y la segunda aventura no puede arrancar — ✅ (medido: M-30; decidido: recargar)

- **Dónde.** `iniciarAventura()` (`En-busca-del-tesoro.html`) sube `aventuraIniciando` y llama a `mostrarOverlayCargaAventura()`; las dos cosas solo se bajan en su `catch` (`ocultarOverlayCargaAventura()` y `_setAventuraIniciando(false)`; búsqueda desnuda de los dos nombres en el fichero: ningún otro sitio). `_elegirOtra()` (`codigo-padre.html`, el diálogo de vuelta que sale al pulsar atrás o al volver de un enlace externo con una aventura en curso) enseña otra vez el iframe de selección y le manda `NAVEGAR_PANTALLA { pantalla: 1 }`; no lo recarga. El `src` de la selección solo se asigna en `cargarIframeSoloSeleccion()`, que solo se llama en el arranque (búsqueda desnuda de quien le da `src` o la recarga en el padre y en `js/`: un sitio).
- **Qué pasa.** Tras un arranque que sale bien, la selección se queda con `aventuraIniciando = true` y con `#overlay-carga-aventura` a la vista (`position: fixed; inset: 0; z-index: 100000`, fondo naranja). Al volver a enseñarse, la P1 está debajo y no se ve; y aunque se llegara al botón de los logos, `iniciarAventura()` sale en su primera línea.
- **Medido (M-30, 2026-10-14), con su control.** Camino real en chromium, con el padre y la selección reales: elegir aventura, normativa (el padre carga los hijos), logos y su botón. Control: la primera aventura arranca así (modo `aventura`, parada `Av1-P-0`, la selección oculta y hijo2 a la vista). Después, «Elegir otra aventura» del diálogo de vuelta: la selección vuelve a estar a la vista con la P1 como pantalla activa, pero su pantalla de carga mide 1280×720 (la ventana entera), con opacidad 1 y al 100 %, y es lo que hay en el centro de la pantalla (`elementFromPoint`); la captura lo enseña. Recorriendo por debajo hasta los logos con la segunda aventura (el padre la recibe y precarga los hijos), el botón no deja rastro: ni el log de `iniciarAventura()` ni `SELECCION.AVENTURA_ACTIVADA`, y el padre no cambia en 20 s. De paso vuelve a salir K-50: la parada sigue siendo `Av1-P-0` con la segunda aventura elegida.
- **Por qué no se veía.** Los specs 19 (TR-1) y 25 (BR-10) pulsan ese botón sin haber arrancado antes una aventura por el camino real, y solo miran `tiempoRestante` y la brújula. K-50 ya avisaba de que su medición no usaba la pantalla de selección real.
- **Qué caminos no están afectados.** «Otra aventura» del modal de fin y del de tiempo agotado: limpian con `limpiarDatosAventura()` y recargan la página (`location.reload()`). `ejecutarElegirOtra()` (diálogo de reanudación, al abrir la app con una aventura guardada): la selección acaba de cargarse y no arrastra nada; leído, no medido.
- **Decisión del usuario (2026-10-14).** Que `_elegirOtra()` termine recargando la página, como ya hacen los otros dos: todo nace limpio. En este camino cierra también K-50, y deja sin trabajo los reinicios a mano de esa función (tiempo restante, saltos, paradas completadas, brújula, ocultar la interfaz de aventura y el `NAVEGAR_PANTALLA`).
- **Aplicado (2026-10-14, `c9c90fb`).** `_elegirOtra()` borra la aventura guardada y termina en `location.reload()`; spec 128 (rojo contra el padre anterior: no llega la recarga; verde con el cambio), spec 19 adaptado y spec 25 sin BR-10. Comprobado en una copia aislada con solo ese cambio (11 de 11 en chromium) y después en los cuatro navegadores (R2.17).
- **Lo que queda abierto.** `ejecutarElegirOtra()` sigue reiniciando a mano: son dos cuerpos (K-19) y unificarlos no se ha decidido. La salida que el usuario tiene mientras tanto en ese otro camino no hace falta: allí funciona.
- **Relacionado.** K-19, K-50 (familia S). M-30 cuenta por qué las dos primeras pasadas de la sonda no valían: el arranque del padre comprueba si hay una aventura guardada 300 ms después de darse por inicializado, y una sonda que arranca una aventura dentro de ese margen recibe la oferta de «reanudarla».

##### K-96 — La tarjeta de confirmación se pintaba al elegir, y solo si el aviso al padre salía bien: podía enseñar una aventura y el recorrido tener otra — ✅ hecha (2026-10-14)

- **Dónde.** `seleccionarAventura()` (`En-busca-del-tesoro.html`) llamaba a `_poblarCardAventura(aventura)` después del `await enviarMensaje(...)` y dentro del `try`: si el aviso al padre fallaba, la tarjeta de la P9 se quedaba con la aventura anterior, mientras el código de compra (`_irANormativa()`, el `let aventuraSeleccionada`) y el arranque (`estadoComponente.aventuraSeleccionada`) usaban la nueva. Leído; salió en el repaso de variables que pidió el usuario antes de aplicar la confirmación nueva.
- **Aplicado.** La tarjeta la pinta una sola función, `globalThis._pintarTarjetasDeAventura()`, al mostrarse la P9 o la P13 (`_ACCION_PANTALLA`), leyendo el `let aventuraSeleccionada`. Decisión del usuario («completamente de acuerdo»). Lo fija el spec 127 (CP-2: la aventura se cambia por el puente, sin pasar por el botón, y la tarjeta la sigue).

##### K-97 — La aventura elegida vive en tres sitios de la pantalla de selección — ✅ (aplicada, `9ca0bec`)

- **Aplicada (2026-10-14, `9ca0bec`).** Una sola fuente, el `let` del script clásico, escrito por sus puentes `_set…` y leído por su nombre desde el módulo. Fuera la copia de `estadoComponente` y la propiedad `globalThis.*` de la selección; la respuesta al latido dice lo que hay de verdad. La tanda dio 12 fallos: tres lecturas de los specs 82 y 127 que miraban la copia retirada desde dentro de la selección. La búsqueda previa fue por patrón y no las vio (regla 10); apuntadas a la fuente única, 52 de 52.

- **Dónde.** `En-busca-del-tesoro.html`: el `let aventuraSeleccionada` del script clásico (lo leen los retos, el audio y el texto de la intro, el mapa vintage, el código de compra y, ahora, la tarjeta), la propiedad `globalThis.aventuraSeleccionada` y `estadoComponente.aventuraSeleccionada` del módulo (la manda `iniciarAventura()` en `SELECCION.AVENTURA_ACTIVADA` y la contesta el latido). `seleccionarAventura()` escribe las tres seguidas, en el mismo paso.
- **Qué pasa.** `reiniciarSeleccion()` (el «no» del reto 2) solo vacía el `let`; las otras dos conservan la aventura anterior hasta la siguiente elección. Hoy no tiene efecto visible: a `estadoComponente.aventuraSeleccionada` solo la leen `iniciarAventura()` y la respuesta al latido, y a `globalThis.aventuraSeleccionada` no la lee nadie en el fichero (búsqueda desnuda de los dos nombres: una escritura de cada una y esas lecturas). Con el idioma pasa lo mismo (`idiomaSeleccionado`).
- **Pendiente: decisión.** Una sola variable y dos lectores, o dejarlo. Relacionado: la familia N (identificadores con varios nombres) y K-96, que ya lee de una sola.

##### K-98 — Tres sitios reinician lo que la selección tiene cargado, con listas distintas, y elegir otra aventura no reinicia nada — 🔎 (leído y datos medidos: M-31; por decidir)

- **Dónde.** `reiniciarSeleccion()` (idioma, aventura, los dos retos, términos, audio y texto), `_resetearFlagsContenido()` (los siete indicadores de «cargado»; la llama `seleccionarIdioma()`) y `confirmarIdioma()` (términos, agradecimientos y normativa). `seleccionarAventura()` no reinicia ninguno, aunque el reto 1, el reto 2, el audio y el texto de la intro se piden por aventura.
- **Qué pasa hoy.** Con la ✗ de la P9 se vuelve a elegir y se pasa otra vez por el reto 1 (P8): como `retoCargadoR1` sigue en `true`, sale el de la primera aventura y ya contestado (opciones desactivadas, botón encendido). Leído, no ejecutado.
- **Datos medidos (M-31), en los doce idiomas.** El fichero del audio de la intro es el mismo en las siete aventuras, en todos los idiomas. El texto de la intro solo cambia en un párrafo, el del límite de horas (60 o 150). La pregunta de los retos 1 y 2 es la misma pregunta en todas, pero **no está escrita igual**: solo en inglés y francés coinciden las siete; en los otros diez idiomas alguna aventura la lleva con otra redacción (en español, Aventura4 sin tildes ni «¿» y AventuraFallas sin el número delante; en alemán y portugués, Aventura4, Aventura5 y AventuraFallas; en chino, ruso y ucraniano, hasta tres redacciones). Al usuario se le dijo esa noche que eran iguales, con solo español e inglés mirados: lo exacto es esto.
- **Retos 1 y 2, aplicado (2026-10-14, `d5868b4`).** Decisión del usuario: «todo bien escrito y en el idioma correspondiente; debe haber homogeneidad y consistencia». Leídas las redacciones una a una (`retos-textos.mjs`, scratchpad): el significado era el mismo y las opciones y la respuesta buena también (el «7» del reto 1 en las 84 combinaciones), pero había dos errores de contenido —japonés de Aventura4 sin traducir («[PENDING] …», con «Yes/No»), el reto 1 de AventuraFallas en alemán escrito en español— y tuteo en italiano y neerlandés, contra la voz de la app en esos idiomas. Ahora cada idioma tiene una sola redacción, de usted o impersonal, con el número delante, en las siete aventuras: la de la mayoría, corregida donde hacía falta (en ucraniano, la que pregunta con «Чи»). Script en disco, idempotente, que solo toca `pregunta` y `opciones` de los 168 objetos. Queda la otra mitad de K-98 (las tres listas de reinicio).
- **Por qué no se hizo.** La confirmación nueva (P13) se resolvió sin volver a pasar por esas pantallas: con el pago hecho se va derecho de la P7 a la P13 (decisión del usuario), y las horas van en la tarjeta. Queda el paso por la P8 tras la ✗ de la P9, que ya existía.
- **Pendiente: decisión.** Una sola función que diga qué se reinicia al cambiar de idioma y qué al cambiar de aventura; y, aparte, si las dos preguntas de Aventura4 y AventuraFallas se igualan a las demás (son textos del usuario).

##### K-99 — Cuatro tipos de mensaje escritos a mano en el script clásico de la selección — ✅ (aplicada, `c9fd1c0`)

- **Dónde.** `En-busca-del-tesoro.html`, script clásico: `'SELECCION.P15_MOSTRADA'`, `'SELECCION.PREPARAR_HIJOS'`, `'SELECCION.CODIGO_VALIDADO'` y `'SELECCION.REINICIAR'` (búsqueda de literales `'SELECCION.…'` en producción fuera de `js/constants.js`: esos cuatro y ninguno más). El módulo del mismo fichero publica `globalThis.TIPOS_MENSAJE` y lo explica: una cadena escrita a mano no sigue a `constants.js` si el valor cambia; `cargarPuzzle()` y `_avisarRotacion()` ya lo usan.
- **Qué pasó.** Al renombrar `P14_MOSTRADA` a `P15_MOSTRADA` hubo que cambiar a mano ese literal además de la constante. `npm run verificar-mensajeria` casa emisor y receptor por el texto, así que un olvido habría salido ahí como tipo sin receptor; y el spec 127 (CP-11) recorre el aviso de verdad.
- **Pendiente: decisión** (pequeña): que los cuatro envíos lean el tipo de `globalThis.TIPOS_MENSAJE`.
- **Aplicada (2026-10-14, `c9fd1c0`).** Los cuatro envíos leen `globalThis.TIPOS_MENSAJE.SELECCION.…`, sin guarda: el puente de tipos lo publica el mismo módulo que inicializa el bus, en la misma pasada y sin ninguna espera entre los dos (leído: tras `await bus.inicializarMensajeria(…)` solo hay tres sentencias síncronas antes de `globalThis.TIPOS_MENSAJE = TIPOS_MENSAJE`), así que vale para los tipos el margen ya medido para el bus; y si un tipo no existiera en `constants.js`, `enviarMensaje` lo rechaza con un `error` («tipo es requerido», `js/mensajeria.js`). **Medido (sonda desechable, chromium), antes y después:** recorriendo la selección de verdad —la ✓ de la P9, el código con el backend de prueba del spec 129, la P15 al mostrarse y el «no» del reto R-2—, al padre llegan `SELECCION.PREPARAR_HIJOS`, `SELECCION.CODIGO_VALIDADO`, `SELECCION.P15_MOSTRADA` y `SELECCION.REINICIAR`, una vez cada uno y con origen `seleccion`, igual con los literales que con el puente. **Control:** sirviendo la selección con una clave que no existe (`…SELECCION.NO_EXISTE`), ese aviso no llega y el bus escribe su error; los otros tres siguen llegando. `npm run verificar-mensajeria`: 92 tipos, ninguno sin emisor ni sin receptor (resuelve la forma `globalThis.TIPOS_MENSAJE.X.Y` con el parser). Lint limpio. Los specs 61, 74, 82, 85, 127 y 129 en los cuatro navegadores, con el vigía: 108 de 108 (27 por navegador), 73,1 °C de máxima. **Censo de literales (recuento con residuo):** los 92 valores de `TIPOS_MENSAJE`, buscados entre comillas en los 49 ficheros de producción (html de la raíz, `js/*.js` menos `constants.js`, y `sw.js`): tras el cambio quedan cinco apariciones, ninguna en la selección — dos etiquetas `contexto:` de un informe de error en hijo5, un comentario de `js/utils.js` y dos lecturas con respaldo en literal, que son K-104. No ve los tipos compuestos por trozos en una plantilla. **Censo de frames (regla 3b):** tocada solo la selección; el padre, hijo1 a hijo6, mapa-completo, puzzle y video-intro, sin cambios en este commit.

##### K-100 — Cuatro reglas CSS de la selección apuntan a `#pantalla8 .audio-overlay`, y esa caja está en la pantalla 11 — ✅ (aplicada, `ac7d165`)

- **Dónde.** `En-busca-del-tesoro.html`: `#pantalla8 .audio-overlay` en cuatro selectores (uno en la lista de la regla del tamaño de texto y tres para la barra de desplazamiento). La pantalla 8 es el reto 1 y no tiene ningún `.audio-overlay`; el único está en `#pantalla11` (`#texto-intro-contenido`), que tiene sus propias reglas (`#pantalla11 .audio-overlay`). Parecen restos de una renumeración anterior.
- **Pendiente.** Medir el estilo calculado de la caja de la P11 (si le falta algo de lo que esas cuatro reglas querían darle) y decidir entre retirarlas o apuntarlas a la 11. Relacionado: K-69 y K-92 (reglas sin elemento en ese mismo fichero).
- **Medido (M-33): a la caja de la P11 le faltan las dos cosas que esas reglas dan.** El texto de la intro desborda la caja (5204 caracteres en Aventura1, en español) y su barra de desplazamiento es la del navegador (`scrollbar-color: auto`), mientras las tres `.texto-box` (términos, normativa y agradecimientos) la llevan fina y con los colores `#888` y `#e8d5b0`. El tamaño de letra de la caja es el del `body`: 16 px en los dos móviles (393×727 y 390×664) frente a los 18 px de las `.texto-box`; en escritorio (1280×720) coinciden en 18 px. `#pantalla8 .audio-overlay` no casa ningún elemento; en todo el documento hay un `.audio-overlay`, el de la P11.
- **Recomendación; decide el usuario (cambio visible).** Apuntar los cuatro selectores a `#pantalla11`, que es lo que sus comentarios dicen querer («mismo tamaño que hijo2», «scrollbar unificado»): en el móvil el texto de la intro pasaría de 16 a 18 px y su barra sería la de las otras cajas. Retirarlos deja la pantalla como se ve hoy.
- **Aplicada (2026-10-14, `ac7d165`).** Decisión del usuario: «igualar es lo correcto, a 18 px». Los cuatro selectores apuntan a `#pantalla11 .audio-overlay`. Medido después con la misma sonda, en los cuatro navegadores: la caja de la P11 da 18 px y la barra de las otras tres cajas, igual que ellas. Specs 45 y 127, 68 de 68.

##### K-101 — El diálogo de vuelta decide «hay una aventura en curso» mirando si hay aventura e idioma elegidos — ✅ (aplicada con K-105, `0aafe4e`)

- **Dónde.** Los escuchas de `popstate` y `visibilitychange` del padre: `enAventura = !!(globalThis.aventuraSeleccionada && globalThis.idiomaSeleccionado)`. Esas dos variables se llenan al elegir en la selección (P2 y P7), no al arrancar la aventura.
- **Qué puede pasar.** `history.pushState({ vv_en_aventura: true })` se hace al activar, y esas entradas sobreviven a «Elegir otra aventura» (antes y después de K-95). Si el usuario elige otra aventura y, todavía en la selección, pulsa atrás, el estado de la entrada es `vv_en_aventura` y las dos variables ya están llenas: saldría el diálogo «¡Aventura en curso!» sin aventura en curso. No medido.
- **Pendiente.** Medirlo; si pasa, que la pregunta la conteste lo que dice que la aventura está en marcha (el modo, o `vv_aventura_iniciada`).
- **Medido (M-32): pasa, y solo cuando debajo de la entrada actual hay otra con `vv_en_aventura`.** Aventura en marcha, recarga de la página y «Continuar» (la reanudación apila una segunda entrada con ese estado); «Elegir otra aventura» (recarga); en la selección, idioma y otra aventura elegidos, sin arrancarla; «atrás»: sale «¡Aventura en curso!» con el modo en `null` y sin `vv_aventura_iniciada` (chromium, pixel5 e iphone12). En una sesión sin esa recarga previa el mismo «atrás» no enseña nada, porque llega a una entrada sin estado: es K-105, que es el fallo de fondo.
- **Recomendación; decide el usuario.** Se cierra con K-105: un solo sitio que conteste «¿hay una aventura en curso?», con el modo.

##### K-102 — El arranque mira si hay una aventura guardada 300 ms después de darse por inicializado — ✅ (aplicada en el arnés, `46e36a3`)

- **Dónde.** `codigo-padre.html`: tras `sistemaInicializado = true`, `setTimeout(() => _finalizarInicializacion(logPrefix), 300)`, que retira la pantalla de carga del padre y llama a `_comprobarReanudacionAventura()`.
- **Qué pasa.** `gotoAndWaitForFase1()` vuelve con `sistemaInicializado`. Un test que arranque una aventura dentro de esos 300 ms deja `vv_aventura_iniciada` escrita antes de la comprobación y recibe el diálogo de reanudación, que a los 30 s continúa solo: fue lo que estropeó las dos primeras pasadas de M-30. Una persona no puede hacerlo (la pantalla de carga sigue encima). El spec 128 espera a que el `body` pierda la clase `loading`.
- **Pendiente: decisión** (arnés): que `gotoAndWaitForFase1()` espere también a eso, o dejarlo en los specs que arrancan una aventura por el camino real.
- **Aplicada (2026-10-18, `46e36a3`), en el arnés.** `gotoAndWaitForFase1()` espera también a esa comprobación: el `body` sin `loading`, o el diálogo de reanudación (`#dialogo-reanudacion-overlay`) o el modal de tiempo agotado (`#modal-tiempo-agotado`) en pantalla. Solo `loading` no basta: `mostrarDialogoReanudacion()` la vuelve a poner para tapar la interfaz (leído en el padre), y con una aventura guardada la espera duraría hasta que alguien contestara. La señal es buena porque `_finalizarInicializacion` retira la pantalla de carga y, en la misma tarea, `_comprobarReanudacionAventura` lee `vv_aventura_iniciada` antes de su primer `await` (leído). No aborta si expira: marca `__e2e_reanudacionTimedOut`. Spec 126: AR-1 (sin nada guardado, al volver el `body` no lleva `loading`) y AR-2 (con una aventura guardada, al volver el diálogo está en pantalla), los dos en rojo antes y en verde después. Chromium entero: 692/692, sin omitidos, 22,4 min, 64,1 °C de máxima. Guía: §18.3.

##### K-103 — Nombres con un número de pantalla que no es el suyo, y un parche viejo de renumeración — ✅ (el parche, `9647f77`; los nombres, `45e60ac`)

- **Dónde.** `_accionPantalla5()` es la acción de los agradecimientos (P18) y `_accionPantalla15()` la de la normativa (P15: coincide desde la renumeración de hoy, por casualidad). `tools/renumber-pantallas.js` es el parche de una renumeración anterior: apunta a `En-busca-del-Tesoro.html` y a textos que el fichero ya no tiene, y no lo llama ningún script de `package.json`.
- **Hecho hoy.** Los comentarios de la selección que llevaban un número viejo dicen el bueno (los de las reglas CSS, el del cartel FREE DEMO, las cabeceras de términos, aventuras, mapa vintage y reto 2), y se quitó una cabecera duplicada sobre `validarCodigo()`.
- **Pendiente: decisión.** Renombrar las dos funciones a lo que hacen (sin número) y retirar el parche viejo.
- **Parche retirado (2026-10-14, `9647f77`).** Lo pidió el usuario: «lo que ya no sirva, fuera, pero asegura que realmente no sirve y no dejes basura». Ejecutado contra una copia de la selección de hoy, en el scratchpad: falla 17 de sus 20 pasos y aun así reescribe el fichero (renombra ids de pantalla, inserta una P16 de logos duplicada y reordena los divs: 6452 líneas cambiadas). Nadie lo llamaba (búsqueda desnuda de «renumber» en todo lo versionado). La guía lo nombraba en la lista de `tools/` y en dos filas de la tabla de recursos, que coinciden ahora con `npm run inventory:assets`. Los nombres de las dos funciones siguen por decidir.
- **Nombres, aplicado (2026-10-14, `45e60ac`).** Decisión del usuario: `_accionAgradecimientos()` y `_accionNormativa()`. Búsqueda desnuda de «accionPantalla» en todo lo versionado: dos definiciones y dos llamadas en la selección y cinco menciones en la guía, una de ellas falsa (decía que la función envía `SELECCION.P15_MOSTRADA` «al aceptar» la normativa; sale al mostrarse la pantalla, G-83). Los specs que pasan por la P15 o la P18, en los cuatro navegadores: 156 de 156.

##### K-104 — Dos envíos leen el tipo del puente y, si no está, lo escriben a mano; y el puente solo existe en tres frames — ✅ (aplicada, `783a75f` y `901e3a7`)

- **Cómo salió.** Del censo de literales de K-99 (los 92 valores de `TIPOS_MENSAJE` buscados entre comillas en producción).
- **Dónde.** (1) `js/utils.js`, `_mandarErrorAlPadre()`: `tipo: globalThis.TIPOS_MENSAJE?.SISTEMA?.ERROR || 'SISTEMA.ERROR'`. (2) `codigo-padre.html`, `abrirChat()`, en un `<script>` clásico: `tipo: globalThis.TIPOS_MENSAJE?.CHAT?.ESTADO_PADRE || 'CHAT.ESTADO_PADRE'`.
- **Qué pasa de verdad.** `globalThis.TIPOS_MENSAJE` lo publican tres frames: el padre (Script 1 «si no está», y Script 2 otra vez «si no está»), la selección y `video-intro.html` (búsqueda desnuda de `globalThis.TIPOS_MENSAJE =`: esos cuatro sitios; `js/constants.js` no lo publica). **Medido** en los cuatro navegadores con los hijos cargados y la aventura en marcha: en hijo1 a hijo6 `typeof globalThis.TIPOS_MENSAJE` es `undefined`; en el padre y en la selección, `object`. Los seis hijos cargan `js/utils.js` (leído: su `import` en cada uno), así que en ellos el informe de un error no controlado sale **siempre** con el literal: el respaldo es el único camino que corre en los hijos, y la lectura del puente solo puede correr donde el puente existe y la captura se instala (la selección y `video-intro.html`; en el padre la captura no se instala: exige tener un `parent`). En `abrirChat()` es al revés: el puente está publicado mucho antes de que el botón del asistente responda (exige a hijo6 listo), y el literal no corre nunca.
- **Por qué importa.** Es la misma cadena escrita a mano de K-99, con un respaldo mudo: si el valor de `constants.js` cambiara, seis frames seguirían mandando el viejo sin que nada lo diga.
- **Arreglo (un solo camino posible).** `js/utils.js` importa `TIPOS_MENSAJE` de `./constants.js` (no tiene importaciones y `constants.js` tampoco: no hay ciclo) y usa `TIPOS_MENSAJE.SISTEMA.ERROR` en todos los frames; `abrirChat()` lee `globalThis.TIPOS_MENSAJE.CHAT.ESTADO_PADRE` sin literal. Sin efecto visible.
- **Las dos publicaciones del padre: medido y aplicado (2026-10-18, `901e3a7`).** Eran dos bloques de alias, no solo el puente: Script 2 volvía a publicar «si no está» `TIPOS_MENSAJE`, `MODOS`, `registrarControlador`, `enviarMensaje` y `ajustarTimeoutPorConexion`, que Script 1 ya publica. Medido con un accesor en la ventana del padre que apunta la pila y la hora de cada asignación y de cada lectura del bloque de Script 2 (sonda desechable `k104/zz-quien-publica.spec.js` del scratchpad): en chromium, firefox, iphone12 y chromium con la red lenta (300 ms de latencia, 400 kbit/s), los seis nombres los asigna una sola vez el bloque de Script 1 (`codigo-padre.html:3832-3841`), y el de Script 2 los lee ya puestos entre 32 y 86 ms después; ninguna segunda asignación. Es estructural: Script 2 no pasa de su espera inicial (`:9319`) hasta ver `globalThis.estadoPadre`, que Script 1 publica en `:4036`, después de sus alias. El bloque de Script 2 solo habría actuado con Script 1 roto, y entonces lo habría tapado. Fuera el bloque y el alias `registrarControlador_S2`, que solo usaba él; el registro de controladores de Script 2 usa su import (`TIPOS_MENSAJE_S2`) en vez de `globalThis.TIPOS_MENSAJE || TIPOS_MENSAJE_S2` (el mismo objeto). Spec 11, CI-6 (cada alias, como mucho una publicación por fichero de producción, leído en el fuente): en rojo con el código anterior (`TIPOS_MENSAJE` en 2 sitios), en verde después. Chromium: 124/124 en 21 specs de arranque, alias, registro y modo. Guía: §18.3 y §37.2 regenerada. **Censo de frames (regla 3b):** tocado el padre; la selección y `video-intro.html` publican el puente una vez y los seis hijos, mapa-completo y puzzle no lo publican (CI-6 lo comprueba en todos). Al regenerar §37.2 salió K-111.
- **La guía.** §26.3 dice que `constants.js` expone `globalThis.TIPOS_MENSAJE`, y el apartado «Namespace CHAT» de §27 dice que el código accede a `CHAT.CERRAR` por el puente con un literal de respaldo: hijo6 usa el `TIPOS_MENSAJE` que importa, y el único respaldo es el del padre.
- **Aplicada (2026-10-14, `783a75f`).** `js/utils.js` importa `TIPOS_MENSAJE` de `./constants.js` y `_mandarErrorAlPadre()` usa `TIPOS_MENSAJE.SISTEMA.ERROR`; `abrirChat()` lee `globalThis.TIPOS_MENSAJE.CHAT.ESTADO_PADRE`. Censo de literales tras el cambio: tres apariciones y ninguna es el tipo de un envío (dos etiquetas `contexto:` de hijo5 y un comentario). `npm run verificar-mensajeria`: 92 tipos, ninguno sin emisor ni sin receptor, y los dos emisores siguen resueltos (`--todos`: `js/utils.js` en `SISTEMA.ERROR` y `codigo-padre.html` en `CHAT.ESTADO_PADRE`); el recuento de emisores baja de 227 a 225 porque cada `X || 'literal'` contaba dos veces. Lint limpio. El spec 58 (RE-2) comprueba en un hijo real que el error no capturado viaja con el tipo `SISTEMA.ERROR`. Los 16 specs del canal de errores y del asistente (11, 16, 47, 58, 69 a 72, 75, 79 a 81, 83, 85, 90 y 123) en los cuatro navegadores, con el vigía: 416 de 416 (104 por navegador), 74,1 °C de máxima. Guía: G-82. **Censo de frames (regla 3b):** tocados `js/utils.js` (lo cargan los seis hijos, la selección y el padre) y `codigo-padre.html`; sin cambios propios la selección, hijo1 a hijo6, mapa-completo, puzzle y video-intro.

##### K-105 — El primer «atrás» de una sesión no enseña el diálogo de vuelta, y el segundo saca de la aplicación — ✅ (aplicada, `0aafe4e`; falta la prueba en un Android real)

- **Cómo salió.** Al medir K-101 con el botón atrás de verdad (`history.back()`), que ningún spec pulsa: en los specs y en sus ayudantes no hay `goBack`, `history.back`, `popstate` ni `PopStateEvent` (búsqueda desnuda), y los dos que abren el diálogo (19 y 128) lo hacen llamando a `_mostrarDialogoVueltaRapida`.
- **Dónde.** `codigo-padre.html`: al registrarse la aventura se hace **un** `history.pushState({ vv_en_aventura: true }, '')` (en la activación y en la reanudación), y el escucha de `popstate` empieza por `if (!e.state?.vv_en_aventura) return;`. El `state` de un `popstate` es el de la entrada **a la que se llega**.
- **Qué pasa (M-32, cuatro navegadores).** Con la aventura recién arrancada el historial es la entrada inicial de la página (estado `null`) y, encima, la insertada. El primer «atrás» llega a la inicial: `popstate` con estado `null`, el escucha vuelve sin hacer nada y no sale ningún diálogo. El segundo «atrás» sale de la aplicación (en chromium, pixel5 e iphone12 la página deja de existir). **Control:** tras recargar la página con la aventura en marcha y pulsar «Continuar» —la entrada actual conserva su estado al recargar y la reanudación apila otra—, el primer «atrás» sí enseña el diálogo, y tras «Continuar mi aventura» el siguiente también (chromium, pixel5 e iphone12). O sea: el diálogo solo sale en una sesión que ya ha pasado por una recarga.
- **Desde cuándo.** Desde que existe: `338f329` (2026-06-21) lo introdujo con esta misma forma, y no hay ningún `replaceState` en el padre, en la selección ni en `js/` (búsqueda desnuda).
- **Límite de la medición.** `history.back()` desde el script, en los navegadores de Playwright: no es el botón físico de un móvil ni la PWA instalada. En firefox la recarga de Playwright añade una entrada en lugar de conservar el estado, así que su control no vale. Falta la prueba en un móvil real.
- **Recomendación; decide el usuario (cambio visible: saldría un diálogo donde hoy no pasa nada).** Que el escucha no dependa del estado de la entrada a la que se llega: si hay una aventura en curso, reinserta la entrada y enseña el diálogo; si no, no hace nada. Y que «¿hay una aventura en curso?» lo conteste un solo sitio con lo que dice que la aventura está en marcha (el modo: `null`, casa o aventura), no las variables de la elección: con eso se cierra también K-101. Antes, un spec que pulse atrás de verdad (rojo con el código de hoy: es el primer paso de la sonda).
- **Decisión del usuario (2026-10-14): el principio.** «Debería portarse como en una app nativa: primero cierra lo que tienes delante». Con una aventura en marcha, cada «atrás» se vuelve a armar y hace, por orden: si hay algo abierto con ✕, lo mismo que esa ✕; si el diálogo de vuelta está abierto, lo cierra (como «Continuar mi aventura»); si no hay nada, enseña el diálogo. «¿Aventura en curso?» lo contesta el modo. Quedan por decidir: qué hace con lo que no tiene ✕ a propósito (la ventana del reto, el modal de tiempo agotado); qué hace en la selección antes de arrancar; y la prueba en un Android real con la PWA instalada. Antes de implementar: el inventario completo de capas de los once frames (qué se abre encima, quién la cierra y en qué frame vive).
- **Lo que sostiene la recomendación (leído y medido).** `estado.modo.actual` nace en `null` (`codigo-padre.html` y `js/state-manager.js`) y solo lo escribe `js/app.js`, en tres asignaciones: el modo nuevo, el modo nuevo si no había ninguno, y la vuelta al anterior cuando el cambio falla. Nada lo devuelve a `null` (búsqueda de `modo.actual =` y de `modo: { actual:` en el padre y en `js/`; no vería una asignación del objeto `modo` entero por otra vía). Todas las salidas de una aventura dejan la página: «otra aventura» y «terminar» del fin de aventura (`location.reload()` y `En-busca-del-tesoro.html?despedida=1`) y «Elegir otra aventura» del diálogo de vuelta (recarga). `ejecutarElegirOtra()`, la del diálogo de reanudación, reinicia sin recargar, pero corre antes de restaurar la aventura, con el modo todavía en `null`. En M-32 el modo es `aventura` con la aventura en marcha y `null` tras la recarga y con otra aventura elegida sin arrancar. Queda por medir al implementarlo el tramo entre el `pushState` de la activación y el final del cambio de modo.
- **Aplicada (2026-10-14, `0aafe4e`), con K-101.** Decisiones del usuario: el principio («como una app nativa: primero cierra lo que tienes delante»), y con lo que no tiene ✕ a propósito (la ventana del reto) el diálogo encima y «Continuar» vuelve al reto tal cual. Un solo sitio, `_atrasConAventuraEnMarcha()` (Script 1): solo actúa con una aventura en marcha según el modo; cada «atrás» vuelve a apilar la entrada; con el diálogo abierto pulsa su «Continuar»; con el modal de fin de aventura (sin ✕) no hace nada (no lo decidió el usuario: lo dejé así porque el diálogo diría «aventura en curso» sobre una aventura terminada; se le pregunta); si hay una capa que se cierra, cierra la de más arriba (la ✕ común del padre, que pulsa, o el asistente); si hay un desplegable abierto, lo cierra (cada uno publica su `_cerrarDesplegable…SiAbierto`); si no, el diálogo. Para que la ✕ también funcione con el modal de tiempo agotado, el usuario pidió ponérsela (`7f97ae6`, spec 130). Las entradas del historial ya no llevan estado. **Spec 131** (BA-1 a BA-6), el primero que pulsa atrás de verdad: con el escucha anterior fallan BA-1 a BA-4 y BA-6. En la primera tanda de los cuatro navegadores, BA-4 falló en firefox e iphone12; medido con una sonda (`elementFromPoint` sobre el botón «Continuar»): lo que había encima era la rueda de la pantalla de carga del padre, que se desvanece 0,5 s después de quitar `body.loading`, y el test pulsaba atrás en ese medio segundo. Con la espera a que esa pantalla desaparezca, 72 de 72 (cada test tres veces en cada navegador). **Queda:** la prueba en un Android real con la PWA instalada (fila 25 de §22.0 de la guía), y lo que vive dentro de un hijo (el modal interno del asistente, la ficha de un monumento del mapa completo), que «atrás» cierra con su contenedor; cerrarlo por separado pediría un mensaje nuevo del bus.
- **Segunda parte, aplicada (2026-10-14, `7d7d00c`): lo que se abre dentro de los hijos.** Decisión del usuario: que «atrás» lo cierre también, con un mensaje nuevo del bus («ok, asegura no tener fallos»). Inventario de los once frames, leído en el código: hijo1 tiene su menú de «más opciones» (`mostrarIconos`/`ocultarTodos`, las dos únicas que cambian `estadoMenu.abierto`); hijo6, su modal interno (`#chat-modal-overlay`, abierto en dos sitios y cerrado en `cerrarModal`); mapa-completo, la ficha de un monumento (`#monumento-overlay`, `cerrarOverlay`), y el padre, la ventana del temporizador, sin ✕ (la alterna `_hdl_TEMPORIZADOR_TOGGLE`). Sin capas que cerrar: hijo2 y hijo3 (su clase `activo` es el botón pulsado), hijo4 (la ventana del reto la dibuja el padre, sin ✕ a propósito), hijo5 (solo desarrollo), la selección (antes de arrancar no hay aventura en marcha), puzzle (vive dentro de la ventana del reto) y video-intro (sus `open` y `show` son la animación de demostración); las cuatro páginas que abre hijo1 van en otra ventana y llevan su ✕ (`3b08a7f`). Dos tipos nuevos, `UI.CAPA_ABIERTA { abierta }` (hijo → padre) y `UI.CERRAR_CAPA` (padre → hijo), por un solo módulo, `js/capa-con-atras.js`, que registra el handler, avisa al crearse de que la capa está cerrada (así un hijo recargado borra lo que el padre supiera del documento anterior) y solo envía los cambios. Cada frame cierra con la misma función que su ✕ o su botón. El padre apunta el iframe, no el nombre, en un `WeakSet` (`_hdl_UI_CAPA_ABIERTA`, Script 2: el iframe del mapa completo se destruye al cerrarlo y su apunte se va con él), y `_capaDeArriba()` cuenta cada capa medio escalón por encima de su iframe; cuenta también la ventana del temporizador, con el cierre único `_cerrarVentanaTemporizador()`, y la ventana del reto, sin cierre: si es la de arriba sale el diálogo y no se toca lo que tapa (a igual `z-index` gana la que va después en el documento). Spec 131, BA-7 a BA-11. Rojo antes que verde, medido: contra HEAD fallan BA-7 a BA-10 (el menú, el modal, la ficha y el temporizador siguen abiertos; BA-9 porque «atrás» cierra el mapa entero); BA-11 falla si la ventana del reto no entra en la cuenta (cerraba el menú de debajo). **Queda:** la prueba en un Android real.

##### K-106 — El seguro de «aventura terminada» del rescate buscaba un id que no existe — ✅ (aplicada, `d5d6ca6`)

- **Cómo salió.** Al leer los dos modales del final para ponerle la ✕ al de tiempo agotado.
- **Dónde.** `codigo-padre.html`, `_concederRescate()`: antes de conceder, comprueba que la aventura no haya terminado mirando si está en pantalla `#modal-tiempo-agotado` o `#modal-finalizacion`. El modal de fin de aventura es `#modal-finalizacion-aventura`; `modal-finalizacion` no lo lleva ningún elemento (búsqueda desnuda: esa línea y una frase de la guía).
- **Qué pasaba.** Con la aventura completada y su modal en pantalla, el rescate se concedía.
- **Aplicada.** El id bueno. Rojo antes que verde: CR-6, nuevo en el spec 72 (el flujo de CR-5 con el modal de fin en lugar del de tiempo agotado), falla con el id viejo (el punto se completa) y pasa con el bueno. Spec 72 en los cuatro navegadores: 24 de 24. Guía §25.19 y la fila del spec 72.

##### K-107 — El botón del mapa completo de hijo2 decide la aventura por tres caminos, y uno lee otro frame — ✅ (aplicada; falta la tanda de los cuatro navegadores)

- **Cómo salió.** Al leer cómo se abre el mapa completo para el caso BA-9 del spec 131.
- **Dónde.** `coordenadas-hijo2.html`, el `click` de `btnMapaCompleto`: la aventura del mapa es `globalThis.__vv_aventuraActual`, si no `globalThis.parent.aventuraSeleccionada` (hijo2 leyendo una variable del padre: Opción A lo prohíbe, y `npm run verificar-frames` lo cuenta, «ajeno 1» en hijo2) y, si no, `'Aventura1'` con un `warn`. La URL que sale (`mapa-completo.html?aventura=…`) llega al padre en `NAVEGACION.MOSTRAR_MAPA_COMPLETO`.
- **Usuario (2026-10-14):** «hay que mirarlo bien mirado, eso no puede ser, debe mostrar la aventura que ha elegido el usuario».
- **Investigado (2026-10-15, leído en el código).** La aventura del mapa completo la decide quien no debe, y por cuatro sitios en cadena: (1) hijo2, con `__vv_aventuraActual` —su copia, que escribe al recibir `DATOS.CARGAR_COORDENADAS`—, si no `parent.aventuraSeleccionada` y si no `'Aventura1'`; mete la aventura en la URL (`mapa-completo.html?aventura=…`) y la manda en `NAVEGACION.MOSTRAR_MAPA_COMPLETO`; (2) el padre (`_hdl_NAVEGACION_MOSTRAR_MAPA_COMPLETO`) abre esa URL tal cual; (3) el mapa lee `?aventura=` y, si falta, también se queda con `'Aventura1'`; (4) `_hdl_MAPA_COMPLETO_SOLICITAR_DATOS` le contesta con esa. Ninguno de los cuatro mira la aventura elegida. El botón del mapa vintage del mismo hijo decide de otra forma: manda `__vv_aventuraActual || null` y el padre (`_hdl_NAVEGACION_MOSTRAR_MAPA_VINTAGE`) cae a `globalThis.aventuraSeleccionada` y después a `estado.seleccion.aventura` (K-109). Dos botones del mismo hijo, dos maneras de decir qué aventura.
- **Recomendación (toca el bus: los datos de tres mensajes, no los tipos).** Que la aventura la decida un solo sitio, el padre, con su fuente de la aventura elegida, y que nadie más la diga: los dos botones de hijo2 piden el mapa sin aventura ni URL; el padre arma la URL del mapa completo y busca el vintage con su aventura; el mapa pide sus datos sin aventura y el padre le contesta con los de la elegida. Fuera de hijo2 la lectura de `parent` y `'Aventura1'`, y del mapa el `'Aventura1'` por defecto. Spec: que el mapa completo y el vintage enseñen la aventura elegida aunque hijo2 no haya recibido sus coordenadas. Antes de tocarlo, regla 1 (§10, §10.25 y §28 contra el código) y K-109, que decide cuál es esa fuente única en el padre.

- **Aplicado (2026-10-18, decisión del usuario: «siempre el padre. hijo2 y el mapa completo dejan de decirla»).** Los dos botones de hijo2 mandan `datos: {}` y hijo2 pierde `__vv_aventuraActual`; `mapa-completo.html` deja de leer `?aventura` y pide sus datos con `{}`; los tres handlers del padre (`MOSTRAR_MAPA_COMPLETO`, `MOSTRAR_MAPA_VINTAGE`, `MAPA_COMPLETO.SOLICITAR_DATOS`) leen `globalThis.aventuraSeleccionada` y, sin ella, avisan con un error. Specs: 54 (MC-5), 55 (MV-6), 25, 93 y 131 (BA-9). Guía corregida en §4.7, §4.7f, §5, §7.3, §7.10, §8.6, §10.22, §10.23, §11, §14, §18.3, §26.12 y §37.2, más el comentario de `codigo-padre.html` sobre `fullHeight`. **Verificado (2026-10-18, chromium):** los 12 specs que tocan los mapas, la franja lateral y el asistente (18, 25, 47, 54, 55, 60, 80, 82, 93, 127, 128, 131), 80 en verde (el 81, CH-3 del spec 47, es el test nuevo de K-108, en rojo a propósito antes de su arreglo). **En rojo con el código de HEAD** (los tres ficheros de código de HEAD y los specs nuevos; copia guardada aparte y restaurada con las mismas huellas): caen MC-5 (el padre abre `mapa-completo.html?aventura=Aventura3`, la del mensaje), MV-6 (no se abre el mapa de la elegida) y BA-9 (el mensaje sin datos del contrato nuevo no abre el mapa); el 25 y el 93 pasan con los dos códigos, porque solo se adaptaron al contrato. **Falta:** la tanda de los cuatro navegadores.

##### K-108 — El padre manda al asistente dos campos que el asistente no lee — ✅ (aplicada, `64f4abf`; sin cambio visible)

- **Cómo salió.** Al corregir la sección del asistente en la guía, que decía que `estadoPadre` solo sirve al buzón.
- **Dónde.** `construirEstadoChat()` (`codigo-padre.html`, Script clásico del asistente) arma `{ idioma, aventura, paradaActualNombre, siguienteParadaNombre, paradasRestantes, rescate }` para `PADRE_DATOS` y `CHAT.ESTADO_PADRE`. `chat-hijo6.html` lee `idioma` (del mensaje), `rescate`, `aventura` y `paradaActualNombre` (búsqueda de `estadoPadre.` en el fichero); `siguienteParadaNombre` y `paradasRestantes` no los lee nadie.
- **Recomendación (sin cambio visible):** quitar los dos campos del mensaje y el cálculo que los produce.
- **Aplicada (2026-10-18, `64f4abf`).** Fuera los dos campos y su cálculo de `construirEstadoChat()`; un comentario dice qué lee el asistente. Spec 47, CH-3: escucha dentro del propio hijo6, con un script de inicio, el `PADRE_DATOS` del apretón de manos y el `CHAT.ESTADO_PADRE` que manda su botón real, y exige `idioma`, `rescate`, `aventura` y `paradaActualNombre` (más `modo` y `timestamp` en el primero): en rojo antes del cambio, con exactamente los dos campos de más; en verde después. Chromium: 112/112 en los 18 specs que tocan el asistente (04, 11, 16, 47, 69 a 72, 80, 88, 90, 93, 96, 104, 121, 123, 126 y 131). Guía: §6, §7.7, la tabla del handshake de §7, §9, §18.3, §26.12 y §27. Búsqueda desnuda de los dos nombres después: solo quedan en este estudio. **Censo de frames (regla 3b):** tocado el padre; `chat-hijo6.html` no cambia (no los leía), ni la selección, hijo1 a hijo5, mapa-completo, puzzle y video-intro (`git diff 64f4abf^ 64f4abf --stat`: solo el padre, el spec 47, la guía, `sw.js` y `version.json`). Al leer la función entera salió K-110.

##### K-109 — En el padre, la aventura elegida vive en dos sitios — ✅ (aplicada con K-52, `cf47a3a`)

- **Cómo salió.** Al buscar la fuente de la aventura para K-107.
- **Dónde.** `codigo-padre.html`: `globalThis.aventuraSeleccionada` (58 lecturas) y `estado.seleccion.aventura` (7 apariciones). Las escriben juntas la selección de aventura, la restauración de una aventura guardada y el reinicio; `_hdl_SELECCION_PREPARAR_HIJOS` escribe solo la segunda. La segunda solo se lee como respaldo de la primera (`globalThis.aventuraSeleccionada || estado?.seleccion?.aventura`): con K-107 aplicada queda **un solo** respaldo, en `codigo-padre.html:7257` (el que contesta a hijo5); el del mapa vintage se fue con K-107. Es el mismo caso que K-97 resolvió en la selección, ahora del lado del padre.
- **Recomendación (sin cambio visible).** Una sola: la que leen todos (`aventuraSeleccionada`), y fuera la copia de `estado.seleccion` y los dos respaldos. Antes, medir quién llega a leer el respaldo con la primera vacía (si alguien, es un fallo que hoy no se ve).
- **Aplicada con K-52 (2026-10-19, `cf47a3a`).** Fuera `estado.seleccion.aventura` (sus cinco escrituras: «otra aventura», la restauración, `AVENTURA_SELECCIONADA`, `PREPARAR_HIJOS` y la activación) y su único lector, el respaldo del handler que contesta a hijo5. `estado.seleccion` se queda con `activada`, que sí se lee; y fuera una línea de `_hdl_AVENTURA_ESTADISTICAS_TIEMPO` que lo creaba sin usarlo. **Lo que pedía medir, resuelto leyendo los cinco escritores (sin sonda):** cuatro escribían a la vez la aventura principal, y el quinto, `PREPARAR_HIJOS` (P9), corre después de que `AVENTURA_SELECCIONADA` (P7) la haya escrito. La copia solo podía tener valor con la principal vacía si se perdía el aviso de P7, que es el segundo camino silencioso que K-52 cierra con el acuse. Ningún spec pide esas paradas con la principal vacía (el 98 mide el empuje, y el CP-8 del 10 solo que el handler no lance).

##### K-110 — El nombre de parada que el asistente adjunta al buzón sale de otra lista — ✅ (aplicada, `ad8a484`)

- **Cómo salió.** Al aplicar K-108, leyendo `construirEstadoChat()` entera.
- **Dónde.** `codigo-padre.html`, `construirEstadoChat()`: `paradaActualNombre: paradas[idx]?.nombre`, con `paradas = globalThis.AVENTURA_PARADAS` e `idx = estadoPadre.indiceProgreso`. `indiceProgreso` es un índice de `elementosIDpadre` (lo dice su declaración en `estado` y es lo que lee `obtenerElementoActual()`), y `AVENTURA_PARADAS` es la lista de coordenadas de `coordenadas-hijo2.html` (sus dos escritores, `distribuirDatosAventura` y la carga perezosa de `js/funciones-mapa.js`, toman la misma), que empieza por las referencias y no lleva `pre-intro1`, `pre-intro2` ni `intro`: dos listas distintas con el mismo índice.
- **Medido (estático, sobre los datos de las siete aventuras; sonda desechable `k108/indice-chat.mjs` del scratchpad).** Para cada índice, el elemento real (`elementosIDpadre[idx]`, buscado por su `parada_id`/`tramo_id` en las coordenadas) frente a `AVENTURA_PARADAS[idx]`: 0 coincidencias en las siete (Aventura1 0 de 65, Av34km 0 de 236). En el índice 3, la parada de inicio (Torres de Serranos), sale una referencia: en Aventura1, «Plaza Décimo Junio Bruto (Almoína)».
- **Lo que ve el usuario.** Nada en pantalla: el nombre solo viaja como contexto del buzón de sugerencias (`enviarSugerencia`, `js/feedback-forms.js`). Lo ve quien lee las sugerencias, con la parada equivocada.
- **Recomendación (un solo camino: el elemento en curso ya lo guarda el padre).** `paradaActualNombre: ep.elementoActual?.nombre || ''`: `estado.elementoActual` (el mismo objeto que `globalThis.estadoPadre`) lo fija `_actualizarEstadoParada()` en cada cambio de parada con el elemento de `elementosIDpadre`, que lleva `nombre`, y vale `null` antes de la aventura y tras un cambio de modo (`limpiarRecursosPorModo`, `js/app.js`). Fuera `paradas` e `idx`. Spec: con la aventura en un elemento concreto, el `CHAT.ESTADO_PADRE` que llega a hijo6 lleva su nombre. No cambia nada visible para quien recorre la aventura; cambia lo que llega al buzón.
- **Aplicada (2026-10-19, `ad8a484`), la recomendación tal cual.** `paradaActualNombre: ep.elementoActual?.nombre || ''`, fuera `paradas` e `idx`. Comprobado antes: los elementos de `elementosIDpadre` llevan `nombre` (ninguno sin él en las 7 aventuras × 12 idiomas) y `estado.elementoActual` lo fijan los cambios de elemento con esos mismos objetos (vale `null` tras un cambio de modo: de ahí el `|| ''`, que aquí significa «no hay elemento»). **Al pasar, un resto de K-52 en la misma función:** `aventura: globalThis.aventuraSeleccionada || ''` también sale (el asistente se carga en P15, con la aventura elegida); el inventario de K-52 buscaba `|| 'Aventura…'` y no vio esta forma. Spec 47, CH-4: con la aventura en el cuarto elemento de la Aventura1, el `CHAT.ESTADO_PADRE` que manda el botón real lleva su nombre; en rojo con el padre de HEAD (llegaba `""`) y en verde después; el 47 entero, 8/8. Guía: §7.7 (de dónde sale el nombre) y la fila de `CHAT.ESTADO_PADRE`, que describía una rama de hijo6 quitada con K-52.

##### K-111 — El padre publica `globalThis.registrarControlador` y la aplicación no lo lee — ✅ (aplicada, `5d2e56a`)

- **Cómo salió.** Al regenerar §37.2 tras lo que quedaba de K-104: `registrarControlador` dejó de cruzar entre bloques del padre, porque su único lector era el bloque duplicado de Script 2 (para volver a publicarlo).
- **Dónde.** `codigo-padre.html`, bloque de alias de Script 1: `if (globalThis.registrarControlador === undefined) globalThis.registrarControlador = registrarControlador;`. Búsqueda desnuda de `registrarControlador` en todo el repositorio: ningún fichero de producción lee la global (cada frame y cada módulo usa el de su `import` o `globalThis.mensajeria.registrarControlador`; `js/app.js`, `registrarControladorSeguro` o `globalThis.mensajeria.registrarControlador`). La leen tres sitios del arnés: el test 1f del spec 02 (que exista), el spec 07 (la apunta en su informe) y la espera de FASE 1 de `tests/e2e/helpers/boot.js`, que la usa como una de las señales alternativas a `__MENSAJERIA_INICIADA`.
- **Por qué importa.** Una publicación que la aplicación no lee, y una espera del arnés que depende de ella.
- **Recomendación (sin cambio visible):** retirarla y, en el mismo paso, que la espera de FASE 1 deje de pedirla (le basta `__MENSAJERIA_INICIADA`, o `globalThis.mensajeria.registrarControlador`) y que el 1f del spec 02 y el spec 07 tampoco la pidan. Toca el arranque de todos los specs: con la suite entera en chromium.
- **Aplicada (2026-10-19, `5d2e56a`), la recomendación tal cual.** Fuera la publicación y la constante local de Script 1 que solo servía para ella (búsqueda desnuda de nuevo: todas las lecturas sin prefijo estaban en Script 1, donde el nombre es local; ningún otro bloque ni frame lee la global). La espera de FASE 1 del arnés pide `globalThis.mensajeria.registrarControlador`; el 1f del spec 02 vigila lo contrario de antes, que la global no exista y el bus registre (en rojo con el padre de HEAD); el 07 deja la clave y su aserción, y CI-6 del 11 deja de listarla como alias. 02, 07 y 11: 25/25 en chromium; el arranque de todos los specs, en la pasada entera de la noche (R2.23). Guía: filas de los specs 02 y 11.

#### Familia AB — Lo que salió al repasar qué queda (2026-10-19)

Al contestar al usuario qué queda del estudio, con un script sobre las 111 entradas (`que-queda.cjs`, scratchpad) y leyendo R2.11, los «sin entrada» de R2.13 y los «no tocado» de cada tanda. La lista de la noche anterior había salido solo de R2.9.4 y se dejaba fuera lo que vive en otras partes de este documento; R2.24 la completa.

##### K-112 — El nombre de la aventura, el del idioma y el tiempo estimado se leen del índice con una reserva muda, en nueve sitios — ✅ (leído; búsqueda desnuda)

- **Dónde.** `codigo-padre.html`, Script 1: `mostrarDialogoReanudacion` (`:4462`, el nombre de la aventura cae al id; `:4463`, el del idioma cae al código), `mostrarModalFinalizacion` (`:8162-8163`) y los cinco carteles —`mostrarCartelTransicion` (`:8373`), `mostrarCartelInicioTramo` (`:8450`), `mostrarCartelLlegadaParada` (`:8529`), `mostrarCartelBienvenidaTramo` (`:8593`) y `mostrarCartelBienvenidaParada` (`:8656`)—; estos seis llevan la misma expresión copiada: `__vv_INDICE_AVENTURAS?.[aventuraSeleccionada]?.nombre || aventuraSeleccionada || ''`. Script 2: el tiempo estimado al arrancar el reloj de la aventura (`:12748-12754`): sin entrada en el índice, un `warn` y 216 000 s; con la entrada y sin `tiempoEstimado`, los mismos 216 000 s sin decir nada. La selección: `_pintarTarjetasDeAventura` (`En-busca-del-tesoro.html:2948-2956`) pinta el id a pelo si no tiene la entrada del índice, sin log.
- **Cuándo puede faltar el índice.** El padre lo carga en dos sitios: la comprobación de la aventura guardada lo importa antes del diálogo de reanudación si aún no está (`:7959-7966`, con un `error` si falla), y la fase 2 de datos lo publica con los demás módulos (`:3774`). Los carteles, el modal de fin y el reloj corren en AVENTURA, después de la fase 2. La reserva solo se usa si el import del índice ha fallado, y entonces no lo dice nadie (salvo el `warn` del reloj).
- **Lo que no cuadra.** Es el resto de K-52 que su barrido no buscaba (buscaba `|| 'Aventura1'`, `|| 'es'` y `X[idioma] || X.es`): una reserva muda en un dato que sale de la elección. Y la misma expresión está escrita seis veces.
- **Método.** Búsqueda desnuda de `|| aventura`, `|| idioma`, `|| aventuraSeleccionada`, `|| idiomaSeleccionado`, `|| aventuraId`, `|| aventuraActual`, `|| idiomaActual` y sus formas con `globalThis.` en los once frames y en `js/*.js`: los ocho sitios del padre. Búsqueda desnuda de `INDICE_AVENTURAS` y `MAPEO_IDIOMAS` fuera del padre: la tarjeta de la selección y `js/reciclaje-digital.js`. Leídos los nueve sitios y los dos cargadores del índice.
- **Lo que ve el usuario.** Nada mientras el índice cargue.
- **Fuera de esta entrada.** `js/reciclaje-digital.js:141-146`: la ventana de compra, sin la entrada del índice, escribe un `warn` y da la aventura por no caducada (el padre carga el índice antes de llamarla para no caer ahí, `codigo-padre.html:7949-7966`). Es la lógica de compra: decide el usuario.
- **Recomendación (sin cambio visible):** una función por dato en Script 1 (el nombre de la aventura y el del idioma) que lo lee del índice y, si falta, lo dice con un `error` y devuelve el id o el código: la reserva se queda, pero ruidosa. El reloj, `error` en vez de `warn`, también para la entrada sin `tiempoEstimado`. La tarjeta de la selección, un `error`.
- **Aplicada (2026-10-19, `2f3b2ff`), la recomendación tal cual.** `_nombreDeAventura()` y `_nombreDeIdioma()` en Script 1 (las usan el diálogo de reanudación, el modal de fin y los cinco carteles: ocho llamadas contando la definición); el reloj de Script 2 dice con un `error` cuando no tiene `tiempoEstimado` (también si la entrada existe sin el campo); la tarjeta de la selección, un `error` antes de pintar. Comprobado antes con el índice real: las siete aventuras traen `nombre` y `tiempoEstimado`, y los doce idiomas su nombre. Spec 137 nuevo: NI-2 (sin la entrada, el cartel enseña el id y el padre lo dice) en rojo con el padre anterior y en verde después; NI-1, el control, en verde en los dos. Chromium, specs 22, 35, 41, 46, 65, 82, 127, 128 y 137: 45 de 45. Guía: la cabecera de los carteles, el reloj de hijo1, la tarjeta, el modal de fin, §37.2 y la fila del spec. **Censo (regla 3b):** tocados el padre y la selección; los otros nueve frames no leen el índice (búsqueda desnuda de `INDICE_AVENTURAS` y `MAPEO_IDIOMAS`: solo el padre, la selección, `js/data-loader.js`, que lo carga, y `js/reciclaje-digital.js`, que queda para el usuario).

##### K-113 — El banner de versión nueva sale en español al arrancar con un aviso pendiente, sea cual sea el idioma — ✅ (leído; se mide con su spec)

- **Dónde.** `codigo-padre.html`, bloque clásico del service worker (`:14368-14610`). `_mostrarBannerSW` toma el texto de `globalThis.TRADUCCIONES_SW_UPDATE` y, si no está, de un literal en español (`:14434-14436`). Esa global la publica Script 1 (`:2889-2891`), que es un módulo: corre al terminar el parseo, después de este bloque. Y el bloque enseña el banner en el acto si una sesión anterior dejó el aviso pendiente (`vv_sw_update_pendiente`, `:14527-14530`).
- **Lo que no cuadra.** El idioma lo resuelve bien (`idiomaDeLaInterfaz()`, en un bloque clásico temprano que existe precisamente porque el banner puede salir antes que Script 1), pero la tabla todavía no está y decide el `|| { label: '🔄 Nueva versión disponible', boton: 'Actualizar' }`. En el arranque con el aviso pendiente no es una carrera: pasa siempre. También puede pasar si `controllerchange`, la respuesta del SW o `version.json` llegan antes que Script 1.
- **Método.** Leído el bloque entero; búsqueda desnuda de `TRADUCCIONES_SW_UPDATE`: el import y la publicación de Script 1 y la lectura del banner, sin ningún otro lector. Ningún spec toca el banner (búsqueda desnuda de `sw-update-banner`, `vv_sw_update_pendiente`, `SW_ACTIVADO` y `version.json` en `tests/e2e`: 0).
- **Lo que ve el usuario.** Quien cerró la app sin pulsar «Actualizar» y no usa el español ve el banner en español la próxima vez que la abre.
- **Relacionado.** K-52 (el idioma elegido, en todo momento). Una espera escrita a mano a que Script 1 publique la tabla (familia de K-62) no bastaría: el banner sale por cuatro caminos que no esperan a nadie.
- **Recomendación:** que el bloque del banner pida él mismo su tabla (`import('./js/traducciones-ui.js')`, el mismo módulo que carga Script 1, que el navegador no vuelve a evaluar) y cree el banner cuando la tenga, sin el literal en español; si la tabla no llega, un `error`, y el aviso sigue pendiente para la siguiente vez. Script 1 deja de importar y de publicar la tabla, que no tiene otro lector.
- **Aplicada (2026-10-19, `02a0fe9`), la recomendación tal cual, con sus guardas.** El bloque pide los textos con `import()` al cargarse y crea el banner cuando llegan (`_crearBannerSW`). Mientras llegan: una segunda petición solo apunta la versión (sale un banner, con la última); si se retira el aviso o empieza el reciclaje de datos, no sale; sin textos, un `error` y el aviso sigue pendiente. Script 1 deja de importar y publicar `TRADUCCIONES_SW_UPDATE`. **Medido antes:** spec 138, SB-1 (aviso pendiente y `vv_idioma` en inglés) en rojo con el padre anterior: el banner salía en español; en verde después. SB-2 (control en español) y SB-3 (un solo banner) en verde en los dos. Chromium, specs 02, 08, 11, 60, 114, 135 y 138: 52 de 52. Guía: los dos sitios que daban el español como comportamiento, §37.2 (fuera su fila: el padre queda en 97 cruzados de 142) y la fila del spec.

##### K-114 — `index.html` tiene tres caminos hacia el padre, y repite la regla de HTTPS y el registro del service worker del padre — ✅ (leído)

- **Dónde.** `index.html`: (1) `location.replace('codigo-padre.html')` en el `<head>` (`:8`); (2) al final del `<body>`, un `setTimeout` de 100 ms con `location.href = 'codigo-padre.html'`, cuyo comentario dice «si el meta refresh no funciona», y no hay ningún meta refresh (`:147-151`); (3) el enlace «haz clic aquí» (`:125`). Además, la regla de forzar HTTPS en `valenciavguides.es` (`:142-146`), la misma que la del padre (`codigo-padre.html:20-28`), y el registro del service worker (`:153-157`), el mismo que el del padre (`:14578`, con las mismas opciones).
- **Por qué no se veía.** K-33 lo dejó en 📌: la guía describe la página como decorativa, y casi nunca se pinta.
- **Lo que no cuadra** (con el principio del usuario del 2026-10-14, un solo camino). El `setTimeout` es un segundo camino para lo que ya hace el `replace`. La regla de HTTPS y el registro del SW los hace el padre en cuanto carga, que es adonde lleva el `replace`. El enlace no es un camino del código: es lo único que queda sin JavaScript.
- **Método.** Leído `index.html` entero; búsqueda desnuda de `serviceWorker.register` y de la regla de HTTPS en las páginas de la raíz. `manifest.json` abre la PWA instalada en `/codigo-padre.html` (`start_url`): `index.html` solo se abre al entrar por la raíz del dominio (`js/server.js` sirve `/` con él).
- **Lo que ve el usuario.** Nada.
- **Recomendación:** dejar el `replace` del `<head>` como único camino, con el enlace para quien no tiene JavaScript, y quitar del `<body>` el `setTimeout`, la regla de HTTPS y el registro del SW.
- **Fuera de esta entrada, para el usuario.** El texto del enlace va de tú («Si no eres redirigido automáticamente, haz clic aquí») y solo en español. Y la etiqueta `<meta http-equiv="Strict-Transport-Security">` de quince de las diecisiete páginas de la raíz (todas salvo `debug-brujula.html` y `video-intro.html`) no tiene efecto: el navegador no la atiende en un `<meta>` (RFC 6797, §8.5); HSTS solo cuenta como cabecera HTTP del servidor.
- **Aplicada (2026-10-19, `a93ff42`), la recomendación tal cual.** Fuera del `<body>` el `setTimeout`, la regla de HTTPS y el registro del SW; un comentario en el `<head>` dice que el `replace` es el único camino y por qué. Spec 136 nuevo: IX-1 (una sola navegación en el código de `index.html`, sin SW ni HTTPS propios) en rojo con el `index.html` anterior (tres navegaciones) y en verde después; IX-2 (`/` e `/index.html` llevan a `/codigo-padre.html`) en verde en los dos. **Una hipótesis mía, medida y descartada:** pensé que el `setTimeout` dejaba `index.html` en el historial con el padre lento, y lo dije así a mitad de trabajo. La sonda (desechable) da dos entradas en todos los casos, también entrando directo al padre: Playwright parte de `about:blank`, y ni el `setTimeout` ni el padre añaden ninguna. No hay test de eso. Guía: las pantallas de espera, la tabla del ciclo del SW, la lista de canales, el árbol de tests y la fila del spec; y la memoria de auditoría del SW decía que `index.html` registra el SW.

##### K-115 — El puzzle dibuja con varios bucles a la vez: cada llamada directa a `draw()` deja otro en marcha — ✅ (medido: spec 140)

- **Cómo salió.** Al revisar uno a uno los `requestAnimationFrame` de K-30 (22 y ningún `cancelAnimationFrame`). Los demás están bien: los de un solo fotograma (añadir una clase en el fotograma siguiente: padre, selección, hijo3, hijo5, `video-intro.html`) no se repiten; los fuegos y el confeti del puzzle y los fuegos de `video-intro.html` terminan por su duración; `_zoomRAF` de `js/funciones-mapa.js` es un limitador (un fotograma por ráfaga de `zoom`), no un bucle.
- **Dónde.** `puzzle.html`: `draw()` pinta y, si el puzzle no ha terminado ni está en pausa, se vuelve a programar con `requestAnimationFrame(draw)`. Pero también la llaman directamente `init()` (al empezar y al reiniciar), `resizePieces()` (en cada `resize` y `orientationchange`, y cuando el `IntersectionObserver` ve que el puzzle se hace visible) y el botón de saltar. Cada llamada directa con el puzzle en marcha deja otro bucle perpetuo encima de los que ya había.
- **Medido** (spec 140, chromium; los fotogramas pendientes del frame del puzzle, que son uno por bucle vivo): 3 bucles con el puzzle recién abierto y a la vista, 6 tras tres `resize` seguidos y 4 tras pulsar reiniciar.
- **Lo que ve el usuario.** El trabajo de dibujo se multiplica por el número de bucles (en un móvil, más batería y más calor), y la animación de la pieza que encaja va más deprisa con cada bucle de más (avanza un paso por llamada).
- **Recomendación (un solo camino; sin otro cambio visible):** `draw()` pinta siempre en el acto, pero solo programa el siguiente fotograma si no hay ya uno pendiente; la reanudación tras la pausa llama a `draw()` como los demás.
- **Aplicada (2026-10-19, `ba98ae4`), la recomendación tal cual.** `fotogramaPendiente` guarda el fotograma programado; `draw()` solo programa otro si no lo hay. Spec 140: UB-1, UB-2 y UB-3 (uno al abrir, uno tras tres `resize`, uno tras reiniciar) en rojo con el puzzle anterior (3, 6 y 4 bucles) y en verde después. Chromium, specs 43, 91, 115, 116, 117 y 140: 53 de 53. Guía: la mecánica del puzzle, la cabecera de sus mensajes (G-86) y la fila del spec. **Censo (regla 3b):** tocado `puzzle.html`, el único frame con un bucle que se reprograma a sí mismo sin fin; lo abren hijo4 y la selección, que no cambian.

##### K-116 — En el padre, `diagnosticarGPS()` dice que el GPS está apagado con el GPS encendido — ✅ (leído; por medir con su spec)

- **Cómo salió.** Al revisar uno a uno los campos de K-08. K-08 ya lo anotaba como «un instrumento que informa la copia equivocada».
- **Dónde.** `js/funciones-mapa.js`, `diagnosticarGPS()` (`:2401`): informa `gpsEstado.activo` y `gpsActivo` desde `estadoMapa.gpsActivo`. La publica el padre como herramienta de consola (`globalThis.diagnosticarGPS`, Script 4). En el padre, ese campo no llega a `true` por el camino normal: `manejarGPSActivar()` delega en `globalThis.activarGPS()` y solo lo marca en la rama de respaldo, cuando `activarGPS` no existe (lo dice el comentario de `sincronizarEstadoGPSConPadre`, `:1086-1100`). El dueño del dato es `estadoPadre.gps.activo` (con `watchId`), que pone `activarGPS()`. En hijo2, que también carga el módulo, `estadoMapa.gpsActivo` sí es su copia local.
- **Método.** Búsqueda desnuda de `estadoMapa.gpsActivo`: tres escrituras (`:2493`, `:2519`, `:2531`) y dos lecturas, las dos en `diagnosticarGPS()` (`:2414`, `:2416`). Leídas las dos ramas de `manejarGPSActivar()`. Sin ejecutar.
- **Lo que ve el usuario.** Nada: es una herramienta de consola. Pero miente a quien diagnostica, que es lo que la regla de «logs que mienten» quiere evitar.
- **Recomendación (sin cambio visible):** que el diagnóstico lea el dato de su dueño en cada frame (en el padre, `estadoPadre.gps.activo && watchId !== null`; en hijo2, `estadoMapa.gpsActivo`), con un spec en rojo antes. Preparada, sin aplicar: el día 19 por la mañana no se podía lanzar Playwright (el usuario estaba usando el equipo).
- **Corrección (2026-10-19, tarde, al repasarla antes de aplicar).** hijo2 no carga `js/funciones-mapa.js`: solo lo importa el padre (`codigo-padre.html:3658, 9345, 14286`; búsqueda de sus imports en los HTML de la raíz y en `js/*.js`; hijo2 lo nombra solo en comentarios), y `diagnosticarGPS()` solo la llama la herramienta de consola del padre (`:14286`). La rama «en hijo2, `estadoMapa.gpsActivo`» de la recomendación no tiene a quién servir, y el ayudante preparado la llevaba: sería código muerto. Y quitar la lectura de `estadoMapa.gpsActivo` deja ese campo sin lectores. Lo que hay detrás es K-122.
- **Aplicada (2026-10-19, `aea2670`), con K-122, como decidió el usuario («juntas»).** `diagnosticarGPS()` lee `activo` (con `watchId`), los permisos y el error de `estadoPadre.gps`, y la posición, la precisión y la última ubicación de `estadoMapa`; sin rama para hijo2. Spec 141: DG-2 en rojo con el módulo anterior (el diagnóstico daba `activo: false` con el GPS activo) y en verde después; DG-1, el control, en verde en los dos. Chromium, los 19 specs que tocan el estado del GPS y el cambio de modo más el 141: 102 de 102 (con el OK del usuario). **Censo (regla 3b):** `git show HEAD:<frame> | grep -c "import.*funciones-mapa\|funciones-mapa\.js['\"]"` da 4 en el padre (tres imports y un comentario) y 0 en la selección, hijo1 a hijo6, `mapa-completo.html`, `puzzle.html` y `video-intro.html`: el módulo es solo del padre.

##### K-117 — Al restaurar el progreso, el elemento actual se fija dos veces, por el id guardado y por el índice guardado — ✅ (leído)

- **Cómo salió.** Al revisar una a una las rutas de K-09 con tres o más escritores (`estado.elementoActual`, seis funciones).
- **Dónde.** `codigo-padre.html`, Script 1. `restoreProgressFromStorage()` llama a `_restoreApplyState(obj)`, que fija `estado.elementoActual` buscando en `elementosIDpadre` el `elementoActualId` guardado (`:4322-4327`), y despacha el `CAMBIO_PARADA` del elemento (`_restoreBroadcast`). Al volver, `_restaurarProgresoRest()` (`:4897-4908`) escribe otra vez `estado.indiceProgreso` y fija `estado.elementoActual = obtenerElementoActual()`, que lo saca del índice.
- **Lo que no cuadra.** Son dos respuestas a la misma pregunta («¿qué elemento estaba en curso?») con dos datos guardados distintos. Con los datos del día en que se guardó, coinciden. Si los datos cambian entre guardar y restaurar (lo que plantea K-51: el progreso no lleva versión), el índice puede apuntar a otro elemento y pisa al del id; después llega el `CAMBIO_PARADA` restaurado, que vuelve a fijarlo por su `paradaId`.
- **Método.** Leídas las dos funciones, `_restoreApplyState`, `_restoreBroadcast` y sus llamadores (búsqueda desnuda de los cuatro nombres). Sin ejecutar.
- **Lo que ve el usuario.** Nada mientras los datos no cambien entre una sesión y la siguiente.
- **Relacionado.** K-51 (la versión de los datos en el progreso guardado), K-89 (la ficha guardada).
- **Pendiente: decisión, con K-51.** Que el elemento lo decida un solo dato (el id, que no se mueve si se insertan elementos) y el índice salga de él. Toca la reanudación: se decide y se mide con K-51.
- **Revisión (2026-10-19, tarde).** Hoy son tres sitios: el id guardado (`_restoreApplyState`), el índice guardado (`_restaurarProgresoRest`, que pisa al primero) y la parada del `CAMBIO_PARADA` restaurado. Dejarlo en el id exige decidir antes qué pasa si ese id ya no está (K-51): hoy lo tapa el índice, y sin él la reanudación se quedaría sin parada. Propuesto al usuario para el repaso de decisiones, con K-51.
- **Decidida (2026-10-19 noche), con K-51 C.** Un solo dato decide al reanudar: el identificador del elemento guardado (`elementoActualId`). El índice y la parada salen de él, y `_restaurarProgresoRest` deja de fijar el elemento por el índice. Si el identificador no está en los datos (no debería: el usuario no cambia paradas con sesiones vivas), un error visible en el log y la rama que ya existe para «sin progreso previo» (`ensureDefaultParada`, la primera parada); las dos cosas, aceptadas por el usuario. Sin preparar: spec nuevo (rojo y verde) y medir la reanudación.

##### K-118 — En los idiomas sin audio, el cartel de llegada tapa la parte alta de la ventana del reto y se queda el primer toque — ✅ (medido en R2.13; sin volver a medir)

- **Cómo salió.** Anotado en R2.13 como «observado, sin entrada» (pasada `aventura` en inglés, 2026-10-12); se le da entrada al repasar qué queda (R2.24).
- **Lo medido entonces.** En un idioma sin audio el reto se abre un segundo después de llegar a la parada, con el cartel de llegada todavía a la vista. Los carteles van en `z-index: 1000060` (`codigo-padre.html`, los cinco `mostrarCartel…`), por debajo de la cabecera y por encima de la parte alta de la ventana del reto: un toque en la primera opción lo recibe el cartel (la opción no se marca y el cartel se cierra 0,11 s después).
- **Lo que ve el usuario.** Toca una opción y no pasa nada; al segundo toque, sí.
- **Opciones, sin recomendar (cambia lo que se ve):** *A)* que abrir el reto cierre los carteles con el mecanismo que ya existe (`_ocultarCualquierCartel()`); *B)* que el reto espere a que el cartel se cierre; *C)* que la ventana del reto quede por encima de los carteles.
- **Relacionado.** K-49 y K-84 (la misma familia de carteles), K-82 (el reto en los idiomas sin audio).
- **Aplicada (2026-10-19, `54b4e9b`), decisión del usuario.** Pulsar el botón de retos (el de hijo3 o el de hijo4, que llegan como `RETO.SOLICITAR_RETO`) o el del audio (`#audio-main-toggle-btn`) cierra el cartel que haya a la vista, con `_ocultarCualquierCartel()`, publicada para Script 2. Comprobado antes de aplicarla, como decía el usuario: el reto solo se abre si se pide (`_enviarRetoMostrar` tiene tres llamadores: la petición del usuario, el siguiente de la cola y la recuperación de hijo4); el «un segundo después de llegar» de R2.13 era el instrumento pulsando al instante. Spec 144: contra HEAD pasaba entero, porque `toHaveCount(0)` esperaba hasta el cierre automático del cartel (10 s); con un plazo de 1 s, CA-1 y CA-2 son rojos contra HEAD y CA-3, el control, verde.

##### K-119 — Paradas seguidas con el mismo nombre: el cartel dice «Ha terminado la parada X — va a empezar la parada X» — ✅ (datos contados)

- **Cómo salió.** Anotado en R2.13 como «contenido, sin entrada»: seis pares en la Aventura1. Contado de nuevo el 2026-10-19 sobre lo que lee el cartel: `marcarParadaCompletada` le pasa el `nombre` del elemento terminado y del siguiente de `DATOS_PADRE[aventura][idioma].elementosIDpadre` (`js/aventuras-ID-padre.js`). Con `nombres-cartel.mjs` (scratchpad; residuo: ningún elemento sin `tipo` ni `nombre`): **61 pares de paradas contiguas con el mismo `nombre`** en las siete aventuras, y el mismo recuento en los doce idiomas (Av1 6, Av2 4, Av3 1, Av4 1, Av5 11, AvFallas 8, Av34km 30). Y seis elementos de la Aventura2 llevan «FRONT» o «BACK» en el nombre en español (`Av2-P-5` a `Av2-P-8` y los tramos `Av2-TR-5` y `Av2-TR-6`: «Iglesia de San Nicolás BACK»). Un primer recuento sobre `js/coordenadas-aventuras.js` daba 74: no es el fichero que lee el cartel.
- **Lo que ve el usuario.** El cartel de transición (`mostrarCartelTransicion`) compone su texto con los dos nombres (`TRADUCCIONES_CARTEL_TRANSICION`): entre dos paradas con el mismo nombre dice que termina y empieza la misma.
- **Opciones, sin recomendar (contenido):** *A)* nombres distintos en los datos; *B)* que el cartel tenga otro texto cuando los dos nombres coinciden; *C)* dejarlo.

##### K-120 — La cola de retos del elemento se prepara por tres caminos, y el vaciado está escrito seis veces — ✅ (leído; por medir)

- **Cómo salió.** Al leer de una en una las ocho funciones que escriben `estado.retoActual` (K-09, resto).
- **Dónde** (`codigo-padre.html`). (1) `_asegurarRetoActualDe(elemento)` (`:11405`), el sitio que dejó K-90: prepara `{ id, cola, colaCompletados }` del elemento si no es ya el suyo, con los retos hechos si el elemento vuelve con su ficha; la llaman la activación del elemento (`:11703`) y el fin del audio (`:12135`). (2) `progresarSiguienteElemento()` (`:9798`) escribe la misma estructura directamente para el elemento siguiente, con `colaCompletados` vacío, sin pasar por (1); como después la cola ya casa, (1) no la vuelve a tocar en la activación. (3) `_hdl_RETO_SOLICITAR` (`:10411-10422`): si `estado.retoActual` no existe lo crea («puede ocurrir si estadoPadre fue recreado con el fallback mínimo») y, si la cola está vacía, la rellena con los retos del elemento («fallback: usar reto_id clásico»), sin decirlo. Y el vaciado `{ id: null, cola: [], colaCompletados: new Set() }` está escrito seis veces (`:7457`, `:7895`, `:9924`, `:10412`, `:10607`, `:12104`).
- **Lo que no cuadra.** Tres sitios deciden qué cola tiene el elemento; el tercero es una reserva muda que, si alguna vez actúa, tapa que los otros dos no la prepararon. Que hoy no actúe no está medido.
- **Método.** `extract-estado.cjs` (las ocho escritoras) y lectura de cada sitio; búsqueda desnuda de `_asegurarRetoActualDe` y del literal del vaciado. Sin ejecutar.
- **Lo que ve el usuario.** Nada, mientras la reserva no actúe.
- **Recomendación, por medir antes (comportamiento en AVENTURA):** que la cola la prepare solo (1), también al avanzar; que (3) no la rellene sino que lo diga con un `error` (o se quite, si una sonda demuestra que no se alcanza); y una función para el vaciado. Con spec en rojo antes, como K-90.
- **Aplicada (2026-10-19, `54b4e9b`).** Lo medido al aplicarla: la reserva (3) hacía dos cosas, preparar callada la cola y repetir los retos ya hechos (volver a pulsar con todos hechos empieza por el primero, K-82). Con la cola de otro elemento enseñaba el reto de ese otro elemento sin decir nada: spec 145, RC-1 rojo contra HEAD. Hoy: `_asegurarRetoActualDe` es el único sitio que prepara la cola, también al avanzar; si al pedir un reto la cola no es la del elemento, un `error` «(K-120)», y se prepara por ahí; la repetición, escrita como tal; el vacío, en `_vaciarRetoActual()` (cuatro llamadas); y fuera dos guardas que no actuaban (`estadoPadre` se asigna una sola vez, `codigo-padre.html:4043`, ya con `retoActual`, y nada lo borra). Spec 145: RC-2 y RC-3, los controles, verdes contra HEAD y ahora. Al verlo en rojo salió K-124.

##### K-121 — El padre carga el índice de aventuras por dos caminos, y la selección lo pide con una URL distinta en cada visita — ✅ (medido: spec 137, NI-3 y NI-4)

- **Cómo salió.** El usuario, sobre K-112 (2026-10-19): «aseguremos que no falte el dato». La reserva ruidosa de K-112 solo actúa si el índice no está; quedaba ver cuándo puede no estar.
- **Dónde.** `codigo-padre.html`, dos cargas del mismo módulo: la comprobación de la aventura guardada lo importaba si aún no estaba, antes del diálogo de reanudación (con un `error` si fallaba), y la fase 2 (`__cargarDatosAventuraDiferidos`) lo publicaba con los datos de pago, en P15 o al reanudar. Sus lectores: la ventana de compra (`verificarTimeoutAventura()`, `js/reciclaje-digital.js:141`, desde la comprobación de la aventura guardada y desde la reanudación), `_nombreDeAventura()` y `_nombreDeIdioma()` (diálogo de reanudación, modal de fin y cinco carteles) y el reloj de AVENTURA (`tiempoEstimado`, Script 2). Ninguno corría antes de una de las dos cargas, pero eso lo garantizaba cada camino por su cuenta. Y `En-busca-del-tesoro.html:2270` lo importaba con `?v=${Date.now()}`: el service worker sirve los módulos desde la red con `no-store` y guarda la respuesta con la URL como clave, quitando solo `_v` (`sw.js:282-319`), así que cada visita dejaba en su caché, que no tiene límite, una copia más del índice.
- **Lo que no cuadra.** Dos sitios deciden cuándo existe el índice en el padre. El parámetro de la selección no hace falta (el SW ya va a la red sin caché HTTP) y llena la caché.
- **Método.** Búsqueda desnuda de `__vv_INDICE_AVENTURAS`, `__vv_MAPEO_IDIOMAS` e `indice-aventuras` en todo el repositorio, fuera de `tests/`: los dos cargadores del padre, la selección, `js/data-loader.js` (`cargarIndice()`, sin llamadores) y los lectores. Leídos los dos caminos a `verificarTimeoutAventura()`: la comprobación de la aventura guardada y `_restoreCheckTimeout` ← `restoreProgressFromStorage` ← `_restaurarProgresoRest` ← `ejecutarRestauracionAventura`.
- **Lo que ve el usuario.** Nada.
- **Recomendación (sin cambio visible):** que el padre lo cargue en un solo sitio, la fase 1 del arranque, antes que cualquier lector; que la selección lo importe sin parámetro; y que `npm run verificar-datos` compruebe que el índice trae el nombre y el tiempo de cada aventura y el nombre de cada idioma.
- **Aplicada (2026-10-19, `7a92883`), la recomendación tal cual.** El índice entra en el `Promise.all` de la fase 1 y se publica en sus dos globales; fuera la carga perezosa y la de la fase 2. Spec 137: NI-3 (recién arrancado, sin aventura elegida, el padre ya tiene el índice, y es el mismo módulo que importa cualquiera) y NI-4 (la selección lo importa sin parámetros), en rojo con el código anterior y en verde después. `verificar-datos`, comprobación 11: 13 de 13; con el nombre de la Aventura2 y el tiempo de la Aventura3 rotos a propósito, falla nombrando las dos, y el fichero vuelve byte a byte. Chromium, specs 01, 02, 41, 46, 82, 127, 128, 135 y 137: 58 de 58 (lanzados sin pedir el OK del usuario en ese momento; dicho en el chat). Guía: la fase 1 con el índice, la fase 2 en P15 o al reanudar (G-87), §18.3, §22.12 (la fila del índice) y §37.2. **Censo (regla 3b):** tocados el padre y la selección. Los otros nueve frames no cargan ni leen el índice: `git show HEAD:<frame> | grep -c "indice-aventuras\|INDICE_AVENTURAS\|MAPEO_IDIOMAS"` da 0 en hijo2 a hijo6, `mapa-completo.html`, `puzzle.html` y `video-intro.html`, y 1 en hijo1 (un comentario, `extrainfo-hijo1.html:921`).
- **Fuera de esta entrada.** La ventana de compra con una aventura guardada que no esté en el índice (una retirada entre una sesión y otra, o un dato guardado roto) sigue dándola por no caducada con un `warn` (fila 108, decide el usuario). Por el camino salieron G-87 y G-88.

##### K-122 — En el padre, el estado del GPS tiene dos dueños: `manejarGPSActivar()` escribe `estadoMapa` solo en dos ramas que nunca corren, y el espejo copia esos valores de partida sobre los del padre — ✅ (leído; búsqueda desnuda)

- **Cómo salió.** Al repasar K-116 antes de aplicarla (2026-10-19, tarde): el ayudante preparado tenía una rama para hijo2, y hijo2 no carga el módulo.
- **Dónde.** `js/funciones-mapa.js` solo lo carga el padre. `manejarGPSActivar()` (`:2478`) la llama solo `manejarCambioModoMapa()` al pasar a AVENTURA (`:2574`), y a esta el padre en cada cambio de modo (`codigo-padre.html:7497`). Tiene tres ramas: (1) en el padre con `globalThis.activarGPS` definida, delega en ella y sincroniza: es la única que corre, porque el bloque clásico del principio del padre la define siempre (`codigo-padre.html:65`, con su cola hasta que llega la real); (2) en el padre sin `activarGPS`, «mantener comportamiento previo (marcar activo)»; (3) «si estamos en un iframe», envía `NAVEGACION.GPS.ACTIVAR` y marca el estado local. (2) y (3) no corren nunca, y son las únicas que ponen `estadoMapa.gpsActivo` y `estadoMapa.gpsPermisos` a `true` (`:2493-2495`, `:2519-2521`). Así, en el padre `estadoMapa.gpsActivo` se queda en `false` (solo lo lee `diagnosticarGPS()`: K-116) y `estadoMapa.gpsPermisos` en `null` (`:399-402`). `sincronizarEstadoGPSConPadre()` (`:1087`), que corre con cada posición GPS (`:2881`) y en otros ocho sitios, copia `estadoMapa.gpsPermisos` y `estadoMapa.gpsError` sobre `estadoPadre.gps.permisos` y `.error`, que el padre escribe por su cuenta en la activación (`codigo-padre.html:5346, 5409, 5527-5530, 5665, 5680, 5754-5764, 5810-5820`). Su comentario dice que esos campos «sí son propiedad de estadoMapa».
- **Lo que no cuadra.** Dos dueños para los permisos y el error del GPS en el padre, y el que gana es el que no se actualiza. Dos ramas del adaptador que no corren. Un campo, `estadoMapa.gpsActivo`, cuyo único lector es un diagnóstico que por eso miente.
- **Método.** Búsqueda desnuda de los imports de `funciones-mapa`, de `manejarGPSActivar`, `diagnosticarGPS`, `estadoMapa.gpsActivo`, `.gpsPermisos` y `.gpsError`, y de `permisos` en todos los frames: nadie lee `estadoPadre.gps.permisos` ni `estadoPadre.gps.error` (solo se escriben; los dos `throw` de `activarGPS()` leen el error que acaban de poner). `estadoMapa` no sale del módulo: ni se exporta ni está en `globalThis.funcionesMapa` (`:3226-3248`); ningún spec lo lee (el 52 lo nombra en comentarios) y ninguno llama a `diagnosticarGPS`. `NAVEGACION.GPS.ACTIVAR` lo envía también hijo2 (`coordenadas-hijo2.html:888`): sin la rama (3), el handler del padre conserva su emisor. `enviarMensaje` se sigue usando en el módulo (cinco sitios más). Sin ejecutar.
- **Lo que ve el usuario.** Nada: esos campos solo los lee el diagnóstico de consola.
- **Relacionado.** K-116 (el diagnóstico), K-08 (mismo dato, dos dueños), K-41 (dejó el espejo como diseño), y la fila «con ancestro leído entero» de la revisión de K-09: `estado.gps.permisos`, «por leer», queda leído aquí, sin lectores.
- **Recomendación (sin cambio visible), con K-116:** un solo dueño del estado del GPS en el padre, `estadoPadre.gps`. El diagnóstico lee de ahí `activo` (con `watchId`), `permisos` y `error`; `manejarGPSActivar()` se queda en su rama viva (delegar en `activarGPS()` y sincronizar); fuera `estadoMapa.gpsActivo`, `.gpsPermisos` y `.gpsError` y su copia en el espejo, que sigue copiando lo que sí escribe el mapa (posición, precisión, última ubicación, `visualActivo` y `proximidadReal`). Spec 141 en rojo antes. Decide el usuario si va junto con K-116 o detrás.
- **Aplicada (2026-10-19, `aea2670`), con K-116, la recomendación tal cual.** `manejarGPSActivar()` queda en su rama viva; fuera `estadoMapa.gpsActivo`, `.gpsPermisos` y `.gpsError`, y su copia en el espejo, que copia solo lo que escribe el mapa. Spec 141, DG-3: tras activar y una sincronización (`limpiarRecursos()`), `estadoPadre.gps.permisos` valía `null` con el módulo anterior (rojo) y vale `true` después (verde). Guía: §11 (un dueño por campo), la nota «hub + adaptador», la fila del spec 52, la del 141 y el recuento de specs; al día el JSDoc de `activarGPS()` y la cabecera del spec 52.

##### K-123 — El padre ejecuta `js/suppress-warnings.js` dos veces: como script clásico y como módulo — ✅ (leído)

- **Cómo salió.** Al ver cómo carga cada página los scripts que tocan el almacenamiento, para la propuesta de R2.10.7 (2026-10-19).
- **Dónde.** `codigo-padre.html:47` lo carga como script clásico (`<script src="js/suppress-warnings.js" defer>`), y Script 1 (`:3926`) y Script 2 (`:9223`) lo importan como módulo (`await import('./js/suppress-warnings.js')`; el navegador evalúa el módulo una vez). El fichero es una función que se llama a sí misma y no tiene guarda (leído entero, 171 líneas): corre dos veces. Cada vuelta guarda los `console.warn`, `console.error` y `console.debug` que encuentra como «originales» y los envuelve con su filtro; la segunda envuelve lo que dejó la primera, y la `__vv_restaurarConsola()` que queda publicada (la de la segunda) devuelve la consola a la primera envoltura, no a la de verdad. Las otras seis páginas que lo cargan (selección, hijo1 a hijo5) lo hacen una vez, como script clásico.
- **Lo que no cuadra.** Dos caminos para cargar el mismo script en el padre.
- **Método.** Búsqueda desnuda de `suppress-warnings` en las páginas de la raíz y en `js/`; leído el fichero entero.
- **Lo que ve el usuario.** Nada: filtra mensajes de consola. Los dos `import` ya figuran en K-53 (imports en posición fatal).
- **Recomendación (sin cambio visible):** un solo camino, el `<script src>` del `<head>` como en las demás páginas, y fuera los dos `import`. Toca el mismo fichero que la unificación del almacenamiento (R2.10.7, su lectura por el alias `ls`): conviene hacerlo con ella. Decide el usuario.
- **Aplicada (2026-10-19, `54b4e9b`), con R2.10.7.** Fuera los dos `import`: el padre lo carga una vez, como las demás páginas. Spec 143: FC-1 (restaurar la consola deja la original) rojo contra HEAD; FC-2 es estático (su rojo, con `git show HEAD`: dos `import`).

##### K-124 — pre-intro1 y pre-intro2 comparten `parada_id: "null"` (texto) en las siete aventuras — ✅ (contado en español)

- **Cómo salió.** Al ver en rojo el spec 145 (K-120): el ensayo elegía los dos primeros elementos con reto, y la búsqueda del handler devolvía el otro.
- **Dónde.** `js/aventuras-ID-padre.js`: los dos elementos de antes de la introducción (`pre-intro1`, con el puzzle `PZ-intro`, y `pre-intro2`, con el reto `R1-Av1-es` en la Aventura1) llevan `parada_id` con el texto `"null"`. `_encontrarParadaEnElementos` (la primera con esa `parada_id`) devuelve siempre `pre-intro1`.
- **Método.** Script en Node sobre `DATOS_PADRE` (`paradas-repetidas.mjs`, scratchpad): `parada_id` repetidas en español, por aventura: solo `"null"`, dos veces, en las siete. Los otros idiomas, sin contar.
- **Lo que ve el usuario.** Nada: el puzzle de P6 y el R-1 de P8 se hacen en la selección, y el padre nunca tiene uno de esos dos elementos como actual. Leído: la aventura empieza en el elemento de tipo `inicio` (`ensureDefaultParada`) y avanza siempre hacia delante. Solo hijo5, herramienta de desarrollo, podría elegirlos a mano (sin comprobar).
- **Pendiente.** Contar los otros idiomas, leer si el padre activa alguna vez un elemento `pre-intro`, y decidir el dato (`parada_id` vacía de verdad, o la que le toque). Decide el usuario.

##### K-125 — Volver a elegir idioma: el idioma guardado se borra en cinco de las ocho vueltas y se queda en las otras tres — ✅ (leído; cada recarga y cada salto a la P1 o a las banderas, clasificados)

- **Cómo salió.** Hablando de K-19 con el usuario (2026-10-19 noche): las dos «elegir otra» borran `vv_idioma` y el «no» del reto R-2 no lo borra. El usuario: «si se borra el idioma se borra en todas y si se mantiene se mantiene en todas». La P1 (logos y flecha) y las banderas (P2) no llevan texto, y el idioma se elige justo ahí: lo único que se decide es qué queda guardado.

Las ocho vueltas, a la P1 (desde la que se sigue a las banderas) o directamente a las banderas:

| # | Vuelta | Cómo vuelve | `vv_idioma` |
|---|---|---|---|
| 1 | «Elegir otra» del diálogo de vuelta rápida (atrás, o vuelta de un enlace externo) | `_elegirOtra`: `_borrarAventuraGuardada({ conIdioma: true })` y recarga (`codigo-padre.html:4678, 4688`) | se borra |
| 2 | «Otra aventura» del modal de fin, y su red de abandono | `_finalizarYLimpiar`: `limpiarDatosAventura()` y recarga (`:8207, 8212`) | se borra (limpieza total) |
| 3 | «Otra aventura» y ✕ del modal de tiempo agotado, y su red de abandono | `_limpiarYRecargarTiempoAgotado` (`:12949, 12954`) | se borra (limpieza total) |
| 4 | «Terminar», en los dos modales | la despedida (`?despedida=1`, `:8240, 12980`), que lee el idioma para hablar en él (`En-busca-del-tesoro.html:2717`) y acaba con `limpiarDatosAventura('completada')` y `location.replace('codigo-padre.html')` (`:1942, 1954`) | se queda hasta la despedida y se borra al acabarla |
| 5 | «Elegir otra» del diálogo de reanudación | `ejecutarElegirOtra`: `_borrarAventuraGuardada({ conIdioma: true })`, reinicio a mano y `NAVEGACION_PANTALLA` a la P1 (`codigo-padre.html:4574, 4611`); con K-19, borrar y recargar | se borra |
| 6 | «No» en el reto R-2 (P16) | `SELECCION.REINICIAR` al padre (`En-busca-del-tesoro.html:2531`; `_hdl_SELECCION_REINICIAR`, `codigo-padre.html:12442`, solo baja `_codigoValidadoP14` e `_iframesPreCargadosP15`), `reiniciarSeleccion()` y `mostrar(1)`, sin recargar | se queda |
| 7 | «No, cambiar» en la confirmación del idioma (P3) | `mostrar(2)` (`En-busca-del-tesoro.html:771`) | se queda |
| 8 | «No» del aviso de que la aventura no tiene audio en ese idioma (P9) | `rechazarSinAudio()`: `mostrar(2)` (`:2189-2192`) | se queda |

- **Método.** Búsqueda de toda navegación o recarga de página (`location.reload`, `.replace`, `.assign`, `.href =` y `location =`) en los ficheros de la app (fuera `tests/`, `tools/`, `docs/` y `node_modules/`), y de todo `mostrar(1)`, `mostrar(2)` y `mostrar(<variable>)` en la selección; cada resultado, clasificado. Los que no son una vuelta: la regla de HTTPS del padre (`codigo-padre.html:25`), `app-settings:` de iOS (`:6552`), el último recurso si no se puede construir el modal de tiempo agotado (`:13010`: aviso y recarga, que vuelve a sacar el modal), el botón de versión nueva (`:14446`), la selección abierta suelta (`En-busca-del-tesoro.html:18`), `index.html`, el ↺ de `video-intro.html` (recarga solo el vídeo, `:527, 1912`) y dos falsos positivos (`geolocation=` en `codigo-padre.html:16` y en `js/server.js:94`). `mostrar(<variable>)`: solo el handler de `NAVEGACION_PANTALLA` (`En-busca-del-tesoro.html:3204`). Atrás del navegador: solo actúa con la aventura en marcha (`codigo-padre.html:4798`) y abre el diálogo del caso 1.
- **Quién escribe y quién lee `vv_idioma`** (búsqueda desnuda de `CLAVES` y de `vv_idioma` en `.html` y `.js`). Escritor único: `_hdl_SELECCION_IDIOMA_SELECCIONADO` (`codigo-padre.html:12421`), al tocar una bandera. Lectores: `idiomaDeLaInterfaz()` del padre (`:103-106`; la pantalla de carga, el aviso de fallo de carga y el banner de versión nueva) y la despedida (`En-busca-del-tesoro.html:2717`).
- **Decisión del usuario (2026-10-19 noche): A, borrarlo en las ocho.** Cambian el 6, el 7 y el 8. El padre, único escritor, lo borra al recibir `SELECCION.REINICIAR`, que la selección ya envía en el 6 y pasa a enviar en el 7 y el 8. En esas dos pantallas el aviso no hace nada más: `_codigoValidadoP14` e `_iframesPreCargadosP15` solo se ponen a `true` al mostrarse la normativa (P15, `codigo-padre.html:12518, 12521`), y después de la P15 la única vuelta es el «no» del R-2 (la búsqueda de `mostrar(` de arriba). Descartada B (dejarlo en las ocho): la limpieza total del final tendría que dejar el idioma, y la huella de 0 bytes de `js/reciclaje-digital.js` pasaría a ser «0 bytes salvo el idioma». Ningún texto que ve el usuario promete los 0 bytes (búsqueda de «borra», «elimina», «dispositivo» y parecidas en `js/terminos-aventuras.js`, `js/normativa-cumplimiento.js`, `js/agradecimientos-aventuras.js` y los textos en español de `js/traducciones-ui.js`, donde están la despedida y las preguntas frecuentes).
- **Fuera, a propósito.** La copia en memoria del padre (`globalThis.idiomaSeleccionado`: 73 apariciones, en `codigo-padre.html`, `js/controladores-padre.js` y `js/funciones-mapa.js`) no se toca: la sustituye la siguiente bandera, y vaciarla obligaría a revisar esos usos con los hijos vivos tras la P15 (caso 6). Entre la vuelta y la siguiente bandera, en los casos 6 a 8, `idiomaDeLaInterfaz()` sigue hablando en el idioma anterior; ahí solo podría salir el banner de versión nueva.
- **Preparada con K-19, sin aplicar (2026-10-19 noche).** Padre: `_hdl_SELECCION_REINICIAR` borra el idioma guardado (su log conserva «Flags P14/P15 reseteados», que busca el spec 74). Selección: `_avisarReinicioAlPadre()`, el único envío de `SELECCION.REINICIAR`, que usan el «no» del R-2 y `volverAElegirIdioma()` («No, cambiar» de P3 y `rechazarSinAudio()`). Spec 147 (VI-1 a VI-3), rojo esperado contra HEAD: el idioma sigue guardado. K-19 no cambia en esto: «elegir otra» sigue borrando el idioma.
- **Aplicada (2026-10-19 noche), con K-19, sin pasar todavía por los navegadores.** `_hdl_SELECCION_REINICIAR` borra `vv_idioma`; la selección envía `SELECCION.REINICIAR` desde una sola función, `_avisarReinicioAlPadre()`, que usan el «no» del R-2 y `volverAElegirIdioma()` (el ✗ de P3 y `rechazarSinAudio()`). Spec nuevo 147 (VI-1 a VI-3). Guía: §7 (P3 y el aviso sin audio), §8, §9, §10.19 (`vv_idioma`), §24.1 (caso adicional A), §25.2 y §26.
- **Comprobada y en commit (2026-10-20, `de801ba`).** Rojo contra HEAD: VI-1, VI-2 y VI-3 caen, porque el idioma sigue guardado. Verde en chromium, con un solo proceso: 67 de 67 en los specs 146, 147, 19, 25, 74, 79, 121, 127, 128 y 135.

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
- **Corrección (2026-10-07, R2.12).** «Un solo camino» vale para los llamadores de `retryUntilAvailable` (seis hoy); fuera del
  helper hay doce esperas escritas a mano (E10, K-62) y una promesa sin plazo (K-72).
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
- **`APP_SHELL` y ids.** `sw.js`: 61 entradas, las 61 existen en disco y ninguna se repite (un 404
  en esa lista haría fallar el `addAll` de la instalación del service worker). Ids estáticos de los
  17 `.html`: 193 distintos, ninguno repetido dentro de su documento. Y los 14 nombres de
  `globalThis` que leen los specs sin que producción los asigne, en K-32 (uno solo importa).

- **Lo que la guía cita de la interfaz y del arranque (G-44).** Ids de DOM (`#x`), clases (`.x`), claves de `localStorage` y `sessionStorage`
  (`vv_x`) y parámetros de URL (`?x=`) citados entre backticks, buscados como cadena en los ficheros rastreados con código: todos aparecen
  (los dos que no, `.browserslistrc` y `.gitattributes`, son ficheros). Las frases «Script N» de la guía sobre funciones de `codigo-padre.html`
  (55 comprobadas contra el bloque `<script type="module">` donde está cada definición): ninguna sitúa una función en otro bloque; las seis
  que el script marcó nombran en la misma línea una función de otro bloque y son falsos positivos leídos a mano.
- **Lo que la guía da como valor de una constante (barrido de cierre).** Las constantes en `MAYUSCULAS_CON_GUION_BAJO` que la guía cita entre backticks, fuera de los bloques
  de código, con un número a continuación (`(3)`, `= 15`, `20 s`, `10.000ms`): 24 menciones de 21 constantes. Búsqueda del identificador desnudo en `*.html` y `js/*.js` y
  lectura de su declaración: las 15 que son plazos, radios y contadores coinciden con el código (`MAX_LATIDOS_SIN_RESPUESTA` 3, `PLAZO_MAX_HANDLER` 20 000,
  `RADIO_PARADA` y `RADIO_LLEGADA_PARADA_M` 15, los `RECORDATORIO_*` 10 000, 20 000 y 2 000, `MAX_INTENTOS_AVISO_PROGRESO` 5, `MAX_REINTENTOS_GPS` 3, `INTERVALO_METRICAS`
  30 000 ms, `MAX_REINTENTOS_ENVIO_AUDIO` 2) y las seis `TRADUCCIONES_*` dicen 12, que es lo que tienen (`js/traducciones-ui.js:396, 418, 448, 463, 530, 681`,
  contadas con el parser). Límite: solo ve el valor escrito junto al nombre; un umbral citado sin su nombre («50 m») no se compara.

### R2.4 Las mediciones (hechas el 2026-10-02)

Las doce mediciones que la ronda 2 dejó "POR MEDIR" (M-1 a M-12) y nueve más que salieron al arreglar
(M-13 a M-21) se ejecutaron el 2026-10-02 —M-19 a M-21, pasada la medianoche, el 2026-10-03—, salvo M-8, que es de campo. Se hicieron con el OK del
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
| M-19 | K-32 | (nueva, salió de la tanda de cuatro navegadores) El spec `114` antes (el de `HEAD`) y después de bloquear el service worker, con tres roturas de `js/data-loader.js` provocadas una a una (`return resp.ok` → `return false`, → `return true`, corte de 2500 → 20000 ms; el módulo se restaura siempre y `git diff --quiet` da 0), en chromium, firefox, pixel5 e iphone12 con un solo worker | Antes: sin rotura, MD-2 rojo en firefox e iphone12 (recibe `false`); `→ false`, MD-2 rojo en los cuatro; `→ true`, MD-3 y MD-4 rojos en los cuatro y MD-5 también en firefox e iphone12; corte de 20000, MD-5 rojo solo en chromium y pixel5 (en firefox e iphone12 sigue verde). Después: sin rotura, 20 de 20; `→ false`, MD-2 rojo en los cuatro; `→ true`, MD-3 y MD-4 rojos en los cuatro; corte de 20000, MD-5 rojo en los cuatro. ✅ confirmada y corregida (`03408b7`) |
| M-20 | K-49 | (nueva, salió de la comprobación en rojo de CM-6) (1) Una sonda desechable en chromium que envuelve `classList.remove` de los carteles y neutraliza o no `globalThis._ocultarTodasPantallasDistanciaGPS`: con el cartel `gps-out-of-range-overlay` visible y con los seis carteles visibles tras entrar en AVENTURA, AVENTURA → CASA. (2) El CM-6 de antes (un cartel) y el de ahora (seis) con roturas de `codigo-padre.html` provocadas una a una —quitar la llamada explícita de la rama CASA (`void 0`), o cortar `_gestionarGpsOverlays` en CASA con un `return;`; el fichero se restaura siempre y `git diff --quiet` da 0—, en chromium, firefox, pixel5 e iphone12 | (1) Con el cartel de bloqueo, `classList.remove('show')` se llama dos veces sobre él: desde `_ocultarOtrasPantallasDistanciaGPS` (llamada explícita) y desde `hideGpsOutOfRangeOverlay` (`_gestionarGpsOverlays`); con la explícita neutralizada lo cierra igualmente el segundo; entrar en AVENTURA no lo cierra. Con los seis visibles: ninguno queda visible tras CASA, el de bloqueo cerrado dos veces y los otros cinco una; con la explícita neutralizada quedan abiertos `foto-perdido`, `foto-lejos`, `foto-desviado`, `foto-fuera-rango` y `gps-precision`. (2) Antes: sin rotura 4 passed; sin la llamada explícita 4 passed (el test no ve la rotura). Después: sin rotura 4 passed; sin la llamada explícita 4 failed; sin `_gestionarGpsOverlays` en CASA 4 passed (el otro camino cubre los seis y nada ve esa pérdida). ✅ confirmada; test corregido (`066833e`), decisión de producto abierta |
| M-21 | K-32 | (nueva, salió de la tanda de cuatro navegadores) El spec `30` CM-6 en firefox. (1) Un escenario mínimo desechable —cambio de modo real a AVENTURA y a CASA con el padre real, un `getCurrentPosition` y `navigator.permissions.query` antes y después—, en ejecuciones intercaladas de tres formas de dar el permiso: con la página ya cargada (`context.grantPermissions()` + `setGeolocation()`, como hacía CM-6), con las mismas llamadas antes de navegar (como los otros 29 puntos de la suite) y en las opciones del contexto (`test.use`). (2) El spec `30` con `01-fase1-boot` y `02-global-variables` delante, que es donde fallaba, antes y después del arreglo | (1) Con la página ya cargada: 10 de 27 rojos (7 de 15 y 3 de 12). En los 10, `navigator.permissions.query` devolvía `prompt` justo después de `grantPermissions()` y seguía en `prompt` 32 s después; el cambio de modo se quedaba en «Iniciando watchPosition...» hasta el aviso de 20 s del bus y un `getCurrentPosition` directo con `timeout: 8000` no volvía en 12 s; en los 17 verdes, `granted`. Antes de navegar: 0 de 12. En el contexto: 0 de 27 (15 + 12), más 0 de 6 en una tanda previa sin intercalar. (2) Antes: 4 de 6 rojos (el spec solo: 1 de 6); después: 0 de 16 (10 con el permiso en el contexto y 6 con, además, el CM-6 de seis carteles). ✅ confirmada y corregida (`066833e`) |
| M-22 | K-50 | (nueva, salió de la revisión de R2.9, el 2026-10-03) Por el camino de activación de producción, con el padre real y los cinco hijos reales (`hijosPreparados` con al menos 5): activar A (`distribuirDatosAventura('Aventura1', 'es')` y `SISTEMA.CAMBIO_MODO` a `aventura`, como la activación), abandonar con el clic real de «Elegir otra aventura» del diálogo de vuelta rápida, elegir B (`SELECCION.AVENTURA_SELECCIONADA` por `despacharLocal` y `distribuirDatosAventura('Aventura2', 'es')`) y activarla (`CAMBIO_MODO` a `aventura`); control: `casa` y de nuevo `aventura` (el recorrido del otro camino de activación, ver §24). Se anotan `estado.modo.actual`, `paradaActual`, `elementoActual`, los `NAVEGACION.CAMBIO_PARADA` que recibe hijo2 y los logs de las ramas, en chromium con el stub de MapLibre y la geolocalización concedida antes de navegar | Tras activar A: `aventura` y `Av1-P-0`. Tras «Elegir otra aventura» no cambia nada (`aventuraSeleccionada` pasa a `null`). Al activar B: «Modo ya establecido a 'aventura' — resincronizando hijos sin repetir efectos» y «Ya existe paradaActual: Av1-P-0»; la parada sigue en `Av1-P-0`, que no está en las 67 paradas de B (la primera es `REF-1`), y hijo2 no recibe ningún `CAMBIO_PARADA` nuevo (solo `Av1-P-0`). Control: corre `LIMPIAR_RECURSOS`, la parada pasa a `Av2-P-0` y hijo2 recibe `Av2-P-0`; además, al entrar en CASA se congela la parada de A y al volver se despacha contra los datos de B («Parada con ID Av1-P-0 no encontrada en DATOS_PADRE»). ✅ confirmada; decisión abierta |
| M-23 | K-85 | (2026-10-13; sonda desechable en chromium, con el padre y los hijos reales en AVENTURA, en inglés, sobre `Av1-P-1`) La parada se completa por sus caminos —dos lecturas en el punto, audio saltado y `RETO.COMPLETADO` desde hijo4— y queda lista para avanzar, con «avanzar» encendido en hijo2. Después: (a) recarga de la página y reanudación por el diálogo real («Continuar»); simulación declarada: `vv_aventura_iniciada` lo escribe la sonda con la forma de `codigo-padre.html:12641`, porque la parada no se activó por P15; `vv_progreso` y `vv_paradas_completadas` son los que escribió el padre. (b) hijo2 a `about:blank` y recarga por el supervisor del bus. En los dos casos se rehace la parada igual que la primera vez | (a) Tras reanudar: elemento `Av1-P-1`, presente en `paradasCompletadas`, `paradaListaParaAvanzar: false`, ficha nueva con llegada, audio y reto a `false`, «avanzar» apagado. Rehecha (llegada, audio, reto): la ficha se borra, `paradaListaParaAvanzar` sigue en `false`, «avanzar» sigue apagado y a hijo2 no le llega ningún `CONTROL.*` de `btnAvanzar`. (b) Tras recuperarse hijo2, lo mismo en cada paso. ✅ confirma la lectura |
| M-24 | K-87 | (2026-10-13; misma sonda) El rescate por su camino real (asistente, botón y dos confirmaciones, como el spec 72) sobre `Av1-P-1`, con la llegada sin confirmar y el reto sin resolver; el estado se pone a mano, como en el spec 72. Dos casos: audio terminado (`retoActual.disponible: true`) y, de control, audio sin terminar (`disponible: false`) | Con el audio terminado: `_estadoRescate()` dice `puede: true`, sale «Rescate utilizado…», el punto queda en `paradasCompletadas` y el gasto apuntado, pero `paradaListaParaAvanzar` queda en `false` y a hijo2 no le llega nada. Control, con el audio sin terminar: `paradaListaParaAvanzar: true` y a hijo2 le llega `CONTROL.HABILITAR` (`parada_completada`). ✅ confirma la lectura |
| M-25 | K-84 | (2026-10-13; sonda desechable en chromium, con el padre y los hijos reales en AVENTURA sobre `Av1-P-1`; cuatro pasadas) El usuario pasa de la parada a Madrid con lecturas reales de geolocalización (`context.setGeolocation`, una por segundo, `accuracy` 8); el reloj de tres minutos de la comprobación se neutraliza como en el spec 56 (`__VV_5KM_LAST_CHECK = null` y `_vv_check5km`), y siguen llegando lecturas. Un observador de mutaciones apunta, con su instante, qué pantallas de distancia llevan la clase `show`; en la cuarta pasada se dejan tres segundos sin lecturas tras declararse el bloqueo | Igual en las cuatro. Desde la primera lectura en Madrid está a la vista `foto-perdido-overlay`. La primera lectura real cuenta como primera comprobación; con dos forzadas más se declara el bloqueo y se muestra `gps-out-of-range-overlay`, que se crea entonces, con `#gps-error-action` a la vista y sin `display` en línea. Sin lecturas nuevas sigue a la vista (tres segundos, cuarta pasada); la primera lectura real que llega lo sustituye por `foto-perdido-overlay` (a los 8, 10 y 8 ms del bloqueo en las tres primeras pasadas, que la mandan enseguida; a los 5 ms de mandarla en la cuarta). En los diez segundos siguientes, con una lectura por segundo, no vuelve a tener `show`, y otra comprobación con el bloqueo ya declarado tampoco lo muestra. hijo2 manda dieciséis `GPS.RESTRINGIDO` en los dieciséis segundos de lecturas. «Avanzar» ya estaba apagado (la parada estaba pendiente): la sonda no mide el efecto del bloqueo en ese botón |
| M-26 | K-91 | (2026-10-13; sonda desechable en chromium, generada del spec 123 para reutilizar sus ayudantes del rescate: el asistente, su botón y las dos confirmaciones, con el estado de `Av1-P-1` puesto a mano como en el spec 72 —audio terminado, reto sin resolver, llegada sin confirmar—) Dos pasadas: el rescate y después «avanzar» con el botón real de hijo2, (a) sin recargar, de control, y (b) recargando la página y reanudando por el diálogo real entre el «Sí» y «avanzar» (`vv_aventura_iniciada` lo escribe la sonda, como en M-23) | (a) Tras el rescate: punto completado, listo para avanzar, `_rescateGastoPendiente` con la clave `padre-P1`, `tramoSkipsUsados` 0 en memoria y en `vv_progreso`; tras avanzar a `Av1-TR-2`: 1 en los dos sitios. (b) Tras el rescate, igual; tras recargar y reanudar: completado, listo para avanzar, sin apunte, 0 y 0; tras avanzar a `Av1-TR-2`: 0 en memoria y 0 en `vv_progreso` |
| M-27 | K-92 | (2026-10-13; sonda desechable en chromium, con el padre real y su pantalla de selección real en el iframe `seleccion`) Se abre la pantalla 8 con `mostrar(8)`, se espera a que el reto pinte sus opciones y se contesta una por una con el botón real `btn-verificar-reto-r1`, leyendo en cada intento el `display` y el `color` calculados del `.tick` y de la `.x` de esa opción, y sus clases. Control al final: se les ponen a mano las clases `correcto` e `incorrecto` y se vuelve a leer | Opciones 0, 1 y 2 (fallo): la ✗ visible con `color: rgb(0, 0, 0)`; opción 3 (acierto): el ✓ visible con `rgb(0, 0, 0)`; clases `x` y `tick`; el texto de la caja, `rgb(0, 0, 0)`. Control: con la clase, `rgb(26, 92, 46)` y `rgb(155, 28, 28)` |
| M-28 | K-94 | (2026-10-13; sondas desechables y los specs 01, 02 y 04, en chromium e iphone12, con un muestreador que apunta cada segundo la zona térmica `\_TZ.HPTZ`, la carga de CPU y, por nombre, los procesos de navegador de Playwright con los núcleos que gastan, y que para la pasada a 85 °C) Seis pasadas: los tres specs en chromium y en iphone12; una página del padre abierta 15 s, cerrada, y cinco abiertas y cerradas seguidas, con y sin el stub de MapLibre; cinco cerradas tras `sistemaInicializado` frente a cinco cerradas nada más pasar la FASE 1; los tres specs con `about:blank` antes de cerrar; y los tres specs y el proyecto entero con la espera al arranque terminado | Sin la espera, iphone12: 17 `WebKitWebProcess` a 7-8 núcleos, CPU 75-86 %, 85 °C en 13 s y corte en el test 20 (dos de dos); chromium: CPU 30-40 %, 76 °C. Cerradas a medio arrancar: 2,0 núcleos durante 9 s; con el arranque terminado: 0,0. `about:blank`: 3 de 37 tests colgados 60 s. Con la espera: 37 de 37 a 68-70 °C; el proyecto entero, 637 de 638, máxima 80 °C |
| M-29 | K-94 | (2026-10-14; cuatro sondas desechables en iphone12, lanzadas con `npm run test:e2e:vigilada`, que da la CPU de los procesos por segundo) Páginas vivas: arranque normal, selección retenida y selección abortada, contando en la ventana del padre las llamadas a `setTimeout`, `setInterval`, `requestAnimationFrame` y `postMessage` durante 10 s; y el padre a medio arrancar con un `pagehide` disparado a mano. Páginas cerradas nada más pasar la FASE 1, cinco por variante y 13 s de espera: tal cual, con los service workers bloqueados, con la selección vacía, con un `sw.js` sin precarga y con uno que no escucha `fetch` (servidos con `context.route`). Y cinco páginas mínimas, que no son de la app, cerradas con cargas retenidas | Vivas: 0,0-0,3 núcleos; 2-6 `setTimeout` y 0 `requestAnimationFrame` en 10 s; con `pagehide`, 0,0-0,2. Cerradas: tal cual, 1-3 núcleos durante 9 s (dos pasadas: 3,0 y 1,0); sin service worker, 0 y sin procesos rezagados; selección vacía, 0; sin precarga, 3,0; sin `fetch`, 3,0; mínimas, 0 |
| M-30 | K-95 | (2026-10-14; sonda desechable en chromium, tres pasadas con `npm run test:e2e:vigilada`, máxima 62 °C) Con el padre real y su selección real en el iframe: `seleccionarIdioma`, P7, `seleccionarAventura`, cerrar el mapa, normativa (se espera a `_iframesPreCargadosP14`), logos y un clic en su botón; se espera a que la activación termine (modo `aventura`, selección oculta, hijo2 a la vista, parada fijada) y tres segundos más; `_mostrarDialogoVueltaRapida('es')` y clic en `#btn-vuelta-elegir-otra`; captura de pantalla; el mismo recorrido con `Aventura2` y 20 s mirando al padre cada medio segundo. En la selección se lee `aventuraIniciando`, el estilo calculado y la caja de `#overlay-carga-aventura` y el elemento del centro de la pantalla. La tercera pasada espera además a que el arranque termine del todo (el `body` sin `loading`, más 1,5 s), porque las dos primeras arrancaban la aventura a los 0,5 s de abrir la página y el arranque les enseñaba el diálogo de reanudación (`setTimeout(_finalizarInicializacion, 300)` lee `vv_aventura_iniciada` después): un artefacto de la sonda | Primera aventura: activada (control). Tras «Elegir otra aventura»: pantalla activa `pantalla1`, `aventuraIniciando = true`, pantalla de carga `display: flex`, opacidad 1, 1280×720, progreso 100, y en el centro de la pantalla «la pantalla de carga»; sin diálogo de reanudación. Segunda: precarga cumplida, 0 líneas de rastro tras el botón, el padre igual durante 20 s (`aventura`, `Aventura2`, selección a la vista), parada `Av1-P-0`. Las tres pasadas coinciden en lo de la selección |
| M-31 | K-98 | (2026-10-14; dos scripts de Node sobre los módulos de datos, sin navegador: `audios-aventuras.js`, `retos-aventuras.js`, `textos-aventuras.js`, `indice-aventuras.js` y `mapa-vintage-aventuras.js`) Para cada aventura y cada uno de los doce idiomas: el fichero de `audio-intro-<idioma>`, si la aventura tiene algún audio (la misma condición que `tieneAudiosDisponibles()`), la pregunta de los retos 1 y 2 (huella del texto), los párrafos de `txt-intro`, su mapa vintage y las horas de su tarjeta | Audio de la intro: un solo fichero por idioma en las siete aventuras, en los doce idiomas. «Tiene audios»: español sí en las siete; los otros once idiomas, no en las siete. Retos 1 y 2, redacciones distintas entre las siete aventuras (control: en español da 3, como se había visto a mano): es 3 y 3 · en 1 y 1 · fr 1 y 1 · it 1 y 2 · nl 2 y 1 · ja 2 y 2 · de 3 y 2 · zh 3 y 2 · pl 2 y 2 · pt 3 y 1 · ru 2 y 3 · uk 2 y 3. Un primer resumen hecho con `awk` daba 1 en todo, también en español: se descartó por no pasar ese control. `txt-intro`: seis aventuras con los mismos 19 párrafos y Aventura34km con el 206 en lugar del 205 («150 horas» por «60 horas»). Mapa vintage: uno por aventura, y ninguno en Aventura34km. Tarjeta: 60 h en seis y 150 h en Aventura34km |
| M-32 | K-105, K-101, K-104 | (2026-10-14; dos sondas desechables en los cuatro navegadores, con `npm run test:e2e:vigilada`, máxima 66 °C) Padre real con su selección real; la aventura se arranca por el recorrido del spec 128 y «atrás» es `history.back()` en el padre, con un espía de `popstate` que apunta el estado de la entrada a la que se llega y 1,5 s de observación | **Sesión nueva:** aventura en marcha, `history.state` = `{vv_en_aventura:true}`; primer «atrás»: `popstate` con `null`, sin diálogo, en los cuatro; segundo «atrás»: la página deja de existir en chromium, pixel5 e iphone12 (en firefox el historial de la sonda empieza en esa página y no hay adónde ir). **Tras «Elegir otra aventura» en una sesión nueva** (recarga; la entrada conserva su estado), con idioma y Aventura2 elegidos y sin arrancar: «atrás» da `popstate` con `null`, sin diálogo. **Control (recarga con la aventura en marcha y «Continuar»):** historial de una entrada más; primer «atrás»: `popstate` con `{vv_en_aventura:true}` y diálogo; tras «Continuar mi aventura», otro «atrás»: diálogo otra vez (chromium, pixel5, iphone12; en firefox la recarga de Playwright deja el estado en `null` y el control no vale). **Desde ese control, «Elegir otra aventura», idioma y Aventura2 elegidos sin arrancar, «atrás»:** diálogo «¡Aventura en curso!» con modo `null` y sin aventura guardada (los mismos tres). **De paso (K-104):** con los hijos cargados, `typeof globalThis.TIPOS_MENSAJE` es `object` en el padre y en la selección y `undefined` en hijo1 a hijo6 (y en `fondo-blanco` y en el iframe todavía vacío del puzzle, que no tienen bus), en los cuatro |
| M-33 | K-100 | (2026-10-14; la misma sonda, cuatro navegadores) Estilo calculado de la caja de texto de la P11 con Aventura1 en español, y de las tres `.texto-box` como control | `#texto-intro-contenido` (la única `.audio-overlay` del documento; `#pantalla8 .audio-overlay` casa 0 elementos) desborda, con `scrollbar-color: auto` y el tamaño de letra del `body` — 16 px en pixel5 (393×727) y en iphone12 (390×664), 18 px en chromium y firefox (1280×720). Control: las tres `.texto-box` (`terminos-contenido`, `normativa-contenido`, `agradecimientos-contenido`) dan 18 px en los cuatro, con `scrollbar-width: thin` y `scrollbar-color` `#888`/`#e8d5b0` donde el navegador lo calcula (webkit no devuelve `scrollbar-color`; firefox devuelve `scrollbar-width: none` en las cuatro cajas, la de la P11 incluida) |

### R2.5 Discrepancias entre la guía (o comentarios de código) y el código — para decidir

La guía "se consulta siempre y no se cree nunca" (CLAUDE.md regla 8). Estas son las contradicciones que la ronda tropezó,
cada una verificada contra el código. **Las 18 se corrigieron en la tanda de arreglos del 2026-10-02**, junto con las que la
propia tanda fue encontrando (G-19 a G-47, tabla de estado más abajo); la tabla de aquí conserva lo que decían y lo que había:

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
| G-44 | ✅ | `bddb51c`: siete nombres que la guía citaba como existentes y no están en ningún fichero del código: `_hijoListo_sincronizarModoCriticos` (dos sitios: nada manda `CAMBIO_MODO` al quedar listo un hijo; el modo inicial lo llevan `PADRE_DATOS` y el `modoInicial` de `PADRE_CONFIRMA_HIJO_LISTO`), `cargarIframeSecuencial` «alias» de `cargarIframeSoloSeleccion`, `_broadcastActivacion`, `cargarVideoIntro()` (que además daba la pantalla del vídeo como P8, «placeholder»: es P4 y carga `video-intro.html`), `maxFallidos` (es `MAX_LATIDOS_SIN_RESPUESTA`), `registrarControladorScript2Seguro` (es `registrarControladorSeguro`) y `paradaIdActual` de hijo4 (es `estado.padreIdActual`) |
| G-45 | ✅ | `f52627b`: cinco comentarios de código que citaban como vivo algo que no existe (los dejó `comentarios-nombres-citados.cjs`, 44 candidatos triados uno a uno): `_manejarSimularClick` (el comentario de `_hdl_SISTEMA_ERROR` del padre la daba como emisor de `ELEMENTO_NO_ENCONTRADO`; la retiró `8daa6db`), `_hdl_NAVEGACION_GPS_DESACTIVAR` (`js/funciones-mapa.js:2705`; `GPS.DESACTIVAR` no tiene handler), `_solicitarRetoParaParada` (padre `:9837`; el reto de cada parada lo manda `_enviarRetoMostrar`), `autoReconectar` (el `@param` de `marcarHijoDesconectado`, `js/mensajeria.js:1115`, que solo recibe `hijoId`) y `setView` (`js/funciones-mapa.js:1315`: es de Leaflet y el mapa es MapLibre). Solo cambia texto de comentario y ninguno cambia el número de líneas de su fichero |
| G-46 | ✅ | `514a774`, `a319ba9` y `dfa1ace`: dos listados de specs que no se mantenían solos. El árbol de §20 decía «66 specs» y daba §18.3 por «el listado completo»: en `tests/e2e` hay 111 y §18.3 describe 68. Los 43 sin fila —los números 68, 69 y 74 a 114— suman 153 de los 532 tests por proyecto. Sus filas se escriben en `dfa1ace`, en presente y por lo que cada spec comprueba (sus IDs con el invariante), sin contar los casos corregidos: lo que un spec vigila que no vuelva se describe por el invariante y no por el nombre de lo retirado (regla general de la guía, no solo de los seis specs `101`, `104`, `106`, `107`, `110` y `111`). El árbol de §20 dice que §18.3 describe cada uno; comprobado por script: 111 filas, una por spec, y 153 tests en las 43, como el listado de Playwright. Y el catálogo de `tests/master-test.html` (`npm run sync:master-test -- --check` salía con código 1) no tenía los specs 84 (renombrado) y 90 a 114 y listaba uno desechable que ya no existe; regenerado con la herramienta (26 líneas nuevas, 2 quitadas). La comprobación inversa —qué hay en el repo que la guía no menciona—, hecha por clase, no da nada más: 17 páginas, 32 módulos de `js/`, 6 ficheros de `docs/`, 3 ayudas de `tests/e2e/helpers`, 8 ficheros de configuración y 26 de los 27 scripts de `npm` aparecen (`postinstall` no); de las herramientas de `tools/` faltan por nombre de fichero `verificar-citas-guia.js` y `verificar-datos-aventuras.js` (se citan por su `npm run`) y `imagenes-referencias.js` |
| G-47 | ✅ | `c6789e3` (guía), `01a12dc` (`guia-narracion.cjs`), `beff450` (código), `4c2716e` (`CLAUDE.md`) y `dfa1ace` (guía): la guía contaba cambios en vez de describir lo que hay («la pared es azul», nunca «era roja y se cambió»). Tres barridos a mano y uno con el instrumento nuevo reescribieron en presente unas 230 frases de 28 secciones (82 subsecciones): «ya no», «antes … ahora», «se retiró», «se arregló», «se añadió», imperfectos de incidente («saltaban de golpe», «la causa real detrás del bug donde …»), «reporte de campo», una fecha («2026-08», que el grep de fechas de `CLAUDE.md`, `2026-0[0-9]-[0-9]{2}`, no ve), referencias al proceso y enlaces a la memoria privada; los casos ya corregidos que se contaban como ejemplo (§14, §25.18, §36.10, §36.26, §36.27.7) se quitan o pasan a condicional. El instrumento tuvo su propio defecto, medido: `\b` no es frontera tras una vocal acentuada seguida de espacio, así que «se retiró», «se eliminó», «se añadió» y «se arregló» no salían (la autoprueba falla 10 de 36 con el `\b` crudo); y las reglas duras no veían la mayoría de las 118 ediciones de la última pasada, que salieron de leer las 129 oraciones con imperfecto, las 252 con pretérito, los 62 «antes» sin «de», los 20 «ahora» y los 70 «hoy/actualmente» («antes sí lo hacía», «Se eligió la posición superior», «imagen actualizada»). Al reescribir salieron tres afirmaciones que no cuadraban con el código, leído en cada fichero: §9.10 y §25.10 daban `casa` como valor de arranque de `estado.modo.actual` y es `null` (`codigo-padre.html:4180`, `js/state-manager.js:37`; §2 lo decía bien); §2 y §11 nombraban tres de los seis carteles que cierra `_ocultarTodasPantallasDistanciaGPS` (`codigo-padre.html:6219-6232`, y K-49 había dado por buena la guía); y el ejemplo de §36.10 daba 518×482 con el contenido pegado al borde para `brujula-seguimiento.png`, que mide 738×702 con el contenido al 62 % × 67 % del lienzo (medido decodificando el PNG). Dos textos de código repetían lo que la guía tenía mal y se corrigen en `beff450`: el comentario de `codigo-padre.html:7621-7623` nombra los seis carteles, y la cabecera del spec `40` dice `null` y el título de OR-1 deja de llamar «valor de arranque» al `casa` que fija el test (que vale igual con `null`); solo cambia texto y no se mueve ninguna línea (el hook subió `CACHE_VERSION`, porque el padre está en `APP_SHELL`). `CLAUDE.md` regla 2 lleva ahora el grep de fechas ancho (`20[0-9][0-9]-[0-9][0-9]`) y la comprobación de narración (`4c2716e`). Y la guía deja de nombrar lo que no existe para decir que no existe, en seis sitios (`dfa1ace`): `SISTEMA.ACK`, `getInfoDispositivo` y `__vv_deviceInfo`, `_propagarCambioModoAHijos` (dos sitios), `messagingAdapter` con `_listenerRegistry` y la fila del glosario de `messagingAdapter` |
| G-48 | ✅ | `db51b2d`: la fila de `funciones-mapa.js` del inventario de módulos de la guía decía que el efecto de pulso de llegada usa `_pulseTimeout` (módulo) con `clearTimeout` para no acumular confirmaciones seguidas; `_pulseTimeout` no se asigna nunca y ningún efecto la usa (K-64). Sale la frase de la guía; la variable se decide en K-64 |
| G-49 | ✅ | `db51b2d`: la misma fila decía que los tres triángulos de la flecha llevan `translate(-50%,-50%)`, con el porqué al revés, y contradecía a §4.5 de la propia guía; el código lleva `translate(-50%,0%)` en los tres (`js/funciones-mapa.js:3502`, `:3504` y `:3506`) y su comentario (`:3487-3497`) da la razón: así el vértice queda sobre el punto GPS, que es el pivote del giro. La fila dice ya lo mismo que §4.5 |
| G-50 | ✅ | `db51b2d`: la tabla del aviso de último recurso (§11) daba el aviso por seguro en `_distribuirDatosRest()` «tras 10-30s de espera (fallo de módulos de Script 2)»; con Script 2 cortado después de crear `__distribuirReadyPromise`, la espera no tiene plazo y el aviso no sale (K-72, medido). La fila separa los dos casos |
| G-51 | ✅ | `44a76ec`: la guía (L471, L4146, L5236, L6508, L9725 y L9729) llamaba a los dos sensores de llegada «independientes», decía que «solo marcan `pending.llegada`» y llamaba al de `funciones-mapa.js` «respaldo del de hijo2»; hijo2 decide sobre la distancia y el id que le manda `funciones-mapa.js` (`coordenadas-hijo2.html:1366-1402`), el de `funciones-mapa.js` avisa siempre primero y el segundo aviso vuelve a crear la ficha de un tramo cerrado (medido, K-73). L6508 decía además que miden «con radios distintos» (los dos usan 15 m), que los de hijo2 corren cuando `ACTUALIZAR_ESTADO` «trae `tipoParada`» (los corta el modo de hijo2, `:1393`) y repetía un paréntesis |
| G-52 | ✅ | `44a76ec`: L6508 decía que los dos sensores miden «la tolerancia dinámica en tramos», y L6542 que `_detectarLlegadaTramo()` compara con `toleranciaGPS`; los dos usan `radioLlegada` (15 m) en tramos (`coordenadas-hijo2.html:1303`, `js/funciones-mapa.js:164-174`), como dice L9896, y las llegadas de tramo medidas caen entre 2,7 y 15 m |
| G-53 | ✅ | `44a76ec`: L1374 decía que el cartel de llegada al inicio sale donde «no hay … botón que pulsar», y L1376 citaba su texto, que pide pulsar avanzar, con el nombre de una parada que no es un inicio (K-77) |
| G-54 | ✅ | `44a76ec`: L10634 decía que la marca `estado._rescatePeticionPendiente` hace que `marcarParadaCompletada()` no saque el cartel de transición tras un rescate pedido; la marca no casa nunca con el id que compara, y el cartel sale (K-78, medido) |
| G-55 | ✅ | `44a76ec`: L5876 y L11490 decían que hijo2 apaga `#btn-ubicacion` al recibir el `PENDING_INICIADO` de su elemento; la comparación no casa nunca y la rama no corre (K-80, medido) |
| G-56 | ✅ | `44a76ec`: la precisión. §25.14, §25.17, §31.5 y §31.6 decían que ninguna lectura se descarta por su precisión; hijo2 no calcula llegada ni franjas con más de 50 m de margen (`coordenadas-hijo2.html:1377`) y el bloqueo de 5 km ignora las de más de 100 m (`codigo-padre.html:5612`). §31.5 decía además que ese bloqueo recorre `elementosIDpadre` y salta a la primera lectura; recorre la lista de coordenadas (`:5618`) y salta a la tercera comprobación seguida (`:5609`, `:5649`) |
| G-57 | ✅ | `44a76ec`: el modo y los sensores. L473 decía que ni el envío de `ACTUALIZAR_ESTADO` ni el sensor de hijo2 miran el modo; los dos lo miran (`js/funciones-mapa.js:3028`, `coordenadas-hijo2.html:1393`). El fragmento de §4.7d mostraba en `completarCambioParada()` una llamada a `mostrarCartelLlegadaParada` que no está (la única, `js/funciones-mapa.js:3103`). Y la llegada a un tramo con `toleranciaGPS` seguía en seis sitios más (§7.3, §9.1, §11, §25.16, §26.12.11 y la fila del spec 21) |
| G-58 | ✅ | `44a76ec`: la ficha nace al activarse el elemento (`codigo-padre.html:11596`; medido en cada activación), no con su primer evento (§9.2.3, §9.8, §10.16) |
| G-59 | ✅ | `44a76ec`: el arranque. `razon: 'sincronizacion_inicial'` (cinco sitios de §5 y §6): nadie lo envía. Los hijos cargan en P14 (medido), no a los 500 ms del arranque (§5, §26.2). hijo6 carga con ellos, no en diferido (§5, §7.7, §8.10); recibe `CHAT.ESTADO_PADRE` solo al abrirse y entonces reconstruye el acordeón entero (`chat-hijo6.html:691-697`, `:794-811`) |
| G-60 | ✅ | `44a76ec`: el latido no se pausa en CASA ni arranca al entrar en AVENTURA (§8, la fila de `CAMBIO_MODO` de §26.12.1 y §36.15): se enciende una vez (`codigo-padre.html:4022`) |
| G-61 | ✅ | `44a76ec`: escuchas `message` que no existen. video-intro avisa por el bus (`video-intro.html:1964`), y la selección y el padre atienden con handlers del bus (§27, §35.4, §35.7). `CHAT.*` tiene tres tipos (`js/constants.js:159-171`), no dos (§27) |
| G-62 | ✅ | `44a76ec`: sueltas. hijo1 no se muestra ni se oculta con el modo (§26.9); hijo2 no importa `funciones-mapa.js` (§37.1); `_hdl_AVENTURA_FINALIZADA` no existe y `RETO.MOSTRADO` solo se anota y se confirma (§10.15); los carteles son diez (§4.7m, §25.5e, §37.5; `codigo-padre.html:8376`); en §6 y §7, la entrada muerta de `controladores-padre.js`, la clase del body de hijo2, el «volumen», la clase `.activo` y el `postMessage` directo de hijo5 y la ventana flotante de hijo1; los totales de los botones de aventura salen de `js/indice-aventuras.js` (§9.12); `__vv_coordenadasAventura ||` (L6289); el flag de hijo2 tiene un lector (§28.2); `backend/` no existe (§36.22); §29, en presente y sin números de línea; y los números de línea de `sw.js` (107) y de los cinco scripts (también en `CLAUDE.md`) |
| G-63 | ✅ | `73901e8`: lo que quedó sin tocar en `44a76ec`. El orden de los scripts (§26.2 contradecía a §30.6: un bloque `<script type="module">` no espera a que termine el anterior, y Script 2 y Script 4 llevan su espera explícita, `codigo-padre.html:9355`, `:14210` y `:14219`; el `DOMContentLoaded` medido en K-04 antes de que Script 1 acabe dice lo mismo); los flujos A, C y G de §36.15 (la carga en P14, las dos salidas del fin de aventura y las cuatro franjas con su gracia); la visibilidad de hijo6 (§26.13); las páginas de hijo1, en español; y la lista de menores: términos en P10 y puzzle en P6, el aviso de audio de P9 lleva a P10, «elegir otra» vuelve a P1, el `destino` del bus es obligatorio (`js/mensajeria.js:496`), hijo2 es la franja derecha en columna, el botón de imagen se apaga con un reto abierto y los de mapa no se apagan fuera de rango, P13, tres lecturas pasivas de la ventana de arriba (faltaba la de `js/logger.js:116`) y dos escrituras del padre en hijo5, tres `console` directos, iframes sin URL en `src`, `apple-touch-icon` frente a los iconos del manifest, audios por idioma (598 de 598 entradas con `file` en español, 0 en los otros once) y el mapa vintage de Av34km (en disco, sin enlazar) |
| G-64 | ✅ | `1e2e317`: las frases que seguían sin contrastar. El GPS: §25.14 decía que el cartel de `fotogpserror.png` sale también a más de 2.000 m del objetivo, y esa franja tiene pantalla propia (`codigo-padre.html:10840-10841`, `:6362-6425`); su tabla de errores decía que el overlay de señal sale al agotar los reintentos, y sale desde el primer timeout (`:5708-5711`); §25.17 daba tres franjas (son cuatro) y los botones apagados sin gracia; §31.5 daba dos razones que el padre no manda (`usuario_fuera_zona` y `usuario_en_zona`; son `fuera_de_zona_5km` y `de_vuelta_en_zona`, `:5661` y `:5670`), citaba un texto «Ubicación a más de 2 km de tu objetivo» que no está en el código y decía que el botón de reintento se oculta siempre (K-84); §31.4, que las seis pantallas reaparecen tras su espera (son las cuatro de franja); §31.6, que el overlay sigue visible tras el reintento y que todas llevan cuenta atrás; §31.2, un timeout de 30 s (el `watchPosition` lleva 35 s y los reintentos 15, 30 y 60). El arranque: §26.2 decía que Script 1 registra todos los controladores del padre (registra los del arranque; Script 2, el resto). El bus: §26.5 daba el `destino` por opcional y describía una cola de envíos pendientes (nota en K-65). Los payloads enteros de las dos respuestas a un cache-miss (`js/controladores-padre.js:75-79` y `:141-145`). Dos referencias a §21.2 que eran a §8.1. La intro tiene veinte funciones de escena (`video-intro.html:2000-2003`). §36.29 llevaba una cifra de tests |
| G-65 | ✅ | `5318ef7`, con el arreglo de K-82: el botón de retos de hijo3. §7.4 describía su estado por evento y por modo, con `_configurarRetoBtn`; lleva la regla única (`_decidirRetoBtn`: siete filas, en orden), la fuente de «audio terminado», los siete llamadores de `_sincronizarRetoBtn()` y el estado del reto que no se rehace. El recordatorio «pulse retos» (§25.5d) decía dos condiciones contadas «desde que se activó el elemento» y un arranque que exigía «hijo4 listo»: son tres, contadas desde el fin del audio, y la tercera es el botón encendido. `RETO.OCULTAR` y `GPS.DENTRO_DE_RANGO` (fichas y tablas de §8, §9, §25.7, §26 y §29.7), los payloads de `CONTROL.*` con `retosBtn`, la fila del spec 34 (citaba §25.5c), la del spec 122 y el recuento de specs (119). §37.2: la tabla de `codigo-padre.html` regenerada con `npm run inventory:conexiones` (100 cruces de 151) y sus totales, que no casaban con la tabla (decía 67 y 18 entre Script 1 y Script 2, y 127 en total; son 65, 14 y 123). §31.5 decía que `btnAvanzarDeshabilitadoExternamente` es exclusivo del bloqueo de 5 km (K-86) |
| G-66 | ✅ | `f69ea3d`: §25.10 decía que al reanudar «el usuario continúa exactamente donde lo dejó»: continúa en el elemento, pero su ficha nace de nuevo, y un elemento ya completado queda con «avanzar» apagado (K-85, M-23). §25.19: con el reto disponible y sin resolver, el rescate registra el punto y no habilita «avanzar» (K-87, M-24) |
| G-67 | ✅ | `f78d521`, con los arreglos de K-85 y K-87: §25.10 (un elemento ya completado se activa listo para avanzar), §25.19 (el motivo `ya-completado`, con su rama en el diagrama, y el rescate con el reto sin resolver), la activación en §6 (tabla de CASA frente a AVENTURA y su diagrama de pasos), la fila del spec 123 y el recuento de specs (120), y la tabla de §37.2 regenerada |
| G-68 | ✅ | `aadd16d`: §25.19, «El cobro va diferido». El párrafo decía que la marca de completado vive solo en memoria y que un cierre de la app en esa ventana deja al usuario delante de la misma valla; el punto queda guardado como completado al instante y, desde K-85, al reanudar sigue listo para avanzar: lo que vive solo en memoria es el apunte del gasto, y por eso ese rescate no se cobra (K-91). |
| G-69 | ✅ | `e249843`, con los arreglos de K-89 y K-90: §25.10 (lo hecho en el elemento se guarda y vuelve al reanudar; la fila de `vv_progreso`), §9.2.3 (`_anotarEnFicha`, único sitio que escribe en la ficha; `ensurePending` no «actualiza el campo», devuelve la entrada), §9.10 (`estado._fichaGuardada`), la fila de `vv_progreso` de §10, «Distancia recorrida» (decía que `pendingCompleciones` no persiste y que al reabrir hay que escuchar el audio otra vez), §7.4 (`_retosHechosEn` y la cola de retos), §25.5d (el recordatorio «pulse retos» arranca también en la activación; decía que la activación lo detiene incondicionalmente), §25.19 (el rescate rellena la ficha con `_anotarEnFicha`), los pasos de la activación de §6, la fila del spec 124 en §18.3 (121 specs) y §37.2, regenerada. |
| G-70 | ✅ | `489f14d`, al retirar `estado.retoActual.disponible`: §2.5 (el estado del reto al volver a CASA), la tabla de CASA frente a AVENTURA de §6 (pierde la fila «Estado del reto», que solo describía ese campo), §7.4 (los campos de `estado.retoActual`; si el reto se puede abrir lo decide `_decidirRetoBtn()`), §29.7, y la ficha de `RETO.SOLICITAR_RETO` de §10.5, que decía «busca `estado.retoActual`, envía `RETO.MOSTRAR` a hijo4 si el reto está disponible»: el handler elige el siguiente reto sin hacer de la cola, o el primero del elemento, y sin reto responde `SISTEMA.NACK` (leído en `_hdl_RETO_SOLICITAR`). §37.2, regenerada. |
| G-71 | ✅ | `2ddb79f`, con K-66: §32.3 ponía de ejemplo `enviarMensaje({ destino: CONFIG_PADRE.ID })` y decía que el bus busca `'padre'` entre los iframes registrados y avisa con «Iframe no encontrado o sin contentWindow»: cuando el destino es el propio frame, `enviarMensaje` avisa una vez por tipo («no se envía … a sí mismo por enviarMensaje: eso se hace con despacharLocal») y devuelve `false` (leído en `js/mensajeria.js`). |
| G-72 | ✅ | `1e1a660`, con K-68: la fila de `SISTEMA.CAMBIO_MODO` de la tabla de handlers de hijo5 decía «sin `origen` lo ignora»; esa guarda no existe. |
| G-73 | ✅ | `479b06a`, con K-73: §9.2.3 (a un elemento ya completado, en AVENTURA, `ensurePending` no le crea ficha), §10.16 (decía que `ensurePending` vuelve a crearla cuando un evento posterior la encuentra borrada) y «Dos sensores», en «Tolerancia GPS por tipo de elemento» (decía que la segunda llegada vuelve a crear la ficha de un tramo ya completado); la fila del spec 123 en §18.3. |
| G-74 | ✅ | `acfebb1`, con K-88: §2.7a (lo que se devuelve a hijo3 y a hijo4), la ficha de `HIJO_LISTO` en dos sitios, §26.14 (decía que el tiempo restante se guarda en `_snapshotRecuperacion.tiempoRestante`: sale de `estado.tiempoRestante`; y los dos controles de hijo3), la fila del spec 125 en §18.3 (122 specs) y §37 (una fila más, `_reenviarProgressBarAHijo3`: 101 identificadores cruzados de 152, y 15 del módulo 2 al 1). |
| G-75 | ✅ | `8f36e78`, con K-71: la fila de `radioLlegada()` en «Tolerancia GPS por tipo de elemento» dice que el círculo naranja se dibuja con ese mismo radio. |
| G-76 | ✅ | `c9463f8`, con K-41: el listado del estado del state-manager (sin `mapaInicializado` ni `inicializacionPromises`), el payload de `vv_progreso` en la tabla de claves y en «Distancia recorrida» (sin `audioActual`; el segundo sitio no nombraba `totalParadas`), la fila de `AUDIO.ESTADO_ACTUALIZADO` (decía que guarda `{ id, estado, timestamp, origen }`), `sincronizarModoMapa` (decía que fija también `estadoMapa.timestamp`), la fila del spec 124 en §18.3 (10 tests) y la tabla generada de §37.2. |
| G-77 | ✅ | `1f26741`, con K-93: las cabeceras de la tabla generada de §37.2 daban al padre 20 bloques `<script>` en línea (5 de módulo y 15 clásicos) y 152 nombres expuestos, y a la selección 18 bloques: son 18 (5 y 13) con 140 expuestos, y 4. El recuento de más venía del generador, que se corrige; con él cambia la numeración de los bloques clásicos en las celdas de la tabla. |
| G-78 | ✅ | `88db770`, con la fila 58 y K-94: sección 38, nueva (mediciones, reglas, el calor de iphone12 y el vigía térmico, con tres diagramas); el párrafo de `boot.js` en «Patrones de los tests E2E» (el ayudante `cargarHijosDelPadre` y la tercera espera de `gotoAndWaitForFase1`), la fila del spec 126 y el recuento de specs (123), la orden `test:e2e:vigilada` en la tabla de órdenes y en §18.4, y la entrada 38 del índice. |
| G-79 | ✅ | `c9c90fb`, con K-95: §4.6, §8.3, §10.8, §26 y §34 decían que los dos «elegir otra aventura» reinician sin recargar; el del diálogo de vuelta recarga la página, y `NAVEGAR_PANTALLA` tiene un solo emisor. Filas de los specs 19, 25 y 128 en §18.3 |
| G-80 | ✅ | `4c0895a`: de 17 a 18 pantallas en todas las secciones; las antiguas P13 a P17 pasan a P14 a P18 en 241 líneas (leídas una a una en el informe del desplazador; catorce reescritas a mano); apartado nuevo en §7.1; §16.2 y §16.3 reescritas (categorías de precio, cuatro fases, la regla del código y las decisiones pendientes del backend); fila 24 de §22.0, glosario, §24, §25.2 y §37.2. **Lo que la guía decía y el código no:** (a) `SELECCION.AVENTURA_ACTIVADA` atribuido a la respuesta del reto R-2 en una veintena de sitios, y la fila de los logos con `mostrar(17)`: lo envía `iniciarAventura()`, que solo llama el botón de los logos (búsqueda desnuda de `iniciarAventura`: ese `onclick` y su definición); (b) el diagrama de §9.3 decía que `CODIGO_VALIDADO` activa el GPS en producción (su handler está vacío) y que `P14_MOSTRADA` solo precarga módulos (carga hijos y datos y enciende el GPS); (c) §9.4 y §10.5 decían que `AVENTURA_SELECCIONADA` baja un indicador y baja dos; (d) §7.1 daba `#btn-mundo-verde` y `#btn-mundo-rojo` como ids y son clases; (e) §22.0, fila 20: «ningún test carga los hijos como iframes reales», y lo hacen los specs que usan `cargarHijosDelPadre()`; (f) el diagrama de §7.1 ponía la decisión del modo DEV después de la pantalla de pago, que en ese modo no se llega a mostrar; (g) un espacio de no separación (U+00A0) en la fila de la ✗ de §4.1 |
| G-81 | ✅ | `9ee6c05`, con K-69: la nota «Pendiente» de los verdes (§4) nombraba `.btn-sub-ico` y `.x-btn` entre las recreaciones de botones de `video-intro.html`, y la «Paleta» del giro de página (§35) decía que el pergamino lo usa `.s3-ov`: ninguna de las tres clases la lleva un elemento. Quedan `.boton` y `.btn-main-ico` (leído: las dos con el degradado `#43c465→#28a745→#1e8035`), y el marrón `#8b5e1a` lo llevan `.s5-map`, `.puzzle-board` y `.pz-piece`. Tres filas de §37.2 regeneradas por el desplazamiento de líneas (`verificar-citas`: 84 OK, 44 sin resolver, 0 mal) |
| G-82 | ✅ | `783a75f`, con K-104: §26.3 decía que `constants.js` expone `globalThis.TIPOS_MENSAJE` (no lo publica ese módulo: lo hacen el padre, la selección y `video-intro.html`), y «Namespace CHAT» de §27, que el código accede a `CHAT.CERRAR` y a `CHAT.ESTADO_PADRE` por el puente con un literal de respaldo (hijo6 usa el `TIPOS_MENSAJE` que importa, y el envío del padre no lleva literal) |
| G-83 | ✅ | `45e60ac`, con K-103: §24 decía que la función de la normativa envía `SELECCION.P15_MOSTRADA` «al aceptar»; sale al mostrarse la pantalla, y aceptar lleva al reto R-2. Con K-106 (`d5d6ca6`), §25.19 nombraba `#modal-finalizacion` como el modal de fin de aventura: es `#modal-finalizacion-aventura` |
| G-84 | ✅ | `7d7d00c`, con la segunda parte de K-105: la guía decía que un hijo sin registrar entrega igual su `HIJO_PREPARADO` (el bus descarta lo que llega de un iframe sin registrar, en los dos sentidos) y citaba un aviso que no existe; las tablas de hijo6 no tenían `SELECCION.VIDEO_INTRO_TERMINADO`, `CHAT.CERRAR` ni `CHAT.RESCATE_SOLICITADO`, decían que escucha `message` a pelo y que manda `HIJO_LISTO` «tras cargar los textos»; las de hijo1, que solo manda `UI.NAVEGACION_EXTERNA` de los `UI.*`; «`UI.CLOSE_MENUS` al abrir su menú» (sale en cada pulsación); la ficha del mapa completo descrita dos veces y de dos formas; «ahora mismo» y «hoy» en §33.2, con 57 handlers permanentes (son 58), y en §37.2 la selección seguía con las dos copias que quitó K-97 (15 cruzados de 34, no 17 de 36) |
| G-85 | ✅ | `177e731`, con K-41 y K-36: §10.12 decía que `funciones-mapa.js` también envía `NAVEGACION.SOLICITAR_DATOS_PARADAS` (solo lo envía hijo5) y que hijo2 lo recibe y lo guarda en `arrayParadasLocal` «para cálculos de proximidad GPS» (hijo2 recibe, sin pedirla, la respuesta, `RESPUESTA_DATOS_PARADAS`, y ese campo suyo solo lo lee un log); y daba a hijo5 y a las peticiones de coordenadas claves que nadie lee |
| G-86 | ✅ | `ba98ae4`, con K-115: la cabecera de los mensajes del puzzle decía que los envía «via `globalThis.parent.postMessage`»; los envía por el bus, como decía la nota de debajo de la tabla. Y la pausa reanudaba con `requestAnimationFrame(draw)`, hoy `draw()` |
| G-87 | ✅ | `7a92883`, con K-121: la guía decía que la fase 2 la llama el arranque (`ejecutarInicializacionAutomatica()`), que «FASE 1 y FASE 2 terminan antes de asignar `src` a ningún iframe» con todos los datos de aventura ya en memoria, que la fase 3 «necesita FASE 2 completa», que `coordenadas-aventuras.js` se carga «en Fase 2 del arranque del padre» y que una sonda con MapLibre vacío para el arranque «antes de llegar a la Fase 2». La fase 2 solo la llaman P15 y la reanudación, como dicen el comentario del arranque (`codigo-padre.html:8019`) y la propia §2 («antes de P15 no se descarga ningún dato»), que contradecía al resto. Cuatro comentarios del padre decían lo mismo. Y los tamaños, medidos con `wc -c`: el índice son 8 KB (la guía y tres comentarios decían 6), los retos 952 KB (la guía, 925) |
| G-88 | 📌 | Sin corregir, decide el usuario: §22.12 frente a `js/server.js:30-41`. `puzzles-aventuras.js` está en `PROTECTED_FILES` y la tabla lo da «a decidir» (con `mapa-vintage-aventuras.js`, que no lo está); el punto 3 dice que los cuatro protegidos «coordenadas, textos, retos, audios» se cargan en la fase 2 (textos y retos van por `cargarTextos()` y `cargarRetos()`, y faltan los puzzles) y propone `cargarIndice()`, que no protege nada. Y la selección importa antes del pago dos módulos protegidos: `puzzles-aventuras.js` para el puzzle de introducción (`En-busca-del-tesoro.html:1173` y `:1666`) y `audios-aventuras.js` para decidir en P9 si la aventura tiene audio (`:2161`, desde `confirmarAventura()`) y para el audio de introducción de P11 (`:1500`). Con `PROTECT_DATA=true` el servidor contesta 403 a los dos (`js/server.js:158-160`) y esas pantallas fallan. **Decidido por el usuario (2026-10-19):** lo que usa la demo gratis (el puzzle de introducción, saber si la aventura tiene audio y el audio de introducción) tiene que poder cargarse antes del pago, también con `PROTECT_DATA=true`. Falta el cómo (los dos módulos llevan los datos de todas las aventuras), que se propone en la revisión de la guía. **Mapa completo de la demo (leído, 2026-10-19 noche):** son cinco piezas de fuentes protegidas, no dos: P6, la imagen del puzzle de introducción (`PZ-intro`; la imagen, `imagenes/imagenes-aplicación/logo-luna.png`, es pública), sacada de `puzzles-aventuras.js` entero; P8, el reto R-1, por `cargarRetos()` (`retos-aventuras.js`); P9, si la aventura tiene audio en el idioma, de `audios-aventuras.js` entero; P11, el audio de introducción (la ruta, de `audios-aventuras.js`; el MP3, en `/audios-aventuras/`, carpeta protegida: hoy solo existe el español, el mismo fichero en las siete aventuras); y P11, el texto de introducción (`txt-intro-<idioma>`), por `cargarTextos()` (textos y párrafos, protegidos). La R-2 es de P16, ya tras el código |
| G-89 | ✅ | `54b4e9b`, con R2.10.7: la tabla de claves de §10.19 no tenía `vv_sw_update_pendiente` (la escribe el bloque del service worker del padre), su columna «cuándo se borra» solo nombraba `limpiarDatosAventura()` (también borran la aventura guardada las dos «elegir otra» y la vuelta a CASA), y el texto decía que todas las escrituras están en el padre (`vv_debug_verbose` la escribe `js/suppress-warnings.js`) |

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
| `codigo-padre.html` | sí | `2ed1658`, `8806429`, `6c152ab`, `0fe5b3f`, `f6ab460`, `c7c7b1a`, `6538bba`, `a4644e5`, `e3a9cff`, `f52627b` | arranques del latido y limpiezas de `pagehide` sin efecto, contadores, lecturas de `Config`, globals sin lector, `getPadreId`, reinicio de la brújula en «Vuelta rápida», comentarios contrastados con el código, el handler de `SISTEMA.HEARTBEAT` sin emisor (M-16), dos comentarios que citaban algo que no existe (G-45) |
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

Los commits posteriores a `e3a9cff` (el último que cambia el código de un frame, el padre) no cambian ninguno de los diez frames restantes: `git diff --quiet e3a9cff HEAD -- <fichero>` da 0 y `git log --oneline e3a9cff..HEAD -- <fichero>` no da nada para cada uno de los diez. Del padre, `f52627b` cambia solo texto de comentario (siete líneas: tres en el padre, tres en `js/funciones-mapa.js` y una en `js/mensajeria.js`, G-45); `sw.js` y `version.json` cambian por la versión de caché, que recalcula el hook de pre-commit; y `tests/` cambia en los specs `114` (`03408b7`) y `30` (`066833e`).

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
| R — Un mismo cierre por dos caminos parciales, y el test que no ve ninguno | K-49 | 1 confirmada (medida: M-20) con decisión abierta: al entrar en CASA los carteles de distancia GPS se cierran por dos mecanismos que se solapan en uno solo de ellos, y CM-6 no veía la rotura del primero |

**Total tal como lo dejó el barrido: 44 entradas — 19 confirmadas, 2 por medir, 5 documentadas, 10
familias de copias, 4 por estudiar y 4 limpias o mixtas; 12 mediciones pendientes repartidas entre
ellas (R2.4).** Lo que más pesaba, sin ánimo de ordenarlo por urgencia: lo que cambia lo que ve el
usuario (K-24, K-25), lo que puede dejar un estado equivocado (K-07, K-11, K-19), lo que hace que una
configuración, una constante o un contador no mande ni cuente (K-01 a K-03, K-37, K-38) y las ramas del
contrato del bus que ningún emisor alcanza, algunas descritas por la guía como caminos vivos (K-35,
K-36, G-9 a G-11). **Tras la tanda de arreglos son 49 entradas** (K-45 a K-49 se encontraron al cerrar): se
hicieron las 20 mediciones posibles (M-8 es de campo), K-07 y K-32 dejan de estar «por medir», y el
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
- Se ejecutaron 20 de las 21 mediciones de R2.4; M-8, el reintento de señal con el GPS en frío, es una
  prueba de campo y queda sin medir.
- `handlers-solo-log.cjs` cuenta como efecto cualquier llamada a una función que no sea de log, aunque esa función no haga nada (falso
  negativo), y como solo-log un handler cuyo único efecto es no estar registrado; lo que lista se confirma leyendo el handler (K-46).
- `guia-handlers-por-frame.cjs` compara por tipo y por frame los handlers y los mensajes del código con las filas de §26.12, §7 y §8;
  `guia-fichas-mensaje.cjs` compara la tabla de §10.7 celda por celda con los handlers y enseña las fichas de §10 junto al código, y
  `guia-payloads.cjs` compara las claves de las celdas de payload con las que mandan los emisores. Ninguno juzga el resto del contenido
  de las filas («qué hace»): eso se leyó a mano contra el handler de cada una (G-34 a G-43). Fuera de esos catálogos —las narrativas
  de §2, §4, §9, §25 y §31, por ejemplo— la deriva entre el texto de la guía y el código solo se barrió en lo que tocaron las
  correcciones.
- `comentarios-nombres-citados.cjs` solo lee los comentarios de JavaScript (no los de HTML ni los de CSS) y da por existente un nombre que aparezca en el código sin
  comentarios de cualquier fichero de producción o de cualquier spec, también dentro de una cadena: no ve un comentario que describe mal lo que hace un nombre que
  sí existe, ni uno que cita un nombre homónimo de otra cosa. Lo que lista se tría leyendo el comentario, porque uno que cuenta lo que se retiró es legítimo (K-34).
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
| `bddb51c` | guía: siete nombres citados que no existen en el código | G-44 |
| `38bed4d` | `guia-nombres-citados` | G-44 |
| `7f9deff` | este documento: G-44, el instrumento de nombres citados y las clases de la interfaz y de los scripts barridas sin hallazgo | G-44 |
| `03408b7` | spec `114` sin service worker (`serviceWorkers: 'block'`); la guía anota el caso en §36.26 | K-32 (M-19) |
| `6c980b0` | este documento: M-19, la nota de K-32 sobre el spec `114` y las tandas completas | K-32 (M-19) |
| `066833e` | spec `30`: CM-6 concede la geolocalización desde el contexto y comprueba los seis carteles de distancia/precisión | K-32 (M-21), K-49 (M-20) |
| `17fd7f1` | este documento: K-49, M-20 y M-21, la nota de K-32 sobre el permiso de geolocalización y los recuentos | K-49, K-32 (M-20, M-21) |
| `7e0116a` | guía: §36.26 punto 6 sin narrar casos corregidos; §18.2 y §20 en presente; dos filas sin la cita a K-35 | guía |
| `f52627b` | cinco comentarios de código que citaban como vivo algo que no existe | G-45 |
| `f45adc9` | `comentarios-nombres-citados` y su entrada en el README (la nota de `guia-nombres-citados` pasa a estar fuera de la tabla de dependencias, que partía en dos); este documento: G-45 y el censo tras `e3a9cff` | G-45 |
| `d96dbea` | este documento: R2.3, los valores de constantes que la guía cita con número coinciden con el código | — |
| `a319ba9` | `tests/master-test.html`: catálogo regenerado con `tools/sync-master-test.js` | G-46 |
| `514a774` | guía: el árbol de §20 dice 111 specs y que el catálogo generado los lista todos | G-46 |
| `b08b153` | este documento: G-46 y la decisión abierta de las 43 filas de §18.3 | G-46 |
| `c096c41` | este documento: las tandas completas al cierre con las cifras definitivas, la hibernación incluida | — |
| `01a12dc` | `guia-narracion` (con su autoprueba) y su entrada en el README | G-47 |
| `c6789e3` | guía: unas 230 frases que contaban cambios pasan a presente; tres afirmaciones corregidas contra el código | G-47 |
| `35525a8` | este documento: G-47, el instrumento de narración y la corrección de K-49 | G-47 |
| `beff450` | el comentario de la rama CASA del padre nombra los seis carteles de distancia y el spec `40` llama `null` al valor de arranque (solo texto; el hook sube `CACHE_VERSION`) | G-47 |
| `4c2716e` | `CLAUDE.md` regla 2: «la pared es azul», el grep de fechas ancho y la comprobación de narración | G-47 |
| `dfa1ace` | guía: las 43 filas de §18.3 y seis frases que nombraban lo que no existe | G-46, G-47 |

**Tandas completas al cierre.** chromium: 532 de 532 (9,8 min). Cuatro proyectos (chromium, firefox, pixel5, iphone12), con un solo worker, tres veces. Las dos primeras, antes de corregir los specs: 2125 de 2128 (49,0 min) y 2127 de 2128 (42,9 min). Los rojos eran del arnés y no del código: el spec `114` MD-2 en firefox y en iphone12 (`page.route` no ve lo que pide el service worker; K-32, M-19; corregido en `03408b7`) y el spec `30` CM-6 en firefox, en las dos (el permiso de geolocalización, concedido con la página ya cargada, no llegaba a la página en parte de las ejecuciones; K-32, M-21; corregido en `066833e`). La tercera, ya con las dos correcciones (`d96dbea`), la partió una hibernación de la máquina: a los 31 min, el 2026-10-03 a las 05:55:20, el registro del sistema anota Kernel-Power 88 («evento térmico crítico») y, a las 05:55:24, el 42 (suspensión), y la hora del sistema salta de las 05:55 a las 09:05 (`Get-WinEvent`, proveedor Kernel-Power). Antes del corte pasaron sin un solo fallo chromium, firefox y pixel5 (1596 tests) y los 75 primeros de iphone12; los 104 fallos que siguen, todos de iphone12 y desde el test 1672 de 2128, son un tiempo agotado del test que corría y 103 «worker process exited unexpectedly» (código 0xC0000142) al reanudarse la máquina: no cuentan contra el código. iphone12 se repitió entero sobre `b08b153` (que respecto de `d96dbea` solo cambia `docs/` y el catálogo generado de `tests/master-test.html`): **532 de 532 (11,7 min)**. Con el código y los specs finales, los 2128 tests pasan sin fallos, en dos tandas: 1596 y 532.

**Resultado por entrada.**

| Resultado | Entradas |
|---|---|
| Corregidas y cerradas | K-01, K-03, K-13, K-23, K-32, K-34, K-36, K-38, K-39, K-44 |
| Corregidas, con una decisión abierta al lado | K-02, K-04, K-07, K-11, K-12, K-19, K-28, K-35, K-37, K-42 |
| Medidas, con decisión abierta y sin código tocado | K-17, K-20, K-24, K-25, K-40, K-41, K-43, K-45, K-46, K-47, K-48, K-49 |
| Documentadas, sin cambios (copias, intencional, limpio) | K-05, K-06, K-08, K-09, K-10, K-14, K-15, K-16, K-18, K-21, K-22, K-26, K-27, K-29, K-30, K-31, K-33 |

**Decisiones abiertas — para el estudio individual del usuario.** Cada una tiene su nota «Estado final» en R2.2, con la comprobación pegada. «Cambia lo que ve el usuario» dice si la opción recomendada se nota en la pantalla; las que sí se notan son las que no se han tocado a propósito.

| Entrada | Pregunta | Opciones (la recomendada, en negrita) | ¿Cambia lo que ve el usuario? |
|---|---|---|---|
| K-02 | ¿Qué se hace con las 38 hojas de `CONFIG` sin lector? | **A) vaciar lo que no se lee**; B) adoptarlo y sustituir los literales | no |
| K-04 | ¿Se queda el monitoreo? | **A) retirarlo entero** (módulo, tres juegos de umbrales, historial y contador duplicado); B) conservarlo con un lector y una sola configuración | no |
| K-07 | `crearPromiseHijoListo` resuelve al instante tras `SELECCION.REINICIAR` | **A) `olvidarHijoListo(id)` en el state-manager**; B) dejarlo (lo compensa `__pendingDistribucion`) | no |
| K-11 | «Volver a la pestaña» no respeta la pausa del latido | **A) llamar a `adelantarLatido()`**; B) retirarla con su BC-12c | solo en CASA y solo en el tráfico de fondo — **sin objeto desde K-57 (2026-10-06): ya no hay pausa** |
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
| K-49 | cierre de los carteles de distancia GPS al entrar en CASA | **A) una sola función que cierre los seis carteles, borre el snooze, pare la cuenta atrás, rehabilite el botón del cartel de bloqueo y oculte el de siguiente entidad, llamada desde un solo sitio (la rama CASA del handler)**; B) dejar los dos, como describe la guía; C) dejar solo `_gestionarGpsOverlays` y ampliarlo | no (si se hace bien); la guía §2.5 cambia |

Esta tabla se lee junto con R2.9 (2026-10-03), que corrige el alcance de K-04, K-20, K-24, K-25 y K-49, da dos lecturas a la opción A de K-49, añade K-50 a K-54 y ordena todo lo pendiente por complejidad y por dependencias.

**Límites residuales** (los de R2.7 siguen valiendo). M-8 es de campo y no se midió. M-14 a M-18 y la sonda de M-20 se midieron en chromium con el stub de MapLibre (las roturas de M-20 y M-19, en los cuatro proyectos; M-21, en firefox) y recorren el arranque, la apertura del asistente y los cambios de modo, no todos los flujos de la aventura; que `PADRE_DATOS` tiene solo dos emisores lo dice la búsqueda desnuda, no la medición. El efecto de K-24 con una aventura no española en vivo no se midió: se deduce de las tres líneas de código. Cada borrado se apoya en búsqueda desnuda y lectura del llamador; un acceso por clave computada (`obj['nombre']`) no lo ve ninguna de las dos (límite del instrumento de exports, K-42). Los verificadores corregidos en K-34 imprimen su residuo, pero siguen siendo análisis estático.

### R2.9 Revisión de las decisiones abiertas y otros ángulos (2026-10-03)

**Alcance y límite.** A petición del usuario, las 23 decisiones abiertas de R2.8 se volvieron a revisar «hasta los cimientos»: no solo dónde vive el código y qué specs lo rozan, sino qué roza al que lo roza, en los dos sentidos, leyendo cada consumidor. Después se probaron otros ángulos que ni los 28 ejes ni las familias A a Q cubrían. No se aplicó ningún cambio de código. Se midió una sola cosa (M-22, en chromium, con el OK del usuario y nada más corriendo, regla 5). Cada hallazgo lleva su método (regla 10); lo que solo está leído lo dice. Con esta ronda las entradas son 54 (K-50 a K-54, familia S); R2.8 y su tabla de decisiones se leen junto con ella.

**Método.**
- Un grafo de acoplamientos con `acorn` (2204 nodos —funciones y manejadores—, con aristas de llamada, estado, `globalThis`, claves de almacenamiento, ids del DOM y mensajes de emisor a handler), con la regla de que un recurso solo acopla a frames que coexisten (`cierreDeFrame`). Da los consumidores exactos de cada cambio con su línea.
- Un escáner de los usos del objeto de estado entero (punto ciego del extractor de K-41), la clausura de imports de cada frame con y sin un módulo, las lecturas y escrituras de almacenamiento con su `try`, los globals usados en un bloque anterior al que los define, los imports que abortan un módulo y la cobertura del `APP_SHELL` por el cierre de imports de cada página.
- Búsqueda desnuda del nombre en todo el repo para toda ausencia y todo recuento, y lectura del código de cada consumidor. El grafo sobreaproxima: se siguió solo donde el comportamiento cambia de verdad.

Los instrumentos viven fuera del repo y no se versionan; lo que hay que repetir está en cada hallazgo.

**Límites.** Los de R2.7 más estos: el grafo no resuelve alias locales y trata `estado` y `estadoPadre` como raíces distintas (por eso K-41 se repitió con nombre desnudo); M-22 es de chromium y reproduce la activación con los mensajes que manda, no con la pantalla de selección; nada se midió en firefox, ni en los móviles emulados.

#### R2.9.1 Correcciones y añadidos a las entradas existentes

Cada una lleva su nota fechada dentro de la entrada; esta tabla las resume.

| Entrada | Qué corrige o añade | Cómo se comprobó |
|---|---|---|
| K-02 | 8 hojas vivas confirmadas; con K-04 = A quedan 7; `AUDIO.VOLUMEN_DEFECTO` contradice el volumen al máximo; la tabla GPS de la guía presenta seis parámetros sin lector | búsqueda desnuda con las formas `?.`; lectura de la guía |
| K-04 | una afirmación falsa (hijo1 e hijo5 no activan el monitoreo) y un radio mayor: `registrarEvento` en 13 puntos de llamada, `Promise.all` posicional, `config.js` de hijo1 e hijo5, `app.js`, tipo del bus, `sw.js` y herramientas | clausura de imports; búsqueda desnuda; lectura de `_hdl_AUDIO_ERROR` |
| K-07 | la espera pasa de 0 a unos 100 ms sin bloquear; ningún spec cubre la ruta | lectura de los cinco hijos y de los cinco consumidores |
| K-11 | `adelantarLatido` cuenta fallos y puede recargar un hijo; ningún spec fija el handler | lectura de `enviarHeartbeatAHijos` |
| K-12 | confirmada: ningún spec ni herramienta cita el texto; `ventanaPadre` se calcula después del aviso | búsqueda desnuda |
| K-17 | confirmada: seis sitios con los mismos plazos; comparte código con K-49 | búsqueda de `getCurrentPosition` |
| K-19 | `ejecutarElegirOtra` sin spec; ninguna de las dos copias reinicia el modo ni la parada (K-50) | lectura de los dos cuerpos; búsqueda en los specs |
| K-20 | la rama «sin modal» es una carrera entre Script 1 y Script 2 (K-54); con A vaciaría todo el almacenamiento | lectura de `_finalizarInicializacion`, `validarMensajeriaFase1` y `limpiarDatosAventura` |
| K-24 | tres emisores de `RETO.MOSTRAR` y no uno; el snapshot no lleva `idioma` | búsqueda desnuda; lectura de los tres |
| K-25 | la opción A deja en español el botón 🆘❓ y «Iniciar reto»; hijo4 ya importa el módulo de traducciones | lectura de hijo4 |
| K-28 | confirmada, sin cambio | lectura |
| K-35 | (1) y (2) sin emisor ni spec; solo cambian cifras de la guía | búsqueda desnuda con `despacharLocal` |
| K-37 | confirmada, sin cambio | lectura |
| K-40 | `conectado` sin lectores en todo el repo (el de la spec 84 es un helper local) | búsqueda desnuda |
| K-41 | los instrumentos no ven el objeto entero ni unifican `estado` y `estadoPadre`; las filas se mantienen; dependencias | escáner de usos enteros; búsqueda desnuda por campo |
| K-42 | la cadena completa y los seis sitios de la guía; comparte función con K-11 | búsqueda desnuda |
| K-43 | confirmada, sin cambio | lectura |
| K-45 | confirmada: ningún spec cita el texto del `error` | búsqueda desnuda |
| K-46 | asimetría con `COORDENADAS_CARGADAS`; la rama de error de `TEXTOS_CARGADOS`; cifras de la guía | búsqueda desnuda; lectura de los tres handlers |
| K-47 | confirmada; ningún spec fija la clase de hijo2; selector que no puede casar | búsqueda desnuda |
| K-48 | confirmada; ningún spec cubre el resalte | lectura línea a línea; búsqueda en `tests/` |
| K-49 | tres llamantes y no uno; dos lecturas de A | grafo de llamadas; lectura de los tres |

#### R2.9.2 Comprobado sin hallazgo

- El `APP_SHELL` (61 entradas) cubre el cierre de imports de todas las páginas; solo falta `debug-brujula.html`, que nadie carga (`cierreDeFrame` de cada página contra la lista de `sw.js`).
- Los 10 `setItem` de `localStorage` y `sessionStorage` van dentro de `try` o de un envoltorio (`safeSessionStorage`), y de los seis `JSON.parse` de valores guardados cinco van dentro de `try`; el sexto (`_restoreLoadFromStorage`) lo atrapa su llamador (R2.9.3).
- La orientación en iOS ya pide el permiso (`DeviceOrientationEvent.requestPermission`, `js/funciones-mapa.js:1760`).
- Doble toque en hijo4: `verificar()` desactiva `btnEnviar` y `_pendienteCompletado` se anula antes del envío, así que `RETO.COMPLETADO` no se duplica.

#### R2.9.3 Menores y una pregunta

- `_restoreLoadFromStorage` (`codigo-padre.html:4428`) no tiene `try` propio; lo atrapa `restoreProgressFromStorage`. Un `vv_progreso` corrupto nunca se purga y repite el `warn` en cada arranque hasta que se reescribe. **Aplicado (2026-10-04).** `_restoreLoadFromStorage` captura el `JSON.parse`, escribe «vv_progreso corrupto, descartando» a nivel `warn` y borra la clave. **Medido** con el flujo real (sesión guardada válida, `vv_progreso` corrupto, «Continuar» y recarga): en AVENTURA la propia reanudación reescribe `vv_progreso` con un valor válido, así que el aviso no se repetía, antes ni después; con la persistencia omitida (CASA, ver §24) la clave seguía corrupta y el aviso salía en cada arranque, y ahora se purga y el segundo arranque dice «No hay progreso persistido». La mutación que quita la purga, servida por la red, devuelve el aviso repetido. La premisa de esta nota solo valía en ese segundo camino.
- Tres lecturas de `vv_idioma` en la selección (`En-busca-del-tesoro.html:1727`, `:1870` y `:2693`) sin `try`: solo importan si el navegador bloquea el almacenamiento. **Aplicado (2026-10-04).** Los tres sitios leen con un `try` en línea, el mismo idioma que usa el padre (`codigo-padre.html:2917`, `:11956`). **Medido** con `getItem('vv_idioma')` lanzando `SecurityError`: antes, `_mostrarErrorAccesoP13` no pintaba el overlay, `_ejecutarDespedida` se rechazaba sin mostrar la despedida y `_checkUrlParams`, con `?despedida=1`, mandaba `SISTEMA.HIJO_FALLIDO` al padre y no mostraba P17; después, los tres se comportan como con el almacenamiento libre. La nota decía que solo importaba si el navegador bloquea el almacenamiento: en ese caso rompe el flujo de despedida. 97 tests de 17 specs de la selección y la reanudación, todos en verde en chromium; `npm run lint` sale con 0. La sonda del sitio 3 no medía nada hasta que el bloqueo se registró en el contexto y no en una sola página.
- **Pregunta.** No hay coordinación entre instancias de la PWA (`BroadcastChannel`, `navigator.locks` y el evento `storage`: 0 coincidencias en el repo): dos instancias comparten las claves `vv_*` y cada una tiene su GPS y su audio. Sin medir; ¿es un caso que se quiere cubrir?

#### R2.9.4 Todo lo que queda por arreglar, de menor a mayor complejidad

**Baremo.**

| Nivel | Qué significa |
|---|---|
| 0 | sin trabajo: la opción recomendada es dejarlo |
| 1 | mecánico: un fichero o un nivel de log, sin consumidores que cambien; basta `npm run lint` |
| 2 | acotado: de dos a cuatro ficheros, sin cambio visible; borrado con búsqueda desnuda y lectura del llamador; no hace falta spec nuevo o basta uno corto |
| 3 | con prueba o con contrato: hace falta un spec nuevo antes (rojo y después verde), o toca tipos o handlers del bus o cifras que la guía y las herramientas fijan, o hay una decisión por sitio |
| 4 | de comportamiento: cambia lo que ocurre en el arranque, en el cambio de modo o en AVENTURA, o toca cimientos (estado compartido, handshake, latido) o muchos ficheros; exige spec nuevo, a veces medición, y puede regresar |
| 5 | de diseño o de contenido: decisión de producto o trabajo grande (12 idiomas, versión de lo guardado) |

**Marcas.** BUS: toca el bus (regla 1, OK expreso). SPEC: spec nuevo antes. MEDIR: medición previa. VISIBLE: cambia lo que ve el usuario. GUÍA: cifras o frases de la guía que cambian.
**Dependencia.** *Dura*: no tiene sentido o no se puede hacer bien sin lo otro. *Blanda*: se puede en cualquier orden, pero se pisan (mismo fichero o función) o se editaría dos veces.

| # | Nivel | Entrada | Qué es | Marcas | Depende de | ¿Se puede sola? |
|---|---|---|---|---|---|---|
| 1 | 0 | K-17 B | dejar los seis `getCurrentPosition` hasta la prueba de campo M-8 | — | — | sí |
| 2 | 0 | K-28 B | dejar las familias de copias | — | — | sí |
| 3 | 0 | K-37 A | dejar `'casa'`, `'aventura'` y `destino: 'padre'` | — | — | sí |
| 4 | 0 | K-43 B | dejar los cuatro nombres del id de parada (A al tocar el contrato de `CAMBIO_PARADA`) | — | — | sí |
| 5 | 1 | K-45 B | hijo6: bandera «estado recibido» y `debug` hasta el primero — **hecha (2026-10-04)** | — | — | sí |
| 6 | 1 | K-12 A | `mensajeria.js`: el `warn` del almacén local solo en el padre, comprobando «¿soy el padre?» en línea — **hecha (2026-10-04)** | BUS (solo un nivel de log) | — | sí |
| 7 | 1 | K-47 B | hijo2: retirar la regla CSS y la clase `modo-*` del `body` — **hecha (2026-10-04)** | — | — | sí |
| 8 | 1 | Menores (R2.9.3) | purgar un `vv_progreso` corrupto; `try` en tres lecturas de la selección — **hechos (2026-10-04)** | — | — | sí |
| 9 | 2 | K-40 A | retirar el camino 3 de `offline` y `online` y `estado.conectado` — **hecha (2026-10-04)** | — | — | sí; **K-41 depende de ella** |
| 10 | 2 | K-35 (1) A | retirar el handler `AVENTURA.FINALIZADA` del padre — **hecha (2026-10-04)** | BUS, GUÍA | — | sí |
| 11 | 2 | K-42 A | retirar la cadena `gpsPendientes` (state-manager y `mensajeria.js`) — **hecha (2026-10-04)** | BUS, GUÍA | — | sí; comparte `procesarHeartbeatResponse` con K-11 |
| 12 | 2 | K-53, `efectos-sonido.js` | `import()` dentro de `try` con respaldo inerte en el padre, hijo4 y el puzzle — **hecha (2026-10-04)** | SPEC corto | — | sí |
| 13 | 2 | K-02 A | vaciar `CONFIG` de lo que no se lee (7 hojas vivas tras K-04) — **hecha (2026-10-04)** | GUÍA | blanda: K-04 antes | sí, pero se tocaría `config.js` dos veces |
| 14 | 3 | K-35 (2) A | retirar el handler `UI.CLOSE_MENUS` de hijo1 y la exención `except` — **hecha (2026-10-04)** | SPEC, GUÍA | — | sí |
| 15 | 3 | K-48 A | hijo5: una función que marque `actual` (solo herramienta de desarrollo, ver §24) — **hecha (2026-10-04)** | SPEC | — | sí |
| 16 | 3 | K-52 | reservas `'Aventura1'`, y las de idioma — **hecha: el sitio del padre (2026-10-18, `99006df`); el resto, con el idioma y en los once frames (2026-10-19, `cf47a3a`)**; el de hijo2 y el de mapa-completo, con K-107; el de `api-client.js`, con `4c0895a` | una decisión por sitio | — | sí |
| 17 | 3 | K-24 A | `RETO.MOSTRAR` lleva `idioma`: tres emisores, snapshot, hijo4 y una línea muerta de hijo2 — **hecha (2026-10-04)** | SPEC, VISIBLE, GUÍA | — | sí; **K-25 depende de ella** |
| 18 | 3 | K-19 A | función común de «abandonar la aventura» — **hecha (2026-10-20, `de801ba`): las dos salidas recargan; fuera `_ocultarUIActivada`, `_resetBrujulaModo` y `NAVEGACION_PANTALLA`** | SPEC, VISIBLE, BUS | — | sí |
| 19 | 3 | K-20 A | la rama «sin modal» llama a `limpiarDatosAventura('timeout')` — **hecha (2026-10-19, `26e156d`, con K-54)** | SPEC | blanda: K-54 | sí |
| 20 | 3 | K-41 | retirar siete campos de estado, en cinco pasos — **hecha (2026-10-05)** | GUÍA | **dura:** K-04, K-40 y K-07; blanda: K-19 | no |
| 21 | 3 | K-46 B | retirar `RETO.MOSTRADO` y `RETO.CONFIRMADO`, y `DATOS.TEXTOS_CARGADOS` | BUS, GUÍA (94 a 91 tipos) | **dura:** K-41 (hecha); blanda: K-24 (mismo bloque de hijo2) | no |
| 22 | 4 | K-04 A | retirar el monitoreo dejando `registrarEvento` como logger (`monitoreo.js`, hijo1, hijo5, hijo2, `app.js`, `constants.js`, `config.js`, `sw.js`, herramientas, guía) — **hecha (2026-10-04)** | BUS (tipo `MONITOREO.METRICA`), GUÍA | — | sí; **K-02 (blanda) y K-41 (dura) dependen de ella** |
| 23 | 4 | K-07 A | `olvidarHijoListo` en el state-manager y su llamada en `_normalizarSetHijos` — **hecha (2026-10-05)** | SPEC (la ruta no tiene), MEDIR | — | sí; **K-41 depende de ella** |
| 24 | 4 | K-50 | la aventura nueva arranca con la parada de la anterior (producción) — **cerrada en la vuelta rápida (K-95, `c9c90fb`); en la reanudación no hay nada que arrastrar (leído): K-19, hecha (2026-10-20, `de801ba`)** | — | — | sí |
| 25 | 4 | K-49 A | cierre único de los carteles de distancia GPS, en su lectura A1 o A2 | SPEC (`DENTRO_DE_RANGO`), VISIBLE si A2, GUÍA | blanda: releer K-17 | sí |
| 26 | 4 | K-11 A | «volver a la pestaña» por `adelantarLatido()` — **sin objeto (2026-10-06): el latido no se pausa en ningún modo y `adelantarLatido` se borra con K-57** | BUS, SPEC, MEDIR, GUÍA | — | sí; comparte `procesarHeartbeatResponse` con K-42 |
| 27 | 4 | K-54 | que Script 1 espere a `mostrarModalTiempoAgotado` en el arranque — **hecha de raíz (2026-10-19, `26e156d`): el arranque espera a `script2Listo`; carrera medida** | SPEC (Script 2 retrasado), MEDIR | bloquea a K-20 | sí |
| 28 | 4 | K-53, resto | importaciones no esenciales de los demás frames con respaldo | — | — | sí |
| 29 | 5 | K-25 A | textos de usuario en 12 idiomas: `alert()` y botón 🆘❓ de hijo4, y los mensajes de fallo de la selección | VISIBLE, traducciones de usted | **dura:** K-24 en la parte de hijo4 | la parte de la selección, sí |
| 30 | 5 | K-51 | versión de los datos en el progreso guardado — **decidida (2026-10-19 noche): C, sin versión; el usuario no cambia paradas de una aventura publicada con sesiones vivas** | decisión de producto, SPEC | — | sí |
| 31 | 2 | K-55 A | retirar `app_inicializada` y `pagina_cargada`, dos eventos de arranque que nunca se registran — **hecha (2026-10-05)** | GUÍA (la tabla generada de §37.2; §26.4 no cambia) | — | sí |
| 32 | 2 | K-56 B | `config.js` publica `__vv_config` solo en la ventana de arriba — **hecha (2026-10-05)** | SPEC (NH-4 con hijo2), GUÍA (§26.3 y la fila del spec 60 de §18.3) | blanda: K-02 (`config.js`) | sí |
| 33 | 4 | K-57 | recuperación común de un hijo que no completa el apretón de manos (cargadores, `HIJO_PREPARADO`, latido, `HIJO_FALLIDO`) | BUS, SPEC (los cuatro fallos), MEDIR, GUÍA (sección «Reconexión de hijos fallidos») | blanda: K-58 (el plazo) y K-07 (la misma espera) | **pasos 1 a 5 hechos (2026-10-06, `1cd71c5`, `1bb2af0`, `343126a`, `2a88a77` y `36236aa`)** |
| 34 | 3 | K-58 | detectar el fallo de carga sin esperar 30 s y escalar ese plazo con la conexión | SPEC, MEDIR, VISIBLE (el tiempo hasta el aviso) | blanda: K-57 | **hecha (2026-10-06, `343126a`): la gracia escala con la conexión y ninguna espera de `HIJO_LISTO` tiene plazo propio; no se usa la señal del `contentDocument` ilegible** |
| 35 | 3 | K-59 | que el chat roto no cubra la pantalla sin salida | SPEC, VISIBLE, GUÍA | blanda: K-57 | **hecha (2026-10-06, `2a88a77`): hijo6 se carga con `cargarHijo` y se ve al estar listo; sin salida que decidir** |
| 36 | 3 | K-60 | plazo y caída a la caché en el Network First de `sw.js` | SPEC (SW real), MEDIR, GUÍA | toca `sw.js` (`CACHE_VERSION`, shell) | decisión |
| 37 | 2 | K-63 A | quitar la espera de «padre listo» de la selección y de hijo1, con `TIMEOUT_PARENT`, `padreConectado`, `parentReady` y sus dos claves de la respuesta al latido — **hecha (2026-10-07, `fd367da`)** | GUÍA (§26.12.3, §26.12.4 y §37.2) | — | sí |
| 38 | 3 | K-62 | doce esperas escritas a mano: llevarlas a `retryUntilAvailable` o dejarlas | una decisión por sitio | blanda: K-72 (las dos de `distribuirDatosAventura`) | sí |
| 39 | 1 | K-64 | retirar tres variables muertas de `js/funciones-mapa.js` — **hecha (2026-10-13, `18cfe1f`)** | — | — | sí |
| 40 | 1 | K-65 | retirar `limpiar()` del bus — **hecha (2026-10-13, `93cb6dc`), con `colaMensajes`** | BUS | — | sí |
| 41 | 2 | K-66 | retirar `COMPONENTE_ID`, `VERSION` y `DEBUG` de `CONFIG_PADRE` y ajustar el test del spec 02 que las pide — **hecha (2026-10-13, `2ddb79f`), con `ID`, que tampoco tenía lector** | — | — | sí |
| 42 | 3 | K-67 | un nombre por función en el objeto API del state-manager y retirar lo que no usa nadie | BUS (el bus usa dos alias); specs que lo usan de sonda | — | sí |
| 43 | 3 | K-68 | retirar 23 guardas de `origen` inalcanzables, en seis frames — **hecha (2026-10-13, `1e1a660`)** | — | — | sí |
| 44 | — | K-69 | CSS sin uso: leer cada caso antes de proponer — **hecha (2026-10-13, `7f415a8`; `video-intro.html` el 2026-10-14, `9ee6c05`); las tres reglas de hijo3 con nota de «se mantiene», hechas (2026-10-19, `3b2eefa`); abre una decisión: el color del ✓ y la ✗ de los retos de la selección (K-92)** | — | — | sí; lo que abre, decisión (K-92) |
| 45 | 4 | K-70 | una sola forma de la respuesta al latido, en los siete frames; aparte, la de hijo5 sin latido | BUS, GUÍA | — | sí |
| 46 | 1 | K-71 | el círculo naranja toma su radio de `radioLlegada()` — **hecha (2026-10-13, `8f36e78`)** | — | blanda: K-05 (las constantes del radio) | sí |
| 47 | 3 | K-72 | la reanudación espera `distribuirDatosAventura` con plazo y con el aviso | SPEC (Script 2 cortado), GUÍA | blanda: K-62, K-53 resto | sí |
| 48 | 3 | K-73 | que la llegada de un elemento ya cerrado no cree ficha, o un solo sensor (K-06) — **hecha (2026-10-13, `479b06a`): A, en `ensurePending`** | SPEC | blanda: K-74 (el mismo par de sensores) | sí |
| 49 | 4 | K-74 | un solo dueño del elemento actual para el mapa y para hijo2 | SPEC, VISIBLE (el cartel de inicio y el botón de vídeo), MEDIR | blanda: K-14 (el orden de `vv-parada-cambiada`), K-73 | sí |
| 50 | 2 | K-75 | el reloj de la ficha empieza al activarse en AVENTURA (solo desarrollo), y cuatro comentarios que no se sostienen — **los comentarios, corregidos (2026-10-13, `583b3aa`); el reloj, por decidir** | — | — | sí |
| 51 | 2 | K-76 | hijo4: un campo para el reto de la parada y otro para el reto abierto — **hecha (2026-10-14, `6f1eaf5`): el reto de la parada no lo leía nadie, así que no hace falta un segundo campo; fuera la escritura** | SPEC (133) | — | sí |
| 52 | 5 | K-77 | el texto del cartel de llegada al punto de inicio, en doce idiomas | VISIBLE, traducciones de usted | blanda: K-74 (que no salga dos veces) | sí |
| 53 | 2 | K-78 | la marca del rescate pedido y la compleción con la misma clave | SPEC, VISIBLE (un cartel menos tras el rescate), GUÍA si B | — | sí |
| 54 | 5 | K-79 | qué dice (o si sale) el cartel al cerrar el último elemento, en doce idiomas | VISIBLE, traducciones de usted | blanda: K-77 (la misma familia de carteles) | sí |
| 55 | 3 | K-80 | hijo2 y el `PENDING_INICIADO`: retirar la rama que no corre, o que el aviso lleve el id que hijo2 conoce | BUS si se retira el envío, SPEC, GUÍA; VISIBLE y MEDIR si B | blanda: K-73 (el mismo aviso), K-78 y K-81 (la misma forma) | sí |
| 56 | 1 | K-81 | retirar `_notificarParadaCompletada`, que no borra nada — **hecha (2026-10-13, `53bcac4`)** | — | blanda: K-78 (la misma función) | sí |
| 57 | 4 | K-82 | que volver dentro de rango, o la recarga de hijo3, no apague el botón de retos con el audio ya resuelto — **hecha (2026-10-13, `5318ef7`): un solo sitio decide el botón** | SPEC, VISIBLE (hoy bloquea la parada en los idiomas sin audio) | blanda: K-07 (la recarga de hijo3 llega a lo mismo) | sí |
| 58 | 3 | — (arnés de tests) | el ayudante `cargarHijosDelPadre` en los specs que cargan los hijos del padre con un `page.evaluate`, y después la tanda de los cuatro navegadores — **hecha (2026-10-13, `88db770`), con la guarda del ayudante corregida y el spec 126** | SPEC, GUÍA (un párrafo) | — | sí |
| 59 | 2 | K-83 | una sola función para las coordenadas del punto de inicio, y qué devuelve cuando no hay entrada de inicio | — | blanda: K-38 (el nombre `AVENTURA_PARADAS`) | sí |
| 60 | 4 | K-84 | el cartel del bloqueo de 5 km: que mande mientras dura el bloqueo, o que el bloqueo no tenga cartel propio | MEDIR, SPEC, VISIBLE, GUÍA | blanda: K-49 (el cierre de ese mismo cartel en CASA) | sí (medido: M-25) |
| 61 | 4 | K-85 | que reactivar un elemento ya completado (recarga de la página, recuperación de hijo2) lo deje listo para avanzar — **hecha (2026-10-13, `f78d521`)** | SPEC, VISIBLE | blanda: K-86 (el mismo botón), K-87; K-51 si se guarda la ficha | sí (medido: M-23) |
| 62 | 4 | K-86 | un solo sitio del padre para «avanzar», o un flag por motivo en hijo2 | SPEC, GUÍA | blanda: K-85, K-84 | sí |
| 63 | 3 | K-87 | que el rescate deje el reto como hecho — **hecha (2026-10-13, `f78d521`): la compleción no vuelve a preguntar por los retos** | SPEC, VISIBLE | blanda: K-85 | sí (medido: M-24) |
| 64 | 3 | K-88 | que el `HIJO_LISTO` de hijo3 y de hijo4 les devuelva su estado por el sitio que lo decide — **hecha (2026-10-13, `acfebb1`), medida antes en el spec 125** | SPEC | blanda: K-07 (la recuperación de un hijo) | sí |
| 65 | 4 | K-89 | guardar la ficha del elemento actual para que lo hecho en él sobreviva a una recarga, por un solo sitio que la escriba — **hecha (2026-10-13, `e249843`): opción A** | SPEC, VISIBLE, GUÍA | dura: K-85 (antes); blanda: K-51, K-73 | sí |
| 66 | 2 | K-87 (resto) | retirar `estado.retoActual.disponible`, que se queda sin lector al aplicar K-87 (once escrituras en `codigo-padre.html`) — **hecha (2026-10-13, `489f14d`)** | SPEC (lo comprueban el 39, el 44 y el 122), GUÍA | — | sí |
| 67 | 2 | K-90 | que la activación decida el recordatorio «pulse retos» y prepare la cola de retos mirando lo que el elemento tiene hecho — **hecha (2026-10-13, `e249843`), con K-89** | SPEC, VISIBLE (el aviso vuelve tras reanudar o recuperarse hijo2) | dura: K-89 | sí |
| 68 | 3 | K-91 | el rescate que queda sin cobrar si la app se recarga entre el «Sí» y «avanzar» (medido: M-26): cobrar al conceder, o guardar el apunte del cobro | SPEC (el 72 mide el cobro al avanzar), VISIBLE (la cuenta de rescates), GUÍA (§25.19) | blanda: K-78 (la otra marca del rescate) | decisión |
| 69 | 2 | K-92 | el color del ✓ y la ✗ de los retos de la selección: que el JavaScript ponga la clase, pasar el color a la regla base, o dejarlo en negro | SPEC (el color calculado), VISIBLE | blanda: K-69 (las reglas sin elemento de ese mismo fichero) | decisión (medido: M-27) |
| 70 | 3 | K-94 | el calor de iphone12: la espera al arranque terminado en `gotoAndWaitForFase1` y el vigía térmico — **hecha (2026-10-13, `88db770`)**; quedan los tres navegadores enteros con la espera, y mirar qué gira en una página cerrada a medio arrancar | SPEC, MEDIR, GUÍA (§38) | blanda: K-62 (las esperas escritas a mano), la fila 58 | sí (medido: M-28) |
| 71 | 3 | K-95 | «Elegir otra aventura» del diálogo de vuelta recarga la página — **hecha (2026-10-14, `c9c90fb`)**; queda `ejecutarElegirOtra()` (K-19) | SPEC (128, 19, 25), GUÍA | blanda: K-19, K-50 | sí |
| 72 | 2 | K-96 | la tarjeta de confirmación se pinta al mostrarse, de la variable que usa el código — **hecha (2026-10-14, `4c0895a`)** | SPEC (127), GUÍA | — | sí |
| 73 | 1 | K-97 | la aventura elegida en tres sitios de la selección: dejar una — **hecha (2026-10-14, `9ca0bec`)** | SPEC (82, 127) | blanda: K-96 | sí |
| 74 | 2 | K-98 | qué se reinicia al cambiar de idioma y qué al cambiar de aventura (hoy tres listas, y elegir aventura no reinicia nada); y las redacciones de los retos 1 y 2 — **igualadas (2026-10-14, `d5868b4`)** | SPEC, VISIBLE (el reto 1 vuelve a preguntarse tras la ✗ de la P9), DATOS (textos del usuario) | — | decisión (medido: M-31) |
| 75 | 1 | K-99 | los cuatro tipos de mensaje escritos a mano en el script clásico de la selección: leerlos de `globalThis.TIPOS_MENSAJE` — **hecha (2026-10-14, `c9fd1c0`)** | SPEC (85, 74, 127, 129) | — | sí (un solo camino posible) |
| 76 | 1 | K-100 | las cuatro reglas CSS de `#pantalla8 .audio-overlay`: retirarlas o apuntarlas a la pantalla 11 — **hecha: apuntadas (2026-10-14, `ac7d165`)** | VISIBLE | blanda: K-69, K-92 | sí |
| 77 | 2 | K-101 | el diálogo de vuelta decide «aventura en curso» con la aventura y el idioma elegidos, que se llenan en la selección — **hecha con K-105 (2026-10-14, `0aafe4e`)** | SPEC, VISIBLE | **dura:** K-105 (el mismo escucha) | sí |
| 78 | 1 | K-102 | el arnés no espera a la comprobación de la aventura guardada (300 ms tras `sistemaInicializado`) — **hecha (2026-10-18, `46e36a3`)** | SPEC (arnés) | blanda: K-94 | sí |
| 79 | 1 | K-103 | `_accionPantalla5` y `_accionPantalla15` con nombres sin número, y retirar `tools/renumber-pantallas.js` — **hecha: el parche (2026-10-14, `9647f77`) y los nombres (`45e60ac`)** | — | — | sí |
| 80 | 2 | K-104 | los dos envíos con el tipo de respaldo escrito a mano (`js/utils.js` y `abrirChat()` del padre): leerlo de `TIPOS_MENSAJE`, sin literal — **hecha (2026-10-14, `783a75f`)**; las dos publicaciones del puente (y de otros cuatro alias) en el padre, **hechas (2026-10-18, `901e3a7`)** | SPEC (los de `SISTEMA.ERROR` y el asistente), GUÍA | blanda: K-99 | sí (un solo camino posible) |
| 81 | 4 | K-105 | el diálogo de vuelta no sale en el primer «atrás» de una sesión: que el escucha no dependa del estado de la entrada, y un solo sitio para «aventura en curso» | SPEC (atrás de verdad), VISIBLE, GUÍA (§34), prueba en un móvil real | cierra K-101 | **hecha (2026-10-14, `0aafe4e`)**; falta la prueba en un Android real |
| 82 | 1 | K-106 | el seguro de «aventura terminada» del rescate con el id bueno del modal de fin — **hecha (2026-10-14, `d5d6ca6`)** | SPEC (72, CR-6) | — | sí |
| 83 | 2 | K-107 | la aventura del mapa completo (y del vintage) la decide solo el padre, con la elegida: hijo2 y el mapa no la dicen | SPEC, BUS (datos de tres mensajes) | blanda: K-109 | **hecha (2026-10-18, `c01007d`; sus specs, en verde en los cuatro navegadores)** |
| 84 | 1 | K-108 | quitar `siguienteParadaNombre` y `paradasRestantes` del estado que el padre manda al asistente — **hecha (2026-10-18, `64f4abf`)** | SPEC (47, CH-3) | — | sí |
| 85 | 1 | K-109 | la aventura elegida en un solo sitio del padre: fuera `estado.seleccion.aventura` y los dos respaldos — **hecha (2026-10-19, `cf47a3a`, con K-52)** | — | — | sí |
| 86 | 1 | K-110 | el nombre de parada que el asistente adjunta al buzón, del elemento en curso (`estadoPadre.elementoActual`) y no de `AVENTURA_PARADAS[indiceProgreso]` — **hecha (2026-10-19, `ad8a484`)** | SPEC | — | sí |
| 87 | 1 | K-111 | retirar `globalThis.registrarControlador`, que la aplicación no lee, y que la espera de FASE 1 del arnés y los specs 02 y 07 dejen de pedirla — **hecha (2026-10-19, `5d2e56a`)** | SPEC (arnés: arranque de todos los specs) | — | sí |
| 88 | 1 | K-112 | el nombre de la aventura y el del idioma, cada uno con una función que lo lee del índice y una reserva ruidosa; el reloj y la tarjeta de la selección, con `error` — **hecha (2026-10-19, `2f3b2ff`)** | SPEC | blanda: K-52 | sí |
| 89 | 2 | K-113 | el banner de versión nueva pide su propia tabla de traducciones y sale en el idioma del usuario también al arrancar — **hecha (2026-10-19, `02a0fe9`)** | SPEC, VISIBLE (el idioma del banner), GUÍA | blanda: K-52 | sí |
| 90 | 1 | K-114 | `index.html` con un solo camino hacia el padre: fuera el `setTimeout`, la regla de HTTPS y el registro del SW repetidos — **hecha (2026-10-19, `a93ff42`)** | GUÍA | — | sí |
| 91 | 4 | K-61 | un solo camino para la parada por defecto al entrar en AVENTURA: retirar el pre-warm de `js/app.js` si la activación de más sigue (se mide antes) — **hecha (2026-10-19, `8cf40ab`): seguía (medido); fuera la activación y sus banderas, la espera a los hijos se queda** | SPEC, MEDIR, GUÍA | blanda: K-73, K-89 | sí |
| 92 | 1 | K-41 (resto) | fuera `estado.paradasConfirmaciones` del padre y la lectura de `estado.ubicacionUsuario` de hijo5, que nadie escribe — **hecha (2026-10-19, `177e731`)** | GUÍA | blanda: K-46 (el handler que queda en un log), K-36 | sí |
| 93 | 1 | K-36 (dos claves) | fuera las claves de `SOLICITAR_DATOS_PARADAS` y el `incluirMetadatos` de dos peticiones de coordenadas, que nadie lee — **hecha (2026-10-19, `177e731`), también el `padreId` de esas peticiones** | GUÍA (la carga útil del mensaje) | blanda: K-41 (resto) | sí |
| 97 | 1 | K-41 (hijo2) | fuera `estadoComponente.arrayParadasLocal` de hijo2, que solo lee el log de su handler — **hecha (2026-10-19, `304ceda`)** | — | — | sí |
| 98 | 2 | K-115 | un solo bucle de dibujo en el puzzle: `draw()` solo programa el siguiente fotograma si no hay uno pendiente — **hecha (2026-10-19, `ba98ae4`)** | SPEC (140) | — | sí |
| 99 | 1 | K-116 | que `diagnosticarGPS()` lea el «GPS activo» de su dueño, el estado del padre (el módulo solo lo carga el padre: corrección del 2026-10-19) | SPEC | blanda: K-122 | sí — **hecha (2026-10-19, `aea2670`), con K-122** |
| 100 | 4 | K-117 | que el elemento actual tras restaurar lo decida un solo dato guardado (el id) — **decidida (2026-10-19 noche), con K-51 C: el id decide; sin preparar** | SPEC, MEDIR | **dura:** K-51 | sí |
| 101 | 4 | K-07 (revisión) | dos conjuntos de «hijo listo»: que el supervisor del bus avise al padre al recargar un hijo, o un solo conjunto | BUS, SPEC, MEDIR | blanda: K-57 | decisión |
| 102 | 3 | R2.10 | las familias de homogeneidad: doce de la app (el log, el registro de handlers, el envío, el destino, las esperas —K-62—, los `catch`, el almacenamiento, los `import()` —K-53—, mostrar y ocultar, los eventos del DOM, las dos grafías del estado del padre, las copias —K-28—) y las de herramientas y tests; **la de los `catch` y la del almacenamiento, estudiadas sitio a sitio, con su propuesta (R2.10.6 y R2.10.7); la del almacenamiento, decidida y aplicada (`54b4e9b`)** | una decisión por familia, cada una con su línea en `CLAUDE.md` | — | decisión |
| 103 | 4 | K-118 | el cartel de llegada tapa la ventana del reto y se queda el primer toque — **hecha (2026-10-19, `54b4e9b`): pulsar retos o audio cierra el cartel** | VISIBLE, SPEC | blanda: K-49, K-84 | sí |
| 104 | 5 | K-119 | 61 pares de paradas contiguas con el mismo nombre y seis nombres con «FRONT» o «BACK»: los datos o el texto del cartel | VISIBLE, DATOS | — | decisión |
| 105 | 3 | K-15 (reabrir) | siete `SISTEMA.NACK` hacia el padre, que no los escucha: cerrada en R2.8 como intencional, la reabre el principio «todo handler registrado» (2026-10-14) | BUS | — | decisión |
| 106 | 3 | `AVENTURA_ACTIVADA` | el padre vuelve a escribir la aventura y el idioma elegidos al recibir `SELECCION.AVENTURA_ACTIVADA` (ya los guardan los handlers de la elección) y no lee `terminosAceptados` ni `timestamp` | BUS, SPEC | blanda: K-52 | decisión |
| 107 | 1 | K-102 (resto) | que el padre publique «comprobación de la aventura guardada terminada» en vez de que el arnés copie su condición | SPEC (arnés) | — | decisión |
| 108 | 2 | K-112 (resto) | la ventana de compra de `js/reciclaje-digital.js`: sin la entrada del índice, un `warn` y la aventura por no caducada | compra | — | decisión |
| 109 | 1 | K-114 (resto) | el texto de `index.html` (de tú y solo en español) y la etiqueta HSTS en `<meta>` de quince páginas, que el navegador no atiende | VISIBLE (index), servidor (HSTS) | — | decisión |
| 110 | 2 | R2.22 (3 px) | los 3 px que le faltan al desplegable del tipo de mapa en iPhone con las barras de Safari | VISIBLE | — | decisión |
| 111 | 3 | K-09 (resto) | leer de una en una `estado.retoActual` (ocho escritoras), las tres limpiezas del mapa y `limpiarRecursosPorModo` — **hecha (2026-10-19): `retoActual` da K-120; las limpiezas del mapa son una jerarquía, no caminos dobles (`limpiarPorEstado` y `limpiarRecursosInactivos` acaban en `limpiarRecursos`; la del cambio de modo la vigilan los specs 100 y 52)** | — | — | sí |
| 112 | — | M-8 | la prueba de campo del reintento del GPS en frío (15 s frente a 5 s) | campo | K-17 B | del usuario |
| 113 | 4 | K-120 | la cola de retos del elemento la prepara solo `_asegurarRetoActualDe()`; la reserva de `_hdl_RETO_SOLICITAR`, ruidosa o fuera; el vaciado, en una función | SPEC, MEDIR | blanda: K-87, K-90 | sí — **hecha (2026-10-19, `54b4e9b`)** |
| 114 | 3 | K-121 | el índice lo carga el padre en un solo sitio, la fase 1, antes que todos sus lectores; la selección, sin parámetro en la URL — **hecha (2026-10-19, `7a92883`)** | SPEC, GUÍA | — | sí |
| 115 | 2 | G-88 | §22.12 frente a `PROTECTED_FILES`, y los dos módulos protegidos que la selección importa antes del pago (puzzle de introducción, audio) | GUÍA, compra | — | decidido el qué (el usuario: lo que usa la demo gratis se carga antes del pago); falta el cómo |
| 116 | 3 | K-122 | un solo dueño del estado del GPS en el padre: fuera las dos ramas de `manejarGPSActivar()` que no corren y `estadoMapa.gpsActivo`, `.gpsPermisos` y `.gpsError` con su copia en el espejo | SPEC, GUÍA | blanda: K-116 | **hecha (2026-10-19, `aea2670`), con K-116 (decisión del usuario: juntas)** |
| 117 | 2 | K-123 | el padre carga `suppress-warnings.js` una sola vez, como las demás páginas (fuera los dos `import`) — **hecha (2026-10-19, `54b4e9b`)** | — | blanda: R2.10.7 | sí |
| 118 | 2 | K-124 | pre-intro1 y pre-intro2 comparten `parada_id: "null"` (texto): contar los otros idiomas y decidir el dato | datos | — | decisión |
| 119 | 3 | K-125 | el idioma guardado se borra en las ocho vueltas a la elección de idioma: el padre lo borra al recibir `SELECCION.REINICIAR`, que la selección pasa a enviar también en «No, cambiar» (P3) y en el «No» del aviso sin audio | SPEC, BUS, GUÍA | blanda: K-19 | **decidida (2026-10-19 noche, el usuario: A, borrarlo en las ocho); hecha con K-19 (2026-10-20, `de801ba`)** |
| 94 | 1 | R2.11.8 | retirar `tests/flujo_bidireccional_exhaustivo.json`, sin lector — **hecha (2026-10-19, `f89554d`), con `tests/analyze_controllers_report.json`, que tampoco tiene lector** | — | — | sí |
| 95 | 1 | K-34 (el generador) | que el generador de §37.2 no cuente como uso un nombre citado en un comentario — **hecha (2026-10-19, `0312bd2`)** | GUÍA (la tabla generada) | — | sí |
| 96 | 1 | K-93 (resto) | fuera tres publicaciones en `globalThis` que nadie lee fuera de su bloque (`_avisarFalloCargaAppUnaVez`, `_obtenerCoordenadasP0Fallback` y `waitForMapLibreAndInitialize`) y su entrada de `eslint.config.js` — **hecha (2026-10-19, `e57a4e8`)** | GUÍA (§37.2) | — | sí |

#### R2.9.5 Qué depende de qué

- **Cadena larga.** K-04, K-40 y K-07 → K-41 → K-46. K-41 espera a los tres porque retira campos que ellos sostienen (`estado.monitoreo.metricas`, `estado.conectado`, `hijosPreparados` y `estadoHijos.*.listo`), y K-46 espera a K-41 porque la asimetría de `DATOS.COORDENADAS_CARGADAS` solo se resuelve cuando `seleccion.coordenadasCargadas` ya no existe.
- **Otra cadena.** K-24 → K-25 (la parte de hijo4: el `alert` necesita el idioma que K-24 hace llegar).
- **Condicionada a una decisión.** K-54 → K-20: si se elige esperar a la función en lugar de decidir qué hace el degradado, K-20 A deja de ser la respuesta.
- **Blandas** (en cualquier orden, pero se pisan): K-04 y K-02 (`config.js` dos veces); K-19 y K-50 (la misma función, que además escribe campos de K-41); K-11 y K-42 (`procesarHeartbeatResponse`); K-17 y K-49 (el cierre de carteles); K-24 y K-46 (el bloque de `DATOS.CARGAR_COORDENADAS` y `CARGAR_TEXTOS` de hijo2); K-04 y K-40 (`app.js`, líneas distintas); K-52 y K-50 (el sitio del padre).
- **Sin ninguna dependencia:** K-45, K-12, K-47, K-35 (1), K-35 (2), K-48, K-42, K-49, K-11, K-51, K-53, los menores de R2.9.3 y las cuatro entradas «dejar».
- **Ficheros compartidos.** `codigo-padre.html` lo tocan dieciséis de las decisiones (K-04, K-07, K-11, K-19, K-20, K-24, K-35 (1) y (2), K-40, K-41, K-46, K-49, K-50, K-52, K-53 y K-54): una por commit, releyendo el fichero entre una y otra, porque las líneas se desplazan.

#### R2.9.6 Specs y mediciones que faltan antes de tocar código

- **Specs nuevos (rojo antes de verde):** K-07 (la ruta fallback espera al `HIJO_LISTO` nuevo), K-11 (el handler del `visibilitychange` respeta la pausa), K-19 (`ejecutarElegirOtra` por `#btn-confirmar-otra`), K-20 (la rama «sin modal», si A), K-24 (`idioma` en cada emisor de `RETO.MOSTRAR`), K-35 (2) (abrir «más opciones» cierra el desplegable de audio del padre), K-48 (el resalte de hijo5 sobrevive a `CAMBIO_PARADA_CONFIRMADO`), K-49 (`DENTRO_DE_RANGO` con un cartel abierto) y K-50 (la sonda de M-22, ya como spec del camino de producción).
- **Mediciones:** el contador de fallos de K-11 con un hijo a 2; el efecto visible de K-50 con la pantalla de selección real; la carrera de K-54 retrasando Script 2 con `page.route` (como el spec 89, S2-4); lo que sea de K-51 si se decide A o B. M-8 sigue siendo de campo.

### R2.10 Censo de homogeneidad (2026-10-05)

**Qué es.** El usuario pide buscar homogeneidad en el código **en general**, por consistencia con el proyecto (2026-10-05), no solo en el apretón de manos, y decide que `js/server.js`, `tools/` y `tests/` **entran** (2026-10-05). Hasta aquí este estudio dejó las copias y las formas distintas como «coste de mantenimiento, no una avería» (K-28) y marcó «dejar» en cuatro filas de nivel 0 de R2.9.4 (K-17 B, K-28 B, K-37 A y K-43 B). Este censo mide, por cada decisión que el código toma, **cuántas formas distintas hay, dónde y cuál es la mayoritaria**: R2.10.1 la PWA, R2.10.4 el servidor, la configuración, las herramientas y los tests. No decide nada: las decisiones se toman con el usuario, familia a familia.

**Método.** `censo-homogeneidad.cjs`, `censo-eventos-dom.cjs` y `censo-ambitos.cjs` (en el scratchpad de la sesión, **no versionados**; se pueden llevar a `tools/estudio-caminos/` si se quiere repetir): `acorn` con `tools/lib/analisis-js.js`, solo lectura. **La PWA:** 38 ficheros (las 17 páginas de la raíz, 20 módulos de `js/` y `sw.js`), 0 bloques sin parsear. **Los demás ámbitos:** `js/server.js`, `eslint.config.js`, `playwright.config.js`, 77 ficheros `.js`/`.cjs`/`.mjs` de `tools/` y 142 de `tests/` (134 `.js` y 8 `.html`; la lista sale de `git ls-files`), 0 sin parsear. **Quedan fuera:** los 11 módulos de datos de `MODULOS_DE_DATOS` (medido con el parser: 0 funciones y 0 llamadas en cada uno), `js/parrafos-textos` (12 JSON), `js/vendor` (código ajeno, como ya dice el estudio), lo que no es JavaScript (`verify_https.sh`, 2 `.ps1` de `tests/`, JSON y Markdown) y lo generado e ignorado por git (`tests/e2e/report/` y `tests/e2e/playwright-report.json`, `.gitignore:32-33`). El analizador compartido deja `js/server.js` fuera de `modulos()` («sin el servidor de desarrollo», `tools/lib/analisis-js.js:70`); el censo de R2.10.4 sí lo incluye. Cada llamada, asignación o literal se clasifica por su forma. **Validación de la PWA** contra un recuento de texto independiente, fichero a fichero (comentarios blanqueados): coincide en almacenamiento, registro de handlers, `style.display`, `import()` y envío de mensajes, y difiere en tres recuentos (dos del padre y uno de `puzzle.html`), todos explicados con su línea: (1) las 5 llamadas al logger y los 6 `catch` que el texto ve de más en `codigo-padre.html` están dentro de la plantilla de texto de `_handleHijo5IframeLoad` (`codigo-padre.html:122-161`, que el padre inyecta como `<script>` en hijo5 y el parser trata como una cadena; logger en las líneas 152, 154, 156, 159 y 160, `catch` en 130, 152, 154, 155, 159 y 160, medido por diferencia de líneas entre el texto y el parser); (2) `puzzle.html:10` usa `logger.debug?.(…)`, que el parser cuenta y la regla de texto no. **Validación de los otros ámbitos:** 5 diferencias, todas explicadas: `tools/install-hooks.js:40-43` (un hook de git escrito dentro de una plantilla: 1 `console.error`, 1 `process.exit`, 1 `catch`), `tools/renumber-pantallas.js:220-221` (anclas de parche escritas como cadenas: 2 `catch`) y `tests/e2e/helpers/boot.js:221` (un mensaje de error que cita `page.goto()`). La validación encontró errores en las primeras versiones de los instrumentos (en el de los ámbitos: un `require('fs').readFileSync` encadenado que no reconocía y una importación de la librería con `require(path.join(…))` que no veía), corregidos antes de este informe. Una etiqueta se corrigió después de publicar una primera versión de R2.10: el censo agrupaba por el nombre `logger.x` y lo llamaba «importado»; el enlace de `logger` se comprobó fichero a fichero con el parser (`enlaces-logger.cjs`) y 4 de los 16 ficheros no lo importan con `import` estático (R2.10.1). **No cubre:** claves computadas (`globalThis[x]`): con ese patrón hay una sola, `codigo-padre.html:14732` (un bucle que limpia temporizadores); nombres construidos en plantillas de texto, que no se han medido porque no hay forma sistemática de comprobarlos; y el código escrito dentro de cadenas, que el censo no ve (en la PWA, la plantilla de `codigo-padre.html:122-161`: una búsqueda por patrón de `srcdoc`, `new Function`, `eval(` y `createTextNode(` con plantilla no encuentra otro sitio). Es lectura sintáctica: dice cuántas formas hay, no si dos formas son equivalentes. `js/proteccion.js` entra solo por su forma sintáctica; lo que hace ese módulo no se estudia aquí (igual que en K-38).

#### R2.10.1 Las familias de la PWA

| Decisión | Formas y sitios (entre paréntesis, ficheros) | Lo medido | Relacionadas |
|---|---|---|---|
| Escribir en el log | 1905 sitios: (globalThis.logger \|\| console).x **925** (11 fich.); logger.x (import estático) **924** (12 fich.); logger.x (alias local de la forma global o parámetro) **17** (1 fich.); logger.x (inyectado como parámetro) **15** (1 fich.); console.x directo **9** (4 fich.); logger.x (import() dinámico) **8** (1 fich.); globalThis.logger.x **2** (1 fich.); otra forma: loggerIframe **2** (1 fich.); logger.x (alias local de la forma global) **2** (1 fich.); otra forma: loggerScript2 **1** (1 fich.) | Los seis hijos, la selección y `puzzle` enlazan `logger` con `import logger from './js/logger.js'` (comprobado enlace por enlace con el parser; retos-hijo4 tiene además 2 `console.x`, la selección 9 de la forma global y `puzzle` 1). El padre enlaza `logger` con un `import()` dinámico (`let logger = loggerScript2`, `:9726`) en 8 sitios y usa la forma global: 882 sitios. En `js/`, usan la forma global `api-client.js`, `constants.js`, `data-loader.js`, `feedback-forms.js`, `state-manager.js`, `utils.js`, `video-playback-utils.js` (`data-loader.js` además la usa 2 veces con `const logger = globalThis.logger \|\| console`, `:175` y `:185`), enlazan con `import` estático `app.js`, `efectos-sonido.js`, `funciones-mapa.js`, `mensajeria.js`; `js/reciclaje-digital.js` (17) usa ese mismo alias local (`:52`, `:132`, `:184`) o un parámetro (`:32`), y `js/controladores-padre.js` (15) recibe `logger` inyectado (`deps.logger`; el padre lo construye con `logger_S1 \|\| globalThis.logger \|\| console`, `js/controladores-padre.js:15`). K-39 da la razón para los módulos compartidos (cada iframe tiene su propio `globalThis` y publica `globalThis.logger`); **no se ha comprobado** que esa razón explique también las 882 del padre | K-39 |
| Registrar un handler | 142 sitios: registrarControladorSeguro **85** (9 fich.); globalThis.registrarControladorSeguro **45** (1 fich.); addEventListener('message') directo **3** (3 fich.); globalThis.mensajeria.registrarControlador **2** (1 fich.); bus.registrarControlador **2** (1 fich.); registrar (local de js/app.js) **2** (1 fich.); registrarControlador [alias _Sn] **1** (1 fich.); registrarControlador **1** (1 fich.); sm.registrarManejador **1** (1 fich.) | En los seis hijos y en la selección `registrarControladorSeguro` **no es otra función**: es un alias (`const registrarControladorSeguro = bus.registrarControlador`: `extrainfo-hijo1.html:63`, `coordenadas-hijo2.html:419`, `audio-hijo3.html:510`, `retos-hijo4.html:456`, `boton-casa-hijo5.html:352`, `chat-hijo6.html:469`, `En-busca-del-tesoro.html:2576`). El único envoltorio real es el del padre (`codigo-padre.html:5217`): lleva su propio conjunto `__CONTROLADOR_REGISTRADOS` y descarta el duplicado con un `warn` (`:5221`) antes de que llegue al bus, cuyo `registrarControlador` (`js/mensajeria.js:226`) ya lo rechaza con un `error`: dos comprobaciones de «handler duplicado». El comentario del envoltorio (`:5192-5193`) dice que los siguientes intentos «se ignoran silenciosamente»; el código escribe un `warn`. Fuera del alias: la selección llama 2 veces a `globalThis.mensajeria.registrarControlador` (`:1631-1632`), `mapa-completo` 2 a `bus.registrarControlador` (`:273, 280`), `js/app.js` usa una función local `registrar` (`:76, 80`) y `js/funciones-mapa.js:2716` llama a `registrarControlador`. Los 3 `addEventListener('message')` directos son el del propio bus (`js/mensajeria.js:131`), el canal del service worker en el padre (`codigo-padre.html:15010`) y el del worker (`sw.js:186`) | K-10 |
| Enviar un mensaje | 232 sitios: enviarMensaje **132** (11 fich.); enviarMensaje [alias _Sn] **62** (1 fich.); globalThis.mensajeria.despacharLocal **15** (3 fich.); globalThis.mensajeria.enviarMensaje **13** (4 fich.); enviarMensajeConConfirmacion **6** (4 fich.); bus.enviarMensaje **2** (2 fich.); globalThis.enviarMensajeConConfirmacion **1** (1 fich.); globalThis.enviarMensaje **1** (1 fich.) | Cada frame llama al bus a su manera: el padre por alias (`_S1`, `_S2`: cinco scripts de scope separado, ver «Funciones en scope separado» de CLAUDE.md), `mapa-completo` y `puzzle` como `bus`, `video-intro` por `globalThis.mensajeria`. Los seis hijos usan `enviarMensaje` pelado, y hijo2, hijo4 y hijo6 además `enviarMensajeConConfirmacion` | K-10 |
| Destino de un mensaje | 220 sobres: destino: 'padre' (literal) **130** (13 fich.); destino: 'hijo2' (literal) **23** (2 fich.); destino: 'hijo3' (literal) **15** (1 fich.); destino: mensaje.origen **13** (4 fich.); destino: 'hijo4' (literal) **8** (1 fich.); destino: destinoEntendido **6** (3 fich.); destino: destino **5** (2 fich.); destino: hijoId **5** (3 fich.); destino: 'hijo1-opciones' (literal) **4** (1 fich.) | Los seis hijos usan `destino: 'padre'` literal; hijo2, hijo3 y hijo4 usan además `destino: destinoEntendido` (2 cada uno). El censo deja aparte 7 `destino:` que no clasificó como sobre, leídos uno a uno: `codigo-padre.html:5797` **sí es un sobre** (`{ ...payload, destino: 'hijo2' }`, el censo no lo cuenta porque el literal no lleva `tipo`), `js/mensajeria.js:326` y `:335` leen o registran el campo de un sobre, `codigo-padre.html:11394`, `:11402` y `js/funciones-mapa.js:3332` son el origen y el destino geográficos de una polilínea, y `js/funciones-mapa.js:852` es un tamaño de icono | K-37 |
| Esperas y plazos | 173 sitios: setTimeout **106** (22 fich.); setInterval **27** (11 fich.); sleep() **17** (2 fich.); retryUntilAvailable **8** (3 fich.); setTimeout dentro de while **6** (6 fich.); Promise.race **6** (4 fich.); withTimeout **3** (1 fich.) | `setTimeout` dentro de un `while` en En-busca-del-tesoro.html:2634, codigo-padre.html:15165, coordenadas-hijo2.html:1052, extrainfo-hijo1.html:134, js/app.js:244, js/funciones-mapa.js:2123. El ayudante `retryUntilAvailable` (`js/utils.js:222`, con tope `maxIntentos`, 10 por defecto; el padre lo expone en `:2995`) aparece 8 veces en 3 ficheros (`codigo-padre.html` 6, `js/app.js` 1, `js/utils.js` 1) | — |
| Qué hace un `catch` | 654 sitios: un solo log (error) **182** (12 fich.); varias sentencias **169** (22 fich.); un solo log (warn) **128** (16 fich.); un solo logger.debug('[VV]:', e.message) (modismo) **91** (1 fich.); vacío **47** (11 fich.); un solo log (debug) **21** (4 fich.); relanza **11** (7 fich.); una sola llamada que no es log **5** (4 fich.) | El modismo `debug('[VV]:', e.message)` (91) existe **solo en el padre**. 47 `catch` tienen el cuerpo sin sentencias (puede llevar comentario): codigo-padre 21, js/funciones-mapa.js 11, En-busca-del-tesoro 3, retos-hijo4 3, js/proteccion.js 2, js/state-manager.js 2, extrainfo-hijo1 1, video-intro 1, js/mensajeria.js 1, js/suppress-warnings.js 1, js/utils.js 1 | ninguna entrada dedicada |
| Leer y escribir el almacenamiento | 52 sitios: localStorage con try **42** (5 fich.); localStorage SIN try **6** (1 fich.); sessionStorage SIN try **3** (1 fich.); sessionStorage con try **1** (1 fich.) | Con `try` 43 de 52; el padre mezcla las dos formas (34 con `try`, 6 sin). Sin `try`: codigo-padre.html:4389, codigo-padre.html:4396, codigo-padre.html:4409, codigo-padre.html:4418, codigo-padre.html:4423, codigo-padre.html:13132, js/api-client.js:65, js/api-client.js:71, js/api-client.js:78. Más un alias, `const ls = globalThis.localStorage` (`js/suppress-warnings.js:79`) | menores de R2.9.3 |
| Importar de forma dinámica | 90 sitios: import() dentro de try **49** (4 fich.); import() sin protección **39** (5 fich.); import() con .catch/.then **2** (2 fich.) | Sin protección 39 de 90 (codigo-padre 29, js/data-loader.js 6, chat-hijo6 2, En-busca-del-tesoro 1, boton-casa-hijo5 1). No se ha distinguido cuáles son esenciales por diseño | K-53 |
| Mostrar y ocultar | 221 sitios en 20 formas: `style.display` 131 ("none" 59, "block" 23, "flex" 20, (expr) 13, "" 9, "inline" 3, "inline-block" 3, "inline-flex" 1), `style.visibility` 18, y `classList` con tres vocabularios: `show` **30** (padre, video-intro, selección), `visible` **31** (padre, selección, hijo6, mapa-completo) y `activo` 8 (video-intro, hijo3, hijo2) | Tres mecanismos para lo mismo, y tres vocabularios de clase | K-33 |
| Enganchar un evento del DOM | 296 sitios: `addEventListener` **225** (22 fich.); propiedad `on*` (`x.onclick = …`) **30** (5 fich.); atributo `on*="…"` en el marcado **41** (2 fich.); `setAttribute('on…')` **0** | Mezclan dos o tres formas en el mismo fichero: la selección (`addEventListener` 16, propiedad 4, atributo 36), `codigo-padre` (103 y 20), `puzzle` (13 y 2), `extrainfo-hijo1` (5 y 2) y `boton-casa-hijo5` (2 y 2). Los 41 atributos están en la selección (36) y en `video-intro` (5) y llaman por su nombre a funciones globales: 19 nombres distintos en la selección (R2.3 dice 18; no se ha comprobado cuál es la diferencia) y 4 en `video-intro` más `location.reload()`. R2.3 ya los revisó a mano y el censo coincide en 41 (36 y 5); otros 3 atributos están dentro de cadenas de JS de la selección (residuo, no forma de enganche). `sw.js` aporta 4 `addEventListener` que son del worker, no del DOM, y `js/mensajeria.js` 1, el del bus | R2.3 |
| El estado del padre | 506 sitios: estado.x **440** (3 fich.); globalThis.estadoPadre.x **64** (4 fich.); estadoPadre.x **1** (1 fich.); globalThis.estado.x **1** (1 fich.) | En el padre, `estado.` 387 y `globalThis.estadoPadre.` 53 | ninguna entrada dedicada (K-41 trata campos sin lector, no la grafía) |
| Copias de un mismo algoritmo | `enviarHijoListoConReintento`: **6** copias, una por hijo (`audio-hijo3.html:1194`, `boton-casa-hijo5.html:831`, `chat-hijo6.html:738`, `coordenadas-hijo2.html:1517`, `extrainfo-hijo1.html:246`, `retos-hijo4.html:1278`); escapar HTML: **9** funciones y 8 tablas de escape, todas en el padre (K-28 cuenta ×8; no se ha comprobado de dónde sale la diferencia); `sleep` ×2 (`codigo-padre.html:2872`, `js/utils.js:274`); detección de móvil: la lista del padre (`:4078`), la de `js/proteccion.js:24` y la de `js/device-detection.js:45-54`, más dos regex de iOS en el padre (`:6655`, `:6735`); vibrar: 3 formas en 3 sitios (`En-busca-del-tesoro.html:1570`, `codigo-padre.html:8696`, `retos-hijo4.html:692`) | Es el recuento de K-28 con el instrumento nuevo | K-28 |
| Enviar un `postMessage` | 7 sitios: `js/mensajeria.js` 4, `sw.js` 2, el padre 1 (`:15064`, al service worker) | Coincide con K-16 («`postMessage` solo en `mensajeria.js` … y en el canal del SW») | K-16 |

**Frames del censo (regla 3b) sin hallazgo, por familia:** logger: sin hallazgos en mapa-completo. `import()`: sin hallazgos en extrainfo-hijo1, coordenadas-hijo2, audio-hijo3, mapa-completo, video-intro. `catch`: sin hallazgos en mapa-completo. vibración: solo con hallazgos en codigo-padre, En-busca-del-tesoro, retos-hijo4. registro de handlers: sin hallazgos en puzzle, video-intro. almacenamiento: solo con hallazgos en codigo-padre, En-busca-del-tesoro. modo: sin hallazgos en chat-hijo6, puzzle, video-intro. `enviarHijoListoConReintento`: sin hallazgos en codigo-padre, En-busca-del-tesoro, mapa-completo, puzzle, video-intro. id de parada: sin hallazgos en En-busca-del-tesoro, extrainfo-hijo1, chat-hijo6, mapa-completo, puzzle, video-intro. estado del padre: solo con hallazgos en codigo-padre. escapar HTML: solo con hallazgos en codigo-padre. `sleep`: solo con hallazgos en codigo-padre. detección de móvil: solo con hallazgos en codigo-padre. `postMessage`: solo con hallazgos en codigo-padre. alias de almacenamiento: sin hallazgos en ninguno de los once (el sitio está en un módulo de `js/`). evento (propiedad on* = …): sin hallazgos en coordenadas-hijo2, audio-hijo3, retos-hijo4, chat-hijo6, mapa-completo, video-intro. evento (atributo on*="…" en el marcado): solo con hallazgos en En-busca-del-tesoro, video-intro. Las seis páginas restantes de la raíz (`consejos-valencia`, `debug-brujula`, `gastronomia`, `index`, `paginas-oficiales-valencia`, `videos-valencia-historica`) están entre los 38 ficheros analizados pero no son de los once frames del censo.

#### R2.10.2 Qué dicen las cifras

- **Los seis hijos coinciden entre sí en lo que es del bus:** logger con `import` estático,`enviarMensaje` pelado, `registrarControladorSeguro` como alias de `bus.registrarControlador` y `destino: 'padre'` literal (con `destinoEntendido` en tres). El padre usa otras formas para tres de esas decisiones y para el estado: la forma global del logger, los alias `_Sn` para enviar, `globalThis.registrarControladorSeguro` con su envoltorio, y las dos grafías del estado. No se ha medido cuánto de eso se debe a los cinco scripts de scope separado.
- **Dentro de un mismo fichero hay mezcla** en: el modo (padre y `js/funciones-mapa.js`), el estado (padre, 387 y 53), el almacenamiento (padre, 34 con `try` y 6 sin), el logger (`js/data-loader.js`, la selección y `puzzle.html`), el enganche de eventos (la selección, el padre, `puzzle`, hijo1 y hijo5) y el id de la parada (audio-hijo3, boton-casa-hijo5, codigo-padre, coordenadas-hijo2, retos-hijo4, js/app.js, js/funciones-mapa.js, js/utils.js).
- **Cifras de las formas sin protección:** 47 `catch` con el cuerpo sin sentencias, 9 accesos al almacenamiento sin `try` y 39 `import()` sin protección de 90. No se ha comprobado cuáles pueden fallar en producción ni cuáles son esenciales por diseño.
- **Coincide con el estudio:** K-28 (copias), K-16 (un solo `postMessage` de aplicación fuera del bus y del canal del SW), K-39 (la razón de la forma global del logger en módulos compartidos) y R2.3 (41 atributos `on*`). **Lo corrige o precisa:** K-43 cuenta cuatro nombres del id y el censo cinco; K-28 cuenta ×8 las funciones de escapar HTML y el censo 9; R2.3 cuenta 18 nombres de función en los atributos de la selección y el censo 19.
- **Fuera de la PWA** (R2.10.4): la librería compartida de las herramientas casi no se usa (6 de 76 la importan y 32 ficheros llaman a `acorn.parse` directamente); los tests esperan de cuatro maneras y los diez `*.test.js` no los ejecuta nada.

#### R2.10.3 Pendiente: decisión por familia, con el usuario

Para cada familia hay que decidir **unificar o aceptar la copia**, y en el primer caso hacia qué forma. No se ha elegido ninguna: el censo da la forma mayoritaria y dónde se desvía cada sitio; si la mayoritaria es la buena, qué frames o ficheros toca y qué riesgo tiene cada cambio se estudia por familia con la lupa de R2.9 —quién escribe y quién lee, hacia arriba y hacia abajo— antes de proponer nada. De las cuatro filas de R2.9.4 con «dejar», tres tienen familia en este censo (K-28 B, las copias; K-37 A, los literales de modo y destino; K-43 B, los nombres del id); K-17 B (los seis `getCurrentPosition`) no la tiene, porque el censo no mide cómo se pide la posición. El censo mide formas, no comportamiento ante el fallo: los casos K-57 a K-60 no están en él.

#### R2.10.4 Servidor, configuración, herramientas y tests

Mismo método que R2.10.1, con las familias que estos ficheros ejercen de verdad: se partió de las llamadas más frecuentes de cada ámbito (`explora-ambitos.cjs`), no de la lista de la PWA. Las cifras no se mezclan con las de la PWA: un `console.log` en una herramienta no es la misma decisión que en un frame.

| Decisión | Formas y sitios (entre paréntesis, ficheros) | Lo medido | Relacionadas |
|---|---|---|---|
| **Herramientas** (77 ficheros). Sistema de módulos | .cjs · solo require **50** (50 fich.); .js · solo require **16** (16 fich.); .cjs · solo require + import() **6** (6 fich.); .js · solo require + import() **3** (3 fich.); .mjs · solo import **2** (2 fich.) | `package.json` no declara `type`, así que `.js` y `.cjs` son los dos CommonJS: dos extensiones para lo mismo | K-28 |
| Herramientas. Reutilizar el analizador | importan `tools/lib/analisis-js.js`: **6** de 76; llaman a `acorn.parse` directamente: **33** veces en 32 ficheros | Los que importan la librería son `codigo-muerto`, `comentarios-nombres-citados`, `globals-sin-lector`, `tipos-citados`, `verificar-frames` y `verificar-mensajeria` (un `grep` desnudo de `analisis-js` en `tools/` y `tests/` da los mismos seis, más la propia librería y el README). Ninguno de ellos llama además a `acorn.parse`. Las 33 llamadas directas pasan 10 textos de opciones distintos. Hay una segunda librería, `tools/estudio-caminos/lib.cjs` (`ROOT` y `salida`), que importan 54 ficheros | K-28 |
| Herramientas. Copias de funciones | 21 nombres que se repiten en 3 o más ficheros; 40 de 77 ficheros definen al menos uno | `walk` ×27 (7 cuerpos distintos), `blocksOf` ×19 (5 cuerpos distintos), `listFiles` ×14 (7 cuerpos distintos), `main` ×10 (10 cuerpos distintos), `P` ×6 (idénticas), `isHtml` ×5 (idénticas), `parse` ×5 (2 cuerpos distintos), `fnName` ×5 (idénticas), `pathOf` ×5 (3 cuerpos distintos), `extractBlocks` ×5 (4 cuerpos distintos). «Idénticas» es el mismo cuerpo con los comentarios quitados y los espacios colapsados; mismo nombre no implica misma función, y `main` es un nombre convencional | K-28 |
| Herramientas. Leer ficheros | readFileSync con 'utf8' **95** (68 fich.); leer() propia (el fichero no importa analisis-js) **7** (2 fich.); leer() de analisis-js (sin BOM, LF) **3** (2 fich.) | `leer` de la librería quita el BOM y pasa CRLF a LF (`tools/lib/analisis-js.js:55-59`); las lecturas directas no lo hacen en la propia llamada, y no se ha medido si cada herramienta lo hace después | K-28 |
| Herramientas. Salida de texto | console.log **317** (75 fich.); console.error **31** (10 fich.); console.warn **7** (4 fich.) | — | — |
| Herramientas. Código de salida | process.exit(0) **9** (6 fich.); process.exit(1) **8** (6 fich.); process.exitCode = **3** (3 fich.); process.exit((expr)) **2** (2 fich.); process.exit(2) **1** (1 fich.) | 13 ficheros con `process.exit(n)`, 3 con `process.exitCode =` y 0 con las dos; 16 de 77 fijan algún código | — |
| Herramientas. Raíz del repo y rutas | __dirname + 1 nivel(es) hacia arriba (path.resolve) **11** (11 fich.); __dirname + 2 nivel(es) hacia arriba (path.resolve) **2** (2 fich.); path.join(__dirname, '..', 'En-busca-del-Tesoro.html') **1** (1 fich.); path.join(__dirname, '..', 'tests', 'e2e') **1** (1 fich.); path.join(__dirname, 'esperas-base.json') **1** (1 fich.); __dirname + 1 nivel(es) hacia arriba (path.join) **1** (1 fich.) | Ninguna llamada de `fs` con la ruta relativa como literal (0 con el parser; control: un `grep` desnudo de `readFileSync('x'`, `readdirSync('x'`, `existsSync('x'`… en `tools/`, `tests/` y `js/server.js` también da 0) | — |
| Herramientas. Argumentos | process.argv.includes **16** (8 fich.); process.argv.slice **6** (6 fich.); process.argv.find **2** (2 fich.) | — | — |
| Herramientas. `catch` | vacío **29** (26 fich.); varias sentencias u otra forma **20** (13 fich.); un solo console.x **2** (1 fich.); relanza **1** (1 fich.) | 29 de 52 tienen el cuerpo sin sentencias, en 26 ficheros | — |
| **Tests** (142 ficheros). Ejecutor | Playwright (@playwright/test) **118** (118 fich.); describe/it sin Playwright **10** (10 fich.); html **8** (8 fich.); sin runner (helper, fixture o script) **6** (6 fich.) | Los diez `describe/it` son los `tests/*.test.js`: `tests/README.md:10` dice «Hoy no los ejecuta nada: no hay jest ni vitest instalados ni script `test` en `package.json`». Además cargan `../backend/…` y `backend/` no está en el repo (`git ls-files backend`: 0 ficheros; no existe en disco) | — |
| Tests. Esperar | waitForTimeout **200** (57 fich.); waitForFunction **154** (78 fich.); expect.poll **149** (38 fich.); setTimeout **49** (22 fich.); waitForSelector **29** (12 fich.); waitForLoadState **15** (6 fich.); waitForURL **1** (1 fich.) | Cuatro maneras principales de esperar. `npm run verificar-esperas` (ejecutado el 2026-10-05): «159 esperas ciegas, igual que la base. 39 marcadas como ventana de observación» | — |
| Tests. Omitir | test.skip(condición, motivo) **104** (28 fich.) | Una sola forma | — |
| Tests. Cargar la página | ruta relativa (baseURL) **27** (13 fich.); otro literal **9** (3 fich.); variable o expresión **7** (5 fich.) | El origen `localhost:8080` aparece como literal 1 vez en `tests/` y 2 en `playwright.config.js` | — |
| Tests. Ruta al stub de MapLibre | `path.join(__dirname, 'helpers/maplibre-stub.js')` definido en **96** specs de `tests/e2e` | `tests/e2e/helpers/boot.js:10` lo documenta como el uso esperado (`addInitScript({ path: path.join(__dirname, 'helpers/maplibre-stub.js') })`); 108 specs importan `helpers/boot` (`grep` desnudo) | — |
| Tests. Copias de funciones | 16 nombres que se repiten en 3 o más ficheros; 42 de 142 ficheros definen al menos uno | `frame` ×6 (idénticas), `prepararAventura` ×6 (6 cuerpos distintos), `cargarHijo2Real` ×5 (3 cuerpos distintos), `prepararPadreConAventura` ×4 (4 cuerpos distintos), `mostrarReto` ×4 (3 cuerpos distintos), `esperarPipelineListo` ×4 (4 cuerpos distintos), `puntoADistancia` ×4 (idénticas), `prepararEscenario` ×4 (4 cuerpos distintos), `enviarLectura` ×4 (idénticas), `frameSeleccion` ×4 (3 cuerpos distintos) | — |
| Tests. `catch`, salida y lectura | `catch`: varias sentencias u otra forma **25** (16 fich.); vacío **18** (16 fich.); un solo console.x **1** (1 fich.). Salida: console.log **25** (4 fich.); console.warn **2** (1 fich.); console.error **2** (1 fich.). Lectura: leer() propia (el fichero no importa analisis-js) **14** (5 fich.); readFileSync con 'utf8' **2** (2 fich.); readFileSync SIN codificación (Buffer) **1** (1 fich.) | 18 de 44 `catch` están vacíos, en 16 ficheros | — |
| Tests. Sistema de módulos | .js · solo require **109** (109 fich.); .js · solo require + import() **21** (21 fich.); .html · solo import **4** (4 fich.); .html · ninguno **4** (4 fich.); .js · ninguno **4** (4 fich.) | — | — |
| **Servidor** (`js/server.js`, 257 líneas) y **configuración** (`eslint.config.js`, `playwright.config.js`) | Servidor: console.log **7** (1 fich.); console.warn **3** (1 fich.); `catch` varias sentencias u otra forma **1** (1 fich.); lectura readFile SIN codificación (Buffer) **1** (1 fich.); raíz process.cwd() **1** (1 fich.); módulos .js · solo require **1** (1 fich.). Configuración: módulos .js · solo require **2** (2 fich.); origen `localhost:8080` como literal ×2 | El servidor usa `console` y `process.cwd()`; ninguna herramienta usa `process.cwd()` (las que derivan la raíz usan `__dirname`). La lectura sin codificación es de un servidor que entrega los bytes tal cual | — |

Nada de este censo ha tocado un fichero del proyecto salvo este documento; los once frames de la PWA no cambian.

#### R2.10.5 Familias decididas y pasos (2026-10-05)

El orden es el de menos conflicto (criterio del usuario, 2026-10-05): primero lo que no llega al usuario final, no cruza frames y no toca un helper compartido. Cada paso se comprueba antes de darlo por hecho. La forma elegida de cada familia se escribirá después como regla de una línea en `CLAUDE.md`, con el alcance que la comprobación demuestre (pendiente del OK del usuario).

| Familia | Forma elegida | Paso | Estado |
|---|---|---|---|
| 1. Ruta de `goto` en los specs | ruta que empieza por `/`, resuelta contra el `baseURL` de `playwright.config.js` (`'/x.html'`): 28 sitios ya eran así | 1a: 13 líneas en 6 specs (28, 44, 50, 60, 86, 88): 9 `goto('x.html')` sin barra, 3 constantes sin barra (`MARCO` en 86 y 88, `HIJO6` en 88) y 1 `goto` con el origen escrito (60) | hecho, commit `1717ae8` |
|  |  | 1b: `tests/e2e/helpers/boot.js:227` (`MARCO_VACIO`; lo usa `abrirHijoEnMarco`, que llaman 16 specs) | hecho, commit `a54bca8` |
| 2. `src` de un iframe que inyecta un spec | ruta que empieza por `/` (la de 6 de los 11 sitios y la única que no depende de dónde esté el documento anfitrión) | 11 asignaciones `.src =`: 6 con barra (45, 58, 62, 86, 88 y `boot.js:258`) y 5 sin barra (21, 22, 30, 32 y 33: `iframe.src = 'coordenadas-hijo2.html'`); además, un `<iframe src>` con barra escrito en una cadena (54) | hecho (5 líneas en 5 specs), commit `7a87c05` |

**Comprobación del paso 1a.**

- **Las tres formas dan la misma URL.** `frames.js:504` de Playwright 1.59.1 resuelve `goto` contra el `baseURL` del contexto (`constructURLBasedOnBaseURL`, `urlMatch.js:215`); el `baseURL` es único (`playwright.config.js:35`) y ningún proyecto lo sustituye; `page.context().newPage()` comparte el contexto.
- **Sin Playwright:** las URL finales de las 14 llamadas a `goto` de los 6 specs, evaluadas antes y después con un script (literales, plantillas, `+`, constantes y variables de `for…of`), son idénticas; 0 no evaluables.
- **Con Playwright** (solo chromium, los 6 specs): 57 tests antes y 57 después, todos esperados, 0 inesperados, 0 saltados, 0 inestables, y la lista test por test es idéntica. No se lanzaron firefox, pixel5 ni iphone12: el cambio no altera la URL.
- **Control en rojo** (copias con la ruta rota, borradas después): cae algún test en cinco de los seis specs: 28 (AC-1), 44 (4 de 27), 50 (4 de 4), 60 (NH-3) y 88 (con `HIJO6` roto, VI-3 y VI-4; con `MARCO` roto, VI-1 y VI-2).
- **El spec 86 no vigila su `goto(MARCO)`:** con la ruta rota (`marco-vacio-NO-EXISTE.html`) los 15 tests siguen en verde. El spec no lee nada de la página del marco (no usa `__recibidos`, que es lo que `marco-vacio.html` aporta): monta su propio escuchador con `page.evaluate` e inyecta el iframe en el documento que cargó el `goto`. Esa línea queda comprobada solo por la evaluación sin Playwright. Registrado, sin tocar.
- **Herramientas:** `verificar-esperas` igual que la base (159 esperas ciegas, 39 marcadas). `verificar-citas` da 47 MAL y 46 SIN RESOLVER sobre 132 citas por número de línea; ninguna menciona los 6 specs, y las que detalla son de `codigo-padre.html` (20) y de `tools/verificar-citas-guia.js` (1); este paso no toca ninguno de los dos.

**Comprobación del paso 1b.**

- **Sin Playwright:** las URL finales de los dos `goto` de `boot.js` (`:132` y `:248`) son idénticas antes y después.
- **Con Playwright** (chromium, los 16 specs que llaman a `abrirHijoEnMarco`): 83 tests antes y 83 después, todos esperados, y la lista test por test es idéntica.
- **Control en rojo,** sin tocar `boot.js`: una copia del helper con `MARCO_VACIO` roto y una copia de cada uno de los 16 specs que la usa (borradas después). Caen tests en 15 de los 16: 104 (2 de 2), 105 (4 de 4), 109 (1 de 1), 112 (3 de 3), 115 (12 de 24), 116 (1 de 6), 119 (4 de 4), 120 (2 de 4), 26 (2 de 2), 31 (7 de 7), 38 (1 de 2), 43 (4 de 4), 61 (4 de 4), 91 (8 de 8) y 95 (2 de 2).
- **El spec 117 no cae (0 de 6)** aunque llama a `abrirHijoEnMarco` (`:78` y `:91`, con `esperarPreparado: false`): con el marco roto sus 6 tests siguen en verde. Registrado, sin tocar.

**¿La regla vale siempre? (verificado el 2026-10-05, con el paso 1b aplicado).**

- **Para `goto`, sí.** Censo por parser de todo `.goto(` (sobre cualquier objeto) en los 134 `.js` de `tests/` (la lista sale de `git ls-files`): 43 llamadas y 45 valores (la de `60-nivel-de-log-alcanza-hijos.spec.js:98` recorre tres páginas), todos con barra inicial; 0 absolutos, 0 sin barra, 0 de otro tipo y 0 no evaluables. Los 8 `.html` de `tests/` no tienen `.goto(`.
- **Otras formas de cargar o cambiar de página en `tests/e2e`:** `location.href`, `location.assign`, `location.replace`, `window.open`, `goBack`, `goForward`, `setContent`, `request.get/post/fetch/put` y `setAttribute('src'`: 0; `waitForURL`: 1 (con un predicado, sin ruta); `.reload(`: solo en un comentario; `.route(`: 13 (patrones de interceptación, no navegación). URLs `http(s)://`: 3, dos en comentarios de `113-…` y `OTRO_ORIGEN = 'https://otro-sitio.example'` en el 88 (el origen de un `postMessage`; no se navega a él).
- **Para el `src` de un iframe, no.** Un `src` relativo se resuelve contra el documento donde se inyecta, no contra `baseURL`: los specs 86 y 88 lo dicen en comentarios (el marco vive en `/tests/e2e/helpers/`) y 5 specs (21, 22, 30, 32 y 33) escriben `iframe.src = 'coordenadas-hijo2.html'` sin barra. Hoy dan la misma URL porque hospedan el iframe en `/codigo-padre.html`: los cinco abren la página con `gotoAndWaitForFase1`, que hace `goto('/codigo-padre.html')`, y ninguno llama a `.goto(` directamente. Por eso la regla de `CLAUDE.md` tiene que decir `goto` y no «navegar», y no puede decir «relativa a `baseURL`» para los iframes. Es la familia 2.

**Comprobación de la familia 2.**

- **Censo por parser** de toda asignación `x.src = …` en los 134 `.js` de `tests/`: 11, con 6 con barra y 5 sin barra antes del cambio, y las 11 con barra después.
- **Equivalencia medida dentro del navegador, en el momento real:** copias de los 5 specs con una sonda delante de la asignación que lanza un error si resolver `'coordenadas-hijo2.html'` y `'/coordenadas-hijo2.html'` contra `document.baseURI` da URL distintas. Los 27 tests de las copias pasan. No hay ninguna etiqueta `<base>` en las páginas y los tres `history.pushState` de `codigo-padre.html` (`:4661`, `:4858` y `:13119`) no pasan URL, así que la base no cambia.
- **Control de la sonda:** la misma sonda comparando contra otra página cae en los 5 specs (21: 5 de 5, 22: 1 de 9, 30: 1 de 6, 32: 4 de 4, 33: 3 de 3) con el error esperado: la sonda se ejecuta y detecta diferencias.
- **Con Playwright** (chromium, los 5 specs): 27 tests antes y 27 después, todos esperados, y la lista test por test es idéntica.
- **Ninguno de los cinco specs vigila el `src`:** con la ruta rota (`/coordenadas-hijo2-NO-EXISTE.html`) los 27 tests siguen en verde. Los cinco son exactamente los que definen `cargarHijo2Real`, que da el iframe por cargado en su evento `load` (un solo `addEventListener('load')` cada uno) y no lee nada del documento que cargó; un iframe que no carga también dispara `load` (K-58). A diferencia del spec 86, que comprueba que el documento cargado es el hijo y no una página de error. Registrado, sin tocar.

#### R2.10.6 La familia de los `catch` vacíos, estudiada sitio a sitio (2026-10-19)

Es la de menos conflicto de las doce de la app: no cambia nada de lo que ve el usuario y no toca el contrato del bus. Estudiada sin tocar código, para que el usuario solo tenga que decidir la regla.

- **Método.** `catch-vacios.cjs` (scratchpad): el parser sobre las 17 páginas de la raíz, `js/*.js` sin los de datos y `sw.js`; ningún bloque sin parsear. Salen 47, los mismos que el censo de R2.10.1. Leído cada uno con su `try`.
- **38 son de mejor esfuerzo** y no esconden nada: almacenamiento que puede no existir (modo privado: 6, en el padre y `js/suppress-warnings.js`); API opcionales (consulta de permisos, vibración, `fetchPriority`, `app-settings:` y tres `history.pushState`: 7); limpiezas de lo que puede haber desaparecido ya (once marcadores y capas del mapa, `clearWatch`, dos `clearInterval`, `pf.destroy()` de `video-intro.html`, el vaciado del registro de controladores y el giro del botón de audio: 17); leer la URL de un iframe que puede ser de otro origen (1); el aviso de versión al service worker (1); la comprobación que repite `retryUntilAvailable` (1); el panel de depuración (1); la huella de los handlers y un log de depuración del state-manager (2); y `js/proteccion.js` (2, módulo que este estudio no estudia, como en K-38).
- **9 esconden algo o sobran:**
  1. `codigo-padre.html:7224`: se traga sin decir nada un fallo de `_vv_afterHijoListo`, el gancho que devuelve su estado a un hijo que el supervisor ha recargado. Si falla, el hijo se queda con el estado equivocado y no queda rastro.
  2. `retos-hijo4.html:1328` (`mostrarUI()`), `:1236` y `:1352` (reponer el `display` del `body`): si fallan, hijo4 no se ve y no lo dice.
  3. `extrainfo-hijo1.html:744`: un `try` alrededor de `enviarMensaje`, que no rechaza nunca (devuelve `false`; leído en `js/mensajeria.js:319-341` y medido con K-52). Su `catch` no puede saltar.
  4. Cuatro `document.body.removeChild(overlay)` dentro de un `try` (`En-busca-del-tesoro.html:1795`, `:3144`; `codigo-padre.html:12839`, `:14699`): `overlay.remove()` no lanza aunque el nodo ya no esté, y es como lo quita el resto de la aplicación.
- **Propuesta de regla (decide el usuario; iría a `CLAUDE.md` como una línea):** un `catch` vacío solo para operaciones de mejor esfuerzo que pueden fallar sin consecuencia, y siempre con un comentario que diga por qué; si lo que falla deja algo sin hacer, el `catch` lo dice en el log. Aplicarla toca los nueve sitios de arriba: un `error` en los de los puntos 1 y 2 (el del padre, con un spec que haga fallar el gancho), fuera el `try` del punto 3, y `overlay.remove()` sin `try` en el punto 4.
- **Fuera de esta familia, por si se decide igual:** los 29 `catch` vacíos de `tools/` y los 18 de `tests/` (R2.10.4).

#### R2.10.7 La familia del almacenamiento, estudiada sitio a sitio (2026-10-19)

- **Método.** `almacenamiento-sin-try.cjs` (scratchpad): el parser sobre los mismos ficheros que R2.10.6, cada llamada a `localStorage` o `sessionStorage` con su función y si está dentro de un `try` en esa misma función; ningún bloque sin parsear; un alias (`const ls = globalThis.localStorage`, `js/suppress-warnings.js:79`, dentro de su `try`). Salen 41 llamadas: 32 dentro de un `try` y 9 sin él, las mismas 9 que contaba R2.10.1.
- **Las 9 están protegidas: el censo miraba solo el `try` de la propia función.** Seis las llama siempre un `try`: las cinco de la restauración del progreso (`_restoreLoadFromStorage`, `_restoreCheckStale` y `_restoreCheckMismatch`, que solo llama `restoreProgressFromStorage()` desde dentro de su `try`) y la de `_cancelarTimerAnteriorSiCambia` (su único llamador, el arranque del reloj de la aventura, la llama dentro de un `try`). Las otras tres, las del token de sesión de `js/api-client.js`, pasan por `safeSessionStorage(() => …)`, un envoltorio con su `try` (`:39`).
- **Lo que sí hay son tres formas de proteger lo mismo:** el `try` en el sitio (32), el `try` de quien llama (6) y el envoltorio de `api-client` (3), que solo existe ahí.
- **Propuesta (decide el usuario):** *A)* aceptar las tres formas, porque todas protegen; *B)* un ayudante común de almacenamiento (el de `api-client`, llevado a `js/utils.js`) y que todas las llamadas pasen por él, con una línea en `CLAUDE.md`. B toca once ficheros y el arranque de todos los frames.
- **Decidido y aplicado (2026-10-19, `54b4e9b`).** El usuario: una sola forma, robusta, pensando en la PWA real. `js/almacenamiento.js`, script clásico que publica `globalThis.almacen` (`local` y `sesion`: leer, escribir, borrar, vaciar, leerJSON y escribirJSON): nunca lanza; dice cada fallo una vez por almacén, operación, clave y tipo de error (`error` al escribir, `warn` al leer o borrar); solo acepta las claves de `almacen.CLAVES`; y `leerJSON` borra lo que no es JSON válido (decisión técnica mía, como ya hacía la restauración con `vv_progreso`). Lo cargan antes que nada que lo use las siete páginas que tocan el almacenamiento (padre, selección, hijo1 a hijo5) y el service worker lo precarga. ESLint prohíbe `localStorage` y `sessionStorage` fuera de él: rojo, 42 marcas; verde, 0. Fuera el envoltorio de `api-client`, que en producción callaba. Spec 142 (AL-1 a AL-3 rojos contra HEAD; AL-4 es estático y su rojo se vio con `git show HEAD`). Censo antes del cambio: 41 llamadas, y 2 más por el alias `ls`, en el padre, la selección y cuatro módulos; los otros cuatro frames no tocan el almacenamiento (AL-4 lo vigila). Chromium entero: 731 de 731.

### R2.11 Lo que hay que decidir: qué es cada cosa, para qué sirve y si puede sobrar (2026-10-06)

**Para qué es.** El usuario pidió (2026-10-06) un estudio corto que diga, de cada cosa que tiene que elegir: qué es, por qué hay que elegir, cuál es su función, si hay otra herramienta que cubra esa sección hoy, si puede ser código muerto, para qué es importante en la PWA y por qué debe seguir en ella. La lista es la de las filas de R2.9.4 sin «hecha», más K-61, la revisión de K-07, las familias de R2.10 y un fichero sin lector. **Este apartado no recomienda nada nuevo**: cuando una ficha ya recomendaba una opción se cita como tal, y lo que falta por comprobar se dice (regla 9).

**Método y límites.** Cada respuesta a «¿puede ser código muerto?» es una búsqueda desnuda del nombre en `codigo-padre.html`, `js/*.js`, los `.html` de la raíz y `tests/` (sin `docs/`), hecha el 2026-10-06 sobre `8755186`; «tiene llamador» no demuestra que la rama se alcance (no se ha ejecutado cada una), y «sin llamador» sí es «sin lector». Se citan funciones y no números de línea, que se desplazan con cada edición. Lo que no se ha comprobado va marcado «no comprobado».

#### R2.11.1 GPS y carteles de distancia

**K-17 B — los seis `getCurrentPosition` del padre**
- **Qué es y por qué hay que elegir.** Seis sitios piden una posición suelta (no el seguimiento): `_gpsIntentarPosicion`, `_finalizarActivacionGPS`, el botón de reintento de `_ensureGpsOverlay` (cartel de precisión), `_gpsReintentarDesdeOverlayDistancia`, el de `_ensureGpsSignalOverlay` (cartel de señal) y `_obtenerUbicacionUsuario`. Tienen tres políticas de posproceso y plazos distintos (5000 ajustado por la conexión y 15000 literal). Hay que elegir entre una función común con el plazo como parámetro o dejarlas, porque lo que decide si el plazo largo importa (M-8, GPS en frío) solo se mide en campo.
- **Función.** Las lecturas de la activación del GPS (los intentos con reintento y la final), la acción de los cinco botones «reintentar ubicación» de los carteles de distancia y precisión, la del cartel de señal y la de «mostrar mi ubicación» en el mapa.
- **¿Otra herramienta lo cubre?** El seguimiento continuo (`watchPosition`) también entrega posiciones y nunca se detiene; que pueda sustituir a una lectura que pide un botón o la activación, no comprobado.
- **¿Puede ser código muerto?** No por búsqueda desnuda: `_gpsIntentarPosicion` 1 llamador, `_finalizarActivacionGPS` 1, `_gpsReintentarDesdeOverlayDistancia` 5 (los cinco botones de carteles), `_obtenerUbicacionUsuario` 1, `_ensureGpsOverlay` 2 y `_ensureGpsSignalOverlay` 1.
- **Por qué importa y por qué debe seguir.** Son la acción de botones que el usuario ve y el paso de activación del GPS; sin ellas el usuario con el seguimiento mudo no tendría un «reintentar» (inferido de que son los llamadores de esos botones). Lo que se decide no es si siguen, sino si comparten código.
- **Opciones (de la ficha).** A) una función «pedir una posición puntual» con el plazo como parámetro; B) dejarlas hasta M-8.

**K-49 A — el cierre de los carteles de distancia al entrar en CASA**
- **Qué es y por qué hay que elegir.** Al pasar a CASA los carteles de GPS se cierran por dos caminos parciales: `_ocultarTodasPantallasDistanciaGPS` (rama CASA de `_hdl_SISTEMA_CAMBIO_MODO`: quita `show` a seis carteles y borra el snooze) y `_gestionarGpsOverlays` al final del cambio de modo (`hideNextEntityOverlay` y `hideGpsOutOfRangeOverlay`: para la cuenta atrás de 15 s del botón de reintento y oculta el cartel de siguiente entidad). Cada uno hace algo que el otro no y hoy todo se cierra (M-20). Quien retire uno deja algo abierto y ningún test lo vería: sin `_gestionarGpsOverlays` el spec 30 CM-6 sigue en verde.
- **Función.** Que al pasar a CASA no quede ningún cartel de GPS de aventura encima, ni su cuenta atrás en marcha.
- **¿Otra herramienta lo cubre?** Los dos caminos se cubren a medias entre sí; no hay un tercero. `_ocultarTodasPantallasDistanciaGPS` la llaman además dos flujos de AVENTURA (`_hdl_NAVEGACION_GPS_DENTRO_DE_RANGO` y `_hdl_NAVEGACION_MOSTRAR_UBICACION_POLYLINE`).
- **¿Puede ser código muerto?** No: `_gestionarGpsOverlays` 1 llamador y `_ocultarTodasPantallasDistanciaGPS` 3. Lo redundante es solapar dos mecanismos sobre un mismo cartel, no ninguna de las dos funciones entera.
- **Por qué importa y por qué debe seguir.** Es lo que deja la pantalla de CASA limpia. Debe seguir el cierre; lo que se decide es dejarlo en un solo sitio.
- **Opciones (de la ficha).** A) una sola función que cierre los seis carteles, borre el snooze, pare la cuenta atrás, rehabilite el botón y oculte el panel de siguiente entidad, llamada desde la rama CASA (la ficha la recomienda); con dos lecturas: A1) una función nueva solo para CASA, que deja dos funciones casi iguales; A2) ampliar `_ocultarTodasPantallasDistanciaGPS`, lo que cambia también sus dos flujos de AVENTURA (`DENTRO_DE_RANGO` y `MOSTRAR_UBICACION_POLYLINE`: al volver a rango o pulsar ubicación se cortaría además la cuenta atrás y se ocultaría el panel que el usuario abrió desde el botón del cartel de bloqueo) y ningún spec ejercita `DENTRO_DE_RANGO` con un cartel abierto. B) dejar los dos. C) dejar solo `_gestionarGpsOverlays`, ampliado a los seis carteles y al snooze.

#### R2.11.2 Abandonar, caducar y reanudar una aventura

**K-19 A y K-50 — «Elegir otra aventura» (se deciden en la misma función)**
- **Qué es y por qué hay que elegir.** Existe en dos diálogos casi idénticos: `ejecutarElegirOtra` (diálogo de reanudación, botón `#btn-confirmar-otra`) y `_elegirOtra` (diálogo de «vuelta rápida», botón `#btn-vuelta-elegir-otra`). Ya hubo un fallo por corregir una sola copia (la brújula, M-5). Además ninguna de las dos reinicia `estado.modo`, `paradaActual`, `elementoActual`, `indiceProgreso` ni `retoActual` (K-50): en producción la aventura nueva arranca con la parada de la anterior (M-22: `Av1-P-0` no está en las 67 paradas de la nueva y hijo2 no recibe ningún `CAMBIO_PARADA`). Hay que elegir cómo se corrige (reiniciar esos campos en una función común, o dejar `estado.modo` sin decidir para que corra la limpieza de un cambio real de modo), porque cada vía arrastra cosas distintas y cambia lo que ve el usuario.
- **Función.** Devolver al usuario a la selección con la aventura guardada borrada y el estado en memoria reiniciado, sin recargar la página.
- **¿Otra herramienta lo cubre?** `limpiarDatosAventura` (`js/reciclaje-digital.js`) borra todo, pero no devuelve a la selección sin recargar (sus llamadores recargan después, K-20); la llaman el tiempo agotado y otros dos sitios del padre y la finalización de la selección. La limpieza de `limpiarRecursosPorModo` (`js/app.js`) sí reinicia la parada y corre en un cambio real de modo (la usa el otro camino de activación).
- **¿Puede ser código muerto?** No: cada una tiene su botón (`addEventListener('click', …)`) y `mostrarDialogoVueltaRapida` se llama desde dos sitios. `ejecutarElegirOtra` no la pulsa ningún spec (`btn-confirmar-otra` no aparece en `tests/`); los specs 19 y 25 pulsan el otro botón.
- **Por qué importa y por qué debe seguir.** Es el camino de producción para cambiar de aventura y el estudio midió en él un fallo real (K-50). Debe seguir; se decide cómo se limpia.
- **Opciones (de las fichas).** K-19: A) una función común de «abandonar la aventura» (la ficha la recomienda; antes hace falta un spec de caracterización de `ejecutarElegirOtra`); B) dejar las dos copias con un comentario cruzado. K-50: A) reiniciar los cuatro campos en la función común; B) dejar `estado.modo` sin decidir. La ficha de K-50 no recomienda ninguna mientras no se lea qué más depende de que `estado.modo` valga `null` entre aventuras.

**K-20 A — la rama «sin modal» al reanudar**
- **Qué es y por qué hay que elegir.** Borrar la sesión guardada se hace de cinco formas sin código común (las dos de «elegir otra» borran 5 claves; `_transicionarAModoCasa` 3; la rama «sin modal» de `_comprobarReanudacionAventura` 2; `_restoreCheckStale` y `_restoreCheckMismatch` solo `vv_progreso`; `limpiarDatosAventura` todo). La decisión concreta es si la rama «sin modal» llama también a `limpiarDatosAventura('timeout')`: hoy deja vivas `vv_aventura`, `vv_idioma` y `vv_paradas_completadas` (M-9), y con A vaciaría además `localStorage`, `sessionStorage`, las cachés y el service worker sin avisar.
- **Función.** Que una sesión caducada no reaparezca al abrir la app.
- **¿Otra herramienta lo cubre?** Su gemela `_restoreCheckTimeout` ya llama a `limpiarDatosAventura('timeout')`, y `mostrarModalTiempoAgotado` es el camino normal; la rama «sin modal» es el respaldo cuando esa función no existe aún.
- **¿Puede ser código muerto?** No es inalcanzable: se alcanza por la carrera de K-54 (Script 1 comprueba la reanudación antes de que Script 2 defina `mostrarModalTiempoAgotado`); esa carrera no está medida.
- **Por qué importa y por qué debe seguir.** Es la salida de una sesión caducada cuando no hay modal; por eso K-20 se decide con K-54: si allí se elige esperar a `mostrarModalTiempoAgotado` en vez de decidir qué hace el degradado, K-20 A deja de ser la respuesta (R2.9.5).
- **Opciones (de la ficha).** A) llamar a `limpiarDatosAventura('timeout')` (la ficha la recomendó antes de R2.9; la corrección de R2.9 la deja condicionada a K-54); B) dejarla.

**K-54 — Script 1 usa funciones que define Script 2**
- **Qué es y por qué hay que elegir.** `_comprobarReanudacionAventura` (Script 1) usa `mostrarModalTiempoAgotado` (definida en Script 2) sin esperar a que exista: una carrera por tiempo. Es el único uso automático de ese tipo entre los 22 nombres medidos por análisis. Hay que elegir entre hacer que espere o dejarlo porque la carrera es de milisegundos en una máquina ociosa (no medida).
- **Función.** Mostrar el aviso de «aventura caducada» al reabrir una sesión vencida.
- **¿Otra herramienta lo cubre?** `retryUntilAvailable` (`js/utils.js`, 8 sitios) es la herramienta de espera acotada que ya usa el proyecto; la ficha la propone para esto.
- **¿Puede ser código muerto?** No: `mostrarModalTiempoAgotado` se usa en dos sitios del padre (`typeof … === 'function'` y la llamada) y se define en Script 2.
- **Por qué importa y por qué debe seguir.** Es el aviso al usuario de que su aventura terminó. Medirlo exige retrasar Script 2 con `page.route`, como el spec 89 (S2-4).
- **Opciones (de la ficha).** A) esperar con `retryUntilAvailable`; B) dejarlo.

**K-51 — el progreso guardado no lleva versión de los datos**
- **Qué es y por qué hay que elegir.** `persistProgressState` guarda el progreso sin versión ni huella de los datos de la aventura y `_restoreApplyState` asigna `paradaActual` e `indiceProgreso` sin comprobar que existan. Si los ids cambian dentro de la ventana de la sesión (60 o 150 h), el `CAMBIO_PARADA` devuelve `exito:false` con un `warn` y la sesión queda sin parada activa (leído, no medido). Es una decisión de producto: renumerar paradas es mantenimiento que ya se hace (Av34km).
- **Función.** Reanudar al usuario donde estaba tras cerrar la app.
- **¿Otra herramienta lo cubre?** El TTL de 7 días (`TTL_PROGRESO_GUARDADO_MS`) y `verificarTimeoutAventura()` acotan la vida de lo guardado, pero no detectan que los datos hayan cambiado.
- **¿Puede ser código muerto?** No: `persistProgressState` se llama desde varios puntos y `_restoreApplyState` desde la restauración.
- **Por qué importa y por qué debe seguir.** Es la reanudación de sesión, parte del flujo normal de una aventura de uno o dos días.
- **Opciones (de la ficha, sin recomendar).** A) guardar una versión o huella y descartar o recolocar si no coincide; B) validar los ids al restaurar y caer a la parada por defecto con aviso ruidoso; C) dejarlo si no se renumera contenido con sesiones vivas.

#### R2.11.3 Arranque y carga

**K-53, resto — imports no esenciales en posición fatal**
- **Qué es y por qué hay que elegir.** Un `import` estático (o un `await import()` fuera de `try`) que falla detiene el script entero sin error visible. Siguen así: `feedback-forms.js` (padre Script 1, selección, hijo6), `video-playback-utils.js` (padre Script 1, video-intro), `reciclaje-digital.js` (padre Script 1) y `suppress-warnings.js` (padre). `efectos-sonido.js` ya está resuelto. Hay que elegir si se pasan a `import()` dentro de `try` con respaldo inerte y `warn`, o se dejan apoyándose en el precacheo.
- **Función.** Valoraciones y sugerencias, reproducción de vídeo con buffer, borrado de la sesión y silenciado de avisos de librerías.
- **¿Otra herramienta lo cubre?** El `APP_SHELL` los precachea todos (cobertura comprobada en R2.9) y el shell se sirve con red primero y caché de respaldo. No se midió ningún fallo de carga de ninguno.
- **¿Puede ser código muerto?** No: los cuatro módulos tienen usos en los frames que los importan.
- **Por qué importa y por qué debe seguir.** Un fallo en el padre dejaría sin handlers de reto, audio y parada si afecta a Script 2. Que sigan es seguro; lo que se decide es si un fallo de uno debe tumbar al frame.
- **Opciones (de la ficha).** A) `import()` en `try` con respaldo inerte (la ficha lo recomendó para `efectos-sonido.js`, que es el caso hecho; para los demás «es la misma pregunta, no comprobada módulo a módulo»); B) dejarlos.

**K-61 — el pre-warm de `js/app.js`**
- **Qué es y por qué hay que elegir.** `iniciarPrewarmEnCasa` ya no precalienta nada: solo pone `prewarmIniciado` y `prewarmPausado` a `true`. Esas banderas deciden si, al entrar en AVENTURA, `_reanudarSubsistemasTrasPrewarm` llama a `_activarParadaDefectoAventura`. A la vez `_activarAventura` del padre llama a `ensureDefaultParada`. Son dos caminos que eligen la parada por defecto con reglas distintas; medido: dan la misma parada en las 84 combinaciones aventura × idioma, y desde la segunda entrada en AVENTURA el de `app.js` despacha una activación de más antes de la restauración del progreso real (con el progreso en otra parada: `Av1-P-0` y 117 ms después `Av1-TR-1`).
- **Función.** Fijar la primera parada al entrar en AVENTURA.
- **¿Otra herramienta lo cubre?** Sí: `ensureDefaultParada` cubre las dos entradas (en la primera activa la parada por defecto; en la segunda sale porque la restauración ya fijó `paradaActual`).
- **¿Puede ser código muerto?** En parte: fuera de `js/app.js`, las banderas solo las declara `js/state-manager.js`; `iniciarPrewarmEnCasa` solo las escribe y `_reanudarSubsistemasTrasPrewarm` solo las lee. No es muerto del todo: se ejecuta, y es lo que activa la parada de más. No comprobado: qué reciben los hijos con esa activación de más y qué pasa en la reanudación (`restaurado: true`), donde `_activarAventura` se salta `ensureDefaultParada`.
- **Por qué importa y por qué debe seguir.** La parada por defecto debe existir al entrar en AVENTURA; lo que se decide es cuál de los dos caminos se queda.
- **Opciones (de la ficha, sin recomendar).** A) solo `ensureDefaultParada` y retirar el pre-warm entero (`_activarParadaDefectoAventura`, `_reanudarSubsistemasTrasPrewarm`, `_prewarmAventura`, `_flujoPrewarmModo`, `iniciarPrewarmEnCasa`, su auto-run y las dos banderas); B) solo `_activarParadaDefectoAventura`; C) dejarlo. La ficha anota que lo medido apunta a A y que falta medir la reanudación antes de recomendarla.
- **Medido en R2.13** (pasada `variantes`). Con la activación de más, hijo2, hijo3, hijo4 y hijo5 reciben la activación entera de la parada por defecto (hijo3 carga su audio y el padre vuelve a crear la ficha de un elemento ya completado), unos 100 ms antes que la del elemento real. En la reanudación (`restaurado: true`) no hay activación de más: un solo `CAMBIO_PARADA`, el del elemento guardado. El detalle, en R2.13.

**K-07, revisión — dos conjuntos de «hijo listo»**
- **Qué es y por qué hay que elegir.** `estadoPadre.hijosInicializados` (del padre) y el conjunto del state-manager son dos objetos distintos (medido). `cargarHijo` vacía los dos al cargar un iframe, pero el supervisor del bus, al recargar, vacía solo el del state-manager: durante la recuperación el padre sigue viendo al hijo como listo. Lo que ocurre en esa ventana en cada lector no está medido.
- **Función.** El del state-manager lo usan `crearPromiseHijoListo` (la espera de `cargarHijo`), `hijoEstaListo` (el supervisor y `abrirChat`); el del padre lo leen ocho sitios: la comprobación de «todos los críticos listos», `distribuirDatosAventura` (hijo2 y hijo5), `_configurarRetoBtn` (hijo3), la notificación de `CAMBIO_PARADA` a hijo4, el fin de un audio con retos, un sondeo de espera de hijo2 y `js/app.js` (dos).
- **¿Otra herramienta lo cubre?** Cada uno cubre a sus lectores; no hay un tercero. La ficha de «hijo listo» con varias casas está en K-41.
- **¿Puede ser código muerto?** Ninguno de los dos: los dos tienen lectores (lista anterior).
- **Por qué importa y por qué debe seguir.** El «listo» es lo que impide mandar datos a un iframe que todavía no tiene handlers.
- **Opciones (de la ficha, sin recomendar).** A) que el supervisor avise al padre (como ya hace con `_vv_beforeHijoReload`) para que vacíe el suyo; B) un solo conjunto; C) dejarlo.
- **Medido en R2.13** (pasada `aventura` con caídas, 2026-10-12). Con hijo4 caído mientras el usuario avanza, el padre le manda `PENDING_INICIADO` y `CAMBIO_PARADA`, que se pierden, sin efecto a la vista. Con hijo3 caído, el padre da por no disponible un audio que hijo3 recupera diez segundos después, y la parada siguiente queda sin poder abrir su reto (K-82). El detalle, en R2.13.

#### R2.11.4 Contrato de mensajes y literales

**K-43 B — el id de parada con cuatro nombres**
- **Qué es y por qué hay que elegir.** `NAVEGACION.CAMBIO_PARADA` lleva el mismo id con cuatro nombres (`paradaId`, `parada_id`, `padreId`, `padreid`; el censo de R2.10 cuenta cinco) en once emisores. `resolverIdsParada` (`js/utils.js`) lo resuelve en el padre, hijo3, hijo5 y `js/funciones-mapa.js`; hijo2 e hijo4 lo leen a mano con precedencia opuesta. Hoy no se observa ningún efecto en producción (los emisores del padre mandan `paradaId` y `parada_id` iguales). Hay que elegir entre dejarlo o unificar el contrato, que toca once emisores, dos receptores y los specs del cambio de parada.
- **Función.** Avisar a todos los frames de qué parada o tramo está activo.
- **¿Otra herramienta lo cubre?** Sí: `resolverIdsParada`, que ya normaliza los cuatro nombres y el prefijo `padre-`.
- **¿Puede ser código muerto?** En parte: `SISTEMA.NOTIFICACION` lee `padreid` y nadie lo manda (K-36); los demás nombres tienen emisor y lector.
- **Por qué importa y por qué debe seguir.** Sin el id de parada no hay audio, retos ni mapa de la parada activa; es el mensaje central de la aventura.
- **Opciones (de la ficha).** A) un único `paradaId` sin prefijo (a medio plazo, una tanda propia); B) dejarlo, con el coste de que cada emisor nuevo recuerde los cuatro nombres (la ficha recomienda B ahora y A al tocar el contrato).

**K-46 B — los acuses que nadie consume**
- **Qué es y por qué hay que elegir.** Handlers del bus que solo escriben en el log. Para dos viajes de ida y vuelta la ficha propone retirar: `RETO.MOSTRADO` (hijo4 → padre) con su respuesta `RETO.CONFIRMADO` (padre → hijo4) y `DATOS.TEXTOS_CARGADOS` (hijo2 → padre). Hoy siguen emitiéndose y atendiéndose. Retirarlos cambia el contrato del bus (regla 1) y la cifra de tipos y las fichas de la guía.
- **Función.** Acusar recibo y anotarlo; el padre no usa la respuesta de `RETO.MOSTRADO` y `TEXTOS_CARGADOS` solo anota (su rama de error es el único aviso que recibe el padre si hijo2 no pudo cargar los textos).
- **¿Otra herramienta lo cubre?** El bus tiene mensajes con confirmación (`enviarMensajeConConfirmacion`, 6 usos); que algo distinto del log sustituya a estos acuses, no comprobado.
- **¿Puede ser código muerto?** Sí en el sentido de que no hacen nada más que anotar: tienen emisor y receptor, pero ningún efecto observable (ningún spec nombra `RETO.MOSTRADO` ni `RETO.CONFIRMADO`; `DATOS.TEXTOS_CARGADOS` solo aparece en un comentario del spec 106).
- **Por qué importa y por qué debe seguir.** No sostienen ninguna decisión; son diagnóstico. Para `CAMBIO_MODO_APLICADO`, `SISTEMA.ERROR`, `SISTEMA.NACK`, `SISTEMA.NOTIFICACION` y `SELECCION.CODIGO_VALIDADO` la ficha recomienda dejarlos.
- **Opciones (de la ficha).** A) dejarlos; B) retirar los dos viajes (recomendada para esos dos); C) retirar la cuarta fase del protocolo de modo entera.

**K-37 A — literales `'casa'`, `'aventura'` y `destino: 'padre'` en los hijos**
- **Qué es y por qué hay que elegir.** `MODOS` de `js/constants.js` lo lee el padre (y `funciones-mapa.js` y `app.js`) pero ningún hijo ni nieto; los hijos escriben los literales (unos 130 `destino: 'padre'`, 140 al medir K-37, y los dos valores de modo). Hay que elegir entre dejarlos o importar `MODOS` en siete hijos y la selección (once ficheros) por una ganancia de legibilidad.
- **Función.** Nombrar el modo y el destino del bus.
- **¿Otra herramienta lo cubre?** `MODOS` en `js/constants.js`; las demás constantes sin lector (`DESTINOS`, `ESTADOS`, `ERRORES`…) ya se retiraron.
- **¿Puede ser código muerto?** No aplica a los literales; lo que no se leía ya se retiró.
- **Por qué importa y por qué debe seguir.** Son los valores del contrato del bus; no han dado ningún fallo demostrado.
- **Opciones (de la ficha).** A) dejarlos (recomendada); B) importar `MODOS` en los siete hijos y la selección.

#### R2.11.5 Textos y reservas

**K-25 A — textos de usuario fuera de `traducciones-ui.js`**
- **Qué es y por qué hay que elegir.** Hay textos visibles en español fijo fuera de `traducciones-ui.js`: los tres `alert()` de hijo4 («Por favor, seleccione una opción.» sale pulsando Enviar sin elegir en un reto de opción: caso normal, M-6), los mensajes de fallo de la selección y, en hijo4, el botón 🆘❓ y «🧩 Iniciar reto»; más `alt`/`title`/`aria-label` del padre y de hijo2 (B) y cuatro páginas estáticas de contenido (C). Es una decisión de producto: textos en 12 idiomas con el registro formal de usted.
- **Función.** Avisar al usuario de lo que ocurre en su idioma.
- **¿Otra herramienta lo cubre?** Sí: `traducciones-ui.js` (12 idiomas), que hijo4 ya importa.
- **¿Puede ser código muerto?** Una parte: el tercer `alert()` de hijo4 es inalcanzable según la ficha, y `ejecutarValidacion` es un stub siempre verdadero: el del padre no tiene ningún llamador (búsqueda desnuda: solo su definición), y el de hijo4 tiene una llamada cuya rama de fallo solo se alcanza si lo anterior lanza.
- **Por qué importa y por qué debe seguir.** La regla del proyecto es «botones en 12 idiomas»; los `alert()` de hijo4 se ven en el flujo normal.
- **Opciones (de la ficha).** A) mover los tres `alert()` de hijo4 y los mensajes de fallo de la selección (la ficha la recomienda como mínimo defendible; la revisión de R2.9 añade que hijo4 tiene otros textos en español que A no cubre); B) además los `alt`/`title`/`aria-label`; C) las páginas estáticas. K-24 (hecha) es previa para la parte de hijo4.

**K-52 — reservas mudas a `'Aventura1'`**
- **Qué es y por qué hay que elegir.** Doce sitios sustituyen una aventura ausente por `'Aventura1'`: el padre (`_hdl_NAVEGACION_CAMBIO_PARADA`), ocho de la selección, hijo2 (el único que avisa con `warn`), `mapa-completo.html` y `js/api-client.js` (parámetro por defecto de `activar`). Si el dato falta, la app sigue con una aventura inventada y nada lo delata. Hay que elegir sitio por sitio; la ficha solo leyó el del padre.
- **Función.** Que la app no se detenga si falta el nombre de la aventura.
- **¿Otra herramienta lo cubre?** No: el dato es `aventuraSeleccionada`; el respaldo de `vv_aventura` solo está en el padre.
- **¿Puede ser código muerto?** No: son ramas de reserva alcanzables en estados concretos; la del padre, tras `_elegirOtra` (K-50). No medido.
- **Por qué importa y por qué debe seguir.** Es el segundo camino silencioso del estudio; lo que se decide es qué hacer cuando falta el dato.
- **Opciones (de la ficha).** Para el padre: A) no resolver contra una aventura inventada y dar un error visible en el log; B) dejarlo. No se recomienda nada para los demás sitios hasta leerlos uno a uno.

#### R2.11.6 Service worker

**K-60 — el Network First del shell sin plazo ni caída a la caché ante un error**
- **Qué es y por qué hay que elegir.** El bloque «Shell y módulos JS: Network First» de `sw.js` pide a la red con `cache: 'no-store'`, guarda las respuestas válidas y solo sirve la caché si el `fetch` rechaza. Medido con el SW en modo producción: un corte limpio de red está contemplado (`hijo3` se recarga desde la caché); una respuesta 503 se devuelve tal cual en vez de la copia en caché; una petición que nunca contesta no tiene plazo (sin apretón en 22 s; la petición colgada se emuló con `context.route`). Cambiarlo toca `sw.js` (`CACHE_VERSION` y la lista del shell).
- **Función.** Servir el shell de la app fresco cuando hay red y desde la caché cuando no.
- **¿Otra herramienta lo cubre?** El precache de `APP_SHELL` en la instalación, el overlay de «sin conexión» (según lo leído en K-57, se activa con `navigator.onLine === false`) y el aviso de actualización; ninguno mira una petición colgada ni una respuesta de error.
- **¿Puede ser código muerto?** No: es la rama de `fetch` del shell, la que sirve la app.
- **Por qué importa y por qué debe seguir.** Es lo que hace que la PWA arranque sin red y que recargue un hijo caído desde la caché (K-57).
- **Opciones (de la ficha, sin recomendar).** A) un plazo en el camino de red tras el cual se sirve la caché; B) servir la caché también ante una respuesta no 2xx; C) dejarlo.

#### R2.11.7 Copias y homogeneidad

**K-28 B — las familias de copias**
- **Qué es y por qué hay que elegir.** El mismo algoritmo escrito varias veces: `enviarHijoListoConReintento` (6 copias, una por hijo), escapar HTML (8 o 9 copias, todas en el padre), `sleep` (padre y `js/utils.js`), `mostrarFraseAleatoria` (2), detección de móvil (3 listas distintas), `_displayOriginalBody` (5), los modales de entrada de código (3) y otras. Es coste de mantenimiento, no una avería; cada una pide su decisión (extraer a `js/` o aceptar la copia). La que más rinde, según la ficha, es `enviarHijoListoConReintento`, porque una corrección hay que repetirla en seis sitios.
- **Función.** Cada copia es un ayudante que su frame necesita (reintentar `HIJO_LISTO`, escapar HTML, esperar, detectar móvil…).
- **¿Otra herramienta lo cubre?** Donde ya hay módulo compartido: `js/utils.js` exporta `sleep` (lo importa `js/api-client.js`; el padre usa el suyo, idéntico) y `resolverIdsParada`; la detección de móvil tiene `js/device-detection.js` frente a otras dos listas.
- **¿Puede ser código muerto?** Alguna sí: `debug-brujula.html` copia el algoritmo de la orientación de la flecha y no la carga ningún fichero de producción (búsqueda desnuda: solo la guía y `eslint.config.js`), pero es una herramienta manual de diagnóstico en un móvil real (guía), no código muerto. Las demás copias están en uso (por ejemplo `sleep` del padre tiene al menos siete llamadores).
- **Por qué importa y por qué debe seguir.** Cada hijo necesita su apretón de manos y los ayudantes citados; lo que se decide es cuántas veces está escrito.
- **Opciones (de la ficha).** A) extraer a `js/` o aceptar la copia, familia a familia; B) dejarlas (la ficha lo dejó así).

**R2.10 — las familias de homogeneidad de la PWA (13) y las de herramientas y tests**
- **Qué es y por qué hay que elegir.** Para cada decisión que el código toma, el censo cuenta cuántas formas hay; hay que decidir **unificar o aceptar**, y hacia qué forma, familia a familia. Decididas hasta ahora (solo en los specs): `goto` con ruta que empieza por `/` y `src` de un iframe inyectado con ruta que empieza por `/`. **Abiertas (la PWA; cifras del censo del 2026-10-05):** escribir en el log (925 `(globalThis.logger || console).x` y 924 `logger.x` con import estático, de 1905); registrar un handler (130 con `registrarControladorSeguro`, de 142); enviar un mensaje (132 `enviarMensaje` y 62 por alias `_S1`/`_S2`, de 232); destino de un mensaje (130 `'padre'` literal, de 220); esperas y plazos (106 `setTimeout`, de 173); qué hace un `catch` (182 con un solo log de error y 47 vacíos, de 654); almacenamiento (43 de 52 con `try`); `import()` dinámico (39 de 90 sin protección); mostrar y ocultar (131 `style.display`, tres vocabularios de clase); eventos del DOM (225 `addEventListener`, 41 atributos `on*`, 30 propiedades); estado del padre (440 `estado.x` y 64 `globalThis.estadoPadre.x`, de 506); copias de un mismo algoritmo (K-28); `postMessage` (7 sitios, ya cuadra con K-16: sin decisión que tomar).
- **Función.** Que cada decisión del código tenga una sola forma (regla de «un solo camino por decisión» de `CLAUDE.md`).
- **¿Otra herramienta lo cubre?** La mayoría de las formas mayoritarias ya son la herramienta compartida (`registrarControladorSeguro`, `enviarMensaje`, `logger`, `retryUntilAvailable` para esperas acotadas, 8 usos); la decisión es acercar los sitios que se desvían.
- **¿Puede ser código muerto?** No aplica: son formas de escribir lo mismo, no código aparte. (Los 47 `catch` vacíos y los 9 accesos al almacenamiento sin `try` se leyeron como candidatos, no se comprobó cuáles pueden fallar en producción.)
- **Por qué importa y por qué debe seguir.** Es la consistencia que pidió el usuario (2026-10-05); cada familia se estudia con la lupa de R2.9 antes de proponer nada, y el censo no mide el comportamiento ante el fallo.
- **Opciones.** Por familia: unificar hacia la forma mayoritaria, hacia otra, o aceptar la copia. Fuera de la PWA (R2.10.4): herramientas (77 ficheros; `.js` y `.cjs` como dos extensiones para lo mismo, 6 de 76 usan la librería compartida del analizador) y tests (esperas de cuatro formas, los diez `*.test.js` sin ejecutor).

#### R2.11.8 Un fichero sin lector

**`tests/flujo_bidireccional_exhaustivo.json`**
- **Qué es y por qué hay que elegir.** Un informe de 24 KB titulado «Análisis exhaustivo de flujo de comunicación bidireccional» (versión 2.0.0, generado el 2025-01-08, desde el primer commit del repositorio): flujos por familia de mensajes, problemas, controladores huérfanos y recomendaciones. Búsqueda desnuda de su nombre en todo el repositorio: solo `docs/estudio-caminos.md` (que lo nombra a propósito). Nombra al menos tres tipos de mensaje que no existen hoy en `js/constants.js` (`GPS.UBICACION_ACTUALIZADA`, `NAVEGACION.ENVIAR_PARADA_COMPLETADA`, `SISTEMA.HEARTBEAT_START`) y `estadoHijos.ultimoPing`. Hay que elegir si se conserva como documento histórico, se actualiza o se retira.
- **Función.** Ninguna en tiempo de ejecución ni en la suite: nada lo lee.
- **¿Otra herramienta lo cubre?** Sí: `npm run verificar-mensajeria` (emisores y receptores de cada tipo, contra el código) y la tabla de mensajes de la guía (§37.3 y las fichas de §26.12), que se regeneran del código.
- **¿Puede ser código muerto?** Sí: no es código, pero no tiene ningún lector y está desfasado respecto al bus.
- **Por qué importa y por qué debe seguir.** No hay función en la PWA que lo requiera; solo conserva un análisis de enero de 2025 que ya no coincide con el código.
- **Opciones.** Conservarlo, actualizarlo con las herramientas actuales o retirarlo; la decisión es del usuario y no cambia nada de la PWA.
- **Por aplicar (2026-10-19), con el principio del usuario (sin basura): retirarlo.** Búsqueda desnuda de su nombre en todo el repositorio fuera de `docs/`: 0. Queda en el historial de git.
- **Aplicado (2026-10-19, `f89554d`), con otro igual.** Retirado, y con él `tests/analyze_controllers_report.json`: también del commit inicial, sin lector (búsqueda desnuda de su nombre: solo él mismo), con tipos de mensaje que ya no existen y generado por `tests/analyze_controllers.js`, que no está en el repositorio.

#### R2.11.9 Lo que añadió la re-verificación (R2.12)

Mismo formato y mismo método que el resto de R2.11, sobre `4bea83e` y el 2026-10-07; cada «¿puede ser código muerto?» sale de la búsqueda de la ficha. K-69 no entra: antes de decidir hay que leer cada regla.

**K-62 — doce esperas escritas a mano**

- **Qué es y por qué hay que elegir.** Doce bucles `while` que sondean hasta que exista una función, un objeto o una respuesta —nueve en el padre, uno en `js/app.js`, uno en hijo2 y uno en `js/funciones-mapa.js`— conviven con `retryUntilAvailable`, el helper que hace lo mismo y tiene seis llamadores: dos formas de escribir la misma espera acotada.
- **Función.** Que un script del padre no use lo que define otro antes de que exista (EJE 2), que el cambio de modo espere las respuestas de los hijos, que el botón de imagen de hijo2 espere las coordenadas y que el cambio de parada espere al mapa.
- **¿Otra herramienta lo cubre?** `retryUntilAvailable` puede hacer la espera de los doce; lo que cada sitio hace al agotarse (lanzar, seguir con un aviso o abortar) se queda en el sitio.
- **¿Puede ser código muerto?** No por búsqueda desnuda: cada bucle está en una función con llamador o en código de nivel superior que corre al cargar. Que la condición de alguno llegue a darse (por ejemplo, `__pendingDistribucion` cuando el Script 1 pasa por `:3962`) no está comprobado.
- **Por qué importa y por qué debe seguir.** Las esperas evitan los fallos de orden entre los scripts del padre y entre el padre y los hijos; deben seguir. Lo que se decide es la forma.
- **Opciones (de la ficha).** A) llevarlas al helper, sitio a sitio; B) dejarlas.

**K-64 — tres variables muertas de `funciones-mapa.js`**

- **Qué es y por qué hay que elegir.** `_mapaOpciones` se escribe y no se lee; `_pulseTimeout` y `_elementosParaReescalar` no se usan.
- **Función.** Ninguna.
- **¿Otra herramienta lo cubre?** El reescalado por zoom lo hacen `reescalarMarcadoresEmoji()` y `reescalarMarcadorUsuario()`, y no hay ningún efecto de pulso de llegada.
- **¿Puede ser código muerto?** Sí: 3, 1 y 1 apariciones en todo el repositorio, ninguna lectura.
- **Por qué importa y por qué debe seguir.** No tienen efecto; `_pulseTimeout` llevó a la guía a describir un efecto que no existe (G-48).
- **Opciones (de la ficha).** A) retirarlas; B) dejarlas.
- **Aplicado (2026-10-13).** A. Commit `18cfe1f`.

**K-65 — `limpiar()` del bus**

- **Qué es y por qué hay que elegir.** Una función exportada de `js/mensajeria.js` que rechaza las confirmaciones pendientes y vacía la cola; nadie la llama.
- **Función.** Ninguna hoy.
- **¿Otra herramienta lo cubre?** No se buscó: sin llamador, lo que se decide es si conviene tenerla preparada.
- **¿Puede ser código muerto?** Sí: el identificador solo aparece en su definición (y en una homónima local de `js/video-playback-utils.js`, sin relación).
- **Por qué importa y por qué debe seguir.** No tiene efecto; está en el bus (regla 1), así que retirarla pide el OK expreso.
- **Opciones (de la ficha).** A) retirarla; B) dejarla.
- **Aplicado (2026-10-13).** A, con `colaMensajes`. Commit `93cb6dc`.

**K-66 — tres claves de `CONFIG_PADRE` sin lector**

- **Qué es y por qué hay que elegir.** `COMPONENTE_ID`, `VERSION` y `DEBUG` (`codigo-padre.html:4034-4036`) no las lee nadie; `ID` y `LOG_PREFIX` sí.
- **Función.** Ninguna; un test del spec 02 comprueba que existen y su tipo.
- **¿Otra herramienta lo cubre?** El nivel de log lo da `__vv_config`, que publica `js/config.js` (K-56); el prefijo y el id, las dos claves que se leen.
- **¿Puede ser código muerto?** Sí: ninguna lectura en `*.html` ni en `js/*.js`.
- **Por qué importa y por qué debe seguir.** No tienen efecto; quedaron sin lector al cerrarse K-01 y K-02.
- **Opciones (de la ficha).** A) retirarlas y ajustar el test; B) dejarlas.
- **Aplicado (2026-10-13).** A, con una cuarta clave sin lector, `ID`. Commit `2ddb79f`.

**K-67 — el objeto API del state-manager**

- **Qué es y por qué hay que elegir.** Tres funciones con dos nombres cada una (el bus usa uno de los dos) y cinco nombres que solo usan los specs o nadie.
- **Función.** El objeto es la puerta del bus al registro de handlers y al estado de los hijos; los nombres repetidos y los de diagnóstico no añaden función.
- **¿Otra herramienta lo cubre?** Los nombres que usa el bus (`registrarManejador`, `getManejadores`) cubren a sus gemelos.
- **¿Puede ser código muerto?** En parte: `getEstadoPadre` no tiene llamador (solo un `typeof` del spec 01), `diagnosticarStateManager` y `diagnosticar` tampoco (herramienta de consola), y `getScript2Listo` y `getControladoresPorTipo` solo los usan specs.
- **Por qué importa y por qué debe seguir.** Lo que usa el bus debe seguir; lo demás es superficie que hay que mantener.
- **Opciones (de la ficha).** A) un nombre por función y retirar lo que no usa nadie; B) dejarlo.

**K-68 — veintitrés guardas de `origen` inalcanzables**

- **Qué es y por qué hay que elegir.** Al principio de 21 handlers y de dos validadores de hijo5, una comprobación de que el mensaje trae `origen`; el bus ya descarta lo que llega sin él y sella el de los mensajes locales, así que la rama no se alcanza.
- **Función.** Defensa por si un handler se llamara fuera del bus, cosa que hoy no ocurre.
- **¿Otra herramienta lo cubre?** Sí: el descarte del listener del bus (`js/mensajeria.js:727`) y el sello de `despacharLocal` (`:650`).
- **¿Puede ser código muerto?** Sí, por lectura: los handlers solo se ejecutan desde `_encolarEjecucionHandler`, y a ella no llega ningún mensaje sin `origen`.
- **Por qué importa y por qué debe seguir.** No cambia nada visible; es redundancia.
- **Opciones (de la ficha).** A) retirarlas; B) dejarlas como defensa redundante.
- **Aplicado (2026-10-13).** A. Commit `1e1a660`.

**K-70 — la respuesta al latido**

- **Qué es y por qué hay que elegir.** Cada frame contesta al latido con un `datos` distinto (de `{ timestamp }` a ocho claves, y `estado` como cadena o como objeto) y el padre no lee ninguna clave; hijo5 manda además esa respuesta sin latido cuando la página vuelve a primer plano.
- **Función.** La respuesta es la señal de vida del supervisor; las claves no tienen función.
- **¿Otra herramienta lo cubre?** El supervisor solo necesita el `origen` (`procesarHeartbeatResponse`).
- **¿Puede ser código muerto?** Las claves de `datos`, sí: ninguna lectura en producción ni en los specs.
- **Por qué importa y por qué debe seguir.** La respuesta debe seguir (sin ella el supervisor recarga el hijo); las claves, no.
- **Opciones (de la ficha).** A) una sola forma para todos; B) dejarlo. Aparte, la respuesta de hijo5 sin latido: a) quitarla; b) dejarla.

**K-71 — el radio del círculo naranja**

- **Qué es y por qué hay que elegir.** El círculo naranja que ve el usuario se dibuja con 15 m escritos a mano, y el radio con el que se declara la llegada sale de `RADIO_LLEGADA_PARADA_M` (15) a través de `radioLlegada()`. Hoy coinciden; si cambia la constante, el círculo no la sigue.
- **Función.** Enseñar al usuario la zona en la que se da por llegado.
- **¿Otra herramienta lo cubre?** `radioLlegada()` ya es la fuente del radio que recibe hijo2.
- **¿Puede ser código muerto?** No: el círculo se crea o se mueve en cada posición fuera de CASA (`actualizarMarcadorUsuario`).
- **Por qué importa y por qué debe seguir.** El círculo debe seguir y tiene que ser la zona de verdad; lo que se decide es de dónde saca el número.
- **Opciones (de la ficha).** A) que lo tome de `radioLlegada()`; B) dejarlo.
- **Aplicado (2026-10-13).** A. Commit `8f36e78`.

**K-72 — la espera de la reanudación a `distribuirDatosAventura`**

- **Qué es y por qué hay que elegir.** La reanudación espera la función de Script 2 de dos formas: por una promesa sin plazo, si Script 2 llegó a crearla, o por un sondeo de 30 s que acaba en el aviso al usuario si no. Si Script 2 se corta después de crear la promesa, la reanudación se queda esperando sin aviso. Medido: la pantalla de carga se queda y no sale nada; sin la promesa, el aviso sale a los 31 s.
- **Función.** Que los datos de la aventura lleguen a los hijos al reanudar, o que el usuario sepa que no han llegado.
- **¿Otra herramienta lo cubre?** `_avisarFalloCargaAppUnaVez` es el aviso; lo que falta es el camino hasta él.
- **¿Puede ser código muerto?** No: la promesa es la rama que se toma siempre que Script 2 arranca; la del sondeo, solo si Script 2 no llega a arrancar.
- **Por qué importa y por qué debe seguir.** Es un fallo raro, solo cuando Script 2 se rompe, pero entonces la reanudación no termina y no se le dice nada al usuario.
- **Opciones (de la ficha).** A) una sola forma de esperar la función, con plazo y con el aviso; B) dejarlo.

#### R2.11.10 Lo que añadió el recorrido (R2.13)

Mismo formato que el resto de R2.11, con lo medido en el recorrido del 2026-10-07.

**K-73 — el segundo aviso de llegada vuelve a crear la ficha de un tramo cerrado**

- **Qué es y por qué hay que elegir.** Dos sensores avisan de la misma llegada; el primero cierra el tramo y el padre borra su ficha, y el segundo, unos milisegundos después, la vuelve a crear con la llegada marcada y el audio sin marcar. Medido en veintiocho de los treinta tramos cerrados.
- **Función.** La ficha lleva lo que le falta a un elemento para cerrarse; la de un elemento cerrado no tiene función.
- **¿Otra herramienta lo cubre?** `paradaListaParaAvanzar` dice ya que el elemento está cerrado, y la ficha se borra al avanzar.
- **¿Puede ser código muerto?** No: los dos sensores corren en cada llegada.
- **Por qué importa y por qué debe seguir.** Hoy no se ve; deja estado falso que se encontraría cualquier código nuevo que lea las fichas.
- **Opciones (de la ficha).** A) que la llegada de un elemento ya cerrado no cree ficha; B) un solo sensor (K-06); C) dejarlo, documentado.
- **Aplicado (2026-10-13).** A, en el sitio que crea las fichas: cubre también el audio escuchado otra vez, el reto resuelto otra vez y el botón de saltar. Commit `479b06a`.

**K-74 — el mapa mide el elemento anterior hasta un segundo después de cada avance**

- **Qué es y por qué hay que elegir.** El padre, el mapa y hijo2 tienen cada uno su «elemento actual», y se ponen al día en momentos distintos; hijo2 además lo toma de cada lectura del mapa. Durante ese hueco hijo2 vuelve a notificar la llegada al elemento que se acaba de dejar (73 de 76 avances), el cartel de llegada al inicio sale otra vez al salir del inicio, y el botón de vídeo se apaga al entrar en un tramo.
- **Función.** Que cada parte sepa qué elemento se está recorriendo.
- **¿Otra herramienta lo cubre?** El padre ya descarta la llegada del elemento anterior (`:11839-11842`); el cartel y el botón no tienen guarda.
- **¿Puede ser código muerto?** No.
- **Por qué importa y por qué debe seguir.** El usuario lo ve (un cartel que le dice que ha llegado al punto del que acaba de salir y que pulse un botón que ya ha pulsado; un botón que no responde durante un segundo).
- **Opciones (de la ficha).** A) un solo dueño del elemento actual para el mapa y para hijo2; B) dejarlo, documentado.

**K-75 — la ficha de CASA conserva su reloj en AVENTURA**

- **Qué es y por qué hay que elegir.** Visitar un elemento en CASA con la lista de hijo5 (herramienta de desarrollo, ver §24) crea su ficha, y en AVENTURA esa misma ficha sigue con el reloj de entonces.
- **Función.** El reloj de la ficha decide cuándo sale el recordatorio de rescate.
- **¿Otra herramienta lo cubre?** El fin del audio pone el reloj a cero, así que el efecto solo aparece si el barrido llega antes que él.
- **¿Puede ser código muerto?** No.
- **Por qué importa y por qué debe seguir.** Solo en desarrollo; los comentarios que dicen otra cosa sí confunden a quien lee el código.
- **Opciones (de la ficha).** A) que el reloj empiece al activarse en AVENTURA; B) dejarlo y corregir los comentarios.

**K-76 — `retoActualId` de hijo4**

- **Qué es y por qué hay que elegir.** Un campo que guarda el reto de la parada al cambiar de parada y el reto abierto al abrirlo; la limpieza del cambio de modo lo lee como «reto abierto» y no limpia nunca en una parada con reto.
- **Función.** Que el cambio de modo no borre un reto que el usuario tiene abierto.
- **¿Otra herramienta lo cubre?** `RETO.LIMPIAR_ESTADO` vacía el reto al cerrarlo.
- **¿Puede ser código muerto?** La rama que limpia no lo es (corre en elementos sin reto); dentro de ella, las dos asignaciones a `null` no hacen nada.
- **Por qué importa y por qué debe seguir.** Hoy, solo un aviso falso en la consola.
- **Opciones (de la ficha).** A) dos campos; B) dejarlo, documentado.

**K-77 — el texto del cartel de llegada al punto de inicio**

- **Qué es y por qué hay que elegir.** El cartel que solo sale en el punto de inicio pide pulsar «avanzar», que en ese momento está apagado, y lleva su icono.
- **Función.** Decir al usuario que ha llegado y qué hacer: pulsar play.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** No: sale en cada aventura.
- **Por qué importa y por qué debe seguir.** Es lo primero que lee el usuario en la calle.
- **Opciones (de la ficha).** Un texto nuevo en doce idiomas (decisión de contenido).

**K-78 — el cartel de transición tras un rescate pedido**

- **Qué es y por qué hay que elegir.** La pantalla «rescate concedido» ya le cuenta al usuario que el punto queda atrás; una marca debía evitar que, además, saliera el cartel de transición. La marca guarda la clave en un formato y la compleción la busca en otro, así que el cartel sale siempre.
- **Función.** No contarle lo mismo dos veces.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** La rama que retira la marca y se salta el cartel (`codigo-padre.html:9977-9978`) no se toma nunca con los datos de hoy.
- **Por qué importa y por qué debe seguir.** Dos avisos a la vez en un momento de decisión; y una comparación que no puede acertar.
- **Opciones (de la ficha).** A) la misma clave en la marca y en la compleción; B) dejarlo, corrigiendo la guía.

**K-79 — el cartel al cerrar el último elemento**

- **Qué es y por qué hay que elegir.** Al completar el último elemento de la aventura sale el cartel de transición solo con lo terminado, pero con la instrucción de siempre: pulsar avanzar y pulsar play para escuchar el audio. No hay más audio; al pulsar avanzar sale el modal de fin.
- **Función.** Decir al usuario que ha terminado el último punto y que avance para cerrar la aventura.
- **¿Otra herramienta lo cubre?** El modal de fin, después de pulsar avanzar.
- **¿Puede ser código muerto?** No: sale en cada aventura terminada.
- **Por qué importa y por qué debe seguir.** Es el último cartel que lee el usuario, y le pide algo que no existe.
- **Opciones (de la ficha).** Un texto propio para el último elemento (doce idiomas), o no sacar ese cartel.

**K-80 — hijo2 y el `PENDING_INICIADO` de su elemento**

- **Qué es y por qué hay que elegir.** Al crear la ficha de un elemento, el padre avisa a hijo2 con la clave de la ficha; hijo2 la compara con su id de coordenadas y no casa nunca (110 de 110 avisos medidos; ninguno de los 7092 elementos de los datos). La rama que apagaba el botón de ubicación no corre.
- **Función.** Según el código, apagar el botón de ubicación al empezar el seguimiento de un elemento.
- **¿Otra herramienta lo cubre?** El botón de ubicación lo deciden ya la distancia y `btnAvanzarCompletadoPorPadre`.
- **¿Puede ser código muerto?** Sí: la rama de hijo2 (`coordenadas-hijo2.html:2287-2290`). El aviso a hijo4 llega y casa, y solo se anota.
- **Por qué importa y por qué debe seguir.** No se ve. Es una comparación que no puede acertar, con un comentario y dos frases de la guía que la dan por buena.
- **Opciones (de la ficha).** A) retirar la rama de hijo2 y decidir si el aviso a hijo2 conserva destinatario; B) que el aviso lleve el id que hijo2 conoce (el apagado correría por primera vez: medir antes); C) dejarlo, corrigiendo la guía y el comentario.

**K-81 — `_notificarParadaCompletada`**

- **Qué es y por qué hay que elegir.** Una función que, al completarse un elemento, busca su ficha para borrarla con una clave que ninguna ficha tiene.
- **Función.** Borrar la ficha del elemento completado.
- **¿Otra herramienta lo cubre?** Sí: `intentarCompletarElemento` la borra justo después con la clave buena, y el avance también.
- **¿Puede ser código muerto?** Sí, la función entera (`codigo-padre.html:9814-9822`).
- **Por qué importa y por qué debe seguir.** No tiene efecto; quien lee cree que hay tres borrados y corren dos.
- **Opciones (de la ficha).** A) retirarla, con su llamada; B) dejarlo.
- **Aplicado (2026-10-13).** A. Commit `53bcac4`.

**K-82 — el botón de retos se apaga al volver dentro del radio**

- **Qué es y por qué hay que elegir.** `_configurarRetoBtn` apaga el botón de retos «hasta que termine el audio» cada vez que se le llama, también cuando el audio ya está resuelto: al volver dentro del radio de 15 m (basta una lectura fuera y otra dentro) y al recargarse hijo3. En español hay que oír el audio entero otra vez; en los once idiomas sin audio grabado no hay forma de volver a encenderlo y la parada queda bloqueada (medido en las dos sondas y en la pasada con caídas).
- **Función.** Que el reto no se abra antes de escuchar el audio.
- **¿Otra herramienta lo cubre?** La ficha del elemento ya dice si el audio está resuelto (`pending.audio`); `_configurarRetoBtn` no la mira.
- **¿Puede ser código muerto?** No.
- **Por qué importa y por qué debe seguir.** Es lo más grave que ha encontrado el recorrido: con GPS real, cerca del borde del radio, el usuario se queda sin poder completar una parada, y la app le recuerda cada veinte segundos que pulse un botón apagado.
- **Opciones (de la ficha).** A) que respete un audio ya resuelto cuando no es la activación del elemento; B) que volver dentro de rango y la recuperación de hijo3 no pasen por `_configurarRetoBtn`; C) dejarlo.
- **Decidido y aplicado (2026-10-13).** A, para todos los llamadores por igual: un solo sitio decide el botón de retos mirando todas sus variables (ver la ficha). Commit `5318ef7`.

**K-83 — dos funciones para las coordenadas del punto de inicio**

- **Qué es y por qué hay que elegir.** `_obtenerCoordenadasP0Fallback()` y `_obtenerCoordenadasFallbackP0()` contestan a lo mismo —dónde está el punto de inicio de la aventura— leyendo el mismo array por dos nombres. Si no encuentran la entrada, la primera da una coordenada fija de Valencia y la segunda dice que no hay.
- **Función.** Un último recurso cuando no se sabe adónde apuntar: la primera, para dar una posición al usuario si el GPS no arranca; la segunda, para el destino de la línea de «ir a ubicación».
- **¿Otra herramienta lo cubre?** Cada una cubre a la otra: son la misma búsqueda.
- **¿Puede ser código muerto?** No: las dos tienen llamador.
- **Opciones (de la ficha).** A) una sola función, y decidir qué devuelve cuando no hay entrada de inicio; B) dejar las dos.

**K-84 — el cartel del bloqueo de 5 km**

- **Qué es y por qué hay que elegir.** El cartel que avisa del bloqueo por estar a más de 5 km de la ruta se pide una sola vez, y cualquier otra pantalla de distancia lo quita al mostrarse; a esa distancia el padre pide la de «muy lejos de tu objetivo» en cada lectura. Leído en el código, sin ejecutar: lo esperable es que el usuario vea el cartel del bloqueo un instante y después la otra pantalla, con «avanzar» apagado y sin nada que diga por qué. Además, en el primer bloqueo su botón de reintento queda a la vista, y pulsarlo cierra el cartel.
- **Función.** Decirle al usuario que está fuera de la zona de la aventura.
- **¿Otra herramienta lo cubre?** La pantalla de «muy lejos» dice que está lejos de su objetivo, no que la aventura está bloqueada.
- **¿Puede ser código muerto?** El cartel no; su tiempo de espera tras cerrarlo (150 s) y su fila de distancia no llegan a usarse.
- **Estado.** Medido (M-25, 2026-10-13): el cartel del bloqueo dura hasta la siguiente lectura, lo tapa la pantalla de «muy lejos» y no vuelve; su botón de reintento queda a la vista en el primer bloqueo.
- **Opciones (de la ficha).** A) que el cartel del bloqueo mande mientras dura el bloqueo, con el botón de reintento oculto desde el primero; B) que el bloqueo no tenga cartel propio y lo diga la pantalla de «muy lejos»; C) dejarlo.

**K-85 — reactivar un elemento ya completado**

- **Qué es y por qué hay que elegir.** Si la app se recarga, o hijo2 se recupera, con el elemento ya completado y sin haber pulsado «avanzar», el elemento se activa otra vez desde cero. Al rehacerlo, el padre ve que ya estaba completado y no vuelve a encender «avanzar». Medido (M-23).
- **Función.** Que una parada no se complete dos veces.
- **¿Otra herramienta lo cubre?** No: ni el rescate, que pasa por la misma comprobación.
- **¿Puede ser código muerto?** No.
- **Por qué importa.** Es un bloqueo sin salida en una situación corriente: el teléfono cierra la app en segundo plano entre el final de una parada y el botón de avanzar.
- **Opciones (de la ficha).** A) que la activación mire si el elemento ya está completado; B) guardar y restaurar la ficha del elemento actual; C) dejarlo.
- **Decidido y aplicado (2026-10-13).** A, y además el rescate deja de ofrecerse a un elemento ya completado. Commit `f78d521`.

**K-86 — «avanzar» de hijo2, seis sitios y un flag**

- **Qué es y por qué hay que elegir.** El padre enciende o apaga «avanzar» desde seis sitios, y hijo2 guarda un solo «apagado desde fuera» para dos motivos (parada pendiente y bloqueo de 5 km): cuando termina uno, se levanta también el otro.
- **Función.** Que no se avance sin completar el elemento ni estando fuera de la zona.
- **¿Otra herramienta lo cubre?** En parte: pulsar «avanzar» sin el elemento completado no avanza.
- **¿Puede ser código muerto?** No.
- **Opciones (de la ficha).** A) un solo sitio del padre decide «avanzar», como el del botón de retos; B) un flag por motivo en hijo2; C) dejarlo.

**K-87 — el rescate con el reto disponible y sin resolver**

- **Qué es y por qué hay que elegir.** El rescate da el elemento por hecho, pero si su reto estaba disponible y sin resolver, el padre se queda esperando ese reto y no enciende «avanzar». Medido (M-24).
- **Función.** Sacar al usuario de un punto al que no puede llegar.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** No.
- **Opciones (de la ficha).** A) que el rescate deje el reto como hecho; B) que la compleción no espere al reto cuando la ficha ya lo trae; C) dejarlo.
- **Decidido y aplicado (2026-10-13).** B. Commit `f78d521`.

**K-88 — lo que no se devuelve a un hijo recargado**

- **Qué es y por qué hay que elegir.** A hijo3 recargado no se le vuelve a decir cómo está su barra de progreso; a hijo4 recargado se le reenvía un reto que ya se cerró.
- **Función.** Que un hijo recuperado quede como estaba.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** No.
- **Opciones (de la ficha).** A) que el `HIJO_LISTO` de cada hijo le devuelva su estado por el sitio que lo decide; B) dejarlo.
- **Medido y aplicado (2026-10-13).** A. Commit `acfebb1`; con él deja de salir el aviso de arranque «Destino desconocido desde padre: 'hijo3'».

**K-89 — lo hecho en el elemento actual no sobrevive a una recarga**

- **Qué es y por qué hay que elegir.** Al recargarse la app con una parada a medias, el audio escuchado o saltado y el reto resuelto se pierden y hay que repetirlos: la ficha del elemento no se guarda. Además la escriben siete funciones por separado, así que guardarla bien pide antes un solo sitio que la escriba.
- **Función.** Que el usuario continúe donde lo dejó, como dice la guía.
- **¿Otra herramienta lo cubre?** `vv_paradas_completadas` guarda los elementos completos; lo de dentro del elemento actual, nada.
- **¿Puede ser código muerto?** No.
- **Opciones (de la ficha).** A) guardar la ficha entera, por un solo sitio; B) guardar solo el audio terminado; C) no guardar nada. Con dos detalles a decidir si se guarda: el reloj del recordatorio de rescate y la llegada.
- **Decidido y aplicado (2026-10-13).** A. Commit `e249843`.

**K-90 — el recordatorio de retos y la cola de retos al reactivarse un elemento**

- **Qué es y por qué hay que elegir.** La activación paraba siempre el recordatorio «pulse retos» y preparaba la cola de retos vacía, sin mirar si el elemento volvía con el audio terminado o con los retos hechos (al recuperarse hijo2, o al reanudar tras una recarga). Medido en el spec 124.
- **Función.** Que un elemento que se reactiva a medias quede como estaba.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** No.
- **Opciones (de la ficha).** A) la activación decide mirando lo hecho, con una sola pregunta por «retos hechos»; B) dejarlo.
- **Aplicado (2026-10-13).** A, con K-89, en el commit `e249843`: es lo que hace que lo decidido en K-89 se cumpla. Cambia lo que ve el usuario en un punto (el aviso vuelve a salir tras una reanudación o tras recuperarse hijo2); si no se quiere, se quita sin tocar K-89.

**K-91 — el rescate que no se cobra si la app se recarga antes de avanzar**

- **Qué es y por qué hay que elegir.** El rescate se cobra al avanzar, y el apunte de ese cobro vive solo en memoria. Desde K-85, si la app se recarga entre el «Sí» y «avanzar», el punto sigue completado y el rescate no se cobra. El cobro se difirió para proteger al usuario de pagar sin recibir nada; hoy lo que recibe sí queda guardado y lo que paga no. Medido (M-26): sin recargar se cobra; recargando antes de avanzar, no.
- **Función.** El número de rescates por aventura es un límite: que se gaste cuando se usa.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** Con la opción A, sí: `_rescateGastoPendiente` y `_cobrarRescateSiProcede` sobran.
- **Opciones (de la ficha).** A) cobrar al conceder; B) seguir cobrando al avanzar y guardar el apunte con el progreso; C) dejarlo.

**El ayudante `cargarHijosDelPadre` (arnés de tests, sin entrada K)**

- **Qué es y por qué hay que elegir.** Los specs que cargan los hijos del padre lo hacen con un `page.evaluate` que dura lo que la carga. Con la máquina caliente ese `evaluate` falla alguna vez con «Execution context was destroyed» (entre el 0,1 % y el 0,3 % de las ejecuciones, sobre todo en pixel5; medido el 2026-10-06 y el 2026-10-07). La aplicación queda exonerada: un solo documento, ningún `navigate`, y el padre sigue vivo. El disparador natural no se ha hallado.
- **Función.** Que la tanda de los cuatro navegadores no caiga por el arnés.
- **¿Otra herramienta lo cubre?** No.
- **¿Puede ser código muerto?** No aplica: es arnés que falta, no código que sobra.
- **Estado.** El ayudante (`cargarHijosDelPadre(page, { resto, casa })`, un `waitForFunction` que dispara la carga una sola vez) está escrito y probado en una copia con el fallo inyectado de forma determinista. No está en el repositorio. El parche preparado toca 28 specs; una búsqueda por nombre de `cargarRestoDeiframes` y `cargarHijoCasa` da hoy 29 ficheros de `tests/e2e/`, sin leerlos uno a uno.
- **Opciones.** A) aplicarlo a esos specs (con su párrafo en la guía y `npm run lint`) y correr la tanda de los cuatro navegadores; B) dejar los specs como están.
- **Aplicada la A (2026-10-13, `88db770`), con el ayudante corregido antes.** El usuario había descartado dejarlo y respondió con su visto bueno general al informe que la daba por pendiente; se aplicó con él ausente. **Lo que cambió respecto a lo preparado:** los controles, repetidos sobre el repositorio antes de dar nada por bueno, encontraron un hueco en la versión preparada. Esa versión empezaba leyendo `performance.timeOrigin` con un `page.evaluate` corto para reconocer después un documento nuevo, y una invalidación del contexto a +1, +2 y +3 ms caía sobre esa lectura: el ayudante fallaba con el mismo «Execution context was destroyed» que venía a evitar (chromium y pixel5, una pasada cada uno y el mismo resultado; los controles anteriores de esa versión, a +0, +5, +40 y +80 ms, no caían en ese hueco). La versión aplicada no lee nada antes: escucha `framenavigated` del marco principal desde Playwright mientras espera y, si salta, lanza «el marco principal del padre navegó mientras se cargaban los hijos», mande lo que mande el resultado de la espera. **Controles sobre la versión aplicada** (sonda desechable; el inyector re-emite `Runtime.executionContextCreated` del contexto principal): con el patrón viejo, falla con el mensaje exacto (el control positivo); con el ayudante e invalidaciones a +0, +0/0/0, +1/2/3, +5/5/5, +20/20/20, +40/40/40, +80/80/80 y +10/30/60/100 ms, termina con los siete hijos listos, en chromium y en pixel5 (en firefox y WebKit el inyector no aplica); con una recarga real del padre, falla con su mensaje en los cuatro navegadores; en una carga normal no hay ningún `framenavigated` del marco principal (0 en los cuatro), y sí lo hay con `history.pushState` y con un cambio de `hash` (1 cada uno): un cambio de URL en el mismo documento durante la carga también lo haría fallar, a la vista y con ese mensaje. **Aplicado en** 32 specs y 36 sitios: los 28 specs y 31 sitios del parche preparado, que seguía casando, y los specs 122 a 125 (5 sitios), que lanzaban la carga en un `evaluate` corto y esperaban fuera. Quedan llamando a los cargadores el spec 08 (comprueba que están publicados) y dos sitios del 80 (cargan sin esperar a propósito). **Spec nuevo, el 126** (AY-1 a AY-3): carga normal con los siete hijos listos al volver, fallo ante una recarga real y fallo con el mensaje de la página si la carga se rechaza; lo que no puede versionarse es el control de la invalidación, que necesita el inyector. De paso, una directiva `eslint-disable` sin efecto en el spec 61. **Observado una vez y sin explicar:** en la primera redacción de AY-2, que recargaba el padre en el mismo instante de llamar al ayudante, `page.reload()` no llegó a su `load` en iphone12 (60 s; una vez de una); recargando cuando la carga ya está lanzada, 12 de 12 en los cuatro navegadores. No se repitió a ciegas. **Tanda:** la de los cuatro navegadores con el ayudante la cortó una hibernación térmica en iphone12 (chromium, firefox y pixel5 enteros, 638 cada uno, sin fallos); lo que siguió —la causa, el arreglo y la pasada de iphone12— está en K-94.

### R2.12 Re-verificación contra el código (2026-10-07)

**Encargo.** El usuario pidió (2026-10-07) contrastar este estudio con el código de hoy sin dar por bueno nada de lo que marca como hecho, cerrado o limpio, y comprobar en la misma pasada que no queda código muerto y que cada proceso tiene un solo camino. La pasada fue de solo lectura; lo nuevo se registra aquí (familia T, de K-62 a K-72; E10; G-48 a G-50), y lo único que se tocó después es lo que el usuario decidió (K-63 A) y las frases de la guía que el código contradice (G-48 a G-50).

**Método** (sobre `4bea83e`).

- Se volvieron a ejecutar los extractores de `tools/estudio-caminos/` y once herramientas del repositorio (`verificar-mensajeria`, `verificar-frames` con y sin `--detalle`, `codigo-muerto` con y sin `--contenedores`, `inventory --duplicates`, `inventario-timers`, `verificar-esperas`, `verificar-docs`, `verificar-totales` y `verificar-datos`). Todos terminan, y donde este estudio da una cifra, la de hoy casa con su cierre: 92 tipos del bus (K-57), 60 entradas de `APP_SHELL`, todas en disco (K-04), ningún id pedido sin definir (R2.0) y ninguna referencia local a un fichero que no existe (K-44, que corrigió la única).
- `no-unused-vars` de ESLint con `vars: 'all'` y sin ignorar el prefijo `_`, sobre 271 ficheros de `js/`, los HTML, `tests/` y `tools/` (el lint del proyecto no aplica la regla a `js/*.js`, y en los HTML ignora lo que empieza por `_`): en producción, cuatro avisos, uno falso (`_irANormativa`, que llama un `onclick`) y tres reales (K-64); en `tests/`, 12, y en `tools/`, 44, variables de páginas de prueba y de scripts de análisis.
- Un censo propio, por línea, de cada mecanismo en el código de producción: transporte entre frames, carga y `src` de iframes, supervisor, modo, GPS, almacenamiento, navegación de página, red, temporizadores y bucles de espera, y los listeners del ciclo de vida de la página.
- Para cada entrada dada por hecha, búsqueda desnuda de lo retirado en todo el repositorio y lectura del código que queda. Dos sondas de Playwright en una copia: la de K-63, antes y después (da también las cifras de K-70), y la de K-72.

**Lo que se sostiene, comprobado en el código de hoy.**

- Un solo transporte de mensajes entre frames: cuatro `postMessage` y un listener de `message` en `js/mensajeria.js`, más el canal propio del service worker (K-16). Fuera del bus solo están los dos inyectores del padre sobre el DOM de hijo5 (tabla de K-28), las lecturas de K-26 y de E8 y la comprobación `tienePadre` de `mapa-completo.html` (`:182`).
- Un solo cargador de hijos, `cargarHijo`, al que llaman `cargarIframeSoloSeleccion`, `cargarHijoCasa` y `cargarRestoDeiframes`; los demás `src` de iframes son del overlay de navegación externa, de la limpieza de `pagehide`, de la recarga del supervisor y de los nietos, que cargan la selección (el puzzle y `video-intro`), hijo4 (el puzzle) e hijo6 (`video-intro`) (K-22, K-57).
- Un solo reloj del supervisor (`iniciarHeartbeat`, con un llamador) y una sola acción de recuperación (`recuperarHijo` → `recargarIframe`, que también usa el reintento al volver la red) (K-11, K-57, K-58).
- Un solo escritor del modo en el padre: `manejarCambioModo` (`js/app.js:428`, con un llamador, `codigo-padre.html:7539`) y su vuelta atrás, `restaurarEstadoModoAnterior` (`:814`, que solo llama ella). Se llega a él por un solo handler, `_hdl_SISTEMA_CAMBIO_MODO` (`codigo-padre.html:7415`), al que llegan los cuatro `despacharLocal(SISTEMA.CAMBIO_MODO)` del padre (`:4981`, `:12635`, `:12643` y `:12807`) y la petición del botón de hijo5, la herramienta de desarrollo (ver §24; `boton-casa-hijo5.html:682`). En los hijos, los espejos locales de hijo3 (`audio-hijo3.html:1400`) e hijo4 (`retos-hijo4.html:1225`).
- Un solo `watchPosition` vivo: lo abre `activarGPS` (`codigo-padre.html:5819`) y lo vuelve a abrir, con los mismos handlers y un tope de 3, el reintento por `TIMEOUT` (`_gpsDoRetryWatch`, `:5470`); K-17 sigue con sus seis `getCurrentPosition` (decisión abierta).
- Lo retirado por la lavadora de mensajería y por K-04, K-11, K-12, K-22, K-35, K-40, K-41, K-42, K-55 y K-57 a K-59 no aparece en producción (solo en comentarios que cuentan por qué no está), y lo que dejaron K-01, K-02, K-03, K-07 A, K-23, K-24, K-38, K-39, K-44, K-45, K-47, K-48, K-56 y la parte hecha de K-53 es lo que dicen sus fichas, salvo lo que corrigen K-63 (sobre K-57), K-66 (sobre K-01 y K-02) y K-72 (sobre K-54).
- Las claves que algún handler lee y ningún emisor manda (`extract-payload`): 12 tipos con emisores literales y 4 con emisor opaco. Diez de los doce son los «de efecto benigno» que K-36 dejó a propósito (los otros dos de su lista, `SISTEMA.HIJO_FALLIDO`, retirado con K-57, y `SISTEMA.CONFIRMACION`, no salen hoy). `SISTEMA.PADRE_DATOS` (`idioma`) es un falso positivo del extractor, que no ve el `Object.assign` con el que el padre añade el estado del chat al mensaje de hijo6 (`codigo-padre.html:7161-7162`). `CONTROL.DESHABILITAR` (`motivo`) es lo que dejó la rama muerta 2 de K-36: hijo2 ya no compara `motivo` con nada, pero lo sigue escribiendo en su log (`coordenadas-hijo2.html:1463-1464`) y los emisores mandan `razon`; de efecto benigno, como los otros. Los cuatro de emisor opaco son los que K-36 leyó a mano, menos `PADRE_DATOS`, que ya tiene emisor literal; esa lectura no se repitió.

**Lo que no se sostenía.** E10 (R2.3), la frase de K-57 sobre la espera de hijo1 (K-63), el cierre de K-01 y K-02, que dejó sin lector tres claves de `CONFIG_PADRE` (K-66), y la «espera acotada» de K-54 (K-72). En la guía, G-48 a G-50.

**Nuevo** (familia T). K-62 (esperas escritas a mano), K-63 (la espera de «padre listo», decidida y aplicada), K-64 (tres variables muertas), K-65 (`limpiar()` del bus), K-66 (`CONFIG_PADRE`), K-67 (objeto API del state-manager), K-68 (guardas de `origen` inalcanzables), K-69 (CSS sin uso), K-70 (la respuesta al latido), K-71 (el radio del círculo naranja) y K-72 (la promesa sin plazo de la reanudación). Las decisiones que abren están en R2.11.9 y en R2.9.4 (filas 37 a 47).

**Censo de frames (regla 3b).**

| Frame | Entradas de la familia T | Mirado sin hallazgo nuevo |
|---|---|---|
| padre | K-62 (nueve esperas), K-66, K-68 (7), K-70 (su handler), K-72 | transporte, carga de hijos, supervisor, modo, GPS |
| selección | K-63 (aplicada), K-68 (3), K-70 | carga del puzzle y de `video-intro` |
| hijo1 | K-63 (aplicada), K-68 (3), K-70 | — |
| hijo2 | K-62 (una espera), K-68 (2), K-70, K-71 (su comentario de `radioLlegada`) | el log de `motivo` de K-36 |
| hijo3 | K-68 (2), K-70 | espejo del modo |
| hijo4 | K-70 | espejo del modo; carga del puzzle |
| hijo5 | K-68 (6), K-70 (y su respuesta sin latido) | petición de cambio de modo |
| hijo6 | K-70 | carga de `video-intro`; el `idioma` de `PADRE_DATOS` |
| mapa-completo | ninguna | `tienePadre` (`:182`) y el logger (`:174`, K-39) |
| puzzle | ninguna | solo los censos de transporte, `src`, `while` y guardas |
| video-intro | K-69 (37 reglas; `--tx` y `--ty`) | solo los censos |

Fuera de los frames: `js/funciones-mapa.js` (K-62, K-64, K-71), `js/mensajeria.js` (K-65; el lado del bus de K-68 y K-70), `js/state-manager.js` (K-67) y `js/app.js` (K-62).

**Límites.** No se repitieron las mediciones M-1 a M-22 ni se mutaron los arneses de K-32 y K-34. No se leyó el código de `video-intro.html`, `puzzle.html` ni `mapa-completo.html` más allá de los censos. Los 22 `requestAnimationFrame` sin `cancelAnimationFrame` siguen sin revisar uno a uno (K-30), y las reglas CSS de K-69 tampoco se leyeron una a una. El recorrido real con espía de mensajes (EJE 28) no se ha repetido desde K-57, que cambió el arranque y la recuperación de los hijos, y su instrumento hay que reconstruirlo.

### R2.13 Recorrido real con espía (EJE 28, 2026-10-07 y 2026-10-12)

**Encargo.** El recorrido real de §36.28 no se había repetido desde K-57, que cambió el arranque y la recuperación de los hijos, y su instrumento había que reconstruirlo (R2.12, «Límites»). El usuario autorizó ejecutarlo, con el audio acelerado. El 2026-10-12, con su permiso de nuevo, se corrieron las dos pasadas que faltaban (con dos caídas de hijo añadidas a la primera) y, a raíz de lo que encontraron, una sonda corta en dos idiomas.

**Método.** Chromium por la biblioteca de Playwright, con la PWA servida por `js/server.js`. Un espía, inyectado en todos los frames antes que su código, registra cada mensaje que recibe cada frame (de qué ventana viene, su `origen` y su `destino`, y qué hará el bus con él, siguiendo las mismas comprobaciones que `manejarMensajeEntrante`), cada `despacharLocal`, la carga de cada frame y la inicialización de su bus, los avisos de descarte con su pila, los carteles `#cartel-*` y los errores. El recorrido solo usa controles reales (clic, rueda, teclado) y un GPS continuo con ruido (1 Hz, 1,4 m por lectura, σ 2 m); del padre solo lee estado para saber cuándo seguir. Simulaciones, declaradas en cada informe: el modo de desarrollo (ver §24), el audio a ×16, el GPS por `setGeolocation` (con su error espurio conocido de Chromium, contado aparte) y, en dos pasadas, la caída de un hijo (su documento pasa a `about:blank`). El instrumento queda fuera del repositorio.

**Pasadas.**

| Pasada | Qué recorre | Resultado |
|---|---|---|
| `corto` (×2) | P1-P16 entera, CASA con tres elementos de hijo5, paso a AVENTURA y cinco elementos (P-0 a P-2) | La primera se paró en TR-1 por un error del instrumento (esperaba el fin del audio en la ficha del padre, que se borra al cerrarse el tramo: así salió K-73); la segunda, sin fallos |
| `variantes` | Los ocho primeros elementos con, intercalado: imagen, mapa completo, mapa vintage, controles de audio, hijo1 (listado, temporizador, una página de contenido), vídeo del tramo, el asistente (hijo6), vuelta a CASA y regreso (ver §24), recarga con reanudación, hijo3 caído, desvío de 90 m y vuelta, esperas sin pulsar play ni retos, y el atasco con rescate | Todo, salvo el rescate: el instrumento no llegó a pedirlo (su localizador de la pregunta del atasco casaba con 18 elementos) y, con el asistente abierto encima, no pudo pulsar avanzar; la pasada se paró en TR-4 |
| `aventura-terminar` | P1-P16, paso a AVENTURA sin CASA y los 65 elementos de la Aventura1 andando (4,2 km); en TR-2, el atasco de 8 min y el rescate pedido desde el asistente (hijo6); al final, el modal de fin con cuatro estrellas y un comentario, «terminar», la despedida (P17) con los agradecimientos leídos hasta el final, y la vuelta a P1 | Sin fallos |
| `aventura` con caídas (es, 2026-10-12) | P1-P16, CASA, AVENTURA y los doce primeros elementos, con dos caídas simuladas justo antes de pulsar avanzar: hijo4 (de TR-3 a P-3) y hijo3 (de TR-5 a P-7) | Se paró en P-7: tras la caída de hijo3 el botón de retos no vuelve a encenderse (K-82; «K-07, revisión: medido») |
| `sonda` (en y es, 2026-10-12) | P1-P16, AVENTURA sin CASA y tres elementos; en P-1, con el audio resuelto, el usuario sale 25 m y vuelve | En inglés se paró: el botón de retos no vuelve (K-82). En español siguió tras volver a escuchar el audio entero |
| `aventura` (es, 2026-10-12) | P1-P16, CASA con tres elementos y los 65 elementos de la Aventura1 andando; variantes de reto (una respuesta mal, la ayuda, un reto saltado y un puzzle con el tiempo agotado); modal de fin con «otra aventura» y vuelta a P1 | Sin fallos (66,7 min) |
| `aventura` (en, 2026-10-12) | Lo mismo en el idioma sin audio grabado: cada audio se resuelve con su botón de saltar | Sin fallos (59,8 min). Un primer intento se paró en P-0 por un error del instrumento: el reto se abre un segundo después de llegar, con el cartel de llegada encima de la ventana del reto, y el clic en la primera opción lo recibió el cartel |

**Lo que se sostiene (medido).**

- El bus: ningún mensaje descartado por fuente, por falta de origen o por suplantación; ningún error en ningún frame; cada frame inicializa su bus antes de recibir su primer mensaje. Sin handler, solo `SISTEMA.CAMBIO_MODO_APLICADO` en hijo6, que ya recoge K-46.
- El supervisor (K-57): con hijo3 sin contestar, a los tres latidos sin respuesta recarga su iframe; hijo3 vuelve a estar listo a los 12 s.
- La reanudación: recargar a media aventura conserva el índice (8) y el elemento (TR-3).
- La llegada: en los 29 tramos recorridos andando, los dos sensores la dan entre 2,7 y 15 m del final, nunca más lejos (el radio de llegada, 15 m, y no la tolerancia dinámica: G-52).
- Los recordatorios: «pulse play» y «pulse retos» cada 20 s mientras no se pulsa; el de rescate, a los 8,5 min (`variantes`) y a los 8,1 min (`aventura-terminar`) del fin del audio del tramo. El fin del audio pone a cero el reloj de la ficha: en `variantes` el audio acabó 2,8 min después de activarse el tramo y el recordatorio salió a los 11,3 min de la activación, no a los 8. El barrido corre cada minuto.
- La carga de los hijos: en todas las pasadas, hijo1 a hijo6 cargan al mostrarse P14 (a los 275-279 s del arranque), no antes.
- La aventura entera en español y en inglés (2026-10-12), con el paso CASA: 65 elementos y 33 retos cada una, sin un fallo. En inglés ningún audio suena: los 65 se resuelven con el botón de saltar, que aparece solo.
- El puzzle con el tiempo agotado: `PUZZLE.TIMEOUT`, el botón de continuar y `RETO.COMPLETADO` con `correcto: true`; la parada se completa.
- La salida «otra aventura»: el padre se recarga (segunda carga del padre y de la selección) y la selección vuelve a P1.
- El rescate: pedido desde la pregunta del atasco del asistente (hijo6), con sus dos confirmaciones y la pantalla final; el tramo queda completo y el usuario avanza (con el cartel de más de K-78).
- El fin: el modal de fin de aventura, «terminar», la despedida (P17) y la vuelta a P1.
- Las pantallas de distancia: a los 20 s de estar a 90 m de la ruta se ve la de «desviado»; la gracia de esa franja (15 min) solo retrasa la restricción de vídeo, avanzar, audio y retos (`coordenadas-hijo2.html:854-882`).

**Conocido, medido otra vez.** Al cargar el padre (y al recargarlo) sale un «Destino desconocido desde padre: 'hijo3'»: `inicializarControlesAudioPadre` manda a hijo3 el estado de su barra de progreso antes de que el padre lo registre (`codigo-padre.html:10176-10183`). El llamador lo atrapa; la marca de «ya notificado» se pone antes del envío, así que ese primer estado no se vuelve a mandar hasta que cambie. Estaba en las notas del proyecto como decisión pendiente de arranque y audio; no estaba en este documento.

**Nuevo** (familia U). K-73 (el segundo aviso de llegada recrea la ficha), K-74 (el mapa mide el elemento anterior hasta un segundo), K-75 (la ficha de CASA conserva su reloj), K-76 (`retoActualId` de hijo4), K-77 (el texto del cartel de inicio), K-78 (el cartel de transición tras un rescate pedido), K-79 (el cartel del último elemento), K-80 (hijo2 no reconoce el `PENDING_INICIADO` de su elemento), K-81 (`_notificarParadaCompletada` no borra nada) y K-82 (volver dentro del radio apaga el botón de retos con el audio ya resuelto). K-80 y K-81 salieron el 2026-10-12, al releer las trazas contra el código; K-82, de las pasadas de ese mismo día. En la guía, G-51 a G-62, corregidas en `44a76ec`.

**Añadido al cerrar la guía** (familia V, sin recorrido). K-83 (dos funciones para las coordenadas del punto de inicio) y K-84 (el cartel del bloqueo de 5 km) salen de contrastar con el código las frases de la guía que quedaban sin comprobar (G-64, `1e2e317`). Están leídas, no medidas: K-84 pide una pasada propia.

**K-82, aplicada (2026-10-13).** Un solo sitio decide el botón de retos de hijo3 (ver su ficha): spec 122, 9 rojos y 3 controles verdes con el código anterior y 12 de 12 con el cambio, en chromium. Al mirar el mismo error en los otros hijos salen cuatro entradas (familia W), dos de ellas medidas ese mismo día (K-85 y K-87, M-23 y M-24): K-85 (reactivar un elemento ya completado deja «avanzar» apagado), K-86 («avanzar», seis sitios y un flag), K-87 (el rescate con el reto disponible) y K-88 (lo que no se devuelve a hijo3 y a hijo4 al recargarse). Commit `5318ef7`; los specs 22, 30, 34, 39, 43, 44, 50, 103 y 120 pasan en chromium (62 de 62) y la tanda de los cuatro navegadores no se ha lanzado. K-85 y K-87 se arreglan ese mismo día en `f78d521` (spec 123), y para K-89 el usuario decide guardar la ficha entera.

**Las cifras del 2026-10-12** (pasadas `aventura` en español y en inglés). K-73: la ficha se recrea en 23 de 24 tramos cerrados (el otro, TR-18, porque el aviso de hijo2 llegó después de avanzar) y en 24 de 24. K-74: llegada rancia en 64 de 64 avances y en 63 de 64; el cartel de llegada al inicio vuelve a salir con TR-1 activo en las dos (a los 637 ms y a los 402 ms del cambio), y en las dos sondas, sin paso CASA, sale además dos veces seguidas al llegar al inicio (a 0,3 s y a 0,5 s una de otra). K-75: los tres elementos visitados en CASA llegan a AVENTURA con su ficha ya creada, en las dos. K-80: ninguno de los 204 avisos de ese día casa (314 de 314 con los del día 7). K-82 no sale solo en las pasadas largas (ningún `DESHABILITAR` de `esperar_fin_audio_aventura` tras un `HABILITAR` del mismo elemento, 0 de 37 en inglés): el GPS simulado deja al usuario sobre el punto de la parada, lejos del borde del radio.

**Observado, sin entrada.** En inglés el reto se abre un segundo después de llegar a la parada, con el cartel de llegada todavía a la vista: los carteles van en `z-index: 1000060`, bajo la cabecera, y quedan encima de la parte alta de la ventana del reto. Un toque en la primera opción lo recibe el cartel (medido: la opción no se marca y el cartel se cierra 0,11 s después).

**Medido lo que K-61 dejaba sin medir** (pasada `variantes`).

- *Qué reciben los hijos con la activación de más.* En la segunda entrada en AVENTURA, con el progreso real en `Av1-P-2`, el padre se despacha `NAVEGACION.CAMBIO_PARADA` de `Av1-P-0` (`contexto: 'arranque_aventura'`) antes de mandar el `CAMBIO_MODO` a los hijos, y la activación entera de `Av1-P-0` llega a cuatro de ellos: a hijo2, dos `DATOS.COORDENADAS_PARADAS_REQUEST`, `PENDING_INICIADO` de `padre-P0`, `CAMBIO_PARADA` y `CONTROL.DESHABILITAR` (`btnAvanzar`); a hijo3, `AUDIO.REPRODUCIR_REQUEST` con el audio de `Av1-P-0`, `CAMBIO_PARADA` y `CONTROL.DESHABILITAR` (`retosBtn`); a hijo4, `PENDING_INICIADO` y `CAMBIO_PARADA` con el reto de `Av1-P-0`; a hijo5, `CAMBIO_PARADA`. Unos 100 ms después llega la de `Av1-P-2`. El `PENDING_INICIADO` de `padre-P0` dice que el padre crea otra vez la ficha de un elemento ya completado; ninguno de los `delete` que corren la borra después (`codigo-padre.html:9724`, `:9728` y `:9765` son de otro elemento). En esa ventana no sale ningún cartel ni ningún descarte; lo que pinta el mapa no lo ve la traza.
- *La reanudación* (`restaurado: true`). Tras recargar a media aventura, el padre se despacha un solo `CAMBIO_PARADA`, el del elemento guardado (`Av1-TR-3`, índice 8): ahí no hay activación de más.

**K-07, revisión: medido** (pasada `aventura` con caídas, 2026-10-12; simulación declarada: el documento del hijo pasa a `about:blank` 1,5 s antes de que el usuario pulse avanzar). En la pasada `variantes` del día 7 la ventana no llevaba más tráfico que tres latidos; aquí el usuario actúa dentro de ella.

- *hijo4 caído al avanzar de TR-3 a P-3.* El padre le manda igualmente `PENDING_INICIADO` y `NAVEGACION.CAMBIO_PARADA` (para él sigue en `hijosInicializados`), y se pierden. El supervisor lo recarga a los 11 s, con tres latidos sin respuesta, y el padre no le repite el `CAMBIO_PARADA`. Sin efecto a la vista: el reto llega entero en `RETO.MOSTRAR` y la parada se completa.
- *hijo3 caído al avanzar de TR-5 a P-7.* Se pierden los dos intentos de `AUDIO.REPRODUCIR_REQUEST` (a 1,65 s y a 2,83 s de la caída), el `NAVEGACION.CAMBIO_PARADA` y un `CONTROL.DESHABILITAR`. A los 4,05 s el padre da el audio por no disponible (`_marcarAudioNoDisponible`): marca `audio` en la ficha y manda `CONTROL.HABILITAR` (`retosBtn`), que también se pierde. hijo3 vuelve a los 12,5 s y recibe el audio restaurado y un `CONTROL.DESHABILITAR` (`retosBtn`, `esperar_fin_audio_aventura`). Queda así: el play apagado y el botón de saltar a la vista con el audio ya cargado en hijo3 (`estado._audioFalloId` sigue puesto), el botón de retos apagado y el padre recordando que se pulse. La parada no se puede completar (K-82) y la pasada se paró ahí, en el elemento 12.

**Comentarios del código que no se sostienen, sin entrada.** `codigo-padre.html:8370-8375` habla de «los 8 carteles» de la familia: `_TODOS_LOS_CARTELES_IDS` (`:8376`) tiene diez ids. `js/indice-aventuras.js:2-5` dice que los totales «se calculan dinámicamente» en la selección: están escritos en el propio fichero, la selección los lee de ahí (`En-busca-del-tesoro.html:2204-2217`) y los vigila `npm run verificar-totales`. `boton-casa-hijo5.html` (junto a `manejarClickGPS`) habla de un «`enviarMensaje` local… postMessage crudo»: hijo5 usa el del bus (`:348`). Los de K-80 (`codigo-padre.html:9624-9626`) y K-82 (`:10862-10864`) van en sus entradas.

**Corregidos (2026-10-13, `583b3aa`; solo comentarios, ninguna línea de código).** De los dos párrafos de arriba y del de abajo: los «8 carteles» (son diez, y el recordatorio de rescate se impone como los cinco de «algo acaba de pasar»: seis llamadas a `_ocultarCualquierCartel()` y cuatro esperas con `_hayCartelEnPantalla()`), los totales de `js/indice-aventuras.js`, el «`enviarMensaje` local» de hijo5, las dos funciones del cartel del bloqueo «que llama `_hdl_NAVEGACION_GPS_RESTRINGIDO`» (búsqueda desnuda de `showGpsOutOfRangeOverlay` y `hideGpsOutOfRangeOverlay` en `*.html`, `js/*.js` y `tests/`: fuera de Script 1 solo un comentario del spec 56; su publicación en `globalThis` no tiene lector), «por baja precisión», el «30s» del timeout, los dos números de línea, los «4 scripts», `usuario_en_zona` de hijo2 y la cabecera de `js/controladores-padre.js` (tres controladores, no cuatro, y cada uno contesta con su mensaje). Quedan sin tocar los de K-80 (van con su decisión).

**Más comentarios que no se sostienen** (leídos al contrastar la guía, G-64; sin entrada). `codigo-padre.html:6034-6035` dice que `_hdl_NAVEGACION_GPS_RESTRINGIDO` llama a `showGpsOutOfRangeOverlay` y a `hideGpsOutOfRangeOverlay`: no llama a ninguna (`:10833-10852`). `:5947` dice de ese cartel que «es por baja precisión»: solo lo muestra el bloqueo de 5 km (el comentario de `:5940-5943`, siete líneas antes, sí lo dice bien). `:6676` da el timeout por «30s sin respuesta»: el `watchPosition` lleva 35 s (`:5822`) y sus reintentos 15, 30 y 60 (`:5484`). `:5241` y `:10991` dan números de línea que no son («línea ~9611», «línea ~4767»), y `:5258` habla de «los 4 scripts». `coordenadas-hijo2.html:1428` nombra la razón `usuario_en_zona`: el padre manda `de_vuelta_en_zona` (`codigo-padre.html:5670`). `js/controladores-padre.js:45-47` dice que el padre responde «reenviando el mismo CARGAR_*»: de sus tres handlers, solo el de textos (`:105-109`).

**Contenido, sin entrada.** En la Aventura1 hay seis pares de paradas seguidas con el mismo `nombre` (P-4, P-5 y P-6 se llaman «Plaza de la Virgen»; también P-8 y P-9, P-12 y P-13, P-18 y P-19, y P-28 y P-29), y el cartel de transición entre ellas dice «Ha terminado la parada X — va a empezar la parada X». Es una decisión de los datos.

**Censo de frames (regla 3b).** Los once cargan y su bus aparece en la traza en `variantes`: padre, selección, hijo1 a hijo6, mapa-completo, puzzle y video-intro.

| Frame | Entradas de la familia U | Recorrido sin hallazgo nuevo |
|---|---|---|
| padre | K-73, K-74 (su orden de aviso al mapa), K-75, K-78, K-79, K-80 (la clave que manda), K-81, K-82 | modo, reanudación, supervisor, recordatorios, rescate, fin de aventura |
| selección | ninguna | P1-P16 y la despedida (P17) |
| hijo1 | ninguna | listado, temporizador, página de contenido |
| hijo2 | K-73 (segundo sensor), K-74, K-80 | imagen, mapas, ubicación, pantallas de distancia |
| hijo3 | K-82 (su botón de retos) | audio, recuperación tras caída |
| hijo4 | K-76 | los 33 retos de la Aventura1 que se abren en hijo4: 13 de opción, 8 de opción múltiple, 7 de texto y 5 de puzzle; ningún puzzle con el tiempo agotado |
| hijo5 | K-75 (la ficha nace al visitar) | lista de CASA y el botón de vuelta a AVENTURA |
| hijo6 | ninguna (K-46, ya registrado) | FAQ y la petición de rescate |
| mapa-completo | ninguna | abrir y cerrar |
| puzzle | ninguna | el de introducción (P6) y los cinco de reto, dentro de hijo4 |
| video-intro | ninguna | las veinte escenas |

Fuera de los frames: `js/funciones-mapa.js` (K-73, K-74, K-77) y `js/traducciones-ui.js` (los textos de K-77 y K-79).

**Variantes.** Con estas pasadas quedan recorridas todas las variantes obligatorias de §36.28. Fuera de ellas, sin recorrer: otras aventuras y otros motores, lecturas GPS de mala precisión, el rescate agotado y el tiempo de la aventura agotado.

**Límites.** Solo Chromium; solo la Aventura1. El GPS simulado no tiene el ruido urbano real ni sus caídas de precisión: su `accuracy` es fija, de 4 m, así que ni el corte por precisión de hijo2 (50 m, `coordenadas-hijo2.html:1377`) ni el del bloqueo de 5 km (100 m, `codigo-padre.html:5612`) llegan a correr. El audio va a ×16 (los eventos son los mismos; cambia cuánto tardan). Lo que el espía no ve: lo que un frame hace sin pasar por el bus ni por `despacharLocal`.

### R2.14 Tanda de la noche del 2026-10-13

**Encargo.** El usuario, al irse a dormir, pidió avanzar todo lo posible de este estudio: verificar antes de tocar, quitar el código muerto y documentar en la guía. Se tomó como permiso para aplicar lo que ya estaba decidido, retirar código sin uso, arreglar lo que no cambia lo que ve el usuario y lanzar Playwright; no para decisiones de producto, textos ni `push`. Lo que cambia lo que ve el usuario y no estaba decidido se dejó medido o preparado.

**Aplicado.** Cada fila, con su spec en rojo antes cuando hay comportamiento que fijar; todo en chromium.

| Entrada | Qué | Commit | Comprobación |
|---|---|---|---|
| K-89 A y K-90 | la ficha del elemento la escribe un solo sitio, se guarda y vuelve al reanudar; la cola de retos y el recordatorio «pulse retos» miran lo hecho | `e249843` | spec 124 (9 tests; 6 en rojo antes y los 2 controles en verde); cinco líneas vistas en rojo por mutación; chromium entero, 625 de 625 |
| fila 66 | fuera `estado.retoActual.disponible` | `489f14d` | specs adaptados en verde con el campo y sin él; 93 de 93 |
| K-81 | fuera `_notificarParadaCompletada` | `53bcac4` | 108 de 108 |
| K-66 | `CONFIG_PADRE` queda en `{ LOG_PREFIX }` (las tres claves y una cuarta, `ID`) | `2ddb79f` | test 1f del spec 02 en rojo antes; 35 de 35 |
| K-64 | fuera tres variables de `js/funciones-mapa.js` | `18cfe1f` | 115 de 115, con K-65 |
| K-65 | fuera `limpiar()` y `colaMensajes` del bus | `93cb6dc` | lo mismo |
| K-68 | fuera las 23 guardas de `origen` | `1e1a660` | chromium entero, 626 de 626 (con todo lo anterior) |
| K-73 | a un elemento ya completado nadie le crea ficha | `479b06a` | spec 123, EC-6 a EC-9 en rojo antes; 160 de 160 |
| K-88 | un hijo recargado recibe su estado (barra de hijo3, reto de hijo4); sin aviso de arranque a hijo3 | `acfebb1` | spec 125 (4 tests; 3 en rojo antes y el control en verde); 106 de 106 |
| K-71 | el círculo naranja, con `radioLlegada()` | `8f36e78` | 54 de 54 |
| comentarios | los que este estudio tenía anotados como falsos | `583b3aa` | ninguna línea de código; 43 de 43 |

**Medido, sin tocar código.** K-84 (M-25: el cartel del bloqueo de 5 km dura hasta la siguiente lectura y no vuelve) y K-91 (M-26: recargando entre el «Sí» del rescate y «avanzar», el rescate no se cobra).

**Preparado, sin aplicar.** K-78 (el cartel de más tras un rescate pedido): test y parche probados, descritos en su entrada.

**Hallazgos nuevos.** K-90 (aplicada) y K-91 (por decidir; la abrió K-85). Dentro de K-66, la cuarta clave sin lector. Sin entrada: la publicación en `globalThis` de `showGpsOutOfRangeOverlay` y `hideGpsOutOfRangeOverlay` no tiene lector fuera de Script 1 (búsqueda desnuda en `*.html`, `js/*.js` y `tests/`).

**No tocado, y por qué.** K-67 (hay que elegir qué nombre se queda de cada par y si la herramienta de consola `diagnosticar` sobra). K-72 (al releerla: el «sin plazo» de esa espera es lo que aguanta una conexión lenta; un plazo fijo de 30 s daría el aviso de fallo sin haber fallo, así que la opción A pide decidir el plazo y si escala con la conexión). K-80 (decidir qué es `PENDING_INICIADO` toca el bus). K-83 (qué devuelve la función cuando no hay punto de inicio). K-86 (un solo sitio para «avanzar»: nivel 4, y va con K-84). K-74, K-76 y el reloj de K-75 (comportamiento; sin decisión). K-77 y K-79 (textos en doce idiomas). K-62, K-69 y K-70 (una decisión por sitio, o lectura caso a caso). K-78 y K-91 (cambian lo que ve el usuario o son regla del juego). La fila 58 (el ayudante `cargarHijosDelPadre`: el parche preparado es anterior a los specs 122 a 125 y habría que rehacerlo). Y las anteriores a la R2.12 que siguen abiertas.

**Censo de frames (regla 3b).**

| Frame | Tocado esta noche | Si no, por qué |
|---|---|---|
| padre | K-89, K-90, fila 66, K-81, K-66, K-68 (7 guardas), K-73, K-88, comentarios | — |
| selección | K-68 (3 guardas y el parámetro del latido) | — |
| hijo1 | K-68 (3 guardas y el parámetro del latido) | — |
| hijo2 | K-68 (2 guardas), un comentario | — |
| hijo3 | K-68 (2 guardas) | lo de K-88 que le afecta se arregla en el padre |
| hijo4 | no | ninguna guarda de K-68 (0 apariciones de las dos formas en `retos-hijo4.html`); lo de K-88 que le afecta se arregla en el padre; K-76 sigue abierta |
| hijo5 | K-68 (6 guardas), un comentario | — |
| hijo6 | no | ninguna guarda (0 apariciones); ninguna entrada aplicada lo nombra |
| mapa-completo | no | lo mismo |
| puzzle | no | lo mismo |
| video-intro | no | lo mismo |

Fuera de los frames: `js/funciones-mapa.js` (K-64, K-71), `js/mensajeria.js` (K-65), `js/indice-aventuras.js` y `js/controladores-padre.js` (comentarios). Specs nuevos: 124 y 125; con tests nuevos o adaptados: 02, 22, 39, 44, 68 (cabecera), 103, 120, 122 y 123.

**Trampa de instrumento.** Una mutación del padre servida con `page.route` no llega a la navegación de `page.reload()` si el service worker está activo: la sirve él. Tres mutaciones salieron en verde sin haberse aplicado. Las sondas de mutación que recargan van con `serviceWorkers: 'block'` y con una marca en el HTML servido que el test comprueba después de recargar.

**Tanda de los cuatro navegadores.** Lanzada al final, sobre `ded4476` (el último commit de código es `583b3aa`; después solo cambia este documento), con el usuario ausente y sin nada más corriendo en el proyecto: chromium, firefox, pixel5 e iphone12, 2536 tests (634 por navegador), **2536 de 2536 en verde**, de las 05:35 a las 06:39. Sin eventos de energía ni de temperatura del sistema durante la tanda (`Get-WinEvent`, proveedor Kernel-Power, ids 41, 42, 88, 107, 506 y 507: ninguno). Es la primera tanda de los cuatro navegadores desde K-82: cubre también K-82, K-85 y K-87, que solo tenían chromium.

### R2.15 Tanda del día 2026-10-13

**Encargo.** El usuario, al irse a trabajar, repitió el encargo de la noche (avanzar todo lo posible, verificar antes de tocar, quitar el código muerto, documentar en la guía). Se tomó igual que en R2.14: se retira lo que no tiene uso y se arregla lo que no cambia lo que ve el usuario; lo demás se mide o se deja con sus opciones; sin `push`.

**Aplicado.** Todo en chromium, con la suite entera después de cada paso.

| Entrada | Qué | Commit | Comprobación |
|---|---|---|---|
| K-41, revisión | campos de estado que solo figuraban en el literal inicial o que nadie lee, en siete ficheros; `estado.audioActual` queda en `{ id, estado }` y `vv_progreso` en diez claves | `c9463f8` | registrado antes (`f15083c`); FG-10 del spec 124 en rojo antes; búsqueda desnuda de cada nombre; 635 de 635 |
| K-69 | CSS que no aplica a nada (variables sin uso en su documento y reglas sin elemento), en ocho ficheros | `7f415a8` | medido antes con una sonda: ningún elemento casa, con un control por documento; 635 de 635 |
| K-93 | una función sin llamador, una importación que solo se publicaba y doce publicaciones en `globalThis` sin lector fuera de su bloque (padre, hijo2 e hijo4); cinco globals de `eslint.config.js`; y `tools/inventory-conexiones.js`, que contaba bloques de más | `1f26741` | registrado antes (`1088d7c`); búsqueda desnuda, también de claves computadas; 635 de 635 |

**Medido, sin tocar código.** K-92 (M-27): el ✓ y la ✗ de los retos de la selección se pintan en negro.

**Hallazgos nuevos.** K-92 (por decidir) y K-93 (aplicada). Dentro de K-41: hijo5 lee un campo de estado que nadie escribe. Dentro de K-69: `--audio-action-scale` sí se usa, y el barrido de variables sumaba entre documentos. Dentro de K-93: el generador de §37.2 de la guía contaba como bloque cualquier `<script>` escrito dentro de otro, y el lint no ve un nombre leído por `globalThis.X` (sí uno suelto: `no-undef` está en `warn` en los HTML de producción).

**Leído y dejado como está.** K-42, los exports «de uso interno»: de los 18 que da hoy `tools/codigo-muerto.js`, los 14 que no son del state-manager son funciones o constantes con llamadores dentro de su propio módulo (leída cada una con sus usos; a varias las nombran además specs): no hay código muerto, solo la palabra `export`; los otros cuatro son los de K-67. Importaciones sin uso en los `<script type="module">` de los HTML (`imports-sin-uso.cjs`, scratchpad): 126 nombres importados, ninguno sin uso en su bloque; quedan sin clasificar 37 importaciones dinámicas (un módulo entero en una variable, por su efecto, o dentro de un `Promise.all`), no comprobadas nombre a nombre. K-76, releída contra el código: el botón de saltar reto usa `estado.retoActualId` como «el reto activo» cuando el reto no se encontró, así que quitar la escritura del cambio de parada no es retirar código muerto; sigue siendo decisión. K-70: contrato del bus; decisión.

**No tocado, y por qué.** Lo que cambia lo que ve el usuario o es regla del juego: K-91, K-78 (preparada), K-84, K-74, K-77, K-79, K-92. Lo que pide una decisión de diseño: K-62, K-67, K-70, K-72, K-75 (el reloj), K-76, K-80, K-83, K-86. De K-69: `video-intro.html` y tres reglas de hijo3 con nota de «se mantiene». De K-41: el espejo de `estado.gps` (K-08), el literal del state-manager (K-07) y `estado.paradasConfirmaciones`. La fila 58 (el ayudante `cargarHijosDelPadre`): sigue pendiente del visto bueno del usuario. Y las anteriores a la R2.12 que siguen abiertas.

**Censo de frames (regla 3b).**

| Frame | Tocado hoy | Si no, por qué |
|---|---|---|
| padre | K-41, K-69, K-93 | — |
| selección | K-69 (cinco reglas) | K-41: sus seis campos de estado se leen; K-93: sus 14 publicaciones sin otro fichero se leen por `globalThis` o desde un `onclick` |
| hijo1 | K-69 (`--iframe-h`) | K-41: `estadoMenu` y `estadoTemporizador` sin campos sin lector; K-93: no publica nada que no use otro fichero |
| hijo2 | K-41, K-69, K-93 | — |
| hijo3 | K-41 (`inicializado`), K-69 | K-93: sus dos publicaciones se leen por `globalThis` |
| hijo4 | K-41 (`inicializado`), K-69 (la clase `deshabilitado`), K-93 | — |
| hijo5 | K-41 (cinco campos), K-69 (dos selectores) | K-93: no publica nada que no use otro fichero |
| hijo6 | K-69 (`--iframe-w`, `--iframe-h`) | K-41: su `estadoPadre` es el payload de `CHAT.ESTADO_PADRE`; K-93: lo mismo que hijo5 |
| mapa-completo | no | sin objeto de estado; ninguna regla sin elemento ni variable sin uso; no publica nada sin lector |
| puzzle | no | lo mismo |
| video-intro | no | sin objeto de estado; sus 37 reglas sin elemento no se han leído (K-69); sus cuatro publicaciones se leen por `globalThis` |

Fuera de los frames: `js/funciones-mapa.js` y `js/state-manager.js` (K-41), `eslint.config.js` y `tools/inventory-conexiones.js` (K-93). Specs: el 124 gana FG-10 (635 tests por navegador).

**Tanda de los cuatro navegadores, la de hoy.** Lanzada al final, sobre `2587f23` (el último commit de código es `1f26741`; después solo cambia este documento), con el usuario ausente y sin nada más corriendo en el proyecto: chromium, firefox, pixel5 e iphone12, 2540 tests (635 por navegador), **2540 de 2540 en verde**, de las 10:37 a las 11:41. Sin eventos de energía ni de temperatura del sistema durante la tanda (`Get-WinEvent`, proveedor Kernel-Power, ids 41, 42, 88, 107, 506 y 507: ninguno). Cubre en los cuatro navegadores lo aplicado hoy, que hasta aquí solo tenía chromium.

### R2.16 Tarde y noche del 2026-10-13

**Encargo.** El usuario leyó el informe de R2.15 y contestó, todavía en el trabajo, con el mismo encargo y su visto bueno. Se tomó igual, con una diferencia: la fila 58, que el informe daba por pendiente de ese visto bueno y que solo tenía una opción que él no hubiera descartado, se aplicó.

**Lo que se miró y no dio nada que retirar.** (1) El hueco del lint: en los HTML de producción `no-unused-vars` ignora todo nombre que empiece por `_`, que aquí es la costumbre para lo privado. ESLint sin esa excepción (y sin mirar argumentos), sobre `js/**/*.js` y los HTML: un solo aviso fuera de `js/vendor/`, `_irANormativa` en la selección, y es falso (la llama el `onclick` de `#btn-iniciar-aventura`). R2.12 pasó el mismo instrumento. (2) Los instrumentos de la guía contra el código, repetidos tras los cambios de la noche y del día: nombres citados que no existen, 32, los mismos (nombres del arnés y patrones); fichas de mensajes de §10.7, 0 discrepancias; handlers y salientes por frame de §26.12, 0 filas sin respaldo; payloads, 6 filas que el instrumento da por inciertas («emisor opaco»: `AVENTURA.ESTADISTICAS_TIEMPO`, `RETO.COMPLETADO` y `CHAT.ESTADO_PADRE`); citas por número de línea, 83 bien, 44 sin resolver y 0 mal.

**Lo que se corrigió de este mismo documento.** K-93 y R2.15 decían que `no-undef` está apagado para los `.html`; lo está solo para `tests/**/*.html` (`05f947d`). Salió al ejecutar ESLint sobre un `.html` de prueba en vez de leer un `grep` de su configuración.

**Aplicado.** La fila 58 (`88db770`): el ayudante `cargarHijosDelPadre` en 32 specs, con su guarda corregida antes de darlo por bueno, el spec 126 y su párrafo en la guía. El detalle, con los controles, está en la sección del ayudante de R2.11. En el mismo commit van el arreglo del calor de iphone12 (K-94: `gotoAndWaitForFase1` espera al arranque terminado) y el vigía térmico (`npm run test:e2e:vigilada`), con la sección 38 de la guía. Antes, solo en este documento: K-69, las 37 reglas CSS de `video-intro.html` leídas una a una, sin aplicar (`889cc3f`).

**Censo de frames (regla 3b).** Ningún frame se toca en lo aplicado de la fila 58: es arnés de tests (`tests/e2e/helpers/boot.js`, 34 specs —32 con el ayudante, el 61 y el 126, nuevo— y `tests/master-test.html`). Los once frames quedan como en R2.15.

**Tandas.** La de los cuatro navegadores, lanzada a las 21:33 con el usuario ausente, la cortó una hibernación térmica a las 22:21:58 (Kernel-Power 88), con chromium, firefox y pixel5 enteros y sin fallos (638 cada uno) e iphone12 empezado; el usuario volvió y pidió repetir solo iphone12, que hibernó otra vez a los 30 segundos. Fue él quien señaló que siempre era en iphone y en el mismo punto: de ahí sale K-94. Con el arreglo, iphone12 entero: 637 de 638 en 22,2 minutos, máxima 80 °C, sin cortes; el que cayó, HD-2b del spec 08, dependía del estado anterior al final del arranque y se adaptó (44 de 44 en los cuatro navegadores). **Pendiente:** chromium, firefox y pixel5 enteros con la espera nueva; no se lanzaron esa noche.

### R2.17 Madrugada del 2026-10-14: la segunda confirmación de aventura, el pago hecho y el código

**Encargo.** El usuario pidió una pantalla nueva en la selección: repetir la confirmación de aventura después del pago y antes del código, con ➣ al código y ✗ a elegir aventura. Eligió renumerar (la nueva es la P13 y las antiguas P13 a P17 pasan a P14 a P18), con cinco condiciones: fuera del modo DEV, que el pago hecho valga si cambia de aventura, dejar escrito lo del precio de la aventura larga, un solo camino, y la guía entera al día.

**Lo que salió al recorrerlo contra el código, antes de escribir nada.** La ✗ nueva obligaba a pasar otra vez por términos, audio y pago, cosa que no ocurría nunca. El usuario lo resolvió con una orden nueva (con el pago hecho, de elegir se va derecho a la P13) y pidió repasar juntos las variables que se podían escapar, porque son dos situaciones distintas y no quería que una confirmación sirviera para todo. De ese repaso salieron K-95 a K-103 y estas decisiones suyas:

- **Dos pantallas, no una con dos comportamientos:** la P9 confirma antes de pagar y la P13 después, cada una con sus dos botones fijos.
- **Precio por categoría:** aventuras cortas y largas, el mismo precio dentro de cada una (hará más de las dos; hoy la larga es la de 34 km). Con el pago hecho, las de la otra categoría salen con el botón apagado: así nadie reclama haber pagado dos aventuras. Pidió que al añadir una aventura se le pregunte si es larga o corta: queda en `npm run verificar-datos`, en la selección (no deja elegir una aventura sin categoría) y en la guía (§16.2, §22.0 y glosario).
- **La tarjeta se pinta al mostrarse**, de la variable que usa el código (K-96).
- **El código de compra no se gasta al escribirlo** («esto es inaceptable»): se comprueba en su pantalla, empieza a contar cuando la aventura arranca y sigue valiendo para ese email hasta que se acabe el tiempo. Hoy no hay servidor; se arregló lo que existe: el diseño escrito en la guía y el frontend, que llamaba a activar ya en la pantalla del código.
- **Se dejan como están:** el cartel FREE DEMO al volver a elegir con el pago hecho («eso es meterle más variables») y las estrellas de valoración de la P12, que quedan un rato sobre los botones de la P13 («así incitamos a que valore»; leído en el CSS, sin medir en pantalla).
- **«Elegir otra aventura» recarga** (K-95), medido antes a petición suya.
- **No se enseña el mapa vintage** de la aventura nueva cuando se va derecho a la P13 (su palabra fue «directamente»; se le dijo y no lo cambió).

**Aplicado.** `c9c90fb` (K-95). Y en `4c0895a`: la P13 y la renumeración (selección, padre, `js/constants.js`, 21 specs); `categoria` en `js/indice-aventuras.js` y su comprobación en `tools/verificar-datos-aventuras.js` (con su control: falla al quitarle la categoría a una aventura); `categoriaPagada`, `continuarTrasPago()`, `continuarTrasElegirAventura()` y la puerta de `mostrar(13)`; los botones de la P7 repintados en el acto al volver a ella (sin eso, quien vuelve con el pago hecho tendría unos instantes encendidas las aventuras de la otra categoría); `ApiClient.comprobarCodigo()` y `ApiClient.activar()` con `_avisarInicioDeAventuraAlServidor()`; specs 127 (11 tests) y 129 (4). La renumeración se hizo con un desplazador de una sola pasada que imprime cada línea que cambia: se leyeron las 44 de la selección, las 98 del padre, los módulos y los specs, y las 241 de la guía. `npm run verificar-mensajeria` casa emisor y receptor del aviso renombrado (92 tipos, ninguno sin receptor ni sin emisor).

**Rojo antes que verde.** Contra el código anterior, 13 de los 15 tests nuevos fallan; los dos que pasaban eran controles que no dependen del cambio, y uno se reforzó para que tampoco pase (CP-8 comprueba primero que el pago está dado por hecho). El spec 128 falla contra el padre anterior esperando una recarga que no llega.

**Un fallo de procedimiento propio.** Una corrección de una línea del spec 128 se aplicó con `node -e` y no con un script en disco (regla 4 de CLAUDE.md). Se comprobó después que el texto quedó como debía y el spec pasa; no hubo daño, pero la regla existe porque otras veces sí lo hubo.

**No tocado, y por qué.** K-97 a K-103 quedan por decidir o por medir (filas 73 a 79 de R2.9.4). `ejecutarElegirOtra()` (diálogo de reanudación) sigue reiniciando a mano: son dos cuerpos (K-19). Tras el «no» del reto 2 el recorrido pasa otra vez por pago y código, como antes: está entre las decisiones pendientes de §16.2 de la guía. La pregunta de §22.4 sigue solo en el chat.

**Censo de frames (regla 3b).** Tocados: el padre (`codigo-padre.html`) y la selección (`En-busca-del-tesoro.html`). No tocados, con `git diff 28b2e20 -- <fichero> | wc -l` igual a 0 en los nueve: hijo1 a hijo6, mapa-completo, puzzle y video-intro. De `js/`: `api-client.js`, `constants.js` e `indice-aventuras.js` con cambio real; `app.js`, `funciones-mapa.js` y `reciclaje-digital.js`, un comentario cada uno.

**Tandas.** Todas con `npm run test:e2e:vigilada`, con el usuario durmiendo y su visto bueno expreso para esta noche. K-95 solo, en una copia aislada del árbol de ese commit (sin las carpetas de imágenes de las aventuras): specs 128, 19 y 25, 11 de 11 en chromium. Después, con todo: los specs tocados y los de la selección en chromium, 122 de 122; y los cuatro navegadores enteros, **653 de 653 en cada uno (2612)**: chromium 16,4 min y 76,1 °C de máxima, firefox 21,9 min y 78,1 °C, pixel5 17,0 min y 75,1 °C, iphone12 21,2 min y 79,1 °C. Con esto quedan hechas también las tres pasadas enteras con la espera al arranque que estaban pendientes de K-94.

### R2.18 Madrugada del 2026-10-14, segunda parte: lo pendiente del documento

**Encargo.** Con R2.17 cerrado, el usuario dejó dicho antes de irse a dormir: seguir con lo pendiente de este documento, con la idea de resolver todos sus problemas. Criterio seguido: se aplica lo que tiene un solo camino posible y ningún efecto visible; lo que cambia lo que ve el usuario, sus textos o una decisión de producto se deja medido y con recomendación, sin aplicar.

**Aplicado, un commit por entrada.** `9ee6c05`, K-69 en `video-intro.html`: fuera las 37 clases sin elemento, medido antes y después con dos sondas. `c9fd1c0`, K-99: los cuatro avisos del script clásico de la selección leen su tipo del puente, medido antes y después y con un control que rompe un tipo. `783a75f`, K-104: el informe de errores (`js/utils.js`) y el estado del asistente (`abrirChat()`) leen su tipo de `TIPOS_MENSAJE`, sin literal de respaldo; se registró antes de aplicarla (`372d688`).

**Medido, sin aplicar (deciden cambios visibles).** K-105, lo más serio de la noche: el diálogo de vuelta no sale con el primer «atrás» de una sesión, y el segundo saca de la aplicación (M-32, cuatro navegadores, con su control). K-101, que se cierra con ella: «¡Aventura en curso!» puede salir sin aventura en curso. K-100: a la caja de texto de la P11 le faltan el tamaño de letra y la barra de las otras cajas (M-33). Las tres llevan su recomendación escrita.

**Lo que salió de paso.** El censo de literales de K-99 destapó K-104. Medir K-101 con el botón atrás de verdad destapó K-105: ningún spec lo pulsaba, y los dos que abren el diálogo lo hacen llamando a su función. La guía nombraba tres clases que ningún elemento lleva (G-81) y describía mal quién publica el puente de tipos (G-82).

**No tocado, y por qué.** K-97, K-98, K-102 y K-103: decisión del usuario (nombres, textos y arnés). K-91, K-92 y K-78: cambian lo que se ve. De las filas antiguas de R2.9.4 se releyeron K-76 y K-83, las dos con opciones A y B por decidir; las demás abiertas llevan marca VISIBLE, BUS o de contenido. Las dos publicaciones «si no está» del puente en el padre quedan como observación de K-104. La pregunta de §22.4 sigue solo en el chat.

**Censo de frames (regla 3b).** Tocados: `video-intro.html` (K-69), la selección (K-99), el padre (K-104, una línea) y `js/utils.js` (K-104; lo cargan los seis hijos, la selección y el padre). Sin cambios propios: hijo1 a hijo6, mapa-completo y puzzle (`git diff 921f655 -- <fichero> | wc -l` igual a 0 en los ocho).

**Tandas.** Todas con `npm run test:e2e:vigilada`, con el visto bueno que el usuario dejó para esta noche; máxima 75,1 °C en las parciales. Por entrada, en los cuatro navegadores: K-69, 128 de 128; K-99, 108 de 108; K-104, 416 de 416. Las sondas desechables (cinco) corrieron una a una y se borraron de `tests/e2e` al acabar. **Pasada de cierre**, con todo lo de esta parte commiteado (hasta `e5d76f2`): la suite entera en los cuatro navegadores, **2612 de 2612** (653 por navegador), sin fallos ni repeticiones, en 1,3 h y con 80,1 °C de máxima.

### R2.19 Mañana del 2026-10-14: las decisiones del usuario sobre R2.18

**Decidido y aplicado.** K-100: igualar a 18 px (`ac7d165`). K-103: fuera el parche viejo de renumeración, comprobando antes que no sirve (`9647f77`). Retos 1 y 2 (mitad de K-98): una sola redacción por idioma, de usted y bien escrita (`d5868b4`). Cada uno con su medición y sus specs en los cuatro navegadores (68, 120), con el visto bueno del usuario para lanzar Playwright.

**Decidido, por implementar.** K-105 y K-101: el principio del botón atrás, «como en una app nativa: primero cierra lo que tienes delante» (la entrada de K-105 lo detalla). Quedan tres preguntas y el inventario de capas antes de escribir el spec.

**Pregunta del usuario, contestada en el chat.** Si los nombres `_accionPantalla5` y `_accionPantalla15` debieron cambiarse con el parche: no, porque el encargo era retirar lo que no sirve; y conviene cambiarlos, por decidir.

**Censo de frames (regla 3b).** Tocados: la selección (K-100). `js/retos-aventuras.js` (lo importan la selección, el padre, `js/data-loader.js`, `js/coordenadas-aventuras.js` y `js/server.js`). Sin cambios: el padre, hijo1 a hijo6, mapa-completo, puzzle y video-intro (`git diff 4b8a43f -- <fichero> | wc -l` igual a 0 en los diez).

### R2.20 Tarde del 2026-10-14: lo que queda para retirar este documento

**Encargo.** El usuario quiere eliminar este documento, y antes estar seguro de que todo está arreglado: arreglar lo que se pueda, verificarlo, comprobar que los tests están al día (y crear uno para los retos) y después revisar la guía para que llegue a ser fuente de verdad.

**Aplicado esta tarde, un commit por cosa.** `92feb5a` reto 3 en español («Sabría decirme»). `45e60ac` los nombres de K-103 (`_accionAgradecimientos`, `_accionNormativa`). `d5d6ca6` K-106. `7f97ae6` la ✕ común en el modal de tiempo agotado (spec 130). `0aafe4e` K-105 y K-101 (spec 131). `3129191` spec 132 (los retos, en su idioma y sin provisionales; y dos preguntas en español con su «¿»). `dea6200` las 129 filas de §18.3 de la guía contra la lista real de Playwright (668 tests por navegador; cuatro números mal, una fila que decía que WebKit omite dos tests y otra que describía uno de cinco). **Pasada completa, con todo commiteado: 2672 de 2672** en los cuatro navegadores, 1,4 h, 79,1 °C de máxima, sin fallos ni repeticiones.

**Cómo leer lo que queda.** En las cabeceras de las entradas K, ✅ quiere decir «hallazgo confirmado», no «arreglado»; lo que está hecho lo dice su fila de R2.9.4 («hecha», con su commit). La lista de lo que queda es R2.9.4: 35 filas sin hacer (contadas con `abiertos-estudio.cjs`, scratchpad, que imprime también lo que no reconoce: nada), una de ellas, K-98, hecha a medias. **(Corrección, 2026-10-19: no era completa; lo abierto también vivía en R2.11, en los «sin entrada» de R2.13 y en los «no tocado» de cada tanda. Ver R2.24.)** Agrupadas por quién tiene que decidir:

- **«Dejar», ya recomendadas (nivel 0):** K-17 B, K-28 B, K-37 A y K-43 B. Basta con que el usuario las confirme; su motivo cabe en un comentario del código.
- **Cambian lo que ve el usuario, o son textos o producto:** K-91 (el rescate que se queda sin cobrar si la app se recarga; lo más serio), K-92 (color del ✓ y la ✗ de la selección), K-78, K-77 y K-79 (carteles, doce idiomas), K-25 (textos de hijo4 y de la selección), K-51 (versión de los datos guardados), K-84, K-74, K-49, K-50 con K-19 (abandonar la aventura: recomendado, que la «Elegir otra» del diálogo de reanudación también recargue, como las otras salidas), K-86 y la otra mitad de K-98 (qué se reinicia al cambiar de aventura).
- **Tocan el bus (regla 1, OK expreso):** K-46 B, K-67, K-70, K-80 y lo que queda de K-57.
- **Sin cambio visible, con su opción recomendada en la entrada:** K-52, K-53 (resto), K-60, K-62, K-72, K-75, K-76, K-83, K-97, K-102 (recomendado: dejarlo en los specs que arrancan una aventura; el ayudante común no puede esperar a `body.loading`, porque el diálogo de reanudación también la pone), y K-20 con K-54 (medir antes).
- **Fuera de R2.9.4, también por decidir:** la observación de K-104 (el padre publica el puente de tipos dos veces); con el modal de fin de aventura, «atrás» no hace nada (lo dejé así; el usuario no lo decidió); la prueba de K-105 en un Android real; numerar o no los retos (unas aventuras ponen «n.» delante y otras no: 1421 de 2460 sin número); y los retos compartidos entre aventuras que tienen redacciones distintas (en español, 24 grupos de retos iguales —mismas opciones y respuesta— con más de una redacción, contando también los que solo cambian en el número de delante; algunas diferencias pueden ser a propósito, según la ruta).

**Antes de retirar el documento.** Con esas decisiones tomadas, lo que el documento sabe y no está en otro sitio es el porqué de cada «dejar» y de cada decisión: va al comentario del código que lo sostiene (la guía describe lo que hay, no por qué se descartó lo otro). Las herramientas de `tools/estudio-caminos/` (`verifica-tablas.cjs`, `guia-narracion.cjs` y las demás) se usan también para la guía: `guia-narracion.cjs` lo pide CLAUDE.md (regla 2), así que se quedan.

**Censo de frames (regla 3b) de esta tarde.** Tocados: el padre (K-106, la ✕, K-105), la selección (los nombres) y `js/retos-aventuras.js`. Sin cambios: hijo1 a hijo6, mapa-completo, puzzle y video-intro (`git diff 4ac2154 -- <fichero> | wc -l` igual a 0 en los diez).

### R2.21 Noche del 2026-10-14: decisiones del usuario y lo que no necesitaba su confirmación

**Decisiones del usuario.** Los retos no se numeran en pantalla (el número vive en los datos y en los comentarios del fichero): fuera de 1039 preguntas y fuera los títulos «Reto 1/2» de la selección, que además estaban ocultos por CSS (`ee28b2f`; spec 132, RH-6). Con el modal de fin de aventura, «atrás» no hace nada: confirmado. El botón atrás también tiene que cerrar lo que esté abierto dentro de los hijos (menú de hijo1, modal interno del asistente, ficha de monumento del mapa completo): pide un mensaje del padre a cada hijo, por decidir con él (regla 1).

**Criterio para lo que no necesita su confirmación.** El que el usuario repite: un solo camino, sin duplicados, sin código muerto, comunicación centralizada, todo handler registrado, orden de inicialización adecuado y homogeneidad. Aplicado así, sin preguntar: el cierre de los desplegables del padre por un solo sitio (`e5cac2d`; el aviso `UI.CLOSE_MENUS` de hijo1 solo cerraba el de audio, por un segundo camino), K-97 (`9ca0bec`) y K-76 (`6f1eaf5`).

**Medido, por decidir con el usuario (cambio visible).** Los desplegables del tipo de mapa y del modo de brújula se cortan en los cuatro proyectos de los tests: el hueco que les da el padre (entre la franja blanca de arriba y su botón, porque crecen hacia arriba) es de 28 px en iphone12, 84 en pixel5 y 57 en escritorio, para un contenido de 130 a 174 px (sonda desechable, `zz-desplegables-altura`). Los dos botones quedan casi pegados a la franja porque debajo va la columna de seis botones laterales de al menos 62 px; en un Android real más alto que el pixel5 de los tests cabe, y en el iPhone del usuario no.

**Retos compartidos.** Sin los números, en español quedan seis grupos de retos iguales (mismas opciones y respuesta) con redacciones distintas entre aventuras; uno no es discrepancia (el Cimborrio y el Miguelete son dos retos distintos con las mismas opciones). En los otros idiomas, de 10 a 16 grupos. Por decidir con el usuario qué redacción vale.

### R2.22 Noche del 2026-10-14: «atrás» dentro de los hijos

**Aplicado.** `3b08a7f`: la ✕ común en las cuatro páginas que abre hijo1 (spec 134). `7d7d00c`: la segunda parte de K-105 —el menú de hijo1, el modal interno del asistente, la ficha de un monumento y la ventana del temporizador se cierran con «atrás», por `js/capa-con-atras.js` y dos tipos nuevos del bus—, con G-84. Los 30 specs que tocan esos frames, en los cuatro navegadores con el vigía: 732 de 732 (23,6 min, 83,1 °C de máxima).

**Registrado al pasar.** K-107 (el botón del mapa completo de hijo2: la siguiente tarea, a petición del usuario) y K-108 (dos campos del estado del asistente que nadie lee). Descartado por el usuario: que el mapa completo, cerrado y vuelto a abrir en menos de 0,4 s, desaparezca (`cerrarIframeOverlay` lo borra a los 400 ms sin mirar si se ha vuelto a abrir): «ningún humano va a cerrar y abrir tan rápido».

**Decisiones del usuario para la siguiente tarea (los retos compartidos).** La bandera siempre como pregunta, con «¿?»; Neptuno, «la cornucopia de la abundancia»; la fruta cítrica, siempre con «¡Preste atención a la fachada de la primera torre!» delante; la vidriera, siempre con «Busque la vidriera con los colores de la Señera…» delante (Aventura5 se corrige); y la voz «de usted» en italiano y en el resto de los idiomas.

**Censo de frames (regla 3b).** Tocados: el padre, hijo1, hijo6 y mapa-completo, más `js/constants.js`, `js/capa-con-atras.js` (nuevo) y `sw.js`. Sin cambios: la selección, hijo2, hijo3, hijo4, hijo5, puzzle y video-intro (`git diff 3b08a7f 7d7d00c -- <fichero> | wc -l` igual a 0 en los siete).

**Retos (2026-10-15).** Con las decisiones del usuario, los doce idiomas en commits por idioma (`82e9ad6` español e inglés, `3274ef7` italiano, `724b209` francés, `3943ba2` alemán, `028d983` portugués, `1299fba` neerlandés, `a060ca2` polaco, `b3cd58e` ruso, `201e698` ucraniano, `01b72ab` japonés, `9fc7cac` chino) y el spec 132 con RH-7 a RH-10 (`6dd7da1`). Al pasar salieron dos cruces de datos, arreglados en `82e9ad6`: en Aventura2 en inglés los retos 3 y 5 tenían el contenido cambiado (en esa parada salía otra pregunta; la app busca el reto por `id`), y el puzzle PZ-05 de Aventura5 era el reto 35 en cinco idiomas y el 29 en el resto. El `<br>` de los «tres arcos ciegos» salía tal cual en pantalla en los doce idiomas. Voz: el italiano, el polaco y el portugués tenían preguntas en tú o en vosotros; los demás ya iban de usted. **Pendiente:** la tanda de cuatro navegadores de los specs que leen los retos (el vigía no la lanzó: 85,1 °C con un juego abierto), y una pregunta al usuario: el reto 3 de Aventura3 lleva delante «Aquí va el primero de sus retos, este es facilito.», que el mismo reto no lleva en las otras seis aventuras.

**Después (2026-10-15 a 10-18).** La pregunta del reto 3 está contestada y aplicada: el reto 3 (las torres) lleva en las siete aventuras la entrada que tenía Aventura3 (`db2cb4b`). Desplegables del tipo de mapa y de la brújula, con decisión del usuario («bajo el mínimo a 44 px, sin desplazamiento interno»): `--franja-lateral` pasa a `clamp(44px, 7.2vh, 80px)` en `codigo-padre.html` y en la guía §7.10; hijo3 sigue midiéndose con `--franja-inferior` (mínimo 62 px). K-107 aplicada (ver su ficha). **Medido con la franja a 44 px** (sonda desechable de los desplegables, con el vigía; alto visible / alto del contenido del desplegable del tipo de mapa, y lo mismo el de la brújula): pixel5 (393×727) 131/131, frente a 84/131 con 62 px; iphone12 (390×664, Safari con sus barras) 127/130, frente a 28/130: **faltan 3 px**; con la pantalla de 390×844 de la PWA instalada, 130/130 en los dos. Los 3 px que faltan con las barras de Safari son decisión del usuario (eligió «sin desplazamiento interno»). K-107 verificada en chromium y en rojo (ver su ficha). **Pendiente:** la tanda de los cuatro navegadores con el vigía. Sin push.

### R2.23 Tarde del 2026-10-18 y noche del 2026-10-19: K-52 entera y lo que no necesitaba confirmación

**Encargo.** Por la tarde, con el usuario en el trabajo: K-108, lo que quedaba de K-104, el sitio del padre de K-52 y K-102. Por la noche, antes de dormir: K-52 entera («buscar absolutamente todos esos sitios y asegurar que saben qué aventura se eligió en todo momento [...] el padre no puede llegar a rechazar, es obligación saber en qué aventura e idioma ha elegido el usuario. no puede haber error»), después todo lo que no requiere su atención, y al final la lista de lo que sí, de lo menos grave a lo más grave y con lo que cada cosa toca.

**Aplicado, un commit por cosa (y el del estudio aparte).** Tarde: K-107 y la franja lateral a 44 px (`c01007d`), K-108 (`64f4abf`), lo que quedaba de K-104 (`901e3a7`), K-52 en el padre (`99006df`), K-102 (`46e36a3`). Noche: K-102 segunda vuelta (`6fe1262`: la tanda de firefox, pixel5 e iphone12 dio cuatro fallos, los cuatro de esa K), **K-52 entera con K-109** (`cf47a3a`), K-110 (`ad8a484`), K-111 (`5d2e56a`) y **K-54 de raíz con K-20 A** (`26e156d`). Cada ficha cuenta lo medido, el spec en rojo antes y en verde después, y la guía tocada.

**Lo que se midió por el camino y cambió el arreglo.** `enviarMensaje` nunca rechaza (devuelve `false`), así que la selección no se enteraba si el aviso de la elección no llegaba: la elección va con acuse y sin él no se avanza. Los puentes `_setX` de la selección eran un segundo mecanismo (el módulo escribe los `let` del clásico por su nombre, medido en tres motores). La carrera de K-54 es real con un módulo de Script 2 lento: el arranque se daba por terminado sin Script 2. Y el generador de §37.2 se dejaba filas porque una asignación escrita en un comentario se tragaba la real de la línea siguiente.

**Pasado a decisión, aunque la tabla lo daba por «sí».** K-75 (el único arreglo toca la ficha que comparte producción y su restauración tras recargar, K-85/K-89), K-62 (Script 2, 4 y 5 esperan a Script 1, que es quien publica el ayudante de espera: unificarlas toca el orden de arranque de cinco scripts) y K-53, el resto (decidir qué módulo es esencial es criterio de producto; `js/reciclaje-digital.js`, que la ficha listaba, lleva la ventana de compra).

**Tandas.** Chromium entero: 692/692 (tarde), 700/700 con K-52 (noche). Y la tanda final de los cuatro navegadores con el vigía, sobre `6bfb75c` (todo commiteado): **2808 de 2808** (702 por navegador), sin fallos, omitidos ni repeticiones, 1,7 h, 73,1 °C de máxima. Con ella quedan verificadas en los cuatro también K-107 y la franja a 44 px (la tanda que la tarde dejó pendiente).

**Censo de frames de la noche (regla 3b; el de cada K de la tarde está en su ficha: K-107, por ejemplo, tocó hijo2 y mapa-completo).** Tocados: el padre, la selección, hijo4, hijo6 y video-intro, más `js/api-client.js`, `sw.js` (la versión de caché) y `tools/inventory-conexiones.js`. Sin cambios: hijo1, hijo2, hijo3, hijo5, mapa-completo y puzzle (`git diff b6e5e54 HEAD -- <fichero>`: 0 líneas en los seis); no guardan idioma ni aventura propios (el inventario de K-52 no encontró ninguna asignación en ellos) y ninguna K de la noche los toca.

### R2.24 Mañana del 2026-10-19: lo que queda, completo, y lo que no necesitaba confirmación

**Encargo.** «¿Qué queda?», y después: «haz todo lo que puedas que no necesite mi atención. no pares, no estaré aquí». A media mañana, «voy a jugar»: desde ese momento, ninguna tanda de Playwright (la última, la de los specs del puzzle, terminó justo antes del aviso).

**La lista de la noche estaba incompleta, igual que R2.20.** Las dos salían solo de R2.9.4, y lo abierto también vive en otras partes de este documento. Repasado con `que-queda.cjs` (scratchpad: las 111 K, con fila hecha, abierta o sin fila) y leyendo R2.11, los «sin entrada» de R2.13 y los «no tocado» de cada tanda, faltaban: K-61, K-07 (revisión), las familias de R2.10, R2.11.8, los restos de K-41, `index.html` (K-33 lo dejó en 📌), dos «sin entrada» de R2.13 (ahora K-118 y K-119), M-8 y la investigación de K-08, K-09 y K-30. Las 86 discrepancias G están cerradas. **Desde aquí R2.9.4 vuelve a ser la lista entera:** se le añaden las filas 101 a 112.

**Aplicado, un commit por cosa** (cada uno con su ficha): R2.11.8, dos informes de `tests/` sin lector (`f89554d`); K-34, el generador de §37.2 sin contar comentarios (`0312bd2`); K-93, tres publicaciones más sin lector (`e57a4e8`); K-69, las tres reglas de hijo3 (`3b2eefa`); K-41 y K-36, `estado.paradasConfirmaciones`, la condición de hijo5 y las claves que nadie lee (`177e731`); K-41, el `arrayParadasLocal` de hijo2 (`304ceda`); K-114, `index.html` con un solo camino (`a93ff42`); K-112, los nombres del índice sin reserva muda (`2f3b2ff`); K-113, el banner de versión nueva en su idioma también al arrancar (`02a0fe9`); K-61, la parada por defecto por un solo camino (`8cf40ab`); K-115, el puzzle con un solo bucle de dibujo (`ba98ae4`). Cinco specs nuevos (136 a 140): cada uno en rojo con el código anterior salvo sus controles, y en verde después.

**Lo que salió por el camino.** `verifica-tablas.cjs` no veía las entradas K de tres cifras ni sus referencias (y K-108 y K-109 estaban en orden inverso), arreglado en `cc58ba4`. El generador de §37.2 y el censo de K-93 contaban comentarios como lectores. K-115 (de 3 a 6 bucles de dibujo a la vez en el puzzle). Dos frases falsas de §10.12 (G-85) y la cabecera de los mensajes del puzzle (G-86). K-116 (el diagnóstico del GPS informa mal en el padre: preparado, sin aplicar, falta poder lanzar su spec) y K-117 (el elemento actual se fija dos veces al restaurar; va con K-51). **Dos errores míos, corregidos antes de cerrar:** di por medido que el `setTimeout` de `index.html` dejaba una entrada de más en el historial (la sonda lo desmintió: ver K-114), y conté los pares de paradas con el mismo nombre en `js/coordenadas-aventuras.js`, que no es lo que lee el cartel (74; en `DATOS_PADRE`, 61: ver K-119).

**Tandas.** Por cada K, en chromium, los specs que tocan lo cambiado (las cifras, en su ficha); por ejemplo, los diecisiete de cambio de modo y reanudación con K-61, 100 de 100. **Pendiente:** la tanda de los cuatro navegadores sobre todo lo de hoy, con el vigía, cuando el usuario dé el OK (está usando el equipo).

**Censo de frames (regla 3b).** `git diff dea4ee9 HEAD -- <fichero>`: tocados el padre (249 líneas), la selección (13), hijo2 (49), hijo3 (40), hijo5 (34) y `puzzle.html` (36), más `index.html` (36), `js/app.js`, `js/state-manager.js`, `eslint.config.js`, `sw.js` (la versión de caché) y dos herramientas. Sin cambios: hijo1, hijo4, hijo6, `mapa-completo.html` y `video-intro.html` (0 líneas en los cinco); ninguna K de hoy los toca.

**Lo que queda, todo en R2.9.4** (filas sin «hecha»). Decisiones del usuario: las cuatro «dejar» (1 a 4), K-17 B con la prueba de campo M-8 (1 y 112), el contrato del bus (K-46 B con `PREPARAR_HIJOS` y `CAMBIO_PARADA_CONFIRMADO`, K-67, K-70, K-80, K-57, K-07 revisión, K-15 y `AVENTURA_ACTIVADA`), lo visible (K-25, K-49, K-74, K-77 y K-79, K-78, K-84, K-86, K-92, K-98, K-118, los 3 px de iPhone), el producto y los datos (K-50 con K-19, K-51 con K-117, K-91, K-119, la ventana de compra de K-112), lo que pide medir antes (K-53 resto, K-60, K-62, K-72, K-75, K-83, K-102 resto), las familias de R2.10 y lo que queda de K-114 (el texto de `index.html` y la etiqueta HSTS). Trabajo sin decisión: K-116 (falta su spec) y la lectura de una en una de lo que queda de K-09. Fuera del código: la prueba de K-105 en un Android real y la pregunta de §22.4.
