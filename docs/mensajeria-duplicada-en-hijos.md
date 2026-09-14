# La mensajería de los hijos está copiada seis veces

Cada uno de los seis iframes hijo lleva **su propia copia** de los envoltorios de
mensajería, en vez de importar un módulo común. Esto no está roto hoy, pero las copias ya
han empezado a separarse.

**Sin decidir. Anotado para revisarlo con calma**, no para arreglarlo sobre la marcha: hoy
funciona, y tocar seis ficheros a la vez es meter riesgo donde no hace falta.

---

## Qué tiene cada hijo

| Hijo | `enviarMensaje` | `enviarMensajeConConfirmacion` | `registrarControladorSeguro` | `messagingAdapter` |
|---|---|---|---|---|
| hijo1 — extrainfo | ✓ | — | ✓ | ✓ |
| hijo2 — coordenadas | ✓ | **✓** | ✓ | ✓ |
| hijo3 — audio | ✓ | — | ✓ | ✓ |
| hijo4 — retos | ✓ | **✓** | ✓ | ✓ |
| hijo5 — botón casa | ✓ | — | ✓ | ✓ |
| hijo6 — asistente | ✓ | — | ✓ | **—** |

Seis copias de `enviarMensaje`. Seis de `registrarControladorSeguro`. Cinco de
`messagingAdapter`. Dos de `enviarMensajeConConfirmacion`.

Ninguno importa `js/mensajeria.js`: todos hacen `postMessage` directo al padre, con
`globalThis.mensajeria.*` solo como respaldo para cuando no están dentro de un iframe.

---

## Las divergencias que ya existen

**`hijo4` compara distinto.** Usa `globalThis.parent !== globalThis.window` donde los otros
cinco usan `globalThis.parent !== globalThis`.

Hoy son equivalentes —comprobado: no hay ninguna variable local llamada `window` en
hijo4—, pero el proyecto tiene una regla escrita precisamente sobre esto: antes de cambiar
`window.` por `globalThis.` hay que buscar variables locales con ese nombre. El día que
aparezca una, esa copia se comportará distinto de las otras cinco y nada lo delatará.

**`hijo6` llega al mismo sitio por otro camino.** Desde `694ddd4` sabe auto-confirmar, pero
la confirmación está **dentro de su propio `registrarControladorSeguro`**, no en un
`messagingAdapter` como los otros cinco. Se hizo así a propósito, para no tocar su arranque
en el camino crítico del rescate — pero deja una variante estructural más.

**`hijo6` avisa cuando no confirma; los otros cinco no.** Si un handler no devuelve valor,
hijo6 escribe un `logger.warn` explicando que no se confirma y que el emisor agotará
reintentos. Los cinco restantes callan. Esa asimetría es deliberada y va en la dirección
correcta, pero es asimetría.

---

## Por qué importa, con el caso real

En `audio-hijo3.html` hay un comentario que documenta lo que cuesta este mecanismo cuando
falla en silencio:

> *«Sin este return, el padre —que pide este mensaje con `enviarMensajeConConfirmacion`—
> nunca recibía su `SISTEMA.CONFIRMACION`, agotaba sus dos intentos y llamaba a
> `_marcarAudioNoDisponible()`, que da el audio por escuchado (`pending.audio = true`) sin
> que sonara un segundo. Pasaba en TODAS las paradas, también con el fichero presente y
> sonando bien.»*

El contrato del mecanismo —**el handler tiene que devolver un valor o no se confirma**— no
está escrito en ningún sitio central. Está implícito en cinco copias, y quien escriba un
handler nuevo no tiene forma de enterarse hasta que algo falla sin explicación.

---

## Lo que habría que revisar cuando se aborde

- **Unificar los envoltorios** en un módulo de `js/` que los seis importen, o al menos los
  tres que el rescate va a tocar.
- **Reconciliar la comparación de hijo4** con la de los otros cinco.
- **Decidir si hijo6 adopta `messagingAdapter`** o si su versión propia se queda.
- **Llevar el aviso de "handler sin return" a los otros cinco**, que hoy callan.
- **Escribir el contrato** —devolver valor o no hay confirmación— donde se vea: en la guía y
  en el propio módulo, no repartido por seis ficheros.
- **Revisar hijo1 y hijo5**, que tienen adapter pero ningún envío con confirmación: hay que
  comprobar si es porque no lo necesitan o porque nadie se dio cuenta de que les faltaba.

---

## Lo que se hizo hoy, y que hay que recordar

**`694ddd4`** — hijo6 pasó a auto-confirmar, con su lógica dentro de su propio registrador.

**Pendiente en el camino del rescate a petición:** hijo6 necesita además
`enviarMensajeConConfirmacion` para **enviar** la petición con acuse. Eso será **la tercera
copia** del mismo envoltorio. Se hace así a sabiendas, para no meter la unificación en el
camino crítico — pero queda apuntado aquí para que no se pierda.

Ver `docs/rescate-a-peticion.md` para el diseño que motivó este hallazgo.
