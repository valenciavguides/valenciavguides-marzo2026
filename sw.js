/**
 * sw.js — Valencia VGuides Service Worker
 *
 * Estrategia: Network First con plazo para el shell de la app, Cache First para las imágenes, y directos a red los
 * audios, los vídeos y la API.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CACHE_VERSION: SHA-256 auto-generada vía tools/build-sw.js,     ║
 * ║  disparada por el hook de pre-commit (tools/install-hooks.js)    ║
 * ║  y por `npm run dev:watch` (tools/watch-sw.js) — ver §21.        ║
 * ║                                                                  ║
 * ║  ESTRATEGIAS DE CACHÉ:                                           ║
 * ║  · Shell (HTML/JS/manifest): Network First con plazo (5 s) →     ║
 * ║    copia guardada, o la página «sin internet» (redPrimero)       ║
 * ║  · Imágenes (/imagenes/imagenes-aventuras/, /imagenes/mapas-     ║
 * ║    vintage/ y /publico/imagenes/): Cache First + LRU (máx. 100   ║
 * ║    entradas)                                                     ║
 * ║  · Audios y vídeos (/audios-aventuras/, /videos-aventuras/,      ║
 * ║    /publico/audios/ y /publico/videos/): sin interceptar, van    ║
 * ║    directos a red (por las peticiones Range)                     ║
 * ║  · API (/api/): Network Only, sin caché                          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─── Build timestamp (metadato opcional; no controla el versionado) ─────────
// @build-ts: 2026-06-17T22:00:00.000Z

// ─── App Shell ────────────────────────────────────────────────────────────────
// Estos ficheros se precargan al instalar el SW.
// Son el esqueleto mínimo para que la app arranque sin red.
const APP_SHELL = [
  '/index.html',
  '/codigo-padre.html',
  '/En-busca-del-tesoro.html',
  '/mapa-completo.html',
  '/coordenadas-hijo2.html',
  '/audio-hijo3.html',
  '/retos-hijo4.html',
  '/boton-casa-hijo5.html',
  '/consejos-valencia.html',
  '/gastronomia.html',
  '/paginas-oficiales-valencia.html',
  '/videos-valencia-historica.html',
  // La X común de esas cuatro páginas, que hijo1 abre en otra ventana:
  '/css/boton-cerrar.css',
  '/puzzle.html',
  '/extrainfo-hijo1.html',
  '/chat-hijo6.html',
  '/video-intro.html',
  '/manifest.json',
  // Lógica de la app
  '/js/constants.js',
  '/js/config.js',
  '/js/utils.js',
  '/js/logger.js',
  '/js/mensajeria.js',
  '/js/app.js',
  '/js/state-manager.js',
  '/js/device-detection.js',
  '/js/validacion.js',
  '/js/funciones-mapa.js',
  '/js/api-client.js',
  '/js/suppress-warnings.js',
  '/js/proteccion.js',
  '/js/almacenamiento.js',
  '/js/controladores-padre.js',
  '/js/normativa-cumplimiento.js',
  '/js/reciclaje-digital.js',
  '/js/traducciones-ui.js',
  '/js/feedback-forms.js',
  '/js/data-loader.js',
  '/js/video-playback-utils.js',
  '/js/efectos-sonido.js',
  '/js/capa-con-atras.js',
  // El zoom de los mapas antiguos (lo cargan el padre y la selección):
  '/js/mapa-vintage-zoom.js',
  '/css/mapa-vintage-zoom.css',
  // Librerías de terceros que el shell carga como código (<script>/<link>):
  // MapLibre desde codigo-padre.html, page-flip desde video-intro.html.
  '/js/vendor/maplibre-gl-csp.js',
  '/js/vendor/maplibre-gl-csp-worker.js',
  '/js/vendor/maplibre-gl.css',
  '/js/vendor/page-flip.browser.js',
  // Datos de las aventuras que el servidor no protege (se actualizan con Network First en runtime). Los de pago —los de
  // PROTECTED_FILES en js/server.js— no se precargan: se descargan cuando la app los importa, tras el pago (spec 151,
  // SW-3).
  '/js/indice-aventuras.js',
  '/js/terminos-aventuras.js',
  '/js/aventuras-ID-padre.js',
  '/js/agradecimientos-aventuras.js',
  '/js/mapa-vintage-aventuras.js',
  // Iconos
  '/imagenes/imagenes-aplicación/logo-redondo.png',
  '/imagenes/imagenes-aplicación/logo-redondo-fondo-blanco.jpg',
  '/imagenes/imagenes-aplicación/logo-splash-192.png',
  '/imagenes/imagenes-aplicación/logo-splash-512.png',
  // La imagen del aviso de sin conexión (_ensureInternetOverlay de codigo-padre.html): el aviso sale justo cuando no hay
  // red, y entonces ya no se puede descargar (spec 151, SW-2).
  '/imagenes/imagenes-aplicación/imagen-no-internet.png',
  // La página «sin internet» (redPrimero, más abajo): el worker la sirve en lugar de una página de la app que no llega y
  // de la que no tiene copia, así que tiene que estar guardada antes (spec 165, SWR-10). Enseña la imagen de arriba.
  '/sin-conexion.html',
  // Efectos de sonido (js/efectos-sonido.js). No son /audios-aventuras/: esa ruta no la intercepta
  // el SW y el servidor la protege como contenido de pago, y estos suenan antes de pagar.
  '/audios-efectos/sonido_eleccion_respuesta_reto.mp3',
  '/audios-efectos/sonido_pieza_colocada.mp3',
  '/audios-efectos/sonido_reto_completado.mp3',
  '/audios-efectos/sonido_tiempo_acabado.mp3',
];

// ─── CACHE_VERSION: Auto-generada en pre-commit ──────────────────────────────
// El archivo tools/build-sw.js calcula un SHA-256 de:
// 1) sw.js normalizado (ignorando la línea CACHE_VERSION) y
// 2) el contenido de todos los ficheros del shell, descubiertos automáticamente
//    (ficherosDelShell) — todo el HTML/JS/CSS/JSON que el navegador carga como
//    código, no la lista de APP_SHELL de arriba. Son cosas distintas a propósito:
//    APP_SHELL dice qué se PRECARGA para uso offline; el hash dice qué cuenta
//    como versión. Un fichero de app nuevo entra en el hash solo, sin tocar nada.
// Así, cualquier cambio real de shell actualiza la versión de caché
// automáticamente en pre-commit y en dev:watch.
// El navegador detecta el cambio byte-a-byte y re-registra el SW automáticamente.
const CACHE_VERSION = 'v-026bfb623f5e';
const IS_DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const CACHE_NAME = `vvguides-shell-${CACHE_VERSION}`;
const MEDIA_CACHE_NAME = 'vvguides-media-v1';
const MEDIA_CACHE_MAX_ENTRIES = 100; // Máximo 100 archivos media en caché

// ─── Plazo de la red en el Network First (shell, módulos y datos de js/) ─────
// La red tiene este tiempo para empezar a contestar (las cabeceras: el cuerpo puede seguir llegando después). Pasado el
// plazo se sirve la copia guardada, si la hay: una cobertura mala que deja la petición colgada no deja la app —ni la
// recarga de un hijo que hace el supervisor— sin su página (K-60, K-176; spec 165).
const PLAZO_RED_MS = 5000;
const PLAZO_VENCIDO = Symbol('plazo vencido');
const SIN_RED = Symbol('sin red');

// ─── Imágenes de las aventuras y mapas antiguos, cacheables con límite ───────
// Estrategia: Cache First con límite para permitir uso offline
// y evitar re-descargas innecesarias. Los audios y los vídeos no llegan aquí: el manejador
// `fetch` los deja ir directos a red antes de mirar esta lista.
function esMedia(url) {
  const p = url.pathname;
  return (
    p.startsWith('/imagenes/imagenes-aventuras/') ||
    p.startsWith('/imagenes/imagenes-idiomas/') ||
    p.startsWith('/imagenes/mapas-vintage/') ||
    p.startsWith('/publico/imagenes/')
  );
}

function esApi(url) {
  return url.pathname.startsWith('/api/');
}

function sinConexion() {
  return new Response('Sin conexión', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

/**
 * La página «sin internet» (sin-conexion.html, de la precarga): la imagen del aviso y el botón 🌐🔄, sin texto. Se sirve
 * en lugar de una página de la app que no ha llegado y no tiene copia; su botón vuelve a pedir esa misma dirección. Si
 * tampoco ella está guardada, queda el 503 de texto.
 */
