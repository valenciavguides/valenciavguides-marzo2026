# Contraste — lo que dice el texto vs. el número del mapa

¿El número de mapa que el texto le pide buscar al usuario es el del sitio al que
realmente le lleva el recorrido? Comparación de `js/parrafos-textos/` (español)
contra `js/coordenadas-aventuras.js`.

## Alcance

- Las **7 aventuras**, en **español**. Un error de número en español está también en
  los otros 11 idiomas de esa aventura, así que basta con mirar uno.
- **567** elementos con número de mapa y texto propio.

| Resultado | Cuántos |
|---|---|
| Su texto nombra el número correcto | 252 |
| Su texto no nombra ningún número de mapa | 305 |
| Sin destino numérico — no se puede juzgar | 23 |
| **Nombra un número de mapa que no es el suyo** | **10** |

Que un elemento no nombre ningún número **no es un fallo**: el aviso suele darlo el
tramo que lleva hasta allí, no la parada en sí.

## Dos comprobaciones que salieron limpias

- **Todos los párrafos citados existen.** Ningún texto apunta a un párrafo que falte
  en `parrafos-texto-espanol.json`. (0 fallos)
- **Todos los números que los textos nombran existen como pin de su aventura.**
  Ninguno apunta a un número inexistente. (0 fallos)

## Qué NO cubre

- Que el número sea el correcto **en el mapa dibujado**: esto compara texto contra
  datos. Si los dos coincidieran y el mapa impreso dijera otra cosa, no se vería aquí.
- Los otros 11 idiomas (por lo dicho arriba).

## Cómo se decide que un número "cuenta"

