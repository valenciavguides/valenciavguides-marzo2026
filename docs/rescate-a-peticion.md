# El rescate, a petición del usuario

Rediseño del mecanismo de rescate: deja de dispararse solo y pasa a pedirlo el usuario.
**Diseño cerrado y textos aprobados. Sin implementar.**

Este documento reúne el porqué, el diseño acordado, los textos, los veintitrés huecos que
encontró la prueba de escritorio contra el código real, y lo que quedó comprobado y limpio.

---

## 1. Por qué hay que cambiarlo

El rescate existe para el usuario genuinamente bloqueado por algo real —unas obras, una
calle cortada, una verja— que de otro modo se quedaría tirado a mitad de recorrido habiendo
pagado. Hoy se dispara solo, y eso produce cuatro problemas medidos.

**El reloj no sabe nada.** Cuenta minutos desde que se creó la ficha del elemento y no mira
dónde está el usuario, cuánto ha andado, ni si se está moviendo. En un tramo solo lo
reinicia el audio, al terminar o al saltarlo.

**Se autoconsume en los tramos largos.** De los 239 tramos reales, **21 superan los 830 m**
— más de diez minutos andando a paso normal. El más largo mide 1917 m, unos 23 minutos.

| Aventura | Tramos | De más de 830 m | Tope de rescates |
|---|---|---|---|
| Aventura 1 | 24 | 0 | 5 |
| Aventura 2 | 19 | 0 | 5 |
| Aventura 3 | 29 | **4** | 5 |
| **Aventura 4** | 28 | **5** | **5** |
| Aventura 5 | 24 | 2 | 5 |
| Fallas | 18 | 0 | 5 |
| Aventura 34 km | 97 | 10 | 12 |

**Aventura 4 gasta sus cinco rescates andando bien.** Llega al final sin ninguno, así que
una calle cortada de verdad ya no tiene rescate. Aventura 3 gasta cuatro de cinco. Y el
mismo mecanismo castiga a quien se para diez minutos en una tienda o a tomar café.

**Las paradas no tienen rescate.** El barrido lleva un `if (p.tipo !== 'tramo') continue;`
y no hay salida manual. Un monumento cerrado por obras o una plaza vallada **termina la
aventura ahí**. Y es donde el usuario está más indefenso: un tramo es un camino que admite
rodeos, una parada es un punto concreto.

**El principio tampoco está cubierto.** El 18 % de progreso exigido entre rescates deja sin
protección los primeros 9 a 13 elementos, según la aventura.

---

## 2. El diseño acordado

**Se pide, no salta solo.** El botón vive en el asistente de soporte (hijo6), dentro de la
respuesta de preguntas frecuentes que ya existe en doce idiomas. Las preguntas, las
respuestas y el botón son locales: **funcionan sin cobertura**, que es la situación probable
de alguien bloqueado. (Solo el buzón de sugerencias hace red.)

**Tres pantallas, un solo gasto.** Botón (petición) → primera confirmación (filtra el toque
accidental) → segunda confirmación (explica el precio, Sí/No). **Cerrar por cualquier vía
equivale a No**: el gasto ocurre únicamente al pulsar Sí.

Las dos confirmaciones no se parecen, a propósito: la primera lleva botones asimétricos
(«Sí, no puedo continuar» / «Volver al recorrido») para que el usuario no pueda recorrerlas
en piloto automático con dos toques.

**Se quita el disparo automático y el 18 % de progreso.** El porcentaje solo servía para
frenar un automatismo que deja de existir, y a cambio creaba la zona ciega del arranque y la
trampa del botón que no hace nada.

**Se cubren también las paradas** — fuera el `continue` — **excepto el elemento de inicio**,
porque llegar al punto de partida *es* empezar la aventura.

**El tope sube a 12**, y a **35** en Aventura 34 km (decisión final). Sobre elementos reales
son un 18 % del recorrido en Aventura 1 y un 15 % en la de 34 km — parecidos entre sí y
suficientemente pequeños como para que nadie complete una aventura a base de botón.

**Al elegir otra aventura y pagar de nuevo, el contador arranca de cero.** Verificado: los
dos caminos de «elegir otra» (`ejecutarElegirOtra()` y `_elegirOtra()`) ya ponen
`tramoSkipsUsados` y `progresoEnUltimoSkip` a 0, y el tope se lee de la tabla de la aventura
nueva.

**El reloj no se elimina: cambia de oficio.** Deja de gastar y pasa a mostrar un cartel
recordatorio. Baja de 10 a **8 minutos**, con repeticiones en el **10, 12 y 14**. Cuatro
avisos y después silencio; el asistente sigue disponible siempre.

- En la franja de cerca la gracia son 7 minutos, así que la ayuda llega **un minuto**
  después del bloqueo en vez de tres.
