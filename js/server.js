const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

// ========================================
// PROTECCIÓN DE ARCHIVOS SENSIBLES
// ========================================
// En producción (PROTECT_DATA=true), bloquear acceso directo a ficheros
// que contienen datos de aventuras (coordenadas, respuestas, textos, audios).
// El frontend debe obtener estos datos a través de la API autenticada.
const PROTECT_DATA = process.env.PROTECT_DATA === 'true';

const PROTECTED_FILES = [
    '/js/coordenadas-aventuras.js',
    '/js/textos-aventuras.js',
    '/js/retos-aventuras.js',
    '/js/puzzles-aventuras.js',
    '/js/audios-aventuras.js',
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

  // Determine file path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
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
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Servidor HTTP corriendo en http://localhost:${port}`);
  console.log(`📁 Sirviendo archivos desde: ${process.cwd()}`);
  console.log(`\n🌐 Abre en tu navegador:`);
  console.log(`   http://localhost:${port}/test-codigo-padre.html`);
  console.log(`   http://localhost:${port}/codigo-padre.html`);
});