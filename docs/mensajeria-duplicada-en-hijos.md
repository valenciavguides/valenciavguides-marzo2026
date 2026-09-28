# La mensajería entre frames: mapa completo y plan de unificación

Documento de trabajo. Recoge **todo** lo que hay hoy en la comunicación entre frames de la
app, los fallos que eso esconde y lo que exige unificarla. **El bus está construido y los diez
frames hablan ya por él**; los cinco fallos vivos están arreglados del todo (§0). Falta la parte
del padre y la limpieza: el orden está en la Parte V ("La lavadora").

Los números de línea son aproximados: se desplazan con cada edición.

---

## 0. Decisiones

### Tomadas

- **Confirmar siempre que alguien procese el mensaje**, devuelva lo que devuelva el handler
  (también `undefined`). Es la regla del bus. Se retira la de "sin `return` no hay acuse".
- **Opción A: un solo bus para toda la app.** Padre, siete hijos y los tres nietos usan
  `js/mensajeria.js`. El bus aprende a tener doble papel: hijo de su padre y padre de sus
  propios iframes.
- **El padre dirige.** Ningún frame le habla a un hermano, ni toca funciones, variables o
  HTML de otro frame. Todo pasa por mensajes y todo mensaje pasa por el padre.
- **Si el handler se rompe al procesar, se contesta "recibido, pero ha fallado".** Con las
  condiciones de §16.7, sin las cuales empeora el audio.
- **Si el mensaje llega y nadie lo escucha, no se contesta.** El emisor reintenta o agota su
  plazo. Se quita al bus su confirmación con `null` (§3.5).

En una frase: **si alguien procesó el mensaje, se contesta (aunque falle); si nadie lo procesó,
no.**

### Orden

F1 → F5 → diseño del bus → migración (Parte V). F2 se arregla dentro de la migración; F3 y F4,
cuando toque. **Los cinco están arreglados y commiteados** (F2 y F3 cayeron al migrar; F4, al separar en el `pagehide` del padre el cierre real del viaje a la caché de atrás, y — paso 9 de la lavadora — al aplicar la misma guarda de `persisted` a los otros dos `pagehide` de la misma ventana, en `js/app.js` y `js/funciones-mapa.js`, que hasta entonces seguían limpiando `globalThis.estado`/`funcionesMapa` y destruyendo el mapa sin mirar ese campo; el spec 77 no lo veía porque solo cuenta iframes, cubierto ahora por el spec 108).

### Decisiones de diseño (tomadas)

El detalle de cómo se traducen al bus está en la Parte VI.

1. **Un solo nombre para el padre: `'padre'`.** Si hace falta saber de dónde viene algo, va en
   `datos` (§8).
2. **Fuera el `ACK`.** Ningún hijo cambia nada al recibirlo (§12).
3. **"A todos" = a los iframes directos de quien lo manda.** Nunca sube ni llega a los nietos.
   Hoy ningún hijo lo usa (§9.4).
4. **Los errores de un nieto llegan al padre**, pasando por su contenedor (§16.4).
5. **El latido de volver a la pestaña lo hace el bus**, y respeta la pausa de CASA (§13).
6. **Un hijo sin padre no envía, no espera y lo avisa una vez en el log** (§16.5).
7. **Un solo acuse: el del bus.** Fuera los avisos informativos disfrazados de confirmación y
   `DATOS.CARGADOS_RECIBIDO` (§3.7).
8. **Se vigilan todos los iframes registrados; solo se recargan los que saben recuperarse**
   (hijo1 a hijo4). Selección no guarda su pantalla: recargarla devolvería al usuario al
   principio (§8).
9. **Fuera la capa `get*` de `utils.js`** (§5.1).

### Decisiones del estudio previo a la lavadora

Salen de un estudio completo del estado real: lectura del código y recorridos reales de la app con
un espía de mensajes en todos los frames. Cada una se comprobó contra el código antes de tomarse.

10. **La identidad se comprueba también al recibir.** El bus ya pone el `origen` de lo que envía
    (§21.1). Al recibir, comprobará además que el origen declarado es el de la ventana que manda el
    mensaje: hoy cualquier frame autorizado puede declararse otro.
11. **Un solo camino para el modo.** Cada hijo recibe el modo al conectarse (`modoInicial` en
    `PADRE_CONFIRMA_HIJO_LISTO`) y los cambios por el envío normal. Fuera el cerrojo
    `secuenciaCompleta`, sus `NACK`, la cola `pendingModeChanges` y la resincronización al quedar
    listos hijo2, hijo3 y hijo4. **Revisa la decisión de §25.7**, que conservaba el `NACK`: el cerrojo
    no tiene razón escrita en ningún sitio (viene del commit inicial), la que da la guía no existe
    en el código, no se disparó en seis recorridos reales, y la resincronización es la que aplica
    el modo dos veces al reanudar. El padre fija el modo antes de difundirlo, así que un hijo que se
    conecta tarde lo recibe correcto; selección e hijo1 solo acusan el modo, no lo aplican.
12. **Una sola puerta para los datos.** El padre carga el contenido (§22.12) y reparte a cada hijo
    solo lo de la parada activa, como ya hace con el audio (hijo3) y los retos (hijo4). hijo2 deja
    de ser la excepción: recibe los datos de su elemento dentro del `CAMBIO_PARADA`, deja de recibir
    la lista completa de coordenadas y textos, y el padre deja de pedirle datos que ya tiene.
13. **Cada mensaje a un hijo lleva el id de su columna.** Cada entrada de `js/aventuras-ID-padre.js`
    es la tabla de traducción de un elemento: `padreid` y, al lado, el id que entiende cada hijo
    (`parada_id`/`tramo_id`, `audio_id`, `reto_id`, `texto_id`). Mandarle a un hijo el id de otra
    columna es un fallo: `PENDING_INICIADO` le manda a hijo2 el `padreid` y no ha coincidido nunca.
14. **Las paradas con varios retos se mantienen.** Hoy ningún elemento tiene más de un reto, pero la
    cola se deja funcionando y probada: una sola función para mostrar un reto y un spec con una
    parada de dos retos, uno de ellos puzzle.

---

## Parte I — El mapa de antes de migrar

Foto tomada antes de migrar los frames. Se conserva porque explica qué había que resolver; el
estado actual está en §0, en §25 y en la Parte V.

## 1. Quién incrusta a quién

```text
codigo-padre.html
├── seleccion         En-busca-del-tesoro.html
│   ├── puzzle-iframe   puzzle.html          (P10, estático en el HTML)
│   └── (creado)        video-intro.html     (P4)
├── hijo1-opciones    extrainfo-hijo1.html
├── hijo2             coordenadas-hijo2.html
├── hijo3             audio-hijo3.html
├── hijo4             retos-hijo4.html
│   └── puzzleIframe    puzzle.html          (creado y destruido en cada reto)
├── hijo5             boton-casa-hijo5.html  (solo desarrollo)
├── hijo6-chat        chat-hijo6.html
│   └── (creado)        video-intro.html     (modal "ver de nuevo")
├── (overlay)         mapa-completo.html     (src distinto en cada apertura)
└── fondo-blanco      (sin página)
```

- Gastronomía, Información, Historia y Páginas oficiales se abren **en pestaña nueva** desde
  hijo1: no hablan con nadie.
- `index.html` solo redirige a `codigo-padre.html`.
- El service worker habla con el padre por otro canal (`navigator.serviceWorker`), fuera de
  este mapa.

---

## 2. Las copias de los envoltorios

Cada hijo lleva su propia copia de las funciones de mensajería, en vez de usar el bus.
Comparadas quitando comentarios y espacios. **Hoy no queda ninguna copia: los siete hijos y los tres nietos hablan por el bus.**

| Pieza | Copias | Variantes distintas |
|---|---|---|
| `enviarMensaje` | 7 | **7** |
| `registrarControladorSeguro` | 7 | **7** |
| `adapterListener` | 6 | **6** |
| `enviarMensajeConConfirmacion` | 3 + **1 muerta** | **4** |

**Ninguna coincide con otra.** La cuarta copia de `enviarMensajeConConfirmacion` está en
`js/app.js:70` y no la llama, exporta ni asigna nadie.

| Frame | `enviarMensaje` | con confirmación | `registrarControladorSeguro` | `adapterListener` |
|---|---|---|---|---|
| hijo1 | ✓ | — | ✓ | ✓ |
| hijo2 | ✓ | ✓ | ✓ | ✓ |
| hijo3 | ✓ | — | ✓ | ✓ |
| hijo4 | ✓ | ✓ | ✓ | ✓ |
| hijo5 | ✓ | — | ✓ | ✓ |
| hijo6 | ✓ | ✓ | ✓ | — |
| selección | ✓ | — | ✓ | ✓ |

La confirmación está escrita de cuatro formas: en línea (hijo2, hijo4, hijo5), con un
auxiliar `_enviarAutoConfirmacion` de firmas distintas (hijo1, hijo3), con otro auxiliar
`_enviarConfirmacionAuto` (selección) y dentro del registrador (hijo6).

Divergencias sueltas:

- hijo4 compara `globalThis.window` en vez de `globalThis`, en tres sitios.
- Solo hijo4 fija un plazo explícito (`5000`) en su envío con confirmación.
- hijo6 no comprueba el padre en ese envío y usa firma `(mensaje)` en vez de `(...args)`.
- Solo hijo6 resuelve con los `datos` de la confirmación; hijo2 y hijo4 los tiran.
- hijo2 omite `destino` en la confirmación que emite.
- Solo hijo6 avisa cuando no confirma; los demás callan.
- hijo2 a hijo5 guardan el tipo de "entendido" en una variable (`tipoEntendido`) y validan
  campos antes de enviar; hijo1, hijo6 y selección lo escriben directo.
- Los seis adaptadores tienen un `enviarMensajeCentral` que **no llama nadie**.
- `safeRegistrar` es un cuarto nombre para registrar: está definido en seis hijos y solo lo usa
  hijo2, dos veces (`NAVEGACION.GPS.ERROR` y `SISTEMA.NOTIFICACION`).

---

## 3. La confirmación

### 3.1. Cuándo confirma cada uno, si el handler no devuelve nada

| Quién | Devuelve `undefined` | Lanza una excepción |
|---|---|---|
| **bus** (`js/mensajeria.js`, lo usa el padre) | **confirma** | **confirma** con `datos: { error }` |
| **hijo2** | **confirma** | **confirma** con `datos: { error }` |
| hijo1, hijo3, hijo4, hijo5, selección | no confirma | no confirma |
| hijo6 | no confirma, y avisa | no confirma |

En hijo3 y selección la comprobación vive dentro del auxiliar, no en el listener: leer solo el
listener da una lectura falsa de esos dos.

### 3.2. Los cinco envíos con acuse del proyecto

| Camino | Tipo | Quién confirma | Hoy |
|---|---|---|---|
| padre → hijo3 | `AUDIO.REPRODUCIR_REQUEST` | adapter de hijo3 | ✅ devuelve objeto en sus dos salidas |
| padre → hijo2 | `DATOS.COORDENADAS_PARADAS_REQUEST` | adapter de hijo2 | ✅ tres `return` con valor |
| hijo2 → padre | `NAVEGACION.GPS.ACTIVAR` | bus | ✅ |
| hijo4 → padre | `RETO.COMPLETADO` | bus | ✅ |
| hijo6 → padre | `CHAT.RESCATE_SOLICITADO` | bus | ✅ cuatro salidas con objeto |

### 3.3. Qué hace cada emisor con lo que recibe

| Emisor | Con `datos` |
|---|---|
| padre → hijo3 (`_enviarAudioRequestConReintento`) | lo ignora: `return true` |
| padre → hijo2 (`_solicitarParadaAHijo2`) | `_normalizarParadaDataResponse`: cualquier forma desconocida → `null` |
| hijo2 → padre | `resolve()`: lo tira |
| hijo4 → padre | `resolve()`: lo tira |
| hijo6 → padre | `resolve(event.data.datos)`: el único que lo lee |

### 3.4. Una confirmación no puede decir "falló"

`manejarConfirmacion` del bus rechaza si `mensaje.error`, **en la raíz**. Pero quien confirma un
fallo lo mete en `datos.error`, y ningún emisor del proyecto pone `error` en la raíz: esa rama
**no se ejecuta nunca**. Y los receptores de hijo2, hijo4 y hijo6 ni siquiera la tienen.

En los cuatro receptores que hay, el acuse solo puede significar **"me llegó"**. Es lo que dice
el propio comentario del padre en el camino del audio: *"lo que el padre pregunta con la
confirmación es te llegó el mensaje, no salió bien; el resultado va dentro"*.

Consecuencia visible hoy: si el handler de coordenadas de hijo2 lanza, confirma con
`{ error }`, el padre lo recibe como éxito y su log escribe `paradaData: 'OK'`. El dato acaba
en `null` igualmente: la app se comporta bien y **el log miente**.

### 3.5. Un mensaje sin handler

- **Bus:** si nadie registró el tipo y se pidió acuse, confirma con `null`.
- **Hijos:** no hay listener para ese tipo; el emisor agota su plazo.

