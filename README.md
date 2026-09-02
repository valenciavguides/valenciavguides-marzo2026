# 🏛️ Valencia VGuides

> **Audioguía interactiva con GPS de Valencia histórica**  
> **Versión:** 1.0.0 (desarrollo)  
> **Dominio:** valenciavguides.es (pendiente de despliegue)

---

## � Estado actual

En desarrollo activo, sin bloqueos críticos conocidos en la lógica de la app. Lo que queda pendiente antes de publicar en `valenciavguides.es` es infraestructura de despliegue (HTTPS/DNS, CSP, backend autenticado, sandboxing de iframes) — ver **[docs/GUIA-COMPLETA.md](docs/GUIA-COMPLETA.md) §22**.

---

## 📖 Documentación

### 📚 [Índice de Documentación](docs/README.md)

**Documentos principales:**

- **[docs/GUIA-COMPLETA.md](docs/GUIA-COMPLETA.md)** — Guía maestra del proyecto
  - 37 secciones técnicas completas
  - Arquitectura, comunicación, GPS, mapas, audio, retos
  - Sistema de tests, PWA, Service Worker
  - Preparación para producción (§22)

- Guías específicas adicionales en `docs/` (ver [docs/README.md](docs/README.md))

---

## ⚡ Inicio Rápido (desarrollo local)

### Prerrequisitos
- Node.js 18+
- Navegador moderno (Chrome/Edge recomendados)

### Instalación

```bash
# Clonar repositorio
git clone [URL-del-repo]
cd valenciavguides

# Instalar dependencias
npm install

# Verificar inventario de funciones
npm run inventory
```

### Arrancar aplicación

```bash
# Opción 1: Servidor Node.js (recomendado)
node js/server.js
# Abre: http://localhost:8080

# Opción 2: Live Server (VS Code)
# Click derecho en index.html → "Open with Live Server"
# Abre: http://127.0.0.1:5500
```

### Tests

```bash
# Tests E2E (Playwright)
npm run test:e2e

# Tests unitarios
npm test

# Verificar mensajería
npm run verificar-mensajeria

# Inventario de funciones duplicadas
npm run inventory:dupes
```

---

## 🏗️ Arquitectura

### PWA Padre-Hijo con Iframes

```
codigo-padre.html (14,700 líneas)
├── 5 scripts <type="module"> con scope separado
├── Gestión de modos CASA/AVENTURA
├── GPS, mapa de aventura (MapLibre GL)
└── Comunicación postMessage centralizada (js/mensajeria.js)
    ├── hijo1: extrainfo-hijo1.html (temporizador, contador)
    ├── hijo2: coordenadas-hijo2.html (mapa, GPS, brújula)
    ├── hijo3: audio-hijo3.html (reproductor, controles)
    ├── hijo4: retos-hijo4.html (preguntas, puzzles)
    ├── hijo5: boton-casa-hijo5.html (modo DEV, navegación)
    └── hijo6: chat-hijo6.html (asistente soporte)
```

### Datos de Aventuras

```javascript
js/
├── coordenadas-aventuras.js  // Rutas GPS (7 aventuras)
├── audios-aventuras.js        // Metadata audios (12 idiomas)
├── retos-aventuras.js         // Preguntas/puzzles
├── textos-aventuras.js        // IDs de paradas
└── parrafos-textos/           // Contenido narrativo JSON
```

**Idiomas soportados:** 12 (ES, EN, FR, IT, NL, JP, DE, ZH, PL, PT, RU, UK)

---

## 🧪 Tests

### Cobertura actual

- **40+ tests E2E** (Playwright)
  - Fase 1 boot
  - Cambio de modo
  - Handshake padre-hijo
  - Race conditions
  - GPS y navegación
  - Audio y retos

- **Tests unitarios** (Jest)
  - Mensajería
  - State manager
  - Validación de datos

**Ejecutar suite completa:**
```bash
npm run test:all
```

---

## 📦 Estructura del Proyecto

