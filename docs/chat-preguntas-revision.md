# Revisión: Preguntas del Asistente (chat-hijo6)

Documento para revisar y editar las preguntas del asistente de soporte (`chat-hijo6.html`). Copia, pega y edita las entradas que quieras mantener o descartar.

**Tokens dinámicos disponibles en respuestas:**
- `{{PARADA_ACTUAL}}`
- `{{PARADA_SIGUIENTE}}`
- `{{PARADAS_RESTANTES}}`
- `{{IDIOMA_ACTIVO}}`
- `{{AVENTURA}}`

---

### Conectividad / Internet
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `SUG_INTERNET_PORQUE` | ¿Por qué necesito conexión a Internet durante la aventura? | (vacío) | SUGERIDA | |internet es necesario para que funcionen los audios, videos, imagenes, ect. Para evitar una sobrecarga de descargas en su teléfono usamos nuestra base de datos para que usted descargue lo mínimo posible y de esta manera contribuimos al reciclaje digital 
| `SUG_INTERNET_PORQUE` | ¿Por qué necesito conexión a Internet durante la aventura? | La aplicación carga datos dinámicos (textos, audios, índices) y recursos multimedia desde los módulos/servidor al iniciar la aventura; además algunos componentes se cargan "lazy" (p. ej. `hijo6` chat). Por eso requiere conexión para descargar esos recursos y reproducir audios/vídeos. | SUGERIDA | |
| `SUG_INTERNET_CAES` | ¿Qué pasa si pierdo la conexión en mitad de la aventura? | El audio/imagen de la parada donde ya estás sigue funcionando si ya se cargó (el Service Worker los guarda en caché). Lo que no funciona: cargar contenido nuevo no visitado todavía. El aviso de "sin conexión" en pantalla no siempre aparece al instante — solo se muestra cuando algo intenta cargar y falla por falta de red, no en el momento exacto en que se pierde la señal. | SUGERIDA | Su aventura se pausará hasta que tenga internet de nuvo, internet es esencial para el correcto funcionamiento de la aplicación |


## Instrucciones
- Marca con ✅ las preguntas que quieras mantener.
- Marca con ❌ las preguntas que quieras descartar.
- Para preguntas vacías, escribe la redacción que te gustaría (columna "Texto sugerido").

---

## Temas e intenciones

