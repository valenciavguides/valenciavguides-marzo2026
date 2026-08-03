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

export const IDIOMAS_SOPORTADOS = ['es', 'en', 'fr', 'it', 'nl', 'ja', 'de', 'zh', 'pl', 'pt', 'ru', 'uk'];

// ─── Temas ────────────────────────────────────────────────────────────────────

export const TEMAS_ETIQUETAS = {
    GPS:        { es: '📍 GPS y Ubicación',      en: '📍 GPS & Location',        fr: '📍 GPS et Position',           it: '📍 GPS e Posizione',          nl: '📍 GPS en Locatie',         ja: '📍 GPS・位置情報',    de: '📍 GPS & Standort',          zh: '📍 GPS与位置',         pl: '📍 GPS i Lokalizacja',       pt: '📍 GPS e Localização',       ru: '📍 GPS и местоположение',   uk: '📍 GPS та місцезнаходження' },
    AUDIO:      { es: '🔊 Audio',                en: '🔊 Audio',                 fr: '🔊 Audio',                     it: '🔊 Audio',                    nl: '🔊 Audio',                  ja: '🔊 音声',             de: '🔊 Audio',                    zh: '🔊 音频',              pl: '🔊 Audio',                   pt: '🔊 Áudio',                   ru: '🔊 Аудио',                  uk: '🔊 Аудіо'                   },
    NAVEGACION: { es: '🗺️ Navegación y Ruta',   en: '🗺️ Navigation & Route',    fr: '🗺️ Navigation et Itinéraire', it: '🗺️ Navigazione e Percorso',  nl: '🗺️ Navigatie en Route',    ja: '🗺️ ナビゲーション',   de: '🗺️ Navigation & Route',      zh: '🗺️ 导航与路线',        pl: '🗺️ Nawigacja i Trasa',       pt: '🗺️ Navegação e Rota',        ru: '🗺️ Навигация и маршрут',    uk: '🗺️ Навігація та маршрут'    },
    PROGRESO:   { es: '💾 Progreso y Guardado',  en: '💾 Progress & Saving',     fr: '💾 Progression et Sauvegarde', it: '💾 Progresso e Salvataggio', nl: '💾 Voortgang en Opslaan',   ja: '💾 進行状況',          de: '💾 Fortschritt & Speichern',  zh: '💾 进度与保存',         pl: '💾 Postęp i Zapisywanie',    pt: '💾 Progresso e Guardar',     ru: '💾 Прогресс и сохранение',  uk: '💾 Прогрес і збереження'    },
    RETOS:      { es: '🧩 Retos y Puzzles',      en: '🧩 Challenges & Puzzles',  fr: '🧩 Défis et Puzzles',          it: '🧩 Sfide e Puzzle',           nl: '🧩 Uitdagingen en Puzzels', ja: '🧩 チャレンジ',        de: '🧩 Aufgaben & Rätsel',        zh: '🧩 挑战与拼图',         pl: '🧩 Wyzwania i Puzzle',       pt: '🧩 Desafios e Puzzles',      ru: '🧩 Задания и головоломки',  uk: '🧩 Завдання та пазли'       },
    APP:        { es: '📱 La Aplicación',        en: '📱 The App',               fr: "📱 L'Application",             it: "📱 L'Applicazione",           nl: '📱 De App',                 ja: '📱 アプリ',            de: '📱 Die App',                  zh: '📱 应用程序',           pl: '📱 Aplikacja',               pt: '📱 A Aplicação',             ru: '📱 Приложение',             uk: '📱 Додаток'                  },
    TIEMPO:     { es: '⏱️ Tiempo y Recorrido',   en: '⏱️ Time & Tour',           fr: '⏱️ Temps et Parcours',         it: '⏱️ Tempo e Percorso',         nl: '⏱️ Tijd en Rondleiding',   ja: '⏱️ 時間・ツアー',     de: '⏱️ Zeit & Tour',             zh: '⏱️ 时间与游览',         pl: '⏱️ Czas i Trasa',            pt: '⏱️ Tempo e Percurso',        ru: '⏱️ Время и маршрут',        uk: '⏱️ Час та маршрут'          },
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
    GPS_NO_DETECTA:             { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    GPS_FUERA_RANGO:            { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    GPS_PERMISO_DENEGADO:       { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    AUDIO_NO_SUENA:             { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    AUDIO_DETENIDO:             { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    AUDIO_IDIOMA_NO_DISPONIBLE: { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    AUDIO_AUTOMATICO:           { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    AUDIO_VOLUMEN:              { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    PROXIMA_PARADA:             { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    PARADA_ACTUAL:              { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    PARADAS_RESTANTES:          { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    DESVIO_RUTA: {
        es: '¿Puedo tomar un camino distinto al del mapa?',
        en: 'Can I take a different path than the one on the map?',
        fr: 'Puis-je prendre un autre chemin que celui indiqué ?',
        it: 'Posso prendere un percorso diverso da quello sulla mappa?',
        nl: 'Mag ik een andere route nemen dan op de kaart?',
        ja: '地図と違う道を歩いてもいいですか？',
        de: 'Kann ich einen anderen Weg als den auf der Karte nehmen?',
        zh: '我可以走与地图上不同的路吗？',
        pl: 'Czy mogę iść inną drogą niż zaznaczona na mapie?',
        pt: 'Posso tomar um caminho diferente do indicado no mapa?',
        ru: 'Можно ли идти другим путём, а не по карте?',
        uk: 'Чи можу я йти іншим шляхом, ніж зазначено на карті?',
    },
    PROGRESO_GUARDAR:           { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    PROGRESO_RETOMAR:           { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    AVENTURA_COMPLETADA:        { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    RETO_NO_ENTIENDO:           { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    RETO_RESPUESTA_MAL:         { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    PUZZLE_AYUDA:               { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    APP_GENERAL:                { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    APP_SEGUNDO_PLANO:          { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    SIN_CONEXION:               { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    BOTONES_ESTADO:             { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    TIEMPO_AGOTADO:             { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    TIEMPO_AVENTURA:            { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    PAUSAS_RUTA:                { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
    ACCESO_MONUMENTOS:          { es: '', en: '', fr: '', it: '', nl: '', ja: '', de: '', zh: '', pl: '', pt: '', ru: '', uk: '' },
};

// ─── Respuestas ───────────────────────────────────────────────────────────────
// texto:  respuesta en texto plano (acepta marcadores {{...}}).
// imagen: ruta relativa a imagen aclaratoria, o null si no hay.
// Pendiente de contenido.

const _r = () => ({
    es: { texto: '', imagen: null }, en: { texto: '', imagen: null },
    fr: { texto: '', imagen: null }, it: { texto: '', imagen: null },
    nl: { texto: '', imagen: null }, ja: { texto: '', imagen: null },
    de: { texto: '', imagen: null }, zh: { texto: '', imagen: null },
    pl: { texto: '', imagen: null }, pt: { texto: '', imagen: null },
    ru: { texto: '', imagen: null }, uk: { texto: '', imagen: null },
});

const RESPUESTAS_SOPORTE = {
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
        es: { texto: 'Sí, puede ir por donde quiera. La app solo comprueba que llegue al punto final del tramo, no que siga exactamente el camino marcado.\n\nLa línea azul del mapa es una sugerencia de ruta, no un camino obligatorio. Si se desvía más de 50 metros, aparecerá una línea discontinua que le indica cómo volver a la ruta, pero no le bloquea ni le penaliza.', imagen: null },
        en: { texto: 'Yes, you can go any way you like. The app only checks that you reach the end point of the segment, not that you follow the exact path shown.\n\nThe blue line on the map is a suggested route, not a mandatory path. If you stray more than 50 metres, a dashed line will appear showing you how to return to the route, but it won\'t block or penalise you.', imagen: null },
        fr: { texto: 'Oui, vous pouvez aller où vous voulez. L\'application vérifie uniquement que vous atteignez le point final du tronçon, pas que vous suiviez exactement le chemin indiqué.\n\nLa ligne bleue sur la carte est une suggestion d\'itinéraire, pas un chemin obligatoire. Si vous vous écartez de plus de 50 mètres, une ligne pointillée apparaît pour vous indiquer comment revenir, mais elle ne vous bloque pas.', imagen: null },
        it: { texto: 'Sì, può andare dove vuole. L\'app verifica solo che raggiunga il punto finale del tratto, non che segua esattamente il percorso indicato.\n\nLa linea blu sulla mappa è un suggerimento di percorso, non un obbligo. Se si allontana di più di 50 metri, apparirà una linea tratteggiata che le indica come tornare al percorso, ma non la blocca né la penalizza.', imagen: null },
        nl: { texto: 'Ja, u kunt gaan waar u wilt. De app controleert alleen of u het eindpunt van het traject bereikt, niet of u precies het aangegeven pad volgt.\n\nDe blauwe lijn op de kaart is een routesuggestie, geen verplicht pad. Als u meer dan 50 meter afwijkt, verschijnt er een stippellijn die u laat zien hoe u terug kunt komen, maar die blokkeert of bestraft u niet.', imagen: null },
        ja: { texto: '大丈夫です。アプリはコースの終点に着いたかどうかだけを確認します。地図に表示された道を正確にたどる必要はありません。\n\n青い線はルートの提案であり、必須ではありません。ルートから50メートル以上離れると、戻り方を示す点線が表示されますが、進行がブロックされたりペナルティが発生したりすることはありません。', imagen: null },
        de: { texto: 'Ja, Sie können gehen, wie Sie möchten. Die App prüft nur, ob Sie den Endpunkt des Abschnitts erreichen, nicht ob Sie genau dem angezeigten Weg folgen.\n\nDie blaue Linie auf der Karte ist ein Routenvorschlag, kein Pflichtweg. Wenn Sie mehr als 50 Meter abweichen, erscheint eine gestrichelte Linie, die Ihnen zeigt, wie Sie zur Route zurückkehren können, aber sie blockiert oder bestraft Sie nicht.', imagen: null },
        zh: { texto: '可以，您可以按自己的方式行走。应用只检查您是否到达了路段的终点，而不是您是否严格按照地图上的路线行走。\n\n地图上的蓝线只是路线建议，不是必须遵守的路径。如果您偏离超过50米，会出现一条虚线提示您如何回到路线，但不会阻止您或给您处罚。', imagen: null },
        pl: { texto: 'Tak, można iść, którędy się chce. Aplikacja sprawdza jedynie, czy udało się dotrzeć do końcowego punktu odcinka — nie wymaga podążania dokładnie wytyczoną trasą.\n\nNiebieska linia na mapie to tylko sugestia trasy, a nie obowiązkowa ścieżka. Po oddaleniu się o ponad 50 metrów pojawi się linia przerywana, pokazująca drogę powrotną do trasy — nie blokuje to postępu ani nie wiąże się z żadną karą.', imagen: null },
        pt: { texto: 'Sim, pode ir como quiser. A app só verifica se chega ao ponto final do troço, não se segue exatamente o caminho indicado.\n\nA linha azul no mapa é uma sugestão de rota, não um caminho obrigatório. Se se afastar mais de 50 metros, aparece uma linha tracejada a mostrar como voltar à rota, mas isso não bloqueia nem penaliza o progresso.', imagen: null },
        ru: { texto: 'Да, вы можете идти любым путём. Приложение проверяет только то, достигли ли вы конечной точки участка, а не то, следуете ли вы точно указанному маршруту.\n\nСиняя линия на карте — это предложение маршрута, а не обязательный путь. Если вы отклонитесь более чем на 50 метров, появится пунктирная линия, показывающая, как вернуться к маршруту, но она не блокирует и не штрафует вас.', imagen: null },
        uk: { texto: 'Так, ви можете йти будь-яким шляхом. Додаток лише перевіряє, чи досягли ви кінцевої точки відрізку, а не чи точно ви дотримуєтесь вказаного маршруту.\n\nСиня лінія на карті — це пропозиція маршруту, а не обов\'язковий шлях. Якщо ви відхилитесь більш ніж на 50 метрів, з\'явиться пунктирна лінія, яка показує, як повернутися до маршруту, але вона не блокує та не штрафує вас.', imagen: null },
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
