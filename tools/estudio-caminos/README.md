# tools/estudio-caminos — los extractores de la ronda 2

Son los instrumentos con los que la ronda 2 de [`docs/estudio-caminos.md`](../../docs/estudio-caminos.md) midió la PWA entera.
No forman parte de la aplicación ni del `npm run lint` ni del `npm run inventory`: son análisis de un solo uso que se
guardan para poder **repetirlos**. Todos siguen la regla 10 de `CLAUDE.md`: parsean con `acorn` (el que ya está en
`node_modules`) en vez de buscar por patrón, y **imprimen su residuo** — lo que dejaron sin casar — dentro de su propia salida.
Un recuento sin su residuo no se reporta.

## Cómo se ejecutan

```bash
node tools/estudio-caminos/<script>.cjs
```

- Desde cualquier carpeta: `lib.cjs` resuelve la raíz del repo desde su propia ubicación.
- Los ficheros intermedios (`funciones.json`, `mensajes.json`…) y los informes se escriben en
  `<carpeta temporal del sistema>/estudio-caminos`, o en la que diga la variable de entorno `ESTUDIO_SALIDA`. Nunca en el repo.
- `NODE_NO_WARNINGS=1` silencia el aviso de Node por importar un módulo ES (`js/constants.js`, `js/config.js`) sin `"type"` en
  `package.json`; no cambia ningún resultado.
- `globals-sin-lector.cjs`, `tipos-citados.cjs` y `comentarios-nombres-citados.cjs` usan además `tools/lib/analisis-js.js`.
- Los cuatro que comparan la guía con el código (`guia-handlers-por-frame`, `guia-fichas-mensaje`, `guia-payloads`, `guia-nombres-citados`) leen `docs/GUIA-COMPLETA.md`,
  o la copia que diga la variable `ESTUDIO_GUIA` (`git show <commit>:docs/GUIA-COMPLETA.md > copia.md`): ejecutados contra la guía de un
  commit anterior son el control de que detectan lo que dicen detectar.

## Orden y dependencias

Un script de la primera columna deja un fichero que leen los de la segunda; el resto son independientes.

| Primero | Después | Qué mide |
|---|---|---|
| `extract-functions` → `funciones.json` | `analiza-funciones`, `clones-mismo-fichero`, `extract-tests` | funciones, homónimos entre ficheros, clones |
| `extract-mensajes` → `mensajes.json` | `reporte-mensajes`, `destinos`, `destinos-inverso`, `handlers-duplicados`, `handlers-solo-log`, `guia-handlers-por-frame`, `guia-fichas-mensaje` | emisores y receptores de cada tipo del bus; emisiones al vacío; handlers que ninguna emisión alcanza; handlers cuyo cuerpo solo escribe en el log; filas de las tablas de §26.12, §7 y §8 de la guía sin respaldo en el código y tipos de cada frame que la guía no cuenta; la tabla de cobertura por hijo de §10.7 celda por celda y las filas «Emitido por» / «Handler en …» de las fichas de §10 junto a lo que hace el código |
| `extract-mensajes` + `extract-payload` → `mensajes.json` y `payload.json` | `guia-payloads` | claves de payload que la guía da por enviadas en §7, §8 y §10 y que ningún emisor del código manda |
| `extract-globals` → `globals.json` | `extract-tests` | `globalThis.X` escritos por frame y sus escritores |
| `extract-constantes` → `constantes.json` | `analiza-const` | declaraciones, comparaciones y plazos con valor numérico |
| `extract-recursos` → `recursos.json` | `analiza-recursos` | `setInterval`, listeners, observers, `map.on` y su pareja de parada |
| `extract-estado` → `estado-writes.json` | `specs-estado-fantasma`, `barrido-extra` | escritores por ruta de campo de `estado`, `estadoMapa`… |

`guia-nombres-citados` y `comentarios-nombres-citados` no necesitan ninguno. El primero busca como token, en los ficheros rastreados con código,
cada función, handler o global propio que la guía cita entre backticks. El segundo hace lo mismo con los identificadores que citan los comentarios
de JavaScript de las páginas, de `js/*.js` y de `sw.js`, contra el código sin comentarios de esos ficheros y de los specs. Los dos listan los que
no aparecen: son candidatos, se confirman leyendo la frase o el comentario (un comentario que cuenta lo que se retiró es legítimo; uno que lo da
por vivo no).

Independientes: `extract-storage`, `extract-payload`, `extract-discriminadores`, `extract-idiomas`, `barrido-constants`,
`barrido-i18n`, `i18n-completitud`, `paginas-idiomas`, `barrido-css-dom`, `barrido-clases`, `ids-duplicados`, `api-keys`,
`estado-solo-escritura`, `exports-sin-uso`, `exports-tokens`, `globals-fantasma`, `globals-fantasma-lecturas`, `globals-por-frame`,
`globals-sin-lector`, `config-lectores`, `config-lectores2`, `recursos-locales`, `listeners-duplicados`, `cadenas-respaldo`,
`query-params`, `specs-globals-fantasma`, `appshell-existe`, `sw-lista`, `sw-sueltos`, `tipos-citados`.

