const importPlugin = require("eslint-plugin-import-x");
const htmlPlugin = require("eslint-plugin-html");

module.exports = [
  // ── JS modules (js/ y backend/) ──────────────────────────────────────────
  {
    files: ["js/**/*.js", "backend/**/*.js", "tests/**/*.js"],
    ignores: ["js/vendor/**", "js/server.js", "js/suppress-warnings.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-unresolved": "error",
      "import/no-cycle": "warn",
      // Toda comunicación de log debe pasar por el logger centralizado (js/logger.js),
      // vía import directo o el patrón de fallback (globalThis.logger || console).X(...).
      // Esta regla NO marca ese patrón porque el objeto del MemberExpression no es
      // literalmente el identificador "console" (está envuelto en la expresión ||).
      // Excepciones legítimas (sin logger disponible por diseño): js/server.js (Node,
      // fuera del navegador), js/vendor/** (código de terceros), js/suppress-warnings.js
      // (debe ejecutarse antes de que cualquier módulo, incluido logger.js, cargue).
      // console.assert()/console.clear() son operaciones de consola sin equivalente
      // en el logger (no son mensajes de log) — permitidas explícitamente.
      "no-console": ["error", { allow: ["assert", "clear"] }],
    },
  },

  // ── Excepciones documentadas a no-console (ver comentario arriba) ─────────
  {
    files: ["js/server.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["js/suppress-warnings.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    // logger.js ES el logger centralizado — su implementación interna necesita
    // llamar a la consola real. proteccion.js sobrescribe console.table/console.dir
    // por seguridad (no son llamadas de log de aplicación).
    files: ["js/logger.js", "js/proteccion.js"],
    rules: {
      "no-console": "off",
    },
  },

  // ── HTML — extrae y linta bloques <script> y <script type="module"> ───────
  {
    files: ["*.html", "tests/**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // ── Web API / Browser ──────────────────────────────────────────────
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Promise: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        DeviceOrientationEvent: "readonly",   // brujula: js/funciones-mapa.js y debug-brujula.html
        localStorage: "readonly",
        sessionStorage: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        screen: "readonly",
        parent: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        EventTarget: "readonly",
        MutationObserver: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        performance: "readonly",
        crypto: "readonly",
        alert: "readonly",
        confirm: "readonly",
        getComputedStyle: "readonly",
        Image: "readonly",
        Audio: "readonly",
        NodeFilter: "readonly",
        TextEncoder: "readonly",
        // CommonJS detection pattern: typeof module !== 'undefined'
        module: "writable",

        // ── Librerías externas ────────────────────────────────────────────
        L: "readonly",           // Leaflet — mapa-completo.html y video-intro.html lo usan de forma permanente (mapas independientes, no rotan, sin snap-to-route)
        maplibregl: "readonly",  // MapLibre GL JS — motor del mapa de aventura (codigo-padre.html + js/funciones-mapa.js)
        St: "readonly",          // StPageFlip — efecto de pasar página en video-intro.html

        // ── Globals propios — constantes/config ──────────────────────────
        TIPOS_MENSAJE: "readonly",
        CONFIG_PADRE: "readonly",
        CONFIG_HIJO: "readonly",
        CONFIG: "readonly",
        MODOS: "readonly",
        DATOS_PADRE: "readonly",
        IMAGENES_AVENTURAS: "readonly",
        INDICE_AVENTURAS_DATOS: "readonly",

        // ── Globals propios — estado global ──────────────────────────────
        estado: "readonly",
        estadoMapa: "readonly",
        aventuraSeleccionada: "readonly",
        idiomaSeleccionado: "readonly",
        idPadre: "readonly",
        overlay: "readonly",

        // ── Globals propios — funciones de mensajería ─────────────────────
        enviarMensaje: "readonly",
        enviarMensaje_S1: "readonly",
        enviarMensajePadre: "readonly",
        enviarMensajeConConfirmacion: "readonly",
        registrarControladorSeguro: "readonly",
        desregistrarControlador: "readonly",
        registrarIframe_S1: "readonly",

        // ── Globals propios — funciones de utilidad ───────────────────────
        logger: "readonly",
        getPadreId: "readonly",
        getPadreIdLocal: "readonly",
        generarIdUnico: "readonly",
        getEstadoSafe: "readonly",
        ajustarTimeoutPorConexion_S1: "readonly",
        ajustarTimeoutPorConexionSafe: "readonly",
        findIndexByPadreIdOrId: "readonly",
        persistProgressState: "readonly",
        calcularDistancia: "readonly",
        coordinarAccion: "readonly",
        safeRegistrar: "readonly",
        registrarEvento: "readonly",

        // ── Globals propios — funciones de UI/navegación ─────────────────
        mostrar: "readonly",
        mostrarErrorOverlay: "readonly",
        mostrarHijo4: "readonly",
        mostrarMapaVintage: "readonly",
        cerrarErrorOverlay: "readonly",
        cerrarIframeOverlay: "readonly",
        cerrarImagenOverlay: "readonly",
        cerrarVideoOverlay: "readonly",
        cerrarChatVentana: "readonly",
        showFotoLejosOverlay: "readonly",
        hideFotoLejosOverlay: "readonly",
        showFotoFueraRangoOverlay: "readonly",
        hideFotoFueraRangoOverlay: "readonly",
        showFotoDesviadoOverlay: "readonly",
        hideFotoDesviadoOverlay: "readonly",
        showFotoPerdidoOverlay: "readonly",
        hideFotoPerdidoOverlay: "readonly",
        showGpsPrecisionOverlay: "readonly",
        hideGpsPrecisionOverlay: "readonly",
        toggleRotationMessage: "readonly",
        updateLoadingStatus: "readonly",
        btnTop: "readonly",
        codigo: "readonly",
        notifError: "readonly",

        // ── Globals propios — funciones de mapa/GPS ──────────────────────
        activarGPS: "readonly",
        showGpsOutOfRangeOverlay: "readonly",
        _ocultarTodasPantallasDistanciaGPS: "readonly",
        _iniciarTemporizadorAventura: "readonly",
        _obtenerCoordenadasP0Fallback: "readonly",
        solicitarCoordenadasHijo: "readonly",
        solicitarCoordenadasAHijo2: "readonly",
        seleccionarAventura: "readonly",

        // ── Globals propios — funciones de audio/aventura ────────────────
        solicitarAudioAHijo3: "readonly",
        obtenerAudioFiles: "readonly",
        obtenerAudioIdActivoPadre: "readonly",
        actualizarEstadoControlesAudioPadre: "readonly",
        audioCargado: "readonly",

        // ── Globals propios — funciones de carga de iframes ──────────────
        cargarHijoCasa: "readonly",
        cargarRestoDeiframes: "readonly",
        iniciarHeartbeat: "readonly",
        iniciarHeartbeat_S1: "readonly",

        // ── Globals propios — callbacks de carga ─────────────────────────
        agradecimientosCargados: "readonly",
        normativaCargada: "readonly",
        terminosCargados: "readonly",
        textoCargado: "readonly",
        retoCargadoR1: "readonly",
        retoCargadoR2: "readonly",

        // ── Globals propios — funciones de datos ─────────────────────────
        distribuirDatosAventura: "readonly",
        obtenerElementoActual: "readonly",
        obtenerRetosIds: "readonly",
      },
    },
    rules: {
      "no-undef": "warn",
      "no-redeclare": "error",
      "no-constant-condition": "warn",
      "eqeqeq": ["warn", "always", { null: "ignore" }],
      "no-unused-vars": ["warn", {
        // Ignorar variables de catch (e, err, error, _e, _) — son intencionales
        "caughtErrors": "none",
        // Ignorar args/vars que empiezan con _ (convención de "ignorar a propósito")
        "varsIgnorePattern": "^_",
        "argsIgnorePattern": "^_",
      }],
      // Mismo criterio que en js/**/*.js — ver comentario en ese bloque.
      // Excepciones puntuales llevan // eslint-disable-line no-console con el motivo
      // (típicamente: script clásico pre-módulo, antes de que logger.js se importe).
      "no-console": ["warn", { allow: ["assert", "clear"] }],
    },
  },

  // ── tests/ — dos reglas que aquí no describen ningún defecto ──────────────────
  //
  // NO-CONSOLE. La regla existe porque el código de la app debe pasar por el logger
  // centralizado, que respeta CONFIG.DEBUG.NIVEL_LOG. En un test esa razón no aplica por
  // tres motivos distintos, los tres comprobados uno a uno:
  //
  //   1. Varios tests ESPÍAN la consola para comprobar el logger: sustituyen console.warn
  //      por un recolector y verifican qué se emitió (59-nivel-de-log, 62-log-seleccion,
  //      67-flecha-una-sola-fuente). Sin console no hay nada que espiar.
  //   2. Otros la usan para avisar de que un test quedó INDETERMINADO, que es información
  //      que el desarrollador necesita ver (05-queues-draining, 06-race-conditions).
  //   3. Los scripts sueltos IMPRIMEN su informe por consola: esa es toda su salida
  //      (run-master-test.js, test_datos_solicitar_paradas_combinados.js,
  //      07-performance-baseline).
  //
  // Ninguno es depuración olvidada. Se comprobó leyendo los 80 casos, no por el nombre del
  // método — clasificarlos por si eran log/info/debug daba una respuesta equivocada.
  //
  // IMPORT/NO-UNRESOLVED. Los tests hacen `await import('/js/funciones-mapa.js')` DENTRO de
  // page.evaluate(), o sea en el navegador, donde `/js/…` resuelve desde la raíz del
  // servidor y `./js/…` desde la URL de la página. Las dos formas funcionan; ninguna existe
  // como ruta de disco, que es lo único que ESLint sabe mirar. El código es correcto y lo
  // demuestra que esos tests pasan.
  //
  // Se ignoran SOLO esas dos formas (`/js/…` y `./js/…`). Un `require('../../js/x.js')`
  // de verdad roto se sigue detectando, porque no casa con el patrón.
  {
    files: ["tests/**/*.js"],
    rules: {
      "no-console": "off",
      "import/no-unresolved": ["error", { ignore: ["^\\.?/js/"] }],
    },
  },

  // Las páginas de prueba manuales (tests/test_*.html) son herramientas de desarrollo que
  // se abren a mano en el navegador. Tres reglas no describen ningún defecto aquí:
  //
  //   no-console  — enseñan su resultado por consola, igual que los scripts sueltos, y no
  //                 tienen — ni deben tener — el logger de la app cargado.
  //
  //   no-undef    — el plugin de HTML analiza CADA bloque <script> por separado, así que
  //                 una función definida en un bloque y llamada en otro sale como "no
  //                 definida". Comprobado: `addResult` está declarado en el mismo fichero,
  //                 solo que en el primero de sus dos bloques. Los 19 casos eran de esto.
  //
  //   no-unused-vars — estas páginas cablean sus funciones desde atributos `onclick="..."`
  //                 del HTML, que ESLint no lee: `clearLog`, `testAccesoDirecto` y compañía
  //                 salían como "nunca usadas" teniéndolas en un botón al lado.
  //
  // LO QUE SE PIERDE, y se acepta a sabiendas: de los 38 avisos de `no-unused-vars`, 21
  // eran ese falso positivo del `onclick`, pero **17 sí eran reales** — 14 variables y 3
  // argumentos sin usar. Son páginas de desarrollo que no viajan a la PWA, así que se
  // prefiere no tener ruido a cazar esos 17.
  {
    files: ["tests/**/*.html"],
    rules: {
      "no-console": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },

  // ── Ignorar carpetas generadas ────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      "backend/coverage/**",
      "tests/e2e/playwright-report.json",
      // El informe HTML que genera Playwright en cada tanda: JavaScript minificado de
      // terceros, con su propio estilo. Analizarlo no dice nada del proyecto y ahogaba el
      // resto: 542 de los 636 avisos salían de este único fichero. `.gitignore` ya lo
      // excluye (línea 32), así que ni siquiera está en el repositorio.
      "tests/e2e/report/**",
    ],
  },
];
