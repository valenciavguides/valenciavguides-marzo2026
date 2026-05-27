const importPlugin = require("eslint-plugin-import");
const htmlPlugin = require("eslint-plugin-html");

module.exports = [
  // ── JS modules (js/ y backend/) ──────────────────────────────────────────
  {
    files: ["js/**/*.js", "backend/**/*.js", "tests/**/*.js"],
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
        // CommonJS detection pattern: typeof module !== 'undefined'
        module: "writable",

        // ── Librerías externas ────────────────────────────────────────────
        L: "readonly",           // Leaflet

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
        broadcastToCapability: "readonly",

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
        showGpsRestrictedOverlay: "readonly",
        showRotationMessage: "readonly",
        hideRotationMessage: "readonly",
        toggleRotationMessage: "readonly",
        updateLoadingStatus: "readonly",
        btnTop: "readonly",
        codigo: "readonly",
        notifError: "readonly",

        // ── Globals propios — funciones de mapa/GPS ──────────────────────
        activarGPS: "readonly",
        desactivarGPS: "readonly",
        getPosicionUsuario: "readonly",
        updatePendingDistances: "readonly",
        _obtenerCoordenadasP0Fallback: "readonly",
        solicitarCoordenadasHijo: "readonly",
        solicitarCoordenadasAHijo2: "readonly",
        seleccionarAventura: "readonly",

        // ── Globals propios — funciones de audio/aventura ────────────────
        solicitarAudioAHijo3: "readonly",
        obtenerAudioFiles: "readonly",
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
    },
  },

  // ── Ignorar carpetas generadas ────────────────────────────────────────────
  {
    ignores: [
      "node_modules/**",
      "backend/coverage/**",
      "tests/e2e/playwright-report.json",
    ],
  },
];
