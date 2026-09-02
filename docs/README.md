# 📚 Documentación Técnica — Valencia VGuides

> **Proyecto:** Valencia VGuides PWA  
> **Versión:** 1.0.0  
> **Última actualización:** 2026-08-23

---

## 📖 DOCUMENTO PRINCIPAL

### [GUIA-COMPLETA.md](GUIA-COMPLETA.md) — Documentación maestra del proyecto

**12,500+ líneas** que cubren absolutamente TODO sobre la PWA:
- Arquitectura padre-hijo con iframes
- Sistema de mensajería centralizado
- Gestión de modos (CASA/AVENTURA)
- GPS, mapas, audios, retos, puzzles
- Service Worker y PWA
- Sistema de tests
- Preparación para producción

**37 secciones completas** con diagramas Mermaid, ejemplos de código y referencias cruzadas.

---

## � Estado de las auditorías previas

Los documentos de auditoría/investigación que existieron en `docs/` (diagnóstico de race conditions, memory leaks, mensajería huérfana, etc.) fueron verificados línea a línea contra el código real y retirados: la mayoría de sus hallazgos resultaron ya corregidos, ya documentados como comportamiento intencional en `GUIA-COMPLETA.md`, o basados en premisas técnicas incorrectas (p.ej. la "race condition `estadoPadre`" asumía que los 5 `<script type="module">` de `codigo-padre.html` podían ejecutar fuera de orden, algo que el HTML Standard no permite para scripts sin `async`). Lo que seguía siendo válido ya está incorporado en `GUIA-COMPLETA.md`. Para el estado real de tareas pendientes antes de producción, ver **§22** de esa guía.

---

## 🗺️ GUÍAS ESPECÍFICAS

### [brujula-y-mapa.md](brujula-y-mapa.md)
Documentación completa del sistema de brújula y selector de mapa.

### [fonetica.md](fonetica.md)
Guía fonética para nombres y términos del proyecto.

### [plan-produccion-infraestructura.md](plan-produccion-infraestructura.md)
Plan detallado de infraestructura para despliegue en producción.

---

## 📊 ESTRUCTURA DE LA DOCUMENTACIÓN

```
docs/
├── GUIA-COMPLETA.md                              ← DOCUMENTO MAESTRO
├── README.md                                      ← Este archivo (índice)
│
└── GUIAS-ESPECIFICAS/
    ├── brujula-y-mapa.md
    ├── fonetica.md
    └── plan-produccion-infraestructura.md
```

---

## 🎯 RUTAS DE LECTURA RECOMENDADAS

### Para entender el proyecto desde cero:
1. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §1-9 (¿Qué es? + Arquitectura básica)
2. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §25 (Experiencia de usuario completa)
3. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §8 (Comunicación padre-hijo)

### Para desarrollar nuevas features:
1. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §26 (Controladores y comunicación)
2. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §32-33 (Invariantes y robustez)
3. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §18 (Sistema de tests)

### Para preparar producción:
1. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §22 (Preparación producción)
2. **[plan-produccion-infraestructura.md](plan-produccion-infraestructura.md)**

### Para debuggear problemas:
1. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §31 (Posibles problemas)
2. **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §36-37 (Metodología de auditoría y mapa de conexiones)

---

## 🔍 METODOLOGÍA DE DOCUMENTACIÓN

### Principios seguidos en todos los documentos:

1. **Código exacto con líneas:** Toda referencia a código incluye `archivo:línea` exacta
2. **ANTES/DESPUÉS:** Toda solución propuesta muestra código ANTES y DESPUÉS
3. **Impacto real:** No problemas teóricos, solo problemas REALES con impacto demostrado
4. **Afectados identificados:** Cada problema identifica quiénes/qué se ve afectado
5. **Conexiones explícitas:** Mapas de dependencias, call chains, flujos de mensajes
6. **Estado actual:** Cada documento marca si el problema está RESUELTO o SIN CORREGIR

### Convenciones de formato:

- ✅ **Correcto / Implementado**
- ❌ **Error / Sin implementar**
- ⚠️ **Advertencia / Precaución**
- 🔴 **CRÍTICO** (bloquea producción)
- 🟡 **ALTO** (bug evidente)
- 🟢 **MEDIO** (deuda técnica)
- ⚪ **BAJO** (código muerto)

---

## 📋 CHECKLIST PRE-PRODUCCIÓN

Ver la tabla en **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §22.0 — es la lista viva de tareas de infraestructura pendientes (HTTPS/DNS, CSP, `PROTECT_DATA`, sandboxing de iframes, etc.), con su estado actual.

---

## 🔄 HISTORIAL DE ACTUALIZACIONES

### 2026-09-02: Retirada de la documentación de auditoría obsoleta
- Verificados contra código real los 13 documentos de auditoría/investigación acumulados hasta la fecha (race conditions, memory leaks, mensajería huérfana, código muerto).
- La mayoría de los hallazgos resultaron ya corregidos, ya documentados como intencionales en `GUIA-COMPLETA.md`, o basados en premisas técnicas incorrectas.
- Documentos retirados de `docs/`; lo que seguía siendo válido se incorporó a `GUIA-COMPLETA.md`.

---

## 📞 CONTACTO Y CONTRIBUCIÓN

Para cualquier duda sobre la documentación o el proyecto:
- Consultar primero **[GUIA-COMPLETA.md](GUIA-COMPLETA.md)** §23 (Glosario) y §36 (Metodología)
- Seguir principios de documentación de esta página

---

**Última revisión:** 2026-09-02  
**Documentos activos:** `GUIA-COMPLETA.md` + 3 guías específicas + este índice
