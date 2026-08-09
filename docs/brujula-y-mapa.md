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
- **`#brujula-modo`** (`codigo-padre.html`): botón `◎`, siempre visible mientras la UI de aventura está en pantalla (mismo listado que `#btn-chat-soporte`, no aparece/desaparece según si el seguimiento está pausado). Su click llama a `reactivarSeguimientoCamara()` sin condiciones.

### 3.3 Tests automatizados existentes

`tests/e2e/17-flecha-brujula-continuidad.spec.js`:
- **FB-1**: la recreación del marcador (cada tick GPS) reutiliza el ángulo acumulado de la brújula, no salta al `heading` del GPS.
- **GA-1**: el ápice del triángulo se queda clavado en el punto GPS real al rotar en 0° y 180°, no orbita.
- **HD-1**: conversión alpha+beta+gamma (Android) compensando inclinación; `webkitCompassHeading` (iOS) pasa sin tocar.

**Importante:** las pruebas de esta sesión (§2) fueron manuales, con capturas de pantalla de un dispositivo real — **no** están automatizadas ni forman parte de esta suite. No confundir "verificado a mano una vez esta noche" con "cubierto por regresión automática".

---

## 4. Implementado — mapa orientado al rumbo ("Seguir mi rumbo")

Diseño acordado con el usuario e implementado: el mapa puede rotar para que el rumbo actual del usuario quede siempre "hacia arriba" en pantalla (mismo patrón que la navegación de coche en Google/Apple Maps), como alternativa al norte fijo de siempre. No sustituye al norte fijo — es un tercer modo elegible, junto a "Norte fijo" y "Centrar mapa en mi ubicación", desde el menú desplegable `#brujula-modo`. Documentación de referencia (autoridad, nivel de detalle completo): `docs/GUIA-COMPLETA.md` §4.6b.

### 4.1 Lo programado

Dos funciones exportadas nuevas en `js/funciones-mapa.js` (`activarSeguimientoRumbo()`/`desactivarSeguimientoRumbo()`) y una llamada añadida al final de `actualizarRotacionFlechaGPS()` — exactamente el punto previsto, reusando el ángulo ya suavizado (`_flechaGpsAnguloAcumulado`), sin recalcular nada:

```javascript
if (_camaraSiguiendoRumbo && _mapaInstance) {
    _mapaInstance.setBearing(_flechaGpsAnguloAcumulado);
}
```

`setBearing()` sin animación, no `easeTo()` — el suavizado exponencial que ya aplica esa función al ángulo acumulado, a ~10Hz, ya da fluidez; una segunda capa de easing encima produciría retraso/rebote, no más suavidad. La convención de signo prevista se confirmó sin sorpresas: `bearing = heading` tal cual, sin inversión — verificado en campo por RB-1 (§1a) antes incluso de este modo, ya que `_rumboEnPantalla()` (heading−bearing) es la pieza que hizo posible este modo sin más cambios.

### 4.2 Lo que salió gratis (confirmado en la implementación)

Tal como se previó: la polyline azul, los marcadores de parada/tramo y los nombres de las calles (con `symbol-placement` sobre la geometría real) se re-renderizan solos bajo rotación de cámara, sin ningún cambio adicional en `funciones-mapa.js` para conseguirlo.

### 4.3 Las 4 decisiones de diseño, resueltas

