import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "176": "<p>Uma Mascletà costuma ter pelo menos estas partes:</p>",
  "177": "<p>Início: conjunto de efeitos tanto sonoros como visuais com que começa o espetáculo.</p>",
  "178": "<p>O corpo: é a parte central da Mascletà, deve ir crescendo em intensidade e volume de som.</p>",
  "179": "<p>Parte aérea: Descarga de trovões aéreos de maior intensidade, acompanhado de cores.</p>",
  "180": "<p>Terratrèmol (terramoto): parte em que os Masclets de maior potência explodem a grande velocidade.</p>",
  "181": `<p>As Fallas, festas do fogo por excelência, carregadas de cor e detalhes espetaculares mantêm-se barrocas há séculos.</p>\n<p>Após investigar mais a fundo como controlar a química dos componentes explosivos, Valencia continuou a experimentar uma melhoria contínua até evoluir na Mascletà atual.</p>\n<p>Por motivos de segurança, atualmente, o limite de pólvora está estabelecido em 120 quilogramas por Mascletà.</p>\n<p>Os valencianos distinguem a harmonia musical e criticam cada Mascletà aplaudindo ou vaiando o artista.</p>`,
  "182": "<p>É certo que os valencianos são originais e este é um trabalho que leva um ano inteiro de realização.</p>",
  "183": "<p>Como nasce o monumento no nosso século?</p>",
  "184": `<p>Cada ano, em cada casal fallero concebe-se uma ideia inicial de como será o seu monumento fallero. A seguir, resume-se a ideia num esboço ou desenho que deve ser aprovado para que o artista realize uma miniatura em 3D em argila.</p>\n<p>A partir desse momento, a falla começa a desenvolver-se como algo vivo que exige cuidado e total dedicação. Na oficina, a realização do monumento fallero baseado na maqueta inicial é seccionada como se fosse um puzzle; inicia-se a modelagem dos "Ninots" que são as figuras soltas que complementam o conjunto e que terão de ser montadas com total precisão no seu lugar correspondente no momento da "Plantà".</p>\n<p>Um júri selecionará, de entre todos os participantes, as melhores Fallas e estas serão premiadas.</p>\n<p>Cada ano uma figura e somente uma se salvará do fogo, a esta conhece-se como o "Ninot indultat" (o modelo indultado).</p>\n<p>No museu fallero pode ver os Ninots que foram salvos, assim como a evolução da nossa festividade.</p>`,
  "185": `<p>As Fallas do séc. XXI reproduzem cenas de factos sociais censuráveis, ironia, crítica social e sátira nas quais se caricatura a vida social e política sempre com sentido de humor.</p>\n<p>A popularidade destas festas é muito alargada, chegando a celebrar-se hoje em dia em mais de 88 povos da Comunitat Valenciana.</p>`,
  "186": "<p>É bom momento para continuar a sua Aventura? Lembre-se de que o botão de pausa pode usá-lo a seu próprio gosto e premê-lo quando o entender conveniente. Depois, simplesmente prima início e continue a resolver os nossos desafios enquanto descobre a cidade.</p>",
  "187": "<p>Situe-se com a fonte às suas costas e a praça em frente para continuar <i>à procura do tesouro</i>.</p>",
  "188": `<p>Deixando o <strong>Edificio del Ayuntamiento</strong> às suas costas, do outro lado da praça, emerge um edifício que se destaca pela sua grande torre.</p>\n<p>Aproxime-se, se faz favor, ao edifício que corresponde no seu mapa ao número <mark>13</mark>.</p>`,
  "189": `<p>Observe o seu mapa do tesouro. Tal como indica, a sua Aventura continua na outra praça histórica que mencionámos anteriormente.</p>\n<p>Para chegar até lá, situe-se com o <strong>Edificio del Ayuntamiento</strong> à sua esquerda e volte até à famosa Calle San Vicente Mártir. A apenas 150 metros, mesmo na praça seguinte, monumentos de épocas diferentes fundem-se no presente fazendo parte das nossas vidas.</p>\n<p>A sua procura do tesouro leva-o a começar pelo edifício monumental da esquerda.</p>\n<p>O <strong>Mercado Central</strong> corresponde ao número <mark>15</mark> no seu mapa.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "190": `<p>Se se encontrar em horas de visita, ${LOGO} incita-o a pausar e entrar a descobrir a gastronomia local que este maravilhoso espaço oferece. Este é um lugar perfeito para tirar umas fotos da sua Aventura retomando-a desde este mesmo ponto, uma vez o entender conveniente.</p>`,
  "191": "<p>A palavra falla deriva do valenciano medieval, pois era a palavra que denominava as tochas que se colocavam no alto das torres de vigia, nos caminhos ou para iluminar uma festa. Mais tarde a palavra Falla foi empregada para se referir às fogueiras e à iluminação que se acendiam na véspera das festas correspondentes.</p>",
  "192": `<p>A estas alturas é possível que já tenha ouvido alguma das mais de 300 bandas de música que as comissões falleras contratam para as acompanhar em qualquer dos atos falleros.</p>\n<p>A cultura musical está muito enraizada pois é um elemento muito importante para as festas populares. Nas Fallas não só se ouvem bandas, também há grupos formados por dulzainas e tamboriles, instrumentos de sopro e percussão que se destacam acima das demais bandas.</p>`,
  "193": "<p>As dulzainas e tamboriles, ou como nos agrada chamá-los em valenciano Dolçaina i Tabalet, são instrumentos tradicionais que fazem parte da banda sonora das nossas audioguias.</p>",
  "194": `<p>Ao cair da noite também é importante a música, pois celebram-se verbenas com música ao vivo e as típicas "discomóviles", que se podem ouvir em distintos bairros da cidade, e estão abertas a todos os que queiram desfrutá-las.</p>`,
  "195": "<p>E se pensa que é hora de ir dormir, faça-o depois de desfrutar uns bunyols de carabassa com chocolate enquanto observa a curiosa maneira que os falleros têm de acordar o resto dos vizinhos, atirando ao chão uns petardos que explodem ao bater no chão.</p>",
  "196": `<p>Há quem continue a acreditar que os verdadeiros inícios desta celebração (as Fallas) estão nos antigos rituais quando se celebrava o equinócio da primavera, momento do ano em que o dia dura as mesmas horas que a noite.</p>\n<p>O 21 de março é uma data assinalada por diversas culturas milenares como a de um grande poder energético. Data que marca o regresso de Perséfone do Hades, ou seja, do florescimento e da vida.</p>\n<p>Como tantas outras festas pagãs, a Igreja Católica sentindo-se incapaz de erradicá-la, converteu-a ao cristianismo celebrando o dia de São José. Mesmo assim, durante o séc. XIX houve ocasiões em que as Fallas foram proibidas pelo seu carácter satírico dirigido às autoridades da época.</p>`,
  "197": "<p>Situe-se com a porta de acesso à <strong>Lonja</strong> em frente a si.</p>",
  "198": "<p>Deixando esta praça à sua direita, o mapa do Tesouro indica-lhe que continue pela rua que tem à sua frente. Não pause esta audioguia e observe à sua direita enquanto percorre a rua.</p>",
  "199": `<p>Siga o seu mapa do tesouro, durante o trajeto, à mão direita, emerge a primeira fonte pública de água potável que existiu na cidade.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "200": `<p>Olá! Bem-vindos! Desde ${LOGO}, damos-lhe as boas-vindas. Em primeiro lugar, queremos agradecer-lhe por escolher esta aventura, na qual se embarcará através do tempo, desde a época romana até à Valencia do século XXI, uma cidade moderna, cheia de luz e cor. <i>à procura do tesouro</i> é uma atividade ao ar livre, autoguiada, interativa e didática, ideal para desfrutar de forma individual ou em equipa. Também o encorajamos a descobrir a cultura e gastronomia valenciana ao seu próprio ritmo, simplesmente premindo o botão de pausa.</p>`,
  "201": `<p><i>À procura do tesouro</i>, graças aos seus conteúdos acessíveis em múltiplas línguas, é, além disso, uma excelente ferramenta para praticar um idioma que esteja a aprender, ou mesmo para mergulhar num novo.</p>`,
  "202": `<p>Sob o nosso lema "A escolha é e será sempre sua", oferecemos a possibilidade de avançar ao ritmo que prefira, fazer pausas quando precisar ou mesmo transformar a experiência numa competição amigável para ver quem completa a aventura primeiro. Uma vez que decida que é o momento apropriado, prima o botão de Início e continue a completar os nossos desafios enquanto continua a descobrir a cidade. Cada pista levá-lo-á a um novo destino com novas incógnitas que revelarão magníficos tesouros históricos e arquitetónicos de Valencia.</p>`,
  "203": `<p>Para enriquecer ainda mais a sua experiência, ${LOGO} incita-o a entrar nos monumentos visitáveis como parte da experiência desta Aventura, tais como museus, mercados e muitos outros locais interessantes, alguns gratuitos e outros com um preço simbólico, embora as entradas para estes últimos não estejam incluídas na aquisição desta aventura.</p>`,
  "204": "<p>Se lhe parecer indicado, teremos muito prazer em começar esta aventura com uma breve introdução à história, localização e gastronomia valenciana. Isto permitir-nos-á obter uma visão geral do percurso que nos espera.</p>",
  "205": "<p>Lembre-se de que o limite desta aventura é de 60 horas desde o seu início.</p>",
  "206": "<p>Lembre-se de que o limite desta aventura é de 150 horas desde o seu início.</p>",
  "207": "<p>Esta Aventura que vai experienciar começou há muito, muito tempo. Séculos antes da chegada dos romanos, o local onde agora se encontra Valencia foi ocupado pelos íberos. Falamos do século seis antes de Cristo.</p>",
  "208": "<p>Isso foi há muito tempo se pensar nisso!</p>",
  "209": `<p>Vários séculos depois, desde o ano 138 antes de Cristo, e ao longo da sua história foi intensamente romanizada, recebendo o nome de "Valentia".</p>\n<p>No entanto, a posterior influência muçulmana foi ainda maior, concretamente, desde o ano 711 ao 1238 depois de Cristo. O que perfaz um total de cerca de 500 anos.</p>`,
  "210": `<p>Tal foi a influência que a população era fundamentalmente muçulmana. Valencia, durante este tempo, recebeu o nome de "Balansiya".</p>`,
  "211": `<p>Só em 1238 o Rei Jaime Primeiro de Aragão reconquistou Valencia, cristianizando a cidade e convertendo-a num reino independente do reino de Aragão.</p>\n<p>Ao Reino de Valencia foram entregues "Os Foros" dotando o reino de uma identidade política e jurídica própria.</p>`,
  "212": `<p>O fim da autonomia da região chegou com Filipe Quinto no séc. XVIII.</p>\n<p>Na Guerra de Sucessão o povo valenciano apoiou o seu inimigo, o arquiduque Carlos.</p>\n<p>Filipe Quinto, após ganhar a guerra, aboliu os Foros e uniu Valencia ao governo nacional.</p>\n<p>Em 1982, Valencia foi nomeada Capital da Comunitat Valenciana.</p>`,
  "213": "<p>Valencia, a capital do Turia, é atualmente a terceira cidade mais populosa de Espanha. Está situada a este da Península Ibérica, à margem do Rio Turia e banhada pelo Mar Mediterrâneo, o qual dota a região de um clima temperado com invernos suaves e cerca de 340 dias de sol por ano.</p>",
  "214": "<p>O que há nas redondezas da cidade?</p>",
  "215": `<p>De Valencia partem uma grande variedade de trilhos preparados para os amantes do ciclismo e da natureza. A uns dez quilómetros a sul da cidade encontra-se o parque natural da <strong>Albufera</strong> de Valencia.</p>\n<p>A <strong>Albufera</strong> é uma das zonas húmidas mais grandes de Espanha com uma superfície de 2100 hectares, às quais se devem acrescentar 14.000 hectares de marisma dedicadas ao cultivo de arroz, que é o principal cultivo da cidade, junto com a chufa, a laranja, a nêspera e o caqui.</p>`,
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
