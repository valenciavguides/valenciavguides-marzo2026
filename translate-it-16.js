import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-italiano.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "500-B": "<p>Continui fino alla fine della via, poi giri a sinistra e segua la via fino a vedere il prossimo punto di interesse alla sua destra; lì emerge la <strong>Fontana del Negrito</strong>.</p>\n<p>Sulla sua mappa corrisponde al numero <mark>7</mark>.</p>\n<p>Ricordi di premere pausa, poi visualizzi il punto indicato e prema nuovamente il pulsante continua una volta giunto nel luogo suggerito.</p>",
  "VIV11-B": "<p>Alla fine di questo spazio, un timido lago si presenta alla sua destra. Si diriga al lago dei cigni. Sulla sua mappa corrisponde al numero <mark>11</mark>.</p>",
  "VIV11-C": "<p>Questo è il noto lago dei cigni, dove uccelli migratori, come cicogne e anatre, si riposano in questo habitat protetto per recuperare le forze prima di riprendere il volo.</p>",
  "VIV12": "<p>Quale figura decora la fontana? È un'anatra? Una cicogna? O forse un Pesce?</p>\n\n<p>Prema pausa e si rechi nel luogo indicato per completare il suo reto.</p>",
  "VIV13": "<p>Seguendo la forma del giardino, una scultura dedicata all'acqua dà il benvenuto a uno degli angoli più discreti del parco. Sulla sua mappa corrisponde al numero <mark>12</mark>.</p>",
  "VIV14": "<p>un bambino, è molto più di un elemento decorativo: è un'opera simbolica che rappresenta il rapporto umano con l'acqua. Situata in un contesto storicamente legato all'irrigazione e all'orticoltura, ricorda l'importanza essenziale dell'acqua come base della vita, senza la quale non esisterebbero né l'agricoltura né le città. La composizione rafforza questo messaggio: l'acqua simboleggia l'origine della vita, la madre la cura e la protezione, e il bambino la continuità e il futuro.</p>",
  "VIV15": `<p>Dietro la fontana si apre un portale di stile barocco dedicato a San Giuliano.</p>\n\n<p>Questo spazio intimo nasconde due portali agli antichi giardini del palazzo che Conti e Duchi avevano dalla loro dimora.</p>\n\n<p>Oggi è un angolo romantico e tranquillo in cui potersi rilassare e godere di pace e serenità in una città in costante movimento.</p>\n\n<p>Sulla sua mappa corrisponde al numero <mark>12</mark>.</p>\n\n<p>Con il portale e la fontana alle spalle, si avventuri nella zona dei Ficus, alberi di grande dimensione originari dell'Australia.</p>\n\n<p>${LOGO} La incoraggia a esplorare quest'area tranquillamente.</p>\n\n<p>Riprenda questa avventura dall'uscita dei Giardini del Real, utilizzando la stessa porta da cui è entrata. Sulla sua mappa corrisponde al numero <mark>1</mark>.</p>`,
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
const missing = esKeys.filter(k => merged[k] === undefined);
if (missing.length) console.log('Claves sin traducir:', missing);
else console.log('Traducción italiana COMPLETA');
