/**
 * 79 — El contrato del bus único (js/mensajeria.js)
 *
 * POR QUE EXISTE
 *
 * La app va a pasar a un solo bus para todos los frames: padre, hijos y nietos
 * (docs/mensajeria-duplicada-en-hijos.md, Parte VI). Este spec fija su contrato ANTES de
 * construirlo, con el bus real y nada de la app: el arnés de tests/e2e/fixtures/bus monta
 * padre → hijo → nieto, un iframe intruso sin registrar y dos iframes mudos que no contestan
 * al latido.
 *
 * Cada test mide desde el lado que falla por el motivo que describe, no por otro fallo que se
 * le cruce: por ejemplo, el acuse se prueba del padre al hijo, porque del hijo al padre fallaría
 * antes por no saber subir.
 *
 *   BC-0   Control: el arnés monta con el bus real y la jerarquía correcta.
 *   BC-1   Envío arriba, abajo y "a todos" (que no sube ni llega a los nietos).
 *   BC-2   Fuente: un iframe sin registrar no llega a ningún handler; el propio frame sí.
 *   BC-3   Un mensaje sin `origen` se descarta y se avisa.
 *   BC-4   Acuse: resuelve con valor, con undefined y con un { exito:false } devuelto; rechaza
 *          diciendo por qué ('fallo-handler', 'sin-respuesta', 'no-enviado').
 *   BC-5   Sin handler no se contesta: el emisor agota su plazo, y se avisa.
 *   BC-6   Registrar un tipo dos veces es un error ruidoso y se queda el primero.
 *   BC-7   Un frame sin padre ni iframes no envía, no espera y lo avisa una sola vez.
 *   BC-8   desregistrarIframe: ni se le envía ni se aceptan sus mensajes.
 *   BC-9   La fila de un tipo sobrevive a un fallo sin objeto de error.
 *   BC-10  despacharLocal pasa por la misma fila que los mensajes que llegan.
 *   BC-11  Un error sin capturar en el nieto llega al padre, con el nombre del nieto.
 *   BC-12a El latido vigila todos los iframes registrados.
 *   BC-12b Tras tres fallos se recarga solo el recuperable; el otro, aviso.
 *   BC-12c adelantarLatido respeta la pausa y, activo, late al momento.
 *   BC-15  El `origen` lo pone el bus: el que pasa quien envía se ignora (enviarMensaje y
 *          despacharLocal).
 *   BC-16  Al recibir de un iframe registrado, su `origen` tiene que ser su nombre de registro:
 *          si dice ser otro, se descarta y se avisa.
 *   BC-17  Un frame con el bus importado pero sin inicializar no envía: saldría sin `origen`.
 *   BC-18  Un frame no se envía nada a sí mismo por `enviarMensaje` (tampoco el padre a 'padre'):
 *          no sale y avisa. Para eso está `despacharLocal`.
 *
 * ROJO ANTES QUE VERDE: con el bus de antes de la unificación falla todo salvo BC-0.
 */
'use strict';

const { test, expect } = require('@playwright/test');

const ARNES = '/tests/e2e/fixtures/bus/padre.html';

async function montar(page) {
  const logs = [];
  page.on('console', (m) => logs.push({ tipo: m.type(), texto: m.text() }));
  await page.goto(ARNES);
  await page.waitForFunction(() => {
    const hijo = document.getElementById('hijo')?.contentWindow;
    const nieto = hijo?.document?.getElementById('nieto')?.contentWindow;
    return globalThis.__arnesListo === true && hijo?.__arnesListo === true && nieto?.__arnesListo === true
      && document.getElementById('intruso')?.contentWindow?.__arnesListo === true;
  }, null, { timeout: 15_000 });
  const frame = (nombre) => page.frames().find((f) => f.name() === nombre);
  return { logs, padre: page.mainFrame(), hijo: frame('hijo'), nieto: frame('nieto'), intruso: frame('intruso') };
}

/** Registra en `frame`, por el bus, un handler que apunta lo que recibe y devuelve `respuesta`. */
const escuchar = (frame, tipo, respuesta) => frame.evaluate(async ([t, r]) => {
  globalThis.__arnes.recibidos[t] = [];
  return globalThis.mensajeria.registrarControlador(t, (m) => {
    globalThis.__arnes.recibidos[t].push({ origen: m.origen, datos: m.datos });
    return r;
  });
}, [tipo, respuesta]);
const recibidos = (frame, tipo) => frame.evaluate((t) => globalThis.__arnes.recibidos[t] || [], tipo);
const enviar = (frame, mensaje) => frame.evaluate((m) => globalThis.mensajeria.enviarMensaje(m), mensaje);
const conAcuse = (frame, mensaje) => frame.evaluate(async (m) => {
  const t0 = Date.now();
  try {
    const valor = await globalThis.mensajeria.enviarMensajeConConfirmacion(m);
    return { ok: true, valor, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, motivo: e && e.motivo, mensaje: e && e.message, ms: Date.now() - t0 };
  }
}, mensaje);
const avisos = (logs, patron) => logs.filter((l) => (l.tipo === 'warning' || l.tipo === 'error') && patron.test(l.texto));

