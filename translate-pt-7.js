import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "219": `<p>Como pode supor, a gastronomia valenciana enquadra-se na dieta mediterrânica.</p>\n<p>No entanto, o que caracteriza a cozinha valenciana é o uso do arroz e o seu prato estrela mundialmente conhecido, a Paella.</p>`,
  "220": "<p>Também são excecionais o seu guisado de enguia, o all-i-pebre e o riquíssimo ajoaceite pronunciado all-i-oli.</p>",
  "221": `<p>Entre a confeitaria local destaca o turrón, doce natalício por excelência, o arnadí de abóbora e a famosa Orxata de Chufa que granizada ou líquida e acompanhada dos seus inseparáveis "Fartons", farão as delícias das tardes de verão.</p>`,
  "222": `<p>Agora que já conhece um pouco sobre a história e a gastronomia da nossa terra, é momento de começar a sua aventura. Desfrute-a! A sua aventura começa na <strong>Calle de los Serranos</strong>. Lembre-se de que, para avançar no percurso, deverá pausar em cada ponto de interesse, observar o local indicado ou completar o seu desafio, e depois continuar para o próximo destino sugerido e assim consecutivamente. Tudo pronto para começar? Lá vamos, boa sorte! Desde a <strong>Calle de los Serranos</strong>, dirija a sua atenção para o final da via e visualize as torres que no seu mapa ficam indicadas com o número <mark>1</mark>.</p>`,
  "223": `<p>Já se encontra na <strong>Calle de los Serranos</strong> a visualizar as torres? Perfeito, comecemos! Imponentes como elas só, estas torres de finais do séc. XIV são de estilo gótico Valenciano.</p>\n<p>Este monumento de arquitetura militar realizado em blocos de cantaria foi uma das doze portas que guardavam a antiga muralha cristã da cidade de Valencia. Hoje em dia só restam 2.</p>\n<p>Embora o seu uso principal fosse militar e defensivo, geralmente utilizavam-se também para cerimónias e entradas oficiais de reis e embaixadores.</p>\n<p>A estas torres, hoje em dia visitáveis, consideravam-nas (e ainda as consideram) a entrada principal da cidade.</p>`,
  "224": `<p>Pela importância das suas coleções é uma clara referência de antigos mestres valencianos.</p>\n<p>Em 1683, o arquiteto Juan Bautista Pérez começou uma construção que demoraria 60 anos a ser finalizada.</p>\n<p>O seu uso original foi colégio de clérigos menores e residência para missionários.</p>\n<p>Embora ao longo da sua trajetória o edifício tenha tido uma história muito variada, sofrendo várias restaurações, modificações e usos: em 1819 foi uma academia militar, em 1826 a Casa da Beneficência, em 1835 o edifício foi usado como armazém de efeitos militares e em 1843 foi instalado um hospital militar.</p>\n<p>Desde 2017, cumprindo a função de <strong>Museo de Bellas Artes</strong>, começou a ser também referência da direção que devem tomar os caçadores do tesouro desta aventura.</p>`,
  "225": "<p>Continue até à próxima ponte, a <strong>Puente de las Flores</strong>.</p>",
  "226": `<p>Como comentávamos na introdução: <i>à procura do tesouro</i> é uma série de Aventuras audioguiadas com percursos e distâncias diferentes que pode fazer ao seu próprio ritmo.</p>\n<p>${LOGO} também lhe propõe desafios para resolver, nos quais o incitaremos a reparar em certos detalhes dos monumentos que poderiam passar despercebidos.</p>\n<p>Aqui vai o primeiro dos seus desafios, este é bastante fácil.</p>`,
  "227": `<p>Acima dos vãos laterais encontramos dois relevos, obra dedicada "Ao Valor" e "À Abnegação".</p>`,
  "228": `<p>Saberia dizer-me como se chamam estas Torres?</p>\n<p>Prima a pausa, depois resolva o seu desafio e prima de novo o botão continuar.</p>`,
  "229": "<p>Adivinhou? Bravo, acabou de adivinhar o seu primeiro desafio, vamos ao seguinte!</p>",
  "230": "<p>Dirija-se ao centro da ponte e observe à esquerda e à direita para entender um pouco a história da rota que vamos explorar.</p>",
  "231": `<p>É certo que antigamente as fontes de água potável da cidade, assim como a origem das acequias para os campos de regadio tinham a sua base no <strong>Rio Turia</strong>. Mas após as catastróficas inundações que ocorreram a 14 de outubro de 1957 e o posterior desvio do rio para uma zona mais segura da cidade, juntamente com a paixão constante dos valencianos, deram lugar ao lazer, à cultura e ao desporto neste espaço de 9 quilómetros de comprimento e 200 metros de largura.</p>`,
  "232": `<p><i>À procura do tesouro</i> percorreremos um jardim de inspiração árabe entre Pinheiros, Olmos, Palmeiras, Ciprestes, Amoreiras, Salgueiros e Laranjeiras.</p>\n<p>Um majestoso espaço verde que, sendo sofisticado, oferece a imagem de um terreno mais rústico e natural com um toque atual.</p>`,
  "232-B": "<p>Um majestoso espaço verde que, sendo sofisticado, oferece a imagem de um terreno mais rústico e natural com um toque atual.</p>",
  "233": "<p>No cimo ondeia a bandeira de Valencia: as suas cores compõem-se de vermelho, amarelo e... Violeta, Verde ou Azul?</p>",
  "234": "<p>Num dos lados da ponte destaca um edifício com uma bela cúpula azul ladeado por duas robustas torres. Pode vê-lo?</p>",
  "235": `<p>Desde 1946, este edifício acolhe o <strong>Museo de Bellas Artes</strong>, um dos primeiros de Espanha; acumulando ao longo da sua história uma grande riqueza artística nas suas pinturas provenientes de antigas igrejas e conventos.</p>`,
  "236": `<p>${LOGO} sugere-lhe que siga o mapa para não se desviar do rumo e desfrutar da viagem na sua plenitude.</p>`,
  "236-A": `<p>${LOGO} sugere-lhe que siga o mapa para não se desviar do rumo e desfrutar da viagem na sua plenitude.</p>\n<p>O seu mapa do tesouro indica-lhe que desça ao leito do rio.</p>\n<p>Para isso, volte em direção às torres e siga a ciclovia à sua esquerda até ao ponto de descida.</p>`,
  "236-B": "<p>Continue até à <strong>Puente de la Exposición</strong>, indicado no seu mapa com o número <mark>4</mark>. Obrigado.</p>",
  "236-C": `<p>O seu mapa do tesouro indica-lhe que termine de atravessar a ponte e desça ao leito do rio.</p>\n<p>Para isso siga o mapa até ao ponto de descida. Este ficará à sua mão esquerda, e está indicado no seu mapa com o número <mark>3</mark>.</p>\n<p>Uma vez em baixo, dirija-se ao centro do leito deste antigo rio e observe à sua volta; poderá ver umas ruínas que se destacam entre a ornamentação botânica do <strong>Jardín del Turia</strong>. Entre ciprestes e oliveiras podem contemplar-se restos do Palácio do Real. Pode vê-las? Sim? Perfeito, porque a próxima história esperamos que o surpreenda.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "237": `<p>A <strong>Puente de la Exposición</strong>: comummente chamada "Ponte da Peineta", lembra um objeto em forma de pente convexo que se usa para adornar e prender o penteado das falleras, as rainhas das nossas festas populares.</p>`,
  "238": `<p>O penteado tradicional de fallera é, sem dúvida, o mais conhecido dos penteados de Espanha.</p>\n<p>O coque de fallera remonta ao séc. XVIII, tempo no qual as mulheres recogiam o cabelo em rabo de cavalo e separavam-no em oito mechas que se "trançavam" em forma de oito, à volta de uma ou duas agulhas grossas.</p>\n<p>Para finalizar, duas tranças rodeavam o penteado central.</p>\n<p>O penteado típico de fallera remata-se com um pente traseiro feito à mão em latão prateado ou dourado.</p>\n<p>Para completar o penteado, acrescentavam-se dois rolos à altura das orelhas que se prendem com dois ganchos e duas réplicas do pente principal.</p>`,
  "239": "<p>Saberia dizer-me como se chamam estas festas populares de Valencia? Será La Tomatina, as fogueiras de São João ou talvez as Fallas?</p>",
  "240": `<p>A tradição da pólvora nasce em Valencia como consequência da vitória Borbónica na batalha de Almansa, concretamente a 25 de abril de 1707, quando Valencia foi ocupada pelas tropas de Filipe Quinto.</p>\n<p>Depois, a fábrica de armas foi desmantelada e transferida para Toledo.</p>\n<p>Nela guardavam-se grande quantidade de armas de fogo de calibre médio conhecidas como "Traques" ou Trabucos.</p>\n<p>Para evitar uma revolta, os trabucos mais velhos foram empilhados no pátio da fábrica e queimados.</p>\n<p>Após arder a madeira das coronhas, os canhões foram vendidos como sucata.</p>\n<p>Muitos ferreiros compraram estes restos, mas não os fundiram; antes os conservaram e adotaram o costume de cravar estes tubos no chão, carregá-los de pólvora e depois disparar para celebrar as festas populares nas aldeias e quintas.</p>`,
  "241": `<p>Devido ao aumento de veículos na Valencia do séc. XX, eram necessárias novas pontes que ligassem a cidade.</p>\n<p>A <strong>Puente de las Flores</strong> foi uma excelente proposta que não poderia passar despercebida na Terra das flores, da luz e da cor.</p>`,
  "242": "<p>Centre a sua atenção no curso do rio. Durante esta aventura fará uma breve viagem no tempo, concretamente ao séc. XVI ao passar por baixo da antiga Puente de la Mar.</p>",
  "243": `<p>De novo voltará ao séc. XXI dado que esta aventura o incita a procurar o acesso que o leva ao cimo da <strong>Puente de Aragón</strong>.</p>`,
  "244": `<p>Está no centro do comprimento da ponte?</p>\n<p>De estilo Racionalista, a <strong>Puente de Aragón</strong> recebe o seu nome pela antiga estação ferroviária, hoje desaparecida, que cobria a linha Valencia-Aragão, sendo esta inaugurada em agosto de 1933.</p>`,
  "245": `<p>${LOGO} recomenda-lhe que siga o carril adaptado e procure um local seguro onde poderá parar para completar o próximo desafio.</p>`,
  "245-B": `<p>${LOGO} recomenda-lhe que dê a volta à rotunda até ao parque que se encontra no lado oposto e procure um local seguro onde poderá parar para completar o próximo desafio.</p>`,
  "245-C": `<p>${LOGO} recomenda-lhe que siga o carril adaptado e procure um local seguro onde poderá parar para completar o próximo desafio.</p>`,
  "246": `<p>Entre as suas numerosas decorações destaca uma em particular que pode ver-se desde a parte central da sua cúspide olhando para baixo para o leito do Turia.</p>\n<p>"A natureza" esculpiu o escudo de Valencia. O que se pode ver em cima do escudo? Um Morcego ou Um dragão?</p>`,
  "247": "<p>Desde este ponto, o traçado desta aventura continua por circuito urbano! Siga a sua aventura pelo carril adaptado para veículos de mobilidade pessoal. O mapa indica voltar até à ponte do séc. XVI que deixámos para trás. Recorda como se chama? É a Puente de la Mar.</p>",
  "248": `<p>Vale a pena admirar esta obra de Javier Goerlich, que em 1935 desenhou esta magnífica escadaria que dá acesso à ponte.</p>\n<p>Em 1876 o elétrico da linha que ia para o porto cruzava esta ponte até que em 1900 foi eletrificado e a linha caiu em desuso.</p>\n<p>26 anos depois, em 1926 em Valencia foi construída uma nova ponte que cruzaria o rio aliviando, com isso, o trânsito da Puente de la Mar, passando a ser desde esse momento uma ponte pedonal.</p>\n<p>Para vencer o declive dispuseram-se duas escadarias onduladas, quatro bancos em chanfro e os pináculos que compõem a imagem atual da ponte.</p>`,
  "249": "<p>Saberia adivinhar quantos degraus tem?</p>",
  "250": `<p>Tome o acesso mais próximo de volta ao leito do rio que deverá estar mesmo atrás de si no muro do rio.</p>\n<p>Uma vez em baixo, o seu próximo desafio fica no próximo monumento.</p>`,
  "251": `<p><i>À procura do tesouro</i> adentrará nos domínios da vegetação, da luz, da água e da música.</p>\n<p>Para apreciá-lo bem, situe-se do outro lado da fonte e com o edifício em frente a si.</p>`,
  "252": `<p>Inaugurado em 1987 em estilo funcional-racionalista, o <strong>Palacio de la Música</strong> cumpre a função de auditório de Valencia.</p>\n<p>As suas quatro salas e a abóbada de vidro albergam capacidade para aproximadamente 2.500 assistentes e tem sido elogiado por prestigiosos músicos e cantantes.</p>`,
  "253": "<p>Que tipo de árvores pode tocar agora mesmo? São palmeiras, oliveiras ou talvez amendoeiras? Adivinha!</p>",
  "254": `<p>Continue a sua aventura rodeando a fonte para tomar de novo a parte esquerda do rio e siga esse caminho passando por baixo da <strong>Puente del Ángel</strong>.</p>`,
  "255": "<p>Uma ponte realizada entre 1941 e 1948, com um comprimento de 150 metros e 31 metros e meio de largura.</p>",
  "256": "<p>As pistas conduzem-no a um novo portal do tempo, este abre-se mais adiante, à mão direita e transportar-lhe-á para uma época fantástica de relatos antigos.</p>",
  "257": "<p>Concretamente às viagens de <strong>Gulliver</strong>.</p>",
  "258": `<p>Crianças e adultos desfrutam desta recriação do conto de Jonathan Swift, na qual podem imaginar-se Liliputianos correndo por cima do próprio <strong>Gulliver</strong> e deslizando-se nos seus enormes tobogãs.</p>\n<p>O seu chapéu recria outra das viagens de <strong>Gulliver</strong> quando viajou a Brobdingnag, o País dos Gigantes.</p>\n<p>Dirija-se à sua porta principal para resolver o próximo desafio.</p>`,
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
