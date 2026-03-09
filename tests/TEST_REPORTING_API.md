# 📡 API de Reporte de Tests

## Cómo reportar resultados de tests al Master Test

Cada test HTML debe llamar a esta función para reportar su estado al `master-test.html`:

```javascript
// Reportar resultados al padre
window.parent.window.reportTestResult({
    name: 'Tu Test Name',
    passed: 3,        // Número de checks que pasaron
    failed: 0,        // Número de checks que fallaron
    warnings: 0       // Número de warnings/advertencias (opcional)
});
```

## Estados posibles

- **✅ PASSED**: `failed === 0` y `warnings === 0`
- **❌ FAILED**: `failed > 0`
- **⚠️ WARNING**: `failed === 0` pero `warnings > 0`

## Ejemplo de uso en tus tests HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Test</title>
</head>
<body>
    <h1>Test: Mi Funcionalidad</h1>
    <div id="results"></div>

    <script>
        // Tu código de test aquí
        let passed = 0;
        let failed = 0;
        let warnings = 0;

        // Test 1: Verificar algo
        if (condition1) {
            passed++;
        } else {
            failed++;
        }

        // Test 2: Verificar otro
        if (condition2) {
            passed++;
        } else {
            failed++;
        }

        // ... más tests ...

        // Al final, SIEMPRE reportar
        window.parent.window.reportTestResult({
            name: 'Mi Test',
            passed: passed,
            failed: failed,
            warnings: warnings
        });
    </script>
</body>
</html>
```

## Integración con tests existentes

Si tu test ya tiene su propio sistema de reporte (con contadores), simplemente:

1. Cuenta los ✅ (exitosos)
2. Cuenta los ❌ (fallidos)
3. Cuenta los ⚠️ (advertencias)
4. Llama a `window.parent.window.reportTestResult()` con esos números

## Ejemplos reales

### Test: test_cambio_parada.html
```javascript
// A final, después de completar todas las verificaciones:
window.parent.window.reportTestResult({
    name: 'Integration: Cambio de Parada',
    passed: 5,  // Si fueron 5 checks exitosos
    failed: 2,  // Si 2 fallaron
    warnings: 0
});
```

### Test: test_cargar_coordenadas.html
```javascript
// Si usas íconos/elementos, puedes contarlos:
const passedCount = document.querySelectorAll('✅').length;
const failedCount = document.querySelectorAll('❌').length;

window.parent.window.reportTestResult({
    name: 'Data: Cargar Coordenadas',
    passed: passedCount,
    failed: failedCount,
    warnings: 0
});
```

## Timeout

- Si un test NO llama a `reportTestResult()` en 15 segundos, el master-test lo marcará como **TIMEOUT (FAILED)**
- Asegúrate de llamar a esta función antes de que el timeout expire

## Testing sin master-test

Si ejecutas un test HTML directamente (sin master-test):
- La función `window.parent.window.reportTestResult()` simplemente se ignorará
- Tu test funcionará normalmente

---

**Próximos pasos:**
1. Abre `master-test.html`
2. Aprieta **"RUN ALL TESTS"**
3. Tus tests reportarán sus resultados en tiempo real
4. Verás un dashboard consolidado con todos los resultados