### GPS y Ubicación
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `GPS_NO_DETECTA` | (sin texto) | (vacío) | PENDIENTE | |
| `GPS_NO_DETECTA` | ¿Por qué no se detecta mi ubicación? | La app reintenta sola hasta 3 veces si pierde la señal (con precisión cada vez más relajada, para adaptarse a interiores o zonas con poca cobertura). Si los 3 reintentos fallan, aparece un aviso en pantalla con un botón para reintentar manualmente en cuanto recuperes señal — mientras tanto, puedes seguir escuchando el audio y resolviendo el reto de la parada donde ya estás, eso no depende del GPS. | PENDIENTE | |
| `GPS_FUERA_RANGO` | ¿Qué significa "fuera de rango" en una parada? | Significa que estás más lejos de la parada o tramo que te toca de lo necesario para completarlo. La app escala el aviso según la distancia: entre 21 y 50 metros aparece una imagen con una cuenta atrás de 5 minutos (por si llegas por tu cuenta); más allá de 50 metros y hasta 2 km aparece otra imagen y el botón de ubicación se habilita al instante; más de 2 km comparte el aviso de señal GPS débil. En cualquier caso, pulsando el botón de ubicación puedes pedir que se dibuje en el mapa el camino hasta tu destino. | PENDIENTE | |
| `GPS_PERMISO_DENEGADO` | ¿Qué hago si denegué el permiso de ubicación? | Debes habilitar permiso de ubicación en los ajustes del navegador o del sistema; sin permiso la función AVENTURA no puede seguir la posición y varias funcionalidades quedan deshabilitadas. | PENDIENTE | |
| `SUG_GPS_PORQUE` | ¿Por qué necesita la app el GPS siempre? | (vacío) | SUGERIDA | |
| `SUG_GPS_INESTABLE` | ¿Qué hago si la señal GPS es inestable o inexacta? | Si la precisión que reporta tu teléfono es peor de 50 metros, la app descarta esa lectura por no ser fiable y muestra un aviso con un botón para reintentar. Puede pasar en interiores, calles estrechas entre edificios altos, o si el teléfono usa antenas de telefonía en vez de satélites. Al pulsar el botón de reintento, la app pide una lectura nueva; si mejora, el aviso desaparece solo. | SUGERIDA | |
| `SUG_GPS_PERMISOS_FRECUENTES` | ¿Por qué la app me pide permiso de ubicación todo el tiempo? | (vacío) | SUGERIDA | |
| `SUG_GPS_ESPERA_UBICACION` | ¿Por qué tengo que esperar para poder ver el camino hasta la parada? | (vacío) | SUGERIDA | |
| `SUG_GPS_POLYLINE_MANUAL` | ¿Por qué la línea de ruta en el mapa no aparece sola? | (vacío) | SUGERIDA | |
| `SUG_GPS_PORQUE` | ¿Por qué necesita la app el GPS siempre? | El modo AVENTURA depende de `navigator.geolocation.watchPosition()` en el padre para detectar la posición en tiempo real, calcular proximidad a paradas/tramos y activar la navegación y los eventos automáticos (CAMBIO_PARADA, heartbeat). Por eso la app requiere permiso de ubicación y GPS activo para la experiencia de aventura. | SUGERIDA | |
| `SUG_GPS_PERMISOS_FRECUENTES` | ¿Por qué la app me pide permiso de ubicación todo el tiempo? | La app consulta permisos antes de activar GPS y, en producción, el flujo de activación verifica permisos. Si el navegador o sistema marca permiso como "denied" o el usuario lo revoca, la app mostrará avisos y no podrá avanzar. El comportamiento puede variar según navegador y sistema operativo. | SUGERIDA | |
| `SUG_GPS_ESPERA_UBICACION` | ¿Por qué tengo que esperar para poder ver el camino hasta la parada? | Si estás muy cerca (entre 21 y 50 metros), la app espera 5 minutos antes de ofrecerte el camino en el mapa, por si llegas por tu cuenta sin necesitar ayuda. Si estás más lejos de 50 metros, el botón de ubicación se habilita al instante, sin esperar. | SUGERIDA | |
| `SUG_GPS_POLYLINE_MANUAL` | ¿Por qué la línea de ruta en el mapa no aparece sola? | Para que el camino se dibuje bien, la app necesita una posición GPS reciente y precisa. Por eso espera a que pulses el botón de ubicación en vez de dibujar la línea automáticamente — el tiempo que tardas en pulsarlo le da margen al GPS para situarte con más exactitud antes de trazar la ruta. | SUGERIDA | |

---

### Audio
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `AUDIO_NO_SUENA` | (sin texto) | (vacío) | PENDIENTE | |
| `AUDIO_NO_SUENA` | ¿Por qué no se oye el audio aunque la parada lo tenga? | Comprueba el volumen del dispositivo, si el idioma seleccionado tiene archivo, y que el campo `file` del audio no esté vacío (`file:''` indica ausencia). Si el archivo falta, la app continúa sin reproducirlo. | PENDIENTE | |
| `AUDIO_DETENIDO` | ¿Por qué se detiene el audio a mitad de reproducción? | Puede deberse a pérdida de conexión al recurso remoto, a la recarga del iframe o a limitaciones del navegador (autoplay/politicas de reproducción). Reproducir desde contenido ya cargado o recargar la parada puede resolverlo. | PENDIENTE | |
| `AUDIO_IDIOMA_NO_DISPONIBLE` | ¿Qué pasa si mi idioma no tiene audio? | Si no hay pista en el idioma activo, la app no tendrá audio para esa parada; revisa si hay traducción disponible en `audios-aventuras/` para otro idioma o usa los textos en pantalla. | PENDIENTE | |
| `AUDIO_AUTOMATICO` | ¿Se reproduce el audio automáticamente al llegar a la parada? | El flujo de AVENTURA activa eventos automáticos (play) cuando se alcanza la proximidad definida; el padre controla la reproducción automática según la configuración de la aventura y permisos del navegador. | PENDIENTE | |
| `AUDIO_VOLUMEN` | ¿Cómo ajusto el volumen de los audios de la app? | La app respeta el volumen del dispositivo y dispone de controles en la UI del reproductor del padre; si no se oye, comprueba tanto el volumen del dispositivo como el control dentro de la app. | PENDIENTE | |
| `SUG_AUDIO_NO_SUENA_CHECKS` | ¿Por qué no se reproduce el audio aunque haya archivo? | (vacío) | SUGERIDA | |
| `SUG_VIDEO_DATOS` | ¿Cómo evito gastar muchos datos con vídeos? | (vacío) | SUGERIDA | |
| `SUG_AUDIO_NO_SUENA_CHECKS` | ¿Por qué no se reproduce el audio aunque haya archivo? | La guía indica que muchos registros `file` de audios están vacíos (`file:''`) y la app gestiona esos casos sin romper el flujo; además el control de audio principal vive en el padre (overlay). Antes de reportar: comprueba volumen del dispositivo, idioma seleccionado, y si el campo `file` está vacío la pista no existe. | SUGERIDA | |
| `SUG_VIDEO_DATOS` | ¿Cómo evito gastar muchos datos con vídeos? | (vacío) | SUGERIDA | |

