# Instrucciones para Claude Code — Valencia VGuides

## Regla de oro antes de implementar

**Antes de escribir cualquier función nueva, busca si ya existe.**

```bash
node tools/inventory.js | grep -i "nombre_o_concepto"
```

Si encuentras algo con nombre similar o propósito parecido, muéstraselo al usuario antes de continuar. No implementes hasta confirmar que realmente hace falta algo nuevo.

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

## Documentación de autoridad

`docs/GUIA-COMPLETA.md` es la fuente de verdad de la arquitectura. Mantenla actualizada con cada cambio significativo. No usar lenguaje de "diario de cambios" — describir el estado actual, no el historial.
