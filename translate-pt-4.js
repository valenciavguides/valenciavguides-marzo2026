import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "96": "<p>Este espaço corresponde no seu mapa ao número <mark>81</mark>.</p>",
  "97": "<p>No seu mapa corresponde ao número <mark>82</mark>.</p>",
  "98": "<p>No seu mapa corresponde ao número <mark>84</mark>.</p>",
  "99": "<p>Saberia dizer-me que estabelecimento alberga este edifício?</p>",
  "100": "<p>Parabéns, acaba de chegar a metade do percurso, tome um descanso ou continue com a outra metade!</p>",
  "100-B": "<p>Parabéns, acaba de chegar a metade do percurso, tome um descanso ou continue com a outra metade!</p>",
  "101": `<p>A apenas 150 metros, mesmo na praça seguinte, monumentos de épocas diferentes fundem-se no presente fazendo parte das nossas vidas.</p>\n<p>A sua procura do tesouro leva-o a começar pelo edifício monumental da esquerda.</p>\n<p>No seu mapa corresponde ao número <mark>17</mark>.</p>\n<p>Prima a pausa de novo, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "102": "<p>Deixe esta praça à sua direita e siga o seu mapa.</p>",
  "103": `<p>Situe-se com as torres às suas costas e continue pela <strong>Calle de los Serranos</strong>. Uns metros mais adiante, à sua direita, emerge um edifício destinado, desde a sua construção, a salvar vidas.</p>\n<p>No seu mapa corresponde ao número <mark>2</mark>.</p>\n<p>Preste atenção pois o edifício é muito discreto e poderia passar despercebido.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "104": `<p>A sua Aventura continua tranquilamente até ao final da <strong>Calle de los Serranos</strong>.</p>\n<p>No final da rua, à sua mão esquerda, encontra-se o famoso <strong>Palau de la Generalitat</strong>.</p>\n<p>Pause esta audioguia e dirija-se, como indica o seu mapa, ao seu próximo ponto de interesse, uma vez lá retome a sua Aventura. No seu mapa corresponde ao número <mark>3</mark>.</p>`,
  "105": `<p>No final do percurso chegará à <strong>Calle de los Serranos</strong>, local onde começou a sua Aventura. Atravesse a rua e vire à direita. Não pause esta audioguia e dirija-se ao ponto indicado, obrigado.</p>`,
  "106": "<p>Prima a pausa e prima de novo o botão continuar uma vez o entender conveniente.</p>",
  "107": "<p>Prima a pausa, depois resolva o seu desafio e prima de novo o botão continuar.</p>",
  "108": "<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>",
  "108-B": "<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>",
  "109": "<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>",
  "110": "<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>",
  "111": "<p>Utilize o botão de pausa a seu próprio gosto, quando sentir que é o momento, simplesmente continue e resolva os nossos desafios enquanto descobre a cidade.</p>",
  "111-B": "<p>Agora que se encontra um pouco mais perto, pode resolver o seu próximo desafio.</p>",
  "111-C": "<p>Agora que se encontra um pouco mais perto, pode resolver o seu próximo desafio.</p>",
  "111-D": "<p>Utilize o botão de pausa a seu próprio gosto, quando sentir que é o momento, simplesmente continue e resolva os nossos desafios enquanto descobre a cidade.</p>",
  "112": "<p>Continue até à <strong>Puente de la Exposición</strong>, indicado no seu mapa com o número <mark>4</mark>. Obrigado.</p>",
  "113": "<p>Desde o ponto 17, no seu mapa pode vislumbrar um dos pontos mais icónicos de Valencia.</p>",
  "114": "<p>Chegou ao ponto indicado? Reconhece o caminho? Ótimo! Desta vez tome a primeira rua à sua mão esquerda e siga o seu traçado no qual poderá confirmar o traçado árabe de que falávamos antes. É como um labirinto, não é verdade? Continue a caminhar até sair deste traçado irregular.</p>",
  "115": "<p>Chegou ao ponto sugerido? Ótimo! não pause esta audioguia.</p>",
  "115-B": "<p>Chegou ao ponto sugerido? Ótimo! não pause esta audioguia.</p>",
  "116": `<p>Esta aventura leva-o a atravessar a ponte que oferece umas vistas magníficas para a <strong>Ciudad de las Artes y de las Ciencias</strong>.</p>\n<p>Enquanto atravessa a ponte preste especial atenção à sua esquerda onde sobressai o Ágora.</p>\n<p>Número <mark>22</mark> no seu mapa.</p>\n<p>Mesmo atrás, situa-se o conhecido Oceanogràfic.</p>\n<p>Que corresponde ao número <mark>23</mark> no seu mapa.</p>\n<p>Uma vez atravessada a ponte, situe-se, como indica o seu mapa, numa zona segura que oferece umas vistas magníficas desta área. Esta zona segura que sugerimos, está à esquerda, conforme se desce da ponte.</p>\n<p>Prima a pausa, depois visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "117": "<p>O que se pode ver no vão do arco central?</p>",
  "118": "<p>As cadeiras que estão nas ruas ao longo dos percursos de pasacalles são para alugar. Se encontrar livres pode sentar-se nelas. Lembre-se de que é um grande gesto de respeito ceder o assento a pessoas com menor capacidade física do que a sua.</p>",
  "119": "<p>Não pause esta audioguia e dirija-se, como indica o seu mapa, ao seu próximo ponto de interesse.</p>",
  "120": "<p>Não pause esta audioguia e dirija-se, como indica o seu mapa, ao seu próximo ponto de interesse.</p>",
  "121": "<p>Não pause esta audioguia e dirija-se, se faz favor, ao lado oposto do edifício. Obrigado.</p>",
  "122": "<p>Não pause esta audioguia.</p>",
  "123": "<p>Não pause esta audioguia.</p>",
  "124": `<p>Um edifício do séc. XIX de estilo neoclássico, realizado em tijolo.</p>\n<p>Cabe destacar que no séc. XXI a atual <strong>Plaza de Toros</strong> é, também, um espaço multicultural que oferece eventos de todo tipo.</p>`,
  "125": `<p>Siga o mapa entre a Catedral e o <strong>Palacio Arzobispal</strong>.</p>\n<p>Atravesse a praça que tem em frente deixando a Catedral às suas costas.</p>\n<p>Siga o mapa para chegar à Calle San Vicente Mártir, mas preste atenção!</p>\n<p>No final da rua do Santo Padroeiro, o mapa indica que tome o caminho da esquerda.</p>\n<p>Encontrará a pista na <strong>Plaza del Ayuntamiento</strong>.</p>\n<p>No seu mapa corresponde ao número <mark>9</mark>.</p>\n<p>Este é um ponto perfeito para parar a tirar umas fotos magníficas dos tesouros arquitetónicos que a cidade oferece.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "126": "<p>Este é um ponto perfeito para tirar uma fotografia magnífica deste monumento declarado de interesse histórico artístico.</p>",
  "126-B": `<p>${LOGO} proporcionará-lhe informação detalhada sobre esta área na sua Aventura número 1.</p>`,
  "127": "<p>Este é um ponto perfeito para tirar uma fotografia magnífica deste monumento declarado de interesse histórico artístico.</p>",
  "128": `<p>Conhecido popularmente como <strong>Puente Amarillo</strong>, esta é uma plataforma de passagem que liga os dois lados da cidade. Na sua base, ainda são visíveis os chamados "saltos e rápidos". São as enormes pedras triangulares que encaminhavam e abrandavam a água, evitando que batesse demasiado contra o muro.</p>`,
  "129": "<p>Valencia nas Fallas!</p>",
  "129-B": "<p>Valencia nas Fallas!</p>",
  "130": "<p>Faça um uso responsável do mobiliário urbano e respeite os atos públicos, há locais preparados para atravessar os diferentes atos e pasacalles. Respeite sempre os perímetros de segurança que estão marcados.</p>",
  "131": "<p>Para entender esta festividade é necessário ter claros certos conceitos que facilitem a sua compreensão. Assim, distinguem-se:</p>",
  "132": "<p>Tempo de Fallas como festividade de Valencia (de 1 a 19 de março).</p>",
  "133": `<p>Falla como associação de vizinhos sem fins lucrativos que se reúnem durante o ano em locais chamados "Casals". Obtêm os seus rendimentos através da venda de participações em diferentes sorteios, uma quota de sócio, apoios governamentais e os prémios por classificação ao melhor monumento fallero.</p>`,
  "134": `<p>Falla: como monumento fallero que será exposto de 15 a 19 de março, distinguem-se entre grandes e infantis. As fallas classificam-se por secção. A secção especial é a mais importante de todas, uma vez que agrupa as comissões falleras que plantam ou montam os monumentos Falleros de maior orçamento da cidade, e que competem pelo prémio à melhor falla. Também se atribuem outros prémios como o prémio de engenho e graça e iluminação das ruas.</p>`,
  "135": "<p>Se faz favor, situe-se num ponto a partir do qual possa ver as torres, na sua totalidade, desde a sua parte frontal. Obrigado.</p>",
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