async function paginaSinConexion(pathname) {
  const pagina = await caches.match('/sin-conexion.html');
  console.warn(`[SW] ${pathname}: sin copia guardada; se sirve ${pagina ? 'la página «sin internet»' : 'un 503 (la página «sin internet» tampoco está guardada)'}`);
  return pagina || sinConexion();
}

/** Por qué la red no ha dado algo bueno, para el aviso de la consola. */
function motivoDeLaRed(resultado) {
  if (resultado === PLAZO_VENCIDO) return `la red no contestó en ${PLAZO_RED_MS / 1000} s`;
  if (resultado === SIN_RED) return 'sin conexión';
  return `la red contestó ${resultado.status}`;
}

/**
 * Network First con plazo, para el shell, los módulos y los datos de js/. Cada respuesta buena de la red se guarda bajo
 * `clave`, también la que llega cuando ya se ha servido la copia por el plazo: la próxima vez sale la nueva. Una
 * respuesta por debajo de 400 (incluida la redirección opaca de una navegación) se devuelve tal cual. Si no:
 *
 *   | La red…                      | Con copia | Sin copia, una página       | Sin copia, un dato           |
 *   |------------------------------|-----------|-----------------------------|------------------------------|
 *   | rechaza (sin conexión)       | la copia  | la página «sin internet»    | 503 «Sin conexión»           |
 *   | contesta 5xx                 | la copia  | la página «sin internet»    | el 5xx tal cual              |
 *   | contesta 4xx                 | la copia  | el 4xx tal cual             | el 4xx tal cual              |
 *   | no contesta en PLAZO_RED_MS  | la copia  | la página «sin internet»    | se sigue esperando a la red  |
 *
 * La copia gana ante cualquier error porque lo que se pide es que la app cargue. Sin copia, un 4xx es la respuesta del
 * servidor (una página que no existe no es «sin internet»). Un dato sin copia espera a la red porque no hay nada que
 * servir en su lugar: el plazo y los reintentos son de quien lo pide. Una página sin copia no espera: sale la página
 * «sin internet», con su botón para volver a pedirla. Cada vez que se usa la copia o esa página, lo dice la consola.
 */
