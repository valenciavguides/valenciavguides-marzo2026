import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "53": "<p>Encontra-se na <strong>Plaza del Tossal</strong>? Sim? Ótimo! No seu mapa corresponde ao número <mark>49</mark>.</p>",
  "54": `<p>Se se encontrar em horas de visita, ${LOGO} recomenda-lhe que prima a pausa, entre neste ESPAÇO e desfrute das suas exposições. Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "54-B": `<p>Se se encontrar em horas de visita, ${LOGO} recomenda-lhe que prima a pausa e entre neste espaço para desfrutar das suas exposições. Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "55": `<p>${LOGO} incita-o a pausar esta audioguia e recomenda passear por este jardim ao seu próprio ritmo.</p>`,
  "56": `<p>Se se encontrar em horário de visita, ${LOGO} incita-o a pausar esta audioguia e recomenda passear por este jardim ao seu próprio ritmo.</p>`,
  "57": "<p>Utilize o botão de pausa a seu próprio gosto. Quando sentir que é o momento adequado, simplesmente continue a resolver os nossos desafios enquanto descobre a cidade.</p>",
  "58": "<p>Utilize os botões de pausa e continuar da forma que preferir para parar e retomar a sua aventura <i>à procura do tesouro</i>, onde e quando queira. Pode voltar à sua Aventura quando sentir que é o momento oportuno, simplesmente premindo o botão continuar.</p>",
  "59": "<p>No seu mapa corresponde ao número <mark>43</mark>.</p>",
  "60": `<p>Admirando a porta gótica da Catedral, o seu próximo objetivo ergue-se na parte oposta da praça.</p>\n<p>Vire-se e poderá observar em frente a si um palácio construído em cantaria que se destaca do resto da paisagem urbana.</p>\n<p>Não pause esta audioguia e dirija-se, como indica o seu mapa, ao seu próximo ponto de interesse.</p>\n<p>No seu mapa corresponde ao número <mark>44</mark>.</p>`,
  "61": `<p>${LOGO} recomenda-lhe fazer uma breve pausa e olhar à sua volta.</p>`,
  "62": `<p>${LOGO} recomenda-lhe fazer uma breve pausa e olhar à sua volta.</p>`,
  "63": "<p>No seu mapa corresponde ao número <mark>47</mark>.</p>",
  "64": `<p>Se se encontrar em horas de visita, ${LOGO} aconselha-lhe que prima a pausa e visite este centro cultural ao seu próprio ritmo.</p>`,
  "64-B": `<p>Se se encontrar em horas de visita, ${LOGO} aconselha-lhe que prima a pausa e visite este centro cultural ao seu próprio ritmo.</p>`,
  "65": "<p>No seu mapa corresponde ao número <mark>49</mark>.</p>",
  "66": "<p>No seu mapa corresponde ao número <mark>50</mark>.</p>",
  "67": "<p>No seu mapa corresponde ao número <mark>51</mark>.</p>",
  "68": `<p>Saberia dizer-me o nome da rua?</p>\n<p>Prima a pausa, depois visualize o ponto indicado e resolva o seu desafio, prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "69": "<p>O próximo objetivo da sua Aventura corresponde no seu mapa ao número <mark>53</mark>.</p>",
  "70": `<p>${LOGO} proporcionará-lhe informação detalhada sobre esta festividade no decorrer desta Aventura.</p>`,
  "71": "<p>No seu mapa corresponde ao número <mark>54</mark>.</p>",
  "72": "<p>No seu mapa corresponde ao número <mark>55</mark>.</p>",
  "73": "<p>No seu mapa corresponde ao número <mark>56</mark>.</p>",
  "74": "<p>O seu próximo ponto de interesse nesta Aventura corresponde ao número <mark>57</mark> no seu mapa.</p>",
  "75": `<p>${LOGO} recomenda-lhe continuar a pé a partir deste ponto.</p>\n<p>Observe o seu mapa que o incita a seguir o traçado das muralhas.</p>\n<p>Situe-se com a porta principal do IVAM em frente e vire à sua direita. Uma concentração de três pontos consecutivos, à sua esquerda, aguarda-o a apenas duas ruas de distância.</p>\n<p>No seu mapa correspondem aos números <mark>58</mark>, <mark>59</mark> e <mark>60</mark>.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "76": `<p>Volte ao traçado original das muralhas e dirija-se à sua esquerda. Uns metros mais adiante, erguem-se as famosas <strong>Torres de Quart</strong>, indicadas no seu mapa com o número <mark>61</mark>.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "76-B": `<p>A sua Aventura leva-o de volta às famosas <strong>Torres de Quart</strong>. No seu mapa correspondem ao número <mark>61</mark>.</p>\n<p>Para isso, tome o mesmo caminho concebido para veículos de mobilidade pessoal e regresse seguindo o traçado da muralha até à porta de acesso à antiga cidade.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "77": `<p>Com as <strong>Torres de Quart</strong> às suas costas, atravesse a avenida e tome a via adaptada que sai à sua esquerda, até ao próximo ponto de interesse nesta Aventura. Passadas várias ruas, verá à sua mão esquerda uma zona ajardinada, que no seu mapa está indicada com o número <mark>62</mark>.</p>\n<p>Lembre-se de respeitar a regulamentação de trânsito! Este carril adaptado para veículos de mobilidade pessoal percorre o traçado da antiga muralha de Valencia.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "78": "<p>No seu mapa corresponde ao número <mark>63</mark>.</p>",
  "79": "<p>No seu mapa corresponde ao número <mark>69</mark>.</p>",
  "80": "<p>Dirija-se ao seu próximo ponto de interesse, no seu mapa corresponde ao número <mark>70</mark>. Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>",
  "81": `<p>Com a entrada de Valencia em frente, dirija-se à sua mão esquerda até à próxima ponte; a <strong>Puente de Madera</strong>.</p>\n<p>Veja o seu mapa para mais informações.</p>\n<p>Quando as indicações de trânsito o permitirem, atravesse de novo a estrada.</p>\n<p>Esta aventura conduzirá-o por uma rua encantadora cheia de vida: na qual, gelados, doces, horchatas, água de Valencia e uma ampla oferta gastronómica o tentarão durante o percurso.</p>`,
  "81-B": "<p>No seu mapa corresponde ao número <mark>71</mark>.</p>",
  "82": "<p>Centre a sua atenção no conjunto do <strong>Bioparc</strong>. Número <mark>73</mark> no seu mapa.</p>",
  "83": `<p>Da sua perspetiva, com a <strong>Plaza de la Virgen</strong> à sua frente, tome o caminho à mão esquerda e numa rua estreita à sua direita, encontrará um caminho seguro que lhe dá acesso à zona seguinte.</p>\n<p>Esta via conduz até à Plaza de la Almoina indicada no seu mapa com o número <mark>4</mark>. A rua que mencionamos fica mesmo entre a <strong>Basílica de la Mare de Deu</strong> e \"um Museu\" no seu mapa são os números <mark>6</mark> e <mark>7</mark> respetivamente.</p>\n<p>Situando-se no centro da praça pode observar como convivem três épocas gloriosas da cidade de Valencia.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "84": "<p>Acima dos vãos laterais encontramos quatro relevos, obra dedicada \"Ao Valor\", \"À Abnegação\" e os que podemos ver agora mesmo, desde o parque onde nos encontramos, \"À Paz\" e \"À Glória\".</p>",
  "85": `<p>Seguindo o mapa, em direção à face este da Catedral, dirija-se ao palácio de estilo eclético realizado em tijolo vermelho que fica ao fundo da praça.</p>\n<p>O seu objetivo é o <strong>Palacio Arzobispal</strong> ou número <mark>8</mark> no seu mapa.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "86": `<p>Dirija-se para a porta de estilo Românico da Catedral e observe para cima à esquerda.</p>\n<p>Uma torre octogonal de finais do séc. XV sobressai atrás da catedral.</p>`,
  "87": `<p>No trecho seguinte de obstáculos urbanos é preciso ter cuidado!</p>\n<p>Respeite a regulamentação de trânsito, aguarde que os semáforos fiquem verdes para atravessar as ruas.</p>`,
  "88": `<p>Admirando estes edifícios, a rua que fica à sua esquerda traça hoje em dia o local que ocupava a muralha da Valencia do séc. XIX.</p>\n<p>A Calle Colón é uma das ruas comerciais por excelência, nesta via encontram-se numerosos negócios que oferecem todo tipo de serviços e animam a vida dos seus transeuntes com montras e esplanadas.</p>\n<p>${LOGO} proporcionará-lhe informação detalhada sobre esta área na sua Aventura número 5.</p>`,
  "89": `<p>Para continuar com esta caça ao tesouro, atravesse de novo a Calle Colón.</p>\n<p>Seguindo o itinerário que o mapa indica, uma via pedonal cheia de animação levá-lo-á diretamente ao próximo ponto de interesse nesta aventura.</p>`,
  "90": "<p>No seu mapa corresponde ao número <mark>74</mark>.</p>",
  "91": "<p>No seu mapa corresponde ao número <mark>75</mark>.</p>",
  "92": "<p>No seu mapa fica indicado com o número <mark>76</mark>.</p>",
  "93": "<p>No seu mapa fica indicado com o número <mark>77</mark>.</p>",
  "94": "<p>No seu mapa corresponde ao número <mark>78</mark>.</p>",
  "95": `<p>No seu mapa corresponde ao número <mark>80</mark>. Prima a pausa e aproxime-se ao <strong>Palacio de Justicia</strong> para contemplá-lo na sua totalidade.</p>`,
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
