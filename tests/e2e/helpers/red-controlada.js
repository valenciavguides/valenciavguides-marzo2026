/**
 * red-controlada.js — Una red que el spec decide cómo se porta, puesta delante del servidor real de los specs
 *
 * POR QUÉ EXISTE
 *
 * Lo que hace el service worker cuando la red falla solo se mide con el worker en modo producción y con la red fallando
 * por debajo del navegador. Las dos herramientas de Playwright no llegan a los cuatro navegadores: `context.setOffline`,
 * en Firefox y en WebKit, corta también la caché del worker (medido en la sonda de K-176: sin red, ni la copia guardada
 * se podía leer), y `context.route` solo ve las peticiones del worker en Chromium.
 *
 * Aquí el fallo se pone fuera del navegador. Un proxy en 127.0.0.2 —un origen que `sw.js` no trata como desarrollo
 * (`IS_DEV` solo mira `localhost` y `127.0.0.1`), así que su worker corre en modo producción— reenvía cada petición al
 * servidor de los specs (`node js/server.js`, el `webServer` de playwright.config.js, en el 8080). Si una regla del spec
 * casa con la ruta, en vez de reenviarla la deja colgada, contesta un error, corta la conexión o la retrasa. El
 * navegador ve una red de verdad que se porta mal, igual en los cuatro.
 *
 * USO
 *
 *   const { BASE_URL_RED_CONTROLADA, abrirRedControlada } = require('./helpers/red-controlada');
 *   test.use({ baseURL: BASE_URL_RED_CONTROLADA, serviceWorkers: 'allow' });
 *   let red;
 *   test.beforeAll(async () => { red = await abrirRedControlada(); });
 *   test.afterEach(() => red.limpiar());
 *   test.afterAll(() => red.cerrar());
 *
 *   const regla = red.regla(/^\/codigo-padre\.html$/, { modo: 'colgada' });
 *   //   modo 'colgada'  la petición no recibe respuesta nunca (hasta `limpiar()` o `regla.quitar()`, que la sueltan)
 *   //   modo 'cortada'  se corta la conexión sin responder: el `fetch` del navegador rechaza, como sin red
 *   //   modo 'error'    responde `estado` (503 si no se dice) con un cuerpo de texto
 *   //   modo 'retraso'  reenvía al servidor a los `ms` milisegundos, con `cabeceras` añadidas a la respuesta (solo GET)
 *   expect(regla.peticiones, 'la regla se ha usado').toBeGreaterThan(0);
 *
 * La ruta que se compara es el `pathname` decodificado, sin la consulta. La última regla añadida manda sobre las
 * anteriores.
 */
'use strict';

const http = require('http');

const HOST = '127.0.0.2';
const PUERTO = 8092;
const BASE_URL_RED_CONTROLADA = `http://${HOST}:${PUERTO}`;
const DESTINO = { host: '127.0.0.1', port: 8080 };

/** Reenvía la petición al servidor real y devuelve su respuesta tal cual, con `cabeceras` añadidas. */
function reenviar(req, res, cabeceras = {}) {
  const ida = http.request({ ...DESTINO, path: req.url, method: req.method, headers: req.headers }, (vuelta) => {
    res.writeHead(vuelta.statusCode, { ...vuelta.headers, ...cabeceras });
    vuelta.pipe(res);
  });
  ida.on('error', () => res.destroy());
  if (req.method === 'GET' || req.method === 'HEAD') ida.end();
  else req.pipe(ida);
}

function rutaDe(req) {
  try {
    return decodeURIComponent(new URL(req.url, BASE_URL_RED_CONTROLADA).pathname);
  } catch {
    return req.url.split('?')[0];
  }
}

/**
 * Arranca el proxy y resuelve cuando ya escucha. Si el puerto está ocupado, falla diciéndolo.
 * @returns {Promise<{ regla: Function, limpiar: Function, cerrar: Function }>}
 */
function abrirRedControlada() {
  const reglas = [];
  const pendientes = new Map(); // respuesta colgada o retrasada → su regla: `limpiar()` y `regla.quitar()` las sueltan

  const soltar = (res) => {
    pendientes.delete(res);
    if (!res.writableEnded) res.destroy();
  };

  const servidor = http.createServer((req, res) => {
    const ruta = rutaDe(req);
    const regla = reglas.find((r) => r.patron.test(ruta));
    if (!regla) {
      reenviar(req, res);
      return;
    }
    regla.peticiones += 1;
    if (regla.modo === 'colgada') {
      pendientes.set(res, regla);
      res.on('close', () => pendientes.delete(res));
      return;
    }
    if (regla.modo === 'cortada') {
      req.socket.destroy();
      return;
    }
    if (regla.modo === 'error') {
      res.writeHead(regla.estado, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(regla.cuerpo);
      return;
    }
    if (regla.modo === 'retraso') {
      pendientes.set(res, regla);
      const t = setTimeout(() => {
        pendientes.delete(res);
        if (!res.destroyed) reenviar(req, res, regla.cabeceras);
      }, regla.ms);
      res.on('close', () => clearTimeout(t));
      return;
    }
    throw new Error(`red-controlada: modo desconocido «${regla.modo}»`);
  });

  const api = {
    /**
     * Añade una regla para las rutas que casen con `patron`. Devuelve la regla, con su cuenta de `peticiones` y su
     * `quitar()`, que también suelta lo que tenga colgado.
     */
    regla(patron, { modo, estado = 503, cuerpo = 'Service Unavailable', ms = 0, cabeceras = {} }) {
      const regla = {
        patron, modo, estado, cuerpo, ms, cabeceras, peticiones: 0,
        quitar() {
          const i = reglas.indexOf(regla);
          if (i >= 0) reglas.splice(i, 1);
          for (const [res, suya] of [...pendientes]) if (suya === regla) soltar(res);
        },
      };
      reglas.unshift(regla);
      return regla;
    },
    /** Quita todas las reglas y suelta lo que siga colgado o retrasado. */
    limpiar() {
      reglas.length = 0;
      for (const res of [...pendientes.keys()]) soltar(res);
    },
    cerrar() {
      api.limpiar();
      servidor.closeAllConnections();
      return new Promise((resolve) => servidor.close(() => resolve()));
    },
  };

  return new Promise((resolve, reject) => {
    servidor.once('error', (error) => reject(new Error(`red-controlada: no se pudo escuchar en ${BASE_URL_RED_CONTROLADA}: ${error.message}`)));
    servidor.listen(PUERTO, HOST, () => resolve(api));
  });
}

module.exports = { BASE_URL_RED_CONTROLADA, abrirRedControlada };
