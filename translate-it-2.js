import { readFileSync, writeFileSync } from 'fs';
const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-italiano.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";
const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);
let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) {}
const batch = {
  "51": "<p>Si posizioni al centro della piazza che la sua mappa indica con il numero <mark>42</mark>; da lì si può vedere parte della cupola della Basilica, quasi 19 metri di larghezza e pianta ovale.</p>",
  "51-B": "<p>La sua avventura continua in questo stesso punto, che sulla sua mappa corrisponde al numero <mark>42</mark>.</p>",
  "51-C": "<p>Si posizioni al centro della piazza che la sua mappa indica con il numero <mark>4</mark>; da lì si può vedere parte della cupola della Basilica, quasi 19 metri di larghezza e pianta ovale.</p>",
  "51-D": "<p>Sulla sua mappa corrisponde al numero <mark>42</mark>.</p>",
  "52": "<p>Continui a camminare per la strada e, se ancora non si è lasciato tentare, faccia attenzione all'importante edificio che emerge alla sua sinistra, indicato sulla sua mappa con il numero <mark>2</mark>.</p>\n\n<p>Questo edificio prende il nome di <strong>Les Corts Valencianes</strong>.</p>\n\n<p>Un edificio in stile gotico tardivo destinato oggi ad attività governative, che fu in passato residenza dei Borgia durante il loro soggiorno a Valencia.</p>",
  "53": "<p>Si trova nella <strong>Plaza del Tossal</strong>? Sì? Bene! Sulla sua mappa corrisponde al numero <mark>49</mark>.</p>",
  "54": `<p>Se si trova in orario di visita, ${LOGO} le consiglia di premere pausa, entrare in questo spazio e godersi le esposizioni. Può riprendere la sua avventura quando lo riterrà opportuno.</p>`,
  "54-B": `<p>Se si trova in orario di visita, ${LOGO} le consiglia di premere pausa ed entrare in questo spazio per godersi le esposizioni. Può riprendere la sua avventura quando lo riterrà opportuno.</p>`,
  "55": `<p>${LOGO} la invita a mettere in pausa questa audioguida e le consiglia di passeggiare per questo giardino al suo ritmo.</p>`,
  "56": `<p>Se si trova in orario di visita, ${LOGO} la invita a mettere in pausa questa audioguida e le consiglia di passeggiare per questo giardino al suo ritmo.</p>`,
  "57": "<p>Usi il tasto pausa a suo piacimento. Quando si sentirà pronto, continui semplicemente a risolvere le nostre sfide mentre scopre la città.</p>",
  "58": "<p>Usi i tasti pausa e continua nel modo che preferisce per fermare e riprendere la sua avventura <i>alla ricerca del tesoro</i>, dove e quando vuole. Può tornare alla sua Avventura quando se lo sentirà, semplicemente premendo il tasto continua.</p>",
  "59": "<p>Sulla sua mappa corrisponde al numero <mark>43</mark>.</p>",
  "60": "<p>Ammirando il portale gotico della Cattedrale, il suo prossimo obiettivo si erge nella parte opposta della piazza.</p>\n\n<p>Si giri e potrà osservare di fronte a lei un palazzo costruito in pietra da taglio che si distingue dal resto del paesaggio urbano.</p>\n\n<p>Non metta in pausa questa audioguida e si diriga, come indica la sua mappa, al suo prossimo punto di interesse.</p>\n\n<p>Sulla sua mappa corrisponde al numero <mark>44</mark>.</p>",
  "61": `<p>${LOGO} le consiglia di fare una breve pausa e guardare intorno a sé.</p>`,
  "62": `<p>${LOGO} le consiglia di fare una breve pausa e guardare intorno a sé.</p>`,
  "63": "<p>Sulla sua mappa corrisponde al numero <mark>47</mark>.</p>",
  "64": `<p>Se si trova in orario di visita, ${LOGO} le consiglia di premere pausa e visitare questo centro culturale al suo ritmo.</p>`,
  "64-B": `<p>Se si trova in orario di visita, ${LOGO} le consiglia di premere pausa e visitare questo centro culturale al suo ritmo.</p>`,
  "65": "<p>Sulla sua mappa corrisponde al numero <mark>49</mark>.</p>",
  "66": "<p>Sulla sua mappa corrisponde al numero <mark>50</mark>.</p>",
  "67": "<p>Sulla sua mappa corrisponde al numero <mark>51</mark>.</p>",
  "68": "<p>Saprebbe dirmi il nome della strada?</p>\n\n<p>Ricordi di premere pausa, poi visualizzi il punto indicato e risolva la sua sfida, prema di nuovo il tasto continua una volta nel luogo suggerito.</p>",
  "69": "<p>Il prossimo obiettivo della sua Avventura corrisponde sulla sua mappa al numero <mark>53</mark>.</p>",
  "70": `<p>${LOGO} le fornirà informazioni dettagliate su questa festività nel corso di questa Avventura.</p>`,
  "71": "<p>Sulla sua mappa corrisponde al numero <mark>54</mark>.</p>",
  "72": "<p>Sulla sua mappa corrisponde al numero <mark>55</mark>.</p>",
  "73": "<p>Sulla sua mappa corrisponde al numero <mark>56</mark>.</p>",
  "74": "<p>Il suo prossimo punto di interesse in questa Avventura corrisponde al numero <mark>57</mark> sulla sua mappa.</p>",
  "75": `<p>${LOGO} le consiglia di proseguire a piedi da questo punto.</p>\n\n<p>Osservi la sua mappa che la invita a seguire il tracciato delle mura.</p>\n\n<p>Si posizioni con l'ingresso principale dell'IVAM di fronte e giri a destra. A soli due isolati, alla sua sinistra, la attendono tre punti consecutivi.</p>\n\n<p>Sulla sua mappa corrispondono ai numeri <mark>58</mark>, <mark>59</mark> e <mark>60</mark>.</p>\n\n<p>Ricordi di premere pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>`,
  "76": "<p>Torni al tracciato originale delle mura e si diriga a sinistra. Pochi metri più avanti si ergono le famose <strong>Torres de Quart</strong>, indicate sulla sua mappa con il numero <mark>61</mark>.</p>\n\n<p>Ricordi di premere pausa, poi si rechi al punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "76-B": "<p>La sua Avventura la conduce nuovamente alle famose <strong>Torres de Quart</strong>. Sulla sua mappa corrispondono al numero <mark>61</mark>.</p>\n\n<p>Per farlo, imbocchi la stessa corsia per veicoli di mobilità personale e torni seguendo il tracciato delle mura fino alla porta di accesso all'antica città.</p>\n\n<p>Prema pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "77": "<p>Con le <strong>Torres de Quart</strong> alle spalle, attraversi il viale e imbocchi la corsia attrezzata che parte alla sua sinistra, fino al prossimo punto di interesse in questa Avventura. Superati diversi incroci, vedrà alla sua sinistra un'area verde, indicata sulla sua mappa con il numero <mark>62</mark>.</p>\n\n<p>Ricordi di rispettare le norme del codice della strada! Questa corsia per veicoli di mobilità personale percorre il tracciato dell'antica cinta muraria di Valencia.</p>\n\n<p>Prema pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "78": "<p>Sulla sua mappa corrisponde al numero <mark>63</mark>.</p>",
  "79": "<p>Sulla sua mappa corrisponde al numero <mark>69</mark>.</p>",
  "80": "<p>Si diriga al suo prossimo punto di interesse, sulla sua mappa corrisponde al numero <mark>70</mark>. Ricordi di premere pausa, poi si rechi al punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "81": "<p>Con l'ingresso di Valencia di fronte, si diriga a sinistra fino al ponte successivo: il <strong>Puente de Madera</strong>.</p>\n\n<p>Guardi la sua mappa per ulteriori informazioni.</p>\n\n<p>Quando la segnaletica stradale lo consentirà, attraversi di nuovo la carreggiata.</p>\n\n<p>Questa avventura la condurrà per una graziosa strada piena di vita: gelati, dolci, horchatas, agua de Valencia e un'ampia offerta gastronomica la tenteranno lungo il percorso.</p>",
  "81-B": "<p>Sulla sua mappa corrisponde al numero <mark>71</mark>.</p>",
  "82": "<p>Concentri la sua attenzione sul complesso del <strong>Bioparc</strong>. Numero <mark>73</mark> sulla sua mappa.</p>",
  "83": "<p>Dalla sua prospettiva, con la <strong>Plaza de la Virgen</strong> di fronte, imbocchi il percorso alla sua sinistra e in una strada stretta alla sua destra troverà un passaggio sicuro che la conduce alla zona successiva.</p>\n\n<p>Questa via porta alla Plaza de la Almoina indicata sulla sua mappa con il numero <mark>4</mark>. La strada che menzioniamo si trova esattamente tra la <strong>Basilica de la Mare de Déu</strong> e \"un Museo\", che sulla sua mappa corrispondono ai numeri <mark>6</mark> e <mark>7</mark> rispettivamente.</p>\n\n<p>Posizionandosi al centro della piazza può osservare come convivono tre epoche gloriose della città di Valencia.</p>\n\n<p>Ricordi di premere pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito. Grazie.</p>",
  "84": "<p>In alto sulle aperture laterali troviamo quattro bassorilievi, opere dedicate \"Al Valore\", \"All'Abnegazione\" e quelle che possiamo vedere adesso, dal parco in cui ci troviamo, \"La Pace\" e \"La Gloria\".</p>",
  "85": "<p>Seguendo la mappa, verso la facciata est della Cattedrale, si diriga al Palazzo in stile eclettico realizzato in mattoni rossi che si trova in fondo alla piazza.</p>\n\n<p>Il suo obiettivo è il <strong>Palazzo Arcivescovile</strong> o numero <mark>8</mark> sulla sua mappa.</p>\n\n<p>Ricordi di premere pausa, poi si rechi o visualizzi il punto indicato e prema di nuovo il tasto continua una volta nel luogo suggerito.</p>",
  "86": "<p>Si diriga verso il portale in stile Romanico della Cattedrale e osservi verso l'alto a sinistra.</p>\n\n<p>Una torre ottagonale della fine del XV secolo svetta dietro la cattedrale.</p>",
  "87": "<p>Nel prossimo tratto di ostacoli urbani bisogna fare attenzione!</p>\n\n<p>Rispetti le norme del codice della strada, aspetti che i semafori diventino verdi prima di attraversare le strade.</p>",
  "88": `<p>Ammirando questi edifici, la strada che lascia alla sua sinistra traccia oggi il luogo che occupava le mura di Valencia del XIX secolo.</p>\n\n<p>La Calle Colón è una delle strade commerciali per eccellenza; lungo questo viale si trovano numerose attività che offrono ogni tipo di servizio e animano la vita dei passanti con vetrine e terrazze.</p>\n\n<p>${LOGO} le fornirà informazioni dettagliate su quest'area nella sua Avventura numero 5.</p>`,
  "89": "<p>Per continuare con questa caccia al tesoro, attraversi di nuovo la Calle Colón.</p>\n\n<p>Seguendo l'itinerario indicato dalla mappa, un viale pedonale pieno di vita la condurrà direttamente al prossimo punto di interesse in questa avventura.</p>",
  "90": "<p>Sulla sua mappa corrisponde al numero <mark>74</mark>.</p>",
  "91": "<p>Sulla sua mappa corrisponde al numero <mark>75</mark>.</p>",
  "92": "<p>Sulla sua mappa è indicato con il numero <mark>76</mark>.</p>",
  "93": "<p>Sulla sua mappa è indicato con il numero <mark>77</mark>.</p>",
  "94": "<p>Sulla sua mappa corrisponde al numero <mark>78</mark>.</p>",
  "95": "<p>Sulla sua mappa corrisponde al numero <mark>80</mark>. Prema Pausa e si avvicini al <strong>Palazzo di Giustizia</strong> per contemplarlo nella sua totalità.</p>",
  "96": "<p>Questo spazio corrisponde sulla sua mappa al numero <mark>81</mark>.</p>",
  "97": "<p>Sulla sua mappa corrisponde al numero <mark>82</mark>.</p>",
  "98": "<p>Sulla sua mappa corrisponde al numero <mark>84</mark>.</p>",
  "99": "<p>Saprebbe dirmi che negozio ospita detto edificio?</p>",
  "100": "<p>Complimenti, ha appena raggiunto la metà del percorso, si prenda una pausa oppure continui fino alla seconda metà!</p>",
  "100-B": "<p>Complimenti, ha appena raggiunto la metà del percorso, si prenda una pausa oppure continui fino alla seconda metà!</p>",
};
const merged = { ...existing, ...batch };
const lines = esKeys.filter(k => merged[k] !== undefined).map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';
writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
