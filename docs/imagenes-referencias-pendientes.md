# Fotos de las referencias: lo que falta por emparejar

Estado a 2026-09-15. Documento de trabajo, no de arquitectura: cuando no quede nada
pendiente, se borra.

Cada referencia de `js/coordenadas-aventuras.js` lleva un campo `imagen` con la foto del
monumento. La usa el popup de `mapa-completo.html` y la va a usar el mapa de Aventura 34 km.
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

## Dónde estamos

| Aventura | Referencias | Con foto | Sin foto |
|---|---|---|---|
| Aventura1 | 23 | 23 | — |
| Aventura2 | 17 | 17 | — |
| Aventura3 | 35 | 35 | — |
| Aventura4 | 27 | 27 | — |
| **Aventura5** | 21 | 19 | **2** |
| AventuraFallas | 21 | 21 | — |
| **Aventura34km** | 89 | 70 | **19** |

Cinco aventuras están cerradas. Quedan **21 referencias** entre la 5 y la de 34 km.

## Aventura 5 — 2 pendientes

Las dos **sin campo `imagen`**, no es que apunten mal:

| Nº | Referencia | Candidatas |
|---|---|---|
| 18 | Museo de Prehistoria de Valencia | `museo_prehistoria-front.jpg`, `museo_prehistoria_close.jpg` |
| 19 | Museo de Etnología de Valencia | ninguna clara |

Son las mismas dos que faltan en la de 34 km (allí con los números 58 y 59), así que se
resuelven juntas.

## Aventura 34 km — 19 pendientes

### Las que el nombre canta

| Nº | Referencia | Fichero que parece el suyo |
|---|---|---|
| 33 | Real Parroquia de los Santos Juanes | `iglesia_san_juan_del_mercado.jpg` |
| 35 | Plaza del Doctor López Collado | `Plaza_collado.jpg` *(única candidata)* |
| 65 | Jardín de las Hespérides | `Jardin_de_las_Hesperides.jpg.jpg` |
| 82 | Santo Tomás Apóstol y San Felipe Neri | `iglesia_san_felipe_neri.jpg` |
| 83 | Iglesia de San Juan del Hospital | `iglesia_san_juan_del_hospital.jpg` |
| 86 | Cripta de San Vicente Mártir | `cripta_san_vicente_martir.jpg` |
| 30 | Banco Central de Valencia | `banco_de_valencia.jpg` |
| 51 | Torre del Ángel (árabe) | `torre-del_angel_arabe.jpg` |
| 64 | Jardín Botánico | `botanico.jpeg` |
| 79 | Jardín de la Glorieta | `jardin-glorieta.jpeg` |

### Las que tienen varias versiones — hay que elegir cuál

| Nº | Referencia | Opciones |
|---|---|---|
| 42 | Museo Arqueológico de la Almoína | `museo_la_almoina.jpg` · `museo_almoina_2.jpg` · `almoina_escultura.jpg` |
| 58 | Museo de Prehistoria | `museo_prehistoria-front.jpg` · `museo_prehistoria_close.jpg` |
| 85 | Museo de la Ciudad | `museo_ciudad.jpg` · `museo_ciudad_2.jpg` · `museo_ciudad_3.jpg` |
| 34 | Lonja de la Seda | `lonja.jpg` · `Lonja-puerta-visitante.jpg` |
| 6 | Puente del Mar | `puente_mar_bajada.jpg` · `puente_amarillo.jpg` |

### Las que necesitan tu ojo

| Nº | Referencia | Situación |
|---|---|---|
| **87** | Almudín | **Existe, pero mal escrita**: `Museo_Amudín_Exterior.jpg`, sin la ele. Por eso el emparejador no la encontró. Hay dos: `_Exterior` y `_Exterior_2` |
| 21 | Puerta del Mar | Ninguna candidata se parece |
| 41 | Real Basílica de los Desamparados | Las candidatas son de **otras** basílicas |
| 59 | Museo de Etnología | Ninguna candidata se parece |

