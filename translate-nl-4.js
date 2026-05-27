import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-neerlandes.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "67": "<p>Op uw kaart correspondeert dit met nummer <mark>51</mark>.</p>",
  "68": "<p>Weet u mij de naam van de straat te zeggen?</p>\n<p>Druk op pauze, bekijk het aangegeven punt en los uw uitdaging op, druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "69": "<p>Uw volgende doel in dit Avontuur correspondeert op uw kaart met nummer <mark>53</mark>.</p>",
  "70": `<p>${LOGO} zal u gedetailleerde informatie over dit festival geven in de loop van dit Avontuur.</p>`,
  "71": "<p>Op uw kaart correspondeert dit met nummer <mark>54</mark>.</p>",
  "72": "<p>Op uw kaart correspondeert dit met nummer <mark>55</mark>.</p>",
  "73": "<p>Op uw kaart correspondeert dit met nummer <mark>56</mark>.</p>",
  "74": "<p>Uw volgende bezienswaardigheidspunt in dit Avontuur correspondeert op uw kaart met nummer <mark>57</mark>.</p>",
  "75": `<p>${LOGO} beveelt u aan om vanaf dit punt te voet verder te gaan.</p>\n<p>Bekijk uw kaart die u aanspoort het tracé van de muren te volgen.</p>\n<p>Stel u op met de hoofdingang van het IVAM voor u en draai naar uw rechterhand. Slechts twee straten verderop, aan uw linkerhand, wachten drie opeenvolgende punten.</p>\n<p>Op uw kaart corresponderen zij met de nummers <mark>58</mark>, <mark>59</mark> en <mark>60</mark>.</p>\n<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>`,
  "76": "<p>Keer terug naar het originele tracé van de muren en ga naar uw linkerhand. Enkele meters verderop rijzen de beroemde <strong>Torres de Quart</strong> op, aangegeven op uw kaart met nummer <mark>61</mark>.</p>\n<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "76-B": "<p>Uw Avontuur brengt u terug naar de beroemde <strong>Torres de Quart</strong>. Op uw kaart corresponderen zij met nummer <mark>61</mark>.</p>\n<p>Neem daarvoor dezelfde weg voor persoonlijke voertuigen en ga terug langs het tracé van de muur tot aan de toegangspoort van de oude stad.</p>\n<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "77": "<p>Met de <strong>Torres de Quart</strong> achter u, steek de laan over en neem de ingerichte weg die links van u uitkomt, tot aan het volgende bezienswaardigheidspunt in dit Avontuur. Na enkele straten ziet u aan uw linkerhand een begroeide zone, die op uw kaart is aangegeven met nummer <mark>62</mark>.</p>\n<p>Vergeet de verkeersregels niet te respecteren! Dit ingerichte rijstrook voor persoonlijke voertuigen volgt het tracé van de oude muur van Valencia.</p>\n<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "78": "<p>Op uw kaart correspondeert dit met nummer <mark>63</mark>.</p>",
  "79": "<p>Op uw kaart correspondeert dit met nummer <mark>69</mark>.</p>",
  "80": "<p>Ga naar uw volgende bezienswaardigheidspunt, op uw kaart correspondeert dit met nummer <mark>70</mark>. Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "81": "<p>Met de ingang van Valencia voor u, ga naar uw linkerhand tot aan de volgende brug; de <strong>Puente de Madera</strong>.</p>\n<p>Raadpleeg uw kaart voor meer informatie.</p>\n<p>Als de verkeerstekens het toelaten, steek de weg opnieuw over.</p>\n<p>Dit avontuur voert u door een betoverende, levendige straat: ijs, zoetigheid, horchata, agua de Valencia en een breed gastronomisch aanbod zullen u in de verleiding brengen tijdens uw tocht.</p>",
  "81-B": "<p>Op uw kaart correspondeert dit met nummer <mark>71</mark>.</p>",
  "82": "<p>Richt uw aandacht op het geheel van <strong>Bioparc</strong>. Nummer <mark>73</mark> op uw kaart.</p>",
  "83": "<p>Vanaf uw positie, met het <strong>Plaza de la Virgen</strong> voor u, neem de weg links van u en in een smalle straat rechts van u vindt u een veilige doorgang naar de volgende zone.</p>\n<p>Deze weg leidt naar de <strong>Plaza de la Almoina</strong>, aangegeven op uw kaart met nummer <mark>4</mark>. De straat die wij bedoelen bevindt zich precies tussen de <strong>Basílica de la Mare de Déu</strong> en «een Museum»; op uw kaart respectievelijk de nummers <mark>6</mark> en <mark>7</mark>.</p>\n<p>Vanuit het midden van het plein kunt u zien hoe drie glorieuze tijdperken van de stad Valencia samenleven.</p>\n<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "84": "<p>Bovenaan de zijopeningen vinden we vier reliëfs, gewijd aan «Al Valor», «La Abnegación» en de reliëfs die we nu kunnen zien vanuit het park waar we ons bevinden: «La Paz» en «La Gloria».</p>",
  "85": "<p>Volg de kaart richting de oostzijde van de Kathedraal en ga naar het paleis in eclectische stijl, gebouwd in rode baksteen, dat op de achtergrond van het plein staat.</p>\n<p>Uw doel is het <strong>Palacio Arzobispal</strong> of nummer <mark>8</mark> op uw kaart.</p>\n<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "86": "<p>Ga naar de Romaanse ingang van de Kathedraal en kijk omhoog naar links.</p>\n<p>Een achthoekige toren uit het einde van de 15e eeuw steekt uit achter de kathedraal.</p>",
  "87": "<p>In het volgende stuk met stedelijke obstakels is voorzichtigheid geboden!</p>\n<p>Respecteer de verkeersregels en wacht tot de verkeerslichten op groen springen voordat u de straten oversteekt.</p>",
  "88": `<p>Terwijl u deze gebouwen bewondert, volgt de straat aan uw linkerhand tegenwoordig de plaats die de muur van het Valencia van de 19e eeuw innam.</p>\n<p>De <strong>Calle Colón</strong> is bij uitstek een van de winkelstraten van de stad; in deze straat bevinden zich talrijke winkels die allerlei diensten aanbieden en het leven van de voorbijgangers veraangenamen met etalages en terrassen.</p>\n<p>${LOGO} zal u gedetailleerde informatie geven over dit gebied in Avontuur nummer 5.</p>`,
  "89": "<p>Om door te gaan met deze schattenjacht, steek de <strong>Calle Colón</strong> opnieuw over.</p>\n<p>Volgend het tracé van de kaart, zal een voetgangerszone vol vrijetijdsaanbod u rechtstreeks naar het volgende bezienswaardigheidspunt in dit avontuur leiden.</p>",
  "90": "<p>Op uw kaart correspondeert dit met nummer <mark>74</mark>.</p>",
  "91": "<p>Op uw kaart correspondeert dit met nummer <mark>75</mark>.</p>",
  "92": "<p>Op uw kaart staat dit aangegeven met nummer <mark>76</mark>.</p>",
  "93": "<p>Op uw kaart staat dit aangegeven met nummer <mark>77</mark>.</p>",
  "94": "<p>Op uw kaart correspondeert dit met nummer <mark>78</mark>.</p>",
  "95": "<p>Op uw kaart correspondeert dit met nummer <mark>80</mark>. Druk op pauze en ga naar het <strong>Paleis van Justitie</strong> om het in zijn geheel te bewonderen.</p>",
  "96": "<p>Deze ruimte correspondeert op uw kaart met nummer <mark>81</mark>.</p>",
  "97": "<p>Op uw kaart correspondeert dit met nummer <mark>82</mark>.</p>",
  "98": "<p>Op uw kaart correspondeert dit met nummer <mark>84</mark>.</p>",
  "99": "<p>Weet u mij te zeggen welk bedrijf dit gebouw herbergt?</p>",
  "100": "<p>Gefeliciteerd, u heeft zojuist het halverwege-punt bereikt — neem een pauze of ga door naar de tweede helft!</p>",
  "100-B": "<p>Gefeliciteerd, u heeft zojuist het halverwege-punt bereikt — neem een pauze of ga door naar de tweede helft!</p>",
  "101": "<p>Op slechts 150 meter, precies op het volgende plein, komen monumenten uit verschillende tijdperken samen en vormen deel van ons heden en ons leven.</p>\n<p>Uw schattenjacht begint bij het monumentale gebouw aan de linkerhand.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>17</mark>.</p>\n<p>Druk opnieuw op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "102": "<p>Laat dit plein rechts van u en volg uw kaart.</p>",
  "103": "<p>Stel u op met de torens achter u en ga door de <strong>Calle de los Serranos</strong>. Enkele meters verderop, aan uw rechterhand, rijst een gebouw op dat, vanaf zijn bouw, bestemd was om levens te redden.</p>\n<p>Op uw kaart correspondeert dit met nummer <mark>2</mark>.</p>\n<p>Let goed op, want het gebouw is zeer discreet en kan onopgemerkt voorbijgaan.</p>\n<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "104": "<p>Uw Avontuur gaat rustig verder tot het einde van de <strong>Calle de los Serranos</strong>.</p>\n<p>Aan het einde van de straat, aan uw linkerhand, bevindt zich het beroemde <strong>Palacio de la Generalitat</strong>.</p>\n<p>Pauzeer deze audiogids en ga, zoals uw kaart aangeeft, naar uw volgende bezienswaardigheidspunt; eenmaal daar, hervat uw Avontuur. Op uw kaart correspondeert dit met nummer <mark>3</mark>.</p>",
  "105": "<p>Aan het einde van de route bereikt u de <strong>Calle de los Serranos</strong>, waar uw Avontuur begon. Steek de straat over en sla rechtsaf. Zet deze audiogids niet op pauze en ga naar het aangegeven punt, dank u.</p>",
  "106": "<p>Druk op pauze en druk opnieuw op de doorgaan-knop zodra u het geschikt acht.</p>",
  "107": "<p>Druk op pauze, los vervolgens uw uitdaging op en druk opnieuw op de doorgaan-knop.</p>",
  "108": "<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
  "108-B": "<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "109": "<p>Druk op pauze, ga naar het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "110": "<p>Druk op pauze, ga naar of bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent. Dank u.</p>",
  "111": "<p>Gebruik de pauzeknop naar wens; wanneer u voelt dat het juiste moment is gekomen, ga dan gewoon verder en los onze uitdagingen op terwijl u de stad ontdekt.</p>",
  "111-B": "<p>Nu u een beetje dichterbij bent, kunt u uw volgende uitdaging oplossen.</p>",
  "111-C": "<p>Nu u een beetje dichterbij bent, kunt u uw volgende uitdaging oplossen.</p>",
  "111-D": "<p>Gebruik de pauzeknop naar wens; wanneer u voelt dat het juiste moment is gekomen, ga dan gewoon verder en los onze uitdagingen op terwijl u de stad ontdekt.</p>",
  "112": "<p>Ga door tot de <strong>Puente de la Exposición</strong>, aangegeven op uw kaart met nummer <mark>4</mark>. Dank u.</p>",
  "113": "<p>Vanaf punt <mark>17</mark> op uw kaart is een van de meest iconische plekken van Valencia al vaag zichtbaar.</p>",
  "114": "<p>Bent u al op het aangegeven punt? Komt de weg u bekend voor? Uitstekend! Neem dit keer de eerste straat aan uw linkerhand en volg het tracé, waarbij u het Arabische patroon kunt herkennen waarover we het eerder hadden. Inderdaad, het lijkt wel een doolhof, nietwaar? Blijf lopen totdat u uit dit onregelmatige straatpatroon bent.</p>",
  "115": "<p>Bent u al op de voorgestelde locatie? Uitstekend! Zet deze audiogids niet op pauze.</p>",
  "115-B": "<p>Bent u al op de voorgestelde locatie? Uitstekend! Zet deze audiogids niet op pauze.</p>",
  "116": "<p>Dit avontuur brengt u naar de brug die een prachtig uitzicht biedt op de <strong>Ciudad de las Artes y de las Ciencias</strong>.</p>\n<p>Terwijl u de brug oversteekt, let u bijzonder op aan uw linkerhand waar het <strong>Ágora</strong> uitsteekt.</p>\n<p>Nummer <mark>22</mark> op uw kaart.</p>\n<p>Net achter het Ágora bevindt zich het bekende <strong>Oceanogràfic</strong>.</p>\n<p>Dat correspondeert op uw kaart met nummer <mark>23</mark>.</p>\n<p>Eenmaal over de brug, ga, zoals uw kaart aangeeft, naar een veilige zone die een prachtig uitzicht biedt op dit gebied. De veilige zone die wij voorstellen bevindt zich links, terwijl u van de brug afdaalt.</p>\n<p>Druk op pauze, bekijk het aangegeven punt en druk opnieuw op de doorgaan-knop zodra u op de voorgestelde locatie bent.</p>",
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
