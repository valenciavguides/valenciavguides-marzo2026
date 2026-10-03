# Licencias de los efectos de sonido

Los cuatro efectos de esta carpeta proceden de Pixabay (<https://pixabay.com/>), según el propietario del proyecto, y se rigen por la **Pixabay Content License** (<https://pixabay.com/service/license-summary/>), que cubre también audio y efectos de sonido:

- Uso comercial permitido.
- Atribución no obligatoria (agradecida).
- Modificación y adaptación permitidas.
- **Prohibido vender o distribuir el contenido en solitario** («on a Standalone basis»), tal cual y sin aplicarle trabajo creativo.
- Prohibido usar contenido con marcas, logotipos o marcas comerciales reconocibles con fines comerciales.

| Fichero | Lo pide | Página de Pixabay (autor y título) |
|---|---|---|
| `sonido_eleccion_respuesta_reto.mp3` | `retos-hijo4.html` | pendiente de anotar |
| `sonido_pieza_colocada.mp3` | `puzzle.html` | pendiente de anotar |
| `sonido_reto_completado.mp3` | `puzzle.html`, `retos-hijo4.html` | pendiente de anotar |
| `sonido_tiempo_acabado.mp3` | `puzzle.html`, `retos-hijo4.html`, `codigo-padre.html` | pendiente de anotar |

## Modificaciones

Recodificados a 128 kbps CBR (MPEG-1 Capa III) con `ffmpeg -i entrada.mp3 -c:a libmp3lame -b:a 128k salida.mp3`. Misma frecuencia de muestreo, mismos canales y misma duración que los originales; sin recortes. `sonido_eleccion_respuesta_reto.mp3` lleva además compresión suave y ganancia para quedar a la altura de los otros tres (`-af "acompressor=threshold=0.05:ratio=3:attack=2:release=120:makeup=6.5,alimiter=limit=0.944:attack=1:release=30:level=0"`, aplicado sobre el original de 256 kbps); los otros tres conservan el nivel de su original. Ver la guía, §12, «Efectos de sonido».
