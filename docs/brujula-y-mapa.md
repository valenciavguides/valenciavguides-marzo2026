# Brújula y mapa — diagnóstico, resolución y diseño pendiente

> Documento de trabajo. La sección 1 narra la investigación tal como ocurrió, incluida una hipótesis descartada por error que luego resultó ser la causa real (§1a) — se deja así, sin reescribir la historia, porque el propio recorrido es útil para la siguiente sesión. El bug de rotación del mapa (§1a) y el radio de activación (§2 de la sesión de arreglo) **ya están corregidos e implementados** — ver §1a y §6. Lo único que sigue pendiente de diseñar es el modo de mapa orientado al rumbo (§4).

---

## 1a. Actualización — el bug SÍ era la rotación del mapa (hipótesis 1, más abajo, se reabrió y se confirmó)

La hipótesis 1 de más abajo se dio por descartada esa misma noche con una prueba insuficiente (el usuario probó "con el mapa girado y sin girar" sin un punto de referencia externo fijo para comparar). En una sesión posterior, el usuario reprodujo el fallo de forma concluyente: parado quieto en un punto fijo, giró el mapa a mano hasta poner un monumento real "de frente" en pantalla (bearing del mapa ≈ su propio rumbo real en ese momento) — el triángulo, en vez de apuntar hacia arriba (coincidiendo con hacia dónde giró el mapa), apuntaba literalmente al revés.

**Causa confirmada por lectura de código (dos veces, releído desde cero ambas veces):** `actualizarRotacionFlechaGPS()` y la creación inicial del marcador (`js/funciones-mapa.js`) pintan el rumbo real con `rotate(Xdeg)` en CSS sin restar nunca el `bearing` actual del mapa. `rotate()` es siempre relativo a la pantalla, nunca al norte — con el mapa en su orientación por defecto (bearing 0, la única situación que se había probado con la página de diagnóstico de §2, que no toca el mapa en absoluto) el fallo es invisible. En cuanto el bearing del mapa deja de ser 0 (el gesto de girar con dos dedos nunca ha estado bloqueado), la pantalla queda desfasada exactamente ese ángulo.

**Fix implementado:** nueva función `_rumboEnPantalla(heading)` en `js/funciones-mapa.js`, que resta `_mapaInstance.getBearing()` al rumbo justo antes de escribirlo — aplicada en los dos sitios donde se pinta `rotate()` (`actualizarRotacionFlechaGPS()` y la creación del marcador). El ángulo acumulado de la brújula (`_flechaGpsAnguloAcumulado`) sigue representando el rumbo real sin tocar; la resta ocurre solo en el último paso, al pintar. Documentado en detalle, con la derivación completa, en `docs/GUIA-COMPLETA.md` §4.5 (justo después de la explicación de `actualizarOrientacionFlecha()`). Test nuevo: `RB-1` en `tests/e2e/17-flecha-brujula-continuidad.spec.js`, que simula un mapa con bearing≠0 y verifica que el mismo rumbo real se pinta distinto según el bearing.

Esto **no** sustituye al diseño pendiente de §4 (mapa orientado al rumbo, que rota el mapa automáticamente seguir hacia donde camina el usuario) — son dos cosas relacionadas pero distintas: este fix hace que el triángulo sea correcto **siempre**, gire el usuario el mapa a mano o no; §4 es una funcionalidad nueva sobre cuándo y por qué rotarlo automáticamente.

---

## 1. El síntoma original y el recorrido de hipótesis

El usuario reportó, en varias ocasiones a lo largo del proyecto (ver commits `9c97ae0`, `8c838f7`, `c06c8c6`, `8226115` — todos tocan la flecha/brújula GPS), que el triángulo isósceles que marca hacia dónde mira el usuario "no apunta bien". La sesión de esta noche investigó esto a fondo con datos reales de campo, no solo lectura de código.

**Hipótesis descartadas, en orden, con la razón exacta:**

