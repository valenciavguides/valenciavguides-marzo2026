# Instrucciones para Claude Code — Valencia VGuides

## Regla de oro antes de implementar

**Antes de escribir cualquier función nueva, busca si ya existe.**

```bash
node tools/inventory.js | grep -i "nombre_o_concepto"
```

Si encuentras algo con nombre similar o propósito parecido, muéstraselo al usuario antes de continuar. No implementes hasta confirmar que realmente hace falta algo nuevo.

**Que el grep no encuentre nada no es prueba de que no exista.** `inventory.js` lista por patrón,
igual que cualquier `grep`: un alias (`const fn_S1 = modulo.fn`), una asignación a `globalThis`
con otro nombre, o un método colgado de un objeto pueden no aparecer con el nombre o concepto que
se busca. Antes de decir "no existe nada parecido", repasar la fila de **ausencia** de
`docs/GUIA-COMPLETA.md` §36.0 — la comprobación es una búsqueda del identificador pelado en los
ficheros reales, no solo un filtro sobre la lista curada del inventario.

Comandos disponibles:
- `npm run inventory` — lista completa de todas las funciones del proyecto (orden alfabético)
- `npm run inventory:dupes` — solo nombres que aparecen en más de un archivo
- `npm run inventory:file` — agrupado por archivo

## Arquitectura

PWA de audioguía con arquitectura iframe + postMessage.

- **Padre**: `codigo-padre.html` — orquesta todo. Cinco `<script type="module">` con scope separado.
- **Hijos**: `coordenadas-hijo2.html`, `audio-hijo3.html`, `retos-hijo4.html`, `boton-casa-hijo5.html`, `chat-hijo6.html`, `extrainfo-hijo1.html`
- **Pantalla de selección**: `En-busca-del-tesoro.html`
- **Módulos JS**: `js/*.js` — importables por ESM
- **Comunicación**: `js/mensajeria.js` → `globalThis.mensajeria`

## Funciones en scope separado

`codigo-padre.html` tiene 5 bloques `<script type="module">` (las líneas se desplazan con cada edición del archivo, tratar como aproximadas): Script 1 (~2691–8865), Script 2 (~8866–13034, "Lógica post-carga y funciones auxiliares"), Script 3 (~13035–13195, gestión de visibilidad de iframes), Script 4 (~13196–13559, "Migración de controladores y diagnóstico GPS"), Script 5 (~13560–fin, panel de logs en pantalla). Una función definida en un script es **invisible** en cualquier otro a menos que se exponga via `globalThis.nombreFuncion = nombreFuncion` — la misma regla aplica a los 5 entre sí, no solo a Script 1↔Script 2.

Antes de añadir cualquier función nueva en código padre, comprueba que no existe ya en otro script del mismo archivo.

## Reglas duras (se cumplen aquí, no en la memoria)

Estas reglas ya estaban en la memoria del proyecto y aun así se han incumplido varias veces.
La memoria solo se lee si alguien decide ir a leerla; este fichero está delante siempre. Por eso
viven aquí.

1. **Antes de proponer o ejecutar un paso de la migración de mensajería**, citar textualmente el
   párrafo de `docs/mensajeria-duplicada-en-hijos.md` que lo cubre. Sin cita no hay propuesta. El
   plan ya está decidido: no se reinventa el orden.
2. **Antes de escribir en `docs/GUIA-COMPLETA.md`**, leer `feedback_guia_es_manifiesto` y
   `feedback_guia_detalle` de la memoria. La guía describe lo que existe, en presente: prohibidas
   las fechas, el "antes/ahora", "se eliminó" y cualquier verbo en pasado sobre el proyecto. El
   porqué de una decisión va en los comentarios del código. Al cerrar cualquier tanda de ediciones:
   `grep -n "2026-0[0-9]-[0-9]\{2\}" docs/GUIA-COMPLETA.md`.
3. **Un inventario que salga de un `grep` por nombre no es un inventario**: devuelve a quien tiene
   la cosa, nunca a quien le falta. Para "¿quién no lo tiene?" usar `npm run verificar-frames` o
   enumerar las ausencias a mano, fichero por fichero.
3b. **Al reportar un barrido sobre varios frames, nombrar también los que NO se han tocado y por
   qué.** El censo son los diez: padre, selección, hijo1 a hijo6, mapa-completo, puzzle y
   video-intro. Decir solo dónde se ha actuado hace indistinguible "mirado y no hacía falta" de
   "olvidado" — y hijo6 ya se ha quedado fuera de una lista por ese motivo. La ausencia se
   justifica con una comprobación citable (`git show <commit>:<fichero> | grep -c …`), no con un
   recuerdo.
