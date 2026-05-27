# 🧪 Sistema de Tests - ValenciaVGuides

## Resumen

Este directorio contiene la suite completa de tests para el proyecto ValenciaVGuides.

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Test Runner Centralizado (Recomendado)

1. Inicia el servidor local:
   ```bash
   node js/server.js
   ```

2. Abre en el navegador:
   ```
   http://localhost:8080/tests/test_runner.html
   ```

3. Usa los botones para:
   - **Ejecutar Todos**: Corre todos los tests secuencialmente
   - **Por categoría**: Ejecuta solo tests de una categoría
   - **Ver**: Abre un test individual en un modal

### Opción 2: Tests Individuales

Abre directamente cualquier archivo `test_*.html` en el navegador (requiere servidor local).

---

## 📋 Categorías de Tests

### 📬 Mensajería y Carga de Datos

| Test | Archivo | Descripción |
|------|---------|-------------|
| CARGAR_COORDENADAS | `test_cargar_coordenadas.html` | Verifica que hijo2 reciba y procese coordenadas |
| CARGAR_AUDIOS | `test_cargar_audios.html` | Verifica que hijo3 reciba y procese audios |
| CARGAR_RETOS | `test_cargar_retos.html` | Verifica que hijo4 reciba y procese retos |
| Distribución Audio | `test_audio_distribution.html` | Test completo de distribución de datos de audio |
| Distribuir Datos | `test_integracion_distribuir_datos.html` | Integración de distribución de datos a todos los hijos |

### 🔄 Comunicación Padre ↔ Hijos

| Test | Archivo | Descripción |
|------|---------|-------------|
| CAMBIO_PARADA | `test_cambio_parada.html` | Flujo completo: hijo5 → padre → hijos |
| RESPUESTA_DATOS_PARADAS | `test_respuesta_datos_paradas_hijo5.html` | Recepción de paradas en hijo5 |
| Handshake | `test_hijo_handshake.html` | HIJO_PREPARADO → PADRE_DATOS → HIJO_LISTO |
| SOLICITAR_RETO | `test_solicitar_reto_hijo4.html` | Solicitud y respuesta de retos |
| SOLICITAR_PARADAS | `test_datos_solicitar_paradas_combinados.html` | Datos combinados de paradas |

### 🗺️ Navegación y GPS

| Test | Archivo | Descripción |
|------|---------|-------------|
| GPS Restricción | `test_gps_activation_restriction.html` | GPS.ACTIVAR solo funciona en modo AVENTURA |
| GPS Fallback | `test_gps_fallback.html` | Fallback a P-0 cuando hay baja precisión |
| GPS Validación | `test_gps_message_validation.html` | Validación de mensajes GPS |
| Flujo Completo | `test_flujo_completo_aventura.html` | Ciclo completo: selección → aventura → cambio parada |

### ⚙️ Sistema

| Test | Archivo | Descripción |
|------|---------|-------------|
| Cambio Modo | `test_cambio_modo.html` | Cambio entre modo Casa y Aventura |
| Heartbeat | `test_heartbeat.html` | Sistema de heartbeat padre ↔ hijos |
| Controlador Fusionado | `test_controlador_fusionado.html` | Test de HIJO_LISTO fusionado |
| Carga Iframes | `test_carga_secuencial_iframes.html` | Carga secuencial de iframes |
| Mensajería Base | `test_mensajeria.html` | Carga del módulo de mensajería |
| Handlers No Throw | `test_message_handlers_no_throw.html` | Handlers toleran mensajes malformados |
| UI Visibility | `test_ui_visibility_handshake.html` | UI oculta antes del handshake |
| Índice Aventuras | `test_indice_aventuras.html` | Carga del índice de aventuras |
| Integración Completa | `test_integracion_completa.html` | Test integral del sistema |

---

## 📊 Herramientas de Análisis

| Archivo | Descripción |
|---------|-------------|
| `analyze_controllers.js` | Analiza controladores registrados vs constants.js |
| `analyze_controllers_report.json` | Último reporte del análisis |
| `verificar_controladores.py` | Verificación en Python de controladores |
| `flujo_bidireccional_exhaustivo.json` | Documentación del flujo de comunicación |

---

## 🔧 Estructura de un Test

Cada test sigue este patrón:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Test: [NOMBRE]</title>
    <script type="module">
        import { TIPOS_MENSAJE } from '../js/constants.js';
    </script>
</head>
<body>
    <h1>🧪 Test: [NOMBRE]</h1>
    <button onclick="runTest()">Ejecutar Test</button>
    <div id="results"></div>
    
    <iframe id="componente" src="../[archivo].html"></iframe>
    
    <script type="module">
        window.runTest = async function() {
            // 1. Esperar carga del iframe
            // 2. Enviar mensaje de prueba
            // 3. Verificar respuesta
            // 4. Mostrar resultados
        };
    </script>
</body>
</html>
```

---

## 📝 Notas Importantes

1. **Servidor Local Requerido**: Los tests usan ES modules y iframes, requieren servidor HTTP.

2. **Cross-Origin**: Algunos tests pueden fallar en verificaciones internas debido a restricciones de cross-origin, pero el comportamiento principal se puede verificar por mensajes.

3. **Orden de Ejecución**: Para tests de flujo completo, el orden de los pasos importa.

4. **Timeouts**: Los tests tienen timeouts de 5-30 segundos. Si un componente tarda más en cargar, el test puede fallar.

5. **Consola del Navegador**: Siempre revisa la consola del navegador para más detalles del comportamiento interno.

---

## 🆕 Tests Creados/Actualizados (Marzo 2026)

- `test_cargar_coordenadas.html` - Nuevo
- `test_cargar_audios.html` - Nuevo
- `test_cargar_retos.html` - Nuevo
- `test_cambio_parada.html` - Nuevo
- `test_respuesta_datos_paradas_hijo5.html` - Nuevo
- `test_flujo_completo_aventura.html` - Nuevo
- `test_heartbeat.html` - Nuevo
- `test_runner.html` - Nuevo (test runner centralizado)
- `test_audio_distribution.html` - Actualizado (rutas corregidas)
- `test_carga_secuencial_iframes.html` - Actualizado (rutas corregidas)
- `test_controlador_fusionado.html` - Actualizado (rutas corregidas)
