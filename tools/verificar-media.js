#!/usr/bin/env node
/**
 * verificar-media.js — Comprueba que las imágenes/audios/vídeos del proyecto
 * cumplen los límites de tamaño documentados en docs/GUIA-COMPLETA.md §15
 * (vídeo) y §12 (audio), en vez de depender solo de recordar seguir la
 * checklist a mano antes de cada commit de contenido nuevo.
 *
 * Uso:
 *   node tools/verificar-media.js            → informe completo
 *   node tools/verificar-media.js --quiet    → solo lo que excede el límite (para CI)
 *
 * Qué hace:
 *   1. Recorre las carpetas de contenido de pago (imágenes de aventuras,
 *      mapas vintage, audios, vídeos) y compara cada archivo contra un
 *      límite de tamaño de referencia.
 *   2. Si `ffmpeg`/`ffprobe` están disponibles en PATH, hace además una
 *      comprobación más precisa: bitrate real de audio, y perfil H.264 +
 *      fotogramas de referencia de vídeo (ver §15 — perfil High o >2 refs
 *      se marca como riesgo de decodificación en móvil aunque el archivo
 *      sea pequeño). Si no están disponibles, se omite esta parte con un
 *      aviso — el chequeo de tamaño de archivo sigue funcionando igual.
 *
 * Los límites son deliberadamente generosos (para no generar ruido con
 * archivos que están bien) — el objetivo es pillar el caso claro de "esto
 * se subió sin pasar por la checklist", no perseguir cada KB.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const quiet = process.argv.includes('--quiet');

// Límites de referencia — ver docs/GUIA-COMPLETA.md §12 (audio) y §15 (vídeo)
const LIMITES = {
    imagen: { bytes: 1.5 * 1024 * 1024, label: '1,5 MB' },
    audio: { bytes: 8 * 1024 * 1024, label: '8 MB' }, // ~8min a 128kbps, referencia laxa sin ffprobe
    video: { bytes: 12 * 1024 * 1024, label: '12 MB' },
};

const EXT_IMAGEN = ['.jpg', '.jpeg', '.jfif', '.png', '.webp'];

/**
 * Descubre las carpetas de imágenes en vez de mantener una lista fija: `imagenes/` gana
 * subcarpetas cada vez que se añade contenido (idiomas, tandas nuevas), y una lista escrita
 * a mano deja de cubrirlas en silencio — el informe sigue saliendo, pero sin mirarlas, que
 * es peor que no tener herramienta porque parece que sí las ha revisado.
 * @returns {Array<{dir: string, tipo: string, ext: string[]}>}
 */
function carpetasDeImagenes() {
    const base = path.join(ROOT, 'imagenes');
    if (!fs.existsSync(base)) return [];
    return fs.readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => ({ dir: `imagenes/${d.name}`, tipo: 'imagen', ext: EXT_IMAGEN }));
}

const CARPETAS = [
    ...carpetasDeImagenes(),
    { dir: 'audios-aventuras', tipo: 'audio', ext: ['.mp3', '.wav', '.m4a'] },
    { dir: 'videos-aventuras', tipo: 'video', ext: ['.mp4', '.webm', '.mov'] },
];

function tieneFfmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (_e) {
        return false;
    }
}

function listarArchivos(dirAbs, extensiones) {
    if (!fs.existsSync(dirAbs)) return [];
    let resultado = [];
    for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true })) {
        const full = path.join(dirAbs, entry.name);
        if (entry.isDirectory()) {
            resultado = resultado.concat(listarArchivos(full, extensiones));
        } else if (extensiones.includes(path.extname(entry.name).toLowerCase())) {
            resultado.push(full);
        }
    }
    return resultado;
}

function mb(bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
}

// Usa `ffmpeg -i` (parseando stderr) en vez de `ffprobe` porque el paquete
// ffmpeg-static solo trae el binario de ffmpeg, no ffprobe por separado —
// así el chequeo funciona con cualquier instalación que solo tenga ffmpeg.
function inspeccionarConFfmpeg(fileAbs, tipo) {
    try {
        const out = execSync(`ffmpeg -i "${fileAbs}" -c copy -bsf:v trace_headers -f null - 2>&1`, { encoding: 'utf8' });
        if (tipo === 'audio') {
            const bitrateMatch = out.match(/bitrate:\s*(\d+)\s*kb\/s/);
            const kbps = bitrateMatch ? Number(bitrateMatch[1]) : null;
            if (kbps && kbps > 160) return `bitrate real ${kbps}kbps (>160kbps es alto para narración con música de fondo, ver §12)`;
        } else if (tipo === 'video') {
            const profileMatch = out.match(/profile_idc\s+\d+\s*=\s*(\d+)/);
            const refsMatch = out.match(/max_num_ref_frames\s+\d+\s*=\s*(\d+)/);
            const avisos = [];
            if (profileMatch && Number(profileMatch[1]) === 100) avisos.push('perfil High (usar Main, ver §15)');
            if (refsMatch && Number(refsMatch[1]) > 2) avisos.push(`${refsMatch[1]} fotogramas de referencia (usar 1-2, ver §15)`);
            if (avisos.length) return avisos.join('; ');
        }
    } catch (_e) {
        return null; // no bloquear el informe si ffmpeg falla sobre un archivo concreto
    }
    return null;
}

function main() {
    const ffmpegDisponible = tieneFfmpeg();
    const hallazgos = [];
    let totalArchivos = 0;
    let totalBytes = 0;

    for (const carpeta of CARPETAS) {
        const dirAbs = path.join(ROOT, carpeta.dir);
        const archivos = listarArchivos(dirAbs, carpeta.ext);
        const limite = LIMITES[carpeta.tipo];

        for (const fileAbs of archivos) {
            const stat = fs.statSync(fileAbs);
            totalArchivos++;
            totalBytes += stat.size;
            const rel = path.relative(ROOT, fileAbs);

            if (stat.size > limite.bytes) {
                hallazgos.push({ rel, tipo: carpeta.tipo, motivo: `${mb(stat.size)} MB (límite de referencia: ${limite.label})` });
                continue; // ya está marcado por tamaño, no hace falta el detalle de ffprobe también
            }

            if (ffmpegDisponible) {
                const detalle = inspeccionarConFfmpeg(fileAbs, carpeta.tipo);
                if (detalle) hallazgos.push({ rel, tipo: carpeta.tipo, motivo: detalle });
            }
        }
    }

    if (!quiet) {
        console.log(`Archivos de media analizados: ${totalArchivos} (${mb(totalBytes)} MB en total)`);
        console.log(`ffmpeg/ffprobe disponible: ${ffmpegDisponible ? 'sí (comprobación de bitrate/perfil activa)' : 'no (solo comprobación de tamaño de archivo)'}`);
        console.log('');
    }

    if (hallazgos.length === 0) {
        if (!quiet) console.log('✅ Sin hallazgos — todos los archivos dentro de los límites de referencia.');
        process.exit(0);
    }

    console.log(`⚠️  ${hallazgos.length} archivo(s) fuera de los límites de referencia:\n`);
    for (const h of hallazgos) {
        console.log(`  [${h.tipo}] ${h.rel}`);
        console.log(`      → ${h.motivo}`);
    }
    console.log('\nEsto no bloquea nada automáticamente — revisar si el archivo pasó por la checklist de codificación (GUIA-COMPLETA.md §12/§15) antes de darlo por bueno.');
}

main();