4. **Parchear con un script escrito en disco**, nunca con `node -e`, heredoc, ni `sed -i "…"` entre
   comillas dobles: el shell se come las barras invertidas y los backticks, y rompe literales y
   comentarios sin que el lint lo vea. El working tree está en CRLF, así que ningún ancla debe
   cruzar un salto de línea. El script aborta si su ancla no aparece exactamente una vez. Después
   de parchear, comprobar que el texto sobrevivió — no basta con que el script diga que aplicó.
5. **Mientras corre `npx playwright test`, no lanzar nada más** en el proyecto: ni greps, ni lint,
   ni otra tanda. Para iterar, el spec tocado en `--project=chromium`; la tanda de los cuatro
   navegadores (~47 min) solo antes de un commit grande o del push.
6. **Cuando una lectura estática y una medición en ejecución se contradigan, gana la medición** — y
   se arregla o se retira el instrumento estático, no se ignora la contradicción.
7. **Leer la memoria COMPLETA, no el índice.** De la memoria solo llegan solos los títulos de
   `MEMORY.md`: una línea por fichero, que sirve para saber que algo existe y para nada más. El
   contenido —el porqué, las trampas medidas, las reincidencias— hay que ir a leerlo. Hacerlo al
   empezar una sesión de trabajo, al cambiar de frente, y siempre antes de escribir en la guía o
   de tocar la mensajería. Un título leído no es la regla leída: las tres recaídas del estilo de
   la guía ocurrieron con su memoria escrita y sin abrir.
8. **La `GUIA-COMPLETA` se consulta siempre, y no se cree nunca.** Es el mejor mapa del proyecto
   y ahorra horas, así que hay que tenerla presente en cada cambio — pero no es fuente de verdad
   todavía: contiene afirmaciones que el código nunca implementó, algunas contradiciendo a otra
   sección del propio documento. Toda afirmación en la que se vaya a apoyar una decisión se
   verifica contra el código, y la discrepancia se corrige en el mismo trabajo en que aparece, no
   "para luego".
9. **No se recomienda nada mientras quede algo sin comprobar de lo que lo sostiene.** Primero se
   comprueba todo —el código entero de lo que se toca, quién lo lee y quién lo escribe, los `js/`
   compartidos que carga ese frame, la línea entera del dato— y después se recomienda. Etiquetar
   algo como "sin comprobar" no es la solución: es presentar trabajo a medias. Si falta un dato que
   solo tiene el usuario, se le pregunta eso, y no se recomienda encima. Se incumplió dos veces en una
   misma sesión, con la regla ya escrita en la memoria.
10. **Una herramienta que busca por patrón no demuestra una ausencia.** Un `grep`, una regex o
   un extractor devuelven **lo que casa**; que algo no salga puede ser que no esté o que el
   patrón no lo viera, y la salida no distingue las dos. Antes de reportar, clasificar la
   afirmación y aplicar su comprobación: **ausencia** ("no existe", "falta", "no lo llama
   nadie") → búsqueda desnuda del nombre, sin anclas, en todo el repositorio; **recuento**
   ("son 19") → el extractor tiene que imprimir lo que dejó **sin casar** dentro de su propia
   entrada, o el recuento no se reporta; **ejecución** ("lanza", "no se dispara", "está roto")
   → ejecutarlo o leer las líneas exactas, nunca deducirlo de la salida de otra herramienta.
   Coincidir con la guía **no** corrobora: en una auditoría la guía es la acusada. La gravedad
   sube el listón — una errata pasa con una comprobación, "hay algo roto que el usuario toca"
   necesita tres caminos independientes. Cada hallazgo se reporta con el método pegado
   ("medido con", "leído en fichero:línea", "ejecutado"); lo que solo esté inferido no sale del
   borrador: o se termina de comprobar, o se plantea como pregunta. Antes de escribir CUALQUIER
   hallazgo (dentro o fuera de una auditoría formal), repasar `docs/GUIA-COMPLETA.md` §36.0 —
   la tabla de 30 segundos, una fila por tipo de afirmación. Detalle y más casos en §36.27.7.

## Documentación de autoridad

`docs/GUIA-COMPLETA.md` es la fuente de verdad de la arquitectura. Mantenla actualizada con cada cambio significativo. No usar lenguaje de "diario de cambios" — describir el estado actual, no el historial.