---

### Navegación y Ruta
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `PROXIMA_PARADA` | (sin texto) | (vacío) | PENDIENTE | |
| `PROXIMA_PARADA` | ¿Cómo sé cuál es la próxima parada? | La app calcula la siguiente parada según el orden de la aventura y muestra su nombre y distancia en la pantalla; también puede mostrar una línea de navegación hacia ella. | PENDIENTE | |
| `PARADA_ACTUAL` | ¿Qué información veo de la parada actual? | Verás el título, descripción, audios/vídeos disponibles y acciones asociadas (retos, pistas). La plantilla del hijo y el padre muestran estos contenidos según el estado de la parada. | PENDIENTE | |
| `PARADAS_RESTANTES` | ¿Cómo veo cuántas paradas quedan? | La app muestra el número de paradas restantes en la interfaz (token `{{PARADAS_RESTANTES}}`) y en el progreso de la aventura. | PENDIENTE | |
| `DESVIO_RUTA` | ¿Puedo tomar un camino distinto al del mapa? | Sí, puedes ir por donde quieras. La app solo comprueba que llegues al punto final del tramo, no que sigas exactamente el camino marcado. La línea azul del mapa es una sugerencia de ruta, no un camino obligatorio. Si te desvías más de 50 metros, aparecerá una línea discontinua que te indica cómo volver a la ruta, pero no te bloquea ni te penaliza. | COMPLETA | |

---

### Progreso y Guardado
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `PROGRESO_GUARDAR` | (sin texto) | (vacío) | PENDIENTE | |
| `PROGRESO_GUARDAR` | ¿Se guarda mi progreso automáticamente? | Sí: el padre mantiene estado en `localStorage` durante la aventura para restaurar la sesión (variables como `vv_aventura_iniciada`, `vv_paradas_completadas`). | PENDIENTE | |
| `PROGRESO_RETOMAR` | ¿Cómo retomo una aventura desde donde la dejé? | Al abrir la app de nuevo, si hay una aventura en curso, aparece un aviso para continuarla. Al aceptar, te lleva exactamente a la misma parada o tramo donde lo dejaste — no hace falta rehacer nada. | PENDIENTE | |
| `AVENTURA_COMPLETADA` | ¿Qué sucede cuando completo la aventura? | Al completar todas las paradas el estado de la aventura se marca como finalizado y el padre puede mostrar una pantalla de resumen; el manejo exacto depende de la aventura concreta. | PENDIENTE | |
| `SUG_PROGRESO_COMO_GUARDA` | ¿Cómo se guarda mi progreso y cuándo se sincroniza? | (vacío) | SUGERIDA | |
| `SUG_PROGRESO_OTRO_DISP` | ¿Puedo retomar la aventura en otro dispositivo? | (vacío) | SUGERIDA | |
| `SUG_PROGRESO_CIERRE_TOTAL` | ¿Qué pasa si cierro la aplicación por completo (se me apaga el móvil, cierro la pestaña por error) y vuelvo a entrar más tarde? ¿Pierdo mi progreso? | (vacío) | SUGERIDA | |
| `SUG_PROGRESO_COMO_GUARDA` | ¿Cómo se guarda mi progreso y cuándo se sincroniza? | El padre guarda progreso en `localStorage` (clave `vv_aventura_iniciada`, `vv_progreso`, `vv_paradas_completadas`). `ejecutarRestauracionAventura()` lee ese localStorage para restaurar una sesión. Atención: al pasar a MODO CASA el padre borra esas claves de `localStorage`, por lo que el progreso puede perderse si se cierra la app en CASA. | SUGERIDA | |
| `SUG_PROGRESO_OTRO_DISP` | ¿Puedo retomar la aventura en otro dispositivo? | Según la guía, el progreso se guarda localmente en `localStorage` y no hay un mecanismo descrito para sincronizarlo entre dispositivos. Por tanto, no es posible retomar automáticamente en otro dispositivo con la versión actual. | SUGERIDA | |
| `SUG_PROGRESO_CIERRE_TOTAL` | ¿Qué pasa si cierro la aplicación por completo (se me apaga el móvil, cierro la pestaña por error) y vuelvo a entrar más tarde? ¿Pierdo mi progreso? | No, tu progreso no se pierde. La app guarda automáticamente en tu dispositivo la parada o tramo donde estás, el audio actual y el tiempo restante del reloj de la aventura. Al volver a abrir el enlace, verás un aviso para continuar tu aventura exactamente donde la dejaste — no hace falta volver a introducir el código ni empezar de cero, y el reloj retoma el tiempo que ya llevabas consumido en vez de reiniciarse. Esto funciona igual tanto si cerraste la pestaña voluntariamente como si el móvil se apagó de golpe, siempre que no hayan pasado más de 7 días desde la última vez que usaste la app — pasado ese plazo, el progreso guardado se descarta automáticamente y la aventura empieza de cero. | SUGERIDA | |