test.describe('BC — Contrato del bus único', () => {
  test('BC-0. Control: el arnés monta con el bus real y la jerarquía correcta', async ({ page }) => {
    const { padre } = await montar(page);
    const r = await padre.evaluate(() => {
      const hijo = document.getElementById('hijo').contentWindow;
      const nieto = hijo.document.getElementById('nieto').contentWindow;
      return {
        buses: [globalThis, hijo, nieto].map((w) => typeof w.mensajeria?.enviarMensaje),
        intrusoSinBus: document.getElementById('intruso').contentWindow.mensajeria === undefined,
        nietoCuelgaDelHijo: nieto.parent === hijo,
        hijoCuelgaDelPadre: hijo.parent === globalThis,
      };
    });
    expect(r.buses, 'los tres frames cargan el bus real').toEqual(['function', 'function', 'function']);
    expect(r.intrusoSinBus).toBe(true);
    expect(r.nietoCuelgaDelHijo && r.hijoCuelgaDelPadre, 'jerarquía padre → hijo → nieto').toBe(true);
  });

  test('BC-1. Envío arriba, abajo y "a todos", que no sube ni llega a los nietos', async ({ page }) => {
    const { padre, hijo, nieto } = await montar(page);

    await escuchar(padre, 'PRUEBA.ARRIBA');
    expect(await enviar(hijo, { tipo: 'PRUEBA.ARRIBA', destino: 'padre', datos: { n: 1 } }), 'hijo → padre se envía').toBe(true);
    await expect.poll(() => recibidos(padre, 'PRUEBA.ARRIBA'), { timeout: 3_000 })
      .toEqual([{ origen: 'hijo', datos: { n: 1 } }]);

    await escuchar(hijo, 'PRUEBA.ABAJO');
    expect(await enviar(padre, { tipo: 'PRUEBA.ABAJO', destino: 'hijo', datos: {} })).toBe(true);
    await expect.poll(() => recibidos(hijo, 'PRUEBA.ABAJO'), { timeout: 3_000 }).toEqual([{ origen: 'padre', datos: {} }]);

    await escuchar(nieto, 'PRUEBA.AL_NIETO');
    expect(await enviar(hijo, { tipo: 'PRUEBA.AL_NIETO', destino: 'nieto', datos: {} })).toBe(true);
    await expect.poll(() => recibidos(nieto, 'PRUEBA.AL_NIETO'), { timeout: 3_000 }).toEqual([{ origen: 'hijo', datos: {} }]);

    // Desde el nieto, 'padre' es su contenedor: el hijo, no la ventana de arriba del todo.
    await escuchar(hijo, 'PRUEBA.DEL_NIETO');
    await escuchar(padre, 'PRUEBA.DEL_NIETO');
    expect(await enviar(nieto, { tipo: 'PRUEBA.DEL_NIETO', destino: 'padre', datos: {} }), 'nieto → su padre se envía').toBe(true);
    await expect.poll(() => recibidos(hijo, 'PRUEBA.DEL_NIETO'), { timeout: 3_000 }).toEqual([{ origen: 'nieto', datos: {} }]);
    expect(await recibidos(padre, 'PRUEBA.DEL_NIETO'), 'y no salta hasta el de arriba').toEqual([]);

    await escuchar(hijo, 'PRUEBA.TODOS');
    await escuchar(nieto, 'PRUEBA.TODOS');
    expect(await enviar(padre, { tipo: 'PRUEBA.TODOS', destino: 'broadcast', datos: {} })).toBe(true);
    await expect.poll(() => recibidos(hijo, 'PRUEBA.TODOS'), { timeout: 3_000 }).toHaveLength(1);
    // VENTANA-OBSERVACION: un "a todos" no puede bajar a los nietos
    await page.waitForTimeout(400);
    expect(await recibidos(nieto, 'PRUEBA.TODOS'), '"a todos" llega a los hijos directos, no a los nietos').toEqual([]);

    await escuchar(padre, 'PRUEBA.TODOS_HIJO');
    await escuchar(nieto, 'PRUEBA.TODOS_HIJO');
    expect(await enviar(hijo, { tipo: 'PRUEBA.TODOS_HIJO', destino: 'broadcast', datos: {} })).toBe(true);
    await expect.poll(() => recibidos(nieto, 'PRUEBA.TODOS_HIJO'), { timeout: 3_000 }).toHaveLength(1);
    // VENTANA-OBSERVACION: un "a todos" de un hijo no puede subir al padre
    await page.waitForTimeout(400);
    expect(await recibidos(padre, 'PRUEBA.TODOS_HIJO'), '"a todos" nunca sube').toEqual([]);
  });

  test('BC-2. Fuente: un iframe sin registrar no llega a ningún handler; el propio frame sí', async ({ page }) => {
    const { padre, intruso } = await montar(page);

    await escuchar(padre, 'PRUEBA.INTRUSO');
    await intruso.evaluate(() => globalThis.parent.postMessage(
      { tipo: 'PRUEBA.INTRUSO', origen: 'intruso', datos: {}, id: 'intruso-1', timestamp: Date.now() },
      globalThis.location.origin,
    ));

    await escuchar(padre, 'PRUEBA.PROPIO');
    await padre.evaluate(() => globalThis.postMessage(
      { tipo: 'PRUEBA.PROPIO', origen: 'propio', datos: {}, id: 'propio-1', timestamp: Date.now() },
      globalThis.location.origin,
    ));

    await expect.poll(() => recibidos(padre, 'PRUEBA.PROPIO'), { timeout: 3_000 }).toHaveLength(1);
    // VENTANA-OBSERVACION: un iframe sin registrar no puede llegar a ningun handler
    await page.waitForTimeout(400);
    expect(await recibidos(padre, 'PRUEBA.INTRUSO'), 'un iframe del mismo origen que el padre no registra no llega a ningún handler').toEqual([]);
  });

  test('BC-3. Un mensaje sin origen se descarta y se avisa', async ({ page }) => {
    const { padre, hijo, logs } = await montar(page);
    await escuchar(padre, 'PRUEBA.SIN_ORIGEN');

    await hijo.evaluate(() => globalThis.parent.postMessage(
      { tipo: 'PRUEBA.SIN_ORIGEN', datos: {}, id: 'sin-origen-1', timestamp: Date.now() },
      globalThis.location.origin,
    ));

    // Se espera al AVISO del descarte, que si ocurre: con el se sabe que el bus ya proceso y
    // tiro el mensaje, sin depender de un tiempo. La comprobacion de que no llego al handler
    // viene justo despues.
    await expect
      .poll(() => avisos(logs, /PRUEBA\.SIN_ORIGEN/).some((l) => /origen/i.test(l.texto)), { timeout: 5_000 })
      .toBe(true);
    expect(await recibidos(padre, 'PRUEBA.SIN_ORIGEN'), 'no llega al handler').toEqual([]);
    expect(
      avisos(logs, /PRUEBA\.SIN_ORIGEN/).some((l) => /origen/i.test(l.texto)),
      'y el descarte se avisa en el log: en silencio es como se escondió F1',
    ).toBe(true);
  });

  test('BC-4. Acuse: resuelve con lo devuelto y rechaza diciendo por qué', async ({ page }) => {
    const { padre, hijo } = await montar(page);

    await escuchar(hijo, 'PRUEBA.ACUSE_VALOR', { ok: 1 });
    expect(await conAcuse(padre, { tipo: 'PRUEBA.ACUSE_VALOR', destino: 'hijo', datos: {}, timeout: 2_000 }))
      .toMatchObject({ ok: true, valor: { ok: 1 } });

    await escuchar(hijo, 'PRUEBA.ACUSE_UNDEFINED', undefined);
    const sinValor = await conAcuse(padre, { tipo: 'PRUEBA.ACUSE_UNDEFINED', destino: 'hijo', datos: {}, timeout: 2_000 });
    expect(sinValor.ok, 'devolver undefined también es "recibido"').toBe(true);

    await escuchar(hijo, 'PRUEBA.ACUSE_EXITO_FALSE', { exito: false, error: 'gestionado' });
    expect(
      await conAcuse(padre, { tipo: 'PRUEBA.ACUSE_EXITO_FALSE', destino: 'hijo', datos: {}, timeout: 2_000 }),
      'un fallo que el handler gestiona y DEVUELVE es un resultado, no un fallo',
    ).toMatchObject({ ok: true, valor: { exito: false, error: 'gestionado' } });

    await hijo.evaluate(() => globalThis.mensajeria.registrarControlador('PRUEBA.ACUSE_LANZA', () => { throw new Error('rota'); }));
    expect(
      await conAcuse(padre, { tipo: 'PRUEBA.ACUSE_LANZA', destino: 'hijo', datos: {}, timeout: 2_000 }),
      'si el handler se rompe, "recibido, pero ha fallado" llega como FALLO',
    ).toMatchObject({ ok: false, motivo: 'fallo-handler' });

    const noEnviado = await conAcuse(padre, { tipo: 'PRUEBA.ACUSE_NADIE', destino: 'no-existe', datos: {}, timeout: 2_000 });
    expect(noEnviado, 'a un destino inexistente no se envía').toMatchObject({ ok: false, motivo: 'no-enviado' });
    expect(noEnviado.ms, 'y se sabe al momento, sin esperar el plazo').toBeLessThan(500);

    await hijo.evaluate(() => globalThis.mensajeria.registrarControlador('PRUEBA.ACUSE_CUELGA', () => new Promise(() => {})));
    expect(await conAcuse(padre, { tipo: 'PRUEBA.ACUSE_CUELGA', destino: 'hijo', datos: {}, timeout: 400 }))
      .toMatchObject({ ok: false, motivo: 'sin-respuesta' });
  });

  test('BC-5. Sin handler no se contesta: el emisor agota su plazo, y se avisa', async ({ page }) => {
    const { padre, logs } = await montar(page);
    const r = await conAcuse(padre, { tipo: 'PRUEBA.NADIE_ESCUCHA', destino: 'hijo', datos: {}, timeout: 600 });
    expect(r, 'si nadie procesó el mensaje no hay "recibido": así el emisor puede reintentar')
      .toMatchObject({ ok: false, motivo: 'sin-respuesta' });
    expect(avisos(logs, /PRUEBA\.NADIE_ESCUCHA/).length, 'y el hijo lo avisa en el log').toBeGreaterThan(0);
  });

  test('BC-6. Registrar un tipo dos veces es un error ruidoso y se queda el primero', async ({ page }) => {
    const { padre, hijo, logs } = await montar(page);
    const r = await padre.evaluate(async () => {
      const m = globalThis.mensajeria;
      const primero = await m.registrarControlador('PRUEBA.DOBLE', () => { globalThis.__arnes.quien = 'primero'; });
      const segundo = await m.registrarControlador('PRUEBA.DOBLE', () => { globalThis.__arnes.quien = 'segundo'; });
      return { primero, segundo };
    });
    expect(r).toEqual({ primero: true, segundo: false });
    expect(avisos(logs, /PRUEBA\.DOBLE/).some((l) => l.tipo === 'error'), 'el doble registro sale como error').toBe(true);

    await enviar(hijo, { tipo: 'PRUEBA.DOBLE', destino: 'padre', datos: {} });
    await expect.poll(() => padre.evaluate(() => globalThis.__arnes.quien), { timeout: 3_000 }).toBe('primero');
  });

  test('BC-7. Un frame sin padre ni iframes no envía, no espera y lo avisa una sola vez', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push({ tipo: m.type(), texto: m.text() }));
    await page.goto('/tests/e2e/fixtures/bus/nieto.html');
    await page.waitForFunction(() => globalThis.__arnesListo === true, null, { timeout: 15_000 });

    const r = await page.evaluate(async () => {
      const m = globalThis.mensajeria;
      const envio1 = await m.enviarMensaje({ tipo: 'PRUEBA.SUELTO', destino: 'padre', datos: {} });
      const envio2 = await m.enviarMensaje({ tipo: 'PRUEBA.SUELTO', destino: 'padre', datos: {} });
      const t0 = Date.now();
      let motivo = null;
      try { await m.enviarMensajeConConfirmacion({ tipo: 'PRUEBA.SUELTO', destino: 'padre', datos: {}, timeout: 3_000 }); } catch (e) { motivo = e && e.motivo; }
      return { envio1, envio2, motivo, ms: Date.now() - t0 };
    });

    expect([r.envio1, r.envio2], 'sin padre no se envía nada').toEqual([false, false]);
    expect(r.motivo).toBe('no-enviado');
    expect(r.ms, 'y no se espera el plazo').toBeLessThan(500);
    expect(avisos(logs, /sin padre/i).length, 'un único aviso, no uno por envío').toBe(1);
  });

  test('BC-8. desregistrarIframe: ni se le envía ni se aceptan sus mensajes', async ({ page }) => {
    const { padre, hijo } = await montar(page);
    await escuchar(hijo, 'PRUEBA.BAJA');
    await escuchar(padre, 'PRUEBA.TRAS_BAJA');

    const baja = await padre.evaluate(() => {
      const m = globalThis.mensajeria;
      return typeof m.desregistrarIframe === 'function' ? m.desregistrarIframe('hijo') : 'desregistrarIframe no existe';
    });
    expect(baja).toBe(true);

    expect(await enviar(padre, { tipo: 'PRUEBA.BAJA', destino: 'hijo', datos: {} }), 'a un iframe dado de baja no se envía').toBe(false);
    await enviar(hijo, { tipo: 'PRUEBA.TRAS_BAJA', destino: 'padre', datos: {} });
    // VENTANA-OBSERVACION: un iframe dado de baja no recibe ni se le acepta nada
    await page.waitForTimeout(500);
    expect(await recibidos(hijo, 'PRUEBA.BAJA')).toEqual([]);
    expect(await recibidos(padre, 'PRUEBA.TRAS_BAJA'), 'ni se aceptan sus mensajes').toEqual([]);
  });

  test('BC-9. La fila de un tipo sobrevive a un fallo sin objeto de error', async ({ page }) => {
    const { padre } = await montar(page);
    await padre.evaluate(() => {
      globalThis.__arnes.fila = 0;
      // Rechazo SIN objeto de error: es justo el caso que se prueba.
      globalThis.mensajeria.registrarControlador('PRUEBA.FILA', () => { globalThis.__arnes.fila += 1; return globalThis.__arnes.fila === 1 ? Promise.reject() : 'ok'; });
      const mandar = (id) => globalThis.postMessage({ tipo: 'PRUEBA.FILA', origen: 'propio', datos: {}, id, timestamp: Date.now() }, globalThis.location.origin);
      mandar('fila-1');
      setTimeout(() => mandar('fila-2'), 300);
    });
    await expect.poll(() => padre.evaluate(() => globalThis.__arnes.fila), {
      timeout: 3_000,
      message: 'el segundo mensaje del mismo tipo tiene que procesarse aunque el primero fallara sin objeto de error',
    }).toBe(2);
  });

  test('BC-10. despacharLocal pasa por la misma fila que los mensajes que llegan', async ({ page }) => {
    const { padre } = await montar(page);
    const r = await padre.evaluate(async () => {
      const m = globalThis.mensajeria;
      if (typeof m.despacharLocal !== 'function') return { error: 'despacharLocal no existe' };
      const eventos = [];
      await m.registrarControlador('PRUEBA.LOCAL', async (msg) => {
        eventos.push(`ini:${msg.datos.n}`);
        await new Promise((res) => setTimeout(res, 300));
        eventos.push(`fin:${msg.datos.n}`);
        return msg.datos.n;
      });
      globalThis.postMessage({ tipo: 'PRUEBA.LOCAL', origen: 'propio', datos: { n: 1 }, id: 'local-1', timestamp: Date.now() }, globalThis.location.origin);
      const devuelto = await m.despacharLocal({ tipo: 'PRUEBA.LOCAL', datos: { n: 2 } });
      await new Promise((res) => setTimeout(res, 800));
      return { eventos, devuelto };
    });
    expect(r.error, r.error).toBeUndefined();
    expect(r.devuelto, 'despacharLocal devuelve lo que devolvió el handler').toBe(2);
    expect(r.eventos, 'los dos se ejecutan').toHaveLength(4);
    const [a, b, c, d] = r.eventos;
    expect(a.split(':')[1] === b.split(':')[1] && c.split(':')[1] === d.split(':')[1] && a.startsWith('ini') && b.startsWith('fin'),
      `en fila, sin solaparse: ${JSON.stringify(r.eventos)}`).toBe(true);
  });

  test('BC-11. Un error sin capturar en el nieto llega al padre, con el nombre del nieto', async ({ page }) => {
    const { padre, nieto } = await montar(page);
    await padre.evaluate(() => {
      globalThis.__arnes.errores = [];
      globalThis.addEventListener('message', (e) => {
        const d = e.data;
        if (d && d.tipo === 'SISTEMA.ERROR' && String(d.datos?.mensaje || '').includes('marca-BC11')) {
          globalThis.__arnes.errores.push({ origen: d.origen, reenviadoDe: d.datos?.reenviadoDe, codigo: d.datos?.codigo });
        }
      });
    });
    await nieto.evaluate(() => { setTimeout(() => { throw new Error('marca-BC11'); }, 0); });
    await expect.poll(() => padre.evaluate(() => globalThis.__arnes.errores), { timeout: 5_000 })
      .toEqual([{ origen: 'hijo', reenviadoDe: 'nieto', codigo: 'ERROR_NO_CONTROLADO' }]);
  });

  test('BC-12a. El latido vigila todos los iframes registrados', async ({ page }) => {
    const { padre, hijo } = await montar(page);
    await hijo.evaluate(() => {
      globalThis.__arnes.latidos = 0;
      globalThis.addEventListener('message', (e) => { if (e.source === globalThis.parent && e.data?.tipo === 'SISTEMA.HEARTBEAT') globalThis.__arnes.latidos += 1; });
    });
    await padre.evaluate(() => globalThis.mensajeria.iniciarHeartbeat(150));
    await expect.poll(() => hijo.evaluate(() => globalThis.__arnes.latidos), {
      timeout: 2_000,
      message: 'un iframe registrado recibe latidos aunque no esté en ninguna lista escrita a mano',
    }).toBeGreaterThan(0);
  });

  test('BC-12b. Tras tres fallos se recarga solo el recuperable; el otro, aviso', async ({ page }) => {
    const { padre, logs } = await montar(page);
    // Se mide la DIFERENCIA desde que empieza el latido: al insertar un iframe el navegador ya
    // dispara dos cargas (la página en blanco inicial y la real), sin que nada lo recargue.
    await page.waitForFunction(() => globalThis.__arnes.cargas['mudo-recuperable'] >= 1
      && globalThis.__arnes.cargas['mudo-fijo'] >= 1, null, { timeout: 5_000 });
    // Se espera a que las cargas iniciales PAREN, no un tiempo: insertar un iframe dispara dos
    // (la pagina en blanco y la real) y la cuenta base tiene que tomarse cuando ya no suben.
    // Que el numero sea 2 no se da por supuesto: se mira que deje de moverse.
    {
      let anterior = -1;
      await expect.poll(async () => {
        const ahora = await padre.evaluate(() => Object.values(globalThis.__arnes.cargas).reduce((a, b) => a + b, 0));
        const quieto = ahora === anterior;
        anterior = ahora;
        return quieto;
      }, { timeout: 10_000, intervals: [250] }).toBe(true);
    }
    const base = await padre.evaluate(() => ({ ...globalThis.__arnes.cargas }));

    await padre.evaluate(() => globalThis.mensajeria.iniciarHeartbeat(150));
    await expect.poll(() => padre.evaluate(() => globalThis.__arnes.cargas['mudo-recuperable']), {
      timeout: 4_000,
      message: 'el iframe recuperable que no contesta se recarga',
    }).toBeGreaterThan(base['mudo-recuperable']);
    expect(await padre.evaluate(() => globalThis.__arnes.cargas['mudo-fijo']), 'el no recuperable no se recarga')
      .toBe(base['mudo-fijo']);
    expect(avisos(logs, /mudo-fijo/).length, 'pero se avisa').toBeGreaterThan(0);
  });

  test('BC-12c. adelantarLatido respeta la pausa y, activo, late al momento', async ({ page }) => {
    const { padre, hijo } = await montar(page);
    await hijo.evaluate(() => {
      globalThis.__arnes.latidos = 0;
      globalThis.addEventListener('message', (e) => { if (e.source === globalThis.parent && e.data?.tipo === 'SISTEMA.HEARTBEAT') globalThis.__arnes.latidos += 1; });
    });
    const existe = await padre.evaluate(() => typeof globalThis.mensajeria.adelantarLatido === 'function');
    expect(existe, 'adelantarLatido existe').toBe(true);

    await padre.evaluate(async () => { await globalThis.mensajeria.pausarHeartbeat(); globalThis.mensajeria.adelantarLatido(); });
    // VENTANA-OBSERVACION: con el latido en pausa no puede latir
    await page.waitForTimeout(600);
    expect(await hijo.evaluate(() => globalThis.__arnes.latidos), 'en pausa, volver a la pestaña no hace latir').toBe(0);

    // Con intervalo de 5 s, un latido en menos de medio segundo solo puede venir de adelantarLatido.
    await padre.evaluate(async () => { await globalThis.mensajeria.reanudarHeartbeat(5_000); globalThis.mensajeria.adelantarLatido(); });
    await expect.poll(() => hijo.evaluate(() => globalThis.__arnes.latidos), { timeout: 500 }).toBeGreaterThan(0);
  });

  test('BC-14. Un handler que no termina nunca no deja su tipo parado para siempre', async ({ page }) => {
    test.setTimeout(60_000);
    const { padre, logs } = await montar(page);
    await padre.evaluate(async () => {
      globalThis.__arnes.colgados = 0;
      let primero = true;
      await globalThis.mensajeria.registrarControlador('PRUEBA.CUELGUE', () => {
        globalThis.__arnes.colgados += 1;
        // El primero no se resuelve JAMÁS: es el caso que se prueba. Un try/catch no salva de
        // esto — no es un fallo, es un handler que se queda a medias.
        if (primero) { primero = false; return new Promise(() => {}); }
        return 'ok';
      });
      const mandar = (id) => globalThis.postMessage(
        { tipo: 'PRUEBA.CUELGUE', origen: 'propio', datos: {}, id, timestamp: Date.now() },
        globalThis.location.origin,
      );
      mandar('cuelgue-1');
      setTimeout(() => mandar('cuelgue-2'), 300);
    });

    await expect.poll(() => padre.evaluate(() => globalThis.__arnes.colgados), {
      timeout: 40_000,
      message: 'el segundo mensaje del mismo tipo tiene que acabar procesándose: si el primero se '
        + 'queda colgado para siempre, ese tipo deja de funcionar en silencio mientras todo lo demás sigue',
    }).toBe(2);

    expect(
      avisos(logs, /PRUEBA\.CUELGUE/).length,
      'y hay que decirlo en voz alta, con el tipo: un cuelgue mudo es indistinguible de "no ha vuelto a pasar nada"',
    ).toBeGreaterThan(0);
  });

  test('BC-13. Un handler roto no deja una promesa rechazada sin dueño', async ({ page }) => {
    const { padre } = await montar(page);
    const roto = await padre.evaluate(async () => {
      globalThis.__arnes.sinDueno = [];
      globalThis.addEventListener('unhandledrejection', (e) => {
        globalThis.__arnes.sinDueno.push(String(e.reason?.message || e.reason));
      });
      globalThis.__arnes.ejecutado = 0;
      await globalThis.mensajeria.registrarControlador('PRUEBA.ROTO', () => {
        globalThis.__arnes.ejecutado += 1;
        throw new Error('el handler revienta');
      });
      // Sin `requiereConfirmacion`: nadie espera respuesta, así que nadie recoge el rechazo.
      globalThis.postMessage({ tipo: 'PRUEBA.ROTO', origen: 'propio', datos: {}, id: 'roto-1', timestamp: Date.now() }, globalThis.location.origin);
      return true;
    });
    expect(roto).toBe(true);

    // Control: el handler tiene que haberse ejecutado, si no el verde de abajo no valdría nada.
    await expect.poll(() => padre.evaluate(() => globalThis.__arnes.ejecutado), { timeout: 3_000 }).toBe(1);
    // VENTANA-OBSERVACION: no puede quedar una promesa rechazada sin dueno
    await page.waitForTimeout(300); // margen para que el navegador emita el unhandledrejection

    expect(
      await padre.evaluate(() => globalThis.__arnes.sinDueno),
      'el fallo ya se registra en el log y ya se le contesta a quien envió; una rechazada suelta ' +
      'la recogería instalarReporteErroresAlPadre (js/utils.js) y mandaría un SEGUNDO aviso al padre',
    ).toEqual([]);
  });
});