1. **Rotación del mapa no compensada.** El mapa nunca gira programáticamente (`bearing:0` fijo en `codigo-padre.html` ~L3143, cero llamadas a `getBearing()`/`setBearing()` en todo el proyecto), pero el usuario SÍ puede rotarlo a mano (gesto de dos dedos — `pitchWithRotate:false`/`maxPitch:0` solo bloquean la inclinación 3D, no el giro plano). Descartada como causa del error de rumbo porque el usuario confirmó reproducir el fallo tanto con el mapa girado como sin girar — el resultado no cambiaba.
2. **Espejo/reflejo de signo en la fórmula, sobre el eje norte-sur.** Teoría inicial, buen ajuste matemático con la descripción "funciona en norte/sur, falla en el resto" — descartada tras comparar término a término la fórmula de `actualizarOrientacionFlecha()` contra la matriz de rotación real y publicada de Full-Tilt (`github.com/adtile/Full-Tilt`, `dist/fulltilt.js` — verificado por fetch directo del código fuente). Los términos `vxTrasera`/`vyTrasera`/`vxSuperior`/`vySuperior` coinciden exactamente, signo por signo, con la proyección correcta de los ejes -Z y +Y del dispositivo sobre el plano horizontal. No hay error de signo en esta parte del cálculo.
3. **Falta un paso final `heading = 360 - heading`** (citado de un artículo externo sobre compensación de inclinación en Android, `xjavascript.com`). Considerada y descartada: esa fórmula externa es una proyección más simple (ignora la inclinación real, solo la compensa de forma aproximada) — nuestra fórmula construye la matriz de rotación completa y ya obtiene el ángulo correcto sin ese paso adicional. Aplicarlo aquí habría introducido el mismo error de espejo que la hipótesis 2, no lo habría corregido.
4. **Inestabilidad en el cruce entre las dos fórmulas del vector (`trasera` vs `superior`), en torno a beta=45°.** Hipótesis seria: el usuario sujeta el móvil de forma natural entre 30-70° de inclinación, un rango que cruza justo el punto donde el código cambia de fórmula según cuál de las dos tenga más señal horizontal. Las pruebas de campo de esta noche (ver §2) no confirmaron un error grande en este cruce — con datos reales, ambas fórmulas dieron resultados casi idénticos y correctos en las pruebas de norte y este. Rebajada de "causa probable" a "vigilar, no urgente".
5. **Rumbo GPS obsoleto (`coords.heading`) en vez de la brújula en vivo.** Sigue **sin descartar** — ver §2.4, es el hueco real que quedó sin probar esta noche.

**Conclusión de fondo (confirmada por el propio usuario, §2.5):** el cálculo de rumbo (hacia dónde apunta el cuerpo/móvil respecto al norte real) está bien. Lo que el usuario interpretaba como "el triángulo no apunta bien" era en realidad la diferencia esperable entre **rumbo absoluto** (lo que mide y muestra el triángulo) y **dirección relativa hacia un punto de interés** (lo que el usuario esperaba ver) — dos conceptos que solo coinciden caminando en línea recta directamente hacia ese punto. Ver §4 para el diseño que resuelve esto de verdad (mapa orientado al rumbo), que no es una corrección de la fórmula sino una funcionalidad nueva.

---

## 2. Pruebas de campo de esta noche — datos reales

Todas las pruebas se hicieron con la página de diagnóstico `debug-brujula.html` (ver §5), Android + Chrome, evento `deviceorientationabsolute` confirmado activo (`absolute: true` en todas las lecturas).

### 2.1 Prueba norte (sin referencia externa contrastada, a ojo)

| beta | vector usado | rumbo calculado | rumbo real | error |
|---|---|---|---|---|
| 36.0° | superior (+Y) | 17.1° | ~0° (norte) | ~17° |
| 72.8° | trasera (-Z) | 14.9° | ~0° (norte) | ~15° |

Error pequeño y consistente en ambas fórmulas, mismo sentido (levemente hacia el este). Compatible con declinación magnética de Valencia + imprecisión de "norte a ojo" sin referencia. No se considera un fallo.

### 2.2 Prueba este (contrastada con Google Maps, misma postura corporal, solo se varió la inclinación del móvil)

| beta | vector usado | rumbo calculado | rumbo real | error |
|---|---|---|---|---|
| 83.1° | trasera (-Z) | 90.7° | 90° (este) | 0.7° |
| 31.0° | superior (+Y) | 91.9° | 90° (este) | 1.9° |

Prácticamente exacto en las dos fórmulas, con inclinaciones muy distintas (31° vs 83°, cruzando el punto de cambio de fórmula en 45°). **Esta es la prueba que descarta con más fuerza un error de cálculo.**

### 2.3 No se reprodujo el fallo original

El reporte original (edificio al este, triángulo señalando sur — error de ~90°) no se consiguió reproducir con la página de diagnóstico. Motivo probable: ver §2.4.

### 2.4 Hueco real de esta sesión — sin probar todavía

`debug-brujula.html` usa **siempre** la brújula en vivo, directamente (por diseño — es lo que quería medir). Pero la app real (`js/funciones-mapa.js` ~L3470) no hace eso siempre:

```javascript
const rotation = (compassActiva && _flechaGpsAnguloAcumulado !== null) ? _flechaGpsAnguloAcumulado : (heading || 0);
```

Si `compassActiva` es falso, o la brújula todavía no ha entregado ninguna lectura (`_flechaGpsAnguloAcumulado === null`), la app cae a `heading` = `coords.heading` del GPS — la dirección de desplazamiento calculada por posiciones consecutivas, que **no tiene sentido si el usuario está parado** (se queda con el último rumbo de la caminata). Esta rama de reserva es la única parte de la lógica que la página de diagnóstico no ejercita en absoluto, porque no toca geolocalización.

**Pendiente de probar mañana en campo, con la app real** (no con la página de diagnóstico): caminar un tramo recto, parar, girar el cuerpo sin dar ni un paso más, y comprobar si el triángulo sigue en vivo o se queda congelado con el rumbo de la caminata anterior. También vigilar si el número sale raro específicamente cerca de fachadas de piedra/metal (interferencia magnética local), pero bien en zonas abiertas.

### 2.5 Conclusión del usuario, confirmada

> "la dirección a la que miro está bien con respecto norte sur este oeste pero al ir moviéndome por las calles y el mapa estar orientado al norte, hasta que no lo giro yo no apunta al monumento"

Confirmado como correcto: el triángulo mide rumbo absoluto, no dirección relativa a un punto de interés fijo en el mapa. Girar el mapa a mano hasta que "coincida con la flecha" no es una prueba de precisión (alinea el mapa a lo que sea que el triángulo muestre, acierte o no) — la prueba real fue la comparación contra Google Maps de §2.2.

---

## 3. Estado actual del código — qué existe, dónde, cómo

### 3.1 Cálculo de rumbo — `js/funciones-mapa.js`

