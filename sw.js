/**
 * sw.js — Valencia VGuides Service Worker
 *
 * Estrategia: Network First para el shell de la app, Network Only para media.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CACHE_VERSION: SHA-256 auto-generada vía tools/build-sw.js,    ║
 * ║  disparada por el hook de pre-commit (tools/install-hooks.js)   ║
 * ║  y por `npm run dev:watch` (tools/watch-sw.js) — ver §21.       ║
 * ║                                                                  ║
 * ║  ESTRATEGIAS DE CACHÉ:                                          ║
 * ║  · Shell (HTML/JS/manifest): Network First → caché SW           ║
 * ║  · Media (/audios-aventuras/, /videos-aventuras/,               ║
 * ║    /imagenes/imagenes-aventuras/, /imagenes/imagenes-mapas-      ║
 * ║    vintage/): Cache First + LRU (máx. 100 entradas)            ║
 * ║  · API (/api/): Network Only, sin caché                         ║
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
  '/js/monitoreo.js',
  '/js/funciones-mapa.js',
  '/js/api-client.js',
  '/js/suppress-warnings.js',
  '/js/proteccion.js',
  '/js/controladores-padre.js',
  '/js/normativa-cumplimiento.js',
  '/js/reciclaje-digital.js',
  '/js/traducciones-ui.js',
  '/js/feedback-forms.js',
  '/js/data-loader.js',
  '/js/video-playback-utils.js',
  // Datos de aventuras (se actualizan con Network First en runtime)
  '/js/indice-aventuras.js',
  '/js/coordenadas-aventuras.js',
  '/js/audios-aventuras.js',
  '/js/retos-aventuras.js',
  '/js/puzzles-aventuras.js',
  '/js/textos-aventuras.js',
  '/js/terminos-aventuras.js',
  '/js/aventuras-ID-padre.js',
  '/js/agradecimientos-aventuras.js',
  '/js/mapa-vintage-aventuras.js',
  // Iconos
  '/imagenes/imagenes-aplicación/logo-redondo.png',
  '/imagenes/imagenes-aplicación/logo-redondo-fondo-blanco.jpg',
];

// ─── CACHE_VERSION: Auto-generada en pre-commit ──────────────────────────────
// El archivo tools/build-sw.js calcula un SHA-256 de:
// 1) sw.js normalizado (ignorando la línea CACHE_VERSION) y
// 2) contenido completo de todos los archivos listados en APP_SHELL.
// Así, cualquier cambio real de shell (HTML/JS/CSS/manifest/íconos) actualiza
// la versión de caché automáticamente en pre-commit y en dev:watch.
// El navegador detecta el cambio byte-a-byte y re-registra el SW automáticamente.
const CACHE_VERSION = 'v-3cababcb1479';
const IS_DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const CACHE_NAME = `vvguides-shell-${CACHE_VERSION}`;
const MEDIA_CACHE_NAME = 'vvguides-media-v1';
const MEDIA_CACHE_MAX_ENTRIES = 100; // Máximo 100 archivos media en caché

// ─── Rutas de media (audios/videos/imágenes) cacheable con límite ────────────
// Estrategia: Cache First con límite para permitir uso offline
// y evitar re-descargas innecesarias
function esMedia(url) {
  const p = url.pathname;
  return (
    p.startsWith('/audios-aventuras/') ||
    p.startsWith('/videos-aventuras/') ||
    p.startsWith('/imagenes/imagenes-aventuras/') ||
    p.startsWith('/imagenes/imagenes-mapas-vintage/')
  );
}

function esApi(url) {
  return url.pathname.startsWith('/api/');
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

// ─── FETCH: estrategias diferenciadas ────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo manejar peticiones del mismo origen (no CDN externas)
  if (url.origin !== self.location.origin) return;

  // Solo peticiones GET
  if (event.request.method !== 'GET') return;

  // Localhost/dev: siempre red directa, sin caché SW — el dev siempre ve la versión más reciente
  if (IS_DEV) {
    event.respondWith(fetch(new Request(event.request, { cache: 'no-store' })));
    return;
  }

  // Videos: nunca interceptar — las range requests del browser deben ir directas
  // a red para evitar latencia extra por request y bugs de cache con 206 parciales.
  if (url.pathname.startsWith('/videos-aventuras/')) return;

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

  // Shell y módulos JS: Network First
  // → Intenta red primero (contenido fresco), bypasseando el caché HTTP
  //   del navegador (cache:'no-store') para que el SW siempre vea la versión
  //   real del servidor y no una copia vieja del caché HTTP.
  // → Si falla (sin conexión), sirve desde caché SW
  event.respondWith(
    fetch(new Request(event.request, { cache: 'no-store' }))
      .then(response => {
        // Solo cachear respuestas válidas (200 OK)
        if (response.ok && response.status !== 206) {
          const clon = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clon));
        }
        return response;
      })
      .catch(() => caches.match(event.request)
        .then(cached => cached || new Response('Sin conexión', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        }))
      )
  );
});