Copiar el comportamiento del bus en los hijos rompería el audio. Si el padre manda el audio a
hijo3 antes de que hijo3 haya registrado su handler, hoy no llega el acuse, el padre reintenta
1,2 s después y el audio suena. El reintento existe para eso (*"iframe momentáneamente no
listo"*). Con confirmación a `null`, el padre daría el mensaje por entregado y no reintentaría.

### 3.6. Recuento de handlers

67 de 87 handlers de los hijos no devuelven valor (hijo1 2/10, hijo2 16/21, hijo3 10/13,
hijo4 15/17, hijo5 11/13, hijo6 7/7, selección 6/6). hijo1 `SISTEMA.CAMBIO_MODO` devuelve valor
por unos caminos y nada por otros.

### 3.7. Tres mecanismos de acuse, y uno de ellos con dos significados

1. **`SISTEMA.CONFIRMACION` con `idOriginal`**: el acuse del bus y de los adaptadores.
2. **`SISTEMA.ACK`**: `app.js` lo manda tras cada "entendido" y "efectuado", y los hijos lo
   contestan con otro `ACK` (§12).
3. **`DATOS.CARGADOS_RECIBIDO`**, a mano: hijo2 avisa de `COORDENADAS_CARGADAS` y
   `TEXTOS_CARGADOS`, el padre contesta (L~13534, L~13552) y hijo2 solo lo apunta en el log.

Además, `SISTEMA.CONFIRMACION` **se usa para dos cosas distintas**: el acuse (con
`idOriginal`) y avisos informativos sin `idOriginal` (`UI_VISIBLE`, `inicializacion`,
`DATOS_RECIBIDOS`, `click_ejecutado`, `audio_control`…). **Los hijos mandan 11 de estos avisos al
padre, y el padre no escucha `SISTEMA.CONFIRMACION`: se pierden todos.** La guía (§10.17) los
presenta como patrón.

---

## 4. Cómo se registran los handlers

### 4.1. En los hijos: tres caminos

1. `messagingAdapter.registrarControladorCentral` → si devuelve exactamente `true`, fin. **Es
   el único que confirma.**
2. Si no, el `registrarControlador` local: listener a secas, **no confirma nunca y no captura
   errores** (un fallo produce un rechazo de promesa sin manejar).
3. Si no, "encolar para migración", que no hace nada.

El camino 2 pierde hoy por orden de fichero (el adapter se define antes del primer registro
en los seis). Si `registrarControladorCentral` devuelve `false` (tipo ya en
`_listenerRegistry`) se cae al 2 sin avisar; hoy es inalcanzable porque
`__CONTROLADOR_REGISTRADOS` corta antes. Lo impide que dos `Set` vayan sincronizados, no una
garantía. hijo6 es el único frame con un solo camino.

### 4.2. En el padre: cuatro caminos

1. `globalThis.registrarControladorSeguro` (Script 1, L~5389): guarda
   `__CONTROLADOR_REGISTRADOS` → bus → si no, `mensajeria.registrarControlador` → si no, cola
   `__CONTROLADORES_PENDIENTES`.
2. Script 2: `registrarControladorScript2Seguro` → cola `__SCRIPT2_CONTROLADORES_PENDIENTES`.
3. `js/funciones-mapa.js` importa `registrarControlador` del bus directamente y se salta la
   guarda.
4. `js/app.js` usa su propio envoltorio (exige `mensajeriaReady`) para `NACK`, y otro atajo
   para "entendido" y "efectuado".

**Trampa:** el camino 1 marca el tipo como registrado **sin esperar ni mirar** el resultado.
El state-manager rechaza en silencio (solo log de depuración) un registro con el mismo id o
con el mismo tipo y **el mismo texto de código**. Si ocurriera, el tipo quedaría "registrado" y
sin handler. El propio `funciones-mapa.js` lo documenta: si registrase los handlers de GPS
antes que el Script 2, *"state-manager bloquearía el registro de Script 2 … y el handler
incompleto ganaría"*.

Hoy no ocurre: en el documento del padre hay 60 tipos registrados y ninguno repetido.

### 4.3. Orden de arranque del padre

State-manager (L~3783) → bus con `id: 'padre'` (L~3985) → registros (L~6249 en adelante).
`controladores-padre.js`, `funciones-mapa.js` y `app.js` se importan después. Ningún registro
llega antes que el state-manager.

**Trampa:** si algo registrara antes, el bus lo guardaría en su mapa local, pero reparte
leyendo el del state-manager. `migrarManejadoresTempranos`, pese al nombre, no migra nada:
solo devuelve la lista.

---

## 5. El bus por dentro

- **Papel único.** `tipoComponente` es `'padre'`, `'hijo'` o `'desconocido'`. Como hijo envía
  siempre a su padre, ignorando `destino`. Como padre envía a sus iframes registrados. Como
  desconocido, a sí mismo.
- **Recepción.** Acepta origen igual al propio, origen `'null'` (file://) o mensajes propios.
  **No comprueba que el mensaje venga del padre ni de un iframe registrado.** Exige `tipo` y
  `origen`: **descarta todo mensaje sin `origen`**. Ignora los mensajes cuyo origen es él mismo.
  Ejecuta los handlers en fila por tipo.
- **Registro.** En un hijo, sin state-manager, usa un `Map` local: si un tipo se registra dos
  veces, **el segundo pisa al primero sin avisar** (los hijos hoy hacen lo contrario). Ningún
  hijo registra un tipo dos veces.
- **Envío.** `enviarMensaje` reconstruye el mensaje y **conserva solo `tipo`, `datos`,
  `destino`, `origen`, `id` y `timestamp`** (§16.2). Devuelve `Promise<boolean>` y nunca
  rechaza. `enviarMensajeConConfirmacion` ignora el `origen` del llamante: pone el del propio
  frame.
- **Al importarse** publica `globalThis.mensajeria`, dispara `mensajeriaReady` y arranca un
  intervalo de limpieza de confirmaciones caducadas.
- **Solo padre.** Todo el heartbeat depende del state-manager: en un hijo no hace nada.
- **No sabe dar de baja un iframe:** `iframesRegistrados` solo crece.
- **Muerto:** `colaMensajes` (nunca se llena), `script2Listo` local (se escribe, no se lee),
  `limpiar()` (nadie lo llama), `registrarHijo` y `getHijoTipo` (nadie), la rama
  `__vv_getManejadores` (nadie lo define), el formato posicional de
  `enviarMensajeConConfirmacion` (nadie), `CONFIG` (`globalThis.Config` no existe → siempre
  `{}`).

### 5.1. La cuarta capa: las funciones `get*` de `utils.js`

`getEnviarMensaje`, `getRegistrarControlador` y `getEnviarMensajeConConfirmacion` (L~244-345)
son otra capa de mensajería más. Solo las usan hijo1 y selección en su rama "sin padre"
(hijo1 L~53 y L~78, selección L~2512 y L~2537), pero:

- **Se saltan los mensajes:** buscan `parent.mensajeria` y llaman al bus del padre directamente.
- Su último recurso de envío espera argumentos sueltos `(tipo, datos, destino)`, y hijo1 y
  selección le pasan un objeto: el mensaje saldría con `tipo` convertido en un objeto. Sin padre
  no llega a enviar nada.
- **`getEnviarMensajeConConfirmacion` simula un acuse:** resuelve `{ success: true, simulado: true }`
  a los 100 ms sin que nadie haya confirmado nada. Hoy no la llama nadie.
- El registro de respaldo guarda los handlers en `globalThis.__vv_handlers`, un mapa que no lee
  nadie.

---

## 6. Dos repartidores en el padre

| | Bus (mensajes que llegan) | `enviarMensajeCentral` del state-manager |
|---|---|---|
| Quién lo usa | todo | solo `js/app.js:406`, primera parada al arrancar aventura |
| Handlers que ejecuta | **el primero** del tipo | **todos** los que encajan, incluidos los registrados sin tipo |
| Fila por tipo | sí | **no** |
| Confirma | sí | no |
| Si no encaja nadie | nada (o `null` si hay acuse) | reparte a todos los iframes o se lo manda a sí mismo |

Hoy no divergen porque no hay tipos repetidos. Pero ese `CAMBIO_PARADA` de arranque no pasa
por la fila del bus: puede ejecutarse a la vez que otro `CAMBIO_PARADA` que llegue por el bus.
Sin probar si en la práctica coinciden.

State-manager, además: `removerControladorCentral` no lo llama nadie. En el padre,
`desregistrarControladorSeguro` no la llama nadie, y llama a funciones que no existen.

---

## 7. Qué necesita cada frame

### 7.1. Tipo de script donde vive la mensajería

- **hijo1 a hijo5:** todo en un único bloque módulo. Importar el bus es directo.
- **hijo6:** script clásico L~368-405 (el cierre triple, §10) y un módulo.
- **selección:** clásico L~1058-2470 (seis envíos a pelo y la escucha del puzzle) y un módulo.
- **video-intro:** clásico (su único envío, `_continuarVideo`).
- **puzzle, mapa-completo:** módulo.

Los envíos desde scripts clásicos están dentro de funciones que dispara el usuario o el flujo,
no al cargar. Pueden usar `globalThis.mensajeria`, que el bus publica al importarse. Hay que
comprobarlo uno a uno en selección antes de migrarla.

### 7.2. Protocolo de arranque y vida: igual en los siete

Todos envían `HIJO_PREPARADO`, reciben `PADRE_DATOS`, envían `HIJO_LISTO`, reciben
`PADRE_CONFIRMA_HIJO_LISTO`, reciben `HEARTBEAT` y contestan `HEARTBEAT_RESPONSE`, reciben
`CAMBIO_MODO` y envían "entendido" y "efectuado". Al recibir un heartbeat, los siete **solo
contestan**: no hacen ningún trabajo.

### 7.3. Dependencias que arrastra el bus

| Frame | constants | logger | utils | device-detection | mensajeria |
|---|---|---|---|---|---|
| hijo1 a hijo6, selección | ya | ya | ya | nuevo | nuevo |
| puzzle | ya | ya | nuevo | nuevo | nuevo |
| video-intro | nuevo | ya | nuevo | nuevo | nuevo |
| mapa-completo | nuevo | nuevo | nuevo | nuevo | nuevo |

Los cinco están en la caché del service worker. Al cargarse: `device-detection` añade un
listener de orientación (inocuo), `utils` instala el reporte de errores (F2) y el bus publica
su API.

### 7.4. Lo que cambia la fila por tipo del bus

Hoy los hijos procesan en paralelo los mensajes del mismo tipo; el bus los pone en fila.

- Solo dos handlers de hijos esperan algo: el de audio de hijo3 (`cargarYReproducirAudio`) y el
  de mostrar reto de hijo4 (solo un `postMessage`). Con `autoplay: false`, que es lo único que se
  pide, el de audio no espera a la red. **Hoy no bloquea nada.**
- **Condición a vigilar:** si algún día se pide audio con `autoplay: true`, el handler esperaría
  a que empiece a sonar. El reintento del padre, a los 1,2 s, esperaría en la fila detrás del
  primero, se agotarían los intentos y el padre daría el audio por escuchado sin sonar: el bug
  antiguo, de vuelta.
- **Orden de arranque en los hijos:** el bus tiene que estar inicializado como hijo, con el
  `IFRAME_ID` como nombre, **antes** del primer envío. Si no, está en papel "desconocido" y se
  manda los mensajes a sí mismo: `HIJO_PREPARADO` se perdería y el arranque no empezaría.

---

## 8. Identidades

- **Iframes:** el `id` en el padre coincide con el `IFRAME_ID` de cada hijo: `seleccion`,
  `hijo1-opciones`, `hijo2`, `hijo3`, `hijo4`, `hijo5`, `hijo6-chat`. ✅
- `registrarIframe` se llama desde cinco sitios con tres nombres (`registrarIframe_S1`,
  `mensajeria.registrarIframe`, `mensajeria?.registrarIframe?.`). Unos avisan si falla y otros
  callan. Selección está registrada, pero el padre le escribe a pelo.

### El padre tiene tres nombres

| Quién pregunta | Qué obtiene |
|---|---|
| El bus | `'padre'` |
| `resolverIdPadre()` / `getPadreId` de `utils.js` | `?padreId` (nadie lo pone), si no `sessionStorage`, si no **genera** `padre_<aleatorio>`. Lo comparten padre e hijos en la misma pestaña |
| `globalThis.getPadreId` (script clásico L~224) | `CONFIG_PADRE.ID` = `'padre'` |

- Script 1 del padre firma `padre_<aleatorio>` (17 envíos); Script 2 firma `'padre'` (61).
  Además hay 5× `CONFIG_PADRE.ID`, 1× `'padre'`, 2× `'padre-dev'` y 10× `resolverIdPadre()` en
  `js/`.
- Los hijos dirigen al padre 98 veces con `resolverIdPadre()`, 27 con `'padre'` y 5 de otras
  formas.
- Hoy es inocuo: el padre no enruta por `destino` y ningún hijo compara nombres. **Con doble
  papel, el `destino` decide si un mensaje sube o baja.** Además, un mensaje del Script 1 a sí
  mismo no lo ignora el bus, porque su origen aleatorio no es `'padre'`.

En realidad el padre firma con **cinco** nombres: además de los anteriores, `'padre-dev'` (2),
`'sistema'` (3 notificaciones de `app.js`) y `'monitoreo'` (el heartbeat de `monitoreo.js`). Y
`enviarMensajePadre` (L~10463) **reescribe en silencio** el origen cuando parece de relleno
(`''`, `'sistema'`, `'undefined'` o algo con `mensaje.origen`).

`registrarHijo` no lo llama nadie, aunque un comentario de `app.js` dice que sí. El heartbeat
del bus usa siempre su lista escrita a mano: `hijo2`, `hijo3`, `hijo4`, `hijo5`. Consecuencias:

- **hijo6 y selección no se recuperan nunca si se cuelgan.** hijo5, que es solo de desarrollo,
  sí.
- **La recuperación de hijo1 está muerta dos veces.** `_vv_afterHijoListo` (L~10197) comprueba
  `hijoId === 'hijo1'` y manda a `destino: 'hijo1'`, pero el hijo se llama `hijo1-opciones`; y
  además hijo1 nunca se recarga. El temporizador que el padre guarda para restaurárselo no sirve
  hoy para nada. Si hijo1 entra algún día en la lista, fallará en silencio por el nombre.
- La misma recuperación reenvía el audio a hijo3 con `enviarMensajePadre`, **sin acuse ni
  reintentos**: un segundo camino para el mismo envío.

---

## 9. Lo que va por fuera del bus

### 9.1. Escuchas sueltas del padre

| L~ | Qué | Valida | Emisor |
|---|---|---|---|
| 144 | `VV:PARADAS:READY` → inyecta CSS, y un `<script>`, en el documento de hijo5 | origen y fuente | hijo5 a pelo |
| 1742 | `CHAT.CERRAR` → cierra el asistente | solo origen | hijo6 a pelo, **sin `origen`** |
| 2399 | `mapa-completo-solicitar-datos` | origen y fuente | mapa a pelo, sin `origen` |
| 4249 | `NAVEGACION.SUPRIMIR_ROTACION`, y la alternativa `SUPPRESS_ROTATION`, que nadie envía | solo origen | selección a pelo |
| 4276 | `SELECCION.DEV_MODE_TOGGLE` → activa el modo dev | **solo origen: cualquier frame del dominio lo activa** | selección a pelo, **sin `origen`** |
| 15864 | service worker | — | otro canal |

### 9.2. Envíos a pelo

- **Selección** se salta su propio envoltorio en 7 envíos, todos con el tipo escrito a mano:
  `P14_MOSTRADA`, `PREPARAR_HIJOS`, `CODIGO_VALIDADO`, `SUPRIMIR_ROTACION` ×2,
  `REINICIAR` (con `origen` desde el arreglo de F1) y `DEV_MODE_TOGGLE` (sin `origen`).
- **Padre → hijos:** `CHAT.ESTADO_PADRE` a hijo6 y `NAVEGAR_PANTALLA` ×2 a selección, sin
  `origen`; `mapa-visible` al mapa, sin `origen`; `CONTROL.HABILITAR`, `RETO.MOSTRAR`,
  `AVENTURA.*` y el heartbeat de `visibilitychange`, con `origen`.
- **Nietos:** todos sus envíos (§11).

### 9.3. Mensajes sin `origen`: el bus los tiraría

| Mensaje | De → a | Hoy entra por |
|---|---|---|
| `SELECCION.DEV_MODE_TOGGLE` | selección → padre | escucha suelta |
| `CHAT.CERRAR` | hijo6 → padre | escucha suelta |
| `mapa-completo-solicitar-datos` | mapa → padre | escucha suelta |
| `CHAT.ESTADO_PADRE` | padre → hijo6 | envoltorio de hijo6 (no exige origen) |
| `NAVEGAR_PANTALLA` ×2 | padre → selección | escucha suelta de selección |
| `mapa-visible` | padre → mapa | escucha del mapa |

### 9.4. Mensajes que llegan y nadie escucha

Matriz completa emisor → receptor. Todo lo que los hijos mandan al padre tiene quien lo
escuche, salvo:

| Mensaje | De → a | Qué pasa |
|---|---|---|
| `SISTEMA.CONFIRMACION` informativas ×11 | hijos → padre | se pierden (§3.7) |
| `SISTEMA.ACK` ×6 | hijos → padre | se pierden (§12) |
| `SISTEMA.NOTIFICACION` `PENDING_INICIADO` (L~10571) | padre → hijo3 | hijo3 no lo escucha; hijo2 e hijo4 sí |
| `SISTEMA.NOTIFICACION` `reto_completado` (L~11727, *"para que pueda reanudar o actuar"*) | padre → hijo3 | hijo3 no lo escucha |

Y al revés, un handler sin emisor: **hijo1 escucha `UI.CLOSE_MENUS`** (*"solicitud de cierre de
menús desde el padre"*) **y nadie se lo manda**. Solo existe la dirección hijo1 → padre. Posible
efecto: el menú de audio del padre y el panel de hijo1 abiertos a la vez. Sin probar.

Los "a todos" del padre son pocos: tres `SISTEMA.NOTIFICACION` de cambio de modo y el heartbeat
de `monitoreo.js`. **Ningún hijo ni nieto manda nada a todos.**

---

## 10. Frames que no respetan al padre

1. **hijo1 → hijo3: la pausa del audio no llega (F3).** Al abrir una página informativa, hijo1
   manda `UI.ACCION_USUARIO { comando: 'pause' }` con `destino: 'hijo3'`. Solo puede escribir al
   padre; el padre no reenvía nada y su handler no conoce esa acción ("acción no manejada").
   hijo1 ya avisa al padre justo después con `UI.NAVEGACION_EXTERNA`, cuyo handler solo marca
   una bandera. Con director: pausa el padre, y el mensaje al hermano sobra.
   - hijo3 contesta esas peticiones con `SISTEMA.CONFIRMACION` "a mano" dirigido a quien
     preguntó: cuando es un hermano, tampoco le llega.
2. **hijo6 cierra el asistente tres veces.** Llama a `parent.cerrarChatSoporte()`, esconde el
   iframe tocando `parent.document` y manda `CHAT.CERRAR`. Tres bloques independientes que se
   ejecutan todos. El comentario lo justifica "para que cierre aunque falle la mensajería".
3. **hijo2 lee `parent.aventuraSeleccionada`** directamente para montar la URL del mapa.
4. **hijo5 manda un cambio de modo "a sí mismo"** (`destino: 'self'`) que llega al padre, y el
   padre ejecuta un cambio de modo completo. Su `.catch` de respaldo no se ejecuta nunca: su
   `enviarMensaje` no rechaza.
5. El padre, por su parte, inyecta CSS y un `<script>` en el documento de hijo5 (§9.1).

`puzzle.html` lee `(top || parent).innerWidth`: solo tamaño de pantalla, no comunicación.

---

## 11. Los nietos

| Conversación | Mensajes | Problemas |
|---|---|---|
| puzzle → hijo4 | `PUZZLE.COMPLETADO` / `TIMEOUT` (tipados, con origen) | hijo4 acepta además un formato antiguo de texto plano que **nadie envía**; el spec 61 lo protege |
| puzzle → selección | ídem | ídem, y su escucha **no comprueba** que venga de su puzzle |
| video-intro → selección | `'SELECCION.VIDEO_INTRO_TERMINADO'` | tipo escrito a mano aunque existe en `constants.js`; escucha sin comprobar fuente; mezclada con `NAVEGAR_PANTALLA` del padre |
| video-intro → hijo6 | ídem | ídem, escucha sin comprobar fuente |
| mapa ↔ padre | `mapa-completo-solicitar-datos`, `mapa-completo-datos`, `mapa-visible` | tipos sin constante, campos fuera de `datos`, escucha del mapa sin comprobar fuente; `solicitar-ruta` → `ruta-completa` **no lo usa nadie** |

- Ningún contenedor escribe a su nieto. Solo el padre escribe al mapa.
- El mapa es hijo directo del padre: le basta el papel de hijo. Puzzle y vídeo necesitan que
  su contenedor tenga doble papel.

---

## 12. `ACK`: una trampa de bucle

- `js/app.js` contesta `SISTEMA.ACK` al hijo tras cada "entendido" y cada "efectuado"
  (*"ACK es cosmético"*).
- hijo1, hijo2, hijo3, hijo5 y selección contestan cada `ACK` **con otro `ACK`** (*"mantener
  bidireccionalidad"*). hijo4 también envía `ACK`.
- El padre **no escucha `ACK`**: esas respuestas se pierden. Hoy es tráfico inútil, sin bucle.
- Si alguien registra `ACK` en el padre y contesta, ping-pong infinito.

---

## 13. Heartbeats en el padre

| Emisor | Qué hace | ¿Se pausa en CASA? |
|---|---|---|
| Bus, `enviarHeartbeatAHijos` | uno por hijo, cuenta fallos, recarga iframes | **sí**, a propósito |
| Script clásico L~15433 | a pelo, a todos los `iframe[name]`, al volver a la pestaña | — |

- El handler de `SISTEMA.HEARTBEAT` del padre (L~8115) está muerto: nadie le envía heartbeats.
- `js/monitoreo.js` tenía un tercero que latía cada 5 s a todos los iframes, no se paraba nunca y
  anulaba la pausa de CASA. **Quitado con F5**, junto con su función, su intervalo, sus opciones y
  `CONFIG.HIJOS.INTERVALO_HEARTBEAT`, que solo usaba él. Medido antes de quitarlo: en AVENTURA el
  bus y `monitoreo.js` latían los dos cada 5,0 s.
- hijo1 y hijo5 cargan `monitoreo.js`, pero **nadie lo arranca** en ellos; hijo2 no lo carga.
- Quitarlo no rompe nada: los hijos solo contestan (§7.2), ninguno vigila la llegada de latidos,
  y en el padre esas respuestas solo marcan al hijo como vivo.

---

## 14. `pagehide` y la caché del botón atrás

- **Hijos:** al salir quitan sus listeners y vacían `_listenerRegistry`, pero no
  `__CONTROLADOR_REGISTRADOS`. Si la página vuelve de la caché, nada se vuelve a registrar.
- **Padre** (script clásico L~15461): **borra todos los iframes**, vacía su guarda de registros y
  para intervalos, **sin mirar `event.persisted`**. No hay `pageshow` en todo el proyecto, y
  tampoco `unload` (`app.js` lo evita a propósito), así que la página puede entrar en esa
  caché.
- Salidas reales del padre: `En-busca-del-tesoro.html?despedida=1` al terminar la aventura
  (L~9207, L~14311) y `app-settings:` en la ayuda de permisos de iOS (L~6965).
- Restos: `detenerHeartbeat` no existe (solo se baja una bandera) y `globalThis.controladores`
  no se crea nunca.

---

## 15. Seguridad

Todos los listeners validan el origen, la fuente o ambos. Pero no todos lo mismo:

- **Solo la fuente** (que venga del padre): los adaptadores y el registrador de hijo6.
- **Solo el origen** (que venga del mismo dominio): `CHAT.CERRAR`, `SUPRIMIR_ROTACION` y
  `DEV_MODE_TOGGLE` en el padre, las dos escuchas de selección (puzzle y vídeo/navegación), la
  de vídeo de hijo6, la del mapa y el propio bus.
- **Origen y fuente:** `_handlePreModuleMessage`, la petición de datos del mapa y la escucha
  del puzzle en hijo4.
- **Cualquier frame del dominio puede activar el modo dev** (§9.1).
- El bus acepta además origen `'null'`. Al llevarlo a los hijos hay que añadirle la
  comprobación de fuente que hoy tienen sus adaptadores, no perderla.
- `'*'` como destino solo aparece para `file://`: hijo6 (L~370) y el vídeo (L~1942) lo usan
  cuando el origen es `'null'`. El caso `file://` se trata de tres formas: el bus acepta
  mensajes con origen `'null'` pero respondería con un destino `'null'`, que la especificación
  no admite; hijo6 y el vídeo lo cambian por `'*'`; y el `|| '*'` del state-manager (L~401) no
  salta nunca, porque `'null'` es una cadena no vacía.
- Otras llamadas entre frames sin mensajes: el script que el padre inyecta en hijo5 llama a
  `parent.registrarMetrica`, y la cuarta capa de `utils.js` usa `parent.mensajeria` (§5.1).

---

## Parte II — Fallos vivos

Los cinco que había al empezar. Todos arreglados; de F4 queda un resto (§0).

| # | Qué pasa | Evidencia | Test |
|---|---|---|---|
| **F1** ✅ arreglado | **Al responder "no" en el reto R2, el padre no se entera.** Selección manda `SELECCION.REINICIAR` sin `origen` y el bus lo tira: `_hdl_SELECCION_REINICIAR` no se ejecuta nunca. Las banderas `_codigoValidadoP13` e `_iframesPreCargadosP14` siguen en `true` hasta que se vuelve a elegir aventura, donde otro sitio las resetea y lo tapa. Mientras tanto, el aviso de señal GPS puede salir encima de la selección (**sin probar**) | **confirmado en ejecución**: con remitente el handler corre; con el clic real, no | **spec 74**: rojo en los 4 antes del arreglo, verde después |
| **F2** ✅ arreglado | **Los errores de los hijos nunca llegan al padre.** `utils.js` instala el reporte en todos los iframes, pero envía por `globalThis.mensajeria`, que ningún hijo tiene. Cada error se encola, se reintenta 10 s y acaba en un aviso de consola del hijo. El comentario dice que usa un canal "que YA existe y funciona" | **confirmado en ejecución**: el error no llega y el hijo escribe "La mensajería nunca estuvo disponible" | **spec 75**, rojo en los 4; el 58 pasa porque inventa un bus falso |
| **F3** ✅ arreglado | **La pausa del audio al abrir una página informativa no llega a hijo3** (§10, punto 1) | **confirmado en ejecución**: el padre registra "Acción no manejada: audio_control" | **spec 76**, rojo en los 4 |
| **F4** ✅ arreglado | **Volver atrás desde la despedida podría dejar la app vacía** (§14) | **reacción de la app confirmada**: tras `pagehide` + `pageshow` con `persisted`, pasa de 8 iframes a 0. **No medible** si un navegador real guardaría la página: los de Playwright no restauran nunca de esa caché, ni con páginas triviales | **spec 77**, rojo en los 4 |
| **F5** ✅ arreglado | **En CASA el heartbeat no se calla**: el de `monitoreo.js` sigue cada 5 s aunque el bus pausa el suyo | **confirmado en ejecución**: con el del bus pausado, hijo2 recibe 2 latidos de `monitoreo` en 12 s | **spec 78**: rojo en los 4 antes del arreglo, verde después |

Menores, sin efecto funcional:

- Las confirmaciones "a mano" de hijo2 (L~2419) y hijo5 (L~1267) a `RESPUESTA_DATOS_PARADAS`
  (*"CLAVE: permite resolver promesas pendientes"*) llegan sin `idOriginal`, porque sus
  `enviarMensaje` tiran ese campo. Y nadie las espera: el padre manda ese mensaje sin acuse,
  desde siete sitios.
- El log de hijo2 que dice "OK" cuando fue error (§3.4).
- Los avisos que el padre manda a hijo3 al empezar cada parada y al completar un reto, que hijo3
  no escucha (§9.4).
- La recuperación de hijo1 tras recarga, con un nombre que no existe (§8).
- El cierre de menús de hijo1 que nadie le pide (§9.4).

---

## Parte III — Qué exige la opción A

## 16. Prueba de escritorio

### 16.1. Hoy no cambia nada en los cinco caminos con acuse

Los cinco devuelven valor en todas sus salidas (§3.2). Confirmar siempre es un no-op medible:
quita la trampa para el siguiente handler que se escriba.

### 16.2. Lo que el bus rompería si se enchufa tal cual

**Campos fuera de `datos`, que el bus tira:**

| Envío | Campo | Arreglo |
|---|---|---|
| selección → padre `SUPRIMIR_ROTACION` ×2 | `value` (el padre lee `event.data.value`) | moverlo a `datos` en los dos lados |
| padre → mapa `mapa-completo-datos` | `coordenadas` | ídem |
| mapa → padre `mapa-completo-solicitar-datos` | `aventura` | ídem |
| `app.js` (4 envíos) y `funciones-mapa.js` (2) | `mensajeId` | ya se pierde hoy |

**Mensajes sin `origen`:** los seis de §9.3.

**Semántica distinta de `enviarMensaje`:**

- Los hijos devuelven `undefined` y **lanzan** si el envío falla; el bus devuelve `false` y
  nunca rechaza. El código que dependa del `throw` o del `.catch` deja de enterarse.
- Los hijos calculan el plazo con `ajustarTimeoutPorConexion(5000)`; el bus usa el `timeout`
  del mensaje o 5000 fijos. El rescate de hijo6 perdería el ajuste si no pasa `timeout`.

### 16.3. Lo que el bus no tiene y la A necesita

- Enviar hacia arriba o hacia abajo según `destino` (y reconocer al padre por un solo nombre).
- Aceptar mensajes solo de su padre y de sus iframes registrados.
- Dar de baja un iframe: el puzzle se crea y destruye en cada reto.
- Decidir si un mensaje "a todos" desde un hijo con nietos sube, baja o las dos cosas.

### 16.4. Lo que la A despierta

Con el bus dentro de los hijos, **F2 se arregla solo**, y el padre empezará a recibir por
`_hdl_SISTEMA_ERROR` errores que hoy se pierden (con deduplicación y tope de 20). En un nieto,
`origen: globalThis.name` vale `'hijo-desconocido'` (no tienen `name`) y el error iría a su
contenedor, no al padre. Hay que decidir adónde van.

### 16.5. Hijos abiertos como página suelta

Muchos specs abren hijos sin padre. Con la A, el bus en un hijo sin padre cae a mandarse los
mensajes a sí mismo y los ignora. Además, al importarse asigna `globalThis.mensajeria` sin
condición y **pisa los stubs** de los specs 26, 31 y 38, que existen para evitar una espera de
5 s del envoltorio actual. Hay que diseñar ese modo.

**No es solo cosa de tests.** Al terminar la aventura, el padre navega a
`En-busca-del-tesoro.html?despedida=1`: selección funciona **en producción** como página suelta,
sin padre, y arranca intentando mandar su `HIJO_PREPARADO`. Hoy no retrasa la despedida, porque
su rama sin padre (`getEnviarMensaje`, §5.1) no espera. El bus, en ese papel, tampoco puede
esperar ni lanzar.

### 16.6. Riesgos buscados que no existen

- **Bucle de confirmaciones:** hijo5 escucha `SISTEMA.CONFIRMACION`, pero las confirmaciones
  salen sin `id` ni `requiereConfirmacion` y ningún adaptador confirma sin ambas.
- **`datos: undefined`** es clonable y todos los consumidores lo tratan como vacío.
- **El padre no necesita otro emisor:** el suyo es el bus, y `app.js` no lo pisa.
- **Tipos repetidos:** ninguno en el padre ni en ningún hijo.
- **Handlers antes que el state-manager:** el orden de arranque lo impide.
- **`mensajeriaReady` doble:** su único oyente usa `{ once: true }`.
- **`retryUntilAvailable`:** acepta las dos firmas en uso.
- **Nombres de iframes:** coinciden.
- **El bus no filtra confirmaciones por `destino`:** que hijo2 lo omita no rompe nada.
- **Tipos que choquen en un `Map` único:** de las 101 constantes de tipo, ninguna repite cadena.
- **Handlers que reciban `event` sin esperarlo:** el bus llama `handler(mensaje, event)`, y
  ningún handler (los 49 `_hdl_` del padre ni los de los hijos) tiene segundo parámetro.
  Comprobado por dos vías.
- **Errores revividos que salgan en pantalla:** `_hdl_SISTEMA_ERROR` solo escribe un aviso en el
  log, salvo con `AUDIO_CONTROL_FALLIDO`.
- **Heartbeats que hagan trabajo en los hijos:** los siete solo contestan.
- **Selección diciendo "preparado" antes de que el padre la escuche:** es el único iframe que se
  carga al arrancar, pero su carga (L~8773) va en el mismo script y después del registro del
  handler (L~7583).
- **Nombres de hijo mal escritos en decisiones del padre:** la única comparación por origen
  (`!== 'hijo5'`) es correcta. El único nombre inexistente está en la recuperación de hijo1
  (§8).

### 16.7. Fallos buscados en las dos decisiones de confirmación

**"Recibido, pero ha fallado" — cuatro condiciones:**

1. **Tiene que llegar al emisor como fallo, no como éxito.** Hoy el bus lo entrega como éxito
   (§3.4). Con eso, el emisor del audio diría "entregado" y no llamaría a
   `_marcarAudioNoDisponible`, que es lo que desbloquea la parada cuando el audio no llega: la
   parada se quedaría esperando un audio que no va a sonar, con el botón de saltar manual como
   única salida. **Hoy, sin contestar, el padre reintenta y acaba desbloqueándola sola.** Sin esta
   condición, la decisión empeora el audio.
2. **No se puede leer el fallo en `datos.error`.** hijo3 devuelve a propósito
   `{ exito: false, error }` cuando captura su propio fallo, y eso debe seguir contando como
   entregado. La marca de "el handler se rompió" tiene que ir fuera de `datos`: en el campo de
   la raíz que el bus ya comprueba.
3. **El emisor del audio no debe reintentar un fallo.** Hoy reintenta ante cualquier error.
   Reintentar un fallo de código no sirve de nada, y si el handler ya había hecho parte de su
   trabajo antes de romperse (asignar el audio, mandar su respuesta), el reintento lo repite.
   Tiene que distinguir "falló al procesar" (desbloquear sin reintentar) de "no contestó"
   (reintentar).
4. **El texto del error se construye con cuidado.** El bus usa `error.message`: si algo falla
   sin objeto de error, esa lectura revienta dentro del propio `catch` y **deja rota para siempre
   la fila de ese tipo de mensaje**. Hoy no hay en el proyecto ningún `reject()` ni `throw` sin
   error, pero una API del navegador podría hacerlo.

Los cinco emisores con acuse capturan el fallo (`try/catch` o `.catch`): ninguno se corta a
mitad. Hay dos cosas que no arregla ninguna de las dos opciones: si el handler del rescate del
padre se rompe, el usuario pulsa y no ve nada (hijo6 solo lo apunta en el log); y hijo2 cambia el
estado del botón GPS antes de enviar y no lo deshace si falla.

**No contestar si nadie escucha — sin fallos reales:**

- Padre → hijos: es exactamente lo que pasa hoy (sin handler no hay listener que conteste).
- Hijos → padre: los tres tipos con acuse (`GPS.ACTIVAR`, `RETO.COMPLETADO`,
  `RESCATE_SOLICITADO`) se registran al arrancar y nunca se desactivan ni se borran
  (`removerControladorCentral` no se llama y ningún `activo: false` es de un handler). En la
  práctica no se da nunca.
- Si se diera, el emisor esperaría su plazo entero (5 s en hijo2, hijo4 y hijo6) en vez de
  recibir un `null` al instante. Es el resultado honesto.
- El comentario del spec 26 que describe la confirmación sin handler queda falso; el test
  tolera los dos casos.

Ninguna de las dos decisiones está cubierta hoy por un test: hay que escribirlos en rojo.

---

## Parte IV — Impacto en tests y guía

## 17. Tests

- **27 de 70 specs** tocan la mensajería.
- **Siete miran las tripas del padre** (`__CONTROLADOR_REGISTRADOS`: 02, 03, 06, 07, 08, 09, 10)
  y el helper `boot.js` lee `__CONTROLADORES_PENDIENTES` y `__MENSAJERIA_INICIADA`. Si cambia el
  registro del padre, hay que reescribirlos a conciencia.
- **69:** AC-2 y AC-3 afirman la regla que se retira.
- **58:** pasa con un bus falso; hay que sustituirlo por un test sobre un hijo real, que falle
  hoy.
- **61:** protege el formato antiguo del puzzle.
- **54:** manda mensajes al mapa sin `origen` (su formato actual).
- **26, 31, 38:** stubs que el bus pisaría (§16.5). El 31 admite en su comentario un fallo
  intermitente de causa sin identificar.
- **74 a 78: un escenario por fallo vivo (F1 a F5).** Cada uno recorre el camino real y lleva
  un control que demuestra que el montaje funciona. Hoy los 16 controles pasan y los 20
  caminos reales fallan, igual en los cuatro navegadores: son los tests en rojo de los
  arreglos. El 77 no puede navegar de verdad, porque los navegadores de Playwright nunca
  restauran desde la caché de atrás; dispara los eventos `pagehide` y `pageshow`.
- **17 specs simulan mensajes con `postMessage` a la propia página.** Todos llevan `origen`,
  pero el mensaje "viene de sí mismo": el bus tiene que seguir aceptando mensajes propios, o esos
  17 caen.

## 18. Guía

`docs/GUIA-COMPLETA.md` menciona estas piezas en **79 secciones (194 líneas)**. Las más densas:
§26.5 (15), §33.4 (11), §10.5 (10), §10.17 patrón ACK (7), §33.1 cola de registros (7), §8.1
(6), §26.7 (6), §32.3 padre que no se envía a sí mismo (6), §32.1 `pagehide` (5).

Afirmaciones que chocan con el código:

- **§10.5, FASE 9:** describe la regla estricta como contrato y dice que hijo2 la cumple.
  hijo2 es el único que no la tiene.
- **§33.4:** documenta los nombres del padre (números de línea antiguos, "~90 usos" cuando son
  61 + 17) y lo da por inofensivo "porque no rompe el enrutamiento". Con doble papel sí lo
  rompe.
- **§32.1:** enseña como "patrón correcto" la limpieza en `pagehide` que deja el frame sordo al
  volver de la caché: da por hecho que `pagehide` significa que la página muere.
- **§10.17:** afirma que los errores no controlados de los hijos "viajan al padre" (hoy no llegan,
  F2) y presenta como patrón las confirmaciones informativas, que nadie escucha (§3.7).

---

## Parte V — Plan propuesto

**Pendiente de aprobar.** Un cambio cada vez, para que si algo falla se sepa dónde.

1. ✅ **F1.** `origen` en el mensaje. Spec 74 verde y 12 specs de selección y P13–P15 sin
   regresiones (248/248 en los 4 navegadores).
2. ✅ **F5.** Fuera el heartbeat de `monitoreo.js` entero. Spec 78 verde en los 4.
3. **Tests de la migración primero**, todos en rojo contra el código de hoy: spec 69 reescrito,
   bus en modo hijo, doble papel, hijo suelto, y el sustituto del 58 (F2).
4. **Ajustar el bus:** regla de confirmación, rama muerta fuera, sin confirmación a `null`,
   comprobación de fuente (sin dejar de aceptar los mensajes propios), doble papel, baja de
   iframes, modo hijo suelto que no espere ni lance, un nombre para el padre, y un solo
   mecanismo de acuse.
5. **Preparar los mensajes:** `origen` en los seis de §9.3, campos sueltos dentro de `datos`,
   tipos desde `constants.js`.
6. **Migrar los hijos, de menos a más riesgo:** hijo1, hijo5 y selección → hijo4 y hijo6 →
   hijo3 y hijo2. En cada uno: el bus inicializado antes del primer envío (§7.4), fuera sus
   copias, el respaldo mudo y `safeRegistrar`. F2 queda arreglado aquí.
7. **Nietos:** mapa como hijo; puzzle y vídeo con su contenedor en doble papel. Fuera el
   formato antiguo del puzzle y `solicitar-ruta`.
8. **Padre:** un solo camino de registro, un solo repartidor, escuchas sueltas al bus, fuera
   los envíos a pelo, un solo nombre de envío (hoy seis). F3 (pausa por `NAVEGACION_EXTERNA`),
   el cierre triple de hijo6, la recuperación de hijo1 y la lista de hijos vigilados (§8).
9. **Borrar lo muerto** de §2, §5, §6, §9.4, §12 y §13, y la cuarta capa de `utils.js` (§5.1).
10. **Guía:** reescribir las secciones de §18 y dar al contrato una sección propia.

**Estado:** 6 y 7 hechos (§25.9). 8 a medias: hecho un solo camino de registro, un solo repartidor,
sin escuchas sueltas, sin `ACK` y sin la capa `get*`. Del 5 queda al menos `CHAT.ESTADO_PADRE`, que
el padre sigue mandando a pelo y sin `origen`: hijo6 lo descarta y el asistente se queda con el
estado de su primera apertura.

### La lavadora: orden para terminar

Lo que falta, en orden de engranaje: cada paso se apoya en el anterior. Antes de cada uno se
comprueba todo lo que lo sostiene y se explica; después, la tanda de los cuatro navegadores.

0. ✅ Este documento al día.
1. ✅ **Identidad:** el bus pone el `origen` y lo comprueba al recibir (decisión 10). Fuera las
   firmas inventadas (`padre_<aleatorio>`, `funciones-mapa`, `sistema`, `restauracion-interna`…) y
   la reescritura de `enviarMensajePadre`.
2. ✅ **Mensajes a sí mismo → `despacharLocal`** (§21.2), incluidos los atajos `__trigger*` y
   `_vv_triggerCambioModo`, y el camino único del modo (decisión 11).
3. ✅ **Destino obligatorio:** un envío sin `destino` no sale y avisa; "a todos" solo con
   `'broadcast'` (§21.2). Antes, inventario completo de los envíos sin destino.
4. ✅ **Los envíos a pelo del padre, al bus**, con el de `CHAT.ESTADO_PADRE` el primero.
5. ✅ **Nombres:** uno para enviar y uno para registrar (§23).
6. ✅ **Registro de handlers del state-manager** (§23): opciones primero.
7. ✅ **Latido y recuperación:** fuera `HEARTBEAT_START/PAUSE` (§22, fila 19); la recuperación de un
   hijo repite la entrega normal de su elemento en vez de un camino propio.
8. ✅ **Un solo camino donde hoy hay dos:** coordenadas pedidas dos veces por elemento, lista de
   paradas de hijo5 desde dos fuentes, `ACTUALIZAR_ESTADO` doble por lectura GPS, modo por cuatro
   mecanismos, `NOTIFICACION` con un solo evento usado, carga de datos de hijo2 empujada y pedida,
   audio a hijo3 por cuatro caminos, dos constructores de `RETO.MOSTRAR`, respuestas dobles (por
   acuse y por mensaje aparte) y los avisos de error o `NACK` que el padre manda a hijos que no los
   escuchan. Los diez sub-ítems (8.1-8.10) cerrados en §25.17; ninguno abrió una decisión de diseño
   separada (12/13/14 no llegaron a materializarse).
9. ✅ **Lo muerto** (§23): confirmaciones informativas, `DATOS.CARGADOS_RECIBIDO`, guardas
   inalcanzables, el segundo cargador de hijo4 (asigna `src` sin registrar el iframe), el resto de
   F4 (§0) y lo que deje sin uso cada paso anterior. Cerrado en §25.18, incluidos los tres avisos
   `cambio_modo_*`/`restauracion_modo` apuntados en el paso 8.5.
10. ✅ **Estudio completo desde el inicio de la migración**, para lo que se haya escapado. Cerrado
    en §25.19: `SISTEMA.ADVERTENCIA` retirado (sin emisor real); tabla de §37.3 de GUIA-COMPLETA.md
    regenerada y corregida.
11. ✅ **Guía.** Cerrado en §25.20: §32.1 reescrita entera (describía un `messagingAdapter` que ya
    no existe); §10.25 nueva, el contrato del bus (21 garantías) con sección propia.
12. ✅ **Auditoría de 28 ejes y auditoría inversa; tanda final de los cuatro navegadores.**
    Cerrado en §25.21: sin hallazgos nuevos de mensajería; 19 esperas ciegas de la lavadora
    corregidas (poll donde era posible, marcadas donde no); tanda final lanzada.

**LA LAVADORA QUEDA CERRADA ENTERA (pasos 1-12).**

F4 (`pagehide`): la parte de los hijos desapareció con la migración —el bus no
quita su listener al salir, y con los adaptadores se fue la limpieza que los dejaba sordos—. El
`pagehide` propio del padre ya separa el cierre real del viaje a la caché de atrás; lo que queda
(`app.js` y `funciones-mapa.js`, §0) va en el paso 9.

---

## Parte VI — Diseño del bus

Traducción de todas las decisiones a comportamiento concreto, verificada contra el código antes
de construir. **Implementado, salvo el plazo por defecto del acuse, que es `5000` pelado en vez de `ajustarTimeoutPorConexion(5000)`.** `tieneControlador(tipo)` y `listarControladores()` ya existen (`js/mensajeria.js`).

## 21. Las reglas

### 21.1. Identidad y papeles

- Cada frame arranca el bus con su nombre: `'padre'` arriba; el `IFRAME_ID` en los hijos;
  `'puzzle'`, `'video-intro'` y `'mapa-completo'` en los nietos.
- El bus deduce solo sus papeles: **tiene padre** si `window.parent !== window`; **tiene hijos**
  cuando registra iframes. Un mismo frame puede tener los dos (hijo4, selección, hijo6).
- **El bus pone el `origen`** de todo lo que envía. Quien llama deja de pasarlo.
- **Tiene que estar arrancado antes del primer envío** del frame (§7.4).

### 21.2. Enviar

`enviarMensaje({ tipo, destino, datos })` → `Promise<boolean>`, nunca lanza:

| `destino` | Adónde va |
|---|---|
| `'padre'` | a la ventana de arriba del propio frame |
| nombre de un iframe registrado | a ese iframe |
| `'broadcast'` | a todos los iframes registrados **del propio frame**; nunca sube |
| cualquier otra cosa | no se envía: `false` y aviso en el log |

- Solo viajan `tipo`, `datos`, `destino`, `origen`, `id` y `timestamp`: todo dato va en `datos`.
- **Hijo sin padre y sin iframes** (despedida, specs que abren hijos sueltos): `false` al
  instante y un único aviso en el log.
- Solo mismo origen. **Sin soporte de `file://`**: los módulos ES no cargan ahí (lo documenta el
  spec 18), así que ese soporte es código muerto en el bus, hijo6 y el vídeo.

`enviarMensajeConConfirmacion({ tipo, destino, datos, timeout })` → `Promise`:

- **Resuelve** con lo que devolvió el handler (también `undefined`).
- **Rechaza** con un error que dice por qué: `'fallo-handler'` (el handler se rompió),
  `'sin-respuesta'` (plazo agotado) o `'no-enviado'`.
- Plazo por defecto: `ajustarTimeoutPorConexion(5000)`, el que ya usan los hijos.

`despacharLocal(mensaje)`: entrega un mensaje a los handlers **del propio frame** por la misma
fila que los que llegan. Sustituye los tres caminos que hoy lo resuelven mal:
`enviarMensajeCentral` (`app.js`, primera parada), los auto-mensajes de heartbeat del Script 4
y el `destino: 'self'` de hijo5.

### 21.3. Recibir

- **Un solo listener** por frame.
- Acepta un mensaje si viene del **mismo origen** y su fuente es **la ventana de arriba, un
  iframe registrado o el propio frame**. Los propios se aceptan porque 17 specs simulan así
  mensajes (§17). Lo demás se descarta.
- **Sin `origen` o sin `tipo`:** se descarta con aviso en el log, uno por tipo. Hoy es silencioso,
  y así se escondió F1.
- **Un handler por tipo.** Registrar un tipo dos veces es un **error ruidoso** y se queda el
  primero. Los comentarios del padre, `app.js` y `funciones-mapa.js` documentan carreras por
  "gana el primero" que hubo que esquivar a mano; hoy no hay ningún tipo registrado dos veces.
- En fila por tipo, como ya hace el bus en el padre.

### 21.4. Contestar a un mensaje con acuse

| Qué pasa | Qué contesta el bus |
|---|---|
| El handler devuelve algo (también `undefined`) | `SISTEMA.CONFIRMACION { idOriginal, datos }` |
| El handler lanza | `SISTEMA.CONFIRMACION { idOriginal, error: { mensaje } }`, con el error **en la raíz**: el emisor rechaza con `'fallo-handler'` |
| No hay handler | nada, y aviso en el log |

- El texto del error se construye sin suponer que hay objeto de error, y la fila no puede
  romperse por un fallo dentro del propio `catch` (§16.7, condición 4).
- Un `{ exito: false, error }` **devuelto** por el handler es un resultado, no un fallo: resuelve
  (§16.7, condición 2).

### 21.5. Iframes

- `registrarIframe(id, elemento, { recuperable })` **antes** de asignar `src`.
- `desregistrarIframe(id)`, nuevo: el puzzle se crea y se destruye en cada reto, y el mapa cambia
  de página en cada apertura.
- Consulta pública: `tieneControlador(tipo)` y `listarControladores()`, para diagnóstico y para
  los specs 07 y 20, que hoy consultan el registro del state-manager.

### 21.6. Latido (solo en el padre)

- Vigila **todos los iframes registrados**, no una lista a mano.
- Tras 3 fallos: si el iframe es `recuperable` (hijo1 a hijo4), se recarga y se restaura; si no,
  aviso en el log.
- Al volver a la pestaña: `adelantarLatido()`. Si el latido está en pausa (CASA), no hace nada.
- Se pausa en CASA, como ya hace.

### 21.7. Errores

- El reporte de `utils.js` funciona solo en cuanto el frame tiene bus (F2).
- Un `SISTEMA.ERROR` que llega **de un iframe propio** se pasa tal cual hacia arriba, con el
  nombre del nieto dentro. Es genérico en el bus: ningún contenedor escribe código para ello.

## 22. Prueba de escritorio: los flujos reales contra el bus nuevo

| # | Flujo | Qué pasa con el bus nuevo | Hueco y cómo se cubre |
|---|---|---|---|
| 1 | Arranque del padre | state-manager → bus `'padre'` → registros. El bus guarda sus handlers; el state-manager deja de hacerlo | `_logDebugHijoListo` (L~8425) consulta `getControladoresPorTipo`: pasa a `listarControladores` |
| 2 | Registros del padre en sus 5 scripts | Registran directo en el bus. Las dos colas de espera existían porque la función de registro podía no existir todavía; el bus la publica al importarse | Verificar en cada script que espera a `globalThis.mensajeria` antes de registrar (el Script 2 ya lo hace) |
| 3 | Selección al arrancar | Se registra antes de su `src` (L~8440). Su bus arranca antes de `_enviarHijoPreparado` | Los 6 envíos de su script clásico usan `globalThis.mensajeria` y van en acciones del usuario: verificar uno a uno al migrarla |
| 4 | Handshake | `HIJO_PREPARADO` → `PADRE_DATOS` → `HIJO_LISTO`. Fuera el `ACK` de L~7530 | Ningún hijo depende de él: sus banderas de "padre listo" las pone una espera propia |
| 5 | P14: carga de hijos | Registro antes de `src` (ya se hace); cada hijo arranca su bus | — |
| 6 | Cambio de modo | `CAMBIO_MODO` a todos los registrados; "entendido" y "efectuado" vuelven a `app.js`. Fuera sus dos `ACK` | — |
| 7 | Primera parada al activar la aventura | `despacharLocal` en vez de `enviarMensajeCentral`: la misma fila que un `CAMBIO_PARADA` entrante | Resuelve la posible ejecución en paralelo (§6). Sin tipos duplicados, un handler por tipo es equivalente a "todos los que encajan" |
| 8 | Audio con acuse y reintentos | hijo3 devuelve objeto en sus dos salidas. Si su handler llegara a lanzar, el emisor rechaza con `'fallo-handler'` | `_enviarAudioRequestConReintento` no reintenta ese error: desbloquea directamente (§16.7, condición 3) |
| 9 | Rescate (hijo6 → padre) | Acuse del bus; plazo ajustado por conexión | — |
| 10 | Coordenadas (padre → hijo2) | Resuelve con `datos` | — |
| 11 | Pausa al abrir página informativa (F3) | hijo1 solo avisa `UI.NAVEGACION_EXTERNA`; el handler del padre pausa a hijo3 | Fuera el mensaje hijo1 → hijo3 y la confirmación "a mano" de hijo3 |
| 12 | Cerrar el asistente | Solo `CHAT.CERRAR` por el bus; su escucha suelta pasa a handler | Fuera la llamada directa al padre y el ocultado tocando su HTML |
| 13 | hijo2 lee `parent.aventuraSeleccionada` | Debe usar el dato que ya le da el padre | Verificar al migrar hijo2 por qué existe ese respaldo |
| 14 | Puzzle en hijo4 | hijo4 registra `puzzleIframe` antes de su `src` y lo desregistra al quitarlo; el puzzle envía a `'padre'` (su contenedor) | Fuera el formato de texto antiguo y sus aserciones del spec 61 |
| 15 | Vídeo en selección y en hijo6 | Su script clásico usa `globalThis.mensajeria` en el clic | El vídeo importa el bus en su bloque módulo |
| 16 | Mapa completo | El padre lo registra al abrir y lo desregistra al cerrar; los datos van en `datos` | Fuera `solicitar-ruta`/`ruta-completa` y la escucha suelta del padre |
| 17 | Rotación y modo dev | Pasan a handlers del bus; `value` entra en `datos` | **`DEV_MODE_TOGGLE` deja de aceptarse de cualquier frame**: solo de uno registrado |
| 18 | `VV:PARADAS:READY` de hijo5 | hijo5 carga en P14, con el bus del padre ya listo: pasa a handler | Fuera la escucha previa a los módulos |
| 19 | Heartbeat | Llamadas directas a iniciar/pausar; `recuperable` en el registro | Fuera los auto-mensajes `HEARTBEAT_START/PAUSE` del Script 4, los que se mandan a los hijos y sus handlers (solo loguean). Revisar las herramientas de diagnóstico que los usan (`consultarHeartbeat`, `_testHeartbeatPauseResume`) |
| 20 | Salir de la página (hijos) | El bus no quita su listener: se acaba lo de quedarse sordos | La parte del padre (F4) se decide aparte |
| 21 | Errores (F2) | Llegan al padre; los de nietos, pasando por el contenedor | Spec 58: fuera su bus inventado, pasa a un hijo real |
| 22 | Despedida | Selección sin padre: el bus no envía ni espera | — |

## 23. Lo que se borra

Sin dejar nada muerto:

- Las 24 copias de los envoltorios en los 7 frames, con sus adaptadores, sus respaldos mudos,
  `safeRegistrar`, `__CONTROLADOR_REGISTRADOS` y sus limpiezas en `pagehide`.
- En el padre: `registrarControladorSeguro` y sus dos colas, `registrarControladorScript2Seguro`,
  `desregistrarControladorSeguro`, `enviarMensajePadre` y su reescritura del origen, los alias de
  envío (quedan un nombre de envío y uno de registro), las escuchas sueltas de §9.1, el latido a
  pelo de volver a la pestaña y el handler muerto de `SISTEMA.HEARTBEAT`.
- En el bus: la rama de rechazo muerta, la confirmación con `null` sin handler, el formato
  posicional, `colaMensajes`, `script2Listo`, `limpiar`, `registrarHijo`, `getHijoTipo`, `CONFIG`,
  la rama `__vv_getManejadores`, `migrarManejadoresTempranos` y el soporte de origen `'null'`.
- En el state-manager: el registro de handlers y `enviarMensajeCentral`.
- `js/app.js`: su copia muerta de `enviarMensajeConConfirmacion` y su envoltorio de envío.
- `js/utils.js`: `getEnviarMensaje`, `getRegistrarControlador` y `getEnviarMensajeConConfirmacion`.
- Mensajes: `SISTEMA.ACK`, las `SISTEMA.CONFIRMACION` informativas, `DATOS.CARGADOS_RECIBIDO`,
  `HEARTBEAT_START/PAUSE`, `solicitar-ruta`/`ruta-completa` y el formato de texto del puzzle.
- Las constantes que queden sin uso al final, comprobadas una a una.

## 24. Tests, en rojo antes de construir

**Contrato del bus**, con una página de pruebas que monte padre, hijo y nieto usando el bus real:

1. Envío arriba, abajo y "a todos" (que no sube ni llega a nietos).
2. Fuente no autorizada: descartada. Propio frame: aceptado.
3. Mensaje sin `origen`: descartado y avisado.
4. Acuse: resuelve con valor y con `undefined`; rechaza con `'fallo-handler'`,
   `'sin-respuesta'` y `'no-enviado'`; un `{ exito: false }` devuelto resuelve.
5. Sin handler: no contesta y avisa.
6. Registrar un tipo dos veces: error ruidoso y se queda el primero.
7. Hijo sin padre: `false` al instante, sin esperar.
8. `desregistrarIframe`: deja de recibir y de enviarle.
9. La fila de un tipo sobrevive a un fallo sin objeto de error.
10. `despacharLocal` pasa por la misma fila.
11. Un error de un nieto llega al padre con su nombre.
12. Latido: vigila todos, recarga solo los recuperables y respeta la pausa al volver a la pestaña.

**Escritos y en rojo:** el **spec 79** monta el arnés (padre → hijo → nieto con el bus real, más
un iframe sin registrar y dos mudos) y cubre los 12 puntos en 15 casos: su control pasa y los
otros 14 fallan, igual en los cuatro navegadores. Más 75 (F2), 76 (F3) y 77 (F4).
**A reescribir:** 69 (regla de confirmación), 07 y 20 (registro), 58 (bus real), 61 (formato
antiguo), 26/31/38 (sus stubs sobran) y 03, 06, 08, 09 y 10 (tripas del padre).

---

## 25. Lo construido, y en qué se apartó del diseño

El bus está construido y commiteado (`d7efb72`), con el padre usándolo. En aquel momento los siete hijos **todavía
no estaban migrados** (hoy lo están los siete y los tres nietos, §25.9). Suite completa tras construirlo:
1664 verdes y 16 rojos, que son los cuatro ficheros esperados (58, 75, 76, 77) en los cuatro
navegadores.

### 25.1. La fila tenía una segunda forma de morir, y no estaba en el diseño

El diseño protegía la fila de un handler que **falla** (§21.3). No la protegía de uno que **no
termina nunca**, y el efecto es idéntico: ese tipo de mensaje deja de procesarse para siempre, en
silencio, mientras todo lo demás sigue funcionando. Un `try/catch` no salva de un cuelgue.

Comprobado con una prueba desechable antes de afirmarlo: con un handler que devuelve una promesa
que nunca resuelve, el segundo mensaje de ese tipo no se procesa jamás (1 de 2).

**Añadido:** constante `PLAZO_MAX_HANDLER` (20 s). Pasado ese plazo la fila avanza sin él y se
registra un `logger.error` con el tipo y el id del mensaje; el handler no se corta. Los 20 s están
muy por encima de cualquier handler legítimo: el propio bus rechaza a los 5 s una petición con
acuse sin contestar. Lo cubre **BC-14**, validado en rojo.

**El aviso es la red, no la solución.** Se auditaron los **55 handlers** del proyecto buscando
esperas sin acotar. Solo dos esperan algo de la lista de riesgo (`_hdl_NAVEGACION_GPS_ACTIVAR` y
`_hdl_SELECCION_P14_MOSTRADA`, los dos a `activarGPS`), y `activarGPS` está acotado en todos sus
caminos: `getCurrentPosition` lleva plazo, el bucle de intentos está topado en 3 y
`permissions.query` responde al momento. Los diálogos que esperan al usuario (rescate,
reanudación) **nunca se esperan desde un handler** — el de rescate los lanza sin `await` y devuelve
al momento. `retryUntilAvailable` se rinde tras N intentos. Del cerrojo del state-manager, 23 de
sus 24 usos pasan funciones síncronas y el único asíncrono recibe un actualizador síncrono.
Límite de esa auditoría: mira los `await` directos del cuerpo de cada handler, no toda la cadena
de llamadas — que es justo lo que cubre la red.

### 25.2. La marca `recuperable` estaba a medias

El diseño decía "vigilar todos los registrados y recargar solo los recuperables". Se construyó la
puerta y **no pasaba nadie**: ninguna de las cinco llamadas a `registrarIframe` pasaba la marca, así
que el bus dejó de recargar a todo el mundo. Antes (`AUTO_RECONECTAR: true`) se recargaba cualquier
hijo que fallara tres latidos.

**BC-12b seguía verde** porque su arnés pasa la marca a mano. Un test que pasa con y sin el fallo no
vale: hizo falta el **spec 80**, contra la aplicación real, para verlo.

**Añadido al diseño:** un punto único de registro, `globalThis.registrarIframeHijo(id, elemento)`,
con la lista `HIJOS_RECUPERABLES` al lado. Los cinco cargadores pasan por ahí.

Y al tirar de ese hilo salieron dos fallos viejos que habrían hecho la recarga de hijo1
contraproducente — se recargaría y perdería el temporizador:

1. `_vv_afterHijoListo` comparaba `hijoId === 'hijo1'`, pero el iframe se llama `hijo1-opciones`:
   esa rama no se cumplió nunca, y su `destino` tampoco existía en la mensajería.
2. El tiempo restante solo se apuntaba dentro del bloque que pinta la ventana del temporizador, y
   esa ventana solo se crea si el usuario la abre. Ahora sale de `estado.tiempoRestante`, que se
   actualiza siempre; `_snapshotRecuperacion` pierde ese campo, que era una segunda copia.

### 25.3. Un hallazgo propio que resultó falso

Se reportó que un handler roto dejaba una promesa rechazada sin dueño, que
`instalarReporteErroresAlPadre` convertiría en un segundo aviso al padre. **Es falso**: el `.catch`
con el que la fila guarda su eslabón ya marca la original como atendida. Lo demostró la propia
prueba, que pasaba con y sin el "arreglo" — el arreglo sobraba y se retiró. El test se queda
(**BC-13**) porque sí se pone rojo si alguien toca el `.catch` de la fila: vigila la otra
consecuencia de esa misma línea.

### 25.4. Tests del contrato: 15 → 17

A los 15 del spec 79 se suman **BC-13** (un handler roto no deja promesa suelta) y **BC-14** (un
handler colgado no para su tipo). Fuera del contrato, el **spec 80** (RC-1/2/3) comprueba contra la
aplicación real lo que el arnés no puede: que la PWA marca de verdad a los cuatro recuperables y que
la restauración de hijo1 le llega a hijo1.

### 25.5. Código muerto retirado

`mensajeria?.registrarHijo?.()` del padre (no-op silenciosa por el `?.`),
`desregistrarControladorSeguro` entero (definido y expuesto, jamás llamado, y por dentro invocaba
dos cosas inexistentes), el bloque `CONFIG.HIJOS` completo (§Parte VII, punto 3 — sus cuatro claves
sin un solo lector) y todas las menciones en comentarios a `_enviarDesdePadre`, `getHijoTipo`,
`_hijosRegistrados` y `registrarHijo`. Barrido final de la superficie del bus (23 nombres: objeto
`globalThis.mensajeria` + exports + alias `_S1` del padre): **cero código vivo llamando a algo que
el bus no tiene**.

### 25.6. Migrados hijo1 y hijo5, y lo que enseñaron

**hijo1** (−181 líneas) y **hijo5** (−163) hablan ya por el bus. Con ellos caen dos fallos vivos:

- **F3 resuelto.** hijo1 pausaba el audio hablándole **directamente a hijo3** — hermano a hermano, que la arquitectura prohíbe, y que no funcionó nunca. Ahora se lo pide al padre y el padre reenvía. Spec 76, que llevaba en rojo desde que se escribió, pasa a verde.
- **F2 sigue abierto** para los demás: cae al migrar la pantalla de selección, que es la que prueba el spec 75.

Tres lecciones que cuestan caras si se olvidan al migrar los cinco que faltan:

1. **Revisar TODOS los destinos, no una familia.** En hijo1 se convirtieron los `resolverIdPadre()` y se dejaron seis formas distintas sin mirar. En hijo5 había 25 destinos de cinco formas: `resolverIdPadre()`, `mensaje.origen`, `mensaje.origen || 'padre'`, una variable intermedia y un `destino: 'self'`.
2. **Que un hijo conteste al latido no basta: la respuesta tiene que LLEGAR.** Si se pierde por el camino, el padre lo da por caído a los tres latidos y —si está marcado `recuperable`— le recarga el iframe cada 15 s, en silencio. Ningún spec cubría ese viaje de vuelta; ahora sí (H1-4, H5-3).
3. **Un test que pasa con el fallo puesto es del arnés, no del código.** Ocurrió tres veces en la misma sesión (BC-13, H5-4 y CM): siempre por una aserción que mide un efecto sin filtrar por *cuál*, y el tráfico legítimo de la app la contamina. Toda aserción sobre mensajes tiene que filtrar por el contenido concreto que espera, no solo por el tipo.

### 25.7. El cambio de modo tenía dos caminos, y los dos funcionaban

Cuando un `CAMBIO_MODO` llega a un hijo antes de que termine su handshake, el hijo responde `NACK { esperarPermiso: true, modoSolicitado }`. A partir de ahí había **dos mecanismos independientes**, cada uno inventado por su lado sin saber del otro:

| | Quién recuerda | Cuándo actúa |
|---|---|---|
| **El padre** | `pendingModeChanges` (`js/app.js`) | Bucle cada 5 s con backoff, **y** el `HIJO_LISTO` de ese hijo |
| **El hijo** | `pendingCambioModo` propio | Cuando *él* se considera listo |

Y había **tres variantes** del lado del hijo para una misma situación: hijo2 lo aplicaba al recibir los datos del padre, hijo3 y hijo5 al mostrarse su UI, hijo4 al sincronizar el modo — y hijo1 **no aparcaba nada**, dependiendo solo del padre. Cuatro frames, tres comportamientos.

**Medido, con la misma receta para los cuatro:** los cuatro lo aplicaban **dos veces**. hijo2/3/4 acusaban `CONFIRMACION {tipo:'inicializacion'}` por su vía local más `ENTENDIDO`+`EFECTUADO` por la del padre. hijo5, que lo aplicaba mandándose un mensaje a sí mismo, reentraba al handler entero: 2 `ENTENDIDO`, 2 `EFECTUADO` y 3 `SOLICITAR_DATOS_PARADAS`.

**Medido también que cada camino funciona solo**: desactivando el del padre, el hijo aplica el modo; desactivando el del hijo, también.

**Resuelto**: sobrevive el del padre —es el director de orquesta, es genérico, y es el único que sirve para hijo1 y hijo6, que no aparcan—. Se retira `pendingCambioModo` de los cuatro. El NACK se queda: es lo que alimenta al padre.

**Antes de retirarlo** se arregló que el padre **se rendía en silencio**: tras 6 intentos hacía `continue` para siempre, sin borrar la entrada ni avisar. Ese orden importaba — al quedar como único camino, rendirse tiene que verse.

Riesgo residual aceptado: si el padre agota sus 6 intentos *y* el hijo se vuelve listo después, ese cambio no se aplica. Antes lo tapaba el aparcado local. Ahora al menos se grita.

Spec 84, un caso por hijo.

### 25.8. Los rojos intermitentes: causa encontrada

Durante estas sesiones aparecían 0-2 rojos por tanda completa, siempre en el navegador más lento y
**cambiando de spec entre tanda y tanda** (28, luego 40, luego 60). Que se movieran era la pista:
no era un test roto, era el arranque.

Seis hipótesis, seis refutadas midiendo: el handler no registrado (lo estaba), un `SISTEMA.ERROR`
previo bloqueando la fila (no había), el servidor degradado (1500 peticiones: 36→14 ms), el coste
del contrato del acuse (cero mensajes sin handler, cero plazos agotados), `PLAZO_MAX_HANDLER` (los
30 s eran el timeout del propio test), y el alias `estado` huérfano de Script 2 (margen real de
9,8 s sobre un tope de 10).

**Lo que lo resolvió fue conseguir reproducirlo en 2 minutos** con `--repeat-each` en vez de seguir
adivinando con tandas de 45. Con eso, dos causas reales, ambas de la misma familia —**el test actúa
mientras la app sigue trabajando**—:

1. **`gotoAndWaitForFase1` solo esperaba a FASE 1** (Script 1). Los handlers del padre los registra
   Script 2 después. Medido con diagnóstico dentro del test: `handlers: 0` en el instante del
   envío. Arreglado en el arnés esperando a `script2Listo` — protege a todos los specs, incluidos
   los que falten por escribir.
   **Esa espera no esperaba:** era `waitForFunction` con un predicado `async`, y `waitForFunction`
   no espera su promesa —una Promise es truthy—. Medido: con un predicado async que devuelve
   `false`, resuelve en 16-43 ms en los cuatro navegadores. Lo delató 28/SE-1 en la tanda del
   paso 1: `script2Listo: false` en el mismo documento, con una sola navegación y sin ninguna
   espera expirada. Ahora sondea con `page.evaluate`, que sí espera la promesa. Tanda de los
   cuatro navegadores después: 1908/1908, sin alargarse (44,5 min).
2. **`proximidadReal` lo recalcula la app sola** (`sincronizarEstadoGPSConPadre` copia encima el
   valor de `estadoMapa`, que sin GPS real es `false`). El test lo ponía una vez y se lo pisaban.

Medido: 3 fallos en 32 ejecuciones antes; 0 en 36 después.

De paso, **OR-1 podía pasar por el motivo equivocado**: afirma que el cartel no aparece, y si la
proximidad se caía pasaba igual con el bug del orden puesto. Ahora comprueba que su precondición
sigue en pie antes de afirmar nada.

### 25.9. Abierto

- **Espacios al final** ya existentes en `js/mensajeria.js` y `js/utils.js` (7 líneas con código,
  64 en blanco). Limpiados: la regla `no-trailing-spaces` ya está configurada y cubre `js/` y los HTML de la raíz.
- **F2** (spec 75), **F3** (spec 76) y **F4** (spec 77) están en verde. F2 cayó al migrar la
  pantalla de selección; F4, al separar en el `pagehide` del padre los dos viajes que ese evento
  cubre (`event.persisted === true` ahora no limpia nada). El spec 58 ya no usa un bus inventado:
  su comprobación de `origen` se mudó al 75, al camino real y con el valor exacto — ese campo lo
  pone el bus, no `utils.js`.
- **Migración**: los siete hijos y los tres nietos hablan por el bus (hijo4 `54fecbb`, hijo6 `fff4ba5`,
  hijo3 `4f30231`, hijo2 `b7bd2ad`, mapa `69a8851`, puzzle `317971d`, vídeo `49880a9`). Del padre
  está hecho un solo camino de registro (`0f10a10`, `72ebef1`), un solo repartidor (`8abb072`), sin
  escuchas sueltas (`1ef545f`), sin `ACK` (`141be18`) y sin la capa `get*` (`4d87858`). Lo que falta,
  en el orden de la Parte V ("La lavadora").

### 25.10. Paso 1 de la lavadora: identidad

- **El bus firma.** `enviarMensaje`, `enviarMensajeConConfirmacion` y `despacharLocal` ponen
  `origen = componenteId`; el que pase quien llama no viaja. Se quitaron los 248 `origen:` de los
  llamadores (padre, `js/app.js`, `js/funciones-mapa.js`, `js/controladores-padre.js`, los seis
  hijos con HTML propio y selección) y la reescritura de `enviarMensajePadre`, que queda como alias
  hasta el paso 5. `registrarControladoresDatos` ya no recibe `getPadreId`.
- **El bus comprueba.** Un mensaje de un iframe registrado cuyo `origen` no es su nombre de
  registro se descarta con aviso, una vez por tipo.
- **Sin llamadas vacías.** Un frame que envía antes de `inicializarMensajeria` no envía y avisa
  (`false`; rechazo `'no-enviado'` con acuse). Antes de sellar se comprobó el orden de arranque
  en los diez frames: todos inicializan antes de su primer envío y todos los contenedores
  registran antes de asignar `src`; el recorrido con espía no registra ningún rechazo.
- **Tests:** BC-15 a BC-17 en el spec 79; spec 93 con los siete frames que registra el padre
  (menos hijo5) haciéndose pasar por hijo5, cada uno con su control.
- **Queda para su paso:**
  - Los ocho `postMessage` a pelo del padre a un hijo (medido de nuevo en la pasada inversa del
    paso 2: eran ocho, no siete): cuatro con `getPadreId()`, dos con `CONFIG_PADRE.ID`, el latido
    de `visibilitychange` con `'padre'`, y `CHAT.ESTADO_PADRE` sin ningún `origen`. Paso 4.
  - Las firmas inventadas que nunca pasan por el bus, porque van en llamadas directas a un
    handler o en un `postMessage` del padre a sí mismo: `'padre-dev'`, `'restauracion'`,
    `'handshake-interno'`, `'restauracion-interna'`, `'funciones-mapa'`, `'padre-rescate'` y
    `manejarGPSActivar({ origen: 'cambio-modo-aventura' })`. Desaparecen en el paso 2, al
    pasar esas llamadas a `despacharLocal`, que pone el `origen` como cualquier envío.
  - `getPadreId()`/`resolverIdPadre()` como `destino`: pasos 2 y 3.
  - El `origen` dentro de `datos` de `CAMBIO_MODO` no es una firma, y no lo usa nadie:
    `_hdl_SISTEMA_CAMBIO_MODO` lo desestructura y se lo pasa a `_gestionarGpsSegunModo`, que no lo
    lee. El comentario de la reanudación que dice que lo usa `manejarCambioModo()` es falso (esa
    función solo pone el `origen` del mensaje en su prefijo de log). Paso 9.

### 25.11. Paso 2 de la lavadora: mensajes a sí mismo y un solo camino para el modo

- **Autoenvíos, por `despacharLocal`.** Fuera los tres atajos globales (`__triggerCambioParadaInterno`,
  `__triggerLlegadaDetectadaInterno`, `_vv_triggerCambioModo`) y las cinco llamadas directas a un
  handler con un mensaje fabricado a mano. El padre se manda `NAVEGACION.CAMBIO_PARADA`,
  `NAVEGACION.LLEGADA_DETECTADA`, `SISTEMA.CAMBIO_MODO` y `SISTEMA.APLICACION_INICIALIZADA` con
  `globalThis.mensajeria.despacharLocal()`, que los entrega por la misma fila que un mensaje
  llegado de fuera. Comprobado que ninguna cadena de despacho reentra sobre su propio tipo (la
  única que se repite, `CAMBIO_PARADA`→`CAMBIO_PARADA` en la progresión automática, no espera al
  anidado: no hay interbloqueo).
- **El bus rechaza el autoenvío.** Un `enviarMensaje`/`enviarMensajeConConfirmacion` con destino el
  propio frame no sale y avisa, una vez por tipo (`'no-enviado'` con acuse). Antes se perdía en
  silencio o, como mucho, avisaba de "sin padre" una sola vez.
- **Decisión 11, un solo camino para el modo.** Fuera el cerrojo `secuenciaCompleta` (padre y los
  seis frames con modo), sus NACK, `pendingModeChanges`, el handler de `SISTEMA.NACK`, el bucle de
  reintento con backoff y la resincronización a hijo2/hijo3/hijo4 al quedar todos listos. Medido
  antes: los siete frames que registra el padre ya tienen su handler de `CAMBIO_MODO` en el
  instante en que mandan `HIJO_LISTO`, en los cuatro navegadores — el cerrojo no protegía nada.
- **Tests:** spec 84 reescrito entero (`84-el-modo-llega-por-un-camino.spec.js`, un caso por frame
  con modo, más `CM-arranque`); spec 94 nuevo (sin atajos; el padre no se hace `postMessage` a sí
  mismo); BC-18 en el spec 79. Los 21 specs que usaban los atajos, migrados a `despacharLocal`.
- **Recorrido con espía (variantes):** cero autoenvíos, cero NACK, cero
  `sincronizacion_inicial`, cero handlers rotos. Solo queda el aviso ya conocido de destino
  `'hijo3'` desconocido al arrancar (paso 3 u 8, no de este paso).
- **Queda para su paso:**
  - `SISTEMA.NACK` por modo inválido (los seis frames): la rama es defensiva y hoy nadie la
    dispara (el padre solo envía `MODOS.CASA`/`MODOS.AVENTURA`), y desde este paso nadie la
    escucha tampoco — muerta por los dos lados. Paso 9.
  - `notificarError` (`js/app.js`): sin llamadores. Paso 9.
  - `datos.origen` de `CAMBIO_MODO`: sigue sin leerlo nadie (§25.10). Paso 9.

### 25.12. Paso 3 de la lavadora: destino obligatorio

- **`destino` deja de tener valor por defecto.** Antes, `undefined`/`null` se confundían con
  `'broadcast'`; ahora un envío sin `destino` no sale y avisa, una vez por tipo. `'todos'` deja
  de ser sinónimo de `'broadcast'`: no tenía ningún uso real en el proyecto.
- **Inventario completo, dos envíos reales sin `destino`** (ninguno más, en el padre, los diez
  frames y los `js/` que carga el padre):
  - `audio-hijo3.html`, el evento `pause` del reproductor — **bug real, no solo mecánico.**
    hijo3 no tiene iframes propios, así que "a todos" no llegaba a nadie: el padre nunca se
    enteraba de la pausa, `estado.audioActual.estado` se quedaba en `'reproduciendo'` desde el
    último `play`, y el recordatorio "pulse play" (§25.5c) no volvía a avisar nunca aunque el
    usuario llevara rato sin escuchar. Arreglado con `destino: 'padre'`, igual que el `play` de
    al lado. Cubierto por `tests/e2e/95-audio-estado-pausado-llega-al-padre.spec.js` (rojo con
    el `destino` que tenía, verde con el arreglo).
  - `js/app.js`, la `SISTEMA.NOTIFICACION` de `restaurarEstadoModoAnterior()` — se deja
    `destino: 'broadcast'` explícito para no cambiar su comportamiento en este paso; nadie
    escucha hoy `datos.tipo === 'restauracion_modo'` (paso 9).
- **Tests:** BC-19 y BC-20 en el spec 79 (sin destino no sale; `'todos'` ya no hace broadcast),
  spec 95 nuevo. Rojo antes, verde después.

### 25.13. Paso 4 de la lavadora: los envíos a pelo del padre, al bus

- **Los ocho `postMessage` a pelo que quedaban, migrados**, todos al mismo patrón
  (`globalThis.mensajeria.enviarMensaje`/`enviarMensajePadre` con `tipo`/`destino`/`datos`, sin
  `origen` a mano — lo pone el bus): `CHAT.ESTADO_PADRE` (hijo6-chat), `CONTROL.HABILITAR` a
  hijo2 (cierre de overlay de imagen y de vídeo, dos sitios), `AVENTURA.FINALIZADA`,
  `AVENTURA.DETENER` y `AVENTURA.INICIADA` (hijo1-opciones), y el `SISTEMA.HEARTBEAT` de
  `visibilitychange`, que dejó de recorrer `document.querySelectorAll('iframe[name]')` a mano
  y pasó a `destino: 'broadcast'` — mismo conjunto de receptores: los siete iframes con `name`
  en la marca estática se registran en el bus antes de poder recibir nada útil.
- **Código muerto encontrado y retirado, no solo migrado.** El envío de `RETO.MOSTRAR` tenía un
  `catch` con un `postMessage` de "fallback" que nunca puede ejecutarse: `enviarMensajePadre`
  (`try { return Promise.resolve(enviarMensaje(mensaje)); } catch { return
  Promise.resolve(false); }`) no lanza — y `enviarMensaje` tampoco, todos sus caminos de fallo
  devuelven `false` (paso 1). El `catch` y su `postMessage` a pelo dentro eran inalcanzables
  desde el paso 1; se retira el bloque entero, no se migra.
- **Docs corregidas.** El excerto de `CHAT.ESTADO_PADRE` en `abrirChat()`, la fila de
  `SISTEMA.HEARTBEAT`/visibilitychange y la de `CONTROL.HABILITAR` (las tres describían el envío
  "raw" que ya no existe). Hallazgo fuera de este paso pero corregido en el mismo trabajo
  (regla 8): el excerto de `enviarHijoListoConReintento` seguía mostrando
  `destino: getPadreId()` y `origen: CONFIG_HIJO.IFRAME_ID`, desfasado desde los pasos 1-3 — el
  código real ya usa `destino: 'padre'` sin `origen`.
- **Regresión real encontrada por la tanda, no por el inventario estático — corregida en el
  test, no en el código.** `tests/e2e/41-temporizador-compra-real-y-devmode.spec.js` (TW-1,
  TW-3) llama a `_iniciarTemporizadorAventura()` directamente, sin pasar por el arranque
  completo (a propósito, según su propio docstring): `hijo1-opciones` nunca quedaba registrado
  en el bus. El envío viejo (`iframeOpciones.contentWindow.postMessage` a pelo) no necesitaba
  registro — leía el `contentWindow` directo del DOM. El nuevo, por el bus, sí: sin registro,
  `enviarMensajePadre` avisa "destino desconocido" y no llega a llamar a `postMessage`, así que
  el test capturaba `undefined`. En producción esto no puede pasar: `_iniciarTemporizadorAventura`
  solo se dispara tras `SISTEMA.CAMBIO_MODO` a AVENTURA, y ese modo no se alcanza sin haber
  pasado antes por P14, que ya registra `hijo1-opciones`. Arreglo: el test registra el iframe a
  mano (`globalThis.registrarIframeHijo`) antes de invocar la función, igual que ya está siempre
  registrado en el arranque real. Verificado que ningún otro de los ocho envíos tiene un test que
  lo invoque igual de aislado (la tanda completa de Chromium no encontró más casos).
- **Tests:** Chromium 485/485 tras el arreglo de spec 41 (cambio mecánico de canal, mismo
  tipo/destino/datos; cubierto por las specs existentes de cada tipo, sin specs nuevos).

### 25.14. Paso 5 de la lavadora: un nombre para enviar, uno para registrar

- **Registro: ya estaba hecho**, de una migración anterior — comprobado antes de tocar nada.
  El padre tiene un único `registrarControladorSeguro` (definido una vez, con dedup real vía
  `__CONTROLADOR_REGISTRADOS` y captura de errores) y ~90 llamadas a él; su propio comentario ya
  documenta que los otros dos caminos que hubo eran inalcanzables. Cada uno de los diez frames
  usa un único nombre de registro consistente en todo el fichero.
- **Envío: `enviarMensajePadre` era el alias real que quedaba, y su propio comentario ya lo
  decía** ("que se queda hasta el paso 5, un solo nombre de envío"). Convivía con
  `enviarMensaje_S1` (Script 1, 22 usos) y `enviarMensaje_S2` (Script 2, 5 usos) para la misma
  operación — medido: dentro de Script 1 había 1 llamada mezclada con `enviarMensajePadre`;
  dentro de Script 2, 50. Los 51 sitios se sustituyen por el nombre local de su propio script
  (`enviarMensaje_S1`/`enviarMensaje_S2`); se retira la función y su exposición global. Un solo
  caso fuera de `codigo-padre.html` dependía del nombre global: `76-pausa-audio-enlace-externo.
  spec.js` lo llamaba directo desde el navegador — pasa a `globalThis.mensajeria.enviarMensaje`,
  la API que sí sigue expuesta siempre. `eslint.config.js` pierde la entrada de global que ya no
  existe.
- **Segundo hallazgo, en `coordenadas-hijo2.html`: `safeRegistrar`.** Los diez frames repiten el
  patrón `const registrarControladorSeguro = bus.registrarControlador` (alias puro, sin la
  deduplicación real que sí tiene el del padre) — consistente, un nombre por fichero. Solo hijo2
  tenía además `const safeRegistrar = bus.registrarControlador`, la misma asignación con otro
  nombre, usada en 2 de sus 20 registros; los otros 18 ya usaban `registrarControladorSeguro`. El
  propio comentario que queda junto a la definición ya lo señalaba ("un cuarto nombre para lo
  mismo... se queda uno"). Se unifican los 2 usos y se retira el alias.
- **Verificado y descartado como duplicación real:** los wrappers de `js/app.js`
  (`enviarMensaje`/`registrarControlador` con guarda de `mensajeriaReady`) son el único camino de
  ese módulo, no una segunda vía; `js/funciones-mapa.js` y `js/controladores-padre.js` usan cada
  uno un solo nombre propio en todo el fichero. La diferencia de nombre ENTRE ficheros distintos
  (`enviarMensaje_S1` en Script 1 del padre, `enviarMensaje_S2` en Script 2, `enviarMensaje` a
  secas en cada hijo) no es la duplicación que este paso ataca: es el alias local que exige el
  aislamiento de scope entre los 5 `<script>` del padre y entre cada frame (CLAUDE.md); dentro de
  cada scope hay uno solo.
- **Tests:** Chromium 485/485, sin specs nuevos — sustitución mecánica de identificador, misma
  función subyacente en todos los casos (confirmado: `enviarMensaje` del bus siempre devuelve
  `Promise`, nunca lanza; el alias solo añadía una envoltura redundante desde el paso 1).

### 25.15. Paso 6 de la lavadora: registro de handlers del state-manager

**Investigado antes de tocar.** `js/mensajeria.js` tiene dos funciones exportadas para registrar un
handler: `registrarControlador()` (la real: ~90 llamadas en el padre vía `registrarControladorSeguro`,
más las de los diez frames) y `registrarControladorCentral()`. Las dos acaban en el mismo sitio —
`state.controladores` de `js/state-manager.js`, vía su función `registrarControladorCentral()` —, solo
que por nombres de propiedad distintos en el objeto que expone el state-manager:
`registrarControlador()` llega por el alias `sm.registrarManejador` (que en `state-manager.js` es
literalmente `registrarManejador: registrarControladorCentral`); `registrarControladorCentral()` de
`mensajeria.js` llama a `sm.registrarControladorCentral` directamente. **Cero llamadores reales** de
`registrarControladorCentral()` de `mensajeria.js` en toda la app — ni un HTML, ni un `js/`, ni un
test. Confirmado también que ni `permanente` ni `centralizado` (los dos flags de `opciones` que
diferencian ambos caminos hoy) se leen en ningún sitio de `state-manager.js` ni `mensajeria.js`: son
datos que viajan y se guardan, pero no deciden nada. `centralizado: true` solo lo pone la propia
`registrarControladorCentral()` que se retira.

**Opciones:**

- **A. Retirar `registrarControladorCentral()` de `mensajeria.js` entera** (función, export y su
  inclusión en el objeto expuesto en `globalThis.mensajeria`). Un solo camino de registro a nivel de
  bus, coherente con que el registro ya tiene un solo camino en el padre (paso 5, comentario propio de
  `registrarControladorSeguro`: "aquí había tres, y dos no podían tomarse nunca"). Sin riesgo: cero
  llamadores.
- **B. Dejarla como alias de `registrarControlador()`** en vez de reimplementar su propio acceso al
  state-manager. Quita la duplicación de lógica pero mantiene un nombre sin ningún consumidor —
  código muerto con otro disfraz.
- **C. No tocar código, solo documentar** por qué los dos nombres de propiedad (`registrarManejador`/
  `registrarControladorCentral`) existen en el objeto del state-manager. No resuelve la duplicación,
  solo la explica.

**Elegida: A.** Es la única que cumple "un solo camino" sin dejar nada muerto detrás — el criterio que
ya ha gobernado los cinco pasos anteriores de esta lavadora. B cambiaría código para dejar exactamente
el mismo problema con otro nombre; C no arregla nada.

**Aplicado:** `registrarControladorCentral()` retirada de `js/mensajeria.js` (función, export y entrada
en el objeto expuesto). `sm.registrarControladorCentral` en `state-manager.js` no se toca: sigue siendo
el destino real, alcanzado por el único camino que queda (`registrarControlador()` → `sm.registrarManejador`).

**Queda para su paso:** los 61 `{ permanente: true }` en `codigo-padre.html` (y sus equivalentes en los
diez frames) son datos muertos — ni `state-manager.js` ni `mensajeria.js` leen ese campo en ningún
sitio. Retirarlos es una limpieza mecánica grande y sin relación con nombres/caminos: paso 9.

### 25.16. Paso 7 de la lavadora: latido y recuperación

**Investigado antes de tocar:** `js/config.js` nunca asigna `CONFIG.ID` (grep confirmado). Todos los
autos-mensajes `HEARTBEAT_START`/`PAUSE`/`ESTADO` con `destino: CONFIG_PADRE.ID` (bootstrap de Script 1,
bootstrap de Script 4, `consultarHeartbeat`, `_testHeartbeatPauseResume`) mandaban `destino: undefined`.
**Medido en runtime** (spec temporal, borrada tras confirmar): el bus resuelve `false` y avisa
"falta destino" en cada carga — desde el paso 3 (destino obligatorio) esta vía nunca llegaba a nadie,
y como `enviarMensaje` no lanza, los `catch`/fallback-directo que la rodeaban tampoco se disparaban
nunca. El camino directo ya existía y funcionaba (`_activarHeartbeatAventura`/`_transicionarAModoCasa`,
llamadas por `_hdl_SISTEMA_CAMBIO_MODO`, que cubre tanto la activación real como la reanudación).

**Aplicado:** el bootstrap de Script 1 y de Script 4 pasan a llamada directa. Retirados los 3 handlers
de Script 4 sobre sí mismo (`HEARTBEAT_START`/`PAUSE`/`ESTADO`), el broadcast a `hijosCriticos` (Script 1
y Script 4) y sus 5 handlers en los hijos (audio-hijo3, boton-casa-hijo5, chat-hijo6,
coordenadas-hijo2, retos-hijo4) — `__HEARTBEAT_ACTIVO` no lo leía nadie (grep confirmado). Las
constantes `HEARTBEAT_START`/`PAUSE`/`ESTADO` se retiran de `js/constants.js` por quedar sin uso.
`consultarHeartbeat()` pasa a llamar a `state-manager.getHeartbeat()` directo; `_testHeartbeatPauseResume()`
dispara `CAMBIO_MODO` por `despacharLocal` (decisión 11) en vez del envío roto.

**Recuperación de hijo2:** `_vv_afterHijoListo('hijo2')` mandaba `NAVEGACION.CAMBIO_PARADA` en crudo
directo al iframe, saltándose `_hdl_NAVEGACION_CAMBIO_PARADA` — el único otro sitio que cambia de
parada (comentario propio en el código), que además actualiza `estado.paradaActual` del padre y
precarga audio/vídeo/imagen. Pasa a `despacharLocal`, el mismo camino que cualquier otro cambio real.
hijo3/hijo4/hijo1 no tenían este problema: su entrega normal ya es un envío directo, igual que su
recuperación.

**Verificado:** spec 96 nueva (LH-1/RC2-1 en rojo antes del arreglo, confirmado; LH-2 de control ya en
verde); specs 78 y 89 (89 pierde su exclusión `DE_SCRIPT_4`, que su propio comentario ya anticipaba);
82 specs de contrato/registro/handshake sin romperse; recorrido con espía sin hallazgos nuevos.
Cascada de ~30 menciones corregida en `docs/GUIA-COMPLETA.md`.

### 25.17. Paso 8 de la lavadora: un solo camino donde hoy hay dos (✅ cerrado)

Diez duplicaciones bajo un mismo paso — mucho más grande que los anteriores. Se registra el avance
sub-ítem a sub-ítem, cada uno con su propio commit, en vez de un solo commit al final.

**8.1 — Coordenadas pedidas dos veces por elemento (✅ cerrado).** `DATOS.COORDENADAS_PARADAS_REQUEST`
es uno de los 5 envíos con acuse del proyecto (§3.2): el `return` del handler de hijo2 ya entrega el
resultado por `enviarMensajeConConfirmacion`, camino que usan con éxito `_solicitarParadaAHijo2()` y
`solicitarCoordenadasAHijo2()`. `solicitarCoordenadasHijo()` (fallback de `btn-ubicacion`) no lo usaba:
montaba su propio `pedidoId` + `Map` de espera + handler correlador para un
`DATOS.COORDENADAS_PARADAS_RESPONSE` que hijo2 mandaba ADEMÁS "para compatibilidad". **Medido:** en un
boot limpio, la vía del `pedidoId` se quedaba colgada hasta su timeout mientras
`enviarMensajeConConfirmacion` resolvía al instante — el "segundo camino" no solo era redundante, no
funcionaba. Reescrito `solicitarCoordenadasHijo()` para usar `enviarMensajeConConfirmacion` directo
(mismo `timeoutMs` configurable); retirados el `pedidoId`, el `Map`, `_handleCoordenadasParadasResponse`
y el envío explícito en hijo2 (éxito y error). Constante `COORDENADAS_PARADAS_RESPONSE` retirada de
`js/constants.js` por quedar sin uso. Verificado: spec 97 nueva (CO-2 en rojo antes del arreglo,
confirmado con espía de `postMessage`); specs 13/20/21/32 (GPS/fallback de ubicación) sin romperse;
recorrido con espía sin hallazgos nuevos.

**8.2 — Lista de paradas de hijo5 desde dos fuentes (✅ cerrado).** Dos sitios de empuje
(`distribuirDatosAventura()` en activación real; `_enviarRespuestaParadasHijosRest()` en
reanudación) construían a mano la lista desde `__vv_DATOS_AVENTURAS[aventura]['coordenadas-hijo2.html']
.coordenadas` — el fichero crudo de coordenadas, pensado para el mapa de hijo2, que incluye
entradas `tipo: "referencia"` (Torres de Serranos, Palacio de los Borgia...). El camino de
petición (`SOLICITAR_DATOS_PARADAS`, cuando hijo5 se autoconsulta) usa en cambio
`normalizarParadas_S1(DATOS_PADRE[aventura][idioma].elementosIDpadre)` — la fuente que el propio
comentario del handler ya llamaba "primaria" y que nunca mezcla entradas `referencia`. hijo5
filtra `tipo` fuera de `['inicio','parada','tramo']` al generar botones, así que el síntoma no
era visible, pero las dos fuentes podían divergir sin que nada lo detectase — y de hecho
`DATOS_PADRE` no tiene `lat`/`lng` mientras la fuente cruda sí, un campo (`coordenadas`) que
`_esParadaValida()` en hijo5 revisó y confirmó **muerto**: siempre devuelve `true` pase lo que
pase (comprobado leyendo la función completa, no solo su nombre). Los tres sitios pasan ahora
por `normalizarParadas_S1`/`normalizarParadas_S2(DATOS_PADRE...)` — se añadió el alias en Script 2
(`js/utils.js` ya se importaba ahí). Verificado: spec 98 nueva (PD-1 en rojo antes del arreglo,
confirmado con espía de `postMessage`: 3 entradas `referencia` llegaban a hijo5); 36 specs de
handshake/reanudación/recuperación sin romperse; recorrido con espía sin hallazgos nuevos.

**8.3 — `ACTUALIZAR_ESTADO` doble por lectura GPS (✅ cerrado).** `procesarPosicionGPSParaAventura()`
(`js/funciones-mapa.js`) mandaba a hijo2, para la MISMA lectura GPS, dos mensajes
`NAVEGACION.ACTUALIZAR_ESTADO` separados cuando la distancia al destino era ≤50m: uno con
distancia/tolerancia/coordenadas, y otro aparte con solo `{ ubicacionActiva: false }`. El handler
de hijo2 (`_aplicarDatosEstado`) fusiona cada campo por separado (`if (campo !== undefined)
estadoComponente.campo = campo`), así que un único mensaje con ambos produce el mismo estado
final — lo único que costaba el segundo mensaje era una segunda pasada completa de
`actualizarEstadoBotones()`/detección de llegada. `docs/GUIA-COMPLETA.md` ya describía un solo
`ACTUALIZAR_ESTADO` conceptual por lectura en todos sus sitios: no hacía falta corregir la guía,
solo el código para que la cumpliera. Verificado: spec 99 nueva (AE-1 en rojo antes del arreglo,
confirmado: 2 mensajes por la misma lectura); 51 specs de GPS/llegada/tramos sin romperse
(incluye CM-2, que ya comprobaba "cero ACTUALIZAR_ESTADO en CASA" y sigue en verde); recorrido
con espía sin hallazgos nuevos.

**8.4 — Modo por cuatro mecanismos (✅ cerrado).** Primer hallazgo, descartado tras medir: `estado`
(Script 1) y `globalThis.estadoPadre` son el mismo objeto por referencia
(`globalThis.estadoScript1` es un getter que devuelve `estadoPadre`; `var estado =
globalThis.estadoScript1`) — todas las lecturas `globalThis.estadoPadre?.modo?.actual` que no
tienen fallback a `estado?.modo?.actual` NO son un segundo mecanismo muerto: leen el mismo campo
por otro nombre. Confirmado con una lectura GPS real (`estadoPadreModo === estadoModo ===
'aventura'` tras un `CAMBIO_MODO`).

**El hallazgo real, medido:** cada `CAMBIO_MODO` real (no reanudación, no resincronización)
ejecuta `funcionesMapa.limpiarPorEstado({resetCompleto:true})` **dos veces** — confirmado con
logs (`"Reset completo ejecutado para modo aventura"` aparece 2 veces por un solo cambio). Los
dos caminos:

- `_hdl_SISTEMA_CAMBIO_MODO` (padre) llama primero a `funcionesMapa.manejarCambioModoMapa()`, que
  fija `estadoMapa.modo`, llama a `limpiarPorEstado({resetCompleto: modoAnterior !== modo})` y
  resetea la vista del mapa (`setMapView` al centro/zoom por defecto).
- Justo después llama a `manejarCambioModo()` (`js/app.js`), que internamente llama a
  `limpiarRecursosPorModo()` — esta función resetea `estado.paradaActual/tramoActual/elementoActual`
  y `estado.gps.posicionUsuario` (trabajo real, único, no duplicado en ningún otro sitio) **y
  además** vuelve a llamar a `funcionesMapa.limpiarPorEstado({resetCompleto:true})` — el mismo
  vaciado de marcadores/polylines/rutas que `manejarCambioModoMapa()` ya había hecho.

**Por qué no es tan simple como quitar una de las dos llamadas:** medido que NO son iguales en
todos los casos:

- **Resincronización** (mismo modo, `js/app.js` línea ~551 corta antes de
  `limpiarRecursosPorModo`): solo corre la llamada de `manejarCambioModoMapa()`
  (`resetCompleto:false`, más ligera). Si se quitara esa llamada, la resincronización se quedaría
  sin ninguna.
- **Reanudación** (`restaurado:true`): `_hdl_SISTEMA_CAMBIO_MODO` llama a `sincronizarModoMapa()`
  en vez de `manejarCambioModoMapa()` (comentario propio: evita el salto de cámara mientras
  `_restaurarProgresoRest()` dibuja el elemento restaurado) — `sincronizarModoMapa()` NO llama a
  `limpiarPorEstado` en ningún momento. Si se quitara la llamada de `limpiarRecursosPorModo()`, la
  reanudación se quedaría sin ninguna, con riesgo real de marcadores de la sesión anterior
  visibles tras reanudar.
- **Cambio real** (el único caso con las dos llamadas): las dos ejecutan con `resetCompleto:true`
  — es aquí, y solo aquí, donde se duplica.

**Decisión:** en `limpiarRecursosPorModo()` (`js/app.js`), la llamada a
`funcionesMapa.limpiarPorEstado()` pasa a ejecutarse solo cuando `mensaje.datos.restaurado ===
true` (el único caso en que nadie más limpió el mapa). Para el cambio real, `manejarCambioModoMapa()`
sigue siendo quien limpia — ya se ejecuta antes en la misma secuencia. La resincronización no se
toca: nunca llegaba a `limpiarRecursosPorModo()`.

**Aplicado:** `manejarCambioModo()` extrae `restaurado` de `mensaje.datos` y lo pasa a
`limpiarRecursosPorModo(estado, modo, opciones, restaurado)`; esta última solo llama a
`funcionesMapa.limpiarPorEstado()` cuando `restaurado === true`. El resto de la función (reset de
`estado.paradaActual/tramoActual/elementoActual` y `estado.gps.posicionUsuario`) no cambia: corría
sin duplicar y sigue igual. `docs/GUIA-COMPLETA.md` nunca afirmó que la limpieza se ejecutara dos
veces en un cambio real — no hizo falta corregirla. Verificado: spec 100 nueva (LU-1 en rojo antes
del arreglo, confirmado: 2 limpiezas por el mismo cambio real; LU-2 y LU-3 de control, ya en verde
antes del arreglo, confirman que reanudación y resincronización no se tocan); 41 specs de
modo/reanudación/concurrencia/GPS sin romperse; recorrido con espía sin hallazgos nuevos.

**8.5 — `SISTEMA.NOTIFICACION` con dos eventos, uno solo con consumidor (✅ cerrado).**
`_hdl_APLICACION_INICIALIZADA` mandaba `SISTEMA.NOTIFICACION {evento:'aplicacion_lista'}` a TODOS
los `hijosInicializados` al terminar el arranque (hijo2+hijo3+hijo4 con handshake completo).
**Medido leyendo el cuerpo completo de cada handler del proyecto:** solo hijo2 y hijo4 registran
un handler para `SISTEMA.NOTIFICACION`, y ese handler solo actúa si `evento === 'PENDING_INICIADO'`
— cualquier otro valor, incluido `'aplicacion_lista'`, entra, se comprueba y se descarta sin hacer
nada. `ensurePending()` mandaba además ese mismo `PENDING_INICIADO` a hijo3, que no tiene NINGÚN
handler de `SISTEMA.NOTIFICACION` — ese envío tampoco tenía consumidor (hijo2 y hijo4 sí lo
consumen: cada uno registra su propio handler y actúa sobre `evento === 'PENDING_INICIADO'`, ninguno
de los dos se toca). En la misma pasada, mismo patrón: `_broadcastActivacion()` (llamado desde
`_hdl_SELECCION_AVENTURA_ACTIVADA` tras distribuir datos) mandaba `SISTEMA.NOTIFICACION
{evento:'AVENTURA_ACTIVADA'}` a broadcast — mismo resultado, ningún handler del proyecto reacciona a
ese valor de `evento`. Se retiró el broadcast `aplicacion_lista` en `_hdl_APLICACION_INICIALIZADA`
(queda puramente informativo: registra el evento y ya), el envío a hijo3 en `ensurePending()`, y
`_broadcastActivacion()` completo junto con su único punto de llamada. Los dos eventos con
consumidor real — `PENDING_INICIADO` hacia hijo2 y hacia hijo4 — no se tocan. Verificado: spec 101
nueva (NO-1 y NO-2 en rojo antes del arreglo, confirmado con espía de `postMessage` en
hijo2/hijo3/hijo4 escuchando en directo; NO-3 de control, ya en verde antes del arreglo, confirma que
`PENDING_INICIADO` hacia hijo2 sigue llegando); spec 94 (AE-2) usaba el broadcast retirado solo como
señal de temporización
para saber que el arranque había terminado — no por su contenido — así que se adaptó para esperar
la condición real subyacente (`estado.hijosInicializados.has(id)` de hijo2/hijo3/hijo4) en vez del
broadcast ya inexistente; recorrido con espía sin hallazgos nuevos.

**Queda para más adelante, fuera de este sub-ítem:** la misma investigación encontró otros tres
envíos de aviso sin consumidor — `cambio_modo_iniciado`, `cambio_modo_completado` y
`restauracion_modo` (`js/app.js`: `notificarCambioModoInminente`, `notificarCambioModoCompletado`,
`restaurarEstadoModoAnterior`) — confirmados muertos tanto por lectura de código como por la propia
`docs/GUIA-COMPLETA.md`, que ya documenta correctamente "Ningún hijo actual tiene handler para
ellos" (no hizo falta corregir la guía). No se tocan en este sub-ítem: a diferencia de los
broadcasts de arriba (fire-and-forget, aislados), estos son pasos inline, `await`-eados, con guarda
de timeout de 15s, dentro del mismo pipeline central de cambio de modo que el sub-ítem 8.4 ya tocó
una vez esta sesión — superficie de riesgo mayor y distinta, se aparca como hallazgo apuntado, no
arreglado (paso 9, "lo muerto").

**8.6 — Carga de datos de hijo2 empujada y pedida (✅ cerrado, investigado — sin duplicación real).**
Coordenadas y textos llegan a hijo2 por dos caminos nombrados así en el checklist: `distribuirDatosAventura()`
empuja `DATOS.CARGAR_COORDENADAS`/`DATOS.CARGAR_TEXTOS` cuando hijo2 ya está en `hijosInicializados`
en el momento de la activación; si no lo está, se limita a loguear que hijo2 los pedirá él mismo. El
propio hijo2, 3 segundos después de `PADRE_CONFIRMA_HIJO_LISTO`, comprueba si
`globalThis.__vv_coordenadasAventura`/`__vv_textosAventura` siguen vacíos y, solo entonces, manda
`DATOS.SOLICITAR_COORDENADAS`/`DATOS.SOLICITAR_TEXTOS` — que el padre responde reenviando el mismo
`CARGAR_*` (`js/controladores-padre.js`). **Investigado a fondo, con medición en vivo, antes de tocar
nada (regla 6/9):** un spec desechable escuchó en la ventana de hijo2 durante una activación real
completa (`distribuirDatosAventura('Aventura1','es')` tras cargar los datos diferidos) y esperó más
de los 3 segundos del temporizador de hijo2 — solo llegaron los dos `CARGAR_*`, nunca un
`SOLICITAR_*`: el empuje llega dentro del margen y el temporizador de respaldo no se dispara. Se
revisó también si algún mecanismo del padre reintenta el empuje cuando hijo2 no está listo en el
momento de `distribuirDatosAventura()` (la rama `else` que solo loguea) — no existe: `__pendingDistribucion`
(usado en otros 3 sitios) cubre un fallo distinto (la función `distribuirDatosAventura` aún no
definida), no la falta de hijo2 en `hijosInicializados`. En ese caso el único camino de recuperación
es el temporizador de hijo2, y es correcto: no hay un segundo emisor compitiendo con él. **Veredicto:
no es la misma clase de hallazgo que 8.1-8.5** — ahí dos mecanismos competían o uno estaba muerto;
aquí hay un único camino primario (empuje) con un único camino de respaldo (petición), mutuamente
excluyentes por diseño y confirmados así por medición, no solo por lectura. No se ha tocado código:
no hay nada que unificar. Se revisó de paso `NAVEGACION.SOLICITAR_COORDENADAS`
(`js/funciones-mapa.js` → hijo2), que a primera vista suena a lo mismo por el nombre — es un
mecanismo distinto y ya de un solo camino (§9.11/manejarCambiarParada: caché local del padre primero,
esta consulta a hijo2 solo como "Ruta 2" cuando la parada no está en caché), sin relación con la
carga de coordenadas/textos en bloque.

**8.7 — Audio a hijo3 por cuatro caminos, solo uno reforzado (✅ cerrado).** `AUDIO.REPRODUCIR_REQUEST`
llega a hijo3 desde cuatro sitios de `codigo-padre.html`: (1) `_solicitarAudioParaParada()` —
progresión normal, disparada por `NAVEGACION.CAMBIO_PARADA` — que pasa por
`_enviarAudioRequestConReintento()`: exige un ACK real de hijo3 vía `enviarMensajeConConfirmacion`
y reintenta hasta `MAX_REINTENTOS_ENVIO_AUDIO` veces; (2) `solicitarAudioAHijo3()`, usada solo desde
`_solicitarAudioRest()` en la reanudación de sesión; (3) el bloque `hijoId === 'hijo3'` de
`_vv_afterHijoListo()`, que restaura el audio en curso tras una recarga de hijo3; y (4)
`DATOS.SOLICITAR_AUDIOS` (`js/controladores-padre.js`), dirección inversa — hijo3 pide un audioId
concreto tras un cache-miss local — que no compite con los otros tres y no se toca. El comentario
que ya vivía junto al camino 1 explica por qué existe la confirmación: "sin confirmación, un mensaje
perdido (iframe momentáneamente no listo, postMessage descartado) dejaba pending.audio en false para
siempre, sin ninguna señal". Los caminos 2 y 3 entregaban el mismo `AUDIO.REPRODUCIR_REQUEST`, al
mismo hijo3, por el mismo `postMessage`, con el mismo riesgo descrito — pero con un `enviarMensaje`
liso, sin esa protección: comprobado leyendo el cuerpo completo de ambas funciones, no solo su
nombre. **Distinto de 8.6:** ahí la lectura estática sugería duplicación y la medición en vivo la
descartó; aquí la lectura estática por sí sola ya establece la asimetría (dos de los tres emisores
de empuje carecen de una protección que el tercero sí tiene y documenta como necesaria) — no hacía
falta reproducir el fallo en vivo para justificar unificar los tres al mismo primitivo, igual que en
8.1. Aplicado: `solicitarAudioAHijo3()` y el bloque de `_vv_afterHijoListo()` para hijo3 llaman ahora
a `_enviarAudioRequestConReintento()` en vez de a un `enviarMensaje` directo, con el mismo payload que
antes. `DATOS.SOLICITAR_AUDIOS` no se toca: es la dirección de petición, no de empuje. Verificado:
spec 102 nueva (AR-1 y AR-2 en rojo antes del arreglo, confirmado: ninguna de las dos funciones
llamaba a `enviarMensajeConConfirmacion`); 40 specs de audio/reanudación/recuperación (specs 39, 40,
44, 46) sin romperse; 94 specs de audio/hijo3/reanudación/recarga/reconexión en chromium sin
romperse; recorrido con espía sin hallazgos nuevos.

**8.8 — Dos constructores de `RETO.MOSTRAR` (✅ cerrado).** El mensaje se construye en dos sitios:
`_enviarRetoMostrar()` (llamado desde `_hdl_RETO_SOLICITAR`, el camino normal cuando hijo4 pide
reto) y, a mano, dentro de `_procesarResultadoReto()` — la rama "queda un siguiente reto en la cola
de la misma parada" (funcionalidad de varios retos por parada, hoy sin ninguna entrada real en los
datos, ver `project_varios_retos_por_parada.md`). Ambos resuelven el `retoData` de la misma forma
(mismo `cargarRetos()` + búsqueda por id), pero solo el primero actualizaba
`_snapshotRecuperacion.retoActual` antes de enviar. El propio `_hdl_RETO_COMPLETADO` pone ese mismo
campo a `null` incondicionalmente nada más entrar, con un comentario que asume que un reto
completado siempre cierra la parada ("ya no debe restaurarse si hijo4 se recarga después") — falso
cuando queda un reto siguiente en cola: hay un reto nuevo activo, y el segundo constructor no lo
registraba. Consecuencia medida: una recarga de hijo4 justo en ese instante no restauraba nada (el
guard `snap.retoActual` en `_vv_afterHijoListo()` fallaba sobre `null`), en vez de reenviar el reto
correcto. Aplicado: `_enviarRetoMostrar()` acepta ahora un cuarto parámetro `contexto` (por defecto
`'manual'`, el valor que ya usaba su único llamador); `_procesarResultadoReto()` llama a esa misma
función con `'secuencial'` en vez de construir el mensaje a mano — repuebla el snapshot que
`_hdl_RETO_COMPLETADO` acababa de vaciar. Verificado: spec 103 nueva (RM-1 ya en verde antes del
arreglo — el mensaje en sí siempre llegó bien; RM-2 en rojo antes del arreglo, confirmado: una
recarga de hijo4 con un siguiente reto en cola no restauraba nada, y en verde tras unificar los dos
constructores); GUIA-COMPLETA.md corregida (línea ~11624, tabla de `_snapshotRecuperacion`, que
describía la limpieza en `RETO.COMPLETADO` sin mencionar la repoblación cuando queda reto
siguiente).

**8.9 — Respuestas dobles: por acuse y por mensaje aparte (✅ cerrado).** De los 5 envíos con acuse
del proyecto (`solicitarCoordenadasHijo`/`_solicitarParadaAHijo2` → hijo2, `_enviarAudioRequestConReintento`
→ hijo3, `CHAT.RESCATE_SOLICITADO` → padre, `NAVEGACION.GPS.ACTIVAR` → padre, `RETO.COMPLETADO` →
padre), revisados todos, solo uno tenía el patrón: el controlador de `AUDIO.REPRODUCIR_REQUEST` en
`audio-hijo3.html` contestaba dos veces a la misma petición — con el `return` que dispara el acuse
automático de `enviarMensajeConConfirmacion` (necesario) y ADEMÁS con un `AUDIO.REPRODUCIR_RESPONSE`
explícito a `'padre'`, en las dos ramas (éxito y `catch`). El handler que lo recibía
(`_hdl_AUDIO_REPRODUCIR_RESPONSE`) ya no escribía ningún estado — su propio comentario decía que
`estado.audioActual` lo fija únicamente `AUDIO.ESTADO_ACTUALIZADO` —, así que el segundo mensaje no
tenía consumidor real, solo logging. De paso, verificado contra el código actual de `js/mensajeria.js`
(`_ejecutarYContestar`) que la condición documentada para el acuse ("solo se emite si el handler
devuelve un valor distinto de `undefined`", atribuida a un `messagingAdapter`/`_enviarAutoConfirmacion`
que ya no existe en el proyecto — mismo hallazgo del paso 6) es **falsa**: el acuse se manda siempre
que `mensaje.requiereConfirmacion` sea cierto, sea cual sea el valor de retorno, incluido
`undefined`; sin handler registrado en absoluto es el único caso real en que no llega nunca. Los
otros 4 senders confirmados limpios: hijo2 (ya unificado en 8.1), `CHAT.RESCATE_SOLICITADO` y
`RETO.COMPLETADO` devuelven directamente sin ningún envío aparte, y `NAVEGACION.GPS.ACTIVAR` solo
manda un `SISTEMA.ERROR` explícito en sus dos ramas de fallo — no un segundo mensaje de éxito
duplicando el acuse. Aplicado: retirados los dos `enviarMensaje({tipo: AUDIO.REPRODUCIR_RESPONSE})`
de `audio-hijo3.html`, `_hdl_AUDIO_REPRODUCIR_RESPONSE` y su registro en `codigo-padre.html`, y la
constante en `js/constants.js`. Verificado: spec 104 nueva (RR-1 y RR-2 en rojo antes del arreglo,
confirmado con espía de `postMessage` en ambas ramas); spec 95 (AE-2, ya existía) usaba el mensaje
retirado solo como señal de temporización para saber cuándo hijo3 había cargado el audio — se
adaptó a la condición real (`audioPlayer.src`); 214 specs de audio/hijo3/hijo2/reto/coordenadas/
GPS/reanudación en chromium sin romperse; recorrido con espía sin hallazgos nuevos. GUIA-COMPLETA.md
corregida en 8 sitios (tabla de mensajes hijo3→padre ×2, la subsección completa de
`AUDIO.REPRODUCIR_RESPONSE` con sus dos callouts sobre el acuse, la secuencia numerada de
reproducción, dos tablas de catálogo, y la tabla de cruce de módulos) — la explicación correcta del
acuse (siempre se manda si `requiereConfirmacion`, no depende del valor de retorno) se conservó,
reubicada junto a `AUDIO.REPRODUCIR_REQUEST`.

**8.10 — Avisos de error/NACK que el padre manda a hijos que no los escuchan (✅ cerrado, último
sub-ítem del paso 8).** El padre manda `SISTEMA.NACK`/`SISTEMA.ERROR` a `mensaje.origen` en cinco
sitios cuando una petición puntual no puede atenderse: `_hdl_RETO_SOLICITAR` → `NACK` a hijo4 (sin
datos de aventura; sin reto que mostrar), `_hdl_RETO_COMPLETADO` → `ERROR` a hijo4 en su `catch`, y
`_hdl_NAVEGACION_GPS_ACTIVAR` → `ERROR` a hijo2 (modo no es AVENTURA; `catch` de `activarGPS()`).
Comprobado leyendo el fichero completo de cada hijo: ni `retos-hijo4.html` ni `coordenadas-hijo2.html`
registraban un handler para `SISTEMA.NACK` ni `SISTEMA.ERROR` — el aviso de un fallo real (botón sin
reto que mostrar, GPS rechazado) se perdía sin ningún rastro, ni siquiera un log. `boton-casa-hijo5.html`
sí tiene un handler mínimo para `SISTEMA.ERROR` (solo registra el fallo en el log); se aplicó el
mismo patrón a los otros dos, sin inventar UI nueva (mostrar un aviso visible al usuario sería una
mejora de UX distinta, fuera de "un solo camino"). De paso, dos correcciones a GUIA-COMPLETA.md
encontradas mientras se verificaba el estado real de `SISTEMA.NACK`: §10.15 y §10.18 afirmaban que
`js/app.js` procesa `SISTEMA.NACK` "solo si `esperarPermiso === true`" con un "retry loop
exponencial" — ese campo y ese mecanismo no existen en ningún fichero del proyecto (`grep` global →
0 coincidencias); es documentación del protocolo de reintento de `CAMBIO_MODO` retirado en el paso 2
de la lavadora (decisión 11), que el propio §10.11 ya describe correctamente como retirado — las dos
tablas de §10.15/§10.18 no se habían actualizado a la vez. Corregidas ambas para reflejar el estado
real: el uso hijo→padre está muerto (§10.11), el uso padre→hijo4 es el que se acaba de cerrar aquí.
Apuntado sin arreglar: `_hdl_NAVEGACION_GPS_ACTIVAR` deja que el acuse de `enviarMensajeConConfirmacion`
se resuelva con éxito (`undefined`) incluso cuando rechaza la activación por modo incorrecto —
hijo2 muestra "GPS activado" en ese caso aunque el padre lo haya rechazado. Corregirlo exigiría que
el handler devuelva `{exito:false, ...}` en sus ramas de rechazo y que hijo2 lo compruebe antes de
dar el éxito por hecho — cambio de comportamiento visible, no una simple limpieza de duplicado;
mayor riesgo y fuera del alcance de "un solo camino". Verificado: spec 105 nueva (NE-1/NE-2/NE-3 en
rojo antes del arreglo, confirmado con `tieneControlador`; NE-4 de control, ya en verde, confirma
que el nuevo handler no rompe nada más); 123 specs de hijo2/hijo4/reto/GPS/coordenadas en chromium
sin romperse; recorrido con espía sin hallazgos nuevos.

**Con 8.10 cerrado, el paso 8 completo queda cerrado.** Las decisiones 12, 13 y 14 anticipadas por
el plan no llegaron a materializarse como decisiones separadas: cada sub-ítem se resolvió aplicando
directamente el principio ya establecido (un solo camino, la protección donde ya existe en el
camino hermano, o "investigado y no hace falta tocar nada" cuando la medición lo desmintió) sin
que ninguno abriera una bifurcación de diseño genuina que necesitara registrarse aparte.

---

### 25.18. Paso 9 de la lavadora: lo muerto (✅ cerrado)

**`DATOS.CARGADOS_RECIBIDO` (✅ cerrado).** Fase 3 de un patrón bidireccional sin destinatario real:
hijo2 confirma que cargó coordenadas/textos (`DATOS.COORDENADAS_CARGADAS`/`DATOS.TEXTOS_CARGADOS`),
y el padre le respondía ADEMÁS con `DATOS.CARGADOS_RECIBIDO` — una confirmación de la confirmación.
El controlador de hijo2 para ese mensaje, leído completo, solo hacía `logger.info(...)`: no escribe
estado, no desbloquea nada. Retirados los dos envíos en `codigo-padre.html`
(`_hdl_DATOS_COORDENADAS_CARGADAS`, `_hdl_DATOS_TEXTOS_CARGADOS`), el controlador en
`coordenadas-hijo2.html`, y la constante en `js/constants.js`. De paso, GUIA-COMPLETA.md tenía una
fila en la tabla de controladores de **hijo3** afirmando que hijo3 también maneja
`DATOS.CARGADOS_RECIBIDO` ("confirma recepción de audios") — comprobado con `grep` en
`audio-hijo3.html`: 0 coincidencias, esa fila nunca fue cierta, ni antes de este cambio. Corregidas
7 menciones en total (2 tablas de catálogo de hijo2, 1 fila falsa de hijo3, 1 diagrama mermaid, la
subsección completa con su tabla y nota de "protocolo 3 fases", y la tabla de cruce de módulos).
Verificado: spec 106 nueva (rojo antes del arreglo, confirmado con espía de `postMessage`: los dos
subtipos —COORDENADAS y TEXTOS— llegaban); 138 specs de hijo2/hijo3/hijo4/coordenadas/carga/datos/
audio en chromium sin romperse; recorrido con espía sin hallazgos nuevos.

**`SISTEMA.ACK` (✅ cerrado, docs-only).** Al revisar "confirmaciones informativas" (el otro término
del mismo ítem de §23), se encontró que `SISTEMA.ACK` no existe en absoluto en el código actual:
`grep` global sobre todo `*.html`/`js/*.js` → 0 coincidencias, y no hay entrada `ACK` en el objeto
`SISTEMA` de `js/constants.js` (solo `NACK` y `CONFIRMACION`). El propio código ya lo confirma con
un comentario en `_hdl_SISTEMA_HIJO_PREPARADO` (codigo-padre.html): *"Aquí había un ACK al
HIJO_PREPARADO que ningún hijo usaba para nada... Un solo acuse, el del bus (§3.7 del estudio)"* —
es decir, se retiró del código en una sesión **anterior a esta lavadora**, pero GUIA-COMPLETA.md
nunca se actualizó: describía `SISTEMA.ACK` como mecanismo vivo en **15 ubicaciones** distintas (tres
tablas de catálogo de mensajes con filas repetidas por hijo, la descripción de
`enviarMensajeConConfirmacion` diciendo que espera "SISTEMA.ACK" en vez de `SISTEMA.CONFIRMACION`,
una subsección completa `**SISTEMA.ACK** (padre → hijo)` para un supuesto acuse "cosmético" a
ENTENDIDO/EFECTUADO, la fila de handshake de `HIJO_PREPARADO` en dos sitios, una línea del trazado
temporal de arranque, una fila sobre el handler de `PENDING_INICIADO` en hijo4 que afirmaba que
"solo acusa recibo con SISTEMA.ACK" cuando en realidad solo hace `logger.info(...)`, y la tabla de
cruce de módulos). Sin cambio de código — nada que borrar, ya estaba borrado. Corregidas las 15
menciones: 14 eliminadas o reescritas para reflejar el mecanismo real (`SISTEMA.CONFIRMACION`, el
acuse único del bus), y una nueva nota explicativa en el handshake de `HIJO_PREPARADO` que cuenta
qué había y por qué se retiró, citando el propio comentario del código. No hace falta spec: no hay
comportamiento que verificar, solo texto que ya no describía nada real.

**El segundo cargador de hijo4 (✅ cerrado).** `globalThis.diagnosticarHijo4()` era una herramienta
de consola sin ningún llamador en el proyecto (`grep` global → 0 referencias fuera de su propia
definición). Su paso 3 reasignaba `hijo4Element.src` directamente para "arreglar" un hijo4 sin
cargar — un segundo camino de carga, distinto de `_cargarSingleIframe()`/`_cargarUnIframeHijo()`/
`_cargarSoloIframeActivacion()`, que no llamaba a `registrarIframe()`. Medido con un spec desechable
antes del arreglo: tras invocarla, hijo4 cargaba de verdad (`src` cambiaba a la URL real) pero
`mensajeria.getIframesRegistrados()` no lo incluía — quedaba mudo para el bus. La propia
herramienta, pensada para diagnosticar un hijo4 roto, lo habría dejado en un estado peor si alguna
vez se hubiera usado de verdad. Retirada la función completa (dev-console-only, sin test ni doc que
la mencionara). Verificado: spec 107 nueva (confirma que `globalThis.diagnosticarHijo4` ya no
existe); 52 specs de hijo4/reto/puzzle en chromium sin romperse; recorrido con espía sin hallazgos
nuevos.

**El resto de F4 (✅ cerrado).** El padre ya separaba los dos viajes de `pagehide` en su propio
`_limpiarPagehide` (cierre real vs. guardado en la cache de atrás bfcache, `event.persisted`;
spec 77). Pero en la MISMA ventana del padre, `js/app.js` y `js/funciones-mapa.js` registraban su
PROPIO listener de `pagehide`, cada uno con su propia "limpieza agresiva de globales", y ninguno
de los dos miraba `persisted`: borraban `globalThis.estado` (app.js) y `globalThis.funcionesMapa`
+ destruían la instancia del mapa (funciones-mapa.js) igual si la página se cerraba de verdad que
si el navegador solo la congelaba para la cache de atrás. El spec 77 no lo detectaba porque solo
cuenta iframes. Medido con los mismos dos eventos sintéticos que usa el spec 77
(`PageTransitionEvent('pagehide'/'pageshow', {persisted:true})` — los cuatro navegadores de
Playwright nunca restauran de verdad desde bfcache): antes del arreglo, `globalThis.estado` y
`globalThis.funcionesMapa` quedaban borrados tras el viaje. Aplicado el mismo patrón que
`_limpiarPagehide`: ambos listeners aceptan ahora el evento y devuelven pronto si
`evento?.persisted === true`, sin tocar nada. Verificado: spec 108 nueva (AJ-1 y AJ-2 en rojo antes
del arreglo, confirmado: los dos globales desaparecían; AJ-3 de control, ya en verde antes del
arreglo y sigue en verde — un cierre real sin `persisted` sigue limpiando los dos globales, la
guarda nueva no apaga la limpieza real); spec 77 (VA-1/VA-2, la comprobación gemela del padre) sin
romperse; 147 specs de pagehide/bfcache/mapa/GPS/modo/reanudación/arranque en chromium sin
romperse; recorrido con espía sin hallazgos nuevos. Con esto, F4 queda arreglado del todo (antes
solo lo estaba a medias, según dejó anotado §0 del propio plan).

**Guarda inalcanzable en `_esParadaValida()` (✅ cerrado, hallazgo apuntado en el paso 8.2).**
`_esParadaValida()` (`boton-casa-hijo5.html`) comprobaba `p.ubicacion.lat`/`lng` (¿coordenadas
reales?) y `!p.nombre` (¿tiene nombre?). Pero `_transformarParadaPadre()`, que construye `p` justo
antes de esta llamada, rellena SIEMPRE ambos campos con un valor por defecto cuando el original no
los trae: `ubicacion: {lat:0, lng:0}` (nunca hay `paradaPadre.coordenadas` — `DATOS_PADRE`/
`elementosIDpadre`, paso 8.2, no trae coordenadas) y `` nombre: `Parada ${parada_id}` `` (siempre
una cadena no vacía). `typeof 0 === 'number'` y una cadena no vacía nunca es falsy, así que
ninguna de las dos comprobaciones era alcanzable jamás, para ninguna parada real — el hallazgo
original de 8.2 decía "siempre `true`"; medido ahora con precisión, es "`true` salvo por la única
comprobación que sí puede fallar: falta de `id`/`padreid` y `parada_id`, que `_transformarParadaPadre()`
no rellena con ningún valor por defecto". Retiradas las dos ramas inalcanzables, sin cambiar el
resultado. Verificado: spec 109 nueva (sin rojo/verde — limpieza de código muerto sin cambio de
comportamiento; confirma con un mensaje real `NAVEGACION.RESPUESTA_DATOS_PARADAS` que una parada
sin `id` ni `parada_id` se descarta y una sin `nombre` no, vía el `count` real de `PARADAS.READY`);
24 specs de hijo5 en chromium sin romperse; recorrido con espía sin hallazgos nuevos.

**Los avisos `cambio_modo_*`/`restauracion_modo` (✅ cerrado, hallazgo apuntado en el paso 8.5).**
El pipeline de `SISTEMA.CAMBIO_MODO` en `js/app.js` mandaba tres broadcasts adicionales de
`SISTEMA.NOTIFICACION` por `datos.tipo` (no `datos.evento`): `'cambio_modo_iniciado'` (antes del
cambio, desde `notificarCambioModoInminente()`), `'cambio_modo_completado'` (tras aplicarlo, desde
`notificarCambioModoCompletado()`) y `'restauracion_modo'` (si falla y se restaura el modo
anterior, desde dentro de `restaurarEstadoModoAnterior()`). Los únicos handlers de
`SISTEMA.NOTIFICACION` del proyecto (hijo2, hijo4 — ver §10.16) solo miran `mensaje.datos?.evento`,
nunca `datos.tipo`, así que ninguno de los tres tenía consumidor posible por diseño, no por
casualidad: el propio código de `restaurarEstadoModoAnterior()` ya lo decía en un comentario
("Nadie escucha hoy datos.tipo === 'restauracion_modo'... el payload muerto es tarea del paso 9").

Se apuntó en el paso 8.5 en vez de arreglarse en el momento porque, a diferencia de los otros
broadcasts muertos de esa sesión (fire-and-forget, aislados), estos tres son pasos inline,
`await`-eados, con guarda de timeout de 15s, dentro del mismo pipeline central de cambio de modo —
mayor superficie de riesgo aparente. Medido ahora: cada llamada es un `enviarMensaje` liso (sin
acuse, no `enviarMensajeConConfirmacion`), así que el `withTimeout(...,15000,...)` que las envuelve
resuelve casi al instante en la práctica — el riesgo real era menor de lo que parecía al apuntarlo.

Retiradas las dos funciones completas (`notificarCambioModoInminente`, `notificarCambioModoCompletado`),
sus dos puntos de llamada dentro de `manejarCambioModo()`, sus dos líneas de exposición en
`globalThis`, y el broadcast de `restauracion_modo` dentro de `restaurarEstadoModoAnterior()` —
manteniendo intacta la restauración de estado (`estado.modo.actual`/`anterior`) y la llamada a
`actualizarInterfazModo()` que la rodean. Corregida GUIA-COMPLETA.md §10.16: la subsección
"Eventos del ciclo de cambio de modo" describía los tres como mecanismo vivo con tabla de función
emisora; sustituida por una frase que describe el estado real (el pipeline no manda ya ningún
NOTIFICACION adicional).

Verificado: spec 110 nueva (CI-1/CI-2 en rojo antes del arreglo, confirmado con un
`SISTEMA.CAMBIO_MODO` real: los dos avisos sí llegaban a hijo2 e hijo4); 91 specs de
modo/concurrencia/reanudación/arranque en chromium sin romperse, incluida la comprobación de
concurrencia sensible a WebKit `37-guard-concurrencia-cambio-modo.spec.js` (GC-1/GC-2) — su propio
comentario menciona estas tres funciones como parte de una cadena de timeouts del peor caso;
retirarlas solo la acorta, nunca la alarga, así que no hay riesgo de regresión desde ese ángulo;
recorrido con espía sin hallazgos nuevos para este cambio (el único aviso presente,
"Destino desconocido desde padre: 'hijo3'" en `actualizarEstadoControlesAudioPadre`, es idéntico —
mismo texto, misma pila, mismo conteo de 4 — en los recorridos de los pasos anteriores a este, así
que es preexistente y ajeno; anotado aparte en memoria, no es de la mensajería).

Con esto, el paso 9 queda cerrado entero: confirmaciones informativas, `DATOS.CARGADOS_RECIBIDO`,
las dos guardas inalcanzables, el segundo cargador de hijo4, el resto de F4, y los tres avisos
`cambio_modo_*`/`restauracion_modo` — todo lo que dejó apuntado el paso 8 y lo que este mismo paso
9 fue encontrando por el camino.

---

### 25.19. Paso 10 de la lavadora: estudio completo desde el inicio (✅ cerrado)

Barrido mecánico de los 95 tipos de `TIPOS_MENSAJE` cruzando emisor(es) contra receptor(es) en
todo el proyecto (padre, los 6 hijos, los 3 nietos y `js/`), con un script propio (no
`tools/verificar-mensajeria.js` — ver más abajo por qué se usó uno nuevo primero). Primera pasada:
9 tipos con emisor pero sin receptor o viceversa. De los 9, 8 resultaron falsos negativos de la
propia heurística — verificados uno a uno leyendo el código real, no descartados por el grep:

- `SISTEMA.CAMBIO_MODO_ENTENDIDO`/`EFECTUADO`: sí tienen receptor, en `js/app.js`
  (`_registrarHandlersModo()`) — el registro pasa por una variable local
  (`const registrar = globalThis.registrarControladorSeguro || ...`), no por el nombre literal.
  Protocolo bidireccional completo confirmado vivo: `CAMBIO_MODO` → `ENTENDIDO` → `EFECTUADO` →
  `CAMBIO_MODO_APLICADO`, los 7 hijos participan en los cuatro pasos.
- `NAVEGACION.SUPRIMIR_ROTACION`, `SELECCION.VIDEO_INTRO_TERMINADO`: sí tienen emisor
  (`En-busca-del-tesoro.html`, `video-intro.html`) — `tipo` es una constante local usada como
  propiedad abreviada (`{ tipo, destino, datos }`), no `tipo: TIPOS_MENSAJE...` en la misma
  expresión.
- `PUZZLE.COMPLETADO`/`TIMEOUT`: sí tiene emisor (`puzzle.html`) — el valor de `tipo` es un
  operador ternario (`success ? TIPOS_MENSAJE.PUZZLE.COMPLETADO : ...TIMEOUT`).
- `MAPA_COMPLETO.VISIBLE`: sí tiene emisor (`codigo-padre.html`) — con `globalThis.` de por medio
  entre `tipo:` y `TIPOS_MENSAJE`.
- `CHAT.ESTADO_PADRE`: sí se manda por el bus, con `origen` — el hallazgo de
  `project_unificacion_mensajeria.md` ("el padre lo manda a pelo") ya estaba resuelto por el paso 4
  ("los envíos a pelo del padre, al bus, con el de CHAT.ESTADO_PADRE el primero"); la memoria
  simplemente no se había actualizado tras cerrar ese paso.
- `NAVEGACION.GPS.DESACTIVAR`: confirmado el único caso genuino — el propio código
  (`codigo-padre.html`, junto a `_regCtrl_GPS`) ya lo documenta como huérfano intencional, constante
  conservada por si un hijo necesita pedir la desactivación en el futuro; hay un test
  (`11-constants-integrity.spec.js`) que exige que la constante exista. No se toca.

**`SISTEMA.ADVERTENCIA` (✅ cerrado, único hallazgo real).** Handler registrado en
`codigo-padre.html` (`_hdl_SISTEMA_ADVERTENCIA`, solo `logger.warn(...)`), pero CERO emisores en
todo el proyecto — ni un hijo, ni un nieto, ni un módulo de `js/` lo manda nunca. A diferencia de
`GPS.DESACTIVAR`, ningún comentario documenta una intención de futuro para este canal: parece el
hermano "no fatal" de `SISTEMA.ERROR` (que sí usan los 6 hijos) que ningún hijo llegó a adoptar.
Retirados el handler, su registro y la constante — sin dejar la constante "por si acaso", porque
aquí no hay ninguna razón escrita que lo justifique (a diferencia de `GPS.DESACTIVAR`). Verificado:
spec 111 nueva (SA-1, `TIPOS_MENSAJE.SISTEMA.ADVERTENCIA` ya no existe); 193 specs de
constants/padre/arranque/modo/navegacion-externa/escuchas en chromium sin romperse.

**Instrumento usado y por qué se escribió uno nuevo.** `tools/verificar-mensajeria.js` (el que
genera la tabla de GUIA-COMPLETA.md §37.3) ya existe y documenta sus propias limitaciones en su
cabecera — es la herramienta correcta y se usó para regenerar la tabla una vez identificados los
9 candidatos. Pero antes de fiarse de su salida (memoria: "validar el instrumento antes de creer su
salida"), escribí un script propio con la misma heurística para tener control total sobre qué
patrones cubre, y así entender exactamente CADA falso negativo en vez de solo saber que
"puede haberlos". El resultado confirma que el heurístico de `verificar-mensajeria.js` tiene los
mismos puntos ciegos (variable intermedia, alias `_S1..S5`, `globalThis.` de por medio, ternario) —
documentados ya en su propia cabecera, así que no es una sorpresa, pero SÍ lo era encontrar que
GUIA-COMPLETA.md había convertido varios de esos falsos negativos en afirmaciones seguras.

**GUIA-COMPLETA.md §37.3 corregida a fondo.** La tabla estaba desactualizada (100 tipos declarados
cuando el código de hoy tiene 95 antes de este paso, 94 después) y su nota introductoria afirmaba
como hecho confirmado que `NAVEGACION.GPS.ERROR` era "huérfano real de auditorías previas" junto a
`GPS.DESACTIVAR` — falso: `codigo-padre.html` SÍ manda `GPS.ERROR` a hijo2 (confirmado por
lectura de código Y por medición en vivo — el recorrido con espía del cierre de paso 9, unas horas
antes en esta misma sesión, mostró el mensaje viajando de verdad, regla 6 de CLAUDE.md). La misma
nota citaba `PUZZLE.LEGACY_*` como otro huérfano confirmado: no existe en ningún fichero del
proyecto, ni en `TIPOS_MENSAJE`, ni en ningún comentario — referencia fantasma. Regenerada la tabla
entera con `node tools/verificar-mensajeria.js --todos` (94 filas, fresco); añadidas notas al pie
verificadas a mano para las 5 celdas `*(ninguno detectado)*` que resultaron falsos negativos
(GPS.ERROR emisor, SUPRIMIR_ROTACION emisor, VIDEO_INTRO_TERMINADO emisor,
APLICACION_INICIALIZADA emisor, CAMBIO_MODO_EFECTUADO receptor); reescrita la nota introductoria
para no repetir la misma clase de error (afirmar como hecho lo que el instrumento solo sugiere).
Quitadas las 5 menciones sueltas de `SISTEMA.ADVERTENCIA` en el resto del documento (§10.2 tabla de
catálogo, §10.5 subsección de handler, tabla de scope de Script 2, tabla EJE 17).

Verificado en conjunto: lint limpio; 193 specs de la sesión (constants/padre/arranque/modo/
navegacion-externa/escuchas) en chromium sin romperse; `grep -c` de fechas en GUIA-COMPLETA.md = 0.

---

### 25.20. Paso 11 de la lavadora: Guía (✅ cerrado)

Cita del plan (§18, Parte IV — escrita antes de empezar la lavadora): *"Afirmaciones que chocan
con el código: §10.5 FASE 9 describe la regla estricta como contrato y dice que hijo2 la cumple.
hijo2 es el único que no la tiene. §33.4 documenta los nombres del padre... y lo da por inofensivo
'porque no rompe el enrutamiento'. Con doble papel sí lo rompe. §32.1 enseña como 'patrón
correcto' la limpieza en pagehide que deja el frame sordo al volver de la caché: da por hecho que
pagehide significa que la página muere. §10.17 afirma que los errores no controlados de los hijos
'viajan al padre' (hoy no llegan, F2) y presenta como patrón las confirmaciones informativas, que
nadie escucha."* Y el ítem 10 del plan propuesto original (Parte V): *"Guía: reescribir las
secciones de §18 y dar al contrato una sección propia."*

De las 4 secciones citadas en §18, 3 ya estaban corregidas por pasos anteriores de esta misma
lavadora (F2 cayó al migrar la pantalla de selección — paso 2; F3 con el arreglo de hijo1→hijo3 —
paso 2/3; los nombres del padre, con la identidad puesta por el bus — paso 1): verificado leyendo
el texto actual de §10.5 (ya dice "mismo contrato que cumple hijo2"), §33.4 (ya dice "ninguna de
las dos firma mensajes del bus... el origen lo pone el bus") y §10.17 (ya describe la captura
automática real de `instalarReporteErroresAlPadre`, sin rastro de "confirmaciones informativas").

**§32.1 seguía completamente desactualizada — el único hallazgo real de este paso.** Describía
`messagingAdapter._listenerRegistry.clear()` como el mecanismo de limpieza, y presentaba como
"patrón correcto" un fragmento de código que llama a `globalThis.messagingAdapter` — un objeto que
NO EXISTE en ningún fichero del proyecto (`messagingAdapter` solo aparece como nombre de variable
en 3 tests que comprueban que la capa antigua no reapareció, y como comentario histórico en
`js/mensajeria.js`). Era el envoltorio por-hijo de antes de la unificación ("opción A"), reemplazado
enteramente por `js/mensajeria.js` compartido. Medido el estado real: el único mecanismo de
dedup hoy es el propio `registrarControlador()` del bus (se queda el primer registro, el segundo
se rechaza con `logger.error`, nunca en silencio); `codigo-padre.html` añade
`__CONTROLADOR_REGISTRADOS` como capa extra propia por su arquitectura de 5 scripts; el patrón
`pagehide` correcto de hoy es `_limpiarPagehide()` (padre) y las guardas gemelas de `js/app.js`/
`js/funciones-mapa.js` del paso 9 (persisted-aware, spec 108) — nada de eso limpia "listeners de
mensajería" porque no hay ninguno que limpiar. De paso, medido que de los 6 hijos solo
coordenadas-hijo2.html y audio-hijo3.html registran su propio `pagehide`, y ninguno toca
mensajería: hijo2 pone un campo puramente diagnóstico (`estadoComponente.inicializado`, solo lo
lee el payload de `HEARTBEAT_RESPONSE`, cero efecto funcional) sin mirar `persisted` — hallazgo
menor, cosmético, no se arregla porque no cambia ningún comportamiento observable; hijo3 solo
escribe un log. Reescrita la sección entera con el mecanismo real.

**Contrato con sección propia — nueva §10.25.** El contrato del bus (`tests/e2e/79-bus-contrato.spec.js`)
no tenía una sección dedicada: sus garantías estaban dispersas y citadas sueltas en otras
subsecciones (§10.6, identidad en §10.x). Medido: el contrato creció de los "15 casos" que
mencionaba el plan original a 21 (BC-0 a BC-20, con BC-12 en tres partes) según fue creciendo la
lavadora — identidad (paso 1) y destino obligatorio (paso 3) añadieron sus propios casos.
Escrita §10.25 con las 21 garantías agrupadas por tema (enrutamiento, identidad, destino, acuse y
fallos de handler, mensajes a sí mismo, latido), usando los títulos de los tests como enunciado —
son ya la descripción exacta y verificada de cada garantía, no una paráfrasis.

Verificado: los 23 tests de spec 79 (BC-0 a BC-20) en chromium, todos en verde, confirmando que la
nueva sección describe exactamente lo que el código de hoy hace; `grep -c` de fechas en
GUIA-COMPLETA.md = 0. Sin cambio de código: paso puramente documental.

---

### 25.21. Paso 12 de la lavadora: 28 ejes, auditoría inversa y tanda final (✅ cerrado)

Cita del plan (Parte V, ítem 12): *"Auditoría de 28 ejes y auditoría inversa; tanda final de los
cuatro navegadores."* Alcance aplicado: los 28 ejes de `feedback-audit-metodologia-completa`
(memoria), enfocados en la mensajería y en todo lo que tocaron los pasos 1-11 — no una auditoría
completa del proyecto entero desde cero (temas ajenos a la mensajería, como párrafos/idiomas o
media, quedan fuera de este cierre).

**EJE 12 (duplicidades) — `enviarHijoListoConReintento`, 6 archivos.** Comparado línea a línea:
los 6 hijos implementan el mismo reintento de `HIJO_LISTO` de forma casi idéntica (mismo
comentario de bug fechado "auditoría 2026-08-18"). Única diferencia real: 5 de 6 muestran la UI
como fallback si se agotan los reintentos (`_uiConfirmado = true; mostrarUI()`); chat-hijo6.html
no lo hace. Verificado que NO es un olvido: `grep` de `mostrarUI`/`_uiConfirmado` en
chat-hijo6.html → 0 coincidencias — hijo6 no tiene el concepto de "UI oculta hasta confirmar",
se abre bajo demanda con `abrirChat()`. Sin acción.

**Auditoría inversa (funciones sin mención en la guía) — barrido de `globalThis.*` relacionados
con mensajería.** `globalThis.consultarHeartbeat`/`globalThis._testHeartbeatPauseResume`
(codigo-padre.html, herramientas de consola con `console.assert`) sin llamadores fuera de sí
mismas — pero SÍ mencionadas en GUIA-COMPLETA.md (2 coincidencias): no es el patrón de
`diagnosticarHijo4` (paso 9), que estaba roto y sin documentar. Sin acción.

**EJE 28 (recorrido real con espía) — 8 escenarios completos.** `pasos-reanudar.cjs`,
`pasos-cierre.cjs`, `pasos-chat.cjs`, `pasos-bienvenida.cjs`, `pasos-iconos.cjs`,
`pasos-estudio2.cjs`, y `pasos-aventura.cjs` con las dos salidas (`fin-otra`/`fin-terminar`) —
cubren P1-P16 de selección, CASA y AVENTURA, tramos y paradas, carteles informativos, chat,
recarga+reanudación, recordatorio de rescate (con la petición y concesión reales, no simuladas), y
las dos salidas de fin de aventura. Único descarte nuevo en las 8 tandas (aparte del ya conocido
"hijo3 no registrado al arrancar", ver `project_aviso_hijo3_no_registrado_startup`): *"seleccion
está sin padre... este aviso no se repite"*, en `fin-terminar`, justo al entrar en el modal de
fin ("valorar 5 estrellas y terminar") — contrastado contra BC-7 (§10.25: *"Un frame sin padre ni
iframes no envía, no espera y lo avisa una sola vez"*), que exactamente esto prueba. La pantalla de
selección deja de tener padre al volverse standalone tras el "terminar"; el recorrido confirma que
acaba en P1, sin errores ni pantallas atascadas. No es un hallazgo — es la garantía funcionando.

**Checklist de cierre (memoria, 11 puntos) — verificado punto por punto, alcance mensajería:**
1. Sin ❌/🕳️ sin triar en los ejes recorridos — ninguno encontrado.
2. `npm run lint` — limpio.
3. Tanda de los 4 navegadores — primera pasada: 2063/2064 en verde, 1 fallo real
   (`110-cambio-modo-notificaciones-muertas.spec.js`, CI-1/CI-2, solo en firefox: `page.evaluate`
   colgado sin resolver nunca, medido incluso subiendo el timeout a 240s). Diagnosticado con
   captura de consola en vivo: el último log antes del cuelgue es "Iniciando watchPosition..."
   dentro de `activarGPS()` (el CAMBIO_MODO real a AVENTURA activa GPS). Este spec era el único
   de los tres que dispara ese mismo camino real (junto a 96 y 100) sin haber llamado antes
   `context.grantPermissions(['geolocation'])` + `setGeolocation(...)` — exactamente el patrón que
   ya documenta `feedback_e2e_geolocation_firefox` en memoria (fechada hace 43 días, encontrada
   entonces en un spec distinto): sin el permiso concedido, Firefox dentro de Playwright no
   resuelve `watchPosition()` ni por éxito ni por error, y se queda colgado para siempre — no es
   lento, es un cuelgue real, y no se arregla subiendo el timeout (ya probado). Bug del arnés de
   test, no de la app: un usuario real ve el diálogo nativo y lo resuelve en los dos sentidos.
   Añadidas las dos líneas que faltaban al `beforeEach` de spec 110, igual que ya las tienen 96 y
   100. Verificado: spec 110 en los 4 navegadores, verde (antes tardaba >240s colgado en firefox,
   ahora 5s). Segunda pasada de la tanda completa, lanzada tras el commit de este arreglo.
4. `npm run verificar-mensajeria` sin huérfanos sin revisar — los 6 candidatos (`ninguno
   detectado`) son exactamente los mismos 6 ya verificados a mano en el paso 10 (§25.19): 5 falsos
   negativos de la heurística, 1 huérfano real intencional (`GPS.DESACTIVAR`). Nada nuevo.
5. `npm run inventory:dupes` — revisado el único caso relevante a mensajería (arriba, EJE 12).
6. EJE 20 — cubierto en el paso 11 (§25.20) para las secciones de mensajería.
7. `npm run verificar-docs` — fuera de alcance de este cierre (no es un eje de mensajería).
8. Ningún `test.skip` sin revalidar — los 28 archivos con `test.skip` usan el patrón
   `test.skip(condicion, motivo)` (guarda de precondición evaluada en cada ejecución), no el
   patrón de "test permanentemente desactivado" que preocupa a EJE 27.3; `grep` de
   `test.skip(async|describe.skip` → 0 coincidencias en todo `tests/e2e/`.
9. Ninguna decisión resuelta por dos caminos — cubierto en los pasos 8 y 9.
10. `npm run verificar-esperas` — encontró 19 esperas ciegas nuevas sin marcar, las 19 en
    specs de esta misma lavadora (100, 96-99 de pasos 7/8.1-8.3, y 101/103/104/105/106/110 de
    esta sesión). De las 19: 6 convertidas a `expect.poll` sobre una condición real observable
    (103 RM-1/RM-2, 100 LU-3, 98 PD-1 — todas confirmaban una PRESENCIA, pollable); las 13
    restantes marcadas `// VENTANA-OBSERVACION: <motivo>` porque confirman una AUSENCIA o un
    recuento dentro de una ventana, que no admite poll por definición. Quedan 2 esperas de la
    base histórica (159, fijada 2026-09-08) sin identificar, en ficheros ajenos a la mensajería
    (fuera de los pasos 1-12) — no se persiguen en este cierre.
11. EJE 28 — hecho, arriba.

Verificado en conjunto: 26 tests de las specs tocadas (96-101, 103-106, 110) en chromium, todos en
verde; lint limpio; `npm run verificar-esperas` sin esperas nuevas de mensajería; spec 110 en los
4 navegadores tras el arreglo del permiso de geolocalización.

**Tanda final #2 (definitiva): 2064/2064 en verde, en los 4 navegadores (chromium, firefox,
pixel5, iphone12), 40.6 min.** Sin ningún fallo. Con esto queda cerrado el checklist de cierre
entero (los 11 puntos) y **la lavadora completa (pasos 1-12) queda cerrada**.

---

## Parte VII — Hallazgos colaterales

Salieron tirando del hilo. No son de la mensajería y no se han tocado.

1. **El linter mira `js/` pero casi sin reglas.** Cuidado con resumirlo como "no cubre `js/`":
   `npm run lint` es `eslint "js/**/*.js" "*.html"` y solo ignora `js/vendor/`, `js/server.js` y
   `js/suppress-warnings.js`, así que los ficheros sí entran. Lo que pasa es que el bloque
   `js/**/*.js` de `eslint.config.js` activa tres
   reglas; ESLint 9 no trae las recomendadas de serie, así que `no-unused-vars`, `no-undef` y
   `no-redeclare` solo aplican a los HTML. Activando `no-unused-vars` salen 9 avisos reales fuera
   de `js/vendor/`: `js/app.js` (la copia muerta, `CONFIG`, dos argumentos), `js/config.js`
   (`MODOS`), `js/funciones-mapa.js` (`verificarPermisosGeolocalizacion`, una función entera, y
   `marcadorPosicionActual`), `js/mensajeria.js` (`script2Listo`) y `js/utils.js` (`timeout`).
   Activar `no-undef` saca más de 600 avisos, porque a ese bloque no se le declararon los
   globales del navegador.
2. **`RESPUESTA_DATOS_PARADAS` se envía desde siete sitios** del padre.
3. **Configuración de heartbeat que no lee nadie.** `CONFIG.HIJOS.TIMEOUT_INIT`,
   `MAX_HEARTBEATS_FALLIDOS` y `AUTO_RECONECTAR` (`js/config.js`) no los usa ningún fichero. El bus
   busca esos valores en `globalThis.Config.HEARTBEAT`, que no existe, y se queda con sus valores
   por defecto (3 fallos, reconexión activa). La guía citaba `CONFIG.HEARTBEAT.INTERVALO_HEARTBEAT`,
   que tampoco existe: corregido al quitar F5.
4. ✅ **El Script 4 arranca el heartbeat mandándose un mensaje a sí mismo.** Envía
   `HEARTBEAT_START`/`HEARTBEAT_PAUSE` con `destino: 'padre'` (L~15583, 15600, 15623, 15689),
   justo lo que la guía (§32.3) dice que no funciona, y su "fallback directo" está en un `catch`
   que no salta, porque el envío no lanza. Medido: la cadencia real del bus es 5 s, no los 10 s que
   pide esa ruta. **Confirmado en el paso 7** (era `CONFIG.ID`, que no se asigna en
   `js/config.js`: el destino siempre `undefined`, descartado sin lanzar excepción desde el paso
   3 — medido en runtime, aviso "falta destino" en cada carga). Arreglado con una llamada
   directa, igual que Script 1.
5. ✅ **`HEARTBEAT_START`/`HEARTBEAT_PAUSE` a los hijos no hacen nada.** El padre se los manda
   (L~7788, L~7873) y sus handlers en hijo2 a hijo5 solo escriben en el log. **Retirado en el
   paso 7** — el envío y los 5 handlers (audio-hijo3, boton-casa-hijo5, chat-hijo6,
   coordenadas-hijo2, retos-hijo4); `__HEARTBEAT_ACTIVO` no lo leía nadie (grep confirmado).
6. **hijo1 y hijo5 cargan `js/monitoreo.js` y nadie lo arranca en ellos.**

---

## Parte VIII — Fase B: matriz de emisión ascendente (decisión 15, SOLO estudio)

Cita de la memoria (`project_plan_noche_paso1`): *"Fase B — decision 15 (SOLO estudio): matriz
completa de quien puede enviar que tipo a quien, en todos los niveles (nieto -> contenedor:
puzzle->hijo4/seleccion, video-intro->seleccion/hijo6; hijo -> padre), codigo + trazas medidas."*
Ampliada por el usuario: *"saber que tipo de informacion le puede enviar cada nieto a cada hijo y
cada hijo al padre."* Y la regla que la acompaña: **"no aplicar la decisión 15 sin que el usuario
vea la matriz"** — este apartado es exactamente eso, y se detiene ahí. Nada de lo de abajo cambia
código ni comportamiento; es lectura directa del código de hoy (post-lavadora, los 12 pasos
cerrados), no inferencia ni memoria antigua.

**Método:** para cada uno de los 2 nietos y los 6 hijos, `grep` de todo envío con destino a su
contenedor directo ('padre' en términos del bus — que para un nieto es la ventana que lo incrusta,
no necesariamente `codigo-padre.html`), leído uno a uno en el código real, payload completo
incluido. Ningún dato de esta sección viene de `tools/verificar-mensajeria.js` sin contrastar:
la lista de tipos por archivo se usó solo como punto de partida, cada fila se verificó leyendo la
llamada real.

### Nietos → contenedor

Solo 2 nietos, y cada uno tiene **un único punto de envío** en todo su fichero.

**`puzzle.html`** (embebido en dos sitios distintos, nunca a la vez: `hijo4` al abrir un reto de
puzzle, `en-busca-del-tesoro` en P10 estático) — envía siempre con `destino: 'padre'`, que el bus
resuelve como *quien lo incrusta en ese momento*:

| Tipo | Cuándo | `datos` |
|---|---|---|
| `PUZZLE.COMPLETADO` | el puzzle se resuelve | `{ puzzleId, exito: true, timestamp }` |
| `PUZZLE.TIMEOUT` | se agota el tiempo sin resolverlo | `{ puzzleId, exito: false, timestamp }` |

Un solo emisor (`notificarPuzzleAlPadre(success)`) construye los dos; el tipo es el único campo
que cambia. Nunca manda nada más — ni progreso parcial, ni intentos, ni la imagen.

**`video-intro.html`** (embebido en dos sitios: `en-busca-del-tesoro` en P4, `hijo6-chat` en el
modal "ver de nuevo") — un único envío, sin `datos` en absoluto:

| Tipo | Cuándo | `datos` |
|---|---|---|
| `SELECCION.VIDEO_INTRO_TERMINADO` | el vídeo termina (botón o fin natural) | *(sin campo `datos`)* |

El contenedor decide qué hacer solo con el tipo y con su propio `origen`: `en-busca-del-tesoro` lo
usa para avanzar de pantalla (P4→P5); `chat-hijo6` para cerrar el modal. Ninguno de los dos lee
ningún dato adicional porque no hay ninguno que leer.

### Hijo → padre, por hijo

Catálogo completo de cada hijo — todo lo que puede subir, con el payload exacto de una llamada
real (cuando dos sitios mandan el mismo tipo con formas ligeramente distintas, se anota).

**`extrainfo-hijo1.html`** (18 tipos):

| Tipo | `datos` |
|---|---|
| `SISTEMA.HIJO_PREPARADO` | `{ version, tipo:'EXTRAINFO', capacidades:['opciones','configuracion'], timestamp }` |
| `SISTEMA.HIJO_LISTO` | `{ componenteId, iframeId, timestamp }` |
| `SISTEMA.HIJO_FALLIDO` | `{ error, stack, timestamp }` |
| `SISTEMA.CONFIRMACION` | `{ tipo:'UI_VISIBLE', timestamp }` |
| `SISTEMA.HEARTBEAT_RESPONSE` | `datosRespuesta` (construido antes, mismo patrón que los demás hijos) |
| `SISTEMA.NACK` | `{ error:'Modo inválido', modoRecibido }` |
| `SISTEMA.CAMBIO_MODO_ENTENDIDO` | `{ modo, timestamp, mensajeId }` |
| `SISTEMA.CAMBIO_MODO_EFECTUADO` | `{ modo, exito:true, timestamp, mensajeId }` |
| `SISTEMA.ERROR` | 3 sitios distintos: `{error,stack,timestamp}` (fallo genérico), `{error,tipo:'CAMBIO_MODO_FALLIDO'}`, `{error,contexto:'click-mas-opciones'/'PADRE_CONFIRMA_HIJO_LISTO', timestamp}` |
| `UI.CLOSE_MENUS` | `{ except:'mas-opciones', timestamp }` |
| `UI.ACCION_USUARIO` | `{ accion:'audio_control', comando:'pause', contexto:'enlace_externo' }` |
| `UI.NAVEGACION_EXTERNA` | `{ url, icono, timestamp }` |
| `CONTROL.DEV_CINCO_TOQUES` | `{ timestamp }` |
| `TEMPORIZADOR.TOGGLE` | `{ tiempoRestante, tiempoTotal, estado, modoAventura, tiempoFormateado }` |
| `PARADAS.LISTADO_TOGGLE` | `{ timestamp }` |
| `AVENTURA.TIEMPO_ACTUALIZADO` | `{ tiempoRestante, tiempoTotal, porcentajeRestante, estado, tiempoFormateado }` |
| `AVENTURA.TIEMPO_AGOTADO` | `{ mensaje, redirigir:'En-busca-del-tesoro.html', timestamp }` |
| `AVENTURA.ESTADISTICAS_TIEMPO` | `stats` (objeto de estadísticas de tiempo, construido aparte) |

**`coordenadas-hijo2.html`** (24 tipos — el hijo con más superficie, por el GPS):

| Tipo | `datos` |
|---|---|
| `SISTEMA.HIJO_PREPARADO` | `{ componenteId, coordenadasDisponibles, tipo:'COORDENADAS', capacidades:['navegacion','coordenadas'], timestamp }` |
| `SISTEMA.HIJO_LISTO` | `{ componenteId, iframeId, timestamp }` |
| `SISTEMA.CONFIRMACION` | dos formas — `{tipo:'UI_VISIBLE',timestamp}` (handshake visual) y `{idOriginal, datos:{tipoConfirmacion:'DATOS_RECIBIDOS', totalParadas}}` (acuse de datos, con `idOriginal` explícito) |
| `SISTEMA.HEARTBEAT_RESPONSE` | `{ timestamp, estado:'activo'/'inicializando', gpsActivo, paradaActual, coordenadasCargadas }` |
| `SISTEMA.NACK` | `{ error:'Modo inválido', modoRecibido }` |
| `SISTEMA.CAMBIO_MODO_EFECTUADO` | `{ modo, exito:true, timestamp, mensajeId }` |
| `SISTEMA.ERROR` | `{ error, tipo:'CAMBIO_MODO_FALLIDO' }` |
| `NAVEGACION.LLEGADA_DETECTADA` | `{ paradaId, parada_id, distancia, tipoParada:'tramo'\|'parada', timestamp }` |
| `NAVEGACION.MOSTRAR_UBICACION_POLYLINE` | `{ ubicacionUsuario, proximoElemento, elementoId, centrar:true, zoom:16 }` |
| `NAVEGACION.USUARIO_FUERA_RANGO` | `{ distancia, franja, elementoMasCercano, timestamp }` |
| `NAVEGACION.MOSTRAR_MAPA_COMPLETO` | `{ accion, formato:'html', url, aventura, mostrarTodo:true }` |
| `NAVEGACION.MOSTRAR_MAPA_VINTAGE` | `{ accion, formato:'jpg', aventura }` |
| `NAVEGACION.GPS.ACTIVAR` | `{ activar, idParada, distancia }` — **con acuse** (`enviarMensajeConConfirmacion`, timeout ajustado por conexión) |
| `NAVEGACION.GPS.RESTRINGIDO` | `{ idParada, distancia, rangoMaximo, timestampSalioDeRango }` |
| `NAVEGACION.GPS.DENTRO_DE_RANGO` | `{ timestamp }` |
| `NAVEGACION.GPS.PRECISION_INSUFICIENTE` | `{ accuracy, umbral, timestamp }` |
| `NAVEGACION.GPS.PRECISION_RECUPERADA` | `{ timestamp }` |
| `NAVEGACION.RESPUESTA_COORDENADAS` | `informacionCompleta` (imagen/vídeo/texto resueltos del elemento pedido) |
| `DATOS.COORDENADAS_CARGADAS` | `{ exito:true, aventura, idioma, totalCargadas, timestamp }` |
| `DATOS.TEXTOS_CARGADOS` | `{ exito:true, aventura, idioma, totalCargados, timestamp }` |
| `DATOS.SOLICITAR_COORDENADAS` | `{ motivo:'datos_no_recibidos', timestamp }` |
| `DATOS.SOLICITAR_TEXTOS` | `{ motivo:'datos_no_recibidos', timestamp }` |
| `UI.ACCION_USUARIO` | `{ accion:'reproducir-video'\|'mostrar-imagen', paradaActual, url*, nombre, sinContenido, mensajeError }` |
| `MONITOREO.METRICA` | `{ nombre:'gps_error_code', valor:1, metadatos:{codigo} }` |

**`audio-hijo3.html`** (13 tipos):

| Tipo | `datos` |
|---|---|
| `SISTEMA.HIJO_PREPARADO` | `{ componenteId, version, tipo:'AUDIO', capacidades:['audio','reproduccion','controles'], timestamp }` |
| `SISTEMA.HIJO_LISTO` | `{ componenteId, iframeId, timestamp }` |
| `SISTEMA.CONFIRMACION` | tres formas: `{tipo:'UI_VISIBLE',timestamp}`, `{accion:'click_ejecutado',elemento,exito:true,timestamp}`, `{accion:'audio_control',comando,exito:true,timestamp}` |
| `SISTEMA.HEARTBEAT_RESPONSE` | `{ timestamp }` |
| `SISTEMA.NACK` | `{ error:'Modo inválido', modoRecibido }` |
| `SISTEMA.CAMBIO_MODO_EFECTUADO` | `{ modo, exito:true, timestamp, mensajeId }` |
| `SISTEMA.ERROR` | tres formas: `{error,tipo:'CAMBIO_MODO_FALLIDO'}`, `{codigo:'ELEMENTO_NO_ENCONTRADO',mensaje,elemento,timestamp}`, `{codigo:'AUDIO_CONTROL_FALLIDO',mensaje,comando,timestamp}` |
| `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` | `{ paradaId, parada_id, padreId, padreid, timestamp }` |
| `DATOS.SOLICITAR_AUDIOS` | `{ audioId, motivo:'cache_miss', timestamp }` |
| `AUDIO.ESTADO_ACTUALIZADO` | `{ audioId, estado:'reproduciendo'\|'pausado' }` — desde los listeners nativos `play`/`pause` |
| `AUDIO.FIN_REPRODUCCION` | `{ audioId, estado:'finalizado' }` |
| `AUDIO.ERROR` | `{ audioId, error: motivo }` |
| `RETO.SOLICITAR_RETO` | `{ contexto:'manual', audioId: currentAudioId }` |

**`retos-hijo4.html`** (13 tipos):

| Tipo | `datos` |
|---|---|
| `SISTEMA.HIJO_PREPARADO` | `{ componenteId, version, tipo:'RETO', capacidades:['retos','preguntas','validacion'], timestamp }` |
| `SISTEMA.HIJO_LISTO` | `{ componenteId, iframeId, timestamp }` |
| `SISTEMA.CONFIRMACION` | `{ tipo:'UI_VISIBLE', timestamp }` |
| `SISTEMA.HEARTBEAT_RESPONSE` | `{ timestamp }` |
| `SISTEMA.NACK` | dos sitios: `{error:'Modo inválido',modoRecibido}` y `{error: error.message}` (tras fallar el CAMBIO_MODO) |
| `SISTEMA.CAMBIO_MODO_EFECTUADO` | `{ modo, exito:true, timestamp, mensajeId }` |
| `SISTEMA.ERROR` | `{ error, tipo:'CAMBIO_MODO_FALLIDO' }` |
| `NAVEGACION.CAMBIO_PARADA_CONFIRMADO` | `{ paradaId, parada_id, padreId, padreid, timestamp }` |
| `DATOS.SOLICITAR_RETOS` | `{ retoId, motivo:'cache_miss', timestamp }` |
| `RETO.SOLICITAR_RETO` | `{ contexto:'hijo4-botonRetos' }` |
| `RETO.MOSTRADO` | `{ retoId }` |
| `RETO.OCULTAR` | `{ retoId }` |
| `RETO.COMPLETADO` | `{ retoId, correcto:true, progreso }` — **con acuse** (`enviarMensajeConConfirmacion`) |

**`boton-casa-hijo5.html`** (11 tipos — dev-only, ver `project_hijo5_devonly`):

| Tipo | `datos` |
|---|---|
| `SISTEMA.HIJO_PREPARADO` | `{ componenteId, version, tipo:'CASA', capacidades:['modo-selector','paradas-list'], timestamp }` |
| `SISTEMA.HIJO_LISTO` | `{ componenteId, iframeId, timestamp }` |
| `SISTEMA.CONFIRMACION` | dos formas: `{tipo:'UI_VISIBLE',timestamp}` y `{idOriginal, datos:{tipoConfirmacion:'DATOS_RECIBIDOS', totalParadas}}` |
| `SISTEMA.HEARTBEAT_RESPONSE` | dos sitios con formas distintas: uno solo `{timestamp,componenteId,estado:{...}}`, otro (disparado por `visibilitychange`) añade `razon:'visibilitychange'` |
| `SISTEMA.ERROR` | 5 sitios: `contexto` cambia según el punto (`click-boton-parada`, `manejarClickGPS`, `solicitarParadasDelPadre`, `SISTEMA.HEARTBEAT`, `inicializacion-hijo5` con `critico:true`, `NAVEGACION.RESPUESTA_DATOS_PARADAS` con `stack`) |
| `SISTEMA.CAMBIO_MODO` | `{ modo: modoNuevo, timestamp, origen:'boton-gps' }` — **el único hijo que INICIA un cambio de modo**, no solo lo acusa (es el botón GPS del modo dev) |
| `SISTEMA.CAMBIO_MODO_EFECTUADO` | `{ modo, exito:true, timestamp, mensajeId }` |
| `NAVEGACION.CAMBIO_PARADA` | `{ paradaId, parada_id, padreId, padreid, timestamp, origen:'hijo5' }` — hijo5 dispara cambios de parada al pulsar sus botones |
| `NAVEGACION.SOLICITAR_DATOS_PARADAS` | `{ incluirTramos:true, incluirInicio:true, incluirMetadatos:true, ubicacionUsuario }` |
| `PARADAS.READY` (valor real: `VV:PARADAS:READY`) | `{ count: botonesGenerados }` |

**`chat-hijo6.html`** (7 tipos — el más pequeño):

| Tipo | `datos` |
|---|---|
| `SISTEMA.HIJO_PREPARADO` | `{ componenteId, version, tipo:'CHAT', capacidades:['chat','faq'], timestamp }` |
| `SISTEMA.HIJO_LISTO` | `{ componenteId, iframeId, timestamp }` |
| `SISTEMA.HEARTBEAT_RESPONSE` | `{ timestamp, estado:'activo'/'inicializando' }` |
| `SISTEMA.CAMBIO_MODO_ENTENDIDO` | `{ modo, timestamp, mensajeId }` |
| `SISTEMA.CAMBIO_MODO_EFECTUADO` | `{ modo, exito:true, timestamp, mensajeId }` |
| `CHAT.CERRAR` | *(sin `datos`)* |
| `CHAT.RESCATE_SOLICITADO` | `{}` — **con acuse** (`enviarMensajeConConfirmacion`, timeout ajustado por conexión); toda la información relevante vuelve en la RESPUESTA del padre, no en la petición |

### Observaciones para cuando el usuario revise la matriz (sin decidir nada)

- **Los 6 hijos comparten un núcleo casi idéntico:** `HIJO_PREPARADO`, `HIJO_LISTO`,
  `HEARTBEAT_RESPONSE`, `CONFIRMACION{tipo:'UI_VISIBLE'}`, y (los 5 que participan en el
  protocolo bidireccional de modo) `CAMBIO_MODO_ENTENDIDO`/`EFECTUADO`/`NACK`/`ERROR{tipo:
  'CAMBIO_MODO_FALLIDO'}` — mismo payload, mismo propósito, siete copias del mismo patrón.
  Candidato natural a un helper compartido si se decide extraer código común — no se propone
  aquí, solo se deja apuntado como lo que la matriz hace visible de un vistazo.
- **`SISTEMA.ERROR` es el tipo con más variantes de payload** (distinto `contexto`/`codigo` según
  el sitio) — coherente con ser el canal genérico de errores, no una señal de duplicidad.
- **hijo5 es el único hijo que hace de EMISOR de `SISTEMA.CAMBIO_MODO` y de
  `NAVEGACION.CAMBIO_PARADA`** — el resto de hijos solo los reciben. Coherente con su rol de
  "panel de control" en modo desarrollo, no un hallazgo.
- **`PARADAS.READY` tiene el valor de cadena `'VV:PARADAS:READY'`**, distinto de su nombre de
  propiedad — ya documentado y corregido en la tabla de §37.3 de GUIA-COMPLETA.md (paso 10).
- **Los dos nietos son extremos opuestos de tamaño de payload:** puzzle manda 3 campos con
  sentido (`puzzleId`, `exito`, `timestamp`); video-intro no manda ningún campo — el contenedor
  decide solo con el tipo. Ninguno de los dos nietos necesita más información de la que ya manda
  para lo que hace su contenedor (avanzar pantalla / cerrar reto o modal).

Sin más acción por ahora: **esto es el estudio completo que pedía la Fase B.** La decisión 15 en
sí (qué hacer con esta información, si es que hay que hacer algo) espera a que el usuario la vea.
