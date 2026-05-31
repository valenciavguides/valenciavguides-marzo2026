/**
 * Datos del asistente de soporte Valencia VGuides.
 *
 * Organiza las preguntas frecuentes en temas (acordeón nivel 1) y
 * preguntas (acordeón nivel 2). Cada respuesta puede incluir texto
 * y una imagen aclaratoria opcional.
 *
 * Marcadores disponibles en texto de respuestas:
 *   {{PARADA_ACTUAL}}, {{PARADA_SIGUIENTE}}, {{PARADAS_RESTANTES}},
 *   {{IDIOMA_ACTIVO}}, {{AVENTURA}}
 */

export const IDIOMAS_SOPORTADOS = ['es', 'en', 'fr', 'it', 'nl', 'ja'];

// ─── Temas ────────────────────────────────────────────────────────────────────

export const TEMAS_ETIQUETAS = {
    GPS:        { es: '📍 GPS y Ubicación',      en: '📍 GPS & Location',       fr: '📍 GPS et Position',         it: '📍 GPS e Posizione',          nl: '📍 GPS en Locatie',         ja: '📍 GPS・位置情報'    },
    AUDIO:      { es: '🔊 Audio',                en: '🔊 Audio',                fr: '🔊 Audio',                   it: '🔊 Audio',                    nl: '🔊 Audio',                  ja: '🔊 音声'             },
    NAVEGACION: { es: '🗺️ Navegación y Ruta',   en: '🗺️ Navigation & Route',   fr: '🗺️ Navigation et Itinéraire', it: '🗺️ Navigazione e Percorso',  nl: '🗺️ Navigatie en Route',    ja: '🗺️ ナビゲーション'   },
    PROGRESO:   { es: '💾 Progreso y Guardado',  en: '💾 Progress & Saving',    fr: '💾 Progression et Sauvegarde', it: '💾 Progresso e Salvataggio', nl: '💾 Voortgang en Opslaan',   ja: '💾 進行状況'          },
    RETOS:      { es: '🧩 Retos y Puzzles',      en: '🧩 Challenges & Puzzles', fr: '🧩 Défis et Puzzles',        it: '🧩 Sfide e Puzzle',           nl: '🧩 Uitdagingen en Puzzels', ja: '🧩 チャレンジ'        },
    APP:        { es: '📱 La Aplicación',        en: '📱 The App',              fr: "📱 L'Application",           it: "📱 L'Applicazione",           nl: '📱 De App',                 ja: '📱 アプリ'            },
    TIEMPO:     { es: '⏱️ Tiempo y Recorrido',   en: '⏱️ Time & Tour',          fr: '⏱️ Temps et Parcours',       it: '⏱️ Tempo e Percorso',         nl: '⏱️ Tijd en Rondleiding',   ja: '⏱️ 時間・ツアー'     },
};

// Orden de aparición en el acordeón
export const ORDEN_TEMAS = ['GPS', 'AUDIO', 'NAVEGACION', 'PROGRESO', 'RETOS', 'APP', 'TIEMPO'];

// Intenciones agrupadas por tema
export const TEMAS_AGRUPADOS = {
    GPS:        ['GPS_NO_DETECTA', 'GPS_FUERA_RANGO', 'GPS_PERMISO_DENEGADO'],
    AUDIO:      ['AUDIO_NO_SUENA', 'AUDIO_DETENIDO', 'AUDIO_IDIOMA_NO_DISPONIBLE', 'AUDIO_AUTOMATICO', 'AUDIO_VOLUMEN'],
    NAVEGACION: ['PROXIMA_PARADA', 'PARADA_ACTUAL', 'PARADAS_RESTANTES', 'DESVIO_RUTA'],
    PROGRESO:   ['PROGRESO_GUARDAR', 'PROGRESO_RETOMAR', 'AVENTURA_COMPLETADA'],
    RETOS:      ['RETO_NO_ENTIENDO', 'RETO_RESPUESTA_MAL', 'PUZZLE_AYUDA'],
    APP:        ['APP_GENERAL', 'APP_SEGUNDO_PLANO', 'SIN_CONEXION', 'BOTONES_ESTADO'],
    TIEMPO:     ['TIEMPO_AGOTADO', 'TIEMPO_AVENTURA', 'PAUSAS_RUTA', 'ACCESO_MONUMENTOS'],
};