```
valenciavguides/
├── index.html                 # Landing page
├── codigo-padre.html          # ⭐ Orquestador principal (14,700 líneas)
├── En-busca-del-tesoro.html   # Pantalla selección aventura
├── video-intro.html           # Intro animada
│
├── *-hijoN.html               # 6 iframes hijos
│   ├── extrainfo-hijo1.html
│   ├── coordenadas-hijo2.html
│   ├── audio-hijo3.html
│   ├── retos-hijo4.html
│   ├── boton-casa-hijo5.html
│   └── chat-hijo6.html
│
├── js/                        # 20+ módulos JavaScript
│   ├── mensajeria.js          # ⭐ Sistema de comunicación
│   ├── state-manager.js       # Estado centralizado
│   ├── funciones-mapa.js      # GPS + MapLibre GL (mapa de aventura; Leaflet aparte solo en mapa-completo.html/video-intro.html)
│   ├── constants.js           # TIPOS_MENSAJE (70+ tipos)
│   ├── *-aventuras.js         # Datos de aventuras
│   └── ...
│
├── audios-aventuras/          # 12 idiomas × 7 aventuras
├── imagenes/                  # Assets visuales
├── videos-aventuras/          # Clips de tramos
│
├── docs/                      # ⭐ Documentación técnica
│   ├── README.md              # Índice de documentación
│   ├── GUIA-COMPLETA.md       # Guía maestra
│   └── ...
│
├── tests/                     # Suite de tests
│   ├── e2e/                   # Playwright
│   └── *.test.js              # Jest
│
├── sw.js                      # Service Worker PWA
├── manifest.json              # PWA manifest
└── package.json
```

---

## 🚀 Roadmap a producción

La lógica de la app no tiene bloqueos conocidos. Lo pendiente es infraestructura de despliegue:

- [ ] Configurar VPS (Contabo recomendado)
- [ ] HTTPS + DNS → valenciavguides.es
- [ ] CSP sin `unsafe-inline`
- [ ] Backend autenticado con JWT
- [ ] `PROTECT_DATA=true` en producción

**Ver [docs/GUIA-COMPLETA.md](docs/GUIA-COMPLETA.md) §22** para checklist completo de producción.

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm start                    # Arrancar servidor (alias de node js/server.js)
npm run dev                  # Watch mode con recarga automática

# Tests
npm test                     # Tests unitarios
npm run test:e2e             # Tests E2E (Playwright)
npm run test:all             # Suite completa
npm run test:coverage        # Cobertura de tests

# Análisis
npm run inventory            # Inventario de funciones
npm run inventory:dupes      # Funciones duplicadas
npm run inventory:file       # Inventario por archivo
npm run verificar-mensajeria # Validar tipos de mensaje

# Service Worker
npm run watch-sw             # Auto-versión cache en cambios

# Linting
npm run lint                 # ESLint
npm run lint:fix             # Auto-fix
```

---

## 📋 Checklist de Desarrollo

### Antes de crear una nueva feature:

1. ✅ Leer [docs/GUIA-COMPLETA.md](docs/GUIA-COMPLETA.md) §26 (Controladores)
2. ✅ Verificar que la función NO existe ya (`npm run inventory | grep nombre`)
3. ✅ Registrar controladores con `registrarControladorSeguro(..., { permanente: true })`
4. ✅ Usar constantes `TIPOS_MENSAJE.*` (nunca string literals)
5. ✅ Enviar mensajes con `enviarMensaje({ tipo, datos, destino })`
6. ✅ Documentar en `docs/GUIA-COMPLETA.md` si es arquitectónicamente significativo

### Antes de hacer commit:

1. ✅ `npm run lint` pasa sin errores
2. ✅ `npm test` pasa todos los tests
3. ✅ `npm run inventory:dupes` no muestra nuevos duplicados
4. ✅ Service Worker auto-versionado (si tocaste archivos cacheados)

---

## 🐛 Problemas conocidos

Sin bloqueos críticos conocidos actualmente. Ver **[docs/GUIA-COMPLETA.md](docs/GUIA-COMPLETA.md) §31** (posibles problemas) y **§36-37** (metodología de auditoría y mapa de conexiones) para el estado detallado.

---

## 📄 Licencia

[Por definir]

---

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-feature`)
3. Sigue checklist de desarrollo (arriba)
4. Commit con mensaje descriptivo
5. Push a la rama
6. Abre Pull Request

**Importante:** Todos los PRs deben pasar `npm run test:all` y `npm run lint`.

---

## 📞 Contacto

[Por definir]

---

**Última actualización:** 2026-09-02  
**Estado:** 🚧 EN DESARROLLO (NO producción)
