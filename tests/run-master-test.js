// Script temporal para correr master-test.html desde CLI con Playwright
const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.error('[browser]', msg.text());
    });

    await page.goto('http://localhost:8080/tests/master-test.html', { waitUntil: 'networkidle' });

    // Pinchar "Run All Tests"
    await page.click('#runAllBtn');

    // Esperar hasta que el botón vuelva a estar habilitado (suite completada)
    await page.waitForFunction(
        () => !document.getElementById('runAllBtn').disabled,
        null,
        { timeout: 600000 }
    );

    // Leer resumen
    const summary = await page.evaluate(() => ({
        total:   document.getElementById('totalCount').textContent,
        passed:  document.getElementById('passedCount').textContent,
        failed:  document.getElementById('failedCount').textContent,
        skipped: document.getElementById('skippedCount').textContent,
    }));

    // Leer log completo
    const logLines = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#logContainer .log-entry'))
            .map(el => el.textContent.trim())
    );

    // Leer filas de la tabla de tests
    const testRows = await page.evaluate(() => {
        const rows = [];
        document.querySelectorAll('.test-item').forEach(item => {
            const name   = item.querySelector('.test-name')?.textContent?.trim() || '';
            const status = item.querySelector('.test-status')?.textContent?.trim() || '';
            const time   = item.querySelector('.test-time')?.textContent?.trim() || '';
            rows.push({ name, status, time });
        });
        return rows;
    });

    await browser.close();

    // Mostrar resultados
    console.log('\n========== MASTER TEST RESULTS ==========');
    console.log(`Total: ${summary.total}  |  Passed: ${summary.passed}  |  Failed: ${summary.failed}  |  Skipped: ${summary.skipped}`);
    console.log('\n--- Tests ---');
    testRows.forEach(r => console.log(`  ${r.status.padEnd(8)} ${r.name}  ${r.time}`));
    console.log('\n--- Log ---');
    logLines.forEach(l => console.log(' ', l));
    console.log('==========================================\n');

    process.exit(parseInt(summary.failed) > 0 ? 1 : 0);
})();
