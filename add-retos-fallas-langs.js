import { readFileSync, writeFileSync } from 'fs';

const FILE = 'js/retos-aventuras.js';
let content = readFileSync(FILE, 'utf8');

function r(n, id, tipo, pregunta, opciones, correctas, multiple) {
  let obj = `            {\n                reto: ${n},\n                id: "${id}",\n                tipo: "${tipo}",\n                pregunta: ${JSON.stringify(pregunta)},\n`;
  if (opciones !== null) obj += `                opciones: ${JSON.stringify(opciones)},\n                correctas: ${JSON.stringify(correctas)},\n                multiple: ${multiple}\n            }`;
  else obj += `                correctas: ${JSON.stringify(correctas)}\n            }`;
  return obj;
}
function pz(n, id) {
  return `            {\n                reto: ${n},\n                id: "${id}",\n                tipo: "puzzle",\n                src: "puzzle.html?id=${id}"\n            }`;
}

// AventuraFallas Spanish retos:
// R1: "¿Cuántas Aventuras pueden hacerse con Valencia be Guides?" opciones:[4,5,6,7] correctas:["7"]
// R2: "¿Es buen momento para comenzar su aventura?" opciones:[Sí,NO] correctas:["?"]
// R3: "¿Sabía decirme cómo se llaman estas Torres?" opciones:[Quart,Serranos,Miguelete,Santa catalina] correctas:["Torres de Serranos"]
// R4: "En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ?" opciones:[Violeta,Verde,Azul] correctas:["Azul"]
// R5: texto "¿Sabría decirme el nombre de la calle?" correctas:["Calle Muro de Santa Ana"]
// R6: "¿Qué porta San Lorenzo en la mano?" opciones:[Paloma,cuchara,parrilla] correctas:["Una parrilla"]
// R7: "¿Con qué mano sujeta Neptuno la cornucopia?" opciones:[Izquierda,Derecha] correctas:["Derecha"]
// R8: PZ-01
// R9: "¿Sabría determinar qué geometría tiene el Cimborrio de la Catedral de Valencia?" opciones:[Hexagonal,Octogonal,Cuadradrangular] correctas:["Octogonal"]
// R10: texto "¿Cuántas ventanas puede ver?" correctas:["?"]
// R11: PZ-17
// R12: "¿Recuerda qué animal corona el escudo de Valencia?" opciones:[Murciélago,Dragón,León] correctas:["Murciélago"]
// R13: opcion-multiple "Sobre la entrada principal... ¿Qué porta la figura central?" opciones:[Antorcha,Espada,Corona] correctas:[Antorcha,Espada]
// R14: "¿Qué porta la figura en la mano?" opciones:[balanza,libro,pluma] correctas:["Una balanza"]
// R15: "Busque la vidriera con los colores de la Señera valenciana... ¿Sabría determinar qué forma tiene?" opciones:[Cuadrangular,Redonda,Triangular] correctas:["Redonda"]
// R16: opcion-multiple "¿Qué sostiene la virgen en su mano?" opciones:[Rosario,niño,corona] correctas:[Rosario,niño]
// R17: "¿Qué le entrega el ángel al niño?" opciones:[paloma,orbe,Alimentos] correctas:["Un orbe"]
// R18: PZ-04
// R19: "¿Qué sostiene el niño en sus manos?" opciones:[paloma,Concha,Alimentos] correctas:["Una Concha"]
// R20: PZ-05

