// publico/demo-aventuras.js — GENERADO por tools/build-demo.js (npm run build:demo; el hook de pre-commit lo rehace).
// No se edita a mano: se cambia el dato en su fichero de origen.
//
// Lo que la demo gratis (de P2 a P11, antes del pago) usa de cada aventura, y nada más: el puzzle de introducción, el reto
// R-1, el audio y el texto de introducción, y si la aventura tiene audio en cada idioma. `textosIntro[idioma]` guarda cada
// texto distinto una vez; `aventuras[aventura][idioma].textoIntro` es su posición en esa lista.
export const DEMO_AVENTURAS = {
  "puzzleIntro": {
    "id": "PZ-intro",
    "imagen": "imagenes/imagenes-aplicación/logo-luna.png"
  },
  "textosIntro": {
    "es": [
      {
        "id": "txt-intro-es",
        "title": "Intro",
        "content": "<p>¡Hola! ¡Muy buenas! Desde <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, les damos la bienvenida. En primer lugar, queremos agradecerles por elegir esta aventura, en la que se embarcará a través del tiempo, desde la época romana hasta la Valencia del siglo XXI, una ciudad moderna, llena de luz y color. <i>en busca del tesoro</i> es una actividad al aire libre, auto-guiada, interactiva y didáctica, ideal para disfrutar de forma individual o en equipo. También les animamos a descubrir la cultura y gastronomía valenciana a su propio ritmo, simplemente pulsando el botón de pausa.</p><p><i>En busca del tesoro</i>, gracias a sus contenidos accesible en múltiples lenguas, es, además, una excelente herramienta para practicar un idioma que esté aprendiendo, o incluso para sumergirse en uno nuevo.</p><p>Bajo nuestro lema \"La elección es y será siempre suya\", ofrecemos la posibilidad de avanzar al ritmo que prefieran, hacer pausas cuando lo necesiten o incluso convertir la experiencia en una competición amistosa para ver quién completa la aventura primero. Una vez decida que es el momento apropiado, pulsen el botón de Inicio y continúe completando nuestros retos mientras sigue descubriendo la ciudad. Cada pista los llevará a un nuevo destino con nuevas incógnitas que revelarán magníficos tesoros históricos y arquitectónicos de Valencia.</p><p>Para enriquecer su experiencia incluso más, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> le incita a entrar en los monumentos visitables como parte de la experiencia de esta Aventura tales como museos, mercados y muchos otros sitios interesantes, algunos gratuitos y otras con un precio simbólico, aunque las entradas a estos últimos no están incluidas con la adquisición de esta aventura.</p><p>Si le parece indicado, nos complacería comenzar esta aventura con una breve introducción a la historia, ubicación y gastronomía valenciana. Esto nos permitirá obtener una visión general del recorrido que nos espera.</p><p>Recuerde, que el límite de esta aventura son <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 horas</mark></strong> desde su comienzo.</p><p>Esta Aventura que va a experimentar empezó hace mucho, mucho tiempo. Siglos antes de la llegada de los romanos, el lugar en el que ahora se encuentra Valencia fue ocupado por los íberos. Hablamos del siglo sexto antes de cristo.</p><p>¡Eso es hace mucho tiempo si piensa en ello!</p><p>Varios siglos después, desde el año 138 antes de cristo, y a lo largo de su historia fue intensamente romanizada, recibiendo el nombre de \"Valentia\".</p>\n<p>Sin embargo, la posterior influencia musulmana fue incluso mayor, concretamente, desde el año 711 al 1238 después de nuestra era. Lo que hace un total de unos 500 años.</p><p>Tal fue la influencia que la población era fundamentalmente musulmana. Recibiendo Valencia, durante este tiempo el nombre de \"Balansiya\".</p><p>No fue hasta 1238 cuando el Rey Jaime primero de Aragón reconquistó Valencia, cristianizando la ciudad y convirtiéndola en un reino independiente del reino de Aragón.</p>\n<p>Al Reino de Valencia le fueron entregados \"Los Fueros\" dotando al reino de una identidad política y jurídica propia.</p><p>El fin de la autonomía de la región llegó con Felipe quinto en el s. XVIII.</p>\n<p>En la Guerra de Sucesión el pueblo valenciano apoyó a su enemigo el archiduque Carlos.</p>\n<p>Felipe quinto tras ganar la guerra, abolió los Fueros y unió Valencia al gobierno nacional.</p>\n<p>En 1982, Valencia fue nombrada Capital de la Comunidad Valenciana.</p><p>Valencia, la capital del Turia, es actualmente la tercera ciudad más poblada de España. Está situada al este de la Península Ibérica, a orillas del Rio Turia y bañada por el Mar Mediterráneo, el cual, dota a la región de un clima templado con inviernos suaves y unos 340 días de sol al año.</p><p>¿Qué hay en los alrededores de la ciudad?</p><p>Desde Valencia parten una gran variedad de sendas acondicionadas para los amantes del ciclismo y la naturaleza. A unos diez kilómetros al sur de la ciudad se encuentra el parque natural de la <strong>Albufera</strong> de Valencia.</p>\n<p>La <strong>Albufera</strong> es uno de los humedales más grandes de España con una superficie de 2100 hectáreas, a las que hay que añadirle 14.000 hectáreas de marjal dedicadas al cultivo de arroz, que es el principal cultivo de la ciudad, junto con la chufa, la naranja, el níspero y el kaki.</p><p>Como puede suponer, la gastronomía valenciana se enmarca dentro de la dieta mediterránea.</p>\n<p>Sin embargo, lo que caracteriza la cocina valenciana es el uso del arroz y su plato estrella mundialmente conocido, la Paella.</p><p>También son excepcionales su guiso de anguila, el all-i-pebre y el riquísimo ajoaceite pronunciado all-i-oli.</p><p>Entre la repostería local destaca el turrón, dulce navideño por excelencia, el arnadí de calabaza y la famosa Horchata de Chufa que granizada o líquida y acompañada de sus inseparables \"Fartons\", harán las delicias de las tardes de verano.</p><p>Ahora que ya conoce un poco sobre la historia y la gastronomía de nuestra tierra, es momento de comenzar su aventura. ¡Disfrútela! Su aventura comienza en la <strong>Calle de los Serranos</strong>. Recuerde que, para avanzar en el recorrido, deberá pausar en cada punto de interés, observar el lugar indicado o completar su reto, y luego continuar hacia el próximo destino sugerido y así consecutivamente. ¿Todo listo para comenzar? ¡Allá vamos, buena suerte! Desde la <strong>Calle de los Serranos</strong>, dirija su atención al final de la vía y visualice las torres que en su mapa queda indicado con el número <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-es",
        "title": "Intro",
        "content": "<p>¡Hola! ¡Muy buenas! Desde <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, les damos la bienvenida. En primer lugar, queremos agradecerles por elegir esta aventura, en la que se embarcará a través del tiempo, desde la época romana hasta la Valencia del siglo XXI, una ciudad moderna, llena de luz y color. <i>en busca del tesoro</i> es una actividad al aire libre, auto-guiada, interactiva y didáctica, ideal para disfrutar de forma individual o en equipo. También les animamos a descubrir la cultura y gastronomía valenciana a su propio ritmo, simplemente pulsando el botón de pausa.</p><p><i>En busca del tesoro</i>, gracias a sus contenidos accesible en múltiples lenguas, es, además, una excelente herramienta para practicar un idioma que esté aprendiendo, o incluso para sumergirse en uno nuevo.</p><p>Bajo nuestro lema \"La elección es y será siempre suya\", ofrecemos la posibilidad de avanzar al ritmo que prefieran, hacer pausas cuando lo necesiten o incluso convertir la experiencia en una competición amistosa para ver quién completa la aventura primero. Una vez decida que es el momento apropiado, pulsen el botón de Inicio y continúe completando nuestros retos mientras sigue descubriendo la ciudad. Cada pista los llevará a un nuevo destino con nuevas incógnitas que revelarán magníficos tesoros históricos y arquitectónicos de Valencia.</p><p>Para enriquecer su experiencia incluso más, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> le incita a entrar en los monumentos visitables como parte de la experiencia de esta Aventura tales como museos, mercados y muchos otros sitios interesantes, algunos gratuitos y otras con un precio simbólico, aunque las entradas a estos últimos no están incluidas con la adquisición de esta aventura.</p><p>Si le parece indicado, nos complacería comenzar esta aventura con una breve introducción a la historia, ubicación y gastronomía valenciana. Esto nos permitirá obtener una visión general del recorrido que nos espera.</p><p>Recuerde, que el límite de esta aventura son <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 horas</mark></strong> desde su comienzo.</p><p>Esta Aventura que va a experimentar empezó hace mucho, mucho tiempo. Siglos antes de la llegada de los romanos, el lugar en el que ahora se encuentra Valencia fue ocupado por los íberos. Hablamos del siglo sexto antes de cristo.</p><p>¡Eso es hace mucho tiempo si piensa en ello!</p><p>Varios siglos después, desde el año 138 antes de cristo, y a lo largo de su historia fue intensamente romanizada, recibiendo el nombre de \"Valentia\".</p>\n<p>Sin embargo, la posterior influencia musulmana fue incluso mayor, concretamente, desde el año 711 al 1238 después de nuestra era. Lo que hace un total de unos 500 años.</p><p>Tal fue la influencia que la población era fundamentalmente musulmana. Recibiendo Valencia, durante este tiempo el nombre de \"Balansiya\".</p><p>No fue hasta 1238 cuando el Rey Jaime primero de Aragón reconquistó Valencia, cristianizando la ciudad y convirtiéndola en un reino independiente del reino de Aragón.</p>\n<p>Al Reino de Valencia le fueron entregados \"Los Fueros\" dotando al reino de una identidad política y jurídica propia.</p><p>El fin de la autonomía de la región llegó con Felipe quinto en el s. XVIII.</p>\n<p>En la Guerra de Sucesión el pueblo valenciano apoyó a su enemigo el archiduque Carlos.</p>\n<p>Felipe quinto tras ganar la guerra, abolió los Fueros y unió Valencia al gobierno nacional.</p>\n<p>En 1982, Valencia fue nombrada Capital de la Comunidad Valenciana.</p><p>Valencia, la capital del Turia, es actualmente la tercera ciudad más poblada de España. Está situada al este de la Península Ibérica, a orillas del Rio Turia y bañada por el Mar Mediterráneo, el cual, dota a la región de un clima templado con inviernos suaves y unos 340 días de sol al año.</p><p>¿Qué hay en los alrededores de la ciudad?</p><p>Desde Valencia parten una gran variedad de sendas acondicionadas para los amantes del ciclismo y la naturaleza. A unos diez kilómetros al sur de la ciudad se encuentra el parque natural de la <strong>Albufera</strong> de Valencia.</p>\n<p>La <strong>Albufera</strong> es uno de los humedales más grandes de España con una superficie de 2100 hectáreas, a las que hay que añadirle 14.000 hectáreas de marjal dedicadas al cultivo de arroz, que es el principal cultivo de la ciudad, junto con la chufa, la naranja, el níspero y el kaki.</p><p>Como puede suponer, la gastronomía valenciana se enmarca dentro de la dieta mediterránea.</p>\n<p>Sin embargo, lo que caracteriza la cocina valenciana es el uso del arroz y su plato estrella mundialmente conocido, la Paella.</p><p>También son excepcionales su guiso de anguila, el all-i-pebre y el riquísimo ajoaceite pronunciado all-i-oli.</p><p>Entre la repostería local destaca el turrón, dulce navideño por excelencia, el arnadí de calabaza y la famosa Horchata de Chufa que granizada o líquida y acompañada de sus inseparables \"Fartons\", harán las delicias de las tardes de verano.</p><p>Ahora que ya conoce un poco sobre la historia y la gastronomía de nuestra tierra, es momento de comenzar su aventura. ¡Disfrútela! Su aventura comienza en la <strong>Calle de los Serranos</strong>. Recuerde que, para avanzar en el recorrido, deberá pausar en cada punto de interés, observar el lugar indicado o completar su reto, y luego continuar hacia el próximo destino sugerido y así consecutivamente. ¿Todo listo para comenzar? ¡Allá vamos, buena suerte! Desde la <strong>Calle de los Serranos</strong>, dirija su atención al final de la vía y visualice las torres que en su mapa queda indicado con el número <mark>1</mark>.</p>"
      }
    ],
    "en": [
      {
        "id": "txt-intro-en",
        "title": "Intro",
        "content": "<p>Hello, and welcome! From <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, we are delighted to have you here. Thank you for choosing this adventure — one that will take you through time, from the Roman era to 21st-century Valencia, a modern city full of light and colour. <i>In search of the treasure</i> is an outdoor, self-guided, interactive and educational activity, perfect for individuals and groups alike. Whenever you feel like it, simply press pause to discover Valencian culture and gastronomy at your own pace.</p><p><i>In search of the treasure</i>, thanks to its content available in multiple languages, is also an excellent tool for practising a language you are learning, or even for immersing yourself in a new one.</p><p>Under our motto 'The choice is and will always be yours', you can move at your own pace, stop whenever you like, or even turn it into a friendly race to see who finishes first. When you are ready, press Start and keep exploring the city — each clue leads to a new destination and new mysteries, revealing the magnificent historical and architectural treasures of Valencia.</p><p>To make the most of your experience, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> invites you to step inside the sites along the route — museums, markets and many other places of interest, some free, others with a small entry charge that is not included in the price of this adventure.</p><p>If you are happy to, let us kick things off with a brief introduction to Valencian history, geography and gastronomy — giving you a feel for the journey ahead.</p><p>Remember, the time limit for this adventure is <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 hours</mark></strong> from the start.</p><p>This Adventure you are about to experience began a very, very long time ago. Centuries before the arrival of the Romans, the place where Valencia now stands was occupied by the Iberians. We are talking about the sixth century BC.</p><p>That is a long time ago when you think about it!</p><p>Several centuries later, from the year 138 BC, and throughout its history, the city was intensely Romanised, receiving the name 'Valentia'.</p>\n<p>However, the subsequent Muslim influence was even greater, specifically from 711 to 1238 AD — a total of about 500 years.</p><p>Such was the influence that the population was predominantly Muslim. During this time Valencia received the name 'Balansiya'.</p><p>It was not until 1238 that King James I of Aragon reconquered Valencia, Christianising the city and establishing it as a kingdom independent of the Kingdom of Aragon.</p>\n<p>The Kingdom of Valencia was granted its own laws — the 'Els Fueros' — giving it a distinct political and legal identity.</p><p>The end of the region's autonomy came with Philip V in the 18th century.</p>\n<p>In the War of Succession the Valencian people supported his enemy, Archduke Charles.</p>\n<p>Philip V, after winning the war, abolished the Fueros and united Valencia with the national government.</p>\n<p>In 1982, Valencia was named Capital of the Valencian Community.</p><p>Valencia, the capital of the Turia, is the third largest city in Spain. It sits on the eastern edge of the Iberian Peninsula, on the banks of the River Turia and facing the Mediterranean Sea, which blesses the region with a mild climate, gentle winters and around 340 days of sunshine a year.</p><p>What is there in the surroundings of the city?</p><p>Valencia is the starting point for a wide variety of routes suited to cyclists and nature lovers. About ten kilometres south of the city lies the natural park of the <strong>Albufera</strong> of Valencia.</p>\n<p>The <strong>Albufera</strong> is one of the largest wetlands in Spain, covering 2,100 hectares, to which must be added 14,000 hectares of marshland devoted to rice cultivation — the main crop of the region, alongside tiger nut, orange, loquat and persimmon.</p><p>As you might expect, Valencian gastronomy falls within the Mediterranean diet.</p>\n<p>However, what characterises Valencian cuisine is the use of rice and its star dish known worldwide: Paella.</p><p>Also exceptional are its eel stew, the all-i-pebre and the delicious aioli pronounced all-i-oli.</p><p>Among the local sweet specialities, the most notable are turrón — the quintessential Christmas treat — arnadí de calabaza, and the famous Orxata de Chufa which, served iced or liquid alongside its inseparable 'Fartons', is the perfect companion for a summer afternoon.</p><p>Now that you know a little about the history and gastronomy of our land, it is time to begin your adventure. Enjoy it! Your adventure starts on <strong>Calle de los Serranos</strong>. To move through the route, pause at each point of interest, observe the indicated place or complete your challenge, then continue to the next stop — and so on. All set? Here we go, good luck! From <strong>Calle de los Serranos</strong>, direct your attention to the far end of the street and look for the towers marked as number <mark>1</mark> on your map.</p>"
      },
      {
        "id": "txt-intro-en",
        "title": "Intro",
        "content": "<p>Hello, and welcome! From <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, we are delighted to have you here. Thank you for choosing this adventure — one that will take you through time, from the Roman era to 21st-century Valencia, a modern city full of light and colour. <i>In search of the treasure</i> is an outdoor, self-guided, interactive and educational activity, perfect for individuals and groups alike. Whenever you feel like it, simply press pause to discover Valencian culture and gastronomy at your own pace.</p><p><i>In search of the treasure</i>, thanks to its content available in multiple languages, is also an excellent tool for practising a language you are learning, or even for immersing yourself in a new one.</p><p>Under our motto 'The choice is and will always be yours', you can move at your own pace, stop whenever you like, or even turn it into a friendly race to see who finishes first. When you are ready, press Start and keep exploring the city — each clue leads to a new destination and new mysteries, revealing the magnificent historical and architectural treasures of Valencia.</p><p>To make the most of your experience, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> invites you to step inside the sites along the route — museums, markets and many other places of interest, some free, others with a small entry charge that is not included in the price of this adventure.</p><p>If you are happy to, let us kick things off with a brief introduction to Valencian history, geography and gastronomy — giving you a feel for the journey ahead.</p><p>Remember, the time limit for this adventure is <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 hours</mark></strong> from the start.</p><p>This Adventure you are about to experience began a very, very long time ago. Centuries before the arrival of the Romans, the place where Valencia now stands was occupied by the Iberians. We are talking about the sixth century BC.</p><p>That is a long time ago when you think about it!</p><p>Several centuries later, from the year 138 BC, and throughout its history, the city was intensely Romanised, receiving the name 'Valentia'.</p>\n<p>However, the subsequent Muslim influence was even greater, specifically from 711 to 1238 AD — a total of about 500 years.</p><p>Such was the influence that the population was predominantly Muslim. During this time Valencia received the name 'Balansiya'.</p><p>It was not until 1238 that King James I of Aragon reconquered Valencia, Christianising the city and establishing it as a kingdom independent of the Kingdom of Aragon.</p>\n<p>The Kingdom of Valencia was granted its own laws — the 'Els Fueros' — giving it a distinct political and legal identity.</p><p>The end of the region's autonomy came with Philip V in the 18th century.</p>\n<p>In the War of Succession the Valencian people supported his enemy, Archduke Charles.</p>\n<p>Philip V, after winning the war, abolished the Fueros and united Valencia with the national government.</p>\n<p>In 1982, Valencia was named Capital of the Valencian Community.</p><p>Valencia, the capital of the Turia, is the third largest city in Spain. It sits on the eastern edge of the Iberian Peninsula, on the banks of the River Turia and facing the Mediterranean Sea, which blesses the region with a mild climate, gentle winters and around 340 days of sunshine a year.</p><p>What is there in the surroundings of the city?</p><p>Valencia is the starting point for a wide variety of routes suited to cyclists and nature lovers. About ten kilometres south of the city lies the natural park of the <strong>Albufera</strong> of Valencia.</p>\n<p>The <strong>Albufera</strong> is one of the largest wetlands in Spain, covering 2,100 hectares, to which must be added 14,000 hectares of marshland devoted to rice cultivation — the main crop of the region, alongside tiger nut, orange, loquat and persimmon.</p><p>As you might expect, Valencian gastronomy falls within the Mediterranean diet.</p>\n<p>However, what characterises Valencian cuisine is the use of rice and its star dish known worldwide: Paella.</p><p>Also exceptional are its eel stew, the all-i-pebre and the delicious aioli pronounced all-i-oli.</p><p>Among the local sweet specialities, the most notable are turrón — the quintessential Christmas treat — arnadí de calabaza, and the famous Orxata de Chufa which, served iced or liquid alongside its inseparable 'Fartons', is the perfect companion for a summer afternoon.</p><p>Now that you know a little about the history and gastronomy of our land, it is time to begin your adventure. Enjoy it! Your adventure starts on <strong>Calle de los Serranos</strong>. To move through the route, pause at each point of interest, observe the indicated place or complete your challenge, then continue to the next stop — and so on. All set? Here we go, good luck! From <strong>Calle de los Serranos</strong>, direct your attention to the far end of the street and look for the towers marked as number <mark>1</mark> on your map.</p>"
      }
    ],
    "fr": [
      {
        "id": "txt-intro-fr",
        "title": "Intro",
        "content": "<p>Bonjour ! De la part de <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, nous vous souhaitons la bienvenue. Tout d'abord, nous souhaitons vous remercier d'avoir choisi cette aventure, dans laquelle vous vous embarquerez à travers le temps, depuis l'époque romaine jusqu'à la Valence du XXIe siècle, une ville moderne, pleine de lumière et de couleurs. <i>En quête du trésor</i> est une activité en plein air, autoguidée, interactive et pédagogique, idéale pour profiter seul ou en équipe. Nous vous encourageons également à découvrir la culture et la gastronomie valenciennes à votre propre rythme, simplement en appuyant sur le bouton pause.</p><p><i>En quête du trésor</i>, grâce à ses contenus accessibles en plusieurs langues, est également un excellent outil pour pratiquer une langue que vous apprenez, ou même pour vous immerger dans une nouvelle.</p><p>Sous notre devise « Le choix est et sera toujours le vôtre », nous offrons la possibilité d'avancer au rythme qui vous convient, de faire des pauses quand vous en avez besoin, ou même de transformer l'expérience en une compétition amicale pour voir qui complète l'aventure en premier. Quand vous êtes prêt, appuyez sur le bouton Démarrer et continuez à relever nos défis tout en découvrant la ville. Chaque indice vous conduira vers une nouvelle destination avec de nouvelles énigmes qui révéleront de magnifiques trésors historiques et architecturaux de Valence.</p><p>Pour enrichir encore davantage votre expérience, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> vous invite à entrer dans les monuments visitables dans le cadre de cette Aventure, tels que musées, marchés et de nombreux autres sites intéressants, certains gratuits et d'autres avec un prix symbolique, bien que les billets d'entrée à ces derniers ne soient pas inclus dans l'achat de cette aventure.</p><p>Si vous le souhaitez, nous serions ravis de commencer cette aventure par une brève introduction à l'histoire, la situation géographique et la gastronomie valencienne. Cela nous permettra d'avoir une vue d'ensemble du parcours qui nous attend.</p><p>N'oubliez pas que cette aventure a une limite de <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 heures</mark></strong> à partir de son début.</p><p>Cette Aventure que vous allez vivre a commencé il y a très, très longtemps. Des siècles avant l'arrivée des Romains, le lieu où se trouve aujourd'hui Valence était occupé par les Ibères. Nous parlons du VIe siècle avant Jésus-Christ.</p><p>C'était il y a longtemps, si l'on y réfléchit !</p><p>Plusieurs siècles plus tard, depuis l'an 138 avant Jésus-Christ, et tout au long de son histoire, la ville fut intensément romanisée, recevant le nom de « Valentia ».</p>\n<p>Cependant, l'influence musulmane ultérieure fut encore plus grande, concrètement de l'an 711 à 1238 après notre ère, soit environ 500 ans.</p><p>L'influence fut telle que la population était essentiellement musulmane. Valence reçut alors le nom de « Balansiya ».</p><p>Ce n'est qu'en 1238 que le roi Jaime Ier d'Aragon reconquit Valence, christianisant la ville et en faisant un royaume indépendant du royaume d'Aragon.</p>\n<p>Le Royaume de Valence reçut « Les Fueros », dotant le royaume d'une identité politique et juridique propre.</p><p>La fin de l'autonomie de la région arriva avec Philippe V au XVIIIe siècle.</p>\n<p>Dans la Guerre de Succession, le peuple valencien soutint son ennemi l'archiduc Charles.</p>\n<p>Philippe V, après avoir gagné la guerre, abolit les Fueros et unit Valence au gouvernement national.</p>\n<p>En 1982, Valence fut nommée capitale de la Communauté Valencienne.</p><p>Valence, la capitale du Turia, est actuellement la troisième ville la plus peuplée d'Espagne. Située à l'est de la péninsule ibérique, au bord du fleuve Turia et baignée par la mer Méditerranée, qui dote la région d'un climat tempéré avec des hivers doux et environ 340 jours de soleil par an.</p><p>Qu'y a-t-il aux alentours de la ville ?</p><p>De Valence partent une grande variété de sentiers aménagés pour les amateurs de cyclisme et de nature. À environ dix kilomètres au sud de la ville se trouve le parc naturel de l'<strong>Albufera</strong> de Valence.</p>\n<p>L'<strong>Albufera</strong> est l'une des zones humides les plus grandes d'Espagne avec une superficie de 2 100 hectares, auxquels il faut ajouter 14 000 hectares de marais dédiés à la culture du riz, principale culture de la ville, avec la chufa, l'orange, la nèfle et le kaki.</p><p>Comme vous pouvez l'imaginer, la gastronomie valencienne s'inscrit dans le cadre du régime méditerranéen.</p>\n<p>Cependant, ce qui caractérise la cuisine valencienne, c'est l'utilisation du riz et son plat vedette mondialement connu : la Paella.</p><p>Le ragoût d'anguille est également exceptionnel, ainsi que l'all-i-pebre et le savoureux aïoli prononcé all-i-oli.</p><p>Parmi la pâtisserie locale, on distingue le nougat, douceur de Noël par excellence, l'arnadí de courge et la célèbre Orxata de Chufa, granité ou liquide, accompagnée de ses inséparables « Fartons », qui feront les délices des après-midis d'été.</p><p>Maintenant que vous en savez un peu plus sur l'histoire et la gastronomie de notre terre, il est temps de commencer votre aventure. Profitez-en ! Votre aventure commence dans la <strong>Calle de los Serranos</strong>. N'oubliez pas que, pour progresser dans le parcours, vous devrez faire une pause à chaque point d'intérêt, observer le lieu indiqué ou compléter votre défi, puis continuer vers la prochaine destination suggérée, et ainsi de suite. Tout est prêt pour commencer ? Allons-y, bonne chance ! Depuis la <strong>Calle de los Serranos</strong>, regardez au bout de la rue et repérez les tours indiquées sur votre carte sous le numéro <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-fr",
        "title": "Intro",
        "content": "<p>Bonjour ! De la part de <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, nous vous souhaitons la bienvenue. Tout d'abord, nous souhaitons vous remercier d'avoir choisi cette aventure, dans laquelle vous vous embarquerez à travers le temps, depuis l'époque romaine jusqu'à la Valence du XXIe siècle, une ville moderne, pleine de lumière et de couleurs. <i>En quête du trésor</i> est une activité en plein air, autoguidée, interactive et pédagogique, idéale pour profiter seul ou en équipe. Nous vous encourageons également à découvrir la culture et la gastronomie valenciennes à votre propre rythme, simplement en appuyant sur le bouton pause.</p><p><i>En quête du trésor</i>, grâce à ses contenus accessibles en plusieurs langues, est également un excellent outil pour pratiquer une langue que vous apprenez, ou même pour vous immerger dans une nouvelle.</p><p>Sous notre devise « Le choix est et sera toujours le vôtre », nous offrons la possibilité d'avancer au rythme qui vous convient, de faire des pauses quand vous en avez besoin, ou même de transformer l'expérience en une compétition amicale pour voir qui complète l'aventure en premier. Quand vous êtes prêt, appuyez sur le bouton Démarrer et continuez à relever nos défis tout en découvrant la ville. Chaque indice vous conduira vers une nouvelle destination avec de nouvelles énigmes qui révéleront de magnifiques trésors historiques et architecturaux de Valence.</p><p>Pour enrichir encore davantage votre expérience, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> vous invite à entrer dans les monuments visitables dans le cadre de cette Aventure, tels que musées, marchés et de nombreux autres sites intéressants, certains gratuits et d'autres avec un prix symbolique, bien que les billets d'entrée à ces derniers ne soient pas inclus dans l'achat de cette aventure.</p><p>Si vous le souhaitez, nous serions ravis de commencer cette aventure par une brève introduction à l'histoire, la situation géographique et la gastronomie valencienne. Cela nous permettra d'avoir une vue d'ensemble du parcours qui nous attend.</p><p>N'oubliez pas que cette aventure a une limite de <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 heures</mark></strong> à partir de son début.</p><p>Cette Aventure que vous allez vivre a commencé il y a très, très longtemps. Des siècles avant l'arrivée des Romains, le lieu où se trouve aujourd'hui Valence était occupé par les Ibères. Nous parlons du VIe siècle avant Jésus-Christ.</p><p>C'était il y a longtemps, si l'on y réfléchit !</p><p>Plusieurs siècles plus tard, depuis l'an 138 avant Jésus-Christ, et tout au long de son histoire, la ville fut intensément romanisée, recevant le nom de « Valentia ».</p>\n<p>Cependant, l'influence musulmane ultérieure fut encore plus grande, concrètement de l'an 711 à 1238 après notre ère, soit environ 500 ans.</p><p>L'influence fut telle que la population était essentiellement musulmane. Valence reçut alors le nom de « Balansiya ».</p><p>Ce n'est qu'en 1238 que le roi Jaime Ier d'Aragon reconquit Valence, christianisant la ville et en faisant un royaume indépendant du royaume d'Aragon.</p>\n<p>Le Royaume de Valence reçut « Les Fueros », dotant le royaume d'une identité politique et juridique propre.</p><p>La fin de l'autonomie de la région arriva avec Philippe V au XVIIIe siècle.</p>\n<p>Dans la Guerre de Succession, le peuple valencien soutint son ennemi l'archiduc Charles.</p>\n<p>Philippe V, après avoir gagné la guerre, abolit les Fueros et unit Valence au gouvernement national.</p>\n<p>En 1982, Valence fut nommée capitale de la Communauté Valencienne.</p><p>Valence, la capitale du Turia, est actuellement la troisième ville la plus peuplée d'Espagne. Située à l'est de la péninsule ibérique, au bord du fleuve Turia et baignée par la mer Méditerranée, qui dote la région d'un climat tempéré avec des hivers doux et environ 340 jours de soleil par an.</p><p>Qu'y a-t-il aux alentours de la ville ?</p><p>De Valence partent une grande variété de sentiers aménagés pour les amateurs de cyclisme et de nature. À environ dix kilomètres au sud de la ville se trouve le parc naturel de l'<strong>Albufera</strong> de Valence.</p>\n<p>L'<strong>Albufera</strong> est l'une des zones humides les plus grandes d'Espagne avec une superficie de 2 100 hectares, auxquels il faut ajouter 14 000 hectares de marais dédiés à la culture du riz, principale culture de la ville, avec la chufa, l'orange, la nèfle et le kaki.</p><p>Comme vous pouvez l'imaginer, la gastronomie valencienne s'inscrit dans le cadre du régime méditerranéen.</p>\n<p>Cependant, ce qui caractérise la cuisine valencienne, c'est l'utilisation du riz et son plat vedette mondialement connu : la Paella.</p><p>Le ragoût d'anguille est également exceptionnel, ainsi que l'all-i-pebre et le savoureux aïoli prononcé all-i-oli.</p><p>Parmi la pâtisserie locale, on distingue le nougat, douceur de Noël par excellence, l'arnadí de courge et la célèbre Orxata de Chufa, granité ou liquide, accompagnée de ses inséparables « Fartons », qui feront les délices des après-midis d'été.</p><p>Maintenant que vous en savez un peu plus sur l'histoire et la gastronomie de notre terre, il est temps de commencer votre aventure. Profitez-en ! Votre aventure commence dans la <strong>Calle de los Serranos</strong>. N'oubliez pas que, pour progresser dans le parcours, vous devrez faire une pause à chaque point d'intérêt, observer le lieu indiqué ou compléter votre défi, puis continuer vers la prochaine destination suggérée, et ainsi de suite. Tout est prêt pour commencer ? Allons-y, bonne chance ! Depuis la <strong>Calle de los Serranos</strong>, regardez au bout de la rue et repérez les tours indiquées sur votre carte sous le numéro <mark>1</mark>.</p>"
      }
    ],
    "it": [
      {
        "id": "txt-intro-it",
        "title": "Intro",
        "content": "<p>Benvenuti! Da <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, vi diamo il benvenuto. Innanzitutto vogliamo ringraziarvi per aver scelto questa avventura, in cui vi imbarcherete attraverso il tempo, dall'epoca romana alla Valencia del XXI secolo, una città moderna, piena di luce e colore. <i>alla ricerca del tesoro</i> è un'attività all'aperto, autogestita, interattiva e didattica, ideale da godere individualmente o in gruppo. Vi incoraggiamo anche a scoprire la cultura e la gastronomia valenciana al vostro ritmo, semplicemente premendo il tasto pausa.</p><p><i>Alla ricerca del tesoro</i>, grazie ai suoi contenuti accessibili in più lingue, è inoltre un eccellente strumento per praticare una lingua che sta imparando, o addirittura per immergersi in una nuova.</p><p>Sotto il nostro motto \"La scelta è e sarà sempre sua\", offriamo la possibilità di avanzare al ritmo che preferisce, fare pause quando ne ha bisogno o addirittura trasformare l'esperienza in una competizione amichevole per vedere chi completa l'avventura per primo. Una volta che decida che è il momento appropriato, prema il tasto Avvia e continui a completare le nostre sfide mentre scopre la città. Ogni indizio la porterà a una nuova destinazione con nuovi enigmi che riveleranno magnifici tesori storici e architettonici di Valencia.</p><p>Per arricchire ancora di più la sua esperienza, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> la invita a entrare nei monumenti visitabili come parte dell'esperienza di questa Avventura, come musei, mercati e molti altri luoghi interessanti, alcuni gratuiti e altri con un prezzo simbolico, sebbene i biglietti d'ingresso a questi ultimi non siano inclusi con l'acquisto di questa avventura.</p><p>Se le sembra opportuno, ci farebbe piacere iniziare questa avventura con una breve introduzione alla storia, ubicazione e gastronomia valenciana. Questo ci permetterà di avere una visione generale del percorso che ci aspetta.</p><p>Ricordi che il limite di questa avventura è di <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 ore</mark></strong> dall'inizio.</p><p>Questa Avventura che sta per vivere è iniziata molto, molto tempo fa. Secoli prima dell'arrivo dei Romani, il luogo in cui ora si trova Valencia fu occupato dagli Iberi. Stiamo parlando del VI secolo prima di Cristo.</p><p>È tanto tempo fa, se ci pensa!</p><p>Vari secoli dopo, dall'anno 138 avanti Cristo, e nel corso della sua storia fu intensamente romanizzata, ricevendo il nome di \"Valentia\".</p>\n\n<p>Tuttavia, la successiva influenza musulmana fu ancora maggiore, precisamente dall'anno 711 al 1238 della nostra era. Ciò fa un totale di circa 500 anni.</p><p>Tanta fu l'influenza che la popolazione era fondamentalmente musulmana. Valencia ricevette durante questo periodo il nome di \"Balansiya\".</p><p>Non fu fino al 1238 che il Re Giacomo I d'Aragona riconquistò Valencia, cristianizzando la città e trasformandola in un regno indipendente dal regno d'Aragona.</p>\n\n<p>Al Regno di Valencia furono consegnati \"Los Fueros\", dotando il regno di una propria identità politica e giuridica.</p><p>La fine dell'autonomia della regione arrivò con Filippo V nel XVIII secolo.</p>\n\n<p>Nella Guerra di Successione il popolo valenciano appoggiò il suo nemico l'arciduca Carlo.</p>\n\n<p>Filippo V, dopo aver vinto la guerra, abolì i Fueros e unì Valencia al governo nazionale.</p>\n\n<p>Nel 1982, Valencia fu nominata Capitale della Comunità Valenciana.</p><p>Valencia, la capitale del Turia, è attualmente la terza città più popolata di Spagna. Si trova a est della Penisola Iberica, sulle rive del Río Turia e bagnata dal Mar Mediterraneo, che dona alla regione un clima temperato con inverni miti e circa 340 giorni di sole all'anno.</p><p>Cosa c'è nei dintorni della città?</p><p>Da Valencia partono una grande varietà di percorsi attrezzati per gli amanti del ciclismo e della natura. A circa dieci chilometri a sud della città si trova il parco naturale dell'<strong>Albufera</strong> di Valencia.</p>\n\n<p>L'<strong>Albufera</strong> è una delle zone umide più grandi di Spagna con una superficie di 2100 ettari, a cui si aggiungono 14.000 ettari di palude dedicati alla coltivazione del riso, che è la principale coltura della città, insieme alla chufa, all'arancia, al nespolo e al cachi.</p><p>Come può supporre, la gastronomia valenciana si inserisce nella dieta mediterranea.</p>\n\n<p>Tuttavia, ciò che caratterizza la cucina valenciana è l'uso del riso e il suo piatto stellare conosciuto in tutto il mondo, la Paella.</p><p>Sono eccezionali anche lo stufato di anguilla, l'all-i-pebre e il ricchissimo aglio e olio pronunciato all-i-oli.</p><p>Tra i dolci locali spiccano il torrone, dolce natalizio per eccellenza, l'arnadí di zucca e la famosa Orxata de Chufa che ghiacciata o liquida e accompagnata dai suoi inseparabili \"Fartons\", farà le delizie dei pomeriggi estivi.</p><p>Ora che conosce un po' la storia e la gastronomia della nostra terra, è il momento di iniziare la sua avventura. Godetevela! La sua avventura inizia nella <strong>Calle de los Serranos</strong>. Ricordi che, per avanzare nel percorso, dovrà mettere in pausa a ogni punto di interesse, osservare il luogo indicato o completare la sua sfida, e poi continuare verso la prossima destinazione suggerita e così consecutivamente. Tutto pronto per cominciare? Andiamo, buona fortuna! Dalla <strong>Calle de los Serranos</strong>, rivolga la sua attenzione alla fine della via e visualizzi le torri che sulla sua mappa sono indicate con il numero <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-it",
        "title": "Intro",
        "content": "<p>Benvenuti! Da <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, vi diamo il benvenuto. Innanzitutto vogliamo ringraziarvi per aver scelto questa avventura, in cui vi imbarcherete attraverso il tempo, dall'epoca romana alla Valencia del XXI secolo, una città moderna, piena di luce e colore. <i>alla ricerca del tesoro</i> è un'attività all'aperto, autogestita, interattiva e didattica, ideale da godere individualmente o in gruppo. Vi incoraggiamo anche a scoprire la cultura e la gastronomia valenciana al vostro ritmo, semplicemente premendo il tasto pausa.</p><p><i>Alla ricerca del tesoro</i>, grazie ai suoi contenuti accessibili in più lingue, è inoltre un eccellente strumento per praticare una lingua che sta imparando, o addirittura per immergersi in una nuova.</p><p>Sotto il nostro motto \"La scelta è e sarà sempre sua\", offriamo la possibilità di avanzare al ritmo che preferisce, fare pause quando ne ha bisogno o addirittura trasformare l'esperienza in una competizione amichevole per vedere chi completa l'avventura per primo. Una volta che decida che è il momento appropriato, prema il tasto Avvia e continui a completare le nostre sfide mentre scopre la città. Ogni indizio la porterà a una nuova destinazione con nuovi enigmi che riveleranno magnifici tesori storici e architettonici di Valencia.</p><p>Per arricchire ancora di più la sua esperienza, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> la invita a entrare nei monumenti visitabili come parte dell'esperienza di questa Avventura, come musei, mercati e molti altri luoghi interessanti, alcuni gratuiti e altri con un prezzo simbolico, sebbene i biglietti d'ingresso a questi ultimi non siano inclusi con l'acquisto di questa avventura.</p><p>Se le sembra opportuno, ci farebbe piacere iniziare questa avventura con una breve introduzione alla storia, ubicazione e gastronomia valenciana. Questo ci permetterà di avere una visione generale del percorso che ci aspetta.</p><p>Ricordi che il limite di questa avventura è di <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 ore</mark></strong> dall'inizio.</p><p>Questa Avventura che sta per vivere è iniziata molto, molto tempo fa. Secoli prima dell'arrivo dei Romani, il luogo in cui ora si trova Valencia fu occupato dagli Iberi. Stiamo parlando del VI secolo prima di Cristo.</p><p>È tanto tempo fa, se ci pensa!</p><p>Vari secoli dopo, dall'anno 138 avanti Cristo, e nel corso della sua storia fu intensamente romanizzata, ricevendo il nome di \"Valentia\".</p>\n\n<p>Tuttavia, la successiva influenza musulmana fu ancora maggiore, precisamente dall'anno 711 al 1238 della nostra era. Ciò fa un totale di circa 500 anni.</p><p>Tanta fu l'influenza che la popolazione era fondamentalmente musulmana. Valencia ricevette durante questo periodo il nome di \"Balansiya\".</p><p>Non fu fino al 1238 che il Re Giacomo I d'Aragona riconquistò Valencia, cristianizzando la città e trasformandola in un regno indipendente dal regno d'Aragona.</p>\n\n<p>Al Regno di Valencia furono consegnati \"Los Fueros\", dotando il regno di una propria identità politica e giuridica.</p><p>La fine dell'autonomia della regione arrivò con Filippo V nel XVIII secolo.</p>\n\n<p>Nella Guerra di Successione il popolo valenciano appoggiò il suo nemico l'arciduca Carlo.</p>\n\n<p>Filippo V, dopo aver vinto la guerra, abolì i Fueros e unì Valencia al governo nazionale.</p>\n\n<p>Nel 1982, Valencia fu nominata Capitale della Comunità Valenciana.</p><p>Valencia, la capitale del Turia, è attualmente la terza città più popolata di Spagna. Si trova a est della Penisola Iberica, sulle rive del Río Turia e bagnata dal Mar Mediterraneo, che dona alla regione un clima temperato con inverni miti e circa 340 giorni di sole all'anno.</p><p>Cosa c'è nei dintorni della città?</p><p>Da Valencia partono una grande varietà di percorsi attrezzati per gli amanti del ciclismo e della natura. A circa dieci chilometri a sud della città si trova il parco naturale dell'<strong>Albufera</strong> di Valencia.</p>\n\n<p>L'<strong>Albufera</strong> è una delle zone umide più grandi di Spagna con una superficie di 2100 ettari, a cui si aggiungono 14.000 ettari di palude dedicati alla coltivazione del riso, che è la principale coltura della città, insieme alla chufa, all'arancia, al nespolo e al cachi.</p><p>Come può supporre, la gastronomia valenciana si inserisce nella dieta mediterranea.</p>\n\n<p>Tuttavia, ciò che caratterizza la cucina valenciana è l'uso del riso e il suo piatto stellare conosciuto in tutto il mondo, la Paella.</p><p>Sono eccezionali anche lo stufato di anguilla, l'all-i-pebre e il ricchissimo aglio e olio pronunciato all-i-oli.</p><p>Tra i dolci locali spiccano il torrone, dolce natalizio per eccellenza, l'arnadí di zucca e la famosa Orxata de Chufa che ghiacciata o liquida e accompagnata dai suoi inseparabili \"Fartons\", farà le delizie dei pomeriggi estivi.</p><p>Ora che conosce un po' la storia e la gastronomia della nostra terra, è il momento di iniziare la sua avventura. Godetevela! La sua avventura inizia nella <strong>Calle de los Serranos</strong>. Ricordi che, per avanzare nel percorso, dovrà mettere in pausa a ogni punto di interesse, osservare il luogo indicato o completare la sua sfida, e poi continuare verso la prossima destinazione suggerita e così consecutivamente. Tutto pronto per cominciare? Andiamo, buona fortuna! Dalla <strong>Calle de los Serranos</strong>, rivolga la sua attenzione alla fine della via e visualizzi le torri che sulla sua mappa sono indicate con il numero <mark>1</mark>.</p>"
      }
    ],
    "nl": [
      {
        "id": "txt-intro-nl",
        "title": "Intro",
        "content": "<p>Welkom! Vanuit <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> heten we u van harte welkom. Allereerst willen we u bedanken voor het kiezen van dit avontuur, waarbij u door de tijd reist, van de Romeinse tijd tot het Valencia van de 21e eeuw, een moderne stad vol licht en kleur. <i>Op zoek naar de schat</i> is een buitenactiviteit, zelf-geleid, interactief en educatief, ideaal voor individueel of teamgenot. We moedigen u ook aan om de Valenciaanse cultuur en gastronomie op uw eigen tempo te ontdekken door gewoon op de pauzeknop te drukken.</p><p><i>Op zoek naar de schat</i>, dankzij de beschikbaarheid van de inhoud in meerdere talen, is ook een uitstekend hulpmiddel om een taal te oefenen die u aan het leren bent, of zelfs om u in een nieuwe taal onder te dompelen.</p><p>Onder ons motto «De keuze is en zal altijd de uwe zijn», bieden we de mogelijkheid om op het gewenste tempo vooruit te gaan, pauzes te nemen wanneer nodig of de ervaring zelfs om te vormen tot een vriendschappelijke wedstrijd om te zien wie het avontuur als eerste voltooit. Wanneer u klaar bent, druk op de Start-knop en ga door met het oplossen van onze uitdagingen terwijl u de stad blijft ontdekken. Elke aanwijzing leidt u naar een nieuwe bestemming met nieuwe raadsels die prachtige historische en architectonische schatten van Valencia onthullen.</p><p>Om uw ervaring nog verder te verrijken, moedigt <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> u aan de bezochbare monumenten te betreden als onderdeel van de ervaring van dit Avontuur, zoals musea, markten en vele andere interessante plaatsen, sommige gratis en andere voor een symbolische prijs, hoewel de toegangskaartjes voor de laatste niet inbegrepen zijn bij de aankoop van dit avontuur.</p><p>Als u dat gepast vindt, zouden we graag dit avontuur beginnen met een korte introductie over de Valenciaanse geschiedenis, ligging en gastronomie. Dit zal ons een overzicht geven van de route die ons te wachten staat.</p><p>Vergeet niet dat de tijdslimiet van dit avontuur <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 uur</mark></strong> is vanaf het begin.</p><p>Dit Avontuur dat u gaat beleven begon heel, heel lang geleden. Eeuwen voor de komst van de Romeinen werd de plek waar Valencia nu ligt bezet door de Iberiërs. We spreken over de zesde eeuw voor Christus.</p><p>Dat is heel lang geleden als u er even over nadenkt!</p><p>Verschillende eeuwen later, vanaf het jaar 138 voor Christus, werd de stad doorheen zijn geschiedenis sterk geromaniseerd en ontving de naam «Valentia».</p>\n<p>De latere Islamitische invloed was echter nog groter, meer bepaald van het jaar 711 tot 1238 na onze tijdrekening. Dit maakt een totaal van ongeveer 500 jaar.</p><p>De invloed was zo groot dat de bevolking voornamelijk Islamitisch was. Valencia ontving gedurende deze periode de naam «Balansiya».</p><p>Pas in 1238 veroverde koning Jaime I van Aragón Valencia terug, kerstende de stad en maakte haar tot een koninkrijk onafhankelijk van het Koninkrijk Aragón.</p>\n<p>Het Koninkrijk Valencia ontving «Los Fueros», waarmee het koninkrijk een eigen politieke en juridische identiteit kreeg.</p><p>Het einde van de regionale autonomie kwam met Felipe V in de 18e eeuw.</p>\n<p>In de Successieoorlog steunde het Valenciaanse volk zijn vijand aartshertog Carlos.</p>\n<p>Felipe V schafte na het winnen van de oorlog de Fueros af en voegde Valencia toe aan de nationale regering.</p>\n<p>In 1982 werd Valencia uitgeroepen tot hoofdstad van de Valenciaansche Gemeenschap.</p><p>Valencia, de hoofdstad van de Turia, is momenteel de derde meest bevolkte stad van Spanje. Ze ligt in het oosten van het Iberisch Schiereiland, aan de oever van de Rivier de Turia en wordt omspoeld door de Middellandse Zee, die de regio voorziet van een gematigd klimaat met zachte winters en zo'n 340 zonnige dagen per jaar.</p><p>Wat bevindt zich in de omgeving van de stad?</p><p>Vanuit Valencia vertrekken een groot aantal ingerichte paden voor fiets- en natuurliefhebbers. Op ongeveer tien kilometer ten zuiden van de stad bevindt zich het natuurpark van de <strong>Albufera</strong> van Valencia.</p>\n<p>De <strong>Albufera</strong> is een van de grootste moerassen van Spanje met een oppervlakte van 2100 hectare, waaraan nog 14.000 hectare moerasland moet worden toegevoegd bestemd voor rijstteelt, de belangrijkste teelt van de stad, samen met chufa, sinaasappel, mispel en kaki.</p><p>Zoals u kunt vermoeden, kadert de Valenciaanse gastronomie binnen het mediterrane dieet.</p>\n<p>Wat de Valenciaanse keuken echter kenmerkt, is het gebruik van rijst en het wereldberoemde paradepaardje: de Paella.</p><p>Uitzonderlijk zijn ook de stoofpot van paling, de all-i-pebre, en de heerlijke knoflookaïoli, uitgesproken als all-i-oli.</p><p>Onder het lokale gebak valt de turrón op, bij uitstek het kerstgebak, de arnadí van pompoen, en de beroemde Orxata de Chufa die, gefrappeerd of vloeibaar en vergezeld van de onafscheidelijke «Fartons», de zomermiddagen zal verwennen.</p><p>Nu u al een beetje weet over de geschiedenis en gastronomie van onze streek, is het moment aangebroken om uw avontuur te beginnen. Geniet ervan! Uw avontuur begint in de <strong>Calle de los Serranos</strong>. Vergeet niet dat u, om vooruit te komen in de route, bij elk bezienswaardigheidspunt moet stoppen, de aangegeven plek bekijken of uw uitdaging voltooien, en vervolgens naar de volgende voorgestelde bestemming gaan, enzovoort. Alles klaar om te beginnen? Daar gaan we, succes! Kijk vanuit de <strong>Calle de los Serranos</strong> naar het einde van de straat en zie de torens die op uw kaart zijn aangegeven met nummer <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-nl",
        "title": "Intro",
        "content": "<p>Welkom! Vanuit <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> heten we u van harte welkom. Allereerst willen we u bedanken voor het kiezen van dit avontuur, waarbij u door de tijd reist, van de Romeinse tijd tot het Valencia van de 21e eeuw, een moderne stad vol licht en kleur. <i>Op zoek naar de schat</i> is een buitenactiviteit, zelf-geleid, interactief en educatief, ideaal voor individueel of teamgenot. We moedigen u ook aan om de Valenciaanse cultuur en gastronomie op uw eigen tempo te ontdekken door gewoon op de pauzeknop te drukken.</p><p><i>Op zoek naar de schat</i>, dankzij de beschikbaarheid van de inhoud in meerdere talen, is ook een uitstekend hulpmiddel om een taal te oefenen die u aan het leren bent, of zelfs om u in een nieuwe taal onder te dompelen.</p><p>Onder ons motto «De keuze is en zal altijd de uwe zijn», bieden we de mogelijkheid om op het gewenste tempo vooruit te gaan, pauzes te nemen wanneer nodig of de ervaring zelfs om te vormen tot een vriendschappelijke wedstrijd om te zien wie het avontuur als eerste voltooit. Wanneer u klaar bent, druk op de Start-knop en ga door met het oplossen van onze uitdagingen terwijl u de stad blijft ontdekken. Elke aanwijzing leidt u naar een nieuwe bestemming met nieuwe raadsels die prachtige historische en architectonische schatten van Valencia onthullen.</p><p>Om uw ervaring nog verder te verrijken, moedigt <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> u aan de bezochbare monumenten te betreden als onderdeel van de ervaring van dit Avontuur, zoals musea, markten en vele andere interessante plaatsen, sommige gratis en andere voor een symbolische prijs, hoewel de toegangskaartjes voor de laatste niet inbegrepen zijn bij de aankoop van dit avontuur.</p><p>Als u dat gepast vindt, zouden we graag dit avontuur beginnen met een korte introductie over de Valenciaanse geschiedenis, ligging en gastronomie. Dit zal ons een overzicht geven van de route die ons te wachten staat.</p><p>Vergeet niet dat de tijdslimiet van dit avontuur <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 uur</mark></strong> is vanaf het begin.</p><p>Dit Avontuur dat u gaat beleven begon heel, heel lang geleden. Eeuwen voor de komst van de Romeinen werd de plek waar Valencia nu ligt bezet door de Iberiërs. We spreken over de zesde eeuw voor Christus.</p><p>Dat is heel lang geleden als u er even over nadenkt!</p><p>Verschillende eeuwen later, vanaf het jaar 138 voor Christus, werd de stad doorheen zijn geschiedenis sterk geromaniseerd en ontving de naam «Valentia».</p>\n<p>De latere Islamitische invloed was echter nog groter, meer bepaald van het jaar 711 tot 1238 na onze tijdrekening. Dit maakt een totaal van ongeveer 500 jaar.</p><p>De invloed was zo groot dat de bevolking voornamelijk Islamitisch was. Valencia ontving gedurende deze periode de naam «Balansiya».</p><p>Pas in 1238 veroverde koning Jaime I van Aragón Valencia terug, kerstende de stad en maakte haar tot een koninkrijk onafhankelijk van het Koninkrijk Aragón.</p>\n<p>Het Koninkrijk Valencia ontving «Los Fueros», waarmee het koninkrijk een eigen politieke en juridische identiteit kreeg.</p><p>Het einde van de regionale autonomie kwam met Felipe V in de 18e eeuw.</p>\n<p>In de Successieoorlog steunde het Valenciaanse volk zijn vijand aartshertog Carlos.</p>\n<p>Felipe V schafte na het winnen van de oorlog de Fueros af en voegde Valencia toe aan de nationale regering.</p>\n<p>In 1982 werd Valencia uitgeroepen tot hoofdstad van de Valenciaansche Gemeenschap.</p><p>Valencia, de hoofdstad van de Turia, is momenteel de derde meest bevolkte stad van Spanje. Ze ligt in het oosten van het Iberisch Schiereiland, aan de oever van de Rivier de Turia en wordt omspoeld door de Middellandse Zee, die de regio voorziet van een gematigd klimaat met zachte winters en zo'n 340 zonnige dagen per jaar.</p><p>Wat bevindt zich in de omgeving van de stad?</p><p>Vanuit Valencia vertrekken een groot aantal ingerichte paden voor fiets- en natuurliefhebbers. Op ongeveer tien kilometer ten zuiden van de stad bevindt zich het natuurpark van de <strong>Albufera</strong> van Valencia.</p>\n<p>De <strong>Albufera</strong> is een van de grootste moerassen van Spanje met een oppervlakte van 2100 hectare, waaraan nog 14.000 hectare moerasland moet worden toegevoegd bestemd voor rijstteelt, de belangrijkste teelt van de stad, samen met chufa, sinaasappel, mispel en kaki.</p><p>Zoals u kunt vermoeden, kadert de Valenciaanse gastronomie binnen het mediterrane dieet.</p>\n<p>Wat de Valenciaanse keuken echter kenmerkt, is het gebruik van rijst en het wereldberoemde paradepaardje: de Paella.</p><p>Uitzonderlijk zijn ook de stoofpot van paling, de all-i-pebre, en de heerlijke knoflookaïoli, uitgesproken als all-i-oli.</p><p>Onder het lokale gebak valt de turrón op, bij uitstek het kerstgebak, de arnadí van pompoen, en de beroemde Orxata de Chufa die, gefrappeerd of vloeibaar en vergezeld van de onafscheidelijke «Fartons», de zomermiddagen zal verwennen.</p><p>Nu u al een beetje weet over de geschiedenis en gastronomie van onze streek, is het moment aangebroken om uw avontuur te beginnen. Geniet ervan! Uw avontuur begint in de <strong>Calle de los Serranos</strong>. Vergeet niet dat u, om vooruit te komen in de route, bij elk bezienswaardigheidspunt moet stoppen, de aangegeven plek bekijken of uw uitdaging voltooien, en vervolgens naar de volgende voorgestelde bestemming gaan, enzovoort. Alles klaar om te beginnen? Daar gaan we, succes! Kijk vanuit de <strong>Calle de los Serranos</strong> naar het einde van de straat en zie de torens die op uw kaart zijn aangegeven met nummer <mark>1</mark>.</p>"
      }
    ],
    "ja": [
      {
        "id": "txt-intro-ja",
        "title": "Intro",
        "content": "<p>こんにちは！ようこそ！<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>より心よりお迎えします。まずは、この冒険を選んでいただいたことに感謝申し上げます。ローマ時代から21世紀のバレンシアまで、光と色に満ちた近代都市の時を超えた旅にご招待します。<i>宝探しの旅</i>は屋外での自己ガイド式のインタラクティブかつ教育的な活動で、個人またはチームでお楽しみいただけます。また、バレンシアの文化やグルメをご自分のペースで発見されることをお勧めします。一時停止ボタンを押すだけです。</p><p><i>宝探しの旅</i>は、複数言語でアクセスできるコンテンツのおかげで、学習中の言語を練習する、あるいは新しい言語に浸るための優れたツールでもあります。</p><p>「選択は常にあなたのもの」というモットーのもと、お好みのペースで進み、必要な時に休憩を取り、あるいは誰が先に冒険を完了するかを競う楽しい競争にすることも可能です。適切なタイミングだと感じたら、続けるボタンを押して街を発見しながらチャレンジを解き続けてください。各ヒントが新しい目的地へと導き、バレンシアの歴史的・建築的な素晴らしい宝を明かす新たな謎が待っています。</p><p>さらに体験を豊かにするために、<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>はミュージアム、市場など、その他の興味深いスポット（無料のものも、わずかな入場料が必要なものもありますが、入場料は本冒険の購入には含まれていません）を訪れることをお勧めします。</p><p>ご希望でしたら、バレンシアの歴史、立地、グルメについての簡単な紹介から始めることをお勧めします。これにより、これから待ち受ける旅のルートの概要を把握することができます。</p><p>この冒険の制限時間は開始から<strong><mark style='font-size:1.4em; padding:0 0.15em;'>60時間</mark></strong>です。</p><p>これからご体験いただく冒険は、遠い遠い昔に始まりました。ローマ人の到来より数世紀前の紀元前6世紀、現在のバレンシアの地はイベロ人によって占領されていました。</p><p>考えてみると、ずいぶん昔のことですね！</p><p>その後、紀元前138年からローマ化が急速に進み、「ヴァレンティア」という名前を受け取りました。</p>\n<p>しかし、その後のイスラムの影響はさらに大きく、西暦711年から1238年まで、つまり約500年にわたりました。</p><p>イスラムの影響は非常に大きく、住民の大部分がイスラム教徒となりました。この時代、バレンシアは「バランシヤ」と呼ばれていました。</p><p>1238年になって初めて、アラゴン王ジャウマ1世がバレンシアを再征服し、市をキリスト教化して独立した王国としました。</p>\n<p>バレンシア王国は「フエロス」という固有の政治的・法的アイデンティティを付与されました。</p><p>この地域の自治は18世紀のフェリペ5世の時代に終わりを迎えました。</p>\n<p>スペイン継承戦争でバレンシアの人々は敵対するカルロス大公を支持しました。</p>\n<p>フェリペ5世は戦争に勝利した後、フエロスを廃止し、バレンシアを国家政府に統合しました。</p>\n<p>1982年、バレンシアはバレンシア州の州都に指定されました。</p><p>トゥリアの都バレンシアは現在スペイン第三の都市です。イベリア半島の東部、トゥリア川のほとりに位置し、地中海に面しています。この地中海が地域に穏やかな気候をもたらし、冬は温暖で年間約340日の日照があります。</p><p>市の周辺には何がありますか？</p><p>バレンシアからは、サイクリングや自然愛好家向けに整備された多様なルートが出発します。市の南約10キロには<strong>アルブフェラ</strong>自然公園があります。</p>\n<p><strong>アルブフェラ</strong>はスペイン最大の湿地帯の一つで2,100ヘクタールの面積を持ち、さらに稲作に利用される14,000ヘクタールの湿地が隣接しています。米は市の主要農産物であり、チュファ、オレンジ、びわ、柿とともに重要な作物です。</p><p>バレンシアの料理は地中海食の枠内にあります。</p>\n<p>しかし、バレンシア料理の特徴は米の使用と、世界的に知られる代表的な料理パエリャです。</p><p>また、ウナギのシチュー、アル・イ・ペブレ（にんにくと唐辛子のソース）、おいしいアル・イ・オリ（にんにくマヨネーズ）も絶品です。</p><p>地元の菓子では、クリスマスの定番菓子トゥロン、カボチャのアルナディ、そして液体またはグラニータとして「ファルトンス」とともに楽しむ有名なオルチャータ・デ・チュファがあり、夏の午後のひとときに最高の甘さをお届けします。</p><p>バレンシアの歴史と食文化について少し知っていただいたところで、いよいよ冒険を始めましょう。楽しんでください！冒険は<strong>セラーノス通り</strong>から始まります。ルートを進むには、各見どころで一時停止し、指定の場所を観察するかチャレンジを完了してから、次の目的地へ向かい続けてください。準備はいいですか？さあ行きましょう、頑張ってください！<strong>セラーノス通り</strong>から、通りの突き当たりに目を向け、地図の番号<mark>1</mark>に示された塔を見てください。</p>"
      },
      {
        "id": "txt-intro-ja",
        "title": "Intro",
        "content": "<p>こんにちは！ようこそ！<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>より心よりお迎えします。まずは、この冒険を選んでいただいたことに感謝申し上げます。ローマ時代から21世紀のバレンシアまで、光と色に満ちた近代都市の時を超えた旅にご招待します。<i>宝探しの旅</i>は屋外での自己ガイド式のインタラクティブかつ教育的な活動で、個人またはチームでお楽しみいただけます。また、バレンシアの文化やグルメをご自分のペースで発見されることをお勧めします。一時停止ボタンを押すだけです。</p><p><i>宝探しの旅</i>は、複数言語でアクセスできるコンテンツのおかげで、学習中の言語を練習する、あるいは新しい言語に浸るための優れたツールでもあります。</p><p>「選択は常にあなたのもの」というモットーのもと、お好みのペースで進み、必要な時に休憩を取り、あるいは誰が先に冒険を完了するかを競う楽しい競争にすることも可能です。適切なタイミングだと感じたら、続けるボタンを押して街を発見しながらチャレンジを解き続けてください。各ヒントが新しい目的地へと導き、バレンシアの歴史的・建築的な素晴らしい宝を明かす新たな謎が待っています。</p><p>さらに体験を豊かにするために、<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>はミュージアム、市場など、その他の興味深いスポット（無料のものも、わずかな入場料が必要なものもありますが、入場料は本冒険の購入には含まれていません）を訪れることをお勧めします。</p><p>ご希望でしたら、バレンシアの歴史、立地、グルメについての簡単な紹介から始めることをお勧めします。これにより、これから待ち受ける旅のルートの概要を把握することができます。</p><p>この冒険の制限時間は開始から<strong><mark style='font-size:1.4em; padding:0 0.15em;'>150時間</mark></strong>です。</p><p>これからご体験いただく冒険は、遠い遠い昔に始まりました。ローマ人の到来より数世紀前の紀元前6世紀、現在のバレンシアの地はイベロ人によって占領されていました。</p><p>考えてみると、ずいぶん昔のことですね！</p><p>その後、紀元前138年からローマ化が急速に進み、「ヴァレンティア」という名前を受け取りました。</p>\n<p>しかし、その後のイスラムの影響はさらに大きく、西暦711年から1238年まで、つまり約500年にわたりました。</p><p>イスラムの影響は非常に大きく、住民の大部分がイスラム教徒となりました。この時代、バレンシアは「バランシヤ」と呼ばれていました。</p><p>1238年になって初めて、アラゴン王ジャウマ1世がバレンシアを再征服し、市をキリスト教化して独立した王国としました。</p>\n<p>バレンシア王国は「フエロス」という固有の政治的・法的アイデンティティを付与されました。</p><p>この地域の自治は18世紀のフェリペ5世の時代に終わりを迎えました。</p>\n<p>スペイン継承戦争でバレンシアの人々は敵対するカルロス大公を支持しました。</p>\n<p>フェリペ5世は戦争に勝利した後、フエロスを廃止し、バレンシアを国家政府に統合しました。</p>\n<p>1982年、バレンシアはバレンシア州の州都に指定されました。</p><p>トゥリアの都バレンシアは現在スペイン第三の都市です。イベリア半島の東部、トゥリア川のほとりに位置し、地中海に面しています。この地中海が地域に穏やかな気候をもたらし、冬は温暖で年間約340日の日照があります。</p><p>市の周辺には何がありますか？</p><p>バレンシアからは、サイクリングや自然愛好家向けに整備された多様なルートが出発します。市の南約10キロには<strong>アルブフェラ</strong>自然公園があります。</p>\n<p><strong>アルブフェラ</strong>はスペイン最大の湿地帯の一つで2,100ヘクタールの面積を持ち、さらに稲作に利用される14,000ヘクタールの湿地が隣接しています。米は市の主要農産物であり、チュファ、オレンジ、びわ、柿とともに重要な作物です。</p><p>バレンシアの料理は地中海食の枠内にあります。</p>\n<p>しかし、バレンシア料理の特徴は米の使用と、世界的に知られる代表的な料理パエリャです。</p><p>また、ウナギのシチュー、アル・イ・ペブレ（にんにくと唐辛子のソース）、おいしいアル・イ・オリ（にんにくマヨネーズ）も絶品です。</p><p>地元の菓子では、クリスマスの定番菓子トゥロン、カボチャのアルナディ、そして液体またはグラニータとして「ファルトンス」とともに楽しむ有名なオルチャータ・デ・チュファがあり、夏の午後のひとときに最高の甘さをお届けします。</p><p>バレンシアの歴史と食文化について少し知っていただいたところで、いよいよ冒険を始めましょう。楽しんでください！冒険は<strong>セラーノス通り</strong>から始まります。ルートを進むには、各見どころで一時停止し、指定の場所を観察するかチャレンジを完了してから、次の目的地へ向かい続けてください。準備はいいですか？さあ行きましょう、頑張ってください！<strong>セラーノス通り</strong>から、通りの突き当たりに目を向け、地図の番号<mark>1</mark>に示された塔を見てください。</p>"
      }
    ],
    "de": [
      {
        "id": "txt-intro-de",
        "title": "Intro",
        "content": "<p>Hallo! Guten Tag! Von <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> heißen wir Sie herzlich willkommen. Zunächst möchten wir Ihnen für die Wahl dieses Abenteuers danken, auf dem Sie sich durch die Zeit bewegen werden, von der Römerzeit bis zum Valencia des 21. Jh., einer modernen Stadt voller Licht und Farbe. <i>Auf Schatzsuche</i> ist eine Outdoor-Aktivität, selbst geführt, interaktiv und lehrreich, ideal für Einzel- oder Teamerlebnisse. Wir möchten Sie auch ermutigen, die valencianische Kultur und Gastronomie in Ihrem eigenen Tempo zu entdecken, indem Sie einfach die Pause-Taste drücken.</p><p><i>Auf Schatzsuche</i>, dank seiner in mehreren Sprachen zugänglichen Inhalte, ist außerdem ein hervorragendes Werkzeug, um eine Sprache zu üben, die Sie gerade lernen, oder sich sogar in eine neue einzutauchen.</p><p>Unter unserem Motto „Die Wahl ist und bleibt stets Ihre\" bieten wir die Möglichkeit, in dem von Ihnen bevorzugten Tempo voranzuschreiten, Pausen einzulegen, wann immer Sie es brauchen, oder das Erlebnis sogar in einen freundschaftlichen Wettkampf zu verwandeln, um zu sehen, wer das Abenteuer zuerst beendet. Sobald Sie entscheiden, dass es der richtige Moment ist, drücken Sie die Start-Taste und lösen Sie weiterhin unsere Aufgaben, während Sie die Stadt weiter entdecken. Jeder Hinweis führt Sie zu einem neuen Ziel mit neuen Rätseln, die herrliche historische und architektonische Schätze Valencias enthüllen werden.</p><p>Um Ihre Erfahrung noch zu bereichern, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> lädt Sie ein, die besuchbaren Denkmäler als Teil der Erfahrung dieses Abenteuers zu betreten, wie Museen, Märkte und viele andere interessante Orte, einige kostenlos und andere zu einem symbolischen Preis, obwohl die Eintritte zu letzteren nicht im Erwerb dieses Abenteuers enthalten sind.</p><p>Wenn es Ihnen recht ist, würden wir dieses Abenteuer gerne mit einer kurzen Einführung in die Geschichte, Lage und Gastronomie Valencias beginnen. So erhalten wir einen Überblick über den Rundgang, der uns erwartet.</p><p>Denken Sie daran, dass dieses Abenteuer <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 Stunden</mark></strong> nach seinem Beginn endet.</p><p>Das Abenteuer, das Sie gleich erleben werden, begann vor langer, langer Zeit. Jahrhunderte vor der Ankunft der Römer wurde das Gebiet, in dem sich Valencia heute befindet, von den Iberern bewohnt. Wir sprechen vom sechsten Jahrhundert vor Christus.</p><p>Das ist sehr lange her, wenn man es bedenkt!</p><p>Einige Jahrhunderte später, ab dem Jahr 138 v. Chr., wurde es im Verlauf seiner Geschichte intensiv romanisiert und erhielt den Namen \"Valentia\".</p>\n<p>Der nachfolgende muslimische Einfluss war jedoch noch größer, konkret von 711 bis 1238 n. Chr. Das macht insgesamt etwa 500 Jahre.</p><p>So groß war der Einfluss, dass die Bevölkerung überwiegend muslimisch war. Valencia erhielt in dieser Zeit den Namen \"Balansiya\".</p><p>Erst 1238 reconquistierte König Jakob I. von Aragonien Valencia, christianisierte die Stadt und machte sie zu einem unabhängigen Königreich des Königreichs Aragonien.</p>\n<p>Dem Königreich Valencia wurden \"Los Fueros\" überreicht, die dem Königreich eine eigene politische und rechtliche Identität verliehen.</p><p>Das Ende der Autonomie der Region kam mit Philipp V. im 18. Jh.</p>\n<p>Im Spanischen Erbfolgekrieg unterstützte das valencianische Volk seinen Feind, den Erzherzog Karl.</p>\n<p>Philipp V. schaffte nach seinem Sieg im Krieg die Fueros ab und gliederte Valencia in die nationale Regierung ein.</p>\n<p>1982 wurde Valencia zur Hauptstadt der Valencianischen Gemeinschaft ernannt.</p><p>Valencia, die Hauptstadt am Turia, ist derzeit die drittgrößte Stadt Spaniens. Sie liegt im Osten der Iberischen Halbinsel, am Ufer des Flusses Turia und wird vom Mittelmeer umspült, das der Region ein gemäßigtes Klima mit milden Wintern und etwa 340 Sonnentagen im Jahr beschert.</p><p>Was gibt es in der Umgebung der Stadt?</p><p>Von Valencia aus führen zahlreiche Routen für Radfahrer und Naturliebhaber. Etwa zehn Kilometer südlich der Stadt befindet sich der Naturpark <strong>Albufera</strong> von Valencia.</p>\n<p>Die <strong>Albufera</strong> ist eines der größten Feuchtgebiete Spaniens mit einer Fläche von 2.100 Hektar, zu der noch 14.000 Hektar Sumpfland hinzukommen, das dem Reisanbau gewidmet ist, der neben Chufa, Orange, Mispel und Kaki die Hauptkultur der Stadt ist.</p><p>Wie Sie sich vorstellen können, ist die valencianische Gastronomie Teil der mediterranen Küche.</p>\n<p>Was die valencianische Küche jedoch auszeichnet, ist der Einsatz von Reis und ihr weltbekanntes Vorzeigerezept, die Paella.</p><p>Außergewöhnlich sind auch der Aalgulasch, das All-i-Pebre und das köstliche Knoblauch-Öl-Alioli, auf Valencianisch All-i-Oli ausgesprochen.</p><p>Unter dem einheimischen Gebäck sticht der Turrón hervor, das Weihnachtssüßgebäck schlechthin, der Arnadí de Calabaza und die berühmte Orxata de Chufa, die als Granizé oder flüssig zusammen mit den untrennbaren \"Fartons\" die Sommernachmittage versüßen.</p><p>Jetzt, da Sie ein wenig über die Geschichte und die Gastronomie unseres Landes wissen, ist es an der Zeit, Ihr Abenteuer zu beginnen. Viel Spaß! Ihr Abenteuer beginnt in der <strong>Calle de los Serranos</strong>. Denken Sie daran, dass Sie an jedem Interessenspunkt pausieren, den angegebenen Ort beobachten oder Ihre Aufgabe erfüllen und dann zum nächsten vorgeschlagenen Ziel weiterfahren müssen, und so weiter. Alles bereit? Auf geht's, viel Erfolg! Schauen Sie von der <strong>Calle de los Serranos</strong> auf das Ende der Straße und sehen Sie die Torres, die auf Ihrer Karte mit der Nummer <mark>1</mark> markiert sind.</p>"
      },
      {
        "id": "txt-intro-de",
        "title": "Intro",
        "content": "<p>Hallo! Guten Tag! Von <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> heißen wir Sie herzlich willkommen. Zunächst möchten wir Ihnen für die Wahl dieses Abenteuers danken, auf dem Sie sich durch die Zeit bewegen werden, von der Römerzeit bis zum Valencia des 21. Jh., einer modernen Stadt voller Licht und Farbe. <i>Auf Schatzsuche</i> ist eine Outdoor-Aktivität, selbst geführt, interaktiv und lehrreich, ideal für Einzel- oder Teamerlebnisse. Wir möchten Sie auch ermutigen, die valencianische Kultur und Gastronomie in Ihrem eigenen Tempo zu entdecken, indem Sie einfach die Pause-Taste drücken.</p><p><i>Auf Schatzsuche</i>, dank seiner in mehreren Sprachen zugänglichen Inhalte, ist außerdem ein hervorragendes Werkzeug, um eine Sprache zu üben, die Sie gerade lernen, oder sich sogar in eine neue einzutauchen.</p><p>Unter unserem Motto „Die Wahl ist und bleibt stets Ihre\" bieten wir die Möglichkeit, in dem von Ihnen bevorzugten Tempo voranzuschreiten, Pausen einzulegen, wann immer Sie es brauchen, oder das Erlebnis sogar in einen freundschaftlichen Wettkampf zu verwandeln, um zu sehen, wer das Abenteuer zuerst beendet. Sobald Sie entscheiden, dass es der richtige Moment ist, drücken Sie die Start-Taste und lösen Sie weiterhin unsere Aufgaben, während Sie die Stadt weiter entdecken. Jeder Hinweis führt Sie zu einem neuen Ziel mit neuen Rätseln, die herrliche historische und architektonische Schätze Valencias enthüllen werden.</p><p>Um Ihre Erfahrung noch zu bereichern, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> lädt Sie ein, die besuchbaren Denkmäler als Teil der Erfahrung dieses Abenteuers zu betreten, wie Museen, Märkte und viele andere interessante Orte, einige kostenlos und andere zu einem symbolischen Preis, obwohl die Eintritte zu letzteren nicht im Erwerb dieses Abenteuers enthalten sind.</p><p>Wenn es Ihnen recht ist, würden wir dieses Abenteuer gerne mit einer kurzen Einführung in die Geschichte, Lage und Gastronomie Valencias beginnen. So erhalten wir einen Überblick über den Rundgang, der uns erwartet.</p><p>Denken Sie daran, dass dieses Abenteuer <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 Stunden</mark></strong> nach seinem Beginn endet.</p><p>Das Abenteuer, das Sie gleich erleben werden, begann vor langer, langer Zeit. Jahrhunderte vor der Ankunft der Römer wurde das Gebiet, in dem sich Valencia heute befindet, von den Iberern bewohnt. Wir sprechen vom sechsten Jahrhundert vor Christus.</p><p>Das ist sehr lange her, wenn man es bedenkt!</p><p>Einige Jahrhunderte später, ab dem Jahr 138 v. Chr., wurde es im Verlauf seiner Geschichte intensiv romanisiert und erhielt den Namen \"Valentia\".</p>\n<p>Der nachfolgende muslimische Einfluss war jedoch noch größer, konkret von 711 bis 1238 n. Chr. Das macht insgesamt etwa 500 Jahre.</p><p>So groß war der Einfluss, dass die Bevölkerung überwiegend muslimisch war. Valencia erhielt in dieser Zeit den Namen \"Balansiya\".</p><p>Erst 1238 reconquistierte König Jakob I. von Aragonien Valencia, christianisierte die Stadt und machte sie zu einem unabhängigen Königreich des Königreichs Aragonien.</p>\n<p>Dem Königreich Valencia wurden \"Los Fueros\" überreicht, die dem Königreich eine eigene politische und rechtliche Identität verliehen.</p><p>Das Ende der Autonomie der Region kam mit Philipp V. im 18. Jh.</p>\n<p>Im Spanischen Erbfolgekrieg unterstützte das valencianische Volk seinen Feind, den Erzherzog Karl.</p>\n<p>Philipp V. schaffte nach seinem Sieg im Krieg die Fueros ab und gliederte Valencia in die nationale Regierung ein.</p>\n<p>1982 wurde Valencia zur Hauptstadt der Valencianischen Gemeinschaft ernannt.</p><p>Valencia, die Hauptstadt am Turia, ist derzeit die drittgrößte Stadt Spaniens. Sie liegt im Osten der Iberischen Halbinsel, am Ufer des Flusses Turia und wird vom Mittelmeer umspült, das der Region ein gemäßigtes Klima mit milden Wintern und etwa 340 Sonnentagen im Jahr beschert.</p><p>Was gibt es in der Umgebung der Stadt?</p><p>Von Valencia aus führen zahlreiche Routen für Radfahrer und Naturliebhaber. Etwa zehn Kilometer südlich der Stadt befindet sich der Naturpark <strong>Albufera</strong> von Valencia.</p>\n<p>Die <strong>Albufera</strong> ist eines der größten Feuchtgebiete Spaniens mit einer Fläche von 2.100 Hektar, zu der noch 14.000 Hektar Sumpfland hinzukommen, das dem Reisanbau gewidmet ist, der neben Chufa, Orange, Mispel und Kaki die Hauptkultur der Stadt ist.</p><p>Wie Sie sich vorstellen können, ist die valencianische Gastronomie Teil der mediterranen Küche.</p>\n<p>Was die valencianische Küche jedoch auszeichnet, ist der Einsatz von Reis und ihr weltbekanntes Vorzeigerezept, die Paella.</p><p>Außergewöhnlich sind auch der Aalgulasch, das All-i-Pebre und das köstliche Knoblauch-Öl-Alioli, auf Valencianisch All-i-Oli ausgesprochen.</p><p>Unter dem einheimischen Gebäck sticht der Turrón hervor, das Weihnachtssüßgebäck schlechthin, der Arnadí de Calabaza und die berühmte Orxata de Chufa, die als Granizé oder flüssig zusammen mit den untrennbaren \"Fartons\" die Sommernachmittage versüßen.</p><p>Jetzt, da Sie ein wenig über die Geschichte und die Gastronomie unseres Landes wissen, ist es an der Zeit, Ihr Abenteuer zu beginnen. Viel Spaß! Ihr Abenteuer beginnt in der <strong>Calle de los Serranos</strong>. Denken Sie daran, dass Sie an jedem Interessenspunkt pausieren, den angegebenen Ort beobachten oder Ihre Aufgabe erfüllen und dann zum nächsten vorgeschlagenen Ziel weiterfahren müssen, und so weiter. Alles bereit? Auf geht's, viel Erfolg! Schauen Sie von der <strong>Calle de los Serranos</strong> auf das Ende der Straße und sehen Sie die Torres, die auf Ihrer Karte mit der Nummer <mark>1</mark> markiert sind.</p>"
      }
    ],
    "zh": [
      {
        "id": "txt-intro-zh",
        "title": "Intro",
        "content": "<p>您好！欢迎！我们是<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>，热烈欢迎您的到来。首先，感谢您选择这次冒险，在其中您将穿越时光，从罗马时代一直到21世纪的瓦伦西亚——这座现代、充满光彩与色彩的城市。<i>寻找宝藏</i>是一项户外、自导览、互动性和教育性的活动，非常适合个人或团队享受。我们也鼓励您按照自己的节奏，只需按下暂停键，去探索瓦伦西亚的文化和美食。</p><p><i>寻找宝藏</i>，凭借其多语言内容，也是练习您正在学习的语言，甚至沉浸于一门新语言的绝佳工具。</p><p>秉承我们的口号\"选择始终是您的\"，我们提供按您喜欢的节奏前进的可能性，在需要时暂停，甚至将体验转化为友好竞争，看谁先完成冒险。当您准备好时，请按下开始按钮，继续完成我们的挑战，同时继续探索城市。每条线索将带您前往新的目的地，揭示瓦伦西亚宏伟历史和建筑宝藏的新谜题。</p><p>为了进一步丰富您的体验，<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> 鼓励您进入可参观的纪念碑，作为此次冒险体验的一部分，如博物馆、市场和许多其他有趣场所，其中一些免费，另一些收取象征性费用，但后者的门票费用不含在此次冒险购买中。</p><p>如果您觉得合适，我们很乐意以对瓦伦西亚历史、地理位置和美食的简短介绍来开始这次冒险。这将帮助我们对即将进行的路线有一个整体了解。</p><p>请记住，此次冒险的时限为开始后<strong><mark style='font-size:1.4em; padding:0 0.15em;'>60小时</mark></strong>。</p><p>您即将体验的这次冒险开始于很久、很久以前。在罗马人到来的几个世纪前，现今瓦伦西亚所在之处曾被伊比利亚人占据。我们说的是公元前6世纪。</p><p>想想看，那真的是很久以前了！</p><p>几个世纪后，从公元前138年起，该地经历了强烈的罗马化，被命名为\"Valentia\"。</p>\n<p>然而，随后的穆斯林影响甚至更为深远，具体来说是从公元711年至1238年。共计约500年。</p><p>这种影响如此之深，以至于人口基本上是穆斯林。在这段时期，瓦伦西亚得名\"Balansiya\"。</p><p>直到1238年，阿拉贡国王海梅一世才光复瓦伦西亚，将城市基督教化并将其建立为独立于阿拉贡王国的王国。</p>\n<p>瓦伦西亚王国获得了\"Los Fueros\"（地方法令），赋予王国独特的政治和法律身份。</p><p>该地区的自治终结于18世纪的费利佩五世时期。</p>\n<p>在王位继承战争中，瓦伦西亚人民支持了其敌人卡洛斯大公。</p>\n<p>费利佩五世赢得战争后，废除了地方法令，将瓦伦西亚并入国家政府。</p>\n<p>1982年，瓦伦西亚被命名为瓦伦西亚自治区首府。</p><p>瓦伦西亚，图里亚之都，是西班牙目前人口第三多的城市。它位于伊比利亚半岛东部，图里亚河畔，濒临地中海，地中海为该地区带来了温和的气候，冬季温暖，一年约有340个晴天。</p><p>城市周边有什么？</p><p>从瓦伦西亚出发，有多种供骑行和自然爱好者使用的专用小径。在城市以南约十公里处，是瓦伦西亚的<strong>Albufera</strong>自然公园。</p>\n<p><strong>Albufera</strong>是西班牙最大的湿地之一，面积2100公顷，还需加上14,000公顷专门用于水稻种植的沼泽地，水稻是该城市的主要农作物，此外还有莎草、橙子、枇杷和柿子。</p><p>正如您可以想象的，瓦伦西亚美食属于地中海饮食范畴。</p>\n<p>然而，瓦伦西亚烹饪的特色在于使用大米以及其享誉全球的明星菜肴——海鲜饭（Paella）。</p><p>此外，当地的炖鳗鱼、all-i-pebre和美味的蒜泥蛋黄酱（发音为all-i-oli）同样出色。</p><p>在当地糕点中，牛轧糖（圣诞节甜点的代表）、南瓜糕和著名的莎草汁（Orxata de Chufa）格外出众，无论是冰镇的还是液态的，配上其形影不离的\"Fartons\"，都是夏日午后的美味享受。</p><p>现在您对我们故乡的历史和美食有了一定了解，是时候开始您的冒险了。好好享受吧！您的冒险从<strong>Calle de los Serranos</strong>开始。请记住，要在路线中前进，您需要在每个兴趣点暂停，观察所指示的地点或完成挑战，然后继续前往下一个建议目的地，依此类推。准备好了吗？我们出发，祝您好运！从<strong>Calle de los Serranos</strong>出发，请看街道尽头地图编号<mark>1</mark>的塔楼。</p>"
      },
      {
        "id": "txt-intro-zh",
        "title": "Intro",
        "content": "<p>您好！欢迎！我们是<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>，热烈欢迎您的到来。首先，感谢您选择这次冒险，在其中您将穿越时光，从罗马时代一直到21世纪的瓦伦西亚——这座现代、充满光彩与色彩的城市。<i>寻找宝藏</i>是一项户外、自导览、互动性和教育性的活动，非常适合个人或团队享受。我们也鼓励您按照自己的节奏，只需按下暂停键，去探索瓦伦西亚的文化和美食。</p><p><i>寻找宝藏</i>，凭借其多语言内容，也是练习您正在学习的语言，甚至沉浸于一门新语言的绝佳工具。</p><p>秉承我们的口号\"选择始终是您的\"，我们提供按您喜欢的节奏前进的可能性，在需要时暂停，甚至将体验转化为友好竞争，看谁先完成冒险。当您准备好时，请按下开始按钮，继续完成我们的挑战，同时继续探索城市。每条线索将带您前往新的目的地，揭示瓦伦西亚宏伟历史和建筑宝藏的新谜题。</p><p>为了进一步丰富您的体验，<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> 鼓励您进入可参观的纪念碑，作为此次冒险体验的一部分，如博物馆、市场和许多其他有趣场所，其中一些免费，另一些收取象征性费用，但后者的门票费用不含在此次冒险购买中。</p><p>如果您觉得合适，我们很乐意以对瓦伦西亚历史、地理位置和美食的简短介绍来开始这次冒险。这将帮助我们对即将进行的路线有一个整体了解。</p><p>请记住，此次冒险的时限为开始后<strong><mark style='font-size:1.4em; padding:0 0.15em;'>150小时</mark></strong>。</p><p>您即将体验的这次冒险开始于很久、很久以前。在罗马人到来的几个世纪前，现今瓦伦西亚所在之处曾被伊比利亚人占据。我们说的是公元前6世纪。</p><p>想想看，那真的是很久以前了！</p><p>几个世纪后，从公元前138年起，该地经历了强烈的罗马化，被命名为\"Valentia\"。</p>\n<p>然而，随后的穆斯林影响甚至更为深远，具体来说是从公元711年至1238年。共计约500年。</p><p>这种影响如此之深，以至于人口基本上是穆斯林。在这段时期，瓦伦西亚得名\"Balansiya\"。</p><p>直到1238年，阿拉贡国王海梅一世才光复瓦伦西亚，将城市基督教化并将其建立为独立于阿拉贡王国的王国。</p>\n<p>瓦伦西亚王国获得了\"Los Fueros\"（地方法令），赋予王国独特的政治和法律身份。</p><p>该地区的自治终结于18世纪的费利佩五世时期。</p>\n<p>在王位继承战争中，瓦伦西亚人民支持了其敌人卡洛斯大公。</p>\n<p>费利佩五世赢得战争后，废除了地方法令，将瓦伦西亚并入国家政府。</p>\n<p>1982年，瓦伦西亚被命名为瓦伦西亚自治区首府。</p><p>瓦伦西亚，图里亚之都，是西班牙目前人口第三多的城市。它位于伊比利亚半岛东部，图里亚河畔，濒临地中海，地中海为该地区带来了温和的气候，冬季温暖，一年约有340个晴天。</p><p>城市周边有什么？</p><p>从瓦伦西亚出发，有多种供骑行和自然爱好者使用的专用小径。在城市以南约十公里处，是瓦伦西亚的<strong>Albufera</strong>自然公园。</p>\n<p><strong>Albufera</strong>是西班牙最大的湿地之一，面积2100公顷，还需加上14,000公顷专门用于水稻种植的沼泽地，水稻是该城市的主要农作物，此外还有莎草、橙子、枇杷和柿子。</p><p>正如您可以想象的，瓦伦西亚美食属于地中海饮食范畴。</p>\n<p>然而，瓦伦西亚烹饪的特色在于使用大米以及其享誉全球的明星菜肴——海鲜饭（Paella）。</p><p>此外，当地的炖鳗鱼、all-i-pebre和美味的蒜泥蛋黄酱（发音为all-i-oli）同样出色。</p><p>在当地糕点中，牛轧糖（圣诞节甜点的代表）、南瓜糕和著名的莎草汁（Orxata de Chufa）格外出众，无论是冰镇的还是液态的，配上其形影不离的\"Fartons\"，都是夏日午后的美味享受。</p><p>现在您对我们故乡的历史和美食有了一定了解，是时候开始您的冒险了。好好享受吧！您的冒险从<strong>Calle de los Serranos</strong>开始。请记住，要在路线中前进，您需要在每个兴趣点暂停，观察所指示的地点或完成挑战，然后继续前往下一个建议目的地，依此类推。准备好了吗？我们出发，祝您好运！从<strong>Calle de los Serranos</strong>出发，请看街道尽头地图编号<mark>1</mark>的塔楼。</p>"
      }
    ],
    "pl": [
      {
        "id": "txt-intro-pl",
        "title": "Intro",
        "content": "<p>Witaj! Dzień dobry! Z <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> witamy Cię. Przede wszystkim chcemy podziękować za wybranie tej przygody, podczas której wyruszysz przez czas, od epoki rzymskiej po Walencję XXI w., nowoczesne miasto pełne światła i kolorów. <i>W poszukiwaniu skarbu</i> to aktywność na świeżym powietrzu, samoobsługowa, interaktywna i dydaktyczna, idealna do wspólnej zabawy lub rywalizacji w zespole. Zachęcamy też do odkrywania kultury i gastronomii walencjańskiej we własnym tempie, po prostu naciskając przycisk pauzy.</p><p><i>W poszukiwaniu skarbu</i>, dzięki treściom dostępnym w wielu językach, jest ponadto doskonałym narzędziem do ćwiczenia języka, którego się uczysz, a nawet do zanurzenia się w nowym.</p><p>W myśl naszego hasła \"Wybór należy i zawsze będzie należał do Ciebie\", oferujemy możliwość postępowania we własnym tempie, robienia przerw gdy jest to potrzebne, a nawet zamienienia doświadczenia w przyjazne zawody, kto pierwszy ukończy przygodę. Gdy uznasz, że nadszedł odpowiedni moment, naciśnij przycisk Start i kontynuuj spełniając nasze zadania podczas odkrywania miasta. Każda wskazówka zaprowadzi Cię do nowego miejsca z nowymi zagadkami, które odsłonią wspaniałe historyczne i architektoniczne skarby Walencji.</p><p>Aby jeszcze bardziej wzbogacić swoje doświadczenie, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> zachęca do wchodzenia do zwiedzanych pomników jako część doświadczenia tej Przygody, takich jak muzea, targi i wiele innych ciekawych miejsc, niektóre bezpłatne, inne z symboliczną opłatą, choć bilety do tych ostatnich nie są wliczone w zakup tej przygody.</p><p>Jeśli wydaje Ci się to właściwe, z przyjemnością rozpoczniemy tę przygodę od krótkiego wprowadzenia do historii, położenia i gastronomii walencjańskiej. Pozwoli nam to uzyskać ogólny zarys trasy, która nas czeka.</p><p>Pamiętaj, że limit tej przygody wynosi <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 godzin</mark></strong> od jej rozpoczęcia.</p><p>Ta Przygoda, którą zamierzasz przeżyć, zaczęła się dawno, dawno temu. Wieki przed przybyciem Rzymian, miejsce, w którym teraz znajduje się Walencja, było zamieszkane przez Iberów. Mówimy o VI w. przed Chrystusem.</p><p>To naprawdę dawno temu, jeśli o tym pomyśleć!</p><p>Kilka wieków później, od roku 138 przed Chrystusem i przez całą swoją historię, miasto było intensywnie romanizowane, otrzymując nazwę \"Valentia\".</p>\n<p>Jednakże późniejszy wpływ muzułmański był jeszcze większy; konkretnie, od roku 711 do 1238 po naszej erze. Co daje łącznie około 500 lat.</p><p>Tak duży był wpływ, że ludność była zasadniczo muzułmańska. W tym czasie Walencja nosiła nazwę \"Balansiya\".</p><p>Dopiero w 1238 roku Król Jakub Pierwszy Aragoński odzyskał Walencję, chrystianizując miasto i czyniąc z niej niezależne królestwo od Królestwa Aragonii.</p>\n<p>Królestwu Walencji zostały przekazane \"Los Fueros\", nadając królestwu własną tożsamość polityczną i prawną.</p><p>Koniec autonomii regionu nastąpił za Filipa Piątego w XVIII w.</p>\n<p>W Wojnie Sukcesyjnej lud walencjański popierał swojego wroga, arcyksięcia Karola.</p>\n<p>Filip Piąty po wygraniu wojny, zniósł Fueros i przyłączył Walencję do rządu krajowego.</p>\n<p>W 1982 r. Walencja została mianowana Stolicą Wspólnoty Walencji.</p><p>Walencja, stolica Turii, jest aktualnie trzecim co do liczby ludności miastem Hiszpanii. Położona jest na wschodzie Półwyspu Iberyjskiego, nad rzeką Turia i obmywana przez Morze Śródziemne, które nadaje regionowi łagodny klimat z łagodnymi zimami i około 340 słonecznymi dniami w roku.</p><p>Co jest w okolicach miasta?</p><p>Z Walencji wyruszają różnorodne szlaki przystosowane dla miłośników kolarstwa i przyrody. Około dziesięciu kilometrów na południe od miasta znajduje się park przyrody <strong>Albufera</strong> w Walencji.</p>\n<p><strong>Albufera</strong> to jedno z największych mokradeł Hiszpanii o powierzchni 2100 hektarów, do których należy dodać 14 000 hektarów bagnistych terenów przeznaczonych pod uprawę ryżu, będącą główną uprawą miasta, obok chufy, pomarańczy, niespli i kaki.</p><p>Jak można się domyślić, kuchnia walencjańska wpisuje się w dietę śródziemnomorską.</p>\n<p>Jednakże to, co charakteryzuje kuchnię walencjańską, to użycie ryżu i jej flagowe danie znane na całym świecie — Paella.</p><p>Wyjątkowe są też gulasz z węgorza, all-i-pebre i pyszny ajoaceite, wymawiany all-i-oli.</p><p>Wśród miejscowych słodyczy wyróżnia się turrón, słodycz bożonarodzeniowy par excellence, arnadí de calabaza i słynna Orxata de Chufa, granizowana lub płynna, w towarzystwie nieodłącznych \"Fartons\", urozmaicających letnie popołudnia.</p><p>Teraz, gdy wiesz już trochę o historii i gastronomii naszej ziemi, czas rozpocząć Twoją przygodę. Ciesz się nią! Twoja przygoda zaczyna się na <strong>Calle de los Serranos</strong>. Pamiętaj, że aby posuwać się naprzód w trasie, musisz zatrzymywać się na każdym punkcie zainteresowania, obserwować wskazane miejsce lub ukończyć swoje zadanie, a następnie kontynuować do kolejnego sugerowanego celu i tak kolejno. Wszystko gotowe do rozpoczęcia? Ruszamy, powodzenia! Z <strong>Calle de los Serranos</strong> zwróć uwagę na koniec ulicy i zwizualizuj wieże, wskazane na mapie numerem <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-pl",
        "title": "Intro",
        "content": "<p>Witaj! Dzień dobry! Z <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> witamy Cię. Przede wszystkim chcemy podziękować za wybranie tej przygody, podczas której wyruszysz przez czas, od epoki rzymskiej po Walencję XXI w., nowoczesne miasto pełne światła i kolorów. <i>W poszukiwaniu skarbu</i> to aktywność na świeżym powietrzu, samoobsługowa, interaktywna i dydaktyczna, idealna do wspólnej zabawy lub rywalizacji w zespole. Zachęcamy też do odkrywania kultury i gastronomii walencjańskiej we własnym tempie, po prostu naciskając przycisk pauzy.</p><p><i>W poszukiwaniu skarbu</i>, dzięki treściom dostępnym w wielu językach, jest ponadto doskonałym narzędziem do ćwiczenia języka, którego się uczysz, a nawet do zanurzenia się w nowym.</p><p>W myśl naszego hasła \"Wybór należy i zawsze będzie należał do Ciebie\", oferujemy możliwość postępowania we własnym tempie, robienia przerw gdy jest to potrzebne, a nawet zamienienia doświadczenia w przyjazne zawody, kto pierwszy ukończy przygodę. Gdy uznasz, że nadszedł odpowiedni moment, naciśnij przycisk Start i kontynuuj spełniając nasze zadania podczas odkrywania miasta. Każda wskazówka zaprowadzi Cię do nowego miejsca z nowymi zagadkami, które odsłonią wspaniałe historyczne i architektoniczne skarby Walencji.</p><p>Aby jeszcze bardziej wzbogacić swoje doświadczenie, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> zachęca do wchodzenia do zwiedzanych pomników jako część doświadczenia tej Przygody, takich jak muzea, targi i wiele innych ciekawych miejsc, niektóre bezpłatne, inne z symboliczną opłatą, choć bilety do tych ostatnich nie są wliczone w zakup tej przygody.</p><p>Jeśli wydaje Ci się to właściwe, z przyjemnością rozpoczniemy tę przygodę od krótkiego wprowadzenia do historii, położenia i gastronomii walencjańskiej. Pozwoli nam to uzyskać ogólny zarys trasy, która nas czeka.</p><p>Pamiętaj, że limit tej przygody wynosi <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 godzin</mark></strong> od jej rozpoczęcia.</p><p>Ta Przygoda, którą zamierzasz przeżyć, zaczęła się dawno, dawno temu. Wieki przed przybyciem Rzymian, miejsce, w którym teraz znajduje się Walencja, było zamieszkane przez Iberów. Mówimy o VI w. przed Chrystusem.</p><p>To naprawdę dawno temu, jeśli o tym pomyśleć!</p><p>Kilka wieków później, od roku 138 przed Chrystusem i przez całą swoją historię, miasto było intensywnie romanizowane, otrzymując nazwę \"Valentia\".</p>\n<p>Jednakże późniejszy wpływ muzułmański był jeszcze większy; konkretnie, od roku 711 do 1238 po naszej erze. Co daje łącznie około 500 lat.</p><p>Tak duży był wpływ, że ludność była zasadniczo muzułmańska. W tym czasie Walencja nosiła nazwę \"Balansiya\".</p><p>Dopiero w 1238 roku Król Jakub Pierwszy Aragoński odzyskał Walencję, chrystianizując miasto i czyniąc z niej niezależne królestwo od Królestwa Aragonii.</p>\n<p>Królestwu Walencji zostały przekazane \"Los Fueros\", nadając królestwu własną tożsamość polityczną i prawną.</p><p>Koniec autonomii regionu nastąpił za Filipa Piątego w XVIII w.</p>\n<p>W Wojnie Sukcesyjnej lud walencjański popierał swojego wroga, arcyksięcia Karola.</p>\n<p>Filip Piąty po wygraniu wojny, zniósł Fueros i przyłączył Walencję do rządu krajowego.</p>\n<p>W 1982 r. Walencja została mianowana Stolicą Wspólnoty Walencji.</p><p>Walencja, stolica Turii, jest aktualnie trzecim co do liczby ludności miastem Hiszpanii. Położona jest na wschodzie Półwyspu Iberyjskiego, nad rzeką Turia i obmywana przez Morze Śródziemne, które nadaje regionowi łagodny klimat z łagodnymi zimami i około 340 słonecznymi dniami w roku.</p><p>Co jest w okolicach miasta?</p><p>Z Walencji wyruszają różnorodne szlaki przystosowane dla miłośników kolarstwa i przyrody. Około dziesięciu kilometrów na południe od miasta znajduje się park przyrody <strong>Albufera</strong> w Walencji.</p>\n<p><strong>Albufera</strong> to jedno z największych mokradeł Hiszpanii o powierzchni 2100 hektarów, do których należy dodać 14 000 hektarów bagnistych terenów przeznaczonych pod uprawę ryżu, będącą główną uprawą miasta, obok chufy, pomarańczy, niespli i kaki.</p><p>Jak można się domyślić, kuchnia walencjańska wpisuje się w dietę śródziemnomorską.</p>\n<p>Jednakże to, co charakteryzuje kuchnię walencjańską, to użycie ryżu i jej flagowe danie znane na całym świecie — Paella.</p><p>Wyjątkowe są też gulasz z węgorza, all-i-pebre i pyszny ajoaceite, wymawiany all-i-oli.</p><p>Wśród miejscowych słodyczy wyróżnia się turrón, słodycz bożonarodzeniowy par excellence, arnadí de calabaza i słynna Orxata de Chufa, granizowana lub płynna, w towarzystwie nieodłącznych \"Fartons\", urozmaicających letnie popołudnia.</p><p>Teraz, gdy wiesz już trochę o historii i gastronomii naszej ziemi, czas rozpocząć Twoją przygodę. Ciesz się nią! Twoja przygoda zaczyna się na <strong>Calle de los Serranos</strong>. Pamiętaj, że aby posuwać się naprzód w trasie, musisz zatrzymywać się na każdym punkcie zainteresowania, obserwować wskazane miejsce lub ukończyć swoje zadanie, a następnie kontynuować do kolejnego sugerowanego celu i tak kolejno. Wszystko gotowe do rozpoczęcia? Ruszamy, powodzenia! Z <strong>Calle de los Serranos</strong> zwróć uwagę na koniec ulicy i zwizualizuj wieże, wskazane na mapie numerem <mark>1</mark>.</p>"
      }
    ],
    "pt": [
      {
        "id": "txt-intro-pt",
        "title": "Intro",
        "content": "<p>Olá! Bem-vindos! Desde <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, damos-lhe as boas-vindas. Em primeiro lugar, queremos agradecer-lhe por escolher esta aventura, na qual se embarcará através do tempo, desde a época romana até à Valencia do século XXI, uma cidade moderna, cheia de luz e cor. <i>à procura do tesouro</i> é uma atividade ao ar livre, autoguiada, interativa e didática, ideal para desfrutar de forma individual ou em equipa. Também o encorajamos a descobrir a cultura e gastronomia valenciana ao seu próprio ritmo, simplesmente premindo o botão de pausa.</p><p><i>À procura do tesouro</i>, graças aos seus conteúdos acessíveis em múltiplas línguas, é, além disso, uma excelente ferramenta para praticar um idioma que esteja a aprender, ou mesmo para mergulhar num novo.</p><p>Sob o nosso lema \"A escolha é e será sempre sua\", oferecemos a possibilidade de avançar ao ritmo que prefira, fazer pausas quando precisar ou mesmo transformar a experiência numa competição amigável para ver quem completa a aventura primeiro. Uma vez que decida que é o momento apropriado, prima o botão de Início e continue a completar os nossos desafios enquanto continua a descobrir a cidade. Cada pista levá-lo-á a um novo destino com novas incógnitas que revelarão magníficos tesouros históricos e arquitetónicos de Valencia.</p><p>Para enriquecer ainda mais a sua experiência, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> incita-o a entrar nos monumentos visitáveis como parte da experiência desta Aventura, tais como museus, mercados e muitos outros locais interessantes, alguns gratuitos e outros com um preço simbólico, embora as entradas para estes últimos não estejam incluídas na aquisição desta aventura.</p><p>Se lhe parecer indicado, teremos muito prazer em começar esta aventura com uma breve introdução à história, localização e gastronomia valenciana. Isto permitir-nos-á obter uma visão geral do percurso que nos espera.</p><p>Lembre-se de que o limite desta aventura é de <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 horas</mark></strong> desde o seu início.</p><p>Esta Aventura que vai experienciar começou há muito, muito tempo. Séculos antes da chegada dos romanos, o local onde agora se encontra Valencia foi ocupado pelos íberos. Falamos do século seis antes de Cristo.</p><p>Isso foi há muito tempo se pensar nisso!</p><p>Vários séculos depois, desde o ano 138 antes de Cristo, e ao longo da sua história foi intensamente romanizada, recebendo o nome de \"Valentia\".</p>\n<p>No entanto, a posterior influência muçulmana foi ainda maior, concretamente, desde o ano 711 ao 1238 depois de Cristo. O que perfaz um total de cerca de 500 anos.</p><p>Tal foi a influência que a população era fundamentalmente muçulmana. Valencia, durante este tempo, recebeu o nome de \"Balansiya\".</p><p>Só em 1238 o Rei Jaime Primeiro de Aragão reconquistou Valencia, cristianizando a cidade e convertendo-a num reino independente do reino de Aragão.</p>\n<p>Ao Reino de Valencia foram entregues \"Os Foros\" dotando o reino de uma identidade política e jurídica própria.</p><p>O fim da autonomia da região chegou com Filipe Quinto no séc. XVIII.</p>\n<p>Na Guerra de Sucessão o povo valenciano apoiou o seu inimigo, o arquiduque Carlos.</p>\n<p>Filipe Quinto, após ganhar a guerra, aboliu os Foros e uniu Valencia ao governo nacional.</p>\n<p>Em 1982, Valencia foi nomeada Capital da Comunitat Valenciana.</p><p>Valencia, a capital do Turia, é atualmente a terceira cidade mais populosa de Espanha. Está situada a este da Península Ibérica, à margem do Rio Turia e banhada pelo Mar Mediterrâneo, o qual dota a região de um clima temperado com invernos suaves e cerca de 340 dias de sol por ano.</p><p>O que há nas redondezas da cidade?</p><p>De Valencia partem uma grande variedade de trilhos preparados para os amantes do ciclismo e da natureza. A uns dez quilómetros a sul da cidade encontra-se o parque natural da <strong>Albufera</strong> de Valencia.</p>\n<p>A <strong>Albufera</strong> é uma das zonas húmidas mais grandes de Espanha com uma superfície de 2100 hectares, às quais se devem acrescentar 14.000 hectares de marisma dedicadas ao cultivo de arroz, que é o principal cultivo da cidade, junto com a chufa, a laranja, a nêspera e o caqui.</p><p>Como pode supor, a gastronomia valenciana enquadra-se na dieta mediterrânica.</p>\n<p>No entanto, o que caracteriza a cozinha valenciana é o uso do arroz e o seu prato estrela mundialmente conhecido, a Paella.</p><p>Também são excecionais o seu guisado de enguia, o all-i-pebre e o riquíssimo ajoaceite pronunciado all-i-oli.</p><p>Entre a confeitaria local destaca o turrón, doce natalício por excelência, o arnadí de abóbora e a famosa Orxata de Chufa que granizada ou líquida e acompanhada dos seus inseparáveis \"Fartons\", farão as delícias das tardes de verão.</p><p>Agora que já conhece um pouco sobre a história e a gastronomia da nossa terra, é momento de começar a sua aventura. Desfrute-a! A sua aventura começa na <strong>Calle de los Serranos</strong>. Lembre-se de que, para avançar no percurso, deverá pausar em cada ponto de interesse, observar o local indicado ou completar o seu desafio, e depois continuar para o próximo destino sugerido e assim consecutivamente. Tudo pronto para começar? Lá vamos, boa sorte! Desde a <strong>Calle de los Serranos</strong>, observe o final da via e visualize as torres que no seu mapa ficam indicadas com o número <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-pt",
        "title": "Intro",
        "content": "<p>Olá! Bem-vindos! Desde <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, damos-lhe as boas-vindas. Em primeiro lugar, queremos agradecer-lhe por escolher esta aventura, na qual se embarcará através do tempo, desde a época romana até à Valencia do século XXI, uma cidade moderna, cheia de luz e cor. <i>à procura do tesouro</i> é uma atividade ao ar livre, autoguiada, interativa e didática, ideal para desfrutar de forma individual ou em equipa. Também o encorajamos a descobrir a cultura e gastronomia valenciana ao seu próprio ritmo, simplesmente premindo o botão de pausa.</p><p><i>À procura do tesouro</i>, graças aos seus conteúdos acessíveis em múltiplas línguas, é, além disso, uma excelente ferramenta para praticar um idioma que esteja a aprender, ou mesmo para mergulhar num novo.</p><p>Sob o nosso lema \"A escolha é e será sempre sua\", oferecemos a possibilidade de avançar ao ritmo que prefira, fazer pausas quando precisar ou mesmo transformar a experiência numa competição amigável para ver quem completa a aventura primeiro. Uma vez que decida que é o momento apropriado, prima o botão de Início e continue a completar os nossos desafios enquanto continua a descobrir a cidade. Cada pista levá-lo-á a um novo destino com novas incógnitas que revelarão magníficos tesouros históricos e arquitetónicos de Valencia.</p><p>Para enriquecer ainda mais a sua experiência, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> incita-o a entrar nos monumentos visitáveis como parte da experiência desta Aventura, tais como museus, mercados e muitos outros locais interessantes, alguns gratuitos e outros com um preço simbólico, embora as entradas para estes últimos não estejam incluídas na aquisição desta aventura.</p><p>Se lhe parecer indicado, teremos muito prazer em começar esta aventura com uma breve introdução à história, localização e gastronomia valenciana. Isto permitir-nos-á obter uma visão geral do percurso que nos espera.</p><p>Lembre-se de que o limite desta aventura é de <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 horas</mark></strong> desde o seu início.</p><p>Esta Aventura que vai experienciar começou há muito, muito tempo. Séculos antes da chegada dos romanos, o local onde agora se encontra Valencia foi ocupado pelos íberos. Falamos do século seis antes de Cristo.</p><p>Isso foi há muito tempo se pensar nisso!</p><p>Vários séculos depois, desde o ano 138 antes de Cristo, e ao longo da sua história foi intensamente romanizada, recebendo o nome de \"Valentia\".</p>\n<p>No entanto, a posterior influência muçulmana foi ainda maior, concretamente, desde o ano 711 ao 1238 depois de Cristo. O que perfaz um total de cerca de 500 anos.</p><p>Tal foi a influência que a população era fundamentalmente muçulmana. Valencia, durante este tempo, recebeu o nome de \"Balansiya\".</p><p>Só em 1238 o Rei Jaime Primeiro de Aragão reconquistou Valencia, cristianizando a cidade e convertendo-a num reino independente do reino de Aragão.</p>\n<p>Ao Reino de Valencia foram entregues \"Os Foros\" dotando o reino de uma identidade política e jurídica própria.</p><p>O fim da autonomia da região chegou com Filipe Quinto no séc. XVIII.</p>\n<p>Na Guerra de Sucessão o povo valenciano apoiou o seu inimigo, o arquiduque Carlos.</p>\n<p>Filipe Quinto, após ganhar a guerra, aboliu os Foros e uniu Valencia ao governo nacional.</p>\n<p>Em 1982, Valencia foi nomeada Capital da Comunitat Valenciana.</p><p>Valencia, a capital do Turia, é atualmente a terceira cidade mais populosa de Espanha. Está situada a este da Península Ibérica, à margem do Rio Turia e banhada pelo Mar Mediterrâneo, o qual dota a região de um clima temperado com invernos suaves e cerca de 340 dias de sol por ano.</p><p>O que há nas redondezas da cidade?</p><p>De Valencia partem uma grande variedade de trilhos preparados para os amantes do ciclismo e da natureza. A uns dez quilómetros a sul da cidade encontra-se o parque natural da <strong>Albufera</strong> de Valencia.</p>\n<p>A <strong>Albufera</strong> é uma das zonas húmidas mais grandes de Espanha com uma superfície de 2100 hectares, às quais se devem acrescentar 14.000 hectares de marisma dedicadas ao cultivo de arroz, que é o principal cultivo da cidade, junto com a chufa, a laranja, a nêspera e o caqui.</p><p>Como pode supor, a gastronomia valenciana enquadra-se na dieta mediterrânica.</p>\n<p>No entanto, o que caracteriza a cozinha valenciana é o uso do arroz e o seu prato estrela mundialmente conhecido, a Paella.</p><p>Também são excecionais o seu guisado de enguia, o all-i-pebre e o riquíssimo ajoaceite pronunciado all-i-oli.</p><p>Entre a confeitaria local destaca o turrón, doce natalício por excelência, o arnadí de abóbora e a famosa Orxata de Chufa que granizada ou líquida e acompanhada dos seus inseparáveis \"Fartons\", farão as delícias das tardes de verão.</p><p>Agora que já conhece um pouco sobre a história e a gastronomia da nossa terra, é momento de começar a sua aventura. Desfrute-a! A sua aventura começa na <strong>Calle de los Serranos</strong>. Lembre-se de que, para avançar no percurso, deverá pausar em cada ponto de interesse, observar o local indicado ou completar o seu desafio, e depois continuar para o próximo destino sugerido e assim consecutivamente. Tudo pronto para começar? Lá vamos, boa sorte! Desde a <strong>Calle de los Serranos</strong>, observe o final da via e visualize as torres que no seu mapa ficam indicadas com o número <mark>1</mark>.</p>"
      }
    ],
    "ru": [
      {
        "id": "txt-intro-ru",
        "title": "Intro",
        "content": "<p>Привет! Добро пожаловать! От имени <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, мы рады приветствовать вас. Прежде всего, мы хотим поблагодарить вас за выбор этого приключения, в котором вы отправитесь сквозь время — от эпохи Рима до Валенсии XXI века, современного города, полного света и цвета. <i>В поисках сокровища</i> — это активность на свежем воздухе, самостоятельная, интерактивная и познавательная, идеальная для индивидуального или командного наслаждения. Мы также поощряем вас открывать для себя валенсийскую культуру и гастрономию в своём темпе, просто нажав кнопку паузы.</p><p><i>В поисках сокровища</i>, благодаря содержанию на нескольких языках, является также превосходным инструментом для практики языка, который вы изучаете, или даже для погружения в новый.</p><p>Под нашим девизом \"Выбор всегда и будет вашим\", мы предлагаем возможность двигаться в предпочтительном темпе, делать паузы при необходимости или даже превратить опыт в дружеское соревнование — кто первым завершит приключение. Когда решите, что пришло подходящее время, нажмите кнопку Начала и продолжайте выполнять наши задания, открывая для себя город. Каждая подсказка приведёт вас к новому месту с новыми загадками, которые откроют великолепные исторические и архитектурные сокровища Валенсии.</p><p>Чтобы ещё больше обогатить ваш опыт, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> призывает вас входить в доступные для посещения монументы как часть опыта этого Приключения — такие как музеи, рынки и многие другие интересные места, некоторые бесплатные, другие по символической цене, хотя входные билеты к последним не включены в приобретение этого приключения.</p><p>Если вам покажется уместным, нам было бы приятно начать это приключение с краткого введения в историю, расположение и гастрономию Валенсии. Это позволит нам получить общее представление о предстоящем маршруте.</p><p>Помните, что лимит этого приключения составляет <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 часов</mark></strong> с момента начала.</p><p>Это Приключение, которое вы собираетесь пережить, началось очень, очень давно. За несколько веков до прихода римлян место, где сейчас находится Валенсия, было занято иберийцами. Речь идёт о VI веке до нашей эры.</p><p>Это было очень давно, если вдуматься!</p><p>Несколько веков спустя, начиная с 138 года до нашей эры, и на протяжении всей своей истории она была интенсивно романизирована, получив название \"Valentia\".</p>\n<p>Однако последующее мусульманское влияние было ещё более значительным: конкретно, с 711 по 1238 год нашей эры. Это составляет в общей сложности около 500 лет.</p><p>Влияние было настолько велико, что население было преимущественно мусульманским. В этот период Валенсия называлась \"Balansiya\".</p><p>Лишь в 1238 году король Хайме I Арагонский отвоевал Валенсию, христианизировав город и превратив его в независимое королевство от Арагонского.</p>\n<p>Королевству Валенсия были дарованы \"Los Fueros\" (Привилегии), наделившие королевство собственной политической и правовой идентичностью.</p><p>Конец автономии региона пришёлся на время Филиппа V в XVIII в.</p>\n<p>В Войне за наследство валенсийский народ поддержал своего противника — эрцгерцога Карла.</p>\n<p>Филипп V, выиграв войну, упразднил Фуэросы и присоединил Валенсию к национальному управлению.</p>\n<p>В 1982 году Валенсия была провозглашена столицей Валенсийского сообщества.</p><p>Валенсия, столица Турии, в настоящее время является третьим по численности населения городом Испании. Она расположена на востоке Иберийского полуострова, на берегах реки Турия и омывается Средиземным морем, которое наделяет регион мягким климатом с тёплыми зимами и около 340 солнечными днями в году.</p><p>Что находится в окрестностях города?</p><p>Из Валенсии отправляются самые разнообразные маршруты, обустроенные для любителей велоспорта и природы. Примерно в десяти километрах к югу от города находится природный парк <strong>Albufera</strong> Валенсии.</p>\n<p><strong>Albufera</strong> — одно из крупнейших водно-болотных угодий Испании площадью 2100 гектаров, к которым добавляются 14 000 гектаров болотных угодий для выращивания риса — основной культуры города, наряду с чуфой, апельсином, мушмулой и хурмой.</p><p>Как вы можете предположить, валенсийская гастрономия вписывается в рамки средиземноморской диеты.</p>\n<p>Однако то, что характеризует валенсийскую кухню, — это использование риса и её всемирно известное фирменное блюдо: Паэлья.</p><p>Также исключительны тушёный угорь, all-i-pebre и богатейший чесночно-масляный соус, произносимый all-i-oli.</p><p>Среди местной выпечки выделяются turrón — рождественский десерт par excellence, arnadí de calabaza и знаменитая Orxata de Chufa, которая в виде гранита или жидкая, в сопровождении своих неотъемлемых \"Fartons\", станет настоящим наслаждением летних вечеров.</p><p>Теперь, когда вы немного узнали об истории и гастрономии нашего края, пришло время начать своё приключение. Наслаждайтесь! Ваше приключение начинается на <strong>Calle de los Serranos</strong>. Помните, что для продвижения по маршруту нужно делать паузу в каждой точке интереса, наблюдать указанное место или выполнять задание, а затем двигаться к следующему предложенному пункту и так далее. Всё готово к началу? Вперёд, удачи! Со <strong>Calle de los Serranos</strong>, направьте своё внимание в конец улицы и осмотрите башни, обозначенные на вашей карте под номером <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-ru",
        "title": "Intro",
        "content": "<p>Привет! Добро пожаловать! От имени <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, мы рады приветствовать вас. Прежде всего, мы хотим поблагодарить вас за выбор этого приключения, в котором вы отправитесь сквозь время — от эпохи Рима до Валенсии XXI века, современного города, полного света и цвета. <i>В поисках сокровища</i> — это активность на свежем воздухе, самостоятельная, интерактивная и познавательная, идеальная для индивидуального или командного наслаждения. Мы также поощряем вас открывать для себя валенсийскую культуру и гастрономию в своём темпе, просто нажав кнопку паузы.</p><p><i>В поисках сокровища</i>, благодаря содержанию на нескольких языках, является также превосходным инструментом для практики языка, который вы изучаете, или даже для погружения в новый.</p><p>Под нашим девизом \"Выбор всегда и будет вашим\", мы предлагаем возможность двигаться в предпочтительном темпе, делать паузы при необходимости или даже превратить опыт в дружеское соревнование — кто первым завершит приключение. Когда решите, что пришло подходящее время, нажмите кнопку Начала и продолжайте выполнять наши задания, открывая для себя город. Каждая подсказка приведёт вас к новому месту с новыми загадками, которые откроют великолепные исторические и архитектурные сокровища Валенсии.</p><p>Чтобы ещё больше обогатить ваш опыт, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> призывает вас входить в доступные для посещения монументы как часть опыта этого Приключения — такие как музеи, рынки и многие другие интересные места, некоторые бесплатные, другие по символической цене, хотя входные билеты к последним не включены в приобретение этого приключения.</p><p>Если вам покажется уместным, нам было бы приятно начать это приключение с краткого введения в историю, расположение и гастрономию Валенсии. Это позволит нам получить общее представление о предстоящем маршруте.</p><p>Помните, что лимит этого приключения составляет <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 часов</mark></strong> с момента начала.</p><p>Это Приключение, которое вы собираетесь пережить, началось очень, очень давно. За несколько веков до прихода римлян место, где сейчас находится Валенсия, было занято иберийцами. Речь идёт о VI веке до нашей эры.</p><p>Это было очень давно, если вдуматься!</p><p>Несколько веков спустя, начиная с 138 года до нашей эры, и на протяжении всей своей истории она была интенсивно романизирована, получив название \"Valentia\".</p>\n<p>Однако последующее мусульманское влияние было ещё более значительным: конкретно, с 711 по 1238 год нашей эры. Это составляет в общей сложности около 500 лет.</p><p>Влияние было настолько велико, что население было преимущественно мусульманским. В этот период Валенсия называлась \"Balansiya\".</p><p>Лишь в 1238 году король Хайме I Арагонский отвоевал Валенсию, христианизировав город и превратив его в независимое королевство от Арагонского.</p>\n<p>Королевству Валенсия были дарованы \"Los Fueros\" (Привилегии), наделившие королевство собственной политической и правовой идентичностью.</p><p>Конец автономии региона пришёлся на время Филиппа V в XVIII в.</p>\n<p>В Войне за наследство валенсийский народ поддержал своего противника — эрцгерцога Карла.</p>\n<p>Филипп V, выиграв войну, упразднил Фуэросы и присоединил Валенсию к национальному управлению.</p>\n<p>В 1982 году Валенсия была провозглашена столицей Валенсийского сообщества.</p><p>Валенсия, столица Турии, в настоящее время является третьим по численности населения городом Испании. Она расположена на востоке Иберийского полуострова, на берегах реки Турия и омывается Средиземным морем, которое наделяет регион мягким климатом с тёплыми зимами и около 340 солнечными днями в году.</p><p>Что находится в окрестностях города?</p><p>Из Валенсии отправляются самые разнообразные маршруты, обустроенные для любителей велоспорта и природы. Примерно в десяти километрах к югу от города находится природный парк <strong>Albufera</strong> Валенсии.</p>\n<p><strong>Albufera</strong> — одно из крупнейших водно-болотных угодий Испании площадью 2100 гектаров, к которым добавляются 14 000 гектаров болотных угодий для выращивания риса — основной культуры города, наряду с чуфой, апельсином, мушмулой и хурмой.</p><p>Как вы можете предположить, валенсийская гастрономия вписывается в рамки средиземноморской диеты.</p>\n<p>Однако то, что характеризует валенсийскую кухню, — это использование риса и её всемирно известное фирменное блюдо: Паэлья.</p><p>Также исключительны тушёный угорь, all-i-pebre и богатейший чесночно-масляный соус, произносимый all-i-oli.</p><p>Среди местной выпечки выделяются turrón — рождественский десерт par excellence, arnadí de calabaza и знаменитая Orxata de Chufa, которая в виде гранита или жидкая, в сопровождении своих неотъемлемых \"Fartons\", станет настоящим наслаждением летних вечеров.</p><p>Теперь, когда вы немного узнали об истории и гастрономии нашего края, пришло время начать своё приключение. Наслаждайтесь! Ваше приключение начинается на <strong>Calle de los Serranos</strong>. Помните, что для продвижения по маршруту нужно делать паузу в каждой точке интереса, наблюдать указанное место или выполнять задание, а затем двигаться к следующему предложенному пункту и так далее. Всё готово к началу? Вперёд, удачи! Со <strong>Calle de los Serranos</strong>, направьте своё внимание в конец улицы и осмотрите башни, обозначенные на вашей карте под номером <mark>1</mark>.</p>"
      }
    ],
    "uk": [
      {
        "id": "txt-intro-uk",
        "title": "Intro",
        "content": "<p>Привіт! Доброго дня! Від <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, ласкаво просимо. Насамперед, хочемо подякувати Вам за вибір цієї пригоди, в якій Ви вирушите крізь час — від римської доби до Валенсії XXI сторіччя, сучасного міста, повного світла та кольору. <i>у пошуках скарбу</i> — це просто неба, самостійно керована, інтерактивна та дидактична діяльність, ідеальна для насолоди як індивідуально, так і в команді. Ми також заохочуємо Вас відкривати валенсійську культуру та гастрономію у власному темпі, просто натискаючи кнопку паузи.</p><p><i>У пошуках скарбу</i>, завдяки контенту, доступному кількома мовами, є також чудовим інструментом для практики мови, яку Ви вивчаєте, або навіть для занурення в нову.</p><p>Під нашим девізом \"Вибір був і залишатиметься завжди Вашим\", ми пропонуємо можливість просуватися у темпі, який Вам подобається, робити паузи, коли це потрібно, або навіть перетворити досвід на дружне змагання, щоб побачити, хто першим завершить пригоду. Коли вирішите, що настав потрібний момент, натисніть кнопку Початок і продовжуйте виконувати наші завдання, відкриваючи місто. Кожна підказка приведе Вас до нового місця призначення з новими загадками, які відкриють чудові історичні та архітектурні скарби Валенсії.</p><p>Щоб збагатити Ваш досвід ще більше, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> спонукає Вас відвідати доступні для огляду пам'ятники як частину досвіду цієї Пригоди: музеї, ринки та багато інших цікавих місць, деякі безкоштовні, а інші за символічну плату, хоча вхідні квитки до останніх не включені до придбання цієї пригоди.</p><p>Якщо Вам так здається доречним, нам буде приємно розпочати цю пригоду з короткого вступу до історії, розташування та гастрономії Валенсії. Це дозволить нам отримати загальне уявлення про маршрут, що нас чекає.</p><p>Пам'ятайте, що ліміт цієї пригоди становить <strong><mark style='font-size:1.4em; padding:0 0.15em;'>60 годин</mark></strong> від початку.</p><p>Ця Пригода, яку Ви збираєтесь пережити, розпочалась дуже, дуже давно. За кілька сторіч до приходу римлян місце, де зараз знаходиться Валенсія, було зайняте іберами. Ми говоримо про шосте сторіччя до н.е.</p><p>Це дуже давно, якщо задуматись!</p><p>Через кілька сторіч, починаючи з 138 року до н.е., і впродовж своєї історії місто інтенсивно романізувалося, отримавши назву \"Valentia\".</p>\n<p>Однак подальший мусульманський вплив був навіть більшим — конкретно з 711 по 1238 рік н.е. Це загалом близько 500 років.</p><p>Вплив був настільки значним, що населення було переважно мусульманським. За цей час Валенсія отримала назву \"Balansiya\".</p><p>Лише у 1238 році король Хайме Перший Арагонський відвоював Валенсію, охристиянивши місто та перетворивши його на незалежне королівство від Арагонського королівства.</p>\n<p>Королівству Валенсія були передані \"Los Fueros\", наділивши королівство власною політичною та юридичною ідентичністю.</p><p>Кінець автономії регіону настав з Філіпом V у XVIII ст.</p>\n<p>У Війні за іспадщину валенсійський народ підтримав свого ворога — ерцгерцога Карла.</p>\n<p>Філіп V, перемігши у війні, скасував Fueros та об'єднав Валенсію з національним урядом.</p>\n<p>У 1982 році Валенсія була названа Столицею Валенсійської спільноти.</p><p>Валенсія, столиця Турії, є наразі третім за чисельністю населення містом Іспанії. Розташована на сході Іберійського півострова, на берегах річки Турія та омивається Середземним морем, яке наділяє регіон помірним кліматом з м'якою зимою та близько 340 сонячними днями на рік.</p><p>Що є в околицях міста?</p><p>З Валенсії відходить велика різноманітність маршрутів для любителів велоспорту та природи. Приблизно в десяти кілометрах на південь від міста знаходиться природний парк <strong>Albufera</strong> Валенсії.</p>\n<p><strong>Albufera</strong> — одне з найбільших водно-болотних угідь Іспанії з площею 2100 гектарів, до яких слід додати 14 000 гектарів болотистих угідь, відведених під вирощування рису — головної культури міста, разом із чуфою, апельсином, мушмулою та хурмою.</p><p>Як Ви можете здогадатись, валенсійська гастрономія вписується в рамки середземноморської дієти.</p>\n<p>Однак те, що характеризує валенсійську кухню, — це використання рису та її зіркова страва, відома в усьому світі, — Паелья.</p><p>Також виняткові страви: тушкований вугор, all-i-pebre та надзвичайно смачний часниковий соус, вимовляється all-i-oli.</p><p>Серед місцевих кондитерських виробів виділяється тюрон — різдвяний десерт par excellence, arnadí de calabaza та знаменита Orxata de Chufa, яка у замороженому або рідкому вигляді в поєднанні зі своїми невіддільними \"Fartons\" стане справжньою насолодою літніх вечорів.</p><p>Тепер, коли Ви вже дещо дізналися про історію та гастрономію нашого краю, час починати пригоду. Насолоджуйтесь нею! Ваша пригода починається на <strong>Calle de los Serranos</strong>. Пам'ятайте, що для просування маршрутом Вам потрібно зупинятись у кожній визначній пам'ятці, спостерігати вказане місце або виконувати завдання, а потім продовжувати до наступного запропонованого місця призначення і так далі. Все готово розпочати? Вперед, удачі! З <strong>Calle de los Serranos</strong> зверніть увагу на кінець вулиці та роздивіться вежі, що на Вашій карті позначено числом <mark>1</mark>.</p>"
      },
      {
        "id": "txt-intro-uk",
        "title": "Intro",
        "content": "<p>Привіт! Доброго дня! Від <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>, ласкаво просимо. Насамперед, хочемо подякувати Вам за вибір цієї пригоди, в якій Ви вирушите крізь час — від римської доби до Валенсії XXI сторіччя, сучасного міста, повного світла та кольору. <i>у пошуках скарбу</i> — це просто неба, самостійно керована, інтерактивна та дидактична діяльність, ідеальна для насолоди як індивідуально, так і в команді. Ми також заохочуємо Вас відкривати валенсійську культуру та гастрономію у власному темпі, просто натискаючи кнопку паузи.</p><p><i>У пошуках скарбу</i>, завдяки контенту, доступному кількома мовами, є також чудовим інструментом для практики мови, яку Ви вивчаєте, або навіть для занурення в нову.</p><p>Під нашим девізом \"Вибір був і залишатиметься завжди Вашим\", ми пропонуємо можливість просуватися у темпі, який Вам подобається, робити паузи, коли це потрібно, або навіть перетворити досвід на дружне змагання, щоб побачити, хто першим завершить пригоду. Коли вирішите, що настав потрібний момент, натисніть кнопку Початок і продовжуйте виконувати наші завдання, відкриваючи місто. Кожна підказка приведе Вас до нового місця призначення з новими загадками, які відкриють чудові історичні та архітектурні скарби Валенсії.</p><p>Щоб збагатити Ваш досвід ще більше, <img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'> спонукає Вас відвідати доступні для огляду пам'ятники як частину досвіду цієї Пригоди: музеї, ринки та багато інших цікавих місць, деякі безкоштовні, а інші за символічну плату, хоча вхідні квитки до останніх не включені до придбання цієї пригоди.</p><p>Якщо Вам так здається доречним, нам буде приємно розпочати цю пригоду з короткого вступу до історії, розташування та гастрономії Валенсії. Це дозволить нам отримати загальне уявлення про маршрут, що нас чекає.</p><p>Пам'ятайте, що ліміт цієї пригоди становить <strong><mark style='font-size:1.4em; padding:0 0.15em;'>150 годин</mark></strong> від початку.</p><p>Ця Пригода, яку Ви збираєтесь пережити, розпочалась дуже, дуже давно. За кілька сторіч до приходу римлян місце, де зараз знаходиться Валенсія, було зайняте іберами. Ми говоримо про шосте сторіччя до н.е.</p><p>Це дуже давно, якщо задуматись!</p><p>Через кілька сторіч, починаючи з 138 року до н.е., і впродовж своєї історії місто інтенсивно романізувалося, отримавши назву \"Valentia\".</p>\n<p>Однак подальший мусульманський вплив був навіть більшим — конкретно з 711 по 1238 рік н.е. Це загалом близько 500 років.</p><p>Вплив був настільки значним, що населення було переважно мусульманським. За цей час Валенсія отримала назву \"Balansiya\".</p><p>Лише у 1238 році король Хайме Перший Арагонський відвоював Валенсію, охристиянивши місто та перетворивши його на незалежне королівство від Арагонського королівства.</p>\n<p>Королівству Валенсія були передані \"Los Fueros\", наділивши королівство власною політичною та юридичною ідентичністю.</p><p>Кінець автономії регіону настав з Філіпом V у XVIII ст.</p>\n<p>У Війні за іспадщину валенсійський народ підтримав свого ворога — ерцгерцога Карла.</p>\n<p>Філіп V, перемігши у війні, скасував Fueros та об'єднав Валенсію з національним урядом.</p>\n<p>У 1982 році Валенсія була названа Столицею Валенсійської спільноти.</p><p>Валенсія, столиця Турії, є наразі третім за чисельністю населення містом Іспанії. Розташована на сході Іберійського півострова, на берегах річки Турія та омивається Середземним морем, яке наділяє регіон помірним кліматом з м'якою зимою та близько 340 сонячними днями на рік.</p><p>Що є в околицях міста?</p><p>З Валенсії відходить велика різноманітність маршрутів для любителів велоспорту та природи. Приблизно в десяти кілометрах на південь від міста знаходиться природний парк <strong>Albufera</strong> Валенсії.</p>\n<p><strong>Albufera</strong> — одне з найбільших водно-болотних угідь Іспанії з площею 2100 гектарів, до яких слід додати 14 000 гектарів болотистих угідь, відведених під вирощування рису — головної культури міста, разом із чуфою, апельсином, мушмулою та хурмою.</p><p>Як Ви можете здогадатись, валенсійська гастрономія вписується в рамки середземноморської дієти.</p>\n<p>Однак те, що характеризує валенсійську кухню, — це використання рису та її зіркова страва, відома в усьому світі, — Паелья.</p><p>Також виняткові страви: тушкований вугор, all-i-pebre та надзвичайно смачний часниковий соус, вимовляється all-i-oli.</p><p>Серед місцевих кондитерських виробів виділяється тюрон — різдвяний десерт par excellence, arnadí de calabaza та знаменита Orxata de Chufa, яка у замороженому або рідкому вигляді в поєднанні зі своїми невіддільними \"Fartons\" стане справжньою насолодою літніх вечорів.</p><p>Тепер, коли Ви вже дещо дізналися про історію та гастрономію нашого краю, час починати пригоду. Насолоджуйтесь нею! Ваша пригода починається на <strong>Calle de los Serranos</strong>. Пам'ятайте, що для просування маршрутом Вам потрібно зупинятись у кожній визначній пам'ятці, спостерігати вказане місце або виконувати завдання, а потім продовжувати до наступного запропонованого місця призначення і так далі. Все готово розпочати? Вперед, удачі! З <strong>Calle de los Serranos</strong> зверніть увагу на кінець вулиці та роздивіться вежі, що на Вашій карті позначено числом <mark>1</mark>.</p>"
      }
    ]
  },
  "aventuras": {
    "Aventura1": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 0
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av1-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      }
    },
    "Aventura2": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 0
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av2-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      }
    },
    "Aventura3": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 0
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av3-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      }
    },
    "Aventura4": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 0
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av4-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      }
    },
    "Aventura5": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 0
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av5-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      }
    },
    "AventuraFallas": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 0
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-AvFallas-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 0
      }
    },
    "Aventura34km": {
      "es": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-es",
          "tipo": "opcion",
          "pregunta": "¿Cuántas aventuras pueden hacerse con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": {
          "id": "audio-intro-es",
          "title": "Intro",
          "file": "publico/audios/español/01-Intro-ESPAÑOL-1.mp3"
        },
        "tieneAudio": true,
        "textoIntro": 1
      },
      "en": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-en",
          "tipo": "opcion",
          "pregunta": "How many adventures can be done with Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "fr": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-fr",
          "tipo": "opcion",
          "pregunta": "Combien d'aventures peut-on faire avec Valencia be Guides ?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "it": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-it",
          "tipo": "opcion",
          "pregunta": "Quante avventure si possono fare con Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "nl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-nl",
          "tipo": "opcion",
          "pregunta": "Hoeveel avonturen kunt u beleven met Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "ja": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-ja",
          "tipo": "opcion",
          "pregunta": "Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "de": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-de",
          "tipo": "opcion",
          "pregunta": "Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "zh": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-zh",
          "tipo": "opcion",
          "pregunta": "使用Valencia be Guides可以进行多少次冒险？",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "pl": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-pl",
          "tipo": "opcion",
          "pregunta": "Ile przygód można przeżyć z Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "pt": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-pt",
          "tipo": "opcion",
          "pregunta": "Quantas aventuras podem ser feitas com Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "ru": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-ru",
          "tipo": "opcion",
          "pregunta": "Сколько приключений можно совершить с Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      },
      "uk": {
        "retoR1": {
          "reto": 1,
          "id": "R1-Av34km-uk",
          "tipo": "opcion",
          "pregunta": "Скільки пригод можна здійснити з Valencia be Guides?",
          "opciones": [
            "4",
            "5",
            "6",
            "7"
          ],
          "correctas": [
            "7"
          ],
          "multiple": false
        },
        "audioIntro": null,
        "tieneAudio": false,
        "textoIntro": 1
      }
    }
  }
};
