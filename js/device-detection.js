/**
 * @fileoverview La lista única de tipos de dispositivo de Valencia VGuides: PC, tableta o móvil (teléfono)
 * (docs/estudio-caminos.md, K-28). La deciden el agente de usuario y, para el iPad de iPadOS 13 o posterior, la pantalla
 * táctil: ese iPad se presenta como un Mac, y un Mac no tiene pantalla táctil de varios puntos.
 *
 *   - Móvil: iPhone, iPod, Android con «Mobile», Windows Phone, BlackBerry, Opera Mini, webOS, o cualquier navegador
 *     que se declare «Mobile» (en Chromium, también `navigator.userAgentData.mobile`), salvo las tabletas.
 *   - Tableta: iPad (también el que se presenta como Mac), Android sin «Mobile», Kindle, Silk, PlayBook, o cualquiera
 *     que se declare «Tablet».
 *   - PC: todo lo demás.
 *
 * La usan `js/mensajeria.js` (esMovil: el TTL de limpieza de mensajes), `codigo-padre.html` (esTelefonoMovil: el aviso
 * de «gire el móvil» en horizontal) y `js/proteccion.js` (esMovil: la comprobación del tamaño de la ventana, que en
 * móvil y tableta cambia sola; la toma con import() dinámico, porque es un script clásico).
 */

/** El tipo, calculado la primera vez: no cambia mientras dura la página. */
let _tipo = null;

/**
 * @returns {'movil'|'tablet'|'pc'} el tipo de este dispositivo
 */
export function tipoDeDispositivo() {
    if (_tipo) return _tipo;
    const ua = String(globalThis.navigator?.userAgent || '');
    const tactilDeVariosPuntos = (globalThis.navigator?.maxTouchPoints || 0) > 1;
    const esTableta = /iPad|Tablet|Kindle|Silk|PlayBook/i.test(ua)
        || (/Android/i.test(ua) && !/Mobile/i.test(ua))
        || (/Macintosh/i.test(ua) && tactilDeVariosPuntos);
    const esTelefono = !esTableta && (globalThis.navigator?.userAgentData?.mobile === true
        || /iPhone|iPod|Android|Windows Phone|IEMobile|BlackBerry|BB10|Opera Mini|webOS|Mobile/i.test(ua));
    _tipo = esTableta ? 'tablet' : (esTelefono ? 'movil' : 'pc');
    return _tipo;
}

/** @returns {boolean} si es un móvil o una tableta */
export function esMovil() {
    return tipoDeDispositivo() !== 'pc';
}

/** @returns {boolean} si es un teléfono móvil, no una tableta */
export function esTelefonoMovil() {
    return tipoDeDispositivo() === 'movil';
}