---

### Retos y Puzzles
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `RETO_NO_ENTIENDO` | (sin texto) | (vacío) | PENDIENTE | |
| `RETO_NO_ENTIENDO` | No entiendo el enunciado del reto, ¿qué hago? | Los retos incluyen instrucciones y, si el contenido no es claro, se recomienda recargar la parada o usar el botón de ayuda/ayuda contextual si existe. Si persiste, reporta el contenido con la `parada_id`. | PENDIENTE | |
| `RETO_RESPUESTA_MAL` | Envié una respuesta y la app dice que está mal, pero creo que es correcta. | Revisa mayúsculas/minúsculas y formato; si hay un fallo, el mecanismo de verificación del reto puede ser estricto. Si confirmas un error, repórtalo indicando la parada y el reto. | PENDIENTE | |
| `PUZZLE_AYUDA` | ¿Cómo pido una pista o ayuda para un puzzle? | Algunos retos ofrecen pistas integradas; si no, revisa la interfaz del reto para ver si hay un botón de pista o usa el chat de soporte para solicitar ayuda indicando la parada. | PENDIENTE | |
| `SUG_RETO_BLOQUEO` | ¿Qué hago si un reto o puzzle no carga o se queda bloqueado? | (vacío) | SUGERIDA | |
| `SUG_BTN_AVANZAR_BLOQUEADO` | ¿Por qué a veces el botón “Avanzar” está bloqueado? | (vacío) | SUGERIDA | |
| `SUG_RETO_BLOQUEO` | ¿Qué hago si un reto o puzzle no carga o se queda bloqueado? | El `puzzle.html` se carga como sub-iframe o vía hijo4; si se bloquea, intenta recargar el reto o el iframe. La guía indica que los iframes pueden recargarse (AUTO_RECONECTAR) y el padre muestra overlays de error para recursos rotos; si persiste, reportar el fallo con la identificación de la parada. | SUGERIDA | |
| `SUG_BTN_AVANZAR_BLOQUEADO` | ¿Por qué a veces el botón “Avanzar” está bloqueado? | En MODO AVENTURA el botón `btn-avanzar` se bloquea hasta completar audio + reto en una parada; en CASA está habilitado para navegación manual. El bloqueo es intencional por diseño. | SUGERIDA | |

---

