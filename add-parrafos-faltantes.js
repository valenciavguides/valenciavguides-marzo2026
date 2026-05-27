const fs = require("fs");

let content = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");

// Nuevos párrafos a añadir al final del archivo
const nuevos = `

643 – (Av2, Av5, Av34km, )

<p>Un dato curioso es que, cuando es trasladada, la bandera debe ir con el mástil recto en todo momento.</p>

<p>Recuerde que este es un punto perfecto, para hacer una magnífica foto de este monumento declarado de interés histórico artístico.</p>

633 – (Av4, Av34km, )

<p>Despliegue y observe su mapa, este le indica que busque de nuevo el cauce del antiguo río Turia y tomar el carril condicionado a su derecha.</p>

<p>¡Volvemos al casco histórico, pero esto no acaba aquí! Recorra el itinerario sugerido y observará que pasados 5 puentes, le espera su próximo punto de interés.</p>

256 – (Av3, Av34km, )

<p>Las pistas le conducen a un nuevo portal del tiempo, éste se abre más adelante, a mano derecha y le trasladará a una época fantástica de relatos antiguos.</p>

296-B. – (Av5, )

<p>¡Desde este punto el trazado de esta aventura continua por circuito urbano!</p>

<p>Siga con cautela recuerde que, se debe respetar la normativa vial.</p>

<p>Mire las indicaciones que ofrece su mapa del tesoro y continúe por el carril adaptado <i>en busca del tesoro</i>.</p>

<p>Por la parte izquierda del jardín, un acceso le permite subir y cruzar esta obra adornada con 27.500 flores multicolores.</p>

296-C. – (Av3, )

<p>¡Enhorabuena! Ha recogido todas las pistas y resuelto los acertijos que le proponía el viejo cauce…¡¡Pero esta Aventura no acaba aquí!!</p>

<p>Como podrá comprobar, el mapa del tesoro le lleva de nuevo a la urbe. ¿Vamos a ello?</p>

225 – (Av3, Av5, Av34km, )

<p>Siga hasta el siguiente puente, el <strong>Puente de las Flores</strong>.</p>

14-B. – (Av3, Av5, )

<p>En su mapa corresponde con el número <mark>10</mark>.</p>

303 – (Av5, Av34km, )

<p>Despliegue y observe que su mapa del tesoro le indica continuar por el carril acondicionado hasta llegar al próximo punto de interés de esta Aventura ¡Recuerde respetar la normativa vial!</p>

<p>La <strong>Calle Colón</strong>, que se abre a su izquierda, es una de las calles comerciales por excelencia y ofrece todo tipo de posibilidades para los amantes de las compras.</p>

<p>En esta vía que traza hoy en día el lugar que ocupaba la muralla de la Valencia del siglo 15, numerosos negocios ofrecen toda clase de servicios y amenizan la vida de sus viandantes con escaparates y terrazas. Continúe, como indica su mapa hasta su siguiente punto de interés. Durante su trayecto, centre su atención en su lado izquierdo.</p>

12-B. – (Av5, )

<p>En su mapa corresponde al número <mark>8</mark>.</p>
`;

content = content.trimEnd() + nuevos;
fs.writeFileSync("textos-word/parrafos-ordenado-español.txt", content, "utf8");

// Verify all keys were added
const fc = fs.readFileSync("textos-word/parrafos-ordenado-español.txt", "utf8");
const keys = ["643", "633", "256", "296-B", "296-C", "225", "14-B", "303", "12-B"];
keys.forEach(k => {
  const found = new RegExp("^" + k.replace("-", "[-–]?") + "[.\\s]", "im").test(fc);
  console.log((found ? "OK" : "FAIL") + ": " + k);
});
