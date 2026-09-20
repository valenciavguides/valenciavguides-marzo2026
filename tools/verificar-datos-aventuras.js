#!/usr/bin/env node
/**
 * verificar-datos-aventuras.js — integridad de los datos de las 7 aventuras.
 *
 * POR QUÉ EXISTE
 *
 * Estas comprobaciones vivían repartidas en seis páginas HTML de `tests/` que había que
 * abrir a mano en un navegador: `test_data_integrity`, `test_indice_aventuras`,
 * `test_module_exports`, `test_video_aventuras`, `test_integracion_completa` y
 * `test_cargar_textos`. No las ejecutaba nada —ni npm, ni Playwright, ni un hook—, así que
 * podían llevar meses en rojo sin que nadie lo supiera. Y ningún spec E2E cubre esto: los
 * specs prueban comportamiento, no la forma de los datos.
 *
 * Al traerlas aquí se amplían: varias miraban solo `Aventura1/es` (los audios y los retos),
 * y aquí se miran las 7 aventuras y todos sus idiomas.
 *
 * Es de datos puros: no necesita navegador. Por eso es un script de `tools/`, como sus
 * hermanos `verificar-totales-indice` y `verificar-mensajeria`, y no un spec.
 *
 * QUÉ COMPRUEBA
 *
 *   1. Los cinco módulos de datos exportan lo que dicen exportar
 *   2. Ningún campo `video` apunta a una imagen, y todos acaban en .mp4
 *   3. Cada vídeo está en la carpeta de SU aventura, y ninguno usa el prefijo antiguo
 *   4. `imagen`, `imagen2` e `imagen3` tienen extensión de imagen
 *   5. No hay ids repetidos dentro de una aventura
 *   6. Toda coordenada cae en un rango lat/lng válido
 *   7. Ningún audio ni reto tiene id vacío, en ninguna aventura ni idioma
 *   8. Los retos tienen pregunta y opciones
 *   9. Lo que el índice marca como disponible existe de verdad en los datos
 *
 * Lo que NO comprueba: que los ficheros de audio/vídeo/imagen existan en disco. Eso es
 * `npm run verificar-media`, y el usuario los está preparando.
 *
 * Uso:
 *   npm run verificar-datos            informe completo
 *   npm run verificar-datos -- --quiet  solo los fallos; sale con 1 si hay alguno
 */
'use strict';

const path = require('node:path');
const { pathToFileURL } = require('node:url');

const RAIZ = path.resolve(__dirname, '..');
const quiet = process.argv.includes('--quiet');

const CARPETA_VIDEO = {
    Aventura1: 'videos-aventuras/av1/',
    Aventura2: 'videos-aventuras/av2/',
    Aventura3: 'videos-aventuras/av3/',
    Aventura4: 'videos-aventuras/av4/',
    Aventura5: 'videos-aventuras/av5/',
    AventuraFallas: 'videos-aventuras/avfallas/',
    Aventura34km: 'videos-aventuras/Av34km/',
};

const EXT_IMAGEN = /\.(jpe?g|png|webp|gif|avif)$/i;
const EXT_VIDEO = /\.mp4$/i;

const fallos = [];
const oks = [];
function check(nombre, errores, detalleOk) {
    if (errores.length) fallos.push({ nombre, errores });
    else oks.push({ nombre, detalle: detalleOk });
}

/** Recorre todos los puntos (paradas y tramos) de todas las aventuras. */
function* puntos(DATOS) {
    for (const [aventuraId, aventura] of Object.entries(DATOS)) {
        for (const seccion of Object.values(aventura)) {
            for (const punto of seccion?.coordenadas || []) yield { aventuraId, punto };
        }
    }
}