1. **¿El triángulo mantiene su propia rotación CSS, o se fija apuntando arriba?** Ninguna de las dos como caso especial — se mantiene exactamente el mismo cálculo de siempre, `_rumboEnPantalla(heading) = heading − bearing`. El efecto de "apuntar siempre hacia arriba" es una propiedad emergente: en cuanto `bearing` seguido por `setBearing()` coincide con el `heading` acumulado (el mismo valor, en el mismo tick), la resta da ~0° — la flecha queda fija visualmente sin necesidad de ningún código dedicado a ese caso.
2. **¿Un único flag centrado+rotación, o dos independientes?** Dos independientes: `_camaraSiguiendoUsuario` (posición, preexistente) y `_camaraSiguiendoRumbo` (rotación, nuevo). El gesto manual de girar el mapa con dos dedos (`'rotatestart'` con `originalEvent`, `_registrarSeguimientoRumbo()`) pausa solo la rotación — mismo mecanismo campo por campo que `'dragstart'`/`_registrarSeguimientoCamara()` ya usa para pausar solo el centrado. Activar cualquiera de los 3 modos del menú SÍ reactiva ambos flags a la vez (elegir un modo es, en sí mismo, un "vuelve a seguirme" explícito) — la independencia es solo para el *pausado* por gesto manual, no para la reactivación.
3. **¿El botón de recentrar retoma también la rotación?** No — se resolvió con un menú de 3 opciones en vez de un único botón (idea del propio usuario, para que las dos acciones no queden mezcladas de forma opaca): "Centrar mapa en mi ubicación" solo toca posición (`reactivarSeguimientoCamara()`, sin tocar `bearing` para nada — lo dice su propio comentario en el código); "Seguir mi rumbo" es la opción dedicada a la rotación. Se descartó explícitamente un diseño con gestos ocultos en el botón (p. ej. doble toque) por mala capacidad de descubrimiento: si el usuario no sabe que existen, "a veces el mapa gira y otras no" parecería aleatorio.
4. **¿Reusar el guard `!estadoMapa.zoomEnCurso`?** Deliberadamente NO aplicado. Ese guard existe para que el seguimiento de posición no compita con el `center`/`zoom` que ya está animando un `flyTo()` de cambio de parada/tramo — pero ningún `flyTo()` de la app toca nunca `bearing` (confirmado por grep: solo pasan `center`/`zoom`), así que `setBearing()` no tiene ninguna propiedad con la que competir durante ese guard. El mapa sigue girando en vivo incluso durante la animación de cambio de parada/tramo — consistente con que el propio triángulo CSS tampoco se pausa nunca por `zoomEnCurso`.

### 4.4 Pendiente, a cargo del usuario

Los 3 glifos de texto Unicode del menú (`N`, `➤`, `◎`) son marcadores de posición explícitos — el usuario diseñará los iconos definitivos en otra sesión. Sustituirlos no requiere tocar la lógica (es un cambio de `textContent`/`innerHTML` por botón, ver `_MODOS_BRUJULA` en `codigo-padre.html`).

### 4.5 Revisión posterior — dos cabos sueltos cerrados

Tras dar la implementación por completa, una revisión pedida explícitamente encontró y cerró dos casos de estado inconsistente que no habían salido en los tests iniciales (ninguno de los dos es un bug de campo reportado — son huecos de diseño encontrados por inspección directa del código):

1. **Brújula caída.** `activarSeguimientoRumbo()` no comprobaba si la brújula respondía de verdad — con el permiso denegado en iOS (o sin soporte de `DeviceOrientationEvent`), el modo se quedaba "encendido" (icono `➤`) sin que nada volviera a girar el mapa nunca, indistinguible de un cuelgue. Se decidió que revirtiera sola: `_elegirModoCamara('rumbo')` arma un `setTimeout` de 1.5s que comprueba el nuevo getter `funcionesMapa.brujulaEstaActiva()` y, si sigue sin responder, desactiva el modo y devuelve el icono a "Norte fijo".
2. **"Elegir otra aventura" sin recargar.** Descubierto que existen dos caminos distintos para "otra aventura": el del modal de fin de aventura normal SÍ recarga la página (todo el estado del módulo se resetea solo); el del diálogo de reanudación de sesión (`mostrarDialogoVueltaRapida` → `ejecutarElegirOtra()`) NO recarga — así que el modo de cámara de la aventura abandonada sobrevivía a la siguiente. Se decidió resetear también aquí: `globalThis._resetModoCamaraRecentrar()`, llamado junto al resto de globals que `ejecutarElegirOtra()` ya limpiaba.

Detalle completo, con referencias de línea, en `docs/GUIA-COMPLETA.md` §4.6b. Cubierto por `tests/e2e/25-brujula-modo.spec.js` BR-7/BR-8.

### 4.6 Auditoría completa + inversa — dos hallazgos más, cerrados

