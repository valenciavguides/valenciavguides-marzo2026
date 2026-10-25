// Zoom y desplazamiento de los mapas vintage: funciona con pellizco, rueda y controles.
(function () {
  const estados = new WeakMap();
  const ESCALA_MINIMA = 1;
  const ESCALA_MAXIMA = 6;

  function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
  }

  function configurarZoomMapaVintage(contenedor, imagen) {
    if (!contenedor || !imagen) return;

    let estado = estados.get(contenedor);
    if (!estado) {
      estado = {
        escala: 1,
        x: 0,
        y: 0,
        punteros: new Map(),
        inicioPan: null,
        inicioPinza: null,
      };
      estados.set(contenedor, estado);
      contenedor.classList.add('mapa-vintage-zoomable');
      imagen.draggable = false;

      const controles = document.createElement('div');
      controles.className = 'mapa-zoom-controles';
      controles.setAttribute('aria-label', 'Controles de zoom del mapa');
      controles.innerHTML = `
        <button type="button" data-zoom="menos" aria-label="Alejar el mapa" title="Alejar">−</button>
        <button type="button" data-zoom="mas" aria-label="Acercar el mapa" title="Acercar">+</button>
        <button type="button" data-zoom="restablecer" aria-label="Restablecer el zoom" title="Restablecer">↺</button>
      `;
      contenedor.appendChild(controles);

      const pintar = () => {
        const rect = contenedor.getBoundingClientRect();
        const limiteX = rect.width * (estado.escala - 1) / 2;
        const limiteY = rect.height * (estado.escala - 1) / 2;
        estado.x = limitar(estado.x, -limiteX, limiteX);
        estado.y = limitar(estado.y, -limiteY, limiteY);
        imagen.style.transform = `translate3d(${estado.x}px, ${estado.y}px, 0) scale(${estado.escala})`;
        contenedor.dataset.zoom = `${Math.round(estado.escala * 100)}%`;
      };

      const acercarEn = (escalaNueva, xCliente, yCliente) => {
        const rect = contenedor.getBoundingClientRect();
        const xLocal = xCliente - rect.left - rect.width / 2;
        const yLocal = yCliente - rect.top - rect.height / 2;
        const puntoImagenX = (xLocal - estado.x) / estado.escala;
        const puntoImagenY = (yLocal - estado.y) / estado.escala;
        estado.escala = limitar(escalaNueva, ESCALA_MINIMA, ESCALA_MAXIMA);
        estado.x = xLocal - puntoImagenX * estado.escala;
        estado.y = yLocal - puntoImagenY * estado.escala;
        pintar();
      };

      const restablecer = () => {
        estado.escala = 1;
        estado.x = 0;
        estado.y = 0;
        pintar();
      };

      const puntoMedio = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

      contenedor.addEventListener('pointerdown', (evento) => {
        if (evento.target.closest('.mapa-zoom-controles')) return;
        if (evento.pointerType === 'mouse' && evento.button !== 0) return;
        evento.preventDefault();
        contenedor.setPointerCapture(evento.pointerId);
        estado.punteros.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });

        if (estado.punteros.size === 1) {
          estado.inicioPan = { x: evento.clientX, y: evento.clientY, mapaX: estado.x, mapaY: estado.y };
          estado.inicioPinza = null;
        } else if (estado.punteros.size === 2) {
          const [a, b] = Array.from(estado.punteros.values());
          const medio = puntoMedio(a, b);
          const rect = contenedor.getBoundingClientRect();
          estado.inicioPinza = {
            distancia: distancia(a, b),
            escala: estado.escala,
            puntoImagenX: (medio.x - rect.left - rect.width / 2 - estado.x) / estado.escala,
            puntoImagenY: (medio.y - rect.top - rect.height / 2 - estado.y) / estado.escala,
          };
        }
      });

      contenedor.addEventListener('pointermove', (evento) => {
        if (!estado.punteros.has(evento.pointerId)) return;
        estado.punteros.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });

        if (estado.punteros.size >= 2 && estado.inicioPinza) {
          const [a, b] = Array.from(estado.punteros.values());
          const medio = puntoMedio(a, b);
          const rect = contenedor.getBoundingClientRect();
          estado.escala = limitar(
            estado.inicioPinza.escala * distancia(a, b) / Math.max(1, estado.inicioPinza.distancia),
            ESCALA_MINIMA,
            ESCALA_MAXIMA,
          );
          estado.x = medio.x - rect.left - rect.width / 2 - estado.inicioPinza.puntoImagenX * estado.escala;
          estado.y = medio.y - rect.top - rect.height / 2 - estado.inicioPinza.puntoImagenY * estado.escala;
          pintar();
        } else if (estado.inicioPan && estado.escala > 1) {
          estado.x = estado.inicioPan.mapaX + evento.clientX - estado.inicioPan.x;
          estado.y = estado.inicioPan.mapaY + evento.clientY - estado.inicioPan.y;
          pintar();
        }
      });

      const soltarPuntero = (evento) => {
        estado.punteros.delete(evento.pointerId);
        estado.inicioPinza = null;
        if (estado.punteros.size === 1) {
          const [restante] = estado.punteros.values();
          estado.inicioPan = { x: restante.x, y: restante.y, mapaX: estado.x, mapaY: estado.y };
        } else {
          estado.inicioPan = null;
        }
      };
      contenedor.addEventListener('pointerup', soltarPuntero);
      contenedor.addEventListener('pointercancel', soltarPuntero);

      contenedor.addEventListener('wheel', (evento) => {
        evento.preventDefault();
        const factor = evento.deltaY < 0 ? 1.2 : 1 / 1.2;
        acercarEn(estado.escala * factor, evento.clientX, evento.clientY);
      }, { passive: false });

      contenedor.addEventListener('dblclick', (evento) => {
        if (evento.target.closest('.mapa-zoom-controles')) return;
        evento.preventDefault();
        acercarEn(estado.escala === 1 ? 2 : 1, evento.clientX, evento.clientY);
      });

      controles.addEventListener('pointerdown', (evento) => evento.stopPropagation());
      controles.addEventListener('click', (evento) => {
        const accion = evento.target.closest('button')?.dataset.zoom;
        if (!accion) return;
        evento.stopPropagation();
        const rect = contenedor.getBoundingClientRect();
        const centroX = rect.left + rect.width / 2;
        const centroY = rect.top + rect.height / 2;
        if (accion === 'mas') acercarEn(estado.escala * 1.5, centroX, centroY);
        else if (accion === 'menos') acercarEn(estado.escala / 1.5, centroX, centroY);
        else restablecer();
      });
    }

    estado.escala = 1;
    estado.x = 0;
    estado.y = 0;
    estado.punteros.clear();
    estado.inicioPan = null;
    estado.inicioPinza = null;
    imagen.style.transform = 'translate3d(0, 0, 0) scale(1)';
  }

  globalThis.configurarZoomMapaVintage = configurarZoomMapaVintage;
})();