async function main() {
    const imp = async (rel) => import(pathToFileURL(path.join(RAIZ, rel)).href);

    // ── 1. Los módulos exportan lo que dicen
    const faltan = [];
    const mods = {};
    for (const [rel, nombre] of [
        ['js/coordenadas-aventuras.js', 'DATOS_AVENTURAS'],
        ['js/audios-aventuras.js', 'AUDIOS_AVENTURAS'],
        ['js/retos-aventuras.js', 'RETOS_AVENTURAS'],
        ['js/indice-aventuras.js', 'INDICE_AVENTURAS'],
    ]) {
        try {
            const m = await imp(rel);
            if (!m[nombre] || typeof m[nombre] !== 'object') faltan.push(`${rel} no exporta ${nombre}`);
            else mods[nombre] = m[nombre];
        } catch (e) { faltan.push(`${rel} no se puede importar: ${e.message}`); }
    }
    check('Los módulos de datos exportan lo que dicen', faltan, `${Object.keys(mods).length} módulos`);
    if (faltan.length) return informe();

    const { DATOS_AVENTURAS, AUDIOS_AVENTURAS, RETOS_AVENTURAS, INDICE_AVENTURAS } = mods;

    // ── 2 y 3. Campos de vídeo
    const videoMal = []; const videoRuta = []; let videosOk = 0;
    for (const { aventuraId, punto } of puntos(DATOS_AVENTURAS)) {
        if (punto.video === undefined || punto.video === '') continue;
        if (EXT_IMAGEN.test(punto.video)) videoMal.push(`${aventuraId}/${punto.id}: video="${punto.video}" es una imagen`);
        else if (!EXT_VIDEO.test(punto.video)) videoMal.push(`${aventuraId}/${punto.id}: video="${punto.video}" no acaba en .mp4`);
        else videosOk++;
        const carpeta = CARPETA_VIDEO[aventuraId];
        if (carpeta && !punto.video.startsWith(carpeta)) videoRuta.push(`${aventuraId}/${punto.id}: "${punto.video}" no empieza por "${carpeta}"`);
        if (punto.video.startsWith('videos/')) videoRuta.push(`${aventuraId}/${punto.id}: usa el prefijo antiguo "videos/"`);
    }
    // Hoy NO hay ningún campo `video` con contenido (medido: 0 de 843 puntos). Estas dos
    // comprobaciones son un guard para cuando se coloquen, no cobertura de algo existente;
    // por eso el detalle dice cuántos ha mirado, para que un 0 no parezca un aprobado.
    check('Los campos `video` son vídeos .mp4', videoMal, videosOk === 0 ? 'ningún punto tiene campo `video` todavía' : `${videosOk} vídeos`);
    check('Cada vídeo está en la carpeta de su aventura', videoRuta, videosOk === 0 ? 'nada que comprobar aún' : 'todas las rutas correctas');

    // ── 4. Campos de imagen
    const imgMal = []; let imgsOk = 0;
    for (const { aventuraId, punto } of puntos(DATOS_AVENTURAS)) {
        for (const campo of ['imagen', 'imagen2', 'imagen3']) {
            const v = punto[campo];
            if (v === undefined || v === '') continue;
            if (!EXT_IMAGEN.test(v)) imgMal.push(`${aventuraId}/${punto.id}: ${campo}="${v}" sin extensión de imagen`);
            else imgsOk++;
        }
    }
    check('Los campos `imagen*` tienen extensión de imagen', imgMal, `${imgsOk} imágenes`);

    // ── 5. Ids repetidos
    const dups = [];
    for (const [aventuraId, aventura] of Object.entries(DATOS_AVENTURAS)) {
        for (const [clave, seccion] of Object.entries(aventura)) {
            const ids = (seccion?.coordenadas || []).map((c) => c.id).filter(Boolean);
            const repes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
            if (repes.length) dups.push(`${aventuraId}/${clave}: ${repes.join(', ')}`);
        }
    }
    check('No hay ids repetidos dentro de una aventura', dups, 'todos únicos');

    // ── 6. Coordenadas en rango, y quién debe tenerlas
    //
    // MEDIDO: van anidadas en `punto.coordenadas`, no sueltas en el punto. Y los `tramo`
    // NO llevan —un tramo es el camino entre dos paradas, no un sitio—: los 239 tramos son
    // exactamente los 239 puntos sin coordenadas, y referencia/inicio/parada las tienen
    // todas. Por eso el tipo decide si la ausencia es normal o es un agujero.
    const coordMal = []; const coordFalta = []; let coordsOk = 0;
    for (const { aventuraId, punto } of puntos(DATOS_AVENTURAS)) {
        const c = punto.coordenadas;
        const debeTener = punto.tipo !== 'tramo';
        if (!c || typeof c.lat !== 'number' || typeof c.lng !== 'number') {
            if (debeTener) coordFalta.push(`${aventuraId}/${punto.id} (${punto.tipo}): sin coordenadas`);
            continue;
        }
        if (c.lat < -90 || c.lat > 90 || c.lng < -180 || c.lng > 180) {
            coordMal.push(`${aventuraId}/${punto.id}: lat=${c.lat} lng=${c.lng}`);
        } else coordsOk++;
    }
    check('Las coordenadas caen en un rango válido', coordMal, `${coordsOk} puntos`);
    check('Todo punto que no es un tramo tiene coordenadas', coordFalta, 'ninguno se las deja');

    // ── 7 y 8. Audios y retos, en TODAS las aventuras e idiomas
    const audioMal = []; let audiosOk = 0;
    for (const [aventuraId, idiomas] of Object.entries(AUDIOS_AVENTURAS)) {
        for (const [idioma, lista] of Object.entries(idiomas)) {
            if (!Array.isArray(lista)) continue;
            for (const a of lista) {
                if (!a.id) audioMal.push(`${aventuraId}/${idioma}: una entrada de audio sin id`);
                else audiosOk++;
            }
        }
    }
    check('Ningún audio tiene id vacío', audioMal, `${audiosOk} audios`);

    // Cada tipo de reto tiene su forma, y exigirles la misma es acusar en falso: un
    // `puzzle` no lleva pregunta —lleva `src`— y un `texto` no lleva opciones, porque la
    // respuesta se escribe. MEDIDO: puzzle 600, opcion 1392, texto 648, opcion-multiple 420.
    const FORMA = {
        puzzle: ['src'],
        opcion: ['pregunta', 'opciones', 'correctas'],
        'opcion-multiple': ['pregunta', 'opciones', 'correctas'],
        texto: ['pregunta', 'correctas'],
    };
    const retoMal = []; const retoTipo = []; let retosOk = 0;
    for (const [aventuraId, idiomas] of Object.entries(RETOS_AVENTURAS)) {
        for (const [idioma, lista] of Object.entries(idiomas)) {
            if (!Array.isArray(lista)) continue;
            for (const r of lista) {
                const donde = `${aventuraId}/${idioma}/${r.id || '(sin id)'}`;
                if (!r.id) { retoMal.push(`${donde}: sin id`); continue; }
                const exige = FORMA[r.tipo];
                if (!exige) { retoTipo.push(`${donde}: tipo desconocido "${r.tipo}"`); continue; }
                const faltan = exige.filter((campo) => {
                    const v = r[campo];
                    return v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
                });
                if (faltan.length) retoMal.push(`${donde} (${r.tipo}): le falta ${faltan.join(', ')}`);
                else retosOk++;
            }
        }
    }
    check('Cada reto tiene los campos de SU tipo', retoMal, `${retosOk} retos`);
    check('No hay retos de un tipo desconocido', retoTipo, `tipos: ${Object.keys(FORMA).join(', ')}`);

    // ── 9. Lo que el índice dice disponible, existe
    const indiceMal = [];
    for (const [aventuraId, info] of Object.entries(INDICE_AVENTURAS)) {
        if (!info || typeof info !== 'object') continue;
        const hayAudios = Object.values(AUDIOS_AVENTURAS[aventuraId] || {}).some((l) => Array.isArray(l) && l.length);
        const hayRetos = Object.values(RETOS_AVENTURAS[aventuraId] || {}).some((l) => Array.isArray(l) && l.length);
        const hayCoords = Object.values(DATOS_AVENTURAS[aventuraId] || {}).some((s) => (s?.coordenadas || []).length);
        if (info.disponible === true) {
            if (!hayAudios) indiceMal.push(`${aventuraId}: marcada disponible y no tiene audios`);
            if (!hayRetos) indiceMal.push(`${aventuraId}: marcada disponible y no tiene retos`);
            if (!hayCoords) indiceMal.push(`${aventuraId}: marcada disponible y no tiene coordenadas`);
        }
        if (info.disponible !== undefined && typeof info.disponible !== 'boolean') {
            indiceMal.push(`${aventuraId}: \`disponible\` no es booleano (${typeof info.disponible})`);
        }
    }
    check('Lo que el índice marca disponible existe en los datos', indiceMal, `${Object.keys(INDICE_AVENTURAS).length} aventuras`);

    informe();
}

function informe() {
    if (!quiet) {
        for (const o of oks) console.log(`  ✅ ${o.nombre}${o.detalle ? ` — ${o.detalle}` : ''}`);
    }
    for (const f of fallos) {
        console.error(`  ❌ ${f.nombre} — ${f.errores.length} problema(s)`);
        f.errores.slice(0, 8).forEach((e) => console.error(`       ${e}`));
        if (f.errores.length > 8) console.error(`       … y ${f.errores.length - 8} más`);
    }
    if (fallos.length) {
        console.error(`\n[datos-aventuras] ${fallos.length} comprobación(es) en rojo.`);
        process.exit(1);
    }
    if (!quiet) console.log(`\n[datos-aventuras] ✅ Las ${oks.length} comprobaciones pasan.`);
}

main().catch((e) => { console.error('[datos-aventuras] error inesperado:', e); process.exit(1); });
