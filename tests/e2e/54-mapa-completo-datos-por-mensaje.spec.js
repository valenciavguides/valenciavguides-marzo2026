/**
 * 54-mapa-completo-datos-por-mensaje.spec.js
 *
 * `mapa-completo.html` importaba `DATOS_AVENTURAS` de coordenadas-aventuras.js. Eso
 * tenía dos consecuencias medidas:
 *
 *   · Era uno de los caminos que se saltaban `data-loader.js` (pendiente 13, §22.12).
 *   · Abriendo la URL a pelo entregaba la ruta COMPLETA de la aventura —88 paradas de
 *     Av1 con nombre y coordenadas, y las 7 aventuras accesibles— sin código de compra
 *     ni GPS.
 *
 * Ahora sigue el patrón de los demás hijos: no importa datos, los pide al padre. Sin
 * padre no hay datos y el mapa sale vacío. No hay guard que puentear: sencillamente no
 * tiene nada que pintar.
 *
 *   MC-1  Suelto por URL: ni un marcador, ni polyline, y el aviso al usuario.
 *   MC-2  Suelto por URL: NO descarga coordenadas-aventuras.js (el import se fue).
 *   MC-3  Con un padre que responde: pinta la ruta y los monumentos.
 *   MC-4  El padre solo responde al iframe del overlay, no a cualquiera del mismo origen.
 *   MC-5  La aventura del mapa la decide el padre, la elegida: aunque el mensaje de hijo2 traiga otra aventura y
 *         otra URL, se abre `mapa-completo.html` con la elegida (docs/estudio-caminos.md, K-107). Rojo antes que
 *         verde: el padre anterior abría la URL del mensaje.
 *   MC-6  Los números que el padre da por completados salen en verde, con el verde del listado de paradas; los demás no.
 *   MC-7  Cada MAPA_COMPLETO.VISIBLE repinta los números con la lista al día: los que entran salen verdes, y los que
 *         dejan de estar, no.
 *   MC-8  Con el padre de verdad, el mapa y el listado de paradas dicen lo mismo: un número sale verde en el mapa cuando
 *         todas sus filas del listado están completadas, también las de un puente; la numeración interior de los
 *         Jardines del Real (v…) no se pinta (docs/estudio-caminos.md, K-190).
 *   MC-9  Si el padre no puede calcular los números completados, MAPA_COMPLETO.VISIBLE sale sin lista —una vacía diría
 *         «ninguno completado» y el mapa quitaría los verdes— y el error queda en el log.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const { injectInitSpy, stubCDNResources, gotoAndWaitForFase1 } = require('./helpers/boot');

const MAPLIBRE_STUB = path.join(__dirname, 'helpers/maplibre-stub.js');

test.describe('MC — mapa-completo recibe los datos por mensaje, no por import', () => {

  test('MC-1. Abierto por URL no muestra ruta ni monumentos, y avisa', async ({ page }) => {
    await page.goto('/mapa-completo.html');
    await page.waitForLoadState('networkidle');
    // VENTANA-OBSERVACION: MC-1 comprueba que sin padre NO se pinta nada; hay que dar margen a que se pintara si fuera a pintarse
    await page.waitForTimeout(1500);

    const r = await page.evaluate(() => ({
      marcadores: document.querySelectorAll('.monumento-marker').length,
      polylines: document.querySelectorAll('.leaflet-overlay-pane path').length,
      texto: (document.getElementById('map')?.textContent || '').trim(),
    }));

    expect(r.marcadores, 'sin padre no debe pintarse ni un monumento').toBe(0);
    expect(r.polylines, 'ni la polyline de la ruta').toBe(0);
    expect(r.texto, 'debe explicar por qué no hay mapa').toContain('forma parte de la aventura');
  });

  test('MC-2. Abierto por URL no descarga coordenadas-aventuras.js', async ({ page }) => {
    // Se mide con Resource Timing, no con page.route(): en WebKit la interceptación no
    // ve todas las peticiones (ver EI-4 en 49-escalera-espera-imagen.spec.js).
    await page.goto('/mapa-completo.html');
    await page.waitForLoadState('networkidle');
    // VENTANA-OBSERVACION: MC-2 comprueba que NO se descarga coordenadas-aventuras.js; una condición no puede esperar a algo que no ocurre
    await page.waitForTimeout(1000);

    const pedidos = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .map((e) => e.name)
        .filter((u) => /coordenadas-aventuras\.js/.test(u))
    );

    expect(pedidos, `no debe pedir el fichero de datos: ${pedidos.join(', ')}`).toEqual([]);
  });

  test('MC-3. Con un padre que responde, pinta la ruta y los monumentos', async ({ page }) => {
    // Padre mínimo: solo implementa el lado del protocolo que nos interesa, y lo implementa
    // como lo hace el padre real — tipos de `constants.js` y las coordenadas dentro de
    // `datos`. El bus del mapa acepta a su ventana de arriba, así que no hace falta más.
    await page.route('**/__contenedor-mc.html', (route) => route.fulfill({
      contentType: 'text/html',
      body: `<!DOCTYPE html><html><body>
        <iframe id="f" src="/mapa-completo.html" style="width:100vw;height:100vh;border:0"></iframe>
        <script type="module">
          const m = await import('/js/coordenadas-aventuras.js');
          const { TIPOS_MENSAJE } = await import('/js/constants.js');
          globalThis.addEventListener('message', (ev) => {
            if (ev.data?.tipo !== TIPOS_MENSAJE.MAPA_COMPLETO.SOLICITAR_DATOS) return;
            // Como el padre real: contesta con SU aventura elegida, el mapa no la dice (K-107).
            const c = m.DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html'].coordenadas;
            ev.source.postMessage({
              tipo: TIPOS_MENSAJE.MAPA_COMPLETO.DATOS,
              origen: 'padre',
              destino: 'mapa-completo',
              datos: { coordenadas: c },
            }, globalThis.location.origin);
          });
        <\/script></body></html>`,
    }));

    await page.goto('/__contenedor-mc.html');
    await page.waitForLoadState('networkidle');
    await expect.poll(async () => page.evaluate(() =>
      document.getElementById('f')?.contentDocument?.querySelectorAll('.monumento-marker').length || 0
    ), { timeout: 15000 }).toBeGreaterThan(0);

    const r = await page.evaluate(() => {
      const d = document.getElementById('f').contentDocument;
      return {
        marcadores: d.querySelectorAll('.monumento-marker').length,
        polylines: d.querySelectorAll('.leaflet-overlay-pane path').length,
      };
    });
    expect(r.marcadores, 'los monumentos de referencia deben aparecer').toBeGreaterThan(0);
    expect(r.polylines, 'y la polyline de la ruta').toBeGreaterThan(0);
  });

  test('MC-4. Sin mapa abierto, una petición forjada no saca coordenadas de ningún sitio', async ({ page }) => {
    // Antes el padre comprobaba a mano que la petición viniera del iframe del overlay. Ya no
    // hace falta: la respuesta va DIRIGIDA a `mapa-completo`, y ese nombre solo existe en el
    // bus mientras el overlay está abierto. Sin overlay no hay a quién mandárselas, y quien
    // forjó la petición no recibe nada — no porque se le reconozca, sino porque la respuesta
    // nunca fue para él.
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    const logs = [];
    page.on('console', (m) => logs.push(m.text()));
    await gotoAndWaitForFase1(page);

    // Control: sin esto, MC-4 pasaría también si el handler no existiera —y entonces no
    // estaría comprobando la protección, sino la ausencia del mecanismo entero.
    await expect
      .poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('MAPA_COMPLETO.SOLICITAR_DATOS')), { timeout: 20_000 })
      .toBe(true);

    const recibidos = await page.evaluate(async () => {
      const vistos = [];
      globalThis.addEventListener('message', (ev) => {
        if (ev.data?.tipo === 'MAPA_COMPLETO.DATOS') vistos.push(ev.data);
      });
      globalThis.postMessage({
        tipo: 'MAPA_COMPLETO.SOLICITAR_DATOS',
        origen: 'intruso',
        datos: {},
      }, globalThis.location.origin);
      await new Promise((r) => setTimeout(r, 600));
      return vistos;
    });

    expect(recibidos, 'la petición forjada no puede recibir coordenadas').toEqual([]);

    const entregas = logs.filter((l) => l.includes('[MAPA_COMPLETO] Enviadas'));
    expect(entregas.length, 'y el padre no puede dar por enviadas unas coordenadas que no salieron').toBe(0);
  });

  test('MC-5. La aventura del mapa completo la decide el padre, no el mensaje', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    await gotoAndWaitForFase1(page);
    await expect.poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('NAVEGACION.MOSTRAR_MAPA_COMPLETO')), { timeout: 20_000 }).toBe(true);
    const abierto = await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      const llamadas = [];
      const original = globalThis.mostrarIframeOverlay;
      globalThis.mostrarIframeOverlay = (url, titulo) => { llamadas.push({ url, titulo }); };
      try {
        await globalThis.mensajeria.despacharLocal({
          tipo: globalThis.TIPOS_MENSAJE.NAVEGACION.MOSTRAR_MAPA_COMPLETO,
          datos: { aventura: 'Aventura3', url: 'mapa-completo.html?aventura=Aventura3' },
        });
      } finally { globalThis.mostrarIframeOverlay = original; }
      return llamadas;
    });
    expect(abierto, 'se abre una sola vez').toHaveLength(1);
    expect(abierto[0].url, 'la página del mapa, sin aventura en la URL').toBe('mapa-completo.html');
    expect(abierto[0].titulo, 'con la aventura elegida, no la del mensaje').toContain('Aventura1');
  });

  /**
   * Un contenedor que contesta como el padre: a MAPA_COMPLETO.SOLICITAR_DATOS, las coordenadas de la Aventura1 con su
   * primer número de monumento como completado; y deja `globalThis.__visible(numeros)` para mandar MAPA_COMPLETO.VISIBLE.
   */
  const contenedorConCompletados = (page) => page.route('**/__contenedor-verde.html', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!DOCTYPE html><html><body>
      <iframe id="f" src="/mapa-completo.html" style="width:100vw;height:100vh;border:0"></iframe>
      <script type="module">
        const m = await import('/js/coordenadas-aventuras.js');
        const { TIPOS_MENSAJE } = await import('/js/constants.js');
        const c = m.DATOS_AVENTURAS.Aventura1['coordenadas-hijo2.html'].coordenadas;
        const numeros = [...new Set(c.filter((e) => e.tipo === 'referencia').map((e) => String(e.mapa_numero)))];
        globalThis.__caso = { a: numeros[0], b: numeros[1] };
        const mandar = (tipo, datos) => document.getElementById('f').contentWindow.postMessage({ tipo, origen: 'padre', destino: 'mapa-completo', datos }, globalThis.location.origin);
        globalThis.__visible = (numerosCompletados) => mandar(TIPOS_MENSAJE.MAPA_COMPLETO.VISIBLE, { numerosCompletados });
        globalThis.addEventListener('message', (ev) => {
          if (ev.data?.tipo !== TIPOS_MENSAJE.MAPA_COMPLETO.SOLICITAR_DATOS) return;
          mandar(TIPOS_MENSAJE.MAPA_COMPLETO.DATOS, { coordenadas: c, numerosCompletados: [globalThis.__caso.a] });
        });
      <\/script></body></html>`,
  }));

  /** Los números de los círculos en verde, en el iframe del mapa. */
  const numerosEnVerde = (frame) => frame.evaluate(() => [...document.querySelectorAll('.monumento-marker.completado')]
    .map((el) => el.textContent.replace('🏛️', '').trim()).sort());

  test('MC-6. Los números que el padre da por completados salen en verde; los demás no', async ({ page }) => {
    await contenedorConCompletados(page);
    await page.goto('/__contenedor-verde.html');
    await expect.poll(() => page.evaluate(() => document.getElementById('f')?.contentDocument?.querySelectorAll('.monumento-marker').length || 0), { timeout: 15000 }).toBeGreaterThan(1);
    const caso = await page.evaluate(() => globalThis.__caso);
    const frame = page.frame({ url: /mapa-completo\.html/ });
    await expect.poll(() => numerosEnVerde(frame)).toEqual([caso.a]);
    const fondo = await frame.evaluate(() => getComputedStyle(document.querySelector('.monumento-marker.completado')).backgroundColor);
    expect(fondo, 'el verde de completado, el mismo del listado de paradas').toBe('rgb(30, 126, 52)');
  });

  test('MC-7. Cada VISIBLE repinta los números con la lista al día: los que entran, en verde; los que salen, no', async ({ page }) => {
    await contenedorConCompletados(page);
    await page.goto('/__contenedor-verde.html');
    const frame = page.frame({ url: /mapa-completo\.html/ });
    const caso = await page.evaluate(() => globalThis.__caso);
    await expect.poll(() => numerosEnVerde(frame), { timeout: 15000 }).toEqual([caso.a]);
    await page.evaluate(() => globalThis.__visible([globalThis.__caso.a, globalThis.__caso.b]));
    await expect.poll(() => numerosEnVerde(frame)).toEqual([caso.a, caso.b].sort());
    await page.evaluate(() => globalThis.__visible([globalThis.__caso.b]));
    await expect.poll(() => numerosEnVerde(frame)).toEqual([caso.b]);
  });

  test('MC-8. Con el padre de verdad, el mapa y el listado de paradas dicen lo mismo', async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    // El mapa completo pinta con Leaflet, que el arnés sustituye por un fichero vacío: aquí se deja pasar el de verdad, como
    // en el spec 131 (BA-9). La ruta registrada después es la que se aplica.
    await page.route('**/cdnjs.cloudflare.com/ajax/libs/leaflet/**', (route) => route.continue());
    await gotoAndWaitForFase1(page);
    await expect.poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('NAVEGACION.MOSTRAR_MAPA_COMPLETO')), { timeout: 20_000 }).toBe(true);
    // La Aventura34km a algo más de media ruta: hechos el punto de salida y el 60 % de las paradas, que pasan por sus
    // puentes (números sin parada propia), y además todas las de la numeración interior de los Jardines del Real (v…),
    // que no se pinta. Primero el listado.
    const conParada = await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura34km';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
      const c = globalThis.__vv_DATOS_AVENTURAS.Aventura34km['coordenadas-hijo2.html'].coordenadas;
      const puntos = c.filter((e) => e.tipo === 'inicio' || e.tipo === 'parada');
      const hechos = puntos.slice(0, Math.ceil(puntos.length * 0.6)).map((e) => e.id);
      const delJardin = puntos.filter((e) => String(e.mapa_numero).startsWith('v')).map((e) => e.id);
      globalThis.estado.paradasCompletadas = new Map([...hechos, ...delJardin].map((id) => [id, { completada: true }]));
      await globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: { timestamp: Date.now() } });
      // Los números que lleva alguna parada (o el punto de salida): un verde que no esté aquí es un puente.
      return [...new Set(puntos.flatMap((e) => String(e.mapa_numero ?? '').split(/[,/]|-(?=v)/)))];
    });
    // El listado: un número está completado si lo están todas sus filas (las de la numeración interior no cuentan).
    await expect.poll(() => page.evaluate(() => document.querySelectorAll('#ventana-listado-paradas-padre .listado-parada-fila').length), { timeout: 20_000 }).toBeGreaterThan(100);
    const delListado = await page.evaluate(() => {
      const completado = new Map();
      for (const fila of document.querySelectorAll('#ventana-listado-paradas-padre .listado-parada-fila')) {
        const numeros = (fila.querySelector('.listado-parada-pin')?.textContent || '').replace('📍', '').split(',').filter(Boolean);
        const hecha = fila.querySelector('.listado-parada-circulo')?.classList.contains('completada') === true;
        for (const n of numeros) if (!n.startsWith('v')) completado.set(n, (completado.get(n) ?? true) && hecha);
      }
      return [...completado].filter(([, hecho]) => hecho).map(([n]) => n);
    });
    // Se cierra el listado y se abre el mapa: sus verdes son esos mismos números, entre los que tienen monumento.
    await page.evaluate(async () => {
      await globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.PARADAS.LISTADO_TOGGLE, datos: { timestamp: Date.now() } });
      await globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.NAVEGACION.MOSTRAR_MAPA_COMPLETO, datos: {} });
    });
    await expect.poll(() => page.frames().some((f) => f.url().includes('mapa-completo.html')), { timeout: 10_000 }).toBe(true);
    const frame = page.frames().find((f) => f.url().includes('mapa-completo.html'));
    await frame.waitForFunction(() => document.querySelectorAll('.monumento-marker').length > 0, null, { timeout: 30_000 });
    const conMonumento = await frame.evaluate(() => [...document.querySelectorAll('.monumento-marker')].map((el) => el.textContent.replace('🏛️', '').trim()));
    const esperado = delListado.filter((n) => conMonumento.includes(n)).sort();
    expect(esperado.length, 'hay números completados que comparar').toBeGreaterThan(5);
    await expect.poll(() => numerosEnVerde(frame), { timeout: 20_000 }).toEqual(esperado);
    const verdes = await numerosEnVerde(frame);
    expect(verdes.some((n) => !conParada.includes(n)), 'entre los verdes, un puente: un número sin parada propia').toBe(true);
    expect(verdes.some((n) => n.startsWith('v')), 'la numeración interior de los Jardines del Real no se pinta').toBe(false);
  });

  test('MC-9. Si el padre no puede calcular los números completados, VISIBLE sale sin lista y el error queda en el log', async ({ page }) => {
    await page.addInitScript({ path: MAPLIBRE_STUB });
    await injectInitSpy(page);
    await stubCDNResources(page);
    const errores = [];
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    await gotoAndWaitForFase1(page);
    await expect.poll(() => page.evaluate(() => globalThis.mensajeria.tieneControlador('NAVEGACION.MOSTRAR_MAPA_COMPLETO')), { timeout: 20_000 }).toBe(true);
    await page.evaluate(async () => {
      globalThis.aventuraSeleccionada = 'Aventura1';
      globalThis.idiomaSeleccionado = 'es';
      if (typeof globalThis.__cargarDatosAventuraDiferidos === 'function') await globalThis.__cargarDatosAventuraDiferidos();
      globalThis._numerosDeMapaCompletados = () => { throw new Error('lista rota a propósito'); };
      // Lo que el padre manda en cada MAPA_COMPLETO.VISIBLE, sin cambiar el envío.
      globalThis.__visibles = [];
      const enviar = globalThis.mensajeria.enviarMensaje;
      globalThis.mensajeria.enviarMensaje = (m, ...resto) => {
        if (m?.tipo === globalThis.TIPOS_MENSAJE.MAPA_COMPLETO.VISIBLE) globalThis.__visibles.push(m.datos);
        return enviar.call(globalThis.mensajeria, m, ...resto);
      };
      await globalThis.mensajeria.despacharLocal({ tipo: globalThis.TIPOS_MENSAJE.NAVEGACION.MOSTRAR_MAPA_COMPLETO, datos: {} });
    });
    await expect.poll(() => page.evaluate(() => globalThis.__visibles.length), { timeout: 10_000 }).toBe(1);
    const sinLista = await page.evaluate(() => globalThis.__visibles[0] !== undefined && globalThis.__visibles[0].numerosCompletados === undefined);
    expect(sinLista, 'VISIBLE sale, pero sin lista de números completados').toBe(true);
    await expect.poll(() => errores.some((t) => t.includes('[PADRE][MAPA_COMPLETO] Sin los números completados')), { timeout: 5_000 }).toBe(true);
  });
});
