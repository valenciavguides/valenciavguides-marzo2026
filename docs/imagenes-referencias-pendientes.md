# Fotos de las referencias: lo que falta por emparejar

Estado actualizado a 2026-10-21. Documento de trabajo, no de arquitectura: cuando no quede nada
pendiente, se borra.

Cada referencia de `js/coordenadas-aventuras.js` lleva un campo `imagen` con la foto del
monumento. La usa el popup de `mapa-completo.html`; las 89 asignaciones de Aventura34km se
usaron para componer las tarjetas fotográficas de su mapa vintage.
Cuando el campo falta —o apunta a un fichero que no existe— **no casca nada**: sale un icono
genérico y el fallo pasa desapercibido.

## Cómo regenerar esto

```bash
node tools/imagenes-referencias.js                 # las 7 aventuras
node tools/imagenes-referencias.js Aventura34km    # solo una
```

El emparejador compara nombres por palabras, descartando las que no distinguen (`de`, `la`,
`plaza`, `san`, `valencia`…). **Propone, no decide.** Marca `PROBABLE` cuando una candidata
gana claramente a las demás, y `dudosa` cuando hay empate o nada parecido.

## Estado actual de referencias

Todas las referencias de las siete aventuras tienen una asignación `imagen`. En Aventura34km no se cuentan `REF-V1` ni `REF-V5`, porque no se dibujan en el mapa.

| Aventura | Referencias | Con asignación | Sin asignación |
|---|---:|---:|---:|
| Aventura1 | 23 | 23 | 0 |
| Aventura2 | 17 | 17 | 0 |
| Aventura3 | 35 | 35 | 0 |
| Aventura4 | 44 | 44 | 0 |
| Aventura5 | 21 | 21 | 0 |
| AventuraFallas | 21 | 21 | 0 |
| Aventura34km | 89 | 89 | 0 |

Las referencias ya no están pendientes de emparejar. Los nombres de archivo y sus referencias usan la misma convención: minúsculas, guiones bajos, sin acentos y una sola extensión. Quedan por integrar más adelante las imágenes dependientes del idioma. El mapa vintage de Aventura34km ya se ha compuesto con las 89 fotos asignadas en las coordenadas; no hace falta consultar el USB.

## Convención de nombres de imagen

Los archivos de `imagenes/imagenes-aventuras/` y sus referencias en el código y los documentos usan nombres en minúsculas, con guiones bajos, sin acentos y con una sola extensión. Se conserva la extensión real de cada archivo, como `.jpg` o `.jpeg`.

## Mapa vintage de Aventura 34 km

Composición actualizada el 2026-10-21 y conectada en `js/mapa-vintage-aventuras.js`.
Usa como base el recorrido satélite con sus 89 marcadores. Las 41 fotos del núcleo más denso
se ordenan por referencia en una cuadrícula abajo a la izquierda: cinco filas de siete tarjetas
y una última fila de seis tarjetas más anchas, sin huecos y con un marco naranja. La foto 01,
que marca el inicio de la ruta, queda fuera de la cuadrícula como tarjeta destacada, con marco y
chapa naranja de mayor tamaño; la foto 75 ocupa su antigua casilla de la cuadrícula. Las fotos
25 y 26 quedan completas y visibles, fuera de la cuadrícula, sin que las cubran las fotos 33 y
34. Un círculo naranja señala el centro urbano y pasa por debajo de los marcadores, la ruta azul
y las tarjetas 61, 62 y 63.

Las fotos 03 y 57 aprovechan espacios libres; las tarjetas 01, 03 y 57 se conectan con sus
marcadores mediante líneas guía naranjas. Se ampliaron las chapas de las tarjetas sueltas y de
la cuadrícula; también se eliminaron las chapas blancas residuales de las referencias 88 y 89.
Las referencias 27/28 y 58/59 comparten imagen en `js/coordenadas-aventuras.js` y se muestran
una sola vez, con los números unidos en su tarjeta. El mapa muestra 87 tarjetas para las 89
referencias y mantiene legibles los números de los marcadores y la polilínea azul.

| Fichero | Tamaño | Peso |
|---|---|---|
| `Av34km_Mapa.jpg` | 2481×1755 | 2,27 MB |
| `Av34km_Mapa_ALTA_RESOLUCION.jpg` | 3968×2808 | 4,96 MB |
| `Av34km_Mapa_base_sin_fotos.jpg` | 3968×2808 | 4,82 MB |

