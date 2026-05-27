const fs = require('fs');

// ── textos-aventuras.js ──────────────────────────────────────────────────────
// Añadir 205 solo en Av1-5 (líneas antes de la sección Aventura34km, línea 12825)
{
    const file = 'js/textos-aventuras.js';
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const AV34KM_START = 12825; // línea 1-based donde empieza Aventura34km

    let changed = 0;
    const OLD = '200, 201, 202, 203, 204, 207,';
    const NEW = '200, 201, 202, 203, 204, 205, 207,';

    for (let i = 0; i < lines.length; i++) {
        const lineNum = i + 1;
        if (lineNum >= AV34KM_START) continue; // no tocar Av34km
        if (lines[i].includes(OLD)) {
            lines[i] = lines[i].replace(OLD, NEW);
            changed++;
        }
    }

    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log(`textos-aventuras.js: ${changed} comentarios actualizados`);
}

// ── audios-aventuras.js ──────────────────────────────────────────────────────
// Todos los Parada 00 son de Av1-5, se pueden cambiar todos.
// Además corregir 215-218 → 215 (los párrafos 216-218 no existen).
{
    const file = 'js/audios-aventuras.js';
    let content = fs.readFileSync(file, 'utf8');

    // 1. Añadir 205
    const OLD1 = '200, 201, 202, 203, 204, 207,';
    const NEW1 = '200, 201, 202, 203, 204, 205, 207,';
    const count1 = (content.split(OLD1).length - 1);
    content = content.replaceAll(OLD1, NEW1);

    // 2. Corregir 215-218 → 215
    const OLD2 = '215-218,';
    const NEW2 = '215,';
    const count2 = (content.split(OLD2).length - 1);
    content = content.replaceAll(OLD2, NEW2);

    fs.writeFileSync(file, content, 'utf8');
    console.log(`audios-aventuras.js: ${count1} comentarios con 205 añadido, ${count2} ocurrencias de "215-218" corregidas a "215"`);
}