function buildFallas(lang) {
  const T = {
    de: {
      r1q: "¿Cuántas Aventuras pueden hacerse con Valencia be Guides?", r1o: ["4","5","6","7"], r1c: ["7"],
      r2q: "2. Ist es ein guter Zeitpunkt, um Ihr Abenteuer zu beginnen?", r2o: ["Ja","Nein"], r2c: ["?"],
      r3q: "3. Können Sie mir sagen, wie diese Türme heißen?", r3o: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"], r3c: ["Torres de Serranos"],
      r4q: "Auf dem Gipfel der Türme weht die Flagge Valencias: Ihre Farben bestehen aus Rot, Gelb und… ?", r4o: ["Violett","Grün","Blau"], r4c: ["Blau"],
      r5q: "Können Sie mir den Namen der Straße nennen?", r5c: ["Calle Muro de Santa Ana"],
      r6q: "Was trägt der heilige Laurentius in der Hand?", r6o: ["Eine Taube","Ein Löffel","Ein Rost"], r6c: ["Ein Rost"],
      r7q: "Mit welcher Hand hält Neptun das Füllhorn?", r7o: ["Links","Rechts"], r7c: ["Rechts"],
      r9q: "Können Sie bestimmen, welche Geometrie die Laterne der Kathedrale von Valencia hat?", r9o: ["Sechseckig","Achteckig","Viereckig"], r9c: ["Achteckig"],
      r10q: "Wie viele Fenster können Sie sehen?", r10c: ["?"],
      r12q: "Erinnern Sie sich, welches Tier das Wappen von Valencia krönt?", r12o: ["Fledermaus","Drache","Löwe"], r12c: ["Fledermaus"],
      r13q: "Über dem Haupteingang, in einem Rundbogen, stellen allegorische Figuren die fünf Kontinente dar. Was trägt die mittlere Figur?", r13o: ["Eine Fackel","Ein Schwert","Eine Krone"], r13c: ["Eine Fackel","Ein Schwert"],
      r14q: "Was trägt die Figur in der Hand?", r14o: ["Eine Waage","Ein Buch","Eine Feder"], r14c: ["Eine Waage"],
      r15q: "Suchen Sie das Buntglasfenster mit den Farben der valencianischen Senyera an der Fassade. Können Sie bestimmen, welche Form es hat?", r15o: ["Viereckig","Rund","Dreieckig"], r15c: ["Rund"],
      r16q: "Was hält die Jungfrau in ihrer Hand?", r16o: ["Einen Rosenkranz","Ein Kind","Eine Krone"], r16c: ["Einen Rosenkranz","Ein Kind"],
      r17q: "Was überreicht der Engel dem Kind?", r17o: ["Eine Taube","Eine Kugel","Nahrung"], r17c: ["Eine Kugel"],
      r19q: "Was hält das Kind in seinen Händen?", r19o: ["Eine Taube","Eine Muschel","Nahrung"], r19c: ["Eine Muschel"],
    },
    zh: {
      r1q: "使用Valencia be Guides可以进行多少次冒险？", r1o: ["4","5","6","7"], r1c: ["7"],
      r2q: "2. 现在是开始冒险的好时机吗？", r2o: ["是","否"], r2c: ["?"],
      r3q: "3. 您能告诉我这些塔叫什么名字吗？", r3o: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"], r3c: ["Torres de Serranos"],
      r4q: "塔顶飘扬着巴伦西亚的旗帜：其颜色由红色、黄色和…组成？", r4o: ["紫色","绿色","蓝色"], r4c: ["蓝色"],
      r5q: "您能告诉我这条街道的名字吗？", r5c: ["Calle Muro de Santa Ana"],
      r6q: "圣洛伦佐手里拿着什么？", r6o: ["一只鸽子","一把勺子","一个烤架"], r6c: ["一个烤架"],
      r7q: "海神尼普顿用哪只手握着丰饶角？", r7o: ["左手","右手"], r7c: ["右手"],
      r9q: "您能判断巴伦西亚大教堂穹顶的几何形状吗？", r9o: ["六边形","八边形","四边形"], r9c: ["八边形"],
      r10q: "您能看到几扇窗户？", r10c: ["?"],
      r12q: "您还记得什么动物装饰着巴伦西亚的盾徽吗？", r12o: ["蝙蝠","龙","狮子"], r12c: ["蝙蝠"],
      r13q: "在主入口上方的半圆拱门中，寓言人物代表着五大洲。中央人物拿着什么？", r13o: ["一支火炬","一把剑","一顶王冠"], r13c: ["一支火炬","一把剑"],
      r14q: "人物手里拿着什么？", r14o: ["一个天平","一本书","一支羽毛笔"], r14c: ["一个天平"],
      r15q: "在建筑外墙上寻找带有巴伦西亚旗颜色的彩色玻璃窗。您能判断它是什么形状吗？", r15o: ["四边形","圆形","三角形"], r15c: ["圆形"],
      r16q: "圣母手里拿着什么？", r16o: ["玫瑰念珠","一个孩子","一顶王冠"], r16c: ["玫瑰念珠","一个孩子"],
      r17q: "天使给孩子什么？", r17o: ["一只鸽子","一个宝球","食物"], r17c: ["一个宝球"],
      r19q: "孩子手里拿着什么？", r19o: ["一只鸽子","一个贝壳","食物"], r19c: ["一个贝壳"],
    },
    pl: {
      r1q: "Ile przygód można przeżyć z Valencia be Guides?", r1o: ["4","5","6","7"], r1c: ["7"],
      r2q: "2. Czy to dobry moment, aby rozpocząć przygodę?", r2o: ["Tak","Nie"], r2c: ["?"],
      r3q: "3. Czy potrafi Pan/Pani powiedzieć mi, jak nazywają się te wieże?", r3o: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"], r3c: ["Torres de Serranos"],
      r4q: "Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i… ?", r4o: ["Fioletowy","Zielony","Niebieski"], r4c: ["Niebieski"],
      r5q: "Czy potrafi Pan/Pani powiedzieć mi nazwę tej ulicy?", r5c: ["Calle Muro de Santa Ana"],
      r6q: "Co trzyma święty Wawrzyniec w ręce?", r6o: ["Gołąb","Łyżka","Ruszt"], r6c: ["Ruszt"],
      r7q: "Którą ręką Neptun trzyma róg obfitości?", r7o: ["Lewą","Prawą"], r7c: ["Prawą"],
      r9q: "Czy potrafi Pan/Pani określić, jaką geometrię ma Cimborrio Katedry w Walencji?", r9o: ["Sześciokąt","Ośmiokąt","Czworokąt"], r9c: ["Ośmiokąt"],
      r10q: "Ile okien można zobaczyć?", r10c: ["?"],
      r12q: "Czy pamięta Pan/Pani, jakie zwierzę wieńczy herb Walencji?", r12o: ["Nietoperz","Smok","Lew"], r12c: ["Nietoperz"],
      r13q: "Nad głównym wejściem, w łuku półkolistym, alegoryczne postacie przedstawiają pięć kontynentów. Co niesie centralna figura?", r13o: ["Pochodnia","Miecz","Korona"], r13c: ["Pochodnia","Miecz"],
      r14q: "Co trzyma figura w ręce?", r14o: ["Waga","Książka","Pióro"], r14c: ["Waga"],
      r15q: "Poszukaj witrażu z kolorami walencjańskiej Senyery na fasadzie budynku. Czy potrafi Pan/Pani określić, jaki ma kształt?", r15o: ["Czworokątny","Okrągły","Trójkątny"], r15c: ["Okrągły"],
      r16q: "Co trzyma Matka Boska w ręce?", r16o: ["Różaniec","Dziecko","Korona"], r16c: ["Różaniec","Dziecko"],
      r17q: "Co anioł przekazuje dziecku?", r17o: ["Gołąb","Kula","Jedzenie"], r17c: ["Kula"],
      r19q: "Co trzyma dziecko w rękach?", r19o: ["Gołąb","Muszla","Jedzenie"], r19c: ["Muszla"],
    },
    pt: {
      r1q: "Quantas Aventuras podem ser feitas com Valencia be Guides?", r1o: ["4","5","6","7"], r1c: ["7"],
      r2q: "2. É um bom momento para começar a sua aventura?", r2o: ["Sim","Não"], r2c: ["?"],
      r3q: "3. Sabe me dizer como se chamam estas Torres?", r3o: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"], r3c: ["Torres de Serranos"],
      r4q: "No cume das torres ondeia a bandeira de Valência: as suas cores compõem-se de vermelho, amarelo e… ?", r4o: ["Violeta","Verde","Azul"], r4c: ["Azul"],
      r5q: "Sabe me dizer o nome desta rua?", r5c: ["Calle Muro de Santa Ana"],
      r6q: "O que porta São Lourenço na mão?", r6o: ["Uma Pomba","Uma colher","Uma grelha"], r6c: ["Uma grelha"],
      r7q: "Com que mão segura Neptuno a cornucópia?", r7o: ["Esquerda","Direita"], r7c: ["Direita"],
      r9q: "Consegue determinar que geometria tem o Cimborrio da Catedral de Valência?", r9o: ["Hexagonal","Octogonal","Quadrangular"], r9c: ["Octogonal"],
      r10q: "Quantas janelas consegue ver?", r10c: ["?"],
      r12q: "Recorda que animal coroa o escudo de Valência?", r12o: ["Morcego","Dragão","Leão"], r12c: ["Morcego"],
      r13q: "Sobre a entrada principal, num arco de volta perfeita, figuras alegóricas representam os cinco continentes. O que porta a figura central?", r13o: ["Uma Tocha","Uma Espada","Uma Coroa"], r13c: ["Uma Tocha","Uma Espada"],
      r14q: "O que porta a figura na mão?", r14o: ["Uma balança","Um livro","Uma pena"], r14c: ["Uma balança"],
      r15q: "Procure o vitral com as cores da Senyera valenciana na fachada do edifício. Consegue determinar que forma tem?", r15o: ["Quadrangular","Redonda","Triangular"], r15c: ["Redonda"],
      r16q: "O que segura a virgem na mão?", r16o: ["Um Rosário","Uma criança","Uma coroa"], r16c: ["Um Rosário","Uma criança"],
      r17q: "O que entrega o anjo à criança?", r17o: ["Uma pomba","Um orbe","Alimentos"], r17c: ["Um orbe"],
      r19q: "O que segura a criança nas mãos?", r19o: ["Uma pomba","Uma Concha","Alimentos"], r19c: ["Uma Concha"],
    },
    ru: {
      r1q: "Сколько приключений можно совершить с Valencia be Guides?", r1o: ["4","5","6","7"], r1c: ["7"],
      r2q: "2. Сейчас хорошее время для начала приключения?", r2o: ["Да","Нет"], r2c: ["?"],
      r3q: "3. Можете ли вы назвать мне, как называются эти башни?", r3o: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"], r3c: ["Torres de Serranos"],
      r4q: "На вершине башен развевается флаг Валенсии: его цвета состоят из красного, жёлтого и… ?", r4o: ["Фиолетового","Зелёного","Синего"], r4c: ["Синего"],
      r5q: "Можете ли вы назвать мне имя этой улицы?", r5c: ["Calle Muro de Santa Ana"],
      r6q: "Что держит святой Лаврентий в руке?", r6o: ["Голубь","Ложка","Решётка"], r6c: ["Решётка"],
      r7q: "Какой рукой Нептун держит рог изобилия?", r7o: ["Левой","Правой"], r7c: ["Правой"],
      r9q: "Можете ли вы определить геометрию тимпана Кафедрального собора Валенсии?", r9o: ["Шестиугольная","Восьмиугольная","Четырёхугольная"], r9c: ["Восьмиугольная"],
      r10q: "Сколько окон вы можете увидеть?", r10c: ["?"],
      r12q: "Помните ли вы, какое животное венчает герб Валенсии?", r12o: ["Летучая мышь","Дракон","Лев"], r12c: ["Летучая мышь"],
      r13q: "Над главным входом, в полукруглой арке, аллегорические фигуры представляют пять континентов. Что несёт центральная фигура?", r13o: ["Факел","Меч","Корона"], r13c: ["Факел","Меч"],
      r14q: "Что держит фигура в руке?", r14o: ["Весы","Книга","Перо"], r14c: ["Весы"],
      r15q: "Найдите витраж с цветами валенсийской Сеньеры на фасаде здания. Можете ли вы определить, какую форму он имеет?", r15o: ["Четырёхугольная","Круглая","Треугольная"], r15c: ["Круглая"],
      r16q: "Что держит Богородица в руке?", r16o: ["Чётки","Ребёнок","Корона"], r16c: ["Чётки","Ребёнок"],
      r17q: "Что ангел передаёт ребёнку?", r17o: ["Голубь","Держава","Еда"], r17c: ["Держава"],
      r19q: "Что держит ребёнок в руках?", r19o: ["Голубь","Ракушка","Еда"], r19c: ["Ракушка"],
    },
    uk: {
      r1q: "Скільки пригод можна здійснити з Valencia be Guides?", r1o: ["4","5","6","7"], r1c: ["7"],
      r2q: "2. Зараз хороший час для початку пригоди?", r2o: ["Так","Ні"], r2c: ["?"],
      r3q: "3. Чи можете ви сказати мені, як називаються ці вежі?", r3o: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"], r3c: ["Torres de Serranos"],
      r4q: "На вершині веж майорить прапор Валенсії: його кольори складаються з червоного, жовтого і… ?", r4o: ["Фіолетового","Зеленого","Синього"], r4c: ["Синього"],
      r5q: "Чи можете ви назвати мені ім'я цієї вулиці?", r5c: ["Calle Muro de Santa Ana"],
      r6q: "Що тримає святий Лаврентій у руці?", r6o: ["Голуб","Ложка","Решітка"], r6c: ["Решітка"],
      r7q: "Якою рукою Нептун тримає ріг достатку?", r7o: ["Лівою","Правою"], r7c: ["Правою"],
      r9q: "Чи можете ви визначити геометрію тимпану Собору Валенсії?", r9o: ["Шестикутна","Восьмикутна","Чотирикутна"], r9c: ["Восьмикутна"],
      r10q: "Скільки вікон ви можете побачити?", r10c: ["?"],
      r12q: "Чи пам'ятаєте ви, яка тварина вінчає герб Валенсії?", r12o: ["Кажан","Дракон","Лев"], r12c: ["Кажан"],
      r13q: "Над головним входом, у напівкруглій арці, алегоричні фігури представляють п'ять континентів. Що несе центральна фігура?", r13o: ["Факел","Меч","Корона"], r13c: ["Факел","Меч"],
      r14q: "Що тримає фігура в руці?", r14o: ["Терези","Книга","Перо"], r14c: ["Терези"],
      r15q: "Знайдіть вітраж з кольорами валенсійської Сеньєри на фасаді будівлі. Чи можете ви визначити, яку форму він має?", r15o: ["Чотирикутна","Кругла","Трикутна"], r15c: ["Кругла"],
      r16q: "Що тримає Богородиця в руці?", r16o: ["Вервиця","Дитина","Корона"], r16c: ["Вервиця","Дитина"],
      r17q: "Що ангел передає дитині?", r17o: ["Голуб","Держава","Їжа"], r17c: ["Держава"],
      r19q: "Що тримає дитина в руках?", r19o: ["Голуб","Мушля","Їжа"], r19c: ["Мушля"],
    },
  };
  const t = T[lang];
  const items = [
    pz(0, "PZ-intro"),
    r(1, `R1-AvFallas-${lang}`, "opcion", t.r1q, t.r1o, t.r1c, false),
    r(2, `R2-AvFallas-${lang}`, "opcion", t.r2q, t.r2o, t.r2c, false),
    r(3, `R3-AvFallas-${lang}`, "opcion", t.r3q, t.r3o, t.r3c, false),
    r(4, `R4-AvFallas-${lang}`, "opcion", t.r4q, t.r4o, t.r4c, false),
    r(5, `R5-AvFallas-${lang}`, "texto", t.r5q, null, t.r5c, null),
    r(6, `R6-AvFallas-${lang}`, "opcion", t.r6q, t.r6o, t.r6c, false),
    r(7, `R7-AvFallas-${lang}`, "opcion", t.r7q, t.r7o, t.r7c, false),
    pz(8, "PZ-01"),
    r(9, `R9-AvFallas-${lang}`, "opcion", t.r9q, t.r9o, t.r9c, false),
    r(10, `R10-AvFallas-${lang}`, "texto", t.r10q, null, t.r10c, null),
    pz(11, "PZ-17"),
    r(12, `R12-AvFallas-${lang}`, "opcion", t.r12q, t.r12o, t.r12c, false),
    r(13, `R13-AvFallas-${lang}`, "opcion-multiple", t.r13q, t.r13o, t.r13c, true),
    r(14, `R14-AvFallas-${lang}`, "opcion", t.r14q, t.r14o, t.r14c, false),
    r(15, `R15-AvFallas-${lang}`, "opcion", t.r15q, t.r15o, t.r15c, false),
    r(16, `R16-AvFallas-${lang}`, "opcion-multiple", t.r16q, t.r16o, t.r16c, true),
    r(17, `R17-AvFallas-${lang}`, "opcion", t.r17q, t.r17o, t.r17c, false),
    pz(18, "PZ-04"),
    r(19, `R19-AvFallas-${lang}`, "opcion", t.r19q, t.r19o, t.r19c, false),
    pz(20, "PZ-05"),
  ];
  return `[\n            // Array de retos AventuraFallas ${lang.toUpperCase()}\n${items.join(',\n')}\n        ]`;
}

const fallasPattern = /\r?\n        de: \[\],\r?\n        zh: \[\],\r?\n        pl: \[\],\r?\n        pt: \[\],\r?\n        ru: \[\],\r?\n        uk: \[\]\r?\n    \},\r?\n    Aventura34km:/;

const fallasReplacement = `
        de: ${buildFallas('de')},
        zh: ${buildFallas('zh')},
        pl: ${buildFallas('pl')},
        pt: ${buildFallas('pt')},
        ru: ${buildFallas('ru')},
        uk: ${buildFallas('uk')}
    },
    Aventura34km:`;

if (!fallasPattern.test(content)) {
  console.error('ERROR: Fallas pattern not found!');
  process.exit(1);
}

content = content.replace(fallasPattern, fallasReplacement);
writeFileSync(FILE, content, 'utf8');
console.log('AventuraFallas: 6 languages added.');
