const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = 8080;

// ========================================
// PROTECCIÓN DE ARCHIVOS SENSIBLES
// ========================================
// En producción (PROTECT_DATA=true), bloquear acceso directo a ficheros
// que contienen datos de aventuras (coordenadas, respuestas, textos, audios).
// El frontend debe obtener estos datos a través de la API autenticada.
//
// ADVERTENCIA — PROTECT_DATA=true requiere BACKEND_READY=true en js/data-loader.js:
// mientras el frontend siga en DATA_MODE='local' (BACKEND_READY=false, el valor por
// defecto — ver js/data-loader.js), el propio arranque del padre importa directamente
// estos mismos ficheros protegidos (Fase 2, codigo-padre.html). Si PROTECT_DATA=true
// se activa sin que exista y esté probado un backend real, la app entera deja de
// arrancar (403 en vez de JavaScript válido). Ver docs/GUIA-COMPLETA.md §16.
const PROTECT_DATA = process.env.PROTECT_DATA === 'true';
if (PROTECT_DATA) {
    console.warn('⚠️  PROTECT_DATA=true — asegúrate de que BACKEND_READY=true en js/data-loader.js y que el backend real está desplegado. Si no, la app no arrancará (ver comentario arriba).');
}

const PROTECTED_FILES = [
    '/js/coordenadas-aventuras.js',
    '/js/textos-aventuras.js',
    '/js/retos-aventuras.js',
    '/js/puzzles-aventuras.js',
    '/js/audios-aventuras.js',
    '/js/parrafos-textos/',       // En producción se sirve vía GET /api/textos/:idioma
    '/audios-aventuras/',         // MP3 de contenido de pago — acceso solo vía API autenticada
    '/imagenes/imagenes-aventuras/',   // Fotos de contenido de pago — acceso solo vía API autenticada
    '/videos-aventuras/',              // Vídeos de contenido de pago (dron por parada) — igual que audio
    '/backend/'
];

function isProtectedFile(urlPath) {
    if (!PROTECT_DATA) return false;
    const normalized = urlPath.split('?')[0].toLowerCase();
    return PROTECTED_FILES.some(pf => normalized.startsWith(pf.toLowerCase()));
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Permissions Policy: permite solo geolocalización (GPS), bloquea el resto
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=(), payment=(), usb=(), bluetooth=()');
  // Feature-Policy: alias legacy para navegadores antiguos
  res.setHeader('Feature-Policy', 'geolocation \'self\'; camera \'none\'; microphone \'none\'');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Bloquear acceso a archivos sensibles en producción
  if (isProtectedFile(req.url)) {
    console.warn(`🚫 Acceso bloqueado a archivo protegido: ${req.url}`);
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: true,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'Este recurso no está disponible directamente. Use la API autenticada.'
    }));
    return;
  }

  // Determine file path — con protección contra path traversal
  const urlPath = req.url.split('?')[0]; // eliminar query string antes de resolver
  const safePath = path.resolve('.', '.' + urlPath);
  const rootPath = path.resolve('.');
  if (!safePath.startsWith(rootPath + path.sep) && safePath !== rootPath) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, codigo: 'ACCESO_DENEGADO', mensaje: 'Ruta no permitida.' }));
    return;
  }
  let filePath = safePath;
  if (urlPath === '/') {
    filePath = path.join(rootPath, 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  // Read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      const headers = { 'Content-Type': mimeType };
      // El SW debe llegar siempre fresco para que el navegador detecte cambios de versión
      if (urlPath === '/sw.js') headers['Cache-Control'] = 'no-store';
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Servidor HTTP corriendo en http://localhost:${port}`);
  console.log(`📁 Sirviendo archivos desde: ${process.cwd()}`);
  console.log(`\n🌐 Abre en tu navegador:`);
  console.log(`   http://localhost:${port}/tests/test-codigo-padre.html`);
  console.log(`   http://localhost:${port}/codigo-padre.html`);
});