// ─── Texto de los botones de pregunta ─────────────────────────────────────────
// Pendiente de contenido — strings vacíos hasta que se redacten.

export const PREGUNTAS_SOPORTE = {
    GPS_NO_DETECTA:             { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    GPS_FUERA_RANGO:            { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    GPS_PERMISO_DENEGADO:       { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    AUDIO_NO_SUENA:             { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    AUDIO_DETENIDO:             { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    AUDIO_IDIOMA_NO_DISPONIBLE: { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    AUDIO_AUTOMATICO:           { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    AUDIO_VOLUMEN:              { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    PROXIMA_PARADA:             { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    PARADA_ACTUAL:              { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    PARADAS_RESTANTES:          { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    DESVIO_RUTA:                { es: '¿Puedo tomar un camino distinto al del mapa?', en: 'Can I take a different path than the one on the map?', fr: 'Puis-je prendre un autre chemin que celui indiqué ?', it: 'Posso prendere un percorso diverso da quello sulla mappa?', nl: 'Mag ik een andere route nemen dan op de kaart?', ja: '地図と違う道を歩いてもいいですか？' },
    PROGRESO_GUARDAR:           { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    PROGRESO_RETOMAR:           { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    AVENTURA_COMPLETADA:        { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    RETO_NO_ENTIENDO:           { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    RETO_RESPUESTA_MAL:         { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    PUZZLE_AYUDA:               { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    APP_GENERAL:                { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    APP_SEGUNDO_PLANO:          { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    SIN_CONEXION:               { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    BOTONES_ESTADO:             { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    TIEMPO_AGOTADO:             { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    TIEMPO_AVENTURA:            { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    PAUSAS_RUTA:                { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
    ACCESO_MONUMENTOS:          { es: '', en: '', fr: '', it: '', nl: '', ja: '' },
};

// ─── Respuestas ───────────────────────────────────────────────────────────────
// texto:  respuesta en texto plano (acepta marcadores {{...}}).
// imagen: ruta relativa a imagen aclaratoria, o null si no hay.
// Pendiente de contenido.

const _r = () => ({ es: { texto: '', imagen: null }, en: { texto: '', imagen: null }, fr: { texto: '', imagen: null }, it: { texto: '', imagen: null }, nl: { texto: '', imagen: null }, ja: { texto: '', imagen: null } });

export const RESPUESTAS_SOPORTE = {
    GPS_NO_DETECTA:             _r(),
    GPS_FUERA_RANGO:            _r(),
    GPS_PERMISO_DENEGADO:       _r(),
    AUDIO_NO_SUENA:             _r(),
    AUDIO_DETENIDO:             _r(),
    AUDIO_IDIOMA_NO_DISPONIBLE: _r(),
    AUDIO_AUTOMATICO:           _r(),
    AUDIO_VOLUMEN:              _r(),
    PROXIMA_PARADA:             _r(),
    PARADA_ACTUAL:              _r(),
    PARADAS_RESTANTES:          _r(),
    DESVIO_RUTA: {
        es: { texto: 'Sí, puedes ir por donde quieras. La app solo comprueba que llegues al punto final del tramo, no que sigas exactamente el camino marcado.\n\nLa línea azul del mapa es una sugerencia de ruta, no un camino obligatorio. Si te desvías más de 50 metros, aparecerá una línea discontinua que te indica cómo volver a la ruta, pero no te bloquea ni te penaliza.', imagen: null },
        en: { texto: 'Yes, you can go any way you like. The app only checks that you reach the end point of the segment, not that you follow the exact path shown.\n\nThe blue line on the map is a suggested route, not a mandatory path. If you stray more than 50 metres, a dashed line will appear showing you how to return to the route, but it won\'t block or penalise you.', imagen: null },
        fr: { texto: 'Oui, vous pouvez aller où vous voulez. L\'application vérifie uniquement que vous atteignez le point final du tronçon, pas que vous suiviez exactement le chemin indiqué.\n\nLa ligne bleue sur la carte est une suggestion d\'itinéraire, pas un chemin obligatoire. Si vous vous écartez de plus de 50 mètres, une ligne pointillée apparaît pour vous indiquer comment revenir, mais elle ne vous bloque pas.', imagen: null },
        it: { texto: 'Sì, puoi andare dove vuoi. L\'app verifica solo che tu raggiunga il punto finale del tratto, non che tu segua esattamente il percorso indicato.\n\nLa linea blu sulla mappa è un suggerimento di percorso, non un obbligo. Se ti allontani di più di 50 metri, apparirà una linea tratteggiata che ti indica come tornare al percorso, ma non ti blocca né ti penalizza.', imagen: null },
        nl: { texto: 'Ja, je kunt gaan waar je wilt. De app controleert alleen of je het eindpunt van het traject bereikt, niet of je precies het aangegeven pad volgt.\n\nDe blauwe lijn op de kaart is een routesuggestie, geen verplicht pad. Als je meer dan 50 meter afwijkt, verschijnt er een stippellijn die je laat zien hoe je terug kunt komen, maar die blokkeert of bestraft je niet.', imagen: null },
        ja: { texto: '大丈夫です。アプリはコースの終点に着いたかどうかだけを確認します。地図に表示された道を正確にたどる必要はありません。\n\n青い線はルートの提案であり、必須ではありません。ルートから50メートル以上離れると、戻り方を示す点線が表示されますが、進行がブロックされたりペナルティが発生したりすることはありません。', imagen: null },
    },
    PROGRESO_GUARDAR:           _r(),
    PROGRESO_RETOMAR:           _r(),
    AVENTURA_COMPLETADA:        _r(),
    RETO_NO_ENTIENDO:           _r(),
    RETO_RESPUESTA_MAL:         _r(),
    PUZZLE_AYUDA:               _r(),
    APP_GENERAL:                _r(),
    APP_SEGUNDO_PLANO:          _r(),
    SIN_CONEXION:               _r(),
    BOTONES_ESTADO:             _r(),
    TIEMPO_AGOTADO:             _r(),
    TIEMPO_AVENTURA:            _r(),
    PAUSAS_RUTA:                _r(),
    ACCESO_MONUMENTOS:          _r(),
};

// ─── Utilidad ─────────────────────────────────────────────────────────────────

/**
 * Devuelve la respuesta estructurada para una intención e idioma,
 * con los marcadores dinámicos sustituidos.
 * @param {string} intencion
 * @param {string} idioma
 * @param {Object} estadoPadre
 * @returns {{ texto: string, imagen: string|null }}
 */
export function obtenerRespuesta(intencion, idioma, estadoPadre = {}) {
    const lang   = IDIOMAS_SOPORTADOS.includes(idioma) ? idioma : 'es';
    const mapa   = RESPUESTAS_SOPORTE[intencion];
    const entrada = mapa?.[lang] || mapa?.es || { texto: '', imagen: null };

    const texto = (entrada.texto || '')
        .replaceAll('{{PARADA_ACTUAL}}',      estadoPadre.paradaActualNombre    ?? '')
        .replaceAll('{{PARADA_SIGUIENTE}}',    estadoPadre.siguienteParadaNombre ?? '')
        .replaceAll('{{PARADAS_RESTANTES}}',   estadoPadre.paradasRestantes      ?? '')
        .replaceAll('{{IDIOMA_ACTIVO}}',       estadoPadre.idioma                ?? lang)
        .replaceAll('{{AVENTURA}}',            estadoPadre.aventura              ?? '');

    return { texto, imagen: entrada.imagen || null };
}
