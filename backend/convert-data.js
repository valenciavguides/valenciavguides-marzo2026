/**
 * Script para convertir los archivos JS de datos a JSON
 * Ejecutar con: node convert-data.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SOURCE_DIR = path.join(__dirname, '..', 'js');
const TARGET_DIR = path.join(__dirname, 'data');

// Asegurar que el directorio de datos existe
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

/**
 * Convierte un archivo JS con exports a JSON
 */
function convertJsToJson(sourceFile, targetFile, exportNames) {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    const targetPath = path.join(TARGET_DIR, targetFile);
    
    console.log(`Converting ${sourceFile} -> ${targetFile}...`);
    
    try {
        let content = fs.readFileSync(sourcePath, 'utf8');
        
        // Remover 'export const' y convertir a asignación global
        for (const exportName of exportNames) {
            content = content.replace(
                new RegExp(`export\\s+const\\s+${exportName}\\s*=`, 'g'),
                `this.${exportName} =`
            );
        }
        
        // Remover el bloque de compatibilidad CommonJS/browser al final
        content = content.replace(
            /\/\/\s*Para uso en entornos.*?window\.[A-Z_]+\s*=\s*[A-Z_]+;\s*\}/s,
            ''
        );
        content = content.replace(
            /if\s*\(\s*typeof\s+module\s*!==\s*['"]undefined['"]\s*&&\s*module\.exports\s*\)\s*\{[\s\S]*?\}\s*else\s*\{[\s\S]*?\}/g,
            ''
        );
        
        // Crear un contexto sandbox con mocks para window y module
        const sandbox = {
            module: { exports: {} },
            window: {}
        };
        
        // Ejecutar el código en el sandbox
        vm.runInNewContext(content, sandbox);
        
        // Extraer los exports
        const result = {};
        for (const exportName of exportNames) {
            if (sandbox[exportName] !== undefined) {
                result[exportName] = sandbox[exportName];
            }
        }
        
        // Escribir JSON
        fs.writeFileSync(targetPath, JSON.stringify(result, null, 2), 'utf8');
        console.log(`  ✓ Created ${targetFile}`);
        return true;
    } catch (error) {
        console.error(`  ✗ Error converting ${sourceFile}:`, error.message);
        return false;
    }
}

// Lista de conversiones a realizar
const conversions = [
    {
        source: 'indice-aventuras.js',
        target: 'indice-aventuras.json',
        exports: ['MAPEO_IDIOMAS', 'INDICE_AVENTURAS']
    },
    {
        source: 'coordenadas-aventuras.js',
        target: 'coordenadas-aventuras.json',
        exports: ['DATOS_AVENTURAS']
    },
    {
        source: 'audios-aventuras.js',
        target: 'audios-aventuras.json',
        exports: ['AUDIOS_AVENTURAS']
    },
    {
        source: 'retos-aventuras.js',
        target: 'retos-aventuras.json',
        exports: ['RETOS_AVENTURAS']
    },
    {
        source: 'puzzles-aventuras.js',
        target: 'puzzles-aventuras.json',
        exports: ['PUZZLES_AVENTURAS']
    }
];

console.log('═══════════════════════════════════════════════════════');
console.log('  Valencia VGuides - Data Converter JS -> JSON');
console.log('═══════════════════════════════════════════════════════');
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Target: ${TARGET_DIR}`);
console.log('');

let success = 0;
let failed = 0;

for (const conv of conversions) {
    if (convertJsToJson(conv.source, conv.target, conv.exports)) {
        success++;
    } else {
        failed++;
    }
}

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Completed: ${success} successful, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════');
