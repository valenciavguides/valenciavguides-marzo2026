# Tests

## Qué hay aquí

| Ruta | Qué es | Cómo se ejecuta |
|------|--------|-----------------|
| `e2e/*.spec.js` | La suite E2E de Playwright. Es la red principal: abre la aplicación real en cuatro navegadores (chromium, firefox, pixel5, iphone12) | `npm run test:e2e` |
| `e2e/helpers/` | Arranque común de los specs (`boot.js`), stub de MapLibre y `marco-vacio.html`, un documento del mismo origen que hace de padre cuando un test necesita meter un frame en un iframe | — |
| `master-test.html` | Panel que importa el informe JSON de Playwright y muestra sus resultados agregados | Abrirlo con el servidor local |
| `*.test.js` | Tests del backend (API, datos, errores). **Hoy no los ejecuta nada**: no hay jest ni vitest instalados ni script `test` en `package.json` | — |

Lo que se puede comprobar sin navegador no vive aquí, sino en `tools/`: integridad de datos,
tipos de mensaje huérfanos, citas de la guía, esperas ciegas, medios. Ver §18.2 de
`docs/GUIA-COMPLETA.md` para la lista de comandos.

## Cómo correr la suite

```bash
npm run test:e2e              # los cuatro navegadores
npm run test:e2e:chromium     # solo chromium, para iterar
npm run test:e2e:report       # abre el informe de la última tanda
```

Un solo fichero, o repitiéndolo para cazar intermitencias:

```bash
npx playwright test tests/e2e/01-fase1-boot.spec.js --project=chromium
npx playwright test tests/e2e/01-fase1-boot.spec.js --repeat-each=10
```

## Cómo se escribe un spec aquí

- **Rojo antes que verde.** Un test que pasa con y sin el fallo no vale. Antes de dar uno por
  bueno se rompe a propósito lo que dice proteger y se comprueba que cae — y que caen sus casos
  y no los de al lado.
- **Esperar a una condición, no a un tiempo.** `page.waitForTimeout(n)` funciona en la máquina
  de quien lo escribe y falla en tandas completas. Se usa `expect.poll` o `waitForFunction`. La
  única excepción es demostrar que algo NO ocurre: eso se marca con
  `// VENTANA-OBSERVACION: <motivo>` y lo vigila `npm run verificar-esperas`.
- **Mirar el efecto, no la función.** Se comprueba lo que ve el usuario (una clase, un
  `display`, un mensaje que llega), no que se haya llamado a algo.
- **Que el arnés se delate.** Si el test monta un iframe, comprueba que cargó lo que creía: una
  página de error también tiene `body`, y sin esa comprobación un 404 parece un fallo del código.
- **La cabecera explica POR QUÉ existe el fichero**, qué midió quien lo escribió y qué NO cubre.
