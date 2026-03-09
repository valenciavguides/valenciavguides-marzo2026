# MEGA BATCH UPDATE SCRIPT - Final 9 Simple Tests

All these tests have similar patterns:
- Have buttons with onclick handlers (testFusionControlador(), etc.)
- Have <div id="results"></div>
- Need <script src="test-reporter-utility.js"></script> added
- Need window.runTest() wrapper function added

Tests to update in final batch:
1. test_controlador_fusionado.html - has testFusionControlador()
2. test_ejecutarValidacion.html - has some runXxx()
3. test_audio_distribution.html - need to check
4. test_verificacion_eventos_duplicados.html - module script
5. test_verificacion_final_correcciones.html - module script  
6. test_ui_visibility_handshake.html - doctype IIFE
7. test_solicitar_reto_hijo4.html - doctype IIFE
8. test_gps_message_validation.html - doctype
9. test_runner.html - Legacy (can skip)

Special cases (external JS):
- test_registrarMetrica.html - loads test_registrarMetrica.js
- test_prewarm_lifecycle.html - loads test_prewarm_lifecycle.js  
- test_gps_fallback.html - loads test_gps_fallback.js

Strategy: Update 9 simple ones now, then handle external .js files if needed.
