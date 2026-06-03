import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "299": `<p>Siga com cuidado desde este ponto, uma vez que é traçado urbano e deve respeitar a regulamentação de trânsito.</p>\n<p>Veja as indicações que o seu mapa do tesouro oferece e continue pela ciclovia para se adentr no pleno centro histórico à procura de mais pistas.</p>\n<p>No final da avenida, na rotunda, aguarda o seu próximo objetivo.</p>`,
  "300": `<p>A <strong>Puerta de la Mar</strong> foi reconstruída em 1946.</p>\n<p>Esta é uma réplica da antiga porta de entrada à cidade que ocupava este mesmo lugar até 1868.</p>\n<p>O ponto de acesso foi demolido em 1868 juntamente com as muralhas. O monumento que pode ver hoje em dia é uma homenagem aos Caídos durante a Guerra Civil Espanhola entre os anos 1936 a 39.</p>\n<p>O Monumento consta de três vãos; um central com arco de volta inteira e dois laterais com verga reta.</p>\n<p>No seu arco central pode ver-se uma grande cruz de mármore.</p>`,
  "301": `<p>Na parte mais alta do corpo central que forma o conjunto encontramos um grande escudo da cidade de Valencia.</p>\n<p>Completa a decoração um conjunto de elementos de parafernália militar em cada canto.</p>`,
  "302": "<p>Recorda que animal coroa o escudo de Valencia? É uma cabra, um morcego, um dragão ou talvez um leão?</p>",
  "303": `<p>Abra e observe que o seu mapa do tesouro indica que continue pelo carril adaptado até chegar ao próximo ponto de interesse desta Aventura. Lembre-se de respeitar a regulamentação de trânsito!</p>\n<p>A Calle Colón, que se abre à sua esquerda, é uma das ruas comerciais por excelência e oferece todo tipo de possibilidades para os amantes das compras.</p>\n<p>Nesta via que traça hoje em dia o local que ocupava a muralha da Valencia do séc. XV, numerosos negócios oferecem toda classe de serviços e animam a vida dos seus transeuntes com montras e esplanadas.</p>\n<p>Continue, como indica o seu mapa, até ao seu próximo ponto de interesse.</p>\n<p>Durante o seu trajeto, centre a sua atenção no lado esquerdo.</p>`,
  "304": `<p>Desenhada em 1901, a <strong>Casa de los Dragones</strong> está situada numa das ruas do primeiro alargamento de Valencia.</p>\n<p>Chama a atenção a peculiar decoração das suas fachadas: repare na locomotiva, ou no enorme dragão portando um escudo e preste atenção também à ferragem minuciosamente desenhada.</p>`,
  "305": "<p>O que se pode ver na locomotiva? Será uma estrela, um escudo, ou talvez uma data?</p>",
  "306": `<p>Deixando este edifício à sua esquerda, centre a sua atenção na praça seguinte.</p>\n<p>A sua aventura leva-o a um dos pontos modernos mais icónicos de Valencia.</p>`,
  "307": "<p>Este é um ponto perfeito para parar a tirar umas fotos magníficas dos tesouros arquitetónicos que a cidade oferece e desfrutar de um cóctel peculiar como é a Água de Valencia, ou a tradicional Orxata; uma refrescante bebida natural que acalma a sede, acompanhada dos seus inseparáveis bollos esponjosos chamados Fartons.</p>",
  "308": `<p>O <strong>Mercado de Colón</strong> também foi construído num dos quarteirões do primeiro Alargamento.</p>\n<p>Estava destinado a dar serviço a esta parte da cidade, uma vez que o grande <strong>Mercado Central</strong>, que visitará mais adiante nesta Aventura, ficava bastante afastado.</p>\n<p>O <strong>Mercado de Colón</strong> foi construído entre 1914 e 1917.</p>\n<p>Embora a sua inauguração oficial tenha tido lugar na véspera de Natal de 1916.</p>`,
  "309": `<p>Procure a sua fachada mais monumental, distingue-se pelos elementos decorativos tradicionais valencianos, produtos de horta, animais de quinta e produtos do mar.</p>\n<p>Preste especial atenção à cena que ocorre no mosaico, em valenciano conhece-se pelo nome de Trencadís.</p>\n<p>A arquitetura valenciana caracteriza-se por uma série de elementos decorativos como são a cerâmica valenciana, os mosaicos, chamados Trencadís, e os relevos.</p>`,
  "310": "<p>Que elementos se podem ver nesta cena? Um Fallero e uma Fallera?, Há laranjeiras?, Ou uvas?</p>",
  "311": "<p>Por baixo desta cena, outro elemento característico dos mercados decora o arco apontado.</p>",
  "312": "<p>O que pode ser? Talvez pães? Pode ver caranguejos também? E maçãs?</p>",
  "313": "<p>Centre a sua atenção nas colunas, os salientes das vigas, os escudos nas torres... Quantos animais pode enumerar? Entre eles repare que há vacas, porcos...</p>",
  "314": `<p>A sua Aventura continua na outra portada deste monumento. Mesmo no lado oposto do edifício.</p>\n<p>Se se encontrar em horas de visita, ${LOGO} incita-o a pausar e entrar a descobrir a gastronomia local que este maravilhoso espaço oferece.</p>\n<p>Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "315": "<p>A fachada do monumento é formada por um grande arco apontado de 16 metros de altura. O tímpano do arco está coberto por telhas vidradas.</p>",
  "316": "<p>Na cúpula do arco destaca um grande escudo da cidade realizado em pedra. Coroa o escudo de Valencia o mítico morcego. Pode vê-lo?</p>",
  "317": `<p>Observe o seu mapa que o dirige de novo ao traçado das muralhas.</p>\n<p>Deixando a última fachada do mercado à sua mão esquerda, procure o acesso ao seu próximo objetivo que o leva de volta à época medieval.</p>`,
  "318": `<p>Na Valencia do séc. XIV, a cidade diferenciava as suas culturas nos bairros amuralhados com uma legislação específica que limitava os seus direitos e movimentos.</p>\n<p>Se bem que era uma cidade católica, em Valencia também coexistiam muçulmanos e judeus que também aportaram, com as suas culturas, parte das bases da Valencia do séc. XXI.</p>\n<p>Estas "Ruínas" que pode ver agora mesmo são concretamente a porta da judiaria.</p>\n<p>Uma das doze portas que teve a muralha cristã da cidade de Valencia.</p>\n<p>As ruínas da antiga muralha apareceram durante as obras da linha do metro e decidiu-se deixar o património à vista como parte ilustrativa das obras.</p>`,
  "319": "<p>Continue, como indica o seu mapa, pelo carril adaptado até chegar ao seu próximo ponto com desafios a resolver.</p>",
  "320": `<p>A origem deste tipo de espetáculos era para que os nobres pudessem demonstrar o seu valor perante um touro. Um dos animais totémicos da cultura hispânica.</p>\n<p>Antes das atuais corridas de touros, o Torneio fazia-se a cavalo numa praça de construção de madeira que se situava neste mesmo local, mas foi demolida pelos próprios valencianos durante a Guerra da Independência para evitar que os franceses se tornassem fortes nela.</p>`,
  "321": `<p>Perante a grande aceitação do torneio a pé, decidiu-se a construção de uma <strong>Plaza de Toros</strong> de caráter estável.</p>\n<p>A atual <strong>Plaza de Toros</strong> foi iniciada em 1850 e construída por brigadas de reclusos; a inauguração oficial realizou-se em 1861.</p>\n<p>No seu tempo foi a maior de Espanha com uma arena de 52 metros de diâmetro, uma altura de quase 17 metros e com capacidade para uns 17.000 espetadores.</p>\n<p>Em 1995 reduziu-se o número de lugares para umas 12.800 que são os que tem atualmente.</p>`,
  "322": "<p>Quantos andares tem este Monumento declarado Histórico Artístico Nacional em 1983?</p>",
  "323": `<p>Cabe destacar que no séc. XXI a atual <strong>Plaza de Toros</strong> é, também, um espaço multicultural que oferece eventos de todo tipo.</p>\n<p>Como curiosidade diremos que é possível saber se há ou não corrida de touros, e mesmo a categoria da mesma.</p>\n<p>Se as bandeiras ondeiam nos seus mastros, há corrida de touros. Se não há bandeiras a praça está fechada.</p>`,
  "323-B": `<p>Um edifício do séc. XIX de estilo neoclássico, realizado em tijolo.</p>\n\n<p>Cabe destacar que no séc. XXI a atual Plaza de Toros é, também, um espaço multicultural que oferece eventos de todo tipo.</p>`,
  "324": "<p>À direita deste edifício do séc. XIX de estilo neoclássico, realizado em tijolo, emerge o seu próximo objetivo nesta Aventura.</p>",
  "325": "<p>Um edifício monumental de estilo modernista inaugurado em 1917 e declarado Monumento Histórico Artístico em 1961.</p>",
  "326": "<p>Preste atenção à fachada da primeira torre! Que Fruto Cítrico natural de Valencia decora a fachada? São limões, toranjas ou laranjas?</p>",
  "327": `<p>O edifício em si são dois espaços para as vias e um terceiro que forma a fachada principal do edifício.</p>\n<p>Admirando o monumento, podem ver-se produtos agrícolas que decoram as suas fachadas e uma grande águia sobre o globo terrestre, símbolo da velocidade.</p>\n<p>${LOGO} incita-o a pausar e retomar a sua aventura no interior do edifício, no qual descobrirá um luxuoso átrio de madeira nobre.</p>`,
  "328": `<p>Já está dentro? Preste atenção, emoldurados nas pilastras veem-se mosaicos com a frase "Boa Viagem" em diferentes idiomas.</p>`,
  "329": "<p>Consegue encontrar o seu idioma?</p>",
  "330": `<p>No interior do que antigamente era a cafetaria podem contemplar-se mosaicos alegóricos à horta valenciana em detalhes como a <strong>Albufera</strong>, as barracas valencianas, os palmeirais e o famoso <strong>Miguelete</strong>.</p>\n<p>Se se encontrar em horas de visita, ${LOGO} aconselha-lhe que prima a pausa e visite este monumento histórico ao seu próprio ritmo. Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "331": `<p>Saia do edifício se faz favor, e situe-se de costas à estação, depois abra e observe o seu mapa.</p>\n<p>À medida que segue o traçado da rota, pode ver que o leva à <strong>Plaza del Ayuntamiento</strong>.</p>\n<p>Desde o centro da praça podem divisar-se vários pontos de grande interesse. Este é outro dos pontos perfeitos para se deleitar e tirar umas maravilhosas fotografias dos tesouros arquitetónicos que a cidade oferece.</p>\n<p>No seu mapa corresponde ao número <mark>27</mark>.</p>\n<p>Para chegar ao seu objetivo atravesse a Avenida e adentre-se na Valencia histórica, lembre-se de respeitar a regulamentação de trânsito.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão Continuar uma vez no local sugerido.</p>`,
  "332": `<p>Os edifícios que formam o ambiente junto com a atual <strong>Plaza del Ayuntamiento</strong> estão declarados Conjunto Histórico Artístico.</p>\n<p>À sua mão direita na própria praça, destaca um edifício de estilo Neoclássico. Pode vê-lo?</p>`,
  "333": "<p>Bravo, já quase terminou a sua aventura!</p>",
  "334": `<p>O monumento ergue-se sobre a antiga Casa de Ensino, à qual foram sendo acrescentadas distintas dependências entre os anos 1901 e 1904, sofrendo, além disso, importantes modificações no seu exterior.</p>\n<p>Hoje ocupa um quarteirão de 6.173 metros quadrados e tem fachadas a quatro ruas.</p>`,
  "335": `<p>Aproxime-se, se faz favor, à sua fachada principal e situe-se para poder vê-la na sua totalidade.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "336": "<p>Na sua fachada principal destaca um grande balcão de pedra realizado entre 1965 e 1967 que se apoia em quatro colunas.</p>",
  "337": `<p>Por cima deste balcão, sobre a cornija da torre central, destaca o escudo municipal sustido por duas figuras femininas nuas: uma leva uma paleta de pintor na sua mão, alegoria a "As Artes" e a outra um livro, figura alegórica a "As Letras".</p>`,
  "338": "<p>Recorda que animal coroa o escudo municipal? É um dragão, um morcego ou um cavalo? Pode vê-lo?</p>",
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
