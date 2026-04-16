# Valencia VGuides — Guía Completa de la Aplicación

> **Versión**: 1.0.0  
> **Dominio**: valenciavguides.es  
> **Última actualización**: Abril 2026

---

## Índice

1. [¿Qué es Valencia VGuides?](#1-qué-es-valencia-vguides)
2. [Cómo funciona a vista de pájaro](#2-cómo-funciona-a-vista-de-pájaro)
3. [Iconografía visual: emojis, marcadores y polylines](#3-iconografía-visual-emojis-marcadores-y-polylines)
4. [La arquitectura padre-hijo (iframes)](#4-la-arquitectura-padre-hijo-iframes)
5. [El código padre: el cerebro de todo](#5-el-código-padre-el-cerebro-de-todo)
6. [Las páginas hijo y qué hace cada una](#6-las-páginas-hijo-y-qué-hace-cada-una)
7. [Cómo se comunican padre e hijos (mensajería)](#7-cómo-se-comunican-padre-e-hijos-mensajería)
8. [Las aventuras: estructura y flujo completo](#8-las-aventuras-estructura-y-flujo-completo)
9. [Los datos de la aplicación](#9-los-datos-de-la-aplicación)
10. [Idiomas y traducciones](#10-idiomas-y-traducciones)
11. [El mapa y el GPS](#11-el-mapa-y-el-gps)
12. [Los audios](#12-los-audios)
13. [Los retos y puzzles](#13-los-retos-y-puzzles)
14. [Los textos narrativos](#14-los-textos-narrativos)
15. [Los vídeos](#15-los-vídeos)
16. [El backend (servidor)](#16-el-backend-servidor)
17. [Seguridad y protección](#17-seguridad-y-protección)
18. [El sistema de tests](#18-el-sistema-de-tests)
19. [PWA y Service Worker](#19-pwa-y-service-worker)
20. [Estructura de carpetas](#20-estructura-de-carpetas)
21. [Cómo arrancar la aplicación en local](#21-cómo-arrancar-la-aplicación-en-local)
22. [Preparación para producción](#22-preparación-para-producción)
23. [Glosario de términos](#23-glosario-de-términos)
24. [La experiencia del usuario: narrativa completa del modo AVENTURA](#24-la-experiencia-del-usuario-narrativa-completa-del-modo-aventura)
25. [Los controladores JS: roles, comunicación e inicialización](#25-los-controladores-js-roles-comunicación-e-inicialización)

---

## 1. ¿Qué es Valencia VGuides?

Valencia VGuides es una audioguía interactiva con GPS de la Valencia histórica. Es una aplicación web (funciona en el navegador del móvil) que guía a los turistas por las calles de Valencia a través de aventuras.

Cada aventura es un recorrido por distintos puntos de interés (llamados **paradas**). En cada parada, el turista:

- Ve su posición en un **mapa interactivo** con estilo vintage.
- Escucha un **audio** explicando la historia del lugar.
- Lee un **texto narrativo** con información detallada.
- Resuelve un **reto** (pregunta, puzzle, o texto libre) para avanzar.
- Ve un **vídeo** relacionado con el monumento.

La aplicación soporta **6 idiomas**: español, inglés, francés, italiano, neerlandés y japonés.

Actualmente hay **7 aventuras planificadas**, aunque solo la **Aventura 1** (València centro histórico 1) está completamente disponible. Las demás están en desarrollo.

---

## 2. Cómo funciona a vista de pájaro

Imagina la aplicación como una **televisión con muchos canales**. La pantalla principal (el "padre") es el televisor, y cada canal es una página diferente (un "hijo") que se carga dentro del televisor.

```
┌──────────────────────────────────────────────┐
│           codigo-padre.html                   │
│           (el televisor)                      │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │    iframe activo (el canal visible)     │  │
│  │                                         │  │
│  │    Puede ser:                           │  │
│  │    - En-busca-del-tesoro.html           │  │
│  │    - coordenadas-hijo2.html (mapa)      │  │
│  │    - audio-hijo3.html                   │  │
│  │    - retos-hijo4.html                   │  │
│  │    - puzzle.html                        │  │
│  │    - etc.                               │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [Botón GPS]  [Botón Mapa]  [Botón Casa]     │
└──────────────────────────────────────────────┘
```

El padre decide qué hijo se ve. Los hijos le envían mensajes al padre ("he terminado el reto", "el usuario ha pulsado esto"), y el padre les responde ("vale, ahora muestra la parada 5", "cambia al modo aventura").

Todo esto ocurre mediante un sistema de **mensajes** llamado `postMessage`, que es la forma estándar en que los iframes se comunican en un navegador.

---

## 3. Iconografía visual: emojis, marcadores y polylines

> Referencia rápida de todos los elementos visuales que el usuario ve durante la aventura: emojis en la interfaz, marcadores en el mapa y líneas de ruta.

### 3.1. Emojis en las pantallas de selección (En-busca-del-tesoro.html)

Estos emojis aparecen durante las 14 pantallas de demo/selección, antes de que comience la aventura.

| Emoji | Dónde aparece | Para qué sirve |
|-------|---------------|-----------------|
| → | Botones de avanzar (P1, P4, P8, P10, P11, P13) | Flecha de navegación "ir a la siguiente pantalla" |
| ➜ | Botón grande del puzzle (P9) | Flecha gruesa para continuar tras completar el puzzle |
| ✓ | Botones verdes de confirmación (P3, P7), feedback de código correcto (P14) | Confirmar selección o indicar respuesta correcta |
| ✗ | Botones rojos de rechazo (P3, P7), feedback de código incorrecto (P14) | Cancelar selección o indicar respuesta incorrecta |
| 🎬 | Pantalla de vídeo (P10) | Placeholder para el vídeo introductorio (aún no implementado) |
| 💳 | Pantalla de pago (P13) | Icono de la pasarela de pago (aún no implementada) |
| 🔑 | Pantalla de activación (P14) | Indica que se necesita un código de acceso |
| ✒️ | Pantalla de activación (P14) | Acompañamiento visual del campo de entrada |
| ❓ | Pantalla de activación (P14) | Indica ayuda o instrucciones |
| 🚀 | Botón de iniciar aventura (P14) | Lanza la aventura al pulsarlo — es el botón más importante |
| 🔇 | Overlay de aviso (P7) | Indica que no hay audio disponible para la combinación idioma+aventura |

### 3.2. Emojis en los botones de selección de aventura (P6)

Cada aventura muestra una línea de estadísticas con emojis universales (no necesitan traducción):

| Emoji | Significado | Ejemplo |
|-------|-------------|---------|
| 👣 | Vehículo: a pie | Aventuras 1, 2 y Fallas |
| 🚲 | Vehículo: bicicleta | Aventuras 3, 4 y 5 |
| 🛴 | Vehículo: patinete | Aventuras 3, 4 y 5 (combinado con 🚲) |
| 🚲🛴👣 | Vehículo: mixto | Aventura 34km |
| 🏛️ | Número de monumentos | `🏛️19` = 19 monumentos |
| 📍 | Número de paradas | `📍41` = 41 paradas |
| 🧩 | Número de retos | `🧩30` = 30 retos |
| ⏳ | Tiempo máximo para completar | `⏳max60h` = 60 horas |

### 3.3. Emojis durante la aventura activa

Una vez en modo AVENTURA, estos emojis aparecen en la interfaz de juego:

| Emoji | Componente | Para qué sirve |
|-------|------------|-----------------|
| 🛰️ | Hijo 5 (botón casa) | Botón de activación/desactivación del GPS. Muestra "ON" (verde) en aventura, "OFF" (rojo) en casa |
| 🎯 | Hijo 5 (lista de paradas) | Identifica las **paradas** (puntos de interés) en la lista lateral |
| 🛣️ | Hijo 5 (lista de paradas) | Identifica los **tramos** (caminos entre paradas) en la lista lateral |
| 📌 | Hijo 5 (lista de paradas) | Identifica el **punto de inicio** de la ruta |
| ❓ | Hijo 5 (lista de paradas) | Tipo de punto desconocido (fallback) |
| ✖ | Hijo 2 (overlay fuera de rango) | Botón para cerrar el aviso de "estás fuera de rango" |
| 🔄 | Puzzle (puzzle.html) | Reiniciar el puzzle |
| ⏸️ / ▶️ | Puzzle (puzzle.html) | Pausar / reanudar el puzzle |
| ↑ | Mapa (funciones-mapa.js) | Flecha de orientación del dispositivo sobre la posición del usuario |

### 3.4. Emojis en los retos (hijo 4)

Los botones de los retos usan exclusivamente emojis — sin texto — para ser universales en todos los idiomas.

| Emoji / Elemento | Estado | Significado |
| ----------------- | ------ | ----------- |
| 🫵 fondo **azul** | Esperando respuesta | Botón de envío de respuesta. Siempre visible cuando hay un reto activo |
| 👍 fondo **verde** (deshabilitado) | Tras acertar | El botón de envío confirma visualmente que la respuesta fue correcta. No se puede volver a pulsar |
| 👎 fondo **rojo** (3 segundos) | Tras fallar | El botón de envío indica respuesta incorrecta. Después de 3 segundos vuelve automáticamente a 🫵 azul y se habilita para reintentar |
| 🆘❓ fondo **verde** | Siempre visible (excepto puzzles) | Muestra la respuesta correcta del reto. Solo disponible en retos normales |
| ➡️🎯 fondo **azul** | Antes de acertar | Botón para continuar la aventura. Deshabilitado hasta que se acierte |
| ➡️🎯 fondo **verde** | Tras acertar (o completar puzzle) | Habilitado: el usuario puede continuar a la siguiente parada |
| Borde **verde** del contenedor | Al acertar | Feedback visual de respuesta correcta |
| Borde **rojo** del contenedor | Al fallar | Feedback visual de respuesta incorrecta |
| Animación de **fuegos artificiales** (chispas de colores) | Al acertar (reto o puzzle) | Celebración visual. 15 explosiones con 30 chispas cada una |
| Vibración del móvil (300 ms) | Al fallar | Feedback háptico de error |

Los reintentos son ilimitados: el usuario puede seguir intentándolo hasta acertar. El botón ➡️🎯 solo se habilita cuando la respuesta es correcta.

### 3.5. Marcadores en el mapa

El mapa usa emojis y formas coloreadas como marcadores sobre las paradas:

| Marcador | Forma | Color | Cuándo aparece |
|----------|-------|-------|----------------|
| 📌 | Emoji chincheta | — | **Punto de inicio** de la ruta |
| 🎯 | Emoji diana | — | **Paradas** (puntos de interés) y **punto final** de la ruta |
| ● (círculo CSS) | Círculo sólido con borde blanco y sombra | `#F44336` rojo | Marcador de inicio alternativo |
| ● (círculo CSS) | Círculo sólido con borde blanco y sombra | `#4CAF50` verde | Marcador de parada alternativo |
| ● (círculo pulsante) | Círculo con relleno semitransparente | `#4285F4` azul Google | **Posición del usuario** en tiempo real. El radio del círculo refleja la precisión del GPS |
| ↑ (flecha) | Texto rotado según brújula | `#0066cc` azul oscuro | **Dirección** a la que apunta el dispositivo del usuario |

### 3.6. Polylines (líneas de ruta en el mapa)

Las polylines son las líneas que se dibujan en el mapa para mostrar rutas, tramos y navegación. Sus estilos varían según el tipo:

| Tipo de polyline | Color | Grosor base | Opacidad | Patrón | Cuándo se dibuja |
|-----------------|-------|-------------|----------|--------|------------------|
| **Ruta principal** | `#0077ff` (azul) | 6 px | 0.8 | Sólido | Al activar la aventura. Muestra todo el recorrido completo |
| **Tramo normal** | `#3388ff` (azul claro) | 4 px | 0.7 | Sólido | Al seleccionar un tramo específico entre dos paradas |
| **Tramo destacado** | `#ff4500` (naranja-rojo) | 6 px | 0.9 | Sólido | Cuando un tramo está activo o enfatizado (el actual) |
| **Línea de navegación** | `#3388ff` (azul claro) | 2 px | 0.7 | Discontinuo `10, 10` | Cuando el usuario está a más de 50 m de la ruta. Muestra el camino de vuelta |

**Escalado dinámico:** Todos los grosores se multiplican por un factor de escala que depende del tamaño de la pantalla y el nivel de zoom del mapa. La función `getPolylineEscalado()` calcula los valores finales.

**Comportamiento automático:**
- La **polyline de navegación** aparece automáticamente cuando el usuario se aleja más de 50 metros de la ruta. Incluye los waypoints intermedios del tramo para guiar al usuario por el camino correcto (no en línea recta).
- Se **elimina automáticamente** cuando el usuario vuelve a estar dentro de los 50 metros.
- Todas las polylines se posicionan con `zIndex 500` para aparecer por encima del mapa base pero por debajo de los marcadores.

### 3.7. Botones del hijo 2 (coordenadas) — iconos por imagen

Los 6 botones del panel de coordenadas no usan emojis sino imágenes PNG personalizadas:

| Botón | Imagen | Archivo |
|-------|--------|---------|
| GPS (ruta A→B) | Foto de ruta | `imagenes/imagenes-aplicación/fotoruta-A-B.png` |
| Imagen (monumento) | Foto cercana del monumento | `imagenes/imagenes-aplicación/H2-fotoproximo-monumento.png` |
| Vídeo (dron) | Fotograma de dron | `imagenes/imagenes-aplicación/H2-fotodron.png` |
| Ubicación (distancia) | Foto de distancia | `imagenes/imagenes-aplicación/H2-fotodistancia.png` |
| Mapa completo (moderno) | Miniatura de mapa moderno | `imagenes/imagenes-aplicación/H2-fotomapa-moderno.png` |
| Mapa vintage (artístico) | Miniatura de mapa vintage | `imagenes/imagenes-aplicación/H2-fotomapa-vintage.png` |

### 3.8. Código de colores de estado en botones

| Color | Estado | Significado |
|-------|--------|-------------|
| 🟢 Verde (`#4CAF50` / `#27ae60` / `#28a745`) | Habilitado / activo | El usuario puede pulsar este botón |
| 🔴 Rojo (`#f44336` / `#e74c3c` / `#dc3545`) | Deshabilitado / inactivo | El botón está bloqueado (no se puede usar) |
| 🔵 Azul (degradado) | Estado por defecto | Botón GPS en estado neutral |
| 🟡 Amarillo | Tramo (en lista de paradas) | Identifica los botones de tramo en hijo 5 |
| 🟠 Naranja (`#f5a623`) | Overlay de texto/audio | Fondo de los cuadros de texto narrativo y audio de introducción |

---

## 4. La arquitectura padre-hijo (iframes)

### ¿Qué es un iframe?

Un iframe es una "ventana dentro de otra ventana" en una página web. La aplicación tiene una página principal (`codigo-padre.html`) que carga otras páginas dentro de sí misma como iframes.

### ¿Por qué usar iframes?

- **Aislamiento**: cada hijo tiene su propio espacio. Si un hijo falla, los demás siguen funcionando.
- **Organización**: cada hijo se encarga de una función específica (mapa, audio, retos...).
- **Reutilización**: el mismo hijo se puede usar en diferentes contextos.

### Los 5 hijos principales

| Iframe | ID | Archivo | Función |
|--------|----|---------|---------|
| Hijo 1 | `hijo1` | `En-busca-del-tesoro.html` | Menú principal, selección de aventura e idioma. Es la "pantalla de inicio" de la experiencia. |
| Hijo 2 | `hijo2` | `coordenadas-hijo2.html` | Mapa interactivo con GPS. Muestra las paradas, los tramos, y la posición del usuario. |
| Hijo 3 | `hijo3` | `audio-hijo3.html` | Reproductor de audio. Recibe del padre qué audio reproducir y lo controla. |
| Hijo 4 | `hijo4` | `retos-hijo4.html` | Muestra retos (preguntas de opción múltiple, texto libre, puzzles) y valida las respuestas. |
| Hijo 5 | `hijo5` | `boton-casa-hijo5.html` | Botón de "volver a casa" que sale del modo aventura. |

### Otros hijos (pantallas secundarias)

| Archivo | Función |
|---------|---------|
| `agradecimientos.html` | Créditos y agradecimientos. |
| `videos-valencia-historica.html` | Galería de vídeos sobre Valencia. |
| `consejos-valencia.html` | Consejos prácticos para el turista. |
| `gastronomia.html` | Información gastronómica valenciana. |
| `paginas-oficiales-valencia.html` | Enlaces a webs oficiales de Valencia. |
| `mapa-completo.html` | Mapa completo de una aventura: polyline de la ruta y monumentos (`tipo: "referencia"`) clicables con imagen. Sin marcadores de paradas ni lógica GPS. |
| `puzzle.html` | Juego de puzzle interactivo. |
| `extrainfo-hijo1.html` | Menú de opciones y configuración. |

### El protocolo de arranque (handshake)

Cuando el padre carga un hijo, siguen este protocolo para asegurarse de que están preparados:

```
Padre                           Hijo
  │                               │
  │────── carga iframe ──────────>│
  │                               │
  │<──── HIJO_PREPARADO ─────────│  "ya he cargado mi HTML"
  │                               │
  │────── PADRE_DATOS ───────────>│  "aquí tienes la aventura, idioma, parada..."
  │                               │
  │<──── HIJO_LISTO ─────────────│  "ya procesé los datos, estoy listo"
  │                               │
  │── PADRE_CONFIRMA_HIJO_LISTO ─>│  "perfecto, te confirmo"
  │                               │
  ▼                               ▼
  (comunicación normal)           (funcionando)
```

Este protocolo garantiza que nunca se envíen datos a un hijo que aún no esté preparado para recibirlos.

### Layout visual: "marco alrededor del mapa"

En modo AVENTURA los iframes de los hijos forman un marco alrededor del mapa, que queda libre en el centro:

```
┌─────────────────────────────────────┐
│           LOGO (16vh)               │  ← fondo-blanco + logo-aventura
├────┬──────────────────────────┬─────┤
│    │                          │     │
│ H1 │        MAPA LIBRE        │ H2  │  ← hijo1 izq, hijo2 der
│    │                          │     │
├────┴──────────┬───────────────┴─────┤
│               │    HIJO3            │  ← 1.6cm desde el borde inferior
└───────────────┴─────────────────────┘
```

**Posicionamiento y dimensiones** (definidos en `codigo-padre.html`):

| Elemento | Posición | Dimensiones |
|----------|----------|-------------|
| Logo / fondo-blanco | `top: 0`, `width: 100vw` | `height: 16vh` |
| **hijo1** (izquierda) | `left: 3px`, `top: 16vh`, `bottom: 0` | `height: 84vh`, `width: calc((84vh - 16px) / 6 + 2px)` |
| **hijo2** (derecha) | `right: 3px`, `top: 16vh`, `bottom: 0` | `height: 84vh`, `width: calc((84vh - 16px) / 6 + 2px)` |
| **hijo3** (abajo) | `bottom: 1.6cm`, izq/der: `calc((84vh - 16px) / 6 + 5px)` | `height: calc((84vh - 16px) / 6 + 4px)`, `width: calc(100vw - (84vh - 16px) / 3 - 10px)` |
| **hijo5** (barra paradas) | `left: 15vw`, `top: 0` | `height: 16vh`, `width: 70vw` |

> **Por qué `bottom: 1.6cm` en hijo3:** en móviles los botones del sistema operativo ocupan el borde inferior. 1.6cm garantiza que hijo3 no quede tapado por ellos.

### Filosofía responsive

Todas las medidas son proporcionales al viewport. Si algo mide 1% da igual la pantalla — móvil, tablet o PC, las proporciones son siempre las mismas.

- Unidades: `vw`, `vh`, `vmin`, `cm`, `%`
- Márgenes y gaps pequeños (2px, 3px, 6px, 10px) se mantienen en `px` — son separaciones ópticas mínimas, no estructurales
- `rem` solo para tamaños de fuente (escalados por JS desde el viewport del padre)
- **Nunca** valores fijos en `px` para tamaños de contenedores o botones

### Transparencia de los iframes (hijo1, hijo2, hijo3)

Los iframes de hijo1, hijo2 y hijo3 son completamente transparentes: solo se ven los botones flotando sobre el mapa.

- El padre define: `iframe { background: transparent; border: none; }`
- Cada hijo define: `--trapecio-bg: transparent` y `background: transparent`

> hijo4 (modal de retos) **no** es transparente — tiene fondo blanco porque ocupa toda la pantalla.

---

## 5. El código padre: el cerebro de todo

El archivo `codigo-padre.html` es, con diferencia, el más grande y complejo del proyecto (más de 7.000 líneas). Es el **orquestador** de toda la aplicación.

### Responsabilidades del padre

1. **Gestión de iframes**: carga, muestra y oculta los hijos según el contexto.
2. **Estado centralizado**: guarda cuál es la aventura seleccionada, el idioma, la parada actual, el modo (casa/aventura), etc.
3. **Mensajería**: recibe mensajes de todos los hijos y les responde.
4. **GPS**: controla la geolocalización y la envía al hijo del mapa.
5. **Navegación**: decide cuándo cambiar de parada, cuándo mostrar un reto, cuándo reproducir un audio.
6. **Modos**: gestiona el cambio entre modo CASA (menú principal) y modo AVENTURA (recorrido activo).
7. **Detección de dispositivo y mensaje de rotación**: consulta `device-detection.js` para saber si el usuario está en un teléfono móvil real. Si es así y tiene la pantalla en horizontal (landscape), muestra una imagen (`movil-vertical.png`) que cubre toda la pantalla pidiendo al usuario que gire el dispositivo. En tablets y PCs este mensaje nunca aparece. La detección se basa exclusivamente en el User Agent — véase el apartado de `device-detection.js` en la sección 25 para entender por qué.

### Modos de la aplicación

La aplicación tiene dos modos principales:

- **Modo CASA**: el usuario está en el menú principal. Puede elegir aventura, ver vídeos, leer consejos, etc.
- **Modo AVENTURA**: el usuario está haciendo un recorrido. El mapa está activo, el GPS funciona, y los retos aparecen en cada parada.

El padre gestiona la transición entre modos enviando mensajes `CAMBIO_MODO` a todos los hijos. Los hijos confirman que han entendido (`CAMBIO_MODO_ENTENDIDO`) y que han hecho la transición (`CAMBIO_MODO_EFECTUADO`).

### El state-manager (gestor de estado)

El estado de la aplicación se guarda en un único lugar: `js/state-manager.js`. Este módulo usa **mutex** (cerrojos) para evitar que dos operaciones modifiquen el mismo dato al mismo tiempo, lo cual causaría bugs difíciles de detectar.

Ejemplo de datos que guarda:

```javascript
{
    aventuraSeleccionada: "Aventura1",
    idiomaSeleccionado: "es",
    paradaActual: 5,
    modo: { actual: "AVENTURA", anterior: "CASA" },
    hijosInicializados: Set("hijo1", "hijo2", "hijo3", "hijo4", "hijo5"),
    gps: {
        activo: true,
        posicionUsuario: { lat: 39.4789, lng: -0.3762 },
        precision: 8  // metros
    }
}
```

---

## 6. Las páginas hijo y qué hace cada una

### Hijo 1: En-busca-del-tesoro.html (la experiencia principal)

Esta es la página más compleja después del padre. Contiene **14 pantallas** (llamadas `pantalla1` a `pantalla14`) que se muestran u ocultan según el momento:

| Pantalla | Nombre interno | Qué muestra |
|----------|----------------|-------------|
| P1 | Bienvenida | Logo y botón "Empezar" |
| P2 | Selección de idioma | 6 banderas para elegir idioma |
| P3 | Confirmación de idioma | "¿Estás seguro? [Sí/No]" |
| P4 | Imagen "En Busca del Tesoro" | Logo alargado + imagen específica del idioma elegido. |
| P5 | Términos y condiciones | Texto legal. Hay que aceptar para continuar. |
| P6 | Selección de aventura | Lista de aventuras disponibles. |
| P7 | Confirmación de aventura | "Has elegido Aventura X. ¿Confirmas?" |
| P8 | Reto R1 | Primer reto (antes de empezar el recorrido). |
| P9 | Puzzle | Puzzle interactivo como reto visual. |
| P10 | Vídeo | Vídeo introductorio de la aventura. |
| P11 | Audio + texto | Introducción narrada + texto de bienvenida. |
| P12 | Reto R2 | Segundo reto. |
| P13 | Pago (futuro) | Pantalla de pago — actualmente es un stub. |
| P14 | Código de activación | Introduce un código para activar la aventura. |

**Propagación de idioma y aventura**: cuando el usuario selecciona un idioma en P2, la función `seleccionarIdioma()` actualiza **tres niveles** simultáneamente: la variable local `idiomaSeleccionado`, el estado del componente (`estadoComponente.idiomaSeleccionado`) y `window.idiomaSeleccionado`. Además resetea los cinco flags de contenido (`terminosCargados`, `audioCargado`, `textoCargado`, `retoCargadoR1`, `retoCargadoR2`) para garantizar que todo el contenido se recargue en el nuevo idioma si el usuario vuelve a pantallas anteriores. Lo mismo ocurre con `seleccionarAventura()` y la variable `aventuraSeleccionada`. Esto garantiza que todas las funciones internas (carga de términos, textos, retos, audios) trabajen siempre con el idioma correcto, independientemente de cómo accedan al valor.

**Aviso de audio**: al confirmar la aventura en P7, `confirmarAventura()` comprueba si existen audios grabados para el idioma seleccionado. Si no los hay (por ejemplo, al elegir inglés), aparece un **modal overlay** advirtiendo que la aventura funcionará sin audio. El usuario puede **continuar sin audio** o **volver a elegir idioma**. Para español (el único idioma con audios completos actualmente), el flujo sigue directo sin mostrar el aviso.

### Hijo 2: coordenadas-hijo2.html (el mapa)

Muestra un mapa interactivo usando **Leaflet** (biblioteca de mapas de código abierto). Características:

- Estilo **vintage** personalizado (mapas con aspecto antiguo).
- Marcadores para cada **parada** del recorrido.
- **Polylines** (líneas) que conectan las paradas mostrando la ruta.
- **Posición del usuario** en tiempo real mediante GPS.
- Detección de **proximidad**: cuando el usuario se acerca a una parada, el sistema lo detecta.
- **Brújula**: el mapa puede rotar según la orientación del dispositivo.

#### Botones de hijo2: cálculo del diámetro

6 botones circulares en columna vertical. Restricciones: 3px arriba + 2px entre botones + 3px abajo:

```
3 + 6D + 5×2 + 3 = 84vh  →  D = (84vh - 16px) / 6
```

Dentro del iframe de hijo2, `100vh = 84vh del padre`:
```css
--btn-size: calc((100vh - 16px) / 6);
```

El ancho del iframe es `D + 2px`: `calc((84vh - 16px) / 6 + 2px)`.

#### Orden de los botones (de arriba a abajo)

| # | ID | Función |
|---|----|---------|
| 1 | `btn-mapa-completo` | Mapa moderno completo |
| 2 | `btn-mapa-jpg` | Mapa vintage |
| 3 | `btn-video` | Vídeo dron |
| 4 | `btn-imagen` | Imagen de la parada |
| 5 | `btn-gps` | Activar GPS / ruta |
| 6 | `btn-ubicacion` | Centrar en ubicación actual |

#### Tamaño de las imágenes dentro de los botones

```css
/* Regla general: 90% ancho, 94% alto del diámetro */
.boton img {
    width: calc((100vh - 16px) / 6 * 0.90);
    height: calc((100vh - 16px) / 6 * 0.94);
    object-fit: contain;
}
/* Imágenes más estrechas por su composición */
#btn-mapa-completo img, #btn-imagen img, #btn-ubicacion img {
    width: calc((100vh - 16px) / 6 * 0.87);
}
```

> No usar dimensiones fijas con `!important` por imagen — bloquea el redimensionado responsive.

### Hijo 3: audio-hijo3.html (el reproductor)

Reproduce los audios narrativos de cada parada. Usa el elemento `<audio>` nativo de HTML5 con controles personalizados. El padre le dice qué audio reproducir enviándole la URL del fichero MP3.

#### Layout interno de hijo3

```
┌─────────────────────────────────┬──────┬──────┐
│  [===========barra progreso===] │  ▶   │  🎯  │
│  Título de la parada o tramo    │      │      │
└─────────────────────────────────┴──────┴──────┘
  ← content-left (flex:1) →        ← buttons-right →
  padding-left: 10px                margin-right: 10px / gap: 6px
```

- **Barra de progreso** arriba, con `00:00 / 00:00` superpuesto centrado dentro de la barra
- **Título** debajo, con efecto marquee automático si el texto no cabe (JS detecta `scrollWidth > clientWidth`)
- **Botones** a la derecha: playPause + retos, en la misma línea

#### Fórmulas de hijo3

hijo3 tiene altura `= D + 4px` (donde D es el diámetro de los botones de hijo2). Dentro del iframe:

```
100vh = D + 4px  →  D = 100vh - 4px  →  --btn-size: calc(100vh - 4px)
```

Barra de progreso:

```
ancho = 100vw - 10px(izq) - 10px(barra→play) - D - 6px(gap) - D - 10px(der)
      = calc(100vw - 200vh - 28px)

alto  = calc((100vh - 10px) / 2)   ← misma altura que el título
```

### Hijo 4: retos-hijo4.html (los retos)

Muestra las preguntas y retos del recorrido. Soporta tres tipos de reto:

- **Opción múltiple** (`tipo: "opcion"`): el usuario elige una respuesta entre varias.
- **Texto libre** (`tipo: "texto"`): el usuario escribe la respuesta.
- **Puzzle** (`tipo: "puzzle"`): se carga un puzzle visual interactivo.

Cuando el usuario responde, el hijo4 comprueba si es correcto y le dice al padre el resultado.

### Hijo 5: boton-casa-hijo5.html

Es simplemente un botón grande que permite "salir de la aventura" y volver al modo CASA. Cuando el usuario lo pulsa, envía un mensaje al padre para que cambie de modo.

#### Filtro de elementos sin coordenadas

El array `elementosIDpadre` de `aventuras-ID-padre.js` contiene **todos** los elementos de una aventura, incluyendo los que corresponden a pantallas de `En-busca-del-tesoro.html` (puzzle inicial, reto previo, intro) que no tienen ubicación física en el mapa. Estos elementos tienen `tipo: "pre-intro1"` o `tipo: "intro"` y no deben aparecer como botones en hijo5.

Al generar la lista de paradas, hijo5 aplica el filtro:

```js
const TIPOS_CON_MAPA = ['inicio', 'parada', 'tramo'];
if (!TIPOS_CON_MAPA.includes(punto.tipo)) return; // omitir
```

Solo los tipos `"inicio"`, `"parada"` y `"tramo"` tienen coordenadas reales y producen botón. Cualquier tipo distinto se omite silenciosamente. Esta regla es universal para todas las aventuras e idiomas.

`funciones-mapa.js` aplica la misma guardia en `manejarCambiarParada()`: si el elemento tiene `paradaId === "null"` o un tipo fuera de los tres válidos, sale limpiamente sin bloquear `estadoMapa.consultaParadaPendiente`.

---

## 7. Cómo se comunican padre e hijos (mensajería)

### El sistema de mensajes

La comunicación se gestiona en `js/mensajeria.js`. Utiliza la API nativa del navegador `window.postMessage()` para enviar mensajes entre ventanas (el padre y sus iframes).

### Estructura de un mensaje

Todos los mensajes siguen este formato:

```javascript
{
    tipo: "SISTEMA.CAMBIO_PARADA",      // qué tipo de mensaje es
    origen: "padre",                      // quién lo envía
    destino: "hijo2",                     // a quién va
    timestamp: 1712456789000,             // cuándo se envió
    payload: {                            // los datos del mensaje
        paradaId: "P-5",
        aventuraId: "Aventura1"
    }
}
```

### Tipos de mensaje principales

| Categoría | Mensaje | Dirección | Significado |
|-----------|---------|-----------|-------------|
| **Sistema** | `HIJO_PREPARADO` | Hijo → Padre | "He cargado, envíame datos" |
| | `PADRE_DATOS` | Padre → Hijo | "Aquí tienes aventura, idioma, parada..." |
| | `HIJO_LISTO` | Hijo → Padre | "Ya estoy listo para funcionar" |
| | `CAMBIO_MODO` | Padre → Hijos | "Cambiamos a modo CASA/AVENTURA" |
| | `HEARTBEAT` | Padre ↔ Hijos | "¿Sigues vivo?" (latido cada 5 segundos) |
| | `ACK` | Cualquiera | "Mensaje recibido correctamente" |
| **Navegación** | `CAMBIO_PARADA` | Padre → Hijos | "Ahora estamos en la parada 5" |
| | `GPS.ACTIVAR` | Padre → Hijo2 | "Enciende el GPS" |
| | `UBICACION_ACTUALIZADA` | Padre → Hijo2 | "El usuario está en lat/lng tal" |
| | `PARADA_COMPLETADA` | Hijo → Padre | "El usuario ha completado esta parada" |
| **Datos** | `RETO.MOSTRAR` | Padre → Hijo4 | "Muestra el reto R-5" |
| | `RETO.RESULTADO` | Hijo4 → Padre | "El usuario respondió correctamente" |
| | `AUDIO.REPRODUCIR` | Padre → Hijo3 | "Reproduce este MP3" |

### Confirmaciones y reintentos

Cada mensaje enviado espera una confirmación (`ACK`) en un plazo de 5 segundos. Si no llega:

1. Se reintenta hasta **3 veces**.
2. Si tras 3 reintentos no hay respuesta, se registra un error.
3. Hay un timeout extendido de **10 segundos** para operaciones lentas.

### El heartbeat (latido)

Cada 5 segundos, el padre envía un "latido" a todos los hijos para comprobar que siguen funcionando. Si un hijo no responde, el padre puede intentar reconectarlo.

### Reseteo de botones al cerrar una vista o cambiar de parada

Un botón activo (azul) indica que su vista está abierta. Al cerrar la vista o cambiar de parada vuelve a su estado original (verde).

| Hijo | Trigger | Acción |
|------|---------|--------|
| **hijo2** | Cierre de overlay imagen/vídeo/mapa | `setBotonActivo(null)` vía `CONTROL.HABILITAR { motivo: 'vista_cerrada' }` |
| **hijo2** | `CAMBIO_PARADA` | `setBotonActivo(null)` |
| **hijo1** | `CAMBIO_PARADA` | `ocultarTodos()` — colapsa el menú desplegable |
| **hijo3** | Cierre de retos (`CONTROL.HABILITAR`) | `retosBtn.classList.remove('activo')` |
| **hijo3** | `CAMBIO_PARADA` | `retosBtn.classList.remove('activo')` |

> El botón **playPause** de hijo3 no se resetea — refleja el estado real del audio, no si una vista está abierta.

Flujo cuando el usuario cierra un overlay de imagen, vídeo o mapa:

```
Usuario pulsa ✕ en el overlay
  → padre ejecuta cerrarImagenOverlay() / cerrarVideoOverlay()
  → padre envía CONTROL.HABILITAR { motivo: 'vista_cerrada' } a hijo2
  → hijo2 llama setBotonActivo(null)
```

---

## 8. Las aventuras: estructura y flujo completo

### ¿Qué es una aventura?

Una aventura es un recorrido turístico por Valencia. Cada aventura tiene:

- Un **nombre** (ej: "València centro histórico 1").
- Una lista de **paradas** (puntos de interés).
- **Tramos** (caminos entre paradas).
- **Retos** (preguntas para cada parada).
- **Audios** narrativos por parada e idioma.
- **Textos** descriptivos por parada e idioma.
- **Puzzles** asociados a ciertas paradas.

### El índice de aventuras

El fichero `js/indice-aventuras.js` define todas las aventuras y sus metadatos visuales. Los **totales** (`totalParadas`, `totalTramos`, `totalRetos`, `totalMonumentos`, `totalAudios`) se calculan dinámicamente importando los módulos fuente al cargarse el módulo — no hay números hardcodeados. Los **metadatos** que no son computables (nombre, distancia, vehículo, tiempo estimado, disponibilidad por idioma) sí se definen manualmente en ese fichero.

| Fuente de verdad           | Calcula                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `aventuras-ID-padre.js`    | `totalParadas` (tipo `parada` + `inicio`), `totalTramos` (tipo `tramo`)   |
| `retos-aventuras.js`       | `totalRetos` (longitud del array para `es`)                               |
| `coordenadas-aventuras.js` | `totalMonumentos` (entradas `tipo: "referencia"`)                         |
| `audios-aventuras.js`      | `totalAudios` (entradas con `file` no vacío en `es`)                      |

| Aventura | Nombre | Distancia | Vehículo | Estado |
|----------|--------|-----------|----------|--------|
| 1 | València centro histórico 1 | ~4 km | 👣 Andando | ✅ Disponible |
| 2 | València centro histórico 2 | ~4 km | 👣 Andando | ❌ En desarrollo |
| 3 | València Ciudad de las Artes y las Ciencias | ~10 km | 🚲🛴 Bici/patinete | ❌ En desarrollo |
| 4 | València Parque de Cabecera y Viveros | ~10 km | 🚲🛴 Bici/patinete | ❌ En desarrollo |
| 5 | València murallas | ~6 km | 🚲🛴 Bici/patinete | ❌ En desarrollo |
| Fallas | València en Fallas | ~4 km | 👣 Andando | ❌ En desarrollo |
| 34km | València 34 kilómetros | ~34 km | 🚲🛴👣 Mixto | ❌ En desarrollo |

Cada aventura incluye los campos `distanciaKm` y `vehiculo` (emoji) que se muestran en los botones de selección. Al añadir paradas, tramos, retos o monumentos en sus respectivos módulos, los contadores de P5 se actualizan solos sin tocar `indice-aventuras.js`.

### Pantalla de selección de aventura (P5)

Los botones de aventura muestran todo en una línea con stats visuales universales (sin necesidad de traducción):

```
Nombre aventura    👣±4km 🏛️19 📍41 🧩30 ⏳max60h
```

- 👣/🚲🛴 = vehículo recomendado
- ±Xkm = distancia aproximada
- 🏛️ = monumentos | 📍 = paradas | 🧩 = retos
- ⏳maxXh = tiempo **máximo** para completar (no duración estimada)

### Flujo completo de una aventura (usuario típico)

Esto es lo que experimenta el turista paso a paso:

```
1. Abre la app en el móvil
   └── Se carga codigo-padre.html (modo CASA)
       └── Se carga En-busca-del-tesoro.html en el iframe principal

2. Pantalla de bienvenida (P1)
   └── Pulsa "Empezar"

3. Elige idioma (P2)
   └── Toca la bandera de España 🇪🇸

4. Confirma idioma (P3)
   └── "¿Español? SÍ"

5. Imagen "En Busca del Tesoro" (P4)
   └── Logo alargado + imagen específica del idioma elegido

6. Términos y condiciones (P5)
   └── Lee y acepta
   └── Si el idioma no tiene audios → aparece aviso overlay más adelante
       └── "SÍ, continuar sin audio" o "NO, volver a elegir"

7. Elige aventura (P6)
   └── Pulsa la aventura deseada

8. Confirma aventura (P7)
   └── "Has elegido Aventura X. ¿Confirmas? SÍ"

9. Resuelve Reto 1 (P8)
   └── Pregunta de prueba para verificar que entiende el sistema

10. Resuelve Puzzle (P9)
    └── Puzzle visual interactivo

11. Ve vídeo introductorio (P10)
    └── Vídeo corto sobre Valencia

12. Escucha audio + lee texto (P11)
    └── Audio de bienvenida + texto narrativo de introducción

13. Resuelve Reto 2 (P12)
    └── Segunda pregunta

14. Pantalla de pago (P13) — actualmente un stub
    └── En el futuro: pago real

15. Código de activación (P14)
    └── Introduce un código recibido tras el pago
    └── El código se valida contra el backend
    └── Si es válido → recibe un TOKEN de sesión

15. ¡AVENTURA ACTIVADA! Se cambia a modo AVENTURA
    └── El padre carga el mapa (hijo2)
    └── Se activa el GPS
    └── El usuario ve la parada 0 (Torres de Serranos)

16. En cada parada:
    a. Ve el mapa con su posición y la parada
    b. Escucha el audio narrativo
    c. Lee el texto descriptivo
    d. Resuelve el reto de esa parada
    e. Avanza a la siguiente parada

17. Al completar todas las paradas → ¡Aventura completada!
    └── El padre envía AVENTURA.FINALIZADA al iframe del temporizador
```

### Cómo funciona la progresión internamente

El padre mantiene un **índice de progreso** (`estado.indiceProgreso`) que apunta al elemento actual dentro de un array ordenado. Este array es `elementosIDpadre` en `js/aventuras-ID-padre.js`, y tiene siempre la misma secuencia: intro → parada 0 → tramo 1 → parada 1 → tramo 2 → parada 2 → ...

#### Los dos arrays paralelos

La aventura se apoya en dos fuentes de datos que deben estar en sincronía:

| Array | Archivo | Contiene | Indexado por |
| --- | --- | --- | --- |
| `DATOS_PADRE[av][idioma].elementosIDpadre` | `aventuras-ID-padre.js` | Texto, audio, reto, tipo de elemento | `padreid` (`"padre-P3"`, `"padre-TR2"`) |
| `DATOS_AVENTURAS[av]["coordenadas-hijo2.html"].coordenadas` | `coordenadas-aventuras.js` | Coordenadas GPS, waypoints, imagen | `id` (`"P-3"`, `"TR-2"`) |

El `parada_id`/`tramo_id` del primer array (ej: `"P-3"`) debe coincidir exactamente con el `id` del segundo (ej: `"P-3"`). Si no coinciden, el sistema no puede cargar las coordenadas del elemento.

#### La progresión es estrictamente secuencial

El sistema **nunca salta elementos**. Si el GPS detecta que el usuario está físicamente más cerca de la parada 4 que del tramo 3, no ocurre nada: la comprobación GPS sólo evalúa el elemento activo en `estado.indiceProgreso`. Estar cerca de un elemento futuro es irrelevante para el sistema.

#### Cómo sabe el padre que un elemento está completado

Cada elemento activo tiene una entrada en `estado.pendingCompleciones` (clave: `padreid`). Esta entrada rastrea el estado de cada condición requerida:

**Para paradas e inicio:**

| Condición | Cómo se activa |
| --- | --- |
| `pending.audio = true` | Mensaje `AUDIO.FIN_REPRODUCCION` recibido de hijo3 |
| `pending.reto = true` | Mensaje `RETO.COMPLETADO` (correcto) recibido de hijo4 |
| **Completado cuando:** | `audio && reto` ambos verdaderos |

Si la parada no tiene reto (`reto_id` nulo), sólo se necesita el audio.

**Para tramos:**

| Condición | Cómo se activa |
| --- | --- |
| `pending.audio = true` | Mensaje `AUDIO.FIN_REPRODUCCION` recibido de hijo3 |
| `pending.llegada = true` | Mensaje `NAVEGACION.LLEGADA_DETECTADA` recibido de hijo2 (GPS dentro de tolerancia) |
| **Completado cuando:** | `audio && llegada` ambos verdaderos |

Cuando se cumplen ambas condiciones, `intentarCompletarElemento()` llama a `progresarSiguienteElemento()`, que incrementa `indiceProgreso` y activa el siguiente elemento. Los pendings tienen un TTL de 10 minutos para evitar que la aventura se quede bloqueada.

#### Fin de la aventura

Cuando `indiceProgreso` supera el último índice de `elementosIDpadre`, `obtenerElementoActual()` devuelve `null`. El padre envía entonces `AVENTURA.FINALIZADA` a `hijo1-opciones` (el iframe del temporizador). **La pantalla de fin de aventura (felicitación, resumen) está pendiente de implementar.**

### La Aventura 1 en números

| Dato | Valor |
|------|-------|
| Paradas totales | 41 |
| Tramos (caminos entre paradas) | 24 |
| Retos | 30 |
| Monumentos | 19 |
| Audios (por idioma) | 47 |
| Distancia aproximada | ~4 km por el casco histórico |
| Vehículo recomendado | 👣 Andando |
| Tiempo máximo | 60 horas |

---

## 9. Los datos de la aplicación

Toda la información de las aventuras (coordenadas GPS, textos, audios, retos, puzzles) se almacena en ficheros JavaScript en la carpeta `js/` y en ficheros JSON en `backend/data/`.

### Datos en el frontend (`js/`)

Estos ficheros se cargan directamente en el navegador:

| Fichero | Qué contiene | Estructura |
|---------|-------------|------------|
| `coordenadas-aventuras.js` | Latitud y longitud de cada parada y tramo | `DATOS_AVENTURAS.Aventura1.coordenadas[]` |
| `textos-aventuras.js` | Textos narrativos HTML por parada e idioma | `TEXTOS_AVENTURAS.Aventura1.es[]` |
| `retos-aventuras.js` | Preguntas, opciones y respuestas correctas | `RETOS_AVENTURAS.Aventura1.es[]` |
| `audios-aventuras.js` | Metadatos de audios (título, fichero MP3) | `AUDIOS_AVENTURAS.Aventura1.es[]` |
| `puzzles-aventuras.js` | Definición de puzzles (imágenes) | `PUZZLES_AVENTURAS.Aventura1.puzzle_id[]` |
| `indice-aventuras.js` | Índice de aventuras y disponibilidad | `INDICE_AVENTURAS.Aventura1` |

### Datos en el backend (`backend/data/`)

Los mismos datos existen en formato JSON para ser servidos por la API:

| Fichero | Equivalente en frontend |
|---------|------------------------|
| `audios-aventuras.json` | `js/audios-aventuras.js` |
| `coordenadas-aventuras.json` | `js/coordenadas-aventuras.js` |
| `indice-aventuras.json` | `js/indice-aventuras.js` |
| `puzzles-aventuras.json` | `js/puzzles-aventuras.js` |
| `retos-aventuras.json` | `js/retos-aventuras.js` |

### ¿Por qué existen los datos en dos sitios?

Por una razón de diseño pensando en la seguridad futura:

- **Ahora (desarrollo)**: los datos se cargan directamente desde los ficheros JS en el navegador. Es más rápido y no necesita backend.
- **En producción**: los ficheros JS sensibles se bloquearán. El frontend pedirá los datos al backend, que solo los entregará si el usuario tiene un **token de sesión válido**. Así nadie puede ver las coordenadas ni las respuestas de los retos sin haber pagado.

El módulo `js/data-loader.js` gestiona esta transición. Tiene una variable `DATA_MODE`:
- `'local'`: carga desde ficheros JS (desarrollo).
- `'api'`: carga desde el backend con token (producción).

---

## 10. Idiomas y traducciones

### Idiomas soportados

| Código | Idioma | Bandera | Estado de audios |
|--------|--------|---------|-----------------|
| `es` | Español | 🇪🇸 | ✅ Grabados |
| `en` | Inglés | 🇬🇧 | ❌ Pendiente |
| `fr` | Francés | 🇫🇷 | ❌ Pendiente |
| `it` | Italiano | 🇮🇹 | ❌ Pendiente |
| `nl` | Neerlandés | 🇳🇱 | ❌ Pendiente |
| `ja` | Japonés | 🇯🇵 | ❌ Pendiente |

### ¿Qué está traducido?

- **Textos narrativos** (`textos-aventuras.js`): ✅ los 6 idiomas (66 entradas por idioma).
- **Títulos de textos** (`title` en textos-aventuras.js): ✅ los 6 idiomas — "Parada" → Stop / Arrêt / Fermata / Halte / 停留所, "Tramo" → Section / Tronçon / Tratto / Traject / 区間.
- **Retos** (`retos-aventuras.js`): ✅ los 6 idiomas (preguntas, opciones y respuestas traducidas).
- **Audios** (`audios-aventuras.js`): solo español tiene archivos MP3 reales. Los demás idiomas tienen la estructura preparada pero sin fichero.
- **Interfaz (botones, avisos)**: traducida en `En-busca-del-tesoro.html` con objetos como `AUDIO_WARNING_TEXTS`, `TEXTOS_CONFIRMACION`, etc.
- **Logo inline**: todas las menciones a "València be Guides" en los textos narrativos se han sustituido por una imagen del logo (`imagenes/imagenes-aplicación/logo-alargado.png`) renderizada con `height:1.4em` para escalar con el texto. Esto elimina la necesidad de traducir el nombre de la marca.

### El mapeo de idiomas

```javascript
MAPEO_IDIOMAS = {
    "es": { nombre: "Español",     bandera: "Bandera España.jpeg" },
    "en": { nombre: "English",     bandera: "Bandera UK.jpeg" },
    "fr": { nombre: "Français",    bandera: "Bandera Francia.jpeg" },
    "it": { nombre: "Italiano",    bandera: "Bandera Italia.jpeg" },
    "nl": { nombre: "Nederlands",  bandera: "Bandera Países Bajos.jpeg" },
    "ja": { nombre: "日本語",       bandera: "Bandera Japon.jpeg" }
}
```

---

## 11. El mapa y el GPS

### Tecnología usada

- **Leaflet 1.9.4**: biblioteca JavaScript de mapas interactivos de código abierto.
- **leaflet-rotate**: permite rotar el mapa (para brújula).
- **leaflet-geometryutil**: cálculos geométricos (distancias, puntos cercanos).

### Cómo funciona el mapa

1. El padre activa el GPS del dispositivo usando `navigator.geolocation.watchPosition()`.
2. Cada vez que se obtiene una nueva posición, el padre la envía al hijo2 (mapa).
3. El hijo2 actualiza el marcador del usuario en el mapa.
4. El padre calcula la **distancia** entre el usuario y el elemento activo.
5. Cuando el usuario entra en la tolerancia del elemento, se considera que ha "llegado" (sólo relevante para tramos — ver abajo).

### Las coordenadas

Cada parada tiene esta estructura:

```javascript
{
    id: "P-5",                              // Identificador único
    tipo: "parada",                         // "inicio", "parada", o "tramo"
    parada: 5,                              // Número de parada
    nombre: "Plaza de la Virgen",           // Nombre del lugar
    coordenadas: { lat: 39.47546, lng: -0.37524 },
    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    video: "videos-aventuras/av1/parada_5.mp4"
}
```

Los tramos (caminos entre paradas) tienen **waypoints** (puntos intermedios) para dibujar la ruta con precisión:

```javascript
{
    id: "TR-5",
    tipo: "tramo",
    nombre: "Plaza de la Virgen → Catedral",
    inicio: { lat: 39.47546, lng: -0.37524 },
    waypoints: [
        { lat: 39.47540, lng: -0.37510 },
        { lat: 39.47535, lng: -0.37498 },
        // ... más puntos intermedios
    ],
    fin: { lat: 39.47530, lng: -0.37480 }
}
```

### Tolerancia GPS por tipo de elemento

La función `calcularToleranciaGPS()` en `js/funciones-mapa.js` determina cuántos metros de margen tiene el usuario para activar la "llegada". El cálculo es diferente según el tipo de elemento:

| Tipo | Tolerancia | Cómo se calcula |
| --- | --- | --- |
| **Parada / inicio** | **50 m fijos** | Valor constante |
| **Tramo** | **dinámica** | Distancia máxima entre waypoints consecutivos + 20 m de buffer |

Para los tramos, la tolerancia se calcula con la distancia entre los waypoints de la ruta: si el tramo tiene waypoints muy separados (calles largas), la tolerancia es mayor. Si los waypoints están muy juntos (callejones), la tolerancia es más ajustada. El destino de un tramo es siempre su **último waypoint**.

La llegada GPS sólo se necesita para **completar un tramo**. Las paradas se completan con audio + reto, sin requerir comprobación GPS de llegada.

### Animación de zoom al cambiar de parada

El flujo real tiene 3 pasos:

1. `codigo-padre.html` resuelve el elemento activo usando `DATOS_PADRE[aventura][idioma].elementosIDpadre`.
2. Ese cambio siempre entra por el controlador central `NAVEGACION.CAMBIO_PARADA` del padre, tanto si viene de hijo5, del GPS, de la progresión automática o del arranque inicial en `P-0`.
3. Cuando el padre ya ha coordinado a los hijos, dispara el evento `vv-parada-cambiada`. `funciones-mapa.js` lo escucha y busca las coordenadas en **Ruta 1**: lee directamente `window.__vv_DATOS_AVENTURAS` (variable en el mismo `window` del padre, sin postMessage, sin race condition). Si la parada está ahí, ejecuta la animación inmediatamente. Si no (fallback Ruta 2), solicita las coordenadas a hijo2 vía postMessage. Un timeout de seguridad de 8s limpia el lock si hijo2 no responde.

Una vez recibido ese evento, `completarCambioParada()` en `funciones-mapa.js` ejecuta la animación de zoom con esta lógica:

- **Primera selección** (sin parada anterior en `estadoMapa.paradaActual`): solo zoom-in al destino.
- **Selecciones sucesivas**: zoom-out desde la posición actual → zoom-in al nuevo destino.

**Para paradas individuales:**

| Situación | Fases | Duración total |
| --- | --- | --- |
| Primera selección | `flyTo(destino, zoom 19)` | ~1.05 s |
| Selección posterior | `flyTo(centro actual, zoom 14)` → `flyTo(destino, zoom 19)` | ~1.75 s |

**Para tramos** (el mapa centra en las coordenadas de inicio y encuadra el tramo completo):

| Situación | Fases | Duración total |
| --- | --- | --- |
| Primera selección | `flyToBounds(bounds tramo)` | ~1.05 s |
| Selección posterior | `flyTo(centro actual, zoom 14)` → `flyToBounds(bounds tramo)` | ~1.75 s |

La polyline de tramo se dibuja en azul (`#3388ff`). La animación espera el evento `moveend` de Leaflet entre fases (con timeout de seguridad) para garantizar el orden de ejecución.

La geometría viene de `window.__vv_DATOS_AVENTURAS` (mismo window, sin postMessage). Si la parada no está en ese caché, funciones-mapa hace fallback y la solicita a hijo2 vía postMessage. Un timeout de 8 s limpia el lock si hijo2 no responde.

El flag `estadoMapa.zoomEnCurso` se pone a `true` durante la animación y vuelve a `false` al terminar. El flag `estadoMapa.usuarioMovioMapa` se resetea a `false` al inicio de cada cambio de parada para respetar que el zoom automático tiene preferencia cuando la parada cambia.

### Configuración del GPS

| Parámetro | Valor | Descripción |
| --- | --- | --- |
| `ALTA_PRECISION` | `true` | Usa GPS real en vez de triangulación WiFi |
| `TIMEOUT` | 15.000 ms | Tiempo máximo de espera para obtener posición |
| `PRECISION_MINIMA` | 30 m | Si la precisión GPS es peor que 30 m, se avisa al usuario |

---

## 12. Los audios

### Ubicación de los ficheros

Los archivos de audio están en `audios-aventuras/` organizados por idioma:

```
audios-aventuras/
├── español/
│   ├── 01-Intro-ESPAÑOL-1.mp3
│   ├── 02-Intro ESPAÑOL-2.mp3
│   └── ... (más ficheros MP3)
├── english/       (vacío — pendiente de grabación)
├── frances/       (vacío)
├── italiano/      (vacío)
├── holandes/      (vacío)
└── japones/       (vacío)
```

### Cómo se reproducen

1. El padre decide que toca reproducir un audio (al llegar a una parada).
2. Busca en `AUDIOS_AVENTURAS[aventura][idioma]` el audio correspondiente.
3. Envía un mensaje `AUDIO.REPRODUCIR` al hijo3 con la URL del fichero.
4. El hijo3 carga el MP3 en su elemento `<audio>` y lo reproduce.

### El fichero de metadatos

En `js/audios-aventuras.js`, cada audio se define así:

```javascript
{
    id: "audio-Av1-P5-es",
    title: "Parada 5: Plaza de la Virgen",
    file: "audios-aventuras/español/05-Av1-Plaza-Virgen.mp3"
}
```

Si `file` está vacío (`""`), significa que el audio no existe aún para ese idioma.

### Aviso de audio no disponible

Cuando el usuario elige un idioma sin audios grabados, aparece un **modal overlay** (ventana emergente) que dice:

> "Los audios para este idioma aún no están disponibles. Puedes continuar la aventura sin audio. ¿Deseas continuar?"
>
> [SÍ, continuar sin audio] [NO, elegir otro idioma]

Este aviso se muestra en el idioma que el usuario ha seleccionado.

---

## 13. Los retos y puzzles

### Tipos de reto

| Tipo | Cómo funciona | Ejemplo |
|------|--------------|---------|
| `opcion` | El usuario elige UNA respuesta de varias opciones | "¿Cómo se llaman estas Torres?" → Torres de Serranos |
| `opcion-multiple` | El usuario elige VARIAS respuestas correctas | "Selecciona los monumentos góticos:" → [Lonja, Catedral] |
| `texto` | El usuario escribe la respuesta | "¿Cuál es el nombre de esta calle?" → "Calle Muro de Santa Ana" |
| `puzzle` | Se carga un puzzle visual que hay que resolver | Recomponer una imagen del monumento |

### Estructura de un reto

```javascript
{
    reto: 3,                                    // Número de reto
    id: "R3-Av1-es",                           // ID único
    tipo: "opcion",                            // Tipo de reto
    pregunta: "¿Cómo se llaman estas Torres?", // La pregunta
    opciones: [                                 // Las opciones (solo para tipo opcion)
        "Torres de Quart",
        "Torres de Serranos",
        "Torre del Miguelete",
        "Torre de Santa Catalina"
    ],
    correctas: ["Torres de Serranos"],          // Respuesta(s) correcta(s)
    multiple: false                             // ¿Permite selección múltiple?
}
```

### Seguridad de las respuestas

- **En desarrollo**: las respuestas correctas (`correctas`) están en el fichero JS del frontend. El usuario técnicamente podría verlas inspeccionando el código.
- **En producción**: el backend sirve los retos **sin incluir las respuestas correctas**. La validación se hace en el servidor: el frontend envía la respuesta al endpoint `POST /api/retos/:aventura/:idioma/:retoId/validar` y el servidor responde si es correcta o no.

### Los puzzles

Los puzzles son retos visuales donde el usuario debe recomponer una imagen. Cada puzzle tiene:

```javascript
{
    id: "PZ-01",
    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg"
}
```

La lógica del puzzle (cortar la imagen, detectar posición correcta) está en `puzzle.html`.

#### Presentación visual de un puzzle en retos-hijo4.html

Cuando el reto es de tipo `puzzle`, la interfaz de `retos-hijo4.html` se simplifica al máximo:

**Se oculta automáticamente:**

- El título `<h2>` ("Reto Valencia be Guides")
- El `<h3>` con el nombre/pregunta del reto
- El botón 🆘❓ (`btnMostrarRespuesta`)
- El botón 🫵 (`btnEnviar`)
- El scroll vertical (`overflow: hidden`)

**Permanece visible:**

- El iframe con `puzzle.html` (incluye sus propios botones 🔄 Reiniciar + ⏸️ Pausa + timer)
- El botón ➡️🎯 (`btnNextAfterReto`) en azul, que pasa a verde cuando el puzzle se completa

Cuando el puzzle se completa, `puzzle.html` envía el mensaje `puzzle-state-completed` al padre (`retos-hijo4.html`), que activa los fuegos artificiales y habilita el botón ➡️🎯 en verde. No existe ningún overlay de "puzzle completado" — la señal visual es el borde verde del contenedor y los fuegos artificiales.

Esto se gestiona añadiendo la clase `puzzle-mode` al `<body>` cuando se carga un reto de tipo puzzle, y eliminándola al cargar cualquier reto de otro tipo. Al salir del puzzle todo el estado visual se restaura automáticamente.

#### Lógica de botones en retos normales

Los tres botones de `retos-hijo4.html` se comportan de forma universal — usan emojis en lugar de texto para no requerir traducción:

- **🫵 azul** (`btnEnviar`): siempre visible cuando el reto está activo. Al pulsar, envía la respuesta.
  - Si es correcta: se convierte en **👍 verde** (deshabilitado), el botón ➡️🎯 se habilita en verde, y se lanzan los fuegos artificiales.
  - Si es incorrecta: se convierte en **👎 rojo** durante 3 segundos, luego vuelve automáticamente a **🫵 azul** habilitado. Los reintentos son ilimitados.
- **🆘❓** (`btnMostrarRespuesta`): muestra la respuesta correcta en pantalla. Solo disponible en retos normales, nunca en puzzles.
- **➡️🎯** (`btnNextAfterReto`): deshabilitado en azul hasta que se acierte. Al acertar se habilita en verde y permite continuar la aventura.

---

## 14. Los textos narrativos

### Estructura

En `js/textos-aventuras.js`, cada texto se almacena como HTML:

```javascript
{
    id: "txt-Av1-P5-es",
    title: "Parada 5: Plaza de la Virgen",
    content: "<h1>Plaza de la Virgen</h1>\n<p>Esta plaza es el corazón de Valencia..."
}
```

### Contenido rico

Los textos incluyen HTML formateado: títulos, párrafos, negritas, saltos de línea. Esto permite que la presentación sea visualmente atractiva sin necesitar un editor de texto complejo.

### Logo inline en textos

Todas las ocurrencias de "València be Guides" en los campos `content` se han sustituido por una imagen inline del logo:

```html
<img src='imagenes/imagenes-aplicación/logo-alargado.png' alt='València be Guides'
     style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.05em;'>
```

Esto garantiza que el logo escala con el tamaño del texto y se ve correctamente en todos los idiomas sin necesidad de traducción.

### Estilo visual del cuadro de texto

- **En `codigo-padre.html`** (`.texto-parada-overlay`): fondo naranja (`#f5a623`), texto negro (`#111`).
- **En `En-busca-del-tesoro.html`** (P10 `.audio-overlay`): fondo naranja (`#f5a623`), texto negro (`#111`).

### Traducciones

Cada parada tiene un texto en cada uno de los 6 idiomas. La estructura es:

```
TEXTOS_AVENTURAS.Aventura1.es[0]  → Intro en español
TEXTOS_AVENTURAS.Aventura1.es[1]  → Parada 0 en español
TEXTOS_AVENTURAS.Aventura1.en[0]  → Intro en inglés
TEXTOS_AVENTURAS.Aventura1.en[1]  → Parada 0 en inglés
... etc.
```

Los `title` de cada entrada están traducidos al idioma correspondiente (ej: "Parada 5" en español → "Stop 5" en inglés → "Arrêt 5" en francés). Los nombres de monumentos se mantienen en su nombre original.

---

## 15. Los vídeos

### Ubicación

Los vídeos están en `videos-aventuras/` organizados por aventura:

```
videos-aventuras/
├── av1/           (Aventura 1)
│   ├── parada_0.mp4
│   ├── parada_1.mp4
│   └── ...
├── av2/           (Aventura 2)
├── av3/           (Aventura 3)
├── Av34km/        (Aventura 34km)
└── avfallas/      (Aventura Fallas)
```

### Cómo se usan

- Cada parada puede tener un vídeo asociado (definido en `coordenadas-aventuras.js` → campo `video`).
- Los vídeos se reproducen en el flujo de la aventura (pantalla P9 en En-busca-del-tesoro.html).
- También hay una galería general en `videos-valencia-historica.html`.

---

## 16. El backend (servidor)

### Tecnología

- **Node.js** (versión 18+)
- **Express** 4.18 — framework web
- **Helmet** — headers de seguridad HTTP
- **CORS** — control de orígenes cruzados
- **express-rate-limit** — limitación de peticiones
- **morgan** — logging de peticiones HTTP

### Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend (servidor estático) | 8080 | Sirve HTML, JS, CSS, imágenes, audios, vídeos |
| Backend (API) | 3001 | Sirve datos JSON y valida autenticación |

### Endpoints de la API

Todas las rutas comienzan con `/api/`:

| Método | Ruta | Protegida | Qué hace |
|--------|------|-----------|----------|
| `GET` | `/api/health` | No | Estado del servidor (ping) |
| `POST` | `/api/auth/activar` | No | Recibe código de activación, devuelve token JWT |
| `GET` | `/api/auth/verificar` | No | Comprueba si un token es válido |
| `GET` | `/api/aventuras` | Sí* | Lista todas las aventuras |
| `GET` | `/api/aventuras/:id` | Sí* | Detalle de una aventura |
| `GET` | `/api/aventuras/:id/completa` | Sí* | Todos los datos de una aventura |
| `GET` | `/api/coordenadas/:aventuraId` | Sí* | Coordenadas de todas las paradas |
| `GET` | `/api/coordenadas/:aventuraId/parada/:id` | Sí* | Coordenadas de una parada concreta |
| `GET` | `/api/audios/:aventuraId/:idioma` | Sí* | Metadatos de audios |
| `GET` | `/api/retos/:aventuraId/:idioma` | Sí* | Retos (sin respuestas correctas) |
| `POST` | `/api/retos/:aventuraId/:idioma/:retoId/validar` | Sí* | Valida una respuesta |
| `GET` | `/api/puzzles/:aventuraId` | Sí* | Lista de puzzles |

> *Sí\**: protegida con `requireAuth`. En desarrollo es pass-through (deja pasar todo). En producción requiere token JWT válido.

### El DataService

El fichero `backend/services/dataService.js` carga todos los JSON en memoria al arrancar y sirve como capa de acceso a datos. No usa base de datos: todo está en ficheros JSON.

```
server.js → routes/*.js → dataService.js → data/*.json (en memoria)
```

### Validación de parámetros (middleware)

El fichero `backend/middleware/validation.js` valida que los parámetros que recibe la API sean correctos:

| Parámetro | Formato válido | Ejemplo |
|-----------|---------------|---------|
| `aventuraId` | `Aventura` + número | `Aventura1`, `Aventura7` |
| `idioma` | Uno de: es, en, fr, it, nl, ja | `es` |
| `paradaId` | `P-` + número | `P-0`, `P-5` |
| `tramoId` | `TR-` + número | `TR-1`, `TR-5` |
| `retoId` | `R-` + número o `PZ-` + número | `R-3`, `PZ-01` |

Si cualquier parámetro es inválido, la API devuelve un error 400 con un mensaje claro.

---

## 17. Seguridad y protección

La aplicación tiene un sistema de seguridad completo preparado para producción. En desarrollo, todo funciona en modo "abierto" (pass-through) para facilitar el trabajo.

### Capas de seguridad implementadas

| Capa | Qué hace | Estado |
|------|---------|--------|
| **Helmet** | Añade headers de seguridad HTTP (CSP, XSS protection, etc.) | ✅ Activo siempre |
| **CORS** | Solo permite peticiones desde orígenes autorizados (localhost + dominio) | ✅ Activo siempre |
| **Rate Limit global** | Máximo 100 peticiones por IP cada 15 minutos | ✅ Activo siempre |
| **Rate Limit activación** | Máximo 10 intentos de activar código cada 15 minutos | ✅ Activo siempre |
| **Rate Limit retos** | Máximo 30 validaciones de reto cada 5 minutos | ✅ Activo siempre |
| **Penalización progresiva** | Tras cada fallo de activación, el tiempo de espera aumenta: 0s → 0s → 5s → 15s → 60s → 5 minutos | ✅ Activo siempre |
| **Ban automático de IP** | 20 fallos en 1 hora → IP bloqueada 24 horas | ✅ Activo siempre |
| **Sanitización de entrada** | Rechaza XSS (`<script>`), SQL injection (`SELECT FROM`), template injection (`${}`) | ✅ Activo siempre |
| **Validación de código** | Solo acepta letras, números, guiones. Máximo 50 caracteres. | ✅ Activo siempre |
| **Validación de respuestas** | Strip HTML, máximo 500 caracteres, máximo 20 opciones | ✅ Activo siempre |
| **Log de seguridad** | Todo evento sospechoso se registra en `backend/logs/security.log` | ✅ Activo siempre |
| **Autenticación JWT** | Token obligatorio para acceder a datos de aventuras | ⏸️ Preparado (activar con `AUTH_ENABLED=true`) |
| **Protección de ficheros** | Bloquea acceso directo a JS sensibles desde el navegador | ⏸️ Preparado (activar con `PROTECT_DATA=true`) |
| **`.gitignore`** | Impide que `.env`, certificados SSL y logs lleguen al repositorio | ✅ Activo |
| **Validación de arranque** | El servidor no arranca en producción si `JWT_SECRET` es débil o `AUTH_ENABLED` no es `true` | ✅ Activo |
| **JWT_SECRET privado** | El secreto JWT no se exporta fuera del módulo de autenticación | ✅ Activo |

### El fichero de log de seguridad

Cada evento de seguridad se registra en `backend/logs/security.log` en formato JSON, una línea por evento:

```json
{"timestamp":"2026-04-06T23:12:14.882Z","type":"SUSPICIOUS_INPUT","ip":"::1","message":"Input sospechoso detectado y rechazado"}
{"timestamp":"2026-04-06T23:12:15.087Z","type":"AUTH_SUCCESS","ip":"::1","message":"[DEV] Activación exitosa: Aventura1"}
```

### El token de sesión

Cuando se active la autenticación, el flujo será:

1. El usuario paga y recibe un **código de activación** (ej: `VVG-2026-ABC123`).
2. Introduce el código en la pantalla P13 de En-busca-del-tesoro.html.
3. El frontend envía `POST /api/auth/activar` con el código.
4. El backend valida el código contra su base de datos.
5. Si es válido → devuelve un **token JWT** con duración de 24 horas.
6. El frontend guarda el token en `sessionStorage` (se borra al cerrar el navegador).
7. A partir de ese momento, todas las peticiones al backend incluyen el token.
8. Los datos de la aventura (coordenadas, textos, retos) solo se entregan con token válido.

### Cómo activar la seguridad completa

Tres variables de entorno en el backend:

```
AUTH_ENABLED=true              ← Activa la autenticación JWT
PROTECT_DATA=true              ← Bloquea acceso directo a ficheros JS sensibles
JWT_SECRET=clave-secreta-larga ← Clave para firmar tokens (cambiar en producción)
```

---

## 18. El sistema de tests

### Dos tipos de tests

La aplicación tiene dos sistemas de tests complementarios:

#### Tests del backend (Jest)

Ficheros `.test.js` en `tests/` que se ejecutan con `npm test` desde la carpeta `backend/`.

| Test | Qué verifica |
|------|-------------|
| `aventuras.test.js` | Que la API de aventuras devuelve datos correctos |
| `coordenadas.test.js` | Que las coordenadas se sirven correctamente |
| `audios.test.js` | Que los audios se sirven por aventura e idioma |
| `retos.test.js` | Que los retos se sirven sin respuestas y que la validación funciona |
| `puzzles.test.js` | Que los puzzles se sirven correctamente |
| `middleware.test.js` | Que la validación de parámetros funciona |
| `errors.test.js` | Que los errores se formatean bien |
| `health.test.js` | Que el endpoint de salud responde |
| `dataService.test.js` | Que el servicio de datos carga y busca correctamente |

Para ejecutarlos:

```bash
cd backend
npm test
```

#### Tests HTML del frontend (navegador)

Ficheros `test_*.html` en `tests/` que se abren directamente en el navegador.

Estos tests son necesarios porque la comunicación padre-hijo mediante iframes **no se puede simular en Jest**. Solo funciona en un navegador real.

| Test | Qué verifica |
|------|-------------|
| `test_hijo_handshake.html` | El protocolo de arranque padre↔hijo |
| `test-iframe-basico.html` | Comunicación básica entre iframes |
| `test_audio_distribution.html` | Que los datos de audio se cargan correctamente |
| `test_cambio_modo.html` | La transición CASA ↔ AVENTURA |
| `test_cambio_parada.html` | El cambio entre paradas |
| `master-test.html` | Panel de orquestación: ejecuta múltiples tests |

Para ejecutarlos: abrir el fichero HTML en el navegador (o desde `http://localhost:8080/tests/master-test.html`).

---

## 19. PWA y Service Worker

### ¿Qué es una PWA?

Una Progressive Web App (PWA) es una aplicación web que se comporta como una app nativa: se puede "instalar" en el móvil, funciona sin conexión (parcialmente), y tiene su propio icono.

### El manifest.json

Define cómo se ve la app cuando se instala en el móvil:

```json
{
    "name": "Valencia VGuides",
    "short_name": "VGuides",
    "description": "Audioguía interactiva con GPS de la Valencia histórica",
    "start_url": "/codigo-padre.html",
    "display": "standalone",
    "orientation": "portrait",
    "background_color": "#1a1a2e",
    "theme_color": "#ff8c00"
}
```

- Se abre en **modo standalone** (sin barra de direcciones del navegador).
- Solo en **vertical** (portrait).
- Colores: fondo oscuro (`#1a1a2e`), tema naranja (`#ff8c00`).

### El Service Worker (sw.js)

Gestiona el caché de la aplicación para que funcione sin conexión:

- **Se cachean** (preload al instalar): todos los HTML, todos los JS, los iconos.
- **NO se cachean** (siempre requieren red): audios MP3, vídeos MP4, imágenes de aventuras, llamadas a la API.
- **Estrategia**: Network First (intenta la red primero; si falla, usa caché).
- **Actualización**: cambiar `CACHE_VERSION` en `sw.js` para invalidar el caché antiguo.

---

## 20. Estructura de carpetas

```
proyecto/
│
├── index.html                 ← Página de redirección → codigo-padre.html
├── codigo-padre.html          ← APLICACIÓN PRINCIPAL (padre)
├── En-busca-del-tesoro.html   ← Hijo 1: flujo de aventura
├── coordenadas-hijo2.html     ← Hijo 2: mapa GPS
├── audio-hijo3.html           ← Hijo 3: reproductor de audio
├── retos-hijo4.html           ← Hijo 4: retos y preguntas
├── boton-casa-hijo5.html      ← Hijo 5: botón volver a casa
├── puzzle.html                ← Juego de puzzle
├── mapa-completo.html         ← Mapa de todas las aventuras
├── agradecimientos.html       ← Créditos
├── videos-valencia-historica.html
├── consejos-valencia.html
├── gastronomia.html
├── paginas-oficiales-valencia.html
├── extrainfo-hijo1.html
│
├── manifest.json              ← Configuración PWA
├── sw.js                      ← Service Worker (caché offline)
├── CNAME                      ← Dominio para GitHub Pages
│
├── js/                        ← Código JavaScript del frontend
│   ├── app.js                 ← Orquestación principal
│   ├── state-manager.js       ← Estado centralizado con mutex
│   ├── mensajeria.js          ← Comunicación padre↔hijos
│   ├── config.js              ← Configuración global
│   ├── constants.js           ← Constantes (tipos de mensaje, modos, etc.)
│   ├── logger.js              ← Sistema de logging
│   ├── utils.js               ← Utilidades generales
│   ├── api-client.js          ← Cliente HTTP para el backend
│   ├── data-loader.js         ← Cargador de datos (local/API)
│   ├── device-detection.js    ← Detección móvil/desktop
│   ├── error-handler-ui.js    ← Manejo visual de errores
│   ├── monitoreo.js           ← Métricas y monitorización
│   ├── validacion.js          ← Validación de datos
│   ├── suppress-warnings.js   ← Supresión de avisos de consola
│   ├── server.js              ← Servidor estático (puerto 8080)
│   ├── funciones-mapa.js      ← Funciones del mapa Leaflet
│   ├── mapa-vintage-aventuras.js
│   ├── coordenadas-aventuras.js   ← DATOS: coordenadas GPS
│   ├── textos-aventuras.js        ← DATOS: textos narrativos
│   ├── retos-aventuras.js         ← DATOS: retos y respuestas
│   ├── audios-aventuras.js        ← DATOS: metadatos de audio
│   ├── puzzles-aventuras.js       ← DATOS: puzzles
│   ├── indice-aventuras.js        ← DATOS: índice de aventuras
│   ├── aventuras-ID-padre.js
│   ├── terminos-aventuras.js
│   └── agradecimientos-aventuras.js
│
├── backend/                   ← Servidor API (Node.js + Express)
│   ├── server.js              ← Punto de entrada del backend
│   ├── package.json           ← Dependencias npm
│   ├── routes/                ← Definición de endpoints API
│   │   ├── aventuras.js
│   │   ├── coordenadas.js
│   │   ├── audios.js
│   │   ├── retos.js
│   │   ├── puzzles.js
│   │   ├── health.js
│   │   └── auth.js
│   ├── services/
│   │   └── dataService.js     ← Carga y sirve datos JSON
│   ├── middleware/
│   │   ├── auth.js            ← Autenticación JWT
│   │   ├── validation.js      ← Validación de parámetros
│   │   ├── errorHandler.js    ← Manejo centralizado de errores
│   │   ├── ipBan.js           ← Ban automático de IPs
│   │   └── inputSanitizer.js  ← Sanitización de entrada
│   ├── utils/
│   │   ├── ApiError.js        ← Clase de errores
│   │   └── securityLogger.js  ← Logger de eventos de seguridad
│   ├── data/                  ← Datos JSON (servidos por la API)
│   └── logs/                  ← Logs del servidor
│
├── audios-aventuras/          ← Ficheros MP3 organizados por idioma
│   ├── español/
│   ├── english/
│   ├── frances/
│   ├── italiano/
│   ├── holandes/
│   └── japones/
│
├── videos-aventuras/          ← Vídeos MP4 organizados por aventura
│   ├── av1/
│   ├── av2/
│   └── ...
│
├── imagenes/                  ← Imágenes
│   ├── imagenes-aplicación/   ← Iconos, logos, UI
│   ├── imagenes-aventuras/    ← Fotos de monumentos
│   └── imagenes-mapas-vintage/ ← Tiles del mapa vintage
│
├── tests/                     ← Tests del backend (Jest) + frontend (HTML)
│
└── docs/                      ← Esta documentación
```

---

## 21. Cómo arrancar la aplicación en local

### Requisitos previos

- **Node.js** versión 18 o superior (`node --version` para comprobar).
- Un navegador moderno (Chrome, Firefox, Edge, Safari).

### Paso 1: Instalar dependencias del backend

```bash
cd backend
npm install
```

### Paso 2: Arrancar el servidor estático (frontend)

Desde la raíz del proyecto:

```bash
node js/server.js
```

Esto arranca un servidor en `http://localhost:8080`. Abre esa URL en el navegador.

### Paso 3: Arrancar el backend (opcional en desarrollo)

En otra terminal:

```bash
cd backend
npm run dev
```

Esto arranca la API en `http://localhost:3001`. Es necesario solo si quieres usar los endpoints del backend.

### Paso 4: Usar la aplicación

Abre `http://localhost:8080/codigo-padre.html` en el navegador (o simplemente `http://localhost:8080`, que redirige automáticamente).

---

## 22. Preparación para producción

### Checklist para el despliegue

1. **Verificar `.gitignore`**: asegurarse de que `backend/.env`, `backend/certs/` y `backend/logs/` están excluidos antes de cualquier `git push`. El fichero `.gitignore` ya está en la raíz del proyecto.

2. **HTTPS obligatorio**: la app usa GPS y Service Worker, que requieren HTTPS. Cloudflare lo ofrece gratis.

3. **Variables de entorno del backend**:
   ```
   NODE_ENV=production
   AUTH_ENABLED=true
   PROTECT_DATA=true
   JWT_SECRET=una-clave-secreta-muy-larga-y-aleatoria-de-32-caracteres-minimo
   DOMAIN=valenciavguides.es
   ```

4. **Instalar jsonwebtoken** (necesario para producción):
   ```bash
   cd backend
   npm install jsonwebtoken
   ```

5. **Configurar SSL**: el fichero `backend/setup-ssl.sh` tiene instrucciones para Let's Encrypt. Si usas Cloudflare, el SSL se configura automáticamente.

6. **Configurar DNS**: apuntar `valenciavguides.es` al servidor. El fichero `CNAME` ya está preparado para GitHub Pages (si se usa).

7. **Cambiar DATA_MODE a 'api'** en `js/data-loader.js`:
   ```javascript
   const DATA_MODE = 'api';  // era 'local'
   const API_BASE = 'https://api.valenciavguides.es/api';
   ```

8. **Actualizar CORS** en `backend/server.js`: los orígenes de producción ya están configurados (`https://valenciavguides.es`, `https://www.valenciavguides.es`).

### Seguridad ya preparada

Todo el sistema de seguridad (rate limiting, penalización progresiva, ban de IPs, sanitización, logging) **ya está activo**. Al cambiar `AUTH_ENABLED=true`:

- Los endpoints protegidos requerirán token JWT.
- Sin token válido → error 401.
- Los ficheros JS sensibles quedarán bloqueados si `PROTECT_DATA=true`.
- Las respuestas correctas de los retos nunca se enviarán al navegador.

---

## 23. Glosario de términos

| Término | Significado |
|---------|-------------|
| **Padre** | La página principal (`codigo-padre.html`) que contiene los iframes |
| **Hijo** | Una página cargada dentro de un iframe del padre |
| **Iframe** | Ventana incrustada dentro de otra página web |
| **PostMessage** | API del navegador para enviar mensajes entre ventanas |
| **Handshake** | Protocolo de saludo entre padre e hijo al arrancar |
| **Heartbeat** | Mensajes periódicos ("latidos") para verificar que un hijo sigue activo |
| **ACK** | Confirmación de que un mensaje fue recibido |
| **Parada** | Punto de interés en una aventura (un monumento, una plaza...) |
| **Tramo** | Camino entre dos paradas |
| **Reto** | Pregunta o desafío que el usuario debe resolver en cada parada |
| **Modo CASA** | Estado de la app cuando el usuario está en el menú principal |
| **Modo AVENTURA** | Estado de la app cuando el usuario está haciendo un recorrido |
| **PWA** | Progressive Web App — aplicación web instalable como app nativa |
| **Service Worker** | Script que gestiona el caché para funcionamiento offline |
| **JWT** | JSON Web Token — sistema de autenticación basado en tokens firmados |
| **Rate Limit** | Límite de peticiones por IP en un periodo de tiempo |
| **Sanitización** | Limpieza de datos de entrada para evitar ataques (XSS, SQL injection) |
| **Leaflet** | Biblioteca JavaScript para mapas interactivos |
| **Waypoints** | Puntos intermedios de una ruta en el mapa |
| **DataService** | Módulo del backend que carga y sirve los datos JSON |
| **Pass-through** | Modo en que el middleware de seguridad deja pasar todo (desarrollo) |
| **Polyline** | Línea dibujada en el mapa que conecta puntos (la ruta a pie) |
| **Mutex** | Cerrojo que impide que dos operaciones modifiquen el mismo dato simultáneamente |
| **Trunk** | Herramienta de análisis de código (linter) |

---

## 24. La experiencia del usuario: narrativa completa del modo AVENTURA

> Esta sección describe paso a paso qué vive el usuario desde que abre la aplicación hasta que completa una aventura, explicado de forma narrativa para que sea fácil de entender.

---

### 24.1. Abriendo la aplicación por primera vez

El turista abre el navegador de su móvil y entra en **valenciavguides.es**. La aplicación carga `codigo-padre.html`, que es el cerebro de todo. Lo primero que ve es una **animación de carga** (un Pac-Man animado) mientras se inicializan los sistemas internos.

En segundo plano, el padre:
- Registra el Service Worker para que la app funcione como PWA.
- Carga el sistema de mensajería entre iframes.
- Prepara el mapa base (Leaflet).
- Carga el iframe de selección (`En-busca-del-tesoro.html`).

La aplicación arranca en **modo CASA** — el estado "neutro" donde aún no hay aventura activa.

---

### 24.2. Las pantallas de demo (gratuitas)

Una vez cargado todo, el usuario ve la primera pantalla con el logo de Valencia VGuides. A partir de aquí recorre **13 pantallas** dentro del iframe de selección. Todas son gratuitas y forman la experiencia de demo:

**Pantalla 1 — Bienvenida.** El logo de la marca sobre fondo naranja. Un botón con una flecha invita a empezar.

**Pantalla 2 — Selección de idioma.** Aparecen **6 banderas** en una cuadrícula 2×3: España, países anglófonos, Francia, Italia, Países Bajos y Japón. El usuario toca la bandera de su idioma. Ese idioma se guarda en `localStorage` como `vv_idioma` y se envía al padre mediante un mensaje `IDIOMA_SELECCIONADO`.

**Pantalla 3 — Confirmación de idioma.** Se muestra la bandera elegida. Dos botones: ✓ (verde) para confirmar o ✗ (rojo) para volver a elegir. Si el idioma elegido no tiene audios disponibles para la aventura seleccionada posteriormente, aparecerá un aviso: *"¿Deseas continuar sin audio?"*. Si dice que no, vuelve a P2.

**Pantalla 4 — Términos y condiciones.** Un cuadro de texto con scroll muestra los términos en el idioma elegido. El botón "Aceptar" está **deshabilitado** hasta que el usuario haga scroll hasta el final del texto. Solo cuando llega abajo del todo se activa el botón.

**Pantalla 5 — Selección de aventura.** Se listan las aventuras disponibles. Cada botón muestra una línea con estadísticas visuales universales (no necesitan traducción):

```
València centro histórico 1    👣±4km 🏛️19 📍41 🧩30 ⏳max60h
```

Actualmente solo la Aventura 1 está disponible; las demás aparecen bloqueadas. Al tocar una aventura, se muestra un **overlay con el mapa vintage** del recorrido. La aventura se guarda en `localStorage` como `vv_aventura`.

**Pantalla 6 — Confirmación de aventura.** Similar a P3: se muestra el nombre de la aventura elegida con dos botones (✓/✗). Si confirma, continúa.

**Pantalla 7 — Reto 1 (prueba de conocimiento).** Una pregunta con opciones tipo test. El botón de avanzar está deshabilitado hasta elegir respuesta. Si acierta, el borde se pone verde, aparece un ✓ y avanza automáticamente a P8 a los 1,5 segundos. Si falla, el borde se pone rojo, vibra el móvil (300 ms) y puede reintentar.

**Pantalla 8 — Puzzle interactivo.** Un puzzle visual cargado en un iframe interno (`puzzle.html`). El botón de continuar es un círculo rojo grande (7 rem) que se vuelve verde cuando el puzzle se completa. Si la imagen del puzzle no existe, se salta automáticamente a P9. Durante esta pantalla, en segundo plano, el padre recibe un mensaje `PREPARAR_HIJOS` y empieza a cargar los iframes de los hijos (coordenadas, audio, retos, opciones y el botón casa).

**Pantalla 9 — Vídeo introductorio.** Actualmente es un placeholder ("Próximamente"). Un botón avanza a P10.

**Pantalla 10 — Audio y texto de introducción.** El usuario escucha un audio narrativo de bienvenida mientras lee un texto descriptivo con fondo naranja. Ambos se cargan desde `js/audios-aventuras.js` y `js/textos-aventuras.js` respectivamente, en el idioma seleccionado.

**Pantalla 11 — Reto 2 (pregunta de confirmación).** Una pregunta SÍ/NO traducida al idioma del usuario. Es una **puerta de seguridad**: si elige "SÍ", avanza a la pantalla de pago. Si elige "NO", **todo se reinicia** desde P1. Es la última oportunidad de arrepentirse.

**Pantalla 12 — Pantalla de pago.** Actualmente es un stub con texto "Próximamente". En el futuro integrará una pasarela de pago real. Por ahora avanza directamente a P13.

**Pantalla 13 — Código de activación.** El usuario introduce su email (campo cosmético, de momento deshabilitado) y un **código de activación** recibido tras la compra. El código se valida en tiempo real: si coincide, el borde se pone verde y se habilita el botón 🚀. El código de prueba actual es `0000`. Al pulsar el cohete:

1. Se envía un mensaje `INICIAR_AVENTURA` al padre con la aventura, el idioma y la marca de tiempo.
2. El padre guarda en `localStorage` la clave `vv_aventura_iniciada` con estos datos.
3. Se cargan los iframes hijos en paralelo (coordenadas, audio, opciones, botón casa).
4. Se distribuyen los datos de la aventura a todos los hijos.
5. Se oculta el iframe de selección.
6. Se muestran los iframes de juego.
7. **Se activa el modo AVENTURA.**

---

### 24.3. El modo AVENTURA comienza

En el instante en que el padre cambia a modo AVENTURA, ocurren varias cosas simultáneamente:

- **Se activa el GPS.** El navegador pide permiso de geolocalización (si no lo tenía ya). Se usa `watchPosition` con alta precisión (`enableHighAccuracy: true`), sin caché (`maximumAge: 0`) y un timeout de 30 segundos. Las posiciones se actualizan cada **3 segundos**.

- **Se inicia el heartbeat.** Cada **5 segundos** el padre envía un "latido" a todos los hijos para verificar que siguen vivos. Si un hijo falla **3 latidos consecutivos**, se marca como desconectado y se intenta reconectar.

- **Se establece la parada por defecto.** Si hay progreso guardado de una sesión anterior, se restaura. Si no, se posiciona en la primera parada (P-0, que suele ser Torres de Serranos en la Aventura 1). Desde abril de 2026, este arranque entra por el mismo controlador central `NAVEGACION.CAMBIO_PARADA` que usan los clics del usuario, la progresión normal y el GPS; ya no hay una vía separada que envíe la parada inicial directamente a `funciones-mapa.js`.

- **Se muestran los controles de juego.** El usuario ve:
  - Un **mapa vintage** con su posición GPS en tiempo real (icono azul pulsante).
  - Las **paradas** como marcadores en el mapa.
  - La **polyline** (línea de ruta) conectando las paradas.
  - Los **iframes hijos** posicionados en los bordes de la pantalla.

---

### 24.4. ¿Qué ve el usuario en la pantalla de aventura?

La pantalla de aventura se compone de varios elementos superpuestos:

**El mapa** (fondo completo): Ocupa toda la pantalla. Muestra la posición del usuario, las paradas y la ruta.

**Hijo 2 — Coordenadas** (esquina inferior-izquierda): Contiene **6 botones** organizados en 2 filas de 3:

| Botón | Icono | Función |
|-------|-------|---------|
| GPS | Ruta A→B | Abre la navegación GPS nativa (Google Maps / Apple Maps) hasta la parada actual |
| Imagen | Foto monumento | Muestra una foto de la parada actual en un overlay |
| Vídeo | Fotograma dron | Reproduce un vídeo aéreo del monumento |
| Ubicación | Foto distancia | Muestra una foto indicando dónde estás respecto a la parada |
| Mapa completo | Mapa moderno | Abre un mapa moderno a pantalla completa |
| Mapa vintage | Mapa antiguo | Abre el mapa artístico a pantalla completa |

**Hijo 3 — Audio** (borde inferior): Muestra un reproductor de audio con:
- Botón **Play/Pausa** (verde cuando disponible, rojo cuando deshabilitado).
- Botón **Retos** (abre el reto de la parada actual).
- Barra de progreso del audio con tiempo transcurrido.

**Hijo 5 — Botón Casa** (esquina inferior-izquierda): Un botón cuadrado con emoji 🛰:
- En modo AVENTURA muestra **"ON"** con fondo verde.
- Al pulsarlo cambia a modo CASA (fondo rojo, "OFF"), detiene el GPS y vuelve a la pantalla de selección.
- Debajo se genera una **lista dinámica de paradas**: botones verdes (paradas), amarillos (tramos) y rojos (inicio), permitiendo saltar a cualquier punto del recorrido.

**Hijo 1 — Opciones** (esquina superior): Temporizador y ajustes de la aventura.

---

### 24.5. El usuario camina: dentro del radio de acción

Cuando el usuario está **dentro del radio de proximidad** de la parada actual, la experiencia es completa. Los valores clave son:

| Concepto | Valor | Descripción |
|----------|-------|-------------|
| Radio de llegada | **20 m** | Se considera que el usuario "ha llegado" a una parada |
| Radio de acción | **50 m** | Distancia máxima para mantener todos los controles activos |
| Precisión mínima GPS | **30 m** | Si el GPS tiene peor precisión, se ignora la posición |
| Movimiento mínimo | **5 m** | Actualización de interfaz solo si se ha movido al menos 5 metros |

Mientras el usuario está **dentro de los 50 metros**:

- ✅ **Botón GPS**: deshabilitado (rojo) — no necesita navegación, ya está en el sitio.
- ✅ **Botón Imagen**: habilitado — puede ver la foto del monumento.
- ✅ **Botón Vídeo**: habilitado — puede ver el vídeo aéreo.
- ✅ **Botón Ubicación**: deshabilitado (rojo) — no necesita ver dónde ir.
- ✅ **Botones Mapas**: habilitados — puede ver el mapa completo o vintage.
- ✅ **Audio**: habilitado — puede escuchar la narración.
- ✅ **Retos**: habilitado — puede resolver el reto de la parada.

En esta situación ideal, el usuario escucha la historia, lee el texto, mira las fotos, ve el vídeo y resuelve el reto. Cuando lo resuelve correctamente, aparecen fuegos artificiales 🎆.

---

### 24.6. Caminando entre paradas: los tramos

Un **tramo** es el camino entre dos paradas. Cuando el usuario deja una parada y camina hacia la siguiente, el padre detecta que ha entrado en un tramo y ajusta el comportamiento:

- El radio de proximidad en tramo es **dinámico**: se calcula como la distancia máxima entre waypoints consecutivos + 20 metros de buffer. Esto permite que rutas más amplias tengan tolerancias mayores.
- El audio del tramo (si existe) se carga automáticamente.
- El mapa muestra la polyline del tramo resaltada.
- El usuario puede ver los botones de imagen y vídeo del tramo (si existen).

La detección de **llegada** a la siguiente parada ocurre cuando el GPS indica que el usuario está a **20 metros o menos** de ella. En ese momento:

1. El padre decide cuál es el siguiente elemento y activa su controlador central `NAVEGACION.CAMBIO_PARADA`.
2. Ese controlador actualiza `estado.paradaActual` e `indiceProgreso`, consulta a los hijos expertos y les notifica el cambio.
3. Después dispara `vv-parada-cambiada` para que `funciones-mapa.js` haga el zoom y redibuje marcadores/polylines con la geometría real de hijo2.
4. Se persiste el progreso en `localStorage` → `vv_progreso`.
5. La parada se marca como completada en `vv_paradas_completadas`.

---

### 24.7. Cuando el usuario se aleja demasiado: fuera del radio

Si el usuario se aleja más de **50 metros** de la ruta, el sistema lo detecta y **reacciona inmediatamente**:

**Fase 1 — Advertencia inmediata (0 a 5 minutos):**
- Un **overlay de advertencia** aparece al instante en la parte superior de la pantalla con la imagen `imagenes/imagenes-aplicación/foto-fuera-rango.png`. Tiene un botón ✖ naranja para cerrarlo.
- En el **borde inferior de la pantalla**, centrado horizontalmente, aparece un **temporizador de cuenta atrás de 5 minutos** con números rojos grandes (`05:00`) sobre fondo negro con borde rojo. Es muy visible y avisa al usuario del tiempo que le queda.
- Los botones **siguen funcionando con normalidad** durante la cuenta atrás.
- El usuario puede volver al radio sin consecuencias: si lo hace, el overlay y el countdown desaparecen inmediatamente y todo se reinicia.

**Fase 2 — Bloqueo total (después de 5 minutos fuera):**

Cuando el countdown llega a `00:00`:

**Lo que se deshabilita (rojo):**
- ❌ Botón GPS → rojo, deshabilitado.
- ❌ Botón Imagen → rojo, deshabilitado.
- ❌ Botón Vídeo → rojo, deshabilitado.
- ❌ Botones Mapas → deshabilitados.
- ❌ Audio → deshabilitado (rojo).
- ❌ Retos → deshabilitados (rojo).

**Lo único que se habilita (verde):**
- ✅ Botón Ubicación → **verde, habilitado**. Es la única forma de volver: muestra una polyline en el mapa desde la posición actual hasta la parada, indicando cómo regresar a la ruta.
- Se envía un mensaje `USUARIO_FUERA_RANGO` al padre.

**El razonamiento es:** si el usuario se ha perdido, no tiene sentido que escuche audios o vea fotos de un monumento que no está viendo. Lo único útil es ayudarle a volver. El botón de ubicación le muestra exactamente cómo regresar.

**¿Cómo se recupera?** Cuando el usuario vuelve a estar dentro de los 50 metros (en cualquier fase):
1. El overlay y el countdown se ocultan automáticamente.
2. Todos los botones se restauran a su estado normal.
3. El temporizador de "fuera de rango" se reinicia.
4. La experiencia continúa donde la dejó.

---

### 24.8. Los retos en cada parada

Cuando el usuario pulsa el botón **Retos** del hijo 3 (audio), se abre el **hijo 4** (retos) como un modal a pantalla completa. Los retos pueden ser de 4 tipos:

1. **Opción única** — Una pregunta con varias respuestas tipo radio button.
2. **Opción múltiple** — Pregunta con checkboxes (varias respuestas correctas).
3. **Texto libre** — El usuario escribe una respuesta.
4. **Puzzle** — Un puzzle interactivo en un iframe.

El botón de "Siguiente" empieza **rojo (deshabilitado)**. Solo se pone **verde (habilitado)** cuando el usuario acierta. Si falla:
- El borde se pone rojo.
- El móvil vibra como feedback háptico.
- Puede reintentar sin límite.

Si acierta:
- El borde se pone verde.
- Aparecen fuegos artificiales 🎆.
- El botón "Siguiente" se habilita (verde).
- Se envía `RETO.COMPLETADO` al padre.

---

### 24.9. Volver a modo CASA

En cualquier momento, el usuario puede pulsar el botón 🛰 **ON** del hijo 5 para cambiar a modo CASA. Cuando lo hace:

1. Se envía `SISTEMA.CAMBIO_MODO` con modo `casa` al padre.
2. El padre **limpia todo el estado persistido**: elimina `vv_aventura_iniciada`, `vv_progreso` y `vv_paradas_completadas` del `localStorage`.
3. Se detiene el GPS (`watchPosition` se cancela).
4. Se pausa el heartbeat para ahorrar batería.
5. Se ocultan los iframes de juego.
6. Se muestra el iframe de selección.
7. El botón cambia a "OFF" con fondo rojo.

**Nota importante:** Volver a CASA **borra el progreso**. El usuario no podrá retomar la aventura donde la dejó si pulsa este botón.

---

### 24.10. Cerrar o recargar la página: persistencia y reanudación

Si el usuario **cierra el navegador** o **recarga la página** (por accidente, por batería baja, o porque recibió una llamada), la aplicación no pierde el progreso. El sistema de persistencia guarda en `localStorage`:

| Clave | Contenido | Cuándo se guarda |
|-------|-----------|------------------|
| `vv_idioma` | Idioma seleccionado (ej: `es`) | Al seleccionar idioma en P2 |
| `vv_aventura` | Aventura seleccionada (ej: `1`) | Al seleccionar aventura en P5 |
| `vv_aventura_iniciada` | JSON con aventura, idioma y timestamp | Al pulsar 🚀 en P13 |
| `vv_progreso` | JSON con índice, parada actual, total de paradas | En cada cambio de parada |
| `vv_paradas_completadas` | Mapa serializado de paradas completadas | Al completar cada parada |

Cuando el usuario vuelve a abrir la aplicación y el sistema detecta que hay una aventura activa (`vv_aventura_iniciada` existe), en lugar de empezar desde cero, aparece un **diálogo de reanudación** en el idioma guardado:

**Paso 1 — ¿Continuar o elegir otra?**

Se muestra un diálogo con fondo oscuro que dice:

> *"¡Aventura en curso!"*
>
> Tienes una aventura activa: **València centro histórico 1**
> Idioma: Español
> Progreso: parada 12 de 41
>
> **[ Continuar mi aventura ]** ← botón grande verde
>
> *Continuando automáticamente en 30s*
>
> [ Elegir otra aventura ] ← botón pequeño naranja

Si el usuario no toca nada, a los **30 segundos** se reanuda automáticamente (por si el turista tiene las manos ocupadas con el mapa o la cámara).

**Si elige "Continuar"** (o pasan 30 segundos):
1. Se restauran todas las variables globales (aventura, idioma).
2. Se oculta el iframe de selección.
3. Se muestran los iframes de juego.
4. Se restauran las paradas completadas.
5. Se cargan los datos de la aventura.
6. Se restaura el progreso (parada actual).
7. Se activa el modo AVENTURA y el GPS.
8. El usuario continúa exactamente donde lo dejó.

**Si elige "Elegir otra aventura"**, aparece un segundo diálogo de advertencia:

**Paso 2 — Advertencia de pérdida de progreso**

> *"⚠️ Atención"*
>
> Perderás todo el progreso de tu aventura actual:
> **València centro histórico 1 (Español)**
>
> **Además, necesitarás adquirir una nueva aventura.**
>
> **[ Volver a mi aventura ]** ← botón grande verde
>
> [ Sí, elegir otra aventura ] ← botón pequeño rojo

Si confirma que quiere otra aventura:
1. Se borran todas las claves `vv_*` del `localStorage`.
2. Se reinician las variables globales.
3. Se muestra el iframe de selección.
4. Se navega directamente a **P2 (selección de idioma)**, sin pasar por P1.
5. El usuario comienza el flujo de selección desde cero.

Ambos diálogos están **traducidos a los 6 idiomas** (español, inglés, francés, italiano, neerlandés y japonés) y se muestran siempre en el idioma que el usuario tenía guardado.

---

### 24.11. Resumen visual del flujo completo

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO ABRE LA APP                      │
│                           │                                 │
│                    ¿Aventura activa?                        │
│                    /              \                          │
│                  SÍ                NO                        │
│                  │                  │                        │
│          Diálogo reanudación    Pantallas demo              │
│          /              \       P1→P2→P3→P4→P5→             │
│     Continuar      Elegir otra  P6→P7→P8→P9→P10→            │
│         │               │       P11→P12→P13                 │
│         │          Advertencia       │                      │
│         │          /        \        │                      │
│         │     Volver    Confirmar    │                      │
│         │       │           │        │                      │
│         │       │     Limpia todo    │                      │
│         │       │      → P2          │                      │
│         ▼       ▼                    ▼                      │
│    ┌──────────────────────────────────────┐                 │
│    │         MODO AVENTURA ACTIVO         │                 │
│    │                                      │                 │
│    │  GPS activo (cada 3s, alta precisión)│                 │
│    │  Heartbeat (cada 5s)                 │                 │
│    │  Mapa vintage con posición en vivo   │                 │
│    │                                      │                 │
│    │  ┌──── DENTRO 50m ────┐              │                 │
│    │  │ Imagen ✅ Vídeo ✅  │              │                 │
│    │  │ Audio  ✅ Retos ✅  │              │                 │
│    │  │ Mapas  ✅           │              │                 │
│    │  │ GPS    ❌ Ubic. ❌  │              │                 │
│    │  └────────────────────┘              │                 │
│    │                                      │                 │
│    │  ┌──── FUERA 50m >5min ──┐           │                 │
│    │  │ Imagen ❌ Vídeo ❌     │           │                 │
│    │  │ Audio  ❌ Retos ❌     │           │                 │
│    │  │ Mapas  ❌              │           │                 │
│    │  │ GPS    ❌ Ubic. ✅     │           │                 │
│    │  │ + OVERLAY ADVERTENCIA │           │                 │
│    │  └───────────────────────┘           │                 │
│    │                                      │                 │
│    │  Cambio de parada: radio 20m         │                 │
│    │  Progreso guardado automáticamente   │                 │
│    │                                      │                 │
│    │  Botón 🛰 OFF → Volver a CASA       │                 │
│    │     (⚠️ borra progreso)              │                 │
│    └──────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 24.12. Valores técnicos de referencia

| Parámetro | Valor | Variable en código |
|-----------|-------|--------------------|
| Radio de llegada a parada | 20 m | `RADIO_PROXIMIDAD` en `config.js` |
| Radio de acción (zona activa) | 50 m | `RADIO_EXTENDIDO` / `toleranciaGPS` |
| Tolerancia en tramo | dinámica (waypoints + 20 m) | Calculada en `funciones-mapa.js` |
| Precisión mínima GPS aceptada | 30 m | `PRECISION_MINIMA` en `config.js` |
| Movimiento mínimo para actualizar | 5 m | `DISTANCIA_MINIMA` en `config.js` |
| Frecuencia actualización GPS | 3 s | `INTERVALO_ACTUALIZACION` en `config.js` |
| Frecuencia heartbeat | 5 s | `INTERVALO_HEARTBEAT` en `config.js` |
| Timeout permiso GPS | 15 s | `TIMEOUT` en `config.js` |
| Timeout watchPosition | 30 s | `watchPosition` en `codigo-padre.html` |
| Tiempo fuera de rango antes de bloquear botones | 5 min | `tiempoFueraRequerido` en `coordenadas-hijo2.html` |
| Overlay + countdown fuera de rango | Inmediato al salir >50m | `verificarDistanciaYActualizarBotones` en `coordenadas-hijo2.html` |
| Heartbeats fallidos antes de reconexión | 3 | `MAX_HEARTBEATS_FALLIDOS` en `config.js` |
| Auto-continuación diálogo reanudación | 30 s | `mostrarDialogoReanudacion` en `codigo-padre.html` |

---

## 25. Los controladores JS: roles, comunicación e inicialización

Esta sección va más allá de la descripción funcional de las secciones anteriores para entrar en el **cómo** exacto: qué módulo hace qué, en qué orden arranca todo, cómo viaja cada mensaje entre padre e hijos, y qué capas de seguridad actúan antes de que el usuario toque nada.

---

### 25.1 Los módulos JavaScript y su rol

El frontend de Valencia VGuides está organizado en módulos ES6 importados entre sí. Hay dos tipos de ficheros en `js/`: los **controladores** (lógica activa) y los **datos** (arrays de contenido). Esta sección cubre los controladores.

#### Controladores de infraestructura

| Módulo | Rol |
|--------|-----|
| `constants.js` | La fuente de verdad de todas las constantes. Define `TIPOS_MENSAJE` (el catálogo completo de mensajes), `MODOS` (`'casa'` / `'aventura'`), `TTL_LIMPIEZA` (tiempos de limpieza por tipo de dispositivo), `ERRORES` (códigos de error estándar), `DESTINOS` y `CSS_CLASES`. Al final aplana el árbol de `TIPOS_MENSAJE` en `TIPOS_MENSAJE_VALIDOS` para poder validar tipos sin recorrer el árbol. Se importa en casi todos los demás módulos. |
| `config.js` | Parámetros de comportamiento del sistema: timeouts de mensajería (confirmación 5 s, extendido 10 s, rápido 2 s), configuración GPS (alta precisión, timeout 15 s, caché 5 s, intervalo 3 s), radios de proximidad, máximo de heartbeats fallidos, etc. Es el panel de control numérico de la aplicación. |
| `logger.js` | Sistema de logging centralizado con niveles (`DEBUG`, `INFO`, `WARN`, `ERROR`, `NONE`). Mantiene un buffer de hasta 500 entradas en memoria. Exporta un objeto `logger` como export por defecto con métodos `debug()`, `info()`, `warn()`, `error()`. Formatea cada línea con colores según nivel para la consola. |
| `state-manager.js` | El gestor de estado global con acceso concurrente protegido. Implementa una clase `SimpleMutex` (compatible con navegadores, sin dependencias) que serializa escrituras sobre cada campo de estado. El objeto `state` incluye: `aventuraSeleccionada`, `idiomaSeleccionado`, `paradaActual`, `modo`, `hijosInicializados` (un `Set`), `gps` (posición, precisión, watchId, error), y flags de sistema (`prewarmIniciado`, `cambiandoModo`). Expone getters y setters individuales para cada campo. |
| `utils.js` | Funciones de propósito general: `canonicalizarModo(modo)` (normaliza cadenas como `'CASA'` → `'casa'`), `generarIdUnico(prefijo)` (timestamp + aleatorio, para IDs de mensajes), `getPadreId()` (obtiene el identificador del padre desde URL, sessionStorage, o lo genera), `normalizarParadas(paradas)` (convierte formatos heterogéneos en array uniforme). |
| `device-detection.js` | Detecta el tipo de dispositivo analizando **exclusivamente el `userAgent`**. Exporta `esMovil()`, `esTelefonoMovil()`, `esTablet()`, `esIOS()`, `esAndroid()`, `getSoportaTactil()`. Los resultados se cachean en el primer acceso. Se usa en `constants.js` para ajustar los TTL de limpieza, en `mensajeria.js` para el intervalo de heartbeat, y en `codigo-padre.html` para mostrar u ocultar el mensaje de rotación. La detección se basa únicamente en el User Agent porque es el único indicador fiable: un PC/laptop nunca tiene `android`, `iphone`, `mobile`, etc. en su UA, independientemente de si tiene pantalla táctil o ratón conectado. Los checks adicionales de tamaño de pantalla y APIs de orientación se descartaron porque los navegadores modernos de escritorio exponen las mismas APIs que los móviles, produciendo falsos positivos en PC. |
| `validacion.js` | Validador de datos con un registro de validadores por tipo. Cada validador recibe el valor y devuelve `{ valido, valor, error }`. Tipos incluidos: `string`, `number`, `boolean`, `array`, `object`, `function`, `email`, `url`, `coordenadas` (lat −90..90, lng −180..180), `tipoMensaje` (contra `TIPOS_MENSAJE_VALIDOS`), `idUnico`, `positivo`, `noNegativo`, `noVacio`. Soporta opciones: `requerido`, `defecto`, `transformar`, `min`, `max`. |
| `error-handler-ui.js` | Muestra notificaciones de error al usuario (toasts y modales). Configurable: duración 5 s, máximo 3 toasts simultáneos, posición, sonido, logging a consola. No interfiere con la lógica de negocio: solo presenta errores que han llegado al nivel de usuario. |
| `suppress-warnings.js` | Silencia advertencias de consola específicas (generalmente de librerías de terceros como Leaflet) que llenarían el log sin aportar información útil. Se carga con `defer` justo tras `proteccion.js`. |

#### Controladores de comunicación y datos

| Módulo | Rol |
|--------|-----|
| `mensajeria.js` | El bus de comunicación entre padre e hijos. Centraliza todo el tráfico `postMessage`: registro de iframes, envío dirigido o broadcast, cola de mensajes, confirmaciones con timeout, limpieza periódica por TTL. Se describe en detalle en el apartado 25.3. |
| `api-client.js` | Cliente HTTP para el backend. Auto-detecta el entorno (localhost:3001 en desarrollo, dominio real en producción). Implementa `TokenManager` — un objeto global en `window.TokenManager` con `setToken()`, `getToken()`, `clearToken()`, `hasToken()` — que guarda el JWT en memoria y en `sessionStorage` para sobrevivir recargas. |
| `data-loader.js` | Carga los datos de la aventura con doble modo: `'local'` (importa los ficheros JS directamente) en localhost y `'api'` (llama al backend con token) en producción. Tiene una caché interna (`dataCache`, un `Map`) para no volver a pedir lo mismo. Exporta `cargarCoordenadas()`, `cargarTextos()`, `cargarAudios()`, `cargarRetos()`. |
| `monitoreo.js` | Recoge métricas de rendimiento (tiempos de carga, latencias de mensajes, eventos de GPS). Expone `registrarMetrica(nombre, valor, datos)`. El estado de monitoreo vive dentro del `state-manager` bajo `estadoPadre.monitoreo`. |

#### Controladores de aplicación

| Módulo | Rol |
|--------|-----|
| `app.js` | El director de orquesta. Gestiona los cambios de modo (CASA ↔ AVENTURA), coordina la carga de iframes, distribuye datos a los hijos cuando están listos, y decide cuándo avanzar de parada. Importa `DATOS_PADRE` de `aventuras-ID-padre.js` para obtener la lista `elementosIDpadre` de la aventura activa. |
| `funciones-mapa.js` | Inicializa el mapa Leaflet en el `<div id="mapa">` del padre (no en un hijo), calcula distancias con la fórmula de Haversine, gestiona marcadores y polylines, y calcula la tolerancia GPS de cada elemento (`calcularToleranciaGPS()`): 50 m fijo para paradas, dinámica (distancia máxima entre waypoints + 20 m) para tramos. |
| `proteccion.js` | IIFE de protección anti-inspección. Se describe en el apartado 25.5. |

#### Ficheros de datos (no controladores, pero esenciales)

Estos ficheros contienen solo datos exportados, sin lógica:

| Fichero | Qué contiene |
|---------|-------------|
| `coordenadas-aventuras.js` | Todas las coordenadas GPS de paradas y tramos (waypoints), organizadas por aventura. |
| `textos-aventuras.js` | Los textos narrativos de cada parada, en los 6 idiomas. |
| `audios-aventuras.js` | Las rutas a los ficheros MP3 de cada parada e idioma. |
| `retos-aventuras.js` | Las preguntas, opciones y respuestas correctas de cada reto, por aventura e idioma. |
| `puzzles-aventuras.js` | La definición de cada puzzle (tipo, piezas, solución). |
| `aventuras-ID-padre.js` | Los arrays `elementosIDpadre`: la lista ordenada de elementos (paradas y tramos) que el padre usa para saber en qué punto del recorrido está y qué datos enviar a cada hijo. |
| `mapa-vintage-aventuras.js` | La configuración de estilo del mapa (teselas vintage, colores, fuentes). |
| `indice-aventuras.js` | Metadatos de cada aventura: nombre, distancia, vehículo, estado de disponibilidad. |

---

### 25.2 El orden de inicialización: de nada a todo en ~600 ms

Cuando el navegador abre `codigo-padre.html`, hay un orden de carga muy específico que garantiza que cada pieza esté disponible antes de que la siguiente la necesite.

```
Tiempo     Qué ocurre
─────────────────────────────────────────────────────────────────────
~0 ms      El navegador empieza a analizar codigo-padre.html

~30 ms     proteccion.js se ejecuta (IIFE, síncrono)
           → Bloquea F12, clic derecho, arrastrar elementos
           → Instala el detector de DevTools por timing/resize

~60 ms     suppress-warnings.js se carga (defer)
           → Silencia advertencias de Leaflet

~100 ms    CSS de Leaflet se aplica (desde CDN)
           Leaflet JS y sus plugins (rotate, geometryutil) se cargan

~150 ms    Stubs globales quedan disponibles en window:
           → activarGPS()       (encola llamadas hasta la impl. real)
           → ejecutarValidacion() (delegará al validador real)
           → getPadreId()       (obtiene/genera el ID del padre)

~200 ms    El <div id="mapa"> está listo en el DOM

~300 ms    Módulos ES6 empiezan a ejecutarse (import chain):

           funciones-mapa.js
            └── mensajeria.js
                 └── constants.js   → TIPOS_MENSAJE, TTL, MODOS
                 └── logger.js      → objeto logger disponible
                 └── utils.js       → generarIdUnico, canonicalizarModo
                 └── device-detection.js → esMovil()

~350 ms    state-manager.js inicializa su estado
           → Crea el objeto state con todos los campos en valor inicial
           → Crea mutexes por campo
           → Expone window.__vv_stateManager

~400 ms    mensajeria.js termina de cargar
           → Registra el listener window.addEventListener('message', ...)
           → Expone window.mensajeria (API pública)
           → Dispara el evento CustomEvent 'mensajeriaReady'

~450 ms    app.js recoge el evento 'mensajeriaReady'
           → Registra manejadores de CAMBIO_MODO, HEARTBEAT, etc.
           → Queda a la espera de que los hijos anuncien su presencia

~500 ms    Los iframes reciben su src y empiezan a cargar:
           → seleccion ← En-busca-del-tesoro.html
           → hijo2     ← coordenadas-hijo2.html
           → hijo3     ← audio-hijo3.html
           → hijo4     ← retos-hijo4.html
           → hijo5     ← boton-casa-hijo5.html
           → hijo1-opciones ← extrainfo-hijo1.html

~550 ms    Cada hijo ejecuta su propia cadena de inicialización:
           → proteccion.js (IIFE)
           → suppress-warnings.js
           → Sus propios módulos JS
           → Envía SISTEMA.HIJO_PREPARADO al padre

~600 ms    El padre recibe HIJO_PREPARADO de cada hijo
           → Lo registra en state.hijosInicializados (Set)
           → Cuando todos los necesarios están listos:
             Envía SISTEMA.PADRE_DATOS a cada hijo con su paquete de datos

~650 ms    Cada hijo procesa PADRE_DATOS, carga sus datos y envía HIJO_LISTO
           → El padre confirma con PADRE_CONFIRMA_HIJO_LISTO

           ─── La aplicación está lista ───
```

**Por qué este orden importa:**
- `proteccion.js` debe ser el primero: si el usuario abre las DevTools durante la carga, la protección ya debe estar activa.
- Los stubs de `activarGPS` y `ejecutarValidacion` permiten que los hijos llamen a estas funciones antes de que el módulo real esté disponible; las llamadas quedan encoladas y se ejecutan cuando el módulo real toma el relevo.
- `mensajeria.js` debe estar lista antes de que cualquier iframe empiece a enviar mensajes, porque es quien registra el listener `window.message`.

---

### 25.3 La mensajería en profundidad

Todo el tráfico entre padre e hijos pasa por `js/mensajeria.js` usando la API nativa `window.postMessage()`. Nunca hay llamadas directas a funciones de otro iframe.

#### Estructura de un mensaje

```javascript
{
    tipo:                "NAVEGACION.CAMBIO_PARADA", // del árbol TIPOS_MENSAJE
    datos:               { paradaId: "P-5", aventuraId: "Aventura1" },
    id:                  "msg-1712456789-ab3f",      // generarIdUnico('msg')
    timestamp:           1712456789123,
    origen:              "padre",                     // componenteId del emisor
    tipoOrigen:          "padre",                     // 'padre' | 'hijo'
    destino:             "hijo2",                     // opcional
    requiereConfirmacion: true                        // opcional
}
```

#### El árbol de tipos de mensaje (TIPOS_MENSAJE)

Los tipos están organizados en categorías jerárquicas. Las categorías principales son:

| Categoría | Ejemplos de mensajes |
|-----------|---------------------|
| `SISTEMA` | `HIJO_LISTO`, `HIJO_PREPARADO`, `PADRE_DATOS`, `PADRE_CONFIRMA_HIJO_LISTO`, `CAMBIO_MODO`, `CAMBIO_MODO_ENTENDIDO`, `CAMBIO_MODO_EFECTUADO`, `HEARTBEAT`, `ACK`, `NACK`, `ERROR`, `CONFIRMACION` |
| `NAVEGACION` | `CAMBIO_PARADA`, `GPS.ACTIVAR`, `GPS.DESACTIVAR`, `GPS.UBICACION_ACTUALIZADA`, `GPS.ESTADO_GLOBAL`, `SOLICITAR_DATOS_PARADAS`, `RESPUESTA_DATOS_PARADAS`, `SOLICITAR_COORDENADAS`, `RESPUESTA_COORDENADAS` |
| `DATOS` | Solicitudes y respuestas de carga de coordenadas, audios, textos, retos |
| `AUDIO` | `REPRODUCIR_REQUEST`, `REPRODUCIR_RESPONSE`, `FIN_REPRODUCCION`, `ESTADO_ACTUALIZADO` |
| `RETO` | `MOSTRAR`, `RESULTADO`, `COMPLETADO`, `SOLICITAR_RETO`, `RESPUESTA_RETO` |
| `UI` | Notificaciones visuales, navegación externa |
| `MONITOREO` | Métricas, registro de eventos internos |
| `COORDINACION` | Solicitud de datos entre hijos coordinada por el padre |
| `MAPA` | Operaciones sobre el mapa Leaflet |
| `SELECCION` | Cambios de idioma y aventura durante la pantalla de selección |
| `AVENTURA` | Inicio, finalización y eventos de la aventura activa |

#### Cómo envía el padre a un hijo concreto

```javascript
// Llamada externa:
enviarMensaje('NAVEGACION.CAMBIO_PARADA', { paradaId: 'P-5' }, 'hijo2');

// Internamente en mensajeria.js:
const iframeInfo = iframesRegistrados.get('hijo2');  // Map<id, {elemento, ...}>
const targetWindow = iframeInfo.elemento.contentWindow;
targetWindow.postMessage(mensajeCompleto, '*');
```

El `'*'` en el origen es necesario porque en desarrollo la aplicación se ejecuta con protocolo `file://`, que no tiene un origen estándar. En producción, el CSP y la validación de origen del lado receptor compensan este wildcard.

#### Cómo responde un hijo

```javascript
// En cualquier hijo (ej. hijo2):
window.parent.postMessage({
    tipo:       'NAVEGACION.RESPUESTA_COORDENADAS',
    origen:     'hijo2',
    destino:    'padre',
    datos:      { coordenadas: [...] },
    timestamp:  Date.now()
}, '*');
```

#### La cola de mensajes

Si un mensaje llega antes de que el destino esté registrado, no se descarta: se añade a `colaMensajes` (un array en `mensajeria.js`). Cuando el destino se registra, la cola se vacía enviando cada mensaje pendiente en orden.

#### Las confirmaciones (ACK / timeout)

Cuando se necesita saber que el mensaje llegó y fue procesado:

```javascript
enviarMensajeConConfirmacion('DATOS.SOLICITAR_PARADAS', {}, { timeout: 5000 })
    .then(respuesta => { /* procesamos la respuesta */ })
    .catch(err => { /* timeout o error: reintentamos o logueamos */ });
```

El receptor detecta `requiereConfirmacion: true` y envía automáticamente un `SISTEMA.CONFIRMACION` con el campo `idOriginal` apuntando al ID del mensaje original. Si el timeout (por defecto 5 s, extendido 10 s para operaciones lentas) expira sin confirmación, la promesa rechaza.

#### La limpieza periódica (TTL)

Cada 10 segundos, `mensajeria.js` recorre `confirmacionesPendientes` y elimina las entradas que hayan superado su TTL. El TTL varía por dispositivo: 30 s en móvil, 60 s en escritorio (definido en `TTL_LIMPIEZA.MENSAJERIA` de `constants.js`). Esta distinción existe porque los móviles tienen menos memoria y suspenden pestañas con más agresividad.

#### El heartbeat

Cada 5 segundos el padre envía `SISTEMA.HEARTBEAT` a todos los hijos. Cada hijo responde con `ACK`. Si un hijo no responde en 3 heartbeats consecutivos (`MAX_HEARTBEATS_FALLIDOS` en `config.js`), el padre registra el fallo e intenta reconectar recargando el iframe.

---

### 25.4 Flujo completo de un mensaje: de la acción del usuario al mapa

Para hacer concreto todo lo anterior, aquí va la traza completa de un cambio de parada iniciado desde el hijo 5 (la lista de paradas):

```
USUARIO PULSA "Parada 5" en la lista de hijo5
│
▼
[hijo5 → padre]  NAVEGACION.CAMBIO_PARADA  { paradaId: "P-5" }
│
▼ padre recibe el mensaje en su listener 'message'
  1. Valida origen (mismo origin o file://)
  2. Valida estructura (tipo, origen presentes)
  3. Ignora si origen === propio ID
  4. Busca el manejador registrado para 'NAVEGACION.CAMBIO_PARADA'
  5. Ejecuta el manejador (async):
     - Actualiza state-manager: paradaActual = "P-5"
     - Obtiene datos de P-5 desde elementosIDpadre[aventura][idioma]
     - Construye el paquete de datos para cada hijo
│
▼ padre consulta/notifica en paralelo a los hijos afectados:

  [padre → hijo2]  DATOS.COORDENADAS_PARADAS_REQUEST / NAVEGACION.CAMBIO_PARADA
  [padre → hijo3]  AUDIO.REPRODUCIR_REQUEST   { url: "audios/av1/P5-es.mp3" }
  [padre → hijo4]  RETO.MOSTRAR               { reto: { pregunta, opciones, ... } }
│
├── hijo2 recibe el mensaje:
│   - Devuelve la geometría real del elemento desde coordenadas-aventuras.js
│   - Actualiza su estado local de botones y multimedia
│   → Envía respuesta/ACK al padre
│
├── hijo3 recibe el mensaje:
│   - Detiene el audio anterior
│   - Carga el nuevo MP3 en el elemento <audio>
│   - Inicia reproducción
│   → Envía AUDIO.REPRODUCIR_RESPONSE (confirmación + metadatos)
│
└── hijo4 recibe el mensaje:
    - Renderiza la pregunta y las opciones
    - Muestra el reto en pantalla
    - Bloquea el botón "Siguiente" hasta que se responda correctamente
    → Envía ACK al padre
│
▼ padre dispara `vv-parada-cambiada`
  - funciones-mapa.js busca coords en window.__vv_DATOS_AVENTURAS (Ruta 1, mismo window, sin postMessage)
  - Si no encontradas en caché local, solicita a hijo2 vía postMessage (Ruta 2 fallback)
  - Red de seguridad: timeout de 8s limpia el lock si hijo2 no responde
  - Ejecuta el zoom `flyTo / flyToBounds`
  - Redibuja el marcador actual y las polylines

USUARIO RESPONDE AL RETO CORRECTAMENTE
│
▼
[hijo4 → padre]  RETO.COMPLETADO  { paradaId: "P-5", correcto: true }
│
▼ padre:
  - Desbloquea el avance
  - Decide cuál es la siguiente parada (P-5 → tramo TR-5 → P-6)
  - Repite el flujo de arriba para el siguiente elemento
```

---

### 25.5 La seguridad desde el cliente

La sección 17 cubre la seguridad del backend. Esta sección se centra en lo que ocurre en el navegador.

#### Primera línea: proteccion.js

Se ejecuta como IIFE en el instante en que el script se parsea, antes de cualquier módulo. Instala varias capas sin dependencias externas:

| Protección | Mecanismo | Efecto |
|-----------|-----------|--------|
| Teclas de DevTools | `keydown` con `preventDefault()` | F12, Ctrl+Shift+I/J/C, Ctrl+U no abren nada |
| Clic derecho | `contextmenu` con `preventDefault()` | El menú contextual no aparece |
| Arrastre de media | `dragstart` en img, audio, video, source, a | No se puede arrastrar contenido protegido |
| Detector por timing | `setInterval` con `performance.now()` + `debugger` | Si hay un debugger adjunto, el tiempo entre dos instrucciones se dispara; se detecta y se incrementa `_deteccionesDevtools` |
| Detector por resize | `resize` comparando `outerWidth/outerHeight` vs `innerWidth/innerHeight` | Las DevTools acopladas reducen la ventana interior; se detecta |
| Borrado de datos | Tras ≥ 2 detecciones de debugger o ≥ 3 de resize | Se ejecuta `delete window.RETOS_AVENTURAS`, `delete window.TEXTOS_AVENTURAS` y se limpia el array de coordenadas |
| Protección de consola | `console.table` y `console.dir` sobrescritos | Si se intenta inspeccionar un objeto sensible, la llamada se intercepta y rechaza |
| Sin selección de texto | Regla CSS `user-select: none` en `.protegido` y `.reto-contenido` | El usuario no puede copiar el texto de los retos |

#### Segunda línea: validación de origen en mensajería

Antes de ejecutar cualquier manejador de mensaje, `mensajeria.js` comprueba tres condiciones:

```javascript
const origenPermitido =
    event.origin === window.location.origin  // mismo protocolo+dominio+puerto
    || event.origin === 'null'               // file:// en desarrollo
    || event.source === window;              // mensajes propios

if (!origenPermitido) return;  // descarte silencioso
```

Después valida la estructura del mensaje:

```javascript
if (!mensaje || typeof mensaje !== 'object' || !mensaje.tipo) return;
if (mensaje.origen === componenteId) return;  // ignora mensajes propios
```

Un mensaje de una página externa maliciosa que intente inyectarse en el bus de comunicación es descartado sin dejar rastro.

#### Tercera línea: CSP en el padre

`codigo-padre.html` incluye una cabecera `Content-Security-Policy` que:
- Solo permite scripts de `'self'` y los CDNs declarados (unpkg.com, cdnjs.cloudflare.com)
- Solo permite estilos de `'self'`, los mismos CDNs y Google Fonts
- Solo permite conexiones a `'self'` y esos mismos CDNs
- Convierte automáticamente HTTP → HTTPS (`upgrade-insecure-requests`)
- Restringe los web workers al mismo origen

#### Cuarta línea: token JWT en API

Cuando la aventura está activa en producción, cada petición al backend lleva el token en la cabecera `Authorization: Bearer <token>`. El token:
- Se guarda en memoria (variable en `api-client.js`) y en `sessionStorage` (se borra al cerrar el navegador)
- No se expone en cookies ni en URLs
- Tiene duración de 24 horas
- Si la respuesta del backend es 401, `TokenManager.clearToken()` lo elimina y el usuario debe reactivar

---

### 25.6 El rol de cada hijo en la comunicación

Cada hijo tiene un conjunto bien definido de mensajes que envía y recibe. La tabla resume los más importantes.

#### Hijo 1 — En-busca-del-tesoro.html (la experiencia de selección)

Es el hijo más complejo. Gestiona las 13 pantallas del flujo de incorporación del usuario (selección de idioma, aventura, retos previos, pago, código de activación).

| Dirección | Tipo de mensaje | Cuándo |
|-----------|----------------|--------|
| Hijo → Padre | `SISTEMA.HIJO_PREPARADO` | Al cargarse |
| Padre → Hijo | `SISTEMA.PADRE_DATOS` | Con la aventura e idioma disponibles |
| Hijo → Padre | `SELECCION.IDIOMA_SELECCIONADO` | Al confirmar idioma en P3 |
| Hijo → Padre | `SELECCION.AVENTURA_SELECCIONADA` | Al confirmar aventura en P6 |
| Hijo → Padre | `RETO.COMPLETADO` | Al resolver R1 (P7) y R2 (P11) |
| Hijo → Padre | `SISTEMA.CAMBIO_MODO` | Al activar la aventura (P13 código correcto) |
| Padre → Hijo | `SISTEMA.CAMBIO_MODO` | Para ocultar la pantalla cuando comienza la aventura |

Además, este hijo contiene internamente un iframe propio para `puzzle.html` (el puzzle de P8), con su propia comunicación local.

#### Hijo 2 — coordenadas-hijo2.html (el mapa)

El mapa Leaflet vive aquí. Mantiene la posición del usuario y controla la proximidad a las paradas.

| Dirección | Tipo de mensaje | Cuándo |
|-----------|----------------|--------|
| Hijo → Padre | `SISTEMA.HIJO_PREPARADO` | Al cargarse |
| Padre → Hijo | `SISTEMA.PADRE_DATOS` | Con coordenadas de toda la aventura |
| Hijo → Padre | `NAVEGACION.GPS.ACTIVAR` | Al pulsar el botón GPS |
| Padre → Hijo | `NAVEGACION.GPS.ESTADO_GLOBAL` | Confirmando estado del GPS |
| Hijo → Padre | `NAVEGACION.GPS.UBICACION_ACTUALIZADA` | Cada 3 s con la posición actual |
| Padre → Hijo | `NAVEGACION.CAMBIO_PARADA` | Al cambiar de parada activa |
| Hijo → Padre | `NAVEGACION.CAMBIO_PARADA` | Cuando el GPS detecta que el usuario ha llegado a la siguiente parada |
| Padre → Hijo | `DATOS.RESPUESTA_COORDENADAS` | Datos detallados de una parada concreta |

Tiene atributo `allow="geolocation"` en el iframe para que el navegador permita pedir la posición GPS desde dentro.

#### Hijo 3 — audio-hijo3.html (el reproductor)

Reproductor HTML5 con barra de progreso personalizada. No sabe en qué parada está: solo recibe una URL y la reproduce.

| Dirección | Tipo de mensaje | Cuándo |
|-----------|----------------|--------|
| Hijo → Padre | `SISTEMA.HIJO_PREPARADO` | Al cargarse |
| Padre → Hijo | `SISTEMA.PADRE_DATOS` | Con la lista de URLs de audio de la aventura |
| Padre → Hijo | `AUDIO.REPRODUCIR_REQUEST` | Con la URL del MP3 de la parada actual |
| Hijo → Padre | `AUDIO.REPRODUCIR_RESPONSE` | Confirmando que el audio ha empezado |
| Hijo → Padre | `AUDIO.FIN_REPRODUCCION` | Cuando el audio termina (el padre puede avanzar automáticamente) |
| Hijo → Padre | `AUDIO.ESTADO_ACTUALIZADO` | Periódicamente con el tiempo de reproducción actual |
| Padre → Hijo | `SISTEMA.CAMBIO_MODO` | Para detener el audio al volver al modo CASA |

#### Hijo 4 — retos-hijo4.html (los retos)

Muestra el reto de cada parada y valida la respuesta del usuario. El padre decide cuándo mostrar el reto; el hijo ejecuta la interacción.

| Dirección | Tipo de mensaje | Cuándo |
|-----------|----------------|--------|
| Hijo → Padre | `SISTEMA.HIJO_PREPARADO` | Al cargarse |
| Padre → Hijo | `SISTEMA.PADRE_DATOS` | Con todos los retos de la aventura en el idioma activo |
| Padre → Hijo | `RETO.MOSTRAR` | Con el objeto reto de la parada actual |
| Hijo → Padre | `RETO.COMPLETADO` | Cuando el usuario responde correctamente |
| Padre → Hijo | `DATOS.RESPUESTA_RETO` | Confirmación del padre (desbloquea el avance) |
| Padre → Hijo | `SISTEMA.CAMBIO_MODO` | Para ocultar el reto al volver al modo CASA |

El flujo de validación de una respuesta ocurre en dos pasos: el hijo llama a `window.ejecutarValidacion(reto, respuestaUsuario)` (una función registrada por el padre a través del stub), que devuelve un booleano. Si es `true`, el hijo muestra el feedback de éxito y envía `RETO.COMPLETADO` al padre.

#### Hijo 5 — boton-casa-hijo5.html (la navegación y el botón de casa)

Iframe transparente de pantalla completa que muestra la lista scrollable de paradas en la parte superior y el botón GPS en la esquina. El fondo es transparente para que el mapa se vea a través.

| Dirección | Tipo de mensaje | Cuándo |
|-----------|----------------|--------|
| Hijo → Padre | `SISTEMA.HIJO_PREPARADO` | Al cargarse |
| Padre → Hijo | `SISTEMA.PADRE_DATOS` | Con la lista de paradas y sus nombres |
| Padre → Hijo | `NAVEGACION.RESPUESTA_DATOS_PARADAS` | Datos detallados de todas las paradas |
| Hijo → Padre | `NAVEGACION.CAMBIO_PARADA` | Al pulsar una parada en la lista |
| Hijo → Padre | `SISTEMA.CAMBIO_MODO` | Al pulsar el botón 🛰 OFF (volver a CASA) |
| Hijo → Padre | `VV:PARADAS:READY` | Cuando el contenedor de paradas está en el DOM |
| Hijo → Padre | `VV:PARADAS:SHOWN` | Cuando la lista de paradas pasa a ser visible |
| Padre → Hijo | (inyección CSS/JS) | El padre inyecta estilos directamente tras `PARADAS:READY` para mantener la transparencia del iframe |

#### Hijo 1-opciones — extrainfo-hijo1.html (el menú lateral)

Panel fijo en el lateral izquierdo con botones de configuración (cambiar idioma, info, opciones). A diferencia de los demás hijos, usa `window.parent.postMessage` directamente en lugar de esperar a `window.mensajeria`, porque necesita funcionar incluso durante las fases de carga más tempranas.

| Dirección | Tipo de mensaje | Cuándo |
|-----------|----------------|--------|
| Hijo → Padre | `SISTEMA.HIJO_PREPARADO` | Al cargarse |
| Padre → Hijo | `SISTEMA.CAMBIO_MODO` | Para habilitar/deshabilitar opciones según el modo |
| Hijo → Padre | `SELECCION.IDIOMA_SELECCIONADO` | Al cambiar idioma desde el menú |
| Hijo → Padre | `UI.NAVEGACION_EXTERNA` | Al abrir una página de información (gastronomía, consejos, etc.) |
| Hijo → Padre | `TEMPORIZADOR.TOGGLE` | Al pulsar el botón del temporizador |
| Padre → Hijo | `AVENTURA.INICIADA` | Al arrancar el modo aventura — incluye la aventura seleccionada |
| Padre → Hijo | `AVENTURA.FINALIZADA` | Al completar todas las paradas |
| Hijo → Padre | `AVENTURA.TIEMPO_ACTUALIZADO` | Cada segundo, con el tiempo restante formateado |
| Hijo → Padre | `AVENTURA.TIEMPO_AGOTADO` | Cuando el contador llega a 0 |

#### El temporizador de aventura

`extrainfo-hijo1.html` incluye un temporizador de cuenta atrás que se activa durante el modo aventura. Su funcionamiento es el siguiente:

**Cómo sabe el tiempo inicial:** cuando el padre arranca el modo aventura envía `AVENTURA.INICIADA` con la aventura seleccionada. El hijo lee el campo `tiempoEstimado` del módulo `js/indice-aventuras.js` para esa aventura (por ejemplo, `Aventura1` tiene `tiempoEstimado: 3600` segundos) e inicia la cuenta atrás con ese valor.

**Cómo se muestra:** al pulsar el botón del temporizador (⏱️) en el menú lateral, el hijo envía `TEMPORIZADOR.TOGGLE` al padre. El padre crea dinámicamente una ventana flotante (`ventana-temporizador-padre`) centrada en pantalla y la muestra u oculta en cada pulsación. La ventana muestra el tiempo en formato `HHH:MM:SS`.

**Estados de color del borde de la ventana:**

| Color | Condición | Significado |
| ----- | --------- | ----------- |
| Verde | >50% del tiempo restante | Tiempo suficiente |
| Amarillo | Entre 20% y 50% | Tiempo justo |
| Rojo parpadeante | <20% del tiempo restante | Tiempo crítico |

**En modo casa:** la ventana siempre muestra `000:00:00` en verde — el temporizador no corre fuera de una aventura activa.

**Cuando el tiempo se agota:** el hijo envía `AVENTURA.TIEMPO_AGOTADO` al padre. El padre puede reaccionar mostrando un aviso o finalizando la aventura (comportamiento pendiente de definir).

---

### 25.7 Referencias visuales en el mapa (tipo: "referencia")

#### Qué es una referencia visual

Una referencia visual es un monumento o punto de interés que **se menciona en el texto o audio de una parada** pero que el usuario **nunca visita físicamente**. Por ejemplo: "a tu derecha, al otro lado del puente, puedes ver la Iglesia de los Menas (número 7 en tu mapa del tesoro)".

El monumento aparece en el mapa del tesoro con su número para que el turista se oriente, pero no hay GPS, audio, reto ni parada asociados a él.

#### Tres tipos de elementos en el mapa

| Tipo | GPS | Audio | Reto | Marcador en mapa | `elementosIDpadre` |
|------|-----|-------|------|------------------|--------------------|
| `parada` / `inicio` | ✅ | ✅ | ✅ | 🎯 / 📌 | ✅ |
| `tramo` | ✅ (ruta) | ✅ | ❌ | línea azul | ✅ |
| **`referencia`** | ❌ | ❌ | ❌ | 🏛️ pill naranja | ❌ |

> **Regla crítica**: las referencias **nunca entran en `aventuras-ID-padre.js`**. El array `elementosIDpadre` define la secuencia de la aventura (lo que el usuario recorre). Una referencia es solo información visual; incluirla en `elementosIDpadre` rompería la secuencia del recorrido.

#### Cómo añadir una referencia en `coordenadas-aventuras.js`

```javascript
// Parada 6 - visitada por el usuario
{ tipo: "parada", id: "P-6", mapa_numero: 6,
  coordenadas: { lat: 39.4785, lng: -0.3762 }, ... },

// Referencia visual: el usuario la ve desde P-6 pero no la visita
{ tipo: "referencia", id: "REF-7", mapa_numero: 7,
  coordenadas: { lat: 39.4790, lng: -0.3758 },   // coordenadas reales del monumento
  nombre: "Iglesia de los Menas" },

// Tramo hacia la siguiente parada visitada
{ tipo: "tramo", id: "TR-6", mapa_numero: "6→8", ... }
```

Reglas de colocación:

- **Justo después** de la parada que la menciona en su texto.
- **Antes del tramo** que lleva a la siguiente parada.
- Puede haber varias referencias seguidas si se mencionan varios monumentos desde el mismo punto.

#### El marcador en el mapa

El marcador es una píldora blanca con borde dorado (`#8B6914`), el emoji 🏛️ a la izquierda y el número de `mapa_numero` a la derecha:

```
┌──────────────┐
│  🏛️  7      │  ← fondo blanco, borde dorado
└──────────────┘
```

- Escala dinámicamente con el zoom y el tamaño de pantalla (igual que el resto de marcadores).
- Al hacer clic muestra un overlay con la imagen del monumento, su nombre, número y botón ✕ para cerrarlo. También se cierra tocando fuera de la tarjeta.
- El `zIndexOffset` es 400, por debajo de las paradas visitadas (600) para que estas tengan prioridad visual.
- Los que tengan `coordenadas: null` se ignoran automáticamente; se pueden ir rellenando poco a poco sin romper nada.

#### Estructura completa de una referencia en `coordenadas-aventuras.js`

```javascript
{ tipo: "referencia", id: "REF-7", mapa_numero: 7,
  coordenadas: { lat: 39.4790, lng: -0.3758 },
  nombre: "Iglesia de los Menas",
  imagen: "imagenes/imagenes-aventuras/iglesia_menas.jpg" }
```

El campo `imagen` es opcional: si no se especifica, el popup muestra el emoji 🏛️ como placeholder.

#### Implementación técnica

- **`funciones-mapa.js`**: `dibujarReferencias(coordenadasBrutas)` filtra los elementos `tipo: "referencia"` del array de coordenadas, crea sus marcadores con `crearIconoReferencia()` y registra el click handler que llama a `mostrarPopupReferencia()`. Se invoca después de `dibujarRutaConMarcadores()`. Los marcadores se limpian en `limpiarRecursos()` y se reescalan en `reescalarMarcadoresEmoji()`.
- **`mapa-completo.html`**: muestra la polyline completa de la aventura y los mismos marcadores de referencia clicables (overlay con imagen). No muestra marcadores de paradas ni tiene lógica GPS. Recibe la aventura por parámetro URL (`?aventura=Aventura1`), abierto desde `coordenadas-hijo2.html`.
- **`indice-aventuras.js`**: cuenta automáticamente los `tipo: "referencia"` de `coordenadas-aventuras.js` para calcular `totalMonumentos`. No requiere actualización manual al añadir nuevas referencias.
- **`coordenadas-aventuras.js`**: única fuente de verdad de las referencias.
- **`aventuras-ID-padre.js`**: **no se modifica**. Las referencias son invisibles para el padre.
- **`textos-aventuras.js`, `audios-aventuras.js`, `retos-aventuras.js`**: **no se modifican**.

---

### 25.8 El diagrama completo de actores

```
┌─────────────────────────────────────────────────────────────────┐
│                      codigo-padre.html                           │
│                                                                   │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐    │
│  │  app.js     │   │ state-       │   │  funciones-mapa.js │    │
│  │ (orquestador│◄──│ manager.js   │   │  (Leaflet + GPS    │    │
│  │  de flujo)  │   │ (estado +    │   │   en el padre)     │    │
│  └──────┬──────┘   │  mutexes)    │   └────────────────────┘    │
│         │          └──────────────┘                              │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────────────┐    │
│  │                    mensajeria.js                          │    │
│  │  (bus postMessage: registro, envío, cola, TTL, ACK)      │    │
│  └──────┬───────────┬────────────┬────────────┬────────────┘    │
│         │           │            │            │                   │
│  ┌──────▼──┐  ┌─────▼──┐  ┌────▼───┐  ┌─────▼──┐  ┌────────┐  │
│  │  hijo   │  │  hijo  │  │  hijo  │  │  hijo  │  │ hijo   │  │
│  │    1    │  │    2   │  │    3   │  │    4   │  │  1-op  │  │
│  │seleccion│  │  mapa  │  │ audio  │  │ retos  │  │ menú   │  │
│  └─────────┘  └────────┘  └────────┘  └────────┘  └────────┘  │
│                                                                   │
│       hijo5 (lista de paradas + botón GPS) — iframe              │
│       transparente superpuesto sobre el mapa                      │
└─────────────────────────────────────────────────────────────────┘

Flujo de datos en modo AVENTURA activo:
 GPS (cada 3 s) → hijo2 → padre → [hijo2 mapa] [hijo3 audio] [hijo4 reto] [hijo5 lista]
 Respuesta reto → hijo4 → padre → siguiente parada → ciclo GPS
```