- En la de desviado la gracia son 15, así que los cuatro avisos caen **antes** de que se le
  empiecen a quitar botones.
- En un tramo con el usuario sobre la ruta no hay franja ninguna: solo los cuatro avisos.

**Sin condición de distancia**, y es contraintuitivo: en un tramo la franja mide
`distanciaAlCamino`, y el bloqueado por una valla está **encima** del camino — para la app,
dentro de rango. Exigir «fuera de rango» habría dejado sin cartel al caso principal.

**El rescate omite el audio y los retos, no los recupera.** Al saltar al punto siguiente
llega información nueva, y arrastrar el audio anterior para encajarlo después sería frágil y
fallaría justo con el usuario ya frustrado.

*Y el usuario ha tenido ocasión de escucharlo, verificado en el código:* el control de audio
se apaga con `hayAudio = !fueraDeRango && !!audioId`. En un **tramo**, el bloqueado ante una
valla está sobre la ruta (`distanciaAlCamino` ≈ 0), o sea **dentro** de rango: el audio le
funciona los ocho minutos enteros. En una **parada**, queda fuera de rango solo al expirar la
gracia, así que dispone de los **siete primeros minutos**. Pierde el audio, pero no sin haber
tenido margen.

**El sentido chat → padre no depende del registro**, pero el contrario sí. La petición es un
`postMessage` directo a `window.parent` y nunca pasa por `iframesRegistrados`; las tres
pantallas las pinta el padre. Pero el texto del asistente dice cuántos rescates hay en esta
aventura, y ese número tiene que llegarle **desde el padre** — ver el hueco 18.

**El botón de ubicación se apaga entre el rescate y pulsar avanzar.** En esa ventana hijo2
sigue teniendo como actual el elemento abandonado, así que ese botón dibujaría la ruta **de
vuelta a la valla**. Se resuelve consultando el flag `btnAvanzarCompletadoPorPadre`, que ya
existe, dentro de `_habilitarAyudaFueraDeRango`.

**El usuario siempre pulsa.** No hay avance automático tras el rescate: le da sensación de
control sobre su aventura.

---

## 3. Los textos

Aprobados en español. De aquí salen los doce idiomas **en voz nativa**, no traduciendo
palabra por palabra. Los rótulos de los botones también se traducen.

Voz: impersonal, sin marcas de género, siempre de usted.

### 3.1. Pregunta del asistente

> ¿Qué ocurre si no consigo llegar a un punto y no puedo continuar?

### 3.2. Respuesta del asistente

> **No se preocupe, tenemos una salida preparada.**
>
> En una ciudad pasan cosas: unas obras, una calle cortada, una valla que ayer no estaba… A
> veces, simplemente, el camino se complica.
>
> Para estos casos existen los **rescates**.
>
> Un rescate le permite dejar atrás este punto y continuar hasta el siguiente, tanto si se
> trata de una parada como de un tramo. En esta aventura dispone de **{total}** rescates.
>
> Usted decide cuándo utilizarlos. Si ve que no hay forma de continuar, pulse el botón
> correspondiente y seguirá con su aventura con normalidad. Eso sí, úselos con cabeza: son
> contados.
>
> Tenga en cuenta que, al utilizar un rescate, este punto se dará por visitado y su audio y
> sus retos quedarán resueltos. Es decir, **esa parte de la historia quedará sin descubrir y
> no podrá volver atrás**.
>
> Por eso, nuestro consejo es sencillo: intente llegar siempre que pueda y guarde los
> rescates para cuando la ciudad de verdad le cierre el paso.

**Botón:** `Tengo un problema y no puedo continuar`

### 3.3. Cartel recordatorio — minutos 8, 10, 12 y 14

> **¿Se ha encontrado con un obstáculo?**
>
> Consulte cómo seguir con el recorrido.
>
> `Ver cómo continuar`

El botón abre el asistente. No gasta nada: es navegación, no una segunda puerta al rescate.
No se dice «chat» en ningún sitio — la app lo llama **asistente de soporte**, y hablar de un
chat promete una conversación que no existe.

### 3.4. Primera confirmación — filtra el toque accidental

> **¿Necesita un rescate?**
>
> Ha pulsado el botón de ayuda. Si ha sido sin querer, puede volver al recorrido sin que
> pase nada.
>
> `Sí, no puedo continuar`  `Volver al recorrido`

### 3.5. Segunda confirmación — la única que gasta

> **Está a punto de usar un rescate en {nombre}.**
>
> Este punto se dará por visitado y su audio y sus retos quedarán resueltos: esa parte de la
> historia quedará sin descubrir y **no podrá volver atrás**.
>
> Después le quedarán **{restantes} de {total}**.
>
> ¿Seguimos adelante?
>
> `Sí`  `No`

### 3.6. Rescate concedido

> **Rescate utilizado. {nombre} queda atrás.**
>
> Su próximo punto ya le espera en el mapa.
>
> Ha utilizado **{usadas} de {total}**.
>
> Cuando le parezca el momento, pulse el botón de avanzar y siga camino.

Se nombra **el botón de avanzar**, no «el que corresponda»: tras el rescate quedan
encendidos avanzar y —si no se apagara— ubicación, y solo avanzar continúa la aventura.

### 3.7. Rescates agotados

> **Ha utilizado sus {total} rescates y ya no queda ninguno.**
>
> No se preocupe, aún queda mucho por descubrir. Un acceso cerrado suele abrirse al cabo de
> un rato, y casi siempre hay otra forma de acercarse: tiene el mapa completo y el mapa
> antiguo a mano para encontrarla.

No se le remite al buzón: es de sugerencias, sin respuesta, y además necesita cobertura —
justo lo que puede faltarle. Los dos mapas, en cambio, **se le habilitan a propósito**
cuando está fuera de rango.

---

## 4. Los veintitrés huecos

Encontrados recorriendo el escenario paso a paso contra el código real. Ninguno estaba en el
primer resumen de implementación.

### Comunicación

1. **hijo6 nunca ha mandado una acción de usuario** — solo mensajes de sistema
   (`HIJO_LISTO`, `HEARTBEAT_RESPONSE`, `CAMBIO_MODO_*`, `HIJO_PREPARADO`). Hace falta un
   tipo de mensaje nuevo y su handler en el padre.
2. **Su envío es un `postMessage` crudo**: sin acuse, sin reintento, sin respuesta. Un
   mensaje perdido deja el botón muerto en silencio.
3. **Sin guard contra la doble pulsación**: dos toques abren dos flujos.
4. **El chat no sabe en qué elemento está** (solo tiene el nombre, para el buzón). El padre
   lo resuelve de su estado, que **puede cambiar** entre el cartel y el Sí. La confirmación
   debe llevar el id y el padre verificarlo antes de gastar.
5. **No existe forma de que un cartel abra el asistente.** Hay que construirla.

### El reloj

6. **`pendingCompleciones` no se persiste.** Cerrar la app borra el reloj.
7. **Las fichas no se crean al activar un elemento**, sino por eventos (llegada, reto
   resuelto, audio terminado o saltado). Sin ese evento no hay ficha, no hay reloj y **el
   cartel no sale nunca** — tampoco al reabrir, porque el audio ya sonó y no volverá a
   disparar nada.
   **Dónde arreglarlo:** `_hdl_NAVEGACION_CAMBIO_PARADA` es quien resuelve y envía el audio
   y el reto en el momento exacto en que cada elemento se activa (protección pasiva por
   parada, §16). Es el sitio natural para crear la ficha: ya existe y ya corre cuando hace
   falta.
8. **El barrido no comprueba si el elemento ya está completo**: ofrecería ayuda a quien ya
   no la necesita.

### Los carteles

9. **El recordatorio puede quedar bloqueado indefinidamente.** Los recordatorios son
   «educados»: consultan `_hayCartelEnPantalla()` y se apartan. El de audio reaparece **cada
   20 s** mientras el usuario no pulse play, y el atascado es justo quien no lo ha pulsado.
10. **La confirmación puede ser destruida.** Los carteles de evento (transición, inicio de
    tramo, llegada, bienvenidas) llaman a `_ocultarCualquierCartel()` y borran todo sin
    preguntar.
11. **Se autocerraría a los 10 s** (7 s el de rescate), que no da para leer y decidir algo
    irreversible.
12. **Ese autocierre no tiene significado**: ni Sí ni No, un flujo colgando.

### Los botones

13. **`retoActivo` gana sobre «completado por el padre».** Y la ayuda de ubicación también
    exige `!retoActivo`. Con un reto abierto, tras el rescate quedan **los dos botones
    apagados**: el usuario paga y se queda con menos que antes. El rescate debe **cerrar el
    reto y limpiar el flag**, no solo darlo por resuelto en la ficha.
14. **El pulso de valoración vive en `z-index: 1900000`** y salta al 33 % y al 66 % del
    progreso, contando solo paradas reales.

    **Corrección:** *no* está por encima de todo. Está deliberadamente **por debajo** del
    techo de `2000000` que declaran `.ventana-temporizador-padre` y
    `.ventana-listado-paradas-padre` ("máximo, por encima de todo"), y el comentario de
    `.pulso-valoracion-padre` explica por qué: si el usuario tiene una de esas dos ventanas
    abierta cuando se cruza el umbral, el pulso se esconde detrás en vez de interrumpirla, y
    se pierde ese aviso puntual. Así que el conflicto **ya estaba resuelto** en el proyecto y
    con una regla escrita. La pantalla de decisión usa ese mismo techo de `2000000` —no una
    capa nueva— y el pulso se queda detrás solo, sin tocarlo.

### Alcance

15. **El elemento de inicio entraría en el rescate.** El usuario podría saltarse el punto de
    partida sin salir de casa. Hay que excluirlo.
16. **Dónde se mira el contador.** Debe mirarse **al recibir la petición**: si se mira al
    final, el usuario recorre dos confirmaciones para que le digan que no.

### El número de rescates tiene que viajar al chat

18. **El asistente depende de mensajes del padre, y ese sentido sí pasa por
    `iframesRegistrados`.** El chat recibe su estado con
    `estadoPadre = { ...estadoPadre, ...mensaje.datos }`, que el padre construye en
    `construirEstadoChat` (idioma, aventura, nombre de la parada actual y de la siguiente).
    El texto aprobado dice «dispone de **{total}** rescates», así que ese número hay que
    añadirlo ahí. Es la misma tabla cuyo olvido dejó el chat en español durante semanas, y
    **el texto tiene que degradar con dignidad si el dato no llega**: jamás mostrar un
    `{total}` crudo en pantalla.

19. **Un rescate se pierde si el usuario se aleja más de 5 km.** `DESHABILITAR btnAvanzar`
    con `razon: 'fuera_de_zona_5km'` limpia `btnAvanzarCompletadoPorPadre`. Quien recibe un
    rescate y luego se va a cinco kilómetros pierde el botón y tiene que volver. Aceptable
    —a esa distancia no está bloqueado, se ha ido— pero conviene que esté escrito.

### El gasto y su efecto no son atómicos

23. **El rescate se descuenta de forma duradera, pero su efecto no.**
    `persistProgressState()` guarda `indiceProgreso`, `paradaActual` y `tramoSkipsUsados`,
    pero **no** `pendingCompleciones`. Así que al pulsar Sí el contador baja y se persiste al
    instante, mientras que la marca de completado vive **solo en memoria** hasta que el
    usuario pulsa avanzar y el índice se guarda.

    En esa ventana —lo que tarde en leer el cartel y mirar alrededor— si el móvil se queda
    sin batería, el navegador descarta la pestaña o la app se recarga, al volver **ha perdido
    un rescate y sigue delante de la misma valla**. Pagó y no recibió nada.

    **Arreglo:** descontar el rescate cuando el elemento **avanza de verdad**, no al pulsar
    Sí. Así un fallo en medio cae del lado del usuario: conserva su rescate y vuelve a estar
    donde estaba.

### La pantalla no da para una decisión

21. **El cartel de confirmación puede dejar sus botones fuera de pantalla.** Los carteles se
    anclan arriba (`top: calc(10.7vh + 10px + 0.5rem)`) y crecen hacia abajo **sin
    `max-height` ni `overflow`**. Los que existen se lo pueden permitir porque son cortos y
    **ninguno lleva botones** —solo el aspa de cerrar—, y por eso **ninguno usa
    `var(--gap-inferior)`** pese a que la regla del proyecto la exige para todo elemento
    cercano al borde inferior. El de confirmación es el primero con texto largo **y dos
    botones al final**: el alemán ocupa 290 caracteres. Si se sale de la pantalla, el usuario
    no puede pulsar ni Sí ni No, y no hay scroll que lo salve. Necesita alto máximo, scroll
    interno y safe area — las reglas responsive que el proyecto ya tiene escritas.

### El audio puede seguir sonando

22. **Un fin de audio tardío resucita la ficha de un elemento ya dejado atrás.**
    `_hdl_AUDIO_FIN_REPRODUCCION` mapea el `audioId` a su elemento y hace `ensurePending()`
    **sin comprobar que siga siendo el actual** — a diferencia de su función hermana
    `_saltarAudioPulsado()`, que sí lo comprueba
    (`estado.elementoActual.audio_id !== audioId → return`). La ficha renace con
    `timestamp: Date.now()`, y a los 8 minutos el barrido ofreceria un rescate para un punto
    que el usuario pasó hace rato.

    **Hoy no es alcanzable**, y por eso nadie lo ha visto: para avanzar hay que completar, y
    para completar el audio tiene que haber terminado. **El rescate rompe esa invariante** al
    marcar el audio como resuelto mientras todavía suena. El arreglo es darle a esa función
    la misma guarda que ya tiene su hermana.

### La aventura puede haber terminado

20. **El tiempo puede agotarse mientras el usuario decide.** hijo1 lleva su propia cuenta
    atrás en vivo: al llegar a cero envía `AVENTURA.TIEMPO_AGOTADO` y el padre monta un modal
    a pantalla completa (`_hdl_AVENTURA_TIEMPO_AGOTADO`). **Regla:** si la aventura ha
    terminado —por tiempo, por limpieza de datos o por haber pasado la semana— **no hay
    rescate posible**. El gasto debe comprobar que la aventura sigue viva antes de conceder.
    Es una condición, no un mecanismo.

### El iframe puede recargarse debajo

17. **hijo6 se recarga a media aventura si falla el heartbeat.** Tras tres fallos —quince
    segundos sin respuesta— `intentarReconectarHijo()` (`js/mensajeria.js`) hace
    `iframe.elemento.src = iframe.elemento.src` y fuerza la recarga, avisando antes al padre
    con `_vv_beforeHijoReload()` para que guarde estado. Si ocurre con el chat abierto, el
    asistente vuelve a su estado inicial bajo los pies del usuario. Los carteles sobreviven
    —los pinta el padre— pero hay que decidir qué pasa con el flujo a medias.

### Los dos que aparecieron al implementar

24. **El botón del asistente se pintaba siempre, sin mirar el estado.** Pero §3 solo tiene
    texto aprobado para *agotados* y para el camino positivo. Quedaban cuatro motivos
    mudos —`no-aventura`, `sin-elemento`, `es-inicio` y `ya-llegado`— en los que pulsarlo no
    podía hacer nada, que es justo el botón mudo que este mecanismo viene a evitar.

    **Decisión: se esconde el botón.** Con una excepción que no es capricho: con los
    rescates **agotados sí se pinta**, porque saber que se han acabado es información real
    y es lo único que hace llegar al usuario el cartel de §3.7. Escondiéndolo también ahí,
    ese texto no lo leería nadie nunca.

    Y resulta que el hueco 18 se resuelve con el mismo cambio: el número de rescates y la
    decisión de pintar el botón salen los dos de la misma consulta, que viaja dentro de
    `construirEstadoChat()` — sin tipo de mensaje nuevo y sin viaje extra. El estado se
    refresca **cada vez que se abre el asistente**, que es el momento más fresco posible.

25. **El hueco 23 y el texto §3.6 se contradicen.** El hueco 23 manda descontar el rescate
    cuando el elemento **avanza de verdad**, no al pulsar Sí. Pero §3.6 dice "Ha utilizado
    **{usadas} de {total}**" y se muestra justo al conceder, cuando ese contador todavía no
    ha subido: la pantalla le diría "ha utilizado 2 de 12" a quien acaba de gastar el
    tercero.

    **Decisión: la pantalla enseña la cuenta de después, y el descuento sigue difiriéndose.**
    El usuario acaba de gastarlo y el texto tiene que decirle la verdad de lo que ha hecho,
    no el valor interno de un contador. El desfase solo puede caer a su favor: o avanza y la
    cuenta cuadra, o algo se rompe y recupera el rescate.

---

## 4b. El texto que señalaba al botón — resuelto

§3.2 decía "pulse el botón de aquí abajo" en los doce idiomas, y ese botón se esconde cuando
un rescate no sirve de nada (hueco 24). La respuesta seguía visible —y hace bien, porque
explica qué son los rescates y cuántos quedan— pero esa frase señalaba un sitio vacío de la
pantalla, sobre todo al principio de la aventura, que es cuando la gente curiosea el
asistente.

**Reescrito el párrafo 4 en los doce idiomas**, nombrando al asistente en vez de a un botón:

> Usted decide cuándo utilizarlos. Cuando la ciudad le cierre el paso de verdad, este
> asistente le abrirá camino y seguirá su aventura con normalidad. Eso sí, úselos con
> cabeza: son limitados.

El asistente sí está siempre, así que la frase vale con botón y sin él. Cada idioma encaja la
idea en su propia sintaxis; no es la misma frase traducida palabra por palabra.

**Queda una repetición que mirar:** el párrafo 6 de los doce idiomas usa la misma imagen
("guarde los rescates para cuando la ciudad de verdad le cierre el paso"), así que ahora
aparece dos veces en la misma respuesta, con dos párrafos de por medio.

---

## 5. Lo que salió limpio

Comprobado y sin trabajo pendiente:

- **El botón de avanzar sobrevive al fuera de rango.** `btnAvanzarCompletadoPorPadre` gana
  sobre la distancia en cada lectura, y la desactivación por rango **no** levanta
  `btnAvanzarDeshabilitadoExternamente`, que es el único que le ganaría. *Reverificado por un
  segundo método —quién puede apagar el flag, en vez del orden de comprobaciones—: solo hay
  dos `DESHABILITAR btnAvanzar`, y el de `parada_pendiente_completar` dispara al **activar**
  la parada, antes del rescate. El otro es el de los 5 km (hueco 19).*