async function redPrimero(event, clave) {
  const { request } = event;
  const { pathname } = new URL(request.url);
  let guardar = null;
  const red = fetch(new Request(request, { cache: 'no-store' })).then(response => {
    if (response.ok && response.status !== 206) {
      const clon = response.clone();
      guardar = caches.open(CACHE_NAME).then(cache => cache.put(clave, clon));
    }
    return response;
  });
  // El worker sigue vivo hasta que la red termine y lo bueno quede guardado, aunque ya se haya servido la copia.
  event.waitUntil(red.then(() => guardar).catch(() => {}));

  let temporizador;
  const plazo = new Promise(resolve => { temporizador = setTimeout(resolve, PLAZO_RED_MS, PLAZO_VENCIDO); });
  let resultado;
  try {
    resultado = await Promise.race([red, plazo]);
  } catch {
    resultado = SIN_RED;
  } finally {
    clearTimeout(temporizador);
  }
  if (resultado !== PLAZO_VENCIDO && resultado !== SIN_RED && resultado.status < 400) return resultado;

  // ignoreSearch:true: el botón «Actualizar» añade su `_v` a la navegación, y la precarga solo tiene la ruta limpia.
  const copia = await caches.match(request, { ignoreSearch: true });
  if (copia) {
    console.warn(`[SW] ${pathname}: ${motivoDeLaRed(resultado)}; se sirve la copia guardada`);
    return copia;
  }
  const esPagina = request.mode === 'navigate';
  if (resultado === PLAZO_VENCIDO) return esPagina ? paginaSinConexion(pathname) : red.catch(sinConexion);
  if (resultado === SIN_RED) return esPagina ? paginaSinConexion(pathname) : sinConexion();
  if (esPagina && resultado.status >= 500) return paginaSinConexion(pathname);
  return resultado;
}

// ─── INSTALL: precargar el app shell ─────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // addAll falla si cualquier recurso devuelve error.
        // Precachamos en paralelo pero toleramos fallos individuales.
        return Promise.allSettled(
          APP_SHELL.map(url =>
            fetch(new Request(url, { cache: 'reload' }))
              .then(res => { if (res.ok) return cache.put(url, res); })
              .catch(err => console.warn(`[SW] No se pudo precargar: ${url}`, err))
          )
        );
      })
      .then(() => {
        console.log(`[SW] Instalado: ${CACHE_NAME}`);
        // Activar inmediatamente sin esperar a que el usuario cierre tabs
        return globalThis.skipWaiting();
      })
  );
});

// ─── ACTIVATE: limpiar cachés de versiones anteriores ────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key =>
            (key.startsWith('vvguides-shell-') && key !== CACHE_NAME) ||
            (key.startsWith('vvguides-media-') && key !== MEDIA_CACHE_NAME)
          )
          .map(key => {
            console.log(`[SW] Eliminando caché antigua: ${key}`);
            return caches.delete(key);
          })
      ))
      .then(() => {
        console.log(`[SW] Activado: ${CACHE_NAME} + ${MEDIA_CACHE_NAME}`);
        return globalThis.clients.claim();
      })
      .then(() => globalThis.clients.matchAll({ type: 'window' }))
      .then(clientList => {
        clientList.forEach(c => c.postMessage({ tipo: 'SW_ACTIVADO', version: CACHE_VERSION }));
        if (clientList.length) console.log(`[SW] SW_ACTIVADO enviado a ${clientList.length} cliente(s)`);
      })
  );
});

