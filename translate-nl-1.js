import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-neerlandes.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "1": "<p>De Fallas werden in 2016 door de Unesco uitgeroepen tot Immaterieel Cultureel Erfgoed van de Mensheid.</p>",
  "2": "<p>Volg de kaart en omloop het monument. Aan de voorkant, over de weg, bevindt zich de <strong>Brug van Serranos</strong>, aangegeven op uw kaart met nummer <mark>1</mark>.</p>",
  "2-B": "<p>Eenmaal bij het Palau, gaat u door naar de Torens waardoor vorsten en edelen het Koninkrijk Valencia betraden. Op uw kaart correspondeert dit met nummer <mark>1</mark>.</p>",
  "2-C": "<p>Keer terug naar het tracé van de muren met de aangewezen rijstrook en ga door naar de Torens waardoor vorsten en edelen het Koninkrijk Valencia betraden; op uw kaart corresponderen zij met nummer <mark>1</mark>.</p>",
  "2-D": `<p>Dit gebouw aan uw rechterhand latend, kunt u de <strong>Calle de los Serranos</strong> zien, die de wijken "La Seu" of <strong>Kathedralenbuurt</strong>, rechts, en de beroemde buurt "El Carmen" links, scheidt en afbakent.</p>\n<p>Ga door naar de Torens waardoor vorsten en edelen het Koninkrijk Valencia betraden; op uw kaart corresponderen zij met nummer <mark>1</mark>.</p>`,
  "2-E": "<p>Eenmaal over de brug, sla rechtsaf en ga door naar de Torens waardoor vorsten en edelen het Koninkrijk Valencia betraden; op uw kaart corresponderen zij met nummer <mark>1</mark>.</p>",
  "2-F": "<p>Bevindt u zich al op de <strong>Calle de los Serranos</strong>? Sla rechtsaf en ga door naar de Torens waardoor vorsten en edelen het Koninkrijk Valencia betraden. Op uw kaart corresponderen zij met nummer <mark>1</mark>.</p>",
  "2-G": "<p>U bent er bijna! Ga door tot het einde van de straat en sla linksaf. Van daaruit zijn de Torens al te zien. Op uw kaart corresponderen zij met nummer <mark>1</mark>.</p>",
  "3": "<p>Ga naar uw volgende bezienswaardigheidspunt; op uw kaart correspondeert dit met nummer <mark>13</mark>.</p>",
  "3-B": "<p>Op uw kaart correspondeert dit met nummer <mark>13</mark>.</p>",
  "3-C": "<p>Correspondeert met nummer <mark>13</mark> op uw kaart.</p>",
  "3-D": "<p>Een paar stappen verder op deze voetgangerspromenade, aan uw linkerhand, valt een gebouw op dat doet denken aan oude moslimspaleizen; op uw kaart correspondeert dit met nummer <mark>13</mark>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "3-E": "<p>Met het <strong>Estació del Nord</strong> achter u, verlaat het terrein en neem de aangewezen weg die links van u uitkomt.</p>\n<p>Deze rijstrook voor persoonlijke voertuigen volgt het tracé van de oude muur van Valencia. Na verscheidene straten ziet u aan uw rechterhand een begroeide zone met zuilen en palmbomen. Vergeet de verkeersregels niet te respecteren!</p>\n<p>Druk op pauze, ga of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "4": `<p>De collectie bestaat uit ongeveer 10.500 werken die de belangrijkste artistieke uitingen van de kunst van de 20e eeuw illustreren.</p>\n<p>Er bestaat een toekomstig project dat voorziet in de uitbreiding met een metalen omhulsel dat het gebouw volledig zou bedekken en een galerij aan de achterzijde zou toevoegen.</p>\n<p>Als u er bent tijdens de openingsuren, beveelt ${LOGO} u aan op pauze te drukken en dit museum te bezoeken en van de tentoonstellingen te genieten.</p>\n<p>U kunt uw avontuur hervatten wanneer u dat geschikt acht. Druk gewoon op de bijbehorende knop en ga verder <i>op zoek naar de schat</i>.</p>`,
  "5": "<p>Volg de kaart en omloop het monument.</p>\n<p>Aan de voorkant, over de weg, bevindt zich de <strong>Brug van Serranos</strong>, aangegeven op uw kaart met nummer <mark>2</mark>.</p>",
  "5-B": "<p>Het volgende doel van uw Avontuur correspondeert op uw kaart met nummer <mark>2</mark>.</p>",
  "6": "<p>Op uw kaart correspondeert dit met nummer <mark>3</mark>.</p>",
  "6-B": "<p>Op uw kaart correspondeert dit met nummer <mark>3</mark>.</p>",
  "6-C": "<p>Bij het verlaten van het plein, neem de straat die links van u uitkomt en volg het tracé tot het einde. Daar keert u terug naar een monument dat u al in dit Avontuur hebt gezien.</p>\n<p>Het <strong>Paleis van de Generalitat</strong>, dat overeenkomt met nummer <mark>3</mark> op uw kaart.</p>",
  "7": "<p>Op uw kaart correspondeert dit met nummer <mark>4</mark>.</p>",
  "7-B": "<p>Op uw kaart staan dit respectievelijk de nummers <mark>4</mark> en <mark>6</mark>.</p>",
  "7-C": "<p>Neem de <strong>Puente del Real</strong> als referentie, aangegeven op uw kaart met nummer <mark>4</mark>, en ga door naar de volgende brug, de <strong>Puente de la Exposición</strong>, die op uw kaart overeenkomt met nummer <mark>5</mark>. Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "8": "<p>Op uw kaart correspondeert dit met nummer <mark>5</mark>.</p>",
  "8-B": "<p>Correspondeert met nummer <mark>5</mark> op uw kaart.</p>",
  "8-C": "<p>Als u omhoogkijkt, kunt u de noordzijde van de <strong>Kathedraal van Valencia</strong> bewonderen.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>5</mark>.</p>",
  "9": `<p>${LOGO} beveelt u aan op pauze te drukken en dit gebied op uw eigen tempo te verkennen.</p>`,
  "9-B": `<p>${LOGO} beveelt u aan op pauze te drukken en dit gebied op uw eigen tempo te verkennen.</p>`,
  "10": "<p>Op uw kaart correspondeert dit met nummer <mark>6</mark>.</p>",
  "10-B": "<p>Op uw kaart correspondeert dit met nummer <mark>6</mark>.</p>",
  "10-C": "<p>Uw volgende bezienswaardigheidspunt in dit Avontuur correspondeert met nummer <mark>6</mark> op uw kaart.</p>",
  "11": "<p>Ga naar punt 7. Loop via de fietsstrook naar het midden van de brug.</p>",
  "11-B": "<p>Op uw kaart correspondeert dit met nummer <mark>7</mark>.</p>",
  "11-C": "<p>Nu u iets dichterbij bent, kunt u uw volgende uitdaging oplossen.</p>",
  "11-D": "<p>Op uw kaart staat dit aangegeven met nummer <mark>7</mark>.</p>",
  "11-E": `<p>Open uw kaart en bekijk uw route aandachtig.</p>\n<p>In dit Avontuur stelt ${LOGO} u voor de brug voor u over te steken en de toegang te zoeken tot de beroemde <strong>Turia-tuin</strong> van Valencia.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>7</mark>.</p>\n<p>Deze toegang bevindt zich aan de overkant en links van de brug, enkele meters langs de muur van de oude rivier.</p>\n<p>Eenmaal beneden, volg de route op uw kaart; uw volgende doel correspondeert met nummer <mark>9</mark>.</p>`,
  "12": "<p>Op uw kaart correspondeert dit met nummer <mark>8</mark>.</p>",
  "12-B": "<p>Op uw kaart correspondeert dit met nummer <mark>8</mark>.</p>",
  "12-C": "<p>Bevindt u zich op het <strong>Plaza del Tossal</strong>? Ja? Uitstekend! Op uw kaart correspondeert dit met nummer <mark>8</mark>.</p>",
  "12-D": "<p>Neem de <strong>Puente del Real</strong> als referentie, aangegeven op uw kaart met nummer <mark>8</mark>, en ga door naar de volgende brug, die op uw kaart overeenkomt met nummer <mark>9</mark>. De <strong>Puente de la Exposición</strong>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent, dank u.</p>",
  "13": "<p>Op uw kaart correspondeert dit met nummer <mark>9</mark>.</p>",
  "13-B": "<p>Bevindt u zich al op het punt aangegeven met nummer <mark>9</mark> op uw kaart? Uitstekend!</p>",
  "13-C": "<p>Op uw kaart correspondeert dit met nummer <mark>9</mark>.</p>",
  "14": "<p>Ga naar punt nummer <mark>10</mark> op uw kaart.</p>",
  "14-B": "<p>Op uw kaart correspondeert dit met nummer <mark>10</mark>.</p>",
  "14-C": "<p>Op uw kaart correspondeert dit met nummer <mark>10</mark>.</p>",
  "15": "<p>Op uw kaart correspondeert dit met nummer <mark>11</mark>.</p>",
  "15-B": "<p>Bij het verlaten van dit onregelmatige straatpatroon, richt uw aandacht op uw rechterhand. Uw volgende doel in deze zoektocht naar de schat is het beroemde <strong>Plaza de la Virgen</strong>.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>11</mark>.</p>",
  "15-C": "<p>Met het gemeentehuis voor u, neem de weg die links van u loopt en volg de kaart die u naar het einde van de laan leidt, om vervolgens linksaf te slaan.</p>\n<p>Aan de overkant van de laan rijst het <strong>Estació del Nord</strong> op, een monumentaal gebouw in modernistische stijl dat in 1917 werd ingewijd en op uw kaart overeenkomt met nummer <mark>11</mark>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "15-D": "<p>Op uw kaart correspondeert dit met nummer <mark>11</mark>.</p>",
  "16": "<p>Vanaf punt 11 op uw kaart is een van de meest iconische plekken van Valencia al vaag zichtbaar.</p>",
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