- **Los carteles se dibujan sobre el asistente**: 1000060 contra 1000020. Lo acordado es el
  comportamiento natural, no hay que forzarlo. *Reverificado por posición en el DOM, no solo
  comparando números: los carteles hacen `document.body.appendChild()` y el iframe del chat
  es hijo directo de `body`, sin `transform`/`filter`/`opacity` alrededor que cree un contexto
  de apilado. La comparación es válida.*
- **Tras avanzar, la lógica de franjas decide sola** si toca overlay con ubicación o botón de
  avanzar. No hay que programarlo: hay que no romperlo. **Con un matiz:** la distancia le
  llega a hijo2 en cada lectura de GPS (`procesarPosicionGPSParaAventura`), así que hay hasta
  **7 segundos** tras pulsar avanzar en los que sigue calculando con el elemento anterior.
- **El mapa se limpia sin depender de la llegada.** `completarCambioParada()` llama a
  `limpiarPolylineNavegacion()` con un comentario que describe exactamente este caso.
  *Reverificado: la llamada es **incondicional**, no está dentro de ningún `if` — no basta
  con el comentario, que es una afirmación, no el código.*
- **El cambio de modo no borra las fichas.**
- **El fin de aventura se dispara al avanzar sin elemento siguiente**, así que rescatar el
  último cierra bien.
- **El contador se resetea consistentemente** en los dos caminos de «elegir otra aventura».

---

> **Dos correcciones, con la misma forma.** «El temporizador de aventura solo se comprueba al
> restaurar sesión» figuró aquí y era falso: se miró `verificarTimeoutAventura()` —el reloj
> del **padre**— y se pasó por alto que **hijo1 lleva su propia cuenta atrás en vivo**. Es el
> hueco 20.
>
> «La reconexión de iframes solo corre en el arranque» también figuró aquí y era
> falso: se comprobó `intentarReconectarHijosFallidos()`, que sí es de arranque, y se pasó
> por alto `intentarReconectarHijo()` en `js/mensajeria.js`, que corre en cualquier momento.
> Es el hueco 17. La lección, que ya estaba escrita en la memoria del proyecto: antes de
> refutar una teoría con una medición, comprobar **por qué camino** pasó la ejecución — un
> síntoma que «a veces no ocurre» suele significar que hay dos caminos.
>
> Y el patrón concreto, que se repitió **tres veces**: se comprobó la copia del **padre** o el
> **fichero principal**, y se pasó por alto la del **hijo** o la del **módulo importado**
> (`intentarReconectarHijo` en mensajería; la cuenta atrás de hijo1; el `fetch` que está en
> `feedback-forms.js` y no en `chat-hijo6.html`). En una arquitectura de seis iframes con
> estado propio, ahí vive media aplicación.

## 6. Lo que se simplifica

**`_rescateTramoPendiente` sobra.** Hoy es un marcador que el barrido deja para que
`marcarParadaCompletada()` sepa qué cartel mostrar — y es justo la pieza que ya falló una
vez, cuando guardaba la clave con prefijo `padre-` y nunca coincidía con el id limpio. Con el
rescate a petición, el cartel se muestra donde el usuario pulsa: sin recados entre funciones.

---

## 6a. Lo que hay que reescribir de lo viejo

**`42-ttl-tramo-saltos-seguridad.spec.js` hay que rehacerlo entero, no retocarlo.** Cuatro de
sus cinco tests afirman comportamiento que desaparece:

| Test | Qué afirma hoy | Al implementar |
|---|---|---|
| TTL-1 | Sin progreso, la llegada no se rescata | La puerta del 18 % desaparece — inválido |
| TTL-2 | Con ≥18 %, **se rescata solo** | **Falla** |
| TTL-3 | Con los topes gastados, no se rescata | Inválido tal cual |
| **TTL-4** | **Una parada con TTL expirado NO recibe rescate** | **Falla — y es lo que cambiamos** |
| TTL-5 | Fuera de AVENTURA el barrido no toca nada | Sigue valiendo |

**Cuando TTL-4 falle, será la señal esperada, no una regresión.** Conviene saberlo antes para
no perder media hora investigando un éxito.

**`RT-1` de `66-rescate-tramo-ruidoso.spec.js` también cae:** afirma literalmente
`toContain('No hemos podido confirmar')`, y el cartel pasa a decir que el rescate se ha
utilizado. Por eso **el texto de `TRADUCCIONES_RESCATE_TRAMO` va con el cambio de mecanismo,
no con las traducciones**: reescribirlo antes deja la tanda en rojo.

