import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "12-D": `<p>Tome como referência o <strong>Puente del Real</strong> indicado no seu mapa com o número <mark>8</mark> e continue até à próxima ponte, que corresponde no seu mapa ao número <mark>9</mark>. A <strong>Puente de la Exposición</strong>.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido, obrigado.</p>`,
  "13": "<p>No seu mapa corresponde ao número <mark>9</mark>.</p>",
  "13-B": "<p>Já se encontra no ponto indicado com o número <mark>9</mark> do seu mapa? Ótimo!</p>",
  "13-C": "<p>No seu mapa corresponde ao número <mark>9</mark>.</p>",
  "14": "<p>Dirija-se ao ponto número <mark>10</mark> no seu mapa.</p>",
  "14-B": "<p>No seu mapa corresponde ao número <mark>10</mark>.</p>",
  "14-C": "<p>No seu mapa corresponde ao número <mark>10</mark>.</p>",
  "15": "<p>No seu mapa corresponde ao número <mark>11</mark>.</p>",
  "15-B": `<p>Ao sair deste traçado irregular, centre a sua atenção à sua mão direita. O seu próximo objetivo nesta procura do tesouro é a famosa <strong>Plaza de la Virgen</strong>.</p>\n<p>No seu mapa corresponde ao número <mark>11</mark>.</p>`,
  "15-C": `<p>Com o ayuntamiento em frente, tome o caminho que fica à sua esquerda e siga o mapa que o leva até ao final da avenida, para depois se incorporar à esquerda.</p>\n<p>Do outro lado da avenida emerge a <strong>Estación del Norte</strong>, um edifício monumental de estilo modernista inaugurado em 1917 que no seu mapa corresponde ao número <mark>11</mark>.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "15-D": "<p>No seu mapa corresponde ao número <mark>11</mark>.</p>",
  "16": "<p>Desde o ponto 11 no seu mapa pode vislumbrar um dos pontos mais icónicos de Valencia.</p>",
  "17": `<p>Desde os números <mark>12</mark> ao <mark>19</mark> são os monumentos que compõem a <strong>Ciudad de las Artes y de las Ciencias</strong>, e os números <mark>13</mark> e <mark>15</mark> correspondem às pontes que completam a área.</p>`,
  "17-B": `<p>Desde os números <mark>18</mark> ao <mark>25</mark> são os monumentos que compõem a <strong>Ciudad de las Artes y de las Ciencias</strong>, e os números <mark>19</mark> e <mark>21</mark> correspondem às pontes que completam a área.</p>`,
  "18": "<p>Correspondem aos números <mark>15</mark> e <mark>18</mark> no seu mapa.</p>",
  "18-B": "<p>Correspondem aos números <mark>21</mark> e <mark>24</mark> no seu mapa.</p>",
  "19": "<p>No seu mapa corresponde ao número <mark>12</mark>.</p>",
  "20": "<p>Corresponde ao número <mark>12</mark> no seu mapa.</p>",
  "20-B": `<p>Dirija-se até ao ponto 12. Suba até ao centro da ponte seguindo a ciclovia.</p>\n<p>Prima a pausa quando chegar ao topo da ponte; continue até à metade do seu comprimento e prima de novo o botão continuar.</p>`,
  "20-C": `<p>Imediatamente após a Estação Ferroviária, emerge a <strong>Plaza de Toros</strong>, no seu mapa corresponde ao número <mark>12</mark>.</p>`,
  "21": "<p>Corresponde ao número <mark>14</mark> no seu mapa.</p>",
  "21-B": `<p>No final do passeio, um tesouro arquitetónico aparece à mão direita e no seu mapa corresponde ao número <mark>14</mark>.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "21-C": `<p>Deixando a portada Barroca da Catedral às suas costas, em frente abre-se uma praça que dá passagem para continuar com a sua procura do Tesouro.</p>\n<p>Siga o traçado do seu mapa que o leva a atravessar a praça.</p>\n<p>Atravessada a praça, à sua mão direita, emerge o seu próximo objetivo. Uma esbelta torre barroca vislumbra-se modestamente à direita.</p>\n<p>No seu mapa corresponde ao número <mark>14</mark>. Pode vê-la?</p>`,
  "21-D": `<p>Deixando a portada Barroca da Catedral às suas costas, em frente abre-se uma praça que dá passagem para continuar com a sua procura do Tesouro.</p>\n<p>Siga o traçado do seu mapa que o leva a atravessar a praça.</p>\n<p>Atravessada a praça, à sua mão direita, emerge o seu próximo objetivo. Uma esbelta torre barroca vislumbra-se modestamente à direita.</p>\n<p>No seu mapa corresponde ao número <mark>10</mark>. Pode vê-la?</p>\n<p>Não pause esta audioguia e dirija-se ao ponto indicado, obrigado.</p>`,
  "22": "<p>No seu mapa corresponde ao número <mark>15</mark>.</p>",
  "22-B": "<p>No seu mapa corresponde ao número <mark>15</mark>.</p>",
  "22-C": `<p>Centre a sua atenção no conjunto do <strong>Bioparc</strong>, número <mark>15</mark> no seu mapa.</p>`,
  "22-D": `<p>Como indica o seu mapa, continue até ao final da rua e vire à mão esquerda. O nosso famoso <strong>Mercado Central</strong> emerge à sua direita, no seu mapa corresponde ao número <mark>15</mark>.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "22-E": "<p>Dirija-se ao ponto número <mark>15</mark> no seu mapa.</p>",
  "23": `<p>Se se encontrar em horário de visita, ${LOGO} recomenda-lhe que prima a pausa e visite este monumento ao seu próprio ritmo.</p>\n<p>Lembre-se de que não há pressa, quando sentir que é o momento indicado, simplesmente prima continuar e continue a sua Aventura <i>à procura do tesouro</i> valenciano.</p>`,
  "23-B": `<p>O <strong>Palacio del Marqués de Dos Aguas</strong> corresponde no seu mapa ao número <mark>16</mark>.</p>`,
  "23-C": "<p>Corresponde ao número <mark>16</mark> no seu mapa.</p>",
  "23-D": "<p>No seu mapa corresponde ao número <mark>16</mark>.</p>",
  "24": `<p>Se se encontrar em horário de visita, ${LOGO} recomenda-lhe que prima a pausa e visite este monumento ao seu próprio ritmo.</p>`,
  "24-B": `<p>Utilize o botão de pausa a seu próprio gosto, quando se sentir preparado, simplesmente continue a resolver os nossos desafios enquanto descobre a cidade.</p>\n<p>A sua Aventura continua, como indica o seu mapa, à sua mão esquerda de volta ao traçado das muralhas originais. Concretamente a uma das entradas de Valencia que no seu mapa corresponde ao número <mark>17</mark>.</p>`,
  "24-C": `<p>Deixando a <strong>Lonja</strong> à sua esquerda e o <strong>Mercado Central</strong> às suas costas, dirija-se, como indica o seu mapa, ao próximo ponto de interesse nesta Aventura, o número <mark>17</mark>.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "24-D": "<p>No seu mapa corresponde ao número <mark>17</mark>.</p>",
  "24-E": `<p>Olhando para a fachada de arcos cegos da <strong>Iglesia de Santa Catalina</strong>, a terceira entrada monumental a este templo data de 1785 e fica a dobrar a esquina. Essa é, também, a sua próxima direção nesta Aventura.</p>\n<p>Preste muita atenção! O seu mapa indica que deve rodear este monumento e tomar a primeira rua que se abre à sua direita.</p>\n<p>No final desta curta e estreita rua, à altura do primeiro andar encontra-se o seu próximo ponto de interesse.</p>\n<p>No seu mapa corresponde ao número <mark>17</mark>.</p>\n<p>Prima a pausa, depois visualize o ponto indicado e prima o botão continuar uma vez no local sugerido.</p>`,
  "24-F": "<p>No seu mapa corresponde ao número <mark>17</mark>.</p>",
  "25": `<p>Seguindo o leito do antigo rio, a uns 50 metros encontra-se a esplanada de onde se disparam os castelos de fogo de artifício.</p>\n<p>Se teve a oportunidade de nos visitar durante esta festividade, terá podido comprovar que os valencianos gostam da pólvora.</p>`,
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