// ─── MESSAGE: responder qué versión está corriendo ───────────────────────────
// La página (codigo-padre.html) necesita saber qué CACHE_VERSION ejecuta el SW
// que la controla AHORA para poder compararla con la desplegada (version.json).
// Es el único dato fiable: cualquier valor guardado en localStorage puede haber
// quedado de otra sesión y describir una versión que ya no es la que corre.
// Se responde solo al cliente que pregunta (event.source), nunca en broadcast.
self.addEventListener('message', event => {
  if (event.data?.tipo !== 'SW_VERSION_REQUEST') return;
  event.source?.postMessage({ tipo: 'SW_VERSION', version: CACHE_VERSION });
});

// ─── FETCH: estrategias diferenciadas ────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo manejar peticiones del mismo origen (no CDN externas)
  if (url.origin !== self.location.origin) return;

  // Solo peticiones GET
  if (event.request.method !== 'GET') return;

  // version.json: Network Only, nunca cacheado. Es el fichero que dice qué
  // versión hay desplegada; una copia cacheada respondería con la versión
  // vieja y haría imposible detectar que existe una nueva. Además la página lo
  // pide con un parámetro distinto en cada consulta, así que cachearlo dejaría
  // una entrada basura por consulta en una caché que no tiene límite LRU.
  if (url.pathname === '/version.json') {
    event.respondWith(fetch(new Request(event.request, { cache: 'no-store' })));
    return;
  }

  // Localhost/dev: siempre red directa, sin caché SW — el dev siempre ve la versión más reciente
  if (IS_DEV) {
    event.respondWith(fetch(new Request(event.request, { cache: 'no-store' })));
    return;
  }

  // Videos y audios: nunca interceptar — las range requests del browser deben ir
  // directas a red para evitar latencia extra por request y bugs de cache con 206
  // parciales. Ya está aceptado que el audio requiere conexión en el momento de
  // reproducirse (§25.17); esta exclusión lo hace cierto sin excepción, en vez de
  // depender de si esa parada ya se cacheó antes por casualidad.
  if (url.pathname.startsWith('/videos-aventuras/')) return;
  if (url.pathname.startsWith('/audios-aventuras/')) return;
  if (url.pathname.startsWith('/publico/audios/')) return;
  if (url.pathname.startsWith('/publico/videos/')) return;

  // API: Network Only (sin caché)
  if (esApi(url)) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response('API no disponible sin conexión', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        })
      )
    );
    return;
  }

  // Media: Cache First con límite
  // → Busca primero en caché (rápido, sin consumir datos)
  // → Si no está, descarga de red y guarda (con límite LRU)
  if (esMedia(url)) {
    event.respondWith(
      caches.open(MEDIA_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cached => {
          if (cached) {
            // Encontrado en caché - actualizar timestamp para LRU
            return cached;
          }

          // No en caché - descargar y guardar
          return fetch(event.request).then(response => {
            if (response.ok && response.status !== 206) {
              // Guardar en caché con control de límite
              cache.put(event.request, response.clone()).then(() => {
                // Limpiar entradas antiguas si excede el límite
                cache.keys().then(keys => {
                  if (keys.length > MEDIA_CACHE_MAX_ENTRIES) {
                    // Eliminar las más antiguas (primeras del array)
                    const toDelete = keys.length - MEDIA_CACHE_MAX_ENTRIES;
                    for (let i = 0; i < toDelete; i++) {
                      cache.delete(keys[i]);
                    }
                  }
                });
              });
            }
            return response;
          }).catch(() =>
            new Response('Recurso no disponible sin conexión', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            })
          );
        });
      })
    );
    return;
  }

  // Shell, módulos y datos de js/: Network First con plazo (redPrimero, arriba).
  // → Intenta red primero (contenido fresco), bypasseando el caché HTTP
  //   del navegador (cache:'no-store') para que el SW siempre vea la versión
  //   real del servidor y no una copia vieja del caché HTTP. Se construye
  //   desde event.request para conservar cabeceras, credenciales y modo de
  //   redirección originales — una navegación tiene redirect:'manual', y
  //   responder a una navegación con una respuesta redirigida lanza TypeError.
  // → Clave de caché normalizada (sin `_v`): el botón "Actualizar" recarga con
  //   un `_v=<timestamp>` distinto cada vez, así que sin normalizar cada intento
  //   dejaría otra copia entera de la misma página en una caché que no tiene
  //   límite LRU. Todas las variantes de una misma ruta comparten entrada.
  const _claveCache = new URL(event.request.url);
  _claveCache.searchParams.delete('_v');
  event.respondWith(redPrimero(event, _claveCache.toString()));
});