Satélite de **ArcGIS World_Imagery** —la misma capa del selector de tipo de mapa—, los 1.084
puntos reales de la ruta con doble trazo (halo blanco debajo, azul de la app encima) y las 89
chapas numeradas. Las referencias `v1` y `v5` **no se dibujan**: caen dentro de Jardines de
Viveros y con el número de Viveros basta.

`Av34km_Mapa_base_sin_fotos.jpg` conserva la base original para rehacer la composición. El
mapa de alta resolución es el que enlaza Aventura34km. Los mapas vintage de las siete
aventuras admiten zoom y desplazamiento en los dos sitios donde se muestran: pellizco y
arrastre en móvil, rueda y doble clic en ordenador, y controles visibles para acercar, alejar
y restablecer.

## Asignaciones confirmadas

Las asignaciones del bloque de coordenadas del Word están reflejadas en `js/coordenadas-aventuras.js`, con las rutas y grafías reales de los archivos del proyecto.

- Aventura34km REF-42 → `museo_almoina_2.jpg`.
- `Av34km-P-137` y `Av34km-TR-97` → `cortes_valencianas.jpg` (Palacio de los Borgia).
- También están aplicadas las elecciones anotadas para las referencias 6, 21, 30, 33, 34, 35, 41, 51, 58, 59, 64, 65, 82, 83, 85, 86 y 87 de Aventura34km.
- Aventura4 REF-32 → `viveros_paseo_poetas_2.jpg`.
- Aventura5 REF-18 → `museo_prehistoria_far.jpg`; REF-19 → `museo_prehistoria_front.jpg`.
- Aventura34km REF-79 → `jardin_glorieta.jpeg`.
- `Av34km-P-60` (Plaza Décimo Junio Bruto, bloque sobre la historia de la Basílica) → `publico/imagenes/plaza_de_la_almoina.jpg`.

### Imágenes que dependen del idioma — pendientes de integrar

Esta lista se transcribe del inicio del Word para implementarla más adelante según el idioma elegido por el usuario. No está aplicada a `coordenadas-aventuras.js`. Se mantienen los nombres tal como aparecen en el Word; extensiones, rutas exactas y posibles erratas se comprobarán al integrar estas imágenes desde `imagenes/imagenes-idiomas/`.

| Aventura | Parada o alcance | Nombre(s) indicado(s) en el Word |
|---|---|---|
| AventuraFallas | Parada 5 | `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2`, `arquitectura-iglesia`, `arquitectura-iglesias` |
| AventuraFallas | Paradas 6 y 11 | `fallero`, `Fallera` |
| AventuraFallas | Parada 2 | `soldado-cristiano`, `castillofuego-partes` |
| AventuraFallas | Parada 14 | `mascletafuego-partes` |
| Aventura1 | Parada 5 | `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2`, `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura1 | Parada 10 | `arcos` |
| Aventura1 | Parada 28 | `arcos`, `arcos-evolucion` |
| Aventura2 | Parada 6 | `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura2 | Parada 19 | `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2`, `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura2 | Parada 5 | `arcos`, `arcos-evolucion`, `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2` |
| Aventura3 | Parada 29 | `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2`, `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura34km | Parada 54 | `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2`, `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura4 | Parada 2 | `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura5 | Parada 34 | `arquitectura-gotica`, `arquitectura-detalles`, `arquitectura-detalles-2`, `arquitectura-iglesia`, `arquitectura-iglesias` |
| Aventura3 | Parada 25 | `arcos`, `arcos-evolucion` |
| Aventura5 | Parada 9 | `arcos`, `arcos-evolucion`, `puentes` |
| Aventura4 | Parada 23 | `arcos`, `arcos-evolucion`, `puentes` |
| AventuraFallas | Parada 16 | `falla-partes` |
| Todas | Paradas de Torres de Serranos | `murallas-valencia`, `arquitectura-defensiva`, `arquitectura-civil`, `muralla-construccion-partes` |

Las grafías `castillofuego-partes` y `mascletafuego-partes` se mantienen tal como aparecen en el Word; podrían ser erratas y se verificarán contra los archivos reales al integrar la lista.
