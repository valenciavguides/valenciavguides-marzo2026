# El mapa completo de la mensajería duplicada

Cada iframe lleva **su propia copia** de los envoltorios de mensajería en vez de importar un
módulo común. Este documento es el recuento exhaustivo: qué hay, dónde, y en qué se
diferencian.

**Sin decidir todavía.** Hoy no hay ningún fallo vivo — eso está comprobado más abajo, camino
por camino. Lo que hay es una superficie de fallo grande y silenciosa.

---

## 1. No son seis hijos, son siete frames

La primera corrección al recuento anterior: **`En-busca-del-tesoro.html` también tiene el
juego completo** — `enviarMensaje`, `registrarControladorSeguro` y `messagingAdapter` — y no
aparecía en la lista.

| Frame | `enviarMensaje` | `enviarMensajeConConfirmacion` | `registrarControladorSeguro` | `adapterListener` |
|---|---|---|---|---|
| hijo1 — extrainfo | ✓ | — | ✓ | ✓ |
| hijo2 — coordenadas | ✓ | ✓ | ✓ | ✓ |
| hijo3 — audio | ✓ | — | ✓ | ✓ |
| hijo4 — retos | ✓ | ✓ | ✓ | ✓ |
| hijo5 — botón casa | ✓ | — | ✓ | ✓ |
| hijo6 — asistente | ✓ | ✓ | ✓ | **—** |
| **selección** | **✓** | — | **✓** | **✓** |

`puzzle.html`, `video-intro.html` y `mapa-completo.html` no tienen envoltorios: usan
`postMessage` crudo, y ninguno de los tres recibe mensajes salvo `mapa-completo`, que sí
valida el origen.

**El padre es el único que usa el bus de verdad.** Su `registrarControladorSeguro` delega en
`js/mensajeria.js`; los siete frames restantes no lo importan nunca.

---

## 2. Veintitrés copias, veintitrés implementaciones distintas

Comparadas normalizando espacios y quitando comentarios, para que solo queden las
diferencias reales:

| Pieza | Copias | Variantes distintas |
|---|---|---|
| `enviarMensaje` | 7 | **7** |
| `registrarControladorSeguro` | 7 | **7** |
| `adapterListener` | 6 | **6** |
| `enviarMensajeConConfirmacion` | 3 | **3** |

**Ni una sola coincide con otra.** Ya no son copias de nada: son veintitrés implementaciones
que hacen aproximadamente lo mismo. Los tamaños van de 347 a 2.316 caracteres para la misma
función.

---

## 3. El hallazgo de fondo: hay DOS contratos, y el central es el permisivo

Esto invierte lo que se creía. La pregunta es qué pasa cuando un handler **no devuelve nada**:

| Quién | Qué hace si el handler devuelve `undefined` |
|---|---|
| **`js/mensajeria.js`** (el bus, lo usa el padre) | **Confirma igual**, con `datos: undefined` |
| **hijo2** | **Confirma igual** |
| hijo1, hijo3, hijo4, hijo5, hijo6, selección | **No confirma** — el emisor agota reintentos |

El bus no filtra en ningún punto:

```js
const resultado = await Promise.resolve(handler(mensaje, event));
if (mensaje.requiereConfirmacion) {
    enviarConfirmacion(mensaje, resultado, event.source);   // sin mirar si es undefined
}
```

**Por qué importa esto más de lo que parece.** El comentario de `audio-hijo3.html` presenta
la regla estricta —devolver valor o no hay confirmación— como el contrato del mecanismo. Pero
el mecanismo central hace lo contrario, y **es justo la regla estricta la que causó aquel
bug**: si hijo3 hubiera seguido la del bus, un `return` olvidado habría confirmado igual y el
audio nunca se habría dado por escuchado sin sonar.

O sea que hijo2 no es el raro. **hijo2 es el único de los seis que coincide con el bus**, y
son los otros seis los que divergen del comportamiento canónico.

Cuál de los dos contratos es el bueno es una decisión pendiente. Lo que no puede seguir es
que convivan sin que nadie lo sepa.

---

## 4. La misma lógica, en cuatro formas distintas

Confirmar es siempre lo mismo: comprobar tres condiciones y mandar un `postMessage`. Está
escrito de cuatro maneras:

| Frame | Dónde vive | Firma |
|---|---|---|
| hijo1 | comprobación en el punto de llamada **+** auxiliar | `_enviarAutoConfirmacion(eventData, resultado)` |
| hijo2 | **en línea**, sin auxiliar | — |
| hijo3 | todo dentro del auxiliar | `_enviarAutoConfirmacion(event, iframeId, resultado)` |
| hijo4 | **en línea** | — |
| hijo5 | **en línea** | — |
| hijo6 | dentro de su `registrarControladorSeguro` | — |
| selección | todo dentro del auxiliar | `_enviarConfirmacionAuto(iframeId, msgData, resultado)` |

