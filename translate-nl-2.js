import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-neerlandes.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "17": "<p>Van de nummers <mark>12</mark> tot <mark>19</mark> zijn de monumenten die de <strong>Ciudad de las Artes y de las Ciencias</strong> vormen, en de nummers <mark>13</mark> en <mark>15</mark> corresponderen met de bruggen die het gebied completeren.</p>",
  "17-B": "<p>Van de nummers <mark>18</mark> tot <mark>25</mark> zijn de monumenten die de <strong>Ciudad de las Artes y de las Ciencias</strong> vormen, en de nummers <mark>19</mark> en <mark>21</mark> corresponderen met de bruggen die het gebied completeren.</p>",
  "18": "<p>Corresponderen met de nummers <mark>15</mark> en <mark>18</mark> op uw kaart.</p>",
  "18-B": "<p>Corresponderen met de nummers <mark>21</mark> en <mark>24</mark> op uw kaart.</p>",
  "19": "<p>Op uw kaart correspondeert dit met nummer <mark>12</mark>.</p>",
  "20": "<p>Correspondeert met nummer <mark>12</mark> op uw kaart.</p>",
  "20-B": "<p>Ga naar punt 12. Loop via de fietsstrook naar het midden van de brug.</p>\n<p>Druk op pauze wanneer u bovenaan de brug bent; ga door tot het midden van de brug en druk opnieuw op de doorgaan-knop.</p>",
  "20-C": "<p>Onmiddellijk na het Spoorwegstation rijst de <strong>Plaza de Toros</strong> op; op uw kaart correspondeert dit met nummer <mark>12</mark>.</p>",
  "21": "<p>Correspondeert met nummer <mark>14</mark> op uw kaart.</p>",
  "21-B": "<p>Aan het einde van de promenade verschijnt rechts een architectonisch juweeltje; op uw kaart correspondeert dit met nummer <mark>14</mark>.</p>\n<p>Druk op pauze, ga of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "21-C": "<p>De Barokke Ingang van de Kathedraal achter u latend, voor u opent zich een plein dat de weg vrijmaakt om uw Schatzoeking voort te zetten.</p>\n<p>Volg het tracé van uw kaart dat u het plein doet oversteken.</p>\n<p>Na het oversteken van het Plein, aan uw rechterhand, verschijnt uw volgende doel. Een slanke barokke toren is bescheiden zichtbaar aan de rechterkant.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>14</mark>. Kunt u het zien?</p>",
  "21-D": "<p>De Barokke Ingang van de Kathedraal achter u latend, voor u opent zich een plein dat de weg vrijmaakt om uw Schatzoeking voort te zetten.</p>\n<p>Volg het tracé van uw kaart dat u het plein doet oversteken.</p>\n<p>Na het oversteken van het Plein, aan uw rechterhand, verschijnt uw volgende doel. Een slanke barokke toren is bescheiden zichtbaar aan de rechterkant.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>10</mark>. Kunt u het zien?</p>\n<p>Zet deze audiogids niet op pauze en ga naar het aangegeven punt, dank u.</p>",
  "22": "<p>Op uw kaart correspondeert dit met nummer <mark>15</mark>.</p>",
  "22-B": "<p>Op uw kaart correspondeert dit met nummer <mark>15</mark>.</p>",
  "22-C": "<p>Richt uw aandacht op het geheel van <strong>Bioparc</strong>, nummer <mark>15</mark> op uw kaart.</p>",
  "22-D": "<p>Zoals uw kaart aangeeft, gaat u door tot het einde van de straat en slaat u linksaf. Onze beroemde <strong>Mercado Central</strong> verschijnt rechts van u; op uw kaart correspondeert dit met nummer <mark>15</mark>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "22-E": "<p>Ga naar punt nummer <mark>15</mark> op uw kaart.</p>",
  "23": `<p>Als u er bent tijdens de openingsuren, beveelt ${LOGO} u aan op pauze te drukken en dit monument op uw eigen tempo te bezoeken.</p>\n<p>Er is geen haast. Wanneer u voelt dat het juiste moment is gekomen, druk dan gewoon op doorgaan en ga verder met uw Avontuur <i>op zoek naar de Valenciaanse schat</i>.</p>`,
  "23-B": "<p>Het Paleis van de Markies van Dos Aguas correspondeert op uw kaart met nummer <mark>16</mark>.</p>",
  "23-C": "<p>Correspondeert met nummer <mark>16</mark> op uw kaart.</p>",
  "23-D": "<p>Op uw kaart correspondeert dit met nummer <mark>16</mark>.</p>",
  "24": `<p>Als u er bent tijdens de openingsuren, beveelt ${LOGO} u aan op pauze te drukken en dit monument op uw eigen tempo te bezoeken.</p>`,
  "24-B": "<p>Gebruik de pauzeknop naar wens. Wanneer u er klaar voor bent, ga dan gewoon verder met het oplossen van onze uitdagingen terwijl u de stad ontdekt.</p>\n<p>Uw Avontuur gaat verder, zoals uw kaart aangeeft, aan uw linkerhand terug naar het tracé van de oorspronkelijke muren. Concreet naar een van de ingangen van Valencia, die op uw kaart correspondeert met nummer <mark>17</mark>.</p>",
  "24-C": "<p>Met de <strong>Lonja</strong> aan uw linkerhand en de <strong>Mercado Central</strong> achter u, ga, zoals uw kaart aangeeft, naar het volgende bezienswaardigheidspunt in dit Avontuur, nummer <mark>17</mark>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "24-D": "<p>Op uw kaart correspondeert dit met nummer <mark>17</mark>.</p>",
  "24-E": "<p>Terwijl u naar de blinde booggevels van de <strong>Iglesia de Santa Catalina</strong> kijkt, dateert de derde monumentale ingang van dit heiligdom uit 1785 en bevindt zich om de hoek. Dat is ook uw volgende bestemming in dit Avontuur.</p>\n<p>Let goed op! Uw kaart geeft aan om dit monument te omronden en de eerste straat rechts te nemen.</p>\n<p>Aan het einde van deze korte en smalle straat, ter hoogte van de eerste verdieping, bevindt zich uw volgende bezienswaardigheidspunt.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>17</mark>.</p>\n<p>Druk op pauze, bekijk het aangegeven punt en druk op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "24-F": "<p>Op uw kaart correspondeert dit met nummer <mark>17</mark>.</p>",
  "25": "<p>Langs het bed van de oude rivier, op ongeveer 50 meter, bevindt zich de esplanade vanwaar het vuurwerk wordt afgeschoten.</p>\n<p>Als u de gelegenheid heeft gehad ons tijdens dit festival te bezoeken, heeft u kunnen ervaren dat de Valencianen van vuurwerk houden.</p>",
  "26": `<p>Als u er bent tijdens de openingsuren, adviseert ${LOGO} u op pauze te drukken en dit historische complex op uw eigen tempo te bezoeken.</p>\n<p>U kunt uw avontuur hervatten wanneer u dat geschikt acht.</p>`,
  "26-B": `<p>Als u er bent tijdens de openingsuren, adviseert ${LOGO} u op pauze te drukken en dit historische complex op uw eigen tempo te bezoeken.</p>\n<p>U kunt uw avontuur hervatten wanneer u dat geschikt acht.</p>`,
  "27": "<p>Op uw kaart correspondeert dit met nummer <mark>18</mark>.</p>",
  "27-B": "<p>Op uw kaart correspondeert dit met nummer <mark>18</mark>.</p>",
  "27-C": "<p>Uw avontuur gaat verder met het gebouw dat op uw kaart overeenkomt met nummer <mark>18</mark>.</p>",
  "27-D": "<p>Uw Avontuur gaat verder, zoals uw kaart aangeeft, langs het tracé van de muren.</p>\n<p>Enkele meters verderop wachten 3 opeenvolgende punten in uw Avontuur.</p>\n<p>Op uw kaart corresponderen zij respectievelijk met de nummers <mark>18</mark>, <mark>19</mark> en <mark>20</mark>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "28": "<p>Op uw kaart correspondeert dit met nummer <mark>19</mark>.</p>",
  "28-B": "<p>Op uw kaart correspondeert dit met nummer <mark>19</mark>.</p>",
  "29": `<p>Als u er bent tijdens de openingsuren, adviseert ${LOGO} u op pauze te drukken en dit historische complex op uw eigen tempo te bezoeken.</p>\n<p>U kunt uw avontuur hervatten wanneer u dat geschikt acht.</p>`,
  "30": "<p>Wanneer u besluit verder te gaan <i>op zoek naar de schat</i>, ga dan langs de linkerkant van het oude rivierbedding naar nummer <mark>6</mark> op uw kaart.</p>",
  "30-B": "<p>Wanneer u besluit verder te gaan <i>op zoek naar de schat</i>, ga dan langs de linkerkant van het oude rivierbedding naar nummer <mark>11</mark> op uw kaart.</p>",
  "31": "<p>Correspondeert met nummer <mark>20</mark> op uw kaart.</p>",
  "32": "<p>Op uw kaart correspondeert dit met nummer <mark>21</mark>.</p>",
  "32-B": "<p>Op uw kaart correspondeert dit met nummer <mark>21</mark>.</p>",
  "32-C": "<p>Volg uw schatkaart en onderweg, rechts van u, verschijnt de eerste openbare drinkwaterfontein van de stad.</p>\n<p>Bijgenaamd <strong>Fuente del Negrito</strong>, correspondeert dit met nummer <mark>21</mark> op uw kaart. Dit is een van uw laatste haltes in dit avontuur.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "33": "<p>Op uw kaart correspondeert dit met nummer <mark>22</mark>.</p>",
  "33-B": "<p>Ga door tot het einde van de straat waar de <strong>Calle Caballeros</strong> kruist, die op uw kaart overeenkomt met nummer <mark>22</mark>.</p>\n<p>Eenmaal daar, sla rechtsaf en u ziet het emblematische gebouw van het <strong>Paleis van de Generalitat</strong>, dat op uw kaart nummer <mark>23</mark> aangeeft.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "33-C": "<p>Op uw kaart staan dit respectievelijk de nummers <mark>22</mark> en <mark>24</mark>.</p>",
  "34": "<p>Op uw kaart correspondeert dit met nummer <mark>23</mark>.</p>",
  "34-B": "<p>Op uw kaart correspondeert dit met nummer <mark>23</mark>.</p>",
  "35": "<p>Op uw kaart correspondeert dit met nummer <mark>24</mark>.</p>",
  "35-B": "<p>Neem de trappen of de helling die naar dit uitkijkpunt leiden; op uw kaart correspondeert dit met nummer <mark>24</mark>.</p>",
  "36": "<p>Op uw kaart staat dit aangegeven met nummer <mark>25</mark>.</p>",
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
