---
name: Dimensiones originales iframes hijo2/hijo3
description: Backup de dimensiones CSS originales de #hijo2 y #hijo3 en codigo-padre.html antes de hacerlos responsive
type: project
---

Dimensiones originales (pre-responsive) de los iframes en codigo-padre.html:

**#hijo3** (audio controls, parte inferior):
- bottom: -0.25rem
- right: calc(1.2vw - 0.625rem)
- height: 10.3125rem
- width: 20rem

**#hijo2** (coordenadas/navegación, encima de hijo3):
- bottom: 9.8125rem
- right: calc(1.2vw - 0.625rem)
- height: 10.3125rem
- width: 20rem

**Why:** El usuario quiere hacer los iframes responsive pero puede querer revertir si no le gustan los cambios.

**How to apply:** Si el usuario pide volver a las dimensiones originales, restaurar estos valores exactos.