## Trampas de nombres de fichero

Esto no es manía: **en GitHub Pages una ruta que no coincida exactamente es un 404**, y en
Windows no se nota. Es justo la clase de fallo que solo aparece en la PWA real.

**Doble extensión**, siete ficheros. Funcionan, pero el `.jpg.jpg` hay que escribirlo entero
en la referencia:

`Jardin_de_las_Hesperides.jpg.jpg` · `mel.jpg.jpg` · `plataforma_naturia.jpg.jpg` ·
`ruinas_metro_colon.jpg.jpg` · `santo_domimgo_pano.jpg.jpg` · `torre-del_angel_arabe_2.jpg.jpg` ·
`turia_zona_descanso.jpg.jpg`

**Mayúsculas sueltas**: `Plaza_collado.jpg`, `Iglesia_San_juan_cruz.jpg`,
`Lonja-puerta-visitante.jpg`, `Museo_Amudín_Exterior.jpg`, `Jardin_de_las_Hesperides.jpg.jpg`.

**Dos extensiones conviviendo**: las fotos subidas el 2026-09-14 son `.jpeg` y el resto
`.jpg`. Da igual cuál, pero la referencia tiene que decir exactamente la del fichero.

**Erratas dentro del nombre**: además del `Amudín` sin ele, hay `santo_domimgo_pano.jpg.jpg`
(*domimgo*) y `cripta_san_vicemte_martir_2.jpg` (*vicemte*). Se pueden dejar así mientras la
referencia las copie tal cual.

## El mapa de Aventura 34 km

Generado el 2026-09-15, **sin conectar todavía**: la línea de `Aventura34km` sigue comentada
en `js/mapa-vintage-aventuras.js`.

| Fichero | Tamaño | Peso |
|---|---|---|
| `Av34km_Mapa.jpg` | 2481×1755 | 2,31 MB |
| `Av34km_Mapa_ALTA_RESOLUCION.jpg` | 3968×2808 | 4,60 MB |

Satélite de **ArcGIS World_Imagery** —la misma capa del selector de tipo de mapa—, los 1.084
puntos reales de la ruta con doble trazo (halo blanco debajo, azul de la app encima) y las 89
chapas numeradas. Las referencias `v1` y `v5` **no se dibujan**: caen dentro de Jardines de
Viveros y con el número de Viveros basta.

Se generan con los scripts de la carpeta temporal de la sesión; si hay que rehacerlo, el
procedimiento es cargar Leaflet con esa capa, pintar ruta y chapas, esperar a que **no quede
ninguna tesela pendiente** (contando `tileloadstart` contra `tileload`/`tileerror`, no un
tiempo fijo) y capturar con Playwright a `deviceScaleFactor: 1` y viewport grande — así las
teselas salen a resolución nativa en vez de estiradas.

### Lo que hay que decidir

**Las fotos no caben encima del mapa.** Son ~30 referencias en 600 m en el casco antiguo: a
la escala a la que 5,3 km entran en una pantalla, no hay resolución que lo arregle. Es
geometría.

**La propuesta sobre la mesa:** el hueco inferior izquierdo son unos 1.400×900 px sin usar
—casi el 40 % de la imagen— porque la ruta es diagonal y el recorte rectangular. Ahí caben
las 89 miniaturas en una rejilla, numeradas, como en los mapas turísticos de siempre. No
tapan la ruta, se ven todas del mismo tamaño y el hueco deja de desperdiciarse.

**Y un límite que condiciona todo:** el overlay del mapa vintage **no hace zoom**
(`object-fit: fill` dentro de un contenedor con `overflow: hidden`). La imagen se aplasta al
tamaño de la pantalla, mida lo que mida el original. Mientras siga así, la versión de alta
resolución no aporta nada; si se le añade pinch-zoom, pasa a ser la buena.