`verifica-tablas` comprueba el propio documento: que cada tabla de `docs/estudio-caminos.md` tiene el mismo número de celdas en
todas sus filas, que las entradas K, las mediciones M, las discrepancias G y las erratas E van consecutivas y que ninguna
referencia apunta a algo que no existe. Sale con código 1 si algo falla.

## Lo que deben dar sobre el commit base (`ffe9bfc`)

Es el estado del árbol con el que se hizo el barrido. Ejecutados contra él (ver abajo cómo), reproducen las cifras de la tabla
de instrumentos de R2.0:

| Script | Cifra |
|---|---|
| `extract-functions` | `ficheros 50 funciones 2009 sin parsear 0` |
| `extract-mensajes` | `emisores resueltos 253 receptores resueltos 144 sin resolver 8 tipos válidos 94` |
| `destinos` / `destinos-inverso` | 5 tipos con emisión de destino literal sin handler en ese frame; 6 handlers inalcanzables (5 reales y 1 falso positivo, K-35) |
| `extract-globals` | padre: `globals escritos en total: 182; con >=2 escritores: 32` |
| `extract-constantes` | `decl 578 cmp 221 timers 146` |
| `extract-estado` / `barrido-extra` | 148 rutas de campo, 49 con ≥3 funciones escritoras; 441 escrituras; 17 campos homónimos en ≥2 raíces de 123 nombres |
| `estado-solo-escritura` | 158 rutas escritas, 30 candidatas solo-escritura (15 sin ancestro leído entero, 15 con alguno) |
| `config-lectores2` | 46 hojas de `CONFIG`; 6 con lectura de ruta y 40 sin ella (las 2 de `MAPA.CENTRO_DEFECTO` se leen como objeto entero: 8 con lector, 38 sin) |
| `extract-tests` | 111 specs parseados |
| `barrido-i18n` | 321 asignaciones de texto, 73 dinámicas, 155 literales no españoles, 93 literales españoles |
| `barrido-constants` | 177 hojas en los 9 objetos de `constants.js`, 75 sin lector |
| `globals-por-frame` | 17 páginas, 48 ficheros, 2195 usos de `globalThis.X` |
| `api-keys` | usos de import: 97 estáticos con nombre, 8 `import *`, 68 `await import()` desestructurados y 3 por miembro o `.then`; 0 nombres sin exportar |
| `exports-tokens` | 191 exports; 55 sin mención en otro fichero de producción (27 muertos del todo, 3 solo en specs, 25 de uso interno) |
| `recursos-locales` | 491 referencias en 50 ficheros, 1 inexistente |
| `listeners-duplicados` | pares con varios sitios en el padre, la selección y el puzzle |
| `cadenas-respaldo` | 152 cadenas de respaldo; 12 con varias fuentes |
| `query-params` | 7 parámetros leídos: `aventura`, `despedida`, `id`, `imagen`, `lang`, `padreId`, `replay` |
| `ids-duplicados` | 193 ids estáticos distintos, 0 repetidos dentro de su documento |

Sobre `HEAD` los números cambian, y es lo esperable: la tanda de arreglos (R2.8) retiró código y la guía. Por ejemplo, 1955
funciones, 162 exports (28 sin mención: 6, 3 y 19), 94 hojas de `TIPOS_MENSAJE` y solo 4 objetos exportados por `constants.js`.
Los scripts que dependían de lo retirado se ajustaron para leer lo que exista (`barrido-constants` filtra los objetos que
`constants.js` ya no exporta; `extract-mensajes`, `extract-payload` y `extract-discriminadores` derivan los tipos válidos de `TIPOS_MENSAJE` y no de
la lista plana que ya no hay: con el conjunto vacío no resolvían ningún tipo escrito como literal y `extract-payload` no emitía informe).

Hay dos verificadores del repo que dan las mismas cifras por otro camino y son el contraste: `tools/verificar-mensajeria.js` frente a
`extract-mensajes`, y `node tools/codigo-muerto.js` (categoría 5) frente a `exports-tokens`.

## Cómo repetirlos contra el commit base

```bash
git worktree add <carpeta> ffe9bfc
# node_modules no está versionado: enlazarlo (en Windows, `mklink /J`; borrar el enlace ANTES de `git worktree remove`)
cp -r tools/estudio-caminos <carpeta>/tools/estudio-caminos
mkdir -p <carpeta>/tools/lib && cp tools/lib/analisis-js.js <carpeta>/tools/lib/   # no existían en ffe9bfc
cd <carpeta> && ESTUDIO_SALIDA=<salida> node tools/estudio-caminos/extract-functions.cjs
```

## Límites

Los de cada instrumento están en el estudio (K-34, K-38, K-41, K-42 y R2.7): los extractores ven JavaScript dentro de `<script>`
sin `src` y en `js/*.js`, no ven accesos por clave computada (`obj['nombre']`) ni código en atributos `on*=`, y un token
igual en otro fichero cuenta como uso. Lo que listan es casi siempre ausencia casi segura, no prueba: antes de borrar nada, la
búsqueda desnuda del nombre en todo el repo y la lectura del llamador.
