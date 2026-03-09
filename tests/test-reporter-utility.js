/**
 * Test Result Reporter Utility
 * Función global para reportar resultados de tests al master-test.html
 */

window.TestReporter = {
    /**
     * Reporta los resultados del test al master-test.html
     * @param {Object} config - Configuración del reporte
     * @param {string} config.name - Nombre del test
     * @param {HTMLElement} config.resultsContainer - Elemento que contiene los resultados (opcional)
     * @param {number} config.passed - Número de checks pasados (opcional si se proporciona resultsContainer)
     * @param {number} config.failed - Número de checks fallidos (opcional si se proporciona resultsContainer)
     * @param {number} config.warnings - Número de advertencias (opcional)
     * @param {Function} config.customCounter - Función personalizada para contar resultados (opcional)
     */
    report: function(config) {
        let passed = config.passed || 0;
        let failed = config.failed || 0;
        let warnings = config.warnings || 0;

        // Si se proporciona un contenedor, contar automáticamente
        if (config.resultsContainer) {
            let passedElements = config.resultsContainer.querySelectorAll('.pass');
            let failedElements = config.resultsContainer.querySelectorAll('.fail');
            let warningElements = config.resultsContainer.querySelectorAll('.warning');
            
            // Si no hay .pass/.fail, buscar .success/.error
            if (passedElements.length === 0 && failedElements.length === 0) {
                passedElements = config.resultsContainer.querySelectorAll('.success');
                failedElements = config.resultsContainer.querySelectorAll('.error');
            }
            
            passed = passedElements.length;
            failed = failedElements.length;
            warnings = warningElements.length;
        }

        // Si se proporciona función personalizada, usarla
        if (config.customCounter && typeof config.customCounter === 'function') {
            const counts = config.customCounter();
            passed = counts.passed || passed;
            failed = counts.failed || failed;
            warnings = counts.warnings || warnings;
        }

        // Reportar al master-test
        if (window.parent && window.parent !== window) {
            try {
                window.parent.window.reportTestResult({
                    name: config.name,
                    passed: passed,
                    failed: failed,
                    warnings: warnings
                });
                console.log(`✅ Test "${config.name}" reported: ${passed}✓ ${failed}✗ ${warnings}⚠`);
            } catch (e) {
                console.warn(`⚠️ Could not report to master-test:`, e.message);
            }
        } else {
            console.log(`ℹ️ Test "${config.name}" not in iframe: ${passed}✓ ${failed}✗ ${warnings}⚠`);
        }
    }
};

// Alias corto para mayor conveniencia
window.reportTest = window.TestReporter.report;
