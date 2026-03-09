/**
 * sw.js — Valencia VGuides Service Worker
 *
 * Estrategia: Network First para el shell de la app, Network Only para media.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  PARA ACTUALIZAR LA CACHÉ: cambia CACHE_VERSION (ej: v2, v3…)  ║
 * ║  El navegador detectará el cambio y recargará todo en la        ║
 * ║  próxima visita del usuario. El contenido media (audios,        ║
 * ║  videos, imágenes de aventuras) NUNCA se cachea: siempre        ║
 * ║  viene de red. Puedes añadir aventuras/audios/videos sin        ║
 * ║  tocar este fichero.                                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const CACHE_VERSION = 'v2';
const CACHE_NAME = `vvguides-shell-${CACHE_VERSION}`;

// ─── App Shell ────────────────────────────────────────────────────────────────
// Estos ficheros se precargan al instalar el SW.
// Son el esqueleto mínimo para que la app arranque sin red.
const APP_SHELL = [
  '/index.html',
  '/codigo-padre.html',
  '/En-busca-del-tesoro.html',
  '/coordenadas-hijo2.html',
  '/audio-hijo3.html',
  '/retos-hijo4.html',
  '/boton-casa-hijo5.html',
  '/agradecimientos.html',
  '/consejos-valencia.html',
  '/gastronomia.html',
  '/paginas-oficiales-valencia.html',
  '/videos-valencia-historica.html',
  '/puzzle.html',
  '/botones-y-subfunciones-opciones.html',
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
  '/js/error-handler-ui.js',
  '/js/api-client.js',
  '/js/suppress-warnings.js',
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

// ─── Rutas que NUNCA se cachean (siempre desde red) ──────────────────────────
// Audios y videos son demasiado pesados y cambian con cada aventura nueva.
// Las imágenes de aventuras también: el usuario descargará las de la aventura
// actual solo cuando las necesite, sin saturar la caché.
function esMediaOApi(url) {
  const p = url.pathname;
  return (
    p.startsWith('/audios-aventuras/') ||
    p.startsWith('/videos-aventuras/') ||
    p.startsWith('/imagenes/imagenes-aventuras/') ||
    p.startsWith('/imagenes/imagenes-mapas-vintage/') ||
    p.startsWith('/api/')
  );
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
            cache.add(url).catch(err =>
              console.warn(`[SW] No se pudo precargar: ${url}`, err)
            )
          )
        );
      })
      .then(() => {
        console.log(`[SW] Instalado: ${CACHE_NAME}`);
        // Activar inmediatamente sin esperar a que el usuario cierre tabs
        return self.skipWaiting();
      })
  );
});

// ─── ACTIVATE: limpiar cachés de versiones anteriores ────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('vvguides-shell-') && key !== CACHE_NAME)
          .map(key => {
            console.log(`[SW] Eliminando caché antigua: ${key}`);
            return caches.delete(key);
          })
      ))
      .then(() => {
        console.log(`[SW] Activado: ${CACHE_NAME}`);
        // Tomar control de todas las pestañas abiertas inmediatamente
        return self.clients.claim();
      })
  );
});

// ─── FETCH: Network First para shell, Network Only para media ─────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo manejar peticiones del mismo origen (no CDN externas)
  if (url.origin !== self.location.origin) return;

  // Solo peticiones GET
  if (event.request.method !== 'GET') return;

  // Media y API: siempre desde red, sin caché
  if (esMediaOApi(url)) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response('Recurso no disponible sin conexión', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        })
      )
    );
    return;
  }

  // Shell y módulos JS: Network First
  // → Intenta red primero (contenido fresco)
  // → Si falla (sin conexión), sirve desde caché
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Solo cachear respuestas válidas (200 OK)
        if (response.ok) {
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
