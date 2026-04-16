# Deuda técnica: securización pre-deploy producción

> **Estado:** Decisiones CONSCIENTES — NO son bugs olvidados  
> **Acción:** Cerrar TODAS antes del despliegue a producción

---

## 5 puntos pendientes (bloque único)

### 1. Path Traversal — `js/server.js:71`

```javascript
// ACTUAL (vulnerable):
let filePath = '.' + req.url;  // Sin sanitizar
```

- En desarrollo se usa este servidor estático local desde VS Code
- En producción se usará Nginx / GitHub Pages → no aplica
- **Si se mantiene server.js en producción:** añadir `path.resolve()` + validar contra directorio raíz:

```javascript
const safePath = path.resolve('.', req.url);
if (!safePath.startsWith(path.resolve('.'))) {
    res.writeHead(403);
    return res.end('Forbidden');
}
```

---

### 2. postMessage wildcard — `js/mensajeria.js:439`

```javascript
// ACTUAL (inseguro):
ventanaPadre.postMessage(mensaje, '*');   // línea 439
targetWindow.postMessage(mensaje, '*');   // línea 451
destino.postMessage(mensaje, '*');        // línea 460
window.postMessage(mensaje, '*');         // línea 478
destino.postMessage(confirmacion, '*');   // línea 596
```

- **Para producción:** cambiar todas las `'*'` → `window.location.origin`

---

### 3. JWT almacena código en Base64 — `backend/routes/auth.js:170`

```javascript
// ACTUAL (reversible):
codigoHash: Buffer.from(codigoLimpio).toString('base64')
```

- Base64 es codificación, no hashing — el código de activación queda expuesto en cada JWT
- **Para producción:**

```javascript
const crypto = require('crypto');
codigoHash: crypto.createHash('sha256').update(codigoLimpio).digest('hex')
```

---

### 4. JWT Secret débil — `backend/routes/auth.js:18`

```javascript
// ACTUAL (inseguro en producción):
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-no-usar-en-produccion';
```

- **Para producción:** configurar variable de entorno `JWT_SECRET` con un secreto real (32+ caracteres aleatorios)
- ✅ **Validación de arranque ya implementada** en `backend/server.js`: si `NODE_ENV=production` y el secreto es el de desarrollo, el servidor no arranca (`process.exit(1)`)

---

### 5. Auth bypass — `backend/middleware/auth.js:36`

```javascript
// ACTUAL (sin autenticación):
if (!AUTH_ENABLED) {
    req.usuario = { modo: 'desarrollo', autenticado: false };
    return next();  // Todas las requests pasan sin token
}
```

- **Para producción:** `AUTH_ENABLED=true`
- ✅ **Validación de arranque ya implementada** en `backend/server.js`: si `NODE_ENV=production` y `AUTH_ENABLED` no es `true`, el servidor no arranca (`process.exit(1)`)

---

## Checklist pre-deploy

- [ ] 1. Sanitizar paths en `js/server.js` (o confirmar que no se usa en producción)
- [ ] 2. Cambiar `'*'` → `window.location.origin` en `js/mensajeria.js`
- [ ] 3. Cambiar Base64 → SHA256 en `backend/routes/auth.js`
- [ ] 4. Configurar `JWT_SECRET` real en `.env` (la validación de arranque ya bloquea si falta)
- [ ] 5. Activar `AUTH_ENABLED=true` en `.env` (la validación de arranque ya bloquea si falta)
- [ ] 6. Configurar `NODE_ENV=production` en el entorno de despliegue
- [ ] 7. Verificar que `PROTECT_DATA=true` en el servidor estático

---

## Correcciones ya aplicadas

| # | Problema | Archivo | Fix aplicado |
| --- | --- | --- | --- |
| 1 | CORS acepta requests sin Origin | `backend/server.js:62` | Rechaza en producción |
| 2 | Parada 6 sin campo `id` ni `tipo` | `js/coordenadas-aventuras.js:147` | Añadido `id: "P-6"`, `tipo: "parada"` |
| 3 | TTL Logger invertidos (móvil/desktop) | `js/constants.js:51` | Móvil 60s, Desktop 300s |
| 4 | Memory leak event listeners | `js/funciones-mapa.js:536` | `removeEventListener` en `limpiarRecursos()` |
| 5 | `DATA_MODE` hardcodeado a `'local'` | `js/data-loader.js:24` | Auto-detección por hostname |
| 6 | DataService falla silenciosamente | `backend/services/dataService.js:43` | `throw` en producción |
| 7 | `CACHE_VERSION` manual en SW | `sw.js:12` | Hash automático del APP_SHELL |
| 8 | JSON body limit 10MB excesivo | `backend/server.js:157` | Reducido a 100KB |
| 9 | CORS permite PUT/DELETE sin usarlos | `backend/server.js:88` | Solo GET, POST, OPTIONS |
| 10 | No existía `.gitignore` — `.env` y logs podían llegar al repo | raíz del proyecto | Creado `.gitignore` con `.env`, `certs/`, `logs/`, `node_modules/` |
| 11 | `JWT_SECRET` exportado en `module.exports` | `backend/middleware/auth.js:103` | Eliminado del objeto exportado |
| 12 | Servidor arrancaba en producción con secreto débil o sin auth | `backend/server.js` | `process.exit(1)` si `JWT_SECRET` es el de desarrollo o `AUTH_ENABLED` no es `true` |