### Excluir las paradas nunca fue una decisión de diseño

La guía (§31.7) lo dice con todas las letras: *«Las paradas nunca reciben ningún rescate de
este TTL — **sigue siendo tarea pendiente** diseñar algo equivalente»*. Incluirlas no
contradice nada; cierra un hueco que la propia guía reconoce.

### Y el principio ya estaba en casa

El botón **⏩ de saltar reto** existe desde antes, y la guía lo describe así: *«Es un rescate
**visible y decidido por el usuario**, no un temporizador ciego»*. Es exactamente lo que
acordamos para la llegada. No estamos inventando una filosofía: la estamos extendiendo a
donde faltaba.

Eso deja el reparto de casos sin solapes, y **hay que preservarlo**:

| Qué le pasa al usuario | Qué usa | Qué le cuesta |
|---|---|---|
| El reto está roto, o no quiere hacerlo | El ⏩ que ya existe | **Nada** |
| El audio no está disponible | El botón de saltar audio | **Nada** |
| **No puede llegar al sitio** | El rescate | **Uno de sus 12** |

Cada fallo **nuestro** tiene salida gratis; solo se cobra el obstáculo del mundo real. **El
rescate no debe ser nunca la salida de un fallo técnico propio.**

## 6b. Un riesgo de implementación: la lista del Service Worker

`tools/build-sw.js` **solo recalcula `CACHE_VERSION`**. La lista de ficheros de `sw.js` es
**manual**, y nada comprueba que esté completa. Si la implementación saca algún módulo nuevo
y se olvida de añadirlo, el usuario sin cobertura no podrá cargarlo — que es exactamente el
usuario para el que existe el rescate.

*Comprobado de paso, y resiste: el asistente funciona sin cobertura. Sus cinco importaciones
(`constants`, `feedback-forms`, `logger`, `traducciones-ui`, `utils`) están en la caché, y la
única de segundo nivel también.*

## 7. La conclusión de fondo

Todo lo construido asume que **nada en pantalla espera una respuesta**. Los carteles se
pisan, se autocierran y se apartan; las capas superiores entran cuando quieren; los botones
se apagan por distancia, por reto o por modo. Nada de eso molesta mientras todo sea
informativo: si te pierdes un aviso, no pasa nada.

El momento en que el usuario decide si gasta algo irreversible es **el primer estado de la
app en el que interrumpir tiene un coste**. Por eso choca con todo.

No son veintitrés fallos sueltos: son **dos estados nuevos** en un sistema que no los
contemplaba.

El primero es que **algo en pantalla espera una respuesta**. Hasta ahora todo era
informativo: los carteles se pisan, se autocierran y se apartan, las capas superiores entran
cuando quieren, los botones se apagan por distancia, por reto o por modo. Si te pierdes un
aviso, no pasa nada. El momento en que el usuario decide si gasta algo irreversible es el
primero en el que interrumpir tiene un coste.

El segundo es que **un elemento puede completarse sin que su audio haya terminado**. Hoy esa
invariante se cumple siempre y es gratis, así que nadie la ha protegido — el hueco 22 es el
primero que asoma, y conviene sospechar de cualquier otra cosa que se apoye en ella. La confirmación probablemente no deba ser un cartel más, sino una pieza con sus
propias reglas — que no se cierre sola, que no la borre nadie, que nada se le ponga encima, y
que mientras esté viva los eventos esperen su turno.

---

## 8. Los tests

**Todos estos tests necesitan el stub de MapLibre** (`tests/e2e/helpers/maplibre-stub.js`),
sin excepción. Comprobar el cartel del minuto 8 y sus tres repeticiones exige avanzar más de
catorce minutos de reloj simulado, y sin el stub la espera de MapLibre (150 × 100 ms = 15 s)
corre sobre ese mismo reloj: al cruzar los 15 s se dispara un `alert()` real que desincroniza
el test. Cruzaríamos ese umbral decenas de veces. Si aparece un fallo de timing inexplicable,
mirar primero con `page.on('dialog', …)` si hay un `alert()` disparando.

Cada pieza con su rojo antes que verde:

- El barrido ya no gasta nada por su cuenta.
- El cartel sale en el minuto 8 y se repite en el 10, 12 y 14.
- Cerrar por cualquier vía —cartel, asistente, No— no gasta.
- El Sí gasta exactamente uno.
- Con cero restantes sale el cartel de agotados y no se descuenta nada.
- Una **parada** también se puede rescatar, y el elemento de **inicio** no.
- Tras el rescate, el botón de avanzar sigue encendido estando fuera de rango.
- **Ubicación queda apagada en la ventana entre el rescate y pulsar avanzar** — este es el
  que cae si alguien deshace ese arreglo.
