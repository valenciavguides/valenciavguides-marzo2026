import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-portugues.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "26": `<p>Se se encontrar em horário de visita, ${LOGO} aconselha-lhe que prima a pausa e visite este complexo histórico ao seu próprio ritmo.</p>\n<p>Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "26-B": `<p>Se se encontrar em horário de visita, ${LOGO} aconselha-lhe que prima a pausa e visite este complexo histórico ao seu próprio ritmo.</p>\n<p>Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "27": "<p>No seu mapa corresponde ao número <mark>18</mark>.</p>",
  "27-B": "<p>No seu mapa corresponde ao número <mark>18</mark>.</p>",
  "27-C": "<p>A sua aventura continua com o edifício que no seu mapa corresponde ao número <mark>18</mark>.</p>",
  "27-D": `<p>A sua Aventura continua, como indica o seu mapa, seguindo o traçado das muralhas.</p>\n<p>Uns metros mais adiante aguardam-no 3 pontos consecutivos na sua Aventura.</p>\n<p>No seu mapa correspondem aos números <mark>18</mark>, <mark>19</mark> e <mark>20</mark> consecutivamente.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "28": "<p>No seu mapa corresponde ao número <mark>19</mark>.</p>",
  "28-B": "<p>No seu mapa corresponde ao número <mark>19</mark>.</p>",
  "29": `<p>Se se encontrar em horário de visita, ${LOGO} aconselha-lhe que prima a pausa e visite este complexo histórico ao seu próprio ritmo.</p>\n<p>Pode retomar a sua aventura uma vez o entender conveniente.</p>`,
  "30": "<p>Uma vez que decida continuar <i>à procura do tesouro</i>, dirija-se pelo lado esquerdo do antigo leito do rio até ao número <mark>6</mark> no seu mapa.</p>",
  "30-B": "<p>Uma vez que decida continuar <i>à procura do tesouro</i>, dirija-se pelo lado esquerdo do antigo leito do rio até ao número <mark>11</mark> no seu mapa.</p>",
  "31": "<p>Corresponde ao número <mark>20</mark> no seu mapa.</p>",
  "32": "<p>No seu mapa corresponde ao número <mark>21</mark>.</p>",
  "32-B": "<p>No seu mapa corresponde ao número <mark>21</mark>.</p>",
  "32-C": `<p>Siga o seu mapa do tesouro e durante o trajeto, à mão direita, emerge a primeira fonte pública de água potável que existiu na cidade.</p>\n<p>Apelidada <strong>Fuente del Negrito</strong>, corresponde ao número <mark>21</mark> no seu mapa. Esta é uma das suas últimas paragens nesta aventura.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "33": "<p>No seu mapa corresponde ao número <mark>22</mark>.</p>",
  "33-B": `<p>Continue até ao final da rua onde cruza a <strong>Calle Caballeros</strong> que corresponde no seu mapa ao número <mark>22</mark>.</p>\n<p>Uma vez aí, vire à mão direita e verá o emblemático edifício do <strong>Palau de la Generalitat</strong> que no seu mapa corresponde ao número <mark>23</mark>.</p>\n<p>Prima a pausa, depois vá ao ponto indicado e prima de novo o botão continuar uma vez no local sugerido.</p>`,
  "33-C": "<p>No seu mapa fica indicado com os números <mark>22</mark> e <mark>24</mark> respetivamente.</p>",
  "34": "<p>No seu mapa corresponde ao número <mark>23</mark>.</p>",
  "34-B": "<p>No seu mapa corresponde ao número <mark>23</mark>.</p>",
  "35": "<p>No seu mapa corresponde ao número <mark>24</mark>.</p>",
  "35-B": "<p>Tome as escadas ou a rampa que permitem subir a este miradouro que no seu mapa corresponde ao número <mark>24</mark>.</p>",
  "36": "<p>No seu mapa fica indicado com o número <mark>25</mark>.</p>",
  "37": "<p>No seu mapa corresponde ao número <mark>26</mark>.</p>",
  "38": "<p>Já se encontra no ponto indicado com o número <mark>27</mark> do seu mapa? Ótimo!</p>",
  "39": `<p>No seu mapa corresponde ao número <mark>27</mark>.</p>\n<p>Prima a pausa e aproxime-se ao <strong>Palacio de Justicia</strong> para contemplá-lo na sua totalidade.</p>`,
  "40": "<p>No seu mapa corresponde ao número <mark>28</mark>.</p>",
  "40-B": "<p>Este espaço corresponde no seu mapa ao número <mark>28</mark>.</p>",
  "41": "<p>No seu mapa corresponde ao número <mark>29</mark>.</p>",
  "42": "<p>No seu mapa corresponde ao número <mark>30</mark>.</p>",
  "43": "<p>O <strong>Palacio del Marqués de Dos Aguas</strong> corresponde no seu mapa ao número <mark>31</mark>.</p>",
  "43-B": "<p>No seu mapa corresponde ao número <mark>31</mark>.</p>",
  "44": "<p>No seu mapa corresponde ao número <mark>32</mark>.</p>",
  "44-B": `<p>Dirija-se para a porta, de estilo Românico, da Catedral que no seu mapa corresponde ao número <mark>32</mark>, a caminho observe para cima à esquerda.</p>\n<p>Uma torre octogonal de finais do séc. XV sobressai atrás da catedral.</p>`,
  "45": "<p>A sua aventura continua com o edifício que no seu mapa corresponde ao número <mark>33</mark>.</p>",
  "45-B": `<p>Admirando a porta mais antiga da <strong>Catedral de Valencia</strong>, dirija a sua atenção para a sua face norte.</p>\n<p>Poderá contemplá-la em todo o seu esplendor desde a Plaza de la Almoina que fica à mão direita.</p>\n<p>Dirija-se ao centro da praça. No seu mapa corresponde ao número <mark>33</mark>.</p>`,
  "45-C": "<p>A sua aventura continua neste mesmo ponto, que corresponde no seu mapa ao número <mark>33</mark>.</p>",
  "45-D": "<p>Situe-se no centro da praça que o seu mapa indica com o número <mark>33</mark>, dali pode ver-se parte da cúpula da basílica de quase 19 metros de diâmetro e planta oval.</p>",
  "45-E": "<p>No seu mapa corresponde ao número <mark>33</mark>.</p>",
  "45-F": "<p>No seu mapa corresponde ao número <mark>33</mark>.</p>",
  "46": "<p>No seu mapa corresponde ao número <mark>34</mark>.</p>",
  "46-B": "<p>No seu mapa corresponde ao número <mark>34</mark>.</p>",
  "47": "<p>No seu mapa corresponde ao número <mark>35</mark>.</p>",
  "47-B": "<p>No seu mapa corresponde ao número <mark>35</mark>. Esta será a sua última paragem.</p>",
  "48": "<p>No seu mapa corresponde ao número <mark>39</mark>.</p>",
  "48-B": `<p>Com a Torre de Santa Catalina em frente olhe, se faz favor, à sua direita.</p>\n<p>Centre a sua atenção ao fundo da praça, o seu próximo objetivo é o famoso <strong>Miguelete</strong> que sobressai da Catedral.</p>\n<p>Este esbelto miradouro corresponde no seu mapa ao número <mark>39</mark>. Pode vê-lo?</p>`,
  "49": `<p>Siga o traçado do seu mapa que lhe indica contornar a Catedral com a fachada à sua esquerda.</p>\n<p>Dito de outro modo, com a porta barroca da catedral em frente, vire à sua direita e continue até chegar à porta românica do templo.</p>\n<p>No seu mapa corresponde ao número <mark>40</mark>.</p>\n<p>Prima a pausa, depois vá ou visualize o ponto indicado e prima de novo o botão continuar uma vez no local sugerido. Obrigado.</p>`,
  "49-B": "<p>Centre a sua atenção de novo na <strong>Catedral de Valencia</strong>, número <mark>40</mark> no seu mapa.</p>",
  "50": "<p>No seu mapa corresponde ao número <mark>41</mark>.</p>",
  "51": "<p>Situe-se no centro da praça que o seu mapa indica com o número <mark>42</mark>, dali pode ver-se parte da cúpula da Basílica de quase 19 metros de largura e planta oval.</p>",
  "51-B": "<p>A sua aventura continua neste mesmo ponto, que corresponde no seu mapa ao número <mark>42</mark>.</p>",
  "51-C": "<p>Situe-se no centro da praça que o seu mapa indica com o número <mark>4</mark>, dali pode ver-se parte da cúpula da Basílica de quase 19 metros de largura e planta oval.</p>",
  "51-D": "<p>No seu mapa corresponde ao número <mark>42</mark>.</p>",
  "52": `<p>Continue a andar pela rua e se ainda não cedeu à tentação, repare no importante edifício que emerge à sua mão esquerda e indicado no seu mapa com o número <mark>2</mark>.</p>\n<p>Este edifício recebe o nome de <strong>Les Corts Valencianes</strong>.</p>\n<p>Um edifício de estilo gótico tardio destinado hoje em dia a atividades governamentais que foi outrora residência dos Borgia durante a sua estância em Valencia.</p>`,
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