Y se da por bueno también si el número es el del **siguiente** elemento: el último
párrafo de una parada suele anunciar a dónde se va ahora ("El siguiente objetivo de su
Aventura corresponde en su mapa al número N").

Un número solo se compara si la frase habla del mapa (`en su mapa`, `punto N`,
`diríjase`, `indicado con`). Sin ese filtro entraban cosas como *"le dará información
sobre esta área en su **Aventura número 2**"*, que no es un pin: es el número de la
aventura. Y se acepta el número si aparece en **cualquier** párrafo del elemento: los
textos nombran de paso otros puntos —un puente por el que se pasa— además del destino.

---

## Para revisar (10)

Ninguna está tocada. **Cinco de ellas fallan exactamente por 1** (5→6, 11→12, 17→18,
71→72), lo que apunta más a un desplazamiento de numeración que a erratas sueltas.

**Si hay que corregir el número del mapa** → `coordenadas-aventuras.js` (1 sitio) y
`aventuras-ID-padre.js` (×12 idiomas).  
**Si hay que corregir el texto** → `js/parrafos-textos/` (los 12 ficheros de idioma).

### 1. `Av4-TR-24` — Aventura4

- **Sitio:** Museo de Ciencias Naturales → Jardín de la Rosaleda
- **El mapa dice:** `v8→v10` → destino `10`
- **El texto nombra:** 9
- **En el recorrido:** Av4-P-29 (v8)  →  Av4-TR-24 (v8→v10)  →  Av4-P-30 (v10)

Párrafo `viv7`:

> El mapa de estos jardines le lleva a alejarse de este punto para volver más tarde. Por ahora, diríjase a la derecha donde le aguarda una zona que recuerda a los jardines de Versalles. En su mapa corresponde al número 9 .

- [ ] Revisado — decisión:

### 2. `Av34km-P-109` — Aventura34km

- **Sitio:** Parque de Cabecera (El Morro)
- **El mapa dice:** `71`
- **El texto nombra:** 72
- **En el recorrido:** Av34km-P-108 (71)  →  Av34km-P-109 (71)  →  Av34km-TR-72 (71→73)

Párrafo `715`:

> En su mapa corresponde al número 72 .

- [ ] Revisado — decisión:

### 3. `Av34km-TR-83` — Aventura34km

- **Sitio:** Museo de Ciencias Naturales → Jardín de la Rosaleda
- **El mapa dice:** `v8→v10` → destino `10`
- **El texto nombra:** 9
- **En el recorrido:** Av34km-P-119 (v8)  →  Av34km-TR-83 (v8→v10)  →  Av34km-P-120 (v10)

Párrafo `viv7`:

> El mapa de estos jardines le lleva a alejarse de este punto para volver más tarde. Por ahora, diríjase a la derecha donde le aguarda una zona que recuerda a los jardines de Versalles. En su mapa corresponde al número 9 .

- [ ] Revisado — decisión:

### 4. `Av1-P-10` — Aventura1

- **Sitio:** Arco Novo Catedral y Puerta Negra Basílica
- **El mapa dice:** `5,9`
- **El texto nombra:** 7
- **En el recorrido:** Av1-P-9 (5)  →  Av1-P-10 (5,9)  →  Av1-P-11 (?)

Párrafo `11-B`:

> En su mapa corresponde al número 7 .

- [ ] Revisado — decisión:

### 5. `Av34km-P-65` — Aventura34km

- **Sitio:** Plaza Décimo Junio Bruto (Cimborrio de la Catedral de Valencia)
- **El mapa dice:** `42`
- **El texto nombra:** 40
- **En el recorrido:** Av34km-P-64 (33)  →  Av34km-P-65 (42)  →  Av34km-TR-42 (42→43)

Párrafo `49-B`:

> Centre su atención de nuevo en la Catedral de Valencia , número 40 en su mapa.

- [ ] Revisado — decisión:

### 6. `Av4-TR-8` — Aventura4

- **Sitio:** Na Turia (Plataforma elevada) → Na Turia (Museo)
- **El mapa dice:** `11→11` → destino `11`
- **El texto nombra:** 14
- **En el recorrido:** Av4-P-13 (11)  →  Av4-TR-8 (11→11)  →  Av4-P-14 (11)

Párrafo `21`:

> Corresponde al número 14 en su mapa.

- [ ] Revisado — decisión:

### 7. `Av5-P-4` — Aventura5

- **Sitio:** Ruinas del Jardín del Turia
- **El mapa dice:** `3`
- **El texto nombra:** 6
- **En el recorrido:** Av5-TR-3 (-→3)  →  Av5-P-4 (3)  →  Av5-TR-4 (3→4)

Párrafo `704`:

> ¿Ya se encuentra en el punto indicado con el número 6 en su mapa?

- [ ] Revisado — decisión:

### 8. `Av3-P-13` — Aventura3

- **Sitio:** Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
- **El mapa dice:** `17`
- **El texto nombra:** 21,24,18
- **En el recorrido:** Av3-TR-11 (15→17)  →  Av3-P-13 (17)  →  Av3-TR-12 (17→-)

Párrafo `18-B`:

> Corresponden a los números 21 y 24 en su mapa.

Párrafo `27-B`:

> En su mapa corresponde al número 18 .

- [ ] Revisado — decisión:

### 9. `Av34km-P-9` — Aventura34km

- **Sitio:** Pistas de Patinaje
- **El mapa dice:** `11`
- **El texto nombra:** 15,18,12
- **En el recorrido:** Av34km-TR-9 (10→11)  →  Av34km-P-9 (11)  →  Av34km-TR-10 (11→-)

Párrafo `18`:

> Corresponden a los números 15 y 18 en su mapa.

Párrafo `19`:

> En su mapa corresponde al número 12 .

- [ ] Revisado — decisión:

### 10. `Av34km-P-28` — Aventura34km

- **Sitio:** Edificio del Ayuntamiento
- **El mapa dice:** `28`
- **El texto nombra:** 17
- **En el recorrido:** Av34km-P-27 (27/28)  →  Av34km-P-28 (28)  →  Av34km-TR-25 (28→29)

Párrafo `113`:

> Desde el punto 17, en su mapa se puede entrever uno de los puntos más icónicos de Valencia.

- [ ] Revisado — decisión:
