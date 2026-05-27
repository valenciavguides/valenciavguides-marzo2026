import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-italiano.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "101": "<p>A soli 150 metri, proprio nella piazza successiva, monumenti di epoche diverse si fondono nel presente diventando parte della nostra vita. La sua caccia al tesoro la conduce a iniziare dall'edificio monumentale sulla sinistra.</p>\n\n<p>Sulla sua mappa corrisponde al numero <mark>17</mark>.</p>\n\n<p>Prema di nuovo pausa, poi si rechi al punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito.</p>",
  "102": "<p>Lasci questa piazza alla sua destra e segua la sua mappa.</p>",
  "103": "<p>Si posizioni con le torri alle spalle e continui per la <strong>Calle de los Serranos</strong>. Pochi metri più avanti, alla sua destra, emerge un edificio destinato, sin dalla sua costruzione, a salvare vite.</p>\n\n<p>Sulla sua mappa corrisponde al numero <mark>2</mark>.</p>\n\n<p>Faccia attenzione poiché l'edificio è molto discreto e potrebbe passare inosservato.</p>\n\n<p>Prema pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "104": "<p>La sua Avventura continua tranquilla fino alla fine della <strong>Calle de los Serranos</strong>.</p>\n\n<p>Al termine della strada, alla sua sinistra, si trova il famoso <strong>Palazzo della Generalitat</strong>.</p>\n\n<p>Metta in pausa questa audioguida e si diriga, come indica la sua mappa, al suo prossimo punto di interesse; una volta lì riprenda la sua Avventura. Sulla sua mappa corrisponde al numero <mark>3</mark>.</p>",
  "105": "<p>Al termine del percorso arriverà alla <strong>Calle de los Serranos</strong>, luogo dove è iniziata la sua Avventura. Attraversi la strada e giri a destra. Non metta in pausa questa audioguida e si diriga al punto indicato, grazie.</p>",
  "106": "<p>Prema pausa e prema di nuovo il tasto continua quando lo riterrà opportuno.</p>",
  "107": "<p>Prema pausa, poi risolva la sua sfida e prema di nuovo il tasto continua.</p>",
  "108": "<p>Prema pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito.</p>",
  "108-B": "<p>Prema pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "109": "<p>Ricordi di premere pausa, poi si rechi al punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "110": "<p>Ricordi di premere pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "111": "<p>Usi il tasto pausa a suo piacimento; quando si sentirà pronto, continui semplicemente a risolvere le nostre sfide mentre scopre la città.</p>",
  "111-B": "<p>Ora che si trova un po' più vicino, può risolvere la sua prossima sfida.</p>",
  "111-C": "<p>Ora che si trova un po' più vicino, può risolvere la sua prossima sfida.</p>",
  "111-D": "<p>Usi il tasto pausa a suo piacimento; quando si sentirà pronto, continui semplicemente a risolvere le nostre sfide mentre scopre la città.</p>",
  "112": "<p>Continui fino al <strong>Puente de la Exposición</strong>, indicato sulla sua mappa con il numero <mark>4</mark>. Grazie.</p>",
  "113": "<p>Dal punto 17 sulla sua mappa si può intravedere uno dei luoghi più iconici di Valencia.</p>",
  "114": "<p>È arrivato al punto indicato? Le sembra familiare il percorso? Bene! Questa volta prenda la prima strada alla sua sinistra e la segua; potrà verificare il tessuto urbano arabo di cui parlavamo prima. Sì, è come un labirinto, vero? Continui a camminare finché non esce da questo tessuto irregolare.</p>",
  "115": "<p>È arrivato al punto suggerito? Bene! Non metta in pausa questa audioguida.</p>",
  "115-B": "<p>È arrivato al punto suggerito? Bene! Non metta in pausa questa audioguida.</p>",
  "116": "<p>Questa avventura la conduce ad attraversare il ponte che offre viste magnifiche sulla <strong>Città delle Arti e delle Scienze</strong>.</p>\n\n<p>Mentre attraversa il ponte presti particolare attenzione alla sua sinistra dove spicca l'Àgora.</p>\n\n<p>Numero <mark>22</mark> sulla sua mappa.</p>\n\n<p>Subito dietro si trova il noto Oceanogràfic.</p>\n\n<p>Che corrisponde al numero <mark>23</mark> sulla sua mappa.</p>\n\n<p>Una volta attraversato il ponte, si posizioni, come indica la sua mappa, in una zona sicura che offre viste magnifiche di quest'area. Questa zona sicura che suggeriamo si trova a sinistra, scendendo dal ponte.</p>\n\n<p>Ricordi di premere pausa, poi visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito.</p>",
  "117": "<p>Cosa si può vedere nel fornice dell'arco centrale?</p>",
  "118": "<p>Le sedie che si trovano nelle strade lungo i percorsi delle bande musicali sono a noleggio. Se le trova libere può sedersi. Ricordi che cedere il posto a persone con minore capacità fisica è un grande gesto di rispetto.</p>",
  "119": "<p>Non metta in pausa questa audioguida e si diriga, come indica la sua mappa, al suo prossimo punto di interesse.</p>",
  "120": "<p>Non metta in pausa questa audioguida e si diriga, come indica la sua mappa, al suo prossimo punto di interesse.</p>",
  "121": "<p>Non metta in pausa questa audioguida e si diriga, se vuole, al lato opposto dell'edificio. Grazie.</p>",
  "122": "<p>Non metta in pausa questa audioguida.</p>",
  "123": "<p>Non metta in pausa questa audioguida.</p>",
  "124": "<p>Un edificio del XIX secolo in stile neoclassico, realizzato in mattoni.</p>\n\n<p>È opportuno sottolineare che nel XXI secolo l'attuale <strong>Plaza de Toros</strong> è anche uno spazio multiculturale che offre eventi di ogni tipo.</p>",
  "125": "<p>Segua la mappa tra la Cattedrale e il <strong>Palazzo Arcivescovile</strong>.</p>\n\n<p>Attraversi la piazza che ha di fronte lasciando la Cattedrale alle spalle.</p>\n\n<p>Segua la mappa per raggiungere la Calle San Vicente Mártir, ma presti attenzione!</p>\n\n<p>Al termine della strada del Santo Patrono, la mappa le indica di prendere il percorso a sinistra.</p>\n\n<p>Troverà l'indizio nella <strong>Plaza del Ayuntamiento</strong>.</p>\n\n<p>Sulla sua mappa corrisponde al numero <mark>9</mark>.</p>\n\n<p>Questo è un punto perfetto per fermarsi a scattare magnifiche fotografie dei tesori architettonici che offre la città.</p>\n\n<p>Prema pausa, poi si rechi al punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito.</p>",
  "126": "<p>Questo è un punto perfetto per scattare una magnifica fotografia di questo monumento dichiarato di interesse storico artistico.</p>",
  "126-B": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 1.</p>`,
  "127": "<p>Questo è un punto perfetto per scattare una magnifica fotografia di questo monumento dichiarato di interesse storico artistico.</p>",
  "128": "<p>Conosciuto popolarmente come <strong>Puente Amarillo</strong>, è una piattaforma di passaggio che collega i due lati della città. Alla sua base sono ancora visibili i cosiddetti \"saltos y rápidos\". Sono le enormi pietre triangolari che incanalavano e rallentavano l'acqua, evitando che battesse troppo violentemente contro il muro.</p>",
  "129": "<p>Valencia in Fallas!</p>",
  "129-B": "<p>Valencia in Fallas!</p>",
  "130": "<p>Faccia un uso responsabile degli arredi urbani e rispetti gli eventi pubblici; esistono zone apposite per attraversare i diversi spettacoli e bande musicali. Rispetti sempre i perimetri di sicurezza che sono indicati.</p>",
  "131": "<p>Per comprendere questa festività è necessario avere chiari alcuni concetti che ne facilitino la comprensione. Si distinguono quindi:</p>",
  "132": "<p>Tiempo de Fallas come festività di Valencia (dall'1 al 19 marzo).</p>",
  "133": "<p>Falla come associazione di vicini senza scopo di lucro che si riuniscono durante l'anno in locali chiamati \"Casals\". Ottengono i propri proventi attraverso la vendita di partecipazioni a diverse lotterie, una quota associativa, contributi governativi e i premi per la classificazione al miglior monumento fallero.</p>",
  "134": "<p>Falla: come monumento fallero che sarà esposto dal 15 al 19 marzo; si distinguono tra grandi e infantili. Le fallas si classificano per sezione. La sezione speciale è la più importante di tutte, poiché raggruppa le commissioni falleras che piantano o assemblano i monumenti Falleros con il budget più elevato della città, che competono per il premio alla migliore falla. Vengono assegnati anche altri premi come il premio all'ingegno e alla grazia e all'illuminazione delle strade.</p>",
  "135": "<p>Se vuole, si posizioni in un punto da cui possa vedere le torri, nella loro totalità, dal lato frontale. Grazie.</p>",
  "136": "<p>È già arrivato al punto suggerito? Metta in pausa questa audioguida se lo ritiene necessario. Coraggio, mancano solo pochi metri!</p>",
  "137": "<p>Osservi le torri, concentri la sua attenzione sul grande balcone merlato. Dal 1954, in questo stesso punto ogni anno viene dato il via alle celebrazioni falleras. \"La Cridà\" è la chiamata alla festa delle falleras mayores di Valencia a chiunque voglia partecipare.</p>",
  "138": "<p>Sono tanti monumenti, vero? Le Fallas come monumento: cosa sono?</p>",
  "139": "<p>Il monumento fallero è una scultura artistica con figure generalmente di grandi dimensioni chiamate Ninots, le quali circondano una o più figure centrali. La falla è realizzata in materiali combustibili (cartone, legno, carta, tessuti); i monumenti vengono installati nelle strade affinché, dopo alcuni giorni di esposizione, possano essere bruciati completamente.</p>\n\n<p>Il 15 marzo inizia la Plantà (assemblaggio del monumento), con alcuni che raggiungono i 25 metri di altezza. Dal 16 mattina alle otto le fallas sono completate ed esposte per aspirare al primo premio.</p>",
  "140": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 1.</p>`,
  "141": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 2.</p>`,
  "142": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 3.</p>`,
  "143": "<p>Se non si trova in orario di apertura, potrà sempre fare una pausa in un punto da cui contemplare l'intera piazza e semplicemente godersi l'audio della sua Avventura.</p>\n\n<p>In questo spazio urbano si svela uno scorcio di diversi tesori architettonici che offre la città, riuniti in un'unica piazza.</p>\n\n<p>Prema pausa e prema di nuovo il tasto continua quando lo riterrà opportuno.</p>",
  "144": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 5.</p>`,
  "145": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura Speciale Fallas.</p>`,
  "146": "<p>Concentri la sua attenzione sull'edificio che ha una cupola ovale di colore blu.</p>\n\n<p>Questa è la nota <strong>Basilica di Valencia</strong>.</p>",
  "147": "<p>La <strong>Cattedrale di Valencia</strong> sorge sull'antica Seo Visigota che secoli dopo divenne Moschea Maggiore, ragione per cui nella sua facciata nord, la più antica, il tempio assume una forma arrotondata anziché la tradizionale pianta a croce.</p>\n\n<p>Nel XIII secolo la costruzione della Cattedrale avanzava man mano che veniva utilizzata la Moschea araba situata in questo stesso luogo.</p>",
  "148": `<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 3.</p>`,
  "149": "<p>La costruzione della Cattedrale impiegò 500 anni per essere completata e durante questo lungo periodo gli stili architettonici cambiarono; per questo motivo nella <strong>Cattedrale di Valencia</strong> si fondono diversi stili architettonici.</p>\n\n<p>Questi stili sono visibili con totale chiarezza nelle sue tre porte: Barocca quella principale che vedrà di seguito in questa Avventura, Gotica quella che ha di fronte adesso e Romanica sulla facciata est, della quale offriremo maggiori informazioni nella nostra Avventura numero 1.</p>\n\n<p>In quella stessa Avventura viene dettagliata anche la piazza che si trova dietro la Cattedrale, che fu, per caso, il chilometro zero della Valencia Romana.</p>",
  "150": "<p>Concentri la sua attenzione in fondo alla piazza; il suo prossimo obiettivo è il famoso <strong>Miguelete</strong>. Un'alta torre che svetta dietro la Cattedrale. Ma prima parliamo del portico della Cattedrale.</p>",
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