### La Aplicación
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `APP_GENERAL` | (sin texto) | (vacío) | PENDIENTE | |
| `APP_GENERAL` | ¿Qué hace la app principal? | La app orquesta la experiencia: carga aventuras, controla navegación GPS, reproduce audios/vídeos, y gestiona iframes/hijos para retos y contenidos. | PENDIENTE | |
| `APP_SEGUNDO_PLANO` | ¿La app funciona en segundo plano? | La experiencia AVENTURA necesita la pantalla/posición para funcionar correctamente; aunque algunos navegadores permiten background geolocation, la guía no documenta soporte explícito completo en segundo plano. | PENDIENTE | |
| `SIN_CONEXION` | ¿Qué ocurre si estoy sin conexión? | La app intenta usar lo ya cargado en memoria/localStorage; contenidos no descargados (audios/vídeos) no estarán disponibles y la app puede mostrar avisos de falta de recursos. | PENDIENTE | |
| `BOTONES_ESTADO` | ¿Qué significan los distintos estados de los botones? | Los botones de navegación cambian según `MODO` (CASA vs AVENTURA) y según progreso: por ejemplo, `Avanzar` puede estar bloqueado hasta completar acciones en la parada. | PENDIENTE | |
| `SUG_BATERIA_PORQUE` | ¿Por qué la app consume batería rápidamente? | (vacío) | SUGERIDA | |
| `SUG_BATERIA_AHORRO` | ¿Puedo usar la app en modo ahorro de energía? | (vacío) | SUGERIDA | |
| `SUG_PRIVACIDAD_USO` | ¿Cómo se usan mis datos de ubicación? | (vacío) | SUGERIDA | |
| `SUG_PRIVACIDAD_TERCEROS` | ¿La app comparte datos con terceros? | (vacío) | SUGERIDA | |
| `SUG_REPORTAR` | ¿Cómo reporto audios, textos faltantes o errores? | (vacío) | SUGERIDA | |
| `SUG_BATERIA_PORQUE` | ¿Por qué la app consume batería rápidamente? | El uso de `watchPosition` con `enableHighAccuracy: true`, la reproducción de audio/vídeo y la pantalla activa contribuyen al consumo elevado de batería; la guía documenta `watchPosition` con máxima precisión precisamente por la experiencia en AVENTURA. | SUGERIDA | |
| `SUG_BATERIA_AHORRO` | ¿Puedo usar la app en modo ahorro de energía? | La guía no documenta un modo específico de ahorro de energía para el usuario. Reducir el brillo, desactivar GPS (volver a MODO CASA) o pausar la reproducción de audio son medidas prácticas si se requiere ahorrar batería. | SUGERIDA | |
| `SUG_PRIVACIDAD_USO` | ¿Cómo se usan mis datos de ubicación? | El padre usa la ubicación localmente para calcular proximidad y navegación, y guarda estado en `localStorage` para restauración. La guía no documenta envío sistemático de la ubicación a terceros; consulta la política de privacidad o el backend si necesitas confirmación adicional. | SUGERIDA | |
| `SUG_PRIVACIDAD_TERCEROS` | ¿La app comparte datos con terceros? | En la documentación proporcionada no hay una lista explícita de compartición con terceros. Los recursos están servidos por el servidor estático y los datos se mantienen en `localStorage` salvo que la app implemente un endpoint adicional. Revisa la política de privacidad del sitio o el backend para confirmarlo. | SUGERIDA | |
| `SUG_REPORTAR` | ¿Cómo reporto audios, textos faltantes o errores? | La guía incluye un correo de contacto para incidencias: `valenciadtours@gmail.com`. Indica la `parada_id` o el identificador del elemento al reportar para ayudar en la resolución. | SUGERIDA | |
| `SUG_ACCESIBILIDAD_SUBT` | ¿La app tiene subtítulos o texto alternativo para audios? | (vacío) | SUGERIDA | |
| `SUG_ACCESIBILIDAD_LETRA` | ¿Cómo aumento el tamaño de letra o uso lectura por voz del sistema? | (vacío) | SUGERIDA | |

---

### Tiempo y Recorrido
| Clave | Pregunta (es) | Respuesta conocida (es) | Estado | Texto sugerido |
|---|---|---:|---:|---|
| `TIEMPO_AGOTADO` | (sin texto) | (vacío) | PENDIENTE | |
| `TIEMPO_AGOTADO` | ¿Qué pasa si se agota el tiempo de una prueba/actividad? | Algunas aventuras o retos pueden tener límites temporales; si el tiempo se agota, la actividad puede marcarse como fallida o pasar al siguiente estado según la lógica del reto. | PENDIENTE | |
| `TIEMPO_AVENTURA` | ¿Cuánto dura la aventura estimada? | La guía ofrece estimaciones generales por aventura en sus metadatos; la duración real depende del ritmo del usuario y paradas seleccionadas. | PENDIENTE | |
| `PAUSAS_RUTA` | ¿Puedo pausar la aventura y luego continuar? | La app guarda estado en `localStorage` y permite retomar la sesión; para pausas largas, asegúrate de no cerrar/limpiar el `localStorage` ni pasar a MODO CASA si quieres restaurar la sesión. | PENDIENTE | |
| `ACCESO_MONUMENTOS` | ¿Puedo acceder a monumentos o interiores con la app? | La app proporciona indicaciones y contenidos asociados a paradas; el acceso físico a monumentos depende de las normas del lugar y de si hay restricciones de visita. | PENDIENTE | |

---




## Notas
- Las preguntas y respuestas en blanco provienen de `js/chat-asistente.js` y están pendientes de redacción.
- La intención `DESVIO_RUTA` ya contiene texto en varios idiomas; la versión en español está copiada arriba.
- Puedes editar este archivo directamente en tu editor; cuando tengas las preguntas redactadas puedo volcar las respuestas en `js/chat-asistente.js` si lo deseas.

---

Archivo generado automáticamente por la extracción de `js/chat-asistente.js`.
