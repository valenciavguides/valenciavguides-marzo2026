import { registrarMetrica, getEstadoMonitoreo, inicializarMonitoreo } from '../js/monitoreo.js';

const results = [];

globalThis.runTest = function() {
  // Test 1: registrarMetrica es una función exportada
  if (typeof registrarMetrica === 'function') {
    results.push('OK: registrarMetrica es una función');
  } else {
    results.push('FAIL: registrarMetrica no es una función');
  }

  // Test 2: getEstadoMonitoreo es una función exportada
  if (typeof getEstadoMonitoreo === 'function') {
    results.push('OK: getEstadoMonitoreo es una función');
  } else {
    results.push('FAIL: getEstadoMonitoreo no es una función');
  }

  // Test 3: getEstadoMonitoreo devuelve un objeto con las propiedades esperadas
  try {
    const estado = getEstadoMonitoreo();
    if (estado && typeof estado === 'object' && 'metricas' in estado) {
      results.push('OK: getEstadoMonitoreo devuelve objeto con metricas');
    } else {
      results.push('FAIL: getEstadoMonitoreo no devuelve estructura esperada');
    }
  } catch (e) {
    results.push(`FAIL: getEstadoMonitoreo lanzó: ${e.message}`);
  }

  // Test 4: registrarMetrica ejecuta sin excepciones
  try {
    registrarMetrica('mensaje_enviado', 1, {});
    results.push('OK: registrarMetrica ejecuta sin excepción');
  } catch (e) {
    results.push(`FAIL: registrarMetrica lanzó: ${e.message}`);
  }

  // Test 5: inicializarMonitoreo es una función exportada
  if (typeof inicializarMonitoreo === 'function') {
    results.push('OK: inicializarMonitoreo es una función');
  } else {
    results.push('FAIL: inicializarMonitoreo no es una función');
  }

  const out = document.getElementById('results');
  out.innerHTML = '<pre>' + results.join('\n') + '</pre>';

  const passedCount = results.filter(r => r.startsWith('OK:')).length;
  const failedCount = results.filter(r => r.startsWith('FAIL:')).length;
  globalThis.TestReporter.report({
    name: 'Monitoreo: registrarMetrica',
    passed: passedCount,
    failed: failedCount
  });
};
