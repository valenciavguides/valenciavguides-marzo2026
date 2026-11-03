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
 *  10. Cada aventura del índice dice si es corta o larga (su categoría de precio)
 *  11. El índice trae el nombre y el tiempo de cada aventura, y el nombre de cada idioma
 *  12. La carpeta pública de la demo gratis (publico/) está al día con los originales y no le falta ninguna pieza
 *  13. Cada imagen que depende del idioma (`imagenes_idioma`) está en las doce carpetas de idioma, en .jpg
 *  14. Cada foto que piden los datos (`imagen`, `imagen2`… de cada punto y de cada puzzle) existe con su grafía exacta
 *
 * Lo que NO comprueba: que los ficheros de audio y vídeo existan en disco; su tamaño y su codificación son
 * `npm run verificar-media`. Las imágenes sí: las fotos de los datos (14), las que enseña la demo (12), cuya copia de
 * publico/ tiene que ser idéntica a su original, y las imágenes por idioma (13). Una que falte es una imagen rota.
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

    // ── 10. Toda aventura dice si es corta o larga
    // La categoría es la del PRECIO y la decide el autor: no se deduce de la distancia ni del tiempo. Sin ella la
    // selección no deja elegir la aventura, así que una aventura nueva sin categoría se para aquí.
    const sinCategoria = [];
    const reparto = { corta: 0, larga: 0 };
    for (const [aventuraId, info] of Object.entries(INDICE_AVENTURAS)) {
        if (!info || typeof info !== 'object') continue;
        if (info.categoria === 'corta' || info.categoria === 'larga') reparto[info.categoria]++;
        else sinCategoria.push(`${aventuraId}: \`categoria\` vale ${JSON.stringify(info.categoria)} y tiene que ser 'corta' o 'larga' — preguntar al autor cuál es`);
    }
    check('Cada aventura del índice dice si es corta o larga', sinCategoria, `${reparto.corta} cortas, ${reparto.larga} largas`);

    // ── 11. El índice trae lo que el padre enseña y cuenta
    // El padre saca de aquí el nombre de la aventura (carteles, modal de fin, diálogo de reanudación), el del idioma (el mismo
    // diálogo) y el tiempo de la aventura (el reloj y la ventana de compra). Si falta uno, enseña el id o el código, o usa 60 h,
    // y lo dice con un error en el log; aquí se para antes de llegar ahí.
    const sinDato = [];
    for (const [aventuraId, info] of Object.entries(INDICE_AVENTURAS)) {
        if (!info || typeof info !== 'object') { sinDato.push(`${aventuraId}: la entrada no es un objeto`); continue; }
        if (typeof info.nombre !== 'string' || !info.nombre.trim()) sinDato.push(`${aventuraId}: sin \`nombre\``);
        if (!Number.isFinite(info.tiempoEstimado) || info.tiempoEstimado <= 0) sinDato.push(`${aventuraId}: \`tiempoEstimado\` vale ${JSON.stringify(info.tiempoEstimado)} y tiene que ser un número de segundos mayor que 0`);
    }
    const { MAPEO_IDIOMAS } = await imp('js/indice-aventuras.js');
    if (!MAPEO_IDIOMAS || typeof MAPEO_IDIOMAS !== 'object') sinDato.push('js/indice-aventuras.js no exporta MAPEO_IDIOMAS');
    else for (const [idioma, info] of Object.entries(MAPEO_IDIOMAS)) {
        if (typeof info?.nombre !== 'string' || !info.nombre.trim()) sinDato.push(`idioma ${idioma}: sin \`nombre\``);
    }
    check('El índice trae el nombre y el tiempo de cada aventura, y el nombre de cada idioma', sinDato,
        `${Object.keys(INDICE_AVENTURAS).length} aventuras, ${Object.keys(MAPEO_IDIOMAS || {}).length} idiomas`);

    // ── 12. La carpeta pública de la demo gratis está al día con los originales, y completa
    // La demo (la selección hasta el código, el vídeo de introducción y el puzzle de P6) lee lo que enseña de las copias de
    // publico/, que hace tools/build-demo.js a partir de estos mismos ficheros de datos y de los medios que enseña; el hook
    // de pre-commit las rehace. Aquí se para si un original cambia sin rehacer su copia, si falta una pieza o si sobra un
    // fichero en publico/.
    const { revisarPublico } = require('./build-demo.js');
    const publico = await revisarPublico({ staged: false });
    const problemasDemo = [
        ...publico.faltas,
        ...[...publico.desfasados, ...publico.copiasMal].map((f) => `${f} no está al día con su original: npm run build:demo`),
        ...publico.sobran.map((f) => `${f} sobra en publico/: no es copia de ningún original`),
    ];
    check('La carpeta pública de la demo gratis está al día con los originales y no le falta ninguna pieza', problemasDemo,
        `${publico.textos.size} textos y ${publico.copias.size} copias`);

    // ── 13. Las imágenes que dependen del idioma están en las doce carpetas
    // La ventana de la imagen pide imagenes/imagenes-idiomas/<carpeta del idioma>/<nombre>.jpg, con la carpeta que
    // LANG_ARCHIVO_PARRAFOS da a cada idioma. Un nombre que falte en una carpeta es una imagen rota en ese idioma.
    const { LANG_ARCHIVO_PARRAFOS } = await imp('js/data-loader.js');
    const fs = require('node:fs');
    const imgIdioma = []; let nombresIdioma = 0;
    for (const { aventuraId, punto } of puntos(DATOS_AVENTURAS)) {
        if (punto.imagenes_idioma === undefined) continue;
        if (!Array.isArray(punto.imagenes_idioma) || !punto.imagenes_idioma.length) { imgIdioma.push(`${aventuraId}/${punto.id}: \`imagenes_idioma\` tiene que ser una lista con algún nombre`); continue; }
        for (const nombre of punto.imagenes_idioma) {
            if (typeof nombre !== 'string' || !/^[a-z0-9-]+$/.test(nombre)) { imgIdioma.push(`${aventuraId}/${punto.id}: «${nombre}» no es un nombre sin carpeta ni extensión`); continue; }
            nombresIdioma++;
            for (const carpeta of Object.values(LANG_ARCHIVO_PARRAFOS)) {
                const rel = `imagenes/imagenes-idiomas/${carpeta}/${nombre}.jpg`;
                if (!fs.existsSync(path.join(RAIZ, rel))) imgIdioma.push(`${aventuraId}/${punto.id}: falta ${rel}`);
            }
        }
    }
    check('Cada imagen que depende del idioma está en las doce carpetas de idioma', imgIdioma,
        `${nombresIdioma} nombres en ${Object.keys(LANG_ARCHIVO_PARRAFOS).length} idiomas`);

    // ── 14. Cada foto que piden los datos existe, con su grafía exacta
    // Las fotos de cada punto (`imagen`, `imagen2`… en cualquier nivel del punto) y las de los puzzles. Se compara con el
    // listado de la carpeta, no con fs.existsSync: Windows no distingue mayúsculas y el servidor de producción sí, así que
    // `Plaza_redonda.jpg` frente a `plaza_redonda.jpg` se ve en local y sale rota publicada.
    const { PUZZLES_AVENTURAS } = await imp('js/puzzles-aventuras.js');
    const listados = new Map();
    const existeExacto = (rel) => {
        const dir = path.posix.dirname(rel);
        if (!listados.has(dir)) {
            const abs = path.join(RAIZ, dir);
            listados.set(dir, new Set(fs.existsSync(abs) ? fs.readdirSync(abs) : []));
        }
        return listados.get(dir).has(path.posix.basename(rel));
    };
    const fotoFalta = []; let fotosOk = 0;
    const revisarFotos = (donde, obj) => {
        if (!obj || typeof obj !== 'object') return;
        for (const [k, v] of Object.entries(obj)) {
            if (/^imagen\d*$/.test(k) && typeof v === 'string' && v.trim()) {
                if (existeExacto(v.trim())) fotosOk++;
                else fotoFalta.push(`${donde}: ${k}="${v}" no existe con esa grafía`);
            } else if (v && typeof v === 'object') revisarFotos(donde, v);
        }
    };
    for (const { aventuraId, punto } of puntos(DATOS_AVENTURAS)) revisarFotos(`${aventuraId}/${punto.id}`, punto);
    for (const [aventuraId, lista] of Object.entries(PUZZLES_AVENTURAS || {})) {
        for (const pz of Object.values(lista || {})) revisarFotos(`${aventuraId}/puzzle ${pz?.id ?? '?'}`, pz);
    }
    check('Cada foto que piden los datos existe, con su grafía exacta', fotoFalta, `${fotosOk} fotos`);

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
