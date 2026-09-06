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
    '/js/parrafos-textos/',       // En producción se sirve vía GET /api/textos/:aventuraId/:idioma
    '/audios-aventuras/',         // MP3 de contenido de pago — acceso solo vía API autenticada
    '/imagenes/imagenes-aventuras/',   // Fotos de contenido de pago — acceso solo vía API autenticada
    '/videos-aventuras/',              // Vídeos de contenido de pago (dron por parada) — igual que audio
    '/backend/'
];

function isProtectedFile(urlPath) {
    if (!PROTECT_DATA) return false;
    // path.posix.normalize colapsa "..", "." y barras dobles ANTES de comparar — sin esto,
    // "/js/../js/coordenadas-aventuras.js", "/js//coordenadas-aventuras.js" o
    // "/./js/coordenadas-aventuras.js" no empiezan literalmente por ningún prefijo de
    // PROTECTED_FILES (bypass), aunque el path.resolve() de más abajo (que sí normaliza)
    // sirva exactamente el mismo fichero protegido real. Confirmado en auditoría — ver
    // docs/GUIA-COMPLETA.md §22.4.
    const normalized = path.posix.normalize(urlPath.split('?')[0]).toLowerCase();
    return PROTECTED_FILES.some(pf => normalized.startsWith(pf.toLowerCase()));
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  // Las cuatro extensiones habituales de JPEG. `image/jpeg` es el tipo MIME real
  // registrado; `image/jpg` no existe como tipo. Y una extensión ausente de esta tabla
  // cae en 'application/octet-stream', con lo que el navegador puede negarse a
  // renderizarla en un <img>: `.jfif` es la que pone Windows a veces al guardar un
  // JPEG, y `.jpeg` la usa ya alguna imagen del proyecto.
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.webp': 'image/webp',
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

// Se avisa una sola vez por arranque, no en cada fichero servido.
let avisadoUpgrade = false;

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

  // Decodificar %XX (rutas con tildes/ñ, p.ej. imagenes-aplicación) ANTES de
  // cualquier comprobación. Sin esto, isProtectedFile y fs.readFile comparan/abren
  // la cadena codificada literal (que nunca coincide con el nombre real en disco
  // → 404 en ficheros que sí existen, y es además un posible bypass de protección
  // vía %2e%2e si PROTECT_DATA=true).
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, codigo: 'RUTA_INVALIDA', mensaje: 'URL mal formada.' }));
    return;
  }

  // Bloquear acceso a archivos sensibles en producción
  if (isProtectedFile(urlPath)) {
    console.warn(`🚫 Acceso bloqueado a archivo protegido: ${urlPath}`);
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: true,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'Este recurso no está disponible directamente. Use la API autenticada.'
    }));
    return;
  }

  // Determine file path — con protección contra path traversal
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

      // Este servidor sirve por HTTP plano, y todos los HTML llevan
      // `upgrade-insecure-requests` en su meta CSP. WebKit la aplica TAMBIÉN a
      // localhost, así que eleva cada recurso a `https://localhost:8080/...` y falla
      // con SSL connect error: medido, 22 peticiones fallidas y la app clavada en la
      // pantalla de carga porque los módulos de FASE 1 no llegan a importarse. Chromium
      // no lo hace porque considera localhost un origen confiable y exime la directiva.
      //
      // Consecuencia: sin esto, el proyecto `iphone12` de Playwright ejecuta ~300 tests
      // sobre una app que ni siquiera arranca — pasan sin ejercitar nada, y cualquier
      // fallo real de Safari queda invisible.
      //
      // Quitarla aquí NO cambia el CSP efectivo de producción: allí todo se sirve ya por
      // HTTPS desde GitHub Pages, donde la directiva no tiene nada que elevar y este
      // servidor no se ejecuta nunca (es solo desarrollo y tests). El resto del CSP
      // —default-src, script-src, connect-src…— se sirve intacto.
      let cuerpo = content;
      if (extname === '.html') {
        const original = content.toString('utf-8');
        // Se procesa la meta CSP entera, no la cadena suelta: `upgrade-insecure-requests`
        // aparece de DOS formas en el proyecto — como ultima directiva de un CSP largo
        // (codigo-padre.html) y como contenido UNICO de la meta (los otros 14 HTML, entre
        // ellos En-busca-del-tesoro.html y todos los hijos). Un replace que exigiera el `;`
        // previo se dejaba fuera la segunda forma, que es la mayoritaria.
        const ajustado = original
          .replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, (tag) => {
            if (!/upgrade-insecure-requests/i.test(tag)) return tag;
            const limpio = tag.replace(/\s*;?\s*upgrade-insecure-requests\s*;?/gi, '');
            // Si la directiva era lo unico que habia, la meta entera sobra.
            return /content=["']\s*["']/i.test(limpio) ? '' : limpio;
          })
          // La meta de HSTS es el segundo motivo del mismo salto a https. Segun la
          // especificacion, Strict-Transport-Security SOLO es valida como cabecera HTTP y
          // un <meta http-equiv> deberia ignorarse — WebKit no lo ignora. En produccion
          // esta meta no aporta nada por ese mismo motivo (quien aplica HSTS de verdad es
          // la cabecera que envia GitHub Pages), asi que retirarla aqui tampoco cambia el
          // comportamiento real.
          .replace(/\s*<meta[^>]*http-equiv=["']Strict-Transport-Security["'][^>]*>/gi, '');
        if (ajustado !== original) {
          cuerpo = Buffer.from(ajustado, 'utf-8');
          if (!avisadoUpgrade) {
            console.log('ℹ️  upgrade-insecure-requests retirado del CSP al servir por HTTP (solo desarrollo — ver comentario en js/server.js)');
            avisadoUpgrade = true;
          }
        }
      }
      res.writeHead(200, headers);
      res.end(cuerpo, 'utf-8');
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