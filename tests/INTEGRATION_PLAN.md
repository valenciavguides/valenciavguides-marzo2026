# Integration Plan - 20 Remaining Tests

## Already Done (17) ✅
- test_cambio_parada.html
- test_cargar_coordenadas.html
- test_cargar_audios.html
- test_cargar_retos.html
- test_flujo_completo_aventura.html
- test_respuesta_datos_paradas_hijo5.html
- test_heartbeat.html
- test_sincronizacion_confirmaciones.html
- test_cambio_modo.html
- test_integracion_distribuir_datos.html
- test_integracion_completa.html
- test_datos_solicitar_paradas_combinados.html
- test_fix_retos.html
- test_fix_enviarMensaje_S1.html
- test_fix_coordenadas_paradas.html
- test_fix_audio_files.html
- test_basic.html

---

## Pattern 1: Type="module" with addTestResult() function (5 tests)
These have `<script type="module">`, own `addTestResult()`, button onclick handlers
**Action**: Add utility import + wrap existing runTest in window.runTest()

1. test_indice_aventuras.html - Has runIndiceTest(), uses addTestResult()
2. test_auditoria_completa.html - Similar structure
3. test_mensaje_handlers_no_throw.html - TBD structure
4. test_verificacion_eventos_duplicados.html - TBD structure
5. test_verificacion_final_correcciones.html - TBD structure

---

## Pattern 2: IIFE (Immediately Invoked Function Expression) (4 tests)
These wrap test code in (async function(){...})(), auto-run
**Action**: Add utility import + expose runTest() at end

1. test_hijo_handshake.html - IIFE with append(), status div
2. test_gps_activation_restriction.html - IIFE, minimal
3. test_ui_visibility_handshake.html - TBD
4. test_registrarMetrica.html - TBD

---

## Pattern 3: Simple inline script (4 tests)
These have simple inline scripts, basic structure
**Action**: Add utility import + create runTest()

1. test_phone_detection.html - TBD
2. test_prewarm_lifecycle.html - TBD
3. test_carga_secuencial_iframes.html - TBD
4. test_controlador_fusionado.html - TBD

---

## Pattern 4: External JS file (2 tests)
These load external .js files for test logic
**Action**: Add utility import to HTML, update .js file to export runTest()

1. test_gps_fallback.html - Loads test_gps_fallback.js
2. test_gps_message_validation.html - Likely external JS too

---

## Pattern 5: Full legacy runner (1 test)
This is the old test runner system
**Action**: Skip or create minimal wrapper

1. test_runner.html - Legacy test aggregator (can skip)

---

## Pattern 6: Special case - module imports (TBD)
test_mensajeria.html - Uses module imports, unique structure

---

## Execution Order (Systematic)

### Phase 1: Read and categorize (5 min)
- [ ] Confirm exact pattern for each test
- [ ] Note any special cases

### Phase 2: Update Pattern 1 - modules (5 tests) (5 min)
- [ ] test_indice_aventuras.html
- [ ] test_auditoria_completa.html
- Others as identified

### Phase 3: Update Pattern 2 - IIFE (4 tests) (4 min)
- [ ] test_hijo_handshake.html
- [ ] test_gps_activation_restriction.html
- Others

### Phase 4: Update Pattern 3 - simple (4 tests) (4 min)
- [ ] All simple scripts

### Phase 5: Update Pattern 4 - external JS (2 tests) (3 min)
- [ ] test_gps_fallback.html + .js file
- [ ] test_gps_message_validation.html

### Phase 6: Handle special cases (2-3 min)
- [ ] test_mensajeria.html
- [ ] test_runner.html (decision)

### Phase 7: Final verification (2 min)
- [ ] Spot check all 20 for syntax
- [ ] Confirm all have utility import
- [ ] Confirm all have window.runTest()

**Total time estimate: ~25 minutes**

---

## What Each Update Needs

### Minimal for most
```html
<!-- Add in head -->
<script src="test-reporter-utility.js"></script>

<!-- Wrap existing test call -->
<script>
window.runTest = function() {
  existingTestFunction();
  window.TestReporter.report({
    name: 'Category: Test Name',
    resultsContainer: document.getElementById('results')
  });
};
</script>
```

For IIFE, need to expose the variables/status outside the function.

For external JS, need window.runTest export in the .js file.