- **`actualizarOrientacionFlecha(event)`** (L1636-1668): recibe el evento de orientación del dispositivo, calcula `heading` en grados (0=norte, 90=este, sentido horario). Tres ramas:
  - `event.webkitCompassHeading` (iOS): se usa tal cual, ya viene compensado por el propio SO.
  - `event.alpha/beta/gamma` disponibles: fórmula general verificada (matriz de rotación intrínseca Z-X'-Y'', dos vectores candidatos — `trasera` fiable con móvil vertical, `superior` fiable con móvil plano —, se usa el que tenga mayor magnitud horizontal en cada lectura).
  - Solo `alpha` disponible (navegador antiguo sin beta/gamma): fórmula plana `(360 - alpha) % 360`, fallback, no la fórmula principal.
- **`actualizarRotacionFlechaGPS(heading)`** (L1691-1710): aplica el CSS `rotate()` al marcador, con suavizado exponencial (25% del salto detectado por lectura), ángulo acumulado sin acotar a 0-360 (para que el giro CSS siempre tome el camino corto), y throttle a ~10Hz.
- **`activarBrujula()`/`desactivarBrujula()`** (L1725-1752): piden permiso (iOS 13+) y registran/desregistran el listener. Prefieren `deviceorientationabsolute` sobre `deviceorientation` cuando el navegador lo soporta (`'ondeviceorientationabsolute' in globalThis`).
- Triángulo HTML/CSS (dentro de la función de creación del marcador, ~L3440-3500): técnica de bordes CSS (`border-bottom` + `border-left/right transparent`), apex fijado con `translate(-50%, 0%)` sobre el contenedor `.gps-arrow-heading` para que el vértice quede clavado en el punto GPS real al rotar (no orbita — verificado por test `GA-1`).

### 3.2 Mapa — `codigo-padre.html` / `js/funciones-mapa.js`

- MapLibre GL, `bearing:0` fijo al inicializar (`codigo-padre.html` ~L3143). Nunca cambia programáticamente.
- Gesto de rotación manual (dos dedos) **no está bloqueado** — el usuario puede girar el mapa a mano, pero nada en la app reacciona a ello ni lo usa para nada.
- **Seguimiento de posición** (implementado, documentado en GUIA-COMPLETA §4.6b): `_camaraSiguiendoUsuario` (L175, módulo, `true` por defecto), `_registrarSeguimientoCamara()` (L878, escucha `dragstart` y pausa el seguimiento solo si `e.originalEvent` existe — gesto real del usuario, no `easeTo`/`flyTo` programático), `reactivarSeguimientoCamara()` (L892, exportada, expuesta en `globalThis.funcionesMapa`). Centra la cámara (`easeTo({center, duration:800})`) en cada posición GPS real, si `_camaraSiguiendoUsuario && !estadoMapa.zoomEnCurso`.
- **Esto solo centra, nunca rota.** No hay ningún código que conecte el rumbo de la brújula con la rotación del mapa.
- **`#btn-recentrar`** (`codigo-padre.html`): botón `◎`, siempre visible mientras la UI de aventura está en pantalla (mismo listado que `#btn-chat-soporte`, no aparece/desaparece según si el seguimiento está pausado). Su click llama a `reactivarSeguimientoCamara()` sin condiciones.

### 3.3 Tests automatizados existentes

`tests/e2e/17-flecha-brujula-continuidad.spec.js`:
- **FB-1**: la recreación del marcador (cada tick GPS) reutiliza el ángulo acumulado de la brújula, no salta al `heading` del GPS.
- **GA-1**: el ápice del triángulo se queda clavado en el punto GPS real al rotar en 0° y 180°, no orbita.
- **HD-1**: conversión alpha+beta+gamma (Android) compensando inclinación; `webkitCompassHeading` (iOS) pasa sin tocar.

**Importante:** las pruebas de esta sesión (§2) fueron manuales, con capturas de pantalla de un dispositivo real — **no** están automatizadas ni forman parte de esta suite. No confundir "verificado a mano una vez esta noche" con "cubierto por regresión automática".

---

## 4. Diseño pendiente — mapa orientado al rumbo (no implementado)

Acordado con el usuario: opción elegida es que el mapa rote para que el rumbo actual del usuario quede siempre "hacia arriba" en pantalla (mismo patrón que la navegación de coche en Google/Apple Maps), en vez del norte fijo actual. Se diseñará y construirá en otra sesión — esto queda anotado para no perder el contexto.

### 4.1 Qué hace falta programar de verdad

Una sola pieza nueva: que la rotación de la cámara del mapa siga el mismo rumbo ya calculado y verificado en `actualizarOrientacionFlecha()`/`actualizarRotacionFlechaGPS()` — probablemente una llamada adicional a `_mapaInstance.easeTo({bearing: heading, ...})` (o `.setBearing()`) en el mismo punto donde ya se actualiza el triángulo, reusando el ángulo ya suavizado (`_flechaGpsAnguloAcumulado`), no recalculando nada.

**Convención de signo:** `bearing` en MapLibre se define como "la dirección de compás que aparece en la parte de arriba del viewport" — coincide directamente con nuestro `heading` (0=norte arriba, 90=este arriba, sentido horario). En principio `bearing = heading` sin ninguna inversión adicional, dado que ya verificamos que `heading` en sí es correcto (§2.2). Confirmar esto con una prueba real antes de darlo por sentado.

### 4.2 Lo que sale gratis (confirmado, no hace falta programarlo)

MapLibre recalcula automáticamente la posición en pantalla de toda capa (líneas, marcadores, iconos, raster) bajo cualquier transformación de cámara, incluida la rotación — es el motivo de usar un motor de mapa real en vez de una imagen estática. Con la rotación de cámara activada:

- **La polyline azul** (capa GL de línea) se re-renderiza correctamente sola.
- **Los marcadores de parada/tramo** (`maplibregl.Marker`, posicionados por lng/lat) recalculan su posición en pantalla solos.
- **Los nombres de las calles** (capas symbol con `symbol-placement` sobre la geometría de la calle) ya siguen el trazado real de la calle, no un ángulo fijo en pantalla — al rotar el mapa, giran con él, permaneciendo alineados a su calle. Esto es explícitamente lo que pidió el usuario ("los nombres de las calles pueden quedarse tal cual están ahora porque si no se salen de la calle") — ya es el comportamiento por defecto, no requiere cambio.

### 4.3 Decisiones de diseño abiertas (hablar antes de programar)

1. **¿El triángulo mantiene su propia rotación CSS independiente, o se fija apuntando siempre hacia arriba** una vez que es el mapa el que gira para seguir el rumbo? Mantener ambas rotaciones sería redundante (girarían siempre a la par); fijar el triángulo simplificaría el código pero pierde la señal visual de "el rumbo se está actualizando en vivo" si el mapa tarda en reaccionar.
2. **¿El gesto manual de girar el mapa con dos dedos debe pausar el seguimiento de rumbo**, igual que arrastrar ya pausa el centrado (`_camaraSiguiendoUsuario`)? ¿Un único flag para centrado+rotación, o dos independientes (se podría querer centrado sin rotación, o viceversa)?
3. **¿El botón `#btn-recentrar` retoma también la rotación**, o solo el centrado como ahora? (Probablemente sí, mismo botón, mismo gesto mental para el usuario — pero confirmarlo explícitamente.)
4. Reusar el guard existente `!estadoMapa.zoomEnCurso` para no rotar durante una animación de zoom en curso.

### 4.4 No es una corrección de bug

Importante para la próxima sesión: esto **no** es un fix de la fórmula de brújula (que ya está verificada, §2). Es una funcionalidad nueva — un modo de mapa distinto. Tratarlo con el mismo proceso de diseño que la cámara-sigue-al-usuario y los carteles (documentar el diseño acordado, confirmar antes de implementar, documentar en GUIA-COMPLETA al terminar).

---

## 5. Herramientas creadas esta noche

- **`debug-brujula.html`** (raíz del proyecto) — página de diagnóstico standalone, **no forma parte de la app real**, no se referencia desde ningún fichero de la aplicación, no se carga nunca en producción. Reproduce exactamente la fórmula de `actualizarOrientacionFlecha()` de `js/funciones-mapa.js` (copia literal, no una reimplementación aparte) para que cualquier prueba futura compare contra la misma lógica real. Muestra en vivo: evento activo (`deviceorientationabsolute`/`deviceorientation`), `absolute`, alpha/beta/gamma crudos, `webkitCompassHeading`, qué vector se usó (`trasera`/`superior`) y el rumbo calculado, más un triángulo idéntico al de la app girando con esos datos. Útil para verificar cualquier cambio futuro a la fórmula de brújula sin necesidad de desplegar la app entera ni caminar hasta ningún sitio.
- Servida con el servidor local existente (`node js/server.js`, puerto 8080) — sin cambios en `js/server.js`.

**Decisión pendiente:** ¿se borra `debug-brujula.html` cuando ya no haga falta, o se conserva como herramienta de desarrollo? No se ha decidido — no borrar sin confirmar primero.

---

## 6. Limpieza pendiente — revertir los permisos de Firewall/PowerShell

Se hicieron dos cambios al Firewall de Windows esta noche para que el móvil pudiera alcanzar el servidor local por WiFi. **Los dos deben revertirse** cuando ya no haga falta usar `debug-brujula.html` desde el móvil (por ejemplo, después de la prueba de campo de mañana, por si se quiere repetir algo desde el móvil antes de eso):

1. **Borrar la regla nueva creada** (no solo desactivarla, no tiene ningún otro uso):
   ```powershell
   Remove-NetFirewallRule -DisplayName "VV-temporal-debug-brujula-8080"
   ```
2. **Reactivar las dos reglas de bloqueo de Node.js que se desactivaron** (estado original del sistema):
   ```powershell
   Get-NetFirewallRule -DisplayName "Node.js JavaScript Runtime" | Enable-NetFirewallRule
   ```

Ambos comandos requieren PowerShell como administrador (clic derecho sobre el icono → "Ejecutar como administrador"), igual que los comandos usados para crearlas/desactivarlas.

También conviene deshacer el ajuste de `chrome://flags/#unsafely-treat-insecure-origin-as-secure` en el móvil (volver el desplegable a "Default" y relanzar Chrome) una vez terminadas las pruebas — no es un riesgo grave dejarlo, pero no tiene sentido mantenerlo activo indefinidamente para una única IP de desarrollo.

---

## 7. Otros dos ajustes de la misma sesión de arreglo (no relacionados con la brújula, pero surgieron de las mismas capturas de campo)

**Radio de activación de parada: 20m → 10m.** El usuario reportó, aparte del bug de la flecha, que en aventuras con dos paradas del mismo monumento muy próximas (parada-tramo-parada con poca distancia real entre ellas), el radio de 20m bastaba para que, al completar la primera parada, el usuario ya estuviera también dentro del radio de la segunda — el tramo intermedio se daba por completado sin caminarlo de verdad. Bajado a 10m como primer ajuste (no descartado subir/bajar más tras probarlo en campo). Cuatro sitios cambiados, todos el mismo valor: `RADIO_PARADA` y `rangoMaximo` (×2, dos funciones) en `coordenadas-hijo2.html`, y el círculo naranja visual (`circuloActivacion`) en `js/funciones-mapa.js`. Documentado en detalle, con la razón completa, en GUIA-COMPLETA §25.5 ("Por qué 10 m y no 20 m").

**Si en el terreno el tramo corto sigue completándose demasiado rápido incluso con el radio de parada ya en 10m, este cambio probablemente NO es la causa — hay que mirar en otro sitio, ya identificado:**

`RADIO_PARADA`/`rangoMaximo` (lo que se tocó) solo controla la llegada a **paradas**. La llegada a un **tramo** (su `.fin`) nunca ha usado ese valor — usa `calcularToleranciaGPS()` (`js/funciones-mapa.js`, línea ~98):

```javascript
const tolerancia = Math.max(50, Math.ceil(distanciaMaxima + 20));
```

Para un tramo corto (parada-tramo-parada con poca distancia real, exactamente el caso que preocupa), `distanciaMaxima` entre waypoints es pequeña, así que el `+20` no basta para superar el **suelo de 50m** — el tramo se considera "llegado" en cuanto el usuario está a ≤50m de su `.fin`, que en un tramo corto puede ser prácticamente donde ya está parado nada más empezar a caminarlo. Ese suelo de 50m es, con mucha probabilidad, el verdadero responsable de que un tramo corto se complete casi al instante — independiente de todo lo tocado hoy. El propio comentario del código (línea 93-97) explica por qué existe el suelo (evitar que el ruido normal de GPS en calle estrecha, no solo un desvío real, dispare una "llegada" falsa en un tramo con waypoints muy juntos) — bajarlo sin más volvería a abrir ese problema distinto. Si hace falta tocarlo, pensar en una solución que no sea solo "bajar el número 50" a secas — ver el comentario del código para el porqué exacto antes de decidir.

**No tocado hoy** (fuera del alcance explícito, "solo el halo naranja"): la lógica de visibilidad del trazado (§4.7d de GUIA-COMPLETA, sus propios `≤20m` internos en `funciones-mapa.js` siguen en 20, mecanismo distinto tanto del radio de llegada de parada como de la tolerancia de tramo).

**Botón de recentrar movido y agrandado.** El botón original (junto al logo, `clamp(20px,5.2vw,28px)`) resultaba demasiado pequeño y difícil de ver. Movido al borde derecho, mismo tamaño y `right` que el botón principal del selector de tipo de mapa (`clamp(36px,9.8vmin,52px)`), justo encima con el mismo hueco de 8px que ya separa al selector del botón de chat, z-index justo por debajo del selector (para que su desplegable, en los momentos puntuales en que se abre, lo tape sin problema). Documentado en GUIA-COMPLETA §4.6b.
