# Valencia VGuides - Backend API

Backend REST API para la aplicación de guías turísticas Valencia VGuides.

## Arquitectura

```
backend/
├── server.js           # Servidor Express principal
├── package.json        # Dependencias
├── jest.config.js      # Configuración de tests
├── convert-data.js     # Script de conversión JS → JSON
├── data/               # Datos JSON
│   ├── aventuras.json
│   ├── coordenadas.json
│   ├── audios.json
│   ├── retos.json
│   └── puzzles.json
├── routes/             # Endpoints API
│   ├── health.js       # Estado del servidor
│   ├── aventuras.js    # Aventuras disponibles
│   ├── coordenadas.js  # Coordenadas y rutas
│   ├── audios.js       # Archivos de audio
│   ├── retos.js        # Retos con validación
│   └── puzzles.js      # Puzzles
├── middleware/         # Middlewares
│   ├── validation.js   # Validación de parámetros
│   └── errorHandler.js # Manejo de errores
├── services/           # Lógica de negocio
│   └── dataService.js  # Acceso a datos
├── utils/              # Utilidades
│   └── ApiError.js     # Clase de error personalizada
└── tests/              # Tests Jest
    ├── health.test.js
    ├── aventuras.test.js
    ├── coordenadas.test.js
    ├── audios.test.js
    ├── retos.test.js
    ├── puzzles.test.js
    └── errors.test.js
```

## Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Validación de origen con whitelist
- **Rate Limiting**: 100 peticiones/15 min por IP
- **Validación de entrada**: Todos los parámetros validados
- **Respuestas ocultan secretos**: Las respuestas correctas de retos no se envían al cliente

## Endpoints API

### Health
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor y lista de endpoints |
| GET | `/api/health/ping` | Ping simple |

### Aventuras
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/aventuras` | Lista de aventuras disponibles |
| GET | `/api/aventuras/:id` | Detalles de una aventura |
| GET | `/api/aventuras/:id/completa` | Datos completos (coordenadas, audios, retos) |

### Coordenadas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/coordenadas/:aventuraId` | Todas las coordenadas |
| GET | `/api/coordenadas/:aventuraId/parada/:paradaId` | Una parada |
| GET | `/api/coordenadas/:aventuraId/tramo/:tramoId` | Un tramo |
| GET | `/api/coordenadas/:aventuraId/ruta/:desde/:hasta` | Ruta entre puntos |

### Audios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/audios/:aventuraId/:idioma` | Audios por aventura e idioma |
| GET | `/api/audios/:aventuraId/:idioma/parada/:paradaId` | Audio de una parada |

### Retos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/retos/:aventuraId/:idioma` | Retos (sin respuestas) |
| GET | `/api/retos/:aventuraId/:idioma/:retoId` | Un reto específico |
| POST | `/api/retos/:aventuraId/:idioma/:retoId/validar` | Validar respuesta |

### Puzzles
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/puzzles/:aventuraId` | Puzzles de una aventura |
| GET | `/api/puzzles/:aventuraId/:puzzleId` | Un puzzle específico |

## Instalación

```bash
cd backend
npm install
```

## Uso

### Desarrollo
```bash
npm start        # Puerto por defecto: 3001
```

### Tests
```bash
npm test         # Ejecuta tests con cobertura
```

## Respuestas de Error

Todas las respuestas de error tienen formato consistente:

```json
{
  "error": {
    "message": "Descripción del error",
    "code": "CODIGO_ERROR",
    "statusCode": 404
  }
}
```

### Códigos de Error
| Código | Descripción |
|--------|-------------|
| `NOT_FOUND` | Recurso no encontrado |
| `BAD_REQUEST` | Parámetros inválidos |
| `FORBIDDEN` | Acceso no permitido |
| `INTERNAL_ERROR` | Error interno del servidor |
| `INVALID_AVENTURA_ID` | Formato de ID de aventura inválido |
| `INVALID_IDIOMA` | Idioma no soportado |
| `INVALID_STOP_ID` | Formato de ID de parada inválido |

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | 3001 | Puerto del servidor |
| `NODE_ENV` | development | Entorno de ejecución |
| `CORS_ORIGINS` | localhost:* | Orígenes permitidos (separados por coma) |

## Tests

61 tests organizados en 7 suites:
- **health.test.js** - Estado y ping
- **aventuras.test.js** - CRUD de aventuras
- **coordenadas.test.js** - Coordenadas, paradas, tramos, rutas
- **audios.test.js** - Audios por idioma y parada
- **retos.test.js** - Retos y validación de respuestas
- **puzzles.test.js** - Puzzles
- **errors.test.js** - Manejo de errores y validación

Cobertura actual: **87%**

## Cliente Frontend

El cliente API está en `js/api-client.js`:

```javascript
// Ejemplo de uso
const aventuras = await ApiClient.getAventuras();
const completa = await ApiClient.getAventuraCompleta('Aventura1', 'es');
const valido = await ApiClient.validarReto('Aventura1', 'es', 1, 'mi_respuesta');
```

El manejador de errores UI está en `js/error-handler-ui.js`:

```javascript
// Los errores se muestran automáticamente como toasts o modales
ApiClient.getAventuras().catch(ErrorUI.showToast);
```