test.describe('BC — Identidad: el bus pone el origen y lo comprueba al recibir', () => {
  test('BC-15. El origen lo pone el bus: el que pasa quien envía se ignora', async ({ page }) => {
    const { padre, hijo } = await montar(page);

    await escuchar(padre, 'PRUEBA.SELLO');
    expect(await enviar(hijo, { tipo: 'PRUEBA.SELLO', destino: 'padre', origen: 'falso', datos: {} })).toBe(true);
    await expect.poll(() => recibidos(padre, 'PRUEBA.SELLO'), { timeout: 3_000 })
      .toEqual([{ origen: 'hijo', datos: {} }]);

    await escuchar(padre, 'PRUEBA.SELLO_LOCAL');
    await padre.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'PRUEBA.SELLO_LOCAL', origen: 'falso', datos: {} }));
    expect(await recibidos(padre, 'PRUEBA.SELLO_LOCAL'), 'despacharLocal tampoco se fía del llamador')
      .toEqual([{ origen: 'padre', datos: {} }]);
  });

  test('BC-16. Un iframe registrado que dice ser otro se descarta y se avisa', async ({ page }) => {
    const { padre, hijo, logs } = await montar(page);
    await escuchar(padre, 'PRUEBA.SUPLANTA');

    // Control: con su nombre de registro, el mismo mensaje por el mismo camino llega.
    await hijo.evaluate(() => globalThis.parent.postMessage(
      { tipo: 'PRUEBA.SUPLANTA', origen: 'hijo', datos: { n: 'control' }, id: 'supl-control', timestamp: Date.now() },
      globalThis.location.origin,
    ));
    await expect.poll(() => recibidos(padre, 'PRUEBA.SUPLANTA'), { timeout: 3_000 })
      .toEqual([{ origen: 'hijo', datos: { n: 'control' } }]);

    await hijo.evaluate(() => globalThis.parent.postMessage(
      { tipo: 'PRUEBA.SUPLANTA', origen: 'otro', datos: { n: 'falso' }, id: 'supl-falso', timestamp: Date.now() },
      globalThis.location.origin,
    ));
    // VENTANA-OBSERVACION: un mensaje que se hace pasar por otro no puede llegar a ningun handler
    await page.waitForTimeout(400);
    expect(await recibidos(padre, 'PRUEBA.SUPLANTA'), 'el que dice ser otro no llega')
      .toEqual([{ origen: 'hijo', datos: { n: 'control' } }]);
    expect(avisos(logs, /descarta PRUEBA\.SUPLANTA: dice venir de 'otro' pero lo envía 'hijo'/),
      'y se avisa de quién lo envió de verdad').toHaveLength(1);
  });

  test('BC-17. Con el bus importado pero sin inicializar no se envía nada', async ({ page }) => {
    const logs = [];
    page.on('console', (m) => logs.push({ tipo: m.type(), texto: m.text() }));
    await page.goto('/tests/e2e/fixtures/bus/sin-init.html');
    await page.waitForFunction(() => globalThis.__arnesListo === true
      && document.getElementById('nieto')?.contentWindow?.__arnesListo === true, null, { timeout: 15_000 });
    const nieto = page.frames().find((f) => f.name() === 'nieto');
    await escuchar(nieto, 'PRUEBA.SIN_INIT');

    const enviado = await page.evaluate(() => globalThis.mensajeria.enviarMensaje({ tipo: 'PRUEBA.SIN_INIT', destino: 'nieto', datos: {} }));
    // VENTANA-OBSERVACION: un envio sin nombre no puede llegar a ningun handler
    await page.waitForTimeout(400);
    expect(enviado, 'el envío tiene que decir que no ha salido').toBe(false);
    expect(await recibidos(nieto, 'PRUEBA.SIN_INIT'), 'y no llega nada').toEqual([]);
    expect(avisos(logs, /No se envía PRUEBA\.SIN_INIT: el bus de este frame aún no está inicializado/),
      'y se avisa').toHaveLength(1);
  });

  test('BC-18. Enviarse algo a uno mismo no sale y avisa: para eso está despacharLocal', async ({ page }) => {
    const { padre, hijo, logs } = await montar(page);
    await escuchar(padre, 'PRUEBA.A_SI_MISMO');
    await escuchar(hijo, 'PRUEBA.A_SI_MISMO');

    // El padre se llama 'padre': mandar a 'padre' desde arriba es mandarse a sí mismo.
    expect(await enviar(padre, { tipo: 'PRUEBA.A_SI_MISMO', destino: 'padre', datos: {} }), 'el padre a sí mismo').toBe(false);
    expect(await enviar(hijo, { tipo: 'PRUEBA.A_SI_MISMO', destino: 'hijo', datos: {} }), 'el hijo a sí mismo').toBe(false);
    const r = await conAcuse(hijo, { tipo: 'PRUEBA.A_SI_MISMO', destino: 'hijo', datos: {} });
    expect(r, 'con acuse, rechazo que dice por qué').toMatchObject({ ok: false, motivo: 'no-enviado' });
    // VENTANA-OBSERVACION: un envio a uno mismo no puede llegar a ningun handler
    await page.waitForTimeout(400);
    expect(await recibidos(padre, 'PRUEBA.A_SI_MISMO'), 'al padre no le llega').toEqual([]);
    expect(await recibidos(hijo, 'PRUEBA.A_SI_MISMO'), 'al hijo no le llega').toEqual([]);
    expect(avisos(logs, /padre no se envía PRUEBA\.A_SI_MISMO a sí mismo/), 'aviso en el padre').toHaveLength(1);
    expect(avisos(logs, /hijo no se envía PRUEBA\.A_SI_MISMO a sí mismo/), 'aviso en el hijo, uno por tipo').toHaveLength(1);

    // Control: por despacharLocal sí llega.
    await padre.evaluate(() => globalThis.mensajeria.despacharLocal({ tipo: 'PRUEBA.A_SI_MISMO', datos: { n: 1 } }));
    expect(await recibidos(padre, 'PRUEBA.A_SI_MISMO')).toEqual([{ origen: 'padre', datos: { n: 1 } }]);
  });
});