Una auditoría de 23 ejes sobre el proyecto completo (más una auditoría inversa, funciones sin mencionar en la guía) encontró dos hallazgos más en este mismo menú de cámara, ambos ⚠️ MEDIO — ningún bug de campo, huecos de borde encontrados por revisión directa:

1. **El timeout de reversión de brújula caída no distinguía activaciones.** El guard de §4.5.1 comparaba solo `_modoCamaraActivo === 'rumbo'` — un timeout de una elección VIEJA podía revertir una elección NUEVA si el usuario alternaba rumbo→norte→rumbo dos veces en menos de 1.5s. Fix: `_rumboActivacionId`, un contador que se incrementa en cada activación; el timeout compara también contra su propio valor capturado.
2. **El menú competía con el `flyTo` de cambio de parada/tramo.** `reactivarSeguimientoCamara()`/`activarSeguimientoRumbo()`/`desactivarSeguimientoRumbo()` movían la cámara sin comprobar `estadoMapa.zoomEnCurso`, a diferencia del seguimiento por-tick que sí lo hace. Fix: mismo guard, pero solo sobre `center` — `bearing` se sigue aplicando siempre, porque ningún `flyTo` de la app lo toca nunca y omitirlo en `desactivarSeguimientoRumbo()` lo habría dejado sin corrección posible (esa función ya apaga `_camaraSiguiendoRumbo`).

Detalle completo en `docs/GUIA-COMPLETA.md` §4.6b. Cubierto por `tests/e2e/25-brujula-modo.spec.js` BR-9; el guard de `zoomEnCurso` no tiene test aislado (mismo motivo que el guard equivalente preexistente, ver `tests/e2e/24-camara-sigue-usuario.spec.js`), verificado por revisión directa del código.

La misma auditoría encontró y cerró tres hallazgos más fuera del ámbito de la brújula (un `SISTEMA.ERROR` de audio sin consumidor en el padre, un handler `NAVEGACION.GPS.DESACTIVAR` huérfano, y dos exports muertos en `js/mensajeria.js`) — no son parte del modo de mapa orientado al rumbo, documentados en sus secciones correspondientes de `docs/GUIA-COMPLETA.md`.

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

**Actualización posterior:** esta posición (apilado en el borde derecho, encima del selector) se cambió de nuevo — ver §8.

---

## 8. Reposicionado en espejo — un botón a cada lado de la pantalla

El usuario pidió mover `#btn-recentrar` del borde derecho (apilado sobre `#selector-tipo-mapa`, §7) al borde **izquierdo**, a la **misma altura** que el selector — mismo `bottom`, y el mismo margen desde el borde izquierdo que el selector tiene desde el derecho (espejado, misma fórmula con `left` en vez de `right`). Resultado: los dos botones quedan alineados horizontalmente, uno en cada extremo de la pantalla, en vez de uno encima del otro en el mismo lado.

Verificado con Playwright (medición real de `getBoundingClientRect()`, no solo lectura de CSS): `bottom` de ambos botones idéntico (494px desde el borde inferior del viewport en un iPhone 12 simulado), margen izquierdo de `#btn-recentrar` idéntico al margen derecho de `#selector-tipo-mapa` (15.875px), y sin solape con `extrainfo-hijo1.html` (columna izquierda) — el borde inferior del botón queda ~7px por encima del borde superior de hijo1, mismo margen que ya tenía el botón original con hijo2 en el lado derecho.

Documentado en GUIA-COMPLETA §4.6b (reemplaza la descripción de posición de §7 de este documento, que queda como registro histórico de la decisión anterior). Test actualizado: `tests/e2e/25-brujula-modo.spec.js` BR-2.

---

## 9. Renombrado — `#btn-recentrar` pasa a ser `#brujula-modo`

El usuario confirmó la propuesta de nombres apuntada al final de §8: el contenedor pasa de `#btn-recentrar` a **`#brujula-modo`**, y las tres opciones del menú pasan a identificarse en código como **`brujula-modo-norte`**, **`brujula-modo-seguimiento`** y **`brujula-modo-centrado`** — nombres más neutros que `brujula-norte`/`brujula-centrado`, para que alguien sin contexto de la app que toque el código entienda por el propio id que son las tres opciones del menú "modo" de la brújula, no que cada una usa el sensor de la brújula por separado.

Cambiados: el id del contenedor, las variables/funciones internas del bloque en `codigo-padre.html` (`_MODOS_BRUJULA`, `_brujulaModoActivo`, `_brujulaModoDropdownAbierto`, `_brujulaModoSeguimientoActivacionId`, `_actualizarBrujulaModoBtnPrincipal()`, `_elegirBrujulaModo()`, `globalThis._resetBrujulaModo`), los tres valores de id de modo, los comentarios de `js/funciones-mapa.js` que apuntaban a `#btn-recentrar`, y las referencias en la suite de tests (`tests/e2e/25-boton-recentrar.spec.js` renombrado a `tests/e2e/25-brujula-modo.spec.js`, más los ajustes correspondientes en `16-loading-overlay-oculta-ui.spec.js` y `27-seguimiento-rumbo.spec.js`). Los tres nombres visibles para el usuario final ("Norte fijo", "Seguir mi rumbo", "Centrar mapa en mi ubicación") no cambian — el rename es solo de identificadores de código.

Fuera de alcance, sin tocar: las funciones de comportamiento en `js/funciones-mapa.js` (`activarSeguimientoRumbo()`, `desactivarSeguimientoRumbo()`, `reactivarSeguimientoCamara()`, `brujulaEstaActiva()`, `_camaraSiguiendoRumbo`, `_camaraSiguiendoUsuario`) — son la lógica que el menú llama, no el menú en sí.

Documentado en detalle en `docs/GUIA-COMPLETA.md` §4.6b.

---

## 10. Unificación visual con `#selector-tipo-mapa` y fix de visibilidad sobre overlays

Tres ajustes pedidos por el usuario tras usar el menú, sin relación con la brújula en sí:

1. **Tamaño/forma/borde unificados con `#selector-tipo-mapa`.** Antes `#brujula-modo` era circular sin borde y `#selector-tipo-mapa` cuadrado (`border-radius:4px`) con borde naranja `#FF8C00` — inconsistente con el resto de botones flotantes de la app (chat, badges del mapa), que son circulares con ese mismo borde. Los dos pasan a compartir exactamente el mismo estilo (circular, borde naranja). El tamaño subió en dos pasos, tras ver el primero en el navegador y pedir un poco más: `clamp(36px,9.8vmin,52px)` → `clamp(40px,11vmin,58px)` → `clamp(46px,12.6vmin,67px)` (principal), `clamp(29px,8.4vmin,43px)` → `clamp(32px,9.2vmin,47px)` → `clamp(37px,10.6vmin,54px)` (opciones del desplegable). Verificado con Playwright en cada paso, en un viewport de móvil real (390×844): con el tamaño final, el desplegable ya expandido deja un margen de ~67px hasta el borde inferior de `#fondo-blanco` — lejos de solaparlo.
2. **`#brujula-modo` se quedaba visible por delante del chat.** Ambos contenedores tienen z-index por encima de `#hijo6-chat` (1000020) — pero lo que de verdad oculta al selector cuando se abre un overlay no es el z-index, es que `actualizarVisibilidadSelectorMapa()` le fuerza `display:none` explícitamente. Esa función nunca se enteró de que `#brujula-modo` existe. Fix: la misma función ahora oculta y muestra los dos contenedores bajo el mismo criterio (chat, hijo4, backdrop, overlays de imagen/vídeo/error/iframe).
3. **Fórmulas de posición que dependían del tamaño del botón.** El `left:`/`right:` de ambos contenedores (espejados entre sí) restan la mitad del ancho del botón principal para centrarlo sobre el botón de chat — ese `clamp(...)` está hardcodeado en la fórmula, así que subir el tamaño del botón sin actualizar también la fórmula habría desalineado ambos botones respecto al chat. Actualizado en los dos sitios.

Documentado en `docs/GUIA-COMPLETA.md` §4.6b y §11 ("Capas de mapa y selector de estilo").