Dos auxiliares con el **mismo propósito, nombres distintos y firmas distintas** — y encima
en orden distinto de argumentos.

---

## 5. Divergencias sueltas

**`hijo4` compara `globalThis.window`** donde los otros seis comparan `globalThis`, y lo hace
en **tres sitios**: `enviarMensaje`, `enviarMensajeConConfirmacion` y `adapterListener`. Hoy
son equivalentes —no hay ninguna variable local llamada `window` en ese fichero—, pero el
proyecto tiene una regla escrita precisamente sobre esto.

**Solo `hijo4` fija un plazo explícito** (`5000` ms) en su `enviarMensajeConConfirmacion`.
hijo2 y hijo6 dependen de lo que traiga el envoltorio por debajo.

**`hijo6` no compara el padre** en su `enviarMensajeConConfirmacion`, y su firma es
`(mensaje)` frente al `(...args)` de hijo2 y hijo4. Devuelve además `event.data.datos`
mientras las otras dos resuelven vacío — deliberado, porque el rescate necesita la respuesta.

**`hijo6` avisa cuando no confirma; los otros cinco callan.** Si un handler no devuelve
valor, hijo6 escribe un aviso explicando que el emisor agotará su plazo. Es la única copia
que no falla en silencio.

**`hijo6` no tiene `messagingAdapter`**: su confirmación vive dentro de su propio
`registrarControladorSeguro`.

---

## 6. Un mensaje sin handler se comporta al revés en cada lado

En el bus, si llega un mensaje con acuse y **no hay handler registrado**:

```js
} else if (mensaje.requiereConfirmacion) {
    enviarConfirmacion(mensaje, null, event.source);   // confirma igualmente
}
```

En los siete frames, el `adapterListener` solo existe para los tipos registrados. Si nadie
registró ese tipo, **no hay ningún listener que responda** y el emisor espera hasta agotar su
plazo.

Mismo escenario, dos finales opuestos, y ninguno de los dos está escrito en la guía.

---

## 7. Los caminos vivos, uno por uno

Handlers que **no devuelven valor**: 60 de 84 en total (hijo1 2/11, hijo2 15/20, hijo3 10/14,
hijo4 15/18, hijo5 11/14, hijo6 7/7).

Eso solo importa donde el emisor **pide acuse**. Son cinco caminos, y **los cinco funcionan
hoy**:

| Camino | Tipo | Estado |
|---|---|---|
| padre → hijo3 | `AUDIO.REPRODUCIR_REQUEST` | ✅ devuelve valor *(es el que se arregló)* |
| padre → hijo2 | `DATOS.COORDENADAS_PARADAS_REQUEST` | ✅ devuelve valor |
| hijo2 → padre | — | ✅ el padre confirma vía bus |
| hijo4 → padre | — | ✅ ídem |
| hijo6 → padre | `CHAT.RESCATE_SOLICITADO` | ✅ ídem, cubierto por el spec 70 |

**Conclusión: no hay ningún fallo vivo.** Lo que hay es que cada camino nuevo que pida acuse
cae en una lotería de siete contratos.

---

## 8. Seguridad: revisado y limpio

Los 28 listeners de `message` del proyecto **validan todos** el origen, la fuente, o ambos.

Dos parecían no validar y **eran un error de medición**: `_handlePreModuleMessage` del padre
delega en `_isValidPreModuleSource()`, y el `listenerWrapper` de selección delega en
`adapterListener`. Los dos comprueban `origin` **y** `source`.

---

## 9. Qué habría que decidir

En este orden, porque el primero condiciona a los demás:

1. **Cuál de los dos contratos manda.** ¿Confirmar siempre, como el bus y hijo2? ¿O exigir
   valor de retorno, como los otros seis? No se puede unificar nada sin responder esto.
2. **Qué pasa con un mensaje sin handler**: ¿confirmar con `null` o dejar que expire?
3. **Unificar los envoltorios** en un módulo de `js/` que los siete importen.
4. **Reconciliar `globalThis.window` de hijo4** con los otros seis.
5. **Llevar el aviso de "handler sin return" a todos**, que hoy solo lo tiene hijo6.
6. **Escribir el contrato en la guía**, que hoy no está en ningún sitio central — y lo poco
   que hay escrito (el comentario de hijo3) describe el contrato de los hijos, no el del bus.
7. **Revisar hijo1 y hijo5**, que tienen adapter pero ningún envío con acuse: falta saber si
   es porque no lo necesitan o porque nadie se dio cuenta.

---

## 10. Por qué no se toca ahora

Tocar siete ficheros a la vez, en el mecanismo por el que pasa **toda** la comunicación de la
app, es meter riesgo donde hoy no hay ninguno. El rescate a petición se construyó a sabiendas
sobre la tercera copia de `enviarMensajeConConfirmacion` para no meter esta unificación en su
camino crítico.

Cuando se aborde, la pregunta 1 va primero. Todo lo demás depende de ella.
