// playwright.config.js — Configuración E2E para Valencia VGuides
// Ver prerequisitos detallados en docs/DEUDA-TECNICA-PRODUCCION.md (DT-1 Opción B)
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',

  // 60 s por test: FASE 1 carga 11 módulos + CDN; en emulación móvil puede ser más lento
  timeout: 60_000,
  expect: { timeout: 15_000 },

  // Los tests de iframe/postMessage no son seguros en paralelo dentro del mismo proceso
  fullyParallel: false,
  workers: 1,

  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['html', { outputFolder: 'tests/e2e/report', open: 'never' }],
    ['json', { outputFile: 'tests/e2e/playwright-report.json' }],
    ['line'],
  ],

  // Servidor estático local — sirve el proyecto completo desde la raíz
  webServer: {
    command: 'node js/server.js',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    // ── Desktop ────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // ── Móvil emulado ──────────────────────────────────────────────
    // DT-1 criterio: pasar en Pixel 5 (Android) e iPhone 12 (iOS)
    {
      name: 'pixel5',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'iphone12',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