- Con un reto abierto, tras el rescate el usuario puede avanzar.

---

## 9. Para probarlo en modo DEV

Entrar en AVENTURA con hijo5 (en producción se entra solo). Aterrizar en un elemento,
provocar el evento del audio para que nazca la ficha, y **no tocar hijo5 durante ocho
minutos**: hijo5 puede mandar `CAMBIO_PARADA`, y cada salto borra la ficha del elemento
anterior y reinicia el reloj.

Un usuario real **nunca pasa por CASA** durante su aventura: hijo5 ni siquiera se carga
fuera de dev, y en producción se entra directo en AVENTURA.

---

## 10. Estado: implementado

El mecanismo está completo y en el código. La referencia viva es **§25.19 de la
GUIA-COMPLETA**; este documento se queda como el registro de cómo se llegó hasta ahí — los
veinticinco huecos, las decisiones y por qué.

### Los huecos, uno a uno

| # | Qué era | Dónde se resolvió |
|---|---|---|
| 1, 2 | hijo6 nunca mandó una acción de usuario, y su envío era crudo | `CHAT.RESCATE_SOLICITADO` con acuse; handler que **devuelve** |
| 3 | Sin guard contra la doble pulsación | El handler ignora la petición si ya hay pantalla abierta |
| 4 | El elemento podía cambiar entre el cartel y el Sí | `_concederRescate()` exige el mismo id prometido |
| 5 | Ningún cartel sabía abrir el asistente | El botón del recordatorio pulsa `#btn-chat-soporte` |
| 6, 7 | La ficha no se persistía ni se creaba al activar | `ensurePending()` en `_hdl_NAVEGACION_CAMBIO_PARADA`: al reabrir, el elemento se activa otra vez y el reloj arranca |
| 8 | El barrido no miraba si el elemento estaba completo | Mira el elemento actual y sale si `llegada === true` |
| 9 | El recordatorio educado no salía nunca | Este **se impone**: llama a `_ocultarCualquierCartel()` |
| 10, 11, 12 | La confirmación como cartel: destruible, autocerrable, sin significado | `#decision-rescate` fuera de la lista, sin autocierre, solo botones |
| 13 | `retoActivo` dejaba los dos botones apagados tras pagar | `_hdl_RETO_OCULTAR()` antes de conceder |
| 14 | **Era falso**: el pulso no está por encima de todo | Está en 1900000, bajo el techo de 2000000 que la pantalla usa |
| 15 | El inicio entraba en el rescate | `motivo: 'es-inicio'` |
| 16 | El contador se miraba tarde | Se mira al recibir la petición |
| 17 | hijo6 puede recargarse debajo | Las pantallas las pinta el padre y sobreviven |
| 18 | El `{total}` del asistente no lo rellenaba nadie | Viaja en `construirEstadoChat()`, con el mismo cambio que el hueco 24 |
| 19 | Alejarse 5 km pierde el rescate concedido | Aceptado y escrito: a esa distancia no está bloqueado, se ha ido |
| 20 | El tiempo podía agotarse mientras decidía | Se comprueban los dos modales antes de conceder |
| 21 | Los botones podían quedar fuera de pantalla | Alto máximo, scroll interno y safe area |
| 22 | Un fin de audio tardío resucitaba una ficha | Guard `esDelElementoActual` |
| 23 | El gasto y su efecto no eran atómicos | `_cobrarRescateSiProcede()` al avanzar de verdad |
| 24 | El botón se pintaba siempre | Se esconde salvo que sirva — y con los rescates agotados **sí** se pinta |
| 25 | El hueco 23 y el texto §3.6 se contradecían | La pantalla enseña la cuenta de después; el desfase solo cae a favor del usuario |

### Lo que se retiró

El disparo automático entero: la puerta del 18 %, `progresoEnUltimoSkip`,
`_rescateTramoPendiente`, `_mostrarCartelRescateTramo` y `TRADUCCIONES_RESCATE_TRAMO`. El
barrido de 60 s no se borra — cambia de oficio y pasa a recordar.

Con él se fueron `42-ttl-tramo-saltos-seguridad.spec.js` y `66-rescate-tramo-ruidoso.spec.js`,
que probaban comportamiento que ya no existe. Sus dos afirmaciones aún válidas se conservan
dentro del spec 73: **RR-6** hereda TTL-5 (fuera de AVENTURA no pasa nada) y **RR-7** hereda
RT-3 (los topes son por aventura y nunca `undefined`).

### Lo que sigue abierto

**La repetición entre el párrafo 4 y el 6 de §3.2** — ver §4b. Los dos usan la imagen de la
ciudad cerrando el paso, con dos párrafos de por medio. Es lo único que queda, y es una
decisión de texto.
