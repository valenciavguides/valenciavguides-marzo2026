# Personas con dificultades

Lo pendiente para que la aplicación la puedan usar personas ciegas o con poca visión, personas con movilidad reducida y
personas con dificultades cognitivas (lectura fácil). Cada punto se anota aquí en cuanto aparece y se resuelve más
adelante, con decisión del usuario; mientras tanto no se toca.

Cada entrada dice qué hay en el código, cómo se ha comprobado y qué falta decidir.

## 1. Personas ciegas o con poca visión

El lector de pantalla del teléfono (VoiceOver en iPhone, TalkBack en Android) lee en voz alta los textos que no se ven:
el `alt` de las imágenes y el `title` y el `aria-label` de los botones. Muchos botones de la aplicación son solo un icono,
así que, para quien no ve, ese texto es el botón.

### 1.1 Los textos que no se ven están en español en los 12 idiomas

- **Qué hay.** Los `alt`, `title` y `aria-label` están escritos como texto fijo en español en el HTML y en el JavaScript
  de cada frame, y ninguno pasa por `js/traducciones-ui.js`: no hay ningún mecanismo que traduzca atributos (búsqueda de
  `data-i18n`, `aplicarTraducciones` y `traducirAtributos` en los HTML de la raíz y en `js/`: 0). Ejemplos del padre: los
  botones de la barra de audio («Abrir controles de audio», «Saltar audio no disponible», «Volver a escuchar»), los de los
  carteles de GPS («Reintentar ubicación», «Cerrar overlay», «Activar permisos GPS») y las imágenes de esos carteles
  («Señal GPS poco fiable», «GPS sin señal», «Sin conexión a internet»).
- **Cuántos.** Al menos 133 textos distintos: el padre 70, la selección 22, hijo1 16, hijo2 11, hijo4 4, hijo6 3,
  `sin-conexion.html` 3, y uno en hijo3, el puzzle, video-intro e `index.html`. Medido buscando literales con letras en
  `alt=`, `title=`, `aria-label=` y `placeholder=` (en el HTML y en las plantillas de JavaScript), en las asignaciones
  `.alt =`, `.title =` y `.placeholder =`, y en `setAttribute(…)`, sobre los HTML de la raíz y `js/*.js` (sin los ficheros
  de datos de las aventuras). Contando una vez el texto que casa con dos búsquedas (`img.alt = '…'`), y sin el `alt` del
  logo («València be Guides») que llevan los textos de términos y agradecimientos, que es un nombre propio. El barrido deja
  15 líneas sin leer, y no todas son variables traducidas: en el padre hay literales elegidos con una condición (las flechas
  de la galería, «Primera imagen» / «Imagen anterior» y «Última imagen» / «Imagen siguiente», y el `alt` de respaldo
  «Imagen de la parada») y nombres que llegan por variable (los estilos y los modos de cámara del mapa: «Satélite»,
  «Callejero», «Nocturno», «Norte fijo»…), que no entran en la cuenta. Antes de traducirlos, rehacer la lista fichero por
  fichero.
- **Lo que no cuadra.** Quien usa la aplicación en cualquiera de los otros 11 idiomas oye en español lo que el lector de
  pantalla dice de los botones y de las imágenes.
- **Pendiente: decidir** si pasan a `js/traducciones-ui.js`, en los 12 idiomas y de usted, y con qué mecanismo se ponen en
  cada atributo (hoy no hay ninguno).

### 1.2 Seis textos tutean

La aplicación habla de usted; estos seis, de tú:

- los `alt` de cuatro carteles de distancia, en `codigo-padre.html`: «Estás lejos de tu objetivo», «Estás fuera de
  rango», «Te has desviado de la ruta» y «Estás muy lejos de tu objetivo»;
- dos tooltips del mapa, en `js/funciones-mapa.js`: «Tu destino» y «Tu ubicación ±N m».

Encontrados buscando «Estás», «Te has», «Tu», «Pulsa» y «Toca» en los `alt`, `title` y `aria-label`, y «Tu ubicación»
aparte, porque se compone en ejecución. Una búsqueda por patrón no demuestra que no haya más.

### 1.3 Datos internos en los tooltips del mapa

- El marcador de cada parada lleva de `title` el id interno de la parada (`title: paradaId`, en `js/funciones-mapa.js`),
  por ejemplo «Av1-P-1»: el lector de pantalla lo lee tal cual.
- El de la flecha del usuario lleva, en AVENTURA, el ángulo en grados: «Tu ubicación ±8m (215°)».

### 1.4 Grafía y jerga

- Los textos visibles escriben «vídeo», con tilde (`js/traducciones-ui.js`); los que no se ven, «video», sin ella:
  «Cerrar video» (padre), «Reproducir Video» (hijo2), «Video intro» (selección y hijo6).
- El botón del mapa antiguo, en hijo2, lleva de `title` «Mostrar Mapa JPG» (`coordenadas-hijo2.html`): jerga técnica.

## 2. Personas con movilidad reducida

Sin puntos anotados todavía.

## 3. Lectura fácil (dificultades cognitivas)

Sin puntos anotados todavía.
